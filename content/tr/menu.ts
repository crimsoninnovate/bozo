/** Menü sayfası metinleri. Kaynak: "Menu Sayfasi.dc.html". */
export const menu = {
  acilis: {
    baslik: 'Menü',
    spot: 'Hepsi ocaktan çıkar. Altı porsiyon, bir özel, sekiz ikram.',
  },
  ocaktan: {
    baslik: 'Ocaktan',
    imzaRozeti: 'imza ürün',
    cigerSpec: { sis: '8 şiş', dagilim: '4 ciğer, 2 kuyruk yağı', sure: '3 dakika' },
    /** Üç ölçü her üründe aynı sırayla basılır; sahibinin Tam / Yarım / Dürüm mantığı. */
    olculer: { tam: 'Tam', yarim: 'Yarım', durum: 'Dürüm' },
    durumNotu: '5 şiş',
    yarimNotu: 'Yarım porsiyon tam fiyatın yarısıdır',
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
          'Urfa sakatat hattının klasiği. Ciğerin yanına, iri doğranmış: ' +
          'yüksek ateşte kısa tutulur.',
      },
      yurek: {
        ad: 'Yürek',
        aciklama:
          'Urfa sakatat hattının klasiği. Sıkı dokulu; korun üstünde en uzun ' +
          'kalan tane.',
      },
      'terbiyesiz-tavuk-sis': {
        ad: 'Terbiyesiz Tavuk Şiş',
        aciklama: "Kalçadan, Urfa'ya özgü marineyle. Aralara kuyruk yağı konur.",
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
    ozel: {
      ad: 'Bozo Special',
      aciklama: 'Her üründen iki şiş.',
      sisNotu: '10 şiş',
    },
  },
  ikramlar: {
    baslik: 'İkramlar',
    altMetin: 'Sofra kurulu gelir, istemenize gerek yok',
    urunler: {
      lebeni: { ad: 'Lebeni Çorbası', aciklama: 'Yoğurt ve kekik, nohutsuz. Ocaktan önce gelir.' },
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
    altMetin: 'İçecek fiyatları açılışta kesinleşir',
    olculer: {
      sise250: 'Şişe 250 ml',
      kutu330: 'Kutu 330 ml',
      sise: 'Şişe',
      kutu: 'Kutu',
      kapali: 'Kapalı',
      acikYayik: 'Açık Yayık',
    },
    urunler: {
      kola: 'Kola',
      kolaZero: 'Kola Zero',
      sprite: 'Sprite',
      fanta: 'Fanta',
      fuseTea: 'Fuse Tea Çeşitleri',
      cappy: 'Cappy Çeşitleri',
      ayran: 'Ayran',
      salgam: 'Şalgam',
      su: 'Su',
      cay: 'Çay',
    },
    // Handoff "Masadaki" yazıyor; sofra/masa kilidi sert kural, kilit kazanır.
    qrNotu: 'Sofradaki QR menü aynı listeyi gösterir',
  },
}
