'use client'

import { useEffect, useRef } from 'react'
import { hareketAzaltilmisMi } from '@/lib/hareket'
import { cerceveyeAboneOl } from '@/lib/cerceve'
import stil from './Bolum.module.css'

type Props = {
  id?: string
  /** KorSahnesi'nin ana sayfada okuduğu yoğunluk katsayısı. Diğer sayfalarda atlanır. */
  yogunluk?: number
  className?: string
  children: React.ReactNode
}

/**
 * Bölüm sarmalayıcısı: `data-yogunluk` taşır ve içeriğini ne kadarı
 * görünürdeyse ona göre sürekli soluklaştırıp kaldırır (tasarımın `cerceve()`
 * erime hesabı, birebir). Yukarı kaydırılınca da geri soluklaşır; tek seferlik
 * bir açılış değildir. Hareket azaltılmışsa içerik anında son haliyle görünür,
 * hesap hiç kurulmaz.
 */
export function Bolum({ id, yogunluk, className, children }: Props) {
  const eritRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const eleman = eritRef.current
    if (!eleman) return

    if (hareketAzaltilmisMi()) {
      eleman.style.opacity = '1'
      eleman.style.transform = 'none'
      return
    }

    return cerceveyeAboneOl(({ ekran }) => {
      const kutu = eleman.getBoundingClientRect()
      if (kutu.bottom <= 0 || kutu.top >= ekran) {
        eleman.style.opacity = '1'
        eleman.style.transform = 'none'
        return
      }
      const gorunen = Math.min(kutu.bottom, ekran) - Math.max(kutu.top, 0)
      const oran = Math.max(0, Math.min(1, gorunen / Math.min(kutu.height, ekran * 0.62)))
      eleman.style.opacity = String(0.86 + oran * 0.14)
      eleman.style.transform = `translate3d(0, ${(1 - oran) * 14}px, 0)`
    })
  }, [])

  return (
    <section id={id} data-yogunluk={yogunluk} className={className ? `${stil.bolum} ${className}` : stil.bolum}>
      <div ref={eritRef} className={stil.erit}>
        {children}
      </div>
    </section>
  )
}
