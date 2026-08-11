import stil from './CamPanel.module.css'

type Props = {
  opaklik: 0.72 | 0.74 | 0.9
  children: React.ReactNode
}

export function CamPanel({ opaklik, children }: Props) {
  return (
    <div className={stil.panel} style={{ background: `rgba(10, 8, 7, ${opaklik})` }}>
      {children}
    </div>
  )
}
