# Task 9 raporu: Ana sayfa, birinci yarı

Kapsam: `acilis`, `iddia`, `ocaktan`, `ikram` bölümleri + `AnimasyonluSayac`,
`MenuSatiri`, `DurumAltMetni`. `gece`, `bozo`, `konum`, `paket` ve `BeadRay`
Task 10'a bırakıldı, dokunulmadı.

Doğrulama kendi dev sunucumda (`next dev -p 3947`) ve kendi Playwright örneğimde
yapıldı. Statik export ayrıca 3949'da servis edilip ölçüldü.

## 1. Kapılar

| Kapı | Sonuç |
|---|---|
| `npm run typecheck` | temiz |
| `npm test` | 51/51 geçti (yeni test eklenmedi, aşağıda gerekçesi) |
| `npm run build` | temiz, 14 sayfa |
| Konsol hataları | yok. Tek 404 `favicon.ico`, görev öncesinden var |
| Hydration uyarısı | yok |

Build rota tablosu, `gecici-` ile başlayan rota yok:

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

Geçici rota hiç açılmadı: `AnaSayfa` zaten `app/(tr)/page.tsx` ve
`app/(en)/en/page.tsx` tarafından render ediliyor, `/` ve `/en/` doğrudan ölçüldü.
`app/**/page.tsx` dosyalarına dokunulmadı.

## 2. En güçlü parite kanıtı: ham tasarımla yan yana ölçüm

Ekran görüntüsü karşılaştırması (924px genişlikte JPEG) 1440px'te belirleyici
olmadığı için tasarımın kendi işaretlemesi ölçüldü: `Ana Sayfa Alternatif.dc.html`
satır 86-242 tek başına bir dosyaya çıkarıldı (`support.js` YOK, yalnız
`box-sizing` + `body{margin:0}`), 3948'de servis edildi ve aynı tarayıcıda,
aynı 1440x900 viewport'ta ölçüldü.

| Ölçü | Tasarım (ham işaretleme) | Uygulama | Fark |
|---|---|---|---|
| `acilis` erit kutusu | 1180 x 665.23 @ x=64 | 1180 @ x=64 | 0 |
| `iddia` erit kutusu | 1312 x 516.97 @ x=64 | 1312 x 516.97 @ x=64 | 0 |
| `ocaktan` erit/panel | 1180 x 602.04 @ x=64 | 1180 x 602.04 @ x=64 | 0 |
| `ikram` erit kutusu | 620 x 523.97 @ x=410 | 620 x 523.97 @ x=410 | 0 |
| `ikram` geniş plaka | 620 x 180 @ x=410 | 620 x 180 @ x=410 | 0 |
| `ocaktan` 1. satır | 1091.61 x 79.2 @ x=108.2 | 1091.61 x 79.2 @ x=108.2 | 0 |

Dört bölümün de dış geometrisi tasarımın kendi çıktısıyla piksel eşit.

## 3. Ölçülen ve tasarımdaki değerler

Hepsi 1440x900'de, `getComputedStyle` ile. Tasarım sütunu `.dc.html` satır
numarasıyla verilmiştir.

### Bölüm kabukları

| Bölüm | Tasarım | Ölçülen |
|---|---|---|
| acilis (86) | 100vh, column, center, `120px clamp(24,5vw,64) 0` | 900px, column, center, `120px 64px 0px` |
| iddia (128) | 100vh, row, align center, `120px clamp(...)` | 900px, row, center, `120px 64px` |
| ocaktan (169) | 100vh, row, align center, `120px clamp(...)` | 900px, row, center, `120px 64px` |
| ikram (219) | 100vh, center+center, text-align center | 900px, center, center, `text-align: center` |
| `data-yogunluk` | 1 / 0.55 / 0.4 / 0.7 | 1 / 0.55 / 0.4 / 0.7 |
| `id` | acilis / iddia / ocaktan / ikram | aynı |
| erit geçişi | opacity+transform | `opacity .5s ease-out, transform .5s ease-out` |

### Açılış (Ana:86-126)

| Öğe | Tasarım | Ölçülen |
|---|---|---|
| durum satırı | flex wrap, center, gap 14/26, mb 38 | birebir |
| durum alt metni (96) | `400 14.5px/1`, `rgba(242,233,220,.7)` | `400 14.5px/14.5px`, `rgba(242,233,220,0.7)` |
| H1 (98) | `800 clamp(60,10.4vw,168)/1.06`, ls -.018em | `800 149.76px/158.746px`, ls `-2.69568px` (= 149.76 x -0.018) |
| H1 gölgesi | `0 8px 60px rgba(10,8,7,.6)` | aynı |
| alt satır (99) | gap 24/34, mt 28 | birebir |
| "meşe korunda" (100) | `800 clamp(34,4.6vw,76)/1`, ls -.025em, krem-72 | `800 66.24px/66.24px`, ls `-1.656px` (= x -0.025), `rgba(242,233,220,0.72)` |
| tane rayı kabı (101) | `relative; flex:1; min-width:260; padding:16px 0`, gap 12 | `flex: 1 1 0%`, `min-width: 260px`, `16px 0px`, gap 12px |
| ray çizgisi (102) | absolute, 3px, mt -1.5px, gradient krem 54% -> .1 | absolute, 3px, `-1.5px`, `linear-gradient(to right, rgb(242,233,220) 54%, rgba(242,233,220,0.1))` |
| ray kareleri (103-108) | 20/12/20/20/12/20, r 2/1, krem + tangerine | birebir, kareler `position: relative` (çizgi arkadan geçiyor) |
| CTA satırı (111) | gap 14, mt 46 | birebir |
| birincil CTA (112) | `20px 34px`, 16.5px, kor, kor gölgesi | birebir, `min-height:44px`, gerçek `<a>` |
| ikincil CTA (113) | `19px 33px`, 16.5px, kenarlık `.4` | `19px 33px`, 16.5px, kenarlık **`.36`** (aşağıda açık madde) |
| ikincil CTA hedefi | `data-git="ocaktan"` | `href="#ocaktan"`, düz `<a>` (Link değil) |
| meta satırı (114) | gap 12/22, pl 10, `500 14.5px/1.6`, tabular, krem-74 | birebir, `margin: 0` |
| meta ayırıcı (116) | 1 x 14, `rgba(242,233,220,.24)` | `1px x 14px`, `rgba(242,233,220,0.24)` |
| ipucu (120) | mt clamp(40,6vh,72), gap 12, fit-content, gap geçişi .2s | `54px` (=6vh), gap 12px, 221.77px, `gap 0.2s ease-out` |
| ipucu hover | gap 22 | gap 22, renk değişmiyor (krem-66 sabit) |
| ipucu karesi (121) | 15x15, r2, krem-55 | birebir |
| ipucu çizgisi (122) | 52x1, `rgba(242,233,220,.3)` | birebir |
| ipucu metni (123) | `400 13px/1`, krem-66 | birebir |

### İddia (Ana:128-167)

| Öğe | Tasarım | Ölçülen |
|---|---|---|
| erit | flex wrap, center, gap clamp(32,4vw,72), w100% | `57.6px` (=4vw), `1312px` |
| cam panel (130) | `flex:1 1 480px; min-width:0`, dolgu clamp(28,3vw,48), `rgba(10,8,7,.72)`, kenarlık `.1`, blur(3px) | `1 1 480px`, `0px`, `43.2px`, birebir |
| H2 (131) | `700 clamp(32,4vw,54)/1.12`, ls -.02em | `700 54px/60.48px`, ls `-1.08px` |
| paragraf (132) | mt 22, `400 clamp(16,1.35vw,19)/1.65`, krem-78, mw 560 | `400 19px/31.35px`, `rgba(...,0.78)`, 560px |
| sayaç ızgarası (133) | mt 34, gap 1px, zemin `rgba(242,233,220,.12)` | birebir |
| hücre (134) | `1 1 150px`, `rgba(10,8,7,.9)`, `22px 24px`, gap 9 | birebir |
| sayı (135) | `700 clamp(44,4.6vw,64)/1`, tabular, ls -.02em, tangerine | `700 64px/64px`, tabular, `-1.28px`, `rgb(250,170,31)` |
| etiket (136) | `400 14px/1.45`, krem-74 | `400 14px/20.3px`, birebir |
| plaka (148) | `1 1 360px`, mw 520, h clamp(360,54vh,560), kenarlık `.22`, inset gölge | `520 x 486`, birebir |
| orta ray (149) | absolute, %50/%50, translate(-50,-50), opacity .5 | birebir |
| orta ray kareleri (150-155) | 22/13, kenarlık krem-50 ve tangerine-60, r 2/1 | birebir |

### Ocaktan (Ana:169-217)

| Öğe | Tasarım | Ölçülen |
|---|---|---|
| panel (170) | w100%, mw 1180, dolgu clamp(28,3vw,44), `rgba(10,8,7,.74)` | `1180px`, `43.2px`, birebir |
| başlık satırı (171) | space-between, baseline, gap 16, pb 22, alt çizgi `.14` | birebir |
| başlık (172) | `700 clamp(32,4vw,54)/1.12`, ls -.02em | `700 54px/60.48px`, `-1.08px` |
| alt not (173) | `400 15px/1.5`, krem-66 | birebir |
| satır (176) | flex wrap, center, gap 18/26, `22px 12px`, alt çizgi `.1`, geçiş `.2s` x2 | birebir, `background 0.2s ease-out, padding-left 0.2s ease-out` |
| satır hover | `background rgba(250,170,31,.07)`, `padding-left:24px` | ölçüldü: pl 12 -> 24, zemin `rgba(250,170,31,0.07)`, **`transform: none`** |
| hover'da satır yeri | yerinde kalır | x=108.2 ve genişlik 1091.61 **değişmedi**, yalnız ilk hücre 120.2 -> 132.2 |
| son satır çizgisi | var | `1px solid rgba(242,233,220,0.1)` (kaldırılmadı) |
| sıra (177) | `600 13px/1`, tabular, krem-62, w26, flex none | birebir, `01`..`05` |
| ad (178) | `700 clamp(22,2.2vw,30)/1.14`, ls -.015em, w clamp(160,20vw,260) | `700 30px/34.2px`, `-0.45px`, `260px` |
| açıklama (179) | `flex:1; min-width:200`, `400 15px/1.5`, krem-70 | birebir |
| ray (180) | 3 kare, 9/5/9, gap 4, krem-50 + tangerine-80, r 1/0 | `31px` toplam, `9x9 r1 rgba(242,233,220,0.5)`, `5x5 r0 rgba(250,170,31,0.8)`, `9x9` |
| fiyat (181) | `600 17px/1`, tabular, tangerine, w96, sağa | birebir, `000 TL` |

### İkram (Ana:219-242)

| Öğe | Tasarım | Ölçülen |
|---|---|---|
| erit (220) | mw 900, column, center, gap 28 | birebir (gerçek genişlik 620, tasarımda da 620) |
| tane rayı (221) | 16/10, gap 10, krem + tangerine | birebir |
| H2 (224) | `700 clamp(38,5.4vw,78)/1.1`, ls -.025em, gölge `0 8px 50px rgba(10,8,7,.7)` | `700 77.76px/85.536px`, `-1.944px`, birebir |
| paragraf (225) | `400 clamp(17,1.5vw,21)/1.6`, krem-80, mw 620 | `400 21px/33.6px`, `rgba(...,0.8)`, 620px |
| çip sarmalayıcı (226) | flex wrap, center, gap 12 | birebir |
| çip (227) | `13px 18px`, kenarlık tangerine-32, zemin `rgba(10,8,7,.55)`, baseline, gap 10 | birebir |
| çip adı (228) | `700 17px/1.25`, ls -.01em, krem | `700 17px/21.25px`, `-0.17px` |
| çip detayı (229) | `400 13px/1.4`, krem-66 | birebir |
| geniş plaka (236) | `min(760px,100%)`, h clamp(120,20vh,200), mt 14, kenarlık `.2` | `620 x 180`, `margin-top: 14px`, birebir (tasarım da 620 basıyor) |

## 4. Davranış doğrulamaları

**Sayaç.** Sayfa yenilendi, `iddia`'ya kaydırıldı, her karede örneklendi:

```
t=0    8 | 4+2 | 3     <- SSR degeri, JS oncesi
t=261  0 | 4+2 | 0     <- gozlemci kesisti, sayma basladi
t=311  2 | 4+2 | 1
t=477  5 | 4+2 | 2
t=644  7 | 4+2 | 2
t=794  8 | 4+2 | 3     <- bitti (533ms, ease-out cubic'in 8'e yuvarlandigi an 543ms)
```

Yukarı kaydırıp geri gelindiğinde tekrar saymadı (`unobserve`). `4+2` hiç değişmedi.
Statik çıktı doğrulandı, `out/index.html` içinde:
`<span class="...sayi"><span>8</span></span>`, `...sayi">4+2<`, `<span>3</span>`.
**0 basılmıyor.**

**Sayfa içi kaydırma.** Gerçek tıklama ile:

| Bağlantı | Hedefin belge içi üstü | Son `scrollY` | Ofset |
|---|---|---|---|
| "Menüyü gör" -> `#ocaktan` | 1800 | 1730 | **70px** |
| kaydırma ipucu -> `#iddia` | 900 | 830 | **70px** |

JS kaydırma yardımcısı yazılmadı. `scroll-margin-top: 70px` (`Bolum.module.css`)
artı `reset.css`'in `scroll-behavior: smooth` kuralı, tasarımın JS ile yaptığı işi
(aynı 70px sabiti, `BeadRay.tsx:35`) tarayıcının kendi mekanizmasıyla veriyor.
Bu bir sapma değil, mekanizma seçimi.

**Hareket azaltılmış** (`prefers-reduced-motion: reduce` emülasyonu):

| Kontrol | Sonuç |
|---|---|
| `scroll-behavior` | `auto` |
| erit katmanları (üç bölüm) | `opacity: 1`, `transform: none`, `transition: none` |
| sayaç | `8 / 4+2 / 3`, hiç animasyon yok |
| satır geçişi, ipucu geçişi | `none` |
| `#ocaktan` bağlantısı | 60ms sonra zaten 1730, yani anında zıpladı; ofset yine 70px |

**Dokunma hedefleri** (gerçek `elementFromPoint` taraması, hesapla değil):

| Hedef | Görünür kutu | Gerçek hedef | Çakışma |
|---|---|---|---|
| birincil CTA | 151x60 | 60px dikey | yok (CTA'lar arası 14px) |
| ikincil CTA | 164x60 | 60px dikey | yok |
| kaydırma ipucu (1440) | 222x15 | **44px** (y 815-858) | yok; üstteki CTA satırının dibi 775, arada 40px |
| kaydırma ipucu (390) | -- | 780px altında basılmıyor | aşağıya bakın |

**390px.** Yatay taşma 0 (`scrollWidth` 390). Dolgu `120px 24px 0`. H1 60px,
ikram H2 38px (clamp'lerin alt uçları). Menü satırı üç satıra sarıyor, hücre
sıraları tasarımın `flex-wrap` kurallarıyla aynı.

**`/en/` paritesi.** `lang="en"`, dört bölümün tamamı İngilizce:
"Dice-sized/liver", "The fire is lit until 05:00", "over oak embers",
"Get directions"/"See the menu", "The proof is in the cut",
"You can tell a master by the cut", 8/4+2/3 + İngilizce etiketler,
"From the fire" + beş satır ("Urfa liver kebab (ciğer)" ... ), "The table comes set".
Foto etiketleri de İngilizce ("the cut, close up", "the table, from above"),
yani `FotoYuvasi`'nin zorunlu `dil` prop'u iki çağrıda da doğru geçiyor.
İpucu dokunma hedefi `/en/`'de de 44px.

## 5. Denetim maddeleri, tek tek

### 14 sapma

| # | Sapma | Nasıl kapatıldı |
|---|---|---|
| 1 | İkram H2 `--ol-duygusal`/`--iz-duygusal` ile yazılmış | `700 clamp(38px,5.4vw,78px)/1.1` ham (tek kullanım, `/* Ana:224 */` yorumu) + `--iz-baslik` (-.025em, yeni token). Ölçülen 77.76px/85.536px/-1.944px |
| 2 | İkram çipi için `Cip tur="ikram"` seçilmiş | `IkramCipi` kullanıldı (Task 17'de ayrılmış). Ölçüldü: `13px 18px`, tangerine-32 kenarlık, `rgba(10,8,7,.55)` zemin, baseline, gap 10 |
| 3 | Satır hover'ı `translateX(24px)` | `padding-left: 24px`. Ölçüldü: hover'da satır x'i ve genişliği değişmiyor, `transform: none` |
| 4 | Hover zemini `--tangerine-08` | Yeni `--tangerine-07` token'ı. Ölçülen `rgba(250,170,31,0.07)` |
| 5 | Satır geçişi `--gecis-hizli` (.15s) | Yeni `--gecis-yerlesim` (.2s). Ölçülen `background 0.2s ease-out, padding-left 0.2s ease-out` |
| 6 | Ray 6 kare üretiyordu | `adet={3}`. Ölçülen: 3 kare |
| 7 | Ray boşluğu 5px | `bosluk={4}`. Ölçülen gap 4px, toplam 31px |
| 8 | Ray tonu/yarıçapı | `ton="krem50"`. Ölçülen: büyük `rgba(242,233,220,0.5)` r1, küçük `rgba(250,170,31,0.8)` r0 |
| 9 | `TaneDizilimi` tek `boy` prop'u küçük kareyi türetiyordu | Bileşen artık `buyuk`/`kucuk` ayrı alıyor. Dört çağrı: 20/12, 22/13, 9/5, 16/10. Dördü de ölçüldü, tasarımla birebir |
| 10 | `FotoYuvasi` children kabul etmiyordu | Artık ediyor; orta ray `.ortaRay` ile plakanın içine mutlak konumlandı, ölçüldü |
| 11 | `FotoYuvasi` çağrılarında `dil` atlanmış | İki çağrıda da `dil={dil}` var; `/en/`'de etiketler İngilizce basıyor (kanıt yukarıda) |
| 12 | `MenuSatiri` "menü sayfasında da kullanılır" vaadi | Sözlüğe bağlanmadı, yalnız ana sayfada kullanıldı. Menü sayfasının kendi bileşeni Task 11'in işi |
| 13 | `AnimasyonluSayac` `useState(0)` | `useState(hedef)`. Statik çıktıda 8 ve 3 basılıyor (kanıt yukarıda) |
| 14 | Ocaktan paneli dolgu ve genişlik | `dolgu="orta"` (43.2px = clamp(28,3vw,44)) + `genislik="sayfa"` (1180px). İkisi de ölçüldü |

### 12 eksik

| # | Eksik | Nasıl kapatıldı |
|---|---|---|
| 1 | İkram paragrafı tümüyle düşmüş | `s.ana.ikram.metin` basılıyor, `400 21px/33.6px`, krem-80, mw 620 |
| 2 | Bölüm sarmalayıcısı, id, yoğunluk, erit | Dördü de `Bolum` ile: id + `data-yogunluk` 1/0.55/0.4/0.7 + erit geçişi. `lib/cerceve.ts` bunları okuyor |
| 3 | Sayfa içi kaydırma hedefleri | `#ocaktan` ve `#iddia`, ikisi de ölçülen 70px ofsetle çalışıyor |
| 4 | Durum alt metni duruma bağlı değil | `DurumAltMetni` (yeni, `'use client'`), `useGirneSaati()` okuyor, `durum ?? false` deseni ile hydration güvenli |
| 5 | Hero alt başlık ölçüleri + ray çizgi katmanı | Ölçüldü: `800 66.24px/1`, -.025em, krem-72; çizgi mutlak, 3px, `margin-top:-1.5px`, karelerin arkasından |
| 6 | Meta satırı ve `.24` ayırıcı | Ölçüldü; `.24` için `--cizgi-meta` eklendi |
| 7 | Token'ı olmayan değerler | Beşi eklendi (bölüm 6). Kapsam dışı kalan ikisi (`rgba(250,170,31,.8)`, `rgba(250,170,31,.32)`, `rgba(10,8,7,.55)`) zaten Task 17'de eklenmiş: `--tangerine-80`, `--tangerine-32`, `--panel-yari` |
| 8 | İkram kolonu ve plaka değerleri | mw 900, column, center, gap 28; H2 gölgesi `--golge-baslik`; plaka `margin-top:14px`. Hepsi ölçüldü |
| 9 | Hero ve ocaktan genişlik sınırı | `--panel-en` (1180px) ve `genislik="sayfa"`. İkisi de 1180px ölçüldü |
| 10 | Dört bölümün `dil: Dil` imzası | Dördü de `{ dil: Dil }`; `/en/` paritesi doğrulandı |
| 11 | Sıra iki haneli | `String(sira).padStart(2,'0')`; ölçülen `01`..`05` |
| 12 | Son satırın çizgisi | Duruyor: `1px solid rgba(242,233,220,0.1)` |

## 6. Eklenen token'lar

Sayımlar beş `.dc.html` dosyasının tamamından, kendim saydım.

| Token | Değer | Sayım | Ad neden bu |
|---|---|---|---|
| `--cizgi-tire` | `rgba(242,233,220,0.3)` | 7 | Yedi kullanımın dördü metnin yanındaki 1px yatay çizgi (Ana:122 ipucu, Ana:262 gece, Mobil:155/345); kalan üçü duman tüyü gradyanı (Hikaye/Konum/Menu:31). Paylaşılan rol "kısa çizgi"; duman zaten Ana Sayfa'nın kendi `.32` değerinde (`KorSahnesi.module.css:74`), yani bu token kodda tek rolde kullanılıyor |
| `--cizgi-meta` | `rgba(242,233,220,0.24)` | 1 | Tek kullanım, o yüzden kullanıma göre adlandırıldı: hero meta satırının dikey ayırıcısı (Ana:116) |
| `--cizgi-kart` | `rgba(242,233,220,0.12)` | 25 | Baskın rol kart ve liste satırı kenarlığı (Menu:125-265 ürün kartları ve içecek kutuları, Mobil:176/201-204 çekmece satırları, Konum:109). İddia'daki kullanım da 1px gap'in altındaki hairline, yani aynı rol |
| `--tangerine-07` | `rgba(250,170,31,0.07)` | 12 | Tangerine ailesi sayısal adlandırılıyor (`--tangerine-08`, `-10`, `-12`) |
| `--gecis-yerlesim` | `0.2s ease-out` | 11 | Onbirinin hepsi Ana Sayfa'da ve ikisi de kutunun yerleşimini değiştiren hover: ipucunun `gap`'i, satırın `padding-left`'i ve ona eşlik eden zemini. Butonların salt boya geçişi `--gecis-hizli`'de (.15s) kalıyor; tasarım kımıldayan geçişi bir adım yavaş sürüyor |

Brief'in listelemediği, ama brief'in kendi kuralı ("birden çok yerde geçen değer
token olur") gereği eklenen üç tanesi:

| Token | Değer | Sayım | Gerekçe |
|---|---|---|---|
| `--iz-baslik` | `-0.025em` | 14, üç dosya | Denetim bunu açıkça "tokens.css'te karşılık yok" diye işaretlemişti. Hero alt satırı (Ana:100), ikram H2 (Ana:224), hikaye H2'leri (Hikaye:68,125), mobil ürün adları (Mobil x10). Panel içi bölüm başlığı `--iz-bolum`, sayfa hero'su `--iz-sayfa-baslik`, gece H2'si `--iz-duygusal` olarak kalıyor; bu dördünün dışındaki Bricolage başlıklarının izi |
| `--ol-govde-buyuk` | `clamp(17px,1.5vw,21px)` | 3, iki dosya | İkram paragrafı (Ana:225), gece paragrafı (Ana:253, Task 10), bozo paragrafı (Hikaye:69, Task 12). Mevcut `--ol-govde`'nin bir adım büyüğü |
| `--golge-baslik` | `0 8px 50px rgba(10,8,7,0.7)` | 5, dört dosya | Ana:224, Hikaye:68, Hikaye:125, Konum:74, Menu:76. Zemin üstünde tek başına duran başlığın gölgesi |

Token'a çıkarılmayan, bileşen CSS'ine kaynak yorumuyla ham yazılanlar:

- `clamp(44px,4.6vw,64px)` sayaç ölçüsü: 3 kullanımın üçü de aynı bileşenin üç
  hücresi, yani tek rol (`/* Ana:135, 139, 143 */`)
- `clamp(38px,5.4vw,78px)` ikram H2 ölçüsü: tek kullanım (`/* Ana:224 */`)
- `0 8px 60px rgba(10,8,7,.6)` hero H1 gölgesi: tek kullanım (`/* Ana:98 */`)
- `-0.015em` menü satırı adı: aşağıda açık madde

## 7. Diskten okunan imzalar, brief ile farklar

Bileşenlerin hepsi diskten okundu. Brief'in söylediği ile diskin söylediği
**hiçbir yerde çelişmedi**; Task 17'nin şekillendirdiği imzalar brief'te doğru
anlatılmış. Kayda değer iki nokta:

- `TaneDizilimi` gerçekten `{ adet?: 3|6; buyuk; kucuk; bosluk; ton?; cizgi? }`
  alıyor ve `.cizgiliKap` çizgiyi karelerin arkasından geçiriyor. Brief'in
  "sarmalayıcı yazmayın" talimatı diskle uyumlu.
- `Bolum`'un bugüne kadar hiç çağrı yeri yoktu, Task 9 ilki. `eritClassName`
  eklendi (birinci seçenek), `> div` seçicisi kullanılmadı.

## 8. Sahibine açık sorular

**1. Ocaktan satırları bir yere gitmeli mi?**
Tasarım beş satıra da `cursor:pointer` veriyor ama hiçbir hedef vermiyor: `data-git`
yok, href yok. Menü sayfasında bu satırın karşılığı da yok (orada ürünler tam
genişlikte plaka). Hedefsiz bir `cursor:pointer` sahte tıklanabilirliktir, o yüzden
satır interaktif yapılmadı ve `cursor` yazılmadı; hover'ın zemin ve dolgu geri
bildirimi korundu (ölçüldü). Karar gerekiyor: satırlar `/menu`'ye mi gitmeli, menü
sayfasındaki ilgili ürüne mi, yoksa gerçekten bilgi satırı mı?

**2. `Buton` `ikincil` kenarlığı: `.36` mı `.4` mü?**
Sayım: `.4` kenarlık tasarımda tek bir yerde ve tam da hero'nun `xl` butonunda
(Ana:113). `.36` üç yerde, hepsi daha küçük boylarda (Ana:319-320 `lg`, Menu:290
`md`). Hover zemininde de aynı bölünme: `.12` yalnız `xl`'de, `.1` diğerlerinde.
Fark boya bağlı kasıtlı bir adım olabilir (büyük butona bir tık güçlü kenarlık)
ya da tek dosyalık bir kayma olabilir; ayırt edecek kanıt yok. Task 17 çoğunluğa
normalize etmiş ama bu karar hiçbir yere yazılmamış. `Buton`'u üç sayfa daha
kullandığı için ana sayfa görevinde tek başına değiştirmedim. Fark 0.04 alfa,
gözle görünmüyor; kayıt için soruyorum.

**3. `-0.015em` token'ı.**
Değer tasarımda 9 yerde, iki dosyada, üç ayrı rolde (hero saati Ana:93, menü satırı
adları Ana:178-210, Hikaye:100-114). Token hak ediyor ama `CanliSaat.module.css:14`
zaten aynı değeri ham taşıyor ve o dosya bu görevin listesinde değil; tek taraflı
token eklemek aynı değerin ikinci kopyasını yaratırdı. Bir token birleştirme turuna
bıraktım, `IYILESTIRMELER.md`'ye yazdım.

## 9. Tasarımda karar değil, gözden kaçmış gibi duran şeyler

**1. Hero ve ocaktan 1180px'te sola yaslanıyor.**
Her ikisinin de erit katmanı `max-width:1180px` ama ortalama yok. 1440px'te sayfa
dolgusu 64px, kullanılabilir genişlik 1312px, panel 1180px: sağda 132px boşluk
kalıyor. Ham tasarım işaretlemesi de birebir aynı sonucu veriyor (bölüm 2, x=64),
yani bu benim eklediğim bir hata değil, tasarımın kendi davranışı. İkram bölümü
ise `justify-content:center` ile ortalanıyor. Aynı sayfada iki farklı hizalama
mantığı var; 1308px'in altındaki her viewport'ta fark görünmüyor, o yüzden
tasarım sırasında fark edilmemiş olabilir. Birebir uygulandı, bildiriliyor.

**2. Kaydırma ipucu ile mobil eylem barı çakışıyordu.**
390x844'te ipucu hero'nun dibinde (y 773-788), sabit `MobilAksiyonBari` ise
y=767'den başlıyor. Ölçüldü: 44px'lik hedefin yalnız 8px'i erişilebilir kalıyor,
kalan alana dokunan kullanıcı barın "Yol tarifi" hedefine, yani haritaya gidiyor.
Proje kuralı: çakışan hedef kısa hedeften kötüdür. Çözüm tasarımın kendi kararı
oldu: `Mobil Prototip.dc.html` hero'sunda bu ipucu **yok** ("kanıtı tanede" o
dosyada hiç geçmiyor), yani mobil düzen onu zaten düşürüyor. 780px altında
`display:none` (aynı eşik `MobilAksiyonBari.module.css:55`). Alternatif olan
"hero'ya alt dolgu ekle" tasarımın `padding-bottom:0` kararını bozardı.
`IYILESTIRMELER.md`'ye yazıldı. Doğrulandı: 390px'te ipucu basılmıyor, 1440px'te
hedef tam 44px.

**3. Meta satırının ayırıcısı sarınca boşta kalıyor.**
390px'te meta satırı iki satıra sarıyor ve dikey ayırıcı birinci satırın sonunda
asılı kalıyor. Tasarım da aynı işaretlemeyi taşıyor (Ana:114-118, `flex-wrap:wrap`).
Kozmetik, düzeltilmedi, bildiriliyor.

**4. 16px gövde metni tabanı.**
Bu dört bölümde tasarımın en küçük metinleri 13px (ipucu, çip detayı), 14px (sayaç
etiketi) ve 15px (satır açıklaması). `KISITLAR.md` "body text never below 16px"
diyor. Ağaç bu tabanı bugüne kadar akan gövde metni için uygulamış, etiket ve
altyazı ölçeği için değil (`AltBilgi` 12.5-14.5px, `FotoYuvasi` etiketi 12.5px).
Aynı yorumu sürdürdüm. Tabanın kapsamı Task 16'da netleşmeli.

## 10. Kendi denetimim, endişeler

- **Test eklenmedi.** Bu görevin ürünü saf sunum: dört bölüm, üç bileşen, hiç iş
  kuralı yok. `node:test` DOM çalıştırmıyor (jsdom yok, bağımlılık kısıtı yasak);
  eklenebilecek tek şey `padStart` gibi tek satırlık davranışların testi olurdu ki
  bu, davranış değil uygulama detayı testi olur. Doğrulama tarayıcı ölçümüyle
  yapıldı ve bu raporda tablo halinde duruyor.
- **`AnimasyonluSayac`, bölüm ilk yüklemede zaten görünürse.** `#iddia`'ya doğrudan
  derin bağlantıyla girilirse rakam bir an 8 görünür, sonra 0'dan sayar. Tasarımın
  kendi davranışı da bu (işaretlemede hedef duruyor, JS görünürlükte üstüne yazıyor).
  Alternatif "zaten görünürse hiç sayma" olurdu, brief bunu istemiyor; olduğu gibi
  bırakıldı.
- **Ekran görüntüsü alınamayan iki bölüm.** `ocaktan` ve `ikram` derinliğinde
  Playwright'ın `page.screenshot` çağrısı sürekli zaman aşımına uğradı (hem dev
  sunucuda hem statik export'ta). Sayfa tarafında sorun yok: o konumda boşta rAF
  sayımı saniyede 1 kare ve `document.getAnimations()` 0 döndürüyor, yani sayfa
  gerçekten boşta; harness'ın kararlı kare bekleyişi takılıyor. Bu iki bölümün
  paritesi bunun yerine ham tasarım işaretlemesine karşı ölçümle kanıtlandı
  (bölüm 2), ki JPEG karşılaştırmasından daha güçlü bir kanıt. `acilis` (1440 ve
  390) ve `iddia` (1440) ekran görüntüleri alındı ve gözle karşılaştırıldı,
  `01-ana-sayfa.jpg` ve `02-ana-sayfa.jpg` ile uyumlu.
- **Ağaçta başka bir el var.** Görev sırasında `docs/surec/DEVAM.md` benim
  dışımda değişti (sahibinin 12 Ağustos tarihli kor okunurluğu notu eklenmiş).
  Stage edilmedi, dokunulmadı.

## 11. Stage edilen dosyalar

Yalnız aşağıdakiler, yol vererek. `git add -A` kullanılmadı.

```
components/saat/DurumAltMetni.module.css      (yeni)
components/saat/DurumAltMetni.tsx             (yeni)
components/sayfa/AnaSayfa.tsx                 (değişti)
components/sayfa/ana/Acilis.module.css        (yeni)
components/sayfa/ana/Acilis.tsx               (yeni)
components/sayfa/ana/Iddia.module.css         (yeni)
components/sayfa/ana/Iddia.tsx                (yeni)
components/sayfa/ana/Ikram.module.css         (yeni)
components/sayfa/ana/Ikram.tsx                (yeni)
components/sayfa/ana/Ocaktan.module.css       (yeni)
components/sayfa/ana/Ocaktan.tsx              (yeni)
components/ui/AnimasyonluSayac.tsx            (yeni)
components/ui/Bolum.module.css                (değişti)
components/ui/Bolum.tsx                       (değişti)
components/ui/MenuSatiri.module.css           (yeni)
components/ui/MenuSatiri.tsx                  (yeni)
docs/surec/IYILESTIRMELER.md                  (değişti)
styles/tokens.css                             (değişti)
```

Stage edilmeyen: `docs/surec/DEVAM.md` (başka bir elin değişikliği).
