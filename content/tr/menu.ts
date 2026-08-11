/** Menü sayfası metinleri. Kaynak: "Menu Sayfasi.dc.html". */
export const menu = {
  acilis: {
    baslik: 'Menü',
    spot: 'Hepsi ocaktan çıkar. Beş ürün, iki ikram. Fiyatlar açılışta kesinleşir.',
  },
  geceMenusu: {
    baslik: 'Gece menüsü',
    govde:
      '01:00 sonrası sadeleşen adlandırılmış katman. ' +
      'Hangi ürünlerin ocakta kalacağı henüz belli değil.',
  },
  ocaktan: {
    baslik: 'Ocaktan',
    imzaRozeti: 'imza ürün',
    cigerSpec: { sis: '8 şiş', dagilim: '4 ciğer, 2 kuyruk yağı', sure: '3 dakika' },
    urunler: {
      ciger: {
        ad: 'Ciğer',
        aciklama:
          'Urfa usulü. Tavla zarı büyüklüğünde doğranmış ciğer, aralarda ondan bir tık küçük ' +
          'kuyruk yağı; yerken ağza yağ gelmesin diye.',
      },
      dalak: {
        ad: 'Dalak',
        aciklama: 'Urfa sakatat hattının klasiği. Porsiyon detayı işletmeden bekleniyor.',
      },
      yurek: {
        ad: 'Yürek',
        aciklama: 'Urfa sakatat hattının klasiği. Porsiyon detayı işletmeden bekleniyor.',
      },
      'kuzu-sis': { ad: 'Kuzu şiş', aciklama: 'Sakatat yemeyen misafir için ana alternatif.' },
      'terbiyesiz-tavuk-sis': {
        ad: 'Terbiyesiz tavuk şiş',
        aciklama: "Kalçadan, Urfa'ya özgü marineyle. Aralara kuyruk yağı konur.",
      },
    },
  },
  ikramlar: {
    baslik: 'İkramlar',
    altMetin: 'Sofra kurulu gelir, istemenize gerek yok',
    urunler: {
      lebeni: { ad: 'Lebeni çorbası', aciklama: 'Nohut, yoğurt ve kekik. Ocaktan önce gelir.' },
      bostana: { ad: 'Bostana', aciklama: 'İnce doğranmış, sulu. Vişne suyu ve nar ekşisiyle.' },
    },
  },
  icecekler: {
    baslik: 'İçecekler',
    altMetin: 'Liste işletmeden gelince kesinleşir',
    urunler: { ayran: 'Ayran', salgam: 'Şalgam', cay: 'Çay' },
    listeTamamlanacak: 'liste tamamlanacak',
    // Handoff "Masadaki" yazıyor; sofra/masa kilidi sert kural, kilit kazanır.
    qrNotu: 'Sofradaki QR menü aynı listeyi gösterir',
  },
  cekim: {
    baslik: 'Çekim listesi',
    altMetin: 'Menünün beklediği yedi kare',
    aiGorselNotu:
      'Yapay zeka ile üretilmiş yemek görseli kullanılmıyor. ' +
      'Yuvalar çekim gelene kadar karanlık kalır.',
  },
}
