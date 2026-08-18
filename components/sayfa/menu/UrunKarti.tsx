import { FotoYuvasi, type KorNefesi } from '@/components/ui/FotoYuvasi'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { fiyatMetni } from '@/content/isletme'
import type { Dil, FotoId, Urun } from '@/content/types'
import { OlcuSatirlari } from './OlcuSatirlari'
import stil from './UrunKarti.module.css'

type Props = {
  dil: Dil
  fotoId: FotoId
  /** İki haneli statik indeks ("02" ... "06"), plakanın sağ üstünde. */
  indeks: string
  ad: string
  aciklama: string
  urun: Urun
  korNefesi?: KorNefesi
}

/**
 * Ocaktan ızgarasının ürün kartı. Menu Sayfasi.dc.html:125-141. 1040 altında aynı DOM
 * prototipin satırı olur (Mobil "kart değil satır"): plaka yalnız fotoğraf varsa ve
 * 72px, indeks sol sütunda, tam fiyat adın hizasında (`anaFiyat`, masaüstünde gizli),
 * ölçü listesi ince ikinci satır. Sahibinin 1A/2A kararı, 18 Ağustos 2026.
 *
 * Yalnız menü sayfası kullanır, o yüzden `components/ui/` değil sayfa dizini.
 */
export function UrunKarti({ dil, fotoId, indeks, ad, aciklama, urun, korNefesi }: Props) {
  return (
    <article className={stil.kart}>
      <FotoYuvasi id={fotoId} dil={dil} bicim="kart" korNefesi={korNefesi} bosMobildeGizli />
      <span className={stil.indeks}>{indeks}</span>
      <div className={stil.govde}>
        <div className={stil.adSatiri}>
          <h3 className={stil.ad}>{ad}</h3>
          <span className={stil.anaFiyat}>{fiyatMetni(urun.tam)}</span>
        </div>
        <p className={stil.aciklama}>{aciklama}</p>
        <div className={stil.altSatir}>
          <TaneDizilimi adet={3} buyuk={9} kucuk={5} bosluk={4} ton="krem50" />
        </div>
        <OlcuSatirlari dil={dil} urun={urun} />
      </div>
    </article>
  )
}
