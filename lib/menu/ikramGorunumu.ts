import type { FotoId } from '../../content/types.ts'
import type { MenuBelgesi } from './tipler.ts'

export type IkramGorunumu = {
  altMetin: string
  urunler: { id: string; ad: string; aciklama: string; fotoId: FotoId | null }[]
  gruplar: { id: string; ad: string; not: string | null; ogeler: { id: string; ad: string }[] }[]
}

/** Menü sayfasının ikramlar bölümü: belgedeki metinler seçili dilde, sözlük yok. */
export function ikramGorunumu(b: MenuBelgesi, dil: 'tr' | 'en'): IkramGorunumu {
  const { altMetin, urunler, gruplar } = b.ikramlar
  return {
    altMetin: altMetin[dil],
    urunler: urunler.map((u) => ({ id: u.id, ad: u.ad[dil], aciklama: u.aciklama[dil], fotoId: u.fotoId })),
    gruplar: gruplar.map((g) => ({
      id: g.id,
      ad: g.ad[dil],
      not: g.not ? g.not[dil] : null,
      ogeler: g.ogeler.map((o) => ({ id: o.id, ad: o.ad[dil] })),
    })),
  }
}
