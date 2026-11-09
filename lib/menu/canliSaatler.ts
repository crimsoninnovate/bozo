import { saatlerDogrula } from './dogrulama.ts'
import type { Saatler } from './tipler.ts'

/*
 * Canlı belgenin `saatler` bölümü geçerliyse o, değilse derlenmiş saatler. Belge ya da bölüm yoksa
 * (204, eski sürüm) sessizce derlenmiş; bozuk bölüm uyarıyla. Sınırlar panelin doğrulayıcısıyla aynı.
 */
export function canliSaatleriSec(belge: unknown, derlenmis: Saatler): Saatler {
  if (typeof belge !== 'object' || belge === null || Array.isArray(belge)) return derlenmis
  const bolum = (belge as Record<string, unknown>)['saatler']
  if (bolum === undefined) return derlenmis
  const sonuc = saatlerDogrula(bolum)
  if (sonuc.tamam) return sonuc.saatler
  const ozet = sonuc.hatalar.map((h) => `${h.yol}: ${h.metin}`).join('; ')
  console.warn('canli saatler yok sayildi: gecersiz', ozet)
  return derlenmis
}
