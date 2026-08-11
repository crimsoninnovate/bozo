import stil from './IkramCipi.module.css'

type Props = {
  /** İkramın adı, ör. "Lebeni çorbası". */
  ad: string
  /** Alt satırdaki içerik notu, ör. "nohut, yoğurt, kekik". */
  detay: string
}

/**
 * Ana sayfanın ikram çipi: kutulu, iki parçalı. Menü sayfasının tek kelimelik
 * "ikram" etiketiyle (Cip tur="ikram") aynı ad altında toplanmıştı; ikisi ayrı
 * şeyler olduğu için ayrıldı. Ana Sayfa Alternatif.dc.html:227-234
 */
export function IkramCipi({ ad, detay }: Props) {
  return (
    <span className={stil.cip}>
      <span className={stil.ad}>{ad}</span>
      <span className={stil.detay}>{detay}</span>
    </span>
  )
}
