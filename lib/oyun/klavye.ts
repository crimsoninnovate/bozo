export type TusEylemi = 'dokun' | 'birak'

/** Enter ve boşluk odaktaki hedefe dokunur, Esc eldekini bırakır (spec tabak §3). Rakam kısayolu yok. */
export function tusEylemi(tus: string): TusEylemi | null {
  if (tus === 'Enter' || tus === ' ') return 'dokun'
  if (tus === 'Escape') return 'birak'
  return null
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
