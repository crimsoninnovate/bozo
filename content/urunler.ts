import type { Icecek, IkramGrubu, Ikram, Olcu, OzelUrun, Urun } from './types.ts'

/**
 * Ürün adları ve açıklamaları sözlükte yaşar; burada yalnızca kimlik, fiyat ve
 * fotoğraf bağı vardır. Böylece EN menü aynı listeyi kullanır.
 *
 * Fiyatlar ve sıra sahibinin 8 Ekim 2026 fiyat listesinden, kuruşsuz TL. Yarım
 * porsiyon o listeyle kalktı, 1,5 porsiyon ve 1,5 dürüm 19 Ekim 2026'da; listede olmayan ölçü yazılmaz.
 * 24 Ekim 2026 el yazısı listesi: servis ve dürüm aynı fiyat ve aynı şiş sayısı.
 */
export const menuUrunler: Urun[] = [
  {
    id: 'ciger',
    fiyatlar: { porsiyon: 690, durum: 690 },
    fotoId: 'tane-yakin-cekim',
  },
  { id: 'dalak', fiyatlar: { porsiyon: 550, durum: 550 }, fotoId: 'dalak' },
  { id: 'yurek', fiyatlar: { porsiyon: 550, durum: 550 }, fotoId: 'yurek' },
  {
    id: 'terbiyeli-tavuk-sis',
    fiyatlar: { porsiyon: 550, durum: 550 },
    fotoId: 'terbiyeli-tavuk-sis',
  },
  {
    id: 'terbiyesiz-tavuk-sis',
    fiyatlar: { porsiyon: 550, durum: 550 },
    fotoId: 'tavuk-sis',
  },
  { id: 'terbiyeli-kusbasi', fiyatlar: { porsiyon: 550, durum: 550 }, fotoId: 'terbiyeli-kusbasi' },
  { id: 'bozo-karisik', fiyatlar: { porsiyon: 700 }, fotoId: 'bozo-karisik' },
]

/**
 * Ana sayfa beş ana kalemde kalır: karışık ve special kombinasyondur (sahibinin
 * kararı, 13 Ağustos 2026). Terbiyeli tavuk şiş 8 Ekim 2026'da açıklamasız geldi;
 * ana sayfa her kalemi açıklamasıyla bastığı için yalnız menüde.
 */
const ANA_SAYFA_DISI = new Set(['terbiyeli-tavuk-sis', 'bozo-karisik'])
export const anaUrunler: Urun[] = menuUrunler.filter((urun) => !ANA_SAYFA_DISI.has(urun.id))

/** Ölçülerin menüdeki sırası, fiyat listesinin sütun sırası. */
const OLCU_SIRASI: Olcu[] = ['porsiyon', 'durum']

/** Ürünün fiyatı olan ölçüleri, menüdeki sırayla. */
export function urunOlculeri(urun: Urun): { olcu: Olcu; fiyat: number }[] {
  return OLCU_SIRASI.flatMap((olcu) => {
    const fiyat = urun.fiyatlar[olcu]
    return fiyat === undefined ? [] : [{ olcu, fiyat }]
  })
}

/** Tek ölçü; gramaj menü sözlüğünde (`ozel.miktarNotu`). */
export const ozelUrun: OzelUrun = { id: 'bozo-special', fiyat: 900 }

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
 * Sahibinin 19 Ekim 2026 fiyat listesi; listede olmayan içecekler menüden kalktı.
 * Sıra listenin değil, rafın düzeni: gazlılar, meyveli, sonra ocağın yanına
 * giden içecekler.
 */
export const icecekler: Icecek[] = [
  { id: 'kola', olculer: [{ olcu: 'kutu', fiyat: 60 }, { olcu: 'sise', fiyat: 70 }] },
  { id: 'kolaZero', olculer: [{ olcu: 'kutu', fiyat: 60 }, { olcu: 'sise', fiyat: 70 }] },
  { id: 'fanta', olculer: [{ olcu: 'kutu', fiyat: 60 }] },
  { id: 'cappy', olculer: [{ olcu: 'kutu', fiyat: 60 }] },
  {
    id: 'ayran',
    olculer: [
      { olcu: 'buyuk', fiyat: 40 },
      { olcu: 'kucuk', fiyat: 30 },
      { olcu: 'acikYayik', fiyat: 50 },
    ],
  },
  { id: 'su', olculer: [{ olcu: 'pet', fiyat: 25 }, { olcu: 'cam', fiyat: 50 }] },
]
