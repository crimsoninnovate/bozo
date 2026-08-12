import stil from './MenuSatiri.module.css'

type Props = {
  sira: number
  ad: string
  aciklama: string
  /** Yalnız imza üründe: "8 şiş / porsiyon". Diğer satırlarda yok. */
  cip?: string
}

/**
 * Ana sayfanın "Ocaktan" listesindeki tek satır. UYGULAMA-NOTLARI 3.
 *
 * Tasarımın (Ana:176-214) fiyat sütunu ve üçlü tane rayı KALKTI:
 * - fiyat sütunu yayında beş kez `000 TL` basıyordu, yer tutucu bir rakam
 *   fiyat listesinin kendisinden daha kötü bir bilgi (bkz. 1.1). Fiyat gelince
 *   satırın sağına tangerine ve tabular olarak dönecek.
 * - üçlü ray beş satırın beşinde de aynıydı, yani bilgi taşımıyordu.
 *
 * Satır interaktif DEĞİL: tasarım `cursor:pointer` veriyor ama hiçbir hedef
 * vermiyor. Sahte tıklanabilirlik izlenimi vermemek için imleç değişmez;
 * hover'ın kayma ve zemin geri bildirimi korunur.
 */
export function MenuSatiri({ sira, ad, aciklama, cip }: Props) {
  return (
    <li className={stil.satir}>
      <span className={stil.sira}>{String(sira).padStart(2, '0')}</span>
      <span className={stil.ad}>{ad}</span>
      <span className={stil.aciklama}>
        {aciklama}
        {cip && <span className={stil.cip}>{cip}</span>}
      </span>
    </li>
  )
}
