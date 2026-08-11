# Task 12 raporu: Hikaye sayfası

Kapsam: `/hikaye/` ve `/en/hikaye/` gövdesi, dört bölüm, artı iki paylaşılan
primitif (`EtiketSatiri`, `NotBlogu`). Kabuk (üst bar, footer, mobil bar),
`styles/tokens.css` ve `components/ui/{Buton,CamPanel,BolumBasligi,FotoYuvasi,Cip,TaneDizilimi}`
dokunulmadı.

Her değer `Hikaye Sayfasi.dc.html`'den okundu, türetilmiş belgelerden değil.

## Kapılar

| Kapı | Sonuç |
| --- | --- |
| `npm run typecheck` | temiz |
| `npm test` | 60/60 geçti |
| `npm run build` | temiz, 14 rota |
| Geçici rota | hiç açılmadı; ölçüm gerçek `/hikaye/` ve `/en/hikaye/` rotalarında |
| Tarayıcı | kendi Playwright örneğim, kendi portum (4823) |
| Konsol | 0 hata, dört ölçümün dördünde de (`/hikaye/` ve `/en/hikaye/`, 1440 + 390) |
| Yatay taşma | 0px, dört ölçümün dördünde |

Build rota tablosu (`gecici-` ile başlayan rota yok):

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

**Paylaşılan MCP tarayıcısı kullanılamadı.** İlk denemede sekme, başka bir
ajanın sunucusuna (`localhost:4611`) iki kez kaydı ve ölçüm yanlış sayfadan
okunacaktı; `location.port` kontrolü yakaladı. Ölçüm, `gstack`
`node_modules`'ündeki Playwright ile başlatılan **kendi tarayıcı örneğimde**
yapıldı. Projeye bağımlılık eklenmedi, `package.json` değişmedi.

## Kapatılan denetim maddeleri

**Sapmalar.** S1, S3, S4, S5, S6, S7, S13 kapatıldı. Bileşen tarafı zaten
kapalı olan S2, S8, S9, S10, S11, S12'nin çağrı yerleri yazıldı.

**Eksikler.** E1, E2, E3, E4, E6, E7, E8, E9, E10, E11, E12, E13, E14, E15,
E16 kapatıldı.

**E5 kısmen kapalı.** Satır ızgarasının bütün değerleri (`gap:18px 26px`,
`padding:26px 12px`, numara 26px/`padding-top:6px`, etiket
`clamp(150px,18vw,240px)`, gövde `flex:1;min-width:240px`) sayfa CSS'ine
girdi. Kapanmayan yarı: etiketin `-0.015em` izi hâlâ token'sız ve
`Usul.module.css` ile `MenuSatiri.module.css:31-33`'te iki kez ham yazılı.
Tokenlaştırma `MenuSatiri` ile birlikte yapılmalı, ikisi de benim dosya
kapsamımda değildi (`tokens.css` dokunulmaz).

Eski brief'in iki tehlikeli talimatı **uygulanmadı**: Usul metni
`content/tr/hikaye.ts:17-32`'nin onaylı halinde kaldı ("Manifesto" / "Orta
versiyon" blokları eklenmedi), açılış başlığı sözlüğün
`'Bozo bir marka ismi değil, bir insan'` sürümünde kaldı, ve başlık "Usul"
olarak basıldı, tasarımın "Usül"üne geri döndürülmedi.

## Ölçülen ve tasarımdaki değerler

1440px, `/hikaye/`. Tasarım sütunu `Hikaye Sayfasi.dc.html`'in satırı.

### Açılış (Hikaye:63-69)

| Değer | Tasarım | Ölçülen |
| --- | --- | --- |
| Bölüm dolgusu | `176px clamp(24,5vw,64) 64px` | **176px 64px 64px** |
| Etiket satırı | `flex; center; gap:12px; margin-bottom:26px` | **flex \| center \| 12px \| 26px** |
| Etiket metni | `500 15px/1`, krem `.74` | **500 \| 15px \| 15px \| rgba(242,233,220,.74)** |
| Etiket karesi | `11x11px; radius 1px; #FAAA1F` | **11 \| 11 \| 1px \| rgb(250,170,31)** |
| H1 | `800 clamp(44,6.6vw,104)/1.06`, `-.025em`, gölge `0 8px 50px rgba(10,8,7,.7)`, max 1100 | **800 \| 95.04px \| 100.742px \| -2.376px \| aynı gölge \| 1100px** |
| Giriş | `400 clamp(17,1.5vw,21)/1.65`, krem `.8`, max 680, `margin-top:26px` | **400 \| 21px \| 34.65px \| .8 \| 680px \| 26px** |

### Portre (Hikaye:72-86)

| Değer | Tasarım | Ölçülen |
| --- | --- | --- |
| Bölüm | `flex; wrap; stretch; gap clamp(28,3vw,56); padding 0 … 70px` | **flex \| wrap \| stretch \| 43.2px \| 0px 64px 70px** |
| Plaka | `flex:1 1 380px; min-width:280; max-width:560; min-height clamp(380,52vh,560)` | **1 1 380px \| 280px \| 560px \| 499.2px** |
| Plaka kenarlığı | `1px solid rgba(242,233,220,.22)` + `inset 0 0 90px rgba(0,0,0,.5)` | **aynı** |
| Kart | `flex:1 1 460px; min-width:0; padding clamp(28,3vw,48); zemin `.72`; kenarlık `.1`; blur(3px); column; center; gap 22` | **1 1 460px \| 0px \| 43.2px \| rgba(10,8,7,.72) \| rgba(242,233,220,.1) \| blur(3px) \| column \| center \| 22px** |
| "İsim" | `700 clamp(28,3.2vw,44)/1.12`, `-.02em` | **700 \| 44px \| 49.28px \| -0.88px** |
| Gövde | `400 clamp(16,1.35vw,19)/1.7`, krem `.78`, max 560 | **400 \| 19px \| 32.3px \| .78 \| 560px** |
| Not | `400 14.5px/1.65`, krem `.58`, `border-left:2px solid rgba(250,170,31,.5)`, `padding-left:16px` | **`<p>` \| 14.5px \| 23.925px \| .58 \| 2px solid rgba(250,170,31,.5) \| 16px** |

### Usul (Hikaye:90-116)

| Değer | Tasarım | Ölçülen |
| --- | --- | --- |
| Bölüm dolgusu | `10px clamp(24,5vw,64) 70px` | **10px 64px 70px** |
| Kart | `max-width:1180; padding clamp(28,3vw,44); zemin `.74`; kenarlık `.1`; blur(3px)` | **1180px \| 43.2px \| rgba(10,8,7,.74) \| rgba(242,233,220,.1) \| blur(3px)** |
| Başlık satırı | `flex; wrap; baseline; space-between; gap:16; padding-bottom:22; border-bottom .14` | **hepsi birebir** |
| Başlık | `700 clamp(30,3.6vw,48)/1.12`, `-.02em` | **700 \| 48px \| 53.76px \| -0.96px** |
| Tane rayı | gap 10, büyük `13x13 r2 krem .8`, küçük `8x8 r0 #FAAA1F` | **6 tane \| 10px \| 13/13/2px/.8 \| 8/8/0px/tangerine** |
| Satır | `flex; wrap; flex-start; gap 18px 26px; padding 26px 12px; border-bottom .1` | **hepsi birebir** |
| 3. satır çizgisi | yok | **borderBottomWidth=0px** |
| Numara | `600 13px/1`, tabular, krem `.62`, `width:26px`, `padding-top:6px` | **600 \| 13px \| tabular-nums \| .62 \| 26px \| 6px** |
| Etiket | `700 clamp(22,2.2vw,30)/1.14`, `-.015em`, `width clamp(150,18vw,240)` | **700 \| 30px \| 34.2px \| -0.45px \| 240px** |
| Gövde 01 | `400 15.5px/1.65`, krem `.74`, tabular **yok** | **15.5px \| 25.575px \| .74 \| normal** |
| Gövde 03 | aynı + `tabular-nums` | **15.5px \| 25.575px \| .74 \| tabular-nums** |
| Ölçü kabı | `flex:1; min-width:240; flex wrap; gap:10` | **1 \| 240px \| flex \| wrap \| 10px** |
| Ölçü çipi | `padding 10px 14px; zemin krem .06; 500 14px/1; tabular; krem .78` | **hepsi birebir, 3 çip** |

### Sofra (Hikaye:120-129)

| Değer | Tasarım | Ölçülen |
| --- | --- | --- |
| Bölüm | `padding 20px … 80px; text-align:center` | **20px 64px 80px \| center** |
| Kolon | `max-width:860; margin 0 auto; column; center; gap 24` | **860px \| column \| center \| 24px** |
| Tane rayı | büyük `14x14 r2 #F2E9DC`, küçük `9x9 r1 #FAAA1F` | **14/14/2px/rgb(242,233,220) \| 9/9/1px/rgb(250,170,31)** |
| Başlık | `700 clamp(34,4.6vw,64)/1.1`, `-.025em`, gölge | **700 \| 64px \| 70.4px \| -1.6px \| aynı gölge** |
| Gövde | `400 clamp(16.5,1.4vw,20)/1.65`, krem `.78`, max 600 | **400 \| 20px \| 33px \| .78 \| 600px** |
| Buton satırı | `flex; wrap; center; gap 12; margin-top 4` | **hepsi birebir** |
| Birincil | `#B7351C; 18px 30px; 600 16px/1; gölge 0 12px 34px .4` | **`<a href="/menu/">` \| 18px 30px \| 16px \| aynı gölge \| h=56px** |
| İkincil | `17px 29px; 600 16px/1; zemin rgba(10,8,7,.4); kenarlık .38` | **`<a href="/konum/">` \| 17px 29px \| 16px \| rgba(10,8,7,.4) \| kenarlık `.36` \| h=56px** |

İkincil kenarlıktaki `.38` → `.36` farkı benim sapmam değil: `on-gecis-report.md`
§6'da ölçülüp karara bağlanmış, `Buton.module.css:42`'de yorumla kayıtlı. Yerel
override yazılmadı.

## Parite: üç kare de kullanıldı

924px genişlikte (referans karelerin yakalandığı genişlik) yakalanıp yan yana
karşılaştırıldı.

- **`01-hikaye.jpg`**: etiket satırı y=183, H1 iki satır (y 249 / 315, "değil, bir"
  / "insan" aynı yerden kırılıyor), paragraf iki satır (y 385 / 413, "isim" /
  "düşünmedi" aynı kelimeden kırılıyor), plaka üst kenarı y=490. **Dördü de
  birebir.**
- **`02-hikaye.jpg`** (Usul'ün doğrulanabildiği tek kare): not bloğu tangerine
  çizgisiyle aynı yerde; kart x=46'da başlıyor, başlık x=76'da; tane rayının altı
  boncuğu x 737/758/778/801/821/843 (referansla aynı); 01 satırı numara x=95,
  etiket x=142, gövde x=332 ve gövde **aynı kelimeden** ("kuyruk" / "yağı ondan")
  kırılıyor; 02 satırında üç çipin ikisi ilk satırda, üçüncüsü x=332'den ikinci
  satırda. **Birebir.**
- **`03-hikaye.jpg`**: başlık ortalı, paragraf "Mekanımız" / "alkolsüzdür"den
  kırılıyor, birincil buton x 284-435, ikincil x 448-641. **Birebir.**

Tek görünür fark: benim karelerimde gece şeridi (`Gece açığız, ocak yanıyor`)
var, referansta yok. Şerit `position:fixed` bar içinde olduğu için akıştaki
hiçbir y koordinatını kaydırmıyor ve yalnız 01:00-05:00 arasında görünüyor;
ölçüm o saatte alındı. Sayfaya ait değil, kabuğa ait.

## `EtiketSatiri`: karar, ölçüm ve ortaklaştırma

**Zamanlama.** İşe başlarken Task 10 hâlâ çalışıyordu (`components/sayfa/ana/`
altında commit'lenmemiş dosyalar vardı), o yüzden bileşen önce yalnız Hikaye'nin
varyantıyla yazıldı ve o dosyalara dokunulmadı. **İş bitmeden Task 10
commit'ledi** (`e7d0d78`) ve `Bozo.tsx` çalışma ağacında temiz kaldı, yani
brief'in karar ağacının ilk dalı geçerli oldu: **ortaklaştırmayı ben yaptım,
çağrı yerini ben taşıdım.**

Beş tasarım dosyasının tamamı `width:11px;height:11px` için tarandı: **tam iki
kullanım var**, ikisi de aynı cümleyi taşıyor.

| | Ana:272-274 | Hikaye:64-66 |
| --- | --- | --- |
| Satır | `flex; align-items:center; gap:12px` | aynı **+ `margin-bottom:26px`** |
| Kare | `11x11px; radius 1px; #FAAA1F` | **aynı** |
| Metin | `500 14.5px/1`, krem **`.72`** | `500 15px/1`, krem **`.74`** |
| Metin içeriği | "Engin Çağlar, her gün ocağın başında" | **aynı** |
| Bağlam | cam kartın içinde, `clamp(32,4vw,54)` H2'nin üstünde | sayfanın en üstünde, `clamp(44,6.6vw,104)` H1'in üstünde |

Yani **birebir aynı değiller**: punto 0.5px, alfa 0.02 ayrışıyor. Dağılım 1-1,
çoğunluk yok.

**Karar: ikisi de korundu ve adlandırıldı.** Brief'in karar ağacı "farkın
gerekçesini söyleyebiliyorsanız ikisini de koruyup adlandırın" diyor;
gerekçe söylenebiliyor: aynı öge iki farklı ölçekte duruyor, biri sayfa
hero'sunun kickerı, öteki kart içi kicker, ve büyüklük farkı yanındaki başlığın
ölçeğiyle aynı yönde. `Buton`'un boy adımlarıyla aynı mantık. Çoğunluğa
normalize etmek burada mümkün değildi (1-1) ve sayfa hero'sunu kart ölçüsüne
indirmek tasarımın kendi hiyerarşisini bozardı.

Uygulama: `components/ui/EtiketSatiri.tsx`, `olcek?: 'sayfa' | 'kart'`,
varsayılan `'sayfa'`. Kare ve satır kabı iki varyantta ortak; ayrışan yalnız
punto ve krem alfası. Dış boşluk bileşene alınmadı (`className` ile çağıran
verir, `CamPanel` ile aynı ayrım): Hikaye kullanımı `margin-bottom:26px` taşır,
Ana kullanımının kabı `gap:24px` verir.

**Yapılan ortaklaştırma.** `components/sayfa/ana/Bozo.tsx` yerel bir kopya
basıyordu (`stil.kicker` + `stil.kare` + `stil.kickerMetin`). Bu dört satırlık
JSX `<EtiketSatiri olcek="kart">` çağrısına indirildi ve `Bozo.module.css`'ten
`.kicker`, `.kare`, `.kickerMetin` kuralları (18 satır) silindi. Task 10'un
dosyalarında **yalnız bu çağrı** değişti; bölümün başka hiçbir satırına
dokunulmadı.

Ana sayfa tarayıcıda yeniden ölçüldü, **hiçbir hesaplanmış değer değişmedi**:

| Değer | Ana:272-274 | Ortaklaştırmadan sonra ölçülen |
| --- | --- | --- |
| Satır | `flex; center; gap 12px` | **flex \| center \| 12px \| margin 0px** |
| Metin | `500 14.5px/1`, krem `.72` | **500 \| 14.5px \| 14.5px \| rgba(242,233,220,.72)** |
| Kare | `11x11px; radius 1px; #FAAA1F` | **11px \| 11px \| 1px \| rgb(250,170,31)** |
| Panel kolonu | `gap:24px` | **24px** (kicker ile H2 arası 38.5px, değişmedi) |

Tek yapısal değişiklik: kutu artık `<div>` değil `<p>`. Kabuğun "tasarım
`<div>` yazar, port gerçek ögeyi kullanır" kuralıyla uyumlu; `margin:0`
olduğu için yerleşim kaymıyor. Konsol temiz, üç kapı da yeniden yeşil.

`TaneDizilimi` ile yapılamazdı: o en az üç tane basar, burada tek kare var.

## `NotBlogu`: semantik

`components/ui/NotBlogu.tsx`, `<blockquote>` değil **`<p>`**. Metin
("Urfa'dan Girne'ye uzanan hikayenin tamamı, burada kendi ağzından
anlatılacak.") kimsenin sözünü aktarmıyor; ileride yazılacak hikayeyi haber
veren bir yer tutucu. `<blockquote>` yardımcı teknolojiye "burada birinin sözü
var" der ve yanlış olurdu. Adlandırma da bunu taşıyor: "not", "alıntı" değil.
Tarayıcıda doğrulandı: `<P>`, çizgi `2px solid rgba(250,170,31,.5)`
(`--tangerine-50`), metin `rgba(242,233,220,.58)` (`--krem-58`).

## 16px altı gövde puntoları

Sayfada `<main>` içinde 16px'in altına inen altı ölçü var.
`KISITLAR.md`'nin üç katmanlı kuralına göre hangi katmana düştükleri:

| Ölçü | Yer | Kaynak | Katman |
| --- | --- | --- | --- |
| **15.5px**/1.65 | Usul satırlarının gövdesi (01 Tane, 03 Saat) | Hikaye:101, 115 | **3. katman.** Gerçek prose, 16px'in altında, sabit. Kural bu satırı adıyla anıyor ("the usul rows on Hikaye at 15.5px/1.65"). **Sapma olarak burada bir kez kaydedildi**, yuvarlanmadı |
| **14.5px**/1.65 | `NotBlogu`, portre kartının notu | Hikaye:86 | **3. katman.** Kural bu satırı da adıyla anıyor ("the Hikaye note block at 14.5px/1.65"). **Sapma olarak burada bir kez kaydedildi** |
| 15px/1 | `EtiketSatiri` metni | Hikaye:66 | 2. katman (arayüz mikro metni: meta satırı). Tasarımın ölçüsü kazanır |
| 14px/1 | `Cip tur="olcu"`, üç ölçü çipi | Hikaye:107-109 | 2. katman (çip) |
| 13px/1 | Usul satır numarası (01/02/03) | Hikaye:99, 104, 113 | 2. katman (meta/indeks); ayrıca `aria-hidden` |
| 12.5px/1.4 | `FotoYuvasi` plaka etiketi | Hikaye:80 | 2. katman (plaka etiketi). Bu sayfaya ait değil, bileşenin kendi kararı, daha önce kaydedilmiş |

1. katmana düşen (okunan metin) her şey tabanın üstünde: H1 44-104px, açılış
girişi `--ol-govde-buyuk` 17-21px, portre gövdesi `--ol-govde` 16-19px, Sofra
gövdesi `--ol-sofra-govde` 16.5-20px. **Hiçbiri sessizce büyütülmedi, hiçbiri
sessizce küçültülmedi.**

## `@media` sayısı: sıfır

Sayfanın dört CSS modülünde ve iki yeni primitifin modüllerinde **hiç `@media`
kuralı yok** (yalnız iki yorum satırında kelime olarak geçiyor). Responsive
davranışın tamamı tasarımın kendi mekanizmalarından geliyor ve 390px'te
ölçüldü:

- Portre iki kolonu: `flex-wrap` + plakanın `1 1 380px` / kartın `1 1 460px`
  tabanı. 390'da alt alta geçiyor, plaka `min-height` 438.88px (`52vh`).
- Usul satırları: gövdenin `min-width:240px` eşiği. 390'da numara + etiket üstte,
  gövde altta.
- Usul başlık satırı: `BolumBasligi`'nin `flex-wrap`'i, tane rayı başlığın altına
  iniyor.
- Ölçü çipleri: `flex-wrap`, üçü alt alta.
- Sofra butonları: `flex-wrap`, alt alta, aralarında 12px.

390px'te bozulan bir şey bulunmadı, yatay taşma 0px, ad hoc breakpoint
uydurulmadı.

## Erişilebilirlik

- Başlık hiyerarşisi tek H1 ile: `H1 Bozo bir marka ismi değil, bir insan` →
  `H2 İsim` / `H2 Usul Urfa'dan` (→ `H3 Tane` / `H3 Ölçü` / `H3 Saat`) /
  `H2 Sofra kurulu gelir`. Atlama yok.
- Usul satırları `<ol>` + `<li>`: sıra bilgisi gerçekten anlamlı (usulün üç
  adımı). Görünen "01/02/03" `aria-hidden`, çünkü sırayı liste zaten taşıyor ve
  rakam tasarımda statik, `data-en` taşımıyor, çeviriye girmiyor.
- Dekoratif katmanlar `aria-hidden`: etiket karesi, tane rayları (bileşenin
  kendisi basıyor), satır numaraları, plaka köşeleri.
- Bölümler adsız düz `<section>`: adsız `<section>` landmark listesine girmez,
  yani kabuğun landmark adlandırmasını kalabalıklaştırmıyor.
- Dokunma hedefleri: sayfanın tek etkileşimli ögesi Sofra'nın iki butonu,
  ikisi de **56px** (`Buton .taban` `min-height:44px` + `lg` dolgusu). 390'da
  alt alta, aralarında 12px boşluk, çakışma yok.
- `prefers-reduced-motion: reduce` altında ölçüldü: sayfada **hiç canlı
  animasyon veya geçiş kalmıyor** (0 öge), `scroll-behavior: auto`, H1
  `opacity: 1`. Sayfanın kendi hareketi zaten yok; `Bolum` kullanılmadığı için
  erime hesabı da hiç kurulmuyor.
- EN katmanı doğrulandı: `lang="en"`, bütün metinler `content/en/hikaye.ts`'ten,
  plaka etiketi "portrait, at the fire", CTA hedefleri `/en/menu/` ve
  `/en/konum/`.

## Tasarımda karar değil, gözden kaçma gibi duran şeyler

1. **Usul kartı sola yaslı, altındaki Sofra kolonu ortalı.** `Hikaye:91` karta
   `max-width:1180px` veriyor ama `margin:0 auto` vermiyor; `Hikaye:121` ise Sofra
   kolonuna `max-width:860px;margin:0 auto` veriyor. Sonuç ölçüldü: 1440px'te
   kartın sağında **132px**, 1920px'te **612px** boş alan kalıyor ve hemen
   altındaki bölüm ortalı. Aynı sayfada iki farklı hizalama kuralı. Referans
   kareler 924px'te yakalandığı için (kartın genişliği zaten sınıra dayanıyor)
   bu ekranlardan doğrulanamıyor. **Sessizce ortalamadım, birebir kopyaladım.**
   Ana Sayfa'nın 1180px'lik paneli de (Ana:170) aynı şekilde sola yaslı, yani
   kural tutarlı olabilir; ama Sofra ile yan yana durunca kararmış gibi
   durmuyor. Sahibine soru.
2. **Tasarımın "Usül" yazımı.** Zaten karara bağlı (içerik katmanı "Usul"
   tutuyor, `content/tr/hikaye.ts:18-19`), yeni bir şey değil; burada yalnız
   uygulandığını kaydediyorum.
3. **`EtiketSatiri`'nin iki kullanımı arasındaki 0.5px / 0.02 farkı** yukarıda.
   Gerekçelendirilebilir buldum ama sahibin "tek ölçü olsun" demesi de
   savunulabilir; o durumda değişecek tek yer `EtiketSatiri.module.css`'in iki
   varyantı.

## Dokunulan dosyalar

Yeni:
- `components/ui/EtiketSatiri.tsx`, `EtiketSatiri.module.css`
- `components/ui/NotBlogu.tsx`, `NotBlogu.module.css`
- `components/sayfa/hikaye/Acilis.tsx` + `.module.css`
- `components/sayfa/hikaye/Portre.tsx` + `.module.css`
- `components/sayfa/hikaye/Usul.tsx` + `.module.css`
- `components/sayfa/hikaye/Sofra.tsx` + `.module.css`

Değişen:
- `components/sayfa/HikayeSayfasi.tsx` (yer tutucu gövde → dört bölüm)
- `components/sayfa/ana/Bozo.tsx`, `Bozo.module.css` (**yalnız** `EtiketSatiri`
  ortaklaştırması: yerel kicker kopyası kaldırıldı)

`git add` listesi bu on beş yolu tek tek kapsıyor; `git add -A` kullanılmadı.
Ağaçtaki diğer ajanların o an üzerinde çalıştığı dosyalar
(`GizlilikSayfasi.*`, `MenuSayfasi.tsx`, `components/sayfa/menu/`,
`HataSayfasi.*`, `app/global-not-found.tsx`) stage edilmedi.

`Bolum` bu sayfada kullanılmadı: `data-erit` ve `data-yogunluk` bu tasarım
dosyasında sıfır kez geçiyor. Dört bölüm düz `<section>`.

## Öz denetim ve endişeler

1. **`EtiketSatiri`'nin iki varyantının da çağrı yeri var** (ortaklaştırma
   yapıldığı için). Sahibi "tek ölçü olsun" derse değişecek tek yer
   `EtiketSatiri.module.css`'in iki sınıfı; iki çağrı yeri de dokunulmadan
   kalır.
2. **`-0.015em` izi hâlâ iki yerde ham** (`Usul.module.css` ve
   `MenuSatiri.module.css:31-33`). Token turu ikisini birlikte almalı; tek
   başına birini tokenlaştırmak ikinci ham değeri gizler.
3. **Usul kartının `flex-wrap` davranışı 780-1000px arası test edilmedi.**
   1440 ve 390 ölçüldü. O aralıkta tane rayı başlığın altına inerken kartın
   sağında asimetrik boşluk kalabilir; tasarımın kendi mekanizması olduğu için
   dokunulmadı ama kabuk turunun 2. endişesiyle (dar masaüstünde nav sarması)
   aynı aralık, birlikte bakılabilir.
4. **Portre plakası bugün fotoğrafsız** (`content/fotograflar.ts` `bozo-portre`
   için `dosya` yok), yer tutucu çerçeve + dört köşe + etiket sekmesi basıyor.
   Fotoğraf geldiğinde `FotoYuvasi` `<Image fill>` dalına geçer ve köşeler ile
   etiket düşer; bu bileşenin kendi kararı, sayfa etkilenmiyor.
5. Ölçüm 01:00-05:00 penceresinde alındığı için bütün karelerde gece şeridi
   görünüyor. Akıştaki koordinatları etkilemiyor (şerit `position:fixed` barın
   içinde), ama referans karelerle karşılaştırırken gözle fark edilir.
