'use client'

import { useEffect, useRef } from 'react'
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
      kor.style.opacity = String(Math.min(1, 0.3 + yogunluk * 0.7))
      kor.style.transform = `scale(${0.9 + yogunluk * 0.16})`
      cekirdek.style.opacity = String(Math.min(1, 0.24 + yogunluk * 0.6))
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
