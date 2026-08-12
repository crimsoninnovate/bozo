/**
 * Sayfalar arasında paylaşılan metinler. Değerler design_handoff_bozo_website
 * altındaki .dc.html dosyalarından ve docs/tasarim/metin-envanteri.json içindeki
 * hazır bloklardan birebir alınır. Yeni pazarlama metni yazılmaz.
 */
export const ortak = {
  marka: { ad: 'Ciğerci Bozo', kisa: 'Bozo' },
  nav: {
    anaSayfa: 'Ana Sayfa',
    menu: 'Menü',
    /** Tasarımın çekmece listesindeki sayfa adı; rota kurulunca geri geldi. */
    galeri: 'Galeri',
    gece: 'Gece',
    hikaye: 'Hikaye',
    konum: 'Konum',
    ocaktan: 'Ocaktan',
    ikramlar: 'İkramlar',
    icecekler: 'İçecekler',
    gizlilik: 'Gizlilik',
  },
  /**
   * Yalnızca ekran okuyucu için; ikondan ibaret kontrollerin adı. Tasarım
   * yardımcı teknoloji için işaretlenmediğinden bu iki metnin kaynağı yoktur.
   */
  erisim: {
    menuyuAc: 'Menüyü aç',
    menuyuKapat: 'Menüyü kapat',
    /**
     * Gezinme landmarklarının adı. İkisi ayrı bölgedir ve ayrı ad taşır.
     * "Menü" kelimesi bilinçli olarak kullanılmadı: bu sitede menü yemek
     * listesidir, gezinme değil.
     */
    anaGezinme: 'Ana gezinme',
    mobilGezinme: 'Mobil gezinme',
    /**
     * `role="dialog"` erişilebilir adı. İçindeki `<nav>` zaten mobilGezinme
     * adını taşıyor; aynı adı ikinci kez vermek iki bölgeyi ayırt edilemez
     * kılardı. "Çekmece" bileşenin kendi alan adıdır (Cekmece.tsx).
     */
    gezinmeCekmecesi: 'Gezinme çekmecesi',
    /** Atlanan blok bağlantısı. Arayüz metni, pazarlama metni değil. */
    icerigeAtla: 'İçeriğe atla',
  },
  dil: { tr: 'TR', en: 'EN', ayirici: '/' },
  cta: {
    yolTarifiAl: 'Yol Tarifi Al',
    /** Mobil alt bar. Tasarımda ("Mobil Prototip.dc.html") bu buton kısa yazılır. */
    yolTarifiKisa: 'Yol Tarifi',
    menuyuGor: 'Menüyü Gör',
    whatsapptanYaz: "WhatsApp'tan Yaz",
    ara: 'Ara',
    whatsapp: 'WhatsApp',
    telefon: 'Telefon',
    instagram: 'Instagram',
    paketSiparis: 'Paket sipariş',
  },
  durum: {
    acik: 'Şu an açığız',
    kapali: "Şu an kapalıyız, 10:00'da açılıyoruz",
    /** Saat tablosunun dar hücresi için, `kapali`nin ilk cümleciği. Yeni metin değil. */
    kapaliKisa: 'Şu an kapalıyız',
    acikAlt: "Ocak 05:00'e kadar yanıyor",
    kapaliAlt: 'Kapalı aralık: 05:00 - 10:00',
    geceSerit: 'Gece açığız, ocak yanıyor',
  },
  satirlar: {
    adresKisa: 'Girne, Naci Talat Caddesi No:4',
    adresCadde: 'Naci Talat Caddesi',
    adresBina: 'No:4',
    adresSehirUlke: 'Girne / KKTC',
    adresTamSatir: 'Naci Talat Caddesi No:4',
    adresVeSaat: 'Girne, Naci Talat Caddesi No:4 · Her gün 10:00 - 05:00',
    saatlerGunluk: 'Her gün 10:00 - 05:00',
    saatlerUzun: "Her gün 10:00'dan ertesi sabah 05:00'e kadar",
    saatAraligi: '10:00 - 05:00',
    haftaAraligi: 'Pazartesi ile pazar',
    kapaliAralik: 'Tek kapalı aralık 05:00 - 10:00',
  },
  /** Sıra lib/saat.ts içindeki gunIndeksi ile aynıdır: 0 = Pazar. */
  gunler: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  bugun: 'Bugün',
  alkolsuz: 'Mekanımız alkolsüzdür. Sofra ve ocak bizden, yine bekleriz.',
  alkolsuzKisa: 'Mekanımız alkolsüzdür',
  porsiyon: 'porsiyon',
  ikramRozeti: 'ikram',
  telif: '© 2026 Ciğerci Bozo',
  paket: {
    baslik: 'Ocaktan çıkan',
    metin:
      'Paket kutuda gelir, sıcaklığını yolda korur. Ciğer soğumadan yenir; ' +
      'kutu ilk açıldığında hala kor sıcaklığındadır.',
    // Hizmet 12 Ağustos 2026'da henüz başlamadı; sipariş butonu yerine durum kartı
    // basılır. Kart olmadan paragraf açık bir hizmeti anlatıyor gibi okunuyordu.
    hizmetAdi: 'Paket servis',
    yakindaRozeti: 'yakında',
    simdilik: "Hizmet başlayana kadar ocağı arayabilir, WhatsApp'tan yazabilirsiniz.",
  },
  footer: {
    tanim: 'Urfa usulü ciğer, meşe korunda.',
    // Eskisi ("Bozo bir marka ismi değil, bir insandır.") ana sayfanın kendi bölüm
    // başlığıyla birebir aynıydı; footer'da aynı iddiayı gerekçesiz tekrar ediyordu.
    // Yenisi İngilizce satırın işini yapar: iddiayı değil kişiyi söyler.
    isimNotu: "Bozo, Urfalı Engin Çağlar'ın yıllardır taşıdığı lakap.",
    adresBaslik: 'Adres',
    sayfalarBaslik: 'Sayfalar',
    saatlerBaslik: 'Saatler',
    iletisimBaslik: 'İletişim',
    sosyal: 'WhatsApp · Instagram',
  },
  /** Rota başına sayfa başlığı ve açıklaması. Anahtarlar RotaAnahtari ile birebir eşleşir. */
  sayfaMeta: {
    ana: {
      baslik: 'Ciğerci Bozo',
      aciklama: 'Tavla zarı ciğer, meşe korunda. Girne, Naci Talat Caddesi. Her gün 10:00 - 05:00.',
    },
    menu: { baslik: 'Menü · Ciğerci Bozo', aciklama: 'Ocaktan beş ürün, iki ikram ve içecekler.' },
    /**
     * Açıklama sayfanın kendi iki satırından kuruldu: kare sayısı (galeri.altMetin)
     * ve site haritasındaki amaç satırı ("Mekan ve ürün fotoğrafları"). Fotoğraflar
     * gelmeden var gibi göstermemek için sayı öne alındı.
     */
    galeri: {
      baslik: 'Galeri · Ciğerci Bozo',
      aciklama: 'Sitenin beklediği on altı kare: mekan ve ürün fotoğrafları.',
    },
    hikaye: { baslik: 'Hikaye · Ciğerci Bozo', aciklama: "Urfa'da ustayı tanesinden anlarsınız." },
    konum: {
      baslik: 'Konum · Ciğerci Bozo',
      aciklama: "Naci Talat Caddesi, Girne. Her gün 10:00'dan ertesi sabah 05:00'e kadar.",
    },
    gizlilik: { baslik: 'Gizlilik · Ciğerci Bozo', aciklama: 'Bu sitenin veri yaklaşımı.' },
  },
}
