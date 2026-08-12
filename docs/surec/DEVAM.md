# Devam noktası

Bu dosya, bağlam sıfırlandıktan sonra işe kaldığı yerden devam etmek için tek giriş
noktasıdır. Önce bunu oku, sonra buradan dallan.

Son güncelleme: 12 Ağustos 2026, 02:30

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
4. `docs/surec/IYILESTIRMELER.md`: tasarımdan her sapma, gerekçesiyle
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

**Footer dokunma hedefi.** Üç hedef, üçü de 44px'in altında, hiçbiri çakışmıyor ve
hiçbir dokunuş yanlış satıra gitmiyor:

| Hedef | Yükseklik | Nerede |
|---|---|---|
| `tam` footer iletişim satırı | 28px | `AltBilgi.module.css:278` |
| `sayfalar` footer sayfa bağlantısı | 26px | `AltBilgi.module.css:161` |
| `sayfalar` footer telefon bağlantısı | 26px | `AltBilgi.module.css:183` |

28px'i 44px'e çıkarmak `.kolon`'un `gap` değerini 13px'ten yaklaşık 29px'e taşımayı
gerektiriyor, bu da görünür bir footer yeniden düzeni; 26px'lik ikisi için gerekçe
`kabuk-turu-report.md:343-349`'da kayıtlı. Tek başına yapılmadı. 44px mi footer ritmi
mi öncelikli, Task 16'da veya yayın öncesi karara bağlanacak.

**Kor sahnesi okunmuyor.** Sahibi 12 Ağustos 2026'da bildirdi: kor şu an "pek
anlaşılmıyor", daha anlaşılır olabilir mi. Sayfaların tamamı kurulduktan sonra,
**Task 16'da** ele alınacak; sahibi açıkça en sona bıraktı.

Ele alırken önce hangi sorun olduğu ayrılmalı, ikisi zıt yönde düzeltme ister:
- kor efektinin kendisi fazla sönük, arkada ne olduğu okunmuyor (çözüm: yoğunluğu,
  ölçeği veya kontrastı artırmak)
- kor içeriğin okunurluğunu düşürüyor (çözüm: tam tersi, sahneyi geri çekmek)

**Gece şeridi gereksiz görünüyor.** Sahibi 12 Ağustos 2026, 01:07'de bildirdi: üst
bardaki ince şerit ("Gece açığız, ocak yanıyor") anlaşılmıyor, aynı şey zaten aşağıda
yazıyor. Gözlem doğru: 01:00-05:00 arası aynı olgu üç kez söyleniyor.

| Nerede | Metin |
|---|---|
| `GeceSeridi` (üst bar) | Gece açığız, ocak yanıyor |
| `DurumCipi` (hero) | Şu an açığız |
| `DurumAltMetni` (hero) | Ocak 05:00'e kadar yanıyor |

Şerit tasarımdan geliyor (`Ana Sayfa Alternatif.dc.html:44`) ve yalnız gece
görünür, bu yüzden gündüz yapılan hiçbir incelemede ortaya çıkmadı. Task 16'da
karara bağlanacak. Seçenekler: şeridi kaldırmak, hero'nun alt metnini gece
saatlerinde susturmak, ya da şeridi yalnız ana sayfa dışındaki rotalarda göstermek
(orada hero durum satırı yok, tekrar da yok). Üçüncüsü tekrarı çözerken tasarımın
niyetini de korur, ama ölçülmeden karar verilmemeli.

**Bu maddenin bir yarısı 12 Ağustos'ta zaten kapandı** (commit `4f8b085`). Kabuk on
rotanın hepsine ana sayfanın sahnesini basıyordu; tasarımda iç sayfaların kendi sönük
sahnesi var (kor `.55`, çekirdek `.26`, iki duman pufu, sabit). Bu bir porting hatasıydı
ve ölçülebilir bir sonucu vardı: iç sayfalarda krem `.78` gövde metni 4.34:1 ile AA'yı
geçmiyordu. Yani "kor fazla" okumasının bir kısmı gerçek bir hataymış. **Ana sayfanın
sahnesi değişmedi**, sahibinin gözlemi oraya bakıyorsa hâlâ açık.

Bağlı bir iş kaldı:
- `components/ember/ImlecKoru.tsx` Task 5'te yazıldı ama **hiçbir yere bağlanmadı**.
  Tasarımda o katman sahnenin içinde ve yalnız ana sayfada (`Ana:31`, `data-imlec`).
  Bağlanması mobil turunun işi; z-index ve sahne kabına göre konumu ölçülmeli.

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
    npm test              # şu an 60 test
    npm run build         # rota tablosunda `gecici-` ile başlayan rota olmamalı
