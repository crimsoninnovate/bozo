import { TIK_HIZI } from './ayar.ts'

export const TIK_MS = 1000 / TIK_HIZI
/** Bir karede en çok 100 ms telafi edilir: uykudan dönen sekme oyunu ileri sarmaz. */
export const EN_COK_ADIM = 6

/** Sabit adımlı döngü: geçen süreyi biriktirir; kaç tik ilerleneceğini ve artanı döner. */
export function adimSayisi(birikim: number, gecenMs: number): { adim: number; birikim: number } {
  const toplam = birikim + Math.max(gecenMs, 0)
  const adim = Math.floor(toplam / TIK_MS)
  if (adim > EN_COK_ADIM) return { adim: EN_COK_ADIM, birikim: 0 }
  return { adim, birikim: toplam - adim * TIK_MS }
}
