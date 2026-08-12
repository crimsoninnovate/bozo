/** Menu page copy. Source: the data-en attributes of "Menu Sayfasi.dc.html". */
export const menu = {
  acilis: {
    baslik: 'Menu',
    // Üçüncü cümle TR spotunda var, EN'de düşmüştü; sekiz "000 TL" onsuz
    // açıklamasız kalıyordu (tr/menu.ts:5).
    spot: 'Everything comes off the fire. Five products, two on the house. Prices are confirmed at opening.',
  },
  geceMenusu: {
    baslik: 'Night Menu',
    govde:
      'A named layer that simplifies after 01:00. ' +
      'Which items stay on the fire is not decided yet.',
  },
  ocaktan: {
    baslik: 'From the Fire',
    imzaRozeti: 'signature',
    cigerSpec: { sis: '8 skewers', dagilim: '4 liver, 2 tail fat', sure: '3 minutes' },
    urunler: {
      ciger: {
        ad: 'Urfa Liver Kebab (Ciğer)',
        aciklama:
          'Urfa style. Cut to the size of a backgammon die, tail fat a touch smaller so no fat ' +
          'meets the tongue.',
      },
      dalak: {
        ad: 'Spleen (Dalak)',
        aciklama: 'A classic of the Urfa offal line. Portion details pending.',
      },
      yurek: {
        ad: 'Heart (Yürek)',
        aciklama: 'A classic of the Urfa offal line. Portion details pending.',
      },
      'kuzu-sis': {
        ad: 'Lamb Skewer (Kuzu Şiş)',
        aciklama: 'The main alternative for guests who skip offal.',
      },
      'terbiyesiz-tavuk-sis': {
        ad: 'Chicken Skewer (Terbiyesiz Tavuk Şiş)',
        aciklama: 'From the thigh, with an Urfa marinade, tail fat between the pieces.',
      },
    },
  },
  ikramlar: {
    baslik: 'On the House',
    altMetin: 'The table comes set, you do not need to ask.',
    urunler: {
      lebeni: { ad: 'Lebeni Soup', aciklama: 'Chickpea, yoghurt and thyme. Served before the fire.' },
      bostana: {
        ad: 'Bostana',
        aciklama: 'Finely chopped and juicy, with sour cherry juice and pomegranate molasses.',
      },
    },
  },
  icecekler: {
    baslik: 'Drinks',
    altMetin: 'List to be confirmed by the kitchen',
    urunler: { ayran: 'Ayran', salgam: 'Şalgam', cay: 'Tea (çay)' },
    listeTamamlanacak: 'More to be added',
    qrNotu: 'The same list runs behind the table QR',
  },
  cekim: {
    baslik: 'Photography List',
    altMetin: 'Seven frames the menu is waiting for',
    aiGorselNotu: 'No AI generated food imagery is used. Slots stay dark until the shoot.',
  },
}
