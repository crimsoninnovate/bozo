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
    // Handoff "Masadaki" yazıyor; sofra/masa kilidi sert kural, kilit kazanır.
    qrNotu: 'Sofradaki QR menü aynı listeyi gösterir',
  },
}
