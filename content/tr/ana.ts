/** Ana sayfa metinleri. Kaynak: "Ana Sayfa Alternatif.dc.html". */
export const ana = {
  hero: {
    baslikSatir1: 'Tavla zarı',
    baslikSatir2: 'ciğer',
    altBaslik: 'meşe korunda',
    scrollIpucu: 'İddianın kanıtı tanede',
  },
  iddia: {
    baslik: 'Ustayı tanesinden anlarsınız',
    metin:
      "Urfa'da ustayı tanesinden anlarsınız. Tavla zarı kadar küçük, eşit doğranmış ciğer; " +
      'aralara giren kuyruk yağı ondan da küçük, ki yerken ağza yağ gelmesin.',
    sayac1: { deger: '8', etiket: 'şiş, bir porsiyonda' },
    sayac2: { deger: '4+2', etiket: 'ciğer ve kuyruk yağı, her şişte' },
    sayac3: { deger: '3', etiket: 'dakika, yüksek meşe korunda' },
  },
  ocaktan: {
    baslik: 'Ocaktan',
    altNot: 'Beş ürün, iki ikram',
    urunler: {
      ciger: { ad: 'Ciğer', aciklama: 'Urfa usulü, tavla zarı büyüklüğünde' },
      dalak: { ad: 'Dalak', aciklama: 'Porsiyon detayı işletmeden bekleniyor' },
      yurek: { ad: 'Yürek', aciklama: 'Porsiyon detayı işletmeden bekleniyor' },
      'kuzu-sis': { ad: 'Kuzu Şiş', aciklama: 'Sakatat yemeyen misafir için' },
      'terbiyesiz-tavuk-sis': {
        ad: 'Terbiyesiz Tavuk Şiş',
        aciklama: "Kalçadan, Urfa'ya özgü marineyle",
      },
    },
  },
  ikram: {
    baslik: 'Sofra kurulu gelir',
    metin: 'Lebeni ve bostana ikramımızdır. Sofra kurulu gelir, istemenize gerek yok.',
    cip1: { ad: 'Lebeni Çorbası', detay: 'nohut, yoğurt, kekik' },
    cip2: { ad: 'Bostana', detay: 'vişne suyu, nar ekşisi' },
  },
  gece: {
    etiket: 'Ocak hala yanıyor',
    baslik: 'Girne uyurken ocak yanıyor',
    metin: 'Vardiyadan çıkana da, geç kalana da aynı tane.',
    vardiyalar: ['21:00', '23:00', '01:00', '02:00', '03:00', '04:00'],
    sonNot: "ocak 05:00'te söner",
  },
  bozo: {
    kicker: 'Engin Çağlar, her gün ocağın başında',
    baslik: 'Bozo bir marka ismi değil, bir insan',
    metin:
      "Urfalı Engin Çağlar'a yıllardır böyle seslenilir. Bu mekana kendi lakabından başka isim " +
      'düşünmedi; çünkü ocağın başında da, kapıda da, sofranızın yanında da o var.',
    hikayeLinki: 'Hikayenin Tamamı',
  },
  konum: {
    baslik: 'Naci Talat Caddesi, Girne',
    saatNotu: "Her gün 10:00'dan ertesi sabah 05:00'e kadar. Mekanımız alkolsüzdür.",
    komsular: {
      soliBet: 'Soli Bet Casino, yanımızda',
      hititBet: 'Hitit Bet, yanımızda',
      // Tasarımdaki "80 m" mesafesi doğrulanmadı, işletme sahibi kaldırdı; ad kalır.
      macroMarket: 'Girne Macro Market',
    },
    haritaSokak: 'Naci Talat Caddesi',
    haritaAltNot: 'harita · koyu tema, tek işaret',
  },
}
