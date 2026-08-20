# Devam noktası

Bağlam sıfırlandıktan sonra ilk okunacak dosya budur. Kısa tutuluyor: burada yalnız bugünün
durumu ve nereye bakılacağı var. Tarih sıralı kayıt `DEVAM-ARSIV.md`'de, kararların gerekçesi
ve ölçümleri `IYILESTIRMELER.md`'de.

Son güncelleme: 20 Ağustos 2026

## Durum

- Branch `feat/site-kurulumu`. 123 test geçiyor, `npm run typecheck` ve `npm run build` temiz.
  Ağaç temiz, çalışan ajan yok.
- **Site kendi alan adında yayında:** `https://cigercibozo.com`, test yayını. `www` 301 ile
  apex'e gidiyor, sertifika Let's Encrypt.
- **Yayın hedefi 20 Ağustos'ta arc sunucusuna taşındı** (`arc.megaonline.net`, Plesk,
  `/var/www/vhosts/cigercibozo.com/httpdocs`). Researchos artık deploy almıyor; oradaki demo
  (`bozo.crimsoninnovate.com`) eski sürümde donmuş durumda. Yordam `README.md` > Publishing.
- **Açılış günü tek iş:** `public/.htaccess` içindeki `X-Robots-Tag` satırını silip build alıp
  deploy etmek. O satır durdukça site arama motorlarına kapalı; `robots.txt` bilerek taramaya
  açık ki tarayıcı başlığı okuyabilsin.
- On iki rota (altı sayfa, iki dil) 200 dönüyor, yatay taşma yok, konsol temiz.

## Bekleyen iş

1. **İşletme verisi hâlâ eksik** (`content/isletme.ts`): e-posta, harita koordinatı, posta kodu.
   İçecek fiyatları da gelmedi (`content/urunler.ts`, arayüz fiyat yerine sunum ölçüsü basıyor).
2. **On altı fotoğraf** (`content/fotograflar.ts`). Dosya yokken telefonda plaka hiç basılmıyor,
   dosya tanımlanınca kendiliğinden geri geliyor. İlk gerçek fotoğraf geldiğinde
   `fotograflar_hicbiriHenuzDosyaTasimaz` testi bilerek kırılacak, o gün güncellenmeli.
3. **Sahibinin eski açık maddeleri** `KARAR-FORMU.md` A1-A12. Sorulmadan uygulanmaz.
4. Yasal metinler ve `/gizlilik` bağlantısı backlogda (sahibinin kararı, C4). Yeniden önerme.

## Son turlarda ne değişti (19 Ağustos)

- **Mobil çekmece** sahibinin A kararıyla yeniden kuruldu (kendi üst satırı, numaralı
  bağlantılar, bölüm çapaları, durum bloğu, iki CTA, imzalı ayak) ve altı mercekli bir
  çürütme turundan geçti.
- **Menü sayfası 1040 altında satır düzeninde** (sahibinin 1A/2A kararı): boş fotoğraf plakası
  basılmıyor, tam fiyat adın hizasında. Sayfa 390px'te 7815 > 3784px.
- **Hikaye sayfasına lakap bölümü** geldi: Bozo adının hikayesi, sahibinin kendi anlatımından.
- **Sahibinin adı sitede `Bozo Çağlar`**; nüfustaki ad yalnız lakabı açıklayan tek cümlede.
- **Bozo'nun beş metin notu** uygulandı: `Ocaktan` > `Ocakbaşı` (etiket, çapa, anahtar, dosya
  adı), ikram sayısı sekize düzeltildi ve teste bağlandı, dalak/yürek/tavuk açıklamaları.
- WhatsApp ve Instagram işaretleri kendi markalarının renginde.

## Nereye bakılır

| Soru | Dosya |
|---|---|
| Mimari, tasarım kaynağı, bağlayıcı metin kuralları | `CLAUDE.md` (kök) |
| Kurulum, komutlar, yayın yordamı, sunucu tuzakları | `README.md` |
| Sapmalar ve kararlar, gerekçesiyle ve ölçümüyle | `docs/surec/IYILESTIRMELER.md` |
| Asla sapılmayacak kısıtlar, üç tipografi katmanı | `docs/surec/KISITLAR.md` |
| Sahibine sorulacak açık maddeler | `docs/surec/KARAR-FORMU.md` |
| Yayın öncesi kontrol listesi ve parite | `docs/surec/YAYIN-KONTROL-LISTESI.md`, `docs/PARITE.md` |
| Tarih sıralı eski kayıt | `docs/surec/DEVAM-ARSIV.md` |

## Ölçüm düzeneği

```bash
npm run build
python3 -m http.server 8391 --directory out
```

Playwright 1.62.1: `/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs`.
Telefon bağlamı: `deviceScaleFactor: 2, isMobile: true, hasTouch: true`. Mobil eşik 1040px ve
otuz beş media query ile `FotoYuvasi` birlikte taşır; tek dosyada değiştirilmez.
