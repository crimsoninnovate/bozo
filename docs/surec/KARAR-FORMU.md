# Karar formu

`IYILESTIRMELER.md` > "Öneri, karar bekliyor" tablosu 22 satıra çıkmıştı ve düz bir
liste olarak okunmuyordu. Bu dosya aynı maddeleri kime ve ne zaman ait olduklarına
göre ayırır. Her maddede soru, seçenekler ve benim önerim var; "önerilen"i seçmek
istiyorsan tek kelime yeter.

Hazırlandı: 12 Ağustos 2026. Kaynak tablo `IYILESTIRMELER.md`, ölçümler orada.

Triyaj sonucu: **13 madde senin kararın**, 4 madde veri gelince açılacak, 3 madde
bilinçli ertelendi, 4 madde bizim teknik borcumuz (sana sormaya gerek yok),
2 madde zaten kapanmış ve listede bayat duruyordu.

---

## A. Senin kararın, şimdi

### A1. Kor okunuyor mu?

12 Ağustos'ta "kor pek anlaşılmıyor" demiştin. İki müdahale yapıldı ve ikisi de
ölçüldü: sitedeki CSS animasyonlarının hiçbiri koşmuyordu (`80ad3b6`), kor yatağı
düz gradyandan taneli bir yatağa çevrildi (`1451063`). Parlaklık hipotezi ölçülüp
çürütüldü, sahne zaten sönük değildi; eksik olan taneydi.

**Soru:** bugünkü haliyle kor okunuyor mu?
**Seçenekler:** (a) kapandı · (b) hâlâ sönük, yoğunluğu artıralım · (c) fazla, geri çekelim
**Önerim:** yok. Bu ölçümle kapanmaz, bakman gerekiyor. Ekran görüntüleri sohbette.

### A2. Buton ikincil kenarlığı: tek değer mi, boya göre mi?

Tasarımda hero'nun `xl` butonu `.4`, diğer dört buton `.36`. Bugün hepsi `.36`.

**Seçenekler:** (a) hepsi `.36` kalsın · (b) `xl` tasarımdaki `.4`'e dönsün
**Önerim: (a).** Fark 0.04 alfa, ekranda görünmüyor; tek değer bakımı ucuzlatıyor.

### A3. Buton birincil `md` gölgesi

Tasarımın menü şeridi butonunda gölge yok, bizim `Buton` her `birincil`'e kor
gölgesi basıyor. `md` boyu tasarımda yalnız orada geçiyor.

**Seçenekler:** (a) `md` gölgesiz olsun · (b) bugünkü gibi kalsın
**Önerim: (a).** Tek örnek olduğu için risk yok, tasarımla birebir olur.

### A4. Buton ikincil hover zemini, menü şeridinde

Tasarım menü şeridinde hover'da yalnız kenarlığı değiştiriyor; biz ayrıca hafif
tangerine zemin basıyoruz. Ama tasarımın diğer dört butonunda o zemin **var**.

**Seçenekler:** (a) bugünkü gibi kalsın · (b) menü şeridinde zemin düşsün
**Önerim: (a).** Menü şeridi tasarımın kendi içinde aykırı olan tek örnek.

### A5. Marka kelimesinin harf izi

Footer'larda aynı `800 20px` kelime iki değer taşıyor: `-.03em` (üç dosya) ve
`-.04em` (menü). İkisi de birebir uygulandı.

**Seçenekler:** (a) `-.03em`'e normalize et · (b) `-.04em`'e · (c) ikisi de kalsın
**Önerim: (a).** Çoğunluk üçe bir, ayırt edecek gerekçe yok.

### A6. Menü sayfasının üst bar CTA'sı nereye gitsin?

"Yol tarifi al" butonu tasarımda hedefsiz bir kutu. Bugün harici harita aramasına
bağlı, çünkü ana sayfadaki birebir aynı işaretleme de öyle bağlanmıştı.

**Seçenekler:** (a) harici harita araması (bugünkü) · (b) Konum sayfası
**Önerim: (a).** Buton harfi harfine "yol tarifi al" diyor, misafirin beklediği o.

### A7. Mobil footer: dört kolon mu, tasarımın kısa hali mi?

Mobil prototip footer'ı iki satır: marka kelimesi + "Urfa usulü ciğer, meşe korunda.
Girne, Naci Talat Caddesi. Her gün 10:00 - 05:00." Bizde 780px altında dört kolon
sarılarak akıyor.

**Seçenekler:** (a) tasarımın kısa iki satırı · (b) dört kolon kalsın
**Önerim: (a).** Cümle tasarımda birebir yazılı, uydurma değil; dar ekranda dört
sarılmış kolondan kısa bir imza daha iyi okunuyor.

### A8. Konum harita levhası, dar ekranda

390px'te üç POI çipi ve alt not sığıyor (ölçüldü). Tasarımın mobil levhası
etiketsiz, ama o levha ana sayfanınki, Konum sayfasının değil.

**Seçenekler:** (a) etiketler kalsın · (b) sade levhaya düş
**KAPANDI 18 Ağustos 2026:** ortada karar verilecek içerik kalmadı. Üç POI çipi ve alt
not levhadan silinmiş; bugün levhada yalnız cadde etiketi ile pin etiketi var.

### A9. Butona beşinci bir boy adımı açılsın mı?

Konum hero'sunun tasarımı mevcut boy merdiveninde karşılığı olmayan bir ara ölçek
istiyor (fark 1-2px). Sapma olarak kaydedildi.

**Seçenekler:** (a) kaydedildi kalsın · (b) yeni boy adımı açılsın
**Önerim: (a).** Tek örnek için üç sayfayı ilgilendiren bir API büyümesi.

### A10. Çağıranı olmayan sözlük anahtarları

`ortak.marka.kisa` ("Bozo"), `ortak.cta.whatsapptanYaz` ("WhatsApp'tan yaz"),
`ortak.satirlar.saatlerUzun`. Üçü de hiçbir yerden çağrılmıyor.

**Önerim, madde madde:**
- `saatlerUzun` **silinsin**: aynı cümlenin üçüncü kopyası, ikisi zaten elle yazılı.
- `whatsapptanYaz` **kalsın**: WhatsApp hattı 12 Ağustos'ta geldi ama bu CTA'yı
  basan bir yüzey henüz yok; şeritte kısa `WhatsApp` etiketi kullanılıyor.
- `cta.paketSiparis` (12 Ağustos'ta çağıransız kaldı) **kalsın**: paket servis
  "yakında", hizmet başladığı gün buton geri gelecek ve onaylı İngilizce
  karşılığı (`Order Takeaway`) yeniden yazılmak zorunda kalmasın.
- `marka.kisa` **senin kararın**: bugün ölü, ama kısa marka adı ileride sekme
  başlığı veya ikon için işe yarayabilir.

### A11. Galeri sayfasına bir spot cümlesi ister misin?

Sayfa bugün H1 "Galeri" + "Sitenin beklediği on altı kare" ile duruyor. Metin
envanterinde fotoğrafla ilgili hazır blok yok, uydurulmadı.

**Önerim:** bir cümle yaz, ben uydurmayayım. İstemezsen bugünkü hali kalır.

### A12. Prefetch açık mı kalsın?

İlk yüklemede 344 KB indirilip atılıyor; gerçekten kullanılan yük 176 KB. Kapatmak
sayfa geçişlerinin anındalığını götürür.

**Seçenekler:** (a) açık kalsın · (b) `prefetch={false}`
**Önerim: (a).** Site altı sayfa; geçiş hızı mobil veriden daha çok hissediliyor.

### A13. Üst barda 11px kırpılma: KAPANDI 12 Ağustos 2026

Sahibi onayladı, düzeltildi (`d50f16c`). Çözüm önerilenden farklı çıktı: "tek satır
CSS" tahminim yanlıştı, 780px sitenin mobil eşiği ve on yedi media query'de
geçiyor. Eşiğin yalnız `UstBar`'da taşınması 781-800 arasında hem nav'ı hem
hamburger'i gizlerdi, yani gezinmeyi tamamen düşürürdü; on yedisi birlikte 800px'e
taşındı. Ölçüm ayrıntısı `IYILESTIRMELER.md`'de.

<details><summary>Maddenin özgün hali</summary>

**Karar maddesi değil, kusur.** 781-793px arası dar bir bantta üst barın en sağdaki
"Yol tarifi al" butonu 792px'te bitiyor, viewport 781px, yani 11px kırpılıyor.
Bugün ölçüldü (kayıtta "781-802px" yazıyordu, gerçek bant 13px genişliğinde).
780px'te nav çekmeceye düşüyor ve sorun kendiliğinden kapanıyor.

**Önerim:** çekmeceye düşme eşiğini 780px'ten 800px'e çıkar. Bandı tamamen kapatır,
tek satır CSS, başka hiçbir genişliği etkilemez. Onay ver, yapayım.

</details>

---

## B. Veri gelince açılacak, şimdi cevap gerekmiyor

| # | Madde | Neyi bekliyor |
|---|---|---|
| B1 | `FotoYuvasi`: fotoğraf gelince köşe işaretleri ve vinyet düşsün mü? Marka aygıtı sessizce kaybolur | 16 fotoğraf |
| B2 | Menüdeki çekim listesi bölümü: silinsin mi, tek satırlık galeri bağlantısına mı insin? Bugün iki yüzey aynı yedi kareyi basıyor | 16 fotoğraf |
| ~~B3~~ | ~~`instagram` alanı kullanıcı adı mı tam URL mü?~~ **KAPANDI 12 Ağu 2026:** `cigercibozo`, kullanıcı adı olarak saklanıyor. Hesap henüz açık değil, yayın listesine madde olarak girdi | kapandı |
| ~~B4~~ | ~~`aria-disabled` telefon yer tutucuları~~ **KAPANDI 12 Ağu 2026.** Numara geldi, satırlar `<a>` oldu ve yeniden ölçüldü: 16.62:1 (koyu zemin), 8.27:1 (alt bilgi), 5.29:1 (pumpkin şerit). Aynı turda çıkan gerçek kusur kontrast değil dokunma hedefiydi (28px), o da 44px'e çıkarıldı | kapandı |

## C. Bilinçli ertelendi, erken açma

| # | Madde | Neden ertelendi |
|---|---|---|
| C1 | Konum hero'sunun boş sağ yarısı (1440px'te ~450x400px) | Harita levhası hâlâ yer tutucu; yer tutucunun etrafında yerleşim kararı vermek erken |
| C2 | Galeri ızgarasında öksüz kare (16 kare, 3 sütun) | Boş çerçevede öksüz satır, gerçek fotoğrafta olduğundan çok daha fazla göze batıyor |
| C3 | Menü ve çekim listesindeki öksüz satırlar | Tasarımın kendi ızgara kuralı aynı öksüzü üretiyor; düşük öncelik |
| C4 | Yasal metinler: aydınlatma metni, çerez politikası, `/gizlilik` güncellemesi | **Sahibinin kararı, 13 Ağustos 2026: gerek yok, backlogda kalsın.** Araştırma yapıldı ve kararı destekliyor: KKTC'de 89/2007 sayılı Kişisel Verilerin Korunması Yasası geçerli, GDPR değil; site bugün hiçbir takip, çerez veya form taşımıyor, yani toplanan veri yok. Analytics, iletişim formu veya rezervasyon eklendiği gün bu madde kendiliğinden açılır, `/gizlilik` bağlantısı da onunla birlikte geri gelir |

## D. Bizim teknik borcumuz, sana sormaya gerek yok

Üçü de "aynı değer birden çok yerde ham duruyor, token olmalı" maddesi. Tek onayla
hepsini bir turda kapatabilirim; görsel çıktı değişmez.

18 Ağustos 2026'da yeniden ölçüldü, üçünün de sayısı değişmişti:

- `letter-spacing:-0.015em`: **tek dosya, tek kullanım** (`hikaye/Usul.module.css:47`),
  eskiden "iki bileşen, dokuz kullanım" yazıyordu. Token'ı hâlâ yok.
- `rgba(242,233,220,.09)`: **iki kullanım** (`UstBar.module.css:235`,
  `AltBilgi.module.css:247`), dört değil. Token'ı hâlâ yok.
- `--kor-golge` mobil geometrisi (`0 8px 22px`): **repoda sıfır eşleşme**, madde düştü.
- `Cip` ortak boyut maddesi kısmen çözülmüştü, artık kapanabilir.

Bunlara 18 Ağustos denetiminde bir madde eklendi: token'ı olmayan dokuz krem alfası
(.015 .055 .07 .13 .17 .26 .28 .35 .42, 13 kullanım). Ölçüm ve dosya listesi
`IYILESTIRMELER.md` > 18 Ağustos.

## E. Kapandı, listede bayat duruyordu

- **Gizlilik rotasına site içi bağlantı.** Tabloda "kullanıcıya soruldu" diye
  duruyor ama bağlantı `TelifSeridi.tsx:35`'te üç footer varyantında da var.
- **İngilizce 404.** 12 Ağustos 2026'da çözüldü (`3659cfd`): `/en/` altındaki bozuk
  yollar artık İngilizce 404 döndürüyor, `<html lang>` ve sekme başlığı dahil.

---

## E. Menü verisi, 13 Ağustos 2026

Tam fiyat listesi geldi ve menü sayfası gerçek veriye geçti (ölçümler ve sapmalar
`IYILESTIRMELER.md` > "13 Ağustos 2026"). Üç madde uydurulamayacağı için sahibine
soruldu; **üçü de 13 Ağustos 2026'da yanıtlandı, hiçbiri kod değişikliği gerektirmedi.**

### E1. Kuzu Şiş: kalktı ✔

Sahibinin fiyat listesinde kuzu şiş yoktu, terbiyeli kuşbaşı vardı. Uygulamada kuzu
şiş çıkarılmış, hem ana sayfada hem menüde yerini terbiyeli kuşbaşı almış, kadraj
yuvası da yeni ürüne geçmişti.

**Karar:** "Terbiyeli olan yerini aldı." Kuzu şiş menüden kalktı, geri gelmiyor.

### E2. Çay: kalıyor ✔

Sahibinin içecek listesi soğuk raf listesiydi (şişe, kutu, ayran, şalgam, su); çay
onda yoktu ama sitede handoff'tan beri yayındaydı. Yayındaki ürünü tahminle silmemek
için listede bırakılmıştı.

**Karar:** "Çay kalsın." Liste bugünkü haliyle doğru.

### E3. Shot şalgam: yazılmayacak ✔

"Belki shot şalgam (fikrinizi almak istiyorum)" bir soruydu, siteye konmamıştı.
Öneri şalgamın ölçüsü olarak eklemekti.

**Karar:** "Shot Şalgam'ı yazma." Menüye girmiyor. Öneri reddedildi, madde kapandı.

---

## F. 18 Ağustos 2026 akşamı: logo

### F1. Şiş kilidi üst barda kalsın mı?

Yer tutucu (zar rayı + tek satır ad) yerine 10 Ağustos'ta karara bağlanan kilit
çizildi ve koda alındı: solda şiş işareti, sağda iki satır "Ciğerci" / "Bozo". Ölçümler
`IYILESTIRMELER.md` > "şiş kilidi üst bara geldi", çalışma sayfası sohbette.

**Seçenekler:** (a) kalsın, ikon / apple-icon / sosyal kart / alt bilgi de aynı çizimden
türesin · (b) tek satır ad + şiş işareti · (c) eski yer tutucuya dön
**Önerim: (a).** Kararın kendi kilidi; işaret markanın iddiasını (tane ölçüsü, 4+2)
taşıyor ve bar 197px ile eskisinden dar.

**Karar verildi 18 Ağustos 2026: (a).** `app/icon.svg` (16px basamağı, iki ciğer tanesi),
`app/apple-icon.png` (40px basamağı, üç tane), `public/sosyal-kart.png` (tam kilit) ve
alt bilgi (kararın "sadece kelime" varyantı, işaretsiz iki satır) aynı geometriden türetildi.

### F2. Kategori satırı "Ciğerci" hangi renk?

Uygulanan krem .74. Cilt 2 taslağının renk tablosu kategori satırını tangerine sayıyor.

**Seçenekler:** (a) krem .74 · (b) tangerine
**Önerim: (a).** Barda üçüncü bir vurgu olmuyor; iç sayfada tangerine aktif sekmeyle
yarışıyor. Fark tek satır CSS.

**Karar verildi 18 Ağustos 2026: (a) krem .74, değişiklik yok.**


### F3. İngilizce menü barı 961-1039px arasında sarıyor

Logodan bağımsız, canlıda bugün de var: EN menü barının içeriği 961px'te 1032px
istiyor. Nav etiketleri ve CTA iki satıra kırılıyor; iPad yatay (1024) bandın içinde.

**Seçenekler:** (a) mobil eşiği 1040'a taşı (yirmi üç media query birlikte; 961-1039
arası telefon düzeni alır) · (b) yalnız EN menü varyantında nav gap'ini daralt (20px
kazandırır, 50px eksik kalır, yetmez) · (c) EN nav etiketleri kısalsın (sözlük kararı)
**Önerim: (a).** Ölçülebilir tek tam çözüm; TR'de aynı band zaten 12px payla sığıyor.

**Karar verildi 18 Ağustos 2026: (a).** Yirmi dört media query ve `sizes` birlikte 1040'a
taşındı; 1041'de EN menü barı 1px, TR menü 82px, EN ana 81px payla sığıyor; 1040'ta hamburger.

### F4. Mobil eylem barı ilk ekranda görünsün mü?

Bar 120-240px kaydırma arasında içeri giriyor. Gerekçesi 13 Ağustos'ta hero'nun kendi
"Yol Tarifi Al" butonuydu; aynı gün o butonlar mobilde kaldırıldı. Ölçüldü (390, 360,
430): kaydırma 0'da ekrandaki tek eylemler marka, EN ve hamburger; bar 857px'te,
ekranın dışında. Mobil prototip barı hiç gizlemiyor. Azaltılmış harekette bar
zaten sıfırdan görünüyor.

**Seçenekler:** (a) `@supports` bloğunu sil, bar sıfırdan görünsün (prototip) · (b) kapı
kalsın, gerekçesi "temiz ilk ekran" diye yeniden yazılsın
**Önerim: (a).** İlk ekranda eylem olmaması, kaçındığı tekrarın kendisinden pahalı.
Bedeli hero'nun dibinde 54px'lik pil; hero içeriği 476'da bitiyor, çakışma yok.

**Karar verildi 18 Ağustos 2026: (a).** `@supports` bloğu ve `barGirisi` silindi; bar 390'da y=0'da 776'da, opaklık 1.


### F5. Mobil bölüm dolguları

`--bolum-dikey` 120px mobilde de geçerli; prototipin bölümleri 34-48px. Ölçüldü (390):
bölümler arası boşluk 168 / 169 / 172 / 240 / 240 / 240px, sayfanın %21.8'i dolgu.
56px ile (Ocaktan'ın kendi mobil değeri) sayfa %10 kısalıyor, boşluklar 104-112.

**Seçenekler:** (a) 960 altında `--bolum-dikey: 56px` · (b) olduğu gibi kalsın
**Önerim: (a).** Erit ve yoğunluk geçişleri boş zemin yerine içeriğin üstünde oynar.

**Karar verildi 18 Ağustos 2026: (a).** `tokens.css` 1040 altında `--bolum-dikey: 56px`; boşluklar 102-112px, sayfa 6701 > 6076.


### F6. Ocaktan satırının 20px kayması

Satır tıklanabilir değil ama hover'da 20px kayıp zemin alıyor. UYGULAMA-NOTLARI 3 bunu
açıkça istiyor; 12 Ağustos sabahı sen 12px kaymayı "tıkla demenin daha yüksek sesli
hali" diye kaldırtmıştın; ikisi çelişiyor. Dokunmadaki yapışma bu turda kapandı
(hover kapısı), kalan yalnız masaüstü.

**Seçenekler:** (a) kayma kalksın, .05 zemin kalsın (12 Ağustos'taki gözlemin) ·
(b) not uygulandığı gibi kalsın
**Önerim: (a).** Satırın gidecek yeri yok; kayma bir vaat.

**Karar verildi 18 Ağustos 2026: (a).** Kayma kalktı, .05 zemin duruyor; ölçüldü hover'da transform none.


### F7. Gece ufuk korunun gücü

Notun değeri `.3` alfa (uygulanan, artık 8s nefesli). Kurgu merceği Gece'nin sayfanın en
karanlık ekranı olduğunu ölçtü: sabit sahnenin 1.25 tepesi opak zeminin arkasında.
Yatağın `.78`/`.2` duraklarını ve %70 yüksekliği öneriyor.

**Seçenekler:** (a) `.3` kalsın · (b) yatağın gücüne çıksın
**Önerim: (a), ekran görüntüsünü gördükten sonra karar.** Not "gece hissi ışıktan gelir"
diyor ama gücü de kendisi seçmiş; nefes tek başına bölümü canlandırıyor.

**Karar verildi 18 Ağustos 2026: (a) .3 kalır.**


### F8. Mobilde kor eğrisi

Mobil prototipte `data-yogunluk` yok; kor sayfanın iki ucunda .90, ortasında .55 (U
eğrisi). Portta masaüstü merdiveni mobilde de geçerli: hero .86'dan Konum .468'e iniyor,
yani mobil sayfanın CTA ucu en sönük yer.

**Seçenekler:** (a) merdiven kalsın, karar kayda geçsin · (b) 960 altında prototipin
U eğrisi
**Önerim: (a).** Tek model, iki ekran; U eğrisi Konum'u yeniden ısıtır ama Gece'nin
tepe olma fikrini mobilde bozar.

**Karar verildi 18 Ağustos 2026: (a) merdiven kalır, kayıt bu.**


### F9. Kor yoğunluğu: basamak mı, rampa mı?

Kor yatağı `data-yogunluk` değerini görünümün ortasına en yakın bölümden alıyor: altı
bölüm sınırında tek karede -18 / -8 / +16 / 0 / -29 / -6% ısı adımı, sonra 0.9s'lik
kuyruk; aralarda 700-850px düz. Tasarımın kendi `cerceve()`si de böyle. Kurgu merceği
iki komşu merkez arasında ağırlıklı ortalama öneriyor: her bölüm merkezinde tablo değeri
aynı, aralarda rampa.

**Seçenekler:** (a) basamak kalsın (tasarımın modeli, bölüm okunurken durağan ruh hali) ·
(b) rampa (`lib/cerceve.ts`'te on satır, boncuk rayı değişmez)
**Önerim: (b), ama ekranda gördükten sonra.** Rampa ateşi "olay" olmaktan çıkarıp zemine
alır; azaltılmış harekette de basamak hiç kalmaz.

**Karar verildi 18 Ağustos 2026: (b).** `lib/cerceve.ts` iki komşu merkez arasında ağırlıklı ortalama; ölçüldü 0-800px: .86 / .795 / .731 / .666 / .606, basamak yok.


### F10. Gün merdiveninde imleç ile satırlar

İmleç `top = anlık yüzde` ile hareket ediyor, üç satır eşit aralıklı; 21:00'de imleç
kendi satırının 7.8px altında, 04:59'da 10.4px altında ve çizginin 4px dışında.
Sapma satır boyunun altında (12px kare satırla hâlâ çakışıyor); tasarımın kendi merdiveni
de aynı model.

**Seçenekler:** (a) olduğu gibi kalsın · (b) satırlar gerçek yüzdelerine otursun (69/51px
eşit olmayan aralık) · (c) satırlar dursun, imleç üç satır merkezine parça parça eşlensin
**Önerim: (c).** Görünüm değişmez, imleç 21:00'de 21:00 satırının üstünde durur.

**Karar verildi 18 Ağustos 2026: (c).** İmleç üç satır merkezine parça parça eşlenir; 21:00'de imleç merkezi = satır merkezi (443.3 / 443.3).
