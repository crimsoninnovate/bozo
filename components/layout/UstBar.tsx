'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Buton } from '@/components/ui/Buton'
import { CapaBaglantisi } from '@/components/ui/CapaBaglantisi'
import { PinIkon } from '@/components/ui/Ikonlar'
import { Rozet } from '@/components/ui/Rozet'
import { sozluk, type Dil } from '@/content'
import { ustBarVaryanti, type NavOgesi, type UstBarCta } from '@/lib/kabuk'
import { yol, yolTarifiUrl, type SayfaAnahtari } from '@/lib/site'
import { BarDurumu } from './BarDurumu'
import { Cekmece } from './Cekmece'
import { DilAnahtari } from './DilAnahtari'
import { IlerlemeCubugu } from './IlerlemeCubugu'
import stil from './UstBar.module.css'

type Props = {
  dil: Dil
  aktif: SayfaAnahtari
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

/**
 * Barın daralması (SPEC.md §4): eşik 120px. Dinleyici passive ve rAF ile
 * kısılıyor; ham `scroll` her karede state yazmaya kalkıyordu.
 */
function useDaralmis(esik = 120): boolean {
  const [daralmis, setDaralmis] = useState(false)
  useEffect(() => {
    let bekleyen = false
    const oku = () => {
      bekleyen = false
      setDaralmis(window.scrollY > esik)
    }
    const dinle = () => {
      if (bekleyen) return
      bekleyen = true
      requestAnimationFrame(oku)
    }
    oku()
    window.addEventListener('scroll', dinle, { passive: true })
    return () => window.removeEventListener('scroll', dinle)
  }, [esik])
  return daralmis
}

/** Rozet ortada durduğu için nav ikiye bölünür; tek sayıda öğede fazlalık sola gider. */
function navBol(nav: NavOgesi[]): [NavOgesi[], NavOgesi[]] {
  const orta = Math.ceil(nav.length / 2)
  return [nav.slice(0, orta), nav.slice(orta)]
}

function NavOgeleri({ nav, dil, aktif }: { nav: NavOgesi[]; dil: Dil; aktif: SayfaAnahtari }) {
  const s = sozluk(dil)
  return (
    <>
      {nav.map((oge) => {
        const etiket = s.ortak.nav[oge.etiket]
        if (oge.tur === 'capa') {
          return (
            <CapaBaglantisi key={`#${oge.hedef}`} href={`#${oge.hedef}`} className={stil.link}>
              {etiket}
            </CapaBaglantisi>
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
 * varyant tablosu `lib/kabuk.ts` içinde durur (kaynak satırları orada).
 *
 * 20 Ağustos 2026: marka rozete geçti, bar ortalanmış üç kolona döndü ve rozet
 * satırın altına sarkıyor (sahibinin kararı). Bar ölçüleri değişmedi: sarkma
 * `height:0` bir sarıcıyla yapılıyor. Bkz. Rozet.tsx.
 */
export function UstBar({ dil, aktif }: Props) {
  const [cekmeceAcik, setCekmeceAcik] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const s = sozluk(dil)
  const varyant = ustBarVaryanti(aktif)
  const cta = ctaHedefi(varyant.cta, dil)
  const [solNav, sagNav] = navBol(varyant.nav)
  const daralmis = useDaralmis()
  // Perde ayrı ve ÇOK alçak eşikte: daralma bir jest (120px), perde bir
  // okunurluk önlemi ve altından ilk piksel geçtiği anda gerekiyor.
  const perdeli = useDaralmis(4)
  // Cekmece'nin efekti buna bağımlı; her render'da taze bir closure geçmek
  // (setCekmeceAcik'in kendisi kararlı olsa da) efekti gereksiz yere söküp
  // yeniden kurar. Gerçek sayfalarda dil/aktif değiştiğinde UstBar yeniden
  // render olacağı için bu artık teorik değil (fix round 1).
  const kapat = useCallback(() => setCekmeceAcik(false), [])

  return (
    <>
      <header
        className={`${stil.bar} ${varyant.anaVaryantMi ? stil.anaVaryant : stil.icVaryant}${
          perdeli ? ` ${stil.perdeli}` : ''
        }${daralmis ? ` ${stil.daralmis}` : ''}`}
      >
        {varyant.anaVaryantMi && <IlerlemeCubugu />}
        {/* Tek landmark: dil anahtarı, iki nav yarısı ve CTA aynı bölgeye ait.
            İki ayrı <nav> aynı adı taşıyamazdı (icerik.test.ts). */}
        <nav className={stil.satir} aria-label={s.ortak.erisim.anaGezinme}>
          <div className={stil.sol}>
            <DilAnahtari dil={dil} aktif={aktif} />
            <span className={stil.navLinks}>
              <NavOgeleri nav={solNav} dil={dil} aktif={aktif} />
            </span>
          </div>

          <span className={stil.markaOrta}>
            <Rozet dil={dil} boy={daralmis ? 'daralmis' : 'bar'} />
          </span>

          <div className={stil.sag}>
            <span className={stil.navLinks}>
              <NavOgeleri nav={sagNav} dil={dil} aktif={aktif} />
            </span>

            {/* Daralınca canlı durum girer: hero'daki saat artık ekranda değil. */}
            {daralmis && (
              <span className={stil.durumSarici}>
                <BarDurumu dil={dil} />
              </span>
            )}

            {/*
              Normalde dış çizgili: sayfadaki tek birincil eylem hero'da kalsın.
              Daralınca solid bordoya döner, çünkü hero'nun butonu kaydırılıp geçildi.
            */}
            <span className={stil.ctaSarici}>
              <Buton
                tur={daralmis ? 'birincil' : 'ikincil'}
                boy="sm"
                href={cta.href}
                hariciMi={cta.hariciMi}
                ikon={<PinIkon boy={13} />}
              >
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
        </nav>
      </header>

      <Cekmece dil={dil} aktif={aktif} acik={cekmeceAcik} kapat={kapat} tetikleyiciRef={hamburgerRef} />
    </>
  )
}
