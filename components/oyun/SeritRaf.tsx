import { RafTepsisi } from './SahneTezgah'
import { Dolgu, Serit, type SeritProps } from './Serit'
import tezgahStil from './SahneTezgah.module.css'

/** Raf: dokunma kaynağı; istenen ürünün kenarı nabız atar (raf rehberi). */
export function Raf({ goruntu, ad, metin }: SeritProps) {
  const ocakDolu = goruntu.ocak.slice(0, goruntu.acikOcak).every(Boolean)
  return (
    <Serit ad="raf" etiket={metin.raf}>
      <div className={tezgahStil.ceviz} data-pasif={ocakDolu ? '' : undefined}>
        <svg className={tezgahStil.damar} aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#fWood)" />
        </svg>
        {goruntu.raf.map((urun) => (
          <button
            key={urun}
            type="button"
            className={tezgahStil.rafUrun}
            data-hedef={urun}
            data-istenen={goruntu.rafIstenen.includes(urun) ? '' : undefined}
          >
            <RafTepsisi urun={urun} />
            <span>{ad(urun)}</span>
            <Dolgu />
          </button>
        ))}
      </div>
      <span className={tezgahStil.rafAlt} aria-hidden="true" />
    </Serit>
  )
}
