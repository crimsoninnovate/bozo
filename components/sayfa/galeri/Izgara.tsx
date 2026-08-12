import { FotoYuvasi } from '@/components/ui/FotoYuvasi'
import { fotograflar } from '@/content/fotograflar'
import type { Dil, FotoId } from '@/content/types'
import stil from './Izgara.module.css'

type Props = { dil: Dil }

/**
 * Manifestteki kadrajların tamamı, manifest sırasıyla. Elle yazılmış ikinci bir
 * liste yok: bu sayfa `content/fotograflar.ts`'in kendisidir, onun bir seçkisi
 * değil. Menünün `CekimListesi` bölümü aynı manifestten yedi kare seçiyor;
 * seçkinin sahibi orası, bütünün sahibi burası.
 *
 * `kart` biçimi: ızgaranın karosu (`karo`, 110px) bir kontrol listesi ölçüsü,
 * fotoğrafın okunacağı ölçü değil. `kart` (clamp(240px,30vh,300px)) sitenin
 * fotoğraf taşıyan en küçük plakası, Menu:126.
 *
 * Tembel yükleme: `dosya` dolduğunda `FotoYuvasi` `next/image`'a geçer ve
 * `priority` verilmediği için yükleme `lazy` olur. Bugün yüklenecek bir şey yok,
 * yani bu yol ölçülmedi.
 */
export function Izgara({ dil }: Props) {
  const kadrajlar = Object.keys(fotograflar) as FotoId[]

  return (
    <div className={stil.izgara}>
      {kadrajlar.map((id) => (
        <FotoYuvasi key={id} id={id} dil={dil} bicim="kart" etiketGoster />
      ))}
    </div>
  )
}
