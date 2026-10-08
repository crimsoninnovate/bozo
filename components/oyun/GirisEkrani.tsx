import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { GirisBaglantilari, GirisTablosu } from './GirisTablosu'
import { OyunAcilisi } from './OyunAcilisi'
import stil from './GirisEkrani.module.css'

type Props = { dil: Dil; basla: () => void; bekliyor: boolean }

/** Giriş (spec §11, handoff 1a): açılış, Oyna 64 px, sıralama bloğu, bağlantılar. Jeton gelene kadar düğme kilitli. */
export function GirisEkrani({ dil, basla, bekliyor }: Props) {
  const s = sozluk(dil)
  return (
    <OyunAcilisi
      baslik={s.oyun.baslik}
      cumle={s.ana.gece.baslik}
      baglantilar={<GirisBaglantilari dil={dil} />}
      altinda={<GirisTablosu dil={dil} />}
    >
      <button type="button" className={stil.oyna} onClick={basla} disabled={bekliyor}>
        {s.oyun.oyna}
      </button>
    </OyunAcilisi>
  )
}
