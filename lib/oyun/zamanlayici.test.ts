import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EN_COK_ADIM, TIK_MS, adimSayisi } from './zamanlayici.ts'

test('adimSayisi_birKarelikSure_birTik', () => {
  assert.equal(adimSayisi(0, TIK_MS).adim, 1)
})

test('adimSayisi_kisaSure_birikir_sonrakiKaredeTikOlur', () => {
  const ilk = adimSayisi(0, 10)
  assert.deepEqual(ilk, { adim: 0, birikim: 10 })
  const ikinci = adimSayisi(ilk.birikim, 10)
  assert.equal(ikinci.adim, 1)
  assert.ok(Math.abs(ikinci.birikim - (20 - TIK_MS)) < 1e-9)
})

test('adimSayisi_uzunUyku_enCokAltiTik_birikimSifirlanir', () => {
  assert.deepEqual(adimSayisi(0, 5000), { adim: EN_COK_ADIM, birikim: 0 })
})

test('adimSayisi_negatifSure_sifirSayilir', () => {
  assert.deepEqual(adimSayisi(5, -30), { adim: 0, birikim: 5 })
})
