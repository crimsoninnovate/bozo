/**
 * 32 bitlik tohumlu üreteç (mulberry32). Yalnız tamsayı ve bit işlemi kullanır, bu
 * yüzden tarayıcıda ve Node'da aynı tohumdan aynı diziyi verir; sunucu turu bu
 * özelliğe dayanarak yeniden oynatır. `Math.random` burada kullanılmaz.
 */
export type Rastgele = {
  /** 0 ile 2^32 - 1 arası tamsayı. */
  sayi(): number
  /** `alt` ile `ust` arası tamsayı, iki uç dahil. */
  tam(alt: number, ust: number): number
}

export function rastgele(tohum: number): Rastgele {
  let durum = tohum | 0
  const sayi = (): number => {
    durum = (durum + 0x6d2b79f5) | 0
    let t = Math.imul(durum ^ (durum >>> 15), 1 | durum)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return (t ^ (t >>> 14)) >>> 0
  }
  return {
    sayi,
    tam: (alt, ust) => alt + (sayi() % (ust - alt + 1)),
  }
}

/** Fisher-Yates; diziyi yerinde karıştırır ve aynı diziyi döner. */
export function karistir<T>(dizi: T[], r: Rastgele): T[] {
  for (let i = dizi.length - 1; i > 0; i--) {
    const j = r.tam(0, i)
    const gecici = dizi[i] as T
    dizi[i] = dizi[j] as T
    dizi[j] = gecici
  }
  return dizi
}
