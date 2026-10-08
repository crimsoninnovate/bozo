import type { Goruntu } from '@/lib/oyun/gosterim'
import type { Urun } from '@/lib/oyun/tipler'
import { AcikYayik, RafTepsisi, TezgahTabagi, TezgahUrunu } from './SahneTezgah'
import { TezgahDoluIsareti } from './Semboller'
import { DugmeKatmanlari, Serit, type SeritProps } from './Seritler'
import stil from './Saha.module.css'
import tezgahStil from './SahneTezgah.module.css'

/* Tezgah ve raf şeritleri (spec §3): mermer slab üstünde dört tabak ve yayık, ceviz raf. */

const YUVALAR = [0, 1, 2, 3] as const

type KalemProps = {
  no: number
  kalem: NonNullable<Goruntu['tezgah'][number]>
  etiket: string
  vurgula: TezgahProps['vurgula']
}

function TezgahKalemi({ no, kalem, etiket, vurgula }: KalemProps) {
  return (
    <button
      type="button"
      className={tezgahStil.tezgahKalem}
      data-kalite={kalem.kalite ?? 'ayran'}
      data-urun={kalem.urun}
      aria-label={etiket}
      onClick={(e) => vurgula(kalem.urun, e.currentTarget)}
    >
      <svg viewBox="0 0 80 60" className={tezgahStil.urun} aria-hidden="true">
        <TezgahUrunu urun={kalem.urun} />
      </svg>
      {kalem.kalite && <span className={tezgahStil.soguma} data-ciz="soguma" data-no={no} aria-hidden="true" />}
      <span className={stil.dolgu} data-dolgu aria-hidden="true" />
    </button>
  )
}

type TezgahProps = SeritProps & { vurgula: (u: Urun, el: HTMLElement) => void }

export function Tezgah({ goruntu, ad, dokun, metin, vurgula }: TezgahProps) {
  const dolu = goruntu.tezgah.every(Boolean) && (
    <span className={tezgahStil.tezgahDolu} aria-hidden="true">
      <TezgahDoluIsareti boy={24} />
    </span>
  )
  return (
    <Serit ad="tezgah" etiket={metin.tezgah} sag={dolu}>
      <div className={tezgahStil.mermer} data-tezgah>
        <svg className={tezgahStil.damar} aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#fMarble)" />
        </svg>
        <div className={tezgahStil.slotlar}>
          {YUVALAR.map((no) => {
            const kalem = goruntu.tezgah[no]
            return (
              <span key={no} className={tezgahStil.tezgahYuva} data-tezgah-yuva={no}>
                <TezgahTabagi />
                {kalem && <TezgahKalemi no={no} kalem={kalem} etiket={`${metin.tezgah}: ${ad(kalem.urun)}`} vurgula={vurgula} />}
              </span>
            )
          })}
          <button
            type="button"
            className={tezgahStil.yayik}
            data-hedef="ayran"
            data-ciz="ayran"
            data-durum={goruntu.ayran}
            aria-label={ad('ayran')}
            onClick={(e) => dokun('ayran', e.currentTarget)}
          >
            <AcikYayik />
            <span className={tezgahStil.yayikDolum} aria-hidden="true" />
            <DugmeKatmanlari />
          </button>
        </div>
      </div>
      <span className={tezgahStil.pirincKenar} aria-hidden="true" />
    </Serit>
  )
}

export function Raf({ goruntu, ad, dokun, metin }: SeritProps) {
  const ocakDolu = goruntu.ocak.slice(0, goruntu.acikOcak).every(Boolean)
  return (
    <Serit ad="raf" etiket={metin.raf}>
      <div className={tezgahStil.ceviz} data-pasif={ocakDolu ? '' : undefined}>
        <svg className={tezgahStil.damar} aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#fWood)" />
        </svg>
        {goruntu.raf.map((urun) => (
          <button key={urun} type="button" className={tezgahStil.rafUrun} data-hedef={urun} onClick={(e) => dokun(urun, e.currentTarget)}>
            <RafTepsisi urun={urun} />
            <span>{ad(urun)}</span>
            <DugmeKatmanlari />
          </button>
        ))}
      </div>
      <span className={tezgahStil.rafAlt} aria-hidden="true" />
    </Serit>
  )
}
