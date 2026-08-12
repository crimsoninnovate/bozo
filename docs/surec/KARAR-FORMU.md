# Karar formu

`IYILESTIRMELER.md` > "Öneri, karar bekliyor" tablosu 22 satıra çıkmıştı ve düz bir
liste olarak okunmuyordu. Bu dosya aynı maddeleri kime ve ne zaman ait olduklarına
göre ayırır. Her maddede soru, seçenekler ve benim önerim var; "önerilen"i seçmek
istiyorsan tek kelime yeter.

Hazırlandı: 12 Ağustos 2026. Kaynak tablo `IYILESTIRMELER.md`, ölçümler orada.

Triyaj sonucu: **13 madde senin kararın**, 4 madde veri gelince açılacak, 3 madde
bilinçli ertelendi, 4 madde bizim teknik borcumuz (sana sormaya gerek yok),
2 madde zaten kapanmış ve listede bayat duruyordu.

---

## A. Senin kararın, şimdi

### A1. Kor okunuyor mu?

12 Ağustos'ta "kor pek anlaşılmıyor" demiştin. İki müdahale yapıldı ve ikisi de
ölçüldü: sitedeki CSS animasyonlarının hiçbiri koşmuyordu (`80ad3b6`), kor yatağı
düz gradyandan taneli bir yatağa çevrildi (`1451063`). Parlaklık hipotezi ölçülüp
çürütüldü, sahne zaten sönük değildi; eksik olan taneydi.

**Soru:** bugünkü haliyle kor okunuyor mu?
**Seçenekler:** (a) kapandı · (b) hâlâ sönük, yoğunluğu artıralım · (c) fazla, geri çekelim
**Önerim:** yok. Bu ölçümle kapanmaz, bakman gerekiyor. Ekran görüntüleri sohbette.

### A2. Buton ikincil kenarlığı: tek değer mi, boya göre mi?

Tasarımda hero'nun `xl` butonu `.4`, diğer dört buton `.36`. Bugün hepsi `.36`.

**Seçenekler:** (a) hepsi `.36` kalsın · (b) `xl` tasarımdaki `.4`'e dönsün
**Önerim: (a).** Fark 0.04 alfa, ekranda görünmüyor; tek değer bakımı ucuzlatıyor.

### A3. Buton birincil `md` gölgesi

Tasarımın menü şeridi butonunda gölge yok, bizim `Buton` her `birincil`'e kor
gölgesi basıyor. `md` boyu tasarımda yalnız orada geçiyor.

**Seçenekler:** (a) `md` gölgesiz olsun · (b) bugünkü gibi kalsın
**Önerim: (a).** Tek örnek olduğu için risk yok, tasarımla birebir olur.

### A4. Buton ikincil hover zemini, menü şeridinde

Tasarım menü şeridinde hover'da yalnız kenarlığı değiştiriyor; biz ayrıca hafif
tangerine zemin basıyoruz. Ama tasarımın diğer dört butonunda o zemin **var**.

**Seçenekler:** (a) bugünkü gibi kalsın · (b) menü şeridinde zemin düşsün
**Önerim: (a).** Menü şeridi tasarımın kendi içinde aykırı olan tek örnek.

### A5. Marka kelimesinin harf izi

Footer'larda aynı `800 20px` kelime iki değer taşıyor: `-.03em` (üç dosya) ve
`-.04em` (menü). İkisi de birebir uygulandı.

**Seçenekler:** (a) `-.03em`'e normalize et · (b) `-.04em`'e · (c) ikisi de kalsın
**Önerim: (a).** Çoğunluk üçe bir, ayırt edecek gerekçe yok.

### A6. Menü sayfasının üst bar CTA'sı nereye gitsin?

"Yol tarifi al" butonu tasarımda hedefsiz bir kutu. Bugün harici harita aramasına
bağlı, çünkü ana sayfadaki birebir aynı işaretleme de öyle bağlanmıştı.

**Seçenekler:** (a) harici harita araması (bugünkü) · (b) Konum sayfası
**Önerim: (a).** Buton harfi harfine "yol tarifi al" diyor, misafirin beklediği o.

### A7. Mobil footer: dört kolon mu, tasarımın kısa hali mi?

Mobil prototip footer'ı iki satır: marka kelimesi + "Urfa usulü ciğer, meşe korunda.
Girne, Naci Talat Caddesi. Her gün 10:00 - 05:00." Bizde 780px altında dört kolon
sarılarak akıyor.

**Seçenekler:** (a) tasarımın kısa iki satırı · (b) dört kolon kalsın
**Önerim: (a).** Cümle tasarımda birebir yazılı, uydurma değil; dar ekranda dört
sarılmış kolondan kısa bir imza daha iyi okunuyor.

### A8. Konum harita levhası, dar ekranda

390px'te üç POI çipi ve alt not sığıyor (ölçüldü). Tasarımın mobil levhası
etiketsiz, ama o levha ana sayfanınki, Konum sayfasının değil.

**Seçenekler:** (a) etiketler kalsın · (b) sade levhaya düş
**Önerim: (a).** Üç POI çipi ve alt not sitede başka hiçbir yerde geçmiyor;
gizlemek bugün bilgi siler.

### A9. Butona beşinci bir boy adımı açılsın mı?

Konum hero'sunun tasarımı mevcut boy merdiveninde karşılığı olmayan bir ara ölçek
istiyor (fark 1-2px). Sapma olarak kaydedildi.

**Seçenekler:** (a) kaydedildi kalsın · (b) yeni boy adımı açılsın
**Önerim: (a).** Tek örnek için üç sayfayı ilgilendiren bir API büyümesi.

### A10. Çağıranı olmayan üç sözlük anahtarı

`ortak.marka.kisa` ("Bozo"), `ortak.cta.whatsapptanYaz` ("WhatsApp'tan yaz"),
`ortak.satirlar.saatlerUzun`. Üçü de hiçbir yerden çağrılmıyor.

**Önerim, madde madde:**
- `saatlerUzun` **silinsin**: aynı cümlenin üçüncü kopyası, ikisi zaten elle yazılı.
- `whatsapptanYaz` **kalsın**: WhatsApp numarası `null`; numara girdiği gün bu CTA
  gerekecek ve o zaman yeniden yazmak gerekir.
- `marka.kisa` **senin kararın**: bugün ölü, ama kısa marka adı ileride sekme
  başlığı veya ikon için işe yarayabilir.

### A11. Galeri sayfasına bir spot cümlesi ister misin?

Sayfa bugün H1 "Galeri" + "Sitenin beklediği on altı kare" ile duruyor. Metin
envanterinde fotoğrafla ilgili hazır blok yok, uydurulmadı.

**Önerim:** bir cümle yaz, ben uydurmayayım. İstemezsen bugünkü hali kalır.

### A12. Prefetch açık mı kalsın?

İlk yüklemede 344 KB indirilip atılıyor; gerçekten kullanılan yük 176 KB. Kapatmak
sayfa geçişlerinin anındalığını götürür.

**Seçenekler:** (a) açık kalsın · (b) `prefetch={false}`
**Önerim: (a).** Site altı sayfa; geçiş hızı mobil veriden daha çok hissediliyor.

### A13. Üst barda 11px kırpılma: bu bir hata, düzelteyim mi?

**Karar maddesi değil, kusur.** 781-793px arası dar bir bantta üst barın en sağdaki
"Yol tarifi al" butonu 792px'te bitiyor, viewport 781px, yani 11px kırpılıyor.
Bugün ölçüldü (kayıtta "781-802px" yazıyordu, gerçek bant 13px genişliğinde).
780px'te nav çekmeceye düşüyor ve sorun kendiliğinden kapanıyor.

**Önerim:** çekmeceye düşme eşiğini 780px'ten 800px'e çıkar. Bandı tamamen kapatır,
tek satır CSS, başka hiçbir genişliği etkilemez. Onay ver, yapayım.

---

## B. Veri gelince açılacak, şimdi cevap gerekmiyor

| # | Madde | Neyi bekliyor |
|---|---|---|
| B1 | `FotoYuvasi`: fotoğraf gelince köşe işaretleri ve vinyet düşsün mü? Marka aygıtı sessizce kaybolur | 16 fotoğraf |
| B2 | Menüdeki çekim listesi bölümü: silinsin mi, tek satırlık galeri bağlantısına mı insin? Bugün iki yüzey aynı yedi kareyi basıyor | 16 fotoğraf |
| B3 | `instagram` alanı kullanıcı adı mı tam URL mü? Kod bugün kullanıcı adı varsayıyor | Instagram hesabı |
| B4 | `aria-disabled` telefon yer tutucuları 2.62:1 ve 3.14:1. Bugün WCAG muaf; numara girince `<a>` olup 4.5:1 gerekecek | Telefon numarası |

## C. Bilinçli ertelendi, erken açma

| # | Madde | Neden ertelendi |
|---|---|---|
| C1 | Konum hero'sunun boş sağ yarısı (1440px'te ~450x400px) | Harita levhası hâlâ yer tutucu; yer tutucunun etrafında yerleşim kararı vermek erken |
| C2 | Galeri ızgarasında öksüz kare (16 kare, 3 sütun) | Boş çerçevede öksüz satır, gerçek fotoğrafta olduğundan çok daha fazla göze batıyor |
| C3 | Menü ve çekim listesindeki öksüz satırlar | Tasarımın kendi ızgara kuralı aynı öksüzü üretiyor; düşük öncelik |

## D. Bizim teknik borcumuz, sana sormaya gerek yok

Üçü de "aynı değer birden çok yerde ham duruyor, token olmalı" maddesi. Tek onayla
hepsini bir turda kapatabilirim; görsel çıktı değişmez.

- `letter-spacing:-0.015em` (iki bileşen, dokuz kullanım) token'ı yok
- `rgba(242,233,220,.09)` (dört kullanım, beş tasarım dosyası) token'ı yok
- `--kor-golge` ailesinin mobil geometrisi (`0 8px 22px`) ham duruyor
- `Cip` ortak boyut maddesi kısmen çözülmüştü, artık kapanabilir

## E. Kapandı, listede bayat duruyordu

- **Gizlilik rotasına site içi bağlantı.** Tabloda "kullanıcıya soruldu" diye
  duruyor ama bağlantı `TelifSeridi.tsx:35`'te üç footer varyantında da var.
- **İngilizce 404.** 12 Ağustos 2026'da çözüldü (`3659cfd`): `/en/` altındaki bozuk
  yollar artık İngilizce 404 döndürüyor, `<html lang>` ve sekme başlığı dahil.
