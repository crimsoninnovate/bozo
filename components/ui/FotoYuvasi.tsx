import Image from 'next/image'
import { fotograflar } from '@/content/fotograflar'
import type { Dil, FotoId } from '@/content/types'
import stil from './FotoYuvasi.module.css'

/**
 * Tasarımda iki plaka ailesi var.
 *
 * Pencere ailesi (kendi zemini yok, arkasındaki kor sahnesine açılır):
 *   portre     Ana:148 iddia, Ana:283 bozo
 *   portreUzun Hikaye:73, yanındaki kartla birlikte uzasın diye min-height
 *   genis      Ana:236 ikram, ortalanmış etiket
 *
 * Ocak ailesi (--plaka-zemin, kor lekesi, vinyet, taşma gizli):
 *   spread Menu:94, kart Menu:126, ikram Menu:207, icecek Menu:239, karo Menu:271
 */
export type YuvaBicimi = 'portre' | 'portreUzun' | 'genis' | 'spread' | 'kart' | 'ikram' | 'icecek' | 'karo'

/** Tasarımın her biçimde kaç köşe işareti kullandığı. */
const VARSAYILAN_KOSE: Record<YuvaBicimi, 0 | 1 | 2 | 4> = {
  portre: 4,
  portreUzun: 4,
  genis: 2,
  spread: 2,
  kart: 1,
  ikram: 0,
  icecek: 0,
  karo: 0,
}

/** Kor lekesi ve vinyet yalnız ocak ailesinde var. */
const OCAK_AILESI: ReadonlySet<YuvaBicimi> = new Set<YuvaBicimi>(['spread', 'kart', 'ikram', 'icecek', 'karo'])

type Props = {
  id: FotoId
  dil: Dil
  bicim: YuvaBicimi
  /** Biçimin varsayılanını ezmek gerekirse. Tasarımda 0, 1, 2 ve 4 köşe var. */
  koseIsaretleri?: 0 | 1 | 2 | 4
  /**
   * Plakanın içine mutlak konumlanan katman: iddia plakasının ortasındaki tane
   * rayı (Ana:149) ve menü kartının sağ üst indeks rozeti (Menu:131). Konumu
   * çağıran verir, plaka yalnız `position: relative` zeminini sağlar.
   */
  children?: React.ReactNode
}

export function FotoYuvasi({ id, dil, bicim, koseIsaretleri, children }: Props) {
  const foto = fotograflar[id]
  const etiket = dil === 'en' ? foto.etiketEn : foto.etiket

  if (foto.dosya) {
    return (
      <div className={`${stil.kap} ${stil[bicim]}`}>
        <Image src={foto.dosya} alt={etiket} fill className={stil.gorsel} sizes="(max-width: 780px) 100vw, 50vw" />
        {children}
      </div>
    )
  }

  const koseSayisi = koseIsaretleri ?? VARSAYILAN_KOSE[bicim]
  // Köşe sınıfları açık dizi olarak tutulur; şablon dizgisiyle indekslemek
  // noUncheckedIndexedAccess altında string | undefined döndürür ve derlemez.
  // Sıra kritik: tek köşeli varyant sol-üstü, iki köşeli varyant sol-üst ile
  // sağ-altı kullanır, bitişik ikisini değil.
  const koseSiniflari = [stil.solUst, stil.sagAlt, stil.sagUst, stil.solAlt]

  return (
    <div className={`${stil.kap} ${stil[bicim]}`}>
      {OCAK_AILESI.has(bicim) && (
        <>
          <span aria-hidden="true" className={stil.kor} />
          <span aria-hidden="true" className={stil.vinyet} />
        </>
      )}
      {koseSiniflari.slice(0, koseSayisi).map((koseSinif) => (
        <span key={koseSinif} aria-hidden="true" className={`${stil.kose} ${koseSinif}`} />
      ))}
      <span className={stil.etiket}>
        <span aria-hidden="true" className={stil.etiketCizgi} />
        {etiket}
      </span>
      {children}
    </div>
  )
}
