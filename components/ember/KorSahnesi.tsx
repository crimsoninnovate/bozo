'use client'

import { useEffect, useRef } from 'react'
import { hareketAzaltilmisMi, rafKisitla } from '@/lib/hareket'
import stil from './KorSahnesi.module.css'

type Props = {
  /** Bölümlerin `data-yogunluk` değerini okuyup kor katmanını buna göre soluklaştırır. Yalnız ana sayfada. */
  yogunlukTakip?: boolean
}

export function KorSahnesi({ yogunlukTakip = false }: Props) {
  const korRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!yogunlukTakip) return
    const kor = korRef.current
    if (!kor) return
    if (hareketAzaltilmisMi()) return

    const bolumler = Array.from(document.querySelectorAll<HTMLElement>('[data-yogunluk]'))
    if (bolumler.length === 0) return

    const guncelle = rafKisitla(() => {
      const merkez = window.innerHeight / 2
      let enYakin = bolumler[0]
      let enKisa = Number.POSITIVE_INFINITY
      for (const bolum of bolumler) {
        const kutu = bolum.getBoundingClientRect()
        const uzaklik = Math.abs(kutu.top + kutu.height / 2 - merkez)
        if (uzaklik < enKisa) {
          enKisa = uzaklik
          enYakin = bolum
        }
      }
      const y = Number(enYakin?.dataset.yogunluk ?? 1)
      kor.style.opacity = String(0.3 + y * 0.7)
      kor.style.transform = `scale(${0.9 + y * 0.16})`
    })

    guncelle()
    window.addEventListener('scroll', guncelle, { passive: true })
    window.addEventListener('resize', guncelle, { passive: true })
    return () => {
      window.removeEventListener('scroll', guncelle)
      window.removeEventListener('resize', guncelle)
    }
  }, [yogunlukTakip])

  return (
    <div className={stil.kap} aria-hidden="true">
      <span ref={korRef} className={stil.kor} />
      <span className={stil.cekirdek} />
      <span className={`${stil.duman} ${stil.duman1}`} />
      <span className={`${stil.duman} ${stil.duman2}`} />
      <span className={`${stil.duman} ${stil.duman3}`} />
      <span className={stil.vinyet} />
      <span className={stil.izgara} />
    </div>
  )
}
