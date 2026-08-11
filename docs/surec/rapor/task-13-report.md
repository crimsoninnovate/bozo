# Task 13 raporu: Konum sayfası

Kapsam: `KonumSayfasi` gövdesi, üç bölüm (`Acilis`, `Harita`, `SaatlerVeIletisim`),
iki yeni bileşen (`IletisimSatiri`, `AlkolsuzRozeti`), harita levhası ve paket
şeridinin bağlanması. Spec: `Konum Sayfasi.dc.html:63-164`.

Her değer `.dc.html` kaynağından okundu; türetilmiş belgeler (denetim tabloları,
envanter JSON'ları, eski brief) yalnız yön bulmak için kullanıldı.

## Kapılar

| Kapı | Sonuç |
| --- | --- |
| `npm run typecheck` | temiz |
| `npm test` | 60/60 geçti |
| `npm run build` | temiz, 14 rota, static export |
| Tarayıcı | kendi dev sunucum, port 4713; konsolda **hiç** sayfa hatası yok (`favicon.ico` 404'ü bare sunucunun) |
| Geçici rota | hiç açılmadı; `app/**` dosyalarına dokunulmadı |
| Ölçüm | 1440x900 ve 390x844, TR + EN |

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

## Yazdığım dosyalar

| Dosya | Durum |
| --- | --- |
| `components/sayfa/KonumSayfasi.tsx` | yer tutucu dolduruldu |
| `components/sayfa/konum/Acilis.tsx` + `.module.css` | yeni |
| `components/sayfa/konum/Harita.tsx` + `.module.css` | yeni (bölüm + levha) |
| `components/sayfa/konum/SaatlerVeIletisim.tsx` + `.module.css` | yeni |
| `components/sayfa/konum/IletisimSatiri.tsx` + `.module.css` | yeni |
| `components/sayfa/konum/AlkolsuzRozeti.tsx` + `.module.css` | yeni |
| `components/saat/SaatTablosu.tsx` + `.module.css` | `varyant` prop'u eklendi |
| `components/sayfa/HaritaPlakasi.tsx` + `.module.css` | ölü `children` prop'u silindi, yorum güncellendi |

Dokunulmayanlar: `styles/tokens.css` (yeni token eklenmedi), `components/ui/*`,
`components/layout/*`, `components/sayfa/Kabuk.*`, `components/sayfa/ana/`,
`components/sayfa/AnaSayfa.tsx`, `components/sayfa/menu/`, `components/sayfa/hikaye/`,
`components/sayfa/PaketSeridi.*`, `app/**`.

## Kapatılan denetim maddeleri: 30/30

**Sapmalar.** S1 (uyarı: v1 brief'in Step 2 bloğu tümüyle atıldı, dokuz değerin
hepsi `Konum:89-101`'den alındı), S2 tam genişlik + `clamp(420px,58vh,600px)`,
S3 zemin `--panel-60`, S4 ızgara 52px, S5 yatay yol `54% / 16px`, S6 **iki**
dikey yol, S7 halka `42%/47%` 110px `--kor-halka-konum`, S8 pin `42%/47%` 18px
`0 0 0 7px + 0 0 32px`, S9 alt not levhanın **içinde** sol altta, S10 erişilebilirlik
modeli (aşağıda), S11 (uyarı: e-posta satırı eklenmedi), S12 (uyarı: üç satır
aynı muameleyi görmüyor, `tur` prop'u ayırıyor), S13 `IletisimSatiri` varyant
prop'uyla yazıldı, S14 `<CamPanel opaklik={0.74} dolgu="dar" bulanik={false}>`,
S15 parite `02-konum.jpg` ile yapıldı.

**Eksikler.** E1 hero adres satırı, E2 "Girne saati, canlı" üçüncü öğesi (düz
`<span>`, `DurumAltMetni` **değil**), E3 iki satırlı H1, E4 hero dolgusu + CTA
satırı + hayalet butonun 15px telefon SVG'si (boy farkı aşağıda), E5 birincil
buton `#harita` çapası, E6 `<section id="harita">`, E7 cadde etiketi, E8 pin
etiketi kutusu, E9 üç POI çipi (`Cip tur="poi"`), E10 saatler notu ve yerleşim
tuzağı, E11 `AlkolsuzRozeti`, E12 bölüm ve kart kabuğu ölçüleri, E13 kart
başlıkları düz `<h2>`, E14 `IletisimSatiri` değerleri ve hover'ı, E15 WhatsApp
ve Instagram ikonları `Ikonlar.tsx`'ten.

---

## Karar 1: harita levhası ayrı yazıldı

Ölçüm, iki levhanın **karşılaştırılabilir on iki değerinden yalnız ikisinin**
ortak olduğunu gösterdi.

| # | Değer | Ana Sayfa (`Ana:323-331`) | Konum (`Konum:89-101`) | Ortak mı |
| --- | --- | --- | --- | --- |
| 1 | levha zemini | `rgba(10,8,7,.55)` `--panel-yari` | `rgba(10,8,7,.6)` `--panel-60` | hayır |
| 2 | levha kenarlığı | `1px solid` `.16` | `1px solid` `.16` | **evet** |
| 3 | yükseklik / taşma | `min-height:420px`, taşma serbest | `clamp(420px,58vh,600px)` + `overflow:hidden` | hayır |
| 4 | ızgara adımı | 50px, `.05` | 52px, `.05` | hayır |
| 5 | yatay yol | `top:56%`, 14px, `.08` | `top:54%`, 16px, `.08` | hayır |
| 6 | dikey yol | **tek**: `44%`, 9px, `.06` | **iki**: `20%`/9px/`.05` + `64%`/7px/`.045` | hayır |
| 7 | halka | 80px @ `46%/53%`, `.5` | 110px @ `42%/47%`, `.45` | hayır |
| 8 | pin | 16px, `0 0 0 6px` + `0 0 30px` | 18px, `0 0 0 7px` + `0 0 32px` | hayır |
| 9 | işaret etiketi | çerçevesiz düz metin, `500 12.5px/1`, `.82`, `26px 0 0 14px` | kenarlıklı kutu, `600 13px/1` krem + `400` `.55` ikinci parça, `8px 13px` dolgu, `-46px 0 0 18px` | hayır |
| 10 | cadde etiketi | `8%/59%`, `400 11.5px/1`, `.62` | `10%/57.5%`, `400 12px/1`, `.55` | hayır |
| 11 | alt not | `24px/22px`, `500 12.5px/1.5`, `.68` | aynı | **evet** |
| 12 | POI çipi | yok | üç çip, mutlak konumlu | hayır |

**Gerekçe.** Ortaklaştırmanın ölçüsü "aynı fikir" değil, "değerlerin çoğu aynı".
Burada tersi çıktı: 12'de 10 fark. `HaritaPlakasi`'ya bir `varyant` sınıfı
eklemek, o sınıfın dosyanın neredeyse tamamını yeniden yazması demekti. Üstelik
9 numaralı satır yalnız değer değil **yapı** farkı: paylaşılan bileşen işaret
etiketini `isletmeAdi: string` prop'undan tek stilde bir `<span>` olarak basıyor,
Konum'unki ise iki ayrı ağırlık ve renk taşıyan kenarlıklı bir kutu. Prop'u
`ReactNode`'a açmak, bileşenin "metinler prop, geometri sınıf" sözleşmesini de
bozardı.

Sonuç: `components/sayfa/konum/Harita.*` kendi levhasını çiziyor.
`HaritaPlakasi` ana sayfaya özel kaldı ve **ölü hale gelen `children` prop'u
silindi** (yalnız Konum'un POI çipleri için eklenmişti, Konum onu kullanmıyor).
İki dosyanın başındaki yorumlar da bu kararı ve ölçümü taşıyor.

### Levhanın ölçülen değerleri (1440x900)

| Katman | Tasarım | Ölçülen |
| --- | --- | --- |
| levha | `min-height:clamp(420px,58vh,600px)`, `1px .16`, `rgba(10,8,7,.6)`, `overflow:hidden` | 522px (58vh), birebir, `hidden` |
| levha genişliği | tam bölüm genişliği (flex/max-width yok) | 1312px = 1440 - 2x64 |
| ızgara | iki eksen, `.05`, adım 52px | `repeating-linear-gradient(... 1px 52px)` x2, birebir |
| yatay yol | `top:54%`, 16px, `.08` | 280.8/520 = **%54.0**, 16px, `--cizgi-hayalet` |
| dikey yol 1 | `left:20%`, 9px, `.05` | 262/1310 = **%20.0**, 9px, `--cizgi-harita` |
| dikey yol 2 | `left:64%`, 7px, `.045` | 838.4/1310 = **%64.0**, 7px, `--cizgi-harita-ince` |
| cadde etiketi | `10%/57.5%`, `400 12px/1`, `.55` | %10.0 / %57.5, birebir |
| halka | `42%/47%`, 110px, `-55px`, `1px .45` | %42.0 / %47.0, birebir |
| pin | `42%/47%`, 18px, `-9px`, `0 0 0 7px .22, 0 0 32px .85`, `dotPulse 2.6s` | birebir |
| pin etiketi | `-46px 0 0 18px`, `8px 13px`, `#0A0807`, `1px rgba(250,170,31,.4)`, `600 13px/1` | birebir; metin `Ciğerci Bozo · No:4` |
| POI çipleri | `30%/60%`, `61%/26%`, `66%/62%`; `7px 11px`, `.85` zemin, `1px .16`, `500 11.5px/1`, `.66`, nowrap | üçü de birebir, `Cip tur="poi"` |
| alt not | `left:24px; bottom:22px`, `500 12.5px/1.5`, `.68` | 25 / 22, birebir |

`· 80 m` mesafesi basılmadı: içerik katmanı onu bilinçli düşürmüş
(`content/tr/konum.ts:13-14`), sözlük esas alındı.

### Erişilebilirlik (S10)

Levhanın tamamı `role="img"` veya `aria-hidden` **değil**. Ölçülen:
`aria-hidden="true"` taşıyan **altı** dekoratif katman (ızgara, yatay yol, iki
dikey yol, halka, pin noktası); erişilebilirlik ağacında kalan **dört** metin
grubu: cadde etiketi, pin etiketi (`Ciğerci Bozo · No:4`), üç POI çipi, alt not.

---

## Karar 2: `SaatTablosu` paylaşıldı, `varyant` prop'u eklendi

Aynı ölçüyü tabloya uyguladım ve sonuç ters çıktı: **ayrışan dört değer, ortak
kalan on bir.**

| Değer | Ana (`Ana:301-311`) | Konum (`Konum:109-117`) | Ortak mı |
| --- | --- | --- | --- |
| satır dolgusu | `15px 12px` | `16px 14px` | hayır |
| not dolgusu | `15px 12px` | `16px 14px` | hayır |
| not satır ölçüsü | `14.5px/1.6` | `14.5px/1.65` | hayır |
| not rengi / tabular | `.66`, tabular yok | `.68`, tabular var | hayır |
| üç satırlık yapı | evet | evet | **evet** |
| "Bugün" alt çizgisi | `.12` `--cizgi-kart` | aynı | **evet** |
| "Bugün" zemini | `--tangerine-07` | aynı | **evet** |
| "Bugün" tipografisi | `600 16px/1`, krem + tangerine | aynı | **evet** |
| haftalık satır çizgisi | `.1` `--cizgi-soluk` | aynı | **evet** |
| haftalık satır tipografisi | `400 16px/1`, `.76` | aynı | **evet** |
| iki satırda da tabular | evet | evet | **evet** |
| notun alt çizgisi | yok | yok | **evet** |
| gün adının canlı hesabı | `gosterimGunIndeksi` | aynı davranış | **evet** |

Dört fark, on bir ortak. Ayrıca gün adının gece vardiyasına göre kaydırılması
(02:00 Çarşamba'da "Salı" yazması) gerçek bir davranış; ikinci bir kopyada
sessizce ayrışır. Bu yüzden `varyant?: 'ana' | 'konum'` eklendi, varsayılan
`'ana'`, ana sayfanın çağrı yeri **değişmedi** ve ölçüldü: hâlâ `15px 12px`.

Prop'un sayfa adı taşımasının sebebi, ayırt edici başka bir eksen olmaması: iki
tablo aynı bağlamda, benzer genişlikte, yalnız farklı sayılarla çiziliyor.
"Sık / geniş" gibi bir ad, not rengi ve tabular farkını açıklamazdı.

### Yerleşim tuzağı (E10)

Kartın `gap:22px`'i tablo ile not paragrafının arasına **girmiyor**: not zaten
`SaatTablosu`'nun `not?` prop'uyla tablonun içinde basılıyor ve tablonun
sarmalayıcısı `gap` taşımıyor. Ölçüldü: `.tablo` `display:flex; column;
gap:normal`, notun `padding` dışında hiçbir aralığı yok. Kartın üç çocuğu
(başlık, tablo, rozet) 22px ile ayrılıyor, tasarımdaki gibi.

---

## Karar 3: iki yeni bileşen `components/sayfa/konum/` altında

- **`IletisimSatiri`**: tasarımda tek kullanım yeri var (`Konum:127-147`).
  Footer'ın `AltBilgi.module.css:282` `.iletisimSatiri`'si aynı ad, farklı şey:
  kutusuz, kenarlıksız, `14.5px` tek satırlık bir bağlantı. Ortak bir primitif
  çıkarmak iki yapıyı da bozardı.
- **`AlkolsuzRozeti`**: tek kullanım yeri (`Konum:119-122`). `alkolsuzKisa`
  metni footer'da da geçiyor ama orada düz metin, rozet değil.

İkisi de sayfaya özel, `components/ui/` değil `components/sayfa/konum/`.

### `IletisimSatiri`: alt satırın iki tipografisi (S13)

| `tur` | Kullanım | Tasarım | Ölçülen |
| --- | --- | --- | --- |
| `deger` | Telefon (`Konum:131`) | `400 14px/1` + tabular-nums | `400 14px/14px`, `tabular-nums` |
| `aciklama` | WhatsApp (`:138`), Instagram (`:145`) | `400 14px/1.4`, tabular **yok** | `400 14px/19.6px`, `normal` |

S12 böylece yapıya girdi: yer tutucu olan tek alt satır telefonunki
(`TELEFON_YER_TUTUCU`); diğer ikisi sözlükteki sabit açıklama cümleleri ve
hesap bilinmese de aynen basılıyor.

### Satırın etkileşimi: sapma, kayıtlı

Tasarım üç satırı da `cursor:pointer` taşıyan `<div>` olarak çiziyor ama hiçbirine
hedef vermiyor. `isletme.telefon`, `whatsapp` ve `instagram` bugün **üçü de
`null`**. Port: hedef varsa gerçek `<a>` (hover kenarlığı `--tangerine-70`, hover
zemini `--tangerine-07`), yoksa düz `<div>`, imleçsiz ve hover'sız. `Buton`'un
`.pasif` sönükleştirmesi (`opacity:.55`) burada **uygulanmadı**: satır bir devre
dışı kontrol değil, henüz bağlantısı olmayan bir bilgi ve metni her hâlükârda
okunmalı. Ölçülen: `cursor:auto`, kenarlık `1px rgba(242,233,220,.14)`, opaklık 1.

---

## Ölçüm tablosu

1440x900, `getComputedStyle`. "Tasarım" sütunu `Konum Sayfasi.dc.html`.

### Açılış (`Konum:63-86`)

| Ne | Tasarım | Ölçülen |
| --- | --- | --- |
| bölüm dolgusu | `172px clamp(24px,5vw,64px) 54px` | `172px 64px 54px` |
| durum satırı | `flex; wrap; center; gap:14px 20px; margin-bottom:22px` | birebir |
| durum çipi | `9px 15px`, `.62` zemin, `1px .3`, nokta 8px, metin `600 13.5px/1` | `DurumCipi boy="kucuk"`, birebir |
| canlı saat | `700 clamp(24px,2.6vw,34px)/1`, tabular, `-.02em` | `CanliSaat boy="kucuk"`, birebir |
| saat etiketi | `400 13.5px/1`, `rgba(242,233,220,.62)` | `400 13.5px/13.5px`, `--krem-62` |
| H1 | `800 clamp(48px,7.4vw,116px)/1.02`, `-.03em`, `0 8px 50px rgba(10,8,7,.7)` | 106.56px / 108.69px / -3.1968px / birebir gölge |
| H1 metni | iki satır, `<br>` | `Naci Talat` + `Caddesi, Girne` |
| adres satırı | `flex; gap:10; flex-start; margin-top:22px`, `.78` | birebir |
| adres pin | 16px, `flex:none; margin-top:4px`, `#FAAA1F` | birebir |
| adres metni | `400 clamp(16px,1.4vw,19px)/1.6`, iki satır | 19px / 30.4px, iki satır |
| CTA satırı | `flex; wrap; gap:12; margin-top:32px` | birebir |
| birincil buton | `19px 32px`, `16px`, `0 12px 34px rgba(183,53,28,.4)` | `18px 30px`, `16px`, **gölge birebir** (aşağıda) |
| hayalet buton | `18px 28px`, `16px`, `1px .38`, `rgba(10,8,7,.4)`, ikon 15px, `gap:9px` | `17px 29px`, `16px`, `1px .36`, birebir zemin, ikon 15px, gap 9 |

### Harita (`Konum:88-103`)

| Ne | Tasarım | Ölçülen |
| --- | --- | --- |
| bölüm | `<section id="harita">`, `10px clamp(24px,5vw,64px) 60px` | `10px 64px 60px`, id yerinde |
| çapa payı | `- 96` (`Konum:252`) | `scroll-margin-top: 96px`, `Kabuk`'tan |

Levha ölçümleri yukarıdaki tabloda.

### Saatler ve İletişim (`Konum:105-150`)

| Ne | Tasarım | Ölçülen |
| --- | --- | --- |
| bölüm | `20px clamp(24px,5vw,64px) 70px; flex; wrap; gap:clamp(24px,3vw,44px)` | `20px 64px 70px`, gap 43.2px |
| kart | `flex:1 1 440px; min-width:300px; padding:clamp(26px,2.8vw,40px); rgba(10,8,7,.74); 1px .1; column; gap:22px` | birebir, dolgu 40px, `backdrop-filter: none` |
| kart başlığı | `700 clamp(26px,2.8vw,38px)/1.14`, `-.02em`, krem | 38px / 43.32px / -0.76px / Bricolage |
| tablo satır 1 | `16px 14px`, alt çizgi `.12`, zemin `rgba(250,170,31,.07)`, `600 16px` krem + tangerine | birebir |
| tablo satır 2 | `16px 14px`, alt çizgi `.1`, `400 16px`, `.76` | birebir |
| tablo notu | `16px 14px`, `400 14.5px/1.65`, tabular, `.68`, alt çizgi yok | `14.5px/23.925px`, tabular, `.68`, `border-bottom-width:0` |
| alkolsüz rozeti | `13px 16px`, `1px .14`, nokta 7px `#FAAA1F` **animasyonsuz**, `500 14px/1`, `.74` | birebir, `animation-name: none` |
| satır listesi | `column; gap:12px` | birebir |
| iletişim satırı | `flex; center; gap:14; 18px 20px; 1px .14` | birebir |
| satır ikonu | 17px, `flex:none`, `#FAAA1F` | birebir (Instagram stroke tabanlı) |
| metin yığını | `column; gap:5px` | birebir |
| satır etiketi | `600 14.5px/1`, krem | birebir |

### Paket şeridi (`Konum:152-163`)

`<PaketSeridi dil={dil} />`, sıfır prop, iki buton: `Paket sipariş` + telefon.
İkinci bir kopya yazılmadı. Ölçülen: iki buton, ikisi de `aria-disabled` (numara
`null`), şerit `#E96112`, `03-konum.jpg` ile aynı yerde.

---

## Buton boyları: hiçbir adım birebir değil (E4)

`Buton`'un merdiveni ön geçişte karara bağlandı ve bu turda dokunulmadı.

| Buton | Tasarım | Uygulanan (`boy="lg"`) | Fark |
| --- | --- | --- | --- |
| hero birincil (`Konum:80`) | `19px 32px`, 16px | `18px 30px`, 16px | **-1px dikey, -2px yatay**; punto birebir |
| hero hayalet (`Konum:81`) | `18px 28px`, 16px, kenarlık `.38` | `17px 29px`, 16px, kenarlık `.36` | **-1px dikey, +1px yatay**, kenarlık -0.02 |

`lg` seçildi çünkü **punto** birebir tutuyor (16px); `xl` 16.5px basar ve dolgu
farkı büyür (`20/34` vs `19/32`). Gölge tarafında şans eseri tam isabet:
tasarımın `0 12px 34px rgba(183,53,28,.4)` değeri `--kor-golge` ile birebir aynı.

### İkonlu butonun 3px'i: ölçüldü, doğrulanamadı

Task 10 "ikonlu butonun yatay dolgusu tasarımda tam 3px kısa" diye raporlamıştı
ve Konum hero'sunun 3px fazla basacağını söylemişti. **Ölçüm bunu bu sayfada
doğrulamıyor**, çünkü iki iddia farklı referanslara dayanıyor:

- Task 10'un ölçüsü tasarımın **kendi** adımına göre: `Konum:80` dolu buton
  `19px 32px` ise kenarlıklı karşılığı `18px 31px` olurdu, tasarım `18px 28px`
  yazıyor, yani ikon için -3px.
- Uygulama o adımı hiç basmıyor: `lg` bir adım küçük. `cerceveli.lg` = `17px 29px`.
  Tasarımın istediği `18px 28px`'e göre yatayda **+1px**, -3px değil.
- `Buton`'a Task 10'un önerdiği ikonlu adım eklenseydi (`padding-inline` 3px kısa)
  `17px 26px` çıkardı, bu sefer tasarımın 28px'ine göre **-2px**.

Yani bu sayfada ikonlu adımın eklenmesi tek başına farkı kapatmıyor; kapatan şey
`lg` ile tasarımın gerçek adımı (19/32) arasındaki 1-2px. Ana sayfanın paket
WhatsApp butonundaki -3px (`Ana:346` `17px 26px` vs uygulanan `17px 29px`) hâlâ
geçerli ve tek başına çelişkisiz. `Buton`'a dokunmadım, yerel override yazmadım.

---

## Kontrast: yeni (sönük) kor sahnesine karşı ölçüldü

`4f8b085` sonrası iç sayfa sahnesi (`kor .55`, `çekirdek .26`, iki puf, sabit)
kullanılıyor. Ölçüm yöntemi: **viewport** ekran görüntüsü, `fullPage` **değil**.
Sahne `position:fixed; height:100vh` olduğu için `fullPage` yakalaması sahneyi
belge boyuna geriyor ve zemini olduğundan parlak gösteriyor; ilk turda tam da bu
yanlış zemin üç sahte "AA FAIL" üretti. Her metin ayrıca sahnenin en parlak
yerine, yani viewport'un 700-900 bandına kaydırılıp yeniden ölçüldü.

| Metin | Alfa | En kötü oran | Sonuç |
| --- | --- | --- | --- |
| hero adres metni (19px, sahne üstünde, panelsiz) | `.78` | 10.05:1 | AA |
| hero saat etiketi (13.5px, panelsiz) | `.62` | 6.58:1 | AA |
| hero birincil buton etiketi (kor zemin) | 1.0 | 4.93:1 | AA |
| hero hayalet buton etiketi (`.pasif` .55) | 0.55 | 5.40:1 | AA |
| plaka cadde etiketi (12px) | `.55` | 5.37:1 | AA |
| plaka pin etiketi (13px) | 1.0 | 16.62:1 | AA |
| plaka POI çipi (11.5px) | `.66` | 7.35:1 | AA |
| plaka alt notu (12.5px) | `.68` | 7.77:1 | AA |
| tablo 2. satırı (16px) | `.76` | 9.57:1 | AA |
| tablo notu (14.5px) | `.68` | 7.77:1 | AA |
| alkolsüz rozeti (14px) | `.74` | 9.10:1 | AA |
| iletişim etiketi (14.5px) | 1.0 | 15.72:1 | AA |
| iletişim alt satırı, değer (14px) | `.68` | 7.60:1 | AA |
| iletişim alt satırı, açıklama (14px) | `.68` | 7.63:1 | AA |

**Hiçbir opaklık yükseltilmedi**; tasarımın kendi değerleri yeni sahnede geçiyor.
En dar marj hero'nun birincil butonunda (4.93:1) ve o krem/kor çifti sitenin
sabiti, bu sayfaya ait bir karar değil.

## Hareket azaltılmış (`prefers-reduced-motion: reduce`)

| Beklenen | Ölçülen |
| --- | --- |
| pin nabzı durur | `animation-name: none`, 800ms arayla opaklık 1 -> 1 |
| çapa anında zıplar | `scroll-behavior: auto`; tıklamadan 60ms sonra scrollY zaten 574, 900ms sonra da 574 |
| çapa payı korunur | `#harita` üst kenarı **96px** |
| satır ve buton geçişleri kapanır | `transition-duration: 0s` (ikisinde de) |

## 390x844 ve EN

| Kontrol | TR 390 | EN 390 | TR 1440 | EN 1440 |
| --- | --- | --- | --- | --- |
| yatay taşma | 0 | 0 | 0 | 0 |
| H1 | 48px, iki satır | 48px, `Naci Talat / Street, Kyrenia` | 106.56px | 106.56px |
| kartlar | alt alta (x=24, w=342) | alt alta | yan yana (634+634) | yan yana |
| çapa payı | 96px | 96px | 96px | 96px |
| konsol hatası | yok | yok | yok | yok |

Kartların dar ekranda sarması `flex-wrap` + `min-width:300px`'ten geliyor, ayrı
bir medya sorgusu yazılmadı; `02-konum.jpg` bu hali gösteriyor.

**Dokunma hedefleri, ölçülen yükseklikler:** hero butonları 56px, iletişim
satırları 71.5 / 77.1 / 77.1 (EN 390'da WhatsApp satırı 96.7), paket butonları
56px. Hepsi 44px üstünde. Bütün `<a>`, `<button>` ve `aria-disabled` hedeflerinin
dikdörtgenleri çift çift kesiştirildi: **çakışma yok** (dört genişlikte de).
Üç iletişim satırı yan yana değil alt alta duruyor, aralarında 12px var.

## 16px altı metin (KISITLAR 3. katman, sayfa başına bir kez)

Bu sayfada gerçek prose olup 16px'in altına inen tek yer **iletişim satırlarının
açıklama alt satırları: 14px/1.4** (`Konum:138, 145`). `KISITLAR.md`'nin 3.
katmanı bunu adıyla kaydediyor; yuvarlanmadı, tartışılmadı. Sayfanın 16px altı
kalan bütün metinleri 2. katman (arayüz mikro metni): plaka etiketleri 11.5-13px,
tablo notu 14.5px, rozet 14px, satır etiketi 14.5px, durum satırı 13.5px,
telefon alt satırı 14px (veri, prose değil). Okuma metni olan adres satırı
16-19px, yani taban bağlıyor ve geçiyor.

## Token durumu

`styles/tokens.css`'e **dokunulmadı, yeni token eklenmedi.** Ön geçişin eklediği
ve bu sayfaya ait olan token'ların hepsi kullanıldı: `--ol-hero-konum`,
`--iz-duygusal`, `--golge-baslik`, `--ol-spot`, `--ol-kart-baslik`, `--iz-bolum`,
`--panel-60`, `--cizgi-harita`, `--cizgi-harita-ince`, `--cizgi-hayalet`,
`--kor-halka-konum`, `--kor-pin-halka`, `--kor-pin-parilti`, `--tangerine-40`,
`--tangerine-70`, `--tangerine-07`, `--krem-55`, `--krem-62`, `--krem-68`,
`--krem-74`, `--krem-78`, `--cizgi`, `--cizgi-bolum`, `--kart-ic-dar`.

Ham yazılan değerler ve gerekçeleri:

| Değer | Nerede | Neden ham |
| --- | --- | --- |
| `172px ... 54px`, `10px ... 60px`, `20px ... 70px` | üç bölümün dolgusu | bölüm başına tek kullanımlık dolgu; `menu/Acilis.module.css:6` aynı deseni (172px, yorumlu, ham) zaten kurmuş |
| `clamp(24px,3vw,44px)` | kart bölümünün gap'i | `--kart-ic-orta` `clamp(28px,3vw,44px)`, **alt ucu farklı**; yuvarlamak sessiz sapma olurdu. Tek kullanım |
| `22px`, `12px`, `5px`, `14px` | kart ve satır aralıkları | aralık merdiveni token'lı değil, repo geneli boyunca ham |
| `52px` ızgara adımı, `54%/16px`, `20%/9px`, `64%/7px`, `42%/47%`, `110px`, `18px`, `-46px 0 0 18px` | levhanın geometrisi | koordinat ve ölçü, renk değil; token ailesi ölçü/renk taşıyor, geometri taşımıyor |

## Tasarımda karar değil, gözden kaçma gibi duran şeyler

1. **H1'in `data-en` değeri yanlış.** `Konum:74` iki satırlık başlığa
   `data-en="Location"` veriyor, yani İngilizce'ye çevrildiğinde başlık
   `Naci Talat / Caddesi, Girne` yerine tek kelime `Location` olurdu. İçerik
   katmanı bunu zaten düzeltmiş (`content/en/konum.ts:5-6`: `Naci Talat` /
   `Street, Kyrenia`) ve sözlük esas alındı. Aynı hata `Konum:52`'de nav
   etiketiyle çakışmıyor, yani tek dosyalık bir kopyala-yapıştır kayması gibi
   duruyor. **Bildiriyorum, sessizce kopyalamadım.**

2. **Levhanın mobil hali tasarımda yok ve 390px'te bir POI çipi kırpılıyor.**
   Ölçüldü: 390px'te levha 342px genişliyor, üçüncü çip (`left:66%`,
   `white-space:nowrap`, 133px) levhanın sağ kenarını **17px** aşıyor ve
   `overflow:hidden` onu kesiyor. Diğer bütün katmanlar sığıyor. Bu tasarımın
   kendi sonucu: yüzdeyle konumlanan, sarmayan etiketler dar levhada taşar.
   **Düzeltmedim**, çünkü tasarımın mobil cevabı bir ölçü ayarı değil, yapı
   değişikliği: `Mobil Prototip.dc.html:169-174` harita levhasını **etiketsiz**
   çiziyor (cadde adı, pin etiketi, POI çipi ve alt not yok; 180px yükseklik,
   40px ızgara, 60px halka, 14px pin, `.55` zemin). Yani üçüncü bir levha var ve
   o levha bu sayfanın değil, mobil prototipin ana sayfasının. Sahibine soru:
   Konum sayfasının levhası dar ekranda etiketlerini mi bırakmalı, yoksa mobil
   prototipin sade haline mi düşmeli?

3. **Üç iletişim satırı da tasarımda `cursor:pointer` ama hiçbirinin hedefi yok.**
   `Ocaktan` menü satırlarında verilen kararla aynı: hedefi olmayan
   `cursor:pointer` sahte tıklanabilirlik izlenimidir. Veri geldiğinde satır
   gerçek `<a>` olur ve ölçüler değişmez.

## Sahibine / diğer görevlere açık kalanlar

1. **Levhanın mobil hali** (yukarıda, madde 2). Tek gerçek açık soru.
2. **`Buton`'un `lg` adımı Konum hero'sunu 1-2px kaçırıyor** (19/32 ve 18/28).
   Ön geçişin merdiven kararı kayıtlı; yeni bir `boy` adımı eklemek üç sayfayı
   da ilgilendirir, tek sayfadan karara bağlanmamalı.
3. **`Buton`'un ikonlu dolgu adımı** hâlâ açık ama bu sayfa için tek başına
   yeterli değil (yukarıda ölçüldü). Ana sayfanın paket WhatsApp butonundaki
   -3px için hâlâ geçerli.
4. **`isletme.instagram` formatı** (kullanıcı adı mı, tam URL mü): satır bugün
   `AltBilgiTam.tsx:21` ile aynı varsayımı yapıyor (`https://instagram.com/${...}`).
   Alan `null` olduğu için bugün etkisi yok, veri geldiğinde iki yerde birden
   doğrulanmalı.
5. **`aciklama` alt satırlarının 14px/1.4'ü** KISITLAR 3. katmanına bu raporla
   kaydedildi; yeniden tartışılmamalı.

## Öz denetim ve endişeler

1. `SaatTablosu`'nun varyant adları sayfa adı taşıyor. Ayırt edici başka bir
   eksen bulamadım; üçüncü bir tablo çıkarsa (mobil prototipin `13px 10px`
   dolgulu, `14.5px` puntolu tablosu, `Mobil:176-178`) bu adlandırma zorlanır ve
   o zaman gerçek bir eksen aranmalı.
2. Levhanın POI çipleri `Cip tur="poi"` ile basılıyor ama konumlandırma için her
   biri bir sarmalayıcı `<span>` içinde. `Cip`'e `className` prop'u eklemek
   sarmalayıcıları kaldırırdı; eklemedim çünkü "konumlandırmayı levha yapar"
   ayrımı (denetim E9) bu haliyle daha net duruyor ve `Cip` altı türün ortak
   dosyası.
3. Hero'nun hayalet butonu bugün `.pasif` ile `opacity:.55` basıyor (telefon
   `null`). Tasarım onu tam opaklıkta gösteriyor ama oradaki numara da yer
   tutucu. Ölçtüm, kontrastı geçiyor (5.40:1). Bu sitenin `Buton` genelindeki
   kararı, sayfaya özel değil.
4. `HaritaPlakasi`'nın `children` prop'unu sildim. Task 10 onu yalnız Konum'un
   POI çipleri için eklemişti ve Konum kendi levhasını yazdığı için ölü kaldı.
   Ana sayfa tarayıcıda yeniden ölçüldü: levha 8 katman, zemin `.55`, ızgara
   50px, üç metin yerinde, konsol temiz.
5. Paket şeridi ve footer benim kapsamımda değildi ama sayfanın altında
   duruyorlar; `03-konum.jpg` ile karşılaştırıldı, şerit doğru yerde. Footer'ın
   "Sayfalar" kolonu üç bağlantı basıyor (kabuk turunun kayıtlı sapması).
