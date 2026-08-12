import { Izgara } from '@/components/sayfa/galeri/Izgara'
import { sozluk, type Dil } from '@/content'
import stil from './GaleriSayfasi.module.css'

type Props = { dil: Dil }

/**
 * Galeri sayfasının gövdesi. Kabuğu (üst bar, alt bilgi) `Kabuk`'tan alır.
 *
 * Tasarım paketinde bu sayfanın çizimi yok; ölçüler Gizlilik sayfasında kurulan
 * "tasarımsız iç sayfa" kalıbından, ızgara ise menü ürün ızgarasından alındı.
 * Yeni bir görsel dil kurulmadı.
 *
 * Metnin tamamı sözlükten gelir ve azdır: bu sayfa için hazır metin bloğu yok,
 * uydurulmadı. Bkz. content/tr/galeri.ts ve docs/surec/rapor/galeri-report.md.
 */
export function GaleriSayfasi({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <article className={stil.sayfa}>
      <header className={stil.tepe}>
        <h1 className={stil.baslik}>{s.galeri.baslik}</h1>
        <p className={stil.altMetin}>{s.galeri.altMetin}</p>
      </header>

      <Izgara dil={dil} />

      <p className={stil.aiNotu}>{s.galeri.aiNotu}</p>
    </article>
  )
}
