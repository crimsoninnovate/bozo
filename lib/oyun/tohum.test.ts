import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rastgeleTohum, TOHUM_USTU, tohumGecerliMi } from './tohum.ts'

test('tohumGecerliMi_sifirIleUint32Arasi_gecerli', () => {
  assert.equal(tohumGecerliMi(0), true)
  assert.equal(tohumGecerliMi(2026), true)
  assert.equal(tohumGecerliMi(TOHUM_USTU), true)
})

test('tohumGecerliMi_negatifKesirliBuyukYaDaSayiDegil_gecersiz', () => {
  assert.equal(tohumGecerliMi(-1), false)
  assert.equal(tohumGecerliMi(1.5), false)
  assert.equal(tohumGecerliMi(TOHUM_USTU + 1), false)
  assert.equal(tohumGecerliMi('7'), false)
  assert.equal(tohumGecerliMi(null), false)
  assert.equal(tohumGecerliMi(Number.NaN), false)
})

test('rastgeleTohum_herZamanGecerliAralikta', () => {
  for (let i = 0; i < 100; i++) assert.ok(tohumGecerliMi(rastgeleTohum()))
})
