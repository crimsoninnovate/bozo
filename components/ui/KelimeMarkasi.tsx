import Link from 'next/link'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './KelimeMarkasi.module.css'

type Props = { dil: Dil }

/**
 * Alt bilgideki kelime markası: kavisli banner, krem el yazısı "Ciğerci" ve
 * konturlu "Bozo". Sahibinin varlığı (`Bozo-Typo.svg`, 24 Ağustos 2026), plakalı
 * hâliyle seçildi.
 *
 * Bu, 18 Ağustos 2026'nın F1 kararını (alt bilgi işaret taşımaz, yalnız kelime
 * kilidi) sahibinin isteğiyle geri alır; gerekçe IYILESTIRMELER.md'de.
 *
 * `<img>`, `next/image` değil: varlık SVG, optimize edilecek bir şeyi yok, ve
 * dört rotanın alt bilgisinde satır içi gömmek her sayfaya 15 KB eklerdi.
 * Renkleri sabit; palet takasını takip etmez, marka işaretleri kapalı renk
 * listesinin zaten kayıtlı istisnası (bkz. CLAUDE.md > Colors).
 */
export function KelimeMarkasi({ dil }: Props) {
  const s = sozluk(dil)
  return (
    <Link href={yol('ana', dil)} className={stil.baglanti}>
      <img className={stil.marka} src="/kelime-markasi.svg" alt={s.ortak.marka.ad} />
    </Link>
  )
}
