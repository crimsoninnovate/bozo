# Devam noktası

Bağlam sıfırlandıktan sonra ilk okunacak dosya budur. Kısa tutuluyor: burada yalnız bugünün
durumu ve nereye bakılacağı var. Tarih sıralı kayıt `DEVAM-ARSIV.md`'de, kararların gerekçesi
ve ölçümleri `IYILESTIRMELER.md`'de.

Son güncelleme: 9 Kasım 2026

## Durum

- **Panelden sayfa metinleri (9 Kasım gecesi, yerel `main`; push ve kurulum sahibinin onayını bekliyor).**
  Panelde "Sayfa Metinleri" sekmesi: Ana sayfa, Menü, Hikaye, Konum ve Galeri'nin 119 metni Türkçe ve
  İngilizce; değişen metin belgenin `metinler` bölümünde durur, "Siteyi Güncelle" ile sayfaya basılır.
  Yer tutucular, elle saat ve metin kuralları doğrulanır; koddan kopan metin okurken düşer. Tasarım
  `docs/specs/2026-11-09-panel-metinler-design.md`, kurulum `SUNUCU-CANLIYA-ALMA.md` > Panelden sayfa
  metinleri (önce sunucu). Yerelde uçtan uca denendi (1280 ve 390 px). Kişi başına girişle aynı kurulumda
  çıkabilir.

- **Kişi başına panel girişi (9 Kasım gecesi, `main`'e yerelde birleştirildi; push ve kurulum sahibinin onayını bekliyor).** Admin
  ortamda kalır; panelin Kullanıcılar sekmesinden (yalnız admin) hesap açılır, kapatılır, geçici şifre verilir.
  Geçici şifreli hesap önce kendi şifresini koyar; kapatma, sıfırlama ve şifre değişimi o hesabın bütün
  oturumlarını düşürür. Her işlem kayda girer (bir yıl), Geçmiş her sürümün yayınlayanını gösterir, üst barda
  giriş yapanın adı var. Tasarım `docs/specs/2026-11-09-panel-kullanicilar-design.md`, plan
  `docs/plans/2026-11-09-panel-kullanicilar-plani.md`, kurulum `SUNUCU-CANLIYA-ALMA.md` > Kişi başına panel
  girişi (şema, yetkiler, önce sunucu). Yerelde 390px ve masaüstünde uçtan uca denendi; son inceleme temiz
  (iki güvenlik düzeltmesiyle); incelemenin ertelenen dört küçük bulgusu da kapandı (yanlış eski şifre artık
  403 `eskiSifreYanlis`, 401 girişe döner; sunucu ve site birlikte çıkmalı). Sırada: sahibin onayıyla push ve kurulum. Ardından sayfa metinlerinin panelden
  düzenlenmesi (önce beyin fırtınası).

- **Panel iyileştirmeleri (9 Kasım akşamı).** Yayın onayı, Türkçesiyle aynı kalmış İngilizce metni uyarır
  (Türkçe harf ya da en az üç kelime varsa; Cola, Ayran gibi kısa adlar aynı kalabilir); uyarılar ikram ve
  duyuru kayıtlarını da adıyla gösterir. Derleme ya da yükleme `hata` ile biterse `bozo@cigercibozo.com`'a bir
  e-posta gider (`sunucu/derleme/uyari.sh`, `bozo-uyari.{path,service}`, arc'ta açık; SMTP ile, DKIM imzalı,
  deneme `web@`'e ulaştı). Sahibin bıraktığı öneriler: önizleme ve kullanılmayan fotoğraf temizliği gerekmez.

- **Panel: fotoğraflar, saatler, siteyi güncelle (9 Kasım, `feat/panel-icerik`, 9 Kasım'da `main`'e
  birleştirildi ve canlıya alındı).** Menü belgesinde `saatler` ve `fotograflar`
  bölümleri; metinlerdeki saatler derlemede belgeden dolar, rozet canlı saatle çalışır; yuvalar fotoğrafı
  belgeden basar (`lib/fotoKaynagi.ts`); skor sunucusunda `POST /yonetim/foto` ve `GET/POST /yonetim/derleme`;
  panelde Fotoğraflar ve Saatler sekmeleri ile "Siteyi Güncelle"; arc betikleri ve birimleri
  `sunucu/derleme/`. Tasarım `docs/specs/2026-11-09-panel-icerik-design.md`, plan
  `docs/plans/2026-11-09-panel-icerik-plani.md`, kurulum `SUNUCU-CANLIYA-ALMA.md` > Panelden site yayını.
  Testler 911 geçer (18 atlanır), typecheck temiz. Yerel uçtan uca derleme denetimi (saat 12/4, foto adresi,
  JSON-LD) ayrıca yapılır. **Canlıda (9 Kasım 18:23):** deploy key, nginx `/foto/`, skor sunucusu,
  derleme birimleri; site arc'ta derlenip yayınlandı, panel düğmesi uçtan uca denendi (istek -> `yayinda`). arc'ın
  glibc 2.28'i Next'in yerel SWC'sine yetmediği için derleme `bozo-derleme:1` Docker imajında çalışır (`kap.sh`);
  systemd 239 `OnSuccess=` tanımadığı için yükleme `ExecStartPost=+` ile başlar; foto dizini SELinux etiketli.
  Mevcut kare yüklendi (`78106ea6c26cd0e8.webp`); `tane-yakin-cekim` ve `tane-yakin-cekim-yatay` yuvalarına
  panelden atanması kaldı. Sıra fiyat yayınını kilitlemez: yeni
  sunucu, eski panelin saatsiz ve fotosuz belgesini geçerli sürümün (yoksa tohumun) bölümleriyle tamamlar.

- **Adres No:20D, pin ve Bozani (9 Kasım, canlıda).** Kapı numarası düzeltildi, harita pini Google
  kaydına taşındı ve yollar yeni merkezde yeniden çekildi (`IYILESTIRMELER.md`, 9 Kasım). Bozo Karışık'ın
  yeni adı Bozani: canlı menüde sürüm 6 (veritabanına panelin taban kontrollü
  INSERT'üyle yazıldı, yalnız iki ad alanı değişti), site yeniden yayınlandı. Google İşletme Profili hala "No 4" diyor (sahibi düzeltir).
  Ana dizindeki `node_modules` bozuk (`lib.dom.d.ts`, `next/dist/compiled/zod` eksik): `npm ci`.

- **Panel mobil tasarımı ve "Beni hatırla" canlıda (26 Ekim, önce skor sunucusu, sonra site; `main`'e
  birleştirildi).** Giriş formu `POST /yonetim/oturum` çağırır (30 günlük imzalı anahtar); sunucu
  geri alınırsa site de geri alınmalı, yoksa giriş 404 verir. Kimlik bilgisi değişince tüm oturumlar düşer.
  Panel telefon önce yeniden tasarlandı (sekmeli tek sütun, sabit alt eylem çubuğu); iki metin taşındı:
  sitenin tam durum cümlesi artık Geçmiş sekmesinde, dürüm ipucu Ocakbaşı sekmesinin notunda. Giriş
  kartında rozet logo ve "Yönetim Ekranı" başlığı var (sahibin isteği). Sahibin telefonda gerçek
  şifreyle girişi henüz denenmedi.

- **Panel genişletmesi canlıda (26 Ekim, önce skor sunucusu, sonra `npm run yayinla`; `main`'e
  birleştirildi).** Menü belgesi v2: tükendi işareti, duyuru bandı, ikramlar ve iletişim bilgileri artık
  panelden düzenlenir. Hangisi menü sayfasında anında görünür, hangisi site yayını ister:
  `README.md` > Publishing > Deploy tablosu. Tasarım `docs/specs/2026-10-26-panel-genisletme-design.md`,
  plan `docs/plans/2026-10-26-panel-genisletme-plani.md`. Yayın tek komut: `npm run yayinla`
  (`scripts/yayinla.sh`), sahibin onayıyla çalıştırılır. Telefon kapalıyken numara hiçbir herkese açık
  çıktıda yok (`lib/menu/herkeseAcik.ts`; canlıda sayfa ve JS paketlerinde aranıp 0 bulundu). Aynı akşam
  ikram kümeleri ve öğeleri sıralanabilir oldu, ana sayfadaki ikram sayısı belgeden gelir, panel
  kaydedilmemiş çalışmayı cihazda taslak olarak tutar (`bozo-yonetim-taslak`).

- **Site canlı ve arama motorlarına açık:** `https://cigercibozo.com`, arc sunucusunda Plesk, Cloudflare
  önünde. Yayın yordamı `README.md` > Publishing (yerel `out/` rsync ile gider, sonra `chown`).
- **`main` GitHub'da, panel mobil tasarımını içeriyor; canlı site bu build'de (26 Ekim).**
  Push her seferinde kullanıcının onayıyla yapılır.
- **Menü yönetim paneli, 26 Ekim (canlıda):** fiyat ve menü metni artık personel
  panelinden (`/yonetim/`, ayrı sayfa; oyun yönetimi bağlantısı sahibi tarafından bilerek gizli)
  yayınlanır; belge `menu_surum` tablosunda, build öncesi `scripts/menuCek.ts` son sürümü çeker. Plan
  `docs/plans/2026-10-26-menu-yonetim-plani.md`, tasarım `docs/specs/2026-10-26-menu-yonetim-design.md`,
  sunucu ve geri alma `SUNUCU-CANLIYA-ALMA.md` > Menü sürümleri. Fiyat artık kodda değil panelde.
  T9 (26 Ekim, canlıya alındı): üretim DB'si `bozo_oyun` -> `bozo_site` (kullanıcı `bozo_site_k`, Plesk'ten),
  eski DB ve kullanıcısı kaldırıldı (yedek `/root/.bozo/bozo_oyun.*.sql`, eski dist `/root/.bozo/dist.*.eski`).
  `menu_surum` şeması uygulandı, MariaDB sözleşme testi gerçek MariaDB 10.11'de 18/18 geçti
  (REPEATABLE-READ, deadlock algılama açık), sunucu ve site deploy edildi, uçtan uca PUT/GET/409/401
  denendi, 1. sürüm tohum menüyle aynı içerikle yayınlandı. Panelin tarayıcıdan girişi sahibin
  eline kaldı. Açık: Aşama 2.
- **Oyun `/oyun/` ve `/en/oyun/` canlı, `noindex`, sitede bağlantısı yok.** Skor sunucusu
  `api.cigercibozo.com` 10 Ekim'den beri canlı (`SUNUCU-CANLIYA-ALMA.md`), personel ekranı
  `/oyun/yonetim/`. 10 Ekim'deki his turları, ses karışımı, sade giriş, arcade Oyna düğmesi ve sahnede
  derinlik (tezgah, tekne gölgesi, sürüklerken kalkış) yayında; kare p95 18,2 ms (4x CPU).
  Simülasyonu değiştiren iş yalnız Pazartesi 05:00 dönem geçişinde yayına çıkar.
- **Menü sayfası, 11-13 Ekim:** boş fotoğraf plakaları masaüstünde de kapalı (sahibi, 13 Ekim); Ciğer
  imza alanında eldeki yakın çekim; içecekler çizgili satır; telefonda ikram kümeleri tek çerçeve.
  Plan ve durum: `docs/plans/2026-10-13-menu-iyilestirme-plani.md`.
- **Fiyat ve şiş turları, 19-25 Ekim (sahibinin listeleri):** içecek fiyatları güncellendi; 1,5 porsiyon
  ve 1,5 dürüm kalktı; ölçü yalnız Porsiyon ve Dürüm. 24 Ekim el yazısı listesiyle dürüm servisle aynı
  fiyat ve aynı şiş sayısında. Güncel tablo tohum belge `content/menu.varsayilan.json` (canlısı
  panelde; ciğer 690; dalak, yürek, terbiyeli ve terbiyesiz tavuk şiş 550; terbiyeli kuşbaşı 850, 25 Ekim; karışık 700; Bozo Special 900), şiş sayıları
  belgede `porsiyonNotu` / `durumNotu`. Bozo Special "2 şiş 200 gr", menüde şiş sayısı porsiyonun yanında,
  kolalar "Cola" ve "Cola Zero".
- **Telefon ve WhatsApp siteden gizli (19 Ekim, sahibi):** anahtar menü belgesinde `iletisim.telefonAcik`
  (panelde "telefonla iletişim açık"), build'de gömülür; geri açmak için paneldeki anahtarı açıp siteyi
  yeniden yayınlamak yeter, test ve JSON-LD buna bağlı. Sosyal ikonlar tek renk
  (`currentColor`), Facebook ve TikTok bağlantıları ile Google yorum daveti eklendi, mobil çubukta
  WhatsApp yerine Instagram var (20 Ekim).
- **Süreç, 23 Ekim:** kök `CLAUDE.md` 197 satıra indi; oyun kuralları `lib/oyun/`, `components/oyun/` ve
  `sunucu/` altındaki kendi `CLAUDE.md` dosyalarına, fiyat ve metin kuralları `content/CLAUDE.md`'ye
  taşındı. Deploy tamamlanma kontrolü `--no-owner --no-group --no-perms` ile çalışır.
- **Masa plakaları, 13 Ekim:** 30 pleksi plakanın her biri `cigercibozo.com/m/N` (1-30) taşıyor; adres
  basılı, hiç değişmez. `.htaccess` 302 ile `/menu/?masa=N`'e yollar, menü okumayı skor sunucusuna
  bildirir (`POST /tarama/N`, tablo `masa_tarama`, kişisel veri yok), personel ekranı "Masa okumaları"
  bölümünde bugün / son 7 gün / toplam gösterir. Canlıda uçtan uca doğrulandı, deneme kayıtları silindi.
  Brifteki GA4 `menu_scan` olayı kullanılmadı: GA onaysız çalışmaz, okumaların küçük bir kısmını sayardı.
- **Masa QR'ı** (11 Ekim, tek ortak QR) üretildi (`~/Desktop/Bozo/QR/`, `https://cigercibozo.com/menu/`, SVG ve PNG); masadaki
  QR'lar site menüsüne gidiyor, menüdeki QR glifi bu yüzden doğru ve dekoratif.
- Testler 722 geçer (18 atlanır: opt-in MariaDB sözleşmesi), typecheck temiz (26 Ekim, `main`).

## Bekleyen iş

### Sahibinden gelecek (sorulmadan uygulanmaz)

0. **Menü paneli (26 Ekim):** Dalak fiyatı (19 Ekim notundan açık kalan soru, şimdilik 550); panel Ciğer'i
   ilk kalem olarak sabitliyor (imza alanı bu kuralı bekliyor, silinemez ve taşınamaz): kural doğru mu;
   Aşama 2 (panelden siteyi yeniden basmak) ve fotoğraf yükleme `feat/panel-icerik` dalında yapıldı (yukarıda);
   çalışma saatleri artık panel alanı (Saatler sekmesi). Saatler ileride güne göre ayrışabilir (sahibi, 9 Kasım):
   yol `docs/specs/2026-11-09-panel-icerik-design.md` > Güne göre saatler (ileride). Ana sayfadaki "sekiz
   ikram" (`ana.ocakbasi.altNot`) belgeden doldurulur, bir sonraki site güncellemesiyle yenilenir.
1. **Menü metinleri:** Bozo Special rozetindeki gramaj 200 mü 190 mı (şu an 200 gr, 19 Ekim'de 190'dan
   çekildi, geri alınabilir), Terbiyeli Tavuk Şiş açıklaması (tavuk şişlerin İngilizce adları da buna
   bağlı), `priceRange` yayımlansın mı.
2. **Fotoğraflar:** on altı boş kare (`content/fotograflar.ts`); geldikçe panelin Fotoğraflar sekmesinden
   yüklenir (dal canlıya alınınca), plaka "Siteyi Güncelle" ile döner. Yatay Ciğer çekimi gelirse imza alanındaki dikey kareyle
   değişir.
3. **Oyun:** elde şiş varken başka kaynağa uzanılamıyor (simülasyon kuralı, değişirse Pazartesi
   05:00'te çıkar); ayran tek dokunuşlu içecek olarak dönsün mü (yol `docs/specs/2026-10-09-oyun-sade-design.md`
   > Ayran); sesler kulakla dinlenmedi (`~/Desktop/Bozo/ses-dinleme/`); gerçek telefonda kare ölçümü;
   paylaşım kartı ve kurallar sayfası sahibin metnini bekliyor; raster varlıklar
   (`docs/surec/OYUN-VARLIK-BRIEFI.md`).
4. **Hukuk:** KKTC 89/2007 Md. 8 Başkana Bildirim ve Md. 11 Transfer Ruhsatı yapılmadı (sahibi
   üstlendi, 10 Ekim). Gizlilik metni için ayrı inceleme adımı yok (sahibi, 26 Ekim); metin veri
   akışıyla tutarlı kalmalı.
5. **Eski açık kararlar:** `KARAR-FORMU.md` A1-A12; "Yol Tarifi Al" etiketinin `#harita` hedefiyle
   çelişkisi; Konum hero'sunun boş sağ yarısı; genel kontrolün soruları ("Bozo's Table", "Beş ürün",
   galeri ve boş plakalar, onayı geri alma, EN "piece", tanımsız `--krem-84`) `IYILESTIRMELER.md` >
   "tam kapsam genel kontrol" > Sahibine.
6. **SSS ve konumlandırma cümlesi** yeni metin gerektiriyor
   ([issue #1](https://github.com/crimsoninnovate/bozo/issues/1),
   [issue #2](https://github.com/crimsoninnovate/bozo/issues/2)).
7. **Performans adayları 2-5** (`IYILESTIRMELER.md` > "mobil performans teşhisi"); aday 1 yayında.
8. `X-Powered-By` başlığı sunucu genelinde bir Plesk ayarı, 26 vhost'u etkiler: kullanıcının kararı.

### `feat/panel-icerik` sonrası (birleşmeyi beklemez)

- **Sahibinin göz atacağı kararlar (9 Kasım):** iPhone WebP kodlayamadığı için JPEG de kabul ediliyor;
  "Siteyi Güncelle" derleme sürerken kapalı; 60 dakikadan eski "derleniyor" hata sayılır; sunucu eski
  panelin eksik bölümlerini (saatler, fotoğraflar, iletişim, duyuru, ikramlar) geçerli sürümden doldurur;
  fotoğraf "nerede kullanılıyor" etiketleri `lib/yonetim/fotoYerleri.ts`'te; güne göre saat yapılmadı.
- **Ertelenen küçük işler:** `SiteGuncelle` anket döngüsünün ve `useGirneSaati` canlı saat durumunun testi
  yok; elektrik kesintisinde `durum.json` diskte "derleniyor" kalır (panel 60 dakika sonra hata gösterir);
  `CLAUDE.md` 72-75 tablo satırları 120 karakteri aşıyor (tablo satırı bölünemez). 9 Kasım'da kapandı: odak
  seçici ok tuşlarıyla, şeffaf PNG JPEG'de beyaz zeminle, içecek ölçüsü ekleme/silme "unutmayın" notunu
  veriyor, `fotoGoc.ts` hataları yakalıyor. Docker'a geçiş incelendi; üç bulgu (root `docker`'ın `HOME`'u, başlamayan konteyner, SIGTERM) düzeltilip arc'ta denendi.

## Bir sonraki deploy'da hatırlanacak

- **Sıra (sahibin onayıyla):** sunucu kodu değiştiyse önce skor sunucusu (`SUNUCU-CANLIYA-ALMA.md` >
  Sunucu güncellemesi), sonra `npm run yayinla`.
- **v1 geri alma tuzağı:** canlıdaki geçerli sürüm hala v1 biçiminde olduğundan, ilk v2 yayınına kadar
  geri alma 409 `gecerliSurumEski` döner. Panelden bir kez yayınlamak yeter.
- `npm run yayinla` canlı menü alınamazsa yüklemeden durur (`CANLI MENU ALINAMADI`): eski menüyle
  yayın iletişim bilgilerini geri alırdı.

- Cloudflare kenarı varlıkları dört saat tutuyor. 23 Ağustos deploy'unda `marka/rozet.svg`,
  `favicon.svg` ve `favicon.ico` bayat kaldı (aynı ad, yeni içerik) ve panelden purge istedi.
  HTML etkilenmiyor (`cf-cache-status: DYNAMIC`).
- Deploy'un tamamlandığını `--checksum`'lı kuru koşuyla doğrula. Düz kuru koşu mtime'a bakar ve
  temiz build tüm zaman damgalarını sıfırladığı için olmayan farkı bildirir. Ayrıca temiz build
  yeni bir Next build ID üretir; her HTML onu asset yollarında taşıdığı için on iki rota da
  gerçekten değişir.
