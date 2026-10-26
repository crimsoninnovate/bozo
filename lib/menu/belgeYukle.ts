import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { menuBelgesiDogrula } from './dogrulama.ts'
import type { MenuBelgesi, MenuKalemi } from './tipler.ts'

const CANLI_DOSYA = join('content', 'menu.canli.json')
const VARSAYILAN_DOSYA = join('content', 'menu.varsayilan.json')

/** Dosyayı okuyup doğrular; geçersizse nedenini `console.warn` ile yazar ve `null` döner. */
function dosyadanOku(yol: string): MenuBelgesi | null {
  let girdi: unknown
  try {
    girdi = JSON.parse(readFileSync(yol, 'utf8'))
  } catch (hata) {
    console.warn(`menuBelgesiYukle: ${yol} okunamadı, varsayılan belge kullanılıyor`, hata)
    return null
  }
  const sonuc = menuBelgesiDogrula(girdi)
  if (sonuc.tamam) return sonuc.belge
  const ozet = sonuc.hatalar.map((h) => `${h.yol}: ${h.metin}`).join('; ')
  console.warn(`menuBelgesiYukle: ${yol} geçersiz, varsayılan belge kullanılıyor: ${ozet}`)
  return null
}

/**
 * Derleme zamanı menü belgesi: `content/menu.canli.json` varsa ve geçerliyse o, değilse
 * `content/menu.varsayilan.json`. Yalnız sunucu koduna aittir (`node:fs`); `'use client'`
 * modülünden içe aktarılmaz.
 */
export function menuBelgesiYukle(kok: string = process.cwd()): MenuBelgesi {
  const canli = join(kok, CANLI_DOSYA)
  if (existsSync(canli)) {
    const belge = dosyadanOku(canli)
    if (belge) return belge
  }
  const varsayilan = join(kok, VARSAYILAN_DOSYA)
  const belge = dosyadanOku(varsayilan)
  if (!belge) throw new Error(`menuBelgesiYukle: varsayılan belge geçersiz: ${varsayilan}`)
  return belge
}

/**
 * Ana sayfanın ocakbaşı listesi: belgenin sırasıyla, yalnız ana sözlükte metni olan kalemler.
 * Menüden silinen kalem düşer, sözlükte karşılığı olmayan yeni kalem ana sayfada çıkmaz.
 */
export function anaSayfaKalemleri(belge: MenuBelgesi, anaKimlikleri: readonly string[]): MenuKalemi[] {
  const izinli = new Set(anaKimlikleri)
  return belge.kalemler.filter((kalem) => izinli.has(kalem.id))
}
