import type { Sozluk } from '@/content'
import { KorKivilcimi } from '@/components/ember/KorKivilcimi'
import { fisSatirlari } from '@/lib/oyun/gorsel'
import type { Goruntu } from '@/lib/oyun/gosterim'
import type { Hedef, Urun } from '@/lib/oyun/tipler'
import { seritOdagi, seritTusu } from './odak'
import { DayamaCentigi, KapaliYuva, KozYatagi, Sis } from './SahneOcak'
import { IkramTabaklari, KalktiHalkasi, KapaliSofra, KorHalkasi, SofraPlakasi } from './SahneSofra'
import { KarisikSimgesi, TaneSimgesi } from './SahneTane'
import { CevirmeIsareti, KalktiIsareti, KorNoktasi } from './Semboller'
import stil from './Saha.module.css'
import ocakStil from './SahneOcak.module.css'
import sofraStil from './SahneSofra.module.css'

/*
 * Sahanın şeritleri: sofralar ve ocak burada, tezgah ve raf `SeritlerTezgah.tsx`, HUD `Hud.tsx`
 * (spec §3). React yalnız yapı
 * değişince çizer; her karedeki değerler `ciz.ts`'ten `data-ciz` öğelerine yazılır, anlık
 * tepkiler `tepkiler.ts`'ten gizli bekleyen öğeleri oynatır.
 */

export type Metin = Sozluk['oyun']
export type SeritProps = {
  goruntu: Goruntu
  ad: (u: Urun) => string
  dokun: (hedef: Hedef, el: HTMLElement) => void
  metin: Metin
}

const YUVALAR = [0, 1, 2, 3] as const

/** Her düğmenin son iki katmanı: ilk turun kor noktası ve dokunma dolgusu. */
export function DugmeKatmanlari() {
  return (
    <>
      <span className={stil.ipucu} aria-hidden="true">
        <KorNoktasi />
      </span>
      <span className={stil.dolgu} data-dolgu aria-hidden="true" />
    </>
  )
}

type SeritKabi = {
  sinif?: string
  ad: string
  etiket: string
  ciz?: string
  sag?: React.ReactNode
  children: React.ReactNode
}

/** Şerit: görünür etiket satırı (sağında isteğe bağlı çip), tek Tab durağı, ok tuşları içeride. */
export function Serit({ sinif, ad, etiket, ciz, sag, children }: SeritKabi) {
  const id = `oyun-serit-${ad}`
  return (
    <section
      className={sinif}
      data-serit
      data-ciz={ciz}
      aria-labelledby={id}
      onKeyDown={seritTusu}
      onFocus={seritOdagi}
    >
      <span className={stil.etiketSatiri}>
        <span id={id} className={stil.etiket}>
          {etiket}
        </span>
        {sag}
      </span>
      {children}
    </section>
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

/** Fiş: yırtık kağıt, ürün başına tek büyük simge; birden çok gelecekse adet, tamamsa onay işareti. */
function Fis({ sofra }: { sofra: NonNullable<SofraProps['sofra']> }) {
  const satirlar = fisSatirlari(sofra.fis, sofra.kalan, sofra.karisik)
  return (
    <span className={sofraStil.fis} data-fis aria-hidden="true">
      {satirlar.map((s) => {
        const tamam = s.tur === 'karisik' ? s.servis.every(Boolean) : s.kalan === 0
        return (
          <span key={s.tur === 'karisik' ? 'karisik' : s.urun} className={sofraStil.kalem} data-servis={tamam ? '' : undefined}>
            {s.tur === 'karisik' ? <KarisikSimgesi boy={40} servis={s.servis} /> : <TaneSimgesi urun={s.urun} boy={40} />}
            {s.tur === 'urun' && s.kalan > 1 && <span className={sofraStil.adet}>{s.kalan}</span>}
          </span>
        )
      })}
    </span>
  )
}

function Sofra({ no, sofra, ad, dokun, metin, vurgu }: SofraProps) {
  return (
    <button
      type="button"
      className={sofraStil.sofra}
      data-hedef={`s${no}`}
      data-bos={sofra ? undefined : ''}
      data-kurulu={sofra?.kurulu ? '' : undefined}
      data-vurgu={sofra && vurgu && sofra.kalan.includes(vurgu) ? '' : undefined}
      aria-label={sofraEtiketi(metin, no, sofra, ad)}
      onClick={(e) => dokun(`s${no}` as Hedef, e.currentTarget)}
    >
      <SofraPlakasi />
      <IkramTabaklari />
      <span className={sofraStil.halka} data-ciz="sabir" data-no={no} aria-hidden="true">
        <KorHalkasi />
      </span>
      {sofra && <Fis sofra={sofra} />}
      <span className={sofraStil.kalkti} data-kalkti aria-hidden="true">
        <KalktiHalkasi />
        <KalktiIsareti boy={24} />
      </span>
      <DugmeKatmanlari />
    </button>
  )
}

export function Sofralar({ goruntu, vurgu, ...kalan }: SeritProps & { vurgu: Urun | null }) {
  const kapida = goruntu.kapida > 0 && (
    <span className={stil.kapida}>
      {kalan.metin.kapida} {goruntu.kapida}
    </span>
  )
  return (
    <Serit ad="sofra" etiket={kalan.metin.sofra} sag={kapida}>
      <div className={sofraStil.sofraIzgara}>
        {YUVALAR.map((no) =>
          no >= goruntu.acikSofra ? (
            <div key={no} className={sofraStil.kapaliSofra}>
              <KapaliSofra />
            </div>
          ) : (
            <Sofra key={no} no={no} sofra={goruntu.sofralar[no] ?? null} vurgu={vurgu} {...kalan} />
          ),
        )}
      </div>
    </Serit>
  )
}

type YuvaProps = Omit<SeritProps, 'goruntu'> & { no: number; sis: Goruntu['ocak'][number] }

function Yuva({ no, sis, ad, dokun, metin }: YuvaProps) {
  const ray = sis
    ? ({ '--centik': sis.centik, '--pencere': sis.pencere, '--kivam': sis.kivam, '--bant': sis.bant } as React.CSSProperties)
    : undefined
  return (
    <button
      type="button"
      className={ocakStil.yuva}
      data-hedef={`o${no}`}
      data-ciz="ocak"
      data-no={no}
      data-cevirme={sis?.cevirme}
      aria-label={`${metin.ocak} ${no + 1}${sis ? `: ${ad(sis.urun)}` : ''}`}
      style={ray}
      onClick={(e) => dokun(`o${no}` as Hedef, e.currentTarget)}
    >
      <span className={ocakStil.sisKap} aria-hidden="true">
        <DayamaCentigi />
        {sis && (
          <span className={ocakStil.sis} data-sis>
            <Sis urun={sis.urun} />
          </span>
        )}
        <span className={ocakStil.yanik} data-yanik>
          <Sis urun="ciger" yanik />
        </span>
        <span className={ocakStil.cevir}>
          <CevirmeIsareti boy={22} />
        </span>
        <span className={ocakStil.kivamCerceve} />
        <span className={ocakStil.kivamPuan}>+150</span>
        <span className={ocakStil.kivilcimUcu} data-kivilcim />
      </span>
      <span className={ocakStil.ray} aria-hidden="true">
        {sis && <span className={ocakStil.pencere} />}
        {sis && <span className={ocakStil.kivam} />}
        <span className={ocakStil.rayDolum} />
        <span className={ocakStil.centik} />
      </span>
      <DugmeKatmanlari />
    </button>
  )
}

export function Ocak({ goruntu, ...kalan }: SeritProps) {
  return (
    <Serit sinif={stil.ocak} ad="ocak" etiket={kalan.metin.ocak} ciz="kor">
      <div className={stil.tekne}>
        <span className={stil.tekneGolge} aria-hidden="true" />
        <span className={stil.tekneUst} aria-hidden="true" />
        <div className={stil.tekneIci}>
          <span className={stil.tekneKoru} aria-hidden="true" />
          <span className={ocakStil.kivilcim} data-ciz="kivilcim" aria-hidden="true">
            <KorKivilcimi />
          </span>
          <div className={ocakStil.yuvalar}>
            {YUVALAR.map((no) =>
              no >= goruntu.acikOcak ? (
                <div key={no} className={ocakStil.kapaliYuva}>
                  <DayamaCentigi />
                  <KapaliYuva />
                </div>
              ) : (
                <Yuva key={no} no={no} sis={goruntu.ocak[no] ?? null} {...kalan} />
              ),
            )}
          </div>
          <span className={stil.yatakKabi} aria-hidden="true">
            <KozYatagi />
          </span>
        </div>
        <span className={stil.tekneAlt} aria-hidden="true" />
      </div>
    </Serit>
  )
}
