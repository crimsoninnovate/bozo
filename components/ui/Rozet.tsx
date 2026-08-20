import Link from 'next/link'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './Rozet.module.css'

/**
 * Rozet logo (BozoLogo.svg), markanın kendisi. Varlık DİŞİ (koyu zemin)
 * versiyondur; pozitif dosya kullanılamaz, orada "Ciğerci" lacivert ve diskin
 * dışında, yani --zemin üstünde 1.04:1.
 */
type Props = { dil: Dil; boy?: 'bar' | 'daralmis' | 'cekmece' }

export function Rozet({ dil, boy = 'bar' }: Props) {
  const s = sozluk(dil)
  return (
    <Link
      href={yol('ana', dil)}
      className={`${stil.rozet} ${stil[boy]}`}
      aria-label={s.ortak.marka.ad}
    >
      {/* alt boş: erişilebilir adı bağlantı taşıyor, görsel dekoratif kalır. */}
      <img src="/marka/rozet.svg" alt="" width={187} height={199} decoding="async" />
    </Link>
  )
}
