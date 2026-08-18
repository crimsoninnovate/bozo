'use client'

import { useGirneSaati } from './useGirneSaati'
import { kalanSuresi, kapanisaKalan } from '@/lib/saat'
import { sozluk, type Dil } from '@/content'
import stil from './KapanisNotu.module.css'

type Props = { dil: Dil }

/**
 * Hero saatinin altındaki iki satır: ocağın ne zaman söneceği ve kapanışa kalan
 * süre. UYGULAMA-NOTLARI 2.
 *
 * Kalan süre yalnız açıkken yazılır; kapalı aralıkta geri sayılacak bir şey yok
 * ve o satır yerini `durum.kapaliAlt`a bırakır. Mount öncesi ikinci satır boş
 * ama yerinde: değeri zamana bağlı, sunucuda yazılan her sayı yanlış olurdu;
 * satır hiç basılmayınca da gün merdiveni hidrasyonda 31px aşağı düşüyordu.
 */
export function KapanisNotu({ dil }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  const kalan = durum === null ? null : kapanisaKalan(new Date())

  const ikinciSatir =
    kalan === null
      ? durum === null
        ? null
        : s.ortak.durum.kapaliAlt
      : s.ana.hero.kapanisaKalanKalibi.replace(
          '{sure}',
          kalanSuresi(kalan, s.ana.hero.kapanisaKalanBirimleri),
        )

  return (
    <p className={stil.not}>
      <span>{s.ana.hero.ocakSoner}</span>
      <span className={stil.kalan}>{ikinciSatir}</span>
    </p>
  )
}
