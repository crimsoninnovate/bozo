import { Buton } from '@/components/ui/Buton'
import { TaneDizilimi } from '@/components/ui/TaneDizilimi'
import { sozluk, type Dil } from '@/content'
import { isletme } from '@/content/isletme'
import { yorumUrl } from '@/lib/site'
import stil from './YorumDaveti.module.css'

type Props = { dil: Dil }

/** Google yorum daveti: menü sayfasının sonu ve ana sayfanın sonu. Hedef yoksa hiçbir şey basmaz. */
export function YorumDaveti({ dil }: Props) {
  const href = yorumUrl(isletme.googleYorumKodu)
  if (!href) return null
  const s = sozluk(dil).ortak.yorum

  return (
    <section className={stil.bolum} aria-labelledby="yorum-baslik">
      <div className={stil.kutu}>
        <div className={stil.metin}>
          <TaneDizilimi adet={6} buyuk={14} kucuk={9} bosluk={8} mobil={{ buyuk: 12, kucuk: 8, bosluk: 7 }} />
          <h2 id="yorum-baslik" className={stil.baslik}>{s.baslik}</h2>
          <p className={stil.satir}>{s.satir}</p>
        </div>
        <Buton tur="birincil" boy="md" href={href} hariciMi>
          {s.buton}
        </Buton>
      </div>
    </section>
  )
}
