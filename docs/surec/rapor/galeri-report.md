# Galeri sayfası

Brief: `docs/surec/brief/galeri-brief.md`. Sahibinin tasarım talebinin beşinci
sayfası: "Galeri (12-18 kare, tembel yüklemeli ızgara)". Bu sayfanın çizimi yok;
ölçüt tasarıma sadakat değil, sitenin kendi kurduğu dilden sapmamak.

## Ne kuruldu

| Dosya | Ne |
|---|---|
| `app/(tr)/galeri/page.tsx`, `app/(en)/en/galeri/page.tsx` | İki rota, `Kabuk` ile sarılı |
| `components/sayfa/GaleriSayfasi.tsx` + `.module.css` | Başlık bloğu, ızgara, yapay zeka notu |
| `components/sayfa/galeri/Izgara.tsx` + `.module.css` | Manifestin on altı kadrajı |
| `content/tr/galeri.ts`, `content/en/galeri.ts` | Üç anahtar, hepsinin kaynağı dosyada yazılı |
| `lib/site.ts`, `lib/kabuk.ts` | Rota tabloları, nav ve footer listeleri |
| `content/{tr,en}/ortak.ts` | `nav.galeri` ve `sayfaMeta.galeri` |

Rota adı iki dilde de Türkçe: `/galeri/` ve `/en/galeri/`. Sitemap ikisini de
taşıyor (`out/sitemap.xml`, hreflang çiftiyle).

## Menüdeki "Çekim listesi" ile ilişki: karar

**İkisi aynı şeyi söylemiyor ama bugün aynı görünüyor. Galeri kuruldu, menüdeki
bölüme dokunulmadı, ve fotoğraflar geldiğinde o bölümün silinmesi öneriliyor.**

Ölçülen fark:

| | Menü > Çekim listesi | Galeri |
|---|---|---|
| Kaynak | Tasarımda var (Menu:264-281) | Tasarımda yok |
| Kapsam | Manifestten seçilmiş **yedi** kare | Manifestin **tamamı**, on altı kare |
| Konusu | Menünün beklediği kareler | Sitenin fotoğraf yüzeyi |
| Plaka | `karo`, 110px, kontrol listesi ölçüsü | `kart`, 240-300px, fotoğrafın okunacağı ölçü |
| Muhatabı | İşletme (neden plakalar karanlık) | Misafir |

Yani biri seçki, öteki bütün; sahiplik ayrı ve `Izgara` elle yazılmış ikinci bir
liste tutmuyor, doğrudan `content/fotograflar.ts`'i basıyor.

Ama boş durumda bu ayrım misafire görünmüyor: yedi kare iki sayfada da aynı
etiketlerle, aynı karanlık plaka olarak çıkıyor. Bu gerçek bir tekrar ve
**fotoğraflar gelince kendiliğinden çözülüyor**: ürün kartları kendi karesini
taşımaya başladığında menüdeki bölümün işi ("bu yedi kare eksik") biter, galeri
ise asıl işine başlar.

Öneri (uygulanmadı, menü dosyalarına dokunulmadı): fotoğraflar geldiğinde
`CekimListesi` ya silinsin ya da tek satırlık bir `/galeri/` bağlantısına insin.
İkincisi menü sayfasından galeriye giden yolu da açar, ki aşağıdaki nav kararı
yüzünden şu an o yol yok.

## Metin: ne bulundu, ne uydurulmadı

`docs/tasarim/metin-envanteri.json` (371 satır, 31 hazır blok) ve
`~/Desktop/Bozo/Cigerci-Bozo-proje-bilgi-dosyasi-v2.md` (1076 satır) tarandı.

**Bulunan:**

| Ne | Nerede |
|---|---|
| Sayfanın adı "Galeri" | Tasarım talebi 17. satır; proje bilgi dosyası 751 (site haritası satırı) |
| Sayfanın amacı "Mekan ve ürün fotoğrafları" | Proje bilgi dosyası 751 |
| On altı kadraj etiketi, TR ve EN | `content/fotograflar.ts` (Task 3'te onaylı) |
| Yapay zeka görseli notu | `menu.cekim.aiGorselNotu`, kaynağı Menu:279 |

**Bulunmayan ve uydurulmayan:**

- Sayfa için hazır bir **H1** yok. Kullanılan "Galeri" bir sayfa adı, pazarlama
  metni değil, ve iki ayrı kaynakta bu adla geçiyor.
- **Spot paragrafı yok.** Envanterin 31 bloğunun hiçbiri fotoğrafla ilgili değil.
  Proje bilgi dosyasının 8.5 bölümü (698-715) fotoğraf yönergesi taşıyor ama o
  fotoğrafçıya yazılmış, siteye değil. Yazılmadı.
- **Kare başına açıklama yok.** Plakalar yalnız kadraj etiketini taşıyor.
- **"Fotoğraflar hazırlanıyor" gibi bir boş durum cümlesi yok.** Yerine menüdeki
  onaylı cümle birebir kullanıldı: "Yapay zeka ile üretilmiş yemek görseli
  kullanılmıyor. Yuvalar çekim gelene kadar karanlık kalır."

**Türetilen iki satır** (kaynağı var ama cümlesi hazır değil, sahibinin onayına
açık):

| Anahtar | TR | Nasıl kuruldu |
|---|---|---|
| `galeri.altMetin` | Sitenin beklediği on altı kare | Menünün onaylı "Menünün beklediği yedi kare" kalıbı; yalnız kapsam ve sayı değişti. Olgusal, iddiasız |
| `sayfaMeta.galeri.aciklama` | Sitenin beklediği on altı kare: mekan ve ürün fotoğrafları. | Yukarıdaki satır + site haritasının amaç satırı. Sayı öne alındı ki meta, olmayan fotoğrafları var gibi göstermesin |

Marka denetimi: em dash yok (test), kilitli terminoloji ihlali yok, yasaklı
ifade yok. "Izgara" kelimesi görünür metinde geçmiyor (terminoloji kilidi onu
pişirme kelimesi olarak yasaklıyor; kodda yalnız CSS sınıf adı olarak var).

## Nav kararı: galeri üç barda var, menü barında yok

Tasarımın çekmece listesi zaten `Menü / Hikaye / Konum / Galeri / Rezervasyon`
yazıyordu; Galeri yalnız `RotaAnahtari` karşılığı olmadığı için düşürülmüştü
(`IYILESTIRMELER.md` > `Cekmece` bağlı link listesi). Rota kurulunca geri geldi
ve **listelerin sonuna** girdi, çünkü o listedeki yeri orasıydı.

Menü barına eklenmedi. Ölçüm (781px, statik export):

| Bar | Nav öğesi | Satır genişliği | En sağdaki bağlantının sağ kenarı |
|---|---|---|---|
| Menü, galeri eklenmiş | 6 | 803px | 862px (görünür alan 781px) |
| Menü, galerisiz (kalan hal) | 5 | 731px | 792px |
| Ana | 5 | | 742px |

Altıncı öğe "Yol tarifi al" butonunu 781-802px bandında ekranın dışına itiyor.
Nav 780px altında çekmeceye düştüğü için bant 22px genişliğinde, ama kırık bir
CTA eksik bir nav öğesinden kötü. Kural bir testle kilitlendi
(`ustBar_galeri_menuBarindaYokDigerUcundeVar`).

Yan bulgu, bu görevin ürünü değil: menü barı **galeri eklenmeden de** 781px'te
11px taşıyor (792 > 781). `UstBar` bu görevin dosyası değildi, dokunulmadı.

Sonuç: galeri ana sayfa, hikaye, konum ve gizlilik üst barlarından, ayrıca
hikaye/konum/galeri footer'larının "Sayfalar" kolonundan ulaşılır. Menü
sayfasından ulaşılmaz (footer'ı `serit` varyantı, sayfa bağlantısı taşımaz).
Yukarıdaki `CekimListesi` önerisi bu boşluğu da kapatır.

## Ölçümler

`npx serve out -l 4318`, kendi tarayıcı sekmesi.

| Ne | 1440x900 | 390x844 | Kaynak |
|---|---|---|---|
| Izgara kolonları | 3 x 371px | 1 x 342px | `minmax(280px,1fr)`, Ocaktan:93 |
| Izgara boşluğu | 34px | 20px | `clamp(20px,2.4vw,34px)`, Ocaktan:94 |
| Plaka | 371x270 | 342x253 | `kart`, `clamp(240px,30vh,300px)`, Menu:126 |
| Sayfa payı | 172 / 130 / 80 | 172 / 24 / 80 | Konum:63, Menu:264 |
| H1 | 48px 700 Bricolage | 32px | `--ol-bolum-baslik`, GizlilikSayfasi:38 |
| Alt metin | 13.5px/1.5 krem .64 | aynı | CekimListesi:32, Menu:268 |
| Yapay zeka notu | 13px/1.6 krem .60 | aynı | CekimListesi:44, Menu:279 |
| Yatay taşma | yok (1440/1440) | yok (390/390) | |
| Plaka sayısı | 16 | 16 | `content/fotograflar.ts` |
| Çekmece butonu | | 44x44 | erişilebilirlik tabanı |

Erişilebilirlik: tam bir `h1`, sayfada başka başlık yok (ızgara başlıksız, çünkü
tek bir bölüm); `<article>` içinde `<header>` + ızgara + not; plakaların dekoratif
katmanları (kor, vinyet, köşe işaretleri) zaten `aria-hidden`; aktif nav öğesi
`aria-current="page"` taşıyan bir `<span>`. Plakalar tıklanabilir değil, yani 44px
kuralı bağlamıyor. Yeni hareket eklenmedi; plakaların kor nefesi
`animasyonlar.css`'in `prefers-reduced-motion` kuralıyla zaten susuyor.

## Tembel yükleme: ölçülmedi

Brief tembel yükleme istiyor. `FotoYuvasi` `dosya` dolduğunda `next/image`'a
geçiyor ve `priority` verilmediği için Next varsayılan olarak `loading="lazy"`
basıyor. **Bugün on altı karenin hiçbirinde dosya yok, yani yüklenen bir görsel
de yok ve bu yol ölçülemedi.** Sayfada `<img>` sayısı: 0. Fotoğraflar geldiğinde
ölçülmesi gereken iki şey kalıyor: ilk ekrandaki kaç plakanın `priority`
alması gerektiği, ve `sizes` değerinin galeri ızgarasına uyup uymadığı
(`FotoYuvasi` bugün `(max-width: 780px) 100vw, 50vw` basıyor, galeride 1440px'te
kolon 371px, yani `50vw` fazla).

## Kapılar

    npm run typecheck   temiz
    npm test            74 test, 74 geçti (73 idi; menü barı kararı için bir test eklendi)
    npm run build       temiz, 16 sayfa

Rota tablosu:

    ┌ ○ /
    ├ ○ /_not-found
    ├ ○ /en
    ├ ○ /en/galeri
    ├ ○ /en/gizlilik
    ├ ○ /en/hikaye
    ├ ○ /en/konum
    ├ ○ /en/menu
    ├ ○ /galeri
    ├ ○ /gizlilik
    ├ ○ /hikaye
    ├ ○ /konum
    ├ ○ /menu
    ├ ○ /robots.txt
    └ ○ /sitemap.xml

`gecici-` ile başlayan rota yok; bu görevde geçici rota hiç açılmadı, sayfa
kendi rotasında kuruldu.

## Sahibine sorulacaklar

1. **Galeri sayfasına bir spot cümlesi ister misiniz?** Bugün sayfa başlık, kare
   sayısı ve yapay zeka notundan ibaret. Hazır metin yoktu, uydurulmadı.
2. **`altMetin` ve meta açıklaması onaylanıyor mu?** İkisi de mevcut kaynaklardan
   türetildi, birebir alıntı değil (yukarıdaki tablo).
3. **Fotoğraflar geldiğinde menüdeki "Çekim listesi" bölümü ne olsun?** Silinsin
   mi, `/galeri/` bağlantısına mı insin?
4. **Menü sayfasından galeriye bir yol ister misiniz?** Bugün yok; üst bara
   eklemek 781-802px bandında CTA'yı kırıyor.
5. **On altı kare çok mu?** Talep 12-18 diyor, manifest 16 taşıyor ve hepsi
   basıldı. `tane-yakin-cekim` ile `tane-yakin-cekim-yatay` aynı konunun iki
   kadrajı; galeride ikisi de görünüyor, istenirse yatay olan menüye özel kalabilir.
6. **1440px'te üç kolon yeterli mi?** Ölçü menü ürün ızgarasından birebir alındı.
   Dört kolon isterseniz galeriye özel bir ızgara ölçüsü gerekir.
