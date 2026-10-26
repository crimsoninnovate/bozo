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
}

export type OzelKalem = { ad: Cift; miktarNotu: Cift; aciklama: Cift; fiyat: number }

export type IcecekOlcusu = { ad: Cift; fiyat: number }

export type IcecekKalemi = { id: string; ad: Cift; olculer: IcecekOlcusu[] }

export type MenuBelgesi = {
  kalemler: MenuKalemi[]
  ozel: OzelKalem
  icecekler: IcecekKalemi[]
}
