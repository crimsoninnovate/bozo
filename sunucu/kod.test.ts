import { test } from 'node:test'
import assert from 'node:assert/strict'
import { anahtarOzeti, esitMi, jetonKimligi, kodOzeti, odulKodu } from './kod.ts'

test('odulKodu_altiHane_ayniGirdiAyniKod_farkliOyuncuFarkli', () => {
  const kod = odulKodu('tuz', '2026-10-05', 1)
  assert.match(kod, /^\d{6}$/)
  assert.equal(odulKodu('tuz', '2026-10-05', 1), kod)
  assert.notEqual(odulKodu('tuz', '2026-10-05', 2), kod)
  assert.notEqual(odulKodu('baska', '2026-10-05', 1), kod)
  assert.notEqual(odulKodu('tuz', '2026-10-05', 1, 1), kod)
})

test('kodOzeti_tuzaBagli_donemdenBagimsiz', () => {
  assert.equal(kodOzeti('t', '123456'), kodOzeti('t', '123456'))
  assert.notEqual(kodOzeti('t', '123456'), kodOzeti('u', '123456'))
})

test('anahtarOzeti_hex64_jetonKimligi_hex32', () => {
  assert.match(anahtarOzeti('x'), /^[0-9a-f]{64}$/)
  assert.match(jetonKimligi(), /^[0-9a-f]{32}$/)
  assert.notEqual(jetonKimligi(), jetonKimligi())
})

test('esitMi_farkliUzunluk_false_ayni_true', () => {
  assert.equal(esitMi('abc', 'abc'), true)
  assert.equal(esitMi('abc', 'abcd'), false)
})
