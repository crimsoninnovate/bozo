import type { SisUrun, Urun } from '@/lib/oyun/tipler'

/*
 * Tane biçimi ürünü söyler (handoff `TANE`): ciğer kare, dalak enine oval, yürek eşkenar
 * dörtgen, ayran maşrapa. Aynı dört yol ocakta, tezgahta, fişte ve rafta; merkez 0,0.
 */

export const TANE: Record<Urun, string> = {
  ciger: 'M-6 -7h12v14h-12z',
  dalak: 'M-9 0a9 6 0 1 0 18 0a9 6 0 1 0-18 0z',
  yurek: 'M0 -8.5 8.5 0 0 8.5-8.5 0z',
  ayran: 'M-6 -8h12l-1.4 16h-9.2z',
}

export const CIG: Record<Urun, string> = {
  ciger: 'url(#gRawCiger)',
  dalak: 'url(#gRawDalak)',
  yurek: 'url(#gRawYurek)',
  ayran: 'url(#gAyran)',
}

const KONTUR = 'rgba(0,0,0,.4)'

type Props = { urun: Urun; x?: number; y?: number; donus?: number; dolgu?: string; sinif?: string }

/** Tek tane ve parlama lekesi; `dolgu` verilmezse çiğ ürün rengi. */
export function Tane({ urun, x = 0, y = 0, donus = 0, dolgu = CIG[urun], sinif }: Props) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${donus})`} className={sinif}>
      <path d={TANE[urun]} fill={dolgu} stroke={KONTUR} strokeWidth={0.8} />
      <ellipse cx={-2.5} cy={-3.5} rx={2.6} ry={1.4} fill="#fff" opacity={0.3} />
    </g>
  )
}

/** Fiş, raf ve simge boyutu: 24'lük karede tek tane. */
export function TaneSimgesi({ urun, boy = 14 }: { urun: Urun; boy?: number }) {
  return (
    <svg viewBox="-12 -12 24 24" width={boy} height={boy} aria-hidden="true">
      <path d={TANE[urun]} fill={CIG[urun]} stroke="rgba(0,0,0,.35)" strokeWidth={1} />
    </svg>
  )
}

/** Bozo Karışık: üç tane tek çubukta. */
export function KarisikSimgesi({ boy = 22 }: { boy?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={boy} height={boy} aria-hidden="true">
      <path d="M1 12h22" stroke="#6A6F76" strokeWidth={1.6} />
      <rect x={3.5} y={9} width={5} height={6} fill={CIG.ciger} />
      <ellipse cx={13} cy={12} rx={3.2} ry={2} fill={CIG.dalak} />
      <path d="M19.5 9.4 22.1 12l-2.6 2.6L16.9 12z" fill={CIG.yurek} />
    </svg>
  )
}

export type { SisUrun }
