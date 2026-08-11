import stil from './BolumBasligi.module.css'

type Props = {
  baslik: string
  not?: string
  sag?: React.ReactNode
}

export function BolumBasligi({ baslik, not: notMetni, sag }: Props) {
  return (
    <div className={stil.satir}>
      <h2 className={stil.baslik}>{baslik}</h2>
      {sag ?? (notMetni ? <span className={stil.not}>{notMetni}</span> : null)}
    </div>
  )
}
