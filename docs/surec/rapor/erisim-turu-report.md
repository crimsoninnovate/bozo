# Erişilebilirlik tabanı turu

Tarih: 12 Ağustos 2026. Kaynak: `task-15-report.md` (D1, Y2, Y3), `task-16-oneriler.md`
(Y4, Y5), `docs/PARITE.md` bölüm 5. `KISITLAR.md` erişilebilirlik minimumlarını sert
kural sayar; bu turun altı maddesi tasarımdan sapma değil, tasarımın altındaki taban.

## Ölçüm ortamı

- Kendi Chromium örneği (playwright-core 1.58.2, chromium-1208), kendi statik sunucuları.
- **İki derleme aynı anda ayakta:** `oncesi` = `ee38219` ağacı, port 8478; `sonrasi` =
  bu turun ağacı, port 8479. Her sayı iki sunucuda aynı betikle ölçüldü, hafızadan
  karşılaştırma yok.
- Genişlikler 1440x900 ve 390x844, on rota (5 TR + 5 EN).
- **Dokunma hedefi: `getBoundingClientRect` kullanılmadı.** Hedefler görünmez `::before`
  katmanlarında yaşıyor ve çapanın kutusu onları ıskalıyor. Ölçüm `document.elementFromPoint`
  ile: her noktada en yakın etkileşimli ata bulunur, hedefe ait noktaların sınır kutusu
  gerçek isabet alanı sayılır. Tarama adımı isabet kutusu için 1px, çift çift kesişim ve
  footer ritmi için 0.5px (26.5px'lik bir adımda tam sayı tarama yanıltıyor).
- Ölçümden önce `scroll-behavior:auto` enjekte edilir. İlk turda edilmemişti ve yumuşak
  kaydırma 400ms içinde bitmediği için footer hedefleri "0px isabet" veriyordu; o sonuçlar
  atıldı, tablodaki değerler kaydırma tamamlandıktan sonra alındı.
- Görsel kare karşılaştırmasında saat sabitlenir (`clock.setFixedTime`, 20:30 Girne),
  animasyon ve geçişler durdurulur, imleç sahneden çıkarılır. `fullPage` kullanılmaz
  (kor sahnesi `position:fixed`, bkz. `docs/PARITE.md`).

---

## Görünen tasarım bozulmadı: 42 kare, 0 farklı piksel

İki derlemeden aynı koşullarda 42 kare alındı (7 rota x 2 genişlik x 3 kadraj: sayfa
başı, üst bar yakın kadrajı, sayfa dibi) ve `pixelmatch` ile karşılaştırıldı
(eşik 0.06).

| Kare kümesi | Fark |
|---|---|
| 42 kare, 390px ve 1440px | **0 piksel** |

Bu turun dokunma hedefi işi tümüyle görünmez `::before` katmanlarında ve odak halkası
yalnız `:focus-visible` altında; atlanan blok bağlantısı `position:fixed` ve odak
almadan viewport'un üstünde bekliyor. Kutu ölçüleri, satır konumları ve renkler
değişmedi, kare sayısı bunu piksel düzeyinde gösteriyor.

---

## 1. Üst bardaki marka bağlantısı (Y4)

**Önce.** Bardaki yedi hedeften altısı 44px'i geçiyordu, marka geçmiyordu. 390px'te nav
gizli olduğu için bu bağlantı ana sayfaya dönmenin tek yolu.

| Genişlik | Kutu | Gerçek isabet (önce) | Gerçek isabet (sonra) | Örnek |
|---|---|---|---|---|
| 390 | 171x17 | 171 x **21** | 171 x **45** | 20 |
| 1440 | 195x21 | 196 x **26** | 196 x **44** | 20 |

**Ne değişti.** `UstBar.module.css`, `.marka`ya `position:relative` ve 44px yüksekliğinde
görünmez bir `::before`. `AltBilgi`'de altı kez kullanılan teknik; kutunun kendi boyu ve
barın yerleşimi değişmez.

**Çakışma.** Bar içinde yatayda en yakın hedefe pay: 390px'te 50.4px (dil anahtarı),
1440px'te 485px (nav). Dikeyde bar tek satır. Kesişim yok.

**Yan etki, kaydedilmesi gereken.** Sabit bar sayfa içeriğinin üstünde duruyor ve
gradyanının alt ucu saydam. Sayfa dibine kaydırılmış `/` rotasında (1440px) barın altında
kalan bir bölüm butonunun kutusunun **%33'ü** zaten markaya aitti; marka 44px'e çıkınca
bu oran **%50** oldu (2638px > 3976px). Sınıf yeni değil, derece büyüdü. Buton başka
kaydırma konumlarında alanının tamamına sahip; alternatifi markayı 21px'te bırakmak,
yani hedefi tümüyle kaçırmak. Sahibine soruluyor (Açık 4).

## 2. Odak halkası (Y5)

**Önce.** Sitede tek bir `:focus`/`:focus-visible` kuralı yoktu. On rota x iki genişlik x
ilk 14 durak taramasında **180 durağın 180'i** tarayıcı varsayılanındaydı:

| Değer | Adet |
|---|---|
| `outline: auto 1px rgb(0, 95, 204)`, offset 1px | 170 |
| `outline: auto 1px rgb(0, 95, 204)`, offset 0px | 10 |

`rgb(0,95,204)` sekiz renkli paletin dışında; Chrome onu beyaz kontur ile çift halka
çizdiği için `#0A0807` üstünde geçiyor, Firefox ve Safari kendi ince halkalarını çiziyor
ve bu zeminde görünürlükleri garanti değil.

**Sonra.** `styles/reset.css`, üç satır:

    :focus-visible { outline: 2px solid var(--tangerine); outline-offset: 3px }
    :focus:not(:focus-visible) { outline: none }
    main:focus-visible { outline: none }

| Değer | Adet |
|---|---|
| `outline: solid 2px rgb(250, 170, 31)`, offset 3px | **198** |

(180 > 198: atlanan blok bağlantısı her rotada bir durak ekliyor.)

**Renk seçimi ve kontrast.** Aday iki renk vardı. `--kor` #B7351C kömür üstünde 3.03:1,
yani halka olarak eşiği ancak sıyırır ve `KISITLAR.md` kor için "gövde metni olamaz"
kısıtını zaten taşıyor. `--tangerine` #FAAA1F sayfa zemini `#0A0807` üstünde **10.31:1**,
kömür `#1A1614` üstünde **9.40:1**. Tangerine seçildi.

Ölçüm, analitik değer değil: 104 hedefin her birinde halkanın kendi ayak izi
(kutunun 3-5px dışındaki bant) kırpılarak yakalandı ve bandın **en parlak pikseli** en
kötü durum sayıldı.

| Sonuç | Adet |
|---|---|
| 3:1 ve üstü | 99 |
| Altında | 5 |

Beş örneğin ikisi tipi: üçü 390px'te `AltBilgi.gizlilikLink` (2.59-2.69:1, bandın en
parlak pikseli `rgb(134,105,89)`), ikisi 390px'te birincil kor butonu (2.97-3.01:1,
bandın en parlak pikseli `rgb(185,56,28)`, yani butonun kendi `--kor-golge` parıltısı).
İkisinde de halkanın **dış** yanı sayfa zemini, yani 10.31:1; WCAG 1.4.11 göstergenin
bitişik renklerden birine karşı eşiği geçmesini ister, iç ve dış yanın ikisini birden
değil. Birincisinin kökü zaten açık bir madde: 390px'te kor sahnesinin parıltısı footer
şeridinin altında toplanıyor (Task 15 Y1, sahibinin kararı bekliyor). Aynı karar bu
halkayı da düzeltir.

**Fareyle tıklayanda çıkmıyor.** Çekmece fare tıklamasıyla açıldığında odak programatik
olarak ilk linke gidiyor ve o durakta `outline: none 0px` ölçüldü; sonraki Tab'da halka
beliriyor. `:focus-visible` sözleşmesi yerinde.

**Azaltılmış hareket.** `prefers-reduced-motion: reduce` ile üç rotada canlı animasyon 0,
canlı geçiş 0, ve altı durağın altısında halka `solid 2px rgb(250,170,31)` offset 3px.
Halka bir geçiş değil kalıcı bir çerçeve, o yüzden `animasyonlar.css`'in
`animation:none/transition:none` bloğundan etkilenmiyor. `styles/odak.test.ts` bu
sözleşmeyi kilitliyor.

## 3. Dil anahtarı

**Önce.** Yükseklik 44px'ti ama genişlik 19-20px: 84 hedef türünün en darı, ve WCAG 2.5.8
AA'nın 24px tabanının da altında.

| Genişlik | Kutu | Gerçek isabet (önce) | Gerçek isabet (sonra) | Örnek |
|---|---|---|---|---|
| 390 | 18-19 x 44 | **19/20** x 45 | **45/46** x 45 | 20 |
| 1440 | 18-19 x 44 | **20** x 44 | **46** x 44 | 20 |

**Ne değişti.** `DilAnahtari.module.css`, `.pasif`e `position:relative` ve
`left:-13px; right:-13px; height:44px` taşıyan görünmez `::before`.

**Neden 13px güvenli.** Anahtarda her seferinde **tek** bağlantı var: geçerli dil
`aria-current` taşıyan bir `<span>`, `href`i yok, yani hedef değil. Genişleyen hedefin
komşusu bir hedef değil. 390px'te ölçülen paylar (EN bağlantısı, `/` rotası):

| Kenar | İsabet sınırı | Komşu | Pay |
|---|---|---|---|
| sol | 265.4 | `.aktif` "TR" kutusu 239.2-257.6 | **7.8px** |
| sağ | 310.9 | hamburger 328-372 | **17.1px** |

Ayırıcı glifi (`/`, `aria-hidden`) hedefin içinde kalıyor: dekoratif ve dil anahtarının
kendi parçası, ona dokunmanın dili değiştirmesi yanlış bir sonuç değil. Görünen "TR"
metnine dokunulmuyor, 7.8px pay ölçüldü.

## 4. Footer sayfa bağlantıları

**Önce ve sonra.**

| Genişlik | Kutu | İsabet (önce) | İsabet (sonra) | Örnek |
|---|---|---|---|---|
| 390 | 36-68 x 15 | **38-69** x 26-27 | **44-69** x 26-27.5 | 12 |
| 1440 | 36-68 x 15 | **37-69** x 26-27 | **45-69** x 26-27.5 | 12 |

**Ne değişti.** `AltBilgi.module.css`, `.sayfaLinki`: `min-width: 44px` (yatay eksen) ve
`::before` yüksekliği 26px > 26.5px (dikey eksende üst üste binmeyen azami değer).

**Yatay eksen kapandı.** Kolonun kendi genişliğini en uzun satır belirliyor (68px), 44px
onun altında; metin sola yaslı kaldığı için görünen hiçbir şey kımıldamıyor. 42 karenin
sıfır farkı bunu doğruluyor.

**Dikey eksen kapanamıyor, sebebi ölçüldü.** Kolonun satır adımı altı rota/genişlik
kombinasyonunun altısında da birebir **26.5px** (`.kolonSik` gap 12px + 14.5px satır):

| Rota @ genişlik | Adım |
|---|---|
| `/hikaye/` @390, @1440 | 26.5px |
| `/konum/` @390, @1440 | 26.5px |
| `/en/hikaye/` @390, @1440 | 26.5px |

26.5px'lik bir adıma sığan, üst üste binmeyen üç hedefin azami yüksekliği adımın
kendisidir. Adımdan yüksek bir `::before` komşu satırın üstüne biner ve **çakışan hedef
kısa hedeften kötüdür**: kısa hedef görünür biçimde başarısız olur, çakışan hedef
başarılı olur ama yanlış sayfaya götürür. Aynı gerekçe `.iletisimSatiri`'nde (fix round 3)
zaten kayıtlı.

**Çift çift kesişim, kapanış kontrolü.** Üç rota x iki genişlik x üç bağlantıda, her
hedefin gerçek isabet alanı 0.5px adımla tarandı ve iki soru soruldu: (a) hedefin kendi
görünür kutusundaki bir noktayı başka bir hedef sahipleniyor mu, (b) hedefin isabet alanı
başka bir hedefin görünür kutusuna giriyor mu.

| Kontrol | Önce | Sonra |
|---|---|---|
| Kutusunu başka hedefe kaptıran footer bağlantısı | 0 | **0** |
| İsabet alanı başka hedefin kutusuna taşan footer bağlantısı | 0 | **0** |

**Kalan.** 44px'e ulaşmanın tek yolu `.kolonSik` gap'ini 12px'ten 29.5px'e çıkarmak, yani
üç footer varyantının görünen dikey ritmini değiştirmek. Bu görsel bir karar ve bu turun
kısıtı dışında; Task 16 G3/R2 aynı sonuca bağımsız olarak varmıştı. Sahibine soruluyor
(Açık 1).

## 5. Atlanan blok bağlantısı ve `<main>` kimliği (Task 15 Y2)

**Önce.** On rotada `document.querySelector('main').id` boş. İlk Tab durağı her rotada
`UstBar.marka`; klavye kullanıcısı içeriğe ulaşmak için barın hedeflerini her sayfada
yeniden geçiyor.

**Sonra.** `Kabuk.tsx` `<main id="icerik" tabIndex={-1}>` basıyor ve kabuğun ilk çocuğu
olarak bir atlama bağlantısı geliyor. Metin sözlükten: `ortak.erisim.icerigeAtla`,
TR "İçeriğe atla", EN "Skip to content". Arayüz metni, pazarlama metni değil.

| Ölçüm | Önce | Sonra |
|---|---|---|
| İlk Tab durağı | `UstBar.marka` "Ciğerci Bozo" (6/6 probe) | `Kabuk.atla` (6/6 probe) |
| İlk Tab'da görünür mü | yok | evet, kutu 122x44 (TR) / 151x44 (EN) @12,12 |
| Enter sonrası | yok | `location.hash = #icerik` |
| Enter'dan sonraki Tab | yok | `/` ve `/menu/`: "Yol tarifi al"; `/en/hikaye/`: "See the menu" |

Yani bağlantı gerçekten çalışıyor: sonraki durak `<main>`in içindeki ilk kontrol, üst
barın hedefleri atlanıyor. Hedef kutusu 44px yüksekliğinde ve odak halkasını alıyor.

`tabIndex={-1}` gereksiz görünebilir ama değil: onsuz Safari fragman bağlantısında sıralı
odak başlangıcını taşımaz, bağlantı kaydırır ama sonraki Tab yine bara döner.
`main:focus-visible { outline: none }` bunun bedelini kapatıyor: `<main>` bir kontrol
değil, tam genişlikteki kutusunun etrafındaki halka barın altında kalır ve bilgi taşımaz;
sinyal, sonraki Tab'ın içeriğe inmesi.

**404 kapsam dışı, bilinçli.** `HataSayfasi` kabuk taşımıyor (üst bar ve footer yok) ve
iki odaklanabilir öğesi var; atlanacak blok yok.

## 6. Çekmecenin diyalog adı (Task 15 Y3)

| Rota | Önce | Sonra |
|---|---|---|
| `/` | `null` | `"Gezinme çekmecesi"` |
| `/menu/` | `null` | `"Gezinme çekmecesi"` |
| `/en/` | `null` | `"Navigation drawer"` |

Yeni sözlük anahtarı `ortak.erisim.gezinmeCekmecesi`. İçindeki `<nav>` zaten
`mobilGezinme` adını taşıyor; aynı adı ikinci kez vermek iç içe iki bölgeyi ayırt edilemez
kılardı. `content/icerik.test.ts` bu kuralı, mevcut `anaGezinme != mobilGezinme` testinin
yanına, üçüncü ad için de kilitliyor.

Çekmecenin geri kalan davranışı değişmedi, üç rotada yeniden ölçüldü: odak ilk linke
gidiyor, 8 sekmede 0 kaçak, Escape kapatıyor, odak hamburgere dönüyor.

---

## Kapılar

| Kapı | Sonuç |
|---|---|
| `npm run typecheck` | temiz |
| `npm test` | **72 test, 0 hata** (önce 68; +4) |
| `npm run build` | temiz, 14 sayfa |
| 42 kare piksel karşılaştırması | 0 fark |

Eklenen dört test:

- `content/icerik.test.ts` > `erisim_cekmeceAdiGezinmeAdlarindanFarkli`: diyalog adı iki
  gezinme landmarkının adıyla çakışamaz.
- `styles/odak.test.ts` > `reset_odakHalkasiTanimliVeTokendanGelir`: kural var ve rengi
  token'dan geliyor, ham `#hex`/`rgba()` değil.
- `styles/odak.test.ts` > `azaltilmisHareket_odakHalkasinaDokunmaz`: hiçbir
  `prefers-reduced-motion` bloğu `outline`a el atamaz.
- `styles/odak.test.ts` > `derlemeCiktisi_odakHalkasiVar`: derlenmiş CSS'te kural duruyor.

Son testin gerekçesi `styles/animasyon.test.ts` ile aynı: odak halkasının yokluğu
sessizdir. Derleme geçer, konsol susar, ekran görüntüsü kusursuz görünür; eksiklik yalnız
klavyeyle gezen birine görünür. Bu turun kapattığı hatanın on rotada aylarca yaşamasının
sebebi tam olarak buydu.

## Değişen dosyalar

| Dosya | Ne |
|---|---|
| `styles/reset.css` | odak halkası, 3 kural |
| `components/layout/UstBar.module.css` | `.marka` 44px `::before` |
| `components/layout/DilAnahtari.module.css` | `.pasif` 44px `::before`, yatayda -13px |
| `components/layout/AltBilgi.module.css` | `.sayfaLinki` `min-width:44px`, `::before` 26>26.5px |
| `components/sayfa/Kabuk.tsx` | atlama bağlantısı, `<main id tabIndex>` |
| `components/sayfa/Kabuk.module.css` | `.atla` |
| `components/layout/Cekmece.tsx` | `aria-label` |
| `content/tr/ortak.ts`, `content/en/ortak.ts` | `icerigeAtla`, `gezinmeCekmecesi` |
| `content/icerik.test.ts`, `styles/odak.test.ts` | dört test |
| `docs/PARITE.md` | bölüm 5'in kapanan satırları |

Yeni token eklenmedi. Beş tasarım dosyasında karşılığı olmayan bir değer gerekmedi:
halka `--tangerine`, atlama bağlantısı `--komur` + `--krem` + `--cizgi-guclu`, hepsi
mevcut.

---

## Sahibine sorulacaklar

1. **Footer sayfa bağlantılarının 26.5px'i.** Yatay eksen kapandı, dikey eksen kolonun
   12px'lik satır boşluğuna kilitli. 44px için gap 29.5px olmalı, bu üç footer
   varyantının görünen ritmini değiştirir. Task 16 G3 "bugün kapatılsın, tetik telefon
   verisinin gelmesi" diyor. Onaylanırsa madde kayda geçer ve iş o güne kalır.
2. **Masaüstü nav bağlantıları 39-42px genişlik** (5 tür, yalnız 1440px). Yükseklikleri
   44px, genişliklerine 2-5px kalıyor. Bu turun altı maddesinde yoktu, dokunulmadı. Aynı
   `::before` tekniğiyle kapanır; nav boşluğu 28-30px olduğu için yer var.
3. **`BeadRay` boncukları 9-22px.** `aria-hidden` ve `tabIndex={-1}`, kayıtlı dekoratif
   karar; ama `a[href]` oldukları için fare/dokunma hedefi olmaya devam ediyorlar. Kayıt
   yerinde mi, yoksa `href` de mi kalkmalı?
4. **Sabit barın altında kalan hedefler.** Marka 44px'e çıkınca, sayfa dibine kaydırılmış
   `/` rotasında (1440px) barın altında kalan bir bölüm butonunun kutusunun markaya ait
   oranı %33'ten %50'ye çıktı. Buton başka kaydırma konumlarında tam alanına sahip.
   Kabul mü, yoksa markanın `::before`ı 44px yerine bar satırının kendi yüksekliğiyle mi
   sınırlansın?
5. **390px'te footer halkası 2.59:1.** Kökü Task 15 Y1 ile aynı: dar ekranda kor
   sahnesinin parıltısı telif şeridinin altında toplanıyor. O madde için verilecek karar
   (metni bir kademe açmak ya da şeridin altına opak zemin) bu halkayı da düzeltir.
6. **Paket şeridi, bugün değil yarın.** `PaketSeridi` pumpkin zeminli (#E96112) ve
   tangerine halka orada 1.76:1. Bugün bir hata yok: şeridin üç butonu telefon ve
   WhatsApp `null` olduğu için `.pasif` `<span>`, yani odaklanabilir değil. Veri geldiği
   gün gerçek bağlantı olacaklar ve halka görünmez olacak. Tek satırlık çözüm hazır:
   o şeride kapsamlı `outline-color: var(--komur)` (pumpkin üstünde 5.33:1). Bugün
   eklenmedi, çünkü bugün tetiklenmeyen bir kural ölü koddur.
7. **Ölçerken bulundu, bu turun kapsamı dışında.** `UstBar.module.css`'in
   `@media (max-width:780px) .sagGrup { gap: 14px }` kuralı hiç uygulanmıyor:
   `.anaVaryant .sagGrup { gap: 30px }` ve `.icVaryant .sagGrup { gap: 28px }` özgüllükte
   onu yeniyor (0-2-0 > 0-1-0). 390px'te ölçülen değer 30px / 28px. Görsel bir sadakat
   sapması; bu turda düzeltilmedi çünkü görünen tasarımı değiştirir.

## Bu turda ölçmediklerim

- **Yalnız Chromium.** WebKit ve Firefox açılmadı. Odak halkası tam da bu iki motorda
  varsayılanın yetersiz kaldığı yerde gerekiyordu; kural artık motordan bağımsız
  (`outline: 2px solid`), ama Safari'de doğrulanmadı. `tabIndex={-1}` kararı da Safari'nin
  bilinen davranışına dayanıyor, ölçüme değil.
- **Yalnız iki genişlik.** 320px, 768px ve 781-1100px bandı ölçülmedi.
- Ekran okuyucu ile gerçek duyuru testi yapılmadı; adlar DOM'dan doğrulandı.
