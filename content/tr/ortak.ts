/**
 * Sayfalar arasında paylaşılan metinler. Değerler design_handoff_bozo_website
 * altındaki .dc.html dosyalarından ve docs/tasarim/metin-envanteri.json içindeki
 * hazır bloklardan birebir alınır. Yeni pazarlama metni yazılmaz.
 */
export const ortak = {
  /** Kilit iki satır: üstte kategori satırı, altta isim (01-Logo-Final-Karar.md). */
  marka: { ad: 'Ciğerci Bozo', kategori: 'Ciğerci', kisa: 'Bozo' },
  nav: {
    anaSayfa: 'Ana Sayfa',
    menu: 'Menü',
    /** Tasarımın çekmece listesindeki sayfa adı; rota kurulunca geri geldi. */
    galeri: 'Galeri',
    gece: 'Gece',
    hikaye: 'Hikaye',
    konum: 'Konum',
    ocakbasi: 'Ocakbaşı',
    ikramlar: 'İkramlar',
    icecekler: 'İçecekler',
    gizlilik: 'Gizlilik',
  },
  /**
   * Yalnızca ekran okuyucu için; ikondan ibaret kontrollerin adı. Tasarım
   * yardımcı teknoloji için işaretlenmediğinden bu iki metnin kaynağı yoktur.
   */
  /**
   * Çerez onayı. KKTC 89/2007 Madde 11(2)(A): yurt dışına aktarım, kişinin
   * şüpheye yer bırakmayan onayıyla mümkün. GA4 veriyi Google'a aktardığı için
   * ölçüm onay ALINMADAN başlamaz. Tüzük Madde 5(7): bilgilendirme ve onay
   * ayrı ayrı yerine getirilir, o yüzden bant metni bilgilendirmenin yerine
   * geçmez, ona bağlanır.
   */
  cerez: {
    metin: 'Ziyaretleri ölçmek için çerez kullanıyoruz. Veriler yurt dışına aktarılır.',
    kabul: 'Kabul Et',
    ret: 'Reddet',
    detay: 'Ayrıntılar',
    etiket: 'Çerez onayı',
  },
  gizlilikBaglantisi: 'Gizlilik',
  erisim: {
    /** Alt bilgideki yapımcı işaretinin erişilebilir adı; işaretin kendisi aria-hidden. */
    yapimci: 'Siteyi yapan: Crimson Innovate',
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
    whatsapp: 'WhatsApp',
    /* Mobil barın orta düğmesi. "Menü" yerine sahibinin seçimi, 13 Ağustos 2026;
       "sofra" zaten kilitli terim. Hedef menü sayfası. */
    bozoSofrasi: 'Bozo Sofrası',
    telefon: 'Telefon',
    instagram: 'Instagram',
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
  ikramRozeti: 'ikram',
  telif: '© 2026 Ciğerci Bozo',
  footer: {
    tanim: 'Urfa usulü ciğer, meşe korunda.',
    adresBaslik: 'Adres',
    saatlerBaslik: 'Saatler',
    iletisimBaslik: 'İletişim',
  },
  /**
   * Rota başına sayfa başlığı ve açıklaması. Anahtarlar RotaAnahtari ile birebir eşleşir.
   * Title ve description SEO için genişletildi (24 Ağustos 2026, spec:
   * docs/specs/2026-08-24-seo-aeo-design.md); her cümle sitede zaten onaylı olan parçalardan
   * yeniden kuruldu, yeni metin yazılmadı.
   */
  sayfaMeta: {
    ana: {
      baslik: 'Ciğerci Bozo · Urfa Usulü Ciğer, Girne',
      aciklama:
        "Tavla zarı ciğer, meşe korunda. Girne, Naci Talat Caddesi. Her gün 10:00'dan ertesi " +
        "sabah 05:00'e kadar açığız. Mekanımız alkolsüzdür.",
    },
    menu: {
      baslik: 'Menü · Ciğerci Bozo, Girne',
      aciklama:
        'Hepsi tek ocakta pişer. Yedi porsiyon, dürümler, bir özel, sekiz ikram ve içecekler. ' +
        'Girne, her gün 10:00 - 05:00.',
    },
    /**
     * Açıklama sayfanın kendi iki satırından kuruldu: kare sayısı (galeri.altMetin)
     * ve site haritasındaki amaç satırı ("Mekan ve ürün fotoğrafları"). Fotoğraflar
     * gelmeden var gibi göstermemek için sayı öne alındı.
     */
    galeri: {
      baslik: 'Galeri · Ciğerci Bozo, Girne',
      aciklama:
        "Sitenin beklediği on yedi kare: mekan ve ürün fotoğrafları. Girne, Naci Talat " +
        "Caddesi'nde, her gün 10:00 - 05:00 açık.",
    },
    hikaye: {
      baslik: 'Hikaye · Ciğerci Bozo, Girne',
      aciklama:
        "Urfa'da ustayı tanesinden anlarsınız. Bozo Çağlar, her gün ocağın başında. " +
        'Girne, Naci Talat Caddesi.',
    },
    konum: {
      baslik: 'Konum · Ciğerci Bozo, Naci Talat Caddesi, Girne',
      aciklama:
        "Naci Talat Caddesi, Girne. Her gün 10:00'dan ertesi sabah 05:00'e kadar açığız. " +
        'Kapanış gece yarısını aşar, ertesi sabaha sarkar.',
    },
    gizlilik: {
      baslik: 'Gizlilik · Ciğerci Bozo',
      aciklama:
        'Ciğerci Bozo web sitesinde hangi verinin, neden ve hangi hukuki dayanakla işlendiği. ' +
        'Sitede form yoktur.',
    },
  },
}
