import stil from './SahneMisafir.module.css'

/*
 * Misafir şeridinin boyalı katmanları: yüzsüz siluet (üç varyant), kor halkası, kalktı halkası,
 * önündeki ikram tabakları, bahşiş parası. Her SVG 100×100; konum ve ölçü çağıran modülde.
 */

const SILUET = [
  'M50 14a13 13 0 1 1 0 26a13 13 0 0 1 0-26zM22 92c2-24 12-34 28-34s26 10 28 34z',
  'M50 12a14 14 0 1 1 0 28a14 14 0 0 1 0-28zM18 92c1-22 13-32 32-32s31 10 32 32zM36 20c4-8 24-8 28 0',
  'M50 16a12 12 0 1 1 0 24a12 12 0 0 1 0-24zM24 92c0-26 11-36 26-36s26 10 26 36zM40 50l10 8 10-8',
] as const

/** Yüzsüz misafir silueti: koyu ceviz dolgu, bakır kenar; varyant 0-2. */
export function MisafirSilueti({ varyant }: { varyant: number }) {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <path d={SILUET[varyant % 3]} fill="#3A2218" stroke="#B86F3A" strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  )
}

/** Boş yer: kesik kare. */
export function BosYer() {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <rect x={16} y={14} width={68} height={68} fill="rgba(0,0,0,.25)" stroke="var(--cizgi-plaka)" strokeWidth={1} strokeDasharray="4 5" />
    </svg>
  )
}

/** Bahşiş parası: bakır sikke, pirinç kenar, üstünde kor halkası izi. */
export function BahsisParasi() {
  return (
    <svg viewBox="0 0 48 48" className={stil.para} aria-hidden="true">
      <ellipse cx={24} cy={40} rx={16} ry={4} fill="#000" opacity={0.4} filter="url(#fBlur2)" />
      <circle cx={24} cy={24} r={18} fill="url(#gCopper)" stroke="url(#gBrass)" strokeWidth={2.4} />
      <circle cx={24} cy={24} r={11} fill="none" stroke="#F0B27A" strokeWidth={1.2} opacity={0.7} />
      <ellipse cx={18} cy={17} rx={5} ry={2.4} fill="#fff" opacity={0.3} />
    </svg>
  )
}

/** Dört ikram: lebeni, bostana, yeşillik, sumaklı soğan. Her zaman görünür. */
export function IkramTabaklari() {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <g filter="url(#fShadow)">
        <g>
          <circle cx={30} cy={29} r={8} fill="url(#gBakirTabak)" stroke="#F0B27A" strokeWidth={0.6} />
          <circle cx={30} cy={29} r={5.6} fill="url(#gYogurt)" />
          <path d="M27 28c2 1.5 4.5 1.5 6 0" stroke="#C8B48E" strokeWidth={0.9} fill="none" />
        </g>
        <g>
          <circle cx={70} cy={29} r={8} fill="url(#gBakirTabak)" stroke="#F0B27A" strokeWidth={0.6} />
          <circle cx={70} cy={29} r={5.8} fill="#C8402E" />
          <circle cx={68} cy={27.5} r={1.6} fill="#8FBF5A" />
          <circle cx={72.5} cy={30.5} r={1.4} fill="#5E8A3A" />
          <circle cx={71.5} cy={26.6} r={1.1} fill="#F3E2C7" />
        </g>
        <g>
          <circle cx={30} cy={69} r={8} fill="url(#gBakirTabak)" stroke="#F0B27A" strokeWidth={0.6} />
          <path d="M25 70c2-5 7-5 9-1-3-1-6 1-9 1zM27 66c3-2 6-1 7 2-3 0-5-1-7-2z" fill="#5E8A3A" />
          <path d="M26 71c3-3 6-3 8-1" stroke="#8FBF5A" strokeWidth={1} fill="none" />
        </g>
        <g>
          <circle cx={70} cy={69} r={8} fill="url(#gBakirTabak)" stroke="#F0B27A" strokeWidth={0.6} />
          <circle cx={70} cy={69} r={5} fill="none" stroke="#B07AB8" strokeWidth={1.8} />
          <circle cx={70} cy={69} r={2.4} fill="none" stroke="#7D4B8C" strokeWidth={1.2} />
          <circle cx={67} cy={66} r={0.9} fill="#7A1F2E" />
          <circle cx={73} cy={71.5} r={0.9} fill="#7A1F2E" />
          <circle cx={72} cy={65.5} r={0.8} fill="#7A1F2E" />
        </g>
      </g>
    </svg>
  )
}

const HALKA = { cx: 50, cy: 50, r: 48, pathLength: 100, fill: 'none', transform: 'rotate(-90 50 50)' } as const

/**
 * Kor halkası: `--oran` (0-1) kadar dolu, `pathLength` 100 ile CSS'ten kısalır. Alttan üste:
 * hale (blur), köz gradyanlı ana hat, zemin renginde düzensiz kesikler, üst parıltı.
 */
export function KorHalkasi() {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <circle {...HALKA} className={stil.hale} stroke="#FF7A1A" filter="url(#fBlur6)" />
      <circle {...HALKA} className={stil.hat} stroke="url(#gHalka)" strokeWidth={3} />
      <circle cx={50} cy={50} r={48} fill="none" className={stil.kesik} strokeWidth={3.6} strokeDasharray="1.2 7 0.8 9 1.4 6 0.9 8" transform="rotate(-90 50 50)" />
      <circle {...HALKA} className={stil.hat} stroke="#FFE2A8" strokeWidth={1} opacity={0.5} />
    </svg>
  )
}

/** Kalkmış misafir: küle dönmüş kesik halka; çıkış oku `Semboller`den üstüne gelir. */
export function KalktiHalkasi() {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <circle cx={50} cy={50} r={48} fill="none" stroke="#8A8078" strokeWidth={2.6} strokeDasharray="2 5" opacity={0.6} />
    </svg>
  )
}
