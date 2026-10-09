import type { Eslikci, TabakKalemi, Urun } from '@/lib/oyun/tipler'
import { EslikciGlifi, Tane, TaneKatmanlari } from './SahneTane'
import stil from './SahneTezgah.module.css'

/* Tabak şeridinin boyalı parçaları: bakır tabak, kalemler, kaseler, çöp; raf tepsisi. */

const TEPSI = [[16, 12], [32, 13], [24, 6]] as const

/** 80×60 bakır tabak ve gölgesi; üstüne kalemler gelir. */
export function BakirTabak({ children }: { children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 80 60" className={stil.bakirTabak} aria-hidden="true">
      <ellipse cx={40} cy={34} rx={30} ry={18} fill="#000" opacity={0.28} filter="url(#fBlur2)" />
      <ellipse cx={40} cy={30} rx={31} ry={19} fill="url(#gBakirTabak)" stroke="#F0B27A" strokeWidth={0.8} />
      <ellipse cx={40} cy={30} rx={23} ry={13} fill="none" stroke="#7A4222" strokeWidth={1.2} opacity={0.6} />
      {children}
    </svg>
  )
}

/** Tabaktaki kalemler: en çok dört, tabağın üstüne yan yana; şiş yatay pişmiş tane, eşlikçi glif. */
export function TabakKalemleri({ kalemler }: { kalemler: readonly TabakKalemi[] }) {
  return (
    <g transform="translate(40 28)">
      {kalemler.map((k, i) => (
        <g key={i} transform={`translate(${(i - (kalemler.length - 1) / 2) * 16} 0) scale(0.8)`}>
          {k.kalite === null ? <EslikciGlifi urun={k.urun as Eslikci} /> : <TaneKatmanlari urun={k.urun as Urun} pismis />}
        </g>
      ))}
    </g>
  )
}

/** Kase: ceviz çanak, içinde eşlikçi yığını; kaseden çıkan öğe `[data-tasinir]` glifidir. */
export function Kase({ urun }: { urun: Eslikci }) {
  return (
    <svg viewBox="0 0 56 56" className={stil.kase} aria-hidden="true">
      <ellipse cx={28} cy={50} rx={20} ry={4} fill="#000" opacity={0.4} filter="url(#fBlur2)" />
      <path d="M8 24h40l-5 24H13z" fill="url(#gWood)" stroke="rgba(0,0,0,.5)" strokeWidth={0.8} />
      <ellipse cx={28} cy={24} rx={20} ry={5.5} fill="#2A1A14" stroke="rgba(255,255,255,.15)" strokeWidth={0.8} />
      {[-8, 0, 8].map((x) => (
        <g key={x} transform={`translate(${28 + x} ${22 - Math.abs(x) / 4}) scale(0.6)`}>
          <EslikciGlifi urun={urun} />
        </g>
      ))}
    </svg>
  )
}

/** Çöp: bakır kova, kapaksız. */
export function CopKovasi() {
  return (
    <svg viewBox="0 0 56 56" className={stil.kova} aria-hidden="true">
      <ellipse cx={28} cy={50} rx={18} ry={4} fill="#000" opacity={0.4} filter="url(#fBlur2)" />
      <path d="M12 16h32l-3 34H15z" fill="url(#gCopper)" stroke="rgba(0,0,0,.5)" strokeWidth={0.8} />
      <ellipse cx={28} cy={16} rx={16} ry={4.5} fill="#2A1A14" stroke="#F0B27A" strokeWidth={1} />
      <path d="M18 24v20M38 24v20" stroke="#fff" strokeWidth={1.2} opacity={0.25} strokeLinecap="round" />
    </svg>
  )
}

/** Raf tepsisi: siyah tepsi üstünde üç çiğ tane. */
export function RafTepsisi({ urun }: { urun: Urun }) {
  return (
    <svg viewBox="0 0 48 40" width={48} height={40} className={stil.tepsi} aria-hidden="true">
      <ellipse cx={24} cy={36} rx={20} ry={4} fill="#000" opacity={0.45} filter="url(#fBlur2)" />
      <path d="M4 14h40l-3 20H7z" fill="#2A2320" stroke="rgba(255,255,255,.15)" strokeWidth={0.8} />
      <ellipse cx={24} cy={14} rx={20} ry={4.5} fill="#3A302B" stroke="rgba(255,255,255,.2)" strokeWidth={0.8} />
      {TEPSI.map(([x, y]) => (
        <Tane key={x} urun={urun} x={x} y={y} olcek={0.7} />
      ))}
    </svg>
  )
}
