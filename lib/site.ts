import { isletme } from '../content/isletme.ts'
import type { Dil, Isletme } from '../content/types.ts'

/** Alan adı henüz alınmadı. Satın alındığında yalnızca bu sabit değişir. */
export const SITE_URL = 'https://cigercibozo.com'

export type RotaAnahtari = 'ana' | 'menu' | 'hikaye' | 'konum' | 'gizlilik'

const YOLLAR: Record<RotaAnahtari, string> = {
  ana: '',
  menu: 'menu',
  hikaye: 'hikaye',
  konum: 'konum',
  gizlilik: 'gizlilik',
}

/** EN rotalarında yol adları Türkçe kalır: /en/menu/, /en/hikaye/. */
export function yol(anahtar: RotaAnahtari, dil: Dil): string {
  const parca = YOLLAR[anahtar]
  const onek = dil === 'en' ? '/en' : ''
  return parca === '' ? `${onek}/` : `${onek}/${parca}/`
}

export function tumYollar(): { anahtar: RotaAnahtari; tr: string; en: string }[] {
  return (Object.keys(YOLLAR) as RotaAnahtari[]).map((a) => ({
    anahtar: a,
    tr: yol(a, 'tr'),
    en: yol(a, 'en'),
  }))
}

/**
 * Koordinat bilinmiyorken adres metniyle arama üretir. `isletmeVerisi` varsayılan
 * olarak tekil `isletme` kaynağını okur; parametre yalnız testlerin bilinen-koordinat
 * dalını gerçek veriyi değiştirmeden kapsayabilmesi için var, çağıranlar `yolTarifiUrl()`
 * ile sıfır argümanla çağırmaya devam eder.
 */
export function yolTarifiUrl(isletmeVerisi: Isletme = isletme): string {
  if (isletmeVerisi.koordinat) {
    const { enlem, boylam } = isletmeVerisi.koordinat
    return `https://www.google.com/maps/dir/?api=1&destination=${enlem},${boylam}`
  }
  // Cadde ile numara tek parça: "Naci Talat Caddesi, No:4" araması numarayı ayrı
  // bir bileşen sanır ve sonucu bozar.
  const sokak = isletmeVerisi.binaNo
    ? `${isletmeVerisi.cadde} ${isletmeVerisi.binaNo}`
    : isletmeVerisi.cadde
  const parcalar = [isletmeVerisi.ad, sokak, isletmeVerisi.sehir, isletmeVerisi.ulke].filter(
    (parca): parca is string => Boolean(parca),
  )
  const adres = parcalar.join(', ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adres)}`
}

export function whatsappUrl(numara: string | null): string | null {
  if (!numara) return null
  return `https://wa.me/${numara.replace(/\D/g, '')}`
}

export function telefonUrl(numara: string | null): string | null {
  return numara ? `tel:${numara.replace(/\s/g, '')}` : null
}
