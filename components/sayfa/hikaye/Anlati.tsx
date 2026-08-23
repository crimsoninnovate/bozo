import { sozluk, type Dil } from '@/content'
import stil from './Anlati.module.css'

type Props = { dil: Dil }

/**
 * Sahibinin kendi ağzından anlatı. Tasarımda yok, kaynağı 23 Ağustos 2026
 * tarihli metni (docs/surec/IYILESTIRMELER.md).
 *
 * Portre ile Lakap arasında: yüzü gördükten sonra konuşuyor ve lakabın
 * açıklaması da onun sesiyle devam ediyor.
 */
export function Anlati({ dil }: Props) {
  const a = sozluk(dil).hikaye.anlati

  return (
    <section className={stil.bolum}>
      <div className={stil.kolon}>
        <h2 className={stil.baslik}>{a.baslik}</h2>
        <p className={stil.imza}>{a.imza}</p>

        {a.paragraflar.map((metin, i) => (
          <p key={i} className={stil.metin}>
            {metin}
          </p>
        ))}

        <div className={stil.buradayim}>
          <p className={stil.vurgu}>{a.vurgu}</p>
          {/* Üç yer tek cümlenin ritmi, liste değil: `<span>` blok olur, ekran
              okuyucu yine tek cümle okur. */}
          <p className={stil.yerler}>
            {a.yerler.map((yer, i) => (
              <span key={i}>{yer}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
