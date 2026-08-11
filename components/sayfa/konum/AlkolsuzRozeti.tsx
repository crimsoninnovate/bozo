import stil from './AlkolsuzRozeti.module.css'

type Props = { metin: string }

/**
 * Saatler kartının kapanış rozeti. Konum Sayfasi.dc.html:119-122
 *
 * Noktası SABİT: `DurumCipi`'nin noktasıyla karıştırılmamalı, oradaki nabız
 * açık/kapalı durumunu gösterir, buradaki değişmeyen bir işarettir. Tasarım da
 * bu noktaya hiçbir animasyon vermiyor.
 */
export function AlkolsuzRozeti({ metin }: Props) {
  return (
    <p className={stil.rozet}>
      <span aria-hidden="true" className={stil.nokta} />
      <span className={stil.metin}>{metin}</span>
    </p>
  )
}
