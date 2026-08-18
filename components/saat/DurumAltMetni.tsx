'use client'

import { useGirneSaati } from './useGirneSaati'
import { sozluk, type Dil } from '@/content'
import stil from './DurumAltMetni.module.css'

type Props = { dil: Dil }

/**
 * Hero durum satırının üçüncü parçası: açıkken ocağın ne zamana kadar yandığını,
 * kapalıyken kapalı aralığı yazar. Ana Sayfa Alternatif.dc.html:96
 *
 * `DurumCipi` ile aynı desen: `durum === null` iken boş, çip o sırada saat
 * satırını taşıyor (kapalı basmak günün 19 saatinde yanlıştı). `aria-live`
 * bilinçli olarak yok: aynı satırdaki `DurumCipi` zaten kibar biçimde duyuruyor.
 */
export function DurumAltMetni({ dil }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  if (durum === null) return <span className={stil.metin} />

  return <span className={stil.metin}>{durum.acik ? s.ortak.durum.acikAlt : s.ortak.durum.kapaliAlt}</span>
}
