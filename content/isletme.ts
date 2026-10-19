import type { Isletme } from './types.ts'

/**
 * Tek gerçek kaynak. null olan alanlar işletmeden bekleniyor;
 * arayüz null gördüğünde yer tutucu basar ve bağlantı üretmez.
 * Değerler docs/tasarim/metin-envanteri.json içindeki isletmeGercekleri
 * listesinden gelir; dogrulanmisMi false olan her alan null kalır.
 */
const TELEFONLA_ILETISIM_ACIK = false

export const isletme: Isletme = {
  ad: 'Ciğerci Bozo',
  kisaAd: 'Bozo',
  kategori: 'Urfa usulü ciğerci',
  cadde: 'Naci Talat Caddesi',
  sehir: 'Girne',
  ulke: 'KKTC',
  // Sahibi 12 Ağustos 2026'da tadilat belgesiyle teyit etti. Belge apartman adını da
  // taşıyor ("Şht. Özdemir Apt"), sahibi onu yazmamayı seçti: cadde + numara yeterli.
  binaNo: 'No:4',
  // Sahibi 24 Ağustos 2026'da Google Maps'ten verdi: kapıya yakınlaşılmış nokta
  // (20.62z), posta kodunu OpenStreetMap bağımsız teyit etti.
  postaKodu: '99300',
  koordinat: { enlem: 35.3370065, boylam: 33.3057253 },
  // Sahibi 12 Ağustos 2026'da verdi. Aynı numara WhatsApp hattı: KKTC mobil
  // hatları +90 ülke kodunu kullanır, wa.me baştaki sıfırsız uluslararası biçim ister.
  // Paket servis olmadığı için çağrı ve mesaj yükü arttı; sahibi 19 Ekim 2026'da ikisini
  // siteden kaldırdı. Geri açmak için TELEFONLA_ILETISIM_ACIK'ı true yapmak yeter.
  telefon: TELEFONLA_ILETISIM_ACIK ? '+90 533 888 74 24' : null,
  whatsapp: TELEFONLA_ILETISIM_ACIK ? '+90 533 888 74 24' : null,
  // Sahibi 24 Ağustos 2026'da verdi; gizlilik taleplerinin gittiği kanal da bu.
  eposta: 'bozo@cigercibozo.com',
  // Kullanıcı adı, tam URL değil: adresi `lib/site.ts` > `instagramUrl` kurar.
  // Sahibi 12 Ağustos 2026'da verdi; hesap henüz açılmadı, yayından önce açılmalı.
  instagram: 'cigercibozo',
  // Sahibinin 8 Ekim 2026'da verdiği Maps linkindeki özellik kimliğinden türetildi;
  // "Ciğerci Bozo" kartını açtığı tarayıcıda doğrulandı (IYILESTIRMELER.md > Google Maps kaydı).
  googlePlaceId: 'ChIJHzzKSYdt3hQRN2efWVKQ-sc',
  alkolServisi: false,
  // Sitenin ona seslendiği tek ad; nüfustaki ad artık hiçbir yüzeyde geçmiyor
  // (sahibinin kararı, 23 Ağustos 2026).
  sahip: 'Bozo Çağlar',
}

/** Fiyatı arayüz metnine çevirir: 1200 → "1.200 TL". */
export function fiyatMetni(fiyat: number): string {
  return `${fiyat.toLocaleString('tr-TR')} TL`
}
