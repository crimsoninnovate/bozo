# Panel: fotoğraflar, çalışma saatleri ve panelden site yayını

Tarih: 9 Kasım 2026 · Durum: sahibi "sitede güncellenme ihtimali olan yerleri panele taşı, kendileri
güncelleyebilsin; menü değil fotoğraflar genel olarak" dedi ve soruları atlattı ("sorular sormadan
ilerle"). Aşağıdaki kapsam, sınırlar ve ayrıntılar benim kararlarımdır, yazılı onay yok.
Önceki sürümler: `2026-10-26-menu-yonetim-design.md`, `2026-10-26-panel-genisletme-design.md`.

## Amaç

Panel bugün menüyü, tükendi işaretini, duyuruyu, ikramları ve iletişimi değiştiriyor. Sahibin hâlâ
geliştiriciye muhtaç kaldığı üç şey var, 26 Ekim tasarımı üçünü de bilerek dışarıda bırakmıştı:

1. **Fotoğraflar.** Sitede 17 fotoğraf yuvası var (`content/fotograflar.ts`), biri dolu; geri kalanı
   kadraj etiketli koyu plaka. Fotoğraf eklemek bugün bir commit ve bir yayın demek.
2. **Çalışma saatleri.** 10:00 - 05:00 iki dilde 64 yerde elle yazılı (sözlükler, `jsonld`, `llmsTxt`); "Şu an açığız" kuralı
   `lib/saat.ts` sabitlerinde.
3. **Yayın.** İletişim, JSON-LD, `llms.txt`, meta açıklaması ve yukarıdaki iki madde ancak
   `npm run yayinla` ile siteye iner; o komutu yalnız geliştirici çalıştırabiliyor.

Başarı: sahibi telefondan bir yemeğin fotoğrafını çekip ilgili yuvaya koyar, saatleri değiştirir,
"Siteyi güncelle"ye basar; birkaç dakika içinde site her yerde yeni hâliyle yayındadır ve geliştiriciye
yazması gerekmez.

## Hedefler

### A. Fotoğraflar

- Panelde yeni bir **Fotoğraflar** sekmesi: her yuva (`FotoId`) bir satır; etiketi, sitede nerede
  kullanıldığı (ör. "Menü · Dalak kartı", "Ana sayfa · İddia"), mevcut kare ya da boş plaka.
- Yuva başına: **yükle / değiştir**, **kaldır** (boş plakaya döner), **odak noktası** (karenin
  hangi yeri kırpıma girsin: dokunarak seçilen nokta, `object-position` yüzdesi olarak saklanır).
- **Yükleme tarayıcıda hazırlanır.** Panel seçilen görseli (telefon kamerası, galeri; JPEG, PNG,
  HEIC'i tarayıcı çözebiliyorsa) canvas'a çizer, uzun kenarı en çok 2000 px olacak biçimde küçültür,
  WebP olarak yeniden kodlar (kalite 0.82). Yeniden kodlama EXIF'i (konum bilgisi dahil) siler: bu
  bir gizlilik gereği, ayrıca sunucuda görüntü işleme bağımlılığı gerekmez.
- **Sunucu** (`sunucu/`, skor sunucusu) yeni uç: `POST /yonetim/foto`, gövde ham WebP, yetki mevcut
  yönetim kimliği. Denetimler: içerik türü, sihirli baytlar (`RIFF....WEBP`), boyut sınırı (3 MB),
  piksel boyutu başlıktan okunur ve 2000 px'i aşamaz. Dosya adı içeriğin SHA-256 özetinin ilk 16
  hanesi: `<ozet>.webp`. Aynı dosya iki kez yüklenirse tek kopya kalır. Yanıt: `{ dosya, en, boy }`.
- Dosyalar sunucuda web kökünün dışındaki bir dizinde durur ve nginx tarafından
  `https://api.cigercibozo.com/foto/<ozet>.webp` olarak sunulur; içerik adresli olduğu için
  `Cache-Control: public, max-age=31536000, immutable`. Node dosya sunmaz.
- **Belgeye bağlanır.** `MenuBelgesi`'ne yeni bölüm: `fotograflar: Partial<Record<FotoId, { dosya:
  string; odak: string | null }>>`. Yüklemek dosyayı sunucuya koyar; yuvaya atamak taslakta bir
  değişikliktir ve diğer değişiklikler gibi **Yayınla** ile canlıya çıkar. Sürüm geçmişi, onay
  ekranındaki fark ve geri alma fotoğraflar için de çalışır.
- Dosyalar hiç silinmez (eski sürüme geri alma onları kullanabilir). Disk büyümesi küçük: kare başına
  birkaç yüz KB, yılda birkaç yüz kare.
- **Site.** `FotoYuvasi` derlenmiş belgedeki karenin adresini basar (statik HTML'de doğru kare,
  yerleşim kayması yok). Fotoğraf değişikliği sitede **Siteyi güncelle** ile görünür, tarayıcıda canlı
  takas yok (plan aşamasında değişti, 9 Kasım: canlı takas boş bir yuvayı dolduramıyordu, yarım bir
  davranış olurdu; derleme birkaç dakika). Belgede kare yoksa bugünkü `content/fotograflar.ts` `dosya` değeri, o da yoksa
  boş plaka. Fotoğraflar `api.cigercibozo.com`'dan gelir: kendi sunucumuz, menü zaten oradan
  okunuyor, onay kapısı gerekmez (gizlilik metni fotoğrafların bu alan adından geldiğini söyler).
- Var olan tek kare (`public/foto/tane-yakin-cekim.webp`, 25e54fb'de geri getirildi) sunucuya da
  yüklenip belgeye yazılır; `public/` kopyası belge eksikken yedek olarak kalır.
- **Odak.** Bugün odak yerleşimde yazılı (`Ocakbasi.tsx` `50% 70%`, `Portre.tsx` `50% 28%`). Panelde
  odak kare başına seçilir ve seçildiyse o karenin her yerleşiminde koddakini ezer; seçilmediyse
  koddaki yerleşim odağı geçerlidir. Önizleme karenin ilk yerleşiminin oranını gösterir. Benim kararım.
- `alt` metni bugünkü etiketten gelir (iki dilli, `content/fotograflar.ts`); panelden düzenlenmez.

### B. Çalışma saatleri

- Belgeye yeni bölüm: `saatler: { acilis: number; kapanis: number }`, tam saat (0-23).
- **Geçerli değerler (benim kararım):** kapanış 02:00 ile 08:00 arası, açılış 06:00 ile 18:00 arası ve
  kapanıştan sonra. 02:00 alt sınırı `GECE_BASLANGICI = 1` yüzünden: daha erken kapanışta "gece"
  durumu hiç oluşmaz. 18:00 üst sınırı "Gece vardiyası 21:00'den sonra" notunun (sabit kalır) doğru
  kalması için: dükkan 21:00'de mutlaka açık olur.
- **Biçim kısıtı:** kapanış gece yarısından sonra ve açılıştan önce olmalı (bugünkü 10:00 - 05:00
  gibi geceye taşan pencere). "Gece açığız" markanın kilitli terimi ve 74 metnin çoğu "ertesi sabah"
  diyor; aynı gün kapanan bir pencere metinleri yanlış yapar. Doğrulayıcı bu biçimi zorlar, panel
  nedenini söyler. Gerçekten gece yarısından önce kapanmaya karar verilirse bu bir metin işidir, koda
  gelir.
- Tüm saat metinleri (`content/tr`, `content/en`: `ortak`, `ana`, `hikaye`, `konum`, meta açıklamaları)
  `{acilis}` ve `{kapanis}` yer tutucularına çevrilir ve derlemede belgedeki değerle doldurulur.
  Metinlerin kendisi değişmez; yalnız sayılar değişkene döner. `content/icerik.test.ts` oyun dışı
  sözlük metinlerinde çıplak `10:00` / `05:00` kalmadığını denetler; oyunun metinleri (`oyun.ts`,
  `content/yonetim.ts`'teki dönem cümleleri) açıkça hariç tutulur.
- Türkçe ek uyumu: "10:00'dan", "05:00'e" gibi ekler saate göre değişir ('da/'de, 'a/'e, 'dan/'den).
  Ekler elle yazılmaz, saatin okunuşuna göre üretilir (küçük, testli bir yardımcı).
- `lib/saat.ts` sabitleri (`ACILIS_SAATI`, `KAPANIS_SAATI`) belgeden gelir. Durum rozeti (açık/kapalı
  ve kendi metinleri `kapali`, `kapaliAlt`) tarayıcıda canlı belgenin saatiyle hesaplanır ve aynı
  doldurma yardımcısıyla yazılır: rozet anında doğru olur. Diğer metinler site güncellenince değişir;
  panel saati yayınlarken "Siteyi güncelle" uyarısını gösterir. Arada kalan süre bilinçli bir boşluk.
- JSON-LD `openingHoursSpecification` belgeden.
- Ana sayfa çizelgesi (`cizelgeSaatleri`, yedi tik): ilk tik açılış, son tik kapanıştan bir saat önce,
  aradakiler eşit aralıkla; "söner" notu kapanış. Aralık tam saate bölünmüyorsa tikler en yakın tam
  saate yuvarlanır. Bu benim kararım: çizelge bir ölçek, el yazısı bir zaman çizelgesi değil.
- **Kapsam dışı:** oyunun gece saatleri (21:00 - 05:00 oyunun kendi kurgusu, `lib/oyun/ayar.ts`),
  güne göre farklı saatler, tatil takvimi (duyuru bandı bunu karşılıyor).

#### Güne göre saatler (ileride)

Sahibi 9 Kasım 2026'da saatlerin ileride hafta gününe göre değişebileceğini söyledi. Bugün her gün tek
pencere geçerli ve bu yapılmıyor. Genişleme yolu eklemeli, bugünkü kod ve belgeler bozulmaz:

- Belgede `saatler.gunler` isteğe bağlı bir ezme olur (gün başına `acilis` ve `kapanis`); yoksa
  `saatler.acilis` ve `saatler.kapanis` her gün için geçerlidir. Eski belgeler geçerli kalır,
  `menuBelgesiTamamla` eksik alanı tamamlar.
- Tek bir gün çözücü (gün -> o günün penceresi) `lib/saat.ts`'in zaten parametreli işlevlerini besler;
  durum rozeti, kalan süre ve çizelge o işlevlerden çıkmaya devam eder.
- JSON-LD'de `openingHoursSpecification` gün başına bir kayıt olur.
- Asıl maliyet metinler: "Her gün ..." / "Every day ..." kalıbı `content/{tr,en}/ortak.ts`
  (`saatlerGunluk`, `saatlerUzun`, iki meta açıklaması, `haftaAraligi`) ve `content/{tr,en}/ana.ts`
  (`saatNotu`) içinde; `hikaye.ts` ("Ocak ... yanar") ile `konum.ts` (`not`, "tek kapalı aralık")
  da tek pencere varsayar. Saatler günden güne ayrışırsa bu cümleler yeniden yazılır (yeni metin,
  sahibinin onayıyla). Panelde tek pencere yerine yedi satır gerekir.

### C. Panelden site yayını

- Panelde **Siteyi güncelle** düğmesi. Bugünkü "sitede yayında olan sürüm" göstergesinin yanında; fark
  yoksa pasif. Basınca sunucu bir derleme isteği kaydeder ve panel durumu gösterir: sırada, derleniyor,
  yayında (sürüm N), hata.
- **Derleme arc'ta yapılır.** Yeni sistem kullanıcısı (`bozo-derleme`, giriş kabuğu yok), repo'nun
  salt okunur bir kopyası (`git clone`, `main`; GitHub'da depoya yalnız okuma yetkili bir deploy key,
  canlıya alırken sahibinin onayıyla eklenir), Node 24 (oyun sunucusununki), systemd birimleri.
- **Yetki ayrımı (benim kararım).** İki birim: (1) `bozo-derleme` kullanıcısıyla çalışan derleme
  servisi `git pull`, `npm ci`, `npm run build` yapar ve çıktıyı kendi hazırlık dizinine koyar; root
  yetkisi yok. (2) Ancak (1) başarıyla bitince (`OnSuccess=`) çalışan root oneshot: sabit yoldaki hazırlık
  dizinini httpdocs'a `rsync --delete` eder, `chown`/`chmod` ve `plesk repair fs` çalıştırır. Bu betik
  dışarıdan girdi almaz, yolları sabittir. sudoers kuralı yok. Skor sunucusu yalnızca bir istek dosyası yazar (`/var/lib/bozo-derleme/panel/istek`; `panel/` alt dizin, web süreci derleme ağacının köküne yazamaz),
  derlemeyi kendisi başlatmaz: web sürecinin yetkisi build ve rsync'e uzanmaz.
- Derleme adımları `scripts/yayinla.sh`'ın sunucu karşılığı, yukarıdaki iki birime bölünmüş:
  `git pull --ff-only`, `npm ci` (lockfile değiştiyse), `npm run build`, `CANLI MENU ALINAMADI`
  görülürse dur; sonra root birimi yükler ve doğrular. Derleme çıktısında `favicon.svg`,
  `sosyal-kart.jpg` ve `marka/rozet.svg` yoksa yükleme yapılmaz (9 Kasım'daki kazanın bekçisi). Aynı anda tek derleme; derleme sürerken gelen istek bir sonrakine
  birleşir. Sonuç ve son 200 satır günlük bir durum dosyasına yazılır, panel onu okur.
- Kod değişiklikleri (geliştiricinin işi) bugünkü gibi push + `npm run yayinla` ya da sunucudaki
  derleme ile çıkar; derleme her zaman `main`'in son hâlini kullanır. `npm run yayinla` kalır.
- **Otomatik derleme yok:** her yayında kendiliğinden derlemek, bir fiyat düzeltmesi için yedi
  dakikalık derlemeler zinciri demek. Sahibi düğmeye basar. Panel, statik yüzeyleri etkileyen bir
  değişiklik yayınlandığında "Siteyi güncellemeyi unutmayın" der.

### D. Panel düzeni

- Sekmeler: bugünküler + **Fotoğraflar** + **Saatler** (Saatler kısa olduğu için İletişim sekmesinin
  içinde ayrı bir kart da olabilir: kurucunun kararı).
- Mobil önce (sahibi ve personel telefonda); 26 Ekim mobil düzeninin kalıpları.
- Panel metinleri `content/yonetim.ts`'te, Türkçe.

## Kapsam dışı

- Hikaye, ana sayfa, gizlilik ve marka metinleri: uzun, iki dilli, kopya kurallarına bağlı; değişiklik
  nadiren olur ve metin envanterinden gelir. Panelden serbest metin düzenleme bu kuralları deler.
- Adres, koordinat, harita (derlemede OSM'den üretiliyor; 9 Kasım'da görüldüğü gibi nadir).
- Sosyal kart görselleri (`sosyal-kart*.jpg`), favicon, logo.
- Fotoğraf galerisine yuva ekleme/silme: yuvalar tasarımın parçası, sayısı sabit.
- Kullanıcı başına hesap, yetki seviyeleri; oyun ayarları.

## Anti-hedefler

- Sunucuya yüklenen bir dosya, doğrulanmadan hiçbir sayfaya çıkmasın; sunucu yalnız WebP kabul etsin.
- Fotoğraftaki konum bilgisi siteye sızmasın.
- Panelin "Siteyi güncelle" düğmesi web sürecine kabuk, build ya da rsync yetkisi vermesin.
- Eski belge sürümleri (1-6) ve geri alma bozulmasın: yeni bölümler yoksa doğrulayıcı seed'den
  tamamlar (26 Ekim'deki yöntem).
- Saat değişikliği bir metni yarım bırakmasın: bir yerde 10:00, başka yerde yeni saat görünmesin.
- Yeni bir çalışma zamanı bağımlılığı yok (site ve sunucu); görüntü işleme tarayıcıda.

## Kısıtlar

- `next.config.ts` `output: 'export'`, `images.unoptimized: true`; site statik.
- Sunucu: Node 24, `node:http`, tek bağımlılık `mariadb`. Genel gövde sınırı 64 KB, menü ucu 256 KB;
  fotoğraf ucu kendi sınırını okur (3 MB). nginx'in varsayılan gövde sınırı 1 MB:
  `api.cigercibozo.com` vhost'unda `/yonetim/foto` için `client_max_body_size 4m`.
- nginx değişikliği, yeni sistem kullanıcısı ve systemd birimleri arc'ta elle yapılır;
  `docs/surec/SUNUCU-CANLIYA-ALMA.md`'ye eklenir. Sunucu önce, site sonra yayınlanır.
- Renk, yazı ve köşe kuralları kök `CLAUDE.md`'de; panel yeni token getirmez.
- Testler `node:test`; sunucu MariaDB testi isteğe bağlı (`BOZO_TEST_DB_URL`).

## Kurucuya bırakılanlar

Bileşen bölümlemesi, sekme içi yerleşim, odak seçiminin etkileşimi, durum dosyasının biçimi, derleme
günlüğünün panelde nasıl gösterileceği, WebP kalite ayarının ince ayarı.

## Doğrulama

Her görev kendi testiyle. Sonda yerel uçtan uca: panelden bir yuvaya kare yükle, yayınla, sayfada
görün; saati değiştir, derleme çıktısında (`out/`) eski saat hiç kalmasın; derleme isteği durum
dosyasına düşsün. Canlıya alma sırası: nginx ve sunucu, sonra derleme altyapısı, sonra site; her
adım ayrı doğrulanır.
