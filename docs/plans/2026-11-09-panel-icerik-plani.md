# Panel: fotoğraflar, saatler ve site yayını Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sahibi panelden fotoğraf yükleyip yuvalara atasın, çalışma saatlerini değiştirsin ve "Siteyi güncelle" ile siteyi geliştiriciye muhtaç olmadan yeniden yayınlasın.

**Architecture:** Sürümlü `MenuBelgesi`'ne iki bölüm eklenir (`fotograflar`, `saatler`); sürüm, geri alma ve 409 aynen çalışır. Skor sunucusu iki yeni yönetim ucu alır: WebP yükleme (`/yonetim/foto`) ve derleme isteği/durumu (`/yonetim/derleme`). Derlemeyi arc'ta ayrı bir kullanıcıyla çalışan systemd birimleri yapar; web süreci yalnız bir istek dosyası yazar.

**Tech Stack:** Next.js 16 statik dışa aktarım, TypeScript strict, CSS Modules, `node:test`, Node 24 `node:http`, MariaDB, nginx, systemd, bash. Yeni bağımlılık yok.

**Spec:** `docs/specs/2026-11-09-panel-icerik-design.md` (önceki: `docs/specs/2026-10-26-panel-genisletme-design.md`).

## Global Constraints

- Proje kuralları: `CLAUDE.md` (kök), `content/CLAUDE.md`, `sunucu/CLAUDE.md`. Fonksiyon <= 50 satır, dosya <= ~700, satır <= 120, `any` yok, yorumlar bir iki satır.
- `lib/`, `content/`, `sunucu/` bağıl `.ts` importu kullanır (`@/` yok); bileşenler ve `app/` `@/*`.
- Metinlerde uzun/orta tire (U+2014, U+2013) yok, Türkçede şapkalı harf yok. Panel yalnız Türkçe, metinleri `content/yonetim.ts`'te.
- Yeni renk yok, köşe yarıçapı 0-3px, dokunma hedefi >= 44px, her alanın `label`'ı var. Panel mobil önce (390px).
- Commit: İngilizce, emir kipi, ilk satır < 72 karakter, **hiçbir imza/Co-Authored-By satırı yok**. Yalnız açık yolları `git add` et; **`git commit -a` yasak** (çalışma ağacında ilgisiz değişiklikler var).
- Test: `npm test 2>&1 | grep -E "ℹ (pass|fail)"`; typecheck: `npm run typecheck`. `npm run build` sandbox dışında (Google Fonts).
- Eski belgeler (sürüm 1-6, yeni bölümsüz) geçerli kalır: `menuBelgesiTamamla` eksik `fotograflar`/`saatler`'i seed'den tamamlar.
- Saat sınırları (doğrulayıcı): `kapanis` 2..8, `acilis` 6..18, `acilis > kapanis`, ikisi de tam sayı.
- Foto sınırları: dosya adı `^[0-9a-f]{16}\.webp$`; odak `null` ya da `^(100|[1-9]?\d)% (100|[1-9]?\d)%$`; anahtar yalnız `FotoId`; gövde <= 3 MB; uzun kenar <= 2000 px.
- Fotoğraf adresi: `${NEXT_PUBLIC_OYUN_API ?? 'https://api.cigercibozo.com'}/foto/<dosya>`.
- Oyun saatleri (`lib/oyun/`, `sunucu/donem.ts`) değişmez: dönem 05:00'te döner, bu sabit oyunun.

## Review Focus

1. Saat değişince bir sayfada eski saat kalması: hiçbir oyun dışı sözlük metninde çıplak `10:00`/`05:00` yok; `out/` içinde yeni saatle derlemede eski saat aranır (Task 3, 11).
2. Türkçe ek uyumu yanlış: `13:00'den` değil `13:00'ten`, `06:00'e` değil `06:00'ya`; Task 2'deki 24 saatlik tablo (Task 2).
3. Bozuk ya da sahte dosya yükleme (JPEG'i `.webp` diye, 3 MB üstü, 2001 px, boş gövde): sunucu reddeder, diske yazmaz (Task 6).
4. Eski sürüme geri alma, artık kullanılmayan bir fotoğrafa işaret eder: dosya silinmediği için açılır (Task 6, 8).
5. Derleme sürerken ikinci "Siteyi güncelle": iki derleme koşmaz, istek birleşir; çıktıda `favicon.svg`, `sosyal-kart.jpg` ya da `marka/rozet.svg` yoksa yükleme yapılmaz (Task 7, 10).

---

### Task 1: Belge şeması: `saatler` ve `fotograflar`

**Files:**
- Modify: `lib/menu/tipler.ts`, `lib/menu/dogrulama.ts`, `lib/menu/tamamla.ts`, `content/menu.varsayilan.json`, `lib/menu/varsayilan.test.ts`, `content/icerik.test.ts`
- Test: `lib/menu/dogrulama.test.ts`, `lib/menu/belgeYukle.test.ts`

**Interfaces:**
- Produces: `type Saatler = { acilis: number; kapanis: number }`, `type FotoAtamasi = { dosya: string; odak: string | null }`, `MenuBelgesi.saatler: Saatler`, `MenuBelgesi.fotograflar: Partial<Record<FotoId, FotoAtamasi>>`; `Tamamlayici` artık `duyuru | ikramlar | iletisim | saatler | fotograflar`.

- [ ] **Step 1: Failing tests** in `dogrulama.test.ts`: `saatler_gecerliPencere_kabulEdilir` (`{acilis:10,kapanis:5}`), `saatler_kapanisGeceYarisindanOnce_reddedilir` (`kapanis:1` ve `kapanis:0`), `saatler_kapanis9_reddedilir`, `saatler_acilis19_reddedilir`, `saatler_kesirli_reddedilir` (`10.5`), `fotograflar_bilinmeyenAnahtar_reddedilir` (`{'yok': ...}`), `fotograflar_dosyaAdiBicimi_denetlenir` (`'../x.webp'`, `'ABCDEF0123456789.webp'` red; `'0123456789abcdef.webp'` kabul), `fotograflar_odak_nullYaDaYuzdeCifti` (`'50% 70%'` kabul, `'50%'`, `'101% 0%'`, `'url(x)'` red). `belgeYukle.test.ts`: `tamamla_eskiBelge_saatlerVeFotograflariTohumdanAlir`.
- [ ] **Step 2:** Run `node --test lib/menu/dogrulama.test.ts lib/menu/belgeYukle.test.ts`, expect FAIL.
- [ ] **Step 3:** Implement: types; `saatler(c, girdi)` and `fotograflar(c, girdi)` validators in the existing `Ctx`/`Sorun` style (Türkçe hata metinleri, yol `saatler.acilis` / `fotograflar.<id>.dosya`); add both keys to `menuBelgesiDogrula`'s required list; add to `BOLUMLER` in `tamamla.ts`. Seed: `"saatler": {"acilis": 10, "kapanis": 5}`, `"fotograflar": {}`.
- [ ] **Step 4:** Run full `npm test` and `npm run typecheck`; expect PASS (fix expectation tables in `varsayilan.test.ts`/`icerik.test.ts` the seed change breaks).
- [ ] **Step 5: Commit** `Add hours and photo sections to the menu document`.

### Task 2: Saat çekirdeği ve Türkçe ekler

**Files:**
- Modify: `lib/saat.ts`, `lib/saat.test.ts`, `sunucu/donem.ts`, `lib/jsonld.ts`, `lib/jsonld.test.ts`
- Create: `lib/saatMetni.ts`, `lib/saatMetni.test.ts`

**Interfaces:**
- Consumes: `Saatler` (Task 1).
- Produces: `VARSAYILAN_SAATLER: Saatler` (`{acilis:10,kapanis:5}`); `durumHesapla(simdi: Date, saatler?: Saatler): Durum` and every exported `lib/saat.ts` function gains a trailing optional `saatler = VARSAYILAN_SAATLER`; `saatYaz(saat: number): string` (`5` → `'05:00'`); `saatEki(saat: number, ek: 'de' | 'den' | 'e'): string` (`'10:00\'da'`); `saatleriDoldur(metin: string, saatler: Saatler): string`.
- `sunucu/donem.ts` imports a new `OYUN_DONEM_SAATI = 5` from `lib/oyun/ayar.ts` instead of `KAPANIS_SAATI`.

- [ ] **Step 1: Failing tests** `saatMetni.test.ts`: `saatEki_tumSaatler_tabloyaUyar` checks all 24 hours for the three suffixes against this table of the hour's spoken last word (bulunma / ayrılma / yönelme): 0 sıfır `'da'/'dan'/'a'`, 1 bir `de/den/e`, 2 iki `de/den/ye`, 3 üç `te/ten/e`, 4 dört `te/ten/e`, 5 beş `te/ten/e`, 6 altı `da/dan/ya`, 7 yedi `de/den/ye`, 8 sekiz `de/den/e`, 9 dokuz `da/dan/a`, 10 on `da/dan/a`, 11-19 follow their last digit's word (11 bir, 12 iki, ... 19 dokuz), 20 yirmi `de/den/ye`, 21-23 follow 1-3. Format: `` `${saatYaz(s)}'${ek}` ``. `saatleriDoldur_yerTutucular`: `'{acilis}'`, `'{kapanis}'`, `'{acilis-de}'`, `'{acilis-den}'`, `'{acilis-e}'` and same for kapanis; `"Her gün {acilis-den} ertesi sabah {kapanis-e} kadar"` with `{acilis:10,kapanis:5}` → `"Her gün 10:00'dan ertesi sabah 05:00'e kadar"`; unknown `{x}` left as is. `saat.test.ts`: `durumHesapla_ozelSaatler_pencereyiKullanir` (`{acilis:12,kapanis:3}`: 11:30 kapalı, 02:59 açık, 03:00 kapalı); existing tests unchanged (default).
- [ ] **Step 2:** Run, expect FAIL.
- [ ] **Step 3:** Implement. `PENCERE_SAATI` becomes computed from `saatler`. `jsonld.ts` `restaurantJsonLd(...)` reads `saatler` from its belge/isletme input (follow how it reads `isletme` today: add an optional `saatler: Saatler = VARSAYILAN_SAATLER` parameter).
- [ ] **Step 4:** `npm test`, `npm run typecheck`, expect PASS.
- [ ] **Step 5: Commit** `Make opening hours a parameter and add Turkish hour suffixes`.

### Task 3: Sözlük saatleri belgeden

**Files:**
- Modify: `content/tr/{ortak,ana,hikaye,konum}.ts`, `content/en/{ortak,ana,hikaye,konum}.ts`, `content/index.ts`, `next.config.ts`, `lib/menu/iletisimEnv.ts` (or new `lib/menu/saatEnv.ts`), `lib/llmsTxt.ts`, the timeline consumer of `cizelgeSaatleri` (`components/saat/VardiyaCizelgesi.tsx` or wherever `grep cizelgeSaatleri` points), `content/icerik.test.ts`
- Create: `lib/cizelge.ts`, `lib/cizelge.test.ts`

**Interfaces:**
- Consumes: `saatleriDoldur`, `saatYaz` (Task 2); `MenuBelgesi.saatler` (Task 1).
- Produces: build-time env `NEXT_PUBLIC_SAATLER` (JSON `{"acilis":10,"kapanis":5}`, set in `menuEnv()` next to `NEXT_PUBLIC_ILETISIM`); `derlenmisSaatler(): Saatler` (parses the env with validation, falls back to `VARSAYILAN_SAATLER` with `console.warn`); `sozluk(dil)` returns the dictionary with every string passed through `saatleriDoldur(_, derlenmisSaatler())` (deep map, arrays included; `tr`/`en` named exports filled the same way); `cizelgeSaatleri(saatler: Saatler): string[]` (7 entries).

- [ ] **Step 1: Failing tests.** `icerik.test.ts`: `sozluk_ham_oyunDisiMetinlerdeCiplakSaatYok` walks raw `content/tr` and `content/en` dictionaries (not `oyun.ts`, not `yonetim.ts`) and asserts no string matches `/\b(10|05):00\b/`; `sozluk_dolu_varsayilanSaatlerleBugunkuMetniVerir` asserts `sozluk('tr').ortak.satirlar.saatlerUzun === "Her gün 10:00'dan ertesi sabah 05:00'e kadar"` and `ana.ocakSoner === "Ocak 05:00'te söner."` and the EN `saatlerGunluk === 'Every day 10:00 - 05:00'`. `cizelge.test.ts`: `{10,5}` → `['10:00','13:00','16:00','19:00','22:00','01:00','04:00']` (today's array); `{12,4}` → first `'12:00'`, last `'03:00'`, 7 entries, monotonic across midnight, each rounded to whole hour.
- [ ] **Step 2:** Run, expect FAIL.
- [ ] **Step 3:** Replace every hard-coded opening/closing hour in the eight dictionary files with the placeholders (Turkish suffixed forms where a suffix follows). Leave `'Gece vardiyası 21:00\'den sonra'` and `21:00` as they are. Replace the static `cizelgeSaatleri` array with `cizelgeSaatleri(saatler)` at its consumer. `llmsTxt.ts` uses the filled dictionary or `saatYaz`.
- [ ] **Step 4:** `npm test`, `npm run typecheck`; then (outside sandbox) `npm run build` and `grep -rl "{acilis\|{kapanis" out` returns nothing.
- [ ] **Step 5: Commit** `Fill opening hours in the copy from the menu document`.

### Task 4: Canlı durum rozeti

**Files:**
- Modify: `components/saat/useGirneSaati.ts` and the badge components that render `kapali`/`kapaliAlt` (`DurumCipi.tsx`, `CanliSaat.tsx`; follow `grep -rn "kapaliAlt\|\.kapali\b" components`)
- Create: `lib/menu/canliSaatler.ts`, `lib/menu/canliSaatler.test.ts`

**Interfaces:**
- Consumes: `canliMenuGetir` (`lib/menu/canli.ts`, shared single-flight with the announcement bar), `derlenmisSaatler()` (Task 3), `durumHesapla(simdi, saatler)` (Task 2), `saatleriDoldur`.
- Produces: `canliSaatleriSec(belge: unknown, derlenmis: Saatler): Saatler` (validated `saatler` from the live document, otherwise `derlenmis`); the hook starts with `derlenmisSaatler()` and switches to live hours after the first fetch; badge strings are kept in raw placeholder form (expose raw `kapali`/`kapaliAlt` alongside the filled dictionary, e.g. `sozlukHam(dil)`) and filled on the client with the current hours.

- [ ] **Step 1: Failing test** `canliSaatleriSec_gecersizCanli_derlenmisiDondurur`, `canliSaatleriSec_gecerliCanli_onuDondurur`.
- [ ] **Step 2:** Run, expect FAIL.
- [ ] **Step 3:** Implement; one fetch per page (reuse the shared promise), no new interval.
- [ ] **Step 4:** `npm test`, `npm run typecheck`, expect PASS. In `npm run dev` with a stubbed live response (`{acilis:12,kapanis:3}`) the badge at 11:00 Girne time says "Şu an kapalıyız, 12:00'de açılıyoruz" (verify by screenshot at 390px).
- [ ] **Step 5: Commit** `Read the live hours for the open status badge`.

### Task 5: Sitede belgeden fotoğraf

**Files:**
- Create: `lib/fotoKaynagi.ts`, `lib/fotoKaynagi.test.ts`
- Modify: `components/ui/FotoYuvasi.tsx`, `content/fotograflar.ts` (comment only), the privacy pages' copy (`content/tr/gizlilik.ts`, `content/en/gizlilik.ts`: one sentence that photos load from `api.cigercibozo.com`, our own server)

**Interfaces:**
- Consumes: `MenuBelgesi.fotograflar` (Task 1), `menuBelgesiYukle()` (build time, server component).
- Produces: `fotoKaynagi(id: FotoId, belge: Pick<MenuBelgesi, 'fotograflar'>, apiKok: string): { src: string; odak: string | null } | null` (belge atamasi → `${apiKok}/foto/${dosya}` + its `odak`; else `content/fotograflar.ts` `dosya` with `odak: null`; else `null`). `FotoYuvasi` uses it; a non-null `odak` from the document overrides the `odak` prop, otherwise the prop stays.

- [ ] **Step 1: Failing tests** for the three branches and the override rule (`odak` prop `'50% 70%'`, belge `odak: '20% 20%'` → `'20% 20%'`; belge `odak: null` → prop).
- [ ] **Step 2:** Run, expect FAIL.
- [ ] **Step 3:** Implement; `alt` unchanged (`etiket`/`etiketEn`).
- [ ] **Step 4:** `npm test`, `npm run typecheck`; build and confirm `out/index.html` still references `/foto/tane-yakin-cekim.webp` with the seed.
- [ ] **Step 5: Commit** `Render photo slots from the menu document`.

### Task 6: Sunucu: `POST /yonetim/foto`

**Files:**
- Create: `sunucu/foto.ts`, `sunucu/foto.test.ts`
- Modify: `sunucu/http.ts` (raw body reader), `sunucu/uygulama.ts` (route), `sunucu/ana.ts` (env `FOTO_DIZINI`), `lib/menu/aktarim.ts`

**Interfaces:**
- Produces: `hamGovdeOku(req, sinir: number): Promise<Buffer>` (413 `govdeBuyuk` over limit) and `Istek.hamGovde(sinir: number): Promise<Buffer>`; `FOTO_GOVDE_SINIRI = 3 * 1024 * 1024`; `webpBoyutu(veri: Buffer): { en: number; boy: number } | null` (reads VP8/VP8L/VP8X headers; null if not `RIFF....WEBP`); `yonetimFotoYukle(b: Baglam, istek: Istek): Promise<Yanit>`; `Baglam.fotoDizini: string | null` (null → 503 `fotoKapali`); response type `FotoYukleYaniti = { dosya: string; en: number; boy: number }` in `aktarim.ts`.

- [ ] **Step 1: Failing tests** (`bellekDepo`, temp dir): valid tiny WebP (build fixtures as byte arrays for VP8, VP8L, VP8X) → 200, file `<sha256[0..16]>.webp` exists with identical bytes; same bytes twice → same name, one file; JPEG bytes → 415 `webpDegil`, nothing written; 2001 px wide → 422 `fotoBuyuk`; empty body → 400; over 3 MB → 413; no auth → 401; `Content-Type` not `image/webp` → 415. Write atomically (temp file + rename).
- [ ] **Step 2:** Run `node --test sunucu/foto.test.ts`, expect FAIL.
- [ ] **Step 3:** Implement; route `{ yontem: 'POST', desen: /^\/yonetim\/foto$/ }` behind `yonetimDenetle`; never deletes files.
- [ ] **Step 4:** `npm test`, `npm run typecheck`, expect PASS.
- [ ] **Step 5: Commit** `Accept WebP photo uploads on the score server`.

### Task 7: Sunucu: `/yonetim/derleme`

**Files:**
- Create: `sunucu/derleme.ts`, `sunucu/derleme.test.ts`
- Modify: `sunucu/uygulama.ts`, `sunucu/ana.ts` (env `DERLEME_DIZINI`), `lib/menu/aktarim.ts`

**Interfaces:**
- Produces: `POST /yonetim/derleme` writes `<DERLEME_DIZINI>/istek` (content: ISO time) and answers `202 { durum: DerlemeDurumu }`; `GET /yonetim/derleme` answers `200 { durum: DerlemeDurumu }`. `type DerlemeDurumu = { asama: 'bos' | 'sirada' | 'derleniyor' | 'yayinda' | 'hata'; surum: number | null; zaman: string | null; gunluk: string[] }` read from `<DERLEME_DIZINI>/durum.json` (written by Task 10's scripts; missing/bozuk → `{asama:'bos',...}`); if `istek` exists and `durum.asama` is not `derleniyor`, report `sirada`. `gunluk` capped at 200 lines. `DERLEME_DIZINI` unset → 503 `derlemeKapali`.

- [ ] **Step 1: Failing tests:** POST creates `istek`; second POST while `istek` exists keeps one file (merge); GET with no files → `bos`; GET with `durum.json` `{asama:'derleniyor'}` and `istek` present → `derleniyor`; malformed `durum.json` → `bos` and a `console.warn`; no auth → 401.
- [ ] **Step 2:** Run, expect FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** `npm test`, `npm run typecheck`.
- [ ] **Step 5: Commit** `Add the site rebuild request and status endpoints`.

### Task 8: Panel: Fotoğraflar sekmesi

**Files:**
- Create: `components/yonetim/FotoFormu.tsx`, `components/yonetim/FotoFormu.module.css`, `lib/yonetim/fotoHazirla.ts`, `lib/yonetim/fotoHazirla.test.ts`, `lib/yonetim/fotoYerleri.ts`
- Modify: `components/yonetim/MenuYonetimi.tsx` (tab), `lib/menu/panel.ts` (`Sekme`, error-tab mapping), `lib/menu/fark.ts` (+test), `lib/menu/duzenleme.ts` (+test), `content/yonetim.ts`

**Interfaces:**
- Consumes: `FotoYukleYaniti` (Task 6), `fotoKaynagi` (Task 5), panel auth helpers already used by the menu calls.
- Produces: `hedefBoyut(en: number, boy: number, enUzun = 2000): { en: number; boy: number }` (keeps ratio, never upscales); `webpHazirla(dosya: File): Promise<Blob>` (createImageBitmap → canvas → `toBlob('image/webp', 0.82)`; throws a Turkish error if the browser cannot decode, e.g. HEIC on desktop Chrome); `fotoYerleri: Record<FotoId, string>` (Turkish "where used" labels, e.g. `dalak: 'Menü · Dalak kartı'`; derive from `grep -rn "FotoYuvasi" components` call sites); duzenleme ops `fotoAta(belge, id, atama)`, `fotoKaldir(belge, id)`, `fotoOdakAyarla(belge, id, odak)`; fark lines `Fotoğraf · <etiket>: yeni kare / kaldırıldı / odak`.

- [ ] **Step 1: Failing tests:** `hedefBoyut(4000,3000)` → `{2000,1500}`; `(1200,1600)` → unchanged; `(3000,3000)` → `{2000,2000}`; duzenleme ops are immutable and validate; fark reports the three change kinds; `fotoYerleri` has an entry for every `FotoId`.
- [ ] **Step 2:** Run, expect FAIL.
- [ ] **Step 3:** Implement the tab: list of 17 slots (thumbnail or empty plate, label, where used), "Fotoğraf yükle / Değiştir" (file input `accept="image/*"`, works with the phone camera), progress and error states, "Kaldır", focus picker (tap on the preview sets `odak` as rounded percentages; preview crop uses the slot's first placement ratio). Upload stores the file; assignment edits the draft; publishing is the existing "Yayınla" flow. Copy in `content/yonetim.ts`, including "Fotoğraflar sitede 'Siteyi güncelle' ile görünür."
- [ ] **Step 4:** `npm test`, `npm run typecheck`; local run (`GIZLI_TUZ=x KOKEN=http://localhost:3000 FOTO_DIZINI=$TMPDIR/foto node sunucu/ana.ts` + `npm run dev`): upload a JPEG from disk, assign, publish; screenshot the tab at 390px.
- [ ] **Step 5: Commit** `Add the photos tab to the staff panel`.

### Task 9: Panel: Saatler ve "Siteyi güncelle"

**Files:**
- Create: `components/yonetim/SaatFormu.tsx` (+`.module.css`), `components/yonetim/SiteGuncelle.tsx` (+`.module.css`)
- Modify: `components/yonetim/MenuYonetimi.tsx` or `SiteDurumu.tsx`, `lib/menu/panel.ts`, `lib/menu/fark.ts` (+test), `lib/menu/duzenleme.ts` (+test), `content/yonetim.ts`

**Interfaces:**
- Consumes: `DerlemeDurumu` and both `/yonetim/derleme` endpoints (Task 7); existing "site version" indicator (`NEXT_PUBLIC_MENU_SURUMU` vs latest published).
- Produces: `statikDegisiklikVarMi(onceki: MenuBelgesi, sonraki: MenuBelgesi): boolean` (true when `iletisim`, `saatler`, `fotograflar`, item names/descriptions or treat counts differ; used for the "Siteyi güncellemeyi unutmayın" note after publish).

- [ ] **Step 1: Failing tests:** `statikDegisiklikVarMi` true for hours/photo/contact change, false for a price-only or sold-out-only change; fark line `Saatler: 10:00 - 05:00 → 12:00 - 04:00`.
- [ ] **Step 2:** Run, expect FAIL.
- [ ] **Step 3:** Implement: hour selects limited to the valid ranges with a one-line reason; "Siteyi güncelle" button disabled when the built version equals the latest published and no request is pending; polls `GET /yonetim/derleme` every 5 s while `sirada`/`derleniyor`, shows the stage, last time and, on `hata`, the last 20 log lines behind a "Ayrıntılar" toggle.
- [ ] **Step 4:** `npm test`, `npm run typecheck`; local run with `DERLEME_DIZINI=$TMPDIR/derleme`: press the button, `istek` appears; write a `durum.json` by hand, panel follows; screenshot at 390px.
- [ ] **Step 5: Commit** `Add hours and the site rebuild button to the panel`.

### Task 10: arc derleme betikleri ve birimleri

**Files:**
- Create: `sunucu/derleme/derle.sh`, `sunucu/derleme/yukle.sh`, `sunucu/derleme/bozo-derleme.service`, `sunucu/derleme/bozo-derleme.path`, `sunucu/derleme/bozo-yukle.service`, `sunucu/derleme/derleme.test.ts`
- Modify: `docs/surec/SUNUCU-CANLIYA-ALMA.md` (new section: user, clone, deploy key, units, nginx `location /foto/` and `client_max_body_size 4m` for `/yonetim/foto`, `FOTO_DIZINI`/`DERLEME_DIZINI` for `bozo-oyun`, group permissions)

**Interfaces:**
- Consumes: `DerlemeDurumu` file format (Task 7).
- Produces: `derle.sh` (runs as `bozo-derleme`, env `DERLEME_DIZINI`, `DEPO=/var/lib/bozo-derleme/depo`, `CIKTI=/var/lib/bozo-derleme/cikti`): `flock` single instance; moves `istek` aside first (requests arriving during the build trigger the next run); writes `durum.json` `derleniyor` → runs `git pull --ff-only`, `npm ci` when `package-lock.json` changed, `npm run build`; fails on `CANLI MENU ALINAMADI`; copies `out/` to `CIKTI`; exits non-zero on any failure with `hata` + last 200 log lines. `yukle.sh` (root, `OnSuccess=` of the build unit, no arguments, fixed paths): refuses unless `CIKTI/favicon.svg`, `CIKTI/sosyal-kart.jpg`, `CIKTI/marka/rozet.svg`, `CIKTI/index.html` exist; then `rsync -a --delete` to httpdocs, the two `chown`s and `chmod 750` from `scripts/yayinla.sh`, `plesk repair fs cigercibozo.com -n` must print `Error messages: 0`; writes `yayinda` + `surum` (from `CIKTI`'s `menu.canli.meta.json` copy) or `hata`. The `.path` unit watches `<DERLEME_DIZINI>/istek`.

- [ ] **Step 1: Failing test** `derleme.test.ts` runs `yukle.sh` with env overrides for its paths in test mode (`YUKLE_KURU=1`: skip rsync/chown/plesk, only the guard and status write) against a temp `CIKTI` missing `favicon.svg` → exit 1 and `durum.json` `hata`; complete `CIKTI` → exit 0 and `yayinda`. Also `bash -n` on both scripts.
- [ ] **Step 2:** Run, expect FAIL.
- [ ] **Step 3:** Implement scripts and units (`ProtectSystem=strict`, `ReadWritePaths=` limited to the two dirs for the build unit; `NoNewPrivileges=yes`). Runbook section with exact commands.
- [ ] **Step 4:** `npm test`, `bash -n sunucu/derleme/*.sh`, `systemd-analyze verify` if available (skip on macOS, say so).
- [ ] **Step 5: Commit** `Add the arc build and upload units for panel rebuilds`.

### Task 11: Göç, belgeler ve uçtan uca

**Files:**
- Modify: `README.md` (Publishing table: photos, hours, "Siteyi güncelle"), root `CLAUDE.md` (one line on the two new sections and the build units), `content/CLAUDE.md` (hours placeholders rule), `sunucu/CLAUDE.md` (two endpoints, env vars), `docs/surec/IYILESTIRMELER.md`, `docs/surec/DEVAM.md`
- Create: `scripts/fotoGoc.ts` (one-off: uploads `public/foto/tane-yakin-cekim.webp` to `/yonetim/foto` with a Bearer token from env `BOZO_YONETIM_ANAHTAR` and prints the `dosya` to put into the document for `tane-yakin-cekim` and `tane-yakin-cekim-yatay`; the document change itself is made in the panel)

- [ ] **Step 1:** End to end locally: server with `FOTO_DIZINI` and `DERLEME_DIZINI`, `npm run dev`; upload and assign a photo, change hours to 12/4, publish; then build with that document as `content/menu.canli.json` and check: `grep -rlE "10:00|05:00" out --include=*.html` lists only game pages, the photo URL appears in the slot's page, JSON-LD has `opens 12:00`, `closes 04:00`.
- [ ] **Step 2:** Update the docs listed above.
- [ ] **Step 3:** `npm test`, `npm run typecheck`, expect PASS.
- [ ] **Step 4: Commit** `Document the panel photos, hours and rebuild flow`.

Rollout (not part of the tasks; done by the lead with the owner's approval, in this order): GitHub deploy key; nginx and `bozo-oyun` env + server deploy; build user, clone, units; site deploy; photo migration through the panel.
