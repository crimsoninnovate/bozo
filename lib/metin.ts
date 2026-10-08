/** Bölünmez boşluk. Kaynakta görünmez kalmasın diye kod noktasıyla yazılır. */
const BOLUNMEZ = ' '

/**
 * Son iki kelimeyi bölünmez boşlukla birleştirir: çok kelimeli bir ad sararken
 * son kelime tek başına alt satıra düşmesin.
 *
 * Ölçüldü 24 Ağustos 2026: "Terbiyesiz Tavuk Şiş" ana sayfada 320/1200/1440'ta,
 * menüde 320/360/1200/1440'ta "Terbiyesiz Tavuk / Şiş" diye kırılıyordu.
 * `text-wrap: balance` bu ada hiçbir şey katmadı, kırılma yeri değişmedi.
 */
export function dulOnle(metin: string): string {
  const son = metin.lastIndexOf(' ')
  if (son === -1) return metin
  return metin.slice(0, son) + BOLUNMEZ + metin.slice(son + 1)
}

/** `{ad}` yer tutucularını doldurur; kalıp sözlükten, değer çağırandan. Tanımsız ad olduğu gibi kalır. */
export function doldur(metin: string, degerler: Record<string, string | number>): string {
  return metin.replace(/\{(\w+)\}/g, (butun, ad: string) => (ad in degerler ? String(degerler[ad]) : butun))
}
