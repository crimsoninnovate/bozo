import { sozluk, type Dil } from '@/content'
import { ANA_YOL, ARA_YOL, SERVIS_YOLU, KUTU } from './haritaYollari'
import stil from './Harita.module.css'

type Props = { dil: Dil }

/**
 * Harita bölümü ve levhası. Konum Sayfasi.dc.html:88-103
 *
 * `id="harita"` zorunlu: hem üst barın CTA'sı hem hero'nun birincil butonu buraya
 * kaydırıyor. Çapa payını (96px) `Kabuk` `<main>` üzerinden veriyor.
 *
 * Yollar 24 Ağustos 2026'da gerçek OpenStreetMap geometrisiyle değişti; levhanın
 * çizilmiş ızgarası ve üç sahte yolu kalktı (bkz. `haritaYollari.ts`). Renk
 * sözleşmesi aynı kaldı, yani palet takası levhayı da götürmeye devam ediyor.
 *
 * `slice` merkezi sabit tutar: pin ve halkası bu yüzden levhanın tam ortasında ve
 * hangi en-boy oranında olursa olsun geometriden kayamaz.
 *
 * Erişilebilirlik: yol katmanı dekoratif. Okunması gereken üç metin (cadde adı,
 * pin etiketi, kaynak) levhanın kenarlarına demirli, SVG'nin içinde değil.
 */
export function Harita({ dil }: Props) {
  const s = sozluk(dil)
  const harita = s.konum.harita

  return (
    <section id="harita" className={stil.bolum}>
      <div className={stil.levha}>
        <svg
          aria-hidden="true"
          className={stil.yollar}
          viewBox={`0 0 ${KUTU} ${KUTU}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <path className={stil.servis} d={SERVIS_YOLU} />
          <path className={stil.ara} d={ARA_YOL} />
          <path className={stil.ana} d={ANA_YOL} />
        </svg>

        <span aria-hidden="true" className={stil.halka} />
        <span aria-hidden="true" className={stil.pin} />

        {/* Ayırıcı nokta JSX'te: iki ayrı sözlük değerinin arasındaki noktalama
            sözlüğe girmez (TelifSeridi.tsx:25 ile aynı desen). */}
        <span className={stil.pinEtiketi}>
          {s.ortak.marka.ad}
          <span className={stil.kapiNo}> · {harita.pinKapiNo}</span>
        </span>

        <span className={stil.sokak}>{harita.caddeEtiketi}</span>
        <span className={stil.kaynak}>{harita.kaynak}</span>
      </div>
    </section>
  )
}
