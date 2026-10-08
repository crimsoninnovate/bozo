import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ustaOyna } from './deneme.ts'
import { simule } from './motor.ts'
import { tavan } from './tavan.ts'

test('tavan_hicbirAltinKaydinAltindaKalmaz', () => {
  assert.ok(tavan(1) >= 40470)
  assert.ok(tavan(2026) >= 10001)
})

test('tavan_kirkTohumdaUstaVeAcemiSkorununUstunde', () => {
  for (let t = 1; t <= 40; t++) {
    const sinir = tavan(t)
    assert.ok(simule(t, ustaOyna(t, 'usta')).puan <= sinir, `tohum ${t}: usta tavanı aştı`)
    assert.ok(simule(t, ustaOyna(t, 'acemi')).puan <= sinir, `tohum ${t}: acemi tavanı aştı`)
  }
})

test('tavan_ayniTohum_ayniDeger_veTamsayi', () => {
  assert.equal(tavan(1), tavan(1))
  assert.ok(Number.isInteger(tavan(1)))
})

/* Altın değer: bütçe ya da puan tablosu değişince bilerek kırılır. Usta 40470 alır; sınır gevşek. */
test('altin_tavan_tohum1', () => {
  assert.equal(tavan(1), 90060)
})

/** Bütçe sabit ama kalemlerin fişlere dağılımı tohuma bağlı: tavan tohumdan tohuma az oynar. */
test('tavan_tohumaGoreAzOynar_doksanBinCivari', () => {
  for (let t = 2; t <= 40; t++) assert.ok(Math.abs(tavan(t) - 90000) < 1500, `tohum ${t}: ${tavan(t)}`)
})
