import Link from 'next/link'
import { sozluk, type Dil } from '@/content'
import { isletme, TELEFON_YER_TUTUCU } from '@/content/isletme'
import { PinIkon, TelefonIkon, WhatsAppIkon, InstagramIkon } from '@/components/ui/Ikonlar'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { telefonUrl, whatsappUrl, yol, yolTarifiUrl } from '@/lib/site'
import stil from './AltBilgi.module.css'

type Props = { dil: Dil }

/**
 * Ana Sayfa Alternatif.dc.html Footer bölümü: dört kolon (marka, adres,
 * saatler, iletişim) + telif şeridi. Telefon, WhatsApp ve Instagram null
 * iken satır görünür ama placeholder basılır, href üretilmez.
 */
export function AltBilgi({ dil }: Props) {
  const s = sozluk(dil)
  const telefon = telefonUrl(isletme.telefon)
  const whatsapp = whatsappUrl(isletme.whatsapp)
  const instagram = isletme.instagram ? `https://instagram.com/${isletme.instagram}` : null

  return (
    <footer className={stil.altbilgi}>
      <div className={stil.kolonlar}>
        <div className={stil.kolon}>
          <div className={stil.markaUst}>
            <TaneDizilimi buyuk={9} kucuk={5} bosluk={6} ton="krem75" />
            <span className={stil.markaAd}>{s.ortak.marka.ad}</span>
          </div>
          <p className={stil.tanim}>{s.ortak.footer.tanim}</p>
          {/* Marka gereği: İngilizce sayfalarda Bozo'nun bir insan adı olduğunu açıklar. */}
          <p className={stil.isimNotu}>{s.ortak.footer.isimNotu}</p>
        </div>

        <div className={stil.kolon}>
          <div className={stil.baslik}>{s.ortak.footer.adresBaslik}</div>
          <div className={stil.adresSatiri}>
            <PinIkon boy={15} />
            <div className={stil.adresMetin}>
              <div>{isletme.cadde}</div>
              {isletme.binaNo && <div>{isletme.binaNo}</div>}
              <div>{s.ortak.satirlar.adresSehirUlke}</div>
            </div>
          </div>
          <a href={yolTarifiUrl()} className={stil.yolTarifi} rel="noopener">
            <span>{s.ortak.cta.yolTarifiAl}</span>
            <span className={stil.yolTarifiCizgi} aria-hidden="true" />
          </a>
        </div>

        <div className={stil.kolon}>
          <div className={stil.baslik}>{s.ortak.footer.saatlerBaslik}</div>
          <div className={stil.satirTabular}>{s.ortak.satirlar.saatlerGunluk}</div>
          <div className={stil.satirTabular}>{s.ortak.satirlar.kapaliAralik}</div>
          <div className={stil.satir}>{s.ortak.alkolsuzKisa}</div>
        </div>

        <div className={stil.kolon}>
          <div className={stil.baslik}>{s.ortak.footer.iletisimBaslik}</div>

          {telefon ? (
            <a href={telefon} className={stil.iletisimSatiri}>
              <TelefonIkon boy={15} />
              <span className={stil.tabular}>{isletme.telefon}</span>
            </a>
          ) : (
            <span className={`${stil.iletisimSatiri} ${stil.pasif}`} aria-disabled="true">
              <TelefonIkon boy={15} />
              <span className={stil.tabular}>{TELEFON_YER_TUTUCU}</span>
            </span>
          )}

          {whatsapp ? (
            <a href={whatsapp} className={stil.iletisimSatiri} rel="noopener">
              <WhatsAppIkon boy={15} />
              <span>{s.ortak.cta.whatsapp}</span>
            </a>
          ) : (
            <span className={`${stil.iletisimSatiri} ${stil.pasif}`} aria-disabled="true">
              <WhatsAppIkon boy={15} />
              <span>{s.ortak.cta.whatsapp}</span>
            </span>
          )}

          {instagram ? (
            <a href={instagram} className={stil.iletisimSatiri} rel="noopener">
              <InstagramIkon boy={15} />
              <span>{s.ortak.cta.instagram}</span>
            </a>
          ) : (
            <span className={`${stil.iletisimSatiri} ${stil.pasif}`} aria-disabled="true">
              <InstagramIkon boy={15} />
              <span>{s.ortak.cta.instagram}</span>
            </span>
          )}
        </div>
      </div>

      <div className={stil.telifSeridi}>
        <div className={stil.telifMetin}>
          {s.ortak.telif} · {s.ortak.satirlar.adresSehirUlke} ·{' '}
          {/*
           * Tasarımın hiçbir sayfasında Gizlilik'e bağlantı yok, kopyalanacak bir
           * yerleşim yok; telif şeridine modest bir metin bağlantısı eklendi.
           * `footer.sayfalarBaslik` bilerek kullanılmadı: ayrı bir "Sayfalar" kolonu
           * açmak, tek bir yetim anahtara sayfa uydurmak olurdu (fix round 1).
           */}
          <Link href={yol('gizlilik', dil)} className={stil.gizlilikLink}>
            {s.ortak.nav.gizlilik}
          </Link>
        </div>
        <span className={stil.telifRayi} aria-hidden="true">
          <TaneDizilimi buyuk={7} kucuk={4} bosluk={4} />
        </span>
      </div>
    </footer>
  )
}
