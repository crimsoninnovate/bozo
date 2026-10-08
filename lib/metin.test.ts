import { test } from 'node:test'
import assert from 'node:assert/strict'
import { doldur, dulOnle } from './metin.ts'

test('dulOnle_ucKelimeliAd_sonIkisiniBirlestirir', () => {
  assert.equal(dulOnle('Terbiyesiz Tavuk Şiş'), 'Terbiyesiz Tavuk Şiş')
})

test('dulOnle_ikiKelimeliAd_tekParcayaDoner', () => {
  assert.equal(dulOnle('Ciğer Şiş'), 'Ciğer Şiş')
})

test('dulOnle_tekKelime_degismedenDoner', () => {
  assert.equal(dulOnle('Bostana'), 'Bostana')
})

test('dulOnle_bosMetin_degismedenDoner', () => {
  assert.equal(dulOnle(''), '')
})

test('dulOnle_parantezliIngilizceAd_sonIkisiniBirlestirir', () => {
  assert.equal(
    dulOnle('Chicken Skewer (Terbiyesiz Tavuk Şiş)'),
    'Chicken Skewer (Terbiyesiz Tavuk Şiş)',
  )
})

test('doldur_yerTutucular_degerleAlir_tanimsizKalir', () => {
  assert.equal(doldur('Sıran: {sira}', { sira: 4 }), 'Sıran: 4')
  assert.equal(doldur('{fark} kaldı, {yok}', { fark: '1.200' }), '1.200 kaldı, {yok}')
  assert.equal(doldur('düz metin', {}), 'düz metin')
})
