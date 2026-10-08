import Link from 'next/link'
import { sozluk, type Dil } from '@/content'
import { yol } from '@/lib/site'
import stil from './Rozet.module.css'

/**
 * Rozet logo (Bozo.svg, 24 Ağustos 2026), markanın kendisi. Varlık DİŞİ (koyu zemin)
 * versiyondur, zemin plakası yok. Zeminden ayrılmayı en dış halka sağlıyor, kırmızı
 * değil: halka #EC8817, bordo zemin üstünde 7.14:1.
 */
type Props = { dil: Dil; boy?: 'bar' | 'daralmis' | 'cekmece' }

export const ROZET = '/marka/rozet.svg'

export function Rozet({ dil, boy = 'bar' }: Props) {
  const s = sozluk(dil)
  const maske = `url(${ROZET})`
  return (
    <Link
      href={yol('ana', dil)}
      className={`${stil.rozet} ${stil[boy]}`}
      aria-label={s.ortak.marka.ad}
    >
      <span className={stil.cerceve}>
        {/* Gölge ayrı katman: `<img>`'deki ya da atasındaki filter LCP alanını
            6.612'den 36.524 px²'ye şişiriyordu (ölçüldü 8 Ekim 2026). */}
        <span className={stil.golge} aria-hidden="true">
          <span style={{ maskImage: maske, WebkitMaskImage: maske }} />
        </span>
        {/* alt boş: erişilebilir adı bağlantı taşıyor, görsel dekoratif kalır. */}
        <img src={ROZET} alt="" width={1748} height={1999} decoding="async" />
      </span>
    </Link>
  )
}
