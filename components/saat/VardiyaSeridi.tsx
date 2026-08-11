'use client'

import { useGirneSaati } from './useGirneSaati'
import { sozluk, type Dil } from '@/content'
import stil from './VardiyaSeridi.module.css'

type Props = { dil: Dil }

/**
 * Gece vardiya saatleri: sıra ve sayı "Ana Sayfa Alternatif.dc.html" data-vardiya
 * listesinden (21, 23, 1, 2, 3, 4). Etiket metinleri content ana.ts içindeki
 * gece.vardiyalar dizisiyle aynı sırada tutulur.
 */
const VARDIYA_SAATLERI = [21, 23, 1, 2, 3, 4] as const

/** Verilen saate en yakın (şu an içinde veya bir saat içinde başlamış) vardiyayı döner. */
function enYakinVardiya(saat: number): number | null {
  let yakin: number | null = null
  for (const v of VARDIYA_SAATLERI) {
    const fark = ((saat - v) % 24 + 24) % 24
    const yakinFark = yakin === null ? Infinity : (((saat - yakin) % 24 + 24) % 24)
    if (fark <= 1 && fark < yakinFark) yakin = v
  }
  return yakin
}

export function VardiyaSeridi({ dil }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  const yakin = durum === null ? null : enYakinVardiya(durum.saat)
  const etiketler = s.ana.gece.vardiyalar

  return (
    <div className={stil.serit}>
      {VARDIYA_SAATLERI.map((saat, i) => {
        const durumSinifi = durum === null ? stil.beklemede : yakin === saat ? stil.aktif : stil.pasif
        return (
          <span key={saat} className={`${stil.cip} ${durumSinifi}`}>
            {etiketler[i] ?? `${String(saat).padStart(2, '0')}:00`}
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
