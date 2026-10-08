import { KOMBO_ESIKLERI, PUAN } from './ayar.ts'

/** Sayaçtan çarpan: 0-2 ×1, 3-5 ×2, 6-8 ×3, 9+ ×4. */
export function komboCarpani(kombo: number): number {
  return KOMBO_ESIKLERI.filter((esik) => kombo >= esik).length
}

/** Yanık veya soğumada sayaç bir alt kademenin başına iner (7 → 3, 2 → 0). */
export function komboDusur(kombo: number): number {
  const kademe = komboCarpani(kombo) - 1
  return KOMBO_ESIKLERI[Math.max(kademe - 1, 0)] ?? 0
}

/** Fiş tamamlanınca kalan sabrın payı; tamsayı. */
export function sabirBonusu(sabir: number, toplam: number): number {
  const kalan = Math.min(Math.max(sabir, 0), toplam)
  return Math.floor((PUAN.sabirBonusu * kalan) / toplam)
}
