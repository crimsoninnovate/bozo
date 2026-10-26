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
