import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { canliMenuGetir } from '../lib/menu/canli.ts'
import type { MenuBelgesi } from '../lib/menu/tipler.ts'

const VARSAYILAN_API = 'https://api.cigercibozo.com'
const ZAMAN_ASIMI_MS = 10_000

export type CekmeSonucu = 'yazildi' | 'sunucudaYok' | 'basarisiz'

/*
 * Build öncesi: canlı menü sürümünü `hedef`e (`content/menu.canli.json`, gitignore) yazar; site
 * dosya varsa onu basar. Doğrulamayı ve hata loglarını `canliMenuGetir` yapar. Hata hedefe dokunmaz.
 * `tam`: 1. sürüm belgenin eksik bölümlerini tamamlar (yazılan dosya hep tam belgedir).
 */
export async function menuCek(
  kok: string, getir: typeof fetch, hedef: string, tam?: MenuBelgesi,
): Promise<CekmeSonucu> {
  let durum: number | null = null
  const izle = (async (...args: Parameters<typeof fetch>) => {
    const yanit = await getir(...args)
    durum = yanit.status
    return yanit
  }) as typeof fetch
  const yanit = await canliMenuGetir(kok, izle, ZAMAN_ASIMI_MS, tam)
  if (yanit === null) return durum === 204 ? 'sunucudaYok' : 'basarisiz'
  try {
    mkdirSync(dirname(hedef), { recursive: true })
    const gecici = `${hedef}.tmp`
    writeFileSync(gecici, `${JSON.stringify(yanit.belge, null, 2)}\n`)
    renameSync(gecici, hedef)
  } catch (hata) {
    console.warn('menuCek: dosya yazilamadi', hedef, hata)
    return 'basarisiz'
  }
  console.log(`menuCek: surum ${yanit.surum} yazildi`)
  return 'yazildi'
}

/** Tamamlama için tohum belge; okunamazsa uyarır ve `undefined` döner (prebuild çökmez). */
export function tohumuOku(yol: string): MenuBelgesi | undefined {
  try {
    return JSON.parse(readFileSync(yol, 'utf8')) as MenuBelgesi
  } catch (hata) {
    console.warn(`menuCek: tohum belge okunamadi (${yol}), 1. surum belgeler tamamlanmayacak`, hata)
    return undefined
  }
}

/** `basarisiz` çıkış kodunu bozmaz: build ağsız ortamda da derlenmiş menüyle çalışır. */
async function main(): Promise<void> {
  const kok = process.env['BOZO_MENU_API'] ?? VARSAYILAN_API
  const hedef = join('content', 'menu.canli.json')
  const tohum = tohumuOku(join('content', 'menu.varsayilan.json'))
  const sonuc = await menuCek(kok, fetch, hedef, tohum)
  if (sonuc === 'basarisiz') {
    console.warn(`menuCek: CANLI MENU ALINAMADI (${kok}); site derlenmis menuyle (ya da eski canli dosyayla) basilacak`)
  } else if (sonuc === 'sunucudaYok') {
    const kullanilan = existsSync(hedef) ? `mevcut ${hedef} (silinirse tohum)` : 'content/menu.varsayilan.json'
    console.log(`menuCek: sunucuda yayinlanmis surum yok, build ${kullanilan} dosyasini kullanacak`)
  }
}

if (import.meta.main) await main()
