'use client'

import { useEffect } from 'react'
import { masaCoz } from '@/lib/masa'
import { API_KOKU, taramaBildir } from '@/lib/oyun/api'

/**
 * Masa plakası QR'ından gelen okumayı bir kez sayar (`/m/N` → `?masa=N`, `lib/masa.ts`).
 * Parametre adresten hemen silinir: yenileme, geri dönüş ya da paylaşılan bağlantı ikinci kez saymaz.
 */
export function MasaOkumasi() {
  useEffect(() => {
    const masa = masaCoz(window.location.search)
    if (masa === null) return
    const url = new URL(window.location.href)
    url.searchParams.delete('masa')
    window.history.replaceState(null, '', url)
    void taramaBildir(API_KOKU, (girdi, secenek) => fetch(girdi, secenek), masa)
  }, [])
  return null
}
