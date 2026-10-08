# Devam noktası

Bağlam sıfırlandıktan sonra ilk okunacak dosya budur. Kısa tutuluyor: burada yalnız bugünün
durumu ve nereye bakılacağı var. Tarih sıralı kayıt `DEVAM-ARSIV.md`'de, kararların gerekçesi
ve ölçümleri `IYILESTIRMELER.md`'de.

Son güncelleme: 8 Ekim 2026

## Durum

- **Açılış oyunu, plan 1 bitti: oynanabilir prototip `/oyun/`** (spec
  `docs/specs/2026-10-08-oyun-design.md`, plan `docs/plans/2026-10-08-oyun-plan-1-prototip.md`).
  Gri kutular, sunucusuz, noindex, menüde yok; **yayında değil**. Sırada kaba prototip testi
  (spec §16: mekanda 5-10 misafir) ve plan 2 (görsel dil, animasyon, Motion). Sahibine açık
  kararlar spec §19'da.
- **8 Ekim 2026 turu deploy edildi** (`2d278d6` Maps Place ID, `def4362` ciğer 12 şiş,
  `04c3284` fiyat listesi; `IYILESTIRMELER.md` > 8 Ekim 2026). `plesk repair fs` 0 hata,
  `--checksum` kuru koşuda 0 içerik/boyut farkı (yalnız beklenen `og` sahiplik gürültüsü).
  Canlıda doğrulandı: 12 rota 200, yeni fiyatlar iki dilde, canlı yol tarifi linki Maps'te
  "varış: Ciğerci Bozo" açıyor (önce "Kıbrıs İnşaat").
- **İkinci 8 Ekim deploy'u** (`1f092a7` yarım porsiyon cümlesi, `9568c58` İngilizce tur) 15:45
  build'i ile yayında: dört rotanın canlı HTML'i yerel `out/` ile aynı SHA-256, on iki rota 200.
  165 test, typecheck, build temiz. Commit'ler GitHub'a push edilmedi.
- **Üçüncü 8 Ekim deploy'u:** `b99247c` çerez bandı metni kısaldı (`IYILESTIRMELER.md` >
  "çerez bandı metni kısaldı"). `plesk repair fs` 0 hata, `--checksum` 0 içerik farkı, on iki
  rota 200, canlı bantta yeni metin ve düğmeler, onaysız GA yok. 166 test.
- **Dördüncü 8 Ekim deploy'u:** `43d357c` rozet gölgesi ayrı katmanda (canlı mobil LCP üç soğuk
  ölçümde 2528/2568/2860 ms, LCP = FCP, önce 2906) ve `8dcbfaa` site artık "Uygulamayı yükle"
  önermiyor (manifest `display: browser`, `mobile-web-app-capable` yok). Checksum 0 fark.
- **Beşinci 8 Ekim deploy'u (17:52):** `67ab32e` çekmece alt metni ve genel kontrol turu
  (`dca5670`..`c9eeccf`: next 16.3.8, galeri LCP, çekmece numaraları, Gizlilik hedefi, aksiyon
  barı landmark'ı, kelime markası, JSON-LD kaçışı, ölü kod, portre yayından kalktı, güvenlik
  ve önbellek başlıkları; `IYILESTIRMELER.md` > "tam kapsam genel kontrol"). `repair fs` 0
  hata, `--checksum` 0 içerik farkı, 12 rota 200, beş rotanın HTML'i yerel `out/` ile aynı.
  Canlıda dört güvenlik başlığı var, portre 404. Galeri LCP'si değişmedi (3,26-3,46 sn,
  görselin boyutu). Commit'ler GitHub'a push edilmedi.
- Branch `feat/site-kurulumu`. **SEO/AEO turu deploy edildi (24 Ağustos 2026): son commit
  `5f1d3ee`**, arc'a gönderildi ve `--checksum` ile içerik birebir doğrulandı (`plesk repair fs`
  0 hata; kuru koşuda dönen tek fark sahiplik/grup bayrağı — yerel makinede `engincaglar`
  kullanıcısı olmadığı için beklenen gürültü, checksum/boyut farkı yok). Canlıda ayrıca
  doğrulandı: `/llms.txt` 200 ve `content-type: text/plain; charset=utf-8`, `sitemap.xml`'de
  12 `<priority>`, ana sayfa 1 / `/menu/` 3 JSON-LD `<script>`, title'lar eşleşiyor.
- **Site kendi alan adında ve arama motorlarına açık:** `https://cigercibozo.com`.
  `X-Robots-Tag` 24 Ağustos'ta silindi. `www` 301 ile apex'e gidiyor, sertifika Let's Encrypt.
- **Yayın hedefi 20 Ağustos'ta arc sunucusuna taşındı** (`arc.megaonline.net`, Plesk,
  `/var/www/vhosts/cigercibozo.com/httpdocs`). Researchos artık deploy almıyor; oradaki demo
  (`bozo.crimsoninnovate.com`) eski sürümde donmuş durumda. Yordam `README.md` > Publishing.
- GA4 (`G-N3893E7B1P`) opt-in onayın arkasında (`CerezOnayi`), gizlilik sayfası 89/2007'ye göre.
- On iki rota (altı sayfa, iki dil) 200 dönüyor, yatay taşma yok, konsol temiz.

## Bekleyen iş

0. **Genel kontrolün açık soruları** (`IYILESTIRMELER.md` > "tam kapsam genel kontrol" >
   Sahibine):
   "Bozo's Table", "Beş ürün" çelişkisi, galeri sayfası ve boş plakalar, onayı geri alma,
   EN "piece", tanımsız `--krem-84`. Galeri görseli q70'e indi (`d72d884`, 165 → 126 KB) ve
   ölü `sizes` propu silindi (`d521116`): ikisi commit'li, **deploy onayı bekliyor**.
   Kullanıcıya: `X-Powered-By` sunucu genelinde bir Plesk ayarı, 26 vhost'u etkiler.
1. **Fiyat listesinden kalan üç soru sahibinde** (`IYILESTIRMELER.md` > "8 Ekim 2026: fiyat
   listesi"): dürüm notu "5 şiş" hâlâ doğru mu, `priceRange` yayımlansın mı, Terbiyeli Tavuk
   Şiş açıklaması. İçecek fiyatları dahil bütün fiyatlar 8 Ekim'de geldi.
2. **On yedi kare** (`content/fotograflar.ts`; 8 Ekim'de terbiyeli tavuk şiş yuvası eklendi). Dosya yokken telefonda plaka hiç basılmıyor,
   dosya tanımlanınca kendiliğinden geri geliyor. İlk gerçek fotoğraf geldiğinde
   `fotograflar_hicbiriHenuzDosyaTasimaz` testi bilerek kırılacak, o gün güncellenmeli.
3. **Sahibinin eski açık maddeleri** `KARAR-FORMU.md` A1-A12. Sorulmadan uygulanmaz.
4. `IYILESTIRMELER.md`'de sahibini bekleyen iki madde: "Yol Tarifi Al" etiketinin sayfa içi
   `#harita` hedefiyle çelişkisi, ve Konum hero'sunun boş sağ yarısı. İkincisinin erteleme
   gerekçesi (yer tutucu levha) artık geçerli değil, karar açılabilir.
5. **Gizlilik metni yayında ama hukukçu onayından geçmedi.** 24 Ağustos'ta iki turda
   yazıldı/güçlendirildi (`IYILESTIRMELER.md` > "KKTC uyumu, araştırılmış hâliyle" ve bugünkü
   ikinci tur). O turda sahibine iletilen, kodla çözülemeyen iki açık madde hâlâ cevapsız:
   Madde 8 Başkana Bildirim (kvkk.gov.ct.tr Başkana Bildirim Formu) ve Madde 11 Transfer
   Ruhsatı (şu an onay yolu Madde 11(2)(A) kullanılıyor, ruhsat ayrı bir seçenek). C4'ün eski
   "backlogda kalsın" kararı GA4 eklenince (24 Ağustos) geçersiz oldu, madde ona göre güncellendi.
6. **FAQ/AEO içeriği** (`IYILESTIRMELER.md`, "SSS/answer-block AEO içeriği" ve konumlandırma
   cümlesi maddeleri, Task 9): yapılandırılmış soru-cevap bloğu (`FAQPage`) ve önerilen meta
   açıklama cümlesi ikisi de yeni pazarlama metni gerektirdiği için bu turda uygulanmadı. Sahibine:
   hangi sorular ve cevaplar ([issue #1](https://github.com/crimsoninnovate/bozo/issues/1)),
   konumlandırma cümlesi onaylanır mı ([issue #2](https://github.com/crimsoninnovate/bozo/issues/2)).
7. **Performans teşhisi yapıldı (8 Ekim 2026); aday 1 (rozet gölgesi) uygulandı, 2-5 karar bekliyor**
   (`IYILESTIRMELER.md` > "mobil performans teşhisi"). Mobil kısıtlı soğuk yüklemede ana
   sayfa LCP 2906 ms: LCP öğesi üst bardaki rozet, yalnız `drop-shadow`'u alanını şişirdiği
   için (filtre kapalıyken LCP = FCP = 2572 ms). FCP'yi 92 KB'lık ana CSS belirliyor; aynı
   anda inen ~280 KB font/JS/SVG ile bant paylaşıyor. Ağustos'taki CLS > 0,1 yeniden
   üretilemedi: üç sayfada, dört saat durumunda 0,0009-0,0014. Beş düzeltme adayı kayıtta.

8. **İngilizce tur 8 Ekim 2026'da uygulandı ve yayında** (`IYILESTIRMELER.md` > "İngilizce tur, uygulandı").
   Tavuk şişlerin İngilizce adları Terbiyeli Tavuk Şiş açıklamasını bekliyor (madde 1).

## Son turda ne değişti (24 Ağustos, SEO/AEO turu)

- **On iki rotanın `<title>`/açıklaması genişletildi**, hepsi sitede zaten canlı olan metinden
  kuruldu (`content/*/ortak.ts` > `sayfaMeta`), yeni pazarlama metni uydurulmadı.
- **İki yeni JSON-LD üreticisi** `lib/jsonld.ts`'e eklendi: `menuJsonLd(dil)` (`Menu` şeması,
  `Kabuk`'ta yalnız `/menu` rotasında basılıyor; final review sonrası site geneli değil, bkz.
  `IYILESTIRMELER.md`) ve `breadcrumbJsonLd(anahtar, dil)` (`BreadcrumbList`, `Kabuk`'ta ana
  sayfa dışındaki her rotada). İki ana sayfa tek `<script type="application/ld+json">` taşır
  (`Restaurant`), iki menü sayfası üç (`Restaurant` + `Menu` + `BreadcrumbList`), diğer sekiz
  rota iki (`Restaurant` + `BreadcrumbList`); hepsi geçerli JSON, ölçüldü.
- **`app/sitemap.ts` her URL'i `lastModified`/`changeFrequency`/`priority` ile damgalıyor.**
- **`lib/llmsTxt.ts`**, yapay zeka/cevap motoru tarayıcıları için build zamanında bir olgu özeti
  üretiyor; `/llms.txt`'te (`app/llms.txt/route.ts`) yayında, okunur metin ve işlevsel linklerle.
- Test sayısı 138'den 154'e çıktı (6 `menuJsonLd` + 5 `breadcrumbJsonLd` + 5 `llmsTxt` testi).
  `npm run typecheck`, `npm test`, `npm run build` üçü de temiz; on iki rota 200 dönüyor, konsol
  temiz (`hikaye` sayfalarındaki font/CSS preload uyarıları bu turun ürünü değil, dokunulan
  dosyalardan hiçbiri font/preload/CSS parçalama ile ilgili değil).

## Bir sonraki deploy'da hatırlanacak

- Cloudflare kenarı varlıkları dört saat tutuyor. 23 Ağustos deploy'unda `marka/rozet.svg`,
  `favicon.svg` ve `favicon.ico` bayat kaldı (aynı ad, yeni içerik) ve panelden purge istedi.
  HTML etkilenmiyor (`cf-cache-status: DYNAMIC`).
- Deploy'un tamamlandığını `--checksum`'lı kuru koşuyla doğrula. Düz kuru koşu mtime'a bakar ve
  temiz build tüm zaman damgalarını sıfırladığı için olmayan farkı bildirir. Ayrıca temiz build
  yeni bir Next build ID üretir; her HTML onu asset yollarında taşıdığı için on iki rota da
  gerçekten değişir.
