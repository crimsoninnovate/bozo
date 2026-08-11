import { KorSahnesi } from '@/components/ember/KorSahnesi'
import { AltBilgi } from '@/components/layout/AltBilgi'
import { MobilAksiyonBari } from '@/components/layout/MobilAksiyonBari'
import { UstBar } from '@/components/layout/UstBar'
import type { Dil } from '@/content'
import type { RotaAnahtari } from '@/lib/site'
import stil from './Kabuk.module.css'

type Props = {
  dil: Dil
  aktif: RotaAnahtari
  children: React.ReactNode
}

/**
 * On rotanın ortak kabuğu: kor sahnesi, üst bar, sayfa gövdesi, alt bilgi ve
 * mobil eylem barı. Her `app/**\/page.tsx` bunu bir kez sarmalar.
 *
 * `UstBar` (nav listesi, CTA hedefi, bar ölçüsü), `AltBilgi` (üç footer
 * varyantı) ve `KorSahnesi` (yoğunluk takibi) rotaya göre değişir; App Router
 * layout'ları sayfanın kendi prop'larını almaz, bu yüzden bu bilgi kök
 * `layout.tsx` dosyalarında değil, burada, her sayfanın zaten bildiği `aktif`
 * değerinden geçirilir. Hangi rotanın hangi varyantı aldığı `lib/kabuk.ts`
 * içinde tek tabloda, kaynak satırlarıyla birlikte durur.
 *
 * `<main>`'in iç sayfa sınıfı yalnız çapa payını taşır (bkz. Kabuk.module.css);
 * ana sayfa payını `Bolum` kendi içinde verir.
 */
export function Kabuk({ dil, aktif, children }: Props) {
  const anaSayfaMi = aktif === 'ana'

  return (
    <>
      <KorSahnesi yogunlukTakip={anaSayfaMi} />
      <UstBar dil={dil} aktif={aktif} />
      <main className={anaSayfaMi ? undefined : stil.icSayfa}>{children}</main>
      <AltBilgi dil={dil} aktif={aktif} />
      <MobilAksiyonBari dil={dil} />
    </>
  )
}
