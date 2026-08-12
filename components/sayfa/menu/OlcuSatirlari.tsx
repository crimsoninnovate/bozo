import { sozluk, type Dil } from '@/content'
import { fiyatMetni, yarimFiyat } from '@/content/isletme'
import type { Urun } from '@/content/types'
import stil from './OlcuSatirlari.module.css'

type Props = { dil: Dil; urun: Urun }

/**
 * Tam / Yarım / Dürüm üçlüsü. Yarım ayrı bir kalem değil, tamdan türetilir;
 * dürümü olmayan üründe üçüncü satır hiç basılmaz.
 *
 * `dl` seçildi: ölçü ile fiyat terim/tanım çiftidir, iki bağımsız metin değil.
 */
export function OlcuSatirlari({ dil, urun }: Props) {
  const { olculer, durumNotu } = sozluk(dil).menu.ocaktan

  return (
    <dl className={stil.liste}>
      <div className={stil.satir}>
        <dt className={stil.olcu}>{olculer.tam}</dt>
        <dd className={stil.fiyat}>{fiyatMetni(urun.tam)}</dd>
      </div>
      <div className={stil.satir}>
        <dt className={stil.olcu}>{olculer.yarim}</dt>
        <dd className={stil.fiyat}>{fiyatMetni(yarimFiyat(urun.tam))}</dd>
      </div>
      {urun.durum !== null && (
        <div className={stil.satir}>
          <dt className={stil.olcu}>
            {olculer.durum}
            <span className={stil.not}>{durumNotu}</span>
          </dt>
          <dd className={stil.fiyat}>{fiyatMetni(urun.durum)}</dd>
        </div>
      )}
    </dl>
  )
}
