'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useGirneSaati } from './useGirneSaati'
import { saatYuzdesi, vardiyaYuzdesi } from '@/lib/saat'
import { sozluk, type Dil } from '@/content'
import stil from './GunMerdiveni.module.css'

type Props = { dil: Dil }

/**
 * Hero'nun sağ kolonundaki dikey gün merdiveni. UYGULAMA-NOTLARI 2.
 *
 * Vardiyanın on dokuz saatini tek eksende gösterir: çizgi pencerenin tamamı,
 * imleç şu an, sağdaki üç satır kilometre taşları. Yüzdeyi `lib/saat.ts`
 * hesaplar, burada yalnız konuma çevrilir.
 *
 * `durum === null` iken (sunucu ve ilk istemci render'ı) imleç basılmaz:
 * konumu zamana bağlı, sunucuda yazılan her değer yanlış olurdu.
 *
 * İmleç satırlara eşlenir (F10, 18 Ağustos 2026): satırlar eşit aralıklı, saatler
 * değil (11 ve 8 saat), `top = yüzde` imleci 21:00'de kendi satırının 7.8px altına
 * düşürüyordu. Üç satır merkezi ölçülür, yüzde aralarında parça parça çevrilir.
 */
export function GunMerdiveni({ dil }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  const yuzde = durum === null ? null : vardiyaYuzdesi(new Date())
  const rayRef = useRef<HTMLDivElement>(null)
  const listeRef = useRef<HTMLOListElement>(null)
  const [merkezler, setMerkezler] = useState<number[]>([])

  useLayoutEffect(() => {
    const ray = rayRef.current
    const liste = listeRef.current
    if (!ray || !liste) return
    const olc = () => {
      const ust = ray.getBoundingClientRect().top
      setMerkezler(
        Array.from(liste.children, (li) => {
          const r = li.getBoundingClientRect()
          return r.top + r.height / 2 - ust
        }),
      )
    }
    olc()
    window.addEventListener('resize', olc, { passive: true })
    return () => window.removeEventListener('resize', olc)
  }, [])

  const taslar = s.ana.hero.kilometreTaslari
  const imlecTop = (() => {
    if (yuzde === null) return null
    if (merkezler.length !== taslar.length) return `${yuzde}%`
    const yuzdeler = taslar.map((tas) => saatYuzdesi(tas.saat))
    for (let i = 1; i < yuzdeler.length; i++) {
      const a = yuzdeler[i - 1]!
      const b = yuzdeler[i]!
      if (yuzde <= b || i === yuzdeler.length - 1) {
        const oran = Math.max(0, Math.min(1, (yuzde - a) / (b - a)))
        return `${merkezler[i - 1]! + (merkezler[i]! - merkezler[i - 1]!) * oran}px`
      }
    }
    return `${yuzde}%`
  })()

  return (
    <div className={stil.kap}>
      <div ref={rayRef} className={stil.ray} aria-hidden="true">
        <span className={stil.cizgi} />
        {imlecTop !== null && <span className={stil.imlec} style={{ top: imlecTop }} />}
      </div>
      <ol ref={listeRef} className={stil.taslar}>
        {taslar.map((tas, sira) => (
          <li key={tas.saat} className={stil.tas}>
            <span
              className={sira === taslar.length - 1 ? stil.saatSon : stil.saat}
            >
              {tas.saat}
            </span>
            <span className={stil.metin}>{tas.metin}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
