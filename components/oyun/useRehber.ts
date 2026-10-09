import { useEffect, useRef, useState } from 'react'
import { rehberGoruldu } from '@/lib/oyun/defter'
import { rehberAtla, rehberBasla, rehberDurdurur, rehberIlerle, rehberIzni, rehberTamam, type Rehber } from '@/lib/oyun/rehber'
import type { Hedef, Olay, Oyun } from '@/lib/oyun/tipler'

const BITTI: Rehber = { adim: 'bitti' }

/** Rehberin canlı durumu: döngü ref'ten okur (eski kapanış yok), ekran state'ten çizer. Bitince tarayıcıya yazılır. */
export function useRehber(etkin: boolean) {
  const guncel = useRef<Rehber>(etkin ? rehberBasla() : BITTI)
  const [durum, setDurum] = useState<Rehber>(guncel.current)

  const yaz = (yeni: Rehber) => {
    if (yeni === guncel.current) return
    guncel.current = yeni
    setDurum(yeni)
  }

  useEffect(() => {
    if (etkin && durum.adim === 'bitti') rehberGoruldu()
  }, [etkin, durum.adim])

  return {
    durum,
    durdur: () => rehberDurdurur(guncel.current),
    izin: (hedef: Hedef) => rehberIzni(guncel.current, hedef),
    izle: (oyun: Oyun, olaylar: readonly Olay[]) => yaz(rehberIlerle(guncel.current, oyun, olaylar)),
    tamam: () => yaz(rehberTamam(guncel.current)),
    atla: () => yaz(rehberAtla(guncel.current)),
  }
}
