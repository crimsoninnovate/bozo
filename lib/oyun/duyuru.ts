import type { Kalem, Olay } from './tipler.ts'

/*
 * Canlı bölge (spec §15): önemli anlar saniyede en çok bir kez duyurulur. Metin
 * sözlükten gelir; burada yalnız hangi anın duyurulacağı ve sırası seçilir.
 */

export type DuyuruAnahtari =
  | 'sonSaat' | 'misafirKalkti' | 'teslim' | 'bahsis' | 'yanlisTabak' | 'sisYandi' | 'paraSoldu' | 'tabagaKondu'
  | 'tabakDolu' | 'tabakElde' | 'tabakDondu' | 'elde'
export type Duyuru = { anahtar: DuyuruAnahtari; puan?: number; no?: number; urun?: Kalem }

/** Önem sırası: büyük sayı önce söylenir. Tut ve bırak sonuçları en altta (spec tabak §3). */
const ONCELIK: Readonly<Record<DuyuruAnahtari, number>> = {
  sonSaat: 10, misafirKalkti: 9, teslim: 8, bahsis: 7, yanlisTabak: 6, sisYandi: 5, paraSoldu: 4, tabakDolu: 3,
  tabagaKondu: 2, tabakElde: 1, tabakDondu: 1, elde: 1,
}

function olayDuyurusu(olay: Olay): Duyuru | null {
  switch (olay.tur) {
    case 'evre':
      return olay.evre === 4 ? { anahtar: 'sonSaat' } : null
    case 'misafirKalkti':
      return olay.odedi ? null : { anahtar: 'misafirKalkti' }
    case 'teslim':
      return { anahtar: 'teslim', no: olay.yer + 1, puan: olay.hesap }
    case 'bahsisAlindi':
      return { anahtar: 'bahsis', puan: olay.tutar }
    case 'yanlisTabak':
      return { anahtar: 'yanlisTabak' }
    case 'sisYandi':
      return { anahtar: 'sisYandi' }
    case 'paraSoldu':
      return { anahtar: 'paraSoldu' }
    case 'tabagaKondu':
      return { anahtar: 'tabagaKondu', no: olay.no + 1 }
    case 'tutuldu':
      return olay.el.tur === 'tabak' ? { anahtar: 'tabakElde', no: olay.el.no + 1 } : { anahtar: 'elde', urun: olay.el.urun }
    case 'birakildi':
      return olay.el.tur === 'tabak' ? { anahtar: 'tabakDondu', no: olay.el.no + 1 } : null
    case 'tabakDolu':
      return { anahtar: 'tabakDolu', no: olay.no + 1 }
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
