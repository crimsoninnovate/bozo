/** Ana sayfa metinleri. Kaynak: "Ana Sayfa Alternatif.dc.html". */
export const ana = {
  hero: {
    baslikSatir1: 'Tavla zarı',
    baslikSatir2: 'ciğer',
    altBaslik: 'meşe korunda',
    scrollIpucu: 'İddianın kanıtı tanede',
    /* Sağ kolonun saat bloğu. UYGULAMA-NOTLARI 2, em dash ve şapkalı harf
       kurallara göre düzeltilerek alındı. */
    saatEtiketi: 'Girne · şu an',
    ocakSoner: "Ocak 05:00'te söner.",
    kapanisaKalanKalibi: 'Kapanışa {saat} saat {dakika} dakika.',
    kapanisaKalanSaatKalibi: 'Kapanışa {saat} saat.',
    kapanisaKalanDakikaKalibi: 'Kapanışa {dakika} dakika.',
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
  ocaktan: {
    baslik: 'Ocaktan',
    altNot: 'Beş ürün, iki ikram: hepsi tek ocakta',
    urunler: {
      ciger: {
        ad: 'Ciğer',
        aciklama: 'Urfa usulü, tavla zarı büyüklüğünde doğranır; arasına kuyruk yağı girer.',
      },
      dalak: { ad: 'Dalak', aciklama: 'Ciğerin yanına, iri doğranmış: yüksek ateşte kısa tutulur.' },
      yurek: { ad: 'Yürek', aciklama: 'Sıkı dokulu; korun üstünde en uzun kalan tane.' },
      'terbiyesiz-tavuk-sis': {
        ad: 'Terbiyesiz Tavuk Şiş',
        aciklama: "Kalçadan, Urfa'ya özgü marineyle.",
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
    haritaSokak: 'Naci Talat Caddesi',
  },
}
