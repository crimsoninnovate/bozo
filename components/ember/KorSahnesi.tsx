'use client'

import { useEffect, useRef } from 'react'
import { hareketAzaltilmisMi } from '@/lib/hareket'
import { cerceveyeAboneOl } from '@/lib/cerceve'
import stil from './KorSahnesi.module.css'

type Props = {
  /** Bölümlerin `data-yogunluk` değerini okuyup kor katmanını buna göre soluklaştırır. Yalnız ana sayfada. */
  yogunlukTakip?: boolean
}

export function KorSahnesi({ yogunlukTakip = false }: Props) {
  const korRef = useRef<HTMLSpanElement>(null)
  const cekirdekRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!yogunlukTakip) return
    const kor = korRef.current
    const cekirdek = cekirdekRef.current
    if (!kor || !cekirdek) return

    return cerceveyeAboneOl(({ yogunluk }) => {
      // Kararma (opacity) prefers-reduced-motion'ın hedeflediği türden bir
      // hareket değildir, izlemeye devam eder.
      kor.style.opacity = String(Math.min(1, 0.3 + yogunluk * 0.7))
      cekirdek.style.opacity = String(Math.min(1, 0.24 + yogunluk * 0.6))
      // Ölçek (scale) kaydırmayla değişen bir dönüşümdür; bu tam olarak
      // prefers-reduced-motion'ın önlemek istediği şeydir, hele ki global
      // geçişler kapalıyken her karede aniden zıplayarak. Hareket
      // azaltılmışsa izlemeyi bırakır ve nötr yoğunlukta (1) sabit kalır.
      // Bunu geri "düzeltmeyin": kasıtlı bir erişilebilirlik kararı.
      const olcekYogunlugu = hareketAzaltilmisMi() ? 1 : yogunluk
      kor.style.transform = `scale(${0.9 + olcekYogunlugu * 0.16})`
    })
  }, [yogunlukTakip])

  return (
    <div className={stil.kap} aria-hidden="true">
      <span ref={korRef} className={stil.kor} />
      <span ref={cekirdekRef} className={stil.cekirdek} />
      <span className={`${stil.duman} ${stil.duman1}`} />
      <span className={`${stil.duman} ${stil.duman2}`} />
      <span className={`${stil.duman} ${stil.duman3}`} />
      <span className={stil.vinyet} />
      <span className={stil.izgara} />
    </div>
  )
}
