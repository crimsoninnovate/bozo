'use client'

import { useGirneSaati } from './useGirneSaati'
import { saatMetni, vardiyaYuzdesi } from '@/lib/saat'
import { sozluk, type Dil } from '@/content'
import stil from './VardiyaCizelgesi.module.css'

type Props = { dil: Dil }

/**
 * Gece bölümünün 10:00 > 05:00 zaman çizelgesi. UYGULAMA-NOTLARI 4.
 *
 * Yerini aldığı vardiya çipleri 21:00-04:00 arasını listeliyordu, yani günün on
 * beş saatinde hiçbiri aktif değildi ve bölüm ölü duruyordu. Çizelge pencerenin
 * tamamını gösterir: dolgu ve imleç saniyede bir güncellenir, gündüz de bir şey
 * söyler.
 *
 * Konumlar inline `style` ile yazılır; `durum === null` iken (sunucu ve ilk
 * istemci render'ı) dolgu ve imleç hiç basılmaz, çünkü değerleri zamana bağlı.
 */
export function VardiyaCizelgesi({ dil }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  const yuzde = durum === null ? null : vardiyaYuzdesi(new Date())
  const simdi = durum ? saatMetni(durum) : null

  return (
    <div className={stil.kap}>
      <div className={stil.ray}>
        {yuzde !== null && (
          <>
            <span aria-hidden="true" className={stil.dolgu} style={{ width: `${yuzde}%` }} />
            <span className={stil.imlecKap} style={{ left: `${yuzde}%` }}>
              <span className={stil.simdi}>
                {s.ana.gece.simdi} {simdi ? `${simdi.saat}:${simdi.dakika}` : ''}
              </span>
              <span aria-hidden="true" className={stil.imlec} />
            </span>
          </>
        )}
      </div>

      <ol className={stil.saatler}>
        {s.ana.gece.cizelgeSaatleri.map((saat) => (
          <li key={saat}>{saat}</li>
        ))}
      </ol>

      <p className={stil.notlar}>
        {s.ana.gece.cizelgeNotlari.map((not, sira) => (
          <span
            key={not}
            className={sira === s.ana.gece.cizelgeNotlari.length - 1 ? stil.notSon : stil.not}
          >
            {not}
          </span>
        ))}
      </p>
    </div>
  )
}
