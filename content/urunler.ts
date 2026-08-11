import type { Icecek, Ikram, Urun } from './types.ts'

/**
 * Ürün adları ve açıklamaları sözlükte yaşar; burada yalnızca kimlik, fiyat ve
 * fotoğraf bağı vardır. Böylece EN menü aynı listeyi kullanır.
 */
export const ocaktanUrunler: Urun[] = [
  { id: 'ciger', fiyat: null, fotoId: 'tane-yakin-cekim' },
  { id: 'dalak', fiyat: null, fotoId: 'dalak' },
  { id: 'yurek', fiyat: null, fotoId: 'yurek' },
  { id: 'kuzu-sis', fiyat: null, fotoId: 'kuzu-sis' },
  { id: 'terbiyesiz-tavuk-sis', fiyat: null, fotoId: 'tavuk-sis' },
]

/** İkramlarda fiyat alanı yoktur; arayüzde "ikram" ibaresi basılır. */
export const ikramlar: Ikram[] = [
  { id: 'lebeni', fotoId: 'lebeni' },
  { id: 'bostana', fotoId: 'bostana' },
]

export const icecekler: Icecek[] = [
  { id: 'ayran', fiyat: null },
  { id: 'salgam', fiyat: null },
  { id: 'cay', fiyat: null },
]

/**
 * İçecek listesi işletmeden gelmedi; arayüz adlı içeceklerin ardına bu sayıda
 * kesik yer tutucu basar. Tasarımda üç adlı içeceğin ardında tek slot vardır.
 */
export const ICECEK_YER_TUTUCU_ADEDI = 1
