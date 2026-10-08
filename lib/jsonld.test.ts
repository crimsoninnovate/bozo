import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isletme } from '../content/isletme.ts'
import type { Isletme } from '../content/types.ts'
import { ACILIS_SAATI, KAPANIS_SAATI } from './saat.ts'
import { restaurantJsonLd, menuJsonLd, breadcrumbJsonLd } from './jsonld.ts'

type Adres = {
  '@type': string
  streetAddress: string
  addressLocality: string
  postalCode?: string
  addressCountry: string
}
type Saat = { '@type': string; dayOfWeek: string[]; opens: string; closes: string }

// İçecek fiyatları 8 Ekim 2026'da geldi; aralığın yayımlanıp yayımlanmayacağı
// sahibinin kararı (IYILESTIRMELER.md > fiyat listesi). Karar gelene kadar yazılmaz.
test('restaurantJsonLd_gercekVeriyle_priceRangeYazmaz', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  assert.equal('priceRange' in veri, false)
})

test('restaurantJsonLd_gercekVeriyle_koordinatiGeoyaYazar', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  assert.deepEqual(veri.geo, {
    '@type': 'GeoCoordinates',
    latitude: 35.3370065,
    longitude: 33.3057253,
  })
})

// Koordinat dalı gerçek veriyle dolduğundan boş dal yalnız burada kapsanıyor:
// uydurma bir `geo` yayınlamak eksik veriden kötüdür.
test('restaurantJsonLd_koordinatNullken_geoyuHicYazmaz', () => {
  const koordinatsiz: Isletme = { ...isletme, koordinat: null }
  const veri = restaurantJsonLd(koordinatsiz) as Record<string, unknown>
  assert.equal('geo' in veri, false)
})

test('restaurantJsonLd_gercekVeriyle_telefonuYazar', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  assert.equal(veri.telephone, '+90 533 888 74 24')
})

const HARITA_KARTI =
  'https://www.google.com/maps/search/?api=1&query=Ci%C4%9Ferci%20Bozo%2C%20Naci%20Talat%20Caddesi%20No%3A4' +
  '%2C%20Girne%2C%20KKTC&query_place_id=ChIJHzzKSYdt3hQRN2efWVKQ-sc'

test('restaurantJsonLd_gercekVeriyle_instagramVeHaritaKartiniSameAsaYazar', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  assert.deepEqual(veri.sameAs, ['https://instagram.com/cigercibozo', HARITA_KARTI])
})

test('restaurantJsonLd_gercekVeriyle_haritaKartiniHasMapeYazar', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  assert.equal(veri.hasMap, HARITA_KARTI)
})

test('restaurantJsonLd_placeIdNullken_hasMapYazmazSameAsYalnizInstagramTasir', () => {
  const placeIdsiz: Isletme = { ...isletme, googlePlaceId: null }
  const veri = restaurantJsonLd(placeIdsiz) as Record<string, unknown>
  assert.equal('hasMap' in veri, false)
  assert.deepEqual(veri.sameAs, ['https://instagram.com/cigercibozo'])
})

test('restaurantJsonLd_temelAlanlariDogruBasar', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  assert.equal(veri['@context'], 'https://schema.org')
  assert.equal(veri['@type'], 'Restaurant')
  assert.equal(veri.name, 'Ciğerci Bozo')
  assert.equal(veri.url, 'https://cigercibozo.com')
  assert.deepEqual(veri.amenityFeature, {
    '@type': 'LocationFeatureSpecification',
    name: 'Alcohol served',
    value: false,
  })
  assert.equal('servesAlcohol' in veri, false, 'schema.org böyle bir alan tanımlamıyor')
  assert.equal(veri.hasMenu, 'https://cigercibozo.com/menu/')
})

test('restaurantJsonLd_geceyiAsanCalismaSaatiniIkiyeBolmeden_yazar', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  const saatler = veri.openingHoursSpecification as Saat[]
  assert.equal(saatler.length, 1)
  const saat = saatler[0]
  assert.ok(saat)
  // Literal karşılaştırma kendini doğrular; iddia saatin tek kaynağına bağlı.
  assert.equal(saat.opens, `${String(ACILIS_SAATI).padStart(2, '0')}:00`)
  assert.equal(saat.closes, `${String(KAPANIS_SAATI).padStart(2, '0')}:00`)
  assert.equal(saat.dayOfWeek.length, 7)
})

test('restaurantJsonLd_adresBinaNoIleBirlesir', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  const adres = veri.address as Adres
  assert.equal(adres.streetAddress, 'Naci Talat Caddesi No:4')
  assert.equal(adres.addressLocality, 'Girne')
  assert.equal(adres.postalCode, '99300')
  assert.equal(adres.addressCountry, 'CY')
})

// Posta kodu da null olabilen bir alan: boşken satır hiç görünmemeli.
test('restaurantJsonLd_postaKoduNullken_postalCodeuHicYazmaz', () => {
  const kodsuz: Isletme = { ...isletme, postaKodu: null }
  const adres = (restaurantJsonLd(kodsuz) as Record<string, unknown>).address as Adres
  assert.equal('postalCode' in adres, false)
})

test('restaurantJsonLd_bilinenVeriyle_koordinatVeTelefonuYazar', () => {
  const bilinen: Isletme = {
    ...isletme,
    koordinat: { enlem: 35.3411, boylam: 33.319 },
    telefon: '+90 542 123 45 67',
    eposta: 'info@cigercibozo.com',
    instagram: 'cigercibozo',
    googlePlaceId: null,
  }
  const veri = restaurantJsonLd(bilinen) as Record<string, unknown>
  assert.deepEqual(veri.geo, { '@type': 'GeoCoordinates', latitude: 35.3411, longitude: 33.319 })
  assert.equal(veri.telephone, '+90 542 123 45 67')
  assert.equal(veri.email, 'info@cigercibozo.com')
  assert.deepEqual(veri.sameAs, ['https://instagram.com/cigercibozo'])
})

type Offer = { '@type': string; name?: string; price: string; priceCurrency: string }
type MenuItem = { '@type': string; name: string; offers: Offer[] }
type MenuSection = { '@type': string; name: string; hasMenuItem: MenuItem[] }

test('menuJsonLd_ocakbasiBolumu_yediKalemTasir', () => {
  const veri = menuJsonLd('tr') as Record<string, unknown>
  const bolumler = veri.hasMenuSection as MenuSection[]
  assert.equal(bolumler[0]?.hasMenuItem.length, 7)
})

test('menuJsonLd_cigerKalemi_dortOlcununOfferiniTasir', () => {
  const veri = menuJsonLd('tr') as Record<string, unknown>
  const bolumler = veri.hasMenuSection as MenuSection[]
  const ciger = bolumler[0]?.hasMenuItem.find((k) => k.name === 'Ciğer')
  assert.ok(ciger)
  assert.deepEqual(ciger.offers, [
    { '@type': 'Offer', name: 'Porsiyon', price: '690', priceCurrency: 'TRY' },
    { '@type': 'Offer', name: '1,5 Porsiyon', price: '900', priceCurrency: 'TRY' },
    { '@type': 'Offer', name: 'Dürüm', price: '690', priceCurrency: 'TRY' },
    { '@type': 'Offer', name: '1,5 Dürüm', price: '900', priceCurrency: 'TRY' },
  ])
})

test('menuJsonLd_karisikKalemi_yalnizPorsiyonOfferiTasir', () => {
  const veri = menuJsonLd('tr') as Record<string, unknown>
  const karisik = (veri.hasMenuSection as MenuSection[])[0]?.hasMenuItem.find((k) => k.name === 'Bozo Karışık')
  assert.deepEqual(karisik?.offers, [{ '@type': 'Offer', name: 'Porsiyon', price: '600', priceCurrency: 'TRY' }])
})

test('menuJsonLd_ozelBolumu_tekKalemTekOfferTasir', () => {
  const veri = menuJsonLd('tr') as Record<string, unknown>
  const bolumler = veri.hasMenuSection as MenuSection[]
  assert.equal(bolumler[1]?.name, 'Bozo Special')
  assert.equal(bolumler[1]?.hasMenuItem.length, 1)
  assert.deepEqual(bolumler[1]?.hasMenuItem[0]?.offers, [
    { '@type': 'Offer', price: '1100', priceCurrency: 'TRY' },
  ])
})

test('menuJsonLd_urunAdlari_dileGoreDegisir', () => {
  const trVeri = menuJsonLd('tr') as Record<string, unknown>
  const enVeri = menuJsonLd('en') as Record<string, unknown>
  const trAd = (trVeri.hasMenuSection as MenuSection[])[0]?.hasMenuItem[0]?.name
  const enAd = (enVeri.hasMenuSection as MenuSection[])[0]?.hasMenuItem[0]?.name
  assert.equal(trAd, 'Ciğer')
  assert.equal(enAd, 'Urfa Liver Kebab (Ciğer)')
})

test('menuJsonLd_ikramAdlari_hicGecmez', () => {
  const metin = JSON.stringify(menuJsonLd('tr'))
  assert.equal(metin.includes('Lebeni'), false)
  assert.equal(metin.includes('Bostana'), false)
})

test('menuJsonLd_icecekBolumu_herOlcuyuFiyatiylaTasir', () => {
  const bolumler = (menuJsonLd('tr') as Record<string, unknown>).hasMenuSection as MenuSection[]
  const icecek = bolumler.find((b) => b.name === 'İçecekler')
  assert.equal(icecek?.hasMenuItem.length, 6)
  assert.deepEqual(icecek?.hasMenuItem.find((k) => k.name === 'Su')?.offers, [
    { '@type': 'Offer', name: 'Pet', price: '20', priceCurrency: 'TRY' },
    { '@type': 'Offer', name: 'Cam', price: '40', priceCurrency: 'TRY' },
  ])
})

test('menuJsonLd_temelAlanlar_dogruBasar', () => {
  const veri = menuJsonLd('tr') as Record<string, unknown>
  assert.equal(veri['@context'], 'https://schema.org')
  assert.equal(veri['@type'], 'Menu')
  assert.equal(veri.url, 'https://cigercibozo.com/menu/')
})

type ListItem = { '@type': string; position: number; name: string; item: string }

test('breadcrumbJsonLd_ikiOgeTasir', () => {
  const veri = breadcrumbJsonLd('menu', 'tr') as Record<string, unknown>
  const ogeler = veri.itemListElement as ListItem[]
  assert.equal(ogeler.length, 2)
})

test('breadcrumbJsonLd_pozisyonlarBirVeIkidir', () => {
  const veri = breadcrumbJsonLd('menu', 'tr') as Record<string, unknown>
  const ogeler = veri.itemListElement as ListItem[]
  assert.equal(ogeler[0]?.position, 1)
  assert.equal(ogeler[1]?.position, 2)
})

test('breadcrumbJsonLd_anaSayfaVeMevcutSayfayaDoğruLinkVerir', () => {
  const trVeri = breadcrumbJsonLd('menu', 'tr') as Record<string, unknown>
  const trOgeler = trVeri.itemListElement as ListItem[]
  assert.equal(trOgeler[0]?.item, 'https://cigercibozo.com/')
  assert.equal(trOgeler[1]?.item, 'https://cigercibozo.com/menu/')

  const enVeri = breadcrumbJsonLd('konum', 'en') as Record<string, unknown>
  const enOgeler = enVeri.itemListElement as ListItem[]
  assert.equal(enOgeler[0]?.item, 'https://cigercibozo.com/en/')
  assert.equal(enOgeler[1]?.item, 'https://cigercibozo.com/en/konum/')
})

test('breadcrumbJsonLd_etiketlerSozlukteVar', () => {
  const veri = breadcrumbJsonLd('hikaye', 'tr') as Record<string, unknown>
  const ogeler = veri.itemListElement as ListItem[]
  assert.equal(ogeler[0]?.name, 'Ana Sayfa')
  assert.equal(ogeler[1]?.name, 'Hikaye')
})

test('breadcrumbJsonLd_anaRotasiIcinFirlatir', () => {
  assert.throws(() => breadcrumbJsonLd('ana', 'tr'))
})
