'use client'

import { BolumBasligi } from '@/components/ui/BolumBasligi'
import { Cip } from '@/components/ui/Cip'
import { FotoYuvasi, type KorNefesi } from '@/components/ui/FotoYuvasi'
import { sozluk, type Dil } from '@/content'
import type { FotoId } from '@/content/types'
import { ikramGorunumu } from '@/lib/menu/ikramGorunumu'
import { useMenu } from './MenuVerisi'
import stil from './Ikramlar.module.css'

type Props = { dil: Dil }

/** Lebeni 11s/0 (biçimin varsayılanı), bostana 12s/1.5s. Menu:208, 220 */
const IKRAM_NEFESLERI: KorNefesi[] = [{ sure: 11 }, { sure: 12, gecikme: 1.5 }]

/**
 * İkram kartı: plaka solda, gövde sağda, ikisi aynı kutunun içinde sarmalı.
 * Plakada köşe işareti ve indeks yok, kor lekesi nar tonunda (FotoYuvasi
 * `bicim="ikram"` bunların hepsini kendi taşır). Menu:206-217
 */
function IkramKarti(props: {
  dil: Dil
  fotoId: FotoId | null
  ad: string
  aciklama: string
  rozet: string
  korNefesi?: KorNefesi
}) {
  const { dil, fotoId, ad, aciklama, rozet, korNefesi } = props

  return (
    <article className={stil.kart}>
      {fotoId && <FotoYuvasi id={fotoId} dil={dil} bicim="ikram" korNefesi={korNefesi} bosGizli />}
      <div className={stil.govde}>
        <h3 className={stil.ad}>{ad}</h3>
        <p className={stil.aciklama}>{aciklama}</p>
        <Cip tur="ikram">{rozet}</Cip>
      </div>
    </article>
  )
}

/** Menü sayfasının ikramlar bölümü; metinler menü belgesinden gelir. Menu Sayfasi.dc.html:200-231 */
export function Ikramlar({ dil }: Props) {
  const s = sozluk(dil)
  const { altMetin, urunler, gruplar } = ikramGorunumu(useMenu(), dil)

  return (
    <section id="ikramlar" tabIndex={-1} className={stil.bolum}>
      <BolumBasligi olcek="sayfa" vurguCizgi baslik={s.ortak.nav.ikramlar} not={altMetin} notTonu="krem72" />

      <div className={stil.satir}>
        {urunler.map((urun, sira) => (
          <IkramKarti
            key={urun.id}
            dil={dil}
            fotoId={urun.fotoId}
            ad={urun.ad}
            aciklama={urun.aciklama}
            rozet={s.ortak.ikramRozeti}
            korNefesi={IKRAM_NEFESLERI[sira]}
          />
        ))}
      </div>

      {/* Plakası olmayan ikramlar: hazırlanışa göre kümeler (menü belgesi). */}
      <div className={stil.gruplar}>
        {gruplar.map((grup) => (
          <div key={grup.id} className={stil.grup}>
            <h3 className={stil.grupBaslik}>{grup.ad}</h3>
            <ul className={stil.grupListesi}>
              {grup.ogeler.map((oge) => (
                <li key={oge.id} className={stil.oge}>
                  {oge.ad}
                </li>
              ))}
            </ul>
            {grup.not && <p className={stil.grupNotu}>{grup.not}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
