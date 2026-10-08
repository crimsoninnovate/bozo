import type { CSSProperties } from 'react'

/*
 * Boyalı sahnenin gradyan ve filtre tanımları (handoff `OyunAlani.dc.html` <defs>, birebir).
 * Sahada BİR kez bağlanır; kimlikler belge çapında tektir (`SahneDefs.test.ts`).
 * Palet rengi olan duraklar token'a bağlı (K1): kor `--kor`.
 */

const KOR: CSSProperties = { stopColor: 'var(--kor)' }

type Durak = { o: number; r: string; a?: number }
type Gradyan = { id: string; yon?: [number, number, number, number]; duraklar: Durak[] }
type Radyal = { id: string; cx: number; cy: number; r: number; duraklar: Durak[] }

const DOGRUSAL: Gradyan[] = [
  { id: 'gCopper', duraklar: [{ o: 0, r: '#F0B27A' }, { o: 0.35, r: '#B86F3A' }, { o: 1, r: '#6E3A1C' }] },
  { id: 'gBrass', yon: [0, 0, 1, 0], duraklar: [{ o: 0, r: '#8A6A2B' }, { o: 0.5, r: '#E2C275' }, { o: 1, r: '#8A6A2B' }] },
  { id: 'gSteel', yon: [0, 0, 1, 0], duraklar: [{ o: 0, r: '#7A7F86' }, { o: 0.5, r: '#D9DEE3' }, { o: 1, r: '#6A6F76' }] },
  { id: 'gWood', duraklar: [{ o: 0, r: '#7A4A26' }, { o: 1, r: '#4A2A14' }] },
  { id: 'gWoodFront', duraklar: [{ o: 0, r: '#3E2210' }, { o: 1, r: '#24120A' }] },
  { id: 'gCloth', yon: [0, 0, 1, 1], duraklar: [{ o: 0, r: '#F7EBD5' }, { o: 1, r: '#DCC7A5' }] },
  { id: 'gPaper', duraklar: [{ o: 0, r: '#FBF3E3' }, { o: 1, r: '#E6D6B8' }] },
  { id: 'gHalka', yon: [0, 0, 1, 1], duraklar: [{ o: 0, r: '#FFB45A' }, { o: 0.5, r: '#FF6A1A' }, { o: 1, r: 'kor' }] },
  { id: 'gMarble', yon: [0, 0, 1, 1], duraklar: [{ o: 0, r: '#F1EBE0' }, { o: 0.5, r: '#D8CFC0' }, { o: 1, r: '#EDE6DA' }] },
]

const TANE_ODAK = { cx: 0.35, cy: 0.3, r: 0.9 }
const RADYAL: Radyal[] = [
  { id: 'gRawCiger', ...TANE_ODAK, duraklar: [{ o: 0, r: '#B3302F' }, { o: 0.6, r: '#7A1417' }, { o: 1, r: '#3F0A0D' }] },
  { id: 'gRawDalak', ...TANE_ODAK, duraklar: [{ o: 0, r: '#9A62B0' }, { o: 0.6, r: '#5E2F78' }, { o: 1, r: '#2B1238' }] },
  { id: 'gRawYurek', ...TANE_ODAK, duraklar: [{ o: 0, r: '#EE6A7E' }, { o: 0.6, r: '#C23652' }, { o: 1, r: '#7E1630' }] },
  { id: 'gCooked', ...TANE_ODAK, duraklar: [{ o: 0, r: '#C98650' }, { o: 0.6, r: '#8A4E26' }, { o: 1, r: '#4A260F' }] },
  { id: 'gChar', cx: 0.4, cy: 0.35, r: 0.9, duraklar: [{ o: 0, r: '#3A2A22' }, { o: 1, r: '#120A07' }] },
  { id: 'gFat', ...TANE_ODAK, duraklar: [{ o: 0, r: '#FFF6E6' }, { o: 1, r: '#D9C39E' }] },
  { id: 'gEmber', cx: 0.5, cy: 0.5, r: 0.5, duraklar: [{ o: 0, r: '#FFD28A' }, { o: 0.35, r: '#FF7A1A' }, { o: 1, r: 'kor', a: 0 }] },
  { id: 'gCoal', cx: 0.5, cy: 0.5, r: 0.5, duraklar: [{ o: 0, r: '#2A1A14' }, { o: 1, r: '#0E0705' }] },
  { id: 'gYogurt', cx: 0.4, cy: 0.35, r: 0.8, duraklar: [{ o: 0, r: '#FFFBF2' }, { o: 1, r: '#E8DCC4' }] },
  { id: 'gBakirTabak', cx: 0.4, cy: 0.35, r: 0.8, duraklar: [{ o: 0, r: '#E3985F' }, { o: 0.75, r: '#B06A38' }, { o: 1, r: '#7A4222' }] },
  { id: 'gAyran', cx: 0.4, cy: 0.3, r: 0.8, duraklar: [{ o: 0, r: '#FFFFFF' }, { o: 1, r: '#E3E6E9' }] },
]

function Duraklar({ duraklar }: { duraklar: Durak[] }) {
  return (
    <>
      {duraklar.map((d) => (
        <stop
          key={d.o}
          offset={d.o}
          stopColor={d.r === 'kor' ? undefined : d.r}
          style={d.r === 'kor' ? KOR : undefined}
          stopOpacity={d.a}
        />
      ))}
    </>
  )
}

export function SahneDefs() {
  return (
    <svg aria-hidden="true" width={0} height={0} style={{ position: 'absolute' }}>
      <defs>
        {DOGRUSAL.map(({ id, yon = [0, 0, 0, 1], duraklar }) => (
          <linearGradient key={id} id={id} x1={yon[0]} y1={yon[1]} x2={yon[2]} y2={yon[3]}>
            <Duraklar duraklar={duraklar} />
          </linearGradient>
        ))}
        {RADYAL.map(({ id, cx, cy, r, duraklar }) => (
          <radialGradient key={id} id={id} cx={cx} cy={cy} r={r}>
            <Duraklar duraklar={duraklar} />
          </radialGradient>
        ))}
        <filter id="fBlur2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={1.6} />
        </filter>
        <filter id="fBlur6" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
        <filter id="fGrain">
          <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 .9 0 0 0 0 .8 0 0 0 .14 0" />
        </filter>
        <filter id="fMarble" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.05" numOctaves={3} seed={4} />
          <feColorMatrix values="0 0 0 0 .45 0 0 0 0 .4 0 0 0 0 .36 0 0 0 .45 -.1" />
        </filter>
        <filter id="fWood" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.02" numOctaves={2} seed={7} />
          <feColorMatrix values="0 0 0 0 .1 0 0 0 0 .05 0 0 0 0 .02 0 0 0 .5 -.15" />
        </filter>
        <filter id="fShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx={0} dy={3} stdDeviation={2.4} floodColor="#000" floodOpacity={0.55} />
        </filter>
      </defs>
    </svg>
  )
}
