# Metin ve dil denetimi: Türkçe ve İngilizce

Tarih: 12 Ağustos 2026. Kapsam: `content/tr/*`, `content/en/*`, `content/*.ts` ve
`out/` altında gerçekten basılan metin (yedi sayfa, iki dil, 404 dahil). Kural
kaynağı: `docs/surec/KISITLAR.md` "Copy rules" bölümü ve
`docs/tasarim/metin-envanteri.json` (yazım kuralları, terminoloji kilitleri,
yasaklı ifadeler, hazır bloklar). Her EN ve TR dizesi handoff'un `data-en`
öznitelikleri ve TR gövde metinleriyle tek tek karşılaştırıldı.

Özet sayım: **2 metin ihlali** (biri hiç render edilmeyen bir dosyada), **1 teknik
glif ihlali** (kod yorumunda), karakter taramalarının tamamı temiz. Bunun dışındaki
bulgular öneri ve karar maddesidir.

---

## 1. İhlaller

### İ-1. "Masadaki QR menü": kilitli terminoloji, sofra/masa

- **Dosya:** `content/tr/menu.ts:52`, canlıda `/menu` İçecekler bölümünde basılıyor.
- **Ne yazıyor:** `Masadaki QR menü aynı listeyi gösterir`
- **Kural:** terminoloji kilidi "sofra kullanılır; masa kullanılmaz (yemek
  bağlamında)". KISITLAR bu kilidi sert katmana koyar; tasarım metni ise varsayılan
  katmandır ve kilit kazanır.
- **Kaynak durumu:** cümle `Menu Sayfasi.dc.html` içinde birebir var. Yani ihlal
  tasarımda doğmuş, port sadakatle kopyalamış. KISITLAR'ın "tasarımda gözden kaçmış
  görünen şeyi raporla" maddesi tam bu durumu tarif ediyor; şimdiye kadar kimse
  raporlamamış.
- **Öneri:** `Sofradaki QR menü aynı listeyi gösterir` (tek kelime değişir; kilidin
  kendi sözcüğü). QR fiziksel olarak masada durduğu için "yemek bağlamı sayılır mı"
  tartışması açılabilir; karar işletme sahibinin, ama site genelinde masa kelimesinin
  tek geçtiği yer burası ve sofra kelimesi aynı işi görüyor.

### İ-2. EN 404 "grill": ocak kilidinin İngilizcesi + kaynaksız metin

- **Dosya:** `content/en/hata.ts:7`
- **Ne yazıyor:** `This page is not on the grill.`
- **Kural:** iki ayrı ihlal. (a) Terminoloji kilidi "ocak, kor kullanılır; mangal,
  barbekü, ızgara kullanılmaz": grill, ızgaranın İngilizcesidir ve EN ses her yerde
  "the fire" der ("Which items stay on the fire", "From the fire", "at the fire").
  (b) "Yeni metin uydurulmaz": handoff'ta 404 tasarımı yok ve "grill" kelimesi beş
  kaynak dosyanın hiçbirinde geçmiyor. TR karşılığı "Bu sayfa ocakta yok." zaten
  doğru kelimeyi kullanıyor; EN'de ses kaymış.
- **Hafifletici:** statik export tek `404.html` üretir ve TR sözlüğü basılır
  (`app/global-not-found.tsx` yorumu bunu belgeler). Bu dize bugün hiçbir kullanıcıya
  görünmüyor; depo kusuru olarak duruyor.
- **Öneri:** `This page is not on the fire.` Mevcut cümlenin sesle uyumlu hali;
  "on the fire" kalıbı EN menü sayfasında zaten kurulu.

### İ-3. Kod yorumunda şapkalı harf glifi

- **Dosya:** `components/sayfa/konum/IletisimSatiri.tsx:29`
- **Ne yazıyor:** yorum satırında "her türlü durumda" anlamındaki kelime şapkalı
  yazımıyla duruyor (iki kez U+00E2 gömülü).
- **Kural:** "No circumflex accents." KISITLAR em dash için "kod noktasıyla anılabilir,
  glif gömülmez" istisnasını tanır; şapka için istisna tanımaz. Kullanıcıya
  görünmediği için teknik ihlaldir.
- **Öneri:** yorum "her durumda" diye yazılır, anlam kaybı yok.

### Temiz çıkan taramalar

Karakter düzeyinde, göz kararı değil grep ile:

- Em dash U+2014: `content/`, `components/`, `app/`, `lib/` ve `out/` genelinde 0.
  (`icerik.test.ts` bunu zaten mekanik olarak da kilitliyor.)
- Şapkalı harf: kullanıcıya basılan metinde 0 (tek istisna İ-3'teki yorum).
- Ünlem: iki dilde 0. Tamamı büyük harf cümle: 0 (TR/EN, KKTC, TRNC, QR, AI kısaltma;
  cümle değil).
- Saat biçimi: her görünümde `10:00 - 05:00`; saat eklerinin kesmesi doğru
  (10:00'da, 05:00'e, 05:00'te).
- Yasaklı ifadeler listesi (eşsiz lezzet, efsane, leziz, 7/24, Bozo's, Est., marka
  adının ürüne eklenmesi vb.): 0.
- Uydurulmuş fiyat, istatistik, mesafe: 0. "80 m" bilinçli çıkarılmış ve regresyon
  testi var.

---

## 2. Türkçe önerileri

Genel durum: TR metin envantere ve handoff'a birebir sadık, ses yerinde. Gece bloğu,
iddia bloğu ve Bozo bloğu envanterin en güçlü cümleleri ve bozulmadan taşınmış.
Sorunlar tasarımdan miras kalan üç noktada toplanıyor.

### T-1. "01:00 sonrası sadeleşen adlandırılmış katman"

- **Dosya:** `content/tr/menu.ts:10`, canlıda `/menu` gece menüsü kutusunda.
- **Sorun:** "adlandırılmış katman" marka kitabının iç terminolojisi (bilgi dosyası
  6.11 "Adlandırılmış menü katmanları" başlığından). Misafir bu iki kelimeyle ne
  yapacağını bilmez; spec dili sayfaya sızmış. Handoff'ta birebir böyle, yani tasarım
  gözden kaçırması.
- **Öneri:** `Gece menüsü 01:00 sonrası sadeleşir. Hangi ürünlerin ocakta kalacağı
  henüz belli değil.` İkinci cümle zaten mevcut; ilki mevcut cümlenin misafire dönük
  halidir, yeni iddia içermez.

### T-2. Harita alt yazısı tasarım anotasyonu olarak basılıyor

- **Dosya:** `content/tr/konum.ts:15` (`harita · koyu tema, tek işaret; canlı harita
  entegrasyonla gelir`) ve kısa hali `content/tr/ana.ts:63` (`harita · koyu tema,
  tek işaret`). İkisi de canlıda görünüyor.
- **Sorun:** "koyu tema, tek işaret" bir tasarım notudur, misafire bilgi vermez;
  "entegrasyonla gelir" geliştirici dilidir. Handoff'ta birebir var; orada yer tutucu
  plakasının üstünde anotasyon olarak duruyor ve üretime aynen taşınmış.
- **Öneri:** yalnız mevcut cümlenin alt kümesiyle: konumda `Canlı harita entegrasyonla
  gelir.`, ana sayfada satır tamamen düşebilir (plaka zaten "harita" olduğunu
  gösteriyor). Daha misafirce bir cümle isteniyorsa yeni metin gerekir ve işletme
  onayı ister; bu rapor uydurmuyor.

### T-3. "Pazartesi ile pazar"

- **Dosya:** `content/tr/ortak.ts:64`, saat tablolarında basılıyor.
- **Sorun:** Türkçede alışılmadık bir aralık kalıbı; doğal olanı "pazartesiden
  pazara"dır. Handoff'ta birebir var, bilgi de doğru; bu yüzden ihlal değil, kayıtlı
  sapma önerisi.
- **Öneri:** `Pazartesiden pazara`. Alternatif: satırı hiç değiştirmemek; tablo
  zaten "Bugün" satırıyla aynı saati gösteriyor.

### T-4. Envanterin en sıcak cümlesi sitede hiç yok

- **Dosya:** `content/tr/ortak.ts:70` `alkolsuz` anahtarı: `Mekanımız alkolsüzdür.
  Sofra ve ocak bizden, yine bekleriz.`
- **Sorun:** bu, envanterin "alkol sorusu yanıtı (menü sayfası)" için ayırdığı hazır
  blok. Sözlükte tanımlı, testten geçiyor, JS paketine giriyor ama hiçbir bileşen
  kullanmıyor; her yerde kısa hali (`alkolsuzKisa`) basılıyor.
  `components/sayfa/menu/Icecekler.tsx:32` yorumu kısa halin bilinçli olduğunu
  söylüyor. Sonuç: markanın en cömert cümlesi ("Sofra ve ocak bizden, yine
  bekleriz") sitenin hiçbir yerinde görünmüyor.
- **Öneri:** karar maddesi. Ya menü İçecekler bölümündeki alkolsüz satırı tam bloğa
  çıkar (envanterin öngördüğü yer orası), ya da anahtar ölü kayıt olarak silinir
  (no dead code). Mevcut ara durum iki kuralı da tatmin etmiyor.

### T-5. Küçük gözlemler (değişiklik istemez)

- "ki yerken ağza yağ gelmesin" (ana) ile "yerken ağza yağ gelmesin diye"
  (menü, hikaye) aynı gerekçenin iki kalıbı; ikisi de kaynaklı. Kulak "diye"
  kalıbını daha doğal buluyor ama ana sayfadaki envanter bloğunun aslı "ki"lidir,
  dokunulmaz.
- "Porsiyon detayı işletmeden bekleniyor": iç süreç dili ama dürüst ve açılış
  öncesi bir site için savunulabilir; yer tutucular bölümünde ele alındı.
- Ritim genel olarak iyi: cümleler kısa, sayılar taşıyıcı, tekrar eden kalıplar
  (aynı tane, ocak yanıyor, sofra kurulu gelir) bilinçli nakarat gibi çalışıyor ve
  sayfalar arasında tutarlı.

---

## 3. İngilizce önerileri

Genel durum: EN metin neredeyse tamamen handoff'un `data-en` özniteliklerinden
birebir alınmış; kalitesi tasarımın kalitesidir ve bu kalite şaşırtıcı derecede
iyi. "The proof is in the cut", "The fire burns while Kyrenia sleeps", "A nickname
is not chosen, it is given" çeviri değil, aynı sesin İngilizcesi. Yemek adları
kalıba uygun açıklanıyor, "Alcohol-free" EN ana sayfada görünür, footer "lifelong
nickname" cümlesini envanterden birebir taşıyor. Sorunlar noktasal ama ikisi ciddi.

### E-1. "cut to the size of a dice": dilbilgisi hatası + iç çelişki

- **Dosya:** `content/en/ana.ts:22`, canlıda EN ana sayfada imza ürün kartında.
- **Şu an:** `Urfa style, cut to the size of a dice`
- **Sorun:** İngilizcede tekil "die"dir; "a dice" yanlış. Aynı sayfanın iddia bloğu
  ve menü ile hikaye sayfaları üç ayrı yerde doğrusunu yazıyor: "backgammon die".
  Kart ayrıca tavla bağını da düşürmüş. Handoff'ta birebir böyle: tasarım hatası
  raporlanmadan kopyalanmış.
- **Öneri:** `Urfa style, cut to the size of a backgammon die`
- **Kaynak:** aynı handoff'un Menu ve Hikaye satırları ile envanterin tavla zarı
  kalıbı; yeni iddia yok.

### E-2. EN menüde fiyat açıklaması yok, ama her satır 000 TL

- **Dosya:** `content/en/menu.ts:5`
- **Şu an:** `Everything comes off the fire. Five products, two on the house.`
- **Sorun:** TR spot üç cümledir ve üçüncüsü "Fiyatlar açılışta kesinleşir."
  İngilizce spotta bu cümle yok; handoff'un data-en'inde de yok. Sonuç: EN menüde
  sekiz satır "000 TL" hiçbir açıklama olmadan basılıyor. İngilizce okur için site
  bitmemiş görünüyor; Türkçe okur için dürüst bir yer tutucu olan şey EN'de
  açıklamasız kalmış. Bu denetimin en ciddi EN bulgusu.
- **Öneri:** spota TR'deki cümlenin İngilizcesi eklenir: `Prices are set at
  opening.`
- **Kaynak:** mevcut TR cümlesi (`content/tr/menu.ts:5`); bilgi sitede zaten var,
  yalnız dili eksik.

### E-3. "A named layer that simplifies after 01:00."

- **Dosya:** `content/en/menu.ts:10`
- **Sorun:** T-1 ile aynı: "named layer" İngiliz okura hiçbir şey söylemiyor,
  iç terminoloji.
- **Öneri:** `The menu simplifies after 01:00. Which items stay on the fire is not
  decided yet.` İkinci cümle mevcut; ilki mevcut cümlenin misafire dönük hali.

### E-4. "The same list runs behind the table QR"

- **Dosya:** `content/en/menu.ts:58`
- **Sorun:** "runs behind" İngilizcede tuhaf düşüyor; QR'ın "arkasında koşan" bir
  liste imgesi doğal değil.
- **Öneri:** `The table QR shows the same list.` TR aslı zaten "gösterir" diyor;
  bu, mevcut cümlenin daha iyi İngilizcesi.

### E-5. Harita alt yazısı: "the live map arrives with the integration"

- **Dosya:** `content/en/konum.ts:15`
- **Sorun:** T-2'nin İngilizcesi; "with the integration" son kullanıcı için anlamsız
  geliştirici dili.
- **Öneri:** T-2 ile birlikte tek karar: EN karşılığı `The live map is on its way.`
  gibi bir cümle yeni metin sayılacağından, güvenli seçenek anotasyonun
  kısaltılmasıdır: `map · the live map arrives with the integration` yerine yalnız
  plaka etiketi. TR'de ne yapılırsa EN aynı kaderi paylaşmalı.

### E-6. Kullanılmayan güçlü kaynak: envanterin EN çekirdek bloğu

- **Kaynak:** `docs/tasarim/metin-envanteri.json` satır 49, "İngilizce çekirdek
  metin (EN hikaye / about bloğu)": "... In Urfa, you can tell a master by the size
  of the cut: dice-sized, even, always. We brought that measure to Girne and
  stretched its hours until five in the morning."
- **Sorun:** bu blok tam olarak EN hikaye sayfası için yazılmış; siteye yalnız
  footer cümlesi ("lifelong nickname") girmiş. "Neden Girne, neden sabahın beşi"
  sorusunun cevabını veren tek hazır EN cümlesi ("We brought that measure to
  Girne...") sitede hiç yok. EN hikaye sayfası şu an handoff'un data-en girişini
  kullanıyor; o da meşru bir kaynak, ama çekirdek bloğun en güçlü cümlesi boşta.
- **Öneri:** EN hikaye portre kartına veya girişine çekirdek bloktan bu cümlenin
  eklenmesi değerlendirilsin. Kaynak hazır blok, uydurma değil. Not: blok "Girne"
  der, sitenin EN'i tutarlı biçimde "Kyrenia" der; blok alınırsa bu tek kelimelik
  uyum kararı kayda geçmeli.

### E-7. "Five products, two on the house"

- **Dosya:** `content/en/ana.ts:20` ve `content/en/menu.ts:5`
- **Sorun:** "products" yemek için ticari ve soğuk bir kelime. Sitenin kendi EN
  metası zaten daha iyisini söylüyor: "Five dishes from the fire, two on the house,
  and drinks." (`content/en/ortak.ts:99`); fotoğraf etiketi de "five dishes, one by
  one" der.
- **Öneri:** sayfa metninde de `Five dishes, two on the house`. Handoff'tan kayıtlı
  sapma; kaynağı sitenin kendi meta satırı.
- **Kaynak:** `content/en/ortak.ts:99` ve `content/fotograflar.ts:21`.

### E-8. Karar maddeleri (uydurma gerektirdiği için öneri verilmiyor)

- **Şalgam açıklamasız:** EN içecek listesi `Ayran · Şalgam · Tea (çay)`. Ayran
  uluslararası tanınır, çay açıklanmış; şalgam İngiliz okur için tamamen opak.
  Açıklama kalıbı ("fermented turnip juice" gibi) yeni metin sayılır ve işletme
  onayı ister; kalıbın kendisi envanterde var ("ürün adları çevrilmez, açıklanır").
- **`content/en/ortak.ts:71`** "The table and the fire are on us, come again.":
  handoff'ta ve envanterde EN karşılığı olmayan, site içi yapılmış tek çeviri;
  "come again" kesik düşüyor. T-4'teki kullanım kararı verilmeden cilalamaya
  değmez: önce kullanılacak mı, sonra nasıl.

---

## 4. Tutarsızlıklar

1. **TR "işletmeden", EN "kitchen":** aynı bekleyen bilgi TR'de işletmeye, EN'de
   mutfağa bağlanıyor (`Porsiyon detayı işletmeden bekleniyor` / `Portion details
   pending from the kitchen`; `Liste işletmeden gelince kesinleşir` / `List to be
   confirmed by the kitchen`). İkisi de handoff kaynaklı; bilgi çelişmiyor, özne
   kayıyor. Düşük önem.
2. **EN ana ile EN menü arasında:** ana sayfa `Portion details pending from the
   kitchen`, menü `Portion details pending.` Handoff böyle; kozmetik.
3. **Fiyat açıklaması:** TR menüde var, EN menüde yok (E-2). Ana sayfada iki dilde
   de yok; beş kart açıklamasız `000 TL` gösteriyor (handoff ile uyumlu, ama E-2
   çözülürken ana sayfa da düşünülmeli).
4. **Ciğer kartı EN:** ana sayfa "a dice", diğer üç görünüm "backgammon die" (E-1).
5. **Kapalı aralık kalıbı TR'de iki türlü:** üst bar `Kapalı aralık: 05:00 - 10:00`,
   footer `Tek kapalı aralık 05:00 - 10:00`; EN tek kalıp kullanıyor (`Closed only
   between 05:00 and 10:00`). Bilgi tutarlı, kalıp çift. Düşük önem.
6. **Footer saat bloğu sayfadan sayfaya farklı:** ana ve gizlilik footer'ı "Tek
   kapalı aralık" satırını taşıyor, menü, hikaye ve konum taşımıyor. Handoff'un
   sayfa farklarıyla uyumlu; bilgi kaybı yok ama fark bilinçli mi belirsiz.
7. **Girne / Kyrenia:** EN tutarlı biçimde Kyrenia; "Girne Macro Market" özel ad
   olarak doğru biçimde Girne kalıyor. Tek gerilim E-6'daki envanter bloğunun
   "Girne" demesi; blok alınırsa karar gerekir.
8. **404 tek dilli:** EN kullanıcı 404'te Türkçe görür. Statik export sınırı,
   `app/global-not-found.tsx` içinde belgelenmiş; tutarsızlık değil, bilinçli
   sınırlama. Kayıt için burada.
9. **Adres, saatler, ürün adları, alkolsüz ibaresi, ikram tanımı:** TR ile EN
   arasında ve beş sayfa arasında çelişki yok. `adresTamSatir` ile JSON-LD adresi
   test ile kilitli.

---

## 5. Yer tutucular: dürüst mü görünüyor

- **Fiyat `000 TL`:** TR menüde "Fiyatlar açılışta kesinleşir" ile dürüst; sıfırlar
  bir tasarım kararı gibi okunuyor. EN menüde ve iki dilin ana sayfasında bu
  açıklama yok; oralarda site bitmemiş görünüyor. Çözüm E-2.
- **Telefon `000 000 00 00`:** en riskli yer tutucu. Konum sayfasının İletişim
  bölümünde, hero satırında, footer'da ve paket bloğunda gerçek numara pozisyonunda
  basılıyor; hiçbir dilde açıklaması yok. `null` değer bağlantı üretmiyor (doğru
  davranış) ama görünüş "unutulmuş numara". Fiyata "açılışta kesinleşir" diyen ses
  telefona hiçbir şey demiyor. Karar maddesi: ya numara gelene kadar satır
  gizlenir ya kısa bir açıklama eklenir (yeni metin, işletme onayı ister).
- **Fotoğraf yuvaları (16 kadraj):** en iyi çözülmüş yer tutucu. Kadraj etiketleri
  ("tane yakın çekimi", "ustanın eli") + "Yuvalar çekim gelene kadar karanlık
  kalır" + yapay zeka görseli reddi: bekleme hali marka duruşuna çevrilmiş.
- **İçecek listesi:** "Liste işletmeden gelince kesinleşir" ve "liste tamamlanacak"
  çipi dürüst; EN karşılıkları da yerinde.
- **Hikaye:** "burada kendi ağzından anlatılacak" açık bir söz veriyor; dürüst ve
  sesle uyumlu.
- **Gece menüsü:** "Hangi ürünlerin ocakta kalacağı henüz belli değil" dürüst;
  sorun yalnız önündeki spec cümlesi (T-1, E-3).
- **Harita:** dürüst ama anotasyon diliyle (T-2, E-5).

Toplam tablo: yer tutucu stratejisi tasarım gereği "gizle" değil "açıkla" yönünde
kurulmuş ve fotoğraflar ile içeceklerde çok iyi çalışıyor; telefon ve EN fiyat
bunun dışında kalmış iki delik.

---

## 6. İyi çıkanlar (ve neyin sınandığı)

- **Karakter taramaları:** em dash, şapkalı harf, ünlem, tamamı büyük cümle:
  kaynakta ve `out/` çıktısında grep ile tarandı, kullanıcı metninde sıfır.
- **Saat yazımı:** tüm görünümlerde `10:00 - 05:00`; kesme ekleri doğru; gün aşan
  saat uzun yazımı envanterdeki kalıpla birebir.
- **Terminoloji kilitleri:** misafir, ikram, ocak, kor, usta, tane, şiş, porsiyon,
  sofra tutarlı; müşteri, bedava, ücretsiz, mangal, ızgara, şef, aşçı, parça,
  lokma, adet, tabak, 7/24 sıfır. Tek kaçak İ-1'deki masa.
- **Yasaklı ifadeler:** yirmi maddelik listenin tamamı tarandı, sıfır. Abartı
  sıfatı yok, sayı ve ölçüyle konuşma ilkesi her sayfada işliyor.
- **Kaynak sadakati:** taranan her TR bloğu handoff'ta veya envanterde birebir
  bulundu; uydurulmuş pazarlama metni yok. Gizlilik ve 404 sayfaları kaynak dışı
  ama pazarlama değil, doğrulanabilir gerçek bildirimi (tek istisna İ-2'deki
  "grill" kelime seçimi).
- **EN zorunlulukları:** "Alcohol-free" EN ana sayfada görünür; "Bozo is the
  lifelong nickname of our founder, Engin Çağlar from Urfa." footer'da envanterden
  birebir; ürün adı kalıbı ("Urfa liver kebab (ciğer)") beş üründe de uygulanmış;
  Bozo'nun insan olduğu EN'de iki ayrı yerde açık.
- **EN sesin iyi anları:** "The proof is in the cut", "The fire burns while
  Kyrenia sleeps", "A nickname is not chosen, it is given", "the fire is the
  show": çeviri değil, ses. İngiliz okur tavla zarı ölçüsünü, kuyruk yağının
  neden küçük doğrandığını ve Bozo'nun kim olduğunu eksiksiz öğreniyor.
- **Mekanik güvence:** `content/icerik.test.ts` TR/EN anahtar paritesini, boş
  değeri, em dash'i, mesafe iddiasını, fiyat null kuralını ve kadraj etiketi
  benzersizliğini kilitliyor. Bu denetimin bulduğu ihlallerin hiçbiri mevcut
  testlerin kapsamında değildi; masa/grill benzeri kelime kilitleri test edilmiyor
  (istenirse İ-1 ve İ-2 çözümüyle birlikte kelime listesi testi eklenebilir).
