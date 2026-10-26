import { yonetim } from '../../content/yonetim.ts'
import { doldur } from '../metin.ts'
import { menuBelgesiDogrula } from './dogrulama.ts'
import type { Degisiklik } from './fark.ts'
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

/** Panel sekmeleri; `hataSekmesi` bir doğrulama yolunu bunlardan birine bağlar. */
export const SEKMELER = ['ocakbasi', 'ozel', 'icecekler', 'ikramlar', 'duyuru', 'iletisim', 'gecmis'] as const
export type Sekme = (typeof SEKMELER)[number]

const YOL_SEKMELERI: Record<string, Sekme> = {
  kalemler: 'ocakbasi', ozel: 'ozel', icecekler: 'icecekler', ikramlar: 'ikramlar', duyuru: 'duyuru',
  iletisim: 'iletisim',
}

/** "iletisim.eposta" gibi doğrulama yolunun düzenlendiği sekme; tanımsız yol `null`. */
export function hataSekmesi(yol: string): Sekme | null {
  return YOL_SEKMELERI[/^[a-z]+/.exec(yol)?.[0] ?? ''] ?? null
}

/** Anahtar sırasından bağımsız, alan alan eşitlik (diziler sıralı). */
function esit(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const ka = Object.keys(a)
  if (ka.length !== Object.keys(b).length) return false
  return ka.every((k) => k in b && esit((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]))
}

/** Çalışma kopyası yayındakinden farklıysa `true`; kaydedilmemiş değişiklik koruması bunu kullanır. */
export function degisiklikVarMi(yayindaki: MenuBelgesi, calisma: MenuBelgesi): boolean {
  return !esit(yayindaki, calisma)
}

/** `NEXT_PUBLIC_MENU_SURUMU` değeri: eksik ya da bozuksa 0 (site tohum menüyle basılmış). */
export function siteSurumuOku(ham: string | undefined): number {
  const n = Number(ham)
  return Number.isInteger(n) && n > 0 ? n : 0
}

const s = yonetim.menu.site

/** Yayındaki sürümle sitenin build'e gömdüğü sürümü karşılaştırır; `siteSurum <= 0` tohum demektir. */
export function siteDurumu(yayinSurum: number | null, siteSurum: number): { guncel: boolean; metin: string } {
  if (siteSurum <= 0) {
    return yayinSurum === null ? { guncel: true, metin: s.tohum } : { guncel: false, metin: `${s.tohum} ${s.fark}` }
  }
  if (yayinSurum === null || yayinSurum === siteSurum) {
    return { guncel: true, metin: doldur(s.guncel, { site: siteSurum }) }
  }
  return { guncel: false, metin: doldur(s.farkli, { site: siteSurum, panel: yayinSurum }) }
}

/** Fark satırı telefonun sitede görünür olmasına geçiyorsa `true` (onay ekranı satırı vurgular). */
export const telefonAciliyor = (d: Degisiklik): boolean => d.yol === 'iletisim.telefonAcik' && d.sonra === 'açık'
