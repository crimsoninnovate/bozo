'use client'

import { useEffect, useRef, useState } from 'react'
import { hareketAzaltilmisMi } from '@/lib/hareket'

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

  useEffect(() => {
    const eleman = ref.current
    if (!eleman || hareketAzaltilmisMi()) return

    let kare = 0
    const gozlemci = new IntersectionObserver(
      (girisler) => {
        if (!girisler.some((giris) => giris.isIntersecting)) return
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
      },
      { threshold: ESIK },
    )
    gozlemci.observe(eleman)

    return () => {
      gozlemci.disconnect()
      if (kare) cancelAnimationFrame(kare)
    }
  }, [hedef, sure])

  return <span ref={ref}>{deger}</span>
}
