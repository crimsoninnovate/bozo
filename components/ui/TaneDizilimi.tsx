import stil from './TaneDizilimi.module.css'

const RITIM = [1, 0.625, 1, 1, 0.625, 1] as const

type Props = {
  /** Büyük tanenin kenar uzunluğu, px. Küçük tane bunun 0.625 katıdır. */
  boy: number
  bosluk: number
  anahat?: boolean
  /** Sağa uzanan sönen çizgi (yalnız hero'da) */
  cizgi?: boolean
}

export function TaneDizilimi({ boy, bosluk, anahat = false, cizgi = false }: Props) {
  return (
    <span className={stil.kap} style={{ gap: `${bosluk}px` }} aria-hidden="true">
      {RITIM.map((oran, i) => {
        const kenar = Math.round(boy * oran)
        const kucuk = oran < 1
        return (
          <span
            key={i}
            className={`${stil.tane} ${anahat ? stil.anahat : stil.dolu} ${kucuk ? stil.kucuk : ''}`}
            style={{ width: `${kenar}px`, height: `${kenar}px` }}
          />
        )
      })}
      {cizgi && <span className={stil.cizgi} />}
    </span>
  )
}
