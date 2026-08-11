import { FotoYuvasi } from '@/components/ui/FotoYuvasi'
import { sozluk, type Dil } from '@/content'
import type { FotoId } from '@/content/types'
import stil from './CekimListesi.module.css'

type Props = { dil: Dil }

/**
 * Menünün beklediği yedi kare, tasarımdaki sırayla. Menu:271-277
 *
 * Liste burada duruyor çünkü manifest (`content/fotograflar.ts`) sitenin bütün
 * kadrajlarını tutuyor, bu bölüm ise onun yedi tanesini belli bir sırayla
 * gösteriyor: `bozo-portre`, `dalak`, `lebeni` gibi kadrajlar bu ızgarada yok.
 */
const CEKIM_KARELERI: FotoId[] = [
  'tane-yakin-cekim',
  'kor-uzerinde-sis',
  'ustanin-eli',
  'kurulu-sofra',
  'gece-cephesi',
  'paket-ve-gel-al',
  'bes-urun',
]

/** Çekim listesi paneli. Menu Sayfasi.dc.html:264-281 */
export function CekimListesi({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <section className={stil.bolum}>
      <div className={stil.panel}>
        <div className={stil.baslikSatiri}>
          <h2 className={stil.baslik}>{s.menu.cekim.baslik}</h2>
          <p className={stil.altMetin}>{s.menu.cekim.altMetin}</p>
        </div>
        <div className={stil.izgara}>
          {CEKIM_KARELERI.map((id) => (
            <FotoYuvasi key={id} id={id} dil={dil} bicim="karo" />
          ))}
        </div>
        <p className={stil.aiNotu}>{s.menu.cekim.aiGorselNotu}</p>
      </div>
    </section>
  )
}
