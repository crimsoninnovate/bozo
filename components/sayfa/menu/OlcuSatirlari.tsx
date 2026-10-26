import { sozluk, type Dil } from '@/content'
import { fiyatMetni } from '@/content/isletme'
import { kalemOlculeri } from '@/lib/menu/kalemOlculeri'
import type { MenuKalemi } from '@/lib/menu/tipler'
import stil from './OlcuSatirlari.module.css'

type Props = { dil: Dil; kalem: MenuKalemi }

/**
 * Porsiyon / Dürüm. Fiyat listesinde olmayan ölçü hiç basılmaz (sahibi, 8 Ekim 2026).
 *
 * Tükenen kalemde fiyat yerine `menu.tukendi` basılır.
 *
 * `dl` seçildi: ölçü ile fiyat terim/tanım çiftidir, iki bağımsız metin değil.
 */
export function OlcuSatirlari({ dil, kalem }: Props) {
  const { menu } = sozluk(dil)
  const { olculer } = menu.ocakbasi

  return (
    <dl className={stil.liste}>
      {kalemOlculeri(kalem).map(({ olcu, fiyat }) => (
        // Telefonda porsiyon fiyatı adın hizasında basılıyor (`anaFiyat`); bu satırda fiyat
        // görünmez kalır ama ekran okuyucu yine duyar, şiş sayısı görünür.
        <div key={olcu} className={olcu === 'porsiyon' ? `${stil.satir} ${stil.porsiyonSatiri}` : stil.satir}>
          <dt className={stil.olcu}>
            {olculer[olcu]}
            {olcu === 'porsiyon' && kalem.porsiyonNotu && <span className={stil.not}>{kalem.porsiyonNotu[dil]}</span>}
            {olcu === 'durum' && kalem.durumNotu && <span className={stil.not}>{kalem.durumNotu[dil]}</span>}
          </dt>
          <dd data-fiyat className={kalem.tukendi ? `${stil.fiyat} ${stil.tukendi}` : stil.fiyat}>
            {kalem.tukendi ? menu.tukendi : fiyatMetni(fiyat)}
          </dd>
        </div>
      ))}
    </dl>
  )
}
