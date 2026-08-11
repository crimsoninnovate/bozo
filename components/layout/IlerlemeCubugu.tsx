// Kendi 'use client' bildirimi yok: yalnız UstBar (client) tarafından render edilir.
import { useEffect, useRef } from 'react'
import { rafKisitla } from '@/lib/hareket'
import stil from './IlerlemeCubugu.module.css'

/**
 * Sayfa kaydırma oranını üst barın altında 2px'lik bir rayda gösterir.
 * Yalnız ana sayfada kullanılır (bkz. UstBar `ilerleme` prop'u).
 */
export function IlerlemeCubugu() {
  const dolumRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dolum = dolumRef.current
    if (!dolum) return

    const guncelle = rafKisitla(() => {
      const toplam = document.documentElement.scrollHeight - window.innerHeight
      const oran = toplam > 0 ? Math.min(1, Math.max(0, window.scrollY / toplam)) : 0
      dolum.style.width = `${oran * 100}%`
    })

    guncelle()
    window.addEventListener('scroll', guncelle, { passive: true })
    window.addEventListener('resize', guncelle, { passive: true })
    return () => {
      window.removeEventListener('scroll', guncelle)
      window.removeEventListener('resize', guncelle)
    }
  }, [])

  return (
    <div className={stil.ray} aria-hidden="true">
      <div ref={dolumRef} className={stil.dolum} />
    </div>
  )
}
