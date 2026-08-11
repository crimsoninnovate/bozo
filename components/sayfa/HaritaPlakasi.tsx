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
}

/**
 * CSS ile çizilen koyu tema harita levhası: gerçek bir karo yüklenmez, tek
 * işaret nabız atar. Kaynak: `Ana Sayfa Alternatif.dc.html:323-331`.
 *
 * Konum sayfasında da bir levha var (`Konum Sayfasi.dc.html:89-101`) ama on iki
 * değerin onunda ayrışıyor ve işaret etiketi orada kutulu, iki ağırlıklı bir
 * öğe. Ölçüm `docs/surec/rapor/task-13-report.md`'de; sonuç: o sayfa kendi
 * levhasını yazdı (`components/sayfa/konum/Harita.*`). Bu bileşen ana sayfaya
 * özel kaldı, ortaklaştırma denemesi kapandı.
 */
export function HaritaPlakasi({ isletmeAdi, sokak, altNot, className }: Props) {
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
    </div>
  )
}
