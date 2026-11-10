import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gaCerezAdlari, onayGerekirMi } from './onay.ts'

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

test('gaCerezAdlari_yalnizGoogleAnalyticsCerezleri', () => {
  const cerez = '_ga=GA1.1.1; _ga_N3893E7B1P=GS1.1; oturum=x; _gat=1; baska_ga=2'
  assert.deepEqual(gaCerezAdlari(cerez), ['_ga', '_ga_N3893E7B1P', '_gat'])
  assert.deepEqual(gaCerezAdlari(''), [])
})
