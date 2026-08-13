import { PinIkon, SofraIkon, WhatsAppIkon } from '@/components/ui/Ikonlar'
import { sozluk, type Dil } from '@/content'
import { isletme } from '@/content/isletme'
import { whatsappUrl, yol, yolTarifiUrl } from '@/lib/site'
import stil from './MobilAksiyonBari.module.css'

type Props = { dil: Dil }

/**
 * Yüzen cam eylem barı: konum, Bozo Sofrası, WhatsApp.
 *
 * Sahibinin kararları, 13 Ağustos 2026: telefon çıktı (WhatsApp yeterli),
 * orta öğe "Menü" değil "Bozo Sofrası" ve barın üstüne taşan yuvarlak bir
 * düğme. Kalıp sahibinin verdiği referanstan (elaves.com mobil barı): yüzen
 * hap, cam zemin, ortada yükselen ana eylem.
 *
 * 800px üstünde gizlenir, 120px kaydırmadan önce görünmez
 * (bkz. MobilAksiyonBari.module.css).
 */
export function MobilAksiyonBari({ dil }: Props) {
  const s = sozluk(dil)
  const whatsapp = whatsappUrl(isletme.whatsapp)

  return (
    <div className={stil.bar}>
      <a href={yolTarifiUrl()} className={stil.hedef} rel="noopener">
        <PinIkon boy={19} />
        <span className={stil.etiket}>{s.ortak.cta.yolTarifiKisa}</span>
      </a>

      <a href={yol('menu', dil)} className={`${stil.hedef} ${stil.sofra}`}>
        <span className={stil.daire}>
          <SofraIkon boy={21} />
        </span>
        <span className={stil.etiket}>{s.ortak.cta.bozoSofrasi}</span>
      </a>

      {whatsapp ? (
        <a href={whatsapp} className={stil.hedef} rel="noopener">
          <WhatsAppIkon boy={19} />
          <span className={stil.etiket}>{s.ortak.cta.whatsapp}</span>
        </a>
      ) : (
        <span className={`${stil.hedef} ${stil.pasif}`} aria-disabled="true">
          <WhatsAppIkon boy={19} />
          <span className={stil.etiket}>{s.ortak.cta.whatsapp}</span>
        </span>
      )}
    </div>
  )
}
