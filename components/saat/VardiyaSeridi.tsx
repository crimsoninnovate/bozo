'use client'

import { useEffect, useState } from 'react'
import { useGirneSaati } from './useGirneSaati'
import {
  enYakinVardiya,
  MOBIL_VARDIYA_SAATLERI,
  VARDIYA_SAATLERI,
} from './VardiyaSeridi.saatler'
import { sozluk, type Dil } from '@/content'
import stil from './VardiyaSeridi.module.css'

type Props = { dil: Dil }

/** Kabuk bileşenlerinin tek kırılma noktası. */
const MOBIL_SORGUSU = '(max-width: 800px)'

/**
 * useGirneSaati ile aynı kapı: sunucuda ve ilk istemci render'ında `null`, gerçek
 * genişlik yalnız mount sonrası gelir; hydration uyuşmazlığı olmaz.
 */
function useMobil(): boolean | null {
  const [mobil, setMobil] = useState<boolean | null>(null)

  useEffect(() => {
    const sorgu = window.matchMedia(MOBIL_SORGUSU)
    const yaz = (): void => setMobil(sorgu.matches)
    yaz()
    sorgu.addEventListener('change', yaz)
    return () => sorgu.removeEventListener('change', yaz)
  }, [])

  return mobil
}

export function VardiyaSeridi({ dil }: Props) {
  const durum = useGirneSaati()
  const mobil = useMobil()
  const s = sozluk(dil)
  // Mount öncesi dar liste: geniş listeyle SSR mobilde 20-23px yukarı kayıyordu,
  // dar listeyle 360-1440px arası ölçümde kayma sıfır.
  const saatler = mobil === false ? VARDIYA_SAATLERI : MOBIL_VARDIYA_SAATLERI
  const yakin = durum === null ? null : enYakinVardiya(durum.saat, saatler)
  const etiketler = s.ana.gece.vardiyalar

  return (
    <div className={stil.serit}>
      {saatler.map((saat) => {
        const durumSinifi = durum === null ? stil.beklemede : yakin === saat ? stil.aktif : stil.pasif
        return (
          <span key={saat} className={`${stil.cip} ${durumSinifi}`}>
            {etiketler[VARDIYA_SAATLERI.indexOf(saat)] ?? `${String(saat).padStart(2, '0')}:00`}
          </span>
        )
      })}
      <span className={stil.sonNotKap}>
        <span aria-hidden="true" className={stil.cizgi} />
        {s.ana.gece.sonNot}
      </span>
    </div>
  )
}
