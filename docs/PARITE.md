# Yayın öncesi kontrol listesi

Bu dosya kalıcıdır ve yeniden koşulabilir. Her madde bir komut ya da ölçüm yöntemi
taşır; bir sonraki değişiklikten sonra aynı komutlar aynı sırayla koşulur ve sonuç
sütunu güncellenir.

Son koşum: 12 Ağustos 2026, Task 15. Ölçen: kendi Chromium örneği (playwright-core
1.58.2), kendi statik sunucusu (`python3 -m http.server 8391 --directory out`).
Ölçüm genişlikleri 1440x900 ve 390x844. Rota sayısı 10.

## Nasıl koşulur

```bash
npm run build
python3 -m http.server 8391 --directory out --bind 127.0.0.1 &
# ölçümler aşağıdaki bölümlerde
```

Ölçüm kuralları, ihlal edilirse sonuç geçersizdir:

- **`fullPage` ekran yakalaması kullanılmaz.** Kor sahnesi `position: fixed`;
  `fullPage` onu belge boyuna gerer ve sahte kontrast sonucu üretir.
- **Kontrast ölçümü:** hedefi `scrollIntoView({block:'center'})` ile ortala, metnin
  rengini geçici `transparent` yap, **yalnız o kutunun** viewport yakalamasını al,
  piksel ortalamasını zemin say, metnin rengini alfasıyla bindirip oranı hesapla.
  Ölçümden önce `*{transition:none !important}` enjekte edilir: yoksa bölüm erime
  geçişi yarıda yakalanır ve etkin alfa yanlış okunur.
- **Dokunma hedefi ölçümü:** `getBoundingClientRect` kullanılmaz. Kayıtlı 28/44px
  hedeflerin bir kısmı görünmez `::before` katmanlarında yaşar ve çapanın kutusu
  onları ıskalar. Doğrusu `document.elementFromPoint` ile gerçek isabet testi:
  hedefin kutusunu 26px payla tara, her noktada en yakın etkileşimli atayı bul,
  hedefe ait noktaların sınır kutusunu gerçek isabet alanı say.
- Ekran görüntüsü tek kanıt değildir. Handoff kareleri 924px'te çekilmiş; 1440px'te
  görünen bir sapma karede görünmez. Kanıt `.dc.html` üzerinde ölçülen değerdir.

---

## 1. Derleme ve çıktı

| # | Madde | Sonuç | Kanıt |
|---|---|---|---|
| 1.1 | `npm run build` temiz | geçti | çıkış 0, TypeScript hatasız, 14 sayfa üretildi |
| 1.2 | `npm test` | geçti | 68 test, 0 hata |
| 1.3 | `npm run typecheck` | geçti | `tsc --noEmit` çıktısı boş |
| 1.4 | On rota + `robots.txt` + `sitemap.xml` | geçti | `find out -name index.html` on rotayı verir |
| 1.5 | `gecici-` dosyası yok | geçti | `grep -rl gecici- out` boş |
| 1.6 | `404.html` var, kök layout'u atlar ama font sınıflarını alır | geçti | `<html lang="tr" class="bricolage...__variable inter...__variable">` |
| 1.7 | `out/404/index.html`, `out/404.html` ile birebir aynı | geçti | `cmp -s out/404.html out/404/index.html` |
| 1.8 | `_not-found/` çıktısı (kayıtlı davranış, `DEVAM.md`) | kayıtlı | üretiliyor, sitemap'e sızmıyor |
| 1.9 | `sitemap.xml` on rotayı verir, `_not-found` yok | geçti | 10 `<loc>`, her biri tr/en `xhtml:link` çiftli |
| 1.10 | Her animasyon adının `@keyframes` karşılığı var | geçti | `styles/animasyon.test.ts`; son testi `out/` okur, yani `npm run build`'den SONRA koşar |

```bash
npm run build && npm test            # 1.10'un derleme testi out/ ister
find out -name index.html | sort
grep -c '<loc>' out/sitemap.xml          # 10
grep -c '_not-found' out/sitemap.xml     # 0
cmp -s out/404.html out/404/index.html && echo AYNI
grep -rl 'gecici-' out | wc -l           # 0
```

## 2. Dış istek yok (gizlilik sayfasının iddiası)

Gizlilik sayfası "çerez yazmaz, form toplamaz, ölçüm aracı barındırmaz" diyor.
Metin iddiadır, kod kanıttır. On rota tarayıcıda açıldı, sayfa sonuna kaydırıldı.

| # | Madde | Sonuç | Ölçüm |
|---|---|---|---|
| 2.1 | Tek origin, dışarıya istek yok | geçti | on rotanın tüm istekleri `http://127.0.0.1:8391`; Google dahil başka origin yok |
| 2.2 | Fontlar kendi sunucumuzdan | geçti | `next/font` çıktısı `out/_next/static/media/*.woff2`, 10 dosya |
| 2.3 | `document.cookie` boş | geçti | on rotada `""`; tarayıcı çerez kavanozu da boş |
| 2.4 | `localStorage` / `sessionStorage` | geçti | on rotada `length === 0` |
| 2.5 | `indexedDB` | geçti | on rotada `databases().length === 0` |
| 2.6 | Service worker | geçti | on rotada kayıt yok |
| 2.7 | Konsol hatası | geçti | on rotada 0 hata, 0 `pageerror` |
| 2.8 | Favicon 404'ü | kayıtlı eksik | işaret işletmeden bekleniyor, kapsam dışı |

## 3. Font alt kümesi

| # | Madde | Sonuç | Kanıt |
|---|---|---|---|
| 3.1 | latin-ext `unicode-range` bloğu çıktıda | geçti | `U+100-2BA,...` 4 kez; `ğ` U+011F, `Ğ` U+011E, `ş` U+015F, `Ş` U+015E, `İ` U+0130 bu aralıkta |
| 3.2 | `ı` (U+0131) latin bloğunda | geçti | `unicode-range: U+??,U+131,...` |
| 3.3 | `404.html` her iki font değişkenini alır | geçti | `<html>` sınıfları + iki stylesheet bağlantısı |
| 3.4 | Türkçe karakterler bozulmadan basılıyor | geçti | görsel doğrulama: "Ciğerci Bozo", "Mekanımız alkolsüzdür", "Menüyü gör" |

```bash
cat out/_next/static/chunks/*.css | grep -o 'unicode-range:[^;}]*' | sort | uniq -c
grep -o '<html[^>]*>' out/404.html
```

## 4. İki dil

| # | Madde | Sonuç | Kanıt |
|---|---|---|---|
| 4.1 | `<html lang>` doğru | geçti | 5 TR rota `tr`, 5 EN rota `en`, `404.html` `tr` (kayıtlı karar) |
| 4.2 | `hreflang` çiftleri karşılıklı | geçti | her rotada `tr` / `en` / `x-default`; `x-default` Türkçeye işaret eder |
| 4.3 | Canonical mutlak | geçti | on rotada `https://cigercibozo.com...` |
| 4.4 | `out/en/**` içinde Türkçe metin | geçti | yalnız korunan özel adlar: `(kuzu şiş)`, `(terbiyesiz tavuk şiş)`, `(ciğer)`, `(dalak)`, `(yürek)`, `(çay)`. Kaynak kuralı: ürün adları çevrilmez, parantezle açıklanır |
| 4.5 | Sözlük anahtarlarının çağıranı | 3 ölü anahtar | `ortak.marka.kisa`, `ortak.cta.whatsapptanYaz`, `ortak.satirlar.saatlerUzun`. `IYILESTIRMELER.md` satır 109'da kayıtlı, sahibine soruldu |

## 5. Erişilebilirlik

### 5.1 Kontrast

1300 metin ölçüldü (10 rota x 2 genişlik). Yöntem yukarıdaki kuralda.

| Sonuç | Adet |
|---|---|
| Geçti | 1233 |
| Kaldı, yer tutucu `.pasif` durumunda (WCAG 1.4.3 devre dışı bileşen istisnası) | 53 |
| **Kaldı, gerçek** | **14** |

Gerçek kalanlar, hepsi 390px'te, ikisi de `--krem-50` (12.5px):

| Öğe | Rota | Oran | Eşik |
|---|---|---|---|
| `AltBilgi.gizlilikLink` | mobil `/hikaye/`, `/konum/` | 3.33 | 4.5 |
| `AltBilgi.gizlilikLink` | mobil `/en/hikaye/`, `/en/konum/` | 3.66 | 4.5 |
| `AltBilgi.gizlilikLink` | mobil `/` | 4.01 | 4.5 |
| `AltBilgi.gizlilikLink` | mobil `/en/` | 4.44 | 4.5 |
| `AltBilgi.telifMetin` | mobil `/hikaye/`, `/konum/`, `/en/hikaye/`, `/en/konum/` | 3.82 | 4.5 |
| `AltBilgi.telifMetin` | mobil `/en/gizlilik/` | 3.89 | 4.5 |
| `AltBilgi.telifMetin` | mobil `/gizlilik/` | 3.95 | 4.5 |
| `AltBilgi.telifMetin` | mobil `/` | 3.99 | 4.5 |
| `AltBilgi.telifMetin` | mobil `/en/` | 4.26 | 4.5 |

Nedensellik ölçüldü, `/konum/` üzerinde 9 örnek, 8 saniyeye yayılmış:

| Ortam | telif satırı | Gizlilik bağlantısı |
|---|---|---|
| 390px, kor sahnesi açık | 3.82 | 3.33 |
| 390px, kor sahnesi gizli | 4.60 | 4.60 |
| 1440px, kor sahnesi açık | 4.61 | 4.60 |

Yani `--krem-50` üzerine `#0A0807` zemininin taban oranı 4.60, eşiğin 0.10 üstünde.
Dar ekranda kor sahnesinin radial parıltısı telif şeridinin altına toplanıyor,
zemini açıyor ve oran eşiğin altına düşüyor. Değerler dokuz örnekte sabit, yani
kor nefesi kaynaklı bir dalgalanma değil.

### 5.2 Klavye

| # | Madde | Sonuç |
|---|---|---|
| 5.2.1 | Sekme sırası DOM sırasını izler | geçti, 20 koşumda (10 rota x 2 genişlik) 0 ihlal |
| 5.2.2 | Odak her durakta görünür | geçti, görünmez odak 0 |
| 5.2.3 | Tuzak yok | geçti, sekme daima ilk durağa döner |
| 5.2.4 | Çekmece odağı içeride tutar | geçti, 10 sekme sonunda 0 kaçak |
| 5.2.5 | Escape çekmeceyi kapatır | geçti, `/`, `/menu/`, `/en/` |
| 5.2.6 | Kapanışta odak tetikleyiciye döner | geçti |
| 5.2.7 | Çekmece açıkken gövde kaydırması kilitli | geçti |
| 5.2.8 | Atlanan blok bağlantısı (skip link) | **yok**, `<main>` id'siz. Bkz. task-15 raporu |

### 5.3 Landmark ve başlık

| # | Madde | Sonuç |
|---|---|---|
| 5.3.1 | Her rotada tam bir `h1` | geçti, 10/10 |
| 5.3.2 | Atlanan başlık seviyesi yok | geçti, h1 > h2 > h3 |
| 5.3.3 | İki `nav` ayrı ad taşır | geçti, `Ana gezinme` / `Mobil gezinme` (EN: `Main navigation` / `Mobile navigation`) |
| 5.3.4 | `role="dialog"` erişilebilir ad | **yok**, çekmecede `aria-label` eksik. Bkz. task-15 raporu |

### 5.4 Dokunma hedefi

1154 gerçek isabet ölçümü, 84 benzersiz hedef türü, 41'i tabanı geçiyor. Taban
44px, kaynak brief'in kendi kuralı (proje bilgi dosyası bölüm 9.5).

| Grup | 44px altı | Not |
|---|---|---|
| `BeadRay` boncukları (14-22px) | 14 tür | `aria-hidden`, `tabIndex={-1}`, dekoratif; kayıtlı (`IYILESTIRMELER.md` satır 63) |
| `AltBilgi.sayfaLinki` (26-28px yükseklik) | 16 tür | metin bağlantısı, iki genişlikte de |
| `UstBar.link` Menü/Gece/Story/Night (40-42px genişlik) | 5 tür | yalnız masaüstü, 44px'e 2-4px kalıyor |
| `DilAnahtari` TR/EN (20px genişlik) | 4 tür | asıl dokunma hedefi, iki genişlikte de |
| `AltBilgi.gizlilikLink` (42-44px) | 2 tür | |
| `UstBar.marka` (20px mobil, 26px masaüstü yükseklik) | 2 tür | |

Çakışma taraması (hedefler çift çift kesiştirildi):

| # | Madde | Sonuç |
|---|---|---|
| 5.4.1 | Kalıcı çakışma, çekmece dışı | yok. Sabit üst barın altından geçen kaydırma anları kalıcı değil, her hedef bir kaydırma konumunda %100 kendi alanına sahip |
| 5.4.2 | Çekmece açıkken kapatma hedefi | **düzeltildi.** Öncesinde %0 sahiplik, hedefi hamburger çalıyordu. Bkz. task-15 raporu |
| 5.4.3 | Çekmece açıkken arka plan hedefleri | geçti, düzeltmeden sonra hepsi %0, yani `aria-modal` sözü davranışta da tutuluyor |

Footer iletişim satırlarının kayıtlı 28px istisnası bugün geçersiz: telefon,
WhatsApp ve Instagram `null` olduğu için satırlar `<a>` değil `<div>`, yani dokunma
hedefi değil. Veri geldiğinde madde geri döner.

### 5.5 Hareket azaltılmış

`prefers-reduced-motion: reduce` ile on rota:

| # | Madde | Sonuç |
|---|---|---|
| 5.5.1 | Canlı animasyon sayısı | 0, on rotada |
| 5.5.2 | Canlı geçiş sayısı | 0, on rotada |
| 5.5.3 | `scroll-behavior` | `auto`, on rotada (çapa kaydırması anında zıplar) |
| 5.5.4 | Kararma (opacity) izlemeye devam eder | kayıtlı karar (`KISITLAR.md`), hata değil |

### 5.6 Dekoratif katmanlar

| Katman | `aria-hidden` |
|---|---|
| Kor sahnesi, çekirdek, duman küreleri | evet |
| İmleç koru | evet |
| Bead rayı ve boncuklar | evet |
| Tane rayları (`TaneDizilimi`) | evet |
| İlerleme çubuğu | evet |
| Harita levhasının çizim katmanları (ızgara, yol, halka, pin, nabız) | evet |
| Harita levhasının **metinleri** | hayır, ağaçta kalır (doğru) |

Konum sayfasında ağaçta kalan harita metinleri: cadde adı, işaret etiketi
(`Ciğerci Bozo · No:4`), üç komşuluk çipi, alt not.

## 6. Parite

Ölçüm yöntemi: tasarım `.dc.html` ve port aynı tarayıcıda, aynı genişlikte açılır;
Bricolage ailesinden 26px ve üstü her metin öğesinin punto, ağırlık ve iz değeri
karşılaştırılır. Kare tek kanıt sayılmaz.

Mevcut kareler (önce listelendi): `01/02/03-ana-sayfa`, `04-ana-sayfa`,
`05-ana-sayfa`, `01/02/03-hikaye`, `01/02/03-konum`, `01/02/03-menu`, `mobil`.
**`04-menu.jpg` yoktur**, ona parite bağlanmaz.

| Sayfa | 1440px | 390px |
|---|---|---|
| Ana | 21/21 değer birebir | 8 fark, hepsi `Mobil Prototip.dc.html`'in doğru izlenmesi (aşağı bakın) |
| Menü | 14/14, 3'ü kayıtlı iz farkı | 5/5 birebir |
| Hikaye | 6/6 birebir, `Usül` > `Usul` kayıtlı | 3/3 birebir |
| Konum | 7/7 birebir | 4/4 birebir |

390px'te ana sayfanın sekiz farkı **hata değil**: masaüstü dosyası
(`Ana Sayfa Alternatif.dc.html`) dar ekran otoritesi değildir, o rolü
`Mobil Prototip.dc.html` taşır. Portun değerleri o dosyayla birebir:

| Öğe | Mobil prototip | Port |
|---|---|---|
| Hero H1 | `800 52px`, iz `-.05em` | 52px/800/-2.6px |
| `meşe korunda` | `800 26px`, iz `-.04em` | 26px/800/-1.04px |
| Gece başlığı | `800 40px`, iz `-.045em` | 40px/800/-1.8px |
| Konum başlığı | `700 30px`, iz `-.035em` | 30px/700/-1.05px |
| Sofra başlığı | `700 34px`, iz `-.04em` | 34px/700/-1.36px |
| Sayaç değerleri | `700 30px`, iz `-.04em` | 30px/700/-1.2px |

Menü sayfasındaki üç iz farkı (`-1.02px` yerine `-0.68px`, hero saati) kayıtlı:
`IYILESTIRMELER.md` satır 46, Konum ve Menü hero saatleri tek değerde birleştirildi.

Ana sayfa bölüm iskeleti:

| Ölçüm | Tasarım | Port |
|---|---|---|
| Bölüm sayısı ve `id` sırası | 7: acilis, iddia, ocaktan, ikram, gece, bozo, konum | aynı |
| `data-yogunluk` değerleri | 1, .55, .4, .7, 1.25, .45, .3 | aynı |
| Bölüm dolgusu | `120px 64px` | aynı |
| Hesaplanan bölüm yüksekliği | `900px` | `900px` |
| İç içerik yüksekliği (acilis / iddia / ocaktan) | 665 / 517 / 602 | 669 / 517 / 602 |
| Plaka yükseklikleri (iddia) | 517, 488 | 517, 486 |
| Gövde zemini | `rgb(10, 8, 7)` | aynı |

Belge boyu farkı (8410 / 6871) tasarım dosyasının kaydırma taklidinden gelen
`transform` artefaktıdır, `getBoundingClientRect` onu ölçer; hesaplanan yükseklik
iki tarafta da 900px. Kayıtlı (`IYILESTIRMELER.md` satır 13).

## 7. Uydurulmuş veri taraması

`content/isletme.ts` ve `docs/tasarim/metin-envanteri.json` içindeki her alan,
işletmenin kendi bilgi dosyasına karşı satır satır sınandı.

| # | Alan | Sonuç |
|---|---|---|
| 7.1 | Fiyatlar | `000 TL`, beş üründe de. Kaynak: bilinmiyor |
| 7.2 | Telefon | `000 000 00 00`, on rotanın hepsinde. Buton `.pasif`, `pointer-events: none` |
| 7.3 | WhatsApp | `null`, bağlantı üretilmiyor |
| 7.4 | Instagram | `null`, `sameAs` yapısal veriye girmiyor |
| 7.5 | E-posta | `null`, `email` yapısal veriye girmiyor |
| 7.6 | Harita koordinatı | `null`, `geo` yapısal veriye girmiyor; yol tarifi adres araması |
| 7.7 | `priceRange` | kasten yok, on rotada 0 |
| 7.8 | Dalak ve yürek porsiyon detayı | "Porsiyon detayı işletmeden bekleniyor" |
| 7.9 | Gece menüsü kalemleri | "Hangi ürünlerin ocakta kalacağı henüz belli değil" |
| 7.10 | İçecek listesi | Ayran, Şalgam, Çay + "liste tamamlanacak". Üçü kaynakta `[ÖNERİ]`, envanterin öngördüğü yer tutucu dizilim |
| 7.11 | 16 fotoğraf | hiçbirinin `dosya` alanı yok, `<img>` sayısı 0, `out/_next/static/media` içinde tek görsel yok |
| 7.12 | Logo | çizilmiş logo yok, `TaneDizilimi` geometrik işaret |
| 7.13 | Bina numarası `No:4` | **doğrulanmış.** Sahibi 12 Ağustos 2026'da tasarımdan bağımsız bir belgeyle teyit etti; apartman adını yazmamayı seçti (`content/isletme.ts:16-18`, commit `7dec50b`) |
| 7.14 | Yapısal veri ile görünen adres aynı | geçti, `streetAddress: "Naci Talat Caddesi No:4"`; yol tarifi sorgusu `Ciğerci Bozo, Naci Talat Caddesi No:4, Girne, KKTC` |

Kaynağa karşı doğrulanan olgular: işletme adı, kategori, cadde, şehir, ülke, sahip
(Engin Çağlar), saatler (`10:00 - 05:00`), alkolsüz, beş ürün, iki ikram, ciğerin
teknik detayları (8 şiş, şişte 4 ciğer + 2 kuyruk yağı, meşe koru), terbiyesiz tavuk
şişin kalça ve marine bilgisi, komşuluk adları.

### Metin kuralları

`out/**/*.html` içindeki **görünür metin** tarandı (etiket ve betik çıkarıldı):

| Kural | İhlal |
|---|---|
| Em dash (U+2014) | 0, `out/` altındaki hiçbir dosya türünde |
| Şapkalı harf (`â î û Â Î Û`) | 0 |
| Tamamı büyük harf cümle | 0 |
| müşteri, bedava, ücretsiz, hediye | 0 |
| mangal, barbekü, ızgara | 0 |
| şef, aşçı | 0 |
| parça, lokma, adet, tabak | 0 |
| masa (yemek bağlamında) | 0 |
| 7/24, non-stop | 0 |
| Yasaklı ifadeler listesi (eşsiz lezzet, efsane, leziz, ...) | 0 |

```bash
python3 - <<'PY'
import re, glob, html
FORBID = ['müşteri','bedava','ücretsiz','hediye','mangal','barbekü','ızgara','şef','aşçı',
          'parça','lokma','adet','tabak','7/24','non-stop','eşsiz lezzet','efsane','leziz',
          'ağızda dağılan','dumanı üstünde','sınırsız','dünyaca ünlü','şef önerisi']
for f in sorted(glob.glob('out/**/*.html', recursive=True)):
    raw = open(f, encoding='utf-8').read()
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
| 8.1 | `components/`, `lib/`, `content/` export'ları | 133 export, çağıransız 0 |
| 8.2 | CSS modülü sınıfları | 404 sınıf, hiçbir yerde geçmeyen 0 |
| 8.3 | `styles/tokens.css` token'ları | 127 token, kullanılmayan 2: `--mese`, `--tangerine-08`. Hata değil, sayfa görevleri için önden eklendi |
| 8.4 | Sözlük anahtarları | 3 ölü (bkz. 4.5), `IYILESTIRMELER.md` satır 109'da kayıtlı |
