/** Menü sayfası metinleri. Kaynak: "Menu Sayfasi.dc.html". */
export const menu = {
  acilis: {
    baslik: 'Menü',
    spot: 'Hepsi tek ocakta pişer. Yedi porsiyon, bir özel, sekiz ikram.',
  },
  ocakbasi: {
    baslik: 'Ocakbaşı',
    imzaRozeti: 'imza ürün',
    cigerSpec: { sis: '10 şiş', dagilim: '4 ciğer, 2 kuyruk yağı', sure: '3 dakika' },
    /** Sahibinin fiyat listesinin ölçüleri (8 Ekim 2026); yalnız fiyatı olan basılır. */
    olculer: { porsiyon: 'Porsiyon', durum: 'Dürüm' },
    /** Dürümdeki şiş sayısı; ciğer 19 Ekim 2026'da sahibinden, öteki ürünlerin sayısı henüz teyitsiz. */
    durumNotu: { varsayilan: '5 şiş', ciger: '6 şiş' } as Record<string, string>,
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
        aciklama: 'Üç şiş ciğer, üç şiş dalak, üç şiş yürek, bir şiş kuyruk yağı.',
      },
    },
    // "Her üründen iki şiş · 10 şiş" yerine gramaj: 250 gr (8 Ekim 2026), 190 gr (11 Ekim 2026).
    ozel: { ad: 'Bozo Special', miktarNotu: '190 gr' },
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
