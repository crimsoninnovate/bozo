import Link from 'next/link'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './Rozet.module.css'

/**
 * Rozet logo (BozoLogo-2.svg, 21 Ağustos 2026 revizyonu), markanın kendisi. Varlık
 * DİŞİ (koyu zemin) versiyondur. Zeminden ayrılmayı en dış altın halka sağlıyor,
 * kırmızı değil: halka #D5862E, bordo zemin üstünde 6.05:1, siyahta 6.68:1.
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
      <img src="/marka/rozet.svg" alt="" width={1749} height={1978} decoding="async" />
    </Link>
  )
}
