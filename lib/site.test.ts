// lib/site.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isletme } from '../content/isletme.ts'
import type { Isletme } from '../content/types.ts'
import {
  yol,
  yoldanDil,
  tumYollar,
  yolTarifiUrl,
  whatsappUrl,
  telefonUrl,
  instagramUrl,
  SITE_URL,
  type RotaAnahtari,
} from './site.ts'

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
  assert.equal(yol('galeri', 'tr'), '/galeri/')
  assert.equal(yol('gizlilik', 'tr'), '/gizlilik/')
})

test('yol_altRotalar_enOnekliVeRotaAdiTurkceKalir', () => {
  assert.equal(yol('menu', 'en'), '/en/menu/')
  assert.equal(yol('hikaye', 'en'), '/en/hikaye/')
  assert.equal(yol('konum', 'en'), '/en/konum/')
  // Rota adı iki dilde de Türkçe: /en/gallery/ değil.
  assert.equal(yol('galeri', 'en'), '/en/galeri/')
  assert.equal(yol('gizlilik', 'en'), '/en/gizlilik/')
})

test('tumYollar_altiRotaIcinTrVeEnUretir', () => {
  const liste = tumYollar()
  assert.equal(liste.length, 6)
  const beklenenAnahtarlar: RotaAnahtari[] = ['ana', 'menu', 'galeri', 'hikaye', 'konum', 'gizlilik']
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
  // Gerçek koordinat 24 Ağustos 2026'da geldi, bu yüzden dal artık sahte nesneyle
  // kapsanıyor: adres araması yalnız koordinat null iken üretilmeli.
  const koordinatsiz: Isletme = { ...isletme, koordinat: null }
  const url = yolTarifiUrl(koordinatsiz)
  assert.match(url, /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=/)
  const sorgu = decodeURIComponent(url.split('query=')[1] ?? '')
  assert.match(sorgu, /Ciğerci Bozo/)
  assert.match(sorgu, /Naci Talat Caddesi/)
  // binaNo dahil edilmesi lib/site.ts'in kendi iyileştirmesiydi (brief'in örneği
  // dışarıda bırakıyordu); bir gerileme tüm diğer testleri kırmadan sessizce
  // düşebilirdi, bu satır onu tek başına korur (fix round 1, Minor 2).
  // Cadde ile numara tek parça olmalı: aralarına virgül girerse Maps numarayı ayrı
  // bir adres bileşeni sanır.
  assert.match(sorgu, /Naci Talat Caddesi No:4/)
  assert.match(sorgu, /Girne/)
  assert.match(sorgu, /KKTC/)
})

// Gerçek veri artık bu dala düşüyor: beş çağrı yeri (mobil bar, hero, footer,
// iletişim satırı, çekmece) adres araması yerine yön tarifi alıyor.
test('yolTarifiUrl_koordinatBilinirken_yonTarifiRotasiUretir', () => {
  const url = yolTarifiUrl()
  assert.equal(url, 'https://www.google.com/maps/dir/?api=1&destination=35.3370065,33.3057253')
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

test('yoldanDil_enKoku_enDoner', () => {
  assert.equal(yoldanDil('/en/'), 'en')
})

test('yoldanDil_enAltRotasi_enDoner', () => {
  assert.equal(yoldanDil('/en/menu/'), 'en')
})

test('yoldanDil_enAltindaOlmayanBirYol_enDoner', () => {
  assert.equal(yoldanDil('/en/boyle-bir-sayfa-yok/'), 'en')
})

test('yoldanDil_bitisEgikCizgisizEnKoku_enDoner', () => {
  assert.equal(yoldanDil('/en'), 'en')
})

test('yoldanDil_trKoku_trDoner', () => {
  assert.equal(yoldanDil('/'), 'tr')
})

test('yoldanDil_trAltRotasi_trDoner', () => {
  assert.equal(yoldanDil('/menu/'), 'tr')
})

// Dize öneki değil yol parçası: 404 tam da uydurma yolları gördüğü için bu dal gerçek.
test('yoldanDil_enHarfleriyleBaslayanTurkceYol_trDoner', () => {
  assert.equal(yoldanDil('/enfes-ciger/'), 'tr')
})

test('yoldanDil_bosDize_trDoner', () => {
  assert.equal(yoldanDil(''), 'tr')
})

test('instagramUrl_kullaniciNullIken_nullDoner', () => {
  assert.equal(instagramUrl(null), null)
})

test('instagramUrl_kullaniciVarken_profilAdresiUretir', () => {
  assert.equal(instagramUrl('cigercibozo'), 'https://instagram.com/cigercibozo')
})
