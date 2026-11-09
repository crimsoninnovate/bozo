'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { durumAyniMi, durumHesapla, type Durum } from '@/lib/saat'
import { canliSaatleriGetir } from '@/lib/menu/canli'
import { derlenmisSaatler } from '@/lib/menu/saatEnv'
import type { Saatler } from '@/lib/menu/tipler'
import { API_KOKU } from '@/lib/oyun/api'

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

/*
 * Çalışma saatleri: sunucu ve ilk istemci render'ı build'e gömülü saatlerdir (hidrasyon uyuşur);
 * canlı belge gelince tek seferde değişir. Okuma duyuru bandı ve menüyle aynı istektir (`canli.ts`).
 */
const DERLENMIS_SAATLER = derlenmisSaatler()
const CANLI_ZAMAN_ASIMI_MS = 4000
let saatler: Saatler = DERLENMIS_SAATLER
let canliIstendi = false
const saatAboneleri = new Set<() => void>()

function canliSaatleriIste(): void {
  if (canliIstendi) return
  canliIstendi = true
  void canliSaatleriGetir(API_KOKU, fetch, CANLI_ZAMAN_ASIMI_MS, DERLENMIS_SAATLER).then((canli) => {
    if (canli.acilis === saatler.acilis && canli.kapanis === saatler.kapanis) return
    saatler = canli
    tikla()
    for (const abone of saatAboneleri) abone()
  })
}

function tikla(): void {
  const durum = durumHesapla(new Date(), saatler)
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
    sonDurum = durumHesapla(new Date(), saatler)
    kur()
  }
  canliSaatleriIste()
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

function saatAboneOl(abone: () => void): () => void {
  saatAboneleri.add(abone)
  canliSaatleriIste()
  return () => void saatAboneleri.delete(abone)
}

/**
 * Geçerli çalışma saatleri: önce build'e gömülü, canlı belge gelince canlı.
 * `lib/saat.ts` ve `lib/cizelge.ts` çağrılarına ve sözlüğün saat yer tutucularına bu verilir.
 */
export function useCanliSaatler(): Saatler {
  return useSyncExternalStore(
    saatAboneOl,
    () => saatler,
    () => DERLENMIS_SAATLER,
  )
}
