import type { Goruntu } from '@/lib/oyun/gosterim'
import type { Eslikci } from '@/lib/oyun/tipler'
import { EslikciGlifi } from './SahneTane'
import { BakirTabak, CopKovasi, Kase, TabakKalemleri } from './SahneTezgah'
import { Dolgu, Serit, type SeritProps } from './Serit'
import tezgahStil from './SahneTezgah.module.css'

/* Tabak şeridi (spec tabak §6): solda çöp (hedef), ortada iki tabak (hedef ve kaynak), sağda kaseler (kaynak). */

const TABAKLAR = [0, 1] as const

type TabakProps = Omit<SeritProps, 'goruntu'> & { no: number; kalemler: Goruntu['tabaklar'][number]; el: Goruntu['el'] }

function Tabak({ no, kalemler, el, ad, metin }: TabakProps) {
  const elde = el?.tur === 'tabak' && el.no === no
  const icerik = kalemler.length ? kalemler.map((k) => ad(k.urun)).join(', ') : metin.durum.bos
  return (
    <button
      type="button"
      className={tezgahStil.tabakYeri}
      data-hedef={`t${no}`}
      aria-label={`${metin.tabak} ${no + 1}: ${icerik}${elde ? `, ${metin.durum.elde}` : ''}`}
    >
      <span className={tezgahStil.tabakGovde} data-tasinir data-elde={elde ? '' : undefined} aria-hidden="true">
        <BakirTabak><TabakKalemleri kalemler={kalemler} /></BakirTabak>
      </span>
      <Dolgu />
    </button>
  )
}

function KaseDugmesi({ urun, istenen, elde, ad, metin }: { urun: Eslikci; istenen: boolean; elde: boolean } & Pick<SeritProps, 'ad' | 'metin'>) {
  return (
    <button
      type="button"
      className={tezgahStil.kaseYeri}
      data-hedef={urun}
      data-istenen={istenen ? '' : undefined}
      aria-label={`${metin.kase}: ${ad(urun)}${elde ? `, ${metin.durum.elde}` : ''}`}
    >
      <Kase urun={urun} />
      <svg viewBox="-12 -12 24 24" className={tezgahStil.kaseGlif} data-tasinir data-elde={elde ? '' : undefined} aria-hidden="true">
        <EslikciGlifi urun={urun} />
      </svg>
      <Dolgu />
    </button>
  )
}

export function Tabaklar({ goruntu, ...kalan }: SeritProps) {
  return (
    <Serit ad="tabak" etiket={kalan.metin.tabak}>
      <div className={tezgahStil.tabakSeridi}>
        <button type="button" className={tezgahStil.copYeri} data-hedef="cop" aria-label={kalan.metin.cop}>
          <CopKovasi />
          <Dolgu />
        </button>
        {TABAKLAR.map((no) => (
          <Tabak key={no} no={no} kalemler={goruntu.tabaklar[no] ?? []} el={goruntu.el} {...kalan} />
        ))}
        {goruntu.kaseler.map((urun) => (
          <KaseDugmesi
            key={urun}
            urun={urun}
            istenen={goruntu.kaseIstenen.includes(urun)}
            elde={goruntu.el?.tur === 'eslikci' && goruntu.el.urun === urun}
            {...kalan}
          />
        ))}
      </div>
    </Serit>
  )
}
