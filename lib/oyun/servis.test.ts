import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bekle, dokun, evreyeGec, sahne, sonaKadarBekle } from './deneme.ts'
import { ilerle } from './motor.ts'
import type { Olay } from './tipler.ts'

test('servis_eslesenKalemleriTasir_fisBitinceKomboVeSabirlaOder', () => {
  const oyun = sahne([['ciger', 'ayran']])
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ciger', kalite: 'tam', bekleme: 0 }
  oyun.tezgah[2] = { urun: 'ayran', kalite: null, bekleme: 0 }
  const olaylar = dokun(oyun, 's0')
  assert.deepEqual(olaylar, [
    { tur: 'servis', sofra: 0, urun: 'ciger', kalite: 'tam' },
    { tur: 'servis', sofra: 0, urun: 'ayran', kalite: null },
    { tur: 'fisTamam', sofra: 0, odeme: 389 },
  ])
  assert.equal(oyun.puan, 389)
  assert.equal(oyun.kombo, 1)
  assert.deepEqual(oyun.ozet, { sofra: 1, sis: 1, tamKivam: 1, enUzunKombo: 1, kalkan: 0 })
  assert.deepEqual(oyun.tezgah, [null, null, null, null])
})

test('servis_odeyenSofra_otuzTikSonraKalkar', () => {
  const oyun = sahne([['ayran']])
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ayran', kalite: null, bekleme: 0 }
  dokun(oyun, 's0')
  assert.deepEqual(dokun(oyun, 's0'), [])
  bekle(oyun, 27)
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'sofraKalkti', sofra: 0, odedi: true }])
})

test('servis_fiseUymayanKalem_tezgahtaKalir', () => {
  const oyun = sahne([['dalak']])
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ciger', kalite: 'iyi', bekleme: 0 }
  assert.deepEqual(dokun(oyun, 's0'), [])
  assert.equal(oyun.tezgah[0]?.urun, 'ciger')
})

test('odeme_komboCarpaniOdemedenOnceOkunur', () => {
  const oyun = sahne([['ayran']])
  oyun.kombo = 2
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ayran', kalite: null, bekleme: 0 }
  const olaylar = dokun(oyun, 's0')
  assert.deepEqual(olaylar.at(-1), { tur: 'fisTamam', sofra: 0, odeme: 239 })
  assert.equal(oyun.kombo, 3)
})

test('odeme_sonSaatte_ikiKatOdenir', () => {
  const oyun = sahne([['ayran']])
  evreyeGec(oyun, 4)
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ayran', kalite: null, bekleme: 0 }
  const olaylar = dokun(oyun, 's0')
  assert.deepEqual(olaylar.at(-1), { tur: 'fisTamam', sofra: 0, odeme: 478 })
})

test('porsiyon_ardArda12TamKivam_500PuanVeDiziSifirlanir', () => {
  const oyun = sahne([Array(12).fill('ciger')], true)
  bekle(oyun, 1)
  dokun(oyun, 's0')
  const olaylar: Olay[] = []
  for (let tur = 0; tur < 3; tur++) {
    for (let i = 0; i < 4; i++) oyun.tezgah[i] = { urun: 'ciger', kalite: 'tam', bekleme: 0 }
    olaylar.push(...dokun(oyun, 's0'))
  }
  assert.equal(olaylar.filter((o) => o.tur === 'porsiyon').length, 1)
  assert.equal(oyun.porsiyonDizisi, 0)
  assert.equal(oyun.puan, 500 + (12 * 150 + 200))
})

test('porsiyon_iyiSis_diziyiBozar', () => {
  const oyun = sahne([['ciger', 'ciger']], true)
  oyun.porsiyonDizisi = 11
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ciger', kalite: 'iyi', bekleme: 0 }
  oyun.tezgah[1] = { urun: 'ciger', kalite: 'tam', bekleme: 0 }
  const olaylar = dokun(oyun, 's0')
  assert.equal(olaylar.some((o) => o.tur === 'porsiyon'), false)
  assert.equal(oyun.porsiyonDizisi, 1)
})

test('bitis_0500eUlasan_geceTamamOlur_1000Puan', () => {
  const oyun = sahne([])
  sonaKadarBekle(oyun)
  assert.equal(oyun.bitti, 'gece')
  assert.equal(oyun.tik, 7200)
  assert.equal(oyun.puan, 1000)
})

test('ilerle_bittiktenSonra_hicbirSeyDegismez', () => {
  const oyun = sahne([])
  sonaKadarBekle(oyun)
  assert.deepEqual(ilerle(oyun, ['ciger', 's0']), [])
  assert.equal(oyun.tik, 7200)
})

test('evre_sinirdaGecer_olayVerir', () => {
  const oyun = sahne([])
  bekle(oyun, 899)
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'evre', evre: 1 }])
  assert.equal(oyun.evre, 1)
})
