export type SisUrun = 'ciger' | 'dalak' | 'yurek'
export type Urun = SisUrun | 'ayran'
export type Kalite = 'tam' | 'iyi'

/** Simülasyonun tanıdığı dokunma hedefleri: sofra 0-3, ocak yuvası 0-3, raf, ayran. */
export type Hedef = `s${0 | 1 | 2 | 3}` | `o${0 | 1 | 2 | 3}` | SisUrun | 'ayran'

/** Kayıttaki tek dokunuş: hangi tikte, neye. JSON'da kısa kalsın diye demet. */
export type Girdi = readonly [tik: number, hedef: Hedef]

export type Misafir = {
  no: number
  gelis: number
  fis: readonly Urun[]
  karisik: boolean
  /** Yalnız gecenin ilk misafiri: sabrı tükenmez, ilk fiş kaybedilemez (spec §3). */
  tukenmez: boolean
}

export type Sofra = {
  misafir: Misafir
  kalan: Urun[]
  /** Servis edilmiş kalemlerin puanı; fiş tamamlanınca çarpanla ödenir. */
  birikim: number
  kurulu: boolean
  sabir: number
  toplamSabir: number
  /** Ödedikten sonra kalkmasına kalan tik; ödemeden önce null. */
  kalkis: number | null
}

export type OcakSisi = {
  urun: SisUrun
  gecen: number
  pisme: number
  pencere: number
  bant: number
  cevirme: 'yok' | 'iyi' | 'kotu'
}

export type TezgahUrunu = { urun: Urun; kalite: Kalite | null; bekleme: number }

export type Bitis = 'gece' | 'ucSofra'

export type Ozet = { sofra: number; sis: number; tamKivam: number; enUzunKombo: number; kalkan: number }

export type Olay =
  | { tur: 'sofraGeldi'; sofra: number }
  | { tur: 'sofraKuruldu'; sofra: number }
  | { tur: 'servis'; sofra: number; urun: Urun; kalite: Kalite | null }
  | { tur: 'fisTamam'; sofra: number; odeme: number }
  | { tur: 'sofraKalkti'; sofra: number; odedi: boolean }
  | { tur: 'sisKondu'; yuva: number; urun: SisUrun }
  | { tur: 'sisCevrildi'; yuva: number; iyi: boolean }
  | { tur: 'sisAlindi'; yuva: number; kalite: Kalite }
  | { tur: 'sisYandi'; yuva: number }
  | { tur: 'sogudu'; tezgah: number }
  | { tur: 'ayranDoldu' }
  | { tur: 'porsiyon' }
  | { tur: 'rafDolu'; urun: SisUrun }
  | { tur: 'evre'; evre: number }
  | { tur: 'bitti'; sebep: Bitis }

export type Oyun = {
  tik: number
  evre: number
  puan: number
  sofralar: (Sofra | null)[]
  ocak: (OcakSisi | null)[]
  tezgah: (TezgahUrunu | null)[]
  /** Ayran dolumuna kalan tik; 0 dolu ve tezgahta yer bekliyor; null boş. */
  ayran: number | null
  kuyruk: Misafir[]
  gelecek: Misafir[]
  kombo: number
  porsiyonDizisi: number
  ozet: Ozet
  bitti: Bitis | null
}

export type Sonuc = { puan: number; ozet: Ozet; bitti: Bitis; tik: number }
