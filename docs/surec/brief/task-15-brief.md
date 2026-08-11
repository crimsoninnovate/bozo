# Task 15 brief: parite, erişilebilirlik ve yayın doğrulaması

Bu görev **kod yazmaz, doğrular.** Bulduğu her şeyi raporlar; yalnız tek satırlık,
tartışmasız bir hata bulursa düzeltir ve bunu raporunda ayrıca söyler.

Site bitti: beş sayfa, iki dil, on rota. On üç görev ve dört tur geçti. Bu görev
soruyor: **yayına çıkabilir mi, çıkamazsa neden.**

## Neden bu görev bir kez daha ölçüyor

Her görev kendi parçasını ölçtü ve temiz raporladı. Ama bu gece dört kez, bir
görevin temiz raporu sonraki bir ölçümle çürüdü: bayat denetim maddeleri, `fullPage`
yakalamasından gelen dört sahte AA hatası, "üç iç sayfa birebir aynı" genellemesi,
paylaşılan keyframe'lerin sessizce yanlış varyantı çalıştırması. Parça parça doğru
olan, bütün olarak yanlış olabiliyor.

Bu yüzden burada tek kural: **kendi ölçümünü yap, rapora güvenme.**

## 1. Parite

Beş sayfa x iki genişlik (1440x900 ve 390x844) x iki dil.

Ekran görüntüleri: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/screenshots/`.
**Hangi karenin var olduğunu önce listeleyin.** Bu gece iki brief var olmayan bir
kareye (`04-menu.jpg`) parite bağladı. Ayrıca kareler 924px'te çekilmiş, yani
1440px'te görünen bir hizalama sorunu karede görünmez; kareyi tek kanıt saymayın,
`.dc.html` değerleri kanıttır.

Bölüm bölüm karşılaştırın. Fark bulursanız önce `docs/surec/IYILESTIRMELER.md`'ye
bakın: kayıtlı bir sapma mı, yoksa yeni mi. Kayıtlıysa hata değil.

## 2. Erişilebilirlik

Bu gece kontrast ölçüldü (198 metin, sıfır hata) ama o ölçümden sonra **dört tur
görsel katmanı değiştirdi**. Yeniden ölçün.

- **Kontrast.** `fullPage` yakalama **kullanmayın**: kor sahnesi `position:fixed`,
  `fullPage` onu belge boyuna gerer ve sahte sonuç verir. Doğru yöntem: hedefi
  `scrollIntoView({block:'center'})` ile ortala, metnin rengini geçici `transparent`
  yap, yalnız o kutunun viewport yakalamasını al, piksel ortalamasını zemin say,
  metni alfasıyla bindirip oranı hesapla.
- **Klavye.** On rotanın hepsinde sekme sırası mantıklı mı, odak görünür mü, tuzak
  var mı. Mobil çekmece açıkken odak içeride kalıyor mu ve Escape kapatıyor mu.
- **Landmark ve başlık.** Her sayfada tam bir `h1`, atlanan seviye yok, `main`/`nav`/
  `footer` adları ayırt edici. İki `nav` (ana ve mobil) ayrı ad taşıyor mu.
- **Dokunma hedefi.** 44px taban. Çakışma **kısalıktan kötüdür**: hedefleri çift çift
  kesiştirin, çakışan varsa ayrıca bildirin. Bilinen kayıtlı istisna: footer iletişim
  satırları 28px (`kabuk-turu-report.md` ve `DEVAM.md`'de açık madde).
- **Hareket azaltılmış.** `prefers-reduced-motion: reduce` ile on rota: animasyon ve
  geçiş sayısı sıfır olmalı, çapa kaydırması anında zıplamalı. Ama "hiç görsel
  değişiklik yok" beklemeyin: kararma (opacity) izlemeye devam eder, bu kayıtlı bir
  karar (`KISITLAR.md`).
- **Dekoratif katmanlar** `aria-hidden` mi: kor sahnesi, duman, ızgara, bead rayı,
  tane rayları, harita levhasının çizim katmanları. Ama harita levhasının **metinleri**
  ağaçta kalmalı (dört metin okunmalı).

## 3. İki dil

- On rotanın hepsinde `<html lang>` doğru mu, `hreflang` çiftleri karşılıklı mı.
- **Sözlük taraması.** Bu gece üç kez aynı hata çıktı: sözlükte doğru anahtar var ama
  bileşen dil-nötr bir kaynaktan okuyor, sonuç İngilizce sayfada Türkçe metin.
  (`footer.sayfalarBaslik`, `satirlar.adresVeSaat`, `satirlar.adresCadde`.)
  `content/` altındaki **her anahtarın** gerçek bir çağıranı var mı, tarayın.
  Çağıransız anahtar ya eksik bir bağlantıdır ya fazlalık; hangisi olduğunu söyleyin.
- Ters yön: `out/en/**` içinde Türkçe metin kalmış mı. Karakter taraması yeterli
  değil (özel adlar Türkçe kalır); anlamlı bir örneklem alın.
- EN metninin tasarımdaki `data-en` ile birebir olmaması **bilinçli**: EN katmanı
  çeviri değil, aynı sesin İngilizcesi. Hata saymayın.

## 4. Yayın

- `npm run build` temiz, on rota + `robots.txt` + `sitemap.xml`, `gecici-` yok.
- `out/` içinde beklenen dosyalar: `404.html`, her rota için `index.html`.
  `_not-found/` çıktısı kayıtlı ve kabul edilmiş bir davranış (`DEVAM.md`).
- `sitemap.xml` on rotayı doğru veriyor mu, `_not-found` sızmış mı.
- **Konsol.** On rotada sıfır hata. Favicon 404'ü kayıtlı bir eksik (işaret
  işletmeden bekleniyor), hata sayılır ama kapsam dışı; başka bir şey varsa bildirin.
- **Dış istek yok.** Gizlilik sayfası "çerez yazmaz, form toplamaz, ölçüm aracı
  barındırmaz" diyor. Ağ sekmesinde doğrulayın: fontlar `next/font` ile kendi
  sunucumuzdan mı geliyor, Google'a istek var mı, `document.cookie` / `localStorage`
  / `sessionStorage` / `indexedDB` kullanımı var mı. **Metin bir iddia, kod kanıt.**
- **Font alt kümesi.** `ğ Ğ ş Ş İ` latin-ext'ten geliyor. Çıktıda unicode-range
  bloklarının gerçekten yüklendiğini ve Türkçe karakterlerin bozulmadığını
  doğrulayın; `404.html` dahil, o dosya kök layout'u atlıyor.

## 5. Uydurulmuş veri taraması

Bu, yayın öncesi en önemli kontrol. İşletmeden gelmeyen her şey `null` olmalı ve
arayüz yer tutucu basmalı: fiyatlar (`000 TL`), telefon (`000 000 00 00`), WhatsApp,
Instagram, e-posta, harita koordinatı, dalak ve yürek porsiyon detayları, gece menüsü
kalemleri, içecek listesi, 16 fotoğraf, logo.

`out/` çıktısında tarayın: uydurulmuş bir fiyat, telefon, koordinat, istatistik veya
iddia sızmış mı. `lib/jsonld.ts` yapısal verisinde de bakın. Bir tane bulursanız bu
**yayın engeli**dir.

Aynı taramada: em dash (U+2014), şapkalı harf, tamamı büyük harf cümle, kilitli
terminoloji ihlali (müşteri, bedava, mangal, şef, parça, adet, masa, 7/24).

## 6. Ölü ağırlık

- `components/`, `lib/`, `content/` altındaki her export'un çağrısı var mı.
- `styles/tokens.css` içindeki her token kullanılıyor mu. Kullanılmayan token
  kendi başına hata değil (sayfa görevleri için önden eklendi) ama listesi rapora
  girsin.
- CSS modüllerinde ölü sınıf var mı.

## Çıktı

`docs/PARITE.md`: yayın öncesi kontrol listesi, her madde geçti/kaldı ve kanıtı.
Bu dosya repoda kalıcı, sonraki değişikliklerde yeniden koşulabilir olsun.

Ayrıca `docs/surec/rapor/task-15-report.md`: bulgular, önem sırasına göre, her biri
dosya:satır kanıtıyla. Yayın engeli olanları en üstte ayrı başlıkta toplayın.

## Kısıtlar

- **Kod yazma.** İstisna: tek satırlık, tartışmasız hata (yanlış `lang`, eksik
  `aria-label` gibi). Düzeltirsen raporda ayrıca söyle.
- **Asla `git add -A`.** Commit'te asistan imzası yok.
- Yorum yazacaksan `CLAUDE.md`'nin "Comments" kuralına uy: kısa.
- Kendi playwright örneğin, kendi portun. MCP'nin paylaşılan tarayıcısı bu gece üç
  ajanın ölçümüne karıştı.
