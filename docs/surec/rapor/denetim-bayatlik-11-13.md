# Denetim bayatlık taraması: Task 11, 12, 13

`docs/surec/denetim/denetim-task-{11,12,13}.json` içindeki her madde, bugünkü disk
durumuna karşı tek tek doğrulandı.

## Denetimden bu yana ne değişti

Denetimler `615383b` (kabuk görevi) ile aynı anda yazıldı. Sonrasında gelen ve
bulguları etkileyen commit'ler:

| Commit | Ne yaptı |
| --- | --- |
| `7b04cec` | Task 17: `TaneDizilimi`, `Cip`, `Buton`, `FotoYuvasi`, `CamPanel`, `BolumBasligi` imzaları tasarımın gerçek kullanımlarından yeniden kuruldu; eksik krem/tangerine alfaları token oldu |
| `9801aa2` | İkram plakası koru `--nar` adını aldı |
| `be51a74` | `components/sayfa/` ağacı ve on rotanın `Kabuk` sarmalayıcısı |
| `fac8f05` | `fotograflar` manifestine `tane-yakin-cekim-yatay` anahtarı |
| `71dcdbe` | `FotoYuvasi` `korNefesi` prop'u (plaka başına süre/gecikme) |
| `9c16dd5`, `dabf786`, `5f659de` | Kabuk düzeltmeleri (sözlük anahtarları, landmark adları, footer) |

Tarama **çalışma ağacına** karşı yapıldı, son commit'e değil. Task 9/10 ajanının
commit edilmemiş değişiklikleri de sayıldı: `styles/tokens.css`'e eklenen
`--iz-baslik`, `--golge-baslik`, `--ol-govde-buyuk`, `--tangerine-07`,
`--cizgi-kart`, `--cizgi-tire`, `--cizgi-meta` ile `Bolum`'un `eritClassName`
prop'u ve `scroll-margin-top: 70px` kuralı. Bunlar commit'lenmeden değişirse
aşağıdaki "hazır" işaretlerinin bir kısmı yeniden bakılmalı.

## Kovalar

- **KAPANDI**: bulgunun talep ettiği paylaşılan değişiklik (bileşen imzası, token,
  sözlük anahtarı) bugün diskte var ve tasarımla eşleşiyor. Sayfa görevine kalan
  iş, onu doğru çağırmak.
- **GEÇERLİ**: bulgu hâlâ ayakta, sayfa görevinin işi. Bir kısmı yalnız uyarıdır
  (brief'i izlemeyin) ve kod işi getirmez; "kalan iş" sütununda `(uyarı)` ile
  işaretli.
- **KISMEN**: bir parçası çözüldü, kalanı duruyor.

---

## Task 11: Menü sayfası

### Sapmalar (11 madde)

| # | Madde özeti | Kova | Kanıt | Kalan iş |
| --- | --- | --- | --- | --- |
| S1 | İndeks rozeti gövdede değil, foto yuvasının içinde mutlak konumlu | KAPANDI | `components/ui/FotoYuvasi.tsx:62-67` (`children` yuvası, yorumda "menü kartının sağ üst indeks rozeti (Menu:131)"); `FotoYuvasi.tsx:96,113` plaka `position:relative` | Rozeti `FotoYuvasi`'nin `children`'ı olarak geçir, konumlandırmayı sayfa CSS'i yapsın (`right:16px;top:14px;font:600 12px/1;tabular-nums;--krem-55`) |
| S2 | `bicim="karo"` menünün dört plaka varyantını karşılamıyor; `'yatay'` diye değer yok | KAPANDI | `FotoYuvasi.tsx:17` `'portre'\|'portreUzun'\|'genis'\|'spread'\|'kart'\|'ikram'\|'icecek'\|'karo'`; `FotoYuvasi.module.css:50-56` (`.spread` = `flex:1 1 520px;min-width:300px;min-height:clamp(340px,46vh,480px)` + hover `--kor-leke-hover`), `:58` (`.kart` `height:clamp(240px,30vh,300px)`), `:60` (`.ikram`), `:62` (`.icecek`), `:64` (`.karo` 110px) — dördü de `Menu Sayfasi.dc.html:94,126,207,239` ile birebir | Spread `bicim="spread"`, kart `bicim="kart"`, ikram `bicim="ikram"`, içecek `bicim="icecek"`, çekim karosu `bicim="karo"` |
| S3 | Ürün kartı plakasında TEK köşe işareti var; `koseIsaretleri: 0\|2\|4` bunu ifade edemiyor | KAPANDI | `FotoYuvasi.tsx:56` `koseIsaretleri?: 0 \| 1 \| 2 \| 4`; `FotoYuvasi.tsx:25` `kart: 1` varsayılan; `FotoYuvasi.module.css:123-124` `.kart .kose{20px;--tangerine-50}` + `.kart .solUst{top:16px;left:16px}` = `Menu:129` | Prop geçmeye gerek yok, `bicim="kart"` varsayılanı doğru |
| S4 | Alt satırda üç tane var (9/5/9, gap 4, .5 ve .8 alfa); bileşen altılı ve tam opak | KAPANDI | `TaneDizilimi.tsx:8-11` `RITIMLER[3]`; `:16-31` ayrı `buyuk`/`kucuk`/`bosluk`/`ton`; `TaneDizilimi.module.css:26,30` `.krem50` = `--krem-50` + `--tangerine-80`; `taneYaricapi` (`:39-42`) 9→1px, 5→0px = `Menu:137` | `<TaneDizilimi adet={3} buyuk={9} kucuk={5} bosluk={4} ton="krem50" />` (aynı çağrı `MenuSatiri.tsx:29`'da zaten var) |
| S5 | Kuzu şiş açıklaması yer tutucu değil, kesin metin | GEÇERLİ | `content/tr/menu.ts:32` `'Sakatat yemeyen misafir için ana alternatif.'`; `content/en/menu.ts:34`; `Menu Sayfasi.dc.html:171` | (uyarı) Brief'in "yer tutucu yaz" talimatını yok say, sözlükteki kilitli metni bas |
| S6 | Gece menüsü not kartı metni tasarımda tam yazılı, uydurulmamalı | GEÇERLİ | `content/tr/menu.ts:7-12` `geceMenusu.baslik` + `.govde`; `Menu:80-81` | (uyarı) Aynı |
| S7 | `s.ortak.alkolsuz` menüde olmayan ikinci cümleyi de basar | GEÇERLİ | `content/tr/ortak.ts:70` (iki cümle) vs `:71` `alkolsuzKisa: 'Mekanımız alkolsüzdür'`; `Menu:252` "Mekanımız alkolsüzdür." | `alkolsuzKisa` kullan. Menüdeki cümle sonda **nokta** taşıyor, `alkolsuzKisa` taşımıyor: farkı raporla, sözlüğe elle nokta ekleme |
| S8 | Kesik çerçeveli satır boş değil, ortalanmış "liste tamamlanacak" metni taşır | KAPANDI | `content/tr/menu.ts:51` `listeTamamlanacak`; `content/en/menu.ts:57` `'More to be added'`; `Menu:248` | Slotu metinli bas; `ICECEK_YER_TUTUCU_ADEDI = 1` (`content/urunler.ts:31`) doğru |
| S9 | Spread etiketi "tane yakın çekimi · yatay"; tek manifest anahtarı iki etiketi karşılayamıyor | KAPANDI | `content/fotograflar.ts:12-15` `'tane-yakin-cekim-yatay'`; `content/types.ts:43-44`; commit `fac8f05` | Spread'de `id="tane-yakin-cekim-yatay"`, çekim listesinin 1. karosunda `id="tane-yakin-cekim"` |
| S10 | Çekim karosu "kurulu sofra" basıyor, manifest "kurulu sofra, üstten" tutuyor | GEÇERLİ | `content/fotograflar.ts:18` `etiket: 'kurulu sofra, üstten'`; `Menu:274` "kurulu sofra"; `Ana Sayfa Alternatif.dc.html:239` "kurulu sofra, üstten" | S9'daki kalıbın ikinci örneği, hâlâ çözülmemiş. Ya ikinci bir manifest anahtarı (`kurulu-sofra-ustten`) ya da bilinçli sapma olarak ", üstten" ile bas ve raporla |
| S11 | `04-menu.jpg` diye bir ekran görüntüsü yok | GEÇERLİ | `design_handoff_bozo_website/screenshots/` yalnız `01-menu.jpg`, `02-menu.jpg`, `03-menu.jpg` içerir (doğrulandı) | Pariteyi üç kare üzerinden yap |

### Eksikler (16 madde)

| # | Madde özeti | Kova | Kanıt | Kalan iş |
| --- | --- | --- | --- | --- |
| E1 | Üç bölüm başlığı yok; `BolumBasligi` 22px/1.12 ve turuncu alt çizgi varyantsız | KISMEN | `BolumBasligi.tsx:8` `olcek="sayfa"`, `:16-17` `vurguCizgi`, `:14-15` `sag`; `BolumBasligi.module.css:11` `.sayfa{padding-bottom:20px;border-bottom:--cizgi-bolum}`, `:12` `.vurgu{--tangerine-30}`, `:30-34` `clamp(30px,3.6vw,48px)/1.06` + `--iz-sayfa-baslik(-0.04em)` — üçü de `Menu:87,202,235` ile birebir | **Not rengi sabit `--krem-66` (`BolumBasligi.module.css:38`)**, tasarım İkramlar'da `.72`, İçecekler'de `.64` (`Menu:203,236`). Ortak madde O5. Ayrıca `margin-bottom` (34/30/26px) bileşende yok, sayfa verir. Ocaktan'ın sağ öğesi `sag={<TaneDizilimi adet={6} buyuk={13} kucuk={8} bosluk={10} ton="krem80" />}` (`Menu:89` ile birebir) |
| E2 | Menü açılışının H1'i, spot metni ve bölüm geometrisi hiç anlatılmamış | GEÇERLİ | `content/tr/menu.ts:3-6` `acilis.baslik` + `.spot` var; `styles/tokens.css`'de `clamp(56px,9vw,140px)` ve `-.055em` **yok** (`Menu:76`) | H1 ölçüsü + izi için token ekle (O3). Not kartı, cip+saat satırı, section dolgusu sayfa CSS'i |
| E3 | Bölüm id'leri (`ocaktan`/`ikramlar`/`icecekler`) ve 96px çapa payı | KISMEN | `Menu:85,200,233` id'ler; `Menu:347` `- 96`; repo `components/ui/Bolum.module.css:12` `scroll-margin-top:70px` (Ana Sayfa'nın `- 70` değeri) | id'leri koy; 96px payını sayfa CSS'inde ver. **Uyarı:** `Bolum` bu sayfada kullanılmamalı (E16), yani 70px sabiti de miras alınmaz. Ortak madde O1/O2. Denetimin "üst bar navigasyonu çalışmaz" gerekçesi bayat: uygulanan `UstBar` bu üç tetikleyiciyi hiç basmıyor (bkz. O7 ve "Denetimin kendisi" D2) |
| E4 | Çekim listesi paneli (kabuk, panel başlığı, ızgara `minmax(150px,1fr)`, AI notu) | GEÇERLİ | `content/tr/menu.ts:54-60` `cekim.baslik`, `.altMetin`, `.aiGorselNotu` hepsi var; `Menu:264-280` | Tamamı sayfa yerleşimi. Panel başlığı alt çizgisiz, `BolumBasligi` kullanılamaz (22px/1.15, `--iz-baslik` değil `-.03em`) |
| E5 | `UrunKarti` kabuğu ve hover değerleri | GEÇERLİ | `Menu:125,133-139`; hover kenarlığı `rgba(183,53,28,.65)` ve gölge `0 26px 60px rgba(0,0,0,.5)` token'sız (`styles/tokens.css`) | Token ekle (O4), kart CSS'ini yaz |
| E6 | İmza panelindeki "01" indeksi ve panelin kendi değerleri | GEÇERLİ | `Menu:104-119`; panel zemini `rgba(10,8,7,.78)` ve kenarlığı `rgba(183,53,28,.4)` token'sız; `CamPanel` yalnız `0.72\|0.74` alıyor (`CamPanel.tsx:8`) | Panel `CamPanel` DEĞİL, sayfaya özel kabuk. Zemin/kenarlık token'ları O4. Çipler hazır: `Cip tur="outline"` (`Cip.module.css:8-14` = `Menu:107` birebir), `Cip tur="dolu"` (`:17-22` = `Menu:112-114` birebir) |
| E7 | Spread hover'ı, çapraz iki köşe, plaka içi etiket | KAPANDI | `FotoYuvasi.module.css:54-56` hover `inset 0 0 120px var(--kor-leke-hover)` = `Menu:94`; `:117-121` `.spread .kose{26px;--tangerine-55}` sol-üst + sağ-alt (`FotoYuvasi.tsx:93` sıra: solUst, sagAlt) = `Menu:96-97`; `:153-154` etiket `left:24px;bottom:22px` + `20x1px` çizgi = `Menu:98-101` | `<FotoYuvasi bicim="spread" />`, prop geçme |
| E8 | Spread satırının ve ürün ızgarasının ölçüleri | GEÇERLİ | `Menu:93,123` | Sayfa CSS'i |
| E9 | Plaka kor animasyonlarının düzensiz süreleri | KAPANDI | `FotoYuvasi.tsx:34-49` `KorNefesi{sure,gecikme}` + `:70-73` satır içi stil; `FotoYuvasi.module.css:73,80,87,91,94` biçim başına ilk örneğin zamanlaması, `.karo` animasyonsuz | Spread ve ilk kart/ikram/içecek prop'suz doğru basar; diğerleri `korNefesi={{sure:11,gecikme:1.2}}` gibi geçilir (kartlar 10/.6, 11/1.2, 9.5/1.8, 12/2.4; bostana 12/1.5) |
| E10 | İkram kartlarının adları/değerleri; `rgba(122,31,43,.5)` marka listesinde yok | KAPANDI | `content/tr/menu.ts:42-45` lebeni + bostana; `styles/tokens.css:80-86` `--nar` gerekçesiyle birlikte; `FotoYuvasi.module.css:85-88` `.ikram .kor` = `--nar` | Kart kabuğu ve gövde sayfa işi; `Cip tur="ikram"` (`Cip.module.css:33-36` = `Menu:215` birebir). Kart kenarlığı `rgba(250,170,31,.28)` token'sız (O4) |
| E11 | İçecek listesinin üç adı ve satır ölçüleri | KAPANDI | `content/tr/menu.ts:50` `urunler:{ayran,salgam,cay}`; `content/urunler.ts:21-25` `icecekler` dizisi; `content/isletme.ts:33-35` `fiyatMetni` → `000 TL` | Satır CSS'i sayfa işi |
| E12 | QR glifi + "Masadaki QR menü aynı listeyi gösterir" | KISMEN | `content/tr/menu.ts:52` `qrNotu` var; QR glifi için bileşen yok (`components/ui/Ikonlar.tsx` yalnız Pin/Telefon/WhatsApp/Instagram) | Glifi sayfa içinde 3x3 grid olarak çiz; çerçevesi `rgba(242,233,220,.25)` token'sız (O4) |
| E13 | Bölüm iç boşlukları | GEÇERLİ | `Menu:85,200,233,264` | Sayfa CSS'i |
| E14 | alt-bilgi adımı yok; menü footer'ı farklı | KISMEN | `components/sayfa/Kabuk.tsx:27-35` on rotanın hepsinde `UstBar`+`AltBilgi`+`KorSahnesi` basıyor → "nasıl geçirilecek" sorusu kapandı. Ama `Menu:283-292` **kompakt tek şerit** (marka + `adresVeSaat` + iki buton), `AltBilgi.tsx:23-116` ise Ana Sayfa'nın dört kolonlu footer'ı | Ortak madde O8: menü sayfasının footer'ı tasarımda ayrı bir şey. Karar gerekiyor (tutarlılık için dört kolon mu, tasarım için kompakt şerit mi), sessizce geçilmemeli |
| E15 | EN katmanının kapsamı tanımlanmamış | GEÇERLİ | `content/en/menu.ts:19,25,29,33,37` ürün adları **açıklanarak** çevrilmiş (`'Spleen (dalak)'`); tasarımda bu metinler `data-en` taşımıyor; `content/fotograflar.ts` `etiketEn` + `FotoYuvasi.tsx:77` dile göre çeviriyor | (uyarı) İçerik katmanı zaten kararını vermiş, düzeltilecek kod yok. Parite adımında bu farkı **bilinçli sapma** olarak raporla, ekran karşılaştırmasında hata sayma |
| E16 | Menü sayfasında erime/fade yok; `Bolum` her bölüme ekler | GEÇERLİ | `Menu Sayfasi.dc.html`'de `data-erit` ve `data-yogunluk` **0 kez** geçiyor (Ana Sayfa'da 8'er kez); `components/ui/Bolum.tsx:47-58` her bölüme kaydırmaya bağlı opaklık + `translate3d` uygular | Ortak madde O1: bu sayfada `Bolum` kullanma, düz `<section>` yaz |

---

## Task 12: Hikaye sayfası

### Sapmalar (13 madde)

| # | Madde özeti | Kova | Kanıt | Kalan iş |
| --- | --- | --- | --- | --- |
| S1 | İkincil CTA "yol tarifi" değil "Konum ve saatler" | GEÇERLİ | `content/tr/hikaye.ts:38` `ctaKonum: 'Konum ve saatler'`; `content/en/hikaye.ts:37`; `Hikaye Sayfasi.dc.html:129` href=Konum | (uyarı) `<Buton tur="ikincil" boy="lg" href={yol('konum', dil)}>` |
| S2 | Bead rail kartın yanında değil, cam kartın İÇİNDE başlık satırının sağ ucunda | KAPANDI | `BolumBasligi.tsx:14-15` `sag` prop'u; `BolumBasligi.module.css:10` `.orta{padding-bottom:22px;border-bottom:--cizgi(0.14)}`, `:26-29` `--ol-bolum-baslik-orta` = `clamp(30px,3.6vw,48px)`/1.12 + `--iz-bolum(-0.02em)` — `Hikaye:92-93` ile birebir | `<BolumBasligi olcek="orta" baslik={s.hikaye.usul.baslik} sag={<TaneDizilimi adet={6} buyuk={13} kucuk={8} bosluk={10} ton="krem80" />} />` |
| S3 | Portre kartı üç öğe taşıyor; brief "İsim" başlığını saymıyor | GEÇERLİ | `content/tr/hikaye.ts:11` `portre.kartBasligi: 'İsim'`; `Hikaye:84` `clamp(28px,3.2vw,44px)/1.12`, `-.02em` | Başlığı bas. Ölçü token'ı yok (O3); `--iz-bolum` izi karşılıyor |
| S4 | Açılış üç öğe: EtiketSatiri + H1 + giriş paragrafı | GEÇERLİ | `content/tr/hikaye.ts:6-8` `acilis.giris` var; `Hikaye:69` `--ol-govde-buyuk` = `clamp(17px,1.5vw,21px)` (`styles/tokens.css:124`) birebir | Paragrafı bas; ölçü token'ı hazır |
| S5 | Açılış/Sofra başlıkları `--ol-duygusal` değil | GEÇERLİ | `styles/tokens.css:119` `--ol-duygusal: clamp(44px,7vw,112px)` hiçbir yerde **kullanılmıyor**; tasarım taraması: `clamp(44px,7vw,112px)` yalnız `Ana Sayfa Alternatif.dc.html:252`'de, Hikaye'de 0 kez. Hikaye H1 = `clamp(44px,6.6vw,104px)` (`Hikaye:68`), Sofra = `clamp(34px,4.6vw,64px)` (`Hikaye:125`) | İki yeni ölçü token'ı (O3). İz için `--iz-baslik(-0.025em)` (`tokens.css:132`) ikisini de karşılıyor; gölge için `--golge-baslik` (`:138`) hazır |
| S6 | Açılış metni envanter bloğuyla birebir değil, içerik katmanı tasarım sürümünü tutuyor | GEÇERLİ | `content/tr/hikaye.ts:5` `'Bozo bir marka ismi değil, bir insan'` (envanterdeki "insandır." değil) | (uyarı) Sözlüğü kullan, envanter bloğuna dönme |
| S7 | Usul metinleri onaylı; "Manifesto"/"Orta versiyon" eklemek onaylı metni bozar | GEÇERLİ | `content/tr/hikaye.ts:17-32` üç satırın tamamı; `content/tr/hikaye.ts:15` `kartNotu` bilinçli yer tutucu | (uyarı) **Brief'in en riskli talimatı.** Step 2'nin hazır blok emrini uygulama |
| S8 | `bicim="portre"` Ana Sayfa ölçüsü; Hikaye plakası `min-height` ister | KAPANDI | `FotoYuvasi.module.css:20-27` `.portreUzun{flex:1 1 380px;min-width:280px;max-width:560px;min-height:clamp(380px,52vh,560px);border:1px solid var(--cizgi-guclu);box-shadow:inset 0 0 90px rgba(0,0,0,.5)}` = `Hikaye:73` birebir | `<FotoYuvasi id="bozo-portre" dil={dil} bicim="portreUzun" />` |
| S9 | Hikaye çipleri `10px 14px / 14px / .78`; hiçbir `Cip` türü ifade edemiyor | KAPANDI | `Cip.tsx:7` `'olcu'`; `Cip.module.css:25-30` `padding:10px 14px;background:var(--krem-dolgu)(.06);font:500 14px/1;color:var(--krem-78)` + `:60-65` `tabular-nums` = `Hikaye:107-109` birebir | `<Cip tur="olcu">` |
| S10 | Usul kartı 44px dolgu + 1180px max-width; `CamPanel` 48px sabitliyor | KAPANDI | `CamPanel.tsx:4` `PanelDolgusu`, `:9-10` `genislik`; `CamPanel.module.css:13` `.dolguOrta{padding:var(--kart-ic-orta)}` = `clamp(28px,3vw,44px)` (`tokens.css:145`), `:16` `.sayfaEni{max-width:var(--panel-en)}` = 1180px (`tokens.css:147`) = `Hikaye:91` birebir | `<CamPanel opaklik={0.74} dolgu="orta" genislik="sayfa">` |
| S11 | Portre kartına flex/min-width/justify-content geçirilemiyor | KAPANDI | `CamPanel.tsx:11-16` `className` prop'u | `<CamPanel opaklik={0.72} dolgu="genis" className={stil.portreKart}>`; zemin `--panel-acik(.72)`, kenarlık `--cizgi-soluk(.1)`, dolgu `--kart-ic` = `clamp(28px,3vw,48px)` — `Hikaye:83` ile birebir, `backdrop-filter:blur(3px)` dahil |
| S12 | md ve lg tane raylarının alfaları/yarıçapları ifade edilemiyor | KAPANDI | `TaneDizilimi.module.css:24` `.krem80{--krem-80}` + `:29` küçük tane `--tangerine`; `TaneDizilimi.tsx:39-42` 13→2px, 8→0px, 14→2px, 9→1px. Usul (`Hikaye:95`) ve Sofra (`Hikaye:123`) ile birebir | Usul `ton="krem80" buyuk={13} kucuk={8} bosluk={10}`; Sofra `ton="krem" buyuk={14} kucuk={9} bosluk={10}` |
| S13 | `components/sayfa/` dizini yok, "modify" değil "create"; git add listesi eksik | KISMEN | `components/sayfa/HikayeSayfasi.tsx` artık var (commit `be51a74`), yani "modify" **doğru** | Denetimin bu yarısı bayat. Kalan: `git add` listesi `components/sayfa/HikayeSayfasi.tsx`'i kapsamıyor, eklenmeli |

### Eksikler (16 madde)

| # | Madde özeti | Kova | Kanıt | Kalan iş |
| --- | --- | --- | --- | --- |
| E1 | Usul kartının başlık satırı atlanmış | KAPANDI | S2 ile aynı kanıt (`BolumBasligi` `olcek="orta"` + `sag`) | S2'deki çağrı |
| E2 | Portre'nin iki kolonlu yerleşimi tarif edilmemiş | GEÇERLİ | `Hikaye:72` `display:flex;flex-wrap:wrap;gap:clamp(28px,3vw,56px);align-items:stretch;padding:0 clamp(24px,5vw,64px) 70px` | Sayfa CSS'i (`--sayfa-yatay` = `clamp(24px,5vw,64px)`, `tokens.css:141`) |
| E3 | Sofra'nın merkezli kolon yapısı yok | GEÇERLİ | `Hikaye:120-127` | Sayfa CSS'i |
| E4 | Bölüm padding'leri verilmemiş | GEÇERLİ | `Hikaye:63,72,90,120` (Açılış üst boşluğu 176px, sabit barın 78px'ini karşılayan tek mekanizma) | Sayfa CSS'i |
| E5 | `UsulSatiri` ızgarasının kesin değerleri yok | KISMEN | `Hikaye:98-101`; etiket `clamp(22px,2.2vw,30px)/1.14`, `-.015em` = `--ol-menu-kalem` (`tokens.css:120`) + `MenuSatiri.module.css:31-33`'ün aynı izi | Ölçü token'ı hazır, iz hâlâ ham (`-0.015em` iki yerde ham yazılı, token'a çıkarılabilir). Satır/numara/gövde CSS'i sayfa işi |
| E6 | Üçüncü satırın (03 Saat) alt çizgisi yok | GEÇERLİ | `Hikaye:98,103,112` (ilk ikisi `border-bottom:1px solid rgba(242,233,220,.1)` = `--cizgi-soluk`, üçüncüsü yok) | Sayfa CSS'i |
| E7 | 03 Saat gövdesi `tabular-nums` taşır, 01 Tane taşımaz | GEÇERLİ | `Hikaye:115` vs `:101` | Sayfa CSS'i |
| E8 | 01/02/03 statik rakam, `data-en` yok, sözlüğe girmemeli | GEÇERLİ | `Hikaye:99,104,113` | (uyarı) `String(i+1).padStart(2,'0')` ile türet, sözlüğe anahtar açma |
| E9 | `NotBlogu` değerleri yok; `rgba(250,170,31,.5)` token'ı yok; "alıntı" adlandırması yanlış | KISMEN | Token **artık var**: `styles/tokens.css:94` `--tangerine-50: rgba(250,170,31,.5)` (`7b04cec` ile eklendi); metin rengi `--krem-58` (`:27`) | Token yarısı kapandı. Kalan: bileşen hâlâ yok (`components/ui/` altında `NotBlogu` yok) ve semantik uyarı geçerli: `<blockquote>` değil `<p>`, alıntı değil not |
| E10 | `EtiketSatiri` değerleri yok | GEÇERLİ | `Hikaye:64-66`; `components/ui/` altında `EtiketSatiri` yok; renk `--krem-74` (`tokens.css:23`) hazır | Bileşeni yaz. Tek 11x11 tangerine kare + metin; `TaneDizilimi` ile yapılmaz (o en az üç tane basar) |
| E11 | Plakanın 4 köşesi ve taşan etiket sekmesi anılmıyor | KAPANDI | `FotoYuvasi.tsx:21` `portreUzun: 4`; `FotoYuvasi.module.css:105-109` `.kose{24px;--tangerine-60}` inset 18px = `Hikaye:74-77`; `:128-140` etiket `left:24px;bottom:-14px;padding:6px 12px;background:var(--zemin)` + `18x1px` çizgi = `Hikaye:78-81`; `content/fotograflar.ts:29` `'portre, ocak başında'` / `'portrait, at the fire'` | Prop geçme; `bicim="portreUzun"` dördünü de doğru basar |
| E12 | Sofra butonlarının boyu belirtilmemiş (ikisi de lg) | KAPANDI | `Buton.module.css:21` `.lg{padding:18px 30px;font-size:16px}`, `:28` `.cerceveli.lg{padding:17px 29px}`, `:31` birincil `--kor-golge` = `0 12px 34px rgba(183,53,28,.4)` — `Hikaye:128-129` ile birebir | `boy="lg"`. **Tek fark:** ikincil kenarlık `--cizgi-buton(.36)` vs tasarımın `.38` (O12) |
| E13 | Sayfada hiç `@media` yok, responsive flex-wrap + clamp ile | GEÇERLİ | `Hikaye:13-24` head'de yalnız `prefers-reduced-motion` | (uyarı) Ad hoc breakpoint uydurma |
| E14 | Gövde puntoları 16px altı, kısıtlarla çelişiyor | GEÇERLİ | `Hikaye:86,101,107-109,115` | (uyarı) Raporla. **Emsal var:** repo zaten 16px altı gövde basıyor (`Cip.module.css:28` 14px, `BolumBasligi.module.css:37` 15px, `MenuSatiri.module.css:43` 15px, `FotoYuvasi.module.css:137` 12.5px), yani sessiz "düzeltme" sistemi bozar |
| E15 | Tasarım "Usül", içerik "Usul" (onaylı) | GEÇERLİ | `content/tr/hikaye.ts:18-19` yorumu ile birlikte | (uyarı) Tasarıma bakıp geri "düzeltme" |
| E16 | Parite adımı `02-hikaye.jpg`'yi atlıyor | GEÇERLİ | `screenshots/02-hikaye.jpg` var; Usul'ün doğrulanabildiği tek kare | Üç kareyi de kullan |

---

## Task 13: Konum sayfası

### Sapmalar (15 madde)

| # | Madde özeti | Kova | Kanıt | Kalan iş |
| --- | --- | --- | --- | --- |
| S1 | Brief harita levhası CSS'ini yanlış sayfadan (ana-sayfa.json) kopyalamış | GEÇERLİ | `Konum Sayfasi.dc.html:89-101` (doğrulandı); `Ana Sayfa Alternatif.dc.html:312-315` komşuluk çipleri levhanın dışında | (uyarı) Brief'in Step 2 kod bloğunu **tamamen** at, değerleri `Konum:89-101`'den al |
| S2 | Levha tam genişlik, `min-height:clamp(420px,58vh,600px)` | GEÇERLİ | `Konum:89` (doğrulandı) | Yaz |
| S3 | Zemin `.6` (brief `.55` diyor) | GEÇERLİ | `Konum:89`; `tokens.css`'de `rgba(10,8,7,.6)` **yok** (`--panel-yari` .55, `--panel-acik` .72) | Token ekle (O4) |
| S4 | Izgara adımı 52px (brief 50px) | GEÇERLİ | `Konum:90`; `rgba(242,233,220,.05)` token'sız | Token ekle (O4) |
| S5 | `.yolYatay` `top:54%;height:16px` (brief 56%/14px) | GEÇERLİ | `Konum:91`; renk `rgba(242,233,220,.08)` = `--cizgi-hayalet` (`tokens.css:63`) **hazır** | Ölçüleri düzelt |
| S6 | İki dikey yol var (20%/9px/.05 ve 64%/7px/.045), brief bir tane diyor | GEÇERLİ | `Konum:92-93`; `.045` token'sız | Token ekle (O4) |
| S7 | `.halka` 42%/47%, 110px, `.45` | GEÇERLİ | `Konum:95`; `rgba(183,53,28,.45)` token'sız | Token ekle (O4) |
| S8 | `.pin` 42%/47%, 18px, `0 0 0 7px .22` + `0 0 32px .85` | GEÇERLİ | `Konum:96`; `.22` ve `.85` kor alfaları token'sız. `dotPulse` keyframe'i **hazır** (`styles/animasyonlar.css:14-17`) ve hareket azaltılmışta `:24-30` kapatıyor | Token ekle (O4) |
| S9 | Alt not levhanın üstünde değil, içinde sol altta | GEÇERLİ | `Konum:101`; `content/tr/konum.ts:15` `harita.altYazi` tam metni tutuyor; `content/en/konum.ts:15` | Levhanın içine bas |
| S10 | Levhanın tamamı `role="img"` olamaz: içinde okunması gereken dört metin var | GEÇERLİ | `Konum:94,97-101` (cadde etiketi, pin etiketi, üç POI çipi, alt yazı) | `aria-hidden` yalnız ızgara/yol/halka/pin noktasına |
| S11 | Kartta üç satır var, e-posta satırı yok | GEÇERLİ | `Konum:127-147`; `content/tr/konum.ts:21-25` yalnız `whatsappAlt`, `instagramAlt`; `content/isletme.ts:23` `eposta: null` | (uyarı) E-posta satırı ekleme |
| S12 | Yalnız telefon alt satırı yer tutucu; WhatsApp/Instagram alt satırları sabit açıklama | GEÇERLİ | `content/tr/konum.ts:23-24`; `content/isletme.ts:29` `TELEFON_YER_TUTUCU` | (uyarı) Üçünü aynı muameleye tabi tutma |
| S13 | Tek `deger: string` prop'u iki tipografiyi ifade edemez | GEÇERLİ | `Konum:131` (`font:400 14px/1` + `tabular-nums`) vs `:138,145` (`font:400 14px/1.4`, tabular yok); `components/ui/` altında `IletisimSatiri` **yok** | Bileşeni bir `tur`/`varyant` prop'uyla yaz |
| S14 | `PanelKart` diye bir bileşen yok; `CamPanel opaklik={0.74}` | KISMEN | `CamPanel.tsx:8` `opaklik: 0.72\|0.74`, `:4` `dolgu`; `CamPanel.module.css:14` `.dolguDar{padding:var(--kart-ic-dar)}` = `clamp(26px,2.8vw,40px)` (`tokens.css:146`) ve kenarlık `--cizgi-soluk(.1)` — `Konum:106` ile birebir | `<CamPanel opaklik={0.74} dolgu="dar" className={...}>`. **Kalan:** `CamPanel.module.css:3` koşulsuz `backdrop-filter:blur(3px)` uygular; Konum'un iki kartında tasarımda `backdrop-filter` **yok** (tarama: `backdrop-filter` Konum ve Menü dosyalarında 0 kez). Ortak madde O6 |
| S15 | Parite `02-konum.jpg`'yi atlıyor; `03-konum.jpg` kapsam dışı | GEÇERLİ | `02-konum.jpg` Saatler + İletişim kartlarını sarmış halde gösteriyor (görsel doğrulandı); `03-konum.jpg` Paket şeridi + footer (doğrulandı) | `02-konum.jpg`'yi kullan |

### Eksikler (15 madde)

| # | Madde özeti | Kova | Kanıt | Kalan iş |
| --- | --- | --- | --- | --- |
| E1 | Hero adres satırı tümüyle atlanmış | KISMEN | `Konum:75-78`; `PinIkon` **hazır** (`components/ui/Ikonlar.tsx:5-11`, aynı path); `content/tr/ortak.ts:59` `adresTamSatir`, `:58` `adresSehirUlke` | Satırı kur. Ölçü `clamp(16px,1.4vw,19px)` token'sız (`--ol-govde` `1.35vw`, birebir değil) → O3 |
| E2 | Durum satırının üçüncü öğesi ("Girne saati, canlı") yok | KISMEN | `content/tr/konum.ts:4` `hero.saatEtiketi` var; ama `components/saat/DurumAltMetni.tsx` ana sayfaya özel (`ortak.durum.acikAlt/kapaliAlt`), bu metni basmaz | Düz `<span>` olarak bas (`font:400 13.5px/1;--krem-62`), `DurumAltMetni` kullanma |
| E3 | H1 tanımı yok | KISMEN | `content/tr/konum.ts:5-6` iki satır hazır; iz `-.03em` = `--iz-duygusal` (`tokens.css:134`, şu an kullanılmıyor); gölge `--golge-baslik` hazır | Ölçü `clamp(48px,7.4vw,116px)` token'sız → O3 |
| E4 | Hero dolgusu, CTA satırı, hayalet buton içindeki telefon SVG'si | KISMEN | `TelefonIkon` hazır (`Ikonlar.tsx:13-19`); `Buton.module.css:22` `.xl{padding:20px 34px;font-size:16.5px}` ve `:21` `.lg{18px 30px}` — tasarım hero'da birincil `19px 32px / 16px`, hayalet `18px 28px / 16px` (`Konum:80-81`), yani **hiçbir boy adımı birebir değil** | Boy seçimini ölçüp raporla (`lg` en yakını: 18/30 vs 19/32 ve 17/29 vs 18/28). Buton `gap:9px` (`Buton.module.css:6`) ikon aralığını karşılıyor |
| E5 | Birincil buton dışarıya link değil, `#harita`'ya kaydırma | KAPANDI | `Buton.tsx:31-36` `href.startsWith('#')` → düz `<a>`; `styles/animasyonlar.css:28` hareket azaltılmışta `scroll-behavior:auto` | `<Buton tur="birincil" boy="lg" href="#harita">`. Çapa payı için O2 |
| E6 | Harita bölümünün kabuğu (`<section id="harita">`) tanımlanmamış | GEÇERLİ | `Konum:88` | id zorunlu (E5'in hedefi); 96px çapa payı O2 |
| E7 | Levha içindeki cadde etiketi yok | GEÇERLİ | `Konum:94`; `content/tr/konum.ts:9` `caddeEtiketi` hazır; renk `--krem-55` (`tokens.css:41`) hazır | Yaz |
| E8 | Pin etiketi kutusu yok | KISMEN | `Konum:97`; `content/tr/konum.ts:10` `pinKapiNo: 'No:4'` ve `ortak.marka.ad` hazır | Kenarlık `rgba(250,170,31,.4)` token'sız → O4. İkinci parça rengi `--krem-55` hazır |
| E9 | Üç POI çipinin hiçbir değeri verilmemiş | KAPANDI | `Cip.tsx:7` `'poi'`; `Cip.module.css:47-54` `padding:7px 11px;background:var(--panel-poi)(.85);border:1px solid var(--cizgi-bolum)(.16);font:500 11.5px/1;color:var(--krem-66);white-space:nowrap` + `:60-65` tabular-nums — `Konum:98-100` ile birebir; `content/tr/konum.ts:11-14` üç ad, "· 80 m" bilinçli kaldırılmış | `<Cip tur="poi">`; konumlandırmayı levha yapar |
| E10 | Saatler kartındaki not paragrafı briefte yok | GEÇERLİ | `Konum:117`; `content/tr/konum.ts:19` `saatler.not` hazır; `components/saat/SaatTablosu.tsx:19-30` yalnız iki satır basar, `children` prop'u yok; `SaatTablosu.module.css:1-7` ve `iyilestirmeler.md:47` bunu montaj görevine bırakmış | Notu sayfa basar. **Yerleşim tuzağı:** kartın `gap:22px`'i araya girmesin diye `SaatTablosu` + not aynı sarmalayıcıda, aralarında boşluksuz olmalı (`02-konum.jpg` doğruluyor) |
| E11 | `AlkolsuzRozeti` hiçbir görevde üretilmiyor | GEÇERLİ | `components/ui/` altında yok; `content/tr/ortak.ts:71` `alkolsuzKisa` hazır; `Konum:119-122` — 7x7 nokta **animasyonsuz** (`DurumCipi`'nin nabızlı noktasıyla karıştırılmamalı) | Rozeti sayfa içinde yaz; kenarlık `--cizgi(.14)`, metin `--krem-74`, nokta `--tangerine` — hepsi token'lı |
| E12 | Bölüm ve kart kabuğu ölçüleri yok | KISMEN | `Konum:105-106,124`; `CamPanel` dolgu/zemin/kenarlığı karşılıyor (S14) | `flex:1 1 440px;min-width:300px;gap:22px` `className` ile geçilir; section flex/gap sayfa CSS'i |
| E13 | Kart başlıkları ("Saatler", "İletişim") briefte hiç geçmiyor | KISMEN | `content/tr/konum.ts:18,22` hazır; `Konum:107,125` `clamp(26px,2.8vw,38px)/1.14`, `-.02em`; `BolumBasligi` bu ölçeği taşımıyor (`orta` = `clamp(30px,3.6vw,48px)/1.12`) ve alt çizgi basar, tasarımda çizgi yok | Düz `<h2>` yaz. Ölçü token'ı yok → O3; iz `--iz-bolum` hazır |
| E14 | `IletisimSatiri` değerleri ve hover'ı verilmemiş | GEÇERLİ | `Konum:126-147`; hover kenarlığı `rgba(250,170,31,.7)` token'sız, hover zemini `rgba(250,170,31,.07)` = `--tangerine-07` (`tokens.css:102`) hazır | Bileşeni yaz (S13); `.7` token'ı O4 |
| E15 | WhatsApp/Instagram ikonlarının kaynağı belirtilmemiş; Instagram stroke tabanlı | KAPANDI | `components/ui/Ikonlar.tsx:21-27` WhatsApp, `:29-45` Instagram (`fill="none" stroke="currentColor" strokeWidth={1.9}`, rect 3.2/3.2/17.6/17.6 rx 5, circle r 4.1, circle 17.1/6.9 r 1.15) — `Konum:142` ile birebir | `<WhatsAppIkon boy={17} />`, `<InstagramIkon boy={17} />` |

---

## Sayfa görevlerinden önce yapılması gerekenler

Üç sayfanın da (ya da en az ikisinin) istediği, bugün var olmayan şeyler. Her biri
sayfa görevlerine bırakılırsa üç ayrı yerel kopya çıkar.

### O1. Bu üç sayfada `Bolum` kullanılamaz — karar gerekiyor

`components/ui/Bolum.tsx:47-58` her bölüme kaydırmaya bağlı opaklık + `translate3d`
uygular. Tasarım taraması: `data-erit` ve `data-yogunluk`, **Menu / Hikaye / Konum
dosyalarının üçünde de 0 kez** geçiyor (Ana Sayfa'da 8'er kez). Bu üç sayfa düz
`<section>` ile kurulmalı. Ama o zaman `Bolum.module.css:12`'deki
`scroll-margin-top` de miras alınmaz, bkz. O2.

Etkilenen: 11 (E16), 12, 13.

### O2. Çapa payı 96px, `Bolum`'daki 70px değil

`Menu Sayfasi.dc.html:347` ve `Konum Sayfasi.dc.html:252` `- 96`; `Ana Sayfa
Alternatif.dc.html:554` `- 70`. Repo yalnız 70px'i biliyor
(`components/ui/Bolum.module.css:12`, `components/layout/BeadRay.tsx:35`).
Menü'nün `#ocaktan`/`#ikramlar`/`#icecekler` ve Konum'un `#harita` hedefleri 96px
istiyor.

Etkilenen: 11 (E3), 13 (E5, E6).

### O3. Eksik ölçü token'ları

`kisitlar.md`: "tasarım token'ı olmayan bir değer kullanıyorsa token ekle,
yuvarlama". Bu üç sayfanın hiçbir başlık ölçüsünün token'ı yok:

| Değer | Nerede | Not |
| --- | --- | --- |
| `clamp(56px,9vw,140px)` + `-.055em` | Menü H1 (`Menu:76`) | iz için de token yok |
| `clamp(48px,7.4vw,116px)` | Konum H1 (`Konum:74`) | iz `-.03em` = `--iz-duygusal` hazır |
| `clamp(44px,6.6vw,104px)` | Hikaye H1 (`Hikaye:68`) | iz `--iz-baslik` hazır |
| `clamp(34px,4.6vw,64px)` | Hikaye Sofra (`Hikaye:125`) | |
| `clamp(34px,4vw,54px)` | Menü imza ürün adı (`Menu:109`) | `--ol-bolum-baslik` `32px` min ile karışmasın |
| `clamp(28px,3.2vw,44px)` | Hikaye Portre "İsim" (`Hikaye:84`) | |
| `clamp(26px,2.8vw,38px)` | Konum kart başlıkları (`Konum:107,125`) | iki kullanım |
| `clamp(24px,2.2vw,30px)` | Menü ürün kartı adı (`Menu:134,152,170,188`) | `--ol-menu-kalem` `22px` min, birebir değil |
| `clamp(22px,2vw,27px)` | Menü ikram adı (`Menu:213,225`) | |
| `clamp(16px,1.4vw,19px)` | Menü spot (`Menu:77`), Konum adres (`Konum:77`) | `--ol-govde` `1.35vw`, birebir değil; **iki sayfa paylaşıyor** |
| `clamp(16.5px,1.4vw,20px)` | Hikaye Sofra gövdesi (`Hikaye:126`) | |
| `clamp(15px,1.3vw,17px)` | Menü imza açıklaması (`Menu:110`), paket paragrafı (`Ana:342`, `Konum:157`) | **üç yerde** |
| `clamp(20px,2vw,26px)` | Menü imza fiyatı (`Menu:118`) | |

`--ol-duygusal` (`tokens.css:119`) hiçbir yerde kullanılmıyor ve yalnız `Ana:252`'ye
ait; bu üç sayfada **kullanılmamalı**.

### O4. Eksik renk token'ları

| Değer | Nerede | Sayfa |
| --- | --- | --- |
| `rgba(250,170,31,.28)` | ikram kartı kenarlığı (`Menu:206,218`) | 11 |
| `rgba(250,170,31,.4)` | pin etiketi kenarlığı (`Konum:97`) | 13 |
| `rgba(250,170,31,.7)` | `IletisimSatiri` hover kenarlığı (`Konum:127,134,141`) | 13 |
| `rgba(183,53,28,.65)` | ürün kartı hover kenarlığı (`Menu:125,143,161,179`) | 11 |
| `rgba(183,53,28,.4)` (kenarlık rolü) | imza paneli kenarlığı (`Menu:104`) | 11 |
| `rgba(183,53,28,.45)` | harita halkası (`Konum:95`) | 13 |
| `rgba(183,53,28,.22)`, `rgba(183,53,28,.85)` | pin gölge halkası ve parıltısı (`Konum:96`) | 13 |
| `rgba(242,233,220,.25)` | QR glifi çerçevesi (`Menu:254`) | 11 |
| `rgba(242,233,220,.05)`, `rgba(242,233,220,.045)` | harita ızgarası ve ikinci dikey yol (`Konum:90,92,93`) | 13 |
| `rgba(10,8,7,.6)` | harita levhası zemini (`Konum:89`) | 13 |
| `rgba(10,8,7,.7)` | gece menüsü not kartı zemini (`Menu:79`) | 11 |
| `rgba(10,8,7,.78)` | imza paneli zemini (`Menu:104`) | 11 |
| `0 26px 60px rgba(0,0,0,.5)` | ürün kartı hover gölgesi (`Menu:125`) | 11 |

Not: `rgba(183,53,28,.4)` değeri `--kor-leke-hover` olarak var ama adı "plaka kor
lekesi" rolünü taşıyor; kenarlık için ayrı bir ad gerekiyor, aynı token'ı iki
anlamda kullanmak `tokens.css:74-79`'un kendi sözleşmesini bozar.

### O5. `BolumBasligi` not rengi sabit

`components/ui/BolumBasligi.module.css:38` `.not{color:var(--krem-66)}`. Ana
Sayfa'da doğru (`Ana:172` `.66`), ama menü sayfası İkramlar'da `.72` (`Menu:203`),
İçecekler'de `.64` (`Menu:236`). Üç ayrı değer, tek sabit.

Etkilenen: 11 (E1).

### O6. `CamPanel` bulanıklığı koşulsuz

`components/ui/CamPanel.module.css:3` her panele `backdrop-filter:blur(3px)`
uyguluyor. Tasarım taraması: `backdrop-filter` yalnız `Ana Sayfa Alternatif`
(4 kez) ve `Hikaye Sayfasi` (2 kez) dosyalarında var; **Konum ve Menü
dosyalarında 0 kez**. Konum'un iki kartı `CamPanel` ile kurulacaksa bir
`bulanik={false}` (ya da eşdeğeri) gerekiyor.

Etkilenen: 13 (S14).

### O7. `UstBar` iç sayfa varyantı üç sayfada da tasarımdan ayrılıyor

Denetimlerin hiçbiri bunu yakalamadı, çünkü ikisi de kabuğu kapsam dışı saymıştı.

- **Menü sayfası**: tasarımın nav'ı `Ocaktan / İkramlar / İçecekler / Hikaye /
  Konum` (`Menu:50-54`), yani aktif sekme yok, üçü sayfa içi çapa. Uygulanan
  `UstBar` (`components/layout/UstBar.tsx:22-26,56-73`) `Menü (aktif) / Hikaye /
  Konum` basıyor.
- **Hikaye sayfası**: CTA "Yol tarifi al" tasarımda Konum **sayfasına** link
  (`Hikaye:56`); `UstBar.tsx:79` her rotada `yolTarifiUrl()` (harici Google Maps).
- **Konum sayfası**: CTA `data-git="harita"`, yani sayfa içi `#harita` kaydırması
  (`Konum:56`); yine `yolTarifiUrl()` basılıyor.

Bu bir karar maddesidir (tutarlı kabuk mu, sayfa başına tasarım mı), üç sayfa
görevinin ayrı ayrı çözmesi gereken bir şey değil.

### O8. `AltBilgi` üç sayfada da tasarımdan ayrılıyor

`components/sayfa/Kabuk.tsx:32` on rotanın hepsine aynı footer'ı basıyor. Tasarım:

- **Menü**: dört kolonlu footer değil, **kompakt tek şerit** (marka + `Girne, Naci
  Talat Caddesi · Her gün 10:00 - 05:00` + iki buton), `Menu:283-292`. Sözlükte
  hazır: `ortak.satirlar.adresVeSaat` (`content/tr/ortak.ts:60`).
- **Hikaye / Konum**: dört kolon ama ikinci kolon **"Sayfalar"** (link listesi),
  `Hikaye:141`, `Konum:173`. `AltBilgi.tsx:35-49` ikinci kolonu **"Adres"**
  yapıyor, çünkü Ana Sayfa'nın footer'ından (`Ana:361`) kopyalandı. Sözlükte
  `ortak.footer.sayfalarBaslik` (`content/tr/ortak.ts:85`) hazır ve şu an
  **kullanılmıyor** (`AltBilgi.tsx:102-107` bunu bilinçli olarak not etmiş).

### O9. Konum sayfasında da Paket şeridi var, hiçbir görev onu Konum için üretmiyor

`Konum Sayfasi.dc.html:152-163`, Ana Sayfa'nınkiyle (`Ana:336-348`) satır satır aynı
kabuk; tek fark buton sayısı (Konum'da iki: `Paket sipariş` + telefon; Ana'da üç:
+ WhatsApp). Task 10 brief'i (`task-10-brief-v2.md:26`) bunu ana sayfa için "bölüm
değil, düz `<div>`" olarak kuruyor. Task 13 brief'i hiç anmıyor, Task 13 denetimi de
"kapsam dışı" demiş. Malzeme hazır: `Buton tur="koyu"|"koyuOutline"`
(`Buton.module.css:49-56`), `TaneDizilimi ton="koyu"` (`TaneDizilimi.module.css:34-35`,
yorumu zaten "Ana:339, Konum:155" diyor), `ortak.paket` (`content/tr/ortak.ts:75-80`).

Task 10 bunu ana sayfaya gömerse Konum ikinci bir kopya yazmak zorunda kalır.
Task 10 başlamadan paylaşılan bir `PaketSeridi`ne karar verilmeli.

### O10. `fotograflar` manifestinde ikinci "tek anahtar, iki etiket" çakışması

`tane-yakin-cekim` için çözülen sorun (`fac8f05`, `tane-yakin-cekim-yatay`)
`kurulu-sofra` için hâlâ duruyor: manifest `'kurulu sofra, üstten'`
(`content/fotograflar.ts:18`), Ana Sayfa öyle basıyor (`Ana:239`), menü çekim karosu
ise `'kurulu sofra'` (`Menu:274`).

Etkilenen: 11 (S10).

### O11. İkincil butonun kenarlığı: `.36` sabiti üç değeri karşılıyor

`Buton.module.css:40` `--cizgi-buton` = `.36`. Tasarım: `Ana:113` (xl) `.4`,
`Hikaye:129` ve `Konum:81` (lg) `.38`, `Ana:319-320` ve `Menu:290` (md/lg) `.36`,
mobil `.32`. Hover zemini de ayrışıyor (`Ana:113` `.12`, diğerleri `.1`;
`Buton.module.css:43` `--tangerine-10`). Şu anki hali Hikaye ve Konum'un lg
butonlarında 0.02 sapma demek. Ya boya göre ayrıştırılır ya da tek sapma olarak
bir kez raporlanır; üç sayfanın üç kez keşfetmesi gerekmez.

### O12. 16px altı gövde metni çelişkisi bir kez karara bağlanmalı

`kisitlar.md` "gövde metni 16px altına inmez" diyor; tasarım üç sayfada da iniyor
(Hikaye Usul gövdesi 15.5px, NotBlogu 14.5px, Menü kart açıklaması 14.5px, ikram
açıklaması 14px, Konum `IletisimSatiri` alt satırı 14px, plaka etiketleri 12-12.5px).
Repo bu çelişkiyi zaten tasarım lehine çözmüş görünüyor (`Cip.module.css:28` 14px,
`BolumBasligi.module.css:37` 15px, `MenuSatiri.module.css:43` 15px,
`FotoYuvasi.module.css:137` 12.5px), ama bu hiçbir yerde karar olarak yazılı değil.
Üç sayfa görevi de aynı çelişkiyi ayrı ayrı raporlayacak.

---

## Denetimin kendisinde yanlış bulduklarım

Denetimlerin tasarım okumaları tek tek doğrulandı; **tasarımı yanlış okuyan bir
madde bulamadım.** Rastgele değil, en riskli 20 sayısal iddiayı kaynağından
karşılaştırdım (harita levhasının dokuz değeri, üç bölüm başlığının tipografisi,
tane raylarının alfaları, `.dc.html` script'lerinin çapa payları, ekran görüntüsü
listesi). Hepsi doğru çıktı. Bulduklarım repo tarafındaki bayatlık ve iki eksik
kapsam:

**D1. Task 12, "Files bölümü ve Step 5" (sapma) artık kısmen yanlış.**
"`components/sayfa/` dizini repoda yok, dolayısıyla HikayeSayfasi.tsx 'modify'
değil 'create'" iddiası yazıldığı anda doğruydu (denetim `615383b` ile, dizin
`be51a74` ile geldi), bugün yanlış: `components/sayfa/HikayeSayfasi.tsx` var ve
brief'in "Modify" etiketi **doğru**. Maddenin `git add` yarısı geçerli kalıyor.

**D2. Task 11, eksik "Bölüm id'leri" maddesinin gerekçesi bayat.**
"id'ler konmazsa üst bar navigasyonu bu sayfada çalışmaz" diyor. Uygulanan `UstBar`
o üç tetikleyiciyi zaten basmıyor (`components/layout/UstBar.tsx:22-26`), yani
kırılacak bir navigasyon yok. **Sonuç değişmiyor** (id'ler tasarımda var ve
konmalı), ama gerekçe artık O7'nin altına düşüyor: asıl sorun id'lerin yokluğu
değil, üst barın menü sayfasında farklı bir nav basması.

**D3. Task 12, `NotBlogu` maddesindeki "token yok" iddiası artık geçersiz.**
"Çizgi tam #FAAA1F değil .5 alfalı; `styles/tokens.css`'de bu değere token yok"
diyordu ve o an haklıydı; `--tangerine-50` `7b04cec` ile eklendi
(`styles/tokens.css:94`). Maddenin geri kalanı (bileşen yok, "alıntı" adlandırması
yanlış) geçerli.

**D4. İki denetim de kabuğu (üst bar + footer) kapsam dışı saydı, ama üç sayfa da
kabuktan sapıyor.** Task 11 denetimi footer farkını yalnız buton gölgesi
düzeyinde yakalamış (`Menu:289`'un `box-shadow` taşımaması), footer'ın **tümüyle
farklı bir bileşen** olduğunu yakalamamış. Task 12 ve Task 13 denetimleri footer'ı
hiç anmamış, oysa ikisinde de ikinci kolon "Sayfalar", uygulanan `AltBilgi`'de
"Adres". Üst bar CTA hedefi farkı (O7) da üç denetimin hiçbirinde yok. Bkz. O7, O8.

**D5. Task 13 denetimi Paket şeridini "kapsam dışı" deyip bırakmış.**
Doğru bir kapsam kararı, ama Konum sayfasının tasarımı o şeridi içeriyor ve onu
üretecek bir görev Konum için tanımlı değil. Bkz. O9.
