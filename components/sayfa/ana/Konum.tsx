import { SaatTablosu } from '@/components/saat/SaatTablosu'
import { HaritaPlakasi } from '@/components/sayfa/HaritaPlakasi'
import { Bolum } from '@/components/ui/Bolum'
import { Buton } from '@/components/ui/Buton'
import { CamPanel } from '@/components/ui/CamPanel'
import { Cip } from '@/components/ui/Cip'
import { PinIkon } from '@/components/ui/Ikonlar'
import { sozluk, type Dil } from '@/content'
import { isletme, TELEFON_YER_TUTUCU } from '@/content/isletme'
import { telefonUrl, whatsappUrl, yolTarifiUrl } from '@/lib/site'
import stil from './Konum.module.css'

type Props = { dil: Dil }

/** Ana sayfanın konum bölümü. Ana Sayfa Alternatif.dc.html:296-334 */
export function Konum({ dil }: Props) {
  const s = sozluk(dil)
  const komsular = s.ana.konum.komsular

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

        {/* Tasarımın üçüncü çipi "Girne Macro Market, 80 m" der; mesafe
            doğrulanmadığı için sözlükte yok (content/tr/ana.ts:59). */}
        <div className={stil.komsular}>
          <Cip tur="komsuluk">{komsular.soliBet}</Cip>
          <Cip tur="komsuluk">{komsular.hititBet}</Cip>
          <Cip tur="komsuluk">{komsular.macroMarket}</Cip>
        </div>

        <div className={stil.butonlar}>
          <Buton tur="birincil" boy="lg" href={yolTarifiUrl()} hariciMi>
            {s.ortak.cta.yolTarifiAl}
          </Buton>
          <Buton tur="ikincil" boy="lg" href={telefonUrl(isletme.telefon)}>
            {isletme.telefon ?? TELEFON_YER_TUTUCU}
          </Buton>
          <Buton tur="ikincil" boy="lg" href={whatsappUrl(isletme.whatsapp)} hariciMi>
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
