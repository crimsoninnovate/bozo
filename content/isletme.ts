import { iletisimiEnvdenOku } from '../lib/menu/iletisimEnv.ts'
import type { Isletme } from './types.ts'

/**
 * Tek gerçek kaynak. null olan alanlar işletmeden bekleniyor;
 * arayüz null gördüğünde yer tutucu basar ve bağlantı üretmez.
 * Değerler docs/tasarim/metin-envanteri.json içindeki isletmeGercekleri
 * listesinden gelir; dogrulanmisMi false olan her alan null kalır.
 * İletişim alanları (telefon, e-posta, sosyal hesaplar, yorum kodu) build'de menü belgesinden
 * gelir (`next.config.ts` > `NEXT_PUBLIC_ILETISIM`); aşağıdakiler tohum değerlerdir.
 */
const varsayilanIsletme: Isletme = {
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
  // Telefon ve WhatsApp aynı hat (numara menü belgesinde); sahibi 19 Ekim 2026'da siteden kaldırdı.
  // Açıp kapatmak panelde (menü belgesi > iletisim.telefonAcik); kapalıyken ikisi null.
  telefon: null,
  whatsapp: null,
  // Sahibi 24 Ağustos 2026'da verdi; gizlilik taleplerinin gittiği kanal da bu.
  eposta: 'bozo@cigercibozo.com',
  // Kullanıcı adı, tam URL değil: adresi `lib/site.ts` > `instagramUrl` kurar.
  // Sahibi 12 Ağustos 2026'da verdi; hesap henüz açılmadı, yayından önce açılmalı.
  instagram: 'cigercibozo',
  // Kullanıcı adları; adresleri `lib/site.ts` kurar. Sahibi 20 Ekim 2026'da verdi.
  facebook: 'cigercibozo',
  tiktok: 'cigercibozo',
  // Sahibinin 8 Ekim 2026'da verdiği Maps linkindeki özellik kimliğinden türetildi;
  // "Ciğerci Bozo" kartını açtığı tarayıcıda doğrulandı (IYILESTIRMELER.md > Google Maps kaydı).
  // Sahibinin 20 Ekim 2026'da verdiği g.page/r/.../review bağlantısının kodu.
  googleYorumKodu: 'CTdnn1lSkPrHEBM',
  googlePlaceId: 'ChIJHzzKSYdt3hQRN2efWVKQ-sc',
  alkolServisi: false,
  // Sitenin ona seslendiği tek ad; nüfustaki ad artık hiçbir yüzeyde geçmiyor
  // (sahibinin kararı, 23 Ağustos 2026).
  sahip: 'Bozo Çağlar',
}

// Düz `process.env.X` ifadesi: Next bunu build'de yazıya çevirir, ifade değişirse gömme çalışmaz.
export const isletme: Isletme = iletisimiEnvdenOku(process.env.NEXT_PUBLIC_ILETISIM, varsayilanIsletme)

/** Fiyatı arayüz metnine çevirir: 1200 → "1.200 TL". */
export function fiyatMetni(fiyat: number): string {
  return `${fiyat.toLocaleString('tr-TR')} TL`
}
