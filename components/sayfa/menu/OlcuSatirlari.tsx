import { sozluk, type Dil } from '@/content'
import { fiyatMetni } from '@/content/isletme'
import type { Urun } from '@/content/types'
import { urunOlculeri } from '@/content/urunler'
import stil from './OlcuSatirlari.module.css'

type Props = { dil: Dil; urun: Urun }

/**
 * Porsiyon / 1,5 Porsiyon / Dürüm / 1,5 Dürüm. Fiyat listesinde olmayan ölçü
 * hiç basılmaz (sahibi, 8 Ekim 2026).
 *
 * `dl` seçildi: ölçü ile fiyat terim/tanım çiftidir, iki bağımsız metin değil.
 */
export function OlcuSatirlari({ dil, urun }: Props) {
  const { olculer, durumNotu } = sozluk(dil).menu.ocakbasi

  return (
    <dl className={stil.liste}>
      {urunOlculeri(urun).map(({ olcu, fiyat }) => (
        // Telefonda porsiyon fiyatı adın hizasında basılıyor (`anaFiyat`); satırı görünmez
        // kalır ama ekran okuyucu "Porsiyon" terimini yine duyar.
        <div key={olcu} className={olcu === 'porsiyon' ? `${stil.satir} ${stil.porsiyonSatiri}` : stil.satir}>
          <dt className={stil.olcu}>
            {olculer[olcu]}
            {olcu === 'durum' && <span className={stil.not}>{durumNotu}</span>}
          </dt>
          <dd className={stil.fiyat}>{fiyatMetni(fiyat)}</dd>
        </div>
      ))}
    </dl>
  )
}
