import { CamPanel } from '@/components/ui/CamPanel'
import { FotoYuvasi } from '@/components/ui/FotoYuvasi'
import { NotBlogu } from '@/components/ui/NotBlogu'
import { sozluk, type Dil } from '@/content'
import stil from './Portre.module.css'

type Props = { dil: Dil }

/**
 * Portre bölümü: solda foto plakası, sağda üç öğeli cam kart (başlık, gövde,
 * not). Hikaye Sayfasi.dc.html:72-88
 *
 * Plaka `portreUzun` biçiminde: bölüm `align-items:stretch` olduğu için plaka
 * `height` değil `min-height` taşımak zorunda, yoksa daha uzun olan kartla
 * birlikte uzayamaz.
 */
export function Portre({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <section className={stil.bolum}>
      <FotoYuvasi id="bozo-portre" dil={dil} bicim="portreUzun" />

      <CamPanel opaklik={0.72} dolgu="genis" className={stil.kart}>
        <h2 className={stil.baslik}>{s.hikaye.portre.kartBasligi}</h2>
        <p className={stil.metin}>{s.hikaye.portre.kartMetni}</p>
        <NotBlogu>{s.hikaye.portre.kartNotu}</NotBlogu>
      </CamPanel>
    </section>
  )
}
