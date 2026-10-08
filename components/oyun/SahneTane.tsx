import type { SisUrun, Urun } from '@/lib/oyun/tipler'

/*
 * Her ürünün biçimi VE rengi ayrıdır (ciğer tuğla küp, dalak mor fasulye, yürek gül kalbi,
 * ayran bakır maşrapa): renk körü de, 24 px'te de ayırt eder. Aynı yollar ocakta, tezgahta,
 * fişte ve rafta; merkez 0,0, yaklaşık -10..10.
 */

type Glif = { yol: string; kesit: string; iz: string; catlak: string }

const GLIF: Record<SisUrun, Glif> = {
  ciger: {
    yol: 'M-7.5 -5.5Q-7.5 -8.5 -4.5 -8.5H4.5Q7.5 -8.5 7.5 -5.5V5.5Q7.5 8.5 4.5 8.5H-4.5Q-7.5 8.5 -7.5 5.5Z',
    kesit: 'M-7.5 -5.5Q-7.5 -8.5 -4.5 -8.5H4.5Q7.5 -8.5 7.5 -5.5V-3H-7.5Z',
    iz: 'M-5 -2.5L2 -5.5M-5 3L5 -1.5',
    catlak: 'M-5 -3.5L-2.5 -1L-4 1.5L-1 3.5M2 -4.5L4 -2L2.5 0.5L5 2.5',
  },
  dalak: {
    yol: 'M-10.5 0.5C-10.5 -4.5 -5 -7 0 -6.3C5.5 -7 10.5 -4 10.5 0.5C10.5 5 5.5 6.8 0 6.2C-5 6.8 -10.5 5 -10.5 0.5Z',
    kesit: 'M-10.5 0.5C-10.5 -4.5 -5 -7 0 -6.3C5.5 -7 10.5 -4 10.5 0.5L10 -1.5H-10Z',
    iz: 'M-6 -2L-1 -4.2M0 1.6L7 -1.6',
    catlak: 'M-7 -2L-4.5 0.5L-6 2.5M3 -3.5L5 -1L3.5 1.5L6.5 3',
  },
  yurek: {
    yol: 'M0 9.5C-3 7 -9.5 3.5 -9.5 -2C-9.5 -6 -6 -8.2 -3.2 -8.2C-1.6 -8.2 -0.4 -7.4 0 -6.2C0.4 -7.4 1.6 -8.2 3.2 -8.2C6 -8.2 9.5 -6 9.5 -2C9.5 3.5 3 7 0 9.5Z',
    kesit: 'M-9.5 -2C-9.5 -6 -6 -8.2 -3.2 -8.2C-1.6 -8.2 -0.4 -7.4 0 -6.2C0.4 -7.4 1.6 -8.2 3.2 -8.2C6 -8.2 9.5 -6 9.5 -2L9.2 -3.5H-9.2Z',
    iz: 'M-5 -3.5L0 -5.8M-2 1.6L5 -2',
    catlak: 'M-5 -4L-2.5 -1.5L-4.5 1M2.5 -4.5L4.5 -2L2.5 0.5L4 3',
  },
}

export const CIG: Record<SisUrun, string> = {
  ciger: 'url(#gRawCiger)',
  dalak: 'url(#gRawDalak)',
  yurek: 'url(#gRawYurek)',
}

const KONTUR = 'rgba(0,0,0,.45)'
const IZ_RENGI = '#2E160A'

type KatmanProps = { urun: SisUrun; pismisSinif?: string; komurSinif?: string; pismis?: boolean }

/**
 * Tek tanenin katmanları: çiğ gövde, pişmiş (karamel + ızgara izi), kömür (çatlaklı), parlama.
 * Sınıflar verilirse opaklığı CSS'ten (`--pisme`, `--yanma`); `pismis` sabit pişmiş gösterir.
 */
export function TaneKatmanlari({ urun, pismisSinif, komurSinif, pismis = false }: KatmanProps) {
  const g = GLIF[urun]
  const pismisGor = pismis || pismisSinif !== undefined
  return (
    <>
      <path d={g.yol} fill={CIG[urun]} stroke={KONTUR} strokeWidth={0.8} />
      <path d={g.kesit} fill="#fff" opacity={0.13} />
      {pismisGor && (
        <g className={pismisSinif}>
          <path d={g.yol} fill="url(#gCooked)" />
          <path d={g.iz} stroke={IZ_RENGI} strokeWidth={1.5} strokeLinecap="round" opacity={0.75} fill="none" />
        </g>
      )}
      {komurSinif !== undefined && (
        <g className={komurSinif}>
          <path d={g.yol} fill="url(#gChar)" />
          <path d={g.catlak} stroke="#FF7A1A" strokeWidth={0.9} strokeLinejoin="round" strokeLinecap="round" fill="none" opacity={0.85} />
        </g>
      )}
      <ellipse cx={-3} cy={-4.2} rx={3} ry={1.4} fill="#fff" opacity={0.3} />
    </>
  )
}

type Props = { urun: SisUrun; x?: number; y?: number; olcek?: number; pismis?: boolean }

/** Sabit tane (raf, tezgah). */
export function Tane({ urun, x = 0, y = 0, olcek = 1, pismis = false }: Props) {
  return (
    <g transform={`translate(${x} ${y}) scale(${olcek})`}>
      <TaneKatmanlari urun={urun} pismis={pismis} />
    </g>
  )
}

/** Bakır maşrapa, köpüklü ayran: fiş ve simge boyu (merkez 0,0). */
function AyranGlifi() {
  return (
    <g>
      <path d="M-6.5 -6L6.5 -6L5 8.5Q0 10 -5 8.5Z" fill="url(#gCopper)" stroke={KONTUR} strokeWidth={0.8} />
      <path d="M-6.8 -6Q0 -9.8 6.8 -6Q0 -3.6 -6.8 -6Z" fill="url(#gAyran)" stroke="rgba(0,0,0,.25)" strokeWidth={0.6} />
      <path d="M-5.8 0H5.4" stroke="#6E3A1C" strokeWidth={1} opacity={0.6} />
      <ellipse cx={-3.6} cy={3} rx={1} ry={3} fill="#fff" opacity={0.35} />
    </g>
  )
}

/** Fiş, raf ve simge boyu: 24'lük karede tek ürün. */
export function TaneSimgesi({ urun, boy = 14 }: { urun: Urun; boy?: number }) {
  return (
    <svg viewBox="-12 -12 24 24" width={boy} height={boy} aria-hidden="true">
      {urun === 'ayran' ? <AyranGlifi /> : <TaneKatmanlari urun={urun} pismis={false} />}
    </svg>
  )
}

const KARISIK_X = [-7.6, 0, 7.6] as const
const KARISIK_URUN = ['ciger', 'dalak', 'yurek'] as const

/** Bozo Karışık: üç tane tek çubukta; `servis` verilirse gelen tane soluk. */
export function KarisikSimgesi({ boy = 22, servis }: { boy?: number; servis?: readonly boolean[] }) {
  return (
    <svg viewBox="-13 -13 26 26" width={boy} height={boy} aria-hidden="true">
      <path d="M-12.5 0H12.5" stroke="url(#gSteel)" strokeWidth={1.6} />
      {KARISIK_URUN.map((u, i) => (
        <g key={u} transform={`translate(${KARISIK_X[i]} 0) scale(.5)`} opacity={servis?.[i] ? 0.35 : 1}>
          <TaneKatmanlari urun={u} />
        </g>
      ))}
    </svg>
  )
}

export type { SisUrun }
