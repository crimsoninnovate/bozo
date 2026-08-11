import type { MetadataRoute } from 'next'
import { SITE_URL, tumYollar } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return tumYollar().flatMap(({ tr, en }) => [
    {
      url: `${SITE_URL}${tr}`,
      alternates: { languages: { tr: `${SITE_URL}${tr}`, en: `${SITE_URL}${en}` } },
    },
    {
      url: `${SITE_URL}${en}`,
      alternates: { languages: { tr: `${SITE_URL}${tr}`, en: `${SITE_URL}${en}` } },
    },
  ])
}
