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
  /** Tam porsiyon, kuruşsuz TL. Yarım porsiyon ayrı kalem değil, tamın yarısıdır. */
  tam: number | null
  /** Beş şişlik dürüm, kuruşsuz TL. Dürümü olmayan üründe null. */
  durum: number | null
  fotoId: FotoId | null
}

/** Tek ölçüsü olan kombinasyon: yarımı ve dürümü yoktur. */
export type OzelUrun = { id: string; fiyat: number }

export type Ikram = { id: string; fotoId: FotoId | null }

/** Plakasız ikram kümesi; `ogeler` sözlükteki `menu.ikramlar.ogeler` anahtarlarıdır. */
export type IkramGrubu = { id: string; ogeler: string[] }

/** `olculer` sözlükteki `menu.icecekler.olculer` anahtarları; ölçüsüz içecekte boş. */
export type Icecek = { id: string; olculer: string[] }

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
  | 'terbiyeli-kusbasi'
  | 'bozo-karisik'
  | 'tavuk-sis'
  | 'lebeni'
  | 'bostana'
  | 'ayran'
  | 'bozo-portre'
