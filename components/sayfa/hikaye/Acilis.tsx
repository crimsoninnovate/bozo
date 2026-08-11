import { EtiketSatiri } from '@/components/ui/EtiketSatiri'
import { sozluk, type Dil } from '@/content'
import stil from './Acilis.module.css'

type Props = { dil: Dil }

/**
 * Hikaye sayfasının açılışı: üstyazı, H1 ve giriş paragrafı.
 * Hikaye Sayfasi.dc.html:63-70
 */
export function Acilis({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <section className={stil.bolum}>
      <EtiketSatiri className={stil.ustyazi}>{s.hikaye.acilis.ustyazi}</EtiketSatiri>
      <h1 className={stil.baslik}>{s.hikaye.acilis.baslik}</h1>
      <p className={stil.giris}>{s.hikaye.acilis.giris}</p>
    </section>
  )
}
