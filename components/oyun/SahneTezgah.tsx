import { Tane, type SisUrun } from './SahneTane'
import type { Urun } from '@/lib/oyun/tipler'
import stil from './SahneTezgah.module.css'

/*
 * Tezgah ve rafın boyalı parçaları (handoff OyunAlani 212-270): porselen tabak, yatay pişmiş
 * şiş, bakır maşrapa, açık yayık, raf tepsisi. Mermer ve ceviz zemin CSS'te.
 */

const SIS_X = [-20, -4, 12, 26] as const
const TEPSI = [[16, 12], [32, 13], [24, 6]] as const

/** 80×60 porselen tabak ve gölgesi; üstüne şiş ya da maşrapa gelir. */
export function TezgahTabagi({ children }: { children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 80 60" className={stil.tabak} aria-hidden="true">
      <ellipse cx={40} cy={34} rx={30} ry={18} fill="#000" opacity={0.28} filter="url(#fBlur2)" />
      <ellipse cx={40} cy={30} rx={31} ry={19} fill="url(#gPlate)" />
      <ellipse cx={40} cy={30} rx={23} ry={13} fill="none" stroke="#B9AE9C" strokeWidth={0.8} opacity={0.7} />
      {children}
    </svg>
  )
}

/** Tabaktaki ürün: yatay çelik şiş, dört pişmiş tane; ayran bakır maşrapada. */
export function TezgahUrunu({ urun }: { urun: Urun }) {
  if (urun === 'ayran') return <BakirMasrapa />
  return (
    <g transform="translate(40 30)">
      <path d="M-34 0h66l4-1.4v2.8z" fill="url(#gSteel)" stroke="rgba(0,0,0,.4)" strokeWidth={0.4} />
      <circle cx={-34} cy={0} r={3} fill="none" stroke="url(#gSteel)" strokeWidth={1.6} />
      {SIS_X.map((x) => (
        <Tane key={x} urun={urun} x={x} donus={90} dolgu="url(#gCooked)" />
      ))}
    </g>
  )
}

function BakirMasrapa() {
  return (
    <g transform="translate(40 30)">
      <path d="M-11-14h22l-2.4 26h-17.2z" fill="url(#gCopper)" stroke="rgba(0,0,0,.45)" strokeWidth={0.8} />
      <ellipse cx={0} cy={-14} rx={11} ry={3.2} fill="url(#gAyran)" stroke="#9A6A3A" strokeWidth={0.8} />
      <ellipse cx={-3} cy={-14.6} rx={3} ry={1} fill="#fff" opacity={0.8} />
      <path d="M-7-6v10" stroke="#fff" strokeWidth={1.4} opacity={0.35} strokeLinecap="round" />
    </g>
  )
}

/** Ceviz fıçı, iki pirinç çember, çelik kol; ağızdaki ayran `--oran` kadar görünür. */
export function AcikYayik() {
  return (
    <svg viewBox="0 0 56 60" className={stil.yayik} aria-hidden="true">
      <ellipse cx={28} cy={54} rx={18} ry={4} fill="#000" opacity={0.35} filter="url(#fBlur2)" />
      <path d="M12 14h32l3 40H9z" fill="url(#gWood)" stroke="rgba(0,0,0,.5)" strokeWidth={0.8} />
      <path d="M12 14h32l3 40H9z" filter="url(#fWood)" opacity={0.7} />
      <rect x={10.5} y={24} width={35} height={3} fill="url(#gBrass)" />
      <rect x={9.6} y={42} width={36.8} height={3} fill="url(#gBrass)" />
      <ellipse cx={28} cy={14} rx={16} ry={4} fill="#5A3418" stroke="rgba(0,0,0,.5)" strokeWidth={0.8} />
      <path d="M28 2v12" stroke="url(#gSteel)" strokeWidth={2.4} strokeLinecap="round" />
      <rect x={22} y={0} width={12} height={3.5} fill="url(#gWood)" />
      <ellipse cx={28} cy={14} rx={14} ry={3} fill="url(#gAyran)" className={stil.ayranYuzeyi} />
    </svg>
  )
}

/** Raf tepsisi: siyah tepsi üstünde üç çiğ tane. */
export function RafTepsisi({ urun }: { urun: SisUrun }) {
  return (
    <svg viewBox="0 0 48 40" width={48} height={40} className={stil.tepsi} aria-hidden="true">
      <ellipse cx={24} cy={36} rx={20} ry={4} fill="#000" opacity={0.45} filter="url(#fBlur2)" />
      <path d="M4 14h40l-3 20H7z" fill="#2A2320" stroke="rgba(255,255,255,.15)" strokeWidth={0.8} />
      <ellipse cx={24} cy={14} rx={20} ry={4.5} fill="#3A302B" stroke="rgba(255,255,255,.2)" strokeWidth={0.8} />
      {TEPSI.map(([x, y]) => (
        <Tane key={x} urun={urun} x={x} y={y} />
      ))}
    </svg>
  )
}
