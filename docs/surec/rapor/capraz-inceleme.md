# Çapraz sayfa tutarlılık incelemesi

Salt okunur inceleme. Beş sayfa (ana, menü, hikaye, konum, artı 404 ve gizlilik) yan yana
konuldu; paylaşılan primitifler, sözlük, token'lar ve derlenmiş çıktı karşılaştırıldı.
Hiçbir dosya değiştirilmedi.

Tarih: 12 Ağustos 2026. Branch `feat/site-kurulumu`.

**Ağacın durumu (bulguların geçerliliği için önemli):** inceleme sırasında Task 13 (konum)
çalışıyordu. `components/sayfa/konum/` henüz izlenmiyor (`??`), ve `SaatTablosu.tsx`,
`SaatTablosu.module.css`, `HaritaPlakasi.tsx`, `HaritaPlakasi.module.css`,
`KonumSayfasi.tsx` değiştirilmiş durumda. Konum ağacına dokunan her bulgu bu yüzden
"geçici" işaretli. `out/` dizini 12 Ağustos 01:34 derlemesi ve o derlemeden sonra
`app/ components/ content/ lib/ styles/` altında değişen dosya yok, yani derlenmiş kanıt
kaynakla uyumlu.

Kullanılan doğrulama: `npm test` (60/60 geçti), `out/` HTML ayrıştırması, tasarım
dosyalarının doğrudan taranması, `git log`/`git diff`.

Toplam **14 bulgu**, artı kod estetiği ve doğrulanamayanlar.

---

## B1. İngilizce sayfaların footer adresi Türkçe cadde adını basıyor

**Önem: yüksek.** Beş EN rotasının hepsinde, kullanıcıya görünür, dil paritesi ihlali.

**Nerede.** `components/layout/AltBilgiTam.tsx:41-42` ve
`components/layout/AltBilgiSayfalar.tsx:33-34`.

**Ne.** İki footer da adres bloğunu dil-nötr işletme kaydından okuyor:

    <div>{isletme.cadde}</div>
    {isletme.binaNo && <div>{isletme.binaNo}</div>}

`content/isletme.ts:13` `cadde: 'Naci Talat Caddesi'` ve bu değer dile göre değişmez.
Oysa sözlükte tam karşılığı var ve **iki dilde de farklı**:

| Anahtar | TR | EN |
|---|---|---|
| `ortak.satirlar.adresCadde` | `Naci Talat Caddesi` (`content/tr/ortak.ts:56`) | `Naci Talat Street` (`content/en/ortak.ts:57`) |
| `ortak.satirlar.adresBina` | `Şht. Özdemir Apt No:4` (`:57`) | `Şht. Özdemir Apt No:4` (`:58`) |

**Kanıt (derlenmiş çıktı).** `out/en/index.html` footer metni:

    Address | Naci Talat Caddesi | Şht. Özdemir Apt No:4 | Kyrenia / TRNC

aynı sayfanın hero'su ise `Kyrenia, Naci Talat Street` yazıyor
(`ortak.satirlar.adresKisa`, `components/sayfa/ana/Acilis.tsx:46`). Yani tek EN sayfada
cadde adı hem İngilizce hem Türkçe geçiyor.

Dize sayımı:

| Dosya | "Naci Talat Street" | "Naci Talat Caddesi" |
|---|---|---|
| `out/en/index.html` | 14 | **4** |
| `out/en/konum/index.html` | 10 | **4** |
| `out/en/hikaye/index.html` | **0** | **4** |

`/en/hikaye/` sayfasında caddenin adı **yalnızca** Türkçe biçimiyle görünüyor; o sayfada
başka adres satırı yok.

**Neden gözden kaçtı.** `AltBilgi*` kabuk turunun (Task 6) dosyası, sözlük anahtarları ise
Task 3'ün. İki tarafı da tek başına okuyan doğru görünüyor. Bu, B7'deki "yetim sözlük
anahtarı" bulgusunun da gerçek nedeni: `adresCadde` ve `adresBina`'nın sıfır çağıranı var,
çünkü tüketicileri yanlış kaynağı okuyor. Anahtarlar yetim değil, bileşen yanlış.

**Önerilen çözüm.** İki footer'da `isletme.cadde` → `s.ortak.satirlar.adresCadde`,
`isletme.binaNo` → `s.ortak.satirlar.adresBina`. Bina numarası iki dilde aynı dize olduğu
için görünürde yalnız cadde satırı değişir. `isletme.binaNo` null kontrolü kalkacaksa
dikkat: sözlük anahtarı her zaman dolu, yani "bina numarası bilinmiyorsa satır basma"
davranışı kaybolur; kontrol `isletme.binaNo`'da tutulup metin sözlükten alınmalı.

---

## B2. 404 sayfası `EtiketSatiri`'nin üçüncü kopyasını taşıyor

**Önem: orta-yüksek.** Brief'in aradığı kalıbın birebir tekrarı.

**Nerede.** `components/sayfa/HataSayfasi.tsx:27-30` + `HataSayfasi.module.css:37-53`,
karşısında `components/ui/EtiketSatiri.tsx` + `EtiketSatiri.module.css:2-27`.

**Ne.** 404'ün kicker'ı, `EtiketSatiri`'nin `sayfa` ölçeğinin birebir kopyası:

| Değer | `EtiketSatiri.sayfa` | `HataSayfasi.kicker` |
|---|---|---|
| kap | `flex; align-items:center; gap:12px; margin:0` (`:2-10`) | `margin:0; flex; align-items:center; gap:12px` (`:38-41`) |
| tipografi | `500 15px/1 var(--font-govde)` (`:8-13`) | `500 15px/1 var(--font-govde)` (`:42`) |
| renk | `var(--krem-74)` (`:14`) | `var(--krem-74)` (`:44`) |
| kare | `11x11; flex:none; border-radius:1px; background:var(--tangerine)` (`:21-27`) | aynı dördü (`:47-53`) |

Fark tek: 404 ayrıca `font-variant-numeric: tabular-nums` veriyor (`:43`). Ortalama
sarmalayıcıdan geliyor (`.blok { align-items:center }`, `:27`), kicker'ın kendi kuralı
değil.

Her iki modülün yorum satırı da aynı kaynağı gösteriyor: `Hikaye Sayfasi.dc.html:64-66`.

**Neden gözden kaçtı.** Kronoloji. `HataSayfasi` `843524e` ile geldi; `EtiketSatiri`
primitifi ondan **sonra**, `d94570f` (hikaye turu) ile yazıldı ve o tur ana sayfanın
kopyasını ortaklaştırdı ama 404'ü görmedi. `task-14-report.md:19` zaten "Kabuk, layout ve
`components/ui/` dosyalarına dokunulmadı" diyor, yani kapsam dışıydı; kimse geri dönmedi.

**Önerilen çözüm.** `<EtiketSatiri className={stil.kicker}>{s.hata.kicker}</EtiketSatiri>`
ve modülde yalnız `.kicker { font-variant-numeric: tabular-nums; }` bırakmak.
`EtiketSatiri` zaten `className` alıyor (`EtiketSatiri.tsx:27`), yeni API gerekmez.
`.kickerKare` ve `.kicker`ın kalan on satırı silinir.

---

## B3. Gizlilik sayfasının krem `.86` sapmasının gerekçesi artık gerçek değil

**Önem: orta-yüksek.** Kodda ölçülmüş gerçek gibi duran, bugün yanlış olan bir iddia.

**Nerede.** `components/sayfa/GizlilikSayfasi.module.css:99-119`.

**Ne.** Yorum, `.86` renginin gerekçesini şöyle kuruyor (satır 103):

> Sebep: `KorSahnesi` sabit bir katman ve iç sayfalarda yoğunluk takibi kapalı
> (Kabuk.tsx:34), yani **kor tam şiddette yanıyor**

Bu önerme `4f8b085 fix(ember): give the inner pages their own dimmer scene` ile geçersiz
oldu. Bugün iç sayfalar kendi sönük sahnesini alıyor:

- `components/sayfa/Kabuk.tsx:34` → `varyant={anaSayfaMi ? 'ana' : 'ic'}`
- `components/ember/KorSahnesi.module.css:46` → `.ic .kor` gradyanı `rgba(183,53,28,0.55)`
  (ana sayfa `:31` `0.78`)
- `components/ember/KorSahnesi.module.css:72` → `.ic .cekirdek` `rgba(250,170,31,0.26)`
  (ana sayfa `:63` `0.42`)

Yorumun aktardığı ölçüm ("en kötü zemin (112,74,50), krem .78 ile 4.64:1") kaldırılmış
parlak sahneye karşı alınmıştı. `.spot` (`:58`) ve `.bolumMetin` (`:119`) hâlâ
`var(--krem-86)`, yani tasarımın `.78`'inden sapıyor.

`DEVAM.md:118-119` bu maddeyi zaten "yeniden ölçülüp `.78`'e dönmesi gerekebilir" diye
açık tutuyor. Yeni olan: **koddaki gerekçe metni bugün okuyana yanlış bilgi veriyor**, ve
o metin gerekçeyi "ölçüldü" diye sunuyor. Bir sonraki okuyan onu doğrulanmış kabul edip
sapmayı kalıcılaştırabilir.

**Önerilen çözüm.** Task 16'da yeniden ölçüm; sonuç ne olursa olsun yorumdaki "kor tam
şiddette yanıyor" cümlesi düzeltilmeli. Ölçüm `.78`'i geçiriyorsa iki renk de `--krem-78`
olur ve yorum bloğu silinir.

---

## B4. Aynı bilinmeyen telefon numarası `/konum/` sayfasında iki farklı statüde sunuluyor

**Önem: orta.** Tek sayfada görünür ve anlamsal (a11y) tutarsızlık. *Konum ağacı in-flight.*

**Ne.** `out/konum/index.html` içinde `000 000 00 00` görünür işaretlemede dört kez geçiyor,
üç farklı bağlamda ve **iki farklı statüyle**:

| Yer | İşaretleme | Statü |
|---|---|---|
| hero ikincil butonu (`components/sayfa/konum/Acilis.tsx:54-57`) | `<span class="... pasif" aria-disabled="true">` | devre dışı, `opacity:.55` |
| İletişim kartı satırı (`components/sayfa/konum/IletisimSatiri.tsx:42-44`) | `<div class="satir">` | normal, tam opaklık, `aria-disabled` yok |
| paket şeridi butonu (`components/sayfa/PaketSeridi.tsx:53-55`) | `<span ... aria-disabled="true">` | devre dışı |
| footer İletişim kolonu (`components/layout/AltBilgiSayfalar.tsx:67-69`) | `<span ... aria-disabled="true">` | devre dışı |

Yani ekran okuyucu aynı sayfada aynı dizeyi üç kez "devre dışı", bir kez normal içerik
olarak duyuruyor; gören kullanıcı da üç sönük, bir parlak kopya görüyor.

**İki tarafın gerekçesi de kayıtlı, ama ayrı ayrı.** `IletisimSatiri.tsx:25-29` ve
`task-13-report.md:205-213` satırın neden sönükleşmediğini açıklıyor;
`task-13-report.md:450-453` butonun neden `.pasif` bastığını açıklıyor ve bunu "sitenin
`Buton` genelindeki kararı" diyor. İkisini yan yana koyan ve aynı sayfadaki çelişkiyi
gören bir kayıt yok.

**Önerilen çözüm.** Kararı bir kez, tek yerde vermek: bilinmeyen işletme verisi ya her
yerde "henüz bağlanmamış bilgi"dir (o zaman `Buton`'un `href === null` dalı da
sönükleşmemeli), ya her yerde "devre dışı"dır. Task 16'da karara bağlanmalı; bugünkü hal
iki kuralın aynı sayfada çarpışması.

---

## B5. Token'ı olan ham renk değerleri: kabuk, saat ve kor modülleri token'ları atlıyor

**Önem: orta.** `KISITLAR.md`'nin "Use a token, never a raw `rgba(...)` literal" kuralının
doğrudan ihlali; sayfa modülleri kurala uyuyor, kabuk uymuyor.

**Ne.** On yerde, `styles/tokens.css`'te **birebir aynı değere sahip bir token varken**
ham literal yazılmış:

| Ham literal | Token (tokens.css) | Nerede |
|---|---|---|
| `rgba(10, 8, 7, 0.6)` | `--panel-60` (`:22`) | `components/saat/DurumCipi.module.css:18`, `components/layout/UstBar.module.css:152`, `components/sayfa/ana/Acilis.module.css:29` |
| `rgba(10, 8, 7, 0.9)` | `--panel-koyu` (`:9`) | `components/layout/UstBar.module.css:20` |
| `rgba(10, 8, 7, 0.55)` | `--panel-yari` (`:13`) | `components/layout/UstBar.module.css:25` |
| `rgba(10, 8, 7, 0.7)` | `--panel-not` (`:25`) | `components/sayfa/ana/Gece.module.css:51` |
| `rgba(242, 233, 220, 0.12)` | `--cizgi-kart` (`:77`) | `components/layout/Cekmece.module.css:63` |
| `rgba(242, 233, 220, 0.14)` | `--cizgi` (`:72`) | `components/layout/MobilAksiyonBari.module.css:10` |
| `rgba(242, 233, 220, 0.16)` | `--cizgi-bolum` (`:71`) | `components/layout/BeadRay.module.css:33` |
| `rgba(242, 233, 220, 0.3)` | `--cizgi-tire` (`:63`) | `components/ember/KorSahnesi.module.css:123` |
| `rgba(250, 170, 31, 0.32)` | `--tangerine-32` (`:141`) | `components/ember/KorSahnesi.module.css:133` |
| `rgba(183, 53, 28, 0.4)` | `--kor-leke-hover` / `--kor-kenar` (`:104`, `:110`) | `components/layout/MobilAksiyonBari.module.css:32` |

En keskin örnek `--panel-60`. Token'ın kendi yorumu (`tokens.css:18-22`) üç rolü sayıyor:
"durum çipi (Ana:89, Mobil:73, 263), Konum'un harita levhası (Konum:89) ve mobil üst barın
gradyan ucu (Mobil:50, 240)". Bu üç rolden **yalnız biri** token'ı tüketiyor
(`components/sayfa/konum/Harita.module.css`); durum çipi ve üst bar ham değeri yazıyor.
`on-gecis-report.md:105` bu token'ı "7 kullanım" diye kaydediyor, ama o sayım **tasarımdaki**
kullanımı sayıyor, koddakini değil; kodda tüketici sayısı 1.

**Neden gözden kaçtı.** Token turu (`ee19589`) ile bu modüllerin yazıldığı turlar farklı:
`KorSahnesi.module.css` `b5b68c0` (24. commit), `DurumCipi.module.css`/`VardiyaSeridi.module.css`
`ab754dd` (24.), kabuk modülleri `615383b` (31.); token turu 48. commit. Sayfa turları
(9-13) token turundan sonra çalıştığı için token'ları düzgün kullanıyor; önceki turların
çağrı yerleri hiç taşınmadı. Bu tam olarak `DEVAM.md:57-58`'in kaydettiği kural:
"Paylaşılan bir API'yi değiştiren, çağrı yerlerini de taşır."

**Önerilen çözüm.** On satırı token'a çevirmek. Dikkat: `Acilis.module.css:29` ve
`Gece.module.css:51` değeri gölge rengi olarak kullanıyor (`text-shadow`), rol farklı;
token'ın adı zemin rolü taşıdığı için orada ya ayrı bir gölge token'ı gerekir ya da satır
olduğu gibi bırakılıp yorumla gerekçelendirilir. Kalan sekizinde rol de aynı, doğrudan
değiştirilebilir.

---

## B6. Hero durum satırı iki sayfada ayrı ayrı yazılmış

**Önem: orta-düşük.** B2 ile aynı kalıp, daha küçük yüzey.

**Nerede.**

- `components/sayfa/menu/Acilis.tsx:24-27` + `menu/Acilis.module.css:20-25`
- `components/sayfa/konum/Acilis.tsx:29-33` + `konum/Acilis.module.css:15-21`

**Ne.** İki sayfa aynı bileşen çiftini aynı boyla basıyor:

    <div className={stil.durumSatiri}>
      <DurumCipi dil={dil} boy="kucuk" />
      <CanliSaat boy="kucuk" />
      ...

CSS de birebir aynı, tek fark Konum'un ek `margin-bottom: 22px` satırı:

| | menü (`:20-25`) | konum (`:15-21`) |
|---|---|---|
| `display` | `flex` | `flex` |
| `flex-wrap` | `wrap` | `wrap` |
| `align-items` | `center` | `center` |
| `gap` | `14px 20px` | `14px 20px` |
| `margin-bottom` | yok (kap `.kolon` gap:20px veriyor) | `22px` |

Tasarım da aynı tekrarı yapıyor (`Menu Sayfasi.dc.html:67`, `Konum Sayfasi.dc.html:64`,
ikisinde de `display:flex;flex-wrap:wrap;align-items:center;gap:14px 20px`). `DurumCipi`
ve `CanliSaat` `kucuk` boylarının doküman yorumları da zaten "Konum ve Menü hero'larında
birebir aynı" diyor (`CanliSaat.tsx:11-15`, `DurumCipi.tsx:11-12`).

**Önerilen çözüm.** Ya `EtiketSatiri` modeliyle küçük bir `HeroDurumSatiri` bileşeni
(`className` prop'uyla dış boşluğu çağırana bırakarak), ya da en azından bunun bilinçli bir
tekrar olduğunun iki modüle de yazılması. Bugün ikisi de birbirinden habersiz duruyor.

---

## B7. Yetim sözlük anahtarları

**Önem: orta-düşük.** İkisi B1'in belirtisi, dördü ölü metin.

TR/EN paritesi kusursuz: her iki sözlük de **210 yaprak** taşıyor, tek yönlü fark yok
(`content/en/index.ts:10`'un `en: Sozluk` tip bağı bunu derleme zamanında da zorluyor).
Ama altı anahtarın hiçbir çağıranı yok:

| Anahtar | Değer (TR) | Durum |
|---|---|---|
| `ortak.satirlar.adresCadde` (`tr/ortak.ts:56`) | `Naci Talat Caddesi` | **B1'in kanıtı**: footer bunu kullanmalıydı |
| `ortak.satirlar.adresBina` (`:57`) | `Şht. Özdemir Apt No:4` | **B1'in kanıtı**, aynı satır |
| `ortak.satirlar.saatlerUzun` (`:62`) | `Her gün 10:00'dan ertesi sabah 05:00'e kadar` | Aynı cümle `ana.konum.saatNotu`'na (`tr/ana.ts:55`) elle kopyalanmış; tasarım kaynağı `Ana:310` ikisini birleştirip yazıyor. Metin üç yerde (`sayfaMeta.konum.aciklama` dahil) ayrı ayrı duruyor |
| `ortak.alkolsuz` (`:70`) | `Mekanımız alkolsüzdür. Sofra ve ocak bizden, yine bekleriz.` | `metin-envanteri.json:45`'in hazır bloğu; tasarımda yerleşimi yok. `Icecekler.tsx:32-35` bilinçli olarak `alkolsuzKisa` kullanıyor |
| `ortak.cta.whatsapptanYaz` (`:40`) | `WhatsApp'tan yaz` | `metin-envanteri.json:53`'ün CTA listesinden; beş `.dc.html`'de hiç geçmiyor |
| `ortak.marka.kisa` (`:7`) | `Bozo` | Hiçbir yerde basılmıyor |

Not: `content/en/hata.ts` de bugün hiç render edilmiyor ama bu **kayıtlı ve doğru**
(`global-not-found.tsx:20-23`, statik export tek `404.html` üretir); ölü sayılmaz.

**Önerilen çözüm.** `adresCadde`/`adresBina` B1 ile birlikte bağlanır. `saatlerUzun`
`ana.konum.saatNotu`'nun bileşiminde kullanılabilir (üç kopya yerine tek kaynak). Kalan üçü
ya kullanılır ya silinir; "ileride lazım olur" gerekçesi `KISITLAR.md`'nin "No dead code"
kuralıyla çelişiyor.

---

## B8. `.pasif` üç modülde birebir tekrar, ve ad üç ayrı anlam taşıyor

**Önem: düşük.** Görünür etkisi yok, bakım maliyeti var.

Aynı üç bildirim üç dosyada:

- `components/ui/Buton.module.css:72` → `opacity:.55; cursor:default; pointer-events:none`
- `components/layout/MobilAksiyonBari.module.css:49-53` → aynı üçü
- `components/layout/AltBilgi.module.css:294-298` → aynı üçü

Aynı ad, farklı anlam:

- `components/layout/DilAnahtari.module.css:23-31` `.pasif` = **aktif olmayan dil bağlantısı**
  (gerçek, tıklanabilir `<Link>`)
- `components/saat/VardiyaSeridi.module.css:29-31` `.pasif` = **şu anki vardiya olmayan çip**

Modül scope'u çakışmayı önlüyor ama okuyan için "pasif" bu kod tabanında üç ayrı şey.

---

## B9. `IlerlemeCubugu` hareket sözleşmesinin dışında kalmış

**Önem: düşük.**

`KISITLAR.md`'nin hareket bölümü: "each site carries a comment saying what is suppressed
and why". Kaydırmaya bağlı geometri yazan beş yerin dördü bunu yapıyor:

| Bileşen | Hareket azaltıldığında |
|---|---|
| `components/ui/Bolum.tsx:36-45` | hesap hiç kurulmaz, gerekçeli |
| `components/ember/KorSahnesi.tsx:45-51` | `scale` nötr 1'e sabitlenir, gerekçeli |
| `components/ember/ImlecKoru.tsx:17-20` | dinleyici bağlanmaz, gerekçeli |
| `components/ui/AnimasyonluSayac.tsx:34` | gözlemci kurulmaz, gerekçeli |
| `components/layout/IlerlemeCubugu.tsx:17-30` | **kontrol yok, yorum yok** |

`IlerlemeCubugu.module.css:11` `transition: width 0.12s linear` taşıyor ve
`styles/animasyonlar.css:24-29` hareket azaltılmışta `transition: none !important` basıyor.
Sonuç, `KorSahnesi`'nin yorumunun (`lib/cerceve.ts:31-32`) tam da kaçınmak için yazıldığı
durum: geçiş kapalıyken her karede ani genişlik atlaması.

Not: ilerleme çubuğunun genişliği taşıdığı bilginin kendisi, yani "sabitle" doğru çözüm
olmayabilir. Eksik olan karar değil, kararın kayıtlı olmaması.

---

## B10. Kullanılmayan token

**Önem: düşük.** 126 token tarandı, ikisinin tüketicisi yok:

- `styles/tokens.css:154` `--mese: #6B4A2F`: markanın yedi renginden biri. Beş tasarım
  dosyasında `#6B4A2F` **sıfır kez** geçiyor, yani tasarım da kullanmıyor. Token marka
  kitabından geldi, tasarımdan değil. Bilinçli bir yedek mi, yoksa tasarımın atladığı bir
  renk mi: kayıt yok.
- `styles/tokens.css:148` `--tangerine-08: rgba(250, 170, 31, 0.08)`: tasarımda karşılığı
  bulunamadı (bkz. "Doğrulanamadı").

Karşılaştırma için: kalan 124 token'ın hepsinin en az bir çağıranı var, tek kullanımlık
olanlar dahil (`--cizgi-saat`, `--cizgi-meta`, `--cizgi-qr`, `--ol-imza-ad`,
`--ol-portre-baslik`, `--iz-hero-menu`, `--komur-90`, `--kor-kenar` ...). Yani token
disiplini iyi; bu iki istisna.

---

## B11. `ImlecKoru` hâlâ hiçbir yere bağlı değil

**Önem: bilinen madde, teyit.**

`components/ember/ImlecKoru.tsx` + `ImlecKoru.module.css` (441B) yazılmış, `components/`
ve `app/` altında **sıfır** çağıranı var. `DEVAM.md:115-117` bunu zaten kaydediyor ve
Task 16'ya bırakıyor. Bu turda taranan bütün `components/**` export'ları arasında **tek
bağlanmamış bileşen budur**; başka ölü bileşen yok (kırktan fazla bileşen, ikon ve hook
tek tek tarandı, `ImlecKoru` dışında hepsinin en az bir gerçek çağıranı var).

---

## B12. Aynı buton etiketi iki sayfada iki farklı hedefe gidiyor

**Önem: düşük.** Tasarımdan geliyor, ama tek kullanıcı iki sayfayı arka arkaya görüyor.

- `components/sayfa/ana/Acilis.tsx:42-44` → etiket `s.ortak.cta.menuyuGor` ("Menüyü gör"),
  hedef `#ocaktan`, yani **aynı sayfada kaydırma** (`Ana Sayfa Alternatif.dc.html:113`,
  `data-git="ocaktan"`).
- `components/sayfa/hikaye/Sofra.tsx:28-30` → aynı etiket, hedef `yol('menu', dil)`, yani
  **menü sayfası** (`Hikaye Sayfasi.dc.html:128`, `href="Menu Sayfasi.dc.html"`).

İkisi de tasarıma sadık ve ana sayfadaki hal `ana/Acilis.tsx:40-41`'de yorumla kayıtlı.
Yine de: misafir ana sayfada "Menüyü gör"e basıp aynı sayfada kalıyor, hikayede aynı
butona basıp sayfa değiştiriyor. Task 16'nın bakması gereken bir tasarım gözlemi; kod
hatası değil.

---

## B13. `VardiyaSeridi`'nin kayıtlı token borcu kapanmadı

**Önem: düşük.**

`components/saat/VardiyaSeridi.module.css:9-14`:

    /* Zemin rgba(10,8,7,.5) ham: --panel* ailesinde .5 adımı yok ve styles/tokens.css
       bu turda başka bir görevin kapsamındaydı (bkz. task-10-report.md). */
    background: rgba(10, 8, 7, 0.5);

Token turu (`ee19589`) bu satırdan sonra çalıştı ve 33 token ekledi, ama `--panel-50`
eklenmedi ve bu satır taşınmadı. `KISITLAR.md`: "If the design uses a value with no token,
add the token. Do not round to the nearest existing one." Borç kayıtlı ama kapanmamış.

---

## B14. `DEVAM.md`'nin iki maddesi bayat

**Önem: düşük.** Ama `DEVAM.md` bağlam sıfırlaması sonrası tek giriş noktası.

1. **Test sayısı.** `DEVAM.md:22` ve `:147` "51 test" diyor. Ölçüm: `npm test` →
   `tests 60, pass 60, fail 0`. Dokuz test sonradan eklenmiş.

2. **Footer dokunma hedefi maddesi eksik.** `DEVAM.md:75-79` yalnız 28px'lik durumu
   anlatıyor ("`.kolon`'un `gap` değerini 13px'ten yaklaşık 29px'e çıkarmayı gerektiriyor").
   Bu `tam` footer'ın `.iletisimSatiri::before` yüksekliği
   (`components/layout/AltBilgi.module.css:278`). Ama Hikaye ve Konum'un footer'ı `sayfalar`
   varyantı ve orada iki hedef **26px**:
   - `AltBilgi.module.css:161` `.sayfaLinki::before { height: 26px }`
   - `AltBilgi.module.css:183` `.metinLinki::before { height: 26px }`

   `kabuk-turu-report.md:343-349` bu 26px kararını doğru ve gerekçeli kaydediyor, yani
   rapor tutarlı; bayat olan `DEVAM.md`'nin özeti. Sahibi 44px kararını verirken üç hedefin
   üçünü de görmeli, birini değil.

---

## Kod estetiği

Kullanıcıya görünmeyen, kural ihlali olmayan, yalnız okunabilirlik/tutarlılık maddeleri.

1. **Yerel panel zeminleri gerekçesiz.** `CamPanel`'in `--panel-acik`/`--panel-orta`
   zeminini yerel yazan dört modül var: `menu/CekimListesi.module.css:11`,
   `menu/UrunKarti.module.css:5`, `menu/Ikramlar.module.css:21`,
   `menu/Icecekler.module.css:41`. Yalnız `CekimListesi` neden `CamPanel` olmadığını
   yazıyor (`:7-8`, dolgu ve kenarlık `CamPanel` adımlarıyla eşleşmiyor). Diğer üçü aynı
   gerekçeye sahip görünüyor ama yazmıyor.

2. **`<br />` ile bölünen H1'lerin `textContent`'i bitişik.** `out/index.html` h1 →
   `Tavla zarıciğer`, `out/en/index.html` → `Dice-sizedliver`, `out/konum/index.html` →
   `Naci TalatCaddesi, Girne`. Kaynak `ana/Acilis.tsx:25-29` ve `konum/Acilis.tsx:35-39`.
   Tasarım da aynısını yapıyor (`Ana:98` `Tavla zarı<br>ciğer`, `Konum:74`
   `Naci Talat<br>Caddesi, Girne`), yani sadakat açısından doğru ve iki sayfa **kendi
   aralarında tutarlı**. Metin çıkarımı (kopyala-yapıştır, bazı erişilebilirlik ad
   hesaplamaları) kelimeleri bitişik görüyor. Ucuz çözüm: `{' '}` ya da `<br />` yerine
   `display:block` taşıyan iki `<span>`.

3. **Menü hero'sunun not kartı başlığı `<h2>`.** `menu/Acilis.tsx:33`, 16px'lik bir yan
   not (`menu/Acilis.module.css:53-58`) belge taslağında `Ocaktan`/`İkramlar` gibi bölüm
   başlıklarıyla aynı seviyeye giriyor. `out/menu/index.html` taslağı: `h1 Menü` →
   `h2 Gece menüsü` → `h2 Ocaktan`. Karşılaştırma: Konum hero'sunun eşdeğeri (`saatEtiketi`)
   düz `<span>`. Başlık hiyerarşisinin geri kalanı beş sayfada kusursuz: her sayfada tam
   bir `h1`, atlanan seviye yok, `h3`ler yalnız `h2` altında (menü ürün/ikram adları,
   hikaye usul satırları).

4. **`Ikonlar`'ın `boy` varsayılanı hiç kullanılmıyor.** Dört ikonun dördü de
   `boy = 16` varsayılanı taşıyor (`components/ui/Ikonlar.tsx:5, 13, 21, 29`), ama 14
   çağrının 14'ü de değeri açıkça geçiyor (`konum/Acilis.tsx:42` bile `boy={16}` yazıyor).
   Varsayılan ölü.

5. **`rel="noopener"` `target` olmadan etkisiz.** Yedi yerde `rel="noopener"` var
   (`Buton.tsx:33`, `IletisimSatiri.tsx:47`, `AltBilgiTam.tsx:46,75,87`,
   `MobilAksiyonBari.tsx:25,40`), `target="_blank"` ise kod tabanında hiç yok. Zararsız
   ama anlamsız; en azından niyetin (harici bağlantılar aynı sekmede açılıyor) yazılması
   iyi olur.

6. **Token'sız, iki dosyada tekrar eden renk değerleri.** `rgba(250,170,31,0.9)` beş kez,
   üç dosyada (`Cekmece.module.css:91`, `GeceSeridi.module.css:20,41`,
   `DurumCipi.module.css:47,51`), hepsi "tangerine nokta parıltısı". `rgba(242,233,220,0.35)`
   iki dosyada (`Cekmece.module.css:96`, `DurumCipi.module.css:55`), ikisi de "kapalı
   durum noktası". İkisi de aynı rolü taşıyor, ikisinin de token'ı yok.

7. **`FotoYuvasi`'nın `bicim` ailesi ile `Cip`'in `tur` ailesi zıt konumda.** `Cip` altı
   türün hepsini tek dosyada tutuyor ve altısı da kullanılıyor; `FotoYuvasi` sekiz biçim
   taşıyor ve sekizi de kullanılıyor. İkisi de sağlıklı; not sadece şu: `Cip`'in `className`
   almaması yüzünden Konum haritası üç POI çipini birer sarmalayıcı `<span>` içine alıyor
   (`konum/Harita.tsx:47-55`). Gerekçe `task-13-report.md:445-449`'da kayıtlı.

---

## Doğrulanamadı

Bakmak istediğim ama bu turda kanıtına ulaşamadığım şeyler.

1. **Konum ağacı hareket halinde.** `components/sayfa/konum/` (7 dosya) henüz git'e
   girmemiş, `HaritaPlakasi.*`, `SaatTablosu.*`, `KonumSayfasi.tsx` değiştirilmiş durumda.
   B4 ve B6'nın konum yarısı, ayrıca "Kod estetiği 7" bu ağaç commit'lendikten sonra
   yeniden okunmalı. İnceleme sırasında bu ağaçta iki madde **zaten kapatılmıştı**:
   `HaritaPlakasi`'nın ölü `children` prop'u silinmiş ve "Task 13 ikinci bir kopya yazmak
   zorunda değil" diyen bayat yorum, gerçeğe (iki levha ayrı yazıldı) göre düzeltilmiş.
   O yüzden bunlar bulgu olarak yazılmadı.

2. **Tarayıcı ölçümü gerektiren hiçbir iddia doğrulanmadı.** Görev salt okunur ve tarayıcı
   yasak. Raporlardaki kontrast oranları (ör. `task-13-report.md:319-335`,
   `task-14-report.md`'nin 4.34:1 ölçümü), `getComputedStyle` tabloları, dokunma hedefi
   yükseklikleri ve 390px taşma iddiaları **kaynağa karşı** tutarlı görünüyor ama sayısal
   olarak yeniden ölçülmedi. B3'ün ölçüm tarafı da bu yüzden "yeniden ölçülmeli" diye
   bırakıldı: yorumun yanlış olduğu kesin, `.78`'in bugün geçip geçmediği değil.

3. **Kaynağa karşı doğrulanan rapor iddiaları temiz çıktı.** Kod/tasarım düzeyinde
   sınanabilen altı iddianın altısı da doğru:
   - `data-erit`/`data-yogunluk` üç iç sayfa dosyasında sıfır, ana sayfada 8+8 → **doğru**
   - `#0C0A09` yalnız `Menu Sayfasi.dc.html`'de ve 15 kez → **doğru**
   - Nar `#7A1F2B` tasarımda tam iki kez, ikisi de ikram plakası (`Menu:208, 220`) →
     **doğru**; kodda da tek tüketici (`ui/FotoYuvasi.module.css:86`)
   - Pumpkin `#E96112` tasarımda `Ana` ve `Konum`'da birer kez → **doğru**; kodda tek
     tüketici (`sayfa/PaketSeridi.module.css:5`)
   - `backdrop-filter` yalnız Ana (4) ve Hikaye (2) → **doğru**; kodda `CamPanel bulanik`
     ile birebir eşleşiyor (Ana 4 çağrı varsayılan `true`, Hikaye 2, Menü 0 panel, Konum ve
     Gizlilik 3 çağrı `bulanik={false}`)
   - `on-gecis-report.md:148-164`'ün "iki harita levhası ayrı" ölçümü → sonucu Task 13'ün
     kararıyla uyumlu

   Yani raporlarda **yanlış çıkan tek iddia B3'teki koda gömülü gerekçe** oldu; onun da
   yanlışlığı raporun hatası değil, sonradan gelen bir düzeltmenin (`4f8b085`) geride
   bıraktığı bayatlık.

4. **`--tangerine-08`in tasarımdaki kaynağı bulunamadı.** `rgba(250,170,31,.08)` beş
   `.dc.html` dosyasında aranmadı diye değil, arandı ve bulunamadı. Token nereden geldi:
   `on-gecis-report.md`'nin eklenen 33 token listesinde de açık bir satırı yok. Ya farklı
   yazımla (`#FAAA1F14` gibi) geçiyor ya da yanlışlıkla eklendi; ayırt edemedim.

5. **`--mese` kararı.** Marka kitabının yedi renginden biri, tasarımda sıfır kullanım,
   kodda sıfır kullanım. `KISITLAR.md:41-54`'ün renk tablosu onu "Support tone" diye
   listeliyor ama bir kural vermiyor. Silinmeli mi, yoksa Task 16 onu kullanacak mı:
   karara bağlanmamış, ben de karar veremedim.

6. **Mobil prototipin kabuk dışı parçaları.** `Mobil Prototip.dc.html` 44.6K ve bu
   incelemede yalnız kabuk (üst bar, çekmece, alt bar) ve token sayımları için tarandı.
   O dosyadaki başka bir bölümün portu gerekiyor mu, kapsamı bu görev değildi.
