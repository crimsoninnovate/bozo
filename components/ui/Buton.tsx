import Link from 'next/link'
import stil from './Buton.module.css'

export type ButonTuru = 'birincil' | 'ikincil' | 'koyu' | 'koyuOutline'
/** sm 14.5px, md 15.5px, lg 16px, xl 16.5px: tasarımın dört gövde ölçüsü. */
export type ButonBoyu = 'sm' | 'md' | 'lg' | 'xl'

type Props = {
  tur: ButonTuru
  boy: ButonBoyu
  href: string | null
  children: React.ReactNode
  disabled?: boolean
  hariciMi?: boolean
}

const CERCEVELI: ReadonlySet<ButonTuru> = new Set<ButonTuru>(['ikincil', 'koyuOutline'])

export function Buton({ tur, boy, href, children, disabled = false, hariciMi = false }: Props) {
  const sinif = `${stil.taban} ${stil[tur]} ${stil[boy]}${CERCEVELI.has(tur) ? ` ${stil.cerceveli}` : ''}`

  if (disabled || href === null) {
    return (
      <span className={`${sinif} ${stil.pasif}`} aria-disabled="true">
        {children}
      </span>
    )
  }
  // Sayfa içi çapa (#ocaktan gibi) yönlendirme değil, aynı belgede kaydırmadır;
  // Link'in ön yükleme ve yönlendirme mantığına sokmadan düz <a> ile basılır.
  if (hariciMi || href.startsWith('#')) {
    return (
      <a className={sinif} href={href} rel={hariciMi ? 'noopener' : undefined}>
        {children}
      </a>
    )
  }
  return (
    <Link className={sinif} href={href}>
      {children}
    </Link>
  )
}
