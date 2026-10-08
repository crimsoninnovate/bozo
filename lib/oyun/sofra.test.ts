import { test } from 'node:test'
import assert from 'node:assert/strict'
import { yeniOyun } from './durum.ts'
import { bekle, dokun, sahne, sonaKadarBekle } from './deneme.ts'

test('sofra_misafirGelince_acikSofralarinIlkBosunaOturur', () => {
  const oyun = sahne([['ciger'], ['dalak'], ['ayran']])
  const olaylar = bekle(oyun, 1)
  assert.deepEqual(oyun.sofralar.map((s) => s?.misafir.no ?? null), [0, 1, null, null])
  assert.deepEqual(olaylar, [
    { tur: 'sofraGeldi', sofra: 0 },
    { tur: 'sofraGeldi', sofra: 1 },
  ])
})

test('sofra_acikYuvaYoksa_misafirKapidaBekler', () => {
  const oyun = sahne([['ciger'], ['dalak'], ['ayran']])
  bekle(oyun, 1)
  assert.equal(oyun.kuyruk.length, 1)
  assert.equal(oyun.kuyruk[0]?.no, 2)
})

test('sofra_kurulmamisinSabri_kurulmusunIkiKatiHizlaTukenir', () => {
  const oyun = sahne([['ciger'], ['ciger']])
  bekle(oyun, 1)
  dokun(oyun, 's1')
  bekle(oyun, 99)
  assert.equal(oyun.sofralar[0]?.sabir, 1600)
  assert.equal(oyun.sofralar[1]?.sabir, 1700)
})

test('sofra_kurmak_sabrinYuzde15iniGeriVerir', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 501)
  assert.equal(oyun.sofralar[0]?.sabir, 800)
  dokun(oyun, 's0')
  assert.equal(oyun.sofralar[0]?.sabir, 1069)
})

test('sofra_kurulmamisaServisDokunusu_onceSofrayiKurar', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  oyun.tezgah[0] = { urun: 'ciger', kalite: 'iyi', bekleme: 0 }
  assert.deepEqual(dokun(oyun, 's0'), [{ tur: 'sofraKuruldu', sofra: 0 }])
  assert.equal(oyun.tezgah[0]?.urun, 'ciger')
  const olaylar = dokun(oyun, 's0')
  assert.equal(olaylar[0]?.tur, 'servis')
})

test('sofra_sabriBiten_kalkar_cezaKomboSifirVeKayipSayilir', () => {
  const oyun = sahne([['ciger']])
  oyun.kombo = 5
  bekle(oyun, 900)
  assert.ok(oyun.sofralar[0])
  const olaylar = bekle(oyun, 1)
  assert.equal(oyun.sofralar[0], null)
  assert.equal(oyun.puan, -200)
  assert.equal(oyun.kombo, 0)
  assert.equal(oyun.ozet.kalkan, 1)
  assert.deepEqual(olaylar, [{ tur: 'sofraKalkti', sofra: 0, odedi: false }])
})

test('sofra_bosYaDaKalkanSofrayaDokunus_etkisizdir', () => {
  const oyun = sahne([])
  assert.deepEqual(dokun(oyun, 's0', 's3'), [])
})

test('sofra_geceninIlkMisafiri_sabriTukenmez', () => {
  const oyun = yeniOyun(1)
  bekle(oyun, 61)
  const ilk = oyun.sofralar[0]
  assert.equal(ilk?.misafir.no, 0)
  bekle(oyun, 400)
  assert.equal(oyun.sofralar[0]?.sabir, ilk?.toplamSabir)
})

test('sofra_ucSofraKalkinca_geceBiter', () => {
  const oyun = sahne([['ciger'], ['ciger'], ['ciger']])
  sonaKadarBekle(oyun)
  assert.equal(oyun.bitti, 'ucSofra')
  assert.equal(oyun.ozet.kalkan, 3)
  assert.ok(oyun.tik < 7200)
})
