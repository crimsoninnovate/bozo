'use client'

import { useEffect, useState } from 'react'
import { durumHesapla, type Durum } from '@/lib/saat'

/**
 * Girne (Europe/Nicosia) durumunu saniyede bir günceller.
 * Hydration güvenliği: sunucuda ve ilk istemci render'ında `null` döner,
 * gerçek değer yalnız `useEffect` sonrası (mount sonrası) gelir.
 */
export function useGirneSaati(): Durum | null {
  const [durum, setDurum] = useState<Durum | null>(null)

  useEffect(() => {
    const yaz = (): void => setDurum(durumHesapla(new Date()))
    yaz()
    const zamanlayici = window.setInterval(yaz, 1000)
    return () => window.clearInterval(zamanlayici)
  }, [])

  return durum
}
