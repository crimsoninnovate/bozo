import Link from 'next/link'
import stil from './Buton.module.css'

type Props = {
  tur: 'birincil' | 'ikincil' | 'koyu' | 'koyuOutline'
  boy: 'sm' | 'md' | 'lg'
  href: string | null
  children: React.ReactNode
  disabled?: boolean
  hariciMi?: boolean
}

export function Buton({ tur, boy, href, children, disabled = false, hariciMi = false }: Props) {
  const sinif = `${stil.taban} ${stil[tur]} ${stil[boy]}`

  if (disabled || href === null) {
    return (
      <span className={`${sinif} ${stil.pasif}`} aria-disabled="true">
        {children}
      </span>
    )
  }
  if (hariciMi) {
    return (
      <a className={sinif} href={href} rel="noopener">
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
