'use client'

import { CikisIkon } from '@/components/ui/Ikonlar'
import { ROZET } from '@/components/ui/Rozet'
import { yonetim as m } from '@/content/yonetim'
import { sekmeGruplari, type Sekme } from '@/lib/menu/panel'
import { doldur } from '@/lib/metin'
import type { BenYaniti } from '@/lib/yonetim/personel'
import { oturumuSil } from './oturum'
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

/**
 * Telefonda telefonun kendi gruplu seçim listesi (tek dokunuşla bütün bölümler); masaüstünde başlıklı gruplarla
 * kenar menüsü. Seçimden sonra sayfa içeriğin başına döner.
 */
function Sekmeler({ sekme, hatali, sec, admin }: SekmeProps) {
  const gruplar = sekmeGruplari(admin)
  const git = (s: Sekme) => {
    sec(s)
    window.scrollTo(0, 0)
  }
  const ad = (s: Sekme) => (hatali.has(s) ? `${m.menu.sekme[s]} ${m.menu.sekmeHatali}` : m.menu.sekme[s])
  return (
    <>
      <label className={stil.secici}>
        <span className={stil.seciciAdi}>{m.menu.bolum}</span>
        <select value={sekme} onChange={(o) => git(o.target.value as Sekme)}>
          {gruplar.map(({ grup, sekmeler }) => (
            <optgroup key={grup} label={m.menu.grup[grup]}>
              {sekmeler.map((s) => <option key={s} value={s}>{ad(s)}</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <nav className={stil.sekmeler} aria-label={m.menu.sekmeler}>
        {gruplar.map(({ grup, sekmeler }) => (
          <div key={grup} className={stil.grup} role="group" aria-label={m.menu.grup[grup]}>
            <span className={stil.grupAdi} aria-hidden="true">{m.menu.grup[grup]}</span>
            {sekmeler.map((s) => (
              <button key={s} type="button" className={stil.sekme} aria-pressed={sekme === s}
                onClick={() => git(s)}>
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
        ))}
      </nav>
    </>
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

/** Telefonda yapışkan üst (başlık, hesap, durum, Çıkış, sekmeler); masaüstünde sabit kenar menüsü. */
export function PanelUst({ cik, kim, sifreAc, calisma }: Props) {
  return (
    <header className={stil.ust}>
      <div className={stil.satir}>
        <div className={stil.kimlik}>
          <h1 className={stil.baslik}>
            <img className={stil.logo} src={ROZET} alt="" width={1748} height={1999} />
            {m.menu.baslik}
          </h1>
          {kim && (
            <p className={stil.hesap}>
              {doldur(m.ust.girisYapan, { ad: kim.ad })}
              {sifreAc && !kim.admin && (
                <button type="button" className={stil.sifre} onClick={sifreAc}>{m.ust.sifreDegistir}</button>
              )}
            </p>
          )}
          {calisma && (
            <div className={stil.durum}>
              <SiteDurumu kisa yayinSurum={calisma.taban} siteSurum={calisma.siteSurum} />
            </div>
          )}
        </div>
        <button type="button" className={stil.cikis} onClick={() => { oturumuSil(); cik() }}>
          <CikisIkon boy={18} />
          {m.cikis}
        </button>
      </div>
      {calisma && <Sekmeler {...calisma} />}
    </header>
  )
}
