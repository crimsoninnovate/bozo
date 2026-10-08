# Ciğerci Bozo web sitesi · açılış oyunu spec

Tarih: 8 Ekim 2026 · Durum: tasarım kullanıcı onaylı (üç bölüm), spec incelemede

Taslaklar: oyun kurgusu Fable 5.1 ile yazıldı, tasarımcı eleştirisiyle revize edildi;
mimari ayrı onaylandı. Bu belge ikisinin birleşik ve bağlayıcı hâlidir.

## 1. Bağlam ve amaç

Açılış döneminde sitede ödüllü bir oyun. Masadaki QR koddan ve Instagram'dan gelen kişi
markayı duysun, eğlensin, skor tablosuna girip ödül kazansın. Ödül sıralamaya göre verilir
(haftanın ilk 3'ü); çekiliş yoktur.

**İlke: yalın.** Bir mod, bir tur, bir skor tablosu. XP, seviye, dükkan, yükseltme, karakter,
"nasıl oynanır" ekranı, günlük görev yok.

**Başarı ölçütleri** (hepsi oyunun kendi sunucusunda sayılır, GA'ya oyun olayı gitmez; ilk
hafta taban ölçümüdür, hedefler o tabana göre yazılır):

| Ölçüt | Karar kuralı |
|---|---|
| Tur sayısı / hafta, kanala göre (`sofra`, `ig`, `yok`) | Taban. QR payı %30 altıysa sofra kartı yeniden tasarlanır |
| Sıralamaya katılan oyuncu | Taban |
| Geri dönüş: aynı oyuncu ≥ 2 ayrı gün | %25 altıysa ödül ve duyuru gözden geçirilir |
| Geceyi tamamlayan tur (05:00) | %5-15 bandı; dışındaysa evre 4-5 ayarı |
| Paylaşım | Taban |
| Ödül kodu kullanımı | Her haftanın 3 kodundan kaçı sofraya geldi |

## 2. Konsept

Çalışma adı **Sofra Yetiştir** (ad sahibinin kararı, §19). Kebap World türünde sipariş
yetiştirme oyunu; ocak istasyonunda çevirme zamanlaması. Kurallar menü metninden gelir:

- "Sofra kurulu gelir, istemenize gerek yok" (`content/tr/menu.ts` > `ikramlar.altMetin`)
- "Şişlerden önce gelir" (lebeni)
- "Dört ciğer, iki kuyruk yağı"; bir ciğer porsiyonu 12 şiş
- Bozo Karışık: ciğer, dalak, yürek bir arada
- "05:00 · son tane, ocak söner", "Girne uyurken ocak yanıyor"

**Referans:** oldschool.com.tr "Necati's Night Shift". Alınan: takma ad kuralları, isimsiz
oyun, tarayıcıya bağlı hesap uyarısı, son şampiyon satırı. Alınmayan: ad ("Night Shift"),
kedi ve rüzgar engelleri, arcade kabini, karakter. Bizde fazlası: her tur sunucuda yeniden
oynatılır, gizlilik ve kurallar metni, paylaşım kartı.

## 3. Görünüm ve kontrol

Telefon dikey, kuşbakışı ocakbaşı tezgahı. Yukarıdan aşağı: HUD, sofralar, ocak, tezgah ve
ayran, raf. **Misafir karakter değildir, sofradır:** üstten kare sofra, içinde sipariş fişi
(ikonlar), çevresinde sabrı gösteren **kor halkası**.

Yalnız dokunma; sürükleme ve uzun basma yok. Her hedef gerçek bir `<button>`. Girdi
`(tik, hedef)`.

| Hedef | Durum | Ne olur |
|---|---|---|
| Sofra | kurulmamış | **Kurulur**: ikram tabakları iner, lebeni önce. Sabrın %15'i geri gelir |
| Sofra | kurulu | Tezgahta fişle eşleşen her şey servis edilir. Fiş tamamsa sofra öder, 30 tik sonra kalkar |
| Raf (Ciğer, Dalak, Yürek) | boş ocak yuvası var | Şiş ilk boş yuvaya iner, pişmeye başlar |
| Raf | ocak dolu | Raf sallanır, durum değişmez |
| Ocaktaki şiş | çevrilmemiş | **Çevrilir.** Çevirme bandındaysa tam kıvam mümkün kalır; değilse şiş en fazla "iyi" olur |
| Ocaktaki şiş | çevrilmiş, hazır değil | Etkisiz |
| Ocaktaki şiş | alma penceresinde | Tezgaha alınır (tezgah doluysa etkisiz, tezgah dolu işareti yanar) |
| Ayran | boş | Açık yayıktan bakır maşrapa dolar (60 tik), dolunca tezgaha geçer |
| Tezgah ürünü | her zaman | Onu isteyen sofralar parlar; durum değişmez |

**Hiçbir dokunuş geri alınamaz zarar vermez.** Zarar yalnız ihmalden gelir: alma penceresi
geçen şiş **yanar** (−50), tezgahta 10 sn bekleyen şiş **soğur** (−30), sabrı biten sofra
**kalkar** (−200). Ayran soğumaz.

**Sofra kurma kuralı.** Kurulmamış sofranın halkası iki kat hızlı tükenir. Kurulmamış sofraya
servis dokunuşu önce sofrayı kurar: "lebeni şişlerden önce gelir" çiğnenemez, öğretilir.

**Pişme ve çevirme.** Her yuvada ince bir ray: ortada bakır **çevirme çentiği**, sonda bakır
**alma bandı**, onun ortasında daha parlak **tam kıvam bandı**. Tane rengi krem (çiğ) → bakır
(pişti) → kömür (yandı). Tam kıvam = şiş çevirme bandında çevrildi **ve** tam kıvam bandında
alındı. Çevirmek zorunlu değildir: acemi çevirmeden servis eder ve "iyi" alır, usta her şişi
çevirip tam kıvam toplar.

- Çevirme bandı: pişme süresinin %50 noktasında ortalanmış, genişliği tam kıvam bandıyla aynı.
- Alma penceresi: hazır anından başlar, süresi evreye göre (§5). Sonunda şiş yanar.
- Tam kıvam bandı: alma penceresinin ortasında.
- Pişme süresi ürüne göre: ciğer ×1,0, dalak ×0,75, yürek ×1,25 (tamsayı tike yuvarlanır).

**Bitiş.** Üç sofra servis alamadan kalkarsa gece biter ("üç sofra kalktı"). Yoksa 05:00'te
ocak söner ve gece tamamlanır.

**İlk 10 saniye, metinsiz.** Gecenin ilk misafiri her turda aynıdır ve tohumdan bağımsızdır:
tek sofra, fişte tek ciğer, halkası tükenmez (kaybedilemez). Tarayıcıdaki **ilk turda** sırayla
sofra, raf, şiş ve sofra üstünde bir kor noktası ipucu belirir; ikinci misafirdeki ayranda bir
kez daha. Sonraki turlarda ipucu yoktur. Tek yazı: raf etiketleri ve rakamlar.

## 4. Zaman ölçekleri

| Ölçek | Süre | Döngü |
|---|---|---|
| An | 0,3 sn | dokun → aynı karede tepki |
| Fiş | 10-20 sn | sofra gelir → kur → piş, çevir → al → servis → kalkar |
| Tur | 120 sn | 21:00'den 05:00'e beş evre; bir oyun saati 15 sn |
| Bir tur daha | 0 sn | tek dokunuşla yeni gece; sonuçta kişisel en iyiye kalan fark |

## 5. Zorluk ve zorluk bütçesi

60 tik/sn, tur 7.200 tik. Değerler kaba prototipte ayarlanacak başlangıç değerleridir.

| Evre | Saat | Tik | En çok sofra | Ocak | Misafir aralığı | Fiş boyu | Yeni | Ciğer pişme | Alma penceresi | Tam kıvam bandı | Sabır |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 21-22 | 0-900 | 1→2 | 3 | yönlendirmeli | 1-2 | Ciğer, Ayran | 4,0 sn | 2,0 sn | 500 ms | 30 sn |
| 2 | 22-00 | 900-2700 | 2 | 3 | 8 sn | 1-2 | Dalak | 3,5 sn | 1,8 sn | 450 ms | 26 sn |
| 3 | 00-02 | 2700-4500 | 3 | 4 | 6 sn | 2-3 | Yürek | 3,0 sn | 1,6 sn | 400 ms | 22 sn |
| 4 | 02-04 | 4500-6300 | 4 | 4 | 4,5 sn | 2-3 | Bozo Karışık | 2,6 sn | 1,4 sn | 350 ms | 18 sn |
| 5 son saat | 04-05 | 6300-7200 | 4 | 4 | 3,5 sn | 2-4 | puan ×2 | 2,2 sn | 1,2 sn | 300 ms | 15 sn |

Tezgah 4 yuva. Bozo Karışık fişi ciğer, dalak ve yürek şişini birlikte ister. Raf düğmesi
ürünün evresi başlayınca belirir; ayran istasyonu dolarken dokunma etkisizdir.

**Zorluk bütçesi.** Her tur yeni bir gecedir ama zorluğu sabittir. Değişmez: her evrede
misafir sayısı ve fişlerdeki ürünlerin toplam kümesi her tohumda aynıdır. Tohum yalnız
misafirlerin sırasını, hangi fişin hangi sofraya düştüğünü ve geliş anını (aralığın ±%20'si
içinde) belirler. Kısıt: iki Bozo Karışık art arda gelmez. Bütçe tablosu simülasyon
modülünde tek yerde tanımlanır.

## 6. Puan

Hepsi tamsayı; sunucu aynı tabloyu oynatır.

| Olay | Puan |
|---|---|
| Tam kıvam şiş / iyi şiş / ayran | 150 / 100 / 40 |
| Fiş tamam, sabır bonusu | floor(200 × kalan sabır / toplam sabır) |
| Fiş ödemesi | (kalemler + sabır bonusu) × kombo çarpanı × (evre 5 ise 2) |
| Kombo çarpanı | kesintisiz tamam fiş sayacı: 0-2 ×1, 3-5 ×2, 6-8 ×3, 9+ ×4. Çarpan ödemeden önceki sayaçtan okunur, ödemeden sonra sayaç 1 artar |
| Kombo düşüşü | yanık veya soğuma: sayaç bir alt kademenin başına iner (7 → 3); sofra kalktı: 0 |
| Bir porsiyon rozeti | servis anında sayılan art arda 12 tam kıvam şiş: +500, sayaç sıfırlanır; iyi şiş, yanık veya soğuma diziyi bozar |
| Gece tamam (05:00) | +1000 |
| Ceza (çarpansız) | yanık −50, soğuma −30, sofra kalktı −200 |

**Tavan.** Bütçe sabit olduğu için her tohumun üst sınırı hesaplanabilir (her şiş tam kıvam,
tam sabır, en hızlı kombo, rozetler, gece tamam). Sunucu bu sınırın üstünü reddeder.

**Beraberlik:** puan → tam kıvam sayısı → kalkan sofra azlığı → önce gönderen.

## 7. Yarışma ve ödül

| Karar | Seçim |
|---|---|
| Dönem | Haftalık. Pazartesi 05:00 Girne saatinde sıfırlanır |
| Sayılan skor | Oyuncunun o haftaki en iyi turu |
| Kazanan | Haftanın ilk 3'ü, kademeli ödül (§19) |
| Teslim | Kazananın tarayıcısında 6 haneli kod; sofrada gösterilir, personel yönetim ekranında onaylar; 14 gün geçerli, hamiline. Kod ekranı "ekran görüntüsünü al" der |
| Sınır | Bir kişi haftada bir ödül; teslimde yüz yüze görülür |
| Duyuru | Pazartesi Instagram hikayesi: takma ad ve puan |
| Final | Yok. Şüpheli skorda personel kazanandan sofrada bir tur ister |

**Önce oyna, sonra kaydet.** Her tur başında sunucudan kimliksiz bir jeton alınır (tur kimliği
ve tohum, 15 dakika). Sıralamaya katılmamış oyuncunun skoru tarayıcıda hesaplanıp gösterilir;
sonuç ekranındaki "Bu skoru sıralamaya yaz" katılım ekranını açar, katılınca o tur gönderilir.
Katılmış oyuncunun turu kendiliğinden gönderilir. Sunucuya ulaşılamazsa tur yerel tohumla
oynanır, "çevrimdışı tur" olarak işaretlenir ve sıralamaya giremez.

## 8. Oyuncu verisi ve gizlilik

**Sunucu İstanbul'dadır** (arc, DH Bulut Bilişim). Saklanan her kişisel veri 89/2007 Md. 11
anlamında yurt dışına aktarımdır.

| Durum | Sunucuda tutulan |
|---|---|
| Katılmamış oyuncu | Yalnız 15 dakikalık tur jetonu; kişisel veri yok. Kanal sayımı kimliksiz günlük sayaçta |
| Katılmış oyuncu | Takma ad, tarayıcı anahtarının özeti, onayın zamanı ve metin sürümü, turlar (puan, dokunuş kaydı, tohum, kanal, zaman) |
| Kazanan | Ödül kodunun özeti, geçerlilik, kullanıldı işareti |

Telefon, gerçek ad, e-posta toplanmaz. Uygulama IP yazmaz; hız sınırı yalnız bellekte.

**Katılım ekranı** tek amaçlıdır: "Takma ad" alanı, verinin Türkiye'deki sunucuda tutulduğunu
ve takma adın herkese açık tabloda görüneceğini söyleyen tek cümle [TASLAK], Gizlilik
bağlantısı, "Kaydet ve Katıl" düğmesi. Düğme Md. 11(2)(A) açık onayıdır. Tarayıcı verisi
silinirse hesabın ve kodun kaybolacağı aynı ekranda yazar.

**Takma ad:** 3-12 karakter; Türkçe harfler dahil harf, rakam, boşluk, nokta, alt çizgi, tire.
TR/EN küfür filtresi, karakter katlama (ı→i, ş→s, 0→o, tekrar harf kırpma), ayrılmış adlar
(bozo, ciğerci bozo, usta, admin). Reddedilen ad nötr mesajla döner. Personel adı gizleyebilir.

**Saklama:** haftanın ilk 20'si dışındaki turların dokunuş kaydı skor hesaplanınca silinir;
ilk 20'ninki dönem bitiminden 30 gün sonra; oyuncu kaydı son turdan 90 gün sonra; şampiyonlar
kaydı (takma ad, puan, hafta) kampanya bitiminden 90 gün sonra. Sunucu her gece süresi dolanı
siler. "Hesabımı sil" düğmesi kaydı anında siler.

**Gizlilik sayfası** (`content/tr/gizlilik.ts`, EN karşılığıyla; hepsi hukukçu incelemesine):
`girisMetni`, `amacMetni`, `yontemMetni`, `dayanakMetni`, `aliciMetni` (barındırma: DH Bulut
Bilişim, İstanbul), `aktarimMetni`, `saklamaMetni` ("Site kendi sunucusunda ziyaretçi verisi
saklamaz" cümlesi kalkar), `haklarMetni` ("Hesabımı sil"), `guncellemeMetni`.

## 9. Hile modeli

| Katman | Nasıl |
|---|---|
| Skor | Sunucu iddia edilen skoru okumaz; `simule(tohum, girdiler)` ile kendisi hesaplar |
| Tavan | Tohumun üst sınırı (§6) üstü ret |
| Süre | Jeton tek kullanımlık; jeton ile gönderim arası duvar saati ≥ simülasyon süresi − 2 sn |
| Girdi biçimi | Hedef başına tikte en çok bir dokunma; toplam dokunma ≤ 1.200; gövde ≤ 64 KB |
| İnsan olasılığı | Haftanın ilk 20'sinde tam kıvam oranı > %95 veya makine kadar düzgün zamanlama işaretlenir; otomatik silme yok |
| Hız sınırı | Oyuncu 40 tur/saat; IP 600/saat (mekan Wi-Fi'si tek NAT) |
| İzleyici | Duyurudan önce personel ilk 3'ün turunu yönetim ekranında baştan oynatır |
| Duraklatma | Duraklatınca oyun alanı kapanır |

Kabul edilen artık risk: optimum girdiyi hesaplayıp insan gibi titreten bot, başkasının yerine
oynayan arkadaş. Ödül küçük ve yüz yüze; ötesi oyunun değerini aşar.

## 10. Mimari

**Yerleşim.** `/oyun/`, `/oyun/siralama/`, `/oyun/kurallar/` ve `/en/oyun/...`.
`lib/site.ts` > `RotaAnahtari` genişler; sitemap ve hreflang mevcut yoldan gelir. QR
`/oyun/?k=sofra`, Instagram `/oyun/?k=ig`.

**Simülasyon çekirdeği** `lib/oyun/`: saf TypeScript, DOM ve saat yok. Tek giriş
`simule(tohum, girdiler) -> { puan, ozet, olaylar, bitti }`, ayrıca adım adım ilerleten bir
durum makinesi (oyun ekranı ve izleyici kullanır). 32 bit tohumlu PRNG, sabit tik, bütün
durum tamsayı. Aynı dosyalar tarayıcıda ve sunucuda çalışır.

**Oyun ekranı** `components/oyun/`: DOM + SVG. React yapıyı yalnız yeni sofra veya şiş
geldiğinde çizer; her karedeki konum ve renk rAF döngüsünde doğrudan `transform`/`opacity`
olarak yazılır. Simülasyon tikte, çizim karede ara değerlemeyle.

**Skor sunucusu** repoda `sunucu/`: Node 24, arc'ta Plesk Node.js Toolkit, `api.cigercibozo.com`,
Let's Encrypt, Cloudflare arkasında. HTTP katmanı `node:http`; tek bağımlılık `mariadb`.
`lib/oyun/`'u doğrudan içe aktarır, `tsc` ile derlenir.

| Uç | Ne yapar |
|---|---|
| `POST /tur` | `{ kanal }` → `{ turId, tohum }`; kimliksiz, 15 dk |
| `POST /oyuncu` | Takma ad + onay → oyuncu; tarayıcı kendi ürettiği 128 bit anahtarı gönderir, sunucu özetini tutar |
| `POST /tur/:id/bitir` | Oyuncu anahtarı + girdiler → simüle, kaydet, `{ puan, sira, ustekiFark }` |
| `GET /tablo` | Haftanın ilk 10'u, tüm zamanların ilk 3'ü, son şampiyon; 15-30 sn önbellek |
| `GET /ben` | Oyuncunun haftalık en iyisi, sırası, varsa ödül kodu |
| `DELETE /oyuncu` | Hesabımı sil |
| `/yonetim/*` | Temel kimlik doğrulama: kod onayı, tur izleyici verisi, ad gizleme |

**Veri** MariaDB 10.11, Plesk'ten açılan tek veritabanı: `oyuncu`, `tur_jetonu`, `tur`,
`donem`, `kazanan`, `gunluk_sayac`. Pazartesi 05:00 dönemi kapatan ve kodları üreten iş ile
gece silme işi sunucunun kendi zamanlayıcısında.

**Güvenlik.** CORS yalnız `https://cigercibozo.com`. Hazır ifadeli sorgular. Gizli değerler
Plesk ortam değişkenlerinde. Gerçek IP `CF-Connecting-IP`'den, yalnız Cloudflare aralığından.

**Çerez onayı.** Oyun birinci taraftır, çerez bandının arkasına girmez; üçüncü tarafa istek
yok, GA'ya oyun olayı yok. Tarayıcıdaki oyuncu anahtarı ve kişisel en iyi, oyuncunun istediği
hizmetin parçasıdır ve gizlilik sayfasında yazılır.

**Bağımlılıklar.** Site: `motion` (yalnız `/oyun` rotalarında, ekran geçişleri ve sıralama
satırları). Sunucu: `mariadb`. Başka yok.

## 11. Ekranlar

| Ekran | İçerik |
|---|---|
| Giriş `/oyun/` | Oyun adı, "Girne uyurken ocak yanıyor", büyük **Oyna**, haftanın ilk 3'ü, son şampiyon, Kurallar ve Gizlilik |
| Oyun | Saat rayı (21:00 → 05:00), puan, kombo; sofralar; ocak; tezgah ve ayran; raf; duraklat ve ses |
| Sonuç | Ocağın kaçta söndüğü, sayarak artan puan, özet (sofra, şiş, tam kıvam, en uzun kombo), kişisel en iyiye fark, haftalık sıra ve bir üsttekine fark; **Tekrar Oyna** (büyük), Paylaş, "Bu skoru sıralamaya yaz" |
| Sıralama | Haftanın ilk 10'u, oyuncunun sırası ve farkı, son şampiyon, sıfırlanma zamanı |
| Kurallar | Nasıl kazanılır, beraberlik, teslim, bir kişi bir ödül, takma ad kuralları, veri → Gizlilik, kampanya tarihleri |
| Yönetim | Kod onayı, tur izleyici, ad gizleme |

Geceyi tamamlayan için sonuç satırı mevcut metinden: "05:00 · son tane, ocak söner".

## 12. Animasyon ve his

İlkeler: tepki aynı karede başlar ve ≤ 300 ms sürer; ateş skorla büyür (kombo arttıkça ocak
kıvılcımı ve kor ışığı yoğunlaşır); animasyon yalnız görseldir, simülasyona asla dokunmaz.

| An | Animasyon | Hareket azaltılmışta |
|---|---|---|
| Dokunma | hedef 2 px kalkar, dolgu 120 ms | yalnız dolgu |
| Sofra kurulur | ikram tabakları sırayla iner, lebeni önce | çapraz geçiş |
| Şiş pişer | taneler kremden bakıra döner; ocaktan kıvılcım (`KorKivilcimi`) | renk kalır, kıvılcım yok |
| Çevirme | 180 ms dönüş, çevrilen yüzde küçük kıvılcım | anlık yüz değişimi |
| Tam kıvam | bakır parlama, "+150" yükselir, Android'de kısa titreşim | rakam yerinde belirir |
| Servis | şiş tezgahtan sofraya kavisle uçar (250 ms), tabak oturur | çapraz geçiş |
| Kor halkası | sabır azaldıkça yanarak kısalır, sona doğru kızarır, bitince kül | aynı, hareketsiz |
| Sofra kalkar | halka söner, sofra kararıp kaybolur | opaklık |
| Kombo ×2/×3/×4 | rozet mühür gibi basılır, ocak bir kademe ısınır | rozet belirir |
| Son saat | sahne `--gece`ye geçer, saat rayı bakırlaşır | opaklık geçişi |
| Sonuç | puan sayarak artar, saat mühürlenir | son değer doğrudan |

Teknik: oyun alanında kendi rAF döngüsü ve anlık tepkiler için Web Animations API; ekran
geçişleri ve sıralama satırları için Motion. Yanıp sönme 3/sn'yi geçmez. Hareket azaltma
tercihi rAF ve WAAPI kodunda okunur (`useHareketAzaltilmisMi`); global CSS kuralı oraya
ulaşmaz. Hedef: orta seviye Android'de 60 fps, chrome-devtools trace ile ölçülür.

## 13. Görsel ve ses dili

Arcade kabini yok. Oyun sitenin kor zemini (`KorSahnesi`) üstünde bir `CamPanel` içinde.
Yalnız marka token'ları: zemin `--zemin`, ocak yatağı `--kor-leke*`, çiğ `--krem`, pişmiş
`--bakir`, yanık `--komur` + `--krem-50` kontur, halka `--kor`, tam kıvam `--bakir-acik`.
Rakamlar Bevan 400 tabular, etiketler Archivo. Köşe 0-3 px.

**Varlıklar** (elle çizilmiş SVG sembol; fotoğraf ve yapay zeka görseli yok), yaklaşık 28:

| Grup | Varlık |
|---|---|
| Sofra (4) | sofra plakası, kor halkası, fiş çerçevesi, kalktı işareti |
| İkram (4) | lebeni kasesi, bostana, yeşillik, sumaklı soğan |
| Ürün (4) | ciğer (4+2 ritmi), dalak, yürek siluetleri, Bozo Karışık fiş ikonu |
| Ocak (5) | yatak, ray + çentik + bantlar, şiş gövdesi, yanık şiş, çevirme işareti |
| İstasyon (3) | açık yayık, bakır maşrapa, tezgah yuvası |
| HUD (5) | saat rayı, kombo rozeti, porsiyon rozeti, ocak söner işareti, duraklat |
| Diğer (3) | sabit QR, paylaşım kartı şablonu, kor noktası ipucu |

**Ses:** dosya yok, Web Audio ile üretilir: kor cızırtısı, bakır tık, servis için iki nota,
yanık için alçak vuruş, son saat için derin ton. Varsayılan kapalı, tek dokunuşla açılır,
tercih tarayıcıda kalır.

## 14. Paylaşım kartı

1080×1920 PNG, tarayıcıda canvas ile, sitenin kendi font dosyalarıyla. İçerik: rozet, saat
satırı (§19, karar 4), puan, takma ad, özet, adres ve saatler (`content/isletme.ts`
alanlarından, `10:00 - 05:00` biçiminde), `cigercibozo.com/oyun` ve `?k=ig`'ye giden sabit QR.
`navigator.canShare({ files })`
varsa Web Share ile doğrudan Instagram'a; yoksa PNG indir ve bağlantıyı kopyala.

## 15. Erişilebilirlik

- Hedefler: sofra 84 px, ocak yuvası 72×140, raf ve tezgah ≥ 56 px; 320 px genişlikte de
  ≥ 44 px (ölçülecek).
- Klavye: her hedef `<button>`, odak halkası `--bakir`; Tab şeritler arası, ok tuşları şerit
  içi, Boşluk/Enter dokunma; 1-4 sofra, 5-8 ocak kısayolu.
- Renkten bağımsız: pişme ray ve çentikle, yanık kontur ve etiketle, ürün siluet ve raf
  etiketiyle, sabır halka uzunluğuyla.
- Canlı bölge önemli anları saniyede en çok bir kez duyurur. Sonuç, sıralama, kurallar ve
  katılım ekranları tam erişilebilir; oyun döngüsü için "tam erişilebilir" iddiası yok.
- Sekme arka plana geçince oyun duraklar; otomatik başlama yok.

## 16. Test

- **Simülasyon** (`node:test`): her kural için birim testi; altın kayıtlar (sabit tohum ve
  girdi → sabit puan, kural değişince bilerek kırılır); determinizm (aynı girdi iki kez aynı
  sonuç); zorluk bütçesi değişmezi (çok sayıda tohumda evre başına misafir sayısı ve ürün
  kümesi aynı); tavan hesabı hiçbir altın kaydın altında kalmaz.
- **Sunucu:** uçlar sahte bir depo arabirimiyle; doğrulama, ret yolları, hız sınırı, dönem
  kapanışı.
- **Uçtan uca:** mevcut Playwright harnesi; `/oyun` açılır, yönlendirmeli ilk servis
  tıklanarak yapılır, sonuç ekranı gelir; axe 0 ihlal; 320/390/1440 taşma yok.
- **Performans:** chrome-devtools trace, orta seviye Android emülasyonu, 60 fps hedefi.

**Kaba prototip testi** (çizimler bitmeden, gri kutular, mekanda 5-10 misafir, kişi başı 3
tur, ilk turda açıklama yok):

| Ölçülen | Eşik / karar |
|---|---|
| Yardımsız ilk servise kadar süre | 12 sn üstü veya soru varsa ipucu güçlenir |
| Yanlış dokunma oranı | %15 üstüyse yerleşim veya ikon değişir |
| Üçüncü turda gecenin bittiği saat | hedef 02:00-04:00; 05:00'e ulaşan ≤ %15 |
| Tam kıvam oranı | ilk tur %20-35, üçüncü tur %40-55; dışındaysa bant ayarı |
| "Bir daha" diyen | 10'da 6 altıysa sonuç ekranı ve kombo hissi gözden geçirilir |
| Evre 5 dokunma yükü | tutulamıyorsa misafir aralığı 4 sn |
| Tek soru | "Bu oyun size Bozo hakkında ne anlattı?" Cevapta ikram, lebeni, tane veya gece yoksa sofra kurma ve fiş sırası güçlenir |

## 17. Yapım sırası

1. Simülasyon çekirdeği, zorluk bütçesi, puan, altın kayıtlar.
2. Oyun ekranı, gri kutularla, yalnız yerel tohum. **Sunucusuz oynanabilir ilk sürüm**: kaba
   prototip testi bununla yapılır.
3. Görsel ve ses dili: SVG varlıklar, animasyonlar, hareket azaltma.
4. Sunucu ve veritabanı (yerelde), jeton, gönderim, tablo, dönem kapanışı.
5. Katılım, sonuç, sıralama ekranları; "önce oyna, sonra kaydet".
6. Paylaşım kartı.
7. Kurallar sayfası ve gizlilik değişiklikleri (sahibi ve hukukçu).
8. Yayın: alt alan adı, DNS kaydı, Node uygulaması, veritabanı. Her dış adım ayrı onayla.

Uygulama planı bu sırayı izler; 1-2 (oynanabilir prototip), 3, 4-5 ve 6-8 ayrı plan
parçaları olarak yazılabilir, her biri kendi başına test edilir ve commit'lenir.

## 18. Kapsam dışı (sezon 2 adayları)

Tavuk, kuşbaşı, lavaş ve dürüm fişleri; porsiyon (12 şiş) fişi; iki ocak şeridi; gündüz
vardiyası; Şişi Diz istasyonu (4+2 ritmiyle tane dizme); mekan içi tablet modu; gerçek
fotoğrafların sonuç ve paylaşım kartına girmesi.

## 19. Sahibine açık kararlar

1. Oyun adı. Çalışma adı "Sofra Yetiştir"; seçenekler "Üç Dakika", "Son Tane".
2. Ödül kademeleri. Öneri: 1. Bozo Karışık porsiyon ve iki ayran, 2. bir porsiyon ciğer, 3. bir
   dürüm ve ayran.
3. Kampanya süresi (kaç hafta) ve başlangıç tarihi.
4. Oyun metinleri [TASLAK]: katılım cümlesi, sonuç ve paylaşım kartında "Saat 03:40. Ocak hala
   yanıyor" kalıbının oyuncunun saatiyle kullanımı, sofra QR kartı ("Şiş 3 dakikada pişer. O
   arada: cigercibozo.com/oyun"), kurallar metni.
5. Geç kalan şişin adı: "yandı" (çalışma) veya "kurudu".
6. Pişme süreleri: dalak kısa, yürek uzun; gerçek ocakla uyumlu mu?
7. Fotoğraf ve yapay zeka görseli kuralının oyunu da kapsadığının onayı (oyun tamamen vektör).
8. `/oyun` üst menüde ve çekmecede mi, yalnız kampanya bağlantısı mı?
9. Kod onayını ve takma ad denetimini hangi personel yapar?
10. Gizlilik değişiklikleri hukukçuya kimle gider?
