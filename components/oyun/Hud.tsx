import type { Sozluk } from '@/content'
import { DuraklatIsareti, KomboRozeti, OcakSonerIsareti, PorsiyonRozeti, SesIsareti } from './Semboller'
import type { Ses } from './useSes'
import stil from './Hud.module.css'

/*
 * HUD (handoff OyunAlani 50-72): saat rayı, saat, puan, ×2 ve kombo rozetleri, ses, duraklat,
 * görünür duyuru satırı. Değerler `ciz.ts`'ten `data-ciz` öğelerine yazılır. Gövde bir ızgara:
 * telefonda ×2 duyuru satırının sağına iner (beş haneli puanla satır 390'a sığmıyor, ölçüldü).
 */

type Props = { metin: Sozluk['oyun']; duraklat: () => void; ses: Ses }

const CIZGILER = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100] as const

/** 21:00'den 05:00'e: dokuz saat çizgisi, dolum ve imleç `--oran`, ucunda ocak söner. */
function SaatRayi() {
  return (
    <span className={stil.ray} data-ciz="gece" aria-hidden="true">
      {CIZGILER.map((x) => (
        <span key={x} className={stil.cizgi} style={{ left: `${x}%` }} />
      ))}
      <span className={stil.dolum} />
      <span className={stil.imlec} />
      <span className={stil.rayUcu}>
        <OcakSonerIsareti boy={24} />
      </span>
    </span>
  )
}

export function Hud({ metin, duraklat, ses }: Props) {
  return (
    <header className={stil.hud}>
      <SaatRayi />
      <div className={stil.govde}>
        <span className={stil.saat}>
          <span className={stil.gizli}>{metin.saat} </span>
          <span data-ciz="saat">21:00</span>
        </span>
        <span className={stil.ayirici} aria-hidden="true" />
        <span className={stil.puan}>
          <span className={stil.gizli}>{metin.puan} </span>
          <span data-ciz="puan">0</span>
        </span>
        <span className={stil.carpan} aria-hidden="true">
          ×2
        </span>
        <span className={stil.kombo} data-ciz="kombo" data-rozet="kombo">
          <KomboRozeti />
          <span className={stil.gizli}>{metin.kombo} </span>
          <span data-kombo>×1</span>
        </span>
        <span className={stil.porsiyon} data-rozet="porsiyon" aria-hidden="true">
          <PorsiyonRozeti />
          <span>12</span>
        </span>
        <span className={stil.bosluk} />
        <button
          type="button"
          className={stil.dugme}
          aria-label={metin.ses}
          aria-pressed={ses.acik}
          onClick={ses.degistir}
        >
          <SesIsareti boy={24} acik={ses.acik} />
        </button>
        <button type="button" className={stil.dugme} aria-label={metin.duraklat} onClick={duraklat}>
          <DuraklatIsareti boy={24} />
        </button>
        <p className={stil.duyuru} aria-live="polite" data-duyuru />
      </div>
    </header>
  )
}
