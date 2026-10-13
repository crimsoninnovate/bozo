# Menü sayfası iyileştirme planı (13 Ekim 2026)

Kaynak: `/menu` 390x844 ve 1440x900 tam sayfa görüntüleri (yerel `out/`, 190 gr ve 900 TL sonrası),
`taste-skill` yeniden tasarım denetimi. Skill'in genel önerilerinden projeye uymayanlar baştan elendi:
font değişimi (Bevan/Archivo kilitli), Lucide yerine başka ikon seti, örnek fotoğraf ya da uydurma
metin, `scroll-behavior: smooth` (sahibi sildi), yeni renk (palet kapalı).

Sayfa ölçüsü bugün: telefonda 3703 px (4,4 ekran), masaüstünde 3923 px.

## Bulgular

| # | Nerede | Ne görülüyor | Etkisi |
|---|---|---|---|
| 1 | Masaüstü, her bölüm | Fotoğrafı olmayan 10 boş plaka: Ciğer panelinde 640x470, altı kartta 270 px, iki ikramda ve içeceklerde birer tane. Telefonda 1A kararıyla gizli, masaüstünde duruyor | Plakalar dikeyde yaklaşık 1470 px, masaüstü sayfanın üçte biri; ilk ekranın yarısı boş |
| 2 | Masaüstü, Ciğer | Eldeki tek gerçek kare (`tane-yakin-cekim.webp`) ana sayfada kullanılıyor, menüdeki yatay yuva (`tane-yakin-cekim-yatay`) boş | İmza ürün, fotoğrafı olduğu halde boş plakayla açılıyor |
| 3 | Masaüstü, kartlar | Açıklaması olmayan Terbiyeli Tavuk Şiş ve tek fiyatlı Bozo Karışık kartlarında 60-90 px boşluk | Izgara düzensiz okunuyor |
| 4 | Masaüstü, İçecekler | Aynı ızgarada bazı kalemlerde fiyat adın yanında (Kola, Fanta), bazılarında alt satırda (Kola Zero, Ayran); Su'da sağ üstte | Fiyat sütunu yok, göz her satırda yeniden arıyor |
| 5 | Telefon, ürün satırları | İkinci satır akışkan metin: `1,5 Porsiyon 900 TL  Dürüm 5 şiş 690 TL / 1,5 Dürüm 900 TL`. "5 şiş" notu iki fiyatın arasına düşüyor | Taranması zor; 2A kararının "ikinci satır"ı korunarak hizalanabilir |
| 6 | Telefon, İkramlar ve İçecekler | Her küme ve her içecek ayrı çerçeveli kutu (3 + 6 kutu); Ocakbaşı ise çizgili satır | Aynı sayfada iki liste dili; "kart değil satır" notuyla çelişiyor |
| 7 | Bozo Special | Ad, 190 gr ve fiyat var; içinde ne olduğu yok | Sayfanın en pahalı kalemi açıklamasız |
| 8 | Terbiyeli Tavuk Şiş | Açıklama yok (8 Ekim'den beri sahibinde) | Terbiyesiz kardeşinin yanında boş |

İyi olanlar, dokunulmayacak: başlık hiyerarşisi, bakır fiyat rengi ve tabular rakamlar, açık/kapalı
rozeti, ikramların "ikram" etiketi, telefonda ilk fiyatın ilk ekranda olması, JSON-LD.

## Plan

### A. Sahibe sormadan yapılabilir (metin ve karar değiştirmez)

- **A1. İçecekler tek fiyat sütunu (bulgu 4).** Masaüstünde kalem satırı ad solda, ölçü-fiyat çiftleri
  sağda sabit sütunda; uzun ad alt satıra geçerse fiyat yine sağda kalır. Telefonda kutular yerine
  Ocakbaşı'nın çizgili satırı (bulgu 6'nın içecek yarısı).
- **A2. Telefonda ölçü satırı ızgarası (bulgu 5).** İkinci satır iki sütunlu ızgara olur: `1,5 Porsiyon`
  ve `Dürüm` bir sütunda, `1,5 Dürüm` hizalı; "5 şiş" adın altına değil `Dürüm` etiketinin yanına
  küçük not olarak kalır ama fiyatı itmez. 2A (tam fiyat adın hizasında) aynen korunur.
- **A3. Telefonda ikram kümeleri tek blok (bulgu 6).** Üç ayrı kutu yerine tek çerçeve içinde üç
  küme, aralarında ince çizgi. Metin ve kümeler aynı.
- **A4. Kart boşlukları (bulgu 3).** Açıklaması olmayan kartta ölçü tablosu yukarı çıkmaz (hizalama
  korunur) ama boşluğu tane deseni değil sakin bir ayraç doldurur. Bulgu 1'e B1 cevabı gelirse
  bu madde düşer.

Her madde: `npm run typecheck`, `npm test`, build, 390/1440/320 ölçümü, axe; sonra commit ve yayın.

### B. Sahibin kararı gerekiyor (görsel karşılaştırmayla sorulur)

- **B1. Masaüstünde boş plakalar (bulgu 1).** 1A kararını masaüstüne genişletmek: fotoğraf gelene
  kadar masaüstü de plakasız satır düzenine geçer (iki sütunlu menü listesi), dosya tanımlanınca
  plakalar kendiliğinden döner. Öneri bu; sayfa boyu yaklaşık üçte bir kısalır (ölçülecek).
  Alternatif: plakalar kalır, olduğu gibi.
- **B2. Ciğer panelinde gerçek kare (bulgu 2).** Eldeki dikey kareyi yatay yuvada `object-position`
  ile kırpmak. Önce kırpılmış hali gösterilir; ürün kadrajda okunmuyorsa yapılmaz.

### C. Sahibin metni gerekiyor (uydurulmaz)

- **C1. Bozo Special ne içeriyor (bulgu 7):** bir cümle.
- **C2. Terbiyeli Tavuk Şiş açıklaması (bulgu 8):** bir cümle.
- **C3. Dürüm "5 şiş" notu hâlâ doğru mu** (DEVAM.md madde 1'den açık).
- **C4. Fotoğraflar:** on altı boş kare; geldikçe yalnız `content/fotograflar.ts` güncellenir.

## Sıra

A1, A2, A3 birlikte bir tur (yalnız CSS ve küçük JSX). B1 ile B2 için 1440'ta önce/sonra görüntüsü
hazırlanıp sahibine sorulur; A4 B1'in cevabına bağlı. C maddeleri sahibine tek mesajda gider.
