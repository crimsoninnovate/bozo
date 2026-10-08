# Oyun sahnesi: boyalı illüstrasyon tasarımının koda alınması

Tarih: 8 Ekim 2026. Durum: sahibi "karar ver ve ilerle" dedi; kararlar bu belgede, sonda listelenir.
Kaynak: `/Users/mk/Desktop/Bozo/design_handoff_bozo_oyun/` (README, `OyunAlani.dc.html`,
`Sofra Yetistir.dc.html`, `assets/BozoLogo-Final-r2.svg`). Bağlayıcı üst belge:
`docs/specs/2026-10-08-oyun-design.md`; bu belge yalnız görsel katmanı değiştirir, §13'ün
"yalnız token, düz çizgi" cümlesini ve §3'ün yerleşim ölçülerini geçersiz kılar.

## 1. Amaç ve kapsam

Plan 2'nin düz vektör sahnesi (token renkli çizgi semboller) sahibi tarafından beğenilmedi; handoff
boyalı, dokulu, atmosferik bir sahne getiriyor. Hedef: o görünümü `/oyun/` ve `/en/oyun/` için
mevcut mimariye, mevcut simülasyona ve mevcut ekran akışına dokunmadan aktarmak.

**Kapsam:** oyun alanı (HUD, sofra, ocak, tezgah, raf, duraklat perdesi), giriş, sonuç ekranı.
**Kapsam dışı (handoff de "sonraki tur" diyor):** katılım ekranı, sıralama sayfası, ödül kodu,
Kurallar sayfası ve bağlantısı, Paylaş düğmesi ve paylaşım kartı. Bunlar plan 4. Handoff'taki
"Paylaş" ve "Kurallar" öğeleri bu yüzden **yapılmaz** (var olmayan sayfaya bağlantı ya da çalışmayan
düğme eklenmez).

**Değişmez:** `lib/oyun/*` (simülasyon, golden kayıtlar, sunucu sözleşmesi), `sunucu/*`, ekran akışı
(`useOyunAkisi`), rota yapısı, `ciz.ts` / `tepkiler.ts` sözleşmesi (§3).

## 2. Kararlar

**K1. Sahne katmanı serbest sıcak palet, UI katmanı token.** Sahne (tabla, ocak teknesi, taneler,
tezgah mermeri, raf, tabaklar, kor halkası, közler) handoff'taki gradyan ve renk değerleriyle çizilir.
HUD, bölüm etiketleri, düğmeler, perde, fiş metni, giriş ve sonuç ekranları token'da kalır. Kaynak:
sahibin kararı (handoff README "Brief'ten sapmalar" 1; sahibin bu mesajdaki onayı). Kayıt:
`CLAUDE.md` > Colors altına "oyun sahnesi istisnası" maddesi, `docs/surec/IYILESTIRMELER.md`'ye
ölçüm ve gerekçe. Palet rengi olan her yerde `var(--kor)`, `var(--komur)` vb. kullanılır; SVG
`stop-color` için `style="stop-color:var(--kor)"`. Palet rgb'si CSS modüllerinde literal yazılmaz
(`styles/palet.test.ts` reddeder); `--kor-leke*`, `--kor-60`, `color-mix` kullanılır.

**K2. Tek `SahneDefs`, tek kayıt.** Gradyan ve filtre tanımları (`gCopper`, `gBrass`, `gSteel`,
`gWood`, `gWoodFront`, `gCloth`, `gPaper`, `gRaw*`, `gCooked`, `gChar`, `gFat`, `gEmber`, `gCoal`,
`gYogurt`, `gPlate`, `gAyran`, `gHalka`, `gMarble`; `fBlur2`, `fBlur6`, `fGrain`, `fMarble`,
`fWood`, `fShadow`) `components/oyun/SahneDefs.tsx` içinde, `Saha`'da **bir kez** bağlanır. SVG
kimlikleri belge çapında tektir; ikinci bir `<defs>` kopyası kimlik çakışması olur. Değerler
handoff `<defs>` bloğundan birebir; kor ve kömür durakları token'a bağlanır (K1).

**K3. Kare değerleri sözleşmesi korunur.** React yalnız yapı değişince çizer; her karenin değerleri
`ciz.ts` ile `data-ciz` öğelerine CSS değişkeni olarak yazılır (`--oran`, `--pisme`, `--yanma`,
`--kor-yogunluk`, `data-gorunum`, `data-sabir`). Yeni SVG katmanları bu değişkenleri CSS'ten okur
(`opacity: var(--pisme)`, `stroke-dashoffset: calc((1 - var(--oran)) * 100)`). Handoff'un
`DURUMLAR` nesnesi bu değişkenlere eşlenir; yeni değişken yalnız karşılığı yoksa eklenir.
`tepkiler.ts` WAAPI öğeleri yeni DOM'a taşınır, mantığı değişmez.

**K4. Dosya bölünmesi.** `Semboller.tsx` (330 satır) iki sorumluluğa ayrılır: UI simgeleri (ses,
duraklat, ocak söner, çevir, kalktı, kombo ve porsiyon rozeti, kor noktası) `Semboller.tsx`'te
kalır; boyalı sahne parçaları `SahneSofra.tsx`, `SahneOcak.tsx`, `SahneTezgah.tsx` olur. Her
dosya ≤ 300 satır, yorumlar kısa (CLAUDE.md > Comments).

**K5. Şiş geometrisi.** Sahnedeki şiş handoff'un kendi 28×128 çizimidir (çelik halka, dört tane,
aralarda kuyruk yağı). `lib/sis.ts` markanın kilitli geometrisi olarak kalır ve rozet için
kullanılmaya devam eder; oyun sahnesi onu artık içe aktarmaz. Tane biçimleri ürünü söyler (ciğer
kare, dalak enine oval, yürek eşkenar dörtgen); aynı dört yol ocakta, tezgahta, fişte ve rafta.

**K6. Yerleşim.** Handoff ölçüleri (README "Ölçü tablosu", 320/390/1440) bağlayıcı. Oyun alanı
dikey akışı: HUD, Sofra, Ocak (esner), Tezgah, Raf; bölümler arası 12 px, iç pay 12 px; görünür
bölüm etiketleri (Archivo 13/600; "Sofra", "Ocak", "Tezgah", "Raf" sözlükte var). Masaüstünde
panel 420 px, ortada, çevrede vinyet ve kor ışığı; kabuk tur boyunca zaten gizli (`body[data-odak]`),
bu değişmez. Giriş ve sonuçta kabuk görünür.

**K7. HUD.** Handoff düzeni: saat rayı (9 çizgi, imleç, ocak söner simgesi), saat, puan, kombo
altıgeni (pasif/aktif pirinç), ses, duraklat. Duyuru satırı **görünür** olur (şimdiye dek yalnız
ekran okuyucuya gidiyordu); `aria-live="polite"` ve `data-duyuru` korunur. "Bir porsiyon" rozeti
(12 şiş, spec §6) mekanik olduğu için kalır, altıgenin yanında küçük pirinç rozet olarak
yeniden çizilir. Handoff'un `×2` rozeti spec'teki 5. evre çarpanını (§6) gösterir; evre 5'te
görünür, simülasyona dokunmaz. Bunlar yeni özellik değil: handoff'un açıkça çizdiği, kodda
karşılığı olan durumlar.

**K8. Giriş ve sonuç.** Handoff giriş ve sonuç ekranlarında cam panel yok; içerik `--zemin` üstünde
kor ışığıyla düz akar. Bu iki ekran `CamPanel`'den çıkar; katılım ve sıralama (kapsam dışı) cam
panelde kalır ve bu turda dokunulmaz. Giriş: rozet 200/220 px, başlık Bevan 40/80, alt satır,
Oyna 64 px, sıralama bloğu (üst kenar çizgisi, satır ayırıcılar, son şampiyon satırı), Gizlilik
bağlantısı. Açılış hareketi handoff'un dört karesine (kor ışığı + kıvılcım, rozet yükselir, bakır
halka, metin sırayla) hizalanır; mevcut `OyunAcilisi` süreleri ve boyutları ayarlanır, yeniden
yazılmaz. Sonuç: rozet 132 px, durum satırı, puan Bevan 72 `--bakir-acik`, 4 sütunlu özet,
karşılaştırma satırları, "Yeni en iyi" rozeti, çevrimdışı kutusu, Tekrar Oyna 64 px.

**K9. Hareket.** Handoff "Hareket notu" tablosu uygulanır; her satırın azaltılmış karşılığı vardır.
CSS animasyonları kendi modülünde tanımlanır (`styles/animasyon.test.ts`), WAAPI ve canvas
`useHareketAzaltilmisMi` okur. Tam kıvam `+150`, kombo mühürü, ocak ısınması, son saat geçişi
(900 ms), sofra kalktı (500 ms) mevcut `tepkiler.ts` mantığıyla; yeni görsel geçişler token
süreleriyle (`--gecis-hizli`, `--gecis-orta`, `--gecis-yogunluk`).

**K10. Performans bütçesi.** Boyalı sahne SVG filtre kullanır (`feTurbulence`, bulanıklık, tam ekran
`mix-blend-mode: overlay` tanecik); bu pahalı olabilir. Ölçüt: orta seviye mobil profilinde (CPU
4× yavaşlatma) kare süresi p95 ≤ 17,5 ms (plan 2'nin ölçtüğü değer) ve hiçbir uzun görev. Tutmazsa
önce tanecik katmanı bir kez raster'a alınır (`will-change: transform`, sabit katman), sonra
`feTurbulence` yerine önceden üretilmiş küçük döşeme SVG'si (build-time), son çare olarak tanecik
düşürülür. Hangi adımın gerektiği ölçümle karar verilir ve `IYILESTIRMELER.md`'ye yazılır.

**K11. Erişilebilirlik.** Dokunma hedefi ≥ 44 px (HUD ikonları 44, düğmeler handoff ölçüsü ≥ 56),
dekoratif katmanlar `aria-hidden`, düğme adları ve `aria-label`'lar mevcut sözlükten, Tab sırası ve ok
tuşları (`odak.ts`) değişmez. Kontrast: sahne metinleri (etiket `--krem-56`, raf adı krem
gölgeli, `+150` bakır-açık) gerçek zemin üstünde ölçülür; AA altı olan etiket bir kademe açılır ve
kayda geçer (handoff etiketi `rgba(249,233,213,.56)` koyu zeminde ~7:1, ölçülecek).

## 3. Test ve doğrulama

- Birim: `SahneDefs` kimlik testi (kaynak ağacında `url(#g…)`/`filter="url(#f…)"` başvuruları
  `SahneDefs`'te tanımlı mı, çift tanım yok mu); mevcut `gosterim`, `gorsel`, `ciz` sözleşmeleri;
  `palet.test.ts` ve `animasyon.test.ts` yeşil; sözlük eşitliği.
- Tarayıcı (Playwright, mevcut `akis.mjs`/`tasma.mjs` iskeleti): 320/390/1440'ta giriş, oyun
  (normal, yoğun, son saat, duraklat), sonuç, çevrimdışı; taşma yok, 44 px altı hedef yok, axe 0.
- Görsel eşleşme: handoff `.dc.html` aynı genişliklerde ekran görüntüsü alınır ve yan yana
  karşılaştırılır; fark `IYILESTIRMELER.md`'ye "değişen ne" listesiyle yazılır (handoff açık soru 3).
- Hareket: azaltılmış tercih (emulate) ile oyun ve giriş; CSS-dışı animasyonların okuduğu doğrulanır.
- Performans: K10 ölçümü, önce/sonra.
- İnsan gözü: 8 Ekim vitrin kaydı (`/tmp/bozo-vitrin`) önce/sonra karşılaştırması sahibine gösterilir.

## 4. Sahibine açık kalanlar

1. Masaüstü odak modu (kabuksuz) handoff açık soru 1: davranış zaten böyle, yeniden sorulmaz;
   sahibi görünce itiraz ederse tek `useOdakModu` koşulu.
2. Handoff'un `bordo.css` açık sorusu: token eşlemesi kodla yapıldı (`--kor-leke*` vb.).
3. Mobil eylem pili: sitedeki mevcut pil kalır (handoff de öyle diyor).
4. "[TASLAK]" metinler (sıralama başlığı, haftalık sıra cümlesi) önceki turdan beri onay bekliyor.
5. Paylaş, Kurallar, katılım ve sıralama görselleri: plan 4 ve sonraki tur.
