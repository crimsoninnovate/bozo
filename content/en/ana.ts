/** Home page copy. Source: the data-en attributes of "Ana Sayfa Alternatif.dc.html". */
export const ana = {
  hero: {
    baslikSatir1: 'Dice-sized',
    baslikSatir2: 'liver',
    altBaslik: 'over oak embers',
    scrollIpucu: 'The proof is in the cut',
    saatEtiketi: 'Kyrenia · right now',
    ocakSoner: 'The fire goes out at 05:00.',
    kapanisaKalanKalibi: '{saat} hours {dakika} minutes to closing.',
    kapanisaKalanSaatKalibi: '{saat} hours to closing.',
    kapanisaKalanDakikaKalibi: '{dakika} minutes to closing.',
    kilometreTaslari: [
      { saat: '10:00', metin: 'the fire is lit, the door opens' },
      { saat: '21:00', metin: 'the night shift begins' },
      { saat: '05:00', metin: 'the last cut, the fire goes out' },
    ],
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
    altNot: 'Five dishes, two on the house: all from one fire',
    urunler: {
      // Handoff "a dice" yazıyor; tekil "die" ve aynı dosyanın diğer üç satırı
      // "backgammon die" diyor (en/ana.ts:12, en/hikaye.ts:21).
      ciger: {
        ad: 'Urfa Liver Kebab (Ciğer)',
        aciklama: 'Urfa style, cut to the size of a backgammon die; tail fat goes in between.',
      },
      dalak: {
        ad: 'Spleen (Dalak)',
        aciklama: 'Beside the liver, cut coarse: kept short over a high fire.',
      },
      yurek: {
        ad: 'Heart (Yürek)',
        aciklama: 'Firm textured; the cut that stays longest over the embers.',
      },
      'terbiyeli-kusbasi': {
        ad: 'Marinated Cubes (Terbiyeli Kuşbaşı)',
        aciklama: 'For guests who skip offal: same fire, same oak embers.',
      },
      'terbiyesiz-tavuk-sis': {
        ad: 'Chicken Skewer (Terbiyesiz Tavuk Şiş)',
        aciklama: 'From the thigh, with a marinade particular to Urfa.',
      },
    },
    fiyat: {
      baslik: 'The full list and prices are on the menu.',
      metin: 'Every item comes full, half or as a wrap. A half portion is half the full price.',
      menuLinki: 'The Full Menu',
    },
  },
  ikram: {
    baslik: 'The table comes set',
    metin: 'Lebeni and bostana are on the house. You do not need to ask.',
    cip1: { ad: 'Lebeni Soup', detay: 'yoghurt, thyme, no chickpeas' },
    cip2: { ad: 'Bostana', detay: 'sour cherry juice, pomegranate molasses' },
  },
  gece: {
    etiket: 'The fire is still lit',
    vardiyaEtiketi: 'Night shift',
    baslik: 'The fire burns while Kyrenia sleeps',
    metin: 'The same cut for the one leaving a shift and the one running late.',
    simdi: 'now',
    cizelgeSaatleri: ['10:00', '13:00', '16:00', '19:00', '22:00', '01:00', '04:00'],
    cizelgeNotlari: ['The fire is lit', 'Night shift after 21:00', '05:00 · the fire goes out'],
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
    haritaSokak: 'Naci Talat Street',
  },
}
