import { isletme } from '../content/isletme.ts'
import type { Isletme } from '../content/types.ts'
import { ACILIS_SAATI, KAPANIS_SAATI } from './saat.ts'
import { SITE_URL, yol, instagramUrl, haritaUrl, type RotaAnahtari } from './site.ts'
import { sozluk, type Sozluk } from '../content/index.ts'
import type { Dil, Urun } from '../content/types.ts'
import { menuUrunler, ozelUrun } from '../content/urunler.ts'

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
      ...(isletmeVerisi.postaKodu ? { postalCode: isletmeVerisi.postaKodu } : {}),
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
  const harita = haritaUrl(isletmeVerisi)
  if (harita) veri.hasMap = harita
  // Google kartı `sameAs`'te de durur: sitedeki varlığı Maps'teki kayda bağlar.
  const sameAs = [instagramUrl(isletmeVerisi.instagram), harita].filter((url): url is string => url !== null)
  if (sameAs.length > 0) veri.sameAs = sameAs

  return veri
}

function urunAdi(s: Sozluk, id: string): string {
  const urunler = s.menu.ocakbasi.urunler as Record<string, { ad: string }>
  const kayit = urunler[id]
  if (!kayit) throw new Error(`menuJsonLd: "${id}" için ürün adı sözlükte yok`)
  return kayit.ad
}

function urunOfferleri(s: Sozluk, urun: Urun): Offer[] {
  const offers: Offer[] = []
  if (urun.tam !== null) {
    offers.push({
      '@type': 'Offer',
      name: s.menu.ocakbasi.olculer.tam,
      price: String(urun.tam),
      priceCurrency: 'TRY',
    })
  }
  if (urun.durum !== null) {
    offers.push({
      '@type': 'Offer',
      name: s.menu.ocakbasi.olculer.durum,
      price: String(urun.durum),
      priceCurrency: 'TRY',
    })
  }
  return offers
}

type Offer = { '@type': string; name?: string; price: string; priceCurrency: string }

/**
 * schema.org `Menu` yapısal verisi: yalnız fiyatı olan kalemler (`menuUrunler`, `ozelUrun`);
 * ikram/içecek hiç görünmez (`KISITLAR.md`: uydurma fiyat yok). Yalnız `/menu`'de basılır
 * (`components/sayfa/Kabuk.tsx`), görünmeyen sayfada işaretlenmiş içerik olmasın diye.
 */
export function menuJsonLd(dil: Dil): object {
  const s = sozluk(dil)

  const ocakbasiKalemleri = menuUrunler
    .map((urun) => ({
      '@type': 'MenuItem',
      name: urunAdi(s, urun.id),
      offers: urunOfferleri(s, urun),
    }))
    .filter((kalem) => kalem.offers.length > 0)

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: s.menu.ocakbasi.baslik,
    url: `${SITE_URL}${yol('menu', dil)}`,
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: s.menu.ocakbasi.baslik,
        hasMenuItem: ocakbasiKalemleri,
      },
      {
        '@type': 'MenuSection',
        name: s.menu.ocakbasi.ozel.ad,
        hasMenuItem: [
          {
            '@type': 'MenuItem',
            name: s.menu.ocakbasi.ozel.ad,
            offers: [{ '@type': 'Offer', price: String(ozelUrun.fiyat), priceCurrency: 'TRY' }],
          },
        ],
      },
    ],
  }
}

/**
 * schema.org `BreadcrumbList`. Ana sayfa için çağrılmaz (`anahtar` argümanı 'ana' olamaz);
 * çağıran `components/sayfa/Kabuk.tsx` zaten `aktif !== 'ana'` koşuluyla korur.
 */
export function breadcrumbJsonLd(anahtar: RotaAnahtari, dil: Dil): object {
  if (anahtar === 'ana') {
    throw new Error('breadcrumbJsonLd: ana sayfa için çağrılmaz')
  }

  const s = sozluk(dil)
  const sayfaAdi = s.ortak.nav[anahtar]
  if (!sayfaAdi) throw new Error(`breadcrumbJsonLd: "${anahtar}" için nav etiketi yok`)

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: s.ortak.nav.anaSayfa,
        item: `${SITE_URL}${yol('ana', dil)}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: sayfaAdi,
        item: `${SITE_URL}${yol(anahtar, dil)}`,
      },
    ],
  }
}
