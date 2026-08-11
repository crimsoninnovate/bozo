# Toparlama turu raporu

Tarih: 12 Ağustos 2026. Branch `feat/site-kurulumu`.

On görev boyunca ajanlar paylaşılan dosyalara dokunmak yerine ölçüp raporlamıştı. Bu tur o
birikmiş ölçümleri uyguladı. Yeni keşif yok; her madde uygulanmadan önce ölçümü kaynağa
karşı yeniden doğrulandı.

**On dokuz maddenin sonucu:** on dördü uygulandı, üçü mobil turuna taşınmıştı (kapsam dışı),
ikisi ölçüm sonucunda "düzeltilecek bir şey yok" çıktı ve kayıtla kapatıldı.

Doğrulama: kendi statik sunucum (`serve out -l 4317`) ve kendi tarayıcı sekmem; her
`evaluate` çağrısı `location.href`'i kendi kontrol edip yanlış sekmede `HATA` dönecek
biçimde yazıldı.

---

## 0. Ölçüm yöntemi ve `fullPage` tuzağı

Brief'in uyarısına uyuldu: kontrast ölçümünde `fullPage` yakalama **kullanılmadı**. Kullanılan
yöntem, madde 2'nin bütün sayılarının kaynağı:

1. Hedef metnin rengi geçici bir `<style>` ile `transparent` yapılır.
2. Sayfa ölçülecek kaydırma konumuna getirilir, `getBoundingClientRect()` ile kutular alınır.
3. **Viewport** yakalaması alınır (`fullPage: false`), böylece `position: fixed` kor sahnesi
   belge boyuna gerilmez.
4. PNG Node'da açılır (`zlib.inflateSync` + PNG filtre çözümü, `scratchpad/olc.mjs`), kutunun
   **her satırının** ortalaması ayrı ayrı hesaplanır.
5. En kötü satır (metni en az ayıran zemin) seçilir, krem kendi alfasıyla o zemine bindirilir,
   WCAG oranı hesaplanır.

Satır satır bakmak önemli: kutu ortalaması alınsaydı parlak bandın üstünden geçen tek satır
sönük komşularının içinde kaybolurdu.

Ayrıca bir ölçüm artefaktı kaydedilmeye değer: kutunun üstü sabit üst barın altına kaydığında
o satırların ortalaması bardaki krem marka kelimesini içeriyor ve sahte bir parlak zemin
veriyor (`[84,79,72]`, `.78` ile 4.84:1). O satırlar okunabilir metin değil, gizlenmiş metin;
ölçümden çıkarıldı.

---

## Madde madde

| # | Madde | Sonuç |
|---|---|---|
| 1 | `Buton` ikonlu dolgu adımı | **uygulandı** |
| 2 | `GizlilikSayfasi` `.86` -> `.78` | **uygulandı** (yeniden ölçüldü) |
| 3 | `ImlecKoru` bağlanması | mobil turunda, kapsam dışı |
| 4 | Token birleştirme | mobil turunda, kapsam dışı |
| 5 | `IYILESTIRMELER.md` birikmiş kayıtlar | **uygulandı**, 14 satır eklendi, 2 satır düzeltildi |
| 6 | Favicon | **uygulanmadı**, varlık yok: `DEVAM.md`'ye eksik varlık olarak yazıldı |
| 7 | `/_not-found/` yinelenen rota | **uygulanmadı**, Next'in beklenen çıktısı: dokümante edildi |
| 8 | Mobil kor sahnesi | mobil turunda, kapsam dışı |
| 9 | Gece şeridi açıkken çapa payı | **uygulandı**, tarayıcıda şerit gerçekten basılıyken doğrulandı |
| 10 | `KISITLAR.md` 16px kuralı | **uygulandı**, 3. katman 13px'e genişletildi ve üyeleri sayıldı |
| 11 | `Buton`'un iki kaynaksız değeri | **uygulandı**, ikisi de kaldırıldı |
| 12 | Konum hero buton adımı | **kayıtlı sapma**, yeni boy adımı açılmadı (ölçüm aşağıda) |
| 13 | Mobil üst barın saç çizgisi | **uygulandı**, değer ham (tokens.css mobil turunda) |
| 14 | Çekmece noktasının nabzı | **kaydedildi**, kaldırılmadı (sayım aşağıda) |
| 15 | İki eskimiş yorum, bir yanlış gerekçe | **uygulandı**, üçü de düzeltildi |
| 16 | Footer İngilizce sayfalarda TR cadde adı | **uygulandı** + yetim anahtar taraması |
| 17 | `HataSayfasi` etiket satırı kopyası | **uygulandı**, kutusu piksel piksel aynı |
| 18 | Ham `rgba()` yerine token | **kısmen**: 8 yer bağlandı, 4 yer mobil turunun dosyalarında |
| 19 | `GizlilikSayfasi` bayat gerekçe | **uygulandı**, madde 2 ile birlikte |

---

## 16. Footer İngilizce sayfalarda Türkçe cadde adını basıyordu (B1)

Önce gelmesi istendi, önce yapıldı.

**Doğrulandı.** Derlenmiş çıktıda, düzeltme öncesi:

| Dosya | "Naci Talat Street" | "Naci Talat Caddesi" |
|---|---|---|
| `out/en/index.html` | 14 | 4 |
| `out/en/konum/index.html` | 10 | 4 |
| `out/en/hikaye/index.html` | **0** | 4 |
| `out/en/menu/index.html` | 2 | 2 |
| `out/en/gizlilik/index.html` | **0** | 4 |

**Düzeltme.** `AltBilgiTam.tsx` ve `AltBilgiSayfalar.tsx` görünen adres satırını artık
sözlükten okuyor (`ortak.satirlar.adresCadde` / `adresBina`). `isletme.cadde` dil-nötr
kalır ve yalnız `lib/site.ts` > `yolTarifiUrl()` ile `lib/jsonld.ts` > `streetAddress`
tarafından kullanılır. `binaNo` null kontrolü korundu: bilinmeyen bina numarası hâlâ satır
basmaz, yalnız metnin kaynağı değişti.

**Sonra:**

| Dosya | "Naci Talat Street" | "Naci Talat Caddesi" |
|---|---|---|
| `out/en/index.html` | 16 | 2 |
| `out/en/konum/index.html` | 12 | 2 |
| `out/en/hikaye/index.html` | 2 | 2 |
| `out/en/menu/index.html` | 2 | 2 |
| `out/en/gizlilik/index.html` | 2 | 2 |

Kalan iki "Caddesi", her EN sayfada aynı JSON-LD bloğunun iki kopyası (script etiketi ve RSC
yükü). Yapısal veri dil-nötr, doğru davranış.

Tarayıcı doğrulaması, on rotanın onunda footer adres bloğu:
`/`, `/menu/`, `/hikaye/`, `/konum/`, `/gizlilik/` -> `Naci Talat Caddesi / Şht. Özdemir Apt
No:4 / Girne / KKTC`; beş EN karşılığı -> `Naci Talat Street / Şht. Özdemir Apt No:4 /
Kyrenia / TRNC`.

### Yetim anahtar taraması (brief'in istediği üçüncü örnek kontrolü)

Sözlüğün **197 yaprağı** tek tek tarandı (`content/tr` üzerinden, TR/EN paritesi tip bağıyla
zaten zorunlu). Yöntem: her yaprak anahtarı için `app/`, `components/`, `lib/`, `content/`
altında `[.\['"]<anahtar>\b` araması, sözlüğün kendi tanım satırları hariç.

**Beş anahtarın çağıranı yoktu.** İkisi bu maddeyle bağlandı:

| Anahtar | Değer (TR) | Durum |
|---|---|---|
| `ortak.satirlar.adresCadde` | `Naci Talat Caddesi` | **bağlandı** (bu madde) |
| `ortak.satirlar.adresBina` | `Şht. Özdemir Apt No:4` | **bağlandı** (bu madde) |
| `ortak.marka.kisa` | `Bozo` | çağıransız kaldı |
| `ortak.cta.whatsapptanYaz` | `WhatsApp'tan yaz` | çağıransız kaldı |
| `ortak.satirlar.saatlerUzun` | `Her gün 10:00'dan ertesi sabah 05:00'e kadar` | çağıransız kaldı |

Kalan üçü için **uydurma kullanım yaratılmadı**. `marka.kisa` ve `whatsapptanYaz`
`metin-envanteri.json`'dan gelmiş ve beş `.dc.html`'de hiç geçmiyor. `saatlerUzun` daha ince
bir durum: aynı cümle `ana.konum.saatNotu` ve `sayfaMeta.konum.aciklama` içinde ayrıca elle
yazılı, yani üç kopya var ve hiçbiri diğerini kullanmıyor. Üçü `IYILESTIRMELER.md`'ye
sahibin kararına bırakıldı (silinsin mi, bağlansın mı).

Bir yanlış pozitif kaydedilmeye değer: ilk tarama `adresBina`'yı "kullanılıyor" saydı, çünkü
`lib/jsonld.test.ts:45`'teki test **adının** içinde `adresBinaNoIleBirlesir` geçiyor. Kelime
sınırı ve nokta öneki eklenince ortaya çıktı. Anahtar adını çıplak `grep`'lemek bu tarama
için yeterli değil.

---

## 1. `Buton` ikonlu dolgu adımı

**Ölçüm önce yapıldı.** Beş tasarım dosyasındaki **bütün** buton dolguları çıkarıldı
(`cursor:pointer` filtresine güvenilmedi, `font:600 ... Inter` taşıyan dolgulu her etiket
tarandı, `<a>` ile yazılmış Hikaye butonları dahil). Yirmi buton:

| Yer | Tür | İkon | Dolgu | Punto |
|---|---|---|---|---|
| `Ana:61` | dolu (üst bar) | yok | `13px 24px` | 14.5px |
| `Ana:112` | dolu | yok | `20px 34px` | 16.5px |
| `Ana:113` | çerçeveli | yok | `19px 33px` | 16.5px |
| `Ana:318` | dolu | yok | `18px 30px` | 16px |
| `Ana:319` | çerçeveli | yok | `17px 29px` | 16px |
| `Ana:320` | çerçeveli | yok | `17px 29px` | 16px |
| `Ana:345` | koyu | yok | `18px 30px` | 16px |
| **`Ana:346`** | **koyu çerçeveli** | **VAR** | **`17px 26px`** | 16px |
| `Ana:347` | koyu çerçeveli | yok | `17px 29px` | 16px |
| `Hikaye:56` | dolu (üst bar) | yok | `13px 24px` | 14.5px |
| `Hikaye:128` | dolu | yok | `18px 30px` | 16px |
| `Hikaye:129` | çerçeveli | yok | `17px 29px` | 16px |
| `Konum:56` | dolu (üst bar) | yok | `13px 24px` | 14.5px |
| `Konum:80` | dolu | yok | `19px 32px` | 16px |
| **`Konum:81`** | **çerçeveli** | **VAR** | **`18px 28px`** | 16px |
| `Konum:161` | koyu | yok | `18px 30px` | 16px |
| `Konum:162` | koyu çerçeveli | yok | `17px 29px` | 16px |
| `Menu:58` | dolu (üst bar) | yok | `13px 24px` | 14.5px |
| `Menu:289` | dolu | yok | `17px 28px` | 15.5px |
| `Menu:290` | çerçeveli | yok | `16px 27px` | 15.5px |

**İkonlu buton sayısı: iki. İkisi de kuralı izliyor, istisna yok.**

`Ana:346` / `Ana:347` doğrudan kanıt: aynı satırda, aynı zeminde, aynı kenarlıkta, aynı
puntoda, biri ikonlu biri değil. Fark tam olarak yatayda **3px**, dikeyde **0**.

`Konum:80` / `Konum:81` dolaylı kanıt ve brief'in tablosunda bir düzeltme gerektiriyor:
**brief `18px 31px` değerini tasarımdan alınmış gibi yazıyor, oysa o değer tasarımda hiç
geçmiyor.** Türetilmiş bir değer. Türetme geçerli, çünkü "çerçeveli = dolu eksi 1px/1px"
kuralı beş dosyada beş kez doğrulanıyor:

| Punto | Dolu | Çerçeveli | Fark |
|---|---|---|---|
| 16.5px | `Ana:112` 20/34 | `Ana:113` 19/33 | -1 / -1 |
| 16px | `Ana:318` 18/30 | `Ana:319` 17/29 | -1 / -1 |
| 16px | `Ana:345` 18/30 | `Ana:347` 17/29 | -1 / -1 |
| 16px | `Hikaye:128` 18/30 | `Hikaye:129` 17/29 | -1 / -1 |
| 16px | `Konum:161` 18/30 | `Konum:162` 17/29 | -1 / -1 |
| 15.5px | `Menu:289` 17/28 | `Menu:290` 16/27 | -1 / -1 |

Yani `Konum:80` = `19/32` iken o ölçekteki ikonsuz çerçeveli `18/31` olurdu; gerçek ikonlu
değer `18/28`, yani yine tam **-3px yatay, 0 dikey**. Sonuç brief'le aynı, dayanağı bir adım
daha uzun. Rapora bunu yazdım ki bir sonraki okuyan `18px 31px`'i tasarımda aramasın.

**Uygulama.** Boy adımları artık dolgu yerine iki özel değişken yazıyor
(`--buton-dikey` / `--buton-yatay`), `.taban` dolguyu
`calc(var(--buton-yatay) - var(--buton-ikon-payi, 0px))` ile kuruyor ve tek bir kural
`.taban:has(svg) { --buton-ikon-payi: 3px }` adımı veriyor. Açık bir `ikonlu` prop'u yerine
`:has(svg)` seçildi: kural tasarımda "ikon varsa" biçiminde tanımlı, çağrı yerinde
unutulamaz ve `Buton`'un API yüzeyi büyümüyor. Kod tabanındaki bütün `Buton` çocukları
tarandı; SVG taşıyan yalnız iki çağrı yeri var ve ikisinde de SVG baştaki ikon.

**Tarayıcı doğrulaması, 1440x900** (hesaplanmış stiller, ana sayfa):

| Buton | Tasarım | Önce | Sonra |
|---|---|---|---|
| Üst bar CTA (`Ana:61`) | 13/24 | 13/24 | 13/24 |
| Hero birincil (`Ana:112`) | 20/34 | 20/34 | 20/34 |
| Hero hayalet (`Ana:113`) | 19/33 | 19/33 | 19/33 |
| Konum birincil (`Ana:318`) | 18/30 | 18/30 | 18/30 |
| Konum telefon (`Ana:319`) | 17/29 | 17/29 | 17/29 |
| Konum WhatsApp (`Ana:320`) | 17/29 | 17/29 | 17/29 |
| Paket sipariş (`Ana:345`) | 18/30 | 18/30 | 18/30 |
| **Paket WhatsApp (`Ana:346`)** | **17/26** | 17/29 | **17/26** |
| Paket telefon (`Ana:347`) | 17/29 | 17/29 | 17/29 |

Menü sayfası (`13/24`, `17/28`, `16/27`) ve Hikaye (`13/24`, `18/30`, `17/29`) da tasarımla
birebir. Ana sayfanın dokuz butonunun dokuzu artık tasarımın değerinde.

---

## 11. `Buton`'un iki kaynaksız değeri (F6)

**`border-radius: 2px` kaldırıldı.** Yukarıdaki yirmi butonun hiçbiri `border-radius`
bildirmiyor (tarama `br=-` döndü, yirmisinde de). Marka zarfı 0-3px olduğu için sonuç zaten
zarfın içinde. `Cip`'in 2px'i tam bu kanıt standardıyla kaldırılmıştı
(`IYILESTIRMELER.md` 21 ve 32. satırlar); aynı standart uygulandı. Tarayıcıda doğrulandı:
her buton `border-radius: 0px`.

**`letter-spacing: -0.005em` kaldırıldı.** Handoff'ta hiçbir Inter buton dizisi
`letter-spacing` taşımıyor. Tarayıcıda doğrulandı: `letter-spacing: normal`.

Aynı dosyada gölge/kenarlık rampasını anlatan 14 satırlık yorum bloğu 3 satıra indirildi
(`CLAUDE.md` > Comments). Ölçümün tamamı `IYILESTIRMELER.md`'ye taşındı, silinmedi.

---

## 12. Konum hero butonları hiçbir `boy` adımına oturmuyor (F5)

**Karar: kayıtlı sapma, yeni boy adımı açılmadı.**

Brief "ölçün: `19/32` ve `18/28` tek örnek mi yoksa bir aile mi" dedi. Yukarıdaki yirmi
butonluk tablo cevabı veriyor: **ikisi de tek örnek.** Punto aileleri şöyle dağılıyor:

| Punto | Dolu dolgu | Kaç kez |
|---|---|---|
| 16.5px | `20/34` | 1 |
| 16px | `18/30` | 4 |
| **16px** | **`19/32`** | **1 (yalnız Konum hero'su)** |
| 15.5px | `17/28` | 1 |
| 14.5px | `13/24` | 3 |

Konum hero'su 16px punto taşıyor ama 16px ailesinin dolgusundan bir adım büyük, 16.5px
ailesinden bir adım küçük: merdivende karşılığı olmayan ara bir ölçek. Tek örnek için
beşinci bir `boy` adımı açmak üç sayfayı ilgilendiren bir API büyümesi olurdu; kaydetmek
daha ucuz. `IYILESTIRMELER.md`'nin ilgili satırı bu ölçümle güncellendi.

Kalan sapma, madde 1'den sonra:

| | Tasarım | Uygulanan | Fark |
|---|---|---|---|
| birincil | `19px 32px` | `lg` `18px 30px` | -1 / -2 |
| hayalet (ikonlu) | `18px 28px` | `cerceveli.lg` + ikon `17px 26px` | -1 / -2 |

İkon adımı hayaletteki farkı `-1/+1`'den `-1/-2`'ye çevirdi: mutlak büyüklük aynı kaldı,
işaret değişti. Yani madde 1 bu sapmayı kapatmıyor, kaydırıyor; brief zaten bunu söylüyordu.

---

## 2 ve 19. `GizlilikSayfasi` gövde metni ve bayat gerekçe

**Ölçüm yeniden yapıldı, `.78` geçiyor, tasarımın değerine dönüldü.**

Task 14'ün ölçümü (krem `.78` ile 4.34:1) doğruydu ama **parlak sahneye karşı** alınmıştı.
`4f8b085` iç sayfalara kendi sönük sahnesini verdi (kor `.55`, çekirdek `.26`). Bugünkü
ölçüm, madde 0'daki yöntemle, sahnenin **en parlak bandında**:

| Genişlik | Kaydırma | En kötü zemin (sRGB) | krem `.78` | krem `.86` |
|---|---|---|---|---|
| 1440x900 | 0 | `[48, 30, 21]` | **8.51:1** | 10.12:1 |
| 1440x900 | 0 | `[25, 16, 12]` | 9.68:1 | 11.68:1 |
| 1440x900 | 506 (dip) | `[12, 11, 10]` | 10.00:1 | 12.12:1 |
| 390x844 | 0 | `[68, 48, 29]` | **6.97:1** | 8.11:1 |
| 390x844 | 520 | `[11, 9, 8]` | 10.10:1 | 12.24:1 |

En kötü gerçek okuma koşulu **6.97:1**, WCAG AA'nın istediği 4.5:1'in çok üstünde. `.spot` ve
`.bolumMetin` `--krem-78`'e döndü, `IYILESTIRMELER.md` kaydı kapatıldı, `DEVAM.md`'nin açık
maddesi kapandı.

Aynı hamlede modüldeki 17 satırlık kontrast gerekçe bloğu silindi (madde 19). O blok
"kor tam şiddette yanıyor" diyordu; `4f8b085`'ten beri yanlıştı ve kendini "ölçüldü" diye
sunuyordu, yani bir sonraki okuyanı yanıltmaya en yatkın yorum türüydü.

**`HataSayfasi` için aynı soru soruldu, cevap: değişiklik yok.** `.metin` zaten `--krem-80`,
ve `.80` tasarımın kendi değeri (`Ana:225`), uydurma bir yükseltme değil. Ölçüldü:

| Genişlik | Öğe | En kötü zemin | Oran |
|---|---|---|---|
| 1440x900 | `.metin` (`.80`) | `[13, 11, 10]` | 10.54:1 |
| 1440x900 | kicker (`.74`) | `[13, 11, 10]` | ~9.9:1 |
| 390x844 | `.metin` (`.80`) | `[11, 9, 8]` | 10.58:1 |

404 dikey ortalı olduğu için sahnenin dip bandına hâlâ girmiyor; sahne değişikliği bu sayfayı
etkilemedi.

---

## 9. Gece şeridi açıkken çapa payı yetmiyordu

**Uygulandı ve şerit gerçekten basılıyken ölçüldü.** Ölçüm 02:17 Girne saatinde yapıldı, yani
`GeceSeridi`'nin görünür olduğu 01:00-05:00 penceresinin içinde; simülasyon gerekmedi.

Çözüm sayfalara dokunmadan `lib/kabuk.ts` / `Kabuk.module.css` katmanında kaldı.
`GeceSeridi` artık `data-gece-serit` taşıyor (tasarımın kendi öznitelik adı) ve
`Kabuk.module.css` payı ona göre büyütüyor:

    body:has([data-gece-serit]) .icSayfa [id] { scroll-margin-top: 125px; }

JS gerekmedi: pay tamamen CSS'te ve şerit render edilir edilmez geçerli oluyor.

**Ölçüm, 1440x900, şerit basılıyken:**

| | Önce | Sonra |
|---|---|---|
| Şerit yüksekliği | 28.5px | 28.5px |
| İç sayfa barı | 107px (78 + 28.5) | 107px |
| Çapa payı | 96px | **125px** |
| `#harita` üstü, kaydırma sonrası | barın 11px altında (gizli) | barın **18.7px** altında |
| `#ocaktan` üstü, kaydırma sonrası | barın 11px altında (gizli) | barın **18.4px** altında |

125px seçimi keyfi değil: 96px'in kendi gerekçesi "78px bar + 18px görünür nefes payı"
(`Kabuk.module.css`'in mevcut yorumu). Aynı nefes payı korundu, yalnız barın gerçek
yüksekliği değişti. 780px altında bar 58px, şerit ~27px, toplam 85px; 125px orada da 40px
nefes bırakıyor, yani mobilde de bozulma yok (önceki 96px 38px bırakıyordu).

Tasarımın kendi kaydırma betiği de sabit 96 kullanıyor, yani şeridi hesaba katmamış. Bu bir
tasarım gözden kaçması, `IYILESTIRMELER.md`'ye öyle kaydedildi.

---

## 10. `KISITLAR.md`'nin 16px kuralı iki metni kapsamıyordu

**Kural tamamlandı, metinler büyütülmedi.**

Doğrulandı: iki metin de gerçek proze ve `13px/1.6`.

| Metin | Kod | Tasarım |
|---|---|---|
| Gece menüsü not gövdesi | `menu/Acilis.module.css:64` | `Menu:81` |
| Yapay zeka görsel notu | `menu/CekimListesi.module.css:46` | `Menu:279` |

3. katmanın bandı `14.5-15.5px`'ten **`13-15.5px`**'e genişletildi ve **üyeleri tek tek
sayıldı**. Sayarken kuralın ikinci bir eksiği de çıktı: eski band kendi listesindeki
"Konum contact sub-lines at 14px/1.4" satırını da kapsamıyordu, yani band etiketi kendi
üyeleriyle de tutarsızdı. Yeni hali altı üyeyi tasarım satırıyla birlikte tablo halinde
veriyor ve kapanış cümlesi 16px altındaki geri kalan her şeyi açıkça 2. katmana koyuyor.

Kodda hiçbir punto değiştirilmedi.

---

## 13. Mobil üst barın alt saç çizgisi (F7)

**Uygulandı, ham değerle.** `Mobil Prototip.dc.html:55` bara
`border-bottom:1px solid rgba(242,233,220,.09)` veriyor; port yüksekliği (58px) ve dolguyu
(`0 18px`) almış, kenarlığı atlamıştı.

`styles/tokens.css` mobil turunun elinde olduğu için token eklenmedi, değer ham yazıldı ve
yorumla işaretlendi. Tarayıcıda 390x844: `border-bottom: 1px solid rgba(242, 233, 220, 0.09)`,
satır yüksekliği hâlâ 58px (`box-sizing: border-box`, `reset.css:1`).

**Token sayımı, mobil turu için:** `.09` beş tasarım dosyasında **dört kez** geçiyor:
`Ana:381`, `Hikaye:157`, `Konum:188` (üç footer telif şeridi) ve `Mobil:55` (bu satır).
Kod tarafındaki dört çağrı yeri de ham. `IYILESTIRMELER.md`'nin ilgili öneri satırı bu
sayımla güncellendi.

---

## 14. Çekmece noktası tasarımda yanıp sönmüyor (F8)

**Karar: nabız korundu, sapma olarak kaydedildi.**

Brief "ya kaldırın ya kaydedin" dedi. Kaydetme seçildi, çünkü sayım tasarımın kendi içinde
tek istisna olduğunu gösteriyor. `Mobil Prototip.dc.html`'deki beş tangerine "açık" noktası:

| Satır | Ne | `dotPulse` |
|---|---|---|
| `Mobil:52` | gece şeridi noktası | var |
| `Mobil:74` | durum çipi noktası | var |
| `Mobil:242` | gece şeridi noktası (ikinci ekran) | var |
| `Mobil:264` | durum çipi noktası (ikinci ekran) | var |
| **`Mobil:209`** | **çekmece durum noktası** | **yok** |

Dördü bir, biri sıfır. Üstelik tam o blok için tasarımın kendi davranış referans dosyası zaten
bir tutarsızlık işaretlemiş (nokta kapalıyken de yanık kalıyordu) ve port o notu izleyip
noktayı `DurumCipi` ile aynı açık/kapalı davranışına bağlamıştı
(`IYILESTIRMELER.md` 56. satır). Nabız da aynı bileşenin aynı davranışının parçası; tek
istisnayı kopyalamak çekmecenin "açığız" noktasını aynadığı çipten görsel olarak ayırırdı.

Hareket azaltılmışta `styles/animasyonlar.css`'in `animation: none !important` kuralı
zaten durduruyor, yani erişilebilirlik tarafında yeni bir yük yok.

---

## 15. İki eskimiş yorum, bir yanlış gerekçe (F10 + ek)

**a) `Harita.module.css:15` pin satırı.** Doğrulandı, brief haklı:

| Kaynak | Ana Sayfa pini |
|---|---|
| `Ana:328` (tasarım) | `0 0 0 6px rgba(183,53,28,.22), 0 0 **30px** rgba(183,53,28,.85)` |
| `HaritaPlakasi.module.css:12` (yorum) | `16px, 0 0 0 6px/30px` -> doğru |
| `HaritaPlakasi.module.css:80` (kod) | `0 0 0 6px ..., 0 0 30px ...` -> doğru |
| `Harita.module.css:15` (yorum) | `16px, 0 0 0 6px + **32px**` -> **yanlış** |

**b) Aynı dosyanın 12. satırı.** Tablo satırı `yatay yol  top:56%, 16px yok/14px` biçiminde
bozuktu, okunmuyordu. Doğrusu: `Ana:325` `top:56%; height:14px`, `Konum:91` `top:54%;
height:16px`.

**Çözüm.** İki satır tek tek düzeltilmedi; 26 satırlık karşılaştırma tablosunun tamamı
dosyadan çıkarıldı ve yorum 5 satıra indi. Gerekçe: aynı tablo `HaritaPlakasi.module.css`'in
başında zaten **doğru** haliyle duruyor, iki kopya tam da bu bayatlığı üreten şey. `CLAUDE.md`
> Comments de gerekçenin `docs/surec/` altına gitmesini istiyor. Tablonun doğrulanmış hali,
kayıt olarak, aşağıda:

| Değer | Ana (`Ana:323-331`) | Konum (`Konum:89-101`) |
|---|---|---|
| zemin | `.55` (`--panel-yari`) | `.6` (`--panel-60`) |
| kenarlık | `1px .16` | `1px .16` (aynı) |
| yükseklik | `min-height:420px` | `clamp(420px,58vh,600px)` + `overflow:hidden` |
| ızgara adımı | `50px` | `52px` |
| yatay yol | `top:56%`, `14px` | `top:54%`, `16px` |
| dikey yol | tek: `44%`, `9px`, `.06` | iki: `20%`/`9px`/`.05` + `64%`/`7px`/`.045` |
| halka | `80px` @`46%`/`53%`, `.5` | `110px` @`42%`/`47%`, `.45` |
| pin | `16px`, `0 0 0 6px` + `30px` | `18px`, `0 0 0 7px` + `32px` |
| işaret etiketi | çerçevesiz düz metin | kenarlıklı kutu, iki ağırlıklı metin |
| cadde | `8%`/`59%`, `11.5px`, `.62` | `10%`/`57.5%`, `12px`, `.55` |
| alt not | `24/22`, `500 12.5/1.5`, `.68` | aynı |
| POI çipi | yok | üç çip |

**c) `IYILESTIRMELER.md` 49. satır, `DilAnahtari` pasif rengi.** Doğrulandı, brief haklı:
gerekçe yanlıştı, karar doğru.

| Dosya | Pasif dil rengi |
|---|---|
| `Ana:59` | `rgba(242,233,220,.58)` |
| `Hikaye:54` | `rgba(242,233,220,.58)` |
| `Konum:54` | `rgba(242,233,220,.58)` |
| `Menu:56` | `rgba(242,233,220,**.5**)` |

Yani "`.5` hiçbir kaynakta yok" cümlesi yanlıştı; `.5` bir kaynakta var. Ama `.58` dörtte üç
çoğunluk, dolayısıyla seçim savunulabilir. **Karar değiştirilmedi, gerekçe düzeltildi** ve
düzeltmenin kendisi tarihiyle satıra yazıldı.

---

## 17. `HataSayfasi` etiket satırının üçüncü kopyası (B2)

**Uygulandı.** `<EtiketSatiri className={stil.kicker}>` ile primitife bağlandı; modülde
yalnız `font-variant-numeric: tabular-nums` kaldı ("404" bir sayı), `.kickerKare` ve
`.kicker`ın kalan on satırı silindi. Yeni API gerekmedi: `EtiketSatiri` zaten `className`
alıyor ve `sayfa` varsayılan ölçeği tam olarak 404'ün istediği ölçek.

**Ölçüldü: görünüm değişmedi.** 1440x900'de kicker `<p>` kutusu, değişiklik öncesi ve
sonrası:

| | Önce | Sonra |
|---|---|---|
| Kutu | `694,309 52x15` | `694,309 52x15` |
| Renk | `rgba(242,233,220,.74)` | `rgba(242,233,220,.74)` |
| gap | `12px` | `12px` |
| `align-items` | `center` | `center` |
| Kare | `11x11`, radius `1px`, `#FAAA1F`, `aria-hidden` | aynı dördü |
| `font-variant-numeric` | `tabular-nums` | `tabular-nums` |

---

## 18. On yerde token varken ham `rgba()` yazılmış (B5)

**Sekizi bağlandı, dördü mobil turunun dosyalarında kaldı.** Değerler değişmedi; her biri
tarayıcıda doğrulandı.

| Ham değer | Token | Dosya | Durum |
|---|---|---|---|
| `rgba(10,8,7,.6)` | `--panel-60` | `saat/DurumCipi.module.css:18` | bağlandı |
| `rgba(10,8,7,.6)` | `--panel-60` | `layout/UstBar.module.css` (mobil gradyan ucu) | bağlandı |
| `rgba(10,8,7,.9)` | `--panel-koyu` | `layout/UstBar.module.css:20` | bağlandı |
| `rgba(10,8,7,.55)` | `--panel-yari` | `layout/UstBar.module.css:25` | bağlandı |
| `rgba(242,233,220,.12)` | `--cizgi-kart` | `layout/Cekmece.module.css:63` | bağlandı |
| `rgba(242,233,220,.14)` | `--cizgi` | `layout/MobilAksiyonBari.module.css:10` | bağlandı |
| `rgba(242,233,220,.16)` | `--cizgi-bolum` | `layout/BeadRay.module.css:33` | bağlandı |
| `rgba(10,8,7,.6)` | `--panel-60` | `sayfa/ana/Acilis.module.css:29` | **mobil turunun dosyası** |
| `rgba(10,8,7,.7)` | `--panel-not` | `sayfa/ana/Gece.module.css:51` | **mobil turunun dosyası** |
| `rgba(242,233,220,.3)` | `--cizgi-tire` | `ember/KorSahnesi.module.css:123` | **mobil turunun dosyası** |
| `rgba(250,170,31,.32)` | `--tangerine-32` | `ember/KorSahnesi.module.css:133` | **mobil turunun dosyası** |
| `rgba(183,53,28,.4)` | `--kor-leke-hover` / `--kor-kenar` | `layout/MobilAksiyonBari.module.css:32` | **bağlanmadı, aşağıya bakın** |

Sonuncusu bilinçli bir "uygulamadım". Değer bir **gölge** rengi
(`box-shadow: 0 8px 22px rgba(183,53,28,.4)`, `Mobil:190`), oysa aynı alfayı taşıyan iki
token'ın rolü kenarlık ve leke. `tokens.css`'in kendi yorumu (`:106-110`) bu rol ayrımını
açıkça koruyor: "üçü ayrı rol olduğu için ayrı adları var". Doğru çözüm `--kor-golge` ailesine
üçüncü bir geometri eklemek (`0 8px 22px`), ama o dosya mobil turunun elinde. Satır ham kaldı,
tek satırlık gerekçeyle işaretlendi ve `IYILESTIRMELER.md`'ye öneri olarak yazıldı.
Ayrıca `sayfa/ana` ve `ember` altındaki dört yer için not: `Acilis.module.css:29` ve
`Gece.module.css:51` değeri `text-shadow` olarak kullanıyor, yani orada da rol farkı var ve
düz değiştirme doğru olmayabilir.

**Tarayıcı doğrulaması (hesaplanmış stiller, değişiklik sonrası):**

| Öğe | Beklenen | Ölçülen |
|---|---|---|
| `DurumCipi.dev` zemini | `rgba(10,8,7,.6)` | `rgba(10, 8, 7, 0.6)` |
| `BeadRay.baglayici` zemini | `rgba(242,233,220,.16)` | `rgba(242, 233, 220, 0.16)` |
| `UstBar` mobil gradyanı | `.94 -> .6` | `linear-gradient(rgba(10, 8, 7, 0.94), rgba(10, 8, 7, 0.6))` |
| `MobilAksiyonBari` üst kenarlığı | `rgba(242,233,220,.14)` | `1px solid rgba(242, 233, 220, 0.14)` |
| `MobilAksiyonBari.birincil` gölgesi | değişmemeli | `rgba(183, 53, 28, 0.4) 0px 8px 22px 0px` |

---

## 6. Favicon yok

**Uygulanmadı, uydurulmadı.** Marka paketi (`design_handoff_bozo_website/marka/`) yalnız iki
markdown dosyası taşıyor (`01-Logo-Final-Karar.md`, `03-Cilt2-Taslak-Kurallar.md`); çizilmiş
hiçbir varlık yok. Logo kararı işareti sözle tarif ediyor ("şiş kilidi": bir ucu sivri, diğer
ucu halka saplı çubuk üzerinde 4 ciğer ve 2 kuyruk yağı tanesi) ve durumu "onay bekliyor".

`app/` altında `icon.*` / `apple-icon.*` yok, `public/` dizini hiç yok. Geçici emoji veya
jenerik ikon konmadı. `DEVAM.md`'nin "İşletmeden bekleyen veriler" bölümüne, ne gerektiği ve
geldiğinde nereye konacağı (`app/icon.svg` + `app/apple-icon.png`, Next kendisi bağlar)
yazılarak eklendi.

---

## 7. `/_not-found/` yinelenen rota

**Uygulanmadı, dokümante edildi: Next'in beklenen çıktısı.**

Ölçüm:

- `next build` rota tablosunda `/_not-found` satırı var ve `○ (Static)` işaretli. Next'in
  kendi dokümanlarındaki örnek rota tabloları da (`02-guides/public-static-pages.md:60,150,235`)
  bu satırı, kullanıcının yazmadığı bir iç rota olarak gösteriyor.
- `output: 'export'` + `trailingSlash: true` üç dosya yazıyor: `out/404.html`,
  `out/404/index.html`, `out/_not-found/index.html`. Üçü `cmp` ile **bayt bayt aynı**.
- Üçü de `<meta name="robots" content="noindex">` taşıyor.
- `out/sitemap.xml` içinde `_not-found` **sıfır** kez geçiyor; `app/sitemap.ts` yalnız beş
  içerik rotasını ve EN karşılıklarını üretiyor.

Statik export rehberi (`02-guides/static-exports.md:331`) yalnız `/out/404.html`'i sayıyor ama
fazladan kopyaları yasaklamıyor ve `trailingSlash: true` senaryosunu o listede ele almıyor.
Derleme sonrası dosya silen bir adım eklemek, `noindex` zaten yerindeyken ve sitemap temizken
bedelsiz bir kazanç sağlamıyor; ayrıca statik export'un çıktısına elle müdahale eden bir adım
bakım borcu yaratır. Karar: düzeltilmedi, `DEVAM.md`'ye "bilinen ve kabul edilen çıktı
davranışı" olarak yazıldı.

---

## 5. `IYILESTIRMELER.md` birikmiş kayıtlar

Üç ajanın paylaşılan dosya olduğu için atladığı kayıtlar tek elde işlendi.

**Eklenen 14 satır (Uygulandı):** kor sahnesi iç varyantı (`4f8b085`), `Buton` ikonlu dolgu
adımı, `Buton` `border-radius`, `Buton` `letter-spacing`, `GizlilikSayfasi` renk dönüşü,
`HataSayfasi` kicker'ın primitife bağlanması, iki footer'ın adres satırı, gece şeridinde çapa
payı, mobil üst bar saç çizgisi, çekmece nokta nabzı, sekiz ham `rgba()`'nın token'a
bağlanması, `Buton` gölge/kenarlık normalizasyonu ve kalan sapmaları, 16px tabanının üç
katmanlı hali ve 13px genişletmesi, `EtiketSatiri`'nin iki ölçeği.

**Eklenen 3 satır (Öneri, karar bekliyor):** `--kor-golge` ailesinin mobil geometrisi,
çağıranı olmayan üç sözlük anahtarı, ve `.09` token satırının güncellenmiş sayımı.

**Düzeltilen 2 satır:** `DilAnahtari` pasif rengi (gerekçe, madde 15c) ve Konum hero buton
adımı (ölçümle güncellendi, madde 12).

Zaten kayıtlı olduğu için tekrar eklenmeyenler: Task 9'un kaydırma ipucu kararı (56. satır
civarı, "Acilis kaydırma ipucu, 780px altı"), kabuk turunun Konum "Sayfalar" listesi kararı,
`SaatTablosu` varyantları, `HaritaPlakasi` ölü prop'u.

---

## Kapılar

| Kapı | Sonuç |
|---|---|
| `npm run typecheck` | temiz |
| `npm test` | `tests 60, pass 60, fail 0` |
| `npm run build` | temiz, `Compiled successfully` |
| Rota tablosunda `gecici-` | yok (aşağıda) |
| Tarayıcı, 1440x900 | ana + dört iç sayfa + 404 |
| Tarayıcı, 390x844 | ana + dört iç sayfa + 404 |
| Yatay taşma, 390px | `scrollWidth - clientWidth = 0`, her sayfada |

Derleme rota tablosu:

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

Geçici rota açılmadı; bu turun hiçbir maddesi yeni sayfa gerektirmedi.

---

## Dokunulan dosyalar

Paylaşılan ağaçta paralel bir mobil turu çalışıyordu. Yalnız kendi dosyalarım, yol vererek
stage edildi; `git add -A` kullanılmadı.

    components/layout/AltBilgiSayfalar.tsx      madde 16
    components/layout/AltBilgiTam.tsx           madde 16
    components/layout/BeadRay.module.css        madde 18
    components/layout/Cekmece.module.css        madde 18
    components/layout/GeceSeridi.tsx            madde 9
    components/layout/MobilAksiyonBari.module.css  madde 18
    components/layout/UstBar.module.css         madde 13, 18
    components/saat/DurumCipi.module.css        madde 18
    components/sayfa/GizlilikSayfasi.module.css madde 2, 19
    components/sayfa/HataSayfasi.module.css     madde 17
    components/sayfa/HataSayfasi.tsx            madde 17
    components/sayfa/Kabuk.module.css           madde 9
    components/sayfa/konum/Harita.module.css    madde 15
    components/ui/Buton.module.css              madde 1, 11
    docs/surec/DEVAM.md                         madde 6, 7 + bayatlık
    docs/surec/IYILESTIRMELER.md                madde 5, 12, 14, 15c
    docs/surec/KISITLAR.md                      madde 10

Dokunulmayanlar, sahibi başka bir tur olduğu için: `styles/tokens.css`, `components/ember/*`,
`components/sayfa/ana/*`, `components/sayfa/HaritaPlakasi.module.css`,
`components/ui/MenuSatiri.*`, `components/ui/TaneDizilimi.*`.

---

## Öz denetim ve endişeler

**1. `:has(svg)` seçimi tartışılabilir.** Açık bir `ikonlu` prop'u daha görünür olurdu; ben
"kural tasarımda ikonun varlığına bağlı, çağrı yerinde unutulamamalı" gerekçesiyle CSS
tarafını seçtim. Riski: `Buton`'un içine ileride ikon olmayan bir SVG konursa (ör. süs bir
çizgi) dolgu sessizce 3px daralır. Bugün böyle bir çağrı yeri yok, kod tabanı tarandı.

**2. Buton dolgusu artık özel değişkenlerden geliyor.** `padding` tek yerde, ölçüler dört
sınıfta. Okuması ilk bakışta bir adım dolaylı; alternatifi sekiz ayrı
`.cerceveli.sm:has(svg)` kuralı yazmaktı ve o hem daha uzun hem özgüllük sırasına bağımlıydı.

**3. `body:has([data-gece-serit])` bir eşleşme daha bulabilir.** Bugün o özniteliği yalnız
`GeceSeridi` basıyor. İkinci bir basan çıkarsa çapa payı sessizce değişir; öznitelik adı
tasarımın kendi adı olduğu için çakışma olasılığı düşük ama sıfır değil.

**4. Paralel tur ağaçta çalışıyordu, kontrast ölçümü onun ardından tekrarlandı.** İlk gizlilik
ölçümü mobil turu kor sahnesinin mobil ölçülerini eklemeden önce alınmıştı. O tur `2c8ba7b`
ile kapandıktan sonra 390px ölçümü yeniden yapıldı: **en kötü zemin `[68,48,29]`, `.78` ile
6.97:1**, yani birebir aynı. Sebebi anlaşılır: mobil prototip ana sayfanın mobil hali ve
eklenen ölçüler `ana` varyantına gitti; gizlilik `ic` varyantını kullanıyor. Diğer ölçümlerim
(buton dolguları, footer metni, çapa payı, token değerleri) zaten tasarımın değerleriyle
birebir çıktığı için etkilenmedi.

**5. `Harita.module.css`'in yorumu artık `HaritaPlakasi.module.css`'e işaret ediyor**, ve o
dosya mobil turunun elinde. Tabloyu oradan silmezlerse sorun yok; bu raporda da tam ve
düzeltilmiş hali duruyor.

**6. `.09` ve `0 8px 22px` ham kaldı.** İkisi de `KISITLAR.md`'nin "token kullan, ham literal
yazma" kuralının ihlali ve ikisi de bilinçli: `tokens.css` bu turda dokunulmaz dosyaydı.
Mobil turu kapanınca kapatılmalı.

**7. İki kanıt raporu hâlâ izlenmiyor.** `docs/surec/rapor/bagimsiz-sadakat-denetimi.md` ve
`capraz-inceleme.md` `??` durumunda ve bu raporun birçok atfı onlara. Benim yazdığım dosyalar
olmadıkları için turun kendi commit'ine karıştırılmadılar; ayrı bir commit'le ağaca alındılar.

---

## Sahibine sorular

1. **Konum hero'sunun buton ölçeği.** Tasarım orada `19/32` ve `18/28` istiyor, ikisi de
   handoff'ta tek örnek. Beşinci bir `boy` adımı açmak mı, yoksa `lg`'nin `-1/-2px`
   sapmasıyla yaşamak mı (bugünkü hal)?
2. **Çağıranı olmayan üç sözlük anahtarı.** `ortak.marka.kisa`, `ortak.cta.whatsapptanYaz`,
   `ortak.satirlar.saatlerUzun`. "No dead code" silmeyi söylüyor, ama sözlük içeriği sizin.
   `saatlerUzun` ayrıca aynı cümlenin üçüncü elle yazılmış kopyası, tek kaynağa indirilebilir.
3. **Site ikonu.** Onaylı bir işaret dosyası (SVG tercih edilir) gerekiyor; şu an her sayfa
   konsola favicon 404'ü düşürüyor ve marka paketinde çizilmiş varlık yok.
4. **`Buton` gölgesi boy başına mı, kullanım başına mı?** Ön geçişin bıraktığı ve hâlâ açık
   olan soru: `Menu:289` tasarımda gölgesiz ama port `md` birincile `--kor-golge` basıyor.
5. **Çekmece durum noktası nabzı.** Tasarımın çekmecesinde nabız yok, diğer dört noktasında
   var; ben kuralı izleyip nabzı korudum. Kabul mü?
