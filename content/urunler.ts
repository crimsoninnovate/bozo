import type { Icecek, IkramGrubu, Ikram, OzelUrun, Urun } from './types.ts'

/**
 * Ürün adları ve açıklamaları sözlükte yaşar; burada yalnızca kimlik, fiyat ve
 * fotoğraf bağı vardır. Böylece EN menü aynı listeyi kullanır.
 *
 * Fiyatlar sahibinden 13 Ağustos 2026'da geldi, kuruşsuz TL. Yarım porsiyon
 * ayrı kalem değil, tamın yarısı: `yarimFiyat` türetir.
 */
export const anaUrunler: Urun[] = [
  { id: 'ciger', tam: 800, durum: 500, fotoId: 'tane-yakin-cekim' },
  { id: 'dalak', tam: 600, durum: 400, fotoId: 'dalak' },
  { id: 'yurek', tam: 700, durum: 450, fotoId: 'yurek' },
  { id: 'terbiyesiz-tavuk-sis', tam: 600, durum: 400, fotoId: 'tavuk-sis' },
  { id: 'terbiyeli-kusbasi', tam: 850, durum: 550, fotoId: 'terbiyeli-kusbasi' },
]

/**
 * Menü sayfası ayrıca karışığı taşır. Ana sayfa beş ana kalemde kalır: karışık
 * ve special kombinasyondur, ürün değil (sahibinin kararı, 13 Ağustos 2026).
 */
export const menuUrunler: Urun[] = [
  ...anaUrunler,
  { id: 'bozo-karisik', tam: 800, durum: 500, fotoId: 'bozo-karisik' },
]

/** On şiş, her üründen iki şiş. Yarımı ve dürümü yok, o yüzden ayrı tip. */
export const ozelUrun: OzelUrun = { id: 'bozo-special', fiyat: 1000 }

/** İkramlarda fiyat alanı yoktur; arayüzde "ikram" ibaresi basılır. */
export const ikramlar: Ikram[] = [
  { id: 'lebeni', fotoId: 'lebeni' },
  { id: 'bostana', fotoId: 'bostana' },
]

/**
 * Plakası olmayan ikramlar. Sahibinin düz listesi (13 Ağustos 2026) hazırlanışa
 * göre kümelendi: iki yeşillik, iki soğan, iki köz. Kümeler adlandırma
 * kolaylığı değil, sofrada gerçekten ayrı gelen üç tabak.
 */
export const ikramGruplari: IkramGrubu[] = [
  { id: 'yesillik', ogeler: ['nane', 'maydanoz'] },
  { id: 'sogan', ogeler: ['sumakli', 'kozdeSogan'] },
  { id: 'kozde', ogeler: ['domates', 'biber'] },
]

/**
 * Sahibinin içecek listesi (13 Ağustos 2026). Fiyat gelmedi, o yüzden kalemler
 * fiyat alanı taşımaz: dokuz satır "000 TL" basmaktansa sunum ölçüsü basılır.
 * Sıra sahibin listesi değil, rafın kendi düzeni: gazlılar, meyveliler, sonra
 * ocağın yanına giden içecekler.
 */
export const icecekler: Icecek[] = [
  { id: 'kola', olculer: ['sise250', 'kutu330'] },
  { id: 'kolaZero', olculer: ['sise250', 'kutu330'] },
  { id: 'sprite', olculer: ['sise', 'kutu'] },
  { id: 'fanta', olculer: ['sise', 'kutu'] },
  { id: 'fuseTea', olculer: ['kutu330'] },
  { id: 'cappy', olculer: ['kutu330'] },
  { id: 'ayran', olculer: ['kapali', 'acikYayik'] },
  { id: 'salgam', olculer: [] },
  { id: 'su', olculer: [] },
  { id: 'cay', olculer: [] },
]
