# İyileştirme kaydı

Handoff bir taslak. Uygulama sırasında ortaya çıkan sapmalar ve iyileştirme
önerileri burada toplanır; her biri gerekçesiyle birlikte. Kullanıcı hangilerinin
kalacağına bakar.

Sütunlar: nerede, ne değişti veya ne öneriliyor, neden, durum.

## Uygulandı

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| Kor sahnesi | Handoff'taki `position:absolute` + scroll'da `translate3d` yerine gerçek `position:fixed` | Handoff'taki sahte fixed, tasarım dosyasının bir tuval içinde yaşamasından kaynaklanıyordu. Next'te gerekçesi yok ve bir scroll dinleyicisini tamamen düşürüyor | uygulandı |
| Buton ve linkler | Tasarımdaki `<div>` yerine gerçek `<a>` ve `<button>` | Klavye erişimi ve ekran okuyucu. Tasarım aracının kısıtıydı, tasarım kararı değil | uygulandı |
| Dil geçişi | DOM metni değiştiren toggle yerine rota tabanlı `/` ve `/en` | Statik export'ta SEO ve paylaşılabilir URL. Handoff'un `data-en` değerleri EN sözlüğünün kaynağı olarak korunuyor | uygulandı |
| `isletme.binaNo` | `null` yerine `Şht. Özdemir Apt No:4` | **Sahibi 12 Ağu 2026'da tadilat belgesiyle teyit etti.** İlk gerekçe (tasarım dosyaları + handoff README) daireseldi: tasarım, tasarımın README'siyle doğrulanmıştı. İşletmenin kendi bilgi dosyası (`Cigerci-Bozo-proje-bilgi-dosyasi-v2.md:59`) konumu yalnız cadde olarak kaydediyor; eksiklik eleştirisi bunu yayın engeli adayı saymıştı, belge daireselliği kırdı | doğrulandı |
| `ICECEK_YER_TUTUCU_ADEDI` | 3 yerine 1 | Tasarımda üç adlı içeceğin ardından tek kesik slot var. Plandaki 3, brief'teki üç noktanın yanlış okunmasıydı | uygulandı |
| `FotoYuvasi` köşe işaretleri | İki köşeli varyantta bitişik çift yerine çapraz çift (sol-üst, sağ-alt) | Tasarımda çapraz. Kod dizinin ilk ikisini alıyordu, sessiz görsel hata | uygulandı |
| Hikaye sayfası başlığı | `Usül Urfa'dan` yerine `Usul Urfa'dan` | TDK yazımı "usul"; tasarımdaki dizgi hatası. Sahibi onayladı 11 Ağu 2026 | uygulandı |
| Ana sayfa komşuluk çipi | `Girne Macro Market, 80 m` yerine `Girne Macro Market` | Sahibi göstermek istemedi. **Gerekçe 12 Ağu 2026'da düzeltildi:** mesafe aslında doğrulanmıştı, işletme bilgi dosyası onu `[DOĞRULANMIŞ] İşletmeci beyanı` tablosunda veriyor ("80 m geri, Girne Macro Market"). Karar sağlam, eski gerekçe yanlıştı. Sahibi onayladı 11 Ağu 2026 | uygulandı |
| `Cip` köşe yarıçapı | Planın dediği 2px yerine 0 | Üç tasarım dosyası çiplerin yarıçapsız olduğunu açıkça söylüyor. Plan tek satırlık düzyazıydı | uygulandı |
| `InstagramIkon` | Dolgu yerine kontur tabanlı | Doğrulanmış `.dc.html` kaynağı kontur kullanıyor; plandaki "fill=currentColor" özeti fazla kabaydı | uygulandı |
| `FotoYuvasi` karo varyantı | Kenarlık, iç gölge ve dört köşe işareti kaldırıldı; `--plaka-zemin` zemin, sol-alttan taşan kor lekesi ve kutu içi (taşmayan) etiket eklendi | Tasarımdaki çekim karosu (`Menu Sayfasi.dc.html` satır 271-277, 7 kare) bunların hiçbirini taşımıyor: `background:#0C0A09`, `overflow:hidden`, `radial-gradient(closest-side,rgba(183,53,28,.3),transparent)` sol-alttan taşan leke, etiket `left:12px;bottom:11px` kutunun içinde. Plan yapısal olarak yanlıştı, tüm çekim listesi ızgarasını bozacaktı | uygulandı |
| `FotoYuvasi` `koseIsaretleri` tipi | `2 \| 4` yerine `0 \| 2 \| 4`; `karo` varsayılanı 0, diğerleri 4 | Karo köşe işareti taşımadığından sıfırı ifade edemeyen bir tip render edilemez bir varyant bırakıyordu | uygulandı |
| `FotoYuvasi` `.kor` sınıfı | TSX'te `stil.kor` her zaman render ediliyordu ama CSS'te hiç tanımlı değildi (görünmez, boyutsuz span) | Karo'nun kor lekesi için aynı elemanı `.karo .kor` ile stilllendirdim; `portre`/`genis`'te hâlâ tanımsız kalıyor çünkü gerçek `FotoPlakasi` işaretlemesinde (`Ana Sayfa Alternatif.dc.html` satır 148, 283; `Hikaye Sayfasi.dc.html` satır 73) böyle bir katman yok. Kendiliğinden bulunan, ayrıca istenmemiş bir ölü kod düzeltmesi | uygulandı |
| `Cip` ikram varyantı | Çerçeveli krem kutu yerine düz tangerine metin, `padding:0` | `Menu Sayfasi.dc.html` satır 215, 227: `font:600 15px/1 Inter;color:#FAAA1F;margin-top:4px`, kenarlıksız ve zeminsiz. Plandaki kutu başka bir bileşenden (ikramCipi teaser kartı) gelmiş. `margin-top:4px` bilerek eklenmedi, o çağıranın bağlam yerleşimi | uygulandı |
| `Cip` outline ve dolu varsayılanları | Ortak `padding:6px 12px; font-size:12.5px` yerine her tür kendi gerçek değerini taşır | `Menu Sayfasi.dc.html` satır 107 (outline, "imza ürün"): `padding:5px 10px;border:1px solid rgba(250,170,31,.45);font:600 11.5px/1 Inter;color:#FAAA1F`. Satır 112-114 (dolu, ölçü cipleri "8 şiş" / "4 ciğer, 2 kuyruk yağı" / "3 dakika"): `padding:7px 12px;background:rgba(242,233,220,.06);font:500 12.5px/1 Inter;font-variant-numeric:tabular-nums;color:rgba(242,233,220,.74)`. Tarayıcıda ölçüldü, birebir eşleşti | uygulandı |
| `--plaka-zemin` token'ı | `#0C0A09` palete eklendi, bileşende ham hex yerine token kullanıldı | Menü sayfasında 15 kez geçen gerçek tasarım değeri (`Menu Sayfasi.dc.html`, yalnız o dosyada); marka kitabının sekiz renkli listesi bu yüzey değerini atlamış | uygulandı |
| Yapısal veri `priceRange` | Brief'teki `'$$'` alanı düşürüldü | Menüdeki tüm fiyatlar `null`. Fiyat aralığı yayınlamak uydurulmuş bir olguyu arama motoruna göndermek olurdu. Uygulayıcı söylenmeden karar verdi | uygulandı |
| Yapısal veri `addressCountry` | `CY` olarak kalır | KKTC'nin ISO 3166-1 kodu yok, schema.org 2 harfli ISO öneriyor, Google Maps Girne'yi Cyprus altında konumluyor. Sitede görünen metin "KKTC" olarak kalır, değişmez. Sahibi onayladı 11 Ağu 2026 | uygulandı |
| `Buton .koyu:hover` | Uydurulmuş `#241e1b` zemin yerine tasarımın gerçeği: zemin değişmez, `translateY(-2px)` + `0 14px 34px rgba(26,22,20,.4)` | `#241e1b` handoff'ta sıfır kez geçiyor. Palete 9. renk sokan ve etkileşimi yanlış yazan bir plan hatasıydı | uygulandı |
| `Cip` (tüm türler) | Brief'teki `border-radius:2px` yerine `0` | `docs/tasarim/ana-sayfa.json` ("Hicbirinde border-radius yok"), `hikaye.json` ("border yok, radius 0") ve `menu.json`'daki üç Cip varyantının hiçbirinde radius yok; ifade tek seferlik değil, üç ayrı dosyada tekrarlanan bir kural. Buton'un 2px'i Cip'e şablonlanmış görünüyor | uygulandı |
| `InstagramIkon` | Brief'in genel "hepsi fill=currentColor" ifadesi yerine `fill="none" stroke="currentColor" stroke-width="1.9"` | Adres kaynak listesinin en üstündeki `.dc.html` dosyasından (`Konum Sayfasi.dc.html`) birebir çıkarılan SVG işaretlemesi ve `docs/tasarim/konum.json`'daki "InstagramIkon ... fill=none stroke=currentColor stroke-width:1.9" ifadesi ile doğrulandı. Brief'in Step 4 metni kod değil, dört ikon için tek satırlık kaba bir özetti | uygulandı |
| `FotoYuvasi.module.css` `.etiket` zemini | Brief'teki ham `#0A0807` yerine `var(--zemin)` | Aynı değerin zaten token'ı var; görünüm değişmedi, yalnız "ham hex kullanma" kuralına uyum | uygulandı |
| `SaatTablosu` satır sayısı | Brief'in "yedi satır, her gün bir satır" yerine iki satır (Bugün + haftalık özet) | `Konum Sayfasi.dc.html` (satır 108-118) ve `docs/tasarim/konum.json`'daki `SaatSatiri` bileşeni yalnız iki satır tanımlıyor; saatler her gün aynı olduğundan yedi satır tasarımda hiç yok. Brief'in Step 4 metni muhtemelen genel bir "saat tablosu" varsayımıydı, gerçek tasarımı okumamıştı | uygulandı |
| `SaatTablosu` içerik anahtarları | Brief'in önerdiği `ortak.satirlar.saatlerGunluk` yerine `ortak.satirlar.saatAraligi` ve `ortak.satirlar.haftaAraligi` | `saatlerGunluk` ("Her gün 10:00 - 05:00") dört sayfanın footer'ında kullanılıyor, Saatler kartında değil. Kart satırları `saatAraligi` ("10:00 - 05:00") ve `haftaAraligi` ("Pazartesi ile pazar") kullanıyor; dört `.dc.html` dosyasında da bu ayrım tutarlı | uygulandı |
| `VardiyaSeridi` içerik kaynağı | Brief'in "içerik `ortak`'ta yaşar" varsayımı yerine `ana.gece.vardiyalar` / `ana.gece.sonNot` | Çip etiketleri ve kapanış notu `ortak.ts`'de değil, sayfaya özel `content/*/ana.ts` > `gece` bloğunda (`vardiyalar: ['21:00',...]`, `sonNot: "ocak 05:00'te söner"`). Salt okunur import, `content/` dosyaları değiştirilmedi | uygulandı |
| `VardiyaSeridi` çip sayısı | 6 çip (21/23/01/02/03/04) | `Ana Sayfa Alternatif.dc.html` (satır 255-260) ve `ana.ts`'deki `gece.vardiyalar` dizisi 6 saat veriyor. Ayrı bir `docs/tasarim/mobil-prototip-davranis-referansi.json` dosyası farklı, 4 çipli bir mobil-çekmece varyantı (`[21,23,1,3]`) tanımlıyor ama bu site ayrı bir mobil çekmece içermiyor; `.dc.html` kaynağı otorite olduğundan 6 çip kullanıldı | uygulandı |
| `VardiyaSeridi` sonNot | Çip şeridinin sonuna dahil edildi | `Ana Sayfa Alternatif.dc.html` satır 254-265'te "ocak 05:00'te söner" notu, altı çiple AYNI sarmalayıcı flex-wrap div içinde, son eleman olarak duruyor; DOM sınırı bunu doğal olarak `VardiyaSeridi`'nin parçası yapıyor | uygulandı |
| `CanliSaat` "orta" boyutu | Brief'in "orta = 21px" yerine gece bölümünün düz tangerine saati (`clamp(28px,3.4vw,44px)`, tek renk, nokta yanıp sönmez) | Tasarım kaynaklarının hiçbirinde saat için 21px değeri yok. `docs/tasarim/ana-sayfa.json` > `paylasilanBilesenler` > `CanliSaat` üç kanonik varyantı tek bileşende topluyor: "hero ayrık" (dev), "gece tam" (orta), "gece dev hayalet" (hayalet); brief'in üç prop'u bu üçlüyle birebir eşleşiyor, 21px hiçbir yerde geçmiyor | uygulandı |
| `CanliSaat` "orta"/"hayalet" kolon animasyonu | Brief'in "iki nokta her boyutta ayrı `span` + `colonBlink`" ifadesi yerine yalnız "dev" boyutunda ayrı/animasyonlu kolon | `Ana Sayfa Alternatif.dc.html` satır 246 ve 248'de `data-saat-dev` ve `data-saat-tam` düz metin (`03:40`), iç span yok, `colonBlink` referansı yok; yalnız hero'daki `data-saat-s`/`data-saat-d` ayrık span'lı ve animasyonlu. Tasarımı birebir izledim | uygulandı |
| `FotoYuvasi` `.bos` sınıfı kaldırıldı; portre/geniş zeminsiz | `background: rgba(10,8,7,.55)` yerine hiç zemin yok; kenarlık ve iç gölge aynen kaldı | Sahibi doğruladı: plaka arkasındaki kor sahnesine açılan bir pencere, opak kutu değil. `Ana Sayfa Alternatif.dc.html`'deki üç plaka da (satır 148, 283 portre; satır 236 geniş) yalnız `border` + `inset box-shadow` taşıyor, `background` hiç yok; iç gölge çerçeveyi karartıp ortayı sahne parıltısına açık bırakıyor, ateşi camdan izleme hissi tam burada üretiliyor. `.bos`'un tek işi bu zemindi ve artık hiçbir varyant istemiyor (karo kendi `--plaka-zemin`'ini doğrudan taşıyor), boş kural bırakmak yerine sınıf tamamen silindi. Şeffaflık, tarayıcıda güçlü renkli bir zemine karşı `getComputedStyle` ile yapısal olarak doğrulandı (`background-color: rgba(0, 0, 0, 0)`), kor sahnesi henüz kurulu olmadığı için görsel doğrulama mümkün değildi | uygulandı |
| Krem metin opaklığı skalası | `kisitlar.md`'nin sekiz değerlik listesi yerine dokuz yeni token eklendi: `--krem-55/-60/-64/-68/-72/-75/-76/-80/-82` | Sahibi beş tasarım dosyasını tek tek saydı: 40 farklı krem alfa değeri var, sekiz değil; sekizli liste bir README özetiymiş. Kural düzeltildi: yuvarlama yok, eksik token varsa eklenir. Fix round 1 | uygulandı |
| `DurumCipi` `.kapaliMetin` | `--krem-78` yuvarlaması yerine tam `--krem-80` (tasarımın gerçek `.8` değeri) | Token artık var, yuvarlamaya gerek kalmadı. Fix round 1 | uygulandı |
| `SaatTablosu` `.haftalik` | `--krem-74` yuvarlaması yerine tam `--krem-76` (tasarımın gerçek `.76` değeri) | Token artık var, yuvarlamaya gerek kalmadı. Fix round 1 | uygulandı |
| `CanliSaat`/`DurumCipi` Konum ve Menü hero boyutu | Dördüncü bir `CanliSaat` varyantı (`kucuk`) ve `DurumCipi`'ye yeni bir zorunlu `boy: 'dev' \| 'kucuk'` prop'u eklendi | `Konum Sayfasi.dc.html` VE `Menu Sayfasi.dc.html` hero'ları birebir aynı küçük ölçüyü taşıyor (DurumCipi 9px 15px/8px nokta/13.5px metin/12px gölge; saat `clamp(24px,2.6vw,34px)`, ls -.02em, gap 2px, ayrık span + yanıp sönen kolon). `konum.json`'daki "hero-tek-kullanim" etiketi yanıltıcıydı, tek kullanım değil; iki sayfada tekrarlanan gerçek bir ortak boy. Named variant seçildi (override değil): 3 ayrık-yapılı saat kullanımından 2'si (Konum + Menü) bu küçük ölçüyü istiyor, çoğunluk durum bu, "nadir" olan aslında ana sayfanın "dev" boyutu (1 kullanım). Override seçilseydi aynı sayısal değerler iki ayrı sayfa dosyasında tekrarlanırdı; isimli varyant her çağrı yerinde tek kelimeye iniyor, dört sayfa toplamında daha az kod. Menü'nün letter-spacing'i (-.03em) Konum'unkinden (-.02em) 0.01em farklı, göz ile ayırt edilemez, tek değerde birleştirildi. Fix round 1, kullanıcının kararıyla | uygulandı |
| `SaatTablosu` not paragrafı | Kapsam dışı bırakıldı | Tasarımda üçüncü bir "not-paragrafi" satırı var ama metni (`content/tr/konum.ts` > `konum.saatler.not`) `ortak` değil sayfaya özel `konum` sözlüğünde; `SaatTablosu`'nun kilitli arayüzü yalnız `dil` alıyor. Bileşeni Konum sayfasına özel bir sözlük dalına bağlamamak için not paragrafını montaj görevine (Saatler kartını kuran task) bıraktım | uygulanmadı, hâlâ montaj görevine kalıyor |
| `UstBar` marka kelimesi | Brief'in `700 21px` yerine `800 21px` | Dört `.dc.html` dosyasının hepsi (`Ana Sayfa Alternatif`, `Hikaye Sayfasi`, `Konum Sayfasi`, `Menu Sayfasi`) birebir `font:800 21px/1 'Bricolage Grotesque'` veriyor; brief'in 700'ü hiçbir kaynakta geçmiyor | uygulandı |
| `DilAnahtari` pasif renk | Brief'in `var(--krem-50)` yerine `var(--krem-58)` | Dört `.dc.html` sayfasının üçü pasif dil için `rgba(242,233,220,.58)` veriyor (`Ana:59`, `Hikaye:54`, `Konum:54`); dördüncüsü `.5` (`Menu:56`). Çoğunluk `.58`. **Gerekçe 12 Ağustos 2026'da düzeltildi:** eski hali "`.5` hiçbir kaynakta yok" diyordu, yanlıştı; karar değişmedi, dayanağı dörtte üç çoğunluk | uygulandı |
| `UstBar` iç sayfa varyantı | Brief yalnız ana sayfa barını (80px/gap 30/gradient .9→0) tarif ediyordu; `Hikaye`/`Konum`/`Menu Sayfasi.dc.html` farklı bir bar tarif ediyor (78px/gap 28/gradient .94→.55, aktif sekmede 2px tangerine alt çizgi). `ilerleme` prop'u true iken ana sayfa varyantı, false iken iç sayfa varyantı render edilir | Tek bileşende iki gerçek tasarım durumu var; brief'in özeti eksikti, ikisi de uygulandı | uygulandı |
| `UstBar` nav öğeleri | Ana sayfada Menü/Gece(`#gece` bağlantısı)/Hikaye/Konum, iç sayfalarda yalnız Menü/Hikaye/Konum | `Ana Sayfa Alternatif.dc.html`'in "Gece" öğesi `#gece` bölümüne kayar, yalnız ana sayfada anlamlı. `Menu Sayfasi.dc.html`'in Ocaktan/İkramlar/İçecekler sayfa-içi çıpaları menü sayfasının kendi içeriğine bağlı, henüz kurulmadı; kabuk görevi kapsamı dışında bırakıldı | uygulandı, menü sayfasının kendi çıpaları sonraki bir göreve kalıyor |
| `UstBar` 780px altı ölçüler | `Mobil Prototip.dc.html`'in kendi ust-bar'ından (58px, marka 800 17px, backdrop-filter blur(10px), gradient .94→.6) alındı | Brief yalnız "nav gizlenir, hamburger görünür" diyordu, ölçü vermiyordu; ayrı bir bileşen açmak yerine aynı `UstBar`'a medya sorgusu eklendi. Mobil prototipteki `position:sticky` + scroll-transform hilesi kopyalanmadı: `position:fixed` her genişlikte kullanılıyor (davranış referans dosyasının kendi notu bunu öneriyor) | uygulandı |
| `UstBar`/`GeceSeridi` mobilde dil anahtarı | Mobil prototip yalnız statik "TR" metni gösterip EN bağlantısını hiç taşımıyor; kabukta tam `DilAnahtari` (TR/EN ikisi de) her genişlikte görünür kaldı | EN bağlantısını mobilde tamamen kaldırmak İngilizce sayfaları mobilden erişilemez yapardı; gözden kaçmış bir basitleştirme olarak değerlendirildi, sessizce kopyalanmadı | uygulandı |
| `GeceSeridi` 780px altı ölçüler | `Mobil Prototip.dc.html`'den: nokta 6px, metin 11.5px, padding 7px 18px, gap 8px | Aynı gerekçe: ayrı bir mobil bileşen yerine tek `GeceSeridi`'ye medya sorgusu eklendi | uygulandı |
| `Cekmece` zemin rengi | Tasarımın `rgba(8,6,5,.96)` yerine `rgba(10,8,7,.96)` (`--zemin`'in rgb'si) | `rgba(8,6,5,...)` kısıtlar.md'nin yedi renkli paletinde yok; onaylı zemin `#0A0807` = `rgb(10,8,7)`'ye iki kanal kadar yakın, elle yazılmış bir yakın-yanlış görünüyor. Renk kuralı sert olduğundan sessizce kopyalanmadı, en yakın onaylı tona düzeltildi | uygulandı |
| `Cekmece` durum noktası | Tasarımın hep yanık/parlayan noktası yerine kapalıyken sönük (`DurumCipi` ile aynı açık/kapalı davranışı) | Davranış referans dosyasının kendi notu bunu bir tutarsızlık olarak işaretliyor ve "implementasyonda tutarlı hale getirilmeli" diyor; tasarımın kendi talimatı izlendi | uygulandı |
| `Cekmece` bağlı link listesi | Tasarımın Menü/Hikaye/Konum/Galeri/Rezervasyon'u yerine yalnız Menü/Hikaye/Konum | Galeri ve Rezervasyon bu sitenin mimarisinde (`RotaAnahtari`, içerik sözlüğü) karşılığı olmayan sayfalar; uydurulmadı. "Ana sayfa" da eklenmedi, tasarımın iki ayrı çekmece kopyası da bunu tutarlı biçimde atlıyor (çekmece kapanınca üst bardaki logo zaten ana sayfaya gider) | uygulandı, karar owner'a bildirilmeli |
| `AltBilgi` marka zar rayı | Tasarımın büyük karelerde soluk krem (`rgba(242,233,220,.75)`) + tam güçte amber ikili tonu yerine `TaneDizilimi`'nin tam güç varsayılanı | `TaneDizilimi` (ui/, düzenlenemez) yalnız `boy`/`bosluk`/`anahat`/`cizgi` alıyor, kare başına ayrı ton parametresi yok. Footer'ın telif şeridindeki mini rayda aynı efekt tasarımın kendisi de sarmalayıcı `opacity:.45` ile kurduğu için orada birebir uygulanabildi | uygulanmadı, TaneDizilimi'ye ton prop'u eklenmeden çözülemez |
| `MobilAksiyonBari` "Yol tarifi" metni | Tasarımın kısaltılmış "Yol tarifi" yerine sözlükteki tek hazır metin "Yol tarifi al" | Mobil prototipin alt eylem barında metin kısaltılmış ama içerik sözlüğünde bu kısa varyant yok; `content/` bu görevde düzenlenemiyor | uygulanmadı, içerik sahibine `cta.yolTarifiKisa` gibi bir anahtar önerilmeli |
| `AltBilgi` telif satırı | Sözlükteki `telif` ("© 2026 Ciğerci Bozo") tek başına yerine `telif + " · " + satirlar.adresSehirUlke` | Tasarım telif satırında şehir/ülke ekini de gösteriyor (`© 2026 Ciğerci Bozo · Girne / KKTC`); sözlükte birleşik hali yok, iki doğrulanmış parça aynı "·" kalıbıyla birleştirildi, yeni metin uydurulmadı | uygulandı |
| `lib/site.ts` `yolTarifiUrl()` | Brief'in adres sorgusuna yalnız ad/cadde/şehir/ülke koyan örneği yerine bilinen `binaNo` da eklendi | `isletme.binaNo` doğrulanmış ve dolu; onu Google Maps aramasından dışarıda bırakmanın tasarım kaynaklı bir gerekçesi yok, yalnızca brief örneğinin eksikliğiydi | uygulandı |
| `lib/site.ts` `yolTarifiUrl()` imzası | Brief'in parametresiz imzası yerine varsayılanı gerçek `isletme` olan opsiyonel `isletmeVerisi` parametresi | Bilinen-koordinat dalı gerçek veriyle test edilemez (koordinat şu an `null`); varsayılan değer sıfır argümanlı çağrıyı bozmuyor, yalnız testte enjekte edilebilir kılıyor | uygulandı |
| `BeadRay` erişilebilirlik | Brief'in "her bead gerçek buton + aria-label" ile kisitlar.md'nin "bead rows aria-hidden" kuralı çelişiyordu | Kapsayıcı `aria-hidden`, düğmeler `tabIndex={-1}` (klavye/ekran okuyucudan çıkar, fare/dokunmayla tıklanabilir kalır). Erişilebilirlik kısıtı bağlayıcı katmanda, brief'in cümlesi tercih edildiğinde bağlayıcı kural ihlal edilirdi | uygulandı |
| Kabuk bileşenlerinin `aria-label` metinleri (hamburger aç/kapat) | Sözlükte karşılığı olmayan sabit TR/EN metin ("Menüyü aç"/"Open menu" vb.) | Ekran okuyucuya özel, görünmeyen altyapı metni; tasarımda hiç yok. Görevi durdurup sormak yerine düşük riskli, standart bir metin seçildi | uygulandı, içerik sahibine kalıcı bir sözlük anahtarı önerilmeli |
| `Acilis` kaydırma ipucu, 780px altı | Tasarımın masaüstü ipucu (`Ana:120-124`) 780px altında hiç basılmıyor (`display:none`) | Ölçüldü: 390x844'te ipucu hero'nun dibinde (y 773-788) kalıyor, sabit `MobilAksiyonBari` ise y=767'den başlıyor (aynı 780px eşiği, `MobilAksiyonBari.module.css:55`). İpucunun 44px'lik dokunma hedefinin yalnız 8px'i erişilebilir; kalan alana dokunan kullanıcı barın "Yol tarifi" hedefine, yani haritaya gidiyor. Proje kuralı: çakışan hedef kısa hedeften kötüdür (yanlış hedef başarılı olur ama yanlış şeyi yapar). Kaldırma kararı uydurma değil, tasarımın kendi kararı: `Mobil Prototip.dc.html` hero'sunda bu ipucu yok ("kanıtı tanede" dosyada hiç geçmiyor). Alternatif olan "hero'ya alt dolgu ekle" tasarımın `padding-bottom:0` kararını bozardı ve hero'yu kaydırırdı | uygulandı |
| `AnimasyonluSayac` ilk değer | Brief'in `useState(0)` yerine `useState(hedef)` | Tasarımda hedef zaten işaretlemede duruyor (`data-sayac="8"` içeriği `8`), JS yalnız görünürlükte üstüne yazıyor. `0`'dan başlamak statik export çıktısına, hydration öncesine ve "bölüme hiç inmeyen kullanıcı" durumuna `0` basardı; SEO çıktısı da `0` olurdu. Denetim bunu yapısal hata saymıştı | uygulandı |
| `Ocaktan` menü satırları, `cursor` | Tasarımın `cursor:pointer` değeri uygulanmadı, satır interaktif yapılmadı | Tasarım satıra imleç veriyor ama hiçbir hedef vermiyor: `data-git` yok, href yok, menü sayfasında bu satırın karşılığı da yok (orada ürünler tam genişlikte plaka). Hedefi olmayan `cursor:pointer` sahte tıklanabilirlik izlenimidir. Hover'ın zemin ve dolgu geri bildirimi korundu. Satırların bir hedefi olup olmayacağı sahibine soruldu | uygulandı, sahibine soruldu |
| `AltBilgi` Konum sayfasının "Sayfalar" listesi | Tasarımın iki bağlantısı (`Ana sayfa / Menü`, `Konum:174-175`) yerine üç: `Ana sayfa / Menü / Hikaye` | Kolonun kuralı Hikaye sayfasında açıkça görünüyor: dört içerik rotası eksi bulunulan sayfa (`Hikaye:142-144` = `Ana sayfa / Menü / Konum`). Konum'un listesi aynı kuralı uygulasa üç bağlantı olurdu; tasarım kardeş sayfayı (Hikaye) sessizce düşürmüş. Kolonun adı "Sayfalar", yani bir sayfa dizini; bir sayfayı atlayan dizin karar değil boşluktur. Hikaye zaten üst bardan erişilebilir olduğundan "oraya bilerek bağlanmıyoruz" okuması da düşüyor. Kural `lib/kabuk.ts` > `altBilgiSayfaLinkleri` içinde tek yerde, testle kilitli | uygulandı, sahibine bildirildi |
| `AltBilgi` mobil dip payı | 780px altında üç footer varyantı da `padding-bottom:116px` alır | 390x844'te ölçüldü: sabit `MobilAksiyonBari` y=767'den başlıyor (77px), telif şeridi ise 778-812 aralığında kalıyordu, yani telif metni ve Gizlilik bağlantısı **tümüyle** barın altında görünmezdi. Menü şeridinde aynı çakışma sayfanın tek kapanış CTA'sını (iki buton) gömerdi. Değer uydurulmadı, tasarımın kendi mobil footer'ından alındı: `Mobil Prototip.dc.html:181` ve `:371` `padding:30px 20px 116px`. Düzeltme sonrası ölçüm: telif şeridi 694-728, barın 39px üstünde | uygulandı |
| `AltBilgi` Gizlilik sayfasının telif şeridi | Gizlilik rotasında telif şeridindeki "Gizlilik" bağlantısı basılmaz | Bulunulan sayfaya giden bağlantı ölü hedeftir; tasarımın kendi "Sayfalar" kolonu da aynı kuralı uyguluyor (bulunulan sayfa listede yok). Diğer dört rotada bağlantı yerinde duruyor | uygulandı |
| Konum `IletisimSatiri` etkileşimi | Tasarımın üç `cursor:pointer` kutusu yerine: hedefi olan satır gerçek `<a>` (hover kenarlığı ve zemini dahil), hedefi olmayan satır düz `<div>`, imleçsiz ve hover'sız | `isletme.telefon`, `whatsapp`, `instagram` bugün üçü de `null`; tasarım üçüne de imleç veriyor ama hiçbirine hedef vermiyor. `Ocaktan` menü satırlarında verilen kararla aynı: hedefi olmayan `cursor:pointer` sahte tıklanabilirliktir. `Buton`'un `.pasif` sönükleştirmesi burada uygulanmadı, çünkü satır devre dışı bir kontrol değil, henüz bağlantısı olmayan bir bilgi ve metni okunmalı. Veri geldiğinde satır `<a>` olur, ölçüler değişmez | uygulandı |
| Konum H1'inin İngilizcesi | Tasarımın `data-en="Location"` değeri yerine sözlükteki iki satır (`Naci Talat` / `Street, Kyrenia`) | `Konum:74` iki satırlık başlığa tek kelimelik bir `data-en` vermiş; uygulansaydı EN sayfasında H1 `Location` olurdu ve sayfanın adresi kaybolurdu. İçerik katmanı bunu zaten düzeltmiş (`content/en/konum.ts:5-6`), sözlük esas alındı. Tek dosyalık kopyala-yapıştır kayması gibi duruyor | uygulandı, sahibine bildirildi |
| `SaatTablosu` varyantları | Tek tablo yerine `varyant?: 'ana' \| 'konum'`; varsayılan `'ana'`, ana sayfanın çağrı yeri değişmedi | İki tablo on beş değerin on birinde aynı (üç satırlık yapı, kenarlık alfaları, `--tangerine-07` zemin, ağırlıklar, 16px ölçü, notun alt çizgisizliği, gün adının gece vardiyasına göre kayan hesabı); ayrışan dördü satır dolgusu (15/12 vs 16/14), not dolgusu, not satır ölçüsü (1.6 vs 1.65) ve not rengi/tabular. Azınlık farkı ikinci bir kopyayı haklı çıkarmıyor; gün adı hesabı kopyalansa sessizce ayrışırdı | uygulandı |
| `HaritaPlakasi` `children` prop'u | Silindi | Prop yalnız Konum'un POI çipleri için eklenmişti; Konum ölçüp kendi levhasını yazdı (on iki değerin onu ayrışıyor, işaret etiketi ayrıca yapı olarak farklı), dolayısıyla prop ölü kaldı. Ana sayfa tarayıcıda yeniden ölçüldü, levha değişmedi | uygulandı |
| `KorSahnesi` iç sayfa varyantı (`4f8b085`) | Tek sahne yerine `varyant: 'ana' \| 'ic'`; iç sayfalarda kor `.55`, çekirdek `.26` (ana sayfada `.78` / `.42`) | İç sayfalarda yoğunluk takibi kapalı olduğu için sahne sürekli tam şiddette yanıyordu ve panel altındaki okuma bandını zorluyordu. Sönük varyant tasarımın iç sayfa dosyalarındaki daha sakin sahnesiyle de uyumlu | uygulandı |
| `Buton` ikonlu dolgu adımı | İkon içeren buton yatay dolgudan 3px veriyor, dikeyi koruyor (`.taban:has(svg)`) | Tasarımda tam iki ikonlu buton var ve ikisi de kuralı izliyor: `Ana:347` ikonsuz `17/29`, yanındaki `Ana:346` ikonlu `17/26`; `Konum:81` ikonlu `18/28`, o ölçekteki ikonsuz hayaletin türetilmiş değeri `18/31` (dolu `19/32` eksi 1/1, beş dosyada beş kez doğrulanan çerçeveli adımı). Beş dosyadaki 20 butonun tamamı çıkarıldı, istisna yok. Etkilenen iki çağrı yeri: paket şeridinin WhatsApp butonu ve Konum hero'sunun hayalet butonu | uygulandı |
| `Buton` `border-radius: 2px` | Kaldırıldı (0) | Beş tasarım dosyasındaki 20 butonun hiçbiri `border-radius` bildirmiyor. `Cip`'in 2px'i tam bu kanıt standardıyla kaldırılmıştı (bu tablonun 21 ve 32. satırları), aynı standart | uygulandı |
| `Buton` `letter-spacing: -0.005em` | Kaldırıldı | Handoff'ta hiçbir Inter buton dizisi `letter-spacing` taşımıyor; uydurulmuş değerdi | uygulandı |
| `GizlilikSayfasi` gövde ve spot rengi | Task 14'ün `--krem-86` sapması geri alındı, tasarımın `--krem-78`'ine dönüldü | Task 14'ün ölçümü doğruydu ama parlak sahneye karşı alınmıştı; `4f8b085` iç sayfalara sönük sahneyi verdi. Yeniden ölçüldü (metin saydam, yalnız o kutunun viewport yakalaması, satır satır en parlak zemin): `.78` en kötü durumda 6.97:1 (390px) ve 8.51:1 (1440px), AA tabanı rahat geçiliyor. Koddaki bayat gerekçe bloğu da silindi | uygulandı |
| `HataSayfasi` kicker | Yerel kopya yerine `EtiketSatiri` primitifi (`sayfa` ölçeği); modülde yalnız `tabular-nums` kaldı | 404 sayfası (`843524e`) primitiften (`d94570f`) önce geldi, o tur yalnız ana sayfanın kopyasını ortaklaştırdı. Değerler birebir aynıydı (11x11 tangerine kare, `500 15px/1`, krem `.74`, gap 12px); bağlandıktan sonra tarayıcıda ölçüldü, görünüm değişmedi | uygulandı |
| İki footer'ın adres satırı | `isletme.cadde` / `isletme.binaNo` yerine `ortak.satirlar.adresCadde` / `adresBina` | Beş İngilizce rotanın hepsinde footer Türkçe "Naci Talat Caddesi" basıyordu; `/en/hikaye/` sayfasında caddenin adı yalnız Türkçe biçimiyle geçiyordu. `isletme.cadde` dil-nötr yapısal veri olarak kalır (harita bağlantısı ve JSON-LD onu kullanır), görünen metin sözlükten gelir. `binaNo` null kontrolü korundu | uygulandı |
| İç sayfa çapa payı, gece şeridi açıkken | Sabit 96px yerine şerit görünürken 125px (`body:has([data-gece-serit])`) | Gece şeridi 01:00-05:00 arası basılıyor ve iç sayfa barını 78px'ten 107px'e çıkarıyor; 96px'lik pay o beş saat boyunca `#ocaktan` başlığının üst 11px'ini örtüyordu. Tasarımın kendi kaydırma betiği de sabit 96 kullanıyor, yani şeridi hesaba katmamış: tasarım gözden kaçması | uygulandı |
| `UstBar` 780px altı saç çizgisi | Bara `border-bottom: 1px solid rgba(242,233,220,.09)` eklendi | `Mobil Prototip.dc.html:55` bunu veriyor; port yüksekliği ve dolguyu almış, kenarlığı atlamıştı. Değer ham yazıldı, `styles/tokens.css` paralel bir turun elindeydi | uygulandı |
| `Cekmece` durum noktasının nabzı | Tasarımda olmayan `dotPulse 2.4s` korundu | `Mobil Prototip.dc.html`'deki beş tangerine "açık" noktasının dördü nabız atıyor (`:52`, `:74`, `:242`, `:264`); yalnız çekmecedeki (`:209`) atmıyor. Aynı blokta noktanın kapalıyken de yanık kalması zaten tasarımın kendi davranış referansında tutarsızlık olarak işaretli. Tek istisnayı kopyalamak yerine kural izlendi | uygulandı |
| Sekiz ham `rgba()` token'a bağlandı | `DurumCipi.dev`, `UstBar` üç gradyan ucu, `Cekmece` satır kenarlığı, `MobilAksiyonBari` üst kenarlığı, `BeadRay` bağlayıcısı | Token turu (`ee19589`, 48. commit) bu modüllerden sonra geldi ve çağrı yerleri taşınmadı. Değerler değişmedi, yalnız `--panel-60` / `--panel-koyu` / `--panel-yari` / `--cizgi-kart` / `--cizgi` / `--cizgi-bolum` adlarına bağlandı; hesaplanmış stiller tarayıcıda doğrulandı | uygulandı |
| `Buton` gölge ve kenarlık boyası | Boy adımına bağlanmadı, çoğunluğa normalize edildi | Ön geçiş beş dosyadaki 20 butonu ölçtü; `lg` adımı hem gölgede (`0 12px 34px .4` x2 ve `0 10px 30px .34` x1) hem kenarlıkta (`.38` x2, `.36` x2) kendi içinde çelişiyor. Kalan sapmalar: `Ana:113` kenarlık `.4` ve hover zemini `.12`; `Hikaye:129` ve `Konum:81` kenarlık `.38`; `Ana:318` gölge `0 10px 30px .34`; `Menu:289` gölgesiz; `Menu:290` hover zeminsiz | uygulandı, sapmalar kayıtlı |
| 16px tabanı | Düz "gövde metni 16px'in altına inmez" kuralı yerine üç katman (`KISITLAR.md`) | Tasarım üç iç sayfada da kuralla çelişiyordu. 12 Ağustos 2026'da 3. katmanın bandı 14.5-15.5px'ten **13-15.5px**'e genişletildi ve üyeleri tek tek sayıldı: eski band ne gece menüsü notunu ne yapay zeka görsel notunu (ikisi de `13px/1.6` gerçek proze) kapsıyordu, üstelik kendi listesindeki 14px'lik Konum alt satırlarını da kapsamıyordu. Metinler büyütülmedi; eksik olan kuraldı | uygulandı |
| `EtiketSatiri` iki ölçek | Tek ölçek yerine `sayfa` (500 15px/1, krem .74) ve `kart` (500 14.5px/1, krem .72) | Tasarımdaki iki kullanım aynı cümleyi taşıyor ama ölçüleri ayrışıyor (`Hikaye:64-66` ve `Ana:272-274`); fark açıklanabilir (biri 104px'lik H1'in üstünde, diğeri cam kartın içinde 54px'lik H2'nin üstünde), o yüzden çoğunluğa normalize edilmedi | uygulandı |
| `KorSahnesi` kor titremesi (hareket turu) | Yoğunluk ile nefes arasına üçüncü bir katman: `korTitremesi` (13s/15s) ve `cekirdekTitremesi` (17s/19s), düzensiz duraklı, genlik en fazla %11 düşüş. **Tasarımda karşılığı yok, bu turun eklemesi** | Ölçüldü: `emberBreathAna` 8 saniyede birebir aynı değere dönüyor (t=0/8/16/24'te 0.620, sapma 0.000), çekirdek 11s'de aynı. İki kusursuz sinüs, düzensizlik sıfır; ateş değil kısılan bir lamba okunuyor. Titremeden sonra bileşik opaklık 8s'te tekrar etmiyor (fark 0.0149/0.0553/0.0309/0.0047/0.0336) ve her salınım tepesi farklı (0.960/0.933/0.947/0.966/0.924). Duraklar bilerek eşit aralıksız: eşit aralık ikinci bir sinüs, yani ikinci bir nabız üretirdi. Ayrı katman zorunlu, çünkü animasyon aynı elemanda inline `style`ı ezer (Y2'de kayıtlı tuzak) | uygulandı |
| `KorSahnesi` yoğunluk katsayısı | `Math.min(1, 0.3 + yogunluk * 0.7)` yerine `* 0.56` | `acilis` (yoğunluk 1) ve `gece` (yoğunluk 1.25) İKİSİ de 1.0'a kırpılıyordu: tasarımın "burası en parlak an" işareti sahnenin en gür katmanında hiç görünmüyordu. Çekirdek katmanı farkı taşıyordu (0.84/0.99) ama dış katman taşımıyordu. 0.56 tavanı 1.25'e bırakır: acilis 0.86, gece 1.00, merdivenin sırası değişmez. Bedeli açılışın %14 sönükleşmesi; sayı bir ayar düğmesi, 1.25'e yer bırakmak için 0.8'in altında kalmalı | uygulandı, sahibine bildirildi |
| `TaneDizilimi` `kor` prop'u (hareket turu) | Yeni opsiyonel prop: yalnız KÜÇÜK (tangerine) taneler `.62 - 1` aralığında nefes alır, büyük (krem) olanlar almaz. Yalnız hero rayında açık. **Tasarımda karşılığı yok, bu turun eklemesi** | On altı tane rayının tamamı hareketsizdi, oysa tane markanın merkezindeki fikir ve hero rayı "İddianın kanıtı tanede" satırının yanında duruyor. Ayrım anlamsal, süs değil: küçük tane tangerine, yani tanelerin ARASINDAKİ kor; büyük tane krem, yani etin kendisi. Ateş yanar, et yanmaz. Aralık kor sahnesinin kendi nefes aralığıyla aynı, periyot (9s) sahnenin 8s'inden ayrı ki kilitlenmesin; iki küçük tane `-4.5s` ile karşı fazda. On altı rayın hepsine verilmedi, gürültü olurdu | uygulandı |
| Gece şeridi, rota başına (tasarım kararları turu) | `UstBar` şeridi artık yalnız hikaye ve gizlilikte basıyor; bayrak `lib/kabuk.ts` > `geceSeridiGosterilirMi`, testi `kabuk.test.ts`. **Sahibinin kendi gözlemi:** "üstteki ince şerit anlaşılmıyor, zaten altta yazıyor" | Ölçüldü (Girne 03:30, şerit canlı): aynı olgu ana sayfada 3, menüde 3, konumda 4 kez söyleniyordu (şerit + hero durum çipi + canlı saat / saat tablosu); hikaye ve gizlilikte şerit tek kaynak. Ölçüt sayfa kimliği değil, o rotada başka canlı gösterge olup olmadığı. Şerit tümüyle kaldırılmadı, o iki rotada "gece açığız" bilgisinin tek taşıyıcısı | uygulandı |
| Çapa payının gece kuralı | `Kabuk.module.css`'teki `body:has([data-gece-serit]) .icSayfa [id] { scroll-margin-top: 125px }` silindi | Yukarıdaki maddenin yan etkisi, ölçülerek doğrulandı: şeridi basan iki rotanın `<main>`'inde tek bir çapa hedefi yok (`hikaye` 0, `gizlilik` 0), çapası olan iki rotada da (`menu` 3, `konum` 1) artık şerit yok. Kural hiçbir kutuya değmiyordu; menü ve konum ölçümde 96px'e döndü | uygulandı |
| Sayfanın tek sağ kenarı (tasarım kararları turu) | `--sayfa-yatay` `clamp(24px, 5vw, 64px)` yerine `max(clamp(24px, 5vw, 64px), (100vw - var(--panel-en)) / 2)`: 1308px'in üstünde pay oluğa dönüşür, içerik sütunu 1180px'te durur ve ortalanır | Tasarım her bloğu sol paya yaslıyor ve beş dosyada hiç `margin:auto` kullanmıyor, ama kareler 924px'te çekildiği için 1180/1100px'lik kapaklar orada hiç bağlamıyor. Geniş ekranda bağlıyorlardı: 1920px'te ana sayfanın dört ayrı sağ kenarı vardı (1244 / 1856 / 1164 / ortalı 1270) ve kapaklı bölümle tam genişlik bölüm arası fark 612px'ti. `.sayfaEni`'ye `margin-inline:auto` yetmezdi: o sınıfın yalnız iki çağıranı var (`ana/Ocaktan`, `hikaye/Usul`), sayfanın geri kalanı kapaksız. Payı büyütmek üst barı, yedi bölümü, paket şeridini ve alt bilgiyi aynı sütuna sokar. 390/1280'de hiçbir şey kıpırdamaz, ölçüldü | uygulandı |
| `MenuSatiri` hover kayması (tasarım kararları turu) | Hover'ın `padding-left: 12px -> 24px` kayması silindi, `--tangerine-07` zemini kaldı; geçiş listesinden `padding-left` düştü, mobildeki `padding-left: 0` sıfırlaması gereksizleşti. **Sahibinin kendi gözlemi** | Ana sayfanın beş ürün satırının tıklanacak hedefi yok. Tasarımın `cursor:pointer`'ı daha önce düşürülmüştü ama hover iki sinyal veriyordu ve kaldırılan zayıf olanıydı; 12px'lik kayma "tıkla" demenin daha yüksek sesli hali. Ölçüldü: değişiklikten önce 12 -> 24px, sonra sabit 12px, zemin yerinde | uygulandı |
| Paket şeridinin odak halkası | `PaketSeridi.module.css`'e kapsamlı `.serit :focus-visible { outline-color: var(--komur) }` | Site geneli halka tangerine (`styles/reset.css`); pumpkin `#E96112` üstünde 1.75:1, WCAG 1.4.11'in 3:1 eşiğinin altında. Kömür aynı zeminde 5.29:1 ve şeridin kendi metin rengi. Bugün tetiklenmiyor çünkü şeridin üç butonu telefon ve WhatsApp `null` olduğu için pasif `<span>`; ölü olan kural değil veri, yüzey ve odak stili bugün var | uygulandı |
| `UstBar` 780px altı `.sagGrup` boşluğu | Medya sorgusundaki `.sagGrup { gap: 14px }` varyant seçicileriyle aynı özgüllüğe çıkarıldı (`.anaVaryant .sagGrup, .icVaryant .sagGrup`) | Kural hiç uygulanmıyordu: `.anaVaryant .sagGrup { gap: 30px }` özgüllükte yeniyordu, 390px'te 30px (ana) ve 28px (iç) ölçüldü. `Mobil Prototip.dc.html:56` üst barın sağ grubuna `gap:14px` veriyor. Ölü kural silinmedi, tasarımın istediği değer olduğu için canlandırıldı; ölçüm sonrası iki varyantta da 14px | uygulandı |
| Konum harita levhası, üçüncü POI çipi | 780px altında `.poiMacroMarket` sağ kenara demirlendi (`left:auto; right:12px; top:74%`). Etiketler **silinmedi** | Çip `left:66%` + `nowrap` ile 342px'lik levhayı 17px aşıyor ve `overflow:hidden` kesiyordu; ölçüm sonrası 13px içeride ve levhanın altı metinli katmanı arasında çakışma yok. Etiketsiz mobil levha uygulanmadı: `Mobil Prototip.dc.html:169-174` ana sayfanın levhası (zemin `.55`, halka `left:46%/top:53%`, 40px ızgara), Konum'unki değil, ve o karşılık `HaritaPlakasi`'da zaten uygulanmış durumda. 390px'te aynı ekran taraması: cadde adı ve kapı numarası hero'da tekrar ediyor, üç POI çipi ve alt not hiçbir yerde geçmiyor | uygulandı, kalan karar sahibinde |

| `lib/kabuk.ts` nav listeleri, `galeri` | Ana, Hikaye, Konum ve Gizlilik barlarına `Galeri` öğesi eklendi, listelerin sonuna | Tasarımın çekmece listesi zaten `Menü/Hikaye/Konum/Galeri/Rezervasyon` yazıyordu; Galeri yalnız `RotaAnahtari` karşılığı olmadığı için düşmüştü (bu dosyanın `Cekmece` satırı). Rota kurulunca geri geldi, sıra da o listeden. Uydurulmuş bir yerleşim değil | uygulandı |
| `lib/kabuk.ts` menü barı, `galeri` | Menü barına eklenmedi; beş öğeli tasarım listesi korundu | Ölçüldü (781px, statik export): altıncı öğe bar satırını 731px'ten 803px'e çıkarıyor ve 781-802px bandında "Yol tarifi al" butonu ekranın dışına taşıyor. Nav 780px altında çekmeceye düşüyor, yani kırılan bant dar ama gerçek. Kırık bir CTA eksik bir nav öğesinden kötü. Sonucu: menü sayfasından galeriye üst bar üzerinden gidilmiyor, footer'ı da `serit` varyantı (sayfa bağlantısı taşımaz) | uygulandı, sahibine bildirilecek |
| `lib/kabuk.ts` `altBilgiSayfaLinkleri` | `FOOTER_SAYFA_SIRASI` beş rota oldu (`galeri` eklendi) | Kolonun kuralı "içerik rotaları eksi bulunulan sayfa"; galeri bir içerik rotası. Hikaye, Konum ve Galeri footer'larında görünür | uygulandı |
| `lib/kabuk.ts` `geceSeridiGosterilirMi` | `galeri` eklendi | Kuralın ölçütü sayfa kimliği değil, o rotada başka canlı gösterge olup olmadığı. Galeride hero durum çipi de canlı saat de yok, şerit tek kaynak | uygulandı |
| `GaleriSayfasi` ızgara ölçüsü | Menü ürün ızgarasının değerleri birebir: `repeat(auto-fit, minmax(280px,1fr))`, `gap: clamp(20px,2.4vw,34px)` (`Ocaktan.module.css:93-94`, Menu:120); plaka `FotoYuvasi` `kart` biçimi (Menu:126) | Sayfanın çizimi yok. Çekim listesinin `karo`su (110px) bir kontrol listesi ölçüsü, fotoğrafın okunacağı ölçü değil. Ölçülen sonuç: 1440px'te 3 kolon 371x270, 390px'te tek kolon 342x253 | uygulandı |
| Dokunma hedefleri, üç grup | `AltBilgi.sayfaLinki` görünmez `::before` yerine kendi kutusuyla 44px (14.5px satır + 2x14.75px dolgu, kolon gap'i 0); `UstBar.link` `min-width: 44px`; `AltBilgi.gizlilikLink` `inline-block` + `min-width: 44px` | Üçü de tasarımın görünen ritmini değiştirdiği için sahibine bırakılmıştı ve aylardır açıktı (`kabuk-turu-report.md:343-349`). "Tasarım tavan değil taban" kararı 12 Ağustos'ta engeli kaldırdı. Ölçüldü: **240 hedef tabanı geçiyor, kalan 28'in hepsi `aria-hidden` + `tabIndex={-1}` dekoratif boncuk**, yani her gerçek etkileşimli hedef 44px'i karşılıyor. Yalnız bağlantı kolonu büyüdü, diğer üç kolonun ritmi aynı kaldı; alt çizgi harflerin altında kaldığı için telif şeridi de görünür biçimde değişmedi. Kontrast yeniden ölçüldü, gerçek kalan 0 | uygulandı |
| `Acilis` hero sağ bandı | Tasarımda boş olan sağ yarıya tane alanı eklendi: 24px krem küpler 44px adımda, aralarında konumlu lekelerden gelen sıcak taneler. 1100px altında düşer | 1440px'te başlık genişliğin yarısında bitiyor ve sağ yarı ölü kalıyordu; tasarımda oraya fotoğraf da gelmiyor, yani boşluk kalıcıydı. Konan şey sayfanın kendi iddiası: "İddianın kanıtı tanede" bugüne kadar 12px'lik bir dipnottu. Ölçek ve rol kor yatağından bilerek ayrı (yatak küçük/sıcak/sık = ateş, alan iri/krem/seyrek = ürün), yoksa iki doku birbirini tekrar ederdi. Sıcaklık ızgaradan değil konumlu lekelerden geliyor: tek eksenli tekrar önce dikey şerit, sonra yatay çubuk üretti, ikisi de kare okunmuyordu. Ölçüldü: kontrast değişmedi, 390px'te `display:none` ve yatay taşma yok. Yeni renk yok | uygulandı |
| `KorSahnesi` kor yatağı | Tasarımın iki düz radial gradyanına (`Ana:29-30`) taneli bir kor yatağı katmanı eklendi: iki maskeli ızgara 4px ve 6px kareler açıyor, renk öbeklenmiş sıcak noktalardan geliyor | Sahibinin "kor pek anlaşılmıyor" gözlemi ölçüldü ve **parlaklık hipotezi çürüdü**: sahne zemini tepe noktada 95-107 RGB birimi kaldırıyor, sönük değil. Eksik olan taneydi; düz gradyan ekranda kor değil yumuşak bir ışık havuzu okuyordu. Kor tanelidir ve bu sitenin bütün işareti zaten tane (`TaneDizilimi`, wordmark, "tavla zarı kadar"), yani yön markanın kendi sözlüğünden geldi, uydurulmadı. Ölçüldü: kontrast değişmedi (doğrulanmış gerçek kalan 0, öncesiyle birebir), hareket azaltılmışta 13 rotada 0 koşan animasyon. Yeni renk yok. **Sahibi 12 Ağustos'ta tasarımın tavan değil taban olduğunu söyledi**, bu sapma o yönde ilk adım | uygulandı |
| `Cekmece` link listesi | Elle yazılmış üç link yerine `lib/kabuk.ts` > `cekmeceLinkleri()`; Galeri geldi, liste `Menü/Hikaye/Konum/Galeri` oldu | Tasarımın çekmecesi (`Mobil Prototip.dc.html:201-205`) beş satır yazıyor, Galeri dördüncü. Task 6'da Galeri rotası yoktu ve düşmüştü; rota 12 Ağu sabahı açıldı ama çekmecenin listesi elle yazılı olduğu için güncellenmedi. Sonuç ölçüldü: 780px altında masaüstü nav çekmeceye düşüyor, yani Galeri'ye üst gezinmeden hiç girilemiyordu, yalnız alt bilgi kolonundan. Liste artık rota tablosundan türüyor, ikinci kez ayrışamaz (`kabuk.test.ts`) | uygulandı |
| `CanliSaat` `colonBlink` dip değeri | Tasarımın `opacity:.25`'i yerine `.5` | Ölçüldü (kontrol turu, 12 Ağu): `.25` fazında iki nokta 1.62:1, büyük metin eşiği 3.0; dip her 2 saniyenin 0.9'unda sürüyor, yani anlık değil. `.5` aynı zeminde 3.23:1 ve yanıp sönme görünür kalıyor. Tasarımdan birebir gelen bir değer (`Ana:22`), ama WCAG AA bağlayıcı kısıt. Sahibi onayladı 12 Ağu 2026. Not: `prefers-reduced-motion: reduce` animasyonu zaten iptal ediyor, orada kolon 10.25:1 | uygulandı |
| `AltBilgi.telifMetin` rengi | `--krem-50` yerine `--krem-58` (`.gizlilikLink` rengi buradan miras alır) | Ölçüldü: 390px'te kor sahnesinin radial parıltısı telif şeridinin altına toplanıyor ve zemini `[42,23,11]`'e açıyor; `--krem-50` orada 4.48-4.50 veriyor, eşik 4.5. Task 15 bunu 3.33-4.44 ölçmüştü, hareket turunun gece yoğunluğu düşürmesi iyileştirmiş ama tam kapatmamış. `--krem-58` en kötü fazda 4.81, düz zeminde 5.89. Sahibi onayladı 12 Ağu 2026 | uygulandı |
| `UstBar` `anaVaryant` zemini | Tasarımın `.9`'dan `0`'a inen perdesine `backdrop-filter: blur(10px)` eklendi, ayrı bir `::before` katmanında ve perdeyle aynı yöne inen `mask-image` ile | Ölçüldü: perde marka adının hizasında yarı saydam kalıyor, altından geçen içerik adın içinden okunuyor (`scrollY 6351`'de Konum bölümünün "Soli Bet Casino, yanımızda" çipiyle çakıştığı görüntülendi). Bunun karar değil eksik iş olduğunun iki kanıtı var: tasarım barda `transition: background .3s ease-out` tanımlıyor ama `support.js`'te bu zemini değiştiren tek satır yok, ve 780px altında sorunu kendi çözüyor (`.94` üstten `--panel-60` alta + `blur(10px)`). Mobilde çözülen şey masaüstünde açık kalmış; aynı çözüm taşındı, yeni değer uydurulmadı. Ayrı katman şart: `mask` barın kendisine binerse nav metnini de soldurur. Sahibi onayladı 12 Ağu 2026 | uygulandı |
| Ana sayfa bölümlerinin `min-height: 100vh`'i | Altı içerik bölümünden (`iddia`, `ocaktan`, `ikram`, `gece`, `bozo`, `konum`) kaldırıldı; ritmi yalnız `--bolum-dikey` (120px) taşıyor. Hero'da (`acilis`) kaldı | Tasarımın yedi bölümü de `min-height:100vh` yazıyor (`Ana:86,128,169,219,244,269,296`). Ölçüldü: 1440x980'de doluluk %43 ile %69 arasında, Gece bölümü 425px içerik için 980px yer tutuyor. Asıl kusur boşluğun kendisi değil düzensizliği: ardışık bölüm içerikleri arası mesafe 240, 243, 334, 375, 286px, yani ritim değil içerik yüksekliğinin artığı ve ekran uzadıkça fark büyüyor. Kaldırıldıktan sonra beş aralığın beşi de tam 240px, belge 7441px'ten 6175px'e indi. Hero'da kalmasının sebebi ayrı: orası en dolu bölüm (%69), kor sahnesi ona göre boyutlanıyor ve bir poster ekranın ortasında bitmemeli. Sahibi onayladı 12 Ağu 2026 | uygulandı |
| `MenuSatiri.ad` genişliği | `clamp(160px, 20vw, 260px)` yerine `clamp(160px, 22vw, 300px)` | Tasarımın değeri (`Ana:178`) 1440px'te 260px'e sabitleniyor ve "Terbiyesiz tavuk şiş" oraya sığmayıp iki satıra iniyor; satır 79px'ten 113px'e çıkıp listenin alt ucunu bozuyordu. Aynı satırda açıklama sütunu 551px genişliğinde ama en uzun açıklaması yaklaşık 250px kaplıyor, yani sarmayı zorlayan sınırın hemen sağında 300px kullanılmayan yer vardı. Yeni değerle beş satır da 79px. Alt sınır ve `flex: none` tasarımdaki gibi kaldı; 22vw her genişlikte 20vw'den geniş olduğu için dar ekranlarda sarma yalnız azalabilir. `MenuSatiri`'nin tek çağıranı ana sayfa (`Ocaktan.tsx`), menü sayfası ürün kartı kullanıyor, yani sayfalar arası etki yok. Sahibi onayladı 12 Ağu 2026 | uygulandı |
| `HataSayfasi` wordmark | Başlığın üstüne tane dizilimi + "Ciğerci Bozo" eklendi, ana sayfaya bağlantılı | Ölçüldü: sayfada `header`, `footer` ve `nav` yoktu ve "Ciğerci Bozo" dizesi yalnız Next'in RSC yükündeki bir `<script>`te geçiyordu, görünür hiçbir yerde değildi. Bozuk bir dış bağlantıdan gelen misafir "burası hangi site" sorusunu cevaplayamıyordu; iki buton çıkış yolu veriyor ama kimlik vermiyor. Tasarımda 404 çizimi yok (handoff beş dosya), yani kabuksuzluk tasarım kararı değil bizim kararımızdı ve dosyanın kendi gerekçesi (Kabuk zorunlu `RotaAnahtari` ister, ikinci kopya bakımı böler) tam kabuğa ait, marka işaretine değil. Yeni ölçü yok: tane 8/5/4, gap 13px, 800 21px, iz -0.03em, hepsi `UstBar.module.css`'in `.marka` çiftiyle birebir; alttaki boşluk `.blok`un kendi 28px gap'i; görünmez `::before` bardaki teknikle aynı, dokunma hedefi 44px. Sahibi onayladı 12 Ağu 2026 | uygulandı |
| 404'ün dili | `HataSayfasi` istemci bileşeni oldu ve `location.pathname` `/en/` altındaysa metni, `<html lang>`'i ve `document.title`'ı İngilizceye çeviriyor. Karar `lib/site.ts` > `yoldanDil()`'de, sekiz birim testiyle | Sunucu tarafındaki sınırlama gerçekti (statik export tek `out/404.html` üretir, dosya sunucusu istek yolunu sayfaya geçirmez) ama dosyanın "sınırlama, tercih değil" kaydı istemci için yanlıştı: `location.pathname` `/en/` önekini görüyor ve `content/en/hata.ts` zaten yazılmış, hiç render edilmiyordu. Anahtar `useEffect` içinde, render sırasında değil: ilk istemci render'ı sunucununkiyle aynı olmak zorunda, yoksa hidrasyon uyuşmaz. Karşılaştırma dize öneki değil yol parçası, çünkü 404 tam da uydurma yolları görür ve `/enfes-ciger/` İngilizce değildir. Doğrulandı: dev ve statik export üstünde üç dal da (`/en/yok/` > en, `/yok/` > tr, `/enfes-ciger-nerede/` > tr), hidrasyon uyarısı yok. Sahibi onayladı 12 Ağu 2026 | uygulandı |
| Metin büyük harf düzeni | Ürün adları, bölüm/menü etiketleri ve CTA/nav etiketleri başlık düzenine geçti (`Terbiyesiz Tavuk Şiş`, `Gece Menüsü`, `Yol Tarifi Al`, `See the Menu`). Sayfa başlıkları ve gövde metni cümle düzeninde kaldı | Sahibinin kararı 12 Ağustos 2026. `CLAUDE.md`'nin "Headings use sentence case" kuralıyla çelişiyordu; kural aynı commit'te güncellendi, yoksa sonraki oturum geri alırdı. Kapsam sahibe üç seçenekle soruldu ve dar olan seçildi: "Girne uyurken ocak yanıyor" bir etiket değil cümle, dokunulmadı. İngilizce tarafta İngilizce başlık düzeni uygulandı, kısa edat ve artikeller küçük kaldı (`On the House`). Ekran okuyucuya özel etiketler dışarıda | uygulandı |
| `content/isletme.ts` telefon ve WhatsApp | `+90 533 888 74 24`, ikisi de aynı hat | Sahibi 12 Ağustos 2026'da verdi. Depolanan biçim uluslararası: `wa.me` baştaki sıfırı kabul etmez. İki test bunu "hâlâ null" diye kilitliyordu, gerçek veriye göre güncellendi. Kayıtlı B4 maddesi bu turda kapandı: yer tutucuların 2.62:1 ve 3.14:1'i etkin bağlantıya geçince geçerliliğini yitirdi, aktif hallerin ölçümü 16.62:1 (koyu zemin), 8.27:1 (alt bilgi, alfa hesaba katılarak) ve 5.29:1 (pumpkin şerit) | uygulandı |
| Kısa adres | `adresKisa` ve `adresVeSaat` kapı numarasını taşıyor: `Girne, Naci Talat Caddesi No:4` | Sahibinin kararı 12 Ağustos 2026: "No:4 olmadan olmasın". Hero ve mobil alt bilgi şeridi bu iki anahtarı okuyor; `adresTamSatir` zaten numarayı taşıyordu | uygulandı |
| Paket şeridinin sipariş butonu | Buton kalktı, yerine `Paket servis` etiketi ve `yakında` rozeti geldi. `Cip`'e `yakinda` varyantı eklendi | Sahibi 12 Ağustos 2026: paket servis şu an yok, olmayan bir hizmet tıklanabilir olmamalı. Şeridin WhatsApp ve telefon butonları çalışmaya devam ediyor. Rozet pumpkin üstünde kömür: 5.29:1, tangerine orada 1.75:1 kalırdı. Kenarlık `--komur-55` ile 2.62:1, `.outline` çipiyle aynı kalıp; rozet etkileşimli değil ve kenarlık tek bilgi taşıyıcı değil | uygulandı |
| Saat tablosunun gün satırı | Gün adının yanında saat aralığı yerine canlı durum yazıyor (`Şu an açığız` / `Şu an kapalıyız`) | Sahibi sordu: "Çarşamba neden ayrı yazılıyor, anlamadık". Gözlem doğru: yedi günün saati aynı olduğu için vurgulanan gün satırı alt satırı birebir tekrar ediyordu ve tabloda tek bilgi iki kez yazılıydı. Tasarımın "bugünü vurgula" kalıbı korundu, satıra tablodaki tek canlı bilgi verildi. `kapaliKisa` yeni metin değil, onaylı `kapali` cümlesinin ilk cümleciği. Mount öncesi aralığa düşer, yani sunucu çıktısı hiçbir zaman yanlış olmaz ve hidrasyon uyuşur. Gece vardiya mantığı korundu: 02:00 Çarşamba'da satır "Salı" der | uygulandı |
| Alt bilgi iletişim satırlarının dokunma hedefi | `::before` 28px'ten 44px'e, satırlara `margin-block: 8px` | Telefon gelince iki satır pasif `<span>`'den etkin `<a>`'ya döndü ve 44px tabanı bağlayıcı hale geldi. 28px yer tutucu döneminin ölçüsüydü ve satır aralığıyla (15px + 13px gap) tam örtüşüyordu. Yalnız `::before`'u büyütmek komşu satırın hedefiyle 16px çakışırdı; kayıtlı kural çakışan hedefi kısa hedeften kötü sayıyor. Margin aralığı 13px'ten 29px'e çıkarıyor, pitch tam 44px, hedefler bitişik ama örtüşmüyor. Ölçüldü. Not: 28px WCAG 2.5.8'in 24px eşiğini zaten geçiyordu, bağlayan kısıt projenin kendi 44px kuralı | uygulandı |
| Mobil eşiği | On yedi media query'de `780px` > `800px`, bir tersi `781px` > `801px` | Masaüstü üst barı 780px'te kendi içeriğine sığmıyordu: `/menu/`'de 781px'te en sağdaki CTA 11px kırpılıyor, 795px'te sığıyordu (ölçüldü). Barın içsel genişliği rotaya göre 729-852px, yani 780px tasarımın istediğinin altındaydı. **Eşik tek başına `UstBar`'da taşınamaz:** nav gizlenmesi ile hamburger görünmesi aynı media bloğunda, yalnız barı taşımak 781-800 arasında ikisini birden gizler ve gezinmeyi tamamen düşürürdü. On yedisi birlikte taşındı. `KorSahnesi.module.css:92`'deki `min(780px, 110%)` bir genişlik, eşik değil, dokunulmadı. Not: CSS değişkenleri media query'de kullanılamadığı için eşiğin token'ı yok, sabit olarak dağınık duruyor | uygulandı |
| `content/isletme.ts` instagram | `cigercibozo` | Sahibi 12 Ağustos 2026'da verdi. Kayıtlı B3 maddesi (kullanıcı adı mı tam URL mü) bununla kapandı: kullanıcı adı saklanıyor, `AltBilgi` `https://instagram.com/` önekini kendisi kuruyor ve JSON-LD `sameAs`'e tam URL yazıyor. Test biçimi kilitliyor. **Hesap henüz açılmadı**, yayından önce açılmalı yoksa bağlantı ölü gider; `YAYIN-KONTROL-LISTESI.md`'ye madde olarak girdi. Bu değişiklikle alt bilgide pasif yer tutucu kalmadı, üç kanal da canlı | uygulandı |
| Alt bilgi `isimNotu` | `Bozo bir marka ismi değil, bir insandır.` yerine `Bozo, Urfalı Engin Çağlar'ın yıllardır taşıdığı lakap.` | Sahibi 12 Ağustos 2026: "footer'da bir garip duruyor". Gözlem doğru ve sebebi asimetri: İngilizce satır ("Bozo is the lifelong nickname of our founder, Engin Çağlar from Urfa") okuyucuya bilmediği bir şey söylüyor, Türkçesi ise aynı sayfanın bölüm başlığını (`ana.bozo.baslik`) birebir tekrar ediyordu. Ana sayfada misafir aynı cümleyi iki kez okuyordu: bir kez koca başlık ve altında açıklayan paragraf, bir kez de 3000px aşağıda gerekçesiz küçük gri satır. Yeni satır İngilizcenin işini yapar: iddiayı değil kişiyi söyler. İngilizce tarafa dokunulmadı, orada zaten çalışıyordu | uygulandı |

## Öneri, karar bekliyor

| Nerede | Öneri | Gerekçe | Durum |
|---|---|---|---|
| `Cip` ortak boyut/tipografi (`padding:6px 12px; font-size:12.5px; font-weight:600`) | Sayfa montaj görevlerinde (Task 5+) her kullanım yerine özel `className`/stil geçirme ihtiyacı olabilir | Brief bu değerleri üç tür için "ortak" diye veriyor, ama gerçek kullanım yerlerinin her biri birbirinden çok farklı: ikramCipi 700 17px Bricolage, vardiyaCipi/komsulukCipi 500 13-13.5px, kategori-outline 600 11.5px, ölçü cipı 500 14px. Tek genel bileşen arayüzü (`tur` dışında prop yok) bu beşini birebir karşılayamaz; brief'in "ortak" satırı muhtemelen kesin değerler yerine kaba bir taslak | kullanıcıya soruldu, kısmen çözüldü: outline ve dolu artık kendi gerçek değerlerini taşıyor (yukarı bakın); vardiyaCipi/komsulukCipi/ikramCipi teaser kartı Cip'in kapsamı dışında kalan ayrı yapılar |
| `content/isletme.ts` `instagram` alanı formatı | `AltBilgi` şu an `https://instagram.com/${isletme.instagram}` şeklinde kullanıcı adı varsayıyor | Alan hâlâ `null`; format (kullanıcı adı mı, tam URL mü) doğrulandığında bu varsayım gözden geçirilmeli | karara bağlı değil, gerçek veri geldiğinde doğrulanmalı |
| `FotoYuvasi`, fotoğraf gelince düşen katmanlar | `dosya` dolduğunda plaka `.kor` (kor lekesi), `.vinyet` ve köşe işaretlerini basmayı bırakıyor; kalan yalnız çerçeve, iç gölge ve görselin kendisi | Etiketin düşmesi doğru: o bir fotoğrafçı yönergesi, misafire gösterilecek başlık değil, ve `alt` olarak ağaçta kalıyor. Köşe işareti ile vinyet ise marka aygıtı ve sessizce kayboluyorlar. Handoff bunu çözemez, çünkü onun on altı plakasının hepsi boş; karar ancak fotoğraf gelince görünür hale gelecek. Kontrol turunda yol geçici bir görselle koşturuldu (aşağıda), yani bugün bir hata değil, **fotoğraflar gelir gelmez verilecek bir karar** | sahibine, fotoğraflar geldiğinde |
| `Gizlilik` (`/gizlilik/`) rotasına site içi bağlantı | Tasarımın hiçbir dosyasında (footer, çekmece, nav) Gizlilik'e bağlantı yok, sözlükte de hazır bir nav/footer etiketi yok | Rota `RotaAnahtari`'de var ama şu an kabuk bileşenlerinin hiçbirinden ulaşılamıyor. Yeni metin/yerleşim uydurmak yerine owner'a soruldu | **karar verildi 13 Ağustos 2026: backlog.** Sayfa erişilebilir bir bağlantı olmadan duruyor ve öyle kalıyor; site bugün veri toplamadığı için bir zorunluluk doğurmuyor. Analytics, form veya rezervasyon eklendiği gün bağlantı da yasal metinlerle birlikte geri gelir (`KARAR-FORMU.md` C4) |
| `Buton` `ikincil` kenarlık ve hover zemini | Şu an `--cizgi-buton` (.36) ve `--tangerine-10` (.1); hero'nun `xl` butonu tasarımda `rgba(242,233,220,.4)` ve hover `rgba(250,170,31,.12)` istiyor | Sayım: `.4` kenarlık tasarımda tek bir yerde, tam da hero'nun `xl` butonunda (Ana:113); `.36` üç yerde ve hepsi daha küçük boylarda (Ana:319-320 `lg`, Menu:290 `md`). Hover'da da aynı bölünme: `.12` yalnız `xl`'de, `.1` diğer dördünde. Yani fark boya bağlı olabilir (büyük butona bir tık güçlü kenarlık) ya da tek dosyalık bir kayma olabilir; ayırt edecek kanıt yok. Task 17 çoğunluğa normalize etmiş ama bu karar hiçbir yere yazılmamış. Ana sayfa görevinde tek başına değiştirilmedi: `Buton` üç sayfa tarafından kullanılıyor ve `.36` onların gerçek değeri | Task 16'ya veya sahibine, fark 0.04 alfa |
| `MenuSatiri` ve `CanliSaat` `letter-spacing:-0.015em` | Değer iki bileşende de ham yazılı (`MenuSatiri.module.css`, `CanliSaat.module.css:14`), token'ı yok | Tasarımda 9 kullanım, iki dosya, üç ayrı rol (hero saati Ana:93, menü satırı adları Ana:178-210, Hikaye:100-114). "Birden çok yerde geçen değer token olur" kuralına göre token hak ediyor; Task 9'da eklenmedi çünkü `CanliSaat`'i de taşımadan eklemek aynı değerin ikinci kopyasını yaratırdı ve `CanliSaat` bu görevin dosya listesinde yok | token birleştirme turuna |
| `Buton` `birincil` `md` gölgesi, menü şeridinde | Tasarımın menü şeridi butonunda (`Menu:289`) `box-shadow` **yok**; `Buton.module.css:31` her `birincil`'e `--kor-golge` basıyor, `sm`'ye küçük varyantı. Ölçüldü: şeritte `rgba(183,53,28,.4) 0 12px 34px` görünüyor | Ayrım boya değil bağlama bağlı görünüyor: aynı `md` dolgusu (17/28) tasarımda yalnız burada geçiyor ve orada gölgesiz. `Buton` bu turda dokunulmaz dosyaydı (ön geçiş görevi tutuyor), sessizce sayfaya özel bir override yazılmadı | `Buton` sahibine: `birincil` gölgesi boy başına mı, kullanım başına mı |
| `Buton` `ikincil` hover zemini, menü şeridinde | Tasarım (`Menu:290`) hover'da yalnız `border-color`u `rgba(250,170,31,.85)` yapıyor, zemin değişmiyor; `Buton.module.css:43` ayrıca `--tangerine-10` zemin basıyor | Aynı gerekçe, aynı dosya kısıtı. Kenarlık ve dolgu değerleri birebir tuttu, fark yalnız hover zemininde | `Buton` sahibine, yukarıdaki maddeyle birlikte |
| `rgba(242,233,220,.09)` token'ı | Telif şeridinin üst çizgisi üç footer'da (`Ana:381`, `Hikaye:157`, `Konum:188`) ve mobil üst barın alt saç çizgisi (`Mobil:55`), yani beş tasarım dosyasında dört kullanım; `styles/tokens.css`'te karşılığı yok, `--cizgi-hayalet` `.08` ve `--cizgi-soluk` `.1` komşuları | `KISITLAR.md` "token yoksa ekle, yuvarlama" diyor. `tokens.css` hem token turunda hem toparlama turunda dokunulmaz dosyaydı; değer `AltBilgi.module.css` ve `UstBar.module.css`'te ham duruyor | mobil turuna (tokens.css orada) |
| `--kor-golge` ailesinin mobil geometrisi | Mobil eylem barının birincil butonu `0 8px 22px rgba(183,53,28,.4)` (`Mobil:190`); `--kor-golge` (`0 12px 34px`) ve `--kor-golge-kucuk` (`0 8px 26px`) ikisi de tutmuyor | Aynı alfayı taşıyan `--kor-kenar` / `--kor-leke-hover` token'ları var ama rolleri kenarlık ve leke; `tokens.css`'in kendi yorumu bu rol ayrımını açıkça koruyor. Değer `MobilAksiyonBari.module.css`'te ham ve yorumlu kaldı | mobil turuna |
| Marka kelimesinin izi, footer'lar arası | `Menu:285` `-.04em`, `Ana:357` / `Hikaye:137` / `Konum:169` `-.03em`. Aynı `800 20px` kelime, iki iz | İkisi de birebir uygulandı (`--iz-sayfa-baslik` ve ham `-0.03em`). Ayırt edecek bir gerekçe yok; çoğunluk `-.03em` (üçe bir). Tek değere indirilecekse karar sahibinin | sahibine, fark 0.01em |
| Menü sayfasının üst bar CTA'sı | Tasarımda hedefsiz bir `<div>` (`Menu:58`: `data-git` yok, `href` yok); portta harici yol tarifi aramasına bağlandı | Ana sayfanın CTA'sı da tam olarak aynı şekilde hedefsiz (`Ana:61`) ve Task 6 onu harici aramaya bağlamıştı; menüde aynı çözüm uygulandı. Alternatif okuma: Hikaye'deki gibi Konum sayfasına bağlanmalıydı (`Hikaye:56`). Kanıt ikisini de destekliyor, işaretleme Ana Sayfa'nınkiyle birebir aynı olduğu için o okuma seçildi | sahibine, iki rota da savunulabilir |
| Mobil footer, tasarımdaki kısa hali | `Mobil Prototip.dc.html:181,371` mobil footer'ı iki satır: marka kelimesi + `Urfa usulü ciğer, meşe korunda. Girne, Naci Talat Caddesi. Her gün 10:00 - 05:00.` Portta 780px altında dört kolon sarılarak akıyor | Mobil prototip yalnız ana sayfanın tek ekranını taşıyor; bu kısa footer'ın üç varyantın hangisinin mobil karşılığı olduğu belli değil ve cümlenin tam hali sözlükte tek parça olarak yok (üç ayrı anahtarın birleşimi). Kapsam dışı bırakıldı, uydurulmadı | sahibine: mobilde dört kolon mu, kısa iki satır mı |
| Konum harita levhasının dar ekran hali | Kırpılma giderildi (yukarı bakın), ama etiketlerin dar ekranda kalıp kalmayacağı hâlâ açık | Ölçüldü: 390px'te levha 342px, çip `left:66%` + `white-space:nowrap` + 133px. Diğer bütün katmanlar sığıyor. Tasarımın mobil cevabı bir ölçü ayarı değil yapı değişikliği: `Mobil Prototip.dc.html:169-174` levhayı **etiketsiz** çiziyor (cadde adı, pin etiketi, POI çipi ve alt not yok; 180px yükseklik, 40px ızgara, 60px halka, 14px pin, `.55` zemin). O levha mobil prototipin ana sayfasının, Konum sayfasının değil; üçüncü bir levha uydurulmadı. 12 Ağustos 2026'da bilgi taraması eklendi: cadde adı ve kapı numarası aynı ekranda hero'da tekrar ediyor, üç POI çipi ve alt not hiçbir yerde geçmiyor, yani etiketleri gizlemek bugün bilgi siler | sahibine: dar ekranda üç POI çipi ve alt not kalsın mı, yoksa sade levhaya mı düşülsün |
| `Buton` `lg` adımı, Konum hero'su | Tasarım birincil `19px 32px`, hayalet `18px 28px`; uygulanan `lg` = `18px 30px` ve ikonlu `cerceveli.lg` = `17px 26px`. **Sapma olarak kaydedildi, yeni boy adımı eklenmedi** | Beş dosyadaki 20 butonun tamamı çıkarıldı: `19/32` ve `18/28` ikisi de **tek örnek**. Punto aileleri 16.5px (`20/34`), 16px (`18/30`, dört kez), 15.5px (`17/28`) ve 14.5px (`13/24`, üç kez); Konum hero'su bu merdivende karşılığı olmayan ara bir ölçek. Tek örnek için beşinci bir `boy` adımı açmak üç sayfayı ilgilendiren bir API büyümesi, kaydetmek daha ucuz. Kalan sapma: birincilde -1/-2px, ikonlu hayalette -1/-2px (ikon adımı öncesinde -1/+1px idi) | sahibine: ara ölçek adımı istenir mi |

| Çağıranı olmayan iki sözlük anahtarı | `ortak.marka.kisa` ("Bozo"), `ortak.cta.whatsapptanYaz` ("WhatsApp'tan yaz") | 12 Ağustos 2026'da sözlüğün 197 yaprağı tek tek tarandı; beş anahtarın çağıranı yoktu, ikisi (`adresCadde`, `adresBina`) footer düzeltmesiyle bağlandı. Kalan ikisi ölü metin: `metin-envanteri.json`'dan geldi ve beş `.dc.html`'de hiç geçmiyor. "No dead code" kuralı silmeyi söylüyor, ama sözlük içeriği sahibin. (Üçüncü aday `ortak.satirlar.saatlerUzun` bu listeden çıkarıldı: 24 Ağustos 2026 SEO/AEO turunda `lib/llmsTxt.ts` gerçek çağıranı oldu.) | sahibine: silinsin mi, yoksa bir yere bağlansın mı |

| Menüdeki `CekimListesi` bölümü | Fotoğraflar geldiğinde bölüm ya silinsin ya da tek satırlık bir `/galeri/` bağlantısına insin | Bugün iki yüzey aynı yedi kareyi aynı etiketlerle basıyor: menüdeki bölüm (`karo`, 110px) ve galeri (`kart`). Kapsamları farklı (biri menünün beklediği yedi kare, öteki manifestin tamamı) ama boş durumda misafir aynı şeyi iki kez görüyor. Fotoğraflar gelince menüdeki bölümün işi biter: ürün kartları kendi karesini taşır. Bu görevde menü dosyalarına dokunulmadı | sahibine |
| Galeri sayfasının metni | H1 "Galeri", alt metin "Sitenin beklediği on altı kare", altta menüdeki onaylı yapay zeka notu | `metin-envanteri.json`'ın 31 hazır bloğunun hiçbiri fotoğrafla ilgili değil; proje bilgi dosyasında da yalnız fotoğrafçıya yazılmış çekim yönergesi var, sayfa metni yok. Spot paragrafı, kare başına açıklama ve "fotoğraflar geldiğinde" durumu **uydurulmadı** | sahibine: bu sayfaya bir spot cümlesi ister mi |
| Menü barının 781-802px bandı | Galeri eklenmeden de "Yol tarifi al" butonunun sağ kenarı 781px'te 11px taşıyor (ölçüldü: en sağdaki bağlantı 792px, görünür alan 781px) | Bu değişiklikten önce de vardı, bu görevin ürünü değil ve `UstBar` bu görevin dosyası değil. Nav 780px'te çekmeceye düştüğü için bant 22px genişliğinde | sahibine veya kabuk turuna |
| Konum hero'sunun sağ yarısı | 1440px'te H1 ve altındaki blok x=108-640 arasında duruyor, x=640-1090 arası tamamen boş (yaklaşık 450x400 piksel) | Tasarım burada tek sütunlu bir blok çiziyor (`Konum:63`) ve sağa hiçbir şey koymuyor, yani tek başına sapma değildi. Kusur hale getiren kendi düzeltmemiz: ana sayfanın hero'sunda birebir aynı boşluk vardı ve 12 Ağu 13:39'da tane alanıyla dolduruldu (`01d42ee`). Şimdi iki hero aynı kalıbı paylaşıyor, biri dolu biri boş. Üç yol var: ana sayfadaki gibi doldurmak (ama oraya konan şey sayfanın iddiasıydı, konumun iddiasının ne olduğu ayrıca kararlaştırılmalı), harita levhasını yukarı hero'nun sağına almak, ya da bırakmak. **12 Ağu 2026'da ertelendi:** harita levhası hâlâ "canlı harita entegrasyonla gelir" yazan bir yer tutucu; yer tutucunun etrafında yerleşim kararı vermek erken | sahibine, gerçek harita geldiğinde |
| Galeri ızgarasında öksüz kare | 16 kare `repeat(auto-fit, minmax(280px,1fr))` ile 1180px kapsayıcıda 3 sütun veriyor: beş tam satır artı tek başına kalan 16. kare, son satırın üçte ikisi boş | Bu sayfanın tasarımı yok; ızgara menü ürün ızgarasından kopyalandı, yani öksüz tasarımdan değil bizden geliyor ve 16 dörde tam bölünüyor. Ölçüldü: `minmax(260px,1fr)` aynı kapsayıcıda 4 sütun veriyor ((1180 - 3x34) / 4 = 269px) ve öksüz kalmıyor, bedeli karenin 371px'ten 269px'e inmesi (%27 küçülme). Yemek fotoğrafı için büyük kare genelde daha iyi olduğundan bu bir takas, düz kazanç değil. Üçüncü yol manifestin kadraj yönünü ("tane yakın çekimi · yatay") kullanan karma bir yerleşim, ama o artık ızgara ayarı değil sayfaya tasarım yapmak. **12 Ağu 2026'da ertelendi:** on altı boş çerçevede öksüz satır, on altı gerçek fotoğrafta olduğundan çok daha fazla göze batıyor | sahibine, fotoğraflar geldiğinde |
| Menü ve çekim listesindeki öksüz satırlar | Menü ürün ızgarası 4 kart taşıyıp 3 sütun veriyor ("Terbiyesiz tavuk şiş" tek başına), çekim listesi 7 kare taşıyıp 6 sütun veriyor | Galeriden farkı: ikisi de tasarımın kendi kuralı, `repeat(auto-fit, minmax(280px,1fr))` ve `minmax(150px,1fr)` `Menu Sayfasi.dc.html`'de birebir yazılı ve ürün sayısı da tasarımdan geliyor. Tasarım aynı öksüzü üretiyor. Kaydedildi, dokunulmadı | sahibine, düşük öncelik |
| SSS/answer-block AEO içeriği | Yapılandırılmış soru-cevap bloğu (`FAQPage` şeması) eklensin | SEO ve AEO spec'i (`docs/specs/2026-08-24-seo-aeo-design.md`) teknik/yapısal kalemleri bu turda uyguladı; FAQ yeni metin gerektirdiği için CLAUDE.md'nin "yeni pazarlama metni uydurulamaz" kuralı gereği dışarıda bırakıldı | sahibine: hangi sorular, ne cevap ([issue](https://github.com/crimsoninnovate/bozo/issues/1)) |
| `docs/tasarim/metin-envanteri.json` satır 16'daki konumlandırma cümlesi | "Ciğerci Bozo, Girne'de gece beşe kadar açık kalan, Urfa'nın tavla zarı ciğerini meşe korunda pişiren ciğercidir." meta açıklama/basın metni olarak kullanılsın mı | Cümle tam da SEO/AEO turunun ihtiyacı için yazılmış ama envanterde `[ÖNERİ]` etiketli, işletme onayı bekliyor; bu turda kullanılmadı | sahibine: onaylanırsa ana sayfa meta açıklaması ve/veya `llms.txt` özetinde kullanılabilir ([issue](https://github.com/crimsoninnovate/bozo/issues/2)) |

## 13 Ağustos 2026: gerçek menü verisi geldi

Sahibi tam fiyat listesini, içecek listesini ve ikram listesini verdi. Menü sayfası
yer tutucu bir menüden gerçek menüye geçti. Handoff'tan sapmaların hepsi veriden
geliyor: tasarım beş ürünlü ve fiyatsız bir menü çiziyordu, gelen veri altı porsiyon,
bir kombinasyon, üç ölçü, on içecek ve sekiz ikram taşıyor.

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| Ürün listesi | `ocaktanUrunler` ikiye ayrıldı: `anaUrunler` (beş kalem) ve `menuUrunler` (altı) | Sahibi ana sayfanın beş kalemde kalmasını, tam listenin yalnız menüde olmasını istedi. Tek dizi paylaşılırken bu ayrım yapılamıyordu; fiyat hâlâ tek kaynakta | uygulandı |
| Kuzu Şiş | Kaldırıldı, yerine Terbiyeli Kuşbaşı | Sahibinin fiyat listesinde kuzu şiş yok, terbiyeli kuşbaşı var. Kadraj yuvası (`kuzu-sis` > `terbiyeli-kusbasi`) ve "sakatat yemeyen misafir için" açıklaması yeni ürüne taşındı, yeni metin yazılmadı | uygulandı, sahibi teyit etti (13 Ağu 2026) |
| Fiyat modeli | `Urun.fiyat: number \| null` yerine `tam` + `durum`; yarım `yarimFiyat()` ile türetiliyor | Sahibi "yarım, tamın yarısı, ayrı kalem değil" dedi. Yarımı veri olarak saklamak iki değerin ayrışmasına açık kapı bırakırdı. `urunler_tamFiyatlarCiftSayidir` tek sayı fiyat girilirse uyarır, yuvarlama sessizce devreye giremez | uygulandı |
| Menü ürün ızgarası | 4 kart yerine 5; öksüz satır 1'den 2 karta çıktı | Ürün sayısı veriden geliyor. Yukarıdaki "öksüz satırlar" maddesi bu ölçüde iyileşti, kapanmadı | uygulandı |
| Bozo Special | Izgarada değil, ızgaranın altında kendi şeridinde | Tek ölçüsü var: yarım ve dürüm satırı basılamaz, ürün kartı kalıbına girmiyor. `OzelUrun` ayrı tip | uygulandı |
| İkramlar | İki plakalı karta ek olarak üç kümeli liste (Yeşillik / Soğan / Közde) | Sekiz kalem iki karta sığmıyor, düz sekizli liste de hiyerarşisiz. Kümeler hazırlanışa göre: sahibinin listesinde üç kalem "közde pişmiş", ikisi "temizlenmiş ve ayıklanmış" ile başlıyor | uygulandı |
| İçecekler | Fiyat sütunu kalktı, yerine sunum ölçüsü. Kesik "liste tamamlanacak" yuvası silindi. Tek sütun iki sütuna çıktı | İçecek fiyatı gelmedi; on satır "000 TL" basmak yer tutucudan beter okunuyordu. Liste geldiği için yer tutucu yuvanın gerekçesi kalmadı. On kalem tek sütunda sayfayı gereksiz uzatıyordu | uygulandı |
| Lebeni açıklaması | "Nohut, yoğurt ve kekik" > "Yoğurt ve kekik, nohutsuz" | Sahibi "lebeni çorbası nohutsuz olacak" dedi. Yayındaki metin gerçekle çelişiyordu; ana sayfadaki `cip1.detay` de düzeltildi | uygulandı |
| Ana sayfa fiyat bloğu | "Fiyat listesi henüz kesinleşmedi" > "Tam liste ve fiyatlar menüde", menü butonu ikincilden birincile | Fiyatlar geldi, cümle yalan oldu. Bölüm büyütülmedi: beş ad, altında menüye giden CTA (sahibinin tarifi) | uygulandı |
| `ortak.porsiyon` | Silindi | İmza panelinin tek fiyat satırıyla birlikte çağıranı kalmadı. Yukarıdaki "çağıranı olmayan sözlük anahtarları" maddesinin dördüncü örneği, bu turda ölü hale geldiği için beklemeden silindi | uygulandı |

## 13 Ağustos 2026: ana sayfaya ısı hareketi

Sahibi ana sayfaya farklı bir hareket kurgusu istedi. Handoff'ta ve
UYGULAMA-NOTLARI'nda hareket için tek satır var (`prefers-reduced-motion`
zorunluluğu, satır 201), yani ikisi de sapma değil, boş alana ekleme.
Reddedilenler listesindeki beş öneriyle çakışmadıkları tek tek kontrol edildi.

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| Kor sahnesi | Yeni `IsiDalgasi`: kor yatağının üstünde iki filtreli bant, `feTurbulence` + `feDisplacementMap` | Ocağın üstünde kırılan hava. Kütüphane gerektirmiyor (`CLAUDE.md` bağımlılık kuralı GSAP/Motion/Lenis'i baştan eliyor) ve web'de nadir. Ölçüldü, 1440x900'de kare süresi bant açıkken 16.66ms, kapalıyken 16.66ms: maliyet ölçülemiyor | uygulandı |
| Aynı | Kaynak düz gradyan değil ince filament dokusu | İlk sürüm görünmüyordu ve sebebi teoriktı: düzgün bir alanın displacement'ı yine düzgün bir alan. Bükülecek kenar gerekiyor | uygulandı |
| Aynı | Bant `bottom:0` değil `bottom:120px` | `.dip` alt 180px'i .92 alfaya kadar karartıyor (KorSahnesi.module.css:185) ve bandı tamamen yutuyordu | uygulandı |
| Aynı | Filamentlere `blur(0.7px)` ve alfa .085 | Keskin ve düzenli aralıklı çizgiler ahşap damarı gibi okunuyordu (ekran görüntüsüyle doğrulandı, üç tur ayar) | uygulandı |
| Aynı | SMIL `<animate>` kullanılmadı, hareket tamamen CSS | `animasyonlar.css`'in `prefers-reduced-motion` kuralı CSS animasyonunu kapatır, SMIL'i kapatmaz. SMIL ile erişilebilirlik güvencesi sessizce delinirdi | uygulandı |
| Hero şiş grafiği | Altı kare bağımsız ısınıyor: `brightness` + kor lekesi, asal periyotlar (7/11/13/17/19/23s) ve negatif gecikme | Markanın kendi nesnesi, stok efekt değil. **Gezen dalga değil:** o kalıp aşağıda "yükleniyor-iskeleti" gerekçesiyle reddedilmişti. Ölçüldü, altı karenin anlık parlaklığı birbirinden farklı ve sıralı değil | uygulandı |
| Ertelendi | `animation-timeline: scroll()` ile kor yoğunluğunu JS aboneliğinden almak | Kazanç compositor thread ve bir scroll dinleyicisi eksik, ama Firefox stable'da özellik hâlâ bayraklı, yani mevcut JS yolu `@supports` fallback'i olarak kalmak zorunda. Çalışan bir özelliğin yanına ikinci yol, görünür kazanç yok | ertelendi |

## 13 Ağustos 2026: hero şişi ve mobil bar kapısı

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| Hero şiş grafiği | Altı eşit 17px kare yerine `TaneDizilimi` hero rayı: 20/12/20/20/12/20, gap 12, çubuk karelerin ARKASINDAN geçiyor | Sahibi beğenmedi. Mevcut hali `UYGULAMA-NOTLARI 2` madde 3'e birebir sadıktı, yani port değil kaynak sorunluydu; ondan önceki handoff (`Ana Sayfa Alternatif.dc.html:101-103`, `docs/tasarim/ana-sayfa.json`) zaten doğru rayı çiziyordu. Bileşenin `cizgi` ve `kor` propları tam bu ray için yazılmış ve on iki kullanımın hiçbirinde çağrılmıyordu: ölü koddu | uygulandı |
| Aynı | `RITIMLER[6]` = 4 büyük + 2 küçük | Sitenin kendi sayacı "4+2, ciğer ve kuyruk yağı, her şişte" diyor. Hero, on iki rayın bu ritmi bozan tek yeriydi | uygulandı |
| Aynı | İki commit önce eklenen `taneIsisi` (altı karenin hepsi ısınır) silindi | Bileşenin kendi ayrımı daha doğru: "küçük tane tangerine, yani tanelerin ARASINDAKİ kor; büyük tane krem, yani etin kendisi. Ateş yanar, et yanmaz." `kor` propu yalnız küçük taneleri nefes ettiriyor | uygulandı |
| `TaneDizilimi` `.korlu` | Büyük taneye üstten ışık gradyanı ve zemin gölgesi, küçük taneye kor lekesi | Sahibi "iyi çizimli kareler" istedi. Aydınlatma beyaz EKLENEREK değil altı karartılarak kuruldu: palet kapalı bir liste ve krem zaten en açık ton. Yalnız `.korlu`, diğer on bir ray düz kaldı | uygulandı |
| Isı dalgası, mobil | Kapatılmak yerine küçültüldü (bant 140px, `bottom:78px`) | Sahibinin önceliği performans değil görünüş. 390x844'te ölçüldü: bant açıkken 16.66ms, kapalıyken 16.66ms, p95 ikisinde de 18.1 | uygulandı |
| Mobil eylem barı | 120-240px arası kayarak girer, tepede görünmez | Hero'nun kendi "Yol Tarifi Al" butonu ekrandayken bar aynı eylemi ikinci kez basıyordu. `animation-timeline: scroll(root)` ile, JS yok, hidrasyon yok. Ölçüldü: 0px'te `translateY(80.85px)` + opaklık 0, 300px'te `translateY(0)` + opaklık 1 | uygulandı |
| Aynı | Desteklenmeyen tarayıcıda ve `prefers-reduced-motion`'da bar hep görünür | Başarısızlık yönü güvenli: kapı kurulamazsa düğmeler kaybolmuyor, bugünkü davranış kalıyor | uygulandı |

## 13 Ağustos 2026: yüzen cam mobil bar

Sahibi barın "düz" olduğunu söyledi ve referans olarak `elaves.com`'un mobil barını
verdi: kenardan kopuk hap, cam zemin, ortada barın üstüne taşan ana eylem. Kalıp
oradan, içerik ve renk buradan.

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| Mobil bar | Kenardan kenara opak şerit yerine yüzen cam hap | Şerit sayfanın zemininden kopmuyordu, "ekranın kesilmiş alt bandı" gibi okunuyordu | uygulandı |
| Köşe | 3px yerine tam yuvarlak (`999px`) | **Kural bilerek delindi.** Önce `CLAUDE.md`'nin 0-3px kuralına sadık bir slab kuruldu, sahibi görüp "kare kare her şey" diyerek reddetti. İstisna `CLAUDE.md` > Typography'e yazıldı | uygulandı, istisna kayıtlı |
| Cam | Üç katman: ışık gradyanı + koyu zemin + `blur(26px) saturate(1.4)` | Tek bir yarı saydam renk cam gibi durmuyor; camı pahalı gösteren şey bulanıklık, saç teli kenar ve zeminden ayıran derin gölgenin birlikte çalışması | uygulandı |
| Orta öğe | "Menü" değil **Bozo Sofrası**, barın üstüne taşan yuvarlak kor düğmesi | Sahibinin kararı. "Sofra" zaten kilitli terim. Hedef yine `/menu`. Daire akışta yerini koruyup yalnız yukarı çıkıyor, böylece etiketi komşularıyla aynı hizada | uygulandı |
| Telefon | Bardan çıktı, WhatsApp yeterli | Sahibinin kararı. `TelefonIkon` ölü kalmadı, beş yerde daha çağrılıyor | uygulandı |
| İkon seti | Elle çizilen set yerine `lucide-react` | Sahibi "ikon kütüphanemiz hiç iyi değil" dedi. Eski set tutarsızdı: üçü dolu, biri çizgi, ağırlıklar farklı. Sarmalayıcılar korundu, altı çağıran dosyanın hiçbiri değişmedi | uygulandı |
| Bağımlılık kuralı | "Yalnız üç runtime paketi" kuralı kaldırıldı | Sahibinin kararı: küçük bir restoran sitesi, bundle bütçesi projesi değil. CSS framework, i18n ve test framework yasağı duruyor, onlar mimari karardı | uygulandı |
| Instagram ikonu | `lucide-static` geometrisi elle gömüldü | Lucide v1 marka ikonlarını kaldırdı, pakette yok. Elle gömmek seti tek dilde tutuyor | uygulandı |
| Ölçü | 358x68'den **268x54**'e, kenardan kenara değil ortada | Sahibi "çok yüksek ve sağa sola geniş" dedi. Genişlik artık içeriğin kendisi; ortalama `translate` ile yapıldı çünkü `transform`u kaydırma animasyonu kullanıyor. Ölçüldü: 390px ekranda x=61, yani tam orta, hem gizliyken hem görünürken | uygulandı |
| Aynı | Görünür kutu 38px ama dokunma hedefi `::after` ile 44px | İnceltmek erişilebilirlik tabanını düşürmemeli; teknik AltBilgi'de zaten kurulu | uygulandı |
| WhatsApp ikonu | Marka işareti yerine Lucide `MessageCircle` | Lucide marka logosu taşımıyor. Her çağrıldığı yerde yanında "WhatsApp" etiketi var, tanınırlık etiketten geliyor. Marka işareti şart görülürse geri alınabilir | uygulandı, sahibine |

## 13 Ağustos 2026: CTA butonlarında iki katmanlı işaret dili

Sahibi CTA'ların ikonlu ve daha tasarlanmış olmasını istedi. Envanter: 19 buton,
10 dosya. Hepsine ikon koymak reddedildi, ayrım yapıldı.

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| `Buton` | İki opsiyonel prop: `ikon` (başta) ve `ok` (sonda) | Baştaki ikon butonun NE yaptığını, sondaki ok NEREYE gittiğini söyler. İkisi aynı butonda kullanılmaz; hepsine aynı muamele yapılsa fark kaybolur ve butonlar süslenmiş gibi okunurdu | uygulandı |
| Eylem butonları (10) | Başta ikon: `MapPin`, `Phone`, `MessageCircle` | En çok kazanan telefon butonu: etiketi ham numara (`+90 533 888 74 24`) ve beş yerde geçiyor. Çıplak numara "dokun ve ara" demiyor, veri gibi duruyordu | uygulandı |
| Gezinme butonları (8) | Sonda ok, hover'da 3px kayıyor | Ok metnin parçası değil, o yüzden `.55` opaklıkta | uygulandı |
| Ok yönü | Sayfaya giden sağa, sayfa içi çapaya giden aşağı | `href.startsWith('#')`'ten türer. Harici gezinme CTA'sı bugün yok, o dal hiç yazılmadı | uygulandı |
| `UstBar` CTA'sı | **Dokunulmadı** | Tek `sm` buton ve üst bar zaten 781-802px bandında 11px taşıyor (bu dosyada kayıtlı). İkon barı genişletip taşmayı büyütürdü | bilinçli atlandı |
| `Buton` CSS'i | Zaten hazırmış | `.taban` `gap:9px` ve `:has(svg)` dolgu telafisi tasarımdan geliyordu (`Ana:346`, `Konum:81`); ikonlu buton tasarımda vardı, portta hiç kullanılmamıştı. Yeni ölçü uydurulmadı | uygulandı |
| `konum/Acilis` birincil butonu | Pin değil ok aldı | **Uyumsuzluk:** etiket "Yol Tarifi Al" ama hedef `#harita`, yani harici harita değil sayfa içi kaydırma. Pin koymak olmayan bir vaat verirdi. Sınıflandırma etikete göre değil davranışa göre yapıldı | uygulandı |
| Aynı butonun etiketi | Değiştirilmedi | Etiket ile hedefin çelişkisi duruyor: ya etiket "Haritayı Gör" olmalı ya hedef harici haritaya bağlanmalı. Metin sahibin | sahibine |

## 13 Ağustos 2026: ana sayfa uçtan uca denetim

Tam rapor: `rapor/ana-sayfa-denetimi.md`. Üç gerçek bulgu, üçü de düzeltildi;
kontrast ve dokunma hedefi alarmlarının çoğu ölçüm hatasıydı ve orada belgelendi.

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| `BeadRay` | 800px altında hiç basılmıyor | Mobil prototipin bileşen envanterinde bead rayı geçmiyor; mobil gezinme alt eylem barı ve çekmece. Portta mobilde de basılıyor, hero içeriğinin üstüne biniyor ve dokunma hedefleri 9-21px'te kalıyordu | uygulandı |
| Aynı | Masaüstünde nokta başına `::after` ile 44px genişlik | 9px bir boncuk fare için de zor hedef. Dikeyde bağlayıcının yarısı kadar taşar, komşunun alanına girmez | uygulandı |
| Ocaktan satırları | "8 şiş / porsiyon" çipi kaldırıldı | Sahibi bütünlüğü bozduğunu söyledi. Beş satırın yalnız birinde ekstra kutu vardı; bilgi ayrıca bir bölüm yukarıda İddia sayacında duruyor. Ölçüldü: satırlar artık beşi de 94px | uygulandı |
| Aynı | Arkasındaki ölü kod da silindi | `MenuSatiri.cip` propu, `.cip` sınıfı, `IMZA_URUN` sabiti ve iki dildeki `cigerCipi` anahtarı | uygulandı |
| `MenuSatiri` ve `ana/Ocaktan` yorumları | "Fiyat gelince rakamlar satırların sağına döner" cümlesi kaldırıldı | Fiyatlar geldi ama sahibi ana sayfanın beş ad artı tek CTA olarak kalmasını istedi. Yorum ileriki bir turu ana sayfaya fiyat eklemeye yönlendirirdi | uygulandı |
| Konum bölümünün üç CTA'sı | `md` > `sm` ve ikincillerde ikon yok | İkonlar 43px ekleyip UYGULAMA-NOTLARI 5'in "üçü tek satırda" düzenini bozmuştu. Yalnız boy küçültmek yetmedi: TR tam 520/520 ile sığıyordu ama EN ("Get Directions") 540 isteyip sarıyordu, yani düzeltme yalnız bir dilde çalışıyordu. İkon, etiketin söylemediğini söylediğinde iş yapar; ham numara söylemiyor, "Yol Tarifi Al" ve "WhatsApp" söylüyor. Ölçüldü: TR 480/520, EN 500/520, üçü de 44px | uygulandı |

## 13 Ağustos 2026: mobil hero, kor kıvılcımı ve tekrarlar

Sahibi mobil ilk ekranın "hiç havalı gözükmediğini", iki koca butonun yapısal
olarak şık olmadığını söyledi ve referans olarak `yztd.org.tr`'yi verdi: orada
butonlar yan yana ve arkada canlı bir animasyon var.

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| Mobil hero | İki `xl` buton 800px altında hiç basılmıyor | **Port mobil tasarımı uygulamamış.** Mobil prototipin hero'su beş öğe sayıyor (durum rozeti, başlık, alt başlık satırı, saat satırı, adres) ve buton içermiyor: eylemler alt bara ait. Masaüstü hero'su mobile olduğu gibi düşüyor ve yüzen barı tekrar ediyordu | uygulandı |
| Aynı | "meşe korunda" H1'den çıktı, rayın yanına geçti | İki tasarım kaynağı da bunu istiyor: handoff "alt-baslik satiri + yanina flex:1 zar rayi", mobil prototip "iki kolonlu satir". Masaüstünde satır sarıyor, yani görünüm değişmiyor; mobilde 26px'e inip yan yana oturuyor | uygulandı |
| Aynı | Meta satırı mobilde alt alta, ayırıcısız | Üç öğe üç satıra sarıyor ve satır sonlarında sarkan dikey çizgiler kalıyordu (sahibinin ekran görüntüsünde görünüyor) | uygulandı |
| Kor sahnesi | Yeni `KorKivilcimi`: canvas, yükselen kor taneleri | Sahnenin diğer katmanları ekranın dibine yaslıydı; dikey mobil ekranda hepsi katlamanın altında kalıyordu. Kıvılcım dikey yükseldiği için ilk ekrandan geçer. Taneler kare: markanın tanesi tavla zarı. Ölçüldü: yanan piksel 58'den 739'a, kare süresi 16.61ms vs kıvılcımsız 16.66ms | uygulandı |
| Aynı | Yoğunluk böleni 26000 > 9000 | İlk sürüm 390x844'te 18 tane koyuyordu ve ekranda hiç okunmuyordu | uygulandı |
| Aynı | `prefers-reduced-motion` elle okunuyor, sekme gizlenince duruyor | Canvas kendi rAF döngüsünü kurar, `animasyonlar.css`'in global kuralı ona ulaşmaz | uygulandı |
| `IsiDalgasi` | **Tamamen kaldırıldı**, dosyaları silindi | Sahibi "dalgalar tasarımı kırıyor" dedi. İki ateş efekti yarışıyordu ve dalgalar İddia bölümünde ahşap damarı gibi okunuyordu; kıvılcım hikayeyi tek başına daha iyi anlatıyor | uygulandı |
| Ocaktan ikram şeridi | Kaldırıldı | "Sofra kurulu gelir" **üç kez** geçiyordu: şeritte, hemen altındaki İkram bölümünün H2'sinde ve o bölümün paragrafında. Lebeni ve Bostana da iki kez listeleniyordu. Şerit, altındaki bölümün birebir zayıf kopyasıydı | uygulandı |
| Konum panelinin adres satırı | Kaldırıldı | H2 zaten "Naci Talat Caddesi, Girne" diyor, satır aynı caddeyi ve şehri 60px altında tekrarlıyordu. Kapı numarası hero meta satırında ve footer'da duruyor | uygulandı |
| Telif satırı | `krem-58` > `krem-74` | İkinci tur. Önce `krem-50` (4.48) `krem-58`'e (4.81) çıkarılmıştı; sahibi hala okunmadığını söyledi. Eşiği kıl payı geçmek 12.5px için yetmiyor ve arkadaki kor parıltısı sonradan güçlendi. Yeni oran **9.15:1** | uygulandı |
| Favicon | `app/icon.svg` eklendi | Sitede hiç ikon yoktu, tarayıcı `/favicon.ico` için 404 alıyordu. İşaret markanın kendi altılı zar rayı, renkler palet listesinden | uygulandı |

## 13 Ağustos 2026: paket şeridi kaldırıldı, Gizlilik bağlantısı kalktı

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| `PaketSeridi` | **Tamamen kaldırıldı**, bileşen ve sözlük anahtarları silindi | Sahibi turuncu bandın tasarımını sordu; ardından "paket servisten hiçbir yerde söz etmek zorunda değiliz" dedi. Şeridin içeriğinin tamamı paket servis hakkındaydı ve servis başlamamıştı, yani band olmayan bir hizmet için "yakında" vaadi taşıyordu. Güzelleştirmek yerine kaldırmak doğru cevap | uygulandı |
| Aynı | Ana sayfa ve Konum sayfasından çıktı | İki yerde kullanılıyordu | uygulandı |
| Aynı | `ortak.paket` bloğu ve `cta.paketSiparis` silindi | Çağıranı kalmadı | uygulandı |
| Kaldırılan tasarım sorunları | Bant 545px yükseklikte ve büyük kısmı boştu; turuncu tek parça düz levhaydı ve koyu bölümlerle arasında sert kesik vardı; sağdaki çerçeveli kart sitede eşi olmayan bir muameleydi; iki buton farklı genişlikte alt altaydı; asıl haber ("yakında") küçük kartın içindeydi | Hepsi bandın kendisiyle birlikte gitti. Servis başlarsa band git geçmişinden geri alınır, gerçek içerikle | kayıt |
| Footer telif satırı | Gizlilik bağlantısı kaldırıldı | Sahibinin kararı, "şimdilik". Tasarımın hiçbir sayfasında zaten yoktu, fix turunda eklenmişti. Sayfa duruyor ve site haritasında kalıyor, yalnız içeriden bağlantısı yok | uygulandı |
| Aynı | `.gizlilikLink` sınıfları, `TelifSeridi`in `aktif` propu ve `AltBilgiTam`in `aktif` propu silindi | Bağlantı gidince üçü de ölü kaldı | uygulandı |

## 13 Ağustos 2026: rota değişiminde kaydırma hatası ve menü sadeleşmesi

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| `reset.css` | `html { scroll-behavior: smooth }` kaldırıldı | **Kök neden bulundu ve ölçüldü.** `/` > `/menu/` gezinmesinde Next'in yönlendirme sonrası konum düzeltmesi, smooth açıkken sayfanın DİBİNDEN (y=3356, menü sayfasının tam maksimum kaydırması) başlayıp 82 karede y=0'a iniyordu. Aynı gezinme `auto` ile tek olayda doğrudan y=0'da bitiyor. Kodda tek `scrollTo` çağrısı var (BeadRay) ve olaya karışmıyor; kaydırmayı Next yapıyor, CSS onu görünür kılıyordu. Tasarım kaynağı bu kuralı yazıyor ama o tek sayfalık bir prototipti | uygulandı |
| Aynı | Bead rayı etkilenmedi | Yumuşaklığını kendi JS çağrısında taşıyor (`behavior: 'smooth'`) | doğrulandı |
| Menü sayfası | "Gece Menüsü" not kartı kaldırıldı | Sahibinin kararı. Blok "hangi ürünlerin ocakta kalacağı henüz belli değil" diyordu, yani karar verilmemiş bir şeyi duyuruyordu | uygulandı |
| Menü sayfası | "Çekim Listesi" bölümü kaldırıldı | Sahibinin kararı: prototip iç notu, misafire ait değil. Aynı kareler zaten galeri sayfasında | uygulandı |
| Footer | Üç varyant yerine tek footer: ana sayfanın dört kolonlu hali her sayfada | Sahibinin kararı. `AltBilgiSerit`, `AltBilgiSayfalar` ve seçici `altBilgiVaryanti` silindi | uygulandı |

## 13 Ağustos 2026: mobil hero prototipin beş bloğuna indi

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| `KapanisNotu` | Sıfır birim basılmıyor | **Hata:** "Kapanışa 0 saat 18 dakika" cümle değil şablon artığıydı (sahibinin ekran görüntüsü). Saat 0 ise yalnız dakika, dakika 0 ise yalnız saat basılır | uygulandı |
| Mobil hero | Adres bloğu saatten SONRA | Mobil prototipin sırası: başlık, alt başlık satırı, saat, adres. Portta adres `.sol`da, saat `.sag`da olduğu için tek kolona inince adres saatin üstünde kalıyordu. `display: contents` + `order` ile çözüldü, DOM sırası ve masaüstü değişmedi | uygulandı |
| Mobil hero | "GİRNE · ŞU AN", `KapanisNotu` ve `GunMerdiveni` 800px altında basılmıyor | Sahibi "mobilde çok dağınık" dedi. Sayıldı: hero dokuz blok taşıyordu, mobil prototip beş sayıyor. Fazlalıklar masaüstünün sağ kolonundan düşmüştü | uygulandı |
| Aynı | Gerçek bir tekrar da kapandı | Üstte "Ocak 05:00'e kadar yanıyor", 800px aşağıda "Ocak 05:00'te söner." Aynı şey iki kez. Gün merdiveninin bilgisi ana sayfanın Gece bölümünde duruyor, kayıp yok | uygulandı |
| Açık kalan | EN'de "1 hours to closing" | Tekil/çoğul ayrımı yok, bugünkü hatanın komşusu ama ayrı iş | aşağıda kapandı |

## 13 Ağustos 2026: çapa butonlarına yumuşak kaydırma geri geldi

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| `CapaBaglantisi` (yeni) | Sayfa içi çapa butonları `scrollIntoView` ile yumuşak kayıyor | Global `scroll-behavior: smooth` rota değişimini bozduğu için kaldırılmıştı; yumuşaklık artık yalnız istendiği yerde ve JS'te, desen `BeadRay` ile aynı | uygulandı |
| Aynı | `scrollIntoView` seçildi, elle ofset hesabı yok | `scroll-margin-top`u kendisi hesaba katıyor. Ölçüldü: tarayıcının kendi çapa atlaması 1490, bu sürüm de 1490; `scroll-margin-top: 70px` korunuyor | doğrulandı |
| Aynı | `preventDefault` sonrası hash `pushState` ile yazılıyor | Yoksa bağlantı paylaşılabilir bir hedef olmaktan çıkardı | uygulandı |
| Aynı | Yalnız çapa dalı istemciye iniyor | `Buton` sunucu bileşeni kalıyor; on sekiz çağrının yalnız ikisi çapa | uygulandı |
| Regresyon | Rota değişimi hâlâ anlık | Ölçüldü: `/` > `/hikaye/` tek kaydırma olayı, y=0 | doğrulandı |

## 13 Ağustos 2026: İngilizce geri sayımda tekil-çoğul

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| `content/en/ana.ts` | "1 hours to closing" > "1 hour to closing" | **Hata.** Üç durumda görünüyordu: `1 hours`, `1 minutes` ve `1 hours 1 minutes`. Gecenin son saatinde İngilizce ziyaretçinin gördüğü tek cümle bu | uygulandı |
| `content/*/ana.ts` | Üç cümle kalıbı yerine bir kalıp artı birim çiftleri | **Yapısal sebep:** kalıplar bütün cümleyi tutuyordu, sayıya bağlı dilbilgisine yer yoktu. Sayılan ad kendi tekil/çoğul çiftine taşındı, cümle çerçevesi ayrı kaldı | uygulandı |
| `content/tr/ana.ts` | Türkçede iki biçim bilerek aynı | Sayıdan sonra çoğul eki gelmez (`1 saat`, `19 saat`). Hatanın bugüne kadar görünmemesinin sebebi de bu: kalıp Türkçede doğru çalışıyordu | uygulandı |
| `lib/saat.ts` > `kalanSuresi` (yeni) | Birleştirme saf fonksiyona taşındı | Sıfır birim düşürme kuralı bileşenin içindeydi ve test edilemiyordu; altı test artık iki dilde kilitliyor | uygulandı |
| Regresyon | Türkçe çıktı bayt bayt aynı | Ölçüldü, beş durumda: `Kapanışa 2 saat 30 dakika.` eski kalıpla da yeni birleşimle de aynı | doğrulandı |

## 13 Ağustos 2026: mobil hero prototipin ölçülerine oturdu

Sahibi hero'dan memnun olmadığını söyledi. Ölçüm 390x844'te canlı sayfaya karşı
koştu ve altı sapma çıktı, hepsi aynı yöne bakıyordu: içerik hollow bir kutuda
asılı kalmıştı.

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| `.bolum` (mobil) | `min-height:100vh` + dikey ortalama kalktı; blok yukarıdan başlıyor | **Asıl kusur buydu.** Ölçüldü: 462px'lik içerik, üstünde 191px ve altında 131px boşlukla 844px'lik kutunun ortasında asılıydı. Prototipin hero'su `100vh` değil, `padding:52px 20px 40px`'lık bir blok | uygulandı |
| Aynı | Üst dolgu 112px | 60px sabit üst bar (390px'te ölçüldü) artı prototipin 52px'i. Prototipin barı akışın içinde, bizimki hero'nun üstüne biniyor | uygulandı |
| `.izgara` (mobil) | Bloklar arası tek değer: 20px | Canlıda 26 ile 80 arasında beş ayrı boşluk vardı (başlık 80, alt başlık 46, ...); prototip beşini de 20px yazıyor | uygulandı |
| Aynı | Tek kolon yerine `auto 1fr` ızgara | Prototipte saat ve "Ocak 05:00'e kadar yanıyor" aynı satırda, saatin sağında. Canlıda durum metni rozetin altındaydı, ait olduğu saatten 270px uzakta | uygulandı |
| Aynı | Üç sarmalayıcı `display: contents` | Altı öğe üç ayrı kutunun içinde; kutular kalkınca hepsi doğrudan ızgaranın hücrelerine giriyor. DOM sırası ve masaüstü değişmiyor, bütün kurallar 800px sorgusunun içinde | uygulandı |
| `CanliSaat.dev` (mobil) | 64px > 30px | Prototip `700 30px/1` yazıyor. 64px'te yanındaki durum metni iki satıra kırılıyor ve saatin tabanına hizalanınca sarkıyor. Sahibi iki varyantı ekran görüntüsünde görüp 30px'i seçti | uygulandı |
| Sol kor çizgisi | Kaldırıldı | Dün "beş blok dağınık duruyor" için eklenmişti; prototipte yok ve asıl dağınıklık boşluktan geliyormuş | uygulandı |
| `.meta` (mobil) | Üçüncü satır ("Mekanımız alkolsüzdür") basılmıyor | Prototipin hero'sunda adres iki satır. Satır alt bilgide, çekmecede, menüde ve konum sayfasında zaten duruyor | uygulandı |
| Regresyon | Masaüstü değişmedi | 1440x900'de doğrulandı: iki kolon, 130px saat, gün merdiveni, iki CTA, üç parçalı meta satırı yerinde | doğrulandı |
| Regresyon | İngilizce 800px sınırında doğru diziliyor | Doğrulandı: "The fire is lit until 05:00" saatin sağında tek satır, adres iki satır | doğrulandı |

## 13 Ağustos 2026: mobil iç sayfa turu

Sahibi "mobilde diğer sayfalara da bak" dedi. Altı rota 390px'te gezildi, ölçümler
`PARITE.md`'nin kurallarına göre yapıldı (dokunma hedefi `elementFromPoint` ile,
`getBoundingClientRect` ile değil; `fullPage` yakalama yok).

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| `UstBar.markaAd` | Mobil ölçü artık ana sayfada da uygulanıyor | **Hata, özgüllük.** `@media` özgüllük eklemez: düz `.markaAd` (0,1,0) `.anaVaryant .markaAd`ın 23px'ini (0,2,0) yenemiyordu. Ölçüldü: ana sayfada 23px, menüde 17px; ana sayfanın marka adı 375px'te (iPhone SE, 12/13 mini, 6/7/8) ve 360px'te iki satıra kırılıyordu. 17px mobil prototipin kendi değeri. Aynı hata bu dosyada `.sagGrup` için bir kez yakalanmış, `.markaAd`'a bakılmamıştı | uygulandı |
| Aynı | Mobil barda `white-space: nowrap` | 17px'te bile 320px'de esneme adı "Ciğerci / Bozo" diye kırıyordu. Kural bilerek yalnız 800px altında | uygulandı |
| `UstBar.marka` | 360px altında dekoratif tane dizisi düşüyor | `nowrap` marka kutusunu 171px'te sabitleyince 320px'te hamburger görünümün 6px dışına taşıyordu. Çakışan değil kırpılmış bir kontrol, sarmış bir yazıdan kötü. Dizi `aria-hidden`, marka adı yerinde. Ölçüldü: 320px'te sağ kenar tam 302 = dolgu sınırı; 361px'te dizi hâlâ basılıyor ve sınır 343 = dolgu sınırı | uygulandı |
| Regresyon | Masaüstü barı değişmedi | 801px'te ölçüldü: sağ kenar 770, canlıdaki sürümle birebir aynı | doğrulandı |

Ölçülüp temiz çıkanlar (kanıt olarak kayda geçiyor, "bakmadım" ile "kusur yok"
aynı görünmesin diye): altı rotanın hiçbirinde yatay taşma yok; menü sayfasının
11 etkileşimli hedefinin 11'i gerçek isabet testinde 44px'i geçiyor (ilk taramada
çıkan "9 kusur" 2px'lik tarama adımının artefaktıydı, 1px'e inince kayboldu); alt
bilgi yüzen aksiyon barıyla çakışmıyor; Galeri ve Gizlilik'te başlık gövdeden sönük
DEĞİL (tam opak krem, gövde `.78`; göz yanılmıştı, ölçüm düzeltti); Konum'daki
"Yol Tarifi Al" butonunun aşağı oku doğru, o buton haritayı dışarıda açmıyor,
sayfa içinde `#harita`ya kaydırıyor (`konum/Acilis.tsx:51-54`, kaynak Konum:80).

## Öneri, karar bekliyor: mobil turdan iki madde

| Nerede | Ölçüm | Neden burada |
|---|---|---|
| ~~Masaüstü barı, 800-880px bandı~~ | ~~801px'te marka adı iki satıra kırılıyor~~ | **Karar verildi, aşağıda uygulandı: eşik 960** |
| ~~Konum hero'sunun üst satırı~~ | ~~"Girne saati, canlı" tek satırda yalnız TR + ≥390px'te duruyor~~ | **Karar verildi, aşağıda uygulandı** |

## 13 Ağustos 2026: konum saat etiketi mobilde kendi satırında

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| `konum/Acilis.saatEtiketi` | 800px altında `flex-basis: 100%` | **Sahibinin kararı:** sarma tesadüfe kalmasın, iki dil aynı görünsün. Ölçüldü: tek satırlık hal yalnız Türkçe ve ≥390px'te tutuyordu (390px'te sağda 1px pay), 360px'te Türkçe de 390px'te İngilizce de kendiliğinden sarıyordu | uygulandı |
| Aynı | İki dil artık birebir aynı | Ölçüldü, 390px: rozet 172, saat 177, etiket 220, kap 61px; TR ve EN aynı değerler. 360px'te de aynı | doğrulandı |
| Regresyon | Masaüstü değişmedi | 1440px'te ölçüldü: üçü de tek satırda, kap 34px | doğrulandı |

## 13 Ağustos 2026: mobil eşik 800'den 960'a

Sahibi masaüstü barının kırılmasını kapatmak için eşiğin taşınmasını istedi ve 880
dedi; o sayı benim raporumdaki tahmindi ve ölçüm onu iki kez düzeltti.

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| Yirmi iki media query | `max-width: 800px` > `960px` | Eşik tek yerde taşınamaz: yalnız `UstBar`'da taşımak arada kalan bantta hem nav'ı hem hamburger'i gizler, yani gezinmeyi tamamen düşürür. `d50f16c` aynı sebeple on yedi sorguyu birlikte taşımıştı, bugün sayı yirmi iki | uygulandı |
| Sayının kendisi | 880 ve 900 denendi, ikisi de yetmedi | **Tahmin değil ölçüm:** `.satir` geçici olarak `width:max-content` yapılıp barın kendi iç genişliği okundu. Ana varyant 831px, iç varyant 852px ister. Yan dolgu `5vw` olduğu için gereken pencere `içerik / 0.9`: 924 ve 948. 960, ikisini de 12px payla karşılar | uygulandı |
| Yan ölçüler | `FotoYuvasi` `sizes` ipucu ve eşiği anlatan on bir yorum birlikte taşındı | `sizes="(max-width: 800px) 100vw"` eşiğe bağlı bir doğruluk beyanı; eşikle taşınmazsa tarayıcı yanlış srcset adayını seçer | uygulandı |
| Dokunulmayan | `KorSahnesi` `min(780px, 110%)` | Bu bir genişlik, eşik değil. `d50f16c` turunda da ayrı tutulmuştu | doğrulandı |
| Bedeli | 800-960 arası pencereler telefon düzeni alır | Sahibine ekran görüntüsüyle gösterildi ve onaylandı (13 Ağustos 2026). Gerçek telefonların hiçbiri bu bantta değil; etkilenen dar açılmış masaüstü pencereleri ve dikey tablet | kabul edildi |
| Doğrulama | 961px'te iki varyant da temiz | Ölçüldü: marka tek satır, nav açık, hamburger yok, taşma yok; menü sayfasının CTA'sı tam sınırda oturuyor | doğrulandı |
| Doğrulama | 900px'te yedi rota temiz | Ölçüldü: yatay taşma 0, hamburger açık, çekmece açılıp kapanıyor, yüzen bar yerinde | doğrulandı |

## 13 Ağustos 2026: iç sayfaların barı da perdesini kazandı

1440px turunda çıktı. Ana sayfada 12 Ağustos'ta kapatılan hatanın (`39e88f3`,
`bf263b6`) iç sayfalarda duran hali: o tur yalnız ana varyanta bakmış.

| Nerede | Değişiklik | Gerekçe | Durum |
|---|---|---|---|
| `UstBar.bar` | Perde iki varyantta ortak: düz `--panel-yari`, `blur(14px)`, 1px saç çizgisi | **Hata.** Ölçüldü (1440px, menü, kaydırma 1290): iç varyantta `backdrop-filter: none` ve gradyanın alt ucu `.55`; barın altından geçen üç ürün adı ("Dalak", "Yürek", "Terbiyesiz Tavuk Şiş") nav bağlantılarının içinden okunuyordu. Dört sayfayı etkiliyordu: menü, hikaye, konum, galeri. Sahibi ekran görüntüsünü görüp ana sayfayla aynı olmasını seçti | uygulandı |
| Aynı | `.anaVaryant` ve `.icVaryant` perde kuralları silindi | İkisi aynı değere geldiği için iki kural tek `.bar` kuralına indi. Varyant ayrımı duruyor: yükseklik 84/78, nav 16/15, marka 23/21, aktif sekme alt çizgisi | uygulandı |
| Aynı | Ham `rgba(10,8,7,.55)` yerine `--panel-yari` | Aynı değerin token'ı zaten vardı (`tokens.css:15`) | uygulandı |
| Regresyon | Mobil perde değişmedi | Ölçüldü (390px, iki varyant): gradyan `.94 > .6`, `blur(10px)`, saç çizgisi yok. Media query kuralı `.bar`la aynı özgüllükte ama sonra geldiği için kazanıyor | doğrulandı |

## 13 Ağustos 2026: 1440px turu, temiz çıkanlar

Sahibi masaüstünü kontrol etmemi istedi. Yukarıdaki bar hatası dışında altı rota
temiz; kanıt olarak kayda geçiyor:

- Ana sayfanın dokuz bölümü yerinde: hero iki kolon ve 130px saat, gün merdiveni,
  İddia sayaçları, Ocaktan satırları, fiyat bloğu, İkram, Gece zaman çizelgesi
  (canlı imleç doğru konumda), Bozo, Konum, dört kolonlu alt bilgi.
- Menü: üç kolonlu ızgara, fiyat satırları hizalı, 13 etkileşimli hedefin 13'ü
  gerçek isabet testinde 44px'i geçiyor, yatay taşma 0.
- Hikaye, Galeri, Konum: yerleşim bozulmamış, taşma yok.
- Bugünkü mobil işlerin hiçbiri 1440'a sızmamış: eşik 960 olduğu için hiçbir
  mobil kural etkin değil, marka 23px tek satır, hamburger ve yüzen bar yok.
- Yeniden görünen üç madde zaten kayıtlı ve ertelenmiş: konum hero'sunun boş sağ
  yarısı, galeri ızgarasındaki öksüz kare, menünün son satırındaki boş hücre.

## Reddedildi

| Nerede | Öneri | Neden reddedildi |
|---|---|---|
| `TaneDizilimi` hero rayı | Soldan sağa gezen parlaklık dalgası ("ısı ray boyunca ilerliyor") | Gezen bir vurgu, yükleniyor-iskeleti (skeleton loader) kalıbının ta kendisi; markanın değil arayüz modasının dili. Faz kaydırmalı nefes aynı şeyi söylüyor ve o kalıba benzemiyor. Hareket turu |
| `TaneDizilimi` (on altı rayın tamamı) | Nefesi bütün raylara vermek | Menü satırlarında, bölüm başlıklarında ve footer'da aynı anda nefes alan yirmiden fazla kare gürültü olurdu. Hareketin nadir olması onu anlamlı tutan şey; yalnız hero rayı aldı. Hareket turu |
| `FotoYuvasi` `portre`/`geniş` | Boş plakalara "bekliyor" anlamı veren bir kor katmanı | Bu plakalar bilerek zeminsiz: arkadaki kor sahnesine açılan pencereler (bu dosyanın 42. satırı). Tasarımda karşılığı olmayan bir katman ekler ve zaten `G9`'da sahibine bırakılmış bir karar maddesi; 16 kare yakında geliyorsa doğru hamle hiçbir şey yapmamak. Hareket turu |
| `VardiyaSeridi` | Altı vardiya çipinden o anki saate denk geleni yakmak | Gecenin geçişini anlatırdı ama bir içerik/durum kararı, hareket değil; ayrıca gündüz saatlerinde hiçbir çip yanmaz ve şerit anlamsızlaşır. Hareket turu |
| Bölümler | Girişte "fade up" (aşağıdan kayarak açılma) | Brief'in açıkça kaçınılacaklar listesinde. `Bolum` zaten kaydırmaya bağlı sürekli bir erime taşıyor ve o, tek seferlik bir girişin yerini tutuyor. Hareket turu |

## 18 Ağustos 2026: uçtan uca denetim turu

Sekiz boyutta paralel denetim (mimari, metin, erişilebilirlik, stil, performans, kod,
SEO, belge), her boyutun bulguları ayrı bir çürütme turundan geçirildi: 51 bulgu
onaylandı, 4 reddedildi. Bulguların hepsi uygulanmadı; aşağıdakiler ölçülüp uygulananlar,
kalanı "karar bekliyor" başlığında.

### Ölçümle kapatılanlar (tarayıcıda, 12 rota)

| Ölçüm | Sonuç |
|---|---|
| Yatay taşma, 12 rota x 390/959/961/1440 | 48 kombinasyonun hepsinde 0 |
| Başlık yapısı | her rotada tek `h1`, atlanan seviye yok, `lang` doğru |
| Dokunma hedefleri, 390px, 12 rota | 236 hedefin hepsi >=44px; tek istisna odaksız atlama bağlantısı (ekran dışında, ölçüm artefaktı) |
| Azaltılmış hareket | normalde 12 animasyon koşuyor (11'i sonsuz), `reduce` altında 0; `KorKivilcimi` tuvali 390x844'ten varsayılan 300x150'ye düşüyor, yani döngü hiç başlamıyor |
| Metin etkin alfa zinciri, 6 rota / 403 öğe | `.5` tabanının altında hiçbiri yok |
| Efekt temizliği | listener/observer/interval simetrisi tam, sızıntı yok |
| TR/EN sözlük | 236'ya 236 yaprak, tek taraflı anahtar yok |
| Em dash, saat biçimi, kilitli terminoloji | misafire görünen metinde ihlal yok (eşleşenlerin hepsi yorum ya da `ızgara`=grid, `masaüstü`=desktop gibi teknik kullanım) |
| Mobil eşik | 22 media query + `FotoYuvasi` `sizes`, hepsi 960; 780/800/880 kalıntısı yok |

### Uygulandı

| Nerede | Değişiklik | Ölçüm |
|---|---|---|
| `content/{tr,en}/galeri.ts`, `{tr,en}/ortak.ts` | "on altı kare" > "on yedi kare", iki dilde dört dize (meta description dahil) | Manifest 17 slot, ızgara `Object.keys(fotograflar)` ile basıyor: metin bir yıl önceki sayıyı söylüyordu. `galeri_kareSayisi_metindekiSayiylaAyni` testi sayıyı manifeste bağladı |
| `components/ember/KorKivilcimi.tsx` | `resize` dinleyicisi `rafKisitla` ile sarıldı, `passive: true` oldu, ölçü ve DPR değişmediyse erken dönüyor | Dinleyici kısıtsızdı ve her olayda 120 taneyi yeniden üretip bitmap'i sıfırlıyordu (1440x900 @DPR2'de 19,8 MiB). Repodaki diğer üç dinleyici zaten `rafKisitla` + passive |
| `lib/jsonld.ts` | `servesAlcohol` > `amenityFeature` (`LocationFeatureSpecification`), `hasMenu` eklendi, saatler `ACILIS_SAATI`/`KAPANIS_SAATI`'ye bağlandı | `servesAlcohol` schema.org'da yok, tüketiciler yok sayıyordu. Saat testi literalleri kendileriyle karşılaştırıyordu, artık tek kaynağa bağlı |
| `lib/kabuk.ts`, `lib/kabuk.test.ts` | `altBilgiSayfaLinkleri`, `FOOTER_SAYFA_SIRASI`, `NAV_ETIKETI` ve iki testi silindi | Üçü de sahibinin 13 Ağustos'ta sildiği footer varyantlarının artığı; üretimde sıfır çağıran. `NavEtiketi` union'ı ve `ortak.nav.gizlilik` korundu (C4) |
| `components/layout/AltBilgi.module.css` | 17 ölü kural bloğu silindi, 433 > 280 satır. `TelifSeridi`'nin `sikMi` prop'u da (tek çağrı sitesi hiç geçmiyordu) | Seçicilerin hepsi yalnız ölü sınıf içeriyordu, yani hiç eşleşemezdi. Doğrulandı: footer kutusu 1440x323 ve 390x805, 48 çocuk, dolgu birebir aynı. Piksel farkı %5.85 ölçüldü ama gürültü tabanı %18.65 (aynı derlemenin arka arkaya iki karesi, kor sahnesi nefes alıyor); animasyon dondurulunca aynı derleme %0.0001 |
| `styles/tokens.css`, `ana/Gece.module.css` | `--gece: #060504` token'ı eklendi ve bağlandı | Ham literaldi ve iki renk listesinde de yoktu; kanonik kaynak onu token olarak adlandırıyor (`UYGULAMA-NOTLARI.md:12`) |
| Sekiz `.module.css` | 8 ham krem literali mevcut token'a çevrildi (`--krem-76/72/66/62`, `--cizgi`, `--cizgi-hayalet`) | Hesaplanan değer birebir aynı. Yorum içindeki iki eşleşmeye ve rol uyuşmazlığı taşıyan beşine (kor parıltısına `--cizgi-buton` yazmak ham değerden kötü) dokunulmadı |
| `CLAUDE.md`, `KISITLAR.md` | Renk listesine `#0C0A09`, `#060504`, `#7A1F2B`; mobil eşik 800 > 960; bağımlılık kuralı sahibin 13 Ağustos kararına işaretçiye indi; Node >=22.18; yuvarlak hap istisnası; pumpkin kapsamı | "complete list, do not add others" diyen liste kodda ve tasarımda duran üç rengi saymıyordu, yani sonraki oturum meşru değerleri ihlal sanardı. KISITLAR ise `lucide-react`'i yasaklıyordu |
| `YAYIN-KONTROL-LISTESI.md` | Duman testi `/favicon.ico` yerine `/icon.svg` probe ediyor; ikon maddesi 2a (kapandı) ve 2b (açık) diye ayrıldı; zemin sayıları 3.2 MB / 99 test | Derleme `favicon.ico` hiç üretmiyor: o probe kalıcı sahte kırmızıydı ve yayın kapısında açık madde gibi duruyordu. `out/icon.svg` var ve 15 HTML'in hepsi bağlıyor |
| `DEVAM.md` | En üste "18 Ağustos: nerede duruyoruz" bloğu, altındaki her şeyi geçersiz kılıyor | Bağlam sıfırlaması sonrası tek giriş noktası sekiz yanlış olgu taşıyordu: eşik, fiyatlar, ikon, Lucide kararı, test sayısı |
| `PARITE.md`, `KARAR-FORMU.md` | Sayılar yeniden ölçüldü | PARITE 76 test / 16 sayfa diyordu (99 / 17). KARAR-FORMU D'nin üç maddesi tutmuyordu: `-0.015em` iki bileşen dokuz kullanım değil tek dosya tek kullanım, `.09` dört değil iki, `0 8px 22px` sıfır eşleşme. A8 kapandı: POI çipleri silinmiş |
| Sekiz yorum | `lib/kabuk.ts` menü barı gerekçesi, `app/icon.svg`, `BeadRay.tsx`, `Kabuk.tsx`, `Kabuk.module.css`, `Bolum.module.css`, `Harita.tsx`, `{tr,en}/hata.ts`, `{tr,en}/galeri.ts`, `Izgara.tsx` | Hepsi var olmayan bir şeyi tarif ediyordu: kaldırılmış bir CSS kuralı, silinmiş bir bölüm, altı taneli bir ikon (dosya dört çiziyor), imkânsız bir kırpılma bandı, "KorSahnesi ile aynı desen" (KorSahnesi tercihi her abone çağrısında okuyor) |

### Uygulanmadı, bilinçli

- **Sekiz çağıransız token silinmedi.** Okuyunca hiçbiri düz bookkeeping değil:
  `--pumpkin` ve `--mese` marka listesinde, `--tangerine-12` açık bir sahibi
  kararının (A2, hero hover zemini `.12`) park edilmiş değeri, `--ol-duygusal`
  bir uyarı yorumunda adı geçen eşin yarısı, `--komur-90` paket şeridiyle
  birlikte döner. Yalnız `--komur-90`'ın bayat kullanım sayısı düzeltildi.
- **Token'ı olmayan dokuz krem alfası eklenmedi.** Dokuz yeni ad, rolü okunarak
  verilmeli ve `.28` iki ayrı rolde geçiyor; KARAR-FORMU D ile aynı turda yapılmalı.

## 18 Ağustos 2026: sahibinin üç kararı, aynı turda uygulandı

| Karar | Uygulama | Ölçüm |
|---|---|---|
| **Paket servis alınmıyor** | `konum.iletisim.whatsappAlt` iki dilde silindi, `IletisimSatiri`'nin `alt` prop'u opsiyonel oldu; manifestten `paket-ve-gel-al` karesi ve `FotoId` üyesi düştü; galeri sayısı on yediden on altıya döndü (dört dize, iki dil) | Cümle (`Paket sipariş de buradan alınır`) handoff'ta birebir yazılıydı, yani uydurma değildi; ama artık olgusal olarak yanlıştı ve KISITLAR'da olgusal doğruluk sert kural, tasarım sadakati yumuşak. Kalan iki satırın alt cümlesi duruyor. Ölçüldü: satır yükseklikleri 72 / 55 / 77px, üçü de 44px üstünde |
| **Sosyal kart `icon.svg` çiziminden üretilsin** | 180x180 `app/apple-icon.png` ve 1200x630 `public/sosyal-kart.png`; `lib/metadata.ts` `openGraph.images`, `twitter.card: summary_large_image`, `twitter.images` ve `metadataBase` taşıyor | Önce sıfır rotada `og:image` vardı. İki tuzak ölçüldü: (1) `app/opengraph-image.png` konvansiyonu bu repoda çalışmıyor, çünkü iki kök layout var ve `app/` kökündeki dosya rota gruplarına iliştirilmiyor; (2) `metadataBase` ayarlı değilken Next uyarı basıp etiketi hiç yazmıyor. İkisi çözülünce on iki rotanın hepsinde `og:image` mutlak URL, boyut ve `alt` ile birlikte. Kart markanın kendi öğeleriyle kuruldu: sayfa zemini, kor parıltısı, dört tane ve sitenin kendi Bricolage 800 wordmark'ı |
| **Dört yetim anahtar silinsin, `nav.gizlilik` dursun** | `ortak.cta.ara`, `ortak.satirlar.adresVeSaat`, `ortak.footer.sayfalarBaslik`, `ortak.footer.sosyal`, `ana.gece.sonNot` iki dilde silindi | Beşinin de okuyucusu yoktu ve her ziyaretçiye JS yükünde iniyorlardı. `ortak.nav.gizlilik` C4'e kadar duruyor. Parite testi geçiyor: 231'e 231 yaprak |
| **Krem token turu ertelendi** | Dokuz alfa ham bırakıldı | Sahibinin kararı: ayrı bir token turunda, KARAR-FORMU D'nin kalan iki maddesiyle birlikte |

### WhatsApp satırının alt cümlesi, aynı gün kapandı

Paket cümlesi kalkınca satır alt cümlesiz kalmıştı ve ritim bozuluyordu (72 / 55 / 77px).
**Sahibinin kararı, 18 Ağustos 2026:** yerine sözlüğün kendi onaylı CTA'sı
`ortak.cta.whatsapptanYaz` geldi ("WhatsApp'tan Yaz" / "Message on WhatsApp"). Yeni metin
yazılmadı ve KARAR-FORMU A10'da "çağıranı yok ama kalsın" diye duran anahtar bir yüzeye
kavuştu. `IletisimSatiri`'nin `alt` prop'u zorunluya geri döndü: üç satır da yeniden
alt cümle taşıdığı için opsiyonel dal çağıransız kalırdı.

Ölçüldü, 390px ve 1440px, iki dil: satırlar 72 / 77 / 77px, isabet yükseklikleri
72 / 78 / 78px, TR ve EN birebir aynı. Ölçüm sırasında bir yanlış alarm çıktı ve
düzeltildi: sayfa 900px kaydırılmışken telefon satırı 16px okunuyordu, satır tek tek
ortalanınca 72px çıktı; örten bir katman yok, sayı kaydırma konumunun artefaktıydı.

## 18 Ağustos 2026: şiş kilidi üst bara geldi

Sahibi üst bardaki logonun daha stilize ve şık olmasını istedi. Üst bar bugüne kadar
yer tutucu taşıyordu: zar rayı (8/5/4) artı tek satır "Ciğerci Bozo". Marka
paketinde 10 Ağustos'ta karara bağlanmış ama çizilmemiş bir kilit vardı
(`design_handoff_bozo_website/marka/01-Logo-Final-Karar.md`, "Şiş kilidi"); bu tur
onu çizdi ve üst bara koydu. Ölçüler kararın tablosundan birebir, dizilim sabit.

| Nerede | Değişiklik | Ölçüm |
|---|---|---|
| `lib/sis.ts`, `lib/sis.test.ts` | Şiş geometrisi tek yerde: yağ 0.6x, boşluk 0.43x, çubuk 0.13x, uç 1.2x, halka 0.7x, dizilim ciğer-yağ-ciğer-ciğer-yağ-ciğer. Yedi test oranları ve dizilimi kilitler | Canlı DOM'da yeniden hesaplandı: viewBox 101.10 x 10, taneler 10/6/10/10/6/10, aralık her yerde 4.3, çubuk 1.30 = halka çizgisi, taneler ve halka 5.00 eksenine ortalı |
| `components/ui/SisIsareti.tsx` | İşaret SVG, `currentColor` + yağ tanesi tangerine. Uç tabanı çubuğun iki katı (0.26x) ve 0.3x boğazla çubuğa iner: **çizim kararı**, kararda yok. Sebebi ölçüm: çubuk kalınlığından sivrilen iğne uç DPR 1'de görünmüyordu (ilk 4px'i 35 luminansın altında), bıçak uç okunuyor | 12px tanede çubuk 1.56px, köşeler 1.8 / 0.96px, 0-3px kuralının içinde. Üç motorda (Chromium, WebKit, Firefox) DPR 1 ve 2'de çubuk, uç ve halka görünür; küçük tane 7.2px'te kare kalıyor |
| `components/ui/MarkaKilidi.tsx` | Yatay kilit: solda işaret 12px tane, sağda iki satır Bricolage: "Ciğerci" 600 11.5px iz .2em krem-74, "Bozo" 800 28px. Üst barın iki varyantı ve 404 aynı bileşeni basar; `.marka::before` dokunma alanı kilidin kendisine taşındı, iki çağırandan silindi | Kilit 197.3 x 39.7 (masaüstü), 159.5 x 30.9 (390), 147.4 x 30.9 (360 ve altı). Eski kilit 206 (ana) / 195 (iç). Dokunma alanı 44px, `elementFromPoint` ile doğrulandı. Erişilebilir ad `link "Ciğerci Bozo"`, üç motorda; iki satır arasındaki boşluk düğümü yük taşımıyor, flex öğeleri bloklaştığı için ad zaten boşluklu |
| Aynı | İşaret kutu ortasına değil mürekkep ortasına: `translate: 0 -1.5px` (mobil -1px) | "Bozo" satır kutusu altında 3.7px alt boşluk taşıyor; ölçüldü, kutu ortası mürekkep ortasından 1.59px aşağıdaydı (mobil 1.10). Kararın "optik ortasına hizalanır" cümlesi mürekkep okundu |
| Aynı | İşaret 12px, 14 değil | 14px tane 220px kilit veriyor ve 961px'te TR menü barını 1px taşırıyordu (`.satir` max-content 865/865). 12'de kilit 197px: 961'de pay TR ana 34 > 43, EN ana 0 > 9, TR menü 12 > 10, hikaye/konum/galeri 100-136 |
| `content/{tr,en}/ortak.ts` | `marka.kategori: 'Ciğerci'` eklendi, `marka.kisa` ("Bozo") ilk okuyucusunu buldu | Parite testi geçiyor. Kategori satırı marka kitabının kendi terimi ("kategori satırındaki ğ ve ç") |
| `UstBar.module.css`, `HataSayfasi.module.css` | `.markaAd` ve varyant başına wordmark ölçüleri (23/21/17px), 360px altında rayı düşüren kural silindi | Mobil eşik artık YİRMİ ÜÇ media query (`MarkaKilidi.module.css` yirmi üçüncüsü). 320px'te kilit 147px, sağ grup dolgu kenarında biter (302/302) |
| Kontrast, "Ciğerci" krem-74 | Bulanık bar zemininde ölçüldü | 9.20:1 durağan, en kötü piksel 5.61:1 (menü, kaydırma 300, zemin 67/63/60); mobil en kötü 8.67:1 |

Denenip alınmayanlar: tek satır 23px ad + işaret (işaret süs gibi kalıyor, kilit hissi
zayıf); iğne uç (DPR 1'de kayboluyor); halka solda uç sağda (işaret yönünü kaybediyor);
tek renk (baskı hali, barda renkli seçildi). Kategori satırının rengi ve kilidin kendisi
sahibinin kararı, `KARAR-FORMU.md` F.

**Yan bulgu, logodan bağımsız:** `/en/menu/` barı 961-1039px arasında kendi içeriğine
sığmıyor ("From the Fire", "On the House", "Get Directions" iki satıra kırılıyor; iPad
yatay 1024 bu bandın içinde). Eski kilitle -68.6, yenisiyle -70.7px; 13 Ağustos'taki
eşik ölçümü yalnız TR sayfalarına bakmıştı. Kilidi küçülterek kapanmaz (70px), karar
sahibinin (F3).

## 18 Ağustos 2026 akşamı: animasyon kurgusu ve akışı turu

Sahibi ana sayfanın hareket kurgusunu ve akışını gözden geçirip iyileştirmeleri
uygulamamızı istedi. Yedi mercek (kurgu, sahne, kaydırma, mikro etkileşim, zamanlama,
erişim ve performans, mobil) `out/` derlemesini headless Playwright ile ölçtü; her
merceğin bulguları ayrı bir çürütme turundan geçti (kırk dokuz bulgu, dördü reddedildi,
sekizi sahibinin kararı). Reddedilenler listesindeki maddeler yeniden önerilmedi.
Aşağıdakiler ölçülüp uygulananlar; hepsi ayrı commit, sayı ve yöntem commit gövdesinde.

| Nerede | Değişiklik | Ölçüm |
|---|---|---|
| `Acilis.tsx`, `UstBar.tsx` | Hero kaydırma ipucu ve bardaki "Gece" çapası `CapaBaglantisi`'nden geçer | Dört sayfa içi çapadan ikisi tek karede zıplıyordu (1 scroll olayı), ikisi 600ms kayıyordu (28-30). 13 Ağustos turu yalnız `Buton` çapalarını bağlamıştı. Şimdi 19-70 olay, hash yazılıyor, azaltılmış harekette dördü de anında |
| `TaneDizilimi.module.css` | Hero rayının küçük tanesi opaklıkla değil `filter: brightness` ile nefes alır | .62 opaklıkta arkadaki krem çubuk tanenin içinden şerit gibi okunuyordu (gövde 159/108/22, şerit 247/194/103; döngünün yarısı). Parlaklıkla kare dolu kalır, aralık ve faz aynı |
| `MenuSatiri`, `Buton`, `MobilAksiyonBari`, `reset.css` ve altı modül daha | Bütün `:hover` kuralları `@media (hover: hover)` içinde; `-webkit-tap-highlight-color: transparent`; `Buton`, `IletisimSatiri` ve mobil bar `:active` basma durumu taşır | Dokunmada on dokuz hover kuralı dokunuştan sonra da yapışıyordu (satır .05 zemin, ikincil buton kenarlığı, orta düğme yükselmiş; 390 ve 1024 ölçüldü); basma geri bildirimi Chromium'un mavi parıltısıydı, palet dışı. Şimdi dokunuştan sonra hiçbir stil kalmıyor, basış hover renkleriyle anında, bırakış 0.15s |
| `KorKivilcimi.tsx` | Kıvılcımın yolu ekran boyuna bağlı (yüksekliğin %50-105'i, 5-12s) | 14-40 px/s x 4-10s en fazla 400px ediyordu; tohum nesli ölünce üst üç bant boştu (390 ve 1440, t=8s'den sonra 0). Şimdi t=20s'de 390'da [2,17,29,19,36], 1440'ta [5,34,92,158,50]; tane sayısı aynı |
| `Gece.tsx`, `Gece.module.css` | Ufuk koru bölümün kendi `::before`u, erit sarmalayıcısının çocuğu değil; yatağın 8s .62-1 nefesini alır | Erit'in kutusuna çözülünce bölümün dibinden 120px yukarıda bitiyor, erit'in kaydırma opaklığıyla kısılıyor ve dikiş kara kalıyordu (390 ve 1440). Bölümde 8 saniyede sıfır piksel değişiyordu; sayfada ateşin durduğu tek ekrandı |
| `VardiyaCizelgesi` | "şimdi HH:MM" etiketi mobilde rayın içinde kalır: `container-type: inline-size` + `cqi` ile sürekli kelepçe | 41px yarı etiket 24px yan dolgudan geniş: %5 altı ve %95 üstü ekran dışına taşıyordu (10:05'te 16px, 05:30'da 17.5px kesik; günde ~7 saat). İlk eşikli çözüm 12:39'da 35px atlıyordu; kelepçe 12:39 > 12:40 arası 1px |
| `AltBilgi.module.css`, `Cekmece.module.css` | Footer "Yol Tarifi Al" hover'da rengini korur; çekmecenin kapatma X'i `top:7px right:18px` | reset.css `a:hover` metni tek karede kreme çekiyordu, tire tangerine kalıyordu; tasarımda yalnız gap açılır. Kapatma kutusu onu açan hamburger'in 17.5px altına düşüyordu, şimdi merkezler 1.5px içinde |
| `tokens.css`, `BeadRay`, `MenuSatiri`, `KorSahnesi` | Ham 0.3s / 0.15s / 0.9s tokena bağlandı (`--gecis-orta`, `--gecis-hizli`, yeni `--gecis-yogunluk`); `--gecis-yerlesim` yorumu düzeltildi | Yorum on bir kullanım ve silinmiş bir padding-left geçişi sayıyordu; gerçek bir kullanım. Hesaplanan değerler aynı. AltBilgi'nin 0.18s'i handoff'un kendi değeri (Ana:363), tokena alınmadı |
| `KorSahnesi.module.css` | Azaltılmış harekette yoğunluk sarmalayıcılarının opaklık geçişi geri açık (`!important`, yalnız opacity) | KISITLAR "kararma izler" diyordu ama global kural geçişi de siliyordu: altı bölüm sınırında tam ekran parıltı tek karede %25-45 atlıyordu (.86 > .608). Şimdi kare başına en fazla 0.011. `CLAUDE.md` ve `KISITLAR.md` istisnayı kaydeder |
| `KorSahnesi.tsx`, `Bolum.tsx`, `AnimasyonluSayac.tsx` | Kor sarmalayıcıları nötr değerlerini inline taşır; erit'in ilk yazımı geçişsiz akıtılır; sayacın gözlemcisi ilk bildirimi varış saymaz | Yatak 80ms 1.0'da yanıp 0.9s'de .86'ya iniyor, azaltılmış harekette ölçek tek karede zıplıyordu; erit yeniden yükleme, hash ve geri dönüşte 3-13px kayıp kararıyordu (26 kare); ekrandaki sayaç 8 > 0 > 8 sayıyordu (134ms görünür, yavaş hatta 3s). Şimdi ilk boyama = hidrasyon sonrası |
| `DurumCipi`, `DurumAltMetni`, `Cekmece.tsx` | `durum === null` üçüncü durum: gri nokta + sözlüğün "Her gün 10:00 - 05:00" satırı; alt metin boş | Statik HTML ve ilk boyama günün 19 saatinde "Şu an kapalıyız" diyordu (Fast 3G 2.4s, Slow 3G 9.6s). Olgusal doğruluk sert kural. Yeni metin yok, satır her footer'da zaten var |
| `KapanisNotu` | İkinci satır mount öncesi de yerinde (boş, `min-height`) | Satır mount'ta gelince gün merdiveni 31px aşağı düşüyordu |
| `IlerlemeCubugu` | `width` yerine `transform: scaleX`, `transform-origin: left` | Sayfadaki tek yerleşim özelliği animasyonu, her kaydırma karesinde: 3.3s kaydırmada 184 > 30 layout. Gradyan kutuyla sıkışır, görüntü aynı |
| `AnimasyonluSayac` | `rootMargin: 0 0 -15%` | Telefonda sayım ekranın alt %20'sinde, yüzen barın altında başlayıp bitiyordu |
| `useGirneSaati`, `lib/saat.ts` | Tek modül düzeyi tıklayıcı, saniye başına hizalı, yalnız dakika ya da bayrak değişince yazar (`durumAyniMi`, üç test) | Dokuz bileşen dokuz interval kuruyor, saniyede dokuz render sıfır DOM değişimi üretiyordu |
| `Cekmece.module.css` | `.link[aria-current='page']` tangerine | Çekmecede bulunulan sayfa diğer üçüyle aynı renkti; masaüstü barı tangerine + alt çizgi basıyor |
| `VardiyaCizelgesi`, `lib/saat.ts` | Tik etiketleri kendi yüzdesinde (`saatYuzdesi`, iki test), ilk etiket raya yaslı; `space-between` gitti | Yedi etiket 18 saate yayılıyor, imleç 19 saatlik pencerede: "şimdi 22:00" tikinin 21-26px solundaydı. Şimdi imleç merkezi = etiket merkezi (698/698, mobil 240/240). UYGULAMA-NOTLARI 4'ten kayıtlı sapma |
| `CanliSaat` | Rakam hücresi görünmez "00" sözde öğesiyle iki tabular rakam genişliğinde; ölü `hayalet` boyu silindi | "--" yarım genişlikti: hidrasyonda iki nokta ve dakika 69px (mobil 16px) sağa atlıyor, mobil alt metni itiyordu. Şimdi SSR ve hidrasyon sonrası kolon x'i aynı (1031 / 63) |
| `Bolum.tsx` | Geçişsiz varış penceresi tek kare değil 250ms | Next geri/ileri dönüşte kaydırmayı mount'tan bir kare sonra geri yüklüyor; tek kare o durumu kaçırıyordu |
| `KorKivilcimi.tsx` | Sabit `fillStyle` + `globalAlpha` | Kare başına 240 rgba dizesi döngü maliyetinin dörtte üçüydü: 0.21 > 0.06 ms/kare (1440, DPR2). Piksel aynı; maske ve DPR tavanı dokunulmadı (katlanması piksel-birebir değil, GPU yolunda kazanç yok) |
| `lib/hareket.ts`, beş bileşen | `useHareketAzaltilmisMi()` (`useSyncExternalStore`, medya sorgusu `change`); `Bolum`, `KorKivilcimi`, `ImlecKoru`, `AnimasyonluSayac`, `BeadRay` efektleri tercihe bağlı | Tercih mount'ta bir kez okunuyordu: oturum içinde açılınca CSS duruyor, tuval (53 rAF/s), imleç ışığı ve erit oynamaya devam ediyordu. Ölçüldü, açıldıktan sonra: tuval silinmiş, ışık ve erit sabit, sayaç hedefte. Bedeli: hidrasyonda sunucu anlık görüntüsü `false`, döngü bir kare kurulup sökülüyor |

### Ölçülüp bilinçli uygulanmayanlar

- **Tek tıklayıcı (useGirneSaati) tutuldu, çürütücü "ölçülemez kazanç" dedi:** dokuz interval'in
  maliyeti 0.7 ms/s'nin altında ve dokuz saat zaten aynı milisaniyede çevriliyordu. Yine de
  kaldı: dakika değişmeden render üretmeyen `durumAyniMi` kapısı ve tek uyanış, elli satır
  test edilmiş kod. Görünür kazanç iddia edilmiyor.
- **Kıvılcım yoğunluk merdiveni (canvas `globalAlpha`)**: bulgunun başlığı düzeltilmiş ağaçta
  tutmuyor (Konum'da 143 güçlü piksel, hero'da 233); ham yatak formülü hero kıvılcımlarını %14
  kısardı. Sahibi isterse normalize edilmiş biçim (hero 1, konum .6) hazır.
- **Kor sahnesinin mobil yatağı %92 > %104**: 2-3 luminans seviyesi, telefonda okunmuyor; masaüstü
  H1 de aynı zeminde oturuyor, kompozisyon tasarımın kendisi.
- **Çekmece açılış solması ve `backdrop-filter` silme**: prototip "animasyon yok" diyor; bulanıklık
  ölçülemez (.96 zemin arkasını örtüyor) ama tasarım değeri, kare maliyeti ölçülemedi.
- **IlerlemeCubugu'nu cerceve'ye bağlamak**: iki dinleyici de aynı olaydan `rafKisitla` ile
  akıyor, aynı karede güncelleniyorlar; kazanç ölçülemez.

### Reddedildi (bu tur)

| Öneri | Neden |
|---|---|
| Boncuk rayına hover rengi | Tasarım rayı iki durumla çiziyor (aktif/pasif), imleç zaten `pointer`; iki çürütücü de "genel arayüz cilası, marka hikayesi değil" dedi |
| Çekmeceye 160ms açılış solması | Mobil prototip açık yazıyor: açılış/kapanış animasyonu yok; anlık kaplama bir durum değişimi, takılma değil |
| Footer gap geçişini 0.18'den 0.2'ye tokena almak | 0.18 handoff'un kendi değeri (Ana:363) |
| Duman puflarını güçlendirmek ya da silmek | En parlak fazda +8/255 (mobil +4), .30'a çıkarınca +16/255 ve hâlâ duman gibi okunmuyor; Y3 tam güçte gri leke okuduğunu kaydetmişti. Handoff'un kendi değerleri, kare maliyeti ölçülemiyor: olduğu gibi kalıyor, bu satır bir sonraki turun opaklığı artırmasın diye burada |

### Öneri, karar bekliyor (F maddeleri `KARAR-FORMU.md`'de)

Mobil eylem barının 120-240px kapısı (gerekçesi aynı gün silinen hero butonlarıydı, ilk
ekranda tek eylem yok); mobil bölüm dolguları (`--bolum-dikey` 120, prototip 34-48);
Ocaktan satırının 20px kayması (UYGULAMA-NOTLARI 3 ile 12 Ağustos'taki sahibinin
gözlemi çelişiyor); Gece ufuk korunun gücü; kor yoğunluğunun bölüm merkezinde basamak mı, iki
merkez arasında rampa mı olacağı; gün merdiveninin imleç ölçeği (.3, notun değeri; kurgu
merceği yatağın .78'ini öneriyor); mobilde kor eğrisi (prototipin U eğrisi mi, masaüstü
merdiveni mi).

## 18 Ağustos 2026 gecesi: F1 verildi, kilit her yerde

Sahibi şiş kilidini onayladı ve ikon ile alt bilginin aynı çizimden türemesini istedi.

| Nerede | Değişiklik | Ölçüm |
|---|---|---|
| `app/icon.svg` | Merdivenin 16px basamağı: iki ciğer tanesi, krem, zemin `#0A0807`; oranlar `lib/sis.ts` (tane 1x, aralık .43x, köşe .15x) | Eski dört tane yanlış dizilimdeydi (ciğer-yağ-yağ-ciğer). 32 viewBox, 200 |
| `app/apple-icon.png` | 40px basamağı: ciğer-yağ-ciğer, uç ve sap yok, 180x180 | Headless ekran görüntüsü, PNG 1.4K |
| `public/sosyal-kart.png` | Tam kilit (işaret + iki satır kelime) kor parıltılı zeminde, 1200x630 | `lib/metadata.ts` aynı yolu bildiriyor, 200 |
| `AltBilgiTam.tsx`, `MarkaKilidi` | Kararın "sadece kelime" varyantı (`sadeceKelime`, 11/24, işaretsiz); footer'ın 9/5/6 rayı ve 20px tek satır adı kalktı | 01-Logo-Final-Karar "Kilit sistemi: sadece kelime ... alt bilgi". Alt bilgi kilidi 55x35, ana sayfaya bağlantı |

## 18 Ağustos 2026 gecesi: F2-F10 kararları uygulandı

| Karar | Uygulama | Ölçüm |
|---|---|---|
| F3 (a) eşik 1040 | Yirmi dört `max-width` sorgusu ve `FotoYuvasi` `sizes` birlikte 960 > 1040 | 1041'de barlar sığıyor: TR ana 115, EN ana 81, TR menü 82, EN menü 1, EN konum 172px pay; 1040'ta hamburger. 961-1039 telefon düzeni alır. EN menünün 1px payı ince: nav etiketleri kısalırsa açılır |
| F4 (a) bar sıfırdan | `MobilAksiyonBari.module.css` `@supports` bloğu ve `barGirisi` silindi | 390'da y=0: bar 776'da, opaklık 1, hero içeriği 476'da bitiyor, çakışma yok |
| F5 (a) mobil dolgu | `tokens.css` 1040 altında `--bolum-dikey: 56px` | 390: bölüm boşlukları 168/169/172/240/240/240 > 102/106/108/112/112/112, sayfa 6701 > 6076px |
| F6 (a) kayma yok | `MenuSatiri` hover yalnız .05 zemin; transform ve mobil `transform:none` kalktı | Hover'da transform none; UYGULAMA-NOTLARI 3'ten kayıtlı sapma, 12 Ağustos gözlemiyle uyumlu |
| F9 (b) rampa | `lib/cerceve.ts` yoğunluk iki komşu merkez arasında ağırlıklı ortalama; aktif bölüm en yakın kalır | 1440, 0-800px kaydırma: .86 / .795 / .731 / .666 / .606; önce 390'da tek basamak .86 > .608 |
| F10 (c) merdiven | `GunMerdiveni` üç satır merkezini ölçer, imleci aralarında parça parça çevirir | 21:00'de imleç merkezi 443.3 = satır merkezi 443.3 (önce 7.8px altta) |
| F2, F7, F8 (a) | Değişiklik yok, karar kayda geçti | |

## 18 Ağustos 2026 gecesi: çekmece zenginleştirme turu (sahibinin A kararı)

Sahibi hamburger çekmecesinin "içeriğinin zenginleşmesini, uçtan uca ele alınmasını"
istedi. Üç yön gerçek font ve renklerle 390x844'te gösterildi: A tam sayfa editoryal,
B kor paneli (iki zemin, kare karolar), C üst perde (alt bar görünür kalır). Sahibi A'yı
seçti ve uygulama tasarımını onayladı. **Çekmecenin kaynağı artık `Mobil Prototip.dc.html`
195-213 değil, bu kayıt;** prototipten kalan değerler (.96 zemin, 6px bulanıklık, 700
34px/1.3, .12 çizgi, sağ üst kapatma) aynen duruyor. Bütün metinler `ortak.*`'tan, yeni
metin yok. Ölçümler `out/` üstünde headless (390/430/360/320/768/1024, yatay 844x390).

| Nerede | Değişiklik | Ölçüm, gerekçe |
|---|---|---|
| Üst satır | Çekmecenin kendi satırı: `MarkaKilidi` + `DilAnahtari` + X, barın mobil satırının ikizi (58px, 0 18px, .09 çizgi, sağ grup 14) | Önce açıkken marka ve dil çekmecenin altında kalıyordu (z 80 > 60), 390'da 15 hedefin ikisi ancak kapatınca erişilirdi. X hamburgerin tam yerinde, çizgileri oradan X'e döner |
| Sıra numarası | 01-04, tabular Bricolage 12px `--krem-50`, `aria-hidden`; aktif satırda tangerine | Bağlantı adı ekran okuyucuda yalnız sayfa adı. Numara + 14px aralık = 36px, alt çapalar bu hizada başlar |
| Alt çapalar | Menü'nün altında Ocaktan / İkramlar / İçecekler; `cekmeceLinkleri()` artık `altlar` taşır, menü barının çapalarından türer (`kabuk.test`: 3 test). Bulunulan sayfada `CapaBaglantisi` (`#ikramlar`), başka sayfadan `/menu/#ikramlar` | 1040 altında üç çapa hiçbir yerde yoktu. Ölçüldü: /menu'de #ikramlar 4132px'e kaydırdı ve çekmece kapandı; ana sayfadan #icecekler `/menu/#icecekler` 5592'ye indi. Çip 33.5px görünür, `::after` ile 45.5px, pay satırın kendi dolgusunda |
| Durum bloğu | `DurumCipi` (kucuk) + `DurumAltMetni` + `CanliSaat` yeni `cekmece` boyu (40px/800) | Çekmecenin kendi durum satırı ve saat/alkolsüz notu kalktı, üç bileşen paylaşılıyor; `durum === null` dalı çipin içinde korunuyor (kapalı basmıyor). 320'de saat çipin altına sarar |
| Adres ve saat | Pin + `adresKisa` yol tarifi bağlantısı (metin 20px, `::after` 44px), yeni `SaatIkon` + `saatlerGunluk` | Konum bilgisi barın "Yol Tarifi" ikonunun ötesinde okunur oldu |
| CTA'lar | `Buton` md, tam genişlik: birincil "Yol Tarifi Al", ikincil "WhatsApp'tan Yaz" (`whatsapptanYaz` ilk buton yüzeyi; Konum satırının alt cümlesinden sonra ikinci kullanım) | Barın üç eylemi çekmece açıkken örtülüyor (z 80 > 70, `elementFromPoint` barı görmüyor); eylemler içeride |
| Ayak | Instagram, Telefon, sağda `alkolsuzKisa` | Alt bilginin iletişim üçlüsüyle aynı; barın "telefon çıktı" kararı bara özeldi (13 Ağustos), alt bilgi telefonu taşımaya devam ediyordu |
| Kapanma | Kapsayıcıda tıklama delegasyonu: her `a[href]` çekmeceyi kapatır | Ölçüldü: /menu'de "Menü" ve ana sayfada kilit aynı rotaya gidiyor, sayfa yeniden mount olmuyor ve çekmece açık kalıyordu; şimdi kapanıyor, `body.overflow` geri geliyor |
| Hareket | 220ms solma, satırlar 60 + 45n ms basamaklı yükseliş (10px), alt blok 260ms, X 260ms | Animasyon turunun "160ms açılış solması reddedildi" satırı sahibinin bu kararıyla tersine döndü: sahibi hareketi tasarımın parçası olarak gördü ve onayladı. Azaltılmış harekette `getAnimations` 0, ilk satır opaklığı 1 |
| Ölçek | `min-height: 800px` satır 38px/12; `max-width: 360px` 30px, gövde 20 / blok 16 aralık | 390x844 gezinme-durum boşluğu 130 > 81px, 430x932 218 > 169; 360x740 kayma 12 > 0; 320x568 276px kayar (kabul, gövde `overflow-y: auto`) |
| Yatay | 700px+ ve yatay: iki kolon (gezinme sol, durum + eylemler sağ, sağ en çok 420) | 844x390 tek kolon 364px kaydırıyordu, şimdi 29; 1024x768 sıfır |
| Token | `--panel-96` (çekmece zemini) | Ham .96 tek yerdeydi; KISITLAR "yeni alfa = yeni token" |
| `styles/animasyon.test.ts` | Katmanlara bölmeden önce fonksiyon çağrıları düşürülür | `cubic-bezier(.2,.7,.2,1)` virgülleri sahte ad üretiyordu; testin kendi yorumu zaten bu sırayı yazıyordu |

Açık kalan: "Ana Sayfa" satırı yine yok (kilit ana sayfaya gider; IYILESTIRMELER:57 kaydı
geçerli); ana sayfanın "Gece" çapası çekmecede yüzey bulmadı (menü çapaları gibi türetmek için
listede bir "ana" satırı gerekir, o da sahibinin kararı).

## 18 Ağustos 2026 gecesi: WhatsApp ve Instagram işaretleri kendi renginde

Sahibi tanınırlık için sordu ("algıyı yakalamak"); değerlendirme ve karar aynı gece.

| Nerede | Değişiklik | Gerekçe, ölçüm |
|---|---|---|
| `Ikonlar.tsx` WhatsAppIkon | Lucide `MessageCircle` yerine gerçek WhatsApp glifi (simple-icons, CC0), dolgu `--marka-whatsapp` #25D366 | Genel balonu yeşile boyamak WhatsApp yapmaz; tanınırlık işaretin şeklinden gelir. 13 Ağustos kaydı "marka işareti şart görülürse geri alınabilir" diyordu, alındı. Yeşil #0A0807 üstünde 10.4:1 |
| `Ikonlar.tsx` InstagramIkon | Aynı lucide-static çizgi geometrisi, çizgi Instagram gradyanı (`--marka-instagram-1..5`, `userSpaceOnUse`, `useId`) | Kutuya bağlı gradyan sıfır genişlikteki nokta çizgisinde boyamıyor; sayfada birden çok işaret olduğu için kimlik `useId` |
| Palet kuralı | "Başka renk ekleme" listesine tek istisna: üçüncü taraf markaları kendi renginde, yalnız `Ikonlar.tsx` içinde | Yerler: yüzen bar, çekmece (CTA + ayak), alt bilgi, konum iletişim satırları. Kor zemin üstünde WhatsApp yok, yeşil hep koyu zeminde |

## 18 Ağustos 2026 gecesi: çekmece çürütme turu

Altı mercek (görsel, erişilebilirlik, kod, metin, hareket, davranış) artı altı çürütücü;
41 bulgunun 33'ü doğrulandı, 7'si düşürüldü, 1'i çürütüldü. Uygulananlar:

| Bulgu | Uygulama | Ölçüm |
|---|---|---|
| Üst satır ikiz değildi | Ana sayfada rayın 2px payı (`.rayPayi`), gece şeridi olan rotalarda `GeceSeridi` çekmecenin içinde de basılır | Önce: ana sayfada kilit 15 > 13 (2px), 01:00-05:00 arası hikaye/galeri/gizlilikte 25.5px sıçrama; şimdi 0 |
| Saat 4.5px yukarıda asılı | `.durum { align-items: last baseline }`, flex-end yedek | Saat taban çizgisi alt cümlenin taban çizgisinde |
| İki kolon yalnız yatayda | `min-width: 700px` (yön şartı kalktı) | 768x1024: 720px'lik CTA ve 261px boşluk yerine iki kolon |
| iPhone SE sınıfı kaydırıyordu | `max-height: 700px` basamağı: satır 30/8, aralıklar 18/12, CTA dolgusu 12 | 375x667 TR/EN ve 360x640 ölçümü aşağıda |
| EN çip satırı 375'te sarıyordu | `max-width: 400px`: çip 13px, 9px 10px dolgu | 306px istek > 284px, 291 var |
| Çip dokunma payları biniyordu | `.altlar` satır aralığı 8 > 12 | İki 45.5px alan artık kesişmiyor |
| Çipler alttaki çizgiye yakındı | `.altlar` dolgusu 8/14 > 2/18 | Yakınlık: sayfa adına 16, çizgiye 19 |
| Sekme sızıntısı | Odak kapsayıcının dışındayken Tab ilk/son öğeye çekilir | Metne dokunup Tab: önce arkadaki footer'a gidiyor ve kilitli sayfayı kaydırıyordu |
| Çapadan kapanınca odak | Hedef bölüm `tabIndex={-1}`, kapanışta `focus({preventScroll})`; ötekilerde odak hamburgere | Odak eylemi izler (WCAG 2.4.3); `section[tabindex]` halkası main gibi kapalı |
| Aynı rota bağlantısı | Bulunulan sayfanın bağlantısı (Menü'de Menü, ana sayfada kilit) başa kaydırıp kapatır | Önce yalnız kapanıyordu, tangerine bağlantı ölü dokunuş gibi okunuyordu |
| Kapanış anlıktı | 150ms solma (`useKapanisSolmasi`, `.kapaniyor` + `inert`), azaltılmış harekette 0 | Giriş 680ms basamaklıyken kapanış tek karede kesiyordu |
| X dönüşü görünmüyordu | X animasyonu 120ms gecikmeli, çizgiler 22 > 20px (hamburgerle aynı) | Dönüşün %85'i perde .6 opaklığın altındayken oluyordu |
| Bar örtülüyordu | `body[data-cekmece]` iken bar `visibility: hidden` | Kor düğme .96 zeminden +7/255 sızıyordu |
| Kaydırma zinciri | `overscroll-behavior: contain` `.kap`tan gerçek kaydırıcı `.govde`ye | `.kap` kaydırmıyor, bildirim etkisizdi |
| Kapalıyken çip uzundu | `DurumCipi` `kisaKapali` ("Şu an kapalıyız"), `canli={false}` (aria-live yok) | 390'da uzun cümle saati alt satıra itiyor, açılışta çift duyuru çıkıyordu |
| Nav listesi | `ul > li`, Menü'nün altında iç `ul` | Ekran okuyucu "liste, 4 öğe" ve "liste, 3 öğe" duyurur |
| Ayakta boş davranış | Instagram/Telefon yoksa alt bilgideki gibi bağlantısız etiket | Aynı üç iletişimin iki kabukta farklı boş davranışı vardı |
| Meta hizası | İkon 16 + aralık 20 = 36: adres ve saat metni sayfa adlarıyla aynı sütunda | |
| Tokenlar | `--cizgi-sac` (.09, bar + telif şeridi + çekmece), `--gecis-egri` (menü kartı, imleç koru, çekmece), `instagramUrl()` (dört çağıran) | Ham değer ve tekrar eden kurulum tek yere indi |
| Kod | `AltBlok` 55 > 40 satır (`Ayak`, `IletisimOgesi` ayrıldı), ölü `.not`/`.durumSol` bildirimleri silindi, yorumlar kısaldı | |

Uygulanmayan, sahibine: `.96` zeminin bulanıklığı 6 > 12-16px (arkadaki başlık metni tam
telefon boşluklarında +5/255 hayalet veriyor; prototipin değeri, ölçülebilir ama tat kararı);
"Menüyü aç/kapat" etiketlerini "Gezinmeyi aç/kapat" yapmak (arayüz metni; düşürüldü);
1040 eşiğinden geçince çekmeceyi kapatmak (zararsız).

## 18 Ağustos 2026 gecesi: menü sayfası telefonda satır düzenine geçti

Sahibi menü sayfasının mobil görünümünü istedi. Menü sayfasının mobil tasarımı yok
(prototip: "Sırada menü sayfası var"); tek kural prototipin "Menü listesi kart değil
satır" notu. Bugün ve öneri 390x844'te yan yana gösterildi, sahibi iki kararı verdi:
**1A** fotoğraf gelene kadar telefonda boş plaka basılmaz (dosya tanımlanınca kendiliğinden
döner; fotoğraflar açılışla geliyor), **2A** tam fiyat adın hizasında, Yarım ve Dürüm ikinci
satırda. Yalnız 1040 altı değişti; masaüstü kartları ve plakaları birebir aynı (ölçüldü 1441
ve 1440: 9 plaka görünür, hero 172, çip yok).

| Nerede | Değişiklik | Ölçüm (390x844, TR) |
|---|---|---|
| `Acilis` | Üst dolgu 172 > 110 (58 bar + prototipin 52'si); H1'in altında Ocaktan / İkramlar / İçecekler atlama çipleri (`ustBarVaryanti('menu')` çapaları, çekmece çipiyle aynı çizim, 45.5px dokunma). Ölü `.notKarti` CSS'i silindi | Bar ile çip arası 114 > 52px; İçecekler'e 6,6 > 2,4 ekran |
| `UrunKarti` | Aynı DOM, 1040 altında satır: indeks 20px sol sütun, ad 19px + tam fiyat (`anaFiyat`, masaüstünde `display:none`) aynı hizada, açıklama 13px, ölçü listesi ince ikinci satır; üçlü ray gizli; fotoğraf varsa 72px kare sağda, yoksa plaka yok (`FotoYuvasi bosMobildeGizli`) | Kart 520 > satır ~120px; Ocaktan 3885 > 1032px |
| `ImzaPaneli` | Panel değil listenin ilk satırı: indeks + "imza ürün", ad 22px + fiyat, spec çipleri, ölçü satırı; spread plakası fotoğraf varsa 200px yatay kadraj | Panel 24-38px dolgulu kutuydu |
| `OlcuSatirlari` | 1040 altında ilk satır (Tam) gizli, Yarım ve Dürüm yan yana 13px | 3 satır 94px > 1 satır 20px |
| `OzelSerit` | Fiyat adın taban çizgisinde sağda (`nowrap` + `baseline`) | Fiyat 468px altında sola düşüyordu |
| `Ikramlar` | İki kart yan yana, plakasız (fotoğraf varsa 90px şerit üstte), 15px ad, 13px açıklama; kümeler sıkı | Kart 355 > ~120px; bölüm 1407 > 678px |
| `Icecekler` | Plaka fotoğraf varsa 160px, satırlar 13px dolgu; iki sütun denendi, sığmıyor | 1307 > 911px |
| 320px taşması | `FotoYuvasi .spread/.icecek`, `Icecekler .kolon`, `Ocaktan .imzaPaneli` `min-width: min(Xpx, 100%)` | `scrollWidth` 324 > 320 |
| Toplam | Sayfa 7815 > 3784px (9,3 > 4,5 ekran); ilk fiyat 392px aşağıda ve ilk ekranın dışındaydı, şimdi 452'de ilk ekranda; EN 3926 | |

`FotoYuvasi.bosMobildeGizli` çağıranın kararıdır, biçimin değil: galeri ızgarası aynı `kart`
biçimini boş kareleri saymak için kullanır ve gizlemez.

Fotoğraflarla ölçüldü (geçici dosya, commit'lenmedi): satırda 72px kare, imza satırında 200px
spread, ikramda 90px şerit, içeceklerde 160px plaka; hepsi yerine oturuyor.

## 19 Ağustos 2026: lakap bölümü, Bozo adının hikayesi

Sahibi adın nereden geldiğini kendi yazdığı bir anlatımla gönderdi. Hikaye sayfasının
portre kartı zaten "hikayenin tamamı burada kendi ağzından anlatılacak" diye söz veriyordu;
bölüm o sözü karşılıyor ve kart notu artık aşağıyı işaret ediyor. Bu, envanterden gelmeyen
ilk metin bloğu: kaynak sahibin kendisi, kayıt burada (CLAUDE.md > Copy rules'a istisna yazıldı).

**Yayımlanan örnekler ve gerekçesi.** Anlatım dokuz örnek taşıyordu; beşi basıldı
(Ahmet > Ahmo, Mustafa > Mıço, Ali > Alo, Kemal > artist Kemo, İsmail > culuk İsmo), dördü
basılmadı: kişiyi bedeniyle ya da zekasıyla etiketleyenler (biri kadının zayıflığı, biri
kilosu, biri zeka, biri korkaklık üstüne). Gerekçe tek cümleyle: bir lokantanın hikaye
sayfası ağırlama jestidir, kimseyi küçülten bir örnek o jesti bozar; kuralın kendisi
(yakınlık adı kısaltır) kalan beş örnekle eksiksiz anlatılıyor ve bölüm zaten tek kişiyi
adlandırıyor, o da sahibinin kendisi. Bu bir kültür kaydı değil, marka metnidir.

**Metin.** Cümleler sahibinin kendi ifadeleriyle kuruldu, yalnız noktalama ve akış
düzenlendi; iki bağlayıcı cümle eklendi ("Adı tam söylemek mesafe koymaktır", "Ya da ada bir
sıfat yapışır: kişi nasılsa öyle çağrılır"), ikisi de anlatımın kendi mantığının kısaltması.
Kapanış birinci tekilde ve gerçek bir alıntı olduğu için `<blockquote>` + `<footer>` imza
(`NotBlogu` alıntı değildir, o yüzden kullanılmadı); imza `isletme.sahip`ten gelir.
İngilizcesi çeviri değil aynı ses: adlar Türkçe kalır, kural İngilizce anlatılır, sıfatın
karşılığı ("yakışıklıya" > "for the handsome one") sözlükten gelir.

| Nerede | Ne | Ölçüm |
|---|---|---|
| `content/lakaplar.ts` | Beş çift tek veri dosyasında (`ad`, `lakap`, `tur`); adlar dile göre değişmediği için sözlükte değil, `urunler.ts` deseni | Üç test: kimlikler benzersiz, sıfatlı olanların notu iki dilde var, kısaltmaların notu yok |
| `content/*/hikaye.ts` | `lakap` bloğu (başlık, giriş, iki etiket ve notu, tanım, kapanış, `notlar`); `portre.kartNotu` yer tutucu sözden aşağıyı işaret eden satıra döndü | 119 > 122 test |
| `components/sayfa/hikaye/Lakap.tsx` | Kural, iki kutu (menü sayfasının ikram kümeleriyle aynı çizim), tanım satırı, imzalı alıntı | Bölüm 390'da 1066px, 1440'ta 689px; sayfa 3554 > 4498px (390) |
| Çiftler | `dt` sabit 76px sütun: tireler alt alta, lakaplar aynı hizada başlar. Çift satırı `nowrap`, sarma karşılığın içinde | 320 EN dahil her genişlikte ad sağ ucu 125, lakap sol ucu 137 |
| Kontrast | Ad ve sıfat notu 5.89:1, imza 8.24:1 | AA üstü |

## 19 Ağustos 2026: sahibinin adı sitede "Bozo Çağlar"

Sahibi imzanın "Engin Çağlar" değil "Bozo Çağlar" olmasını istedi: çocukluğundan beri
öyle seslenildiği için ad da o olsun. Uygulandı, tek bir yer korunarak.

**Korunan yer ve gerekçesi.** Lakabın lakap olduğunu gösteren tek şey nüfustaki addır;
o cümle de silinirse "Bozo" yeniden bir marka adına döner ve sayfanın kendi başlığı
("Bozo bir marka ismi değil, bir insan") dayanaksız kalır. Bu yüzden nüfustaki ad iki
açıklama cümlesinde duruyor, kalan her yerde sesleniş kullanılıyor. Sayfa artık şu sırayla
okunuyor: üstyazı "Bozo Çağlar" > başlık "marka ismi değil" > "Nüfusta Engin Çağlar yazar,
ona yıllardır Bozo denir" > lakap bölümü > kendi cümlesinin altında imza "Bozo Çağlar".
İmza böylece sayfanın kazandığı bir şey oluyor.

| Nerede | Ne oldu |
|---|---|
| `isletme.sahip` | `Bozo Çağlar`; alanın yorumu nüfustaki adın nerede durduğunu yazıyor. JSON-LD bu alanı kullanmıyor, tek tüketici lakap bölümünün imzası |
| Üstyazılar (ana Bozo bölümü, hikaye hero) | `Engin Çağlar, her gün ocağın başında` > `Bozo Çağlar, her gün ocağın başında` |
| Ana ve hikaye girişi | "Urfalı Engin Çağlar'a yıllardır böyle seslenilir" > "Nüfusta Engin Çağlar yazar; Urfa'da da burada da ona yıllardır Bozo denir." Cümle artık iki adı da taşıyor ve lakap bölümünü kuruyor |
| Alt bilgi notu | **Kaldırıldı** (sahibi, aynı gece: "footer sol altta buna vurgu yapmamız gerekmiyor, devrik duruyor; hikaye bölümünde iyi bir anlatım yeterli"). `footer.isimNotu` iki sözlükten, `AltBilgiTam`'dan ve `.isimNotu` kuralından düştü; marka kolonu kilit + tanım satırında kaldı. Aynı açıklamayı iki yüzeyde tekrar etmek hikayeyi özet gibi gösteriyordu |
| `CLAUDE.md` | Kural yazıldı: hangi adın nerede geçtiği, "düzeltilmemesi" gerektiğiyle birlikte |

## 19 Ağustos 2026: sahibinin beş geri bildirimi (WhatsApp notları)

| Not | Uygulama | Gerekçe |
|---|---|---|
| "Ocaktan değil de Ocakbaşı; ocaktan yazınca Ülkü Ocakları aklıma geliyor" | Bölüm etiketi iki sayfada `Ocakbaşı`, çapa `#ocakbasi`, sözlük anahtarı `ocakbasi`, bileşenler `Ocakbasi.tsx` | Marka güvenliği: "Ocaktan" ayrılma hali olarak siyasi bir çağrışım taşıyor. `Ocakbaşı` zaten misafirin kullandığı kategori sözcüğü, "ocak" da yerinde kalıyor. İngilizce `From the Fire` değişmedi: çağrışım Türkçeye özgü. Menü spotu da düzeltildi: "Hepsi ocaktan çıkar" > "Hepsi tek ocakta pişer" |
| "8 ikram" (ana sayfa "iki ikram" diyordu) | `Beş ürün, sekiz ikram: sofra kurulu gelir` / `Five dishes, eight on the house: the table comes set` | Veri sekiz taşıyor (iki plakalı ikram + üç kümede altı kalem); metin yalnız plakalıları sayıyordu. "hepsi tek ocakta" iddiası da kalktı: ikramların çoğu ocaktan çıkmıyor. `ikram_sayisi_metindekiSayiylaAyni` testi sayıyı üç metinde veriye bağladı |
| Dalak: "ikram gibi anlaşılıyor" | "Ciğerin yanına, iri doğranmış" > "Urfa sakatat hattının klasiği; iri doğranır" (ana ve menü, iki dil) | Açıklama ürünü ciğerin yanındaki bir eklenti gibi tanıtıyordu; artık kendi başına bir kalem |
| Yürek: "geç pişecek izlenimi veriyor" | "korun üstünde en uzun kalan tane" > "ısırınca dağılmayan tane" (`the cut that holds its bite`) | Aynı gerçeğin (sıkı doku) bekleme değil doku vaadi olarak söylenmesi |
| Tavuk: "kalçadan belki misafirleri itebilir, but'tan yazsak" | "Kalçadan" > "Buttan" (Türkçe; İngilizcesi zaten `From the thigh` idi) | Kasap dilinde doğru olan sözcük ve iştah açıcı olan da o |

## 20 Ağustos 2026: rozet logo denemesi, üst bar ortalandı

Sahibinin kararı: rozet logo (`CigerciBozo-Logo-6`) şiş kilidinin yerine birincil marka
olur, site koyu kalır. Kapsam bilerek dar tutuldu: **yalnız üst bar ve ana sayfa hero'su**,
geri dönüş tek komut olsun diye ayrı dalda (`deneme/rozet-logo`). Şiş kilidi silinmedi;
`lib/sis.ts`, `SisIsareti` ve `MarkaKilidi` yerinde duruyor ve mobilde hâlâ basılıyor.

### Pozitif dosya koyu zeminde kullanılamaz, ölçüldü

Gelen `Logo-6`'da kelime markası diskin DIŞINA taşıyor ve `Ciğerci` lacivert (`#001020`).
O yüzden sayfanın zemininin (`#0A0807`) doğrudan üstüne biniyor: kontrast **1.04:1**, yani
markanın ilk kelimesi görünmüyor. `Bozo`'nun kırmızısı (`#901010`) da **2.16:1**, grafik
öğe için gereken 3:1'in altında. Sorun bardaki her ölçüde var, çünkü ölçüyle değil renkle
ilgili. Sahibi aynı gün dişi versiyonu (`CigerciBozo-Logo-6-Koyu-2`) gönderdi: `Ciğerci`
krem, halkalarda altın kontur. Varlık ondan üretildi. Öncesinde denenen otomatik renk
değişimi bırakıldı: daireyi yanlış merkeze oturttuğu için `Ciğerci`'nin ortası lacivert,
uçları krem kalıyordu.

| Ölçü | Değer |
|---|---|
| `Ciğerci` (#001020) / `--zemin` | 1.04:1 |
| `Bozo` (#901010) / `--zemin` | 2.16:1 |
| Dişi versiyonun diski (#000000) / `--zemin` | 1.05:1, yani disk kenarı görünmüyor: istenen |

### Rozetin indirgeme merdiveni

Kilitli kararın (`01-Logo-Final-Karar.md`) merdiveni şiş kilidine ait; rozetin böyle bir
merdiveni yok, bu yüzden ölçüldü (48-220px, sayfanın kendi zemininde):

- **76px altı:** `Ciğerci` son harfini kaybediyor, portre lekeye dönüyor
- **110px altı:** yay metni (`Urfa Usulü`, `Ocak ve Sofra`) hiç okunmuyor, doku olarak kalıyor
- **150px ve üstü:** yay metni dahil her şey okunuyor

Bardaki ölçü buradan seçildi: ana varyant 80px, iç varyant 72px. Bar boyu buna göre
**84 > 104px** (ana) ve **78 > 96px** (iç). Yay metni barda bilerek doku: rozetin üç sözü
hero'da okunur boyda tekrarlanıyor.

### Ortalanmış üç kolon

`.satir` flex `space-between`'ten `grid-template-columns: 1fr auto 1fr`'e geçti. Gerekçe
ölçülebilir: sağ grup CTA butonunu taşıdığı için sol gruptan ağır, `space-between` rozeti
iki grubun ortasına koyar ve rozet sayfanın ortasından kayardı. `1fr auto 1fr` rozeti yan
grupların genişliğinden bağımsız olarak sayfaya ortalar. Dil anahtarı dengeyi kurmak için
sağ gruptan sol gruba taşındı; nav ikiye bölünüyor, tek sayıda öğede fazlalık sola gidiyor.

En dar masaüstü bandı ve en uzun nav ile sınandı (**1041px, EN menü barı**, yani F3'te
kırılan bant): bar taşması **0**, rozet merkezi **520**, sayfa merkezi **521**.

### Mobil dokunulmadı

Rozet 58px'lik mobil bara sığmıyor. Barı büyütmek `Cekmece.module.css:36`'yı da açardı
(çekmecenin üst satırı barın ikizi) ve o düzen 18 Ağustos'ta onaylanmıştı. Bunun yerine
1040px altında kilidin **sadece kelime** varyantına düşülüyor: kilit sisteminde zaten
tanımlı ("dar tabela, alt bilgi") ve kodda zaten vardı. Mobil bar 58px, düzeni ve boşlukları
aynı kaldı.

### Hero

| Ne | Ölçü / gerekçe |
|---|---|
| Überline `Urfa Usulü · Ocak ve Sofra · Girne` | Rozetin kendi üç sözü, logodan birebir. Barda 110px altında okunmadığı için hero okunur boyda tekrarlıyor |
| İngilizcesi `Urfa Style · From the Fire · Kyrenia` | Üç parça da sitenin mevcut terminolojisi (`content/en/ortak.ts`, `nav.ocakbasi`, `saatEtiketi`). Yeni pazarlama metni uydurulmadı |
| Üst dolgu 120 > 140px (yalnız 1041px üstü) | Bar 20px büyüdü; hero'nun barla arasındaki 36px'lik pay korunsun diye |
| Überline mobilde 13px/0.18em > 11px/0.14em | 390px'te satır 354px istiyordu, kolon 342px: `Girne` alt satıra düşüyordu |

### Varlık: aynı gün raster'dan vektöre

Önce `rozet.webp` (304x320, 28 KB) kullanıldı. Aynı akşam sahibi vektörü gönderdi
(`BozoLogo.svg`), varlık ona geçti ve raster silindi. Vektör her ölçüde kazanıyor:

| | WebP 320px | SVG |
|---|---|---|
| Hat üstünde | 28 KB | **17 KB** (brotli; ham 52 KB, gzip 20 KB) |
| Okunurluk tabanı | 76px | **40px** |
| DPR 3 | yeniden örnekleme bulanıklığı | keskin |

Okunurluk tabanının 76 > 40px'e inmesi kurgu kararını değiştirdi: bardaki boy artık
okunurluk değil duruş meselesi.

Vektörün bir kusuru kayda geçsin: **244 fill kullanımına karşılık 190 farklı renk**
(82 farklı krem tonu, 20 farklı kırmızı). Bu otomatik vektörleştirme izi, tasarımcı
kaynak dosyada temizleyebilir. Görüntüde fark edilmiyor ve 17 KB kabul edilebilir
olduğu için sanat eserine dokunulmadı.

### Sarkan rozet (sahibinin kararı, aynı gün)

Sahibi: "logo büyük, biraz aşağı sarkabilir sorun yok". Bar satırı **eski ölçüsüne
döndü** (84px ana, 78px iç); rozet satırın altına taşıyor, asma tabela kurgusu.

| | Ölçüldü |
|---|---|
| Ana varyant | rozet 148px, bar 84px, sarkma **70px** |
| İç varyant | rozet 132px, bar 78px, sarkma **60px** |
| Merkez sapması | **0px**, iki varyantta da |

Sarkma `height:0` bir sarıcıyla yapılıyor (`.markaOrta`): satır yüksekliğini büyütmez,
yoksa bar rozetin boyuna çıkardı. Bar 104px'e çıktığı ara turda eklenen hero üst dolgu
telafisi bu yüzden geri alındı.

Vektör 40px'te okunduğu için **mobildeki taviz de kalktı**: 1040px altında sadece kelime
varyantına düşmek gerekmiyor, rozet 58px bara 44px olarak giriyor. `Cekmece`'nin üst
satırı barın ikizi olduğu için oradaki marka da rozete geçti; kilitte bırakılsaydı çekmece
açılırken marka gözle görülür şekilde değişiyordu.

Şiş kilidi artık yalnız alt bilgide ve `global-not-found`'da. `lib/sis.ts`, `SisIsareti` ve
`MarkaKilidi` duruyor.

## 20 Ağustos 2026: header + hero v2, palet ve tipografi göçü

Kaynak: `Desktop/design_handoff_bozo_website/header-hero-v2/SPEC.md`. Sahibinin kararı:
**token'lar (renk + font) siteye global, YAPI yalnız header ve hero.** Menü, hikaye, konum
ve galeri sayfaları yeni renk ve tipografiyle açılıyor ama düzenleri bu turda taşınmadı.

### Palet göçü (spec §8)

| Eski | Yeni | Dokunulan |
|---|---|---|
| `#F2E9DC` / `rgba(242,233,220,x)` | `#F9E9D5` / `rgba(249,233,213,x)` | 55 |
| `#FAAA1F` + `--tangerine` ailesi | `#D19E66` + `--bakir` ailesi | 37 değer, 82 token adı |
| `#B7351C` / `#C93E22` | `#AD2624` / `#8E1D1C` | 33 |
| `#0A0807` / `rgba(10,8,7,x)` | `#0B0F0F` / `rgba(11,15,15,x)` | 26 |
| `#1A1614` / `rgba(26,22,20,x)` | `#131817` / `rgba(19,24,23,x)` | 7 |
| `#0C0A09`, `#060504` | `#0F1413`, `#070A0A` | 2 |

Silinenler: `--pumpkin` ve `--mese` (ikisinin de tüketicisi yoktu). `--nar` `--ikram-leke`
oldu ve nar `#7A1F2B`'den bordo koyuya taşındı: yeni palet logonun dışına çıkmıyor, rolü
(ikramı ana kordan ayırmak) değişmedi. Tek tüketicisi `FotoYuvasi`.

Yeni ölçülen kontrastlar (20 Ağustos 2026), yorumlardaki eski sayılar bunlarla değişti:

| | zemin | kömür |
|---|---|---|
| krem `#F9E9D5` | 16.20:1 | 15.07:1 |
| bakır `#D19E66` | 8.07:1 | 7.51:1 |
| bakır açık `#E8C08A` | 11.32:1 | 10.54:1 |
| bakır koyu `#C08A57` | 6.44:1 | 5.99:1 |
| kor `#AD2624` | **2.83:1** | 2.63:1 |

**Kor 3:1'in altına indi.** Eskiden 3.03:1 idi ve kural "gövde metni olmaz" diyordu; artık
tek başına grafik öğe (ikon, ince kenarlık) olarak da taşımıyor. Buton olarak geçerli:
üstündeki krem metin 5.73:1, hover'da 7.53:1.

Yayın kontrolü (spec §8) üretim CSS'inde çalıştırıldı: `FAAA1F`, `B7351C`, `Bricolage`,
`Inter` aramalarının dördü de **0 dosya**.

### Tipografi göçü ve sentetik kalın kaçağı

Bricolage Grotesque > **Bevan**, Inter > **Archivo**. İkisi de `latin` + `latin-ext`
sunuyor (Google CSS API'sinden doğrulandı): `ı` latin'de, `ğ Ğ ş Ş İ` latin-ext'te.

**Bevan'ın tek ağırlığı var: 400.** Kod tabanı başlıklarda 600/700/800 yazıyordu, yani
tarayıcı sentetik kalın üretiyordu. İki turda toplandı:

1. `--font-baslik` geçen satırlarda `font: NNN` > `400` (33 satır) ve ayrı `font-weight`
   bildirimleri (8 satır).
2. Bu yetmedi. Gerçek tarama tarayıcıda yapıldı (computed `fontFamily` Bevan **ve**
   `fontWeight != 400`): dokuz rotada **23 kaçak** daha çıktı, `CanliSaat`'in üç ölçüsü ve
   `MarkaKilidi`'nin kelime bloğu. Satır yakınlığına bakan metin taraması bunları
   kaçırıyordu, çünkü `font-family` ile `font-weight` arasında 30+ satır vardı.

Kural artık `styles/tokens.css`'te yazılı.

### Header (spec §4)

Bar 84 > **104px**, daralmış hâl **70px** (eşik 120px, `useDaralmis`, rAF ile kısılmış
passive dinleyici). Rozet **134px** ve barın 28px altına sarkıyor; daralınca 62px ve sarkma
yok. Nav hover'ı bakır 2px alt çizgi. Header butonu dış çizgili, daralınca solid bordo
(sayfadaki tek birincil eylem hero'da kalsın diye). Daralmış barın sağına canlı durum
kümesi giriyor (`BarDurumu`, ayrı bileşen: dakikada bir render'ı bütün bara yaymamak için).

Mobil bar 58 > **82px**; `Cekmece`'nin üst satırı barın ikizi olduğu için birlikte taşındı.

Spec'ten üç ayrılma, üçü de kayıtlı:
- **Yatay dolgu 44px değil `--sayfa-yatay`.** Bu tur yalnız header ve hero'yu taşıyor;
  44px, hero ile altındaki her bölüm arasında görünür bir hiza kayması bırakırdı.
- **Saç çizgisi rozetin olduğu yerde kesiliyor** (sahibi): `border-bottom` sarkan rozetin
  ortasından geçip onu kesiyormuş gibi duruyordu. Çizgi kaldırılmadı, orta kolonun
  276px'lik dokunulmaz alanında boşluk bırakan bir gradyana çevrildi.
- **Mobil eşik 768 değil 1040.** Bizimki üç kez ölçümle taşındı, spec'in sayısı kendi
  kanvasının.

### Hero (spec §5)

Başlık üç satırdan ikiye indi, ikinci satır bakır (`--bakir-koyu`). Rozetin üç sözü
überline oldu. Gövde paragrafı, tane ölçüsü grafiği (`TaneDizilimi`, artık `etiket` propu
ile `role="img"` taşıyabiliyor), eylem çifti, alt meta şeridi.

**Üst boşluk sabit sayı DEĞİL.** Spec 88px diyor ama `position:sticky` varsayıyor; bizim
bar `fixed`, yani akış dışında. 88px'te überline barın altında kalıyordu. Boşluk artık
`calc(var(--bar-boy) + var(--rozet-sarkma) + 56px)`: bar ölçüsü değişirse hero kendiliğinden
takip eder.

Sahibinin aynı gün verdiği beş düzeltme:

| Not | Uygulama |
|---|---|
| "zemin animasyonunu bozuyor" | Ocak kartının `rgba(19,24,23,.72)` dolgusu kalktı, kart yalnız çerçevesiyle var, kor altından geçiyor |
| Ocak fotoğraf bandı | **Uygulanmadı.** Handoff `KorSahnesi`'ni bilmiyordu; band zeminin üstüne opak bir şerit koyup animasyonu kesiyordu |
| Eyebrow'un sağındaki çizgi | Kaldırıldı |
| "saatin puntosunu küçültmek gerek", sonra "çok küçülmüş" | 130 > 74 > **82px**. Tavan kartın genişliği: 74px'te saat 318px, kartın içi 320px idi. Kart 372 > 410px, başlık 86 > 80px (sol kolon tek satırı ancak taşıyordu). Şimdi saat 356px, iç 358px |
| "bölme çizgisi o bölüme yapışmış" | Ölçüldü: ızgaranın altı 663, şeridin üstü 663, yani 0px. Meta şeridine 48px üst boşluk |

### Genel kontrol

- **Kontrast taraması** (7 rota, her metin düğümü, efektif zemin yığınla hesaplanarak):
  tek bulgu dil anahtarının dekoratif `/` glifi, 2.24:1. `aria-hidden` ve WCAG 1.4.3 saf
  dekorasyonu muaf tutuyor; zaten kayıtlı.
- **Footer telifi** (sahibi: "okunmuyor"): kontrast ölçümü geçiyordu (8.9:1) ama satır
  sayfanın en sönüğüydü, 12.5px **ve** .74 opaklık birlikte. Punto 13.5'e, opaklık .82'ye
  çıktı. Üçüncü tur; öncekiler .5 > .58 > .74 idi.
- Tipler, 123 test ve derleme temiz.

## 20 Ağustos 2026: ilk iki gerçek fotoğraf

`tane-yakin-cekim` ve `bozo-portre` yuvaları doldu; kalan 14 kare hâlâ kadraj etiketiyle
duruyor. Varlıklar `public/foto/` altında WebP: 800x993 (164 KB) ve 1120x1456 (109 KB).
Ölçüler yuvaların gerçek boyundan seçildi (DPR 2 dahil): `portre` 340x420, `portreUzun`
528x468, mobilde 342x300 ve 342x468.

**Portre etiketi düzeltildi.** Çekim listesi `portre, ocak başında` diyordu, eldeki kare
koyu zeminde stüdyo portresi. Bu metin fotoğraf gelince `alt` olarak ağaçta kaldığı için
gerçeği anlatmak zorunda: `Bozo Çağlar, portre`.

**`odak` propu eklendi** (`FotoYuvasi`). Portre kare 528x468'lik YATAY yuvaya `cover` ile
oturunca merkez kırpımı başın tepesini kesiyordu; `odak="50% 28%"` ile düzeldi. Kalan 14
kare geldiğinde aynı sorun tekrarlanacak, prop onun için genel bırakıldı.

**İddia plakasının anahat tane rayı KALDIRILDI** (`Ana:149`). Boş koyu plakada bir süs
olarak çalışıyordu; gerçek kare gelince açık gri zeminin üstünde okunmaz bir çizgi yığınına
döndü. Rayın anlattığı şeyi (tane ritmi) artık fotoğrafın kendisi gösteriyor. Bir parite
turu bunu eksik görecek: değil.

**Test amaç değiştirdi.** `fotograflar_hicbiriHenuzDosyaTasimaz` >
`fotograflar_etiketDolu_veYazilanDosyaDiskteVar`. Artık iki şeyi birden tutuyor: etiketler
hep dolu, ve `dosya` yazılmışsa o dosya `public/` altında gerçekten var. İkincisi olmasaydı
bir yazım hatası sessizce kırık görsel basardı; statik export'ta bunu yakalayan başka bir
şey yok.

## 20 Ağustos 2026: Ocakbaşı listesinin sıra numarası kalktı

Sahibi: "ürünlerin soluna numara yazdığımızda mobilde sanki hepsini sıralı almak gerekiyor
gibi gözüküyor". Sebep ölçülebilir: `MenuSatiri`'nin ızgarası masaüstünde `56px 340px 1fr`,
1040px altında tek kolona iniyor. Numara o zaman adın SOLUNA değil ÜSTÜNE, kendi satırına
düşüyor ve liste numaralı bir prosedür gibi okunuyor.

`01`-`05` kaldırıldı, ızgara `340px 1fr` oldu, `<ol>` da `<ul>` oldu (sıra anlamlı değil,
işaretleme de bunu söylememeli).

**Yerine başka bir süs KONMADI, bilerek.** Beş satırın beşinde de aynı olan bir işaret bilgi
taşımaz; bu satırdan üçlü tane rayı tam bu gerekçeyle kaldırılmıştı (`MenuSatiri.tsx`,
UYGULAMA-NOTLARI 3). Aynı hatayı yeni bir biçimde tekrarlamamak için yer boş bırakıldı ve
ad sütunu genişledi: bölümün zaten yaptığı şey (fotoğraf yokken iştahı tipografiyle kurmak)
güçlendi.

### Aynı turda çıkan iki mobil hata

| Ne | Ölçüm | Düzeltme |
|---|---|---|
| Daralmış barın canlı durum kümesi telefonda da basılıyordu | 390px'te bar rozet + dil + hamburger + küme taşıyor, satır tıkanıyordu | `.durumSarici` 1040px altında gizli. Aynı bilgi hero'nun durum çipinde ve çekmecede zaten var |
| Mobil bar kaydırınca 70px'e iniyordu | Rozet 100px, sarkma artıyor ve satır rozetin altında kalıyordu | `--bar-boy-daralmis` mobilde `--bar-boy`'a eşit: telefonda bar daralmaz, daralma masaüstünün jesti |

Rozetin mobil ölçüsü de düzeltildi: spec'in 100px/-20px değeri 82px'lik barda rozetin üst
kenarını 1px'e itiyordu ve şiş uçları kırpılıyordu. 84px/-12px, üst pay 4px, sarkma 10px.
84px okunurluk tabanının (40px) iki katı.

## 20 Ağustos 2026 gecesi: rozet revizyonu (BozoLogo-Final.svg)

Logonun dördüncü sürümü geldi ve varlık onunla değiştirildi. Kelime markası artık kendi
koyu plakasının üstünde duruyor (öncekinde diskin dışında yüzüyordu), yay metni kalınlaştı,
çizim sadeleşti. Küçülme davranışı da düzeldi: 60px'te önceki sürümden okunaklı.

| | Önceki | Final |
|---|---|---|
| Path | 227 | 393 |
| Farklı fill | 190 | 366 |
| Ham / brotli | 52 / 17 KB | 94 / 32 KB |
| En/boy | 0.9409 | 0.9606 |

Otomatik vektörleştirme izi (aynı rengin onlarca tonu) bu sürümde arttı. Görüntüde fark
edilmiyor, 32 KB kabul edilebilir; sanat eserine yine dokunulmadı.

Oran değişince rozetin barda kapladığı yer de değişti, ölçüldü: masaüstünde 134x139
(öncekinde 134x142), sarkma 35px, überline payı 47px. Telefonda 84x87, sarkma 9px,
überline payı 45px. Kırpılma yok.

**Raster ikonlar da yeniden üretildi.** `favicon.svg`'yi değiştirip PNG/ICO'yu bırakmak
sekmede eski logoyu, adres çubuğunda yenisini gösterirdi. Beşi de aynı vektörden:

| Dosya | Nasıl |
|---|---|
| `favicon-96x96.png` | şeffaf, dolgusuz |
| `favicon.ico` | 16/32/48 üç boy tek dosyada |
| `apple-touch-icon.png` | `--ocak-siyah` zeminli; iOS şeffaflığı siyaha çeviriyor, zemini biz veriyoruz |
| `web-app-manifest-192/512.png` | `purpose: maskable`, kenardan %10 pay: güvenli alan merkezdeki %80 |

`site.webmanifest`'in `theme_color` ve `background_color` değerleri üreticinin `#0a0e0e`'sinden
token'ın kendi değerine (`#0B0F0F`) çekildi.

**Açık kalan:** favicon rozetin tamamı, küçültülmüş bir işaret değil. 96px'te iyi, 32px'te
zor, 16px'te leke. Eski `app/icon.svg` bunun için indirgenmişti (16px basamağında iki ciğer
tanesi, 18 Ağustos F1). Rozetin böyle bir basamağı yok; sekme boyu için sadeleştirilmiş bir
varyant üretilmesi gerekiyor.

### Favicon seti yenilendi (aynı gece)

Sahibi seti RealFaviconGenerator'da yeniden üretti; yedi dosya da onunkiyle değiştirildi.
Bu kez `favicon.svg` GERÇEK vektör geldi (393 path, base64 yok), ilk turdaki 478 KB'lık
raster sarmalayıcı sorunu yok.

Kaynak yine tam rozet, sadeleştirilmiş bir işaret değil. Üretilen rasterlar bir önceki
turda vektörden kendi ürettiklerimle karşılaştırıldı: mürekkep kutuları birebir aynı
(2,0,94,96), 16/24/32/48px'te görünür fark yok. Yani sekmedeki okunurluk açık kalmaya
devam ediyor; çözüm jeneratörde değil, jeneratöre verilecek sade kaynakta.

`site.webmanifest`'in `theme_color` ve `background_color` değerleri yine token'a çekildi:
üretici `#000000` yazıyor, sitenin zemini `--ocak-siyah` `#0B0F0F`. Android'in tarayıcı
çubuğu bu değeri boyadığı için aradaki fark sayfayla çubuk arasında görünür bir dikiş
bırakıyor. Set her yenilendiğinde bu iki alanın düzeltilmesi gerekiyor.

## 20 Ağustos 2026: sosyal kart yenilendi, dil başına ayrıldı

Mekanizma zaten doğru çalışıyordu (on iki rotada `og:image`, `twitter:image`, mutlak URL,
boyut ve `alt`); yenilenen görselin kendisiydi. Eski kart 18 Ağustos'ta şiş kilidiyle,
Bricolage wordmark'ıyla ve turuncu tanelerle üretilmişti: rozet, Bevan ve bakır geçince
sitedeki hiçbir şeye benzemiyordu.

Yeni kart sitenin KENDİ sayfa bağlamında üretildi (Playwright ile `localhost:3000`
üstünde), yani fontlar ve token'lar birebir aynı örnekten geliyor. Google Fonts'tan ayrı
yüklemek denendi ve başarısız oldu: `next/font` alt kümeleri ayrı dosyalara böldüğü için
`ğ` yedeğe düşüyordu.

**Dil başına ayrı kart.** Kartın üstünde başlık metni var; tek kart İngilizce sayfaları
Türkçe bir görselle paylaştırıyordu. `sosyal-kart.jpg` ve `sosyal-kart-en.jpg`,
`sayfaMetadata` dile göre seçiyor. `og:image:alt` de artık kartın üstündeki metni anlatıyor,
sayfa başlığını değil.

**PNG değil JPEG.** Aynı görsel PNG olarak 281 KB, JPEG kalite 88'de 89 KB. `subsampling=0`
bilerek verildi: 4:2:0 bordo ve bakır kenarları bulandırıyor, kartta hem `BOZO` hem başlığın
ikinci satırı o renklerde. WebP daha da küçüktü ama eski paylaşım kazıyıcıları OG görselinde
WebP'yi çözmüyor; JPEG en güvenlisi.

## 21 Ağustos 2026: bordo palet, yeni rozet, kartlar ve ikonlar

Sahibi siyah zeminden rahatsız olduğunu iletti. Ölçüm **iki ayrı ve bağımsız** neden
buldu: zemin soğuktu (R−B −4; dört koyu yüzeyin dördünde de kırmızı en zayıf kanal, bir
ateş markasında ters yön) ve krem metin kontrastı 16.20:1 idi, yani AAA'nın 2.3 katı ve
hâle eşiğinin (~12:1) üstünde. Kolların bağımsızlığı önemliydi: yalnız ısıtmak şiddeti
düşürmüyor, hatta biraz artırıyor (belgedeki sıcak palet 16.62:1 ölçüyor).

Beş varyant sitenin kendisinden üretilip yan yana sunuldu, sahibi **D**'yi seçti.

| | Zemin | Krem metin | R−B | Buton ayrışması |
|---|---|---|---|---|
| A mevcut | `#0B0F0F` | 16.20:1 | −4 | 2.83:1 |
| B sıcak kömür | `#241E1A` | 13.83:1 | +10 | 2.41:1 |
| C sıcak oda | `#332B25` | 11.66:1 | +14 | 2.04:1 |
| **D derin bordo** | **`#2E110F`** | **14.66:1** | **+31** | **3.09:1** |
| E tam güç kor | `#AD2624` | 5.73:1 | +137 | 2.56:1 |

**E elendi, gerekçe aritmetik.** Tam güçte kırmızı zeminde hem zeminden 3:1 ayrışan hem
üstünde krem metni 4.5:1 taşıyan buton rengi yok; altı aday denendi, hepsi bir taraftan
düşüyor. Ayrıca rozetin dış halkası o zeminde birleşiyor ve logo kenarını kaybediyor.

**Kor bir kademe parlatıldı.** `#AD2624` bordo zeminde 2.56:1'e düşüyor, yani buton
sayfadan ayrışmayı bırakıyordu. `#C13029` 3.09:1 ölçüyor: 1.4.11'in eşiğini geçen tek
palet bu. Yan bulgu, mevcut sitede de değer 2.83:1 ile eşiğin altındaydı ve `tokens.css`
bunu kendi yorumunda zaten not etmişti.

**İki palet, tek satır.** Zemine bağlı her renk `styles/palet/{bordo,siyah}.css` içinde;
`app/globals.css` birini aktarıyor. Siyah palet çalışır halde korunuyor (sahibinin isteği).
`styles/palet.test.ts` paletlerin aynı token setini tanımlamasını ve palet renginin palet
dışında literal geçmemesini zorunlu tutuyor.

**Yirmi dört literal token'a çevrildi.** Dokuzu zemin, on beşi kor. Kor olanları ilk tarama
kaçırdı çünkü yalnız zemin rgb'si aranmıştı; derlenmiş CSS'teki renkleri saymak ortaya
çıkardı. Kaynağı grep'lemek yerine derleme çıktısını saymak bu iş için daha güvenilir.
`KorKivilcimi.tsx` de renklerini sabitlemişti: canvas CSS okumaz, artık mount'ta `--kor`
ve `--bakir` çözülüyor.

### Rozet (BozoLogo-2.svg)

En/boy **0.8844**, öncekinden dar (0.9606). Aynı genişlikte 12px uzuyor ve mobil rozetin
tepesi viewport'tan 1px taşıyordu (öncekinde 6.6px pay vardı). Dört genişlik de **boy sabit
kalacak** şekilde yeniden ölçüldü: 134>123, 62>57, 100>92, mobil 84>77. Hiçbir yerleşim
kaymadı.

Zeminden ayrılmayı en dış **bakır halka** sağlıyor, kırmızı değil: `#D5862E` bordoda
6.05:1. Logonun kırmızısı `#8b1314` bordoda 1.83:1 ölçüyor ve tek başına yetmezdi.

### Kartlar ve ikonlar

Kartlar yine sitenin kendi sayfa bağlamında üretildi. **Bu turda bir hata yakalandı:**
İngilizce kart Türkçe sayfada üretilince "FROM THE FİRE" ve "KYRENİA" yazıyordu.
`text-transform: uppercase` `<html lang>` okur ve Türkçe dökümünde `i` > `İ` olur. Her kart
artık kendi dilinin sayfasında üretiliyor. JPEG 108 KB'a çıktı (önce 91): bordo gradyanın
ton çeşitliliği siyahtan fazla.

Favicon seti vektörden yeniden üretildi (1024px master > PNG8 > zopfli); hepsi öncekinden
küçük. İki manifest ikonu `purpose: "maskable"` diyordu ama zeminleri şeffaftı: maskable
ikon dolu zemin ve merkezi %80'lik güvenli alan ister, şeffaf olanın kenarları kırpılırdı.
Artık bordo levha üstünde %78'de duruyorlar. `apple-touch-icon` de bordo levha aldı, çünkü
iOS şeffaflığı siyaha bindirir. `site.webmanifest`'in `theme_color` ve `background_color`
alanları eski zemini taşıyordu.

## 23 Ağustos 2026: hero'nun iki eylemi telefonda yan yana

Sahibinin ekran görüntüsü (IMG_8300, 390px): hero'nun iki butonu "fazla büyük", yan yana
gelmeli.

**Ölçüldü, 390x844.** Butonlar alt alta değil, **sarıyorlardı**: `Yol Tarifi Al` 169.4px +
12px boşluk + `Menüyü Gör` 181px = 362.4px gerekiyordu, kolon 342px. 20.4px yüzünden ikinci
buton alt satıra düşüyor ve satır 126px kaplıyordu, ekranın %15'i. Sonuç: saat kartı ilk
ekranın dışında kalıyordu.

İki ayrı karar, iki ayrı dosya:

- **Ölçü `Buton.module.css`'in.** `boy="xl"` sitede yalnız bu iki butonda kullanılıyor, o
  yüzden mobil adımı orada tanımlamak başka hiçbir yeri etkilemiyor. 1040px altında xl,
  md'nin gövde ölçüsüne iner (16.5px > 15.5px, dikey 20 > 17). 400px altında yatay dolgu
  ayrıca 16 > 10px: genişliği artık satır dağıttığı için dolgu yalnız bir taban.
- **Yerleşim `Acilis.module.css`'in.** 1040px altında satır `nowrap`, çocuklar `flex: 1 1 0`:
  iki buton eşit genişlikte.

**Sonuç (satır yüksekliği, iki dil, dört genişlik):**

| Genişlik | TR önce | TR sonra | EN sonra |
|---|---|---|---|
| 320 | 126 | 51 | 68 (iki satır) |
| 360 | 126 | 51 | 51 |
| 375 | 126 | 51 | 51 |
| 393 | 126 | 51 | 51 |
| 430 | 126 | 51 | 51 |

Hiçbir genişlikte taşma yok. 320px'te İngilizce etiketler ("Get Directions") iki satıra
kırılıyor; kırpılmıyor, kutu büyüyor. 320px iPhone SE 1. nesil, düzeltilmedi.

**İki kayıt bayatladı, ikisi de bu turda güncellendi.** `CLAUDE.md` > "Owner deletions"
hero'nun mobil butonlarının 13 Ağustos'ta silindiğini söylüyordu; hero v2 (20 Ağustos)
onları geri getirdi ve sahibi 23 Ağustos'ta kalmalarını istedi. `MobilAksiyonBari.module.css`
de barın sıfırdan görünmesini "hero'da mobilde buton kalmadı" gerekçesine bağlıyordu; o
gerekçe düştü, karar (F4) durmaya devam ediyor: bar telefondaki tek kalıcı eylem yüzeyi ve
üçüncü eylemi (WhatsApp) hero'da hiç yok.

### Mobil animasyon denetimi (aynı tur)

393x852'de sayılan: **15 animasyonun 15'i koşuyor**, canvas çiziyor (900ms'de 683 piksel
değişimi). `prefers-reduced-motion: reduce` ile geriye **2 kalıyor**, ikisi de
`KorSahnesi`'nin kayıtlı opacity istisnası; canvas kendi tercih okumasıyla duruyor (piksel
farkı 0). Çekmece açılışında `kapAcilis`, `xUst`, `xAlt` ve beş `satirGiris` kuruluyor.
Bulgu yok.

## 23 Ağustos 2026: nüfustaki ad siteden kalktı, Bozo bölümü sahibinin metnini aldı

Sahibinin revize listesi (`BozoRevizeler.pdf`, 3. ve 5. madde): *"Engin ismini
kullanmayacağız, Bozo Çağlar"* ve ana sayfadaki Bozo bölümü için birebir yeni metin.

19 Ağustos'ta ad iki cümlede yaşıyordu, ikisi de lakabı açıklıyordu (ana sayfa Bozo bölümü
ve hikaye açılışı). İkisi de gitti:

| Yüzey | Önce | Sonra |
|---|---|---|
| Ana, başlık | Bozo bir marka ismi değil, bir insan | Bozo bir marka ismi değil, ta kendisi |
| Ana, metin | "Nüfusta Engin Çağlar yazar; ..." (3 cümle) | "Bu mekana kendi ismini verdi; çünkü ..." (1 cümle) |
| Hikaye, giriş | aynı 3 cümle | nüfus cümlesi düştü, kalan ikisi durdu |

Ana sayfa metni sahibinin PDF'te yazdığı hali, kelimesi kelimesine. Üstyazı ("Bozo Çağlar,
her gün ocağın başında") ve buton ("Hikayenin Tamamı") zaten aynıydı, dokunulmadı.
İngilizcesi çeviri: `it is the man himself` / `He gave this place his own name`.

Hikaye açılışı kısaltıldı, yeniden yazılmadı: lakabın tam anlatımı zaten aynı sayfanın
`lakap` bölümünde, sahibinin kendi ağzından duruyor. Giriş onu tekrarlamıyordu, sadece
nüfustaki adı söylüyordu.

**Test eklendi.** `content/icerik.test.ts` > `sozluk_nufustakiAdiIcermez` iki sözlüğü de
gezip `\bEngin\b` arıyor. Gerekçe: tasarım dosyaları ve `docs/tasarim/metin-envanteri.json`
o adı hala altı yerde taşıyor, yani bir parite turu "eksik" sanıp geri ekleyebilir. Test
ihlalde düştüğü doğrulandı, sonra geri alındı. 128/128.

## 23 Ağustos 2026: "Bozo'nun hikayesi", sahibinin kendi anlatımı

**Kaynak:** `BozoRevizeler.pdf` sayfa 2-3, işletme sahibinin 23 Ağustos 2026'da yazdığı
metin. Envanterden gelmeyen ikinci blok (birincisi 19 Ağustos'un `lakap` bölümü).

**Yerleşim, sahibinin kararı (aynı gün):** metin ikiye bölündü. Anlatı `Portre` ile `Lakap`
arasında (yüzü gördükten sonra konuşuyor, lakabın açıklaması da onun sesiyle sürüyor);
kapanış sayfanın en sonunda, `Sofra`'nın CTA'larından sonra. Tek parça bırakılsaydı "Hoş
geldiniz" sayfanın ortasında kalır, altında üç bölüm daha devam ederdi. Sayfa beş
bölümden yedi bölüme çıktı.

**Ne düzenlendi:** yalnız iki kural, ikisi de `CLAUDE.md` > Copy rules.

| Yazılan | Sitedeki | Kural |
|---|---|---|
| hikâye, mekâna | hikaye, mekana | şapkalı harf kullanılmaz |
| BOZO (4 kez) | Bozo | büyük harfli cümle yok; site 40+ yerde "Bozo" yazıyor |

Sahibi ikisini de onayladı. Başka hiçbir kelime değişmedi.

**Ne çıkarıldı:** hiçbir cümle. PDF'teki 23 cümlenin 23'ü sayfada. Tek biçimsel dokunuş,
PDF'te ayrı satırlarda duran cümlelerin akan paragraflara toplanması; satır kırıkları
yalnız ritmik olan iki yerde korundu ("Ocağın başında, / kapıda, / sofranızın yanında." ve
"Ateşimiz hazır. / Şişlerimiz hazır. / Soframız hazır."). "Her gün." kapanışın başlığı
oldu, noktası düştü.

**Erişilebilirlik.** Üç yer bir `<ul>` değil, tek `<p>` içinde blok `<span>`: ekran okuyucu
"3 öğeli liste" demesin, tek cümle okusun. Üç "hazır" cümlesi gerçekten ayrı cümle, onlar
`<p>` kaldı. Bakır `#D19E66` bordo üstünde **7.31:1**, kapanışın imza notu (`--krem-58`)
**5.63:1**: ikisi de AA.

**İngilizcesi çeviri**, sahibinin metni değil. Girne "Kyrenia", işletme adı "Ciğerci Bozo
of Urfa". 393px ve 1440px'te iki dilde de yatay taşma yok.

## 23 Ağustos 2026: final rozet (BozoLogo-Final-Aug23.svg) ve favicon seti

Sahibi hem yeni logoyu hem RealFaviconGenerator'da ürettiği yedi dosyalık seti verdi.

### Rozetin kendisi

Öncekinden (`BozoLogo-2.svg`) farkları: kol kıvrımları azaldı (revize listesi madde 6),
şişler sola açıldı, dış halka bakır `#D5872D` yerine turuncu `#EC8817`, kırmızı alan
`#8B1314` yerine `#7C040A`. Path sayısı 211'den 455'e çıktı.

**"GİRNE" ibaresi rozetten kalktı.** Site şehri hâlâ söylüyor (überline, adres, alt bilgi,
sosyal kart), ama marka işaretinin kendisi artık söylemiyor.

**Kontrast.** Zeminden ayrılmayı yine en dış halka sağlıyor: `#EC8817` bordo üstünde
**6.73:1**, öncekinin 6.05:1'inden iyi. Dosyada zemin plakası yok, varlık dişi.

**Ölçüler yeniden hizalandı.** En/boy 0.8844'ten 0.8747'ye indi, yani aynı genişlikte
uzuyor. `Rozet.module.css`'in dört değeri BOYU korumak için düşürüldü: 123>122, 92>91,
77>76, 57>56. Ölçüldü, hiçbir yerleşim kaymadı:

| Yer | Eski boy | Yeni boy |
|---|---|---|
| bar (masaüstü) | 139.07 | 139.5 |
| daralmış bar | 64.45 | 64.0 |
| çekmece | 104.02 | 104.0 |
| mobil bar | 87.06 | 86.9 |

**Ödenen bedel:** vektör 22 KB'tan **39 KB'a** çıktı (gzip), ve üst bar onu her sayfada
yüklüyor. 455 path'in koordinat verisi; boşluk kırpmak gzip sonrası kazanç vermiyor.
404 sayfası etkilenmedi, o rozeti değil `lib/sis.ts`'in şiş kilidini basıyor.

### Favicon seti

`favicon.svg` bu kez **gerçek vektör** geldi (455 path, base64 yok), ilk turdaki 478 KB'lık
raster sarmalayıcı sorunu tekrarlamadı. `favicon.svg` yine `marka/rozet.svg` ile birebir
aynı dosya: jeneratörünki aynı çizimi (path verisi bayt bayt eşit) 3 KB daha büyük
serileştiriyordu, sahibinin özgün dosyası kanonik tutuldu.

**Jeneratörün iki tuzağı yine çıktı, ikisi de düzeltildi.**

1. `site.webmanifest` `theme_color` ve `background_color` alanlarına `#000000` yazmıştı.
   Android tarayıcı çubuğunu bu değerle boyar; sitenin zemini `#2E110F`. Bu alan set her
   yenilendiğinde düzeltilmek zorunda.
2. `apple-touch-icon` ve iki `purpose: "maskable"` ikonu **şeffaf** geldi ve rozet
   kenardan kenara doluydu. Ölçüldü, en uzak mürekkep pikseli yarıçapın **1.242**'sinde;
   maskable güvenli daire 0.800. Yani Android'in dairesel maskesi şiş uçlarını ve kelime
   levhasının köşelerini kesecekti, iOS de şeffaflığı siyaha bindirecekti.

Üçü bordo levha üstünde yeniden kuruldu, rozet mürekkep merkezinden hizalanıp güvenli
dairenin içine ölçeklendi:

| Dosya | Zemin | Güvenli oran | Sınır |
|---|---|---|---|
| `web-app-manifest-512x512.png` | `#2E110F` opak | 0.800 | 0.800 |
| `web-app-manifest-192x192.png` | `#2E110F` opak | 0.800 | 0.800 |
| `apple-touch-icon.png` | `#2E110F` opak | 0.981 | ~1.05 (yuvarlak dikdörtgen maske) |

`favicon-96x96.png` ve `favicon.ico` şeffaf bırakıldı, sekme ikonunda doğrusu bu.
Üçü PNG8'e indirilip zopfli ile sıkıştırıldı: 108>27 KB, 25>7.3 KB, 30>8.8 KB, gözle
görülür bant yok (MAE %0.13'ün altında).

**HTML'e etiket EKLENMEDİ.** Jeneratörün istediği altı etiketin altısını da Next zaten
`lib/metadata.ts`'ten basıyor; elle eklemek onları çiftlerdi ve `app/icon.svg`
konvansiyonu tam bu yüzden 20 Ağustos'ta kaldırılmıştı. İki dil kökünde de tek tek
sayıldı. Jeneratörün `rel="shortcut icon"` satırı da gereksiz: `rel="icon"` standardı
bunu zaten karşılıyor.

**Açık kalan.** 16px sekmede tam rozet okunmuyordu, yeni rozet daha ayrıntılı olduğu için
biraz daha kötü. Çözüm hâlâ jeneratörde değil: favicon'a sade bir işaret verilmeli.

### Sosyal kartlar

İkisi de yeniden üretildi, yine sitenin kendi sayfa bağlamında (fontlar `next/font`'tan) ve
her biri KENDİ dilinin sayfasında: İngilizce kart "FROM THE FIRE" ve "KYRENIA" yazıyor,
Türkçe dökümün `İ`'si yok. Metinler sayfanın DOM'undan okunuyor, kartta ikinci bir kopya
tutulmuyor. JPEG kalite 88, `sampling-factor 1x1`; 108 ve 110 KB.

## 23 Ağustos 2026: bordo iki kademe koyulaştı

Sahibi: "biraz fazla açık renk oldu gibi geldi", hem zemin degradesi hem ona bağlı tonlar
için. Revize listesinin 8. maddesinin cevabı da bu: bordo kalıyor, koyulaşıyor.

**Tavan ölçülü.** Zemini koyulaştırmak krem metnin kontrastını yükseltiyor, yani siyahın
reddedildiği 16.20:1'e (hâle eşiği) doğru gidiyor. Beş kademelik merdiven üretildi ve
gerçek sayfada basıldı:

| | zemin | krem/zemin | kor/zemin | R−B |
|---|---|---|---|---|
| A (önceki) | `#2E110F` | 14.66 | 3.09 | +31 |
| B | `#280F0D` | 15.17 | 3.20 | +27 |
| **C (seçildi)** | **`#230D0B`** | **15.56** | **3.28** | **+24** |
| D | `#1D0B0A` | 15.97 | 3.37 | +19 |
| E | `#190908` | 16.27 | 3.43 | +17 |

**E elendi ölçümle:** 16.27, siyahın reddedildiği 16.20'nin üstünde. D'nin payı 0.23'e
düşüyordu, C 0.60 pay bırakıyor. Sahibi C'yi seçti.

Zemin ailesinin tamamı aynı çarpanla indi, iç oranlar korundu:
`--komur` `#3A1815`>`#2C1210`, `--plaka-zemin` `#351512`>`#28100E`, `--gece`
`#240C0A`>`#1B0908`, ve zemine bağlı yirmi küsur `--panel-*` alfası `rgba(46,17,15)`
yerine `rgba(35,13,11)`.

**Kor DOKUNULMADI, kasıtlı.** `#C13029` 3:1 eşiğini kıl payı (3.09) geçiyordu ve zemin
koyulaşınca ayrışması kendiliğinden **3.28**'e çıkıyor. Koru da koyultmak o kazancı geri
verirdi; sahibine iki seçenek ölçülerek sunuldu, "dokunma"yı seçti. Üstündeki krem metin
4.74:1 (AA), hover 5.90:1, ikisi de zeminden bağımsız, değişmedi.

**Bir uç değer işaretleniyor:** `--gece` yeni değerinde krem metinle **tam 16.20:1**, yani
siyahın reddedildiği seviye. Tek bölümün zemini ve bilerek sayfanın en koyu yüzeyi (Gece),
ama o bölüm de gövde metni taşıyor. Bir kademe geri almak palet dosyasında tek satır.

### Zemine bağlı varlıklar da yenilendi

Palet takası CSS'te tek satır, ama zemin rengi CSS'in dışında da dört yerde duruyor:

- `styles/palet.test.ts`'in literal bekçisi zemin ve kömürün rgb üçlülerini listeliyor;
  güncellenmeseydi YENİ rengin kaçaklarını yakalamayı bırakırdı.
- `public/site.webmanifest` `theme_color` ve `background_color` (Android tarayıcı çubuğu).
- Üç ikonun levhası (`apple-touch-icon`, iki maskable). Güvenli alan oranları yeniden
  ölçüldü: 0.800 / 0.800 / 0.981, hepsi geçiyor.
- İki sosyal kart; sayfanın kendi bağlamında üretildikleri için yeni zemini kendiliğinden
  aldılar.

## 24 Ağustos 2026: rozetin sadeleştirilmiş hali (Bozo.svg)

Aynı çizimin sadeleştirilmişi geldi. Yeni dosyanın renk kümesi öncekinin **alt kümesi**
(198 renk, öncekinde 359; yalnızca yenide olan tek renk yok), yani ton eklenmemiş, 161 ara
ton atılmış. Görünen fark: **kelime levhasındaki çapraz doku kalktı**, levha düz kaldı ve
rozet biraz daha derli toplu.

| | Aug23 | Bozo.svg |
|---|---|---|
| path | 455 | **230** |
| ham | 102.902 | **66.933** |
| gzip | 39.052 | **26.751** |
| en/boy | 0.874725 | 0.874725 |

**En/boy oranı birebir aynı**, o yüzden `Rozet.module.css`'in dört değeri DEĞİŞMEDİ.
Ölçüldü, boylar da aynı kaldı: bar 139.5, daralmış 64.0, çekmece 104.0, mobil 86.9.
Yalnız `Rozet.tsx`'in içsel `width`/`height` nitelikleri yeni viewBox'a çekildi.

Bu tur 23 Ağustos'ta işaretlenen yük artışını da geri veriyor: vektör her sayfada üst barda
yükleniyor ve gzip ağırlığı 39 KB'tan 27 KB'a indi, yani eski rozetin 22 KB'ına yaklaştı.

**Halka kontrastı** yeni koyu zeminde `#EC8817` / `#230D0B` = **7.14:1** (önceki zeminde
6.73). Zeminden ayrılma sorunu yok.

### Favicon seti, üçüncü tur

Sahibi seti yine RealFaviconGenerator'da üretti. `favicon.svg` yine gerçek vektör (230
path, base64 yok). **Jeneratörün iki tuzağı üçüncü kez de çıktı ve üçüncü kez düzeltildi:**

1. `site.webmanifest` yine `#000000` yazmıştı; sitenin zemini artık `#230D0B`.
2. Dört rasterin dördü de şeffaf ve kenardan kenara geldi (`enUzakOran` 1.242-1.245).
   `apple-touch-icon` ve iki maskable ikon bordo levha üstünde yeniden kuruldu ve güvenli
   daireye ölçeklendi: 0.800 / 0.800 / 0.981. `favicon-96x96` ve `favicon.ico` şeffaf
   bırakıldı, sekme ikonunda doğrusu bu.

HTML'e yine etiket eklenmedi: altısını da Next `lib/metadata.ts`'ten basıyor, sayıldı.

**16px hâlâ okunmuyor.** Sadeleştirme 48px'te gözle görülür bir kazanç veriyor ama 16px'te
rozet yine bulamaç. Çözüm değişmedi: favicon'a sade bir işaret (şiş, ya da rozetin kelime
levhasız daire kırpımı).

Sosyal kartlar da yeni rozetle yeniden üretildi (104 ve 106 KB).

## 24 Ağustos 2026: sahibinin sekiz maddelik tur

### Kor bordoya indi

Sahibi "turuncu değil bordo" diyerek `#AD2624` istedi. Ölçüldü: o değer yeni zeminde
**2.72:1**, yani 1.4.11'in 3:1 eşiğinin altında; zemin 21 Ağustos'ta koyulaştığı için
2.56'dan 2.72'ye çıkmıştı ama yetmedi. `#B82B27` gözle ondan ayırt edilmiyor (R+10 G+5 B+3)
ve **3.01:1** tutuyor. Sahibi onu seçti, kapsam da tüm `--kor` token'ı.

**Bağlayıcı yüzeyin hangisi olduğu ölçümle belirlendi.** Palet yorumu dört yüzeye karşı
3:1 arıyordu (zemin, kömür, plaka, gece) ve o ölçüte göre hiçbir koyu değer geçmiyordu.
Sayfalar tarandı: **kor dolgulu hiçbir öğe kömür ya da plaka üstünde durmuyor**, hepsi
zeminin veya zeminin yarı saydam bir katmanının üstünde. Bağlayıcı yüzey `--zemin`.

Üstündeki krem metin 4.74'ten **5.17:1**'e, hover 5.90'dan 6.28'e çıktı: eylem rengi
koyulaşınca etiket okunurluğu iyileşiyor.

### Üst bar: tepede şeffaf, kaydırınca cam

Bar kaydırma durumundan bağımsız olarak hep perde basıyordu. Tepede altında hiçbir şey
yok (hero `--bar-boy + --rozet-sarkma` kadar yer açıyor), yani perde orada yalnız kor
sahnesinin parıltısını düzleştiren bir dikiş bırakıyordu. Perde `.perdeli` sınıfına taşındı
ve **4px** eşiğine bağlandı; daralma jesti kendi 120px eşiğinde kaldı, ikisi ayrı kaygı.

Perde aynı turda camlaştı (sahibi): alfa `.9/.94` > **`.72/.78`** (`.9`da bulanıklık hiç
okunmuyordu, düz bir kutuydu), `blur(14px)` > `blur(26px) saturate(1.4)`, üstüne sönen ışık
tabakası ve inset üst parıltı. Tarif `MobilAksiyonBari`'nin kayıtlı üç katmanlı camından.

### Rozetin tepe payı

Rozet barın üst kenarına yapışıktı (masaüstünde 2px, mobilde 5.6px). `--rozet-tepe`
eklendi, 6px/4px: yeni ölçüler 8px ve 9.6px. Satır `align-items: center` olduğu için alt
marj aynı miktarda artırıldı, böylece kutu yüksekliği değişmedi.

### Ürün adları tek satırda

"Terbiyesiz Tavuk Şiş" sekiz genişlikte "Terbiyesiz Tavuk / Şiş" diye kırılıyordu. İki iş:

- Ana sayfanın Ocakbaşı listesinde ad kolonu **340 > 400px** (en uzun ad 34px Bevan'da
  387px istiyor). Açıklama kolonu 812'den 752'ye indi, orada sıkışma yok.
- Punto kapsayıcıdan türetildi (`min(tavan, Ncqw)`, `container-type: inline-size`): sabit
  bir clamp tutturamıyor çünkü kart `auto-fit` ızgarada ve genişliği viewport'la doğrusal
  gitmiyor (1040'ta 936px kart, 1440'ta 371px).

**Bir hata yapıldı ve geri alındı:** ilk denemede `white-space: nowrap` da eklenmişti.
Türkçeyi çözüyordu ama İngilizce adlar ("Chicken Skewer (Terbiyesiz Tavuk Şiş)") hiçbir
puntoda tek satıra sığmadığı için **gerçek yatay sayfa taşması** üretti, sekiz genişlikte
ölçüldü. `nowrap` kaldırıldı: sığdırmayı punto yapıyor, sarma yasağı değil. Türkçe artık
393px ve üstünde her yerde tek satır; 320px'te (SE 1. nesil) hâlâ iki satır.

Aynı teknikle `lib/metin.ts` > `dulOnle` eklendi (son iki kelimeyi bölünmez boşlukla
birleştirir), beş testi var.

### Konum başlığı adres satırının kendisi oldu

`ana.konum.baslik` silindi, bölüm `ortak.satirlar.adresTamSatir`i basıyor: 13 Ağustos'ta
başlığın altındaki ayrı adres satırı zaten kaldırılmıştı, yani başlık fiilen adresti ve iki
anahtar aynı bilgiyi iki kopyada tutuyordu. Metin "Naci Talat Caddesi, Girne" yerine artık
**"Naci Talat Caddesi No:4"**. Tek satıra sığması yine `cqw` ile: metin kutu genişliğinin
%7.76'sı kadar punto istiyor ve bu oran her ekranda sabit.

### Hero'nun üst satırı tek söz oldu

"Urfa Usulü · Ocak ve Sofra · Girne" > **"Urfa Usulü"** (sahibi). Metin uydurulmadı,
satırın kendi ilk parçası kaldı; öteki iki bilgi hemen altındaki meta şeritte zaten var.
Üç sözü aynalama gerekçesi de düşmüştü: yeni rozette o yaylar yok.

Okunurluk için üç ölçü birden: 12 > **14px**, aralık 0.24 > **0.16em** (0.24em bu puntoda
kelimenin şeklini dağıtıyordu), renk `--krem-56` > `--bakir`. Kontrast **5.48 > 7.76:1**.

### Alt bilgide yapımcı işareti

`YapimciIsareti`, telif şeridinin sağ ucunda, `crimsoninnovate.com`a gider. Yol
`currentColor` çiziyor, rengi bağlantıdan geliyor: telif metniyle aynı `--krem-82`.
Görünür işaret 22px, dokunma hedefi `::after` ile 44px (AltBilgi'nin tekniği). Erişilebilir
ad `content/`de, işaretin kendisi `aria-hidden`.

### İddia sayaçlarının altındaki levha kalktı

Üç sayaç (`8 / 4+2 / 3`) `--panel-koyu` bir levhanın üstünde duruyordu ve o levha kor
sahnesinin parıltısını **tam da sayıların arkasında** düzleştiriyordu. Aynı hata aynı gün
üst barda da bulunup alınmıştı.

Sahibi iki seçenek verdi: levhayı kaldırıp doğrudan zemine yazmak, ya da fiyat bloğundaki
gibi (bakır %5 dolgu, %26 kenarlık) hafif şeffaf bir kutuya almak. Üçü de gerçek sayfada
basılıp karşılaştırıldı; **zemin** seçildi. Gerekçe: sayılar bölümün kanıtı, dipnotu değil;
ve ikinci bir bakır kenarlıklı kutu aynı sayfadaki fiyat bloğunun ayırt ediciliğini
seyreltirdi.

Ayrım artık saç çizgisinden geliyor (üst, alt, hücreler arası) ve ilk hücrenin sol dolgusu
sıfır: "8" üstündeki paragrafla aynı hizada başlıyor. Altı genişlikte ölçüldü, üç hücre her
yerde tek satırda kalıyor.

### Cam perdenin iki tuzağı (aynı gün, ölçüm turunda)

1. **`-webkit-` ön ekini ELLE yazmak standart özelliği düşürüyor.** `backdrop-filter` ve
   `-webkit-backdrop-filter` art arda yazılınca lightningcss ikisini birleştirip yalnız
   ön ekli olanı basıyordu. Chrome ön ekli sürümü onurlandırdığı için efekt çalışıyordu ama
   `getComputedStyle().backdropFilter` boş dönüyor ve standart özellik hiç yayınlanmıyordu.
   Tek standart bildirim bırakıldı; ön eki araç kendisi ekliyor, build'de ikisi de var.

2. **GPU'suz headless `backdrop-filter` uygulamıyor.** Ölçüm turunda barın altındaki meta
   metni perdeden okunuyor göründü ve bu bir gerileme sanıldı. Aynı sayfa
   `--use-angle=swiftshader` ile açılınca bulanıklık çalışıyor. Cam ölçülecekse tarayıcı
   GPU bayraklarıyla açılmalı, yoksa yanlış alarm verir.

## 24 Ağustos 2026: yayın, ölçüm ve gizlilik

### `X-Robots-Tag` kaldırıldı

`public/.htaccess`'teki `noindex, nofollow` satırı silindi; site arama motorlarına açıldı
(sahibinin kararı). `robots.txt` zaten `Allow: /` diyordu ve `sitemap.xml` on iki rotayı
listeliyor. Canlıda dört rotada doğrulandı: başlık artık hiç yok.

Yayın kontrol listesinin iki maddesi açık kaldı ve sahibine bildirildi: Instagram hesabının
gerçekten açık olduğu dışarıdan doğrulanamıyor (`302` Instagram'ın giriş yönlendirmesi), ve
e-posta, koordinat, posta kodu hâlâ `null`.

### GA4

Ölçüm kimliği `G-N3893E7B1P`, akış "BozoWeb". `components/layout/Olcumleme.tsx`,
`next/script` ile `afterInteractive`. **`<html>` basan ÜÇ yerin hepsine girdi** (iki kök
layout ve `global-not-found`), fontlarla aynı gerekçe: biri unutulursa o sayfa ölçülmez.

İlk yazımda etiketin gövdesi JSX çocuğu olarak şablon dizesiyle verilmişti ve tsc onu
ayrıştıramadı; gövde ayrı bir sabite alınıp `dangerouslySetInnerHTML` ile verildi.

Tarayıcıda uçtan uca doğrulandı: `gtag.js` yüklendi, `/g/collect` isteği `tid=G-N3893E7B1P`
ile gitti, `dataLayer` dört kayıt taşıyor.

### Gizlilik sayfası yeniden yazıldı

**GA4 eklemek sayfayı yanlış hale getiriyordu.** Eski metin birebir şunu diyordu: "Bu site
çerez kullanmaz, form toplamaz ve ziyaretçi izleme aracı barındırmaz" ve "Sitede analiz
veya ölçüm aracı kurulu değildir". GA4 çerez yazar ve tam olarak bir ziyaretçi izleme
aracıdır; iki cümle de doğru olmaktan çıktı. Dosyanın kendi başlık yorumu zaten "Analiz
aracı eklenirse bu sayfa güncellenir" diyordu.

Üç bölüm gerçeğe çekildi (giriş, çerezler, ölçüm) ve KKTC için **dört bölüm eklendi**:

| Bölüm | Neden |
|---|---|
| Yurt dışına aktarım | GA4 verisi Google sunucularında, KKTC dışında işleniyor |
| Saklama | Süre Google Analytics hesabının ayarında; site kendi sunucusunda tutmuyor |
| Haklarınız | KKTC Kişisel Verilerin Korunması Yasası: öğrenme, düzeltme, silme |
| Veri sorumlusu | İşletmenin adı ve adresi, taleplerin gideceği yer |

Sayfaya bir de yürürlük tarihi satırı eklendi (panelin dışında, bölüm değil dipnot).

**METİN HUKUKÇU ONAYINDAN GEÇMEDİ** ve madde numarası verilmedi; yalnız yasanın adı geçiyor.
Talepler için kanal telefon ve WhatsApp, çünkü `isletme.eposta` hâlâ `null`; gizlilik
talebi için bir e-posta adresi asıl doğru kanal, sahibine bildirildi.

### JSON-LD'ye `image`

`Restaurant` yapısal verisi görsel taşımıyordu; Google'ın restoran zengin sonucu onu
kullanıyor. Sosyal kartın kendisi verildi (`sosyal-kart.jpg`), zaten 1200x630 ve mutlak
URL'de. `geo` hâlâ yok, koordinat gelince kendiliğinden düşecek.

### E-posta geldi: `bozo@cigercibozo.com`

Sahibi 24 Ağustos 2026'da verdi. `isletme.eposta` üç yeri birden açtı ve üçü de zaten
onu bekliyordu:

- **JSON-LD** `email` alanını kendiliğinden yazdı (`lib/jsonld.ts` zaten koşulluydu).
- **Gizlilik sayfasının "Soru" bölümü** `mailto:` bağlantısı aldı; bileşenin kendi yorumu
  "`isletme.eposta` geldiğinde bu satır `mailto:` alır" diyordu. Adres metne yazılmadı,
  `isletme.eposta`dan basılıyor: değişirse tek yerde değişir. Sayfadaki tek bağlantı bu.
- **"Toplanan veri" bölümü** düzeltildi: form yok ama artık bir yazışma kanalı var, yani
  "e-posta bilgisi istenmez ve saklanmaz" cümlesi eksikti. Yeni hali, size cevap verebilmek
  için mesajın ve adresin saklandığını söylüyor.

**İki bekçi testi güncellendi.** `isletme_bilinmeyenAlanlarNullDur` e-postayı listeden
bıraktı (koordinat ve posta kodu hâlâ orada) ve yerine `isletme_epostaDogrulanmisDegeriTasir`
geldi. `restaurantJsonLd_gercekVeriyle_bilinmeyenAlanlariHicYazmaz` artık `email`in
YOKLUĞUNU değil varlığını kabul ediyor; `geo` ve `priceRange` beklentisi durdu.

**Uygulanmadı, sahibinin kararına bırakıldı:** e-posta satırı Konum sayfasının iletişim
bloğuna ve alt bilgiye eklenmedi. İkisinin de kayıtlı gerekçesi "tasarımda üç satır var"
(`SaatlerVeIletisim.tsx`), yani eklemek bir tasarım sapması olur.

## 24 Ağustos 2026: KKTC uyumu, araştırılmış hâliyle

Sahibi "kimse yapmıyor" gözlemiyle başladı ve tam kapsam uyum istedi. Önce piyasa,
sonra mevzuat okundu.

### Piyasa: gözlem doğru, ama iki farklı durum var

| Site | Analytics | Bildirim | Tutarlı |
|---|---|---|---|
| nimacyprus.com | yok | yok | evet, hiçbir şey toplamıyor |
| themeyhanerestaurant.com | var (`UA-59527972`) | yok | hayır |

Bizim GA4 öncesi konumumuz Nima'nınkiydi ve sayfa da bunu yazıyordu.

### Mevzuat: KKTC Kişisel Verilerin Korunması Yasası, **89/2007**

Kaynak `kvkk.gov.ct.tr`; yasa metni ve tüzük PDF olarak indirilip okundu. Önce
varsayılan "96/2018" numarası YANLIŞTI, araştırma düzeltti.

Bizi bağlayan dört madde:

- **Madde 6** işleme onaya dayanır, istisnaları sayılıdır (yasal yükümlülük, sözleşme,
  hayati çıkar, kamu görevi, üstün gelen yasal çıkar).
- **Madde 8** kontrolör, dosyalama sistemi kurup işlemeye başlamadan önce **Başkana yazılı
  bildirimde bulunmak zorundadır**; bildirim amaçları, alıcıları ve **üçüncü ülkelere önerilen
  transferi** de içerir. Madde 8(6)(B)'deki müşteri muafiyeti "verilerin üçüncü taraflara
  transfer edilmemesi kaydıyla" işliyor; GA4 Google'a aktardığı için **muafiyet düşüyor**.
- **Madde 11** diğer ülkelere transfer, Kurulun ücret karşılığı verdiği **"Transfer Ruhsatı"**
  ile mümkündür. Ruhsatsız yol Madde 11(2)(A)'dır: **bilgiye konu kişinin transfere onayı.**
- **Madde 13** ve altındaki **Bilgilendirme Yükümlülüğü Tüzüğü** metnin içeriğini sayıyor.

### Uygulanan: onay bandı, çünkü ruhsat yok

GA4 veriyi yurt dışına aktarıyor. Transfer Ruhsatı alınmadığı sürece tek hukuki yol
Madde 11(2)(A), yani onay. Bu yüzden ölçüm **opt-in** yapıldı:

- `lib/onay.ts` kararı `localStorage`da tutar; üç durum var ve varsayılan "karar-yok".
- `CerezOnayi` bandı basar ve `Olcumleme`yi YALNIZ "kabul" iken render eder: GA4 etiketi
  onaysız DOM'a hiç girmez. Build çıktısında doğrulandı, `out/index.html` içinde
  `G-N3893E7B1P` **0 kez** geçiyor.
- Tarayıcıda beş senaryo ölçüldü: ilk ziyaret ölçüm yok + bant var; kabul sonrası
  `gtag`+`collect` var + bant kapandı; sonraki sayfada sormadan ölçüyor; ret sonrası hiç
  istek yok; retli ikinci sayfada da yok.
- Reddetmek gerçek bir seçim: iki düğme aynı ölçüde, ret gizlenmedi.
- Mobilde bant eylem barının ÜSTÜNDE duruyor, örtmüyor (ölçüldü).

### Bilgilendirme metni Tüzüğe göre yeniden yazıldı

Tüzük Madde 4(2)'nin zorunlu listesi (kimlik, amaç, alıcılar, erişim ve düzeltme hakkı,
veri vermenin zorunluluğu, Madde 14-15 hakları) ve Madde 5'in usul kuralları karşılandı:
(8) amaç belirli ve sınırlı yazıldı, muğlak ifade yok; (10) aktarımın amacı ve alıcıları
adıyla belirtildi (Google Ireland Limited ve Google LLC); (11) **hangi işleme şartına
dayanıldığı açıkça yazıldı** (Madde 6, onay); (12) verinin **tamamen otomatik yolla**
elde edildiği belirtildi; (9) sade dil; (13) eksik veya yanıltıcı ifade yok.

Sayfa 4 bölümden **10 bölüme** çıktı ve **alt bilgiden bağlandı**: 13 Ağustos'ta sahibi
bağlantıyı "şimdilik" kaldırmıştı, o gün site hiçbir şey toplamıyordu. Tüzük Madde 5(5)
yükümlülüğün talebe bağlı olmadığını söylüyor, yani görünmeyen bildirim yükümlülüğü
karşılamaz.

### Kodla çözülemeyen iki madde, sahibine bildirildi

1. **Madde 8 bildirimi.** İşletmenin Başkana yazılı bildirimde bulunması gerekiyor.
   Form: `kvkk.gov.ct.tr` > Yardım Masası > Başkana Bildirim Formu.
2. **Madde 11 Transfer Ruhsatı.** Onay yolu şu an bizi taşıyor, ama ruhsat başvurusu
   ayrı bir seçenek; form yine aynı sitede.

**METİN HUKUKÇU ONAYINDAN GEÇMEDİ.** Madde numaraları yasadan birebir alındı ama
yorumu bir avukat yapmalı.

## 24 Ağustos 2026 (2. tur): gizlilik metni tasarım/içerik/yapı turunda güçlendirildi

Sahibi `/gizlilik/`'i tasarım, içerik ve yapı açısından kontrolden geçirmeyi istedi; içerik
gözden geçirilirken "hukuki metin yüzeysel kaldı" dedi. Yukarıdaki turun araştırması derindi
(Madde 6/8/11/13 doğru okunmuştu) ama sayfanın kendi metni o derinliğin hepsini taşımıyordu.
Yasa ve Tüzüğün resmi PDF'leri (`kvkk.gov.ct.tr`) yeniden okunarak iki gerçek eksik kapatıldı:

- **Kurul'a başvuru yolu eksikti.** "Haklarınız" yalnız işletmeye başvurmayı anlatıyordu.
  Yasa'nın 34'üncü maddesi ("Şikayet Başvurusu") bireye doğrudan Kurul'a başvurma hakkı
  veriyor, Kurul 30 gün içinde yazılı cevap vermekle yükümlü; Madde 14(3) ve 15(1)-(2) de
  aynı 30/15 günlük yanıtsızlık durumunda Kurul'a başvuruyu ayrıca öngörüyor. Tek cümle
  eklendi: yanıt gelmez veya tatmin etmezse Madde 34 uyarınca Kurul'a başvurulabilir.
- **Saklama süresi bir ilkeye dayanmıyordu.** "Ne kadar kalıyor" yalnız "Google hesabının
  ayarı" diyordu, hangi ilkeye göre olması gerektiğini söylemiyordu. Yasa'nın 5'inci
  maddesinin (1)'inci fıkrasının (Ç) bendi, verinin işlenme amacının gerektirdiğinden uzun
  tutulmamasını istiyor; cümle metne eklendi. Gerçek GA4 saklama süresi (property ayarı,
  2/14 ay gibi) bilinmiyor, uydurulmadı: bu, doğrulanacak ayrı bir madde.

**Kontrolör kimliği (Madde 4(2)(A)) yeniden değerlendirildi ve DOKUNULMADI.** Metnin
"Kontrolör Ciğerci Bozo, Naci Talat Caddesi No:4, Girne, KKTC" satırı ilk bakışta eksik
göründü (tüzel kişilik/vergi no yok), ama Tüzüğün gerçek metni yalnız "kimlik" istiyor,
sicil numarası şart koşmuyor. `content/isletme.ts`'te zaten tüzel kimlik alanı yok; eklenecek
bir alan varsa bu sahibinden gelecek bir karar, metin sapması değil.

**Yapıda bir regresyon bulundu ve düzeltildi:** `/gizlilik/`'in kendi alt bilgisi kendine
`<a href="/gizlilik/">Gizlilik</a>` basıyordu. Bu aynı sorunun ikinci turu: yukarıdaki 70.
satırda "bağlantı basılmaz" diye kayıtlı bir kural, link 13 Ağustos'ta kaldırılıp 24
Ağustos'ta geri getirilirken unutulmuştu. `Kabuk`'un zaten taşıdığı `aktif` prop'u
`AltBilgi`/`AltBilgiTam`/`TelifSeridi` zincirine eklendi, gizlilik rotasında bağlantı artık
hiç basılmıyor (`TelifSeridi.tsx`). 154/154 test, typecheck ve build temiz.

**Tasarım tarafında yeni bulgu yok:** `.icerik { max-width: 680px }`'in geniş masaüstünde
sağ yarıyı boş bıraktığı önceki turda zaten bulunmuş ve sahibine sorulmuştu, cevap gelmedi.

**METİN HÂLÂ HUKUKÇU ONAYINDAN GEÇMEDİ.**

## 24 Ağustos 2026: hikaye portresi ve gece şeridi kalktı

**Portre.** `bozo-portre` kaydından `dosya` satırı düştü (sahibi: "şimdilik kaldıralım").
Yuva öteki on altı bekleyen kare gibi boş plakaya döndü; dosya diskte duruyor, satırı geri
koymak yeterli.

**Gece şeridi.** "Gece açığız, ocak yanıyor" bandı üç alt sayfada (hikaye, gizlilik,
galeri) tek canlı gösterge olduğu için basılıyordu. Sahibi 24 Ağustos'ta kaldırdı.
`geceSeridiGosterilirMi` kuralı, iki çağrı yeri, bileşen ve testi tamamen silindi: kural
ölü koda dönüşmesin.

### Bir inceleme bulgusu ölçümle çürütüldü

İnceleme, lakap tablosunun canlıda bozuk olduğunu ve bunun öncelikli düzeltme olduğunu
söylüyordu: *"artist Kemoyakışıklıya"*, *"culuk İsmoboyu uzuna"*.

**Tablo doğru render ediliyor.** İki genişlikte ölçüldü: masaüstünde not `dd`nin içinde ama
157px sağında ayrı duruyor (x 679 > 836), telefonda `display:block` ile alt satıra iniyor.
Ekran görüntüsü üç sütunu düzgün gösteriyor: `Kemal — artist Kemo   yakışıklıya`.

Bildirilen dize yalnız `textContent` okunduğunda çıkıyor: DOM komşu düğümleri boşluksuz
birleştirir. Ham metin okumak render'ı ölçmez.

## 24 Ağustos 2026: hikaye sayfası yeniden kuruldu

Sahibi bir inceleme iletti ve "sen değerlendir, yaz, düzenle" dedi. `CLAUDE.md` kopya
uydurmayı yasaklıyor; bu tur sahibinin açık talimatıyla o kuralın istisnası, ama yine de
**tek yeni iddia eklenmedi**: yapılan kesmek, sıralamak ve mevcut cümleleri marka sesine
çekmek.

### Sıra değişti

`Portre > Lakap > Anlatı > Usul > Sofra`. Lakap anlatının önüne alındı: adın hikayesi
sayfanın en özgün malzemesi ve ortada kalıyordu. Yan etki olarak `Portre`nin notu ("Adın
hikayesi hemen aşağıda") ilk kez DOĞRU oldu; daha önce iki bölüm sonrasını işaret ediyordu.

### `Kapanis` bölümü tamamen silindi

İkinci bir kopyaydı: "Urfalıyım, geleneği getirdim, buradayım" iki kez anlatılıyordu.
Bileşen, CSS'i ve sözlük anahtarları kaldırıldı.

### Ölçülen temizlik

| Bulgu | Önce | Sonra |
|---|---|---|
| `Urfalı Ciğerci Bozo` (marka adı ihlali) | 2 | **0** |
| `lavaş` (menüde yok) | 2 | **0** |
| `közlenmiş biber` (menüde yok) | 1 | **0** |
| `lezzet` (yasaklı kelime) | 1 | **0** |
| `samimiyet`, `misafirperverlik` (kanıtsız iddia) | 1 | **0** |
| `sıradan bir kebapçı` (rakip imalı) | 1 | **0** |
| "ocağın başında, kapıda, sofranızın yanında" | 3 | **1** |

Lavaş ve közlenmiş biber sunuluyor olabilir ama kilitli ürün listesinde yoktu;
doğrulanmamış bilgi kuralı gereği metinden çıkarıldı, menüye eklenmedi. Sunuluyorlarsa
karar sahibinindir.

### Başlık ve etiket

H1 `Bozo bir marka ismi değil, ta kendisi` düştü: göndergesi yoktu ve kimse sormadan karşı
iddiayı gündeme getiriyordu. Yerine sahibinin kendi cümlesi geldi: **`Ben buradayım`**.
Cümle daha önce anlatının ortasında duruyordu, şimdi sayfanın başı; böylece tekrar da
ortadan kalktı.

`Usul` bölümünde `02 Ölçü` etiketi **`Porsiyon`** oldu: tane zaten bir ölçüdür, iki başlık
örtüşüyordu.

### Bir bulgu ölçümle çürütüldü

İncelemenin "öncelikli düzeltme" dediği bozuk tablo iddiası doğru değildi; ayrıntısı bir
üstteki kayıtta.

Sayfa 393 kelimeye indi (İngilizce 563).

## 24 Ağustos 2026: koordinat geldi, harita levhası gerçek oldu

### Koordinat üç bağımsız kaynakla doğrulandı

Sahibi verdi: `35.3370065, 33.3057253`, posta kodu `99300`. Nokta Google Maps'te kapıya
yakınlaşılmış (20.62z), yani sokak orta noktası değil. Üç kontrol:

| Kontrol | Sonuç |
|---|---|
| Nominatim'in Naci Talat Caddesi kaydı | Nokta caddenin sınır kutusu içinde, geocode'un merkezinden 32 m |
| OSM POI `Simple Cafe` | 48 m ötede, `housenumber=2, street=Naci Talat Caddesi, postcode=99300` → No:4 komşusu, posta kodu ikinci kez teyit |
| Tasarımın kendi `poiMacroMarket` çipi (bu dosya, "üçüncü POI çipi") | OSM'de `Macro` 59 m ötede. Ağustos'taki handoff ile bugünkü koordinat aynı noktayı gösteriyor |

Nokta 19 Mayıs Caddesi'ne 16 m, Naci Talat'a 32 m. Çelişki değil: bina iki caddenin
köşesinde, adresi Naci Talat'a kayıtlı. Tek bir geocoder'a güvenilmedi çünkü cadde + kapı
numarası çoğu serviste interpolasyonla gelir ve Girne'de 20-40 m sapabilir.

### `postalCode` JSON-LD'de hiç yokmuş

`lib/jsonld.ts` `PostalAddress` bloğu `streetAddress`, `addressLocality` ve `addressCountry`
yazıyordu; `postalCode` alanı yoktu. Yani posta kodunu `content/isletme.ts`'te doldurmak tek
başına arama motoruna ulaşmıyordu. Alan koşullu spread ile eklendi, null iken satır yine hiç
görünmüyor.

### `yolTarifiUrl()` beş yüzeyde birden davranış değiştirdi

Kod değişmedi, yalnız veri doldu: fonksiyon artık adres araması yerine
`dir/?api=1&destination=35.3370065,33.3057253` üretiyor. Mobil aksiyon barı, hero butonu,
footer, iletişim satırı ve çekmece hepsi gerçek yol tarifine bağlandı. İki test yer değiştirdi:
null dalı artık sahte nesneyle, koordinat dalı gerçek veriyle kapsanıyor.

### Levhanın çizilmiş yolları gerçek geometriyle değişti

Bu dosyanın "Konum hero'sunun sağ yarısı" kaydı 12 Ağustos'ta ertelenmişti, gerekçesi
"harita levhası hâlâ 'canlı harita entegrasyonla gelir' yazan bir yer tutucu" idi. Yer tutucu
kalktı.

Kaynak: OpenStreetMap, Overpass ile `way["highway"](around:320,...)`, 108 yol.
`components/sayfa/konum/haritaYollari.ts` (6.4 KB) üç katman taşıyor. Yaya yolu, patika ve
merdiven dışarıda: bu ölçekte doku değil gürültü ekliyorlardı.

Google Maps **alınmadı**. Gerekçe tek başına maliyet değil: hem ücretsiz `<iframe>` embed hem
JS API, sayfa açılır açılmaz ziyaretçinin IP'sini Google'a gönderir ve çerez yazar, yani GA4
ile teknik olarak aynı yurt dışı transferi. Bu sitede o transfer 89/2007 Madde 11(2)(A)
gereği `CerezOnayi`'nin arkasında; onaysız yüklenen bir harita o mimariyi en çok açılan
sayfada delerdi. SVG geometrisi çalışma anında hiçbir üçüncü taraf isteği yapmıyor, dolayısıyla
onay kapısı gerekmiyor. Ücretsiz embed ayrıca renklendirilemez, custom stil ise Google Cloud
projesi ve bundle içinde açık API anahtarı ister.

Renk sözleşmesi korundu, yeni token gelmedi: ana yol `--cizgi-hayalet`, ara yol
`--cizgi-harita`, servis `--cizgi-harita-ince`. Tarayıcıda doğrulandı, üçü de
`rgba(249,233,213,α)` olarak çözülüyor, yani palet takası haritayı da götürüyor. Bir raster
görsel bu vaadi bozardı; SVG tercihinin asıl sebebi bu, dosya boyutu değil.

`vector-effect: non-scaling-stroke` şart: `slice` ölçeği 320px ile 1440px arasında üç kattan
fazla değişiyor, ölçeklenen çizgi mobilde 3px'in altına iniyordu.

### İki bilinçli sapma

| Sapma | Ölçüm ve gerekçe |
|---|---|
| Pin 42%/47% yerine levhanın tam ortasında | `preserveAspectRatio="xMidYMid slice"` yalnız **merkezi** sabit tutar. Yüzdeyle konumlanan bir pin geometriden kayar, çünkü kırpma ekseni en-boy oranıyla değişiyor: 1440px'te levha 1180x522 (genişlik sürücü), 390px'te 342x490 (yükseklik sürücü). Ortada duran pin her oranda aynı sokağın üstünde kalıyor |
| Cadde etiketi yolun üstünde yüzen etiket değil, köşe alt yazısı | Aynı sebep. Ayrıca SVG `<text>` denendi ve elendi: viewBox birimiyle yazılan metin masaüstünde 12px iken mobilde 3.9px'e iniyor, iki ayrı font boyutu ise iki ayrı viewBox gerektiriyordu |

### ODbL atıf satırı

`© OpenStreetMap katkıcıları` / `contributors` eklendi (`konum.harita.kaynak`). Lisans
zorunluluğu, "yeni pazarlama metni yazma" kuralının kapsamında değil. Renk `--krem-50`:
bordo zeminde 4.53:1, AA'yı geçen en sönük adım. `--krem-32` 2.61:1 kalıyordu ve yasal bir
satır için okunamazdı.

### Yan bulgu: pin etiketi 320px'te kırpılıyordu

Ölçüldü: 320px'te levha 272px, etiket 142px. Tasarımın `left:42% + 18px` konumu etiketi 2px
taşırıyordu; pini ortalamak bunu 24px'e çıkardı, yani `overflow:hidden` marka adını kesiyordu.
480px altında etiket pinin sağına değil üstüne ortalanıyor: 320px'te iki yanda 65px, 390px'te
100px boşluk kaldı. Aynı kuralda kaynak satırı da cadde etiketinin altına iniyor, yoksa ikisi
aynı satırda çakışıyordu.

### Ana sayfanın levhası da gerçek oldu, ama dar çerçeveden

Sahibi aynı gün istedi. Ana sayfada iki harita levhası bir gerçek bir şematik kalsaydı asıl
tutarsızlık o olurdu.

Aynı 640 m'yi 528x420'lik levhaya sıkıştırmak Konum sayfasının küçültülmüş kopyasını
üretirdi. Bunun yerine aynı veri dar çerçeveden okunuyor: `ANA_PENCERE = '300 300 400 400'`,
yani 256 m. Ölçüldü, yakın çevre dış mahallelerden sık olduğu için dar çerçeve seyrek
kalmıyor: yoğunluk 1000 birimde 12.5, 640'ta 14.6, 400'de 17.0. İki levha artık kademe
oluşturuyor, ana sayfa yakın plan, Konum sayfası bağlam.

`CLAUDE.md`'nin "ortaklaştırma denemesi kapandı" kaydı geçerliliğini koruyor: paylaşılan
bileşen değil, `components/sayfa/haritaYollari.ts` veri modülü (bu yüzden `konum/` altından
bir üst dizine taşındı). Zemin, halka, nabız, etiket tipografisi ve ölçüler ayrı kaldı.

Nabız ve halka 46%/53%'ten ortaya alındı, cadde etiketi köşe alt yazısı oldu; gerekçe
Konum levhasıyla aynı. İşletme adı etiketi nabza bağlı olduğu için dokunulmadı.

Mobilde (1040px altı) çizgiler inceltildi (10/5/2.5 → 7/3.5/1.75): levha 420px'ten 180px'e
düşerken aynı kalınlık ana yolu levhanın yarısı kadar gösteriyordu. Tasarımın gizlediği iki
etiket gizli kaldı, atıf satırı kalmak zorunda: ODbL onu veriyi gösteren her yüzeyde istiyor,
yani ana sayfa artık bir yasal satır taşıyor.

### Açık kalan

- Bu dosyanın "Yol Tarifi Al butonunun etiketi" kaydı duruyor. Hedef hâlâ sayfa içi `#harita`,
  ama artık oraya kaydırmak gerçek bir haritaya götürüyor, yani çelişki yumuşadı. Metin sahibin.
- Konum hero'sunun sağ yarısındaki boşluk kararı artık açılabilir: erteleme gerekçesi olan
  yer tutucu kalktı.

## 24 Ağustos 2026: alt bilgiye kelime markası, ve rozet ezilmesi iddiası

### F1 geri alındı, alt bilgi artık işaret taşıyor

18 Ağustos 2026'da sahibi alt bilginin yalnız kelime kilidi taşımasına karar vermişti (F1);
24 Ağustos'ta kendi kelime markası varlığını verdi ve onun basılmasını istedi. Karar
sahibinin, kayıt burada duruyor.

`MarkaKilidi`'nin `sadeceKelime` varyantı silindi: tek çağıranı alt bilgiydi. Prop ve
`.kelime` CSS kuralları da gitti, "no dead code".

### Varlık bir auto-trace çıktısıydı, temizlendi

`Bozo-Typo.svg` Illustrator Image Trace ürünü. İmzası sayılabilir: aynı kremin **16 tonu**
(#fbd2aa, #fcd1aa, #fdd2ab...), siyahın 8 tonu, kırmızının 3 tonu, artı 4 kahverengi path
(kenar yumuşatma artefaktı, gerçek bir renk değil). Tek grup, yapı yok.

Yapılan: 16 krem tek renge, 8 siyah tek renge, 3 kırmızı tek renge indirildi, 4 artefakt
path silindi. 16.9 KB → 14.9 KB, görünüm değişmedi.

### Plakalı varyant seçildi

Üç varyant üretilip bordo zeminde 200/150/110px'te karşılaştırıldı:

| Varyant | Ne | Ölçüm |
|---|---|---|
| A, seçilen | Siyah banner plakası korunur | Tasarıma sadık; footer'ın tek opak plakası olur ve arkasındaki kor sahnesini keser |
| B | Plaka ve kenarlığı çıkar (path 0 ve 1) | Harflerin kendi krem konturu okunabilirliği taşıyor, kor ışığı aralarından geçiyor |
| C | Plakasız + token renkleri | 110-150px'te en net okunan, ama asset'in koyu vintage kırmızısı gidiyor |

Ölçüm, plakanın dekoratif olmadığını gösterdi: asset'in kırmızısı `#80070F` bordo zeminde
**1.63:1**. Plakasız varyantlarda kırmızıyı okunur kılan şey banner değil, her harfin kendi
krem konturu.

Sahibi A'yı seçti. Renkler sabit, palet takasını takip etmiyor; bu kayıtlı bir istisna
(`CLAUDE.md` > Colors, marka işaretleri kapalı renk listesinin dışında, WhatsApp ve Instagram
ile aynı gerekçe).

`<img>` tercih edildi, satır içi SVG değil: alt bilgi dört rotada basılıyor, gömmek her
sayfaya 15 KB eklerdi ve optimize edilecek bir raster yok.

### Rozetin "yanlardan basık" göründüğü iddiası: ölçümle çürütüldü

Sahibi üst bardaki rozetin yatayda ezilmiş göründüğünü bildirdi. Ezilme yok:

| Ölçüm | Değer |
|---|---|
| Kaynak `Bozo.svg` viewBox | `0 0 1748.44 1998.84`, oran 0.8747 |
| Yayındaki `public/marka/rozet.svg` | Aynı viewBox, aynı oran |
| Tarayıcıda render | 122 x 139.47, oran **0.8747** |
| `transform` / `object-fit` | `none` / etkisiz (`height: auto`) |
| Mürekkep sınırları | viewBox'a birebir, dört kenarda 0 boşluk |
| En dış şeklin merkezi | x = 874.2, viewBox merkezi 874.22 |

Krem katman merkezden %0.16, kırmızı katman %0.8 sapıyor; ikisi de gözle görülmez.

Algının iki gerçek sebebi var, ikisi de kusur değil: rozet gerçekten uzun (0.8747, yani
eninden %14 uzun) ve yatay bir barda yatay metnin yanında duran uzun bir nesne dar okunur;
ayrıca `drop-shadow(0 12px 30px)` gölgeyi 12px AŞAĞI atıyor, bu da dikey uzantıyı artırıyor.
Rozeti daha geniş göstermek istenirse kaldıraç bir hata düzeltmesi değil, ya çizimin kendisi
ya da bardaki genişliği (`Rozet.module.css` `.bar img { width: 122px }`).

## 8 Ekim 2026: Google Maps kaydı

### Google Maps kaydı

Sahibi iki link verdi: bir Maps yön tarifi linki (`kgmid=/g/11nvgcy061`, `geocode=KR88ykmHbd4UMTdnn1lSkPrH`)
ve `share.google/M95ofse5hq58fUXBg`. İkincisi yalnız "Ciğerci Bozo" aramasını açıyor; kalıcı kimlik ilkinde.

| Kimlik | Değer | Nasıl elde edildi |
|---|---|---|
| Özellik kimliği (FID) | `0x14de6d8749ca3c1f:0xc7fa9052599f6737` | `geocode` base64 protobuf, çözüldü |
| CID | `14409988641090660151` | FID'in ikinci yarısı |
| Place ID | `ChIJHzzKSYdt3hQRN2efWVKQ-sc` | FID protobuf olarak yeniden paketlendi |

Üçü de tarayıcıda doğrulandı: `?cid=` ve `query_place_id` "Ciğerci Bozo" kartını açıyor;
`destination=Girne&destination_place_id=...` bile hedefi "Ciğerci Bozo" yapıyor.
`content/isletme.ts` > `googlePlaceId` yalnız Place ID'yi tutuyor, linkleri `lib/site.ts` kuruyor.

Kartın içeriği sitedeki verilerle birebir: ad, adres (`Naci Talat Cd 4, Girne 99300`), telefon,
web sitesi, her gün 10:00-05:00. Kategori "Restoran". Google'ın pini (35.3371843, 33.305993)
sahibinin verdiği kapı noktasından yaklaşık 30 m uzakta; `koordinat` değiştirilmedi.

**Bulunan hata, düzeltildi.** Canlıdaki "Yol Tarifi Al" koordinata gidiyordu ve Maps hedefi
**"Kıbrıs İnşaat, Girne 99300"** diye gösteriyordu: koordinata en yakın kayıtlı yer. Place ID
koordinatla birlikte verilince yok sayılıyor, metin hedefle birlikte verilince önceliği alıyor;
`yolTarifiUrl()` artık `destination=<adres metni>&destination_place_id=<id>` üretiyor. Altı
çağrı yerinin hiçbiri değişmedi.

JSON-LD `Restaurant` artık `hasMap` taşıyor ve aynı kart linki `sameAs`'e eklendi (Instagram'ın
yanına): sitedeki varlığı Google'daki kayda bağlıyor.

## 8 Ekim 2026: ciğer porsiyonu 12 şiş

Sahibinin kararı, 8 Ekim 2026: porsiyon 8 değil 12 şiş. Altı metinde değişti: menü kartı
`cigerSpec.sis`, ana sayfa sayacı `iddia.sayac1`, hikaye `usul.olcuSisSayisi`, iki dilde.
Handoff ve `metin-envanteri.json` hâlâ 8 yazıyor; bir parite turu farkı kusur sanmasın diye
`sozluk_cigerPorsiyonu_heryerdeOnIkiSistir` testi altısını birden kilitliyor.

Sayaç artık 0'dan 12'ye iki basamağa sayıyor. Ölçüldü (360px): hücre boyutu sayım boyunca
83x119 sabit, `layout-shift` girdisi sıfır; 320px'te rakam 39px, kutusu 58px.

## 8 Ekim 2026: fiyat listesi

Kaynak: sahibinin fiyat listesi ekran görüntüsü, 8 Ekim 2026. Belirsiz dört nokta sahibine
soruldu; cevapları aşağıda "sahibi" diye geçiyor.

**Ölçü modeli değişti.** Tam / Yarım (tamın yarısı) / Dürüm kalktı; yerine listedeki Porsiyon /
1,5 Porsiyon / Dürüm / 1,5 Dürüm geldi. Listede olmayan ölçü basılmaz (sahibi: "listedeki gibi"):
kuşbaşının dürümü ve karışığın porsiyon dışı ölçüleri kalktı. Yarım dipnotu da gitti.

| Ürün | Önce (tam / dürüm) | Şimdi (porsiyon / 1,5 / dürüm / 1,5 dürüm) |
|---|---|---|
| Ciğer | 800 / 500 | 690 / 900 / 690 / 900 |
| Dalak | 600 / 400 | 550 / 800 / 550 / 800 |
| Yürek | 700 / 450 | 550 / 800 / 550 / 800 |
| Terbiyeli Tavuk Şiş | yoktu | 450 / 650 / 450 / 650 |
| Terbiyesiz Tavuk Şiş | 600 / 400 | 450 / 650 / 450 / 650 |
| Terbiyeli Kuşbaşı | 850 / 550 | 850 / 1.200 / - / - |
| Bozo Karışık | 800 / 500 | 600 / - / - / - |
| Bozo Special | 1.000, "10 şiş" | 1.100, "250 gr" |

- **Terbiyeli Tavuk Şiş** açıklamasız eklendi (sahibi); açıklama uydurulmadı. Yalnız menüde: ana
  sayfa her kalemi açıklamasıyla basıyor. Kendi foto yuvası var (`terbiyeli tavuk şiş karesi`),
  fotoğrafçı iki tavuk şişi ayrı çeksin diye; manifest 17 kareye çıktı, galeri metni "on yedi".
  Menü spotu ve meta açıklaması "yedi porsiyon" oldu, `menu_porsiyonSayisi_metindekiSayiylaAyni`
  sayıyı ürün listesine kilitliyor.
- **Bozo Special:** sahibi "fiyat listesinde ne varsa" dedi. "10 şiş" çipi "250 gr" oldu;
  "Her üründen iki şiş" açıklaması da kalktı, çünkü 10 şiş iddiasının cümle hâliydi.
- **İçecekler ilk kez fiyatlı.** Listede olmayanlar kalktı (sahibi): Sprite, Fuse Tea, Şalgam,
  Çay, Fanta şişe ve ml bilgileri. Ayran "Kapalı" yerine listedeki Büyük (27) / Küçük (22);
  listedeki "Açık" sahibinin daha önce verdiği "Açık Yayık" adıyla kaldı. "İçecek fiyatları
  açılışta kesinleşir" notu kalktı.
- JSON-LD `Menu` artık her ölçüyü ayrı `Offer` olarak ve içecekleri kendi bölümünde taşıyor.

**Açık kalan, sahibinde:**
1. Dürüm notu hâlâ "5 şiş". Dürüm artık porsiyonla aynı fiyatta (ciğerde ikisi de 690 TL, porsiyon
   12 şiş); not doğru mu?
2. `priceRange` (20-1.100 TL) JSON-LD'de yayımlansın mı? En ucuz kalem su; aralık yemeğin
   fiyatını olduğundan düşük gösterebilir.
3. Terbiyeli Tavuk Şiş açıklaması.

## 8 Ekim 2026: İngilizce metin denetimi (İngilizce turunun girdisi)

Yalnız okuma; hiçbir metin değiştirilmedi. İngilizce tur bu listeden başlar. Handoff'tan gelen
cümleler sessizce düzeltilmez, buraya ölçümüyle yazılır (KISITLAR.md).

**Kesin hatalar** (kaynakta doğrulandı):
- Anlam kayması: `en/menu.ts:52` lebeni "Served before the fire."; TR "Şişlerden önce gelir"
  (şişlerden önce).
- Saat biçimi: `en/ortak.ts:75, 88, 138` "Closed only between 05:00 and 10:00" ve `en/konum.ts:17`
  "05:00 to 10:00"; kural `10:00 - 05:00` biçimi, TR ikizleri uyuyor.
- Ülke adı üç biçimde: "TRNC" (`en/ortak.ts:82`), "Northern Cyprus" (`en/gizlilik.ts`),
  "KKTC" (`en/gizlilik.ts:77`, İngilizce metinde Türkçe kısaltma).
- `tane` üç karşılıkla: çoğunlukla "the cut", ama "Bead measure" (`en/ana.ts:12`) ve "piece(s)"
  (`en/ana.ts:11`, `en/hikaye.ts:56`, `en/menu.ts:33`); "piece" yasaklı "parça"nın karşılığı.
- Kısa çizgi eksik: "Urfa style liver" (`en/ortak.ts:98, 111, 113`), "Ember Roasted Onion"
  (`en/menu.ts:65`), "AI generated" (`en/galeri.ts:11`), "Firm textured" (`en/ana.ts:53`,
  `en/menu.ts:28`).
- Gizlilik meta açıklaması 27 karakter: "How this site handles data." (`en/ortak.ts:140`);
  TR ikizi de aynı kısalıkta.

**Yargı gerektirenler:** "on beşte bir" EN'de "every fifteen minutes" olmuş, TR birim
söylemiyor; "The table and the fire are on us" (`en/ortak.ts:93`) yemeğin bedava olduğu gibi
okunabilir; "English (Türkçe)" ad kalıbı ürünlerde var, Lebeni/Bostana/Ayran'da yok, Şalgam
tersine dönmüştü (Şalgam bu turda menüden kalktı); Terbiyeli/Terbiyesiz kelime oyunu İngilizcede
kayboluyor ve "Chicken Skewer (Terbiyesiz...)" açıklaması "with an Urfa marinade" diyor; hikaye
etiketleri ("The name", "The cut") cümle düzeninde; virgüllü bağlama (comma splice) beş yerde;
yazım tutarlı biçimde İngiliz İngilizcesi (`en_GB`).

## 8 Ekim 2026: İngilizce tur, uygulandı

Yukarıdaki denetimin uygulaması. Sahibine dört soru soruldu; cevaplar "sahibi" diye geçiyor.

**Ana sayfa fiyat cümlesi kalktı (canlıdaki hata).** "Her üründe tam, yarım ve dürüm var. Yarım
porsiyon tam fiyatın yarısıdır." fiyat listesi turunda gözden kaçmış ve yayına çıkmıştı. Sahibi
kaldırılmasını seçti; blokta başlık ve iki buton kaldı. `sozluk_kalkmisYarimPorsiyonaDegimez`
iki dilde "yarım/half" geçen her metni yakalıyor.

| Nerede | Önce | Şimdi | Neden |
|---|---|---|---|
| `en/menu.ts` lebeni | Served before the fire. | Served before the skewers. | TR "şişlerden önce" |
| `en/ortak.ts` x3, `en/konum.ts` | between 05:00 and 10:00 / 05:00 to 10:00 | 05:00 - 10:00 | Saat yazım kuralı; `sozluk_saatAraligiTireyleYazilir` |
| `en/gizlilik.ts` | KKTC Personal Data Protection Law | TRNC ... | İngilizcede Türkçe kısaltma |
| EN, beş yer | Urfa style liver, Ember Roasted, AI generated, Firm textured | kısa çizgiyle | Birleşik sıfat |
| `en/ortak.ts` alkolsuz | The table and the fire are on us, come again. | We look after the table and the fire. Come again. | "On us" bedava demek (sahibi onayladı) |
| `sayfaMeta.gizlilik`, iki dil | 26-27 karakter | sayfanın kendi giriş cümlesi | Arama sonucunda boş açıklama |
| `en/hikaye.ts` | renewed every fifteen minutes | refreshed ... | Ana sayfayla aynı fiil; "15 dakikada bir" sahibince doğrulandı |
| `en/hikaye.ts` | alcohol-free, the fire is the show | ...; the fire... | Virgüllü bağlama, TR noktalı virgül |
| `en/ana.ts` tane rayı etiketi | Bead measure: ... | Per skewer: ... | Ekran okuyucu etiketi; "bead" anlamsız |
| `en/ana.ts` servis etiketi | {yuzde}% served | service {yuzde}% | Yemeğin yüzdesi gibi okunuyordu; TR "servis %" |
| `en/menu.ts` QR notu | The same list runs behind the table QR | The QR menu on the table shows the same list | TR'nin anlamı |
| `en/hata.ts` | pick up from below | carry on from the links below | Altta iki bağlantı var |
| `en/gizlilik.ts` amaç | The purpose is single and limited to this | There is one purpose and processing stays within it | Doğal İngilizce, anlam aynı |

**Bilinçli bırakılanlar.** Denetimin "piece" bulgusu geri çekildi: "parça" yasağı Türkçe kilit,
İngilizcede "each piece" tek bir tanenin doğal adı. Hikaye başlığı "The name" bir sayfa başlığı
(h2), cümle düzeni doğru. Ülke adı: düzyazıda "Northern Cyprus", dar alt bilgide "TRNC";
İngilizcenin olağan kısaltma kullanımı. "Bozo is not a brand name, it is the man himself"
handoff başlığı, üslup kararı olarak kaldı. Tavuk şişlerin İngilizce adları değişmedi: sahibi
kararı bıraktı, iki ürünün gerçek farkı bilinmeden ada olgu eklenmez; Terbiyeli Tavuk Şiş
açıklaması gelince ikisi birlikte hizalanır. 404 sayfasının Türkçe meta açıklaması statik
export'un tek `404.html`'inden geliyor, sayfa `noindex`; bilinen sınır.

## 8 Ekim 2026: mobil performans teşhisi (DEVAM madde 7)

Yalnız teşhis, kod değişmedi. Canlı site (`9568c58` build'i), Chrome DevTools izi, 412x823
DPR 1.75, Slow 4G + 4x CPU, her ölçüm ayrı izole bağlamda soğuk önbellekle.

### LCP

| Ölçüm | FCP | LCP | LCP öğesi |
|---|---|---|---|
| Ana sayfa, kısıtlı | 2592 ms | 2906 ms | üst bardaki `rozet.svg` |
| Aynısı, rozetin `filter`'ı kapalı | 2572 ms | 2572 ms | açılış paragrafı (`Acilis govde`) |
| Ana sayfa, kısıtsız | 736 ms | 884 ms | `rozet.svg` |
| `/menu/`, kısıtlı | 2948 ms | 2948 ms | H1 |
| `/konum/`, kısıtlı | 2600 ms | 2600 ms | H1 |

**Rozet LCP'yi metinden sonraya itiyor, sebebi gölgesi.** Rozet mobilde 76x87 px (6.612 px²),
paragraf 24.287 px². Chrome rozetin alanını 36.524 px² sayıyor: `.rozet img`'deki
`drop-shadow(0 12px 30px ...)` görsel alanı büyütüyor. Yalnız bu filtre kapatılınca rozet
aday olmaktan çıktı ve LCP FCP'ye eşitlendi (kısıtlı -334 ms, kısıtsız -148 ms). Rozet
`rozet.svg` 65,4 KB ham / 26,6 KB zstd, 230 path; yüklenmesi metinden geç bitiyor.

**FCP'yi ana CSS belirliyor.** HTML 885 ms'de geliyor (TTFB 468 ms, HTML Cloudflare'de
`DYNAMIC`). Üç render-blocking CSS'in büyüğü (`3cgtql0h7uzk_.css`, 92 KB ham / 14,4 KB br)
~2450 ms'de bitiyor, metin 120 ms sonra boyanıyor. 14 KB'ın 1,6 s sürmesinin sebebi aynı
anda (882 ms) istenen ~280 KB kritik olmayan yük: 4 font ön yüklemesi 92 KB, 9 JS parçası
157 KB, 2 SVG ön yüklemesi 33 KB.

- Ana CSS bütün sayfaların modüllerini taşıyor (Gizlilik, Hata, Lakap, Usul, UrunKarti...).
  Ana sayfada kuralların %33'ü kullanılmıyor (105 KB serileştirilmiş metnin 35 KB'ı; 7 KB'ı
  açılınca kullanılan `Cekmece`). Turbopack'in varsayılan `cssChunking: true` birleştirmesi.
- `kelime-markasi.svg` alt bilgide (y=5326) ama `<img>` lazy olmadığı için React ona
  otomatik `preload` basıyor; rozetle aynı anda iniyor.
- JS'in 157 KB'ının 105 KB'ı React/Next çerçevesi (`react-dom` 228 KB ham). Burada kaldıraç yok.
- `_next/static/*` hash'li ama `cache-control: max-age=14400`: origin başlık göndermiyor,
  4 saat Cloudflare'in varsayılanı. Yalnız tekrar ziyareti etkiliyor.

### CLS

Ağustos'taki ara sıra 0,1 üstü CLS bugünkü build'de **yeniden üretilemedi.**

| Sayfa / koşul | CLS | Kaynak |
|---|---|---|
| Ana, Girne 14:00 / 02:00 / 04:30 (açık) | 0,0014 | `DurumCipi` hidrasyonda 182 → 124 px |
| Ana, Girne 07:00 (kapalı) | 0,0009 | `DurumCipi` 182 → 142 px |
| Ana, kısıtsız | 0,0014 | aynı |
| `/menu/` | 0,0012 | font takası (çip genişliği), `CanliSaat` |
| `/konum/` | 0,0011 | `CanliSaat` |

Saat `Date` kaydırılarak dört durumda ölçüldü: statik HTML `null` yer tutucuyla geliyor,
fark yalnız çipin genişliği, dikey kayma yok. Çerez bandı `position: fixed`, kayma
üretmiyor. Archivo'nun iki dosyası FCP'den sonra iniyor ama `size-adjust`'lı yedek yazı
tipi sayesinde takas ölçülebilir kayma yapmıyor.

### Düzeltme adayları (karar ayrı, uygulanmadı)

1. Rozetin gölgesini LCP alanını büyütmeyecek biçimde vermek (ör. filtreyi `<img>` yerine
   kapsayıcıya taşımak). Etkisi yeniden ölçülmeli; görünüm değişmemeli.
2. Alt bilgi kelime markasına `loading="lazy"`: otomatik ön yükleme kalkar.
3. `cssChunking: 'graph'` ya da `inlineCss` (ikisi de Next 16'da deneysel, belgeleri
   `node_modules/next/dist/docs/.../cssChunking.md`, `inlineCss.md`). İkincisi her HTML'e
   ~14 KB ekler ve CSS önbelleğini kaybeder.
4. `.htaccess`'te `_next/static/` için `max-age=31536000, immutable`.
5. `rozet.svg`'yi sadeleştirmek: logo varlığı, rozet kararındaki üç ölçüm gerekir.

## 8 Ekim 2026: çerez bandı metni kısaldı

Kullanıcının isteği: eski metin amatör duruyordu, yaygın standarttaki en kısa ve yalın hâli
istendi.

| | Önce | Şimdi |
|---|---|---|
| TR metin | Ziyaret sayısını Google Analytics ile ölçmek istiyoruz; çerez yazar, veri yurt dışına gider, onayınız olmadan başlamaz. | Ziyaretleri ölçmek için çerez kullanıyoruz. Veriler yurt dışına aktarılır. |
| TR düğmeler | Kabul ediyorum / İstemiyorum | Kabul Et / Reddet |
| EN metin | We'd like to measure visits with Google Analytics; it sets a cookie, sends data abroad, and won't start without your consent. | We use cookies to measure visits. The data is transferred abroad. |
| EN düğmeler | I accept / No thanks | Accept / Reject |

**Yurt dışı cümlesi bilerek kaldı.** Ruhsat olmadığı için GA4'ün tek dayanağı Madde 11(2)(A),
yani kişinin aktarıma onayı; kişi onay anında aktarımı bilmezse onay o aktarıma verilmiş
sayılmaz. Google'ın adı ve alıcılar "Ayrıntılar"daki gizlilik sayfasında. "Onayınız olmadan
başlamaz" düştü: iki eşit düğme bunu zaten söylüyor.

Gizlilik sayfası düğmeleri adıyla anıyordu (`dayanakMetni`, `geriAlmaMetni`), iki dilde
güncellendi; `gizlilik_bantDugmeleriniGuncelAdlariylaAnar` artık bu kaymayı yakalıyor.
Ölçüldü: 320, 390 ve 1440'ta taşma yok, düğmeler 44px, bant mobilde iki satır.

## 8 Ekim 2026: rozet gölgesi ayrı katmana taşındı (teşhis adayı 1)

Gölge `<img>`'den çıkıp görselin arkasında ayrı bir katmana geçti: rozet SVG'si maske olarak
verilmiş düz siyah bir katman, bulanıklık dış sarmalayıcıda. Aynı öğede `filter` maskeden
önce uygulandığı için tek katmanda silüet keskin kalıyordu (ölçüldü, sonra ayrıldı).

- **Kapsayıcıya taşımak işe yaramadı:** filtre `<a>`'dayken de rozetin LCP alanı 36.524 px²
  kaldı; Chrome atadaki filtreyi de görselin alanına katıyor.
- **Maske LCP adayı değil:** canlıda CSS enjeksiyonuyla, mobil kısıtlı soğuk yükleme: LCP
  2906 → 2500 ms, öğe artık açılış paragrafı ve LCP = FCP. SVG ikinci kez inmiyor, maske
  isteği önbellekten 0 KB.
- **Görünüm aynı:** 390px DPR 3'te eski filtreyle yeni katman aynı sayfada karşılaştırıldı;
  gölge bölgelerinde en büyük fark 4/255, ortalama parlaklık farkı 1'in altında. Tek görünür
  fark rozetin sol alt kenarında 4x2 CSS piksellik kenar yumuşatması.
- Boy ve sarkma payları `img`'den `.cerceve`'ye taşındı; dört boy ve daralma geçişi gölgeye
  kendiliğinden uyuyor. `-webkit-mask-image` Chrome 120 ve iOS 15.4 öncesi için.

## 8 Ekim 2026: site uygulama olarak kurulmayı önermiyor

Kullanıcı bildirdi: telefonda "Uygulamayı yükle" önerisi çıkıyordu. Kaynağı iki sinyal:
favicon üreticisinden gelen `site.webmanifest` > `"display": "standalone"` ve Next'in
`appleWebApp` verilince varsayılan olarak bastığı `<meta name="mobile-web-app-capable" content="yes">`.
İkisi de karar değildi, varsayılandı.

- `display` → `"browser"`. Tam Chrome'un kurulabilirlik denetimi (CDP
  `Page.getInstallabilityErrors`, Playwright `channel: 'chrome'`) yeni manifest için
  `manifest-display-not-supported` döndürüyor. Playwright'ın headless shell'i bu denetimi
  taşımıyor, her manifest için boş liste dönüyor: ölçüm tam Chrome'la yapılmalı.
- `appleWebApp.capable: false`: meta etiketi kalktı, ana ekrana elle eklenen kısayol uygulama
  gibi değil tarayıcıda açılır. İkon, tema rengi ve `apple-mobile-web-app-title` duruyor.
- `manifest_kurulabilirUygulamaIlanEtmez` ikisini de kilitliyor.

## 8 Ekim 2026: mobilde masaüstünde olmayan içerik kalmadı

Sahibinin kuralı: masaüstünde olmayan içerik mobilde olmaz, mobile özel yapı (çekmece, alt
bar, gezinme) kalır (`KISITLAR.md` > Copy rules). On iki rota 1440 ve 390'da, çekmece de
açılarak görünür metin bazında karşılaştırıldı (Playwright, `checkVisibility`).

- Kapalı çekmeceyle yalnız mobilde görünen tek şey alt eylem barı: yapı, kaldı.
- Çekmecede telefon, WhatsApp ("WhatsApp'tan Yaz" konum sayfasında aynı etiketle),
  Instagram, adres, saat ve "Mekanımız alkolsüzdür" masaüstünde de var: kaldı. Bölüm çipleri
  ve sayfa bağlantıları gezinme: kaldı.
- **Kalkan:** çekmecenin durum alt metni "Ocak 05:00'e kadar yanıyor" / "Kapalı aralık"
  (`DurumAltMetni`). Masaüstünde karşılığı yoktu. Bileşen, CSS'i ve `ortak.durum.acikAlt`
  silindi; `kapaliAlt` masaüstü `KapanisNotu`'nda kullanıldığı için duruyor. Durum satırı
  açık/kapalı x 320/390 x TR/EN'de 47px, taşma yok.

## 8 Ekim 2026: tam kapsam genel kontrol

On iki rota x 320/390/768/1040/1440 (Playwright: konsol, ağ, taşma, kırpılma, metin
kuralları, başlık/landmark/ARIA, görsel, link, sentetik kalınlık, dokunma hedefi), 390 ve
1440'ta axe-core 4.13 (WCAG 2.2 AA + best-practice), etkileşimler (çekmece, çerez, klavye,
azaltılmış hareket, JS kapalı, saat çipi sınır anları), canlıda 24 soğuk LCP/CLS ölçümü,
ayrı bir kod okuması ve ekran görüntüleriyle görsel tur. Ham çıktılar `/tmp/bozo-kontrol/`.

### Uygulandı

| Bulgu | Değişiklik | Ölçüm |
|---|---|---|
| `next 16.3.0` npm audit: 1 kritik, 2 yüksek (dokuz next uyarısı, sharp, source-map-js) | `next 16.3.8`, `source-map-js` 1.2.2 (zorlamasız `audit fix`) | `npm audit` 0 açık |
| Galeri mobil LCP 3,2-3,4 sn (canlı), tek sayfa 2,5 sn üstünde | İlk karo `oncelikli`: `loading="eager"`, `fetchPriority="high"` | Yerel kısıtlı: 5,6 → 4,6-5,0 sn. **Canlıda değişmedi** (3,26-3,46 sn): istek zaten ilk partide (680 ms) başlıyor, LCP = 165 KB'ın inişinin bittiği an. Kalan kaldıraç dosya boyutu, sahibinin karesine dokunur |
| Çekmece numaraları Bevan 600, sentetik kalın | `.no` ağırlığı `.link`'ten (400) miras alıyor | Hesaplanan Bevan 400, genişlik 22px aynı |
| Telif şeridindeki "Gizlilik" 40x15, genişletmesiz tek alt bilgi linki | `.yolTarifi` ile aynı `::before` | 48x44 |
| axe `region`: aksiyon barı landmark dışında (12 rota, 390) | `<nav aria-label="Hızlı eylemler">`, ad testi üç landmark'ı kapsıyor | axe 0 ihlal (390 ve 1440) |
| React alt bilgi kelime markası için her sayfada `preload` basıyordu | `loading="lazy"` | Preload yok; ana sayfada kaydırmadan inmiyor |
| JSON-LD `<` kaçışsız | `jsonLdMetni()`, Next JSON-LD rehberindeki kaçış | 5 sayfada 11 blok anlamca aynı |
| Ölü kod | Buton/Cip/FotoYuvasi/TaneDizilimi varyantları, 12 token, `geceSerit`, `KAPSAM_METRE` ve dört küçük kalıntı | 17 sayfanın render HTML'i aynı, CSS 109,0 → 106,4 KB |
| Galeri LCP, eager'dan sonra (`d72d884`, deploy edilmedi) | `tane-yakin-cekim.webp` aynı 800x993 kare, `cwebp -q 70 -m 6 -sharp_yuv`. Mobil varyant elendi: dosya zaten DPR 2 yuva ölçüsünde, 390'daki karo 342x253, 3x'te 1026px istiyor. Aynı ayarla q80 yalnız %4 küçültüyor, kare yoğun dokulu | 165 → 126 KB, PSNR 35,3 dB, 2x büyütmede fark görülmüyor. Yerel kısıtlı medyan 4964 → 4180 ms, ana sayfa aynı (LCP orada metin). Canlı ölçüm deploy'dan sonra |
| `FotoYuvasi` `sizes` propu ve iki çağrı değeri (`d521116`) | Silindi: `images.unoptimized` altında Next `sizes`'ı `undefined` yapıyor (`get-img-props.js:123`), srcset hiç basılmadı | 15 HTML, RSC yükündeki o dizgi dışında aynı; JS chunk'ları aynı |

Yukarıdaki "Sekiz çağıransız token silinmedi" kararı kısmen geri alındı: `--komur-90`
"paket şeridiyle birlikte döner" diye tutulmuştu, ama şerit sahibinin geri getirilmeyecekler
listesinde ve rengi `--pumpkin` 20 Ağustos'ta silindi. Aynı ailenin `--komur-55/10/golge`'si,
`koyu` butonu ve `yakinda` çipi de gitti. `--bakir-12` (açık A2 kararı) ve `--ol-duygusal`
(`Ikram.module.css:20` uyarısındaki çift) duruyor.

### Sahibine

- **Portre yayından kalktı** (`a6bcc43`, kullanıcı onayıyla): `public/`'ten çıktı, canlıda
  kenar ve kaynak 404. Aslı sahibinin fotoğraf klasöründe, webp git geçmişinde.
- **"Bozo's Table"** (`content/en/ortak.ts`, `cta.bozoSofrasi`) yasaklı ifadeler listesinde
  ("Bozo's"); her EN sayfasının mobil barında. Yeni etiket uydurulmadı.
- **"Beş ürün, sekiz ikram"** (ana sayfa, iki dil) menünün "Yedi porsiyon, bir özel"iyle
  çelişiyor: menü 8 Ekim'de yediye çıktı, ikram sayısı teste bağlıydı, ürün sayısı değil.
- **Galeri sayfası** "Sitenin beklediği on yedi kare" diyor ve 16 boş karo basıyor; bir
  kare geldiği için sayı da artık yanlış. 13 Ağustos'ta menüdeki "Çekim Listesi" aynı
  gerekçeyle (fotoğrafçıya yazılmış not) silinmişti. Boş plakalar ayrıca ana sayfada 2,
  hikayede portre yerinde 1 (iki genişlikte), masaüstü menüde 8.
- **Onayı geri almak** yalnız tarayıcı verisini silerek mümkün; sitede tercih düğmesi yok.
  Hukukçu onayı bekleyen gizlilik metniyle birlikte sorulmalı.
- **EN "piece(s)"** üç yerde "tane"nin karşılığı; Türkçedeki yasak İngilizceye uzanıyor mu?
  Saatin düzyazı biçimi ("10:00 until 05:00", "10:00'dan ertesi sabah 05:00'e kadar")
  `10:00 - 05:00` kuralına giriyor mu?
- **`--krem-84` hiç tanımlanmadı** (`UstBar.module.css:209`, 20 Ağustos'tan beri): masaüstü
  üst bar linkleri amaçlanan .84 yerine miras alınan tam kremle görünüyor. Token eklemek
  linkleri yedi haftadır görülenden sönükleştirir; görsel karar.

### Canlı sunucu, uygulandı (`c9eeccf`, kullanıcı onayıyla)

HSTS (bir yıl, `includeSubDomains` yok), `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options` `public/.htaccess`'ten geliyor; manifest `application/manifest+json`;
`_next/static` kaynaktan bir yıl `immutable` (kenardaki eski kopyalar 4 saatte tazelenir).
Deploy'dan önce sunucuda geçici bir alt klasörde denendi: 500 yok. `x-powered-by: PleskLin`
`Header unset`'e direnmedi, yani Apache dışında ekleniyor: Plesk ayarı, ayrıca karar.
Kaynağı nginx: `nginxDomainVirtualHost.php:251` sunucu düzeyindeki `xPoweredByHeader`'a
bakıyor, alan adı başına ayar yok. Kapatmak arc'taki 26 vhost'un config'ini yeniden üretir.

### Temiz çıkanlar

Taşma, kırpılma, konsol hatası, onaysız dış istek, kırık iç link/çapa/görsel sıfır. TR metin
kuralları (meta, alt, JSON-LD, llms.txt dahil) temiz. axe'ın belirsiz bıraktığı kontrastlar
pikselden ölçüldü, en düşük 5,86:1. Odak halkası her durakta; atlama linki, çekmece odak
tuzağı, Escape ve odak dönüşü çalışıyor. Onaysız GA isteği yok. Azaltılmış harekette 0
animasyon, 0 rAF. JS kapalıyken gizli içerik yok. Saat çipi 04:59/05:00/09:59/10:00/23:30 ve
kışın doğru. Canlı mobil LCP 1,7-2,3 sn (galeri hariç), CLS en kötü 0,0103.

## 9 Ekim 2026: oyun sahnesi boyalı tasarıma geçti

Sahibi plan 2'nin düz vektör sahnesini beğenmedi; `design_handoff_bozo_oyun/` boyalı, dokulu
illüstrasyon getirdi. Kararlar `docs/specs/2026-10-08-oyun-sahne-birlestirme-design.md`
(K1-K11), plan `docs/plans/2026-10-08-oyun-sahne-plani.md`. Simülasyon, sunucu, ekran akışı ve
kare değerleri sözleşmesi değişmedi; `git diff` o dosyalarda boş.

### Palet istisnası (K1)

Sahne katmanı handoff'un kendi sıcak paletini literal taşır (ceviz, pirinç, çelik, mermer,
çiğ ve pişmiş et, kömür, kor `#FF7A1A`); palet rengi olan her durak token'a bağlı
(`stop-color: var(--kor)`), palet rgb'si hiçbir modülde literal değil (`palet.test`). UI
katmanı token. `CLAUDE.md` > Colors'a ikinci istisna olarak yazıldı.

### Handoff'tan farklı olan ("değişen ne", handoff açık soru 3)

| Yer | Handoff | Kod | Neden |
|---|---|---|---|
| Giriş bağlantıları | Kurallar, Gizlilik | Sıralama, Gizlilik | Kurallar sayfası plan 4; var olmayan sayfaya bağlantı konmaz |
| Sonuç | Paylaş düğmesi, "Bu skoru sıralamaya yaz" bağlantısı | Paylaş yok; "Bu Skoru Sıralamaya Yaz" 56 px kenarlı düğme | Paylaşım kartı plan 4; eylem düğmedir, bağlantı değil |
| ×2 rozeti | Puanın yanında | Telefonda duyuru satırının sağında, masaüstünde puanın yanında | Beş haneli puanla satır 390'da 362 px > 320 px alan (ölçüldü); 320'de saat/puan Bevan 17 |
| Ocak kıvılcımları | 2/4/7 sabit nokta | `KorKivilcimi` tuvali, yoğunluk kombo ile | Spec §12 hareketli kıvılcım; azaltılmışta kapalı |
| Çevirme çentiği | 2 px çizgi | 2 px çizgi (`--centik`), bant yalnız tam kıvamda | Handoff hifi; spec §3 "bant" cümlesinden sapma |
| Yanık tane | Kömür .92 ikili | Kömür `--yanma` ile sürekli, yanınca .92 hayalet | Pencere boyunca uyarı (spec §15 renkten bağımsızlık, ray ile birlikte) |
| Fiş | En çok 3 kalem | 4+ kalem ikinci sütuna sarar | Simülasyon 5 kalemli fiş üretir (ölçüldü: 5 kalem 84 px hücreyi aşıyordu) |
| Çevrimdışı kutusu | Başlık + cümle | Sözlükteki tek cümle | Yeni metin yok |
| Giriş rozeti | Kabuk rozeti yok, 28 px bara sarkar | Kabuk rozeti kalır; büyük rozet `margin-top: -28px` | Kabuk dokunulmaz (README "mevcut pil neyse o") |
| Oyun zemini | `#1C0E0A` / `#120706` | `--zemin` / `--gece` | Handoff token eşlemesi 1d |
| Kalkmış sofra | Kalıcı hal | 700 ms geçici (hayalet) | Simülasyon kalkan sofrayı hemen boşaltır |
| Duraklat perdesi azaltılmışta | 300 ms | anında | Global `prefers-reduced-motion` kuralı |
| Raf pasifliği | `pasif` alanı | Açık ocak yuvalarının hepsi dolu | Kodda karşılığı bu |
| 320 yükseklik | 700 px'te kırpılır | Saha 781 px, kaydırır | Ray ve raf kırpılmasın |
| Duman | statik yol | statik yol (`--pisme` > .4) | aynı |

### Ölçümler

- Testler 363 (354 geçti, 9 atlandı), 21 rota. 390 ve 1440'ta giriş, oyun, perde: taşma yok,
  44 px altı hedef yok, axe 0. Usta kaydı 390'da gerçek zamanda: 24.400, kombo ×13, 05:00.
- HUD satırı (04:12, 16762, ×2): 320'de 246/250, 390'da 312/320, 1440'ta 374/374.
- Azaltılmış hareket (390 ve 1440, oyun ekranı): CSS animasyon/geçiş 0.
- Kare süresi (K10, 390x844 @3, usta kaydı, son 12 sn, headless): CPU 4x 719 kare, p50 16,7,
  p95 18,0, p99 18,5, 25 ms üstü 0, uzun görev 0; CPU 6x p95 18,2, 25 ms üstü 0. Plan 2'nin
  düz sahnesi aynı düzenekte p95 17,8 idi. 17,5 kapısı lafzen 0,5 ms kaçtı, ama p50 vsync'te
  (16,7) ve 6x'te bile kare düşmedi: fark vsync titreşimi, boyalı sahne maliyet eklemedi.
  K10 basamakları uygulanmadı. Gerçek cihaz ölçümü yapılmadı.
- Etiket kontrastı (390 px, pikselden, zemin medyanı): bölüm etiketi 5,52:1 (en açık zemin
  pikselinde 4,77), duyuru 7,98, raf adı 8,87 (en açık 8,56). Hepsi AA üstü; düzeltme gerekmedi.
- Kare süresi, refine turu 1 sonrası (alev, duman, titreme, yeni ürünler): CPU 4x p95 17,4 ms,
  25 ms üstü 0, uzun görev 0; kapı (17,5) tutuyor.
- Handoff karşılaştırması: kare kare tur yapılmadı; kareler `/tmp/bozo-oyun/sahne/ng/`.

## 9 Ekim 2026: tabak akışı zorluk ayarı

Spec tabak §5'in başlangıç sabırları (evre 2: 1320, evre 3: 1080 tik) beş botla 200 tohumda
ölçüldü: düzenli 78/200, çırak 0/200 gece tamamladı (kapılar 140 ve 100). Yalnız sabır sütunu
iki evrede açıldı, sütunun başka yerine dokunulmadı:

| Evre (başlangıç) | Sabır önce | Sabır sonra |
|---|---|---|
| 3 (2700) | 1320 | 1560 |
| 4 (4500) | 1080 | 2040 |

| Bot | Gece tamam / 200 | Ortalama puan | Misafir ort. | En geç bitiş |
|---|---|---|---|---|
| usta | 200 | 19556 | 20,0 | 7200 |
| düzenli | 200 | 10717 | 17,3 | 7200 |
| çırak | 118 | 5410 | 12,9 | 7200 |
| rastgele | 0 | 25 | 0,1 | 5820 |
| hareketsiz | 0 | 0 | 0,0 | 4380 |

- Hareketsiz kapısı "01:30'dan önce" değil "02:00'den önce" (tik 4500): spec'in kendi sabırlarıyla
  üçüncü misafir 2820 + sabır'da kalkar. Sabır 1560 iken son kalkış 4380'dir, 4500'ün altında.
- Rastgele kapısı yapı gereği sağlanır (ilk misafir tükenmez, ikinci 2820'den önce kalkamaz);
  yerine baskı ölçüldü: rastgele ortalaması düzenlininkinin dörtte birinin çok altında.
- Tam kıvam oranı artık şüphe işareti değil: bant halka olarak görünür, beklemek bedava, dikkatli
  bir insan %100'e varabilir. Yalnız makine düzgünlüğündeki zamanlama işaretlenir.

### Klavye ve ekran okuyucu (tabak akışı, 9 Ekim 2026)

- Tab sırası ölçüldü (390 px, headless): Ses, Duraklat, misafir şeridi (m0), ocak (o0), tabak şeridi
  (çöp), raf (ciğer). Her şerit tek durak; şerit içinde ok tuşları gezer, boş bahşiş noktaları
  (`aria-hidden`) durak listesine girmez, para düşünce listeye girer ve ok tuşuyla bulunur.
- Okunan adlar: `o0` "Ocak 1: Ciğer hazır" (elde iken "Ocak 1: Ciğer elde"), `m0` "Misafir 1: Ciğer
  istiyor sabır yüzde 100", `t0` "Tabak 1: Ciğer" (boşken "boş", elde iken ", elde"), `p0` "Bahşiş: 200".
- Enter ve Boşluk odaktakine dokunur, Esc eldekini bırakır; şiş elde kalır (yuvası boşaldı, yemeği
  yalnız çöp atar). Canlı bölge son duyuruyu taşır.
- axe-core, oyun ekranı, rehberle (adım `fis`) ve rehbersiz: 0 ihlal.
