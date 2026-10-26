import { yonetim } from '../../content/yonetim.ts'
import { doldur } from '../metin.ts'
import { menuBelgesiDogrula } from './dogrulama.ts'
import { duyuruGoster } from './duyuru.ts'
import type { Degisiklik } from './fark.ts'
import { menuBelgesiTamamla, type Tamamlayici } from './tamamla.ts'
import type { Duyuru, MenuBelgesi } from './tipler.ts'

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

/** Hata taşıyan sekmeler (sekme satırındaki işaret); hiçbir sekmeye bağlanmayan yol sayılmaz. */
export function hataSekmeleri(yollar: Iterable<string>): ReadonlySet<Sekme> {
  const sekmeler = new Set<Sekme>()
  for (const yol of yollar) {
    const sekme = hataSekmesi(yol)
    if (sekme) sekmeler.add(sekme)
  }
  return sekmeler
}

/**
 * `kok` kaydının ("kalemler[2]") altında `gorunen` dışında bir hata yolu varsa `true`: kapalı kartta
 * görünmeyen alandaki hata kartı açar, kapalıyken de görünen fiyat hatası açmaz.
 */
export function kayitHatali(yollar: Iterable<string>, kok: string, gorunen: readonly string[] = []): boolean {
  for (const yol of yollar) {
    const altinda = yol === kok || yol.startsWith(`${kok}.`) || yol.startsWith(`${kok}[`)
    if (altinda && !gorunen.includes(yol)) return true
  }
  return false
}

const y = yonetim.menu.durum

type YayinGirdisi = { hataSayisi: number; ilkHata: Sekme | null; degisiklik: number; eski: boolean }
type YayinDurumu = { metin: string; kapali: boolean }

/** Alt barın tek satırı ve Yayınla'nın kapalı olup olmadığı. `eski`: yayındaki sürüm 1. sürüm biçiminde. */
export function yayinDurumu({ hataSayisi, ilkHata, degisiklik, eski }: YayinGirdisi): YayinDurumu {
  if (hataSayisi > 0) {
    const metin = ilkHata
      ? doldur(y.hataSekmede, { sayi: hataSayisi, sekme: yonetim.menu.sekme[ilkHata] })
      : doldur(y.hata, { sayi: hataSayisi })
    return { metin, kapali: true }
  }
  if (degisiklik > 0) return { metin: doldur(y.degisiklik, { sayi: degisiklik }), kapali: false }
  return eski ? { metin: y.eski, kapali: false } : { metin: y.yok, kapali: true }
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

type SiteDurumu = { guncel: boolean; metin: string; kisa: string }

/**
 * Yayındaki sürümle sitenin build'e gömdüğü sürümü karşılaştırır; `siteSurum <= 0` tohum demektir.
 * `kisa`: üst barın tek satırı, `metin`: neyin site yayını beklediğini de söyleyen tam cümle.
 */
export function siteDurumu(yayinSurum: number | null, siteSurum: number): SiteDurumu {
  const k = s.kisa
  if (siteSurum <= 0) {
    return yayinSurum === null
      ? { guncel: true, metin: s.tohum, kisa: k.tohum }
      : { guncel: false, metin: `${s.tohum} ${s.fark}`, kisa: doldur(k.tohumFark, { panel: yayinSurum }) }
  }
  if (yayinSurum === null || yayinSurum === siteSurum) {
    return { guncel: true, metin: doldur(s.guncel, { site: siteSurum }), kisa: doldur(k.guncel, { site: siteSurum }) }
  }
  const surumler = { site: siteSurum, panel: yayinSurum }
  return { guncel: false, metin: doldur(s.farkli, surumler), kisa: doldur(k.farkli, surumler) }
}

/** Fark satırı telefonun sitede görünür olmasına geçiyorsa `true` (onay ekranı satırı vurgular). */
export const telefonAciliyor = (d: Degisiklik): boolean => d.yol === 'iletisim.telefonAcik' && d.sonra === 'açık'

/** Duyuru açık ama şu an sitede görünmeyecek (bitiş geçmiş ya da metin boş); saate bağlı, doğrulayıcıda değil. */
export const duyuruGorunmeyecek = (d: Duyuru, simdi: Date): boolean => d.aktif && !duyuruGoster(d, simdi)

/** Kaydedilmemiş çalışma kopyasının `localStorage` anahtarı. */
export const TASLAK_ANAHTARI = 'bozo-yonetim-taslak'

/** `taban`: çalışma kopyasının dayandığı yayın sürümü (yayın yoksa `null`). */
export function taslakYaz(taban: number | null, belge: MenuBelgesi): string {
  return JSON.stringify({ taban, belge })
}

export type TaslakSonucu =
  | { tur: 'yok' }
  | { tur: 'geri'; belge: MenuBelgesi }
  | { tur: 'eski' }
  | { tur: 'bozuk'; neden: string }

/**
 * Saklı taslağı okur. Taban `taban` ile aynıysa belge döner; yayın araya girdiyse `eski`. Taslak yarım
 * iş olabilir (boş EN, 0 fiyat): içerik hataları geri yüklemeyi engellemez, yalnız yapı hatası (`sema`).
 */
export function taslakOku(ham: string | null, taban: number | null, tam: Tamamlayici): TaslakSonucu {
  if (ham === null) return { tur: 'yok' }
  let kayit: unknown
  try {
    kayit = JSON.parse(ham)
  } catch {
    return { tur: 'bozuk', neden: 'JSON okunamadı' }
  }
  if (typeof kayit !== 'object' || kayit === null || !('belge' in kayit) || !('taban' in kayit)) {
    return { tur: 'bozuk', neden: 'taban ya da belge yok' }
  }
  if (kayit.taban !== null && typeof kayit.taban !== 'number') return { tur: 'bozuk', neden: 'taban sayı değil' }
  if (kayit.taban !== taban) return { tur: 'eski' }
  const girdi = menuBelgesiTamamla(kayit.belge, tam)
  const sonuc = menuBelgesiDogrula(girdi)
  if (sonuc.tamam) return { tur: 'geri', belge: sonuc.belge }
  const yapi = sonuc.hatalar.filter((h) => h.kod === 'sema')
  if (yapi.length === 0) return { tur: 'geri', belge: girdi as MenuBelgesi }
  return { tur: 'bozuk', neden: yapi.map((h) => `${h.yol} (${h.metin})`).join('; ') }
}
