/** Menu page copy. Source: the data-en attributes of "Menu Sayfasi.dc.html". */
export const menu = {
  acilis: {
    baslik: 'Menu',
    spot: 'Everything comes off the fire. Seven portions, one special, eight on the house.',
  },
  ocakbasi: {
    baslik: 'From the Fire',
    imzaRozeti: 'signature',
    cigerSpec: { sis: '10 skewers', dagilim: '4 liver, 2 tail fat', sure: '3 minutes' },
    olculer: { porsiyon: 'Portion', durum: 'Wrap' },
    porsiyonNotu: {
      ciger: '10 skewers',
      dalak: '7 skewers',
      yurek: '7 skewers',
      'terbiyeli-tavuk-sis': '7 skewers',
      'terbiyesiz-tavuk-sis': '7 skewers',
      'terbiyeli-kusbasi': '7 skewers',
      'bozo-karisik': '10 skewers',
    } as Record<string, string>,
    durumNotu: {
      varsayilan: '5 skewers',
      ciger: '10 skewers',
      dalak: '7 skewers',
      yurek: '7 skewers',
      'terbiyeli-tavuk-sis': '7 skewers',
      'terbiyesiz-tavuk-sis': '7 skewers',
      'terbiyeli-kusbasi': '7 skewers',
    } as Record<string, string>,
    urunler: {
      ciger: {
        ad: 'Urfa Liver Kebab (Ciğer)',
        aciklama:
          'Urfa style. Cut to the size of a backgammon die, tail fat a touch smaller so no fat ' +
          'meets the tongue.',
      },
      dalak: {
        ad: 'Spleen (Dalak)',
        aciklama:
          'A classic of the Urfa offal line. Cut coarse, kept short over a high fire.',
      },
      yurek: {
        ad: 'Heart (Yürek)',
        aciklama:
          'A classic of the Urfa offal line. Firm-textured; the cut that holds its bite.',
      },
      'terbiyeli-tavuk-sis': { ad: 'Marinated Chicken Skewer (Terbiyeli Tavuk Şiş)' },
      'terbiyesiz-tavuk-sis': {
        ad: 'Chicken Skewer (Terbiyesiz Tavuk Şiş)',
        aciklama: 'From the thigh, with an Urfa marinade, tail fat between the pieces.',
      },
      'terbiyeli-kusbasi': {
        ad: 'Marinated Cubes (Terbiyeli Kuşbaşı)',
        aciklama: 'Rested in its marinade. The main alternative for guests who skip offal.',
      },
      'bozo-karisik': {
        ad: 'Bozo Mixed (Bozo Karışık)',
        aciklama: 'Three skewers of liver, three of spleen, three of heart and one of tail fat.',
      },
    },
    ozel: { ad: 'Bozo Special', miktarNotu: '200 g', aciklama: 'Two skewers, 200 g, of Urfa haşhaş kebab' },
  },
  ikramlar: {
    baslik: 'On the House',
    altMetin: 'The table comes set, you do not need to ask.',
    urunler: {
      lebeni: {
        ad: 'Lebeni Soup',
        aciklama: 'Yoghurt and thyme, no chickpeas. Served before the skewers.',
      },
      bostana: {
        ad: 'Bostana',
        aciklama: 'Finely chopped and juicy, with sour cherry juice and pomegranate molasses.',
      },
    },
    gruplar: { yesillik: 'Greens', sogan: 'Onion', kozde: 'From the Embers' },
    yesillikNotu: 'washed and picked over',
    ogeler: {
      nane: 'Fresh Mint',
      maydanoz: 'Parsley',
      sumakli: 'Sumac Onion',
      kozdeSogan: 'Ember-Roasted Onion',
      domates: 'Tomato',
      biber: 'Hot and Mild Peppers',
    },
  },
  icecekler: {
    baslik: 'Drinks',
    olculer: {
      kutu: 'Can',
      sise: 'Bottle',
      buyuk: 'Large',
      kucuk: 'Small',
      acikYayik: 'Churned, by the Glass',
      pet: 'Plastic',
      cam: 'Glass',
    },
    urunler: {
      kola: 'Cola',
      kolaZero: 'Cola Zero',
      fanta: 'Fanta',
      cappy: 'Cappy Flavours',
      ayran: 'Ayran',
      su: 'Water',
    },
    qrNotu: 'The QR menu on the table shows the same list',
  },
}
