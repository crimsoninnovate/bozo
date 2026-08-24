# Ciğerci Bozo web sitesi · SEO ve AEO spec

Tarih: 24 Ağustos 2026 · Durum: onaylandı

## 1. Bağlam

Tetikleyici: ana sayfa title etiketi ("Ciğerci Bozo", 12 karakter) SEO açısından kısa bulundu.
İnceleme genişledi: on iki rotanın hepsinde title 12-23 karakter (Google'ın gösterdiği ~50-60
karakterin çok altında), meta description'lar 26-86 karakter (ideal ~120-158), JSON-LD
`Restaurant` şeması sağlam ama `hasMenu` yalnız bir URL, sitemap'te `lastModified`/`priority`
yok, ve answer-engine'lerin (AEO) doğrudan alıntılayabileceği yapılandırılmış bir menü/answer
bloğu yok.

## 2. İlke: yeni metin yok

`CLAUDE.md`'nin kuralı kesin: yeni pazarlama metni uydurulamaz, metin
`docs/tasarim/metin-envanteri.json`'dan ya da sahibinin kendi yazdığı bloklardan gelir. Title ve
description birer copy alanı olduğu için bu kural onlara da işler. Bu yüzden her yeni title/
description, sitede zaten yayında olan onaylı cümle parçalarının (hero satırları, `footer.tanim`,
sayfa üstyazıları, saat/adres alanları) yeniden birleştirilmesiyle kuruldu; hiçbir yeni sıfat,
iddia veya cümle eklenmedi. `metin-envanteri.json` satır 16'daki konumlandırma cümlesi tam da bu
iş için yazılmış ama `[ÖNERİ]` etiketli ve işletme onayı bekliyor; kullanılmadı (bkz. §7).

Sahibin kararıyla bu turun kapsamı **teknik/yapısal**: title, description, JSON-LD, sitemap,
`llms.txt`. FAQ/answer-block gibi yeni metin gerektiren AEO içeriği bilerek dışarıda bırakıldı.

## 3. Title etiketleri

`lib/metadata.ts` `sayfaMetadata()` değişmez; kaynak metin `content/{tr,en}/ortak.ts`
`sayfaMeta.{anahtar}.baslik` alanlarında güncellenir.

**TR:**

| Rota | Şu an | Yeni |
|---|---|---|
| ana | `Ciğerci Bozo` | `Ciğerci Bozo · Urfa Usulü Ciğer, Girne` |
| menu | `Menü · Ciğerci Bozo` | `Menü · Ciğerci Bozo, Girne` |
| galeri | `Galeri · Ciğerci Bozo` | `Galeri · Ciğerci Bozo, Girne` |
| hikaye | `Hikaye · Ciğerci Bozo` | `Hikaye · Ciğerci Bozo, Girne` |
| konum | `Konum · Ciğerci Bozo` | `Konum · Ciğerci Bozo, Naci Talat Caddesi, Girne` |
| gizlilik | `Gizlilik · Ciğerci Bozo` | değişmiyor |

**EN** (kaynak: `footer.tanim` = "Urfa style liver over oak embers.", zaten yayında):

| Rota | Şu an | Yeni |
|---|---|---|
| ana | `Ciğerci Bozo` | `Ciğerci Bozo · Urfa Style Liver, Kyrenia` |
| menu | `Menu · Ciğerci Bozo` | `Menu · Ciğerci Bozo, Kyrenia` |
| galeri | `Gallery · Ciğerci Bozo` | `Gallery · Ciğerci Bozo, Kyrenia` |
| hikaye | `Story · Ciğerci Bozo` | `Story · Ciğerci Bozo, Kyrenia` |
| konum | `Location · Ciğerci Bozo` | `Location · Ciğerci Bozo, Naci Talat Street, Kyrenia` |
| gizlilik | `Privacy · Ciğerci Bozo` | değişmiyor |

`gizlilik` kasıtlı dokunulmadı: bir gizlilik sayfasına "Urfa ciğer, Girne" anahtar kelimesi
eklemek konu alaka düzeyini (topical relevance) bozar.

## 4. Meta description'lar

Aynı ilke, `sayfaMeta.{anahtar}.aciklama` güncellenir.

**TR:**

| Rota | Uzunluk | Metin |
|---|---|---|
| ana | 134 | Tavla zarı ciğer, meşe korunda. Girne, Naci Talat Caddesi. Her gün 10:00'dan ertesi sabah 05:00'e kadar açığız. Mekanımız alkolsüzdür. |
| menu | 114 | Hepsi tek ocakta pişer. Altı porsiyon, dürümler, bir özel, sekiz ikram ve içecekler. Girne, her gün 10:00 - 05:00. |
| galeri | 118 | Sitenin beklediği on altı kare: mekan ve ürün fotoğrafları. Girne, Naci Talat Caddesi'nde, her gün 10:00 - 05:00 açık. |
| hikaye | 101 | Urfa'da ustayı tanesinden anlarsınız. Bozo Çağlar, her gün ocağın başında. Girne, Naci Talat Caddesi. |
| konum | 129 | Naci Talat Caddesi, Girne. Her gün 10:00'dan ertesi sabah 05:00'e kadar açığız. Kapanış gece yarısını aşar, ertesi sabaha sarkar. |
| gizlilik | 26 | değişmiyor |

**EN:**

| Rota | Uzunluk | Metin |
|---|---|---|
| ana | 139 | Urfa style liver over oak embers. Kyrenia, Naci Talat Street. Every day from 10:00 until 05:00 the next morning. Our place is alcohol-free. |
| menu | 100 | Six portions from the fire, wraps, eight on the house, and drinks. Kyrenia, every day 10:00 - 05:00. |
| galeri | 118 | Sixteen frames the site is waiting for: the place and the dishes. Kyrenia, Naci Talat Street, every day 10:00 - 05:00. |
| hikaye | 118 | In Urfa, you can tell a master by the size of the cut. Bozo Çağlar, every day at the fire. Kyrenia, Naci Talat Street. |
| konum | 115 | Naci Talat Street, Kyrenia. Every day from 10:00 until 05:00 the next morning. Closed only between 05:00 and 10:00. |
| gizlilik | 27 | değişmiyor |

`menu` açıklaması `menu.acilis.spot`'taki "bir özel" bilgisini de taşıyor; onun dışında her
cümle mevcut `sayfaMeta.aciklama`'nın üstüne, sözlükte zaten var olan başka alanlar eklenerek
uzatıldı. `lib/metadata.test.ts` sözlük değerini birebir karşılaştırdığı için (bkz.
`sayfaMetadata_tumRotalarda_sozlukBasligiVeAciklamasiniTasir`) kendiliğinden geçer; `galeri` ve
`menu` açıklamaları sırasıyla "on altı"/"Sixteen" ve "sekiz"/"eight" alt dizisini taşımaya devam
ettiğinden `content/icerik.test.ts`'in sayı-tutarlılık testleri de değişmeden geçer. Hiçbir test
dosyası bu görev için değiştirilmez.

## 5. JSON-LD: Menu şeması

`restaurantJsonLd()` **değişmez** (imza, testler, `hasMenu` URL'i aynı kalır); risk yaratmadan
mevcut, test edilmiş fonksiyona dokunulmaz. Bunun yerine `lib/jsonld.ts`'e yeni, bağımsız bir
fonksiyon eklenir:

```ts
export function menuJsonLd(dil: Dil): object
```

(`isletmeVerisi` parametresi yok: fonksiyon yalnız ürün/fiyat verisiyle çalışıyor, işletme
kimliğine hiç dokunmuyor — `restaurantJsonLd()`'nin test-override deseni burada gereksiz.)

Kaynak veri `content/urunler.ts` `menuUrunler` (altı kalem: beş ana ürün + `bozo-karisik`) ve
`ozelUrun`; ürün adları `content/{tr,en}/menu.ts` `ocakbasi.urunler.{id}.ad` /
`ocakbasi.ozel.ad`. Yalnız **fiyatı olan** kalemler yazılır. İkramlar ve içecekler fiyat alanı
taşımıyor (`KISITLAR.md`: uydurma fiyat yok), bu yüzden dışarıda kalıyor; içecek fiyatı gelince
genişletilir (bkz. §7).

`hasMenuSection` iki eleman taşır: `menuUrunler`'in altı kalemini içeren "Ocakbaşı" bölümü
(her kalem `tam`/`durum` fiyatına göre bir veya iki `Offer`) ve `ozelUrun`'ü içeren tek kalemlik
"Bozo Special" bölümü (tek `Offer`, `yarim`/`durum` yok).

```json
{
  "@context": "https://schema.org",
  "@type": "Menu",
  "name": "Ocakbaşı",
  "hasMenuSection": [
    {
      "@type": "MenuSection",
      "name": "Ocakbaşı",
      "hasMenuItem": [
        {
          "@type": "MenuItem",
          "name": "Ciğer",
          "offers": [
            { "@type": "Offer", "name": "Tam", "price": "800", "priceCurrency": "TRY" },
            { "@type": "Offer", "name": "Dürüm", "price": "500", "priceCurrency": "TRY" }
          ]
        }
      ]
    }
  ]
}
```

İki kök layout da (`app/(tr)/layout.tsx`, `app/(en)/layout.tsx`) ikinci bir
`<script type="application/ld+json">` ile `menuJsonLd('tr')` / `menuJsonLd('en')` basar; aynı
dosyada zaten `restaurantJsonLd()` bastıkları noktanın hemen yanına. Site genelinde basılması
(yalnız `/menu`'de değil) `restaurantJsonLd()`'nin zaten kurduğu örüntüyle tutarlı: tek işletme,
her sayfada aynı yapısal veri.

`dil` parametresi yalnız ürün *adları* için var; işletme kimliği (adres, telefon, saat) hâlâ tek
gerçek ve dil ayrımı yapmıyor. Bu, `restaurantJsonLd()`'nin "tek işletme tek gerçek" kararıyla
çelişmiyor: o karar kimlik alanları için, ürün adları zaten `content/{tr,en}/menu.ts`'te ayrı
ayrı yaşayan çeviri metni.

## 6. JSON-LD: BreadcrumbList

Yeni fonksiyon:

```ts
export function breadcrumbJsonLd(anahtar: RotaAnahtari, dil: Dil): object
```

`lib/site.ts` `yol()` ve `tumYollar()`'dan kurulur (yeni metin değil, mevcut rota adları).
Enjeksiyon noktası tek: `components/sayfa/Kabuk.tsx`, çünkü on iki rotanın hepsi zaten oraya
kendi `dil` ve `aktif` (= `RotaAnahtari`) prop'unu geçiriyor. On iki `page.tsx` dosyasının hiçbiri
değişmez. Ana sayfada (`aktif === 'ana'`) breadcrumb basılmaz, standart pratik.

## 7. Sitemap

`app/sitemap.ts`'e rota başına `lastModified`, `changeFrequency`, `priority` eklenir:

| Rota | priority | changeFrequency |
|---|---|---|
| ana | 1.0 | weekly |
| menu | 0.9 | monthly |
| galeri | 0.6 | monthly |
| konum | 0.7 | yearly |
| hikaye | 0.5 | yearly |
| gizlilik | 0.3 | yearly |

`lastModified: new Date()` (build zamanı), Next'in kendi dokümantasyonundaki örnekle birebir
aynı kalıp (`node_modules/next/dist/docs/.../sitemap.md`). `robots.ts` zaten doğru, dokunulmuyor.

## 8. `llms.txt`

Metin üretimi `lib/llmsTxt.ts`'te saf bir fonksiyon olarak yaşar (projenin `lib/` deseniyle
tutarlı: mantık `lib/`'te, dosya konvansiyonu `app/`'ta ince bir sarmalayıcı):

```ts
// lib/llmsTxt.ts
export function llmsTxt(): string
```

`app/llms.txt/route.ts`, Next'in route handler ile statik metin üretme kalıbını kullanır
(`node_modules/next/dist/docs/.../static-exports.md` > Route Handlers; repodaki örnek:
`app/rss.xml/route.ts`):

```ts
import { llmsTxt } from '@/lib/llmsTxt'

export const dynamic = 'force-static'

export async function GET() {
  return new Response(llmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

Elle yazılmış statik bir dosya DEĞİL: `sozluk()`, `tumYollar()` ve `isletme`'den derlenir, tıpkı
`sitemap.ts`/`robots.ts` gibi. Böylece bir rota eklenip `llms.txt` unutulduğunda dosya sessizce
bayatlamaz; bu proje zaten bir kez (CLAUDE.md'nin renk tablosu, 24 Ağustos) elle senkronize
belgenin bayatlamasıyla karşılaştı.

İçerik yalnız olgusal: işletme adı, adres, saat, mutfak, alkol politikası (hepsi
`content/isletme.ts` / `lib/saat.ts`'ten), ardından on iki rotanın linki ve her birinin
`sayfaMeta.aciklama`'sı (zaten var olan metin, yeniden yazılmıyor). Yeni cümle yok.

## 9. Kapsam dışı / owner'a bekleyen

- **FAQ / answer-block AEO içeriği.** Yeni metin gerektirir, bu turda yazılmadı.
  `docs/surec/IYILESTIRMELER.md`'ye bekleyen madde olarak düşülecek.
- **`metin-envanteri.json` satır 16'daki `[ÖNERİ]` etiketli konumlandırma cümlesi**
  ("Ciğerci Bozo, Girne'de gece beşe kadar açık kalan, Urfa'nın tavla zarı ciğerini meşe korunda
  pişiren ciğercidir.") tam da meta açıklama zemini için yazılmış ama onay bekliyor; aynı
  maddeye not düşülecek.
- **İçecek fiyatları gelene kadar `Menu` şeması eksik kalır** (bekleyen iş listesinde zaten var,
  `DEVAM.md` madde 1).

## 10. Test planı

- `content/icerik.test.ts`: güncellenen `sayfaMeta.{anahtar}.baslik`/`aciklama` değerlerine göre
  ilgili satırlar güncellenir (mevcut desen: sözlük değerini doğrudan karşılaştırma).
- `lib/jsonld.test.ts`: `menuJsonLd()` ve `breadcrumbJsonLd()` için yeni testler — fiyatsız
  kalemlerin (ikram, içecek) hiç yazılmadığını, `dil` başına ürün adının doğru geldiğini,
  `aktif === 'ana'` iken breadcrumb'ın hiç basılmadığını doğrular. Var olan `restaurantJsonLd`
  testleri değişmeden kalır (fonksiyon imzası sabit).
- Yeni `lib/llmsTxt.test.ts`: üretilen metnin on iki rotanın hepsini içerdiğini, hiçbir uydurma
  alanın (fiyat, rating) sızmadığını doğrular.
- `npm run typecheck`, `npm run build`, `npm run test` yeşil; on iki rota 200, konsol temiz
  (mevcut doğrulama alışkanlığı, `DEVAM.md`'de kayıtlı).

## 11. Dokunulacak dosyalar

`content/tr/ortak.ts`, `content/en/ortak.ts`, `content/icerik.test.ts`, `lib/jsonld.ts`,
`lib/jsonld.test.ts`, `app/(tr)/layout.tsx`, `app/(en)/layout.tsx`, `components/sayfa/Kabuk.tsx`,
`app/sitemap.ts`, `lib/llmsTxt.ts` (yeni), `lib/llmsTxt.test.ts` (yeni),
`app/llms.txt/route.ts` (yeni), `docs/surec/IYILESTIRMELER.md`.
