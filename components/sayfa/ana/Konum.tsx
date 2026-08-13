import { SaatTablosu } from '@/components/saat/SaatTablosu'
import { HaritaPlakasi } from '@/components/sayfa/HaritaPlakasi'
import { Bolum } from '@/components/ui/Bolum'
import { Buton } from '@/components/ui/Buton'
import { CamPanel } from '@/components/ui/CamPanel'
import { TelefonIkon } from '@/components/ui/Ikonlar'
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

        {/* Adres satırı KALDIRILDI (sahibi, 13 Ağustos 2026): hemen üstündeki
            H2 zaten "Naci Talat Caddesi, Girne" diyor, satır aynı caddeyi ve
            aynı şehri 60px altında tekrarlıyordu. Kapı numarası kaybolmadı,
            hero meta satırında ve footer'da duruyor. */}

        <SaatTablosu dil={dil} not={s.ana.konum.saatNotu} />

        {/* Tek eylem satırı: ara, yol tarifi, WhatsApp. Üç `lg` buton panelin
            genişliğine sığmayıp ikinci satıra taşıyor ve WhatsApp tek başına
            kalıyordu; `md` ile üçü tek satırda (UYGULAMA-NOTLARI 5).
            13 Ağustos 2026'da ikonlar 43px ekleyip aynı sarmayı geri getirdi;
            çözüm yine aynı, bir boy daha aşağı. `sm`in 40.5px'lik gövdesini
            `Buton`un `min-height:44px`i dokunma hedefine taşır. */}
        <div className={stil.butonlar}>
          <Buton
            tur="birincil"
            boy="sm"
            href={telefonUrl(isletme.telefon)}
            ikon={<TelefonIkon boy={17} />}
          >
            {isletme.telefon ?? TELEFON_YER_TUTUCU}
          </Buton>
          {/* İkincillerde ikon YOK, bilerek. Bu satır üç butonu 520px'e
              sığdırmak zorunda ve üç ikon 69px götürüyor: İngilizce ("Get
              Directions") ikonlarla 540px istiyor, sarıyor. Ayrıca ikonun işi
              etiketin söylemediğini söylemek; ham telefon numarası söylemiyor,
              "Yol Tarifi Al" ve "WhatsApp" söylüyor. Ölçüldü: bu haliyle TR
              474px, EN 494px, ikisinde de pay var. */}
          <Buton tur="ikincil" boy="sm" href={yolTarifiUrl()} hariciMi>
            {s.ortak.cta.yolTarifiAl}
          </Buton>
          <Buton tur="ikincil" boy="sm" href={whatsappUrl(isletme.whatsapp)} hariciMi>
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
