import { PORSIYON_SIS, PUAN } from './ayar.ts'
import { geceKur } from './gece.ts'
import { komboCarpani } from './puan.ts'
import type { Urun } from './tipler.ts'

function fisTabani(fis: readonly Urun[]): number {
  return fis.reduce<number>((t, u) => t + (u === 'ayran' ? PUAN.ayran : PUAN.tamKivam), PUAN.sabirBonusu)
}

/**
 * Tohumun üst sınırı (spec §6): her kalem tam kıvam, tam sabır, en büyük fişler en yüksek
 * çarpanlarda, her fiş son saat çarpanıyla, bütün rozetler, gece tamam. Gevşektir ama
 * kanıtlanabilir: sayaç ancak ödemeyle artar, ceza hep negatiftir. Sunucu bunun üstünü reddeder.
 */
export function tavan(tohum: number): number {
  const misafirler = geceKur(tohum)
  const tabanlar = misafirler.map((m) => fisTabani(m.fis)).sort((a, b) => a - b)
  const odemeler = tabanlar.reduce((t, taban, k) => t + taban * komboCarpani(k) * 2, 0)
  const sis = misafirler.reduce((t, m) => t + m.fis.filter((u) => u !== 'ayran').length, 0)
  return odemeler + Math.floor(sis / PORSIYON_SIS) * PUAN.porsiyon + PUAN.geceTamam
}
