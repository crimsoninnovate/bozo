import { Buton } from '@/components/ui/Buton'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './Sofra.module.css'

type Props = { dil: Dil }

/**
 * Kapanış bölümü: tane rayı, başlık, paragraf ve iki buton.
 * Hikaye Sayfasi.dc.html:120-132
 *
 * İkincil buton "Yol tarifi al" değil "Konum ve saatler" ve Konum sayfasına
 * gider (Hikaye:129). "Yol tarifi al" bu sayfada yalnız üst bar CTA'sıdır.
 */
export function Sofra({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <section className={stil.bolum}>
      <div className={stil.kolon}>
        <TaneDizilimi adet={6} buyuk={14} kucuk={9} bosluk={10} ton="krem" />

        <h2 className={stil.baslik}>{s.hikaye.sofra.baslik}</h2>
        <p className={stil.metin}>{s.hikaye.sofra.metin}</p>

        <div className={stil.butonlar}>
          <Buton tur="birincil" boy="lg" href={yol('menu', dil)} ok>
            {s.ortak.cta.menuyuGor}
          </Buton>
          <Buton tur="ikincil" boy="lg" href={yol('konum', dil)} ok>
            {s.hikaye.sofra.ctaKonum}
          </Buton>
        </div>
      </div>
    </section>
  )
}
