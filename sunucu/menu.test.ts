import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import type { MenuYayinYaniti, MenuYaniti, YonetimMenuYaniti } from '../lib/menu/aktarim.ts'
import { menuBelgesiDogrula } from '../lib/menu/dogrulama.ts'
import type { MenuBelgesi } from '../lib/menu/tipler.ts'
import { bellekDepoKur } from './bellekDepo.ts'
import type { Depo } from './depo.ts'
import { listeKur } from './ip.ts'
import { MENU_GOVDE_SINIRI } from './menu.ts'
import { uygulamaKur, type Ayar } from './uygulama.ts'

/* Menü uçları (bellek depo, kendi sunucusu ve saati): yayın, sürüm denetimi, geri alma, IP istisnası. */
const KOKEN = 'https://cigercibozo.com'
const SEED_DOSYASI = new URL('../content/menu.varsayilan.json', import.meta.url)
const SEED = JSON.parse(readFileSync(SEED_DOSYASI, 'utf8')) as MenuBelgesi
const kimlik = `Basic ${Buffer.from('personel:gizli').toString('base64')}`
const yonetim = { Authorization: kimlik }
const hatalar: unknown[][] = []

let saat = Date.parse('2026-10-26T12:00:00+03:00')
let depo: Depo
let sunucu: Server
let kok = ''

const AYAR: Ayar = {
  kokenler: [KOKEN],
  tuz: 'test-tuzu',
  yonetim: { kullanici: 'personel', sifre: 'gizli' },
  guvenilirVekil: listeKur(['127.0.0.1', '::1']),
  kampanyaBitis: null,
}

async function sunucuAc(ayar: Ayar, depoyu: Depo, simdi: () => number): Promise<{ sunucu: Server; kok: string }> {
  const uygulama = uygulamaKur(depoyu, ayar, simdi, { warn() {}, error: (...a: unknown[]) => void hatalar.push(a) })
  const s = createServer((req, res) => void uygulama.isle(req, res))
  await new Promise<void>((coz) => s.listen(0, '127.0.0.1', coz))
  const adres = s.address()
  if (!adres || typeof adres === 'string') throw new Error('adres yok')
  return { sunucu: s, kok: `http://127.0.0.1:${adres.port}` }
}

before(async () => {
  depo = bellekDepoKur()
  ;({ sunucu, kok } = await sunucuAc(AYAR, depo, () => saat))
})

after(() => sunucu.close())

type Secenek = { yontem?: string; govde?: unknown; basliklar?: Record<string, string> }

async function istek(yol: string, { yontem = 'GET', govde, basliklar = {} }: Secenek = {}) {
  const b = { ...basliklar, ...(govde === undefined ? {} : { 'Content-Type': 'application/json' }) }
  const body = govde === undefined ? undefined : JSON.stringify(govde)
  const yanit = await fetch(kok + yol, { method: yontem, headers: b, body })
  const metin = await yanit.text()
  const okunan = (metin ? JSON.parse(metin) : null) as Record<string, unknown> | null
  return { durum: yanit.status, govde: okunan, basliklar: yanit.headers }
}

const belge = (fiyat: number): MenuBelgesi => ({
  ...SEED,
  kalemler: SEED.kalemler.map((k, i) => (i === 0 ? { ...k, fiyatlar: { ...k.fiyatlar, porsiyon: fiyat } } : k)),
})
/** 1. sürüm biçimi: duyuru, ikramlar ve iletisim bölümleri yok (depo belgeyi doğrulamadan saklar). */
const birinciSurum = (b: MenuBelgesi): MenuBelgesi => {
  const { duyuru: _d, ikramlar: _i, iletisim: _t, ...eski } = structuredClone(b)
  return eski as unknown as MenuBelgesi
}
const yayinla = (taban: number | null, b: unknown) =>
  istek('/yonetim/menu', { yontem: 'PUT', govde: { taban, belge: b }, basliklar: yonetim })
const yonetimMenu = async () =>
  (await istek('/yonetim/menu', { basliklar: yonetim })).govde as unknown as YonetimMenuYaniti
const gecerliFiyat = async () =>
  ((await istek('/menu')).govde as unknown as MenuYaniti).belge.kalemler[0]?.fiyatlar.porsiyon

// Testler sırayla ve aynı depoyu paylaşır: ilki boş depoyu, sonrakiler öncekilerin sürümlerini görür.
test('getMenu_surumYok_204', async () => {
  const y = await istek('/menu')
  assert.equal(y.durum, 204)
  assert.equal(y.govde, null)
})

test('putYonetimMenu_kimliksiz_401', async () => {
  const y = await istek('/yonetim/menu', { yontem: 'PUT', govde: { taban: null, belge: SEED } })
  assert.equal(y.durum, 401)
  assert.equal((await istek('/yonetim/menu')).durum, 401)
  assert.equal((await istek('/yonetim/menu/1/geri-al', { yontem: 'POST', govde: { taban: 1 } })).durum, 401)
})

test('putYonetimMenu_gecersizBelge_400', async () => {
  for (const kotu of [belge(100000), belge(0), belge(85.5), { kalemler: 'x' }, null]) {
    const y = await yayinla(null, kotu)
    assert.deepEqual([y.durum, y.govde?.hata], [400, 'belgeGecersiz'], JSON.stringify(kotu)?.slice(0, 40))
  }
  const tabansiz = await istek('/yonetim/menu', { yontem: 'PUT', govde: { belge: SEED }, basliklar: yonetim })
  assert.deepEqual([tabansiz.durum, tabansiz.govde?.hata], [400, 'tabanGecersiz'])
  assert.equal((await yonetimMenu()).gecerli, null, 'reddedilen yayın sürüm bırakmaz')
})

test('putYonetimMenu_gecerli_200VeGetteGorunur', async () => {
  const ilk = await yayinla(null, belge(700))
  assert.equal(ilk.durum, 200)
  const surum = (ilk.govde as unknown as MenuYayinYaniti).surum
  const get = await istek('/menu')
  assert.equal(get.durum, 200)
  assert.equal(get.basliklar.get('cache-control'), 'public, max-age=15')
  assert.equal((get.govde as unknown as MenuYaniti).surum, surum)
  assert.equal(await gecerliFiyat(), 700)
  // Önbellek dolu; yeni yayın onu boşaltır, 15 sn beklemeden yeni fiyat görünür.
  const ikinci = await yayinla(surum, belge(710))
  assert.equal(ikinci.durum, 200)
  assert.equal(await gecerliFiyat(), 710)
  const yonet = await yonetimMenu()
  assert.equal(yonet.gecerli?.surum, (ikinci.govde as unknown as MenuYayinYaniti).surum)
  assert.deepEqual(yonet.surumler.map((s) => s.kaynak), ['panel', 'panel'])
  assert.equal(yonet.surumler[0]?.olusturma, new Date(saat).toISOString())
})

test('getMenu_onbellek_onBesSaniyeSonraDepodanYenilenir', async () => {
  const bas = (await yonetimMenu()).gecerli
  assert.ok(bas)
  await istek('/menu')
  // Depoya doğrudan yazılan sürüm, önbellek süresi dolana kadar görünmez.
  await depo.menuYayinla(belge(715), 'panel', saat, bas.surum)
  assert.equal(await gecerliFiyat(), 710)
  saat += 16_000
  assert.equal(await gecerliFiyat(), 715)
})

test('getMenu_yayindan_sonra_200VeBelge', async () => {
  const taban = (await yonetimMenu()).gecerli?.surum ?? null
  // Ayrık (NFD) yazılmış ad: dönen belge ham gövde değil, doğrulayıcının normalleştirdiği belge olmalı.
  const girdi = {
    ...SEED,
    kalemler: SEED.kalemler.map((k, i) => (i === 0 ? { ...k, ad: { tr: 's\u0327is', en: 'Skewer' } } : k)),
  }
  const beklenen = menuBelgesiDogrula(girdi)
  assert.ok(beklenen.tamam)
  const y = await yayinla(taban, girdi)
  assert.equal(y.durum, 200)
  const get = await istek('/menu')
  assert.equal(get.durum, 200)
  assert.deepEqual(get.govde, { surum: (y.govde as unknown as MenuYayinYaniti).surum, belge: beklenen.belge })
})

test('putYonetimMenu_tabanEski_409', async () => {
  const guncel = (await yonetimMenu()).gecerli?.surum ?? -1
  const y = await yayinla(guncel - 1, belge(720))
  assert.deepEqual([y.durum, y.govde?.hata], [409, 'surumEskidi'])
  const tabansiz = await yayinla(null, belge(720))
  assert.deepEqual([tabansiz.durum, tabansiz.govde?.hata], [409, 'surumEskidi'])
  assert.equal((await yonetimMenu()).gecerli?.surum, guncel, 'eski taban sessizce ezmez')
})

test('putYonetimMenu_hamGovdeDegilNormalBelgeSaklanir', async () => {
  const guncel = (await yonetimMenu()).gecerli?.surum ?? -1
  const ayrik = 'Cigeri'.replace('i', 'i̇') // i + birleşik nokta: NFC'de tek harfe inmez, ama s + cedilla iner
  const ad = { tr: 'şis ' + ayrik, en: 'Skewer' }
  const kalemler = SEED.kalemler.map((k, i) => (i === 0 ? { ...k, ad } : k))
  assert.equal((await yayinla(guncel, { ...SEED, kalemler })).durum, 200)
  const saklanan = (await istek('/menu')).govde as unknown as MenuYaniti
  assert.equal(saklanan.belge.kalemler[0]?.ad.tr, ad.tr.normalize('NFC'))
  assert.notEqual(saklanan.belge.kalemler[0]?.ad.tr, ad.tr)
})

test('postGeriAl_eskiSurum_yeniSurumOlarakYayinlanir', async () => {
  const oncesi = await yonetimMenu()
  const eski = oncesi.surumler.at(-1)
  assert.ok(eski && oncesi.gecerli)
  const y = await istek(`/yonetim/menu/${eski.id}/geri-al`, {
    yontem: 'POST', govde: { taban: oncesi.gecerli.surum }, basliklar: yonetim,
  })
  assert.equal(y.durum, 200)
  const yeni = (y.govde as unknown as MenuYayinYaniti).surum
  assert.ok(yeni > oncesi.gecerli.surum, 'eski kimlik geri gelmez, yeni sürüm olur')
  const sonra = await yonetimMenu()
  assert.deepEqual([sonra.surumler[0]?.id, sonra.surumler[0]?.kaynak], [yeni, 'geriAl'])
  assert.equal(await gecerliFiyat(), 700)
  const bayat = await istek(`/yonetim/menu/${eski.id}/geri-al`, {
    yontem: 'POST', govde: { taban: oncesi.gecerli.surum }, basliklar: yonetim,
  })
  assert.deepEqual([bayat.durum, bayat.govde?.hata], [409, 'surumEskidi'])
})

test('getYonetimMenuSurum_kimliksiz_401', async () => {
  assert.equal((await istek('/yonetim/menu/1')).durum, 401)
})

test('getYonetimMenuSurum_olmayanId_404', async () => {
  const y = await istek('/yonetim/menu/999999', { basliklar: yonetim })
  assert.deepEqual([y.durum, y.govde?.hata], [404, 'surumYok'])
})

test('getYonetimMenuSurum_kayitliSurum_200VeSaklananBelge', async () => {
  const eski = (await yonetimMenu()).surumler.at(-1)
  assert.ok(eski)
  const y = await istek(`/yonetim/menu/${eski.id}`, { basliklar: yonetim })
  const govde = y.govde as unknown as MenuYaniti
  assert.equal(y.durum, 200)
  assert.equal(govde.surum, eski.id)
  assert.equal(govde.belge.kalemler[0]?.fiyatlar.porsiyon, 700)
})

test('postGeriAl_bolumsuzBirinciSurum_tamamlanmisYayinlanir', async () => {
  const taban = (await yonetimMenu()).gecerli?.surum ?? null
  const eski = birinciSurum(SEED)
  eski.kalemler[0]!.fiyatlar.porsiyon = 640
  const birinci = await depo.menuYayinla(eski, 'panel', saat, taban)
  assert.ok(birinci !== null)
  const guncel = menuBelgesiDogrula({
    ...SEED, iletisim: { ...SEED.iletisim, eposta: 'yeni@cigercibozo.com' },
  })
  assert.ok(guncel.tamam)
  const sonTaban = await depo.menuYayinla(guncel.belge, 'panel', saat, birinci)
  assert.ok(sonTaban !== null)
  const y = await istek(`/yonetim/menu/${birinci}/geri-al`, {
    yontem: 'POST', govde: { taban: sonTaban }, basliklar: yonetim,
  })
  assert.equal(y.durum, 200)
  saat += 16_000
  const sonra = ((await istek('/menu')).govde as unknown as MenuYaniti).belge
  assert.equal(sonra.kalemler[0]?.fiyatlar.porsiyon, 640, 'eski sürümün fiyatı döner')
  assert.equal(sonra.iletisim.eposta, 'yeni@cigercibozo.com', 'bölümler şu anki sürümden gelir')
  assert.deepEqual(sonra.ikramlar, SEED.ikramlar)
})

test('postGeriAl_gecerliSurumBolumsuz_409GecerliSurumEski', async () => {
  const taban = (await yonetimMenu()).gecerli?.surum ?? null
  const eski = await depo.menuYayinla(birinciSurum(SEED), 'panel', saat, taban)
  assert.ok(eski !== null)
  const guncel = await depo.menuYayinla(birinciSurum(SEED), 'panel', saat, eski)
  assert.ok(guncel !== null)
  const oncesi = (await yonetimMenu()).surumler.length
  const y = await istek(`/yonetim/menu/${eski}/geri-al`, {
    yontem: 'POST', govde: { taban: guncel }, basliklar: yonetim,
  })
  assert.deepEqual([y.durum, y.govde?.hata], [409, 'gecerliSurumEski'])
  assert.equal((await yonetimMenu()).surumler.length, oncesi, 'sürüm yayınlanmaz')
  assert.equal(hatalar.length, 0, '500 değil, beklenen durum')
  // Sonraki testler v2 bir güncel sürüm ister: panelden bir kez tam belge yayınlanır.
  assert.equal((await yayinla(guncel, SEED)).durum, 200)
})

test('postGeriAl_olmayanId_404', async () => {
  const taban = (await yonetimMenu()).gecerli?.surum ?? null
  const y = await istek('/yonetim/menu/999999/geri-al', { yontem: 'POST', govde: { taban }, basliklar: yonetim })
  assert.deepEqual([y.durum, y.govde?.hata], [404, 'surumYok'])
})

test('postGeriAl_kayitliSurumGecersiz_500VeLoglanir', async () => {
  const taban = (await yonetimMenu()).gecerli?.surum ?? null
  const bozuk = await depo.menuYayinla(belge(100000), 'panel', saat, taban)
  assert.ok(bozuk !== null)
  const sonTaban = (await yonetimMenu()).gecerli?.surum ?? null
  const govde = { taban: sonTaban }
  const y = await istek(`/yonetim/menu/${bozuk}/geri-al`, { yontem: 'POST', govde, basliklar: yonetim })
  assert.deepEqual([y.durum, y.govde?.hata], [500, 'sunucu'])
  assert.equal(hatalar.length, 1)
  assert.equal((await yonetimMenu()).gecerli?.surum, sonTaban, 'bozuk sürüm yeniden yayınlanmaz')
  hatalar.length = 0
})

test('getMenu_700IstekSonrasi_hala200', async () => {
  const durumlar: number[] = []
  for (let parti = 0; parti < 14; parti++) {
    durumlar.push(...(await Promise.all(Array.from({ length: 50 }, () => istek('/menu')))).map((y) => y.durum))
  }
  assert.equal(durumlar.length, 700)
  assert.ok(durumlar.every((d) => d === 200), 'restoran wifi\'si tek IP: hiçbir menü isteği 429 almaz')
  assert.equal((await istek('/menu')).durum, 200)
})

test('ipSiniri_menuIstisnasiDigerUclariKorur', async () => {
  // Menü istekleri genel kovaya girmedi; öbür uçlar 600/saatte kesilir (önceki testler de pencerede sayılır).
  let durum = 0
  for (let i = 0; i < 700 && durum !== 429; i++) durum = (await istek('/yok')).durum
  assert.equal(durum, 429)
  assert.equal((await istek('/menu')).durum, 200)
})

test('getMenu_ayriKovaLimitiAsilinca_429_pencereGecinceYeniden', async () => {
  let an = Date.parse('2026-10-26T12:00:00+03:00')
  const kucuk = await sunucuAc({ ...AYAR, menuSaatlik: 5 }, bellekDepoKur(), () => an)
  try {
    const al = (yol: string) => fetch(kucuk.kok + yol).then(async (y) => (await y.arrayBuffer(), y.status))
    for (let i = 0; i < 5; i++) assert.equal(await al('/menu'), 204, `istek ${i}`)
    assert.equal(await al('/menu'), 429)
    assert.equal(await al('/yok'), 404, 'menü kovası genel kovadan ayrı')
    an += 60 * 60_000 + 1
    assert.equal(await al('/menu'), 204)
  } finally {
    kucuk.sunucu.close()
  }
})

test('optionsMenu_corsPutIzinli', async () => {
  const on = await fetch(kok + '/yonetim/menu', {
    method: 'OPTIONS',
    headers: { Origin: KOKEN, 'Access-Control-Request-Method': 'PUT' },
  })
  assert.equal(on.status, 204)
  assert.match(on.headers.get('access-control-allow-methods') ?? '', /\bPUT\b/)
  assert.equal(on.headers.get('access-control-allow-origin'), KOKEN)
})

/** Her sınırda en uzun geçerli belge; `harf` bir UTF-8 baytı (a), iki (ş) ya da üç (€) tutar. */
function enBuyukBelge(harf: string, olcuSayisi: number): MenuBelgesi {
  const m = (n: number) => harf.repeat(n)
  const c = (n: number) => ({ tr: m(n), en: m(n) })
  const kimlik40 = (on: string, n: number) => `${on}${String(n).padStart(3, '0')}`.padEnd(40, 'x')
  const foto = SEED.kalemler.find((k) => k.fotoId !== null)?.fotoId ?? null
  return {
    kalemler: Array.from({ length: 40 }, (_, n) => ({
      id: n === 0 ? 'ciger' : kimlik40('k', n), ad: c(60), aciklama: c(240),
      fiyatlar: { porsiyon: 99999, durum: 99999 },
      porsiyonNotu: c(40), durumNotu: c(40), fotoId: foto, tukendi: true,
    })),
    ozel: { ad: c(60), miktarNotu: c(40), aciklama: c(240), fiyat: 99999 },
    icecekler: Array.from({ length: 30 }, (_, n) => ({
      id: kimlik40('i', n), ad: c(60), tukendi: true,
      olculer: Array.from({ length: olcuSayisi }, () => ({ ad: c(60), fiyat: 99999 })),
    })),
    duyuru: { aktif: true, metin: c(140), bitis: '2026-12-31T23:59' },
    ikramlar: {
      altMetin: c(120),
      urunler: Array.from({ length: 12 }, (_, n) => (
        { id: kimlik40('u', n), ad: c(60), aciklama: c(240), fotoId: foto }
      )),
      gruplar: Array.from({ length: 8 }, (_, g) => ({
        id: kimlik40('g', g), ad: c(60), not: c(60),
        ogeler: Array.from({ length: 10 }, (_, o) => ({ id: kimlik40(`o${g}`, o), ad: c(60) })),
      })),
    },
    iletisim: {
      telefonAcik: true, telefon: '+90 533 888 74 24', eposta: `${'a'.repeat(90)}@bozo.com`,
      instagram: 'a'.repeat(40), facebook: 'a'.repeat(40), tiktok: 'a'.repeat(40), googleYorumKodu: 'a'.repeat(40),
    },
  }
}

// Ölçüm (26 Ekim 2026, tüm alanlar azami uzunlukta, 5 ölçü): ASCII 99,8 KB, Türkçe harfle 171,7 KB. 64 KB yetmez.
test('putYonetimMenu_enBuyukGecerliBelge_64KBiAsar', () => {
  const belge = enBuyukBelge('a', 5)
  assert.equal(menuBelgesiDogrula(belge).tamam, true, 'belge sınırlarda geçerli olmalı')
  const bayt = Buffer.byteLength(JSON.stringify({ taban: 1_000_000, belge }))
  assert.ok(bayt > 64 * 1024 && bayt < MENU_GOVDE_SINIRI, `gövde ${bayt} bayt`)
})

/** Önceki testler IP kovasını doldurdu: gövde sınırı testleri kendi sunucusunda koşar. */
async function tazeSunucudaPost(
  yol: string, yontem: string, govde: unknown,
): Promise<{ durum: number; hata: unknown }> {
  const taze = await sunucuAc(AYAR, bellekDepoKur(), () => saat)
  try {
    const y = await fetch(taze.kok + yol, {
      method: yontem, body: JSON.stringify(govde), headers: { ...yonetim, 'Content-Type': 'application/json' },
    })
    const okunan = (await y.json()) as { hata?: unknown }
    return { durum: y.status, hata: okunan.hata }
  } finally {
    taze.sunucu.close()
  }
}

test('putYonetimMenu_100KBGovde_200_128KBUstu_413', async () => {
  const yuz = await tazeSunucudaPost('/yonetim/menu', 'PUT', { taban: null, belge: enBuyukBelge('a', 5) })
  assert.equal(yuz.durum, 200)
  const yuzYetmis = await tazeSunucudaPost('/yonetim/menu', 'PUT', { taban: null, belge: enBuyukBelge('ş', 5) })
  assert.deepEqual([yuzYetmis.durum, yuzYetmis.hata], [413, 'govdeBuyuk'])
})

test('postGeriAl_65KBGovde_413_menuSiniriYalnizPutta', async () => {
  const y = await tazeSunucudaPost('/yonetim/menu/1/geri-al', 'POST', { taban: null, x: 'a'.repeat(65 * 1024) })
  assert.deepEqual([y.durum, y.hata], [413, 'govdeBuyuk'])
})
