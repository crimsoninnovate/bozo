'use client'

import { useGirneSaati } from './useGirneSaati'
import { sozluk, type Dil } from '@/content'
import { vardiyaYuzdesi } from '@/lib/saat'
import stil from './IlerlemeRayi.module.css'

/**
 * Servis gününün yatay ilerleme rayı (SPEC.md §5). Yüzde `vardiyaYuzdesi`'nden
 * gelir, yeni iş mantığı yok. Uçlardaki saatler kilometre taşlarının ilk ve
 * son kaydından okunur; yeni metin yazılmaz.
 *
 * `durum === null` iken (sunucu ve ilk istemci render'ı) dolgu ve imleç
 * basılmaz: konumları zamana bağlı, sunucuda yazılan her değer yanlış olurdu.
 */
export function IlerlemeRayi({ dil }: { dil: Dil }) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  const taslar = s.ana.hero.kilometreTaslari
  const ilk = taslar[0]?.saat ?? ''
  const son = taslar[taslar.length - 1]?.saat ?? ''
  const yuzde = durum === null ? null : Math.round(vardiyaYuzdesi(new Date()))

  return (
    <div className={stil.kap}>
      <div className={stil.ray}>
        {yuzde !== null && (
          <>
            <span className={stil.dolgu} style={{ width: `${yuzde}%` }} />
            <span className={stil.imlec} style={{ left: `${yuzde}%` }} />
          </>
        )}
      </div>
      <p className={stil.etiketler}>
        <span className={stil.uc}>{ilk}</span>
        <span className={stil.orta}>
          {yuzde === null ? '' : s.ana.hero.servisEtiketi.replace('{yuzde}', String(yuzde))}
        </span>
        <span className={stil.uc}>{son}</span>
      </p>
    </div>
  )
}
