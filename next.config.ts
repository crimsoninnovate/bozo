import { existsSync, readFileSync } from 'node:fs'
import type { NextConfig } from 'next'
import { menuBelgesiYukle } from './lib/menu/belgeYukle.ts'
import { iletisimiEnveCevir } from './lib/menu/iletisimEnv.ts'

const CANLI_DOSYA = 'content/menu.canli.json'
const META_DOSYA = 'content/menu.canli.meta.json'

/** `menuCek`in yazdığı sürüm; canlı dosya yoksa ya da meta okunamazsa 0 (tohum). */
function canliSurum(): number {
  if (!existsSync(CANLI_DOSYA) || !existsSync(META_DOSYA)) return 0
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
  const surum = canliSurum()
  try {
    const env = iletisimiEnveCevir(menuBelgesiYukle(), surum)
    return { NEXT_PUBLIC_ILETISIM: env.iletisim, NEXT_PUBLIC_MENU_SURUMU: env.surum }
  } catch (hata) {
    console.warn('next.config: menu belgesinden iletisim okunamadi, tohum iletisim kullanilacak', hata)
    return { NEXT_PUBLIC_MENU_SURUMU: String(surum) }
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
