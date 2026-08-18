// Kendi 'use client' bildirimi yok: yalnız UstBar (client) tarafından render edilir,
// UstBar'ın sınırından miras alır. Ayrı bir bildirim, sunucu bileşeninden serileştirilemeyen
// `kapat` fonksiyon prop'unu doğrudan bu dosyaya geçiyormuş gibi göstererek sahte bir
// sınır uyarısı üretiyordu (bkz. task-6-report.md).
import { useEffect, useRef, type RefObject } from 'react'
import Link from 'next/link'
import { CanliSaat } from '@/components/saat/CanliSaat'
import { DurumAltMetni } from '@/components/saat/DurumAltMetni'
import { DurumCipi } from '@/components/saat/DurumCipi'
import { Buton } from '@/components/ui/Buton'
import { CapaBaglantisi } from '@/components/ui/CapaBaglantisi'
import { InstagramIkon, PinIkon, SaatIkon, TelefonIkon, WhatsAppIkon } from '@/components/ui/Ikonlar'
import { MarkaKilidi } from '@/components/ui/MarkaKilidi'
import { sozluk, type Dil } from '@/content'
import { isletme } from '@/content/isletme'
import { cekmeceLinkleri, type CekmeceLinki } from '@/lib/kabuk'
import { telefonUrl, whatsappUrl, yol, yolTarifiUrl, type RotaAnahtari } from '@/lib/site'
import { DilAnahtari } from './DilAnahtari'
import stil from './Cekmece.module.css'

type Props = {
  dil: Dil
  aktif: RotaAnahtari
  acik: boolean
  kapat: () => void
  tetikleyiciRef: RefObject<HTMLButtonElement | null>
}

/**
 * Açıkken body kaydırması kilitlenir, Escape kapatır, odak ilk linke gider ve
 * kapsayıcı içinde döngüye alınır, kapanışta odak tetikleyiciye (hamburger) döner.
 */
function useCekmeceKilidi(
  acik: boolean,
  kapat: () => void,
  kapsayiciRef: RefObject<HTMLDivElement | null>,
  ilkLinkRef: RefObject<HTMLAnchorElement | null>,
  tetikleyiciRef: RefObject<HTMLButtonElement | null>,
) {
  useEffect(() => {
    if (!acik) return
    const kapsayici = kapsayiciRef.current
    if (!kapsayici) return

    const oncekiTasma = document.body.style.overflow
    document.body.style.overflow = 'hidden'
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
      if (olay.shiftKey && document.activeElement === ilk) {
        olay.preventDefault()
        son.focus()
      } else if (!olay.shiftKey && document.activeElement === son) {
        olay.preventDefault()
        ilk.focus()
      }
    }

    document.addEventListener('keydown', tuslar)
    return () => {
      document.removeEventListener('keydown', tuslar)
      document.body.style.overflow = oncekiTasma
      tetikleyiciRef.current?.focus()
    }
  }, [acik, kapat, kapsayiciRef, ilkLinkRef, tetikleyiciRef])
}

type SatirProps = {
  link: CekmeceLinki
  sira: number
  dil: Dil
  aktif: RotaAnahtari
  ilkLinkRef?: RefObject<HTMLAnchorElement | null>
}

/**
 * Bir gezinme satırı: sıra numarası + sayfa adı, altında o sayfanın bölüm çapaları.
 * Bulunulan sayfada çapa aynı belgede kaydırır (CapaBaglantisi), başka sayfadan
 * rota + hash olarak gider. Numara ekran okuyucuya okunmaz, bağlantının adı sayfa adıdır.
 */
function GezinmeSatiri({ link, sira, dil, aktif, ilkLinkRef }: SatirProps) {
  const s = sozluk(dil)
  const buradaMi = link.rota === aktif
  return (
    <div className={stil.satir} style={{ '--sira': sira } as React.CSSProperties}>
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
        <div className={stil.altlar}>
          {link.altlar.map((alt) =>
            buradaMi ? (
              <CapaBaglantisi key={alt.hedef} href={`#${alt.hedef}`} className={stil.alt}>
                {s.ortak.nav[alt.etiket]}
              </CapaBaglantisi>
            ) : (
              <Link key={alt.hedef} href={`${yol(link.rota, dil)}#${alt.hedef}`} className={stil.alt}>
                {s.ortak.nav[alt.etiket]}
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  )
}

/** Durum, adres ve saat, iki CTA, iletişim ayağı: alt bilginin dar ekrandaki özeti. */
function AltBlok({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  const whatsapp = whatsappUrl(isletme.whatsapp)
  const telefon = telefonUrl(isletme.telefon)
  const instagram = isletme.instagram ? `https://instagram.com/${isletme.instagram}` : null
  return (
    <div className={stil.altBlok}>
      <div className={stil.durum}>
        <div className={stil.durumSol}>
          <DurumCipi dil={dil} boy="kucuk" />
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
        <Buton tur="ikincil" boy="md" href={whatsapp} hariciMi ikon={<WhatsAppIkon boy={17} />}>
          {s.ortak.cta.whatsapptanYaz}
        </Buton>
      </div>

      <div className={stil.ayak}>
        <div className={stil.iletisim}>
          {instagram && (
            <a href={instagram} className={stil.iletisimLinki} rel="noopener">
              <InstagramIkon boy={16} />
              <span>{s.ortak.cta.instagram}</span>
            </a>
          )}
          {telefon && (
            <a href={telefon} className={stil.iletisimLinki}>
              <TelefonIkon boy={16} />
              <span>{s.ortak.cta.telefon}</span>
            </a>
          )}
        </div>
        <span className={stil.not}>{s.ortak.alkolsuzKisa}</span>
      </div>
    </div>
  )
}

/**
 * Tam ekran mobil çekmece. Üst satırı barın kendi satırıdır (kilit, dil, kapat),
 * gövde kayar. Link listesi ve alt çapalar `lib/kabuk.ts`'ten gelir, burada yazılmaz.
 * Kapsayıcıdaki tıklama dinleyicisi her bağlantıda çekmeceyi kapatır: aynı rotaya
 * giden bağlantı (kilit, Menü'de Menü, sayfa içi çapa) yeniden mount ettirmez.
 */
export function Cekmece({ dil, aktif, acik, kapat, tetikleyiciRef }: Props) {
  const kapsayiciRef = useRef<HTMLDivElement>(null)
  const ilkLinkRef = useRef<HTMLAnchorElement>(null)
  const s = sozluk(dil)
  useCekmeceKilidi(acik, kapat, kapsayiciRef, ilkLinkRef, tetikleyiciRef)

  if (!acik) return null

  const baglantiyaTiklandiysaKapat = (olay: React.MouseEvent<HTMLDivElement>) => {
    if ((olay.target as HTMLElement).closest('a[href]')) kapat()
  }

  return (
    <div
      ref={kapsayiciRef}
      className={stil.kap}
      role="dialog"
      aria-modal="true"
      aria-label={s.ortak.erisim.gezinmeCekmecesi}
      onClick={baglantiyaTiklandiysaKapat}
    >
      <div className={stil.ust}>
        <MarkaKilidi dil={dil} />
        <div className={stil.sagGrup}>
          <DilAnahtari dil={dil} aktif={aktif} />
          <button type="button" className={stil.kapat} onClick={kapat} aria-label={s.ortak.erisim.menuyuKapat}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={stil.govde}>
        <nav className={stil.linkler} aria-label={s.ortak.erisim.mobilGezinme}>
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
        </nav>
        <AltBlok dil={dil} />
      </div>
    </div>
  )
}
