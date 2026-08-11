// lib/site.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isletme } from '../content/isletme.ts'
import type { Isletme } from '../content/types.ts'
import { yol, tumYollar, yolTarifiUrl, whatsappUrl, telefonUrl, SITE_URL, type RotaAnahtari } from './site.ts'

test('SITE_URL_tekYerdeTanimlidir', () => {
  assert.equal(SITE_URL, 'https://cigercibozo.com')
})

test('yol_anaRota_trKokeDoner', () => {
  assert.equal(yol('ana', 'tr'), '/')
})

test('yol_anaRota_enOnekliKokeDoner', () => {
  assert.equal(yol('ana', 'en'), '/en/')
})

test('yol_altRotalar_trOnekssizDoner', () => {
  assert.equal(yol('menu', 'tr'), '/menu/')
  assert.equal(yol('hikaye', 'tr'), '/hikaye/')
  assert.equal(yol('konum', 'tr'), '/konum/')
  assert.equal(yol('gizlilik', 'tr'), '/gizlilik/')
})

test('yol_altRotalar_enOnekliVeRotaAdiTurkceKalir', () => {
  assert.equal(yol('menu', 'en'), '/en/menu/')
  assert.equal(yol('hikaye', 'en'), '/en/hikaye/')
  assert.equal(yol('konum', 'en'), '/en/konum/')
  assert.equal(yol('gizlilik', 'en'), '/en/gizlilik/')
})

test('tumYollar_besRotaIcinTrVeEnUretir', () => {
  const liste = tumYollar()
  assert.equal(liste.length, 5)
  const beklenenAnahtarlar: RotaAnahtari[] = ['ana', 'menu', 'hikaye', 'konum', 'gizlilik']
  assert.deepEqual(
    liste.map((g) => g.anahtar),
    beklenenAnahtarlar,
  )
  for (const girdi of liste) {
    assert.equal(girdi.tr, yol(girdi.anahtar, 'tr'))
    assert.equal(girdi.en, yol(girdi.anahtar, 'en'))
  }
})

test('yolTarifiUrl_koordinatBilinmiyorken_adresAramasiUretir', () => {
  // Gerçek işletme verisi: koordinat henüz doğrulanmadı, null.
  assert.equal(isletme.koordinat, null)
  const url = yolTarifiUrl()
  assert.match(url, /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/)
  const sorgu = decodeURIComponent(url.split('query=')[1] ?? '')
  assert.match(sorgu, /Ciğerci Bozo/)
  assert.match(sorgu, /Naci Talat Caddesi/)
  assert.match(sorgu, /Girne/)
  assert.match(sorgu, /KKTC/)
})

test('yolTarifiUrl_koordinatBilinirken_yonTarifiRotasiUretir', () => {
  const bilinen: Isletme = { ...isletme, koordinat: { enlem: 35.3411, boylam: 33.319 } }
  const url = yolTarifiUrl(bilinen)
  assert.equal(url, 'https://www.google.com/maps/dir/?api=1&destination=35.3411,33.319')
})

test('whatsappUrl_numaraNullIken_nullDoner', () => {
  assert.equal(whatsappUrl(null), null)
})

test('whatsappUrl_numaraVarken_sadeceRakamlarlaWaMeUretir', () => {
  assert.equal(whatsappUrl('+90 542 123 45 67'), 'https://wa.me/905421234567')
})

test('telefonUrl_numaraNullIken_nullDoner', () => {
  assert.equal(telefonUrl(null), null)
})

test('telefonUrl_numaraVarken_bosluksuzTelUretir', () => {
  assert.equal(telefonUrl('+90 542 123 45 67'), 'tel:+905421234567')
})
