import { BolumBasligi } from '@/components/ui/BolumBasligi'
import { CamPanel } from '@/components/ui/CamPanel'
import { Cip } from '@/components/ui/Cip'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import stil from './Usul.module.css'

type Props = { dil: Dil }

/**
 * Usul bölümü: başlık satırı (başlık + tane rayı) ve üç numaralı satır.
 * Hikaye Sayfasi.dc.html:90-118
 *
 * Başlık "Usul", tasarımdaki "Usül" değil: işletme sahibi tasarımdaki yazımın
 * hata olduğunu onayladı, gerekçe `content/tr/hikaye.ts:18-19` yorumunda.
 */
export function Usul({ dil }: Props) {
  const s = sozluk(dil)
  const u = s.hikaye.usul

  const satirlar = [
    { etiket: u.taneEtiketi, govde: <p className={stil.govde}>{u.taneMetni}</p> },
    {
      etiket: u.olcuEtiketi,
      govde: (
        <ul className={stil.olculer}>
          {[u.olcuSisSayisi, u.olcuSisIcerigi, u.olcuPisirme].map((olcu) => (
            <li key={olcu}>
              <Cip tur="olcu">{olcu}</Cip>
            </li>
          ))}
        </ul>
      ),
    },
    {
      etiket: u.saatEtiketi,
      govde: <p className={`${stil.govde} ${stil.saatGovdesi}`}>{u.saatMetni}</p>,
    },
  ]

  return (
    <section className={stil.bolum}>
      <CamPanel opaklik={0.74} dolgu="orta" genislik="sayfa">
        <BolumBasligi
          olcek="orta"
          baslik={u.baslik}
          sag={<TaneDizilimi adet={6} buyuk={13} kucuk={8} bosluk={10} ton="krem80" />}
        />

        <ol className={stil.liste}>
          {satirlar.map((satir, sira) => (
            <li key={satir.etiket} className={stil.satir}>
              {/* 01/02/03 tasarımda statik rakam, `data-en` taşımıyor: çevrilmez,
                  sözlüğe girmez. Sıra bilgisini <ol> zaten taşıdığı için görünen
                  rakam dekoratif. Hikaye:99, 104, 113 */}
              <span aria-hidden="true" className={stil.numara}>
                {String(sira + 1).padStart(2, '0')}
              </span>
              <h3 className={stil.etiket}>{satir.etiket}</h3>
              {satir.govde}
            </li>
          ))}
        </ol>
      </CamPanel>
    </section>
  )
}
