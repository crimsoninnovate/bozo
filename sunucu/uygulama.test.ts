import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createServer, type Server } from 'node:http'
import {
  JETON_SURESI_MS,
  ONAY_SURUMU,
  type BitirYaniti,
  type JetonYaniti,
  type TabloYaniti,
} from '../lib/oyun/aktarim.ts'
import { ustaOyna } from '../lib/oyun/deneme.ts'
import { simule } from '../lib/oyun/motor.ts'
import type { Girdi } from '../lib/oyun/tipler.ts'
import { TIK_MS } from '../lib/oyun/zamanlayici.ts'
import { bellekDepoKur } from './bellekDepo.ts'
import { listeKur } from './ip.ts'
import { uygulamaKur, type Uygulama } from './uygulama.ts'

/*
 * Uçlar sahte depoyla (spec §16): doğrulama, ret yolları, hız sınırı, dönem kapanışı.
 * Saat sahte: 8 Ekim 2026 Perşembe 20:00 Girne; dönem 12 Ekim 05:00 Girne'de (02:00Z) kapanır.
 */
const KOKEN = 'https://cigercibozo.com'
const YONETIM = { kullanici: 'personel', sifre: 'gizli' }
let saat = Date.parse('2026-10-08T20:00:00+03:00')
const PAZARTESI = Date.parse('2026-10-12T02:00:00Z')

let sunucu: Server
let uygulama: Uygulama
let kok = ''

before(async () => {
  uygulama = uygulamaKur(
    bellekDepoKur(),
    {
      kokenler: [KOKEN],
      tuz: 'test-tuzu',
      yonetim: YONETIM,
      guvenilirVekil: listeKur(['127.0.0.1', '::1']),
      kampanyaBitis: null,
    },
    () => saat,
    { warn() {}, error: console.error },
  )
  sunucu = createServer((req, res) => void uygulama.isle(req, res))
  await new Promise<void>((coz) => sunucu.listen(0, '127.0.0.1', coz))
  const adres = sunucu.address()
  if (!adres || typeof adres === 'string') throw new Error('adres yok')
  kok = `http://127.0.0.1:${adres.port}`
})

after(() => sunucu.close())

type Secenek = { yontem?: string; govde?: unknown; anahtar?: string; basliklar?: Record<string, string>; ham?: string }

async function istek(yol: string, { yontem = 'GET', govde, anahtar, basliklar = {}, ham }: Secenek = {}) {
  const b: Record<string, string> = { ...basliklar }
  if (govde !== undefined || ham !== undefined) b['Content-Type'] = 'application/json'
  if (anahtar) b.Authorization = `Bearer ${anahtar}`
  const body = ham ?? (govde === undefined ? undefined : JSON.stringify(govde))
  const yanit = await fetch(kok + yol, { method: yontem, headers: b, body })
  const metin = await yanit.text()
  const okunan = metin ? (JSON.parse(metin) as Record<string, unknown>) : null
  return { durum: yanit.status, govde: okunan, basliklar: yanit.headers }
}

const temel = (kullanici: string, sifre: string) => `Basic ${Buffer.from(`${kullanici}:${sifre}`).toString('base64')}`
const yonetimBasligi = { Authorization: temel(YONETIM.kullanici, YONETIM.sifre) }
let anahtarSayaci = 0
const yeniAnahtar = () => String(++anahtarSayaci).padStart(32, '0')

async function oyuncuOl(takmaAd: string) {
  const anahtar = yeniAnahtar()
  const y = await istek('/oyuncu', { yontem: 'POST', govde: { takmaAd, anahtar, onaySurumu: ONAY_SURUMU } })
  assert.equal(y.durum, 201, JSON.stringify(y.govde))
  return anahtar
}

async function jetonAl(kanal = 'yok'): Promise<JetonYaniti> {
  const y = await istek('/tur', { yontem: 'POST', govde: { kanal } })
  assert.equal(y.durum, 201)
  return y.govde as JetonYaniti
}

function kayitSuresi(tohum: number, kayit: Girdi[]): number {
  try {
    return simule(tohum, kayit).tik * TIK_MS
  } catch {
    return 7200 * TIK_MS
  }
}

/** Jeton alır, kaydın süresi kadar saati ilerletir, gönderir. */
async function turOyna(anahtar: string, girdiler: (tohum: number) => Girdi[], ek: Secenek = {}) {
  const jeton = await jetonAl()
  const kayit = girdiler(jeton.tohum)
  saat += kayitSuresi(jeton.tohum, kayit) + 500
  const govde = { girdiler: kayit, puan: 999999 }
  return istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', govde, anahtar, ...ek })
}

const usta = (tohum: number) => ustaOyna(tohum, 'usta')
const acemi = (tohum: number) => ustaOyna(tohum, 'acemi')
const bos = () => []

test('tur_jetonVerir_tohumUint32_kanalGunlukSayacaYazilir', async () => {
  const jeton = await jetonAl('sofra')
  assert.match(jeton.turId, /^[0-9a-f]{32}$/)
  assert.ok(Number.isInteger(jeton.tohum) && jeton.tohum >= 0 && jeton.tohum <= 0xffffffff)
  assert.equal(Date.parse(jeton.sonaErme), saat + JETON_SURESI_MS)
  const sayac = await istek('/yonetim/sayac?gun=2026-10-08', { basliklar: yonetimBasligi })
  assert.equal(sayac.durum, 200)
  assert.ok((sayac.govde?.sofra as number) >= 1)
  assert.equal((await istek('/tur', { yontem: 'POST', govde: { kanal: 'tiktok' } })).durum, 400)
})

test('bitir_sunucuSkoruKendiHesaplar_iddiaOkunmaz_siraVeFark', async () => {
  const a = await oyuncuOl('Usta Ali')
  const y = await turOyna(a, usta)
  assert.equal(y.durum, 200, JSON.stringify(y.govde))
  const sonuc = y.govde as unknown as BitirYaniti
  assert.notEqual(sonuc.puan, 999999)
  assert.ok(sonuc.puan > 10000)
  assert.equal(sonuc.hafta.sira, 1)
  assert.equal(sonuc.hafta.ustekiFark, null)
  assert.equal(sonuc.buTurEnIyi, true)
  // Boş kayıt her tohumda -600: sıra tohumdan bağımsız (acemi, rastgele tohumların ~%5'inde ustayı geçiyor).
  const b = await oyuncuOl('Acemi Veli')
  const y2 = (await turOyna(b, bos)).govde as unknown as BitirYaniti
  assert.equal(y2.puan, -600)
  assert.equal(y2.hafta.sira, 2)
  assert.equal(y2.hafta.ustekiFark, sonuc.puan - y2.puan)
})

test('bitir_cokHizli_422_jetonYanar_beklesenDeGonderemez', async () => {
  const a = await oyuncuOl('Hizli')
  const jeton = await jetonAl()
  const kayit = usta(jeton.tohum)
  const erken = await istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', govde: { girdiler: kayit }, anahtar: a })
  assert.deepEqual([erken.durum, erken.govde?.hata], [422, 'cokHizli'])
  saat += 130_000
  const gec = await istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', govde: { girdiler: kayit }, anahtar: a })
  assert.deepEqual([gec.durum, gec.govde?.hata], [409, 'jetonKullanildi'])
})

test('bitir_jetonYok404_kullanildi409_suresiDoldu410', async () => {
  const a = await oyuncuOl('Jetoncu')
  const yok = await istek(`/tur/${'f'.repeat(32)}/bitir`, { yontem: 'POST', govde: { girdiler: [] }, anahtar: a })
  assert.deepEqual([yok.durum, yok.govde?.hata], [404, 'jetonYok'])
  const ilk = await turOyna(a, bos)
  assert.equal(ilk.durum, 200)
  const eski = await jetonAl()
  saat += JETON_SURESI_MS + 1
  const dolmus = await istek(`/tur/${eski.turId}/bitir`, { yontem: 'POST', govde: { girdiler: [] }, anahtar: a })
  assert.deepEqual([dolmus.durum, dolmus.govde?.hata], [410, 'jetonSuresiDoldu'])
})

test('bitir_cokDokunus_ayniTikteAyniHedef_govdeBuyuk_tavan', async () => {
  const a = await oyuncuOl('Sinirci')
  const cok = await turOyna(a, () => Array.from({ length: 1201 }, (_, i) => [i, 's0'] as Girdi))
  assert.deepEqual([cok.durum, cok.govde?.hata], [422, 'cokDokunus'])
  const cift = await turOyna(a, () => [[5, 's0'], [5, 's0']])
  assert.deepEqual([cift.durum, cift.govde?.hata], [422, 'ayniTikteAyniHedef'])
  const bozuk = await turOyna(a, () => [[7200, 's0']])
  assert.deepEqual([bozuk.durum, bozuk.govde?.hata], [422, 'girdilerGecersiz'])
  const jeton = await jetonAl()
  const ham = `{"girdiler":[],"x":"${'a'.repeat(65 * 1024)}"}`
  const buyuk = await istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', ham, anahtar: a })
  assert.equal(buyuk.durum, 413)
})

test('bitir_anahtarsiz401_bilinmeyenOyuncu401', async () => {
  const jeton = await jetonAl()
  assert.equal((await istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', govde: { girdiler: [] } })).durum, 401)
  const govde = { girdiler: [] }
  const y = await istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', govde, anahtar: 'e'.repeat(32) })
  assert.deepEqual([y.durum, y.govde?.hata], [401, 'oyuncuYok'])
})

test('oyuncu_reddedilenAdlarTekNotrKod_eskiOnay400_ayniAnahtar409', async () => {
  for (const takmaAd of ['ab', 'Bozo', 'ciğerci bozo', 'Orospu', 'Usta Ali', 'usta ali', 'Ali🔥']) {
    const govde = { takmaAd, anahtar: yeniAnahtar(), onaySurumu: ONAY_SURUMU }
    const y = await istek('/oyuncu', { yontem: 'POST', govde })
    assert.deepEqual([y.durum, y.govde?.hata], [422, 'takmaAdKullanilamaz'], takmaAd)
  }
  const eskiGovde = { takmaAd: 'Yeni Ad', anahtar: yeniAnahtar(), onaySurumu: 'eski' }
  const eski = await istek('/oyuncu', { yontem: 'POST', govde: eskiGovde })
  assert.deepEqual([eski.durum, eski.govde?.hata], [400, 'onaySurumuEski'])
  const anahtar = await oyuncuOl('Tekrarci')
  const tekrarGovde = { takmaAd: 'Baska', anahtar, onaySurumu: ONAY_SURUMU }
  const tekrar = await istek('/oyuncu', { yontem: 'POST', govde: tekrarGovde })
  assert.deepEqual([tekrar.durum, tekrar.govde?.hata], [409, 'zatenKayitli'])
})

test('tablo_haftaninIlkOnu_gizliAdNull_onbellekGonderimdeBosalir', async () => {
  const once = await istek('/tablo')
  assert.equal(once.durum, 200)
  assert.equal(once.basliklar.get('cache-control'), 'public, max-age=20')
  const tablo = once.govde as unknown as TabloYaniti
  assert.equal(tablo.donem, '2026-10-05')
  assert.equal(tablo.bitis, '2026-10-12T02:00:00.000Z')
  assert.equal(tablo.hafta[0]?.takmaAd, 'Usta Ali')
  assert.ok(tablo.hafta.length <= 10)
  assert.equal(tablo.sonSampiyon, null)
  const yonetim = await istek('/yonetim/siralama', { basliklar: yonetimBasligi })
  const satirlar = yonetim.govde?.satirlar as { oyuncuId: number; takmaAd: string }[]
  const ali = satirlar.find((s) => s.takmaAd === 'Usta Ali')
  assert.ok(ali)
  const gizleIstegi = { yontem: 'POST', govde: { gizli: true }, basliklar: yonetimBasligi }
  const gizle = await istek(`/yonetim/oyuncu/${ali.oyuncuId}/gizle`, gizleIstegi)
  assert.equal(gizle.durum, 204)
  const sonra = (await istek('/tablo')).govde as unknown as TabloYaniti
  assert.equal(sonra.hafta[0]?.takmaAd, null)
})

test('yonetim_kimliksiz401_yanlis401_turIzleyiciVerisi', async () => {
  const kimliksiz = await istek('/yonetim/siralama')
  assert.equal(kimliksiz.durum, 401)
  assert.equal(kimliksiz.basliklar.get('www-authenticate'), 'Basic realm="yonetim"')
  const yanlis = await istek('/yonetim/siralama', { basliklar: { Authorization: temel('personel', 'yanlis') } })
  assert.equal(yanlis.durum, 401)
  const yonetim = await istek('/yonetim/siralama', { basliklar: yonetimBasligi })
  const siralama = yonetim.govde?.satirlar as { turId: number; supheli: boolean }[]
  const tur = await istek(`/yonetim/tur/${siralama[0]?.turId}`, { basliklar: yonetimBasligi })
  assert.equal(tur.durum, 200)
  assert.ok(Array.isArray(tur.govde?.girdiler))
  assert.equal(siralama[0]?.supheli, true, 'sabit aralıklı bot işaretlenir')
  assert.equal((await istek('/yonetim/tur/999999', { basliklar: yonetimBasligi })).durum, 404)
})

test('donemKapanisi_kodUretir_benKoduGosterir_personelOnaylar_ikinciOnay409', async () => {
  const birinci = await oyuncuOl('Sampiyon')
  await turOyna(birinci, usta)
  saat = PAZARTESI
  assert.deepEqual(await uygulama.isler.calistir(saat), ['2026-10-05'])
  const ben = await istek('/ben', { anahtar: birinci })
  assert.equal(ben.durum, 200)
  const odul = ben.govde?.odul as { kod: string; sira: number; donem: string; kullanildi: boolean }
  assert.match(odul.kod, /^\d{6}$/)
  assert.equal(odul.donem, '2026-10-05')
  assert.equal(odul.kullanildi, false)
  assert.equal(ben.govde?.hafta, null, 'yeni haftada henüz tur yok')
  const tablo = (await istek('/tablo')).govde as unknown as TabloYaniti
  assert.equal(tablo.sonSampiyon?.puan, (ben.govde as { odul: { puan?: number } }).odul.puan ?? tablo.sonSampiyon?.puan)
  const baskaKod = odul.kod === '000000' ? '000001' : '000000'
  const yanlis = await istek('/yonetim/kod', { yontem: 'POST', govde: { kod: baskaKod }, basliklar: yonetimBasligi })
  assert.deepEqual([yanlis.durum, yanlis.govde?.hata], [404, 'kodYok'])
  const onay = await istek('/yonetim/kod', { yontem: 'POST', govde: { kod: odul.kod }, basliklar: yonetimBasligi })
  assert.equal(onay.durum, 200)
  assert.equal(onay.govde?.sira, odul.sira)
  const ikinci = await istek('/yonetim/kod', { yontem: 'POST', govde: { kod: odul.kod }, basliklar: yonetimBasligi })
  assert.deepEqual([ikinci.durum, ikinci.govde?.hata], [409, 'kodKullanildi'])
  assert.equal(((await istek('/ben', { anahtar: birinci })).govde?.odul as { kullanildi: boolean }).kullanildi, true)
})

test('hesabiSil_204_sonraBen401_tablodanDuser', async () => {
  const a = await oyuncuOl('Silinecek')
  await turOyna(a, acemi)
  assert.equal((await istek('/oyuncu', { yontem: 'DELETE', anahtar: a })).durum, 204)
  assert.equal((await istek('/ben', { anahtar: a })).durum, 401)
  const tablo = (await istek('/tablo')).govde as unknown as TabloYaniti
  assert.equal(tablo.hafta.some((s) => s.takmaAd === 'Silinecek'), false)
})

test('cors_yalnizIzinliKoken_preflight204', async () => {
  const izinli = await istek('/tablo', { basliklar: { Origin: KOKEN } })
  assert.equal(izinli.basliklar.get('access-control-allow-origin'), KOKEN)
  const yabanci = await istek('/tablo', { basliklar: { Origin: 'https://kotu.example' } })
  assert.equal(yabanci.basliklar.get('access-control-allow-origin'), null)
  const onBasliklar = { Origin: KOKEN, 'Access-Control-Request-Method': 'POST' }
  const on = await fetch(kok + '/tur', { method: 'OPTIONS', headers: onBasliklar })
  assert.equal(on.status, 204)
  assert.equal(on.headers.get('access-control-allow-headers'), 'Content-Type, Authorization')
})

test('hizSiniri_oyuncuSaatteKirkTur_kirkBirinci429', async () => {
  const a = await oyuncuOl('Doymaz')
  for (let i = 0; i < 40; i++) assert.equal((await turOyna(a, bos)).durum, 200, `tur ${i}`)
  const fazla = await turOyna(a, bos)
  assert.deepEqual([fazla.durum, fazla.govde?.hata], [429, 'cokTur'])
  saat += 60 * 60_000
  assert.equal((await turOyna(a, bos)).durum, 200)
})

test('bilinmeyenYol404_yanlisYontem405_bozukJson400', async () => {
  assert.equal((await istek('/yok')).durum, 404)
  assert.equal((await istek('/tablo', { yontem: 'POST', govde: {} })).durum, 405)
  const bozuk = await istek('/tur', { yontem: 'POST', ham: '{bozuk' })
  assert.deepEqual([bozuk.durum, bozuk.govde?.hata], [400, 'bozukJson'])
})
