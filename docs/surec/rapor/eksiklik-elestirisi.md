# Eksiklik eleştirisi: bu gece neye hiç bakılmadı

Tarih: 12 Ağustos 2026. Salt okunur inceleme; hiçbir dosya değiştirilmedi, bu rapor tek çıktı.

Anlık durum notu: inceleme HEAD `ac97797` üzerinde yapıldı. Ağaçta o sırada paralel iş
vardı (`M components/saat/VardiyaSeridi.tsx`, izlenmeyen `VardiyaSeridi.saatler.ts` ve
`VardiyaSeridi.test.ts`); o dosyalara dair hiçbir yargı bu rapora alınmadı. Gece boyu
commit akmaya devam ettiği için buradaki "hala açık" ifadeleri bu commit'e göre okunmalı.

Aranan şey bulgu değil kör nokta: "şurada şu yanlış" değil, "şuraya hiç bakılmadı".
Gecenin dört kez tekrarlayan kalıbı, kanıtın kendisinin denetlenmemesiydi. Aşağıdaki ilk
üç madde o kalıbın yeni örnekleri.

---

## Yayın engeli adayları

### 1. Bina numarası "Şht. Özdemir Apt No:4" işletme kaynağında yok; tasarımın kendisi kanıt sayılmış

**Neye bakılmadı.** `content/isletme.ts:18` bina numarasını doğrulanmış veri olarak
taşıyor ve bu değer JSON-LD `streetAddress`'e (`lib/jsonld.ts:44-46`), iki footer'ın
görünür adresine ve Google Maps yol tarifi sorgusuna (`lib/site.ts:43-51`) gidiyor.
Gerekçe zinciri şöyle (`docs/surec/rapor/progress.md` Task 3, `IYILESTIRMELER.md` satır 16):
"envanter çıkarımı yalnız brief'i okumuştu; numara tasarım dosyalarında ve handoff
README'de geçiyor, dolayısıyla doğrulanmış."

**Nasıl anladım.** İşletme gerçeklerinin asıl kaynağına baktım, gece boyunca kimsenin
açmadığı dosyaya: `~/Desktop/Bozo/Cigerci-Bozo-proje-bilgi-dosyasi-v2.md`. Orada adres
detayı açıkça "Bilinmiyor. Kaynakta yalnızca cadde adı var; bina numarası verilmemiş.
Yer tutucu gerekir" diye işaretli (aynı ifade `docs/tasarim/metin-envanteri.json:226-228`'e
de geçmiş). "Özdemir" dizesi işletme sahibinden gelen hiçbir belgede geçmiyor; yalnız
tasarım çıktılarında (`.dc.html` + handoff README) var. Yani doğrulama dairesel: tasarım,
tasarımın README'siyle doğrulanmış. Oysa aynı tasarım telefonu ve fiyatları yer tutucuyla
geçmişti; bilinmeyen bir alana somut bir numara yazması ya sahibinden sözlü alındığı ya
da tasarım sürecinin uydurduğu anlamına gelir. Hangisi olduğunu söyleyen kayıt yok.

**Riski.** Projenin en sert kuralı "uydurulmuş bir değer yayına çıkmaz". Yanlışsa: yanlış
kapı numarası arama motoruna yapısal veriyle bildirilmiş olur, gece 03:00'te yol tarifi
isteyen misafir yanlış noktaya gider ve Google Business kaydıyla site çelişir.

**Nasıl kapatılır.** Sahibine tek soru: "kapı numaranız Şht. Özdemir Apt No:4 mü?"
Cevap gelene kadar Task 15'in uydurulmuş veri taramasında bu alan "tasarım kaynaklı,
sahibi teyit etmedi" diye işaretlenmeli. Teyit edilirse `isletme.ts` yorumuna "sahibi
teyit etti, tarih" düşülür ve konu kapanır. **Doğrulanmalı**; uydurma olduğunu iddia
etmiyorum, doğrulanmamış olduğunu iddia ediyorum.

### 2. Sunucu katmanının sahibi yok: Caddy yapılandırması hiçbir görevde değil

**Neye bakılmadı.** Sitenin yayın hedefi Caddy `file_server` (spec, CLAUDE.md, KISITLAR).
Ama repoda Caddyfile yok, hiçbir görev sunucu yapılandırmasını üstlenmiyor ve Task 15
brief'i yalnız `out/` içeriğini denetliyor, sunulmasını değil. Planın tek cümlesi var
(`docs/plans/...-plani.md:2392`: `try_files {path} {path}/ /404.html`) ve o cümleyi
bugüne kadar kimse bir işe çevirmedi.

**Nasıl anladım.** `grep -rn Caddy` tüm ağaçta yalnız niyet cümleleri döndürüyor; görev
listesinde (1-17) sunucu maddesi yok; Task 15 brief'inin "Yayın" bölümü dosya listesiyle
bitiyor.

**Riski.** Düz `file_server` ile bilinmeyen URL, özenle kurulmuş `404.html` yerine
Caddy'nin çıplak 404'ünü döndürür; `task-14-report.md:300` bu riski "yayın öncesi Caddy
tarafında" diye not etmiş ama madde hiçbir listeye taşınmamış. Ayrıca kimse şunlara karar
vermedi: `/_next/static` için immutable cache başlıkları, sıkıştırma, http'den https'e ve
www'dan köke yönlendirme (hreflang ve canonical mutlak URL'lerle yazılı, yanlış host
çifte içerik üretir), `Content-Type` charset'i.

**Nasıl kapatılır.** Küçük bir "yayın görevi": Caddyfile (try_files + handle_errors +
encode + cache başlıkları + host yönlendirmesi), researchos-server'daki Regulus ve
oykualemdar kalıbından uyarlanır; Task 15'e "404 gerçekten sunuluyor mu" maddesi eklenir.

---

## Kör noktalar

### 3. İşletme gerçekleri envanteri hiç kaynağına karşı denetlenmedi, ve iki yönde de yanlış çıktı

**Neye bakılmadı.** Gecenin denetim makinesi brief'leri tasarıma karşı denetledi (138
bulgu), denetim dosyalarının bayatlamasını denetledi, kanıt matrisinin örnekleme birimini
denetledi. Ama her şeyin üstünde oturduğu olgu katmanı, `metin-envanteri.json` >
`isletmeGercekleri`, kaynağı olan `proje-bilgi-dosyasi-v2.md`'ye karşı hiç okunmadı.

**Nasıl anladım.** İki ters yönlü hata tek dosyada: (a) madde 1'deki bina numarası,
envanterin "bilinmiyor" dediği halde koda doğrulanmış girdi; (b) "Girne Macro Market,
80 m" mesafesi "işletme gerçeklerinde karşılığı yok, uydurma istatistik" gerekçesiyle
silindi (`IYILESTIRMELER.md` satır 20, `icerik.test.ts:55-58`'de test bile var), oysa
kaynak dosyanın 238. satırı o mesafeyi "[DOĞRULANMIŞ] İşletmeci beyanı" tablosunda
veriyor. Sonuç sahibin onayından geçtiği için zarar yok, ama kayıtlı gerekçe olgusal
olarak yanlış ve test yorumu gelecekteki okuyucuya yanlış tarih anlatıyor.

**Riski.** Beklenen veriler (fiyat, telefon, içecekler, hikaye metni) gelmeye
başladığında aynı envanter üzerinden akacak; envanterin güvenilirlik derecesi bilinmeden
"null muydu, doğrulanmış mıydı" kararları yine tek taraflı verilecek.

**Nasıl kapatılır.** Tek seferlik kısa denetim: `isletmeGercekleri`'nin 20 küsur satırı
`proje-bilgi-dosyasi-v2.md`'ye karşı satır satır; farklar (en az iki tane var) not edilir,
`icerik.test.ts`'teki mesafe testinin yorumu düzeltilir.

### 4. Bütün gece tek tarayıcı motoru ve iki genişlik ölçüldü; Safari, Firefox ve ara genişlikler hiç açılmadı

**Neye bakılmadı.** Her ölçüm Chromium'da, 1440x900 ve 390x844'te yapıldı. iOS Safari
(WebKit), Firefox, 320px (SE sınıfı), 768px tablet, 781-1100px bandı (masaüstü yerleşimin
en dar hali), telefon yatay konumu: hiçbiri, hiçbir görevde. Task 15 brief'i de aynı iki
genişliği tekrarlıyor, yani kör nokta ileriye miras kalıyor.

**Nasıl anladım.** Bütün raporların ölçüm ortamı satırları (ör. `mobil-turu-report.md:29`)
yalnız "kendi chromium örneği" diyor; hiçbir belgede webkit/firefox kelimesi geçmiyor.
Sahibinin kendi teslim listesi (`Cigerci-Bozo-yapilacaklar-listesi.md` 5.3) "mobil
uyumluluk testi (farklı ekran boyutları)" istiyor.

**Riski.** Bu sitenin gerçek kullanıcısı büyük olasılıkla telefonda Safari. Riskli
noktalar belli: `min-height:100vh` bölümler + iOS araç çubuğu davranışı (dvh farkı),
`position:fixed` üç katman (sahne, üst bar, alt eylem barı), `backdrop-filter`,
`body:has(...)` çapa payı, 320px'te `clamp` alt uçları. Bunların hepsi "muhtemelen
çalışır" sınıfı; ama gece boyu "muhtemelen"e güvenilmedi, ölçüldü. Burada ölçülmedi.

**Nasıl kapatılır.** Task 15'e iki satır: Playwright'ın webkit ve firefox motorlarıyla
aynı tur (ekran görüntüsü + konsol + taşma), genişlik setine 320 ve 820 eklenmesi.
Gerçek cihazda bir bakış (sahibinin telefonu yeter) yayın öncesi listeye.

### 5. Sahibinin teslim listesi (Bölüm 5) geceye hiç girmedi; harita ve ölçümleme kararları kayıtsız kaldı

**Neye bakılmadı.** Spec'in kaynak tablosu `Cigerci-Bozo-yapilacaklar-listesi.md`'yi
"site teslim kalemleri" otoritesi olarak listeliyor; o dosyaya gece boyunca tek atıf yok.

**Nasıl anladım.** `grep -rln yapilacaklar docs/ .superpowers/` yalnız spec'i döndürüyor.
Listeyi açıp siteyle karşılaştırdım. Karşılığı olmayan ve **hiçbir yerde karara
bağlanmamış** kalemler: (a) "Google Maps konum entegrasyonu"; handoff README'si de aynı
şeyi söylüyor ("Harita: şu an dekoratif panel; production'da koyu temalı harita + tek
işaret"). Port dekoratif levhayı nihai kabul etti ve bu sapma `IYILESTIRMELER.md`'de yok.
Üstelik gerçek bir gerilim var: gömülü harita, gizlilik sayfasının "dış istek yok"
duruşuyla çelişir; bu bilinçli bir tercihse tam da kayıt edilmesi gereken türden.
(b) "Google Analytics ve Search Console kurulumu"; site bilinçli olarak ölçümsüz ama bu
karar da yalnız gizlilik metninin içinde örtük duruyor, sahibiyle "ziyaretçi sayısını
hiç görmeyeceksiniz" konuşması yapıldığına dair kayıt yok. (c) "Sayfa hızı
optimizasyonu"; hiçbir görevde performans bütçesi veya Lighthouse ölçümü yok (Task 16'nın
"60fps" kuralı animasyon içindir, yükleme değil). Rezervasyon ve Galeri ise spec'te
gerekçeli kapsam dışı, onlar temiz.

**Riski.** Sahibi teslim listesiyle karşılaştırdığında "bunlar nerede" diyecek; cevaplar
iyi (dekoratif levha + harici yol tarifi muhtemelen daha doğru bir karar) ama hiçbiri
yazılı değil. Kayıtsız sapma bu projenin kendi tanımıyla kusurdur.

**Nasıl kapatılır.** Üç karar maddesi sahibine tek mesajda: harita gömülsün mü (gizlilik
bedeliyle birlikte), ölçümleme istiyor mu, Search Console kaydı kim yapacak. Cevaplar
`IYILESTIRMELER.md`'ye.

### 6. Statik çıktı her sayfada "Şu an kapalıyız" iddia ediyor; JS'siz misafir ve JS çalıştırmayan araçlar bunu görüyor

**Neye bakılmadı.** JS kapalıyken veya hydration öncesinde sitenin ne söylediği. Saat
bileşeni nötr davranıyor (`--:--`), ama `DurumCipi` null durumda kapalı görünümü basıyor
(`DurumCipi.tsx:20-21`) ve bu, statik HTML'e gömülüyor: `out/index.html` içinde "Şu an
kapalıyız, 10:00'da açılıyoruz" bir kez geçiyor, "Şu an açığız" sıfır kez. Çekmecedeki
kopya da aynı (`Cekmece.tsx:76-77`).

**Nasıl anladım.** Bileşen kaynakları + derlenmiş çıktıda dize sayımı.

**Riski.** Öğlen 12'de JS'siz (veya yavaş bağlantıda henüz hydrate olmamış) bir misafir
yanlış bir olgu okuyor: dükkan açıkken site kapalıyız diyor. Yer tutucu ile yanlış iddia
arasındaki fark, bu projenin kendi ilkesiyle ölçülür: `--:--` bilinmeyendir, "kapalıyız"
yanlış olgudur. Bu takas hiçbir raporda tartışılmadı; koddaki yorum yalnız hydration
eşleşmesini anlatıyor, tercihi değil.

**Nasıl kapatılır.** Ya nötr bir üçüncü durum (nokta gri, metin boş veya "10:00 - 05:00")
mount'a kadar basılır; ya da mevcut davranış bilinçli karar olarak `IYILESTIRMELER.md`'ye
gerekçesiyle yazılır. İkisi de ucuz; şu anki durum ikisi de değil.

### 7. Atlanan blok bağlantısı (skip link) yok ve hiçbir denetim listesinde geçmiyor

**Neye bakılmadı.** WCAG 2.4.1 (A seviyesi): tekrar eden blokları atlama imkanı. On
rotanın hepsinde klavye kullanıcısı içeriğe ulaşmak için üst barın 6-8 hedefini (marka,
nav, dil anahtarı, CTA) her sayfada yeniden geçmek zorunda. `Kabuk.tsx`'te `<main>`
id'siz, skip link yok; `grep -rn skip` sıfır sonuç.

**Nasıl anladım.** Kabuk kaynağı + tüm a11y bölümlerinin taranması. Gecenin erişilebilirlik
işi ciddiydi (landmark adları, focus trap, 44px, kontrast) ama hep bileşen düzeyinde
kaldı; "sayfaya klavyeyle girince ilk ne olur" sorusu hiç sorulmadı. Task 15 brief'inin
klavye maddesi de sekme sırasını soruyor, atlama bağlantısını değil.

**Riski.** AA hedefleyen bir sitede A seviyesi eksik. Ekran okuyucu kullanıcıları landmark
ile gezinebilir (onlar kurtarıyor), asıl bedeli salt klavye kullanıcısı ödüyor.

**Nasıl kapatılır.** Görünmez, odakta görünür tek bağlantı + `<main id>`; metin için
sözlüğe `erisim` grubuna bir anahtar (mevcut kalıp hazır). Task 15 brief'ine bir satır.

### 8. Denetim bulgularının tur eşlemesi hiç fark alınmadı: F2'nin kaydı yok, B9 hiçbir tura atanmadı

**Neye bakılmadı.** İki bağımsız inceleme (sadakat F1-F10, çapraz B1-B14) iki toparlama
turuna bölüştürüldü, ama "bulgu listesi eksi kapatılanlar" farkını kimse almadı. Bu, gece
tam da yakalanan "matris biçim başına örnekliyor, örnek başına değil" hatasının tur
düzeyindeki kopyası.

**Nasıl anladım.** Brief'lerde arama: mobil turu F3+F4+F9'u, toparlama F5-F8+F10'u aldı;
F1 ayrı commit'le kapandı (`31c1e3e`). **F2** (menü sayfasının iç sahnesinin altı değerde
ayrışması) ikisine de girmedi. Kod yorumu `KorSahnesi.module.css:11` "çoğunluğa normalize
edildi (IYILESTIRMELER.md)" diyor; **IYILESTIRMELER'de böyle bir satır yok** (tarandı),
karar yalnız `31c1e3e`'nin commit mesajında. Kısıtların kendi cümlesi: kayıtsız sapma
kusurdur; üstelik Task 15 brief'i farkları IYILESTIRMELER'e karşı kontrol etmeye
yönlendiriyor, yani Task 15 bu farkı bulacak, kayıtta bulamayacak ve ya boşa bir tur
yakacak ya da "düzeltip" çoğunluk kararını geri saracak. Aynı taramada **B9**
(`IlerlemeCubugu`'nun hareket sözleşmesi dışında kalması) hiçbir brief'te, DEVAM'da veya
raporda geçmiyor; kararsız ve kayıtsız duruyor. B4, B6, B8, B12 ise "Task 16'ya" denip
yalnız `capraz-inceleme.md`'de yaşıyor; DEVAM'ın okuma sırası o dosyayı hiç saymıyor,
yani bağlam sıfırlamasından sonra Task 16'yı yazan kişinin o maddeleri görme garantisi yok.

**Nasıl kapatılır.** Beş dakikalık iş: IYILESTIRMELER'e F2 satırı; DEVAM'ın okuma
sırasına iki inceleme raporu; Task 16 brief'i yazılırken B4/B6/B8/B9/B12 maddelerinin
açıkça listelenmesi.

### 9. DEVAM.md, tek giriş noktası, şu an ağacın iki saat gerisinde

**Neye bakılmadı.** "Bağlam sıfırlanınca önce bunu oku" denen dosya, HEAD `ac97797`
itibarıyla 9-14'ü "bekleyen" olarak listeliyor; oysa altısı da commit'li (00:25-01:40
arası). Test sayısı ve açık maddeler de sayfa görevleri öncesinin değerleri.

**Nasıl anladım.** `git log` zaman çizgisi ile DEVAM içeriğinin karşılaştırması; DEVAM'a
son dokunan commit `957daa9` (02:30, toparlama) sayfa commit'lerinden sonra geldiği halde
"Bekleyen" bölümünü güncellememiş.

**Riski.** Gece bunun bedelini bir kez ödedi (bayat denetim dosyaları); şimdi aynı
bayatlık zincirin en üst halkasında. Bir bağlam sıfırlaması şu an olsa, yeni oturum
bitmiş beş sayfayı yeniden gönderebilir. **Doğrulanmalı:** paralel ajanlar bu satırlar
yazılırken DEVAM'ı güncellemiş olabilir; gözlem `ac97797` anına aittir.

**Nasıl kapatılır.** Sayfa turlarını kapatan bir DEVAM güncellemesi; ve kural olarak
"görevi kapatan commit DEVAM'ı da günceller" (toparlama turu bunu yapmıştı, sayfa
görevleri yapmadı).

### 10. Paylaşım önizlemesi hiç düşünülmedi: og:image yok, theme-color yok

**Neye bakılmadı.** Bu bir restoran sitesi; birincil paylaşım kanalı WhatsApp olacak.
`lib/metadata.ts` başlık, açıklama ve locale veriyor ama `og:image`, `og:siteName`,
twitter kartı yok; `themeColor` / `color-scheme` meta'sı da yok (koyu site, tarayıcı
arayüzü beyaz kalıyor). Hiçbir görev, brief veya rapor "link paylaşılınca ne görünür"
sorusunu sormuyor; Task 15 brief'inde de yok.

**Nasıl anladım.** `metadata.ts` + `grep -rn themeColor\|og:` sıfır ek sonuç.

**Riski.** Yayın günü paylaşılan her bağlantı çıplak metin kartı üretir. Fotoğraf ve logo
beklendiği için tam çözüm bugün kurulamaz, ama bunun "varlık bekliyor" maddesi olarak bile
kaydı yok; favicon aynı statüde kayıtlıyken önizleme görseli hiç listede değil.

**Nasıl kapatılır.** "İşletmeden bekleyen veriler" listesine "paylaşım görseli (og:image,
1200x630)" satırı; varlık gelince `metadata.ts`'e tek blok. `themeColor: '#0A0807'` ise
bugün eklenebilir, varlık istemiyor.

### 11. Fotoğraf günü hiç prova edilmedi: `dosya` dalı bir kez bile çalıştırılmadı

**Neye bakılmadı.** Spec'in vaadi "çekimler geldiğinde yalnız manifest'e yol yazılır,
hiçbir JSX değişmez". Bu vaadin dayandığı kod yolu (`FotoYuvasi.tsx:79-86`, `next/image`
+ `fill`) hiçbir zaman render edilmedi: manifestteki 16 kaydın hepsi dosyasız. O dalda
etiket ve köşe işaretleri kayboluyor (fotoğraflı plakada kadraj etiketi basılmıyor); bu
niyet mi, eksik mi, hiçbir yerde yazmıyor. `images.unoptimized` altında boyut/format
hattı da (kaç px, WebP mi, kim küçültecek) kararsız.

**Nasıl anladım.** `fotograflar.ts` + `FotoYuvasi` kaynağı; plan görev listesinde
"fotoğraflar geldiğinde" fazı yok.

**Riski.** Fotoğraflar geldiği gün "tek satır yaz, çalışsın" beklentisi ilk kez o gün
sınanacak; 16 büyük JPEG'in olduğu gibi sevk edilmesi mobil performansı bitirebilir.

**Nasıl kapatılır.** Bir kez geçici bir görselle `dosya` dalını tarayıcıda görmek (etiket
kararı dahil), ve DEVAM'ın bekleyen veriler bölümüne iki cümlelik fotoğraf kabul kuralı
(azami boyut, format, kim işleyecek).

### 12. Küçük ama gerçek: kalan kayıt ve erişim boşlukları

- **Menü sayfasında Gizlilik'e ve telif satırına giden yol yok.** `serit` footer telif
  şeridi taşımıyor (tasarıma sadık); ama menü, QR ile en çok girilecek sayfa. Karar
  sayfa başına hiç değerlendirilmedi. Düşük öncelik, Task 16'ya bir satır.
- **404'ün "dil bilinemez" gerekçesi istemci tarafında yanlış** (`global-not-found.tsx:20-23`).
  Sunucu yolu geçirmez, doğru; ama istemcide `location.pathname` `/en/` önekini görür ve
  metin JS ile İngilizceye çevrilebilirdi. Sınırlama gerçek değil, tercih; kayıt öyle demeli.
- **`marka/` klasörünün numaralandırması delik: 01 ve 03 var, 02 yok.** Kimse "02 nerede"
  diye sormadı. Üst dizinde duran `Cigerci-Bozo-Marka-Kitabi-Cilt1-v2.pdf`, marka tanıtım
  sunumu PDF'i, `Cigerci-Bozo-Sis-Logo-Ornek.png` ve `logo konseptleri.zip` gece boyunca
  hiçbir kayda göre açılmadı. DEVAM'ın "çizilmiş logo dosyası yok" cümlesi handoff alt
  kümesi için doğru, üst dizin için değil: çizilmiş örnek ve konsept paketi var, onaysız.
  **Doğrulanmalı:** PDF'lerde webi bağlayan ek kural olup olmadığını ben de bilmiyorum,
  kimse açmadı.
- **Kilitli terminolojinin regresyon ağı yok.** Testler yalnız em dash'i tarıyor
  (`icerik.test.ts:37`); müşteri/bedava/mangal/şef/parça/adet/masa/7-24, şapkalı harf ve
  tamamı büyük harf cümle taranmıyor. Fiyat ve içecek metinleri ileride sözlüğe elle
  girecek; o gün bu kuralları yalnız insan hafızası koruyacak. Yasak kelime listesi
  `metin-envanteri.json`'da hazır, teste bağlamak yarım saatlik iş.
- **Bileşen düzeyinde sıfır test.** Gecenin üç kez tekrarlayan hatası (bileşenin yanlış
  kaynaktan okuması: `sayfalarBaslik`, `adresVeSaat`, `adresCadde`) test edilebilir
  katmanın tam dışında yaşıyor. Ucuz bir ağ mümkün: derleme sonrası `out/` taraması
  (ör. `en/**` içinde "Caddesi" geçmesin, hiçbir dosyada U+2014 olmasın). Task 15'in
  `docs/PARITE.md` çıktısı "yeniden koşulabilir" hedefliyor; bu iki tarama betik olursa
  gerçekten koşulabilir olur.
- **`girneParcalari` atarsa sayfa ne yapar, bakılmadı.** `Intl` `Europe/Nicosia`'yı
  çözemeyen egzotik bir ortamda fonksiyon `throw` ediyor ve bu, saat bileşenlerinin
  effect'inde yakalanmadan patlar. Olasılık 2026'da çok düşük; yine de "saat çekirdeği
  çöker" ile "saat bilinmiyor gösterir" arasındaki fark bir `try/catch` kadar.
  **Doğrulanmalı**, düşük risk.

---

## Bakıldı ve gerçekten temiz

Bunları sınadım veya kanıt zincirini yeniden izledim; sağlam çıktılar.

- **Saat çekirdeği.** `Intl` + `Europe/Nicosia` ile cihaz saatinden bağımsız; gün aşan
  pencere, gece bandı ve "05:00 öncesi önceki gün adı" kuralları sınır değerleriyle test
  edilmiş; hydration stratejisi (null yer tutucu) tutarlı.
- **Rota ve SEO iskeleti.** İki kök layout, on rota, `hreflang` tr/en/x-default,
  mutlak canonical, sitemap ve robots; JSON-LD'nin null politikası iki yönde de testli,
  gece aşan `opens 10:00 / closes 05:00` yazımı doğru.
- **Menü sayfası çapaları.** Kabuk turunda "sonraki göreve" bırakılan Ocaktan/İkramlar/
  İçecekler nav çıpaları gerçekten bağlanmış (`lib/kabuk.ts:88-100`, bölüm id'leri yerinde);
  sessizce düşmemiş.
- **Çekmece.** Focus trap, Escape, kaydırma kilidi, odağın tetikleyiciye dönüşü: hepsi
  kodda ve doğru kurulmuş.
- **Fontlar.** İki ailede de `latin-ext` var, `display: swap`, tek tanım noktası; 404
  dahil her `<html>` aynı sınıfları alıyor.
- **Sadakat denetiminin kapanışları.** F1 (ana sahne keyframe'leri), F3/F9 (mobil sahne
  ve ölçüler), F4 (ImlecKoru bağlandı, mobilde gizli, ölü CSS çıktı), F5-F8/F10 kayıtları:
  kod üzerinde doğruladım, raporlarla uyumlu. Kalan tek makas payı madde 8'deki F2 kaydı.
- **Dış istek yok iddiasının kod tarafı.** `target="_blank"` hiç yok, harici istek üreten
  tek şey kullanıcı tıklamasıyla Google Maps araması; fontlar self-hosted.
- **Terminolojinin bugünkü durumu.** Sözlüklerde em dash testi geçiyor; TR/EN anahtar
  paritesi tip sistemiyle de kilitli.

## Benim bakamadığım

- **Tarayıcıda hiçbir şey ölçmedim.** Görev salt okunur; kontrast oranları, dokunma
  hedefleri, 390px davranışları raporlardaki değerleriyle kabul edildi, yeniden
  ölçülmedi. Madde 4'teki motor/genişlik eleştirisi bu yüzden benim için de geçerli.
- **`npm test` ve `npm run build` koşmadım.** Ağaçta o an başka bir ajanın yarım işi
  vardı (`VardiyaSeridi`); sonuç o işin durumunu ölçerdi, commit'li ağacı değil.
  "60 test geçiyor" iddiası bu turda bağımsız doğrulanmadı.
- **Beş `.dc.html` dosyasını değer değer yeniden çıkarmadım.** Sadakat denetiminin 656
  değerlik örneklemine güvendim; yalnız çelişki iddialarını (F2, keyframe seti, `.09`)
  nokta atışı doğruladım.
- **PDF'leri ve zip'i açmadım.** `Marka-Kitabi-Cilt1-v2.pdf`, marka sunumu ve logo
  konsept paketi: gece kimse okumadı, ben de okumadım. İçlerinde webi bağlayan kural
  olup olmadığı açık soru (madde 12).
- **`support.js`'i okumadım.** Sadakat denetimi de okumamıştı; davranış soruları
  `.dc.html` içindeki betiklerden çözülmüş durumda, oradan gelen bir sürpriz riskini
  değerlendiremedim.
- **Konum/VardiyaSeridi'nin uçuştaki hali.** İnceleme anında değişmekte olan dosyalara
  dair yargı vermedim.
