import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/*
 * Özetler. Tarayıcı anahtarı 128 bit rastgeledir, düz SHA-256 yeter. Ödül kodu 6 hanedir:
 * sunucu gizli tuzuyla türetilir ve HMAC ile saklanır, veritabanı tek başına kodu vermez.
 */
export function anahtarOzeti(anahtar: string): string {
  return createHash('sha256').update(anahtar, 'utf8').digest('hex')
}

export function odulKodu(tuz: string, donem: string, oyuncuId: number, deneme = 0): string {
  const ozet = createHmac('sha256', tuz).update(`kod:${donem}:${oyuncuId}:${deneme}`).digest()
  return String(ozet.readUInt32BE(0) % 1_000_000).padStart(6, '0')
}

/** Özet döneme bağlı değil: personel yalnız kodu görür ve tek sorguyla bulur. */
export function kodOzeti(tuz: string, kod: string): string {
  return createHmac('sha256', tuz).update(`ozet:${kod}`).digest('hex')
}

export function jetonKimligi(): string {
  return randomBytes(16).toString('hex')
}

/** Sabit zamanlı karşılaştırma; uzunluklar farklıysa da zamanı belli etmez. */
export function esitMi(a: string, b: string): boolean {
  const ao = createHash('sha256').update(a).digest()
  const bo = createHash('sha256').update(b).digest()
  return timingSafeEqual(ao, bo)
}
