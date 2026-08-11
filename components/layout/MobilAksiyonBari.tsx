import { sozluk, type Dil } from '@/content'
import { isletme } from '@/content/isletme'
import { telefonUrl, whatsappUrl, yolTarifiUrl } from '@/lib/site'
import stil from './MobilAksiyonBari.module.css'

type Props = { dil: Dil }

/**
 * Sabit alt eylem barı: üç eşit hedef (yol tarifi, ara, WhatsApp), her biri
 * 50px yükseklik ve dokunma alanı 44px üzerinde. Telefon ve WhatsApp numarası
 * bilinmiyorsa (null) placeholder basılır, href üretilmez. 780px üstünde
 * gizlenir (bkz. MobilAksiyonBari.module.css).
 *
 * "Yol tarifi al" metni kullanılır: tasarımın bu bardaki metni kısaltılmış
 * "Yol tarifi", ama içerik sözlüğünde bu kısa varyant yok ve content/ bu
 * görevde düzenlenemez. Sözlükteki tek hazır metin kullanıldı, bkz. task-6-report.md.
 */
export function MobilAksiyonBari({ dil }: Props) {
  const s = sozluk(dil)
  const telefon = telefonUrl(isletme.telefon)
  const whatsapp = whatsappUrl(isletme.whatsapp)

  return (
    <div className={stil.bar}>
      <a href={yolTarifiUrl()} className={`${stil.hedef} ${stil.birincil}`} rel="noopener">
        {s.ortak.cta.yolTarifiAl}
      </a>

      {telefon ? (
        <a href={telefon} className={`${stil.hedef} ${stil.ikincil}`}>
          {s.ortak.cta.ara}
        </a>
      ) : (
        <span className={`${stil.hedef} ${stil.ikincil} ${stil.pasif}`} aria-disabled="true">
          {s.ortak.cta.ara}
        </span>
      )}

      {whatsapp ? (
        <a href={whatsapp} className={`${stil.hedef} ${stil.ikincil}`} rel="noopener">
          {s.ortak.cta.whatsapp}
        </a>
      ) : (
        <span className={`${stil.hedef} ${stil.ikincil} ${stil.pasif}`} aria-disabled="true">
          {s.ortak.cta.whatsapp}
        </span>
      )}
    </div>
  )
}
