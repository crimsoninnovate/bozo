import { FotoYuvasi, type KorNefesi } from '@/components/ui/FotoYuvasi'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { fiyatMetni } from '@/content/isletme'
import type { Dil, FotoId } from '@/content/types'
import stil from './UrunKarti.module.css'

type Props = {
  dil: Dil
  fotoId: FotoId
  /** İki haneli statik indeks ("02" ... "05"), plakanın sağ üstünde. */
  indeks: string
  ad: string
  aciklama: string
  fiyat: number | null
  korNefesi?: KorNefesi
}

/**
 * Ocaktan ızgarasının ürün kartı. Menu Sayfasi.dc.html:125-141
 *
 * Yalnız menü sayfası kullanır, o yüzden `components/ui/` değil sayfa dizini:
 * ana sayfanın ocaktan listesi satır tabanlıdır (`MenuSatiri`), Hikaye ve Konum
 * ürün kartı taşımaz. Paylaşılan primitife çıkarılırsa tek çağıranı olan bir
 * API donar.
 */
export function UrunKarti({ dil, fotoId, indeks, ad, aciklama, fiyat, korNefesi }: Props) {
  return (
    <article className={stil.kart}>
      <FotoYuvasi id={fotoId} dil={dil} bicim="kart" korNefesi={korNefesi}>
        <span className={stil.indeks}>{indeks}</span>
      </FotoYuvasi>
      <div className={stil.govde}>
        <h3 className={stil.ad}>{ad}</h3>
        <p className={stil.aciklama}>{aciklama}</p>
        <div className={stil.altSatir}>
          <TaneDizilimi adet={3} buyuk={9} kucuk={5} bosluk={4} ton="krem50" />
          <span className={stil.fiyat}>{fiyatMetni(fiyat)}</span>
        </div>
      </div>
    </article>
  )
}
