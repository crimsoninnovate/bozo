import { sisGeometrisi, type Tane } from '@/lib/sis'
import type { SisUrun, Urun } from '@/lib/oyun/tipler'
import stil from './Semboller.module.css'

/*
 * Oyunun elle çizilmiş sembolleri (spec §13): 24'lük kare, çizgi `currentColor`,
 * fotoğraf ve üretilmiş görsel yok. Hepsi dekoratif; anlam düğmenin adından gelir.
 * Şiş gövdesi markanın kilitli geometrisinden (`lib/sis.ts`) türer.
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

/* Sofra: plaka, kor halkası, kalktı işareti. Fiş çerçevesi CSS'te (`.fis`). */

/** Üstten sini: düğmenin zemini, kenara kadar dolar. */
export function SofraPlakasi() {
  return (
    <svg viewBox="0 0 24 24" className={stil.plaka} aria-hidden="true">
      <circle cx={12} cy={12} r={11} className={stil.plakaZemin} />
      <circle cx={12} cy={12} r={8.6} className={stil.plakaIc} />
    </svg>
  )
}

/** Sabır halkası: `--oran` (0-1) kadar dolu, `pathLength` 100 ile CSS'ten kısalır. */
export function KorHalkasi() {
  return (
    <svg viewBox="0 0 24 24" className={stil.halka} aria-hidden="true">
      <circle cx={12} cy={12} r={11} pathLength={100} />
    </svg>
  )
}

export function KalktiIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <circle cx={12} cy={12} r={9} strokeDasharray="3 3" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </Simge>
  )
}

/* İkram tabakları: lebeni kasesi, bostana, yeşillik, sumaklı soğan. */

export function Lebeni({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <circle cx={12} cy={12} r={7.5} />
      <path d="M8.4 12.6c1.2-1.6 2.6-1.6 3.6 0s2.4 1.6 3.6 0" />
    </Simge>
  )
}

export function Bostana({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <circle cx={12} cy={12} r={7.5} />
      <g fill="currentColor" stroke="none">
        <rect x={8.6} y={9} width={2.6} height={2.6} />
        <rect x={12.6} y={10.4} width={2.6} height={2.6} />
        <rect x={9.8} y={13.2} width={2.6} height={2.6} />
      </g>
    </Simge>
  )
}

export function Yesillik({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M12 20V7" />
      <path d="M12 11c-3.2 0-5.4-2.2-5.4-5.4 3.2 0 5.4 2.2 5.4 5.4z" />
      <path d="M12 15c3.2 0 5.4-2.2 5.4-5.4-3.2 0-5.4 2.2-5.4 5.4z" />
    </Simge>
  )
}

export function SumakliSogan({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M4 16a8 8 0 0 1 16 0" />
      <path d="M7 16a5 5 0 0 1 10 0" />
      <path d="M10 16a2 2 0 0 1 4 0" />
      <path d="M4 16h16" />
      <g fill="currentColor" stroke="none">
        <circle cx={8} cy={5.5} r={0.9} />
        <circle cx={12} cy={4.2} r={0.9} />
        <circle cx={16} cy={5.5} r={0.9} />
      </g>
    </Simge>
  )
}

/* Ürün siluetleri: tane biçimi ürünü söyler, renk değil (spec §15). */

type TaneProps = { urun: SisUrun; cx: number; cy: number; kenar: number }

/** Ciğer kare, dalak enine oval, yürek yuvarlak köşeli eşkenar dörtgen. */
function TaneSekli({ urun, cx, cy, kenar }: TaneProps) {
  if (urun === 'dalak') return <ellipse cx={cx} cy={cy} rx={kenar * 0.34} ry={kenar * 0.6} />
  if (urun === 'yurek') {
    const k = kenar * 0.76
    const donus = `rotate(45 ${cx} ${cy})`
    return <rect x={cx - k / 2} y={cy - k / 2} width={k} height={k} rx={k * 0.28} transform={donus} />
  }
  return <rect x={cx - kenar / 2} y={cy - kenar / 2} width={kenar} height={kenar} rx={kenar * 0.15} />
}

/** Fiş, tezgah ve raf simgesi: tek tane, 24'lük karede. */
export function UrunSimgesi({ urun, boy }: Boy & { urun: Urun }) {
  if (urun === 'ayran') return <BakirMasrapa boy={boy} dolu />
  return (
    <Simge boy={boy}>
      <g fill="currentColor" stroke="none">
        <TaneSekli urun={urun} cx={12} cy={12} kenar={13} />
      </g>
    </Simge>
  )
}

/** Bozo Karışık fişi: üç siluet tek çubukta. */
export function KarisikFis({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M12 2.5v19" strokeWidth={1.2} />
      <g fill="currentColor" stroke="none">
        <TaneSekli urun="ciger" cx={12} cy={6.5} kenar={5.2} />
        <TaneSekli urun="dalak" cx={12} cy={12} kenar={5.6} />
        <TaneSekli urun="yurek" cx={12} cy={17.5} kenar={5.6} />
      </g>
    </Simge>
  )
}

/* Ocak: şiş gövdesi, ürün şişi (katmanlı), yanık şiş, çevirme işareti, yatak. */

const SIS = sisGeometrisi(6)
const s = (n: number) => n.toFixed(2)

/** Kilitli geometri yatay; ocakta dikey durur: x ve y yer değiştirir, uç üstte. */
function SisGovdesi() {
  const { uzunluk, taban, bogaz } = SIS.uc
  const uc = [
    `${s(SIS.eksen)},0`,
    `${s(SIS.eksen - taban / 2)},${s(uzunluk)}`,
    `${s(SIS.cubuk.y)},${s(uzunluk + bogaz)}`,
    `${s(SIS.cubuk.y + SIS.cubuk.boy)},${s(uzunluk + bogaz)}`,
    `${s(SIS.eksen + taban / 2)},${s(uzunluk)}`,
  ].join(' ')
  return (
    <g className={stil.govde}>
      <rect x={s(SIS.cubuk.y)} y={s(SIS.cubuk.x)} width={s(SIS.cubuk.boy)} height={s(SIS.cubuk.en)} />
      <polygon points={uc} />
      <circle cx={s(SIS.halka.cy)} cy={s(SIS.halka.cx)} r={s(SIS.halka.r)} strokeWidth={s(SIS.halka.kalinlik)} />
    </g>
  )
}

function Taneler({ urun }: { urun: SisUrun }) {
  return (
    <>
      {SIS.taneler.map((t: Tane) => {
        const cx = t.y + t.kenar / 2
        const cy = t.x + t.kenar / 2
        return t.ciger ? (
          <TaneSekli key={t.x} urun={urun} cx={cx} cy={cy} kenar={t.kenar} />
        ) : (
          <rect key={t.x} className={stil.yag} x={t.y} y={t.x} width={t.kenar} height={t.kenar} rx={t.kose} />
        )
      })}
    </>
  )
}

/**
 * Ocaktaki şiş. Üç katman aynı biçim: çiğ krem, üstünde `--pisme` kadar bakır,
 * onun üstünde `--yanma` kadar kömür; renk geçişi yalnız opaklıkla.
 */
export function UrunSisi({ urun }: { urun: SisUrun }) {
  return (
    <svg viewBox={`0 0 ${s(SIS.boy)} ${s(SIS.en)}`} className={stil.sis} aria-hidden="true">
      <SisGovdesi />
      <g className={stil.cig}>
        <Taneler urun={urun} />
      </g>
      <g className={stil.pismis}>
        <Taneler urun={urun} />
      </g>
      <g className={stil.komur}>
        <Taneler urun={urun} />
      </g>
    </svg>
  )
}

/** Yanık şiş: kömür dolgu, krem kontur; renkten bağımsız okunsun diye kontur var. */
export function YanikSis() {
  return (
    <svg viewBox={`0 0 ${s(SIS.boy)} ${s(SIS.en)}`} className={stil.sis} aria-hidden="true">
      <SisGovdesi />
      <g className={stil.yanik}>
        <Taneler urun="ciger" />
      </g>
    </svg>
  )
}

export function CevirmeIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M5.5 12a6.5 6.5 0 1 1 2.3 5" />
      <path d="M7.8 13.2V17H4" />
    </Simge>
  )
}

/** Ocak yatağı: közler, en altta; `xMidYMax slice` ile şeridin dibine yaslanır. */
export function OcakYatagi() {
  const kozler = [3, 11, 19, 28, 36, 45, 54, 62, 71, 80, 88, 96]
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="xMidYMax slice" className={stil.yatak} aria-hidden="true">
      {kozler.map((x, i) => (
        <rect
          key={x}
          x={x}
          y={16 + (i % 3) * 2}
          width={2.4}
          height={2.4}
          className={i % 4 === 0 ? stil.kozSicak : stil.koz}
        />
      ))}
    </svg>
  )
}

/* İstasyon: açık yayık, bakır maşrapa. Tezgah yuvası CSS'te (`.tezgahYuva`). */

export function AcikYayik({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M8 9h8l1 11H7z" />
      <path d="M6.5 9h11M12 9V3M9.5 3h5" />
    </Simge>
  )
}

/** Maşrapa; `dolu` değilse dolum `--oran` ile alttan yükselir. */
export function BakirMasrapa({ boy, dolu = false }: Boy & { dolu?: boolean }) {
  return (
    <Simge boy={boy}>
      <rect x={6} y={6} width={10} height={13} rx={1} />
      <path d="M16 9.5h1.5a2.5 2.5 0 0 1 0 5H16" />
      <rect
        x={7.5}
        y={7.5}
        width={7}
        height={10}
        className={dolu ? stil.dolu : stil.dolum}
        fill="currentColor"
        stroke="none"
      />
    </Simge>
  )
}

/* HUD: kombo rozeti, porsiyon rozeti, ocak söner, duraklat, ses. Saat rayı CSS'te. */

export function KomboRozeti() {
  return (
    <svg viewBox="0 0 24 24" className={stil.rozet} aria-hidden="true">
      <circle cx={12} cy={12} r={11} />
      <circle cx={12} cy={12} r={8.6} strokeDasharray="1.6 1.6" />
    </svg>
  )
}

export function PorsiyonRozeti() {
  return (
    <svg viewBox="0 0 24 24" className={stil.rozet} aria-hidden="true">
      <circle cx={12} cy={12} r={11} />
      <path d="M12 1.5l1.2 2.4M12 22.5l-1.2-2.4M1.5 12l2.4-1.2M22.5 12l-2.4 1.2" />
    </svg>
  )
}

export function OcakSonerIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M5 19h14M5 15.5h14" />
      <path d="M12 12c-2.2-2.2.4-4-1.4-6.4" />
    </Simge>
  )
}

export function DuraklatIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M9 6v12M15 6v12" strokeWidth={2.2} />
    </Simge>
  )
}

export function SesIsareti({ boy, acik }: Boy & { acik: boolean }) {
  return (
    <Simge boy={boy}>
      <path d="M5 10v4h3l4 3.5v-11L8 10z" />
      {acik ? <path d="M15.5 9.5a3.6 3.6 0 0 1 0 5M18 7.5a7 7 0 0 1 0 9" /> : <path d="M15.5 9.5l4 5M19.5 9.5l-4 5" />}
    </Simge>
  )
}

/* Diğer: kor noktası ipucu. Sabit QR ve paylaşım kartı şablonu plan 4'te (spec §14). */

export function KorNoktasi({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <circle cx={12} cy={12} r={3.2} fill="currentColor" stroke="none" />
      <circle cx={12} cy={12} r={7.5} className={stil.hale} />
    </Simge>
  )
}
