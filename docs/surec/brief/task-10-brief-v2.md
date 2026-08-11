# Task 10 brief (v2): Ana sayfa, ikinci yarı

> v1 (`task-10-brief.md`) **iptaldir**. Denetimi 12 sapma ve 13 eksik çıkardı
> (`docs/surec/denetim/denetim-task-10.json`). Değer kaynağı olarak kullanmayın.
>
> **Denetimin kendisi de kısmen bayat.** Task 8 ve Task 17 aradan geçti ve onun
> bulduğu boşlukların bir kısmını çoktan kapattı. Aşağıdaki "Denetimde açık görünüp
> kapanmış olanlar" bölümünü okumadan denetim maddelerine göre iş yapmayın; yoksa
> bitmiş işi ikinci kez yaparsınız.

## Önce oku, bu sırayla

1. `docs/surec/SAYFA-GOREVI-CERCEVESI.md`
2. `docs/surec/denetim/denetim-task-10.json` + aşağıdaki bayatlık notu
3. `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/Ana Sayfa Alternatif.dc.html`
   satır **244-380**. Spec budur.
4. `docs/surec/KISITLAR.md`
5. Task 9'un raporu (`task-9-report.md`) ve commit'i: aynı sayfanın birinci yarısı,
   eklediği token'lar ve `Bolum`'a eklediği prop sizin de zemininiz.

## Kapsam

- `gece` bölümü (yoğunluk **1.25**)
- `bozo` bölümü (0.45)
- `konum` bölümü (0.3)
- Paket şeridi: **bölüm değil**, düz `<div>`
- `BeadRay`'in `AnaSayfa`'ya bağlanması

## Dokunmayacağınız dosyalar

Ağaçta paralel ajanlar var. Şu dosyalar **sizin değil**:

- `styles/tokens.css`: bir ön geçiş görevi bu bölümlerin ihtiyaç duyduğu token'ların
  hepsini önceden ekledi (gece saat çizgisi `.34`, paket paragrafı kömür `.9`,
  harita ızgarası `.05`, dikey yol `.06`, halka, pin gölgesi ve parıltısı). **Yeni
  token eklemeyin.** İşe başlarken `styles/tokens.css`'i okuyup gerçek adları
  oradan alın; aşağıda bir değeri ham yazdıysam, karşılığı olan token'ı kullanın.
  Gerçekten eksik bir değer bulursanız ham yazmayın ve uydurmayın: raporlayın.
- `components/ui/Buton.*`, `CamPanel.*`, `BolumBasligi.*`: aynı ön geçiş bunları
  boya bağlı kenarlık/gölge merdiveni, bulanıklık kapatma ve not rengi için
  değiştirdi. Konum bölümündeki birincil butonun gölgesi orada karara bağlandı;
  siz yalnız `boy="lg"` geçin ve sonucu **ölçün**. Tasarımla uyuşmuyorsa
  düzeltmeyin, raporlayın.
- `components/layout/*` ve `components/sayfa/Kabuk.tsx`: ayrı bir kabuk turu
  `UstBar` ve `AltBilgi`'nin sayfa varyantlarını kuruyor.

## Denetimde açık görünüp kapanmış olanlar (tekrar yapmayın)

| Denetim maddesi | Bugünkü durum |
|---|---|
| "Footer hiç render edilmiyor" | **Kapandı.** `AltBilgi`, `components/sayfa/Kabuk.tsx`'te on rotanın hepsinde basılıyor. Task 10 footer'a dokunmaz. |
| "'ocak 05:00'te söner' ayrı satır sanılmış" | **Kapandı.** `VardiyaSeridi.tsx:43-46` onu şeridin yedinci öğesi olarak basıyor, çizgisiyle birlikte. |
| "TaneDizilimi'nde ton prop'u yok, küçük kare türetiliyor" | **Kapandı.** İmza artık `adet`, `buyuk`, `kucuk`, `bosluk`, `ton`, `cizgi`. Paket rayı: `adet={6} buyuk={12} kucuk={7} bosluk={8} ton="koyu"`. Yarıçaplar (2px / 0) bileşenden doğru çıkıyor, elle vermeyin. |
| "CamPanel 44px dolguyu ifade edemiyor" | **Kapandı.** `dolgu="orta"` = `clamp(28px,3vw,44px)`. Konum paneli: `<CamPanel opaklik={0.74} dolgu="orta">`. |
| "Komşuluk çipinin karşılığı yok" | **Kapandı.** `Cip tur="komsuluk"` tasarımın değerlerini birebir taşıyor (9px 14px, `--cizgi` kenarlık, 500 13px, `--krem-70`, tabular-nums). |
| "Hayalet saat opacity ile değil renk alfasıyla" | **Kapandı.** `CanliSaat.module.css:55` `color: rgba(242,233,220,0.055)`, konumlandırma da içinde. |
| "FotoYuvasi çağrısında `dil` yok" | Hâlâ geçerli: `dil` **zorunlu**. `koseIsaretleri={4}` portre biçiminde zaten varsayılan, vermeyin. |

Kalan denetim maddeleri geçerli. Özellikle şu üçü yapısal: konum ve paket
şeritlerinde **üçer** buton var (ikişer değil), haritada **POI çipi yok**, ve gece
bölümünün ön plan saat satırı ile paragrafı v1'de tümüyle eksikti.

---

## Bölüm 5: Gece (`gece`, yoğunluk 1.25)

Kabuk: `min-height:100vh; display:flex; align-items:center;
padding:120px var(--sayfa-yatay)`.
Erit: `max-width:1100px; display:flex; flex-direction:column; gap:30px`.
**1100px, diğer bölümlerin 1180'i değil.** Erit katmanı ayrıca `position:relative`
olmalı, hayalet saat ona göre konumlanıyor.

Sırayla:

1. `<CanliSaat boy="hayalet" />`. Sınıf konumu ve rengi zaten taşıyor.
2. Saat satırı: `position:relative; display:flex; flex-wrap:wrap; align-items:center;
   gap:20px`
   - `<CanliSaat boy="orta" />`
   - çizgi `width:clamp(30px,5vw,70px); height:1px; background:rgba(242,233,220,.34)`
     → **token yok**, ekleyin (`--cizgi*` ailesi; beş dosyada kaç kez geçtiğini sayıp
     adlandırın)
   - `s.ana.gece.etiket` ("Ocak hala yanıyor"): `font:400 16.5px/1 Inter;
     color:var(--krem-76)`
3. `<h2>` `s.ana.gece.baslik`: `font:800 var(--ol-duygusal)/1.08 var(--font-baslik);
   letter-spacing:var(--iz-duygusal); color:var(--krem);
   text-shadow:0 10px 60px rgba(10,8,7,.7)`.
   **Bu, `--ol-duygusal` ve `--iz-duygusal`'ın gerçek sahibi.** (İkram başlığı onları
   kullanmaz, Task 9'da düzeltildi.) Metin sonunda **nokta yok**.
4. Paragraf `s.ana.gece.metin`: `font:400 clamp(17px,1.5vw,21px)/1.6 Inter;
   color:var(--krem-80); max-width:640px`. Task 9 ikram paragrafında aynı clamp'i
   kullandı; token'a çevirdiyse onu kullanın.
5. `<VardiyaSeridi dil={dil} />`, sarmalayıcısında `margin-top:6px`. Şerit
   `flex-wrap; align-items:center; gap:10px` ve yedinci öğe (bitiş notu) bileşenin
   içinde. Bileşenin şu anki CSS'ini tasarımın 254-264 satırlarına karşı **ölçün**;
   uymayan bir değer bulursanız düzeltin ve raporlayın.

## Bölüm 6: Bozo (`bozo`, yoğunluk 0.45)

Kabuk: `min-height:100vh; display:flex; align-items:center;
padding:120px var(--sayfa-yatay)`.
Erit: `display:flex; flex-wrap:wrap; gap:clamp(28px,3vw,56px); width:100%;
align-items:center`.

**Sol**: `<CamPanel opaklik={0.72} dolgu="genis" className={...}>`, className
`flex:1 1 460px; min-width:0; display:flex; flex-direction:column; gap:24px`.

1. Kicker satırı: `display:flex; align-items:center; gap:12px`. Kare `11x11px;
   border-radius:1px; background:var(--tangerine)`, `aria-hidden`. Metin
   `s.ana.bozo.kicker`: `font:500 14.5px/1 Inter; color:var(--krem-72)`.
2. `<h2>` `s.ana.bozo.baslik`: `font:700 var(--ol-bolum-baslik)/1.12
   var(--font-baslik); letter-spacing:var(--iz-bolum); color:var(--krem)`.
   Sözlükteki metin zaten tasarımın kestiği hali ("bir insan", sonda "dır" yok);
   envanterdeki hazır bloğu **kullanmayın**, o başlığı tekrar eder ve ana sayfada
   olmayan bir cümle daha taşır.
3. Paragraf `s.ana.bozo.metin`: `font:400 var(--ol-govde)/1.7 Inter;
   color:var(--krem-78); max-width:560px`. Satır yüksekliği **1.7**, iddia
   paragrafının 1.65'i değil.
4. Hikaye bağlantısı: `<Link href={yol('hikaye', dil)}>`, `display:flex;
   align-items:center; gap:10px; width:fit-content; transition:gap .18s ease-out`,
   hover `gap:18px`. Metin `s.ana.bozo.hikayeLinki`: `font:600 15px/1 Inter;
   color:var(--tangerine)`. Çizgi `24x1px; background:var(--tangerine)`,
   `aria-hidden`.

   **`OkluBaglanti` diye ortak bir bileşen yazmayın.** v1 onu üç kullanım için
   tasarlamıştı; bugün geriye tek kullanım kaldı. (Footer'ın ok bağlantısı
   `AltBilgi.tsx:45-48`'de kapalı işin içinde ve bir adım küçük: 14px metin, 22px
   çizgi, gap 9→16. Hero'nun kaydırma ipucu Task 9'da yapıldı ve zaten kare + çizgi
   + metin, farklı bir yapı.) Tek kullanımlık altı satırlık bir bileşen için kapalı
   bir bileşeni açmak kazanç değil. Ölçtükten sonra aksini düşünüyorsanız yapın, ama
   o zaman `AltBilgi`'nin çağrı yerini de **siz taşırsınız** ve gerekçesini
   raporlarsınız.

   `.18s` için token yoksa ve `AltBilgi` onu ham yazdıysa aynısını yapın; iki kullanım
   varsa token'a çıkarın.

**Sağ**: `<FotoYuvasi id="ustanin-eli" dil={dil} bicim="portre" />`. `.portre` sınıfı
tasarımın `flex/min-width/max-width/height/border/inset-shadow` değerlerinin hepsini
taşıyor.

## Bölüm 7: Konum (`konum`, yoğunluk 0.3)

Kabuk: `min-height:100vh; display:flex; align-items:center;
padding:120px var(--sayfa-yatay)`.
Erit: `display:flex; flex-wrap:wrap; gap:clamp(28px,3vw,56px); width:100%;
align-items:stretch`. **stretch**, harita levhasının panel boyuna uzaması buna bağlı.

**Sol**: `<CamPanel opaklik={0.74} dolgu="orta" className={...}>`, className
`flex:1 1 460px; min-width:0; display:flex; flex-direction:column; gap:26px`.

1. `<h2>` `s.ana.konum.baslik`: `font:700 var(--ol-bolum-baslik-orta)/1.14
   var(--font-baslik); letter-spacing:var(--iz-bolum); color:var(--krem)`
2. Adres satırı: `display:flex; gap:9px; align-items:flex-start; margin-top:-12px;
   color:var(--krem-72)`. `<PinIkon boy={15} />` (`components/ui/Ikonlar.tsx`,
   `flex:none; margin-top:3px`) + metin `font:400 15px/1.55 Inter`, içerik
   `s.ortak.satirlar.adresTamSatir` + ` · ` + `s.ortak.satirlar.adresSehirUlke`.
   Ayırıcı noktayı sözlükten mi JSX'ten mi bastığınıza karar verin ve raporlayın.
3. `<SaatTablosu dil={dil} not={s.ana.konum.saatNotu} />` — **bileşene üçüncü satır
   eklenecek**, aşağıya bakın.
4. Komşuluk çipleri: sarmalayıcı `display:flex; flex-wrap:wrap; gap:10px`, içinde üç
   `<Cip tur="komsuluk">`, metinler `s.ana.konum.komsular`'dan.
   **Not:** tasarım üçüncü çipte "Girne Macro Market, 80 m" yazıyor; sözlükte "80 m"
   **yok**, işletme sahibi doğrulanmamış mesafe iddiasını kaldırdı, ad kaldı
   (`content/tr/ana.ts:59` yorumu). Sözlükteki hali basılır, tasarımdaki değil. Bu
   bilinçli bir olgusal düzeltmedir, sapma değil.
5. Buton şeridi: `display:flex; flex-wrap:wrap; gap:12px; margin-top:auto`.
   **Üç buton**, v1 iki diyordu:
   - `<Buton tur="birincil" boy="lg" href={yolTarifiUrl()} hariciMi>` +
     `s.ortak.cta.yolTarifiAl`
   - `<Buton tur="ikincil" boy="lg" href={telefonUrl(isletme.telefon)}>` +
     `isletme.telefon ?? TELEFON_YER_TUTUCU`. Numara `null` olduğu için `Buton`
     `href === null` dalına düşer ve `aria-disabled` bir `<span>` basar; doğru
     davranış budur.
   - `<Buton tur="ikincil" boy="lg" href={whatsappUrl(isletme.whatsapp)} hariciMi>` +
     `s.ortak.cta.whatsapp`

   **Ölçün ve karar verin, sonra raporlayın:** tasarım burada birincil butona
   `box-shadow:0 10px 30px rgba(183,53,28,.34)` veriyor. `Buton.module.css` ise
   `.birincil`e `--kor-golge` (0 12px 34px, .4) ve yalnız `.sm`'e `--kor-golge-kucuk`
   (0 8px 26px, .34) yazıyor. Üç değer yan yana konunca boya bağlı bir rampa gibi
   duruyor (sm 8/26, lg 10/30, xl 12/34), yani gürültü değil kasıtlı bir adım
   olabilir. Beş tasarım dosyasındaki bütün birincil butonların gölgelerini sayın:
   rampa doğrulanırsa `lg` için token ekleyip `.birincil.lg`'ye bağlayın; doğrulanmazsa
   çoğunluğa normalize edin. Hangi sonuca varırsanız varın gerekçesini yazın.

**Sağ, `HaritaPlakasi`** (`components/sayfa/HaritaPlakasi.tsx` + `.module.css`).
Paket şeridi gibi bu da `ana/` altına değil paylaşılan yere konur: Konum sayfasında
da bir levha var (`Konum Sayfasi.dc.html:89-101`), **ama değerleri farklı** (ızgara
52px, halka 110px @42/47, pin 18px, iki dikey yol). Yani Task 13 ya bu bileşeni bir
varyantla genişletecek ya da ayrı yazacak; kararı o verecek. Sizden istenen tek şey,
bileşeni ana sayfanın değerlerine gömmek yerine **o kararın ucuz kalacağı** biçimde
bırakmak ve dosya başı yorumunda Konum'un farklı değerlerini not etmek.
Kap: `flex:1 1 380px; min-width:280px; max-width:560px; min-height:420px;
position:relative; border:1px solid var(--cizgi-bolum); background:var(--panel-yari)`.
Katmanlar (hepsi `aria-hidden` dekoratif, metinler hariç):

| Katman | Değer |
|---|---|
| ızgara | `inset:0; background-image:repeating-linear-gradient(0deg,rgba(242,233,220,.05) 0 1px,transparent 1px 50px), repeating-linear-gradient(90deg, aynısı)` |
| yatay yol | `left:0; right:0; top:56%; height:14px; background:rgba(242,233,220,.08)` = `--cizgi-hayalet` |
| dikey yol | `left:44%; top:0; bottom:0; width:9px; background:rgba(242,233,220,.06)` |
| halka | `left:46%; top:53%; width:80px; height:80px; margin:-40px 0 0 -40px; border-radius:50%; border:1px solid rgba(183,53,28,.5)` |
| nabız | `left:46%; top:53%; 16x16; margin:-8px 0 0 -8px; border-radius:50%; background:var(--kor); box-shadow:0 0 0 6px rgba(183,53,28,.22), 0 0 30px rgba(183,53,28,.85); animation:dotPulse 2.6s ease-in-out infinite` |
| işletme adı | `left:46%; top:53%; margin:26px 0 0 14px; font:500 12.5px/1 Inter; color:var(--krem-82)` |
| cadde adı | `left:8%; top:59%; font:400 11.5px/1 Inter; color:var(--krem-62)` |
| alt not | `left:24px; bottom:22px; font:500 12.5px/1.5 Inter; color:var(--krem-68)` |

Hepsi `position:absolute`. **POI çipi yok** (v1 uydurmuştu); `Cip tur="poi"`
Konum sayfasının levhasına ait, ana sayfaya değil.

Metinler: işletme adı `s.ortak.marka.ad`, cadde `s.ana.konum.haritaSokak`, alt not
`s.ana.konum.haritaAltNot`. `.05` ve `.06` alfaları için token ekleyin (KISITLAR
kuralı; `.05` ızgarada iki kez geçiyor).

Task 13 (Konum sayfası) aynı levhayı POI çipleriyle kuruyor. **Şimdi POI desteği
yazmayın**, ama bileşeni Task 13'ün ikinci bir kopya yazmak zorunda kalmayacağı
biçimde bırakın (`children` yeterli) ve bunu dosya başı yorumunda söyleyin.

### SaatTablosu'na üçüncü satır

`components/saat/SaatTablosu.tsx` şu an iki satır basıyor; tasarımın ana sayfadaki
tablosunda üçüncü bir **not satırı** var: `padding:15px 12px; font:400 14.5px/1.6
Inter; color:var(--krem-66)`, alt çizgisi **yok**.

- İmzaya `not?: string` ekleyin. Opsiyonel, çünkü Konum sayfasının saat bloğu (Task 13)
  bambaşka bir yerleşim, bu tabloyu kullanmıyor.
- Bileşenin bugün **hiç çağrı yeri yok**, yani ekleme bedava. Yine de `grep` ile
  doğrulayın.
- Mevcut iki satırın değerlerini de tasarımın 302-310 satırlarına karşı ölçün:
  "Bugün" satırının zemini `rgba(250,170,31,.07)` ve alt çizgisi
  `rgba(242,233,220,.12)`; ikinci satırın alt çizgisi `rgba(242,233,220,.1)`
  (`--cizgi-soluk`). İlk ikisi Task 9'un eklediği token'lardır; yaklaşık bir değer
  bulursanız token'a çekin ve raporlayın.

## Paket şeridi

**Konum sayfasında da var.** `Konum Sayfasi.dc.html:152-163`, ana sayfanınkiyle
(`Ana:336-348`) satır satır aynı kabuk; tek fark buton sayısı (Konum'da iki:
`Paket sipariş` + telefon; ana sayfada üç: + WhatsApp). Bu yüzden bileşen
`components/sayfa/ana/` altına **girmez**, paylaşılan yere konur:
`components/sayfa/PaketSeridi.tsx` + `.module.css`.

Buton kümesini prop olarak alın (ör. `whatsappVarMi?: boolean`, varsayılan neyse
onu gerekçesiyle seçin) ya da butonları `children` ile geçirin; hangisini
seçtiğinizi raporda gerekçelendirin. Ölçüt: Task 13, Konum sayfasında bu şeridi
**ikinci bir kopya yazmadan** kullanabilmeli. Dosya başı yorumunda iki kullanım
yerini de yazın.

**`Bolum` KULLANMAYIN.** Tasarımda `id` yok, `data-yogunluk` yok, `data-erit` yok:
erime animasyonuna ve bead rayına girmez. Düz bir `<div>`.

Kap: `position:relative; padding:clamp(40px,6vh,64px) var(--sayfa-yatay);
background:var(--pumpkin); display:flex; flex-wrap:wrap; align-items:center;
justify-content:space-between; gap:24px 40px`.

Sol kolon `display:flex; flex-direction:column; gap:12px; max-width:620px`:
1. `<TaneDizilimi adet={6} buyuk={12} kucuk={7} bosluk={8} ton="koyu" />`
   (`bosluk` **8**, tasarımın `gap:8px`'i; 7 küçük karenin kendi kenarı)
2. Başlık `s.ortak.paket.baslik`: `font:700 clamp(28px,3vw,40px)/1.16
   var(--font-baslik); letter-spacing:var(--iz-bolum); color:var(--komur)`
3. Paragraf `s.ortak.paket.metin`: `font:400 clamp(15px,1.3vw,17px)/1.6 Inter;
   color:rgba(26,22,20,.9)` → **kömür .9 için token yok**, ekleyin

Sağ, buton şeridi `display:flex; flex-wrap:wrap; gap:12px`. **Üç buton**, v1 iki
diyordu:
- `<Buton tur="koyu" boy="lg">` + `s.ortak.cta.paketSiparis`. Hedefi WhatsApp;
  numara `null` olduğu için pasif basar.
- `<Buton tur="koyuOutline" boy="lg">` + `<WhatsAppIkon boy={15} />` +
  `s.ortak.cta.whatsapp`. Tasarımda dolgusu `17px 26px`, diğer outline'ın `17px 29px`
  değil: ikon 15px + `gap:9px` eklendiği için yatay dolgu kısalmış. `Buton`'un `gap:9px`
  değeri zaten ikonlu kullanım için konmuş (`Buton.module.css:6`), ama `26px` dolgu
  için varyantı yok. Ölçün: ikonlu bütün butonların dolgusu bu şekilde mi kısalıyor?
  Öyleyse `Buton`'a ikonlu bir dolgu adımı ekleyin; değilse tek örneği normalize edip
  raporlayın. Sessizce 29px basmayın.
- `<Buton tur="koyuOutline" boy="lg">` + telefon yer tutucusu, tabular-nums.

Pumpkin **yalnız burada** kullanılır. Üstündeki kömür metin kontrastı 5.29:1.

## BeadRay bağlantısı

`AnaSayfa.tsx` içinde, yedi bölüm sırayla:

    acilis büyük · iddia küçük · ocaktan büyük · ikram büyük ·
    gece küçük · bozo büyük · konum büyük

Tasarımdan doğrulandı (`data-bead` genişlikleri 14/9/14/14/9/14/14, satır 68-80).
`BeadRay` kendi scroll dinleyicisini kurmuyor, `lib/cerceve.ts`'ten besleniyor;
yalnız `bolumler` dizisini geçin. Paket şeridi ve footer rayda yoktur.

## Doğrulama

Geçici rota gerekmiyor: `AnaSayfa` zaten `/` ve `/en/` altında render ediliyor.
`app/**/page.tsx` dosyalarına dokunmayın.

1. `npm run typecheck`, `npm test`, `npm run build` temiz; rota tablosunda `gecici-`
   yok
2. **Kendi playwright örneğinizi kendi portunuzda** başlatın
3. `/` ve `/en/` 1440px ve 390px; `screenshots/03-`, `04-`, `05-ana-sayfa.jpg` ile
   bölüm bölüm karşılaştırın
4. Bead rayı: kaydırırken aktif bölümü işaretliyor mu, tıklayınca 70px ofsetle
   gidiyor mu, yedi bölümün hepsi tetikleniyor mu
5. Yoğunluk: gece bölümünde kor **en parlak** (1.25), konumda en sönük (0.3).
   `KorSahnesi`'nin okuduğu değeri tarayıcıda ölçün, gözle onaylamayın
6. `prefers-reduced-motion: reduce`: nabızlı harita noktası durur, erime kapanır,
   bead ölçek büyümesi kapanır ama renk göstergesi kalır
7. Dokunma hedefleri: üç konum butonu, üç paket butonu, hikaye bağlantısı. 44px altı
   ve çakışma raporlanır
8. `/en/` üç bölümün de İngilizce bastığını doğrulayın
9. Pumpkin şeridin **yalnız** paket bölümünde göründüğünü doğrulayın

## Staging ve rapor

**Asla `git add -A`.** Rapor `task-10-report.md`; çerçeve dosyasının başlıklarına ek
olarak: kapattığınız denetim maddeleri, birincil buton gölge rampası kararı, ikonlu
buton dolgusu kararı, `OkluBaglanti` kararı, eklediğiniz token'lar ve adlandırma
gerekçeleri.
