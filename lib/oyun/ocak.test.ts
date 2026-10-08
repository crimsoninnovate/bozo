import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bekle, dokun, evreyeGec, sahne } from './deneme.ts'

test('raf_sisIlkBosOcakYuvasinaIner_sureleriEvredenSabitlenir', () => {
  const oyun = sahne([])
  const olaylar = dokun(oyun, 'ciger')
  assert.deepEqual(oyun.ocak[0], { urun: 'ciger', gecen: 1, pisme: 240, pencere: 120, bant: 30, cevirme: 'yok' })
  assert.deepEqual(olaylar, [{ tur: 'sisKondu', yuva: 0, urun: 'ciger' }])
})

test('raf_evresiGelmemisUrun_etkisizdir', () => {
  const oyun = sahne([])
  assert.deepEqual(dokun(oyun, 'dalak', 'yurek'), [])
  assert.deepEqual(oyun.ocak, [null, null, null, null])
})

test('raf_dalakKisaYurekUzunPiser', () => {
  const oyun = sahne([])
  evreyeGec(oyun, 2)
  dokun(oyun, 'ciger', 'dalak', 'yurek')
  assert.deepEqual(
    oyun.ocak.map((s) => s?.pisme ?? null),
    [180, 135, 225, null],
  )
})

test('raf_acikOcakYuvasiDoluysa_rafDoluOlayi', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger', 'ciger', 'ciger')
  assert.deepEqual(dokun(oyun, 'ciger'), [{ tur: 'rafDolu', urun: 'ciger' }])
  assert.equal(oyun.ocak[3], null)
})

test('ocak_centiginBandindaCevirme_iyi_disinda_kotu', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger', 'ciger')
  bekle(oyun, 49)
  assert.deepEqual(dokun(oyun, 'o1'), [{ tur: 'sisCevrildi', yuva: 1, iyi: false }])
  bekle(oyun, 54)
  assert.equal(oyun.ocak[0]?.gecen, 105)
  assert.deepEqual(dokun(oyun, 'o0'), [{ tur: 'sisCevrildi', yuva: 0, iyi: true }])
})

test('ocak_cevrilmisSis_hazirOlmadan_dokunusEtkisiz', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger')
  bekle(oyun, 119)
  dokun(oyun, 'o0')
  bekle(oyun, 50)
  assert.deepEqual(dokun(oyun, 'o0'), [])
  assert.equal(oyun.ocak[0]?.cevirme, 'iyi')
})

test('ocak_iyiCevrilipPencereninOrtasindaAlinan_tamKivamOlur', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger')
  bekle(oyun, 119)
  dokun(oyun, 'o0')
  bekle(oyun, 179)
  assert.equal(oyun.ocak[0]?.gecen, 300)
  assert.deepEqual(dokun(oyun, 'o0'), [{ tur: 'sisAlindi', yuva: 0, kalite: 'tam' }])
  assert.deepEqual(oyun.tezgah[0], { urun: 'ciger', kalite: 'tam', bekleme: 1 })
})

test('ocak_cevrilmemisSis_enFazlaIyiOlur', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger')
  bekle(oyun, 299)
  assert.deepEqual(dokun(oyun, 'o0'), [{ tur: 'sisAlindi', yuva: 0, kalite: 'iyi' }])
})

test('ocak_pencereKenarindaAlinan_iyiOlur', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger')
  bekle(oyun, 119)
  dokun(oyun, 'o0')
  bekle(oyun, 119)
  assert.equal(oyun.ocak[0]?.gecen, 240)
  assert.deepEqual(dokun(oyun, 'o0'), [{ tur: 'sisAlindi', yuva: 0, kalite: 'iyi' }])
})

test('ocak_almaPenceresiGecenSis_yanar_cezaKomboVeDiziBozulur', () => {
  const oyun = sahne([])
  oyun.kombo = 7
  oyun.porsiyonDizisi = 5
  dokun(oyun, 'ciger')
  bekle(oyun, 358)
  assert.ok(oyun.ocak[0])
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'sisYandi', yuva: 0 }])
  assert.equal(oyun.ocak[0], null)
  assert.equal(oyun.puan, -50)
  assert.equal(oyun.kombo, 3)
  assert.equal(oyun.porsiyonDizisi, 0)
})

test('ocak_tezgahDoluyken_sisAlinamaz_ocaktaKalir', () => {
  const oyun = sahne([])
  for (let i = 0; i < 4; i++) oyun.tezgah[i] = { urun: 'ayran', kalite: null, bekleme: 0 }
  dokun(oyun, 'ciger')
  bekle(oyun, 239)
  assert.deepEqual(dokun(oyun, 'o0'), [])
  assert.equal(oyun.ocak[0]?.urun, 'ciger')
})

test('tezgah_bekleyenSisSogur_ayranSogumaz', () => {
  const oyun = sahne([])
  oyun.tezgah[0] = { urun: 'ciger', kalite: 'iyi', bekleme: 0 }
  oyun.tezgah[1] = { urun: 'ayran', kalite: null, bekleme: 0 }
  bekle(oyun, 599)
  assert.ok(oyun.tezgah[0])
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'sogudu', tezgah: 0 }])
  assert.equal(oyun.puan, -30)
  assert.equal(oyun.tezgah[1]?.urun, 'ayran')
})

test('ayran_altmisTiktaDolar_tezgahaGecer', () => {
  const oyun = sahne([])
  dokun(oyun, 'ayran')
  bekle(oyun, 58)
  assert.equal(oyun.tezgah[0], null)
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'ayranDoldu' }])
  assert.deepEqual(oyun.tezgah[0], { urun: 'ayran', kalite: null, bekleme: 0 })
  assert.equal(oyun.ayran, null)
})

test('ayran_dolarkenDokunus_etkisiz_tezgahDoluysaYayiktaBekler', () => {
  const oyun = sahne([])
  for (let i = 0; i < 4; i++) oyun.tezgah[i] = { urun: 'ciger', kalite: 'iyi', bekleme: 0 }
  dokun(oyun, 'ayran')
  dokun(oyun, 'ayran')
  bekle(oyun, 100)
  assert.equal(oyun.ayran, 0)
  oyun.tezgah[2] = null
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'ayranDoldu' }])
  assert.equal(oyun.tezgah.at(2)?.urun, 'ayran')
})
