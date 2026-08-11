import stil from './BolumBasligi.module.css'

/**
 * genis: ana sayfanın panel içi bölüm başlığı (Ana:171).
 * orta:  hikaye panelinin başlığı, aynı tipografi bir adım küçük (Hikaye:92).
 * sayfa: menü sayfasının bölüm başlıkları, daha sıkı satır ve iz (Menu:86, 201, 234).
 */
export type BaslikOlcegi = 'genis' | 'orta' | 'sayfa'

/**
 * Notun tipografisi her yerde 400 15px/1.5, yalnız krem alfası değişiyor:
 * Ana Sayfa Ocaktan .66 (Ana:173), Menü İkramlar .72 (Menu:203), Menü
 * İçecekler .64 (Menu:236).
 */
export type NotTonu = 'krem64' | 'krem66' | 'krem72'

type Props = {
  baslik: string
  not?: string
  notTonu?: NotTonu
  /** Not yerine geçen serbest öge, ör. tane rayı. */
  sag?: React.ReactNode
  olcek?: BaslikOlcegi
  /** Menü "İkramlar" başlığının turuncu alt çizgisi. Menu Sayfasi.dc.html:201 */
  vurguCizgi?: boolean
}

export function BolumBasligi({
  baslik,
  not: notMetni,
  notTonu = 'krem66',
  sag,
  olcek = 'genis',
  vurguCizgi = false,
}: Props) {
  const sinif = `${stil.satir} ${stil[olcek]}${vurguCizgi ? ` ${stil.vurgu}` : ''}`

  return (
    <div className={sinif}>
      <h2 className={stil.baslik}>{baslik}</h2>
      {sag ?? (notMetni ? <span className={`${stil.not} ${stil[notTonu]}`}>{notMetni}</span> : null)}
    </div>
  )
}
