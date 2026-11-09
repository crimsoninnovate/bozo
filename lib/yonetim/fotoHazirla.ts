/* Panelin yükleme hazırlığı (spec 2026-11-09 A): kare tarayıcıda küçültülüp WebP'ye yeniden kodlanır.
   Yeniden kodlama EXIF'i (konum dahil) siler; sunucu yalnız WebP alır. */

export const UZUN_KENAR = 2000
const KALITE = 0.82

/** Uzun kenarı `enUzun`'a indirir, oranı korur; küçük kare büyütülmez. */
export function hedefBoyut(en: number, boy: number, enUzun = UZUN_KENAR): { en: number; boy: number } {
  const uzun = Math.max(en, boy)
  if (uzun <= enUzun) return { en, boy }
  const oran = enUzun / uzun
  return { en: Math.min(enUzun, Math.round(en * oran)), boy: Math.min(enUzun, Math.round(boy * oran)) }
}

const yuzde = (deger: number, toplam: number) => Math.min(100, Math.max(0, Math.round((deger / toplam) * 100)))

/** Önizlemedeki dokunuş (öğeye göre piksel) `object-position` değerine: 'X% Y%', tam yüzde. */
export function odakNoktasi(x: number, y: number, en: number, boy: number): string {
  return `${yuzde(x, en)}% ${yuzde(y, boy)}%`
}

/** Tarayıcı kareyi çözemedi ya da WebP kodlayamadı; `message` personele gösterilir. */
export class HazirlamaHatasi extends Error {}

/**
 * Seçilen görseli WebP'ye çevirir. `cozulemedi`/`kodlanamadi` metinleri çağırandan gelir
 * (`content/yonetim.ts`); bu modül tarayıcı API'si dışında bir şey bilmez.
 */
export async function webpHazirla(
  dosya: File, metin: { cozulemedi: string; kodlanamadi: string },
): Promise<Blob> {
  let kare: ImageBitmap
  try {
    kare = await createImageBitmap(dosya, { imageOrientation: 'from-image' })
  } catch (hata) {
    console.warn('görsel çözülemedi', dosya.type, dosya.size, hata)
    throw new HazirlamaHatasi(metin.cozulemedi)
  }
  const { en, boy } = hedefBoyut(kare.width, kare.height)
  const tuval = document.createElement('canvas')
  tuval.width = en
  tuval.height = boy
  tuval.getContext('2d')?.drawImage(kare, 0, 0, en, boy)
  kare.close()
  const blob = await new Promise<Blob | null>((coz) => tuval.toBlob(coz, 'image/webp', KALITE))
  // WebP kodlayamayan tarayıcı sessizce PNG verir; sunucu onu zaten reddederdi.
  if (!blob || blob.type !== 'image/webp') {
    console.warn('WebP kodlanamadı', blob?.type ?? 'boş')
    throw new HazirlamaHatasi(metin.kodlanamadi)
  }
  return blob
}
