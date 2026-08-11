import { SaatTablosu } from '@/components/saat/SaatTablosu'
import { CamPanel } from '@/components/ui/CamPanel'
import { InstagramIkon, TelefonIkon, WhatsAppIkon } from '@/components/ui/Ikonlar'
import { sozluk, type Dil } from '@/content'
import { isletme, TELEFON_YER_TUTUCU } from '@/content/isletme'
import { telefonUrl, whatsappUrl } from '@/lib/site'
import { AlkolsuzRozeti } from './AlkolsuzRozeti'
import { IletisimSatiri } from './IletisimSatiri'
import stil from './SaatlerVeIletisim.module.css'

type Props = { dil: Dil }

/**
 * Saatler ve İletişim kartları. Konum Sayfasi.dc.html:105-150
 *
 * İki kart `CamPanel` ile kurulur, `bulanik={false}`: tasarımda `backdrop-filter`
 * bu dosyada hiç geçmiyor (yalnız Ana Sayfa ve Hikaye panellerinde var).
 *
 * Kart başlıkları düz `<h2>`: `BolumBasligi` alt çizgi basar ve ölçeği farklı
 * (`orta` = clamp(30px,3.6vw,48px)), tasarımda ise çizgi yok ve ölçü
 * clamp(26px,2.8vw,38px) = `--ol-kart-baslik`.
 *
 * Not paragrafı `SaatTablosu`'nun içinde: kartın 22px'lik kolon boşluğu tablo ile
 * notun arasına girmemeli, ikisi tasarımda tek sarmalayıcıda ve aralarında boşluk
 * yok (Konum:108-118, 02-konum.jpg).
 *
 * E-posta satırı YOK: tasarımda üç satır var ve `isletme.eposta` null.
 */
export function SaatlerVeIletisim({ dil }: Props) {
  const s = sozluk(dil)
  const instagram = isletme.instagram ? `https://instagram.com/${isletme.instagram}` : null

  return (
    <section className={stil.bolum}>
      <CamPanel opaklik={0.74} dolgu="dar" bulanik={false} className={stil.kart}>
        <h2 className={stil.baslik}>{s.konum.saatler.baslik}</h2>
        <SaatTablosu dil={dil} varyant="konum" not={s.konum.saatler.not} />
        <AlkolsuzRozeti metin={s.ortak.alkolsuzKisa} />
      </CamPanel>

      <CamPanel opaklik={0.74} dolgu="dar" bulanik={false} className={stil.kart}>
        <h2 className={stil.baslik}>{s.konum.iletisim.baslik}</h2>
        <div className={stil.satirlar}>
          <IletisimSatiri
            ikon={<TelefonIkon boy={17} />}
            etiket={s.ortak.cta.telefon}
            alt={isletme.telefon ?? TELEFON_YER_TUTUCU}
            tur="deger"
            href={telefonUrl(isletme.telefon)}
          />
          <IletisimSatiri
            ikon={<WhatsAppIkon boy={17} />}
            etiket={s.ortak.cta.whatsapp}
            alt={s.konum.iletisim.whatsappAlt}
            tur="aciklama"
            href={whatsappUrl(isletme.whatsapp)}
            hariciMi
          />
          <IletisimSatiri
            ikon={<InstagramIkon boy={17} />}
            etiket={s.ortak.cta.instagram}
            alt={s.konum.iletisim.instagramAlt}
            tur="aciklama"
            href={instagram}
            hariciMi
          />
        </div>
      </CamPanel>
    </section>
  )
}
