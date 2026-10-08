import { FotoYuvasi } from '@/components/ui/FotoYuvasi'
import { fotograflar } from '@/content/fotograflar'
import type { Dil, FotoId } from '@/content/types'
import stil from './Izgara.module.css'

type Props = { dil: Dil }

/**
 * Manifestteki kadrajların tamamı, manifest sırasıyla. Elle yazılmış ikinci bir
 * liste yok: bu sayfa `content/fotograflar.ts`'in kendisidir, onun bir seçkisi
 * değil. (Menünün `CekimListesi` bölümü aynı manifestten yedi kare seçiyordu;
 * 13 Ağustos 2026'da kaldırıldı, manifestin tek yüzeyi burası kaldı.)
 *
 * `kart` biçimi: ızgaranın karosu (`karo`, 110px) bir kontrol listesi ölçüsü,
 * fotoğrafın okunacağı ölçü değil. `kart` (clamp(240px,30vh,300px)) sitenin
 * fotoğraf taşıyan en küçük plakası, Menu:126.
 *
 * İlk kare her genişlikte ekranın üstünde ve LCP öğesi: tembel yüklenince mobil
 * LCP 3,2-3,4 sn ölçüldü (8 Ekim 2026). Diğerleri tembel kalır.
 */
export function Izgara({ dil }: Props) {
  const kadrajlar = Object.keys(fotograflar) as FotoId[]

  return (
    <div className={stil.izgara}>
      {kadrajlar.map((id, i) => (
        <FotoYuvasi key={id} id={id} dil={dil} bicim="kart" etiketGoster oncelikli={i === 0} />
      ))}
    </div>
  )
}
