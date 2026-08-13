import { SaatTablosu } from '@/components/saat/SaatTablosu'
import { HaritaPlakasi } from '@/components/sayfa/HaritaPlakasi'
import { Bolum } from '@/components/ui/Bolum'
import { Buton } from '@/components/ui/Buton'
import { CamPanel } from '@/components/ui/CamPanel'
import { PinIkon, TelefonIkon, WhatsAppIkon } from '@/components/ui/Ikonlar'
import { sozluk, type Dil } from '@/content'
import { isletme, TELEFON_YER_TUTUCU } from '@/content/isletme'
import { telefonUrl, whatsappUrl, yolTarifiUrl } from '@/lib/site'
import stil from './Konum.module.css'

type Props = { dil: Dil }

/** Ana sayfanın konum bölümü. Ana Sayfa Alternatif.dc.html:296-334 */
export function Konum({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <Bolum id="konum" yogunluk={0.3} className={stil.bolum} eritClassName={stil.erit}>
      <CamPanel opaklik={0.74} dolgu="orta" className={stil.panel}>
        <h2 className={stil.baslik}>{s.ana.konum.baslik}</h2>

        {/* Ayırıcı nokta JSX'te, TelifSeridi.tsx:25 ile aynı desen: iki ayrı
            sözlük değerinin arasındaki noktalama sözlüğe girmez. */}
        <p className={stil.adres}>
          <PinIkon boy={15} />
          <span className={stil.adresMetin}>
            {s.ortak.satirlar.adresTamSatir} · {s.ortak.satirlar.adresSehirUlke}
          </span>
        </p>

        <SaatTablosu dil={dil} not={s.ana.konum.saatNotu} />

        {/* Tek eylem satırı: ara, yol tarifi, WhatsApp. Üç `lg` buton panelin
            genişliğine sığmayıp ikinci satıra taşıyor ve WhatsApp tek başına
            kalıyordu; `md` ile üçü tek satırda (UYGULAMA-NOTLARI 5). */}
        <div className={stil.butonlar}>
          <Buton
            tur="birincil"
            boy="md"
            href={telefonUrl(isletme.telefon)}
            ikon={<TelefonIkon boy={17} />}
          >
            {isletme.telefon ?? TELEFON_YER_TUTUCU}
          </Buton>
          <Buton
            tur="ikincil"
            boy="md"
            href={yolTarifiUrl()}
            hariciMi
            ikon={<PinIkon boy={17} />}
          >
            {s.ortak.cta.yolTarifiAl}
          </Buton>
          <Buton
            tur="ikincil"
            boy="md"
            href={whatsappUrl(isletme.whatsapp)}
            hariciMi
            ikon={<WhatsAppIkon boy={17} />}
          >
            {s.ortak.cta.whatsapp}
          </Buton>
        </div>
      </CamPanel>

      <HaritaPlakasi
        className={stil.harita}
        isletmeAdi={s.ortak.marka.ad}
        sokak={s.ana.konum.haritaSokak}
      />
    </Bolum>
  )
}
