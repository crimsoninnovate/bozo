import { existsSync, readFileSync } from 'node:fs'
import type { NextConfig } from 'next'
import { menuBelgesiKaynakla } from './lib/menu/belgeYukle.ts'
import { iletisimiEnveCevir } from './lib/menu/iletisimEnv.ts'

const META_DOSYA = 'content/menu.canli.meta.json'

/** `menuCek`in yazdığı sürüm; meta yoksa ya da okunamazsa 0 (tohum). */
function canliSurum(): number {
  if (!existsSync(META_DOSYA)) return 0
  try {
    const surum = (JSON.parse(readFileSync(META_DOSYA, 'utf8')) as { surum?: unknown }).surum
    return typeof surum === 'number' && Number.isInteger(surum) && surum > 0 ? surum : 0
  } catch (hata) {
    console.warn(`next.config: ${META_DOSYA} okunamadi, sürüm 0 sayilacak`, hata)
    return 0
  }
}

/** İletişim ve sürüm build'e gömülür; hata build'i kırmaz, `content/isletme.ts` tohuma döner. */
function menuEnv(): Record<string, string> {
  try {
    const { belge, canliMi } = menuBelgesiKaynakla()
    // Sürüm yalnız build'e gömülen belge gerçekten canlı dosyadan geldiyse geçerlidir.
    const env = iletisimiEnveCevir(belge, canliMi ? canliSurum() : 0)
    return { NEXT_PUBLIC_ILETISIM: env.iletisim, NEXT_PUBLIC_MENU_SURUMU: env.surum }
  } catch (hata) {
    console.warn('next.config: menu belgesinden iletisim okunamadi, tohum iletisim kullanilacak', hata)
    return { NEXT_PUBLIC_MENU_SURUMU: '0' }
  }
}

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  // Çoklu root layout kullanıldığı için gerekli; Task 14'te global-not-found.tsx ile eşleşir
  experimental: { globalNotFound: true },
  env: menuEnv(),
}

export default nextConfig
