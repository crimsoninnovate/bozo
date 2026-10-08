import type { RotaAnahtari, SayfaAnahtari } from './site.ts'

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
  | 'ocakbasi'
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
export function ustBarVaryanti(aktif: SayfaAnahtari): UstBarVaryanti {
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
      // Galeri bu barda YOK, diğer üçünde var. Gerekçe tasarımın kendisi:
      // `Menu Sayfasi.dc.html:50-54` beş öğe listeler, altıncısı yok.
      // (Eski gerekçe 781-802px bandında kırpılmaydı; eşik 13 Ağustos 2026'da
      // 960px'e çıkınca o bant tümüyle çekmece bölgesinde kaldı, bkz. UstBar.)
      return {
        anaVaryantMi: false,
        nav: [
          { tur: 'capa', hedef: 'ocakbasi', etiket: 'ocakbasi' },
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
    case 'oyun':
      // Tasarımda yok. İç sayfa varsayılanı; CTA ana sayfanınkiyle aynı.
      return { anaVaryantMi: false, nav: IC_NAV, cta: { tur: 'harici' } }
  }
}

/**
 * O rotanın üst barındaki sayfa içi çapalar. İki tüketici var: çekmecenin alt satırı
 * ve menü sayfasının atlama çipleri; ikisi de barın kendi listesinden türer.
 */
export function barCapalari(rota: SayfaAnahtari): { hedef: string; etiket: NavEtiketi }[] {
  return ustBarVaryanti(rota).nav.flatMap((o) =>
    o.tur === 'capa' ? [{ hedef: o.hedef, etiket: o.etiket }] : [],
  )
}

export type CekmeceLinki = {
  rota: RotaAnahtari
  etiket: NavEtiketi
  /** O sayfanın masaüstü barındaki bölüm çapaları; çekmecede satırın altına iner. */
  altlar: { hedef: string; etiket: NavEtiketi }[]
}

/**
 * Mobil çekmecenin link listesi. `Mobil Prototip.dc.html:201-205` beş satır
 * yazıyor: Menü / Hikaye / Konum / Galeri / Rezervasyon. Rezervasyon rotası yok
 * (sahibi "şimdilik gerekli değil" dedi), kalan dördü `IC_NAV` ile aynı sıra.
 *
 * Liste burada, `Cekmece.tsx`'te değil: elle yazılmış ikinci bir liste rota
 * tablosundan sessizce ayrılır. Galeri rotası açıldığında tam bu oldu, çekmece
 * üç linkte kaldı ve dar ekranda Galeri'ye üst gezinmeden hiç girilemedi.
 *
 * Alt çapalar aynı gerekçeyle türetilir: menü barının üç çapası (Ocakbaşı,
 * İkramlar, İçecekler) 1040 altında hiçbir yerde yoktu (18 Ağustos 2026).
 */
export function cekmeceLinkleri(): CekmeceLinki[] {
  return IC_NAV.flatMap((o) =>
    o.tur === 'rota' ? [{ rota: o.rota, etiket: o.etiket, altlar: barCapalari(o.rota) }] : [],
  )
}
