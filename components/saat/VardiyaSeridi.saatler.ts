/**
 * Gece vardiya saatleri: sıra ve sayı "Ana Sayfa Alternatif.dc.html":255-260 data-vardiya
 * listesinden. Etiket metinleri content ana.ts içindeki gece.vardiyalar dizisiyle aynı
 * sırada tutulur.
 */
export const VARDIYA_SAATLERI: readonly number[] = [21, 23, 1, 2, 3, 4]

/**
 * Mobil Prototip.dc.html:160-163 aynı şeridi dört çiple basar. Bir saatlik geriye bakma
 * penceresiyle 21/23/01/03 gecenin tamamını kapsar: 02:00'de 01:00, 04:00'te 03:00 çipi
 * yanar, boş saat kalmaz.
 */
export const MOBIL_VARDIYA_SAATLERI: readonly number[] = [21, 23, 1, 3]

/** Verilen saate en yakın (şu an içinde veya bir saat içinde başlamış) vardiyayı döner. */
export function enYakinVardiya(saat: number, vardiyalar: readonly number[]): number | null {
  let yakin: number | null = null
  for (const v of vardiyalar) {
    const fark = ((saat - v) % 24 + 24) % 24
    const yakinFark = yakin === null ? Infinity : (((saat - yakin) % 24 + 24) % 24)
    if (fark <= 1 && fark < yakinFark) yakin = v
  }
  return yakin
}
