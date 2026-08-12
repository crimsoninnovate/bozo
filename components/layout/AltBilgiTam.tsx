import { sozluk, type Dil } from '@/content'
import { isletme, TELEFON_YER_TUTUCU } from '@/content/isletme'
import { PinIkon, TelefonIkon, WhatsAppIkon, InstagramIkon } from '@/components/ui/Ikonlar'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { telefonUrl, whatsappUrl, yolTarifiUrl, type RotaAnahtari } from '@/lib/site'
import { TelifSeridi } from './TelifSeridi'
import stil from './AltBilgi.module.css'

type Props = { dil: Dil; aktif: RotaAnahtari }

/**
 * `Ana Sayfa Alternatif.dc.html:351-386`: dört kolon (marka, adres, saatler,
 * iletişim) + telif şeridi. Ana sayfanın ve tasarımda karşılığı olmayan
 * Gizlilik rotasının footer'ı. Telefon, WhatsApp ve Instagram null iken satır
 * görünür ama placeholder basılır, href üretilmez.
 */
export function AltBilgiTam({ dil, aktif }: Props) {
  const s = sozluk(dil)
  const telefon = telefonUrl(isletme.telefon)
  const whatsapp = whatsappUrl(isletme.whatsapp)
  const instagram = isletme.instagram ? `https://instagram.com/${isletme.instagram}` : null

  return (
    <footer className={`${stil.zemin} ${stil.tam}`}>
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
            {/* Görünen adres sözlükten gelir (EN: "Naci Talat Street"); isletme.cadde
                dil-nötr yapısal veridir ve yalnız harita/JSON-LD bağlantılarında kullanılır.
                binaNo koşulu duruyor: bilinmeyen bina numarası satır basmaz. */}
            <div className={stil.adresMetin}>
              <div>
                {s.ortak.satirlar.adresCadde}
                {isletme.binaNo ? ` ${s.ortak.satirlar.adresBina}` : ''}
              </div>
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

      <TelifSeridi dil={dil} aktif={aktif} />
    </footer>
  )
}
