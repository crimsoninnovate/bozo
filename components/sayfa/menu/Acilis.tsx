import { CanliSaat } from '@/components/saat/CanliSaat'
import { DurumCipi } from '@/components/saat/DurumCipi'
import { sozluk, type Dil } from '@/content'
import stil from './Acilis.module.css'

type Props = { dil: Dil }

/**
 * Menü sayfasının açılışı. Menu Sayfasi.dc.html:65-83
 *
 * Sol kolon durum çipi + canlı saat, H1 ve spot metni taşır; sağda gece menüsü
 * not kartı durur. Tasarımın çipi ve saati Konum hero'sunun ölçüsünde, yani
 * `boy="kucuk"` (bkz. DurumCipi.module.css ve CanliSaat.module.css yorumları).
 *
 * Not kartı `<aside>` değil `<div>`: adı olmayan bir complementary landmark,
 * kabuk turunun landmark kararıyla (tek adlı gezinme bölgesi) çelişirdi.
 */
export function Acilis({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <section className={stil.bolum}>
      <div className={stil.kolon}>
        <div className={stil.durumSatiri}>
          <DurumCipi dil={dil} boy="kucuk" />
          <CanliSaat boy="kucuk" />
        </div>
        <h1 className={stil.baslik}>{s.menu.acilis.baslik}</h1>
        <p className={stil.spot}>{s.menu.acilis.spot}</p>
      </div>
    </section>
  )
}
