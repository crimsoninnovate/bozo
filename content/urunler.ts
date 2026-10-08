import type { Icecek, IkramGrubu, Ikram, Olcu, OzelUrun, Urun } from './types.ts'

/**
 * Ürün adları ve açıklamaları sözlükte yaşar; burada yalnızca kimlik, fiyat ve
 * fotoğraf bağı vardır. Böylece EN menü aynı listeyi kullanır.
 *
 * Fiyatlar ve sıra sahibinin 8 Ekim 2026 fiyat listesinden, kuruşsuz TL. Yarım
 * porsiyon o listeyle kalktı; listede olmayan ölçü (kuşbaşı dürümü gibi) yazılmaz.
 */
export const menuUrunler: Urun[] = [
  {
    id: 'ciger',
    fiyatlar: { porsiyon: 690, bucukPorsiyon: 900, durum: 690, bucukDurum: 900 },
    fotoId: 'tane-yakin-cekim',
  },
  { id: 'dalak', fiyatlar: { porsiyon: 550, bucukPorsiyon: 800, durum: 550, bucukDurum: 800 }, fotoId: 'dalak' },
  { id: 'yurek', fiyatlar: { porsiyon: 550, bucukPorsiyon: 800, durum: 550, bucukDurum: 800 }, fotoId: 'yurek' },
  {
    id: 'terbiyeli-tavuk-sis',
    fiyatlar: { porsiyon: 450, bucukPorsiyon: 650, durum: 450, bucukDurum: 650 },
    fotoId: 'terbiyeli-tavuk-sis',
  },
  {
    id: 'terbiyesiz-tavuk-sis',
    fiyatlar: { porsiyon: 450, bucukPorsiyon: 650, durum: 450, bucukDurum: 650 },
    fotoId: 'tavuk-sis',
  },
  { id: 'terbiyeli-kusbasi', fiyatlar: { porsiyon: 850, bucukPorsiyon: 1200 }, fotoId: 'terbiyeli-kusbasi' },
  { id: 'bozo-karisik', fiyatlar: { porsiyon: 600 }, fotoId: 'bozo-karisik' },
]

/**
 * Ana sayfa beş ana kalemde kalır: karışık ve special kombinasyondur (sahibinin
 * kararı, 13 Ağustos 2026). Terbiyeli tavuk şiş 8 Ekim 2026'da açıklamasız geldi;
 * ana sayfa her kalemi açıklamasıyla bastığı için yalnız menüde.
 */
const ANA_SAYFA_DISI = new Set(['terbiyeli-tavuk-sis', 'bozo-karisik'])
export const anaUrunler: Urun[] = menuUrunler.filter((urun) => !ANA_SAYFA_DISI.has(urun.id))

/** Ölçülerin menüdeki sırası, fiyat listesinin sütun sırası. */
const OLCU_SIRASI: Olcu[] = ['porsiyon', 'bucukPorsiyon', 'durum', 'bucukDurum']

/** Ürünün fiyatı olan ölçüleri, menüdeki sırayla. */
export function urunOlculeri(urun: Urun): { olcu: Olcu; fiyat: number }[] {
  return OLCU_SIRASI.flatMap((olcu) => {
    const fiyat = urun.fiyatlar[olcu]
    return fiyat === undefined ? [] : [{ olcu, fiyat }]
  })
}

/** Fiyat listesinde "250 GR", tek ölçü. */
export const ozelUrun: OzelUrun = { id: 'bozo-special', fiyat: 1100 }

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
 * Sahibinin 8 Ekim 2026 fiyat listesi; listede olmayan içecekler menüden kalktı.
 * Sıra listenin değil, rafın düzeni: gazlılar, meyveli, sonra ocağın yanına
 * giden içecekler.
 */
export const icecekler: Icecek[] = [
  { id: 'kola', olculer: [{ olcu: 'kutu', fiyat: 40 }, { olcu: 'sise', fiyat: 58 }] },
  { id: 'kolaZero', olculer: [{ olcu: 'kutu', fiyat: 40 }, { olcu: 'sise', fiyat: 58 }] },
  { id: 'fanta', olculer: [{ olcu: 'kutu', fiyat: 40 }] },
  { id: 'cappy', olculer: [{ olcu: 'kutu', fiyat: 40 }] },
  {
    id: 'ayran',
    olculer: [
      { olcu: 'buyuk', fiyat: 27 },
      { olcu: 'kucuk', fiyat: 22 },
      { olcu: 'acikYayik', fiyat: 35 },
    ],
  },
  { id: 'su', olculer: [{ olcu: 'pet', fiyat: 20 }, { olcu: 'cam', fiyat: 40 }] },
]
