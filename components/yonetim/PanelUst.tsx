'use client'

import { useRef } from 'react'
import { CikisIkon } from '@/components/ui/Ikonlar'
import { yonetim as m } from '@/content/yonetim'
import { SEKMELER, type Sekme } from '@/lib/menu/panel'
import { SiteDurumu } from './SiteDurumu'
import stil from './PanelUst.module.css'

type SekmeProps = {
  sekme: Sekme
  /** Doğrulama hatası taşıyan sekmeler (`hataSekmeleri`). */
  hatali: ReadonlySet<Sekme>
  sec: (s: Sekme) => void
}

/** Kayan tek satır; seçilen düğme satırın ortasına gelir, sayfa içeriğin başına döner. */
function Sekmeler({ sekme, hatali, sec }: SekmeProps) {
  const satir = useRef<HTMLDivElement>(null)
  const tikla = (s: Sekme, dugme: HTMLButtonElement) => {
    sec(s)
    const k = satir.current
    if (k) k.scrollTo({ left: dugme.offsetLeft - (k.clientWidth - dugme.offsetWidth) / 2 })
    window.scrollTo(0, 0)
  }
  return (
    <div ref={satir} className={stil.sekmeler} role="group" aria-label={m.menu.sekmeler}>
      {SEKMELER.map((s) => (
        <button key={s} type="button" className={stil.sekme} aria-pressed={sekme === s}
          onClick={(o) => tikla(s, o.currentTarget)}>
          {m.menu.sekme[s]}
          {hatali.has(s) && (
            <>
              <span className={stil.isaret} aria-hidden="true" />
              <span className={stil.gizli}> {m.menu.sekmeHatali}</span>
            </>
          )}
        </button>
      ))}
    </div>
  )
}

type Props = {
  cik: () => void
  /** Menü yüklenince gelir: durum satırı ve sekmeler ancak o zaman görünür. */
  calisma?: SekmeProps & { taban: number | null }
}

/** Yapışkan üst: başlık, sitenin tek satırlık durumu ve Çıkış; hemen altında sekmeler. */
export function PanelUst({ cik, calisma }: Props) {
  return (
    <header className={stil.ust}>
      <div className={stil.satir}>
        <div className={stil.kimlik}>
          <h1 className={stil.baslik}>{m.menu.baslik}</h1>
          {calisma && <SiteDurumu kisa yayinSurum={calisma.taban} />}
        </div>
        <button type="button" className={stil.cikis} onClick={cik}>
          <CikisIkon boy={18} />
          {m.cikis}
        </button>
      </div>
      {calisma && <Sekmeler sekme={calisma.sekme} hatali={calisma.hatali} sec={calisma.sec} />}
    </header>
  )
}
