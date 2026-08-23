/** Hikaye sayfası metinleri. Kaynak: "Hikaye Sayfasi.dc.html". */
export const hikaye = {
  acilis: {
    ustyazi: 'Bozo Çağlar, her gün ocağın başında',
    baslik: 'Bozo bir marka ismi değil, ta kendisi',
    giris:
      "Urfa'da da burada da ona yıllardır Bozo denir. Bu mekana kendi lakabından " +
      'başka isim düşünmedi; çünkü ocağın başında da, kapıda da, sofranızın ' +
      'yanında da o var.',
  },
  portre: {
    kartBasligi: 'İsim',
    kartMetni:
      "Lakap seçilmez, verilir. Bozo, Urfa'nın ona yıllardır seslendiği isim; " +
      'tabela sadece herkesin zaten söylediğini yazıyor.',
    kartNotu: 'Adın hikayesi hemen aşağıda, kendi ağzından.',
  },

  /**
   * İşletme sahibinin 23 Ağustos 2026'da yazdığı anlatım (BozoRevizeler.pdf s.2-3).
   * Envanterden gelmeyen ikinci blok; düzenlemenin dökümü IYILESTIRMELER.md'de.
   */
  anlati: {
    baslik: "Bu hikaye Urfa'da başladı, Girne'de ateşle buluştu",
    imza: 'Ben Bozo Çağlar.',
    paragraflar: [
      'Urfalıyım. Ciğerin yalnızca bir yemek değil; sabahın ilk ışıklarıyla yakılan ' +
        'ateşin, dostlarla kurulan sofraların ve yıllardır değişmeyen bir geleneğin ' +
        'parçası olduğu topraklardan geliyorum.',
      "Çocukluğumdan beri Urfa'da iyi bir ciğerin ne demek olduğunu bilirim. Ateşi nasıl " +
        'olmalı, ciğer nasıl kesilmeli, şiş nasıl dizilmeli, lavaş ne zaman sofraya ' +
        'gelmeli... Çünkü bizim oralarda ciğer sadece pişirilmez; bir usulü vardır.',
      "Yıllar sonra yolum Kıbrıs'a, Girne'ye düştü. Burada kendime yeni bir hayat kurarken, " +
        'memleketimin en sevdiğim lezzetlerinden birini de yanımda getirmek istedim. Ama ' +
        'sıradan bir kebapçı açmak istemedim.',
      "Urfa'da nasıl yeniyorsa, Girne'de de öyle yensin istedim. Böyle doğdu Urfalı " +
        'Ciğerci Bozo.',
      'Bozo benim için yalnızca tabelaya yazılmış bir marka değil. Bu mekana kendi ismimi ' +
        'verdim; çünkü yaptığımız işin arkasında bizzat durmak istedim. Bu yüzden ' +
        'geldiğinizde beni sadece duvardaki bir fotoğrafta ya da tabelada görmeyeceksiniz.',
    ],
    vurgu: 'Ben buradayım.',
    yerler: ['Ocağın başında,', 'kapıda,', 'sofranızın yanında.'],
  },
  /**
   * İşletme sahibinin 19 Ağustos 2026'da yazdığı anlatımdan derlendi; envanterden
   * gelmeyen tek blok, gerekçesi CLAUDE.md > Copy rules.
   */
  lakap: {
    baslik: "Urfa'da yakınlık adı kısaltır",
    giris:
      "Urfa'da kardeşler ve arkadaşlar birbirine adıyla seslenmez; ad, ağızdan çıkarken " +
      'kısalır. Anne ve baba bunun dışındadır, küçük de büyüğüne böyle seslenmez: lakap ' +
      'yan yana duranlar arasında ve büyükten küçüğe doğru gider.',
    kisaltmaEtiketi: 'Kısaltma',
    kisaltmaNotu: 'Adı tam söylemek mesafe koymaktır.',
    lakapEtiketi: 'Lakap',
    lakapNotu: 'Ya da ada bir sıfat yapışır: kişi nasılsa öyle çağrılır.',
    /** Anahtarlar `content/lakaplar.ts` içindeki `tur: 'lakap'` kayıtlarının kimlikleri. */
    notlar: { kemal: 'yakışıklıya', ismail: 'boyu uzuna' },
    tanim: 'Sarışın, muzip, yerinde duramayan çocuğa Bozo derler.',
    kapanis:
      'Ben küçükken hem sarışındım hem yerimde duramazdım; abilerim ve arkadaşlarım bana ' +
      'Bozo, kimi zaman Bozani diye seslendi.',
  },
  usul: {
    // Tasarım "Usül" yazıyor; işletme sahibi bunun yazım hatası olduğunu onayladı.
    baslik: "Usul Urfa'dan",
    taneEtiketi: 'Tane',
    taneMetni:
      'Tavla zarı kadar küçük, eşit doğranmış ciğer. Aralara giren kuyruk yağı ondan da küçük; ' +
      'yerken ağza yağ gelmesin diye.',
    olcuEtiketi: 'Ölçü',
    olcuSisSayisi: '8 şiş, bir porsiyonda',
    olcuSisIcerigi: '4 ciğer + 2 kuyruk yağı, her şişte',
    olcuPisirme: '3 dakika, yüksek meşe korunda',
    saatEtiketi: 'Saat',
    saatMetni:
      "Ocak 10:00'da yanar, ertesi sabah 05:00'e kadar sönmez. " +
      'Vardiyadan çıkana da, geç kalana da aynı tane.',
  },
  sofra: {
    baslik: 'Sofra kurulu gelir',
    metin:
      'Lebeni ve bostana ikramımızdır, istemenize gerek yok. ' +
      'Mekanımız alkolsüzdür; gösteri ocağın kendisidir.',
    ctaKonum: 'Konum ve Saatler',
  },
  /** Anlatının kapanışı; aynı kaynak, sayfanın en sonunda durur. */
  kapanis: {
    baslik: 'Her gün',
    paragraflar: [
      'Şişlerimiz günlük hazırlanır. Ateşimiz yanar, lavaşımız sofraya gelir, közlenmiş ' +
        'biberin kokusu ciğerle buluşur. Bizim soframızda gösterişten çok lezzet, ' +
        'samimiyet ve Urfa usulü misafirperverlik vardır.',
      "Çünkü Bozo'da mesele yalnızca karnınızı doyurmak değil. Girne'nin ortasında, birkaç " +
        "lokmalığına da olsa size Urfa'da bir ciğer sofrasına oturmuşsunuz hissini yaşatmak.",
      "Memleketim Urfa'dan getirdiğim bu kültürü şimdi Girne'de yaşatıyorum.",
    ],
    hazir: ['Ateşimiz hazır.', 'Şişlerimiz hazır.', 'Soframız hazır.'],
    selamlama: 'Hoş geldiniz.',
    imza: 'Urfalı Ciğerci Bozo',
    imzaNotu: "Urfa'dan Girne'ye, ateşin başından sofranıza.",
  },
}
