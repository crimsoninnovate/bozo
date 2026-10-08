# Devam noktası

Bağlam sıfırlandıktan sonra ilk okunacak dosya budur. Kısa tutuluyor: burada yalnız bugünün
durumu ve nereye bakılacağı var. Tarih sıralı kayıt `DEVAM-ARSIV.md`'de, kararların gerekçesi
ve ölçümleri `IYILESTIRMELER.md`'de.

Son güncelleme: 8 Ekim 2026

## Durum

- **8 Ekim 2026'nın üç commit'i (`2d278d6` Maps Place ID, `def4362` ciğer 12 şiş, `04c3284`
  fiyat listesi) yerelde, DEPLOY EDİLMEDİ.** Canlıda hâlâ eski fiyatlar ve "Yol Tarifi Al"ın
  Maps'te "Kıbrıs İnşaat" gösteren koordinat linki var (`IYILESTIRMELER.md` > 8 Ekim 2026).
  163 test, typecheck ve build temiz; yerel taramada 12 rota x 5 genişlik (360-1440) temiz.
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
7. **Performans incelemesi (spike, ayrı görev).** SEMrush'ın 42/100 raporu büyük ölçüde gürültü
   çıktı (kanıt: `IYILESTIRMELER.md`, bu maddenin altına eklenecek); ama gerçek PageSpeed
   Insights verisi mobilde LCP'nin 2.5-3.4s bandında (sınırda, "iyi" eşiği 2.5s) ve CLS'in
   ara sıra 0.1'i aştığını gösterdi (24 Ağustos, iki ayrı ölçüm: 79/93/92/100 ve 96/100/100/100,
   masaüstü her ikisinde de 100). Amaç kök nedeni bulmak, kör düzeltme yapmamak:
   - Chrome DevTools Performance panelinde mobil throttling ile ana sayfa kaydı; LCP adayı
     hangi eleman (hero başlığı mı, kor sahnesi arka planı mı, sosyal kart görseli mi).
   - Aynı kayıtta "Layout Shift Regions" ile CLS'e katkı yapan öğeyi teşhis et; ilk şüpheliler
     `CerezOnayi` bandının hydration sonrası geç montajı, `CanliSaat`'in metin genişliği
     değişimi (`tabular-nums` dijitleri korur ama kelime sayısı değişebilir), font takası.
   - Kök neden netleşmeden hiçbir CSS/JS değişikliği yapılmasın; bu madde yalnızca teşhis,
     düzeltme ayrı bir karar.

8. **İngilizce tur** sıradaki iş. Girdisi `IYILESTIRMELER.md` > "8 Ekim 2026: İngilizce metin
   denetimi": altı kesin hata, geri kalanı sahibinin/yazarın yargısı.

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
