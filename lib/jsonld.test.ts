import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isletme } from '../content/isletme.ts'
import type { Isletme } from '../content/types.ts'
import { ACILIS_SAATI, KAPANIS_SAATI } from './saat.ts'
import { restaurantJsonLd } from './jsonld.ts'

type Adres = {
  '@type': string
  streetAddress: string
  addressLocality: string
  postalCode?: string
  addressCountry: string
}
type Saat = { '@type': string; dayOfWeek: string[]; opens: string; closes: string }

// İçecek fiyatı hâlâ gelmedi, yani menünün tamamını kapsayan aralık yok:
// `priceRange` `Isletme`'de null kalan son gerçeğin yerine geçen tek eksik alan.
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

test('restaurantJsonLd_gercekVeriyle_instagramiSameAsaYazar', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
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
  }
  const veri = restaurantJsonLd(bilinen) as Record<string, unknown>
  assert.deepEqual(veri.geo, { '@type': 'GeoCoordinates', latitude: 35.3411, longitude: 33.319 })
  assert.equal(veri.telephone, '+90 542 123 45 67')
  assert.equal(veri.email, 'info@cigercibozo.com')
  assert.deepEqual(veri.sameAs, ['https://instagram.com/cigercibozo'])
})
