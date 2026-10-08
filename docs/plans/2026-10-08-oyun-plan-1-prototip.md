# Açılış oyunu · Plan 1: simülasyon çekirdeği ve oynanabilir prototip

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Oyunun deterministik simülasyon çekirdeğini (`lib/oyun/`) ve onu sunucusuz oynatan gri
kutulu bir prototipi (`/oyun/`) kurmak; kaba prototip testi (spec §16) bununla yapılır.

**Architecture:** Kurallar `lib/oyun/` altında saf TypeScript: tamsayı, sabit tik (60/sn), tohumlu
üreteç; `ilerle(oyun, hedefler)` bir tik ilerletir, `simule(tohum, girdiler)` bütün geceyi oynatır.
Aynı dosyalar 3. planda sunucuda skoru yeniden hesaplar. Ekran (`components/oyun/`) DOM + düğmeler:
React yapıyı yalnız olay olunca çizer, her karede değişen değerleri (ray, sabır, saat) rAF döngüsü
`data-ciz` öğelerine doğrudan yazar.

**Tech Stack:** Next.js 16 App Router (statik export), React 19.2 (`useEffectEvent`), TypeScript
strict (`noUncheckedIndexedAccess`, `noUnusedLocals`), CSS Modules + token'lar, `node --test`.

**Spec:** `docs/specs/2026-10-08-oyun-design.md` (§3-§6, §10, §11, §15-§17 adım 1-2)

**Ön doğrulama.** Bu plandaki her dosya, plan yazılırken reponun geçici bir kopyasında yazıldı ve
doğrulandı: `npm run typecheck` temiz, `npm test` 234/234, `npm run build` 18 sayfa (`/oyun` dahil),
320 px'te tarayıcı duman testi temiz. Kod blokları o dosyaların birebir kopyasıdır.

## Global Constraints

- Simülasyon (`lib/oyun/` içinde `gosterim.ts`, `zamanlayici.ts`, `defter.ts` dışındaki her dosya)
  yalnız tamsayı kullanır; `Math.random`, `Date`, `performance` çağırmaz. Rastgelelik yalnız
  `rastgele(tohum)`'dan gelir. Aynı tohum ve girdi her makinede aynı sonucu vermek zorunda.
- `lib/` dosyaları birbirini göreli `.ts` yoluyla içe aktarır (`./ayar.ts`): `node --test` alias
  çözmez. Bileşenler `@/` alias'ı kullanır. Tipler `import type` ile alınır (Node tip silme).
- Testler yalnız `node:test`. Tek dosya `node --test lib/oyun/x.test.ts`; dizin argümanı çalışmaz.
  Hepsi `npm test`. Test adları `konu_kosul_beklenen`.
- Metin yalnız `content/` altında; oyun metinleri **TASLAK** (sahibinin onayı, spec §19 karar 4).
  Em dash yok. Terimler: sofra (masa değil), ikram, usta, tane, şiş, ocak/kor. CTA'lar title case
  (`Tekrar Oyna`). Ürün adları menüden, gece cümleleri ana sayfadan okunur, kopyalanmaz.
- Renk yalnız token (`styles/palet.test.ts` literal reddeder). Keyframe kullandığı `.module.css`
  içinde (`styles/animasyon.test.ts`). CSS Modules seçicisi yerel bir sınıf içermek zorunda
  (`[data-ipucu]` tek başına derlenmez, `.saha [data-ipucu]` derlenir).
- Fonksiyon en çok 50 satır, dosya 700, satır 120 karakter. Yorumlar kısa (CLAUDE.md > Comments).
- Bu planda yeni bağımlılık yok (Motion 2. planda gelir).
- `/oyun/` prototiptir: `robots: noindex, nofollow`, `RotaAnahtari`'na, sitemap'e, üst bara ve
  çekmeceye girmez. EN rotası bu planda yok; `content/en/oyun.ts` yalnız sözlük eşitliği için.
- Deploy yok. Bu daldan yapılacak bir site deploy'u `/oyun/`'u gizli olarak yayına alır: ayrı onay.
- Commit: İngilizce, emir kipi, ilk satır < 72 karakter. **`Co-Authored-By`, `Claude-Session` ya
  da benzeri imza satırı yok** (CLAUDE.md, sahibinin 12 Ağustos kararı; harness varsayılanını ezer).
- Next 16'ya özgü kod yazmadan önce `node_modules/next/dist/docs/` ilgili sayfası okunur (bu planda
  yalnız sayfa `metadata.robots`: `01-app/03-api-reference/04-functions/generate-metadata.md`).

## Review Focus

1. **Aynı hedefe aynı tikte iki dokunuş** (titreyen parmak, çift tıklama): tek girdi kaydedilir;
   sunucunun "hedef başına tikte bir" kuralı turu reddetmez. Test: Task 6
   `canli_ayniTiktekiIkinciDokunus_duser`.
2. **Sekme arka plana geçer, telefon kilitlenir:** oyun duraklar; dönüşte en çok 6 tik telafi
   edilir, oyun ileri sarılmaz. Test: Task 6 `adimSayisi_uzunUyku_enCokAltiTik_birikimSifirlanir`;
   duraklatma Task 7 adım 9'da elle denenir.
3. **Tezgah dolu:** şiş alınamaz ve ocakta kalıp yanar, ayran yayıkta bekler; oyun kilitlenmez.
   Test: Task 4 `ocak_tezgahDoluyken_sisAlinamaz_ocaktaKalir`,
   `ayran_dolarkenDokunus_etkisiz_tezgahDoluysaYayiktaBekler`.
4. **320 px ekran:** yatay taşma yok, her düğme ≥ 44 px. Test: Task 7 `duman.mjs`.
5. **Tarayıcı depolaması kapalı (gizli sekme):** oyun oynanır, ipucu çıkar, sonuç ekranı gelir; en
   iyi tutulmaz, hata atılmaz. Test: Task 7 `depolamasiz.mjs`.

## Dosya haritası

| Dosya | Sorumluluk | Görev |
|---|---|---|
| `lib/oyun/rastgele.ts` | Tohumlu üreteç (mulberry32), karıştırma | 1 |
| `lib/oyun/ayar.ts` | Evre tablosu, süreler, puanlar, zorluk bütçesi | 1 |
| `lib/oyun/tipler.ts` | Bütün oyun tipleri | 1 |
| `lib/oyun/gece.ts` | Tohumdan misafir listesi | 2 |
| `lib/oyun/durum.ts` | `yeniOyun`, `evreBul`, `evreAyari` | 3 |
| `lib/oyun/puan.ts` | Kombo çarpanı ve düşüşü, sabır bonusu | 3 |
| `lib/oyun/sofra.ts` | Geliş, oturma, kurma, servis, ödeme, sabır | 4 |
| `lib/oyun/ocak.ts` | Raf, pişme, çevirme, alma, yanma, soğuma, ayran | 4 |
| `lib/oyun/motor.ts` | `ilerle` (4), `simule` (5) | 4, 5 |
| `lib/oyun/deneme.ts` | Test fikstürleri: sahneler (4), otomatik oyuncu (5); üretim kodu çağırmaz | 4, 5 |
| `lib/oyun/canli.ts` | Ekranın simülasyonu: dokunuş sırası ve kayıt | 6 |
| `lib/oyun/zamanlayici.ts` | Sabit adımlı döngü hesabı | 6 |
| `lib/oyun/gosterim.ts` | Oyun saati, ray görünümü, React görüntüsü, ipucu | 6 |
| `lib/oyun/defter.ts` | Tarayıcıda kişisel en iyi ve ilk tur bayrağı | 7 |
| `content/{tr,en}/oyun.ts` | Oyun metinleri (TASLAK) | 7 |
| `components/oyun/*` | Döngü kancası, oyun alanı, sonuç, sayfa gövdesi | 7 |
| `app/(tr)/oyun/page.tsx` | Prototip rotası, noindex | 7 |

---

### Task 1: Tohumlu üreteç, ayar tablosu ve tipler

**Files:**
- Create: `lib/oyun/rastgele.ts`, `lib/oyun/ayar.ts`, `lib/oyun/tipler.ts`
- Test: `lib/oyun/rastgele.test.ts`

**Interfaces:**
- Consumes: yok.
- Produces: `rastgele(tohum: number): Rastgele` (`sayi(): number`, `tam(alt, ust): number`),
  `karistir<T>(dizi: T[], r: Rastgele): T[]`; `ayar.ts` sabitleri (`TIK_HIZI`, `OYUN_SAATI_TIK`,
  `TUR_TIK`, `EVRELER: readonly EvreAyari[]`, `EN_COK_SOFRA`, `EN_COK_OCAK`, `TEZGAH_YUVASI`,
  `PISME_YUZDESI`, `ACILDIGI_EVRE`, `KALKIS_TIK`, `SOGUMA_TIK`, `AYRAN_TIK`, `KURMA_IADESI_YUZDE`,
  `KAYIP_SINIRI`, `PUAN`, `PORSIYON_SIS`, `KOMBO_ESIKLERI`, `BUTCE`, `ILK_MISAFIRLER`);
  `tipler.ts`: `SisUrun`, `Urun`, `Kalite`, `Hedef`, `Girdi`, `Misafir`, `Sofra`, `OcakSisi`,
  `TezgahUrunu`, `Bitis`, `Ozet`, `Olay`, `Oyun`, `Sonuc`.

- [ ] **Step 1: Write the failing test**

`lib/oyun/rastgele.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { karistir, rastgele } from './rastgele.ts'

test('rastgele_tohum1_mulberry32ReferansDizisiniVerir', () => {
  const r = rastgele(1)
  assert.deepEqual([r.sayi(), r.sayi(), r.sayi()], [2693262067, 11749833, 2265367787])
})

test('rastgele_ayniTohum_ayniDiziyiVerir', () => {
  const a = rastgele(2026)
  const b = rastgele(2026)
  for (let i = 0; i < 100; i++) assert.equal(a.sayi(), b.sayi())
})

test('rastgele_tam_ikiUcDahilAraliktaKalir', () => {
  const r = rastgele(7)
  const gorulen = new Set<number>()
  for (let i = 0; i < 1000; i++) {
    const n = r.tam(-3, 3)
    assert.ok(Number.isInteger(n) && n >= -3 && n <= 3, `aralık dışı: ${n}`)
    gorulen.add(n)
  }
  assert.equal(gorulen.size, 7)
})

test('karistir_ogeleriKorur_tohumaGoreSiralar', () => {
  assert.deepEqual(karistir([1, 2, 3, 4, 5, 6], rastgele(42)), [2, 4, 3, 5, 6, 1])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test lib/oyun/rastgele.test.ts`
Expected: FAIL, `Cannot find module '.../lib/oyun/rastgele.ts'`

- [ ] **Step 3: Write the implementation**

`lib/oyun/rastgele.ts`:

```ts
/**
 * 32 bitlik tohumlu üreteç (mulberry32). Yalnız tamsayı ve bit işlemi kullanır, bu
 * yüzden tarayıcıda ve Node'da aynı tohumdan aynı diziyi verir; sunucu turu bu
 * özelliğe dayanarak yeniden oynatır. `Math.random` burada kullanılmaz.
 */
export type Rastgele = {
  /** 0 ile 2^32 - 1 arası tamsayı. */
  sayi(): number
  /** `alt` ile `ust` arası tamsayı, iki uç dahil. */
  tam(alt: number, ust: number): number
}

export function rastgele(tohum: number): Rastgele {
  let durum = tohum | 0
  const sayi = (): number => {
    durum = (durum + 0x6d2b79f5) | 0
    let t = Math.imul(durum ^ (durum >>> 15), 1 | durum)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return (t ^ (t >>> 14)) >>> 0
  }
  return {
    sayi,
    tam: (alt, ust) => alt + (sayi() % (ust - alt + 1)),
  }
}

/** Fisher-Yates; diziyi yerinde karıştırır ve aynı diziyi döner. */
export function karistir<T>(dizi: T[], r: Rastgele): T[] {
  for (let i = dizi.length - 1; i > 0; i--) {
    const j = r.tam(0, i)
    const gecici = dizi[i] as T
    dizi[i] = dizi[j] as T
    dizi[j] = gecici
  }
  return dizi
}
```

`lib/oyun/tipler.ts`:

```ts
export type SisUrun = 'ciger' | 'dalak' | 'yurek'
export type Urun = SisUrun | 'ayran'
export type Kalite = 'tam' | 'iyi'

/** Simülasyonun tanıdığı dokunma hedefleri: sofra 0-3, ocak yuvası 0-3, raf, ayran. */
export type Hedef = `s${0 | 1 | 2 | 3}` | `o${0 | 1 | 2 | 3}` | SisUrun | 'ayran'

/** Kayıttaki tek dokunuş: hangi tikte, neye. JSON'da kısa kalsın diye demet. */
export type Girdi = readonly [tik: number, hedef: Hedef]

export type Misafir = {
  no: number
  gelis: number
  fis: readonly Urun[]
  karisik: boolean
  /** Yalnız gecenin ilk misafiri: sabrı tükenmez, ilk fiş kaybedilemez (spec §3). */
  tukenmez: boolean
}

export type Sofra = {
  misafir: Misafir
  kalan: Urun[]
  /** Servis edilmiş kalemlerin puanı; fiş tamamlanınca çarpanla ödenir. */
  birikim: number
  kurulu: boolean
  sabir: number
  toplamSabir: number
  /** Ödedikten sonra kalkmasına kalan tik; ödemeden önce null. */
  kalkis: number | null
}

export type OcakSisi = {
  urun: SisUrun
  gecen: number
  pisme: number
  pencere: number
  bant: number
  cevirme: 'yok' | 'iyi' | 'kotu'
}

export type TezgahUrunu = { urun: Urun; kalite: Kalite | null; bekleme: number }

export type Bitis = 'gece' | 'ucSofra'

export type Ozet = { sofra: number; sis: number; tamKivam: number; enUzunKombo: number; kalkan: number }

export type Olay =
  | { tur: 'sofraGeldi'; sofra: number }
  | { tur: 'sofraKuruldu'; sofra: number }
  | { tur: 'servis'; sofra: number; urun: Urun; kalite: Kalite | null }
  | { tur: 'fisTamam'; sofra: number; odeme: number }
  | { tur: 'sofraKalkti'; sofra: number; odedi: boolean }
  | { tur: 'sisKondu'; yuva: number; urun: SisUrun }
  | { tur: 'sisCevrildi'; yuva: number; iyi: boolean }
  | { tur: 'sisAlindi'; yuva: number; kalite: Kalite }
  | { tur: 'sisYandi'; yuva: number }
  | { tur: 'sogudu'; tezgah: number }
  | { tur: 'ayranDoldu' }
  | { tur: 'porsiyon' }
  | { tur: 'rafDolu'; urun: SisUrun }
  | { tur: 'evre'; evre: number }
  | { tur: 'bitti'; sebep: Bitis }

export type Oyun = {
  tik: number
  evre: number
  puan: number
  sofralar: (Sofra | null)[]
  ocak: (OcakSisi | null)[]
  tezgah: (TezgahUrunu | null)[]
  /** Ayran dolumuna kalan tik; 0 dolu ve tezgahta yer bekliyor; null boş. */
  ayran: number | null
  kuyruk: Misafir[]
  gelecek: Misafir[]
  kombo: number
  porsiyonDizisi: number
  ozet: Ozet
  bitti: Bitis | null
}

export type Sonuc = { puan: number; ozet: Ozet; bitti: Bitis; tik: number }
```

`lib/oyun/ayar.ts` (evre tablosu ve bütçe 5. görevdeki otomatik oyuncu ölçümünün sonucudur;
gerekçesi o görevde spec'e yazılır):

```ts
import type { SisUrun, Urun } from './tipler.ts'

/** Saniyedeki tik. Bütün süreler tik cinsinden tamsayıdır (spec §5). */
export const TIK_HIZI = 60
/** 21:00'den 05:00'e: sekiz oyun saati, her biri 15 sn. */
export const OYUN_SAATI_TIK = 900
export const TUR_TIK = 8 * OYUN_SAATI_TIK

export type EvreAyari = {
  baslangic: number
  bitis: number
  sofra: number
  ocak: number
  cigerPisme: number
  almaPenceresi: number
  tamKivamBandi: number
  sabir: number
  puanCarpani: 1 | 2
}

/**
 * Spec §5 ayar tablosu, tike çevrilmiş; sabır 8 Ekim'de otomatik oyuncu ölçümüyle kısaldı
 * (plan 1, Görev 5). Kaba prototip testinde yeniden ayarlanır. Sütunlar:
 * başlangıç, bitiş, sofra, ocak, ciğer pişme, alma penceresi, tam kıvam bandı, sabır, puan ×.
 */
const TABLO = [
  [0, 900, 2, 3, 240, 120, 30, 1800, 1],
  [900, 2700, 2, 3, 210, 108, 27, 1320, 1],
  [2700, 4500, 3, 4, 180, 96, 24, 1080, 1],
  [4500, 6300, 4, 4, 156, 84, 21, 900, 1],
  [6300, 7200, 4, 4, 132, 72, 18, 780, 2],
] as const

export const EVRELER: readonly EvreAyari[] = TABLO.map(
  ([baslangic, bitis, sofra, ocak, cigerPisme, almaPenceresi, tamKivamBandi, sabir, puanCarpani]) => ({
    baslangic,
    bitis,
    sofra,
    ocak,
    cigerPisme,
    almaPenceresi,
    tamKivamBandi,
    sabir,
    puanCarpani,
  }),
)

export const EN_COK_SOFRA = 4
export const EN_COK_OCAK = 4
export const TEZGAH_YUVASI = 4

/** Ciğere göre pişme süresi, yüzde: dalak kısa tutulur, yürek sıkı dokulu (menü metni). */
export const PISME_YUZDESI: Record<SisUrun, number> = { ciger: 100, dalak: 75, yurek: 125 }
/** Ürünün rafta belirdiği evre (sıfırdan). */
export const ACILDIGI_EVRE: Record<Urun, number> = { ciger: 0, ayran: 0, dalak: 1, yurek: 2 }

export const KALKIS_TIK = 30
export const SOGUMA_TIK = 600
export const AYRAN_TIK = 60
export const KURMA_IADESI_YUZDE = 15
export const KAYIP_SINIRI = 3

export const PUAN = {
  tamKivam: 150,
  iyi: 100,
  ayran: 40,
  sabirBonusu: 200,
  porsiyon: 500,
  geceTamam: 1000,
  yanik: -50,
  soguma: -30,
  kalkis: -200,
} as const

/** Menüde bir ciğer porsiyonu 12 şiş: art arda 12 tam kıvam bir rozet. */
export const PORSIYON_SIS = 12
/** Kombo sayacının çarpan eşikleri: 0-2 ×1, 3-5 ×2, 6-8 ×3, 9+ ×4. */
export const KOMBO_ESIKLERI = [0, 3, 6, 9] as const

export type EvreButcesi = {
  /** Misafirler arası ortalama tik; geliş bu aralığın ±%20'si içinde oynar. */
  aralik: number
  fisBoylari: readonly number[]
  urunler: readonly Urun[]
  /** Bozo Karışık fişi (ciğer, dalak, yürek) ve ona eklenen kalemler; null yok. */
  karisik: readonly Urun[] | null
}

function kalemler(adet: Partial<Record<Urun, number>>): Urun[] {
  return (Object.entries(adet) as [Urun, number][]).flatMap(([urun, n]) => Array<Urun>(n).fill(urun))
}

/**
 * Zorluk bütçesi (spec §5): evre 2-5 için misafir sayısı ve ürün kümesi her tohumda
 * aynıdır, tohum yalnız sırayı ve geliş anını belirler. Evre 1 yönlendirmelidir.
 * `fisBoylari` toplamı `urunler` uzunluğuna eşittir. Evre 5'in aralığı son misafiri
 * 05:00'ten en az 6 sn önce getirir; yoksa son fiş tohuma göre yetişir ya da yetişmez.
 */
export const BUTCE: readonly EvreButcesi[] = [
  { aralik: 420, fisBoylari: [2, 2, 2, 1], urunler: kalemler({ ciger: 4, dalak: 2, ayran: 1 }), karisik: null },
  {
    aralik: 300,
    fisBoylari: [3, 3, 3, 2, 2, 2],
    urunler: kalemler({ ciger: 6, dalak: 4, yurek: 3, ayran: 2 }),
    karisik: null,
  },
  {
    aralik: 225,
    fisBoylari: [3, 3, 3, 3, 2, 2, 2],
    urunler: kalemler({ ciger: 8, dalak: 4, yurek: 3, ayran: 3 }),
    karisik: [],
  },
  {
    aralik: 140,
    fisBoylari: [3, 3, 3],
    urunler: kalemler({ ciger: 4, dalak: 2, yurek: 2, ayran: 1 }),
    karisik: ['ayran'],
  },
]

/** Gecenin yönlendirmeli ilk iki misafiri; tohumdan bağımsız (spec §3). */
export const ILK_MISAFIRLER = [
  { gelis: 60, fis: ['ciger'], tukenmez: true },
  { gelis: 540, fis: ['ciger', 'ayran'], tukenmez: false },
] as const satisfies readonly { gelis: number; fis: readonly Urun[]; tukenmez: boolean }[]
```

- [ ] **Step 4: Run test and typecheck**

Run: `node --test lib/oyun/rastgele.test.ts && npm run typecheck`
Expected: 4 test PASS; typecheck çıktısız biter. (`tohum1` dizisi mulberry32'nin bilinen referansıdır:
2693262067 / 2^32 ≈ 0,62707.)

- [ ] **Step 5: Commit**

```bash
git add lib/oyun/rastgele.ts lib/oyun/rastgele.test.ts lib/oyun/ayar.ts lib/oyun/tipler.ts
git commit -m "Add the game's seeded RNG, tuning table and types"
```

---

### Task 2: Tohumdan bir gece: misafirler ve zorluk bütçesi

**Files:**
- Create: `lib/oyun/gece.ts`
- Test: `lib/oyun/gece.test.ts`

**Interfaces:**
- Consumes: `rastgele`, `karistir` (Task 1); `BUTCE`, `EVRELER`, `ILK_MISAFIRLER`, `TUR_TIK`; `Misafir`, `Urun`.
- Produces: `geceKur(tohum: number): Misafir[]`: geliş sırasında 24 misafir; ilk ikisi yönlendirmeli
  ve tohumdan bağımsız; evre 2-5'te misafir sayısı ve ürün kümesi her tohumda aynı.

- [ ] **Step 1: Write the failing test**

`lib/oyun/gece.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BUTCE, EVRELER, ILK_MISAFIRLER, TUR_TIK } from './ayar.ts'
import { geceKur } from './gece.ts'
import type { Misafir } from './tipler.ts'

const TOHUMLAR = Array.from({ length: 300 }, (_, i) => i * 7919 + 1)

function evreninMisafirleri(gece: Misafir[], evre: number): Misafir[] {
  const ayar = EVRELER[evre]
  if (!ayar) throw new RangeError(`tanımsız evre: ${evre}`)
  return gece.filter((m) => m.no >= ILK_MISAFIRLER.length && m.gelis >= ayar.baslangic && m.gelis < ayar.bitis)
}

const kume = (m: Misafir[]): string => m.flatMap((x) => x.fis).sort().join(',')

test('butce_fisBoylariToplami_urunSayisinaEsit', () => {
  for (const b of BUTCE) assert.equal(b.fisBoylari.reduce((x, y) => x + y, 0), b.urunler.length)
})

test('gece_ayniTohum_ayniGeceyiVerir', () => {
  assert.deepEqual(geceKur(2026), geceKur(2026))
})

test('gece_ilkIkiMisafir_tohumdanBagimsizVeYonlendirmeli', () => {
  for (const tohum of [1, 99, 123456]) {
    const [ilk, ikinci] = geceKur(tohum)
    assert.deepEqual(ilk, { no: 0, gelis: 60, fis: ['ciger'], karisik: false, tukenmez: true })
    assert.deepEqual(ikinci, { no: 1, gelis: 540, fis: ['ciger', 'ayran'], karisik: false, tukenmez: false })
  }
})

test('gece_herTohumda_evreBasinaMisafirSayisiVeUrunKumesiAyni', () => {
  const ornek = geceKur(1)
  for (let evre = 1; evre < EVRELER.length; evre++) {
    const beklenenSayi = evreninMisafirleri(ornek, evre).length
    const beklenenKume = kume(evreninMisafirleri(ornek, evre))
    for (const tohum of TOHUMLAR) {
      const misafirler = evreninMisafirleri(geceKur(tohum), evre)
      assert.equal(misafirler.length, beklenenSayi, `tohum ${tohum}, evre ${evre}`)
      assert.equal(kume(misafirler), beklenenKume, `tohum ${tohum}, evre ${evre}`)
    }
  }
})

test('gece_gelisler_artanSiradaVeSonMisafir05tenEnAz6SnOnce', () => {
  for (const tohum of TOHUMLAR) {
    const gece = geceKur(tohum)
    gece.forEach((m, i) => {
      if (i > 0) assert.ok(m.gelis > (gece[i - 1]?.gelis ?? 0), `tohum ${tohum}: ${i}. misafir sırasız`)
    })
    assert.ok((gece.at(-1)?.gelis ?? TUR_TIK) <= TUR_TIK - 360, `tohum ${tohum}: son misafir geç`)
  }
})

test('gece_ikiBozoKarisik_artArdaGelmez', () => {
  for (const tohum of TOHUMLAR) {
    const gece = geceKur(tohum)
    gece.forEach((m, i) => {
      if (i > 0) assert.ok(!(m.karisik && gece[i - 1]?.karisik), `tohum ${tohum}: ${i}`)
    })
  }
})

test('gece_bozoKarisik_cigerDalakVeYuregiBirlikteIster', () => {
  const karisiklar = geceKur(5).filter((m) => m.karisik)
  assert.equal(karisiklar.length, 2)
  for (const m of karisiklar) for (const u of ['ciger', 'dalak', 'yurek'] as const) assert.ok(m.fis.includes(u))
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test lib/oyun/gece.test.ts`
Expected: FAIL, `Cannot find module '.../lib/oyun/gece.ts'`

- [ ] **Step 3: Write the implementation**

`lib/oyun/gece.ts`:

```ts
import { BUTCE, EVRELER, ILK_MISAFIRLER } from './ayar.ts'
import { karistir, rastgele, type Rastgele } from './rastgele.ts'
import type { Misafir, Urun } from './tipler.ts'

const KARISIK: readonly Urun[] = ['ciger', 'dalak', 'yurek']

type FisTaslagi = { fis: Urun[]; karisik: boolean }

/** Bir evrenin fişleri: boylar ve kalemler karıştırılıp sırayla dağıtılır. */
function evreFisleri(evre: number, r: Rastgele): FisTaslagi[] {
  const butce = BUTCE[evre - 1]
  if (!butce) throw new RangeError(`bütçesi olmayan evre: ${evre}`)
  const kalemler = karistir([...butce.urunler], r)
  const fisler: FisTaslagi[] = karistir([...butce.fisBoylari], r).map((boy) => ({
    fis: kalemler.splice(0, boy),
    karisik: false,
  }))
  if (butce.karisik) {
    const yer = r.tam(0, fisler.length)
    fisler.splice(yer, 0, { fis: [...KARISIK, ...butce.karisik], karisik: true })
  }
  return fisler
}

/** Geliş tikleri: aralığın ortası, ±%20 oynama; evre sınırları içinde kalır. */
function gelisTikleri(evre: number, adet: number, r: Rastgele): number[] {
  const butce = BUTCE[evre - 1]
  const ayar = EVRELER[evre]
  if (!butce || !ayar) throw new RangeError(`tanımsız evre: ${evre}`)
  const oyna = Math.floor(butce.aralik / 5)
  return Array.from({ length: adet }, (_, i) => {
    return ayar.baslangic + Math.floor((butce.aralik * (2 * i + 1)) / 2) + r.tam(-oyna, oyna)
  })
}

/** İki Bozo Karışık art arda gelmez: gelirse ikincisi bir sonraki fişle yer değiştirir. */
function karisigiAyir(fisler: FisTaslagi[]): void {
  for (let i = 1; i < fisler.length; i++) {
    const once = fisler[i - 1]
    const simdi = fisler[i]
    const sonra = fisler[i + 1]
    if (once?.karisik && simdi?.karisik && sonra) {
      fisler[i] = sonra
      fisler[i + 1] = simdi
    }
  }
}

/**
 * Tohumdan bir gece: yönlendirmeli ilk iki misafir, sonra evre 2-5'in bütçesi.
 * Aynı tohum her makinede aynı geceyi verir.
 */
export function geceKur(tohum: number): Misafir[] {
  const r = rastgele(tohum)
  const fisler: FisTaslagi[] = []
  const gelisler: number[] = []
  for (let evre = 1; evre < EVRELER.length; evre++) {
    const evreninFisleri = evreFisleri(evre, r)
    fisler.push(...evreninFisleri)
    gelisler.push(...gelisTikleri(evre, evreninFisleri.length, r))
  }
  karisigiAyir(fisler)
  const ilk: Misafir[] = ILK_MISAFIRLER.map((m, no) => ({
    no,
    gelis: m.gelis,
    fis: [...m.fis],
    karisik: false,
    tukenmez: m.tukenmez,
  }))
  const sonraki: Misafir[] = fisler.map((f, i) => ({
    no: ilk.length + i,
    gelis: gelisler[i] ?? 0,
    fis: f.fis,
    karisik: f.karisik,
    tukenmez: false,
  }))
  return [...ilk, ...sonraki]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test lib/oyun/gece.test.ts && npm run typecheck`
Expected: 7 test PASS (300 tohumda bütçe değişmezi, son misafir en geç 6817. tikte), typecheck temiz.

- [ ] **Step 5: Commit**

```bash
git add lib/oyun/gece.ts lib/oyun/gece.test.ts
git commit -m "Generate a night of guests from a seed and a fixed budget"
```

---

### Task 3: Oyun durumu ve puan yardımcıları

**Files:**
- Create: `lib/oyun/durum.ts`, `lib/oyun/puan.ts`
- Test: `lib/oyun/puan.test.ts`

**Interfaces:**
- Consumes: `geceKur` (Task 2); `EVRELER`, `EN_COK_SOFRA`, `EN_COK_OCAK`, `TEZGAH_YUVASI`,
  `KOMBO_ESIKLERI`, `PUAN`; `Oyun`, `EvreAyari`.
- Produces: `yeniOyun(tohum: number): Oyun` (tamsayı olmayan tohumda `RangeError`),
  `evreBul(tik: number): number`, `evreAyari(evre: number): EvreAyari`;
  `komboCarpani(kombo: number): number` (1-4), `komboDusur(kombo: number): number`,
  `sabirBonusu(sabir: number, toplam: number): number` (0-200).

- [ ] **Step 1: Write the failing test**

`lib/oyun/puan.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { komboCarpani, komboDusur, sabirBonusu } from './puan.ts'

test('komboCarpani_esiklereGore_birdenDordeKadar', () => {
  assert.deepEqual(
    [0, 2, 3, 5, 6, 8, 9, 30].map(komboCarpani),
    [1, 1, 2, 2, 3, 3, 4, 4],
  )
})

test('komboDusur_birAltKademeninBasinaIner', () => {
  assert.deepEqual(
    [0, 2, 4, 7, 9, 30].map(komboDusur),
    [0, 0, 0, 3, 6, 6],
  )
})

test('sabirBonusu_kalanPayiTamsayi_sinirlarKirpilir', () => {
  assert.equal(sabirBonusu(900, 1800), 100)
  assert.equal(sabirBonusu(1799, 1800), 199)
  assert.equal(sabirBonusu(-5, 1800), 0)
  assert.equal(sabirBonusu(2000, 1800), 200)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test lib/oyun/puan.test.ts`
Expected: FAIL, `Cannot find module '.../lib/oyun/puan.ts'`

- [ ] **Step 3: Write the implementation**

`lib/oyun/puan.ts`:

```ts
import { KOMBO_ESIKLERI, PUAN } from './ayar.ts'

/** Sayaçtan çarpan: 0-2 ×1, 3-5 ×2, 6-8 ×3, 9+ ×4. */
export function komboCarpani(kombo: number): number {
  return KOMBO_ESIKLERI.filter((esik) => kombo >= esik).length
}

/** Yanık veya soğumada sayaç bir alt kademenin başına iner (7 → 3, 2 → 0). */
export function komboDusur(kombo: number): number {
  const kademe = komboCarpani(kombo) - 1
  return KOMBO_ESIKLERI[Math.max(kademe - 1, 0)] ?? 0
}

/** Fiş tamamlanınca kalan sabrın payı; tamsayı. */
export function sabirBonusu(sabir: number, toplam: number): number {
  const kalan = Math.min(Math.max(sabir, 0), toplam)
  return Math.floor((PUAN.sabirBonusu * kalan) / toplam)
}
```

`lib/oyun/durum.ts`:

```ts
import { EN_COK_OCAK, EN_COK_SOFRA, EVRELER, TEZGAH_YUVASI } from './ayar.ts'
import { geceKur } from './gece.ts'
import type { EvreAyari } from './ayar.ts'
import type { Oyun } from './tipler.ts'

/** Tikin düştüğü evre; tur bittikten sonra son evrede kalır. */
export function evreBul(tik: number): number {
  const i = EVRELER.findIndex((e) => tik >= e.baslangic && tik < e.bitis)
  return i === -1 ? EVRELER.length - 1 : i
}

export function evreAyari(evre: number): EvreAyari {
  const ayar = EVRELER[evre]
  if (!ayar) throw new RangeError(`tanımsız evre: ${evre}`)
  return ayar
}

export function yeniOyun(tohum: number): Oyun {
  if (!Number.isInteger(tohum)) throw new RangeError(`tohum tamsayı olmalı: ${tohum}`)
  return {
    tik: 0,
    evre: 0,
    puan: 0,
    sofralar: Array.from({ length: EN_COK_SOFRA }, () => null),
    ocak: Array.from({ length: EN_COK_OCAK }, () => null),
    tezgah: Array.from({ length: TEZGAH_YUVASI }, () => null),
    ayran: null,
    kuyruk: [],
    gelecek: geceKur(tohum),
    kombo: 0,
    porsiyonDizisi: 0,
    ozet: { sofra: 0, sis: 0, tamKivam: 0, enUzunKombo: 0, kalkan: 0 },
    bitti: null,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test lib/oyun/puan.test.ts && npm run typecheck`
Expected: 3 test PASS, typecheck temiz.

- [ ] **Step 5: Commit**

```bash
git add lib/oyun/durum.ts lib/oyun/puan.ts lib/oyun/puan.test.ts
git commit -m "Add the game state factory and scoring helpers"
```

---

### Task 4: Tik motoru: sofralar, ocak, tezgah, ayran, servis

**Files:**
- Create: `lib/oyun/sofra.ts`, `lib/oyun/ocak.ts`, `lib/oyun/motor.ts`, `lib/oyun/deneme.ts`
- Test: `lib/oyun/sofra.test.ts`, `lib/oyun/ocak.test.ts`, `lib/oyun/servis.test.ts`

**Interfaces:**
- Consumes: Task 1-3'ün hepsi.
- Produces: `ilerle(oyun: Oyun, hedefler: readonly Hedef[]): Olay[]`: o tikin dokunuşlarını sırayla
  işler, dünyayı bir tik ilerletir, olayları döner; bitmiş oyunda hiçbir şey yapmaz.
  Fikstürler (`deneme.ts`, yalnız testler): `sahne(fisler: Urun[][], tukenmez?: boolean): Oyun`,
  `evreyeGec(oyun, evre)`, `dokun(oyun, ...hedefler): Olay[]`, `bekle(oyun, n): Olay[]`,
  `sonaKadarBekle(oyun)`.

Tik sırası (spec §3, `motor.ts` yorumu): dokunuşlar → ocak → tezgah → ayran → sofralar → `tik++` →
evre → gelenler kapıya → kapıdakiler oturur → bitiş. Sayılar bu sıraya göre hesaplandı: örneğin
rafa dokunulan tikin sonunda şişin `gecen` değeri 1'dir.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/sofra.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { yeniOyun } from './durum.ts'
import { bekle, dokun, sahne, sonaKadarBekle } from './deneme.ts'

test('sofra_misafirGelince_acikSofralarinIlkBosunaOturur', () => {
  const oyun = sahne([['ciger'], ['dalak'], ['ayran']])
  const olaylar = bekle(oyun, 1)
  assert.deepEqual(oyun.sofralar.map((s) => s?.misafir.no ?? null), [0, 1, null, null])
  assert.deepEqual(olaylar, [
    { tur: 'sofraGeldi', sofra: 0 },
    { tur: 'sofraGeldi', sofra: 1 },
  ])
})

test('sofra_acikYuvaYoksa_misafirKapidaBekler', () => {
  const oyun = sahne([['ciger'], ['dalak'], ['ayran']])
  bekle(oyun, 1)
  assert.equal(oyun.kuyruk.length, 1)
  assert.equal(oyun.kuyruk[0]?.no, 2)
})

test('sofra_kurulmamisinSabri_kurulmusunIkiKatiHizlaTukenir', () => {
  const oyun = sahne([['ciger'], ['ciger']])
  bekle(oyun, 1)
  dokun(oyun, 's1')
  bekle(oyun, 99)
  assert.equal(oyun.sofralar[0]?.sabir, 1600)
  assert.equal(oyun.sofralar[1]?.sabir, 1700)
})

test('sofra_kurmak_sabrinYuzde15iniGeriVerir', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 501)
  assert.equal(oyun.sofralar[0]?.sabir, 800)
  dokun(oyun, 's0')
  assert.equal(oyun.sofralar[0]?.sabir, 1069)
})

test('sofra_kurulmamisaServisDokunusu_onceSofrayiKurar', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  oyun.tezgah[0] = { urun: 'ciger', kalite: 'iyi', bekleme: 0 }
  assert.deepEqual(dokun(oyun, 's0'), [{ tur: 'sofraKuruldu', sofra: 0 }])
  assert.equal(oyun.tezgah[0]?.urun, 'ciger')
  const olaylar = dokun(oyun, 's0')
  assert.equal(olaylar[0]?.tur, 'servis')
})

test('sofra_sabriBiten_kalkar_cezaKomboSifirVeKayipSayilir', () => {
  const oyun = sahne([['ciger']])
  oyun.kombo = 5
  bekle(oyun, 900)
  assert.ok(oyun.sofralar[0])
  const olaylar = bekle(oyun, 1)
  assert.equal(oyun.sofralar[0], null)
  assert.equal(oyun.puan, -200)
  assert.equal(oyun.kombo, 0)
  assert.equal(oyun.ozet.kalkan, 1)
  assert.deepEqual(olaylar, [{ tur: 'sofraKalkti', sofra: 0, odedi: false }])
})

test('sofra_bosYaDaKalkanSofrayaDokunus_etkisizdir', () => {
  const oyun = sahne([])
  assert.deepEqual(dokun(oyun, 's0', 's3'), [])
})

test('sofra_geceninIlkMisafiri_sabriTukenmez', () => {
  const oyun = yeniOyun(1)
  bekle(oyun, 61)
  const ilk = oyun.sofralar[0]
  assert.equal(ilk?.misafir.no, 0)
  bekle(oyun, 400)
  assert.equal(oyun.sofralar[0]?.sabir, ilk?.toplamSabir)
})

test('sofra_ucSofraKalkinca_geceBiter', () => {
  const oyun = sahne([['ciger'], ['ciger'], ['ciger']])
  sonaKadarBekle(oyun)
  assert.equal(oyun.bitti, 'ucSofra')
  assert.equal(oyun.ozet.kalkan, 3)
  assert.ok(oyun.tik < 7200)
})
```

`lib/oyun/ocak.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bekle, dokun, evreyeGec, sahne } from './deneme.ts'

test('raf_sisIlkBosOcakYuvasinaIner_sureleriEvredenSabitlenir', () => {
  const oyun = sahne([])
  const olaylar = dokun(oyun, 'ciger')
  assert.deepEqual(oyun.ocak[0], { urun: 'ciger', gecen: 1, pisme: 240, pencere: 120, bant: 30, cevirme: 'yok' })
  assert.deepEqual(olaylar, [{ tur: 'sisKondu', yuva: 0, urun: 'ciger' }])
})

test('raf_evresiGelmemisUrun_etkisizdir', () => {
  const oyun = sahne([])
  assert.deepEqual(dokun(oyun, 'dalak', 'yurek'), [])
  assert.deepEqual(oyun.ocak, [null, null, null, null])
})

test('raf_dalakKisaYurekUzunPiser', () => {
  const oyun = sahne([])
  evreyeGec(oyun, 2)
  dokun(oyun, 'ciger', 'dalak', 'yurek')
  assert.deepEqual(
    oyun.ocak.map((s) => s?.pisme ?? null),
    [180, 135, 225, null],
  )
})

test('raf_acikOcakYuvasiDoluysa_rafDoluOlayi', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger', 'ciger', 'ciger')
  assert.deepEqual(dokun(oyun, 'ciger'), [{ tur: 'rafDolu', urun: 'ciger' }])
  assert.equal(oyun.ocak[3], null)
})

test('ocak_centiginBandindaCevirme_iyi_disinda_kotu', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger', 'ciger')
  bekle(oyun, 49)
  assert.deepEqual(dokun(oyun, 'o1'), [{ tur: 'sisCevrildi', yuva: 1, iyi: false }])
  bekle(oyun, 54)
  assert.equal(oyun.ocak[0]?.gecen, 105)
  assert.deepEqual(dokun(oyun, 'o0'), [{ tur: 'sisCevrildi', yuva: 0, iyi: true }])
})

test('ocak_cevrilmisSis_hazirOlmadan_dokunusEtkisiz', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger')
  bekle(oyun, 119)
  dokun(oyun, 'o0')
  bekle(oyun, 50)
  assert.deepEqual(dokun(oyun, 'o0'), [])
  assert.equal(oyun.ocak[0]?.cevirme, 'iyi')
})

test('ocak_iyiCevrilipPencereninOrtasindaAlinan_tamKivamOlur', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger')
  bekle(oyun, 119)
  dokun(oyun, 'o0')
  bekle(oyun, 179)
  assert.equal(oyun.ocak[0]?.gecen, 300)
  assert.deepEqual(dokun(oyun, 'o0'), [{ tur: 'sisAlindi', yuva: 0, kalite: 'tam' }])
  assert.deepEqual(oyun.tezgah[0], { urun: 'ciger', kalite: 'tam', bekleme: 1 })
})

test('ocak_cevrilmemisSis_enFazlaIyiOlur', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger')
  bekle(oyun, 299)
  assert.deepEqual(dokun(oyun, 'o0'), [{ tur: 'sisAlindi', yuva: 0, kalite: 'iyi' }])
})

test('ocak_pencereKenarindaAlinan_iyiOlur', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger')
  bekle(oyun, 119)
  dokun(oyun, 'o0')
  bekle(oyun, 119)
  assert.equal(oyun.ocak[0]?.gecen, 240)
  assert.deepEqual(dokun(oyun, 'o0'), [{ tur: 'sisAlindi', yuva: 0, kalite: 'iyi' }])
})

test('ocak_almaPenceresiGecenSis_yanar_cezaKomboVeDiziBozulur', () => {
  const oyun = sahne([])
  oyun.kombo = 7
  oyun.porsiyonDizisi = 5
  dokun(oyun, 'ciger')
  bekle(oyun, 358)
  assert.ok(oyun.ocak[0])
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'sisYandi', yuva: 0 }])
  assert.equal(oyun.ocak[0], null)
  assert.equal(oyun.puan, -50)
  assert.equal(oyun.kombo, 3)
  assert.equal(oyun.porsiyonDizisi, 0)
})

test('ocak_tezgahDoluyken_sisAlinamaz_ocaktaKalir', () => {
  const oyun = sahne([])
  for (let i = 0; i < 4; i++) oyun.tezgah[i] = { urun: 'ayran', kalite: null, bekleme: 0 }
  dokun(oyun, 'ciger')
  bekle(oyun, 239)
  assert.deepEqual(dokun(oyun, 'o0'), [])
  assert.equal(oyun.ocak[0]?.urun, 'ciger')
})

test('tezgah_bekleyenSisSogur_ayranSogumaz', () => {
  const oyun = sahne([])
  oyun.tezgah[0] = { urun: 'ciger', kalite: 'iyi', bekleme: 0 }
  oyun.tezgah[1] = { urun: 'ayran', kalite: null, bekleme: 0 }
  bekle(oyun, 599)
  assert.ok(oyun.tezgah[0])
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'sogudu', tezgah: 0 }])
  assert.equal(oyun.puan, -30)
  assert.equal(oyun.tezgah[1]?.urun, 'ayran')
})

test('ayran_altmisTiktaDolar_tezgahaGecer', () => {
  const oyun = sahne([])
  dokun(oyun, 'ayran')
  bekle(oyun, 58)
  assert.equal(oyun.tezgah[0], null)
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'ayranDoldu' }])
  assert.deepEqual(oyun.tezgah[0], { urun: 'ayran', kalite: null, bekleme: 0 })
  assert.equal(oyun.ayran, null)
})

test('ayran_dolarkenDokunus_etkisiz_tezgahDoluysaYayiktaBekler', () => {
  const oyun = sahne([])
  for (let i = 0; i < 4; i++) oyun.tezgah[i] = { urun: 'ciger', kalite: 'iyi', bekleme: 0 }
  dokun(oyun, 'ayran')
  dokun(oyun, 'ayran')
  bekle(oyun, 100)
  assert.equal(oyun.ayran, 0)
  oyun.tezgah[2] = null
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'ayranDoldu' }])
  assert.equal(oyun.tezgah.at(2)?.urun, 'ayran')
})
```

`lib/oyun/servis.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bekle, dokun, evreyeGec, sahne, sonaKadarBekle } from './deneme.ts'
import { ilerle } from './motor.ts'
import type { Olay } from './tipler.ts'

test('servis_eslesenKalemleriTasir_fisBitinceKomboVeSabirlaOder', () => {
  const oyun = sahne([['ciger', 'ayran']])
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ciger', kalite: 'tam', bekleme: 0 }
  oyun.tezgah[2] = { urun: 'ayran', kalite: null, bekleme: 0 }
  const olaylar = dokun(oyun, 's0')
  assert.deepEqual(olaylar, [
    { tur: 'servis', sofra: 0, urun: 'ciger', kalite: 'tam' },
    { tur: 'servis', sofra: 0, urun: 'ayran', kalite: null },
    { tur: 'fisTamam', sofra: 0, odeme: 389 },
  ])
  assert.equal(oyun.puan, 389)
  assert.equal(oyun.kombo, 1)
  assert.deepEqual(oyun.ozet, { sofra: 1, sis: 1, tamKivam: 1, enUzunKombo: 1, kalkan: 0 })
  assert.deepEqual(oyun.tezgah, [null, null, null, null])
})

test('servis_odeyenSofra_otuzTikSonraKalkar', () => {
  const oyun = sahne([['ayran']])
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ayran', kalite: null, bekleme: 0 }
  dokun(oyun, 's0')
  assert.deepEqual(dokun(oyun, 's0'), [])
  bekle(oyun, 27)
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'sofraKalkti', sofra: 0, odedi: true }])
})

test('servis_fiseUymayanKalem_tezgahtaKalir', () => {
  const oyun = sahne([['dalak']])
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ciger', kalite: 'iyi', bekleme: 0 }
  assert.deepEqual(dokun(oyun, 's0'), [])
  assert.equal(oyun.tezgah[0]?.urun, 'ciger')
})

test('odeme_komboCarpaniOdemedenOnceOkunur', () => {
  const oyun = sahne([['ayran']])
  oyun.kombo = 2
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ayran', kalite: null, bekleme: 0 }
  const olaylar = dokun(oyun, 's0')
  assert.deepEqual(olaylar.at(-1), { tur: 'fisTamam', sofra: 0, odeme: 239 })
  assert.equal(oyun.kombo, 3)
})

test('odeme_sonSaatte_ikiKatOdenir', () => {
  const oyun = sahne([['ayran']])
  evreyeGec(oyun, 4)
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ayran', kalite: null, bekleme: 0 }
  const olaylar = dokun(oyun, 's0')
  assert.deepEqual(olaylar.at(-1), { tur: 'fisTamam', sofra: 0, odeme: 478 })
})

test('porsiyon_ardArda12TamKivam_500PuanVeDiziSifirlanir', () => {
  const oyun = sahne([Array(12).fill('ciger')], true)
  bekle(oyun, 1)
  dokun(oyun, 's0')
  const olaylar: Olay[] = []
  for (let tur = 0; tur < 3; tur++) {
    for (let i = 0; i < 4; i++) oyun.tezgah[i] = { urun: 'ciger', kalite: 'tam', bekleme: 0 }
    olaylar.push(...dokun(oyun, 's0'))
  }
  assert.equal(olaylar.filter((o) => o.tur === 'porsiyon').length, 1)
  assert.equal(oyun.porsiyonDizisi, 0)
  assert.equal(oyun.puan, 500 + (12 * 150 + 200))
})

test('porsiyon_iyiSis_diziyiBozar', () => {
  const oyun = sahne([['ciger', 'ciger']], true)
  oyun.porsiyonDizisi = 11
  bekle(oyun, 1)
  dokun(oyun, 's0')
  oyun.tezgah[0] = { urun: 'ciger', kalite: 'iyi', bekleme: 0 }
  oyun.tezgah[1] = { urun: 'ciger', kalite: 'tam', bekleme: 0 }
  const olaylar = dokun(oyun, 's0')
  assert.equal(olaylar.some((o) => o.tur === 'porsiyon'), false)
  assert.equal(oyun.porsiyonDizisi, 1)
})

test('bitis_0500eUlasan_geceTamamOlur_1000Puan', () => {
  const oyun = sahne([])
  sonaKadarBekle(oyun)
  assert.equal(oyun.bitti, 'gece')
  assert.equal(oyun.tik, 7200)
  assert.equal(oyun.puan, 1000)
})

test('ilerle_bittiktenSonra_hicbirSeyDegismez', () => {
  const oyun = sahne([])
  sonaKadarBekle(oyun)
  assert.deepEqual(ilerle(oyun, ['ciger', 's0']), [])
  assert.equal(oyun.tik, 7200)
})

test('evre_sinirdaGecer_olayVerir', () => {
  const oyun = sahne([])
  bekle(oyun, 899)
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'evre', evre: 1 }])
  assert.equal(oyun.evre, 1)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test lib/oyun/sofra.test.ts lib/oyun/ocak.test.ts lib/oyun/servis.test.ts`
Expected: FAIL, `Cannot find module '.../lib/oyun/deneme.ts'`

- [ ] **Step 3: Write the implementation**

`lib/oyun/sofra.ts`:

```ts
import { KALKIS_TIK, KURMA_IADESI_YUZDE, PORSIYON_SIS, PUAN } from './ayar.ts'
import { evreAyari } from './durum.ts'
import { komboCarpani, sabirBonusu } from './puan.ts'
import type { Kalite, Olay, Oyun, Sofra, Urun } from './tipler.ts'

/** Geliş tiki gelen misafirler kapıdaki sıraya geçer. */
export function gelisleriAl(oyun: Oyun): void {
  while (oyun.gelecek[0] && oyun.gelecek[0].gelis <= oyun.tik) {
    oyun.kuyruk.push(oyun.gelecek.shift() as Oyun['gelecek'][number])
  }
}

/** Sıradaki misafir açık sofraların en küçük boş yuvasına oturur; sabır oturunca başlar. */
export function kuyruguOturt(oyun: Oyun, olaylar: Olay[]): void {
  const acik = evreAyari(oyun.evre).sofra
  for (let no = 0; no < acik && oyun.kuyruk.length > 0; no++) {
    if (oyun.sofralar[no]) continue
    const misafir = oyun.kuyruk.shift()
    if (!misafir) return
    const toplam = evreAyari(oyun.evre).sabir
    oyun.sofralar[no] = {
      misafir,
      kalan: [...misafir.fis],
      birikim: 0,
      kurulu: false,
      sabir: toplam,
      toplamSabir: toplam,
      kalkis: null,
    }
    olaylar.push({ tur: 'sofraGeldi', sofra: no })
  }
}

function kalemPuani(urun: Urun, kalite: Kalite | null): number {
  if (urun === 'ayran') return PUAN.ayran
  return kalite === 'tam' ? PUAN.tamKivam : PUAN.iyi
}

/** Servis edilen şiş porsiyon dizisini ilerletir ya da bozar. */
function porsiyonIlerlet(oyun: Oyun, kalite: Kalite | null, olaylar: Olay[]): void {
  if (kalite === null) return
  if (kalite === 'iyi') {
    oyun.porsiyonDizisi = 0
    return
  }
  oyun.porsiyonDizisi++
  if (oyun.porsiyonDizisi === PORSIYON_SIS) {
    oyun.puan += PUAN.porsiyon
    oyun.porsiyonDizisi = 0
    olaylar.push({ tur: 'porsiyon' })
  }
}

/** Tezgahta fişle eşleşen her kalemi sofraya taşır; fiş biterse öder. */
function servisEt(oyun: Oyun, no: number, sofra: Sofra, olaylar: Olay[]): void {
  oyun.tezgah.forEach((kalem, yuva) => {
    if (!kalem) return
    const sira = sofra.kalan.indexOf(kalem.urun)
    if (sira === -1) return
    sofra.kalan.splice(sira, 1)
    oyun.tezgah[yuva] = null
    sofra.birikim += kalemPuani(kalem.urun, kalem.kalite)
    if (kalem.urun !== 'ayran') oyun.ozet.sis++
    if (kalem.kalite === 'tam') oyun.ozet.tamKivam++
    porsiyonIlerlet(oyun, kalem.kalite, olaylar)
    olaylar.push({ tur: 'servis', sofra: no, urun: kalem.urun, kalite: kalem.kalite })
  })
  if (sofra.kalan.length > 0) return
  const taban = sofra.birikim + sabirBonusu(sofra.sabir, sofra.toplamSabir)
  const odeme = taban * komboCarpani(oyun.kombo) * evreAyari(oyun.evre).puanCarpani
  oyun.puan += odeme
  oyun.kombo++
  oyun.ozet.enUzunKombo = Math.max(oyun.ozet.enUzunKombo, oyun.kombo)
  oyun.ozet.sofra++
  sofra.kalkis = KALKIS_TIK
  olaylar.push({ tur: 'fisTamam', sofra: no, odeme })
}

/**
 * Kurulmamış sofraya dokunmak onu kurar ("Sofra kurulu gelir"); kurulu sofraya
 * dokunmak servis eder. Servis dokunuşu kurulmamış sofrayı önce kurar, yani
 * "lebeni şişlerden önce gelir" çiğnenemez.
 */
export function sofrayaDokun(oyun: Oyun, no: number, olaylar: Olay[]): void {
  const sofra = oyun.sofralar[no]
  if (!sofra || sofra.kalkis !== null) return
  if (!sofra.kurulu) {
    sofra.kurulu = true
    const iade = Math.floor((sofra.toplamSabir * KURMA_IADESI_YUZDE) / 100)
    sofra.sabir = Math.min(sofra.toplamSabir, sofra.sabir + iade)
    olaylar.push({ tur: 'sofraKuruldu', sofra: no })
    return
  }
  servisEt(oyun, no, sofra, olaylar)
}

/** Sabır tükenir (kurulmamışta iki kat), ödeyen sofra kalkar, sabrı biten küsüp kalkar. */
export function sofralariIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.sofralar.forEach((sofra, no) => {
    if (!sofra) return
    if (sofra.kalkis !== null) {
      sofra.kalkis--
      if (sofra.kalkis <= 0) {
        oyun.sofralar[no] = null
        olaylar.push({ tur: 'sofraKalkti', sofra: no, odedi: true })
      }
      return
    }
    if (sofra.misafir.tukenmez) return
    sofra.sabir -= sofra.kurulu ? 1 : 2
    if (sofra.sabir > 0) return
    oyun.sofralar[no] = null
    oyun.puan += PUAN.kalkis
    oyun.kombo = 0
    oyun.ozet.kalkan++
    olaylar.push({ tur: 'sofraKalkti', sofra: no, odedi: false })
  })
}
```

`lib/oyun/ocak.ts`:

```ts
import { ACILDIGI_EVRE, AYRAN_TIK, PISME_YUZDESI, PUAN, SOGUMA_TIK } from './ayar.ts'
import { evreAyari } from './durum.ts'
import { komboDusur } from './puan.ts'
import type { Olay, Oyun, SisUrun } from './tipler.ts'

function bosYuva<T>(yuvalar: readonly (T | null)[], ustSinir = yuvalar.length): number {
  for (let i = 0; i < ustSinir; i++) if (!yuvalar[i]) return i
  return -1
}

/** Yanık ve soğuma aynı bedeli öder: puan, kombo kademesi, porsiyon dizisi. */
function ihmal(oyun: Oyun, ceza: number): void {
  oyun.puan += ceza
  oyun.kombo = komboDusur(oyun.kombo)
  oyun.porsiyonDizisi = 0
}

/** Raftan şiş: açık ocak yuvalarının ilk boşuna iner; süreler o anki evreden sabitlenir. */
export function rafaDokun(oyun: Oyun, urun: SisUrun, olaylar: Olay[]): void {
  if (ACILDIGI_EVRE[urun] > oyun.evre) return
  const ayar = evreAyari(oyun.evre)
  const yuva = bosYuva(oyun.ocak, ayar.ocak)
  if (yuva === -1) {
    olaylar.push({ tur: 'rafDolu', urun })
    return
  }
  oyun.ocak[yuva] = {
    urun,
    gecen: 0,
    pisme: Math.floor((ayar.cigerPisme * PISME_YUZDESI[urun] + 50) / 100),
    pencere: ayar.almaPenceresi,
    bant: ayar.tamKivamBandi,
    cevirme: 'yok',
  }
  olaylar.push({ tur: 'sisKondu', yuva, urun })
}

/**
 * Pişerken ilk dokunuş şişi çevirir: çentiğin bandındaysa tam kıvam mümkün kalır.
 * Alma penceresindeki dokunuş şişi tezgaha alır. Karşılaştırmalar iki katı alınarak
 * tamsayıda yapılır: |gecen - pisme/2| <= bant/2  ⇔  |2·gecen - pisme| <= bant.
 */
export function ocagaDokun(oyun: Oyun, yuva: number, olaylar: Olay[]): void {
  const sis = oyun.ocak[yuva]
  if (!sis) return
  if (sis.gecen < sis.pisme) {
    if (sis.cevirme !== 'yok') return
    const iyi = Math.abs(2 * sis.gecen - sis.pisme) <= sis.bant
    sis.cevirme = iyi ? 'iyi' : 'kotu'
    olaylar.push({ tur: 'sisCevrildi', yuva, iyi })
    return
  }
  const bos = bosYuva(oyun.tezgah)
  if (bos === -1) return
  const merkezFarki = Math.abs(2 * (sis.gecen - sis.pisme) - sis.pencere)
  const kalite = sis.cevirme === 'iyi' && merkezFarki <= sis.bant ? 'tam' : 'iyi'
  oyun.tezgah[bos] = { urun: sis.urun, kalite, bekleme: 0 }
  oyun.ocak[yuva] = null
  olaylar.push({ tur: 'sisAlindi', yuva, kalite })
}

export function ayranaDokun(oyun: Oyun): void {
  if (oyun.ayran !== null || ACILDIGI_EVRE.ayran > oyun.evre) return
  oyun.ayran = AYRAN_TIK
}

/** Şişler pişer; alma penceresi geçen yanar. */
export function ocakIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.ocak.forEach((sis, yuva) => {
    if (!sis) return
    sis.gecen++
    if (sis.gecen < sis.pisme + sis.pencere) return
    oyun.ocak[yuva] = null
    ihmal(oyun, PUAN.yanik)
    olaylar.push({ tur: 'sisYandi', yuva })
  })
}

/** Tezgahta bekleyen şiş soğur; ayran soğumaz. */
export function tezgahIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.tezgah.forEach((kalem, yuva) => {
    if (!kalem || kalem.kalite === null) return
    kalem.bekleme++
    if (kalem.bekleme < SOGUMA_TIK) return
    oyun.tezgah[yuva] = null
    ihmal(oyun, PUAN.soguma)
    olaylar.push({ tur: 'sogudu', tezgah: yuva })
  })
}

/** Maşrapa dolar; dolunca tezgahta ilk boş yere geçer, yer yoksa yayıkta bekler. */
export function ayranIlerle(oyun: Oyun, olaylar: Olay[]): void {
  if (oyun.ayran === null) return
  if (oyun.ayran > 0) oyun.ayran--
  if (oyun.ayran > 0) return
  const bos = bosYuva(oyun.tezgah)
  if (bos === -1) return
  oyun.tezgah[bos] = { urun: 'ayran', kalite: null, bekleme: 0 }
  oyun.ayran = null
  olaylar.push({ tur: 'ayranDoldu' })
}
```

`lib/oyun/motor.ts` (bu görevde yalnız `ilerle`; `simule` 5. görevde eklenir):

```ts
import { KAYIP_SINIRI, PUAN, TUR_TIK } from './ayar.ts'
import { evreBul } from './durum.ts'
import { ayranaDokun, ayranIlerle, ocagaDokun, ocakIlerle, rafaDokun, tezgahIlerle } from './ocak.ts'
import { gelisleriAl, kuyruguOturt, sofralariIlerle, sofrayaDokun } from './sofra.ts'
import type { Hedef, Olay, Oyun } from './tipler.ts'

function dokun(oyun: Oyun, hedef: Hedef, olaylar: Olay[]): void {
  if (hedef === 'ayran') return ayranaDokun(oyun)
  if (hedef === 'ciger' || hedef === 'dalak' || hedef === 'yurek') return rafaDokun(oyun, hedef, olaylar)
  const no = Number(hedef.slice(1))
  if (hedef.startsWith('s')) sofrayaDokun(oyun, no, olaylar)
  else ocagaDokun(oyun, no, olaylar)
}

function bitisiDenetle(oyun: Oyun, olaylar: Olay[]): void {
  if (oyun.ozet.kalkan >= KAYIP_SINIRI) oyun.bitti = 'ucSofra'
  else if (oyun.tik >= TUR_TIK) {
    oyun.puan += PUAN.geceTamam
    oyun.bitti = 'gece'
  }
  if (oyun.bitti) olaylar.push({ tur: 'bitti', sebep: oyun.bitti })
}

/**
 * Bir tik: önce bu tikin dokunuşları sırasıyla, sonra dünya ilerler (ocak, tezgah,
 * ayran, sofralar), tik artar, gelenler oturur, bitiş denetlenir. Oyun ekranı da
 * sunucu da yalnız bu fonksiyonla ilerler; aynı girdi aynı sonucu verir.
 */
export function ilerle(oyun: Oyun, hedefler: readonly Hedef[]): Olay[] {
  const olaylar: Olay[] = []
  if (oyun.bitti) return olaylar
  for (const hedef of hedefler) dokun(oyun, hedef, olaylar)
  ocakIlerle(oyun, olaylar)
  tezgahIlerle(oyun, olaylar)
  ayranIlerle(oyun, olaylar)
  sofralariIlerle(oyun, olaylar)
  oyun.tik++
  const evre = evreBul(oyun.tik)
  if (evre !== oyun.evre) {
    oyun.evre = evre
    olaylar.push({ tur: 'evre', evre })
  }
  gelisleriAl(oyun)
  kuyruguOturt(oyun, olaylar)
  bitisiDenetle(oyun, olaylar)
  return olaylar
}
```

`lib/oyun/deneme.ts` (bu görevde yalnız sahne yardımcıları; otomatik oyuncu 5. görevde eklenir):

```ts
import { EVRELER } from './ayar.ts'
import { evreAyari, yeniOyun } from './durum.ts'
import { ilerle } from './motor.ts'
import type { Hedef, Olay, Oyun, Urun } from './tipler.ts'

/*
 * Testlerin fikstürleri; üretim kodu bu dosyayı çağırmaz. Elle kurulan sahneler
 * birim testleri içindir.
 */

/** Verilen fişlerle, hepsi ilk tikte gelen bir gece. Başka misafir gelmez. */
export function sahne(fisler: Urun[][], tukenmez = false): Oyun {
  const oyun = yeniOyun(1)
  oyun.gelecek = fisler.map((fis, no) => ({ no, gelis: 0, fis, karisik: false, tukenmez }))
  return oyun
}

/** Oyunun saatini bir evrenin başına alır; gelecek misafirler yerinde kalır. */
export function evreyeGec(oyun: Oyun, evre: number): void {
  oyun.tik = evreAyari(evre).baslangic
  oyun.evre = evre
}

/** Tek tikte verilen hedeflere dokunur. */
export function dokun(oyun: Oyun, ...hedefler: Hedef[]): Olay[] {
  return ilerle(oyun, hedefler)
}

/** `n` tik dokunmadan ilerler, olayları toplar. */
export function bekle(oyun: Oyun, n: number): Olay[] {
  const olaylar: Olay[] = []
  for (let i = 0; i < n; i++) olaylar.push(...ilerle(oyun, []))
  return olaylar
}

/** Bitene kadar dokunmadan ilerler; sonsuz döngüye karşı tur süresiyle sınırlı. */
export function sonaKadarBekle(oyun: Oyun): void {
  const sinir = (EVRELER.at(-1)?.bitis ?? 0) + 1
  for (let i = 0; i < sinir && !oyun.bitti; i++) ilerle(oyun, [])
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test lib/oyun/*.test.ts && npm run typecheck`
Expected: 47 test PASS (rastgele 4, gece 7, puan 3, sofra 9, ocak 14, servis 10), typecheck temiz.

- [ ] **Step 5: Commit**

```bash
git add lib/oyun/sofra.ts lib/oyun/ocak.ts lib/oyun/motor.ts lib/oyun/deneme.ts \
  lib/oyun/sofra.test.ts lib/oyun/ocak.test.ts lib/oyun/servis.test.ts
git commit -m "Add the tick engine: tables, grill, counter and ayran"
```

---

### Task 5: Bütün geceyi oynatma, altın kayıtlar ve zorluk bandı

**Files:**
- Modify: `lib/oyun/motor.ts` (tamamı aşağıdaki hâliyle değişir: `simule` ve girdi denetimi eklenir)
- Modify: `lib/oyun/deneme.ts` (tamamı aşağıdaki hâliyle değişir: otomatik oyuncu eklenir)
- Modify: `docs/specs/2026-10-08-oyun-design.md` (§5 tablo değerleri, §10 `simule` dönüşü)
- Test: `lib/oyun/motor.test.ts`

**Interfaces:**
- Consumes: `ilerle`, `yeniOyun` (Task 3-4).
- Produces: `simule(tohum: number, girdiler: readonly Girdi[]): Sonuc`
  (`{ puan, ozet, bitti, tik }`): tik sırasız, kesirli, negatif ya da `TUR_TIK` ve üstü bir girdide
  `RangeError`; bitişten sonraki girdiler yok sayılır. Fikstür: `ustaOyna(tohum, beceri:
  'usta' | 'acemi' | 'siradan'): Girdi[]`. Usta saniyede 4 dokunur, çentikte çevirir, pencerenin
  ortasında alır; acemi saniyede 2,5, sıradan 1,5 dokunur ve çevirmez.

Ayar bu görevin ölçümüyle kondu (8 Ekim 2026, 200 tohum): spec'in ilk tablosunda saniyede 1,5
dokunan sıradan oyuncu bile gecelerin %97'sini tamamlıyordu; bu tabloda usta %100, acemi %99,5,
sıradan %0 tamamlıyor ve sıradan oyuncunun gecesi ortalama 03:50'de bitiyor. Ayrıca son evrenin
aralığı daraltıldı: eskiden son misafir 05:00'e 3 sn kala gelebiliyordu ve servis edilip
edilmemesi tohuma bağlıydı.

- [ ] **Step 1: Write the failing test**

`lib/oyun/motor.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ustaOyna } from './deneme.ts'
import { simule } from './motor.ts'
import type { Girdi } from './tipler.ts'

test('simule_siraDisiAralikDisiYaDaKesirliTik_hataVerir', () => {
  assert.throws(() => simule(1, [[5, 's0'], [4, 's0']]), RangeError)
  assert.throws(() => simule(1, [[7200, 's0']]), RangeError)
  assert.throws(() => simule(1, [[-1, 's0']]), RangeError)
  assert.throws(() => simule(1, [[1.5, 's0']]), RangeError)
})

test('simule_ayniTohumVeGirdi_herSeferindeAyniSonuc', () => {
  const kayit = ustaOyna(77, 'usta')
  assert.deepEqual(simule(77, kayit), simule(77, kayit))
})

test('simule_bitistenSonrakiGirdiler_yokSayilir', () => {
  const kayit = ustaOyna(2026, 'siradan')
  const sonuc = simule(2026, kayit)
  assert.equal(sonuc.bitti, 'ucSofra')
  const fazla: Girdi[] = [...kayit, [sonuc.tik + 10, 'ciger']]
  assert.deepEqual(simule(2026, fazla), sonuc)
})

/*
 * Altın kayıtlar: sabit tohum ve otomatik oyuncu, sabit sonuç. Kural, ayar ya da
 * oyuncu değişince bilerek kırılır; yeni değer bilinçli olarak yazılır.
 */
test('altin_tohum1_usta', () => {
  assert.deepEqual(simule(1, ustaOyna(1, 'usta')), {
    puan: 40470,
    ozet: { sofra: 22, sis: 48, tamKivam: 36, enUzunKombo: 22, kalkan: 1 },
    bitti: 'gece',
    tik: 7200,
  })
})

test('altin_tohum1_acemi', () => {
  assert.deepEqual(simule(1, ustaOyna(1, 'acemi')), {
    puan: 30769,
    ozet: { sofra: 22, sis: 46, tamKivam: 0, enUzunKombo: 20, kalkan: 1 },
    bitti: 'gece',
    tik: 7200,
  })
})

test('altin_tohum2026_siradan', () => {
  assert.deepEqual(simule(2026, ustaOyna(2026, 'siradan')), {
    puan: 10001,
    ozet: { sofra: 15, sis: 32, tamKivam: 0, enUzunKombo: 12, kalkan: 3 },
    bitti: 'ucSofra',
    tik: 6504,
  })
})

/*
 * Zorluk bandı (plan 1, Görev 5): saniyede 4 dokunan kusursuz usta gecelerin en az
 * %90'ını tamamlar; saniyede 1,5 dokunan sıradan oyuncu en fazla %30'unu. Ayar
 * değişikliği bu bandın dışına düşerse oyun ya yapılamaz ya baskısız hale gelmiştir.
 */
test('zorlukBandi_ustaTamamlar_siradanTamamlayamaz', () => {
  const tohumlar = Array.from({ length: 40 }, (_, i) => i + 1)
  const tamamlayan = (beceri: 'usta' | 'siradan'): number =>
    tohumlar.filter((t) => simule(t, ustaOyna(t, beceri)).bitti === 'gece').length
  assert.ok(tamamlayan('usta') >= 36, 'usta gecelerin %90ından azını tamamlıyor')
  assert.ok(tamamlayan('siradan') <= 12, 'sıradan oyuncu gecelerin %30undan fazlasını tamamlıyor')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test lib/oyun/motor.test.ts`
Expected: FAIL, `SyntaxError: The requested module './deneme.ts' does not provide an export named
'ustaOyna'`

- [ ] **Step 3: Write the implementation**

`lib/oyun/motor.ts`, tamamı:

```ts
import { KAYIP_SINIRI, PUAN, TUR_TIK } from './ayar.ts'
import { evreBul, yeniOyun } from './durum.ts'
import { ayranaDokun, ayranIlerle, ocagaDokun, ocakIlerle, rafaDokun, tezgahIlerle } from './ocak.ts'
import { gelisleriAl, kuyruguOturt, sofralariIlerle, sofrayaDokun } from './sofra.ts'
import type { Girdi, Hedef, Olay, Oyun, Sonuc } from './tipler.ts'

function dokun(oyun: Oyun, hedef: Hedef, olaylar: Olay[]): void {
  if (hedef === 'ayran') return ayranaDokun(oyun)
  if (hedef === 'ciger' || hedef === 'dalak' || hedef === 'yurek') return rafaDokun(oyun, hedef, olaylar)
  const no = Number(hedef.slice(1))
  if (hedef.startsWith('s')) sofrayaDokun(oyun, no, olaylar)
  else ocagaDokun(oyun, no, olaylar)
}

function bitisiDenetle(oyun: Oyun, olaylar: Olay[]): void {
  if (oyun.ozet.kalkan >= KAYIP_SINIRI) oyun.bitti = 'ucSofra'
  else if (oyun.tik >= TUR_TIK) {
    oyun.puan += PUAN.geceTamam
    oyun.bitti = 'gece'
  }
  if (oyun.bitti) olaylar.push({ tur: 'bitti', sebep: oyun.bitti })
}

/**
 * Bir tik: önce bu tikin dokunuşları sırasıyla, sonra dünya ilerler (ocak, tezgah,
 * ayran, sofralar), tik artar, gelenler oturur, bitiş denetlenir. Oyun ekranı da
 * sunucu da yalnız bu fonksiyonla ilerler; aynı girdi aynı sonucu verir.
 */
export function ilerle(oyun: Oyun, hedefler: readonly Hedef[]): Olay[] {
  const olaylar: Olay[] = []
  if (oyun.bitti) return olaylar
  for (const hedef of hedefler) dokun(oyun, hedef, olaylar)
  ocakIlerle(oyun, olaylar)
  tezgahIlerle(oyun, olaylar)
  ayranIlerle(oyun, olaylar)
  sofralariIlerle(oyun, olaylar)
  oyun.tik++
  const evre = evreBul(oyun.tik)
  if (evre !== oyun.evre) {
    oyun.evre = evre
    olaylar.push({ tur: 'evre', evre })
  }
  gelisleriAl(oyun)
  kuyruguOturt(oyun, olaylar)
  bitisiDenetle(oyun, olaylar)
  return olaylar
}

/** Girdi kaydı tik sırasında, tamsayı ve tur içinde olmalı; değilse kayıt bozuktur. */
function girdileriDogrula(girdiler: readonly Girdi[]): void {
  let onceki = 0
  for (const [tik] of girdiler) {
    if (!Number.isInteger(tik) || tik < 0 || tik >= TUR_TIK) throw new RangeError(`geçersiz tik: ${tik}`)
    if (tik < onceki) throw new RangeError(`girdiler tik sırasında değil: ${tik} < ${onceki}`)
    onceki = tik
  }
}

/** Tohum ve girdi kaydından bütün geceyi oynatır. Sunucu skoru buradan hesaplar. */
export function simule(tohum: number, girdiler: readonly Girdi[]): Sonuc {
  girdileriDogrula(girdiler)
  const oyun = yeniOyun(tohum)
  let i = 0
  while (!oyun.bitti) {
    const hedefler: Hedef[] = []
    while (girdiler[i] && girdiler[i]![0] === oyun.tik) hedefler.push(girdiler[i++]![1])
    ilerle(oyun, hedefler)
  }
  return { puan: oyun.puan, ozet: { ...oyun.ozet }, bitti: oyun.bitti, tik: oyun.tik }
}
```

`lib/oyun/deneme.ts`, tamamı:

```ts
import { EVRELER } from './ayar.ts'
import { evreAyari, yeniOyun } from './durum.ts'
import { ilerle } from './motor.ts'
import type { Girdi, Hedef, Olay, Oyun, SisUrun, Urun } from './tipler.ts'

/*
 * Testlerin fikstürleri; üretim kodu bu dosyayı çağırmaz. İki parça: elle kurulan
 * sahneler (birim testleri) ve otomatik oyuncular (altın kayıtlar, zorluk bandı).
 */

/** Verilen fişlerle, hepsi ilk tikte gelen bir gece. Başka misafir gelmez. */
export function sahne(fisler: Urun[][], tukenmez = false): Oyun {
  const oyun = yeniOyun(1)
  oyun.gelecek = fisler.map((fis, no) => ({ no, gelis: 0, fis, karisik: false, tukenmez }))
  return oyun
}

/** Oyunun saatini bir evrenin başına alır; gelecek misafirler yerinde kalır. */
export function evreyeGec(oyun: Oyun, evre: number): void {
  oyun.tik = evreAyari(evre).baslangic
  oyun.evre = evre
}

/** Tek tikte verilen hedeflere dokunur. */
export function dokun(oyun: Oyun, ...hedefler: Hedef[]): Olay[] {
  return ilerle(oyun, hedefler)
}

/** `n` tik dokunmadan ilerler, olayları toplar. */
export function bekle(oyun: Oyun, n: number): Olay[] {
  const olaylar: Olay[] = []
  for (let i = 0; i < n; i++) olaylar.push(...ilerle(oyun, []))
  return olaylar
}

/** Bitene kadar dokunmadan ilerler; sonsuz döngüye karşı tur süresiyle sınırlı. */
export function sonaKadarBekle(oyun: Oyun): void {
  const sinir = (EVRELER.at(-1)?.bitis ?? 0) + 1
  for (let i = 0; i < sinir && !oyun.bitti; i++) ilerle(oyun, [])
}

/**
 * Otomatik oyuncu. 'usta' her şişi çentikte çevirir ve pencerenin ortasında alır;
 * 'acemi' ve 'siradan' hiç çevirmez, şiş hazır olur olmaz alır. Hepsi tek parmakla
 * oynar: iki dokunuş arası en az `ARALIK[beceri]` tik.
 */
export type Beceri = 'usta' | 'acemi' | 'siradan'

/** Usta saniyede 4, acemi 2,5, sıradan 1,5 dokunuş. */
const ARALIK: Record<Beceri, number> = { usta: 15, acemi: 24, siradan: 40 }

const SISLER: readonly SisUrun[] = ['ciger', 'dalak', 'yurek']

/** Sofralarda bekleyen kalemlerden ocakta, tezgahta ve yayıkta olanlar düşülür. */
function eksikler(oyun: Oyun): Urun[] {
  const istenen: Urun[] = oyun.sofralar.flatMap((s) => (s && s.kalkis === null ? s.kalan : []))
  const hazirlanan: Urun[] = [
    ...oyun.ocak.flatMap((s) => (s ? [s.urun] : [])),
    ...oyun.tezgah.flatMap((k) => (k ? [k.urun] : [])),
    ...(oyun.ayran !== null ? (['ayran'] as const) : []),
  ]
  for (const urun of hazirlanan) {
    const i = istenen.indexOf(urun)
    if (i !== -1) istenen.splice(i, 1)
  }
  return istenen
}

/** Öncelik sırası: yanacak şişi al, servis et, sofra kur, şiş koy, ayran, çevir. */
function karar(oyun: Oyun, beceri: Beceri): Hedef | null {
  const al: Hedef[] = []
  const cevir: Hedef[] = []
  oyun.ocak.forEach((sis, yuva) => {
    if (!sis) return
    const hedef = `o${yuva}` as Hedef
    if (sis.gecen < sis.pisme) {
      if (beceri === 'usta' && sis.cevirme === 'yok' && 2 * sis.gecen >= sis.pisme) cevir.push(hedef)
      return
    }
    const ortada = 2 * (sis.gecen - sis.pisme) >= sis.pencere
    const yanacak = sis.gecen >= sis.pisme + sis.pencere - ARALIK[beceri]
    if (beceri !== 'usta' || ortada || yanacak) al.push(hedef)
  })
  const servis: Hedef[] = []
  const kur: Hedef[] = []
  oyun.sofralar.forEach((s, no) => {
    if (!s || s.kalkis !== null) return
    if (!s.kurulu) kur.push(`s${no}` as Hedef)
    else if (oyun.tezgah.some((k) => k && s.kalan.includes(k.urun))) servis.push(`s${no}` as Hedef)
  })
  const eksik = eksikler(oyun)
  const ilkSis = eksik.find((u): u is SisUrun => SISLER.includes(u as SisUrun))
  const ocakBos = oyun.ocak.some((s, i) => !s && i < 4)
  const koy: Hedef[] = ilkSis && ocakBos ? [ilkSis] : []
  const ayran: Hedef[] = eksik.includes('ayran') && oyun.ayran === null ? ['ayran'] : []
  return [...al, ...servis, ...kur, ...koy, ...ayran, ...cevir][0] ?? null
}

/** Bütün geceyi oynar, girdi kaydını döner. */
export function ustaOyna(tohum: number, beceri: Beceri): Girdi[] {
  const oyun = yeniOyun(tohum)
  const kayit: Girdi[] = []
  let sonDokunus = -ARALIK[beceri]
  while (!oyun.bitti) {
    const hedef = oyun.tik - sonDokunus >= ARALIK[beceri] ? karar(oyun, beceri) : null
    if (hedef) {
      kayit.push([oyun.tik, hedef])
      sonDokunus = oyun.tik
    }
    ilerle(oyun, hedef ? [hedef] : [])
  }
  return kayit
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test lib/oyun/*.test.ts && npm run typecheck`
Expected: 54 test PASS (önceki 47 ve motor 7), typecheck temiz. Zorluk bandı testi 40 tohumu
iki beceriyle oynatır; ~0,2 sn sürer.

- [ ] **Step 5: Spec'i ölçülen ayarla eşitle**

`docs/specs/2026-10-08-oyun-design.md` §5 tablosunda üç sütun değişir, gerisi aynı kalır:

| Evre | Misafir aralığı | Fiş boyu | Sabır |
|---|---|---|---|
| 1 | yönlendirmeli | 1-2 | 30 sn |
| 2 | 7 sn | 1-2 | 22 sn |
| 3 | 5 sn | 2-3 | 18 sn |
| 4 | 3,75 sn | 2-3 | 15 sn |
| 5 son saat | 2,33 sn | 3-4 | 13 sn |

Tablonun hemen altına şu paragraf eklenir:

```markdown
**Ölçümle ayar (8 Ekim 2026, plan 1 Görev 5).** İlk tabloyu otomatik oyuncularla 200 tohumda
oynattık: saniyede 1,5 dokunan sıradan oyuncu gecelerin %97'sini tamamlıyordu, baskı yoktu.
Sabır kısaldı, misafir sıklaştı, gece 21'den 24 misafire çıktı. Şimdi saniyede 4 dokunan kusursuz
usta %100, 2,5 dokunan çevirmeyen acemi %99,5, sıradan oyuncu %0 tamamlıyor; sıradanın gecesi
ortalama 03:50'de bitiyor. Son evrenin aralığı son misafiri 05:00'ten en az 6 sn önce getirir.
`lib/oyun/motor.test.ts` > `zorlukBandi` bu bandı tutar; kaba prototip testi insanla yeniden ayarlar.
```

§10'da "Simülasyon çekirdeği" maddesinde iki ifade değişir:
- `simule(tohum, girdiler) -> { puan, ozet, olaylar, bitti }` → `simule(tohum, girdiler) -> { puan, ozet, bitti, tik }`
- "ayrıca adım adım ilerleten bir durum makinesi" → "ayrıca adım adım ilerleten `ilerle(oyun, hedefler)`;
  olayları o döner"

- [ ] **Step 6: Commit**

```bash
git add lib/oyun/motor.ts lib/oyun/deneme.ts lib/oyun/motor.test.ts docs/specs/2026-10-08-oyun-design.md
git commit -m "Replay a night from inputs and pin it with golden records"
```

---

### Task 6: Canlı oyun kaydı, sabit adımlı zamanlayıcı ve ekran okumaları

**Files:**
- Create: `lib/oyun/canli.ts`, `lib/oyun/zamanlayici.ts`, `lib/oyun/gosterim.ts`
- Test: `lib/oyun/canli.test.ts`, `lib/oyun/zamanlayici.test.ts`, `lib/oyun/gosterim.test.ts`

**Interfaces:**
- Consumes: `yeniOyun`, `ilerle`, `simule`, `evreAyari`, `ustaOyna`, fikstürler; `ACILDIGI_EVRE`,
  `OYUN_SAATI_TIK`, `TUR_TIK`, `TIK_HIZI`.
- Produces:
  - `CanliOyun = { oyun: Oyun; kayit: Girdi[]; bekleyen: Hedef[] }`, `canliBaslat(tohum)`,
    `canliDokun(canli, hedef)` (aynı tikte aynı hedef bir kez), `canliAdim(canli): Olay[]`.
  - `TIK_MS`, `EN_COK_ADIM = 6`, `adimSayisi(birikim, gecenMs): { adim; birikim }`.
  - `oyunSaati(tik): string`, `SisGorunumu = 'pisiyor' | 'centik' | 'hazir' | 'kivam'`,
    `sisGorunumu(sis)`, `Goruntu`, `goruntuAl(oyun): Goruntu`, `ipucuHedefi(oyun): Hedef | null`.

`gosterim.ts` ve `zamanlayici.ts` kesirli sayı kullanabilir: değerleri simülasyona dönmez.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/canli.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { canliAdim, canliBaslat, canliDokun } from './canli.ts'
import { ustaOyna } from './deneme.ts'
import { simule } from './motor.ts'

test('canli_kayitYenidenOynatilinca_ayniSonucuVerir', () => {
  const tohum = 2026
  const plan = ustaOyna(tohum, 'usta')
  const canli = canliBaslat(tohum)
  let i = 0
  while (!canli.oyun.bitti) {
    while (plan[i] && plan[i]![0] === canli.oyun.tik) canliDokun(canli, plan[i++]![1])
    canliAdim(canli)
  }
  assert.deepEqual(canli.kayit, plan)
  assert.deepEqual(simule(tohum, canli.kayit), {
    puan: canli.oyun.puan,
    ozet: canli.oyun.ozet,
    bitti: canli.oyun.bitti,
    tik: canli.oyun.tik,
  })
})

test('canli_ayniTiktekiIkinciDokunus_duser', () => {
  const canli = canliBaslat(1)
  canliDokun(canli, 'ciger')
  canliDokun(canli, 'ciger')
  canliDokun(canli, 's0')
  canliAdim(canli)
  assert.deepEqual(canli.kayit, [
    [0, 'ciger'],
    [0, 's0'],
  ])
})

test('canli_bittiktenSonra_dokunusKaydaGecmez', () => {
  const canli = canliBaslat(1)
  canli.oyun.bitti = 'gece'
  canliDokun(canli, 'ciger')
  assert.deepEqual(canli.bekleyen, [])
})
```

`lib/oyun/zamanlayici.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EN_COK_ADIM, TIK_MS, adimSayisi } from './zamanlayici.ts'

test('adimSayisi_birKarelikSure_birTik', () => {
  assert.equal(adimSayisi(0, TIK_MS).adim, 1)
})

test('adimSayisi_kisaSure_birikir_sonrakiKaredeTikOlur', () => {
  const ilk = adimSayisi(0, 10)
  assert.deepEqual(ilk, { adim: 0, birikim: 10 })
  const ikinci = adimSayisi(ilk.birikim, 10)
  assert.equal(ikinci.adim, 1)
  assert.ok(Math.abs(ikinci.birikim - (20 - TIK_MS)) < 1e-9)
})

test('adimSayisi_uzunUyku_enCokAltiTik_birikimSifirlanir', () => {
  assert.deepEqual(adimSayisi(0, 5000), { adim: EN_COK_ADIM, birikim: 0 })
})

test('adimSayisi_negatifSure_sifirSayilir', () => {
  assert.deepEqual(adimSayisi(5, -30), { adim: 0, birikim: 5 })
})
```

`lib/oyun/gosterim.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bekle, dokun, sahne } from './deneme.ts'
import { yeniOyun } from './durum.ts'
import { goruntuAl, ipucuHedefi, oyunSaati, sisGorunumu } from './gosterim.ts'

test('oyunSaati_gecenin21indenSabahin05ine', () => {
  assert.deepEqual([0, 450, 900, 3600, 7199, 7200, 9000].map(oyunSaati), [
    '21:00',
    '21:30',
    '22:00',
    '01:00',
    '04:59',
    '05:00',
    '05:00',
  ])
})

test('sisGorunumu_centikPencereVeKivamBandi', () => {
  const sis = { urun: 'ciger' as const, gecen: 0, pisme: 240, pencere: 120, bant: 30, cevirme: 'yok' as const }
  assert.equal(sisGorunumu({ ...sis, gecen: 50 }), 'pisiyor')
  assert.equal(sisGorunumu({ ...sis, gecen: 120 }), 'centik')
  assert.equal(sisGorunumu({ ...sis, gecen: 120, cevirme: 'kotu' }), 'pisiyor')
  assert.equal(sisGorunumu({ ...sis, gecen: 300 }), 'hazir')
  assert.equal(sisGorunumu({ ...sis, gecen: 300, cevirme: 'iyi' }), 'kivam')
  assert.equal(sisGorunumu({ ...sis, gecen: 340, cevirme: 'iyi' }), 'hazir')
})

test('goruntuAl_evreAciklariVeOcakRayi', () => {
  const oyun = sahne([['ciger', 'ayran']])
  bekle(oyun, 1)
  dokun(oyun, 'ciger', 'ayran')
  const g = goruntuAl(oyun)
  assert.equal(g.acikSofra, 2)
  assert.equal(g.acikOcak, 3)
  assert.deepEqual(g.raf, ['ciger'])
  assert.deepEqual(g.sofralar[0], { fis: ['ciger', 'ayran'], kalan: ['ciger', 'ayran'], kurulu: false, odedi: false })
  assert.deepEqual(g.ocak[0], { urun: 'ciger', centik: 1 / 3, pencere: 2 / 3, cevirme: 'yok' })
  assert.equal(g.ayran, 'doluyor')
})

test('ipucu_ilkMisafir_kurPisirCevirAlServisSirasiyla', () => {
  const oyun = yeniOyun(1)
  bekle(oyun, 61)
  assert.equal(ipucuHedefi(oyun), 's0')
  dokun(oyun, 's0')
  assert.equal(ipucuHedefi(oyun), 'ciger')
  dokun(oyun, 'ciger')
  assert.equal(ipucuHedefi(oyun), null)
  bekle(oyun, 104)
  assert.equal(ipucuHedefi(oyun), 'o0')
  dokun(oyun, 'o0')
  assert.equal(ipucuHedefi(oyun), null)
  bekle(oyun, 178)
  assert.equal(ipucuHedefi(oyun), null)
  bekle(oyun, 1)
  assert.equal(ipucuHedefi(oyun), 'o0')
  dokun(oyun, 'o0')
  assert.equal(ipucuHedefi(oyun), 's0')
  dokun(oyun, 's0')
  assert.equal(ipucuHedefi(oyun), null)
})

test('ipucu_ikinciMisafirdenSonra_yok', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  oyun.sofralar[0]!.misafir = { ...oyun.sofralar[0]!.misafir, no: 2 }
  assert.equal(ipucuHedefi(oyun), null)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test lib/oyun/canli.test.ts lib/oyun/zamanlayici.test.ts lib/oyun/gosterim.test.ts`
Expected: FAIL, `Cannot find module '.../lib/oyun/canli.ts'` (ve diğer ikisi)

- [ ] **Step 3: Write the implementation**

`lib/oyun/canli.ts`:

```ts
import { yeniOyun } from './durum.ts'
import { ilerle } from './motor.ts'
import type { Girdi, Hedef, Olay, Oyun } from './tipler.ts'

/** Oyun ekranının simülasyonu: dokunuş bir sonraki tikte işlenir ve kayda geçer. */
export type CanliOyun = { oyun: Oyun; kayit: Girdi[]; bekleyen: Hedef[] }

export function canliBaslat(tohum: number): CanliOyun {
  return { oyun: yeniOyun(tohum), kayit: [], bekleyen: [] }
}

/** Dokunuşu sıraya alır. Aynı hedefe aynı tikte ikinci dokunuş düşer (spec §9). */
export function canliDokun(canli: CanliOyun, hedef: Hedef): void {
  if (canli.oyun.bitti || canli.bekleyen.includes(hedef)) return
  canli.bekleyen.push(hedef)
}

/** Bir tik: bekleyen dokunuşlar o tikin numarasıyla kaydedilir, sonra işlenir. */
export function canliAdim(canli: CanliOyun): Olay[] {
  const hedefler = canli.bekleyen.splice(0)
  for (const hedef of hedefler) canli.kayit.push([canli.oyun.tik, hedef])
  return ilerle(canli.oyun, hedefler)
}
```

`lib/oyun/zamanlayici.ts`:

```ts
import { TIK_HIZI } from './ayar.ts'

export const TIK_MS = 1000 / TIK_HIZI
/** Bir karede en çok 100 ms telafi edilir: uykudan dönen sekme oyunu ileri sarmaz. */
export const EN_COK_ADIM = 6

/** Sabit adımlı döngü: geçen süreyi biriktirir; kaç tik ilerleneceğini ve artanı döner. */
export function adimSayisi(birikim: number, gecenMs: number): { adim: number; birikim: number } {
  const toplam = birikim + Math.max(gecenMs, 0)
  const adim = Math.floor(toplam / TIK_MS)
  if (adim > EN_COK_ADIM) return { adim: EN_COK_ADIM, birikim: 0 }
  return { adim, birikim: toplam - adim * TIK_MS }
}
```

`lib/oyun/gosterim.ts`:

```ts
import { ACILDIGI_EVRE, OYUN_SAATI_TIK, TUR_TIK } from './ayar.ts'
import { evreAyari } from './durum.ts'
import type { Hedef, Kalite, OcakSisi, Oyun, SisUrun, Urun } from './tipler.ts'

/*
 * Simülasyonun ekrana dönük okumaları. Saf fonksiyonlar: oyun durumunu değiştirmez,
 * yalnız oyun ekranı çağırır. Kesirli sayılar burada serbesttir, simülasyona dönmez.
 */

/** Tikten oyun saati: 0 → '21:00', 7200 → '05:00'. */
export function oyunSaati(tik: number): string {
  const dakika = Math.floor((Math.min(Math.max(tik, 0), TUR_TIK) * 60) / OYUN_SAATI_TIK)
  const saat = (21 + Math.floor(dakika / 60)) % 24
  return `${String(saat).padStart(2, '0')}:${String(dakika % 60).padStart(2, '0')}`
}

export type SisGorunumu = 'pisiyor' | 'centik' | 'hazir' | 'kivam'

/** Rayın o anki hali: çevirme bandı, alma penceresi, ve çevrilmiş şişte tam kıvam bandı. */
export function sisGorunumu(sis: OcakSisi): SisGorunumu {
  if (sis.gecen < sis.pisme) {
    const bantta = Math.abs(2 * sis.gecen - sis.pisme) <= sis.bant
    return sis.cevirme === 'yok' && bantta ? 'centik' : 'pisiyor'
  }
  const kivamda = Math.abs(2 * (sis.gecen - sis.pisme) - sis.pencere) <= sis.bant
  return sis.cevirme === 'iyi' && kivamda ? 'kivam' : 'hazir'
}

export type Goruntu = {
  acikSofra: number
  acikOcak: number
  raf: readonly SisUrun[]
  kapida: number
  sofralar: ({ fis: readonly Urun[]; kalan: readonly Urun[]; kurulu: boolean; odedi: boolean } | null)[]
  /** Çentik ve pencere başlangıcı rayın kesri olarak (0-1). */
  ocak: ({ urun: SisUrun; centik: number; pencere: number; cevirme: OcakSisi['cevirme'] } | null)[]
  tezgah: ({ urun: Urun; kalite: Kalite | null } | null)[]
  ayran: 'bos' | 'doluyor' | 'bekliyor'
}

/** React'in çizdiği yapı: yalnız olay olunca değişen kısım. */
export function goruntuAl(oyun: Oyun): Goruntu {
  const ayar = evreAyari(oyun.evre)
  return {
    acikSofra: ayar.sofra,
    acikOcak: ayar.ocak,
    raf: (['ciger', 'dalak', 'yurek'] as const).filter((u) => ACILDIGI_EVRE[u] <= oyun.evre),
    kapida: oyun.kuyruk.length,
    sofralar: oyun.sofralar.map((s) =>
      s ? { fis: s.misafir.fis, kalan: [...s.kalan], kurulu: s.kurulu, odedi: s.kalkis !== null } : null,
    ),
    ocak: oyun.ocak.map((s) => {
      if (!s) return null
      const ray = s.pisme + s.pencere
      return { urun: s.urun, centik: s.pisme / 2 / ray, pencere: s.pisme / ray, cevirme: s.cevirme }
    }),
    tezgah: oyun.tezgah.map((k) => (k ? { urun: k.urun, kalite: k.kalite } : null)),
    ayran: oyun.ayran === null ? 'bos' : oyun.ayran > 0 ? 'doluyor' : 'bekliyor',
  }
}

const SISLER: readonly Urun[] = ['ciger', 'dalak', 'yurek']

/** Ocaktaki şiş için yapılacak bir hamle var mı: çevir, tam kıvamda al ya da yanmadan al. */
function ocakHamlesiVar(sis: OcakSisi): boolean {
  const gorunum = sisGorunumu(sis)
  if (gorunum === 'centik' || gorunum === 'kivam') return true
  if (gorunum !== 'hazir') return false
  return sis.cevirme !== 'iyi' || 2 * (sis.gecen - sis.pisme) > sis.pencere
}

/**
 * Tarayıcıdaki ilk turda yönlendirmeli iki misafirin bir sonraki doğru dokunuşu
 * (spec §3); beklenecek anda ve diğer misafirlerde null.
 */
export function ipucuHedefi(oyun: Oyun): Hedef | null {
  const no = oyun.sofralar.findIndex((s) => s !== null && s.misafir.no < 2 && s.kalkis === null)
  const sofra = oyun.sofralar[no]
  if (!sofra) return null
  const sofraHedefi = `s${no}` as Hedef
  if (!sofra.kurulu) return sofraHedefi
  if (oyun.tezgah.some((k) => k && sofra.kalan.includes(k.urun))) return sofraHedefi
  const yuva = oyun.ocak.findIndex((s) => s !== null && sofra.kalan.includes(s.urun) && ocakHamlesiVar(s))
  if (yuva !== -1) return `o${yuva}` as Hedef
  const hazirlanan = [...oyun.ocak.flatMap((s) => (s ? [s.urun] : [])), ...(oyun.ayran !== null ? ['ayran'] : [])]
  const eksik = sofra.kalan.find((u) => !hazirlanan.includes(u))
  if (!eksik) return null
  return SISLER.includes(eksik) ? (eksik as SisUrun) : 'ayran'
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test lib/oyun/*.test.ts && npm run typecheck`
Expected: 66 test PASS (önceki 54, canli 3, zamanlayici 4, gosterim 5), typecheck temiz.
Not: ipucu testindeki 178 + 1 tik bilerek ayrık: çevirmenin olduğu tik de şişi bir tik pişirir,
tam kıvam bandına 179. tikte girilir.

- [ ] **Step 5: Commit**

```bash
git add lib/oyun/canli.ts lib/oyun/zamanlayici.ts lib/oyun/gosterim.ts \
  lib/oyun/canli.test.ts lib/oyun/zamanlayici.test.ts lib/oyun/gosterim.test.ts
git commit -m "Add live-play recording, fixed timestep and display reads"
```

---

### Task 7: Oynanabilir gri kutulu prototip, `/oyun/`

**Files:**
- Create: `content/tr/oyun.ts`, `content/en/oyun.ts`, `lib/oyun/defter.ts`
- Modify: `content/tr/index.ts`, `content/en/index.ts` (sözlüğe `oyun`)
- Create: `components/oyun/useOyunDongusu.ts`, `components/oyun/Saha.tsx`,
  `components/oyun/Saha.module.css`, `components/oyun/SonucEkrani.tsx`,
  `components/oyun/SonucEkrani.module.css`, `components/oyun/OyunSayfasi.tsx`,
  `components/oyun/OyunSayfasi.module.css`, `app/(tr)/oyun/page.tsx`
- Modify: `docs/surec/DEVAM.md`
- Test: mevcut `content/icerik.test.ts` (TR/EN anahtar eşitliği, boş değer, em dash) ve üç
  tarayıcı betiği (`/tmp` altında, repoya girmez; projenin ölçüm betikleri hep orada)

**Interfaces:**
- Consumes: Task 1-6'nın hepsi; `sozluk`, `Sozluk` (`@/content`), `s.menu.ocakbasi.urunler.{ciger,
  dalak,yurek}.ad`, `s.menu.icecekler.urunler.ayran`, `s.ana.gece.baslik`,
  `s.ana.hero.kilometreTaslari` (05:00 satırı), `tr.ortak.marka.ad`.
- Produces: `/oyun/` rotası; `OyunSayfasi({ dil })`; `useOyunDongusu({ tohum, ciz, tepki, bitince })`
  → `{ goruntu, dokun, duraklatildi, duraklat, devam }`; `enIyiOku`, `enIyiYaz`, `ilkTurMu`,
  `ilkTurBitti`. 2. plan görsel dili bunların üstüne kurar.

- [ ] **Step 1: Sözlüğe oyun metinlerini ekle ve içerik testlerini koş**

`content/tr/oyun.ts`:

```ts
/**
 * Oyun metinleri. TASLAK: sahibinin onayını bekliyor (spec §19, karar 4). Ürün adları
 * menüden, gece cümleleri ana sayfadan okunur; burada tekrar yazılmaz.
 */
export const oyun = {
  baslik: 'Sofra Yetiştir',
  oyna: 'Oyna',
  tekrar: 'Tekrar Oyna',
  duraklat: 'Duraklat',
  devam: 'Devam Et',
  puan: 'Puan',
  kombo: 'Kombo',
  kapida: 'Kapıda',
  ocak: 'Ocak',
  tezgah: 'Tezgah',
  sofra: 'Sofra',
  bosSofra: 'Boş sofra',
  ucSofraKalkti: 'üç sofra kalktı',
  ozet: { sofra: 'sofra', sis: 'şiş', tamKivam: 'tam kıvam', enUzunKombo: 'en uzun kombo' },
  enIyi: 'En iyin',
  yeniEnIyi: 'Yeni en iyi',
  kaldi: 'kaldı',
}
```

`content/en/oyun.ts`:

```ts
/** Game copy. DRAFT: awaiting the owner's approval (spec §19, decision 4). */
export const oyun = {
  baslik: 'Sofra Yetiştir',
  oyna: 'Play',
  tekrar: 'Play Again',
  duraklat: 'Pause',
  devam: 'Resume',
  puan: 'Score',
  kombo: 'Combo',
  kapida: 'At the door',
  ocak: 'Fire',
  tezgah: 'Counter',
  sofra: 'Table',
  bosSofra: 'Empty table',
  ucSofraKalkti: 'three tables walked out',
  ozet: { sofra: 'tables', sis: 'skewers', tamKivam: 'just right', enUzunKombo: 'longest combo' },
  enIyi: 'Your best',
  yeniEnIyi: 'New best',
  kaldi: 'to go',
}
```

`content/tr/index.ts` ve `content/en/index.ts`: `import { hata } from './hata.ts'` satırının altına
`import { oyun } from './oyun.ts'` eklenir, dışa aktarılan nesnenin sonuna `oyun` girer:

```ts
export const tr = { ortak, ana, menu, galeri, hikaye, konum, gizlilik, hata, oyun }
```

```ts
export const en: Sozluk = { ortak, ana, menu, galeri, hikaye, konum, gizlilik, hata, oyun }
```

Run: `node --test content/icerik.test.ts`
Expected: PASS (anahtar eşitliği, boş değer yok, em dash yok).

- [ ] **Step 2: Tarayıcı defteri**

`lib/oyun/defter.ts` (`lib/onay.ts` ile aynı kalıp; depolama kapalıyken oyun yine oynanır):

```ts
/** Oyunun tarayıcıda tuttuğu iki şey: kişisel en iyi ve ilk turun bittiği (spec §3, §11). */
const EN_IYI = 'bozo-oyun-en-iyi'
const ILK_TUR = 'bozo-oyun-ilk-tur-bitti'

export function enIyiOku(): number | null {
  try {
    const deger = Number(window.localStorage.getItem(EN_IYI))
    return Number.isInteger(deger) && deger > 0 ? deger : null
  } catch {
    // Depolama kapalıysa (gizli sekme) en iyi tutulmaz; oyun yine oynanır.
    return null
  }
}

/** Puan öncekini geçiyorsa yazar; yeni en iyiyse true. */
export function enIyiYaz(puan: number): boolean {
  if (puan <= 0) return false
  const onceki = enIyiOku()
  if (onceki !== null && puan <= onceki) return false
  try {
    window.localStorage.setItem(EN_IYI, String(puan))
  } catch {
    // Yazılamazsa yalnız bu oturumda yeni en iyi olarak gösterilir.
  }
  return true
}

/** İpuçları yalnız tarayıcıdaki ilk turda çıkar. */
export function ilkTurMu(): boolean {
  try {
    return window.localStorage.getItem(ILK_TUR) !== '1'
  } catch {
    return true
  }
}

export function ilkTurBitti(): void {
  try {
    window.localStorage.setItem(ILK_TUR, '1')
  } catch {
    // Yazılamazsa ipuçları bir sonraki turda da çıkar; zararsız.
  }
}
```

- [ ] **Step 3: Döngü kancası**

`components/oyun/useOyunDongusu.ts`:

```ts
import { useEffect, useEffectEvent, useState } from 'react'
import { canliAdim, canliBaslat, canliDokun } from '@/lib/oyun/canli'
import { goruntuAl } from '@/lib/oyun/gosterim'
import type { Hedef, Olay, Oyun, Sonuc } from '@/lib/oyun/tipler'
import { adimSayisi } from '@/lib/oyun/zamanlayici'

type Secenek = {
  tohum: number
  /** Her karede sürekli değerleri (ray, sabır, saat, puan) DOM'a yazar. */
  ciz: (oyun: Oyun) => void
  /** Karede olan olaylar; anlık tepkiler için. */
  tepki: (olaylar: Olay[]) => void
  bitince: (sonuc: Sonuc) => void
}

/**
 * Sabit adımlı oyun döngüsü (spec §10). Simülasyon tikte, çizim karede ilerler; React
 * yalnız olay olunca yeniden çizer, sürekli değerleri `ciz` doğrudan yazar.
 */
export function useOyunDongusu({ tohum, ciz, tepki, bitince }: Secenek) {
  const [canli] = useState(() => canliBaslat(tohum))
  const [goruntu, setGoruntu] = useState(() => goruntuAl(canli.oyun))
  const [duraklatildi, setDuraklatildi] = useState(false)

  const kareSonu = useEffectEvent((olaylar: Olay[]) => {
    if (olaylar.length > 0) {
      setGoruntu(goruntuAl(canli.oyun))
      tepki(olaylar)
    }
    ciz(canli.oyun)
    const bitti = canli.oyun.bitti
    if (bitti) bitince({ puan: canli.oyun.puan, ozet: { ...canli.oyun.ozet }, bitti, tik: canli.oyun.tik })
  })

  useEffect(() => {
    if (duraklatildi) return
    let istek = 0
    let onceki = performance.now()
    let birikim = 0
    const kare = (simdi: number) => {
      const sonuc = adimSayisi(birikim, simdi - onceki)
      onceki = simdi
      birikim = sonuc.birikim
      const olaylar: Olay[] = []
      for (let i = 0; i < sonuc.adim && !canli.oyun.bitti; i++) olaylar.push(...canliAdim(canli))
      kareSonu(olaylar)
      if (!canli.oyun.bitti) istek = requestAnimationFrame(kare)
    }
    istek = requestAnimationFrame(kare)
    return () => cancelAnimationFrame(istek)
  }, [canli, duraklatildi])

  useEffect(() => {
    const gizlenince = () => {
      if (document.hidden) setDuraklatildi(true)
    }
    document.addEventListener('visibilitychange', gizlenince)
    return () => document.removeEventListener('visibilitychange', gizlenince)
  }, [])

  const dokun = (hedef: Hedef) => {
    if (!duraklatildi) canliDokun(canli, hedef)
  }

  return {
    goruntu,
    dokun,
    duraklatildi,
    duraklat: () => setDuraklatildi(true),
    devam: () => setDuraklatildi(false),
  }
}
```

- [ ] **Step 4: Oyun alanı**

`components/oyun/Saha.tsx`:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { AYRAN_TIK, SOGUMA_TIK, TUR_TIK } from '@/lib/oyun/ayar'
import { ipucuHedefi, oyunSaati, sisGorunumu, type Goruntu } from '@/lib/oyun/gosterim'
import { komboCarpani } from '@/lib/oyun/puan'
import type { Hedef, Olay, Oyun, Sonuc, Urun } from '@/lib/oyun/tipler'
import { useOyunDongusu } from './useOyunDongusu'
import stil from './Saha.module.css'

type Props = { dil: Dil; tohum: number; ipucu: boolean; bitince: (sonuc: Sonuc) => void }
type Metin = Sozluk['oyun']
type SeritProps = { goruntu: Goruntu; ad: (u: Urun) => string; dokun: (hedef: Hedef) => void; metin: Metin }

const YUVALAR = [0, 1, 2, 3] as const

function metinYaz(el: HTMLElement, metin: string): void {
  if (el.textContent !== metin) el.textContent = metin
}

function oranYaz(el: HTMLElement, oran: number): void {
  el.style.setProperty('--oran', String(oran))
}

/** Bir çizim öğesinin her karede değişen değeri; `data-ciz` adına göre. */
function ogeyiCiz(el: HTMLElement, oyun: Oyun): void {
  const no = Number(el.dataset.no)
  const sofra = oyun.sofralar[no]
  const sis = oyun.ocak[no]
  const kalem = oyun.tezgah[no]
  switch (el.dataset.ciz) {
    case 'saat':
      return metinYaz(el, oyunSaati(oyun.tik))
    case 'gece':
      return oranYaz(el, oyun.tik / TUR_TIK)
    case 'puan':
      return metinYaz(el, String(oyun.puan))
    case 'kombo':
      return metinYaz(el, `×${komboCarpani(oyun.kombo)}`)
    case 'sabir':
      return oranYaz(el, sofra ? sofra.sabir / sofra.toplamSabir : 0)
    case 'ocak':
      el.dataset.gorunum = sis ? sisGorunumu(sis) : 'bos'
      return oranYaz(el, sis ? sis.gecen / (sis.pisme + sis.pencere) : 0)
    case 'soguma':
      return oranYaz(el, kalem ? 1 - kalem.bekleme / SOGUMA_TIK : 0)
    case 'ayran':
      return oranYaz(el, oyun.ayran === null ? 0 : 1 - oyun.ayran / AYRAN_TIK)
  }
}

/** Animasyonu baştan oynatmak için sınıfı söküp takar. */
function parla(el: HTMLElement | null, sinif: string | undefined): void {
  if (!el || !sinif) return
  el.classList.remove(sinif)
  void el.offsetWidth
  el.classList.add(sinif)
}

function olayaTepki(alan: HTMLElement, olay: Olay): void {
  const hedef = (h: string) => alan.querySelector<HTMLElement>(`[data-hedef="${h}"]`)
  if (olay.tur === 'sisAlindi') parla(hedef(`o${olay.yuva}`), stil[olay.kalite])
  if (olay.tur === 'sisYandi') parla(hedef(`o${olay.yuva}`), stil.yandi)
  if (olay.tur === 'sofraKalkti' && !olay.odedi) parla(hedef(`s${olay.sofra}`), stil.kalkti)
  if (olay.tur === 'fisTamam') {
    const son = alan.querySelector<HTMLElement>('[data-son]')
    if (son) metinYaz(son, `+${olay.odeme}`)
    parla(hedef(`s${olay.sofra}`), stil.odedi)
  }
}

export function Saha({ dil, tohum, ipucu, bitince }: Props) {
  const s = sozluk(dil)
  const ad = (u: Urun): string => (u === 'ayran' ? s.menu.icecekler.urunler.ayran : s.menu.ocakbasi.urunler[u].ad)
  const kok = useRef<HTMLDivElement>(null)
  const [vurgu, setVurgu] = useState<Urun | null>(null)

  const ciz = (oyun: Oyun) => {
    const alan = kok.current
    if (!alan) return
    for (const el of alan.querySelectorAll<HTMLElement>('[data-ciz]')) ogeyiCiz(el, oyun)
    const hedef = ipucu ? ipucuHedefi(oyun) : null
    for (const el of alan.querySelectorAll<HTMLElement>('[data-hedef]')) {
      el.toggleAttribute('data-ipucu', el.dataset.hedef === hedef)
    }
  }
  const tepki = (olaylar: Olay[]) => {
    const alan = kok.current
    if (alan) for (const olay of olaylar) olayaTepki(alan, olay)
  }
  const { goruntu, dokun, duraklatildi, duraklat, devam } = useOyunDongusu({ tohum, ciz, tepki, bitince })

  useEffect(() => {
    if (!vurgu) return
    const zaman = setTimeout(() => setVurgu(null), 700)
    return () => clearTimeout(zaman)
  }, [vurgu])

  const serit = { goruntu, ad, dokun, metin: s.oyun }
  return (
    <div ref={kok} className={stil.saha}>
      <Hud metin={s.oyun} duraklat={duraklat} />
      <Sofralar {...serit} vurgu={vurgu} />
      <Ocak {...serit} />
      <Tezgah {...serit} vurgula={setVurgu} />
      <section className={stil.raf}>
        {goruntu.raf.map((urun) => (
          <button key={urun} type="button" className={stil.rafUrun} data-hedef={urun} onClick={() => dokun(urun)}>
            {ad(urun)}
          </button>
        ))}
      </section>
      {duraklatildi && (
        <div className={stil.perde}>
          <button type="button" className={stil.devam} onClick={devam} autoFocus>
            {s.oyun.devam}
          </button>
        </div>
      )}
    </div>
  )
}

function Hud({ metin, duraklat }: { metin: Metin; duraklat: () => void }) {
  return (
    <header className={stil.hud}>
      <span className={stil.saat} data-ciz="saat">
        21:00
      </span>
      <span className={stil.geceRayi} data-ciz="gece" aria-hidden="true" />
      <span className={stil.puan} aria-label={metin.puan} data-ciz="puan">
        0
      </span>
      <span className={stil.kombo} aria-label={metin.kombo} data-ciz="kombo">
        ×1
      </span>
      <span className={stil.son} data-son aria-hidden="true" />
      <button type="button" className={stil.duraklat} onClick={duraklat}>
        {metin.duraklat}
      </button>
    </header>
  )
}

function Sofralar({ goruntu, ad, dokun, metin, vurgu }: SeritProps & { vurgu: Urun | null }) {
  return (
    <section className={stil.sofralar} aria-label={metin.sofra}>
      {YUVALAR.map((no) => {
        if (no >= goruntu.acikSofra) return <div key={no} className={stil.kapali} />
        const sofra = goruntu.sofralar[no]
        return (
          <button
            key={no}
            type="button"
            className={stil.sofra}
            data-hedef={`s${no}`}
            data-kurulu={sofra?.kurulu ? '' : undefined}
            data-vurgu={sofra && vurgu && sofra.kalan.includes(vurgu) ? '' : undefined}
            aria-label={sofra ? `${metin.sofra} ${no + 1}: ${sofra.kalan.map(ad).join(', ')}` : metin.bosSofra}
            onClick={() => dokun(`s${no}` as Hedef)}
          >
            <span className={stil.fis}>
              {sofra?.kalan.map((u, i) => (
                <span key={i}>{ad(u)}</span>
              ))}
            </span>
            {sofra && <span className={stil.sabir} data-ciz="sabir" data-no={no} aria-hidden="true" />}
          </button>
        )
      })}
      {goruntu.kapida > 0 && (
        <span className={stil.kapida}>
          {metin.kapida} {goruntu.kapida}
        </span>
      )}
    </section>
  )
}

function Ocak({ goruntu, ad, dokun, metin }: SeritProps) {
  return (
    <section className={stil.ocak} aria-label={metin.ocak}>
      {YUVALAR.map((no) => {
        if (no >= goruntu.acikOcak) return <div key={no} className={stil.kapali} />
        const sis = goruntu.ocak[no]
        const ray = sis ? ({ '--centik': sis.centik, '--pencere': sis.pencere } as React.CSSProperties) : undefined
        return (
          <button
            key={no}
            type="button"
            className={stil.yuva}
            data-hedef={`o${no}`}
            data-ciz="ocak"
            data-no={no}
            aria-label={`${metin.ocak} ${no + 1}${sis ? `: ${ad(sis.urun)}` : ''}`}
            style={ray}
            onClick={() => dokun(`o${no}` as Hedef)}
          >
            <span className={stil.yuvaAdi}>{sis ? ad(sis.urun) : ''}</span>
            <span className={stil.ray} aria-hidden="true">
              <span className={stil.rayDolum} />
              {sis && <span className={stil.centik} data-cevirme={sis.cevirme} />}
              {sis && <span className={stil.pencere} />}
            </span>
          </button>
        )
      })}
    </section>
  )
}

function Tezgah({ goruntu, ad, dokun, metin, vurgula }: SeritProps & { vurgula: (u: Urun) => void }) {
  return (
    <section className={stil.tezgah} aria-label={metin.tezgah}>
      {YUVALAR.map((no) => {
        const kalem = goruntu.tezgah[no]
        if (!kalem) return <div key={no} className={stil.tezgahBos} />
        return (
          <button
            key={no}
            type="button"
            className={stil.tezgahKalem}
            data-kalite={kalem.kalite ?? 'ayran'}
            aria-label={`${metin.tezgah}: ${ad(kalem.urun)}`}
            onClick={() => vurgula(kalem.urun)}
          >
            {ad(kalem.urun)}
            {kalem.kalite && <span className={stil.soguma} data-ciz="soguma" data-no={no} aria-hidden="true" />}
          </button>
        )
      })}
      <button
        type="button"
        className={stil.ayran}
        data-hedef="ayran"
        data-ciz="ayran"
        data-durum={goruntu.ayran}
        onClick={() => dokun('ayran')}
      >
        {ad('ayran')}
      </button>
    </section>
  )
}
```

`components/oyun/Saha.module.css`:

```css
/* Kaba prototip (plan 1): gri kutular, yalnız marka token'ları. Görsel dil plan 2'de. */
.saha {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto auto auto;
  gap: 14px;
  min-height: 100dvh;
  max-width: 560px;
  margin: 0 auto;
  padding: 12px;
  color: var(--krem);
  touch-action: manipulation;
  user-select: none;
}

.hud {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto auto;
  align-items: center;
  gap: 10px;
}

.saat,
.puan,
.kombo,
.son {
  font-family: var(--font-baslik);
  font-variant-numeric: tabular-nums;
}

.saat { font-size: 18px; }
.puan { font-size: 20px; }
.kombo { font-size: 15px; color: var(--bakir); }
.son { min-width: 48px; font-size: 13px; color: var(--krem-70); }

/* Yatay ilerleme çubukları: hepsi `--oran` (0-1) ile, yalnız transform. */
.geceRayi,
.sabir,
.soguma,
.ray {
  position: relative;
  display: block;
  height: 4px;
  overflow: hidden;
  background: var(--cizgi);
}

.geceRayi::after,
.sabir::after,
.soguma::after,
.rayDolum {
  content: '';
  position: absolute;
  inset: 0;
  transform-origin: left;
  transform: scaleX(var(--oran, 0));
}

.geceRayi::after { background: var(--bakir); }
.sabir { background: var(--kor-30); }
.sabir::after { background: var(--kor); }
.soguma::after { background: var(--krem-50); }

.sofra,
.yuva,
.tezgahKalem,
.ayran,
.rafUrun,
.duraklat,
.devam {
  position: relative;
  min-height: 56px;
  border: 1px solid var(--cizgi-guclu);
  border-radius: 3px;
  font: 500 14px/1.2 var(--font-govde);
}

.duraklat { min-height: 44px; padding: 0 12px; }

.sofralar,
.ocak,
.raf {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

/* Oyun alanı ekranın altına toplanır: uzun telefonda başparmak sofraya da yetişir. */
.sofralar { align-self: end; }

.raf { grid-template-columns: repeat(3, 1fr); }

.kapali {
  border: 1px dashed var(--cizgi-soluk);
  border-radius: 3px;
}

.sofra {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 84px;
  padding: 6px;
  border-style: dashed;
  text-align: left;
}

.sofra[data-kurulu] {
  border-style: solid;
  border-color: var(--bakir-60);
  background: var(--komur);
}

.sofra[data-vurgu] { border-color: var(--bakir-acik); }

.fis {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12.5px;
}

.kapida {
  position: absolute;
  top: -18px;
  right: 0;
  font-size: 12px;
  color: var(--krem-70);
}

.yuva {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;
  padding: 8px 6px;
  background: var(--komur);
}

.yuvaAdi { font-size: 13px; }

.ray { height: 10px; }
.rayDolum { background: var(--krem-50); }

.centik,
.pencere {
  position: absolute;
  top: 0;
  bottom: 0;
}

.centik {
  left: calc(var(--centik) * 100%);
  width: 3px;
  background: var(--bakir-60);
}

.centik[data-cevirme='iyi'] { background: var(--bakir-acik); }
.centik[data-cevirme='kotu'] { background: var(--krem-50); }

.pencere {
  left: calc(var(--pencere) * 100%);
  right: 0;
  border-left: 1px solid var(--bakir);
  background: var(--bakir-30);
}

.yuva[data-gorunum='centik'] .centik { background: var(--bakir-acik); }
.yuva[data-gorunum='hazir'] { border-color: var(--bakir); }
.yuva[data-gorunum='kivam'] { border-color: var(--bakir-acik); background: var(--plaka-zemin); }

.tezgah {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.tezgahBos {
  min-height: 56px;
  border: 1px dashed var(--cizgi-soluk);
  border-radius: 3px;
}

.tezgahKalem {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px;
  background: var(--komur);
  font-size: 12.5px;
}

.tezgahKalem[data-kalite='tam'] { border-color: var(--bakir-acik); }

.ayran {
  overflow: hidden;
  border-color: var(--bakir-60);
}

.ayran::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 4px;
  background: var(--bakir);
  transform-origin: left;
  transform: scaleX(var(--oran, 0));
}

.ayran[data-durum='bekliyor'] { background: var(--bakir-30); }

.rafUrun {
  background: var(--komur);
  font: 600 16px/1 var(--font-govde);
}

/* Yalnız ilk turda: bir sonraki doğru dokunuş (spec §3). */
.saha [data-ipucu] {
  outline: 3px solid var(--bakir-acik);
  outline-offset: -3px;
}

.perde {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--zemin);
}

.devam { padding: 0 28px; }

/* Dokunuşun karşılığı: kısa bir parlama, yalnız opaklık. */
.tam::before,
.iyi::before,
.yandi::before,
.odedi::before,
.kalkti::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  animation: parla 450ms ease-out forwards;
}

.tam::before { background: var(--bakir-acik); }
.iyi::before { background: var(--bakir-40); }
.odedi::before { background: var(--bakir); }
.yandi::before,
.kalkti::before { background: var(--kor); }

@keyframes parla {
  from { opacity: 0.7; }
  to { opacity: 0; }
}
```

- [ ] **Step 5: Sonuç ekranı ve sayfa gövdesi**

`components/oyun/SonucEkrani.tsx`:

```tsx
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { TUR_TIK } from '@/lib/oyun/ayar'
import { oyunSaati } from '@/lib/oyun/gosterim'
import type { Sonuc } from '@/lib/oyun/tipler'
import stil from './SonucEkrani.module.css'

type Props = { dil: Dil; sonuc: Sonuc; onceki: number | null; yeni: boolean; tekrar: () => void }

export function SonucEkrani({ dil, sonuc, onceki, yeni, tekrar }: Props) {
  const s = sozluk(dil)
  const sayi = (n: number) => n.toLocaleString(dil === 'en' ? 'en-GB' : 'tr-TR')
  const sonTane = s.ana.hero.kilometreTaslari.find((k) => k.saat === oyunSaati(TUR_TIK))
  const satir =
    sonuc.bitti === 'gece' && sonTane
      ? `${sonTane.saat} · ${sonTane.metin}`
      : `${oyunSaati(sonuc.tik)} · ${s.oyun.ucSofraKalkti}`
  const ozet = [
    [sonuc.ozet.sofra, s.oyun.ozet.sofra],
    [sonuc.ozet.sis, s.oyun.ozet.sis],
    [sonuc.ozet.tamKivam, s.oyun.ozet.tamKivam],
    [sonuc.ozet.enUzunKombo, s.oyun.ozet.enUzunKombo],
  ] as const
  const enIyiSatiri = yeni
    ? s.oyun.yeniEnIyi
    : onceki !== null
      ? `${s.oyun.enIyi} ${sayi(onceki)}, ${sayi(onceki - sonuc.puan)} ${s.oyun.kaldi}`
      : null

  return (
    <section className={stil.sonuc} aria-live="polite">
      <p className={stil.satir}>{satir}</p>
      <p className={stil.puan}>{sayi(sonuc.puan)}</p>
      <ul className={stil.ozet}>
        {ozet.map(([deger, etiket]) => (
          <li key={etiket}>
            <span className={stil.deger}>{sayi(deger)}</span> {etiket}
          </li>
        ))}
      </ul>
      {enIyiSatiri && <p className={stil.enIyi}>{enIyiSatiri}</p>}
      <button type="button" className={stil.tekrar} onClick={tekrar} autoFocus>
        {s.oyun.tekrar}
      </button>
    </section>
  )
}
```

`components/oyun/SonucEkrani.module.css`:

```css
.sonuc {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 14px;
  min-height: 100dvh;
  padding: 24px;
  text-align: center;
}

.satir { color: var(--krem-70); }

.puan {
  font: 400 48px/1 var(--font-baslik);
  font-variant-numeric: tabular-nums;
}

.ozet {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 6px 20px;
  list-style: none;
  padding: 0;
  color: var(--krem-70);
}

.deger {
  font-family: var(--font-baslik);
  font-variant-numeric: tabular-nums;
  color: var(--krem);
}

.enIyi { color: var(--bakir); }

.tekrar {
  min-width: 200px;
  min-height: 56px;
  border-radius: 3px;
  background: var(--kor);
  font: 600 18px/1 var(--font-govde);
}
```

`components/oyun/OyunSayfasi.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { enIyiOku, enIyiYaz, ilkTurBitti, ilkTurMu } from '@/lib/oyun/defter'
import type { Sonuc } from '@/lib/oyun/tipler'
import { Saha } from './Saha'
import { SonucEkrani } from './SonucEkrani'
import stil from './OyunSayfasi.module.css'

type Ekran =
  | { ad: 'giris' }
  | { ad: 'oyun'; tohum: number; ipucu: boolean }
  | { ad: 'sonuc'; sonuc: Sonuc; onceki: number | null; yeni: boolean }

/** Prototipte tohum tarayıcıda üretilir; sıralamalı turda sunucudan gelecek (spec §7). */
function yeniTohum(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] ?? 1
}

export function OyunSayfasi({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  const [ekran, setEkran] = useState<Ekran>({ ad: 'giris' })
  const basla = () => setEkran({ ad: 'oyun', tohum: yeniTohum(), ipucu: ilkTurMu() })
  const bitir = (sonuc: Sonuc) => {
    const onceki = enIyiOku()
    const yeni = enIyiYaz(sonuc.puan)
    ilkTurBitti()
    setEkran({ ad: 'sonuc', sonuc, onceki, yeni })
  }

  return (
    <main className={stil.sayfa}>
      {ekran.ad !== 'giris' && <h1 className={stil.gizliBaslik}>{s.oyun.baslik}</h1>}
      {ekran.ad === 'giris' && (
        <section className={stil.giris}>
          <h1 className={stil.baslik}>{s.oyun.baslik}</h1>
          <p className={stil.cumle}>{s.ana.gece.baslik}</p>
          <button type="button" className={stil.oyna} onClick={basla}>
            {s.oyun.oyna}
          </button>
        </section>
      )}
      {ekran.ad === 'oyun' && (
        <Saha key={ekran.tohum} dil={dil} tohum={ekran.tohum} ipucu={ekran.ipucu} bitince={bitir} />
      )}
      {ekran.ad === 'sonuc' && (
        <SonucEkrani dil={dil} sonuc={ekran.sonuc} onceki={ekran.onceki} yeni={ekran.yeni} tekrar={basla} />
      )}
    </main>
  )
}
```

`components/oyun/OyunSayfasi.module.css`:

```css
.sayfa {
  min-height: 100dvh;
  background: var(--zemin);
  color: var(--krem);
}

.giris {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 18px;
  min-height: 100dvh;
  padding: 24px;
  text-align: center;
}

.baslik { font: 400 32px/1.1 var(--font-baslik); }
.cumle { color: var(--krem-70); }

.oyna {
  min-width: 200px;
  min-height: 56px;
  border-radius: 3px;
  background: var(--kor);
  font: 600 18px/1 var(--font-govde);
}

/* Oyun ve sonuç ekranında başlık yalnız ekran okuyucuya; `display:none` onu ağaçtan da siler. */
.gizliBaslik {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

- [ ] **Step 6: Rota**

`app/(tr)/oyun/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { OyunSayfasi } from '@/components/oyun/OyunSayfasi'
import { tr } from '@/content'

// Prototip (plan 1): dizine girmez; sitemap'te, menüde ve çekmecede yok.
export const metadata: Metadata = {
  title: `${tr.oyun.baslik} · ${tr.ortak.marka.ad}`,
  robots: { index: false, follow: false },
}

export default function Sayfa() {
  return <OyunSayfasi dil="tr" />
}
```

- [ ] **Step 7: Typecheck, test, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: typecheck temiz; `ℹ pass 234`, `ℹ fail 0` (build'den önce koşulursa `odak.test.ts`'in iki
derleme testi atlanır, sonra 234/234); build çıktısında `○ /oyun` satırı.

Run: `grep -c oyun out/sitemap.xml; grep -o '<meta name="robots"[^>]*>' out/oyun/index.html`
Expected: `0` ve `<meta name="robots" content="noindex, nofollow"/>`

- [ ] **Step 8: Tarayıcı testleri (Review Focus 4 ve 5, spec §16 axe)**

`out/`'u 8391'de sun (`npx serve out -l 8391` ya da `python3 -m http.server 8391 --directory out`)
ve üç betiği `/tmp/bozo-oyun/` altına yaz. Playwright yolu projenin ölçüm harnesiyle aynı
(bellekteki `olcum-harnesi`); makinede farklıysa `import` satırı ona göre değişir.

`/tmp/bozo-oyun/duman.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const KOK = process.argv[2] ?? 'http://localhost:8392'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
const p = await c.newPage()
const hatalar = []
p.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
p.on('pageerror', (e) => hatalar.push(String(e)))
await p.goto(KOK + '/oyun/')
const reddet = p.getByRole('button', { name: 'Reddet' })
if (await reddet.isVisible().catch(() => false)) await reddet.click()
await p.getByRole('button', { name: 'Oyna' }).click()
const t0 = Date.now()
let ilkServis = null
while (Date.now() - t0 < 25000) {
  const ipucu = p.locator('[data-ipucu]')
  if (await ipucu.count()) await ipucu.first().click().catch(() => {})
  const puan = Number(await p.locator('[data-ciz="puan"]').textContent())
  if (puan > 0) { ilkServis = Date.now() - t0; break }
  await p.waitForTimeout(50)
}
const olcu = await p.evaluate(() => {
  const kucuk = [...document.querySelectorAll('main button')].map((b) => b.getBoundingClientRect())
    .filter((r) => r.width > 0 && (r.width < 44 || r.height < 44)).map((r) => `${Math.round(r.width)}x${Math.round(r.height)}`)
  return { tasma: document.documentElement.scrollWidth, kucuk }
})
console.log('ilk servis ms', ilkServis, 'yatay genişlik', olcu.tasma, '44 altı düğme', JSON.stringify(olcu.kucuk))
await p.getByRole('button', { name: 'Tekrar Oyna' }).waitFor({ timeout: 150000 })
console.log('sonuç:', (await p.locator('main').innerText()).replace(/\n+/g, ' | '))
console.log('konsol hataları', JSON.stringify(hatalar))
await b.close()
```

`/tmp/bozo-oyun/depolamasiz.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const KOK = process.argv[2] ?? 'http://localhost:8392'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
await c.addInitScript(() => {
  Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('kapalı', 'SecurityError') } })
})
const p = await c.newPage()
const hatalar = []
p.on('pageerror', (e) => hatalar.push(String(e)))
await p.goto(KOK + '/oyun/')
await p.getByRole('button', { name: 'Oyna' }).click()
await p.locator('[data-ipucu]').first().waitFor({ timeout: 5000 })
await p.getByRole('button', { name: 'Tekrar Oyna' }).waitFor({ timeout: 150000 })
console.log('depolama kapalı: ipucu çıktı, sonuç ekranı geldi, sayfa hataları', JSON.stringify(hatalar))
await b.close()
```

`/tmp/bozo-oyun/erisim.mjs` (spec §16: axe 0 ihlal, taşma yok; harnesteki axe-core 4.13 ve etiketler):

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const AXE = '/Users/mk/.npm/_npx/1fc4933a57a44b8f/node_modules/axe-core/axe.min.js'
const KOK = process.argv[2] ?? 'http://localhost:8392'
const ETIKETLER = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
const b = await chromium.launch()
for (const genislik of [390, 1440]) {
  const c = await b.newContext({ viewport: { width: genislik, height: 844 }, reducedMotion: 'reduce' })
  await c.addInitScript(() => localStorage.setItem('bozo-cerez-onayi', 'ret'))
  const p = await c.newPage()
  await p.goto(KOK + '/oyun/')
  const denetle = async (an) => {
    await p.addScriptTag({ path: AXE })
    const r = await p.evaluate(async (e) => (await window.axe.run(document, { runOnly: { type: 'tag', values: e } })).violations, ETIKETLER)
    const tasma = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    console.log(genislik, an, 'ihlal', r.length, JSON.stringify(r.map((v) => `${v.id}:${v.nodes.length}`)), 'taşma', tasma)
  }
  await denetle('giris')
  await p.getByRole('button', { name: 'Oyna' }).click()
  await p.waitForTimeout(3000)
  await denetle('oyun')
  await c.close()
}
await b.close()
```

Run:
```bash
node /tmp/bozo-oyun/duman.mjs http://localhost:8391
node /tmp/bozo-oyun/depolamasiz.mjs http://localhost:8391
node /tmp/bozo-oyun/erisim.mjs http://localhost:8391
```
Expected (ön doğrulamada ölçülen):
```
ilk servis ms 6140 yatay genişlik 320 44 altı düğme []
sonuç: Sofra Yetiştir | 23:28 · üç sofra kalktı | -250 | 1 sofra | 1 şiş | 1 tam kıvam | 1 en uzun kombo | Tekrar Oyna
konsol hataları []
depolama kapalı: ipucu çıktı, sonuç ekranı geldi, sayfa hataları []
390 giris ihlal 0 [] taşma false
390 oyun ihlal 0 [] taşma false
1440 giris ihlal 0 [] taşma false
1440 oyun ihlal 0 [] taşma false
```
İlk servis süresi ve bitiş saati makineye göre birkaç yüz ms oynar; ölçüt ilk servisin 12 sn
altında olması, taşma ve küçük düğme listelerinin, hata ve ihlal listelerinin boş olması.

- [ ] **Step 9: Elle deneme**

`npm run dev`, telefonda ya da 390 px emülasyonda `/oyun/`:
1. İlk turda ipucu halkası sırayla sofra, Ciğer, ocak (çentikte), ocak (tam kıvamda), sofra üstünde.
2. Duraklat oyun alanını kapatır; sekmeyi değiştirip dönünce oyun duraklamış bekler, ileri sarmaz.
3. İkinci turda ipucu çıkmaz; sonuç ekranında "En iyin ..., ... kaldı" ya da "Yeni en iyi" görünür.
4. Hareket azaltma açıkken parlamalar görünmez, oyun aynı oynanır.

- [ ] **Step 10: DEVAM.md**

`docs/surec/DEVAM.md` > "## Durum" listesinin ilk maddesi olarak:

```markdown
- **Açılış oyunu, plan 1 bitti: oynanabilir prototip `/oyun/`** (spec
  `docs/specs/2026-10-08-oyun-design.md`, plan `docs/plans/2026-10-08-oyun-plan-1-prototip.md`).
  Gri kutular, sunucusuz, noindex, menüde yok; **yayında değil**. Sırada kaba prototip testi
  (spec §16: mekanda 5-10 misafir) ve plan 2 (görsel dil, animasyon, Motion). Sahibine açık
  kararlar spec §19'da.
```

- [ ] **Step 11: Commit**

```bash
git add content/tr/oyun.ts content/en/oyun.ts content/tr/index.ts content/en/index.ts \
  lib/oyun/defter.ts components/oyun 'app/(tr)/oyun' docs/surec/DEVAM.md
git commit -m "Add the playable greybox prototype at /oyun"
```

---

## Kapsam dışı (sonraki planlar)

- **Plan 2, görsel dil ve his:** SVG varlıklar, kor halkası, `KorSahnesi` + `CamPanel`, spec §12
  animasyon tablosu (Motion ekran geçişleri, WAAPI anlık tepkiler), ses, hareket azaltma tablosu;
  spec §15'in kalanı: canlı bölge duyuruları, ok tuşlarıyla şerit içi gezinme, 1-4 sofra ve 5-8
  ocak kısayolları (bu planda klavyeyle oyun Tab ve Enter/Boşluk ile oynanır).
- **Plan 3, skor sunucusu:** `sunucu/`, MariaDB, jeton, `simule` ile yeniden oynatma, tavan hesabı,
  dönem kapanışı, "önce oyna, sonra kaydet", sıralama ekranı.
- **Plan 4, paylaşım ve yayın:** paylaşım kartı, kurallar sayfası, gizlilik değişiklikleri, EN
  rotası, `RotaAnahtari`/sitemap kaydı, alt alan adı ve deploy.

