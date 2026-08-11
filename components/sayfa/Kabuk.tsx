import { KorSahnesi } from '@/components/ember/KorSahnesi'
import { AltBilgi } from '@/components/layout/AltBilgi'
import { MobilAksiyonBari } from '@/components/layout/MobilAksiyonBari'
import { UstBar } from '@/components/layout/UstBar'
import type { Dil } from '@/content'
import type { RotaAnahtari } from '@/lib/site'

type Props = {
  dil: Dil
  aktif: RotaAnahtari
  children: React.ReactNode
}

/**
 * On rotanın ortak kabuğu: kor sahnesi, üst bar, sayfa gövdesi, alt bilgi ve
 * mobil eylem barı. Her `app/**\/page.tsx` bunu bir kez sarmalar.
 *
 * `UstBar` (nav aktifliği, "Gece" bağlantısı) ve `KorSahnesi` (yoğunluk takibi)
 * rotaya göre değişir; App Router layout'ları sayfanın kendi prop'larını almaz,
 * bu yüzden bu bilgi kök `layout.tsx` dosyalarında değil, burada, her sayfanın
 * zaten bildiği `aktif` değerinden geçirilir. `AltBilgi` ve `MobilAksiyonBari`
 * yalnız `dil` alır, rotadan bağımsızdır.
 */
export function Kabuk({ dil, aktif, children }: Props) {
  const anaSayfaMi = aktif === 'ana'

  return (
    <>
      <KorSahnesi yogunlukTakip={anaSayfaMi} />
      <UstBar dil={dil} aktif={aktif} ilerleme={anaSayfaMi} />
      <main>{children}</main>
      <AltBilgi dil={dil} />
      <MobilAksiyonBari dil={dil} />
    </>
  )
}
