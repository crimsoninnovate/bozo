/*
 * Takma ad kuralları (spec §8): 3-12 karakter; harf (Türkçe dahil), rakam, boşluk, nokta,
 * alt çizgi, tire. Biçim denetimi tarayıcıda ve sunucuda aynı; yasaklı liste yalnız sunucuda.
 */
export const TAKMA_AD_EN_AZ = 3
export const TAKMA_AD_EN_COK = 12

const BICIM = /^[\p{L}0-9 ._-]+$/u

/** Uçlardaki boşluk atılır, ardışık boşluklar teke iner; sözlük metni budur, sunucuya bu gider. */
export function takmaAdDuzelt(ad: string): string {
  return ad.trim().replace(/\s+/g, ' ')
}

export function takmaAdBicimiGecerliMi(ad: string): boolean {
  if (ad !== takmaAdDuzelt(ad)) return false
  const uzunluk = [...ad].length
  return uzunluk >= TAKMA_AD_EN_AZ && uzunluk <= TAKMA_AD_EN_COK && BICIM.test(ad)
}

const HARF: Record<string, string> = {
  ı: 'i', ş: 's', ç: 'c', ğ: 'g', ö: 'o', ü: 'u', â: 'a', î: 'i', û: 'u',
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't',
}

/**
 * Katlama: Türkçe küçük harf, aksan ve rakam benzerleri düz harfe, ayraçlar atılır, tekrar
 * harf teke iner ("B0z0  Usta" → "bozousta"). Yasaklı liste ve ad benzersizliği bunun üstünden.
 */
export function takmaAdKatla(ad: string): string {
  const harfler = [...ad.toLocaleLowerCase('tr')].map((h) => HARF[h] ?? h).join('')
  return harfler.replace(/[^a-z]/g, '').replace(/(.)\1+/g, '$1')
}
