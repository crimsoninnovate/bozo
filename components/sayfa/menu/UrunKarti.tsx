import { FotoYuvasi, type KorNefesi } from '@/components/ui/FotoYuvasi'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { fiyatMetni } from '@/content/isletme'
import type { Dil, FotoId, Urun } from '@/content/types'
import { OlcuSatirlari } from './OlcuSatirlari'
import stil from './UrunKarti.module.css'
import { dulOnle } from '@/lib/metin'

type Props = {
  dil: Dil
  fotoId: FotoId
  /** İki haneli statik indeks ("02" ... "07"), plakanın sağ üstünde. */
  indeks: string
  ad: string
  aciklama?: string
  urun: Urun
  korNefesi?: KorNefesi
}

/**
 * Ocakbasi ızgarasının ürün kartı. Menu Sayfasi.dc.html:125-141; 1040 altında aynı DOM
 * prototipin satırına döner (sahibinin 1A/2A kararı, ölçüler UrunKarti.module.css).
 *
 * Yalnız menü sayfası kullanır, o yüzden `components/ui/` değil sayfa dizini.
 */
export function UrunKarti({ dil, fotoId, indeks, ad, aciklama, urun, korNefesi }: Props) {
  return (
    <article className={stil.kart}>
      <FotoYuvasi
        id={fotoId}
        dil={dil}
        bicim="kart"
        korNefesi={korNefesi}
        bosMobildeGizli
      />
      <span aria-hidden="true" className={stil.indeks}>
        {indeks}
      </span>
      <div className={stil.govde}>
        <div className={stil.adSatiri}>
          <h3 className={stil.ad}>{dulOnle(ad)}</h3>
          <span aria-hidden="true" className={stil.anaFiyat}>
            {fiyatMetni(urun.fiyatlar.porsiyon)}
          </span>
        </div>
        {aciklama && <p className={stil.aciklama}>{aciklama}</p>}
        <div className={stil.altSatir}>
          <TaneDizilimi adet={3} buyuk={9} kucuk={5} bosluk={4} ton="krem50" />
        </div>
        <OlcuSatirlari dil={dil} urun={urun} />
      </div>
    </article>
  )
}
