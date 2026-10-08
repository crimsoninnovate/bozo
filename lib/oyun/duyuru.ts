import type { Olay } from './tipler.ts'

/*
 * Canlı bölge (spec §15): önemli anlar saniyede en çok bir kez duyurulur. Metin
 * sözlükten gelir; burada yalnız hangi anın duyurulacağı ve sırası seçilir.
 */

export type DuyuruAnahtari = 'sonSaat' | 'porsiyon' | 'sofraKalkti' | 'fisTamam' | 'sisYandi' | 'sogudu'
export type Duyuru = { anahtar: DuyuruAnahtari; puan?: number }

/** Önem sırası: büyük sayı önce söylenir. */
const ONCELIK: Readonly<Record<DuyuruAnahtari, number>> = {
  sonSaat: 6,
  porsiyon: 5,
  sofraKalkti: 4,
  fisTamam: 3,
  sisYandi: 2,
  sogudu: 1,
}

function olayDuyurusu(olay: Olay): Duyuru | null {
  switch (olay.tur) {
    case 'evre':
      return olay.evre === 4 ? { anahtar: 'sonSaat' } : null
    case 'porsiyon':
      return { anahtar: 'porsiyon' }
    case 'sofraKalkti':
      return olay.odedi ? null : { anahtar: 'sofraKalkti' }
    case 'fisTamam':
      return { anahtar: 'fisTamam', puan: olay.odeme }
    case 'sisYandi':
      return { anahtar: 'sisYandi' }
    case 'sogudu':
      return { anahtar: 'sogudu' }
    default:
      return null
  }
}

/** Karedeki olayların en önemlisi; duyurulacak bir şey yoksa null. */
export function duyuruSec(olaylar: readonly Olay[]): Duyuru | null {
  let secilen: Duyuru | null = null
  for (const olay of olaylar) {
    const d = olayDuyurusu(olay)
    if (d && (!secilen || ONCELIK[d.anahtar] > ONCELIK[secilen.anahtar])) secilen = d
  }
  return secilen
}

export type Duyurucu = {
  /** Sıraya alır; bekleyen daha önemliyse yenisi düşer. */
  ekle(duyuru: Duyuru): void
  /** Aralık dolduysa bekleyeni verir ve saati başlatır; yoksa null. */
  al(simdiMs: number): Duyuru | null
}

/** Saniyede en çok bir duyuru; aradakilerin en önemlisi bir sonraki sırayı bekler. */
export function duyurucuKur(aralikMs = 1000): Duyurucu {
  let son = Number.NEGATIVE_INFINITY
  let bekleyen: Duyuru | null = null
  return {
    ekle(duyuru) {
      if (!bekleyen || ONCELIK[duyuru.anahtar] >= ONCELIK[bekleyen.anahtar]) bekleyen = duyuru
    },
    al(simdiMs) {
      if (!bekleyen || simdiMs - son < aralikMs) return null
      const d = bekleyen
      bekleyen = null
      son = simdiMs
      return d
    },
  }
}
