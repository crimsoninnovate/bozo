# Kontrol turu

12 Ağustos 2026. Sahibinin 11:00'de verdiği iş: bütün sayfaların ve yapının
kontrolü. Site son kontrolden (Task 15) sonra dört tur daha değişti
(erişilebilirlik tabanı, hareket, tasarım kararları, galeri), yani `docs/PARITE.md`
eski bir ağaca aitti ve galeri o listede hiç yoktu.

Ölçen: kendi Chromium örneği (playwright 1.58.2), kendi statik sunucusu
(`python3 -m http.server 8391 --directory out`). 12 içerik rotası + `404.html`,
iki genişlikte (1440x900, 390x844). Tasarım dosyaları ayrı bir sunucuda (8392)
aynı tarayıcıda açıldı.

**Bu tur hiçbir önceki rapora güvenmedi.** Yöntemi de kendi kurdu, ve aşağıdaki
"Kanıtın denetimi" bölümü kendi ölçüm hatalarının kaydıdır: dört ölçüm yanlış
çıktı ve dördü de düzeltilmeden önce kendinden emin, yanlış bir rapor üretecekti.

## Bulunan üç şey

### 1. Galeri mobil çekmecede yoktu

`components/layout/Cekmece.tsx:78-82` link listesini elle yazıyordu. Üstündeki
yorum gerekçesini de yazmıştı: Task 6'da Galeri'nin rotası yoktu, uydurulmadı.
**O gerekçe 12 Ağustos sabahı, galeri rotası açıldığında son buldu; liste
güncellenmedi.**

Ölçülen sonuç: masaüstü nav 780px altında çekmeceye düşüyor, çekmecede Galeri
yok, yani **dar ekranda Galeri'ye üst gezinmeden hiç girilemiyordu.** Sayfaya tek
giriş alt bilginin sayfa kolonuydu. 12 rotanın hepsinde, iki dilde.

Tasarımın çekmecesi (`Mobil Prototip.dc.html:201-205`) beş satır yazıyor:
Menü / Hikaye / Konum / **Galeri** / Rezervasyon. Port üçte durmuştu.

Düzeltme: liste `lib/kabuk.ts` > `cekmeceLinkleri()`'ne taşındı, `IC_NAV`'dan
türüyor. Rezervasyon rotası yok (sahibi "şimdilik gerekli değil" dedi), kalan
dördü sırasıyla geliyor. `kabuk.test.ts` listeyi kilitledi: bir daha elle yazılmış
ikinci bir liste rota tablosundan sessizce ayrılamaz.

Bu, "rota tabloları tek gerçeği söylüyor mu" sorusunun tek olumsuz cevabıydı.
`lib/site.ts`, `lib/kabuk.ts`, `app/sitemap.ts`, üst bar ve alt bilgi galeriyi
zaten taşıyordu; ağaçta rota listesini elle yazan başka yer yok (tarandı).

### 2. Canlı saatin iki noktası AA'yı geçmiyordu

`colonBlink` her 2 saniyenin 0.9'unda `opacity: .25`. O fazda iki nokta
**1.62:1**, büyük metin eşiği 3.0. Ana sayfada, menü ve konum hero'sunda, iki
dilde.

Değer tasarımdan birebir geliyor (`Ana Sayfa Alternatif.dc.html:22`), ama WCAG AA
projenin bağlayıcı kısıtı. Sahibi dip değerin `.5`'e çıkarılmasını onayladı:
aynı zeminde **3.23:1**, yanıp sönme görünür kalıyor.

**Neden bugüne kadar görünmedi:** `PARITE.md`'nin kayıtlı kontrast yöntemi
"metnin rengini alfasıyla bindir" diyor, yani yalnız `color`'ın alfasını. İki
noktanın sönüklüğü `color`'dan değil, span'ın kendi `opacity`'sinden geliyor.
Ata `opacity` zinciri hesaba katılmayınca bu öğe tam tangerine sayılıyor ve
~10:1 ile rahat geçiyor. Yöntemin kör noktasıydı, sitenin yeni hatası değil.

`prefers-reduced-motion: reduce` altında animasyon zaten iptal ve kolon tam
opak (10.25:1); 13 rotada doğrulandı.

### 3. Alt bilginin 12.5px satırı eşiğin üstünde titriyordu

390px'te `AltBilgi.telifMetin` ve ondan renk miras alan `.gizlilikLink`
**4.48-4.58** ölçüyor, eşik 4.5. Kor sahnesinin radial parıltısı telif şeridinin
altına toplanıp zemini `[42,23,11]`'e açıyor. 17 örneğin 14'ü geçiyor, 3'ü
4.49-4.50'de kalıyor.

Bu madde **kayıtta bayat**: Task 15 aynı satırları 3.33-4.44 ölçmüştü. Aradaki
fark hareket turunun gece yoğunluğunu 0.7'den 0.56'ya çekmesi; iyileştirmiş ama
eşiği tam kapatmamış. Sahibi `--krem-50` > `--krem-58` onayladı: en kötü fazda
**4.81**, düz zeminde 5.89.

## Kanıtın denetimi: bu turun kendi dört hatası

Yöntem kuralı "kanıtın kendisi de denetlenmeli" bu turda dört kez kendi üstünde
işledi. Hepsi düzeltilmeden önce kendinden emin bir sayı üretiyordu.

| # | Hata | Ne üretiyordu | Nasıl yakalandı |
|---|---|---|---|
| 1 | Kontrast taraması bütün animasyonları duraklatıp faza sarıyordu, tek atımlık açılış animasyonları dahil | Bölümler `opacity:0`'a dönüyor, metin kendi zemini yerine sayfa zeminine karşı okunuyordu. **192 sahte kalan** | Oranların tam 1.00-1.13'te kümelenmesi. Oran 1.0 = metin ile zemin aynı parlaklık, gerçek bir tasarımda olmaz |
| 2 | Kutu geometrisi faz ayarlanmadan okunuyordu | Açılış animasyonu bitince öğe yer değiştiriyor, ortalama yanlış pikselleri topluyordu. Aynı öğe koşumlar arasında 2.13 ve 4.19 veriyordu | Sayının oynaması. Kararsız sayı ölçüm hatasıdır |
| 3 | Doğrulayıcı `color:transparent` stilini döngü içinde enjekte ediyordu, stil sayfada kalıyordu | İkinci adaydan sonra her renk `rgba(0,0,0,0)` okundu, hepsi oran 1.0 ile "kaldı". **138 sahte kalan** | Renk sütununun tamamının `rgba(0,0,0,0)` olması |
| 4 | Dokunma hedefi taraması `scrollIntoView`'dan hemen sonra tarıyordu | `scroll-behavior: smooth` altında kaydırma eşzamansız; kaydırma öncesi viewport örnekleniyordu. **116 hedef "hiç isabet yok"**, yani sahte bir çakışma/ölü hedef alarmı | Ölü görünen hedeflerin hepsinin alt bilgide, yani kaydırma gerektiren tek yerde toplanması |

Ayrıca bir **sahte bulgu** eşikte durduruldu: `h1`'in `textContent`'i
`"Tavla zarıciğer"` okuyor (iki metin düğümü boşluksuz birleşiyor). Erişilebilirlik
ağacındaki gerçek ad `"Tavla zarı ciğer"`: Chrome'un AccName algoritması `<br>`'yi
boşluğa çeviriyor. `textContent` ile ölçen bir tur var olmayan bir ekran okuyucu
hatası bildirirdi. Aynısı `/konum/` ve iki EN rotası için de geçerli.

**Çıkarılan kural:** geniş tarama aday bulucudur, kanıt değildir. Her aday yavaş
yöntemle (ortala, otur, üç kez örnekle) yeniden ölçülür. Bu turda tarama 107 aday
attı, doğrulama onların bir kısmını geçirdi.

## İkinci geçiş: turun kendi denetimi

Turun sonuçları kapandıktan sonra sahibi denetim istedi. Denetimin sorusu şuydu:
ilk geçiş taramanın **fazla** rapor ettiğini kanıtladı, peki **eksik** rapor
edip etmediği hiç ölçüldü mü? Ölçülmemişti.

### Kapsam boşluğu: her rotanın ilk klavye durağı hiç ölçülmemiş

Kontrast taramasının filtresi kutunun viewport'a tam sığmasını istiyordu. Bu
filtre sessizdir: sığmayan öğe ölçülmez ve raporda "kalan yok" diye görünür.
Ölçüldü: sayfalarda 1538 metin öğesi var, tarama 1514 tanesini ölçmüş.

Kaçan 46 kaydın 22'si canlı saatin metni iki koşum arasında değiştiği için
oluşan eşleştirme artefaktıydı (sınıfları ölçülmüştü). Kalan **24'ü atlama
bağlantısı**, 12 rota x 2 genişlik: dinlenirken ekran dışında park ettiği için
hem kontrast hem dokunma hedefi taraması onu atlamış. Oysa odaklanınca görünür ve
**her rotanın ilk klavye durağı**, yani tam da klavye kullanıcısını ilgilendiren
kontrol.

Odaklı durumda ölçüldü, 24 rota-genişlikte: kontrast **14.54:1** (EN 14.56),
gerçek dokunma hedefi **124x44** (EN 152x44), odak halkası 2px tangerine, Enter
odağı `#icerik`'e indiriyor. **Boşluk gerçekti, arkasında bulgu yoktu.**

### Parite yönteminin kapsamı: yalnız başlıklar karşılaştırılmış

Kayıtlı parite ölçütü "Bricolage ailesinden 26px ve üstü" diyor. Yani gövde
metni, çipler, etiketler ve buton yazıları bugüne kadar tasarımla hiç
karşılaştırılmamış; sitedeki metnin çoğu bu.

Dört tasarım sayfasının tamamı için tüm metin öğeleri karşılaştırıldı (punto,
ağırlık, iz, aile ve etkin alfa dahil renk): **283 eşleşen, 265 birebir, 18
farklı.** On sekizin hiçbiri yeni bulgu değil: 14'ü `.pasif` yer tutucu
sönümlemesi (telefon ve WhatsApp `null`), 2'si `colonBlink` faz farkı, 1'i
kayıtlı `DilAnahtari` sapması, 1'i de kendi eşleştiricimin sıra kayması.

Sonuncusu ayrıca kaydedilmeye değer bir yöntem tuzağı: `Girne / KKTC` tasarımda
üç yerde geçiyor (19px adres bloğu, 14.5px alt bilgi kolonu, 12.5px telif),
portta standalone olarak bir yerde. Metne göre eşleştirme sıradaki bütün
çiftleri kaydırdı ve "punto 19>14.5" diye sahte bir fark üretti. Portun adres
bloğu tek tek ölçüldü: **19px, `rgba(242,233,220,.78)`, tasarımla birebir.**

### Doğrulanmamış repo iddiaları

| İddia | Nerede yazılı | Ölçüm |
|---|---|---|
| Galeri ızgarası 1440'ta 3 kolon 371x270, 390'da 342x253 | `IYILESTIRMELER.md` | doğrulandı, birebir; 16 kutu da aynı ölçüde, gap 34/20px |
| `aria-current` bulunulan rotada ve yalnız orada | `kabuk.ts` kuralı | doğrulandı, 12 rota; menü barında yok (kayıtlı), gizlilik navda yok |
| Yapısal veri uydurulmuş alan taşımıyor | `PARITE.md` 7 | doğrulandı: `Restaurant` geçerli, boş/null alan 0, `telephone`/`geo`/`sameAs`/`priceRange` hiç basılmıyor |

## Yöntem: mobil pariteyi neyle ölçmemeli

`Mobil Prototip.dc.html` bir **telefon maketi**: sayfayı çerçeve içinde
ölçekleyerek basıyor. Orada okunan `getComputedStyle` değerleri port ile
karşılaştırılamaz; hero saati tasarımda 26px, portta 120px okunuyor ve ikisi de
doğru. Otorite dosyanın **yazılı inline** değeridir. Altı öğe o değerlere karşı
ölçüldü, altısı da birebir.

Masaüstü dosyaları böyle değil, orada computed karşılaştırma geçerli.

## Kayda geçen çıktı davranışı: prefetch iki kez indiriyor

Next 16 statik export'ta `<Link>` prefetch'i iki adımlı: önce rota URL'sini
istiyor (sunucu tam HTML döndürüyor, 200), sonra o isteği **iptal edip**
`__next.*.txt` yükünü alıyor. Konsoldaki `net::ERR_ABORTED` yığını hata değil,
Next'in kendi davranışı; statik export rehberi prefetch'i desteklenen özellikler
arasında sayıyor.

Bedeli ölçüldü, ana sayfanın ilk yüklenişinde:

| | istek | aktarılan |
|---|---|---|
| İptal edilen rota HTML'i | 6 | **344 KB** |
| Gerçekten kullanılan `.txt` yükü | 12 | 176 KB |

Yani ilk yüklemede 344 KB indirilip atılıyor. Düzeltilmedi: `prefetch={false}`
bunu kapatır ama istemci gezintisinin anındalığını da götürür, bu bir sahip
kararı. Kayda geçti, `DEVAM.md`'de açık madde.

İstemci gezintisi, geri tuşu ve rota çözümlemesi doğrulandı: `/` > `/menu/`
tıklaması sayfayı yeniden yüklemiyor (sayfa içi işaret ayakta kalıyor), geri
tuşu ana sayfaya dönüyor.

Ayrıca `out/` artık rota başına beş dosya taşıyor (`index.html`, `index.txt`,
`__next._tree.txt`, `__next._full.txt`, `__next.<hash>.__PAGE__.txt`). Kopya
metin taşıdıkları için metin kuralı taraması `.txt` uzantısını da kapsayacak
şekilde genişletildi; ihlal çıkmadı.

## Kapanan ve kapanmayan eski maddeler

- **Alt bilgi dokunma hedefi** (`DEVAM.md`'nin açık maddesi): değişmedi.
  `AltBilgi.sayfaLinki` yüksekliği 26-28px'te kilitli, kolonun satır adımı bu.
  Galeri eklenince grup 48 örneğe çıktı ama tür aynı. Hâlâ sahibinin kararı.
- **`UstBar.link`** 40-42px genişlik, yalnız masaüstü, 44px'e 2-4px kalıyor.
  Değişmedi.
- **`BeadRay` boncukları** 10-22px, `aria-hidden`, dekoratif. Değişmedi.
- **Ölü ağırlık**: iki kullanılmayan token (`--mese`, `--tangerine-08`), üç ölü
  sözlük anahtarı (`ortak.marka.kisa`, `ortak.cta.whatsapptanYaz`,
  `ortak.satirlar.saatlerUzun`). **Galeri hiç yeni ölü ağırlık eklemedi.**
  Ölü CSS sınıfı 0.
- **Favicon 404'ü**: işaret hâlâ işletmeden bekleniyor. Başsız tarayıcı favicon
  istemediği için bu turda ölçülemedi, kapsam dışı.

## Sayılar

| | |
|---|---|
| Rota | 12 içerik + `404.html` (+ `_not-found`, kayıtlı) |
| Test | 76 (74'tü, çekmece için iki test eklendi) |
| Ölçülen metin | 1514 + 24 atlama bağlantısı (sayfalarda toplam 1538) |
| Karşılaştırılan metin öğesi (gövde dahil) | 283, 265 birebir |
| Ölçülen dokunma hedefi | 268 gerçek isabet ölçümü + 24 atlama bağlantısı |
| Konsol hatası / sayfa hatası | 0 / 0, 26 rota-genişlikte |
| Dış origin | 0 |
| Depolama (çerez, ls, ss, idb, sw) | hepsi boş, 26 rota-genişlikte |
| Koşan animasyon, hareket azaltılmış | 0, 13 rotada |
| Klavye: DOM sırası ihlali / görünmez odak | 0 / 0 |
| Tipografi paritesi | ana 22/22, menü 14/14, hikaye 6/6, konum 7/7, mobil 6/6 |
| Metin kuralı ihlali | 0 (`.html` ve `.txt`) |
