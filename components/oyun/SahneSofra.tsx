import stil from './SahneSofra.module.css'

/*
 * Sofranın boyalı katmanları (handoff OyunAlani 86-116): ceviz tabla ve örtü, dört ikram
 * tabağı, kor halkası, kalktı halkası. Her SVG 100×100; konum ve ölçü çağıran modülde.
 */

/** Kapalı hücre: kesik kare. */
export function KapaliSofra() {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <rect x={16} y={14} width={68} height={68} fill="rgba(0,0,0,.25)" stroke="var(--cizgi-plaka)" strokeWidth={1} strokeDasharray="4 5" />
    </svg>
  )
}

/** Ceviz tabla, ön kenar, krem örtü ve çapraz dikiş. */
export function SofraPlakasi() {
  return (
    <svg viewBox="0 0 100 100" className={`${stil.katman} ${stil.plaka}`} aria-hidden="true">
      <ellipse cx={50} cy={86} rx={40} ry={7} fill="#000" opacity={0.5} filter="url(#fBlur6)" />
      <rect x={16} y={14} width={68} height={68} fill="url(#gWood)" />
      <rect x={16} y={14} width={68} height={68} filter="url(#fWood)" opacity={0.7} />
      <rect x={16} y={82} width={68} height={6} fill="url(#gWoodFront)" />
      <rect x={21} y={19} width={58} height={58} fill="url(#gCloth)" />
      <path d="M21 19 79 77M79 19 21 77" stroke="#fff" strokeWidth={0.8} opacity={0.35} />
      <rect x={21} y={19} width={58} height={58} fill="none" stroke="#B9A07A" strokeWidth={0.8} opacity={0.6} />
    </svg>
  )
}

/** Dört ikram: lebeni, bostana, yeşillik, sumaklı soğan. `data-tabak` sırayla iner (`tepkiler.ts`). */
export function IkramTabaklari() {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <g filter="url(#fShadow)">
        <g data-tabak className={stil.tabak}>
          <circle cx={30} cy={29} r={8} fill="url(#gBakirTabak)" stroke="#F0B27A" strokeWidth={0.6} />
          <circle cx={30} cy={29} r={5.6} fill="url(#gYogurt)" />
          <path d="M27 28c2 1.5 4.5 1.5 6 0" stroke="#C8B48E" strokeWidth={0.9} fill="none" />
        </g>
        <g data-tabak className={stil.tabak}>
          <circle cx={70} cy={29} r={8} fill="url(#gBakirTabak)" stroke="#F0B27A" strokeWidth={0.6} />
          <circle cx={70} cy={29} r={5.8} fill="#C8402E" />
          <circle cx={68} cy={27.5} r={1.6} fill="#8FBF5A" />
          <circle cx={72.5} cy={30.5} r={1.4} fill="#5E8A3A" />
          <circle cx={71.5} cy={26.6} r={1.1} fill="#F3E2C7" />
        </g>
        <g data-tabak className={stil.tabak}>
          <circle cx={30} cy={69} r={8} fill="url(#gBakirTabak)" stroke="#F0B27A" strokeWidth={0.6} />
          <path d="M25 70c2-5 7-5 9-1-3-1-6 1-9 1zM27 66c3-2 6-1 7 2-3 0-5-1-7-2z" fill="#5E8A3A" />
          <path d="M26 71c3-3 6-3 8-1" stroke="#8FBF5A" strokeWidth={1} fill="none" />
        </g>
        <g data-tabak className={stil.tabak}>
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
    <svg viewBox="0 0 100 100" className={`${stil.katman} ${stil.halka}`} aria-hidden="true">
      <circle {...HALKA} className={stil.hale} stroke="#FF7A1A" filter="url(#fBlur6)" />
      <circle {...HALKA} className={stil.hat} stroke="url(#gHalka)" strokeWidth={3} />
      <circle cx={50} cy={50} r={48} fill="none" className={stil.kesik} strokeWidth={3.6} strokeDasharray="1.2 7 0.8 9 1.4 6 0.9 8" transform="rotate(-90 50 50)" />
      <circle {...HALKA} className={stil.hat} stroke="#FFE2A8" strokeWidth={1} opacity={0.5} />
    </svg>
  )
}

/** Kalkmış sofra: küle dönmüş kesik halka; çıkış oku `Semboller`den üstüne gelir. */
export function KalktiHalkasi() {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <circle cx={50} cy={50} r={48} fill="none" stroke="#8A8078" strokeWidth={2.6} strokeDasharray="2 5" opacity={0.6} />
    </svg>
  )
}
