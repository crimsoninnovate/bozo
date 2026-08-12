import { BolumBasligi } from '@/components/ui/BolumBasligi'
import { Cip } from '@/components/ui/Cip'
import { FotoYuvasi, type KorNefesi } from '@/components/ui/FotoYuvasi'
import { sozluk, type Dil, type Sozluk } from '@/content'
import type { FotoId, Ikram } from '@/content/types'
import { ikramGruplari, ikramlar } from '@/content/urunler'
import stil from './Ikramlar.module.css'

type Props = { dil: Dil }

type IkramMetni = { ad: string; aciklama: string }

/** "temizlenmiş ve ayıklanmış" notu yalnız bu kümeye ait; sahibinin ifadesi. */
const NOTLU_GRUP = 'yesillik'

/** Lebeni 11s/0 (biçimin varsayılanı), bostana 12s/1.5s. Menu:208, 220 */
const IKRAM_NEFESLERI: KorNefesi[] = [{ sure: 11 }, { sure: 12, gecikme: 1.5 }]

function ikramMetni(s: Sozluk, id: string): IkramMetni {
  const kayit: Record<string, IkramMetni | undefined> = s.menu.ikramlar.urunler
  const metin = kayit[id]
  if (!metin) throw new Error(`İkram sözlükte yok: ${id}`)
  return metin
}

function fotoIdGerekli(ikram: Ikram): FotoId {
  if (!ikram.fotoId) throw new Error(`İkramın foto yuvası yok: ${ikram.id}`)
  return ikram.fotoId
}

function grupBasligi(s: Sozluk, id: string): string {
  const kayit: Record<string, string | undefined> = s.menu.ikramlar.gruplar
  const baslik = kayit[id]
  if (!baslik) throw new Error(`İkram kümesi sözlükte yok: ${id}`)
  return baslik
}

function ogeAdi(s: Sozluk, id: string): string {
  const kayit: Record<string, string | undefined> = s.menu.ikramlar.ogeler
  const ad = kayit[id]
  if (!ad) throw new Error(`İkram kalemi sözlükte yok: ${id}`)
  return ad
}

/**
 * İkram kartı: plaka solda, gövde sağda, ikisi aynı kutunun içinde sarmalı.
 * Plakada köşe işareti ve indeks yok, kor lekesi nar tonunda (FotoYuvasi
 * `bicim="ikram"` bunların hepsini kendi taşır). Menu:206-217
 */
function IkramKarti(props: {
  dil: Dil
  fotoId: FotoId
  ad: string
  aciklama: string
  rozet: string
  korNefesi?: KorNefesi
}) {
  const { dil, fotoId, ad, aciklama, rozet, korNefesi } = props

  return (
    <article className={stil.kart}>
      <FotoYuvasi id={fotoId} dil={dil} bicim="ikram" korNefesi={korNefesi} />
      <div className={stil.govde}>
        <h3 className={stil.ad}>{ad}</h3>
        <p className={stil.aciklama}>{aciklama}</p>
        <Cip tur="ikram">{rozet}</Cip>
      </div>
    </article>
  )
}

/** Menü sayfasının ikramlar bölümü. Menu Sayfasi.dc.html:200-231 */
export function Ikramlar({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <section id="ikramlar" className={stil.bolum}>
      <BolumBasligi
        olcek="sayfa"
        vurguCizgi
        baslik={s.menu.ikramlar.baslik}
        not={s.menu.ikramlar.altMetin}
        notTonu="krem72"
      />

      <div className={stil.satir}>
        {ikramlar.map((ikram, sira) => {
          const metin = ikramMetni(s, ikram.id)
          return (
            <IkramKarti
              key={ikram.id}
              dil={dil}
              fotoId={fotoIdGerekli(ikram)}
              ad={metin.ad}
              aciklama={metin.aciklama}
              rozet={s.ortak.ikramRozeti}
              korNefesi={IKRAM_NEFESLERI[sira]}
            />
          )
        })}
      </div>

      {/* Plakası olmayan ikramlar: iki kart taşıyamayacağı kadar çok kalem var,
          hazırlanışa göre üç kümede toplandı (content/urunler.ts). */}
      <div className={stil.gruplar}>
        {ikramGruplari.map((grup) => (
          <div key={grup.id} className={stil.grup}>
            <h3 className={stil.grupBaslik}>{grupBasligi(s, grup.id)}</h3>
            <ul className={stil.grupListesi}>
              {grup.ogeler.map((oge) => (
                <li key={oge} className={stil.oge}>
                  {ogeAdi(s, oge)}
                </li>
              ))}
            </ul>
            {grup.id === NOTLU_GRUP && (
              <p className={stil.grupNotu}>{s.menu.ikramlar.yesillikNotu}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
