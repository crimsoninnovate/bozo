import stil from './HaritaPlakasi.module.css'

type Props = {
  /** Levhanın işaretinin yanındaki işletme adı (Ana:329). */
  isletmeAdi: string
  /** Levhanın sol tarafındaki cadde etiketi (Ana:330). */
  sokak: string
  /** Sol altta duran levha notu (Ana:331). */
  altNot: string
  /**
   * Levhanın sayfa ızgarasındaki yeri (flex tabanı, min-width, min-height).
   * Bu değerler çağıran sayfanın düzenine ait; levha yalnız zeminini,
   * kenarlığını ve çizim katmanlarını sahiplenir (bkz. `CamPanel` ile aynı ayrım).
   */
  className?: string
  /**
   * Levhaya eklenen ek katmanlar. Konum sayfasının pin etiketi ve üç POI çipi
   * (Konum:97-100) buradan geçer; konumlandırmayı çağıran verir. Ana sayfada
   * POI çipi YOKTUR, bu yüzden bileşen kendi başına hiç çip basmaz.
   */
  children?: React.ReactNode
}

/**
 * CSS ile çizilen koyu tema harita levhası: gerçek bir karo yüklenmez, tek
 * işaret nabız atar. Kaynak: `Ana Sayfa Alternatif.dc.html:323-331`.
 *
 * Konum sayfasında da bir levha var (`Konum Sayfasi.dc.html:89-101`) ama
 * geometrisi baştan sona ayrı; ölçüm `docs/surec/rapor/on-gecis-report.md` §3'te.
 * Metinler ve ek katmanlar prop olduğu için Task 13 ikinci bir kopya yazmak
 * zorunda değil; farklı olan yalnız geometri ve o da katman katman ayrı
 * sınıflarda duruyor (bkz. `.module.css` dosya başı).
 */
export function HaritaPlakasi({ isletmeAdi, sokak, altNot, className, children }: Props) {
  return (
    <div className={className ? `${stil.levha} ${className}` : stil.levha}>
      <span aria-hidden="true" className={stil.izgara} />
      <span aria-hidden="true" className={stil.yatayYol} />
      <span aria-hidden="true" className={stil.dikeyYol} />
      <span aria-hidden="true" className={stil.halka} />
      <span aria-hidden="true" className={stil.nabiz} />
      <span className={stil.isletmeAdi}>{isletmeAdi}</span>
      <span className={stil.sokak}>{sokak}</span>
      <span className={stil.altNot}>{altNot}</span>
      {children}
    </div>
  )
}
