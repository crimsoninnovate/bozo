export type Urun = 'ciger' | 'dalak' | 'yurek'
export type Eslikci = 'domates' | 'sogan'
export type Kalem = Urun | Eslikci
export type Kalite = 'tam' | 'iyi'

/** 19 hedef (spec tabak §8): raf, ocak yuvası, kase, tabak, misafir yeri, para, çöp, bırak. */
export type Hedef =
  | Urun
  | Eslikci
  | `o${0 | 1 | 2 | 3}`
  | `t${0 | 1}`
  | `m${0 | 1 | 2}`
  | `p${0 | 1 | 2}`
  | 'cop'
  | 'birak'

/** Kayıttaki tek dokunuş: hangi tikte, neye. JSON'da kısa kalsın diye demet. */
export type Girdi = readonly [tik: number, hedef: Hedef]

export type Misafir = {
  no: number
  gelis: number
  fis: readonly Kalem[]
  karisik: boolean
  /** Yalnız gecenin ilk misafiri: sabrı tükenmez, öğrenirken kaybetmek yok. */
  tukenmez: boolean
}

export type MisafirYeri = {
  misafir: Misafir
  sabir: number
  toplamSabir: number
  /** Ödedikten sonra kalkmasına kalan tik; ödemeden önce null. */
  kalkis: number | null
}

export type OcakSisi = { urun: Urun; gecen: number; pisme: number; pencere: number; bant: number }

/** Tabaktaki kalem; eşlikçinin kalitesi yok. */
export type TabakKalemi = { urun: Kalem; kalite: Kalite | null }
export type Tabak = TabakKalemi[]

/** Elde olan; şiş alındığı yuvayı taşır (yuva boşaldı, ekran şişi orada gösterir). */
export type Elde =
  | { tur: 'sis'; urun: Urun; kalite: Kalite; yuva: number }
  | { tur: 'eslikci'; urun: Eslikci }
  | { tur: 'tabak'; no: number }
  | null

export type Para = { tutar: number; kalan: number }

export type Bitis = 'gece' | 'ucMisafir'

export type Ozet = { misafir: number; sis: number; tamKivam: number; enUzunKombo: number; kalkan: number; bahsis: number }

export type Olay =
  | { tur: 'misafirGeldi'; yer: number }
  | { tur: 'misafirKalkti'; yer: number; odedi: boolean }
  | { tur: 'sisKondu'; yuva: number; urun: Urun }
  | { tur: 'sisErken'; yuva: number }
  | { tur: 'sisYandi'; yuva: number }
  | { tur: 'rafDolu'; urun: Urun }
  | { tur: 'tutuldu'; el: NonNullable<Elde> }
  | { tur: 'tabagaKondu'; no: number; kalem: TabakKalemi; el: NonNullable<Elde> }
  | { tur: 'tabakDolu'; no: number }
  | { tur: 'teslim'; yer: number; no: number; hesap: number }
  | { tur: 'yanlisTabak'; yer: number; no: number }
  | { tur: 'paraDustu'; yer: number; tutar: number }
  | { tur: 'bahsisAlindi'; yer: number; tutar: number }
  | { tur: 'paraSoldu'; yer: number }
  | { tur: 'copeGitti'; el: NonNullable<Elde> }
  | { tur: 'birakildi'; el: NonNullable<Elde> }
  | { tur: 'evre'; evre: number }
  | { tur: 'bitti'; sebep: Bitis }

export type Oyun = {
  tik: number
  evre: number
  puan: number
  misafirler: (MisafirYeri | null)[]
  ocak: (OcakSisi | null)[]
  tabaklar: Tabak[]
  el: Elde
  paralar: (Para | null)[]
  kuyruk: Misafir[]
  gelecek: Misafir[]
  kombo: number
  ozet: Ozet
  bitti: Bitis | null
}

export type Sonuc = { puan: number; ozet: Ozet; bitti: Bitis; tik: number }
