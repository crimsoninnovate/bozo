'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { Buton } from '@/components/ui/Buton'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import { yol, yolTarifiUrl, type RotaAnahtari } from '@/lib/site'
import { Cekmece } from './Cekmece'
import { DilAnahtari } from './DilAnahtari'
import { GeceSeridi } from './GeceSeridi'
import { IlerlemeCubugu } from './IlerlemeCubugu'
import stil from './UstBar.module.css'

type Props = {
  dil: Dil
  aktif: RotaAnahtari
  /** Yalnız ana sayfada true: ilerleme rayını ve "Gece" bölüm bağlantısını gösterir. */
  ilerleme?: boolean
}

const IC_SAYFA_LINKLERI: { anahtar: RotaAnahtari; anahtarSozluk: 'menu' | 'hikaye' | 'konum' }[] = [
  { anahtar: 'menu', anahtarSozluk: 'menu' },
  { anahtar: 'hikaye', anahtarSozluk: 'hikaye' },
  { anahtar: 'konum', anahtarSozluk: 'konum' },
]

/**
 * Sabit üst bar: ilerleme rayı (yalnız ana sayfa), gece şeridi, marka kilidi,
 * nav linkleri, dil anahtarı, birincil CTA. 780px altında nav ve CTA gizlenir,
 * hamburger görünür ve tam ekran Cekmece'yi açar.
 */
export function UstBar({ dil, aktif, ilerleme = false }: Props) {
  const [cekmeceAcik, setCekmeceAcik] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const s = sozluk(dil)
  // Cekmece'nin efekti buna bağımlı; her render'da taze bir closure geçmek
  // (setCekmeceAcik'in kendisi kararlı olsa da) efekti gereksiz yere söküp
  // yeniden kurar. Gerçek sayfalarda dil/aktif değiştiğinde UstBar yeniden
  // render olacağı için bu artık teorik değil (fix round 1).
  const kapat = useCallback(() => setCekmeceAcik(false), [])

  return (
    <>
      <header className={`${stil.bar} ${ilerleme ? stil.anaVaryant : stil.icVaryant}`}>
        {ilerleme && <IlerlemeCubugu />}
        <GeceSeridi dil={dil} />
        <div className={stil.satir}>
          <Link href={yol('ana', dil)} className={stil.marka}>
            <TaneDizilimi buyuk={8} kucuk={5} bosluk={4} />
            <span className={stil.markaAd}>{s.ortak.marka.ad}</span>
          </Link>

          <div className={stil.sagGrup}>
            <nav className={stil.navLinks} aria-label={s.ortak.erisim.anaGezinme}>
              {IC_SAYFA_LINKLERI.map(({ anahtar, anahtarSozluk }, i) => (
                <span key={anahtar} className={stil.navOgesi}>
                  {anahtar === aktif ? (
                    <span className={stil.aktifLink} aria-current="page">
                      {s.ortak.nav[anahtarSozluk]}
                    </span>
                  ) : (
                    <Link href={yol(anahtar, dil)} className={stil.link}>
                      {s.ortak.nav[anahtarSozluk]}
                    </Link>
                  )}
                  {ilerleme && i === 0 && (
                    <a href="#gece" className={stil.link}>
                      {s.ortak.nav.gece}
                    </a>
                  )}
                </span>
              ))}
            </nav>

            <DilAnahtari dil={dil} aktif={aktif} />

            <span className={stil.ctaSarici}>
              <Buton tur="birincil" boy="sm" href={yolTarifiUrl()} hariciMi>
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
