import { ANA_YOL, ARA_YOL, SERVIS_YOLU, ANA_PENCERE } from './haritaYollari'
import stil from './HaritaPlakasi.module.css'

type Props = {
  /** Levhanın işaretinin yanındaki işletme adı (Ana:329). */
  isletmeAdi: string
  /** Levhanın alt köşesindeki cadde etiketi (Ana:330). */
  sokak: string
  /** ODbL atıf satırı; OSM verisini gösteren her yüzeyde zorunlu. */
  kaynak: string
  /**
   * Levhanın sayfa ızgarasındaki yeri (flex tabanı, min-width, min-height).
   * Bu değerler çağıran sayfanın düzenine ait; levha yalnız zeminini,
   * kenarlığını ve çizim katmanlarını sahiplenir (bkz. `CamPanel` ile aynı ayrım).
   */
  className?: string
}

/**
 * Ana sayfanın harita levhası. Kaynak: `Ana Sayfa Alternatif.dc.html:323-331`.
 *
 * Çizilmiş ızgara ve iki sahte yol 24 Ağustos 2026'da gerçek OpenStreetMap
 * geometrisiyle değişti. Konum sayfasının levhasıyla ORTAK OLAN YALNIZ VERİ
 * (`haritaYollari.ts`): bu levha kendi zeminini, halkasını ve ölçülerini koruyor,
 * ve aynı coğrafyayı dar çerçeveden okuyor (256 m yakın plan, orada 640 m bağlam).
 * On iki değerin onunun ayrıştığı ölçüm hâlâ geçerli, ortaklaştırma denemesi kapalı.
 *
 * `slice` merkezi sabit tutar: nabız ve halkası bu yüzden levhanın tam ortasında.
 * İşletme adı nabza bağlı olduğu için onunla birlikte gider; cadde etiketi ve atıf
 * kenara demirli, çünkü yüzdeyle konumlanan her şey kırpma ekseniyle kayar.
 */
export function HaritaPlakasi({ isletmeAdi, sokak, kaynak, className }: Props) {
  return (
    <div className={className ? `${stil.levha} ${className}` : stil.levha}>
      <svg
        aria-hidden="true"
        className={stil.yollar}
        viewBox={ANA_PENCERE}
        preserveAspectRatio="xMidYMid slice"
      >
        <path className={stil.servis} d={SERVIS_YOLU} />
        <path className={stil.ara} d={ARA_YOL} />
        <path className={stil.ana} d={ANA_YOL} />
      </svg>

      <span aria-hidden="true" className={stil.halka} />
      <span aria-hidden="true" className={stil.nabiz} />
      <span className={stil.isletmeAdi}>{isletmeAdi}</span>
      <span className={stil.sokak}>{sokak}</span>
      <span className={stil.kaynak}>{kaynak}</span>
    </div>
  )
}
