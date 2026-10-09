import stil from './Semboller.module.css'

/*
 * HUD ve durum simgeleri (24'lük kare, çizgi `currentColor`, handoff OyunAlani ikon yolları).
 * Boyalı sahne parçaları `SahneMisafir`, `SahneOcak`, `SahneTezgah`; şiş geometrisi `lib/sis`
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

/** Misafir kalktı: çıkış oku; kesik halka `SahneMisafir`de. */
export function KalktiIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M7 17 17 7M9 7h8v8" />
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

/** Rehberin işaret eli: parmak yukarı bakar. */
export function ElIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10" />
      <path d="M12 10V8.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M15 11V10a1.5 1.5 0 0 1 3 0v4.5c0 3.6-2.4 6-5.5 6H12c-2.2 0-3.5-1-4.6-2.6L4.7 13.6a1.5 1.5 0 0 1 2.5-1.6L9 14" />
    </Simge>
  )
}
