import { useEffect, useState, type ReactNode } from 'react'
import { ROZET } from '@/components/ui/Rozet'
import stil from './OyunAcilisi.module.css'

type Props = { baslik: string; cumle: string; children: ReactNode; baglantilar: ReactNode; altinda?: ReactNode }

/**
 * Giriş ekranının açılışı: kor ışığı yanar ve nefes alır, rozet yükselir, metin ve Oyna 0,6 sn'de
 * gelir. Sahibinin kararıyla (10 Ekim 2026) duman, halka, kıvılcım ve kamera yaklaşması kalktı:
 * anlamsız bulundu, Oyna 2 sn bekletiliyordu. Yalnız CSS; dokunuş ya da tuş son hâle atlatır. Telefonda tek sütun (bağlantılar en altta); masaüstünde iki sütun: sol açılış ve
 * bağlantılar, sağ `altinda` (sıralama bloğu).
 */
export function OyunAcilisi({ baslik, cumle, children, baglantilar, altinda }: Props) {
  const [atla, setAtla] = useState(false)
  useEffect(() => {
    const tus = () => setAtla(true)
    window.addEventListener('keydown', tus, { once: true })
    return () => window.removeEventListener('keydown', tus)
  }, [])

  return (
    <section className={stil.acilis} data-atla={atla || undefined} onPointerDown={() => setAtla(true)}>
      <div className={stil.sol}>
        <div className={stil.sahne} aria-hidden="true">
          <span className={stil.kor} />
          <img className={stil.rozet} src={ROZET} alt="" width={1748} height={1999} decoding="async" />
        </div>
        <h1 className={stil.baslik}>{baslik}</h1>
        <p className={stil.cumle}>{cumle}</p>
        <div className={stil.eylem}>{children}</div>
      </div>
      {altinda && <div className={stil.altinda}>{altinda}</div>}
      <div className={stil.baglantilar}>{baglantilar}</div>
    </section>
  )
}
