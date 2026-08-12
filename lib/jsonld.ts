import { isletme } from '../content/isletme.ts'
import type { Isletme } from '../content/types.ts'
import { SITE_URL } from './site.ts'

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
 * `priceRange` kasıtlı olarak yoktur: `content/urunler.ts` içindeki her ürün fiyatı
 * `null`, yani doğrulanmış bir fiyat aralığı yok. Brifin `'$$'` örneği burada
 * uydurma bir gerçek olurdu; kisitlar.md'nin "no invented prices" kuralı gereği atlandı.
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
    servesAlcohol: isletmeVerisi.alkolServisi,
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
        opens: '10:00',
        closes: '05:00',
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
  if (isletmeVerisi.instagram) veri.sameAs = [`https://instagram.com/${isletmeVerisi.instagram}`]

  return veri
}
