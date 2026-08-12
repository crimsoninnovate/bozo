import { sozluk, type Dil } from '@/content'
import stil from './Harita.module.css'

type Props = { dil: Dil }

/**
 * Harita bölümü ve levhası. Konum Sayfasi.dc.html:88-103
 *
 * `id="harita"` zorunlu: hem üst barın CTA'sı hem hero'nun birincil butonu buraya
 * kaydırıyor. Çapa payını (96px) `Kabuk` `<main>` üzerinden veriyor.
 *
 * Levha Ana Sayfa'nın `HaritaPlakasi`'sı DEĞİL, ayrı bir çizim: iki levhanın
 * karşılaştırılabilir on iki değerinin onu ayrışıyor (ölçüm raporda). Ortak kalan
 * yalnız kenarlık ve alt notun tipografisi.
 *
 * Erişilebilirlik: dekoratif olan yalnız ızgara, iki dikey ve bir yatay yol,
 * halka ve pin noktası. Cadde etiketi, pin etiketi, üç POI çipi ve alt not
 * okunması gereken metinlerdir, bu yüzden levhanın tamamı `role="img"` ya da
 * `aria-hidden` yapılmadı.
 */
export function Harita({ dil }: Props) {
  const s = sozluk(dil)
  const harita = s.konum.harita

  return (
    <section id="harita" className={stil.bolum}>
      <div className={stil.levha}>
        <span aria-hidden="true" className={stil.izgara} />
        <span aria-hidden="true" className={stil.yatayYol} />
        <span aria-hidden="true" className={stil.dikeyYolGenis} />
        <span aria-hidden="true" className={stil.dikeyYolDar} />
        <span aria-hidden="true" className={stil.halka} />
        <span aria-hidden="true" className={stil.pin} />

        <span className={stil.sokak}>{harita.caddeEtiketi}</span>

        {/* Ayırıcı nokta JSX'te: iki ayrı sözlük değerinin arasındaki noktalama
            sözlüğe girmez (TelifSeridi.tsx:25 ile aynı desen). */}
        <span className={stil.pinEtiketi}>
          {s.ortak.marka.ad}
          <span className={stil.kapiNo}> · {harita.pinKapiNo}</span>
        </span>

      </div>
    </section>
  )
}
