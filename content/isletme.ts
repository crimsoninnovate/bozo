import type { Isletme } from './types.ts'

/**
 * Tek gerçek kaynak. null olan alanlar işletmeden bekleniyor;
 * arayüz null gördüğünde yer tutucu basar ve bağlantı üretmez.
 * Değerler docs/tasarim/metin-envanteri.json içindeki isletmeGercekleri
 * listesinden gelir; dogrulanmisMi false olan her alan null kalır.
 */
export const isletme: Isletme = {
  ad: 'Ciğerci Bozo',
  kisaAd: 'Bozo',
  kategori: 'Urfa usulü ciğerci',
  cadde: 'Naci Talat Caddesi',
  sehir: 'Girne',
  ulke: 'KKTC',
  // Handoff README'si (11 Ağustos 2026) ve dört tasarım dosyası da bu numarayı verir;
  // metin-envanteri.json bu alanı bilinmiyor sayar, daha eski ve daha az özel kaynaktır.
  binaNo: 'Şht. Özdemir Apt No:4',
  postaKodu: null,
  koordinat: null,
  telefon: null,
  whatsapp: null,
  eposta: null,
  instagram: null,
  alkolServisi: false,
  sahip: 'Engin Çağlar',
}

export const TELEFON_YER_TUTUCU = '000 000 00 00'
export const FIYAT_YER_TUTUCU = '000 TL'

/** Fiyatı arayüz metnine çevirir. Bilinmeyen fiyat yer tutucuya düşer. */
export function fiyatMetni(fiyat: number | null): string {
  return fiyat === null ? FIYAT_YER_TUTUCU : `${fiyat.toLocaleString('tr-TR')} TL`
}
