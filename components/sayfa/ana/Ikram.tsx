import { Bolum } from '@/components/ui/Bolum'
import { FotoYuvasi } from '@/components/ui/FotoYuvasi'
import { IkramCipi } from '@/components/ui/IkramCipi'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import stil from './Ikram.module.css'

type Props = { dil: Dil }

/** Ana sayfanın ikram bölümü. Ana Sayfa Alternatif.dc.html:219-242 */
export function Ikram({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <Bolum id="ikram" yogunluk={0.7} className={stil.bolum} eritClassName={stil.erit}>
      <TaneDizilimi adet={6} buyuk={16} kucuk={10} bosluk={10} />
      <h2 className={stil.baslik}>{s.ana.ikram.baslik}</h2>
      <p className={stil.metin}>{s.ana.ikram.metin}</p>
      <div className={stil.cipler}>
        <IkramCipi ad={s.ana.ikram.cip1.ad} detay={s.ana.ikram.cip1.detay} />
        <IkramCipi ad={s.ana.ikram.cip2.ad} detay={s.ana.ikram.cip2.detay} />
      </div>
      {/* Sarmalayıcı yalnız kolonun 28px gap'ine 14px ekler (Ana:236). */}
      <div className={stil.plakaKabi}>
        <FotoYuvasi id="kurulu-sofra" dil={dil} bicim="genis" />
      </div>
    </Bolum>
  )
}
