import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ONAY_SURUMU } from '../lib/oyun/aktarim.ts'
import { girdileriCoz, kanalCoz, oyuncuIstegiCoz } from './dogrulama.ts'
import { IstekHatasi } from './http.ts'

const hata = (kod: string) => (h: unknown) => h instanceof IstekHatasi && h.kod === kod

test('kanalCoz_dortKanal_gecerli_digerleri400', () => {
  for (const kanal of ['sofra', 'ig', 'site', 'yok']) assert.equal(kanalCoz({ kanal }), kanal)
  assert.throws(() => kanalCoz({ kanal: 'tiktok' }), hata('kanalGecersiz'))
  assert.throws(() => kanalCoz(null), hata('govdeGecersiz'))
  assert.throws(() => kanalCoz([]), hata('govdeGecersiz'))
})

test('oyuncuIstegiCoz_anahtarHex32_onaySurumu_takmaAdBicimi', () => {
  const anahtar = 'ab'.repeat(16)
  const gecerli = { takmaAd: 'Ayşe', anahtar, onaySurumu: ONAY_SURUMU }
  assert.deepEqual(oyuncuIstegiCoz(gecerli), gecerli)
  assert.throws(() => oyuncuIstegiCoz({ ...gecerli, anahtar: 'kisa' }), hata('anahtarGecersiz'))
  assert.throws(() => oyuncuIstegiCoz({ takmaAd: 'Ayşe', anahtar, onaySurumu: 'eski' }), hata('onaySurumuEski'))
  assert.throws(() => oyuncuIstegiCoz({ takmaAd: 'A', anahtar, onaySurumu: ONAY_SURUMU }), hata('takmaAdKullanilamaz'))
  assert.throws(() => oyuncuIstegiCoz({ takmaAd: 7, anahtar, onaySurumu: ONAY_SURUMU }), hata('takmaAdKullanilamaz'))
})

test('girdileriCoz_diziSiniri_ayniTikteAyniHedef_bicim', () => {
  assert.deepEqual(girdileriCoz({ girdiler: [[0, 's0'], [0, 's1'], [5, 's0']] }), [[0, 's0'], [0, 's1'], [5, 's0']])
  assert.deepEqual(girdileriCoz({ girdiler: [] }), [])
  assert.throws(() => girdileriCoz({}), hata('girdilerGecersiz'))
  assert.throws(() => girdileriCoz({ girdiler: Array.from({ length: 1201 }, (_, i) => [i, 's0']) }), hata('cokDokunus'))
  assert.throws(() => girdileriCoz({ girdiler: [[3, 's0'], [3, 's0']] }), hata('ayniTikteAyniHedef'))
  assert.throws(() => girdileriCoz({ girdiler: [[3, 's0', 'x']] }), hata('girdilerGecersiz'))
  assert.throws(() => girdileriCoz({ girdiler: [['3', 's0']] }), hata('girdilerGecersiz'))
  assert.throws(() => girdileriCoz({ girdiler: [null] }), hata('girdilerGecersiz'))
})

test('girdileriCoz_binIkiYuzDokunus_sinirdaGecer', () => {
  const girdiler = Array.from({ length: 1200 }, (_, i) => [i, 's0'])
  assert.equal(girdileriCoz({ girdiler }).length, 1200)
})
