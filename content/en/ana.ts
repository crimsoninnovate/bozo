/** Home page copy. Source: the data-en attributes of "Ana Sayfa Alternatif.dc.html". */
export const ana = {
  hero: {
    baslikSatir1: 'Dice-sized',
    baslikSatir2: 'liver',
    altBaslik: 'over oak embers',
    scrollIpucu: 'The proof is in the cut',
  },
  iddia: {
    baslik: 'You can tell a master by the cut',
    metin:
      'In Urfa you can tell a master by the cut. Liver diced as small as a backgammon die, ' +
      'evenly; the tail fat between them smaller still, so no fat meets the tongue.',
    sayac1: { deger: '8', etiket: 'skewers in one portion' },
    sayac2: { deger: '4+2', etiket: 'liver and tail fat per skewer' },
    sayac3: { deger: '3', etiket: 'minutes over high oak embers' },
  },
  ocaktan: {
    baslik: 'From the Fire',
    altNot: 'Five products, two on the house',
    urunler: {
      // Handoff "a dice" yazıyor; tekil "die" ve aynı dosyanın diğer üç satırı
      // "backgammon die" diyor (en/ana.ts:12, en/hikaye.ts:21).
      ciger: {
        ad: 'Urfa Liver Kebab (Ciğer)',
        aciklama: 'Urfa style, cut to the size of a backgammon die',
      },
      dalak: { ad: 'Spleen (Dalak)', aciklama: 'Portion details pending from the kitchen' },
      yurek: { ad: 'Heart (Yürek)', aciklama: 'Portion details pending from the kitchen' },
      'kuzu-sis': { ad: 'Lamb Skewer (Kuzu Şiş)', aciklama: 'For guests who skip offal' },
      'terbiyesiz-tavuk-sis': {
        ad: 'Chicken Skewer (Terbiyesiz Tavuk Şiş)',
        aciklama: 'From the thigh, with an Urfa marinade',
      },
    },
  },
  ikram: {
    baslik: 'The table comes set',
    metin: 'Lebeni and bostana are on the house. You do not need to ask.',
    cip1: { ad: 'Lebeni Soup', detay: 'chickpea, yoghurt, thyme' },
    cip2: { ad: 'Bostana', detay: 'sour cherry juice, pomegranate molasses' },
  },
  gece: {
    etiket: 'The fire is still lit',
    baslik: 'The fire burns while Kyrenia sleeps',
    metin: 'The same cut for the one leaving a shift and the one running late.',
    vardiyalar: ['21:00', '23:00', '01:00', '02:00', '03:00', '04:00'],
    sonNot: 'the fire goes out at 05:00',
  },
  bozo: {
    kicker: 'Engin Çağlar, at the fire every day',
    baslik: 'Bozo is not a brand name, it is a person',
    metin:
      'Engin Çağlar from Urfa has been called Bozo for years. He gave this place no name other ' +
      'than his own nickname, because he is at the fire, at the door and beside your table.',
    hikayeLinki: 'Read the Full Story',
  },
  konum: {
    baslik: 'Naci Talat Street, Kyrenia',
    saatNotu: 'Every day from 10:00 until 05:00 the next morning. Alcohol-free.',
    komsular: {
      soliBet: 'Soli Bet Casino, next door',
      hititBet: 'Hitit Bet, next door',
      // The design's "80 m" is unverified; the owner removed it. The name stays.
      macroMarket: 'Girne Macro Market',
    },
    haritaSokak: 'Naci Talat Street',
    haritaAltNot: 'map · dark theme, one marker',
  },
}
