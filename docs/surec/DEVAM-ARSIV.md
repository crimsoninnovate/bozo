# Devam noktası: arşiv

Bu dosya 11-19 Ağustos 2026 arasında tutulan tarih sıralı kayıt defteridir. **Güncel durum
burada değil, `DEVAM.md` dosyasındadır**; buradaki satırların bir kısmı yazıldıkları günün
haliydi ve sonradan değişti (dosyanın kendi içindeki "şunu geçersiz kılar" uyarıları da o
yüzden var). Kararların gerekçeli ve ölçümlü hali `IYILESTIRMELER.md`'de durur; burası yalnız
o günlerin sırasını hatırlamak için tutuluyor.

---

Bu dosya, bağlam sıfırlandıktan sonra işe kaldığı yerden devam etmek için tek giriş
noktasıdır. Önce bunu oku, sonra buradan dallan.

Son güncelleme: 18 Ağustos 2026 gecesi, çekmece zenginleştirme ve çürütme turu sonrası

## 18 Ağustos 2026: nerede duruyoruz

**Bu blok altındaki her şeyi geçersiz kılar.** Aşağısı tarih sırasıyla duran kayıt
defteri ve 12 Ağustos'ta yazıldığı haliyle bırakıldı; çelişki görürsen burası kazanır.

- Branch `feat/site-kurulumu`, 122 test geçiyor, typecheck ve build temiz, 17 rota
  girdisi. Ağaçta çalışan ajan yok.
- **Site kendi alan adında** (19 Ağustos, sahibinin isteği): `https://cigercibozo.com` test
  yayınında, `www` 301 ile apex'e gidiyor, Let's Encrypt sertifikası alındı. Açılışa kadar
  `X-Robots-Tag: noindex, nofollow` (Caddy bloğunda tek satır, açılışta silinir). `robots.txt`
  bilerek taramaya açık: tarayıcı sayfaya ulaşıp başlığı okuyabilsin diye. Demo adresi duruyor,
  iki alan adı da aynı dizini okuyor, tek rsync ikisini birden günceller.
- **Sahibinin adı sitede "Bozo Çağlar"** (19 Ağustos, sahibinin kararı): imza ve üstyazılar
  sesleniş, nüfustaki ad yalnız lakabı açıklayan iki cümlede. Kural `CLAUDE.md` > Copy rules.
- **Bozo adının hikayesi yayında** (19 Ağustos, `IYILESTIRMELER.md` > "lakap bölümü"):
  Hikaye sayfasında `Lakap` bölümü, sahibinin kendi anlatımından derlendi. Envanterden
  gelmeyen ilk metin bloğu; istisna `CLAUDE.md` > Copy rules'ta kayıtlı. Anlatımın dokuz
  örneğinden beşi basıldı, kişiyi küçülten dördü basılmadı.
- **Menü sayfası telefonda satır düzeninde** (18 Ağustos gecesi, sahibinin 1A/2A kararı,
  `IYILESTIRMELER.md` > "menü sayfası telefonda satır düzenine geçti"): 1040 altında kart
  yerine satır, boş plaka basılmaz (`FotoYuvasi bosMobildeGizli`, dosya gelince döner), hero
  110px, atlama çipleri. Sayfa 390'da 7815 > 3784px. Masaüstü değişmedi.
- **Marka renkleri**: WhatsApp glifi yeşil, Instagram gradyan (`--marka-*`, yalnız `Ikonlar.tsx`).
- **Mobil çekmece zenginleşti** (18 Ağustos gecesi, sahibinin A kararı, `IYILESTIRMELER.md`
  > "çekmece zenginleştirme turu"): kendi üst satırı (kilit + dil + X), 01-04 numaralı
  bağlantılar, Menü altında üç bölüm çapası (`cekmeceLinkleri().altlar`), durum bloğu
  (çip + 40px saat + alt metin), adres ve saat satırları, iki CTA, iletişim ayağı, açılış
  hareketi, yatayda iki kolon. Çekmecenin kaynağı artık prototip değil bu kayıt.
- **Animasyon kurgusu turu kapandı** (18 Ağustos akşamı, `IYILESTIRMELER.md` > "animasyon
  kurgusu ve akışı turu"): yedi mercek, çürütme turu, yirmi üç commit. Sahibine kalan
  kararlar `KARAR-FORMU.md` F1-F10. Azaltılmış harekette tek geçiş istisnası var
  (`KorSahnesi.module.css`, `CLAUDE.md`'de kayıtlı); `useHareketAzaltilmisMi` tercihi
  canlı izler.
- **Mobil eşik 1040px** (18 Ağustos, F3; 961-1039 EN menü barı sarıyordu), otuz beş
  media query artı `FotoYuvasi`'nın `sizes` ipucu.
  Aşağıda geçen 780 ve 800 değerleri tarihtir, bugünkü kod değil.
- **Şiş kilidi onaylandı ve her yerde** (18 Ağustos akşamı, F1): `lib/sis.ts` +
  `SisIsareti` + `MarkaKilidi`; üst bar ve 404 tam kilit, alt bilgi "sadece kelime",
  `app/icon.svg` / `app/apple-icon.png` / `public/sosyal-kart.png` aynı geometriden
  (üretici: sohbetteki scratchpad `ikon/uret.mjs`, tekrar gerekirse `lib/sis.ts`
  oranlarından yeniden yazılır). Aşağıdaki "onaylı logo yok / işaret sözle tarif"
  satırları o günün kaydı.
- **Fiyatlar geldi** (13 Ağustos): menü sayfası gerçek fiyat basıyor, `000 TL` yalnız
  fiyatı olmayan kalem için yer tutucu. Bekleyen veri: e-posta, koordinat, posta kodu,
  içecek fiyatları, 17 fotoğraf.
- **Site ikonu geldi** (13 Ağustos): `app/icon.svg` var ve her sayfa bağlıyor. Konsolda
  favicon 404'ü yok. Hâlâ eksik olan `apple-icon.png` ve `opengraph-image.png`.
- **İkon kararı tersine döndü** (13 Ağustos): `lucide-react` bağımlılık olarak eklendi,
  CTA butonları iki katmanlı işaret dili taşıyor. Aşağıdaki 12 Ağustos "ikon
  eklenmeyecek" kaydı artık geçerli değil (`IYILESTIRMELER.md` > 13 Ağustos).
- **Yasal metinler ve `/gizlilik` bağlantısı backlogda**, sahibinin kararı
  (`KARAR-FORMU.md` C4). Yeniden önerme.
- Bekleyen kararlar tek yerde: `KARAR-FORMU.md` ve `IYILESTIRMELER.md` > "karar bekliyor".

## Ana sayfa yeniden tasarlandı (12 Ağustos akşamı)

Kaynak: `~/Desktop/Bozo/export/UYGULAMA-NOTLARI.md`, Crimson Innovate'in canlı
demoya karşı yaptığı bölüm bölüm denetim. **Ana sayfa için kanonik kaynak artık
bu not**, `design_handoff_bozo_website/*.dc.html` değil; iç sayfalar handoff'ta
kaldı. Altı bölümün altısı da uygulandı, on dört maddelik kontrol listesi
doğrulandı.

- **Hero** (`7bcd18b`): iki kolon, saat 130px sağ kolonda, gün merdiveni,
  meta satırı kendi satırında. Öğleden sonra konan tane alanı kalktı.
- **Ocaktan** (`720c92e`): kart çerçevesi kalktı, ad 34px, açıklama 18px,
  `000 TL` sütunu ve üçlü kare ikonlar gitti, fiyat bilgi bloğu geldi.
- **Gece** (`9782ba8`): hayalet saat kalktı, vardiya çipleri yerine canlı zaman
  çizelgesi. `VardiyaSeridi` ve üç dosyası silindi.
- **Kor sahnesi** (`343f47e`): bütün tiling katmanları kalktı, alt vinyet geldi.
  Bu, sabah yapılan taneleştirmenin geri alınması demek; sahibinin kararı.
- **İddia, Hikaye, Konum, paket, footer** (`a85f408`).
- **Tipografi** (`11874cf`): kademe 1 tabanı 17px. Kademe 2 ve 3 KISITLAR'a göre
  tasarımın ölçüsünde kaldı, kontrastla ölçüldü.

**İki gerçek hata bu turda çıktı:** sayaçlar arka plandaki sekmede sıfırda
donuyordu (`requestAnimationFrame` çalışmıyor, gözlemci de bırakılmış); footer'ın
marka kolonundaki 36px kopukluk `<p>` varsayılan margin'iydi, gap değil.

**Notun uygulanmayan iki maddesi:** kumarhane komşuluk çipleri (yerine ne
konacağı sahibin kararı) ve gerçek koyu harita (koordinat hâlâ `null`). Bir
madde de bilinçli atlandı: not paket bandının kalkmasını istiyor, sahibi aynı gün
rozetli düzeni seçmişti.

**Menü sayfası hâlâ `000 TL` basıyor.** (13 Ağustos'ta kapandı: gerçek fiyatlar geldi.) Notun kapsamı ana sayfaydı; menü
sayfasında fiyatın nasıl görüneceği ayrı bir karar.

## En son ne oldu (12 Ağustos öğleden sonra)

**Telefon geldi:** `+90 533 888 74 24`, aynı hat WhatsApp. `content/isletme.ts`
dolu, iki test gerçek veriye göre güncellendi. Kayıtlı B4 maddesi (yer tutucu
kontrastı) bununla kapandı; yerine gerçek bir kusur çıktı ve düzeltildi: alt bilgi
iletişim satırları etkin bağlantıya dönünce 28px dokunma hedefiyle kaldı, 44px'e
çıkarıldı.

**Sahibinin metin kararları uygulandı:** başlık düzeni (ürün adları, bölüm/menü
etiketleri, CTA ve nav; sayfa başlıkları ve gövde cümle düzeninde kaldı, `CLAUDE.md`
aynı commit'te güncellendi), kısa adrese `No:4`, paket şeridinin sipariş butonu
yerine `yakında` rozeti, saat tablosunun gün satırı canlı duruma çevrildi.

**İngilizce 404 çözüldü** (`3659cfd`): `/en/` altındaki bozuk yollar artık İngilizce
döner, `<html lang>` ve sekme başlığı dahil.

**İki yeni belge:** `docs/surec/KARAR-FORMU.md` (22 bekleyen madde triyaj edildi:
13'ü sahibin kararı, 4'ü veri bekliyor, 3'ü ertelendi, 4'ü teknik borcumuz, 2'si
zaten kapanmıştı) ve `docs/surec/YAYIN-KONTROL-LISTESI.md` (yayın öncesi dört
madde artı yerelde doğrulanmış duman testi).

**Demo canlıda: `https://bozo.crimsoninnovate.com`** (12 Ağustos 16:20). Sahibi A
kaydını çevirdi, blok kuruldu, sertifika otomatik çıktı, duman testinin altı adımı
da geçti. Bununla iki eski varsayım ölçüme dönüştü (`/menu` 308, `!` içeren RSC
yükü 200) ve `handle_errors` maddesi kapandı. Sunucu hakkında iki tuzak kayda
geçti: Caddy systemd'de değil Docker'da, ve konteynerin `/srv/enliq`'i host'un
`/var/www/enliq`'i. Ayrıntı `YAYIN-KONTROL-LISTESI.md` ve `README.md`'de.

**Üst barın kırpılması kapandı** (`d50f16c`). Masaüstü barı 780px'te kendi
içeriğine sığmıyordu. Mobil eşiği on yedi media query'de birlikte 800px'e taşındı
(13 Ağustos'ta yirmi iki media query ile 960px'e çıktı, en üstteki bloğa bak);
yalnız `UstBar`'da taşımak 781-800 arasında nav'ı ve hamburger'i birden gizlerdi.
`KorSahnesi`'nin `min(780px, 110%)`'i bir genişlik, eşik değil, dokunulmadı.

**Instagram geldi:** `cigercibozo` (kullanıcı adı olarak saklanıyor, B3 kapandı).
Hesap henüz açık değil, yayın listesine 5. madde olarak girdi. Bu değişiklikle alt
bilgide pasif yer tutucu kalmadı.

**Footer'ın `isimNotu` satırı 19 Ağustos 2026'da tümüyle kaldırıldı** (sahibinin kararı,
hikaye bölümü anlatıyor). Aşağısı o günün kaydı.

**Footer'ın `isimNotu` satırı yenilendi:** eskisi ana sayfanın kendi bölüm başlığını
tekrar ediyordu, yenisi İngilizce satırın işini yapıyor (iddiayı değil kişiyi söyler).

**İkon kararı:** CTA butonlarına ikon eklenmeyecek (sahibi, 12 Ağustos). Tasarımın
kendi kuralı ölçüldü: 11 SVG kullanımı, 4 glif, hepsi bir kanalı (WhatsApp,
telefon, Instagram) veya bir yeri (pin) adlandırıyor, hiçbiri bir eylemi
adlandırmıyor. Lucide ayrıca bağımlılık kuralını bozardı ve üslubu tutmuyor
(uniform 2px kontur; reponun dördünün üçü dolu).

## Proje bir cümlede

Girne'de (KKTC) açılacak Urfa usulü ciğerci Ciğerci Bozo'nun web sitesi. Bitmiş bir
Claude Design çalışmasının Next.js 16'ya statik export olarak taşınması. Repo:
`~/Desktop/Bozo/Web`, branch `feat/site-kurulumu`, kendi git reposu.

## Nerede duruyoruz

**Sayfaların hepsi bitti.** Görevler 1-14 kapalı: iskele, saat çekirdeği, içerik
katmanı, UI bileşenleri, kor sahnesi, kabuk, rotalar, canlı saat, beş sayfa
(9-13), 404 ve gizlilik (14), primitif turu (17).

Sayfa görevlerinden sonra dört toparlama geçti (hepsi 12 Ağustos, raporları
`docs/surec/rapor/` altında):
- **ön geçiş**: 33 token, buton merdiveni kararı
- **kabuk turu**: UstBar/AltBilgi sayfa varyantları, 96px çapa payı
- **toparlama turu**: biriken 15 ölçümün uygulanması; EN footer'daki Türkçe
  cadde adı düzeltmesi dahil
- **mobil turu**: mobil prototipin sahne ve tipografi ölçüleri, ImlecKoru bağlandı

İki bağımsız inceleme (`bagimsiz-sadakat-denetimi.md`, `capraz-inceleme.md`) ve
bir metin denetimi (`metin-denetimi.md`) koştu; bulguları uygulandı. Metin
denetimi canlıda duran üç kilit ihlali yakaladı, üçü de handoff'un kendi hatasıydı
(commit `b36ba3a`, `b677175`).

**12 Ağustos sabahı kapananlar:** Task 15 (parite ve yayın doğrulaması, bir yayın
engeli bulup düzeltti: mobil çekmecenin kapatma düğmesi z-index altında ölüydü),
Task 16 (tasarım ve hareket, 21 öneri), erişilebilirlik tabanı turu, hareket turu,
tasarım kararları turu.

**En büyük bulgu:** sitedeki CSS animasyonlarının hiçbiri koşmuyordu. CSS Modules
`animation-name`'i hash'liyor, keyframe'ler global dosyadaydı, ad hiç çözülmüyordu.
Beş sayfada 42 bildirim, 0 koşan. Düzeltildi (`80ad3b6`) ve regresyon testi eklendi
(`styles/animasyon.test.ts`). Sahibinin "kor pek anlaşılmıyor" gözleminin sebebi buydu.

**Galeri kuruldu** (`docs/surec/rapor/galeri-report.md`): `/galeri/` ve `/en/galeri/`,
manifestteki on altı kadrajın tamamı. Sayfanın çizimi yoktu, kalıplar Gizlilik
sayfasından ve menü ürün ızgarasından alındı.

**Kontrol turu koştu** (`docs/surec/rapor/kontrol-turu-report.md`). `docs/PARITE.md`
yeni ağaca karşı baştan koşuldu ve galeri listeye girdi. Üç şey bulundu, üçü de
düzeltildi:

1. **Galeri mobil çekmecede yoktu.** `Cekmece.tsx` link listesini elle yazıyordu
   ve galeri rotası açılınca güncellenmemişti; 780px altında masaüstü nav
   çekmeceye düştüğü için dar ekranda Galeri'ye üst gezinmeden hiç girilemiyordu.
   Liste `lib/kabuk.ts` > `cekmeceLinkleri()`'ne taşındı, test kilitledi.
2. **Canlı saatin iki noktası AA'yı geçmiyordu.** `colonBlink` dip fazı 1.62:1
   (eşik 3.0). Dip `.25` > `.5`, artık 3.23:1. Sahibi onayladı.
3. **Alt bilginin 12.5px satırı 390px'te eşikte titriyordu** (4.48-4.58, eşik 4.5).
   `--krem-50` > `--krem-58`, artık 4.81. Sahibi onayladı.

İkincisinin bugüne kadar görünmemesinin sebebi kayıtlı yöntemin kör noktasıydı:
kontrast ölçümü yalnız `color`'ın alfasına bakıyordu, ata `opacity` zincirine
değil. `PARITE.md`'nin ölçüm kuralları bu turda beş yeni maddeyle genişledi.

**Öğleden sonra üç tur daha koştu** (12 Ağustos, 13:07-14:51):

1. **Kor taneleşti** (`1451063`). Sahibinin "kor pek anlaşılmıyor" gözlemi için
   parlaklık hipotezi ölçülüp çürütüldükten sonra düz radial gradyan taneli bir
   kor yatağına çevrildi. Aşağıdaki "Kor sahnesi" maddesi bununla değişti.
2. **Hero'nun sağ yarısı doldu** (`01d42ee`). 1440px'te başlık genişliğin
   yarısında bitiyor ve sağ yarı ölü kalıyordu; oraya sayfanın kendi iddiası
   kondu (tane alanı).
3. **UX, arayüz ve hareket denetimi**, iki parça. Raporlar:
   `docs/surec/rapor/ux-hareket-denetimi.md` (ana sayfa) ve
   `ux-hareket-denetimi-ic-sayfalar.md` (menü, hikaye, konum, galeri, 404).

Ana sayfada dört bulgu uygulandı:

- **Üst bar kaydırmada içerikle çakışıyordu** (`39e88f3`, `bf263b6`). Tasarımın
  `.9`'dan `0`'a inen perdesi marka adının hizasında yarı saydam kalıyor,
  altından geçen içerik adın içinden okunuyordu. Mobilin `blur(10px)`'i
  masaüstüne taşındı, ayrı katmanda ve mask ile.
- **Bölüm ritmi düzensizdi** (`c9b6a26`). Yedi bölümün `min-height:100vh`'i
  1440x980'de %43-69 doluluk ve 240/243/334/375/286px'lik aralıklar üretiyordu.
  Altı içerik bölümünden kaldırıldı, beş aralık da tam 240px oldu, belge
  7441px'ten 6175px'e indi. Hero'da kaldı.
- **Menüde isim sütunu sarıyordu** (`ebcf42a`). Tavan 260px'ten 300px'e çıktı.
- **`transition: all` sıfırlandı** (`a4271b7`).

İç sayfalarda sayısal taban temiz çıktı (44px altı gerçek hedef yok,
`transition: all` yok, yerleşim animasyonu yok, 390px'te taşma yok, AA altında
yalnız `aria-disabled` yer tutucular). Bir bulgu uygulandı: **404'te marka
görünmüyordu** (`8094109`), başlığın üstüne wordmark kondu. Üçü sahibin
kararına bırakıldı, aşağıda.

**Ağaçta çalışan ajan yok.** (12 Ağustos'taki hal: 76 test. Bugünkü sayı için en üste bak.)

## SIRADAKİ GÖREV: sahibi seçecek

Yapı tarafında bilinen açık iş kalmadı. Tasarım, hareket ve UX denetimleri de
koştu (12 Ağustos): ana sayfa ve beş iç sayfa ölçüldü, bulunan yedi maddenin
beşi uygulandı, üçü sahibin kararına bırakıldı. Kalan işlerin neredeyse tamamı
artık işletme verisine ya da sahibin bir kararına bağlı, koda değil.

Sıradaki adaylar, sahibinin kararına göre:

- **İşletme verisi geldiğinde doldurma turu.** Aşağıdaki "İşletmeden bekleyen
  veriler" listesi kapandıkça `content/` tek noktadan dolar. Fotoğraf yolu artık
  **ölçüldü** (`PARITE.md` 7.15): dört kadraja geçici görsel bağlanıp derlendi,
  çalışıyor, sonra geri alındı. Fotoğraflar gelince yapılacak tek iş
  `content/fotograflar.ts`'e yol yazmak; ama **bir karar da o an düşecek**,
  plaka fotoğrafla birlikte köşe işaretlerini ve vinyeti düşürüyor
  (`IYILESTIRMELER.md`).
- **Yayın turu.** Alan adı, Caddy, `SITE_URL`, favicon. Favicon için onaylı
  işaret hâlâ yok. **Caddy tarafında bilinen bir tuzak var ve README'ye yazıldı:**
  `file_server` bilinmeyen yolda kendi boş 404'ünü döndürür, `out/404.html`'i
  değil; `handle_errors` bloğu olmadan Task 14'te çizilen 404 sayfası yayında
  hiç görünmez. Gereken blok README'nin yayın bölümünde, ama **canlı sunucuda
  doğrulanmadı**, buradan Caddy koşturulamıyor.
- **Rezervasyon sayfası**, sahibi isterse (şu an "şimdilik gerekli değil").
- Aşağıdaki açık maddelerden biri.

## Eksik sayfalar: talep yedi diyor, tasarım dört çizmiş

Sahibinin tasarım talebi (`~/Desktop/Bozo/Cigerci-Bozo-Web-Tasarim-Talebi.md:11-19`)
yedi sayfa istiyor. Handoff dörtte durmuş (aynı belgenin son satırı: aşamalı üretim).
Tasarımı kaynak aldığımız için iki sayfa hiç gündeme gelmedi; 12 Ağustos 10:25'te
talep açılınca çıktı.

| # | Sayfa | Durum |
|---|---|---|
| 1-4, 7 | ana, menü, hikaye, konum, 404 | kuruldu |
| 5 | **Galeri** (12-18 kare, tembel yüklemeli ızgara) | kuruldu, 16 kare |
| 6 | **Rezervasyon** (sade form + WhatsApp alternatifi) | **sahibi "şimdilik gerekli değil" dedi** |

Rezervasyon açılırsa üç şey birbirine bağlı: statik export'ta sunucu yok (form dış
servis ister), gizlilik sayfası "form toplamaz" diyor ve bu iddia kodla kanıtlandı
(Task 15: on rotada tek origin), telefon ve WhatsApp `null`.

## Okuma sırası

1. `docs/specs/2026-08-11-web-mimarisi.md`: onaylı mimari kararlar ve gerekçeleri
2. `docs/surec/KISITLAR.md`: bağlayıcı kısıtlar, iki katmanlı (sert / varsayılan)
3. `docs/surec/SAYFA-GOREVI-CERCEVESI.md`: sayfa görevlerinin ortak zemini
4. `docs/surec/IYILESTIRMELER.md`: tasarımdan her sapma, gerekçesiyle. Üç
   tablo: uygulandı, karar bekliyor, reddedildi. Bekleyen tablosu bugün
   sahibin önündeki en uzun listedir
5. `docs/surec/denetim/denetim-task-N.json`: her sayfa görevinin brief'inin nerede
   yanlış olduğu, kaynak göstererek
6. `docs/plans/2026-08-11-web-uygulama-plani.md`: uygulama planı. **Dikkat:** bu
   planın sayfa bölümleri güvenilmez, aşağıya bak
7. `.superpowers/sdd/2026-08-11-web-uygulama-plani/progress.md`: ayrıntılı ledger,
   her görevin commit aralığı, her karar ve gerekçesi. Gitignore'lu, yalnız diskte

## En önemli iki kural

**1. Plan dosyasının sayfa bölümleri spec değildir.** Beş sayfa görevinin brief'i
gönderim öncesi tasarıma karşı denetlendi ve 138 hata çıktı, 64'ü yapısal. Sayfaların
spec'i `design_handoff_bozo_website/*.dc.html` dosyası artı `docs/surec/denetim/`
altındaki denetim bulgularıdır. Plan yazarının paraphrase'i negatif değer üretti.

**2. Bileşen imzalarını diskten oku.** Hiçbir belgeden değil. Paylaşılan primitifler
denetim bulgularına göre yeniden şekillendirildi; her yazılı özet bayat olabilir.

## Yaptığımız hatalardan çıkan kurallar

- Paylaşılan ağaçta **asla `git add -A`**. Bir kez ihlal edildi, iki görevin yarım
  işi alakasız bir commit'e karıştı (`615383b`, adı docs ama içinde 1382 satır kod).
- Paylaşılan bir API'yi değiştiren, **çağrı yerlerini de taşır.** Tüketicileri bozuk
  bırakmak yarım iştir.
- Tasarımda açıklanamayan çeşitlilik varsa **çoğunluğa normalize et**; çeşitlilik
  kasıtlı bir adım olabilirse **ikisini de koru ve adlandır**. Test: farkın gerekçesini
  söyleyebiliyor musun? Asimetrik maliyet: iki varyantı sonra birleştirmek ucuz,
  silineni geri getirmek değil.
- **Çakışan dokunma hedefi, kısa olandan kötüdür.** Kısa hedef görünür biçimde
  başarısız olur; yanlış hedef başarılı olur ama yanlış şeyi yapar.
- **Bir özelliği JS ile yazmaya başlamak, o özelliğin CSS'ini geriye dönük olarak yük
  taşıyan hale getirir.**
- **Kanıtın kendisi de denetlenmeli.** Kullanım matrisi `bicim` başına örnekliyordu,
  örnek başına değil; bu yüzden örnek başına sadakati kanıtlayamıyordu.
- Kısıt listesi tasarımla çeliştiğinde **liste eksiktir**, tasarım yanlış değil. İki
  kez oldu: `#0C0A09` plaka zemini ve `#7A1F2B` Nar aksanı.

## Sahibinin bakması gereken açık maddeler

**Footer dokunma hedefi: KAPANDI** (12 Ağustos, geliştirme turu). Madde aylardır
"44px mi footer ritmi mi" diye açıktı; sahibinin "tasarım tavan değil" kararı
onu çözdü. Ölçüm: **240 hedef tabanı geçiyor, kalan 28'in hepsi dekoratif**
(`BeadRay` boncukları, `aria-hidden` + `tabIndex={-1}`). Yani sitedeki her
gerçek etkileşimli hedef 44px'i karşılıyor.

Kapanan üç grup: `AltBilgi.sayfaLinki` (48 örnek, hedef artık `::before` değil
öğenin kendi kutusu), `UstBar.link` (17 örnek, `min-width`), `AltBilgi.gizlilikLink`
(8 örnek, `inline-block` + `min-width`). Kontrast bu değişiklikten sonra
yeniden ölçüldü, gerçek kalan hâlâ 0.

**Prefetch ilk yüklemede 344 KB indirip atıyor.** Next 16 statik export'ta
`<Link>` prefetch'i önce rota URL'sini istiyor (sunucu tam HTML döndürüyor),
sonra o isteği iptal edip `__next.*.txt` yükünü alıyor. Ölçüldü (ana sayfa, ilk
yükleme): 6 iptal edilmiş istek, 344 KB aktarılmış ve atılmış; gerçekten
kullanılan `.txt` yükü 176 KB. Konsoldaki `net::ERR_ABORTED` yığını hata değil,
Next'in kendi davranışı ve statik export rehberi prefetch'i destekleniyor
sayıyor. `prefetch={false}` bunu kapatır ama istemci gezintisinin anındalığını da
götürür. Mobil veriyle gelen bir misafir için gerçek bir bedel, ama bir hız
kararı: sahibine bırakıldı.

**UX turundan dört karar maddesi** (12 Ağustos, ayrıntı ve ölçüler
`IYILESTIRMELER.md` ile iki UX raporunda):

- **Konum hero'sunun sağ yarısı boş.** Tasarım orada tek sütun çiziyor, yani tek
  başına sapma değildi; kusur hale getiren kendi düzeltmemiz oldu, ana sayfanın
  aynı boşluğu doldurulunca iki hero ayrıştı. **Ertelendi:** harita levhası hâlâ
  yer tutucu, onun etrafında yerleşim kararı vermek erken. Gerçek harita
  entegrasyonuyla birlikte açılacak.
- **Galeri ızgarasında öksüz kare.** 16 kare 3 sütuna diziliyor, sonuncusu tek
  başına kalıyor. Izgara bizden (sayfanın tasarımı yok) ve 16 dörde bölünüyor:
  `minmax(260px,1fr)` 4 sütun verir ama kare 371px'ten 269px'e iner.
  **Ertelendi:** boş çerçevede öksüz satır, gerçek fotoğrafta olduğundan çok
  daha fazla göze batıyor.
- **İngilizce bir yol bozuksa 404 Türkçe geliyor.** `/en/yok-boyle/` `lang="tr"`
  belge, Türkçe başlık ve `/en/` yerine `/` gösteren wordmark döndürüyor.
  `global-not-found.tsx`'in "sınırlama, tercih değil" kaydı sunucu için doğru,
  istemci için değil: `location.pathname` `/en/` önekini görür ve
  `content/en/hata.ts` zaten hazır duruyor, hiç render edilmiyor. Karar: istemci
  tarafı dil anahtarı girsin mi, yoksa tek dilli kalması kabul mü.
- **`aria-disabled` telefon yer tutucularının kontrastı.** Paket şeridinde
  2.62:1, alt bilgi satırlarında 3.14:1. WCAG 1.4.3 etkin olmayan bileşenleri
  muaf tuttuğu için bugün ihlal değil. Numara `content/isletme.ts`'e girdiği an
  bu öğeler `<a>` olup etkinleşecek ve 4.5:1 gerekecek; doldurma turunda hepsi
  birlikte ölçülmeli.

**Kor sahnesi okunmuyor: iki müdahale yapıldı, sahibin onayı bekleniyor.**
Sahibi 12 Ağustos 2026'da bildirdi: kor "pek anlaşılmıyor", daha anlaşılır
olabilir mi.

Ele alırken hangi sorun olduğu ayrıldı, çünkü ikisi zıt yönde düzeltme ister:
kor efektinin kendisi fazla sönük olabilir (çözüm: yoğunluk, ölçek, kontrast
artırmak) ya da kor içeriğin okunurluğunu düşürüyor olabilir (çözüm: tam tersi,
sahneyi geri çekmek). Ölçüm birinciyi seçti ama beklenen sebeple değil:
**parlaklık hipotezi çürüdü**, sahne zemini tepe noktada 95-107 RGB birimi
kaldırıyor, yani sönük değil. Eksik olan taneydi; düz gradyan ekranda kor değil
yumuşak bir ışık havuzu okuyordu.

İki düzeltme uygulandı, ikisi de `IYILESTIRMELER.md`'de kayıtlı:

1. **CSS animasyonlarının hiçbiri koşmuyordu** (`80ad3b6`, aşağıda "En büyük
   bulgu"). Gözlemin bir kısmının sebebi buydu.
2. **Kor yatağı taneleşti** (`1451063`): tasarımın iki düz radial gradyanına
   maskeli ızgaralarla 4px ve 6px kareler açan bir katman eklendi. Yön markanın
   kendi sözlüğünden geldi (`TaneDizilimi`, wordmark, "tavla zarı kadar"),
   uydurulmadı. Kontrast değişmedi, hareket azaltılmışta 13 rotada 0 koşan
   animasyon, yeni renk yok.

**Açık kalan: sahibi bakıp "şimdi okunuyor" diyecek mi.** İki müdahaleden sonra
gözlemin kapanıp kapanmadığı sorulmadı.

**Gece şeridi gereksiz görünüyor.** Sahibi 12 Ağustos 2026, 01:07'de bildirdi: üst
bardaki ince şerit ("Gece açığız, ocak yanıyor") anlaşılmıyor, aynı şey zaten aşağıda
yazıyor. Gözlem doğru: 01:00-05:00 arası aynı olgu üç kez söyleniyor.

| Nerede | Metin |
|---|---|
| `GeceSeridi` (üst bar) | Gece açığız, ocak yanıyor |
| `DurumCipi` (hero) | Şu an açığız |
| `DurumAltMetni` (hero) | Ocak 05:00'e kadar yanıyor |

Şerit tasarımdan geliyor (`Ana Sayfa Alternatif.dc.html:44`) ve yalnız gece
görünür, bu yüzden gündüz yapılan hiçbir incelemede ortaya çıkmadı.

**Bu madde kapandı.** Üçüncü seçenek uygulandı: `lib/kabuk.ts` >
`geceSeridiGosterilirMi()` şeridi yalnız hikaye, gizlilik ve galeride gösteriyor.
Ölçüt sayfa kimliği değil, o rotada başka canlı gösterge olup olmadığı; ana,
menü ve konumda hero durum çipi ile canlı saat zaten aynı şeyi söylüyor. Tekrar
çözüldü, tasarımın niyeti korundu. `kabuk.test.ts` kuralı kilitliyor.

**"Kor fazla" okumasının bir yarısı da 12 Ağustos'ta kapandı** (commit `4f8b085`).
Kabuk on rotanın hepsine ana sayfanın sahnesini basıyordu; tasarımda iç sayfaların
kendi sönük sahnesi var (kor `.55`, çekirdek `.26`, iki duman pufu, sabit). Bu bir
porting hatasıydı ve ölçülebilir bir sonucu vardı: iç sayfalarda krem `.78` gövde
metni 4.34:1 ile AA'yı geçmiyordu. Yani "kor fazla" okumasının bir kısmı gerçek bir
hataymış.

`ImlecKoru` **bağlandı** (mobil turu): `KorSahnesi.tsx:65`, `{anaMi && <ImlecKoru />}`,
yani sahnenin içinde ve yalnız ana sayfada, tasarımdaki gibi (`Ana:31`).

`GizlilikSayfasi`'nın krem `.86` sapması **12 Ağustos'ta kapandı**: sönük sahneye karşı
yeniden ölçüldü, tasarımın `.78`'i en kötü durumda 6.97:1 (390px) ve 8.51:1 (1440px)
veriyor, sayfa tasarımın değerine döndü.

Bugünkü zemin, karar verirken ölçülecek yerler: `components/ember/KorSahnesi.tsx`
(yoğunluk takibi `lib/cerceve.ts`'ten geliyor), bölüm başına `data-yogunluk`
katsayıları (acilis 1, iddia 0.55, ocaktan 0.4, ikram 0.7, gece 1.25, bozo 0.45,
konum 0.3) ve `styles/tokens.css` içindeki `--kor-leke*` ailesi. Yoğunluk merdiveni
tasarımdan birebir alındı; değişirse `iyilestirmeler.md`'ye gerekçesiyle yazılır.

## İşletmeden bekleyen veriler

Fiyatlar, telefon, WhatsApp, Instagram, e-posta, harita koordinatı, dalak ve yürek
porsiyon detayları, gece menüsü kalemleri, içecek listesinin tamamı, fotoğraflar
(16 kare), onaylı logo, alan adı. Hepsi `content/` altında `null` ve tek noktadan
doldurulacak biçimde duruyor. Uydurulmuş bir değer yayına çıkmaz.

**Site ikonu (favicon).** Her sayfada konsola bir favicon 404'ü düşüyor; `app/` altında
ikon dosyası yok. Marka paketinde de yok: `design_handoff_bozo_website/marka/` yalnız
iki markdown taşıyor ve logo kararı işareti sözle tarif ediyor ("şiş kilidi": uçlu ve
halka saplı bir çubuk üzerinde 4 ciğer ve 2 kuyruk yağı tanesi), çizilmiş bir dosya
vermiyor. Geçici emoji veya jenerik ikon konmadı. Onaylı işaret geldiğinde
`app/icon.svg` + `app/apple-icon.png` eklenir; Next bunları kendisi bağlar.

## Bilinen ve kabul edilen çıktı davranışları

**`/_not-found/` ve `/404/` de 200 dönüyor.** Statik export `out/404.html` yanında
`out/404/index.html` (bunu `trailingSlash: true` üretiyor) ve `out/_not-found/index.html`
(bunu Next'in kendi iç rotası üretiyor, derleme rota tablosunda `/_not-found` satırı
olarak görünür) yazıyor. Üçü bayt bayt aynı, üçü de `<meta name="robots" content="noindex">`
taşıyor ve `sitemap.xml`'de hiçbiri geçmiyor, yani indeksleme sızıntısı yok. Next'in
statik export rehberi yalnız `404.html`'i sayıyor ama fazladan kopyaları da yasaklamıyor;
derleme sonrası dosya silen bir adım eklemek `noindex` zaten varken bedelsiz kazanç
sağlamıyor. Kayıtlı, düzeltilmedi.

## Sahibinin verdiği kararlar

- Commit'lerde asistan imzası yok (12 Ağustos 2026). **Geçmişteki 54 imzalı commit
  olduğu gibi kalır**, geçmiş yeniden yazılmaz: repoyu sahipten başkası görmüyor.
  Kural yalnız bundan sonrası için geçerli.
- Repo: `github.com/crimsoninnovate/bozo`

- Alan adı `cigercibozo.com` varsayılır (`lib/site.ts`, `SITE_URL`)
- Yapısal veride `addressCountry` = `CY`, görünen adres metni `KKTC` kalır
- `Usül` yazımı `Usul` olarak düzeltildi
- `Girne Macro Market, 80 m` mesafe iddiası kaldırıldı, ad kaldı
- Handoff bir taslak; iyileştirme yapılabilir ama kayıtlı olmak zorunda
- Tasarım ve hareket denetimi (Task 16) tüm yapı kurulduktan **sonra** çalışır

## Doğrulama komutları

    npm run typecheck
    npm test              # 18 Ağustos 2026: 111 test
    npm run build         # rota tablosunda `gecici-` ile başlayan rota olmamalı

`docs/PARITE.md` yeniden koşulabilir kontrol listesidir; ölçüm kuralları
bölümünü **okumadan** kontrast ya da dokunma hedefi ölçme, listedeki yedi kural
yedi ayrı sahte sonuç kaynağını kapatıyor.

## DEVAM.md'den taşınan durum kayıtları (24 Ağustos - 10 Ekim 2026)

13 Ekim 2026'da DEVAM.md kısaltılırken buraya alındı; yazıldıkları günün halidir.

- **Skor sunucusu canlıda ve isim alma açık** (10 Ekim 2026): `api.cigercibozo.com`, systemd `bozo-oyun`,
  MariaDB, gizlilik metni güncel (sahibi hukukçu incelemesini istemedi). Kurulum, sırların yeri ve
  güncelleme: `SUNUCU-CANLIYA-ALMA.md`. Aynı gün yayına çıkanlar: sürükleme hatası (geçersiz bırakışta
  öğe elde asılı kalıyordu), alma penceresi %20 geniş (çırak botu %59 → %73), rehberde sabır ve çöp
  adımları, girişte "Nasıl Oynanır". `/oyun/` hâlâ `noindex`, bağlantısız. Eksik: gerçek telefonda kare
  ölçümü; Md. 8/Md. 11 işlemleri sahibinde. Personel ekranı `/oyun/yonetim/` eklendi (kod onayı, ilk 20,
  ad gizleme, tur doğrulama; `SUNUCU-CANLIYA-ALMA.md`); görsel tur oynatıcı ve sayaç ekranı yok.
- **Oyun: tabak akışı canlıda** (9 Ekim 2026, `8235636`, `/oyun/` ve `/en/oyun/`, `noindex, nofollow`, bağlantısız, sitemap'te yok) (spec `docs/specs/2026-10-09-oyun-tabak-akisi-design.md`,
  plan `docs/plans/2026-10-09-oyun-tabak-plani.md`, on beş görev, `feat/site-kurulumu` dalında). Fiş,
  ocak, tabak, misafir: dokunarak ya da sürükleyerek oynanır, ilk tur rehberli, takma ad isteğe bağlı
  (giriş ekranında, yalnız sunucu ayaktayken görünür). Simülasyon, botlar, tavan, axe 0 ve kare p95
  `IYILESTIRMELER.md` > tabak akışı bölümlerinde. 375 x 548 gibi çok kısa ekranlar desteklenmiyor
  (ölçüm aynı yerde).
- **9 Ekim 2026 01:40: oyun prototipi canlıya alındı (önceki sürüm)** (`a9caf09`, tüm dal rsync ile): `/oyun/`,
  `/en/oyun/`, `/oyun/siralama/` 200, `noindex, nofollow`, sitemap'te yok, hiçbir sayfadan bağlantı
  yok (yalnız bağlantıyı bilen girer). `plesk repair fs` 0 hata. Skor sunucusu **yayında değil**:
  `api.cigercibozo.com` DNS'te yok, oyun çevrimdışı tur olarak çalışır, tarayıcı o alan adına istek
  dener ve düşer (veri gitmez). Gizlilik metni ve avukat onayı öncesi sunucu açılmaz (plan 4).
- **Oyun refine turu 2 (9 Ekim 2026), görselden bağımsız katman:** açılışta kamera yaklaşması,
  rozet arkasında duman, hazır olunca nabız atan Oyna; tahta kurulurken istasyonlar sırayla
  yükselir; oda ışığı titrer; dokunma bastır ve yaylan; fiş tamamlanınca bakır kıvılcım patlaması,
  dönüm noktasında kısa sarsıntı; imleç/telefon eğimiyle üç derinlikte parallax (`useEgim`).
  Hepsi CSS ya da WAAPI, azaltılmışta kapalı. Kare p95 17,4-18,1 ms (ölçüm titreşimi içinde).
  **Bekleyen:** sahibin ürettiği raster varlıklar (`docs/surec/OYUN-VARLIK-BRIEFI.md`); gelince
  SVG parçalar onlarla değişir, bu katman aynen kalır.
- **Oyun refine turu 1 (9 Ekim 2026):** her ürün kendi biçim ve rengiyle (ciğer tuğla küp, dalak
  mor fasulye, yürek kalp, ayran bakır maşrapa), pişme izli ve kömür çatlaklı şiş hâlleri,
  gruplu fiş (`fisSatirlari`, adet rozeti, onay işareti), bakır tabaklar, nefes alan köz
  yatağı, alev dilleri, şiş titremesi ve duman telleri (CSS, azaltılmışta kapalı). Kare süresi
  aynı (p95 17,9 ms, CPU 4x). Sesler: beş bip yerine on bir katmanlı Web Audio sesi (dosya yok,
  `lib/oyun/ses.ts`); 40 sn'lik oyunda 68 osilatör, 14 gürültü kaynağı, hata yok; gerçek kulakla
  dinlenmedi. **Sıradaki:** nasıl oynanır sorusu
  (spec §1 "yok" diyor; sahibin kararı), etiket kontrastı, görsel sadakat karşılaştırması.
- **Açılış oyunu, sahne planı bitti: boyalı illüstrasyon** (karar belgesi
  `docs/specs/2026-10-08-oyun-sahne-birlestirme-design.md`, plan
  `docs/plans/2026-10-08-oyun-sahne-plani.md`). Handoff'un gradyan ve filtreleri tek
  `SahneDefs`te (kimlik testi), sahne `Sahne*` modüllerinde, HUD görünür duyuru satırıyla,
  giriş ve sonuç cam panelsiz, masaüstünde 420 px panel. Simülasyon, sunucu, `ciz.ts`
  sözleşmesi değişmedi. "Değişen ne" listesi ve ölçümler `IYILESTIRMELER.md` > 9 Ekim 2026.
  K10 kare süresi ölçüldü (p95 18,0 ms 4x, kare düşmedi). **Açık:** etiket kontrast
  ölçümü, sahibine önce/sonra vitrin karşılaştırması ve refine turları. Yayında değil.
- **Açılış oyunu, plan 3 bitti: skor sunucusu ve sıralama** (spec §6-§10, §16; plan
  `docs/plans/2026-10-08-oyun-plan-3-sunucu.md`). `sunucu/` npm workspace: `node:http`, tek
  bağımlılık `mariadb`, `simule` ile yeniden oynatma, tavan, 15 dk tek kullanımlık jeton, hız
  sınırı, Cloudflare IP, dönem kapanışı (Pazartesi 05:00 Girne) ve ödül kodları, gece silme,
  `/yonetim/*` temel kimlikle. Sitede "önce oyna, sonra kaydet": katılım ekranı, sonuçta
  haftalık sıra, `/oyun/siralama/` (TR ve EN), "Hesabımı sil", çevrimdışı tur. Yönetim
  arayüzü sayfası ve paylaşım kartı plan 4'te. **Yayında değil ve yayınlanamaz:** gizlilik
  sayfası hâlâ "site kendi sunucusunda ziyaretçi verisi saklamaz" diyor; plan 4'ün gizlilik
  değişikliği ve hukukçu onayı olmadan sunucu açılmaz.
- **Açılış oyunu, plan 2 bitti: görsel ve ses dili `/oyun/`** (spec
  `docs/specs/2026-10-08-oyun-design.md` §12-§13 ve §15; plan
  `docs/plans/2026-10-08-oyun-plan-2-gorsel-dil.md`). Kor zemin üstünde cam panel, elle çizilmiş
  SVG semboller, WAAPI tepkiler, Motion ekran geçişleri, Web Audio ses (varsayılan kapalı),
  klavye kısayolları ve canlı bölge. Simülasyon değişmedi (altın kayıtlar aynı). Sunucusuz,
  noindex, menüde yok; **yayında değil**. Ölçüldü: CPU 4x 390 px'te p95 17,5 ms, düşen kare 0;
  320/390/1440 taşma yok, axe 0. Sırada kaba prototip testi (spec §16) ve plan 3 (skor
  sunucusu). Sahibine açık kararlar spec §19'da.
- **8 Ekim 2026 turu deploy edildi** (`2d278d6` Maps Place ID, `def4362` ciğer 12 şiş,
  `04c3284` fiyat listesi; `IYILESTIRMELER.md` > 8 Ekim 2026). `plesk repair fs` 0 hata,
  `--checksum` kuru koşuda 0 içerik/boyut farkı (yalnız beklenen `og` sahiplik gürültüsü).
  Canlıda doğrulandı: 12 rota 200, yeni fiyatlar iki dilde, canlı yol tarifi linki Maps'te
  "varış: Ciğerci Bozo" açıyor (önce "Kıbrıs İnşaat").
- **İkinci 8 Ekim deploy'u** (`1f092a7` yarım porsiyon cümlesi, `9568c58` İngilizce tur) 15:45
  build'i ile yayında: dört rotanın canlı HTML'i yerel `out/` ile aynı SHA-256, on iki rota 200.
  165 test, typecheck, build temiz. Commit'ler GitHub'a push edilmedi.
- **Üçüncü 8 Ekim deploy'u:** `b99247c` çerez bandı metni kısaldı (`IYILESTIRMELER.md` >
  "çerez bandı metni kısaldı"). `plesk repair fs` 0 hata, `--checksum` 0 içerik farkı, on iki
  rota 200, canlı bantta yeni metin ve düğmeler, onaysız GA yok. 166 test.
- **Dördüncü 8 Ekim deploy'u:** `43d357c` rozet gölgesi ayrı katmanda (canlı mobil LCP üç soğuk
  ölçümde 2528/2568/2860 ms, LCP = FCP, önce 2906) ve `8dcbfaa` site artık "Uygulamayı yükle"
  önermiyor (manifest `display: browser`, `mobile-web-app-capable` yok). Checksum 0 fark.
- **Beşinci 8 Ekim deploy'u (17:52):** `67ab32e` çekmece alt metni ve genel kontrol turu
  (`dca5670`..`c9eeccf`: next 16.3.8, galeri LCP, çekmece numaraları, Gizlilik hedefi, aksiyon
  barı landmark'ı, kelime markası, JSON-LD kaçışı, ölü kod, portre yayından kalktı, güvenlik
  ve önbellek başlıkları; `IYILESTIRMELER.md` > "tam kapsam genel kontrol"). `repair fs` 0
  hata, `--checksum` 0 içerik farkı, 12 rota 200, beş rotanın HTML'i yerel `out/` ile aynı.
  Canlıda dört güvenlik başlığı var, portre 404. Galeri LCP'si değişmedi (3,26-3,46 sn,
  görselin boyutu). Commit'ler GitHub'a push edilmedi.
- Branch `feat/site-kurulumu`. **SEO/AEO turu deploy edildi (24 Ağustos 2026): son commit
  `5f1d3ee`**, arc'a gönderildi ve `--checksum` ile içerik birebir doğrulandı (`plesk repair fs`
  0 hata; kuru koşuda dönen tek fark sahiplik/grup bayrağı — yerel makinede `engincaglar`
  kullanıcısı olmadığı için beklenen gürültü, checksum/boyut farkı yok). Canlıda ayrıca
  doğrulandı: `/llms.txt` 200 ve `content-type: text/plain; charset=utf-8`, `sitemap.xml`'de
  12 `<priority>`, ana sayfa 1 / `/menu/` 3 JSON-LD `<script>`, title'lar eşleşiyor.
- **Site kendi alan adında ve arama motorlarına açık:** `https://cigercibozo.com`.
  `X-Robots-Tag` 24 Ağustos'ta silindi. `www` 301 ile apex'e gidiyor, sertifika Let's Encrypt.
- **Yayın hedefi 20 Ağustos'ta arc sunucusuna taşındı** (`arc.megaonline.net`, Plesk,
  `/var/www/vhosts/cigercibozo.com/httpdocs`). Researchos artık deploy almıyor; oradaki demo
  (`bozo.crimsoninnovate.com`) eski sürümde donmuş durumda. Yordam `README.md` > Publishing.
- GA4 (`G-N3893E7B1P`) opt-in onayın arkasında (`CerezOnayi`), gizlilik sayfası 89/2007'ye göre.
- On iki rota (altı sayfa, iki dil) 200 dönüyor, yatay taşma yok, konsol temiz.

### Son turda ne değişti (24 Ağustos, SEO/AEO turu)

- **On iki rotanın `<title>`/açıklaması genişletildi**, hepsi sitede zaten canlı olan metinden
  kuruldu (`content/*/ortak.ts` > `sayfaMeta`), yeni pazarlama metni uydurulmadı.
- **İki yeni JSON-LD üreticisi** `lib/jsonld.ts`'e eklendi: `menuJsonLd(dil)` (`Menu` şeması,
  `Kabuk`'ta yalnız `/menu` rotasında basılıyor; final review sonrası site geneli değil, bkz.
  `IYILESTIRMELER.md`) ve `breadcrumbJsonLd(anahtar, dil)` (`BreadcrumbList`, `Kabuk`'ta ana
  sayfa dışındaki her rotada). İki ana sayfa tek `<script type="application/ld+json">` taşır
  (`Restaurant`), iki menü sayfası üç (`Restaurant` + `Menu` + `BreadcrumbList`), diğer sekiz
  rota iki (`Restaurant` + `BreadcrumbList`); hepsi geçerli JSON, ölçüldü.
- **`app/sitemap.ts` her URL'i `lastModified`/`changeFrequency`/`priority` ile damgalıyor.**
- **`lib/llmsTxt.ts`**, yapay zeka/cevap motoru tarayıcıları için build zamanında bir olgu özeti
  üretiyor; `/llms.txt`'te (`app/llms.txt/route.ts`) yayında, okunur metin ve işlevsel linklerle.
- Test sayısı 138'den 154'e çıktı (6 `menuJsonLd` + 5 `breadcrumbJsonLd` + 5 `llmsTxt` testi).
  `npm run typecheck`, `npm test`, `npm run build` üçü de temiz; on iki rota 200 dönüyor, konsol
  temiz (`hikaye` sayfalarındaki font/CSS preload uyarıları bu turun ürünü değil, dokunulan
  dosyalardan hiçbiri font/preload/CSS parçalama ile ilgili değil).
