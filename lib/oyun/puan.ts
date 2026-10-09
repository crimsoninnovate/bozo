import { KOMBO_ESIKLERI, PUAN } from './ayar.ts'

/** Sayaçtan çarpan: 0-2 ×1, 3-5 ×2, 6-8 ×3, 9+ ×4. */
export function komboCarpani(kombo: number): number {
  return KOMBO_ESIKLERI.filter((esik) => kombo >= esik).length
}

/** Fiş tamamlanınca kalan sabrın payı; tamsayı. */
export function sabirBonusu(sabir: number, toplam: number): number {
  const kalan = Math.min(Math.max(sabir, 0), toplam)
  return Math.floor((PUAN.bahsis * kalan) / toplam)
}
