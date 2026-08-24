import Link from 'next/link'
import { SisIsareti } from '@/components/ui/SisIsareti'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './MarkaKilidi.module.css'

/**
 * Yatay kilit, markanın birincil logosu (01-Logo-Final-Karar.md): solda şiş
 * işareti, sağda iki satır kelime markası, üstte küçük ve aralığı açık
 * "Ciğerci", altta büyük "Bozo". Çubuk kelime bloğunun ortasından geçer, işaret
 * büyük harf yüksekliğine çıkmaz. Ana sayfaya döner.
 *
 * "Sadece kelime" varyantı 24 Ağustos 2026'da silindi: tek çağıranı alt bilgiydi ve
 * o artık `KelimeMarkasi`'nı basıyor (sahibinin kararı, F1 geri alındı).
 */
type Props = { dil: Dil }

export function MarkaKilidi({ dil }: Props) {
  const s = sozluk(dil)
  return (
    <Link href={yol('ana', dil)} className={stil.kilit}>
      <SisIsareti />
      <span className={stil.ad}>
        <span className={stil.kategori}>{s.ortak.marka.kategori}</span>{' '}
        <span className={stil.isim}>{s.ortak.marka.kisa}</span>
      </span>
    </Link>
  )
}
