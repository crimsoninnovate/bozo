import stil from './TaneDizilimi.module.css'

/**
 * Tasarımda yalnız iki ritim var: altılı ray (büyük, küçük, büyük, büyük,
 * küçük, büyük) ve menü satırının üçlüsü (büyük, küçük, büyük).
 * true = büyük tane.
 */
const RITIMLER = {
  3: [true, false, true],
  6: [true, false, true, true, false, true],
} as const

export type TaneTonu = 'krem' | 'krem80' | 'krem75' | 'krem50' | 'koyu' | 'anahat'

type Props = {
  /** Kaç tane basılacağı. Tasarımda 6 ve 3 dışında bir ray yok. */
  adet?: 3 | 6
  /** Büyük tanenin kenar uzunluğu, px. */
  buyuk: number
  /**
   * Küçük tanenin kenar uzunluğu, px. Tasarım bunu büyükten türetmez:
   * 20/12, 22/13, 9/5, 16/10, 12/7, 13/8, 14/9, 8/5, 7/4 çiftlerinin
   * hepsinin oranı farklı, bu yüzden iki ölçü de ayrı verilir.
   */
  kucuk: number
  /** Taneler arası boşluk (gap), px. */
  bosluk: number
  ton?: TaneTonu
  /** Hero rayı: karelerin arkasından geçen sönen çizgi. */
  cizgi?: boolean
}

/**
 * Köşe yarıçapı tasarımın on rayının hepsinde boydan çıkıyor: büyük tane 10px
 * altında 1px, 10px ve üstünde 2px; küçük tane 9px altında köşesiz, 9px ve
 * üstünde 1px. İki eşiğin farklı olması tasarımın kendi tercihidir (8px büyük
 * tane 1px yarıçap alıyor, 8px küçük tane almıyor), türetme onu birebir izler.
 */
function taneYaricapi(kenar: number, buyukMu: boolean): number {
  if (buyukMu) return kenar < 10 ? 1 : 2
  return kenar < 9 ? 0 : 1
}

export function TaneDizilimi({ adet = 6, buyuk, kucuk, bosluk, ton = 'krem', cizgi = false }: Props) {
  const kapSinif = `${stil.kap} ${stil[ton]}${cizgi ? ` ${stil.cizgiliKap}` : ''}`

  return (
    <span className={kapSinif} style={{ gap: `${bosluk}px` }} aria-hidden="true">
      {cizgi && <span className={stil.cizgi} />}
      {RITIMLER[adet].map((buyukMu, sira) => {
        const kenar = buyukMu ? buyuk : kucuk
        return (
          <span
            key={sira}
            className={`${stil.tane} ${buyukMu ? stil.buyukTane : stil.kucukTane}`}
            style={{
              width: `${kenar}px`,
              height: `${kenar}px`,
              borderRadius: `${taneYaricapi(kenar, buyukMu)}px`,
            }}
          />
        )
      })}
    </span>
  )
}
