# Sade Oyun Modu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the six-verb game with the two-tap mode (tap the rack, tap the ready skewer), add the guided first round on the game screen and the optional nickname field on the entry screen.

**Architecture:** The simulation keeps its integer, tick-based, deterministic shape (`ilerle`, `simule`, same signatures); only the rules inside shrink: targets become `o0-o3` and the three rack products, a ready skewer is served automatically to the guest with the least patience left, no event lowers the score. The guide is a pure state machine in `lib/oyun/rehber.ts` driven by sim events; the React overlay only measures and draws. The nickname flows through the existing account and submit code via one pure decision function.

**Tech Stack:** TypeScript (strict, Node 24 type stripping for tests), `node:test`, React 19 / Next 16 static export, CSS Modules, Web Animations API, `motion` (screen transitions only).

**Spec:** `docs/specs/2026-10-09-oyun-sade-design.md` (supersedes §3, §5, §6-§7, §12 of `docs/specs/2026-10-08-oyun-design.md`; server, ranking, prize, privacy and visual language stay).

## Global Constraints

- Commit at the end of each task. Message: imperative mood, English, first line under 72 characters. **No assistant trailer of any kind** (no `Co-Authored-By`, no `Claude-Session`, no "Generated with" line): owner's decision 12 Aug 2026 in `CLAUDE.md` overrides the harness default.
- No em dash (U+2014) as punctuation in any copy or comment, no circumflex accents, no all-caps sentences, exclamation marks rare. Locked words: misafir (never müşteri), ocak/kor (never mangal), şiş, sofra.
- Title Case only for product names, section labels and CTA/nav labels; guide sentences are sentence case. Every guide sentence is at most 6 words (spec §3).
- Turkish identifiers stay ASCII; domain names Turkish, scaffolding English. Imports go through `@/*` in `components/`; `lib/oyun/*` uses relative `.ts` imports (they run under bare Node).
- Comments are one or two lines and record something the code cannot say. No dead code: every unused function, type, event, dictionary key, CSS class and file is deleted in the task that orphans it.
- `tsconfig` has `noUnusedLocals`/`noUnusedParameters`: one stray import fails `npm run typecheck`.
- No palette colour as a literal in a CSS module (`styles/palet.test.ts`); keyframes live inside the module that uses them (`styles/animasyon.test.ts`).
- `prefers-reduced-motion`: WAAPI, canvas and Motion do not read the global CSS rule; every new non-CSS animation reads `useHareketAzaltilmisMi()` itself.
- Touch targets at least 44 px. Contrast AA.
- Score is never negative; no event lowers `oyun.puan` (spec §2).
- Intermediate state: Tasks 1-5 change types that `components/` still uses. Per-file `node --test <file>` is the check until Task 6 finishes; `npm run typecheck` is expected to be red in `components/` between Task 1 and Task 6 and must be green at the end of Task 6. Commits are still made per task.

## Review Focus

Inputs and conditions the spec implies but no single task's feature tests cover; each has a pinned test in the named task.

1. Idle player (`hareketsiz`): ends the night paying zero tables and scoring at most `PUAN.geceTamam`; the spec's "ends within 0:40" is arithmetically impossible (first guest never runs out, second has doubled patience, both occupy the only two evre-1 tables), so Task 3 pins "zero tables paid, score at most 1000" instead and flags it to the owner.
2. Tapping a skewer nobody wants: wasted, combo reset, no points lost, slot freed (Task 2).
3. Tapping a cooking skewer: no effect, no penalty, a wobble event only (Task 2).
4. Two guests want the same product with equal patience: the left table is served; a paid guest still sitting is never served (Task 2).
5. Replay equality: a record produced by a bot, replayed by `simule`, equals the live result (existing `simule_ayniTohumVeGirdi` test, kept) and an old-style record containing `s0` or `ayran` is rejected as `RangeError` (Task 2).
6. Guide against the wrong tap: during every guided step a tap on any other target does nothing and records nothing (Task 4 pure test, Task 7 headless).
7. Guide under tab-hide and pause: the sim clock and the guide step survive a pause and resume unchanged (Task 7 headless).
8. Nickname that fails the server (banned name, network): the result screen falls back to the existing "Bu Skoru Sıralamaya Yaz" button, never a dead end (Task 8).
9. Server unreachable on the entry screen: no name field, offline result line (Task 8 headless).
10. Remembered account plus a different typed name: a new account is registered for the typed name; the same name reuses the account (Task 8 pure test).

## File Structure

| File | Change |
|---|---|
| `lib/oyun/tipler.ts` | Rewrite: no ayran, tezgah, kurulu, cevirme; add `sabirCarpani`, events `sisErken`, `sisBosa`, `yuva` on `servis` |
| `lib/oyun/ayar.ts` | Drop tezgah/ayran/sogutma constants and negative `PUAN` entries; retune table, budget, first guests |
| `lib/oyun/durum.ts` | `yeniOyun` without tezgah/ayran; add `eksikUrunler` |
| `lib/oyun/puan.ts` | Delete `komboDusur` |
| `lib/oyun/sofra.ts` | Seating without setup, `enSabirsiz`, `servisVer`, patience without penalty |
| `lib/oyun/ocak.ts` | Rack, take-and-auto-serve, burn without penalty |
| `lib/oyun/motor.ts` | Targets `o0-o3` + products |
| `lib/oyun/gece.ts` | Carry `sabirCarpani` |
| `lib/oyun/deneme.ts` | Bots: `usta`, `duzenli`, `rastgele`, `hareketsiz` |
| `lib/oyun/gosterim.ts`, `gorsel.ts`, `ses.ts`, `duyuru.ts`, `klavye.ts` | Follow the new model |
| `lib/oyun/rehber.ts` (+test) | New: guided-round state machine |
| `lib/oyun/giris.ts` (+test) | New: submit decision for the nickname flow |
| `lib/oyun/tavan.ts`, `sunucu/*` fixtures | New rule set |
| `components/oyun/SeritlerTezgah.tsx`, `SahneTezgah.tsx`, `SahneTezgah.module.css` | Renamed to `SeritlerRaf.tsx`, `SahneRaf.tsx`, `SahneRaf.module.css`, shrunk to the rack |
| `components/oyun/Seritler.tsx`, `Saha.tsx`, `ciz.ts`, `tepkiler.ts`, `Semboller.tsx`, `*.module.css` | Strips, reactions, symbols |
| `components/oyun/Rehber.tsx` + `Rehber.module.css`, `useRehber.ts` | New: guide overlay and hook |
| `components/oyun/useOyunDongusu.ts`, `useOyunAlani.ts`, `useOyunAkisi.ts`, `GirisEkrani.tsx`, `GirisTablosu.tsx`, `OyunSayfasi.tsx` | Guide pause hook, nickname flow |
| `content/tr/oyun.ts`, `content/en/oyun.ts` | Remove tezgah/kurulu/sogudu, add rehber/giris/sisBosa |

Ordering note: the file `lib/oyun/deneme.ts` has two halves (hand-built scenes, bots). Task 1 touches the scene half only; the bot half is rewritten in Task 3 and is not called before then (Node strips types and does not run the dead branches).

---

### Task 1: Types, tuning table, night generator, `eksikUrunler`

**Files:**
- Modify: `lib/oyun/tipler.ts`, `lib/oyun/ayar.ts`, `lib/oyun/durum.ts`, `lib/oyun/puan.ts`, `lib/oyun/gece.ts`, `lib/oyun/deneme.ts` (the `sahne` helper only)
- Test: `lib/oyun/gece.test.ts`, `lib/oyun/puan.test.ts`, `lib/oyun/durum.test.ts` (new)

**Interfaces:**
- Produces: `Urun = 'ciger' | 'dalak' | 'yurek'` (the old `SisUrun` is deleted, rename every use); `Hedef = 'o0'|'o1'|'o2'|'o3'|Urun`; `Misafir.sabirCarpani: number`; `Sofra` without `kurulu`; `OcakSisi` without `cevirme`; `Oyun` without `tezgah`/`ayran`; events listed in the file below; `eksikUrunler(oyun: Oyun): Urun[]` from `durum.ts`.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/durum.test.ts` (new):

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { eksikUrunler } from './durum.ts'
import { bekle, dokun, sahne } from './deneme.ts'

test('eksikUrunler_ocaktakiDusulur_odemisMisafirSayilmaz', () => {
  const oyun = sahne([['ciger', 'ciger', 'dalak']])
  bekle(oyun, 1)
  assert.deepEqual(eksikUrunler(oyun), ['ciger', 'ciger', 'dalak'])
  dokun(oyun, 'ciger')
  assert.deepEqual(eksikUrunler(oyun), ['ciger', 'dalak'])
  const sofra = oyun.sofralar[0]
  assert.ok(sofra)
  sofra.kalkis = 10
  assert.deepEqual(eksikUrunler(oyun), [])
})
```

`lib/oyun/gece.test.ts`: replace the first-two-guests test and add a ticket-size test.

```ts
test('gece_ilkIkiMisafir_tohumdanBagimsizVeYonlendirmeli', () => {
  for (const tohum of [1, 99, 123456]) {
    const [ilk, ikinci] = geceKur(tohum)
    assert.deepEqual(ilk, { no: 0, gelis: 60, fis: ['ciger'], karisik: false, tukenmez: true, sabirCarpani: 1 })
    assert.deepEqual(ikinci, {
      no: 1, gelis: 540, fis: ['ciger', 'ciger'], karisik: false, tukenmez: false, sabirCarpani: 2,
    })
  }
})

test('gece_herFis_birIleUcKalem_uzunSabirYalnizIkinciMisafirde', () => {
  for (const tohum of TOHUMLAR) {
    const gece = geceKur(tohum)
    for (const m of gece) assert.ok(m.fis.length >= 1 && m.fis.length <= 3, `tohum ${tohum}, misafir ${m.no}`)
    assert.deepEqual(gece.filter((m) => m.sabirCarpani !== 1).map((m) => m.no), [1])
  }
})
```

`lib/oyun/puan.test.ts`: remove the `komboDusur` import and its test (the function is deleted in Step 3).

- [ ] **Step 2: Run to verify they fail**

Run: `node --test lib/oyun/gece.test.ts lib/oyun/durum.test.ts lib/oyun/puan.test.ts`
Expected: FAIL (`eksikUrunler` not exported; `sabirCarpani` missing).

- [ ] **Step 3: Implement**

Replace `lib/oyun/tipler.ts` with:

```ts
export type Urun = 'ciger' | 'dalak' | 'yurek'
export type Kalite = 'tam' | 'iyi'

/** Simülasyonun tanıdığı dokunma hedefleri: ocak yuvası 0-3 ve raf (spec sade §2). */
export type Hedef = `o${0 | 1 | 2 | 3}` | Urun

/** Kayıttaki tek dokunuş: hangi tikte, neye. JSON'da kısa kalsın diye demet. */
export type Girdi = readonly [tik: number, hedef: Hedef]

export type Misafir = {
  no: number
  gelis: number
  fis: readonly Urun[]
  karisik: boolean
  /** Yalnız gecenin ilk misafiri: sabrı tükenmez, ilk fiş kaybedilemez. */
  tukenmez: boolean
  /** Evre sabrının katı; yalnız ikinci misafir 2 (spec sade §2). */
  sabirCarpani: number
}

export type Sofra = {
  misafir: Misafir
  kalan: Urun[]
  /** Servis edilmiş kalemlerin puanı; fiş tamamlanınca çarpanla ödenir. */
  birikim: number
  sabir: number
  toplamSabir: number
  /** Ödedikten sonra kalkmasına kalan tik; ödemeden önce null. */
  kalkis: number | null
}

export type OcakSisi = { urun: Urun; gecen: number; pisme: number; pencere: number; bant: number }

export type Bitis = 'gece' | 'ucSofra'

export type Ozet = { sofra: number; sis: number; tamKivam: number; enUzunKombo: number; kalkan: number }

export type Olay =
  | { tur: 'sofraGeldi'; sofra: number }
  | { tur: 'servis'; sofra: number; yuva: number; urun: Urun; kalite: Kalite }
  | { tur: 'fisTamam'; sofra: number; odeme: number }
  | { tur: 'sofraKalkti'; sofra: number; odedi: boolean }
  | { tur: 'sisKondu'; yuva: number; urun: Urun }
  | { tur: 'sisErken'; yuva: number }
  | { tur: 'sisAlindi'; yuva: number; kalite: Kalite }
  | { tur: 'sisBosa'; yuva: number }
  | { tur: 'sisYandi'; yuva: number }
  | { tur: 'porsiyon' }
  | { tur: 'rafDolu'; urun: Urun }
  | { tur: 'evre'; evre: number }
  | { tur: 'bitti'; sebep: Bitis }

export type Oyun = {
  tik: number
  evre: number
  puan: number
  sofralar: (Sofra | null)[]
  ocak: (OcakSisi | null)[]
  kuyruk: Misafir[]
  gelecek: Misafir[]
  kombo: number
  porsiyonDizisi: number
  ozet: Ozet
  bitti: Bitis | null
}

export type Sonuc = { puan: number; ozet: Ozet; bitti: Bitis; tik: number }
```

Then rename the remaining `SisUrun` uses to `Urun` (`sed -i '' 's/\bSisUrun\b/Urun/g'` on `lib/oyun/*.ts` and `components/oyun/*.tsx`, then merge any duplicate `Urun` imports by hand).

`lib/oyun/ayar.ts`: apply these edits (everything not listed stays).

```ts
// imports
import type { Urun } from './tipler.ts'

// TABLO: windows widened ~50%, patience lengthened (no setup step any more). Starting values;
// Task 3 tunes only these numbers against the bot gates.
const TABLO = [
  [0, 900, 2, 3, 240, 180, 40, 2400, 1],
  [900, 2700, 2, 3, 210, 162, 36, 1800, 1],
  [2700, 4500, 3, 4, 180, 144, 32, 1440, 1],
  [4500, 6300, 4, 4, 156, 126, 28, 1200, 1],
  [6300, 7200, 4, 4, 132, 108, 24, 1020, 2],
] as const
```

Delete `TEZGAH_YUVASI`, `SOGUMA_TIK`, `AYRAN_TIK`, `KURMA_IADESI_YUZDE`. Replace the product tables and `PUAN`:

```ts
export const PISME_YUZDESI: Record<Urun, number> = { ciger: 100, dalak: 75, yurek: 125 }
/** Ürünün rafta belirdiği evre (sıfırdan). */
export const ACILDIGI_EVRE: Record<Urun, number> = { ciger: 0, dalak: 1, yurek: 2 }

export const KALKIS_TIK = 30
export const KAYIP_SINIRI = 3

/** Hiçbir olay puanı düşürmez (spec sade §2): yalnız kazanç kalemleri kalır. */
export const PUAN = { tamKivam: 150, iyi: 100, sabirBonusu: 200, porsiyon: 500, geceTamam: 1000 } as const
```

Budget and first guests (ayran removed; counts keep every `fisBoylari` sum equal to `urunler` length):

```ts
export const BUTCE: readonly EvreButcesi[] = [
  { aralik: 420, fisBoylari: [2, 2, 2, 1], urunler: kalemler({ ciger: 5, dalak: 2 }), karisik: null },
  { aralik: 300, fisBoylari: [3, 3, 3, 2, 2, 2], urunler: kalemler({ ciger: 7, dalak: 5, yurek: 3 }), karisik: null },
  { aralik: 225, fisBoylari: [3, 3, 3, 3, 2, 2, 2], urunler: kalemler({ ciger: 9, dalak: 5, yurek: 4 }), karisik: [] },
  { aralik: 140, fisBoylari: [3, 3, 3], urunler: kalemler({ ciger: 5, dalak: 2, yurek: 2 }), karisik: [] },
]

/** Gecenin yönlendirmeli ilk iki misafiri; tohumdan bağımsız. */
export const ILK_MISAFIRLER = [
  { gelis: 60, fis: ['ciger'], tukenmez: true, sabirCarpani: 1 },
  { gelis: 540, fis: ['ciger', 'ciger'], tukenmez: false, sabirCarpani: 2 },
] as const satisfies readonly {
  gelis: number
  fis: readonly Urun[]
  tukenmez: boolean
  sabirCarpani: number
}[]
```

Update the `ACILDIGI_EVRE` doc and the TABLO comment so they no longer mention plan 1 or ayran.

`lib/oyun/durum.ts`: remove `TEZGAH_YUVASI` from the import, drop `tezgah` and `ayran` from `yeniOyun`, and add:

```ts
/** Oturan misafirlerin istediği, ocakta pişmeyenler: rafta parlayacak ve botun koyacağı ürünler. */
export function eksikUrunler(oyun: Oyun): Urun[] {
  const istenen = oyun.sofralar.flatMap((s) => (s && s.kalkis === null ? s.kalan : []))
  for (const sis of oyun.ocak) {
    const i = sis ? istenen.indexOf(sis.urun) : -1
    if (i !== -1) istenen.splice(i, 1)
  }
  return istenen
}
```

(import `Urun` from `./tipler.ts`.)

`lib/oyun/puan.ts`: delete `komboDusur`.

`lib/oyun/gece.ts`: `KARISIK: readonly Urun[]` unchanged; in `geceKur` set `sabirCarpani: m.sabirCarpani` on the first two and `sabirCarpani: 1` on the rest.

`lib/oyun/deneme.ts` `sahne`: add `sabirCarpani: 1` to the guest object literal.

- [ ] **Step 4: Run to verify they pass**

Run: `node --test lib/oyun/gece.test.ts lib/oyun/durum.test.ts lib/oyun/puan.test.ts lib/oyun/rastgele.test.ts lib/oyun/takmaAd.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/oyun docs/plans/2026-10-09-oyun-sade-plani.md
git commit -m "Reshape the game model for the two-tap mode"
```

---

### Task 2: Rules: rack, take-and-serve, patience, engine

**Files:**
- Modify: `lib/oyun/sofra.ts`, `lib/oyun/ocak.ts`, `lib/oyun/motor.ts`
- Test: `lib/oyun/ocak.test.ts` (rewrite), `lib/oyun/sofra.test.ts` (rewrite), `lib/oyun/servis.test.ts` (delete), `lib/oyun/motor.test.ts` (the validity tests only; goldens are Task 3)

**Interfaces:**
- Consumes: Task 1 types, `eksikUrunler`, `komboCarpani`, `sabirBonusu`.
- Produces: `rafaDokun(oyun, urun: Urun, olaylar)`, `ocagaDokun(oyun, yuva: number, olaylar)`, `enSabirsiz(oyun, urun): number` (table index or -1), `servisVer(oyun, no, yuva, urun, kalite, olaylar)`, `ilerle(oyun, hedefler)` and `simule(tohum, girdiler)` with unchanged signatures.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/ocak.test.ts` (replace the file):

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EVRELER, PISME_YUZDESI } from './ayar.ts'
import { bekle, dokun, evreyeGec, sahne } from './deneme.ts'

const E0 = EVRELER[0]!
const PISME = E0.cigerPisme
const PENCERE = E0.almaPenceresi

test('raf_sisIlkBosOcakYuvasinaIner_sureleriEvredenSabitlenir', () => {
  const oyun = sahne([])
  const olaylar = dokun(oyun, 'ciger')
  assert.deepEqual(oyun.ocak[0], { urun: 'ciger', gecen: 1, pisme: PISME, pencere: PENCERE, bant: E0.tamKivamBandi })
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
  const ayar = EVRELER[2]!
  const beklenen = (u: 'ciger' | 'dalak' | 'yurek') => Math.floor((ayar.cigerPisme * PISME_YUZDESI[u] + 50) / 100)
  assert.deepEqual(
    oyun.ocak.map((s) => s?.pisme ?? null),
    [beklenen('ciger'), beklenen('dalak'), beklenen('yurek'), null],
  )
})

test('raf_acikOcakYuvasiDoluysa_rafDoluOlayi', () => {
  const oyun = sahne([])
  dokun(oyun, 'ciger', 'ciger', 'ciger')
  assert.deepEqual(dokun(oyun, 'ciger'), [{ tur: 'rafDolu', urun: 'ciger' }])
  assert.equal(oyun.ocak[3], null)
})

test('ocak_pisenSiseDokunmak_etkisiz_yalnizSisErkenOlayi', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  dokun(oyun, 'ciger')
  bekle(oyun, 10)
  const puan = oyun.puan
  assert.deepEqual(dokun(oyun, 'o0'), [{ tur: 'sisErken', yuva: 0 }])
  assert.ok(oyun.ocak[0])
  assert.equal(oyun.puan, puan)
})

/** Şiş `gecen` değerini verilen sayıya getirir (rafa dokunuş `gecen = 1` bırakır). */
function sisiHazirla(oyun: ReturnType<typeof sahne>, gecen: number): void {
  dokun(oyun, 'ciger')
  bekle(oyun, gecen - 1)
  assert.equal(oyun.ocak[0]?.gecen, gecen)
}

test('ocak_pencereninOrtasinda_tamKivam_isteyenMisafireKendiligindenGider', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  sisiHazirla(oyun, PISME + PENCERE / 2)
  const olaylar = dokun(oyun, 'o0')
  assert.deepEqual(olaylar.map((o) => o.tur), ['sisAlindi', 'servis', 'fisTamam'])
  assert.deepEqual(olaylar[0], { tur: 'sisAlindi', yuva: 0, kalite: 'tam' })
  assert.deepEqual(olaylar[1], { tur: 'servis', sofra: 0, yuva: 0, urun: 'ciger', kalite: 'tam' })
  assert.equal(oyun.ocak[0], null)
  assert.deepEqual(oyun.ozet, { sofra: 1, sis: 1, tamKivam: 1, enUzunKombo: 1, kalkan: 0 })
  const odeme = olaylar[2]
  assert.ok(odeme?.tur === 'fisTamam' && odeme.odeme === oyun.puan && oyun.puan > 150)
})

test('ocak_pencereninKenarinda_iyiKalite', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  sisiHazirla(oyun, PISME)
  const olaylar = dokun(oyun, 'o0')
  assert.deepEqual(olaylar[0], { tur: 'sisAlindi', yuva: 0, kalite: 'iyi' })
  assert.equal(oyun.ozet.tamKivam, 0)
  assert.equal(oyun.ozet.sis, 1)
})

test('ocak_kimseIstemiyorsa_sisBosaGider_komboSifirlanir_puanDusmez', () => {
  const oyun = sahne([['dalak']])
  bekle(oyun, 1)
  oyun.kombo = 4
  oyun.puan = 700
  sisiHazirla(oyun, PISME + PENCERE / 2)
  const olaylar = dokun(oyun, 'o0')
  assert.deepEqual(olaylar.map((o) => o.tur), ['sisAlindi', 'sisBosa'])
  assert.equal(oyun.kombo, 0)
  assert.equal(oyun.puan, 700)
  assert.equal(oyun.ocak[0], null)
  assert.deepEqual(oyun.sofralar[0]?.kalan, ['dalak'])
})

test('ocak_pencereGecinceSisYanar_komboSifirlanir_puanDusmez', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  oyun.kombo = 5
  oyun.puan = 700
  dokun(oyun, 'ciger')
  const olaylar = bekle(oyun, PISME + PENCERE)
  assert.ok(olaylar.some((o) => o.tur === 'sisYandi'))
  assert.equal(oyun.kombo, 0)
  assert.equal(oyun.puan, 700)
  assert.equal(oyun.ocak[0], null)
})

test('ocak_ikiMisafirAyniUrunu_isteyince_sabriEnAzOlanAlir', () => {
  const oyun = sahne([['ciger'], ['ciger']])
  bekle(oyun, 1)
  const ikinci = oyun.sofralar[1]
  assert.ok(ikinci)
  ikinci.sabir -= 10
  sisiHazirla(oyun, PISME + PENCERE / 2)
  const servis = dokun(oyun, 'o0').find((o) => o.tur === 'servis')
  assert.equal(servis?.tur === 'servis' && servis.sofra, 1)
})

test('ocak_sabirEsitse_soldakiAlir_odemisMisafirAlmaz', () => {
  const oyun = sahne([['ciger'], ['ciger']])
  bekle(oyun, 1)
  sisiHazirla(oyun, PISME + PENCERE / 2)
  const servis = dokun(oyun, 'o0').find((o) => o.tur === 'servis')
  assert.equal(servis?.tur === 'servis' && servis.sofra, 0)
  const sofra0 = oyun.sofralar[0]
  assert.ok(sofra0)
  sofra0.kalkis = 10
  sofra0.kalan = ['ciger']
  dokun(oyun, 'ciger')
  bekle(oyun, PISME + PENCERE / 2 - 1)
  const ikinci = dokun(oyun, 'o0').find((o) => o.tur === 'servis')
  assert.equal(ikinci?.tur === 'servis' && ikinci.sofra, 1)
})
```

`lib/oyun/sofra.test.ts` (replace the file):

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EVRELER, KALKIS_TIK, PORSIYON_SIS } from './ayar.ts'
import { bekle, dokun, sahne } from './deneme.ts'
import { sabirBonusu } from './puan.ts'

const E0 = EVRELER[0]!
const PISME = E0.cigerPisme
const MERKEZ = PISME + E0.almaPenceresi / 2

/** İlk yuvadaki şişi pencerenin ortasına getirip alır; olayları döner. */
function ortadaAl(oyun: ReturnType<typeof sahne>) {
  dokun(oyun, 'ciger')
  bekle(oyun, MERKEZ - 1)
  return dokun(oyun, 'o0')
}

test('sofra_kuyruktakiMisafir_acikSofralarinEnKucukBosunaOturur', () => {
  const oyun = sahne([['ciger'], ['ciger'], ['ciger']])
  const olaylar = bekle(oyun, 1)
  assert.deepEqual(olaylar, [{ tur: 'sofraGeldi', sofra: 0 }, { tur: 'sofraGeldi', sofra: 1 }])
  assert.equal(oyun.kuyruk.length, 1)
})

test('sofra_sabirHerTikBirAzalir_tukenmezAzalmaz', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  const sofra = oyun.sofralar[0]
  assert.ok(sofra)
  const toplam = sofra.toplamSabir
  assert.equal(toplam, E0.sabir)
  bekle(oyun, 5)
  assert.equal(sofra.sabir, toplam - 5)
  const tuken = sahne([['ciger']], true)
  bekle(tuken, 6)
  assert.equal(tuken.sofralar[0]?.sabir, toplam)
})

test('sofra_sabirCarpani_toplamSabriCarpar', () => {
  const oyun = sahne([['ciger']])
  const misafir = oyun.gelecek[0]
  assert.ok(misafir)
  misafir.sabirCarpani = 2
  bekle(oyun, 1)
  assert.equal(oyun.sofralar[0]?.toplamSabir, 2 * E0.sabir)
})

test('sofra_sabirBitince_misafirKalkar_puanDusmez_komboSifirlanir', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  oyun.puan = 500
  oyun.kombo = 4
  const sofra = oyun.sofralar[0]
  assert.ok(sofra)
  sofra.sabir = 1
  const olaylar = bekle(oyun, 1)
  assert.deepEqual(olaylar, [{ tur: 'sofraKalkti', sofra: 0, odedi: false }])
  assert.equal(oyun.puan, 500)
  assert.equal(oyun.kombo, 0)
  assert.equal(oyun.ozet.kalkan, 1)
  assert.equal(oyun.sofralar[0], null)
})

test('sofra_ucuncuKalkis_geceyiBitirir', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  oyun.ozet.kalkan = 2
  const sofra = oyun.sofralar[0]
  assert.ok(sofra)
  sofra.sabir = 1
  const olaylar = bekle(oyun, 1)
  assert.deepEqual(olaylar.at(-1), { tur: 'bitti', sebep: 'ucSofra' })
  assert.equal(oyun.bitti, 'ucSofra')
})

test('sofra_odeyenSofra_otuzTikSonraKalkar', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  ortadaAl(oyun)
  assert.equal(KALKIS_TIK, 30)
  assert.deepEqual(bekle(oyun, KALKIS_TIK - 2), [])
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'sofraKalkti', sofra: 0, odedi: true }])
})

test('sofra_fisOdemesi_komboCarpaniylaCarpilir', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  oyun.kombo = 3
  dokun(oyun, 'ciger')
  bekle(oyun, MERKEZ - 1)
  const sofra = oyun.sofralar[0]
  assert.ok(sofra)
  const bonus = sabirBonusu(sofra.sabir, sofra.toplamSabir)
  const odeme = dokun(oyun, 'o0').find((o) => o.tur === 'fisTamam')
  assert.equal(odeme?.tur === 'fisTamam' && odeme.odeme, (150 + bonus) * 2)
  assert.equal(oyun.kombo, 4)
})

test('sofra_onIkinciArdisikTamKivam_porsiyonRozetiVerir', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  oyun.porsiyonDizisi = PORSIYON_SIS - 1
  const olaylar = ortadaAl(oyun)
  assert.ok(olaylar.some((o) => o.tur === 'porsiyon'))
  assert.ok(oyun.puan >= 500 + 150)
  assert.equal(oyun.porsiyonDizisi, 0)
})

test('sofra_iyiKalite_porsiyonDizisiniBozar', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  oyun.porsiyonDizisi = 5
  dokun(oyun, 'ciger')
  bekle(oyun, PISME - 1)
  dokun(oyun, 'o0')
  assert.equal(oyun.porsiyonDizisi, 0)
})
```

`lib/oyun/motor.test.ts`: replace the first test and the last test (leave the golden tests and `zorlukBandi` for Task 3), and add the property test:

```ts
import { rastgele } from './rastgele.ts'
import { ilerle } from './motor.ts'
import { yeniOyun } from './durum.ts'
import type { Hedef } from './tipler.ts'

test('simule_siraDisiAralikDisiYaDaKesirliTik_hataVerir', () => {
  assert.throws(() => simule(1, [[5, 'ciger'], [4, 'ciger']]), RangeError)
  assert.throws(() => simule(1, [[7200, 'ciger']]), RangeError)
  assert.throws(() => simule(1, [[-1, 'ciger']]), RangeError)
  assert.throws(() => simule(1, [[1.5, 'ciger']]), RangeError)
})

test('simule_tanimsizYaDaEskiHedefYaDaBozukGirdi_hataVerir', () => {
  const bozuk = (g: unknown) => g as Girdi[]
  assert.throws(() => simule(1, bozuk([[0, 'x']])), RangeError)
  assert.throws(() => simule(1, bozuk([[0, 's0']])), RangeError)
  assert.throws(() => simule(1, bozuk([[0, 'ayran']])), RangeError)
  assert.throws(() => simule(1, bozuk([[0, 'o4']])), RangeError)
  assert.throws(() => simule(1, bozuk([[0, 5]])), RangeError)
  assert.throws(() => simule(1, bozuk([[0, null]])), RangeError)
  assert.throws(() => simule(1, bozuk([null])), RangeError)
  assert.throws(() => simule(1, bozuk([[0, 'o0', 'fazla']])), RangeError)
})

const TUM_HEDEFLER: readonly Hedef[] = ['o0', 'o1', 'o2', 'o3', 'ciger', 'dalak', 'yurek']

test('puan_rastgeleDokunusla_hicbirTikteDusmez', () => {
  for (let tohum = 1; tohum <= 60; tohum++) {
    const r = rastgele(tohum * 31)
    const oyun = yeniOyun(tohum)
    let onceki = 0
    while (!oyun.bitti) {
      const hedef = TUM_HEDEFLER[r.tam(0, TUM_HEDEFLER.length - 1)] as Hedef
      ilerle(oyun, r.tam(0, 5) === 0 ? [hedef] : [])
      assert.ok(oyun.puan >= onceki, `tohum ${tohum}, tik ${oyun.tik}: ${onceki} -> ${oyun.puan}`)
      onceki = oyun.puan
    }
  }
})
```

(Keep `simule_bitistenSonrakiGirdiler_yokSayilir` and the goldens untouched until Task 3 rewrites them; the old `s0` lines inside them are replaced there.)

- [ ] **Step 2: Run to verify they fail**

Run: `node --test lib/oyun/ocak.test.ts lib/oyun/sofra.test.ts`
Expected: FAIL (old rules still in `ocak.ts` / `sofra.ts`).

- [ ] **Step 3: Implement**

`lib/oyun/sofra.ts` (replace the file):

```ts
import { KALKIS_TIK, PORSIYON_SIS, PUAN } from './ayar.ts'
import { evreAyari } from './durum.ts'
import { komboCarpani, sabirBonusu } from './puan.ts'
import type { Kalite, Olay, Oyun, Sofra, Urun } from './tipler.ts'

/** Geliş tiki gelen misafirler kapıdaki sıraya geçer. */
export function gelisleriAl(oyun: Oyun): void {
  while (oyun.gelecek[0] && oyun.gelecek[0].gelis <= oyun.tik) {
    oyun.kuyruk.push(oyun.gelecek.shift() as Oyun['gelecek'][number])
  }
}

/** Sıradaki misafir açık sofraların en küçük boş yuvasına oturur; sofra kurulu gelir, sabır oturunca başlar. */
export function kuyruguOturt(oyun: Oyun, olaylar: Olay[]): void {
  const ayar = evreAyari(oyun.evre)
  for (let no = 0; no < ayar.sofra && oyun.kuyruk.length > 0; no++) {
    if (oyun.sofralar[no]) continue
    const misafir = oyun.kuyruk.shift()
    if (!misafir) return
    const toplam = ayar.sabir * misafir.sabirCarpani
    oyun.sofralar[no] = {
      misafir,
      kalan: [...misafir.fis],
      birikim: 0,
      sabir: toplam,
      toplamSabir: toplam,
      kalkis: null,
    }
    olaylar.push({ tur: 'sofraGeldi', sofra: no })
  }
}

/** Ürünü isteyen, ödememiş misafirlerden sabrı en az kalanın sofrası; eşitlikte soldaki; yoksa -1. */
export function enSabirsiz(oyun: Oyun, urun: Urun): number {
  let secilen = -1
  let enAz = Number.POSITIVE_INFINITY
  oyun.sofralar.forEach((sofra, no) => {
    if (!sofra || sofra.kalkis !== null || !sofra.kalan.includes(urun) || sofra.sabir >= enAz) return
    secilen = no
    enAz = sofra.sabir
  })
  return secilen
}

/** Servis edilen şiş porsiyon dizisini ilerletir ya da bozar. */
function porsiyonIlerlet(oyun: Oyun, kalite: Kalite, olaylar: Olay[]): void {
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

function fisiOde(oyun: Oyun, no: number, sofra: Sofra, olaylar: Olay[]): void {
  const taban = sofra.birikim + sabirBonusu(sofra.sabir, sofra.toplamSabir)
  const odeme = taban * komboCarpani(oyun.kombo) * evreAyari(oyun.evre).puanCarpani
  oyun.puan += odeme
  oyun.kombo++
  oyun.ozet.enUzunKombo = Math.max(oyun.ozet.enUzunKombo, oyun.kombo)
  oyun.ozet.sofra++
  sofra.kalkis = KALKIS_TIK
  olaylar.push({ tur: 'fisTamam', sofra: no, odeme })
}

/** Alınan şiş sofranın fişinden düşer; fiş biterse misafir öder. `yuva` yalnız uçuş animasyonu içindir. */
export function servisVer(
  oyun: Oyun,
  no: number,
  yuva: number,
  urun: Urun,
  kalite: Kalite,
  olaylar: Olay[],
): void {
  const sofra = oyun.sofralar[no]
  if (!sofra) return
  sofra.kalan.splice(sofra.kalan.indexOf(urun), 1)
  sofra.birikim += kalite === 'tam' ? PUAN.tamKivam : PUAN.iyi
  oyun.ozet.sis++
  if (kalite === 'tam') oyun.ozet.tamKivam++
  porsiyonIlerlet(oyun, kalite, olaylar)
  olaylar.push({ tur: 'servis', sofra: no, yuva, urun, kalite })
  if (sofra.kalan.length === 0) fisiOde(oyun, no, sofra, olaylar)
}

/** Sabır her tik bir azalır, ödeyen sofra kalkar, sabrı biten küser: yalnız kombo ve kalkan sayısı bedel öder. */
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
    sofra.sabir--
    if (sofra.sabir > 0) return
    oyun.sofralar[no] = null
    oyun.kombo = 0
    oyun.ozet.kalkan++
    olaylar.push({ tur: 'sofraKalkti', sofra: no, odedi: false })
  })
}
```

`lib/oyun/ocak.ts` (replace the file):

```ts
import { ACILDIGI_EVRE, PISME_YUZDESI } from './ayar.ts'
import { evreAyari } from './durum.ts'
import { enSabirsiz, servisVer } from './sofra.ts'
import type { Kalite, Olay, Oyun, Urun } from './tipler.ts'

/** Yanık ve boşa giden şiş aynı bedeli öder: kombo ve porsiyon dizisi sıfırlanır, puan düşmez. */
function komboyuBozdur(oyun: Oyun): void {
  oyun.kombo = 0
  oyun.porsiyonDizisi = 0
}

/** Raftan şiş: açık ocak yuvalarının ilk boşuna iner; süreler o anki evreden sabitlenir. */
export function rafaDokun(oyun: Oyun, urun: Urun, olaylar: Olay[]): void {
  if (ACILDIGI_EVRE[urun] > oyun.evre) return
  const ayar = evreAyari(oyun.evre)
  const yuva = oyun.ocak.slice(0, ayar.ocak).findIndex((sis) => !sis)
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
  }
  olaylar.push({ tur: 'sisKondu', yuva, urun })
}

/**
 * Pişerken dokunuş etkisizdir. Alma penceresindeki dokunuş şişi alır ve isteyen misafire
 * kendiliğinden servis eder; kimse istemiyorsa şiş boşa gider. Tam kıvam bandı pencerenin ortasında:
 * |gecen - pisme - pencere/2| <= bant/2  ⇔  |2·(gecen - pisme) - pencere| <= bant (tamsayıda).
 */
export function ocagaDokun(oyun: Oyun, yuva: number, olaylar: Olay[]): void {
  const sis = oyun.ocak[yuva]
  if (!sis) return
  if (sis.gecen < sis.pisme) {
    olaylar.push({ tur: 'sisErken', yuva })
    return
  }
  const kalite: Kalite = Math.abs(2 * (sis.gecen - sis.pisme) - sis.pencere) <= sis.bant ? 'tam' : 'iyi'
  oyun.ocak[yuva] = null
  olaylar.push({ tur: 'sisAlindi', yuva, kalite })
  const sofra = enSabirsiz(oyun, sis.urun)
  if (sofra === -1) {
    komboyuBozdur(oyun)
    olaylar.push({ tur: 'sisBosa', yuva })
    return
  }
  servisVer(oyun, sofra, yuva, sis.urun, kalite, olaylar)
}

/** Şişler pişer; alma penceresi geçen yanar. */
export function ocakIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.ocak.forEach((sis, yuva) => {
    if (!sis) return
    sis.gecen++
    if (sis.gecen < sis.pisme + sis.pencere) return
    oyun.ocak[yuva] = null
    komboyuBozdur(oyun)
    olaylar.push({ tur: 'sisYandi', yuva })
  })
}
```

`lib/oyun/motor.ts`: replace the imports, `HEDEFLER`, `dokun` and the `ilerle` body's world steps:

```ts
import { KAYIP_SINIRI, PUAN, TUR_TIK } from './ayar.ts'
import { evreBul, yeniOyun } from './durum.ts'
import { ocagaDokun, ocakIlerle, rafaDokun } from './ocak.ts'
import { gelisleriAl, kuyruguOturt, sofralariIlerle } from './sofra.ts'
import type { Girdi, Hedef, Olay, Oyun, Sonuc } from './tipler.ts'

/** Tanınan hedefler; kayıttaki başka her şey bozuktur. */
const HEDEFLER: ReadonlySet<string> = new Set<Hedef>(['o0', 'o1', 'o2', 'o3', 'ciger', 'dalak', 'yurek'])

function dokun(oyun: Oyun, hedef: Hedef, olaylar: Olay[]): void {
  if (!HEDEFLER.has(hedef)) return
  if (hedef === 'ciger' || hedef === 'dalak' || hedef === 'yurek') return rafaDokun(oyun, hedef, olaylar)
  ocagaDokun(oyun, Number(hedef.slice(1)), olaylar)
}
```

and in `ilerle`: delete the `tezgahIlerle` and `ayranIlerle` calls and update the doc comment to "(ocak, sofralar)". `bitisiDenetle`, `girdileriDogrula` and `simule` are unchanged.

Delete `lib/oyun/servis.test.ts` (`git rm`).

- [ ] **Step 4: Run to verify they pass**

Run: `node --test lib/oyun/ocak.test.ts lib/oyun/sofra.test.ts lib/oyun/durum.test.ts lib/oyun/gece.test.ts`
Expected: PASS. Then `node --test --test-name-pattern='puan_rastgele|simule_tanimsiz|simule_siraDisi' lib/oyun/motor.test.ts` Expected: PASS (the golden and zorluk tests still fail until Task 3).

If a tick-arithmetic assertion is off by one in `ocak.test.ts`, fix the test's setup (`sisiHazirla` asserts the exact `gecen` first), not the engine.

- [ ] **Step 5: Commit**

```bash
git add lib/oyun
git commit -m "Serve a taken skewer automatically and drop every score penalty"
```

---

### Task 3: Bots, tuning, golden records, difficulty gates

**Files:**
- Modify: `lib/oyun/deneme.ts` (bot half), `lib/oyun/ayar.ts` (numbers in `TABLO` only), `lib/oyun/motor.test.ts` (goldens), `lib/oyun/gece.test.ts` (gates)
- Delete from `motor.test.ts`: `zorlukBandi_ustaTamamlar_siradanTamamlayamaz` (replaced by the gates)

**Interfaces:**
- Consumes: `eksikUrunler`, `ilerle`, `rastgele`.
- Produces: `type Beceri = 'usta' | 'duzenli' | 'rastgele' | 'hareketsiz'`, `ustaOyna(tohum: number, beceri: Beceri): Girdi[]` (name kept; used by `motor.test.ts`, `tavan.test.ts`, `sunucu/*.test.ts`).

- [ ] **Step 1: Write the failing gate tests**

Append to `lib/oyun/gece.test.ts` (add imports `ustaOyna` from `./deneme.ts`, `simule` from `./motor.ts`, `PUAN` from `./ayar.ts`):

```ts
const ZORLUK_TOHUMLARI = Array.from({ length: 200 }, (_, i) => i * 104729 + 3)
const oyna = (tohum: number, beceri: Parameters<typeof ustaOyna>[1]) => simule(tohum, ustaOyna(tohum, beceri))

test('bot_usta_geceyiTamamlar_duzenliden_cokPuanAlir', () => {
  let tamam = 0
  let usta = 0
  let duzenli = 0
  for (const t of ZORLUK_TOHUMLARI) {
    const u = oyna(t, 'usta')
    if (u.bitti === 'gece') tamam++
    usta += u.puan
    duzenli += oyna(t, 'duzenli').puan
  }
  assert.ok(tamam >= 190, `usta ${tamam}/200 gece tamamladı`)
  assert.ok(usta > duzenli, 'usta düzenliden fazla puan almalı')
})

test('bot_duzenli_gecelerinEnAz80ininiTamamlar', () => {
  const tamam = ZORLUK_TOHUMLARI.filter((t) => oyna(t, 'duzenli').bitti === 'gece').length
  assert.ok(tamam >= 160, `düzenli ${tamam}/200 gece tamamladı`)
})

test('bot_rastgele_ilkIkiEvreyiGecer', () => {
  const gecen = ZORLUK_TOHUMLARI.filter((t) => oyna(t, 'rastgele').tik >= (EVRELER[2]?.baslangic ?? 0)).length
  assert.ok(gecen >= 180, `rastgele dokunan ${gecen}/200 turda ilk iki evreyi geçti`)
})

test('bot_hareketsiz_hicSofraOdemez_enFazlaGeceTamamPuaniAlir', () => {
  for (const t of ZORLUK_TOHUMLARI.slice(0, 50)) {
    const sonuc = oyna(t, 'hareketsiz')
    assert.equal(sonuc.ozet.sofra, 0, `tohum ${t}`)
    assert.ok(sonuc.puan <= PUAN.geceTamam, `tohum ${t}: ${sonuc.puan}`)
  }
})
```

- [ ] **Step 2: Rewrite the bot half of `lib/oyun/deneme.ts`**

Keep the scene half (`sahne`, `evreyeGec`, `dokun`, `bekle`, `sonaKadarBekle`) as is, replace everything from `Beceri` down with:

```ts
import { ACILDIGI_EVRE, EVRELER } from './ayar.ts'
import { eksikUrunler, evreAyari, yeniOyun } from './durum.ts'
import { ilerle } from './motor.ts'
import { rastgele, type Rastgele } from './rastgele.ts'
import type { Girdi, Hedef, Oyun, Urun } from './tipler.ts'

/**
 * Otomatik oyuncu, tek parmakla: iki dokunuş arası en az `ARALIK[beceri]` tik.
 * 'usta' hazır şişi pencerenin ortasında alır (saniyede 4), 'duzenli' hazır olunca alır
 * ve bandı umursamaz (1,5), 'rastgele' bilgisizce ocak yuvalarına ve açık raf ürünlerine vurur,
 * 'hareketsiz' hiç dokunmaz.
 */
export type Beceri = 'usta' | 'duzenli' | 'rastgele' | 'hareketsiz'

const ARALIK: Record<Beceri, number> = { usta: 15, duzenli: 40, rastgele: 30, hareketsiz: Number.MAX_SAFE_INTEGER }

const RAF: readonly Urun[] = ['ciger', 'dalak', 'yurek']

/** Ocaktaki hazır şişlerden alınacak ilk yuva; yalnız birinin istediği şişler alınır. */
function alinacak(oyun: Oyun, beceri: Beceri): Hedef | null {
  const istenen = new Set(oyun.sofralar.flatMap((s) => (s && s.kalkis === null ? s.kalan : [])))
  for (let yuva = 0; yuva < oyun.ocak.length; yuva++) {
    const sis = oyun.ocak[yuva]
    if (!sis || sis.gecen < sis.pisme || !istenen.has(sis.urun)) continue
    const ortada = 2 * (sis.gecen - sis.pisme) >= sis.pencere
    const yanacak = sis.gecen >= sis.pisme + sis.pencere - ARALIK[beceri]
    if (beceri !== 'usta' || ortada || yanacak) return `o${yuva}` as Hedef
  }
  return null
}

/** Açık bir yuva varsa en çok eksik olan ürünün rafı. */
function koyulacak(oyun: Oyun): Hedef | null {
  const acik = evreAyari(oyun.evre).ocak
  return oyun.ocak.slice(0, acik).some((s) => !s) ? (eksikUrunler(oyun)[0] ?? null) : null
}

function rastgeleDokunus(oyun: Oyun, r: Rastgele): Hedef {
  const hedefler: Hedef[] = ['o0', 'o1', 'o2', 'o3', ...RAF.filter((u) => ACILDIGI_EVRE[u] <= oyun.evre)]
  return hedefler[r.tam(0, hedefler.length - 1)] as Hedef
}

function karar(oyun: Oyun, beceri: Beceri, r: Rastgele): Hedef | null {
  if (beceri === 'hareketsiz') return null
  if (beceri === 'rastgele') return rastgeleDokunus(oyun, r)
  return alinacak(oyun, beceri) ?? koyulacak(oyun)
}

/** Bütün geceyi oynar, girdi kaydını döner. */
export function ustaOyna(tohum: number, beceri: Beceri): Girdi[] {
  const oyun = yeniOyun(tohum)
  const r = rastgele(tohum ^ 0x5bd1e995)
  const kayit: Girdi[] = []
  let sonDokunus = -ARALIK[beceri]
  while (!oyun.bitti) {
    const hedef = oyun.tik - sonDokunus >= ARALIK[beceri] ? karar(oyun, beceri, r) : null
    if (hedef) {
      kayit.push([oyun.tik, hedef])
      sonDokunus = oyun.tik
    }
    ilerle(oyun, hedef ? [hedef] : [])
  }
  return kayit
}
```

(Drop the now-unused imports at the top of the file: the scene half still needs `EVRELER`, `evreAyari`, `yeniOyun`, `ilerle`, `Hedef`, `Olay`, `Oyun`, `Urun`; let the typecheck of this file decide: `npx tsc --noEmit -p . 2>&1 | grep deneme`.)

- [ ] **Step 3: Measure and tune**

Create `/tmp/bozo-oyun/sade/zorluk.mjs` (not in the repo):

```js
import { ustaOyna } from '/Users/mk/Desktop/Bozo/Web/lib/oyun/deneme.ts'
import { simule } from '/Users/mk/Desktop/Bozo/Web/lib/oyun/motor.ts'

const tohumlar = Array.from({ length: 200 }, (_, i) => i * 104729 + 3)
for (const beceri of ['usta', 'duzenli', 'rastgele', 'hareketsiz']) {
  const s = tohumlar.map((t) => simule(t, ustaOyna(t, beceri)))
  const tamam = s.filter((x) => x.bitti === 'gece').length
  const ortalama = Math.round(s.reduce((t, x) => t + x.puan, 0) / s.length)
  const ilkIki = s.filter((x) => x.tik >= 2700).length
  const kalkan = (s.reduce((t, x) => t + x.ozet.kalkan, 0) / s.length).toFixed(2)
  console.log(beceri.padEnd(10), { tamam, ortalama, ilkIki, kalkan })
}
```

Run: `node /tmp/bozo-oyun/sade/zorluk.mjs`
Expected gates: usta `tamam >= 190`, duzenli `tamam >= 160`, rastgele `ilkIki >= 180`, hareketsiz as in the test. If a gate fails, change **only** numbers in `TABLO` / `BUTCE.aralik` in `lib/oyun/ayar.ts`, one knob at a time, in this order: patience column (raise to make the night easier), window column (widen), `aralik` (raise to space guests out). If the idle player's score looks too high or `usta` completes 100% with a flat score spread, keep the numbers (the gate is a floor). Record the final table and the measured stats in `docs/surec/IYILESTIRMELER.md` under a new heading "Sade mod zorluk ayarı" (what, measured, why).

- [ ] **Step 4: Regenerate the golden records**

Replace the three `altin_*` tests and delete `zorlukBandi_*` in `lib/oyun/motor.test.ts`. Print the values:

```bash
node -e "
import('/Users/mk/Desktop/Bozo/Web/lib/oyun/deneme.ts').then(async ({ ustaOyna }) => {
  const { simule } = await import('/Users/mk/Desktop/Bozo/Web/lib/oyun/motor.ts')
  for (const [t, b] of [[1, 'usta'], [1, 'duzenli'], [2026, 'rastgele']]) console.log(t, b, JSON.stringify(simule(t, ustaOyna(t, b))))
})"
```

Write each printed object into a test of this shape (the printed numbers are the expected values; this is the one place values are captured from a run rather than designed):

```ts
test('altin_tohum1_usta', () => {
  assert.deepEqual(simule(1, ustaOyna(1, 'usta')), { /* printed object */ })
})
```

Same for `altin_tohum1_duzenli` and `altin_tohum2026_rastgele`. Fix `simule_bitistenSonrakiGirdiler_yokSayilir` to use a bot that ends the night early or at 05:00: use `ustaOyna(2026, 'usta')`, assert `sonuc.bitti` equals the printed value, and append `[sonuc.tik + 10, 'ciger']` instead of `'ciger'` after a possibly-valid tick (`TUR_TIK` bounds the record: use `Math.min(sonuc.tik, TUR_TIK - 1)` and keep the appended tick strictly after the last bot input).

- [ ] **Step 5: Run and commit**

Run: `node --test lib/oyun/motor.test.ts lib/oyun/gece.test.ts lib/oyun/ocak.test.ts lib/oyun/sofra.test.ts`
Expected: PASS.

```bash
git add lib/oyun docs/surec/IYILESTIRMELER.md
git commit -m "Rewrite the bots and pin the two-tap difficulty with gate tests"
```

---

### Task 4: Display modules: view model, sound, announcer, keys, guide state machine

**Files:**
- Modify: `lib/oyun/gosterim.ts`, `lib/oyun/gorsel.ts`, `lib/oyun/ses.ts`, `lib/oyun/duyuru.ts`, `lib/oyun/klavye.ts` and their tests (`gosterim.test.ts`, `gorsel.test.ts`, `ses.test.ts`, `duyuru.test.ts`, `klavye.test.ts`)
- Create: `lib/oyun/rehber.ts`, `lib/oyun/rehber.test.ts`

**Interfaces:**
- Produces:
  - `gosterim.ts`: `SisGorunumu = 'pisiyor' | 'hazir' | 'kivam'`; `sisGorunumu(sis: OcakSisi): SisGorunumu`; `Goruntu = { acikSofra; acikOcak; raf: readonly Urun[]; rafIstenen: readonly Urun[]; kapida: number; sofralar: ({ fis; kalan; odedi; karisik } | null)[]; ocak: ({ urun; pencere; kivam; bant } | null)[] }`; `goruntuAl(oyun)`.
  - `ses.ts`: `SesAdi` without `'cevir'`; `sisBosa` plays `'yanik'`.
  - `duyuru.ts`: `DuyuruAnahtari` without `'sogudu'`, with `'sisBosa'` (priority 1).
  - `klavye.ts`: `kisayolHedefi('1'..'4')` → `o0..o3`, everything else null.
  - `rehber.ts`: below.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/rehber.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EVRELER } from './ayar.ts'
import { bekle, dokun, sahne } from './deneme.ts'
import { rehberBasla, rehberDurdurur, rehberIlerle, rehberIzni, rehberTamam, rehberAtla, ODENDI_TIK } from './rehber.ts'
import type { Olay } from './tipler.ts'

const E0 = EVRELER[0]!

test('rehber_misafirOturmadanBekler_oturuncaFiseGecer', () => {
  const oyun = sahne([['ciger']])
  let r = rehberIlerle(rehberBasla(), oyun, [])
  assert.equal(r.adim, 'bekle')
  const olaylar = bekle(oyun, 1)
  r = rehberIlerle(r, oyun, olaylar)
  assert.equal(r.adim, 'fis')
  assert.ok(rehberDurdurur(r))
})

test('rehber_tamamdanSonra_rafAdimi_yalnizCigerRafinaIzinVerir', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  const r = rehberTamam(rehberIlerle(rehberBasla(), oyun, [{ tur: 'sofraGeldi', sofra: 0 }]))
  assert.equal(r.adim, 'raf')
  assert.ok(rehberIzni(r, 'ciger', oyun))
  for (const h of ['dalak', 'yurek', 'o0', 'o1'] as const) assert.ok(!rehberIzni(r, h, oyun), h)
})

test('rehber_fisAdiminda_hicbirDokunusaIzinYok_tamamdanBaskaIlerlemez', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  const r = rehberIlerle(rehberBasla(), oyun, [])
  for (const h of ['ciger', 'o0'] as const) assert.ok(!rehberIzni(r, h, oyun))
  assert.equal(rehberTamam(rehberBasla()).adim, 'bekle')
})

test('rehber_tamYol_servisedinceOdendiyeSonraBittiye', () => {
  const oyun = sahne([['ciger']])
  let r = rehberIlerle(rehberBasla(), oyun, bekle(oyun, 1))
  r = rehberTamam(r)
  const koy = dokun(oyun, 'ciger')
  r = rehberIlerle(r, oyun, koy)
  assert.equal(r.adim, 'pisiyor')
  assert.ok(!rehberDurdurur(r))
  assert.ok(!rehberIzni(r, 'o0', oyun))
  r = rehberIlerle(r, oyun, bekle(oyun, E0.cigerPisme - 1))
  assert.equal(r.adim, 'hazir')
  assert.ok(rehberDurdurur(r))
  assert.ok(rehberIzni(r, 'o0', oyun))
  assert.ok(!rehberIzni(r, 'o1', oyun))
  assert.ok(!rehberIzni(r, 'ciger', oyun))
  const al: Olay[] = dokun(oyun, 'o0')
  r = rehberIlerle(r, oyun, al)
  assert.equal(r.adim, 'odendi')
  assert.ok(!rehberDurdurur(r))
  r = rehberIlerle(r, oyun, bekle(oyun, ODENDI_TIK - 1))
  assert.equal(r.adim, 'odendi')
  r = rehberIlerle(r, oyun, bekle(oyun, 1))
  assert.equal(r.adim, 'bitti')
  assert.ok(rehberIzni(r, 'o2', oyun))
})

test('rehber_sisYanarsa_rafAdimınaDoner', () => {
  const oyun = sahne([['ciger']])
  let r = rehberTamam(rehberIlerle(rehberBasla(), oyun, bekle(oyun, 1)))
  r = rehberIlerle(r, oyun, dokun(oyun, 'ciger'))
  r = rehberIlerle(r, oyun, [{ tur: 'sisYandi', yuva: 0 }])
  assert.equal(r.adim, 'raf')
})

test('rehber_atla_herAdimdaBitirir_degismeyenNesneAyniKalir', () => {
  const r = rehberBasla()
  assert.equal(rehberAtla(r).adim, 'bitti')
  assert.equal(rehberIlerle(r, sahne([]), []), r)
})

test('rehber_gecedeBittiyse_bitirir', () => {
  const oyun = sahne([])
  oyun.bitti = 'ucSofra'
  assert.equal(rehberIlerle(rehberBasla(), oyun, []).adim, 'bitti')
})
```

Update the other test files to the new model (concrete changes):
- `gosterim.test.ts`: `sisGorunumu` returns `'pisiyor'` before `pisme`, `'kivam'` inside the centre band after `pisme`, `'hazir'` elsewhere in the window; `goruntuAl(oyun)` has no `tezgah`, `ayran`, `kurulu`, `centik`, `cevirme`; add:

```ts
test('goruntuAl_rafIstenen_misafirinBeklediginiOcaktakiniDusereklistele', () => {
  const oyun = sahne([['ciger', 'ciger']])
  bekle(oyun, 1)
  assert.deepEqual(goruntuAl(oyun).rafIstenen, ['ciger'])
  dokun(oyun, 'ciger')
  assert.deepEqual(goruntuAl(oyun).rafIstenen, ['ciger'])
  dokun(oyun, 'ciger')
  assert.deepEqual(goruntuAl(oyun).rafIstenen, [])
})
```

(`rafIstenen` is the unique set of `eksikUrunler(oyun)`, in rack order.)
- `gorsel.test.ts`: the `SIS` fixture loses `cevirme`; `fisSatirlari` tests with `'ayran'` become ciğer/dalak/yürek lines; delete ayran-only assertions.
- `ses.test.ts`: `olayinSesi` for `sisKondu` → `'cizirti'`, `sisAlindi` tam → `'tamKivam'`, iyi → `'tik'`, `sisBosa` and `sisYandi` → `'yanik'`, `sisErken` → `null`, `sofraGeldi` → `null`; `SESLER` has no `cevir`.
- `duyuru.test.ts`: `sogudu` cases become `sisBosa`; priority `sisYandi` (2) above `sisBosa` (1).
- `klavye.test.ts`: `'1'..'4'` → `o0..o3`, `'5'`, `'s'` → null.

- [ ] **Step 2: Run to verify they fail**

Run: `node --test lib/oyun/rehber.test.ts lib/oyun/gosterim.test.ts lib/oyun/ses.test.ts lib/oyun/duyuru.test.ts lib/oyun/klavye.test.ts lib/oyun/gorsel.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

`lib/oyun/rehber.ts` (new):

```ts
import type { Hedef, Olay, Oyun } from './tipler.ts'

/*
 * Rehberli ilk tur (spec sade §3): saf bir durum makinesi. Simülasyonu değiştirmez; hangi adımda
 * saatin durduğunu ve hangi dokunuşa izin verildiğini söyler. Ekran yalnız bunu çizer.
 */
export type RehberAdimi = 'bekle' | 'fis' | 'raf' | 'pisiyor' | 'hazir' | 'odendi' | 'bitti'
export type Rehber = { adim: RehberAdimi; bas: number }

/** "Afiyet olsun" balonu 2 sn görünür. */
export const ODENDI_TIK = 120

export const rehberBasla = (): Rehber => ({ adim: 'bekle', bas: 0 })
export const rehberAtla = (r: Rehber): Rehber => (r.adim === 'bitti' ? r : { adim: 'bitti', bas: r.bas })

/** Oyuncunun "Tamam" demesiyle fiş adımından rafa geçilir. */
export const rehberTamam = (r: Rehber): Rehber => (r.adim === 'fis' ? { adim: 'raf', bas: r.bas } : r)

/** Fiş, raf ve hazır adımlarında saat dokunuşu bekler. */
export const rehberDurdurur = (r: Rehber): boolean => r.adim === 'fis' || r.adim === 'raf' || r.adim === 'hazir'

const hazirMi = (oyun: Oyun): boolean => oyun.ocak.some((sis) => sis !== null && sis.gecen >= sis.pisme)

/** Adımın izin verdiği dokunuş; rehber bitince her şeye izin. Yanlış dokunuş etkisizdir ve kayda girmez. */
export function rehberIzni(r: Rehber, hedef: Hedef, oyun: Oyun): boolean {
  if (r.adim === 'bitti') return true
  if (r.adim === 'raf') return hedef === 'ciger'
  if (r.adim !== 'hazir') return false
  const sis = hedef.startsWith('o') ? oyun.ocak[Number(hedef.slice(1))] : null
  return !!sis && sis.gecen >= sis.pisme
}

function sonraki(r: Rehber, oyun: Oyun, olaylar: readonly Olay[]): RehberAdimi {
  if (oyun.bitti) return 'bitti'
  switch (r.adim) {
    case 'bekle':
      return oyun.sofralar[0] ? 'fis' : 'bekle'
    case 'raf':
      return olaylar.some((o) => o.tur === 'sisKondu') ? 'pisiyor' : 'raf'
    case 'pisiyor':
      if (olaylar.some((o) => o.tur === 'sisYandi')) return 'raf'
      return hazirMi(oyun) ? 'hazir' : 'pisiyor'
    case 'hazir':
      return olaylar.some((o) => o.tur === 'servis') ? 'odendi' : 'hazir'
    case 'odendi':
      return oyun.tik - r.bas >= ODENDI_TIK ? 'bitti' : 'odendi'
    default:
      return r.adim
  }
}

/** Her karede, o karenin olaylarıyla; adım değişmediyse aynı nesne döner. */
export function rehberIlerle(r: Rehber, oyun: Oyun, olaylar: readonly Olay[]): Rehber {
  const adim = sonraki(r, oyun, olaylar)
  return adim === r.adim ? r : { adim, bas: oyun.tik }
}
```

`rehberBasla` is a function (fresh object per round); the test already calls it as one.

`lib/oyun/gosterim.ts`: replace the file's body from `SisGorunumu` down:

```ts
export type SisGorunumu = 'pisiyor' | 'hazir' | 'kivam'

/** Rayın o anki hali: pişiyor, alma penceresi (hazır), ve pencerenin ortasındaki tam kıvam bandı. */
export function sisGorunumu(sis: OcakSisi): SisGorunumu {
  if (sis.gecen < sis.pisme) return 'pisiyor'
  return Math.abs(2 * (sis.gecen - sis.pisme) - sis.pencere) <= sis.bant ? 'kivam' : 'hazir'
}

export type Goruntu = {
  acikSofra: number
  acikOcak: number
  raf: readonly Urun[]
  /** Misafirlerin beklediği ve ocakta pişmeyen ürünler: rafta parlar (spec sade §2). */
  rafIstenen: readonly Urun[]
  kapida: number
  sofralar: ({ fis: readonly Urun[]; kalan: readonly Urun[]; odedi: boolean; karisik: boolean } | null)[]
  /** Rayın kesirleri (0-1): alma penceresinin başı, tam kıvam bandının ortası ve genişliği. */
  ocak: ({ urun: Urun; pencere: number; kivam: number; bant: number } | null)[]
}

const RAF: readonly Urun[] = ['ciger', 'dalak', 'yurek']

/** React'in çizdiği yapı: yalnız olay olunca değişen kısım. */
export function goruntuAl(oyun: Oyun): Goruntu {
  const ayar = evreAyari(oyun.evre)
  const eksik = eksikUrunler(oyun)
  return {
    acikSofra: ayar.sofra,
    acikOcak: ayar.ocak,
    raf: RAF.filter((u) => ACILDIGI_EVRE[u] <= oyun.evre),
    rafIstenen: RAF.filter((u) => eksik.includes(u)),
    kapida: oyun.kuyruk.length,
    sofralar: oyun.sofralar.map((s) =>
      s ? { fis: s.misafir.fis, kalan: [...s.kalan], odedi: s.kalkis !== null, karisik: s.misafir.karisik } : null,
    ),
    ocak: oyun.ocak.map((s) => {
      if (!s) return null
      const ray = s.pisme + s.pencere
      return { urun: s.urun, pencere: s.pisme / ray, kivam: (s.pisme + s.pencere / 2) / ray, bant: s.bant / ray }
    }),
  }
}
```

Imports: `ACILDIGI_EVRE, OYUN_SAATI_TIK, TUR_TIK` from `./ayar.ts`; `evreAyari, eksikUrunler` from `./durum.ts`; types `OcakSisi, Oyun, Urun`. Delete `ocakHamlesiVar`, `ipucuHedefi`, `SISLER` and the `Hedef`, `Kalite` imports. `oyunSaati` stays unchanged.

`lib/oyun/ses.ts`: delete `'cevir'` from `SesAdi` and `SESLER`; in `olayinSesi` delete the `sisCevrildi`, `sofraKuruldu`, `ayranDoldu` cases, and change `sisYandi`/`sogudu` to `sisYandi`/`sisBosa`:

```ts
    case 'sisYandi':
    case 'sisBosa':
      return 'yanik'
```

`lib/oyun/duyuru.ts`: `DuyuruAnahtari = 'sonSaat' | 'porsiyon' | 'sofraKalkti' | 'fisTamam' | 'sisYandi' | 'sisBosa'`; `ONCELIK` ends `sisYandi: 2, sisBosa: 1`; in `olayDuyurusu` replace the `sogudu` case with `case 'sisBosa': return { anahtar: 'sisBosa' }`.

`lib/oyun/klavye.ts`: `KISAYOLLAR = { '1': 'o0', '2': 'o1', '3': 'o2', '4': 'o3' }` and the doc comment "1-4 ocak yuvası".

`lib/oyun/gorsel.ts`: only the `Urun` type changed (ayran gone); `fisSatirlari`/`servisEdilenler` keep their code.

- [ ] **Step 4: Run to verify they pass**

Run: `node --test lib/oyun/*.test.ts`
Expected: PASS for every file except `tavan.test.ts` (Task 5).

- [ ] **Step 5: Commit**

```bash
git add lib/oyun
git commit -m "Add the guided-round state machine and the new view model"
```

---

### Task 5: Score ceiling and the server's fixtures

**Files:**
- Modify: `lib/oyun/tavan.ts`, `lib/oyun/tavan.test.ts`, every `sunucu/*.ts` or `*.test.ts` that writes an old target (`'s0'`, `'ayran'`)

**Interfaces:**
- Consumes: `geceKur`, `komboCarpani`, `PUAN`, `PORSIYON_SIS`.
- Produces: `tavan(tohum: number): number` (same signature).

- [ ] **Step 1: Find the old targets**

Run: `grep -rnE "'s[0-3]'|'ayran'|\"s0\"" sunucu lib --include='*.ts'`
Expected: hits in `sunucu/depoSozlesmesi.ts` (`[[0, 's0']]` twice) and possibly `sunucu/*.test.ts`; none in `lib/oyun` outside tests you already rewrote.

- [ ] **Step 2: Write the failing ceiling tests**

`lib/oyun/tavan.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ustaOyna } from './deneme.ts'
import { simule } from './motor.ts'
import { tavan } from './tavan.ts'

test('tavan_hicbirBotunPuaniniAsmaz', () => {
  for (let t = 1; t <= 40; t++) {
    const sinir = tavan(t)
    for (const beceri of ['usta', 'duzenli', 'rastgele'] as const) {
      assert.ok(simule(t, ustaOyna(t, beceri)).puan <= sinir, `tohum ${t}, ${beceri}`)
    }
  }
})

test('tavan_ayniTohum_ayniDeger_veTamsayi', () => {
  assert.equal(tavan(1), tavan(1))
  assert.ok(Number.isInteger(tavan(1)))
})

test('altin_tavan_tohum1', () => {
  assert.equal(tavan(1), 0) // run the test once, paste the printed actual value
})

/** Bütçe sabit ama kalemlerin fişlere dağılımı tohuma bağlı: tavan tohumdan tohuma az oynar. */
test('tavan_tohumaGoreAzOynar', () => {
  for (let t = 2; t <= 40; t++) assert.ok(Math.abs(tavan(t) - tavan(1)) < 1500, `tohum ${t}: ${tavan(t)}`)
})
```

Run `node --test lib/oyun/tavan.test.ts`: the golden fails, printing the actual number; paste it as the golden. If `tavan_tohumaGoreAzOynar` fails, the spread is larger than 1500: set the bound to the next hundred above the measured max spread (print `Math.max(...)` once) and keep a comment with the measured value.

- [ ] **Step 3: Implement**

`lib/oyun/tavan.ts`:

```ts
function fisTabani(fis: readonly Urun[]): number {
  return fis.length * PUAN.tamKivam + PUAN.sabirBonusu
}
```

and in `tavan` replace the `sis` line with `const sis = misafirler.reduce((t, m) => t + m.fis.length, 0)`. Everything else (sorted bases times `komboCarpani(k) * 2`, porsiyon rozetleri, `geceTamam`) stays; update the doc comment to drop "ayran".

In `sunucu/depoSozlesmesi.ts` (and any other hit from Step 1) replace `[[0, 's0']]` with `[[0, 'ciger']]`.

- [ ] **Step 4: Run the whole headless suite**

Run: `node --test lib/oyun/*.test.ts sunucu/*.test.ts`
Expected: PASS (the MariaDB contract test is opt-in and skips). If a `sunucu` test pins a score or event count from the old rules, update it from the new bot result; do not loosen assertions.

- [ ] **Step 5: Commit**

```bash
git add lib/oyun sunucu
git commit -m "Recompute the score ceiling and server fixtures for the new rules"
```

---

### Task 6: The board: strips, reactions, symbols, dictionary

**Files:**
- Rename: `components/oyun/SeritlerTezgah.tsx` → `SeritlerRaf.tsx`; `SahneTezgah.tsx` → `SahneRaf.tsx`; `SahneTezgah.module.css` → `SahneRaf.module.css`
- Modify: `components/oyun/Seritler.tsx`, `Saha.tsx`, `Saha.module.css`, `ciz.ts`, `tepkiler.ts`, `Semboller.tsx`, `SahneOcak.tsx`, `SahneOcak.module.css`, `SahneSofra.module.css`, `SahneTane.tsx`, `useOyunAlani.ts`, `content/tr/oyun.ts`, `content/en/oyun.ts`
- Test: `npm run typecheck`, `npm test` (the CSS guards `styles/*.test.ts`, `SahneDefs.test.ts`), headless smoke in Step 8

**Interfaces:**
- Consumes: `Goruntu` (Task 4), events (Task 1).
- Produces: `Saha` props `{ dil; tohum; rehberli: boolean; bitince; cik }` (`ipucu` renamed; wired in Task 7); DOM contract used by Task 7: `[data-sofra="0"]` on each table cell, `[data-hedef="ciger"|"dalak"|"yurek"]` on rack buttons, `[data-hedef="o0".."o3"]` on fire slots with `data-ciz="ocak"` and `data-gorunum="bos|pisiyor|hazir|kivam"`.

- [ ] **Step 1: Rename and shrink the rack**

```bash
git mv components/oyun/SeritlerTezgah.tsx components/oyun/SeritlerRaf.tsx
git mv components/oyun/SahneTezgah.tsx components/oyun/SahneRaf.tsx
git mv components/oyun/SahneTezgah.module.css components/oyun/SahneRaf.module.css
```

`SeritlerRaf.tsx` keeps only `Raf`; rack buttons light up when the product is wanted:

```tsx
import { RafTepsisi } from './SahneRaf'
import { Dolgu, Serit, type SeritProps } from './Seritler'
import stil from './SahneRaf.module.css'

export function Raf({ goruntu, ad, dokun, metin }: SeritProps) {
  const ocakDolu = goruntu.ocak.slice(0, goruntu.acikOcak).every(Boolean)
  return (
    <Serit ad="raf" etiket={metin.raf}>
      <div className={stil.ceviz} data-pasif={ocakDolu ? '' : undefined}>
        <svg className={stil.damar} aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#fWood)" />
        </svg>
        {goruntu.raf.map((urun) => (
          <button
            key={urun}
            type="button"
            className={stil.rafUrun}
            data-hedef={urun}
            data-istenen={goruntu.rafIstenen.includes(urun) ? '' : undefined}
            onClick={(e) => dokun(urun, e.currentTarget)}
          >
            <RafTepsisi urun={urun} />
            <span>{ad(urun)}</span>
            <Dolgu />
          </button>
        ))}
      </div>
      <span className={stil.rafAlt} aria-hidden="true" />
    </Serit>
  )
}
```

`SahneRaf.tsx`: delete `TezgahTabagi`, `TezgahUrunu`, `BakirMasrapa`, `AcikYayik`, `SIS_X` and the `Tane` import if unused; keep `RafTepsisi` and `TEPSI`. Fix the header comment to "Rafın boyalı parçası: raf tepsisi."

`SahneRaf.module.css`: keep `.ceviz`, `.damar`, `.rafUrun` (and its `[data-pasif]` rules), `.tepsi`, `.rafAlt`; delete every other rule (mermer, tabak, slotlar, tezgah*, urun, soguma, yayik*, ayranYuzeyi, pirincKenar). Add the wanted-product pulse inside this module (keyframes stay here):

```css
/* Misafirin beklediği ürün: kenar nabız atar. Hareket azaltılmışta global kural animasyonu keser, kenar sabit kalır. */
.rafUrun[data-istenen] {
  outline: 2px solid var(--bakir);
  outline-offset: -2px;
  animation: istenen 1.4s ease-in-out infinite;
}

@keyframes istenen {
  0%, 100% { outline-color: var(--bakir-40); }
  50% { outline-color: var(--bakir-acik); }
}
```

- [ ] **Step 2: Rework `Seritler.tsx`**

- Replace `DugmeKatmanlari` with `Dolgu` (the `ipucu` dot is gone):

```tsx
/** Dokunma dolgusu: `tepkiler.ts` 120 ms'lik opaklık animasyonunu bunda oynatır. */
export function Dolgu() {
  return <span className={stil.dolgu} data-dolgu aria-hidden="true" />
}
```

- `Serit` gets `dokunulur?: boolean` (default true); when false it renders without `data-serit`, `onKeyDown`, `onFocus`. The sofra strip passes `dokunulur={false}`.
- `Sofra` becomes a non-interactive group:

```tsx
function sofraEtiketi(metin: Metin, no: number, sofra: SofraProps['sofra'], ad: SofraProps['ad']): string {
  if (!sofra) return `${metin.sofra} ${no + 1}: ${metin.bosSofra}`
  return `${metin.sofra} ${no + 1}: ${sofra.kalan.map(ad).join(', ')}`
}

function Sofra({ no, sofra, ad, metin }: SofraProps) {
  return (
    <div
      role="group"
      className={sofraStil.sofra}
      data-sofra={no}
      data-bos={sofra ? undefined : ''}
      aria-label={sofraEtiketi(metin, no, sofra, ad)}
    >
      <SofraPlakasi />
      <IkramTabaklari />
      <span className={sofraStil.halka} data-ciz="sabir" data-no={no} aria-hidden="true">
        <KorHalkasi />
      </span>
      {sofra && <Fis sofra={sofra} />}
      <span className={sofraStil.kalkti} data-kalkti aria-hidden="true">
        <KalktiHalkasi />
        <KalktiIsareti boy={24} />
      </span>
    </div>
  )
}
```

with `SofraProps = Omit<SeritProps, 'goruntu' | 'dokun'> & { no: number; sofra: Goruntu['sofralar'][number] }`; `Sofralar` loses the `vurgu` prop and passes `{...kalan}` (minus `dokun`).
- `Yuva`: delete the `data-cevirme` attribute, the `--centik` custom property, the `<span className={ocakStil.cevir}>` with `CevirmeIsareti`, and the `<span className={ocakStil.centik} />` rail mark. The slot button's `aria-label` stays `${metin.ocak} ${no + 1}: ${ad}`. Replace the trailing `<DugmeKatmanlari />` with `<Dolgu />`.
- Update the file header comment: "sofralar ve ocak burada, raf `SeritlerRaf.tsx`".

- [ ] **Step 3: `Saha.tsx` and layout CSS**

In `Saha.tsx`: import `Raf` from `./SeritlerRaf`, drop `Tezgah`, `dokunus`, the `vurgu` state, its effect and `vurgula`; rename the prop `ipucu` → `rehberli` (unused until Task 7: pass it nowhere yet; keep it in `Props` so `OyunSayfasi` compiles, and let Task 7 consume it). `ad` loses the ayran branch: `const ad = (u: Urun): string => s.menu.ocakbasi.urunler[u].ad`. The render becomes `Hud`, `<Sofralar {...serit} />`, `<Ocak {...serit} />`, `<Raf {...serit} />`.

`Saha.module.css`: (1) header comment "Dikey akış HUD, Sofra, Ocak (esner), Raf"; (2) the entrance comment lists three stations and delete the `nth-of-type(4)` rule; (3) delete `.ipucu` and `.saha [data-ipucu] .ipucu`; (4) delete any `.tezgah*`/`.dolu` rule that only the counter used (keep `.dolu` if `tepkiler.ts` still uses `stil.dolu` for the rack: yes, `salla` does). After editing run the dead-class check:

```bash
for css in components/oyun/*.module.css; do for c in $(grep -oE '^\.[a-zA-Z][a-zA-Z0-9]*' "$css" | tr -d . | sort -u); do grep -rqE "(stil|Stil)\.$c\b|\[stil\.$c\]|'$c'" components/oyun --include='*.tsx' --include='*.ts' || echo "$css .$c"; done; done
```

Expected: no output for classes you removed usage of; every remaining line is either a class referenced through a different binding name (verify with `grep -rn "\.$c" components/oyun`) or dead and must be deleted.

`SahneSofra.module.css`: the plates are visible whenever the table is occupied: replace `.sofra[data-kurulu] .tabak` with `.sofra:not([data-bos]) .tabak`, delete `.sofra[data-vurgu]::after` and its comment, and delete the `tabaklarIner` assumptions in `tepkiler.ts` (Step 5). `SahneOcak.module.css`: delete `.cevir`, `.centik` (and the `[data-cevirme]` and `[data-gorunum='centik']` rules), and add the ready ring:

```css
/* Alma penceresi açık: altın halka nabız atar ("bana dokun", spec sade §3). Tam kıvamda halka sıkılaşır. */
.yuva[data-gorunum='hazir'],
.yuva[data-gorunum='kivam'] {
  outline: 2px solid var(--bakir-acik);
  outline-offset: -2px;
  animation: hazirNabiz 0.9s ease-in-out infinite;
}

.yuva[data-gorunum='kivam'] {
  outline-width: 3px;
}

@keyframes hazirNabiz {
  0%, 100% { outline-color: var(--bakir-60); }
  50% { outline-color: var(--bakir-acik); }
}
```

If `SahneOcak.module.css` already styles `[data-gorunum='hazir']`/`'kivam'` (read the file first), merge instead of duplicating.

- [ ] **Step 4: `ciz.ts` and `useOyunAlani.ts`**

`ciz.ts`: remove the imports of `AYRAN_TIK`, `SOGUMA_TIK`, `Hedef`; in `ogeyiCiz` delete `const kalem = oyun.tezgah[no]` and the `'soguma'` and `'ayran'` cases; change `sahayiCiz` to:

```ts
/** Bütün `data-ciz` öğeleri ve evre niteliği. */
export function sahayiCiz(alan: HTMLElement, oyun: Oyun, azalt: boolean): void {
  for (const el of alan.querySelectorAll<HTMLElement>('[data-ciz]')) ogeyiCiz(el, oyun, azalt)
  nitelikYaz(alan, 'evre', String(oyun.evre))
}
```

`ocagiCiz` is unchanged (it already writes `data-gorunum` from `sisGorunumu`; `'bos'` when empty).

`useOyunAlani.ts`: remove the `ipucuHedefi` import and the `ipucu` option; call `sahayiCiz(alan, oyun, azalt)`; update the keyboard comment to "1-4 ocak yuvası". The `Secenek` type loses `ipucu`. (`Saha` stops passing it.)

- [ ] **Step 5: `tepkiler.ts`**

Delete `tabaklarIner`, `cevir`, `DONUS`, the `sofraKuruldu`, `sisCevrildi` and `tezgahDolu` cases. Servis flight now starts at the fire slot (the `servis` event carries `yuva`; events arrive before React re-renders, so the slot still shows the skewer):

```ts
/** Şiş ocak yuvasından sofraya kavisle uçar (250 ms), fiş oturur; azaltılmışta çapraz geçiş. */
function servisUcusu(alan: HTMLElement, yuva: number, sofra: HTMLElement | null, azalt: boolean): void {
  const kaynak = alan.querySelector<HTMLElement>(`[data-hedef="o${yuva}"] [data-sis] svg`)
  if (!sofra || !kaynak) return
  // ...body unchanged except: `kalem` → `kaynak`
}
```

(Rename the local `kalem` to `kaynak`; the geometry code stays.) New cases in `olayaTepki`:

```ts
    case 'sisErken':
      return salla(hedef(alan, `o${olay.yuva}`), azalt)
    case 'sisBosa':
      return yanik(hedef(alan, `o${olay.yuva}`))
    case 'servis':
      return servisUcusu(alan, olay.yuva, hedef(alan, `s${olay.sofra}`), azalt)
```

`hedef(alan, 's0')` no longer exists (`data-hedef` left the sofra cells): add `const sofraOgesi = (alan: HTMLElement, no: number) => alan.querySelector<HTMLElement>(`[data-sofra="${no}"]`)` and use it for `servis`, `fisTamam` and `sofraKalkti`. Fix the header comment ("tabaklar" and "tezgah kalemi" mentions). Remove `PUAN.tamKivam` import only if unused (the `+150` flyer still uses it).

- [ ] **Step 6: Symbols, `SahneTane`, dictionary**

`Semboller.tsx`: delete `CevirmeIsareti`, `TezgahDoluIsareti` and `KorNoktasi` (and the `ipucu` comment). `SahneTane.tsx`: its `SisUrun` export is gone after the rename in Task 1; fix its consumers.

`content/tr/oyun.ts`: delete `tezgah`, `kurulu`, `duyuru.sogudu`; add:

```ts
    sisBosa: 'Şiş boşa gitti',
```

inside `duyuru`, and change `gonderim.sira` to `'Sıralamaya yazıldı: sıra {sira}'`. `content/en/oyun.ts`: delete `tezgah`, `kurulu`, `duyuru.sogudu`; add `sisBosa: 'Skewer wasted'`; `gonderim.sira: 'Added to the ranking: rank {sira}'`. (The guide and entry strings are added in Tasks 7 and 8.)

- [ ] **Step 7: Run typecheck and tests**

Run: `npm run typecheck && npm test`
Expected: PASS. Fix every error it names (unused imports, removed props). `SahneDefs.test.ts` must still pass: the counter's gradients `gBakirTabak`, `gAyran`, `fMarble` may now be unreferenced: grep each `url(#…)` id in `SahneDefs.tsx` against its users and delete defs no component uses (the test only fails on undefined references or a second `<defs>`, but dead defs are dead code).

- [ ] **Step 8: Headless smoke**

Build and serve on a fresh port, then drive one round headlessly (Playwright 1.62.1 from the `_npx` path in the `olcum-harnesi` memory):

```bash
npm run build && (python3 -m http.server 8412 --directory "$PWD/out" >/tmp/bozo-oyun/sade/serve.log 2>&1 &)
```

`/tmp/bozo-oyun/sade/tahta.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'

const tarayici = await chromium.launch()
const sayfa = await tarayici.newPage({ viewport: { width: 390, height: 844 } })
const hatalar = []
sayfa.on('pageerror', (e) => hatalar.push(String(e)))
sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
await sayfa.route('**/api.cigercibozo.com/**', (r) => r.abort())
await sayfa.goto('http://localhost:8412/oyun/')
await sayfa.getByRole('button', { name: 'Oyna' }).click()
await sayfa.waitForSelector('[data-sofra="0"]')
const durum = await sayfa.evaluate(() => ({
  sofraDugmesi: document.querySelectorAll('[data-sofra] button, button[data-sofra]').length,
  tezgah: document.querySelectorAll('[data-tezgah]').length,
  yayik: document.querySelectorAll('[data-hedef="ayran"]').length,
  rafDugmesi: document.querySelectorAll('[data-hedef="ciger"]').length,
  yuva: document.querySelectorAll('[data-ciz="ocak"]').length,
}))
console.log(durum, hatalar)
await tarayici.close()
if (hatalar.length || durum.sofraDugmesi || durum.tezgah || durum.yayik || durum.rafDugmesi !== 1) process.exit(1)
```

Run: `node /tmp/bozo-oyun/sade/tahta.mjs`
Expected: exit 0, no page errors, `sofraDugmesi: 0, tezgah: 0, yayik: 0, rafDugmesi: 1`.

- [ ] **Step 9: Commit**

```bash
git add -A components content
git commit -m "Reduce the board to table, fire and rack"
```

---

### Task 7: The guided first round on the game screen

**Files:**
- Create: `components/oyun/useRehber.ts`, `components/oyun/Rehber.tsx`, `components/oyun/Rehber.module.css`
- Modify: `components/oyun/Semboller.tsx` (add `ElIsareti`), `components/oyun/useOyunDongusu.ts`, `components/oyun/useOyunAlani.ts`, `components/oyun/Saha.tsx`, `components/oyun/OyunSayfasi.tsx`, `components/oyun/useOyunAkisi.ts` (rename `Tur.ipucu` → `Tur.rehberli`), `content/tr/oyun.ts`, `content/en/oyun.ts`

**Interfaces:**
- Consumes: `lib/oyun/rehber.ts` (Task 4), the DOM contract of Task 6, `ilkTurMu`/`ilkTurBitti` from `defter.ts`.
- Produces: `useRehber(etkin: boolean)` returning `{ rehber: Rehber; durdur: () => boolean; izin: (hedef: Hedef, oyun: Oyun) => boolean; izle: (oyun: Oyun, olaylar: readonly Olay[]) => void; tamam: () => void; atla: () => void }`; `useOyunDongusu` options gain `durdur: () => boolean` and `izle: (oyun: Oyun, olaylar: readonly Olay[]) => void`, and the hook returns `oyunu: () => Oyun`.

- [ ] **Step 1: Dictionary**

`content/tr/oyun.ts` add (every sentence at most six words):

```ts
  rehber: {
    fis: 'Misafir ciğer istiyor',
    raf: 'Ciğer şişini ocağa koy',
    pisiyor: 'Şiş pişiyor. Altın olunca dokun',
    hazir: 'Şimdi dokun!',
    odendi: 'Afiyet olsun! Misafir ödedi',
    tamam: 'Tamam',
    atla: 'Atla',
  },
```

`content/en/oyun.ts`:

```ts
  rehber: {
    fis: 'The guest wants liver',
    raf: 'Put the liver on the fire',
    pisiyor: 'It cooks. Tap when golden',
    hazir: 'Tap now!',
    odendi: 'Enjoy! The guest paid',
    tamam: 'Got It',
    atla: 'Skip',
  },
```

- [ ] **Step 2: Loop hook**

`useOyunDongusu.ts`: extend `Secenek` and the frame loop. A paused guide step processes exactly one tick when a tap is queued (so the tap takes effect) and otherwise freezes time and discards the accumulated frame time:

```ts
type Secenek = {
  tohum: number
  ciz: (oyun: Oyun, ilerledi: boolean) => void
  tepki: (olaylar: Olay[]) => void
  bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void
  /** Rehber saati durdurdu mu; durduğunda yalnız bekleyen dokunuş bir tik işletir. */
  durdur: () => boolean
  /** Her karede, o karenin olaylarıyla (rehber adımı ilerler). */
  izle: (oyun: Oyun, olaylar: readonly Olay[]) => void
}
```

In `kare`:

```ts
      const sonuc = adimSayisi(birikim, simdi - onceki)
      onceki = simdi
      const duruyor = durdur()
      const adim = duruyor ? Math.min(canli.bekleyen.length, 1) : sonuc.adim
      birikim = duruyor ? 0 : sonuc.birikim
      const olaylar: Olay[] = []
      for (let i = 0; i < adim && !canli.oyun.bitti; i++) olaylar.push(...canliAdim(canli))
      kareSonu(olaylar, adim)
```

and in `kareSonu` call `izle(canli.oyun, olaylar)` before `ciz`. Add `oyunu: () => canli.oyun` to the returned object. (The effect closure reads `durdur`/`izle` through `useEffectEvent`, like `kareSonu`: wrap `durdur` as `const durduruyor = useEffectEvent(durdur)` so the effect does not capture a stale function.)

- [ ] **Step 3: `useRehber.ts`**

```ts
import { useEffect, useRef, useState } from 'react'
import { ilkTurBitti } from '@/lib/oyun/defter'
import {
  rehberAtla, rehberBasla, rehberDurdurur, rehberIlerle, rehberIzni, rehberTamam, type Rehber,
} from '@/lib/oyun/rehber'
import type { Hedef, Olay, Oyun } from '@/lib/oyun/tipler'

const BITTI: Rehber = { adim: 'bitti', bas: 0 }

/** Rehberin canlı durumu: döngü ref'ten okur (eski kapanış yok), ekran state'ten çizer. */
export function useRehber(etkin: boolean) {
  const guncel = useRef<Rehber>(etkin ? rehberBasla() : BITTI)
  const [rehber, setRehber] = useState<Rehber>(guncel.current)

  const yaz = (yeni: Rehber) => {
    if (yeni === guncel.current) return
    guncel.current = yeni
    setRehber(yeni)
  }

  useEffect(() => {
    if (etkin && rehber.adim === 'bitti') ilkTurBitti()
  }, [etkin, rehber.adim])

  return {
    rehber,
    durdur: () => rehberDurdurur(guncel.current),
    izin: (hedef: Hedef, oyun: Oyun) => rehberIzni(guncel.current, hedef, oyun),
    izle: (oyun: Oyun, olaylar: readonly Olay[]) => yaz(rehberIlerle(guncel.current, oyun, olaylar)),
    tamam: () => yaz(rehberTamam(guncel.current)),
    atla: () => yaz(rehberAtla(guncel.current)),
  }
}
```

- [ ] **Step 4: Wire it into `useOyunAlani` and `Saha`**

`useOyunAlani` takes `rehberli: boolean` instead of `ipucu`, creates `const rehber = useRehber(rehberli)`, passes `durdur: rehber.durdur, izle: rehber.izle` to `useOyunDongusu`, and filters taps:

```ts
  const dokun = (hedef: Hedef, el: HTMLElement | null) => {
    if (!rehber.izin(hedef, dongu.oyunu())) return
    ses.uyandir()
    dongu.dokun(hedef)
    dokunus(el, azalt)
  }
```

It returns `rehber` alongside the rest. `Saha` renders, after `Raf` and before the pause curtain:

```tsx
      {rehber.rehber.adim !== 'bitti' && (
        <Rehber alan={kok} adim={rehber.rehber.adim} metin={s.oyun.rehber} tamam={rehber.tamam} atla={rehber.atla} />
      )}
```

(destructure `rehber` from `useOyunAlani` under a clearer name, e.g. `const { rehber: rh, ... }`; pick names so the JSX reads `rh.rehber.adim` → rename the hook's return field to `durum` if it reads better). `OyunSayfasi` passes `rehberli={tur.rehberli}`; in `useOyunAkisi.ts` rename `Tur.ipucu` → `Tur.rehberli` (3 places).

- [ ] **Step 5: `ElIsareti` and the overlay**

`Semboller.tsx`: add a pointing-hand symbol in the same style as its siblings (24 px grid, `currentColor` stroke):

```tsx
/** Rehberin işaret eli: parmak yukarı bakar. */
export function ElIsareti({ boy }: Boy) {
  return (
    <svg width={boy} height={boy} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10" />
      <path d="M12 10V8.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M15 11V10a1.5 1.5 0 0 1 3 0v4.5c0 3.6-2.4 6-5.5 6H12c-2.2 0-3.5-1-4.6-2.6L4.7 13.6a1.5 1.5 0 0 1 2.5-1.6L9 14" />
    </svg>
  )
}
```

`components/oyun/Rehber.tsx`:

```tsx
import { useLayoutEffect, useState, type RefObject } from 'react'
import type { Sozluk } from '@/content'
import type { RehberAdimi } from '@/lib/oyun/rehber'
import { ElIsareti } from './Semboller'
import stil from './Rehber.module.css'

type Metin = Sozluk['oyun']['rehber']
type Props = {
  alan: RefObject<HTMLElement | null>
  adim: Exclude<RehberAdimi, 'bitti' | 'bekle'>
  metin: Metin
  tamam: () => void
  atla: () => void
}

const HEDEF: Record<Props['adim'], string> = {
  fis: '[data-sofra="0"]',
  raf: '[data-hedef="ciger"]',
  pisiyor: '[data-ciz="ocak"]:not([data-gorunum="bos"])',
  hazir: '[data-ciz="ocak"]:not([data-gorunum="bos"])',
  odendi: '[data-sofra="0"]',
}

type Kutu = { sol: number; ust: number; en: number; boy: number; altta: boolean }

const PAY = 6

/** Hedefin saha içindeki dikdörtgeni; balonun alta mı üste mi gideceği hedefin yarıya göre konumundan. */
function olc(alan: HTMLElement, secici: string): Kutu | null {
  const hedef = alan.querySelector<HTMLElement>(secici)
  if (!hedef) return null
  const a = alan.getBoundingClientRect()
  const h = hedef.getBoundingClientRect()
  return {
    sol: h.left - a.left - PAY,
    ust: h.top - a.top - PAY,
    en: h.width + 2 * PAY,
    boy: h.height + 2 * PAY,
    altta: h.top - a.top + h.height / 2 < a.height / 2,
  }
}

/**
 * Oyun alanının üstünde karartma, tek açık delik, nabız atan el ve tek cümlelik balon (spec sade §3).
 * Katman tıklamayı yutmaz: yanlış dokunuşu `rehberIzni` süzer. Yalnız "Tamam" ve "Atla" düğmesi tıklanır.
 */
export function Rehber({ alan, adim, metin, tamam, atla }: Props) {
  const [kutu, setKutu] = useState<Kutu | null>(null)

  useLayoutEffect(() => {
    const kok = alan.current
    if (!kok) return
    const guncelle = () => setKutu(olc(kok, HEDEF[adim]))
    guncelle()
    const izleyici = new ResizeObserver(guncelle)
    izleyici.observe(kok)
    return () => izleyici.disconnect()
  }, [alan, adim])

  if (!kutu) return null
  const balon = kutu.altta ? { top: kutu.ust + kutu.boy + 56 } : { bottom: `calc(100% - ${kutu.ust}px + 56px)` }
  return (
    <div className={`${stil.rehber} ${stil.rehber}`} data-rehber={adim}>
      <span className={stil.delik} style={{ left: kutu.sol, top: kutu.ust, width: kutu.en, height: kutu.boy }} />
      <span
        className={stil.el}
        style={{ left: kutu.sol + kutu.en / 2, top: kutu.altta ? kutu.ust + kutu.boy : kutu.ust - 40 }}
        data-ust={kutu.altta ? undefined : ''}
      >
        <ElIsareti boy={36} />
      </span>
      <p className={stil.balon} style={balon} role="status">
        {metin[adim]}
        {adim === 'fis' && (
          <button type="button" className={stil.tamam} onClick={tamam}>
            {metin.tamam}
          </button>
        )}
      </p>
      <button type="button" className={stil.atla} onClick={atla}>
        {metin.atla}
      </button>
    </div>
  )
}
```

`Rehber.module.css` (the doubled `.rehber.rehber` selector beats `.saha > *`):

```css
/* Karartma delik kutusunun gölgesinden gelir; katman tıklamayı yutmaz. */
.rehber.rehber {
  position: absolute;
  inset: 0;
  z-index: 5;
  overflow: hidden;
  pointer-events: none;
}

.delik {
  position: absolute;
  border-radius: 6px;
  box-shadow: 0 0 0 100vmax color-mix(in srgb, var(--zemin) 78%, transparent);
  outline: 2px solid var(--bakir-acik);
}

.el {
  position: absolute;
  translate: -50% 0;
  color: var(--krem);
  line-height: 0;
  animation: sok 1.1s ease-in-out infinite;
}

.el[data-ust] {
  rotate: 180deg;
}

@keyframes sok {
  0%, 100% { margin-top: 0; }
  50% { margin-top: 8px; }
}

.balon {
  position: absolute;
  left: 16px;
  right: 16px;
  margin: 0;
  padding: 12px 16px;
  background: var(--komur);
  border: 1px solid var(--bakir-60);
  border-radius: 3px;
  color: var(--krem);
  font: 500 17px/1.3 var(--font-govde);
  text-align: center;
}

.tamam,
.atla {
  pointer-events: auto;
  min-height: 44px;
  min-width: 44px;
  font: 600 15px/1 var(--font-govde);
  color: var(--krem);
}

.tamam {
  display: block;
  margin: 10px auto 0;
  padding: 0 20px;
  background: var(--kor);
  border-radius: 3px;
}

.atla {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0 14px;
  background: var(--krem-dolgu);
  border: 1px solid var(--cizgi-buton);
  border-radius: 3px;
}
```

(Check the body-font variable name against `Hud.module.css` and use the same; `--font-govde` is a placeholder only if that file uses another name.) Reduced motion: the global rule turns the hand bob off, and the balloon needs no opacity animation to be readable; no extra code.

- [ ] **Step 6: Typecheck, tests, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: PASS.

- [ ] **Step 7: Headless guide run**

`/tmp/bozo-oyun/sade/rehber.mjs` (served `out/` on 8412, offline server so the round is local; fresh `localStorage` means the guide shows):

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'

const tarayici = await chromium.launch()
const sayfa = await tarayici.newPage({ viewport: { width: 390, height: 844 } })
const hatalar = []
sayfa.on('pageerror', (e) => hatalar.push(String(e)))
await sayfa.route('**/api.cigercibozo.com/**', (r) => r.abort())
await sayfa.goto('http://localhost:8412/oyun/')
await sayfa.getByRole('button', { name: 'Oyna' }).click()

const adim = () => sayfa.evaluate(() => document.querySelector('[data-rehber]')?.getAttribute('data-rehber') ?? null)
const saat = () => sayfa.evaluate(() => document.querySelector('[data-ciz="saat"]')?.textContent)
const bekleAdim = (a) => sayfa.waitForFunction((x) => document.querySelector('[data-rehber]')?.getAttribute('data-rehber') === x, a, { timeout: 15000 })

await bekleAdim('fis')
const s1 = await saat()
await sayfa.waitForTimeout(1500)
if ((await saat()) !== s1) throw new Error('fis adımında saat aktı')
await sayfa.locator('[data-hedef="dalak"]').click({ force: true }).catch(() => {})
if ((await adim()) !== 'fis') throw new Error('yanlış dokunuş adımı değiştirdi')
await sayfa.getByRole('button', { name: 'Tamam' }).click()
await bekleAdim('raf')
await sayfa.locator('[data-hedef="o0"]').click({ force: true })
if ((await adim()) !== 'raf') throw new Error('raf adımında ocağa dokunuş işledi')
await sayfa.locator('[data-hedef="ciger"]').click({ force: true })
await bekleAdim('pisiyor')
await bekleAdim('hazir')
const s4 = await saat()
await sayfa.waitForTimeout(1500)
if ((await saat()) !== s4) throw new Error('hazır adımında saat aktı')
await sayfa.locator('[data-hedef="o0"]').click({ force: true })
await bekleAdim('odendi')
await sayfa.waitForFunction(() => !document.querySelector('[data-rehber]'), null, { timeout: 8000 })
const ikinci = await sayfa.evaluate(() => localStorage.getItem('bozo-oyun-ilk-tur-bitti'))
console.log({ ikinci, hatalar })
await tarayici.close()
if (ikinci !== '1' || hatalar.length) process.exit(1)
```

Run: `node /tmp/bozo-oyun/sade/rehber.mjs`
Expected: exit 0 (the six steps in order, clock frozen at `fis` and `hazir`, wrong taps ignored, `ilk-tur-bitti` written). Then a second script `rehber-atla.mjs` that clicks `Atla` at step `fis`, expects `[data-rehber]` gone and `bozo-oyun-ilk-tur-bitti` equal `'1'`; and run the first script again in a context with `reducedMotion: 'reduce'` (`browser.newContext({ reducedMotion: 'reduce' })`) expecting the same result.

- [ ] **Step 8: Commit**

```bash
git add -A components content lib
git commit -m "Teach the first round on the game screen with a guided overlay"
```

---

### Task 8: Optional nickname on the entry screen

**Files:**
- Create: `lib/oyun/giris.ts`, `lib/oyun/giris.test.ts`
- Modify: `components/oyun/GirisEkrani.tsx`, `GirisEkrani.module.css`, `GirisTablosu.tsx`, `OyunSayfasi.tsx`, `useOyunAkisi.ts`, `content/tr/oyun.ts`, `content/en/oyun.ts`

**Interfaces:**
- Consumes: `Hesap` (`defter.ts`), `takmaAdBicimiGecerliMi`, `takmaAdDuzelt`, `api.tabloAl`, existing `kaydet`/`gonder`.
- Produces: `gonderimKarari(turId: string | null, hesap: Hesap | null, takmaAd: string | null): 'cevrimdisi' | 'gonder' | 'kaydet' | 'sor'`; `useOyunAkisi` gains `sunucu: 'bakiliyor' | 'var' | 'yok'`, `tablo: TabloYaniti | null`, `basla(takmaAd: string | null)`; `Tur` gains `takmaAd: string | null`.

- [ ] **Step 1: Write the failing decision test**

`lib/oyun/giris.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gonderimKarari } from './giris.ts'

const HESAP = { anahtar: 'a'.repeat(32), takmaAd: 'Bozo Usta' }

test('gonderimKarari_turIdYoksa_cevrimdisi', () => {
  assert.equal(gonderimKarari(null, HESAP, 'Bozo Usta'), 'cevrimdisi')
  assert.equal(gonderimKarari(null, null, null), 'cevrimdisi')
})

test('gonderimKarari_kayitliHesapAyniAdVeyaBos_dogrudanGonderir', () => {
  assert.equal(gonderimKarari('t', HESAP, 'Bozo Usta'), 'gonder')
  assert.equal(gonderimKarari('t', HESAP, null), 'gonder')
})

test('gonderimKarari_hesapYokAdVar_kaydedipGonderir', () => {
  assert.equal(gonderimKarari('t', null, 'Yeni Ad'), 'kaydet')
})

test('gonderimKarari_hesapVarFarkliAd_yeniHesapKaydeder', () => {
  assert.equal(gonderimKarari('t', HESAP, 'Baska Ad'), 'kaydet')
})

test('gonderimKarari_hesapYokAdYok_sonucEkranindaSorar', () => {
  assert.equal(gonderimKarari('t', null, null), 'sor')
})
```

Run: `node --test lib/oyun/giris.test.ts` → FAIL (module missing).

- [ ] **Step 2: Implement the decision**

`lib/oyun/giris.ts`:

```ts
import type { Hesap } from './defter.ts'

export type GonderimKarari = 'cevrimdisi' | 'gonder' | 'kaydet' | 'sor'

/**
 * Tur bitince skor ne olur (spec sade §3): jeton yoksa çevrimdışı; kayıtlı hesap aynı adla ya da adsız
 * doğrudan gönderir; giriş ekranında yazılan yeni ad hesap açıp gönderir; ad yoksa sonuç ekranı sorar.
 */
export function gonderimKarari(turId: string | null, hesap: Hesap | null, takmaAd: string | null): GonderimKarari {
  if (!turId) return 'cevrimdisi'
  if (hesap && (takmaAd === null || takmaAd === hesap.takmaAd)) return 'gonder'
  return takmaAd === null ? 'sor' : 'kaydet'
}
```

Run: `node --test lib/oyun/giris.test.ts` → PASS.

- [ ] **Step 3: Flow in `useOyunAkisi.ts`**

- Add the server probe and share it with the leaderboard block (one request, not two):

```ts
export type Sunucu = 'bakiliyor' | 'var' | 'yok'

/** Giriş ekranı açılınca sıralama ucuna bir kez bakılır: ad alanı yalnız sunucu varken görünür. */
function useSunucu() {
  const [durum, setDurum] = useState<{ sunucu: Sunucu; tablo: TabloYaniti | null }>({ sunucu: 'bakiliyor', tablo: null })
  useEffect(() => {
    let iptal = false
    api.tabloAl().then(
      (tablo) => !iptal && setDurum({ sunucu: 'var', tablo }),
      () => !iptal && setDurum({ sunucu: 'yok', tablo: null }),
    )
    return () => {
      iptal = true
    }
  }, [])
  return durum
}
```

- `Tur` gains `takmaAd: string | null`; `jetonIste(takmaAd)` copies it into both return branches.
- `basla(takmaAd: string | null)` passes it to `jetonIste`.
- `kaydet(takmaAd, bekleyen)` takes the pending tour explicitly (the `son` state is not set yet when `bitir` runs):

```ts
  const kaydet = async (takmaAd: string, bekleyen: { turId: string; kayit: readonly Girdi[] } | null): Promise<Kayit> => {
    // ...unchanged body...
    if (bekleyen) void gonder(bekleyen.turId, bekleyen.kayit, yeniHesap)
    return 'tamam'
  }
```

and the existing result-screen caller passes `son?.turId ? { turId: son.turId, kayit: son.kayit } : null`.
- `bitir` uses the decision:

```ts
  const bitir = (sonuc: Sonuc, kayit: readonly Girdi[]) => {
    const onceki = enIyiOku()
    const yeni = enIyiYaz(sonuc.puan)
    ilkTurBitti()
    const turId = tur?.turId ?? null
    setSon({ sonuc, kayit, turId, onceki, yeni })
    setEkran('sonuc')
    switch (gonderimKarari(turId, hesap, tur?.takmaAd ?? null)) {
      case 'cevrimdisi':
        return setGonderim({ durum: 'cevrimdisi' })
      case 'sor':
        return setGonderim({ durum: 'bekliyor' })
      case 'gonder':
        return void gonder(turId as string, kayit, hesap as Hesap)
      case 'kaydet':
        return void kaydetVeGonder(tur?.takmaAd as string, turId as string, kayit)
    }
  }
```

with

```ts
  /** Giriş ekranındaki ad: hesabı açıp turu gönderir; ad reddedilir ya da ağ düşerse sonuç ekranındaki düğmeye döner. */
  const kaydetVeGonder = async (takmaAd: string, turId: string, kayit: readonly Girdi[]) => {
    setGonderim({ durum: 'gonderiliyor' })
    if ((await kaydet(takmaAd, { turId, kayit })) !== 'tamam') setGonderim({ durum: 'bekliyor' })
  }
```

(`useGonderim` exposes `kaydet`; `kaydetVeGonder` lives in the same hook or in `useOyunAkisi` next to `bitir`; either is fine, keep each function under 50 lines.) Return `sunucu`, `tablo` and `hesap` from the hook so the entry screen can pre-fill from `hesap?.takmaAd`.

- [ ] **Step 4: Entry screen**

`GirisTablosu.tsx`: take `tablo: TabloYaniti | null` as a prop and delete its own `useEffect`/`api` call and `useState`.

`GirisEkrani.tsx`: props `{ dil; basla: (takmaAd: string | null) => void; bekliyor: boolean; sunucu: Sunucu; hesapAdi: string | null; tablo: TabloYaniti | null }`.

```tsx
export function GirisEkrani({ dil, basla, bekliyor, sunucu, hesapAdi, tablo }: Props) {
  const s = sozluk(dil)
  const [ad, setAd] = useState(hesapAdi ?? '')
  const [hata, setHata] = useState(false)
  // Hesap tarayıcıdan geç okunur: alan henüz dokunulmadıysa hazır ad dolar.
  useEffect(() => setAd((onceki) => (onceki === '' && hesapAdi ? hesapAdi : onceki)), [hesapAdi])

  const oyna = () => {
    const duzgun = takmaAdDuzelt(ad)
    if (duzgun === '') return basla(null)
    if (sunucu !== 'var') return basla(null)
    if (!takmaAdBicimiGecerliMi(duzgun)) return setHata(true)
    basla(duzgun)
  }

  return (
    <OyunAcilisi
      baslik={s.oyun.baslik}
      cumle={s.ana.gece.baslik}
      baglantilar={<GirisBaglantilari dil={dil} />}
      altinda={<GirisTablosu dil={dil} tablo={tablo} />}
    >
      {sunucu === 'var' && (
        <div className={stil.ad}>
          <label className={stil.adEtiket} htmlFor="giris-takma-ad">{s.oyun.giris.takmaAd}</label>
          <input
            id="giris-takma-ad"
            className={stil.adAlani}
            value={ad}
            onChange={(e) => { setAd(e.target.value); setHata(false) }}
            maxLength={TAKMA_AD_EN_COK}
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            aria-invalid={hata ? true : undefined}
            aria-describedby={hata ? 'giris-ad-kural giris-ad-bilgi' : 'giris-ad-bilgi'}
          />
          <p id="giris-ad-bilgi" className={stil.adBilgi}>{s.oyun.katilim.aciklama}</p>
          {hata && <p id="giris-ad-kural" className={stil.adHata} role="alert">{s.oyun.katilim.kural}</p>}
        </div>
      )}
      <button type="button" className={stil.oyna} onClick={oyna} disabled={bekliyor}>
        {s.oyun.oyna}
      </button>
    </OyunAcilisi>
  )
}
```

`GirisEkrani.module.css` adds `.ad`, `.adEtiket`, `.adAlani` (44 px min height, `--komur` ground, `--cizgi-buton` border, `--krem` text, 16 px font so iOS does not zoom), `.adBilgi` (small `--krem-70`), `.adHata` (`--krem`, not ember: ember is never text). `OyunSayfasi` passes `sunucu={akis.sunucu}`, `hesapAdi={akis.hesap?.takmaAd ?? null}`, `tablo={akis.tablo}`, `basla={akis.basla}`.

The notice line under the field is the existing `katilim.aciklama` ("Takma adın ve turların Türkiye'deki sunucumuzda tutulur; takma adın herkese açık sıralamada görünür."): typing a name and pressing Oyna is the opt-in, exactly as pressing "Kaydet ve Katıl" was. The consent wording is the owner's to approve at go-live (spec §3); this task does not change it.

Dictionary: `content/tr/oyun.ts` `giris: { takmaAd: 'Takma adın (isteğe bağlı)' }`, `content/en/oyun.ts` `giris: { takmaAd: 'Nickname (optional)' }`.

- [ ] **Step 5: Typecheck, tests, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: PASS.

- [ ] **Step 6: Headless runs with a fake server**

`/tmp/bozo-oyun/sade/ad.mjs` (served `out/` on 8412). Three scenarios, each in a fresh context, with `page.route('**/api.cigercibozo.com/**', …)` fulfilling JSON:

1. **Server down** (`route.abort()`): after load `#giris-takma-ad` is absent; play (use `localStorage.setItem('bozo-oyun-ilk-tur-bitti','1')` via `addInitScript` so no guide) until the result; result text contains `Çevrimdışı tur: sıralamaya girmez.`
2. **Server up, name typed**: routes `GET /tablo` → `{donem:'2026-W41',bitis:'2026-10-12T00:00:00Z',hafta:[],tumZamanlar:[],sonSampiyon:null}`, `POST /tur` → `{turId:'0'.repeat(32)... a valid 32-hex id, tohum:12345, sonaErme:'x'}`, `POST /oyuncu` → `{takmaAd:'Bozo Usta'}`, `POST /tur/*/bitir` → `{puan:1000,ozet:{sofra:0,sis:0,tamKivam:0,enUzunKombo:0,kalkan:3},bitti:'ucSofra',tik:1,hafta:{puan:1000,sira:7,ustekiFark:null},buTurEnIyi:true}`. Type `Bozo Usta`, press Oyna, idle until the night ends (the idle player ends at 05:00; use `page.clock.install()` and `fastForward(130000)` or wait ~125 s real time), assert the request log has `/oyuncu` then `/tur/…/bitir` and the page shows `Sıralamaya yazıldı: sıra 7`, with no click on "Bu Skoru Sıralamaya Yaz".
3. **Server up, banned name** (`POST /oyuncu` → status 422 `{hata:'takmaAdKullanilamaz'}`): after the night, the page shows the "Bu Skoru Sıralamaya Yaz" button (fallback), no dead end.

Expected: all three pass. (If waiting two minutes is too slow, install Playwright's clock before `goto` and advance it in 5 s steps; the game loop uses `requestAnimationFrame` plus `performance.now`, both of which the fake clock drives.)

- [ ] **Step 7: Commit**

```bash
git add -A components content lib
git commit -m "Add the optional nickname field and auto-submit on the entry screen"
```

---

### Task 9: Documentation and final verification

**Files:**
- Modify: `docs/specs/2026-10-09-oyun-sade-design.md` (status line), `docs/surec/DEVAM.md`, `docs/surec/IYILESTIRMELER.md`, `CLAUDE.md` (the `lib/oyun/` and `components/oyun` sentences only), `README.md` (only if it describes the old verbs)

- [ ] **Step 1: Update the docs**

- Spec status line: "Durum: uygulandı (plan `docs/plans/2026-10-09-oyun-sade-plani.md`)", and a short note under §5 that the idle-player gate is "ödenen sofra 0, puan en çok 1000" with the arithmetic from Review Focus item 1 (first guest never runs out, second has doubled patience, both hold the two evre-1 tables, so no table can leave before 05:00).
- `docs/surec/DEVAM.md`: current state (sade mode implemented, not deployed; score server go-live is next: privacy text TR/EN, infra, DNS, secrets, each asked of the owner first), pointers to this plan and spec. `IYILESTIRMELER.md`: confirm the "Sade mod zorluk ayarı" entry from Task 3 has its measurements.
- `CLAUDE.md`: in the `lib/` bullet and the `components/` bullet, change the game description from the old verbs to "two taps (rack, ready skewer), guided first round" in one sentence each; do not add a new section.

- [ ] **Step 2: Full verification**

Run, in order, and read the output of each:

```bash
npm run typecheck
npm test
npm run build
```

Expected: typecheck clean; tests all pass (count printed, none skipped except the opt-in MariaDB contract); build lists 21 routes including `/oyun` and `/en/oyun`.

Dead-code sweep:

```bash
grep -rnE "tezgah|Tezgah|ayran|cevirme|CevirmeIsareti|ipucuHedefi|KorNoktasi|sogudu|komboDusur" lib components content sunucu --include='*.ts' --include='*.tsx' --include='*.css' | grep -v "menu\|ucret\|docs"
```

Expected: no hits other than the menu dictionary (the restaurant menu keeps its own `ayran`, `icecekler`). Every hit in `lib/oyun`, `components/oyun`, `content/*/oyun.ts`, `sunucu` is dead code: delete it.

Headless matrix (build served on 8412): rerun `tahta.mjs`, `rehber.mjs`, `rehber-atla.mjs`, `ad.mjs`, and a 1440 px desktop run of `tahta.mjs` (change the viewport) plus an axe pass on the `/oyun/` game screen using the axe path in the `olcum-harnesi` memory. Expected: no page errors, axe 0 violations.

- [ ] **Step 3: Commit**

```bash
git add -A docs CLAUDE.md README.md
git commit -m "Record the two-tap mode in the project docs"
```

Do not push or deploy: deployment happens when the owner asks (`README.md` > Publishing). The live build keeps showing offline mode (no name field) until the score server is deployed.

---

## Self-Review

**Spec coverage:** §2 rules (two verbs, auto-serve to the least patient, wasted skewer, raf guide, cooking tap inert, burn, guests, no negative score, difficulty) → Tasks 1-4 (`rafIstenen` for the guide glow). §3 screen (HUD→Sofra→Ocak→Raf, sofra cells non-buttons, ready ring, rack glow, visual language intact) → Task 6. Guided round (six steps, pause on 1/2/4, Atla, ≤6 words, TR+EN, reduced motion, second round no guide) → Tasks 4, 7. Nickname (optional, pre-filled, auto-submit, hidden when server unreachable, fallback button) → Task 8. §4 code impact (modules, goldens, server contract) → Tasks 1-5; `defter.ts` needs no change (the remembered name is `hesapOku().takmaAd`), noted here instead of invented. §5 verification (bots in `gece.test.ts`, non-negative property, headless guide/Atla) → Tasks 3, 2, 7; the idle-bot gate deliberately differs from the spec, flagged in Review Focus 1 and Task 9. §6 out of scope respected (no ranking/prize/raster/ayran work).

**Placeholder scan:** the only values captured from a run are the golden records and the new `tavan` golden (Tasks 3 and 5), with the exact command that prints them. `--font-govde` in the Rehber CSS is flagged to verify against `Hud.module.css`.

**Type consistency:** `servisVer(oyun, no, yuva, urun, kalite, olaylar)` is used with that arity in `ocak.ts`; the `servis` event carries `yuva` in `tipler.ts`, `tepkiler.ts` and the test fixtures; `rehberBasla()` is a function everywhere; `Tur.rehberli` replaces `ipucu` in `useOyunAkisi`, `OyunSayfasi` and `Saha`; `SisGorunumu` has three members in `gosterim.ts` and `ciz.ts` writes them to `data-gorunum`, which the Rehber selectors (`:not([data-gorunum="bos"])`) and the CSS rings use.
