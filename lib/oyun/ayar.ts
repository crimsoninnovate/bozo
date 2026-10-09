import type { Eslikci, Kalem, Urun } from './tipler.ts'

/** Saniyedeki tik. Bütün süreler tik cinsinden tamsayıdır (spec §5). */
export const TIK_HIZI = 60
/** 21:00'den 05:00'e: sekiz oyun saati, her biri 15 sn. */
export const OYUN_SAATI_TIK = 900
export const TUR_TIK = 8 * OYUN_SAATI_TIK

export type EvreAyari = {
  baslangic: number
  bitis: number
  misafir: number
  ocak: number
  cigerPisme: number
  almaPenceresi: number
  tamKivamBandi: number
  sabir: number
  puanCarpani: 1 | 2
}

/**
 * Spec tabak §5 tablosu, tike çevrilmiş; başlangıç değerleri, botlarla ayarlanır (Görev 4).
 * Sütunlar: başlangıç, bitiş, misafir yeri, ocak, ciğer pişme, alma penceresi, tam kıvam bandı, sabır, puan ×.
 */
const TABLO = [
  [0, 900, 2, 3, 240, 180, 36, 2100, 1],
  [900, 2700, 2, 3, 210, 156, 30, 1680, 1],
  [2700, 4500, 3, 4, 180, 132, 27, 1320, 1],
  [4500, 6300, 3, 4, 156, 120, 24, 1080, 1],
  [6300, 7200, 3, 4, 132, 108, 21, 960, 2],
] as const

export const EVRELER: readonly EvreAyari[] = TABLO.map(
  ([baslangic, bitis, misafir, ocak, cigerPisme, almaPenceresi, tamKivamBandi, sabir, puanCarpani]) => ({
    baslangic,
    bitis,
    misafir,
    ocak,
    cigerPisme,
    almaPenceresi,
    tamKivamBandi,
    sabir,
    puanCarpani,
  }),
)

export const EN_COK_MISAFIR = 3
export const EN_COK_OCAK = 4
export const TABAK_SAYISI = 2
/** Tabak en çok dört kalem alır; beşinci bırakış elde kalır. */
export const TABAK_SINIRI = 4
/** Bahşiş tezgahta 8 sn bekler, sonra solar. */
export const PARA_TIK = 480
export const KALKIS_TIK = 30
export const KAYIP_SINIRI = 3

export const RAF: readonly Urun[] = ['ciger', 'dalak', 'yurek']
export const KASELER: readonly Eslikci[] = ['domates', 'sogan']

/** Ciğere göre pişme süresi, yüzde: dalak kısa tutulur, yürek sıkı dokulu (menü metni). */
export const PISME_YUZDESI: Record<Urun, number> = { ciger: 100, dalak: 75, yurek: 125 }
/** Kalemin rafta ya da kasede belirdiği evre (sıfırdan). */
export const ACILDIGI_EVRE: Record<Kalem, number> = { ciger: 0, domates: 0, dalak: 1, sogan: 1, yurek: 2 }

/** Hiçbir olay puanı düşürmez (spec sade §2): yalnız kazanç kalemleri. Bahşiş tam sabırda 200. */
export const PUAN = { tamKivam: 150, iyi: 100, eslikci: 20, bahsis: 200, geceTamam: 1000 } as const

/** Kombo sayacının çarpan eşikleri: 0-2 ×1, 3-5 ×2, 6-8 ×3, 9+ ×4. */
export const KOMBO_ESIKLERI = [0, 3, 6, 9] as const

export type EvreButcesi = {
  /** Misafirler arası ortalama tik; geliş bu aralığın ±%20'si içinde oynar. */
  aralik: number
  /** Fiş başına şiş sayısı; toplamı `sisler` uzunluğu. */
  sisBoylari: readonly number[]
  sisler: readonly Urun[]
  /** En küçük fişlerden başlayarak birer tane eklenir; sayısı fiş sayısını aşmaz. */
  eslikciler: readonly Eslikci[]
  /** Bozo Karışık fişi (ciğer, dalak, yürek) ve yanındaki eşlikçi; null yok. */
  karisik: { eslikci: Eslikci | null } | null
}

function kalemler(adet: Partial<Record<Urun, number>>): Urun[] {
  return (Object.entries(adet) as [Urun, number][]).flatMap(([urun, n]) => Array<Urun>(n).fill(urun))
}

/**
 * Zorluk bütçesi (spec tabak §5): evre 2-5 için misafir sayısı ve kalem kümesi her tohumda aynı,
 * tohum yalnız sırayı ve geliş anını belirler. Aralıklar evreye sığacak şekilde seçildi: spec'in
 * 8/6/4,5/3,5 sn değerleri 30 saniyelik evrelere sığmıyordu. Evre 5 üç fiş + Karışık, son misafir
 * 05:00'ten en az 8 sn önce (6720). Gece 24 misafir.
 */
export const BUTCE: readonly EvreButcesi[] = [
  {
    aralik: 340,
    sisBoylari: [2, 2, 1, 1, 1],
    sisler: kalemler({ ciger: 5, dalak: 2 }),
    eslikciler: ['domates', 'domates', 'sogan'],
    karisik: null,
  },
  {
    aralik: 290,
    sisBoylari: [2, 2, 2, 2, 2, 2],
    sisler: kalemler({ ciger: 6, dalak: 3, yurek: 3 }),
    eslikciler: ['domates', 'domates', 'sogan', 'sogan'],
    karisik: null,
  },
  {
    aralik: 245,
    sisBoylari: [2, 2, 2, 2, 2, 1],
    sisler: kalemler({ ciger: 5, dalak: 3, yurek: 3 }),
    eslikciler: ['domates', 'domates', 'sogan', 'sogan'],
    karisik: { eslikci: 'domates' },
  },
  {
    aralik: 110,
    sisBoylari: [2, 2, 2],
    sisler: kalemler({ ciger: 3, dalak: 2, yurek: 1 }),
    eslikciler: ['domates', 'sogan'],
    karisik: { eslikci: 'domates' },
  },
]

/** Gecenin yönlendirmeli ilk iki misafiri; tohumdan bağımsız (spec tabak §5). */
export const ILK_MISAFIRLER = [
  { gelis: 60, fis: ['ciger'], tukenmez: true },
  { gelis: 720, fis: ['ciger', 'domates'], tukenmez: false },
] as const satisfies readonly { gelis: number; fis: readonly Kalem[]; tukenmez: boolean }[]
