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

/** Bir rayın üç ölçüsü: büyük tane, küçük tane, aradaki boşluk (px). */
export type TaneOlculeri = {
  buyuk: number
  /**
   * Tasarım küçüğü büyükten türetmez: 20/12, 22/13, 9/5, 16/10, 12/7, 13/8,
   * 14/9, 8/5, 7/4 çiftlerinin hepsinin oranı farklı.
   */
  kucuk: number
  bosluk: number
}

type Props = TaneOlculeri & {
  /** Kaç tane basılacağı. Tasarımda 6 ve 3 dışında bir ray yok. */
  adet?: 3 | 6
  /** 780px altındaki ölçüler; verilmezse masaüstü ölçüsü mobilde de geçerli. */
  mobil?: TaneOlculeri
  ton?: TaneTonu
  /** Hero rayı: karelerin arkasından geçen sönen çizgi. */
  cizgi?: boolean
  /** Küçük (tangerine) taneler kor gibi nefes alır. Yalnız hero rayında. */
  kor?: boolean
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

/** Ölçüleri CSS değişkenine çevirir; mobil set `-m` ekiyle aynı adları taşır. */
function olcuDegiskenleri({ buyuk, kucuk, bosluk }: TaneOlculeri, ek = ''): Record<string, string> {
  return {
    [`--tane-bosluk${ek}`]: `${bosluk}px`,
    [`--tane-buyuk${ek}`]: `${buyuk}px`,
    [`--tane-kucuk${ek}`]: `${kucuk}px`,
    [`--tane-buyuk-r${ek}`]: `${taneYaricapi(buyuk, true)}px`,
    [`--tane-kucuk-r${ek}`]: `${taneYaricapi(kucuk, false)}px`,
  }
}

export function TaneDizilimi({
  adet = 6,
  buyuk,
  kucuk,
  bosluk,
  mobil,
  ton = 'krem',
  cizgi = false,
  kor = false,
}: Props) {
  const kapSinif =
    `${stil.kap} ${stil[ton]}${cizgi ? ` ${stil.cizgiliKap}` : ''}${kor ? ` ${stil.korlu}` : ''}`
  const degiskenler = {
    ...olcuDegiskenleri({ buyuk, kucuk, bosluk }),
    ...(mobil ? olcuDegiskenleri(mobil, '-m') : {}),
  } as React.CSSProperties

  return (
    <span className={kapSinif} style={degiskenler} aria-hidden="true">
      {cizgi && <span className={stil.cizgi} />}
      {RITIMLER[adet].map((buyukMu, sira) => (
        <span key={sira} className={`${stil.tane} ${buyukMu ? stil.buyukTane : stil.kucukTane}`} />
      ))}
    </span>
  )
}
