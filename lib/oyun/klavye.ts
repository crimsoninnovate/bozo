import type { Hedef } from './tipler.ts'

/** 1-4 sofra, 5-8 ocak yuvası (spec §15). */
const KISAYOLLAR: Readonly<Record<string, Hedef>> = {
  '1': 's0',
  '2': 's1',
  '3': 's2',
  '4': 's3',
  '5': 'o0',
  '6': 'o1',
  '7': 'o2',
  '8': 'o3',
}

export function kisayolHedefi(tus: string): Hedef | null {
  return KISAYOLLAR[tus] ?? null
}

/** Şerit içi gezinme: sol ve yukarı geri, sağ ve aşağı ileri; başka tuş null. */
export function okAdimi(tus: string): -1 | 1 | null {
  if (tus === 'ArrowLeft' || tus === 'ArrowUp') return -1
  if (tus === 'ArrowRight' || tus === 'ArrowDown') return 1
  return null
}

/** Şeritteki bir sonraki odak; uçlarda sarar. Odak şeritte değilse ilk ya da son; boş şeritte -1. */
export function komsuIndeks(simdiki: number, adim: -1 | 1, adet: number): number {
  if (adet <= 0) return -1
  if (simdiki < 0 || simdiki >= adet) return adim === 1 ? 0 : adet - 1
  return (simdiki + adim + adet) % adet
}
