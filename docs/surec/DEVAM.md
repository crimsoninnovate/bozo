# Devam noktası

Bağlam sıfırlandıktan sonra ilk okunacak dosya budur. Kısa tutuluyor: burada yalnız bugünün
durumu ve nereye bakılacağı var. Tarih sıralı kayıt `DEVAM-ARSIV.md`'de, kararların gerekçesi
ve ölçümleri `IYILESTIRMELER.md`'de.

Son güncelleme: 24 Ağustos 2026

## Durum

- Branch `feat/site-kurulumu`. 154 test geçiyor, `npm run typecheck` ve `npm run build` temiz.
  Ağaç temiz, çalışan ajan yok. **Son deploy edilen commit hâlâ `8b5ef7a`** (`--checksum` ile
  birebir doğrulandı, `plesk repair fs` 0 hata); bu SEO/AEO turunun ve final review düzeltme
  turunun HİÇBİR commit'i henüz arc'a gönderilmedi.
- **Site kendi alan adında ve arama motorlarına açık:** `https://cigercibozo.com`.
  `X-Robots-Tag` 24 Ağustos'ta silindi. `www` 301 ile apex'e gidiyor, sertifika Let's Encrypt.
- **Yayın hedefi 20 Ağustos'ta arc sunucusuna taşındı** (`arc.megaonline.net`, Plesk,
  `/var/www/vhosts/cigercibozo.com/httpdocs`). Researchos artık deploy almıyor; oradaki demo
  (`bozo.crimsoninnovate.com`) eski sürümde donmuş durumda. Yordam `README.md` > Publishing.
- GA4 (`G-N3893E7B1P`) opt-in onayın arkasında (`CerezOnayi`), gizlilik sayfası 89/2007'ye göre.
- On iki rota (altı sayfa, iki dil) 200 dönüyor, yatay taşma yok, konsol temiz.

## Bekleyen iş

1. **İşletmeden gelmesi gereken tek veri içecek fiyatları** (`content/urunler.ts`, arayüz fiyat
   yerine sunum ölçüsü basıyor). E-posta, koordinat ve posta kodu 24 Ağustos'ta geldi:
   `content/isletme.ts`'te artık null alan YOK.
2. **On altı fotoğraf** (`content/fotograflar.ts`). Dosya yokken telefonda plaka hiç basılmıyor,
   dosya tanımlanınca kendiliğinden geri geliyor. İlk gerçek fotoğraf geldiğinde
   `fotograflar_hicbiriHenuzDosyaTasimaz` testi bilerek kırılacak, o gün güncellenmeli.
3. **Sahibinin eski açık maddeleri** `KARAR-FORMU.md` A1-A12. Sorulmadan uygulanmaz.
4. `IYILESTIRMELER.md`'de sahibini bekleyen iki madde: "Yol Tarifi Al" etiketinin sayfa içi
   `#harita` hedefiyle çelişkisi, ve Konum hero'sunun boş sağ yarısı. İkincisinin erteleme
   gerekçesi (yer tutucu levha) artık geçerli değil, karar açılabilir.
5. Yasal metinler backlogda (sahibinin kararı, C4). Yeniden önerme.
6. **FAQ/AEO içeriği** (`IYILESTIRMELER.md`, "SSS/answer-block AEO içeriği" ve konumlandırma
   cümlesi maddeleri, Task 9): yapılandırılmış soru-cevap bloğu (`FAQPage`) ve önerilen meta
   açıklama cümlesi ikisi de yeni pazarlama metni gerektirdiği için bu turda uygulanmadı. Sahibine:
   hangi sorular ve cevaplar ([issue #1](https://github.com/crimsoninnovate/bozo/issues/1)),
   konumlandırma cümlesi onaylanır mı ([issue #2](https://github.com/crimsoninnovate/bozo/issues/2)).

## Son turda ne değişti (24 Ağustos, SEO/AEO turu)

- **On iki rotanın `<title>`/açıklaması genişletildi**, hepsi sitede zaten canlı olan metinden
  kuruldu (`content/*/ortak.ts` > `sayfaMeta`), yeni pazarlama metni uydurulmadı.
- **İki yeni JSON-LD üreticisi** `lib/jsonld.ts`'e eklendi: `menuJsonLd(dil)` (`Menu` şeması,
  iki kök layout'ta `restaurantJsonLd`'nin yanında basılıyor) ve `breadcrumbJsonLd(anahtar, dil)`
  (`BreadcrumbList`, `Kabuk`'ta ana sayfa dışındaki her rotada). İki ana sayfa (tr, en) artık iki,
  diğer on rota üç `<script type="application/ld+json">` taşıyor: `Restaurant` + `Menu` her
  sayfada, `BreadcrumbList` yalnız ana sayfa dışındaki on rotada; hepsi geçerli JSON, ölçüldü.
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
