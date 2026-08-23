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
}
