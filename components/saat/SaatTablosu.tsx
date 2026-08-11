'use client'

import { useGirneSaati } from './useGirneSaati'
import { gosterimGunIndeksi } from '@/lib/saat'
import { sozluk, type Dil } from '@/content'
import stil from './SaatTablosu.module.css'

/**
 * Tasarımın iki tablosu. Yapı, satır sayısı, kenarlık alfaları, ağırlıklar ve
 * renkler ortak; ayrışan dört değer varyantta duruyor (bkz. .module.css).
 * Sayfa adı taşımalarının sebebi, ayırt edici başka bir eksen olmaması: iki
 * tablo aynı bağlamda, aynı genişlikte, farklı sayılarla çiziliyor.
 */
export type SaatTablosuVaryanti = 'ana' | 'konum'

type Props = {
  dil: Dil
  /**
   * Tablonun altındaki not satırı, alt çizgisiz (Ana:311, Konum:117). Sayfaya
   * özel metin taşıdığı için opsiyonel.
   */
  not?: string
  varyant?: SaatTablosuVaryanti
}

export function SaatTablosu({ dil, not, varyant = 'ana' }: Props) {
  // durum burada yalnız "mount oldu mu" sinyali olarak kullanılır (saniyede bir tetikler);
  // gün adı için durum.gunIndeksi DEĞİL, gece vardiyasını doğru güne bağlayan
  // gosterimGunIndeksi(new Date()) çağrılır. 02:00 Çarşamba'da bu Salı'yı döner.
  const durum = useGirneSaati()
  const s = sozluk(dil)
  const gunAdi =
    durum === null ? s.ortak.bugun : (s.ortak.gunler[gosterimGunIndeksi(new Date())] ?? s.ortak.bugun)

  return (
    <div className={varyant === 'konum' ? `${stil.tablo} ${stil.konum}` : stil.tablo}>
      <div className={`${stil.satir} ${stil.bugun}`}>
        <span className={stil.gunAdi}>{gunAdi}</span>
        <span className={stil.saatBugun}>{s.ortak.satirlar.saatAraligi}</span>
      </div>
      <div className={`${stil.satir} ${stil.haftalik}`}>
        <span>{s.ortak.satirlar.haftaAraligi}</span>
        <span>{s.ortak.satirlar.saatAraligi}</span>
      </div>
      {not && <p className={stil.not}>{not}</p>}
    </div>
  )
}
