import Link from 'next/link'
import { sozluk, type Dil } from '@/content'
import { isletme, TELEFON_YER_TUTUCU } from '@/content/isletme'
import { altBilgiSayfaLinkleri } from '@/lib/kabuk'
import { telefonUrl, yol, type RotaAnahtari } from '@/lib/site'
import { TelifSeridi } from './TelifSeridi'
import stil from './AltBilgi.module.css'

type Props = { dil: Dil; aktif: RotaAnahtari }

/**
 * `Hikaye Sayfasi.dc.html:134-163` ve `Konum Sayfasi.dc.html:166-194`: dört
 * kolon, ama ana sayfanınkinden dört yerde ayrılır ve hepsi tasarımdan ölçüldü.
 *
 * 1. Marka kolonunda tane rayı ve tanım cümlesi yok; yerine adres bloğu var.
 * 2. İkinci kolon Adres değil, "Sayfalar" bağlantı listesi.
 * 3. Saatler kolonu iki satır (kapalı aralık satırı yok).
 * 4. İletişim kolonu ikonsuz iki satır; WhatsApp ve Instagram tek satırda.
 *
 * Kolon boşluğu 12px (ana sayfada 13/14), dış dolgu 56/30 (64/32), kolon
 * satırı `align-items:flex-start` taşır.
 */
export function AltBilgiSayfalar({ dil, aktif }: Props) {
  const s = sozluk(dil)
  const telefon = telefonUrl(isletme.telefon)

  return (
    <footer className={`${stil.zemin} ${stil.sayfalar}`}>
      <div className={`${stil.kolonlar} ${stil.kolonlarSik}`}>
        <div className={`${stil.kolon} ${stil.kolonSik}`}>
          <span className={stil.markaAd}>{s.ortak.marka.ad}</span>
          {/* Görünen adres sözlükten; isletme.cadde dil-nötr yapısal veridir (bkz. AltBilgiTam). */}
          <div className={stil.adresBloku}>
            <div>
              {s.ortak.satirlar.adresCadde}
              {isletme.binaNo ? ` ${s.ortak.satirlar.adresBina}` : ''}
            </div>
            <div>{s.ortak.satirlar.adresSehirUlke}</div>
          </div>
        </div>

        {/*
         * Bilerek <nav> değil: aynı üç hedef üst barda zaten adlandırılmış bir
         * landmark içinde duruyor, footer'da ikinci bir gezinme bölgesi landmark
         * listesini yeni bir varış noktası eklemeden kalabalıklaştırır. Sitenin
         * iki gezinme adı (ortak.erisim.anaGezinme / mobilGezinme) modeli korunur.
         */}
        <div className={`${stil.kolon} ${stil.kolonSik} ${stil.baglantiKolonu}`}>
          <div className={stil.baslik}>{s.ortak.footer.sayfalarBaslik}</div>
          {altBilgiSayfaLinkleri(aktif).map((link) => (
            <Link key={link.rota} href={yol(link.rota, dil)} className={stil.sayfaLinki}>
              {s.ortak.nav[link.etiket]}
            </Link>
          ))}
        </div>

        <div className={`${stil.kolon} ${stil.kolonSik}`}>
          <div className={stil.baslik}>{s.ortak.footer.saatlerBaslik}</div>
          <div className={stil.satirTabular}>{s.ortak.satirlar.saatlerGunluk}</div>
          <div className={stil.satir}>{s.ortak.alkolsuzKisa}</div>
        </div>

        <div className={`${stil.kolon} ${stil.kolonSik}`}>
          <div className={stil.baslik}>{s.ortak.footer.iletisimBaslik}</div>
          {telefon ? (
            <a href={telefon} className={`${stil.satirTabular} ${stil.metinLinki}`}>
              {isletme.telefon}
            </a>
          ) : (
            <span className={`${stil.satirTabular} ${stil.pasif}`} aria-disabled="true">
              {TELEFON_YER_TUTUCU}
            </span>
          )}
          {/* Tasarım burada iki kanalı tek satırda yazar, ikonsuz ve bağlantısız. */}
          <div className={stil.satir}>{s.ortak.footer.sosyal}</div>
        </div>
      </div>

      <TelifSeridi dil={dil} aktif={aktif} sikMi />
    </footer>
  )
}
