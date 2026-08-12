# Yayın öncesi kontrol listesi

Bu dosya kalıcıdır ve yeniden koşulabilir. Her madde bir komut ya da ölçüm yöntemi
taşır; bir sonraki değişiklikten sonra aynı komutlar aynı sırayla koşulur ve sonuç
sütunu güncellenir.

Son koşum: 12 Ağustos 2026, kontrol turu. Ölçen: kendi Chromium örneği (playwright
1.58.2), kendi statik sunucusu (`python3 -m http.server 8391 --directory out`).
Ölçüm genişlikleri 1440x900 ve 390x844. **Rota sayısı 12** (galeri dahil), artı
`404.html`.

## Nasıl koşulur

```bash
npm run build
python3 -m http.server 8391 --directory out --bind 127.0.0.1 &
# tasarım karşılaştırması için ayrıca:
python3 -m http.server 8392 --directory ~/Desktop/Bozo/design_handoff_bozo_website --bind 127.0.0.1 &
```

Ölçüm kuralları, ihlal edilirse sonuç geçersizdir:

- **`fullPage` ekran yakalaması kullanılmaz.** Kor sahnesi `position: fixed`;
  `fullPage` onu belge boyuna gerer ve sahte kontrast sonucu üretir.
- **Kontrast ölçümü:** hedefi `scrollIntoView({block:'center', behavior:'instant'})`
  ile ortala, **otur** (>=1s), metnin rengini geçici `transparent` yap, **yalnız o
  kutunun** viewport yakalamasını al, piksel ortalamasını zemin say, metnin rengini
  **etkin alfasıyla** bindirip oranı hesapla. Ölçümden önce
  `*{transition:none !important}` enjekte edilir.
- **Etkin alfa = `color`'ın alfası x ata `opacity` zinciri.** Yalnız `color`'ın
  alfasına bakmak yetmez: sitede `opacity` ile sönümlenen öğeler var
  (`CanliSaat.kolon` `.25` blink dip fazı, `.pasif` yer tutucular `.55`) ve o
  zincir atlanırsa hepsi olduğundan parlak ölçülür. Kontrol turu bu kör noktayı
  bulana kadar iki noktanın 1.62:1'i görünmedi.
- **Animasyon fazlaması:** yalnız `iterations === Infinity` olan animasyonlar
  duraklatılıp faza sarılır (kor nefesi, duman, blink). Tek atımlık açılış
  animasyonları `finish()` edilir. Hepsini geri sarmak bölümleri `opacity:0`'a
  döndürür ve metni kendi zemini yerine sayfa zeminine karşı okutur.
- **Saydamlaştırma stili döngü içinde enjekte edilmez.** Sayfada kalır ve sonraki
  her öğenin rengi `rgba(0,0,0,0)` okunur. Renkler saydamlaştırmadan **önce**,
  tek geçişte toplanır.
- **Dokunma hedefi ölçümü:** `getBoundingClientRect` kullanılmaz. Hedeflerin bir
  kısmı görünmez `::before` katmanlarında yaşar ve çapanın kutusu onları ıskalar.
  Doğrusu `document.elementFromPoint` ile gerçek isabet testi: hedefin kutusunu
  26px payla tara, her noktada en yakın etkileşimli atayı bul, hedefe ait
  noktaların sınır kutusunu gerçek isabet alanı say. **Kaydırma ayrı bir adımdır:**
  `scroll-behavior: smooth` altında `scrollIntoView` eşzamansızdır, aynı adımda
  taramak kaydırma öncesi viewport'u örnekler ve alt bilgideki her hedef "hiç
  isabet yok" görünür.
- **Animasyon `getComputedStyle` ile ölçülmez, `document.getAnimations()` ile
  ölçülür.** Bildirilmiş animasyon ile koşan animasyon aynı şey değil; bu ayrımı
  kaçırmak beş sayfada 42 ölü animasyonun aylarca yaşamasına yol açtı.
- **Erişilebilir ad `textContent` değildir.** `<h1>Tavla zarı<br>ciğer</h1>`
  `textContent` olarak `"Tavla zarıciğer"` verir; erişilebilirlik ağacındaki
  gerçek ad `"Tavla zarı ciğer"`. Ad ölçülecekse CDP `Accessibility.getFullAXTree`
  kullanılır.
- **Geniş tarama aday bulucudur, kanıt değildir.** Her aday yavaş yöntemle
  yeniden ölçülür. Kararsız sayı (koşumlar arası oynayan oran) ölçüm hatasıdır.
- Ekran görüntüsü tek kanıt değildir. Handoff kareleri 924px'te çekilmiş.
- **`Mobil Prototip.dc.html` bir telefon maketidir**, sayfayı çerçeve içinde
  ölçekleyerek basar. Oradan okunan computed değerler portla karşılaştırılamaz;
  otorite dosyanın **yazılı inline** değeridir (bkz. 6.2).

---

## 1. Derleme ve çıktı

| # | Madde | Sonuç | Kanıt |
|---|---|---|---|
| 1.1 | `npm run build` temiz | geçti | çıkış 0, TypeScript hatasız, 16 sayfa üretildi |
| 1.2 | `npm test` | geçti | 76 test, 0 hata |
| 1.3 | `npm run typecheck` | geçti | `tsc --noEmit` çıktısı boş |
| 1.4 | On iki rota + `robots.txt` + `sitemap.xml` | geçti | `find out -name index.html` 12 içerik rotası + `404/` + `_not-found/` verir |
| 1.5 | `gecici-` dosyası yok | geçti | `grep -rl gecici- out` boş |
| 1.6 | `404.html` var, kök layout'u atlar ama font sınıflarını alır | geçti | `<html lang="tr" class="bricolage...__variable inter...__variable">` |
| 1.7 | `404.html`, `404/index.html` ve `_not-found/index.html` birebir aynı | geçti | üçü `cmp -s` ile eşit, üçü de `noindex` |
| 1.8 | `_not-found/` çıktısı (kayıtlı davranış) | kayıtlı | üretiliyor, sitemap'e sızmıyor |
| 1.9 | `sitemap.xml` on iki rotayı verir, `_not-found` yok | geçti | 12 `<loc>`, her biri tr/en `xhtml:link` çiftli, `grep -c _not-found` = 0 |
| 1.10 | Her animasyon adının `@keyframes` karşılığı var | geçti | `styles/animasyon.test.ts`; son testi `out/` okur, yani `npm run build`'den SONRA koşar |
| 1.11 | **RSC yan dosyaları** (`__next._tree.txt`, `__next._full.txt`, `__next.<hash>.__PAGE__.txt`, `index.txt`) | kayıtlı | Next 16 statik export'un istemci gezintisi için ürettiği yükler, rota başına beş dosya. Metin taşıdıkları için metin kuralı taraması (7) bunları da kapsar |

```bash
npm run build && npm test            # 1.10'un derleme testi out/ ister
find out -name index.html | sort
grep -c '<loc>' out/sitemap.xml          # 12
grep -c '_not-found' out/sitemap.xml     # 0
cmp -s out/404.html out/404/index.html && cmp -s out/404.html out/_not-found/index.html && echo AYNI
grep -rl 'gecici-' out | wc -l           # 0
```

## 2. Dış istek yok (gizlilik sayfasının iddiası)

Gizlilik sayfası "çerez yazmaz, form toplamaz, ölçüm aracı barındırmaz" diyor.
Metin iddiadır, kod kanıttır. 26 rota-genişlik tarayıcıda açıldı, sayfa sonuna
kaydırıldı.

| # | Madde | Sonuç | Ölçüm |
|---|---|---|---|
| 2.1 | Tek origin, dışarıya istek yok | geçti | 26 rota-genişliğin tüm istekleri `http://127.0.0.1:8391`; başka origin 0 |
| 2.2 | Fontlar kendi sunucumuzdan | geçti | `out/_next/static/media/*.woff2`, 10 dosya |
| 2.3 | `document.cookie` boş | geçti | 26 rota-genişlikte `""` |
| 2.4 | `localStorage` / `sessionStorage` | geçti | 26 rota-genişlikte `length === 0` |
| 2.5 | `indexedDB` | geçti | `databases().length === 0` |
| 2.6 | Service worker | geçti | kayıt yok |
| 2.7 | Konsol hatası ve `pageerror` | geçti | 26 rota-genişlikte 0 hata, 0 uyarı, 0 `pageerror` |
| 2.8 | Favicon 404'ü | kayıtlı eksik | işaret işletmeden bekleniyor. Başsız tarayıcı favicon istemez, bu turda ölçülemedi |
| 2.9 | **Prefetch iki adımlı, ilk adımı iptal ediliyor** | kayıtlı | Next 16 önce rota URL'sini istiyor (200, tam HTML), sonra iptal edip `.txt` yükünü alıyor. Ana sayfanın ilk yüklenişinde **6 istek, 344 KB indirilip atılıyor**; kullanılan `.txt` yükü 176 KB. Konsoldaki `net::ERR_ABORTED` hata değil. `prefetch={false}` kapatır ama istemci gezintisini de götürür: sahip kararı |

## 3. Font alt kümesi

| # | Madde | Sonuç | Kanıt |
|---|---|---|---|
| 3.1 | latin-ext `unicode-range` bloğu çıktıda | geçti | `U+100-2BA,...` 4 kez; `ğ` U+011F, `Ğ` U+011E, `ş` U+015F, `Ş` U+015E, `İ` U+0130 bu aralıkta |
| 3.2 | `ı` (U+0131) latin bloğunda | geçti | `unicode-range: U+??,U+131,...` 4 kez |
| 3.3 | `404.html` her iki font değişkenini alır | geçti | `<html>` sınıfları |
| 3.4 | Türkçe karakterler bozulmadan basılıyor | geçti | görsel doğrulama |

```bash
cat out/_next/static/chunks/*.css | grep -o 'unicode-range:[^;}]*' | sort | uniq -c
grep -o '<html[^>]*>' out/404.html
```

## 4. İki dil

| # | Madde | Sonuç | Kanıt |
|---|---|---|---|
| 4.1 | `<html lang>` doğru | geçti | 6 TR rota `tr`, 6 EN rota `en`, `404.html` `tr` (kayıtlı karar) |
| 4.2 | `hreflang` çiftleri karşılıklı | geçti | 12 rotanın hepsinde `tr` / `en` / `x-default`; `x-default` Türkçeye işaret eder |
| 4.3 | Canonical mutlak | geçti | 12 rotada `https://cigercibozo.com...`; `404.html` canonical taşımaz, `noindex` |
| 4.4 | `out/en/**` içinde Türkçe metin | geçti | yalnız korunan özel adlar: `(kuzu şiş)`, `(terbiyesiz tavuk şiş)`, `(ciğer)`, `(dalak)`, `(yürek)`, `(çay)` |
| 4.5 | Sözlük anahtarlarının çağıranı | 3 ölü anahtar | `ortak.marka.kisa`, `ortak.cta.whatsapptanYaz`, `ortak.satirlar.saatlerUzun`. Değişmedi, `IYILESTIRMELER.md` satır 109'da kayıtlı |
| 4.6 | Galeri iki dilde de rota, sitemap ve gezinmede | geçti | `/galeri/` + `/en/galeri/`, sitemap çifti, üst bar (menü barı hariç, kayıtlı), alt bilgi kolonu, **mobil çekmece** (bu turda düzeltildi, bkz. 9.1) |

## 5. Erişilebilirlik

### 5.1 Kontrast

1514 metin ölçüldü (13 rota x 2 genişlik). Yöntem yukarıdaki kuralda. Tarama
107 aday attı; her aday yavaş yöntemle yeniden ölçüldü ve **26'sı taramanın
hatası çıktı** (aslında geçiyorlar).

| Sonuç | Adet |
|---|---|
| Geçti | 1434 |
| Kaldı, `aria-hidden` dekoratif | 24 |
| Kaldı, `.pasif` yer tutucu (WCAG 1.4.3 devre dışı bileşen istisnası) | 56 |
| **Kaldı, gerçek** | **0** |

Dekoratif kalan tek tür: `DilAnahtari.ayirici`, TR/EN arasındaki `|` işareti,
krem `.28` ile 2.16:1, 12 rota x 2 genişlik. `aria-hidden`, ayraç noktalaması,
iki dil adı da kendi başına okunuyor.

Pasif kalanlar telefon ve WhatsApp verisi `null` olduğu için `.55` opaklıkla
sönümlenen buton ve alt bilgi satırları. Veri geldiğinde `.pasif` düşer ve madde
yeniden ölçülür.

**Bu turda kapanan iki madde:**

| Öğe | Öncesi | Sonrası | Ne yapıldı |
|---|---|---|---|
| `CanliSaat.kolon`, blink dip fazı | 1.62 (eşik 3.0) | **3.23** | `colonBlink` dip değeri `.25` > `.5` |
| `AltBilgi.telifMetin` + `.gizlilikLink`, 390px | 4.48-4.50 (eşik 4.5) | **4.81-5.88** | `--krem-50` > `--krem-58` |

İkincisi Task 15'te 3.33-4.44 ölçülmüştü; hareket turunun gece yoğunluğunu
0.7'den 0.56'ya çekmesi araya girdi. Yani kayıt iki kez bayatladı, bir kez iyiye
bir kez kötüye. Ölçüm tekrarlanmadan güncellenmemeli.

### 5.2 Klavye

| # | Madde | Sonuç |
|---|---|---|
| 5.2.1 | Sekme sırası DOM sırasını izler | geçti, 26 koşumda 0 geri adım |
| 5.2.2 | Odak her durakta görünür | geçti, görünmez odak 0 |
| 5.2.3 | Tuzak yok | geçti, sekme daima ilk durağa döner |
| 5.2.4 | Çekmece odağı içeride tutar | geçti, 12 rotada 12 Tab sonunda 0 kaçak |
| 5.2.5 | Escape çekmeceyi kapatır | geçti, 12 rotanın hepsinde |
| 5.2.6 | Kapanışta odak tetikleyiciye döner | geçti, 12 rotanın hepsinde |
| 5.2.7 | Çekmece açıkken gövde kaydırması kilitli | geçti, `overflow: hidden`, kapanışta geri alınıyor |
| 5.2.8 | Atlanan blok bağlantısı (skip link) | geçti, 24 rota-genişlikte ilk durak. `404.html`'de kabuk yok, ilk durak "Ana sayfa" |
| 5.2.9 | Odak halkası site genelinde tanımlı | geçti, `:focus-visible` 2px `--tangerine`, offset 3px |

### 5.3 Landmark ve başlık

| # | Madde | Sonuç |
|---|---|---|
| 5.3.1 | Her rotada tam bir `h1` | geçti, 13/13 |
| 5.3.2 | Atlanan başlık seviyesi yok | geçti, 26 rota-genişlikte 0 |
| 5.3.3 | İki `nav` ayrı ad taşır | geçti, `Ana gezinme` / `Mobil gezinme` (EN: `Main navigation` / `Mobile navigation`) |
| 5.3.4 | `role="dialog"` erişilebilir ad | geçti, `Gezinme çekmecesi` / `Navigation drawer`; iç `<nav>`ın adından farklı |
| 5.3.5 | `h1` erişilebilir adı doğru | geçti, `<br>` taşıyan dört başlıkta AX ağacı boşluklu ad veriyor (`"Tavla zarı ciğer"`). `textContent` ile ölçülmez |

### 5.4 Dokunma hedefi

268 gerçek isabet ölçümü (26 rota-genişlik). Taban 44px. **Kalıcı çakışma ya da
sahipsiz hedef yok**: taranan hiçbir hedef "hiç isabet yok" durumunda değil.

Ölçüm dışı bırakılanlar ve nedeni: 84 sıfır kutu (karşı kırılımın arayüzü;
1440px'te hamburger ve mobil aksiyon barı, 390px'te masaüstü nav), 24 viewport
dışı (odaklanınca görünen skip link). İkisi de doğru davranış.

| Grup | 44px altı | Not |
|---|---|---|
| `AltBilgi.sayfaLinki` | 48 örnek, genişlik geçiyor, **yükseklik 26-28px'te kilitli** | kolonun satır adımı 26.5px; 44px, gap'i 12>29.5px yapmayı ister, görsel karar. Galeri eklenince örnek sayısı arttı, tür aynı. **Sahibinin açık maddesi** |
| `BeadRay` boncukları | 28 örnek, 10-22px | `aria-hidden`, `tabIndex={-1}`, dekoratif; kayıtlı |
| `UstBar.link` | 17 örnek, 40-42px genişlik x 44px yükseklik | yalnız masaüstü, 44px'e 2-4px kalıyor |
| `AltBilgi.gizlilikLink` | 8 örnek, 40px genişlik x 44-46px yükseklik | görünmez `::before` yüksekliği taşıyor |
| **Çekmece kapatma düğmesi** | **geçti**, 44x44 gerçek isabet | Task 15'in düzelttiği ölü hedef; 12 rotada yeniden doğrulandı |
| Çekmece açıkken arka plan hedefleri | geçti, 12 rotada 0 sızıntı | `aria-modal` sözü davranışta da tutuluyor |

### 5.5 Hareket azaltılmış

`prefers-reduced-motion: reduce` ile 13 rota:

| # | Madde | Sonuç |
|---|---|---|
| 5.5.1 | Canlı animasyon sayısı | 0, 13 rotada (`document.getAnimations()`) |
| 5.5.2 | Canlı geçiş sayısı | 0, 13 rotada |
| 5.5.3 | `scroll-behavior` | `auto`, 13 rotada |
| 5.5.4 | `CanliSaat.kolon` sönük fazda kilitlenmiyor | geçti, 13 rotada `opacity: 1` (10.25:1) |
| 5.5.5 | Kararma (opacity) izlemeye devam eder | kayıtlı karar (`KISITLAR.md`), hata değil |

### 5.6 Dekoratif katmanlar

| Katman | `aria-hidden` |
|---|---|
| Kor sahnesi, çekirdek, duman küreleri | evet |
| İmleç koru | evet |
| Bead rayı ve boncuklar | evet |
| Tane rayları (`TaneDizilimi`) | evet |
| İlerleme çubuğu | evet |
| Harita levhasının çizim katmanları | evet |
| Harita levhasının **metinleri** | hayır, ağaçta kalır (doğru) |
| Galeri ızgarasının boş `FotoYuvasi` plakaları | hayır; etiket metni ağaçta, kare adı okunuyor |

## 6. Parite

### 6.1 Masaüstü (1440px)

Tasarım `.dc.html` ve port aynı tarayıcıda, aynı genişlikte açılır; Bricolage
ailesinden 26px ve üstü her metin öğesinin punto, ağırlık ve iz değeri
karşılaştırılır, metne göre eşleştirilir.

| Sayfa | Sonuç |
|---|---|
| Ana | 22/22 değer birebir |
| Menü | 14/14 birebir |
| Hikaye | 6/6 birebir; `Usül` > `Usul` kayıtlı sahip kararı, eşleşme dışı |
| Konum | 7/7 birebir |
| **Galeri** | **tasarımda yok.** Ölçütü ödünç aldığı kalıplar: ızgara Menü ürün ızgarası (`Ocaktan.module.css:93-94`), plaka `FotoYuvasi` `kart` biçimi (Menu:126), kabuk `sayfalar` alt bilgi varyantı. `IYILESTIRMELER.md`'de kayıtlı |
| **Gizlilik** | **tasarımda yok.** `tam` alt bilgi varyantı, kayıtlı |

### 6.2 Mobil (390px)

`Mobil Prototip.dc.html` bir telefon maketi: sayfayı çerçeve içinde ölçekleyerek
basıyor. Computed karşılaştırma orada **geçersizdir** (hero saati tasarımda 26px,
portta 120px okunur, ikisi de doğru). Otorite dosyanın yazılı inline değeridir.

| Öğe | Tasarımın yazdığı | Portun ölçüleni | Sonuç |
|---|---|---|---|
| Hero H1 | `800 52px`, iz `-.05em` | 52px/800/-2.6px | birebir |
| `meşe korunda` | `800 26px`, iz `-.04em` | 26px/800/-1.04px | birebir |
| Gece başlığı | `800 40px`, iz `-.045em` | 40px/800/-1.8px | birebir |
| Konum başlığı | `700 30px`, iz `-.035em` | 30px/700/-1.05px | birebir |
| Sofra başlığı | `700 34px`, iz `-.04em` | 34px/700/-1.36px | birebir |
| Çekmece linki | `700 34px`, iz `-.035em` | 34px/700/-1.19px | birebir |

### 6.3 Ana sayfa bölüm iskeleti

| Ölçüm | Tasarım | Port |
|---|---|---|
| Bölüm sayısı ve `id` sırası | 7: acilis, iddia, ocaktan, ikram, gece, bozo, konum | aynı |
| `data-yogunluk` değerleri | 1, .55, .4, .7, 1.25, .45, .3 | aynı |
| Bölüm dolgusu | `120px 64px` | aynı |
| Hesaplanan bölüm yüksekliği | `900px` | `900px` |
| Gövde zemini | `rgb(10, 8, 7)` | aynı |

### 6.4 Çekmece link listesi

| | Liste |
|---|---|
| Tasarım (`Mobil Prototip.dc.html:201-205`) | Menü / Hikaye / Konum / Galeri / Rezervasyon |
| Port | Menü / Hikaye / Konum / Galeri |

Rezervasyon rotası yok (sahibi "şimdilik gerekli değil" dedi). Kalan dördü
`lib/kabuk.ts` > `cekmeceLinkleri()`'nden türer, elle yazılmaz; `kabuk.test.ts`
kilitler.

## 7. Uydurulmuş veri taraması

`content/isletme.ts` ve `docs/tasarim/metin-envanteri.json` içindeki her alan,
işletmenin kendi bilgi dosyasına karşı sınandı. Bu turda değişen yok.

| # | Alan | Sonuç |
|---|---|---|
| 7.1 | Fiyatlar | `000 TL`, beş üründe de. Kaynak: bilinmiyor |
| 7.2 | Telefon | `000 000 00 00`. Buton `.pasif`, `pointer-events: none` |
| 7.3 | WhatsApp | `null`, bağlantı üretilmiyor |
| 7.4 | Instagram | `null`, `sameAs` yapısal veriye girmiyor |
| 7.5 | E-posta | `null` |
| 7.6 | Harita koordinatı | `null`; yol tarifi adres araması |
| 7.7 | `priceRange` | kasten yok |
| 7.8 | Dalak ve yürek porsiyon detayı | "Porsiyon detayı işletmeden bekleniyor" |
| 7.9 | Gece menüsü kalemleri | "Hangi ürünlerin ocakta kalacağı henüz belli değil" |
| 7.10 | İçecek listesi | Ayran, Şalgam, Çay + "liste tamamlanacak" |
| 7.11 | 16 fotoğraf | hiçbirinin `dosya` alanı yok, `<img>` sayısı 26 rota-genişlikte **0**, `out/_next/static/media` içinde tek görsel yok. **Galeri sayfası da boş plaka basıyor**, uydurulmuş görsel yok |
| 7.12 | Logo | çizilmiş logo yok, `TaneDizilimi` geometrik işaret |
| 7.13 | Bina numarası `No:4` | doğrulanmış (sahibi 12 Ağu 2026) |
| 7.14 | Yapısal veri ile görünen adres aynı | geçti |

### Metin kuralları

`out/**/*.html` **ve `out/**/*.txt`** içindeki görünür metin tarandı:

| Kural | İhlal |
|---|---|
| Em dash (U+2014) | 0 |
| Şapkalı harf (`â î û Â Î Û`) | 0 |
| Tamamı büyük harf cümle | 0 |
| müşteri, bedava, ücretsiz, hediye | 0 |
| mangal, barbekü, ızgara | 0 |
| şef, aşçı | 0 |
| parça, lokma, adet, tabak | 0 |
| masa (yemek bağlamında) | 0 |
| 7/24, non-stop | 0 |
| Yasaklı ifadeler listesi | 0 |
| Saat yazımı `10:00 - 05:00` dışında bir biçim | 0 |

```bash
python3 - <<'PY'
import re, glob, html
FORBID = ['müşteri','bedava','ücretsiz','hediye','mangal','barbekü','ızgara','şef','aşçı',
          'parça','lokma','adet','tabak','7/24','non-stop','eşsiz lezzet','efsane','leziz',
          'ağızda dağılan','dumanı üstünde','sınırsız','dünyaca ünlü','şef önerisi']
for f in sorted(glob.glob('out/**/*.html', recursive=True)) + sorted(glob.glob('out/**/*.txt', recursive=True)):
    raw = open(f, encoding='utf-8', errors='replace').read()
    t = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', raw, flags=re.S|re.I)
    vis = html.unescape(re.sub(r'<[^>]+>', ' ', t))
    hits = {w: vis.lower().count(w) for w in FORBID if vis.lower().count(w)}
    if '—' in raw: hits['U+2014'] = raw.count('—')
    if re.search(r'[âîûÂÎÛ]', vis): hits['sapka'] = re.findall(r'[âîûÂÎÛ]', vis)
    caps = re.findall(r'\b[A-ZÇĞİÖŞÜ]{2,}(?:\s+[A-ZÇĞİÖŞÜ]{2,}){2,}\b', vis)
    if caps: hits['ALLCAPS'] = caps
    if hits: print(f, hits)
PY
```

## 8. Ölü ağırlık

| # | Madde | Sonuç |
|---|---|---|
| 8.1 | `components/`, `lib/`, `content/` export'ları | çağıransız 0. Yalnız kendi dosyasında kullanılan prop tipleri (`ButonTuru`, `SahneVaryanti`, ...) `export` taşır; dışarıdan çağıran yok ama ölü de değil |
| 8.2 | CSS modülü sınıfları | geçmeyen 0 |
| 8.3 | `styles/tokens.css` token'ları | kullanılmayan 2: `--mese`, `--tangerine-08`. Değişmedi |
| 8.4 | Sözlük anahtarları | 3 ölü (bkz. 4.5). Değişmedi |
| 8.5 | **Galeri turunun eklediği ölü ağırlık** | **0**: yeni export, token ya da sözlük anahtarı çağıransız kalmadı |

## 9. Bu turda düzeltilenler

| # | Madde | Ölçüm |
|---|---|---|
| 9.1 | **Galeri mobil çekmecede yoktu** | Masaüstü nav 780px altında çekmeceye düşüyor, çekmecede Galeri yok, yani dar ekranda Galeri'ye üst gezinmeden hiç girilemiyordu. 12 rotanın hepsinde, iki dilde. Liste elle yazılmıştı ve rota tablosundan ayrışmıştı; `cekmeceLinkleri()`'ne taşındı, test kilitledi |
| 9.2 | `CanliSaat.kolon` blink dip fazı 1.62:1 | `.25` > `.5`, 3.23:1. Sahibi onayladı |
| 9.3 | `AltBilgi.telifMetin` 390px'te 4.48 | `--krem-50` > `--krem-58`, 4.81. Sahibi onayladı |
