import { rafKisitla } from './hareket'

/**
 * Ortak kaydırma çerçevesi.
 *
 * Tasarımın tek `cerceve()` fonksiyonunun ortak kısmını taşır: sahne
 * genelinde ihtiyaç duyulan `scroll`/`resize` dinleyici çiftini bir kez
 * kurar ve viewport merkezine en yakın `[data-yogunluk]` bölümünü kare
 * başına bir kez (rafKisitla ile) hesaplayıp tüm abonelere bildirir. Kor
 * yoğunluğu (KorSahnesi), bölüm erimesi (Bolum) ve ileride boncuk rayı
 * (BeadRay) bu ortak ölçümü paylaşır; her biri kendi DOM yazımını kendi
 * geri çağrımı içinde yapar, bu modül yalnız zamanlama ve ortak ölçüm
 * sağlar, stil yazmaz.
 *
 * Sözleşme:
 * - `cerceveyeAboneOl(geriCagrim)` çağrıldığında geri çağrım mevcut
 *   durumla hemen bir kez çalışır, sonra her `scroll`/`resize` olayında
 *   en fazla bir kez, bir sonraki animasyon karesinde çalışır.
 * - Dönen fonksiyon aboneliği kaldırır. Son abone ayrıldığında `scroll`
 *   ve `resize` dinleyicileri sökülür; bir sonraki ilk abonede yeniden
 *   kurulur. Abone sayısından bağımsız olarak uygulama genelinde her an
 *   en fazla bir `scroll` ve bir `resize` dinleyicisi vardır.
 * - Bu döngü `prefers-reduced-motion` durumunda da çalışmaya devam eder ve
 *   HİÇBİR yerde kendi başına `hareketAzaltilmisMi()` kontrolü yapmaz.
 *   Tasarımın kendi `cerceve()` gövdesinde `azalt` bayrağı yalnız erime
 *   (`data-erit`) hesabını sarar; yoğunluk ve boncuk hesabı bunun dışındadır
 *   ("Bead aktifligi ... azalt durumunda da calisir"). Ama tasarımı olduğu
 *   gibi kopyalamayın: prefers-reduced-motion "hiç görsel değişiklik olmasın"
 *   demek değildir, kaydırmaya bağlı kayma/ölçek/paralaks gibi baş dönmesi
 *   yapabilecek hareketleri hedefler; bir kararma (opacity) bunun dışındadır.
 *   Global geçişler zaten kapalı olduğundan, izlemeye devam eden bir `scale`
 *   yazımı her karede ANİDEN zıplar; bu, hiç izlememekten daha kötüdür. Bu
 *   yüzden her abone, kendi yazdığı değerlerden hangisinin "kararma" hangisinin
 *   "hareket" olduğuna kendi karar verir ve yalnız hareket olanı bastırır
 *   (bkz. `KorSahnesi`: opaklık izler, `scale` hareket azaltılmışsa nötr
 *   yoğunlukta sabitlenir; `Bolum`: kayma içerdiğinden hesap tamamen kapanır).
 *
 * Kullanım:
 * ```ts
 * useEffect(() => cerceveyeAboneOl(({ merkez, ekran, aktifBolum, aktifId, yogunluk }) => {
 *   // yalnız stil/DOM yazımı; ölçüm burada yapılmaz
 * }), [])
 * ```
 */

export type CerceveDurumu = {
  /** Viewport'un dikey ortası, piksel. */
  merkez: number
  /** Viewport yüksekliği, piksel. */
  ekran: number
  /** Merkeze en yakın `[data-yogunluk]` bölümü; hiçbiri yoksa null. */
  aktifBolum: HTMLElement | null
  /** aktifBolum'un `id` özniteliği; bölüm yoksa veya id'siz ise null. */
  aktifId: string | null
  /** aktifBolum'un `data-yogunluk` değeri; bölüm yoksa 1. */
  yogunluk: number
}

export type CerceveAbonesi = (durum: CerceveDurumu) => void

const aboneler = new Set<CerceveAbonesi>()
let guncelle: (() => void) | null = null

function olc(): CerceveDurumu {
  const ekran = window.innerHeight
  const merkez = ekran / 2
  const bolumler = Array.from(document.querySelectorAll<HTMLElement>('[data-yogunluk]'))
  let aktifBolum: HTMLElement | null = null
  let ikinci: HTMLElement | null = null
  let enKisa = Number.POSITIVE_INFINITY
  let ikinciUzaklik = Number.POSITIVE_INFINITY
  for (const bolum of bolumler) {
    const kutu = bolum.getBoundingClientRect()
    const uzaklik = Math.abs(kutu.top + kutu.height / 2 - merkez)
    if (uzaklik < enKisa) {
      ikinci = aktifBolum
      ikinciUzaklik = enKisa
      enKisa = uzaklik
      aktifBolum = bolum
    } else if (uzaklik < ikinciUzaklik) {
      ikinci = bolum
      ikinciUzaklik = uzaklik
    }
  }
  // Yoğunluk basamak değil rampa (F9, 18 Ağustos 2026): iki komşu merkez arasında
  // ağırlıklı ortalama. Her bölüm kendi merkezinde tablo değerini alır; aktif
  // bölüm (boncuk rayı) en yakın olan kalır. Tasarımın "en küçük d kazanır"ından
  // kayıtlı sapma: altı sınırda -18/-8/+16/0/-29/-6% tek kare basamak ölçülmüştü.
  const y1 = Number(aktifBolum?.dataset.yogunluk ?? 1)
  const y2 = ikinci ? Number(ikinci.dataset.yogunluk ?? y1) : y1
  const w = ikinci ? enKisa / (enKisa + ikinciUzaklik) : 0
  const yogunluk = y1 * (1 - w) + y2 * w
  return { merkez, ekran, aktifBolum, aktifId: aktifBolum?.id ?? null, yogunluk }
}

function bildir() {
  const durum = olc()
  for (const abone of aboneler) abone(durum)
}

/** Ortak çerçeveye abone olur; dönen fonksiyon aboneliği kaldırır. */
export function cerceveyeAboneOl(abone: CerceveAbonesi): () => void {
  if (aboneler.size === 0) {
    guncelle = rafKisitla(bildir)
    window.addEventListener('scroll', guncelle, { passive: true })
    window.addEventListener('resize', guncelle, { passive: true })
  }
  aboneler.add(abone)
  abone(olc())

  return () => {
    aboneler.delete(abone)
    if (aboneler.size === 0 && guncelle) {
      window.removeEventListener('scroll', guncelle)
      window.removeEventListener('resize', guncelle)
      guncelle = null
    }
  }
}
