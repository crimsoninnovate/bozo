# Task 15: parite, erişilebilirlik ve yayın doğrulaması

Tarih: 12 Ağustos 2026. Ölçüm ortamı: kendi Chromium örneği (playwright-core 1.58.2),
kendi statik sunucusu (port 8391), 1440x900 ve 390x844, on rota.
Kontrol listesi ve yeniden koşum komutları: `docs/PARITE.md`.

Bu görev rapor okumadı, ölçtü. Önceki turların temiz raporlarına dayanan hiçbir
madde kanıt sayılmadı; hepsi tarayıcıda yeniden ölçüldü.

Rakamlar: 1300 metin kontrastı, 1154 dokunma hedefi isabet testi, 20 klavye turu,
10 rota konsol ve ağ izlemesi, 4 sayfa x 2 genişlik tasarım karşılaştırması.

Ölçümlerin tamamı, `7dec50b` (adresten apartman adının çıkarılması) sonrası yeniden
derlenmiş `out/` üzerinde tekrarlandı. Kontrast sonucu iki koşumda birebir aynı
çıktı (1233 / 67), dokunma hedefi sayısı 1158'den 1154'e indi.

---

## Yayın engelleri

### B1. Mobil çekmecenin kapatma hedefi ölü, çekmece dokunmayla kapanmıyor (düzeltildi)

**Ne oldu.** `components/layout/Cekmece.module.css:11` çekmeceye `z-index: 40`
veriyordu; `components/layout/UstBar.module.css:14` üst bara `z-index: 60`,
`components/layout/MobilAksiyonBari.module.css:7` alt eylem barına `z-index: 70`.
Yani tam ekran modal, iki sabit barın **altında** kalıyordu. Çekmecenin kapatma
düğmesi (`Cekmece.tsx:86-94`, 44x44, sağ üst) hamburgerle tam olarak aynı noktada
duruyor. Gerçek isabet testi: kutunun 44x44'ünün **%100'ü** hamburgere ait, kapatma
düğmesine ait tek nokta yok.

Sonuç, hamburgerin `onClick`'i `setCekmeceAcik(true)` (`UstBar.tsx:108`), yani
çekmece açıkken tıklama işlemsiz. Ölçüm, üç rotada da tıklama sonrası çekmece açık:

```
route "/"       noktadaKim BUTTON.hamburger[Menüyü aç]   tikSonrasiAcikMi true
route "/menu/"  noktadaKim BUTTON.hamburger[Menüyü aç]   tikSonrasiAcikMi true
route "/en/"    noktadaKim BUTTON.hamburger[Open the menu] tikSonrasiAcikMi true
```

Aynı ölçümde çekmecenin ilk linki (`Menü`) de %77 sahiplikte kalıyordu, kalan
%23'ünü üst bar çalıyordu.

**Neden yayın engeli.** Bu sitenin birincil cihazı telefon. Menüyü açıp vazgeçen
misafirin dokunmayla çıkışı yok: tek çıkış Escape (klavye) ya da üç linkten birine
basıp sayfayı terk etmek. Alt eylem barı da modalin üstünde kaldığı için "Yol tarifi"
düğmesi çekmecenin içinden tıklanabiliyordu, `aria-modal="true"` sözüyle çelişiyor.

**Tasarım ne diyor.** `Mobil Prototip.dc.html`: üst bar `z-index:20` (satır 50), alt
eylem barı `z-index:30` (satır 189), çekmece `z-index:40` (satır 195). Çekmece en üst
katman. Port ölçeği farklı (bar 60, eylem barı 70) ama sıralamayı ters çevirmiş.

**Düzeltme (tek satır, uygulandı).** `Cekmece.module.css` `z-index: 40` > `80`,
üç satırlık gerekçe yorumuyla. Bu görevin "tek satırlık, tartışmasız hata" istisnası
kapsamında; sıralama tasarımın kendi kaynağından okunuyor, yorum payı yok.

**Düzeltme sonrası ölçüm.** Üç rotada da kapatma düğmesi 44x44, %100 sahiplik,
tıklama çekmeceyi kapatıyor (`tikSonrasiAcikMi false`). Arka plandaki tüm hedefler
(marka, dil anahtarı, hamburger, hero düğmeleri, bead rayı, alt eylem barı) %0'a
düştü, yani modal artık gerçekten modal. Escape, odak tuzağı, kaydırma kilidi ve
odağın tetikleyiciye dönmesi düzeltmeden etkilenmedi, hepsi geçiyor.

---

## Yüksek öncelik

### Y1. Mobilde telif şeridi ve Gizlilik bağlantısı AA eşiğinin altında

14 ölçüm eşiği geçemiyor, hepsi 390px'te, ikisi de `--krem-50` ve 12.5px:

| Öğe | Rota | Oran | Eşik |
|---|---|---|---|
| `AltBilgi.gizlilikLink` | `/hikaye/`, `/konum/` | 3.33 | 4.5 |
| `AltBilgi.gizlilikLink` | `/en/hikaye/`, `/en/konum/` | 3.66 | 4.5 |
| `AltBilgi.gizlilikLink` | `/` | 4.01 | 4.5 |
| `AltBilgi.gizlilikLink` | `/en/` | 4.44 | 4.5 |
| `AltBilgi.telifMetin` | `/hikaye/`, `/konum/`, `/en/hikaye/`, `/en/konum/` | 3.82 | 4.5 |
| `AltBilgi.telifMetin` | `/en/gizlilik/` | 3.89 | 4.5 |
| `AltBilgi.telifMetin` | `/gizlilik/` | 3.95 | 4.5 |
| `AltBilgi.telifMetin` | `/` | 3.99 | 4.5 |
| `AltBilgi.telifMetin` | `/en/` | 4.26 | 4.5 |

**Nedensellik ölçüldü**, `/konum/` üzerinde, 9 örnek 8 saniyeye yayılmış:

| Ortam | telif satırı | Gizlilik bağlantısı |
|---|---|---|
| 390px, kor sahnesi açık | 3.82 | 3.33 |
| 390px, kor sahnesi `display:none` | 4.60 | 4.60 |
| 1440px, kor sahnesi açık | 4.61 | 4.60 |
| 1440px, kor sahnesi `display:none` | 4.60 | 4.60 |

Yani `--krem-50` metnin `#0A0807` üstündeki taban oranı **4.60**, eşiğin yalnız 0.10
üstünde. Dar ekranda kor sahnesinin radial parıltısı telif şeridinin altına toplanıyor,
zemini `rgb(70,47,28)` seviyesine kadar açıyor ve oran altına düşüyor. Masaüstünde aynı
parıltı geniş alana yayıldığı için sorun görünmüyor. Dokuz örnekte değerler birebir
sabit, yani kor nefesinden gelen bir dalgalanma değil; kalıcı bir durum.

**Bu bir kayıt hatası değil, ölçüm.** Bu gecenin sahte AA hatalarının kaynağı
`fullPage` yakalamasıydı; burada `fullPage` kullanılmadı, yalnız o kutunun viewport
yakalaması alındı ve sonuç sahne kapatılarak çapraz doğrulandı.

**Not.** 53 ölçüm daha eşiği geçmiyor ama bunlar **hata değil**: hepsi
`Buton.module.css:66` `.pasif { opacity: 0.55; pointer-events: none }` durumundaki
yer tutucu kontroller (`000 000 00 00`, `WhatsApp`, `Instagram`, `Paket sipariş`).
WCAG 1.4.3 devre dışı bileşenleri açıkça istisna tutuyor ve telefon numarası
geldiğinde `.pasif` düşünce oran kendiliğinden düzeliyor. Bunları hata sayan bir
sonraki tur, yanlış bir işe girmiş olur.

**Karar sahibinin.** Çözüm seçenekleri: telif şeridinin metnini bir kademe açmak
(`--krem-50` > `--krem-62` ya da `--krem-66`), ya da şeridin altına kor sahnesini
kapatan opak bir zemin koymak. Birincisi tasarımın alfa değerini değiştirir,
ikincisi katman yapısını. İkisi de tek satır ama ikisi de görsel karar, bu görevin
istisnası kapsamında değil.

### Y2. Atlanan blok bağlantısı (skip link) yok, `<main>` id'siz

`components/sayfa/Kabuk.tsx` `<main>` etiketine `id` vermiyor; on rotada
`document.querySelector('main').id` boş. Sekme sırasının ilk durağı her sayfada
marka bağlantısı; klavye kullanıcısı içeriğe ulaşmak için üst barın 6-8 hedefini her
sayfada yeniden geçiyor.

WCAG 2.4.1 (A seviyesi) için ARIA landmark tekniği (ARIA11) yeterli sayılır ve bu
sitede landmark'lar doğru kurulmuş, yani teknik olarak ihlal iddiası tartışmalı.
Ama fayda ekran okuyucu kullanıcısına gidiyor; salt klavye kullanıcısı için karşılığı
yok. AA hedefleyen bir sitede ucuz bir eksik.

Kapatma maliyeti: `<main id="icerik">` ve odakta görünür tek bir bağlantı. Metin için
sözlüğün `erisim` grubuna bir anahtar gerekir (mevcut kalıp hazır: `menuyuAc`,
`anaGezinme`). Sözlük içeriği sahibin olduğu için uydurulmadı.

### Y3. Çekmecenin `role="dialog"` öğesinin erişilebilir adı yok

`components/layout/Cekmece.tsx:85` `role="dialog" aria-modal="true"` taşıyor ama
`aria-label` ya da `aria-labelledby` yok; ölçümde üç rotada da ad `null`. Ekran
okuyucu diyaloğu adsız duyuruyor.

Düzeltme tek satır ama yeni bir sözlük anahtarı gerektiriyor (`erisim.mobilGezinme`
zaten iç `<nav>`'ın adı, ikinci kez kullanmak iki landmark'a aynı adı verirdi).
Uydurulmadı, sahibine soruluyor.

---

## Orta öncelik

### O1. Statik çıktı altı rotada "Şu an kapalıyız" basıyor

`components/saat/DurumCipi.tsx:21` ve `DurumAltMetni.tsx:21` `durum === null` iken
kapalı görünümü basıyor; `Cekmece.tsx:114` aynı deseni izliyor. Bu, derlenmiş HTML'e
gömülüyor. Ölçüm:

| Dosya | "Şu an kapalıyız" | "Şu an açığız" |
|---|---|---|
| `out/index.html` | 1 | 0 |
| `out/menu/index.html` | 1 | 0 |
| `out/konum/index.html` | 1 | 0 |
| `out/en/index.html`, `out/en/menu/index.html`, `out/en/konum/index.html` | 1 (`We are closed`) | 0 |
| `out/hikaye/index.html`, `out/gizlilik/index.html` ve EN eşleri | 0 | 0 |

Yani on rotanın altısı, JS'siz misafire ve JS çalıştırmayan araca öğlen 12'de
"kapalıyız" diyor. `CanliSaat` aynı durumda nötr davranıyor (`--:--`,
`CanliSaat.tsx:23`), yani proje bu ayrımı zaten biliyor: `--:--` bilinmeyendir,
"kapalıyız" yanlış bir olgudur.

Koddaki yorum yalnız hydration eşleşmesini anlatıyor, tercihi anlatmıyor. İki ucuz
çözüm var: nötr üçüncü durum (nokta gri, metin `10:00 - 05:00`) ya da mevcut
davranışın gerekçesiyle `IYILESTIRMELER.md`'ye yazılması. Şu anki durum ikisi de
değil. Bu bir görünüm kararı olduğu için düzeltilmedi.

### O2. "80 m" kaydının gerekçesi olgusal olarak yanlış

`IYILESTIRMELER.md` satır 20, `Girne Macro Market, 80 m` ifadesinden mesafenin
çıkarılmasını şöyle gerekçelendiriyor: "Mesafe doğrulanmamış, işletme gerçeklerinde
karşılığı yok. Uydurma istatistik sert kuralda."

İşletmenin kendi bilgi dosyası bunun tersini söylüyor:
`Cigerci-Bozo-proje-bilgi-dosyasi-v2.md:227-238`, "Yakın çevre haritası" tablosu
`[DOĞRULANMIŞ] İşletmeci beyanı` etiketiyle "80 m geri | Girne Macro Market"
satırını veriyor. Aynı tablo "80 m ileri" iki kayıt ve "100 m geri" bir kayıt daha
içeriyor.

Aynı yanlış gerekçe kodda dört yerde yorum olarak tekrarlanıyor:
`content/tr/ana.ts:59`, `content/en/ana.ts:64`, `content/tr/konum.ts:13`,
`content/en/konum.ts:13`, hepsi "mesafe doğrulanmadı" diyor.

**Kararın kendisi sağlam**: sahibi 11 Ağustos 2026'da çıkarmayı onayladı, doğru bir
veriyi yayınlamamak zarar vermez. Değiştirilmesi gereken karar değil kayıt: gerekçe
"doğrulanmamış" değil "sahibi göstermek istemedi" olmalı. Yoksa gelecekteki bir okuyucu
kaynağın doğruladığı bir olguyu ikinci kez "uydurma" diye eleyebilir.

### O3. `metin-envanteri.json` bina numarası satırı bayat

`docs/tasarim/metin-envanteri.json`, "Adres detayı (bina no, kat, posta kodu)" alanını
hala `dogrulanmisMi: false` ve "Bilinmiyor. Kaynakta yalnızca cadde adı var" diye
taşıyor. Sahibi 12 Ağustos 2026'da tasarımdan bağımsız bir belgeyle teyit etti ve
`content/isletme.ts:16-18` ile `IYILESTIRMELER.md` satır 16 güncellendi; envanter
güncellenmedi.

Envanter, `content/isletme.ts`'in kendi yorumunun tek gerçek kaynak olarak işaret
ettiği dosya. İki katman artık çelişiyor. Tek satırlık kayıt düzeltmesi, ama envanter
tasarım tarafının dosyası olduğu için dokunulmadı.

---

## Düşük öncelik

### D1. 44px altında kalan dokunma hedefleri

1154 gerçek isabet ölçümü, 84 benzersiz hedef türü, 41'i 44px tabanını geçiyor.
Kalan 43 türün dökümü:

| Grup | Tür | Ölçülen isabet | Not |
|---|---|---|---|
| `BeadRay` boncukları | 14 | 14-22px | `aria-hidden`, `tabIndex={-1}`; kayıtlı (`IYILESTIRMELER.md` satır 63). Her boncuğun bir çapa eşdeğeri var, kaydırmayla erişilebilir |
| `AltBilgi.sayfaLinki` | 16 | 38-70 x 26-28 | metin bağlantısı, kutu 15px, isabet katmanı 28px'e çıkarıyor |
| `UstBar.link` Menü/Gece/Story/Night | 5 | 40-42 x 46 | yalnız masaüstü, 44px'e 2-4px kalıyor |
| `DilAnahtari` TR/EN | 4 | 20 x 44-46 | **genişlik 20px**, iki genişlikte de; asıl dokunma hedefi |
| `AltBilgi.gizlilikLink` | 2 | 40 x 42-44 | |
| `UstBar.marka` | 2 | 170x20 (mobil), 196x26 (masaüstü) | |

Bu ölçüm `getBoundingClientRect` ile yapılmadı; kayıtlı 28/44px değerlerin bir kısmı
görünmez `::before` katmanlarında yaşıyor ve çapanın kutusu onları ıskalıyor. Örnek:
`AltBilgi.sayfaLinki` kutusu 39x15, gerçek isabet alanı 40x28.

En dar olan `DilAnahtari` (20px) ve mobil `UstBar.marka` (20px yükseklik) WCAG 2.5.8
AA tabanının (24x24) da altında. Diğerleri 24px'i geçiyor, yalnız projenin kendi
44px hedefinin altında kalıyor.

**Çakışma yok.** Hedefler çift çift kesiştirildi; çekmece dışında kalıcı çakışma
bulunmadı. Sabit üst barın altından geçen kaydırma anlarında görülen kısmi
örtüşmeler kalıcı değil, her hedef bir kaydırma konumunda alanının %100'üne sahip.

Footer iletişim satırlarının kayıtlı 28px istisnası bugün geçersiz: telefon,
WhatsApp ve Instagram `null` olduğu için satırlar `<div>` olarak basılıyor
(`IYILESTIRMELER.md` satır 71), yani dokunma hedefi değiller. Veri geldiği gün madde
geri döner ve o zaman ölçülmelidir.

### D2. Üç ölü sözlük anahtarı (kayıtlı, doğrulandı)

`ortak.marka.kisa`, `ortak.cta.whatsapptanYaz`, `ortak.satirlar.saatlerUzun`:
kodda tek çağıran yok. `IYILESTIRMELER.md` satır 109 bunu 12 Ağustos'ta kaydetmiş;
bağımsız tarama aynı üçünü buldu, dördüncüsü yok. `saatlerUzun`'un cümlesi çıktıda
görünüyor ama `ana.konum.saatNotu` ve `sayfaMeta.konum.aciklama` içinde elle yazılı
üçüncü kopyadan geliyor, anahtarın kendisinden değil.

### D3. İki kullanılmayan token

`styles/tokens.css`: `--mese` ve `--tangerine-08`. 127 token'ın kalan 125'i
kullanımda. Brief'in kendi kuralı gereği hata değil, kayıt için burada.

---

## Ölçüldü ve temiz

- **Dış istek yok, kanıtlandı.** On rotada tek origin (kendi sunucumuz), Google
  dahil hiçbir dış host yok. Fontlar `next/font` ile kendi sunucumuzdan, 10 adet
  `.woff2`. `document.cookie` boş, `localStorage`, `sessionStorage`, `indexedDB`
  ve service worker kaydı sıfır, on rotada, sayfa sonuna kaydırıldıktan sonra da.
  Gizlilik sayfasının üç iddiası da kodla doğrulandı.
- **Konsol.** On rotada 0 hata, 0 `pageerror`. Statik sunucu erişim kaydında 544
  istek, hepsi 200; tek bir 404 yok.
- **Uydurulmuş veri.** Beş fiyat `000 TL`, telefon `000 000 00 00`, WhatsApp,
  Instagram, e-posta ve koordinat `null`; `geo`, `telephone`, `email`, `sameAs`,
  `priceRange` on rotanın yapısal verisinde yok. 16 fotoğrafın hiçbirinin dosyası
  yok, çıktıda tek `<img>` ve tek görsel varlığı yok. Çizilmiş logo yok.
  Bina numarası artık doğrulanmış veri.
- **İşletme gerçekleri kaynağa karşı.** `content/isletme.ts` ve
  `metin-envanteri.json` alanları `Cigerci-Bozo-proje-bilgi-dosyasi-v2.md`'ye karşı
  sınandı. Kaynakta doğrulanıp siteye doğru giren olgular: işletme adı, kategori,
  cadde, şehir, ülke, sahip (Engin Çağlar), `10:00 - 05:00`, alkolsüz, beş ürün,
  iki ikram, ciğerin ölçüleri (8 şiş, şişte 4 ciğer + 2 kuyruk yağı, meşe koru),
  terbiyesiz tavuk şişin kalça ve marine bilgisi, üç komşuluk adı. Ters yönde tek
  bulgu O2'deki mesafe kaydı; kaynakta olup siteye girmemiş başka bir olgu yok.
  Sitedeki üç içecek adı kaynakta `[ÖNERİ]` etiketli, envanterin öngördüğü yer
  tutucu dizilim; arayüz "liste tamamlanacak" diye işaretliyor, iddia kurmuyor.
- **Metin kuralları.** Görünür metinde em dash 0, şapkalı harf 0, tamamı büyük harf
  cümle 0, kilitli terminoloji ihlali 0, yasaklı ifade 0. Em dash `out/` altındaki
  hiçbir dosya türünde (HTML, JS, CSS, XML, RSC yükü) geçmiyor.
- **Hareket azaltılmış.** `prefers-reduced-motion: reduce` ile on rotada canlı
  animasyon 0, canlı geçiş 0, `scroll-behavior: auto`. Kararmanın izlemeye devam
  etmesi kayıtlı karar, hata değil.
- **Klavye.** 20 turda (10 rota x 2 genişlik) sekme sırası DOM sırasını izliyor,
  ihlal 0; odak her durakta görünür; tuzak yok. Çekmece: odak ilk linke gidiyor,
  10 sekmede 0 kaçak, Escape kapatıyor, odak hamburgere dönüyor, gövde kaydırması
  kilitleniyor ve kilit kalkıyor.
- **Landmark ve başlık.** On rotada tam bir `h1`, atlanan seviye yok. İki `nav`
  ayrı ad taşıyor: `Ana gezinme` / `Mobil gezinme`, `Main navigation` /
  `Mobile navigation`.
- **Dekoratif katmanlar.** Kor sahnesi, çekirdek, duman, imleç koru, bead rayı,
  tane rayları, ilerleme çubuğu ve harita levhasının çizim katmanları (ızgara, yol,
  halka, pin, nabız) `aria-hidden`. Harita levhasının metinleri ağaçta: cadde adı,
  işaret etiketi, üç komşuluk çipi, alt not.
- **İki dil.** On rotada `<html lang>` doğru, `hreflang` çiftleri karşılıklı,
  `x-default` Türkçeye işaret ediyor. `out/en/**` içinde kalan tek Türkçe, korunan
  ürün adları: `(kuzu şiş)`, `(terbiyesiz tavuk şiş)`, `(ciğer)`, `(dalak)`,
  `(yürek)`, `(çay)`. Kaynak kuralı bunu istiyor.
- **Font alt kümesi.** latin-ext `unicode-range` bloğu çıktıda dört kez
  (`U+100-2BA,...`): `ğ Ğ ş Ş İ` bu aralıkta. `ı` (U+0131) latin bloğunda ayrıca
  listeleniyor. `404.html` kök layout'u atlıyor ama iki font değişkenini de ve iki
  stylesheet'i de alıyor; Türkçe karakterler bozulmadan basılıyor.
- **Ölü ağırlık.** 133 export'un hepsinin çağıranı var. 404 CSS modülü sınıfının
  hepsi kullanımda (dinamik varyant erişimleri dahil).
- **Parite.** Dört tasarım sayfası x iki genişlik ölçüldü.
  - 1440px: Ana 21/21, Menü 14/14 (3 kayıtlı iz farkı), Hikaye 6/6 (`Usül` > `Usul`
    kayıtlı), Konum 7/7 birebir.
  - 390px: Menü, Hikaye, Konum birebir. Ana sayfanın sekiz farkı hata değil, portun
    doğru kaynağı izlemesi: dar ekran otoritesi `Ana Sayfa Alternatif.dc.html`
    değil `Mobil Prototip.dc.html`, ve port o dosyanın altı değerini de birebir
    tutturuyor (hero `800 52px/-.05em`, gece `800 40px/-.045em`, konum
    `700 30px/-.035em`, sofra `700 34px/-.04em`, sayaçlar `700 30px/-.04em`,
    `meşe korunda` `800 26px/-.04em`).
  - Ana sayfa iskeleti: yedi bölüm, aynı `id` sırası, aynı `data-yogunluk` değerleri
    (1, .55, .4, .7, 1.25, .45, .3), aynı dolgu (`120px 64px`), aynı hesaplanan
    yükseklik (900px), aynı iç içerik yükseklikleri (665/669, 517/517, 602/602).
  - Belge boyu farkı (8410 / 6871) tasarım dosyasının kaydırma taklidinden gelen
    `transform` artefaktı; hesaplanan yükseklik iki tarafta da 900px. Kayıtlı.
- **Ekran görüntüsü envanteri.** Mevcut kareler önce listelendi: `01/02/03-ana-sayfa`,
  `04-ana-sayfa`, `05-ana-sayfa`, `01/02/03-hikaye`, `01/02/03-konum`,
  `01/02/03-menu`, `mobil`. `04-menu.jpg` **yok**; ona parite bağlanmadı.

---

## Yazdığım tek satır

`components/layout/Cekmece.module.css`: `z-index: 40` > `z-index: 80`, üç satırlık
gerekçe yorumuyla. Gerekçe B1'de; tasarımın kendi katman sırası kanıt, yorum payı yok.
Başka hiçbir kaynak dosyaya dokunulmadı.

---

## Sahibine sorulacaklar

1. **Telif şeridinin kontrastı (Y1).** Metin bir kademe açılsın mı (`--krem-50` >
   `--krem-62`/`--krem-66`), yoksa şeridin altına kor sahnesini kapatan opak bir
   zemin mi konsun? İkisi de tasarıma dokunuyor.
2. **Atlanan blok bağlantısı (Y2).** Eklensin mi, ekleneceksek metni ne olsun?
   Sözlüğün `erisim` grubuna bir anahtar gerekir.
3. **Çekmecenin diyalog adı (Y3).** `role="dialog"` için görünmez bir ad gerekiyor;
   sözlükte karşılığı yok.
4. **JS'siz durum metni (O1).** Altı rota statik olarak "Şu an kapalıyız" basıyor.
   Nötr bir üçüncü durum mu istenir, yoksa mevcut davranış bilinçli karar olarak mı
   kayda geçsin?
5. **"80 m" kaydının gerekçesi (O2).** Kaynak mesafeyi doğruluyor. Karar değişmiyor
   ama kayıt "doğrulanmamış" yerine "sahibi göstermek istemedi" demeli; onaylanırsa
   `IYILESTIRMELER.md` satır 20 ve dört kod yorumu düzeltilir.
6. **Envanterin bina numarası satırı (O3).** `metin-envanteri.json` hala
   "bilinmiyor" diyor, kod ve iyileştirme kaydı "doğrulandı" diyor. Envanter
   güncellensin mi?
7. Devam eden açık maddeler: üç ölü sözlük anahtarı silinsin mi (D2),
   `IYILESTIRMELER.md`'nin "karar bekliyor" bölümündeki maddeler.

---

## Bu turda ölçmediklerim

- **Yalnız Chromium.** WebKit ve Firefox motorları açılmadı; brief iki motoru da
  istemiyordu ama eksiklik eleştirisi bunu kör nokta sayıyor ve haklı: bu sitenin
  gerçek kullanıcısı büyük olasılıkla telefonda Safari. `min-height: 100vh`
  bölümler, üç `position: fixed` katman ve `backdrop-filter` orada farklı
  davranabilir.
- **Yalnız iki genişlik.** 320px, 768px ve 781-1100px bandı ölçülmedi.
- **Caddy tarafı.** `out/` içeriği denetlendi, sunulması denetlenmedi. Repoda
  Caddyfile yok; düz `file_server` bilinmeyen URL'de özenle kurulmuş `404.html`
  yerine Caddy'nin çıplak 404'ünü döndürür. Bu görevin kapsamı dışında ama yayın
  öncesi kapanması gerekiyor.
- **Performans.** Lighthouse ya da yükleme bütçesi ölçülmedi.
- **Paylaşım önizlemesi.** `og:image` ve `themeColor` eksikliği doğrulanmadı,
  eksiklik eleştirisinin 10. maddesi olarak duruyor.
