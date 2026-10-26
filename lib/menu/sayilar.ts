import type { MenuBelgesi } from './tipler.ts'

const TR = [
  'sıfır', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on',
  'on bir', 'on iki', 'on üç', 'on dört', 'on beş', 'on altı', 'on yedi', 'on sekiz', 'on dokuz', 'yirmi',
]
const EN = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
]

/** 0-20 sözcük, üstü rakam; küçük harf. */
export function sayiYaz(n: number, dil: 'tr' | 'en'): string {
  return (dil === 'tr' ? TR : EN)[n] ?? String(n)
}

/** Menü açılış cümlesindeki "ikram": ürünler ile tüm kümelerdeki öğeler. */
export function ikramSayisi(b: MenuBelgesi): number {
  return b.ikramlar.urunler.length + b.ikramlar.gruplar.reduce((t, g) => t + g.ogeler.length, 0)
}
