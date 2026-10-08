import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { ROZET } from '@/components/ui/Rozet'
import stil from './OyunAcilisi.module.css'

type Props = { baslik: string; cumle: string; children: ReactNode; baglantilar: ReactNode; altinda?: ReactNode }

/** Beş kıvılcım (handoff 1a): x ve y (px), gecikme (ms). Sabit dizi; her açılış aynı. */
const KIVILCIMLAR = [[-25, 130, 0], [19, 90, 80], [-45, 70, 160], [41, 40, 40], [3, 10, 120]] as const

/**
 * Giriş ekranının açılışı, handoff'un dört karesi: kor ışığı ve kıvılcım (0-0,6 sn), rozet
 * yükselir (0,6-1,4), bakır halka (1,4-1,8), metin sırayla (1,8+). Yalnız CSS; dokunuş ya da
 * tuş son hâle atlatır. Telefonda tek sütun (bağlantılar en altta); masaüstünde iki sütun: sol açılış ve
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
          <span className={stil.halka} />
          <img className={stil.rozet} src={ROZET} alt="" width={1748} height={1999} decoding="async" />
          <span className={stil.kivilcimlar}>
            {KIVILCIMLAR.map(([x, y, g], i) => (
              <span
                key={i}
                className={stil.kivilcim}
                style={{ '--x': `${x}px`, '--y': `${y}px`, '--g': `${g}ms` } as CSSProperties}
              />
            ))}
          </span>
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
