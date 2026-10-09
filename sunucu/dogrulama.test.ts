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
  assert.deepEqual(girdileriCoz({ girdiler: [[0, 'ciger'], [0, 'birak'], [5, 'ciger']] }), [[0, 'ciger'], [0, 'birak'], [5, 'ciger']])
  assert.deepEqual(girdileriCoz({ girdiler: [] }), [])
  assert.throws(() => girdileriCoz({}), hata('girdilerGecersiz'))
  assert.throws(() => girdileriCoz({ girdiler: Array.from({ length: 1201 }, (_, i) => [i, 'ciger']) }), hata('cokDokunus'))
  assert.throws(() => girdileriCoz({ girdiler: [[3, 'ciger'], [3, 'ciger']] }), hata('ayniTikteAyniHedef'))
  assert.doesNotThrow(() => girdileriCoz({ girdiler: [[7, 'o0'], [7, 't0']] }))
  assert.throws(() => girdileriCoz({ girdiler: [[3, 'ciger', 'x']] }), hata('girdilerGecersiz'))
  assert.throws(() => girdileriCoz({ girdiler: [['3', 'ciger']] }), hata('girdilerGecersiz'))
  assert.throws(() => girdileriCoz({ girdiler: [null] }), hata('girdilerGecersiz'))
})

test('girdileriCoz_binIkiYuzDokunus_sinirdaGecer', () => {
  const girdiler = Array.from({ length: 1200 }, (_, i) => [i, 'ciger'])
  assert.equal(girdileriCoz({ girdiler }).length, 1200)
})
