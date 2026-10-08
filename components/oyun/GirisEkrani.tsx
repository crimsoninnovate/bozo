import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { GirisTablosu } from './GirisTablosu'
import { OyunAcilisi } from './OyunAcilisi'
import stil from './GirisEkrani.module.css'

type Props = { dil: Dil; basla: () => void; bekliyor: boolean }

/** Giriş (spec §11): açılış, Oyna, altında haftanın ilk üçü ve son şampiyon. Jeton gelene kadar düğme kilitli. */
export function GirisEkrani({ dil, basla, bekliyor }: Props) {
  const s = sozluk(dil)
  return (
    <OyunAcilisi baslik={s.oyun.baslik} cumle={s.ana.gece.baslik} altinda={<GirisTablosu dil={dil} />}>
      <button type="button" className={stil.oyna} onClick={basla} disabled={bekliyor}>
        {s.oyun.oyna}
      </button>
    </OyunAcilisi>
  )
}
