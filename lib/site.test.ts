// lib/site.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isletme } from '../content/isletme.ts'
import type { Isletme } from '../content/types.ts'
import {
  dizindeMi,
  yol,
  yoldanDil,
  tumYollar,
  yolTarifiUrl,
  haritaUrl,
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

test('yol_oyun_ikiDildeOyunYolu', () => {
  assert.equal(yol('oyun', 'tr'), '/oyun/')
  assert.equal(yol('oyun', 'en'), '/en/oyun/')
})

test('yol_siralama_oyunAltinda', () => {
  assert.equal(yol('siralama', 'tr'), '/oyun/siralama/')
  assert.equal(yol('siralama', 'en'), '/en/oyun/siralama/')
})

/** Oyun prototipi noindex: sitemap ve llms.txt `tumYollar`'dan türer, oyun ve sıralaması oraya girmez. */
test('tumYollar_oyunuVeSiralamayiIcermez', () => {
  const anahtarlar = tumYollar().map((g) => g.anahtar as string)
  assert.equal(anahtarlar.includes('oyun') || anahtarlar.includes('siralama'), false)
  assert.equal(dizindeMi('oyun') || dizindeMi('siralama'), false)
  assert.equal(dizindeMi('menu'), true)
})

test('yolTarifiUrl_koordinatVePlaceIdBilinmiyorken_adresAramasiUretir', () => {
  const koordinatsiz: Isletme = { ...isletme, googlePlaceId: null, koordinat: null }
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

test('yolTarifiUrl_yalnizKoordinatBilinirken_koordinataYonTarifiUretir', () => {
  const placeIdsiz: Isletme = { ...isletme, googlePlaceId: null }
  const url = yolTarifiUrl(placeIdsiz)
  assert.equal(url, 'https://www.google.com/maps/dir/?api=1&destination=35.3370065,33.3057253')
})

// Gerçek veri bu dala düşer. Hedef metin olmak zorunda: koordinat verilince Maps
// place ID'yi yok sayıp en yakın kaydı ("Kıbrıs İnşaat") gösterdi, 8 Ekim 2026.
test('yolTarifiUrl_placeIdBilinirken_isletmeKartinaYonTarifiUretir', () => {
  const url = new URL(yolTarifiUrl())
  assert.equal(url.origin + url.pathname, 'https://www.google.com/maps/dir/')
  assert.equal(url.searchParams.get('api'), '1')
  assert.equal(url.searchParams.get('destination_place_id'), 'ChIJHzzKSYdt3hQRN2efWVKQ-sc')
  assert.equal(url.searchParams.get('destination'), 'Ciğerci Bozo, Naci Talat Caddesi No:4, Girne, KKTC')
})

test('haritaUrl_placeIdNullIken_nullDoner', () => {
  assert.equal(haritaUrl({ ...isletme, googlePlaceId: null }), null)
})

test('haritaUrl_gercekVeriyle_isletmeKartiniAcar', () => {
  const url = new URL(haritaUrl() ?? '')
  assert.equal(url.origin + url.pathname, 'https://www.google.com/maps/search/')
  assert.equal(url.searchParams.get('query_place_id'), 'ChIJHzzKSYdt3hQRN2efWVKQ-sc')
  assert.equal(url.searchParams.get('query'), 'Ciğerci Bozo, Naci Talat Caddesi No:4, Girne, KKTC')
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
