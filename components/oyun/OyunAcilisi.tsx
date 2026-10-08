import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { ROZET } from '@/components/ui/Rozet'
import stil from './OyunAcilisi.module.css'

type Props = { baslik: string; cumle: string; children: ReactNode; altinda?: ReactNode }

/** Kıvılcım: yatay savrulma ve yükselme (px), gecikme (ms). Sabit dizi; her açılış aynı. */
const KIVILCIMLAR = [
  [-96, 150, 0], [-62, 190, 60], [-34, 120, 140], [-12, 210, 30], [14, 170, 110], [38, 230, 20],
  [66, 140, 90], [92, 180, 50], [-78, 100, 170], [52, 110, 160], [-4, 250, 80], [110, 130, 130],
] as const

/**
 * Giriş ekranının açılışı, ~1,6 sn: kor tutuşur, rozet oturur, kıvılcım savrulur, bakır parlama
 * geçer, sonra başlık, cümle ve düğme. Yalnız CSS; dokunuş ya da tuş son hâle atlatır.
 */
export function OyunAcilisi({ baslik, cumle, children, altinda }: Props) {
  const [atla, setAtla] = useState(false)
  useEffect(() => {
    const tus = () => setAtla(true)
    window.addEventListener('keydown', tus, { once: true })
    return () => window.removeEventListener('keydown', tus)
  }, [])
  const maske = `url(${ROZET})`

  return (
    <section className={stil.acilis} data-atla={atla || undefined} onPointerDown={() => setAtla(true)}>
      <div className={stil.sahne} aria-hidden="true">
        <span className={stil.kor} />
        <span className={stil.rozet}>
          <img src={ROZET} alt="" width={1748} height={1999} decoding="async" />
          <span className={stil.parlama} style={{ maskImage: maske, WebkitMaskImage: maske }}>
            <span className={stil.bant} />
          </span>
        </span>
        <span className={stil.kivilcimlar}>
          {KIVILCIMLAR.map(([x, y, g], i) => (
            <span
              key={i}
              className={stil.kivilcim}
              style={{ '--x': `${x}px`, '--y': `${-y}px`, '--g': `${g}ms` } as CSSProperties}
            />
          ))}
        </span>
      </div>
      <h1 className={stil.baslik}>{baslik}</h1>
      <p className={stil.cumle}>{cumle}</p>
      <div className={stil.eylem}>{children}</div>
      {altinda && <div className={stil.altinda}>{altinda}</div>}
    </section>
  )
}
