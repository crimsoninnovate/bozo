# Tabak Akışı Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the game's verbs with the plate flow (tap the rack, drag the ready skewer to a plate, drag the side dish to the plate, drag the plate to the guest, tap the tip), with the guided first round on the game screen and the optional nickname on the entry screen.

**Architecture:** The simulation stays integer, tick-based and deterministic with the same `ilerle`/`simule` signatures; dragging does not exist for it, every gesture is two inputs, `tut` (grab) and a drop target or `birak`. The browser reduces pointer, tap-tap and keyboard input to those inputs through a pure state machine in `lib/oyun/surukle.ts`; React only draws the structure, the rAF loop writes per-frame values, WAAPI plays reactions. The guide is a pure state machine in `lib/oyun/rehber.ts` driven by simulation events; the overlay measures the DOM and draws. The nickname flows through the existing account and submit code via one pure decision function.

**Tech Stack:** TypeScript (strict, Node 24 type stripping for tests), `node:test`, React 19 / Next 16 static export, CSS Modules, Pointer Events, Web Animations API, `motion` (screen transitions only), Playwright 1.62.1 headless for browser checks.

**Spec:** `docs/specs/2026-10-09-oyun-tabak-akisi-design.md` (replaces §2 and §3 of `docs/specs/2026-10-09-oyun-sade-design.md`, whose guided-round principle, nickname field, "score never negative" rule and ayran decision stay binding; server §10, accessibility §15, privacy §8/§16-§17 and visual language §12-§13 of `docs/specs/2026-10-08-oyun-design.md` stay).

## Global Constraints

- Commit at the end of each task. Message: imperative mood, English, first line under 72 characters. **No assistant trailer of any kind** (no `Co-Authored-By`, no `Claude-Session`, no "Generated with" line): owner's decision 12 Aug 2026 in `CLAUDE.md` overrides the harness default.
- No em dash (U+2014) as punctuation in copy or comments, no circumflex accents, no all-caps sentences, exclamation marks rare. Locked words: misafir (never müşteri), ikram (never bedava), ocak/kor (never mangal), usta (never şef), tane (never parça), şiş/porsiyon (never adet), sofra (never masa). Hours `10:00 - 05:00`.
- Title Case only for product names, section labels and CTA/nav labels; guide sentences and live-region texts are sentence case. Every guide sentence is at most 6 words (spec §7). Guide and UI strings come from the spec's tables; nothing else is invented.
- Turkish identifiers stay ASCII; domain names Turkish, scaffolding English. `components/` imports through `@/*`; `lib/oyun/*` and `sunucu/*` use relative `.ts` imports (they run under bare Node).
- Comments one or two lines, recording something the code cannot say. No dead code: every unused function, type, event, dictionary key, CSS class, SVG def and file is deleted in the task that orphans it. Files under ~700 lines, functions under 50 lines.
- `tsconfig` has `noUnusedLocals`/`noUnusedParameters`: one stray import fails `npm run typecheck`.
- No palette colour (`--zemin`, `--komur`, `--plaka-zemin`, `--gece`, `--kor`, `--kor-hover`, cream, copper values) as a literal in a CSS module or SVG (`styles/palet.test.ts`); the painted scene keeps its own warm literals (spec sahne K1) and binds ember to `var(--kor)`. Keyframes live inside the module that uses them (`styles/animasyon.test.ts`). All gradients and filters live in `SahneDefs.tsx`; `components/oyun/SahneDefs.test.ts` fails on a second `<defs>` or an undefined `url(#…)`.
- `prefers-reduced-motion`: the global CSS rule does not reach WAAPI, canvas or Motion; every non-CSS animation reads `useHareketAzaltilmisMi()` itself. Under reduced motion the dragged item still follows the finger (direct positioning), the snap-back is instant, the coin appears without a bounce, no sparks, the guide hand does not pulse.
- Touch targets at least 44 px (design sizes spec §6: rack 56, slot 72x140, plate 112x84, bowl 56, bin 56, guest place 120x150, coin 56; measured values below 390 px recorded in `docs/surec/IYILESTIRMELER.md`). Contrast AA. Ember is never text.
- Score is never negative; no event lowers `oyun.puan` (spec §2). `EN_COK_DOKUNUS` stays 1200.
- Red window, stated once: Tasks 1 to 6 rewrite the engine under `lib/oyun/`. From the Task 1 commit to the end of Task 6, `npm test` and `npm run typecheck` are both red in the `lib/oyun`, `sunucu` and `components/oyun` files each task lists as "not yet rewritten"; each task's check is the per-file `node --test` command it names, and every file in that command passes at that task. `node --test lib/oyun/*.test.ts sunucu/*.test.ts` is green again at the end of Task 6; `npx tsc --noEmit -p . 2>&1 | grep -v '^components/oyun' ; true` prints nothing from Task 6 on; `npm run typecheck` is green from the end of Task 10. Commits are still made per task.
- `npm test` grows to tens of seconds (about 1050 bot nights in the gates plus the 500-seed property test); that is expected, not a hang.
- Replay equality: nothing outside `canliDokun`/`canliAdim` mutates `canli.oyun`; the guide's `rehber.izin` filter runs before `canliDokun`, so a refused input is never recorded and the server's replay of the record equals the live result.
- Staging (owner's delegate, 9 Oct 2026): the tap-tap path with flight animations is fully playable first; drag is layered on afterwards. The boundary after Tasks 10, 11 and 12 is a complete, playable, guided, accessible game with taps only; Task 14 adds pointer drags on top without changing the simulation.
- Headless scripts live under `/tmp/bozo-oyun/sade/` (not in the repo), use Playwright 1.62.1 from `/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs`, and drive a fresh `out/` served with `python3 -m http.server 8412 --directory "$PWD/out"` (start from the repo root, not inside `out/`; a server started inside `out/` keeps the deleted inode after a rebuild). No screenshot reading loops: every check asserts DOM state or numbers.

## Review Focus

Inputs the spec implies but no feature test exercises on its own; each line has a pinned test in the named task.

1. Fifth item dropped on a full plate: the item stays in hand, nothing is lost, the plate is unchanged, a `tabakDolu` event lets the UI snap the item back (Task 2, `tabak_dorduncudenSonrakiBirakis_eldeKalir`).
2. Second tip on a place that still holds a coin: one coin with the summed amount and a restarted timer, and a new guest sits while the coin lies there (Task 3, `para_ayniYereIkinciPara_toplanirSureYenidenBaslar_misafirOturur`).
3. Plate delivered to an empty or already-paid place: plate goes back, score, combo and the plate's contents unchanged (Task 3, `misafir_bosYaDaOdemisYereTabak_geriDoner`).
4. Pointer edge cases in one drag: a second finger is ignored, `pointercancel` emits `birak` (a no-op for a skewer, so nothing is lost), a release over a target of the wrong kind (skewer over a guest) keeps the item in hand (Task 7, `surukle_ikinciParmak_yokSayilir`, `surukle_iptal_birakVerir`, `surukle_yanlisTurHedef_eldeKalir`).
5. Guide step 4 with a drop outside the plate (or Esc): the `birak` is refused by the guide and never recorded, the skewer stays in hand and the step repeats without a second trip to the rack (Task 8 pure `rehber_tabakAdiminda_birakReddedilir_adimTekrarEder`; Task 11 headless Esc step; Task 14 headless drop on the HUD).

## File Structure

| File | Change |
|---|---|
| `lib/oyun/tipler.ts` | Rewrite: 19 targets, `Kalem`, `Elde`, `Tabak`, `MisafirYeri`, `Para`, new events, `Bitis` `'ucMisafir'`, `Ozet` with `misafir` and `bahsis` |
| `lib/oyun/ayar.ts` | Rewrite: §5 table, budget with side dishes, `PARA_TIK`, `TABAK_SINIRI`, `PUAN` without penalties and porsiyon |
| `lib/oyun/durum.ts` | `yeniOyun` with plates, hand, coins; `eksikKalemler` |
| `lib/oyun/puan.ts` | Delete `komboDusur` |
| `lib/oyun/gece.ts` | Side dishes, Karışık with its side dish |
| `lib/oyun/ocak.ts` | `rafaDokun`, `sisKalitesi`, `ocaktanTut`, `ocakIlerle` |
| `lib/oyun/tabak.ts` (new) | `kasedenTut`, `tabagaDokun`, `copeBirak`, `birak` |
| `lib/oyun/misafir.ts` (new, replaces `sofra.ts`) | seating, patience, `fiseUyuyorMu`, `misafireBirak`, `paraAl`, `paraIlerle` |
| `lib/oyun/motor.ts` | 19-target dispatch, world step with coins |
| `lib/oyun/deneme.ts` | Scene helpers; four bots |
| `lib/oyun/tavan.ts` | Ceiling without porsiyon |
| `lib/oyun/gosterim.ts`, `gorsel.ts`, `ses.ts`, `duyuru.ts`, `klavye.ts` | New view model, sounds, announcements, key actions |
| `lib/oyun/surukle.ts` (new) | Pure gesture machine |
| `lib/oyun/rehber.ts` (new) | Guided-round state machine |
| `lib/oyun/giris.ts` (new) | Nickname submit decision |
| `lib/oyun/defter.ts` | `rehberGorulduMu`/`rehberGoruldu` replace `ilkTurMu`/`ilkTurBitti` |
| `sunucu/depo.ts`, `mariaDepo.ts`, `bellekDepo.ts`, `sema.sql`, tests | `Ozet.misafir`, `Ozet.bahsis`, `bitti` enum, new targets, `duzenli` bot |
| `components/oyun/Serit.tsx` (new, from `Seritler.tsx`) | `Serit` wrapper, `Dolgu`, shared props |
| `components/oyun/SeritMisafir.tsx`, `SeritOcak.tsx`, `SeritTabak.tsx`, `SeritRaf.tsx` (new) | The four strips; `Seritler.tsx` and `SeritlerTezgah.tsx` deleted |
| `components/oyun/SahneMisafir.tsx` + `.module.css` (new, replaces `SahneSofra`) | Silhouettes, ticket balloon, ember ring, coin, side plates |
| `components/oyun/SahneTezgah.tsx` + `.module.css` | Copper plate, bowls, bin, rack tray; marble, cup and churn deleted |
| `components/oyun/SahneTane.tsx` | `EslikciGlifi`; ayran glyph deleted |
| `components/oyun/Semboller.tsx` | `ElIsareti` added; turn, counter-full, porsiyon, ember-dot deleted |
| `components/oyun/Saha.tsx`, `Saha.module.css`, `Hud.tsx`, `Hud.module.css` | New vertical flow, no porsiyon badge |
| `components/oyun/ciz.ts`, `tepkiler.ts` | Coins, hand, plate reactions |
| `components/oyun/useSurukleme.ts` (new) | Pointer and keyboard glue around `surukle.ts`: taps in Task 10, drags added in Task 14 |
| `sunucu/suphe.ts` + test | Tam-kıvam ratio rule removed; timing rules stay |
| `components/oyun/useOyunAlani.ts`, `useOyunDongusu.ts` | Guide pause, gesture wiring |
| `components/oyun/Rehber.tsx` + `.module.css`, `useRehber.ts` (new) | Guide overlay and hook |
| `components/oyun/GirisEkrani.tsx` + `.module.css`, `GirisTablosu.tsx`, `OyunSayfasi.tsx`, `useOyunAkisi.ts`, `SonucEkrani.tsx` + `.module.css` | Nickname field, result summary with guests and tips |
| `content/tr/oyun.ts`, `content/en/oyun.ts` | New keys (`tabak`, `kase`, `cop`, `bahsis`, `ucMisafirKalkti`, `rehber.*`, `giris.*`, `duyuru.*`), old keys deleted |

---

### Task 1: Game model: types, tuning table, night generator, storage fields

**Files:**
- Modify: `lib/oyun/tipler.ts`, `lib/oyun/ayar.ts`, `lib/oyun/durum.ts`, `lib/oyun/puan.ts`, `lib/oyun/gece.ts`, `lib/oyun/deneme.ts` (scene half only), `sunucu/depo.ts` (no change needed, re-exports `Ozet`), `sunucu/mariaDepo.ts`, `sunucu/sema.sql`, `sunucu/depoSozlesmesi.ts`, `sunucu/isler.test.ts`
- Delete: `lib/oyun/sofra.ts`, `lib/oyun/sofra.test.ts`, `lib/oyun/servis.test.ts`, `lib/oyun/ocak.test.ts` (rewritten in Task 2)
- Test: `lib/oyun/gece.test.ts`, `lib/oyun/durum.test.ts` (new), `lib/oyun/puan.test.ts`

**Interfaces:**
- Produces (used by every later task): the types below; `tavan(tohum: number): number` (implementation moved here because `sunucu/uclar.ts` imports it and must load in Task 4; its tests are Task 5); `EVRELER[i]` fields `baslangic, bitis, misafir, ocak, cigerPisme, almaPenceresi, tamKivamBandi, sabir, puanCarpani`; constants `EN_COK_MISAFIR = 3`, `EN_COK_OCAK = 4`, `TABAK_SAYISI = 2`, `TABAK_SINIRI = 4`, `PARA_TIK = 480`, `KALKIS_TIK = 30`, `KAYIP_SINIRI = 3`, `RAF`, `KASELER`, `ACILDIGI_EVRE`, `PISME_YUZDESI`, `PUAN = { tamKivam: 150, iyi: 100, eslikci: 20, bahsis: 200, geceTamam: 1000 }`, `BUTCE`, `ILK_MISAFIRLER`; `yeniOyun(tohum): Oyun`; `eksikKalemler(oyun: Oyun): Kalem[]`; `geceKur(tohum): Misafir[]`; `sahne(fisler: Kalem[][], tukenmez = false): Oyun`, `evreyeGec`, `dokun`, `bekle`, `sonaKadarBekle` from `deneme.ts`.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/durum.test.ts` (new):

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EN_COK_MISAFIR, TABAK_SAYISI } from './ayar.ts'
import { eksikKalemler, yeniOyun } from './durum.ts'
import { sahne } from './deneme.ts'

test('yeniOyun_ikiBosTabak_ucMisafirYeri_elBos_paraYok', () => {
  const oyun = yeniOyun(1)
  assert.deepEqual(oyun.tabaklar, Array.from({ length: TABAK_SAYISI }, () => []))
  assert.equal(oyun.misafirler.length, EN_COK_MISAFIR)
  assert.equal(oyun.el, null)
  assert.deepEqual(oyun.paralar, [null, null, null])
  assert.deepEqual(oyun.ozet, { misafir: 0, sis: 0, tamKivam: 0, enUzunKombo: 0, kalkan: 0, bahsis: 0 })
})

test('eksikKalemler_ocaktakiTabaktakiVeEldeki_dusulur_odemisSayilmaz', () => {
  const oyun = sahne([['ciger', 'ciger', 'domates']])
  // Görev 1'in `ilerle` taslağı oturtmaz: misafir elle oturtulur.
  oyun.misafirler[0] = { misafir: oyun.gelecek[0]!, sabir: 100, toplamSabir: 100, kalkis: null }
  assert.deepEqual(eksikKalemler(oyun), ['ciger', 'ciger', 'domates'])
  oyun.ocak[0] = { urun: 'ciger', gecen: 0, pisme: 240, pencere: 180, bant: 36 }
  oyun.tabaklar[0] = [{ urun: 'domates', kalite: null }]
  oyun.el = { tur: 'sis', urun: 'ciger', kalite: 'iyi', yuva: 1 }
  assert.deepEqual(eksikKalemler(oyun), [])
  const yer = oyun.misafirler[0]
  assert.ok(yer)
  yer.kalkis = 10
  oyun.ocak[0] = null
  assert.deepEqual(eksikKalemler(oyun), [])
})
```

`lib/oyun/gece.test.ts`: delete `butce_fisBoylariToplami_urunSayisinaEsit` (it reads `b.fisBoylari`, which no longer exists), replace the first-two-guests test and the Karışık test, add the budget invariants:

```ts
test('butce_sisBoylariToplami_sisSayisinaEsit_eslikciFisSayisiniAsmaz', () => {
  for (const b of BUTCE) {
    assert.equal(b.sisBoylari.reduce((x, y) => x + y, 0), b.sisler.length)
    assert.ok(b.eslikciler.length <= b.sisBoylari.length)
  }
})

test('gece_ilkIkiMisafir_tohumdanBagimsizVeYonlendirmeli', () => {
  for (const tohum of [1, 99, 123456]) {
    const [ilk, ikinci] = geceKur(tohum)
    assert.deepEqual(ilk, { no: 0, gelis: 60, fis: ['ciger'], karisik: false, tukenmez: true })
    assert.deepEqual(ikinci, { no: 1, gelis: 720, fis: ['ciger', 'domates'], karisik: false, tukenmez: false })
  }
})

test('gece_herFis_enCokUcSisVeBirEslikci_enAzBirSis', () => {
  for (const tohum of TOHUMLAR) {
    for (const m of geceKur(tohum)) {
      const sis = m.fis.filter((k) => RAF.includes(k as Urun)).length
      const eslikci = m.fis.length - sis
      assert.ok(sis >= 1 && sis <= 3 && eslikci <= 1, `tohum ${tohum}, misafir ${m.no}: ${m.fis.join(',')}`)
    }
  }
})

test('gece_bozoKarisik_cigerDalakYurekVeDomates', () => {
  const karisiklar = geceKur(5).filter((m) => m.karisik)
  assert.equal(karisiklar.length, 2)
  for (const m of karisiklar) for (const u of [...RAF, 'domates'] as const) assert.ok(m.fis.includes(u))
  assert.deepEqual(karisiklar.map((m) => m.fis.length), [4, 4])
})

test('gece_yirmiDortMisafir_sonMisafir05tenEnAz8SnOnce', () => {
  for (const tohum of TOHUMLAR) {
    const gece = geceKur(tohum)
    assert.equal(gece.length, 24, `tohum ${tohum}`)
    assert.ok((gece.at(-1)?.gelis ?? TUR_TIK) <= TUR_TIK - 480, `tohum ${tohum}: son misafir geç`)
  }
})
```

Change the existing `gece_gelisler_artanSiradaVeSonMisafir05tenEnAz6SnOnce` to keep only the increasing-order assertion (rename it `gece_gelisler_artanSirada`). Imports: add `RAF` to the `./ayar.ts` import and `import type { Misafir, Urun } from './tipler.ts'`.

`lib/oyun/puan.test.ts`: delete the `komboDusur` import and its test.

- [ ] **Step 2: Run to verify they fail**

Run: `node --test lib/oyun/gece.test.ts lib/oyun/durum.test.ts lib/oyun/puan.test.ts`
Expected: FAIL (`eksikKalemler` missing, `sisBoylari` undefined, second guest still `ayran`).

- [ ] **Step 3: Types**

Replace `lib/oyun/tipler.ts` with:

```ts
export type Urun = 'ciger' | 'dalak' | 'yurek'
export type Eslikci = 'domates' | 'sogan'
export type Kalem = Urun | Eslikci
export type Kalite = 'tam' | 'iyi'

/** 19 hedef (spec tabak §8): raf, ocak yuvası, kase, tabak, misafir yeri, para, çöp, bırak. */
export type Hedef =
  | Urun
  | Eslikci
  | `o${0 | 1 | 2 | 3}`
  | `t${0 | 1}`
  | `m${0 | 1 | 2}`
  | `p${0 | 1 | 2}`
  | 'cop'
  | 'birak'

/** Kayıttaki tek dokunuş: hangi tikte, neye. JSON'da kısa kalsın diye demet. */
export type Girdi = readonly [tik: number, hedef: Hedef]

export type Misafir = {
  no: number
  gelis: number
  fis: readonly Kalem[]
  karisik: boolean
  /** Yalnız gecenin ilk misafiri: sabrı tükenmez, öğrenirken kaybetmek yok. */
  tukenmez: boolean
}

export type MisafirYeri = {
  misafir: Misafir
  sabir: number
  toplamSabir: number
  /** Ödedikten sonra kalkmasına kalan tik; ödemeden önce null. */
  kalkis: number | null
}

export type OcakSisi = { urun: Urun; gecen: number; pisme: number; pencere: number; bant: number }

/** Tabaktaki kalem; eşlikçinin kalitesi yok. */
export type TabakKalemi = { urun: Kalem; kalite: Kalite | null }
export type Tabak = TabakKalemi[]

/** Elde olan; şiş alındığı yuvayı taşır (yuva boşaldı, ekran şişi orada gösterir). */
export type Elde =
  | { tur: 'sis'; urun: Urun; kalite: Kalite; yuva: number }
  | { tur: 'eslikci'; urun: Eslikci }
  | { tur: 'tabak'; no: number }
  | null

export type Para = { tutar: number; kalan: number }

export type Bitis = 'gece' | 'ucMisafir'

export type Ozet = { misafir: number; sis: number; tamKivam: number; enUzunKombo: number; kalkan: number; bahsis: number }

export type Olay =
  | { tur: 'misafirGeldi'; yer: number }
  | { tur: 'misafirKalkti'; yer: number; odedi: boolean }
  | { tur: 'sisKondu'; yuva: number; urun: Urun }
  | { tur: 'sisErken'; yuva: number }
  | { tur: 'sisYandi'; yuva: number }
  | { tur: 'rafDolu'; urun: Urun }
  | { tur: 'tutuldu'; el: NonNullable<Elde> }
  | { tur: 'tabagaKondu'; no: number; kalem: TabakKalemi; el: NonNullable<Elde> }
  | { tur: 'tabakDolu'; no: number }
  | { tur: 'teslim'; yer: number; no: number; hesap: number }
  | { tur: 'yanlisTabak'; yer: number; no: number }
  | { tur: 'paraDustu'; yer: number; tutar: number }
  | { tur: 'bahsisAlindi'; yer: number; tutar: number }
  | { tur: 'paraSoldu'; yer: number }
  | { tur: 'copeGitti'; el: NonNullable<Elde> }
  | { tur: 'birakildi'; el: NonNullable<Elde> }
  | { tur: 'evre'; evre: number }
  | { tur: 'bitti'; sebep: Bitis }

export type Oyun = {
  tik: number
  evre: number
  puan: number
  misafirler: (MisafirYeri | null)[]
  ocak: (OcakSisi | null)[]
  tabaklar: Tabak[]
  el: Elde
  paralar: (Para | null)[]
  kuyruk: Misafir[]
  gelecek: Misafir[]
  kombo: number
  ozet: Ozet
  bitti: Bitis | null
}

export type Sonuc = { puan: number; ozet: Ozet; bitti: Bitis; tik: number }
```

- [ ] **Step 4: Tuning table and budget**

Replace `lib/oyun/ayar.ts` with:

```ts
import type { Eslikci, Kalem, Urun } from './tipler.ts'

/** Saniyedeki tik. Bütün süreler tik cinsinden tamsayıdır (spec §5). */
export const TIK_HIZI = 60
/** 21:00'den 05:00'e: sekiz oyun saati, her biri 15 sn. */
export const OYUN_SAATI_TIK = 900
export const TUR_TIK = 8 * OYUN_SAATI_TIK

export type EvreAyari = {
  baslangic: number
  bitis: number
  misafir: number
  ocak: number
  cigerPisme: number
  almaPenceresi: number
  tamKivamBandi: number
  sabir: number
  puanCarpani: 1 | 2
}

/**
 * Spec tabak §5 tablosu, tike çevrilmiş; başlangıç değerleri, botlarla ayarlanır (Görev 4).
 * Sütunlar: başlangıç, bitiş, misafir yeri, ocak, ciğer pişme, alma penceresi, tam kıvam bandı, sabır, puan ×.
 */
const TABLO = [
  [0, 900, 2, 3, 240, 180, 36, 2100, 1],
  [900, 2700, 2, 3, 210, 156, 30, 1680, 1],
  [2700, 4500, 3, 4, 180, 132, 27, 1320, 1],
  [4500, 6300, 3, 4, 156, 120, 24, 1080, 1],
  [6300, 7200, 3, 4, 132, 108, 21, 960, 2],
] as const

export const EVRELER: readonly EvreAyari[] = TABLO.map(
  ([baslangic, bitis, misafir, ocak, cigerPisme, almaPenceresi, tamKivamBandi, sabir, puanCarpani]) => ({
    baslangic,
    bitis,
    misafir,
    ocak,
    cigerPisme,
    almaPenceresi,
    tamKivamBandi,
    sabir,
    puanCarpani,
  }),
)

export const EN_COK_MISAFIR = 3
export const EN_COK_OCAK = 4
export const TABAK_SAYISI = 2
/** Tabak en çok dört kalem alır; beşinci bırakış elde kalır. */
export const TABAK_SINIRI = 4
/** Bahşiş tezgahta 8 sn bekler, sonra solar. */
export const PARA_TIK = 480
export const KALKIS_TIK = 30
export const KAYIP_SINIRI = 3

export const RAF: readonly Urun[] = ['ciger', 'dalak', 'yurek']
export const KASELER: readonly Eslikci[] = ['domates', 'sogan']

/** Ciğere göre pişme süresi, yüzde: dalak kısa tutulur, yürek sıkı dokulu (menü metni). */
export const PISME_YUZDESI: Record<Urun, number> = { ciger: 100, dalak: 75, yurek: 125 }
/** Kalemin rafta ya da kasede belirdiği evre (sıfırdan). */
export const ACILDIGI_EVRE: Record<Kalem, number> = { ciger: 0, domates: 0, dalak: 1, sogan: 1, yurek: 2 }

/** Hiçbir olay puanı düşürmez (spec sade §2): yalnız kazanç kalemleri. Bahşiş tam sabırda 200. */
export const PUAN = { tamKivam: 150, iyi: 100, eslikci: 20, bahsis: 200, geceTamam: 1000 } as const

/** Kombo sayacının çarpan eşikleri: 0-2 ×1, 3-5 ×2, 6-8 ×3, 9+ ×4. */
export const KOMBO_ESIKLERI = [0, 3, 6, 9] as const

export type EvreButcesi = {
  /** Misafirler arası ortalama tik; geliş bu aralığın ±%20'si içinde oynar. */
  aralik: number
  /** Fiş başına şiş sayısı; toplamı `sisler` uzunluğu. */
  sisBoylari: readonly number[]
  sisler: readonly Urun[]
  /** En küçük fişlerden başlayarak birer tane eklenir; sayısı fiş sayısını aşmaz. */
  eslikciler: readonly Eslikci[]
  /** Bozo Karışık fişi (ciğer, dalak, yürek) ve yanındaki eşlikçi; null yok. */
  karisik: { eslikci: Eslikci | null } | null
}

function kalemler(adet: Partial<Record<Urun, number>>): Urun[] {
  return (Object.entries(adet) as [Urun, number][]).flatMap(([urun, n]) => Array<Urun>(n).fill(urun))
}

/**
 * Zorluk bütçesi (spec tabak §5): evre 2-5 için misafir sayısı ve kalem kümesi her tohumda aynı,
 * tohum yalnız sırayı ve geliş anını belirler. Aralıklar evreye sığacak şekilde seçildi: spec'in
 * 8/6/4,5/3,5 sn değerleri 30 saniyelik evrelere sığmıyordu. Evre 5 üç fiş + Karışık, son misafir
 * 05:00'ten en az 8 sn önce (6720). Gece 24 misafir.
 */
export const BUTCE: readonly EvreButcesi[] = [
  {
    aralik: 340,
    sisBoylari: [2, 2, 1, 1, 1],
    sisler: kalemler({ ciger: 5, dalak: 2 }),
    eslikciler: ['domates', 'domates', 'sogan'],
    karisik: null,
  },
  {
    aralik: 290,
    sisBoylari: [2, 2, 2, 2, 2, 2],
    sisler: kalemler({ ciger: 6, dalak: 3, yurek: 3 }),
    eslikciler: ['domates', 'domates', 'sogan', 'sogan'],
    karisik: null,
  },
  {
    aralik: 245,
    sisBoylari: [2, 2, 2, 2, 2, 1],
    sisler: kalemler({ ciger: 5, dalak: 3, yurek: 3 }),
    eslikciler: ['domates', 'domates', 'sogan', 'sogan'],
    karisik: { eslikci: 'domates' },
  },
  {
    aralik: 110,
    sisBoylari: [2, 2, 2],
    sisler: kalemler({ ciger: 3, dalak: 2, yurek: 1 }),
    eslikciler: ['domates', 'sogan'],
    karisik: { eslikci: 'domates' },
  },
]

/** Gecenin yönlendirmeli ilk iki misafiri; tohumdan bağımsız (spec tabak §5). */
export const ILK_MISAFIRLER = [
  { gelis: 60, fis: ['ciger'], tukenmez: true },
  { gelis: 720, fis: ['ciger', 'domates'], tukenmez: false },
] as const satisfies readonly { gelis: number; fis: readonly Kalem[]; tukenmez: boolean }[]
```

- [ ] **Step 5: Night generator**

Replace `lib/oyun/gece.ts` with:

```ts
import { BUTCE, EVRELER, ILK_MISAFIRLER, RAF } from './ayar.ts'
import { karistir, rastgele, type Rastgele } from './rastgele.ts'
import type { Kalem, Misafir } from './tipler.ts'

type FisTaslagi = { fis: Kalem[]; karisik: boolean }

/** Bir evrenin fişleri: şişler boylara dağıtılır, eşlikçiler en küçük fişlerden başlayarak birer tane eklenir. */
function evreFisleri(evre: number, r: Rastgele): FisTaslagi[] {
  const butce = BUTCE[evre - 1]
  if (!butce) throw new RangeError(`bütçesi olmayan evre: ${evre}`)
  const sisler = karistir([...butce.sisler], r)
  const fisler: FisTaslagi[] = [...butce.sisBoylari]
    .sort((a, b) => a - b)
    .map((boy) => ({ fis: sisler.splice(0, boy), karisik: false }))
  karistir([...butce.eslikciler], r).forEach((e, i) => fisler[i]?.fis.push(e))
  karistir(fisler, r)
  if (butce.karisik) {
    const fis: Kalem[] = butce.karisik.eslikci ? [...RAF, butce.karisik.eslikci] : [...RAF]
    fisler.splice(r.tam(0, fisler.length), 0, { fis, karisik: true })
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

/** Tohumdan bir gece: yönlendirmeli ilk iki misafir, sonra evre 2-5'in bütçesi. Aynı tohum her makinede aynı gece. */
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

- [ ] **Step 6: State, score helpers, scene helpers**

Replace `lib/oyun/durum.ts` with:

```ts
import { EN_COK_MISAFIR, EN_COK_OCAK, EVRELER, TABAK_SAYISI } from './ayar.ts'
import { geceKur } from './gece.ts'
import type { EvreAyari } from './ayar.ts'
import type { Kalem, Oyun } from './tipler.ts'

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
    misafirler: Array.from({ length: EN_COK_MISAFIR }, () => null),
    ocak: Array.from({ length: EN_COK_OCAK }, () => null),
    tabaklar: Array.from({ length: TABAK_SAYISI }, () => []),
    el: null,
    paralar: Array.from({ length: EN_COK_MISAFIR }, () => null),
    kuyruk: [],
    gelecek: geceKur(tohum),
    kombo: 0,
    ozet: { misafir: 0, sis: 0, tamKivam: 0, enUzunKombo: 0, kalkan: 0, bahsis: 0 },
    bitti: null,
  }
}

/** Oturan, ödememiş misafirlerin istediği kalemlerden ocakta, tabaklarda ve elde olanlar düşülür: raf rehberi ve botlar. */
export function eksikKalemler(oyun: Oyun): Kalem[] {
  const istenen = oyun.misafirler.flatMap((m) => (m && m.kalkis === null ? [...m.misafir.fis] : []))
  const hazirlanan: Kalem[] = [
    ...oyun.ocak.flatMap((s) => (s ? [s.urun] : [])),
    ...oyun.tabaklar.flatMap((t) => t.map((k) => k.urun)),
    ...(oyun.el && oyun.el.tur !== 'tabak' ? [oyun.el.urun] : []),
  ]
  for (const urun of hazirlanan) {
    const i = istenen.indexOf(urun)
    if (i !== -1) istenen.splice(i, 1)
  }
  return istenen
}
```

`lib/oyun/puan.ts`: delete `komboDusur` and its comment; keep `komboCarpani` and `sabirBonusu` (the latter's constant is now `PUAN.bahsis`: change `PUAN.sabirBonusu` to `PUAN.bahsis`).

Replace `lib/oyun/tavan.ts` with (its tests come in Task 5; the module must load today because `sunucu/uclar.ts` imports it):

```ts
import { PUAN, RAF } from './ayar.ts'
import { geceKur } from './gece.ts'
import { komboCarpani } from './puan.ts'
import type { Kalem, Urun } from './tipler.ts'

/** Fişin tam kıvamlı hesabı ve tam bahşişi. */
function fisTabani(fis: readonly Kalem[]): number {
  return fis.reduce<number>((t, k) => t + (RAF.includes(k as Urun) ? PUAN.tamKivam : PUAN.eslikci), PUAN.bahsis)
}

/**
 * Tohumun üst sınırı (spec tabak §8): her fiş (kalemler + 200) × kombo çarpanı × 2, en büyük fişler
 * en yüksek çarpanlarda, gece tamam. Sayaç ancak teslimle artar, hiçbir olay puan düşürmez; sunucu
 * bunun üstünü reddeder. Bütçe tohumdan bağımsız olduğu için değer de tohumdan bağımsızdır.
 */
export function tavan(tohum: number): number {
  const tabanlar = geceKur(tohum).map((m) => fisTabani(m.fis)).sort((a, b) => a - b)
  return tabanlar.reduce((t, taban, k) => t + taban * komboCarpani(k) * 2, 0) + PUAN.geceTamam
}
```

`lib/oyun/deneme.ts`: keep the scene half only (`sahne`, `evreyeGec`, `dokun`, `bekle`, `sonaKadarBekle`); delete everything from the `Beceri` comment down (the bots return in Task 4; `motor.test.ts`, `tavan.test.ts`, `canli.test.ts` and `sunucu/*.test.ts` stay red until then). `sahne` takes `fisler: Kalem[][]`; the import line becomes `import type { Hedef, Kalem, Olay, Oyun } from './tipler.ts'`.

`git rm lib/oyun/sofra.ts lib/oyun/sofra.test.ts lib/oyun/servis.test.ts lib/oyun/ocak.test.ts` (their replacements come in Tasks 2 and 3). `motor.ts` and `ocak.ts` still import the old names; they are rewritten in Tasks 2 and 3 and are not imported by this task's tests except `motor.ts` from `durum.test.ts` and `deneme.ts`: to keep this task's tests runnable, make the minimal edit in `lib/oyun/motor.ts` now: replace the `ocak.ts` and `sofra.ts` imports and the world step with the Task 3 version of `ilerle` **without** inputs, i.e. temporarily:

```ts
import { KAYIP_SINIRI, PUAN, TUR_TIK } from './ayar.ts'
import { evreBul, yeniOyun } from './durum.ts'
import type { Girdi, Hedef, Olay, Oyun, Sonuc } from './tipler.ts'
```

delete `HEDEFLER`, `dokun`, and in `ilerle` delete the `for (const hedef of hedefler)` line and the four world-step calls (`ocakIlerle`, `tezgahIlerle`, `ayranIlerle`, `sofralariIlerle`), and the `gelisleriAl`/`kuyruguOturt` calls; `bitisiDenetle` uses `'ucMisafir'`; in `girdileriDogrula` delete the `HEDEFLER.has` line; keep `simule`. Prefix the unused `hedefler` parameter with an underscore (`_hedefler`) so `noUnusedParameters` passes. Task 2 and Task 3 restore the full body; this stub exists only so `node --test lib/oyun/durum.test.ts` runs today.

`lib/oyun/ocak.ts`: leave it untouched (nothing in this task imports it; Task 2 rewrites it).

- [ ] **Step 7: Server storage fields**

`sunucu/sema.sql`: in `CREATE TABLE tur` rename the column `sofra` to `misafir`, add `bahsis INT UNSIGNED NOT NULL` after `kalkan`, and change `bitti ENUM('gece', 'ucSofra')` to `bitti ENUM('gece', 'ucMisafir')`.

`sunucu/mariaDepo.ts`: in `turOku` read `misafir: sayi(r.misafir)` instead of `sofra`, add `bahsis: sayi(r.bahsis)`; in `turEkle` the INSERT lists `misafir, sis, tam_kivam, en_uzun_kombo, kalkan, bahsis` with `t.ozet.misafir, ..., t.ozet.kalkan, t.ozet.bahsis` and one more `?`.

`sunucu/depoSozlesmesi.ts`: both `ozet` literals gain `bahsis: 0` and use `misafir:` instead of `sofra:`; replace `girdiler: [[0, 's0']]` with `girdiler: [[0, 'ciger']]` and the matching `assert.deepEqual(bulunan?.girdiler, [[0, 'ciger']])`. `sunucu/isler.test.ts` line 32: `ozet: { misafir: 1, sis: 1, tamKivam: 0, enUzunKombo: 1, kalkan: 0, bahsis: 0 }` and `girdiler: [[0, 'ciger']]`.

`sunucu/bellekDepo.ts` needs no change (it copies `t.ozet`).

- [ ] **Step 8: Run to verify they pass**

Run: `node --test lib/oyun/gece.test.ts lib/oyun/durum.test.ts lib/oyun/puan.test.ts lib/oyun/rastgele.test.ts lib/oyun/takmaAd.test.ts sunucu/bellekDepo.test.ts sunucu/isler.test.ts`
Expected: PASS. Then `npx tsc --noEmit -p . 2>&1 | grep -v '^components/oyun' ; true` prints nothing except errors in `lib/oyun/ocak.ts`, `gosterim.ts`, `gorsel.ts`, `ses.ts`, `duyuru.ts`, `klavye.ts`, `canli.test.ts`, `motor.test.ts`, `tavan.test.ts`, `sunucu/suphe.test.ts`, `sunucu/uygulama.test.ts`, `sunucu/dogrulama.test.ts` (all rewritten by Task 6).

- [ ] **Step 9: Commit**

```bash
git add -A lib/oyun sunucu docs/plans/2026-10-09-oyun-tabak-plani.md
git commit -m "Reshape the game model for the plate flow"
```

---

### Task 2: Hand sources: fire and plates

**Files:**
- Modify: `lib/oyun/ocak.ts`
- Create: `lib/oyun/tabak.ts`, `lib/oyun/ocak.test.ts`, `lib/oyun/tabak.test.ts`

**Interfaces:**
- Consumes: Task 1 types and constants, `evreAyari`.
- Produces: `rafaDokun(oyun, urun: Urun, olaylar: Olay[])`, `sisKalitesi(sis: OcakSisi): Kalite`, `ocaktanTut(oyun, yuva: number, olaylar)`, `ocakIlerle(oyun, olaylar)` from `ocak.ts`; `kasedenTut(oyun, urun: Eslikci, olaylar)`, `tabagaDokun(oyun, no: number, olaylar)`, `copeBirak(oyun, olaylar)`, `birak(oyun, olaylar)` from `tabak.ts`. Tests here call these directly; `dokun()` through the engine works from Task 3.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/ocak.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EVRELER, PISME_YUZDESI } from './ayar.ts'
import { evreyeGec, sahne } from './deneme.ts'
import { ocakIlerle, ocaktanTut, rafaDokun } from './ocak.ts'
import type { Olay, Oyun, Urun } from './tipler.ts'

const E0 = EVRELER[0]!
const PISME = E0.cigerPisme
const PENCERE = E0.almaPenceresi

/** Ocağı `n` tik pişirir, olayları döner. */
function pisir(oyun: Oyun, n: number): Olay[] {
  const olaylar: Olay[] = []
  for (let i = 0; i < n; i++) ocakIlerle(oyun, olaylar)
  return olaylar
}

function kondur(oyun: Oyun, urun: Urun): Olay[] {
  const olaylar: Olay[] = []
  rafaDokun(oyun, urun, olaylar)
  return olaylar
}

function tut(oyun: Oyun, yuva: number): Olay[] {
  const olaylar: Olay[] = []
  ocaktanTut(oyun, yuva, olaylar)
  return olaylar
}

test('raf_sisIlkBosOcakYuvasinaIner_sureleriEvredenSabitlenir', () => {
  const oyun = sahne([])
  assert.deepEqual(kondur(oyun, 'ciger'), [{ tur: 'sisKondu', yuva: 0, urun: 'ciger' }])
  assert.deepEqual(oyun.ocak[0], { urun: 'ciger', gecen: 0, pisme: PISME, pencere: PENCERE, bant: E0.tamKivamBandi })
})

test('raf_evresiGelmemisUrun_etkisizdir', () => {
  const oyun = sahne([])
  assert.deepEqual([...kondur(oyun, 'dalak'), ...kondur(oyun, 'yurek')], [])
  assert.deepEqual(oyun.ocak, [null, null, null, null])
})

test('raf_dalakKisaYurekUzunPiser', () => {
  const oyun = sahne([])
  evreyeGec(oyun, 2)
  for (const u of ['ciger', 'dalak', 'yurek'] as const) kondur(oyun, u)
  const ayar = EVRELER[2]!
  const beklenen = (u: Urun) => Math.floor((ayar.cigerPisme * PISME_YUZDESI[u] + 50) / 100)
  assert.deepEqual(oyun.ocak.map((s) => s?.pisme ?? null), [beklenen('ciger'), beklenen('dalak'), beklenen('yurek'), null])
})

test('raf_eldeSisVarken_onunBosYuvasiAtlanir', () => {
  const oyun = sahne([])
  oyun.el = { tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 0 }
  assert.deepEqual(kondur(oyun, 'ciger'), [{ tur: 'sisKondu', yuva: 1, urun: 'ciger' }])
  assert.equal(oyun.ocak[0], null)
})

test('raf_acikYuvalarDoluysa_rafDoluOlayi_eldekineBakmaz', () => {
  const oyun = sahne([])
  oyun.el = { tur: 'eslikci', urun: 'domates' }
  for (let i = 0; i < 3; i++) kondur(oyun, 'ciger')
  assert.deepEqual(kondur(oyun, 'ciger'), [{ tur: 'rafDolu', urun: 'ciger' }])
  assert.equal(oyun.ocak[3], null)
})

test('ocak_pisenSiseDokunmak_etkisiz_yalnizSisErkenOlayi', () => {
  const oyun = sahne([])
  kondur(oyun, 'ciger')
  pisir(oyun, 10)
  assert.deepEqual(tut(oyun, 0), [{ tur: 'sisErken', yuva: 0 }])
  assert.ok(oyun.ocak[0])
  assert.equal(oyun.el, null)
})

test('ocak_pencereninOrtasindaTutulan_tamKivam_yuvaBosalir_kaliteMuhurlenir', () => {
  const oyun = sahne([])
  kondur(oyun, 'ciger')
  pisir(oyun, PISME + PENCERE / 2)
  assert.deepEqual(tut(oyun, 0), [{ tur: 'tutuldu', el: { tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 0 } }])
  assert.equal(oyun.ocak[0], null)
  pisir(oyun, 1000)
  assert.deepEqual(oyun.el, { tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 0 })
})

test('ocak_pencereninKenarindaTutulan_iyi', () => {
  const oyun = sahne([])
  kondur(oyun, 'ciger')
  pisir(oyun, PISME)
  assert.deepEqual(tut(oyun, 0), [{ tur: 'tutuldu', el: { tur: 'sis', urun: 'ciger', kalite: 'iyi', yuva: 0 } }])
})

test('ocak_elDoluyken_tutmakEtkisiz', () => {
  const oyun = sahne([])
  kondur(oyun, 'ciger')
  pisir(oyun, PISME)
  oyun.el = { tur: 'eslikci', urun: 'domates' }
  assert.deepEqual(tut(oyun, 0), [])
  assert.ok(oyun.ocak[0])
})

test('ocak_pencereGecinceSisYanar_komboSifirlanir_puanDusmez', () => {
  const oyun = sahne([])
  oyun.kombo = 5
  oyun.puan = 700
  kondur(oyun, 'ciger')
  assert.deepEqual(pisir(oyun, PISME + PENCERE - 1), [])
  assert.deepEqual(pisir(oyun, 1), [{ tur: 'sisYandi', yuva: 0 }])
  assert.equal(oyun.ocak[0], null)
  assert.equal(oyun.kombo, 0)
  assert.equal(oyun.puan, 700)
})
```

`lib/oyun/tabak.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TABAK_SINIRI } from './ayar.ts'
import { evreyeGec, sahne } from './deneme.ts'
import { birak, copeBirak, kasedenTut, tabagaDokun } from './tabak.ts'
import type { Elde, Olay, Oyun } from './tipler.ts'

const SIS: NonNullable<Elde> = { tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 2 }

function olaylarla(islem: (olaylar: Olay[]) => void): Olay[] {
  const olaylar: Olay[] = []
  islem(olaylar)
  return olaylar
}

test('kase_elBosken_eslikciEle_tukenmez_evresiGelmemisKaseEtkisiz', () => {
  const oyun = sahne([])
  assert.deepEqual(olaylarla((o) => kasedenTut(oyun, 'sogan', o)), [])
  assert.deepEqual(olaylarla((o) => kasedenTut(oyun, 'domates', o)), [{ tur: 'tutuldu', el: { tur: 'eslikci', urun: 'domates' } }])
  assert.deepEqual(olaylarla((o) => kasedenTut(oyun, 'domates', o)), [])
  oyun.el = null
  evreyeGec(oyun, 1)
  assert.deepEqual(olaylarla((o) => kasedenTut(oyun, 'sogan', o)), [{ tur: 'tutuldu', el: { tur: 'eslikci', urun: 'sogan' } }])
})

test('tabak_eldekiSisTabagaIner_kaliteyleBirlikte_elBosalir', () => {
  const oyun = sahne([])
  oyun.el = SIS
  assert.deepEqual(olaylarla((o) => tabagaDokun(oyun, 1, o)), [{ tur: 'tabagaKondu', no: 1, kalem: { urun: 'ciger', kalite: 'tam' }, el: SIS }])
  assert.deepEqual(oyun.tabaklar, [[], [{ urun: 'ciger', kalite: 'tam' }]])
  assert.equal(oyun.el, null)
})

test('tabak_eldekiEslikci_kalitesizIner', () => {
  const oyun = sahne([])
  oyun.el = { tur: 'eslikci', urun: 'domates' }
  tabagaDokun(oyun, 0, [])
  assert.deepEqual(oyun.tabaklar[0], [{ urun: 'domates', kalite: null }])
})

test('tabak_dorduncudenSonrakiBirakis_eldeKalir', () => {
  const oyun = sahne([])
  for (let i = 0; i < TABAK_SINIRI; i++) {
    oyun.el = { tur: 'eslikci', urun: 'domates' }
    tabagaDokun(oyun, 0, [])
  }
  oyun.el = SIS
  assert.deepEqual(olaylarla((o) => tabagaDokun(oyun, 0, o)), [{ tur: 'tabakDolu', no: 0 }])
  assert.deepEqual(oyun.el, SIS)
  assert.equal(oyun.tabaklar[0]?.length, TABAK_SINIRI)
})

test('tabak_elBoskenDoluTabak_ele_bosTabakEtkisiz_eldeTabakkenEtkisiz', () => {
  const oyun = sahne([])
  assert.deepEqual(olaylarla((o) => tabagaDokun(oyun, 0, o)), [])
  oyun.tabaklar[0] = [{ urun: 'ciger', kalite: 'iyi' }]
  assert.deepEqual(olaylarla((o) => tabagaDokun(oyun, 0, o)), [{ tur: 'tutuldu', el: { tur: 'tabak', no: 0 } }])
  assert.deepEqual(olaylarla((o) => tabagaDokun(oyun, 1, o)), [])
  assert.deepEqual(oyun.el, { tur: 'tabak', no: 0 })
  assert.deepEqual(oyun.tabaklar[0], [{ urun: 'ciger', kalite: 'iyi' }])
})

test('cop_eldekiYokOlur_tabaksaBosalir_puanVeKomboDegismez_elBoskenEtkisiz', () => {
  const oyun = sahne([])
  oyun.puan = 300
  oyun.kombo = 4
  assert.deepEqual(olaylarla((o) => copeBirak(oyun, o)), [])
  oyun.el = SIS
  assert.deepEqual(olaylarla((o) => copeBirak(oyun, o)), [{ tur: 'copeGitti', el: SIS }])
  assert.equal(oyun.el, null)
  oyun.tabaklar[1] = [{ urun: 'ciger', kalite: 'iyi' }, { urun: 'domates', kalite: null }]
  oyun.el = { tur: 'tabak', no: 1 }
  copeBirak(oyun, [])
  assert.deepEqual(oyun.tabaklar[1], [])
  assert.equal(oyun.el, null)
  assert.equal(oyun.puan, 300)
  assert.equal(oyun.kombo, 4)
})

test('birak_tabakYerineDoner_eslikciKaseyeDoner_sisteEtkisiz', () => {
  const oyun = sahne([])
  oyun.tabaklar[0] = [{ urun: 'ciger', kalite: 'iyi' }]
  oyun.el = { tur: 'tabak', no: 0 }
  assert.deepEqual(olaylarla((o) => birak(oyun, o)), [{ tur: 'birakildi', el: { tur: 'tabak', no: 0 } }])
  assert.deepEqual(oyun.tabaklar[0], [{ urun: 'ciger', kalite: 'iyi' }])
  oyun.el = { tur: 'eslikci', urun: 'domates' }
  assert.deepEqual(olaylarla((o) => birak(oyun, o)), [{ tur: 'birakildi', el: { tur: 'eslikci', urun: 'domates' } }])
  assert.equal(oyun.el, null)
  oyun.el = SIS
  assert.deepEqual(olaylarla((o) => birak(oyun, o)), [])
  assert.deepEqual(oyun.el, SIS)
  oyun.el = null
  assert.deepEqual(olaylarla((o) => birak(oyun, o)), [])
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `node --test lib/oyun/ocak.test.ts lib/oyun/tabak.test.ts`
Expected: FAIL (`tabak.ts` missing; `ocaktanTut` not exported).

- [ ] **Step 3: Implement the fire**

Replace `lib/oyun/ocak.ts` with:

```ts
import { ACILDIGI_EVRE, PISME_YUZDESI } from './ayar.ts'
import { evreAyari } from './durum.ts'
import type { Kalite, OcakSisi, Olay, Oyun, Urun } from './tipler.ts'

/** Raftan şiş: açık ocak yuvalarının ilk boşuna iner; elde tutulan şişin boşalmış yuvası atlanır (ekran şişi orada gösterir). */
export function rafaDokun(oyun: Oyun, urun: Urun, olaylar: Olay[]): void {
  if (ACILDIGI_EVRE[urun] > oyun.evre) return
  const ayar = evreAyari(oyun.evre)
  const el = oyun.el
  const yuva = oyun.ocak.slice(0, ayar.ocak).findIndex((sis, i) => !sis && !(el?.tur === 'sis' && el.yuva === i))
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

/** Tam kıvam bandı pencerenin ortasında: |gecen - pisme - pencere/2| <= bant/2, tamsayıda iki katıyla. */
export function sisKalitesi(sis: OcakSisi): Kalite {
  return Math.abs(2 * (sis.gecen - sis.pisme) - sis.pencere) <= sis.bant ? 'tam' : 'iyi'
}

/** Hazır şiş ele alınır, kalite o tikte mühürlenir, yuva boşalır. Pişerken dokunuş sallanır, el doluyken etkisiz. */
export function ocaktanTut(oyun: Oyun, yuva: number, olaylar: Olay[]): void {
  const sis = oyun.ocak[yuva]
  if (!sis || oyun.el) return
  if (sis.gecen < sis.pisme) {
    olaylar.push({ tur: 'sisErken', yuva })
    return
  }
  oyun.el = { tur: 'sis', urun: sis.urun, kalite: sisKalitesi(sis), yuva }
  oyun.ocak[yuva] = null
  olaylar.push({ tur: 'tutuldu', el: oyun.el })
}

/** Şişler pişer; pencereyi geçen yanar: yuva boşalır, kombo sıfırlanır, puan düşmez. */
export function ocakIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.ocak.forEach((sis, yuva) => {
    if (!sis) return
    sis.gecen++
    if (sis.gecen < sis.pisme + sis.pencere) return
    oyun.ocak[yuva] = null
    oyun.kombo = 0
    olaylar.push({ tur: 'sisYandi', yuva })
  })
}
```

- [ ] **Step 4: Implement the hand, plates, bowls, bin**

`lib/oyun/tabak.ts`:

```ts
import { ACILDIGI_EVRE, TABAK_SINIRI } from './ayar.ts'
import type { Eslikci, Olay, Oyun } from './tipler.ts'

/** Kase tükenmez: el boşsa ve eşlikçi açıldıysa eşlikçi ele. */
export function kasedenTut(oyun: Oyun, urun: Eslikci, olaylar: Olay[]): void {
  if (oyun.el || ACILDIGI_EVRE[urun] > oyun.evre) return
  oyun.el = { tur: 'eslikci', urun }
  olaylar.push({ tur: 'tutuldu', el: oyun.el })
}

/**
 * Tabak hem hedef hem kaynak: elde şiş ya da eşlikçi varsa tabağa iner (en çok dört kalem, beşinci
 * elde kalır); el boşsa ve tabak doluysa tabak ele; elde tabak varken etkisiz.
 */
export function tabagaDokun(oyun: Oyun, no: number, olaylar: Olay[]): void {
  const tabak = oyun.tabaklar[no]
  if (!tabak) return
  const el = oyun.el
  if (el === null) {
    if (tabak.length === 0) return
    oyun.el = { tur: 'tabak', no }
    olaylar.push({ tur: 'tutuldu', el: oyun.el })
    return
  }
  if (el.tur === 'tabak') return
  if (tabak.length >= TABAK_SINIRI) {
    olaylar.push({ tur: 'tabakDolu', no })
    return
  }
  const kalem = { urun: el.urun, kalite: el.tur === 'sis' ? el.kalite : null }
  tabak.push(kalem)
  oyun.el = null
  olaylar.push({ tur: 'tabagaKondu', no, kalem, el })
}

/** Çöp: eldeki yok olur, tabaksa boşalıp yerine döner. Puan ve kombo değişmez. */
export function copeBirak(oyun: Oyun, olaylar: Olay[]): void {
  const el = oyun.el
  if (!el) return
  if (el.tur === 'tabak') oyun.tabaklar[el.no] = []
  oyun.el = null
  olaylar.push({ tur: 'copeGitti', el })
}

/** Bırakma: tabak yerine, eşlikçi kaseye döner. Şişte etkisiz: yuvası boşaldı, yemeği yalnız çöp atar (spec §13). */
export function birak(oyun: Oyun, olaylar: Olay[]): void {
  const el = oyun.el
  if (!el || el.tur === 'sis') return
  oyun.el = null
  olaylar.push({ tur: 'birakildi', el })
}
```

- [ ] **Step 5: Run to verify they pass**

Run: `node --test lib/oyun/ocak.test.ts lib/oyun/tabak.test.ts lib/oyun/durum.test.ts lib/oyun/gece.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/oyun
git commit -m "Add the hand: take from the fire and bowls, plate, bin"
```

---

### Task 3: Guests, tips and the engine

**Files:**
- Create: `lib/oyun/misafir.ts`, `lib/oyun/misafir.test.ts`
- Modify: `lib/oyun/motor.ts`, `lib/oyun/motor.test.ts` (validity, replay and property tests; goldens are Task 4)

**Interfaces:**
- Consumes: Task 2 functions, `komboCarpani`, `sabirBonusu`, `evreAyari`.
- Produces: `gelisleriAl(oyun)`, `kuyruguOturt(oyun, olaylar)`, `fiseUyuyorMu(fis: readonly Kalem[], tabak: readonly TabakKalemi[]): boolean`, `misafireBirak(oyun, yer, olaylar)`, `paraAl(oyun, yer, olaylar)`, `paraIlerle(oyun, olaylar)`, `misafirleriIlerle(oyun, olaylar)` from `misafir.ts`; `ilerle(oyun, hedefler: readonly Hedef[]): Olay[]` and `simule(tohum, girdiler): Sonuc` with unchanged signatures; `HEDEFLER` (19 values) stays private to `motor.ts`.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/misafir.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EVRELER, KALKIS_TIK, PARA_TIK, PUAN } from './ayar.ts'
import { bekle, dokun, evreyeGec, sahne, sonaKadarBekle } from './deneme.ts'
import { fiseUyuyorMu } from './misafir.ts'
import { sabirBonusu } from './puan.ts'
import type { Oyun } from './tipler.ts'

const E0 = EVRELER[0]!
const MERKEZ = E0.cigerPisme + E0.almaPenceresi / 2

/** Ciğeri tam kıvamda tabak 0'a koyar, tabağı ele alır; olayları döner. */
function cigerTabagi(oyun: Oyun) {
  dokun(oyun, 'ciger')
  bekle(oyun, MERKEZ - 1)
  dokun(oyun, 'o0')
  dokun(oyun, 't0')
  return dokun(oyun, 't0')
}

test('misafir_kuyruktakiler_acikYerlerinEnKucukBosunaOturur_sabirOturuncaBaslar', () => {
  const oyun = sahne([['ciger'], ['ciger'], ['ciger']])
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'misafirGeldi', yer: 0 }, { tur: 'misafirGeldi', yer: 1 }])
  assert.equal(oyun.kuyruk.length, 1)
  assert.equal(oyun.misafirler[0]?.toplamSabir, E0.sabir)
  bekle(oyun, 5)
  assert.equal(oyun.misafirler[0]?.sabir, E0.sabir - 5)
})

test('misafir_tukenmezMisafirinSabri_azalmaz', () => {
  const oyun = sahne([['ciger']], true)
  bekle(oyun, 50)
  assert.equal(oyun.misafirler[0]?.sabir, E0.sabir)
})

test('fiseUyuyorMu_kumeBirebir_siraVeKaliteOnemsiz', () => {
  assert.ok(fiseUyuyorMu(['ciger', 'domates'], [{ urun: 'domates', kalite: null }, { urun: 'ciger', kalite: 'iyi' }]))
  assert.ok(!fiseUyuyorMu(['ciger', 'domates'], [{ urun: 'ciger', kalite: 'tam' }]))
  assert.ok(!fiseUyuyorMu(['ciger'], [{ urun: 'ciger', kalite: 'tam' }, { urun: 'ciger', kalite: 'tam' }]))
  assert.ok(!fiseUyuyorMu(['ciger', 'ciger'], [{ urun: 'ciger', kalite: 'tam' }, { urun: 'dalak', kalite: 'tam' }]))
})

test('misafir_dogruTabak_hesapPuana_bahsisTezgaha_tabakBosalir_otuzTikteKalkar', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  const olaylar = cigerTabagi(oyun)
  assert.deepEqual(olaylar, [{ tur: 'tutuldu', el: { tur: 'tabak', no: 0 } }])
  const yer = oyun.misafirler[0]!
  const bahsis = sabirBonusu(yer.sabir, yer.toplamSabir)
  const teslim = dokun(oyun, 'm0')
  assert.deepEqual(teslim, [
    { tur: 'teslim', yer: 0, no: 0, hesap: PUAN.tamKivam },
    { tur: 'paraDustu', yer: 0, tutar: bahsis },
  ])
  assert.equal(oyun.puan, PUAN.tamKivam)
  assert.equal(oyun.kombo, 1)
  assert.deepEqual(oyun.tabaklar[0], [])
  assert.equal(oyun.el, null)
  assert.deepEqual(oyun.paralar[0], { tutar: bahsis, kalan: PARA_TIK - 1 })
  assert.deepEqual(oyun.ozet, { misafir: 1, sis: 1, tamKivam: 1, enUzunKombo: 1, kalkan: 0, bahsis: 0 })
  assert.deepEqual(bekle(oyun, KALKIS_TIK - 2), [])
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'misafirKalkti', yer: 0, odedi: true }])
  assert.equal(oyun.misafirler[0], null)
})

test('misafir_eksikYaDaFazlaTabak_geriDoner_puanKomboTabakDegismez', () => {
  const oyun = sahne([['ciger', 'domates']])
  bekle(oyun, 1)
  oyun.kombo = 2
  cigerTabagi(oyun)
  assert.deepEqual(dokun(oyun, 'm0'), [{ tur: 'yanlisTabak', yer: 0, no: 0 }])
  assert.equal(oyun.el, null)
  assert.equal(oyun.puan, 0)
  assert.equal(oyun.kombo, 2)
  assert.deepEqual(oyun.tabaklar[0], [{ urun: 'ciger', kalite: 'tam' }])
  dokun(oyun, 'domates')
  dokun(oyun, 't0')
  dokun(oyun, 't0')
  assert.equal(dokun(oyun, 'm0')[0]?.tur, 'teslim')
  assert.equal(oyun.puan, PUAN.tamKivam + PUAN.eslikci)
})

test('misafir_bosYaDaOdemisYereTabak_geriDoner', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  cigerTabagi(oyun)
  assert.deepEqual(dokun(oyun, 'm2'), [{ tur: 'yanlisTabak', yer: 2, no: 0 }])
  assert.equal(oyun.el, null)
  dokun(oyun, 't0')
  dokun(oyun, 'm0')
  oyun.tabaklar[1] = [{ urun: 'ciger', kalite: 'iyi' }]
  dokun(oyun, 't1')
  assert.deepEqual(dokun(oyun, 'm0'), [{ tur: 'yanlisTabak', yer: 0, no: 1 }])
  assert.deepEqual(oyun.tabaklar[1], [{ urun: 'ciger', kalite: 'iyi' }])
})

test('misafir_sisDogrudanMisafire_etkisiz', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  dokun(oyun, 'ciger')
  bekle(oyun, MERKEZ - 1)
  dokun(oyun, 'o0')
  assert.deepEqual(dokun(oyun, 'm0'), [])
  assert.equal(oyun.el?.tur, 'sis')
})

test('odeme_komboVeSonSaatCarpanlari_hesabaVeBahsiseAyniUygulanir', () => {
  const oyun = sahne([['ciger']])
  evreyeGec(oyun, 4)
  bekle(oyun, 1)
  oyun.kombo = 3
  const E4 = EVRELER[4]!
  dokun(oyun, 'ciger')
  bekle(oyun, E4.cigerPisme + E4.almaPenceresi / 2 - 1)
  dokun(oyun, 'o0')
  dokun(oyun, 't0')
  dokun(oyun, 't0')
  const yer = oyun.misafirler[0]!
  const bahsis = sabirBonusu(yer.sabir, yer.toplamSabir) * 2 * 2
  const olaylar = dokun(oyun, 'm0')
  assert.deepEqual(olaylar[0], { tur: 'teslim', yer: 0, no: 0, hesap: PUAN.tamKivam * 2 * 2 })
  assert.deepEqual(olaylar[1], { tur: 'paraDustu', yer: 0, tutar: bahsis })
  assert.equal(oyun.kombo, 4)
})

test('para_dokununcaPuanaYazilir_sekizSaniyedeSolar_cezaYok', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  cigerTabagi(oyun)
  dokun(oyun, 'm0')
  const tutar = oyun.paralar[0]!.tutar
  const puan = oyun.puan
  assert.deepEqual(dokun(oyun, 'p0'), [{ tur: 'bahsisAlindi', yer: 0, tutar }])
  assert.equal(oyun.puan, puan + tutar)
  assert.equal(oyun.ozet.bahsis, tutar)
  assert.equal(oyun.paralar[0], null)
  assert.deepEqual(dokun(oyun, 'p0'), [])
  const ikinci = sahne([['ciger']])
  bekle(ikinci, 1)
  cigerTabagi(ikinci)
  dokun(ikinci, 'm0')
  assert.deepEqual(bekle(ikinci, PARA_TIK - 2).filter((o) => o.tur === 'paraSoldu'), [])
  assert.deepEqual(bekle(ikinci, 1), [{ tur: 'paraSoldu', yer: 0 }])
  assert.equal(ikinci.puan, puan)
})

test('para_ayniYereIkinciPara_toplanirSureYenidenBaslar_misafirOturur', () => {
  const oyun = sahne([['ciger'], ['ciger'], ['ciger']])
  bekle(oyun, 1)
  cigerTabagi(oyun)
  dokun(oyun, 'm0')
  const ilk = oyun.paralar[0]!.tutar
  bekle(oyun, KALKIS_TIK)
  assert.equal(oyun.misafirler[0]?.misafir.no, 2)
  assert.ok(oyun.paralar[0])
  cigerTabagi(oyun)
  dokun(oyun, 'm0')
  const para = oyun.paralar[0]!
  assert.ok(para.tutar > ilk)
  assert.equal(para.kalan, PARA_TIK - 1)
})

test('misafir_sabriBiten_kalkar_puanDusmez_komboSifir_ucuncuGeceyiBitirir', () => {
  const oyun = sahne([['ciger'], ['ciger'], ['ciger']])
  bekle(oyun, 1)
  oyun.puan = 500
  oyun.kombo = 4
  oyun.ozet.kalkan = 1
  const yer = oyun.misafirler[0]!
  yer.sabir = 1
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'misafirKalkti', yer: 0, odedi: false }, { tur: 'misafirGeldi', yer: 0 }])
  assert.equal(oyun.puan, 500)
  assert.equal(oyun.kombo, 0)
  assert.equal(oyun.ozet.kalkan, 2)
  sonaKadarBekle(oyun)
  assert.equal(oyun.bitti, 'ucMisafir')
  assert.ok(oyun.tik < 7200)
})

test('bitis_0500eUlasan_geceTamamOlur_1000Puan', () => {
  const oyun = sahne([])
  sonaKadarBekle(oyun)
  assert.equal(oyun.bitti, 'gece')
  assert.equal(oyun.tik, 7200)
  assert.equal(oyun.puan, PUAN.geceTamam)
})
```

`lib/oyun/motor.test.ts` (replace the file; goldens and the determinism test return in Task 4):

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TUR_TIK } from './ayar.ts'
import { bekle, dokun, sahne } from './deneme.ts'
import { yeniOyun } from './durum.ts'
import { ilerle, simule } from './motor.ts'
import { rastgele } from './rastgele.ts'
import type { Girdi, Hedef } from './tipler.ts'

export const TUM_HEDEFLER: readonly Hedef[] = [
  'ciger', 'dalak', 'yurek', 'domates', 'sogan', 'o0', 'o1', 'o2', 'o3', 't0', 't1', 'm0', 'm1', 'm2',
  'p0', 'p1', 'p2', 'cop', 'birak',
]

test('simule_siraDisiAralikDisiYaDaKesirliTik_hataVerir', () => {
  assert.throws(() => simule(1, [[5, 'ciger'], [4, 'ciger']]), RangeError)
  assert.throws(() => simule(1, [[TUR_TIK, 'ciger']]), RangeError)
  assert.throws(() => simule(1, [[-1, 'ciger']]), RangeError)
  assert.throws(() => simule(1, [[1.5, 'ciger']]), RangeError)
})

test('simule_tanimsizYaDaEskiHedefYaDaBozukGirdi_hataVerir', () => {
  const bozuk = (g: unknown) => g as Girdi[]
  for (const h of ['x', 's0', 'ayran', 'o4', 't2', 'm3', 'p3', 5, null]) {
    assert.throws(() => simule(1, bozuk([[0, h]])), RangeError, String(h))
  }
  assert.throws(() => simule(1, bozuk([null])), RangeError)
  assert.throws(() => simule(1, bozuk([[0, 'o0', 'fazla']])), RangeError)
})

test('simule_ondokuzHedefinHepsi_gecerli', () => {
  assert.equal(TUM_HEDEFLER.length, 19)
  assert.doesNotThrow(() => simule(1, TUM_HEDEFLER.map((h, i) => [i, h] as const)))
})

test('ilerle_ayniTikteTutVeBirakmaHedefi_sirayla', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  dokun(oyun, 'ciger')
  bekle(oyun, 300)
  const olaylar = dokun(oyun, 'o0', 't0')
  assert.deepEqual(olaylar.map((o) => o.tur), ['tutuldu', 'tabagaKondu'])
  assert.equal(oyun.el, null)
})

test('ilerle_bittiktenSonra_hicbirSeyDegismez', () => {
  const oyun = sahne([])
  oyun.bitti = 'gece'
  assert.deepEqual(ilerle(oyun, ['ciger', 'p0']), [])
  assert.equal(oyun.tik, 0)
})

test('evre_sinirdaGecer_olayVerir', () => {
  const oyun = sahne([])
  bekle(oyun, 899)
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'evre', evre: 1 }])
})

test('puan_rastgeleGirdiyle_hicbirTikteDusmez_500Tohum', () => {
  for (let tohum = 1; tohum <= 500; tohum++) {
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

- [ ] **Step 2: Run to verify they fail**

Run: `node --test lib/oyun/misafir.test.ts lib/oyun/motor.test.ts`
Expected: FAIL (`misafir.ts` missing; the stub `ilerle` ignores inputs).

- [ ] **Step 3: Implement guests and tips**

`lib/oyun/misafir.ts`:

```ts
import { KALKIS_TIK, PARA_TIK, PUAN } from './ayar.ts'
import { evreAyari } from './durum.ts'
import { komboCarpani, sabirBonusu } from './puan.ts'
import type { Kalem, Olay, Oyun, TabakKalemi } from './tipler.ts'

/** Geliş tiki gelen misafirler kapıdaki sıraya geçer. */
export function gelisleriAl(oyun: Oyun): void {
  while (oyun.gelecek[0] && oyun.gelecek[0].gelis <= oyun.tik) {
    oyun.kuyruk.push(oyun.gelecek.shift() as Oyun['gelecek'][number])
  }
}

/** Sıradaki misafir açık yerlerin en küçük boşuna oturur; sabır oturunca başlar. Para yeri kapatmaz. */
export function kuyruguOturt(oyun: Oyun, olaylar: Olay[]): void {
  const ayar = evreAyari(oyun.evre)
  for (let yer = 0; yer < ayar.misafir && oyun.kuyruk.length > 0; yer++) {
    if (oyun.misafirler[yer]) continue
    const misafir = oyun.kuyruk.shift()
    if (!misafir) return
    oyun.misafirler[yer] = { misafir, sabir: ayar.sabir, toplamSabir: ayar.sabir, kalkis: null }
    olaylar.push({ tur: 'misafirGeldi', yer })
  }
}

/** Doğru tabak: kalemler kümesi fişle birebir aynı; sıra ve şiş kalitesi önemsiz. */
export function fiseUyuyorMu(fis: readonly Kalem[], tabak: readonly TabakKalemi[]): boolean {
  if (fis.length !== tabak.length) return false
  const kalan = [...fis]
  for (const k of tabak) {
    const i = kalan.indexOf(k.urun)
    if (i === -1) return false
    kalan.splice(i, 1)
  }
  return true
}

function kalemPuani(k: TabakKalemi): number {
  if (k.kalite === null) return PUAN.eslikci
  return k.kalite === 'tam' ? PUAN.tamKivam : PUAN.iyi
}

/** Aynı yere ikinci para tek paraya eklenir, süre yeniden başlar. */
function paraDusur(oyun: Oyun, yer: number, tutar: number, olaylar: Olay[]): void {
  if (tutar <= 0) return
  oyun.paralar[yer] = { tutar: (oyun.paralar[yer]?.tutar ?? 0) + tutar, kalan: PARA_TIK }
  olaylar.push({ tur: 'paraDustu', yer, tutar })
}

/**
 * Elde tabak varsa misafire bırakılır: fişe uyuyorsa hesap puana, bahşiş tezgaha, tabak boşalır,
 * misafir öder; uymuyorsa, yer boşsa ya da ödemişse tabak yerine döner. Elde başka şey varsa etkisiz.
 */
export function misafireBirak(oyun: Oyun, yer: number, olaylar: Olay[]): void {
  const el = oyun.el
  if (!el || el.tur !== 'tabak') return
  oyun.el = null
  const misafir = oyun.misafirler[yer]
  const tabak = oyun.tabaklar[el.no] ?? []
  if (!misafir || misafir.kalkis !== null || !fiseUyuyorMu(misafir.misafir.fis, tabak)) {
    olaylar.push({ tur: 'yanlisTabak', yer, no: el.no })
    return
  }
  const carpan = komboCarpani(oyun.kombo) * evreAyari(oyun.evre).puanCarpani
  const hesap = tabak.reduce((t, k) => t + kalemPuani(k), 0) * carpan
  oyun.puan += hesap
  oyun.kombo++
  oyun.ozet.enUzunKombo = Math.max(oyun.ozet.enUzunKombo, oyun.kombo)
  oyun.ozet.misafir++
  for (const k of tabak) {
    if (k.kalite !== null) oyun.ozet.sis++
    if (k.kalite === 'tam') oyun.ozet.tamKivam++
  }
  oyun.tabaklar[el.no] = []
  misafir.kalkis = KALKIS_TIK
  olaylar.push({ tur: 'teslim', yer, no: el.no, hesap })
  paraDusur(oyun, yer, sabirBonusu(misafir.sabir, misafir.toplamSabir) * carpan, olaylar)
}

/** Bahşiş: dokununca puana yazılır, para silinir. */
export function paraAl(oyun: Oyun, yer: number, olaylar: Olay[]): void {
  const para = oyun.paralar[yer]
  if (!para) return
  oyun.puan += para.tutar
  oyun.ozet.bahsis += para.tutar
  oyun.paralar[yer] = null
  olaylar.push({ tur: 'bahsisAlindi', yer, tutar: para.tutar })
}

/** Para bekler, süresi dolunca solar: alınmamış ödül, ceza değil. */
export function paraIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.paralar.forEach((para, yer) => {
    if (!para) return
    para.kalan--
    if (para.kalan > 0) return
    oyun.paralar[yer] = null
    olaylar.push({ tur: 'paraSoldu', yer })
  })
}

/** Sabır her tik bir azalır, ödeyen kalkar, sabrı biten küser: yalnız kombo ve kalkan sayısı bedel öder. */
export function misafirleriIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.misafirler.forEach((yer, no) => {
    if (!yer) return
    if (yer.kalkis !== null) {
      yer.kalkis--
      if (yer.kalkis <= 0) {
        oyun.misafirler[no] = null
        olaylar.push({ tur: 'misafirKalkti', yer: no, odedi: true })
      }
      return
    }
    if (yer.misafir.tukenmez) return
    yer.sabir--
    if (yer.sabir > 0) return
    oyun.misafirler[no] = null
    oyun.kombo = 0
    oyun.ozet.kalkan++
    olaylar.push({ tur: 'misafirKalkti', yer: no, odedi: false })
  })
}
```

- [ ] **Step 4: Implement the engine**

Replace `lib/oyun/motor.ts` with:

```ts
import { KAYIP_SINIRI, PUAN, TUR_TIK } from './ayar.ts'
import { evreBul, yeniOyun } from './durum.ts'
import { gelisleriAl, kuyruguOturt, misafireBirak, misafirleriIlerle, paraAl, paraIlerle } from './misafir.ts'
import { ocakIlerle, ocaktanTut, rafaDokun } from './ocak.ts'
import { birak, copeBirak, kasedenTut, tabagaDokun } from './tabak.ts'
import type { Girdi, Hedef, Olay, Oyun, Sonuc } from './tipler.ts'

/** Tanınan 19 hedef; kayıttaki başka her şey bozuktur. */
const HEDEFLER: ReadonlySet<string> = new Set<Hedef>([
  'ciger', 'dalak', 'yurek', 'domates', 'sogan', 'o0', 'o1', 'o2', 'o3', 't0', 't1', 'm0', 'm1', 'm2',
  'p0', 'p1', 'p2', 'cop', 'birak',
])

function dokun(oyun: Oyun, hedef: Hedef, olaylar: Olay[]): void {
  if (!HEDEFLER.has(hedef)) return
  if (hedef === 'cop') return copeBirak(oyun, olaylar)
  if (hedef === 'birak') return birak(oyun, olaylar)
  if (hedef === 'domates' || hedef === 'sogan') return kasedenTut(oyun, hedef, olaylar)
  if (hedef === 'ciger' || hedef === 'dalak' || hedef === 'yurek') return rafaDokun(oyun, hedef, olaylar)
  const no = Number(hedef.slice(1))
  if (hedef.startsWith('o')) return ocaktanTut(oyun, no, olaylar)
  if (hedef.startsWith('t')) return tabagaDokun(oyun, no, olaylar)
  if (hedef.startsWith('m')) return misafireBirak(oyun, no, olaylar)
  paraAl(oyun, no, olaylar)
}

function bitisiDenetle(oyun: Oyun, olaylar: Olay[]): void {
  if (oyun.ozet.kalkan >= KAYIP_SINIRI) oyun.bitti = 'ucMisafir'
  else if (oyun.tik >= TUR_TIK) {
    oyun.puan += PUAN.geceTamam
    oyun.bitti = 'gece'
  }
  if (oyun.bitti) olaylar.push({ tur: 'bitti', sebep: oyun.bitti })
}

/**
 * Bir tik: önce bu tikin girdileri sırasıyla (aynı tikte tut ve bırakma hedefi olabilir), sonra
 * dünya ilerler (ocak, paralar, misafirler), tik artar, gelenler oturur, bitiş denetlenir.
 * Oyun ekranı da sunucu da yalnız bu fonksiyonla ilerler; aynı girdi aynı sonucu verir.
 */
export function ilerle(oyun: Oyun, hedefler: readonly Hedef[]): Olay[] {
  const olaylar: Olay[] = []
  if (oyun.bitti) return olaylar
  for (const hedef of hedefler) dokun(oyun, hedef, olaylar)
  ocakIlerle(oyun, olaylar)
  paraIlerle(oyun, olaylar)
  misafirleriIlerle(oyun, olaylar)
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

/** Her girdi `[tik, hedef]`: tik tamsayı, tur içinde ve sıralı, hedef tanımlı; değilse kayıt bozuktur. */
function girdileriDogrula(girdiler: readonly Girdi[]): void {
  let onceki = 0
  for (const girdi of girdiler) {
    if (!Array.isArray(girdi) || girdi.length !== 2) throw new RangeError(`bozuk girdi: ${JSON.stringify(girdi)}`)
    const [tik, hedef] = girdi
    if (!HEDEFLER.has(hedef)) throw new RangeError(`tanımsız hedef: ${String(hedef)}`)
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

- [ ] **Step 5: Run to verify they pass**

Run: `node --test lib/oyun/misafir.test.ts lib/oyun/motor.test.ts lib/oyun/ocak.test.ts lib/oyun/tabak.test.ts lib/oyun/durum.test.ts lib/oyun/gece.test.ts`
Expected: PASS. If a tick count in `misafir.test.ts` is off by one (the `bekle(oyun, MERKEZ - 1)` lines, or the evre 4 take in `odeme_komboVeSonSaat…`), fix the test's setup so the take lands at the band centre of the phase the test is in, not the engine. The coin-merge test takes the second plate right after the guest sits so the first coin is still alive after Task 4's retuning; keep it that way.

- [ ] **Step 6: Commit**

```bash
git add lib/oyun
git commit -m "Seat guests, match plates to tickets and pay tips"
```

---

### Task 4: Bots, difficulty gates, golden records

**Files:**
- Modify: `lib/oyun/deneme.ts` (bot half), `lib/oyun/ayar.ts` (numbers in `TABLO` and `BUTCE.aralik` only), `lib/oyun/gece.test.ts` (gates), `lib/oyun/motor.test.ts` (determinism and goldens), `lib/oyun/canli.test.ts`, `sunucu/suphe.test.ts`, `sunucu/uygulama.test.ts`, `sunucu/dogrulama.test.ts`
- Modify: `docs/surec/IYILESTIRMELER.md` (measurements)

**Interfaces:**
- Consumes: `eksikKalemler`, `fiseUyuyorMu`, `sisKalitesi`, `ilerle`, `rastgele`.
- Produces: `type Beceri = 'usta' | 'duzenli' | 'cirak' | 'rastgele' | 'hareketsiz'`, `ustaOyna(tohum: number, beceri: Beceri): Girdi[]` (name kept; used by `motor.test.ts`, `tavan.test.ts`, `canli.test.ts`, `sunucu/*.test.ts`).

- [ ] **Step 1: Write the failing gate tests**

Append to `lib/oyun/gece.test.ts` (imports: `ustaOyna` from `./deneme.ts`, `simule` from `./motor.ts`):

```ts
const ZORLUK_TOHUMLARI = Array.from({ length: 200 }, (_, i) => i * 104729 + 3)
const oyna = (tohum: number, beceri: Parameters<typeof ustaOyna>[1]) => simule(tohum, ustaOyna(tohum, beceri))

/* Kapı (spec tabak §5): ayar değişikliği kapıyı bozarsa oyun ya yapılamaz ya baskısız olmuştur. */
test('bot_usta_gecelerinEnAz95iniTamamlar_enYuksekPuan', () => {
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

test('bot_duzenli_gecelerinEnAz70iniTamamlar', () => {
  const tamam = ZORLUK_TOHUMLARI.filter((t) => oyna(t, 'duzenli').bitti === 'gece').length
  assert.ok(tamam >= 140, `düzenli ${tamam}/200 gece tamamladı`)
})

test('bot_cirak_gecelerinEnAz50siniTamamlar', () => {
  const tamam = ZORLUK_TOHUMLARI.filter((t) => oyna(t, 'cirak').bitti === 'gece').length
  assert.ok(tamam >= 100, `çırak ${tamam}/200 gece tamamladı`)
})

/* Spec'in "evre 2'yi geçer" kapısı yapı gereği sağlanır (ilk misafir tükenmez, ikinci 2820'den önce kalkamaz); yerine baskı ölçülür. */
test('bot_rastgele_gecelerinEnCok5iniTamamlar_puaniDuzenlininCeyregininAltinda', () => {
  let tamam = 0
  let rastgele = 0
  let duzenli = 0
  for (const t of ZORLUK_TOHUMLARI) {
    const r = oyna(t, 'rastgele')
    if (r.bitti === 'gece') tamam++
    rastgele += r.puan
    duzenli += oyna(t, 'duzenli').puan
  }
  assert.ok(tamam <= 10, `rastgele ${tamam}/200 gece tamamladı`)
  assert.ok(rastgele * 4 < duzenli, `rastgele ${rastgele} / düzenli ${duzenli}`)
})

test('bot_hareketsiz_sifirPuan_0200denOnceUcMisafirKalkar', () => {
  for (const t of ZORLUK_TOHUMLARI.slice(0, 50)) {
    const sonuc = oyna(t, 'hareketsiz')
    assert.equal(sonuc.puan, 0, `tohum ${t}`)
    assert.equal(sonuc.bitti, 'ucMisafir', `tohum ${t}`)
    assert.ok(sonuc.tik < (EVRELER[3]?.baslangic ?? 0), `tohum ${t}: ${sonuc.tik}`)
  }
})
```

The idle gate is "before 02:00" (tick 4500), not the spec's 01:30 (4050): with the spec's own patience values the third guest leaves at 2820 + 1320 = 4140 (guest 2 sits at 720 and leaves at 2820; guest 3 sits at 2700 when the third place opens and leaves at 4020; guest 4 sits at 2820 and leaves at 4140). Record this in `IYILESTIRMELER.md` in Step 3.

- [ ] **Step 2: Write the bots**

Append to `lib/oyun/deneme.ts` (add `ACILDIGI_EVRE, KASELER, RAF, TABAK_SINIRI` to the `./ayar.ts` import, `eksikKalemler` to the `./durum.ts` import, `import { fiseUyuyorMu } from './misafir.ts'`, `import { sisKalitesi } from './ocak.ts'`, `import { rastgele, type Rastgele } from './rastgele.ts'`, and `Eslikci, Girdi, Kalem, MisafirYeri, Urun` to the type import):

```ts
/**
 * Otomatik oyuncular (spec tabak §5, §13). 'usta' saniyede 3 girdi, şişi tam kıvam bandında tutar,
 * fişlere sabrı en az kalandan başlar, her bahşişi alır; 'duzenli' saniyede 2, hazır olur olmaz
 * tutar; 'cirak' ilk kez oynayan insanın yerine: 40 tik aralık, yani tut ile bırak arası en az 36 tik,
 * kararları düzenliyle aynı; 'rastgele' saniyede 2 geçerli hedefe rastgele; 'hareketsiz' hiç girdi vermez.
 */
export type Beceri = 'usta' | 'duzenli' | 'cirak' | 'rastgele' | 'hareketsiz'

const ARALIK: Record<Beceri, number> = { usta: 20, duzenli: 30, cirak: 40, rastgele: 30, hareketsiz: Number.MAX_SAFE_INTEGER }

/** Kalem çoklu-kümesi fişin altkümesi mi. */
function altKume(kalemler: readonly Kalem[], fis: readonly Kalem[]): boolean {
  const kalan = [...fis]
  return kalemler.every((k) => {
    const i = kalan.indexOf(k)
    if (i === -1) return false
    kalan.splice(i, 1)
    return true
  })
}

const fisi = (oyun: Oyun, yer: number): readonly Kalem[] => oyun.misafirler[yer]?.misafir.fis ?? []

/** Oturan, ödememiş misafir yerleri, sabrı en az kalandan başlayarak. */
function bekleyenler(oyun: Oyun): number[] {
  return oyun.misafirler
    .map((m, yer) => ({ m, yer }))
    .filter((x): x is { m: MisafirYeri; yer: number } => x.m !== null && x.m.kalkis === null)
    .sort((a, b) => a.m.sabir - b.m.sabir || a.yer - b.yer)
    .map((x) => x.yer)
}

/** Her tabağın hedef misafiri: tabaktakiler fişin altkümesiyse; bir misafire bir tabak; yoksa -1. */
function tabakHedefleri(oyun: Oyun): number[] {
  const alinan = new Set<number>()
  return oyun.tabaklar.map((tabak) => {
    if (tabak.length === 0) return -1
    const kalemler = tabak.map((k) => k.urun)
    const yer = bekleyenler(oyun).find((y) => !alinan.has(y) && altKume(kalemler, fisi(oyun, y)))
    if (yer === undefined) return -1
    alinan.add(yer)
    return yer
  })
}

/** Eldeki kalem hangi tabağa: hedefi olan ve kalemi daha eksik olan tabak, yoksa isteyen misafir varsa boş tabak, yoksa çöp. */
function koyulacakTabak(oyun: Oyun, urun: Kalem): Hedef {
  const hedefler = tabakHedefleri(oyun)
  for (const [no, tabak] of oyun.tabaklar.entries()) {
    const yer = hedefler[no] ?? -1
    if (yer === -1 || tabak.length >= TABAK_SINIRI) continue
    if (altKume([...tabak.map((k) => k.urun), urun], fisi(oyun, yer))) return `t${no}` as Hedef
  }
  const alinan = new Set(hedefler)
  const bos = oyun.tabaklar.findIndex((t) => t.length === 0)
  if (bos !== -1 && bekleyenler(oyun).some((y) => !alinan.has(y) && fisi(oyun, y).includes(urun))) {
    return `t${bos}` as Hedef
  }
  return 'cop'
}

/** Elde tabak: fişe uyuyorsa misafire, hedefi yoksa çöpe, eksikse yerine. */
function tabakla(oyun: Oyun, no: number): Hedef {
  const yer = tabakHedefleri(oyun)[no] ?? -1
  if (yer === -1) return 'cop'
  return fiseUyuyorMu(fisi(oyun, yer), oyun.tabaklar[no] ?? []) ? (`m${yer}` as Hedef) : 'birak'
}

/** Ocaktaki hazır şişlerden tutulacak ilk yuva: usta bandı bekler, düzenli hazır olunca; yanacaksa herkes tutar. */
function alinacakSis(oyun: Oyun, beceri: Beceri): Hedef | null {
  for (const [yuva, sis] of oyun.ocak.entries()) {
    if (!sis || sis.gecen < sis.pisme) continue
    const yanacak = sis.gecen >= sis.pisme + sis.pencere - ARALIK[beceri]
    const istenen = koyulacakTabak(oyun, sis.urun) !== 'cop'
    const zamani = beceri !== 'usta' || sisKalitesi(sis) === 'tam' || yanacak
    if ((istenen && zamani) || yanacak) return `o${yuva}` as Hedef
  }
  return null
}

function elBosKarar(oyun: Oyun, beceri: Beceri): Hedef | null {
  const para = oyun.paralar.findIndex(Boolean)
  if (para !== -1) return `p${para}` as Hedef
  const hedefler = tabakHedefleri(oyun)
  const hazir = hedefler.findIndex((yer, no) => yer !== -1 && fiseUyuyorMu(fisi(oyun, yer), oyun.tabaklar[no] ?? []))
  if (hazir !== -1) return `t${hazir}` as Hedef
  const yetim = hedefler.findIndex((yer, no) => yer === -1 && (oyun.tabaklar[no]?.length ?? 0) > 0)
  if (yetim !== -1) return `t${yetim}` as Hedef
  const al = alinacakSis(oyun, beceri)
  if (al) return al
  const eksik = eksikKalemler(oyun)
  const eslikci = eksik.find((k): k is Eslikci => KASELER.includes(k as Eslikci) && ACILDIGI_EVRE[k] <= oyun.evre)
  if (eslikci && koyulacakTabak(oyun, eslikci) !== 'cop') return eslikci
  const sis = eksik.find((k): k is Urun => RAF.includes(k as Urun) && ACILDIGI_EVRE[k] <= oyun.evre)
  const bosYuva = oyun.ocak.slice(0, evreAyari(oyun.evre).ocak).some((s) => !s)
  return sis && bosYuva ? sis : null
}

function rastgeleGirdi(oyun: Oyun, r: Rastgele): Hedef {
  const ayar = evreAyari(oyun.evre)
  const hedefler: Hedef[] = [
    ...RAF.filter((u) => ACILDIGI_EVRE[u] <= oyun.evre),
    ...KASELER.filter((e) => ACILDIGI_EVRE[e] <= oyun.evre),
    ...Array.from({ length: ayar.ocak }, (_, i) => `o${i}` as Hedef),
    't0', 't1',
    ...Array.from({ length: ayar.misafir }, (_, i) => `m${i}` as Hedef),
    'p0', 'p1', 'p2', 'cop', 'birak',
  ]
  return hedefler[r.tam(0, hedefler.length - 1)] as Hedef
}

function karar(oyun: Oyun, beceri: Beceri, r: Rastgele): Hedef | null {
  if (beceri === 'hareketsiz') return null
  if (beceri === 'rastgele') return rastgeleGirdi(oyun, r)
  const el = oyun.el
  if (el === null) return elBosKarar(oyun, beceri)
  return el.tur === 'tabak' ? tabakla(oyun, el.no) : koyulacakTabak(oyun, el.urun)
}

/** Bütün geceyi oynar, girdi kaydını döner. */
export function ustaOyna(tohum: number, beceri: Beceri): Girdi[] {
  const oyun = yeniOyun(tohum)
  const r = rastgele(tohum ^ 0x5bd1e995)
  const kayit: Girdi[] = []
  let sonGirdi = -ARALIK[beceri]
  while (!oyun.bitti) {
    const hedef = oyun.tik - sonGirdi >= ARALIK[beceri] ? karar(oyun, beceri, r) : null
    if (hedef) {
      kayit.push([oyun.tik, hedef])
      sonGirdi = oyun.tik
    }
    ilerle(oyun, hedef ? [hedef] : [])
  }
  return kayit
}
```

Then `npx tsc --noEmit -p . 2>&1 | grep deneme` must print nothing (remove any import the typecheck reports unused).

- [ ] **Step 3: Measure and tune**

Create `/tmp/bozo-oyun/sade/zorluk.mjs` (not in the repo):

```js
import { ustaOyna } from '/Users/mk/Desktop/Bozo/Web/lib/oyun/deneme.ts'
import { simule } from '/Users/mk/Desktop/Bozo/Web/lib/oyun/motor.ts'

const tohumlar = Array.from({ length: 200 }, (_, i) => i * 104729 + 3)
for (const beceri of ['usta', 'duzenli', 'cirak', 'rastgele', 'hareketsiz']) {
  const s = tohumlar.map((t) => simule(t, ustaOyna(t, beceri)))
  const tamam = s.filter((x) => x.bitti === 'gece').length
  const ortalama = Math.round(s.reduce((t, x) => t + x.puan, 0) / s.length)
  const evre3 = s.filter((x) => x.tik >= 2700).length
  const enGec = Math.max(...s.map((x) => x.tik))
  const misafir = (s.reduce((t, x) => t + x.ozet.misafir, 0) / s.length).toFixed(1)
  console.log(beceri.padEnd(10), { tamam, ortalama, evre3, enGec, misafir })
}
```

Run: `node /tmp/bozo-oyun/sade/zorluk.mjs`
Expected gates: usta `tamam >= 190` and highest `ortalama`, duzenli `tamam >= 140`, cirak `tamam >= 100`, rastgele `tamam <= 10` and `ortalama` under a quarter of düzenli's, hareketsiz `ortalama 0` and `enGec < 4500`. If the cirak or düzenli gate fails, change **only** the patience column of evre 3 and 4 (`TABLO` rows index 2 and 3; the review's estimate is that these two phases are short of time), one step of 60 ticks at a time; evre 1 and 2 patience stays, so the idle player still loses before 02:00 (`enGec < 4500`). If the usta gate fails, widen the window column one step. Keep the arrival-fit invariant (`gece_yirmiDortMisafir_sonMisafir05tenEnAz8SnOnce`). If `usta` leaves plates orphaned (`misafir` well under 24 with `tamam` high), the bot's `tabakHedefleri` is the suspect, not the numbers. Record the final table, the four bot lines and the idle-gate arithmetic in `docs/surec/IYILESTIRMELER.md` under a new heading "9 Ekim 2026: tabak akışı zorluk ayarı" (what, measured, why; one short paragraph and the table). The rastgele gate is satisfied by construction (the first guest never leaves and the second cannot leave before 2820), note that too.

- [ ] **Step 4: Regenerate the golden records**

Append to `lib/oyun/motor.test.ts` (import `ustaOyna` from `./deneme.ts`):

```ts
test('simule_ayniTohumVeGirdi_herSeferindeAyniSonuc', () => {
  const kayit = ustaOyna(77, 'usta')
  assert.deepEqual(simule(77, kayit), simule(77, kayit))
})

test('simule_bitistenSonrakiGirdiler_yokSayilir', () => {
  const kayit = ustaOyna(2026, 'hareketsiz')
  const sonuc = simule(2026, kayit)
  assert.equal(sonuc.bitti, 'ucMisafir')
  const fazla: Girdi[] = [...kayit, [sonuc.tik + 10, 'ciger']]
  assert.deepEqual(simule(2026, fazla), sonuc)
})
```

Print the goldens:

```bash
node -e "
import('/Users/mk/Desktop/Bozo/Web/lib/oyun/deneme.ts').then(async ({ ustaOyna }) => {
  const { simule } = await import('/Users/mk/Desktop/Bozo/Web/lib/oyun/motor.ts')
  for (const [t, b] of [[1, 'usta'], [1, 'duzenli'], [2026, 'rastgele']]) console.log(t, b, JSON.stringify(simule(t, ustaOyna(t, b))))
})"
```

Paste each printed object into a test of this shape in `motor.test.ts` (the printed numbers are the expected values; this is the one place values come from a run):

```ts
/* Altın kayıtlar: sabit tohum ve otomatik oyuncu, sabit sonuç. Kural, ayar ya da oyuncu değişince bilerek kırılır. */
test('altin_tohum1_usta', () => {
  assert.deepEqual(simule(1, ustaOyna(1, 'usta')), { /* printed object */ })
})
```

Same for `altin_tohum1_duzenli` and `altin_tohum2026_rastgele`.

- [ ] **Step 5: Server and live-loop fixtures**

- `lib/oyun/canli.test.ts`: `canliDokun(canli, 's0')` becomes `canliDokun(canli, 'birak')` and the expected record `[[0, 'ciger'], [0, 'birak']]`.
- `sunucu/suphe.ts` (ruling, spec §13): delete `SUPHE_TAM_KIVAM_ORANI` and `tamKivamSupheli`; `supheliMi` returns `zamanlamaSupheli(girdiler)` only, and the header comment says why (the band is visible as a ring and holding costs nothing, so an honest careful player can hit 100%). `sunucu/suphe.test.ts`: delete the `tamKivamSupheli_*` test, every `'s0'` becomes `'ciger'`, and the two bot-based tests become synthetic so they do not depend on how often the bot idles: `zamanlamaSupheli_sabitAralikliKayit_isaretlenir` uses `Array.from({ length: 200 }, (_, i) => [i * 20, i % 2 ? 'ciger' : 'birak'] as Girdi)` expecting `true`; add `supheliMi_yuzdeYuzTamKivam_tekBasinaIsaretlemez`: the jittered record from `zamanlamaSupheli_titreyenAraliklar_isaretlenmez` with `sonuc(40, 40)` expects `false`; `supheliMi_sabitAralik_isaretler`: the constant record with `sonuc(40, 0)` expects `true`.
- `sunucu/dogrulama.test.ts`: every `'s0'`/`'s1'` becomes `'ciger'`/`'birak'` (keep the same-tick-same-target case as `[[3, 'ciger'], [3, 'ciger']]`). Add the Review Focus pin: `assert.doesNotThrow(() => girdileriCoz({ girdiler: [[7, 'o0'], [7, 't0']] }))` (same tick, tut then drop).
- `sunucu/uygulama.test.ts`: `acemi` becomes `const duzenli = (tohum: number) => ustaOyna(tohum, 'duzenli')` and its one use; `'s0'` becomes `'ciger'` in the three records; the empty-record assertions become `assert.equal(y2.puan, 0)` with the comment "Boş kayıt her tohumda 0 puanla biter: sıra tohumdan bağımsız." and `ustekiFark` unchanged in form.

- [ ] **Step 6: Run and commit**

Run: `node --test lib/oyun/motor.test.ts lib/oyun/gece.test.ts lib/oyun/canli.test.ts sunucu/suphe.test.ts sunucu/dogrulama.test.ts sunucu/uygulama.test.ts`
Expected: PASS (the gate tests take tens of seconds).

```bash
git add lib/oyun sunucu docs/surec/IYILESTIRMELER.md
git commit -m "Rewrite the bots, pin the difficulty gates, drop the tam-kivam flag"
```

---

### Task 5: Score ceiling

**Files:**
- Modify: `lib/oyun/tavan.test.ts` (the implementation landed in Task 1 so the server could load; this task pins it)

**Interfaces:**
- Consumes: `tavan` (Task 1), bots (Task 4).
- Produces: the ceiling golden and the invariant tests.

- [ ] **Step 1: Write the failing tests**

Replace `lib/oyun/tavan.test.ts` with:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ustaOyna } from './deneme.ts'
import { simule } from './motor.ts'
import { tavan } from './tavan.ts'

test('tavan_hicbirAltinKayitTavaniAsmaz', () => {
  for (const [t, b] of [[1, 'usta'], [1, 'duzenli'], [2026, 'rastgele']] as const) {
    assert.ok(simule(t, ustaOyna(t, b)).puan <= tavan(t), `${t} ${b}`)
  }
})

test('tavan_kirkTohumdaUcBotunUstunde', () => {
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

/* Altın değer: bütçe ya da puan tablosu değişince bilerek kırılır. */
test('altin_tavan_tohum1', () => {
  assert.equal(tavan(1), 0)
})

/** Bütçe ve Karışık her tohumda aynı kalem kümesini verir; sıralanmış tabanlar da aynıdır: tavan tohumdan bağımsız. */
test('tavan_tohumdanBagimsiz', () => {
  for (let t = 2; t <= 40; t++) assert.equal(tavan(t), tavan(1), `tohum ${t}`)
})
```

- [ ] **Step 2: Pin the golden**

Run `node --test lib/oyun/tavan.test.ts`: `altin_tavan_tohum1` fails and prints the actual value; paste it in place of `0`. `tavan_tohumdanBagimsiz` must pass as written: if it does not, a budget leaks seed-dependent kalem counts and `gece.ts` is the bug, not the test.

- [ ] **Step 3: Run and commit**

Run: `node --test lib/oyun/tavan.test.ts sunucu/uygulama.test.ts`
Expected: PASS.

```bash
git add lib/oyun
git commit -m "Pin the score ceiling for the plate flow"
```

---

### Task 6: Display modules: view model, visuals, sounds, announcements, key actions

**Files:**
- Modify: `lib/oyun/gosterim.ts`, `lib/oyun/gorsel.ts`, `lib/oyun/ses.ts`, `lib/oyun/duyuru.ts`, `lib/oyun/klavye.ts` and their tests (`gosterim.test.ts`, `gorsel.test.ts`, `ses.test.ts`, `duyuru.test.ts`, `klavye.test.ts`)

**Interfaces:**
- Produces:
  - `gosterim.ts`: `oyunSaati(tik)` unchanged; `SisGorunumu = 'pisiyor' | 'hazir' | 'kivam'`; `sisGorunumu(sis)`; `Goruntu` and `goruntuAl(oyun)` as written below.
  - `gorsel.ts`: `pismeOrani`, `yanmaOrani`, `korYogunlugu`, `kivilcimYogunlugu`, `sabirDurumu`, `SABIR_ESIGI` unchanged; `paraOrani(para: Para | null): number`; `FisSatiri = { tur: 'karisik' } | { tur: 'kalem'; urun: Kalem; adet: number }`; `fisSatirlari(fis, karisik): FisSatiri[]`.
  - `ses.ts`: `SesAdi = 'cizirti' | 'tut' | 'tik' | 'tamKivam' | 'teslim' | 'bahsis' | 'birak' | 'yanlis' | 'yanik' | 'kalkti' | 'sonSaat' | 'gece' | 'kayip'`; `olayinSesi`, `sesSec` (dedupe only).
  - `duyuru.ts`: `DuyuruAnahtari = 'sonSaat' | 'misafirKalkti' | 'teslim' | 'bahsis' | 'yanlisTabak' | 'sisYandi' | 'paraSoldu' | 'tabagaKondu' | 'elde'`; `Duyuru = { anahtar; puan?: number; no?: number; urun?: Kalem }`; `duyuruSec`, `duyurucuKur` unchanged in shape.
  - `klavye.ts`: `tusEylemi(tus: string): 'dokun' | 'birak' | null`; `okAdimi`, `komsuIndeks` unchanged; `kisayolHedefi` and `KISAYOLLAR` deleted.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/gosterim.test.ts` (replace the two scene-dependent tests, keep `oyunSaati_*`):

```ts
import { EVRELER } from './ayar.ts'
import { bekle, dokun, sahne } from './deneme.ts'
import { goruntuAl, oyunSaati, sisGorunumu } from './gosterim.ts'

const E0 = EVRELER[0]!

test('sisGorunumu_pisiyorHazirKivam', () => {
  const sis = { urun: 'ciger' as const, gecen: 0, pisme: 240, pencere: 180, bant: 36 }
  assert.equal(sisGorunumu({ ...sis, gecen: 50 }), 'pisiyor')
  assert.equal(sisGorunumu({ ...sis, gecen: 240 }), 'hazir')
  assert.equal(sisGorunumu({ ...sis, gecen: 330 }), 'kivam')
  assert.equal(sisGorunumu({ ...sis, gecen: 400 }), 'hazir')
})

test('goruntuAl_evreAciklari_rayKesirleri_istenenlerVeEl', () => {
  const oyun = sahne([['ciger', 'ciger', 'domates']])
  bekle(oyun, 1)
  dokun(oyun, 'ciger')
  dokun(oyun, 'domates')
  const g = goruntuAl(oyun)
  assert.equal(g.acikMisafir, 2)
  assert.equal(g.acikOcak, 3)
  assert.deepEqual(g.raf, ['ciger'])
  assert.deepEqual(g.kaseler, ['domates'])
  assert.deepEqual(g.rafIstenen, ['ciger'])
  assert.deepEqual(g.kaseIstenen, [])
  assert.deepEqual(g.misafirler[0], { fis: ['ciger', 'ciger', 'domates'], karisik: false, odedi: false, varyant: 0 })
  assert.deepEqual(g.paralar, [null, null, null])
  const ray = E0.cigerPisme + E0.almaPenceresi
  assert.deepEqual(g.ocak[0], {
    urun: 'ciger',
    pencere: E0.cigerPisme / ray,
    kivam: (E0.cigerPisme + E0.almaPenceresi / 2) / ray,
    bant: E0.tamKivamBandi / ray,
  })
  assert.deepEqual(g.tabaklar, [[], []])
  assert.deepEqual(g.el, { tur: 'eslikci', urun: 'domates' })
  dokun(oyun, 't1')
  assert.deepEqual(goruntuAl(oyun).tabaklar[1], [{ urun: 'domates', kalite: null }])
})
```

`lib/oyun/gorsel.test.ts`: the `SIS` fixture drops `cevirme`; delete `servisEdilenler_*` and the old `fisSatirlari_*` tests; add:

```ts
import { PARA_TIK } from './ayar.ts'
import { fisSatirlari, paraOrani, /* existing names */ } from './gorsel.ts'

test('paraOrani_kalanSure_sifirBir', () => {
  assert.equal(paraOrani(null), 0)
  assert.equal(paraOrani({ tutar: 200, kalan: PARA_TIK }), 1)
  assert.equal(paraOrani({ tutar: 200, kalan: PARA_TIK / 4 }), 0.25)
})

test('fisSatirlari_ayniKalemTekSatirdaAdetle_karisikIlkUcuTekKume', () => {
  assert.deepEqual(fisSatirlari(['ciger', 'ciger', 'domates'], false), [
    { tur: 'kalem', urun: 'ciger', adet: 2 },
    { tur: 'kalem', urun: 'domates', adet: 1 },
  ])
  assert.deepEqual(fisSatirlari(['ciger', 'dalak', 'yurek', 'domates'], true), [
    { tur: 'karisik' },
    { tur: 'kalem', urun: 'domates', adet: 1 },
  ])
})
```

`lib/oyun/ses.test.ts`: the key list becomes `['bahsis', 'birak', 'cizirti', 'gece', 'kalkti', 'kayip', 'sonSaat', 'tamKivam', 'teslim', 'tik', 'tut', 'yanik', 'yanlis']`; the `olayinSesi` table becomes:

```ts
  const SIS = { tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 0 } as const
  const ornekler: [Olay, ReturnType<typeof olayinSesi>][] = [
    [{ tur: 'sisKondu', yuva: 0, urun: 'ciger' }, 'cizirti'],
    [{ tur: 'tutuldu', el: SIS }, 'tamKivam'],
    [{ tur: 'tutuldu', el: { ...SIS, kalite: 'iyi' } }, 'tut'],
    [{ tur: 'tutuldu', el: { tur: 'eslikci', urun: 'domates' } }, 'tut'],
    [{ tur: 'tutuldu', el: { tur: 'tabak', no: 0 } }, 'tut'],
    [{ tur: 'tabagaKondu', no: 0, kalem: { urun: 'ciger', kalite: 'tam' }, el: SIS }, 'tik'],
    [{ tur: 'teslim', yer: 0, no: 0, hesap: 150 }, 'teslim'],
    [{ tur: 'bahsisAlindi', yer: 0, tutar: 200 }, 'bahsis'],
    [{ tur: 'birakildi', el: SIS }, 'birak'],
    [{ tur: 'copeGitti', el: SIS }, 'birak'],
    [{ tur: 'yanlisTabak', yer: 0, no: 0 }, 'yanlis'],
    [{ tur: 'sisYandi', yuva: 1 }, 'yanik'],
    [{ tur: 'misafirKalkti', yer: 0, odedi: false }, 'kalkti'],
    [{ tur: 'misafirKalkti', yer: 0, odedi: true }, null],
    [{ tur: 'evre', evre: 4 }, 'sonSaat'],
    [{ tur: 'evre', evre: 3 }, null],
    [{ tur: 'sisErken', yuva: 0 }, null],
    [{ tur: 'paraDustu', yer: 0, tutar: 200 }, null],
    [{ tur: 'bitti', sebep: 'gece' }, 'gece'],
    [{ tur: 'bitti', sebep: 'ucMisafir' }, 'kayip'],
  ]
```

and the last test becomes `sesSec_ayniKaredeAyniSes_birKez` with `[{tutuldu tam}, {tutuldu tam at yuva 1}, {sisYandi}]` expecting `['tamKivam', 'yanik']`.

`lib/oyun/duyuru.test.ts`: in the unimportant list replace `sisKondu`/`evre 2`/paid `sofraKalkti` with `misafirGeldi`, `sisKondu`, `evre 2`, `{ tur: 'misafirKalkti', yer: 1, odedi: true }`; the priority test uses `sisYandi`, `teslim (hesap 640)`, `misafirKalkti (odedi false)`, `paraSoldu` expecting `{ anahtar: 'misafirKalkti' }`; `duyuruSec([{ teslim yer 1 hesap 640 }])` expects `{ anahtar: 'teslim', no: 2, puan: 640 }`; `duyuruSec([{ tutuldu eslikci domates }])` expects `{ anahtar: 'elde', urun: 'domates' }`; the throttle test replaces `sogudu` with `paraSoldu`.

`lib/oyun/klavye.test.ts`: replace the shortcut test with:

```ts
test('tusEylemi_enterVeBoslukDokunur_escBirakir_digerleriNull', () => {
  assert.deepEqual(['Enter', ' ', 'Escape', 'a', 'Tab', '1'].map(tusEylemi), ['dokun', 'dokun', 'birak', null, null, null])
})
```

- [ ] **Step 2: Run to verify they fail**

Run: `node --test lib/oyun/gosterim.test.ts lib/oyun/gorsel.test.ts lib/oyun/ses.test.ts lib/oyun/duyuru.test.ts lib/oyun/klavye.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

`lib/oyun/gosterim.ts` (replace from `SisGorunumu` down; imports become `ACILDIGI_EVRE, KASELER, OYUN_SAATI_TIK, RAF, TUR_TIK` from `./ayar.ts`, `eksikKalemler, evreAyari` from `./durum.ts`, `sisKalitesi` from `./ocak.ts`, types `Elde, Eslikci, Kalem, OcakSisi, Oyun, TabakKalemi, Urun`):

```ts
export type SisGorunumu = 'pisiyor' | 'hazir' | 'kivam'

/** Rayın o anki hali: pişiyor, alma penceresi (hazır), pencerenin ortasındaki tam kıvam bandı. */
export function sisGorunumu(sis: OcakSisi): SisGorunumu {
  if (sis.gecen < sis.pisme) return 'pisiyor'
  return sisKalitesi(sis) === 'tam' ? 'kivam' : 'hazir'
}

export type Goruntu = {
  acikMisafir: number
  acikOcak: number
  raf: readonly Urun[]
  kaseler: readonly Eslikci[]
  /** Misafirlerin beklediği ve henüz hazırlanmayan kalemler: raf düğmesi ve kase parlar (raf rehberi). */
  rafIstenen: readonly Urun[]
  kaseIstenen: readonly Eslikci[]
  kapida: number
  /** `varyant`: üç yüzsüz siluetten hangisi (misafir no mod 3). */
  misafirler: ({ fis: readonly Kalem[]; karisik: boolean; odedi: boolean; varyant: number } | null)[]
  paralar: (number | null)[]
  /** Rayın kesirleri (0-1): alma penceresinin başı, tam kıvam bandının ortası ve genişliği. */
  ocak: ({ urun: Urun; pencere: number; kivam: number; bant: number } | null)[]
  tabaklar: readonly (readonly TabakKalemi[])[]
  el: Elde
}

/** React'in çizdiği yapı: yalnız olay olunca değişen kısım. Kopyalar döner; simülasyonla paylaşılan dizi yok. */
export function goruntuAl(oyun: Oyun): Goruntu {
  const ayar = evreAyari(oyun.evre)
  const eksik = eksikKalemler(oyun)
  return {
    acikMisafir: ayar.misafir,
    acikOcak: ayar.ocak,
    raf: RAF.filter((u) => ACILDIGI_EVRE[u] <= oyun.evre),
    kaseler: KASELER.filter((e) => ACILDIGI_EVRE[e] <= oyun.evre),
    rafIstenen: RAF.filter((u) => eksik.includes(u)),
    kaseIstenen: KASELER.filter((e) => eksik.includes(e)),
    kapida: oyun.kuyruk.length,
    misafirler: oyun.misafirler.map((m) =>
      m ? { fis: m.misafir.fis, karisik: m.misafir.karisik, odedi: m.kalkis !== null, varyant: m.misafir.no % 3 } : null,
    ),
    paralar: oyun.paralar.map((p) => (p ? p.tutar : null)),
    ocak: oyun.ocak.map((s) => {
      if (!s) return null
      const ray = s.pisme + s.pencere
      return { urun: s.urun, pencere: s.pisme / ray, kivam: (s.pisme + s.pencere / 2) / ray, bant: s.bant / ray }
    }),
    tabaklar: oyun.tabaklar.map((t) => t.map((k) => ({ ...k }))),
    el: oyun.el ? { ...oyun.el } : null,
  }
}
```

Delete `ocakHamlesiVar`, `ipucuHedefi`, `SISLER`.

`lib/oyun/gorsel.ts`: delete `sayim`, `servisEdilenler` and the old `fisSatirlari`; add (imports: `PARA_TIK` from `./ayar.ts`; types `Kalem, Para` added, `Urun` removed):

```ts
/** Paranın kalan ömrü (0-1): solma opaklığı. */
export function paraOrani(para: Para | null): number {
  return para ? para.kalan / PARA_TIK : 0
}

export type FisSatiri = { tur: 'karisik' } | { tur: 'kalem'; urun: Kalem; adet: number }

/** Fişin simgeleri: aynı kalem tek satırda adetle; Karışık fişte ilk üç kalem tek kümedir. */
export function fisSatirlari(fis: readonly Kalem[], karisik: boolean): FisSatiri[] {
  const satirlar: FisSatiri[] = karisik ? [{ tur: 'karisik' }] : []
  const adet = new Map<Kalem, number>()
  for (const k of fis.slice(karisik ? 3 : 0)) adet.set(k, (adet.get(k) ?? 0) + 1)
  for (const [urun, n] of adet) satirlar.push({ tur: 'kalem', urun, adet: n })
  return satirlar
}
```

`lib/oyun/ses.ts`: `SesAdi` as in Interfaces; `SESLER` entries: delete `cevir`, `servis`, `fisTamam`; rename `tik` to `tut` (same `zil(1320, 70, 0.08)`), add `tik: zil(988, 90, 0.08)`, `teslim: [...zil(784, 120, 0.1), ...zil(988, 120, 0.1, 110), ...zil(1319, 320, 0.11, 220)]` (the old fişTamam chord), `bahsis: [...zil(2093, 160, 0.09), ...zil(2637, 260, 0.08, 90)]`, `birak: [{ tur: 'gurultu', suzgec: 'lowpass', hz: 700, hzSon: 300, ms: 120, kazanc: 0.07 }]`, `yanlis: [{ tur: 'ton', dalga: 'triangle', hz: 262, hzSon: 220, ms: 140, kazanc: 0.09 }, { tur: 'ton', dalga: 'triangle', hz: 262, hzSon: 220, ms: 140, kazanc: 0.09, gecikme: 170 }]`. `olayinSesi`:

```ts
export function olayinSesi(olay: Olay): SesAdi | null {
  switch (olay.tur) {
    case 'sisKondu':
      return 'cizirti'
    case 'tutuldu':
      return olay.el.tur === 'sis' && olay.el.kalite === 'tam' ? 'tamKivam' : 'tut'
    case 'tabagaKondu':
      return 'tik'
    case 'teslim':
      return 'teslim'
    case 'bahsisAlindi':
      return 'bahsis'
    case 'birakildi':
    case 'copeGitti':
      return 'birak'
    case 'yanlisTabak':
      return 'yanlis'
    case 'sisYandi':
      return 'yanik'
    case 'misafirKalkti':
      return olay.odedi ? null : 'kalkti'
    case 'evre':
      return olay.evre === 4 ? 'sonSaat' : null
    case 'bitti':
      return olay.sebep === 'gece' ? 'gece' : 'kayip'
    default:
      return null
  }
}

/** Karenin sesleri, her ad bir kez. */
export function sesSec(olaylar: readonly Olay[]): SesAdi[] {
  const secilen: SesAdi[] = []
  for (const olay of olaylar) {
    const ad = olayinSesi(olay)
    if (ad && !secilen.includes(ad)) secilen.push(ad)
  }
  return secilen
}
```

Update the file's header comment ("çan tınısı (tut, bahşiş, teslim), süzgeçli gürültü (cızırtı, bırakma), alçak vuruş (yanık)").

`lib/oyun/duyuru.ts`:

```ts
import type { Kalem, Olay } from './tipler.ts'

export type DuyuruAnahtari =
  | 'sonSaat' | 'misafirKalkti' | 'teslim' | 'bahsis' | 'yanlisTabak' | 'sisYandi' | 'paraSoldu' | 'tabagaKondu' | 'elde'
export type Duyuru = { anahtar: DuyuruAnahtari; puan?: number; no?: number; urun?: Kalem }

/** Önem sırası: büyük sayı önce söylenir. Tut ve bırak sonuçları en altta (spec tabak §3). */
const ONCELIK: Readonly<Record<DuyuruAnahtari, number>> = {
  sonSaat: 9, misafirKalkti: 8, teslim: 7, bahsis: 6, yanlisTabak: 5, sisYandi: 4, paraSoldu: 3, tabagaKondu: 2, elde: 1,
}

function olayDuyurusu(olay: Olay): Duyuru | null {
  switch (olay.tur) {
    case 'evre':
      return olay.evre === 4 ? { anahtar: 'sonSaat' } : null
    case 'misafirKalkti':
      return olay.odedi ? null : { anahtar: 'misafirKalkti' }
    case 'teslim':
      return { anahtar: 'teslim', no: olay.yer + 1, puan: olay.hesap }
    case 'bahsisAlindi':
      return { anahtar: 'bahsis', puan: olay.tutar }
    case 'yanlisTabak':
      return { anahtar: 'yanlisTabak' }
    case 'sisYandi':
      return { anahtar: 'sisYandi' }
    case 'paraSoldu':
      return { anahtar: 'paraSoldu' }
    case 'tabagaKondu':
      return { anahtar: 'tabagaKondu', no: olay.no + 1 }
    case 'tutuldu':
      return olay.el.tur === 'tabak' ? null : { anahtar: 'elde', urun: olay.el.urun }
    default:
      return null
  }
}
```

`duyuruSec`, `Duyurucu`, `duyurucuKur` unchanged.

`lib/oyun/klavye.ts`: delete `KISAYOLLAR`/`kisayolHedefi` and the `Hedef` import; add:

```ts
export type TusEylemi = 'dokun' | 'birak'

/** Enter ve boşluk odaktaki hedefe dokunur, Esc eldekini bırakır (spec tabak §3). Rakam kısayolu yok. */
export function tusEylemi(tus: string): TusEylemi | null {
  if (tus === 'Enter' || tus === ' ') return 'dokun'
  if (tus === 'Escape') return 'birak'
  return null
}
```

- [ ] **Step 4: Run the whole headless suite**

Run: `node --test lib/oyun/*.test.ts sunucu/*.test.ts`
Expected: PASS (the MariaDB contract test is opt-in and skips). `npx tsc --noEmit -p . 2>&1 | grep -v '^components/oyun' ; true` prints nothing.

- [ ] **Step 5: Commit**

```bash
git add lib/oyun
git commit -m "Describe the plate flow to the screen: view, sounds, announcements"
```

---

### Task 7: The gesture machine

**Files:**
- Create: `lib/oyun/surukle.ts`, `lib/oyun/surukle.test.ts`

**Interfaces:**
- Consumes: `Hedef`, `Elde`.
- Produces: `ESIK_PX = 8`, `KALDIRMA_PX = 12`; `type Isaret`, `type Surukleme`, `type Baglam = { elde: Hedef | null }`, `type SuruklemeSonucu = { durum: Surukleme; girdiler: Hedef[]; tasima: { dx: number; dy: number } | null }`; `surukle(durum, isaret, baglam): SuruklemeSonucu`; `eldeKaynagi(el: Elde): Hedef | null`; `kaynakMi(h: Hedef): boolean`; `birakmaHedefiMi(elde: Hedef, h: Hedef): boolean`. Task 10's `useSurukleme.ts` is the only DOM consumer.

Rules (spec §3 and §13): the machine still emits `birak`; the engine makes it a no-op for a skewer (Task 2), so a missed drop never throws food away. A press on a source while the hand is empty is the `tut`; a press that stays under 8 px keeps the item in hand (tap-tap); a drag released over a drop target of the held kind emits that target, released over nothing (no `[data-hedef]` under the finger) emits `birak`, released over anything else keeps the item in hand (snap back). While holding, a press on empty space is `birak`, on the held item's own source re-grabs it for dragging, on raf or coin passes the tap through, on another source is ignored (spec: "kaynaklara dokunmak etkisizdir"), on a drop target emits it. `pointercancel` mid-gesture is `birak`. A second pointer id is ignored until the first is released.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/surukle.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ESIK_PX, KALDIRMA_PX, birakmaHedefiMi, eldeKaynagi, surukle, type Surukleme } from './surukle.ts'
import type { Hedef } from './tipler.ts'

const BOS: Surukleme = { tur: 'bos' }
const bas = (hedef: Hedef | null, x = 0, y = 0, id = 1) => ({ tur: 'bas', id, hedef, x, y }) as const
const yuru = (x: number, y: number, id = 1) => ({ tur: 'yuru', id, x, y }) as const
const kaldir = (hedef: Hedef | null, x = 0, y = 0, id = 1) => ({ tur: 'kaldir', id, hedef, x, y }) as const

/** Baştan sona bir jest: her işaretin girdileri birleştirilir, son durum döner. */
function oynat(isaretler: Parameters<typeof surukle>[1][], elde: Hedef | null) {
  let durum: Surukleme = BOS
  const girdiler: Hedef[] = []
  let sonTasima: { dx: number; dy: number } | null = null
  for (const i of isaretler) {
    const s = surukle(durum, i, { elde })
    durum = s.durum
    girdiler.push(...s.girdiler)
    sonTasima = s.tasima
  }
  return { durum, girdiler, sonTasima }
}

test('surukle_esikAltiDokunus_tutVerir_eldeKalir', () => {
  const s = oynat([bas('o0'), yuru(ESIK_PX - 1, 0), kaldir('o0', ESIK_PX - 1, 0)], null)
  assert.deepEqual(s.girdiler, ['o0'])
  assert.deepEqual(s.durum, BOS)
})

test('surukle_esikUstuSurukleme_hedefteBirakir_tasimaParmaginUstunde', () => {
  const s = oynat([bas('o0'), yuru(0, ESIK_PX), yuru(0, 120)], 'o0')
  assert.deepEqual(s.sonTasima, { dx: 0, dy: 120 - KALDIRMA_PX })
  const son = surukle(s.durum, kaldir('t0', 0, 120), { elde: 'o0' })
  assert.deepEqual(son.girdiler, ['t0'])
  assert.deepEqual(son.durum, BOS)
  assert.equal(son.tasima, null)
})

test('surukle_tasima_elBoskenYok', () => {
  const s = oynat([bas('o0'), yuru(0, 40)], null)
  assert.equal(s.sonTasima, null)
})

test('surukle_bosAlanaBirakis_birakVerir', () => {
  const s = oynat([bas('o0'), yuru(0, 40), kaldir(null, 0, 40)], 'o0')
  assert.deepEqual(s.girdiler, ['birak'])
})

test('surukle_yanlisTurHedef_eldeKalir', () => {
  const sis = oynat([bas('o0'), yuru(0, 40), kaldir('m0', 0, 40)], 'o0')
  assert.deepEqual(sis.girdiler, [])
  const tabak = oynat([bas('t0'), yuru(0, 40), kaldir('t1', 0, 40)], 't0')
  assert.deepEqual(tabak.girdiler, [])
  const kendi = oynat([bas('o0'), yuru(0, 40), kaldir('o0', 0, 40)], 'o0')
  assert.deepEqual(kendi.girdiler, [])
})

test('surukle_tabak_misafireVeCope_sisVeEslikci_tabagaVeCope', () => {
  assert.ok(birakmaHedefiMi('t1', 'm2') && birakmaHedefiMi('t1', 'cop') && !birakmaHedefiMi('t1', 't0'))
  assert.ok(birakmaHedefiMi('o3', 't0') && birakmaHedefiMi('domates', 'cop') && !birakmaHedefiMi('o3', 'm0'))
  assert.ok(!birakmaHedefiMi('o0', 'p0') && !birakmaHedefiMi('o0', 'ciger'))
})

test('surukle_iptal_birakVerir', () => {
  const s = oynat([bas('t0'), yuru(0, 30), { tur: 'iptal', id: 1 }], 't0')
  assert.deepEqual(s.girdiler, ['birak'])
  assert.deepEqual(s.durum, BOS)
  assert.deepEqual(oynat([{ tur: 'iptal', id: 1 }], null).girdiler, [])
})

test('surukle_ikinciParmak_yokSayilir', () => {
  const s = oynat([bas('o0'), bas('t0', 0, 0, 2), yuru(0, 50, 2), kaldir('cop', 0, 50, 2), yuru(0, 50)], 'o0')
  assert.deepEqual(s.girdiler, [])
  assert.equal(s.durum.tur, 'basili')
  assert.deepEqual(s.sonTasima, { dx: 0, dy: 50 - KALDIRMA_PX })
})

test('surukle_dokunDokun_eldeykenHedefeDokunus_hedefVerir_bosAlanBirak', () => {
  assert.deepEqual(surukle(BOS, bas('t1'), { elde: 'o0' }).girdiler, ['t1'])
  assert.deepEqual(surukle(BOS, bas('m1'), { elde: 't0' }).girdiler, ['m1'])
  assert.deepEqual(surukle(BOS, bas(null), { elde: 'o0' }).girdiler, ['birak'])
})

test('surukle_eldeyken_kaynakYokSayilir_rafVeParaGecer_kendiKaynagiYenidenTutar', () => {
  assert.deepEqual(surukle(BOS, bas('o1'), { elde: 'o0' }).girdiler, [])
  assert.deepEqual(surukle(BOS, bas('domates'), { elde: 'o0' }).girdiler, [])
  assert.deepEqual(surukle(BOS, bas('m0'), { elde: 'o0' }).girdiler, [])
  assert.deepEqual(surukle(BOS, bas('ciger'), { elde: 'o0' }).girdiler, ['ciger'])
  assert.deepEqual(surukle(BOS, bas('p2'), { elde: 't0' }).girdiler, ['p2'])
  const tekrar = surukle(BOS, bas('o0'), { elde: 'o0' })
  assert.deepEqual(tekrar.girdiler, [])
  assert.equal(tekrar.durum.tur, 'basili')
})

test('surukle_elBosken_rafVeParaDokunma_hedefVeCopEtkisiz', () => {
  assert.deepEqual(surukle(BOS, bas('ciger'), { elde: null }).girdiler, ['ciger'])
  assert.deepEqual(surukle(BOS, bas('p0'), { elde: null }).girdiler, ['p0'])
  assert.deepEqual(surukle(BOS, bas('m0'), { elde: null }).girdiler, [])
  assert.deepEqual(surukle(BOS, bas('cop'), { elde: null }).girdiler, [])
  assert.equal(surukle(BOS, bas('ciger'), { elde: null }).durum.tur, 'bos')
})

test('surukle_klavye_dokunVeBirak', () => {
  assert.deepEqual(surukle(BOS, { tur: 'dokun', hedef: 'o0' }, { elde: null }).girdiler, ['o0'])
  assert.deepEqual(surukle(BOS, { tur: 'dokun', hedef: 't0' }, { elde: 'o0' }).girdiler, ['t0'])
  assert.deepEqual(surukle(BOS, { tur: 'birak' }, { elde: 'o0' }).girdiler, ['birak'])
  assert.deepEqual(surukle(BOS, { tur: 'birak' }, { elde: null }).girdiler, [])
})

test('eldeKaynagi_sisYuvasi_eslikciKasesi_tabakYeri', () => {
  assert.equal(eldeKaynagi(null), null)
  assert.equal(eldeKaynagi({ tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 2 }), 'o2')
  assert.equal(eldeKaynagi({ tur: 'eslikci', urun: 'sogan' }), 'sogan')
  assert.equal(eldeKaynagi({ tur: 'tabak', no: 1 }), 't1')
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test lib/oyun/surukle.test.ts`
Expected: FAIL (module missing).

- [ ] **Step 3: Implement**

`lib/oyun/surukle.ts`:

```ts
import type { Elde, Hedef } from './tipler.ts'

/*
 * Sürükleme durum makinesi (spec tabak §3). Simülasyon için sürükleme yoktur: her jest `tut` ve bir
 * hedef ya da `birak` girdisine iner. DOM yok; `useSurukleme.ts` işaretçiyi buraya çevirir.
 */

/** Parmak bu kadar yürürse öğe parmağa yapışır; altı dokun-dokun sayılır. */
export const ESIK_PX = 8
/** Sürüklenen öğe parmağın bu kadar üstünde durur ki görünsün. */
export const KALDIRMA_PX = 12

export type Isaret =
  | { tur: 'bas'; id: number; hedef: Hedef | null; x: number; y: number }
  | { tur: 'yuru'; id: number; x: number; y: number }
  | { tur: 'kaldir'; id: number; hedef: Hedef | null; x: number; y: number }
  | { tur: 'iptal'; id: number }
  | { tur: 'dokun'; hedef: Hedef }
  | { tur: 'birak' }

export type Surukleme =
  | { tur: 'bos' }
  | { tur: 'basili'; id: number; kaynak: Hedef; x0: number; y0: number; suruklendi: boolean }

/** Simülasyonun eli: tutulan öğenin kaynağı (`eldeKaynagi`) ya da null. */
export type Baglam = { elde: Hedef | null }

export type SuruklemeSonucu = {
  durum: Surukleme
  girdiler: Hedef[]
  /** Sürüklenen öğenin basılan noktaya göre ötelemesi; sürükleme yokken null. */
  tasima: { dx: number; dy: number } | null
}

const KAYNAK = /^(o[0-3]|t[01]|domates|sogan)$/
const DOKUNMA = /^(ciger|dalak|yurek|p[0-2])$/

export const kaynakMi = (h: Hedef): boolean => KAYNAK.test(h)

/** Eldeki türe göre bırakma hedefi: şiş ve eşlikçi tabağa ya da çöpe, tabak misafire ya da çöpe. */
export function birakmaHedefiMi(elde: Hedef, h: Hedef): boolean {
  if (h === 'cop') return true
  return elde.startsWith('t') ? /^m[0-2]$/.test(h) : /^t[01]$/.test(h)
}

/** Ekranın sürüklediği öğe hangi düğmede durur. */
export function eldeKaynagi(el: Elde): Hedef | null {
  if (!el) return null
  if (el.tur === 'sis') return `o${el.yuva}` as Hedef
  if (el.tur === 'eslikci') return el.urun
  return `t${el.no}` as Hedef
}

const bos = (girdiler: Hedef[] = []): SuruklemeSonucu => ({ durum: { tur: 'bos' }, girdiler, tasima: null })
const ayni = (durum: Surukleme): SuruklemeSonucu => ({ durum, girdiler: [], tasima: null })

function basma(i: Extract<Isaret, { tur: 'bas' }>, elde: Hedef | null): SuruklemeSonucu {
  const tut = (kaynak: Hedef, girdiler: Hedef[]): SuruklemeSonucu => ({
    durum: { tur: 'basili', id: i.id, kaynak, x0: i.x, y0: i.y, suruklendi: false },
    girdiler,
    tasima: null,
  })
  if (elde === null) {
    if (i.hedef === null) return bos()
    if (kaynakMi(i.hedef)) return tut(i.hedef, [i.hedef])
    return bos(DOKUNMA.test(i.hedef) ? [i.hedef] : [])
  }
  if (i.hedef === null) return bos(['birak'])
  if (i.hedef === elde) return tut(elde, [])
  if (birakmaHedefiMi(elde, i.hedef) || DOKUNMA.test(i.hedef)) return bos([i.hedef])
  return bos()
}

function yurume(durum: Surukleme, i: Extract<Isaret, { tur: 'yuru' }>, elde: Hedef | null): SuruklemeSonucu {
  if (durum.tur !== 'basili' || durum.id !== i.id) return ayni(durum)
  const dx = i.x - durum.x0
  const dy = i.y - durum.y0
  const suruklendi = durum.suruklendi || Math.hypot(dx, dy) >= ESIK_PX
  const yeni = suruklendi === durum.suruklendi ? durum : { ...durum, suruklendi }
  return { durum: yeni, girdiler: [], tasima: suruklendi && elde !== null ? { dx, dy: dy - KALDIRMA_PX } : null }
}

function kaldirma(durum: Surukleme, i: Extract<Isaret, { tur: 'kaldir' }>, elde: Hedef | null): SuruklemeSonucu {
  if (durum.tur !== 'basili' || durum.id !== i.id) return ayni(durum)
  if (!durum.suruklendi || elde === null) return bos()
  if (i.hedef === null) return bos(['birak'])
  return bos(birakmaHedefiMi(elde, i.hedef) ? [i.hedef] : [])
}

/** Her işaret için yeni durum, simülasyona gidecek girdiler ve taşıma ötelemesi. */
export function surukle(durum: Surukleme, isaret: Isaret, { elde }: Baglam): SuruklemeSonucu {
  switch (isaret.tur) {
    case 'bas':
      return durum.tur === 'bos' ? basma(isaret, elde) : ayni(durum)
    case 'yuru':
      return yurume(durum, isaret, elde)
    case 'kaldir':
      return kaldirma(durum, isaret, elde)
    case 'iptal':
      return durum.tur === 'basili' && durum.id === isaret.id ? bos(elde ? ['birak'] : []) : ayni(durum)
    case 'dokun':
      return { ...basma({ tur: 'bas', id: -1, hedef: isaret.hedef, x: 0, y: 0 }, elde), durum: { tur: 'bos' } }
    case 'birak':
      return bos(elde ? ['birak'] : [])
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `node --test lib/oyun/surukle.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/oyun/surukle.ts lib/oyun/surukle.test.ts
git commit -m "Reduce drag, tap-tap and keyboard gestures to grab and drop inputs"
```

---

### Task 8: The guide state machine

**Files:**
- Create: `lib/oyun/rehber.ts`, `lib/oyun/rehber.test.ts`
- Modify: `lib/oyun/defter.ts` (`rehberGorulduMu`/`rehberGoruldu` replace `ilkTurMu`/`ilkTurBitti`, key `bozo-oyun-rehber-goruldu`)

**Interfaces:**
- Produces: `RehberAdimi = 'bekle' | 'fis' | 'raf' | 'pisiyor' | 'hazir' | 'tabak' | 'misafir' | 'para' | 'ikinci' | 'eslikci' | 'bitti'`; `Rehber = { adim: RehberAdimi }`; `rehberBasla(): Rehber`; `rehberTamam(r)`; `rehberAtla(r)`; `rehberDurdurur(r): boolean`; `rehberIzni(r, hedef: Hedef): boolean`; `rehberIlerle(r, oyun, olaylar): Rehber` (same object back when the step does not change). `defter.ts`: `rehberGorulduMu(): boolean`, `rehberGoruldu(): void`.

Step table (spec §7): 1 `fis` (Tamam, clock stops), 2 `raf` (only `ciger`, stops), 3 `pisiyor` (no input, runs), 4 `hazir` (only `o0`, stops) then `tabak` (only `t0`, runs; `birak` refused so the skewer stays in hand), 5 `misafir` (only `t0` and `m0`, stops), 6 `para` (only `p0`, stops), then `ikinci` (free play, runs) until guest number 1 sits (guest 0 has left by then, so guest 1 usually sits in place 0: the trigger is the guest's `no`, not the place), 7 `eslikci` (`domates`, `t0`, `t1`, and `birak`, `cop`, `m0`, `m1` so a plate held when the step opens can be put down, binned or delivered; stops) until a tomato lands on a plate, then `bitti`.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/rehber.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EVRELER } from './ayar.ts'
import { bekle, dokun, sahne } from './deneme.ts'
import { yeniOyun } from './durum.ts'
import { rehberAtla, rehberBasla, rehberDurdurur, rehberIlerle, rehberIzni, rehberTamam, type Rehber } from './rehber.ts'
import type { Hedef, Oyun } from './tipler.ts'

const E0 = EVRELER[0]!
const HEDEFLER: readonly Hedef[] = ['ciger', 'dalak', 'domates', 'o0', 'o1', 't0', 't1', 'm0', 'm1', 'p0', 'cop', 'birak']
const izinliler = (r: Rehber) => HEDEFLER.filter((h) => rehberIzni(r, h))

/** Rehberi bir adım ilerletir: oyun `n` tik akar (ya da dokunur), rehber olayları görür. */
function akit(r: Rehber, oyun: Oyun, n: number): Rehber {
  return rehberIlerle(r, oyun, bekle(oyun, n))
}

function dokunup(r: Rehber, oyun: Oyun, ...h: Hedef[]): Rehber {
  return rehberIlerle(r, oyun, dokun(oyun, ...h))
}

test('rehber_misafirOturmadanBekler_oturuncaFis_tamamlaRaf', () => {
  const oyun = sahne([['ciger']])
  let r = rehberIlerle(rehberBasla(), oyun, [])
  assert.equal(r.adim, 'bekle')
  assert.deepEqual(izinliler(r), [])
  r = akit(r, oyun, 1)
  assert.equal(r.adim, 'fis')
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), [])
  assert.equal(rehberTamam(rehberBasla()).adim, 'bekle')
  r = rehberTamam(r)
  assert.equal(r.adim, 'raf')
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['ciger'])
})

test('rehber_tamYol_rafPisiyorHazirTabakMisafirParaIkinci', () => {
  const oyun = sahne([['ciger']])
  let r = rehberTamam(akit(rehberBasla(), oyun, 1))
  r = dokunup(r, oyun, 'ciger')
  assert.equal(r.adim, 'pisiyor')
  assert.ok(!rehberDurdurur(r))
  assert.deepEqual(izinliler(r), [])
  r = akit(r, oyun, E0.cigerPisme - 1)
  assert.equal(r.adim, 'hazir')
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['o0'])
  r = dokunup(r, oyun, 'o0')
  assert.equal(r.adim, 'tabak')
  assert.ok(!rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['t0'])
  r = dokunup(r, oyun, 't0')
  assert.equal(r.adim, 'misafir')
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['t0', 'm0'])
  r = dokunup(r, oyun, 't0')
  assert.equal(r.adim, 'misafir')
  r = dokunup(r, oyun, 'm0')
  assert.equal(r.adim, 'para')
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['p0'])
  r = dokunup(r, oyun, 'p0')
  assert.equal(r.adim, 'ikinci')
  assert.ok(!rehberDurdurur(r))
  assert.deepEqual(izinliler(r), HEDEFLER)
})

test('rehber_tabakAdiminda_birakReddedilir_adimTekrarEder', () => {
  const oyun = sahne([['ciger']])
  let r = rehberTamam(akit(rehberBasla(), oyun, 1))
  r = dokunup(r, oyun, 'ciger')
  r = akit(r, oyun, E0.cigerPisme - 1)
  r = dokunup(r, oyun, 'o0')
  assert.equal(r.adim, 'tabak')
  assert.ok(!rehberIzni(r, 'birak'))
  assert.ok(!rehberIzni(r, 'cop'))
  r = akit(r, oyun, 300)
  assert.equal(r.adim, 'tabak')
  assert.equal(oyun.el?.tur, 'sis')
})

test('rehber_ikinciMisafirOturunca_eslikciAdimi_domatesTabagaInincebiter', () => {
  const oyun = yeniOyun(1)
  let r = rehberBasla()
  r = akit(r, oyun, 61)
  assert.equal(r.adim, 'fis')
  r = rehberTamam(r)
  r = dokunup(r, oyun, 'ciger')
  r = akit(r, oyun, E0.cigerPisme - 1)
  r = dokunup(r, oyun, 'o0')
  r = dokunup(r, oyun, 't0')
  r = dokunup(r, oyun, 't0')
  r = dokunup(r, oyun, 'm0')
  r = dokunup(r, oyun, 'p0')
  assert.equal(r.adim, 'ikinci')
  r = dokunup(r, oyun, 'ciger')
  assert.equal(r.adim, 'ikinci')
  while (r.adim === 'ikinci') r = akit(r, oyun, 1)
  assert.equal(r.adim, 'eslikci')
  assert.equal(oyun.misafirler[0]?.misafir.no, 1)
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['domates', 't0', 't1', 'm0', 'm1', 'cop', 'birak'])
  r = dokunup(r, oyun, 'domates')
  assert.equal(r.adim, 'eslikci')
  r = dokunup(r, oyun, 't1')
  assert.equal(r.adim, 'bitti')
  assert.deepEqual(izinliler(r), HEDEFLER)
})

test('rehber_eslikciAdiminda_eldekiTabak_birakilirYaDaCopeGider', () => {
  const oyun = yeniOyun(1)
  let r: Rehber = { adim: 'ikinci' }
  oyun.tabaklar[1] = [{ urun: 'ciger', kalite: 'iyi' }]
  dokun(oyun, 't1')
  assert.equal(oyun.el?.tur, 'tabak')
  while (r.adim === 'ikinci') r = akit(r, oyun, 1)
  assert.equal(r.adim, 'eslikci')
  assert.ok(rehberIzni(r, 'birak') && rehberIzni(r, 'cop'))
  r = dokunup(r, oyun, 'birak')
  assert.equal(oyun.el, null)
  assert.equal(r.adim, 'eslikci')
})

test('rehber_atla_herAdimdaBitirir_degismeyenNesneAyniKalir_geceBittiyseBiter', () => {
  const r = rehberBasla()
  assert.equal(rehberAtla(r).adim, 'bitti')
  assert.equal(rehberIlerle(r, sahne([]), []), r)
  const oyun = sahne([])
  oyun.bitti = 'ucMisafir'
  assert.equal(rehberIlerle(rehberBasla(), oyun, []).adim, 'bitti')
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test lib/oyun/rehber.test.ts`
Expected: FAIL (module missing).

- [ ] **Step 3: Implement**

`lib/oyun/rehber.ts`:

```ts
import type { Hedef, Olay, Oyun } from './tipler.ts'

/*
 * Rehberli ilk tur (spec tabak §7): saf durum makinesi. Simülasyonu değiştirmez; hangi adımda
 * saatin durduğunu ve hangi girdiye izin verildiğini söyler. Reddedilen girdi kayda girmez.
 */
export type RehberAdimi =
  | 'bekle' | 'fis' | 'raf' | 'pisiyor' | 'hazir' | 'tabak' | 'misafir' | 'para' | 'ikinci' | 'eslikci' | 'bitti'
export type Rehber = { adim: RehberAdimi }

const IZIN: Readonly<Partial<Record<RehberAdimi, readonly Hedef[]>>> = {
  raf: ['ciger'],
  hazir: ['o0'],
  tabak: ['t0'],
  misafir: ['t0', 'm0'],
  para: ['p0'],
  // Adım açılırken elde tabak olabilir: bırakma, çöp ve teslim de geçer, yoksa adım kilitlenir.
  eslikci: ['domates', 't0', 't1', 'm0', 'm1', 'cop', 'birak'],
}

const DURAN: ReadonlySet<RehberAdimi> = new Set(['fis', 'raf', 'hazir', 'misafir', 'para', 'eslikci'])

export const rehberBasla = (): Rehber => ({ adim: 'bekle' })
export const rehberAtla = (r: Rehber): Rehber => (r.adim === 'bitti' ? r : { adim: 'bitti' })
/** Oyuncunun "Tamam" demesiyle fiş adımından rafa geçilir. */
export const rehberTamam = (r: Rehber): Rehber => (r.adim === 'fis' ? { adim: 'raf' } : r)
/** Bu adımlarda saat girdiyi bekler; `tabak` ve `ikinci` akar. */
export const rehberDurdurur = (r: Rehber): boolean => DURAN.has(r.adim)

/** Adımın izin verdiği girdi; serbest adımlarda (`ikinci`, `bitti`) hepsi. `birak` hiçbir öğretici adımda geçmez. */
export function rehberIzni(r: Rehber, hedef: Hedef): boolean {
  if (r.adim === 'ikinci' || r.adim === 'bitti') return true
  return IZIN[r.adim]?.includes(hedef) ?? false
}

const var_ = (olaylar: readonly Olay[], tur: Olay['tur']): boolean => olaylar.some((o) => o.tur === tur)
const hazirMi = (oyun: Oyun): boolean => oyun.ocak.some((s) => s !== null && s.gecen >= s.pisme)

function sonraki(r: Rehber, oyun: Oyun, olaylar: readonly Olay[]): RehberAdimi {
  if (oyun.bitti) return 'bitti'
  switch (r.adim) {
    case 'bekle':
      return oyun.misafirler[0] ? 'fis' : 'bekle'
    case 'raf':
      return var_(olaylar, 'sisKondu') ? 'pisiyor' : 'raf'
    case 'pisiyor':
      return hazirMi(oyun) ? 'hazir' : 'pisiyor'
    case 'hazir':
      return var_(olaylar, 'tutuldu') ? 'tabak' : 'hazir'
    case 'tabak':
      return var_(olaylar, 'tabagaKondu') ? 'misafir' : 'tabak'
    case 'misafir':
      return var_(olaylar, 'teslim') ? 'para' : 'misafir'
    case 'para':
      return var_(olaylar, 'bahsisAlindi') ? 'ikinci' : 'para'
    case 'ikinci':
      return oyun.misafirler.some((m) => m?.misafir.no === 1) ? 'eslikci' : 'ikinci'
    case 'eslikci':
      return olaylar.some((o) => o.tur === 'tabagaKondu' && o.kalem.urun === 'domates') ? 'bitti' : 'eslikci'
    default:
      return r.adim
  }
}

/** Her karede, o karenin olaylarıyla; adım değişmediyse aynı nesne döner. */
export function rehberIlerle(r: Rehber, oyun: Oyun, olaylar: readonly Olay[]): Rehber {
  const adim = sonraki(r, oyun, olaylar)
  return adim === r.adim ? r : { adim }
}
```

(`var_` avoids shadowing the keyword; rename to `olayVar` if the trailing underscore reads badly, and use the same name in both places.)

`lib/oyun/defter.ts`: rename `ILK_TUR` to `REHBER = 'bozo-oyun-rehber-goruldu'`, `ilkTurMu` to `rehberGorulduMu` (returns `getItem(REHBER) === '1'`; note the inverted sense: true when the guide was already seen; storage failure returns `false` so the guide shows), `ilkTurBitti` to `rehberGoruldu`. Fix the doc comments ("Rehber yalnız bu tarayıcıdaki ilk turda çıkar"). Callers in `components/oyun/useOyunAkisi.ts` are fixed in Task 11.

- [ ] **Step 4: Run to verify it passes**

Run: `node --test lib/oyun/rehber.test.ts lib/oyun/*.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/oyun
git commit -m "Add the guided-round state machine for the plate flow"
```

---

### Task 9: The board: scene parts, four strips, HUD, dictionary

**Files:**
- Create: `components/oyun/Serit.tsx`, `SeritMisafir.tsx`, `SeritOcak.tsx`, `SeritTabak.tsx`, `SeritRaf.tsx`, `SahneMisafir.tsx`, `SahneMisafir.module.css`
- Delete: `components/oyun/Seritler.tsx`, `SeritlerTezgah.tsx`, `SahneSofra.tsx`, `SahneSofra.module.css`
- Modify: `components/oyun/SahneTezgah.tsx`, `SahneTezgah.module.css`, `SahneTane.tsx`, `SahneOcak.tsx`, `SahneOcak.module.css`, `Semboller.tsx`, `Semboller.module.css`, `Hud.tsx`, `Hud.module.css`, `Saha.tsx`, `Saha.module.css`, `SahneDefs.tsx`, `content/tr/oyun.ts`, `content/en/oyun.ts`
- Test: `node --test components/oyun/SahneDefs.test.ts styles/*.test.ts`; `npm run typecheck` turns green in Task 10, not here (`Saha.tsx` still calls the old `useOyunAlani` signature until then)

**Interfaces:**
- Consumes: `Goruntu` (Task 6), `fisSatirlari`, dictionary keys below.
- Produces: the DOM contract every later task relies on:
  - every source and target is a real `<button type="button" data-hedef="…">` with no `onClick`; pointer and keyboard input arrive through the root (Task 10);
  - sources carry exactly one `[data-tasinir]` descendant (the element a drag moves) and `data-elde` when the simulation's hand holds the item shown there;
  - `[data-hedef="m0".."m2"]` guest places (with `[data-ciz="sabir"] [data-no]` ring, `id="oyun-m0-fis"` and `id="oyun-m0-sabir"` label spans), `[data-hedef="p0".."p2"]` coins (`data-ciz="para"`, `data-bos` when empty), `[data-hedef="o0".."o3"]` slots (`data-ciz="ocak"`, `data-gorunum`, label spans `oyun-o0-ad` and `oyun-o0-durum`), `[data-hedef="t0"|"t1"]` plates, `[data-hedef="domates"|"sogan"]` bowls, `[data-hedef="cop"]`, `[data-hedef="ciger"|"dalak"|"yurek"]` rack buttons;
  - `Saha` props `{ dil; tohum; rehberli: boolean; bitince; cik }`; `SeritProps = { goruntu: Goruntu; ad: (k: Kalem) => string; metin: Metin }`.

- [ ] **Step 1: Dictionary**

`content/tr/oyun.ts`: delete `tezgah`, `sofra`, `bosSofra`, `kurulu`, `ucSofraKalkti`, `duyuru.porsiyon`, `duyuru.sofraKalkti`, `duyuru.fisTamam`, `duyuru.sogudu`; change `ozet` and add the keys below (keep everything else):

```ts
  ocak: 'Ocak',
  raf: 'Raf',
  tabak: 'Tabak',
  kase: 'Kase',
  cop: 'Çöp',
  misafir: 'Misafir',
  bosYer: 'boş yer',
  bahsis: 'Bahşiş',
  kapida: 'Kapıda',
  /** Düğme adlarının durum parçaları (spec tabak §3): "Ocak 1: ciğer, hazır", "Misafir 2: ciğer ve domates istiyor, sabır yüzde 60". */
  durum: { pisiyor: 'pişiyor', hazir: 'hazır', elde: 'elde', bos: 'boş', odedi: 'ödedi', istiyor: '{fis} istiyor', sabir: 'sabır yüzde {yuzde}', ve: ' ve ' },
  ucMisafirKalkti: 'üç misafir kalktı',
  duyuru: {
    sonSaat: 'Son saat',
    misafirKalkti: 'Misafir kalktı',
    teslim: 'Misafir {no} ödedi, +{puan}',
    bahsis: 'Bahşiş +{puan}',
    yanlisTabak: 'Tabak fişe uymuyor',
    sisYandi: 'Şiş yandı',
    paraSoldu: 'Bahşiş soldu',
    tabagaKondu: 'Tabağa kondu',
    elde: '{urun} elde',
  },
  ozet: { misafir: 'misafir', sis: 'şiş', tamKivam: 'tam kıvam', enUzunKombo: 'en uzun kombo', bahsis: 'bahşiş' },
  /** Rehberli ilk tur (spec tabak §7); her cümle en çok altı sözcük. */
  rehber: {
    fis: 'Misafir ciğer istiyor',
    raf: 'Ciğer şişini ocağa koy',
    pisiyor: 'Şiş pişiyor, altın olunca tut',
    hazir: 'Şişe dokun, sonra tabağa',
    tabak: 'Şişe dokun, sonra tabağa',
    misafir: 'Tabağa dokun, sonra misafire',
    para: 'Bahşişi al',
    eslikci: 'Domatese dokun, sonra tabağa',
    tamam: 'Tamam',
    atla: 'Atla',
  },
```

These are the tap-mode sentences (owner's delegate, spec §13: taps ship first). Task 14 replaces `hazir`, `tabak`, `misafir`, `eslikci` with the drag wording from spec §7: TR `'Şişi tabağa sürükle'`, `'Şişi tabağa sürükle'`, `'Tabağı misafire götür'`, `'Domatesi de tabağa koy'`; EN `'Drag the skewer to the plate'`, `'Drag the skewer to the plate'`, `'Drag the plate to the guest'`, `'Add the tomato too'`.

`content/en/oyun.ts`, same keys: `tabak: 'Plate'`, `kase: 'Bowl'`, `cop: 'Bin'`, `misafir: 'Guest'`, `bosYer: 'empty seat'`, `bahsis: 'Tip'`, `durum: { pisiyor: 'cooking', hazir: 'ready', elde: 'in hand', bos: 'empty', odedi: 'paid', istiyor: 'wants {fis}', sabir: 'patience {yuzde} percent', ve: ' and ' }`, `ucMisafirKalkti: 'three guests walked out'`, `duyuru: { sonSaat: 'Last hour', misafirKalkti: 'A guest walked out', teslim: 'Guest {no} paid, +{puan}', bahsis: 'Tip +{puan}', yanlisTabak: 'Plate does not match the ticket', sisYandi: 'Skewer burnt', paraSoldu: 'Tip gone', tabagaKondu: 'On the plate', elde: '{urun} in hand' }`, `ozet: { misafir: 'guests', sis: 'skewers', tamKivam: 'just right', enUzunKombo: 'longest combo', bahsis: 'tips' }`, `rehber: { fis: 'The guest wants liver', raf: 'Tap Ciğer to start grilling', pisiyor: 'Wait until it turns golden', hazir: 'Tap the skewer, then the plate', tabak: 'Tap the skewer, then the plate', misafir: 'Tap the plate, then the guest', para: 'Tap the tip', eslikci: 'Tap the tomato, then the plate', tamam: 'Got It', atla: 'Skip' }` (each at most six words).

Side-dish names come from the menu: `ad('domates')` reads `s.menu.ikramlar.ogeler.domates`, `ad('sogan')` reads `s.menu.ikramlar.ogeler.sumakli`.

- [ ] **Step 2: Scene parts**

`components/oyun/SahneTane.tsx`: delete `AyranGlifi`; `TaneSimgesi` takes `urun: Kalem` and renders `EslikciGlifi` for side dishes; add:

```tsx
/** Domates: kırmızı dilim, yeşil sap; sumaklı soğan: mor halkalar, koyu sumak noktaları. Merkez 0,0. */
export function EslikciGlifi({ urun }: { urun: Eslikci }) {
  if (urun === 'domates') {
    return (
      <g>
        <circle r={8.5} fill="#C8402E" stroke={KONTUR} strokeWidth={0.8} />
        <circle r={5.5} fill="#E4573F" />
        <path d="M-4.5 0h9M0 -4.5v9M-3.2 -3.2l6.4 6.4M3.2 -3.2l-6.4 6.4" stroke="#F3C7A1" strokeWidth={0.9} opacity={0.7} />
        <path d="M-2.5 -8.5l2.5 -2.2 2.5 2.2" stroke="#5E8A3A" strokeWidth={1.6} strokeLinecap="round" fill="none" />
      </g>
    )
  }
  return (
    <g>
      <circle r={8.5} fill="#F0DDF2" stroke={KONTUR} strokeWidth={0.8} />
      <circle r={5.6} fill="none" stroke="#B07AB8" strokeWidth={1.8} />
      <circle r={2.4} fill="none" stroke="#7D4B8C" strokeWidth={1.2} />
      <circle cx={-4} cy={-3.5} r={1} fill="#7A1F2E" />
      <circle cx={4} cy={3} r={1} fill="#7A1F2E" />
      <circle cx={3} cy={-4.5} r={0.9} fill="#7A1F2E" />
    </g>
  )
}
```

Import `Eslikci` and `Kalem` from `@/lib/oyun/tipler`; the file header comment loses the ayran clause; the `SisUrun` re-export becomes `export type { Urun }` and its two consumers (`SahneOcak.tsx`, `SahneTezgah.tsx`) import `Urun` from `@/lib/oyun/tipler` directly, so delete the re-export entirely.

`components/oyun/SahneMisafir.tsx` (new; `KorHalkasi`, `KalktiHalkasi`, `IkramTabaklari` move here from `SahneSofra.tsx` unchanged except `IkramTabaklari` loses `data-tabak` and the `.tabak` class, its plates are always visible):

```tsx
import stil from './SahneMisafir.module.css'

/*
 * Misafir şeridinin boyalı katmanları: yüzsüz siluet (üç varyant), kor halkası, kalktı halkası,
 * önündeki ikram tabakları, bahşiş parası. Her SVG 100×100; konum ve ölçü çağıran modülde.
 */

const SILUET = [
  'M50 14a13 13 0 1 1 0 26a13 13 0 0 1 0-26zM22 92c2-24 12-34 28-34s26 10 28 34z',
  'M50 12a14 14 0 1 1 0 28a14 14 0 0 1 0-28zM18 92c1-22 13-32 32-32s31 10 32 32zM36 20c4-8 24-8 28 0',
  'M50 16a12 12 0 1 1 0 24a12 12 0 0 1 0-24zM24 92c0-26 11-36 26-36s26 10 26 36zM40 50l10 8 10-8',
] as const

/** Yüzsüz misafir silueti: koyu ceviz dolgu, bakır kenar; varyant 0-2. */
export function MisafirSilueti({ varyant }: { varyant: number }) {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <path d={SILUET[varyant % 3]} fill="#3A2218" stroke="#B86F3A" strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  )
}

/** Boş yer: kesik kare. */
export function BosYer() {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <rect x={16} y={14} width={68} height={68} fill="rgba(0,0,0,.25)" stroke="var(--cizgi-plaka)" strokeWidth={1} strokeDasharray="4 5" />
    </svg>
  )
}

/** Bahşiş parası: bakır sikke, pirinç kenar, üstünde kor halkası izi. */
export function BahsisParasi() {
  return (
    <svg viewBox="0 0 48 48" className={stil.para} aria-hidden="true">
      <ellipse cx={24} cy={40} rx={16} ry={4} fill="#000" opacity={0.4} filter="url(#fBlur2)" />
      <circle cx={24} cy={24} r={18} fill="url(#gCopper)" stroke="url(#gBrass)" strokeWidth={2.4} />
      <circle cx={24} cy={24} r={11} fill="none" stroke="#F0B27A" strokeWidth={1.2} opacity={0.7} />
      <ellipse cx={18} cy={17} rx={5} ry={2.4} fill="#fff" opacity={0.3} />
    </svg>
  )
}
```

plus the moved `KorHalkasi`, `KalktiHalkasi`, `IkramTabaklari`. `SahneMisafir.module.css`: `.katman`, `.plaka`-free, `.hale`/`.hat`/`.kesik`/`:global([data-sabir='az']) .hale` moved verbatim from `SahneSofra.module.css`, plus:

```css
/* Misafir şeridi: üç yer (120 × 150), fiş balonu üstte, siluet altta, ikram tabakları önde. */
.yerler {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  height: 168px;
}

.yer,
.kapaliYer {
  position: relative;
  min-height: 150px;
}

.yer[data-bos] .siluet,
.yer[data-bos] .balon,
.yer[data-bos] .halka {
  display: none;
}

.siluet {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 18px;
  height: 56%;
}

.ikramlar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 30%;
}

/* Balon: fiş kağıdı, -4°, yırtık alt kenar; kor halkası balonun çevresinde. */
.balon {
  position: absolute;
  left: 50%;
  top: 6px;
  width: 64%;
  aspect-ratio: 1;
  transform: translateX(-50%) rotate(-4deg);
}

.halka {
  position: absolute;
  left: 50%;
  top: 6px;
  width: 76%;
  aspect-ratio: 1;
  transform: translate(-50%, -8%);
}

.fis {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
  align-content: center;
  gap: 2px;
  padding: 6% 5% 12%;
  background: linear-gradient(#FBF3E3, #E6D6B8);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
  clip-path: polygon(
    0 0, 100% 0, 100% calc(100% - 3px), 88% 100%, 76% calc(100% - 3px), 64% 100%,
    52% calc(100% - 3px), 40% 100%, 28% calc(100% - 3px), 16% 100%, 4% calc(100% - 3px), 0 100%
  );
}

.kalem {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 0;
}

.kalem svg {
  width: 100%;
  height: auto;
}

.adet {
  position: absolute;
  right: -3px;
  bottom: -3px;
  display: grid;
  place-items: center;
  min-width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid var(--bakir-acik);
  background: var(--komur);
  color: var(--krem);
  font-family: var(--font-baslik);
  font-size: 10px;
  line-height: 1;
}

/* Bırakma hedefi parmak üstündeyken bakır kenar yanar (120 ms). */
.yer[data-ustunde]::after {
  content: '';
  position: absolute;
  inset: -2px;
  box-shadow: 0 0 0 2px var(--bakir-acik), 0 0 22px color-mix(in srgb, var(--bakir-acik) 55%, transparent);
  pointer-events: none;
}

.kalkti {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--krem-60);
  opacity: 0;
}

/* Tezgah kenarı: yerin altında 56 px para noktası; boşken görünmez ama yer tutar. */
.kenar {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  height: 48px;
}

.paraYeri {
  position: relative;
  display: grid;
  place-items: center;
  width: 56px;
  height: 48px;
  margin: 0 auto;
}

.paraYeri[data-bos] {
  visibility: hidden;
}

/* Solma: kalan ömür opaklığa (`--oran`, `data-ciz="para"`). */
.para {
  width: 40px;
  height: 40px;
  overflow: visible;
  opacity: calc(0.35 + var(--oran, 1) * 0.65);
}
```

`components/oyun/SahneTezgah.tsx`: delete `TezgahUrunu`, `BakirMasrapa`, `AcikYayik`, `SIS_X`; rename `TezgahTabagi` to `BakirTabak`; add:

```tsx
/** Tabaktaki kalemler: en çok dört, tabağın üstüne yan yana; şiş yatay pişmiş tane, eşlikçi glif. */
export function TabakKalemleri({ kalemler }: { kalemler: readonly TabakKalemi[] }) {
  return (
    <g transform="translate(40 28)">
      {kalemler.map((k, i) => (
        <g key={i} transform={`translate(${(i - (kalemler.length - 1) / 2) * 16} 0) scale(0.8)`}>
          {k.kalite === null ? <EslikciGlifi urun={k.urun as Eslikci} /> : <TaneKatmanlari urun={k.urun as Urun} pismis />}
        </g>
      ))}
    </g>
  )
}

/** Kase: ceviz çanak, içinde eşlikçi yığını; kaseden çıkan öğe `[data-tasinir]` glifidir. */
export function Kase({ urun }: { urun: Eslikci }) {
  return (
    <svg viewBox="0 0 56 56" className={stil.kase} aria-hidden="true">
      <ellipse cx={28} cy={50} rx={20} ry={4} fill="#000" opacity={0.4} filter="url(#fBlur2)" />
      <path d="M8 24h40l-5 24H13z" fill="url(#gWood)" stroke="rgba(0,0,0,.5)" strokeWidth={0.8} />
      <ellipse cx={28} cy={24} rx={20} ry={5.5} fill="#2A1A14" stroke="rgba(255,255,255,.15)" strokeWidth={0.8} />
      {[-8, 0, 8].map((x) => (
        <g key={x} transform={`translate(${28 + x} ${22 - Math.abs(x) / 4}) scale(0.6)`}>
          <EslikciGlifi urun={urun} />
        </g>
      ))}
    </svg>
  )
}

/** Çöp: bakır kova, kapaksız. */
export function CopKovasi() {
  return (
    <svg viewBox="0 0 56 56" className={stil.kova} aria-hidden="true">
      <ellipse cx={28} cy={50} rx={18} ry={4} fill="#000" opacity={0.4} filter="url(#fBlur2)" />
      <path d="M12 16h32l-3 34H15z" fill="url(#gCopper)" stroke="rgba(0,0,0,.5)" strokeWidth={0.8} />
      <ellipse cx={28} cy={16} rx={16} ry={4.5} fill="#2A1A14" stroke="#F0B27A" strokeWidth={1} />
      <path d="M18 24v20M38 24v20" stroke="#fff" strokeWidth={1.2} opacity={0.25} strokeLinecap="round" />
    </svg>
  )
}
```

Imports: `EslikciGlifi, TaneKatmanlari, Tane` from `./SahneTane`, `Eslikci, TabakKalemi, Urun` from `@/lib/oyun/tipler`. Header comment: "Tabak şeridinin boyalı parçaları: bakır tabak, kalemler, kaseler, çöp; raf tepsisi." `SahneTezgah.module.css`: keep `.tabak` (renamed `.bakirTabak`), `.tepsi`, `.ceviz`, `.damar`, `.rafUrun` and its pasif rule, `.rafAlt`; delete every marble/slot/soguma/yayik/pirinc rule; add:

```css
/* Tabak şeridi: çöp 56, iki tabak esner, iki kase 56; 360 altında kase ve çöp 48 (44 altına inmez). */
.tabakSeridi {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) minmax(0, 1fr) 56px 56px;
  gap: 8px;
  height: 120px;
  align-items: end;
}

@media (max-width: 359px) {
  .tabakSeridi { grid-template-columns: 48px minmax(0, 1fr) minmax(0, 1fr) 48px 48px; }
}

.tabakYeri {
  position: relative;
  height: 84px;
}

.tabakGovde {
  position: absolute;
  inset: 0;
}

.kaseYeri,
.copYeri {
  position: relative;
  height: 56px;
}

.kase,
.kova {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Kaseden çıkan glif tam ortada durur ve sürüklenir; kase yerinde kalır. */
.kaseGlif {
  position: absolute;
  left: 50%;
  top: 40%;
  width: 24px;
  height: 24px;
  margin: -12px 0 0 -12px;
}

/* Misafirin beklediği kase ya da ürün: kenar nabız atar; azaltılmışta global kural keser, kenar sabit kalır. */
.rafUrun[data-istenen],
.kaseYeri[data-istenen] {
  outline: 2px solid var(--bakir);
  outline-offset: -2px;
  animation: istenen 1.4s ease-in-out infinite;
}

@keyframes istenen {
  0%, 100% { outline-color: var(--bakir-40); }
  50% { outline-color: var(--bakir-acik); }
}

/* Elde olan: 2 px kalkar, bakır halka (dokun-dokun yolu). */
[data-elde] {
  translate: 0 -2px;
  filter: drop-shadow(0 0 0 var(--bakir-acik)) drop-shadow(0 0 6px var(--bakir-acik));
}

/* Sürüklenen öğe parmağın altında kalmaz, hedef `elementFromPoint` ile bulunur. */
[data-tasinan] {
  pointer-events: none;
  z-index: 4;
  transition: none;
}

.tabakYeri[data-ustunde]::after,
.copYeri[data-ustunde]::after {
  content: '';
  position: absolute;
  inset: -2px;
  box-shadow: 0 0 0 2px var(--bakir-acik), 0 0 22px color-mix(in srgb, var(--bakir-acik) 55%, transparent);
  pointer-events: none;
}
```

`components/oyun/SahneOcak.tsx`: unchanged except the `SisUrun` import becomes `import type { Urun } from '@/lib/oyun/tipler'`. `SahneOcak.module.css`: delete `.cevir`, `.centik`, the `[data-cevirme]` rules, `centikYanip`; `.sis` height becomes 112 and `.sisKap`/`.kapaliYuva` 120 (the strip is 150 tall); add the ready ring:

```css
/* Alma penceresi açık: altın halka nabız atar ("beni tut"); tam kıvamda halka sıkılaşır. */
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

`components/oyun/Semboller.tsx`: delete `CevirmeIsareti`, `TezgahDoluIsareti`, `PorsiyonRozeti`, `KorNoktasi`; `Semboller.module.css` loses `.korCekirdek`; add:

```tsx
/** Rehberin işaret eli: parmak yukarı bakar. */
export function ElIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10" />
      <path d="M12 10V8.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M15 11V10a1.5 1.5 0 0 1 3 0v4.5c0 3.6-2.4 6-5.5 6H12c-2.2 0-3.5-1-4.6-2.6L4.7 13.6a1.5 1.5 0 0 1 2.5-1.6L9 14" />
    </Simge>
  )
}
```

`components/oyun/SahneDefs.tsx`: delete `gMarble`, `fMarble`, `gAyran`, and any other id that `grep -rn "url(#ID)" components/oyun` no longer finds (`gPaper`, `gCloth`, `gWoodFront` are candidates: check each).

- [ ] **Step 3: Strips**

`components/oyun/Serit.tsx` (from `Seritler.tsx`: `Serit`, `Dolgu`, shared types; `DugmeKatmanlari` is gone):

```tsx
import type { Sozluk } from '@/content'
import type { Goruntu } from '@/lib/oyun/gosterim'
import type { Kalem } from '@/lib/oyun/tipler'
import { seritOdagi, seritTusu } from './odak'
import stil from './Saha.module.css'

/*
 * Şerit kabı ve ortak tipler. Dört şerit `SeritMisafir`, `SeritOcak`, `SeritTabak`, `SeritRaf`;
 * düğmelerde onClick yok: işaretçi ve klavye kökten `useSurukleme` ile gelir. React yalnız yapı
 * değişince çizer; her karedeki değerler `ciz.ts`'ten `data-ciz` öğelerine yazılır.
 */

export type Metin = Sozluk['oyun']
export type SeritProps = { goruntu: Goruntu; ad: (k: Kalem) => string; metin: Metin }

/** Dokunma dolgusu: `tepkiler.ts` 120 ms'lik opaklık animasyonunu bunda oynatır. */
export function Dolgu() {
  return <span className={stil.dolgu} data-dolgu aria-hidden="true" />
}

type SeritKabi = { sinif?: string; ad: string; etiket: string; ciz?: string; sag?: React.ReactNode; children: React.ReactNode }

/** Şerit: görünür etiket satırı (sağında isteğe bağlı çip), tek Tab durağı, ok tuşları içeride. */
export function Serit({ sinif, ad, etiket, ciz, sag, children }: SeritKabi) {
  const id = `oyun-serit-${ad}`
  return (
    <section className={sinif} data-serit data-ciz={ciz} aria-labelledby={id} onKeyDown={seritTusu} onFocus={seritOdagi}>
      <span className={stil.etiketSatiri}>
        <span id={id} className={stil.etiket}>{etiket}</span>
        {sag}
      </span>
      {children}
    </section>
  )
}
```

`components/oyun/SeritMisafir.tsx`:

```tsx
import { doldur } from '@/lib/metin'
import { fisSatirlari } from '@/lib/oyun/gorsel'
import type { Goruntu } from '@/lib/oyun/gosterim'
import { BahsisParasi, BosYer, IkramTabaklari, KalktiHalkasi, KorHalkasi, MisafirSilueti } from './SahneMisafir'
import { KarisikSimgesi, TaneSimgesi } from './SahneTane'
import { KalktiIsareti } from './Semboller'
import { Dolgu, Serit, type SeritProps } from './Serit'
import stil from './Saha.module.css'
import misafirStil from './SahneMisafir.module.css'

/* Misafir şeridi (spec tabak §6): üç yer, fiş balonu ve kor halkası, siluet; altında tezgah kenarının paraları. */

const YERLER = [0, 1, 2] as const

type YerProps = Omit<SeritProps, 'goruntu'> & { no: number; yer: Goruntu['misafirler'][number] }

/** Fiş: simgeler, yazı yok; aynı kalem tek simge ve adet; Karışık tek simge. */
function Fis({ yer }: { yer: NonNullable<YerProps['yer']> }) {
  return (
    <span className={misafirStil.fis} data-fis aria-hidden="true">
      {fisSatirlari(yer.fis, yer.karisik).map((s) => (
        <span key={s.tur === 'karisik' ? 'karisik' : s.urun} className={misafirStil.kalem}>
          {s.tur === 'karisik' ? <KarisikSimgesi boy={40} /> : <TaneSimgesi urun={s.urun} boy={40} />}
          {s.tur === 'kalem' && s.adet > 1 && <span className={misafirStil.adet}>{s.adet}</span>}
        </span>
      ))}
    </span>
  )
}

function fisMetni(metin: YerProps['metin'], ad: YerProps['ad'], yer: YerProps['yer']): string {
  if (!yer) return metin.bosYer
  if (yer.odedi) return metin.durum.odedi
  return doldur(metin.durum.istiyor, { fis: yer.fis.map(ad).join(metin.durum.ve) })
}

/** Yer: gerçek düğme, adı iki parçadan (fiş React'ten, sabır `ciz.ts`'ten). Tabak bırakma hedefi. */
function Yer({ no, yer, ad, metin }: YerProps) {
  return (
    <button
      type="button"
      className={misafirStil.yer}
      data-hedef={`m${no}`}
      data-bos={yer ? undefined : ''}
      aria-labelledby={`oyun-m${no}-fis oyun-m${no}-sabir`}
    >
      <span id={`oyun-m${no}-fis`} className={stil.gizli}>{`${metin.misafir} ${no + 1}: ${fisMetni(metin, ad, yer)}`}</span>
      <span id={`oyun-m${no}-sabir`} className={stil.gizli} data-ciz="sabirMetni" data-no={no} />
      <span className={misafirStil.siluet} aria-hidden="true">
        <MisafirSilueti varyant={yer?.varyant ?? 0} />
      </span>
      <span className={misafirStil.ikramlar} aria-hidden="true">
        <IkramTabaklari />
      </span>
      <span className={misafirStil.halka} data-ciz="sabir" data-no={no} aria-hidden="true">
        <KorHalkasi />
      </span>
      <span className={misafirStil.balon} aria-hidden="true">{yer && <Fis yer={yer} />}</span>
      <span className={misafirStil.kalkti} data-kalkti aria-hidden="true">
        <KalktiHalkasi />
        <KalktiIsareti boy={24} />
      </span>
      <Dolgu />
    </button>
  )
}

/** Tezgah kenarı: her yerin önünde bir para noktası; dokunma hedefi. */
function Kenar({ goruntu, metin }: Pick<SeritProps, 'goruntu' | 'metin'>) {
  return (
    <div className={misafirStil.kenar}>
      {YERLER.map((no) => {
        const tutar = goruntu.paralar[no] ?? null
        return (
          <button
            key={no}
            type="button"
            className={misafirStil.paraYeri}
            data-hedef={`p${no}`}
            data-ciz="para"
            data-no={no}
            data-bos={tutar === null ? '' : undefined}
            aria-label={`${metin.bahsis}: ${tutar ?? 0}`}
            aria-hidden={tutar === null ? true : undefined}
            tabIndex={tutar === null ? -1 : undefined}
          >
            <BahsisParasi />
            <Dolgu />
          </button>
        )
      })}
    </div>
  )
}

export function Misafirler({ goruntu, ...kalan }: SeritProps) {
  const kapida = goruntu.kapida > 0 && <span className={stil.kapida}>{kalan.metin.kapida} {goruntu.kapida}</span>
  return (
    <Serit ad="misafir" etiket={kalan.metin.misafir} sag={kapida}>
      <div className={misafirStil.yerler}>
        {YERLER.map((no) =>
          no >= goruntu.acikMisafir ? (
            <div key={no} className={misafirStil.kapaliYer}><BosYer /></div>
          ) : (
            <Yer key={no} no={no} yer={goruntu.misafirler[no] ?? null} {...kalan} />
          ),
        )}
      </div>
      <Kenar goruntu={goruntu} metin={kalan.metin} />
    </Serit>
  )
}
```

`components/oyun/SeritOcak.tsx` (from `Seritler.tsx`'s `Ocak`/`Yuva`, with the hand):

```tsx
import { KorKivilcimi } from '@/components/ember/KorKivilcimi'
import type { Goruntu } from '@/lib/oyun/gosterim'
import { DayamaCentigi, KapaliYuva, KozYatagi, OcakAlevi, Sis } from './SahneOcak'
import { Dolgu, Serit, type SeritProps } from './Serit'
import stil from './Saha.module.css'
import ocakStil from './SahneOcak.module.css'

const YUVALAR = [0, 1, 2, 3] as const

type YuvaProps = Omit<SeritProps, 'goruntu'> & { no: number; sis: Goruntu['ocak'][number]; el: Goruntu['el'] }

/**
 * Yuva: tutma kaynağı. Elde olan şiş yuvası boşaldıktan sonra da burada çizilir (`data-elde`), aynı
 * `[data-tasinir]` öğesi kalır ki sürükleme sırasında React onu değiştirmesin.
 */
function Yuva({ no, sis, el, ad, metin }: YuvaProps) {
  const eldeki = el?.tur === 'sis' && el.yuva === no ? el.urun : null
  const gorunen = sis?.urun ?? eldeki
  const ray = sis ? ({ '--pencere': sis.pencere, '--kivam': sis.kivam, '--bant': sis.bant } as React.CSSProperties) : undefined
  return (
    <button
      type="button"
      className={ocakStil.yuva}
      data-hedef={`o${no}`}
      data-ciz="ocak"
      data-no={no}
      aria-labelledby={`oyun-o${no}-ad oyun-o${no}-durum`}
      style={ray}
    >
      <span id={`oyun-o${no}-ad`} className={stil.gizli}>{`${metin.ocak} ${no + 1}${gorunen ? `: ${ad(gorunen)}` : ''}`}</span>
      <span id={`oyun-o${no}-durum`} className={stil.gizli} data-ciz="ocakMetni" data-no={no}>{eldeki ? metin.durum.elde : ''}</span>
      <span className={ocakStil.sisKap} aria-hidden="true">
        <DayamaCentigi />
        {gorunen && (
          <span className={ocakStil.sis} data-tasinir data-elde={eldeki ? '' : undefined}>
            <Sis urun={gorunen} />
          </span>
        )}
        <span className={ocakStil.yanik} data-yanik>
          <Sis urun="ciger" yanik />
        </span>
        <span className={ocakStil.kivamCerceve} />
        <span className={ocakStil.kivamPuan}>+150</span>
        <span className={ocakStil.kivilcimUcu} data-kivilcim />
      </span>
      <span className={ocakStil.ray} aria-hidden="true">
        {sis && <span className={ocakStil.pencere} />}
        {sis && <span className={ocakStil.kivam} />}
        <span className={ocakStil.rayDolum} />
      </span>
      <Dolgu />
    </button>
  )
}

export function Ocak({ goruntu, ...kalan }: SeritProps) {
  return (
    <Serit sinif={stil.ocak} ad="ocak" etiket={kalan.metin.ocak} ciz="kor">
      <div className={stil.tekne}>
        <span className={stil.tekneGolge} aria-hidden="true" />
        <span className={stil.tekneUst} aria-hidden="true" />
        <div className={stil.tekneIci}>
          <span className={stil.tekneKoru} aria-hidden="true" />
          <OcakAlevi />
          <span className={ocakStil.kivilcim} data-ciz="kivilcim" aria-hidden="true">
            <KorKivilcimi />
          </span>
          <div className={ocakStil.yuvalar}>
            {YUVALAR.map((no) =>
              no >= goruntu.acikOcak ? (
                <div key={no} className={ocakStil.kapaliYuva}>
                  <DayamaCentigi />
                  <KapaliYuva />
                </div>
              ) : (
                <Yuva key={no} no={no} sis={goruntu.ocak[no] ?? null} el={goruntu.el} {...kalan} />
              ),
            )}
          </div>
          <span className={stil.yatakKabi} aria-hidden="true"><KozYatagi /></span>
        </div>
        <span className={stil.tekneAlt} aria-hidden="true" />
      </div>
    </Serit>
  )
}
```

`components/oyun/SeritTabak.tsx`:

```tsx
import type { Goruntu } from '@/lib/oyun/gosterim'
import type { Eslikci } from '@/lib/oyun/tipler'
import { EslikciGlifi } from './SahneTane'
import { BakirTabak, CopKovasi, Kase, TabakKalemleri } from './SahneTezgah'
import { Dolgu, Serit, type SeritProps } from './Serit'
import tezgahStil from './SahneTezgah.module.css'

/* Tabak şeridi (spec tabak §6): solda çöp (hedef), ortada iki tabak (hedef ve kaynak), sağda kaseler (kaynak). */

const TABAKLAR = [0, 1] as const

type TabakProps = Omit<SeritProps, 'goruntu'> & { no: number; kalemler: Goruntu['tabaklar'][number]; el: Goruntu['el'] }

function Tabak({ no, kalemler, el, ad, metin }: TabakProps) {
  const elde = el?.tur === 'tabak' && el.no === no
  const icerik = kalemler.length ? kalemler.map((k) => ad(k.urun)).join(', ') : metin.durum.bos
  return (
    <button
      type="button"
      className={tezgahStil.tabakYeri}
      data-hedef={`t${no}`}
      aria-label={`${metin.tabak} ${no + 1}: ${icerik}${elde ? `, ${metin.durum.elde}` : ''}`}
    >
      <span className={tezgahStil.tabakGovde} data-tasinir data-elde={elde ? '' : undefined} aria-hidden="true">
        <BakirTabak><TabakKalemleri kalemler={kalemler} /></BakirTabak>
      </span>
      <Dolgu />
    </button>
  )
}

function KaseDugmesi({ urun, istenen, elde, ad, metin }: { urun: Eslikci; istenen: boolean; elde: boolean } & Pick<SeritProps, 'ad' | 'metin'>) {
  return (
    <button
      type="button"
      className={tezgahStil.kaseYeri}
      data-hedef={urun}
      data-istenen={istenen ? '' : undefined}
      aria-label={`${metin.kase}: ${ad(urun)}${elde ? `, ${metin.durum.elde}` : ''}`}
    >
      <Kase urun={urun} />
      <svg viewBox="-12 -12 24 24" className={tezgahStil.kaseGlif} data-tasinir data-elde={elde ? '' : undefined} aria-hidden="true">
        <EslikciGlifi urun={urun} />
      </svg>
      <Dolgu />
    </button>
  )
}

export function Tabaklar({ goruntu, ...kalan }: SeritProps) {
  return (
    <Serit ad="tabak" etiket={kalan.metin.tabak}>
      <div className={tezgahStil.tabakSeridi}>
        <button type="button" className={tezgahStil.copYeri} data-hedef="cop" aria-label={kalan.metin.cop}>
          <CopKovasi />
          <Dolgu />
        </button>
        {TABAKLAR.map((no) => (
          <Tabak key={no} no={no} kalemler={goruntu.tabaklar[no] ?? []} el={goruntu.el} {...kalan} />
        ))}
        {goruntu.kaseler.map((urun) => (
          <KaseDugmesi
            key={urun}
            urun={urun}
            istenen={goruntu.kaseIstenen.includes(urun)}
            elde={goruntu.el?.tur === 'eslikci' && goruntu.el.urun === urun}
            {...kalan}
          />
        ))}
      </div>
    </Serit>
  )
}
```

`components/oyun/SeritRaf.tsx`:

```tsx
import { RafTepsisi } from './SahneTezgah'
import { Dolgu, Serit, type SeritProps } from './Serit'
import tezgahStil from './SahneTezgah.module.css'

/** Raf: dokunma kaynağı; istenen ürünün kenarı nabız atar (raf rehberi). */
export function Raf({ goruntu, ad, metin }: SeritProps) {
  const ocakDolu = goruntu.ocak.slice(0, goruntu.acikOcak).every(Boolean)
  return (
    <Serit ad="raf" etiket={metin.raf}>
      <div className={tezgahStil.ceviz} data-pasif={ocakDolu ? '' : undefined}>
        <svg className={tezgahStil.damar} aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#fWood)" />
        </svg>
        {goruntu.raf.map((urun) => (
          <button
            key={urun}
            type="button"
            className={tezgahStil.rafUrun}
            data-hedef={urun}
            data-istenen={goruntu.rafIstenen.includes(urun) ? '' : undefined}
          >
            <RafTepsisi urun={urun} />
            <span>{ad(urun)}</span>
            <Dolgu />
          </button>
        ))}
      </div>
      <span className={tezgahStil.rafAlt} aria-hidden="true" />
    </Serit>
  )
}
```

- [ ] **Step 4: Saha, HUD, layout CSS**

`components/oyun/Hud.tsx`: delete the `porsiyon` span and the `PorsiyonRozeti` import; `Hud.module.css` loses `.porsiyon`. `Hud.tsx` header comment drops "rozetleri" plural wording as needed.

`components/oyun/Saha.tsx`:

```tsx
import { useRef } from 'react'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import type { Girdi, Kalem, Sonuc } from '@/lib/oyun/tipler'
import { Hud } from './Hud'
import { SahneDefs } from './SahneDefs'
import { Misafirler } from './SeritMisafir'
import { Ocak } from './SeritOcak'
import { Raf } from './SeritRaf'
import { Tabaklar } from './SeritTabak'
import { useEgim } from './useEgim'
import { useOyunAlani } from './useOyunAlani'
import stil from './Saha.module.css'

type Props = {
  dil: Dil
  tohum: number
  rehberli: boolean
  bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void
  cik: () => void
}
```

`Perde` and `Zemin` stay as they are. The body:

```tsx
/** Oyun alanı. Yalnız istemci `OyunSayfasi`'ndan çağrılır, kendi sınırı yoktur. `rehberli` Görev 11'de bağlanır. */
export function Saha({ dil, tohum, bitince, cik }: Props) {
  const s = sozluk(dil)
  const ad = (k: Kalem): string => kalemAdi(s, k)
  const kok = useRef<HTMLDivElement>(null)
  const { goruntu, duraklatildi, duraklat, devam, azalt, ses } = useOyunAlani({ kok, tohum, metin: s.oyun, ad, bitince })
  useEgim(kok, azalt)
  const serit = { goruntu, ad, metin: s.oyun }
  return (
    <div ref={kok} className={stil.saha}>
      <SahneDefs />
      <Zemin />
      <Hud metin={s.oyun} duraklat={duraklat} ses={ses} />
      <Misafirler {...serit} />
      <Ocak {...serit} />
      <Tabaklar {...serit} />
      <Raf {...serit} />
      {duraklatildi && <Perde metin={s.oyun} devam={devam} cik={cik} />}
    </div>
  )
}

/** Kalem adı menüden: şişler ocakbaşı ürünleri, eşlikçiler ikram öğeleri (sumaklı soğan `sumakli`). */
function kalemAdi(s: Sozluk, k: Kalem): string {
  if (k === 'domates') return s.menu.ikramlar.ogeler.domates
  if (k === 'sogan') return s.menu.ikramlar.ogeler.sumakli
  return s.menu.ocakbasi.urunler[k].ad
}
```

(Task 10 defines this `useOyunAlani` signature; Task 11 destructures `rehberli`, passes it on and adds the `Rehber` overlay line.)

`components/oyun/Saha.module.css`: header comment "Dikey akış HUD, Misafir, Ocak (esner), Tabak, Raf"; `.saha` gets `touch-action: none` instead of `manipulation` (pointer drags must not scroll) plus `-webkit-user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent;` (long-press on a skewer must not open the iOS callout); `.ocak` becomes `flex: 1 1 auto; min-height: 96px` so the fire gives way on short viewports (the rack must stay above the fold on a 390×664 Safari viewport; measured in Task 15); entrance delays cover four strips (`nth-of-type(2..5)` at 80/160/240/320 ms); delete `.ipucu`, `.saha [data-ipucu] .ipucu`, `@keyframes nabiz`; add:

```css
/* Yalnız ekran okuyucuya: düğme adlarının parçaları. */
.gizli {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

Then run the dead-class check and delete every class it names that no `.tsx` references:

```bash
for css in components/oyun/*.module.css; do for c in $(grep -oE '^\.[a-zA-Z][a-zA-Z0-9]*' "$css" | tr -d . | sort -u); do grep -rqE "(stil|Stil)\.$c\b|\[stil\.$c\]|'$c'" components/oyun --include='*.tsx' --include='*.ts' || echo "$css .$c"; done; done
```

Expected: no output (verify each remaining line with `grep -rn "\.$c" components/oyun` before deleting; `.tam`, `.iyi`, `.odedi`, `.dolu` are referenced through `stil[olay.kalite]`/`stil.dolu` in `tepkiler.ts` and stay).

- [ ] **Step 5: Checks and commit**

Run: `node --test components/oyun/SahneDefs.test.ts styles/animasyon.test.ts styles/palet.test.ts`
Expected: PASS. `npx tsc --noEmit -p . 2>&1 | grep '^components/oyun'` lists only `Saha.tsx`, `useOyunAlani.ts`, `useOyunDongusu.ts`, `ciz.ts`, `tepkiler.ts`, `OyunSayfasi.tsx`, `useOyunAkisi.ts`, `SonucEkrani.tsx` (Tasks 10, 11, 15).

```bash
git add -A components content
git commit -m "Lay out the plate-flow board: guests, fire, plates, rack"
```

---

### Task 10: Input and reactions: taps, flights, per-frame writes, typecheck green

**Files:**
- Create: `components/oyun/useSurukleme.ts` (taps only in this task; Task 14 adds drags)
- Modify: `components/oyun/ciz.ts`, `tepkiler.ts`, `useOyunAlani.ts`, `useOyunDongusu.ts`, `OyunSayfasi.tsx` (prop rename only), `useOyunAkisi.ts` (`Tur.ipucu` to `Tur.rehberli`, `ilkTurMu` to `rehberGorulduMu`, `ilkTurBitti` call deleted)
- Test: `npm run typecheck`, `npm test`, `npm run build`, headless `tahta.mjs`

**Interfaces:**
- Consumes: `surukle`, `eldeKaynagi`, `birakmaHedefiMi` (Task 7), `tusEylemi` (Task 6), the DOM contract of Task 9.
- Produces: `useSurukleme({ kok, elde: () => Hedef | null, dokun: (hedef: Hedef, el: HTMLElement | null) => boolean })` (Task 14 adds `azalt`; listens to `pointerdown`, `pointerup`, `pointercancel`, `lostpointercapture`, `keydown` and `visibilitychange`; no `pointermove`, so a press never becomes a drag until Task 14); `useOyunAlani({ kok, tohum, metin, ad, bitince })` returning `{ goruntu, dokun, duraklatildi, duraklat, devam, oyunu, azalt, ses }` (Task 11 adds the `rehberli` option and the `rehber` field); `useOyunDongusu` gains options `durdur: () => boolean` and `izle: (oyun: Oyun, olaylar: readonly Olay[]) => void` and returns `oyunu: () => Oyun`; `tepkiler.ts` exports `ucus(alan, kaynak: HTMLElement | null, hedef: HTMLElement | null, azalt)`.
- Boundary: after this task plus Tasks 11 and 12 the game is complete and playable with taps only (tap the skewer, tap the plate; tap the plate, tap the guest), with flight animations showing where the item went.

- [ ] **Step 1: Per-frame writes**

`components/oyun/ciz.ts`: imports become `TUR_TIK` from `@/lib/oyun/ayar`, `Duyuru` type, `kivilcimYogunlugu, korYogunlugu, paraOrani, pismeOrani, sabirDurumu, yanmaOrani` from `@/lib/oyun/gorsel`, `oyunSaati, sisGorunumu` from `@/lib/oyun/gosterim`, `komboCarpani`, `Kalem, Oyun` types, `doldur` from `@/lib/metin`, `Metin` from `./Serit`. Replace `ogeyiCiz` and `sahayiCiz`/`duyuruYaz`:

```ts
/** Düğme adının durum parçası: yalnız değişince yazılır (ekran okuyucu her tikte yeniden okumasın). */
function durumMetni(el: HTMLElement, oyun: Oyun, no: number, metin: Metin): void {
  if (el.dataset.ciz === 'ocakMetni') {
    const sis = oyun.ocak[no]
    const elde = oyun.el?.tur === 'sis' && oyun.el.yuva === no
    return metinYaz(el, elde ? metin.durum.elde : sis ? metin.durum[sis.gecen < sis.pisme ? 'pisiyor' : 'hazir'] : '')
  }
  const yer = oyun.misafirler[no]
  const yuzde = yer ? Math.round((yer.sabir / yer.toplamSabir) * 10) * 10 : 0
  metinYaz(el, yer && yer.kalkis === null ? doldur(metin.durum.sabir, { yuzde }) : '')
}

/** Bir çizim öğesinin bu karedeki değeri; `data-ciz` adına göre. */
function ogeyiCiz(el: HTMLElement, oyun: Oyun, azalt: boolean, metin: Metin): void {
  const no = Number(el.dataset.no)
  switch (el.dataset.ciz) {
    case 'saat':
      return metinYaz(el, oyunSaati(oyun.tik))
    case 'gece':
      return degiskenYaz(el, '--oran', oyun.tik / TUR_TIK)
    case 'puan':
      return metinYaz(el, String(oyun.puan))
    case 'kombo':
      return komboYaz(el, oyun.kombo, azalt)
    case 'sabir': {
      const yer = oyun.misafirler[no]
      const oran = yer ? yer.sabir / yer.toplamSabir : 0
      degiskenYaz(el, '--oran', oran)
      return nitelikYaz(el, 'sabir', sabirDurumu(oran))
    }
    case 'sabirMetni':
    case 'ocakMetni':
      return durumMetni(el, oyun, no, metin)
    case 'ocak':
      return ocagiCiz(el, oyun, no)
    case 'para':
      return degiskenYaz(el, '--oran', paraOrani(oyun.paralar[no] ?? null))
    case 'kor':
      return degiskenYaz(el, '--kor-yogunluk', korYogunlugu(oyun.kombo))
    case 'kivilcim':
      return degiskenYaz(el, '--oran', kivilcimYogunlugu(oyun))
  }
}

/** Bütün `data-ciz` öğeleri ve evre niteliği. */
export function sahayiCiz(alan: HTMLElement, oyun: Oyun, azalt: boolean, metin: Metin): void {
  for (const el of alan.querySelectorAll<HTMLElement>('[data-ciz]')) ogeyiCiz(el, oyun, azalt, metin)
  nitelikYaz(alan, 'evre', String(oyun.evre))
}

/** Canlı bölgeye bu karenin duyurusu; metin sözlükten, yer tutucular olaydan. */
export function duyuruYaz(alan: HTMLElement, duyuru: Duyuru | null, metin: Metin, ad: (k: Kalem) => string): void {
  if (!duyuru) return
  const bolge = alan.querySelector<HTMLElement>('[data-duyuru]')
  if (!bolge) return
  const degerler = { puan: duyuru.puan ?? '', no: duyuru.no ?? '', urun: duyuru.urun ? ad(duyuru.urun) : '' }
  bolge.textContent = doldur(metin.duyuru[duyuru.anahtar], degerler)
}
```

`ocagiCiz` is unchanged.

- [ ] **Step 2: Reactions and the flight**

`components/oyun/tepkiler.ts`: delete `tabaklarIner`, `cevir`, `DONUS`, `servisUcusu`, `porsiyonRozeti`; keep `dokunus`, `parla`, `muhurBas`, `ucanRakam`, `kalkis`, `salla`, `titre`, `sonSaat`, `patlat`, `sars`, `yanik`. Add (imports: `Elde, Olay` from `@/lib/oyun/tipler`, `eldeKaynagi` from `@/lib/oyun/surukle`):

```ts
const kaynak = (alan: HTMLElement, el: Exclude<Elde, null>): HTMLElement | null => hedef(alan, eldeKaynagi(el) ?? '')

/**
 * Uçuş: kaynaktaki `[data-tasinir]` kopyalanır (React aynı karede aslını değiştirir), köke eklenir,
 * 220 ms'de hedefin ortasına uçar ve silinir; azaltılmışta anında. Dokun-dokun yolunun "nereye gitti"si.
 * Sürüklenen öğe uçmaz: `data-suruklendi` köke yazılır ve burada tüketilir (Görev 14).
 */
export function ucus(alan: HTMLElement, kaynak: HTMLElement | null, hedef: HTMLElement | null, azalt: boolean): void {
  const asil = kaynak?.querySelector<HTMLElement>('[data-tasinir]')
  if (alan.hasAttribute('data-suruklendi')) return alan.removeAttribute('data-suruklendi')
  if (!asil || !hedef || azalt) return
  const kopya = asil.cloneNode(true) as HTMLElement
  kopya.removeAttribute('data-tasinir')
  kopya.removeAttribute('data-elde')
  kopya.setAttribute('data-ucus', '')
  kopya.className = stil.hayalet ?? ''
  const a = asil.getBoundingClientRect()
  const b = hedef.getBoundingClientRect()
  const k = alan.getBoundingClientRect()
  kopya.style.left = `${a.left - k.left}px`
  kopya.style.top = `${a.top - k.top}px`
  kopya.style.width = `${a.width}px`
  kopya.style.height = `${a.height}px`
  alan.append(kopya)
  const dx = b.left + b.width / 2 - a.left - a.width / 2
  const dy = b.top + b.height / 2 - a.top - a.height / 2
  const kaldir = () => kopya.remove()
  kopya
    .animate([{ transform: 'translate(0, 0)' }, { transform: `translate(${dx}px, ${dy}px) scale(0.9)`, opacity: 0.6 }], { duration: 220, easing: EGRI })
    .finished.then(kaldir, kaldir)
}

/** Para belirir: zıplayarak; azaltılmışta yalnız opaklık. */
function paraBelir(para: HTMLElement | null, azalt: boolean): void {
  if (!para) return
  const kareler = azalt
    ? opaklik(0, 1)
    : [{ opacity: 0, transform: 'translateY(-14px) scale(1.3)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }]
  para.animate(kareler, { duration: 260, easing: EGRI })
}

function olayaTepki(alan: HTMLElement, olay: Olay, azalt: boolean): void {
  switch (olay.tur) {
    case 'tutuldu': {
      if (olay.el.tur !== 'sis') return
      const yuva = hedef(alan, `o${olay.el.yuva}`)
      parla(yuva, stil[olay.el.kalite])
      if (olay.el.kalite !== 'tam') return
      ucanRakam(yuva, `+${PUAN.tamKivam}`, azalt)
      return titre()
    }
    case 'tabagaKondu':
      ucus(alan, kaynak(alan, olay.el), hedef(alan, `t${olay.no}`), azalt)
      return parla(hedef(alan, `t${olay.no}`), stil.iyi)
    case 'tabakDolu':
      return salla(hedef(alan, `t${olay.no}`), azalt)
    case 'sisErken':
      return salla(hedef(alan, `o${olay.yuva}`), azalt)
    case 'sisYandi':
      return yanik(hedef(alan, `o${olay.yuva}`))
    case 'teslim':
      ucus(alan, hedef(alan, `t${olay.no}`), hedef(alan, `m${olay.yer}`), azalt)
      parla(hedef(alan, `m${olay.yer}`), stil.odedi)
      patlat(hedef(alan, `m${olay.yer}`), azalt)
      return ucanRakam(hedef(alan, `m${olay.yer}`), `+${olay.hesap}`, azalt)
    case 'yanlisTabak':
      return salla(hedef(alan, `m${olay.yer}`), azalt)
    case 'paraDustu':
      return paraBelir(hedef(alan, `p${olay.yer}`), azalt)
    case 'bahsisAlindi':
      return ucanRakam(hedef(alan, `p${olay.yer}`), `+${olay.tutar}`, azalt)
    case 'copeGitti':
      ucus(alan, kaynak(alan, olay.el), hedef(alan, 'cop'), azalt)
      return salla(hedef(alan, 'cop'), azalt)
    case 'misafirKalkti':
      return olay.odedi ? undefined : kalkis(hedef(alan, `m${olay.yer}`))
    case 'rafDolu':
      return salla(hedef(alan, olay.urun), azalt)
    case 'evre':
      return olay.evre === 4 ? sonSaat(alan) : undefined
    default:
      return undefined
  }
}
```

`Saha.module.css` `.hayalet` becomes `position: absolute; z-index: 6; pointer-events: none; line-height: 0;` (it was `fixed` for the old counter flight; the clone is positioned inside the root). `paraDustu` fires on React's old DOM: the coin button already exists (always rendered, `data-bos` toggles visibility), so the animation lands. Fix the header comment: "hedef öğeler hep DOM'da durur (paralar gizli bekler, yanık şiş, rozetler); uçuş kopya üstünde oynar".

- [ ] **Step 3: Tap and keyboard glue**

`components/oyun/useSurukleme.ts`:

```ts
import { useEffect, useEffectEvent, type RefObject } from 'react'
import { tusEylemi } from '@/lib/oyun/klavye'
import { surukle, type Isaret, type Surukleme } from '@/lib/oyun/surukle'
import type { Hedef } from '@/lib/oyun/tipler'

type Secenek = {
  kok: RefObject<HTMLElement | null>
  /** Simülasyonun elindeki öğenin kaynağı (`eldeKaynagi`). */
  elde: () => Hedef | null
  /** Girdiyi sıraya alır; rehber reddettiyse false. */
  dokun: (hedef: Hedef, el: HTMLElement | null) => boolean
  azalt: boolean
}

export function hedefBul(x: number, y: number): HTMLElement | null {
  return document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-hedef]') ?? null
}

export const hedefi = (el: HTMLElement | null): Hedef | null => (el?.dataset.hedef as Hedef | undefined) ?? null

/**
 * Dokunuşlar ve klavye `surukle` makinesinden geçer (spec tabak §3). Bu görevde `pointermove` yok:
 * basış asla sürüklemeye dönmez, her jest dokun-dokun olarak iner; Görev 14 sürüklemeyi ekler.
 * Kaybolan `pointerup` tahtayı kilitlemesin: `lostpointercapture` ve sekme gizlenmesi iptaldir.
 */
export function useSurukleme({ kok, elde, dokun }: Secenek): void {
  const isle = useEffectEvent((isaret: Isaret, el: HTMLElement | null, durum: Surukleme): Surukleme => {
    const sonuc = surukle(durum, isaret, { elde: elde() })
    for (const hedef of sonuc.girdiler) dokun(hedef, hedef === 'birak' ? null : el)
    return sonuc.durum
  })

  useEffect(() => {
    const alan = kok.current
    if (!alan) return
    let durum: Surukleme = { tur: 'bos' }
    const yaz = (isaret: Isaret, el: HTMLElement | null) => {
      durum = isle(isaret, el, durum)
    }
    const bas = (e: PointerEvent) => {
      // HUD ve perde düğmeleri kendi onClick'leriyle çalışır; tutma kilidine girmez.
      if ((e.target as HTMLElement).closest('button:not([data-hedef])')) return
      if (e.button !== 0 && e.pointerType === 'mouse') return
      alan.setPointerCapture(e.pointerId)
      const el = hedefBul(e.clientX, e.clientY)
      yaz({ tur: 'bas', id: e.pointerId, hedef: hedefi(el), x: e.clientX, y: e.clientY }, el)
    }
    const kaldir = (e: PointerEvent) => {
      const el = hedefBul(e.clientX, e.clientY)
      yaz({ tur: 'kaldir', id: e.pointerId, hedef: hedefi(el), x: e.clientX, y: e.clientY }, el)
    }
    const iptal = (e: PointerEvent) => yaz({ tur: 'iptal', id: e.pointerId }, null)
    const gizlenince = () => {
      if (document.hidden && durum.tur === 'basili') yaz({ tur: 'iptal', id: durum.id }, null)
    }
    const tus = (e: KeyboardEvent) => {
      const eylem = tusEylemi(e.key)
      if (!eylem || e.repeat || e.altKey || e.ctrlKey || e.metaKey) return
      const el = document.activeElement instanceof HTMLElement ? document.activeElement.closest<HTMLElement>('[data-hedef]') : null
      if (eylem === 'dokun' && (!el || !alan.contains(el))) return
      e.preventDefault()
      const hedef = hedefi(el)
      yaz(eylem === 'birak' || !hedef ? { tur: 'birak' } : { tur: 'dokun', hedef }, el)
    }
    alan.addEventListener('pointerdown', bas)
    alan.addEventListener('pointerup', kaldir)
    alan.addEventListener('pointercancel', iptal)
    alan.addEventListener('lostpointercapture', iptal)
    document.addEventListener('visibilitychange', gizlenince)
    document.addEventListener('keydown', tus)
    return () => {
      alan.removeEventListener('pointerdown', bas)
      alan.removeEventListener('pointerup', kaldir)
      alan.removeEventListener('pointercancel', iptal)
      alan.removeEventListener('lostpointercapture', iptal)
      document.removeEventListener('visibilitychange', gizlenince)
      document.removeEventListener('keydown', tus)
    }
  }, [kok])
}
```

`lostpointercapture` fires after every `pointerup` too; the machine is already `bos` then, so the extra `iptal` is a no-op (`surukle` returns `ayni(durum)` for an id that is not held). `azalt` is unused in this task: leave it out of the destructuring and the `Secenek` type until Task 14 adds it (an unused option fails `noUnusedParameters`).

- [ ] **Step 4: Loop and alan hooks**

`components/oyun/useOyunDongusu.ts`: extend `Secenek` with `durdur: () => boolean` and `izle: (oyun: Oyun, olaylar: readonly Olay[]) => void`; wrap them with `useEffectEvent` (`const duruyor = useEffectEvent(durdur)`, `const izleyici = useEffectEvent(izle)`); in `kare`:

```ts
      const sonuc = adimSayisi(birikim, simdi - onceki)
      onceki = simdi
      const durdu = duruyor()
      const adim = durdu ? Math.min(canli.bekleyen.length, 1) : sonuc.adim
      birikim = durdu ? 0 : sonuc.birikim
      const olaylar: Olay[] = []
      for (let i = 0; i < adim && !canli.oyun.bitti; i++) olaylar.push(...canliAdim(canli))
      kareSonu(olaylar, adim)
```

and in `kareSonu` call `izleyici(canli.oyun, olaylar)` first. A paused guide step runs exactly one tick when an input is queued (so the input takes effect) and otherwise freezes time, discarding the accumulated frame time. Return `oyunu: () => canli.oyun` alongside the rest. Nothing here mutates `canli.oyun` outside `canliAdim`.

`components/oyun/useOyunAlani.ts`:

```ts
import { useEffect, useState, type RefObject } from 'react'
import { useHareketAzaltilmisMi } from '@/lib/hareket'
import { duyurucuKur, duyuruSec } from '@/lib/oyun/duyuru'
import { sesSec } from '@/lib/oyun/ses'
import { eldeKaynagi } from '@/lib/oyun/surukle'
import type { Girdi, Hedef, Kalem, Olay, Oyun, Sonuc } from '@/lib/oyun/tipler'
import { duyuruYaz, sahayiCiz } from './ciz'
import { seritleriDuzenle } from './odak'
import type { Metin } from './Serit'
import { dokunus, olaylaraTepki } from './tepkiler'
import { useOyunDongusu } from './useOyunDongusu'
import { useSes } from './useSes'
import { useSurukleme } from './useSurukleme'

type Secenek = {
  kok: RefObject<HTMLDivElement | null>
  tohum: number
  metin: Metin
  ad: (k: Kalem) => string
  bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void
}

/** Döngüyü sahaya bağlar: her karede DOM yazımı, olaylara tepki, ses, canlı bölge ve jestler. Saha yalnız yapıyı çizer. */
export function useOyunAlani({ kok, tohum, metin, ad, bitince }: Secenek) {
  const azalt = useHareketAzaltilmisMi()
  const ses = useSes()
  const [duyurucu] = useState(() => duyurucuKur())

  const ciz = (oyun: Oyun, ilerledi: boolean) => {
    const alan = kok.current
    if (!alan) return
    if (ilerledi) sahayiCiz(alan, oyun, azalt, metin)
    duyuruYaz(alan, duyurucu.al(performance.now()), metin, ad)
  }
  const tepki = (olaylar: Olay[]) => {
    const alan = kok.current
    if (!alan) return
    olaylaraTepki(alan, olaylar, azalt)
    for (const sesAdi of sesSec(olaylar)) ses.cal(sesAdi)
    const duyuru = duyuruSec(olaylar)
    if (duyuru) duyurucu.ekle(duyuru)
  }
  const dongu = useOyunDongusu({ tohum, ciz, tepki, bitince, durdur: () => false, izle: () => undefined })

  /** Girdi: simülasyona sıraya girer, hedefte anlık dolgu. Rehber (Görev 11) burada süzer. */
  const dokun = (hedef: Hedef, el: HTMLElement | null): boolean => {
    ses.uyandir()
    dongu.dokun(hedef)
    dokunus(el, azalt)
    return true
  }
  useSurukleme({ kok, elde: () => eldeKaynagi(dongu.oyunu().el), dokun })

  useEffect(() => {
    if (kok.current) seritleriDuzenle(kok.current)
  }, [kok, dongu.goruntu])

  return { ...dongu, azalt, ses }
}
```

`useOyunAkisi.ts`: `Tur = { tohum; turId; rehberli: boolean }` with `rehberli: !rehberGorulduMu()` in `jetonIste`; delete the `ilkTurBitti()` call in `bitir` and both old imports. `OyunSayfasi.tsx`: `<Saha dil={dil} tohum={tur.tohum} rehberli={tur.rehberli} … />`. `Saha.tsx` (from Task 9) declares `rehberli` in `Props` and does not destructure it; Task 11 wires it.

- [ ] **Step 5: Typecheck, tests, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: all three PASS; typecheck is green for the first time since Task 1. Fix every error it names (unused imports, removed props). Repeat the `url(#…)` sweep from Task 9 once.

- [ ] **Step 6: Headless smoke, tap-tap**

```bash
mkdir -p /tmp/bozo-oyun/sade && npm run build && (python3 -m http.server 8412 --directory "$PWD/out" >/tmp/bozo-oyun/sade/serve.log 2>&1 &)
```

`/tmp/bozo-oyun/sade/ortak.mjs` (shared helpers; Task 14 adds `surukle`):

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'

export async function ac({ en = 390, boy = 844, azalt = false, rehberGoruldu = true } = {}) {
  const tarayici = await chromium.launch()
  const baglam = await tarayici.newContext({ viewport: { width: en, height: boy }, reducedMotion: azalt ? 'reduce' : 'no-preference' })
  const sayfa = await baglam.newPage()
  const hatalar = []
  sayfa.on('pageerror', (e) => hatalar.push(String(e)))
  sayfa.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
  await sayfa.route('**/api.cigercibozo.com/**', (r) => r.abort())
  if (rehberGoruldu) await sayfa.addInitScript(() => localStorage.setItem('bozo-oyun-rehber-goruldu', '1'))
  await sayfa.goto('http://localhost:8412/oyun/')
  await sayfa.getByRole('button', { name: 'Oyna' }).click()
  await sayfa.waitForSelector('[data-hedef="m0"]')
  return { tarayici, sayfa, hatalar }
}

/** Dokunuş; simülasyon girdiyi bir sonraki tikte işler, aynı tikte aynı hedef düşer: 40 ms bekle. */
export async function dokun(sayfa, hedef) {
  await sayfa.locator(`[data-hedef="${hedef}"]`).click()
  await sayfa.waitForTimeout(40)
}
export const puan = (sayfa) => sayfa.evaluate(() => Number(document.querySelector('[data-ciz="puan"]')?.textContent))
export const bekleGorunum = (sayfa, yuva, gorunum) =>
  sayfa.waitForFunction(([y, g]) => document.querySelector(`[data-hedef="o${y}"]`)?.dataset.gorunum === g, [yuva, gorunum], { timeout: 15000 })
```

`/tmp/bozo-oyun/sade/tahta.mjs`:

```js
import { ac, bekleGorunum, dokun, puan } from './ortak.mjs'

const { tarayici, sayfa, hatalar } = await ac()
const sayim = await sayfa.evaluate(() => ({
  hedef: document.querySelectorAll('[data-hedef]').length,
  tasinir: document.querySelectorAll('[data-tasinir]').length,
  eski: document.querySelectorAll('[data-tezgah], [data-hedef="ayran"], [data-hedef^="s"]').length,
  kucuk: [...document.querySelectorAll('[data-hedef]:not([data-bos])')].filter((b) => { const r = b.getBoundingClientRect(); return r.width < 44 || r.height < 44 }).length,
}))
// 1 raf + 3 yuva + 1 kase + 2 tabak + 1 çöp + 2 misafir + 3 para (paralar hep çizilir) = 13; taşınır: 2 tabak + 1 kase (boş yuvada şiş yok)
if (sayim.hedef !== 13 || sayim.tasinir !== 3 || sayim.eski || sayim.kucuk) throw new Error(JSON.stringify(sayim))
await sayfa.waitForSelector('[data-hedef="m0"]:not([data-bos])')
await dokun(sayfa, 'ciger')
await bekleGorunum(sayfa, 0, 'kivam')
await dokun(sayfa, 'o0')
await sayfa.waitForSelector('[data-hedef="o0"] [data-elde]')
const eldeAdi = await sayfa.evaluate(() => document.getElementById('oyun-o0-durum')?.textContent)
await dokun(sayfa, 't0')
const ucan = await sayfa.evaluate(() => document.querySelectorAll('[data-ucus]').length)
await sayfa.waitForFunction(() => /ciğer|liver/i.test(document.querySelector('[data-hedef="t0"]')?.getAttribute('aria-label') ?? ''))
await dokun(sayfa, 't0')
await sayfa.waitForSelector('[data-hedef="t0"] [data-elde]')
await dokun(sayfa, 'm0')
await sayfa.waitForSelector('[data-hedef="p0"]:not([data-bos])')
const elde = await sayfa.evaluate(() => document.querySelectorAll('[data-elde]').length)
const once = await puan(sayfa)
await dokun(sayfa, 'p0')
await sayfa.waitForFunction((p) => Number(document.querySelector('[data-ciz="puan"]')?.textContent) > p, once)
console.log({ sayim, eldeAdi, ucan, elde, once, sonra: await puan(sayfa), hatalar })
await tarayici.close()
if (hatalar.length || elde !== 0 || once < 150 || ucan < 1 || !/elde|in hand/i.test(eldeAdi ?? '')) process.exit(1)
```

Run: `node /tmp/bozo-oyun/sade/tahta.mjs`
Expected: exit 0: 13 targets and 3 draggable items at evre 1, no old counter or ayran nodes, no target under 44 px, the tapped skewer shows as in hand (raised, name says so), the second tap puts it on plate 1 with a flight clone in the DOM 40 ms later (`ucan >= 1`; the clone lives 220 ms), the plate tap-tap to the guest scores 150 (taken in the band), nothing stays in hand, the tip adds to the score. Run it again with `ac({ azalt: true })` in a copy named `tahta-azalt.mjs`, dropping the `ucan` check (no flight under reduced motion, the item just appears). Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add -A components content lib
git commit -m "Wire tap-tap input, flights and per-frame writes into the board"
```

---

### Task 11: The guided first round on the game screen

**Files:**
- Create: `components/oyun/useRehber.ts`, `components/oyun/Rehber.tsx`, `components/oyun/Rehber.module.css`
- Modify: `components/oyun/useOyunAlani.ts`, `components/oyun/Saha.tsx`

**Interfaces:**
- Consumes: `lib/oyun/rehber.ts` (Task 8), `rehberGoruldu` (`defter.ts`), the DOM contract of Task 9, `useOyunDongusu`'s `durdur`/`izle`/`oyunu` (Task 10), `ElIsareti` (Task 9).
- Produces: `useRehber(etkin: boolean)` returning `{ durum: Rehber; durdur: () => boolean; izin: (hedef: Hedef) => boolean; izle: (oyun: Oyun, olaylar: readonly Olay[]) => void; tamam: () => void; atla: () => void }`; `useOyunAlani` takes `rehberli: boolean` and returns `rehber` too; `Rehber` props `{ alan; adim; el: Elde; metin; tamam; atla }` (tap mode: one lit target per step, chosen from the hand state; Task 14 adds the source-to-target hand path for drag mode).

- [ ] **Step 1: Hook**

`components/oyun/useRehber.ts`:

```ts
import { useEffect, useRef, useState } from 'react'
import { rehberGoruldu } from '@/lib/oyun/defter'
import { rehberAtla, rehberBasla, rehberDurdurur, rehberIlerle, rehberIzni, rehberTamam, type Rehber } from '@/lib/oyun/rehber'
import type { Hedef, Olay, Oyun } from '@/lib/oyun/tipler'

const BITTI: Rehber = { adim: 'bitti' }

/** Rehberin canlı durumu: döngü ref'ten okur (eski kapanış yok), ekran state'ten çizer. Bitince tarayıcıya yazılır. */
export function useRehber(etkin: boolean) {
  const guncel = useRef<Rehber>(etkin ? rehberBasla() : BITTI)
  const [durum, setDurum] = useState<Rehber>(guncel.current)

  const yaz = (yeni: Rehber) => {
    if (yeni === guncel.current) return
    guncel.current = yeni
    setDurum(yeni)
  }

  useEffect(() => {
    if (etkin && durum.adim === 'bitti') rehberGoruldu()
  }, [etkin, durum.adim])

  return {
    durum,
    durdur: () => rehberDurdurur(guncel.current),
    izin: (hedef: Hedef) => rehberIzni(guncel.current, hedef),
    izle: (oyun: Oyun, olaylar: readonly Olay[]) => yaz(rehberIlerle(guncel.current, oyun, olaylar)),
    tamam: () => yaz(rehberTamam(guncel.current)),
    atla: () => yaz(rehberAtla(guncel.current)),
  }
}
```

`useOyunAlani.ts`: `Secenek` gains `rehberli: boolean`; `const rehber = useRehber(rehberli)`; pass `durdur: rehber.durdur, izle: rehber.izle` to `useOyunDongusu`; `dokun` starts with `if (!rehber.izin(hedef)) return false` (the refused input is never queued, so the record and the server replay stay equal; the `data-elde` display stays); return `rehber`. `Saha.tsx` destructures `rehberli`, passes it, and renders after `<Raf />` and before the curtain:

```tsx
      {rehber.durum.adim !== 'bitti' && rehber.durum.adim !== 'bekle' && rehber.durum.adim !== 'ikinci' && (
        <Rehber alan={kok} adim={rehber.durum.adim} el={goruntu.el} metin={s.oyun.rehber} tamam={rehber.tamam} atla={rehber.atla} />
      )}
```

- [ ] **Step 2: Overlay**

`components/oyun/Rehber.tsx`:

```tsx
import { useLayoutEffect, useState, type RefObject } from 'react'
import type { Sozluk } from '@/content'
import type { RehberAdimi } from '@/lib/oyun/rehber'
import type { Elde } from '@/lib/oyun/tipler'
import { ElIsareti } from './Semboller'
import stil from './Rehber.module.css'

type Metin = Sozluk['oyun']['rehber']
type Adim = Exclude<RehberAdimi, 'bitti' | 'bekle' | 'ikinci'>
type Props = { alan: RefObject<HTMLElement | null>; adim: Adim; el: Elde; metin: Metin; tamam: () => void; atla: () => void }

/** Dokunma modunda her adımın tek açık hedefi; iki dokunuşlu adımlarda ikincisi el dolunca. */
function hedefSecici(adim: Adim, el: Elde): string {
  switch (adim) {
    case 'fis':
      return '[data-hedef="m0"]'
    case 'raf':
      return '[data-hedef="ciger"]'
    case 'pisiyor':
    case 'hazir':
      return '[data-hedef="o0"]'
    case 'tabak':
      return '[data-hedef="t0"]'
    case 'misafir':
      return el?.tur === 'tabak' ? '[data-hedef="m0"]' : '[data-hedef="t0"]'
    case 'para':
      return '[data-hedef="p0"]'
    case 'eslikci':
      return el?.tur === 'eslikci' ? '[data-hedef="t0"]' : '[data-hedef="domates"]'
  }
}

type Kutu = { sol: number; ust: number; en: number; boy: number }
const PAY = 6

function olc(alan: HTMLElement, secici: string | null): Kutu | null {
  const el = secici ? alan.querySelector<HTMLElement>(secici) : null
  if (!el) return null
  const a = alan.getBoundingClientRect()
  const h = el.getBoundingClientRect()
  return { sol: h.left - a.left - PAY, ust: h.top - a.top - PAY, en: h.width + 2 * PAY, boy: h.height + 2 * PAY }
}

const merkez = (k: Kutu) => ({ x: k.sol + k.en / 2, y: k.ust + k.boy / 2 })

/**
 * Oyun alanının üstünde karartma, tek açık hedef, nabız atan el, tek cümlelik balon, Atla (spec tabak §7).
 * Katman tıklamayı yutmaz: yanlış girdiyi `rehberIzni` süzer. Yalnız Tamam ve Atla düğmesi tıklanır.
 */
export function Rehber({ alan, adim, el, metin, tamam, atla }: Props) {
  const [kaynak, setKaynak] = useState<Kutu | null>(null)
  const secici = hedefSecici(adim, el)

  useLayoutEffect(() => {
    const kok = alan.current
    if (!kok) return
    const guncelle = () => setKaynak(olc(kok, secici))
    guncelle()
    const izleyici = new ResizeObserver(guncelle)
    izleyici.observe(kok)
    return () => izleyici.disconnect()
  }, [alan, secici])

  if (!kaynak) return null
  const altta = kaynak.ust + kaynak.boy / 2 < (alan.current?.clientHeight ?? 0) / 2
  const balon = altta ? { top: kaynak.ust + kaynak.boy + 48 } : { bottom: `calc(100% - ${kaynak.ust}px + 48px)` }
  const a = merkez(kaynak)
  return (
    <div className={`${stil.rehber} ${stil.rehber}`} data-rehber={adim} data-hedef-secici={secici}>
      <span className={stil.delik} style={{ left: kaynak.sol, top: kaynak.ust, width: kaynak.en, height: kaynak.boy }} />
      <span className={stil.el} data-nabiz style={{ left: a.x, top: a.y }}>
        <ElIsareti boy={36} />
      </span>
      <p className={stil.balon} style={balon} role="status">
        {metin[adim]}
        {adim === 'fis' && (
          <button type="button" className={stil.tamam} onClick={tamam}>{metin.tamam}</button>
        )}
      </p>
      <button type="button" className={stil.atla} onClick={atla}>{metin.atla}</button>
    </div>
  )
}
```

`components/oyun/Rehber.module.css`:

```css
/* Karartma delik kutusunun gölgesinden gelir; katman tıklamayı yutmaz (`pointer-events: none`).
   Seçici iki kez yazılır: `.saha > *` kuralının (z-index 1, position) özgüllüğünü geçmek için. */
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
  translate: -50% -20%;
  color: var(--krem);
  line-height: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8));
}

/* El nabız atar; azaltılmışta global kural keser, el sabit durur. */
.el[data-nabiz] {
  animation: nabiz 1.1s ease-in-out infinite;
}

@keyframes nabiz {
  0%, 100% { scale: 1; }
  50% { scale: 1.18; }
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

/* HUD'un altında sağda (spec §7). */
.atla {
  position: absolute;
  top: 68px;
  right: 12px;
  padding: 0 14px;
  background: var(--krem-dolgu);
  border: 1px solid var(--cizgi-buton);
  border-radius: 3px;
}
```

Tap mode lights one target at a time: in `misafir` the plate until it is in hand, then the guest; in `eslikci` the bowl, then the plate. The `data-hedef-secici` attribute lets the headless script assert which target is lit. Task 14 adds the second (drag target) box and the hand path.

- [ ] **Step 3: Typecheck, tests, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: PASS.

- [ ] **Step 4: Headless guide runs**

`/tmp/bozo-oyun/sade/rehber.mjs` (fresh storage so the guide shows; taps only in this task, Task 14 adds the drag variant):

```js
import { ac, dokun } from './ortak.mjs'

const azalt = process.argv.includes('--azalt')
const { tarayici, sayfa, hatalar } = await ac({ azalt, rehberGoruldu: false })
const adim = () => sayfa.evaluate(() => document.querySelector('[data-rehber]')?.getAttribute('data-rehber') ?? null)
const saat = () => sayfa.evaluate(() => document.querySelector('[data-ciz="saat"]')?.textContent)
const bekleAdim = (a) => sayfa.waitForFunction((x) => (document.querySelector('[data-rehber]')?.getAttribute('data-rehber') ?? null) === x, a, { timeout: 20000 })
const durdu = async (ad) => { const s = await saat(); await sayfa.waitForTimeout(1500); if ((await saat()) !== s) throw new Error(`${ad} adımında saat aktı`) }
const akti = async (ad) => { const s = await saat(); await sayfa.waitForTimeout(1500); if ((await saat()) === s) throw new Error(`${ad} adımında saat durdu`) }
const acik = () => sayfa.evaluate(() => document.querySelector('[data-rehber]')?.getAttribute('data-hedef-secici'))

await bekleAdim('fis'); await durdu('fis')
await dokun(sayfa, 'ciger'); if ((await adim()) !== 'fis') throw new Error('fis adımında raf işledi')
await sayfa.getByRole('button', { name: /Tamam|Got It/ }).click()
await bekleAdim('raf'); await durdu('raf')
await dokun(sayfa, 'ciger')
await bekleAdim('pisiyor'); await akti('pisiyor')
await bekleAdim('hazir'); await durdu('hazir')
await dokun(sayfa, 'o0')
await bekleAdim('tabak')
// Review Focus 5: Esc rehberce reddedilir, şiş elde kalır, adım aynı.
await sayfa.keyboard.press('Escape')
await sayfa.waitForTimeout(200)
if ((await adim()) !== 'tabak' || !(await sayfa.$('[data-hedef="o0"] [data-elde]'))) throw new Error('reddedilen bırakış şişi düşürdü')
await dokun(sayfa, 't0')
await bekleAdim('misafir')
const elde1 = await sayfa.evaluate(() => document.querySelectorAll('[data-elde]').length)
await durdu('misafir')
if ((await acik()) !== '[data-hedef="t0"]') throw new Error('misafir adımında önce tabak açık olmalı')
await dokun(sayfa, 't0')
await sayfa.waitForFunction(() => document.querySelector('[data-rehber]')?.getAttribute('data-hedef-secici') === '[data-hedef="m0"]')
await dokun(sayfa, 'm0')
await bekleAdim('para'); await durdu('para')
await dokun(sayfa, 'p0')
await sayfa.waitForFunction(() => !document.querySelector('[data-rehber]'), null, { timeout: 5000 })
await bekleAdim('eslikci'); await durdu('eslikci')
const nabiz = await sayfa.evaluate(() => document.getAnimations().length)
await dokun(sayfa, 'domates')
await sayfa.waitForFunction(() => document.querySelector('[data-rehber]')?.getAttribute('data-hedef-secici') === '[data-hedef="t0"]')
await dokun(sayfa, 't0')
await sayfa.waitForFunction(() => !document.querySelector('[data-rehber]'), null, { timeout: 5000 })
await sayfa.waitForTimeout(300)
const goruldu = await sayfa.evaluate(() => localStorage.getItem('bozo-oyun-rehber-goruldu'))
console.log({ azalt, elde1, goruldu, nabiz, hatalar })
await tarayici.close()
if (hatalar.length || elde1 !== 0 || goruldu !== '1' || (azalt ? nabiz !== 0 : nabiz < 1)) process.exit(1)
```

Run: `node /tmp/bozo-oyun/sade/rehber.mjs` and `node /tmp/bozo-oyun/sade/rehber.mjs --azalt`
Expected: both exit 0: steps in order, clock frozen at `fis`, `raf`, `hazir`, `misafir`, `para`, `eslikci`, flowing at `pisiyor` and `tabak`; the refused Esc keeps the skewer in hand (Review Focus 5); the lit target switches inside the two-tap steps; `goruldu` is `'1'`; the hand pulse count is 0 under `--azalt` (the global CSS rule stops it) and at least 1 otherwise.

`/tmp/bozo-oyun/sade/rehber-atla.mjs`: at each of the seven steps in turn (seven fresh contexts, or one context per run with `process.argv[2]` naming the step), click `Atla`, expect `[data-rehber]` gone, the clock flowing within 1.5 s, and storage `'1'`. Expected: exit 0 for all.

- [ ] **Step 5: Commit**

```bash
git add -A components lib
git commit -m "Teach the plate flow on the game screen with a guided overlay"
```

---

### Task 12: Keyboard path, screen-reader names, axe

**Files:**
- Modify: `components/oyun/odak.ts` (only if the coin buttons with `tabIndex=-1` break the roving tabindex; see Step 1), `docs/surec/IYILESTIRMELER.md`
- Test: headless `klavye.mjs`, `axe.mjs`

**Interfaces:**
- Consumes: `useSurukleme`'s keyboard branch (Task 10), `odak.ts` (Tab between strips, arrows within), the label spans of Task 9. After this task the tap-only game is complete: playable, guided, accessible (the staging boundary).

- [ ] **Step 1: Roving tabindex and hidden coins**

`odak.ts` builds the strip's stop list from `button:not([disabled])`; the empty coin buttons carry `tabIndex={-1}` and `aria-hidden` from React, and `durakYap` would overwrite that `-1` with `0` when they are the first button. Change `DUGME` to `'button:not([disabled]):not([aria-hidden="true"])'`. No other change.

- [ ] **Step 2: Headless keyboard run**

`/tmp/bozo-oyun/sade/klavye.mjs` (guide already seen):

```js
import { ac, bekleGorunum, puan } from './ortak.mjs'

const { tarayici, sayfa, hatalar } = await ac()
const odak = () => sayfa.evaluate(() => document.activeElement?.getAttribute('data-hedef') ?? document.activeElement?.tagName)
const ad = (h) => sayfa.evaluate((x) => { const b = document.querySelector(`[data-hedef="${x}"]`); return b.getAttribute('aria-label') ?? [...b.getAttribute('aria-labelledby').split(' ')].map((id) => document.getElementById(id)?.textContent ?? '').join(' ') }, h)

await sayfa.waitForSelector('[data-hedef="m0"]:not([data-bos])')
// Tab: HUD ses, HUD duraklat, sonra şeritler (misafir, ocak, tabak, raf); her şerit tek durak.
const duraklar = []
for (let i = 0; i < 8; i++) { await sayfa.keyboard.press('Tab'); duraklar.push(await odak()) }
const rafaKadar = duraklar.indexOf('ciger')
if (rafaKadar === -1) throw new Error(`raf Tab ile bulunamadı: ${duraklar.join(',')}`)
await sayfa.keyboard.press('Enter')
await bekleGorunum(sayfa, 0, 'hazir')
const ocakAdi = await ad('o0')
if (!/hazır|ready/i.test(ocakAdi)) throw new Error(`ocak adı durumu taşımıyor: ${ocakAdi}`)
// Shift+Tab ocak şeridine, ok tuşları yuva 0'a (ilk durak zaten o0).
while ((await odak()) !== 'o0') await sayfa.keyboard.press('Shift+Tab')
await sayfa.keyboard.press(' ')
await sayfa.waitForSelector('[data-hedef="o0"] [data-elde]')
if (!/elde|in hand/i.test(await ad('o0'))) throw new Error('elde durumu adda yok')
await sayfa.keyboard.press('Escape')
await sayfa.waitForTimeout(100)
// Esc şişi atmaz (spec §13): elde kalır. Tab ile tabak şeridine, ok tuşuyla tabağa, Enter.
if (!(await sayfa.$('[data-hedef="o0"] [data-elde]'))) throw new Error('Esc şişi düşürdü')
while ((await odak()) !== 'cop') await sayfa.keyboard.press('Tab')
await sayfa.keyboard.press('ArrowRight')
if ((await odak()) !== 't0') throw new Error('ok tuşu tabağa gitmedi')
await sayfa.keyboard.press('Enter')
await sayfa.waitForFunction(() => /ciğer|liver/i.test(document.querySelector('[data-hedef="t0"]')?.getAttribute('aria-label') ?? ''))
await sayfa.keyboard.press('Enter')
await sayfa.waitForSelector('[data-hedef="t0"] [data-elde]')
while ((await odak()) !== 'm0') await sayfa.keyboard.press('Shift+Tab')
const misafirAdi = await ad('m0')
if (!/istiyor|wants/.test(misafirAdi) || !/yüzde|percent/.test(misafirAdi)) throw new Error(`misafir adı eksik: ${misafirAdi}`)
await sayfa.keyboard.press('Enter')
await sayfa.waitForSelector('[data-hedef="p0"]:not([data-bos])')
const once = await puan(sayfa)
while ((await odak()) !== 'p0') await sayfa.keyboard.press('Tab')
await sayfa.keyboard.press('Enter')
await sayfa.waitForFunction((p) => Number(document.querySelector('[data-ciz="puan"]')?.textContent) > p, once)
const duyuru = await sayfa.evaluate(() => document.querySelector('[data-duyuru]')?.textContent)
console.log({ duraklar, ocakAdi, misafirAdi, duyuru, hatalar })
await tarayici.close()
if (hatalar.length || !duyuru) process.exit(1)
```

Run: `node /tmp/bozo-oyun/sade/klavye.mjs`
Expected: exit 0: Tab reaches the rack, Enter cooks, Space grabs (name says "elde"/"in hand"), Esc leaves the skewer in hand, the arrow key moves from the bin to plate 1 inside the strip, Enter places and grabs the plate, the guest's name carries the ticket and a patience percentage, Enter delivers, the coin is reachable by Tab once it exists, the live region carries the last announcement. If the misafir name check fails because `Shift+Tab` lands on `m1`, press `ArrowLeft` until `m0`.

- [ ] **Step 3: axe**

`/tmp/bozo-oyun/sade/axe.mjs`: open with `ac()`, inject `/Users/mk/.npm/_npx/1fc4933a57a44b8f/node_modules/axe-core/axe.min.js` with `sayfa.addScriptTag({ path })`, run `axe.run(document.querySelector('[data-ekran="oyun"]'))`, print `violations.map((v) => [v.id, v.nodes.length])`. Run it on the game screen with the guide (`rehberGoruldu: false`, at step `fis`) and without. Expected: `[]` both times. A `color-contrast` hit on the ticket paper or the rack label is fixed in CSS (darken the text, never lighten ember); a `button-name` hit means a label span is missing on that button.

- [ ] **Step 4: Record and commit**

Add to `docs/surec/IYILESTIRMELER.md` under the Task 4 heading a sub-heading "Klavye ve ekran okuyucu" with the Tab order measured, the names read for `o0`, `t0`, `m0`, `p0`, and the axe result.

```bash
git add -A components docs/surec/IYILESTIRMELER.md
git commit -m "Finish the keyboard path and state-bearing names on the board"
```

---

### Task 13: Optional nickname on the entry screen

**Files:**
- Create: `lib/oyun/giris.ts`, `lib/oyun/giris.test.ts`
- Modify: `components/oyun/GirisEkrani.tsx`, `GirisEkrani.module.css`, `GirisTablosu.tsx`, `OyunSayfasi.tsx`, `useOyunAkisi.ts`, `content/tr/oyun.ts`, `content/en/oyun.ts`

**Interfaces:**
- Consumes: `Hesap` (`defter.ts`), `takmaAdBicimiGecerliMi`, `takmaAdDuzelt`, `TAKMA_AD_EN_COK`, `api.tabloAl`, the existing `kaydet`/`gonder` in `useGonderim`.
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

Run: `node --test lib/oyun/giris.test.ts`. Expected: FAIL (module missing).

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

Run: `node --test lib/oyun/giris.test.ts`. Expected: PASS.

- [ ] **Step 3: Flow in `useOyunAkisi.ts`**

Add the server probe (one request shared with the leaderboard block):

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

`Tur` gains `takmaAd: string | null`; `jetonIste(takmaAd)` copies it into both return branches; `basla(takmaAd: string | null)` passes it on. `kaydet(takmaAd, bekleyen)` takes the pending round explicitly (`bekleyen: { turId: string; kayit: readonly Girdi[] } | null`; the body is unchanged except `if (bekleyen) void gonder(bekleyen.turId, bekleyen.kayit, yeniHesap)`); the result-screen caller passes `son?.turId ? { turId: son.turId, kayit: son.kayit } : null`. `bitir`:

```ts
  const bitir = (sonuc: Sonuc, kayit: readonly Girdi[]) => {
    const onceki = enIyiOku()
    const yeni = enIyiYaz(sonuc.puan)
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

  /** Giriş ekranındaki ad: hesabı açıp turu gönderir; ad reddedilir ya da ağ düşerse sonuç ekranındaki düğmeye döner. */
  const kaydetVeGonder = async (takmaAd: string, turId: string, kayit: readonly Girdi[]) => {
    setGonderim({ durum: 'gonderiliyor' })
    if ((await kaydet(takmaAd, { turId, kayit })) !== 'tamam') setGonderim({ durum: 'bekliyor' })
  }
```

Return `sunucu`, `tablo` and `hesap` from the hook so the entry screen can pre-fill from `hesap?.takmaAd`. Keep every function under 50 lines (`useOyunAkisi` itself may need `kaydetVeGonder` hoisted next to `bitir` as shown).

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
    if (duzgun === '' || sunucu !== 'var') return basla(null)
    if (!takmaAdBicimiGecerliMi(duzgun)) return setHata(true)
    basla(duzgun)
  }

  return (
    <OyunAcilisi baslik={s.oyun.baslik} cumle={s.ana.gece.baslik} baglantilar={<GirisBaglantilari dil={dil} />} altinda={<GirisTablosu dil={dil} tablo={tablo} />}>
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
      <button type="button" className={stil.oyna} onClick={oyna} disabled={bekliyor}>{s.oyun.oyna}</button>
    </OyunAcilisi>
  )
}
```

`GirisEkrani.module.css` adds `.ad` (grid, gap 6px, margin-bottom 12px), `.adEtiket` (`500 14.5px/1.2 var(--font-govde)`, `--krem-70`), `.adAlani` (`min-height: 48px`, `--komur` ground, `1px solid var(--cizgi-guclu)`, `--krem` text, `400 16px/1.4 var(--font-govde)` so iOS does not zoom, radius 3px, `[aria-invalid='true']` border `--kor`), `.adBilgi` (`400 14.5px/1.5`, `--krem-70`), `.adHata` (`500 14.5px/1.5`, `--bakir-acik`; ember is never text). `OyunSayfasi` passes `sunucu={akis.sunucu}`, `hesapAdi={akis.hesap?.takmaAd ?? null}`, `tablo={akis.tablo}`, `basla={akis.basla}`; the result screen's `tekrar` becomes `() => akis.basla(akis.hesap?.takmaAd ?? null)`.

Dictionary: `content/tr/oyun.ts` `giris: { takmaAd: 'Takma adın (isteğe bağlı)' }`, `gonderim.sira: 'Sıralamaya yazıldı: sıra {sira}'`; `content/en/oyun.ts` `giris: { takmaAd: 'Nickname (optional)' }`, `gonderim.sira: 'Added to the ranking: rank {sira}'`. The notice line under the field is the existing `katilim.aciklama`; typing a name and pressing Oyna is the opt-in, exactly as pressing "Kaydet ve Katıl" was. The consent wording is the owner's to approve at go-live; this task does not change it.

- [ ] **Step 5: Typecheck, tests, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: PASS.

- [ ] **Step 6: Headless runs with a fake server**

`/tmp/bozo-oyun/sade/ad.mjs` (served `out/` on 8412; three scenarios in fresh contexts; `page.route('**/api.cigercibozo.com/**', …)` fulfils JSON; the guide is pre-marked seen; the round is ended by the idle path: install `page.clock.install()` before `goto` and `await page.clock.runFor(5000)` in a loop until `[data-ekran="sonuc"]` appears, at most 30 iterations (`runFor` fires every rAF and timer inside the span; `fastForward` fires each due timer once per call, which is one frame of at most six ticks, and would run out of iterations), since the idle night ends at 'ucMisafir' before 02:00):

1. **Server down** (`route.abort()`): `#giris-takma-ad` is absent; after the round the result text contains `Çevrimdışı tur: sıralamaya girmez.`
2. **Server up, name typed**: `GET /tablo` returns `{donem:'2026-W41',bitis:'2026-10-12T00:00:00Z',hafta:[],tumZamanlar:[],sonSampiyon:null}`, `POST /tur` returns `{turId:'0123456789abcdef0123456789abcdef',tohum:12345,sonaErme:'2026-10-09T00:15:00Z'}`, `POST /oyuncu` returns `{takmaAd:'Bozo Usta'}`, `POST /tur/*/bitir` returns `{puan:0,ozet:{misafir:0,sis:0,tamKivam:0,enUzunKombo:0,kalkan:3,bahsis:0},bitti:'ucMisafir',tik:4140,hafta:{puan:0,sira:7,ustekiFark:null},buTurEnIyi:true}`. Type `Bozo Usta`, press Oyna, idle to the result; assert the request log has `/oyuncu` then `/tur/…/bitir`, the page shows `Sıralamaya yazıldı: sıra 7`, and no "Bu Skoru Sıralamaya Yaz" button exists.
3. **Server up, banned name** (`POST /oyuncu` returns status 422 `{hata:'takmaAdKullanilamaz'}`): after the round the "Bu Skoru Sıralamaya Yaz" button is present (fallback, no dead end).

Expected: all three pass.

- [ ] **Step 7: Commit**

```bash
git add -A components content lib
git commit -m "Add the optional nickname field and auto-submit on the entry screen"
```

---

### Task 14: The drag layer on top of the tap game

**Files:**
- Modify: `components/oyun/useSurukleme.ts`, `tepkiler.ts`, `Saha.module.css`, `Rehber.tsx`, `Rehber.module.css`, `content/tr/oyun.ts`, `content/en/oyun.ts`
- Test: `npm run typecheck`, `npm test`, `npm run build`, headless `tahta-surukle.mjs`, `rehber-surukle.mjs`

**Interfaces:**
- Consumes: `surukle` (`yuru`, `tasima`), `birakmaHedefiMi`, `eldeKaynagi` (Task 7); `ucus` and `data-suruklendi` (Task 10); `Rehber` props (Task 11).
- Produces: `useSurukleme` option `azalt: boolean` and the `pointermove` branch; `tepkiler.ts` exports `yerineDon(tasinan: HTMLElement | null, azalt: boolean)`; `Rehber` gains the drag target box and hand path. The simulation and its record format do not change: a drag is still `tut` then a target.

- [ ] **Step 1: Snap-back and the drag branch**

`components/oyun/tepkiler.ts`, add:

```ts
/** Sürüklenen öğe 180 ms'de yerine döner; azaltılmışta anlık. Yalnız girdi vermeyen ya da reddedilen bırakışta. */
export function yerineDon(tasinan: HTMLElement | null, azalt: boolean): void {
  if (!tasinan) return
  const simdiki = tasinan.style.transform
  tasinan.style.transform = ''
  tasinan.removeAttribute('data-tasinan')
  if (azalt || !simdiki) return
  tasinan.animate([{ transform: simdiki }, { transform: 'none' }], { duration: 180, easing: 'ease-out' })
}
```

`components/oyun/useSurukleme.ts`: `Secenek` gains `azalt: boolean`; `isle` grows the DOM side of the result:

```ts
  const isle = useEffectEvent((isaret: Isaret, el: HTMLElement | null, durum: Surukleme): Surukleme => {
    const alan = kok.current
    const kaynak = elde()
    const sonuc = surukle(durum, isaret, { elde: kaynak })
    const kabul = sonuc.girdiler.map((hedef) => dokun(hedef, hedef === 'birak' ? null : el))
    const tasinan = alan && kaynak ? alan.querySelector<HTMLElement>(`[data-hedef="${kaynak}"] [data-tasinir]`) : null
    if (sonuc.tasima && tasinan) {
      tasinan.setAttribute('data-tasinan', '')
      tasinan.style.transform = `translate(${sonuc.tasima.dx}px, ${sonuc.tasima.dy}px)`
    } else if (sonuc.durum.tur === 'bos' && tasinan?.hasAttribute('data-tasinan')) {
      birakisiBitir(alan, tasinan, kabul)
    }
    vurgula(alan, sonuc.durum.tur === 'basili' && sonuc.tasima ? el : null, kaynak)
    return sonuc.durum
  })
```

with two helpers below the hook:

```ts
/**
 * Bırakış sonu: girdi verilmedi ya da rehber reddetti → öğe yerine süzülür; hedefe bırakıldı → dönüşüm
 * anında silinir (React öğeyi hedefte çizer; reddederse öğe zaten kaynağında, `salla` oynar) ve uçuş
 * atlanır (`data-suruklendi`, `ucus` tüketir).
 */
function birakisiBitir(alan: HTMLElement | null, tasinan: HTMLElement, kabul: boolean[], azalt: boolean): void {
  if (kabul.length === 0 || kabul.every((k) => !k)) return yerineDon(tasinan, azalt)
  tasinan.style.transform = ''
  tasinan.removeAttribute('data-tasinan')
  alan?.setAttribute('data-suruklendi', '')
}

/** Geçerli hedef parmak üstündeyken bakır kenar (`data-ustunde`); başka her şeyden silinir. */
function vurgula(alan: HTMLElement | null, el: HTMLElement | null, elde: Hedef | null): void {
  if (!alan) return
  const hedef = hedefi(el)
  const gecerli = el && elde && hedef && birakmaHedefiMi(elde, hedef) ? el : null
  for (const eski of alan.querySelectorAll<HTMLElement>('[data-ustunde]')) if (eski !== gecerli) eski.removeAttribute('data-ustunde')
  gecerli?.setAttribute('data-ustunde', '')
}
```

(pass `azalt` into `birakisiBitir` from the hook's closure.) In the effect add the move listener, throttled to one `elementFromPoint` per frame:

```ts
    let bekleyenHareket: PointerEvent | null = null
    const yuru = (e: PointerEvent) => {
      if (durum.tur !== 'basili' || bekleyenHareket) {
        bekleyenHareket = bekleyenHareket && e
        return
      }
      bekleyenHareket = e
      requestAnimationFrame(() => {
        const son = bekleyenHareket
        bekleyenHareket = null
        if (!son || durum.tur !== 'basili') return
        yaz({ tur: 'yuru', id: son.pointerId, x: son.clientX, y: son.clientY }, hedefBul(son.clientX, son.clientY))
      })
    }
    alan.addEventListener('pointermove', yuru)
```

(and the matching `removeEventListener`). The `data-suruklendi` flag set by `birakisiBitir` is consumed by `ucus` in the same frame's reactions: a dragged item does not fly; a tapped one does. Also import `yerineDon` from `./tepkiler` and `birakmaHedefiMi` from `@/lib/oyun/surukle`.

- [ ] **Step 2: Stacking**

`components/oyun/Saha.module.css`: each strip is a stacking context (`.saha > * { position: relative; z-index: 1 }`), which traps the dragged item behind the next strip. Add:

```css
/* Sürüklenen öğenin şeridi üste çıkar; yoksa `[data-tasinan]` komşu şeridin altında kalır. */
.saha > [data-serit]:has([data-tasinan]) {
  z-index: 2;
}
```

- [ ] **Step 3: Guide in drag mode**

Dictionary: replace the four tap sentences with the drag wording listed in Task 9 (TR `hazir`/`tabak` `'Şişi tabağa sürükle'`, `misafir` `'Tabağı misafire götür'`, `eslikci` `'Domatesi de tabağa koy'`; EN `'Drag the skewer to the plate'`, `'Drag the skewer to the plate'`, `'Drag the plate to the guest'`, `'Add the tomato too'`).

`Rehber.tsx`: `Props` gains `azalt: boolean` (Saha passes `azalt`); `hedefSecici` returns a pair `[kaynak, hedef | null]`: `hazir` and `tabak` `['[data-hedef="o0"]', '[data-hedef="t0"]']`, `misafir` `['[data-hedef="t0"]', '[data-hedef="m0"]']`, `eslikci` `['[data-hedef="domates"]', '[data-hedef="t0"]']`, the rest `[…, null]` (the `el`-dependent switch is no longer needed: both boxes are lit at once; keep the `el` prop out, Saha stops passing it). State becomes `{ kaynak: Kutu | null; hedef: Kutu | null }`, measured with `olc` for both selectors. Add the hand path (WAAPI, reads `azalt` itself):

```tsx
/** El kaynaktan hedefe 1,2 sn'de yol çizer (sonsuz); azaltılmışta kaynakta durur, bakır kesikli çizgi iner. */
function useElYolu(el: RefObject<HTMLElement | null>, kaynak: Kutu | null, hedef: Kutu | null, azalt: boolean): void {
  useEffect(() => {
    const dugum = el.current
    if (!dugum || !kaynak || !hedef || azalt) return
    const a = merkez(kaynak)
    const b = merkez(hedef)
    const anim = dugum.animate(
      [
        { transform: 'translate(0, 0)', opacity: 0, offset: 0 },
        { transform: 'translate(0, 0)', opacity: 1, offset: 0.15 },
        { transform: `translate(${b.x - a.x}px, ${b.y - a.y}px)`, opacity: 1, offset: 0.85 },
        { transform: `translate(${b.x - a.x}px, ${b.y - a.y}px)`, opacity: 0, offset: 1 },
      ],
      { duration: 1200, iterations: Infinity, easing: 'ease-in-out' },
    )
    return () => anim.cancel()
  }, [el, kaynak, hedef, azalt])
}
```

and in the JSX, after the `.delik` span:

```tsx
      {hedef && <span className={stil.hedef} style={{ left: hedef.sol, top: hedef.ust, width: hedef.en, height: hedef.boy }} />}
      {hedef && azalt && (
        <svg className={stil.yol} aria-hidden="true">
          <line x1={a.x} y1={a.y} x2={merkez(hedef).x} y2={merkez(hedef).y} />
        </svg>
      )}
      <span ref={elRef} className={stil.el} data-nabiz={hedef ? undefined : ''} style={{ left: a.x, top: a.y }}>
```

(`elRef` from `useRef<HTMLSpanElement>(null)`; `data-rehber-hedef` attribute on the root set to the target selector so the headless script can assert it.) `Rehber.module.css` adds:

```css
/* Sürükleme hedefi de açık: kesikli bakır çerçeve; karartma kaynağın gölgesinden gelir, hedef üstüne çizilir. */
.hedef {
  position: absolute;
  border-radius: 6px;
  outline: 2px dashed var(--bakir-acik);
}

.yol {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.yol line {
  stroke: var(--bakir-acik);
  stroke-width: 2;
  stroke-dasharray: 6 6;
}
```

If the target box reads too dark under the karartma at runtime (measured contrast of the plate below AA), render the dim as four rects around the two boxes instead of the hole shadow, and record it in `IYILESTIRMELER.md`.

- [ ] **Step 4: Typecheck, tests, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: PASS.

- [ ] **Step 5: Headless drag runs**

Add to `/tmp/bozo-oyun/sade/ortak.mjs`:

```js
/** Gerçek işaretçi sürüklemesi: down, bir tik bekle (tut işlensin), altı adımda 16 ms arayla move, up. */
export async function surukle(sayfa, kaynak, hedef) {
  const a = await sayfa.locator(kaynak).boundingBox()
  const b = await sayfa.locator(hedef).boundingBox()
  const [ax, ay, bx, by] = [a.x + a.width / 2, a.y + a.height / 2, b.x + b.width / 2, b.y + b.height / 2]
  await sayfa.mouse.move(ax, ay)
  await sayfa.mouse.down()
  await sayfa.waitForTimeout(50)
  for (let i = 1; i <= 6; i++) {
    await sayfa.mouse.move(ax + ((bx - ax) * i) / 6, ay + ((by - ay) * i) / 6)
    await sayfa.waitForTimeout(16)
  }
  await sayfa.mouse.up()
  await sayfa.waitForTimeout(40)
}
```

`/tmp/bozo-oyun/sade/tahta-surukle.mjs`: `tahta.mjs` with `surukle(sayfa, '[data-hedef="o0"]', '[data-hedef="t0"]')` in place of the two skewer taps and `surukle(sayfa, '[data-hedef="t0"]', '[data-hedef="m0"]')` in place of the two plate taps; after the first drag assert `document.querySelectorAll('[data-tasinan]').length === 0`, every `[data-tasinir]` has `style.transform === ''`, no `[data-ucus]` clone appears within 100 ms (no flight after a drag), and the `[data-tasinir]` element's own `getAnimations().length === 0` (no snap-back animation after an accepted drop). Then three more checks in the same run: (a) drag the next ready skewer and release on the HUD clock (`[data-ciz="saat"]`): the skewer stays in hand (`[data-hedef="o0"] [data-elde]` exists) and the element is back at its source; (b) while it is in hand, `mouse.down` on `o0`, move 40 px, then `await sayfa.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))` with `document.hidden` stubbed to `true` via `Object.defineProperty` in an `addInitScript`: the pause curtain shows and no `[data-tasinan]` remains; (c) during a drag, `document.elementFromPoint` over the plate reports the plate (not the dragged skewer) and the plate carries `data-ustunde`. Expected: exit 0.

`/tmp/bozo-oyun/sade/rehber-surukle.mjs`: `rehber.mjs` with drags (`surukle o0→t0`, `t0→m0`, `domates→t0`), the Review Focus 5 step as a drag released on the HUD at step `tabak` (expect the step unchanged and the skewer still in hand), and `data-rehber-hedef` asserted to be `'[data-hedef="t0"]'` at `hazir`. Run with and without `--azalt`; under `--azalt` the hand path animation count is 0 and the `.yol` line exists. Expected: exit 0 for all.

Frame time, `/tmp/bozo-oyun/sade/kare.mjs`: open with `ac()`, `const cdp = await sayfa.context().newCDPSession(sayfa); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })`, start the round, cook one skewer, then during a 2-second slow drag (`mouse.down`, 60 `mouse.move` steps of 2 px with `waitForTimeout(16)`) collect frame durations via a `requestAnimationFrame` loop pushing `performance.now()` deltas into `window.__kareler`; after `mouse.up` compute p95. Expected: p95 ≤ 17.5 ms. If it is above, the suspects are `elementFromPoint` per move (already one per frame) and the `[data-ustunde]` box-shadow; measure again after each change and record both numbers in `IYILESTIRMELER.md`.

- [ ] **Step 6: Commit**

```bash
git add -A components content
git commit -m "Layer pointer drags on top of the tap-tap plate flow"
```

---

### Task 15: Result screen, dead-code sweep, docs, final verification

**Files:**
- Modify: `components/oyun/SonucEkrani.tsx`, `SonucEkrani.module.css`, `docs/specs/2026-10-09-oyun-tabak-akisi-design.md` (status line), `docs/surec/DEVAM.md`, `docs/surec/IYILESTIRMELER.md`, `docs/surec/OYUN-VARLIK-BRIEFI.md`, `CLAUDE.md` (the `lib/oyun/` and `components/oyun` sentences only), `README.md` (only if it describes the old verbs)

- [ ] **Step 1: Result screen**

`SonucEkrani.tsx`: `bitisSatiri` uses `s.oyun.ucMisafirKalkti`; `OzetListesi` has five rows: `[sayi(ozet.misafir), s.oyun.ozet.misafir]`, `[sayi(ozet.sis), s.oyun.ozet.sis]`, `[sayi(ozet.tamKivam), s.oyun.ozet.tamKivam]`, `[`×${ozet.enUzunKombo}`, s.oyun.ozet.enUzunKombo]`, `[sayi(ozet.bahsis), s.oyun.ozet.bahsis]`. `SonucEkrani.module.css`: `.ozet` becomes `grid-template-columns: repeat(5, 1fr)` and under `@media (max-width: 359px)` `.deger` is 20px.

- [ ] **Step 2: Dead-code sweep**

```bash
grep -rnE "tezgah|Tezgah|ayran|cevirme|Cevirme|ipucu|KorNoktasi|sogudu|komboDusur|porsiyon|Porsiyon|sofra|Sofra|kurulu|ilkTur|kisayol|servisEdilenler|ucSofra" lib components content sunucu --include='*.ts' --include='*.tsx' --include='*.css' --include='*.sql' | grep -vE "content/(tr|en)/(menu|ana|ortak|hikaye|gizlilik)\.ts|components/sayfa|components/layout|lib/(site|jsonld|metadata|kabuk)\.ts|sunucu/.*kanal|'sofra'|Sofra Yetiştir|sofrada"
```

Expected: no hits. Every hit under `lib/oyun`, `components/oyun`, `content/*/oyun.ts`, `sunucu` is dead code or an old name: delete or rename it. (`'sofra'` the QR channel in `aktarim.ts`, `sema.sql` and the server tests is the entry channel, not the table; `Sofra Yetiştir` is the game's title and `sofrada` sits in the prize copy: all three stay and the grep excludes them.) Also `SahneTezgah` is a file name the spec keeps; the grep's `Tezgah` hits on that file name are expected: confirm nothing else.

Re-run the dead-class check from Task 9 and the `url(#…)` check from Task 10.

- [ ] **Step 3: Docs**

- Spec status line: "Durum: uygulandı (plan `docs/plans/2026-10-09-oyun-tabak-plani.md`)", and a short note under §5 listing the plan's rulings: intervals fitted to the phases (340/290/245/110 ticks), evre 5 three tickets plus Karışık, 24 guests, idle gate "02:00'den önce", rastgele gate satisfied by construction.
- `docs/surec/DEVAM.md`: replace the top "Durum" bullet about the game with the plate flow (implemented, not deployed; score server go-live still needs the privacy text TR/EN, infra, DNS, secrets; the nickname field stays hidden live until then), pointers to this plan and spec.
- `docs/surec/IYILESTIRMELER.md`: confirm the Task 4 and Task 12 entries have their numbers; add the measured target sizes at 320/390 (plates 60/83 wide, bowls 48/56) and the fold measurements from Step 4 under the Task 4 heading; add one paragraph "Son saat kaybedilemez" telling the owner that evre 5 (04:00-05:00, 15 s) cannot end the night by three leavers (patience 16 s is longer than the phase) and is therefore a score sprint, kept on purpose (spec §13).
- `docs/surec/OYUN-VARLIK-BRIEFI.md`: add rows for the new vector parts the spec names (misafir silueti 3 varyant, fiş balonu, domates ve sumaklı soğan kaseleri ve tabak üstü halleri, bakır kova, bahşiş parası, rehber eli) and strike the churn (12) and cup (4) rows (delete them; the ayran decision is recorded in the sade spec).
- `CLAUDE.md`: in the `lib/` bullet replace the display-module list with `gosterim`, `gorsel`, `zamanlayici`, `defter`, `klavye`, `duyuru`, `ses`, `tarih`, `surukle` (gesture machine), `rehber` (guided round), and in the `components/` bullet replace "DOM + painted inline SVG … `motion` only for screen transitions" with one sentence that adds "pointer drags reduced to grab/drop inputs by `lib/oyun/surukle.ts`". Do not add a section.
- `README.md`: only if it lists the old verbs; otherwise untouched.

- [ ] **Step 4: Full verification**

Run, in order, and read the output of each:

```bash
npm run typecheck
npm test
npm run build
```

Expected: typecheck clean; tests all pass (count printed, none skipped except the opt-in MariaDB contract); build lists the routes including `/oyun` and `/en/oyun`.

Headless matrix (rebuild and serve on 8412): `tahta.mjs`, `tahta-azalt.mjs`, `tahta-surukle.mjs`, `rehber.mjs` (with and without `--azalt`), `rehber-surukle.mjs` (both), `rehber-atla.mjs`, `klavye.mjs`, `axe.mjs`, `ad.mjs`, `kare.mjs`, plus `tahta.mjs` at `{ en: 320 }`, `{ en: 390, boy: 664 }` (iPhone Safari with bars), `{ en: 375, boy: 548 }` (SE with bars) and `{ en: 1440, boy: 900 }` (the panel is 420 px wide on desktop: assert `document.querySelector('[data-ekran="oyun"]').clientWidth === 420`). Expected: every script exits 0; at 320 the `kucuk` count is 0 (no target under 44 px) and `document.documentElement.scrollWidth <= 320`; at 390×664 and 375×548 the rack's bottom edge stays inside the viewport: `document.querySelector('[data-hedef="ciger"]').getBoundingClientRect().bottom <= innerHeight` (the fire strip shrinks to its 96 px floor first; if the rack still overflows at 548, reduce the guest strip to 150 and the plate strip to 104 in `Saha.module.css`, re-measure, and record the numbers).

- [ ] **Step 5: Commit**

```bash
git add -A docs CLAUDE.md README.md components
git commit -m "Record the plate flow in the project docs and finish the sweep"
```

Do not push or deploy: deployment happens when the owner asks (`README.md` > Publishing). The live build keeps showing the offline round (no name field) until the score server is deployed.

---

## Self-Review

**Spec coverage.** §2 loop and rules (five moves, ticket 1-4 items, Karışık, fire with no turn, hand sealed on take, two always-full plates, four-item limit, exact-set match, wrong plate returns, bin, skewer never straight to a guest, three places and the door, three leavers end the night, paid guest leaves in 30 ticks, tip coin with 8 s fade and merge, score table with no penalties, combo thresholds, night bonus, porsiyon badge gone): Tasks 1-3. §3 tap-tap and keyboard (Tasks 7, 9, 10, 12) first, drag with one finger, hit areas, `elementFromPoint`, `pointer-events: none` on the dragged item, 120 ms copper edge and snap-back layered on in Task 14; reduced motion, screen-reader names and live region: Tasks 10, 12. §4 ring, two endings, result summary with `misafir` and `bahsis`: Tasks 3, 9, 14. §5 table, budget, bots and gates: Tasks 1, 4 (with the recorded deviations). §6 screen: Task 9 (sizes measured in Task 14). §7 guide: Tasks 8, 11 (tap wording), 14 (drag wording and hand path). §8 determinism, 19 targets, same-tick order, `EN_COK_DOKUNUS` unchanged, `tavan` without porsiyon, `suphe` unchanged, `Ozet.misafir`: Tasks 1, 3, 5. §9 code impact: file structure above; `SahneSofra` replaced by `SahneMisafir`, `Seritler*` by four strips, `surukle.ts`, `rehber.ts`, dictionary keys. §10 verification: unit tests, bot gate, Playwright taps and drags at 390 and 1440, keyboard, reduced motion, axe, overflow and 44 px at 320/390/1440 plus the two short Safari viewports, frame p95 under CPU 4x: Tasks 10-15. §13 rulings (no-op `birak` on a skewer, `Ozet.bahsis`, `suphe` without the ratio rule, çırak bot, staging): Tasks 2, 1, 4, 4, 10/14. §11 out of scope respected. §12 open questions resolved per the spec's own recommendations (two bowls, 8 s fade, hand and balloon only, faceless silhouettes, porsiyon gone). Sade spec: guided principle, nickname (Task 13), score never negative (property test, Task 3), ayran out.

**Placeholder scan.** Values captured from a run: golden records (Task 4), `tavan` golden (Task 5), tuning numbers after the bot loop (Task 4), the measured sizes, fold and frame times (Tasks 14, 15), each with the command that prints them. `/* printed object */` in Task 4 is the paste point, not a placeholder.

**Type consistency.** `Elde.sis` carries `yuva`; `eldeKaynagi` (Task 7), `SeritOcak` (Task 9), `tepkiler` and `ciz` (Task 10) read it. `tutuldu.el`, `copeGitti.el`, `birakildi.el` are `NonNullable<Elde>` everywhere. `Goruntu.el` is the copied `Elde`; `SeritOcak`/`SeritTabak` read `goruntu.el`. `useOyunDongusu` options `durdur`/`izle` and `oyunu()` are defined in Task 10 and consumed in Task 11. `useOyunAlani`'s signature is `{ kok, tohum, rehberli, metin, ad, bitince }` from Task 11 on (Task 10 without `rehberli`); `dokun` returns `boolean` from Task 10 (always true) and Task 11 returns the guide's verdict, which Task 14's `birakisiBitir` reads. `tabagaKondu` carries `el` (Task 1) for the flight in Task 10. `Rehber` takes `el` in Task 11 and swaps it for `azalt` in Task 14. `Ozet` has six fields in `tipler.ts`, `yeniOyun`, `mariaDepo`, `depoSozlesmesi`, `isler.test`, `ad.mjs`. `Bitis` is `'gece' | 'ucMisafir'` in `tipler.ts`, `sema.sql`, `motor.ts`, `SonucEkrani`. `rehberGorulduMu`/`rehberGoruldu` replace the old pair in `defter.ts` (Task 8), `useOyunAkisi` (Task 10), `useRehber` (Task 11), and the storage key read by every headless script is `bozo-oyun-rehber-goruldu`.

**Review Focus.** Five lines above, each pinned: Task 2 (`tabak_dorduncudenSonrakiBirakis_eldeKalir`), Task 3 (`para_ayniYereIkinciPara_…`, `misafir_bosYaDaOdemisYereTabak_geriDoner`), Task 7 (`surukle_ikinciParmak_yokSayilir`, `surukle_iptal_birakVerir`, `surukle_yanlisTurHedef_eldeKalir`), Task 8 and Tasks 11/14 (`rehber_tabakAdiminda_birakReddedilir_adimTekrarEder`, the refused Esc in `rehber.mjs`, the refused drop in `rehber-surukle.mjs`).

## Execution

Plan complete and saved to `docs/plans/2026-10-09-oyun-tabak-plani.md`. Recommended execution: **subagent-driven**, because the fifteen tasks hand interfaces across a red window (Tasks 1-10) where a drifted name in one task breaks the next, and a fresh reviewer per task catches that before it compounds; the engine and gesture tasks are small enough for fresh contexts, and a shipped mistake here is a game the owner cannot play on his phone.
