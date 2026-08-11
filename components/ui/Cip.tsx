import stil from './Cip.module.css'

type Props = {
  tur: 'outline' | 'dolu' | 'ikram'
  children: React.ReactNode
}

export function Cip({ tur, children }: Props) {
  return <span className={`${stil.taban} ${stil[tur]}`}>{children}</span>
}
