import Link from 'next/link'
import { CapaBaglantisi } from './CapaBaglantisi'
import { OkAsagiIkon, OkSagIkon } from './Ikonlar'
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
  /**
   * Etiketin solunda duran ikon: butonun NE yaptığını söyler. Yalnız eylem
   * butonlarında (ara, WhatsApp, yol tarifi), gezinme butonlarında değil.
   */
  ikon?: React.ReactNode
  /**
   * Etiketin sağında duran ok: butonun NEREYE gittiğini söyler. Yalnız gezinme
   * butonlarında. Yönü hedeften türer: sayfaya giden sağa, sayfa içi çapaya
   * giden aşağı.
   */
  ok?: boolean
}

const CERCEVELI: ReadonlySet<ButonTuru> = new Set<ButonTuru>(['ikincil', 'koyuOutline'])

/**
 * İki katmanlı işaret dili (sahibinin kararı, 13 Ağustos 2026): baştaki ikon
 * ağırlık katar, sondaki ok yol gösterir. İkisi aynı butonda kullanılmaz,
 * yoksa fark kaybolur ve her buton süslenmiş gibi okunur.
 */
export function Buton({
  tur,
  boy,
  href,
  children,
  disabled = false,
  hariciMi = false,
  ikon,
  ok = false,
}: Props) {
  const sinif = `${stil.taban} ${stil[tur]} ${stil[boy]}${CERCEVELI.has(tur) ? ` ${stil.cerceveli}` : ''}`
  const capaMi = typeof href === 'string' && href.startsWith('#')

  const govde = (
    <>
      {ikon}
      {children}
      {ok && (
        <span className={`${stil.ok} ${capaMi ? stil.okAsagi : ''}`}>
          {capaMi ? <OkAsagiIkon boy={17} /> : <OkSagIkon boy={17} />}
        </span>
      )}
    </>
  )

  if (disabled || href === null) {
    return (
      <span className={`${sinif} ${stil.pasif}`} aria-disabled="true">
        {govde}
      </span>
    )
  }
  // Sayfa içi çapa (#ocaktan gibi) yönlendirme değil, aynı belgede kaydırmadır;
  // Link'in ön yükleme ve yönlendirme mantığına sokulmaz. Yumuşak kaydırmayı
  // `CapaBaglantisi` taşır, o yüzden yalnız çapa butonları istemciye iner.
  if (capaMi) {
    return (
      <CapaBaglantisi href={href} className={sinif}>
        {govde}
      </CapaBaglantisi>
    )
  }
  if (hariciMi) {
    return (
      <a className={sinif} href={href} rel="noopener">
        {govde}
      </a>
    )
  }
  return (
    <Link className={sinif} href={href}>
      {govde}
    </Link>
  )
}
