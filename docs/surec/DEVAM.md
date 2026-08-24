# Devam noktası

Bağlam sıfırlandıktan sonra ilk okunacak dosya budur. Kısa tutuluyor: burada yalnız bugünün
durumu ve nereye bakılacağı var. Tarih sıralı kayıt `DEVAM-ARSIV.md`'de, kararların gerekçesi
ve ölçümleri `IYILESTIRMELER.md`'de.

Son güncelleme: 24 Ağustos 2026

## Durum

- Branch `feat/site-kurulumu`. 136 test geçiyor, `npm run typecheck` ve `npm run build` temiz.
  Ağaç temiz, çalışan ajan yok. Son commit `8b5ef7a`, arc'a gönderildi ve `--checksum` ile
  birebir doğrulandı (`plesk repair fs` 0 hata).
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

## Son turda ne değişti (24 Ağustos, gece)

- **Koordinat ve posta kodu geldi**, üç bağımsız kaynakla doğrulandı. `yolTarifiUrl()` beş
  yüzeyde birden adres aramasından gerçek yol tarifine geçti; JSON-LD `geo` ve `postalCode`
  yayında. `postalCode` alanı `lib/jsonld.ts`'te hiç yokmuş, eklendi.
- **İki harita levhası da gerçek OpenStreetMap geometrisi çiziyor**
  (`components/sayfa/haritaYollari.ts`, ODbL atfıyla). Google Maps alınmadı: her embed onay
  kapısı gerektirirdi. Ana sayfa 256 m yakın plan, Konum sayfası 640 m bağlam.
- **Alt bilgi sahibinin kelime markasını taşıyor** (`public/kelime-markasi.svg`). 18 Ağustos'un
  F1 kararı (alt bilgi işaret taşımaz) sahibinin isteğiyle geri alındı; `MarkaKilidi`'nin
  `sadeceKelime` varyantı ölü kaldığı için silindi.
- **Rozetin "yanlardan basık" göründüğü iddiası ölçümle çürütüldü**, ayrıntı
  `IYILESTIRMELER.md`'de.
- **`CLAUDE.md`'nin renk tablosu bayattı**: altı bordo değerinin hepsi 23 Ağustos
  koyulaştırmasından önceki sürümü gösteriyordu, düzeltildi. `styles/palet/bordo.css`'in kendi
  ölçüm notu da (`3.09 → 3.28`) yanlıştı, gerçek değer `2.84 → 3.01`.

## Bir sonraki deploy'da hatırlanacak

- Cloudflare kenarı varlıkları dört saat tutuyor. 23 Ağustos deploy'unda `marka/rozet.svg`,
  `favicon.svg` ve `favicon.ico` bayat kaldı (aynı ad, yeni içerik) ve panelden purge istedi.
  HTML etkilenmiyor (`cf-cache-status: DYNAMIC`).
- Deploy'un tamamlandığını `--checksum`'lı kuru koşuyla doğrula. Düz kuru koşu mtime'a bakar ve
  temiz build tüm zaman damgalarını sıfırladığı için olmayan farkı bildirir. Ayrıca temiz build
  yeni bir Next build ID üretir; her HTML onu asset yollarında taşıdığı için on iki rota da
  gerçekten değişir.
