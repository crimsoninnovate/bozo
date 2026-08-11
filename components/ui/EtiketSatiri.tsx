import stil from './EtiketSatiri.module.css'

/**
 * Küçük tangerine kare + tek satırlık üstyazı.
 *
 * Tasarımda tam iki kullanım var ve ikisi de aynı cümleyi taşıyor
 * ("Engin Çağlar, her gün ocağın başında"), ama ölçüleri ayrışıyor:
 *
 *   sayfa  Hikaye:64-66   500 15px/1    krem .74   (sayfa/hikaye/Acilis.tsx)
 *   kart   Ana:272-274    500 14.5px/1  krem .72   (sayfa/ana/Bozo.tsx)
 *
 * Kare (11x11, 1px yarıçap, tangerine) ve satırın kendisi (flex, gap 12px)
 * ikisinde birebir aynı; ayrışan yalnız punto ve alfa. Fark çoğunluğa
 * normalize edilmedi çünkü açıklanabilir: `sayfa` sayfanın en üstünde, 104px'e
 * kadar çıkan bir H1'in üstünde duruyor; `kart` bir cam kartın içinde, 54px'lik
 * bir H2'nin üstünde. Aynı öge iki farklı ölçekte, `Buton`'un boy adımlarıyla
 * aynı mantık.
 *
 * Dış boşluk bileşene ait değil: Hikaye kullanımı `margin-bottom:26px` taşır,
 * Ana Sayfa kullanımı taşımaz (onun kabı `gap:24px` veriyor). Konumlandırmayı
 * `className` ile çağıran verir, `CamPanel` ile aynı ayrım.
 */
export type EtiketOlcegi = 'sayfa' | 'kart'

type Props = {
  olcek?: EtiketOlcegi
  className?: string
  children: React.ReactNode
}

export function EtiketSatiri({ olcek = 'sayfa', className, children }: Props) {
  const sinif = [stil.satir, stil[olcek], className].filter(Boolean).join(' ')

  return (
    <p className={sinif}>
      <span aria-hidden="true" className={stil.kare} />
      {children}
    </p>
  )
}
