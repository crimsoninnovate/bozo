# Açılış oyunu · Tabak akışı: ocaktan tabağa, tabaktan misafire

Tarih: 9 Ekim 2026 · Durum: sahibin Kebab World referansı ve akış tarifi üzerine yazıldı, spec incelemede.
Üst belgeler: `docs/specs/2026-10-08-oyun-design.md` (sunucu §10, sıralama ve ödül §7, gizlilik §8 ve
§16-§17, erişilebilirlik §15, görsel dil §12-§13 geçerli) ve `docs/specs/2026-10-09-oyun-sade-design.md`.
Bu belge sade spec'in **§2 ve §3'ünü değiştirir**; sade spec'in rehberli ilk tur ilkesi, takma ad alanı,
"skor asla negatif olmaz" kuralı ve ayran kararı olduğu gibi kalır. `docs/plans/2026-10-09-oyun-sade-plani.md`
bu belgeye göre yeniden yazılır; sade modun hiçbir parçası yayına girmedi.

## 1. Neden ve konsept

Sahibi canlı prototipi telefonda açıp "hiçbir şey anlamadım, oynayamadım" dedi; iki dokunuşlu sade mod
seçildi, sonra referans oyunun (Kebab World, rekoroyun.com) ekran görüntülerini gönderip istediği akışı
tarif etti: sipariş misafirin üstünde görünür, şiş ocaktan **tutulup tabağa çekilir**, domates gibi
eşlikçiler tabağa eklenir, tabak misafire götürülür, para gelir, para alınır, yeni misafir gelir. Harita,
seviye seçimi, dükkan yok: "az seviyeli tek bölge", "direkt Urfa odaklı, sadece ciğer ve menümüzdekiler".

**Konsept.** Gece 21:00 - 05:00, Bozo'nun ocakbaşı tezgahı. Misafirler tezgahın karşısına gelir, fişi
başının üstünde, sabrı fişin çevresindeki kor halkasında. Oyuncu rafa dokunup şişi ocağa koyar, kıvamı
gelince şişi tabağa sürükler, fişte varsa domates ya da sumaklı soğanı kaseden tabağa sürükler, tabağı
misafire götürür, tezgaha düşen bahşişe dokunur. Lebeni ve bostana misafir gelince kendiliğinden önüne
iner: "sofra kurulu gelir", dokunulmaz. Ad "Sofra Yetiştir" kalır (sahibin §19 kararına kadar).

**İlke aynı: bir mod, bir tur, bir skor tablosu.** Seviye yoktur ve önerilmez: 120 saniyelik gecenin
beş evresi (21-22, 22-00, 00-02, 02-04, 04-05; evre başına 15 sn'lik oyun saati, son saat puan ×2)
"ilerleme" hissini turun içinde verir: ürünler, eşlikçiler ve ocak yuvaları evreyle açılır (§5).
Referansın kilitli ocak yuvası görseli bunun için zaten kodda var (`KapaliYuva`).

## 2. Döngü ve kurallar

Bir sipariş için hareketler, sırayla:

| # | Hareket | Girdi | Neden bu kadar |
|---|---|---|---|
| 1 | Rafa dokun: şiş ilk boş ocak yuvasına iner | `ciger` | Yuvalar eşdeğer; yuva seçtirmek boş bir sürükleme olurdu |
| 2 | Hazır şişi ocaktan tabağa sürükle | `o1` + `t0` | Sahibin tarifi; kalite tutma anında mühürlenir |
| 3 | Fişteki eşlikçiyi kaseden tabağa sürükle (fişte varsa) | `domates` + `t0` | Tabağa giren her şey aynı hareketle girer; tek kural öğrenilir |
| 4 | Tabağı misafire sürükle | `t0` + `m1` | Sahibin tarifi |
| 5 | Bahşişe dokun | `p1` | Sahibin tarifi; ödül anı, zamanlama yok |

Tek şişlik fiş 4 hareket, en büyük fiş (Bozo Karışık + bir eşlikçi) 7 hareket. Sade modun 2 dokunuşu
yerine 4; karşılığı sahibin istediği "tabak" hissidir. Başka fiil yoktur: çevirme, tezgah, sofra kurma,
ayran yok.

**Fiş.** Misafir 1-4 kalem ister: şişler (ciğer, dalak, yürek) ve eşlikçiler (domates, sumaklı soğan;
menüdeki `ikramlar.ogeler.domates` ve `sumakli`). En çok 3 şiş + 1 eşlikçi. **Bozo Karışık** fişi
ciğer, dalak, yürek üçünü tek tabakta ister; fişte tek Karışık simgesi (`KarisikSimgesi`), tabak üçünü
alınca dolar. Lavaş, dürüm, biber, tavuk, kuşbaşı, nane, maydanoz ve ayran fişe girmez (§11). Fiş
simgelerden oluşur, yazı yok; aynı dört tane yolu (`SahneTane`) fişte, ocakta ve tabakta.

**Ocak.** Yuva 3 (evre 3'ten 4). Ray: çiğ → hazır penceresi (altın) → yanık. Pencerenin ortasında dar
**tam kıvam** bandı. Pişerken yuvaya dokunmak etkisizdir (şiş kısa sallanır, ses yok, ceza yok). Pencere
geçerse şiş yanar: yuva kendiliğinden boşalır (çöpe taşıma hareketi yok), kombo sıfırlanır, puan düşmez.
Pişme süresi ürüne göre ciğer ×1,0, dalak ×0,75, yürek ×1,25 kalır. Hazır şiş altın halka ve nabızla
"beni tut" der; tutulunca kalite **o tikte** mühürlenir, yuva boşalır, şiş elde ne kadar kalırsa kalsın
ne pişer ne soğur (elde zamanlayıcı yok: beklemenin kazancı da yok).

**Tabak.** Tabak yeri 2, ikisi de hep dolu: teslim edilen tabağın yerine aynı tikte boş tabak gelir
(referansın "tabağı çıkar" dokunuşu atıldı, bilgi taşımıyor). Tabağa bırakılan her şey tabakta kalır;
tabak en çok 4 kalem alır, beşinci bırakış geri döner. **Doğru tabak** = kalemler kümesi fişle birebir
aynı (sıra önemsiz, şiş kaliteleri önemsiz). Eksik ya da fazla kalemli tabak misafire bırakılınca
**geri döner** (misafir başını sallar, kor halkası durmaz, puan ve kombo değişmez). Yanlış kalem
tabağa girdiyse düzeltme tek yoldur: tabağı **çöpe** sürükle, tabak boşalır, puan ve kombo değişmez.
Elindeki tek kalemi de çöpe bırakabilir. Şiş doğrudan misafire bırakılamaz: her şey tabakla gider.

**Misafir.** Üst şeritte en çok 3 yer (`m0`-`m2`), sıradakiler kapıda bekler (sabır oturunca başlar).
Sabrı biten kalkar (`kalkan` artar, kombo sıfır, puan düşmez); **üç misafir kalkarsa gece biter**
("üç misafir kalktı"). Doğru tabak bırakılınca misafir öder ve 30 tik içinde kalkar; yer aynı tikte
boşalır, bahşiş yerin önündeki tezgah kenarına düşer.

**Bahşiş.** Ödeme ikiye ayrılır: **hesap** (kalem puanları × çarpanlar) teslim anında puana yazılır;
**bahşiş** (sabır bonusu × çarpanlar) tezgahta bakır bir para olarak belirir ve dokununca yazılır.
Para 8 sn (480 tik) bekler, sonra solar ve bonus yanar: ceza değil, alınmamış ödül. Aynı yere ikinci
bir para düşerse tek paraya eklenir, süre yeniden başlar. Para yeri misafir yerini kapatmaz: bir sonraki
misafir para dururken oturabilir. Tek para, tek dokunuş: ilk kez oynayanın en kolay hareketi.

**Puan.** Hiçbir olay puanı düşürmez; `PUAN` tablosundan `yanik`, `soguma`, `kalkis`, `ayran`,
`porsiyon` çıkar. Şiş: tam kıvam 150, iyi 100. Eşlikçi 20. Hesap = kalemler toplamı × kombo çarpanı ×
(evre 5 ise 2). Bahşiş = floor(200 × kalan sabır / toplam sabır) × aynı çarpanlar; kalan sabır teslim
anındaki değerdir. Kombo sayacı: teslim edilen fiş sayısı, yanık ya da kalkan misafirde 0; çarpan
0-2 ×1, 3-5 ×2, 6-8 ×3, 9+ ×4 kalır. Gece tamam (05:00) +1000. **Porsiyon rozeti kalkar**: 12 ardışık
tam kıvam, sürükleme zamanlamasıyla gürültüden ibaret olur ve HUD'dan bir kavram eksilir (§12, soru 5).

## 3. Dokunma ve sürükleme

Simülasyon için sürükleme diye bir şey yoktur: her hareket **tut** ve **bırak** adlı iki ayrı girdidir
(§8). Tarayıcı üç girdi yolunu aynı çifte indirger:

- **Sürükleme:** `pointerdown` kaynakta → `tut` girdisi o tikte; parmak 8 px'ten çok yürürse öğe
  parmağa yapışır (`transform`, rAF, parmağın 12 px üstünde ki görünsün); `pointerup` bir hedefin
  vuruş alanı üstünde → hedef girdisi; hedef dışında, `pointercancel`, parmak pencereden çıkarsa,
  sekme arka plana geçerse → `birak` girdisi, öğe 180 ms'de yerine döner.
- **Dokun-dokun:** `pointerdown`/`pointerup` aynı yerde ve 8 px altında kaldıysa öğe **elde kalır**
  (kaynakta 2 px kalkmış, bakır halkalı). Sonraki dokunuş bir hedefteyse hedef girdisi, değilse `birak`.
  Bu yol telefonla sürüklemeyi beceremeyen oyuncu için de kaçış yoludur; rehber yalnız sürüklemeyi
  öğretir, dokun-dokun kendiliğinden çalışır.
- **Klavye:** Tab şeritler arası, ok tuşları şerit içi (`odak.ts` aynen), Enter/Boşluk = dokunma,
  Esc = `birak`. 1-8 rakam kısayolları kalkar (`klavye.ts` > `KISAYOLLAR` silinir).

**Tek parmak.** İlk `pointerId` kilitlenir; bırakılana kadar ikinci parmak yok sayılır. Elde bir şey
varken kaynaklara dokunmak etkisizdir (önce bırak).

**Vuruş alanları** (en az 44 × 44 px; tasarım ölçüleri §6): raf düğmesi 56 px, ocak yuvası 72 × 140,
tabak 112 × 84, kase 56, çöp 56, misafir yeri 120 × 150 (fiş balonu dahil), para 56. Bırakma hedefi
parmağın altındaki noktayla belirlenir (`elementFromPoint`), öğenin görsel örtüşmesiyle değil. Sürüklenen
öğe `pointer-events: none`. Geçerli hedef parmak üstündeyken bakır kenar yanar (120 ms).

**Hareket azaltma** (`useHareketAzaltilmisMi`): öğe parmağı yine izler (doğrudan yönlendirme,
animasyon değil); geri dönüş anlık, para zıplamadan belirir, kıvılcım yok, rehber eli nabız atmaz.

**Ekran okuyucu.** Her kaynak ve hedef gerçek `<button>`, adı durumuyla: "Ocak 1: ciğer, hazır",
"Tabak 1: ciğer, domates", "Misafir 2: ciğer ve domates istiyor, sabır yüzde 60", "Bahşiş: 240".
Canlı bölge tut ve bırak sonuçlarını duyurur ("Ciğer elde", "Tabak 1'e kondu", "Misafir 2 ödedi"),
saniyede en çok bir. Oyun döngüsü için "tam erişilebilir" iddiası yine yoktur (üst spec §15).

## 4. Sabır, bitiş, sonuç

Kor halkası fiş balonunun çevresinde; sabır azaldıkça yanarak kısalır, sona doğru kızarır. Bitiş iki
yoldan: 05:00'te ocak söner ("05:00 · son tane, ocak söner"), ya da üç misafir kalkar. Gecenin ilk
misafiri yine tükenmezdir (öğrenirken kaybetmek yok). Sonuç ekranı özeti: misafir, şiş, tam kıvam,
en uzun kombo, alınan bahşiş; "sofra" sayacı "misafir" olur (`ozet.sofra` → `ozet.misafir`).

## 5. Zorluk

60 tik/sn, tur 7.200 tik. Sürükleme dokunuştan yavaştır; pencereler sade moddan geniş başlar.
Başlangıç değerleri, botlarla ayarlanır:

| Evre | Saat | Tik | Misafir yeri | Ocak | Aralık | Fiş boyu | Yeni | Ciğer pişme | Pencere | Tam kıvam | Sabır |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 21-22 | 0-900 | 2 | 3 | yönlendirmeli | 1-2 | ciğer, domates | 4,0 sn | 3,0 sn | 600 ms | 35 sn |
| 2 | 22-00 | 900-2700 | 2 | 3 | 8 sn | 1-2 | dalak, sumaklı soğan | 3,5 sn | 2,6 sn | 500 ms | 28 sn |
| 3 | 00-02 | 2700-4500 | 3 | 4 | 6 sn | 2-3 | yürek | 3,0 sn | 2,2 sn | 450 ms | 22 sn |
| 4 | 02-04 | 4500-6300 | 3 | 4 | 4,5 sn | 2-4 | Bozo Karışık | 2,6 sn | 2,0 sn | 400 ms | 18 sn |
| 5 | 04-05 | 6300-7200 | 3 | 4 | 3,5 sn | 3-4 | puan ×2 | 2,2 sn | 1,8 sn | 350 ms | 16 sn |

Yönlendirmeli ilk iki misafir tohumdan bağımsız: 1. sn tek ciğer (tükenmez); 12. sn ciğer + domates.
Evre 2-5 bütçesi (`BUTCE`) sade yapıyı korur: evre başına misafir sayısı ve kalem kümesi her tohumda
aynı, tohum yalnız sırayı ve geliş anını (±%20) belirler; iki Karışık art arda gelmez; eşlikçi her
fişte en çok bir. Başlangıç bütçesi: evre 2 için 5 fiş (ciğer 5, dalak 2, domates 2, soğan 1), evre 3
için 6 (ciğer 6, dalak 3, yürek 3, domates 2, soğan 2), evre 4 için 6 + Karışık (ciğer 5, dalak 3,
yürek 3, domates 3, soğan 2), evre 5 için 4 + Karışık (ciğer 4, dalak 2, yürek 2, domates 2, soğan 1).
Gece 24 misafir; evre 5'in aralığı son misafiri 05:00'ten en az 8 sn önce getirir.

**Kapı** (`gece.test.ts`, 200 tohum; sayılar `motor.test.ts` > `zorlukBandi`'ya yazılır):

| Bot | Davranış | Eşik |
|---|---|---|
| usta | saniyede 3 girdi, şişi tam kıvam bandında tutar, fişleri sabrı en az kalandan başlar, her bahşişi alır | gecelerin ≥ %95'ini tamamlar, en yüksek puan |
| düzenli | saniyede 2 girdi, hazır olur olmaz tutar, bandı umursamaz, bahşişi alır | ≥ %70 tamamlar |
| rastgele | saniyede 2 geçerli hedefe rastgele girdi | ≥ %90'ında evre 2'yi geçer (tik ≥ 2700'de bitmemiş) |
| hareketsiz | hiç girdi yok | 0 puan, 01:30'dan önce (tik < 4050) "üç misafir kalktı" |

Bir ayar değişikliği kapıyı bozarsa oyun ya yapılamaz ya baskısız olmuştur; sayı bilerek değiştirilir.

## 6. Ekran

Mobil dikey 390 × 844 temel; masaüstünde panel 420 px ortada (sahne spec K6). Dikey akış, yukarıdan:

| Şerit | Yükseklik | İçerik | Rol |
|---|---|---|---|
| HUD | 56 | saat rayı, saat, puan, kombo altıgeni, ses, duraklat; duyuru satırı | yalnız bilgi; porsiyon rozeti kalkar |
| Misafir | 168 | 3 yer: fiş balonu + kor halkası + misafir silueti; önünde lebeni ve bostana | **bırakma hedefi** (tabak) |
| Tezgah kenarı | 48 | her yerin altında para noktası (`p0`-`p2`) | dokunma hedefi |
| Ocak | 150 | 3-4 yuva, köz yatağı, ray | **tutma kaynağı** (hazır şiş) |
| Tabak | 120 | solda çöp (56), ortada 2 tabak, sağda 2 kase (domates, sumaklı soğan) | tabak: hedef ve kaynak; kase: kaynak; çöp: hedef |
| Raf | 64 | ciğer, dalak, yürek düğmeleri (açılan evrede belirir) | dokunma |

Şeritler arası 12 px; toplam 606 + 60 pay, 844'e sığar; 320 px'te kaseler 48 px'e iner, 44 altına
inmez (ölçülecek). Sürükleme yolları hep dikeydir: ocak → tabak aşağı, tabak → misafir yukarı; baş
parmak iki yönü de bir hareketle alır.

**Boyalı sahneden kalan** (`components/oyun/Sahne*`): `SahneDefs` (tek defs), köz yatağı, alev, ray,
`KapaliYuva`, şiş ve taneler (`SahneTane`), kor halkası, bakır tabak (`SahneTezgah` içinden, artık
tabak yerinde), raf tepsileri, ikram tabakları (misafirin önünde). **Kalkan:** tezgah mermeri ve dört
tezgah yuvası, maşrapa, yayık, çevirme çentiği ve işareti, sofra plakası, porsiyon rozeti.
**Yeni (vektör, `OYUN-VARLIK-BRIEFI.md`'ye eklenir):** misafir silueti (3 varyant, yüz yok), fiş balonu,
domates ve sumaklı soğan kaseleri ve tabak üstü halleri, çöp (bakır kova), bahşiş parası, rehber eli.

## 7. Rehberli ilk tur

Sade spec'in katmanı: ekran kararır, yalnız o adımın kaynağı ve hedefi açık kalır, nabız atan bir el,
bir cümle. Sürükleme adımlarında el kaynaktan hedefe yolu 1,2 sn'de bir çizer (WAAPI); azaltılmış
harekette el kaynakta durur, hedefe bakır kesikli çizgi iner. Her adımda **Atla** (44 px, HUD altında
sağda); atlanınca rehber kapanır, oyun serbest. Yalnız bu tarayıcıdaki ilk turda (`defter` anahtarı
`rehberGoruldu`). Metinler sözlükten; her cümle en çok 6 sözcük.

| Adım | Açık | TR | EN | Beklenen | Saat |
|---|---|---|---|---|---|
| 1 | fiş balonu | Misafir ciğer istiyor | The guest wants liver | Tamam'a dokun | durur |
| 2 | raf: Ciğer | Ciğer şişini ocağa koy | Tap Ciğer to start grilling | rafa dokun | durur |
| 3 | ocaktaki şiş, ray | Şiş pişiyor, altın olunca tut | Wait until it turns golden | gözle | akar |
| 4 | hazır şiş, tabak 1 | Şişi tabağa sürükle | Drag the skewer to the plate | `o0` + `t0` | durur |
| 5 | tabak 1, misafir | Tabağı misafire götür | Drag the plate to the guest | `t0` + `m0` | durur |
| 6 | para | Bahşişi al | Tap the tip | `p0` | durur |
| 7 | kase, tabak (2. misafir) | Domatesi de tabağa koy | Add the tomato too | `domates` + `t0` | durur |

Adım 4'te pencere açılınca saat durur: öğrenen şişi yakamaz; `tut` gelince saat akar, `t0` gelene
kadar beklenen hedefin dışına bırakış `birak` sayılır ve adım tekrar eder. Adım 7 ikinci misafir
oturunca tetiklenir; adım 5-6 arası serbest hareket yoktur. Duraklama simülasyonu etkilemez: tik
ilerlemez, kayıt ve sunucu yeniden oynatması aynıdır. Sonraki turlarda rehber yok; istenen ürünün raf
düğmesi ve istenen kasenin parlaması (raf rehberi) kalır. Konuşan karakter yok (§12, soru 3).

## 8. Determinizm ve sunucu

Kayıt `[tik, hedef]` demetleri olarak kalır; `simule(tohum, girdiler)` ve `ilerle(oyun, hedefler)`
imzaları aynı. Hedef kümesi (`HEDEFLER`, 19 değer):

| Hedef | Çözümleme (`ilerle` içinde, tik sırasıyla) |
|---|---|
| `ciger` `dalak` `yurek` | ürün açıksa ve boş yuva varsa şiş ilk boş yuvaya; yoksa `rafDolu` olayı |
| `o0`-`o3` | el boş ve şiş hazır penceresindeyse: şiş ele, kalite mühürlenir, yuva boşalır; aksi etkisiz |
| `domates` `sogan` | el boşsa ve eşlikçi açıksa: eşlikçi ele (kase tükenmez) |
| `t0` `t1` | elde şiş/eşlikçi: tabağa iner (4 kalem sınırı); el boş ve tabak doluysa: tabak ele; elde tabak: etkisiz |
| `m0`-`m2` | elde tabak ve yerde misafir ve tabak fişle aynıysa: teslim, hesap, para; aksi `yanlisTabak` olayı, tabak yerine |
| `cop` | elde ne varsa yok olur; tabaksa boş tabak yerine döner; el boşsa etkisiz |
| `p0`-`p2` | para varsa bahşiş puana, para silinir |
| `birak` | eldeki yerine döner (tabak yerine, şiş ve eşlikçi yok olmaz: şiş elden tabağa dönemez, yuva boşaldı; o yüzden **şiş `birak`'ta çöpe gider**, eşlikçi kaseye) |

Son satır önemli: tutulan şişin yuvası boşalmıştır; geri dönecek yer yok. Tarayıcı bunu bir kez
söyler (rehber adım 4 bırakışı tekrar ettirir, serbest oyunda şiş "düşer", kombo değişmez). `Oyun`
durumuna `el` (`{ tur: 'sis', urun, kalite } | { tur: 'eslikci', urun } | { tur: 'tabak', no } | null`),
`tabaklar`, `misafirler` (3 yer), `paralar` (3 yer, `{ tutar, kalan }`) girer; `tezgah`, `ayran`,
`cevirme`, `kurulu`, `porsiyonDizisi` çıkar. Aynı tikte aynı hedef bir kez (mevcut kural), aynı tikte
`tut` ve bırakma hedefi olabilir (dokunma sırası korunur).

**Sunucu.** `dogrulama.ts` biçim denetimi aynen; `HEDEFLER` kümesi `motor.ts`'te güncellenir.
`EN_COK_DOKUNUS` 1200 **kalır**: usta 24 misafir × en çok 7 girdi = 168, rastgele bot 240,
saniyede 4 vuran bir el 480; 1200 iki buçuk kat pay bırakır. `tavan.ts`: her fiş için (kalemler +
200) × kombo çarpanı × 2, en büyük fişler en yüksek çarpanlarda, + gece tamam; porsiyon terimi silinir.
`suphe.ts` (tam kıvam > %95 işareti) aynen. `aktarim.ts` tipleri değişmez (`Girdi`, `Ozet` alan adı
`misafir`). Eski kayıtlarla uyum gerekmez: sunucu yayında değil, altın kayıtlar yeniden üretilir.

## 9. Kod etkisi

Aynı simülasyon deseni: tamsayı, tik, deterministik, DOM yok.

- `lib/oyun/tipler.ts`: `Hedef` (19 değer), `Elde`, `Tabak`, `MisafirYeri`, `Para`, `Olay` (`tutuldu`,
  `tabagaKondu`, `teslim`, `yanlisTabak`, `paraDustu`, `bahsisAlindi`, `copeGitti`, `paraSoldu`;
  `sofraKuruldu`, `sisCevrildi`, `sogudu`, `ayranDoldu`, `porsiyon`, `tezgahDolu` silinir),
  `Bitis` `'ucMisafir'`.
- `ayar.ts`: §5 tablosu ve bütçe, `ESLIKCI_PUANI`, `PARA_TIK`, `TABAK_SINIRI`; tezgah, ayran, soğuma,
  kurma iadesi, porsiyon sabitleri silinir.
- `ocak.ts`: `rafaDokun`, `ocaktanTut`, `ocakIlerle` kalır; çevirme, tezgah, ayran fonksiyonları silinir.
- Yeni `tabak.ts`: `tabagaBirak`, `tabagiTut`, `copeBirak`, `birak`. Yeni `misafir.ts` (`sofra.ts`
  yerine): geliş, oturma, sabır, `misafireBirak` (fiş eşleşmesi, hesap, para), `paraAl`, `paraIlerle`.
- `motor.ts`: hedef dağıtımı; `puan.ts`: porsiyon çıkar; `gece.ts`: eşlikçili bütçe; `tavan.ts`;
  `gosterim.ts`/`gorsel.ts`: el, tabak, para görünümü; `ses.ts`: çevirme ve ayran çıkar, tut, bırak,
  teslim, bahşiş girer; `klavye.ts`: `KISAYOLLAR` silinir; `deneme.ts`: dört bot (§5).
- `components/oyun/`: `Seritler.tsx` ve `SeritlerTezgah.tsx` yerine `SeritMisafir.tsx`, `SeritOcak.tsx`,
  `SeritTabak.tsx`, `SeritRaf.tsx` (her biri ≤ 300 satır). Yeni `surukle.ts`: saf durum makinesi
  (`pointerdown`/`move`/`up`/`cancel` → `tut`, hedef, `birak`; 8 px eşik, tek parmak, dokun-dokun),
  DOM'suz test edilir. Yeni `Rehber.tsx` + `rehber.ts` (adım tablosu, hangi adımın saati durdurduğu).
  `SahneSofra` → `SahneMisafir` (balon, halka, para); `SahneTezgah` → tabak, kaseler, çöp; `Semboller`
  (çevirme, ayran, porsiyon çıkar; el, para, çöp girer); `tepkiler.ts` (geri dönüş, para belirme,
  yanlış tabak sallanması); `Hud.tsx` (porsiyon rozeti çıkar); `useOyunAlani.ts` (`surukle` bağlanır).
- Sözlük: `tezgah`, `kurulu`, `bosSofra`, `ucSofraKalkti`, `duyuru.porsiyon`, `duyuru.sogudu` silinir;
  `ucMisafirKalkti`, `tabak`, `cop`, `bahsis`, `rehber.*` (7 adım + `atla`), `canli.*` girer.
- Testler: `motor.test.ts` altın kayıtları yeniden üretilir; `ocak.test.ts` kırpılır; `sofra.test.ts`
  → `misafir.test.ts`; yeni `tabak.test.ts`, `surukle.test.ts`, `rehber.test.ts`; `tavan.test.ts`
  "hiçbir altın kayıt tavanı aşmaz"; "skor negatif olmaz" mülkiyet testi (rastgele girdi, 500 tohum).
- Ölü kod kalmaz: tezgah, ayran, çevirme, porsiyon, sofra kurma dosyaları, sembolleri, CSS sınıfları
  ve sözlük anahtarları silinir (CLAUDE.md). Dosya ≤ ~700, fonksiyon ≤ 50 satır.

## 10. Doğrulama

Hepsi başsız; ekran görüntüsü okuma döngüsü yok.

- `npm run typecheck`, `npm test`: birim testleri, altın kayıtlar, determinizm, bütçe değişmezi, tavan,
  negatif olmama, `surukle` durum makinesi (eşik altı dokunuş elde bırakır, eşik üstü sürükler,
  cancel `birak` verir, ikinci parmak yok sayılır).
- Bot kapısı §5 (200 tohum) `gece.test.ts`'te.
- Playwright (mevcut harnes, `out/` 8391'de): 390 ve 1440'ta rehberli tur gerçek işaretçi
  sürüklemeleriyle (`mouse.down`, 6 adımda `mouse.move`, `mouse.up`) baştan sona; adım 1, 2, 4, 5, 6,
  7'de tikin durduğu, 3'te aktığı; Atla her adımda; aynı akış dokun-dokun ile; klavye yolu (Tab, ok,
  Enter, Esc) ile ilk misafir; `prefers-reduced-motion: reduce` ile tur (el nabız atmaz, geri dönüş
  anlık); axe 0 ihlal; 320/390/1440'ta taşma yok ve 44 px altı hedef yok; kare süresi p95 ≤ 17,5 ms
  (CPU 4×) sürükleme sırasında.
- Sahibin telefonu (tek ölçüt, tek soru): rehberle ilk iki misafir ilk 60 sn içinde servis ediliyor
  mu; üçüncü misafir rehbersiz, 02:00'den önce servis ediliyor mu; "bir daha" diyor mu.

## 11. Kapsam dışı

Harita, seviye seçimi, dükkan, elmas, günlük bonus, yıldız, XP; konuşan aşçı karakteri; ayran
(sade spec §6 kararı: geri gelirse tek dokunuşlu içecek); biber, lavaş, dürüm, tavuk, kuşbaşı, nane,
maydanoz fişleri; tabak stoğu dokunuşu; çöpe şiş taşıma; raster varlıklar (brief ayrı); sıralama,
ödül, paylaşım kartı, kurallar sayfası (üst spec, plan 4).

## 12. Sahibine açık sorular

1. **Eşlikçi sayısı.** Öneri: ilk sürümde iki kase, domates ve sumaklı soğan. Biber üçüncü kase olarak
   evre 4'te açılabilir; her kase bir kavramdır, önce ikisiyle ölçelim.
2. **Bahşişin solması.** Öneri: 8 sn sonra solar. Hiç solmasın denirse para birikir ve dokunuş
   anlamsızlaşır; solmak bahşişi "yetişilen" bir şey yapar.
3. **Rehberde Bozo usta.** Öneri: ilk sürümde yalnız el ve balon. Konuşan karakter ancak sahibin kendi
   çizdirdiği "Bozo usta" olur (brief'e madde eklenir); jenerik aşçı hiçbir sürümde yok.
4. **Fişin misafir silueti.** Öneri: yüzsüz, üç varyant siluet (referansın karakter portreleri yerine).
   Sahibi gerçek karakter isterse brief'e girer, oyun mantığı değişmez.
5. **Porsiyon rozeti.** Öneri: kalksın (§2). Sahibi "bir porsiyon 12 şiş" mesajını oyunda isterse
   sonuç ekranına tek satır olarak döner ("48 şiş: 4 porsiyon"), HUD'a değil.
