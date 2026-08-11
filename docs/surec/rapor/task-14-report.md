# Task 14 raporu: 404 ve Gizlilik sayfaları

Bu iki sayfanın tasarım karşılığı yok. Ölçüt sadakat değil, sapmamak: aşağıdaki
her ölçü sitenin zaten kullandığı bir kalıptan alındı, kaynağı CSS'in içinde
satırında yazıyor, ve yeni token eklenmedi.

Yazılan dosyalar:

| Dosya | Durum |
|---|---|
| `app/global-not-found.tsx` | yeni |
| `components/sayfa/HataSayfasi.tsx` | yeni |
| `components/sayfa/HataSayfasi.module.css` | yeni |
| `components/sayfa/GizlilikSayfasi.module.css` | yeni |
| `components/sayfa/GizlilikSayfasi.tsx` | yer tutucu dolduruldu |

`content/**` dosyalarına dokunulmadı: planın "Modify: content/..." satırı bayattı,
dört sözlük Task 3'te yazılmıştı ve olduğu gibi duruyor. `styles/tokens.css`'e
token eklenmedi. Kabuk, layout ve `components/ui/` dosyalarına dokunulmadı.

## 1. Gizlilik metnindeki üç iddianın kod doğrulaması

Metin üç şey iddia ediyor. Üçü de bugün doğru. Tarama bütün ağaçta yapıldı
(`app/`, `components/`, `lib/`, `content/`, `styles/`, `next.config.ts`) ve
üretilen çıktıda tekrarlandı (`out/`).

| İddia | Nasıl arandı | Sonuç |
|---|---|---|
| "Sayfalar tarayıcınıza çerez yazmaz" | `document.cookie`, `localStorage`, `sessionStorage`, `indexedDB`, `caches.`, `navigator.storage` (kaynak + emit edilen JS) | Tek eşleşme yok. Sunucu çalışma zamanı da yok (`output: 'export'`), yani `Set-Cookie` üretebilecek bir kat yok |
| "Sitede form yoktur" | `<form`, `<input`, `<textarea`, `<select`, `FormData`, `action=` | Kaynakta sıfır. Üretilen HTML'de sıfır form/input etiketi |
| "Analiz veya ölçüm aracı kurulu değildir" | `gtag`, `googletagmanager`, `google-analytics`, `plausible`, `umami`, `matomo`, `posthog`, `fathom`, `hotjar`, `clarity`, `segment`, `mixpanel`, `sentry`, `sendBeacon`, `@vercel/*` | Tek eşleşme yok. `package.json` çalışma zamanı bağımlılıkları yalnız `next`, `react`, `react-dom` |

Ek olarak ölçülenler, çünkü "çerez yok" iddiası pratikte "üçüncü taraf isteği yok"
ile birlikte anlam kazanıyor:

- **Fontlar üçüncü taraftan çekilmiyor.** `next/font/google` build sırasında
  indirip kendi barındırıyor: `out/` içinde `fonts.googleapis` / `fonts.gstatic`
  referansı sıfır, `out/_next/static/media/` altında 10 adet `.woff2` var. Yani
  sayfa açıldığında Google'a istek gitmiyor.
- **Sayfaların otomatik olarak konuştuğu hiçbir dış origin yok.** Üretilen üç
  dosyada geçen tam liste: `https://cigercibozo.com` (canonical/hreflang, istek
  değil), `https://schema.org` (JSON-LD'nin `@context` dizesi, istek değil),
  `https://www.google.com` (alt bilgideki "Yol tarifi al" bağlantısının hedefi).

**Sahibine tek dürüstlük notu:** son madde bir çelişki değil ama söylenmeye
değer. Misafir "Yol tarifi al"a tıklarsa Google Haritalar'a gider ve orada
Google'ın kendi veri işlemesi başlar. Bu siteye ait bir ölçüm değil, giden bir
bağlantı; metin "sitede" diyerek zaten doğru sınırı çiziyor. Metne dokunulmadı
ve bu konuda cümle eklenmedi. Karar sahibinin: bugünkü hali savunulabilir.

## 2. `global-not-found` API'sinin plandaki örnekten farkı

Rehber diskten okundu:
`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`
(Next 16.3.0). Planın Task 14 kod bloğu ile **API farkı yok**; blok çalışıyor.
Rehberin söylediği, planın söylemediği dört şey var:

1. **Dosya tam bir HTML belgesi döndürmek zorunda** (`<html>` ve `<body>` dahil).
   Plan bunu ima ediyor, rehber şart koşuyor. Uygulandı.
2. **Global stiller, fontlar ve diğer bağımlılıklar bu dosyada elle içeri
   alınmalı**, çünkü dosya uygulamanın normal render'ını atlar. Plan yalnız
   `globals.css`'i gösteriyordu; aynı kural `KorSahnesi` gibi istemci
   bileşenleri için de geçerli, onlar da bu ağaçtan çekiliyor ve build'de
   sorunsuz emit ediliyor.
3. **`noindex` otomatik.** Rehber: 404 durum kodu dönen sayfalara Next
   `<meta name="robots" content="noindex" />` enjekte eder. Ölçüldü, `out/404.html`
   içinde var; elle eklenmedi ve eklenmemeli.
4. **Rehber "global stillerin daha küçük bir sürümü ve daha basit bir font ailesi
   bu sayfanın performansını iyileştirebilir" diyor.** Bu bilinçli olarak
   yapılmadı: 404'ün marka tipografisini kaybetmesi, kazanılan birkaç kilobayttan
   pahalı olurdu. Bkz. aşağıdaki "artık" maddesi.

Sürüm tablosu: `global-not-found.js` v15.4.0'da deneysel olarak geldi. Bayrak
`next.config.ts`'te zaten açıktı, dokunulmadı.

**Ölçülen artık:** statik export `out/404.html` ile birlikte bir de
`out/_not-found/index.html` üretiyor (aynı 7.1 KB'lık belge) ve build rota
tablosunda rota `/_not-found` adıyla görünüyor. Yani `/_not-found/` adresi
Caddy altında 200 ile aynı 404 sayfasını sunar. Zararsız ama sahibinin bilmesi
gereken bir yan ürün; Next'in kendi kurgusu, kaldırılamıyor.

## 3. 404 kabuk taşımıyor: karar ve gerekçe

`HataSayfasi` üst bar, alt bilgi ve mobil eylem barı basmıyor. Üç gerekçe:

1. **`Kabuk` zorunlu bir `aktif: RotaAnahtari` istiyor** ve 404'ün rota anahtarı
   yok. `RotaAnahtari` beş gerçek rotanın birliği (`lib/site.ts:7`); 404'e
   uydurma bir anahtar vermek `UstBar`'ın ve `AltBilgi`'nin varyant tablosunu
   (`lib/kabuk.ts`) yanlış bir satıra düşürürdü.
2. **`Kabuk` ve `components/layout/*` bu görevin dosyaları değil.** Paralel bir
   kabuk turu onları değiştiriyordu; ikinci bir kabuk kurgusu yazmak, o turun
   düzelttiği her şeyi ikinci bir yerde bayatlatırdı.
3. **Misafire çıkış yolu zaten veriliyor:** iki buton, `Ana sayfa` (birincil) ve
   `Menüyü gör` (ikincil). Bir 404'ün işi budur; navigasyonun tamamını
   kopyalamak değil.

Marka sürekliliği `KorSahnesi` ile kuruluyor (`yogunlukTakip={false}`, çünkü
takip edilecek `data-yogunluk` taşıyan bölüm yok). Katman zaten `aria-hidden`.

## 4. `soruMetni` bağlantısız bırakıldı: karar ve gerekçe

`soruMetni` "doğrudan bize iletebilirsiniz" diyor. Bağlantı **verilmedi**.

`content/isletme.ts` bugün şunu söylüyor: `telefon: null`, `whatsapp: null`,
`eposta: null`, `instagram: null`. Yani verilebilecek her hedef yer tutucuya
düşerdi:

- **Alt bilgideki iletişim kolonuna çapa** brief'te bir seçenek olarak duruyordu.
  İki sebeple elendi. Birincisi ölçüldü: o kolondaki üç satır bugün `<a>` değil,
  `aria-disabled="true"` taşıyan `<span>` ve `000 000 00 00` yer tutucusunu
  basıyor (`AltBilgiTam.tsx:62-96`). Çalışmayan bir hedefe yönlendirmek,
  yönlendirmemekten kötü. İkincisi kapsam: çapa `footer`'a bir `id` eklemeyi
  gerektirirdi, o dosya bu görevin değil.
- **Uydurma e-posta veya telefon** yazılmadı, yazılamaz.

Bugünkü hal en dürüst olan: cümle metin olarak duruyor, iletişim kanalları
sayfanın hemen altındaki alt bilgide misafirin gözünün önünde. `isletme.eposta`
geldiğinde bu satır bir `mailto:` alır ve başka hiçbir şey değişmez; karar
`GizlilikSayfasi.tsx`'in dosya başı yorumunda da yazılı.

## 5. Biçim kararları (tasarımı olmayan iki sayfa)

Hiçbiri uydurulmadı, hepsi mevcut bir kalıptan alındı.

### 404

| Karar | Değer | Kaynak |
|---|---|---|
| Yerleşim | `min-height:100vh`, dikey/yatay ortalanmış, `padding:120px clamp(24px,5vw,64px)`, ortalanmış metin | ikram bölümü, `Ana Sayfa Alternatif.dc.html:219-242` (tasarımın tek ortalanmış tam ekran bloğu) |
| Blok ölçüsü | `max-width:620px`, `gap:28px` | a.g.e. Ana:220, 225 |
| Kicker | 11x11 tangerine kare (`border-radius:1px`) + Inter 500 15px/1 krem .74, `gap:12px` | Hikaye açılış kicker'ı, `Hikaye Sayfasi.dc.html:64-66` |
| Kicker'a `tabular-nums` | eklendi | KISITLAR, tipografi: sayılar nerede render edilirse edilsin tabular. "404" bir sayı |
| H1 | Bricolage 700, `--ol-bolum-baslik` (32-54px), satır 1.12, `--iz-bolum`, `--golge-baslik` | ölçek: sitenin paylaşılan en büyük başlık token'ı; ağırlık/satır/iz: `BolumBasligi` `genis` ölçeği |
| Paragraf | `--ol-govde-buyuk`/1.6, `--krem-80`, `max-width:620px` | Ana:225 birebir |
| Butonlar | `Buton` `lg` (16px, 18/30px dolgu), birincil + ikincil, `gap:14px` | `lg` tasarımın 16px CTA adımı; gap Ana:110 |

**İç sayfaların üç H1 token'ı ödünç alınmadı.** `--ol-hero-menu`,
`--ol-hero-konum` ve `--ol-hero-hikaye` tasarımda tek kullanımlık ve o sayfalara
ait (`tokens.css:167-171`). 404 için birini almak, o sayfanın kimliğini
sulandırırdı; yeni bir hero token açmak ise yasak. Kalan tek doğru cevap
paylaşılan `--ol-bolum-baslik`.

### Gizlilik

| Karar | Değer | Kaynak |
|---|---|---|
| Sayfa payı | `172px clamp(24px,5vw,64px) 80px` | üst pay Konum:63 ve Menu:65 (iç sayfa açılışları); alt pay Menu:264, Hikaye:120 |
| Okuma sütunu | `max-width:680px`, sola yaslı | Hikaye:69, tasarımın kendi proze okuma ölçüsü. `--panel-en` (1180px) okunan metin için fazla geniş; site okunan metni ortalamıyor |
| H1 | `--ol-bolum-baslik`, 700/1.12, `--iz-bolum`, `--golge-baslik` | 404 ile aynı gerekçe. Bir sayfa hero'su ölçüsü burada tonu yanlış kurardı: bu bir okuma sayfası, açılış değil |
| Spot | `--ol-spot`/1.6 | Menu:77, Konum:77 |
| Panel | `CamPanel opaklik={0.74} dolgu="dar" bulanik={false}` | Konum'un bilgi kartı, Konum:106: zemin `rgba(10,8,7,.74)`, dolgu `clamp(26px,2.8vw,40px)`, kenarlık krem .10, bulanıklık yok |
| Bölüm başlıkları | `--ol-kart-baslik`, 700/1.14, `--iz-bolum`, `--krem` | Konum:107 ve 125 ("Saatler", "İletişim") birebir. Panel içinde içeriğin üstünde duran başlığın tam karşılığı; alt çizgisi olmadığı için `BolumBasligi` ile basılmıyor, `tokens.css:181-183` bunu zaten not ediyor |
| Bölüm ayracı | üstten 1px `--cizgi-kart`, ilk bölümde yok | kart ve liste satırı kenarlığı, tasarımda 25 kullanım |
| Gövde | `--ol-govde`/1.6 | tasarımın proze ölçüsü |

**16px tabanı (`KISITLAR.md`, "The 16px floor, and what it binds"):** bu sayfanın
metni okunan metin, yani 1. katman, taban bağlayıcı. Kullanılan iki ölçünün de
alt ucu 16px: `--ol-spot` `clamp(16px,1.4vw,19px)`, `--ol-govde`
`clamp(16px,1.35vw,19px)`. Tarayıcıda ölçüldü: 1440px'de ikisi de 19px, 390px'de
ikisi de 16px. **Bu sayfada 2. veya 3. katmandan tek bir ölçü yok, yani
kaydedilecek punto sapması yok.**

## 6. Kaydedilen tek sapma: gövde metni krem .78 değil .86

Tasarımın gövde proze rengi krem `.78` (Menu:77, Konum:77) ya da `.80`
(Hikaye:69, Ana:225). Gizlilik sayfasında `.86` kullanıldı. Gerekçe göz kararı
değil, ölçüm.

`KorSahnesi` sabit bir katman ve iç sayfalarda yoğunluk takibi kapalı
(`Kabuk.tsx:34`, `yogunlukTakip` yalnız ana sayfada `true`), yani **iç
sayfalarda kor tam şiddette yanıyor.** Parlak bant her zaman ekranın dibinde
durur ve sayfa kaydıkça panelin altından geçer. Panel `.74` saydam, bulanıklık
yok, yani kor panelin içinden okunuyor.

Ölçüm: tarayıcı ekran görüntüsünden piksel örneklemesi, satır medyanı yerel
zemin olarak alındı, sRGB bağıl parlaklık ve WCAG kontrast formülü.
En kötü konum, 1440x900, panel içi, zemin `rgb(109,82,74)`:

| Metin alfası | Kontrast | AA (4.5:1) |
|---|---|---|
| krem .78 (tasarımın değeri) | 4.34:1 | **düşüyor** |
| krem .80 | 4.46:1 | **düşüyor** |
| krem .86 (uygulanan) | 4.87:1 | geçiyor |
| krem 1.0 | 5.91:1 | geçiyor |

EN sayfasında aynı konum: .78 ile 4.29:1, .86 ile 4.81:1. Panelsiz ham zeminde,
korun tepesinde, .78 daha da düşüyor (4.06:1).

`KISITLAR.md`'nin iki katmanı burada çakışıyor: erişilebilirlik tabanı **sert**,
renk değeri **varsayılan**. Sert olan kazanır. Sapma `.86` ile en küçük adımda
tutuldu; `--krem-86` zaten tasarımın metin merdiveninin en üst basamağı, yani
yeni bir değer icat edilmedi.

**Kalıcı çözüm renkte değil** ve bu görevin dosyalarında da değil: ya `CamPanel`
daha koyu bir zemin sunmalı (bugün yalnız `.72` ve `.74` var), ya da iç
sayfalarda kor kısılmalı. İkisi de paylaşılan dosya.

**Bu bulgu sahibinin zaten açtığı maddeye veri.** `docs/surec/DEVAM.md:81-88`,
"Kor sahnesi okunmuyor", Task 16'ya bırakılmış ve iki zıt yön ayrılmamış halde
duruyor. Yukarıdaki sayılar ikinci yönün ("kor içeriğin okunurluğunu düşürüyor")
ölçülmüş kanıtı. Task 13'ün Konum sayfası aynı `.74` kartları aynı korun üstüne
koyacak; oradaki iletişim alt satırları tasarımda 14px/krem .76, yani bu sayfadan
daha dar bir marjda olacak.

404 sayfası bu sorundan etkilenmiyor, ölçüldü: blok dikey ortalandığı için
paragraf hep ekranın ortasında kalıyor, korun parlak bandına inmiyor. Kısa
ekranda bile (1024x560) en kötü kontrast 5.01:1. Bu yüzden 404'ün paragrafı
tasarımın `.80` değerinde bırakıldı.

## 7. Kapılar

Kendi statik sunucum kendi portumda (`python3 -m http.server 4014 --directory out`),
tarayıcı doğrulaması kendi örneğimde. Paylaşılan tarayıcı örneği bir kez başka
bir ajan tarafından başka bir sayfaya götürüldü ve ilk ölçüm kümesi çöpe gitti;
ölçümler ayrı bir örnekte tekrarlandı ve her yanıtta sayfa başlığı doğrulandı.

| # | Kapı | Sonuç |
|---|---|---|
| 1 | `npm run typecheck` | temiz |
| 1 | `npm test` | 60/60 geçti |
| 1 | `npm run build` | temiz, uyarısız |
| 2 | `out/404.html`, `out/gizlilik/index.html`, `out/en/gizlilik/index.html` | üçü de var (7.1 KB / 34.9 KB / 35.5 KB) |
| 3 | `out/404.html` içinde `<html lang="tr"` | var |
| 3 | `out/404.html` içinde stylesheet bağlantısı | var (`rel="stylesheet"` x2; token'lar ve modül CSS'i içeride, `:root{--zemin:#0a0807;...}` doğrulandı) |
| 4 | `out/404.html` içinde font sınıfları | var: `bricolage_grotesque_...__variable inter_...__variable`, `<html>` üstünde |
| 4 | latin-ext gerçekten geliyor mu | 404'ün font chunk'ında `unicode-range: U+100-2BA,...` blokları var; `ğ ş İ` bu aralıkta. HTML'de "Aradığınız sayfayı bulamadık" ve "Menüyü gör" doğru basılıyor, ekran görüntüsünde doğru render ediliyor |
| 5 | 1440px ve 390px'te `/gizlilik/`, `/en/gizlilik/`, statik `404.html` | üçü de iki ölçüde açıldı, yatay taşma yok (`scrollWidth == innerWidth`) |
| 6 | Dokunma hedefleri 44px | 404'ün iki butonu 56px yüksek (1440 ve 390'da aynı), aralarında 14px. Gizlilik gövdesinde etkileşimli öge yok |
| 7 | `prefers-reduced-motion: reduce` | beş görünümde (404 1440/390, gizlilik 1440/390, EN gizlilik) animasyonlu veya geçişli öge sayısı **0**, `scroll-behavior: auto`. Kill-switch 404'ün CSS'iyle birlikte gidiyor; iki modülüm zaten hiç `animation`/`transition` tanımlamıyor |

Ek doğrulamalar:

- `out/404.html` içinde `<meta name="robots" content="noindex"/>` var (Next
  otomatik ekliyor).
- 404 kök layout'ların Restaurant JSON-LD'sini **taşımıyor** (bilinçli:
  bulunamayan bir sayfa işletmeyi tarif etmez). Gizlilik sayfası taşıyor, çünkü
  kabuğu kök layout'tan geliyor.
- Build rota tablosunda `gecici-` ile başlayan rota yok; bu görev zaten geçici
  rota açmadı, iki sayfanın da gerçek rotası vardı.

Build rota tablosu:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /en
├ ○ /en/gizlilik
├ ○ /en/hikaye
├ ○ /en/konum
├ ○ /en/menu
├ ○ /gizlilik
├ ○ /hikaye
├ ○ /konum
├ ○ /menu
├ ○ /robots.txt
└ ○ /sitemap.xml
```

## 8. Ölçülen değerler

1440x900, `/gizlilik/`:

| Öge | Ölçülen |
|---|---|
| `<html lang>` | `tr` (EN sayfada `en`) |
| H1 | 54px / 60.48px (1.12) Bricolage 700, `#F2E9DC` |
| Spot | 19px / 30.4px (1.6) Inter 400, krem .86 |
| H2 | 38px / 43.32px (1.14) Bricolage 700, `#F2E9DC` |
| Gövde | 19px / 30.4px (1.6) Inter 400, krem .86 |
| Panel | 680px geniş, 40px dolgu, `rgba(10,8,7,.74)`, `backdrop-filter: none`, kenarlık `1px rgba(242,233,220,.1)` |
| Sayfa payı | `172px 64px 80px` |
| Yatay taşma | yok |

390x844, `/gizlilik/`: H1 32px, spot ve gövde 16px (taban), yatay taşma yok.

1440x900, `404.html`:

| Öge | Ölçülen |
|---|---|
| `<html lang>` | `tr` |
| Kicker | 15px / 15px Inter 500, krem .74, tabular |
| H1 | 54px / 60.48px Bricolage 700 |
| Paragraf | 21px / 33.6px Inter 400, krem .80, 620px |
| Butonlar | 56px yükseklik, 16px punto, 14px ara |

390x844, `404.html`: H1 32px, paragraf 17px, butonlar 56px yükseklikte yan yana.

## 9. Sahibine açık konular

1. **Kor, okunan metnin kontrastını yiyor.** Bölüm 6'daki ölçüm. Karar iki
   paylaşılan dosyadan birinde: `CamPanel`'e daha koyu bir zemin adımı eklemek
   (`--panel-koyu`, `rgba(10,8,7,.9)` zaten token) ya da iç sayfalarda kor
   şiddetini kısmak. `DEVAM.md`'deki "Kor sahnesi okunmuyor" maddesiyle aynı
   konu; bu görev kendi sayfasını renk ile AA'nın üstüne çıkardı, kökü çözmedi.
2. **`soruMetni` bağlantısız.** `isletme.eposta` geldiğinde bir satırlık iş.
   Alternatif olarak sahibi "iletişim için Konum sayfası" demek isterse, o zaman
   sözlüğe yeni bir cümle gerekir; bu görev metin yazmadı.
3. **`out/_not-found/index.html` artığı.** `/_not-found/` adresi 200 ile 404
   sayfasını sunuyor. Next'in kendi kurgusu. Yayın öncesi Caddy tarafında
   gizlenmek istenirse bu bir karar.
4. **404'ün CSS yükü.** Rehber, 404 için daha küçük bir stil paketi öneriyor;
   sayfa bugün sitenin tam token ve modül paketini çekiyor (7.1 KB HTML + ortak
   CSS chunk'ları). Marka tipografisini korumak için bilinçli olarak
   sadeleştirilmedi. Performans önceliği değişirse geri dönülebilir bir karar.
5. **Favicon yok.** Doğrulama sırasında her sayfada `/favicon.ico` 404'ü
   konsola düşüyor. Bu görevin kapsamı değil, Task 15'e not.
