import stil from './Semboller.module.css'

/*
 * HUD ve durum simgeleri (24'lük kare, çizgi `currentColor`, handoff OyunAlani ikon yolları).
 * Boyalı sahne parçaları `SahneSofra`, `SahneOcak`, `SahneTezgah`; şiş geometrisi `lib/sis`
 * yalnız marka işaretinde kalır (K5). Hepsi dekoratif; anlam düğmenin adından gelir.
 */

type Boy = { boy?: number }
type SimgeProps = Boy & { sinif?: string; children: React.ReactNode }

function Simge({ boy = 24, sinif, children }: SimgeProps) {
  return (
    <svg
      width={boy}
      height={boy}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={sinif}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

/** Sofra kalktı: çıkış oku; kesik halka `SahneSofra`da. */
export function KalktiIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M7 17 17 7M9 7h8v8" />
    </Simge>
  )
}

export function CevirmeIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M19 12a7 7 0 0 1-12.2 4.7" />
      <path d="M5 12A7 7 0 0 1 17.2 7.3" />
      <path d="M17 4v3.5h-3.5" />
      <path d="M7 20v-3.5h3.5" />
    </Simge>
  )
}

export function OcakSonerIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M12 20c-3.3 0-5.5-2.2-5.5-5.2 0-2.7 1.8-4.4 3-6.3.5 1.2 1 1.8 1.8 2.3.3-2.3 1.2-4 2.7-5.6 2.2 2.4 3.5 4.8 3.5 7.9 0 3.6-2.2 6.9-5.5 6.9z" />
      <path d="M4 20 20 4" />
    </Simge>
  )
}

export function TezgahDoluIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M3 15h18M5 15c0 2.8 3.1 4 7 4s7-1.2 7-4" />
      <path d="M9 6l6 6M15 6l-6 6" />
    </Simge>
  )
}

export function DuraklatIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M9 5v14M15 5v14" />
    </Simge>
  )
}

export function SesIsareti({ boy, acik }: Boy & { acik: boolean }) {
  return (
    <Simge boy={boy}>
      <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5z" />
      {acik ? <path d="M16.5 9.2a4 4 0 0 1 0 5.6" /> : <path d="M16 10l4 4M20 10l-4 4" />}
    </Simge>
  )
}

/** Kombo altıgeni 38×32: pasif koyu, aktif pirinç (`[data-carpan]` ile CSS'te). */
export function KomboRozeti() {
  return (
    <svg viewBox="0 0 38 32" className={stil.altigen} aria-hidden="true">
      <path d="M10 2h18l8 14-8 14H10L2 16z" className={stil.altigenDolgu} strokeWidth={1.6} />
      <path d="M12 5h14l6.3 11L26 27H12L5.7 16z" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={1} />
    </svg>
  )
}

/** "Bir porsiyon" rozeti: küçük pirinç altıgen, 12 şiş (spec §6); `tepkiler.ts` basar. */
export function PorsiyonRozeti() {
  return (
    <svg viewBox="0 0 38 32" className={stil.altigen} aria-hidden="true">
      <path d="M10 2h18l8 14-8 14H10L2 16z" fill="url(#gBrass)" stroke="#E2C275" strokeWidth={1.6} />
    </svg>
  )
}

/** İlk turun ipucu: kor noktası, halkalı. */
export function KorNoktasi({ boy = 16 }: Boy) {
  return (
    <svg width={boy} height={boy} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx={8} cy={8} r={8} fill="rgba(255,122,26,.35)" />
      <circle cx={8} cy={8} r={3.5} fill="#FF7A1A" className={stil.korCekirdek} />
    </svg>
  )
}
