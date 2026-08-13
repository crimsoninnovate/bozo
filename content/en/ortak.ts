/**
 * Shared English copy. Values come from the data-en attributes of the
 * .dc.html handoff and from the ready English blocks in
 * docs/tasarim/metin-envanteri.json. English is the same voice in English,
 * never a machine translation of the Turkish.
 */
export const ortak = {
  marka: { ad: 'Ciğerci Bozo', kisa: 'Bozo' },
  nav: {
    anaSayfa: 'Home',
    menu: 'Menu',
    /** The page name from the design's drawer list; it returned with the route. */
    galeri: 'Gallery',
    gece: 'Night',
    hikaye: 'Story',
    konum: 'Location',
    ocaktan: 'From the Fire',
    ikramlar: 'On the House',
    icecekler: 'Drinks',
    gizlilik: 'Privacy',
  },
  /**
   * Screen readers only; the names of the icon-only controls. The design is not
   * marked up for assistive technology, so these two strings have no source.
   */
  erisim: {
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
    ara: 'Call',
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
    adresVeSaat: 'Kyrenia, Naci Talat Street No:4 · Every day 10:00 - 05:00',
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
    isimNotu: 'Bozo is the lifelong nickname of our founder, Engin Çağlar from Urfa.',
    adresBaslik: 'Address',
    sayfalarBaslik: 'Pages',
    saatlerBaslik: 'Hours',
    iletisimBaslik: 'Contact',
    sosyal: 'WhatsApp · Instagram',
  },
  sayfaMeta: {
    ana: {
      baslik: 'Ciğerci Bozo',
      aciklama:
        'Urfa style liver over oak embers. Kyrenia, Naci Talat Street. Every day 10:00 - 05:00.',
    },
    menu: {
      baslik: 'Menu · Ciğerci Bozo',
      aciklama: 'Six portions from the fire, wraps, eight on the house, and drinks.',
    },
    /** Built from the page's own two lines; see the Turkish file for the sources. */
    galeri: {
      baslik: 'Gallery · Ciğerci Bozo',
      aciklama: 'Sixteen frames the site is waiting for: the place and the dishes.',
    },
    hikaye: {
      baslik: 'Story · Ciğerci Bozo',
      aciklama: 'In Urfa, you can tell a master by the size of the cut.',
    },
    konum: {
      baslik: 'Location · Ciğerci Bozo',
      aciklama: 'Naci Talat Street, Kyrenia. Every day from 10:00 until 05:00 the next morning.',
    },
    gizlilik: { baslik: 'Privacy · Ciğerci Bozo', aciklama: 'How this site handles data.' },
  },
}
