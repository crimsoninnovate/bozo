'use client'

import { useGirneSaati } from './useGirneSaati'
import { sozluk, type Dil } from '@/content'
import stil from './DurumCipi.module.css'

type Props = { dil: Dil }

export function DurumCipi({ dil }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  // durum === null iken kapalı görünümü basar: SSR ile ilk istemci render'ı birebir eşleşir.
  const acik = durum?.acik ?? false

  return (
    <div className={stil.kap} aria-live="polite">
      <span aria-hidden="true" className={`${stil.nokta} ${acik ? stil.acikNokta : stil.kapaliNokta}`} />
      <span className={acik ? stil.acikMetin : stil.kapaliMetin}>
        {acik ? s.ortak.durum.acik : s.ortak.durum.kapali}
      </span>
    </div>
  )
}
