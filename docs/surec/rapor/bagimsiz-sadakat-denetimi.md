# Bağımsız tasarım sadakati denetimi

Tarih: 12 Ağustos 2026. Dal: `feat/site-kurulumu`.

Yöntem: sayfa raporları okunmadı. Her blok için değerler beş `.dc.html` dosyasından
yeniden çıkarıldı, sonra karşılık gelen `.module.css` / `.tsx` ile değer değer
karşılaştırıldı. Yalnız `KISITLAR.md` ve `IYILESTIRMELER.md` okundu (kayıtlı
kararları bulgudan ayırmak için).

## Çalışma ağacının durumu

Denetim çalışma ağacına yapıldı, HEAD'e değil. Ağaç temiz değil:

- `M components/saat/SaatTablosu.module.css`, `M components/saat/SaatTablosu.tsx`,
  `M components/sayfa/KonumSayfasi.tsx`
- `?? components/sayfa/konum/` (dizinin tamamı takip edilmiyor: on dosya)

Yani Konum sayfası henüz commit edilmemiş bir iş. Aşağıdaki F5 o dosyalara ait.

## Örneklenen bloklar

| # | Blok | Tasarım kaynağı | Kod | Karşılaştırılan değer |
|---|---|---|---|---|
| 1 | Kor sahnesi, üç varyant + keyframe'ler | Ana:18-20, 28-36; Menu/Hikaye/Konum:18-20, 28-34; Mobil:16-18, 31-37 | `ember/KorSahnesi.*`, `styles/animasyonlar.css`, `ember/ImlecKoru.*` | ~62 |
| 2 | Menü plakaları, 8 örnek + 7 çekim karosu | Menu:94-101, 126-132, 144-150, 162-168, 180-186, 207-211, 219-223, 239-243, 271-277 | `ui/FotoYuvasi.*`, `menu/Ocaktan.tsx`, `menu/Ikramlar.tsx` | ~78 |
| 3 | Pencere ailesi plakaları, 4 örnek | Ana:148-164, 236-240, 283-291; Hikaye:73-81 | `ui/FotoYuvasi.module.css` | ~30 |
| 4 | İki harita levhası | Ana:323-331; Konum:89-101 | `sayfa/HaritaPlakasi.*`, `konum/Harita.*` | ~44 |
| 5 | Tane rayları, 16 örnek | Ana:49, 103-108, 150-155, 180, 222, 339, 355, 384; Menu:89, 137; Hikaye:95, 123; Konum:155; Mobil:58, 82-87, 146 | `ui/TaneDizilimi.*` | ~55 |
| 6 | Çip, 6 varyant | Menu:107, 112-114, 215; Hikaye:107-109; Ana:313; Konum:98-100 | `ui/Cip.module.css` | ~28 |
| 7 | Buton, 4 boy x 2 aile + hover | Ana:61, 112-113, 318-320, 345-347; Konum:56, 80-81, 161-162; Menu:58, 289-290; Hikaye:56, 128-129 | `ui/Buton.module.css` | ~55 |
| 8 | Üst bar, 3 bağlam | Ana:40-63; Hikaye/Konum/Menu:37-58; Mobil:50-69 | `layout/UstBar.module.css` | ~32 |
| 9 | Cam panel, 8 çağrı yeri | Ana:130, 170, 271, 298; Hikaye:83, 91; Konum:106, 124 | `ui/CamPanel.module.css`, `styles/tokens.css` | ~20 |
| 10 | Menü satırı, 5 satır + hover | Ana:176-214 | `ui/MenuSatiri.module.css` | ~20 |
| 11 | Ana sayfa hero / iddia / gece | Ana:86-126, 128-167, 244-267 | `ana/Acilis.*`, `ana/Iddia.module.css`, `ana/Gece.module.css` | ~46 |
| 12 | Usul satırları, 3 örnek | Hikaye:98-116 | `hikaye/Usul.module.css` | ~18 |
| 13 | Saat ailesi (canlı saat, durum çipi, vardiya, tablo) | Ana:89-96, 246-263, 301-311; Konum:65-72, 108-121; Menu:68-73 | `saat/*` | ~48 |
| 14 | Konum iletişim satırları | Konum:127-147 | `konum/IletisimSatiri.module.css` | ~16 |
| 15 | Mobil kabuk (bar, çekmece, gece şeridi, aksiyon barı) | Mobil:50-69, 189-193, 195-214 | `layout/UstBar` medya bloğu, `MobilAksiyonBari`, `Cekmece`, `GeceSeridi` | ~40 |
| 16 | Alt bilgi, 3 varyant | Ana:351-386; Hikaye:134-163; Konum:166-194; Menu:283-292 | `layout/AltBilgi.module.css` | ~34 |
| 17 | Token envanteri çapraz kontrolü | beş dosyanın alfa taraması | `styles/tokens.css` | ~30 |

Toplam yaklaşık **656 değer**, 17 blok. On sapma bulundu.

---

## Bulgular

### F1. Ana sayfanın kor sahnesi, iç sayfaların keyframe'leriyle çalışıyor

**Ciddiyet: yüksek.** Tasarımın iki ayrı keyframe seti var, kodda bir tane var ve
o da iç sayfalarınki.

`styles/animasyonlar.css:1-13` tek bir küresel set tanımlıyor. Değerleri
`Menu/Hikaye/Konum Sayfasi.dc.html:18-20` ile birebir. Ama
`Ana Sayfa Alternatif.dc.html:18-20` farklı bir set tanımlıyor:

| Değer | Tasarım (Ana:18-20) | Kod (`animasyonlar.css`) |
|---|---|---|
| `emberBreath` taban opaklık | `.62` | `0.6` (satır 2) |
| `emberBreath` tepe ölçek | `scale(1.06)` | `scale(1.05)` (satır 3) |
| `emberSoft` tepe opaklık | `.85` | `0.82` (satır 7) |
| `smokeDrift` başlangıç ötelemesi | `translate3d(0,40px,0)` | `translate3d(0, 36px, 0)` (satır 10) |
| `smokeDrift` opaklık durağı | `28%` | `30%` (satır 11) |
| `smokeDrift` tepe opaklık | `.16` | `0.14` (satır 11) |
| `smokeDrift` bitiş ötelemesi | `translate3d(40px,-200px,0)` | `translate3d(30px, -170px, 0)` (satır 12) |
| `smokeDrift` bitiş ölçeği | `scale(1.7)` | `scale(1.6)` (satır 12) |

Sonuç: ana sayfada kor daha sığ nefes alıyor, çekirdek daha sönük parlıyor ve üç
duman pufu tasarımın istediğinden 30px kısa, %15 daha az yayılarak sürükleniyor.

Bunun neden kaçtığı yapısal: `KorSahnesi.module.css` `.ana` / `.ic` ayrımını her
**katman** özelliği için titizlikle kuruyor (satır 26-51, 60-74, 84-137, 144-145)
ve dosyanın kendi başlık yorumu (satır 10-18) farkları tek tek sayıyor. Ama
animasyon eğrileri paylaşılan küresel dosyada yaşıyor ve orada yalnız bir varyant
olabilir. Katman ayrımı doğru yapılmış, eğri ayrımı sessizce düşmüş.

Düzeltme tek bir değer değişimi değil: `emberBreathAna`, `emberSoftAna`,
`smokeDriftAna` adında ikinci bir set gerekiyor, çünkü menü plakalarının
`emberSoft`'u (`FotoYuvasi.module.css:73, 80, 87, 91`) tasarımda gerçekten `.82`
tepe istiyor. Tek keyframe ile ikisi birden doğru olamaz.

### F2. Menü sayfasının kor sahnesi diğer iki iç sayfayla aynı değil

**Ciddiyet: orta.** Kod üç iç sayfayı tek `ic` varyantı sayıyor; Menü altı değerde
ayrışıyor.

| Katman | Menu:29-32 | Hikaye/Konum:29-32 | Kod (`KorSahnesi.module.css`) |
|---|---|---|---|
| kor iç durak | `rgba(183,53,28,.58)` | `.55` | `0.55` (satır 46) |
| kor orta durak | `rgba(183,53,28,.15) 44%` | `.14` | `0.14` (satır 47) |
| çekirdek | `rgba(250,170,31,.28)` | `.26` | `0.26` (satır 72) |
| duman 1 konum | `left:24%` | `26%` | `26%` (satır 119) |
| duman 2 konum | `left:62%` | `60%` | `60%` (satır 129) |
| duman 2 tonu | `rgba(250,170,31,.34)` | `.32` | `0.32` (satır 133) |

Büyüklükler küçük. Asıl sorun kayıt: `KorSahnesi.module.css:12-13` ve
`KorSahnesi.tsx:13` ikisi de "Menu / Hikaye / Konum Sayfasi.dc.html:27-33, üçünde
birebir aynı" diyor. Bu ifade yanlış ve bir sonraki okuyucuya "buraya bakma"
diyor.

Reponun kendisi karşı kanıtı zaten taşıyor: `styles/tokens.css:143-145`,
`--tangerine-28` için "aynı değer menü sayfasının kor çekirdek gradyanında da
geçiyor (Menu:30)" diyor. Yani `.28` bir yerde kayıtlı, başka bir yerde `.26`
olarak basılıyor.

### F3. Mobil kor sahnesi hiç yok

**Ciddiyet: orta.** `Mobil Prototip.dc.html:16-18, 31-37` üçüncü bir sahne tarif
ediyor. `KorSahnesi.module.css` içinde sıfır `@media` kuralı var ve
`SahneVaryanti` (`KorSahnesi.tsx:21`) yalnız `'ana' | 'ic'`.

Uygulanmayan değerler:

| Katman | Mobil |
|---|---|
| kap yüksekliği | `844px` (telefon çerçevesi; sitede `100vh` doğru karşılık) |
| kor | `bottom:-12%; height:92%; radial-gradient(78% 92% at 50% 100%, rgba(183,53,28,.78), rgba(183,53,28,.2) 44%, transparent 70%)` |
| çekirdek | `width:420px; height:340px; margin-left:-210px; rgba(250,170,31,.4)` |
| duman 1 | `left:18%; 170px; rgba(242,233,220,.36); blur(26px); 20s` |
| duman 2 | `left:54%; 150px; rgba(250,170,31,.42); blur(24px); 26s, gecikme 8s` |
| vinyet | `inset 0 0 170px rgba(0,0,0,.86)` |
| keyframe'ler | `emberBreath` `.6` -> `1`, `scale(1.06)`; `emberSoft` `.4` -> `.85`; `smokeDrift` `30px` / `30%` / `.15` / `24px,-140px` / `scale(1.6)` |

Yaklaşık 17 değer. Bunu kapsam dışı saymak savunulabilir bir karar olabilir ama
**hiçbir yerde kayıtlı değil**, ve projenin kendi emsali tersini söylüyor:
`IYILESTIRMELER.md` 52, 54 ve 69. satırları `UstBar`, `GeceSeridi` ve alt bilginin
dip payı için tam olarak bu yoldan (mobil prototipten medya sorgusu) değer almış.
Kabuk mobil prototipe uymuş, sahne uymamış.

### F4. Ana sayfanın imleç koru katmanı hiçbir yere bağlı değil

**Ciddiyet: orta.** `Ana Sayfa Alternatif.dc.html:31` (`data-imlec`) sahnenin
gerçek bir katmanı: fareyle 0.34 katsayısıyla kayan 620px'lik tangerine hale.

`components/ember/ImlecKoru.tsx` ve `ImlecKoru.module.css` bu katmanı birebir
doğru yazmış (620px, `margin:-310px`, `rgba(250,170,31,.16)`, `transparent 74%`,
`top:62%`, `transition: transform .7s cubic-bezier(.2,.7,.2,1)`). Ama
`components/`, `app/` ve `lib/` içinde tek bir çağrı yeri yok. `Kabuk.tsx:34`
yalnız `KorSahnesi`'ni basıyor.

Yani ana sayfa sahnesi bir katman eksik çalışıyor ve dosyalar ölü kod
(`KISITLAR.md` "No dead code").

Not: bu zaten `docs/surec/DEVAM.md:115`'te ve `docs/surec/brief/toparlama-turu-brief.md`
§3'te açık madde olarak duruyor. Yeni bir keşif değil, bağımsız doğrulama.

### F5. Konum hero'sunun buton çifti, `Buton`'da olmayan bir boy

**Ciddiyet: orta.** Tasarım Konum:80-81:

- birincil: `padding:19px 32px; font:600 16px/1`
- ikincil: `padding:18px 28px; border:1px solid rgba(242,233,220,.38); font:600 16px/1`

`konum/Acilis.tsx:51, 54` ikisine de `boy="lg"` geçiyor. `Buton.module.css:21, 28`:

- `.lg` -> `padding:18px 30px` (tasarım 19/32: dikeyde 1px, yatayda 2px eksik)
- `.cerceveli.lg` -> `padding:17px 29px` (tasarım 18/28: dikeyde 1px eksik, yatayda 1px fazla)
- `.ikincil` kenarlığı `--cizgi-buton` (`.36`), tasarım `.38`

`19px 32px` tüm handoff'ta tam bir kez geçiyor, yani gerçekten tekil bir ölçü. Ama
port onu sessizce en yakın adıma yuvarlamış. Kenarlık alfası `Buton.module.css:42`
yorumunda kalıntı olarak kabul edilmiş; **dolgu farkı hiçbir yerde kayıtlı değil.**

### F6. `Buton` kaynağı olmayan iki değer taşıyor

**Ciddiyet: düşük, ama kural ihlali (kayıtsız sapma).**

**`border-radius: 2px`** (`Buton.module.css:8`). Beş tasarım dosyasındaki hiçbir
buton `border-radius` bildirmiyor. Doğrulandı: `background:#B7351C` taşıyan on
kuralın hepsi ve tüm kenarlıklı CTA'lar yarıçapsız; `#B7351C` üstündeki tek
`border-radius` harita pininin `50%`'si. `IYILESTIRMELER.md` 21 ve 32. satırları
`Cip`'in 2px'ini tam bu kanıt standardıyla kaldırmış ve "Buton'un 2px'i Cip'e
şablonlanmış görünüyor" sonucuna varmış. Tasarım o çıkarımı desteklemiyor: 2px
brief'ten geliyor, handoff'tan değil. Marka kuralının 0-3px zarfında kaldığı için
görsel etkisi küçük, ama gerekçesiz.

**`letter-spacing: -0.005em`** (`Buton.module.css:11`). Handoff'ta hiçbir Inter
buton dizisinde `letter-spacing` yok (tarandı, sıfır eşleşme). Uydurulmuş değer.

### F7. Mobil üst barın alt saç çizgisi düşmüş

**Ciddiyet: düşük.** `Mobil Prototip.dc.html:55`:
`height:58px; padding:0 18px; ...; border-bottom:1px solid rgba(242,233,220,.09)`.

`UstBar.module.css:156-160` (`@media (max-width: 780px)`) yüksekliği ve dolguyu
alıyor, `border-bottom`'ı almıyor. Aynı `.09` değeri zaten üç footer'ın telif
şeridinde de ham olarak duruyor (`IYILESTIRMELER.md` 83. satır, token turuna
bırakılmış).

### F8. Çekmecenin durum noktası tasarımda yanıp sönmüyor

**Ciddiyet: düşük.** `Mobil Prototip.dc.html:209`:
`width:8px;height:8px;border-radius:50%;background:#FAAA1F;box-shadow:0 0 12px rgba(250,170,31,.9)`.
`animation` yok.

`Cekmece.module.css:92` `animation: dotPulse 2.4s ease-in-out infinite` ekliyor.

`IYILESTIRMELER.md` 56. satırdaki kayıtlı karar noktanın **kapalıyken sönmesi**
hakkında, nabız eklemek hakkında değil. Ayrı bir eklenti, kayıtsız.

### F9. Mobil prototipin içerik tipografisi bütünüyle uygulanmamış

**Ciddiyet: düşük ama sistematik.** Kabuk bileşenleri mobil prototipten değer
aldı; içerik bileşenlerinin hiçbiri almadı. 390px'te port masaüstü clamp'lerinin
alt ucunu basıyor.

| Öğe | Mobil prototip | Portun 390px'te bastığı |
|---|---|---|
| Hero H1 (Mobil:77) | `800 52px/.92`, `-.05em` | `clamp(60px,10.4vw,168px)` -> 60px, `/1.06`, `-.018em` |
| Hero alt satır (Mobil:79) | `800 26px/1`, `-.04em` | `clamp(34px,4.6vw,76px)` -> 34px, `-.025em` |
| Hero tane rayı (Mobil:80-88) | büyük 13 / küçük 8 / gap 7; çizgi `2px`, `margin-top:-1px`, durak `50%`; `padding:10px 0` | 20 / 12 / gap 12; çizgi `3px`, `-1.5px`, durak `54%`; `padding:16px 0` |
| Sayaç hücreleri (Mobil:101-103) | `700 30px/1`, `-.04em`; etiket `400 11.5px/1.35`, `.72`; `padding:16px 14px`; zemin `rgba(10,8,7,.86)` | `clamp(44px,4.6vw,64px)` -> 44px, `-.02em`; etiket `400 14px/1.45`, `.74`; `padding:22px 24px`; zemin `.9` |
| Gece H2 (Mobil:157) | `800 40px/1.02`, `-.045em` | `clamp(44px,7vw,112px)` -> 44px, `/1.08`, `-.03em` |
| Vardiya çipleri (Mobil:160-163) | 4 çip (21/23/01/03), `padding:8px 12px`, `12.5px`, `.66`, zeminsiz | 6 çip, `9px 15px`, `13.5px`, zemin `rgba(10,8,7,.5)` |
| Sofra H2 (Mobil:148) | `700 34px/1.06`, `-.04em` | `clamp(34px,4.6vw,64px)` -> 34px, `/1.1`, `-.025em` |
| Konum mini haritası (Mobil:169-174) | `height:180px`; ızgara adımı `40px`; yol `top:56%`, `11px`; halka `60px`, `margin:-30px`; pin `14px`, `0 0 0 5px`, `0 0 24px` | karşılığı yok |
| Durum çipi (Mobil:73) | `padding:9px 14px`, kenarlık `rgba(250,170,31,.32)`, metin `13px` | `9px 15px`, `.3`, `13.5px` |

`IYILESTIRMELER.md` 86. satır yalnız mobil **footer**'ı kapsam dışı sayıyor;
kalanı için bir kayıt yok. Mobil:392 menü listesinin mobilde kart değil satır
olmasını açık bir tasarım kararı olarak yazıyor, o da uygulanmamış.

### F10. İki eskimiş çapraz referans yorumu

**Ciddiyet: nit. Kod doğru, yalnız yorumlar yanıltıyor.**

- `konum/Harita.module.css:15` Ana Sayfa pinini `0 0 0 6px + 32px` diye yazıyor;
  `Ana Sayfa Alternatif.dc.html:328` `0 0 30px`. `HaritaPlakasi.module.css:12`
  aynı satırı doğru (`30px`) yazıyor. İki dosya birbiriyle çelişiyor.
- `konum/Harita.module.css:12` satırı ("yatay yol | top:56%, 16px yok/14px |
  top:54%, 16px") bozuk, okunmuyor.

### Ek: `IYILESTIRMELER.md` 49. satırın gerekçesi olgusal olarak yanlış

Kayıt, `DilAnahtari` pasif rengi için "`.5` hiçbir kaynakta yok" diyor.
`Menu Sayfasi.dc.html:56` ve aynı dosyanın betiği (satır 359-360) `.5`
kullanıyor. Seçilen değer (`.58`) dörtte üç çoğunluk olduğu için **sonuç
savunulabilir**, ama yazılı gerekçe kanıta uymuyor ve gelecekte yeniden kontrolü
engeller.

---

## Doğru çıkanlar

Bunlar sınandı ve tuttu. Neyin kapsandığı da bilgi.

**`FotoYuvasi`, sekiz biçim, tam geometri (~108 değer).** Beş ocak plakasının ve
üç pencere plakasının ölçüleri, kor lekesi ofsetleri (`-14%/128%`, `-16%/132%`,
`-20%/-40%/140%/100%`), vinyet yarıçapları (120/90/80/90, karo yok), köşe işareti
sayıları (4/4/2/2/1/0/0/0), boyları (24/20/26/20) ve tonları (`.6/.55/.55/.5`),
etiket konumları ve tipografisi (`24/-14`, `50%/-13`, `24/22`, `18/16`, `16/14`,
`12/11`) birebir. Çapraz köşe seçimi (`solUst` + `sagAlt`) ve `spread` hover'ı
(`inset 0 0 120px rgba(183,53,28,.4)`) doğru.

**Menü plakalarının kor zamanlamaları, sekiz örneğin sekizi.** Bu, önceki turda
kaçan yerdi; artık doğru. Spread `9s`/0; kartlar `10s`/`.6s`, `11s`/`1.2s`,
`9.5s`/`1.8s`, `12s`/`2.4s` (`menu/Ocaktan.tsx:21-26`); ikramlar `11s`/0 ve
`12s`/`1.5s` (`menu/Ikramlar.tsx:14`); içecek `13s`; çekim karoları animasyonsuz.
`KorNefesi`'nin indeksten türetmeyip değer geçmesi doğru karar: süreler gerçekten
kuralsız.

**İki harita levhası, on iki ayrışan değerin hepsi (~44 değer).** Ayrı bileşen
kararı doğru. Ana: ızgara 50px, yol `top:56%`/14px, dikey `44%`/9px/`.06`, halka
`80px`/`.5`, nabız `16px`/`6px`/`30px`, ad `.82`, cadde `8%`/`59%`/11.5px/`.62`.
Konum: 52px, `top:54%`/16px, iki dikey (`20%`/9px/`.05` + `64%`/7px/`.045`), halka
`110px`/`.45`, pin `18px`/`7px`/`32px`, kutulu etiket (`-46px/18px`, `8px 13px`,
kenarlık `.4`, kapı no `400`/`.55`), üç POI koordinatı, alt not. Hepsi tuttu.

**`TaneDizilimi` yarıçap türetmesi, on altı rayın on altısı.** `taneYaricapi`
(büyük: `<10` -> 1, değilse 2; küçük: `<9` -> 0, değilse 1) tasarımın her rayını
yeniden üretiyor, 8px büyük tanenin 1px alıp 8px küçük tanenin almadığı
asimetrik durum dahil. Tonlar (`krem`, `krem80`, `krem75`, `krem50`, `koyu`,
`anahat`) ve altılı/üçlü ritimler doğru.

**`Cip`, altı varyantın altısı.** `outline` (5/10, `.45`, 600 11.5px),
`dolu` (7/12, `.06`, 500 12.5px, `.74`), `olcu` (10/14, 500 14px, `.78`),
`ikram` (kutusuz, 600 15px), `komsuluk` (9/14, `.14`, 500 13px, `.7`),
`poi` (7/11, `.85` zemin, `.16` kenarlık, 500 11.5px, `.66`, `nowrap`). Tümü
birebir; `font` kısayolundan sonra gelen `tabular-nums` kuralı da doğru sırada.

**Vardiya çiplerinin çalışma zamanı renkleri.** Tasarımın statik işaretlemesi
pasif çip için `.7` yazıyor ama betiği (Ana:457) anında `.66`'ya düşürüyor. Kod
ikisini de ayırmış: `.beklemede` `.7` (mount öncesi), `.pasif` `.66` (mount
sonrası). Aktif durum `rgba(250,170,31,.85)` / `.12` / `#FAAA1F` doğru. Bu, kolay
kaçacak bir tuzaktı.

**`Usul` satırlarının `tabular-nums` ayrımı.** Hikaye:115 (03 Saat) tabular
taşıyor, Hikaye:101 (01 Tane) taşımıyor. `hikaye/Usul.module.css:60` bunu
`.saatGovdesi` ile ayırmış.

**`SaatTablosu`'nun Ana / Konum ayrımı.** Dört ayrışan değer (satır dolgusu
15/12 -> 16/14, not satır ölçüsü 1.6 -> 1.65, not rengi `.66` -> `.68`, notun
tabular'ı) `.konum` varyantında doğru.

**`CamPanel`'in üç dolgu adımı ve iki zemini.** `clamp(28,3vw,48)` / `.72`,
`clamp(28,3vw,44)` / `.74`, `clamp(26,2.8vw,40)` / `.74`; sekiz çağrı yerinin
sekizi eşleşiyor. `backdrop-filter`'ın yalnız Ana ve Hikaye'de olduğu tespiti de
doğru.

**`Buton`'un dolgu merdiveni ve kenarlıklı 1px içeri alma kuralı.** `sm` 13/24,
`md` 17/28, `lg` 18/30, `xl` 20/34 ve çerçeveli karşılıkları 12/23, 16/27, 17/29,
19/33. F5'teki Konum çifti dışında hepsi tasarımda karşılığını buluyor.
Gölge/kenarlık çoğunluğa normalize etme kararı `Buton.module.css:31-44`'te tam
sayımla belgelenmiş.

**`UstBar`'ın iki masaüstü varyantı.** 80px/gap 30/`.9`->`0`/geçişli ve
78px/gap 28/`.94`->`.55`/aktif sekmede 2px tangerine alt çizgi. Marka `800 21px`,
`-.03em`. Hepsi doğru.

**Diğer tam eşleşen bloklar:** `MenuSatiri` (5 satır + hover dolgu/zemin),
`ana/Acilis` (hero, meta, kaydırma ipucu), `ana/Iddia` (sayaç ızgarası, 1px
hairline zemin), `ana/Gece` (1100px erit, hayalet saat `.055`), `CanliSaat` dört
boy, `DurumCipi` iki boy, `konum/IletisimSatiri`, `GeceSeridi` (masaüstü + mobil),
`MobilAksiyonBari` (tümü), `Cekmece` (F8 dışında tümü), yedi `data-yogunluk`
katsayısı (1 / .55 / .4 / .7 / 1.25 / .45 / .3).

---

## Bakamadım

- **Tarayıcıda hiçbir şey ölçülmedi.** Görev salt okunur ve tarayıcı yasak. Tüm
  karşılaştırma kaynak metin düzeyinde. Hesaplanmış değerler (clamp çözümleri,
  kalıtım, kaskad çakışmaları) doğrulanmadı. Özellikle F1 ve F9'un görsel
  büyüklüğü ölçülmedi.
- **`out/` çıktısı denetlenmedi.** Yalnız `ImlecKoru`'nun CSS'inin pakete girip
  girmediğini görmek için bir kez arandı (giriyor, yani ölü CSS sevk ediliyor).
- **Erişilebilirlik yeniden ölçülmedi.** Kontrast, dokunma hedefi ve
  `prefers-reduced-motion` davranışları kayıtlı kararlar sayıldı ve bulguya
  dönüştürülmedi. `KorSahnesi.module.css:15-18`'in dayandığı 4.34:1 ölçümü
  bağımsız olarak doğrulanmadı.
- **İçerik sözlükleri (`content/`) örneklenmedi.** Metin sadakati bu turun
  kapsamı dışındaydı; yalnız yapısal/görsel değerlere bakıldı. EN katmanının
  `data-en` ile birebir olmaması bilinçli karar sayıldı.
- **Aşağıdaki bileşenler hiç açılmadı:** `ui/Bolum`, `ui/BolumBasligi`,
  `ui/EtiketSatiri`, `ui/IkramCipi`, `ui/NotBlogu`, `ui/AnimasyonluSayac`,
  `ui/Ikonlar`, `layout/BeadRay`, `layout/IlerlemeCubugu`, `layout/DilAnahtari`,
  `layout/TelifSeridi`, `sayfa/GizlilikSayfasi`, `sayfa/HataSayfasi`,
  `sayfa/PaketSeridi`, `hikaye/Acilis`, `hikaye/Portre`, `hikaye/Sofra`,
  `ana/Bozo`, `ana/Ikram`, `ana/Konum`, `ana/Ocaktan`, `menu/Acilis`,
  `konum/AlkolsuzRozeti`, `konum/SaatlerVeIletisim`, `saat/DurumAltMetni`,
  `saat/useGirneSaati`, `lib/*`.
- **`AltBilgi.module.css`'in 300-417 arası satırları okunmadı** (mobil blok ve
  menü şeridi varyantı). İlk 300 satır denetlendi.
- **`support.js` okunmadı.** Davranış soruları doğrudan `.dc.html` içindeki
  `<script type="text/x-dc">` bloklarından çözüldü.
