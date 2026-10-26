import type { IkramGrubu, Ikram } from './types.ts'

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
