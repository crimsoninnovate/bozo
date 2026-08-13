import { CanliSaat } from '@/components/saat/CanliSaat'
import { DurumCipi } from '@/components/saat/DurumCipi'
import { Buton } from '@/components/ui/Buton'
import { PinIkon, TelefonIkon } from '@/components/ui/Ikonlar'
import { sozluk, type Dil } from '@/content'
import { isletme, TELEFON_YER_TUTUCU } from '@/content/isletme'
import { telefonUrl } from '@/lib/site'
import stil from './Acilis.module.css'

type Props = { dil: Dil }

/**
 * Konum sayfasının açılışı. Konum Sayfasi.dc.html:63-86
 *
 * Durum satırı üç öğe taşır: durum çipi, canlı saat ve "Girne saati, canlı" alt
 * notu (Konum:72). Bu üçüncü öğe `DurumAltMetni` DEĞİL; o bileşen açık/kapalı
 * durumuna göre değişen bir cümle basar (`ortak.durum.acikAlt` / `kapaliAlt`),
 * buradaki ise saatin hangi saat dilimi olduğunu söyleyen sabit bir etikettir.
 *
 * Birincil buton dışarıya link değil: tasarımda `data-git="harita"` taşır ve
 * sayfa içindeki `#harita` bölümüne kaydırır (Konum:80 ve script satır 248-254).
 * Çapa payını `Kabuk` veriyor (`.icSayfa [id]`, 96px), bölüm bunu tekrar etmez.
 */
export function Acilis({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <section className={stil.bolum}>
      <div className={stil.durumSatiri}>
        <DurumCipi dil={dil} boy="kucuk" />
        <CanliSaat boy="kucuk" />
        <span className={stil.saatEtiketi}>{s.konum.hero.saatEtiketi}</span>
      </div>

      <h1 className={stil.baslik}>
        {s.konum.hero.baslikSatir1}
        <br />
        {s.konum.hero.baslikSatir2}
      </h1>

      <p className={stil.adres}>
        <PinIkon boy={16} />
        <span className={stil.adresMetin}>
          {s.ortak.satirlar.adresTamSatir}
          <br />
          {s.ortak.satirlar.adresSehirUlke}
        </span>
      </p>

      <div className={stil.butonlar}>
        {/* Bu buton harici harita açmıyor, sayfa içinde `#harita`ya kaydırıyor;
            o yüzden eylem ikonu değil gezinme oku alıyor. Etiketin hedefiyle
            uyumsuzluğu IYILESTIRMELER.md'ye yazıldı. */}
        <Buton tur="birincil" boy="lg" href="#harita" ok>
          {s.ortak.cta.yolTarifiAl}
        </Buton>
        <Buton
          tur="ikincil"
          boy="lg"
          href={telefonUrl(isletme.telefon)}
          ikon={<TelefonIkon boy={17} />}
        >
          {isletme.telefon ?? TELEFON_YER_TUTUCU}
        </Buton>
      </div>
    </section>
  )
}
