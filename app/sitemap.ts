import type { MetadataRoute } from 'next'
import { SITE_URL, tumYollar, type RotaAnahtari } from '@/lib/site'

export const dynamic = 'force-static'

/** Rota başına arama motoru önceliği ve değişim sıklığı; anahtar sırası RotaAnahtari'nin
 * kendi sırası, önem sırasına göre değil. */
const ONCELIK: Record<RotaAnahtari, { priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }> = {
  ana: { priority: 1, changeFrequency: 'weekly' },
  menu: { priority: 0.9, changeFrequency: 'monthly' },
  galeri: { priority: 0.6, changeFrequency: 'monthly' },
  konum: { priority: 0.7, changeFrequency: 'yearly' },
  hikaye: { priority: 0.5, changeFrequency: 'yearly' },
  gizlilik: { priority: 0.3, changeFrequency: 'yearly' },
}

export default function sitemap(): MetadataRoute.Sitemap {
  const simdi = new Date()

  return tumYollar().flatMap(({ anahtar, tr, en }) => {
    const { priority, changeFrequency } = ONCELIK[anahtar]
    const alternates = { languages: { tr: `${SITE_URL}${tr}`, en: `${SITE_URL}${en}` } }

    return [
      { url: `${SITE_URL}${tr}`, lastModified: simdi, changeFrequency, priority, alternates },
      { url: `${SITE_URL}${en}`, lastModified: simdi, changeFrequency, priority, alternates },
    ]
  })
}
