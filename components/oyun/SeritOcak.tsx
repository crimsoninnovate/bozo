import { KorKivilcimi } from '@/components/ember/KorKivilcimi'
import type { Goruntu } from '@/lib/oyun/gosterim'
import { DayamaCentigi, KapaliYuva, KozYatagi, OcakAlevi, Sis } from './SahneOcak'
import { Dolgu, Serit, type SeritProps } from './Serit'
import stil from './Saha.module.css'
import ocakStil from './SahneOcak.module.css'

const YUVALAR = [0, 1, 2, 3] as const

type YuvaProps = Omit<SeritProps, 'goruntu'> & { no: number; sis: Goruntu['ocak'][number]; el: Goruntu['el'] }

/**
 * Yuva: tutma kaynağı. Elde olan şiş yuvası boşaldıktan sonra da burada çizilir (`data-elde`), aynı
 * `[data-tasinir]` öğesi kalır ki sürükleme sırasında React onu değiştirmesin.
 */
function Yuva({ no, sis, el, ad, metin }: YuvaProps) {
  const eldeki = el?.tur === 'sis' && el.yuva === no ? el.urun : null
  const gorunen = sis?.urun ?? eldeki
  const ray = sis ? ({ '--pencere': sis.pencere, '--kivam': sis.kivam, '--bant': sis.bant } as React.CSSProperties) : undefined
  return (
    <button
      type="button"
      className={ocakStil.yuva}
      data-hedef={`o${no}`}
      data-ciz="ocak"
      data-no={no}
      aria-labelledby={`oyun-o${no}-ad oyun-o${no}-durum`}
      style={ray}
    >
      <span id={`oyun-o${no}-ad`} className={stil.gizli}>{`${metin.ocak} ${no + 1}${gorunen ? `: ${ad(gorunen)}` : ''}`}</span>
      <span id={`oyun-o${no}-durum`} className={stil.gizli} data-ciz="ocakMetni" data-no={no}>{eldeki ? metin.durum.elde : ''}</span>
      <span className={ocakStil.sisKap} aria-hidden="true">
        <DayamaCentigi />
        {gorunen && (
          <span className={ocakStil.sis} data-tasinir data-elde={eldeki ? '' : undefined}>
            <Sis urun={gorunen} />
          </span>
        )}
        <span className={ocakStil.yanik} data-yanik>
          <Sis urun="ciger" yanik />
        </span>
        <span className={ocakStil.kivamCerceve} />
        <span className={ocakStil.kivamPuan}>+150</span>
        <span className={ocakStil.kivilcimUcu} data-kivilcim />
      </span>
      <span className={ocakStil.ray} aria-hidden="true">
        {sis && <span className={ocakStil.pencere} />}
        {sis && <span className={ocakStil.kivam} />}
        <span className={ocakStil.rayDolum} />
      </span>
      <Dolgu />
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
          <OcakAlevi />
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
                <Yuva key={no} no={no} sis={goruntu.ocak[no] ?? null} el={goruntu.el} {...kalan} />
              ),
            )}
          </div>
          <span className={stil.yatakKabi} aria-hidden="true"><KozYatagi /></span>
        </div>
        <span className={stil.tekneAlt} aria-hidden="true" />
      </div>
    </Serit>
  )
}
