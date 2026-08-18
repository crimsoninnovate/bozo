import { sisGeometrisi } from '@/lib/sis'
import stil from './SisIsareti.module.css'

/**
 * Şiş işareti: markanın birincil sembolü (01-Logo-Final-Karar.md). Bir ucu sivri,
 * diğer ucu halka saplı çubuk üstünde 4 ciğer ve 2 kuyruk yağı tanesi. Geometri
 * `lib/sis.ts`ten gelir; ölçü CSS'te (`--sis-boy`) verilir, işaret orantılı büyür.
 * Çubuk ve ciğer taneleri `currentColor`, yağ taneleri tangerine.
 */
export function SisIsareti() {
  const g = sisGeometrisi(10)
  const s = (n: number) => n.toFixed(2)
  const { uzunluk, taban, bogaz } = g.uc
  const nokta = (x: number, y: number) => `${s(x)},${s(y)}`
  const ucNoktalari = [
    nokta(0, g.eksen),
    nokta(uzunluk, g.eksen - taban / 2),
    nokta(uzunluk + bogaz, g.cubuk.y),
    nokta(uzunluk + bogaz, g.cubuk.y + g.cubuk.boy),
    nokta(uzunluk, g.eksen + taban / 2),
  ].join(' ')

  return (
    <svg className={stil.isaret} viewBox={`0 0 ${s(g.en)} ${s(g.boy)}`} aria-hidden="true">
      <rect x={s(g.cubuk.x)} y={s(g.cubuk.y)} width={s(g.cubuk.en)} height={s(g.cubuk.boy)} />
      <polygon points={ucNoktalari} />
      <circle
        className={stil.halka}
        cx={s(g.halka.cx)}
        cy={s(g.halka.cy)}
        r={s(g.halka.r)}
        strokeWidth={s(g.halka.kalinlik)}
      />
      {g.taneler.map((t) => (
        <rect
          key={t.x}
          className={t.ciger ? undefined : stil.yag}
          x={s(t.x)}
          y={s(t.y)}
          width={s(t.kenar)}
          height={s(t.kenar)}
          rx={s(t.kose)}
        />
      ))}
    </svg>
  )
}
