import type { Metadata } from 'next'
import { sozluk } from '../content/index.ts'
import type { Dil } from '../content/types.ts'
import { SITE_URL, yol, type RotaAnahtari } from './site.ts'

/**
 * Paylaşım kartı. `app/opengraph-image.png` dosya konvansiyonu bu repoda
 * ÇALIŞMAZ: iki kök layout var, `app/layout.tsx` yok, ve `app/` kökündeki dosya
 * `(tr)`/`(en)` gruplarına iliştirilmiyor; ölçüldü, on iki rotanın hiçbirine
 * `og:image` düşmedi. Bu yüzden görsel `public/` altından açıkça bildirilir.
 *
 * DİL BAŞINA AYRI KART (20 Ağustos 2026): kartın üstünde başlık metni var,
 * tek kart İngilizce sayfaları Türkçe bir görselle paylaştırıyordu.
 *
 * JPEG, PNG değil: aynı görsel PNG olarak 281 KB, JPEG kalite 88'de 89 KB.
 * `subsampling=0` bilerek, 4:2:0 bordo ve bakır kenarları bulandırıyor.
 */
function sosyalKart(dil: Dil, alt: string) {
  return {
    url: `${SITE_URL}/sosyal-kart${dil === 'en' ? '-en' : ''}.jpg`,
    width: 1200,
    height: 630,
    alt,
  }
}

/**
 * Favicon seti (RealFaviconGenerator, 20 Ağustos 2026), dosyalar `public/` altında.
 * `app/icon.svg` + `app/apple-icon.png` konvansiyonu KALDIRILDI: iki sistem yan yana
 * durunca Next ikisini de basıyor ve sekmede hangisinin kazandığı tarayıcıya kalıyordu.
 * `favicon.svg` üreticinin 478 KB'lık sürümü değil, gerçek vektörün (`marka/rozet.svg`)
 * kopyası; üreticininki SVG'ye sarılmış bir rasterdı (0 path, 1 base64).
 *
 * Dışa açık, çünkü `app/global-not-found.tsx` kök layout'u atlar ve kendi
 * `metadata`'sını yazar; ikon seti iki yerde ayrı ayrı tanımlanmaz.
 */
export const IKONLAR = {
  icon: [
    { url: '/favicon.ico', sizes: '48x48' },
    { url: '/favicon.svg', type: 'image/svg+xml' },
    { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
  ],
  apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
}

/**
 * Rota ve dil başına `Metadata` üretir: sözlükten başlık/açıklama, `SITE_URL`
 * üzerinden canonical ve üç dilli (`tr`, `en`, `x-default`) hreflang alternatifleri.
 * `x-default` Türkçeye işaret eder; site kökü Türkçe barındığı için varsayılan budur.
 */
export function sayfaMetadata(anahtar: RotaAnahtari, dil: Dil): Metadata {
  const s = sozluk(dil)
  const meta = s.ortak.sayfaMeta[anahtar]
  // Kartın alt metni kartın ÜSTÜNDEKİ metni anlatır, sayfa başlığını değil.
  const kart = sosyalKart(dil, `${s.ortak.marka.ad}: ${s.ana.hero.baslikSatir1} ${s.ana.hero.baslikSatir2}`)

  return {
    // Sosyal görselin mutlak URL'i buradan kurulur; ayarlı değilse Next uyarı
    // basıp og:image etiketini hiç yazmaz (18 Ağustos 2026'da ölçüldü).
    metadataBase: new URL(SITE_URL),
    title: meta.baslik,
    description: meta.aciklama,
    icons: IKONLAR,
    manifest: '/site.webmanifest',
    appleWebApp: { title: s.ortak.marka.ad, capable: false },
    alternates: {
      canonical: `${SITE_URL}${yol(anahtar, dil)}`,
      languages: {
        tr: `${SITE_URL}${yol(anahtar, 'tr')}`,
        en: `${SITE_URL}${yol(anahtar, 'en')}`,
        'x-default': `${SITE_URL}${yol(anahtar, 'tr')}`,
      },
    },
    openGraph: {
      title: meta.baslik,
      description: meta.aciklama,
      siteName: s.ortak.marka.ad,
      locale: dil === 'en' ? 'en_GB' : 'tr_TR',
      type: 'website',
      url: `${SITE_URL}${yol(anahtar, dil)}`,
      images: [kart],
    },
    twitter: { card: 'summary_large_image', images: [kart.url] },
  }
}
