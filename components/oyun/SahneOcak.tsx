import type { Urun } from '@/lib/oyun/tipler'
import { TaneKatmanlari } from './SahneTane'
import stil from './SahneOcak.module.css'

/*
 * Ocağın boyalı parçaları (handoff OyunAlani 152-194): pirinç dayama çentiği, 28×128 şiş,
 * köz yatağı. Pişme ve yanma `--pisme`/`--yanma` ile CSS'ten okunur (K3); React yalnız yapı.
 */

const TANE_Y = [26, 52, 78, 104] as const
const YAG_Y = [38.5, 64.5, 90.5] as const
const TEL = 'M14 8c-4-6 3-9 0-14'
const TEL_GECIKME = [0, -0.9, -1.8] as const

/** Şişin üstündeki pirinç dayama. */
export function DayamaCentigi() {
  return (
    <svg viewBox="0 0 24 10" className={stil.dayama} aria-hidden="true">
      <path d="M2 10V4a10 10 0 0 1 20 0v6" fill="url(#gBrass)" stroke="rgba(0,0,0,.5)" strokeWidth={0.8} />
    </svg>
  )
}

/** Kapalı yuva: kesik düşey çizgi. */
export function KapaliYuva() {
  return <span className={stil.kapaliCizgi} aria-hidden="true" />
}

type SisProps = { urun: Urun; yanik?: boolean }

/**
 * Çelik halka ve gövde, dört tane, aralarda kuyruk yağı. Tane katmanları: çiğ ürün gradyanı,
 * üstünde `--pisme` kadar pişmiş, onun üstünde `--yanma` kadar kömür. `yanik` sabit kömür.
 */
export function Sis({ urun, yanik = false }: SisProps) {
  return (
    <svg viewBox="0 0 28 128" className={`${stil.sis} ${yanik ? stil.yanik : ''}`} aria-hidden="true">
      {!yanik && (
        <g className={stil.duman}>
          {TEL_GECIKME.map((g) => (
            <path key={g} d={TEL} className={stil.tel} style={{ animationDelay: `${g}s` }} />
          ))}
        </g>
      )}
      <ellipse cx={14} cy={122} rx={14} ry={5} fill="url(#gEmber)" className={stil.alt} />
      {!yanik && (
        <g className={stil.damla}>
          <circle cx={11} cy={118} r={1} className={stil.kivilcimNokta} style={{ animationDelay: '0s' }} />
          <circle cx={17} cy={118} r={0.9} className={stil.kivilcimNokta} style={{ animationDelay: '-0.7s' }} />
        </g>
      )}
      <ellipse cx={14} cy={126} rx={9} ry={2.4} fill="#000" opacity={0.5} filter="url(#fBlur2)" />
      <circle cx={14} cy={6} r={4} fill="none" stroke="url(#gSteel)" strokeWidth={2} />
      <path d="M12.6 10h2.8v108l-1.4 6-1.4-6z" fill="url(#gSteel)" stroke="rgba(0,0,0,.4)" strokeWidth={0.4} />
      {TANE_Y.map((y) => (
        <g key={y} transform={`translate(14 ${y})`}>
          <TaneKatmanlari urun={urun} pismisSinif={stil.pismis} komurSinif={stil.komur} />
        </g>
      ))}
      {YAG_Y.map((y) => (
        <ellipse key={y} cx={14} cy={y} rx={4.2} ry={3.2} fill="url(#gFat)" stroke="rgba(0,0,0,.3)" strokeWidth={0.6} className={stil.yag} />
      ))}
    </svg>
  )
}

const KOZLER = [
  [20, 22, 26, 7, '#FF7A1A', 0.55], [82, 25, 30, 6, 'kor', 0.7], [150, 22, 24, 7, '#FF7A1A', 0.5],
  [212, 25, 32, 6, 'kor', 0.7], [276, 22, 26, 7, '#FF7A1A', 0.55], [340, 25, 30, 6, 'kor', 0.7],
  [392, 22, 18, 6, '#FF7A1A', 0.5],
] as const
const KOMURLER = [[42, 21, 9, 4], [118, 19, 10, 4], [184, 22, 8, 3.5], [246, 19, 10, 4], [312, 22, 9, 4], [372, 19, 8, 3.5]] as const
const KULLER = [[60, 16, 5, 2], [200, 15, 6, 2], [330, 16, 5, 2]] as const
/** Sıcak közler sırayla yanar: kor yoğunluğu (kombo) eşiği geçtikçe bir tane daha. */
const SICAK = [60, 180, 300, 120, 240, 360] as const

/** 400×34 yatak, `preserveAspectRatio="none"` ile tekne genişliğine yayılır. Kor elipsleri iki ayrı katmanda: katman opaklıkları farklı hızda nefes alır. */
export function KozYatagi() {
  return (
    <>
      <svg viewBox="0 0 400 34" preserveAspectRatio="none" className={stil.yatak} aria-hidden="true">
        <rect x={0} y={12} width={400} height={22} fill="url(#gCoal)" />
        <g opacity={0.85}>
          {KOMURLER.map(([cx, cy, rx, ry]) => (
            <ellipse key={cx} cx={cx} cy={cy} rx={rx} ry={ry} fill="#2A1A14" />
          ))}
        </g>
        <g opacity={0.6}>
          {KULLER.map(([cx, cy, rx, ry]) => (
            <ellipse key={cx} cx={cx} cy={cy} rx={rx} ry={ry} fill="#8A8078" />
          ))}
        </g>
        {SICAK.map((cx, i) => (
          <ellipse key={cx} cx={cx} cy={22} rx={14} ry={5} fill="url(#gEmber)" className={stil.sicak} style={{ '--esik': (i + 1) / 6 } as React.CSSProperties} />
        ))}
      </svg>
      {[0, 1].map((k) => (
        <svg key={k} viewBox="0 0 400 34" preserveAspectRatio="none" className={`${stil.yatak} ${k ? stil.parilti2 : stil.parilti1}`} aria-hidden="true">
          <g filter="url(#fBlur2)">
            {KOZLER.filter((_, i) => i % 2 === k).map(([cx, cy, rx, ry, renk, o]) => (
              <ellipse key={cx} cx={cx} cy={cy} rx={rx} ry={ry} opacity={o} className={renk === 'kor' ? stil.kor : undefined} fill={renk === 'kor' ? undefined : renk} />
            ))}
          </g>
        </svg>
      ))}
    </>
  )
}

const ALEVLER = [
  [2, 3.1, 0], [17, 2.4, -1], [33, 3.7, -0.4], [50, 2.8, -1.7], [66, 3.3, -0.8], [82, 2.6, -1.3],
] as const

/** Köz yatağının üstünde yükselen alev dilleri; her birinin sıcak sarı bir çekirdeği var. Yoğunluk komboyla. */
export function OcakAlevi() {
  return (
    <span className={stil.alevler} aria-hidden="true">
      {ALEVLER.map(([x, sure, gecikme]) => (
        <i key={x} className={stil.alev} style={{ left: `${x}%`, animationDuration: `${sure}s`, animationDelay: `${gecikme}s` }}>
          <b style={{ animationDuration: `${sure * 0.55}s`, animationDelay: `${gecikme}s` }} />
        </i>
      ))}
    </span>
  )
}
