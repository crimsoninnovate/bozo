import { isletme } from '../content/isletme.ts'
import type { Isletme } from '../content/types.ts'
import { ACILIS_SAATI, KAPANIS_SAATI } from './saat.ts'
import { SITE_URL, yol, instagramUrl } from './site.ts'

/** schema.org saatleri `HH:MM` ister; sabitler saat cinsinden tam sayı. */
function saatMetni(saat: number): string {
  return `${String(saat).padStart(2, '0')}:00`
}

const HAFTA_GUNLERI = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

/**
 * schema.org `Restaurant` yapısal verisi. Tek işletme, tek gerçek olduğundan dil
 * ayrımı yapılmaz (bkz. `content/isletme.ts`). Bilinmeyen (`null`) her işletme alanı
 * satırda hiç görünmez; uydurma değer veya boş dize yazılmaz, çünkü yanlış bir
 * "gerçek" yayınlamak eksik veriden daha kötüdür.
 *
 * `openingHoursSpecification.closes` (`05:00`) `opens` (`10:00`) değerinden küçüktür;
 * bu, geceyi aşan çalışma saatinin schema.org yazımıdır ve Google bunu destekler.
 * İki ayrı aralığa bölünmez, `23:59` gibi bir yaklaşıklık yazılmaz.
 *
 * `priceRange` hâlâ yoktur. Ocak fiyatları 13 Ağustos 2026'da geldi (600-1000 TL) ama
 * içecek fiyatları gelmedi, yani menünün tamamını kapsayan bir aralık hâlâ yok.
 * Brifin `'$$'` örneği ayrıca bir para birimi sınıfı iddiası; kisitlar.md'nin
 * "no invented prices" kuralı gereği atlandı. İçecek fiyatı gelince açılabilir.
 *
 * `isletmeVerisi` varsayılan olarak tekil `isletme` kaynağını okur; parametre yalnız
 * testlerin bilinen-koordinat/telefon dallarını gerçek veriyi değiştirmeden
 * kapsayabilmesi için var (bkz. `lib/site.ts` `yolTarifiUrl` aynı desen), çağıranlar
 * `restaurantJsonLd()` ile sıfır argümanla çağırmaya devam eder.
 */
export function restaurantJsonLd(isletmeVerisi: Isletme = isletme): object {
  const veri: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: isletmeVerisi.ad,
    url: SITE_URL,
    servesCuisine: 'Turkish',
    // Google'ın restoran zengin sonucu görsel bekler. Sosyal kartın kendisi
    // veriliyor: zaten 1200x630 ve mutlak URL'de duruyor, ikinci bir varlık yok.
    image: `${SITE_URL}/sosyal-kart.jpg`,
    hasMenu: `${SITE_URL}${yol('menu', 'tr')}`,
    // `servesAlcohol` schema.org'da yok, tüketiciler onu yok sayardı. Alkolsüzlük
    // markanın kayıtlı gerçeği, o yüzden silinmedi, geçerli sözcük dağarcığına taşındı.
    amenityFeature: {
      '@type': 'LocationFeatureSpecification',
      name: 'Alcohol served',
      value: isletmeVerisi.alkolServisi,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: isletmeVerisi.binaNo
        ? `${isletmeVerisi.cadde} ${isletmeVerisi.binaNo}`
        : isletmeVerisi.cadde,
      addressLocality: isletmeVerisi.sehir,
      addressCountry: 'CY',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: HAFTA_GUNLERI,
        opens: saatMetni(ACILIS_SAATI),
        closes: saatMetni(KAPANIS_SAATI),
      },
    ],
  }

  if (isletmeVerisi.koordinat) {
    veri.geo = {
      '@type': 'GeoCoordinates',
      latitude: isletmeVerisi.koordinat.enlem,
      longitude: isletmeVerisi.koordinat.boylam,
    }
  }
  if (isletmeVerisi.telefon) veri.telephone = isletmeVerisi.telefon
  if (isletmeVerisi.eposta) veri.email = isletmeVerisi.eposta
  const instagram = instagramUrl(isletmeVerisi.instagram)
  if (instagram) veri.sameAs = [instagram]

  return veri
}
