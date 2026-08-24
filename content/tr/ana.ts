/** Ana sayfa metinleri. Kaynak: "Ana Sayfa Alternatif.dc.html". */
export const ana = {
  hero: {
    /* Rozetin üstündeki üç söz, logodan birebir (20 Ağustos 2026). */
    /* Üç parçalıydı; sahibi 24 Ağustos 2026'da "Ocak ve Sofra · Girne"yi
       kaldırıp Urfa vurgusunu öne çıkarmak istedi. Metin uydurulmadı, satırın
       kendi ilk parçası kaldı; öteki iki bilgi hemen altındaki meta şeritte var. */
    uberSatir: 'Urfa Usulü',
    /* v2: başlık üç satırdan ikiye indi, ikinci satır bakır tonda.
       Kaynak: header-hero-v2/SPEC.md §5. */
    baslikSatir1: 'Tavla zarı ciğer',
    baslikSatir2: 'meşe korunda',
    /* Sahibinin v2 tasarımıyla gelen metni. Tek olgusal iddia "on beşte bir". */
    govde:
      'Dört ciğer, iki kuyruk yağı. Şişi Bozo kendi diziyor, taneyi tavla zarı ' +
      'büyüklüğünde kesiyor, ocak on beşte bir tazeleniyor.',
    taneOlcusuEtiketi: 'Tane ölçüsü: dört ciğer, iki kuyruk yağı',
    servisEtiketi: 'servis %{yuzde}',
    scrollIpucu: 'İddianın kanıtı tanede',
    /* Sağ kolonun saat bloğu. UYGULAMA-NOTLARI 2, em dash ve şapkalı harf
       kurallara göre düzeltilerek alındı. */
    saatEtiketi: 'Girne · şu an',
    ocakSoner: "Ocak 05:00'te söner.",
    kapanisaKalanKalibi: 'Kapanışa {sure}.',
    // Türkçede sayıdan sonra çoğul eki gelmez; iki biçim bilerek aynı.
    kapanisaKalanBirimleri: {
      saat: { tekil: '{sayi} saat', cogul: '{sayi} saat' },
      dakika: { tekil: '{sayi} dakika', cogul: '{sayi} dakika' },
    },
    kilometreTaslari: [
      { saat: '10:00', metin: 'ocak yanar, kapı açılır' },
      { saat: '21:00', metin: 'gece vardiyası başlar' },
      { saat: '05:00', metin: 'son tane, ocak söner' },
    ],
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
  /*
   * UYGULAMA-NOTLARI 1.2 ve 3. Dalak ve Yürek'in açıklaması iç nottu
   * ("Porsiyon detayı işletmeden bekleniyor") ve yayında duruyordu; beşi de
   * notun önerdiği müşteri metniyle değişti. Em dash kural gereği iki nokta
   * veya noktalı virgüle çevrildi.
   */
  ocakbasi: {
    baslik: 'Ocakbaşı',
    altNot: 'Beş ürün, sekiz ikram: sofra kurulu gelir',
    urunler: {
      ciger: {
        ad: 'Ciğer',
        aciklama: 'Urfa usulü, tavla zarı büyüklüğünde doğranır; arasına kuyruk yağı girer.',
      },
      dalak: {
        ad: 'Dalak',
        aciklama: 'Urfa sakatat hattının klasiği; iri doğranır, yüksek ateşte kısa tutulur.',
      },
      yurek: { ad: 'Yürek', aciklama: 'Sıkı dokulu; ısırınca dağılmayan tane.' },
      'terbiyesiz-tavuk-sis': {
        ad: 'Terbiyesiz Tavuk Şiş',
        aciklama: "Buttan, Urfa'ya özgü marineyle.",
      },
      'terbiyeli-kusbasi': {
        ad: 'Terbiyeli Kuşbaşı',
        aciklama: 'Sakatat yemeyen misafir için: aynı ocak, aynı meşe koru.',
      },
    },
    /*
     * Fiyat sütunu kalktı; rakamlar listenin altında tek blokta toplanır.
     * Fiyatlar 13 Ağustos 2026'da geldi: blok artık "kesinleşmedi" demiyor,
     * ana sayfa beş kalemde kalsın diye rakamları menüye yönlendiriyor.
     */
    fiyat: {
      baslik: 'Tam liste ve fiyatlar menüde.',
      metin: 'Her üründe tam, yarım ve dürüm var. Yarım porsiyon tam fiyatın yarısıdır.',
      menuLinki: 'Menünün Tamamı',
    },
  },
  ikram: {
    baslik: 'Sofra kurulu gelir',
    metin: 'Lebeni ve bostana ikramımızdır. İstemenize gerek yok.',
    cip1: { ad: 'Lebeni Çorbası', detay: 'yoğurt, kekik, nohutsuz' },
    cip2: { ad: 'Bostana', detay: 'vişne suyu, nar ekşisi' },
  },
  /*
   * UYGULAMA-NOTLARI 4. Vardiya çipleri (21:00-04:00) yerini pencerenin
   * tamamını gösteren zaman çizelgesine bıraktı; çipler günün on beş saatinde
   * hiçbiri aktif olmadan duruyordu. `vardiyaEtiketi` büyük harfe CSS ile
   * çevrilir, sözlükte cümle düzeninde durur.
   */
  gece: {
    etiket: 'Ocak hala yanıyor',
    vardiyaEtiketi: 'Gece vardiyası',
    baslik: 'Girne uyurken ocak yanıyor',
    metin: 'Vardiyadan çıkana da, geç kalana da aynı tane.',
    simdi: 'şimdi',
    cizelgeSaatleri: ['10:00', '13:00', '16:00', '19:00', '22:00', '01:00', '04:00'],
    cizelgeNotlari: ['Ocak yanar', "Gece vardiyası 21:00'den sonra", '05:00 · ocak söner'],
  },
  bozo: {
    kicker: 'Bozo Çağlar, her gün ocağın başında',
    baslik: 'Bozo bir marka ismi değil, ta kendisi',
    metin:
      'Bu mekana kendi ismini verdi; çünkü ocağın başında da, kapıda da, ' +
      'sofranızın yanında da o var.',
    hikayeLinki: 'Hikayenin Tamamı',
  },
  konum: {
    saatNotu: "Her gün 10:00'dan ertesi sabah 05:00'e kadar. Mekanımız alkolsüzdür.",
    haritaSokak: 'Naci Talat Caddesi',
    // ODbL 1.0 lisansının istediği atıf; pazarlama metni değil, yasal zorunluluk.
    haritaKaynak: '© OpenStreetMap katkıcıları',
  },
}
