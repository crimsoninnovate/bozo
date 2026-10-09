import type { Hesap } from './defter.ts'

export type GonderimKarari = 'cevrimdisi' | 'gonder' | 'kaydet' | 'sor'

/**
 * Tur bitince skor ne olur (spec sade §3): jeton yoksa çevrimdışı; kayıtlı hesap aynı adla ya da adsız
 * doğrudan gönderir; giriş ekranında yazılan yeni ad hesap açıp gönderir; ad yoksa sonuç ekranı sorar.
 */
export function gonderimKarari(turId: string | null, hesap: Hesap | null, takmaAd: string | null): GonderimKarari {
  if (!turId) return 'cevrimdisi'
  if (hesap && (takmaAd === null || takmaAd === hesap.takmaAd)) return 'gonder'
  return takmaAd === null ? 'sor' : 'kaydet'
}
