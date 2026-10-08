import { isletme } from '../content/isletme.ts'
import type { Dil, Isletme } from '../content/types.ts'

/** Sitenin tek mutlak adresi; canonical, sitemap ve sosyal kartlar buradan kurulur. */
export const SITE_URL = 'https://cigercibozo.com'

export type RotaAnahtari = 'ana' | 'menu' | 'galeri' | 'hikaye' | 'konum' | 'gizlilik'

const YOLLAR: Record<RotaAnahtari, string> = {
  ana: '',
  menu: 'menu',
  galeri: 'galeri',
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

/**
 * Tarayıcıdaki yoldan dili okur. Yalnız 404'ün istemci tarafı kullanır; statik
 * export tek bir `out/404.html` ürettiği için sayfa hangi dilde istendiğini
 * sunucudan öğrenemez. Karşılaştırma dize öneki değil yol parçası üstünden:
 * 404 tam da uydurma yolları görür ve `/enfes-ciger/` İngilizce değildir.
 */
export function yoldanDil(yolAdi: string): Dil {
  return yolAdi === '/en' || yolAdi.startsWith('/en/') ? 'en' : 'tr'
}

export function tumYollar(): { anahtar: RotaAnahtari; tr: string; en: string }[] {
  return (Object.keys(YOLLAR) as RotaAnahtari[]).map((a) => ({
    anahtar: a,
    tr: yol(a, 'tr'),
    en: yol(a, 'en'),
  }))
}

/** "Ciğerci Bozo, Naci Talat Caddesi No:4, Girne, KKTC": Maps aramalarının metin hedefi. */
function adresMetni(isletmeVerisi: Isletme): string {
  // Cadde ile numara tek parça: "Naci Talat Caddesi, No:4" araması numarayı ayrı
  // bir bileşen sanır ve sonucu bozar.
  const sokak = isletmeVerisi.binaNo
    ? `${isletmeVerisi.cadde} ${isletmeVerisi.binaNo}`
    : isletmeVerisi.cadde
  return [isletmeVerisi.ad, sokak, isletmeVerisi.sehir, isletmeVerisi.ulke]
    .filter((parca): parca is string => Boolean(parca))
    .join(', ')
}

/** Google'daki işletme kartı (ad, saat, yorumlar). Place ID bilinmiyorken null. */
export function haritaUrl(isletmeVerisi: Isletme = isletme): string | null {
  const placeId = isletmeVerisi.googlePlaceId
  if (!placeId) return null
  const sorgu = encodeURIComponent(adresMetni(isletmeVerisi))
  return `https://www.google.com/maps/search/?api=1&query=${sorgu}&query_place_id=${placeId}`
}

/**
 * Yön tarifi: önce işletme kartına, sonra koordinata, en son adres aramasına.
 * `isletmeVerisi` parametresi yalnız testlerin gerçek veriyi değiştirmeden geri
 * dalları kapsayabilmesi için var; çağıranlar sıfır argümanla çağırır.
 */
export function yolTarifiUrl(isletmeVerisi: Isletme = isletme): string {
  const adres = encodeURIComponent(adresMetni(isletmeVerisi))
  // Hedef metin olmalı: koordinatla verilince Maps place ID'yi yok sayıp en yakın
  // kaydı ("Kıbrıs İnşaat") gösterdi, ölçüldü 8 Ekim 2026.
  if (isletmeVerisi.googlePlaceId) {
    return (
      `https://www.google.com/maps/dir/?api=1&destination=${adres}` +
      `&destination_place_id=${isletmeVerisi.googlePlaceId}`
    )
  }
  if (isletmeVerisi.koordinat) {
    const { enlem, boylam } = isletmeVerisi.koordinat
    return `https://www.google.com/maps/dir/?api=1&destination=${enlem},${boylam}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${adres}`
}

export function whatsappUrl(numara: string | null): string | null {
  if (!numara) return null
  return `https://wa.me/${numara.replace(/\D/g, '')}`
}

export function telefonUrl(numara: string | null): string | null {
  return numara ? `tel:${numara.replace(/\s/g, '')}` : null
}

/** `isletme.instagram` kullanıcı adıdır, tam URL değil; adres yalnız burada kurulur. */
export function instagramUrl(kullanici: string | null): string | null {
  return kullanici ? `https://instagram.com/${kullanici}` : null
}
