# Devam noktası

Bağlam sıfırlandıktan sonra ilk okunacak dosya budur. Kısa tutuluyor: burada yalnız bugünün
durumu ve nereye bakılacağı var. Tarih sıralı kayıt `DEVAM-ARSIV.md`'de, kararların gerekçesi
ve ölçümleri `IYILESTIRMELER.md`'de.

Son güncelleme: 13 Ekim 2026

## Durum

- **Site canlı ve arama motorlarına açık:** `https://cigercibozo.com`, arc sunucusunda Plesk, Cloudflare
  önünde. Yayın yordamı `README.md` > Publishing (yerel `out/` rsync ile gider, sonra `chown`).
- **Dal `feat/site-kurulumu`, GitHub'a push edilmedi:** `main` (9 Ekim, `98506c5`) 20 commit geride.
  Canlıdaki sürüm bu dalın son build'idir, `main` değil. Push kullanıcının onayıyla yapılır.
- **Oyun `/oyun/` ve `/en/oyun/` canlı, `noindex`, sitede bağlantısı yok.** Skor sunucusu
  `api.cigercibozo.com` 10 Ekim'den beri canlı (`SUNUCU-CANLIYA-ALMA.md`), personel ekranı
  `/oyun/yonetim/`. 10 Ekim'deki his turları, ses karışımı, sade giriş, arcade Oyna düğmesi ve sahnede
  derinlik (tezgah, tekne gölgesi, sürüklerken kalkış) yayında; kare p95 18,2 ms (4x CPU).
  Simülasyonu değiştiren iş yalnız Pazartesi 05:00 dönem geçişinde yayına çıkar.
- **Menü sayfası, 11-13 Ekim:** Bozo Special 900 TL ve 190 gr. Boş fotoğraf plakaları masaüstünde de
  kapalı (sahibi, 13 Ekim); Ciğer imza alanında eldeki yakın çekim; içecekler çizgili satır; telefonda
  ikram kümeleri tek çerçeve. Plan ve durum: `docs/plans/2026-10-13-menu-iyilestirme-plani.md`.
- **Masa QR'ı** üretildi (`~/Desktop/Bozo/QR/`, `https://cigercibozo.com/menu/`, SVG ve PNG); masadaki
  QR'lar site menüsüne gidiyor, menüdeki QR glifi bu yüzden doğru ve dekoratif.
- Testler 397 geçer (9 atlanır: opt-in MariaDB sözleşmesi), typecheck ve build temiz.

## Bekleyen iş

### Sahibinden gelecek (sorulmadan uygulanmaz)

1. **Menü metinleri:** Bozo Special'ın içeriği, Terbiyeli Tavuk Şiş açıklaması (tavuk şişlerin
   İngilizce adları da buna bağlı), dürüm notu "5 şiş" hâlâ doğru mu, `priceRange` yayımlansın mı.
2. **Fotoğraflar:** on altı boş kare (`content/fotograflar.ts`); geldikçe yalnız `dosya` yazılır,
   plaka kendiliğinden döner. Yatay Ciğer çekimi gelirse imza alanındaki dikey kareyle değişir.
3. **Oyun:** ayran tek dokunuşlu içecek olarak dönsün mü (yol `docs/specs/2026-10-09-oyun-sade-design.md`
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
