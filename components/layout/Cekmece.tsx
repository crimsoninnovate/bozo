// Kendi 'use client' bildirimi yok: yalnız UstBar (client) tarafından render edilir,
// UstBar'ın sınırından miras alır (bkz. docs/surec/IYILESTIRMELER.md, çekmece kayıtları).
import { useEffect, useRef, useState, type RefObject } from 'react'
import Link from 'next/link'
import { CanliSaat } from '@/components/saat/CanliSaat'
import { DurumAltMetni } from '@/components/saat/DurumAltMetni'
import { DurumCipi } from '@/components/saat/DurumCipi'
import { BolumCipi } from '@/components/ui/BolumCipi'
import { Buton } from '@/components/ui/Buton'
import { InstagramIkon, PinIkon, SaatIkon, TelefonIkon, WhatsAppIkon } from '@/components/ui/Ikonlar'
import { Rozet } from '@/components/ui/Rozet'
import { sozluk, type Dil } from '@/content'
import { isletme } from '@/content/isletme'
import { hareketAzaltilmisMi, useHareketAzaltilmisMi } from '@/lib/hareket'
import { cekmeceLinkleri, ustBarVaryanti, type CekmeceLinki } from '@/lib/kabuk'
import { instagramUrl, telefonUrl, whatsappUrl, yol, yolTarifiUrl, type RotaAnahtari } from '@/lib/site'
import { DilAnahtari } from './DilAnahtari'
import stil from './Cekmece.module.css'

type Props = {
  dil: Dil
  aktif: RotaAnahtari
  acik: boolean
  kapat: () => void
  tetikleyiciRef: RefObject<HTMLButtonElement | null>
}

/** Kapanış solması süresi; azaltılmış harekette sıfır. `.kapaniyor` animasyonuyla aynı. */
const KAPANIS_MS = 150

/**
 * Açıkken body kaydırması kilitlenir, Escape kapatır, odak ilk linke gider ve kapsayıcı
 * içinde döngüye alınır. Kapanışta odak tetikleyiciye döner; sayfa içi çapadan
 * kapandıysa hedef bölüme gider (odak eylemi izler).
 */
function useCekmeceKilidi(
  acik: boolean,
  kapat: () => void,
  kapsayiciRef: RefObject<HTMLDivElement | null>,
  ilkLinkRef: RefObject<HTMLAnchorElement | null>,
  tetikleyiciRef: RefObject<HTMLButtonElement | null>,
  capaHedefiRef: RefObject<string | null>,
) {
  useEffect(() => {
    if (!acik) return
    const kapsayici = kapsayiciRef.current
    if (!kapsayici) return

    const oncekiTasma = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.dataset.cekmece = 'acik'
    ilkLinkRef.current?.focus()

    const tuslar = (olay: KeyboardEvent) => {
      if (olay.key === 'Escape') {
        kapat()
        return
      }
      if (olay.key !== 'Tab') return
      const odaklanabilirler = Array.from(
        kapsayici.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      )
      const ilk = odaklanabilirler[0]
      const son = odaklanabilirler[odaklanabilirler.length - 1]
      if (!ilk || !son) return
      const aktifOge = document.activeElement
      // Odak çekmecenin dışında (ör. metne dokunulduktan sonra body): sekme arkadaki sayfaya sızmasın.
      const disarida = !(aktifOge instanceof Node) || !kapsayici.contains(aktifOge)
      if (disarida || (olay.shiftKey && aktifOge === ilk)) {
        olay.preventDefault()
        ;(olay.shiftKey ? son : ilk).focus()
      } else if (!olay.shiftKey && aktifOge === son) {
        olay.preventDefault()
        ilk.focus()
      }
    }

    document.addEventListener('keydown', tuslar)
    return () => {
      document.removeEventListener('keydown', tuslar)
      document.body.style.overflow = oncekiTasma
      delete document.body.dataset.cekmece
      const hedef = capaHedefiRef.current ? document.querySelector<HTMLElement>(capaHedefiRef.current) : null
      capaHedefiRef.current = null
      if (hedef) hedef.focus({ preventScroll: true })
      else tetikleyiciRef.current?.focus()
    }
  }, [acik, kapat, kapsayiciRef, ilkLinkRef, tetikleyiciRef, capaHedefiRef])
}

/**
 * Kapanış solması: `acik` düşünce çekmece KAPANIS_MS daha durur, sonra kalkar. Açılış
 * aynı render'da (türetilmiş durum): bir kare gecikse kilit efekti kapsayıcıyı bulamıyordu.
 */
function useKapanisSolmasi(acik: boolean): { gorunur: boolean; kapaniyor: boolean } {
  const [gorunur, setGorunur] = useState(acik)
  const hareketAz = useHareketAzaltilmisMi()
  if (acik && !gorunur) setGorunur(true)
  useEffect(() => {
    if (acik) return
    const zamanlayici = window.setTimeout(() => setGorunur(false), hareketAz ? 0 : KAPANIS_MS)
    return () => window.clearTimeout(zamanlayici)
  }, [acik, hareketAz])
  return { gorunur: gorunur || acik, kapaniyor: gorunur && !acik }
}

type SatirProps = {
  link: CekmeceLinki
  sira: number
  dil: Dil
  aktif: RotaAnahtari
  ilkLinkRef?: RefObject<HTMLAnchorElement | null>
}

/** Numara `aria-hidden`; bağlantının adı sayfa adıdır. Bulunulan sayfada çapa aynı belgede kaydırır. */
function GezinmeSatiri({ link, sira, dil, aktif, ilkLinkRef }: SatirProps) {
  const s = sozluk(dil)
  const buradaMi = link.rota === aktif
  return (
    <li className={stil.satir} style={{ '--sira': sira } as React.CSSProperties}>
      <Link
        ref={ilkLinkRef}
        href={yol(link.rota, dil)}
        className={stil.link}
        aria-current={buradaMi ? 'page' : undefined}
      >
        <span className={stil.no} aria-hidden="true">
          {String(sira + 1).padStart(2, '0')}
        </span>
        {s.ortak.nav[link.etiket]}
      </Link>
      {link.altlar.length > 0 && (
        <ul className={stil.altlar}>
          {link.altlar.map((alt) => (
            <li key={alt.hedef}>
              <BolumCipi href={buradaMi ? `#${alt.hedef}` : `${yol(link.rota, dil)}#${alt.hedef}`}>
                {s.ortak.nav[alt.etiket]}
              </BolumCipi>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

/** Alt bilginin iletişim üçlüsüyle aynı boş davranış: hedef yoksa bağlantısız etiket. */
function IletisimOgesi({ href, ikon, etiket }: { href: string | null; ikon: React.ReactNode; etiket: string }) {
  if (!href) {
    return (
      <span className={stil.iletisimLinki} aria-disabled="true">
        {ikon}
        <span>{etiket}</span>
      </span>
    )
  }
  return (
    <a href={href} className={stil.iletisimLinki} rel={href.startsWith('http') ? 'noopener' : undefined}>
      {ikon}
      <span>{etiket}</span>
    </a>
  )
}

function Ayak({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  return (
    <div className={stil.ayak}>
      <div className={stil.iletisim}>
        <IletisimOgesi href={instagramUrl(isletme.instagram)} ikon={<InstagramIkon boy={16} />} etiket={s.ortak.cta.instagram} />
        <IletisimOgesi href={telefonUrl(isletme.telefon)} ikon={<TelefonIkon boy={16} />} etiket={s.ortak.cta.telefon} />
      </div>
      <span>{s.ortak.alkolsuzKisa}</span>
    </div>
  )
}

/** Durum, adres ve saat, iki CTA, iletişim ayağı: alt bilginin dar ekrandaki özeti. */
function AltBlok({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  return (
    <div className={stil.altBlok}>
      <div className={stil.durum}>
        <div className={stil.durumSol}>
          <DurumCipi dil={dil} boy="kucuk" canli={false} kisaKapali />
          <DurumAltMetni dil={dil} />
        </div>
        <CanliSaat boy="cekmece" />
      </div>

      <div className={stil.meta}>
        <a href={yolTarifiUrl()} className={`${stil.metaSatir} ${stil.metaBaglanti}`} rel="noopener">
          <PinIkon boy={16} />
          <span>{s.ortak.satirlar.adresKisa}</span>
        </a>
        <div className={stil.metaSatir}>
          <SaatIkon boy={16} />
          <span>{s.ortak.satirlar.saatlerGunluk}</span>
        </div>
      </div>

      <div className={stil.ctalar}>
        <Buton tur="birincil" boy="md" href={yolTarifiUrl()} hariciMi ikon={<PinIkon boy={17} />}>
          {s.ortak.cta.yolTarifiAl}
        </Buton>
        <Buton tur="ikincil" boy="md" href={whatsappUrl(isletme.whatsapp)} hariciMi ikon={<WhatsAppIkon boy={17} />}>
          {s.ortak.cta.whatsapptanYaz}
        </Buton>
      </div>

      <Ayak dil={dil} />
    </div>
  )
}

/**
 * Tam ekran mobil çekmece. Üst satırı barın kendi satırının ikizidir (ana sayfada rayın
 * 2px payı, gece şeridi varsa o da), gövde kayar. Kapsayıcıdaki tıklama dinleyicisi her
 * bağlantıda kapatır: aynı rotaya giden bağlantı yeniden mount ettirmez.
 */
export function Cekmece({ dil, aktif, acik, kapat, tetikleyiciRef }: Props) {
  const kapsayiciRef = useRef<HTMLDivElement>(null)
  const ilkLinkRef = useRef<HTMLAnchorElement>(null)
  const capaHedefiRef = useRef<string | null>(null)
  const s = sozluk(dil)
  const { gorunur, kapaniyor } = useKapanisSolmasi(acik)
  useCekmeceKilidi(acik, kapat, kapsayiciRef, ilkLinkRef, tetikleyiciRef, capaHedefiRef)

  if (!gorunur) return null

  const baglantiyaTiklandiysaKapat = (olay: React.MouseEvent<HTMLDivElement>) => {
    const baglanti = (olay.target as HTMLElement).closest<HTMLAnchorElement>('a[href]')
    if (!baglanti) return
    const href = baglanti.getAttribute('href') ?? ''
    if (href.startsWith('#')) capaHedefiRef.current = href
    // Bulunulan sayfanın kendi bağlantısı (Menü'de Menü, ana sayfada kilit): başa dön.
    if (!href.startsWith('#') && baglanti.pathname === location.pathname && !baglanti.hash) {
      window.scrollTo({ top: 0, behavior: hareketAzaltilmisMi() ? 'auto' : 'smooth' })
    }
    kapat()
  }

  return (
    <div
      ref={kapsayiciRef}
      className={kapaniyor ? `${stil.kap} ${stil.kapaniyor}` : stil.kap}
      role="dialog"
      aria-modal="true"
      aria-label={s.ortak.erisim.gezinmeCekmecesi}
      inert={kapaniyor || undefined}
      onClick={baglantiyaTiklandiysaKapat}
    >
      {ustBarVaryanti(aktif).anaVaryantMi && <div className={stil.rayPayi} aria-hidden="true" />}
      <div className={stil.ust}>
        <Rozet dil={dil} boy="cekmece" />
        <div className={stil.sagGrup}>
          <DilAnahtari dil={dil} aktif={aktif} />
          <button type="button" className={stil.kapat} onClick={kapat} aria-label={s.ortak.erisim.menuyuKapat}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={stil.govde}>
        <nav aria-label={s.ortak.erisim.mobilGezinme}>
          <ul className={stil.linkler}>
            {cekmeceLinkleri().map((link, i) => (
              <GezinmeSatiri
                key={link.rota}
                link={link}
                sira={i}
                dil={dil}
                aktif={aktif}
                ilkLinkRef={i === 0 ? ilkLinkRef : undefined}
              />
            ))}
          </ul>
        </nav>
        <AltBlok dil={dil} />
      </div>
    </div>
  )
}
