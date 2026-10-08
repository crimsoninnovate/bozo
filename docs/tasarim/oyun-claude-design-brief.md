# Sofra Yetiştir: Claude Design brief

Tarih: 8 Ekim 2026. Kullanım: aşağıdaki "Yapıştırılacak metin" bölümünü olduğu gibi Claude
Design'a yapıştır, "Ekler" listesindeki dosyaları yükle. Dönen tasarımlar mühendis tarafından
mevcut React koduna giydirilecek; brief bu yüzden serbest bir yeniden tasarım değil, kodun
yapısına oturan ekranlar ister.

---

## Yapıştırılacak metin

Ciğerci Bozo için (Girne, KKTC; Urfa usulü ciğerci, gece 05:00'e kadar açık) sitenin içinde
yaşayan küçük bir tarayıcı oyununun ekranlarını tasarlıyorsun. Oyun kodda çalışıyor; sen
görünümünü tasarlıyorsun. Tasarımlar mevcut React bileşenlerine giydirilecek, bu yüzden
aşağıdaki yapı ve kısıtlar bağlayıcıdır. Yeni renk, yeni yazı tipi, yeni ekran akışı önerme.

### 1. Bağlam

- Kim gelir: sofradaki QR koddan (şiş pişerken, 3 dakikalık boşluk) ve Instagram'dan. Çoğu
  telefon, dikey; masaüstü de olur.
- Oyun: "Sofra Yetiştir" (çalışma adı). Kuşbakışı ocakbaşı tezgahı, 120 saniyelik bir gece
  (21:00'den 05:00'e, beş evre). Misafir karakter değil, sofradır: kare sofra, içinde sipariş
  fişi, çevresinde sabrı gösteren kor halkası. Oyuncu sofrayı kurar, şişi ocağa koyar, doğru
  anda çevirir, alma penceresinde tezgaha alır, servis eder. Yalnız dokunma; sürükleme yok.
  Haftalık sıralama, ilk 3'e ödül.
- Ton: yalın, eğlenceli, güçlü animasyon. Gece, kor, bakır, krem. Arcade kabini, karakter,
  seviye, dükkan yok.
- Oyun sitenin kor zemini (`KorSahnesi`) üstünde durur; sitenin tüm görsel dili geçerlidir.

### 2. Değişmez kısıtlar

**Renk.** Yalnız bu token'lar. Yeni renk yok; bir renk eksikse söyle, uydurma.

| Token | Hex | Oyundaki rolü |
|---|---|---|
| `--zemin` | `#230D0B` | sayfa zemini |
| `--komur` | `#2C1210` | yanık tane, kömür |
| `--plaka-zemin` | `#28100E` | plaka, yuva zemini |
| `--gece` | `#1B0908` | yalnız son saat sahnesi (04:00-05:00) |
| `--kor` | `#B82B27` | kor halkası, büyük düğme dolgusu, közler |
| `--kor-hover` | `#A02420` | düğme hover |
| `--krem` | `#F9E9D5` | metin, çiğ tane |
| `--bakir` | `#D19E66` | pişmiş tane, çentik ve bant, odak halkası |
| `--bakir-acik` | `#E8C08A` | tam kıvam bandı, canlı veri vurgusu |
| `--bakir-koyu` | `#C08A57` | ikincil bakır |

Alfa merdivenleri mevcut: `--krem-86 ... --krem-32` (krem), `--cizgi*` (krem .36'dan .08'e,
çizgi ve kenarlık), `--kor-14 ... --kor-90` ve `--kor-leke*` (kor ışığı, ocak yatağı),
`--bakir-85 ... --bakir-07`, `--panel-*` (zeminin alfaları, cam paneller). Kor asla metin
rengi değildir. Bakır ve kor geniş alanda yan yana durmaz.

**Yazı.** Başlık, rakam ve sayaçlar Bevan 400 (tek ağırlık; kalın yok), rakamlar tabular.
Gövde ve etiketler Archivo 400/500/600/700. Okuma metni 16 px tabanı; etiket, çip, HUD
rakamı gibi mikro metin 13-15,5 px olabilir. Başka font yok.

**Köşe.** 0-3 px. Tek istisna sitenin mevcut mobil eylem pilidir, ona dokunma.

**Dokunma hedefleri.** Sofra 84 px (ölçüldü: 390 px'te sütun 81 px, 320 px'te 64 px verir;
320'de 84 sığmaz, tasarım bunu kabul etsin), ocak yuvası 72×140 px, raf ve tezgah düğmeleri
≥ 56 px, 320 px genişlikte her hedef ≥ 44 px. HUD 320 px'te tek satıra sığmak zorunda: saat,
beş haneli puan, kombo rozeti, ses ve duraklat.

**Kontrast** WCAG AA. Renkten bağımsız okunurluk: pişme ray ve çentikle, yanık konturla,
ürün siluetle, sabır halka uzunluğuyla anlaşılır.

**Hareket azaltma.** Her animasyonun azaltılmış karşılığı var; §12 tablosu (ek) belirler:
opaklık geçişi kalır, kayma, dönüş, kıvılcım gider.

**Görsel.** Fotoğraf yok, yapay zeka görseli yok; her şey vektör. Semboller 24'lük karede,
`currentColor` çizgi 1,6 px, elle çizilmiş his. Logo (rozet, SVG) olduğu gibi kullanılır;
değiştirilmez, yeniden çizilmez, kırpılmaz.

**Metin.** Uzun tire (U+2014) yok; iki nokta, virgül veya nokta. Şapkalı harf yok. Büyük
harfle yazılmış cümle yok. Ünlem nadir. Saat `10:00 - 05:00` biçiminde. Baş harf büyük
yalnız ürün adlarında (`Bozo Karışık`), bölüm etiketlerinde (`Ocak`, `Raf`) ve düğme
etiketlerinde (`Tekrar Oyna`); başlık ve gövde cümle düzeni (`Girne uyurken ocak yanıyor`).
Kilitli sözcükler: misafir (müşteri değil), ikram (bedava değil), ocak/kor (mangal değil),
usta (şef değil), tane (parça değil), şiş/porsiyon (adet değil), sofra (masa değil), "gece
açığız" (7/24 değil). **Yeni pazarlama metni yazma.** Aşağıdaki mevcut dizgileri birebir
kullan; gereken her yeni dizgiyi `[TASLAK]` etiketiyle yer tutucu olarak yaz.

### 3. Kodda ne var (tasarım buna oturur)

**Site kabuğu ve odak modu (8 Ekim 2026 kararı).** Giriş, sonuç, sıralama, katılım, kurallar
ve ödül kodu ekranlarında sitenin kabuğu durur: üst bar (masaüstünde nav ve CTA; telefonda
sarkan rozet, hamburger, çekmece), alt bilgi, telefonda yüzen eylem pili. Tur sırasında kabuk
çekilir: üst bar, alt bilgi ve pil yok, oyun alanı tüm görünümü alır. Duraklat perdesinde iki
düğme: `Devam Et` ve `Oyundan Çık` (girişe döner, kabuk geri gelir). Oyun sitenin
menüsünde ve çekmecesinde yoktur; ana sayfa bandı ayrı iş, bu brief'e girmez.

**Giriş açılışı (8 Ekim 2026 kararı).** Rozet kor ışığından yükselir, kıvılcımlar, tek bir
bakır parlama; ardından başlık `Sofra Yetiştir`, satır `Girne uyurken ocak yanıyor`, büyük
`Oyna`. Sonuç ekranının üstünde de rozet durur. Logo oyun deneyiminde görünür olmak zorunda.

**Oyun alanı, yukarıdan aşağı (sıra sabit):**

1. HUD: saat rayı (21:00 → 05:00, ucunda "ocak söner" işareti), saat, puan, kombo rozeti
   (×1-×4), porsiyon rozeti (yalnız 12'lik dizi sayılırken, akışta yer tutmaz), ses, duraklat.
2. Sofralar: 4 yuva, evreye göre 1→2→3→4 açılır (kapalı yuva kesikli çerçeve); kuyruk varsa
   `Kapıda N` çipi.
3. Ocak: 4 yuva (evre 1-2'de 3 açık), altta köz yatağı ve kıvılcım; her yuvanın altında ince
   ray: dolum, ortada bakır çevirme çentiği, sonda alma penceresi, onun ortasında daha parlak
   tam kıvam bandı.
4. Tezgah ve ayran: 4 tezgah yuvası, sağda açık yayık düğmesi (bakır maşrapa dolar).
5. Raf: `Ciğer`, evre 2'den `Dalak`, evre 3'ten `Yürek`; siluet ve etiket.

**Her öğenin göstermesi gereken durumlar:**

- Sofra: kapalı yuva; boş; kurulmamış (fiş var, halka iki kat hızlı tükenir); kurulu (ikram
  tabakları: lebeni, bostana, yeşillik, sumaklı soğan); fişte servis edilen kalem işaretli;
  Bozo Karışık fişi (üç siluet tek çubukta); vurgu (tezgah ürününe dokununca isteyen sofra
  parlar); ödedi; kalktı (halka söner, sofra kararır, kalktı işareti); ilk misafir (halkası
  tükenmez); ilk turda kor noktası ipucu.
- Kor halkası: dolu → kısalır → sona doğru kızarır → kül.
- Şiş: çiğ (krem) → pişiyor (bakıra döner) → çevirme bandında (çentik yanar, çevirme işareti)
  → çevrilmiş iyi / kötü → alma penceresi → tam kıvam bandı (bakır parlama, `+150` yükselir)
  → yandı (kömür dolgu, krem kontur).
- Ocak yuvası: boş; kapalı; şişli; kıvılcım yoğunluğu komboyla artar.
- Tezgah: boş; dolu kalem (tam / iyi / ayran); soğuma çubuğu (10 sn); tezgah dolu işareti.
- Ayran: boş; doluyor (maşrapa alttan dolar); hazır, tezgahta yer bekliyor.
- Raf: etkin; ocak dolu (sallanır); ürün evresi gelmemiş (yok).
- Kombo rozeti: ×1 nötr; ×2, ×3, ×4 mühür gibi basılır, ocak bir kademe ısınır.
- Porsiyon rozeti: 12 art arda tam kıvam, `+500`.
- Son saat (04:00-05:00): sahne `--gece`ye geçer, saat rayı bakırlaşır, puan ×2.
- Duraklat: perde, oyun alanı kapanır; `Devam Et`, `Oyundan Çık`.

**Mevcut semboller (yaklaşık 26, hepsi SVG, `components/oyun/Semboller.tsx`):** sofra
plakası, kor halkası, kalktı işareti, lebeni, bostana, yeşillik, sumaklı soğan, ciğer / dalak
/ yürek taneleri (kare / enine oval / yuvarlak köşeli eşkenar dörtgen), Bozo Karışık fişi, şiş
gövdesi (markanın kilitli geometrisi, ocakta dikey), ürün şişi (üç katman: çiğ, pişmiş, kömür),
yanık şiş, çevirme işareti, ocak yatağı (közler), açık yayık, bakır maşrapa, kombo rozeti,
porsiyon rozeti, ocak söner işareti, duraklat, ses açık / kapalı, kor noktası ipucu. Bunları
geliştirebilirsin; hepsini aynı dilde tut, yenileri aynı 24'lük karede çiz.

**Mevcut dizgiler (birebir kullan):**

- Kodda (`content/tr/oyun.ts`): `Sofra Yetiştir`, `Oyna`, `Tekrar Oyna`, `Duraklat`,
  `Devam Et`, `Oyundan Çık`, `Ses`, `Saat`, `Puan`, `Kombo`, `Kapıda`, `Ocak`, `Tezgah`, `Raf`, `Sofra`,
  `Boş sofra`, `kurulu`, `üç sofra kalktı`; duyurular `Son saat`, `Bir porsiyon`,
  `Sofra kalktı`, `Fiş tamam, +{puan}`, `Şiş yandı`, `Şiş soğudu`; özet `sofra`, `şiş`,
  `tam kıvam`, `en uzun kombo`; `En iyin`, `Yeni en iyi`, `kaldı`.
- Siteden: `Girne uyurken ocak yanıyor`, `05:00 · son tane, ocak söner`,
  `Sofra kurulu gelir, istemenize gerek yok`, `Gizlilik`; ürünler `Ciğer`, `Dalak`, `Yürek`,
  `Bozo Karışık`, `Ayran`, `Lebeni Çorbası`, `Bostana`; adres `Naci Talat Caddesi No:4,
  Girne`; saatler `10:00 - 05:00`; `cigercibozo.com/oyun`.
- Spec'ten, henüz kodda yok: `Bu skoru sıralamaya yaz`, `Kaydet ve Katıl`, `Takma ad`,
  `Hesabımı sil`, `ekran görüntüsünü al`, `çevrimdışı tur`, `Kurallar`, `Sıralama`,
  `son şampiyon`.
- Katılım cümlesi, kurallar metni, saat satırı kalıbı (`Saat 03:40. Ocak hala yanıyor`) ve
  sofra QR kartı metni sahibinin onayını bekliyor: hepsi `[TASLAK]`.

### 4. İstenen ekranlar (öncelik sırası)

Her ekran 390×844 ve 1440×900; oyun alanı ayrıca 320 px genişlikte. Masaüstünde oyun alanı
dikey panel olarak ortada kalır (mevcut ekran görüntüsü gibi), kabuk etrafında.

1. **Giriş `/oyun/`.** Açılış animasyonu 3-4 kare olarak: (a) kor ışığı ve kıvılcım, (b) rozet
   yükselir, (c) bakır parlama, (d) son hal: rozet, `Sofra Yetiştir`, `Girne uyurken ocak
   yanıyor`, büyük `Oyna`, haftanın ilk 3'ü, son şampiyon satırı, `Kurallar` ve `Gizlilik`
   bağlantıları. Kabuk görünür.
2. **Oyun alanı (odak modu, kabuk yok).** Dört hal: (a) normal, evre 1-2: iki sofra, üç ocak,
   raf yalnız `Ciğer`; (b) yoğun evre 4 anı: dört sofra, dört ocak, bir Bozo Karışık fişi,
   kombo ×3, tezgah dolu işareti, ayran doluyor, bir şiş yanık, bir halka kızarmış, `Kapıda 1`;
   (c) son saat: `--gece` sahne, bakır saat rayı, ×2; (d) duraklat perdesi. Her biri 320 px'te
   de.
3. **Sonuç.** Üç hal: (a) gece tamam: üstte rozet, `05:00 · son tane, ocak söner` satırı
   ve işareti, sayarak artan puan, dört özet rakamı, en iyi satırı (`En iyin 12.400, 800
   kaldı` ya da `Yeni en iyi`), haftalık sıra ve bir üsttekine fark, büyük `Tekrar Oyna`,
   `Paylaş`, `Bu skoru sıralamaya yaz`; (b) `03:40 · üç sofra kalktı`; (c) çevrimdışı tur
   uyarısı, sıralama satırı yok. Kabuk görünür.
4. **Katılım.** `Takma ad` alanı (3-12 karakter), tek cümle `[TASLAK]` (veri Türkiye'deki
   sunucuda, takma ad herkese açık), `Gizlilik` bağlantısı, `Kaydet ve Katıl`, tarayıcı
   verisi silinirse hesabın kaybolacağı notu `[TASLAK]`. Reddedilen ad için nötr hata hali.
5. **Sıralama `/oyun/siralama/`.** Haftanın ilk 10'u (sıra, takma ad, puan), oyuncunun kendi
   satırı ve bir üsttekine fark (ilk 10 dışındaysa da), son şampiyon, sıfırlanma zamanı
   (Pazartesi 05:00), `Hesabımı sil` bağlantısı.
6. **Ödül kodu.** 6 haneli kod büyük ve tabular, `ekran görüntüsünü al` notu, 14 gün
   geçerlilik, kullanıldı hali.
7. **Kurallar `/oyun/kurallar/`** (düşük öncelik). Metin sayfası: nasıl kazanılır, beraberlik,
   teslim, bir kişi bir ödül, takma ad kuralları, veri → Gizlilik, kampanya tarihleri. Metin
   `[TASLAK]`.
8. **Paylaşım kartı 1080×1920** (düşük öncelik). Rozet, saat satırı `[TASLAK]`, puan, takma
   ad, dört özet rakamı, adres ve saatler, `cigercibozo.com/oyun`, sabit QR yeri.

Ayrıca: **bileşen sayfası** (yukarıdaki tabloda geçen her sembol ve durum, 24'lük karede,
boyutlarıyla) ve **ekran başına hareket notu** (hangi an, ne hareket eder, süre, azaltılmış
hareketteki karşılığı; §12 tablosuna satır satır eşlensin).

### 5. Teslim biçimi (mühendis bunlarla giydirecek)

- Token eşlemesi: her yüzey ve çizgi hangi token. Hex değil token adı.
- Boşluk ve boyutlar px olarak; 320 / 390 / 1440 için ayrı değer gerekiyorsa üçü de.
- Her yeni sembol temiz SVG: 24×24 viewBox, `currentColor`, çizgi 1,6, gradyan ve raster yok.
- Mevcut ekran görüntülerinden (ekli) neyin değiştiğinin açık listesi; neyin aynı kaldığı da.
- Hareket notu: §12 tablosunun satırına referansla.

### 6. Yapma

Site kabuğunu yeniden tasarlama. Ana sayfa bandı, menü ve çekmece girişi tasarlama. Arcade
kabini, karakter, XP, seviye, "nasıl oynanır" ekranı ekleme. Fotoğraf, yapay zeka görseli,
yeni renk, yeni yazı tipi, 3 px üstü köşe, cam efekti kümesi, mor-neon palet, emoji kullanma.
Uzun tire yazma. Pazarlama metni uydurma; bilmediğin her dizgi `[TASLAK]`.

---

## Ekler (Claude Design'a yüklenecek dosyalar)

Hepsi tek klasörde, kalıcı: `/Users/mk/Desktop/Bozo/oyun-brief-ekler/`. Ekran görüntüleri 8 Ekim
2026 22:18'de, kabuk ve açılış animasyonu commit'lendikten sonra (`b1870d1`) alındı; tasarımın
"değişen ne" listesi bunlara göre yazılır.

- `rozet-onizleme.png` ve `/Users/mk/Desktop/Bozo/Web/public/marka/rozet.svg` (rozet)
- `giris-390.png`, `giris-1440.png` (giriş, açılış bitmiş hâli, kabuk görünür)
- `oyun-390.png`, `oyun-1440.png` (oyun alanı, odak modu, kabuk yok)
- `perde-390.png` (duraklat perdesi)
- `sonuc-390.png` (sonuç, üç sofra kalktı hâli)

Token'lar, spec ve metin:

- `/Users/mk/Desktop/Bozo/Web/styles/tokens.css`
- `/Users/mk/Desktop/Bozo/Web/styles/palet/bordo.css`
- `/Users/mk/Desktop/Bozo/Web/docs/specs/2026-10-08-oyun-design.md` (yalnız §2-3, §11-15 gerekli)
- `/Users/mk/Desktop/Bozo/Web/content/tr/oyun.ts`
- `/Users/mk/Desktop/Bozo/Web/components/oyun/Semboller.tsx`

Site kabuğu için canlı site `https://cigercibozo.com` günceldir; el teslimi ekran görüntüleri
ana sayfa ve çekmecede eskidir.
