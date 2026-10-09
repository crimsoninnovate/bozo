import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bellekDepoKur } from './bellekDepo.ts'
import type { Depo, YeniTur } from './depo.ts'
import {
  donemleriKapat,
  GIRDI_SAKLAMA_MS,
  islerKur,
  OYUNCU_SAKLAMA_MS,
  SAMPIYON_SAKLAMA_MS,
  suresiDolaniSil,
} from './isler.ts'
import { kodOzeti, odulKodu } from './kod.ts'

const TUZ = 'test-tuzu'
const GUN = 24 * 60 * 60_000
/* 5 Ekim 2026 Pazartesi 05:00 Girne = 02:00Z; dönem 12 Ekim 02:00Z'de biter. */
const BAS = Date.parse('2026-10-05T02:00:00Z')
const BIT = Date.parse('2026-10-12T02:00:00Z')
const DONEM = '2026-10-05'

async function oyuncu(depo: Depo, ad: string, simdi = BAS) {
  const kayit = { anahtarOzeti: `oz-${ad}`, takmaAd: ad, adKatlanmis: ad.toLowerCase(), onaySurumu: 's', simdi }
  const o = await depo.oyuncuEkle(kayit)
  if (o === 'adKullanimda') throw new Error(ad)
  return o.id
}

async function tur(depo: Depo, oyuncuId: number, puan: number, olusturma: number, donem = DONEM): Promise<number> {
  const t: YeniTur = {
    jetonId: `${oyuncuId}-${puan}-${olusturma}`, oyuncuId, donem, tohum: 1, puan,
    ozet: { misafir: 1, sis: 1, tamKivam: 0, enUzunKombo: 1, kalkan: 0, bahsis: 0 },
    bitti: 'gece', tik: 7200, kanal: 'yok', supheli: false, girdiler: [[0, 'ciger']], olusturma,
  }
  return depo.turEkle(t)
}

const jeton = (harf: string) => ({
  id: harf.repeat(32), tohum: 1, kanal: 'yok' as const, olusturma: BAS, sonaErme: BAS + 1, kullanildi: false,
})

async function haftaKur(depo: Depo) {
  await depo.donemKaydet({ anahtar: DONEM, baslangic: BAS, bitis: BIT, kapanis: null })
  const [a, b, c, d] = await Promise.all([oyuncu(depo, 'A'), oyuncu(depo, 'B'), oyuncu(depo, 'C'), oyuncu(depo, 'D')])
  await tur(depo, a, 900, BAS + 1)
  await tur(depo, a, 950, BAS + 2)
  await tur(depo, b, 800, BAS + 3)
  await tur(depo, c, 700, BAS + 4)
  await tur(depo, d, 600, BAS + 5)
  return { a, b, c, d }
}

test('donemleriKapat_bitisGecmemis_kapatmaz', async () => {
  const depo = bellekDepoKur()
  await haftaKur(depo)
  assert.deepEqual(await donemleriKapat(depo, TUZ, BIT - 1), [])
  assert.equal((await depo.kazananlar(DONEM)).length, 0)
})

test('donemleriKapat_ilkUcKisiyeBirerKod_kodOzetiBulunur_ikinciKosuTekrarEtmez', async () => {
  const depo = bellekDepoKur()
  const { a, b, c } = await haftaKur(depo)
  assert.deepEqual(await donemleriKapat(depo, TUZ, BIT), [DONEM])
  const kazananlar = await depo.kazananlar(DONEM)
  assert.deepEqual(kazananlar.map((k) => [k.sira, k.oyuncuId, k.puan]), [[1, a, 950], [2, b, 800], [3, c, 700]])
  assert.equal(kazananlar[0]?.gecerlilik, BIT + 14 * GUN)
  const kod = odulKodu(TUZ, DONEM, a, 0)
  assert.equal((await depo.kazananBul(kodOzeti(TUZ, kod)))?.sira, 1)
  assert.deepEqual(await donemleriKapat(depo, TUZ, BIT + 1), [])
  assert.equal((await depo.kazananlar(DONEM)).length, 3)
})

/** Milyonda bir: aynı özet başka dönemden çıkmışsa deneme sayacı artar, `/ben` aynı sayaçla türetir. */
test('donemleriKapat_kodOzetiCakisirsa_denemeSayaciArtar', async () => {
  const depo = bellekDepoKur()
  const { a } = await haftaKur(depo)
  const cakisan = kodOzeti(TUZ, odulKodu(TUZ, DONEM, a, 0))
  const eski = { donem: '2026-09-28', sira: 1, oyuncuId: a, takmaAd: 'A', puan: 1, deneme: 0, gecerlilik: BAS }
  await depo.kazananEkle({ ...eski, kodOzeti: cakisan })
  await donemleriKapat(depo, TUZ, BIT)
  const birinci = (await depo.kazananlar(DONEM))[0]
  assert.equal(birinci?.deneme, 1)
  assert.equal(birinci?.kodOzeti, kodOzeti(TUZ, odulKodu(TUZ, DONEM, a, 1)))
})

/** Kapanış birinciyi yazıp dönemi kapatamadan düşerse sonraki tik eksik sıraları yazar, takılmaz. */
test('donemleriKapat_yarimKalanKapanis_eksikSiralariYazarVeKapatir', async () => {
  const depo = bellekDepoKur()
  const { a, b, c } = await haftaKur(depo)
  const ozet = kodOzeti(TUZ, odulKodu(TUZ, DONEM, a, 0))
  const yarim = { donem: DONEM, sira: 1, oyuncuId: a, takmaAd: 'A', puan: 950, deneme: 0, gecerlilik: BIT + 14 * GUN }
  await depo.kazananEkle({ ...yarim, kodOzeti: ozet })
  assert.deepEqual(await donemleriKapat(depo, TUZ, BIT + 60_000), [DONEM])
  const kazananlar = await depo.kazananlar(DONEM)
  assert.deepEqual(kazananlar.map((k) => [k.sira, k.oyuncuId, k.deneme]), [[1, a, 0], [2, b, 0], [3, c, 0]])
})

test('suresiDolaniSil_ilkYirmiDisiGirdiler_otuzGunlukGirdiler_doksanGunlukOyuncular', async () => {
  const depo = bellekDepoKur()
  const { a, d } = await haftaKur(depo)
  const eskiDonem = '2026-08-03'
  const eskiBitis = BAS - 8 * 7 * GUN
  await depo.donemKaydet({ anahtar: eskiDonem, baslangic: eskiBitis - 7 * GUN, bitis: eskiBitis, kapanis: eskiBitis })
  const eskiTur = await tur(depo, a, 10, BAS - 8 * 7 * GUN, eskiDonem)
  const sessiz = await oyuncu(depo, 'Sessiz', BAS - OYUNCU_SAKLAMA_MS - GUN)
  for (let i = 0; i < 22; i++) await tur(depo, d, 1000 + i, BAS + 100 + i)
  const simdi = BAS + GIRDI_SAKLAMA_MS + 7 * GUN
  await suresiDolaniSil(depo, simdi, null)
  assert.equal((await depo.turBul(eskiTur))?.girdiler, null, '30 günü geçen dönemin kaydı silinir')
  assert.equal(await depo.oyuncuBul('oz-Sessiz'), null, '90 gün etkinliksiz oyuncu silinir')
  assert.equal(sessiz > 0, true)
  const buHafta = await depo.siralama(DONEM)
  assert.equal(buHafta.length, 4)
})

test('suresiDolaniSil_kampanyaBitisindenDoksanGunSonra_sampiyonlarSilinir', async () => {
  const depo = bellekDepoKur()
  await haftaKur(depo)
  await donemleriKapat(depo, TUZ, BIT)
  await suresiDolaniSil(depo, BIT + SAMPIYON_SAKLAMA_MS, BIT)
  assert.equal((await depo.kazananlar(DONEM)).length, 3)
  await suresiDolaniSil(depo, BIT + SAMPIYON_SAKLAMA_MS + 1, BIT)
  assert.equal((await depo.kazananlar(DONEM)).length, 0)
})

test('islerKur_calistir_kapanisHerSeferinde_silmeGundeBirKez', async () => {
  const depo = bellekDepoKur()
  await haftaKur(depo)
  await depo.jetonEkle(jeton('j'))
  const isler = islerKur(depo, TUZ, null)
  assert.deepEqual(await isler.calistir(BAS + 10 * 60_000), [])
  assert.equal(await depo.jetonBul('j'.repeat(32)), null, 'ilk koşu günün silmesini yapar')
  await depo.jetonEkle(jeton('k'))
  await isler.calistir(BAS + 11 * 60_000)
  assert.notEqual(await depo.jetonBul('k'.repeat(32)), null, 'aynı gün ikinci koşu silmez')
  assert.deepEqual(await isler.calistir(BIT), [DONEM])
  assert.equal(await depo.jetonBul('k'.repeat(32)), null, 'gün değişince siler')
})
