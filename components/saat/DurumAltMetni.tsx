'use client'

import { useGirneSaati } from './useGirneSaati'
import { sozluk, type Dil } from '@/content'
import stil from './DurumAltMetni.module.css'

type Props = { dil: Dil }

/**
 * Hero durum satırının üçüncü parçası: açıkken ocağın ne zamana kadar yandığını,
 * kapalıyken kapalı aralığı yazar. Ana Sayfa Alternatif.dc.html:96
 *
 * `DurumCipi` ile aynı desen: `durum === null` iken kapalı görünüm basılır, böylece
 * sunucu çıktısı ile ilk istemci render'ı birebir eşleşir (kisitlar.md, hydration).
 * `aria-live` bilinçli olarak yok: aynı satırdaki `DurumCipi` zaten kibar biçimde
 * duyuruyor, ikinci bir canlı bölge aynı durum değişimini iki kez okuturdu.
 */
export function DurumAltMetni({ dil }: Props) {
  const durum = useGirneSaati()
  const s = sozluk(dil)
  const acik = durum?.acik ?? false

  return <span className={stil.metin}>{acik ? s.ortak.durum.acikAlt : s.ortak.durum.kapaliAlt}</span>
}
