# Ana sayfa uçtan uca denetim

Koşum: 13 Ağustos 2026. Ölçen: Playwright/Chromium, kendi statik sunucusu
(`python3 -m http.server --directory out`). Genişlikler 1440x900 ve 390x844.

Denetlenen: yedi bölüm (Acilis, Iddia, Ocaktan, Ikram, Gece, Bozo, Konum), paket
şeridi, kabuk ve bead rayı. Boyutlar: yerleşim, kontrast, dokunma hedefi, başlık
sırası, metin kuralları, bugünkü değişikliklerden kalan bayatlık.

## Ölçüm katmanı: üç yanlış okuma

Bu turda üç ölçüm yalan söyledi. Bulguyu raporlamadan önce hangi katmanın
okunduğunu doğrulamak gerekiyor (DEVAM.md'deki uyarı yine tuttu).

1. **Kontrast, zemini yanlış varsayarsa.** İlk tarama yedi düşük kontrast buldu,
   altısı `PaketSeridi`'ndeydi ve hepsi tam `1.11` diyordu. Sebep: hesap zemini
   sayfa tabanı (`#0A0807`) varsaymıştı, oysa şeridin zemini `rgb(233,97,18)`.
   Gerçek zemine karşı ölçüldüğünde aynı metinler **5.29:1** ve **14.94:1**,
   ikisi de AA'yı geçiyor. Sıfır gerçek bulgu.
2. **Dokunma hedefi, `getBoundingClientRect` ile.** On beş hedef 44px altında
   göründü. Bu repo hedefleri `::after` ile büyütüyor; `elementFromPoint` ile
   gerçek alan ölçüldüğünde footer bağlantıları (görünen 13-15px) ve kaydırma
   ipucu (görünen 15px) **43px** çıkıyor, yani kural sağlanıyor.
3. **`elementFromPoint`, ekran dışında.** İlk gerçek-alan taraması çoğu hedefe
   `0` dedi: fonksiyon yalnız görünür alanda çalışıyor. Her elemanı
   `scrollIntoView` ile ortaya alıp yeniden ölçmek gerekti.

## Bulgular

### 1. Bead rayı mobilde basılıyor ve hedefleri 9-21px (düzeltildi)

Yedi bölüm navigasyonu noktası: 14/9/14/14/9/14/21px, hiçbirinde hedef
genişletmesi yok. Mobil prototipin bileşen envanterinde bead rayı **hiç
geçmiyor** (`docs/tasarim/mobil-prototip-davranis-referansi.json`, on sekiz
bölümün hiçbirinde); mobil gezinme alt eylem barı ve çekmece.

Portta ray mobilde de basılıyordu ve iki şey yapıyordu: hero içeriğinin üstüne
biniyordu, ve dokunma hedefleri 44px kuralının çok altında kalıyordu.

Yapılan: 800px altında ray hiç basılmıyor. Masaüstünde nokta başına `::after`
ile tıklama alanı 44px genişliğe ve bağlayıcının yarısı kadar yüksekliğe çıktı.

### 2. Ciğer satırındaki "8 şiş / porsiyon" çipi (düzeltildi)

Beş satırın yalnız birinde ekstra bir kutu vardı; o satır uzuyor ve listenin
ritmi kırılıyordu. Bilgi ayrıca bir bölüm yukarıda zaten duruyor: İddia sayacı
"8, şiş bir porsiyonda". Aynı gerçek iki kez.

Yapılan: çip kaldırıldı, arkasındaki ölü kod da (`MenuSatiri.cip` propu, `.cip`
sınıfı, `IMZA_URUN` sabiti, iki dildeki `cigerCipi` anahtarı). Ölçüldü: beş
satır artık tam 94px, öncesinde ilki daha uzundu.

### 3. İki bayat yorum (düzeltildi)

`MenuSatiri.tsx` ve `ana/Ocaktan.tsx` "fiyat gelince rakamlar satırların sağına
döner" diyordu (UYGULAMA-NOTLARI 1.1). Fiyatlar 13 Ağustos'ta geldi ama sahibi
ana sayfanın beş ad artı tek CTA olarak kalmasını istedi. Yorumlar ileriki bir
turu ana sayfaya fiyat eklemeye yönlendirirdi; karar yerine yazıldı.

## Temiz çıkanlar

- **Yatay taşma yok:** 1440 ve 390'da `scrollWidth - clientWidth = 0`.
- **Başlık sırası:** tek H1, yedi H2, atlama yok.
- **Kontrast:** gerçek zeminlere karşı ölçüldüğünde ihlal yok. TR/EN ayırıcısı
  (`/`, 2.17:1) `aria-hidden` ve WCAG dışı, daha önce kapatılmıştı.
- **Dokunma hedefi:** ray düzeltmesinden sonra mobildeki 22 etkileşimli hedefin
  tamamı 43px+ (kalan 1px probun kendi yuvarlaması).
- **Metin kuralları:** em dash yok, şapkalı harf yok, kilitli terim ihlali yok.
  `GİRNE · ŞU AN` etiket, cümle değil; `05:00 - 10:00` kapalı aralık ve biçim
  doğru.
- **Veri tutarlılığı:** beş ürün, "4+2" sayacı ve hero rayının 4 büyük + 2 küçük
  ritmi birbirini tutuyor. Fiyat bloğunun "her üründe tam, yarım ve dürüm var"
  cümlesi ana sayfadaki beş ürünün beşi için de doğru.

## Kaydedildi, dokunulmadı

- **Konum bölümünün üç CTA'sı 2+1 sarıyor.** İkonlar butonları genişletti.
  Bozuk değil, yalnız tek başına kalan bir "WhatsApp" satırı var.
- **Fotoğraf plakaları boş.** On altı kare gelmeden yerleşim kararı erken;
  bu dosyanın "ertelendi" maddeleriyle aynı gerekçe.
