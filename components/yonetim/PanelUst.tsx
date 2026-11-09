'use client'

import { useRef } from 'react'
import { CikisIkon } from '@/components/ui/Ikonlar'
import { yonetim as m } from '@/content/yonetim'
import { gorunurSekmeler, type Sekme } from '@/lib/menu/panel'
import { doldur } from '@/lib/metin'
import type { BenYaniti } from '@/lib/yonetim/personel'
import { SiteDurumu } from './SiteDurumu'
import stil from './PanelUst.module.css'

type SekmeProps = {
  sekme: Sekme
  /** Doğrulama hatası taşıyan sekmeler (`hataSekmeleri`). */
  hatali: ReadonlySet<Sekme>
  sec: (s: Sekme) => void
  /** Kullanıcılar sekmesi yalnız adminde görünür. */
  admin: boolean
}

/** Kayan tek satır; seçilen düğme satırın ortasına gelir, sayfa içeriğin başına döner. */
function Sekmeler({ sekme, hatali, sec, admin }: SekmeProps) {
  const satir = useRef<HTMLDivElement>(null)
  const tikla = (s: Sekme, dugme: HTMLButtonElement) => {
    sec(s)
    const k = satir.current
    if (k) k.scrollTo({ left: dugme.offsetLeft - (k.clientWidth - dugme.offsetWidth) / 2 })
    window.scrollTo(0, 0)
  }
  return (
    <div ref={satir} className={stil.sekmeler} role="group" aria-label={m.menu.sekmeler}>
      {gorunurSekmeler(admin).map((s) => (
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
  /** Giriş yapan hesap; okununca adı görünür. */
  kim?: BenYaniti | null
  /** Admin dışındaki hesaplarda "Şifremi Değiştir"; zorunlu şifre ekranında verilmez. */
  sifreAc?: () => void
  /** Menü yüklenince gelir: durum satırı ve sekmeler ancak o zaman görünür. */
  calisma?: SekmeProps & { taban: number | null; siteSurum: number }
}

/** Yapışkan üst: başlık, sitenin tek satırlık durumu ve Çıkış; hemen altında sekmeler. */
export function PanelUst({ cik, kim, sifreAc, calisma }: Props) {
  return (
    <header className={stil.ust}>
      <div className={stil.satir}>
        <div className={stil.kimlik}>
          <h1 className={stil.baslik}>{m.menu.baslik}</h1>
          {kim && (
            <p className={stil.hesap}>
              {doldur(m.ust.girisYapan, { ad: kim.ad })}
              {sifreAc && !kim.admin && (
                <button type="button" className={stil.sifre} onClick={sifreAc}>{m.ust.sifreDegistir}</button>
              )}
            </p>
          )}
          {calisma && <SiteDurumu kisa yayinSurum={calisma.taban} siteSurum={calisma.siteSurum} />}
        </div>
        <button type="button" className={stil.cikis} onClick={cik}>
          <CikisIkon boy={18} />
          {m.cikis}
        </button>
      </div>
      {calisma && <Sekmeler {...calisma} />}
    </header>
  )
}
