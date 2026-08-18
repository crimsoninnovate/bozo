'use client'

import { useEffect, useRef } from 'react'
import { useHareketAzaltilmisMi } from '@/lib/hareket'
import stil from './ImlecKoru.module.css'

/**
 * İmleci izleyen soluk turuncu ışık, kor sahnesinin bir katmanı (Ana:31).
 * Sahne kabının içinde basılır; kendi kabı yoktur.
 */
export function ImlecKoru() {
  const isikRef = useRef<HTMLSpanElement>(null)
  const azalt = useHareketAzaltilmisMi()

  useEffect(() => {
    // İmleç paralaksı ekranda uçuşan, imlecin her kıpırdayışında konum
    // değiştiren tam bir hareket örneği: prefers-reduced-motion'ın hedeflediği
    // budur. Hareket azaltılmışsa dinleyici hiç bağlanmaz, ışık merkezde durur.
    const isik = isikRef.current
    if (!isik) return
    if (azalt) {
      isik.style.transform = ''
      return
    }

    const takipEt = (olay: MouseEvent) => {
      const x = (olay.clientX - window.innerWidth / 2) * 0.34
      const y = (olay.clientY - window.innerHeight * 0.62) * 0.34
      isik.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    window.addEventListener('mousemove', takipEt, { passive: true })
    return () => window.removeEventListener('mousemove', takipEt)
  }, [azalt])

  return <span ref={isikRef} className={stil.isik} aria-hidden="true" />
}
