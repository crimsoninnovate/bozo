import type { Metadata } from 'next'
import { sozluk } from '../content/index.ts'
import type { Dil } from '../content/types.ts'
import { SITE_URL, yol, type RotaAnahtari } from './site.ts'

/**
 * Rota ve dil başına `Metadata` üretir: sözlükten başlık/açıklama, `SITE_URL`
 * üzerinden canonical ve üç dilli (`tr`, `en`, `x-default`) hreflang alternatifleri.
 * `x-default` Türkçeye işaret eder; site kökü Türkçe barındığı için varsayılan budur.
 */
export function sayfaMetadata(anahtar: RotaAnahtari, dil: Dil): Metadata {
  const s = sozluk(dil)
  const meta = s.ortak.sayfaMeta[anahtar]

  return {
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
      locale: dil === 'en' ? 'en_GB' : 'tr_TR',
      type: 'website',
      url: `${SITE_URL}${yol(anahtar, dil)}`,
    },
  }
}
