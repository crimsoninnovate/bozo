/*
 * Masa plakası QR'ları: `https://cigercibozo.com/m/N` → `public/.htaccess` 302 ile `/menu/?masa=N`.
 * Plakalar basılı; QR adresi değişmez, değişirse yalnız yönlendirme değişir. Site ve skor sunucusu
 * masa numarasını buradan okur.
 */

export const MASA_SAYISI = 30

export function masaGecerliMi(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n <= MASA_SAYISI
}

/** `?masa=N`, yalnız plakanın yazdığı biçim (baştaki sıfır yok). */
export function masaCoz(arama: string): number | null {
  const deger = new URLSearchParams(arama).get('masa') ?? ''
  if (!/^[1-9]\d?$/.test(deger)) return null
  const n = Number(deger)
  return masaGecerliMi(n) ? n : null
}

/** Personel ekranının "son 7 gün"ü bugünü de sayar: başlangıç altı takvim günü geride. */
export function yediGunlukBaslangic(bugun: string): string {
  return new Date(Date.parse(`${bugun}T00:00:00Z`) - 6 * 86_400_000).toISOString().slice(0, 10)
}

export type TaramaSatiri = { masa: number; bugun: number; hafta: number; toplam: number }
/** `satirlar` her masa için bir satır, 1'den `MASA_SAYISI`'na; okunmamış masa sıfırla. */
export type YonetimTaramaYaniti = { gun: string; satirlar: TaramaSatiri[] }
