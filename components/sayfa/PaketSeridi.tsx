import { Buton } from '@/components/ui/Buton'
import { Cip } from '@/components/ui/Cip'
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
 * Pumpkin paket şeridi. Kabuk `Ana Sayfa Alternatif.dc.html:336-348` ve
 * `Konum Sayfasi.dc.html:152-163`'ten; iki kolonlu düzen bizim.
 *
 * Tasarımın tek kolonu şeridin sağ yarısını boş bırakıyordu ve paragraf açık bir
 * hizmeti anlatıyor gibi okunuyordu: paket servis henüz başlamadı. Sağ kolon o
 * boşluğu durum kartıyla dolduruyor ve paragrafın zamanını okuyucu için kuruyor.
 *
 * `Bolum` KULLANILMAZ: tasarımda bu blok `id`, `data-yogunluk` ve `data-erit`
 * taşımaz, yani erime animasyonuna ve bead rayına girmez. Düz bir `<div>`.
 *
 * Pumpkin (#E96112) sitede yalnız burada kullanılır; üstündeki kömür metnin
 * kontrastı 5.29:1.
 */
export function PaketSeridi({ dil, whatsappVarMi = false }: Props) {
  const s = sozluk(dil)
  const whatsapp = whatsappUrl(isletme.whatsapp)
  const telefon = telefonUrl(isletme.telefon)

  return (
    <div className={stil.serit}>
      <div className={stil.kolon}>
        <TaneDizilimi adet={6} buyuk={12} kucuk={7} bosluk={8} ton="koyu" />
        <h2 className={stil.baslik}>{s.ortak.paket.baslik}</h2>
        <p className={stil.paragraf}>{s.ortak.paket.metin}</p>
      </div>

      <div className={stil.durumKarti}>
        <div className={stil.durumUst}>
          <span className={stil.hizmetAdi}>{s.ortak.paket.hizmetAdi}</span>
          <Cip tur="yakinda">{s.ortak.paket.yakindaRozeti}</Cip>
        </div>
        <p className={stil.simdilik}>{s.ortak.paket.simdilik}</p>
        <div className={stil.butonlar}>
          {whatsappVarMi && (
            <Buton tur="koyu" boy="md" href={whatsapp} hariciMi>
              <WhatsAppIkon boy={15} />
              {s.ortak.cta.whatsapp}
            </Buton>
          )}
          <Buton tur="koyuOutline" boy="md" href={telefon}>
            {isletme.telefon ?? TELEFON_YER_TUTUCU}
          </Buton>
        </div>
      </div>
    </div>
  )
}
