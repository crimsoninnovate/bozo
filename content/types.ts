export type Dil = 'tr' | 'en'

export type Koordinat = { enlem: number; boylam: number }

export type Isletme = {
  ad: string
  kisaAd: string
  kategori: string
  cadde: string
  sehir: string
  ulke: string
  binaNo: string | null
  postaKodu: string | null
  koordinat: Koordinat | null
  telefon: string | null
  whatsapp: string | null
  eposta: string | null
  instagram: string | null
  alkolServisi: false
  sahip: string
}

export type Urun = {
  id: string
  /** Fiyat kuruşsuz TL. Bilinmiyorsa null, arayüzde "000 TL" basılır. */
  fiyat: number | null
  fotoId: FotoId | null
}

export type Ikram = { id: string; fotoId: FotoId | null }

export type Icecek = { id: string; fiyat: number | null }

export type Foto = {
  /** Çekim listesindeki kadraj etiketi, plaka üstünde görünür. */
  etiket: string
  etiketEn: string
  dosya?: string
}

export type FotoId =
  | 'tane-yakin-cekim'
  /** Aynı konunun yatay kadrajı; menü sayfasının geniş imza panosu için ayrı kare. */
  | 'tane-yakin-cekim-yatay'
  | 'kor-uzerinde-sis'
  | 'ustanin-eli'
  | 'kurulu-sofra'
  | 'gece-cephesi'
  | 'paket-ve-gel-al'
  | 'bes-urun'
  | 'dalak'
  | 'yurek'
  | 'kuzu-sis'
  | 'tavuk-sis'
  | 'lebeni'
  | 'bostana'
  | 'ayran'
  | 'bozo-portre'
