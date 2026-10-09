import type { Hesap } from './defter.ts'

export type GonderimKarari = 'cevrimdisi' | 'gonder' | 'kaydet' | 'sor'

/**
 * Tur bitince skor ne olur (spec sade §3): jeton yoksa çevrimdışı; kayıtlı hesap her durumda
 * doğrudan gönderir (anahtarın üstüne yazılıp eski hesap yetim kalmasın); giriş ekranında yazılan ad hesap açıp
 * gönderir; ad yoksa sonuç ekranı sorar.
 */
export function gonderimKarari(turId: string | null, hesap: Hesap | null, takmaAd: string | null): GonderimKarari {
  if (!turId) return 'cevrimdisi'
  if (hesap) return 'gonder'
  return takmaAd === null ? 'sor' : 'kaydet'
}
