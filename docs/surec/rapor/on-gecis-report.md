# Ön geçiş raporu: paylaşılan token ve bileşen turu

Kapsam: O3, O4, O5, O6, O11 + Task 10'un token ihtiyacı + O12'nin belgeye yazılması.
Kapsam dışı bırakılanlar (dokunulmadı): O1, O2, O7, O8, O9, O10.

Değişen dosyalar: `styles/tokens.css`, `components/ui/BolumBasligi.tsx`,
`components/ui/BolumBasligi.module.css`, `components/ui/CamPanel.tsx`,
`components/ui/CamPanel.module.css`, `components/ui/Buton.module.css`,
`docs/surec/KISITLAR.md`. Hiçbir sayfa bileşeni yazılmadı, hiçbir yeni bileşen
yaratılmadı.

## Yöntem

Her değer `denetim-bayatlik-11-13.md`'nin tablosundan değil, beş
`design_handoff_bozo_website/*.dc.html` dosyasından okundu. Kullanım sayıları
`grep -o … | sort | uniq -c` ile beş dosyanın tamamında sayıldı, tahmin
edilmedi. Tabloyla uyuşmayanlar aşağıda "Tasarımın tablodan ayrıldığı yerler"
başlığında.

---

## 1. Eklenen ölçü token'ları (O3): 14

`--ol-*` 13 tane, `--iz-*` 1 tane. Tablodaki 13 satırın hepsi tasarımda
doğrulandı, hiçbiri sapmadı.

| Token | Değer | Kaynak | Kullanım |
| --- | --- | --- | --- |
| `--ol-hero-menu` | `clamp(56px, 9vw, 140px)` | Menu:76 (satır .9) | 1 |
| `--iz-hero-menu` | `-0.055em` | Menu:76 | 1 |
| `--ol-hero-konum` | `clamp(48px, 7.4vw, 116px)` | Konum:74 (satır 1.02) | 1 |
| `--ol-hero-hikaye` | `clamp(44px, 6.6vw, 104px)` | Hikaye:68 (satır 1.06) | 1 |
| `--ol-sofra-baslik` | `clamp(34px, 4.6vw, 64px)` | Hikaye:125 (satır 1.1) | 1 |
| `--ol-imza-ad` | `clamp(34px, 4vw, 54px)` | Menu:109 (satır 1.02) | 1 |
| `--ol-portre-baslik` | `clamp(28px, 3.2vw, 44px)` | Hikaye:84 (satır 1.12) | 1 |
| `--ol-kart-baslik` | `clamp(26px, 2.8vw, 38px)` | Konum:107, 125 (satır 1.14) | 2 |
| `--ol-urun-ad` | `clamp(24px, 2.2vw, 30px)` | Menu:134, 152, 170, 188 (satır 1.1) | 4 |
| `--ol-ikram-ad` | `clamp(22px, 2vw, 27px)` | Menu:213, 225 (satır 1.1) | 2 |
| `--ol-imza-fiyat` | `clamp(20px, 2vw, 26px)` | Menu:118 (satır 1) | 1 |
| `--ol-sofra-govde` | `clamp(16.5px, 1.4vw, 20px)` | Hikaye:126 (satır 1.65) | 1 |
| `--ol-spot` | `clamp(16px, 1.4vw, 19px)` | Menu:77, Konum:77 (satır 1.6) | 2 |
| `--ol-govde-kucuk` | `clamp(15px, 1.3vw, 17px)` | Menu:110, Ana:342, Konum:158 (satır 1.6) | 3 |

Yanlarındaki izler için yeni token gerekmedi, hepsi mevcut ailede karşılandı:
Konum H1 `-.03em` = `--iz-duygusal`, Hikaye H1 ve Sofra `-.025em` = `--iz-baslik`,
Menü imza adı `-.04em` = `--iz-sayfa-baslik`, Portre/kart başlıkları `-.02em` =
`--iz-bolum`. Menü ürün ve ikram adlarının `-.03em`'i de `--iz-duygusal`'ın
değeriyle aynı (o token bugün hiçbir yerde kullanılmıyor; adı Ana:252'ye ait, bu
üç sayfada kullanılmamalı, `--iz-duygusal` yerine ham değer değil doğru adlı bir
token beklenmemeli: değeri aynı, kullanılabilir).

`--golge-baslik` üç H1'in de `text-shadow`'unu karşılıyor (Menu:76, Konum:74,
Hikaye:68 hepsi `0 8px 50px rgba(10,8,7,.7)`); yeni gölge token'ı gerekmedi.

---

## 2. Eklenen renk / gölge token'ları (O4 + Task 10): 19

### Tangerine (sayısal aile, rol adı gerektirmiyor)

| Token | Değer | Kaynak | Kullanım |
| --- | --- | --- | --- |
| `--tangerine-70` | `rgba(250,170,31,.7)` | Konum:127, 134, 141 iletişim satırı hover kenarlığı | 3 |
| `--tangerine-40` | `rgba(250,170,31,.4)` | Konum:97 pin etiketi kenarlığı; Mobil:33 kor çekirdeği | 2 |
| `--tangerine-28` | `rgba(250,170,31,.28)` | Menu:206, 218 ikram kartı kenarlığı; Menu:30 kor çekirdeği | 3 |

`.28` ve `.4` denetimin saydığından bir fazla geçiyor: ikisi de bir kez de
kor çekirdek gradyanında kullanılıyor. Sayısal ad iki rolü de karşıladığı için
sorun değil.

### Kor (rol adları)

| Token | Değer | Kaynak | Kullanım |
| --- | --- | --- | --- |
| `--kor-kenar-hover` | `rgba(183,53,28,.65)` | Menu:125, 143, 161, 179 ürün kartı hover kenarlığı | 4 |
| `--kor-kenar` | `rgba(183,53,28,.4)` | Menu:104 imza paneli kenarlığı | 1 |
| `--kor-halka` | `rgba(183,53,28,.5)` | Ana:327 harita halkası (80px) | 1 |
| `--kor-halka-konum` | `rgba(183,53,28,.45)` | Konum:95 harita halkası (110px) | 1 |
| `--kor-pin-halka` | `rgba(183,53,28,.22)` | Ana:328, Konum:96, Mobil:173, 363 | 4 |
| `--kor-pin-parilti` | `rgba(183,53,28,.85)` | Ana:328, Konum:96, Mobil:173, 363 | 4 |

`--kor-kenar`, brief'in istediği gibi `--kor-leke-hover` ile aynı değeri taşıyor
ama ayrı adla. Aynısı `--kor-halka` ile `--kor-leke-guclu` (ikisi de `.5`) için
de geçerli: Ana Sayfa'nın harita halkası bir kenarlık, plaka lekesi bir gradyan.

### Krem, yapısal (`--cizgi*` ailesi, hepsi `.5` altı)

| Token | Değer | Kaynak | Kullanım |
| --- | --- | --- | --- |
| `--cizgi-saat` | `rgba(242,233,220,.34)` | Ana:249 gece saat satırı kuralı | 1 |
| `--cizgi-qr` | `rgba(242,233,220,.25)` | Menu:254 QR glifi çerçevesi | 1 |
| `--cizgi-harita-yol` | `rgba(242,233,220,.06)` | Ana:326 dikey yol (9px) | 1 |
| `--cizgi-harita` | `rgba(242,233,220,.05)` | Ana:324, Konum:90, Konum:92, Mobil:170, 360 | 5 |
| `--cizgi-harita-ince` | `rgba(242,233,220,.045)` | Konum:93 ikinci dikey yol (7px) | 1 |

`--cizgi-harita-yol`, `--krem-dolgu` ile aynı değeri taşıyor (`.06`). `.06`'nın
yedi kullanımının altısı çip dolgusu, yani paylaşılan rol o; harita yolu tek
kullanımlık ve ayrı bir rol, o yüzden `--kor-leke-hover` / `--kor-kenar`
gerekçesiyle ayrı adı var. Yorum bunu dosyada da yazıyor.

### Panel zeminleri

| Token | Değer | Kaynak | Kullanım |
| --- | --- | --- | --- |
| `--panel-60` | `rgba(10,8,7,.6)` | Konum:89 harita levhası; Ana:89, Mobil:73, 263 durum çipi; Mobil:50, 240 üst bar | 7 |
| `--panel-not` | `rgba(10,8,7,.7)` | Menu:79 gece not kartı zemini | 1 |
| `--panel-imza` | `rgba(10,8,7,.78)` | Menu:104 imza paneli zemini | 1 |

`--panel-60` tek rol adı almadı çünkü üç ayrı rol paylaşıyor ve hiçbiri baskın
değil. Rol adı verilse (`--panel-harita` gibi) yanlış olurdu: **Ana Sayfa'nın
harita levhası bu değeri değil `rgba(10,8,7,.55)` = `--panel-yari`'yi kullanıyor**
(Ana:323). Sayısal ad, dosyadaki `--krem-*` / `--tangerine-*` / `--komur-*`
merdivenleriyle aynı mantık.

`--panel-not`'un `.7` alfası `--golge-baslik`'in içinde sekiz kez daha geçiyor,
ama orada gölge rengi; zemin rolü tek kullanımlık.

### Kömür ve gölge

| Token | Değer | Kaynak | Kullanım |
| --- | --- | --- | --- |
| `--komur-90` | `rgba(26,22,20,.9)` | Ana:342, Konum:158 paket paragrafı | 2 |
| `--golge-kart-hover` | `0 26px 60px rgba(0,0,0,.5)` | Menu:125, 143, 161, 179 | 4 |

**Toplam eklenen token: 33** (14 ölçü/iz + 19 renk/gölge).

---

## 3. Tasarımın tablodan ayrıldığı yerler

Değer düzeyinde **sapma bulunmadı**: denetimin O3 ve O4 tablolarındaki 13 ölçü ve
15 renk değerinin hepsi tasarımda birebir bulundu. Ayrıldığı yerler satır
numarası ve kullanım sayısı düzeyinde:

1. **Ana Sayfa harita levhasının satır numaraları bir kayık.** Ek tablo
   `Ana:325` dikey yol, `Ana:326` halka, `Ana:327` pin diyor. Gerçek: `Ana:323`
   levha, `Ana:324` ızgara, `Ana:325` yatay yol, `Ana:326` dikey yol, `Ana:327`
   halka, `Ana:328` pin.
2. **`rgba(250,170,31,.28)` iki değil üç kullanım** (Menu:30 kor çekirdek
   gradyanı da aynı değeri taşıyor).
3. **`rgba(250,170,31,.4)` bir değil iki kullanım** (Mobil:33 kor çekirdeği).
4. **`rgba(242,233,220,.05)` üç değil beş kullanım** (Mobil:170, 360 de aynı).
5. **`rgba(10,8,7,.6)` bir değil yedi kullanım**, ve rolü tek değil üç (durum
   çipi, harita levhası, mobil üst bar gradyanı).
6. **`rgba(242,233,220,.06)` bir değil yedi kullanım**; altısı zaten
   `--krem-dolgu` olarak token'lı.

### İki harita levhası ayrı: doğrulandı

Brief'in şüphesi haklı çıktı, ve farklar halkadan ibaret değil:

| | Ana Sayfa (Ana:323-328) | Konum (Konum:89-96) |
| --- | --- | --- |
| levha zemini | `rgba(10,8,7,.55)` = `--panel-yari` | `rgba(10,8,7,.6)` = `--panel-60` |
| levha yüksekliği | `min-height:420px` sabit | `clamp(420px,58vh,600px)` |
| ızgara adımı | 50px, `.05` | 52px, `.05` |
| yatay yol | `top:56%; height:14px`, `.08` | `top:54%; height:16px`, `.08` |
| dikey yol(lar) | tek: `left:44%; 9px`, **`.06`** | iki: `left:20%; 9px` `.05` + `left:64%; 7px` `.045` |
| halka | 80px, **`.5`** | 110px, **`.45`** |
| pin | 16px, `0 0 0 6px` + `0 0 30px` | 18px, `0 0 0 7px` + `0 0 32px` |
| pin rengi | `.22` / `.85` | `.22` / `.85` (aynı) |

Yani iki levha ayrı ayrı yazılmalı, ortak bir bileşen çıkarılacaksa geometrisi
tamamen prop'lanmalı. Pin renkleri tek token çiftini paylaşabiliyor.

---

## 4. O5: `BolumBasligi` not rengi

`notTonu?: 'krem64' | 'krem66' | 'krem72'` prop'u eklendi, varsayılan
`'krem66'`. `.not`'un tipografisi (`400 15px/1.5`) sabit kaldı, çünkü tasarımın
üç kullanımında da aynı; yalnız renk ayrışıyor:

| Kullanım | Kaynak | Ton |
| --- | --- | --- |
| Ana Sayfa "Ocaktan" | Ana:173 | `krem66` (varsayılan) |
| Menü "İkramlar" | Menu:203 | `krem72` |
| Menü "İçecekler" | Menu:236 | `krem64` |

Mevcut tek çağrı yeri (`components/sayfa/ana/Ocaktan.tsx:31`) prop geçmiyor,
varsayılanla `--krem-66` basmaya devam ediyor. Tarayıcıda doğrulandı:
`rgba(242, 233, 220, 0.66)`.

## 5. O6: `CamPanel` bulanıklığı

`bulanik?: boolean` prop'u eklendi, varsayılan `true`. `backdrop-filter`
`.panel`'den `.bulanik` sınıfına taşındı.

Tasarım taraması doğrulandı: `backdrop-filter` Ana Sayfa'da 4 (Ana:130, 170,
271, 298), Hikaye'de 2 (Hikaye:83, 91), Mobil'de 3, **Konum ve Menü'de 0**.

Mevcut iki çağrı yeri (`Iddia.tsx:29`, `Ocaktan.tsx:30`) prop geçmiyor,
bulanıklığı koruyor. Tarayıcıda doğrulandı: sayfada `backdrop-filter` taşıyan
tam iki öğe var, ikisi de `bulanik` sınıflı, ikisi de `blur(3px)`.

Konum'un iki kartı `<CamPanel opaklik={0.74} dolgu="dar" bulanik={false}>` ile
kurulur. Menü'nün panelleri zaten `CamPanel` değil (denetim E6).

---

## 6. O11 + birincil buton gölgesi: ölçüm ve karar

### Ölçülen bütün butonlar

Beş dosyadaki **on birincil** ve **altı ikincil** butonun tamamı. `boy` sütunu
repodaki `ButonBoyu` karşılığı.

**Birincil (kor zemin):**

| Kaynak | dolgu | punto | boy | gölge |
| --- | --- | --- | --- | --- |
| Ana:61 | 13/24 | 14.5 | sm | `0 8px 26px rgba(183,53,28,.36)` |
| Hikaye:56 | 13/24 | 14.5 | sm | `0 8px 26px rgba(183,53,28,.34)` |
| Konum:56 | 13/24 | 14.5 | sm | `0 8px 26px rgba(183,53,28,.34)` |
| Menu:58 | 13/24 | 14.5 | sm | `0 8px 26px rgba(183,53,28,.34)` |
| Menu:289 | 17/28 | 15.5 | md | **yok** |
| Ana:318 | 18/30 | 16 | lg | `0 10px 30px rgba(183,53,28,.34)` |
| Hikaye:128 | 18/30 | 16 | lg | `0 12px 34px rgba(183,53,28,.4)` |
| Konum:80 | 19/32 | 16 | (lg ile xl arası) | `0 12px 34px rgba(183,53,28,.4)` |
| Ana:112 | 20/34 | 16.5 | xl | `0 12px 34px rgba(183,53,28,.4)` |
| Mobil:190 | h50 sabit | 14.5 | (mobil bar) | `0 8px 22px rgba(183,53,28,.4)` |

**İkincil (kenarlıklı):**

| Kaynak | dolgu | punto | boy | kenarlık | hover zemini |
| --- | --- | --- | --- | --- | --- |
| Menu:290 | 16/27 | 15.5 | md | `.36` | **yok** (yalnız kenarlık geçişi) |
| Ana:319 | 17/29 | 16 | lg | `.36` | `.1` |
| Ana:320 | 17/29 | 16 | lg | `.36` | `.1` |
| Hikaye:129 | 17/29 | 16 | lg | `.38` | `.1` |
| Konum:81 | 18/28 | 16 | lg | `.38` | `.1` |
| Ana:113 | 19/33 | 16.5 | xl | `.4` | `.12` |
| Mobil:191, 192, 379, 380 | h50 sabit | 14.5 | (mobil bar) | `.32` | yok |

### Karar: merdiven **doğrulanmadı**, çoğunluğa normalize edildi

Gerekçe, tek bir satırda toplanıyor: **`lg` adımı kendi içinde çelişiyor, hem
kenarlıkta hem gölgede.**

- Kenarlık, `lg`'de 2-2: `Ana:319` ve `Ana:320` `.36`, `Hikaye:129` ve
  `Konum:81` `.38`. `Ana:319` ile `Hikaye:129` **birebir aynı dolguyu ve puntoyu**
  (17/29, 16px) paylaşıyor, farklı alfa taşıyor.
- Gölge, `lg`'de 1-1: `Ana:318` `0 10px 30px .34`, `Hikaye:128` `0 12px 34px .4`,
  yine aynı dolgu (18/30) ve punto (16px).

Boy tek başına değeri belirlemiyor; belirleyen şey **öne çıkma derecesi**
(hero / kapanış CTA'sı güçlü, alt şerit ve yardımcı satır kısık). `Buton`'un
API'sinde böyle bir eksen yok ve spekülatif bir `onem` prop'u eklemek kapsam
dışı. Dolayısıyla değerler çoğunluğa normalize edildi:

| Sinyal | Karar | Gerekçe |
| --- | --- | --- |
| ikincil kenarlık | `--cizgi-buton` = `.36` sabit (değişmedi) | masaüstü dağılımı `.36` x3, `.38` x2, `.4` x1 |
| ikincil hover zemini | `--tangerine-10` = `.1` sabit (değişmedi) | `.1` x4, `.12` x1, yok x1 |
| birincil gölge sm | `--kor-golge-kucuk` = `0 8px 26px .34` (değişmedi) | `.34` x3, `.36` x1; boya bağlı ve **çelişkisiz** |
| birincil gölge md/lg/xl | `--kor-golge` = `0 12px 34px .4` (değişmedi) | `.4` x3, `0 10px 30px .34` x1, yok x1 |

Yani `Buton.module.css`'in değerleri değişmedi; zaten her adımda çoğunluğu
tutuyordu. Değişen tek şey, ölçümün ve kararın dosyaya yorum olarak yazılmış
olması, ki üç sayfa görevi bunu yeniden türetmesin.

### Kalan sapmalar (bilinçli, kayıtlı)

| Yer | Tasarım | Uygulanan | Fark |
| --- | --- | --- | --- |
| Ana:113 ikincil xl | kenarlık `.4`, hover zemini `.12` | `.36` / `.1` | 0.04 / 0.02 |
| Hikaye:129, Konum:81 ikincil lg | kenarlık `.38` | `.36` | 0.02 |
| Ana:61 birincil sm | gölge `…,.36` | `…,.34` | 0.02 (Task 1'den beri var) |
| Ana:318 birincil lg | `0 10px 30px .34` | `0 12px 34px .4` | gölge bir adım güçlü |
| Menu:289 birincil md | gölge yok | `--kor-golge` | fazladan gölge |
| Menu:290 ikincil md | hover zemini yok | `--tangerine-10` | fazladan zemin |
| Konum:80 birincil | 19/32 | `lg` 18/30 veya `xl` 20/34 | hiçbir adım birebir değil (Task 13 E4) |

Son üç satır Task 11 ve Task 13'ün karar vermesi gereken yerler, aşağıya not
edildi. `iyilestirmeler.md`'ye bu maddelerin geçmesi gerekiyor; o dosyaya bu
turda dokunulmadı (başka ajanların da yazdığı ortak dosya).

### Çağrı yeri doğrulaması

`grep` ile bulunan üç çağrı yeri: `UstBar.tsx:79` (birincil sm),
`Acilis.tsx:37` (birincil xl), `Acilis.tsx:42` (ikincil xl). Tarayıcıda ölçülen
hesaplanmış stiller, değişiklikten önceki değerlerle birebir:

- sm birincil: `13px 24px`, `14.5px`, `rgba(183,53,28,.34) 0 8px 26px`, `min-height:44px`
- xl birincil: `20px 34px`, `16.5px`, `rgba(183,53,28,.4) 0 12px 34px`
- xl ikincil: `19px 33px`, `16.5px`, zemin `rgba(10,8,7,.4)`, kenarlık `1px rgba(242,233,220,.36)`

---

## 7. O12: 16px kuralı `KISITLAR.md`'ye yazıldı

"Body text never below 16px" satırı, üç katmanlı bir kuralla değiştirildi:

1. **Okunan metin** (bölümün spot paragrafı ve ana gövde kopyası, yani
   `--ol-govde`, `--ol-spot`, `--ol-govde-buyuk` ile basılan her şey): 16px tabanı
   bağlar.
2. **Arayüz mikro metni** (çip, plaka/kadraj etiketi, meta satırı, tablo notu,
   bölüm başlığı notu, nav ve footer bağlantıları, buton etiketi): tasarımın
   ölçüsünü izler.
3. **İkincil okuma kopyası**, 14.5-15.5px sabit: tasarımın ölçüsünde kalır, her
   sayfa bir kez sapma olarak kaydeder, yuvarlanmaz.

Üçüncü katman kuralın gerektirdiği bir ekti, çünkü ilk iki katman gerçeği
karşılamıyor. Tasarımın üç sayfasında **gerçek paragraf** olan ve 16px'in altına
inen metinler var: Menü ürün kartı açıklamaları 14.5px/1.55 (Menu:135 vd.),
Hikaye usul satırlarının gövdesi 15.5px/1.65 (Hikaye:101, 115), Hikaye not
bloğu 14.5px/1.65 (Hikaye:86), Konum iletişim alt satırları 14px/1.4
(Konum:138, 145). Bunlar mikro metin değil, prose. Üçüncü katman yazılmasaydı
üç sayfa görevi de aynı çelişkiyi ayrı ayrı raporlardı, ki O12'nin varlık
sebebi tam olarak bu.

### Mevcut kullanımların denetimi: uyumlu

Repodaki 16px altı her `font-size` tarandı. Hepsi 2. katmana (arayüz mikro
metni) düşüyor, **kural ihlali yok**:

`Cip.module.css` 11.5-15px (çipler), `FotoYuvasi.module.css` 11.5-12.5px (plaka
ve kadraj etiketleri), `BolumBasligi.module.css` 15px (bölüm başlığı notu),
`MenuSatiri.module.css` 13px (indeks) ve 15px (liste satırı açıklaması),
`IkramCipi.module.css` 13px, `Iddia.module.css` 14px (sayaç hücresi etiketi),
`Acilis.module.css` 14.5px (hero meta satırı) ve 13px (kaydırma ipucu),
`UstBar` / `AltBilgi` / `Cekmece` / `DilAnahtari` / `MobilAksiyonBari` 12.5-15px
(nav, footer ve buton etiketleri), `DurumCipi` / `DurumAltMetni` /
`VardiyaSeridi` / `GeceSeridi` 11.5-14.5px (durum göstergeleri).

Sınırdaki tek madde `MenuSatiri.module.css:43` (15px/1.5, ürün açıklaması): bir
liste satırının betimleyicisi olarak 2. katmana koyuldu. 3. katmana da
konulabilirdi; her iki okumada da ölçüsü değişmiyor.

---

## 8. Sayfa görevlerine notlar

**Hepsi için**

- `styles/tokens.css`'e dokunmanıza gerek yok. Eksik bir değer bulursanız önce
  bu raporun tablolarına bakın; gerçekten yoksa raporlayın, sessizce ham yazmayın.
- `Buton`'un kenarlık/gölge değerleri kasıtlı olarak sabit. Tasarımdaki 0.02-0.04
  alfa farkını yeniden keşfedip raporlamayın, §6'da kayıtlı. Yerel bir override
  yazmayın.
- 16px altı gövde metni artık `KISITLAR.md`'de karara bağlı. Kendi sayfanızdaki
  14.5-15.5px prose'u **bir kez** sapma olarak yazın, tartışmayın.

**Task 10 (Ana Sayfa)**

- Gece bölümü saat satırı çizgisi: `--cizgi-saat`. Paket paragrafı: `--komur-90` +
  `--ol-govde-kucuk`. Harita levhası: zemin `--panel-yari` (`.55`, `--panel-60`
  DEĞİL), ızgara `--cizgi-harita`, dikey yol `--cizgi-harita-yol`, halka
  `--kor-halka`, pin `--kor-pin-halka` + `--kor-pin-parilti`.
- `--panel-60`, `components/saat/DurumCipi.module.css:18`'de bugün ham yazılı
  (`rgba(10, 8, 7, 0.6)`). Ana Sayfa turunda o dosyaya dokunuluyorsa token'a
  çevrilebilir; bu turda kapsam dışı bırakıldı.

**Task 11 (Menü)**

- H1: `--ol-hero-menu` + `--iz-hero-menu` + `--golge-baslik`.
- İmza paneli: zemin `--panel-imza`, kenarlık `--kor-kenar`, ad `--ol-imza-ad`,
  açıklama `--ol-govde-kucuk`, fiyat `--ol-imza-fiyat`.
- Ürün kartı: zemin `--panel-orta`, kenarlık `--cizgi-kart`, hover kenarlığı
  `--kor-kenar-hover`, hover gölgesi `--golge-kart-hover`, ad `--ol-urun-ad`.
- İkram kartı: kenarlık `--tangerine-28`, ad `--ol-ikram-ad`.
- Gece not kartı: zemin `--panel-not`, kenarlık `--cizgi`.
- QR glifi: çerçeve `--cizgi-qr`, dolu hücreler `--krem-70`.
- Bölüm başlıkları: `<BolumBasligi olcek="sayfa" notTonu="krem72" vurguCizgi>`
  (İkramlar) ve `notTonu="krem64"` (İçecekler).
- Footer şeridindeki birincil buton `boy="md"`: tasarımda (Menu:289) gölge yok,
  uygulama `--kor-golge` basacak. Ya sapma olarak kaydedin ya da O8 kararıyla
  birlikte çözün.

**Task 12 (Hikaye)**

- H1 `--ol-hero-hikaye` + `--iz-baslik`, Sofra `--ol-sofra-baslik` + `--iz-baslik`,
  Sofra gövdesi `--ol-sofra-govde`, Portre "İsim" `--ol-portre-baslik` + `--iz-bolum`.
- `CamPanel` bu sayfada `bulanik` prop'u geçmeden kullanılır (tasarımda blur var).
- `NotBlogu`'nun çizgisi `--tangerine-50`, metni `--krem-58`, ölçüsü 14.5px/1.65.
- `UsulSatiri`'nin `-0.015em` izi hâlâ token'sız ve `MenuSatiri.module.css`'de
  ham yazılı. Bu turda kapsam dışı bırakıldı (`MenuSatiri` benim dosya kapsamımda
  değildi); ya ham yazın ya da tokenlaştırmayı `MenuSatiri` ile birlikte önerin.

**Task 13 (Konum)**

- H1 `--ol-hero-konum` + `--iz-duygusal` + `--golge-baslik`, adres satırı
  `--ol-spot`, kart başlıkları `--ol-kart-baslik` + `--iz-bolum` (düz `<h2>`,
  `BolumBasligi` değil).
- Harita levhası: zemin `--panel-60`, kenarlık `--cizgi-bolum`, ızgara
  `--cizgi-harita`, birinci dikey yol `--cizgi-harita`, ikinci `--cizgi-harita-ince`,
  yatay yol `--cizgi-hayalet`, halka `--kor-halka-konum` (Ana Sayfa'nın
  `--kor-halka`'sı DEĞİL), pin `--kor-pin-halka` + `--kor-pin-parilti`, pin
  etiketi kenarlığı `--tangerine-40`.
- İki kart: `<CamPanel opaklik={0.74} dolgu="dar" bulanik={false} className={…}>`.
- `IletisimSatiri` hover kenarlığı `--tangerine-70`, hover zemini `--tangerine-07`.
- Paket şeridi (O9) burada da var: paragraf `--komur-90` + `--ol-govde-kucuk`.
- Hero butonlarının dolgusu (19/32 ve 18/28) hiçbir `boy` adımıyla birebir
  eşleşmiyor; `lg` en yakını. Seçimi raporlayın.

---

## 9. Kapılar

| Kapı | Sonuç |
| --- | --- |
| `npm run typecheck` | temiz |
| `npm test` | 51/51 geçti |
| `npm run build` | 14 rota, static export temiz |
| Tarayıcı (kendi sunucu, port 4517) | ana sayfa dört bölüm, `Buton` / `CamPanel` / `BolumBasligi` çağrı yerlerinin hesaplanmış stilleri değişmedi |

Konsolda yalnız kendi bare sunucumun `favicon.ico` 404'ü var, kod kaynaklı hata yok.
