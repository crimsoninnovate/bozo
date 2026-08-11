import { Buton } from '@/components/ui/Buton'
import { WhatsAppIkon } from '@/components/ui/Ikonlar'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import { isletme, TELEFON_YER_TUTUCU } from '@/content/isletme'
import { telefonUrl, whatsappUrl } from '@/lib/site'
import stil from './PaketSeridi.module.css'

type Props = {
  dil: Dil
  /**
   * Şeridin WhatsApp butonunu da basıp basmayacağı. Tasarımdaki iki kullanım
   * yalnız bunda ayrışır: Ana Sayfa üç buton basar (Ana:344-347), Konum sayfası
   * ikisini (Konum:160-162). Varsayılan `false`, yani şeridin taban hali küçük
   * olan; ekleyen taraf açıkça ekler.
   */
  whatsappVarMi?: boolean
}

/**
 * Pumpkin paket şeridi. İki sayfada satır satır aynı kabuk:
 * `Ana Sayfa Alternatif.dc.html:336-348` ve `Konum Sayfasi.dc.html:152-163`.
 *
 * `Bolum` KULLANILMAZ: tasarımda bu blok `id`, `data-yogunluk` ve `data-erit`
 * taşımaz, yani erime animasyonuna ve bead rayına girmez. Düz bir `<div>`.
 *
 * Pumpkin (#E96112) sitede yalnız burada kullanılır; üstündeki kömür metnin
 * kontrastı 5.29:1.
 */
export function PaketSeridi({ dil, whatsappVarMi = false }: Props) {
  const s = sozluk(dil)
  // Paket siparişin hedefi de WhatsApp; numara bilinmediği için ikisi de pasif basar.
  const whatsapp = whatsappUrl(isletme.whatsapp)

  return (
    <div className={stil.serit}>
      <div className={stil.kolon}>
        <TaneDizilimi adet={6} buyuk={12} kucuk={7} bosluk={8} ton="koyu" />
        <h2 className={stil.baslik}>{s.ortak.paket.baslik}</h2>
        <p className={stil.paragraf}>{s.ortak.paket.metin}</p>
      </div>

      <div className={stil.butonlar}>
        <Buton tur="koyu" boy="lg" href={whatsapp} hariciMi>
          {s.ortak.cta.paketSiparis}
        </Buton>
        {whatsappVarMi && (
          <Buton tur="koyuOutline" boy="lg" href={whatsapp} hariciMi>
            <WhatsAppIkon boy={15} />
            {s.ortak.cta.whatsapp}
          </Buton>
        )}
        <Buton tur="koyuOutline" boy="lg" href={telefonUrl(isletme.telefon)}>
          {isletme.telefon ?? TELEFON_YER_TUTUCU}
        </Buton>
      </div>
    </div>
  )
}
