import Link from 'next/link'
import { SisIsareti } from '@/components/ui/SisIsareti'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './MarkaKilidi.module.css'

/**
 * Yatay kilit, markanın birincil logosu (01-Logo-Final-Karar.md): solda şiş
 * işareti, sağda iki satır kelime markası, üstte küçük ve aralığı açık
 * "Ciğerci", altta büyük "Bozo". Çubuk kelime bloğunun ortasından geçer, işaret
 * büyük harf yüksekliğine çıkmaz. Ana sayfaya döner; üst bar ve 404 aynı kilidi basar.
 */
type Props = {
  dil: Dil
  /** Kararın "sadece kelime" varyantı: alt bilgi. İşaret basılmaz, blok bir kademe küçük. */
  sadeceKelime?: boolean
}

export function MarkaKilidi({ dil, sadeceKelime = false }: Props) {
  const s = sozluk(dil)
  return (
    <Link href={yol('ana', dil)} className={sadeceKelime ? `${stil.kilit} ${stil.kelime}` : stil.kilit}>
      {!sadeceKelime && <SisIsareti />}
      <span className={stil.ad}>
        <span className={stil.kategori}>{s.ortak.marka.kategori}</span>{' '}
        <span className={stil.isim}>{s.ortak.marka.kisa}</span>
      </span>
    </Link>
  )
}
