import { sozluk, type Dil } from '@/content'
import stil from './YapimciIsareti.module.css'

type Props = { dil: Dil }

const YAPIMCI_URL = 'https://crimsoninnovate.com'

/**
 * Siteyi yapan şirketin işareti, telif şeridinin sağ ucunda (sahibinin kararı,
 * 24 Ağustos 2026). Yol `currentColor` ile çizilir, rengi bağlantıdan gelir:
 * telif metniyle aynı `--krem-82`.
 */
export function YapimciIsareti({ dil }: Props) {
  const s = sozluk(dil)

  return (
    <a
      className={stil.baglanti}
      href={YAPIMCI_URL}
      rel="noopener"
      aria-label={s.ortak.erisim.yapimci}
    >
      <svg className={stil.isaret} viewBox="-20 -20 557.22 524.13" aria-hidden="true">
        <path
          d="M263.98,15.08c335.55,0-53.9,674.54-224.35,379.29-170.79-295.82,608.75-295.82,437.96,0C304.49,691.51-85.12,6.31,263.98,15.08Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="30"
          strokeMiterlimit="10"
        />
      </svg>
    </a>
  )
}
