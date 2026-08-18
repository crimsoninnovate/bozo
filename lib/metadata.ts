import type { Metadata } from 'next'
import { sozluk } from '../content/index.ts'
import type { Dil } from '../content/types.ts'
import { SITE_URL, yol, type RotaAnahtari } from './site.ts'

/**
 * Paylaşım kartı. `app/opengraph-image.png` dosya konvansiyonu bu repoda
 * ÇALIŞMAZ: iki kök layout var, `app/layout.tsx` yok, ve `app/` kökündeki dosya
 * `(tr)`/`(en)` gruplarına iliştirilmiyor; ölçüldü, on iki rotanın hiçbirine
 * `og:image` düşmedi. Bu yüzden görsel `public/` altından açıkça bildirilir.
 */
const SOSYAL_KART = {
  url: `${SITE_URL}/sosyal-kart.png`,
  width: 1200,
  height: 630,
  alt: 'Ciğerci Bozo',
}

/**
 * Rota ve dil başına `Metadata` üretir: sözlükten başlık/açıklama, `SITE_URL`
 * üzerinden canonical ve üç dilli (`tr`, `en`, `x-default`) hreflang alternatifleri.
 * `x-default` Türkçeye işaret eder; site kökü Türkçe barındığı için varsayılan budur.
 */
export function sayfaMetadata(anahtar: RotaAnahtari, dil: Dil): Metadata {
  const s = sozluk(dil)
  const meta = s.ortak.sayfaMeta[anahtar]

  return {
    // Sosyal görselin mutlak URL'i buradan kurulur; ayarlı değilse Next uyarı
    // basıp og:image etiketini hiç yazmaz (18 Ağustos 2026'da ölçüldü).
    metadataBase: new URL(SITE_URL),
    title: meta.baslik,
    description: meta.aciklama,
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
      images: [SOSYAL_KART],
    },
    twitter: { card: 'summary_large_image', images: [SOSYAL_KART.url] },
  }
}
