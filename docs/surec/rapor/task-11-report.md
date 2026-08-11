# Task 11 raporu: Menü sayfası

Kapsam: `components/sayfa/MenuSayfasi.tsx` ve `components/sayfa/menu/` altındaki beş
bölüm bileşeni. Kabuk (üst bar, footer şeridi, çapa payı), paylaşılan primitifler ve
`styles/tokens.css` bu turda değişmedi.

Spec kaynağı her satırda `design_handoff_bozo_website/Menu Sayfasi.dc.html`. Türetilmiş
belgelerdeki (denetim, bayatlık taraması, ön geçiş raporu) her sayısal değer kaynağından
teyit edildi; uyuşmayan bir değer bulunmadı.

## Kapılar

| Kapı | Sonuç |
| --- | --- |
| `npm run typecheck` | temiz |
| `npm test` | 60/60 geçti |
| `npm run build` | temiz, 14 rota, static export |
| Geçici rota | hiç açılmadı; `MenuSayfasi` zaten `/menu/` ve `/en/menu/` altında |
| Tarayıcı | kendi sunucum (port 4611) + **kendi izole tarayıcı bağlamım** |
| 1440px ölçüm | `/menu/` ve `/en/menu/` |
| 390px ölçüm | yatay taşma 0 |
| Parite | `01-menu.jpg`, `02-menu.jpg`, `03-menu.jpg` (dördüncü kare yok, kurulmadı) |

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

**Tarayıcı notu.** Paylaşılan playwright sekmesi ölçüm sırasında başka bir ajan
tarafından `127.0.0.1:4014`'e taşındı ve bir ölçüm yarıda koptu. Bundan sonraki bütün
ölçümler `browser.newContext()` ile açılan, tek bir çağrı içinde açılıp kapanan izole
bağlamlarda yapıldı; sekme çekişmesi ölçümlere karışamaz.

## Ölçülen ve tasarımdaki değerler

Bütün ölçümler 1440x900, aksi yazmadıkça. "Tasarım" sütunu `Menu Sayfasi.dc.html`
satırıdır.

### Açılış (Menu:65-83)

| Değer | Tasarım | Ölçülen |
| --- | --- | --- |
| Bölüm dolgusu | `172px clamp(24px,5vw,64px) 46px` | **172px 64px 46px** |
| Bölüm yerleşimi | `flex; wrap; flex-end; space-between; gap:30px` | **aynı** |
| Sol kolon | `column; gap:20px` | **20px** |
| Çip + saat satırı | `gap:14px 20px` | **14px 20px** |
| Durum çipi | `9px 15px`, zemin `.62`, kenarlık `rgba(250,170,31,.3)`, nokta 8px | **aynı** |
| Canlı saat | `700 clamp(24px,2.6vw,34px)/1`, tabular | **34px / 700 / tabular** |
| H1 | `800 clamp(56px,9vw,140px)/.9`, `-.055em`, gölge `0 8px 50px rgba(10,8,7,.7)` | **129.6px / 116.64px (=.9) / -7.128px (=-.055em) / gölge birebir** |
| H1, 390px | clamp alt ucu 56px | **56px / 50.4px** |
| Spot | `400 clamp(16px,1.4vw,19px)/1.6`, `.78`, `max-width:540px` | **19px / 30.4px / .78 / 540px** |
| Not kartı | `max-width:300px; 20px 22px; rgba(10,8,7,.7); 1px rgba(...,.14); gap:9px` | **aynı, genişlik 300px** |
| Not başlığı | `700 16px/1.2`, `-.02em`, Bricolage | **16px / 19.2px / -0.32px** |
| Not gövdesi | `400 13px/1.6`, tabular, `.68` | **13px / 20.8px / tabular / .68** |

### Ocaktan (Menu:85-198)

| Değer | Tasarım | Ölçülen |
| --- | --- | --- |
| Bölüm dolgusu | `0 clamp(24px,5vw,64px) 40px` | **0px 64px 40px** |
| Başlık satırı | `padding-bottom:20px; border-bottom:1px rgba(242,233,220,.16); margin-bottom:34px` | **20px / birebir / 34px (bir sonraki kutunun margin-top'u)** |
| H2 | `700 clamp(30px,3.6vw,48px)/1.06`, `-.04em` | **48px / 50.88px / -1.92px** |
| Başlık rayı | 13/8/13/13/8/13, gap 10, `.8` krem + `#FAAA1F`, yarıçap 2/0 | **birebir** |
| Spread satırı | `gap:clamp(24px,3vw,44px); stretch; margin-bottom:aynı clamp` | **43.2px / 43.2px / stretch** |
| Spread plakası | `flex:1 1 520px; min-width:300px; min-height:clamp(340px,46vh,480px)`, zemin `#0C0A09` | **414px (=46vh) / `rgb(12,10,9)` / overflow hidden** |
| Spread hover | `inset 0 0 120px rgba(183,53,28,.4)`, `.3s` | **`inset 0 0 120px rgba(183,53,28,.4)` / 0.3s** |
| Spread etiketi | "tane yakın çekimi · yatay" | **birebir** |
| İmza paneli | `flex:1 1 380px; min-width:280px; padding:clamp(24px,2.6vw,38px); rgba(10,8,7,.78); 1px rgba(183,53,28,.4); gap:16px; center` | **37.44px dolgu, zemin ve kenarlık birebir** |
| "01" indeksi | `600 13px/1`, tabular, `.5` | **13px / 600 / tabular / .5** |
| İmza adı | `700 clamp(34px,4vw,54px)/1.02`, `-.04em` | **54px / 55.08px / -2.16px** |
| İmza açıklaması | `400 clamp(15px,1.3vw,17px)/1.6`, `.76` | **17px / 27.2px / .76** |
| Fiyat satırı | `padding-top:16px; border-top:1px rgba(...,.14); baseline; space-between; gap:14px` | **birebir** |
| "porsiyon" / fiyat | `400 14px/1 .6` / `600 clamp(20px,2vw,26px)/1` tangerine tabular | **14px/.6 ve 26px/tangerine/tabular** |
| Ürün ızgarası | `repeat(auto-fit,minmax(280px,1fr)); gap:clamp(20px,2.4vw,34px)` | **4 x 302.5px / 34px** |

### Ürün kartı (Menu:125-141), dört kart

| Değer | Tasarım | Ölçülen |
| --- | --- | --- |
| Kabuk | `rgba(10,8,7,.74)`, `1px rgba(242,233,220,.12)` | **birebir** |
| Geçiş | `transform .22s cubic-bezier(.2,.7,.2,1), border-color .22s, box-shadow .22s` | **birebir** |
| Hover | `translateY(-6px)`, `rgba(183,53,28,.65)`, `0 26px 60px rgba(0,0,0,.5)` | **matrix(...,-6) / .65 / birebir** |
| Plaka | `height:clamp(240px,30vh,300px)`, `#0C0A09` | **270px (=30vh) / `rgb(12,10,9)`** |
| Köşe işareti | TEK, sol-üst, 20px, `rgba(250,170,31,.5)`, inset 16px | **1 adet / 20px / 16px / .5** |
| İndeks rozeti | plakanın İÇİNDE, `right:16px; top:14px; 600 12px/1`, tabular, `.55` | **birebir, absolute** |
| Gövde | `22px 24px 24px; gap:10px; flex:1` | **birebir** |
| Ad | `700 clamp(24px,2.2vw,30px)/1.1`, `-.03em` | **30px / 33px / -0.9px** |
| Açıklama | `400 14.5px/1.55`, `.7` | **14.5px / 22.475px / .7** |
| Alt satır | `margin-top:auto; padding-top:14px; border-top:1px rgba(...,.12)` | **birebir, dört kart eşit yükseklikte (482px)** |
| Tane üçlüsü | 9/5/9, gap 4, `.5` krem + `.8` tangerine, yarıçap 1/0/1 | **birebir** |
| Fiyat | `600 18px/1` tangerine tabular | **birebir** |
| Kor nefesleri | 10s/.6s, 11s/1.2s, 9.5s/1.8s, 12s/2.4s | **10s/0.6s, 11s/1.2s, 9.5s/1.8s, 12s/2.4s** |
| İndeksler | 02, 03, 04, 05 | **birebir** |

### İkramlar (Menu:200-231)

| Değer | Tasarım | Ölçülen |
| --- | --- | --- |
| Bölüm dolgusu | `70px clamp(24px,5vw,64px) 40px` | **70px 64px 40px** |
| Başlık alt çizgisi | **turuncu** `1px rgba(250,170,31,.3)`, `margin-bottom:30px` | **birebir / 30px** |
| Başlık notu | `400 15px/1.5`, **`.72`** | **15px / 22.5px / .72** |
| Kart | `flex:1 1 400px; min-width:290px; wrap; rgba(10,8,7,.74); 1px rgba(250,170,31,.28)` | **birebir** |
| Plaka | `flex:1 1 180px; min-width:160px; min-height:200px`, kor `rgba(122,31,43,.5)` | **birebir, nar gradyanı** |
| Kor nefesleri | 11s/0 ve 12s/1.5s | **11s/0s, 12s/1.5s** |
| Gövde | `flex:1 1 200px; padding:24px; gap:9px; center` | **birebir** |
| Ad | `700 clamp(22px,2vw,27px)/1.1`, `-.03em` | **27px / 29.7px / -0.81px** |
| Açıklama | `400 14px/1.55`, `.7` | **14px / 21.7px / .7** |
| "ikram" | `600 15px/1` tangerine, kutusuz, `margin-top:4px` | **15px / 600 / tangerine / dolgu 0 / kenarlık yok / 4px** |

### İçecekler (Menu:233-262)

| Değer | Tasarım | Ölçülen |
| --- | --- | --- |
| Bölüm dolgusu | `60px clamp(24px,5vw,64px) 70px` | **60px 64px 70px** |
| Başlık notu | `400 15px/1.5`, **`.64`** | **15px / .64** |
| Başlık alt çizgisi | `1px rgba(242,233,220,.16)`, `margin-bottom:26px` | **birebir / 26px** |
| Satır | `gap:clamp(20px,2.4vw,34px); stretch` | **34px / stretch** |
| Plaka | `flex:1 1 340px; min-width:280px; min-height:260px`, `emberSoft 13s` | **birebir, 13s** |
| Liste kolonu | `flex:1 1 420px; min-width:300px; gap:12px` | **birebir** |
| Satır kutusu | `18px 20px; rgba(10,8,7,.72); 1px rgba(...,.12); baseline; gap:14px` | **birebir** |
| Ad / fiyat | `600 17px/1` krem / `600 15px/1` tangerine tabular | **birebir** |
| Yer tutucu | `16px 20px; 1px dashed rgba(242,233,220,.22); center`, `400 14px/1 .58` | **birebir, 1 adet** |
| Dipnot | `margin-top:28px; padding-top:22px; border-top:1px rgba(...,.12); space-between; gap:18px` | **birebir** |
| Alkolsüz satırı | `400 15px/1.6`, `.74` | **15px / 24px / .74** |
| QR glifi | `34x34; 1px rgba(242,233,220,.25); 3x3; gap:2px; padding:5px`, köşeler `.7`, merkez `rgba(250,170,31,.85)` | **birebir, dokuz hücrenin dördü `.7`, merkez `.85`, dördü boş** |
| QR notu | `400 13.5px/1.5`, `.62`, `max-width:260px` | **birebir** |

### Çekim listesi (Menu:264-281)

| Değer | Tasarım | Ölçülen |
| --- | --- | --- |
| Bölüm dolgusu | `0 clamp(24px,5vw,64px) 80px` | **0px 64px 80px** |
| Panel | `26px clamp(20px,2.4vw,32px); rgba(10,8,7,.72); 1px rgba(...,.12)` | **26px 32px, birebir** |
| Panel başlığı | `700 22px/1.15`, `-.03em`, alt çizgi YOK | **22px / 25.3px / -0.66px** |
| Alt metin | `400 13.5px/1.5`, `.64` | **birebir** |
| Başlık satırı | `margin-bottom:20px; gap:14px; baseline` | **birebir** |
| Izgara | `repeat(auto-fit,minmax(150px,1fr)); gap:12px` | **1440: 7x167.7 / 1024: 5x164.5 / 780: 4x156 / 390: 1x300** |
| Karo | `height:110px`, kor `rgba(183,53,28,.3)`, animasyon YOK, vinyet YOK | **110px / birebir / `animation-name: none` / vinyet `display:none`** |
| AI notu | `margin-top:18px; 400 13px/1.6`, `.6` | **birebir** |

### Çapa payı (Menu:347 `- 96`)

Mekanizma `Kabuk`'un `.icSayfa [id]` kuralı; sayfa hiçbir yerde pay vermiyor.

| Hedef | `scroll-margin-top` | Bölümün tepesi | Başlığın bar altındaki nefesi |
| --- | --- | --- | --- |
| `#ocaktan` | **96px** | **96px** | **+18px** (bar 78px) |
| `#ikramlar` | **96px** | **96px** | +59px |
| `#icecekler` | **96px** | **96px** | +49px |

Üç çapa da tam 96px'te iniyor, pay geliyor, elle bir şey eklenmedi. Üst barın üç
tetikleyicisi de gerçek hedefe bağlı: `#ocaktan`, `#ikramlar`, `#icecekler`.

### Hareket azaltılmış

`prefers-reduced-motion: reduce` bağlamında ölçüldü: `main` içinde animasyonlu öge
**0**, geçişli öge **0**, `scroll-behavior: auto`. Plaka kor nefesleri duruyor, kart ve
spread hover geçişleri anında, çapa zıplayarak iniyor.

### 390px

Yatay taşma **0**. H1 clamp alt ucunda (56px), not kartı 300px, ürün ızgarası tek
kolona (342px) düşüyor, çekim ızgarası tek kolona düşüyor. `main` içinde hiç
etkileşimli öge yok (tasarımda da yok: kartların `href`'i, `data-git`'i ve
`cursor:pointer`'ı yok), yani 44px dokunma hedefi kuralı bu sayfanın gövdesinde
bağlanacak bir şey bulmuyor. Bar ve footer şeridi kabuğun.

### Üst barın sarma riski (kabuk turu, endişe 2)

Kabuk turu "menü sayfasında beş nav öğesi var, 780-1100px arası sarabilir, sayfa
dolunca bakılmalı" demişti. Ölçüldü: 800 / 900 / 1000 / 1100 / 1200px'te nav **tek
satır**, yükseklik 44px, yatay taşma 0. Sarma yok, endişe kapandı.

## Kapatılan denetim maddeleri

### Sapmalar

| # | Durum |
| --- | --- |
| S1 | **Kapandı.** İndeks rozeti gövdede değil, `FotoYuvasi`'nin `children` yuvasında; konumlandırma `UrunKarti.module.css`'te (`right:16px; top:14px; 600 12px/1; tabular; --krem-55`). Ölçüldü. |
| S2 | **Kapandı.** Spread `bicim="spread"`, kart `"kart"`, ikram `"ikram"`, içecek `"icecek"`, çekim karosu `"karo"`. Beşinin de ölçüsü tasarımla birebir. |
| S3 | **Kapandı.** `bicim="kart"` varsayılanı zaten tek köşe; prop geçilmedi, ölçümde 1 köşe. |
| S4 | **Kapandı.** `<TaneDizilimi adet={3} buyuk={9} kucuk={5} bosluk={4} ton="krem50" />`, ölçümde 9/5/9 + `.5`/`.8`. |
| S5 | **Kapandı.** Kuzu şişin açıklaması sözlükten aynen basıldı, yer tutucu yazılmadı. |
| S6 | **Kapandı.** Gece menüsü not kartı sözlükten aynen basıldı. |
| S7 | **Kapandı, bir fark raporlanıyor.** `ortak.alkolsuzKisa` kullanıldı. Aşağıya bakın. |
| S8 | **Kapandı.** Kesik çerçeveli slot metinli, `ICECEK_YER_TUTUCU_ADEDI` = 1. |
| S9 | **Kapandı.** Spread `id="tane-yakin-cekim-yatay"`, çekim listesinin 1. karosu `id="tane-yakin-cekim"`. |
| S10 | **Karar verildi, ölçümle.** Aşağıya bakın. |
| S11 | **Uyuldu.** Parite üç kare üzerinden yapıldı, dördüncü kareye dayanan hiçbir doğrulama kurulmadı. |

### Eksikler

| # | Durum |
| --- | --- |
| E1 | **Kapandı.** Üç başlık `BolumBasligi olcek="sayfa"`; İkramlar `vurguCizgi notTonu="krem72"`, İçecekler `notTonu="krem64"`, Ocaktan `sag={TaneDizilimi 6/13/8/10 krem80}`. `margin-bottom` (34/30/26) sayfadan geldi. |
| E2 | **Kapandı.** H1, spot, çip+saat satırı, not kartı ve bölüm geometrisi kuruldu; ölçüler yukarıdaki tabloda. |
| E3 | **Kapandı.** Üç id kondu; 96px `Kabuk`'tan geliyor, sayfa pay vermiyor, ölçüldü. |
| E4 | **Kapandı.** Panel, başlık satırı, ızgara ve AI notu kuruldu. Panel başlığı düz `<h2>`, `BolumBasligi` değil. |
| E5 | **Kapandı.** Kart kabuğu ve hover'ı ölçüldü, birebir. |
| E6 | **Kapandı.** İmza paneli sayfaya özel kabuk (`CamPanel` değil), çipler `Cip tur="outline"` ve `tur="dolu"`. |
| E7 | **Kapandı.** Prop geçilmedi, `bicim="spread"` hover'ı, iki çapraz köşeyi ve etiketi doğru basıyor. |
| E8 | **Kapandı.** Spread satırı ve ürün ızgarası ölçüldü. |
| E9 | **Kapandı.** Dört kart 10/.6, 11/1.2, 9.5/1.8, 12/2.4; ikramlar 11/0 ve 12/1.5; içecek 13s; karo animasyonsuz. Hepsi ölçüldü. |
| E10 | **Kapandı.** İkram kartları kuruldu, `Cip tur="ikram"`, kenarlık `--tangerine-28`, kor nar tonunda. |
| E11 | **Kapandı.** Üç içecek satırı ve ölçüleri kuruldu. |
| E12 | **Kapandı.** QR glifi 3x3 ızgara olarak sayfa içinde çizildi, çerçeve `--cizgi-qr`. |
| E13 | **Kapandı.** Dört bölümün dolgusu ölçüldü. |
| E14 | **Kabuk turu kapattı**, bu turda dokunulmadı. `AltBilgiSerit` menü sayfasının kompakt şeridini basıyor. |
| E15 | **Bilinçli sapma olarak raporlanıyor.** Aşağıya bakın. |
| E16 | **Kapandı.** `Bolum` kullanılmadı, beş bölüm düz `<section>`. Kaynak taraması tekrar doğrulandı: `Menu Sayfasi.dc.html`'de `data-erit` 0, `data-yogunluk` 0. |

## S10: `kurulu-sofra` etiketi kararı

**Karar: (a) manifest etiketi olduğu gibi basılır** (`kurulu sofra, üstten`), tasarımdan
bilinçli sapma olarak kaydedildi. `FotoYuvasi`'ye kısa etiket alanı eklenmedi.

### Ölçüm

Ölçüt "110px karoda uzun etiket sarıyor mu" idi. Karonun yüksekliği 110px sabit,
genişliği ızgaradan geliyor; dört genişlikte ölçüldü. Etiket `position:absolute;
left:12px` olduğu için kullanılabilir genişlik karo genişliği eksi 12px.

| Viewport | Karo genişliği | Etiketin genişliği | Satır | Sağdan kalan boşluk |
| --- | --- | --- | --- | --- |
| 1440 | 168px | **106.9px** | **1** | 48.8px |
| 1024 | 164px | **106.9px** | **1** | 45.6px |
| 780 | **156px** (ölçülen en dar karo) | **106.9px** | **1** | 37.1px |
| 390 | 300px (tek kolon) | **106.9px** | **1** | 181.1px |

Izgaranın alt sınırı `minmax(150px,1fr)`, yani karo hiçbir genişlikte 150px'in altına
inemez; en kötü durumda kullanılabilir alan 138px, etiket 106.9px. **Hiçbir genişlikte
sarmıyor, hiçbir genişlikte kırpılmıyor.**

Karşılaştırma için tasarımın kendi en uzun karo etiketleri: "tane yakın çekimi" 95.4px,
"beş ürün ayrı ayrı" 95.3px. Uzun etiket bunlardan yalnız ~11px geniş, aynı ritmin
içinde kalıyor.

### Gerekçe

- Ölçüt karşılanmadı: dar karo hipotezi (etiket sarıyor, o yüzden tasarım kısaltmış)
  ölçümle çürüdü. Yer sorunu yok.
- `tane-yakin-cekim` / `tane-yakin-cekim-yatay` kalıbı burada geçerli değil: orada iki
  farklı en-boy oranı, yani **iki ayrı çekim** vardı; `kurulu-sofra` tek çekim.
- `FotoYuvasi` paylaşılan primitif ve `karo`'nun tek çağıranı bu ızgara. Diğer altı
  karonun etiketi manifestle **birebir aynı** (doğrulandı: `tane yakın çekimi`,
  `kor üzerinde şiş`, `ustanın eli`, `gece cephesi`, `paket ve gel al`,
  `beş ürün ayrı ayrı`). Yani kısa etiket alanı, tek bir değeri iki kelime kısaltmak
  için paylaşılan bir API'ye açılan spekülatif bir eksen olurdu; yedi kullanımın altısı
  onu boş bırakırdı.
- Manifest bir **çekim listesi**, yani fotoğrafçıya verilen kadraj tarifi; bu bölüm de
  tam olarak o listenin ekrandaki hali. Kadraj bilgisini (`üstten`) tam da o listede
  düşürmek, listenin işini eksiltir.

**Sapma kaydı:** ekranda dördüncü karo "kurulu sofra, üstten" yazıyor, tasarımda
"kurulu sofra" yazıyor. İki kelime fazla, sarma yok, hizalama bozulmuyor.
`IYILESTIRMELER.md`'ye yazılması gereken bir madde (o dosyaya bu turda dokunulmadı,
birden çok ajan yazıyor).

## S7: `alkolsuzKisa` ve sondaki nokta

`Menu:252` "Mekanımız alkolsüzdür." yazıyor, sonda **nokta var**.
`content/tr/ortak.ts:71` `alkolsuzKisa: 'Mekanımız alkolsüzdür'`, **noktasız**.
EN tarafında da aynı: `Menu:252` `data-en` "Our place is alcohol-free.", sözlükte
"Our place is alcohol-free".

Talimat gereği sözlüğe elle nokta eklenmedi ve `ortak.alkolsuz` (menüde olmayan ikinci
cümleyi taşıyan anahtar) kullanılmadı. Ekranda satır noktasız basılıyor.

Not: aynı anahtar `AltBilgiSayfalar`'ın Saatler kolonunda da kullanılıyor ve orada
tasarım da noktasız yazıyor (`Hikaye:150`). Yani noktanın sözlüğe eklenmesi footer'ı
bozar; doğru çözüm ya menüye özel ikinci bir anahtar ya da noktayı hiç basmamak.
İkincisi seçildi. **Sözlük sahibine soru.**

## E15: EN katmanının bilinçli sapması

`content/en/menu.ts` ürün adlarını çevirmiyor, **açıklıyor**: `Spleen (dalak)`,
`Heart (yürek)`, `Lamb skewer (kuzu şiş)`, `Chicken skewer (terbiyesiz tavuk şiş)`,
`Urfa liver kebab (ciğer)`. Tasarımda bu metinler `data-en` taşımıyor, yani tasarımın
EN görünümünde Türkçe kalıyorlar.

Aynı şey plaka etiketlerinde de var: `content/fotograflar.ts` `etiketEn` taşıyor ve
`FotoYuvasi` dile göre çeviriyor (`the cut, close up`, `the table, from above`),
tasarım ise çevirmiyor.

Bu içerik katmanının kararı ve `KISITLAR.md`'nin sert kuralından geliyor ("İngilizce
Türkçenin çevirisi değil, yemek adları çevrilmez, açıklanır"). **Ekran
karşılaştırmasında hata sayılmadı, bilinçli sapma olarak buraya kaydedildi.** Kod
tarafında yapılacak bir şey yok. `/en/menu/` ölçüldü: `lang="en"`, H1 "Menu", bölüm
id'leri Türkçe kaldı (`#ocaktan`, `#ikramlar`, `#icecekler`, rota adları gibi), üst
barın çapa etiketleri EN.

## 16px tabanı: bu sayfanın kaydı (bir kez)

`KISITLAR.md`'nin 3. katmanı gereği, bu sayfadaki 16px altı **gerçek prose**:

- Ürün kartı açıklamaları **14.5px/1.55** (Menu:135, 153, 171, 189), dört kullanım
- İkram açıklamaları **14px/1.55** (Menu:214, 226), iki kullanım
- Alkolsüz satırı **15px/1.6** (Menu:252), bir kullanım

Üçü de tasarımın ölçüsünde bırakıldı, yuvarlanmadı. Erişilebilirlik kontrast ve
dokunma hedefi üzerinden taşınıyor; bu bölümlerde etkileşimli öge yok, kontrast krem
`.7`-`.74` düzeyinde.

2. katmana (arayüz mikro metni) düşen ve kayıt gerektirmeyenler: bölüm başlığı notları
15px, "porsiyon" 14px, yer tutucu 14px, QR notu ve çekim alt metni 13.5px, indeksler
13px ve 12px, plaka etiketleri 11.5-12.5px.

**Kuralda kapsanmayan iki metin, aşağıda "gözden kaçmış gibi duran" başlığında.**

## Yeni bileşenler: neden paylaşılan değil, sayfaya yerel

Hiçbir yeni paylaşılan primitif yazılmadı. `components/sayfa/menu/` altında beş bölüm
bileşeni ve bir kart bileşeni var.

| Bileşen | Yerel olma gerekçesi |
| --- | --- |
| `menu/Acilis` | Menü açılışının geometrisi (172px üst dolgu, `flex-end` hizası, sağdaki not kartı) yalnız bu sayfada. Konum ve Hikaye hero'ları farklı ölçülerde ve farklı içerikte. |
| `menu/Ocaktan` | Spread + imza paneli + ızgara üçlüsü bu sayfaya özgü. |
| `menu/UrunKarti` | **Tek çağıranı var ve başka çağıran adayı yok.** Ana sayfanın ocaktan bölümü satır tabanlı (`MenuSatiri`, `Ana:176-208`), Hikaye ve Konum ürün kartı taşımıyor. `components/ui/` altına konsaydı, tek kullanıcısı olan bir API donmuş olurdu. |
| `menu/Ikramlar` (+ içindeki `IkramKarti`) | İkram kartı iki kez, yalnız bu bölümde kullanılıyor; bölüm dosyasının içinde kaldı, ayrı dosya açmak dolaşımı artırırdı. |
| `menu/Icecekler` | Liste satırı, kesik yer tutucu ve QR glifi bu sayfaya özgü. QR glifi tasarımda tek kullanımlık (`Menu:254`), `Ikonlar.tsx`'e girmedi. |
| `menu/CekimListesi` | Panel ve karo ızgarası tasarımda yalnız burada. |

Paylaşılanlardan kullanılanlar, hiçbirine dokunulmadan: `FotoYuvasi` (beş biçim),
`BolumBasligi` (üç başlık, `notTonu` ve `vurguCizgi` ile), `Cip` (`outline`, `dolu`,
`ikram`), `TaneDizilimi` (`adet={6}` ve `adet={3}`), `DurumCipi` ve `CanliSaat`
(`boy="kucuk"`), `fiyatMetni`.

## Sapmalar ve ham yazılan değerler

| Yer | Tasarım | Uygulanan | Neden |
| --- | --- | --- | --- |
| Çekim karosu 4 | "kurulu sofra" | "kurulu sofra, üstten" | S10 kararı, yukarıda |
| Alkolsüz satırı | sonda nokta var | noktasız | S7, sözlüğe elle nokta eklenmedi |
| Ürün kartı geçişi | `.22s cubic-bezier(.2,.7,.2,1)` | aynı değer, **ham yazıldı** | `--gecis-*` ailesinde karşılığı yok (0.15 / 0.2 / 0.3 / 0.5) ve `tokens.css` bu turda dokunulmaz dosyaydı. Token turuna. |
| Üç bölüm başlığının `margin-bottom`'u | başlık satırında (34/30/26) | bir sonraki kutunun `margin-top`'u | `BolumBasligi` `className` almıyor; blok akışında iki komşunun arası birebir aynı, ikinci bir sarmalayıcı `<div>` eklenmedi |

Ham yazılan renk **yok**. Aranan bütün değerlerin token'ı vardı: `--panel-not`,
`--panel-imza`, `--panel-orta`, `--panel-acik`, `--kor-kenar`, `--kor-kenar-hover`,
`--golge-kart-hover`, `--tangerine-28`, `--tangerine-85`, `--cizgi-qr`,
`--cizgi-guclu` (kesik yer tutucunun `.22`'si), `--cizgi-kart`, `--cizgi`,
`--cizgi-bolum`, `--krem-50/55/58/60/62/64/68/70/74/76/78`, `--ol-hero-menu`,
`--iz-hero-menu`, `--ol-spot`, `--ol-imza-ad`, `--ol-imza-fiyat`, `--ol-govde-kucuk`,
`--ol-urun-ad`, `--ol-ikram-ad`, `--golge-baslik`, `--iz-sayfa-baslik`, `--iz-bolum`,
`--iz-duygusal`. Ön geçiş turunun 33 token'ının menüye ait olanlarının hepsi kullanıldı.

## Tasarımda karar değil, gözden kaçmış gibi duranlar

1. **96px çapa payı gece şeridini hesaba katmıyor.** Ölçüldü: gündüz üst bar 78px, çapa
   96px'e iniyor, "Ocaktan" başlığının üstünde 18px nefes kalıyor. Ama 01:00-05:00
   arasında gece şeridi açılıyor ve bar **107px** oluyor; o pencerede `#ocaktan`
   başlığının üst 11px'i barın altında kalıyor. Tasarımın kendi script'i de aynı sabit
   96'yı kullanıyor (`Menu:347`) ve kendi gece şeridini aynı pencerede açıyor
   (`Menu:38`, script `:331-333`), yani tasarımda da aynı çakışma var. Yalnız `#ocaktan`
   etkileniyor, çünkü tek üst dolgusu sıfır olan bölüm o. Düzeltmesi `Kabuk`'ta
   (dinamik pay veya şerit yüksekliği kadar ek), benim dosyalarımda değil: sessizce
   düzeltmedim, bildiriyorum.
2. **Gece menüsü not gövdesi ve AI notu 13px/1.6 prose ve `KISITLAR.md`'nin üç
   katmanının hiçbirine tam oturmuyor.** İkisi de iki cümlelik gerçek paragraf (Menu:81
   ve Menu:279), yani 2. katmanın "arayüz mikro metni" tanımına girmiyor; 3. katman ise
   bandını "14.5px - 15.5px" diye yazıyor, 13px onun da altında. Tasarımın ölçüsü
   uygulandı, yuvarlanmadı, ama kuralın bandı bu iki metni kapsayacak şekilde
   genişletilmeli ya da ikisi açıkça 2. katmana yazılmalı. `KISITLAR.md` bu turda
   dokunulmadı.
3. **Menü sayfasının açılışında hiç CTA yok**, oysa Hikaye ve Konum açılışlarında var.
   Tasarımın kararı olabilir (menü sayfasının kendisi zaten hedef), sessizce
   eklenmedi. Yalnız bildiriliyor.
4. **İmza paneli ile ürün kartları arasında indeks sürekliliği var (01..05) ama iki
   ayrı görsel dil kullanılıyor**: panelde "01" krem `.5`, 13px, çipin yanında; kartta
   "02".."05" krem `.55`, 12px, plakanın sağ üstünde. Bilinçli olabilir (biri panelin
   başlık satırı, diğeri plaka rozeti), aynen uygulandı.

## Öz denetim ve endişeler

1. **`.govde > :last-child { margin-top: 4px }`** (İkramlar) konuma bağlı bir seçici.
   Tasarım o 4px'i "ikram" ibaresinin kendisine veriyor (`Menu:215, 227`) ama `Cip`
   kasten kutusuz ve ölçüsüz (`IYILESTIRMELER.md`, `Cip` ikram varyantı), `className`
   de almıyor. Alternatifler: `Cip`'e prop eklemek (paylaşılan primitifi tek kullanım
   için genişletir) ya da fazladan bir sarmalayıcı `<span>` (DOM şişer). Seçici,
   gövdenin son çocuğunun her zaman o ibare olduğu gerçeğine dayanıyor ve yorumda
   yazılı. Kırılganlığı kabul edilmiş bir artık risk.
2. **İmza panelinin plakası ürün kaydından değil sayfadan geliyor.**
   `ocaktanUrunler[0].fotoId` `'tane-yakin-cekim'` (dikey kadraj, çekim listesinin
   1. karosu), spread ise `'tane-yakin-cekim-yatay'` istiyor. Sayfa doğru anahtarı
   doğrudan geçiyor ve gerekçe `Ocaktan.tsx`'in yorumunda yazılı, ama bu, dört kartın
   `urun.fotoId`'den okuyup imzanın okumadığı bir asimetri. Alternatif
   `ocaktanUrunler[0].fotoId`'yi yatay anahtara çevirmekti; `content/` bu görevin
   dosyası olmadığı için yapılmadı. **İçerik sahibine soru.**
3. **Parite kareleri birebir piksel karşılaştırmasına uygun değil.** Handoff
   ekran görüntüleri 924px genişlikte bir tuvalde alınmış ama `vw` birimleri daha küçük
   bir dış pencereye çözülmüş: `01-menu.jpg`'de H1 clamp'in **alt** ucunda (56px)
   görünüyor, oysa 924px'lik gerçek bir viewport'ta 9vw = 83px olurdu. Aynı sebeple
   açılışın sarma noktası da kayıyor (handoff'ta not kartı sola alta sarmış, 924px'lik
   gerçek viewport'ta yan yana sığıyor, aradaki fark 5px). Karşılaştırma bu yüzden
   yapısal yapıldı (öğe sırası, varlığı, iç boşluk oranları) ve sayısal doğrulama
   `.dc.html`'in CSS'ine karşı yapıldı. `02-menu` ve `03-menu` kareleri yapısal olarak
   ve iç boşluk düzeyinde birebir tuttu (kart dibi -> "İkramlar" -> çizgi -> ikram
   kartları mesafeleri 1-2px içinde).
4. **Bar 107px iken ölçüm alınırsa çapa raporu yanıltıcı olur.** İlk ölçümüm gece
   penceresine denk geldi; gündüz saati `page.clock` ile sabitlenip tekrar ölçüldü. Bu
   sayfanın canlı saate bağlı üç ögesi var (durum çipi, canlı saat, gece şeridi), ölçüm
   yapan herkesin saati sabitlemesi gerekiyor.
5. **Konsol.** `main` kaynaklı hata yok. Statik export'u `serve` ile açınca Next'in
   istemci parçası HMR websocket'i deniyor ve `ERR_CONNECTION_REFUSED` basıyor; sunucu
   dev sunucusu olmadığı için beklenen, koddan gelmiyor.

## Sahibine sorular

1. **`alkolsuzKisa` noktası.** Menü sayfasında cümle noktalı bitiyor (`Menu:252`),
   Hikaye/Konum footer'ının Saatler kolonunda noktasız (`Hikaye:150`). Tek anahtar iki
   yeri besliyor. Noktalı ikinci bir anahtar mı, yoksa ikisi de noktasız mı kalsın?
2. **`kurulu-sofra` etiketi.** Ölçüm kısa etiket gerekçesini çürüttü ve manifest etiketi
   basıldı ("kurulu sofra, üstten"). Tasarım o karoda iki kelimeyi bilerek mi düşürdü?
3. **`ocaktanUrunler[0].fotoId`.** Ciğerin kaydı dikey kadrajı (`tane-yakin-cekim`)
   gösteriyor ama menüdeki tek kullanımı yatay spread; kayıt yatay anahtara çevrilsin
   mi, yoksa sayfa doğru kadrajı seçmeye devam mı etsin?
4. **Gece şeridi açıkken çapa payı.** 96px, 107px'lik barın altında kalıyor ve
   "Ocaktan" başlığının tepesi 11px örtülüyor (tasarımda da öyle). Pay şerit
   yüksekliğine göre dinamik olsun mu?
5. **Menü açılışında CTA yokluğu** bilinçli mi?
