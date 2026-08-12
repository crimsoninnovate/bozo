# İç sayfalar UX, arayüz ve hareket denetimi

12 Ağustos 2026. `ux-hareket-denetimi.md`'nin (ana sayfa) devamı. Kapsam: menü,
hikaye, konum, galeri, 404. Gizlilik de tarandı, temiz çıktı.
Ölçüm ortamı: `next dev`, 1440x980 masaüstü, 390x844 mobil, TR ve EN.

## Özet

Sayısal taban beş sayfada da temiz. Üç bulgunun üçü de karar gerektiriyor ve
üçü de aynı sebepten: tasarımın çizmediği ya da eksik bıraktığı yerler.

| Bulgu | Sayfa | Etki | Kaynak | Durum |
|---|---|---|---|---|
| S1 Hero'nun sağ yarısı boş | konum | orta | tasarım, ama ana sayfayla tutarsız | ertelendi, gerçek harita bekleniyor |
| S2 Izgarada öksüz kare | galeri | orta | bizim, tasarımı yok | ertelendi, fotoğraflar bekleniyor |
| S3 Sayfada marka yok | 404 | orta | bizim, tasarımı yok | **uygulandı** (`8094109`) |
| S4 Öksüz satır | menü | düşük | tasarımın kendi kuralı | dokunulmadı, kayıtta |
| S5 İngilizce 404 Türkçe geliyor | 404 | orta | bizim, kayıtlı ama açık | sahibine |

S1 ve S2'nin ertelenme gerekçesi ortak: ikisi de yer tutucu içeriğin etrafında
yerleşim kararı vermeyi gerektiriyor. Konum hero'sunun sağını neyle
dolduracağımıza karar vermek, harita levhası hâlâ "canlı harita entegrasyonla
gelir" yazan boş bir kutuyken erken; galeride de on altı boş çerçevedeki öksüz
satır, on altı gerçek fotoğraftakinden çok daha fazla göze batıyor. İkisinde de
gerçek içerik geldiğinde denge değişecek. Karar maddeleri
`IYILESTIRMELER.md`'de.

## Ölçülen ve temiz çıkan

Beş sayfanın hepsinde:

- **Dokunma hedefi:** 44px altında tek bir gerçek hedef yok. Ölçüm hem kutuyu
  hem `::before`/`::after` isabet alanını sayıyor.
- **`transition: all`:** 0. Yerleşim özelliği (`width`, `height`, `top`,
  `padding`, `font-size`) canlandıran geçiş: 0.
- **Yatay taşma:** 390px'te yok. Gizlilik dahil altı sayfa.
- **Kontrast:** AA eşiğinin altında kalan tek öğe ailesi `aria-disabled`
  telefon yer tutucuları (2.62:1 ve 3.14:1). WCAG 1.4.3 etkin olmayan
  bileşenleri muaf tutuyor. Ana sayfadaki F5 ile aynı madde, numara gelince
  hepsi birlikte ölçülecek.
- **Başlık hiyerarşisi:** doğru. Menüde H3 "Ciğer" (54px) H2 "Ocaktan"dan
  (48px) büyük, ama bu tasarımın imza ürün kararı (`Menu:109`
  `clamp(34px,4vw,54px)`, Dalak `clamp(24px,2.2vw,30px)`) ve başlık seviyesi
  punto değil belge yapısı bildirir. Bulgu değil.
- **Hareket:** her sayfada kor sahnesi koşuyor. `emberSoft` yalnız `opacity`
  canlandırıyor; galeride 18 eşzamanlı örnek var, compositor işi olduğu için
  ölçülebilir bedeli yok.
- **EN sayfaları:** `lang="en"` doğru, taşma yok, H1'ler çevrilmiş.

## S1: Konum hero'sunun sağ yarısı boş

Etki: orta. Karar sahibinin.

1440px'te H1 ve altındaki blok x=108 ile 640 arasında duruyor, x=640 ile 1090
arası tamamen boş: yaklaşık 450x400 piksel. Tasarım burada tek sütunlu bir blok
çiziyor (`Konum Sayfasi.dc.html:63`: durum çipi, saat, H1, adres, iki buton) ve
sağa hiçbir şey koymuyor.

Bu tek başına bir kusur değildi. Kusur hale gelmesinin sebebi bizim kendi
düzeltmemiz: ana sayfanın hero'sunda **birebir aynı boşluk** vardı ve 12 Ağustos
13:39'da tane alanıyla dolduruldu (`01d42ee`, `IYILESTIRMELER.md`). Şimdi iki
hero aynı kalıbı paylaşıyor ama biri dolu, öteki boş.

Üç seçenek, hiçbiri sessizce uygulanmamalı:

1. Ana sayfadaki gibi doldurmak. Ama oraya konan şey sayfanın iddiasıydı
   ("iddianın kanıtı tanede"); konumun iddiası ne, ayrıca kararlaştırılmalı.
2. Harita levhasını yukarı, hero'nun sağına almak. Sayfanın asıl içeriği zaten
   o ve şu an ayrı bir bölümde duruyor.
3. Olduğu gibi bırakmak, tasarıma sadık kalmak.

## S2: Galeri ızgarasında öksüz kare

Etki: orta. Karar sahibinin.

16 kare, `repeat(auto-fit, minmax(280px, 1fr))` (`galeri/Izgara.module.css:6`).
1440px'te kapsayıcı 1180px ve ızgara 3 sütun veriyor: beş tam satır artı tek
başına kalan 16. kare ("portre, ocak başında"). Son satırın üçte ikisi boş.

Bu sayfanın tasarımı yok; ızgara menü ürün ızgarasından kopyalandı
(`DEVAM.md`). Yani öksüz kare tasarımdan gelmiyor, bizden geliyor ve 16 sayısı
dörde tam bölünüyor.

Ölçülen alternatif: `minmax(260px, 1fr)` aynı kapsayıcıda 4 sütun veriyor
((1180 - 3x34) / 4 = 269px), 16 kare tam dört satır oluyor, öksüz kalmıyor.
Bedeli kare genişliğinin 371px'ten 269px'e inmesi, yani yaklaşık %27 küçülme.
Yemek fotoğrafı için büyük kare genelde daha iyidir, o yüzden bu bir takas,
düz bir kazanç değil.

Üçüncü yol: manifest kadraj yönü taşıyor ("tane yakın çekimi · yatay"), yani
yatay kareleri iki sütuna yayan karma bir yerleşim kurulabilir. Bu artık bir
ızgara ayarı değil, sayfaya tasarım yapmak demek.

Fotoğraflar gelmeden karar vermek zor olabilir: on altı boş çerçevede öksüz
satır, on altı gerçek fotoğrafta olduğundan daha çok göze batıyor.

## S3: 404 sayfasında marka görünmüyor

Etki: orta. Karar sahibinin.

Sayfada üst bar yok, alt bilgi yok, wordmark yok. Ölçüldü: `header`, `footer`
ve `nav` öğelerinin üçü de yok; "Ciğerci Bozo" dizesi sayfada yalnız Next'in
RSC yükünün içindeki bir `<script>`te geçiyor, görünür hiçbir yerde değil.

Sonuç: bozuk bir dış bağlantıdan gelen misafir "Bu sayfa ocakta yok." başlığını
ve iki butonu görüyor, ama kimin sitesinde olduğunu anlayamıyor. Gezinme
denetiminin ilk sorusu ("Burası hangi site?") cevapsız kalıyor. "Ocak" kelimesi
bir ipucu, kimlik değil.

Tasarımda 404 çizimi yok (handoff beş dosya: Ana, Ana Alternatif, Hikaye,
Konum, Menu, Mobil), yani kabuksuzluk bir tasarım kararı değil, bizim
kararımız. İki buton iyi bir kurtarma yolu; eksik olan kimlik.

En ucuz düzeltme başlığın üstüne wordmark koymak. Tam kabuğu (üst bar + alt
bilgi) basmak da bir seçenek ama sayfanın sakinliğini bozar.

**Uygulandı** (`8094109`): başlığın üstüne tane dizilimi + "Ciğerci Bozo",
ana sayfaya bağlantılı. Yeni ölçü girmedi; tane 8/5/4, gap 13px, 800 21px, iz
-0.03em ve görünmez `::before` ile 44px dokunma hedefi, hepsi
`UstBar.module.css`'in `.marka` çiftinden birebir. Alttaki boşluk `.blok`un
kendi 28px gap'i.

## S5: İngilizce bir yol bozuksa 404 Türkçe geliyor

Etki: orta. Karar sahibinin. Bu tur keşfedilmedi, doğrulama sırasında canlı
görüldü; kayıt `eksiklik-elestirisi.md:269`'da zaten duruyor.

Ölçüldü: `/en/yok-boyle/` isteği `lang="tr"` bir belge, Türkçe H1 ("Bu sayfa
ocakta yok.") ve ana sayfaya `/` ile giden bir wordmark döndürüyor, `/en/`
değil. Yani İngilizce gezinen bir misafir bozuk bir bağlantıya bastığında hem
dilini hem de dilinin ana sayfasını kaybediyor.

`global-not-found.tsx`'in kendi yorumu bunu "sınırlama, tercih değil" diye
kaydediyor: statik export tek bir `out/404.html` üretir ve dosya sunucusu
istek yolunu sayfaya geçirmez. Sunucu tarafı için doğru. Ama daha önceki bir
eleştiri haklı olarak şunu söylüyor: istemcide `location.pathname` `/en/`
önekini görür, yani metin ve bağlantılar JS ile İngilizceye çevrilebilir.
`content/en/hata.ts` bugün parite için duruyor ve hiç render edilmiyor.

Yani sınırlama sunucuda gerçek, istemcide değil. Karar: 404'e istemci tarafı
bir dil anahtarı girsin mi, yoksa tek dilli kalması kabul mü. İkisi de
savunulabilir; kaydın bugün söylediği şey ise eksik.

## S4: Menüdeki öksüz satırlar, kayda geçti

Etki: düşük. İşlem yapılmadı.

Menü ürün ızgarası 4 kart taşıyor ve 1440px'te 3 sütun veriyor: üç kart bir
satırda, "Terbiyesiz tavuk şiş" tek başına. Çekim listesi 7 kare taşıyor ve 6
sütun veriyor: altı kare bir satırda, biri tek başına.

İkisi de tasarımın kendi kuralı: `repeat(auto-fit, minmax(280px, 1fr))` ve
`repeat(auto-fit, minmax(150px, 1fr))`, ikisi de `Menu Sayfasi.dc.html`'de
birebir yazılı. Ürün sayısı da tasarımdan geliyor. Yani tasarım aynı öksüzü
üretiyor. S2'den farkı bu: orada ızgara bizimdi, burada değil.

Kaydedildi, dokunulmadı.

## Yanlış alarm, kayda geçsin

`document.querySelector('h1').textContent` Konum'da `"Naci TalatCaddesi, Girne"`
döndürüyor, boşluksuz. Sebebi satır kırmanın `<br>` ile yapılması: `textContent`
`<br>`'ı hiçbir karaktere çevirmiyor.

Kullanıcıya giden katmanların ikisi de doğru: erişilebilir ad
`"Naci Talat Caddesi, Girne"` (tarayıcının ad hesaplaması `<br>`'ı boşluk
sınırı sayıyor, `browse accessibility` ile doğrulandı) ve pano `<br>`'ı satır
sonu olarak veriyor. Ana sayfadaki `"Tavla zarıciğer"` de aynı durum.

Bulgu değil. Bu turda üçüncü kez aynı ders çıktı: ölçüm aracının hangi katmanı
okuduğu, ne okuduğu kadar önemli.
