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
 * `cta.yolTarifiKisa` kullanılır: tasarımın bu bardaki metni kısaltılmış
 * "Yol tarifi" (üst bar ve bölüm butonlarındaki uzun `yolTarifiAl`'dan
 * farklı), içerik sahibi bu anahtarı sonradan ekledi (fix round 1).
 */
export function MobilAksiyonBari({ dil }: Props) {
  const s = sozluk(dil)
  const telefon = telefonUrl(isletme.telefon)
  const whatsapp = whatsappUrl(isletme.whatsapp)

  return (
    <div className={stil.bar}>
      <a href={yolTarifiUrl()} className={`${stil.hedef} ${stil.birincil}`} rel="noopener">
        {s.ortak.cta.yolTarifiKisa}
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
