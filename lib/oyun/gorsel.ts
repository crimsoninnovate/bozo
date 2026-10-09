import { PARA_TIK } from './ayar.ts'
import { komboCarpani } from './puan.ts'
import type { Kalem, OcakSisi, Oyun, Para } from './tipler.ts'

/*
 * Görsel dilin saf hesapları (spec §12-§13): tane rengi, kor ışığı, sabır halkası,
 * bahşiş solması, fiş satırları. Oyun durumunu değiştirmez; yalnız ekran çağırır.
 */

/** Tanenin kremden bakıra dönüşü: 0 çiğ, 1 pişti; alma penceresinde 1'de kalır. */
export function pismeOrani(sis: OcakSisi): number {
  return Math.min(1, sis.gecen / sis.pisme)
}

/** Alma penceresinde kömüre yaklaşma: 0 pencere başı, 1 yanma anı; pişmeden önce 0. */
export function yanmaOrani(sis: OcakSisi): number {
  if (sis.gecen < sis.pisme) return 0
  return Math.min(1, (sis.gecen - sis.pisme) / sis.pencere)
}

/** Ocağın kor ışığı (0-1): kombo kademesiyle bir basamak ısınır (×1 0.25 ... ×4 1). */
export function korYogunlugu(kombo: number): number {
  return komboCarpani(kombo) / 4
}

/** Kıvılcım yalnız ocakta şiş varken; yoğunluğu kor ışığı belirler. */
export function kivilcimYogunlugu(oyun: Oyun): number {
  return oyun.ocak.some((s) => s !== null) ? korYogunlugu(oyun.kombo) : 0
}

/** Kalan sabrın bu payının altında halka kızarır (spec §12). */
export const SABIR_ESIGI = 0.3

export function sabirDurumu(oran: number): 'var' | 'az' {
  return oran <= SABIR_ESIGI ? 'az' : 'var'
}

/** Paranın kalan ömrü (0-1): solma opaklığı. */
export function paraOrani(para: Para | null): number {
  return para ? para.kalan / PARA_TIK : 0
}

export type FisSatiri = { tur: 'karisik' } | { tur: 'kalem'; urun: Kalem; adet: number }

/** Fişin simgeleri: aynı kalem tek satırda adetle; Karışık fişte ilk üç kalem tek kümedir. */
export function fisSatirlari(fis: readonly Kalem[], karisik: boolean): FisSatiri[] {
  const satirlar: FisSatiri[] = karisik ? [{ tur: 'karisik' }] : []
  const adet = new Map<Kalem, number>()
  for (const k of fis.slice(karisik ? 3 : 0)) adet.set(k, (adet.get(k) ?? 0) + 1)
  for (const [urun, n] of adet) satirlar.push({ tur: 'kalem', urun, adet: n })
  return satirlar
}
