# SEO ve AEO teknik geçişi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On iki rotanın title/description'larını SEO için genişletmek, `Menu`/`BreadcrumbList`
JSON-LD şemalarını eklemek, sitemap'i zenginleştirmek ve build-time üretilen bir `llms.txt`
eklemek — hepsi sitede zaten onaylı olan metinden, yeni pazarlama cümlesi yazmadan.

**Architecture:** İçerik değişiklikleri `content/{tr,en}/ortak.ts`'te; yapısal veri `lib/jsonld.ts`
ve yeni `lib/llmsTxt.ts`'te saf, test edilebilir fonksiyonlar olarak yaşar. `app/` katmanı yalnız
bu fonksiyonları çağıran ince sarmalayıcılardır (var olan `sitemap.ts`/`robots.ts` deseniyle
birebir aynı). Hiçbir mevcut fonksiyon imzası kırılmaz (`restaurantJsonLd()` dokunulmadan kalır).

**Tech Stack:** Next.js 16 App Router, TypeScript strict (`noUncheckedIndexedAccess: true`),
`node --test`.

**Spec:** `docs/specs/2026-08-24-seo-aeo-design.md`

## Global Constraints

- Yeni pazarlama metni yazılamaz: her yeni title/description/özet cümlesi, sitede zaten onaylı
  olan parçalardan (hero satırları, `footer.tanim`, `ortak.satirlar`, `ortak.alkolsuzKisa`,
  sayfa üstyazıları) kurulur.
- `restaurantJsonLd()` imzası ve davranışı **değişmez**; mevcut testler (`lib/jsonld.test.ts`)
  değiştirilmeden geçmeye devam eder.
- Uydurma fiyat/derece/rating yazılmaz: yalnız `content/urunler.ts`'te gerçekten fiyatı olan
  kalemler (`menuUrunler`, `ozelUrun`) yapısal veriye girer; ikramlar ve içecekler dışarıda kalır.
- Max fonksiyon uzunluğu 50 satır, max dosya 700 satır, max satır genişliği 120 karakter.
- `tsconfig.json`: `strict: true`, `noUncheckedIndexedAccess: true`, `noUnusedLocals`,
  `noUnusedParameters` — dinamik sözlük erişimi her yerde `Record<string, T>` cast + `if (!x) throw`
  ile korunur, sessiz `?? yerTutucu` kullanılmaz (fail fast).
- Import'lar `.ts` uzantılı göreli yol (`lib/`, `content/` içi) ya da `@/*` alias (`app/`,
  `components/` içi) — dosyanın zaten kullandığı kalıba uyulur.
- Commit mesajları: imperative mood, İngilizce, ilk satır 72 karakter altı, **assistant imzası
  yok** (`Co-Authored-By` yok).

---

### Task 1: Title ve meta description genişletmesi

**Files:**
- Modify: `content/tr/ortak.ts` (satır ~110-133, `sayfaMeta` bloğu)
- Modify: `content/en/ortak.ts` (satır ~101-124, `sayfaMeta` bloğu)
- Test: mevcut `lib/metadata.test.ts` ve `content/icerik.test.ts` (değiştirilmez, doğrulama için
  çalıştırılır)

**Interfaces:**
- Consumes: yok (yalnız içerik verisi)
- Produces: `sayfaMeta.{ana,menu,galeri,hikaye,konum,gizlilik}.{baslik,aciklama}` — Task 2-8'in
  hiçbiri bu alanlara bağımlı değil, bağımsız çalıştırılabilir.

- [ ] **Step 1: `content/tr/ortak.ts`'teki `sayfaMeta` bloğunu değiştir**

Şu anki blok (yorum dahil) tam olarak:

```ts
  /** Rota başına sayfa başlığı ve açıklaması. Anahtarlar RotaAnahtari ile birebir eşleşir. */
  sayfaMeta: {
    ana: {
      baslik: 'Ciğerci Bozo',
      aciklama: 'Tavla zarı ciğer, meşe korunda. Girne, Naci Talat Caddesi. Her gün 10:00 - 05:00.',
    },
    menu: {
      baslik: 'Menü · Ciğerci Bozo',
      aciklama: 'Altı porsiyon, dürümler, sekiz ikram ve içecekler.',
    },
    /**
     * Açıklama sayfanın kendi iki satırından kuruldu: kare sayısı (galeri.altMetin)
     * ve site haritasındaki amaç satırı ("Mekan ve ürün fotoğrafları"). Fotoğraflar
     * gelmeden var gibi göstermemek için sayı öne alındı.
     */
    galeri: {
      baslik: 'Galeri · Ciğerci Bozo',
      aciklama: 'Sitenin beklediği on altı kare: mekan ve ürün fotoğrafları.',
    },
    hikaye: { baslik: 'Hikaye · Ciğerci Bozo', aciklama: "Urfa'da ustayı tanesinden anlarsınız." },
    konum: {
      baslik: 'Konum · Ciğerci Bozo',
      aciklama: "Naci Talat Caddesi, Girne. Her gün 10:00'dan ertesi sabah 05:00'e kadar.",
    },
    gizlilik: { baslik: 'Gizlilik · Ciğerci Bozo', aciklama: 'Bu sitenin veri yaklaşımı.' },
  },
```

Bunu şununla değiştir:

```ts
  /**
   * Rota başına sayfa başlığı ve açıklaması. Anahtarlar RotaAnahtari ile birebir eşleşir.
   * Title ve description SEO için genişletildi (24 Ağustos 2026, spec:
   * docs/specs/2026-08-24-seo-aeo-design.md); her cümle sitede zaten onaylı olan parçalardan
   * yeniden kuruldu, yeni metin yazılmadı.
   */
  sayfaMeta: {
    ana: {
      baslik: 'Ciğerci Bozo · Urfa Usulü Ciğer, Girne',
      aciklama:
        "Tavla zarı ciğer, meşe korunda. Girne, Naci Talat Caddesi. Her gün 10:00'dan ertesi " +
        "sabah 05:00'e kadar açığız. Mekanımız alkolsüzdür.",
    },
    menu: {
      baslik: 'Menü · Ciğerci Bozo, Girne',
      aciklama:
        'Hepsi tek ocakta pişer. Altı porsiyon, dürümler, bir özel, sekiz ikram ve içecekler. ' +
        'Girne, her gün 10:00 - 05:00.',
    },
    /**
     * Açıklama sayfanın kendi iki satırından kuruldu: kare sayısı (galeri.altMetin)
     * ve site haritasındaki amaç satırı ("Mekan ve ürün fotoğrafları"). Fotoğraflar
     * gelmeden var gibi göstermemek için sayı öne alındı.
     */
    galeri: {
      baslik: 'Galeri · Ciğerci Bozo, Girne',
      aciklama:
        "Sitenin beklediği on altı kare: mekan ve ürün fotoğrafları. Girne, Naci Talat " +
        "Caddesi'nde, her gün 10:00 - 05:00 açık.",
    },
    hikaye: {
      baslik: 'Hikaye · Ciğerci Bozo, Girne',
      aciklama:
        "Urfa'da ustayı tanesinden anlarsınız. Bozo Çağlar, her gün ocağın başında. " +
        'Girne, Naci Talat Caddesi.',
    },
    konum: {
      baslik: 'Konum · Ciğerci Bozo, Naci Talat Caddesi, Girne',
      aciklama:
        "Naci Talat Caddesi, Girne. Her gün 10:00'dan ertesi sabah 05:00'e kadar açığız. " +
        'Kapanış gece yarısını aşar, ertesi sabaha sarkar.',
    },
    gizlilik: { baslik: 'Gizlilik · Ciğerci Bozo', aciklama: 'Bu sitenin veri yaklaşımı.' },
  },
```

- [ ] **Step 2: `content/en/ortak.ts`'teki `sayfaMeta` bloğunu değiştir**

Şu anki blok tam olarak:

```ts
  sayfaMeta: {
    ana: {
      baslik: 'Ciğerci Bozo',
      aciklama:
        'Urfa style liver over oak embers. Kyrenia, Naci Talat Street. Every day 10:00 - 05:00.',
    },
    menu: {
      baslik: 'Menu · Ciğerci Bozo',
      aciklama: 'Six portions from the fire, wraps, eight on the house, and drinks.',
    },
    galeri: {
      baslik: 'Gallery · Ciğerci Bozo',
      aciklama: 'Sixteen frames the site is waiting for: the place and the dishes.',
    },
    hikaye: {
      baslik: 'Story · Ciğerci Bozo',
      aciklama: 'In Urfa, you can tell a master by the size of the cut.',
    },
    konum: {
      baslik: 'Location · Ciğerci Bozo',
      aciklama: 'Naci Talat Street, Kyrenia. Every day from 10:00 until 05:00 the next morning.',
    },
    gizlilik: { baslik: 'Privacy · Ciğerci Bozo', aciklama: 'How this site handles data.' },
  },
```

Bunu şununla değiştir:

```ts
  /**
   * Title ve description SEO için genişletildi (24 Ağustos 2026, spec:
   * docs/specs/2026-08-24-seo-aeo-design.md); kaynak `footer.tanim` = "Urfa style liver over
   * oak embers.", zaten yayında olan birebir metin.
   */
  sayfaMeta: {
    ana: {
      baslik: 'Ciğerci Bozo · Urfa Style Liver, Kyrenia',
      aciklama:
        'Urfa style liver over oak embers. Kyrenia, Naci Talat Street. Every day from 10:00 ' +
        'until 05:00 the next morning. Our place is alcohol-free.',
    },
    menu: {
      baslik: 'Menu · Ciğerci Bozo, Kyrenia',
      aciklama:
        'Six portions from the fire, wraps, eight on the house, and drinks. Kyrenia, every ' +
        'day 10:00 - 05:00.',
    },
    galeri: {
      baslik: 'Gallery · Ciğerci Bozo, Kyrenia',
      aciklama:
        'Sixteen frames the site is waiting for: the place and the dishes. Kyrenia, Naci ' +
        'Talat Street, every day 10:00 - 05:00.',
    },
    hikaye: {
      baslik: 'Story · Ciğerci Bozo, Kyrenia',
      aciklama:
        'In Urfa, you can tell a master by the size of the cut. Bozo Çağlar, every day at ' +
        'the fire. Kyrenia, Naci Talat Street.',
    },
    konum: {
      baslik: 'Location · Ciğerci Bozo, Naci Talat Street, Kyrenia',
      aciklama:
        'Naci Talat Street, Kyrenia. Every day from 10:00 until 05:00 the next morning. ' +
        'Closed only between 05:00 and 10:00.',
    },
    gizlilik: { baslik: 'Privacy · Ciğerci Bozo', aciklama: 'How this site handles data.' },
  },
```

- [ ] **Step 3: Doğrula**

Run: `npm run typecheck && npm run test`
Expected: PASS, tüm testler yeşil. `lib/metadata.test.ts`
(`sayfaMetadata_tumRotalarda_sozlukBasligiVeAciklamasiniTasir`) yeni title/description'ları
otomatik doğrular; `content/icerik.test.ts`'in `galeri_kareSayisi_metindekiSayiylaAyni` ve
`ikram_sayisi_metindekiSayiylaAyni` testleri "on altı"/"Sixteen" ve "sekiz"/"eight" alt dizileri
korunduğu için değişmeden geçer.

- [ ] **Step 4: Commit**

```bash
git add content/tr/ortak.ts content/en/ortak.ts
git commit -m "Expand page titles and descriptions for SEO"
```

---

### Task 2: `menuJsonLd()` — Menu yapısal verisi

**Files:**
- Modify: `lib/jsonld.ts`
- Test: `lib/jsonld.test.ts`

**Interfaces:**
- Consumes: `content/urunler.ts` (`menuUrunler: Urun[]`, `ozelUrun: OzelUrun`),
  `content/index.ts` (`sozluk(dil): Sozluk`), `lib/site.ts` (`SITE_URL: string`,
  `yol(anahtar, dil): string`)
- Produces: `menuJsonLd(dil: Dil): object` — Task 3 bunu doğrudan çağırır.

- [ ] **Step 1: Başarısız testleri yaz**

`lib/jsonld.test.ts`'in sonuna ekle (dosyanın üstündeki importlara `menuJsonLd` eklenecek,
Step 3'te):

```ts
type Offer = { '@type': string; name?: string; price: string; priceCurrency: string }
type MenuItem = { '@type': string; name: string; offers: Offer[] }
type MenuSection = { '@type': string; name: string; hasMenuItem: MenuItem[] }

test('menuJsonLd_ocakbasiBolumu_altiKalemTasir', () => {
  const veri = menuJsonLd('tr') as Record<string, unknown>
  const bolumler = veri.hasMenuSection as MenuSection[]
  assert.equal(bolumler[0]?.hasMenuItem.length, 6)
})

test('menuJsonLd_cigerKalemi_tamVeDurumOfferiTasir', () => {
  const veri = menuJsonLd('tr') as Record<string, unknown>
  const bolumler = veri.hasMenuSection as MenuSection[]
  const ciger = bolumler[0]?.hasMenuItem.find((k) => k.name === 'Ciğer')
  assert.ok(ciger)
  assert.deepEqual(ciger.offers, [
    { '@type': 'Offer', name: 'Tam', price: '800', priceCurrency: 'TRY' },
    { '@type': 'Offer', name: 'Dürüm', price: '500', priceCurrency: 'TRY' },
  ])
})

test('menuJsonLd_ozelBolumu_tekKalemTekOfferTasir', () => {
  const veri = menuJsonLd('tr') as Record<string, unknown>
  const bolumler = veri.hasMenuSection as MenuSection[]
  assert.equal(bolumler[1]?.name, 'Bozo Special')
  assert.equal(bolumler[1]?.hasMenuItem.length, 1)
  assert.deepEqual(bolumler[1]?.hasMenuItem[0]?.offers, [
    { '@type': 'Offer', price: '1000', priceCurrency: 'TRY' },
  ])
})

test('menuJsonLd_urunAdlari_dileGoreDegisir', () => {
  const trVeri = menuJsonLd('tr') as Record<string, unknown>
  const enVeri = menuJsonLd('en') as Record<string, unknown>
  const trAd = (trVeri.hasMenuSection as MenuSection[])[0]?.hasMenuItem[0]?.name
  const enAd = (enVeri.hasMenuSection as MenuSection[])[0]?.hasMenuItem[0]?.name
  assert.equal(trAd, 'Ciğer')
  assert.equal(enAd, 'Urfa Liver Kebab (Ciğer)')
})

test('menuJsonLd_ikramVeIcecekAdlari_hicGecmez', () => {
  const metin = JSON.stringify(menuJsonLd('tr'))
  assert.equal(metin.includes('Lebeni'), false)
  assert.equal(metin.includes('Bostana'), false)
  assert.equal(metin.includes('Ayran'), false)
})

test('menuJsonLd_temelAlanlar_dogruBasar', () => {
  const veri = menuJsonLd('tr') as Record<string, unknown>
  assert.equal(veri['@context'], 'https://schema.org')
  assert.equal(veri['@type'], 'Menu')
  assert.equal(veri.url, 'https://cigercibozo.com/menu/')
})
```

- [ ] **Step 2: Testi çalıştırıp başarısız olduğunu doğrula**

Run: `npm run test`
Expected: FAIL — `menuJsonLd is not defined` (henüz import edilmedi/yazılmadı)

- [ ] **Step 3: `lib/jsonld.ts`'e fonksiyonu ekle**

Dosyanın üst importlarını şuna genişlet (mevcut dört satırın hemen altına ekle):

```ts
import { sozluk, type Sozluk } from '../content/index.ts'
import type { Dil, Urun } from '../content/types.ts'
import { menuUrunler, ozelUrun } from '../content/urunler.ts'
```

Dosyanın sonuna (mevcut `restaurantJsonLd` fonksiyonundan sonra) ekle:

```ts
function urunAdi(s: Sozluk, id: string): string {
  const urunler = s.menu.ocakbasi.urunler as Record<string, { ad: string }>
  const kayit = urunler[id]
  if (!kayit) throw new Error(`menuJsonLd: "${id}" için ürün adı sözlükte yok`)
  return kayit.ad
}

function urunOfferleri(s: Sozluk, urun: Urun): Offer[] {
  const offers: Offer[] = []
  if (urun.tam !== null) {
    offers.push({
      '@type': 'Offer',
      name: s.menu.ocakbasi.olculer.tam,
      price: String(urun.tam),
      priceCurrency: 'TRY',
    })
  }
  if (urun.durum !== null) {
    offers.push({
      '@type': 'Offer',
      name: s.menu.ocakbasi.olculer.durum,
      price: String(urun.durum),
      priceCurrency: 'TRY',
    })
  }
  return offers
}

type Offer = { '@type': string; name?: string; price: string; priceCurrency: string }

/**
 * schema.org `Menu` yapısal verisi. Yalnız fiyatı olan kalemler yazılır: `menuUrunler`
 * (altı ana ürün) ve `ozelUrun`. İkramlar ve içecekler fiyat alanı taşımıyor
 * (`KISITLAR.md`: uydurma fiyat yok), bu yüzden hiç görünmezler. `restaurantJsonLd()`'den
 * bağımsız, ayrı bir `<script>` olarak basılır (bkz. app/(tr)/layout.tsx, app/(en)/layout.tsx).
 */
export function menuJsonLd(dil: Dil): object {
  const s = sozluk(dil)

  const ocakbasiKalemleri = menuUrunler
    .map((urun) => ({
      '@type': 'MenuItem',
      name: urunAdi(s, urun.id),
      offers: urunOfferleri(s, urun),
    }))
    .filter((kalem) => kalem.offers.length > 0)

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: s.menu.ocakbasi.baslik,
    url: `${SITE_URL}${yol('menu', dil)}`,
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: s.menu.ocakbasi.baslik,
        hasMenuItem: ocakbasiKalemleri,
      },
      {
        '@type': 'MenuSection',
        name: s.menu.ocakbasi.ozel.ad,
        hasMenuItem: [
          {
            '@type': 'MenuItem',
            name: s.menu.ocakbasi.ozel.ad,
            offers: [{ '@type': 'Offer', price: String(ozelUrun.fiyat), priceCurrency: 'TRY' }],
          },
        ],
      },
    ],
  }
}
```

`Offer` tipini `urunOfferleri`'den önce, dosyanın en altına taşımak yerine ilk kullanımından
hemen önce tanımlamak Türkçe okunuş sırasını bozmaz; TypeScript tip bildirimlerini hoisting ile
her yerden görür, sıralama derlemeyi etkilemez.

- [ ] **Step 4: `lib/jsonld.test.ts`'in üstüne `menuJsonLd` import'unu ekle**

```ts
import { restaurantJsonLd, menuJsonLd } from './jsonld.ts'
```

- [ ] **Step 5: Testleri çalıştırıp geçtiğini doğrula**

Run: `npm run test`
Expected: PASS, Step 1'deki altı yeni test dahil hepsi yeşil.

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: PASS (özellikle `noUncheckedIndexedAccess` altında `urunAdi`'nin `if (!kayit) throw`
koruması derleme hatası vermemeli).

- [ ] **Step 7: Commit**

```bash
git add lib/jsonld.ts lib/jsonld.test.ts
git commit -m "Add menuJsonLd structured data for priced menu items"
```

---

### Task 3: `menuJsonLd()`'yi kök layout'lara bağla

**Files:**
- Modify: `app/(tr)/layout.tsx`
- Modify: `app/(en)/layout.tsx`

**Interfaces:**
- Consumes: `menuJsonLd(dil: Dil): object` (Task 2)
- Produces: her sayfada ikinci bir `<script type="application/ld+json">` etiketi (test yok, build
  ile doğrulanır)

- [ ] **Step 1: `app/(tr)/layout.tsx`'i güncelle**

Şu anki dosya:

```tsx
import { fontSiniflari } from '@/lib/fontlar'
import { restaurantJsonLd } from '@/lib/jsonld'
import '../globals.css'
import { CerezOnayi } from '@/components/layout/CerezOnayi'

export default function TrKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={fontSiniflari}>
      <body>
        <script
          type="application/ld+json"
          // Tek işletme, tek gerçek: iki kök layout da aynı yapısal veriyi basar.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        {children}
        <CerezOnayi dil="tr" />
      </body>
    </html>
  )
}
```

Bunu şununla değiştir:

```tsx
import { fontSiniflari } from '@/lib/fontlar'
import { restaurantJsonLd, menuJsonLd } from '@/lib/jsonld'
import '../globals.css'
import { CerezOnayi } from '@/components/layout/CerezOnayi'

export default function TrKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={fontSiniflari}>
      <body>
        <script
          type="application/ld+json"
          // Tek işletme, tek gerçek: iki kök layout da aynı yapısal veriyi basar.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd('tr')) }}
        />
        {children}
        <CerezOnayi dil="tr" />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: `app/(en)/layout.tsx`'i güncelle**

Şu anki dosya:

```tsx
import { fontSiniflari } from '@/lib/fontlar'
import { restaurantJsonLd } from '@/lib/jsonld'
import '../globals.css'
import { CerezOnayi } from '@/components/layout/CerezOnayi'

export default function EnKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSiniflari}>
      <body>
        <script
          type="application/ld+json"
          // Single business, single fact: both root layouts print the same structured data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        {children}
        <CerezOnayi dil="en" />
      </body>
    </html>
  )
}
```

Bunu şununla değiştir:

```tsx
import { fontSiniflari } from '@/lib/fontlar'
import { restaurantJsonLd, menuJsonLd } from '@/lib/jsonld'
import '../globals.css'
import { CerezOnayi } from '@/components/layout/CerezOnayi'

export default function EnKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSiniflari}>
      <body>
        <script
          type="application/ld+json"
          // Single business, single fact: both root layouts print the same structured data.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd('en')) }}
        />
        {children}
        <CerezOnayi dil="en" />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Build ve doğrula**

Run: `npm run build`
Expected: PASS, hatasız çıktı.

Run: `grep -o '"@type":"Menu"' out/index.html out/en/index.html`
Expected: her iki dosyada da bir eşleşme (`out/index.html:"@type":"Menu"`,
`out/en/index.html:"@type":"Menu"`)

- [ ] **Step 4: Commit**

```bash
git add "app/(tr)/layout.tsx" "app/(en)/layout.tsx"
git commit -m "Print menuJsonLd alongside restaurantJsonLd in both layouts"
```

---

### Task 4: `breadcrumbJsonLd()` — BreadcrumbList yapısal verisi

**Files:**
- Modify: `lib/jsonld.ts`
- Test: `lib/jsonld.test.ts`

**Interfaces:**
- Consumes: `content/index.ts` (`sozluk(dil): Sozluk`), `lib/site.ts` (`SITE_URL`, `yol`,
  `RotaAnahtari`)
- Produces: `breadcrumbJsonLd(anahtar: RotaAnahtari, dil: Dil): object` — Task 5 bunu çağırır.

- [ ] **Step 1: Başarısız testleri yaz**

`lib/jsonld.test.ts`'in sonuna ekle:

```ts
type ListItem = { '@type': string; position: number; name: string; item: string }

test('breadcrumbJsonLd_ikiOgeTasir', () => {
  const veri = breadcrumbJsonLd('menu', 'tr') as Record<string, unknown>
  const ogeler = veri.itemListElement as ListItem[]
  assert.equal(ogeler.length, 2)
})

test('breadcrumbJsonLd_pozisyonlarBirVeIkidir', () => {
  const veri = breadcrumbJsonLd('menu', 'tr') as Record<string, unknown>
  const ogeler = veri.itemListElement as ListItem[]
  assert.equal(ogeler[0]?.position, 1)
  assert.equal(ogeler[1]?.position, 2)
})

test('breadcrumbJsonLd_anaSayfaVeMevcutSayfayaDoğruLinkVerir', () => {
  const trVeri = breadcrumbJsonLd('menu', 'tr') as Record<string, unknown>
  const trOgeler = trVeri.itemListElement as ListItem[]
  assert.equal(trOgeler[0]?.item, 'https://cigercibozo.com/')
  assert.equal(trOgeler[1]?.item, 'https://cigercibozo.com/menu/')

  const enVeri = breadcrumbJsonLd('konum', 'en') as Record<string, unknown>
  const enOgeler = enVeri.itemListElement as ListItem[]
  assert.equal(enOgeler[0]?.item, 'https://cigercibozo.com/en/')
  assert.equal(enOgeler[1]?.item, 'https://cigercibozo.com/en/konum/')
})

test('breadcrumbJsonLd_etiketlerSozlukteVar', () => {
  const veri = breadcrumbJsonLd('hikaye', 'tr') as Record<string, unknown>
  const ogeler = veri.itemListElement as ListItem[]
  assert.equal(ogeler[0]?.name, 'Ana Sayfa')
  assert.equal(ogeler[1]?.name, 'Hikaye')
})

test('breadcrumbJsonLd_anaRotasiIcinFirlatir', () => {
  assert.throws(() => breadcrumbJsonLd('ana', 'tr'))
})
```

- [ ] **Step 2: Testi çalıştırıp başarısız olduğunu doğrula**

Run: `npm run test`
Expected: FAIL — `breadcrumbJsonLd is not defined`

- [ ] **Step 3: `lib/jsonld.ts`'e fonksiyonu ekle**

Üstteki `import type { Dil, Urun } from '../content/types.ts'` satırına `RotaAnahtari` eklenmez
(o `lib/site.ts`'te tanımlı); onun yerine mevcut `import { SITE_URL, yol, instagramUrl } from
'./site.ts'` satırını şuna genişlet:

```ts
import { SITE_URL, yol, instagramUrl, type RotaAnahtari } from './site.ts'
```

Dosyanın sonuna (Task 2'nin `menuJsonLd`'sinden sonra) ekle:

```ts
/**
 * schema.org `BreadcrumbList`. Ana sayfa için çağrılmaz (`anahtar` argümanı 'ana' olamaz);
 * çağıran `components/sayfa/Kabuk.tsx` zaten `aktif !== 'ana'` koşuluyla korur.
 */
export function breadcrumbJsonLd(anahtar: RotaAnahtari, dil: Dil): object {
  if (anahtar === 'ana') {
    throw new Error('breadcrumbJsonLd: ana sayfa için çağrılmaz')
  }

  const s = sozluk(dil)
  const nav = s.ortak.nav as Record<string, string>
  const sayfaAdi = nav[anahtar]
  if (!sayfaAdi) throw new Error(`breadcrumbJsonLd: "${anahtar}" için nav etiketi yok`)

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: s.ortak.nav.anaSayfa,
        item: `${SITE_URL}${yol('ana', dil)}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: sayfaAdi,
        item: `${SITE_URL}${yol(anahtar, dil)}`,
      },
    ],
  }
}
```

- [ ] **Step 4: `lib/jsonld.test.ts`'in üstündeki import'u genişlet**

```ts
import { restaurantJsonLd, menuJsonLd, breadcrumbJsonLd } from './jsonld.ts'
```

- [ ] **Step 5: Testleri çalıştırıp geçtiğini doğrula**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add lib/jsonld.ts lib/jsonld.test.ts
git commit -m "Add breadcrumbJsonLd structured data"
```

---

### Task 5: `breadcrumbJsonLd()`'yi `Kabuk`'a bağla

**Files:**
- Modify: `components/sayfa/Kabuk.tsx`

**Interfaces:**
- Consumes: `breadcrumbJsonLd(anahtar: RotaAnahtari, dil: Dil): object` (Task 4)
- Produces: on bir rotada (`ana` hariç) `<script type="application/ld+json">` (test yok, build ile
  doğrulanır)

- [ ] **Step 1: `components/sayfa/Kabuk.tsx`'i güncelle**

Şu anki dosyanın importları ve dönüş bloğu:

```tsx
import { KorSahnesi } from '@/components/ember/KorSahnesi'
import { AltBilgi } from '@/components/layout/AltBilgi'
import { MobilAksiyonBari } from '@/components/layout/MobilAksiyonBari'
import { UstBar } from '@/components/layout/UstBar'
import { sozluk, type Dil } from '@/content'
import type { RotaAnahtari } from '@/lib/site'
import stil from './Kabuk.module.css'
```

...

```tsx
  return (
    <>
      <a href={`#${ICERIK_ID}`} className={stil.atla}>
        {s.ortak.erisim.icerigeAtla}
      </a>
      <KorSahnesi varyant={anaSayfaMi ? 'ana' : 'ic'} />
```

Import bloğuna `breadcrumbJsonLd`'yi ekle:

```tsx
import { KorSahnesi } from '@/components/ember/KorSahnesi'
import { AltBilgi } from '@/components/layout/AltBilgi'
import { MobilAksiyonBari } from '@/components/layout/MobilAksiyonBari'
import { UstBar } from '@/components/layout/UstBar'
import { sozluk, type Dil } from '@/content'
import { breadcrumbJsonLd } from '@/lib/jsonld'
import type { RotaAnahtari } from '@/lib/site'
import stil from './Kabuk.module.css'
```

`return` bloğunu şununla değiştir (skip-link'ten hemen sonra, `KorSahnesi`'den önce):

```tsx
  return (
    <>
      <a href={`#${ICERIK_ID}`} className={stil.atla}>
        {s.ortak.erisim.icerigeAtla}
      </a>
      {!anaSayfaMi && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(aktif, dil)) }}
        />
      )}
      <KorSahnesi varyant={anaSayfaMi ? 'ana' : 'ic'} />
```

Kalan JSX (`UstBar`, `<main>`, `AltBilgi`, `MobilAksiyonBari`) değişmez.

- [ ] **Step 2: Build ve doğrula**

Run: `npm run build`
Expected: PASS.

Run: `grep -o '"@type":"BreadcrumbList"' out/menu/index.html out/index.html`
Expected: yalnız `out/menu/index.html:"@type":"BreadcrumbList"` satırı görünür; çıktıda
`out/index.html:` önekiyle başlayan bir satır **olmamalı** (ana sayfada breadcrumb basılmaz).

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/sayfa/Kabuk.tsx
git commit -m "Print breadcrumbJsonLd on every non-home route"
```

---

### Task 6: Sitemap'e `lastModified`/`changeFrequency`/`priority` ekle

**Files:**
- Modify: `app/sitemap.ts`

**Interfaces:**
- Consumes: `lib/site.ts` (`SITE_URL`, `tumYollar()`, `RotaAnahtari`)
- Produces: `MetadataRoute.Sitemap` dizisi (test yok, build çıktısı ile doğrulanır)

- [ ] **Step 1: `app/sitemap.ts`'i değiştir**

Şu anki dosya:

```ts
import type { MetadataRoute } from 'next'
import { SITE_URL, tumYollar } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return tumYollar().flatMap(({ tr, en }) => [
    {
      url: `${SITE_URL}${tr}`,
      alternates: { languages: { tr: `${SITE_URL}${tr}`, en: `${SITE_URL}${en}` } },
    },
    {
      url: `${SITE_URL}${en}`,
      alternates: { languages: { tr: `${SITE_URL}${tr}`, en: `${SITE_URL}${en}` } },
    },
  ])
}
```

Bunu şununla değiştir:

```ts
import type { MetadataRoute } from 'next'
import { SITE_URL, tumYollar, type RotaAnahtari } from '@/lib/site'

export const dynamic = 'force-static'

/** Ana sayfa en sık, yasal sayfa en seyrek değişir; sıralama SEO ağırlığını yansıtır. */
const ONCELIK: Record<RotaAnahtari, { priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }> = {
  ana: { priority: 1, changeFrequency: 'weekly' },
  menu: { priority: 0.9, changeFrequency: 'monthly' },
  galeri: { priority: 0.6, changeFrequency: 'monthly' },
  konum: { priority: 0.7, changeFrequency: 'yearly' },
  hikaye: { priority: 0.5, changeFrequency: 'yearly' },
  gizlilik: { priority: 0.3, changeFrequency: 'yearly' },
}

export default function sitemap(): MetadataRoute.Sitemap {
  const simdi = new Date()

  return tumYollar().flatMap(({ anahtar, tr, en }) => {
    const { priority, changeFrequency } = ONCELIK[anahtar]
    const alternates = { languages: { tr: `${SITE_URL}${tr}`, en: `${SITE_URL}${en}` } }

    return [
      { url: `${SITE_URL}${tr}`, lastModified: simdi, changeFrequency, priority, alternates },
      { url: `${SITE_URL}${en}`, lastModified: simdi, changeFrequency, priority, alternates },
    ]
  })
}
```

- [ ] **Step 2: Build ve doğrula**

Run: `npm run build && grep -c '<priority>' out/sitemap.xml`
Expected: `12` (on iki `<url>` girdisinin hepsinde `priority`)

Run: `grep -A2 '<loc>https://cigercibozo.com/</loc>' out/sitemap.xml`
Expected: `<priority>1</priority>` ve `<changefreq>weekly</changefreq>` içerir.

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts
git commit -m "Add priority and changeFrequency to sitemap entries"
```

---

### Task 7: `lib/llmsTxt.ts` — build-time üretilen özet

**Files:**
- Create: `lib/llmsTxt.ts`
- Test: `lib/llmsTxt.test.ts`

**Interfaces:**
- Consumes: `content/isletme.ts` (`isletme: Isletme`), `content/index.ts` (`sozluk(dil): Sozluk`),
  `lib/site.ts` (`SITE_URL`, `tumYollar()`)
- Produces: `llmsTxt(): string` — Task 8 bunu çağırır.

- [ ] **Step 1: Başarısız testleri yaz**

`lib/llmsTxt.test.ts` oluştur:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { llmsTxt } from './llmsTxt.ts'

test('llmsTxt_baslikIsletmeAdiTasir', () => {
  const metin = llmsTxt()
  assert.ok(metin.startsWith('# Ciğerci Bozo'))
})

test('llmsTxt_onIkiRotaninHepsiniIcerir', () => {
  const metin = llmsTxt()
  const trYollar = ['https://cigercibozo.com/', 'https://cigercibozo.com/menu/',
    'https://cigercibozo.com/galeri/', 'https://cigercibozo.com/hikaye/',
    'https://cigercibozo.com/konum/', 'https://cigercibozo.com/gizlilik/']
  const enYollar = trYollar.map((y) => y.replace('cigercibozo.com/', 'cigercibozo.com/en/'))
  for (const y of [...trYollar, ...enYollar]) {
    assert.ok(metin.includes(y), `${y} eksik`)
  }
})

test('llmsTxt_ikiDilBasligiTasir', () => {
  const metin = llmsTxt()
  assert.ok(metin.includes('## Türkçe'))
  assert.ok(metin.includes('## English'))
})

test('llmsTxt_uydurmaFiyatVeyaDereceTasimaz', () => {
  const metin = llmsTxt()
  assert.equal(/\$\$|★|rating/i.test(metin), false)
})

test('llmsTxt_ozetSatiri_saatVeAdresiTasir', () => {
  const metin = llmsTxt()
  assert.ok(metin.includes('Naci Talat Caddesi No:4'))
  assert.ok(metin.includes("10:00'dan ertesi sabah 05:00'e kadar"))
})
```

- [ ] **Step 2: Testi çalıştırıp başarısız olduğunu doğrula**

Run: `npm run test`
Expected: FAIL — `lib/llmsTxt.ts` henüz yok, modül bulunamadı hatası.

- [ ] **Step 3: `lib/llmsTxt.ts`'i yaz**

```ts
import { isletme } from '../content/isletme.ts'
import { sozluk, type Sozluk } from '../content/index.ts'
import type { Dil } from '../content/types.ts'
import { SITE_URL, tumYollar, type RotaAnahtari } from './site.ts'

function rotaEtiketi(s: Sozluk, anahtar: RotaAnahtari): string {
  const nav = s.ortak.nav as Record<string, string>
  const etiket = anahtar === 'ana' ? nav.anaSayfa : nav[anahtar]
  if (!etiket) throw new Error(`llmsTxt: "${anahtar}" için nav etiketi yok`)
  return etiket
}

function rotaSatirlari(dil: Dil): string[] {
  const s = sozluk(dil)
  return tumYollar().map(({ anahtar, tr, en }) => {
    const yolStr = dil === 'en' ? en : tr
    const aciklama = s.ortak.sayfaMeta[anahtar].aciklama
    return `- [${rotaEtiketi(s, anahtar)}](${SITE_URL}${yolStr}): ${aciklama}`
  })
}

/**
 * LLM/answer-engine'lerin siteyi hızlı taraması için olgusal özet (llms.txt kongre,
 * https://llmstxt.org). Elle yazılmaz: `sozluk()`, `tumYollar()` ve `isletme`'den derlenir,
 * tıpkı `app/sitemap.ts`/`app/robots.ts` gibi; bir rota eklenip burası unutulursa dosya
 * sessizce bayatlamaz.
 */
export function llmsTxt(): string {
  const s = sozluk('tr')
  const ozet =
    `${isletme.ad}, ${isletme.kategori}. ${s.ortak.satirlar.adresKisa}. ` +
    `${s.ortak.satirlar.saatlerUzun} açık. ${s.ortak.alkolsuzKisa}.`

  return [
    `# ${isletme.ad}`,
    '',
    `> ${ozet}`,
    '',
    '## Türkçe',
    '',
    ...rotaSatirlari('tr'),
    '',
    '## English',
    '',
    ...rotaSatirlari('en'),
    '',
  ].join('\n')
}
```

- [ ] **Step 4: Testleri çalıştırıp geçtiğini doğrula**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/llmsTxt.ts lib/llmsTxt.test.ts
git commit -m "Add llmsTxt generator for AEO crawlers"
```

---

### Task 8: `app/llms.txt/route.ts` — statik metin uç noktası

**Files:**
- Create: `app/llms.txt/route.ts`

**Interfaces:**
- Consumes: `llmsTxt(): string` (Task 7)
- Produces: `GET /llms.txt` (build çıktısıyla doğrulanır, test yok — Next route handler dosyası)

- [ ] **Step 1: `app/llms.txt/route.ts`'i oluştur**

```ts
import { llmsTxt } from '@/lib/llmsTxt'

export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  return new Response(llmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

- [ ] **Step 2: Build ve doğrula**

Run: `npm run build`
Expected: PASS.

Run: `test -f out/llms.txt && head -5 out/llms.txt`
Expected: dosya var, ilk satır `# Ciğerci Bozo`.

Run: `grep -c '^- \[' out/llms.txt`
Expected: `12` (on iki rota satırı).

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/llms.txt/route.ts
git commit -m "Serve llms.txt as a static route handler"
```

---

### Task 9: Bekleyen kararları belgele

**Files:**
- Modify: `docs/surec/IYILESTIRMELER.md` (`## Öneri, karar bekliyor` tablosu, satır ~153'ün
  hemen altı)

**Interfaces:**
- Consumes: yok
- Produces: yok (yalnız dokümantasyon; hiçbir kod bu dosyaya bağımlı değil)

- [ ] **Step 1: `## Öneri, karar bekliyor` tablosuna iki satır ekle**

`docs/surec/IYILESTIRMELER.md`'de şu satırın hemen altına (satır 153, "Menü ve çekim listesindeki
öksüz satırlar" ile boş satır 154 arasına):

```
| SSS/answer-block AEO içeriği | Yapılandırılmış soru-cevap bloğu (`FAQPage` şeması) eklensin | SEO ve AEO spec'i (`docs/specs/2026-08-24-seo-aeo-design.md`) teknik/yapısal kalemleri bu turda uyguladı; FAQ yeni metin gerektirdiği için CLAUDE.md'nin "yeni pazarlama metni uydurulamaz" kuralı gereği dışarıda bırakıldı | sahibine: hangi sorular, ne cevap |
| `docs/tasarim/metin-envanteri.json` satır 16'daki konumlandırma cümlesi | "Ciğerci Bozo, Girne'de gece beşe kadar açık kalan, Urfa'nın tavla zarı ciğerini meşe korunda pişiren ciğercidir." meta açıklama/basın metni olarak kullanılsın mı | Cümle tam da SEO/AEO turunun ihtiyacı için yazılmış ama envanterde `[ÖNERİ]` etiketli, işletme onayı bekliyor; bu turda kullanılmadı | sahibine: onaylanırsa ana sayfa meta açıklaması ve/veya `llms.txt` özetinde kullanılabilir |
```

- [ ] **Step 2: Doğrula**

Markdown tablosunun bozulmadığını görmek için dosyayı oku (`sed -n '150,160p'
docs/surec/IYILESTIRMELER.md`); iki yeni satırın `|` sayısı komşu satırlarla aynı olmalı (4 sütun,
5 `|`).

- [ ] **Step 3: Commit**

```bash
git add docs/surec/IYILESTIRMELER.md
git commit -m "Record deferred FAQ/AEO content decision"
```

---

### Task 10: Uçtan uca doğrulama

**Files:** yok (yalnız komut çalıştırma ve gözlem)

**Interfaces:**
- Consumes: Task 1-9'un tüm çıktıları
- Produces: yeşil ışık — bu görev geçerse SEO/AEO turu tamamlanmış sayılır

- [ ] **Step 1: Tam test paketi, typecheck, build**

Run: `npm run typecheck && npm run test && npm run build`
Expected: hepsi PASS, sıfır hata. Test sayısı önceki 138'den en az 138 + (Task 2: 6) +
(Task 4: 5) + (Task 7: 5) = **154** olmalı.

- [ ] **Step 2: On iki rotanın title'ını doğrula**

Run:
```bash
for f in out/index.html out/menu/index.html out/galeri/index.html out/hikaye/index.html \
  out/konum/index.html out/gizlilik/index.html out/en/index.html out/en/menu/index.html \
  out/en/galeri/index.html out/en/hikaye/index.html out/en/konum/index.html \
  out/en/gizlilik/index.html; do
  echo "$f: $(grep -o '<title>[^<]*</title>' "$f")"
done
```
Expected: her satırda Task 1'de yazılan yeni title (örn. `out/index.html:
<title>Ciğerci Bozo · Urfa Usulü Ciğer, Girne</title>`).

- [ ] **Step 3: JSON-LD script sayısını doğrula**

Run: `grep -c 'application/ld+json' out/index.html out/menu/index.html`
Expected: `out/index.html`: 2 (`Restaurant` + `Menu`, breadcrumb yok çünkü ana sayfa);
`out/menu/index.html`: 3 (`Restaurant` + `Menu` + `BreadcrumbList`).

- [ ] **Step 4: `npm run preview` ile canlı doğrulama**

Run: `npm run preview` (arka planda başlat)
Tarayıcıda/`curl` ile:
- `curl -s http://localhost:PORT/llms.txt | head -20` — okunur metin, işlevsel `[]()`  linkler.
- `curl -s http://localhost:PORT/sitemap.xml | grep priority` — 12 `<priority>` satırı.
- Ana sayfa ve `/menu/` sayfa kaynağında (view-source) iki/üç `<script
  type="application/ld+json">` bloğunun geçerli JSON olduğunu göz kontrolüyle doğrula.

Sunucuyu durdur.

- [ ] **Step 5: Konsol/route sağlığı**

Zaten var olan alışkanlık (DEVAM.md): on iki rotanın 200 döndüğünü ve konsolun temiz kaldığını
doğrula (tarayıcıda gezinerek ya da `curl -o /dev/null -s -w "%{http_code}\n"` ile).

- [ ] **Step 6: `docs/surec/DEVAM.md`'yi güncelle**

"Son turda ne değişti" bölümüne SEO/AEO turunun özetini ekle: title/description genişletmesi,
`menuJsonLd`/`breadcrumbJsonLd`, sitemap zenginleştirmesi, `llms.txt`; "Bekleyen iş" listesine
FAQ/AEO içeriği maddesini ekle (Task 9'da `IYILESTIRMELER.md`'ye düşülen kayda işaret ederek).

- [ ] **Step 7: Son commit**

```bash
git add docs/surec/DEVAM.md
git commit -m "Update DEVAM.md after SEO/AEO technical pass"
```
