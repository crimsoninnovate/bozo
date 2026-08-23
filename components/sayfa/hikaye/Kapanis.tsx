import { sozluk, type Dil } from '@/content'
import stil from './Kapanis.module.css'

type Props = { dil: Dil }

/**
 * Anlatının kapanışı, sayfanın en sonunda. Aynı kaynak: sahibinin 23 Ağustos
 * 2026 tarihli metni.
 *
 * Sofra'nın CTA'larından SONRA duruyor (sahibinin kararı, aynı gün): araya
 * girseydi anlatının sesi eylem bloğuyla kesilirdi.
 */
export function Kapanis({ dil }: Props) {
  const k = sozluk(dil).hikaye.kapanis

  return (
    <section className={stil.bolum}>
      <div className={stil.kolon}>
        <h2 className={stil.baslik}>{k.baslik}</h2>

        {k.paragraflar.map((metin, i) => (
          <p key={i} className={stil.metin}>
            {metin}
          </p>
        ))}

        <div className={stil.hazir}>
          {k.hazir.map((satir, i) => (
            <p key={i} className={stil.hazirSatiri}>
              {satir}
            </p>
          ))}
        </div>

        <p className={stil.selamlama}>{k.selamlama}</p>

        <p className={stil.imza}>{k.imza}</p>
        <p className={stil.imzaNotu}>{k.imzaNotu}</p>
      </div>
    </section>
  )
}
