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

const CUMLE_BASI = /(?:^|[.!?]\s+)$/

/**
 * Şablondaki `{kalem}` ve `{ikram}` yerine belgenin sayılarını yazar; cümle başına düşen sayının
 * ilk harfi büyür. Menü açılış spotu ve meta açıklaması bu şablonlarla kurulur.
 */
export function acilisSpotu(sablon: string, b: MenuBelgesi, dil: 'tr' | 'en'): string {
  const sayilar = { kalem: sayiYaz(b.kalemler.length, dil), ikram: sayiYaz(ikramSayisi(b), dil) }
  return sablon.replace(/\{(kalem|ikram)\}/g, (_, ad: 'kalem' | 'ikram', konum: number) => {
    const sayi = sayilar[ad]
    if (!CUMLE_BASI.test(sablon.slice(0, konum))) return sayi
    return sayi.charAt(0).toLocaleUpperCase(dil) + sayi.slice(1)
  })
}
