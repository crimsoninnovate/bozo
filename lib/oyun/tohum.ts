/** Tohum 32 bitlik işaretsiz tamsayı (`rastgele.ts`); sınır dışı değer `| 0` ile başka tohuma katlanırdı. */
export const TOHUM_USTU = 0xffffffff

export function tohumGecerliMi(deger: unknown): deger is number {
  return typeof deger === 'number' && Number.isInteger(deger) && deger >= 0 && deger <= TOHUM_USTU
}

/** Tarayıcıda ve Node'da aynı kaynak: `globalThis.crypto`. Çevrimdışı turun ve sunucunun tohumu buradan. */
export function rastgeleTohum(): number {
  const dizi = new Uint32Array(1)
  globalThis.crypto.getRandomValues(dizi)
  return dizi[0] ?? 1
}
