'use client'

import { useGirneSaati } from './useGirneSaati'
import { kapanisaKalan } from '@/lib/saat'
import { sozluk, type Dil } from '@/content'
import stil from './KapanisNotu.module.css'

type Props = { dil: Dil }

/**
 * Hero saatinin altındaki iki satır: ocağın ne zaman söneceği ve kapanışa kalan
 * süre. UYGULAMA-NOTLARI 2.
 *
 * Kalan süre yalnız açıkken yazılır; kapalı aralıkta geri sayılacak bir şey yok
 * ve o satır yerini `durum.kapaliAlt`a bırakır. Mount öncesi ikinci satır hiç
 * basılmaz: değeri zamana bağlı, sunucuda yazılan her sayı yanlış olurdu.
 */
export function KapanisNotu({ dil }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  const kalan = durum === null ? null : kapanisaKalan(new Date())

  // Sıfır birim basılmaz: "Kapanışa 0 saat 18 dakika" cümle değil, şablon artığı.
  const kalanMetni = (saat: number, dakika: number): string => {
    if (saat === 0) return s.ana.hero.kapanisaKalanDakikaKalibi.replace('{dakika}', String(dakika))
    if (dakika === 0) return s.ana.hero.kapanisaKalanSaatKalibi.replace('{saat}', String(saat))
    return s.ana.hero.kapanisaKalanKalibi
      .replace('{saat}', String(saat))
      .replace('{dakika}', String(dakika))
  }

  const ikinciSatir =
    kalan === null
      ? durum === null
        ? null
        : s.ortak.durum.kapaliAlt
      : kalanMetni(kalan.saat, kalan.dakika)

  return (
    <p className={stil.not}>
      <span>{s.ana.hero.ocakSoner}</span>
      {ikinciSatir && <span className={stil.kalan}>{ikinciSatir}</span>}
    </p>
  )
}
