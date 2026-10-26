# Devam noktası

Bağlam sıfırlandıktan sonra ilk okunacak dosya budur. Kısa tutuluyor: burada yalnız bugünün
durumu ve nereye bakılacağı var. Tarih sıralı kayıt `DEVAM-ARSIV.md`'de, kararların gerekçesi
ve ölçümleri `IYILESTIRMELER.md`'de.

Son güncelleme: 26 Ekim 2026

## Durum

- **Site canlı ve arama motorlarına açık:** `https://cigercibozo.com`, arc sunucusunda Plesk, Cloudflare
  önünde. Yayın yordamı `README.md` > Publishing (yerel `out/` rsync ile gider, sonra `chown`).
- **`main` GitHub'da `5e4a709` (25 Ekim):** aşağıdaki fiyat ve şiş turları dahil her şey canlıda.
  Push her seferinde kullanıcının onayıyla yapılır.
- **Menü yönetim paneli, 26 Ekim (`feat/menu-yonetim`, push edilmedi, canlıda değil):** fiyat ve menü
  metni artık personel panelinden (`/oyun/yonetim/`, Menü sekmesi) yayınlanır; belge `menu_surum`
  tablosunda, build öncesi `scripts/menuCek.ts` son sürümü çeker. Plan
  `docs/plans/2026-10-26-menu-yonetim-plani.md`, tasarım `docs/specs/2026-10-26-menu-yonetim-design.md`,
  sunucu ve geri alma `SUNUCU-CANLIYA-ALMA.md` > Menü sürümleri. Canlıya alma (T9) sırayla ve her
  adımda sahibin onayıyla: şema, sunucu, site, uçtan uca deneme. Fiyat artık kodda değil panelde.
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
- **Telefon ve WhatsApp siteden gizli (19 Ekim, sahibi):** `content/isletme.ts` > `TELEFONLA_ILETISIM_ACIK`
  `false`; geri açmak için `true` yapmak yeter, test ve JSON-LD buna bağlı. Sosyal ikonlar tek renk
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
- Testler 541 geçer (18 atlanır: opt-in MariaDB sözleşmesi), typecheck temiz (26 Ekim, `feat/menu-yonetim`).

## Bekleyen iş

### Sahibinden gelecek (sorulmadan uygulanmaz)

0. **Menü paneli (26 Ekim):** Dalak fiyatı (19 Ekim notundan açık kalan soru, şimdilik 550); gizlilik
   metnindeki yeni menü cümlesi (`content/{tr,en}/gizlilik.ts`, `aliciMetni`) sahibin ya da hukukçunun
   gözünden geçmedi; panel Ciğer'i ilk kalem olarak sabitliyor (imza alanı bu kuralı bekliyor, silinemez
   ve taşınamaz): kural doğru mu; Aşama 2 (panelden yayında siteyi kendiliğinden yeniden basmak) yapılmadı,
   şimdilik elle build ve deploy.
1. **Menü metinleri:** Bozo Special rozetindeki gramaj 200 mü 190 mı (şu an 200 gr, 19 Ekim'de 190'dan
   çekildi, geri alınabilir), Terbiyeli Tavuk Şiş açıklaması (tavuk şişlerin İngilizce adları da buna
   bağlı), `priceRange` yayımlansın mı.
2. **Fotoğraflar:** on altı boş kare (`content/fotograflar.ts`); geldikçe yalnız `dosya` yazılır,
   plaka kendiliğinden döner. Yatay Ciğer çekimi gelirse imza alanındaki dikey kareyle değişir.
3. **Oyun:** elde şiş varken başka kaynağa uzanılamıyor (simülasyon kuralı, değişirse Pazartesi
   05:00'te çıkar); ayran tek dokunuşlu içecek olarak dönsün mü (yol `docs/specs/2026-10-09-oyun-sade-design.md`
   > Ayran); sesler kulakla dinlenmedi (`~/Desktop/Bozo/ses-dinleme/`); gerçek telefonda kare ölçümü;
   paylaşım kartı ve kurallar sayfası sahibin metnini bekliyor; raster varlıklar
   (`docs/surec/OYUN-VARLIK-BRIEFI.md`).
4. **Hukuk:** KKTC 89/2007 Md. 8 Başkana Bildirim ve Md. 11 Transfer Ruhsatı yapılmadı; gizlilik
   metni hukukçudan geçmedi (sahibi incelemeyi istemedi, 10 Ekim).
5. **Eski açık kararlar:** `KARAR-FORMU.md` A1-A12; "Yol Tarifi Al" etiketinin `#harita` hedefiyle
   çelişkisi; Konum hero'sunun boş sağ yarısı; genel kontrolün soruları ("Bozo's Table", "Beş ürün",
   galeri ve boş plakalar, onayı geri alma, EN "piece", tanımsız `--krem-84`) `IYILESTIRMELER.md` >
   "tam kapsam genel kontrol" > Sahibine.
6. **SSS ve konumlandırma cümlesi** yeni metin gerektiriyor
   ([issue #1](https://github.com/crimsoninnovate/bozo/issues/1),
   [issue #2](https://github.com/crimsoninnovate/bozo/issues/2)).
7. **Performans adayları 2-5** (`IYILESTIRMELER.md` > "mobil performans teşhisi"); aday 1 yayında.
8. `X-Powered-By` başlığı sunucu genelinde bir Plesk ayarı, 26 vhost'u etkiler: kullanıcının kararı.

## Bir sonraki deploy'da hatırlanacak

- Cloudflare kenarı varlıkları dört saat tutuyor. 23 Ağustos deploy'unda `marka/rozet.svg`,
  `favicon.svg` ve `favicon.ico` bayat kaldı (aynı ad, yeni içerik) ve panelden purge istedi.
  HTML etkilenmiyor (`cf-cache-status: DYNAMIC`).
- Deploy'un tamamlandığını `--checksum`'lı kuru koşuyla doğrula. Düz kuru koşu mtime'a bakar ve
  temiz build tüm zaman damgalarını sıfırladığı için olmayan farkı bildirir. Ayrıca temiz build
  yeni bir Next build ID üretir; her HTML onu asset yollarında taşıdığı için on iki rota da
  gerçekten değişir.
