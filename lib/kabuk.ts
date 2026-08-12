import type { RotaAnahtari } from './site.ts'

/**
 * Kabuğun rota başına değişen parçaları tek yerde.
 *
 * Tasarımın beş `.dc.html` dosyası aynı kabuğu basmaz: üst barın nav listesi ve
 * CTA hedefi ile alt bilginin tümü sayfaya göre değişir. Bu tablo o farkı
 * kaynağından (dosya + satır) taşır; `UstBar` ve `AltBilgi` yalnız burada
 * yazılanı render eder, kendi kararını vermez.
 *
 * Ölçülen kaynak satırları:
 * - Ana sayfa üst barı `Ana Sayfa Alternatif.dc.html:40-61`
 * - Menü üst barı `Menu Sayfasi.dc.html:37-58`
 * - Hikaye üst barı `Hikaye Sayfasi.dc.html:37-56`
 * - Konum üst barı `Konum Sayfasi.dc.html:37-56`
 * - Footer'lar `Ana:351-386`, `Hikaye:134-163`, `Konum:166-194`, `Menu:283-292`
 */

/** `ortak.nav` içindeki etiket anahtarları. Nav metni yalnız oradan gelir. */
export type NavEtiketi =
  | 'anaSayfa'
  | 'menu'
  | 'galeri'
  | 'gece'
  | 'hikaye'
  | 'konum'
  | 'ocaktan'
  | 'ikramlar'
  | 'icecekler'
  | 'gizlilik'

export type NavOgesi =
  | { tur: 'rota'; rota: RotaAnahtari; etiket: NavEtiketi }
  /** Aynı belgede kaydırma; `hedef` bölümün `id` değeridir. */
  | { tur: 'capa'; hedef: string; etiket: NavEtiketi }

export type UstBarCta =
  /** Harici yol tarifi araması (`lib/site.ts` > `yolTarifiUrl`). */
  | { tur: 'harici' }
  | { tur: 'rota'; rota: RotaAnahtari }
  | { tur: 'capa'; hedef: string }

export type UstBarVaryanti = {
  /** true: 80px satır + 2px ilerleme rayı (Ana:41,46). false: 78px, raysız (Menu:37,42). */
  anaVaryantMi: boolean
  nav: NavOgesi[]
  cta: UstBarCta
}

export type AltBilgiVaryanti = 'tam' | 'sayfalar' | 'serit'

/** Rota anahtarının `ortak.nav` içindeki etiket anahtarı. Yalnız `ana` ayrışır. */
const NAV_ETIKETI: Record<RotaAnahtari, NavEtiketi> = {
  ana: 'anaSayfa',
  menu: 'menu',
  galeri: 'galeri',
  hikaye: 'hikaye',
  konum: 'konum',
  gizlilik: 'gizlilik',
}

/**
 * Hikaye, Konum, Galeri ve tasarımda karşılığı olmayan rotaların ortak nav'ı.
 *
 * `galeri` sonda: tasarımın çekmece listesi Menü/Hikaye/Konum/Galeri sırasını
 * yazıyor (`Mobil Prototip.dc.html`, bkz. IYILESTIRMELER.md). O listede Galeri
 * vardı ve yalnız rotası olmadığı için düşmüştü; rota kurulunca geri geliyor,
 * uydurulmuş bir sıra değil.
 */
const IC_NAV: NavOgesi[] = [
  { tur: 'rota', rota: 'menu', etiket: 'menu' },
  { tur: 'rota', rota: 'hikaye', etiket: 'hikaye' },
  { tur: 'rota', rota: 'konum', etiket: 'konum' },
  { tur: 'rota', rota: 'galeri', etiket: 'galeri' },
]

/**
 * Aktif sekme ayrı bir bayrak taşımaz: navdaki bir `rota` öğesi bulunulan
 * rotaya eşitse işaretlenir. Tasarımın dördü de bu kuralla birebir çıkar,
 * menü sayfası dahil (menü nav'ında `menu` öğesi yok, bu yüzden orada aktif
 * sekme de yok, `Menu:50-54`).
 */
export function ustBarVaryanti(aktif: RotaAnahtari): UstBarVaryanti {
  switch (aktif) {
    case 'ana':
      return {
        anaVaryantMi: true,
        nav: [
          { tur: 'rota', rota: 'menu', etiket: 'menu' },
          { tur: 'capa', hedef: 'gece', etiket: 'gece' },
          { tur: 'rota', rota: 'hikaye', etiket: 'hikaye' },
          { tur: 'rota', rota: 'konum', etiket: 'konum' },
          { tur: 'rota', rota: 'galeri', etiket: 'galeri' },
        ],
        // Ana:61 hedefi olmayan bir <div>; port ölü bir kutu basamaz, harici
        // yol tarifi aramasına bağlanır (Task 6 kararı, burada korunuyor).
        cta: { tur: 'harici' },
      }
    case 'menu':
      // Galeri bu barda YOK, diğer üçünde var. Ölçüldü: menü barı tasarımın en
      // kalabalığı (üç sayfa içi çapa + iki rota) ve altıncı öğe satırı 731px'ten
      // 803px'e çıkarıyor; 781-802px bandında "Yol tarifi al" butonu ekranın
      // dışına taşıyor. Nav 780px altında zaten çekmeceye düşer, yani kırılan
      // bant dar ama gerçek. Kırık bir CTA eksik bir nav öğesinden kötü.
      return {
        anaVaryantMi: false,
        nav: [
          { tur: 'capa', hedef: 'ocaktan', etiket: 'ocaktan' },
          { tur: 'capa', hedef: 'ikramlar', etiket: 'ikramlar' },
          { tur: 'capa', hedef: 'icecekler', etiket: 'icecekler' },
          { tur: 'rota', rota: 'hikaye', etiket: 'hikaye' },
          { tur: 'rota', rota: 'konum', etiket: 'konum' },
        ],
        // Menu:58 de Ana:61 gibi hedefsiz; aynı çözüm uygulanır.
        cta: { tur: 'harici' },
      }
    case 'hikaye':
      // Hikaye:56 <a href="Konum Sayfasi.dc.html">, harici harita değil.
      return { anaVaryantMi: false, nav: IC_NAV, cta: { tur: 'rota', rota: 'konum' } }
    case 'konum':
      // Konum:56 data-git="harita", yani sayfa içi kaydırma.
      return { anaVaryantMi: false, nav: IC_NAV, cta: { tur: 'capa', hedef: 'harita' } }
    case 'galeri':
    case 'gizlilik':
      // Tasarımda yok. İç sayfa varsayılanı; CTA ana sayfanınkiyle aynı.
      return { anaVaryantMi: false, nav: IC_NAV, cta: { tur: 'harici' } }
  }
}

/**
 * Mobil çekmecenin link listesi. `Mobil Prototip.dc.html:201-205` beş satır
 * yazıyor: Menü / Hikaye / Konum / Galeri / Rezervasyon. Rezervasyon rotası yok
 * (sahibi "şimdilik gerekli değil" dedi), kalan dördü `IC_NAV` ile aynı sıra.
 *
 * Liste burada, `Cekmece.tsx`'te değil: elle yazılmış ikinci bir liste rota
 * tablosundan sessizce ayrılır. Galeri rotası açıldığında tam bu oldu, çekmece
 * üç linkte kaldı ve dar ekranda Galeri'ye üst gezinmeden hiç girilemedi.
 */
export function cekmeceLinkleri(): { rota: RotaAnahtari; etiket: NavEtiketi }[] {
  return IC_NAV.filter((o) => o.tur === 'rota').map((o) => ({ rota: o.rota, etiket: o.etiket }))
}

/**
 * Gece şeridi yalnız sayfanın başka canlı durum göstergesi olmadığı rotalarda.
 *
 * Ölçüm (Girne 03:36-03:47): ana, menü ve konum aynı olguyu üç dört kez söylüyor
 * (şerit + hero durum çipi + canlı saat / saat tablosu); hikaye, gizlilik ve
 * galeride şerit tek kaynak. Ölçüt sayfa kimliği değil, o rotada başka bir canlı
 * gösterge olup olmadığı. Kayıtlı sapma, bkz. docs/surec/IYILESTIRMELER.md.
 */
export function geceSeridiGosterilirMi(aktif: RotaAnahtari): boolean {
  return aktif === 'hikaye' || aktif === 'gizlilik' || aktif === 'galeri'
}

/**
 * `tam`: dört kolon, adres ikonlu, iletişim satırları ayrı ayrı (Ana:351-386).
 * `sayfalar`: dört kolon ama ikincisi bağlantı listesi, ikon yok (Hikaye:134, Konum:166).
 * `serit`: kompakt tek şerit, telif şeridi yok (Menu:283-292).
 *
 * Gizlilik tasarımda yok; `tam` kalır, çünkü Gizlilik'e giden tek bağlantı o
 * varyantın telif şeridindedir ve rotayı kendi footer'ında da göstermek onu
 * ana sayfanın footer'ıyla aynı tutar.
 *
 * Galeri de tasarımda yok ama Hikaye ve Konum ile aynı türden bir iç içerik
 * sayfası, o yüzden onların `sayfalar` varyantını alır.
 */
export function altBilgiVaryanti(aktif: RotaAnahtari): AltBilgiVaryanti {
  if (aktif === 'menu') return 'serit'
  if (aktif === 'hikaye' || aktif === 'konum' || aktif === 'galeri') return 'sayfalar'
  return 'tam'
}

const FOOTER_SAYFA_SIRASI: RotaAnahtari[] = ['ana', 'menu', 'hikaye', 'konum', 'galeri']

/**
 * "Sayfalar" kolonunun bağlantıları: beş içerik rotası eksi bulunulan sayfa.
 * Hikaye'nin listesi tasarımla birebir (`Ana sayfa / Menü / Konum`, `Hikaye:142-144`).
 * Konum'un tasarımı Hikaye'yi de düşürüyor (`Konum:174-175`, yalnız iki bağlantı);
 * bu kuralın kendisiyle çelişen tek örnek ve gözden kaçmış görünüyor, bilinçli
 * sapma olarak kural uygulanır. Bkz. docs/surec/IYILESTIRMELER.md.
 */
export function altBilgiSayfaLinkleri(aktif: RotaAnahtari): { rota: RotaAnahtari; etiket: NavEtiketi }[] {
  return FOOTER_SAYFA_SIRASI.filter((rota) => rota !== aktif).map((rota) => ({
    rota,
    etiket: NAV_ETIKETI[rota],
  }))
}
