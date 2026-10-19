import { sozluk, type Dil } from '@/content'
import { fiyatMetni } from '@/content/isletme'
import type { Urun } from '@/content/types'
import { urunOlculeri } from '@/content/urunler'
import stil from './OlcuSatirlari.module.css'

type Props = { dil: Dil; urun: Urun }

/**
 * Porsiyon / Dürüm. Fiyat listesinde olmayan ölçü hiç basılmaz (sahibi, 8 Ekim 2026).
 *
 * `dl` seçildi: ölçü ile fiyat terim/tanım çiftidir, iki bağımsız metin değil.
 */
export function OlcuSatirlari({ dil, urun }: Props) {
  const { olculer, durumNotu, porsiyonNotu } = sozluk(dil).menu.ocakbasi

  return (
    <dl className={stil.liste}>
      {urunOlculeri(urun).map(({ olcu, fiyat }) => (
        // Telefonda porsiyon fiyatı adın hizasında basılıyor (`anaFiyat`); bu satırda fiyat
        // görünmez kalır ama ekran okuyucu yine duyar, şiş sayısı görünür.
        <div key={olcu} className={olcu === 'porsiyon' ? `${stil.satir} ${stil.porsiyonSatiri}` : stil.satir}>
          <dt className={stil.olcu}>
            {olculer[olcu]}
            {olcu === 'porsiyon' && porsiyonNotu[urun.id] && <span className={stil.not}>{porsiyonNotu[urun.id]}</span>}
            {olcu === 'durum' && <span className={stil.not}>{durumNotu[urun.id] ?? durumNotu.varsayilan}</span>}
          </dt>
          <dd className={stil.fiyat}>{fiyatMetni(fiyat)}</dd>
        </div>
      ))}
    </dl>
  )
}
