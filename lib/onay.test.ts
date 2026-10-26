import { test } from 'node:test'
import assert from 'node:assert/strict'
import { onayGerekirMi } from './onay.ts'

test('onayGerekirMi_oyunYollari_false', () => {
  for (const yol of ['/oyun', '/oyun/', '/oyun/siralama/', '/en/oyun', '/en/oyun/']) {
    assert.equal(onayGerekirMi(yol), false, yol)
  }
})

test('onayGerekirMi_menuPaneli_false', () => {
  for (const yol of ['/yonetim', '/yonetim/']) assert.equal(onayGerekirMi(yol), false, yol)
})

test('onayGerekirMi_siteYollari_true', () => {
  for (const yol of ['/', '/menu/', '/en/', '/en/menu/', '/gizlilik/', '/oyunbaz/', '/yonetimbaz/']) {
    assert.equal(onayGerekirMi(yol), true, yol)
  }
})
