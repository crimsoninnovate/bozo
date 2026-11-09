'use client'

import { useCanliSaatler, useGirneSaati } from './useGirneSaati'
import { sozluk, sozlukHam, type Dil } from '@/content'
import { vardiyaYuzdesi } from '@/lib/saat'
import { saatleriDoldur } from '@/lib/saatMetni'
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
  const saatler = useCanliSaatler()
  const s = sozluk(dil)
  const taslar = sozlukHam(dil).ana.hero.kilometreTaslari
  const ilk = saatleriDoldur(taslar[0]?.saat ?? '', saatler)
  const son = saatleriDoldur(taslar[taslar.length - 1]?.saat ?? '', saatler)
  const yuzde = durum === null ? null : Math.round(vardiyaYuzdesi(new Date(), saatler))

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
