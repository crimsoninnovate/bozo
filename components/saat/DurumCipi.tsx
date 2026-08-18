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

/**
 * `durum === null` (sunucu ve ilk istemci render'ı) üçüncü bir durumdur, kapalı
 * değil: gri nokta ve saat satırı. Kapalı basmak günün 19 saatinde yanlıştı ve
 * yavaş hatta saniyelerce görünüyordu (ölçüldü: Fast 3G 2.4s, Slow 3G 9.6s).
 */
export function DurumCipi({ dil, boy }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  const acik = durum?.acik ?? false
  const metin = durum === null ? s.ortak.satirlar.saatlerGunluk : acik ? s.ortak.durum.acik : s.ortak.durum.kapali

  return (
    <div className={`${stil.kap} ${stil[boy]}`} aria-live="polite">
      <span aria-hidden="true" className={`${stil.nokta} ${acik ? stil.acikNokta : stil.kapaliNokta}`} />
      <span className={acik ? stil.acikMetin : stil.kapaliMetin}>{metin}</span>
    </div>
  )
}
