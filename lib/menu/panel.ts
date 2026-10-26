import { menuBelgesiDogrula } from './dogrulama.ts'
import { menuBelgesiTamamla, type Tamamlayici } from './tamamla.ts'
import type { MenuBelgesi } from './tipler.ts'

/* Panelin saf yardımcıları: bitiş alanı dönüşümü ve sunucudan gelen belgenin panel biçimine getirilmesi. */

const BITIS_DAKIKA = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?$/

/**
 * `datetime-local` değeri belge değerine: boş `null`. Belge `bitis`i Girne duvar saati tutar
 * (`Duyuru.bitis`), tarayıcı alanı da saat dilimsiz; yani yaz ya da kış, dönüşümde sapma yoktur.
 * Biçimi bozuk girdi olduğu gibi geçer, doğrulayıcı alanın yanında reddeder.
 */
export function bitisGirdisindenDegere(girdi: string): string | null {
  const s = girdi.trim()
  if (s === '') return null
  return BITIS_DAKIKA.exec(s)?.[1] ?? s
}

export function degerdenBitisGirdisine(deger: string | null): string {
  return deger ?? ''
}

/** Sunucudaki sürüm 1. sürüm biçimindeyse (yeni bölümlerden biri yok) `true`. */
export function eskiBelgeMi(girdi: unknown): boolean {
  if (typeof girdi !== 'object' || girdi === null) return false
  return (['duyuru', 'ikramlar', 'iletisim'] as const).some((b) => (girdi as Record<string, unknown>)[b] === undefined)
}

/** Panele giren belge doğrulamadan geçemedi; `message` hatalı alan yollarını sayar. */
export class BelgeHatasi extends Error {}

/**
 * Sunucudan gelen her belge (yayındaki, geçmiş sürüm, geri alma sonucu) önce eksik bölümleri `tam`dan
 * alır, sonra doğrulanır: çalışma kopyası hep 2. sürüm biçimindedir. Geçersizse `BelgeHatasi` atar.
 */
export function panelBelgesi(girdi: unknown, tam: Tamamlayici): MenuBelgesi {
  const sonuc = menuBelgesiDogrula(menuBelgesiTamamla(girdi, tam))
  if (sonuc.tamam) return sonuc.belge
  throw new BelgeHatasi(`belge panele açılamadı: ${sonuc.hatalar.map((h) => `${h.yol} (${h.metin})`).join('; ')}`)
}
