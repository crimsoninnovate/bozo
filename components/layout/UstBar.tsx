'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { Buton } from '@/components/ui/Buton'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import { ustBarVaryanti, type NavOgesi, type UstBarCta } from '@/lib/kabuk'
import { yol, yolTarifiUrl, type RotaAnahtari } from '@/lib/site'
import { Cekmece } from './Cekmece'
import { DilAnahtari } from './DilAnahtari'
import { GeceSeridi } from './GeceSeridi'
import { IlerlemeCubugu } from './IlerlemeCubugu'
import stil from './UstBar.module.css'

type Props = {
  dil: Dil
  aktif: RotaAnahtari
}

function ctaHedefi(cta: UstBarCta, dil: Dil): { href: string; hariciMi: boolean } {
  switch (cta.tur) {
    case 'harici':
      return { href: yolTarifiUrl(), hariciMi: true }
    case 'rota':
      return { href: yol(cta.rota, dil), hariciMi: false }
    case 'capa':
      return { href: `#${cta.hedef}`, hariciMi: false }
  }
}

function NavOgeleri({ nav, dil, aktif }: { nav: NavOgesi[]; dil: Dil; aktif: RotaAnahtari }) {
  const s = sozluk(dil)
  return (
    <>
      {nav.map((oge) => {
        const etiket = s.ortak.nav[oge.etiket]
        if (oge.tur === 'capa') {
          return (
            <a key={`#${oge.hedef}`} href={`#${oge.hedef}`} className={stil.link}>
              {etiket}
            </a>
          )
        }
        if (oge.rota === aktif) {
          return (
            <span key={oge.rota} className={stil.aktifLink} aria-current="page">
              {etiket}
            </span>
          )
        }
        return (
          <Link key={oge.rota} href={yol(oge.rota, dil)} className={stil.link}>
            {etiket}
          </Link>
        )
      })}
    </>
  )
}

/**
 * Sabit üst bar. Nav listesi, CTA hedefi ve bar ölçüsü rotaya göre değişir;
 * varyant tablosu `lib/kabuk.ts` içinde durur (kaynak satırları orada). Ana
 * sayfa 80px satır + ilerleme rayı, iç sayfalar 78px ve raysız. 780px altında
 * nav ve CTA gizlenir, hamburger görünür ve tam ekran Cekmece'yi açar.
 */
export function UstBar({ dil, aktif }: Props) {
  const [cekmeceAcik, setCekmeceAcik] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const s = sozluk(dil)
  const varyant = ustBarVaryanti(aktif)
  const cta = ctaHedefi(varyant.cta, dil)
  // Cekmece'nin efekti buna bağımlı; her render'da taze bir closure geçmek
  // (setCekmeceAcik'in kendisi kararlı olsa da) efekti gereksiz yere söküp
  // yeniden kurar. Gerçek sayfalarda dil/aktif değiştiğinde UstBar yeniden
  // render olacağı için bu artık teorik değil (fix round 1).
  const kapat = useCallback(() => setCekmeceAcik(false), [])

  return (
    <>
      <header className={`${stil.bar} ${varyant.anaVaryantMi ? stil.anaVaryant : stil.icVaryant}`}>
        {varyant.anaVaryantMi && <IlerlemeCubugu />}
        <GeceSeridi dil={dil} />
        <div className={stil.satir}>
          <Link href={yol('ana', dil)} className={stil.marka}>
            <TaneDizilimi buyuk={8} kucuk={5} bosluk={4} />
            <span className={stil.markaAd}>{s.ortak.marka.ad}</span>
          </Link>

          <div className={stil.sagGrup}>
            <nav className={stil.navLinks} aria-label={s.ortak.erisim.anaGezinme}>
              <NavOgeleri nav={varyant.nav} dil={dil} aktif={aktif} />
            </nav>

            <DilAnahtari dil={dil} aktif={aktif} />

            <span className={stil.ctaSarici}>
              <Buton tur="birincil" boy="sm" href={cta.href} hariciMi={cta.hariciMi}>
                {s.ortak.cta.yolTarifiAl}
              </Buton>
            </span>

            <button
              type="button"
              ref={hamburgerRef}
              className={stil.hamburger}
              onClick={() => setCekmeceAcik(true)}
              aria-label={s.ortak.erisim.menuyuAc}
              aria-haspopup="dialog"
              aria-expanded={cekmeceAcik}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <Cekmece dil={dil} aktif={aktif} acik={cekmeceAcik} kapat={kapat} tetikleyiciRef={hamburgerRef} />
    </>
  )
}
