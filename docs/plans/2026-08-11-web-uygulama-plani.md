# Ciğerci Bozo Web Sitesi · Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Onaylı tasarım handoff'unu, TR ve EN dillerinde altı sayfalık statik bir Next.js 16 sitesine dönüştürmek.

**Architecture:** App Router, `output: 'export'` ile statik çıktı. **İki root layout:** `app/(tr)/layout.tsx` `<html lang="tr">` basar ve TR rotaları kökte tutar, `app/(en)/layout.tsx` `<html lang="en">` basar ve rotaları `en/` altına alır. Kök `app/layout.tsx` yoktur. Her iki ağaç da `components/sayfa/` altındaki dile bağımsız gövdeleri kendi sözlüğüyle çağırır. Metin, fiyat, saat ve iletişim verisi `content/` altında yaşar, JSX'te sabit metin bulunmaz. Tek iş kuralı olan gün aşan çalışma saati `lib/saat.ts` içinde saf fonksiyonlar halinde ve birim testlidir.

**Tech Stack:** Next.js 16.3 · React 19.2 · TypeScript 5 (strict) · CSS Modules + CSS custom properties · `next/font/google` · `node:test`

## Global Constraints

Aşağıdakiler her görevin gereksinimidir, her görevde tekrar edilmez.

**Sürüm ve bağımlılık**
- Node `>=20.9.0`; bu makinede v25.6.0 kurulu
- Runtime bağımlılığı yalnızca `next`, `react`, `react-dom`. Dev bağımlılığı yalnızca `typescript`, `@types/node`, `@types/react`, `@types/react-dom`
- CSS framework'ü, i18n paketi, animasyon kütüphanesi, test framework'ü **eklenmez**

**Kaynak otoritesi**
- Görünüm ve davranışta esas kaynak: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/*.dc.html`
- Bu dosyaların çıkarılmış yapısal envanteri: `docs/tasarim/*.json` (okuması ucuz, önce buraya bak)
- Metin, terminoloji ve yasaklar: `docs/tasarim/metin-envanteri.json`
- Ekran görüntüleri: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/screenshots/`
- `support.js` production'a taşınmaz

**Renk (tam liste, başka renk eklenmez)**
- Sayfa zemini `#0A0807` · kömür yüzey `#1A1614`
- Krem metin `#F2E9DC`, opaklık skalası `.5 .58 .62 .66 .7 .74 .78 .86`
- Kor `#B7351C`, hover `#C93E22` · Tangerine `#FAAA1F` · Pumpkin `#E96112` (yalnız paket hattı) · Meşe `#6B4A2F`
- Kor hiçbir zeminde gövde metni değildir. Tangerine ile kor büyük alanda yan yana gelmez.

**Tipografi**
- Başlık, kelime markası ve sayılar: Bricolage Grotesque 600-800, `font-variant-numeric: tabular-nums`
- Gövde ve UI: Inter 400/500/600
- Gövde metni 16px altına inmez. Köşe yarıçapı 0-3px.
- Her iki fontta da `subsets: ['latin', 'latin-ext']` zorunlu: `ğ Ğ ş Ş İ` latin-ext'te, `ı ç ö ü` latin'de

**Yazım (bağlayıcı, ihlali hata sayılır)**
- Em dash (`—`) kullanılmaz. Şapkalı harf kullanılmaz. Tamamı büyük harf cümle yazılmaz. Ünlem nadirdir.
- Başlıklar cümle yazımıyla. Saat `10:00 - 05:00` biçiminde.
- Terminoloji kilitleri: misafir (müşteri değil), ikram (bedava değil), ocak ve kor (mangal değil), usta (şef değil), tane (parça değil), şiş ve porsiyon (adet değil), sofra (masa değil), "gece açığız" (7/24 değil)
- Yeni pazarlama metni uydurulmaz. Tüm metin `docs/tasarim/metin-envanteri.json` içindeki hazır bloklardan veya `.dc.html` dosyalarından birebir alınır.

**Adlandırma**
- Alan kavramları Türkçe: `TaneDizilimi`, `KorSahnesi`, `FotoYuvasi`, `urunler.ts`, `data-yogunluk`
- Teknik iskele İngilizce: `lib/`, `components/`, `content/`, `types.ts`, `layout.tsx`
- Türkçe tanımlayıcılarda ASCII kullanılır; Türkçe karakter yalnız kullanıcıya görünen metinde bulunur
- Rota adları iki dilde de Türkçe: `/menu`, `/en/menu`

**Erişilebilirlik**
- Dokunma hedefleri en az 44px · Kontrast WCAG AA
- `prefers-reduced-motion: reduce` tüm animasyon ve geçişleri kapatır
- Tasarımda buton ve link olarak `<div>` kullanılmış; port sırasında **gerçek `<a>` veya `<button>`** kullanılır
- Dekoratif katmanlar (kor sahnesi, duman, ızgara, tane dizilimi) `aria-hidden="true"`

**Git**
- Her görev sonunda commit. Mesaj: imperative mood, İngilizce, ilk satır en fazla 72 karakter
- Gövdenin sonuna `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`

---

## Görev haritası

| # | Görev | Teslim |
|---|---|---|
| 1 | Proje iskeleti ve token katmanı | `npm run build` `out/` üretir |
| 2 | Gün aşan saat çekirdeği | `node --test` geçer |
| 3 | İçerik katmanı ve sözlük tipi | `tsc --noEmit` geçer, sözlük paritesi testli |
| 4 | Temel UI bileşenleri | Bileşen galerisi sayfasında görünür |
| 5 | Kor sahnesi ve hareket sistemi | Sahne kaydırmada tepki verir, reduced-motion kapatır |
| 6 | Kabuk: üst bar, alt bilgi, mobil bar, çekmece | Her rotada görünür |
| 7 | Rotalar, metadata, sitemap, JSON-LD | 12 rota export edilir |
| 8 | Canlı saat bileşenleri | Saat akar, durum doğru |
| 9 | Ana sayfa: açılış, iddia, ocaktan, ikram | Dört bölüm parite |
| 10 | Ana sayfa: gece, bozo, konum, paket | Ana sayfa tamam |
| 11 | Menü sayfası | Parite |
| 12 | Hikaye sayfası | Parite |
| 13 | Konum sayfası | Parite |
| 14 | 404 ve Gizlilik | Parite |
| 15 | Parite, erişilebilirlik ve yayın doğrulaması | Tüm kontroller yeşil |

---

## Task 1: Proje iskeleti ve token katmanı

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts` (otomatik)
- Create: `app/(tr)/layout.tsx`, `app/(en)/layout.tsx`, `app/globals.css`, `lib/fontlar.ts`
- Create: `styles/tokens.css`, `styles/reset.css`, `styles/animasyonlar.css`
- Create: `CLAUDE.md`, `README.md`
- **Kök `app/layout.tsx` oluşturulmaz.** Çoklu root layout ancak kök layout yokken çalışır.

**Interfaces:**
- Consumes: yok
- Produces: `--kor`, `--tangerine`, `--pumpkin`, `--krem`, `--zemin`, `--komur`, `--font-baslik`, `--font-govde`, `--sayfa-yatay`, `--bolum-dikey` CSS değişkenleri; `app/globals.css` bunları içeri alır ve root layout onu import eder

- [ ] **Step 1: package.json oluştur**

```json
{
  "name": "cigerci-bozo-web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "preview": "npx serve out",
    "typecheck": "tsc --noEmit",
    "test": "node --test"
  },
  "dependencies": {
    "next": "16.3.0",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@types/node": "^24.0.0",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "typescript": "^5.9.0"
  }
}
```

`test` betiği bilinçli olarak çıplak `node --test` kullanır: Node test dosyalarını kendisi keşfeder ve `node_modules` dizinini atlar. Kabuk globu (`content/*.test.ts`) kullanılamaz, çünkü `content/` Task 3'e kadar yoktur ve zsh eşleşme bulamadığında hata verir.

- [ ] **Step 2: Bağımlılıkları kur**

Run: `npm install`
Expected: `node_modules` oluşur, hata yok. Kurulan `next` sürümünü `npm ls next` ile doğrula, `16.3.0` olmalı.

- [ ] **Step 3: tsconfig.json oluştur**

`strict: true` ve `noUncheckedIndexedAccess: true` bilinçli tercihtir; sözlük ve içerik dizilerinde eksik anahtarı derleme zamanında yakalar. `allowImportingTsExtensions: true` de zorunludur: Node'un yerel TypeScript çalıştırması içe aktarma yolunda açık `.ts` uzantısı ister, testler bu yüzden `./saat.ts` biçiminde yazılır. Bu bayrak `noEmit: true` olmadan kullanılamaz.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "out"]
}
```

- [ ] **Step 4: next.config.ts oluştur**

`trailingSlash: true` kritik: Caddy `file_server` altında `/menu` isteğinin `menu/index.html` dosyasına düşmesini sağlar. Bu olmadan statik sunucu `/menu` yolunu bulamaz.

`experimental.globalNotFound` çoklu root layout için zorunludur. Gerekçe ölçülmüştür: kök `app/layout.tsx` olmadan sıradan bir `app/not-found.tsx`, `out/404.html` dosyasını `<html>` ve `<body>` etiketi olmadan, dolayısıyla stilsiz üretir. `global-not-found.tsx` kendi `<html>` iskeletini taşır ve statik export'ta doğru `404.html` verir.

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  // Çoklu root layout kullanıldığı için gerekli; Task 14'te global-not-found.tsx ile eşleşir
  experimental: { globalNotFound: true },
}

export default nextConfig
```

**Risk ve geri dönüş yolu:** `globalNotFound` deneysel bir bayraktır. İleride kaldırılır veya bozulursa geri dönüş yolu şudur: iki root layout tek bir `app/layout.tsx` ile değiştirilir (`<html lang="tr">`), EN sayfaların içeriği `<div lang="en">` ile sarmalanır ve standart `app/not-found.tsx` kullanılır. `hreflang` etiketleri her iki durumda da doğru kalır.

- [ ] **Step 5: styles/tokens.css oluştur**

Değerler `docs/tasarim/*.json` ve `.dc.html` dosyalarından birebir alınmıştır. Kontrast oranları marka kitabı Cilt 2'de ölçülmüştür.

```css
:root {
  /* zemin */
  --zemin: #0A0807;
  --komur: #1A1614;
  --panel-koyu: rgba(10, 8, 7, 0.9);
  --panel-orta: rgba(10, 8, 7, 0.74);
  --panel-acik: rgba(10, 8, 7, 0.72);

  /* metin: krem #F2E9DC, kömür üstünde 14.94:1 */
  --krem: #F2E9DC;
  --krem-86: rgba(242, 233, 220, 0.86);
  --krem-78: rgba(242, 233, 220, 0.78);
  --krem-74: rgba(242, 233, 220, 0.74);
  --krem-70: rgba(242, 233, 220, 0.7);
  --krem-66: rgba(242, 233, 220, 0.66);
  --krem-62: rgba(242, 233, 220, 0.62);
  --krem-58: rgba(242, 233, 220, 0.58);
  --krem-50: rgba(242, 233, 220, 0.5);

  /* çizgi ve kenarlık */
  --cizgi-guclu: rgba(242, 233, 220, 0.22);
  --cizgi: rgba(242, 233, 220, 0.14);
  --cizgi-soluk: rgba(242, 233, 220, 0.1);
  --cizgi-hayalet: rgba(242, 233, 220, 0.08);

  /* eylem: kor kömür üstünde 3.03:1, gövde metni olarak KULLANILMAZ */
  --kor: #B7351C;
  --kor-hover: #C93E22;
  --kor-golge: 0 12px 34px rgba(183, 53, 28, 0.4);
  --kor-golge-hover: 0 14px 38px rgba(183, 53, 28, 0.55);

  /* vurgu: tangerine kömür üstünde 9.27:1 */
  --tangerine: #FAAA1F;
  --tangerine-85: rgba(250, 170, 31, 0.85);
  --tangerine-30: rgba(250, 170, 31, 0.3);
  --tangerine-12: rgba(250, 170, 31, 0.12);
  --tangerine-08: rgba(250, 170, 31, 0.08);

  /* paket hattı: pumpkin, üstünde kömür metin 5.29:1 */
  --pumpkin: #E96112;
  --mese: #6B4A2F;

  /* tipografi */
  --font-baslik: var(--font-bricolage), system-ui, sans-serif;
  --font-govde: var(--font-inter), system-ui, sans-serif;

  --ol-hero: clamp(60px, 10.4vw, 168px);
  --ol-hero-alt: clamp(34px, 4.6vw, 76px);
  --ol-bolum-baslik: clamp(32px, 4vw, 54px);
  --ol-duygusal: clamp(44px, 7vw, 112px);
  --ol-menu-kalem: clamp(22px, 2.2vw, 30px);
  --ol-govde: clamp(16px, 1.35vw, 19px);

  --iz-hero: -0.018em;
  --iz-bolum: -0.02em;
  --iz-duygusal: -0.03em;

  /* aralık */
  --sayfa-yatay: clamp(24px, 5vw, 64px);
  --bolum-dikey: 120px;
  --kart-ic: clamp(28px, 3vw, 48px);

  /* hareket */
  --gecis-hizli: 0.15s ease-out;
  --gecis-orta: 0.3s ease-out;
  --gecis-erit: 0.5s ease-out;
}
```

- [ ] **Step 6: styles/reset.css ve styles/animasyonlar.css oluştur**

Keyframe değerleri `docs/tasarim/ana-sayfa.json` içindeki `davranislar` bloğundan birebir alınmıştır.

```css
/* styles/reset.css */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--zemin);
  color: var(--krem);
  font-family: var(--font-govde);
  -webkit-font-smoothing: antialiased;
}
a { color: var(--tangerine); text-decoration: none; }
a:hover { color: var(--krem); }
::selection { background: var(--kor); color: var(--krem); }
button { font: inherit; color: inherit; background: none; border: none; padding: 0; cursor: pointer; }
img { max-width: 100%; display: block; }
```

```css
/* styles/animasyonlar.css */
@keyframes emberBreath {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
@keyframes emberSoft {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.82; }
}
@keyframes smokeDrift {
  0% { opacity: 0; transform: translate3d(0, 36px, 0) scale(1); }
  30% { opacity: 0.14; }
  100% { opacity: 0; transform: translate3d(30px, -170px, 0) scale(1.6); }
}
@keyframes dotPulse {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 1; }
}
@keyframes colonBlink {
  0%, 45% { opacity: 1; }
  50%, 95% { opacity: 0.25; }
  100% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 7: Font modülünü, globals.css'i ve iki root layout'u oluştur**

Fontlar tek modülde tanımlanır ki iki root layout ve `global-not-found` aynı örneği paylaşsın.

```ts
// lib/fontlar.ts
import { Bricolage_Grotesque, Inter } from 'next/font/google'

// latin-ext zorunlu: ğ Ğ ş Ş İ bu alt kümede. ı ç ö ü latin alt kümesinde.
export const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-bricolage',
})

export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
})

export const fontSiniflari = `${bricolage.variable} ${inter.variable}`
```

```css
/* app/globals.css */
@import '../styles/tokens.css';
@import '../styles/reset.css';
@import '../styles/animasyonlar.css';
```

```tsx
// app/(tr)/layout.tsx
import { fontSiniflari } from '@/lib/fontlar'
import '../globals.css'

export default function TrKokLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={fontSiniflari}>
      <body>{children}</body>
    </html>
  )
}
```

`app/(en)/layout.tsx` aynıdır, tek fark `lang="en"`.

Geçici olarak `app/(tr)/page.tsx` içine `export default function Gecici() { return <main>kurulum</main> }` yaz; Task 7'de gerçek rotalarla değişecek.

- [ ] **Step 8: Build'i doğrula**

Run: `npm run build`
Expected: Hatasız tamamlanır ve `out/index.html` üretilir. `ls out/` çıktısında `index.html` ve `_next/` görünür.
Font indirme ağ erişimi gerektirir; `Failed to fetch Bricolage Grotesque` hatası alırsan ağ bağlantısını kontrol et.

Not: Next ilk build'de `tsconfig.json` dosyasını kendi zorunlu değerleriyle günceller (`jsx` değerini `react-jsx` yapar, `resolveJsonModule` ekler). Bu beklenen davranıştır, geri alma.

- [ ] **Step 9: CLAUDE.md ve README.md yaz**

`CLAUDE.md` 200 satırın altında kalır ve şunları içerir: proje bir cümlede, komutlar (`npm run dev|build|typecheck|test`), mimari özet, tasarım kaynaklarının yolu, Global Constraints bölümündeki renk/yazım/terminoloji kuralları, "yeni metin uydurma" kuralı. `README.md` kurulum ve yayın adımlarını anlatır.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold the Next.js project with the design tokens"
```

---

## Task 2: Gün aşan saat çekirdeği

**Files:**
- Create: `lib/saat.ts`
- Test: `lib/saat.test.ts`

**Interfaces:**
- Consumes: yok
- Produces:
  - `export const ZAMAN_DILIMI = 'Europe/Nicosia'`
  - `export const ACILIS_SAATI = 10`, `export const KAPANIS_SAATI = 5`
  - `export type Durum = { acik: boolean; gece: boolean; saat: number; dakika: number; gunIndeksi: number }`
  - `export function girneParcalari(simdi: Date): { saat: number; dakika: number; gunIndeksi: number }`
  - `export function durumHesapla(simdi: Date): Durum`
  - `export function gosterimGunIndeksi(simdi: Date): number`
  - `export function saatMetni(d: Durum): { saat: string; dakika: string }`
  - `gunIndeksi`: 0 = Pazar, 6 = Cumartesi (JavaScript `getDay()` ile aynı)

- [ ] **Step 1: Başarısız testi yaz**

```ts
// lib/saat.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { durumHesapla, gosterimGunIndeksi, saatMetni } from './saat.ts'

/** Girne yerel saatini veren yardımcı. Girne yazın UTC+3, kışın UTC+2. */
function girne(iso: string): Date {
  return new Date(iso)
}

test('durum_ogleVakti_aciktir', () => {
  const d = durumHesapla(girne('2026-08-11T12:00:00+03:00'))
  assert.equal(d.acik, true)
  assert.equal(d.gece, false)
  assert.equal(d.saat, 12)
})

test('durum_gecikSaat0230_acikVeGecedir', () => {
  const d = durumHesapla(girne('2026-08-12T02:30:00+03:00'))
  assert.equal(d.acik, true)
  assert.equal(d.gece, true)
})

test('durum_0459_halaAciktir', () => {
  const d = durumHesapla(girne('2026-08-12T04:59:00+03:00'))
  assert.equal(d.acik, true)
  assert.equal(d.gece, true)
})

test('durum_0500_kapalidir', () => {
  const d = durumHesapla(girne('2026-08-12T05:00:00+03:00'))
  assert.equal(d.acik, false)
  assert.equal(d.gece, false)
})

test('durum_0959_kapalidir', () => {
  assert.equal(durumHesapla(girne('2026-08-12T09:59:00+03:00')).acik, false)
})

test('durum_1000_acilir', () => {
  assert.equal(durumHesapla(girne('2026-08-12T10:00:00+03:00')).acik, true)
})

test('durum_0030_geceDegildir_ciftGeceEsigi', () => {
  // gece şeridi 01:00'de başlar, 00:30 henüz gece değil
  const d = durumHesapla(girne('2026-08-12T00:30:00+03:00'))
  assert.equal(d.acik, true)
  assert.equal(d.gece, false)
})

test('gosterimGunu_gececeyariSonrasi_oncekiGunuGosterir', () => {
  // 12 Ağustos 2026 Çarşamba, saat 02:00. Vardiya Salı gecesine ait.
  const gun = gosterimGunIndeksi(girne('2026-08-12T02:00:00+03:00'))
  assert.equal(gun, 2) // Salı
})

test('gosterimGunu_0500Sonrasi_ayniGunuGosterir', () => {
  const gun = gosterimGunIndeksi(girne('2026-08-12T05:00:00+03:00'))
  assert.equal(gun, 3) // Çarşamba
})

test('gosterimGunu_pazartesi0300_pazariGosterir_haftaBasiSarmasi', () => {
  // 10 Ağustos 2026 Pazartesi, saat 03:00 -> Pazar (0)
  assert.equal(gosterimGunIndeksi(girne('2026-08-10T03:00:00+03:00')), 0)
})

test('saatMetni_tekHaneleriIkiHaneYazar', () => {
  const m = saatMetni(durumHesapla(girne('2026-08-11T09:05:00+03:00')))
  assert.deepEqual(m, { saat: '09', dakika: '05' })
})

test('durum_kisSaatiUTCArti2_dogruCevirir', () => {
  // 15 Ocak 2026, Girne UTC+2. UTC 02:30 -> yerel 04:30, hâlâ açık ve gece.
  const d = durumHesapla(new Date('2026-01-15T02:30:00Z'))
  assert.equal(d.saat, 4)
  assert.equal(d.acik, true)
  assert.equal(d.gece, true)
})
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

Run: `node --test lib/saat.test.ts`
Expected: FAIL, `Cannot find module './saat.ts'`

- [ ] **Step 3: lib/saat.ts yaz**

`Intl.DateTimeFormat` ile zaman dilimini çeviririz; sunucunun yerel saatine güvenilmez.

```ts
export const ZAMAN_DILIMI = 'Europe/Nicosia'
export const ACILIS_SAATI = 10
export const KAPANIS_SAATI = 5
export const GECE_BASLANGICI = 1

export type Durum = {
  acik: boolean
  gece: boolean
  saat: number
  dakika: number
  gunIndeksi: number
}

const GUN_ADLARI = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const bicimlendirici = new Intl.DateTimeFormat('en-US', {
  timeZone: ZAMAN_DILIMI,
  hour: '2-digit',
  minute: '2-digit',
  weekday: 'short',
  hour12: false,
})

/** Verilen anın Girne yerel saat, dakika ve gün indeksini döner. */
export function girneParcalari(simdi: Date): {
  saat: number
  dakika: number
  gunIndeksi: number
} {
  const parcalar = bicimlendirici.formatToParts(simdi)
  const al = (tur: Intl.DateTimeFormatPartTypes): string => {
    const parca = parcalar.find((p) => p.type === tur)
    if (!parca) throw new Error(`Saat bileşeni okunamadı: ${tur}`)
    return parca.value
  }
  // hour12:false bazı ortamlarda gece yarısını "24" verir
  const saat = Number(al('hour')) % 24
  const gunIndeksi = GUN_ADLARI.indexOf(al('weekday') as (typeof GUN_ADLARI)[number])
  if (gunIndeksi < 0) throw new Error(`Gün adı çözülemedi: ${al('weekday')}`)
  return { saat, dakika: Number(al('minute')), gunIndeksi }
}

/** Gün aşan çalışma saatine göre açık, gece ve saat bilgisini hesaplar. */
export function durumHesapla(simdi: Date): Durum {
  const { saat, dakika, gunIndeksi } = girneParcalari(simdi)
  return {
    acik: saat >= ACILIS_SAATI || saat < KAPANIS_SAATI,
    gece: saat >= GECE_BASLANGICI && saat < KAPANIS_SAATI,
    saat,
    dakika,
    gunIndeksi,
  }
}

/**
 * Saat tablosundaki "Bugün" satırının hangi güne düşeceğini verir.
 * 05:00 öncesi vardiya bir önceki güne aittir.
 */
export function gosterimGunIndeksi(simdi: Date): number {
  const { saat, gunIndeksi } = girneParcalari(simdi)
  if (saat >= KAPANIS_SAATI) return gunIndeksi
  return (gunIndeksi + 6) % 7
}

/** Saat ve dakikayı iki haneli metne çevirir. */
export function saatMetni(d: Durum): { saat: string; dakika: string } {
  return {
    saat: String(d.saat).padStart(2, '0'),
    dakika: String(d.dakika).padStart(2, '0'),
  }
}
```

- [ ] **Step 4: Testin geçtiğini doğrula**

Run: `node --test lib/saat.test.ts`
Expected: PASS, 12 test

Node'un TypeScript'i doğrudan çalıştırması için v22.6+ gerekir; bu makinede v25.6.0 var. Hata alırsan `node --experimental-strip-types --test lib/saat.test.ts` dene.

- [ ] **Step 5: Commit**

```bash
git add lib/saat.ts lib/saat.test.ts package.json
git commit -m "feat: add the overnight opening-hours core with tests"
```

---

## Task 3: İçerik katmanı ve sözlük tipi

**Files:**
- Create: `content/types.ts`, `content/isletme.ts`, `content/urunler.ts`, `content/fotograflar.ts`
- Create: `content/tr/index.ts`, `content/tr/ortak.ts`, `content/tr/ana.ts`, `content/tr/menu.ts`, `content/tr/hikaye.ts`, `content/tr/konum.ts`, `content/tr/gizlilik.ts`, `content/tr/hata.ts`
- Create: `content/en/` altında aynı dosyalar
- Test: `content/icerik.test.ts`

**Interfaces:**
- Consumes: yok
- Produces:
  - `content/types.ts`: `export type Dil = 'tr' | 'en'`, `Isletme`, `Urun`, `Ikram`, `Icecek`, `Foto`, `FotoId`
  - `content/index.ts`: `export type Sozluk = typeof tr`, `export const tr`, `export const en: Sozluk`, `export function sozluk(dil: Dil): Sozluk`
  - `Sozluk` bilinçli olarak `types.ts` içinde **değil** `index.ts` içindedir: `types.ts` sözlük modüllerine bağımlı olsaydı `types → tr/index → tr/menu → urunler → types` içe aktarma çevrimi oluşurdu
  - `export const isletme: Isletme`
  - `export const ocaktanUrunler: Urun[]`, `export const ikramlar: Ikram[]`, `export const icecekler: Icecek[]`
  - `export const fotograflar: Record<FotoId, Foto>`, `export type FotoId`

- [ ] **Step 1: Sözlük paritesi testini yaz**

```ts
// content/icerik.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tr } from './tr/index.ts'
import { en } from './en/index.ts'
import { isletme } from './isletme.ts'
import { fotograflar } from './fotograflar.ts'
import { ocaktanUrunler, ikramlar } from './urunler.ts'

/** İç içe nesnenin tüm yaprak yollarını sıralı liste olarak döner. */
function yollar(nesne: unknown, onek = ''): string[] {
  if (typeof nesne !== 'object' || nesne === null) return [onek]
  return Object.entries(nesne)
    .flatMap(([anahtar, deger]) => yollar(deger, onek ? `${onek}.${anahtar}` : anahtar))
    .sort()
}

test('sozluk_trVeEn_ayniAnahtarlariTasir', () => {
  assert.deepEqual(yollar(en), yollar(tr))
})

test('sozluk_hicbirDegerBosDegil', () => {
  const bosOlanlar: string[] = []
  const gez = (nesne: unknown, onek = ''): void => {
    if (typeof nesne === 'string') {
      if (nesne.trim() === '') bosOlanlar.push(onek)
      return
    }
    if (typeof nesne === 'object' && nesne !== null) {
      for (const [k, v] of Object.entries(nesne)) gez(v, onek ? `${onek}.${k}` : k)
    }
  }
  gez(tr)
  gez(en)
  assert.deepEqual(bosOlanlar, [])
})

test('sozluk_emDashIcermez', () => {
  const kirli: string[] = []
  const gez = (nesne: unknown, onek = ''): void => {
    if (typeof nesne === 'string') {
      if (nesne.includes('—')) kirli.push(onek)
      return
    }
    if (typeof nesne === 'object' && nesne !== null) {
      for (const [k, v] of Object.entries(nesne)) gez(v, onek ? `${onek}.${k}` : k)
    }
  }
  gez(tr)
  gez(en)
  assert.deepEqual(kirli, [], 'Marka kuralı: em dash kullanılmaz')
})

test('isletme_bilinmeyenAlanlarNullDur', () => {
  assert.equal(isletme.telefon, null)
  assert.equal(isletme.whatsapp, null)
  assert.equal(isletme.instagram, null)
  assert.equal(isletme.eposta, null)
  assert.equal(isletme.koordinat, null)
})

test('isletme_dogrulanmisAlanlarDoludur', () => {
  assert.equal(isletme.ad, 'Ciğerci Bozo')
  assert.equal(isletme.cadde, 'Naci Talat Caddesi')
  assert.equal(isletme.sehir, 'Girne')
  assert.equal(isletme.alkolServisi, false)
})

test('urunler_ocaktanBesUrundur', () => {
  assert.equal(ocaktanUrunler.length, 5)
  assert.deepEqual(
    ocaktanUrunler.map((u) => u.id),
    ['ciger', 'dalak', 'yurek', 'kuzu-sis', 'terbiyesiz-tavuk-sis'],
  )
})

test('ikramlar_fiyatTasimaz', () => {
  assert.equal(ikramlar.length, 2)
  for (const i of ikramlar) assert.equal('fiyat' in i, false)
})

test('fotograflar_hicbiriHenuzDosyaTasimaz', () => {
  for (const [id, foto] of Object.entries(fotograflar)) {
    assert.equal(foto.dosya, undefined, `${id} için fotoğraf henüz çekilmedi`)
    assert.ok(foto.etiket.length > 0)
  }
})
```

- [ ] **Step 2: Testin başarısız olduğunu doğrula**

Run: `node --test content/icerik.test.ts`
Expected: FAIL, `Cannot find module './tr/index.ts'`

- [ ] **Step 3: content/types.ts yaz**

```ts
export type Dil = 'tr' | 'en'

export type Koordinat = { enlem: number; boylam: number }

export type Isletme = {
  ad: string
  kisaAd: string
  kategori: string
  cadde: string
  sehir: string
  ulke: string
  binaNo: string | null
  postaKodu: string | null
  koordinat: Koordinat | null
  telefon: string | null
  whatsapp: string | null
  eposta: string | null
  instagram: string | null
  alkolServisi: false
  sahip: string
}

export type Urun = {
  id: string
  /** Fiyat kuruşsuz TL. Bilinmiyorsa null, arayüzde "000 TL" basılır. */
  fiyat: number | null
  fotoId: FotoId | null
}

export type Ikram = { id: string; fotoId: FotoId | null }

export type Icecek = { id: string; fiyat: number | null }

export type Foto = {
  /** Çekim listesindeki kadraj etiketi, plaka üstünde görünür. */
  etiket: string
  etiketEn: string
  dosya?: string
}

export type FotoId =
  | 'tane-yakin-cekim'
  | 'kor-uzerinde-sis'
  | 'ustanin-eli'
  | 'kurulu-sofra'
  | 'gece-cephesi'
  | 'paket-ve-gel-al'
  | 'bes-urun'
  | 'dalak'
  | 'yurek'
  | 'kuzu-sis'
  | 'tavuk-sis'
  | 'lebeni'
  | 'bostana'
  | 'ayran'
  | 'bozo-portre'
```

- [ ] **Step 4: content/isletme.ts yaz**

Doğrulanmış değerler `docs/tasarim/metin-envanteri.json` içindeki `isletmeGercekleri` listesinden alınır; `dogrulanmisMi: false` olan her alan `null` olur.

```ts
import type { Isletme } from './types.ts'

/**
 * Tek gerçek kaynak. null olan alanlar işletmeden bekleniyor;
 * arayüz null gördüğünde yer tutucu basar ve bağlantı üretmez.
 */
export const isletme: Isletme = {
  ad: 'Ciğerci Bozo',
  kisaAd: 'Bozo',
  kategori: 'Urfa usulü ciğerci',
  cadde: 'Naci Talat Caddesi',
  sehir: 'Girne',
  ulke: 'KKTC',
  binaNo: null,
  postaKodu: null,
  koordinat: null,
  telefon: null,
  whatsapp: null,
  eposta: null,
  instagram: null,
  alkolServisi: false,
  sahip: 'Engin Çağlar',
}

export const TELEFON_YER_TUTUCU = '000 000 00 00'
export const FIYAT_YER_TUTUCU = '000 TL'

/** Fiyatı arayüz metnine çevirir. Bilinmeyen fiyat yer tutucuya düşer. */
export function fiyatMetni(fiyat: number | null): string {
  return fiyat === null ? FIYAT_YER_TUTUCU : `${fiyat.toLocaleString('tr-TR')} TL`
}
```

- [ ] **Step 5: content/urunler.ts ve content/fotograflar.ts yaz**

Ürün adları ve açıklamaları sözlükte yaşar; burada yalnızca kimlik, fiyat ve fotoğraf bağı vardır. Böylece EN menü aynı listeyi kullanır.

```ts
// content/urunler.ts
import type { Icecek, Ikram, Urun } from './types.ts'

export const ocaktanUrunler: Urun[] = [
  { id: 'ciger', fiyat: null, fotoId: 'tane-yakin-cekim' },
  { id: 'dalak', fiyat: null, fotoId: 'dalak' },
  { id: 'yurek', fiyat: null, fotoId: 'yurek' },
  { id: 'kuzu-sis', fiyat: null, fotoId: 'kuzu-sis' },
  { id: 'terbiyesiz-tavuk-sis', fiyat: null, fotoId: 'tavuk-sis' },
]

/** İkramlarda fiyat alanı yoktur; arayüzde "ikram" ibaresi basılır. */
export const ikramlar: Ikram[] = [
  { id: 'lebeni', fotoId: 'lebeni' },
  { id: 'bostana', fotoId: 'bostana' },
]

export const icecekler: Icecek[] = [
  { id: 'ayran', fiyat: null },
  { id: 'salgam', fiyat: null },
  { id: 'cay', fiyat: null },
]

/** İçecek listesi işletmeden gelmedi; arayüz bu sayıda kesik yer tutucu basar. */
export const ICECEK_YER_TUTUCU_ADEDI = 3
```

```ts
// content/fotograflar.ts
import type { Foto, FotoId } from './types.ts'

/**
 * Çekim listesi manifesti. dosya alanı boşken FotoYuvasi kadraj etiketli
 * koyu plaka basar. Fotoğraflar geldiğinde yalnızca bu dosyaya yol yazılır.
 * Yapay zeka ile üretilmiş yemek görseli kullanılmaz.
 */
export const fotograflar: Record<FotoId, Foto> = {
  'tane-yakin-cekim': { etiket: 'tane yakın çekimi', etiketEn: 'the cut, close up' },
  'kor-uzerinde-sis': { etiket: 'kor üzerinde şiş', etiketEn: 'skewers over embers' },
  'ustanin-eli': { etiket: 'ustanın eli', etiketEn: "the master's hand" },
  'kurulu-sofra': { etiket: 'kurulu sofra, üstten', etiketEn: 'the table, from above' },
  'gece-cephesi': { etiket: 'gece cephesi', etiketEn: 'the front at night' },
  'paket-ve-gel-al': { etiket: 'paket ve gel al', etiketEn: 'takeaway' },
  'bes-urun': { etiket: 'beş ürün ayrı ayrı', etiketEn: 'five dishes, one by one' },
  dalak: { etiket: 'dalak karesi', etiketEn: 'spleen' },
  yurek: { etiket: 'yürek karesi', etiketEn: 'heart' },
  'kuzu-sis': { etiket: 'kuzu şiş karesi', etiketEn: 'lamb skewer' },
  'tavuk-sis': { etiket: 'tavuk şiş karesi', etiketEn: 'chicken skewer' },
  lebeni: { etiket: 'lebeni karesi', etiketEn: 'lebeni soup' },
  bostana: { etiket: 'bostana karesi', etiketEn: 'bostana salad' },
  ayran: { etiket: 'bakır maşrapada ayran', etiketEn: 'ayran in a copper cup' },
  'bozo-portre': { etiket: 'portre, ocak başında', etiketEn: 'portrait, at the fire' },
}
```

- [ ] **Step 6: TR sözlüğünü yaz**

Her sayfa modülü düz nesne olarak dışa açılır. **`as const` kullanılmaz:** `Sozluk` tipi TR sözlüğünden türetildiği için `as const` her metni sabit (literal) tipe çevirir ve `en: Sozluk` ataması imkansız hale gelir (EN metni o literal olamaz). `as const` olmadan her yaprak `string` olarak çıkarılır, anahtar paritesi yine derleme zamanında zorunlu kalır.

Metinler `.dc.html` dosyalarındaki gerçek içerikten ve `docs/tasarim/metin-envanteri.json` içindeki hazır bloklardan birebir alınır. Örnek:

```ts
// content/tr/ortak.ts
export const ortak = {
  marka: { ad: 'Ciğerci Bozo', kisa: 'Bozo' },
  nav: { menu: 'Menü', gece: 'Gece', hikaye: 'Hikaye', konum: 'Konum' },
  dil: { tr: 'TR', en: 'EN', ayirici: '/' },
  cta: {
    yolTarifiAl: 'Yol tarifi al',
    menuyuGor: 'Menüyü gör',
    whatsapptanYaz: "WhatsApp'tan yaz",
    ara: 'Ara',
  },
  durum: {
    acik: 'Şu an açığız',
    kapali: "Şu an kapalıyız, 10:00'da açılıyoruz",
    geceSerit: "Ocak 05:00'e kadar yanıyor",
  },
  satirlar: {
    adresKisa: 'Girne, Naci Talat Caddesi',
    saatlerGunluk: 'Her gün 10:00 - 05:00',
    saatlerUzun: "Her gün 10:00'dan ertesi sabah 05:00'e kadar",
  },
  gunler: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  bugun: 'Bugün',
  alkolsuz: 'Mekanımız alkolsüzdür. Sofra ve ocak bizden, yine bekleriz.',
  /** Rota başına sayfa başlığı ve açıklaması. Anahtarlar RotaAnahtari ile birebir eşleşir. */
  sayfaMeta: {
    ana: { baslik: 'Ciğerci Bozo', aciklama: 'Tavla zarı ciğer, meşe korunda. Girne, Naci Talat Caddesi. Her gün 10:00 - 05:00.' },
    menu: { baslik: 'Menü · Ciğerci Bozo', aciklama: 'Ocaktan beş ürün, iki ikram ve içecekler.' },
    hikaye: { baslik: 'Hikaye · Ciğerci Bozo', aciklama: "Urfa'da ustayı tanesinden anlarsınız." },
    konum: { baslik: 'Konum · Ciğerci Bozo', aciklama: "Naci Talat Caddesi, Girne. Her gün 10:00'dan ertesi sabah 05:00'e kadar." },
    gizlilik: { baslik: 'Gizlilik · Ciğerci Bozo', aciklama: 'Bu sitenin veri yaklaşımı.' },
  },
}
```

`gunler` dizisinin sırası `lib/saat.ts` içindeki `gunIndeksi` ile aynıdır: 0 = Pazar. Bu eşleşme bozulursa saat tablosu yanlış günü işaretler.

```ts
// content/tr/index.ts
import { ortak } from './ortak.ts'
import { ana } from './ana.ts'
import { menu } from './menu.ts'
import { hikaye } from './hikaye.ts'
import { konum } from './konum.ts'
import { gizlilik } from './gizlilik.ts'
import { hata } from './hata.ts'

export const tr = { ortak, ana, menu, hikaye, konum, gizlilik, hata }
```

Sayfa modüllerinin anahtar setini `docs/tasarim/*.json` içindeki `metinAnahtarlari` listeleri belirler. Ana sayfa 12 + 9 + 13 + 7 + 10 + 5 + 24 + 5 + 16 anahtar taşır; hepsi karşılanmalıdır.

- [ ] **Step 7: EN sözlüğünü yaz**

`content/en/index.ts` şu imzayı taşır ve EN modülleri de `as const` **kullanmaz**:

```ts
// content/en/index.ts
import type { Sozluk } from '../index.ts'
import { ortak } from './ortak.ts'
import { ana } from './ana.ts'
import { menu } from './menu.ts'
import { hikaye } from './hikaye.ts'
import { konum } from './konum.ts'
import { gizlilik } from './gizlilik.ts'
import { hata } from './hata.ts'

export const en: Sozluk = { ortak, ana, menu, hikaye, konum, gizlilik, hata }
```

EN değerleri `.dc.html` dosyalarındaki `data-en` özniteliklerinden alınır. `data-en` bulunmayan yeni metinler için brief kuralı geçerlidir: İngilizce, Türkçenin çevirisi değil aynı tonun İngilizce halidir. Ürün adları çevrilmez, açıklanır (`Urfa liver kebab (ciğer)`). EN sayfalarda `Alcohol-free` bilgisi görünür. `Bozo` adının bir kişinin lakabı olduğu EN metinde açıkça söylenir.

EN değerleri `.dc.html` dosyalarındaki `data-en` özniteliklerinden alınır. `data-en` bulunmayan yeni metinler için brief kuralı geçerlidir: İngilizce, Türkçenin çevirisi değil aynı tonun İngilizce halidir. Ürün adları çevrilmez, açıklanır (`Urfa liver kebab (ciğer)`). EN sayfalarda `Alcohol-free` bilgisi görünür. `Bozo` adının bir kişinin lakabı olduğu EN metinde açıkça söylenir.

- [ ] **Step 8: sozluk() seçicisini yaz**

```ts
// content/index.ts
import { tr } from './tr/index.ts'
import { en } from './en/index.ts'
import type { Dil } from './types.ts'

export type Sozluk = typeof tr

export function sozluk(dil: Dil): Sozluk {
  return dil === 'en' ? en : tr
}

export { tr, en }
export type { Dil }
```

`content/en/index.ts` bu tipe `import type { Sozluk } from '../index.ts'` ile bağlanır; tip düzeyinde çevrim TypeScript için sorun değildir, çalışma zamanında hiçbir şey içe aktarılmaz.

- [ ] **Step 9: Testleri ve tip kontrolünü çalıştır**

Run: `node --test content/icerik.test.ts && npm run typecheck`
Expected: Tüm testler PASS, `tsc` hata vermez. EN sözlüğünde eksik anahtar varsa `tsc` hatası verir; parite testi de yakalar.

- [ ] **Step 10: Commit**

```bash
git add content/
git commit -m "feat: add the typed bilingual content layer"
```

---

## Task 4: Temel UI bileşenleri

**Files:**
- Create: `components/ui/Buton.tsx` + `Buton.module.css`
- Create: `components/ui/Cip.tsx` + `Cip.module.css`
- Create: `components/ui/TaneDizilimi.tsx` + `TaneDizilimi.module.css`
- Create: `components/ui/FotoYuvasi.tsx` + `FotoYuvasi.module.css`
- Create: `components/ui/CamPanel.tsx` + `CamPanel.module.css`
- Create: `components/ui/BolumBasligi.tsx` + `BolumBasligi.module.css`
- Create: `components/ui/Ikonlar.tsx`

**Interfaces:**
- Consumes: `content/fotograflar.ts`, `content/types.ts` (Task 3)
- Produces:
  - `<Buton tur="birincil" | "ikincil" | "koyu" | "koyuOutline" boy="sm" | "md" | "lg" href={string | null} disabled?={boolean} hariciMi?={boolean}>`
  - `<Cip tur="outline" | "dolu" | "ikram">`
  - `<TaneDizilimi boy={number} bosluk={number} anahat?={boolean} cizgi?={boolean} />`: 6 tane, büyük-küçük-büyük-büyük-küçük-büyük ritmi
  - `<FotoYuvasi id={FotoId} dil={Dil} bicim="portre" | "genis" | "karo" etiketYeri?="sol" | "orta" koseIsaretleri?={2 | 4} />`
  - `<CamPanel opaklik={0.72 | 0.74 | 0.9}>`
  - `<BolumBasligi baslik={string} not?={string} sag?={ReactNode} />`
  - `Ikonlar` dosyası `<PinIkon />`, `<TelefonIkon />`, `<WhatsAppIkon />`, `<InstagramIkon />` verir; hepsi `viewBox="0 0 24 24"`, `fill="currentColor"`, 15-17px

- [ ] **Step 1: Buton bileşenini yaz**

`disabled` durumu, `content/isletme.ts` içindeki `null` alanlar için gereklidir: numara yoksa buton görünür ama `href` üretilmez.

```tsx
// components/ui/Buton.tsx
import Link from 'next/link'
import stil from './Buton.module.css'

type Props = {
  tur: 'birincil' | 'ikincil' | 'koyu' | 'koyuOutline'
  boy: 'sm' | 'md' | 'lg'
  href: string | null
  children: React.ReactNode
  disabled?: boolean
  hariciMi?: boolean
}

export function Buton({ tur, boy, href, children, disabled = false, hariciMi = false }: Props) {
  const sinif = `${stil.taban} ${stil[tur]} ${stil[boy]}`

  if (disabled || href === null) {
    return (
      <span className={`${sinif} ${stil.pasif}`} aria-disabled="true">
        {children}
      </span>
    )
  }
  if (hariciMi) {
    return (
      <a className={sinif} href={href} rel="noopener">
        {children}
      </a>
    )
  }
  return (
    <Link className={sinif} href={href}>
      {children}
    </Link>
  )
}
```

```css
/* components/ui/Buton.module.css */
.taban {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 44px;
  border-radius: 2px;
  font-family: var(--font-govde);
  font-weight: 600;
  letter-spacing: -0.005em;
  transition: background var(--gecis-hizli), border-color var(--gecis-hizli),
    transform var(--gecis-hizli), box-shadow var(--gecis-hizli);
}
.sm { padding: 12px 20px; font-size: 14.5px; }
.md { padding: 16px 28px; font-size: 15.5px; }
.lg { padding: 20px 34px; font-size: 16.5px; }

.birincil { background: var(--kor); color: var(--krem); box-shadow: var(--kor-golge); }
.birincil:hover {
  background: var(--kor-hover);
  color: var(--krem);
  transform: translateY(-1px);
  box-shadow: var(--kor-golge-hover);
}

.ikincil { border: 1px solid var(--cizgi-guclu); color: var(--krem-86); }
.ikincil:hover {
  border-color: var(--tangerine-85);
  background: var(--tangerine-08);
  color: var(--krem);
}

/* pumpkin şerit üstünde: zemin kömür, metin krem */
.koyu { background: var(--komur); color: var(--krem); }
.koyu:hover { background: #241e1b; color: var(--krem); }
.koyuOutline { border: 1px solid rgba(26, 22, 20, 0.5); color: var(--komur); }
.koyuOutline:hover { border-color: var(--komur); color: var(--komur); }

.pasif { opacity: 0.55; cursor: default; pointer-events: none; }
```

- [ ] **Step 2: TaneDizilimi bileşenini yaz**

Marka imzası. Ritim `docs/tasarim/*.json` içinde `ZarRayi` / `BoncukRayi` / `BeadRail` adlarıyla geçer; hepsi aynı motiftir: büyük-küçük-büyük-büyük-küçük-büyük.

Bu bileşen **onaylı logo değildir**, tasarımdaki geçici kelime kilidinin işaret parçasıdır. Marka kitabındaki indirgeme merdiveni (96px tam kilit, 40px üç tane, 24px çubuk incelir, 16px yağ tanesi düşer) onaylı SVG geldiğinde bu bileşenin içinde uygulanır; şu an geçici kilit tek ritimde kalır.

```tsx
// components/ui/TaneDizilimi.tsx
import stil from './TaneDizilimi.module.css'

const RITIM = [1, 0.625, 1, 1, 0.625, 1] as const

type Props = {
  /** Büyük tanenin kenar uzunluğu, px. Küçük tane bunun 0.625 katıdır. */
  boy: number
  bosluk: number
  anahat?: boolean
  /** Sağa uzanan sönen çizgi (yalnız hero'da) */
  cizgi?: boolean
}

export function TaneDizilimi({ boy, bosluk, anahat = false, cizgi = false }: Props) {
  return (
    <span className={stil.kap} style={{ gap: `${bosluk}px` }} aria-hidden="true">
      {RITIM.map((oran, i) => {
        const kenar = Math.round(boy * oran)
        const kucuk = oran < 1
        return (
          <span
            key={i}
            className={`${stil.tane} ${anahat ? stil.anahat : stil.dolu} ${kucuk ? stil.kucuk : ''}`}
            style={{ width: `${kenar}px`, height: `${kenar}px` }}
          />
        )
      })}
      {cizgi && <span className={stil.cizgi} />}
    </span>
  )
}
```

```css
/* components/ui/TaneDizilimi.module.css */
.kap { display: inline-flex; align-items: center; }
.tane { display: block; flex: none; border-radius: 1px; }
.dolu { background: var(--krem); }
.dolu.kucuk { background: var(--tangerine); }
.anahat { border: 1px solid rgba(242, 233, 220, 0.5); }
.anahat.kucuk { border-color: rgba(250, 170, 31, 0.6); }
.cizgi {
  flex: 1;
  min-width: 60px;
  height: 3px;
  margin-left: 12px;
  background: linear-gradient(to right, var(--krem) 54%, rgba(242, 233, 220, 0.1));
}
```

- [ ] **Step 3: FotoYuvasi bileşenini yaz**

```tsx
// components/ui/FotoYuvasi.tsx
import Image from 'next/image'
import { fotograflar } from '@/content/fotograflar'
import type { Dil, FotoId } from '@/content/types'
import stil from './FotoYuvasi.module.css'

type Props = {
  id: FotoId
  dil: Dil
  bicim: 'portre' | 'genis' | 'karo'
  etiketYeri?: 'sol' | 'orta'
  koseIsaretleri?: 2 | 4
}

export function FotoYuvasi({
  id,
  dil,
  bicim,
  etiketYeri = 'sol',
  koseIsaretleri = 4,
}: Props) {
  const foto = fotograflar[id]
  const etiket = dil === 'en' ? foto.etiketEn : foto.etiket

  if (foto.dosya) {
    return (
      <div className={`${stil.kap} ${stil[bicim]}`}>
        <Image src={foto.dosya} alt={etiket} fill className={stil.gorsel} sizes="(max-width: 780px) 100vw, 50vw" />
      </div>
    )
  }

  // Köşe sınıfları açık dizi olarak tutulur; şablon dizgisiyle indekslemek
  // noUncheckedIndexedAccess altında string | undefined döndürür ve derlemez.
  const koseSiniflari = [stil.solUst, stil.sagUst, stil.solAlt, stil.sagAlt]

  return (
    <div className={`${stil.kap} ${stil[bicim]} ${stil.bos}`} role="img" aria-label={etiket}>
      <span aria-hidden="true" className={stil.kor} />
      {koseSiniflari.slice(0, koseIsaretleri).map((koseSinif) => (
        <span key={koseSinif} aria-hidden="true" className={`${stil.kose} ${koseSinif}`} />
      ))}
      <span aria-hidden="true" className={`${stil.etiket} ${stil[etiketYeri]}`}>
        <span className={stil.etiketCizgi} />
        {etiket}
      </span>
    </div>
  )
}
```

CSS için kesin değerler: kenarlık `1px solid rgba(242,233,220,.22)`, iç gölge `inset 0 0 90px rgba(0,0,0,.5)` (portre) / `inset 0 0 130px rgba(0,0,0,.72)` (geniş), köşe L işaretleri 24px uzunluk 18px içerlek `1px solid rgba(250,170,31,.6)`, etiket kutusu `padding:6px 12px; background:#0A0807; font-size:12.5px`, portre yükseklik `clamp(360px,54vh,560px)`, karo yükseklik `110px`.

- [ ] **Step 4: Cip, CamPanel, BolumBasligi ve Ikonlar bileşenlerini yaz**

- `Cip`: `outline` (kategori rozeti), `dolu` (ölçü bilgisi), `ikram` (fiyat yerine geçen rozet). Ortak: `padding:6px 12px`, `border-radius:2px`, `font-size:12.5px`, `font-weight:600`.
- `CamPanel`: `background: rgba(10,8,7,<opaklik>)`, `border:1px solid var(--cizgi-soluk)`, `backdrop-filter: blur(3px)`, `padding: var(--kart-ic)`.
- `BolumBasligi`: `display:flex; justify-content:space-between; align-items:baseline; padding-bottom:22px; border-bottom:1px solid var(--cizgi)`. Sol başlık `font: 700 var(--ol-bolum-baslik)/1.12 var(--font-baslik); letter-spacing: var(--iz-bolum)`.
- `Ikonlar`: pin, telefon, WhatsApp, Instagram. Hepsi `fill="currentColor"`, `width`/`height` prop'u varsayılan 16.

- [ ] **Step 5: Geçici galeri sayfasıyla doğrula**

`app/(tr)/page.tsx` içine tüm bileşenlerin her varyantını geçici olarak bas.

Run: `npm run dev` ve `http://localhost:3000` adresini aç
Expected: Buton üç türde ve üç boyda, TaneDizilimi dolu ve anahat, FotoYuvasi üç biçimde kadraj etiketiyle, Cip üç türde, ikonlar görünür. Hover'da birincil buton `#C93E22` olur ve 1px yükselir.

- [ ] **Step 6: Tip kontrolü ve build**

Run: `npm run typecheck && npm run build`
Expected: Hatasız

- [ ] **Step 7: Commit**

```bash
git add components/ui/
git commit -m "feat: add the base UI components from the design tokens"
```

---

## Task 5: Kor sahnesi ve hareket sistemi

**Files:**
- Create: `components/ember/KorSahnesi.tsx` + `KorSahnesi.module.css`
- Create: `components/ember/ImlecKoru.tsx` + `ImlecKoru.module.css`
- Create: `components/ui/Bolum.tsx` + `Bolum.module.css`
- Create: `lib/hareket.ts`

**Interfaces:**
- Consumes: yok
- Produces:
  - `<KorSahnesi yogunlukTakip?={boolean} />`: `'use client'`
  - `<ImlecKoru />`: `'use client'`, yalnız ana sayfada
  - `export function hareketAzaltilmisMi(): boolean`
  - `export function rafKisitla(fn: () => void): () => void`
  - Bölümler `data-yogunluk="0.55"` özniteliği taşır; KorSahnesi bunları okur

**Kritik port kararı:** Handoff'ta kor sahnesi `position:absolute` ve scroll'da `translate3d` ile yerinde tutuluyor. Bunun tek sebebi tasarım dosyasının bir tuval içinde yaşamasıdır. Next'te gerçek `position: fixed` kullanılır ve o scroll dinleyicisi tamamen düşer. Aynı sonucu daha az kodla verir.

- [ ] **Step 1: lib/hareket.ts yaz**

```ts
/** İşletim sisteminin hareket azaltma tercihini okur. SSR'da false döner. */
export function hareketAzaltilmisMi(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Verilen işi kare başına en fazla bir kez çalıştırır.
 * Dönen fonksiyon çağrıldığında bir sonraki kareye kaydeder.
 */
export function rafKisitla(fn: () => void): () => void {
  let bekliyor = false
  return () => {
    if (bekliyor) return
    bekliyor = true
    requestAnimationFrame(() => {
      bekliyor = false
      fn()
    })
  }
}
```

- [ ] **Step 2: KorSahnesi bileşenini yaz**

Yoğunluk formülü tasarımdan birebir: kor `opacity = 0.3 + y * 0.7`, `scale = 0.9 + y * 0.16`.

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { hareketAzaltilmisMi, rafKisitla } from '@/lib/hareket'
import stil from './KorSahnesi.module.css'

export function KorSahnesi({ yogunlukTakip = false }: { yogunlukTakip?: boolean }) {
  const korRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!yogunlukTakip) return
    const kor = korRef.current
    if (!kor) return
    if (hareketAzaltilmisMi()) return

    const bolumler = Array.from(document.querySelectorAll<HTMLElement>('[data-yogunluk]'))
    if (bolumler.length === 0) return

    const guncelle = rafKisitla(() => {
      const merkez = window.innerHeight / 2
      let enYakin = bolumler[0]
      let enKisa = Number.POSITIVE_INFINITY
      for (const bolum of bolumler) {
        const kutu = bolum.getBoundingClientRect()
        const uzaklik = Math.abs(kutu.top + kutu.height / 2 - merkez)
        if (uzaklik < enKisa) {
          enKisa = uzaklik
          enYakin = bolum
        }
      }
      const y = Number(enYakin?.dataset.yogunluk ?? 1)
      kor.style.opacity = String(0.3 + y * 0.7)
      kor.style.transform = `scale(${0.9 + y * 0.16})`
    })

    guncelle()
    window.addEventListener('scroll', guncelle, { passive: true })
    window.addEventListener('resize', guncelle, { passive: true })
    return () => {
      window.removeEventListener('scroll', guncelle)
      window.removeEventListener('resize', guncelle)
    }
  }, [yogunlukTakip])

  return (
    <div className={stil.kap} aria-hidden="true">
      <span ref={korRef} className={stil.kor} />
      <span className={stil.cekirdek} />
      <span className={`${stil.duman} ${stil.duman1}`} />
      <span className={`${stil.duman} ${stil.duman2}`} />
      <span className={`${stil.duman} ${stil.duman3}`} />
      <span className={stil.vinyet} />
      <span className={stil.izgara} />
    </div>
  )
}
```

CSS kesin değerleri (`docs/tasarim/ana-sayfa.json`, `sahne-kap` bölümü):
- `.kap`: `position: fixed; inset: 0 0 auto 0; height: 100vh; z-index: 0; overflow: hidden; pointer-events: none`
- `.kor`: `left:0; right:0; bottom:-14%; height:96%; background: radial-gradient(72% 96% at 50% 100%, rgba(183,53,28,.78), rgba(183,53,28,.2) 44%, transparent 70%); animation: emberBreath 8s ease-in-out infinite; transition: opacity .9s ease-out, transform .9s ease-out`
- `.cekirdek`: `left:50%; bottom:-10%; width:min(780px,110%); height:520px; transform:translateX(-50%); background: radial-gradient(closest-side, rgba(250,170,31,.42), transparent 72%); animation: emberSoft 11s ease-in-out infinite`
- `.duman1/2/3`: `left:28%/52%/68%`, `260px/220px/200px`, `filter: blur(34px)/blur(30px)/blur(28px)`, `animation: smokeDrift 22s/27s/32s linear infinite`, gecikme `0/8s/16s`
- `.vinyet`: `inset:0; box-shadow: inset 0 0 260px rgba(0,0,0,.86)`
- `.izgara`: `inset:0; background: repeating-linear-gradient(...) 1px/3px; opacity:.5; color rgba(242,233,220,.014)`

- [ ] **Step 3: ImlecKoru bileşenini yaz**

`mousemove` ile radial ışık: `translate3d((x - merkezX) * 0.34, (y - merkezY) * 0.34, 0)`, geçiş `.7s cubic-bezier(.2,.7,.2,1)`. `hareketAzaltilmisMi()` true ise dinleyici hiç bağlanmaz. Boyut 620x620, `background: radial-gradient(closest-side, rgba(250,170,31,.16), transparent 74%)`.

- [ ] **Step 4: data-erit reveal davranışını ekle**

`components/ui/Bolum.tsx` oluştur: `<section data-yogunluk>` sarmalayıcısı ve içinde `IntersectionObserver` ile `opacity .86 -> 1`, `translateY 14px -> 0`, `.5s ease-out` uygulayan `data-erit` bloğu. Observer bir kez tetikler ve `unobserve` eder.

- [ ] **Step 5: Doğrula**

Run: `npm run dev`, ana sayfaya farklı `data-yogunluk` değerli üç geçici bölüm koy ve kaydır
Expected: Kor opaklığı ve ölçeği bölüm değiştikçe yumuşak geçer, sahne viewport'ta sabit kalır, duman yukarı süzülür.

Sonra macOS'ta Sistem Ayarları > Erişilebilirlik > Ekran > Hareketi azalt'ı aç ve sayfayı yenile.
Expected: Hiçbir animasyon ve geçiş çalışmaz, içerik doğrudan görünür, `mousemove` dinleyicisi bağlanmaz.

- [ ] **Step 6: Commit**

```bash
git add components/ember/ components/ui/Bolum.tsx lib/hareket.ts
git commit -m "feat: add the ember scene and motion system"
```

---

## Task 6: Kabuk bileşenleri

**Files:**
- Create: `components/layout/UstBar.tsx` + `.module.css`
- Create: `components/layout/GeceSeridi.tsx` + `.module.css`
- Create: `components/layout/IlerlemeCubugu.tsx` + `.module.css`
- Create: `components/layout/DilAnahtari.tsx` + `.module.css`
- Create: `components/layout/AltBilgi.tsx` + `.module.css`
- Create: `components/layout/MobilAksiyonBari.tsx` + `.module.css`
- Create: `components/layout/Cekmece.tsx` + `.module.css`
- Create: `components/layout/BeadRay.tsx` + `.module.css`
- Create: `lib/site.ts`

**Interfaces:**
- Consumes: `content/` (Task 3), `components/ui/` (Task 4), `lib/saat.ts` (Task 2)
- Produces:
  - `export type RotaAnahtari = 'ana' | 'menu' | 'hikaye' | 'konum' | 'gizlilik'`
  - `export function yol(anahtar: RotaAnahtari, dil: Dil): string`
  - `export function tumYollar(): { anahtar: RotaAnahtari; tr: string; en: string }[]`
  - `export function telefonUrl(numara: string | null): string | null`
  - `export const SITE_URL = 'https://cigercibozo.com'` (alan adı henüz alınmadı, tek yerde)
  - `export function yolTarifiUrl(): string`: koordinat `null` iken adres metniyle Google Maps araması üretir
  - `export function whatsappUrl(numara: string | null): string | null`
  - `<UstBar dil={Dil} aktif={RotaAnahtari} ilerleme?={boolean} />`
  - `<AltBilgi dil={Dil} />`
  - `<MobilAksiyonBari dil={Dil} />`
  - `<BeadRay bolumler={{ id: string; buyuk: boolean }[]} />`

- [ ] **Step 1: lib/site.ts yaz**

```ts
import { isletme } from '@/content/isletme'
import type { Dil } from '@/content/types'

/** Alan adı henüz alınmadı. Satın alındığında yalnızca bu sabit değişir. */
export const SITE_URL = 'https://cigercibozo.com'

export type RotaAnahtari = 'ana' | 'menu' | 'hikaye' | 'konum' | 'gizlilik'

const YOLLAR: Record<RotaAnahtari, string> = {
  ana: '',
  menu: 'menu',
  hikaye: 'hikaye',
  konum: 'konum',
  gizlilik: 'gizlilik',
}

/** EN rotalarında yol adları Türkçe kalır: /en/menu, /en/hikaye. */
export function yol(anahtar: RotaAnahtari, dil: Dil): string {
  const parca = YOLLAR[anahtar]
  const onek = dil === 'en' ? '/en' : ''
  return parca === '' ? `${onek}/` : `${onek}/${parca}/`
}

export function tumYollar(): { anahtar: RotaAnahtari; tr: string; en: string }[] {
  return (Object.keys(YOLLAR) as RotaAnahtari[]).map((a) => ({
    anahtar: a,
    tr: yol(a, 'tr'),
    en: yol(a, 'en'),
  }))
}

/** Koordinat bilinmiyorken adres metniyle arama üretir. */
export function yolTarifiUrl(): string {
  if (isletme.koordinat) {
    const { enlem, boylam } = isletme.koordinat
    return `https://www.google.com/maps/dir/?api=1&destination=${enlem},${boylam}`
  }
  const adres = `${isletme.ad}, ${isletme.cadde}, ${isletme.sehir}, ${isletme.ulke}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adres)}`
}

export function whatsappUrl(numara: string | null): string | null {
  if (!numara) return null
  return `https://wa.me/${numara.replace(/\D/g, '')}`
}

export function telefonUrl(numara: string | null): string | null {
  return numara ? `tel:${numara.replace(/\s/g, '')}` : null
}
```

- [ ] **Step 2: UstBar bileşenini yaz**

Yapı (`docs/tasarim/ana-sayfa.json`, `ust-bar`):
- `position: fixed; top:0; left:0; right:0; z-index:60`
- Zemin `linear-gradient(to bottom, rgba(10,8,7,.9), rgba(10,8,7,0))`, `transition: background .3s ease-out`
- Üstte 2px ilerleme rayı (`IlerlemeCubugu`, yalnız ana sayfada), altında `GeceSeridi`, altında 80px yükseklikte bar
- Sol: marka kilidi = `TaneDizilimi boy={8} bosluk={4}` + "Ciğerci Bozo" `700 21px` Bricolage `letter-spacing:-.03em`, ana sayfaya link
- Sağ: nav linkleri `gap:30px`, `500 15px` Inter `var(--krem-86)`, hover `var(--tangerine)`; `DilAnahtari`; birincil CTA `boy="sm"`
- 780px altında nav linkleri gizlenir, `Cekmece` tetikleyicisi (iki çizgili hamburger) görünür

`IlerlemeCubugu` `'use client'`: `window.scrollY / (scrollHeight - innerHeight)` oranını `rafKisitla` ile yazar, `width` 0-100%, `background: linear-gradient(to right, #B7351C, #FAAA1F)`, `transition: width .12s linear`.

- [ ] **Step 3: DilAnahtari bileşenini yaz**

Tasarımda DOM metnini değiştiren bir toggle; burada **rota bağlantısına** dönüşür. Aktif dil `var(--krem)` ve `600`, pasif dil `var(--krem-50)`, ayırıcı `/` `rgba(242,233,220,.28)`. Bayrak ikonu yoktur.

```tsx
import Link from 'next/link'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { yol, type RotaAnahtari } from '@/lib/site'
import stil from './DilAnahtari.module.css'

type Props = { dil: Dil; aktif: RotaAnahtari }

export function DilAnahtari({ dil, aktif }: Props) {
  const s = sozluk(dil)
  return (
    <span className={stil.kap}>
      {dil === 'tr' ? (
        <span className={stil.aktif} aria-current="true">{s.ortak.dil.tr}</span>
      ) : (
        <Link className={stil.pasif} href={yol(aktif, 'tr')} hrefLang="tr" lang="tr">
          {s.ortak.dil.tr}
        </Link>
      )}
      <span className={stil.ayirici} aria-hidden="true">{s.ortak.dil.ayirici}</span>
      {dil === 'en' ? (
        <span className={stil.aktif} aria-current="true">{s.ortak.dil.en}</span>
      ) : (
        <Link className={stil.pasif} href={yol(aktif, 'en')} hrefLang="en" lang="en">
          {s.ortak.dil.en}
        </Link>
      )}
    </span>
  )
}
```

`lang` niteliği link üzerinde durur çünkü etiket metni hedef dildedir; ekran okuyucu `EN` metnini İngilizce telaffuz eder.

- [ ] **Step 4: GeceSeridi bileşenini yaz**

`'use client'`. `durumHesapla(new Date()).gece` true iken görünür, aksi halde `null` döner. İlk render'da her zaman `null` döner ve `useEffect` sonrası gerçek değeri alır; bu hydration uyuşmazlığını engeller. Zemin `rgba(183,53,28,.2)`, `padding: 8px var(--sayfa-yatay)`, `gap:10px`, 7px nabız noktası (`var(--tangerine)`, `box-shadow: 0 0 10px rgba(250,170,31,.9)`, `animation: dotPulse 2.4s`), metin `12.5px`.

- [ ] **Step 5: AltBilgi bileşenini yaz**

Dört kolon: marka (tane dizilimi + ad + tek cümle), Adres, Saatler, İletişim (ikonlu satırlar). Altında telif barı. Telefon, WhatsApp ve Instagram `null` iken satır görünür, metin yer tutucudur (`000 000 00 00`) ve `<a>` üretilmez, `<span>` basılır.

- [ ] **Step 6: MobilAksiyonBari ve Cekmece bileşenlerini yaz**

`MobilAksiyonBari` (`docs/tasarim/mobil-prototip-davranis-referansi.json`, `alt-eylem-bari`): `position: fixed; bottom:0; left:0; right:0; z-index:70`, üç eşit hedef (`flex:1`), her biri 50px yükseklik ve toplam dokunma alanı 44px üzerinde. Yol tarifi, Ara, WhatsApp. 780px üstünde `display:none`.

`Cekmece`: tam ekran menü katmanı, beş bağlı link ve altta canlı durum bilgisi. `'use client'`. Açıkken `document.body` kaydırması kilitlenir, `Escape` kapatır, açılışta ilk linke odak gider, kapanışta tetikleyiciye döner. `role="dialog"` ve `aria-modal="true"` taşır.

- [ ] **Step 7: BeadRay bileşenini yaz**

`'use client'`, yalnız ana sayfada. `position: fixed; right:26px; top:50%; transform: translateY(-50%); z-index:55`. Yedi bead, boyutlar sırayla 14/9/14/14/9/14/14px, aralarında 20px bağlayıcı çizgi (2px genişlik, `rgba(242,233,220,.16)`), üstte ve altta 24px gradyan çizgi. Pasif bead `rgba(242,233,220,.26)`. Aktif bead: `background: var(--kor)`, `transform: scale(1.5)`, glow. Aktiflik, bölüm merkezinin viewport merkezine yakınlığıyla belirlenir (KorSahnesi ile aynı hesap). Tıklandığında hedef bölüme `-70px` ofsetle kaydırır. Her bead `<button>` ve `aria-label` taşır.

- [ ] **Step 8: Doğrula**

Run: `npm run typecheck && npm run build && npm run dev`
Expected: Üst bar sabit, nav hover'da tangerine olur, dil anahtarı `/en/` rotasına gider, 780px altında hamburger ve alt eylem barı görünür, çekmece Escape ile kapanır.

- [ ] **Step 9: Commit**

```bash
git add components/layout/ lib/site.ts
git commit -m "feat: add the site shell components"
```

---

## Task 7: Rotalar, metadata, sitemap ve yapısal veri

**Files:**
- Create: `app/(tr)/page.tsx`, `app/(tr)/menu/page.tsx`, `app/(tr)/hikaye/page.tsx`, `app/(tr)/konum/page.tsx`, `app/(tr)/gizlilik/page.tsx`
- Create: `app/(en)/en/page.tsx`, `app/(en)/en/menu/page.tsx`, `app/(en)/en/hikaye/page.tsx`, `app/(en)/en/konum/page.tsx`, `app/(en)/en/gizlilik/page.tsx`
- Create: `app/sitemap.ts`, `app/robots.ts`
- Create: `lib/jsonld.ts`, `lib/metadata.ts`
- Create: `components/sayfa/` altında beş boş gövde bileşeni
- Modify: `app/(tr)/layout.tsx`, `app/(en)/layout.tsx` (JSON-LD eklenir)

**Interfaces:**
- Consumes: `lib/site.ts` (Task 6), `content/` (Task 3)
- Produces:
  - `export function sayfaMetadata(anahtar: RotaAnahtari, dil: Dil): Metadata`
  - `export function restaurantJsonLd(): object`
  - `components/sayfa/AnaSayfa.tsx` vb., imza: `({ dil }: { dil: Dil }) => JSX.Element`

- [ ] **Step 1: lib/metadata.ts yaz**

```ts
import type { Metadata } from 'next'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { SITE_URL, yol, type RotaAnahtari } from './site'

export function sayfaMetadata(anahtar: RotaAnahtari, dil: Dil): Metadata {
  const s = sozluk(dil)
  const meta = s.ortak.sayfaMeta[anahtar]
  return {
    title: meta.baslik,
    description: meta.aciklama,
    alternates: {
      canonical: `${SITE_URL}${yol(anahtar, dil)}`,
      languages: {
        tr: `${SITE_URL}${yol(anahtar, 'tr')}`,
        en: `${SITE_URL}${yol(anahtar, 'en')}`,
        'x-default': `${SITE_URL}${yol(anahtar, 'tr')}`,
      },
    },
    openGraph: {
      title: meta.baslik,
      description: meta.aciklama,
      locale: dil === 'en' ? 'en_GB' : 'tr_TR',
      type: 'website',
      url: `${SITE_URL}${yol(anahtar, dil)}`,
    },
  }
}
```

`content/tr/ortak.ts` içine her rota için `meta.<anahtar>.baslik` ve `meta.<anahtar>.aciklama` anahtarları eklenir.

- [ ] **Step 2: lib/jsonld.ts yaz**

`openingHoursSpecification` içinde `closes` değerinin `opens` değerinden küçük olması ertesi güne taşmayı ifade eder; Google bu yazımı destekler. Koordinat `null` iken `geo` alanı hiç yazılmaz, uydurma değer konmaz.

```ts
import { isletme } from '@/content/isletme'
import { SITE_URL } from './site'

export function restaurantJsonLd(): object {
  const veri: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: isletme.ad,
    url: SITE_URL,
    servesCuisine: 'Turkish',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: isletme.binaNo
        ? `${isletme.cadde} ${isletme.binaNo}`
        : isletme.cadde,
      addressLocality: isletme.sehir,
      addressCountry: 'CY',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday', 'Sunday',
        ],
        opens: '10:00',
        closes: '05:00',
      },
    ],
  }
  if (isletme.koordinat) {
    veri.geo = {
      '@type': 'GeoCoordinates',
      latitude: isletme.koordinat.enlem,
      longitude: isletme.koordinat.boylam,
    }
  }
  if (isletme.telefon) veri.telephone = isletme.telefon
  return veri
}
```

- [ ] **Step 3: Rota dosyalarını yaz**

`app/(tr)/menu/page.tsx` deseni (on iki rotanın hepsi bu kalıbı izler):

```tsx
import type { Metadata } from 'next'
import { MenuSayfasi } from '@/components/sayfa/MenuSayfasi'
import { sayfaMetadata } from '@/lib/metadata'

export const metadata: Metadata = sayfaMetadata('menu', 'tr')

export default function Sayfa() {
  return <MenuSayfasi dil="tr" />
}
```

Rota ağacı, Task 1'de kurulan iki root layout üzerine oturur. Route group parantezleri URL'ye girmez, bu yüzden TR kökte kalır ve EN yolu `(en)` grubunun **içindeki** `en/` klasöründen gelir:

```
app/
  (tr)/layout.tsx        <html lang="tr">
  (tr)/page.tsx                  -> /
  (tr)/menu/page.tsx             -> /menu/
  (tr)/hikaye/page.tsx           -> /hikaye/
  (tr)/konum/page.tsx            -> /konum/
  (tr)/gizlilik/page.tsx         -> /gizlilik/
  (en)/layout.tsx        <html lang="en">
  (en)/en/page.tsx               -> /en/
  (en)/en/menu/page.tsx          -> /en/menu/
  (en)/en/hikaye/page.tsx        -> /en/hikaye/
  (en)/en/konum/page.tsx         -> /en/konum/
  (en)/en/gizlilik/page.tsx      -> /en/gizlilik/
  global-not-found.tsx           -> /404.html   (Task 14)
  sitemap.ts  robots.ts  globals.css
```

Bu yapı ölçülerek doğrulanmıştır: `out/index.html` ve `out/menu/index.html` `<html lang="tr">`, `out/en/index.html` `<html lang="en">` taşır.

- [ ] **Step 4: sitemap.ts ve robots.ts yaz**

```ts
// app/sitemap.ts
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

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 5: JSON-LD'yi her iki root layout'a bağla**

`<body>` içine, `{children}` öncesine konur. İki layout da aynı veriyi basar; işletme tek olduğu için dil ayrımı yapılmaz.

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
/>
```

- [ ] **Step 6: Export çıktısını doğrula**

Run: `npm run build && find out -name 'index.html' | sort`
Expected: On `index.html` (5 TR + 5 EN), ayrıca `out/sitemap.xml` ve `out/robots.txt`.

Run: `for f in out/index.html out/menu/index.html out/en/index.html out/en/menu/index.html; do printf '%-28s ' "$f"; grep -o '<html lang="[a-z]*"' "$f" | head -1; done`
Expected: İlk ikisi `lang="tr"`, son ikisi `lang="en"`

Run: `grep -o 'hreflang="[a-z-]*"' out/index.html | sort -u`
Expected: `hreflang="tr"`, `hreflang="en"`, `hreflang="x-default"`

- [ ] **Step 7: Commit**

```bash
git add app/ lib/metadata.ts lib/jsonld.ts components/sayfa/
git commit -m "feat: add the bilingual route tree with metadata and sitemap"
```

---

## Task 8: Canlı saat bileşenleri

**Files:**
- Create: `components/saat/CanliSaat.tsx` + `.module.css`
- Create: `components/saat/DurumCipi.tsx` + `.module.css`
- Create: `components/saat/SaatTablosu.tsx` + `.module.css`
- Create: `components/saat/VardiyaSeridi.tsx` + `.module.css`
- Create: `components/saat/useGirneSaati.ts`

**Interfaces:**
- Consumes: `lib/saat.ts` (Task 2), `content/` (Task 3)
- Produces:
  - `export function useGirneSaati(): Durum | null`: mount öncesi `null`
  - `<CanliSaat boy="dev" | "orta" | "hayalet" />`
  - `<DurumCipi dil={Dil} />`
  - `<SaatTablosu dil={Dil} />`: "Bugün" satırı `gosterimGunIndeksi` ile işaretlenir
  - `<VardiyaSeridi dil={Dil} />`: aktif saate en yakın vardiya çipi tangerine olur

- [ ] **Step 1: useGirneSaati hook'unu yaz**

Hydration uyuşmazlığını engelleyen desen: ilk render'da `null`, `useEffect` sonrası gerçek değer.

```ts
'use client'

import { useEffect, useState } from 'react'
import { durumHesapla, type Durum } from '@/lib/saat'

export function useGirneSaati(): Durum | null {
  const [durum, setDurum] = useState<Durum | null>(null)

  useEffect(() => {
    const yaz = (): void => setDurum(durumHesapla(new Date()))
    yaz()
    const zamanlayici = window.setInterval(yaz, 1000)
    return () => window.clearInterval(zamanlayici)
  }, [])

  return durum
}
```

- [ ] **Step 2: CanliSaat bileşenini yaz**

`durum === null` iken yer tutucu `--:--` basar ve `aria-hidden` olur. İki nokta ayrı `<span>`, `animation: colonBlink 2s step-end infinite`, rengi `var(--tangerine)`. Rakamlar `font-variant-numeric: tabular-nums`, `font-family: var(--font-baslik)`, `font-weight:700`.

Boyutlar: `dev` = `clamp(30px,3.4vw,44px)`, `orta` = 21px, `hayalet` = gece bölümündeki dev arka plan saati, `opacity:.055`.

Saat bileşeni `<time>` etiketi kullanır ve `dateTime` niteliğini taşır.

- [ ] **Step 3: DurumCipi bileşenini yaz**

`padding:10px 16px`, `background: rgba(10,8,7,.6)`, `border:1px solid var(--tangerine-30)`, 9px nokta + metin `600 14.5px`.
- Açıkken: nokta `var(--tangerine)` + `dotPulse`, metin `s.ortak.durum.acik`, renk `var(--tangerine)`
- Kapalıyken: nokta `var(--krem-50)`, animasyon yok, metin `s.ortak.durum.kapali`, renk `var(--krem-70)`
- `durum === null` iken kapalı görünümü basar (SSR güvenli varsayılan) ve `aria-live="polite"` taşır

- [ ] **Step 4: SaatTablosu ve VardiyaSeridi bileşenlerini yaz**

`SaatTablosu`: yedi satır, her satırda gün adı ve `10:00 - 05:00`. `gosterimGunIndeksi(new Date())` ile eşleşen satır "Bugün" etiketini ve `var(--tangerine)` rengini alır. Gün adları sözlükten gelir (`s.ortak.gunler`, 0=Pazar sıralı yedi eleman).

`VardiyaSeridi`: gece bölümündeki vardiya çipleri. Saat listesi tasarımdan alınır; `durum.saat` ile eşleşen çip `var(--tangerine)` olur, diğerleri `var(--krem-58)`.

- [ ] **Step 5: Doğrula**

Run: `npm run dev`, konum sayfasını aç
Expected: Saat saniyede bir güncellenir, iki nokta yanıp söner, "Bugün" satırı doğru güne düşer. Tarayıcı konsolunda hydration uyarısı **yoktur**.

Run: `npm run build && grep -c '\-\-:\-\-' out/konum/index.html`
Expected: En az 1. Statik HTML'de yer tutucu bulunur, gerçek saat istemcide yazılır.

- [ ] **Step 6: Commit**

```bash
git add components/saat/
git commit -m "feat: add the live Girne clock components"
```

---

## Task 9: Ana sayfa, birinci yarı

**Files:**
- Create: `components/sayfa/ana/Acilis.tsx`, `Iddia.tsx`, `Ocaktan.tsx`, `Ikram.tsx` + her biri için `.module.css`
- Create: `components/ui/AnimasyonluSayac.tsx` + `.module.css`
- Create: `components/ui/MenuSatiri.tsx` + `.module.css`
- Modify: `components/sayfa/AnaSayfa.tsx`

**Interfaces:**
- Consumes: Task 4, 5, 6, 8 çıktıları
- Produces:
  - `<AnimasyonluSayac hedef={number} sure?={number} />` (varsayılan süre 900ms)
  - `<MenuSatiri sira={number} ad={string} aciklama={string} fiyat={number | null} />`: sözlüğe bağlanmaz, çağıran taraf ad ve açıklamayı sözlükten geçirir; böylece aynı satır menü sayfasında da kullanılır

**Kaynak:** `docs/tasarim/ana-sayfa.json` bölümleri `acilis` (yoğunluk 1), `iddia` (0.55), `ocaktan` (0.4), `ikram` (0.7). Kesin ölçüler oradadır; belirsiz kalan her nokta için `Ana Sayfa Alternatif.dc.html` açılır.

- [ ] **Step 1: AnimasyonluSayac bileşenini yaz**

`IntersectionObserver` eşiği 0.5, 900ms ease-out, yalnız bir kez çalışır. `hareketAzaltilmisMi()` true ise doğrudan hedef değeri basar. `4+2` hücresi sayaç değildir, statik metindir.

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { hareketAzaltilmisMi } from '@/lib/hareket'

export function AnimasyonluSayac({ hedef, sure = 900 }: { hedef: number; sure?: number }) {
  const [deger, setDeger] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (hareketAzaltilmisMi()) {
      setDeger(hedef)
      return
    }
    const gozlemci = new IntersectionObserver(
      ([giris]) => {
        if (!giris?.isIntersecting) return
        gozlemci.unobserve(el)
        const baslangic = performance.now()
        const adim = (simdi: number): void => {
          const t = Math.min((simdi - baslangic) / sure, 1)
          const yumusak = 1 - Math.pow(1 - t, 3) // ease-out cubic
          setDeger(Math.round(hedef * yumusak))
          if (t < 1) requestAnimationFrame(adim)
        }
        requestAnimationFrame(adim)
      },
      { threshold: 0.5 },
    )
    gozlemci.observe(el)
    return () => gozlemci.disconnect()
  }, [hedef, sure])

  return <span ref={ref}>{deger}</span>
}
```

- [ ] **Step 2: Acilis bölümünü yaz**

Yapı sırası: durum satırı (`DurumCipi` + `CanliSaat boy="dev"` + durum alt metni) → H1 iki satır → alt başlık + `TaneDizilimi boy={20} bosluk={12} cizgi` → CTA çifti + meta satırı → kaydırma ipucu.

H1: `font: 800 var(--ol-hero)/1.06 var(--font-baslik)`, `letter-spacing: var(--iz-hero)`, `text-shadow: 0 8px 60px rgba(10,8,7,.6)`. Bölüm `min-height:100vh`, `padding: 120px var(--sayfa-yatay) 0`, `data-yogunluk="1"`.

- [ ] **Step 3: Iddia bölümünü yaz**

İki kolon (`flex-wrap`, `gap: clamp(32px,4vw,72px)`). Sol `CamPanel opaklik={0.72}` içinde başlık, paragraf ve üçlü sayaç ızgarası (hairline ayırıcı: kap `background: rgba(242,233,220,.12)`, `gap:1px`, hücreler `rgba(10,8,7,.9)`). Sayılar `700 clamp(44px,4.6vw,64px)` Bricolage `var(--tangerine)` tabular. Sağ `FotoYuvasi id="tane-yakin-cekim" bicim="portre" koseIsaretleri={4}`, ortasında `TaneDizilimi boy={22} bosluk={11} anahat` `opacity:.5`.

- [ ] **Step 4: Ocaktan bölümünü yaz**

`CamPanel opaklik={0.74}` içinde `BolumBasligi` ve beş `MenuSatiri`. Satır: sıra numarası, ad, açıklama, `TaneDizilimi boy={9} bosluk={5}` mini, `fiyatMetni(urun.fiyat)`. Hover: `transform: translateX(24px)`, zemin `var(--tangerine-08)`, geçiş `var(--gecis-hizli)`. Satır bir `<li>`, liste `<ol>`.

- [ ] **Step 5: Ikram bölümünü yaz**

Merkezli blok: `TaneDizilimi boy={16} bosluk={10}`, duygusal başlık `font: 800 var(--ol-duygusal)/1.08`, `letter-spacing: var(--iz-duygusal)`, iki `Cip tur="ikram"` (lebeni, bostana), altında `FotoYuvasi id="kurulu-sofra" bicim="genis" koseIsaretleri={2} etiketYeri="orta"` (`width: min(760px,100%)`).

- [ ] **Step 6: Parite doğrulaması**

Run: `npm run dev`, ana sayfayı 1440px ve 390px genişlikte aç
Expected: `screenshots/01-ana-sayfa.jpg`, `02-ana-sayfa.jpg` ve `03-ana-sayfa.jpg` ile yan yana karşılaştır. Başlık ölçeği, sayaç renkleri, foto plakası köşe işaretleri ve etiket kutusu birebir olmalı.

Sayaçları doğrula: sayfayı yenile ve iddia bölümüne kaydır.
Expected: 8 ve 3 sıfırdan sayarak dolar, `4+2` statik kalır, animasyon bir kez çalışır.

- [ ] **Step 7: Commit**

```bash
git add components/sayfa/ana/ components/ui/AnimasyonluSayac.tsx components/ui/MenuSatiri.tsx
git commit -m "feat: build the home page hero through the treats section"
```

---

## Task 10: Ana sayfa, ikinci yarı

**Files:**
- Create: `components/sayfa/ana/Gece.tsx`, `Bozo.tsx`, `Konum.tsx`, `PaketSeridi.tsx` + `.module.css`
- Create: `components/ui/OkluBaglanti.tsx` + `.module.css`
- Modify: `components/sayfa/AnaSayfa.tsx`

**Interfaces:**
- Consumes: Task 8 (`CanliSaat`, `VardiyaSeridi`, `SaatTablosu`), Task 9
- Produces: `<OkluBaglanti href={string}>`: metin + kısa çizgi, hover'da `gap` açılır

**Kaynak:** `docs/tasarim/ana-sayfa.json` bölümleri `gece` (yoğunluk 1.25), `bozo` (0.45), `konum` (0.3), `paket`, `footer`.

- [ ] **Step 1: Gece bölümünü yaz**

Arka planda `CanliSaat boy="hayalet"` (`opacity:.055`), önünde duygusal başlık ("Girne uyurken ocak yanıyor."), `VardiyaSeridi`, ve "ocak 05:00'te söner" satırı. Bölüm yoğunluğu 1.25 olduğu için kor en parlak burada olur.

- [ ] **Step 2: Bozo bölümünü yaz**

`CamPanel opaklik={0.72}` içinde kicker satırı (amber kare + kısa etiket), başlık, hazır metin bloğu ve `OkluBaglanti` ile `/hikaye`. Sağda `FotoYuvasi id="ustanin-eli" bicim="portre" koseIsaretleri={4}`.

- [ ] **Step 3: Konum bölümünü yaz**

`CamPanel opaklik={0.74}` içinde pin ikonlu adres, `SaatTablosu`, komşuluk çipleri, `Buton` çifti (yol tarifi birincil, telefon ikincil). Sağda harita plakası (`FotoYuvasi` değil, ayrı `HaritaPlakasi` bileşeni: CSS ile çizilmiş koyu tema levha + nabızlı pin + POI çipleri). Production'da gerçek harita gelecek; bileşen tek yerde durur ki değişimi kolay olsun.

- [ ] **Step 4: PaketSeridi bölümünü yaz**

Tam genişlik `background: var(--pumpkin)`, metin `var(--komur)`. `TaneDizilimi boy={12} bosluk={7}` koyu varyant, başlık ("Ocaktan çıkan"), `Buton tur="koyu"` ve `Buton tur="koyuOutline"`. Pumpkin yalnız burada kullanılır.

- [ ] **Step 5: BeadRay'i bağla**

`AnaSayfa.tsx` içinde `<BeadRay>` yedi bölümü alır: acilis(büyük), iddia(küçük), ocaktan(büyük), ikram(büyük), gece(küçük), bozo(büyük), konum(büyük).

- [ ] **Step 6: Parite doğrulaması**

Run: `npm run dev`
Expected: `screenshots/03-ana-sayfa.jpg`, `04-ana-sayfa.jpg`, `05-ana-sayfa.jpg` ile karşılaştır. Bead rayı kaydırırken aktif bölümü işaretler ve tıklayınca `-70px` ofsetle kaydırır. Pumpkin şerit yalnız paket bölümünde görünür.

- [ ] **Step 7: Commit**

```bash
git add components/sayfa/ana/ components/ui/OkluBaglanti.tsx
git commit -m "feat: complete the home page with night, story and location"
```

---

## Task 11: Menü sayfası

**Files:**
- Create: `components/sayfa/menu/` altında `MenuAcilis.tsx`, `OcaktanSpread.tsx`, `UrunKarti.tsx`, `Ikramlar.tsx`, `Icecekler.tsx`, `CekimListesi.tsx` + `.module.css`
- Modify: `components/sayfa/MenuSayfasi.tsx`

**Interfaces:**
- Consumes: Task 4, 6, 8 çıktıları; `content/urunler.ts`
- Produces: `<UrunKarti urun={Urun} dil={Dil} indeks={number} />`

**Kaynak:** `docs/tasarim/menu.json`. Bölümler: `menu-acilis`, `ocaktan` (imza ürün spread'i + 4 ürün kartı), `ikramlar`, `icecekler`, `cekim-listesi`, `alt-bilgi`.

- [ ] **Step 1: MenuAcilis bölümünü yaz**

`DurumCipi` + `CanliSaat` + gece menüsü not kartı. Not kartı içeriği işletmeden gelmedi; sözlükte açık bir yer tutucu cümle taşır.

- [ ] **Step 2: OcaktanSpread bölümünü yaz**

İmza ürün (ciğer) için geniş spread: solda `FotoYuvasi id="tane-yakin-cekim"` yatay biçim (`min-height: clamp(...)`), sağda `ImzaUrunPaneli`: `Cip tur="outline"` ("imza ürün"), ad, uzun açıklama, üç `Cip tur="dolu"` spec çipi (8 şiş · 4 ciğer, 2 kuyruk yağı · 3 dakika), porsiyon fiyatı.

- [ ] **Step 3: UrunKarti bileşenini ve dört kartlık ızgarayı yaz**

Kart: üstte `FotoYuvasi bicim="karo"` (`height: clamp(240px,30vh,300px)`), gövdede indeks rozeti, ad, açıklama, alt satırda `TaneDizilimi` mini ve fiyat. Dört ürün: dalak, yürek, kuzu şiş, terbiyesiz tavuk şiş. Dalak, yürek ve kuzu şiş porsiyon detayları işletmeden gelmedi; açıklama satırı sözlükte kısa yer tutucu taşır.

- [ ] **Step 4: Ikramlar ve Icecekler bölümlerini yaz**

`Ikramlar`: iki yatay kart, solda foto yuvası, sağda ad, açıklama ve `Cip tur="ikram"`. **Fiyat basılmaz**, "ikram" ibaresi yazılır.

`Icecekler`: solda `FotoYuvasi id="ayran"`, sağda fiyat satırları ve `ICECEK_YER_TUTUCU_ADEDI` kadar kesik çerçeveli boş slot. Altında alkolsüz bilgisi tek sakin satır (`s.ortak.alkolsuz`) ve QR glifi.

- [ ] **Step 5: CekimListesi bölümünü yaz**

Yedi kadraj karosu (`height:110px`, `grid-template-columns: repeat(auto-fit, minmax(...))`): tane yakın çekimi, kor üzerinde şiş, ustanın eli, kurulu sofra, gece cephesi, paket ve gel al, beş ürün ayrı ayrı. `fotograflar` manifestinden okur.

- [ ] **Step 6: Parite doğrulaması**

Run: `npm run dev`, `/menu` ve `/en/menu` adreslerini aç
Expected: `screenshots/01-menu.jpg` ile `04-menu.jpg` arası karşılaştır. EN sayfada ürün adları çevrilmemiş, açıklanmış olmalı (`Urfa liver kebab (ciğer)`); `Alcohol-free` görünür olmalı.

- [ ] **Step 7: Commit**

```bash
git add components/sayfa/menu/ components/sayfa/MenuSayfasi.tsx
git commit -m "feat: build the menu page"
```

---

## Task 12: Hikaye sayfası

**Files:**
- Create: `components/sayfa/hikaye/` altında `HikayeAcilis.tsx`, `Portre.tsx`, `Usul.tsx`, `Sofra.tsx` + `.module.css`
- Create: `components/ui/NotBlogu.tsx`, `components/ui/EtiketSatiri.tsx` + `.module.css`
- Modify: `components/sayfa/HikayeSayfasi.tsx`

**Interfaces:**
- Consumes: Task 4, 6
- Produces: `<NotBlogu>` (sol amber çizgili alıntı bloğu), `<EtiketSatiri etiket={string} />` (amber kare + kısa etiket)

**Kaynak:** `docs/tasarim/hikaye.json`. Bölümler: `hikaye-acilis`, `portre`, `usul` (üç satır), `sofra`.

- [ ] **Step 1: HikayeAcilis ve Portre bölümlerini yaz**

Açılış: `EtiketSatiri` + duygusal başlık. Portre: `FotoYuvasi id="bozo-portre"` + `CamPanel opaklik={0.72}` içinde Bozo metni + `NotBlogu`.

Metin, `metin-envanteri.json` içindeki "Bozo kimdir" bloğundan alınır. İki sürüm var (brief ve bilgi dosyası); **brief sürümü** kullanılır, ikisi aynı sayfada birlikte kullanılmaz.

- [ ] **Step 2: Usul bölümünü yaz**

`CamPanel opaklik={0.74}` içinde üç `UsulSatiri`: numara + etiket + içerik. Bazı satırlar metin, bazıları `Cip` taşır. Yanında `TaneDizilimi` orta boy.

Urfa'dan Girne'ye hikaye metni işletmeden gelmedi; mevcut hazır bloklar ("Manifesto", "Orta versiyon") kullanılır, yeni metin uydurulmaz.

- [ ] **Step 3: Sofra bölümünü yaz**

`TaneDizilimi` büyük boy, duygusal başlık, ikram metni, `Buton` çifti (menüyü gör birincil, yol tarifi ikincil).

- [ ] **Step 4: Parite doğrulaması**

Run: `npm run dev`, `/hikaye` ve `/en/hikaye`
Expected: `screenshots/01-hikaye.jpg` ile `03-hikaye.jpg` karşılaştırması. EN metinde `Bozo` adının bir kişinin lakabı olduğu açıkça geçmeli.

- [ ] **Step 5: Commit**

```bash
git add components/sayfa/hikaye/ components/ui/NotBlogu.tsx components/ui/EtiketSatiri.tsx
git commit -m "feat: build the story page"
```

---

## Task 13: Konum sayfası

**Files:**
- Create: `components/sayfa/konum/` altında `KonumAcilis.tsx`, `HaritaBolumu.tsx`, `SaatlerVeIletisim.tsx` + `.module.css`
- Create: `components/ui/HaritaPlakasi.tsx` + `.module.css`
- Create: `components/ui/IletisimSatiri.tsx` + `.module.css`
- Modify: `components/sayfa/KonumSayfasi.tsx`

**Interfaces:**
- Consumes: Task 4, 6, 8
- Produces: `<HaritaPlakasi />` (CSS ile çizilmiş koyu tema levha + nabızlı pin + POI çipleri), `<IletisimSatiri ikon={ReactNode} etiket={string} deger={string} href={string | null} />`

**Kaynak:** `docs/tasarim/konum.json`. Bu sayfada **fotoğraf yuvası yoktur**, yalnız çizilmiş harita levhası vardır.

- [ ] **Step 1: KonumAcilis bölümünü yaz**

`DurumCipi` + `CanliSaat` + başlık + `Buton` çifti (yol tarifi birincil büyük, telefon hayalet). Telefon `null` iken buton pasif görünür ve `href` üretmez.

- [ ] **Step 2: HaritaBolumu ve HaritaPlakasi bileşenlerini yaz**

Levha CSS ile çizilir: ızgara, yol şeridi, halka + nabızlı nokta + isim etiketi, komşu POI çipleri. Üstünde açık bir not: gerçek harita entegrasyonla gelecek. `aria-label` ile adres okunur.

`HaritaPlakasi` tek dosyadadır; Google Maps veya Mapbox gömülüsü geldiğinde yalnız burası değişir.

- [ ] **Step 3: SaatlerVeIletisim bölümünü yaz**

İki `PanelKart`. Sol: `SaatTablosu` + `AlkolsuzRozeti`. Sağ: `IletisimSatiri` ile telefon, WhatsApp, Instagram, e-posta. Hepsi `null` olduğu için hepsi yer tutucu metinle ve bağlantısız basılır.

- [ ] **Step 4: Parite doğrulaması**

Run: `npm run dev`, `/konum` ve `/en/konum`
Expected: `screenshots/01-konum.jpg` ile `03-konum.jpg` karşılaştırması. "Bugün" satırı doğru güne düşer; gece 03:00'te önceki günü gösterdiğini doğrulamak için sistem saatini geçici değiştirerek veya `durumHesapla` çıktısını konsola basarak kontrol et.

- [ ] **Step 5: Commit**

```bash
git add components/sayfa/konum/ components/ui/HaritaPlakasi.tsx components/ui/IletisimSatiri.tsx
git commit -m "feat: build the location page"
```

---

## Task 14: 404 ve Gizlilik sayfaları

**Files:**
- Create: `components/sayfa/GizlilikSayfasi.tsx` + `.module.css`
- Create: `components/sayfa/HataSayfasi.tsx` + `.module.css`
- Create: `app/global-not-found.tsx`
- Modify: `content/tr/gizlilik.ts`, `content/tr/hata.ts` ve EN karşılıkları

**Interfaces:**
- Consumes: Task 4, 6
- Produces: yok

- [ ] **Step 1: 404 metnini yaz**

Statik export tek bir `404.html` üretir, dil ayrımı yapılamaz; TR sözlüğü kullanılır.

`content/tr/hata.ts`:

```ts
export const hata = {
  kicker: '404',
  baslik: 'Bu sayfa ocakta yok.',
  metin: 'Aradığınız sayfayı bulamadık. Ocak yanmaya devam ediyor, aşağıdan devam edin.',
  anaSayfa: 'Ana sayfa',
  menu: 'Menüyü gör',
}
```

`content/en/hata.ts`:

```ts
export const hata = {
  kicker: '404',
  baslik: 'This page is not on the grill.',
  metin: 'We could not find the page you were looking for. The fire is still going; pick up from below.',
  anaSayfa: 'Home',
  menu: 'See the menu',
}
```

Espri tek ve ölçülüdür ("ocakta yok"), ünlem yoktur, tamamı büyük harf yoktur, terminoloji kilidine (ocak) uyar.

- [ ] **Step 1b: app/global-not-found.tsx yaz**

Bu dosya kök layout'u atlar, bu yüzden `<html>`, `<body>`, global CSS ve font sınıflarını kendisi taşır.

```tsx
import type { Metadata } from 'next'
import { HataSayfasi } from '@/components/sayfa/HataSayfasi'
import { fontSiniflari } from '@/lib/fontlar'
import { sozluk } from '@/content'
import './globals.css'

export const metadata: Metadata = {
  title: '404 · Ciğerci Bozo',
  description: sozluk('tr').hata.metin,
}

export default function GlobalNotFound() {
  return (
    <html lang="tr" className={fontSiniflari}>
      <body>
        <HataSayfasi dil="tr" />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Gizlilik metnini yaz**

KKTC ve AB ziyaretçileri düşünülerek sade bir gizlilik metni. Site şu an çerez kullanmıyor, form toplamıyor ve analiz aracı barındırmıyor; metin bunu açıkça söyler. Analytics eklendiğinde bu sayfa güncellenir. Uydurma veri işleme iddiası yazılmaz.

- [ ] **Step 3: Doğrula**

Run: `npm run build && ls out/404.html out/gizlilik/index.html out/en/gizlilik/index.html`
Expected: Üç dosya da var

Run: `grep -o '<html lang="[a-z]*"' out/404.html && grep -c 'stylesheet' out/404.html`
Expected: `<html lang="tr"` ve en az bir stylesheet bağlantısı. Stylesheet yoksa `globals.css` importu `global-not-found.tsx` içinde eksiktir.

- [ ] **Step 4: Commit**

```bash
git add components/sayfa/GizlilikSayfasi.tsx components/sayfa/HataSayfasi.tsx app/global-not-found.tsx content/
git commit -m "feat: add the privacy and not-found pages"
```

---

## Task 15: Parite, erişilebilirlik ve yayın doğrulaması

**Files:**
- Create: `docs/PARITE.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: tüm önceki görevler
- Produces: yok

- [ ] **Step 1: Tam doğrulama setini çalıştır**

```bash
npm run typecheck
npm test
npm run build
```
Expected: Üçü de hatasız. Build çıktısında 10 sayfa rotası (5 TR + 5 EN) artı `sitemap.xml` ve `robots.txt` listelenir.

- [ ] **Step 2: Yasak kalıp taraması**

```bash
grep -rn ':' content/ components/ && echo "HATA: em dash bulundu" || echo "temiz: em dash yok"
grep -rniE 'eşsiz lezzet|efsane|leziz|7/24|non-stop|şef önerisi|dünyaca ünlü' content/ && echo "HATA: yasaklı ifade" || echo "temiz: yasaklı ifade yok"
grep -rn 'müşteri\|mangal\|ızgara\|bedava\|ücretsiz' content/ && echo "UYARI: terminoloji kilidi ihlali olabilir" || echo "temiz: terminoloji"
```
Expected: Üçü de temiz. `ızgara` kelimesi CSS bağlamında geçebilir, o yüzden yalnız `content/` taranır.

- [ ] **Step 3: Türkçe karakter doğrulaması**

```bash
grep -c 'ğ\|Ğ\|ş\|Ş\|İ\|ı\|ç\|Ç\|ö\|ü' out/index.html
```
Expected: Sıfırdan büyük. Ardından tarayıcıda ana sayfayı aç ve `Ciğerci`, `şiş`, `İkram`, `Bugün` kelimelerinin doğru render edildiğini gözle doğrula. Yanlış render varsa font subset ayarını (`latin-ext`) kontrol et.

- [ ] **Step 4: Ekran parite turu**

`docs/PARITE.md` oluştur ve her sayfa için bir satır yaz: sayfa, karşılaştırılan ekran görüntüsü, durum, varsa sapma ve gerekçesi. Bilinçli sapmalar (gerçek `position:fixed`, gerçek `<a>` etiketleri, rota tabanlı dil) burada belgelenir.

Karşılaştırma: `npm run dev`, tarayıcıyı 1440px ve 390px genişliğe ayarla, her sayfayı `design_handoff_bozo_website/screenshots/` altındaki karşılığıyla yan yana koy.

- [ ] **Step 5: Erişilebilirlik turu**

- Klavyeyle sekme: her etkileşimli öğeye ulaşılır, odak halkası görünür, çekmece açıkken odak içeride kalır
- 390px genişlikte her dokunma hedefini ölç: en az 44px
- `prefers-reduced-motion` açıkken sayfayı gez: hiçbir animasyon çalışmaz, sayaçlar doğrudan hedef değeri gösterir
- Ekran okuyucuda kor sahnesi, duman ve tane dizilimleri okunmaz (`aria-hidden`)
- Renk kontrastı: krem üstü kömür 14.94:1, tangerine üstü kömür 9.27:1, pumpkin üstü kömür 5.29:1: hepsi AA üstü

- [ ] **Step 6: Statik sunum provası**

```bash
npx serve out
```
`http://localhost:3000/menu/` adresini aç.
Expected: `trailingSlash: true` sayesinde sayfa açılır. Sonra `/olmayan-sayfa/` adresini dene; sunucu 404 döndürür ve `out/404.html` içeriğini gösterir.

- [ ] **Step 7: README yayın bölümünü yaz**

researchos-server'a statik yayın adımları: `npm run build`, `out/` içeriğini sunucudaki Caddy `file_server` köküne kopyala, Caddy'de `try_files {path} {path}/ /404.html` yapılandırması. Alan adı alındığında `lib/site.ts` içindeki `SITE_URL` güncellenir.

- [ ] **Step 8: Commit**

```bash
git add docs/PARITE.md README.md
git commit -m "docs: record the design parity and release checks"
```

---

## Bilinen boşluklar

Bu plan tamamlandığında site yayına hazırdır ama şu veriler işletmeden bekleniyor ve yer tutucuyla geçilmiştir:

fiyatlar · telefon · WhatsApp · Instagram · e-posta · harita koordinatı · bina numarası · dalak, yürek ve kuzu şiş porsiyon detayları · gece menüsü kalemleri · içecek listesinin tamamı · Urfa'dan Girne'ye hikaye metni · fotoğraflar · onaylı logo · alan adı

Her biri `content/isletme.ts`, `content/urunler.ts`, `content/fotograflar.ts` veya sözlük dosyalarından tek noktada doldurulur; hiçbiri JSX değişikliği gerektirmez.

## Sonraki fazlar (bu planın dışında)

Galeri sayfası (fotoğraflar geldiğinde) · Rezervasyon (WhatsApp yönlendirmesi ve form) · Gerçek harita gömülüsü · Google Analytics ve Search Console · QR menü bağlantısı · Onaylı logonun SVG olarak yerleştirilmesi
