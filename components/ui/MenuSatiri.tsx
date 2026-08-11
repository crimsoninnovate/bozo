import { TaneDizilimi } from './TaneDizilimi'
import { fiyatMetni } from '@/content/isletme'
import stil from './MenuSatiri.module.css'

type Props = {
  sira: number
  ad: string
  aciklama: string
  fiyat: number | null
}

/**
 * Ana sayfanın "Ocaktan" listesindeki tek satır. Ana:176-214
 *
 * Sözlüğe bağlanmaz: ad ve açıklama çağıran taraftan gelir, fiyat biçimlendirmesi
 * (bilinmeyen fiyat için `000 TL`) burada yapılır. Sıra iki hanelidir.
 *
 * Satır interaktif DEĞİL: tasarım `cursor:pointer` veriyor ama hiçbir hedef vermiyor
 * (`data-git` yok, href yok) ve menü sayfasında bu satırın karşılığı yok. Sahte
 * tıklanabilirlik izlenimi vermemek için imleç değişmez; hover'ın zemin ve dolgu
 * geri bildirimi korunur. Bkz. task-9-report.md, sahibine açık soru.
 */
export function MenuSatiri({ sira, ad, aciklama, fiyat }: Props) {
  return (
    <li className={stil.satir}>
      <span className={stil.sira}>{String(sira).padStart(2, '0')}</span>
      <span className={stil.ad}>{ad}</span>
      <span className={stil.aciklama}>{aciklama}</span>
      {/* Mobil satırda üçlü ray yok (Mobil:113-116), o yüzden kendi kabında. */}
      <span className={stil.ray}>
        <TaneDizilimi adet={3} buyuk={9} kucuk={5} bosluk={4} ton="krem50" />
      </span>
      <span className={stil.fiyat}>{fiyatMetni(fiyat)}</span>
    </li>
  )
}
