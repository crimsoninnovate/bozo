'use client'

import { useEffect, useRef, useState } from 'react'
import { useHareketAzaltilmisMi } from '@/lib/hareket'

type Props = {
  hedef: number
  /** Sayma süresi, ms. */
  sure?: number
}

const VARSAYILAN_SURE = 900
/** Görünürlüğün yarısı: tasarımın sayaç gözlemcisinin eşiği. */
const ESIK = 0.5

/**
 * Bölüm görünür olunca 0'dan hedefe bir kez sayan rakam. Ana:135, 143
 *
 * İlk değer `hedef`tir, 0 değil. Tasarımda hedef doğrudan işaretlemede duruyor
 * (`<div data-sayac="8">8</div>`) ve JS yalnız görünür olunca üstüne yazıyor.
 * Statik export'ta 0 ile başlamak, JS çalışmadan, hydration öncesinde veya
 * kullanıcı o bölüme hiç inmediğinde rakamı 0 gösterirdi; SEO çıktısında da 0
 * yazardı. Hareket azaltılmışsa gözlemci hiç kurulmaz, değer hedefte kalır.
 *
 * Rakam gerçek içeriktir, `aria-hidden` almaz. Hücrede `aria-live` de yoktur:
 * olsaydı ekran okuyucu sayma boyunca her ara değeri okurdu.
 */
export function AnimasyonluSayac({ hedef, sure = VARSAYILAN_SURE }: Props) {
  const [deger, setDeger] = useState(hedef)
  const ref = useRef<HTMLSpanElement>(null)
  const azalt = useHareketAzaltilmisMi()

  useEffect(() => {
    const eleman = ref.current
    if (!eleman) return
    if (azalt) {
      // Sayım ortasında açıldıysa ara değerde kalmasın.
      setDeger(hedef)
      return
    }

    let kare = 0
    let zamanlayici = 0
    let ilkBildirim = true
    const bitir = (): void => setDeger(hedef)

    const gozlemci = new IntersectionObserver(
      (girisler) => {
        const kesisiyor = girisler.some((giris) => giris.isIntersecting)
        // Gözlemcinin ilk bildirimi mevcut durumdur, bir varış değil: bölüm
        // hidrasyonda zaten ekrandaysa (hash, yeniden yükleme, geri) rakam
        // hedefte kalır. Ölçüldü: "8" 134ms görünüp 0'a düşüp yeniden sayıyordu.
        if (ilkBildirim) {
          ilkBildirim = false
          if (kesisiyor) {
            gozlemci.unobserve(eleman)
            return
          }
        }
        if (!kesisiyor) return
        // Bir kez: kesişir kesişmez gözlemi bırakır, geri kaydırmada tekrar saymaz.
        gozlemci.unobserve(eleman)
        const baslangic = performance.now()
        const adim = (simdi: number): void => {
          const oran = Math.min(1, (simdi - baslangic) / sure)
          const yumusak = 1 - (1 - oran) ** 3
          setDeger(Math.round(hedef * yumusak))
          if (oran < 1) kare = requestAnimationFrame(adim)
        }
        kare = requestAnimationFrame(adim)
        // Emniyet: arka plandaki sekmede requestAnimationFrame hiç çalışmaz ve
        // sayaç ulaştığı ara değerde donar; gözlem de bırakıldığı için bir daha
        // toparlanmaz. Ölçüldü: sekme gizliyken "8" yerine "0" kalıyordu.
        // Zamanlayıcılar gizli sekmede de tetiklenir, son değeri onlar garanti eder.
        zamanlayici = window.setTimeout(bitir, sure + 120)
        document.addEventListener('visibilitychange', bitir)
      },
      // Alt kenar %15 içeride: telefonda sayım yüzen barın altında, ekranın alt
      // %20'sinde başlayıp bitiyordu (ölçüldü 390 ve 360). Masaüstünde fark yok.
      { threshold: ESIK, rootMargin: '0px 0px -15% 0px' },
    )
    gozlemci.observe(eleman)

    return () => {
      gozlemci.disconnect()
      if (kare) cancelAnimationFrame(kare)
      if (zamanlayici) clearTimeout(zamanlayici)
      document.removeEventListener('visibilitychange', bitir)
    }
  }, [hedef, sure, azalt])

  return <span ref={ref}>{deger}</span>
}
