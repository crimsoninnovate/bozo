import { useEffect, useEffectEvent, useState } from 'react'
import { canliAdim, canliBaslat, canliDokun } from '@/lib/oyun/canli'
import { goruntuAl } from '@/lib/oyun/gosterim'
import type { Hedef, Olay, Oyun, Sonuc } from '@/lib/oyun/tipler'
import { adimSayisi } from '@/lib/oyun/zamanlayici'

type Secenek = {
  tohum: number
  /** Her karede sürekli değerleri (ray, sabır, saat, puan) DOM'a yazar. */
  ciz: (oyun: Oyun) => void
  /** Karede olan olaylar; anlık tepkiler için. */
  tepki: (olaylar: Olay[]) => void
  bitince: (sonuc: Sonuc) => void
}

/**
 * Sabit adımlı oyun döngüsü (spec §10). Simülasyon tikte, çizim karede ilerler; React
 * yalnız olay olunca yeniden çizer, sürekli değerleri `ciz` doğrudan yazar.
 */
export function useOyunDongusu({ tohum, ciz, tepki, bitince }: Secenek) {
  const [canli] = useState(() => canliBaslat(tohum))
  const [goruntu, setGoruntu] = useState(() => goruntuAl(canli.oyun))
  const [duraklatildi, setDuraklatildi] = useState(false)

  const kareSonu = useEffectEvent((olaylar: Olay[]) => {
    if (olaylar.length > 0) {
      setGoruntu(goruntuAl(canli.oyun))
      tepki(olaylar)
    }
    ciz(canli.oyun)
    const bitti = canli.oyun.bitti
    if (bitti) bitince({ puan: canli.oyun.puan, ozet: { ...canli.oyun.ozet }, bitti, tik: canli.oyun.tik })
  })

  useEffect(() => {
    if (duraklatildi) return
    let istek = 0
    let onceki = performance.now()
    let birikim = 0
    const kare = (simdi: number) => {
      const sonuc = adimSayisi(birikim, simdi - onceki)
      onceki = simdi
      birikim = sonuc.birikim
      const olaylar: Olay[] = []
      for (let i = 0; i < sonuc.adim && !canli.oyun.bitti; i++) olaylar.push(...canliAdim(canli))
      kareSonu(olaylar)
      if (!canli.oyun.bitti) istek = requestAnimationFrame(kare)
    }
    istek = requestAnimationFrame(kare)
    return () => cancelAnimationFrame(istek)
  }, [canli, duraklatildi])

  useEffect(() => {
    const gizlenince = () => {
      if (document.hidden) setDuraklatildi(true)
    }
    document.addEventListener('visibilitychange', gizlenince)
    return () => document.removeEventListener('visibilitychange', gizlenince)
  }, [])

  const dokun = (hedef: Hedef) => {
    if (!duraklatildi) canliDokun(canli, hedef)
  }

  return {
    goruntu,
    dokun,
    duraklatildi,
    duraklat: () => setDuraklatildi(true),
    devam: () => setDuraklatildi(false),
  }
}
