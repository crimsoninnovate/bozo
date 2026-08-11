import Image from 'next/image'
import { fotograflar } from '@/content/fotograflar'
import type { Dil, FotoId } from '@/content/types'
import stil from './FotoYuvasi.module.css'

type Props = {
  id: FotoId
  dil: Dil
  bicim: 'portre' | 'genis' | 'karo'
  etiketYeri?: 'sol' | 'orta'
  koseIsaretleri?: 2 | 4
}

export function FotoYuvasi({
  id,
  dil,
  bicim,
  etiketYeri = 'sol',
  koseIsaretleri = 4,
}: Props) {
  const foto = fotograflar[id]
  const etiket = dil === 'en' ? foto.etiketEn : foto.etiket

  if (foto.dosya) {
    return (
      <div className={`${stil.kap} ${stil[bicim]}`}>
        <Image src={foto.dosya} alt={etiket} fill className={stil.gorsel} sizes="(max-width: 780px) 100vw, 50vw" />
      </div>
    )
  }

  // Köşe sınıfları açık dizi olarak tutulur; şablon dizgisiyle indekslemek
  // noUncheckedIndexedAccess altında string | undefined döndürür ve derlemez.
  // Sıra kritik: 2 köşeli varyant tasarımda sol-üst ve sağ-alt işaretlerini
  // kullanır, bitişik ikisini değil. Bu yüzden çapraz çift başta gelir.
  const koseSiniflari = [stil.solUst, stil.sagAlt, stil.sagUst, stil.solAlt]

  return (
    <div className={`${stil.kap} ${stil[bicim]} ${stil.bos}`} role="img" aria-label={etiket}>
      <span aria-hidden="true" className={stil.kor} />
      {koseSiniflari.slice(0, koseIsaretleri).map((koseSinif) => (
        <span key={koseSinif} aria-hidden="true" className={`${stil.kose} ${koseSinif}`} />
      ))}
      <span aria-hidden="true" className={`${stil.etiket} ${stil[etiketYeri]}`}>
        <span className={stil.etiketCizgi} />
        {etiket}
      </span>
    </div>
  )
}
