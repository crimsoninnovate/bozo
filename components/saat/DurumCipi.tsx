'use client'

import { useGirneSaati } from './useGirneSaati'
import { sozluk, type Dil } from '@/content'
import stil from './DurumCipi.module.css'

type Props = {
  dil: Dil
  /**
   * dev: ana sayfa hero'sundaki büyük çip (10px 16px, 9x9 nokta, 14.5px metin).
   * kucuk: Konum ve Menü hero'larındaki, iki sayfada birebir aynı küçük çip
   *   (9px 15px, 8x8 nokta, 13.5px metin). Bkz. iyilestirmeler.md, Fix round 1.
   */
  boy: 'dev' | 'kucuk'
}

export function DurumCipi({ dil, boy }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  // durum === null iken kapalı görünümü basar: SSR ile ilk istemci render'ı birebir eşleşir.
  const acik = durum?.acik ?? false

  return (
    <div className={`${stil.kap} ${stil[boy]}`} aria-live="polite">
      <span aria-hidden="true" className={`${stil.nokta} ${acik ? stil.acikNokta : stil.kapaliNokta}`} />
      <span className={acik ? stil.acikMetin : stil.kapaliMetin}>
        {acik ? s.ortak.durum.acik : s.ortak.durum.kapali}
      </span>
    </div>
  )
}
