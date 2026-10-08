import type { Sozluk } from '@/content'
import { KorKivilcimi } from '@/components/ember/KorKivilcimi'
import { servisEdilenler } from '@/lib/oyun/gorsel'
import type { Goruntu } from '@/lib/oyun/gosterim'
import type { Hedef, Urun } from '@/lib/oyun/tipler'
import { seritOdagi, seritTusu } from './odak'
import type { Ses } from './useSes'
import {
  AcikYayik,
  BakirMasrapa,
  Bostana,
  CevirmeIsareti,
  DuraklatIsareti,
  KalktiIsareti,
  KarisikFis,
  KomboRozeti,
  KorHalkasi,
  KorNoktasi,
  Lebeni,
  OcakSonerIsareti,
  OcakYatagi,
  PorsiyonRozeti,
  SesIsareti,
  SofraPlakasi,
  SumakliSogan,
  UrunSimgesi,
  UrunSisi,
  YanikSis,
  Yesillik,
} from './Semboller'
import stil from './Saha.module.css'

/*
 * Sahanın beş şeridi: HUD, sofralar, ocak, tezgah, raf (spec §3). React yalnız yapı
 * değişince çizer; her karedeki değerler `ciz.ts`'ten `data-ciz` öğelerine yazılır,
 * anlık tepkiler `tepkiler.ts`'ten gizli bekleyen öğeleri oynatır.
 */

export type Metin = Sozluk['oyun']
export type SeritProps = {
  goruntu: Goruntu
  ad: (u: Urun) => string
  dokun: (hedef: Hedef, el: HTMLElement) => void
  metin: Metin
}

const YUVALAR = [0, 1, 2, 3] as const
const TABAKLAR = [Lebeni, Bostana, Yesillik, SumakliSogan]

/** Her düğmenin son iki katmanı: ilk turun kor noktası ve dokunma dolgusu. */
function DugmeKatmanlari() {
  return (
    <>
      <span className={stil.ipucu} aria-hidden="true">
        <KorNoktasi boy={18} />
      </span>
      <span className={stil.dolgu} data-dolgu aria-hidden="true" />
    </>
  )
}

type SeritKabi = { sinif: string | undefined; etiket: string; ciz?: string; children: React.ReactNode }

/** Şerit sarmalayıcı: tek Tab durağı, ok tuşları içeride (`odak.ts`). */
function Serit({ sinif, etiket, ciz, children }: SeritKabi) {
  return (
    <section
      className={sinif}
      data-serit
      data-ciz={ciz}
      aria-label={etiket}
      onKeyDown={seritTusu}
      onFocus={seritOdagi}
    >
      {children}
    </section>
  )
}

type HudProps = { metin: Metin; duraklat: () => void; ses: Ses }

export function Hud({ metin, duraklat, ses }: HudProps) {
  return (
    <header className={stil.hud}>
      <span className={stil.saat}>
        <span className={stil.gizli}>{metin.saat} </span>
        <span data-ciz="saat">21:00</span>
      </span>
      <span className={stil.puan}>
        <span className={stil.gizli}>{metin.puan} </span>
        <span data-ciz="puan">0</span>
      </span>
      <span className={stil.kombo} data-ciz="kombo" data-rozet="kombo">
        <KomboRozeti />
        <span className={stil.gizli}>{metin.kombo} </span>
        <span data-kombo>×1</span>
      </span>
      <span className={stil.porsiyon} data-rozet="porsiyon" aria-hidden="true">
        <PorsiyonRozeti />
        <span>12</span>
      </span>
      <button
        type="button"
        className={stil.hudDugme}
        aria-label={metin.ses}
        aria-pressed={ses.acik}
        onClick={ses.degistir}
      >
        <SesIsareti boy={22} acik={ses.acik} />
      </button>
      <button type="button" className={stil.hudDugme} aria-label={metin.duraklat} onClick={duraklat}>
        <DuraklatIsareti boy={22} />
      </button>
      <span className={stil.geceRayi} data-ciz="gece" aria-hidden="true">
        <span className={stil.geceUcu}>
          <OcakSonerIsareti boy={14} />
        </span>
      </span>
    </header>
  )
}

type SofraProps = Omit<SeritProps, 'goruntu'> & {
  no: number
  sofra: Goruntu['sofralar'][number]
  vurgu: Urun | null
}

function sofraEtiketi(metin: Metin, no: number, sofra: SofraProps['sofra'], ad: SofraProps['ad']): string {
  if (!sofra) return `${metin.sofra} ${no + 1}: ${metin.bosSofra}`
  const durum = sofra.kurulu ? `, ${metin.kurulu}` : ''
  return `${metin.sofra} ${no + 1}${durum}: ${sofra.kalan.map(ad).join(', ')}`
}

function Sofra({ no, sofra, ad, dokun, metin, vurgu }: SofraProps) {
  const servis = sofra ? servisEdilenler(sofra.fis, sofra.kalan) : []
  return (
    <button
      type="button"
      className={stil.sofra}
      data-hedef={`s${no}`}
      data-bos={sofra ? undefined : ''}
      data-kurulu={sofra?.kurulu ? '' : undefined}
      data-vurgu={sofra && vurgu && sofra.kalan.includes(vurgu) ? '' : undefined}
      aria-label={sofraEtiketi(metin, no, sofra, ad)}
      onClick={(e) => dokun(`s${no}` as Hedef, e.currentTarget)}
    >
      <SofraPlakasi />
      <span className={stil.halka} data-ciz="sabir" data-no={no} aria-hidden="true">
        <KorHalkasi />
      </span>
      <span className={stil.tabaklar} aria-hidden="true">
        {TABAKLAR.map((Tabak, i) => (
          <span key={i} data-tabak>
            <Tabak boy={14} />
          </span>
        ))}
      </span>
      <span className={stil.fis} data-fis aria-hidden="true">
        {sofra?.karisik && <KarisikFis boy={16} />}
        {sofra?.fis.map((u, i) => (
          <span key={i} className={stil.kalem} data-servis={servis[i] ? '' : undefined}>
            <UrunSimgesi urun={u} boy={16} />
          </span>
        ))}
      </span>
      <span className={stil.kalkti} data-kalkti aria-hidden="true">
        <KalktiIsareti boy={28} />
      </span>
      <DugmeKatmanlari />
    </button>
  )
}

export function Sofralar({ goruntu, vurgu, ...kalan }: SeritProps & { vurgu: Urun | null }) {
  return (
    <Serit sinif={stil.sofralar} etiket={kalan.metin.sofra}>
      {YUVALAR.map((no) =>
        no >= goruntu.acikSofra ? (
          <div key={no} className={stil.kapali} />
        ) : (
          <Sofra key={no} no={no} sofra={goruntu.sofralar[no] ?? null} vurgu={vurgu} {...kalan} />
        ),
      )}
      {goruntu.kapida > 0 && (
        <span className={stil.kapida}>
          {kalan.metin.kapida} {goruntu.kapida}
        </span>
      )}
    </Serit>
  )
}

type YuvaProps = Omit<SeritProps, 'goruntu'> & { no: number; sis: Goruntu['ocak'][number] }

function Yuva({ no, sis, ad, dokun, metin }: YuvaProps) {
  const ray = sis
    ? ({
        '--centik': sis.centik,
        '--pencere': sis.pencere,
        '--kivam': sis.kivam,
        '--bant': sis.bant,
      } as React.CSSProperties)
    : undefined
  return (
    <button
      type="button"
      className={stil.yuva}
      data-hedef={`o${no}`}
      data-ciz="ocak"
      data-no={no}
      data-cevirme={sis?.cevirme}
      aria-label={`${metin.ocak} ${no + 1}${sis ? `: ${ad(sis.urun)}` : ''}`}
      style={ray}
      onClick={(e) => dokun(`o${no}` as Hedef, e.currentTarget)}
    >
      <span className={stil.sisKap} aria-hidden="true">
        {sis && (
          <span className={stil.sis} data-sis>
            <UrunSisi urun={sis.urun} />
          </span>
        )}
        <span className={stil.yanik} data-yanik>
          <YanikSis />
        </span>
        <span className={stil.cevir}>
          <CevirmeIsareti boy={18} />
        </span>
        <span className={stil.kivilcimUcu} data-kivilcim />
      </span>
      <span className={stil.ray} aria-hidden="true">
        <span className={stil.rayDolum} />
        {sis && <span className={stil.centik} />}
        {sis && <span className={stil.pencere} />}
        {sis && <span className={stil.kivam} />}
      </span>
      <DugmeKatmanlari />
    </button>
  )
}

export function Ocak({ goruntu, ...kalan }: SeritProps) {
  return (
    <Serit sinif={stil.ocak} etiket={kalan.metin.ocak} ciz="kor">
      <OcakYatagi />
      <span className={stil.kivilcim} data-ciz="kivilcim" aria-hidden="true">
        <KorKivilcimi />
      </span>
      {YUVALAR.map((no) =>
        no >= goruntu.acikOcak ? (
          <div key={no} className={stil.kapali} />
        ) : (
          <Yuva key={no} no={no} sis={goruntu.ocak[no] ?? null} {...kalan} />
        ),
      )}
    </Serit>
  )
}

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
      className={stil.tezgahKalem}
      data-kalite={kalem.kalite ?? 'ayran'}
      data-urun={kalem.urun}
      aria-label={etiket}
      onClick={(e) => vurgula(kalem.urun, e.currentTarget)}
    >
      <UrunSimgesi urun={kalem.urun} boy={22} />
      {kalem.kalite && <span className={stil.soguma} data-ciz="soguma" data-no={no} aria-hidden="true" />}
      <span className={stil.dolgu} data-dolgu aria-hidden="true" />
    </button>
  )
}

type TezgahProps = SeritProps & { vurgula: (u: Urun, el: HTMLElement) => void }

export function Tezgah({ goruntu, ad, dokun, metin, vurgula }: TezgahProps) {
  return (
    <section
      className={stil.tezgah}
      data-tezgah
      data-serit
      aria-label={metin.tezgah}
      onKeyDown={seritTusu}
      onFocus={seritOdagi}
    >
      {YUVALAR.map((no) => {
        const kalem = goruntu.tezgah[no]
        const etiket = kalem ? `${metin.tezgah}: ${ad(kalem.urun)}` : ''
        return (
          <span key={no} className={stil.tezgahYuva} data-tezgah-yuva={no}>
            {kalem && <TezgahKalemi no={no} kalem={kalem} etiket={etiket} vurgula={vurgula} />}
          </span>
        )
      })}
      <button
        type="button"
        className={stil.yayik}
        data-hedef="ayran"
        data-ciz="ayran"
        data-durum={goruntu.ayran}
        aria-label={ad('ayran')}
        onClick={(e) => dokun('ayran', e.currentTarget)}
      >
        <AcikYayik boy={26} />
        <span className={stil.masrapa} aria-hidden="true">
          <BakirMasrapa boy={22} />
        </span>
        <DugmeKatmanlari />
      </button>
    </section>
  )
}

export function Raf({ goruntu, ad, dokun, metin }: SeritProps) {
  return (
    <Serit sinif={stil.raf} etiket={metin.raf}>
      {goruntu.raf.map((urun) => (
        <button
          key={urun}
          type="button"
          className={stil.rafUrun}
          data-hedef={urun}
          onClick={(e) => dokun(urun, e.currentTarget)}
        >
          <UrunSimgesi urun={urun} boy={22} />
          <span>{ad(urun)}</span>
          <DugmeKatmanlari />
        </button>
      ))}
    </Serit>
  )
}
