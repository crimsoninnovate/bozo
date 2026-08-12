import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isletme } from '../content/isletme.ts'
import type { Isletme } from '../content/types.ts'
import { restaurantJsonLd } from './jsonld.ts'

type Adres = { '@type': string; streetAddress: string; addressLocality: string; addressCountry: string }
type Saat = { '@type': string; dayOfWeek: string[]; opens: string; closes: string }

test('restaurantJsonLd_gercekVeriyle_bilinmeyenAlanlariHicYazmaz', () => {
  // Gerçek işletme verisi: koordinat, e-posta, instagram henüz null. Telefon
  // 12 Ağustos 2026'da geldi ve artık yazılıyor, aşağıdaki testte kilitli.
  assert.equal(isletme.koordinat, null)
  assert.equal(isletme.eposta, null)
  assert.equal(isletme.instagram, null)

  const veri = restaurantJsonLd() as Record<string, unknown>
  assert.equal('geo' in veri, false)
  assert.equal('email' in veri, false)
  assert.equal('sameAs' in veri, false)
  assert.equal('priceRange' in veri, false)
})

test('restaurantJsonLd_gercekVeriyle_telefonuYazar', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  assert.equal(veri.telephone, '+90 533 888 74 24')
})

test('restaurantJsonLd_temelAlanlariDogruBasar', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  assert.equal(veri['@context'], 'https://schema.org')
  assert.equal(veri['@type'], 'Restaurant')
  assert.equal(veri.name, 'Ciğerci Bozo')
  assert.equal(veri.url, 'https://cigercibozo.com')
  assert.equal(veri.servesAlcohol, false)
})

test('restaurantJsonLd_geceyiAsanCalismaSaatiniIkiyeBolmeden_yazar', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  const saatler = veri.openingHoursSpecification as Saat[]
  assert.equal(saatler.length, 1)
  const saat = saatler[0]
  assert.ok(saat)
  assert.equal(saat.opens, '10:00')
  assert.equal(saat.closes, '05:00')
  assert.equal(saat.dayOfWeek.length, 7)
})

test('restaurantJsonLd_adresBinaNoIleBirlesir', () => {
  const veri = restaurantJsonLd() as Record<string, unknown>
  const adres = veri.address as Adres
  assert.equal(adres.streetAddress, 'Naci Talat Caddesi No:4')
  assert.equal(adres.addressLocality, 'Girne')
  assert.equal(adres.addressCountry, 'CY')
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
