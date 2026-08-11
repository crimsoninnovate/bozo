'use client'

import { useEffect, useRef } from 'react'
import { hareketAzaltilmisMi } from '@/lib/hareket'
import stil from './Bolum.module.css'

type Props = {
  id?: string
  /** KorSahnesi'nin ana sayfada okuduğu yoğunluk katsayısı. Diğer sayfalarda atlanır. */
  yogunluk?: number
  className?: string
  children: React.ReactNode
}

/**
 * Bölüm sarmalayıcısı: `data-yogunluk` taşır ve içeriğini görünüre girdiğinde
 * bir kez soluklaşıp yukarı kayarak açar. Hareket azaltılmışsa içerik anında
 * son haliyle görünür, gözlemci hiç kurulmaz.
 */
export function Bolum({ id, yogunluk, className, children }: Props) {
  const eritRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const eleman = eritRef.current
    const acikSinifi = stil.acik
    if (!eleman || !acikSinifi) return

    if (hareketAzaltilmisMi()) {
      eleman.classList.add(acikSinifi)
      return
    }

    const gozlemci = new IntersectionObserver(
      (girdiler) => {
        const girdi = girdiler[0]
        if (!girdi || !girdi.isIntersecting) return
        eleman.classList.add(acikSinifi)
        gozlemci.unobserve(eleman)
      },
      { threshold: 0.15 },
    )
    gozlemci.observe(eleman)
    return () => gozlemci.disconnect()
  }, [])

  return (
    <section id={id} data-yogunluk={yogunluk} className={className ? `${stil.bolum} ${className}` : stil.bolum}>
      <div ref={eritRef} className={stil.erit}>
        {children}
      </div>
    </section>
  )
}
