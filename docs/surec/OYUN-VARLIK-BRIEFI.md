# Oyun görsel varlıkları: üretim brief'i

Tarih: 9 Ekim 2026. Amaç: `/oyun` sahnesini yapay zekâ ile üretilmiş raster varlıklarla
gerçekçi ve şık hâle getirmek; ışık, derinlik ve hareket katmanını kod verir. Araçlar:
Firefly, Image 2.5, Nano Banana, Higgsfield (sahibi üretir, dosyaları teslim eder).

## 1. Stil çıpası (her istemin başına aynen)

```
Stylized semi-realistic render, warm cinematic lighting, Urfa-style ocakbaşı grill
restaurant at night in Kyrenia. Key light is glowing charcoal embers from below,
orange (#FF7A1A) accents, deep burgundy shadows (#230D0B), cream highlights (#F9E9D5),
copper, walnut wood, white marble, steel skewers. Camera 3/4 top-down, about 35 degrees
elevation. Soft rim light, glossy wet surfaces, clean crisp edges, high detail.
No text, no letters, no logos, no people, no watermark.
```

**Tutarlılık kuralı.** Önce bir **ana tablo** üretilir: üç ürün (ciğer, dalak, yürek) çiğ ve
pişmiş, bakır tabak, bakır maşrapa, şiş, mermer parçası, aynı sahnede, aynı ışıkta. Onay
alındıktan sonra bu görsel **referans görsel** olarak her sonraki istemde verilir
(Nano Banana ve Higgsfield referans görseli destekler). Aynı tohum ve aynı model kullanılır;
yarı yolda model değiştirilmez.

## 2. Tek parça varlıklar için ek cümle

```
Isolated on a solid flat magenta (#FF00FF) background, centered, no ground shadow,
no reflection, nothing cropped, even margin around the object.
```

Magenta arka plan temiz kesilir (et ve bakırla karışmaz). Gölgeyi kod ekler; kendi gölgesini
çizdirme. Kenarda ışık halesi ya da beyaz çerçeve çıkarsa yeniden üret.

## 3. Varlık listesi, öncelik sırasıyla

Boyutlar 2x (retina) çıktı boyutudur; ekranda yarısı kadar görünür.

| # | Varlık | Çıktı | Not |
|---|---|---|---|
| 1 | **Arka plan sahnesi**: gece ocakbaşı iç mekânı, asılı lambalar, raflar, duvar | 1170×2532 dikey, düz (şeffaf değil) | Ortası sakin kalsın (oyun üstüne biner); köşeler ve üst bölüm detaylı; tek renk ailesi bordo-bakır |
| 2 | **Ürün parçaları**: ciğer küpü, dalak, yürek × çiğ, pişiyor, hazır, yandı | 12 parça, her biri 256×256 şeffaf | Tek tabloda 3×4 ızgara üret, sonra kes; her parça aynı ölçekte, 3/4 üst görünüm |
| 3 | **Şiş**: çelik halkalı ince şiş, boş (parçalar kodla dizilir) | 96×640 şeffaf, dikey | Ucu sivri, halka üstte |
| 4 | **Bakır maşrapa** (ayran), köpüklü | 256×256 şeffaf | Dolu ve boş değil, yalnız dolu |
| 5 | **Bakır tabak**, boş, 3/4 | 400×300 şeffaf | Tezgahta dört kez kullanılır |
| 6 | **Ocak yatağı**: köz, kömür, kül; yan duvarlar bakır | 1600×360, uçları şeffaf | Parlayan közler ayrı katman: aynı görselin yalnız köz parlaması, siyah zeminde (`screen` karışımı) |
| 7 | **Mermer tezgah** şeridi, pirinç ön kenarlı | 1600×260 | Dikişsiz yatay döşeme olabilir |
| 8 | **Sofra**: ceviz tabla üstüne krem örtü, üstten | 360×360 şeffaf | Dört tane aynı görsel kullanılır |
| 9 | **İkram tabakları**: lebeni, bostana, yeşillik, sumaklı soğan | 4 × 200×200 şeffaf | Üstten bakış |
| 10 | **Raf**: ceviz raf, siyah tepsiler, çiğ yığınlar (ciğer, dalak, yürek) | 3 × 300×240 şeffaf | |
| 11 | **Fiş kâğıdı**: hafif buruşuk, yırtık alt kenar | 360×400 şeffaf | Yazısız; ürün simgelerini kod koyar |
| 12 | **Yayık**: ceviz fıçı, pirinç çemberli | 220×300 şeffaf | |
| 13 | **Açılış sahnesi**: üç katman (arka duvar, orta ocak, ön köz ve duman) | 3 × 1170×2532, ön ve orta şeffaf | Kamera yaklaşımı ve parallax bunlarla yapılır |
| 14 | **Duman ve kıvılcım dokuları** | 4 × 256×256 şeffaf | Beyaz duman, turuncu kıvılcım, yumuşak kenar |

Her görsel yazısız olmalı. Logo ve rozet vektör kalır, yapay zekâya çizdirilmez.

## 4. Teslim

- Dosyalar PNG (şeffaf) ya da yüksek kaliteli JPG (şeffaflık gerekmeyenler), `ham/` klasöründe.
  Arka plan kesimi ve WebP/AVIF dönüşümü tarafımdan yapılır.
- Dosya adı: `NN-ad.png` (tablodaki sıra numarası). Ana tablo `00-ana-tablo.png`.
- Her ürün için tek bir seçilmiş sürüm; alternatifler ayrı klasörde.

## 5. Kod tarafı kuralları (sınırlar)

- **Ağırlık bütçesi:** oyun görselleri toplamı gzip sonrası 600 KB altı, giriş ekranından sonra
  yüklenir ("ocak yanıyor" yükleme anı); `/oyun` dışında hiçbir sayfayı yavaşlatmaz.
- Görseller sitenin kendi alanından servis edilir; üçüncü taraf istek yok (çerez kapısı gerekmez).
- Kare süresi kapısı: CPU 4x p95 ≤ 17,5 ms. Aşılırsa ilk önce arka plan boyutu ve karışım
  kipleri sadeleştirilir.
- Hareket azaltma tercihi korunur; dekoratif görseller `aria-hidden`.
- Palet istisnası (CLAUDE.md > Colors, ikinci madde) görsellere de uygulanır; UI katmanı
  token'da kalır, görsel üstüne gelen yazılar kontrast ölçümünden geçer (AA).

## 6. Açık kararlar

1. **Arcade kabini yok** (spec §13). Referans oyun kabin çerçevesi kullanıyor; bizde telefonda
   yer yer, masaüstünde 420 px panel. Önerim: kabin yerine "ocak başı" çerçevesi (bakır kenar,
   arka planda gerçekçi mekân). Sahibi farklı isterse spec değişir.
2. Görseller tek bir ana tabloda onaylanmadan seri üretime geçilmez.
