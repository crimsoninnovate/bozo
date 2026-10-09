import { PUAN, RAF } from './ayar.ts'
import { geceKur } from './gece.ts'
import { komboCarpani } from './puan.ts'
import type { Kalem, Urun } from './tipler.ts'

/** Fişin tam kıvamlı hesabı ve tam bahşişi. */
function fisTabani(fis: readonly Kalem[]): number {
  return fis.reduce<number>((t, k) => t + (RAF.includes(k as Urun) ? PUAN.tamKivam : PUAN.eslikci), PUAN.bahsis)
}

/**
 * Tohumun üst sınırı (spec tabak §8): her fiş (kalemler + 200) × kombo çarpanı × 2, en büyük fişler
 * en yüksek çarpanlarda, gece tamam. Sayaç ancak teslimle artar, hiçbir olay puan düşürmez; sunucu
 * bunun üstünü reddeder. Bütçe tohumdan bağımsız olduğu için değer de tohumdan bağımsızdır.
 */
export function tavan(tohum: number): number {
  const tabanlar = geceKur(tohum).map((m) => fisTabani(m.fis)).sort((a, b) => a - b)
  return tabanlar.reduce((t, taban, k) => t + taban * komboCarpani(k) * 2, 0) + PUAN.geceTamam
}
