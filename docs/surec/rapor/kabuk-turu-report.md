# Kabuk turu raporu: sayfa varyantları (O2, O7, O8)

Kapsam: `UstBar` sayfa varyantları (O7), `AltBilgi` sayfa varyantları (O8),
sayfa içi çapa payı (O2). Üçü de kapandı.

Spec kaynağı her satırda `.dc.html` dosyasının kendisi. Brief'in verdiği
türetilmiş değerler tek tek kaynağından teyit edildi; ikisinin yanıldığı yer
aşağıda "Brief'in yanıldığı yerler" başlığında.

## Kapılar

| Kapı | Sonuç |
| --- | --- |
| `npm run typecheck` | temiz |
| `npm test` | 60/60 geçti (51 idi, `lib/kabuk.test.ts` ile 9 test eklendi) |
| `npm run build` | temiz, 14 rota |
| Geçici rota | hiç açılmadı; kabuk beş gerçek rotanın hepsinde ölçüldü |
| 1440px ölçüm | beş TR + dört EN rotası |
| 390px ölçüm | ana + menü; yatay taşma 0 |

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

## Yeni imzalar (sayfa görevleri bunu okuyacak)

Sayfa görevlerinin doğrudan çağırdığı tek bileşen `Kabuk` ve **imzası
değişmedi**: `Kabuk({ dil, aktif, children })`. Varyant seçimi `aktif`'ten
türetilir, yeni bir kanal yok.

```ts
// components/layout/UstBar.tsx
export function UstBar({ dil, aktif }: { dil: Dil; aktif: RotaAnahtari })
// `ilerleme?: boolean` prop'u KALDIRILDI: aktif === 'ana' zaten aynı bilgiydi.

// components/layout/AltBilgi.tsx  (yalnız dağıtıcı)
export function AltBilgi({ dil, aktif }: { dil: Dil; aktif: RotaAnahtari })
// `dil`-only imza KALDIRILDI. Üç varyant üç ayrı dosyada:
//   AltBilgiTam({ dil, aktif })       ana, gizlilik
//   AltBilgiSayfalar({ dil, aktif })  hikaye, konum
//   AltBilgiSerit({ dil })            menu
//   TelifSeridi({ dil, aktif, sikMi? })  ilk ikisinin paylaştığı şerit

// components/sayfa/Kabuk.tsx  (değişmedi)
export function Kabuk({ dil, aktif, children }: { dil: Dil; aktif: RotaAnahtari; children: React.ReactNode })
```

Varyant tablosunun kendisi `lib/kabuk.ts` içinde, saf ve testli:

```ts
export function ustBarVaryanti(aktif: RotaAnahtari): {
  anaVaryantMi: boolean          // true: 80px satır + ilerleme rayı; false: 78px
  nav: NavOgesi[]                // { tur:'rota', rota, etiket } | { tur:'capa', hedef, etiket }
  cta: UstBarCta                 // { tur:'harici' } | { tur:'rota', rota } | { tur:'capa', hedef }
}
export function altBilgiVaryanti(aktif: RotaAnahtari): 'tam' | 'sayfalar' | 'serit'
export function altBilgiSayfaLinkleri(aktif: RotaAnahtari): { rota: RotaAnahtari; etiket: NavEtiketi }[]
```

`NavOgesi.etiket` bir `ortak.nav` anahtarıdır; metin JSX'te değil sözlükte.
Aktif sekme için ayrı bayrak yok: navdaki bir `rota` öğesi bulunulan rotaya
eşitse işaretlenir. Bu kural dört tasarım dosyasının dördünü de birebir
üretiyor, menü sayfası dahil (menü nav'ında `menu` öğesi yok → aktif sekme yok).

### Sayfa görevlerini ilgilendiren üç sonuç

1. **Menü sayfası** `#ocaktan`, `#ikramlar`, `#icecekler` id'lerini koymak
   zorunda: üst bar bu üç çapayı artık gerçekten basıyor.
2. **Konum sayfası** `#harita` id'sini koymak zorunda: üst barın CTA'sı oraya
   gidiyor.
3. **Çapa payı elle verilmez.** `Kabuk`, ana sayfa dışındaki rotalarda
   `<main>`'e `Kabuk.module.css`'in `.icSayfa` sınıfını basar ve o sınıf
   `[id]` taşıyan her torununa `scroll-margin-top: 96px` verir. Bölüm başına
   tekrar gerekmiyor, `Bolum` kullanılmasa da çalışıyor.

## O7: `UstBar` varyantları, ölçülen ve tasarımdaki

Bar kabuğu (`.dc.html` → ölçülen, 1440px):

| Değer | Ana (`Ana:40-46`) | ölçülen | İç (`Menu/Hikaye/Konum:37-42`) | ölçülen |
| --- | --- | --- | --- | --- |
| Sabit bar toplam yükseklik | 2px ray + 80px satır = 82 | **82** | 78 (ray yok) | **78** |
| Satır yüksekliği | 80 | **80** | 78 | **78** |
| Zemin | `.9 → 0` | **`rgba(10,8,7,.9) → rgba(10,8,7,0)`** | `.94 → .55` | **`rgba(10,8,7,.94) → rgba(10,8,7,.55)`** |
| Sağ grup / nav gap | 30 | **30** | 28 | **28** |

Nav ve CTA (brief'in "ölç" hücreleri dolduruldu):

| Sayfa | Nav (tasarım) | ölçülen | Aktif sekme | CTA (tasarım) | ölçülen |
| --- | --- | --- | --- | --- | --- |
| Ana `Ana:54-61` | Menü / **Gece** (`data-git=gece`) / Hikaye / Konum | aynı | yok | hedefsiz `<div>` `Ana:61` | `yolTarifiUrl()` (harici) |
| Menü `Menu:50-58` | **Ocaktan / İkramlar / İçecekler** (`data-git`) / Hikaye / Konum | aynı | **yok** | hedefsiz `<div>` `Menu:58` | `yolTarifiUrl()` (harici) |
| Hikaye `Hikaye:50-56` | Menü / **Hikaye (aktif)** / Konum | aynı | **Hikaye** | `<a href="Konum Sayfasi">` | `/konum/` |
| Konum `Konum:50-56` | Menü / Hikaye / **Konum (aktif)** | aynı | **Konum** | `data-git="harita"` | `#harita` |
| Gizlilik | tasarımda yok | Menü / Hikaye / Konum | yok | (yok) | `yolTarifiUrl()` |

Aktif sekme stili (`Hikaye:51`, `Konum:52`): `font:600 15px/1`, `#FAAA1F`,
`padding-bottom:2px`, `border-bottom:2px solid #FAAA1F`.
Ölçülen: `600 | rgb(250,170,31) | 2px solid rgb(250,170,31) | 2px`. Birebir.

EN katmanı ayrıca ölçüldü: menü çapalarının etiketleri `data-en`'den geliyor
(`From the fire / On the house / Drinks`), `/en/hikaye/` CTA'sı `/en/konum/`,
`/en/konum/` CTA'sı `#harita`.

### `Cekmece` ve `MobilAksiyonBari`: kapsam dışı, doğrulandı

`Mobil Prototip.dc.html` **tek bir ekran** taşıyor ve onu iki kez basıyor
(satır 55 etkileşimli kopya, satır 245 kaydırmasız statik kopya). İkisi de ana
sayfa; sayfa başına ikinci bir çekmece veya ikinci bir alt eylem barı yok.
Çekmecenin link listesi (satır 199-203) her iki kopyada aynı, alt eylem barı
(satır 190-192, 378-380) aynı üç hedef. Yani mobil kabuk sayfa farkı
**taşımıyor**, kapsam dışı kaldı.

## O8: `AltBilgi` varyantları, ölçülen ve tasarımdaki

### Varyant 1: `tam` (ana, gizlilik) — değişmedi

`Ana:351-386`. Ölçüm ana sayfada bozulmadığını doğruladı: dolgu `64px 60px 32px`,
kolon `gap:13px` (ilk kolon 14), telif şeridi `46px / 20px`, dört kolon
(marka+tanım / Adres / Saatler / İletişim), telif metni
`© 2026 Ciğerci Bozo · Girne / KKTC · Gizlilik`. Ana sayfanın dört bölümünün
`scroll-margin-top`'u hâlâ **70px**.

Tek davranış değişikliği: `/gizlilik/` rotasının kendi telif şeridinde artık
"Gizlilik" bağlantısı basılmıyor (kendine giden ölü bağlantı). Diğer dört
rotada yerinde.

### Varyant 2: `sayfalar` (hikaye, konum) — yeni

| Değer | Tasarım (`Hikaye:134-162`, `Konum:166-193`) | Ölçülen |
| --- | --- | --- |
| Kabuk dolgusu | `56px clamp(24px,5vw,64px) 30px` | **`56px 60px 30px`** |
| Zemin / üst çizgi | `rgba(10,8,7,.9)` / `1px solid rgba(242,233,220,.1)` | **aynı** |
| Kolon satırı | `flex-wrap; justify-content:space-between; align-items:flex-start; gap:30px 56px` | **`flex-start \| 30px \| 56px \| space-between`** |
| Kolon içi gap | 12px (dördü de) | **12,12,12,12** |
| 1. kolon `max-width` | 280px | **280px** |
| Wordmark | `800 20px/1 -.03em #F2E9DC` | **800 \| 20px \| -0.6px** |
| Adres bloğu | `400 14.5px/1.7 rgba(...,.66)`, üç satır | **14.5px \| 24.65px \| .66** |
| Kolon başlıkları | `600 14.5px/1 #F2E9DC` | **600 \| 14.5px \| #F2E9DC** |
| Sayfalar bağlantıları | `400 14.5px/1 rgba(...,.7)`, hover `#FAAA1F` | **400 \| 14.5px \| .7** |
| Saatler kolonu | 2 satır: `Her gün 10:00 - 05:00` (tabular) + `Mekanımız alkolsüzdür` | **aynı, tabular-nums yalnız 1. satırda** |
| İletişim kolonu | 2 satır: `000 000 00 00` (tabular) + `WhatsApp · Instagram` | **aynı** |
| Telif şeridi | `margin-top:40px; padding-top:18px; border-top .09; gap:14px` | **40px / 18px / `1px solid rgba(242,233,220,.09)` / 14px** |
| Telif metni | `400 12.5px/1 rgba(...,.5)` | **400 \| 12.5px \| .5** |
| Tane rayı | 7/4, gap 4, `opacity:.45` | **0.45** |

Sözlük anahtarları: `ortak.footer.sayfalarBaslik` (yetim sanılan anahtar,
gerçekten buranın), `ortak.footer.sosyal` = `WhatsApp · Instagram` (**ikinci
yetim anahtar, o da buranın**), `ortak.satirlar.saatlerGunluk`,
`ortak.alkolsuzKisa`, `isletme.cadde` / `binaNo` / `ortak.satirlar.adresSehirUlke`,
`TELEFON_YER_TUTUCU`. Yeni metin yazılmadı.

### Varyant 3: `serit` (menu) — yeni

| Değer | Tasarım (`Menu:283-292`) | Ölçülen |
| --- | --- | --- |
| Kabuk | `padding:60px clamp(24px,5vw,64px); background:rgba(10,8,7,.9); border-top:1px solid rgba(242,233,220,.1); flex; wrap; center; space-between; gap:26px` | **`60px 60px` / `rgba(10,8,7,.9)` / `1px solid rgba(242,233,220,.1)` / `flex \| wrap \| center \| space-between \| 26px`** |
| Sol kolon | `column; gap:9px` | **9px** |
| Wordmark | `800 20px/1 -.04em` Bricolage | **800 \| 20px \| -0.8px \| Bricolage Grotesque** |
| Satır | `400 14.5px/1.6` Inter, tabular, `rgba(...,.68)`, metin `Girne, Naci Talat Caddesi · Her gün 10:00 - 05:00` | **14.5px \| 23.2px (=1.6) \| .68 \| tabular-nums \| metin birebir** |
| Buton grubu | `wrap; gap:12px` | **12px** |
| Birincil | `#B7351C; padding:17px 28px; 600 15.5px/1`, **box-shadow yok** | **17px 28px \| 15.5px**, ama `rgba(183,53,28,.4) 0 12px 34px` **var** (sapma, aşağıda) |
| İkincil | `border:1px solid rgba(242,233,220,.36); padding:16px 27px; 600 15.5px/1; tabular`, hover yalnız `border-color:rgba(250,170,31,.85)` | **16px 27px \| 15.5px \| `1px solid rgba(242,233,220,.36)`**, hover'da ek zemin (sapma) |
| Telif şeridi | **yok** | **yok** |
| Dokunma hedefi | 44px kuralı | ölçülen buton yüksekliği **53px** |

`Buton boy="md"` tasarımın bu iki kutusuyla dolgu ve punto olarak **birebir**
eşleşiyor; `Buton` bu turda dokunulmaz dosya olduğu için gölge ve hover zemini
farkı sapma olarak raporlandı, sessiz bir sayfa override'ı yazılmadı.

**Telif şeridi sorusu (brief "ölçün" dedi):** üç varyanttan ikisinde var
(`Ana:381`, `Hikaye:157`, `Konum:188`), menü şeridinde **yok**. Bunun bir yan
etkisi: Gizlilik'e giden tek bağlantı telif şeridinde olduğu için menü sayfası
Gizlilik'e bağlantı taşımıyor. Beş rotanın dördü taşıyor, sayfa uydurulmadı.

## O2: 96px / 70px ayrımının gerçek sebebi

Ölçüldü. **Sebep barın yüksekliği değil, hatta bar yüksekliği farkı ters
yönde.**

| | Ana sayfa | İç sayfalar |
| --- | --- | --- |
| Sabit bar | 2px ilerleme rayı + 80px satır = **82px** | 78px, ray yok |
| Çapa payı | **70px** (`Ana:554`) | **96px** (`Menu:347`, `Konum:252`) |
| Pay eksi bar | **-12px** (hedefin tepesi barın altına düşer) | **+18px** (barın altında boşluk kalır) |

Daha yüksek bar daha küçük payı alıyor; yani iki değer aynı bardan
türetilmemiş. Sebep çapanın **indiği yerin kendisi**:

- Ana sayfada her `data-git` hedefi `min-height:100vh` + `padding:120px` +
  dikey ortalanmış bir bölüm (`Ana:86,128,169,219,244,269,296`). Kutunun
  tepesinde görünür hiçbir şey yok, 70px barın 12px altına düşse de kimse
  görmez; pay pratikte serbest.
- Menü ve Konum'da hedefler düz akış bölümleri ve içerik kutunun tepesinden
  başlıyor: `#ocaktan` `padding:0 ... 40px` (`Menu:85`, üst dolgu **sıfır**),
  `#harita` `padding:10px ...` (`Konum:88`), `#icecekler` 60px, `#ikramlar` 70px.
  En dar durum `#ocaktan`: 70px pay orada "Ocaktan" başlığını 78px'lik barın
  **8px altına** sokardı. 96px, aynı durumda 18px'lik görünür bir nefes payı
  bırakır.

Yani çeşitlilik **açıklanabilir**, brief'in "aynı bara denk geliyorsa
normalize et" şartı gerçekleşmedi. İki pay da korundu:

- 70px `components/ui/Bolum.module.css:12`'de, bölümün kendisinde. Yalnız ana
  sayfa `Bolum` kullanıyor (O1: üç iç sayfada `data-erit`/`data-yogunluk` sıfır
  kez geçiyor), dolayısıyla o pay ana sayfada kalıyor.
- 96px `components/sayfa/Kabuk.module.css`'te, `.icSayfa [id]` seçicisiyle,
  `<main>` kapsamında. Sayfa görevleri bölüm başına tekrar etmez; `Bolum`
  kullanılmasa da çalışır; ana sayfa `<main>`'i bu sınıfı hiç almaz.

Ölçüm doğrulaması: ana sayfada dört bölümün dördü de `70px`; `/menu/` ve
`/konum/` içine geçici bir `<section id>` enjekte edilip okunan değer `96px`.

## Brief'in yanıldığı yerler

Brief'in tabloları türetilmiş bir taramadan geliyordu; iki hücre kaynağa
uymuyor.

**1. `AltBilgi` tablosu: "Dört kolon ama ikinci kolon Sayfalar" eksik bir
tarif.** Hikaye/Konum footer'ı ana sayfanınkinden **dört yerde** ayrılıyor,
bir yerde değil:

| | `tam` (Ana:351) | `sayfalar` (Hikaye:134) |
| --- | --- | --- |
| Dış dolgu | 64 / 32 | **56 / 30** |
| Kolon satırı gap ve hizası | `38px 56px`, hiza yok | **`30px 56px`, `align-items:flex-start`** |
| Kolon içi gap | 13px (ilk 14) | **12px, dördü de** |
| 1. kolon | tane rayı + wordmark + tanım cümlesi | **wordmark + üç satırlık adres**, tane rayı ve tanım yok |
| 2. kolon | Adres (pin ikonu + adres + "Yol tarifi al" bağlantısı) | **Sayfalar** (bağlantı listesi) |
| 3. kolon | 3 satır (`kapaliAralik` dahil) | **2 satır** |
| 4. kolon | 3 ikonlu satır (telefon / WhatsApp / Instagram) | **2 ikonsuz satır**, WhatsApp ve Instagram tek satırda |
| Telif şeridi | 46 / 20 | **40 / 18** |

**2. Brief `Ana sayfa / Menü / Konum` listesini iki sayfa için de verdi;
Konum'unki farklı.** Kaynak: `Hikaye:142-144` üç bağlantı
(`Ana sayfa / Menü / Konum`), `Konum:174-175` **iki** bağlantı
(`Ana sayfa / Menü`). Konum listesi bulunulan sayfayı düşürdüğü gibi kardeş
sayfa **Hikaye'yi de** düşürmüş. Bu tasarımın kendi kuralıyla çelişiyor ve
karar değil gözden kaçma gibi duruyor (aşağı bakın).

Brief'in doğru çıkan değerleri (hepsi teyit edildi): menü şeridinin dokuz
ölçüsü, `--panel-koyu` / `--cizgi-soluk` / `--krem-68` / `--iz-sayfa-baslik`
karşılıkları, `adresVeSaat`'in karakteri karakterine uyması, `ortak.footer.
sayfalarBaslik`'in gerçekten Hikaye/Konum footer'ına ait olması, `Menu:50-54`
nav listesi, `Hikaye:56` ve `Konum:56` CTA hedefleri, 96/70 satır numaraları.

## Tasarımda karar değil, gözden kaçma gibi duran şeyler

1. **Konum footer'ının "Sayfalar" listesi Hikaye'yi atlıyor** (`Konum:174-175`).
   Kolonun kuralı Hikaye sayfasında açık: dört içerik rotası eksi bulunulan
   sayfa. Kolonun adı "Sayfalar", yani bir sayfa dizini; bir sayfayı atlayan
   dizin karar değil boşluk. Hikaye'ye bilerek bağlanmama okuması da düşüyor,
   çünkü Hikaye aynı sayfanın üst barında zaten bağlantılı.
   **Karar: kural uygulandı** (Konum'da üç bağlantı), `IYILESTIRMELER.md`'ye
   yazıldı, testle kilitlendi.

2. **Üst bar CTA'sı Ana ve Menü sayfalarında ölü.** `Ana:61` ve `Menu:58`'de
   `Yol tarifi al` kutusunun `data-git`'i de `href`'i de yok, yalnız
   `cursor:pointer` var. Hikaye ve Konum'da gerçek hedefi var. Port ölü kutu
   basamaz; Task 6'nın ana sayfa için verdiği karar (harici arama) menüde de
   uygulandı. İki okuma da savunulabilir olduğu için sahibine soruldu.

3. **Menü sayfasının dil anahtarında pasif renk `.5`** (`Menu:56`), Ana /
   Hikaye / Konum'da `.58` (`Ana:59`, `Hikaye:54`, `Konum:54`). Task 6 zaten
   `.58`'i çoğunluk olarak seçmişti; bu tur o kararı değiştirmedi, yalnız
   dördüncü dosyanın da sayımını doğruladı (üçe bir).

4. **Marka kelimesinin izi footer'lar arasında tutarsız:** `Menu:285` `-.04em`,
   `Ana:357` / `Hikaye:137` / `Konum:169` `-.03em`. Aynı `800 20px` kelime.
   İkisi de birebir uygulandı, sahibine bildirildi.

5. **Menü şeridinin birincil butonu gölgesiz** (`Menu:289`), oysa tasarımın
   diğer bütün birincil butonları gölgeli. Port `Buton`'un `birincil` gölgesini
   basıyor ve `Buton` bu turda dokunulmaz dosya. Sapma raporlandı.

6. **Menü sayfasında Gizlilik'e giden bağlantı yok**, çünkü menü şeridinde
   telif satırı yok. Tasarımda zaten hiçbir sayfada Gizlilik bağlantısı yoktu;
   port onu telif şeridine koymuştu ve menü şeridi telif şeridi taşımıyor.
   Yeni yerleşim uydurulmadı.

## Kendiliğinden bulunan ve düzeltilen: mobil footer okunmuyordu

Kapsamda olmayan ama ölçüm sırasında çıkan gerçek bir hata. 390x844'te, sayfa
sonuna kaydırıldığında sabit `MobilAksiyonBari` (y=767, 77px) telif şeridini
(y 778-812) **tümüyle** örtüyordu: telif metni ve Gizlilik bağlantısı mobilde
hiç görünmüyordu. Menü şeridinde aynı çakışma sayfanın tek kapanış CTA'sını
gömecekti.

Düzeltme: 780px altında (aynı eşik) üç varyanta da `padding-bottom:116px`.
Değer uydurulmadı, tasarımın kendi mobil footer'ından
(`Mobil Prototip.dc.html:181`, `:371`: `padding:30px 20px 116px`).
Düzeltme sonrası ölçüm: telif şeridi 694-728, barın **39px üstünde**.

## Token durumu

Bu tur **hiç token eklemedi**; `styles/tokens.css`'e dokunulmadı. Menü
şeridinin bütün değerlerinin karşılığı gerçekten vardı (`--panel-koyu`,
`--cizgi-soluk`, `--krem-68`, `--iz-sayfa-baslik`), Hikaye/Konum footer'ının
da (`--krem-66`, `--krem-70`, `--krem-50`, `--iz-duygusal` karşılığı ham
`-0.03em`).

Tek eksik: **`rgba(242,233,220,.09)`**, telif şeridinin üst çizgisi, üç
footer'da da aynı değer (`Ana:381`, `Hikaye:157`, `Konum:188`). `--cizgi*`
ailesinde karşılığı yok (`--cizgi-hayalet` `.08`, `--cizgi-soluk` `.1`).
Task 6'dan beri `AltBilgi.module.css`'te ham; bu turda da ham kaldı çünkü
`tokens.css` dokunulmaz dosyaydı. Token turuna raporlandı.

## Erişilebilirlik kararları

**Landmark adı: tek `Ana gezinme`, üç varyantta da.** Gerekçe: landmark adı
*aynı belgede birlikte bulunan* bölgeleri ayırmak içindir, sayfalar arası
varyantları değil. Herhangi bir sayfada üst barda tam olarak bir `<nav>` var.
Sitenin iki adı (`erisim.anaGezinme` masaüstü bar, `erisim.mobilGezinme`
çekmece) tam da birlikte bulunabildikleri için ayrı; `icerik.test.ts`'teki
`erisim_gezinmeBolgeleriFarkliAdTasir` testi bu modeli kilitliyor. Menü
sayfasına üçüncü bir ad vermek yeni bir sözlük anahtarı uydurmayı gerektirirdi.

**Footer'ın "Sayfalar" kolonu `<nav>` yapılmadı**, düz `<div>` kaldı. Aynı üç
hedef üst barda zaten adlandırılmış bir landmark içinde; footer'da ikinci bir
gezinme bölgesi landmark listesini yeni bir varış noktası eklemeden
kalabalıklaştırır. Sözlükte hazır bir landmark adı da yok
(`footer.sayfalarBaslik` görünen başlık metni, landmark adı değil).

**Aktif sekme `<span aria-current="page">`**, `<a>` değil: tasarımın kendisi de
aktif sekmeye `cursor:pointer` ve `data-git` vermiyor. `UstBar.module.css`'in
mevcut kararı korundu.

**44px dokunma hedefi:** menü şeridinin iki butonu ölçüldü, **53px**
(`Buton .taban` `min-height:44px` + `md` dolgusu). Yeni footer'ın "Sayfalar"
bağlantıları ve telefon satırı için 44px'e ulaşılamıyor: kolonun satır adımı
`gap:12px + 14.5px satır = 26.5px`, 44px'lik görünmez bir `::before` komşu
satırın alanına taşar ve yanlış hedefe dokunma riski üretir.
`AltBilgi.module.css`'in `.iletisimSatiri`'nde (fix round 3) verilen aynı
karar uygulandı: üst üste binmeyen en büyük yükseklik adımın kendisi, 26px.
Bu bir artık risk ve o dosyada zaten kayıtlı.

## Dokunulan dosyalar

Yeni:
- `lib/kabuk.ts`, `lib/kabuk.test.ts`
- `components/layout/AltBilgiTam.tsx`, `AltBilgiSayfalar.tsx`,
  `AltBilgiSerit.tsx`, `TelifSeridi.tsx`
- `components/sayfa/Kabuk.module.css`

Değişen:
- `components/layout/UstBar.tsx` (varyant tablosundan render, `ilerleme`
  prop'u düştü), `UstBar.module.css` (ölü `.navOgesi` kuralı silindi)
- `components/layout/AltBilgi.tsx` (dağıtıcıya indi), `AltBilgi.module.css`
  (üç varyantın ortak dosyası)
- `components/sayfa/Kabuk.tsx` (`aktif` artık `AltBilgi`'ye de gidiyor,
  `<main>` iç sayfa sınıfı)
- `docs/surec/IYILESTIRMELER.md`

Dokunulmayanlar (brief gereği): `styles/tokens.css`, `components/ui/*`,
`components/sayfa/ana/`, `components/sayfa/AnaSayfa.tsx`, `PaketSeridi.*`,
`components/saat/SaatTablosu.*`, `app/**/page.tsx`.

## Öz denetim ve endişeler

1. `.icSayfa [id]` seçicisi `<main>` içindeki **her** id'li öğeye
   `scroll-margin-top` verir; kaydırma hedefi olmayan öğelerde etkisiz ama
   geniş bir seçici. Daha dar bir alternatif (`section[id]`) sayfa görevlerinin
   çapayı bir `<div id>`'ye koyduğu anda sessizce kırılırdı; genişlik bilinçli.
2. Menü sayfasının üst barında beş nav öğesi var ve üçü sayfa içi çapa; sayfa
   dolduktan sonra 780-1100px arası dar masaüstü genişliklerinde sarma riski
   var. Şu an ölçülemez (sayfa boş), sayfa görevi 11'in parite adımında
   bakılmalı.
3. `AltBilgiSerit`'in telefon butonu `isletme.telefon` null olduğu için bugün
   `<span aria-disabled>` basıyor. Numara geldiğinde `<a href="tel:">` olur ve
   ölçüler değişmez; `Buton`'un kendi null dalı bunu zaten yapıyor.
4. Konum'un "Sayfalar" listesindeki sapma (üç bağlantı) tasarımdan bilerek
   ayrılan tek yapısal karardır. Sahibi "hayır, iki kalsın" derse değişecek
   tek yer `lib/kabuk.ts` > `FOOTER_SAYFA_SIRASI` filtresi ve bir test.
5. Mobil footer dip payı (116px) tasarımın mobil footer'ından alındı ama o
   footer iki satırlık kısa bir varyant; dört kolonlu footer'ın mobil halini
   tasarım hiç göstermiyor. Pay doğru (çakışma gitti), yerleşim sorusu açık.
