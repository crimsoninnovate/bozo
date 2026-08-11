import stil from './Cip.module.css'

/**
 * Tasarımın tek içerikli çip aileleri. İki satırlı ikram kartı bu ailede
 * değil, ayrı bir bileşendir: `IkramCipi`.
 */
export type CipTuru = 'outline' | 'dolu' | 'olcu' | 'ikram' | 'komsuluk' | 'poi'

type Props = {
  tur: CipTuru
  children: React.ReactNode
}

export function Cip({ tur, children }: Props) {
  return <span className={`${stil.taban} ${stil[tur]}`}>{children}</span>
}
