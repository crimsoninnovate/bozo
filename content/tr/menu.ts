/** Menü sayfası metinleri. Kaynak: "Menu Sayfasi.dc.html". */
export const menu = {
  acilis: {
    baslik: 'Menü',
    spot: 'Hepsi tek ocakta pişer. {kalem} porsiyon, bir özel, {ikram} ikram.',
  },
  ocakbasi: {
    baslik: 'Ocakbaşı',
    imzaRozeti: 'imza ürün',
    cigerSpec: { sis: '10 şiş', dagilim: '4 ciğer, 2 kuyruk yağı', sure: '3 dakika' },
    /** Sahibinin fiyat listesinin ölçüleri (8 Ekim 2026); yalnız fiyatı olan basılır. */
    olculer: { porsiyon: 'Porsiyon', durum: 'Dürüm' },
  },
  icecekler: {
    baslik: 'İçecekler',
    // Handoff "Masadaki" yazıyor; sofra/masa kilidi sert kural, kilit kazanır.
    qrNotu: 'Sofradaki QR menü aynı listeyi gösterir',
  },
  /** Tükenen kalemin fiyatı yerine basılır. */
  tukendi: 'Bugün yok',
}
