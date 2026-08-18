'use client'

import { useEffect, useState } from 'react'
import { durumAyniMi, durumHesapla, type Durum } from '@/lib/saat'

type Abone = (durum: Durum) => void

/*
 * Tek tıklayıcı: dokuz bileşen ayrı ayrı saniyede bir kuruyordu (ölçüldü: 9
 * interval, saniyede 9 render, sıfır DOM değişimi). Şimdi bir interval, saniye
 * başına hizalı, ve durum yalnız dakika ya da bayrak değişince yazılır; iki saat
 * aynı tıkta çevrilir.
 */
const aboneler = new Set<Abone>()
let sonDurum: Durum | null = null
let zamanlayici = 0

function tikla(): void {
  const durum = durumHesapla(new Date())
  if (sonDurum && durumAyniMi(sonDurum, durum)) return
  sonDurum = durum
  for (const abone of aboneler) abone(durum)
}

function kur(): void {
  zamanlayici = window.setTimeout(() => {
    tikla()
    zamanlayici = window.setInterval(tikla, 1000)
  }, 1000 - (Date.now() % 1000))
}

function aboneOl(abone: Abone): () => void {
  if (aboneler.size === 0) {
    sonDurum = durumHesapla(new Date())
    kur()
  }
  aboneler.add(abone)
  abone(sonDurum as Durum)
  return () => {
    aboneler.delete(abone)
    if (aboneler.size === 0) {
      window.clearTimeout(zamanlayici)
      window.clearInterval(zamanlayici)
    }
  }
}

/**
 * Girne (Europe/Nicosia) durumu, dakikada bir (ve açılış/kapanış anında) güncel.
 * Hydration güvenliği: sunucuda ve ilk istemci render'ında `null` döner,
 * gerçek değer yalnız mount sonrası gelir.
 */
export function useGirneSaati(): Durum | null {
  const [durum, setDurum] = useState<Durum | null>(null)
  useEffect(() => aboneOl(setDurum), [])
  return durum
}
