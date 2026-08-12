'use client'

import { useGirneSaati } from './useGirneSaati'
import { vardiyaYuzdesi } from '@/lib/saat'
import { sozluk, type Dil } from '@/content'
import stil from './GunMerdiveni.module.css'

type Props = { dil: Dil }

/**
 * Hero'nun sağ kolonundaki dikey gün merdiveni. UYGULAMA-NOTLARI 2.
 *
 * Vardiyanın on dokuz saatini tek eksende gösterir: çizgi pencerenin tamamı,
 * imleç şu an, sağdaki üç satır kilometre taşları. Yüzdeyi `lib/saat.ts`
 * hesaplar, burada yalnız konuma çevrilir.
 *
 * `durum === null` iken (sunucu ve ilk istemci render'ı) imleç basılmaz:
 * konumu zamana bağlı, sunucuda yazılan her değer yanlış olurdu.
 */
export function GunMerdiveni({ dil }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  const yuzde = durum === null ? null : vardiyaYuzdesi(new Date())

  return (
    <div className={stil.kap}>
      <div className={stil.ray} aria-hidden="true">
        <span className={stil.cizgi} />
        {yuzde !== null && <span className={stil.imlec} style={{ top: `${yuzde}%` }} />}
      </div>
      <ol className={stil.taslar}>
        {s.ana.hero.kilometreTaslari.map((tas, sira) => (
          <li key={tas.saat} className={stil.tas}>
            <span
              className={sira === s.ana.hero.kilometreTaslari.length - 1 ? stil.saatSon : stil.saat}
            >
              {tas.saat}
            </span>
            <span className={stil.metin}>{tas.metin}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
