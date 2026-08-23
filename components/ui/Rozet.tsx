import Link from 'next/link'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './Rozet.module.css'

/**
 * Rozet logo (BozoLogo-Final-Aug23.svg), markanın kendisi. Varlık DİŞİ (koyu zemin)
 * versiyondur, zemin plakası yok. Zeminden ayrılmayı en dış halka sağlıyor, kırmızı
 * değil: halka #EC8817, bordo zemin üstünde 6.73:1.
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
      <img src="/marka/rozet.svg" alt="" width={1719} height={1965} decoding="async" />
    </Link>
  )
}
