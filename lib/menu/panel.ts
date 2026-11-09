import { yonetim } from '../../content/yonetim.ts'
import { doldur } from '../metin.ts'
import { ApiHatasi, tekrarDenenebilirMi } from '../oyun/api.ts'
import type { DerlemeDurumu } from './aktarim.ts'
import { menuBelgesiDogrula, metinleriAyikla } from './dogrulama.ts'
import { duyuruGoster } from './duyuru.ts'
import { metinEtiketi, type Degisiklik } from './fark.ts'
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
  const sonuc = menuBelgesiDogrula(metinleriAyikla(menuBelgesiTamamla(girdi, tam)))
  if (sonuc.tamam) return sonuc.belge
  throw new BelgeHatasi(`belge panele açılamadı: ${sonuc.hatalar.map((h) => `${h.yol} (${h.metin})`).join('; ')}`)
}

/** Panel sekmeleri; `hataSekmesi` bir doğrulama yolunu bunlardan birine bağlar. */
export const SEKMELER = [
  'ocakbasi', 'ozel', 'icecekler', 'ikramlar', 'duyuru', 'saatler', 'iletisim', 'metinler', 'fotograflar',
  'gecmis', 'kullanicilar',
] as const
export type Sekme = (typeof SEKMELER)[number]

/** Kullanıcılar yalnız adminde; sunucu da 403 `adminGerekli` verir. */
export function gorunurSekmeler(admin: boolean): readonly Sekme[] {
  return admin ? SEKMELER : SEKMELER.filter((s) => s !== 'kullanicilar')
}

/** Sık işler önde: fiyat ve "tükendi" Menü'de, duyuru İşletme'nin başında (sahibi, 9 Kasım 2026). */
const GRUPLAR = {
  menu: ['ocakbasi', 'ozel', 'icecekler', 'ikramlar'],
  isletme: ['duyuru', 'saatler', 'iletisim'],
  icerik: ['metinler', 'fotograflar'],
  yayin: ['gecmis'],
  hesaplar: ['kullanicilar'],
} as const satisfies Record<string, readonly Sekme[]>
export type SekmeGrubu = keyof typeof GRUPLAR

/** Masaüstü kenar menüsünün başlıklı grupları; telefonda aynı sıra tek satırdır. Boş grup düşer. */
export function sekmeGruplari(admin: boolean): { grup: SekmeGrubu; sekmeler: Sekme[] }[] {
  const gorunur = new Set(gorunurSekmeler(admin))
  return (Object.keys(GRUPLAR) as SekmeGrubu[])
    .map((grup) => ({ grup, sekmeler: GRUPLAR[grup].filter((s) => gorunur.has(s)) }))
    .filter((g) => g.sekmeler.length > 0)
}

const YOL_SEKMELERI: Record<string, Sekme> = {
  kalemler: 'ocakbasi', ozel: 'ozel', icecekler: 'icecekler', ikramlar: 'ikramlar', duyuru: 'duyuru',
  iletisim: 'iletisim', saatler: 'saatler', fotograflar: 'fotograflar', metinler: 'metinler',
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

/** Alt barın tek satırı ve Yayınla'nın durumu. `eski`: yayındaki sürüm 1. sürüm biçiminde. */
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

const d = yonetim.menu.derleme

/** Panel durumu yalnız bu iki aşamada yoklar; `bos`, `yayinda` ve `hata` kalıcıdır. */
export function derlemeSuruyor(durum: DerlemeDurumu | null): boolean {
  return durum?.asama === 'sirada' || durum?.asama === 'derleniyor'
}

/** Panel açıkken biten derleme sitenin sürümünü öne alır; sayfanın gömülü sürümü yenilenene kadar eski kalır. */
export function etkinSiteSurumu(siteSurum: number, durum: DerlemeDurumu | null): number {
  return durum?.asama === 'yayinda' && durum.surum !== null ? Math.max(siteSurum, durum.surum) : siteSurum
}

/** "Siteyi Güncelle" pasif: site yayındaki sürümle aynı ya da bir derleme zaten sırada veya sürüyor. */
export function guncelleKapali(yayinSurum: number | null, siteSurum: number, durum: DerlemeDurumu | null): boolean {
  return derlemeSuruyor(durum) || (yayinSurum ?? 0) === etkinSiteSurumu(siteSurum, durum)
}

/** Aşamanın tek cümlesi; `siteSurum`: sayfanın gömülü sürümü, daha yeni yayın "yenileyince görünür" der. */
export function derlemeMetni(durum: DerlemeDurumu, siteSurum: number): string {
  if (durum.asama !== 'yayinda') return d[durum.asama]
  if (durum.surum === null) return d.yayindaSurumsuz
  return doldur(durum.surum > siteSurum ? d.yeni : d.yayinda, { surum: durum.surum })
}

const GUNLUK_SATIRI = 20

/** Hata ayrıntısı: günlüğün son 20 satırı. */
export const derlemeGunlugu = (durum: DerlemeDurumu): string[] => durum.gunluk.slice(-GUNLUK_SATIRI)

/** Yoklamayı durdurmayan hata: ağ, hız sınırı, sunucu. `derlemeKapali` kalıcıdır, 401 oturumu kapatır. */
export function derlemeGecici(h: unknown): boolean {
  return h instanceof ApiHatasi && h.kod !== 'derlemeKapali' && tekrarDenenebilirMi(h)
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
  const girdi = metinleriAyikla(menuBelgesiTamamla(kayit.belge, tam))
  const sonuc = menuBelgesiDogrula(girdi)
  if (sonuc.tamam) return { tur: 'geri', belge: sonuc.belge }
  const yapi = sonuc.hatalar.filter((h) => h.kod === 'sema')
  if (yapi.length === 0) return { tur: 'geri', belge: girdi as MenuBelgesi }
  return { tur: 'bozuk', neden: yapi.map((h) => `${h.yol} (${h.metin})`).join('; ') }
}

/** Bir sorun yolunu ("kalemler[2].ad.tr") kaydın Türkçe adına çevirir; çözemezse yolu olduğu gibi verir. */
export function sorunYeri(belge: MenuBelgesi, yol: string): string {
  const liste = /^(kalemler|icecekler)\[(\d+)\]/.exec(yol)
  if (liste) return belge[liste[1] as 'kalemler' | 'icecekler'][Number(liste[2])]?.ad.tr ?? yol
  const oge = /^ikramlar\.gruplar\[(\d+)\]\.ogeler\[(\d+)\]/.exec(yol)
  if (oge) return belge.ikramlar.gruplar[Number(oge[1])]?.ogeler[Number(oge[2])]?.ad.tr ?? yol
  const ikram = /^ikramlar\.(urunler|gruplar)\[(\d+)\]/.exec(yol)
  if (ikram) return belge.ikramlar[ikram[1] as 'urunler' | 'gruplar'][Number(ikram[2])]?.ad.tr ?? yol
  const sekme = yonetim.menu.sekme
  if (yol.startsWith('ozel')) return belge.ozel.ad.tr
  if (yol.startsWith('ikramlar')) return sekme.ikramlar
  if (yol.startsWith('duyuru')) return sekme.duyuru
  const metin = /^metinler\.(tr|en)\.(.+)$/.exec(yol)
  if (metin?.[2]) return metinEtiketi(metin[2])
  return yol
}
