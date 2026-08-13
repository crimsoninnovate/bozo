import { Bolum } from '@/components/ui/Bolum'
import { Buton } from '@/components/ui/Buton'
import { TelefonIkon } from '@/components/ui/Ikonlar'
import { MenuSatiri } from '@/components/ui/MenuSatiri'
import { sozluk, type Dil, type Sozluk } from '@/content'
import { isletme } from '@/content/isletme'
import { anaUrunler } from '@/content/urunler'
import { telefonUrl, yol } from '@/lib/site'
import stil from './Ocaktan.module.css'

type Props = { dil: Dil }

type UrunMetni = { ad: string; aciklama: string }

/*
 * Ciğer satırındaki "8 şiş / porsiyon" çipi kalktı (sahibi, 13 Ağustos 2026):
 * beş satırın yalnız birinde ekstra kutu vardı ve listenin ritmini kırıyordu.
 * Bilgi kaybolmadı, bir bölüm yukarıda zaten duruyor: İddia sayacı "8, şiş bir
 * porsiyonda". UYGULAMA-NOTLARI 1.2 çipi burada istiyordu, karar onu kapatır.
 */

/**
 * `Urun.id` paylaşılan tipte `string`, sözlük ise sabit anahtarlı. Eşleşmeyen bir
 * kimlik sessizce boş satır basmasın diye derleme sırasında patlar.
 */
function urunMetni(s: Sozluk, id: string): UrunMetni {
  const kayit: Record<string, UrunMetni | undefined> = s.ana.ocaktan.urunler
  const metin = kayit[id]
  if (!metin) throw new Error(`Ocaktan ürünü sözlükte yok: ${id}`)
  return metin
}

/**
 * Ana sayfanın ocaktan bölümü. Kaynak UYGULAMA-NOTLARI 3.
 *
 * Cam panel çerçevesi KALKTI: aynı çerçeveli dikdörtgen sayfada dört kez
 * tekrarlanıyordu ve ritmi kıran ilk şey oydu. Bölüm artık tam genişlik.
 */
export function Ocaktan({ dil }: Props) {
  const s = sozluk(dil)
  const telefon = telefonUrl(isletme.telefon)
  const { fiyat, ikramSatiri } = s.ana.ocaktan

  return (
    <Bolum id="ocaktan" yogunluk={0.4} className={stil.bolum} eritClassName={stil.erit}>
      <div className={stil.baslikSatiri}>
        <h2 className={stil.baslik}>{s.ana.ocaktan.baslik}</h2>
        <p className={stil.altNot}>{s.ana.ocaktan.altNot}</p>
      </div>

      <ol className={stil.liste}>
        {anaUrunler.map((urun, sira) => {
          const metin = urunMetni(s, urun.id)
          return (
            <MenuSatiri
              key={urun.id}
              sira={sira + 1}
              ad={metin.ad}
              aciklama={metin.aciklama}
            />
          )
        })}
      </ol>

      {/* Fiyat sütununun yerine geçen tek blok. Kalıcı: fiyatlar 13 Ağustos
          2026'da geldi ama sahibi ana sayfanın beş ad artı tek CTA olarak
          kalmasını istedi, rakamlar menü sayfasında duruyor. */}
      <div className={stil.fiyatBloku}>
        <p className={stil.fiyatBaslik}>{fiyat.baslik}</p>
        <p className={stil.fiyatMetin}>{fiyat.metin}</p>
        <div className={stil.fiyatButonlari}>
          {telefon && (
            <Buton tur="ikincil" boy="md" href={telefon} ikon={<TelefonIkon boy={17} />}>
              {isletme.telefon}
            </Buton>
          )}
          {/* Fiyatlar menüye taşındığı için bu blokta asıl yol bu buton: telefon
              ikincil kalır, menü birincil olur. */}
          <Buton tur="birincil" boy="md" href={yol('menu', dil)} ok>
            {fiyat.menuLinki}
          </Buton>
        </div>
      </div>

      <p className={stil.ikramSatiri}>
        <span className={stil.ikramVurgu}>{ikramSatiri.vurgu}</span>
        {ikramSatiri.ogeler.map((oge) => (
          <span key={oge} className={stil.ikramOge}>
            <span aria-hidden="true" className={stil.ikramAyirici} />
            {oge}
          </span>
        ))}
      </p>
    </Bolum>
  )
}
