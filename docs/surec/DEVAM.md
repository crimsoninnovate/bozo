# Devam noktası

Bağlam sıfırlandıktan sonra ilk okunacak dosya budur. Kısa tutuluyor: burada yalnız bugünün
durumu ve nereye bakılacağı var. Tarih sıralı kayıt `DEVAM-ARSIV.md`'de, kararların gerekçesi
ve ölçümleri `IYILESTIRMELER.md`'de.

Son güncelleme: 24 Ağustos 2026

## Durum

- Branch `feat/site-kurulumu`. 133 test geçiyor, `npm run typecheck` ve `npm run build` temiz.
  Ağaç temiz, çalışan ajan yok. Son commit `43d4da5`, arc'a gönderildi ve doğrulandı (`plesk repair fs` 0 hata).
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

## Son turlarda ne değişti (23 Ağustos)

- **Final rozet** (`BozoLogo-Final-Aug23.svg`) ve yeni favicon seti uygulandı. Jeneratörün iki
  sabit tuzağı düzeltildi (manifest renkleri, şeffaf + kenardan kenara maskable ikonlar).
  Rozetten "GİRNE" ibaresi kalktı; site şehri başka yerlerde söylemeye devam ediyor.
- **Hero'nun iki butonu telefonda yan yana**: satır 126px'ten 51px'e indi. `boy="xl"` 1040
  altında md adımına iniyor.
- **Nüfustaki ad siteden tamamen kalktı** (sahibi, revize listesi 3. madde), ana sayfa Bozo
  bloğu sahibinin yazdığı metni aldı. `sozluk_nufustakiAdiIcermez` testi geri gelmesini
  engelliyor.
- **Hikaye sayfası yediye çıktı**: sahibinin kendi anlatımı (`Anlati`) Portre ile Lakap
  arasında, kapanışı (`Kapanis`) sayfanın en sonunda.
- **Sosyal kartlar** yeni rozetle yeniden üretildi, her biri kendi dilinin sayfasında.

## Bir sonraki deploy'da hatırlanacak

Cloudflare kenarı varlıkları dört saat tutuyor. 23 Ağustos deploy'unda `marka/rozet.svg`,
`favicon.svg` ve `favicon.ico` bayat kaldı (aynı ad, yeni içerik) ve panelden purge istedi.
HTML etkilenmiyor (`cf-cache-status: DYNAMIC`).

