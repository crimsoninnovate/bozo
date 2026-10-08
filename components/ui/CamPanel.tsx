import stil from './CamPanel.module.css'

/** genis 48px, orta 44px, dar 40px: tasarımın üç panel dolgusu. yok: dolguyu içerik verir (oyun sahası). */
export type PanelDolgusu = 'genis' | 'orta' | 'dar' | 'yok'

const DOLGU_SINIFI: Record<PanelDolgusu, string | undefined> = {
  genis: stil.dolguGenis,
  orta: stil.dolguOrta,
  dar: stil.dolguDar,
  yok: undefined,
}

type Props = {
  opaklik: 0.72 | 0.74
  dolgu?: PanelDolgusu
  /** 'sayfa': tam genişlik, 1180px'de durur (Ana:170, Hikaye:91). */
  genislik?: 'serbest' | 'sayfa'
  /**
   * Arkaplan bulanıklığı. Tasarımda yalnız Ana Sayfa ve Hikaye panellerinde var;
   * Menü ve Konum'un panelleri bulanıklık taşımıyor, onlar bunu false geçer.
   */
  bulanik?: boolean
  /**
   * Panelin sayfa ızgarasındaki yeri (flex tabanı, min-width, iç yerleşim).
   * Bu değerler her çağrıda farklı ve sayfanın kendi düzenine ait; panel
   * yalnız zemini, kenarlığı, bulanıklığı ve dolgusunu sahiplenir.
   */
  className?: string
  children: React.ReactNode
}

export function CamPanel({
  opaklik,
  dolgu = 'genis',
  genislik = 'serbest',
  bulanik = true,
  className,
  children,
}: Props) {
  const zeminSinif = opaklik === 0.72 ? stil.acik : stil.orta
  const sinif = [
    stil.panel,
    zeminSinif,
    DOLGU_SINIFI[dolgu],
    genislik === 'sayfa' ? stil.sayfaEni : '',
    bulanik ? stil.bulanik : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={sinif}>{children}</div>
}
