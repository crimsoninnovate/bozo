import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { menuBelgesiDogrula } from './dogrulama.ts'
import { menuBelgesiTamamla } from './tamamla.ts'
import type { MenuBelgesi, MenuKalemi } from './tipler.ts'

const CANLI_DOSYA = join('content', 'menu.canli.json')
const VARSAYILAN_DOSYA = join('content', 'menu.varsayilan.json')

/**
 * Dosyayı okuyup doğrular; geçersizse nedenini `console.warn` ile yazar ve `null` döner.
 * `tam`: 1. sürüm belgenin eksik bölümlerini tamamlar.
 */
function dosyadanOku(yol: string, tam?: MenuBelgesi): MenuBelgesi | null {
  let girdi: unknown
  try {
    girdi = JSON.parse(readFileSync(yol, 'utf8'))
  } catch (hata) {
    console.warn(`menuBelgesiYukle: ${yol} okunamadı, varsayılan belge kullanılıyor`, hata)
    return null
  }
  const sonuc = menuBelgesiDogrula(tam ? menuBelgesiTamamla(girdi, tam) : girdi)
  if (sonuc.tamam) return sonuc.belge
  const ozet = sonuc.hatalar.map((h) => `${h.yol}: ${h.metin}`).join('; ')
  console.warn(`menuBelgesiYukle: ${yol} geçersiz, varsayılan belge kullanılıyor: ${ozet}`)
  return null
}

/**
 * Derleme zamanı menü belgesi ve kaynağı: `content/menu.canli.json` varsa ve geçerliyse o
 * (`canliMi: true`), değilse `content/menu.varsayilan.json`. Yalnız sunucu koduna aittir
 * (`node:fs`); `'use client'` modülünden içe aktarılmaz.
 */
export function menuBelgesiKaynakla(kok: string = process.cwd()): { belge: MenuBelgesi; canliMi: boolean } {
  const varsayilan = join(kok, VARSAYILAN_DOSYA)
  const tohum = dosyadanOku(varsayilan)
  if (!tohum) throw new Error(`menuBelgesiYukle: varsayılan belge geçersiz: ${varsayilan}`)
  const canli = join(kok, CANLI_DOSYA)
  const belge = existsSync(canli) ? dosyadanOku(canli, tohum) : null
  return belge ? { belge, canliMi: true } : { belge: tohum, canliMi: false }
}

export function menuBelgesiYukle(kok: string = process.cwd()): MenuBelgesi {
  return menuBelgesiKaynakla(kok).belge
}

/**
 * Ana sayfanın ocakbaşı listesi: belgenin sırasıyla, yalnız ana sözlükte metni olan kalemler.
 * Menüden silinen kalem düşer, sözlükte karşılığı olmayan yeni kalem ana sayfada çıkmaz.
 */
export function anaSayfaKalemleri(belge: MenuBelgesi, anaKimlikleri: readonly string[]): MenuKalemi[] {
  const izinli = new Set(anaKimlikleri)
  return belge.kalemler.filter((kalem) => izinli.has(kalem.id))
}
