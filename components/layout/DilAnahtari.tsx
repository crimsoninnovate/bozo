import Link from 'next/link'
import { sozluk, type Dil } from '@/content'
import { yol, type RotaAnahtari } from '@/lib/site'
import stil from './DilAnahtari.module.css'

type Props = { dil: Dil; aktif: RotaAnahtari }

/**
 * Tasarımda DOM metnini değiştiren bir toggle; burada rota bağlantısına
 * dönüşür. Aktif sayfa değişmez, yalnız dil değişir: `/` <-> `/en/` vb.
 */
export function DilAnahtari({ dil, aktif }: Props) {
  const s = sozluk(dil)
  return (
    <span className={stil.kap}>
      {dil === 'tr' ? (
        <span className={stil.aktif} aria-current="true">
          {s.ortak.dil.tr}
        </span>
      ) : (
        <Link className={stil.pasif} href={yol(aktif, 'tr')} hrefLang="tr" lang="tr">
          {s.ortak.dil.tr}
        </Link>
      )}
      <span className={stil.ayirici} aria-hidden="true">
        {s.ortak.dil.ayirici}
      </span>
      {dil === 'en' ? (
        <span className={stil.aktif} aria-current="true">
          {s.ortak.dil.en}
        </span>
      ) : (
        <Link className={stil.pasif} href={yol(aktif, 'en')} hrefLang="en" lang="en">
          {s.ortak.dil.en}
        </Link>
      )}
    </span>
  )
}
