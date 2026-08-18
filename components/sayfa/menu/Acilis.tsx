import { CanliSaat } from '@/components/saat/CanliSaat'
import { DurumCipi } from '@/components/saat/DurumCipi'
import { CapaBaglantisi } from '@/components/ui/CapaBaglantisi'
import { sozluk, type Dil } from '@/content'
import { ustBarVaryanti } from '@/lib/kabuk'
import stil from './Acilis.module.css'

type Props = { dil: Dil }

/**
 * Menü sayfasının açılışı. Menu Sayfasi.dc.html:65-83
 *
 * Durum çipi + canlı saat, H1 ve spot metni. Tasarımın çipi ve saati Konum hero'sunun
 * ölçüsünde, yani `boy="kucuk"`. Sağdaki gece menüsü not kartı 13 Ağustos 2026'da kalktı.
 *
 * Atlama çipleri yalnız 1040 altında: masaüstü barın üç çapası (Ocaktan, İkramlar,
 * İçecekler) telefonda hiçbir yerde yoktu, İçecekler 6,6 ekran aşağıdaydı (ölçüldü 390).
 * Liste menü barının kendi çapalarından türer, burada yazılmaz.
 */
export function Acilis({ dil }: Props) {
  const s = sozluk(dil)
  const capalar = ustBarVaryanti('menu').nav.flatMap((o) => (o.tur === 'capa' ? [o] : []))

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
              <CapaBaglantisi href={`#${capa.hedef}`} className={stil.atlamaCipi}>
                {s.ortak.nav[capa.etiket]}
              </CapaBaglantisi>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
