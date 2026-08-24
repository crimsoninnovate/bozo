/**
 * Shared English copy. Values come from the data-en attributes of the
 * .dc.html handoff and from the ready English blocks in
 * docs/tasarim/metin-envanteri.json. English is the same voice in English,
 * never a machine translation of the Turkish.
 */
export const ortak = {
  /** Two-line lock: category line above, name below (01-Logo-Final-Karar.md). */
  marka: { ad: 'Ciğerci Bozo', kategori: 'Ciğerci', kisa: 'Bozo' },
  nav: {
    anaSayfa: 'Home',
    menu: 'Menu',
    /** The page name from the design's drawer list; it returned with the route. */
    galeri: 'Gallery',
    gece: 'Night',
    hikaye: 'Story',
    konum: 'Location',
    ocakbasi: 'From the Fire',
    ikramlar: 'On the House',
    icecekler: 'Drinks',
    gizlilik: 'Privacy',
  },
  /**
   * Screen readers only; the names of the icon-only controls. The design is not
   * marked up for assistive technology, so these two strings have no source.
   */
  cerez: {
    metin:
      'We would like to use Google Analytics to count visits. It writes a cookie ' +
      'to your browser and transfers the data to Google servers abroad. It does ' +
      'not start without your consent.',
    kabul: 'I accept',
    ret: 'No thanks',
    detay: 'Details',
    etiket: 'Cookie consent',
  },
  gizlilikBaglantisi: 'Privacy',
  erisim: {
    /** Accessible name of the maker's mark in the footer; the mark itself is aria-hidden. */
    yapimci: 'Site by Crimson Innovate',
    menuyuAc: 'Open the menu',
    menuyuKapat: 'Close the menu',
    /**
     * Navigation landmark names. Two separate regions, two separate names.
     * "Menu" is deliberately avoided: on this site the menu is the food, not
     * the navigation.
     */
    anaGezinme: 'Main navigation',
    mobilGezinme: 'Mobile navigation',
    /**
     * The accessible name of `role="dialog"`. The `<nav>` inside it already
     * carries mobilGezinme; reusing that name would make the two regions
     * indistinguishable. "Drawer" is the component's own domain word.
     */
    gezinmeCekmecesi: 'Navigation drawer',
    /** Skip link. Interface text, not marketing copy. */
    icerigeAtla: 'Skip to content',
  },
  dil: { tr: 'TR', en: 'EN', ayirici: '/' },
  cta: {
    yolTarifiAl: 'Get Directions',
    /** Mobile bottom bar. The design writes this button short; English follows suit. */
    yolTarifiKisa: 'Directions',
    menuyuGor: 'See the Menu',
    whatsapptanYaz: 'Message on WhatsApp',
    whatsapp: 'WhatsApp',
    bozoSofrasi: "Bozo's Table",
    telefon: 'Phone',
    instagram: 'Instagram',
  },
  durum: {
    acik: 'We are open',
    kapali: 'We are closed, opening at 10:00',
    kapaliKisa: 'We are closed',
    acikAlt: 'The fire is lit until 05:00',
    kapaliAlt: 'Closed only between 05:00 and 10:00',
    geceSerit: 'We are open through the night, the fire is lit',
  },
  satirlar: {
    adresKisa: 'Kyrenia, Naci Talat Street No:4',
    adresCadde: 'Naci Talat Street',
    adresBina: 'No:4',
    adresSehirUlke: 'Kyrenia / TRNC',
    adresTamSatir: 'Naci Talat Street No:4',
    saatlerGunluk: 'Every day 10:00 - 05:00',
    saatlerUzun: 'Every day from 10:00 until 05:00 the next morning',
    saatAraligi: '10:00 - 05:00',
    haftaAraligi: 'Monday to Sunday',
    kapaliAralik: 'Closed only between 05:00 and 10:00',
  },
  /** Same order as lib/saat.ts gunIndeksi: 0 = Sunday. */
  gunler: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  bugun: 'Today',
  alkolsuz: 'Our place is alcohol-free. The table and the fire are on us, come again.',
  alkolsuzKisa: 'Our place is alcohol-free',
  ikramRozeti: 'on the house',
  telif: '© 2026 Ciğerci Bozo',
  footer: {
    tanim: 'Urfa style liver over oak embers.',
    adresBaslik: 'Address',
    saatlerBaslik: 'Hours',
    iletisimBaslik: 'Contact',
  },
  /**
   * Title ve description SEO için genişletildi (24 Ağustos 2026, spec:
   * docs/specs/2026-08-24-seo-aeo-design.md); kaynak `footer.tanim` = "Urfa style liver over
   * oak embers.", zaten yayında olan birebir metin.
   */
  sayfaMeta: {
    ana: {
      baslik: 'Ciğerci Bozo · Urfa Style Liver, Kyrenia',
      aciklama:
        'Urfa style liver over oak embers. Kyrenia, Naci Talat Street. Every day from 10:00 ' +
        'until 05:00 the next morning. Our place is alcohol-free.',
    },
    menu: {
      baslik: 'Menu · Ciğerci Bozo, Kyrenia',
      aciklama:
        'Six portions from the fire, wraps, eight on the house, and drinks. Kyrenia, every ' +
        'day 10:00 - 05:00.',
    },
    galeri: {
      baslik: 'Gallery · Ciğerci Bozo, Kyrenia',
      aciklama:
        'Sixteen frames the site is waiting for: the place and the dishes. Kyrenia, Naci ' +
        'Talat Street, every day 10:00 - 05:00.',
    },
    hikaye: {
      baslik: 'Story · Ciğerci Bozo, Kyrenia',
      aciklama:
        'In Urfa, you can tell a master by the size of the cut. Bozo Çağlar, every day at ' +
        'the fire. Kyrenia, Naci Talat Street.',
    },
    konum: {
      baslik: 'Location · Ciğerci Bozo, Naci Talat Street, Kyrenia',
      aciklama:
        'Naci Talat Street, Kyrenia. Every day from 10:00 until 05:00 the next morning. ' +
        'Closed only between 05:00 and 10:00.',
    },
    gizlilik: { baslik: 'Privacy · Ciğerci Bozo', aciklama: 'How this site handles data.' },
  },
}
