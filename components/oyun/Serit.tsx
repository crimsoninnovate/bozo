import type { Sozluk } from '@/content'
import type { Goruntu } from '@/lib/oyun/gosterim'
import type { Kalem } from '@/lib/oyun/tipler'
import { seritOdagi, seritTusu } from './odak'
import stil from './Saha.module.css'

/*
 * Şerit kabı ve ortak tipler. Dört şerit `SeritMisafir`, `SeritOcak`, `SeritTabak`, `SeritRaf`;
 * düğmelerde onClick yok: işaretçi ve klavye kökten `useSurukleme` ile gelir. React yalnız yapı
 * değişince çizer; her karedeki değerler `ciz.ts`'ten `data-ciz` öğelerine yazılır.
 */

export type Metin = Sozluk['oyun']
export type SeritProps = { goruntu: Goruntu; ad: (k: Kalem) => string; metin: Metin }

/** Dokunma dolgusu: `tepkiler.ts` 120 ms'lik opaklık animasyonunu bunda oynatır. */
export function Dolgu() {
  return <span className={stil.dolgu} data-dolgu aria-hidden="true" />
}

type SeritKabi = { sinif?: string; ad: string; etiket: string; ciz?: string; sag?: React.ReactNode; children: React.ReactNode }

/** Şerit: görünür etiket satırı (sağında isteğe bağlı çip), tek Tab durağı, ok tuşları içeride. */
export function Serit({ sinif, ad, etiket, ciz, sag, children }: SeritKabi) {
  const id = `oyun-serit-${ad}`
  return (
    <section className={sinif} data-serit data-ciz={ciz} aria-labelledby={id} onKeyDown={seritTusu} onFocus={seritOdagi}>
      <span className={stil.etiketSatiri}>
        <span id={id} className={stil.etiket}>{etiket}</span>
        {sag}
      </span>
      {children}
    </section>
  )
}
