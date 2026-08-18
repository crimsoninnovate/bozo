import { CanliSaat } from '@/components/saat/CanliSaat'
import { DurumCipi } from '@/components/saat/DurumCipi'
import { BolumCipi } from '@/components/ui/BolumCipi'
import { sozluk, type Dil } from '@/content'
import { barCapalari } from '@/lib/kabuk'
import stil from './Acilis.module.css'

type Props = { dil: Dil }

/**
 * Menü sayfasının açılışı. Menu Sayfasi.dc.html:65-83
 *
 * Durum çipi + canlı saat, H1 ve spot metni. Tasarımın çipi ve saati Konum hero'sunun
 * ölçüsünde, yani `boy="kucuk"`.
 *
 * Atlama çipleri yalnız 1040 altında: barın üç çapası (Ocaktan, İkramlar, İçecekler)
 * telefonda hiçbir yerde yoktu, İçecekler 6,6 ekran aşağıdaydı (ölçüldü 390).
 */
export function Acilis({ dil }: Props) {
  const s = sozluk(dil)
  const capalar = barCapalari('menu')

  return (
    <section className={stil.bolum}>
      <div className={stil.kolon}>
        <div className={stil.durumSatiri}>
          <DurumCipi dil={dil} boy="kucuk" />
          <CanliSaat boy="kucuk" />
        </div>
        <h1 className={stil.baslik}>{s.menu.acilis.baslik}</h1>
        <p className={stil.spot}>{s.menu.acilis.spot}</p>
        <ul className={stil.atlama}>
          {capalar.map((capa) => (
            <li key={capa.hedef}>
              <BolumCipi href={`#${capa.hedef}`}>{s.ortak.nav[capa.etiket]}</BolumCipi>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
