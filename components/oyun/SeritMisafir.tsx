import { doldur } from '@/lib/metin'
import { fisSatirlari } from '@/lib/oyun/gorsel'
import type { Goruntu } from '@/lib/oyun/gosterim'
import { BahsisParasi, BosYer, IkramTabaklari, KalktiHalkasi, KorHalkasi, MisafirSilueti } from './SahneMisafir'
import { KarisikSimgesi, TaneSimgesi } from './SahneTane'
import { KalktiIsareti } from './Semboller'
import { Dolgu, Serit, type SeritProps } from './Serit'
import stil from './Saha.module.css'
import misafirStil from './SahneMisafir.module.css'

/* Misafir şeridi (spec tabak §6): üç yer, fiş balonu ve kor halkası, siluet; altında tezgah kenarının paraları. */

const YERLER = [0, 1, 2] as const

type YerProps = Omit<SeritProps, 'goruntu'> & { no: number; yer: Goruntu['misafirler'][number] }

/** Fiş: simgeler, yazı yok; aynı kalem tek simge ve adet; Karışık tek simge. */
function Fis({ yer }: { yer: NonNullable<YerProps['yer']> }) {
  return (
    <span className={misafirStil.fis} data-fis aria-hidden="true">
      {fisSatirlari(yer.fis, yer.karisik).map((s) => (
        <span key={s.tur === 'karisik' ? 'karisik' : s.urun} className={misafirStil.kalem}>
          {s.tur === 'karisik' ? <KarisikSimgesi boy={40} /> : <TaneSimgesi urun={s.urun} boy={40} />}
          {s.tur === 'kalem' && s.adet > 1 && <span className={misafirStil.adet}>{s.adet}</span>}
        </span>
      ))}
    </span>
  )
}

function fisMetni(metin: YerProps['metin'], ad: YerProps['ad'], yer: YerProps['yer']): string {
  if (!yer) return metin.bosYer
  if (yer.odedi) return metin.durum.odedi
  return doldur(metin.durum.istiyor, { fis: yer.fis.map(ad).join(metin.durum.ve) })
}

/** Yer: gerçek düğme, adı iki parçadan (fiş React'ten, sabır `ciz.ts`'ten). Tabak bırakma hedefi. */
function Yer({ no, yer, ad, metin }: YerProps) {
  return (
    <button
      type="button"
      className={misafirStil.yer}
      data-hedef={`m${no}`}
      data-bos={yer ? undefined : ''}
      aria-labelledby={`oyun-m${no}-fis oyun-m${no}-sabir`}
    >
      <span id={`oyun-m${no}-fis`} className={stil.gizli}>{`${metin.misafir} ${no + 1}: ${fisMetni(metin, ad, yer)}`}</span>
      <span id={`oyun-m${no}-sabir`} className={stil.gizli} data-ciz="sabirMetni" data-no={no} />
      <span className={misafirStil.siluet} aria-hidden="true">
        <MisafirSilueti varyant={yer?.varyant ?? 0} />
      </span>
      <span className={misafirStil.ikramlar} aria-hidden="true">
        <IkramTabaklari />
      </span>
      <span className={misafirStil.halka} data-ciz="sabir" data-no={no} aria-hidden="true">
        <KorHalkasi />
      </span>
      <span className={misafirStil.balon} aria-hidden="true">{yer && <Fis yer={yer} />}</span>
      <span className={misafirStil.kalkti} data-kalkti aria-hidden="true">
        <KalktiHalkasi />
        <KalktiIsareti boy={24} />
      </span>
      <Dolgu />
    </button>
  )
}

/** Tezgah kenarı: her yerin önünde bir para noktası; dokunma hedefi. */
function Kenar({ goruntu, metin }: Pick<SeritProps, 'goruntu' | 'metin'>) {
  return (
    <div className={misafirStil.kenar}>
      {YERLER.map((no) => {
        const tutar = goruntu.paralar[no] ?? null
        return (
          <button
            key={no}
            type="button"
            className={misafirStil.paraYeri}
            data-hedef={`p${no}`}
            data-ciz="para"
            data-no={no}
            data-bos={tutar === null ? '' : undefined}
            aria-label={`${metin.bahsis}: ${tutar ?? 0}`}
            aria-hidden={tutar === null ? true : undefined}
            tabIndex={tutar === null ? -1 : undefined}
          >
            <BahsisParasi />
            <Dolgu />
          </button>
        )
      })}
    </div>
  )
}

export function Misafirler({ goruntu, ...kalan }: SeritProps) {
  const kapida = goruntu.kapida > 0 && <span className={stil.kapida}>{kalan.metin.kapida} {goruntu.kapida}</span>
  return (
    <Serit ad="misafir" etiket={kalan.metin.misafir} sag={kapida}>
      <div className={misafirStil.yerler}>
        {YERLER.map((no) =>
          no >= goruntu.acikMisafir ? (
            <div key={no} className={misafirStil.kapaliYer}><BosYer /></div>
          ) : (
            <Yer key={no} no={no} yer={goruntu.misafirler[no] ?? null} {...kalan} />
          ),
        )}
      </div>
      <Kenar goruntu={goruntu} metin={kalan.metin} />
    </Serit>
  )
}
