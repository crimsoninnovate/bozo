# Mobil turu raporu

Kaynak: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/Mobil Prototip.dc.html`
(bundan sonra `Mobil:<satır>`). Kapatılan bulgular: `bagimsiz-sadakat-denetimi.md`
F3, F4, F9.

Brief'in tabloları türetilmişti; her değer ham dosyadan yeniden okundu. **İki
yerde brief yanlış çıktı**, aşağıda "Brief'in yanıldığı yerler" başlığında.

## Kırılma noktası

`max-width: 780px`. Uydurulmadı: kabuk bileşenlerinin zaten kullandığı tek eşik
(`UstBar.module.css`, `MobilAksiyonBari.module.css`, `GeceSeridi.module.css`,
`AltBilgi.module.css` ve içerik tarafında `ana/Acilis.module.css`). Prototipin
genişliği 390px, yani eşiğin altında kalıyor; ikinci bir eşik açmak beş dosyalık
mevcut mobil sözleşmeyi ikiye bölerdi.

## Kapılar

| Kapı | Sonuç |
|---|---|
| `npm run typecheck` | temiz |
| `npm test` | 60 test, 60 geçti |
| `npm run build` | temiz, 14 rota |
| Konsol (5 sayfa, 390 ve 1440) | sıfır hata, sıfır uyarı |
| Yatay taşma (5 sayfa, 390 ve 1440) | yok |
| Kontrast (etkilenen 11 metin, 390 ve 1440) | hepsi AA |

Ölçüm ortamı: kendi chromium örneği, kendi portu (dev 3477, üretim çıktısı 4477).
MCP'nin paylaşılan tarayıcısı kullanılmadı.

### Rota tablosu (geçici rota kanıtı)

Geçici rota hiç açılmadı; değişiklikler mevcut bileşenler üzerinde ölçüldü.

```
┌ ○ /            ├ ○ /en/hikaye   ├ ○ /gizlilik   ├ ○ /robots.txt
├ ○ /_not-found  ├ ○ /en/konum    ├ ○ /hikaye     └ ○ /sitemap.xml
├ ○ /en          ├ ○ /en/menu     ├ ○ /konum
├ ○ /en/gizlilik ├ ○ /gizlilik    ├ ○ /menu
```

`gecici-` ile başlayan rota yok.

## Masaüstü bozulmadı (kanıt)

1440x900'de beş sayfada 36 öğe (tipografi, dolgu, zemin, gölge, ızgara, kutu)
değişiklikten önce ve sonra ölçüldü:

```
1440 stil farki: YOK
1440 YENI-ANAHTAR / imlec-isik
```

Tek yeni düğüm `ImlecKoru`, ki zaten bu turun görevi (F4). Ayrıca on iki tane
rayının hepsi (beş sayfa, iki genişlik) prop değerlerine birebir eşit çıktı:
`TaneDizilimi` iç yapısı değişti ama çıktısı bit bit aynı.

## 1. Kor sahnesinin mobil ölçüsü (F3, kapandı)

`components/ember/KorSahnesi.module.css`, `@media (max-width: 780px)`, yalnız
`.ana` varyantı.

| Katman | Tasarım (Mobil:31-37) | Ölçülen (390x844) | Önceki |
|---|---|---|---|
| kap | 844px (telefon çerçevesi) | 390x844 (`100vh`) | aynı |
| kor bottom / height | -12% / 92% | -101.3px (=-12%) / 776.5px (=92%) | -14% / 96% |
| kor gradyan | `78% 92% at 50% 100%` | uygulandı | `72% 96%` |
| çekirdek | 420x340, bottom -8%, alfa .4 | 420x340, -67.5px (=-8%) | 429x520, -10%, .42 |
| duman 1 | 18%, 170px, `.36`, blur 26, 20s | 170x170 | 28%, 260px, `.4`, blur 34, 22s |
| duman 2 | 54%, 150px, `.42`, blur 24, 26s+8s | 150x150, bottom 0 | 52%, 220px, `.44`, blur 30, 27s+8s |
| duman 3 | yok | `display:none` (0x0) | 200px |
| vinyet | inset 170px | `inset 0 0 170px rgba(0,0,0,.86)` | 260px |
| ızgara | masaüstüyle aynı | değişmedi | - |

Belirleyici olan çekirdek yüksekliği (520 -> 340) uygulandı: 844px'lik bir ekranda
sahne artık ekranın %40'ını kaplıyor, %62'sini değil.

### Uygulanmayan: mobil keyframe seti

Prototip üçüncü bir keyframe seti taşıyor (`emberBreath` `.6`->`1` `scale(1.06)`,
`emberSoft` `.4`->`.85`, `smokeDrift` `30px` / `30%` `.15` / `24px,-140px`
`scale(1.6)`).

- `emberSoft` mobil değeri ana sayfanın `emberSoftAna`'sıyla **birebir aynı**,
  fark yok.
- `emberBreath` mobilde `.6`, ana sayfada `.62`; tek fark dip opaklık, 0.02.
- `smokeDrift` gerçekten ayrışıyor. `styles/animasyonlar.css`'e üçüncü bir global
  set eklemek yerine mobil blokta ana sayfanın pufları **iç sayfa keyframe'ine**
  (`smokeDrift`, `30px` / `30%` `.14` / `30px,-170px` `scale(1.6)`) çevrildi;
  mobil hedefe masaüstü setinden (`40px` / `28%` `.16` / `40px,-200px` `1.7`)
  belirgin biçimde daha yakın. Kalan fark: opaklık `.14` yerine `.15`, yatay
  `30px` yerine `24px`, dikey `-170px` yerine `-140px`. Kayıtlı sapma.

### İç sayfaların mobil sahnesi: uygulanmadı, kasıtlı

Mobil prototip **ana sayfanın** mobil hali. `.ic` varyantı (Hikaye/Konum/Menü,
`Menu/Hikaye/Konum Sayfasi.dc.html:27-33`) için tasarımda mobil karşılık yok.
390px'te iç sayfa sahnesi görsel olarak sağlam ölçüldü (ekran görüntüsüyle
bakıldı), yani acil bir kusur değil. Çıkarımla üçüncü bir ölçü seti yazmaktansa
açık madde bırakıldı; sahibine soru olarak aşağıda duruyor.

## 2. `ImlecKoru` bağlandı (F4, kapandı)

`Ana Sayfa Alternatif.dc.html:31` doğrulandı: `data-imlec` katmanı
`data-sahne-kap`'ın **içinde**, çekirdek ile ilk duman pufunun **arasında**.
Port da tam olarak orada basıyor (`KorSahnesi.tsx`).

- Bileşenin kendi `position:fixed` kabı **kaldırıldı**: sahne kabı zaten
  `position:fixed; height:100vh; overflow:hidden`, ikinci bir kap ölü katmandı.
  Işık artık sahne kabına göre konumlanıyor, tasarımdaki gibi kırpılıyor.
- Ölçülen (1440): 620x620, `margin -310px/-310px`, `top:62%`, gradyan
  `rgba(250,170,31,.16) -> transparent 74%`, geçiş `.7s cubic-bezier(.2,.7,.2,1)`.
  Tasarımla birebir.
- Mobilde `display:none` (Mobil:31-37'de böyle bir katman yok, dokunmada imleç de
  yok). 390px ölçümü: 0x0.
- Hareket azaltılmışta: dinleyici bağlanmıyor, `transform` fare hareketinden sonra
  da `none`, geçiş süresi `0s`. Davranış korundu.

`out/` artık ölü CSS taşımıyor.

## 3. İçerik tipografisinin mobil ölçüleri (F9, kısmen kapandı)

Uygulananlar, 390x844'te ölçülen değerlerle:

| Öğe | Tasarım | Ölçülen | Önceki (390) |
|---|---|---|---|
| Hero H1 (Mobil:77) | `800 52px/.92`, `-.05em`, gölge `0 8px 40px rgba(10,8,7,.7)` | 52px / 47.84px / -2.6px | 60px / 63.6px / -1.08px |
| Hero alt satır (Mobil:79) | `800 26px/1`, `-.04em` | 26px / 26px / -1.04px | 34px / 34px / -0.85px |
| Hero tane rayı (Mobil:80-88) | 13 / 8 / gap 7; çizgi 2px, `-1px`, durak 50%; dolgu `10px 0` | 13 / 8 / gap 7; dolgu `10px 0` | 20 / 12 / gap 12; `16px 0` |
| Sayaç hücresi (Mobil:101-103) | dolgu `16px 14px`, gap 6, zemin `.86` | `16px 14px`, gap 6, `rgba(10,8,7,.86)` | `22px 24px`, gap 9, `.9` |
| Sayaç sayısı | `700 30px/1`, `-.04em` | 30px / 30px / -1.2px | 44px / 44px / -0.88px |
| Sayaç etiketi | `400 11.5px/1.35`, `.72` | 11.5px / 15.5px / `.72` | 14px / 20.3px / `.74` |
| Gece H2 (Mobil:157) | `800 40px/1.02`, `-.045em` | 40px / 40.8px / -1.8px | 44px / 47.5px / -1.32px |
| Sofra H2 (Mobil:148) | `700 34px/1.06`, `-.04em` | 34px / 36.0px / -1.36px | 38px / 41.8px / -0.95px |
| Sofra tane rayı (Mobil:146) | 13 / 8 / gap 8 | 13 / 8 / gap 8 | 16 / 10 / gap 10 |
| Konum H2 (Mobil:168) | `700 30px/1.1`, `-.035em` | 30px / 33px / -1.05px | 30px / 34.2px / -0.6px |
| Mini harita (Mobil:169-174) | 180px; ızgara 40px; yol `top:56%` 11px; halka 60px `-30px`; pin 14px, `0 0 0 5px`, `0 0 24px` | 342x180; 11px; 60x60; 14x14; gölgeler birebir | 420px; ızgara 50px; yol 14px; halka 80px; pin 16px, `6px`, `30px` |
| Menü satırı (Mobil:113-116) | dolgu `15px 0`, gap 12; sıra `600 11.5px/1` `.5` w20; ad `700 19px/1.2` `-.025em`; açıklama `400 13px/1.5` `.68`; fiyat `600 15px/1` | hepsi birebir; satır yüksekliği 168px -> 77px | `22px 12px`; sıra 13px w26 `.62`; ad 22px; açıklama 15px; fiyat 17px |

Yapısal düzeltmeler (hepsi tasarım kaynaklı, çıkarım değil):

- **Sayaç şeridi mobilde üç hücre tek satırda.** Port `flex: 1 1 150px` ile
  390px'te üç hücreyi alt alta yığıyordu (şerit 354px yüksekliğindeydi); tasarım
  üçünü yan yana çiziyor (Mobil:100). Mobil blokta `flex-basis: 0`. Yeni yükseklik
  130px. Etiketler portta tasarımdakinden uzun ("şiş, bir porsiyonda" ile "şiş"),
  o yüzden iki satıra sarıyor; ölçü değil içerik farkı, dokunulmadı.
- **Menü satırı mobilde ad ile fiyat aynı hizada, açıklama altında** (Mobil:113).
  Portun düz kardeş dizilimi korunarak açıklamaya tam satır ve son sıra verildi
  (`flex-basis:100%`, `order:1`, `margin-left:32px` = 20px sıra sütunu + 12px gap).
- **Menü satırının üçlü tane rayı mobilde basılmıyor** (Mobil:113-116'da yok).
  Ray kendi kabına alındı; ikinci bir `TaneDizilimi` kopyası yazılmadı.
- **Menü satırının hover'ı mobilde kapalı.** Tasarımın mobil satırında hover
  chrome'u yok ve dokunmada `padding-left: 24px` sıçraması kalıcı hale geliyor.
- **Mini haritanın üç etiketi ve dikey yolu mobilde basılmıyor** (Mobil:169-174
  dört katman çiziyor: ızgara, yatay yol, halka, pin). Etiketlerin taşıdığı bilgi
  kaybolmuyor: "Naci Talat Caddesi" hemen üstteki bölüm başlığı, "Ciğerci Bozo"
  üst barda ve alt bilgide, alt not ise dekoratif ("harita · koyu tema, tek işaret").
  180px'lik levhada üçü de halkanın ve pinin üstüne binerdi.

### `TaneDizilimi`, mobil ölçü taşıyabilsin diye

Ölçüler artık satır içi `width/height` yerine CSS değişkeni olarak geçiyor
(`--tane-buyuk`, `--tane-kucuk`, `--tane-bosluk` ve yarıçapları); isteğe bağlı
`mobil` prop'u aynı adları `-m` ekiyle basıyor, medya sorgusu da
`var(--tane-buyuk-m, var(--tane-buyuk))` ile yedekli okuyor. `mobil` vermeyen
dokuz çağıran için davranış birebir aynı (ölçümle doğrulandı, yukarıda).

Alternatifler elendi: satır içi stil medya sorgusuyla ezilemezdi (`!important`
gerekirdi), sayfa içinde ikinci bir ray kopyası yazmak çerçevenin açık yasağı.

### Uygulanmayanlar ve gerekçeleri

**Mobil gövde metinleri 14.5px'e indirilmedi.** Prototip iddia paragrafını
(Mobil:105), sofra paragrafını (Mobil:149) ve gece paragrafını (Mobil:158)
`14.5px` yazıyor. `KISITLAR.md`'nin 16px tabanı **1. katmanda serttir** ve bu üç
metnin üçü de o katman (`--ol-govde`, `--ol-govde-buyuk`). Sert kural tasarımın
piksel değerini yener; port 390px'te 16-17px basmaya devam ediyor. Bu bir kayıt,
tartışma değil.

**Menü satırının açıklaması 13px'e indi** (Mobil:115). Bu 1. katman değil: bir
liste kaleminin yanındaki not, `KISITLAR.md`'nin 2. katmanı (tablo notu, çip,
plaka etiketi). Erişilebilirliği kontrast ve dokunma hedefi taşıyor; ölçüldü,
7.81:1, AA. Yine de 3. katmanın kayıtlı bandının (14.5-15.5px) altında, o yüzden
kayıtlı sapma olarak burada duruyor.

**`BolumBasligi` mobil ölçü almadı.** Prototipin Ocaktan başlığı `700 30px/1.1`
`-.035em`, notu `400 13px/1` `.62`; port 390px'te 32px/1.12 `-.02em` ve
15px/1.5 `.66` basıyor. Bileşen paylaşımlı: aynı anda Menü sayfasının Ocaktan'ı,
Hikaye'nin Usul'ü ve İçecekler için de basılıyor, o sayfaların mobil çizimi ise
tasarımda **yok**. Tek bir mobil kural üç sayfayı sessizce değiştirirdi. Sahibine
soru olarak bırakıldı.

**Hero meta satırının ağırlığı.** Masaüstü `500` (Ana:115), mobil `400`
(Mobil:96); geri kalan her şey (14.5px/1.6, `.74`, tabular) aynı. Tek fark
ağırlık, ve mobilde satır yapısı da farklı (`<br>` ile iki satır). Uygulanmadı.

**İkram çiplerinin yeri ve fotoğraf plakaları.** Mobil prototipte ikram çipleri
sofra bölümünden **Ocaktan panelinin içine** taşınmış (Mobil:138-141) ve sayfadaki
bütün `FotoYuvasi` plakaları düşürülmüş. İkisi de ölçü değil kurgu kararı; bu
turun kapsamı ölçüydü. Sahibine soru.

## 4. Vardiya çipleri: karar ve gerekçe

**Karar: dört çip bilinçli bir mobil kısaltma, prototipin eksik çizimi değil.
Ama bu turda uygulanmadı, çünkü dosya bu turun değil ve doğru uygulama saf CSS
değil.**

Kanıt, kaynaktan iki bağımsız yerden:

| | Ana Sayfa Alternatif | Mobil Prototip |
|---|---|---|
| çizilen çipler | 6 (`Ana:255-260`: 21/23/01/02/03/04) | 4 (`Mobil:160-163`: 21/23/01/03) |
| betikteki dizi | `Ana:448` `[21, 23, 1, 2, 3, 4]` | `Mobil:447` `[21, 23, 1, 3]` |

Prototipin betiği masaüstü betiğinin kopyası, ama dizisi elle dörde indirilmiş.
Eksik bir çizim betiği güncellemez. Ayrıca dört saatlik liste kendi içinde
tutarlı çalışıyor: vurgulama kuralı "fark <= 1" olduğu için saat 02:00'de 01:00,
04:00'te 03:00 çipi yanıyor.

Neden uygulanmadı:

1. `VardiyaSeridi` (`components/saat/`) bu turda **dokunulmayacak dosyalar**
   listesinde; paralel toparlama turu orada çalışıyor.
2. Saf CSS ile 4. ve 6. çipi gizlemek **yanlış** olurdu: port `enYakinVardiya`
   fonksiyonu altı saat üzerinden çalışıyor, saat 02:00'de "02:00" çipini aktif
   sayar, o çip de gizli olduğu için 02:00-03:00 ve 04:00-05:00 aralıklarında
   mobilde **hiçbir çip yanmaz**. Doğru uygulama, listenin kendisinin mobilde
   dörde inmesi, yani `VardiyaSeridi.tsx` içinde görünüm genişliğine bağlı bir
   dizi (statik dışa aktarımda bu bir `matchMedia` dinleyicisi demek).
3. Çip listesi içerik: sahibi daha önce doğrulanmamış içeriği (haritadaki "80 m")
   kaldırdı. Saat listesinin mobilde kısalması da onun kararı olmalı.

Çip **ölçüleri** de aynı dosyada ve yine uygulanmadı: tasarım mobilde `8px 12px`,
`500 12.5px/1`, `.66`, **zeminsiz**; port `9px 15px`, `13.5px`,
`rgba(10,8,7,.5)` basıyor (390px'te ölçüldü: 70.6x33.5).

## 5. `Mobil:392` "menü listesi kart değil satır": uygulanmadı, ölçümle

Önce ölçüldü. Menü sayfası 390px'te kart ızgarasını
`repeat(auto-fit, minmax(280px, 1fr))` ile **tek kolona** düşürüyor; kart tam
genişlikte (342px), yani prototipin gerekçesi olan "kart ızgarası ürünleri
küçültüyordu" durumu portta oluşmuyor.

Kartı satıra çevirmek, kartın taşıdığı `FotoYuvasi` plakasını, indeks rozetini ve
kor nefesini düşürmek demek; mobil prototip menü sayfasını **hiç çizmiyor**, yani
o satırın nasıl görüneceği tasarımda yok. Ana sayfanın Ocaktan listesi zaten satır
tabanlı ve bu turda mobil ölçülerini aldı; prototipin gösterdiği tek satır düzeni
odur. Sahibine soru.

## Brief'in yanıldığı yerler

1. **Sofra H2'nin "portun bastığı" değeri.** Brief `34px`, `/1.1`, `-.025em`
   diyor ve `--ol-sofra-baslik`'i (Hikaye:125) gösteriyor. Mobil:148'deki başlık
   **ana sayfanın ikram bölümüdür** (Ana:224, `clamp(38px,5.4vw,78px)`), Hikaye'nin
   sofrası değil; port 390px'te **38px** basıyordu, 34px değil. Mobil prototip
   yalnız ana sayfayı çiziyor, Hikaye'nin sofra bölümünün mobil karşılığı yok.
2. **Durum çipi satırı.** Brief bu satırı içerik tipografisi tablosuna koymuş;
   `DurumCipi` `components/saat/` altında, yani bu turun dokunmayacağı dosyalarda.
   Ölçüldü, uygulanmadı: tasarım `9px 14px` / kenarlık `rgba(250,170,31,.32)` /
   `13px`, port `10px 16px` / `--tangerine-30` / `14.5px` (`dev` boyu).

## Tasarımda tutarsız görünenler

- **`CanliSaat` mobilde zaten uyumlu, gece saati hariç.** Port 390px'te hero
  saatini 30px basıyor, tasarımın mobil değeriyle birebir (Mobil:91). Gece
  bölümününki portta 28px, tasarımda 26px (Mobil:154). 2px'lik fark
  `components/saat/` altında, uygulanmadı.
- **Mobil prototipin kendi iki kolonu birebir aynı.** Telefon çerçevesi
  (satır 27-218) ve "tam sayfa" kolonu (satır 221-384) aynı işaretlemeyi taşıyor;
  ikisi arasında ölçü farkı yok, yalnız sahne kolonda üç bantlı statik gradyana
  dönüşüyor (Mobil:224-226). Kaydırmayla senkron sahne sitede zaten `position:fixed`
  ile çözülmüş durumda, o statik gradyan yalnız çerçevesiz sunum içindir.
- **Konum sayfası, 390px, mevcut kusur (bu turun kapsamı dışında).** Açılışın
  durum satırındaki "Girne saati, canlı" etiketi 365px'te bitiyor, kapsayıcı
  366px'te: **1px pay**. Taşmıyor ama font metriği ya da metin uzunluğu bir tık
  değişirse taşar. Ölçümle doğrulandı, bu turda hiçbir şey değişmedi (390px'te
  `/konum/` ölçümlerinde sıfır fark).

## Kontrast (doğru yöntemle)

`fullPage` **kullanılmadı**. Yöntem: hedef viewport ortasına kaydırıldı, metin
rengi geçici `transparent` yapıldı, yalnız o kutunun viewport kırpımı alındı,
ortalama zemin bulundu, metnin kompozit rengiyle oranlandı.

Bu turda opaklığı **düşürülen** iki değer var (tasarımın kendi mobil değerleri),
o yüzden ikisi de ayrıca ölçüldü:

| Metin | Renk | 390px | 1440px |
|---|---|---|---|
| menü satırı sırası | `--krem-50` (mobil) / `--krem-62` (masaüstü) | 4.60 AA | 6.61 AA |
| menü satırı açıklaması | `--krem-68` (mobil) / `--krem-70` | 7.81 AA | 8.21 AA |
| sayaç etiketi | `--krem-72` (mobil) / `--krem-74` | 8.61 AA | 9.10 AA |
| hero H1 / alt satır | krem / `--krem-72` | 16.58 / 8.68 AA | 16.27 / 8.67 AA |
| sayaç sayısı, satır fiyatı | tangerine | 10.12 / 10.32 AA | 10.19 / 10.31 AA |
| ikram, gece, konum H2 | krem | 16.63 / 16.53 / 16.70 AA | 16.10 / 15.99 / 16.54 AA |

Hiçbir metnin opaklığı yükseltilmedi. Satır sırasının 4.60'ı tabana yakın; değer
tasarımın kendi değeri (Mobil:114 `.5`) ve AA'yı geçiyor, dokunulmadı.

## `IYILESTIRMELER.md`'ye geçmesi gereken kayıtlar

Dosyaya bu tur yazmadı (toparlama turunun kapsamında). İşlenecek kayıtlar:

1. **Mobil kırılma noktası 780px.** İçerik bileşenleri de kabuk bileşenlerinin
   eşiğini kullanıyor; prototip 390px genişliğinde ve eşiğin altında kalıyor.
2. **Mobil keyframe seti portlanmadı.** `emberSoft` zaten aynı, `emberBreath`
   farkı 0.02 opaklık; `smokeDrift` için mobilde ana sayfa pufları iç sayfa
   keyframe'ine çevrildi (mobil hedefe daha yakın). Global stylesheet'e üçüncü
   set eklenmedi.
3. **İç sayfaların mobil kor sahnesi yok.** Tasarımda karşılığı yok, çıkarım
   yazılmadı; 390px'te mevcut `.ic` sahnesi görsel olarak sağlam.
4. **Mobil gövde metni 14.5px'e indirilmedi**, `KISITLAR.md` 16px tabanı
   1. katmanda sert olduğu için.
5. **Menü satırı açıklaması mobilde 13px** (Mobil:115): 2. katman, kontrastla
   taşınıyor (7.81:1), ama 3. katmanın 14.5-15.5px bandının altında. Kayıtlı sapma.
6. **Mini haritanın üç etiketi ve dikey yolu mobilde basılmıyor** (Mobil:169-174).
   Bilgi kaybı yok; kaynak gösterildi.
7. **Menü satırının üçlü tane rayı ve hover'ı mobilde kapalı** (Mobil:113-116).
8. **`--panel-86` token'ı eklendi** (`rgba(10,8,7,.86)`), tasarımda iki kullanım:
   mobil sayaç hücreleri (Mobil:101-103) ve mobil alt bilgi (Mobil:181).
9. **`ImlecKoru` kendi kabını kaybetti**, sahne kabının içine girdi (Ana:31).
   Ölü `position:fixed` katmanı kalktı.
10. **`TaneDizilimi` ölçüleri CSS değişkenine taşındı**; API'ye isteğe bağlı
    `mobil` prop'u eklendi, dokuz çağıranın çıktısı değişmedi.
11. **`BolumBasligi` mobil ölçü almadı**: paylaşımlı bileşen, mobil çizimi olmayan
    üç sayfayı da etkilerdi.

## Sahibine açık sorular

1. **Gece vardiya çipleri mobilde dört mü olsun?** Tasarım evet diyor ve kanıtı
   sağlam (çizim + betik dizisi birlikte değişmiş). Uygulanması `VardiyaSeridi.tsx`
   içinde görünüm genişliğine bağlı bir liste gerektiriyor; saf CSS ile gizleme
   02:00-03:00 ve 04:00-05:00 aralıklarında hiçbir çipin yanmamasına yol açar.
   Karar verilirse `components/saat/` sahibi turda uygulanmalı.
2. **Menü sayfası mobilde kart mı satır mı?** `Mobil:392` satır diyor ama menü
   sayfasını çizmiyor. Portun kartları 390px'te küçülmüyor, tek kolon oluyor.
   Satıra çevirmek fotoğraf plakalarını düşürmek demek.
3. **Mobilde ikram çipleri Ocaktan panelinin içine mi taşınsın, fotoğraf plakaları
   düşsün mü?** Prototip ikisini de yapıyor (Mobil:138-141 ve plakaların yokluğu);
   ikisi de ölçü değil kurgu kararı.
4. **İç sayfaların mobil kor sahnesi için ölçü çıkarılsın mı**, yoksa masaüstü
   ölçüsü mobilde de kalsın mı?
5. **`BolumBasligi` mobilde 30px/1.1/-.035em olsun mu?** Ana sayfanın Ocaktan'ı
   için tasarım bunu söylüyor, ama aynı bileşen mobil çizimi olmayan üç yerde daha
   basılıyor.

## Öz denetim

- Değiştirilen dosyaların hepsi bu turun kapsamında: `components/ember/*`,
  `components/sayfa/` içerik bileşenleri, `styles/tokens.css`, ve iki paylaşımlı
  primitif (`components/ui/TaneDizilimi.*`, `components/ui/MenuSatiri.*`).
  İkincisi ne "sizin" ne "dokunmayacağınız" listesindeydi; `MenuSatiri` yalnız ana
  sayfa tarafından, `TaneDizilimi`'nin `cizgi` varyantı yalnız hero tarafından
  kullanılıyor, ve çerçeve sayfa içinde yerel kopya yazmayı yasaklıyor.
  `Buton`, `layout/`, `saat/`, `app/`, `GizlilikSayfasi`, `HataSayfasi`,
  `konum/Harita.module.css` ve `IYILESTIRMELER.md`'ye dokunulmadı.
- Sayaç etiketleri 390px'te iki satıra sarıyor (portun etiketleri tasarımınkinden
  uzun). Ölçü değil içerik farkı, kabul edildi.
- Mobil satır düzeni `order` ve `flex-basis:100%` ile kuruldu; DOM sırası
  değişmedi, yani ekran okuyucu sırası (sıra, ad, açıklama, fiyat) korunuyor.
- Ölçümler dev sunucusunda alındı, üretim çıktısı ayrıca 390 ve 1440'ta gözle ve
  konsolla doğrulandı; üretim CSS'inde 14 adet `max-width:780px` bloğu ve tane
  değişkenleri mevcut.
