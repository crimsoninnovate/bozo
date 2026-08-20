import Link from 'next/link'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './Rozet.module.css'

/**
 * Rozet logo (CigerciBozo-Logo-6), 20 Ağustos 2026 kararıyla üst barın markası.
 * Varlık DİŞİ (koyu zemin) versiyondur, CigerciBozo-Logo-6-Koyu-2. Pozitif dosya
 * kullanılamaz: orada "Ciğerci" lacivert ve diskin dışında, --zemin üstünde 1.04:1.
 */
type Props = { dil: Dil; boy?: 'bar' | 'ic' }

export function Rozet({ dil, boy = 'bar' }: Props) {
  const s = sozluk(dil)
  return (
    <Link
      href={yol('ana', dil)}
      className={`${stil.rozet} ${boy === 'ic' ? stil.ic : stil.bar}`}
      aria-label={s.ortak.marka.ad}
    >
      {/* alt boş: erişilebilir adı bağlantı taşıyor, görsel dekoratif kalır. */}
      <img src="/marka/rozet.webp" alt="" width={304} height={320} decoding="async" />
    </Link>
  )
}
