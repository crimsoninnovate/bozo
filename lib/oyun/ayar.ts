import type { SisUrun, Urun } from './tipler.ts'

/** Saniyedeki tik. Bütün süreler tik cinsinden tamsayıdır (spec §5). */
export const TIK_HIZI = 60
/** 21:00'den 05:00'e: sekiz oyun saati, her biri 15 sn. */
export const OYUN_SAATI_TIK = 900
export const TUR_TIK = 8 * OYUN_SAATI_TIK

export type EvreAyari = {
  baslangic: number
  bitis: number
  sofra: number
  ocak: number
  cigerPisme: number
  almaPenceresi: number
  tamKivamBandi: number
  sabir: number
  puanCarpani: 1 | 2
}

/**
 * Spec §5 ayar tablosu, tike çevrilmiş; sabır 8 Ekim'de otomatik oyuncu ölçümüyle kısaldı
 * (plan 1, Görev 5). Kaba prototip testinde yeniden ayarlanır. Sütunlar:
 * başlangıç, bitiş, sofra, ocak, ciğer pişme, alma penceresi, tam kıvam bandı, sabır, puan ×.
 */
const TABLO = [
  [0, 900, 2, 3, 240, 120, 30, 1800, 1],
  [900, 2700, 2, 3, 210, 108, 27, 1320, 1],
  [2700, 4500, 3, 4, 180, 96, 24, 1080, 1],
  [4500, 6300, 4, 4, 156, 84, 21, 900, 1],
  [6300, 7200, 4, 4, 132, 72, 18, 780, 2],
] as const

export const EVRELER: readonly EvreAyari[] = TABLO.map(
  ([baslangic, bitis, sofra, ocak, cigerPisme, almaPenceresi, tamKivamBandi, sabir, puanCarpani]) => ({
    baslangic,
    bitis,
    sofra,
    ocak,
    cigerPisme,
    almaPenceresi,
    tamKivamBandi,
    sabir,
    puanCarpani,
  }),
)

export const EN_COK_SOFRA = 4
export const EN_COK_OCAK = 4
export const TEZGAH_YUVASI = 4

/** Ciğere göre pişme süresi, yüzde: dalak kısa tutulur, yürek sıkı dokulu (menü metni). */
export const PISME_YUZDESI: Record<SisUrun, number> = { ciger: 100, dalak: 75, yurek: 125 }
/** Ürünün rafta belirdiği evre (sıfırdan). */
export const ACILDIGI_EVRE: Record<Urun, number> = { ciger: 0, ayran: 0, dalak: 1, yurek: 2 }

export const KALKIS_TIK = 30
export const SOGUMA_TIK = 600
export const AYRAN_TIK = 60
export const KURMA_IADESI_YUZDE = 15
export const KAYIP_SINIRI = 3

export const PUAN = {
  tamKivam: 150,
  iyi: 100,
  ayran: 40,
  sabirBonusu: 200,
  porsiyon: 500,
  geceTamam: 1000,
  yanik: -50,
  soguma: -30,
  kalkis: -200,
} as const

/** Menüde bir ciğer porsiyonu 12 şiş: art arda 12 tam kıvam bir rozet. */
export const PORSIYON_SIS = 12
/** Kombo sayacının çarpan eşikleri: 0-2 ×1, 3-5 ×2, 6-8 ×3, 9+ ×4. */
export const KOMBO_ESIKLERI = [0, 3, 6, 9] as const

export type EvreButcesi = {
  /** Misafirler arası ortalama tik; geliş bu aralığın ±%20'si içinde oynar. */
  aralik: number
  fisBoylari: readonly number[]
  urunler: readonly Urun[]
  /** Bozo Karışık fişi (ciğer, dalak, yürek) ve ona eklenen kalemler; null yok. */
  karisik: readonly Urun[] | null
}

function kalemler(adet: Partial<Record<Urun, number>>): Urun[] {
  return (Object.entries(adet) as [Urun, number][]).flatMap(([urun, n]) => Array<Urun>(n).fill(urun))
}

/**
 * Zorluk bütçesi (spec §5): evre 2-5 için misafir sayısı ve ürün kümesi her tohumda
 * aynıdır, tohum yalnız sırayı ve geliş anını belirler. Evre 1 yönlendirmelidir.
 * `fisBoylari` toplamı `urunler` uzunluğuna eşittir. Evre 5'in aralığı son misafiri
 * 05:00'ten en az 6 sn önce getirir; yoksa son fiş tohuma göre yetişir ya da yetişmez.
 */
export const BUTCE: readonly EvreButcesi[] = [
  { aralik: 420, fisBoylari: [2, 2, 2, 1], urunler: kalemler({ ciger: 4, dalak: 2, ayran: 1 }), karisik: null },
  {
    aralik: 300,
    fisBoylari: [3, 3, 3, 2, 2, 2],
    urunler: kalemler({ ciger: 6, dalak: 4, yurek: 3, ayran: 2 }),
    karisik: null,
  },
  {
    aralik: 225,
    fisBoylari: [3, 3, 3, 3, 2, 2, 2],
    urunler: kalemler({ ciger: 8, dalak: 4, yurek: 3, ayran: 3 }),
    karisik: [],
  },
  {
    aralik: 140,
    fisBoylari: [3, 3, 3],
    urunler: kalemler({ ciger: 4, dalak: 2, yurek: 2, ayran: 1 }),
    karisik: ['ayran'],
  },
]

/** Gecenin yönlendirmeli ilk iki misafiri; tohumdan bağımsız (spec §3). */
export const ILK_MISAFIRLER = [
  { gelis: 60, fis: ['ciger'], tukenmez: true },
  { gelis: 540, fis: ['ciger', 'ayran'], tukenmez: false },
] as const satisfies readonly { gelis: number; fis: readonly Urun[]; tukenmez: boolean }[]
