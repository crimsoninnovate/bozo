import Link from 'next/link'
import { CapaBaglantisi } from './CapaBaglantisi'
import stil from './BolumCipi.module.css'

type Props = {
  /** Aynı belgede `#bolum`, başka sayfada `/menu/#bolum`. */
  href: string
  children: React.ReactNode
}

/**
 * Bölüm çapasına giden küçük çip. İki yüzey: çekmecenin Menü satırının altı ve menü
 * sayfasının hero'su. Aynı belgedeki hedef yumuşak kaydırır (`CapaBaglantisi`),
 * başka sayfadaki rota bağlantısı olur; ayrım `Buton`'daki ile aynı.
 */
export function BolumCipi({ href, children }: Props) {
  if (href.startsWith('#')) {
    return (
      <CapaBaglantisi href={href} className={stil.cip}>
        {children}
      </CapaBaglantisi>
    )
  }
  return (
    <Link href={href} className={stil.cip}>
      {children}
    </Link>
  )
}
