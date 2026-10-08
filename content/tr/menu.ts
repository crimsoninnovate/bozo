/** Menü sayfası metinleri. Kaynak: "Menu Sayfasi.dc.html". */
export const menu = {
  acilis: {
    baslik: 'Menü',
    spot: 'Hepsi tek ocakta pişer. Yedi porsiyon, bir özel, sekiz ikram.',
  },
  ocakbasi: {
    baslik: 'Ocakbaşı',
    imzaRozeti: 'imza ürün',
    cigerSpec: { sis: '12 şiş', dagilim: '4 ciğer, 2 kuyruk yağı', sure: '3 dakika' },
    /** Sahibinin fiyat listesinin ölçüleri (8 Ekim 2026); yalnız fiyatı olan basılır. */
    olculer: { porsiyon: 'Porsiyon', bucukPorsiyon: '1,5 Porsiyon', durum: 'Dürüm', bucukDurum: '1,5 Dürüm' },
    durumNotu: '5 şiş',
    urunler: {
      ciger: {
        ad: 'Ciğer',
        aciklama:
          'Urfa usulü. Tavla zarı büyüklüğünde doğranmış ciğer, aralarda ondan bir tık küçük ' +
          'kuyruk yağı; yerken ağza yağ gelmesin diye.',
      },
      dalak: {
        ad: 'Dalak',
        aciklama:
          'Urfa sakatat hattının klasiği. İri doğranır, yüksek ateşte kısa tutulur.',
      },
      yurek: {
        ad: 'Yürek',
        aciklama:
          'Urfa sakatat hattının klasiği. Sıkı dokulu; ısırınca dağılmayan tane.',
      },
      // Fiyat listesiyle açıklamasız geldi (8 Ekim 2026); açıklama uydurulmaz.
      'terbiyeli-tavuk-sis': { ad: 'Terbiyeli Tavuk Şiş' },
      'terbiyesiz-tavuk-sis': {
        ad: 'Terbiyesiz Tavuk Şiş',
        aciklama: "Buttan, Urfa'ya özgü marineyle. Aralara kuyruk yağı konur.",
      },
      'terbiyeli-kusbasi': {
        ad: 'Terbiyeli Kuşbaşı',
        aciklama: 'Terbiyesinde beklemiş kuşbaşı. Sakatat yemeyen misafir için ana alternatif.',
      },
      'bozo-karisik': {
        ad: 'Bozo Karışık',
        aciklama: 'Ciğer, dalak ve yürek bir arada.',
      },
    },
    // "Her üründen iki şiş · 10 şiş" yerine fiyat listesindeki "250 GR" (sahibi, 8 Ekim 2026).
    ozel: { ad: 'Bozo Special', miktarNotu: '250 gr' },
  },
  ikramlar: {
    baslik: 'İkramlar',
    altMetin: 'Sofra kurulu gelir, istemenize gerek yok',
    urunler: {
      lebeni: { ad: 'Lebeni Çorbası', aciklama: 'Yoğurt ve kekik, nohutsuz. Şişlerden önce gelir.' },
      bostana: { ad: 'Bostana', aciklama: 'İnce doğranmış, sulu. Vişne suyu ve nar ekşisiyle.' },
    },
    gruplar: { yesillik: 'Yeşillik', sogan: 'Soğan', kozde: 'Közde' },
    /** Yalnız yeşillik kümesinin altına düşer; sahibinin kendi ifadesi. */
    yesillikNotu: 'temizlenmiş ve ayıklanmış',
    ogeler: {
      nane: 'Taze Nane',
      maydanoz: 'Maydanoz',
      sumakli: 'Sumaklı Soğan',
      kozdeSogan: 'Közde Soğan',
      domates: 'Domates',
      biber: 'Acılı ve Acısız Biber',
    },
  },
  icecekler: {
    baslik: 'İçecekler',
    olculer: {
      kutu: 'Kutu',
      sise: 'Şişe',
      buyuk: 'Büyük',
      kucuk: 'Küçük',
      acikYayik: 'Açık Yayık',
      pet: 'Pet',
      cam: 'Cam',
    },
    urunler: {
      kola: 'Kola',
      kolaZero: 'Kola Zero',
      fanta: 'Fanta',
      cappy: 'Cappy Çeşitleri',
      ayran: 'Ayran',
      su: 'Su',
    },
    // Handoff "Masadaki" yazıyor; sofra/masa kilidi sert kural, kilit kazanır.
    qrNotu: 'Sofradaki QR menü aynı listeyi gösterir',
  },
}
