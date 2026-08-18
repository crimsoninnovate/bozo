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
  /** false: `aria-live` yok. Çekmecede çip mount ile birlikte gelir, açılışta duyuru istenmez. */
  canli?: boolean
  /** true: kapalıyken `durum.kapaliKisa`; çekmecede uzun cümle 40px saati alt satıra itiyordu. */
  kisaKapali?: boolean
}

/**
 * `durum === null` (sunucu ve ilk istemci render'ı) üçüncü bir durumdur, kapalı
 * değil: gri nokta ve saat satırı. Kapalı basmak günün 19 saatinde yanlıştı ve
 * yavaş hatta saniyelerce görünüyordu (ölçüldü: Fast 3G 2.4s, Slow 3G 9.6s).
 */
export function DurumCipi({ dil, boy, canli = true, kisaKapali = false }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  const acik = durum?.acik ?? false
  const kapaliMetin = kisaKapali ? s.ortak.durum.kapaliKisa : s.ortak.durum.kapali
  const metin = durum === null ? s.ortak.satirlar.saatlerGunluk : acik ? s.ortak.durum.acik : kapaliMetin

  return (
    <div className={`${stil.kap} ${stil[boy]}`} aria-live={canli ? 'polite' : undefined}>
      <span aria-hidden="true" className={`${stil.nokta} ${acik ? stil.acikNokta : stil.kapaliNokta}`} />
      <span className={acik ? stil.acikMetin : stil.kapaliMetin}>{metin}</span>
    </div>
  )
}
