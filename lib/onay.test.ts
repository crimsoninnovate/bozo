import { test } from 'node:test'
import assert from 'node:assert/strict'
import { onayGerekirMi } from './onay.ts'

test('onayGerekirMi_oyunYollari_false', () => {
  for (const yol of ['/oyun', '/oyun/', '/oyun/siralama/', '/en/oyun', '/en/oyun/']) {
    assert.equal(onayGerekirMi(yol), false, yol)
  }
})

test('onayGerekirMi_siteYollari_true', () => {
  for (const yol of ['/', '/menu/', '/en/', '/en/menu/', '/gizlilik/', '/oyunbaz/']) {
    assert.equal(onayGerekirMi(yol), true, yol)
  }
})
