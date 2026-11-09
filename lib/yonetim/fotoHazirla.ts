/* Panelin yükleme hazırlığı (spec 2026-11-09 A): kare tarayıcıda küçültülüp WebP'ye, olmazsa JPEG'e
   yeniden kodlanır (Safari ve iOS WebP kodlamaz). Yeniden kodlama EXIF'i (konum dahil) siler. */

export const UZUN_KENAR = 2000
const WEBP_KALITE = 0.82
const JPEG_KALITE = 0.85

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

/** Tarayıcı kareyi çözemedi ya da WebP/JPEG kodlayamadı; `message` personele gösterilir. */
export class HazirlamaHatasi extends Error {}

type KodlaBlob = (tur: string, kalite: number) => Promise<Blob | null>

/** Önce WebP; tarayıcı sessizce PNG verirse JPEG. İkisi de olmazsa `kodlanamadi` metniyle HazirlamaHatasi. */
export async function kodla(blobOlustur: KodlaBlob, kodlanamadi: string): Promise<Blob> {
  const webp = await blobOlustur('image/webp', WEBP_KALITE)
  if (webp?.type === 'image/webp') return webp
  const jpeg = await blobOlustur('image/jpeg', JPEG_KALITE)
  if (jpeg?.type === 'image/jpeg') return jpeg
  console.warn('görsel kodlanamadı', webp?.type ?? 'boş', jpeg?.type ?? 'boş')
  throw new HazirlamaHatasi(kodlanamadi)
}

/**
 * Seçilen görseli WebP'ye, olmazsa JPEG'e çevirir. `cozulemedi`/`kodlanamadi` metinleri çağırandan gelir
 * (`content/yonetim.ts`); bu modül tarayıcı API'si dışında bir şey bilmez.
 */
export async function fotoHazirla(
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
  const baglam = tuval.getContext('2d')
  if (!baglam) {
    kare.close()
    console.warn('2d bağlamı alınamadı', en, boy)
    throw new HazirlamaHatasi(metin.kodlanamadi)
  }
  baglam.drawImage(kare, 0, 0, en, boy)
  kare.close()
  return kodla((tur, kalite) => new Promise((coz) => tuval.toBlob(coz, tur, kalite)), metin.kodlanamadi)
}
