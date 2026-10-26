import type { FotoId } from '../../content/types.ts'

/** Her görünen metin iki dilde birlikte yaşar. */
export type Cift = { tr: string; en: string }

export type MenuKalemi = {
  id: string
  ad: Cift
  aciklama: Cift | null
  /** Kuruşsuz TL; `durum` yoksa kalemin dürümü yoktur. */
  fiyatlar: { porsiyon: number; durum?: number }
  porsiyonNotu: Cift | null
  durumNotu: Cift | null
  fotoId: FotoId | null
  tukendi: boolean
}

export type OzelKalem = { ad: Cift; miktarNotu: Cift; aciklama: Cift; fiyat: number }

export type IcecekOlcusu = { ad: Cift; fiyat: number }

export type IcecekKalemi = { id: string; ad: Cift; olculer: IcecekOlcusu[]; tukendi: boolean }

/** `bitis`: 'YYYY-MM-DDTHH:mm', Girne saati; `null` süresiz. */
export type Duyuru = { aktif: boolean; metin: Cift; bitis: string | null }

export type IkramUrunu = { id: string; ad: Cift; aciklama: Cift; fotoId: FotoId | null }
export type IkramOgesi = { id: string; ad: Cift }
export type IkramGrubu = { id: string; ad: Cift; not: Cift | null; ogeler: IkramOgesi[] }
export type Ikramlar = { altMetin: Cift; urunler: IkramUrunu[]; gruplar: IkramGrubu[] }

/** Kullanıcı adları tam URL değil; adresi `lib/site.ts` kurar. */
export type Iletisim = {
  telefonAcik: boolean
  telefon: string
  eposta: string
  instagram: string
  facebook: string
  tiktok: string
  googleYorumKodu: string
}

export type MenuBelgesi = {
  kalemler: MenuKalemi[]
  ozel: OzelKalem
  icecekler: IcecekKalemi[]
  duyuru: Duyuru
  ikramlar: Ikramlar
  iletisim: Iletisim
}
