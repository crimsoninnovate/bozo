# Açılış oyunu · Sahne planı: boyalı illüstrasyon tasarımının koda alınması

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Plan 2'nin düz vektör sahnesini handoff'un boyalı, dokulu illüstrasyonuyla değiştirmek
(`/oyun/`, `/en/oyun/`): oyun alanı (HUD, sofra, ocak, tezgah, raf, duraklat perdesi), giriş ve
sonuç ekranları; simülasyon, sunucu, ekran akışı ve kare değerleri sözleşmesi değişmeden.

**Architecture:** Sahnenin bütün gradyan ve filtre tanımları tek bileşende (`SahneDefs`) ve
sahada bir kez bağlanır; kimlik tutarlılığını kaynak ağacında koşan bir test korur. Boyalı
parçalar üç modüle ayrılır (`SahneSofra`, `SahneOcak`, `SahneTezgah`), tane yolları ortak
(`SahneTane`); `Semboller` yalnız HUD ve durum simgelerini tutar. Şeritler `Seritler`
(sofra, ocak) ve `SeritlerTezgah` (tezgah, raf), HUD `Hud`. React yalnız yapı değişince çizer;
her karenin değerleri `ciz.ts` ile aynı CSS değişkenlerine yazılır (`--oran`, `--pisme`,
`--yanma`, `--kor-yogunluk`, `data-gorunum`, `data-sabir`, `data-evre`) ve yeni SVG katmanları
bunları CSS'ten okur: **yeni kare değişkeni yok.** Sahne katmanı handoff'un serbest sıcak
paletini literal taşır, palet rengi olan her durak token'a bağlıdır (K1); UI katmanı token.
Giriş ve sonuç cam panelden çıkar ve `--zemin` üstünde kor ışığıyla akar; katılım ve sıralama
dokunulmaz. Masaüstünde oyun 420 px dikey panel, çevresinde kor radyali ve vinyet.

**Tech Stack:** Next.js 16 App Router (statik export), React 19.2, TypeScript strict
(`noUnusedLocals`), CSS Modules + token'lar (`color-mix`, `clamp()` içinde `calc`), inline SVG
(`feTurbulence`, `feGaussianBlur`, `feDropShadow`), Web Animations API (`tepkiler.ts`, değişmez),
`motion` 14 (yalnız ekran geçişleri ve sonuç satırları), `node --test`, Playwright 1.62 +
axe-core 4.13.

**Spec:** `docs/specs/2026-10-08-oyun-sahne-birlestirme-design.md` (K1-K11 bağlayıcı), üst
belge `docs/specs/2026-10-08-oyun-design.md` (§3, §12, §13, §15; bu plan §13'ün "yalnız token,
düz çizgi" cümlesini ve §3 yerleşim ölçülerini geçersiz kılar). Handoff:
`/Users/mk/Desktop/Bozo/design_handoff_bozo_oyun/` (`README.md`, `OyunAlani.dc.html` = tahta ve
bütün `<defs>`, `Sofra Yetistir.dc.html` = giriş/oyun/sonuç 320/390/1440 ve "1d" notları:
token eşlemesi, ölçü tablosu, hareket notu). Başlangıç noktası `feat/site-kurulumu`, HEAD
`a7bddf1` (karar belgesi). Önceki planlar: plan 2 (`2026-10-08-oyun-plan-2-gorsel-dil.md`, bu
plan onun sembol ve saha katmanını değiştirir), plan 3 (`…-plan-3-sunucu.md`, dokunulmaz).

**Ön doğrulama.** Bu plandaki her dosya, plan yazılırken reponun `/tmp/bozo-oyun/sahne/repo`
kopyasında (HEAD `a7bddf1`, `node_modules` plan 3 kopyasından) yazıldı ve doğrulandı:
`npm run typecheck` temiz; `npm test` 363 test, 354 geçti, 0 kaldı, 9 atlandı (plan 3 sonunda
361/350/11: iki yeni `SahneDefs` testi, `out/` varken koşan derleme testi); `npm run build`
21 rota, `○ /oyun` ve `○ /en/oyun`. Tarayıcı (Playwright, `out/` `python3 -m http.server 8411`
ile): 390 ve 1440'ta giriş, oyun (sofra kuruldu, ciğer ocakta: `data-gorunum=pisiyor`,
`--oran .222`, `--pisme .333`, `--kor-yogunluk .250`, `body[data-odak]` açık), duraklat perdesi
ve "Oyundan Çık" ile girişe dönüş; her ekranda yatay genişlik = viewport, 44 px altı hedef yok,
axe (WCAG 2.2 AA + best-practice) 0 ihlal, konsolda yalnız sahte `/tur` ve `/tablo`'nun kesilen
istekleri. HUD satırı ölçüldü (saat 04:12, puan 16762, ×2 açık): 320'de son düğmenin sağ kenarı
246/250, 390'da 312/320, 1440'ta 374/374; ×2 telefonda duyuru satırının sağında (satır içinde
bırakılınca 390'da 362 px > 320 px alan, ölçüldü). Usta botun kaydı (`/tmp/bozo-vitrin/kayit-usta.json`)
390'da gerçek zamanda oynatıldı: 05:00'te gece tamam, 24.400, kombo ×13, son saatte `--gece`
katmanı 1, sonuçta "Yeni en iyi" rozeti; 320'de saha 781 px (700 px'lik viewport'ta kaydırır,
handoff'un 320 karesi şişi kırpıyordu, "kabul edilen sapma"). Handoff karşılaştırması için
alınan kareler `/tmp/bozo-oyun/sahne/ng/` altında (`ref-*.png` handoff'un 17 kutusu,
`390-*.png`, `1440-*.png`, `hud-*.png`); sahibinin isteğiyle kare kare karşılaştırma turu ve
K10 kare süresi ölçümü **bu planda yapılmadı**, ölçüm tarifi Task 8'de, sonuç
`IYILESTIRMELER.md`'ye uygulama turunda yazılır. Kod blokları o dosyaların birebir kopyasıdır.

## Global Constraints

- **Değişmez:** `lib/oyun/*` (simülasyon, altın kayıtlar, `gosterim`, `gorsel`), `sunucu/*`,
  `content/*` (yeni metin yok, sözlük anahtarları aynı), `useOyunAkisi` ekran akışı, rota yapısı,
  `ciz.ts` ve `odak.ts`; `tepkiler.ts`'te tek sayı değişir (son saat 1200 → 900 ms). Plan sonunda
  `git diff a7bddf1 -- lib sunucu content components/oyun/ciz.ts components/oyun/odak.ts
  components/oyun/useOyunAkisi.ts components/oyun/useOyunAlani.ts components/oyun/useOyunDongusu.ts
  components/oyun/KatilimEkrani.tsx components/oyun/SiralamaSayfasi.tsx` boş çıkar.
- **Kare değerleri sözleşmesi (K3):** yeni `data-ciz` adı ya da CSS değişkeni yok. Yeni
  katmanlar yalnız `--oran`, `--pisme`, `--yanma`, `--kor-yogunluk`, `data-gorunum`, `data-sabir`,
  `data-carpan`, `data-evre`, `data-durum` okur. Statik ray kesirleri (`--centik`, `--pencere`,
  `--kivam`, `--bant`) React'ten, plan 2'deki gibi.
- **Tek `SahneDefs` (K2):** `<defs>`, `<linearGradient>`, `<radialGradient>`, `<filter>` yalnız
  `components/oyun/SahneDefs.tsx` içinde; `SahneDefs.test.ts` başka dosyada tanım görürse ve
  karşılıksız `url(#…)` bulursa kırılır. Değerler handoff `<defs>` bloğundan birebir; `gHalka` ve
  `gEmber`'in son durağı `stop-color: var(--kor)`, köz yatağının kor elipsleri `fill: var(--kor)`.
- **Renk (K1):** sahne literalleri yalnız handoff'tan; palet rgb'si (`184,43,39`, `35,13,11`,
  `44,18,16`) hiçbir CSS modülünde literal yazılmaz (`styles/palet.test.ts`); kor ve zemin
  alfaları `color-mix(in srgb, var(--kor) 26%, transparent)` biçiminde. UI katmanı (HUD, etiket,
  düğme, perde, fiş çizgisi, ×2 ve kombo metni) token. **Yeni token yok, `styles/` değişmez.**
- **Keyframe** kullandığı `.module.css` içinde (`styles/animasyon.test.ts`); azaltılmış harekette
  CSS'i global kural keser, WAAPI ve canvas `useHareketAzaltilmisMi` okur (değişmedi). Yanıp
  sönme 3/sn'yi geçmez: çentik 500 ms alternatif (1/sn), kor noktası 1,2 s, halka nabzı kalktı
  (handoff'ta yok; kızarma 1,5 s geçiş).
- **Yerleşim (K6):** panel iç payı 12, bölümler arası 12, sofra hücresi 84/66/91, yuva 72×176,
  tekne kenarı 16/8, ray 5, köz yatağı 34, tezgah slotu 60, yayık 56, raf düğmesi 62, HUD hedefi
  44, Oyna ve Tekrar Oyna 64, perde düğmeleri 56, masaüstü panel 420. Handoff Bevan 20 saat/puan
  360 px altında 17 (beş haneli puan sığmıyor, ölçüldü).
- **Metin:** sözlükten; yeni anahtar yok. Handoff'un "Kurallar" bağlantısı ve "Paylaş" düğmesi
  **yapılmaz** (karar belgesi §1). `[TASLAK] bu hafta` yerine mevcut `siralama.buHafta`.
- Dosya ≤ ~300 satır, fonksiyon ≤ 50 satır, satır ≤ 120 karakter; yorumlar kısa; ölü kod yok:
  plan 2'nin düz sembolleri (`SofraPlakasi`, `KorHalkasi`, `Lebeni`, `Bostana`, `Yesillik`,
  `SumakliSogan`, `UrunSimgesi`, `KarisikFis`, `UrunSisi`, `YanikSis`, `OcakYatagi`, `AcikYayik`,
  `BakirMasrapa`, eski rozetler) ve `lib/sis` içe aktarımı oyundan silinir; `lib/sis.ts`
  markanın işareti için kalır (`components/ui/SisIsareti.tsx`).
- Testler: `node:test` (`SahneDefs.test.ts`); tarayıcı betikleri `/tmp/bozo-oyun/sahne/`
  altında, **repoya girmez**. `out/` `python3 -m http.server 8411 --directory <mutlak out yolu>`
  ile sunulur (8391 sahibinin, 8398/8402 plan 3'ün portu). Betikler sırayla koşar.
- Deploy yok, push yok. Commit: İngilizce, emir kipi, ilk satır < 72 karakter. **`Co-Authored-By`,
  `Claude-Session` ya da benzeri imza satırı yok** (CLAUDE.md, sahibinin 12 Ağustos kararı;
  harness varsayılanını ezer).

## Review Focus

1. **SVG kimlik çakışması.** Sahne bir kez bağlanır; ama kabuk da bir `<defs>` taşır
   (`Ikonlar.tsx`, `useId` ile Instagram gradyanı) ve `/oyun` sayfasında iki `<defs>` vardır
   (duman testinde `defs 2`). Çakışma yalnız aynı kimlikle olur; `SahneDefs.test.ts` oyun
   dizinini tarar, kabuğu taramaz. Giriş: `useId` kimlikleri `«r…»` biçimli, `g…`/`f…` ile
   çakışmaz; yeni bir sabit kimlik eklenirse test genişletilmeli.
2. **Yeni öğelerde kare yazımı.** `ciz.ts` değişmedi: `data-ciz="ocak"` yuvanın düğmesine
   yazar, şişin SVG katmanları `--pisme`/`--yanma`'yı miras alır; `data-ciz="sabir"` halkayı saran
   span'a, `data-ciz="ayran"` yayık düğmesine, `data-ciz="kor"` ocak bölümüne (`Serit ciz="kor"`),
   `data-ciz="kivilcim"` tuval sarmalına, `data-ciz="soguma"` tezgah kaleminin çubuğuna. Bir
   katman yanlış atanın altına girerse değişkeni almaz ve sessizce sabit kalır: duman testi
   dört değişkeni okur, hepsini okumaz (yayık, soğuma, halka 'az').
3. **Filtre maliyeti (K10).** `fBlur6` sabır halkasının halesinde her karede değişen
   `stroke-dashoffset` ile raster'a alınır (dört sofra × 60 Hz); `fGrain` tam ekran
   `mix-blend-mode: overlay`; `fMarble`/`fWood` statik. Orta seviye Android ölçümü yapılmadı;
   Task 8'in tarifi bağlayıcı, p95 > 17,5 ms ise K10 basamakları sırayla.
4. **Azaltılmış harekette yeni animasyonlar.** CSS: `tutus`, `yuksel`, `parla` (giriş),
   `savrul`, `belir`, `beliris`, `nabiz`, `centikYanip`, `perdeAc`, `parla` (saha); hepsini global
   kural keser ve temel stiller son hâldir. Perde azaltılmışta anında belirir (hareket notu
   "aynı" diyor; tek karelik fark kayıtlı). Geçişler (`transition`) de kesilir: kızarma, kor
   yoğunluğu, raf pasifliği anında değişir, handoff "yalnız renk/aynı" sütunuyla uyumlu.
5. **Sahne üstünde etiket kontrastı (K11).** Bölüm etiketi `--krem-56` koyu zemin üstünde
   (handoff değeri), raf adı krem gölgeli ceviz üstünde, `+150` bakır-açık tekne üstünde, duyuru
   `--krem-70` HUD paneli üstünde. axe belirsiz bıraktı (gradyan zemin); pikselden ölçüm
   `IYILESTIRMELER.md`'ye, AA altı kalan bir kademe açılır.
6. **320 px ocak yuvaları.** Dört yuva 66 px'e iner, şiş 168 px sabit; saha 781 px olup
   kaydırır (handoff 700 px'te kırpıyordu). Fiş 4+ kalemde ikinci sütuna sarar; 320'de hücre
   66 px, fiş iki sütun 42 px: sığar ama kalemler tablaklara biner, gözle bakılmalı.
7. **İngilizce metin genişliği.** `Leave Game`, `Resume`, `Play Again`, `Put This Score on the
   Board` (56 px düğmede 320'de tek satır mı?), raf adları `Liver`/`Spleen`/`Heart`, HUD `Time`/
   `Score` gizli; duman testi yalnız TR koştu, EN 320 ölçülmeli.
8. **Hayalet klonu.** `servisUcusu` tezgah kaleminin `svg`sini klonlar; yeni svg `viewBox 0 0 80 60`
   boyutsuz, `.hayalet` 72×54 verir. Kalem ayran ise maşrapa klonlanır; hedef sofra konumu aynı.

## Dosya haritası

| Dosya | Sorumluluk | Görev |
|---|---|---|
| `components/oyun/SahneDefs.tsx`, `SahneDefs.test.ts` | Bütün gradyan ve filtreler, bir kez; kimlik testi | 1 |
| `CLAUDE.md`, `docs/specs/2026-10-08-oyun-design.md` (değişir) | K1 istisnasının kaydı | 1 |
| `components/oyun/SahneTane.tsx` | Dört tane yolu, çiğ gradyan eşlemesi, `Tane`, `TaneSimgesi`, `KarisikSimgesi` | 2 |
| `components/oyun/SahneSofra.tsx` + `.module.css` | Kapalı hücre, tabla ve örtü, ikram tabakları, kor halkası, kalktı halkası; sofra yerleşimi | 2 |
| `components/oyun/SahneOcak.tsx` + `.module.css` | Dayama çentiği, 28×128 şiş (çiğ/pişmiş/kömür), köz yatağı; yuva ve ray yerleşimi | 3 |
| `components/oyun/SahneTezgah.tsx` + `.module.css` | Porselen tabak, yatay şiş, maşrapa, yayık, raf tepsisi; tezgah ve raf yerleşimi | 4 |
| `components/oyun/Semboller.tsx` + `.module.css` (değişir) | Yalnız HUD ve durum simgeleri; düz semboller silinir | 5 |
| `components/oyun/Hud.tsx` + `.module.css` | Saat rayı, saat, puan, ×2, kombo altıgeni, porsiyon rozeti, ses, duraklat, görünür duyuru | 5 |
| `components/oyun/Seritler.tsx`, `SeritlerTezgah.tsx` (değişir/yeni) | Şeritler, etiket satırı, boyalı parçaların bağlanması | 5 |
| `components/oyun/Saha.tsx` + `.module.css` (değişir) | Zemin katmanları, `SahneDefs`, tekne, perde, tepki sınıfları | 5 |
| `components/oyun/OyunSayfasi.tsx` + `.module.css` (değişir) | Cam panel yalnız katılımda; 420 px panel ve çevre ışığı | 5 |
| `components/oyun/tepkiler.ts` (değişir) | Son saat 900 ms | 5 |
| `components/oyun/OyunAcilisi.tsx` + `.module.css`, `GirisEkrani.*`, `GirisTablosu.*` (değişir) | Giriş: dört kare, 64 px Oyna, sıralama bloğu, bağlantılar, masaüstü iki sütun | 6 |
| `components/oyun/SonucEkrani.tsx` + `.module.css`, `SonucGonderim.tsx` (değişir) | Sonuç: rozet 132, Bevan 72 puan, 4 sütun özet, rozet ve kutular, 64 px Tekrar Oyna | 6 |
| `docs/surec/IYILESTIRMELER.md`, `DEVAM.md` (değişir) | "Değişen ne" listesi, ölçümler, durum | 8 |

## Handoff `DURUMLAR` → kod eşlemesi (K3)

| Handoff alanı | Kodda | Okuyan |
|---|---|---|
| `hud.ray`, `rayRenk` | `data-ciz="gece"` `--oran`; `[data-evre='4']` | `Hud.module.css` `.dolum`, `.imlec` |
| `hud.kombo`, `komboDolgu/Cizgi/Metin` | `data-ciz="kombo"` `data-carpan` | `Semboller.module.css` `.altigenDolgu`, `Hud.module.css` `.kombo` |
| `hud.carpan` (×2) | `data-evre='4'` (evre 5, `puanCarpani` 2) | `Hud.module.css` `.carpan` |
| `hud.duyuru` | `[data-duyuru]` (`duyuruYaz`) | görünür satır |
| `hud.kapida` | `goruntu.kapida` (React) | `Seritler` çip |
| `sofra.oran`, `kizarmis` | `data-ciz="sabir"` `--oran`, `data-sabir='az'` | `SahneSofra.module.css` `.hale`, `.hat` |
| `sofra.kurulu`, `kalkti`, `fis[]`, `karisik`, `odedi`, `vurgu`, `ipucu` | `data-kurulu`, `[data-kalkti]` (WAAPI), `goruntu.sofralar`, `ucanRakam`, `data-vurgu`, `data-ipucu` | plan 2 sözleşmesi |
| `ocak.pisme`, `yanik`, `cevirme`, `tamKivam`, `ray` | `--pisme`, `--yanma`, `data-cevirme`, `data-gorunum='kivam'|'centik'`, `--oran` | `SahneOcak.module.css`, `.kivam*`, `.centik` |
| `tezgah.soguma` | `data-ciz="soguma"` `--oran` | `.soguma` |
| `yayik.oran`, `hazir` | `data-ciz="ayran"` `--oran`, `data-durum='bekliyor'` | `.ayranYuzeyi`, `.yayikDolum`, `.yayik::after` |
| `raf.pasif` | `goruntu.ocak` dolu (React) | `.ceviz[data-pasif]` |
| `korYogunluk`, `sicakKozler`, `kivilcimlar` | `data-ciz="kor"` `--kor-yogunluk`; `data-ciz="kivilcim"` `--oran` (tuval) | `.tekneKoru`, `.sicak` (`--esik`), `.kivilcim` |
| `gece`, `zeminRenk` | `[data-gece]` opaklık (WAAPI), `--sahne-zemin` | `.gece`, `.kesik` |

---

### Task 1: `SahneDefs`, kimlik testi, K1 kaydı

**Files:**
- Create: `components/oyun/SahneDefs.tsx`, `components/oyun/SahneDefs.test.ts`
- Modify: `CLAUDE.md` (Colors, Architecture), `docs/specs/2026-10-08-oyun-design.md` (§13)
- Test: `node --test components/oyun/SahneDefs.test.ts`, `npm run typecheck`

**Interfaces:**
- Produces: `SahneDefs(): JSX` (0×0 SVG, `aria-hidden`, `position: absolute`); kimlikler `gCopper`,
  `gBrass`, `gSteel`, `gWood`, `gWoodFront`, `gCloth`, `gPaper`, `gHalka`, `gMarble`, `gRawCiger`,
  `gRawDalak`, `gRawYurek`, `gCooked`, `gChar`, `gFat`, `gEmber`, `gCoal`, `gYogurt`, `gPlate`,
  `gAyran`, `fBlur2`, `fBlur6`, `fGrain`, `fMarble`, `fWood`, `fShadow`.
- Consumes: hiçbir şey; `--kor` token'ı (`stop-color`).

- [ ] **Step 1: Önce test (RED)**

`components/oyun/SahneDefs.test.ts`:

```ts
// SVG kimlikleri belge çapında tektir: `SahneDefs` bir kez bağlanır, başka hiçbir
// dosya `<defs>` ya da `g…`/`f…` kimliği tanımlamaz ve her `url(#…)` başvurusunun
// karşılığı burada vardır. İkinci bir kopya kimlik çakışmasıyla gradyanı sessizce
// öteki tanıma bağlar.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIZIN = fileURLToPath(new URL('./', import.meta.url))
const KAYNAK = readFileSync(join(DIZIN, 'SahneDefs.tsx'), 'utf8')

function tanimlananlar(): string[] {
  const adlar: string[] = []
  for (const [, ad] of KAYNAK.matchAll(/\bid:\s*'([A-Za-z0-9]+)'/g)) adlar.push(ad!)
  for (const [, ad] of KAYNAK.matchAll(/\bid="([A-Za-z0-9]+)"/g)) adlar.push(ad!)
  return adlar
}

function kaynakDosyalari(): string[] {
  return readdirSync(DIZIN)
    .filter((ad) => (ad.endsWith('.tsx') || ad.endsWith('.css')) && ad !== 'SahneDefs.tsx')
    .map((ad) => join(DIZIN, ad))
}

test('sahneDefs_kimlikler_tekrarEtmez', () => {
  const adlar = tanimlananlar()
  assert.ok(adlar.length >= 20, `beklenenden az tanım: ${adlar.length}`)
  assert.deepEqual([...new Set(adlar)], adlar, 'aynı kimlik iki kez tanımlı')
})

test('sahneDefs_herBasvuru_tanimli_veBaskaDefsYok', () => {
  const tanimli = new Set(tanimlananlar())
  const eksik: string[] = []
  const yabanci: string[] = []
  for (const yol of kaynakDosyalari()) {
    const metin = readFileSync(yol, 'utf8')
    for (const [, ad] of metin.matchAll(/url\(#([A-Za-z0-9]+)\)/g)) {
      if (!tanimli.has(ad!)) eksik.push(`${yol}: ${ad}`)
    }
    if (/<defs>|<(linear|radial)Gradient|<filter\s/.test(metin)) yabanci.push(yol)
  }
  assert.deepEqual(eksik, [], 'url(#…) başvurusunun SahneDefs’te karşılığı yok')
  assert.deepEqual(yabanci, [], 'gradyan ya da filtre yalnız SahneDefs.tsx içinde tanımlanır')
})
```

Run: `node --test components/oyun/SahneDefs.test.ts`
Expected: iki test de kırılır (`SahneDefs.tsx` yok, `ENOENT`).

- [ ] **Step 2: `SahneDefs` (GREEN)**

`components/oyun/SahneDefs.tsx`:

```tsx
import type { CSSProperties } from 'react'

/*
 * Boyalı sahnenin gradyan ve filtre tanımları (handoff `OyunAlani.dc.html` <defs>, birebir).
 * Sahada BİR kez bağlanır; kimlikler belge çapında tektir (`SahneDefs.test.ts`).
 * Palet rengi olan duraklar token'a bağlı (K1): kor `--kor`.
 */

const KOR: CSSProperties = { stopColor: 'var(--kor)' }

type Durak = { o: number; r: string; a?: number }
type Gradyan = { id: string; yon?: [number, number, number, number]; duraklar: Durak[] }
type Radyal = { id: string; cx: number; cy: number; r: number; duraklar: Durak[] }

const DOGRUSAL: Gradyan[] = [
  { id: 'gCopper', duraklar: [{ o: 0, r: '#F0B27A' }, { o: 0.35, r: '#B86F3A' }, { o: 1, r: '#6E3A1C' }] },
  { id: 'gBrass', yon: [0, 0, 1, 0], duraklar: [{ o: 0, r: '#8A6A2B' }, { o: 0.5, r: '#E2C275' }, { o: 1, r: '#8A6A2B' }] },
  { id: 'gSteel', yon: [0, 0, 1, 0], duraklar: [{ o: 0, r: '#7A7F86' }, { o: 0.5, r: '#D9DEE3' }, { o: 1, r: '#6A6F76' }] },
  { id: 'gWood', duraklar: [{ o: 0, r: '#7A4A26' }, { o: 1, r: '#4A2A14' }] },
  { id: 'gWoodFront', duraklar: [{ o: 0, r: '#3E2210' }, { o: 1, r: '#24120A' }] },
  { id: 'gCloth', yon: [0, 0, 1, 1], duraklar: [{ o: 0, r: '#F7EBD5' }, { o: 1, r: '#DCC7A5' }] },
  { id: 'gPaper', duraklar: [{ o: 0, r: '#FBF3E3' }, { o: 1, r: '#E6D6B8' }] },
  { id: 'gHalka', yon: [0, 0, 1, 1], duraklar: [{ o: 0, r: '#FFB45A' }, { o: 0.5, r: '#FF6A1A' }, { o: 1, r: 'kor' }] },
  { id: 'gMarble', yon: [0, 0, 1, 1], duraklar: [{ o: 0, r: '#F1EBE0' }, { o: 0.5, r: '#D8CFC0' }, { o: 1, r: '#EDE6DA' }] },
]

const TANE_ODAK = { cx: 0.35, cy: 0.3, r: 0.9 }
const RADYAL: Radyal[] = [
  { id: 'gRawCiger', ...TANE_ODAK, duraklar: [{ o: 0, r: '#C94B4B' }, { o: 0.6, r: '#8E1B22' }, { o: 1, r: '#4E0C12' }] },
  { id: 'gRawDalak', ...TANE_ODAK, duraklar: [{ o: 0, r: '#9B5B86' }, { o: 0.6, r: '#5E2A4F' }, { o: 1, r: '#2E1226' }] },
  { id: 'gRawYurek', ...TANE_ODAK, duraklar: [{ o: 0, r: '#B8403F' }, { o: 0.6, r: '#7A1A20' }, { o: 1, r: '#3E0A0F' }] },
  { id: 'gCooked', ...TANE_ODAK, duraklar: [{ o: 0, r: '#B07040' }, { o: 0.6, r: '#6E3B20' }, { o: 1, r: '#3A1D0E' }] },
  { id: 'gChar', cx: 0.4, cy: 0.35, r: 0.9, duraklar: [{ o: 0, r: '#3A2A22' }, { o: 1, r: '#120A07' }] },
  { id: 'gFat', ...TANE_ODAK, duraklar: [{ o: 0, r: '#FFF6E6' }, { o: 1, r: '#D9C39E' }] },
  { id: 'gEmber', cx: 0.5, cy: 0.5, r: 0.5, duraklar: [{ o: 0, r: '#FFD28A' }, { o: 0.35, r: '#FF7A1A' }, { o: 1, r: 'kor', a: 0 }] },
  { id: 'gCoal', cx: 0.5, cy: 0.5, r: 0.5, duraklar: [{ o: 0, r: '#2A1A14' }, { o: 1, r: '#0E0705' }] },
  { id: 'gYogurt', cx: 0.4, cy: 0.35, r: 0.8, duraklar: [{ o: 0, r: '#FFFBF2' }, { o: 1, r: '#E8DCC4' }] },
  { id: 'gPlate', cx: 0.4, cy: 0.35, r: 0.8, duraklar: [{ o: 0, r: '#FFFFFF' }, { o: 0.8, r: '#E9E1D3' }, { o: 1, r: '#B9AE9C' }] },
  { id: 'gAyran', cx: 0.4, cy: 0.3, r: 0.8, duraklar: [{ o: 0, r: '#FFFFFF' }, { o: 1, r: '#E3E6E9' }] },
]

function Duraklar({ duraklar }: { duraklar: Durak[] }) {
  return (
    <>
      {duraklar.map((d) => (
        <stop
          key={d.o}
          offset={d.o}
          stopColor={d.r === 'kor' ? undefined : d.r}
          style={d.r === 'kor' ? KOR : undefined}
          stopOpacity={d.a}
        />
      ))}
    </>
  )
}

export function SahneDefs() {
  return (
    <svg aria-hidden="true" width={0} height={0} style={{ position: 'absolute' }}>
      <defs>
        {DOGRUSAL.map(({ id, yon = [0, 0, 0, 1], duraklar }) => (
          <linearGradient key={id} id={id} x1={yon[0]} y1={yon[1]} x2={yon[2]} y2={yon[3]}>
            <Duraklar duraklar={duraklar} />
          </linearGradient>
        ))}
        {RADYAL.map(({ id, cx, cy, r, duraklar }) => (
          <radialGradient key={id} id={id} cx={cx} cy={cy} r={r}>
            <Duraklar duraklar={duraklar} />
          </radialGradient>
        ))}
        <filter id="fBlur2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={1.6} />
        </filter>
        <filter id="fBlur6" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
        <filter id="fGrain">
          <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 .9 0 0 0 0 .8 0 0 0 .14 0" />
        </filter>
        <filter id="fMarble" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.05" numOctaves={3} seed={4} />
          <feColorMatrix values="0 0 0 0 .45 0 0 0 0 .4 0 0 0 0 .36 0 0 0 .45 -.1" />
        </filter>
        <filter id="fWood" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.02" numOctaves={2} seed={7} />
          <feColorMatrix values="0 0 0 0 .1 0 0 0 0 .05 0 0 0 0 .02 0 0 0 .5 -.15" />
        </filter>
        <filter id="fShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx={0} dy={3} stdDeviation={2.4} floodColor="#000" floodOpacity={0.55} />
        </filter>
      </defs>
    </svg>
  )
}
```

Run: `node --test components/oyun/SahneDefs.test.ts && npm run typecheck`
Expected: `ℹ pass 2`, tip denetimi temiz (bileşen henüz çağrılmıyor; `export` olduğu için
`noUnusedLocals` şikayet etmez).

- [ ] **Step 3: CLAUDE.md, K1 istisnası**

`## Colors` bölümünde "**Third-party marks are the one exception to the closed list**" maddesinin
hemen ALTINA yeni madde:

```markdown
- **The game scene is the second exception** (owner's decision, 8 October 2026; spec
  `docs/specs/2026-10-08-oyun-sahne-birlestirme-design.md` K1): the painted board under
  `components/oyun/Sahne*` (walnut, brass, steel, marble, raw and cooked meat, coal, ember
  `#FF7A1A`) carries the handoff's own warm palette as literals, with every stop that IS a
  palette colour bound to its token (`stop-color: var(--kor)`, `fill: var(--kor)`). The UI
  layer on top of it (HUD, section labels, buttons, pause curtain, ticket strike line, ×2 and
  combo text) stays on tokens, and no palette rgb is written as a literal anywhere
  (`styles/palet.test.ts`). All gradients and filters live in one `SahneDefs` bound once;
  `components/oyun/SahneDefs.test.ts` fails on a second `<defs>` or an undefined `url(#…)`.
```

`## Architecture` içinde `components/` maddesinin `oyun/` parantezi şöyle değişir:

Eski:
```markdown
  `layout/` shell, `saat/` opening hours, `ember/` decorative scene, `oyun/` the game screen
  (DOM + hand-drawn SVG, per-frame values written by a rAF loop, instant reactions in WAAPI,
  `motion` only for screen transitions). Each component is `X.tsx` next to `X.module.css`.
```
Yeni:
```markdown
  `layout/` shell, `saat/` opening hours, `ember/` decorative scene, `oyun/` the game screen
  (DOM + painted inline SVG from the handoff, `Sahne*` modules and one `SahneDefs`; per-frame
  values written by a rAF loop as CSS variables the SVG layers read, instant reactions in
  WAAPI, `motion` only for screen transitions). Each component is `X.tsx` next to `X.module.css`.
```

- [ ] **Step 4: Üst spec §13'e not**

`docs/specs/2026-10-08-oyun-design.md` §13'ün ilk paragrafından hemen ÖNCE:

```markdown
> 8 Ekim 2026: bu bölümün "yalnız marka token'ları" cümlesi ve §3'ün yerleşim ölçüleri
> `docs/specs/2026-10-08-oyun-sahne-birlestirme-design.md` (K1, K6) ile geçersiz kılındı:
> sahne katmanı handoff'un boyalı paletini taşır, UI katmanı token'da kalır.
```

- [ ] **Step 5: Commit**

```bash
git add components/oyun/SahneDefs.tsx components/oyun/SahneDefs.test.ts CLAUDE.md docs/specs/2026-10-08-oyun-design.md
git commit -m "Add the painted scene defs with an id consistency test"
```

---

### Task 2: Sofra: tane yolları, tabla, ikram tabakları, kor halkası

**Files:**
- Create: `components/oyun/SahneTane.tsx`, `components/oyun/SahneSofra.tsx`,
  `components/oyun/SahneSofra.module.css`
- Test: `npm run typecheck`, `npm test` (`SahneDefs` testi yeni `url(#…)` başvurularını denetler,
  `palet.test` literal tarar, `animasyon.test` keyframe'i)

**Interfaces:**
- Produces: `TANE`, `CIG` (`Record<Urun, string>`), `Tane({ urun, x, y, donus, dolgu, sinif })`,
  `TaneSimgesi({ urun, boy })`, `KarisikSimgesi({ boy })` (`SahneTane`); `KapaliSofra`,
  `SofraPlakasi`, `IkramTabaklari` (`[data-tabak]`×4, `tepkiler.tabaklarIner` için),
  `KorHalkasi` (`--oran`, `data-sabir`), `KalktiHalkasi` (`SahneSofra`). CSS: `.katman`, `.plaka`,
  `.tabak`, `.hale`, `.hat`, `.kesik` (sahne parçaları) ve sofra yerleşimi `.sofraIzgara`, `.sofra`,
  `.kapaliSofra`, `.halka`, `.fis`, `.kalem`, `.kalkti` (Task 5'te `Seritler` kullanır).
- Consumes: `SahneDefs` kimlikleri; `--sahne-zemin` (Task 5 `.saha` tanımlar; yoksa `--zemin`).

- [ ] **Step 1: Tane yolları**

`components/oyun/SahneTane.tsx`:

```tsx
import type { SisUrun, Urun } from '@/lib/oyun/tipler'

/*
 * Tane biçimi ürünü söyler (handoff `TANE`): ciğer kare, dalak enine oval, yürek eşkenar
 * dörtgen, ayran maşrapa. Aynı dört yol ocakta, tezgahta, fişte ve rafta; merkez 0,0.
 */

export const TANE: Record<Urun, string> = {
  ciger: 'M-6 -7h12v14h-12z',
  dalak: 'M-9 0a9 6 0 1 0 18 0a9 6 0 1 0-18 0z',
  yurek: 'M0 -8.5 8.5 0 0 8.5-8.5 0z',
  ayran: 'M-6 -8h12l-1.4 16h-9.2z',
}

export const CIG: Record<Urun, string> = {
  ciger: 'url(#gRawCiger)',
  dalak: 'url(#gRawDalak)',
  yurek: 'url(#gRawYurek)',
  ayran: 'url(#gAyran)',
}

const KONTUR = 'rgba(0,0,0,.4)'

type Props = { urun: Urun; x?: number; y?: number; donus?: number; dolgu?: string; sinif?: string }

/** Tek tane ve parlama lekesi; `dolgu` verilmezse çiğ ürün rengi. */
export function Tane({ urun, x = 0, y = 0, donus = 0, dolgu = CIG[urun], sinif }: Props) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${donus})`} className={sinif}>
      <path d={TANE[urun]} fill={dolgu} stroke={KONTUR} strokeWidth={0.8} />
      <ellipse cx={-2.5} cy={-3.5} rx={2.6} ry={1.4} fill="#fff" opacity={0.3} />
    </g>
  )
}

/** Fiş, raf ve simge boyutu: 24'lük karede tek tane. */
export function TaneSimgesi({ urun, boy = 14 }: { urun: Urun; boy?: number }) {
  return (
    <svg viewBox="-12 -12 24 24" width={boy} height={boy} aria-hidden="true">
      <path d={TANE[urun]} fill={CIG[urun]} stroke="rgba(0,0,0,.35)" strokeWidth={1} />
    </svg>
  )
}

/** Bozo Karışık: üç tane tek çubukta. */
export function KarisikSimgesi({ boy = 22 }: { boy?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={boy} height={boy} aria-hidden="true">
      <path d="M1 12h22" stroke="#6A6F76" strokeWidth={1.6} />
      <rect x={3.5} y={9} width={5} height={6} fill={CIG.ciger} />
      <ellipse cx={13} cy={12} rx={3.2} ry={2} fill={CIG.dalak} />
      <path d="M19.5 9.4 22.1 12l-2.6 2.6L16.9 12z" fill={CIG.yurek} />
    </svg>
  )
}

export type { SisUrun }
```

- [ ] **Step 2: Sofranın boyalı katmanları**

`components/oyun/SahneSofra.tsx`:

```tsx
import stil from './SahneSofra.module.css'

/*
 * Sofranın boyalı katmanları (handoff OyunAlani 86-116): ceviz tabla ve örtü, dört ikram
 * tabağı, kor halkası, kalktı halkası. Her SVG 100×100; konum ve ölçü çağıran modülde.
 */

/** Kapalı hücre: kesik kare. */
export function KapaliSofra() {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <rect x={16} y={14} width={68} height={68} fill="rgba(0,0,0,.25)" stroke="var(--cizgi-plaka)" strokeWidth={1} strokeDasharray="4 5" />
    </svg>
  )
}

/** Ceviz tabla, ön kenar, krem örtü ve çapraz dikiş. */
export function SofraPlakasi() {
  return (
    <svg viewBox="0 0 100 100" className={`${stil.katman} ${stil.plaka}`} aria-hidden="true">
      <ellipse cx={50} cy={86} rx={40} ry={7} fill="#000" opacity={0.5} filter="url(#fBlur6)" />
      <rect x={16} y={14} width={68} height={68} fill="url(#gWood)" />
      <rect x={16} y={14} width={68} height={68} filter="url(#fWood)" opacity={0.7} />
      <rect x={16} y={82} width={68} height={6} fill="url(#gWoodFront)" />
      <rect x={21} y={19} width={58} height={58} fill="url(#gCloth)" />
      <path d="M21 19 79 77M79 19 21 77" stroke="#fff" strokeWidth={0.8} opacity={0.35} />
      <rect x={21} y={19} width={58} height={58} fill="none" stroke="#B9A07A" strokeWidth={0.8} opacity={0.6} />
    </svg>
  )
}

/** Dört ikram: lebeni, bostana, yeşillik, sumaklı soğan. `data-tabak` sırayla iner (`tepkiler.ts`). */
export function IkramTabaklari() {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <g filter="url(#fShadow)">
        <g data-tabak className={stil.tabak}>
          <circle cx={30} cy={29} r={8} fill="url(#gPlate)" />
          <circle cx={30} cy={29} r={5.6} fill="url(#gYogurt)" />
          <path d="M27 28c2 1.5 4.5 1.5 6 0" stroke="#C8B48E" strokeWidth={0.9} fill="none" />
        </g>
        <g data-tabak className={stil.tabak}>
          <circle cx={70} cy={29} r={8} fill="url(#gPlate)" />
          <circle cx={70} cy={29} r={5.8} fill="#C8402E" />
          <circle cx={68} cy={27.5} r={1.6} fill="#8FBF5A" />
          <circle cx={72.5} cy={30.5} r={1.4} fill="#5E8A3A" />
          <circle cx={71.5} cy={26.6} r={1.1} fill="#F3E2C7" />
        </g>
        <g data-tabak className={stil.tabak}>
          <circle cx={30} cy={69} r={8} fill="url(#gPlate)" />
          <path d="M25 70c2-5 7-5 9-1-3-1-6 1-9 1zM27 66c3-2 6-1 7 2-3 0-5-1-7-2z" fill="#5E8A3A" />
          <path d="M26 71c3-3 6-3 8-1" stroke="#8FBF5A" strokeWidth={1} fill="none" />
        </g>
        <g data-tabak className={stil.tabak}>
          <circle cx={70} cy={69} r={8} fill="url(#gPlate)" />
          <circle cx={70} cy={69} r={5} fill="none" stroke="#B07AB8" strokeWidth={1.8} />
          <circle cx={70} cy={69} r={2.4} fill="none" stroke="#7D4B8C" strokeWidth={1.2} />
          <circle cx={67} cy={66} r={0.9} fill="#7A1F2E" />
          <circle cx={73} cy={71.5} r={0.9} fill="#7A1F2E" />
          <circle cx={72} cy={65.5} r={0.8} fill="#7A1F2E" />
        </g>
      </g>
    </svg>
  )
}

const HALKA = { cx: 50, cy: 50, r: 48, pathLength: 100, fill: 'none', transform: 'rotate(-90 50 50)' } as const

/**
 * Kor halkası: `--oran` (0-1) kadar dolu, `pathLength` 100 ile CSS'ten kısalır. Alttan üste:
 * hale (blur), köz gradyanlı ana hat, zemin renginde düzensiz kesikler, üst parıltı.
 */
export function KorHalkasi() {
  return (
    <svg viewBox="0 0 100 100" className={`${stil.katman} ${stil.halka}`} aria-hidden="true">
      <circle {...HALKA} className={stil.hale} stroke="#FF7A1A" filter="url(#fBlur6)" />
      <circle {...HALKA} className={stil.hat} stroke="url(#gHalka)" strokeWidth={3} />
      <circle cx={50} cy={50} r={48} fill="none" className={stil.kesik} strokeWidth={3.6} strokeDasharray="1.2 7 0.8 9 1.4 6 0.9 8" transform="rotate(-90 50 50)" />
      <circle {...HALKA} className={stil.hat} stroke="#FFE2A8" strokeWidth={1} opacity={0.5} />
    </svg>
  )
}

/** Kalkmış sofra: küle dönmüş kesik halka; çıkış oku `Semboller`den üstüne gelir. */
export function KalktiHalkasi() {
  return (
    <svg viewBox="0 0 100 100" className={stil.katman} aria-hidden="true">
      <circle cx={50} cy={50} r={48} fill="none" stroke="#8A8078" strokeWidth={2.6} strokeDasharray="2 5" opacity={0.6} />
    </svg>
  )
}
```

- [ ] **Step 3: Sofra CSS'i**

Handoff ölçüleri: hücre kare, 4 sütun `minmax(0,1fr)`, 10 px aralık; tabla 68/100, örtü 58/100;
halka r=48 `pathLength` 100; hale 5 px/.45, kızarınca 10 px/.85, 1,5 sn geçiş; fiş kağıdı
`#FBF3E3 → #E6D6B8`, -4°, yırtık alt kenar; vurgu `0 0 0 2px --bakir-acik` + 28 px parıltı.

`components/oyun/SahneSofra.module.css`:

```css
/* Sofranın boyalı katmanları; hepsi hücreyi doldurur, halka ve gölge dışarı taşar. */
.katman {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.plaka {
  transition: opacity var(--gecis-erit);
}

/* Tabaklar kurulunca görünür; WAAPI inişi kendi merkezinden ölçeklesin. */
.tabak {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

.sofra[data-kurulu] .tabak {
  opacity: 1;
}

/* Halka `--oran` kadar dolu: ofset kalan pay. Kızarma 1,5 sn renk ve kalınlık geçişi. */
.hale,
.hat {
  stroke-dasharray: 100;
  stroke-dashoffset: calc((1 - var(--oran, 1)) * 100);
}

.hale {
  stroke-width: 5;
  opacity: 0.45;
  transition:
    stroke-width 1.5s ease-out,
    opacity 1.5s ease-out;
}

:global([data-sabir='az']) .hale {
  stroke-width: 10;
  opacity: 0.85;
}

/* Kesikler sahnenin zemin rengiyle çizilir; son saatte `--sahne-zemin` geceye döner. */
.kesik {
  stroke: var(--sahne-zemin, var(--zemin));
  transition: stroke var(--gecis-yogunluk);
}

/* Sofra: dört kare hücre (84 px @390, 66 @320), 10 px aralık; halka hücreden taşar. */
.sofraIzgara {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.sofra,
.kapaliSofra {
  position: relative;
  aspect-ratio: 1;
  min-height: 0;
}

.sofra[data-bos] :global([data-tabak]) {
  opacity: 0;
}

.sofra[data-bos] .halka {
  display: none;
}

/* Tezgah vurgusu (gecis-hizli). */
.sofra::after {
  content: '';
  position: absolute;
  inset: -2px;
  opacity: 0;
  box-shadow:
    0 0 0 2px var(--bakir-acik),
    0 0 28px color-mix(in srgb, var(--bakir-acik) 55%, transparent);
  transition: opacity var(--gecis-hizli);
  pointer-events: none;
}

.sofra[data-vurgu]::after {
  opacity: 1;
}

.halka {
  position: absolute;
  inset: 0;
}

/* Fiş: kağıt, -4°, yırtık alt kenar; dörtten çok kalem ikinci sütuna sarar (hücre 66-91 px). */
.fis {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  gap: 3px;
  min-width: 22px;
  max-height: 58px;
  padding: 5px 6px 8px;
  transform: translate(-50%, -50%) rotate(-4deg);
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
  width: 14px;
  height: 14px;
}

.kalem[data-servis] {
  opacity: 0.45;
}

.kalem[data-servis]::after {
  content: '';
  position: absolute;
  left: -3px;
  right: -3px;
  top: 50%;
  height: 1.6px;
  background: var(--zemin);
  transform: rotate(-18deg);
}

.kalkti {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--krem-60);
  opacity: 0;
}
```

- [ ] **Step 4: Doğrula ve commit**

Run: `npm run typecheck && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail)'`
Expected: temiz; `pass` Task 1'deki sayıyla aynı (yeni test yok, `SahneDefs` testi yeni
başvuruları tanımlı bulur). Dosyalar henüz çağrılmıyor; bir sonraki görevler bağlar.

```bash
git add components/oyun/SahneTane.tsx components/oyun/SahneSofra.tsx components/oyun/SahneSofra.module.css
git commit -m "Paint the table: tray, cloth, side dishes, ember ring"
```

---

### Task 3: Ocak: şiş, dayama, köz yatağı, pişme rayı

**Files:**
- Create: `components/oyun/SahneOcak.tsx`, `components/oyun/SahneOcak.module.css`
- Test: `npm run typecheck`, `npm test`

**Interfaces:**
- Produces: `DayamaCentigi`, `KapaliYuva`, `Sis({ urun, yanik? })` (28×128, 168 px; katmanlar
  `--pisme`, `--yanma`), `KozYatagi` (400×34, sıcak közler `--kor-yogunluk` eşiğiyle), `Tane`
  (yeniden dışa aktarım). CSS: sahne parçaları `.dayama`, `.kapaliCizgi`, `.sis`, `.duman`,
  `.pismis`, `.komur`, `.yag`, `.yanik`, `.yatak`, `.kor`, `.sicak`; yuva yerleşimi `.kivilcim`,
  `.yuvalar`, `.yuva`, `.kapaliYuva`, `.sisKap`, `.sis` (sarmal), `.yanik` (hayalet), `.cevir`,
  `.kivamCerceve`, `.kivamPuan`, `.kivilcimUcu`, `.ray`, `.pencere`, `.kivam`, `.rayDolum`,
  `.centik`, `centikYanip`.
- Consumes: `SahneTane`, `SahneDefs`; `data-gorunum` (`pisiyor|centik|hazir|kivam|bos`),
  `data-cevirme` (`yok|iyi|kotu`), `--centik`/`--pencere`/`--kivam`/`--bant` (React, `Yuva`).

Karar (handoff'a bağlı, spec §3'ten sapar): çevirme çentiği **2 px çizgi** (`--centik` ortası,
-3/+3 px taşar), bant genişliği yalnız tam kıvam bandında (`--bant`); handoff çentiği böyle
çizer, spec "genişliği tam kıvam bandıyla aynı" diyordu. Kayıt Task 8.

- [ ] **Step 1: Ocağın boyalı parçaları**

`components/oyun/SahneOcak.tsx`:

```tsx
import { CIG, Tane, TANE, type SisUrun } from './SahneTane'
import stil from './SahneOcak.module.css'

/*
 * Ocağın boyalı parçaları (handoff OyunAlani 152-194): pirinç dayama çentiği, 28×128 şiş,
 * köz yatağı. Pişme ve yanma `--pisme`/`--yanma` ile CSS'ten okunur (K3); React yalnız yapı.
 */

const TANE_Y = [26, 52, 78, 104] as const
const YAG_Y = [38.5, 64.5, 90.5] as const

/** Şişin üstündeki pirinç dayama. */
export function DayamaCentigi() {
  return (
    <svg viewBox="0 0 24 10" className={stil.dayama} aria-hidden="true">
      <path d="M2 10V4a10 10 0 0 1 20 0v6" fill="url(#gBrass)" stroke="rgba(0,0,0,.5)" strokeWidth={0.8} />
    </svg>
  )
}

/** Kapalı yuva: kesik düşey çizgi. */
export function KapaliYuva() {
  return <span className={stil.kapaliCizgi} aria-hidden="true" />
}

type SisProps = { urun: SisUrun; yanik?: boolean }

/**
 * Çelik halka ve gövde, dört tane, aralarda kuyruk yağı. Tane katmanları: çiğ ürün gradyanı,
 * üstünde `--pisme` kadar pişmiş, onun üstünde `--yanma` kadar kömür. `yanik` sabit kömür.
 */
export function Sis({ urun, yanik = false }: SisProps) {
  return (
    <svg viewBox="0 0 28 128" className={`${stil.sis} ${yanik ? stil.yanik : ''}`} aria-hidden="true">
      {!yanik && (
        <path d="M14 10c-5-7 4-11-1-18c-3-5 3-9 1-14" className={stil.duman} stroke="#FFF" strokeWidth={3} fill="none" filter="url(#fBlur2)" strokeLinecap="round" />
      )}
      <ellipse cx={14} cy={126} rx={9} ry={2.4} fill="#000" opacity={0.5} filter="url(#fBlur2)" />
      <circle cx={14} cy={6} r={4} fill="none" stroke="url(#gSteel)" strokeWidth={2} />
      <path d="M12.6 10h2.8v108l-1.4 6-1.4-6z" fill="url(#gSteel)" stroke="rgba(0,0,0,.4)" strokeWidth={0.4} />
      {TANE_Y.map((y) => (
        <g key={y} transform={`translate(14 ${y})`}>
          <path d={TANE[urun]} fill={CIG[urun]} stroke="rgba(0,0,0,.4)" strokeWidth={0.8} />
          <path d={TANE[urun]} fill="url(#gCooked)" className={stil.pismis} />
          <path d={TANE[urun]} fill="url(#gChar)" className={stil.komur} />
          <ellipse cx={-2.5} cy={-3.5} rx={2.6} ry={1.4} fill="#fff" opacity={0.3} />
        </g>
      ))}
      {YAG_Y.map((y) => (
        <ellipse key={y} cx={14} cy={y} rx={4.2} ry={3.2} fill="url(#gFat)" stroke="rgba(0,0,0,.3)" strokeWidth={0.6} className={stil.yag} />
      ))}
    </svg>
  )
}

const KOZLER = [
  [20, 22, 26, 7, '#FF7A1A', 0.55], [82, 25, 30, 6, 'kor', 0.7], [150, 22, 24, 7, '#FF7A1A', 0.5],
  [212, 25, 32, 6, 'kor', 0.7], [276, 22, 26, 7, '#FF7A1A', 0.55], [340, 25, 30, 6, 'kor', 0.7],
  [392, 22, 18, 6, '#FF7A1A', 0.5],
] as const
const KOMURLER = [[42, 21, 9, 4], [118, 19, 10, 4], [184, 22, 8, 3.5], [246, 19, 10, 4], [312, 22, 9, 4], [372, 19, 8, 3.5]] as const
const KULLER = [[60, 16, 5, 2], [200, 15, 6, 2], [330, 16, 5, 2]] as const
/** Sıcak közler sırayla yanar: kor yoğunluğu (kombo) eşiği geçtikçe bir tane daha. */
const SICAK = [60, 180, 300, 120, 240, 360] as const

/** 400×34 yatak, `preserveAspectRatio="none"` ile tekne genişliğine yayılır. */
export function KozYatagi() {
  return (
    <svg viewBox="0 0 400 34" preserveAspectRatio="none" className={stil.yatak} aria-hidden="true">
      <rect x={0} y={12} width={400} height={22} fill="url(#gCoal)" />
      <g filter="url(#fBlur2)">
        {KOZLER.map(([cx, cy, rx, ry, renk, o]) => (
          <ellipse key={cx} cx={cx} cy={cy} rx={rx} ry={ry} opacity={o} className={renk === 'kor' ? stil.kor : undefined} fill={renk === 'kor' ? undefined : renk} />
        ))}
      </g>
      <g opacity={0.85}>
        {KOMURLER.map(([cx, cy, rx, ry]) => (
          <ellipse key={cx} cx={cx} cy={cy} rx={rx} ry={ry} fill="#2A1A14" />
        ))}
      </g>
      <g opacity={0.6}>
        {KULLER.map(([cx, cy, rx, ry]) => (
          <ellipse key={cx} cx={cx} cy={cy} rx={rx} ry={ry} fill="#8A8078" />
        ))}
      </g>
      {SICAK.map((cx, i) => (
        <ellipse key={cx} cx={cx} cy={22} rx={14} ry={5} fill="url(#gEmber)" className={stil.sicak} style={{ '--esik': (i + 1) / 6 } as React.CSSProperties} />
      ))}
    </svg>
  )
}

/** Kıvam ve çevirme çentiğinde tane yolunu dışarı verir (fiş ve raf aynı yolu kullanır). */
export { Tane }
```

- [ ] **Step 2: Ocak CSS'i**

`components/oyun/SahneOcak.module.css`:

```css
/* Ocağın boyalı parçaları; konum çağıran modülde (`Saha.module.css` > ocak). */
.dayama {
  position: absolute;
  left: 50%;
  top: -10px;
  width: 22px;
  height: 10px;
  transform: translateX(-50%);
}

.kapaliCizgi {
  position: absolute;
  left: 50%;
  top: 6px;
  bottom: 6px;
  width: 0;
  border-left: 1px dashed var(--cizgi-plaka);
}

.sis {
  display: block;
  height: 168px;
  width: auto;
  overflow: visible;
}

/* Pişme > .4 iken duman belirir; katman opaklıkları kare değişkenlerinden (K3). */
.duman {
  opacity: calc(clamp(0, (var(--pisme, 0) - 0.4) * 10, 1) * 0.16);
}

.pismis {
  opacity: var(--pisme, 0);
}

.komur {
  opacity: calc(var(--yanma, 0) * 0.92);
}

.yag {
  opacity: calc(0.9 - var(--yanma, 0) * 0.55);
}

/* Yanık şiş sabit kömür: `[data-yanik]` hayaleti 700 ms söner. */
.yanik .pismis { opacity: 1; }
.yanik .komur { opacity: 0.92; }
.yanik .yag { opacity: 0.35; }

.yatak {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.kor {
  fill: var(--kor);
}

/* Sıcak köz: ocak eşiği (`--kor-yogunluk`, 0.25 ... 1) `--esik`i geçince yanar. */
.sicak {
  opacity: clamp(0, (var(--kor-yogunluk, 0.25) - var(--esik) + 0.17) * 6, 1);
  transition: opacity var(--gecis-yogunluk);
}

.kivilcim {
  position: absolute;
  inset: 0;
  opacity: var(--oran, 0);
  transition: opacity var(--gecis-erit);
  pointer-events: none;
}

.yuvalar {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  justify-items: center;
  margin: auto 0;
}

.yuva,
.kapaliYuva {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 72px;
}

.kapaliYuva {
  height: 176px;
}

.sisKap {
  position: relative;
  display: grid;
  height: 176px;
  place-items: center;
  perspective: 300px;
}

.sis {
  display: block;
  line-height: 0;
}

/* Çevrilmiş şiş öbür yüzünü gösterir; dönüşün kendisi WAAPI'de, azaltılmışta anlık. */
.yuva[data-cevirme='iyi'] .sis,
.yuva[data-cevirme='kotu'] .sis {
  transform: rotateY(180deg);
}

.yanik {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;
}

.cevir {
  position: absolute;
  right: -4px;
  top: 4px;
  color: #FFE2A8;
  filter: drop-shadow(0 0 4px rgba(255, 180, 90, 0.8));
  opacity: 0;
  transition: opacity var(--gecis-hizli);
}

.yuva[data-gorunum='centik'] .cevir {
  opacity: 1;
}

/* Tam kıvam: yuva çevresinde bakır çerçeve ve +150. */
.kivamCerceve {
  position: absolute;
  inset: -4px;
  opacity: 0;
  box-shadow:
    0 0 0 2px var(--bakir-acik),
    0 0 26px color-mix(in srgb, var(--bakir-acik) 60%, transparent);
  transition: opacity var(--gecis-hizli);
  pointer-events: none;
}

.kivamPuan {
  position: absolute;
  left: 50%;
  top: -12px;
  transform: translateX(-50%);
  font: 400 15.5px/1 var(--font-baslik);
  font-variant-numeric: tabular-nums;
  color: var(--bakir-acik);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  opacity: 0;
  transition: opacity var(--gecis-hizli);
}

.yuva[data-gorunum='kivam'] .kivamCerceve,
.yuva[data-gorunum='kivam'] .kivamPuan {
  opacity: 1;
}

.kivilcimUcu {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: var(--bakir-acik);
  opacity: 0;
}

/* Pişme rayı 5 px: alma penceresi, tam kıvam bandı, pirinç dolum, orta çentik. */
.ray {
  position: relative;
  display: block;
  height: 5px;
  background: rgba(0, 0, 0, 0.6);
  box-shadow: inset 0 0 0 1px rgba(226, 194, 117, 0.25);
}

.pencere,
.kivam,
.rayDolum,
.centik {
  position: absolute;
  top: 0;
  bottom: 0;
}

.pencere {
  left: calc(var(--pencere) * 100%);
  right: 0;
  background: rgba(226, 194, 117, 0.3);
}

.kivam {
  left: calc((var(--kivam) - var(--bant) / 2) * 100%);
  width: calc(var(--bant) * 100%);
  background: var(--bakir-acik);
  box-shadow: 0 0 6px color-mix(in srgb, var(--bakir-acik) 80%, transparent);
}

.rayDolum {
  left: 0;
  width: 100%;
  transform-origin: left;
  transform: scaleX(var(--oran, 0));
  background: linear-gradient(90deg, #8A6A2B, #E2C275);
}

.centik {
  left: calc(var(--centik, 0.5) * 100% - 1px);
  top: -3px;
  bottom: -3px;
  width: 2px;
  background: rgba(226, 194, 117, 0.45);
}

.yuva[data-gorunum] .centik {
  background: var(--bakir);
}

.yuva[data-gorunum='bos'] .centik {
  background: rgba(226, 194, 117, 0.45);
}

/* Çevirme bandında çentik 500 ms yanıp söner; azaltılmışta global kural keser, sabit açık kalır. */
.yuva[data-gorunum='centik'] .centik {
  background: #FFE2A8;
  animation: centikYanip 500ms ease-in-out infinite alternate;
}

@keyframes centikYanip {
  from { opacity: 1; }
  to { opacity: 0.35; }
}
```

- [ ] **Step 3: Doğrula ve commit**

Run: `npm run typecheck && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail)'`
Expected: temiz; `animasyon.test` `centikYanip`i aynı dosyada bulur.

```bash
git add components/oyun/SahneOcak.tsx components/oyun/SahneOcak.module.css
git commit -m "Paint the fire: steel skewers, brass rests, coal bed, cooking rail"
```

---

### Task 4: Tezgah ve raf: mermer, tabaklar, maşrapa, yayık, tepsi

**Files:**
- Create: `components/oyun/SahneTezgah.tsx`, `components/oyun/SahneTezgah.module.css`
- Test: `npm run typecheck`, `npm test`

**Interfaces:**
- Produces: `TezgahTabagi({ children? })` (80×60), `TezgahUrunu({ urun })` (yatay şiş ya da
  maşrapa, bir `<svg viewBox="0 0 80 60">` içine konur), `AcikYayik` (56×60, `.ayranYuzeyi`
  `--oran`), `RafTepsisi({ urun })` (48×40). CSS: `.tabak`, `.yayik` (svg), `.ayranYuzeyi`,
  `.tepsi`; yerleşim `.tezgahDolu`, `.mermer`, `.damar`, `.slotlar`, `.tezgahYuva`, `.tezgahKalem`,
  `.urun`, `.soguma`, `.yayik` (düğme), `.yayikDolum`, `.pirincKenar`, `.ceviz`, `.rafUrun`,
  `.rafAlt`.
- Consumes: `SahneTane.Tane`, `SahneDefs`; `data-durum` (`bos|doluyor|bekliyor`), `--oran`.

- [ ] **Step 1: Tezgah ve rafın boyalı parçaları**

`components/oyun/SahneTezgah.tsx`:

```tsx
import { Tane, type SisUrun } from './SahneTane'
import type { Urun } from '@/lib/oyun/tipler'
import stil from './SahneTezgah.module.css'

/*
 * Tezgah ve rafın boyalı parçaları (handoff OyunAlani 212-270): porselen tabak, yatay pişmiş
 * şiş, bakır maşrapa, açık yayık, raf tepsisi. Mermer ve ceviz zemin CSS'te.
 */

const SIS_X = [-20, -4, 12, 26] as const
const TEPSI = [[16, 12], [32, 13], [24, 6]] as const

/** 80×60 porselen tabak ve gölgesi; üstüne şiş ya da maşrapa gelir. */
export function TezgahTabagi({ children }: { children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 80 60" className={stil.tabak} aria-hidden="true">
      <ellipse cx={40} cy={34} rx={30} ry={18} fill="#000" opacity={0.28} filter="url(#fBlur2)" />
      <ellipse cx={40} cy={30} rx={31} ry={19} fill="url(#gPlate)" />
      <ellipse cx={40} cy={30} rx={23} ry={13} fill="none" stroke="#B9AE9C" strokeWidth={0.8} opacity={0.7} />
      {children}
    </svg>
  )
}

/** Tabaktaki ürün: yatay çelik şiş, dört pişmiş tane; ayran bakır maşrapada. */
export function TezgahUrunu({ urun }: { urun: Urun }) {
  if (urun === 'ayran') return <BakirMasrapa />
  return (
    <g transform="translate(40 30)">
      <path d="M-34 0h66l4-1.4v2.8z" fill="url(#gSteel)" stroke="rgba(0,0,0,.4)" strokeWidth={0.4} />
      <circle cx={-34} cy={0} r={3} fill="none" stroke="url(#gSteel)" strokeWidth={1.6} />
      {SIS_X.map((x) => (
        <Tane key={x} urun={urun} x={x} donus={90} dolgu="url(#gCooked)" />
      ))}
    </g>
  )
}

function BakirMasrapa() {
  return (
    <g transform="translate(40 30)">
      <path d="M-11-14h22l-2.4 26h-17.2z" fill="url(#gCopper)" stroke="rgba(0,0,0,.45)" strokeWidth={0.8} />
      <ellipse cx={0} cy={-14} rx={11} ry={3.2} fill="url(#gAyran)" stroke="#9A6A3A" strokeWidth={0.8} />
      <ellipse cx={-3} cy={-14.6} rx={3} ry={1} fill="#fff" opacity={0.8} />
      <path d="M-7-6v10" stroke="#fff" strokeWidth={1.4} opacity={0.35} strokeLinecap="round" />
    </g>
  )
}

/** Ceviz fıçı, iki pirinç çember, çelik kol; ağızdaki ayran `--oran` kadar görünür. */
export function AcikYayik() {
  return (
    <svg viewBox="0 0 56 60" className={stil.yayik} aria-hidden="true">
      <ellipse cx={28} cy={54} rx={18} ry={4} fill="#000" opacity={0.35} filter="url(#fBlur2)" />
      <path d="M12 14h32l3 40H9z" fill="url(#gWood)" stroke="rgba(0,0,0,.5)" strokeWidth={0.8} />
      <path d="M12 14h32l3 40H9z" filter="url(#fWood)" opacity={0.7} />
      <rect x={10.5} y={24} width={35} height={3} fill="url(#gBrass)" />
      <rect x={9.6} y={42} width={36.8} height={3} fill="url(#gBrass)" />
      <ellipse cx={28} cy={14} rx={16} ry={4} fill="#5A3418" stroke="rgba(0,0,0,.5)" strokeWidth={0.8} />
      <path d="M28 2v12" stroke="url(#gSteel)" strokeWidth={2.4} strokeLinecap="round" />
      <rect x={22} y={0} width={12} height={3.5} fill="url(#gWood)" />
      <ellipse cx={28} cy={14} rx={14} ry={3} fill="url(#gAyran)" className={stil.ayranYuzeyi} />
    </svg>
  )
}

/** Raf tepsisi: siyah tepsi üstünde üç çiğ tane. */
export function RafTepsisi({ urun }: { urun: SisUrun }) {
  return (
    <svg viewBox="0 0 48 40" width={48} height={40} className={stil.tepsi} aria-hidden="true">
      <ellipse cx={24} cy={36} rx={20} ry={4} fill="#000" opacity={0.45} filter="url(#fBlur2)" />
      <path d="M4 14h40l-3 20H7z" fill="#2A2320" stroke="rgba(255,255,255,.15)" strokeWidth={0.8} />
      <ellipse cx={24} cy={14} rx={20} ry={4.5} fill="#3A302B" stroke="rgba(255,255,255,.2)" strokeWidth={0.8} />
      {TEPSI.map(([x, y]) => (
        <Tane key={x} urun={urun} x={x} y={y} />
      ))}
    </svg>
  )
}
```

- [ ] **Step 2: Tezgah ve raf CSS'i**

`components/oyun/SahneTezgah.module.css`:

```css
/* Tezgah ve rafın boyalı parçaları; yerleşim `Saha.module.css`. */
.tabak {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.yayik {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Ağızdaki ayran: dolum oranı opaklık (`--oran`, `data-ciz="ayran"`). */
.ayranYuzeyi {
  opacity: var(--oran, 0);
}

.tepsi {
  flex: none;
  overflow: visible;
}

/* Tezgah: mermer slab, pirinç alt kenar; 4 slot ve 56 px yayık. */
.tezgahDolu {
  line-height: 0;
  color: var(--krem-74);
}

.mermer {
  position: relative;
  padding: 8px;
  background: linear-gradient(135deg, #F1EBE0, #D8CFC0 50%, #EDE6DA);
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, 0.15),
    0 10px 24px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.damar {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.9;
  pointer-events: none;
}

.slotlar {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)) 56px;
  gap: 8px;
}

.tezgahYuva {
  position: relative;
  display: block;
  height: 60px;
}

.tezgahKalem {
  position: absolute;
  inset: 0;
}

.urun {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Soğuma çubuğu: kalan sıcaklık (`--oran`), kor > turuncu. */
.soguma {
  position: absolute;
  left: 8%;
  bottom: 0;
  display: block;
  width: 84%;
  height: 3px;
  transform-origin: left;
  transform: scaleX(var(--oran, 0));
  background: linear-gradient(90deg, var(--kor), #FF7A1A);
  box-shadow: 0 0 6px rgba(255, 122, 26, 0.7);
}

.yayik {
  position: relative;
  height: 60px;
}

.yayik::after {
  content: '';
  position: absolute;
  inset: -2px;
  opacity: 0;
  box-shadow:
    0 0 0 2px var(--bakir-acik),
    0 0 20px color-mix(in srgb, var(--bakir-acik) 60%, transparent);
  transition: opacity var(--gecis-hizli);
  pointer-events: none;
}

.yayik[data-durum='bekliyor']::after {
  opacity: 1;
}

/* Alt krem çubuk: dolum oranı. Boşken görünmez. */
.yayikDolum {
  position: absolute;
  left: 4px;
  right: 4px;
  bottom: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.25);
}

.yayikDolum::after {
  content: '';
  position: absolute;
  inset: 0;
  transform-origin: left;
  transform: scaleX(var(--oran, 0));
  background: var(--krem);
}

.yayik[data-durum='bos'] .yayikDolum {
  display: none;
}

.pirincKenar {
  display: block;
  height: 10px;
  background: linear-gradient(180deg, #C9A24A, #8A6A2B);
  box-shadow:
    inset 0 1px 0 rgba(255, 240, 200, 0.5),
    0 6px 14px rgba(0, 0, 0, 0.5);
}

/* Raf: ceviz şerit; düğme 62 px, tepsi ve ad. Ocak doluyken pasif (.45). */
.ceviz {
  position: relative;
  display: flex;
  gap: 8px;
  padding: 6px 8px 4px;
  background: linear-gradient(180deg, #6E4225, #4A2A14);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.ceviz .damar {
  opacity: 0.8;
}

.rafUrun {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  height: 62px;
  font: 600 15.5px/1 var(--font-govde);
  color: var(--krem);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  transition: opacity var(--gecis-orta);
}

.ceviz[data-pasif] .rafUrun {
  opacity: 0.45;
}

.rafAlt {
  display: block;
  height: 8px;
  background: linear-gradient(180deg, #3E2210, #24120A);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
}
```

- [ ] **Step 3: Doğrula ve commit**

Run: `npm run typecheck && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail)'`
Expected: temiz.

```bash
git add components/oyun/SahneTezgah.tsx components/oyun/SahneTezgah.module.css
git commit -m "Paint the counter and rack: marble, plates, copper cup, churn"
```

---

### Task 5: Saha: HUD, bölüm etiketleri, zemin katmanları, perde, 420 px panel; düz semboller silinir

**Files:**
- Create: `components/oyun/Hud.tsx`, `components/oyun/Hud.module.css`, `components/oyun/SeritlerTezgah.tsx`
- Replace: `components/oyun/Semboller.tsx`, `Semboller.module.css`, `Seritler.tsx`, `Saha.tsx`,
  `Saha.module.css`, `OyunSayfasi.tsx`, `OyunSayfasi.module.css`
- Modify: `components/oyun/tepkiler.ts` (tek sayı)
- Test: `npm run typecheck`, `npm test`, `npm run build`, duman betiği (Step 10)

**Interfaces:**
- `Hud({ metin, duraklat, ses })`: `Seritler.Hud` yerine; `[data-duyuru]` artık HUD içinde ve
  görünür (`Saha` eski gizli `<p>`yi kaldırır). `Serit({ sinif?, ad, etiket, ciz?, sag?, children })`
  ve `DugmeKatmanlari` `Seritler`den dışa açılır; `SeritlerTezgah` onları kullanır. `Saha` props
  aynı. `OyunSayfasi` `ekran(anahtar, tur, icerik)`: cam panel yalnız `katilim`; `.sayfa`
  `data-ekran`, `.ekran[data-ekran='oyun']` 420 px.
- `Semboller` kalanlar: `KalktiIsareti`, `CevirmeIsareti`, `OcakSonerIsareti`, `TezgahDoluIsareti`,
  `DuraklatIsareti`, `SesIsareti`, `KomboRozeti` (38×32 altıgen), `PorsiyonRozeti`, `KorNoktasi`.
  `SonucEkrani` (Task 6'ya kadar eski hali) `OcakSonerIsareti`yi kullanmaya devam eder, derleme
  bozulmaz.
- DOM sözleşmesi (plan 2 ile aynı, `tepkiler.ts` ve betikler): `[data-hedef]` düğmeleri içinde
  `[data-dolgu]` ve `.ipucu`; sofrada `[data-tabak]`×4 (artık `<g>`), `[data-fis]`, `[data-kalkti]`,
  `[data-ciz="sabir"]`; yuvada `[data-sis]`, `[data-yanik]`, `[data-kivilcim]`; `[data-tezgah]`
  (mermer), `[data-tezgah-yuva]`, kalemde `[data-urun]` ve içinde `svg`; HUD `[data-rozet]`,
  `[data-kombo]`; sahada `[data-gece]`, `[data-duyuru]`, `[data-serit]`, `data-evre`.

Not: bu görev giriş ve sonuç ekranlarını da cam panelden çıkarır (K8); onların kendi stilleri
Task 6'da gelir, aradaki commit'te eski stilleriyle `--zemin` üstünde dururlar (derleme ve
testler yeşil).

- [ ] **Step 1: HUD ve durum simgeleri; düz semboller silinir**

`components/oyun/Semboller.tsx`:

```tsx
import stil from './Semboller.module.css'

/*
 * HUD ve durum simgeleri (24'lük kare, çizgi `currentColor`, handoff OyunAlani ikon yolları).
 * Boyalı sahne parçaları `SahneSofra`, `SahneOcak`, `SahneTezgah`; şiş geometrisi `lib/sis`
 * yalnız marka işaretinde kalır (K5). Hepsi dekoratif; anlam düğmenin adından gelir.
 */

type Boy = { boy?: number }
type SimgeProps = Boy & { sinif?: string; children: React.ReactNode }

function Simge({ boy = 24, sinif, children }: SimgeProps) {
  return (
    <svg
      width={boy}
      height={boy}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={sinif}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

/** Sofra kalktı: çıkış oku; kesik halka `SahneSofra`da. */
export function KalktiIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M7 17 17 7M9 7h8v8" />
    </Simge>
  )
}

export function CevirmeIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M19 12a7 7 0 0 1-12.2 4.7" />
      <path d="M5 12A7 7 0 0 1 17.2 7.3" />
      <path d="M17 4v3.5h-3.5" />
      <path d="M7 20v-3.5h3.5" />
    </Simge>
  )
}

export function OcakSonerIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M12 20c-3.3 0-5.5-2.2-5.5-5.2 0-2.7 1.8-4.4 3-6.3.5 1.2 1 1.8 1.8 2.3.3-2.3 1.2-4 2.7-5.6 2.2 2.4 3.5 4.8 3.5 7.9 0 3.6-2.2 6.9-5.5 6.9z" />
      <path d="M4 20 20 4" />
    </Simge>
  )
}

export function TezgahDoluIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M3 15h18M5 15c0 2.8 3.1 4 7 4s7-1.2 7-4" />
      <path d="M9 6l6 6M15 6l-6 6" />
    </Simge>
  )
}

export function DuraklatIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M9 5v14M15 5v14" />
    </Simge>
  )
}

export function SesIsareti({ boy, acik }: Boy & { acik: boolean }) {
  return (
    <Simge boy={boy}>
      <path d="M4 9.5v5h3.5L13 19V5L7.5 9.5z" />
      {acik ? <path d="M16.5 9.2a4 4 0 0 1 0 5.6" /> : <path d="M16 10l4 4M20 10l-4 4" />}
    </Simge>
  )
}

/** Kombo altıgeni 38×32: pasif koyu, aktif pirinç (`[data-carpan]` ile CSS'te). */
export function KomboRozeti() {
  return (
    <svg viewBox="0 0 38 32" className={stil.altigen} aria-hidden="true">
      <path d="M10 2h18l8 14-8 14H10L2 16z" className={stil.altigenDolgu} strokeWidth={1.6} />
      <path d="M12 5h14l6.3 11L26 27H12L5.7 16z" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth={1} />
    </svg>
  )
}

/** "Bir porsiyon" rozeti: küçük pirinç altıgen, 12 şiş (spec §6); `tepkiler.ts` basar. */
export function PorsiyonRozeti() {
  return (
    <svg viewBox="0 0 38 32" className={stil.altigen} aria-hidden="true">
      <path d="M10 2h18l8 14-8 14H10L2 16z" fill="url(#gBrass)" stroke="#E2C275" strokeWidth={1.6} />
    </svg>
  )
}

/** İlk turun ipucu: kor noktası, halkalı. */
export function KorNoktasi({ boy = 16 }: Boy) {
  return (
    <svg width={boy} height={boy} viewBox="0 0 16 16" aria-hidden="true">
      <circle cx={8} cy={8} r={8} fill="rgba(255,122,26,.35)" />
      <circle cx={8} cy={8} r={3.5} fill="#FF7A1A" className={stil.korCekirdek} />
    </svg>
  )
}
```

`components/oyun/Semboller.module.css`:

```css
/* HUD rozetleri; konum çağıran modülde. */
.altigen {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.altigenDolgu {
  fill: rgba(0, 0, 0, 0.3);
  stroke: var(--cizgi-buton);
  transition:
    fill var(--gecis-orta),
    stroke var(--gecis-orta);
}

/* Çarpan 2+ pirinç. */
:global([data-carpan]:not([data-carpan='1'])) .altigenDolgu {
  fill: url(#gBrass);
  stroke: #E2C275;
}

.korCekirdek {
  filter: drop-shadow(0 0 4px #FF7A1A);
}
```

- [ ] **Step 2: HUD**

`components/oyun/Hud.tsx`:

```tsx
import type { Sozluk } from '@/content'
import { DuraklatIsareti, KomboRozeti, OcakSonerIsareti, PorsiyonRozeti, SesIsareti } from './Semboller'
import type { Ses } from './useSes'
import stil from './Hud.module.css'

/*
 * HUD (handoff OyunAlani 50-72): saat rayı, saat, puan, ×2 ve kombo rozetleri, ses, duraklat,
 * görünür duyuru satırı. Değerler `ciz.ts`'ten `data-ciz` öğelerine yazılır. Gövde bir ızgara:
 * telefonda ×2 duyuru satırının sağına iner (beş haneli puanla satır 390'a sığmıyor, ölçüldü).
 */

type Props = { metin: Sozluk['oyun']; duraklat: () => void; ses: Ses }

const CIZGILER = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100] as const

/** 21:00'den 05:00'e: dokuz saat çizgisi, dolum ve imleç `--oran`, ucunda ocak söner. */
function SaatRayi() {
  return (
    <span className={stil.ray} data-ciz="gece" aria-hidden="true">
      {CIZGILER.map((x) => (
        <span key={x} className={stil.cizgi} style={{ left: `${x}%` }} />
      ))}
      <span className={stil.dolum} />
      <span className={stil.imlec} />
      <span className={stil.rayUcu}>
        <OcakSonerIsareti boy={24} />
      </span>
    </span>
  )
}

export function Hud({ metin, duraklat, ses }: Props) {
  return (
    <header className={stil.hud}>
      <SaatRayi />
      <div className={stil.govde}>
        <span className={stil.saat}>
          <span className={stil.gizli}>{metin.saat} </span>
          <span data-ciz="saat">21:00</span>
        </span>
        <span className={stil.ayirici} aria-hidden="true" />
        <span className={stil.puan}>
          <span className={stil.gizli}>{metin.puan} </span>
          <span data-ciz="puan">0</span>
        </span>
        <span className={stil.carpan} aria-hidden="true">
          ×2
        </span>
        <span className={stil.kombo} data-ciz="kombo" data-rozet="kombo">
          <KomboRozeti />
          <span className={stil.gizli}>{metin.kombo} </span>
          <span data-kombo>×1</span>
        </span>
        <span className={stil.porsiyon} data-rozet="porsiyon" aria-hidden="true">
          <PorsiyonRozeti />
          <span>12</span>
        </span>
        <span className={stil.bosluk} />
        <button
          type="button"
          className={stil.dugme}
          aria-label={metin.ses}
          aria-pressed={ses.acik}
          onClick={ses.degistir}
        >
          <SesIsareti boy={24} acik={ses.acik} />
        </button>
        <button type="button" className={stil.dugme} aria-label={metin.duraklat} onClick={duraklat}>
          <DuraklatIsareti boy={24} />
        </button>
        <p className={stil.duyuru} aria-live="polite" data-duyuru />
      </div>
    </header>
  )
}
```

`components/oyun/Hud.module.css`:

```css
/* HUD paneli (handoff 50): yarı saydam zemin, ince kenar, gölge; iç pay 8/10/6. */
.hud {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 10px 6px;
  border: 1px solid var(--cizgi-soluk);
  background: var(--panel-acik);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.gizli {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* Saat rayı: 2 px zemin, 9 çizgi, dolum ve imleç `--oran` ile; son saatte bakırlaşır. */
.ray {
  position: relative;
  display: block;
  height: 14px;
  margin-right: 16px;
}

.ray::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 6px;
  height: 2px;
  background: var(--krem-13);
}

.cizgi {
  position: absolute;
  top: 3px;
  width: 1px;
  height: 8px;
  background: var(--cizgi-guclu);
}

.dolum {
  position: absolute;
  left: 0;
  top: 6px;
  height: 2px;
  width: 100%;
  transform-origin: left;
  transform: scaleX(var(--oran, 0));
  background: var(--krem-50);
  transition: background var(--gecis-yogunluk);
}

:global([data-evre='4']) .dolum {
  background: var(--bakir);
}

.imlec {
  position: absolute;
  left: calc(var(--oran, 0) * 100% - 1px);
  top: 2px;
  width: 2px;
  height: 10px;
  background: var(--bakir-acik);
  box-shadow: 0 0 6px var(--bakir-acik);
}

.rayUcu {
  position: absolute;
  right: -18px;
  top: -5px;
  width: 24px;
  height: 24px;
  color: var(--krem-50);
}

.govde {
  position: relative;
  display: grid;
  grid-template-columns: auto auto auto auto auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 8px;
}

.saat,
.puan {
  font: 400 20px/1 var(--font-baslik);
  font-variant-numeric: tabular-nums;
}

.saat {
  color: var(--krem);
}

.puan {
  min-width: 5.2ch;
  color: var(--bakir-acik);
}

.ayirici {
  width: 1px;
  height: 16px;
  background: var(--cizgi-meta);
}

/* ×2: yalnız son saat çarpanı (evre 5, `data-evre='4'`). Telefonda duyuru satırının sağında. */
.carpan {
  display: none;
  grid-row: 2;
  grid-column: 7 / 9;
  justify-self: end;
  padding: 4px 6px;
  background: var(--bakir-acik);
  font: 400 13px/1 var(--font-baslik);
  color: var(--zemin);
}

:global([data-evre='4']) .carpan {
  display: inline-block;
}

.kombo,
.porsiyon {
  position: relative;
  display: grid;
  place-items: center;
  width: 38px;
  height: 32px;
  font: 400 13px/1 var(--font-baslik);
  font-variant-numeric: tabular-nums;
  color: var(--krem-50);
}

.kombo[data-carpan]:not([data-carpan='1']) {
  color: var(--zemin);
}

.kombo > span {
  position: relative;
}

/* Porsiyon rozeti akışta yer tutmaz: kombonun sağına biner, `tepkiler.ts` basar. */
.porsiyon {
  position: absolute;
  left: calc(50% - 19px);
  top: 0;
  color: var(--zemin);
  opacity: 0;
  pointer-events: none;
}

.bosluk {
  min-width: 0;
}

.dugme {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: var(--krem-74);
}

@media (max-width: 359px) {
  .govde { gap: 8px 4px; }
  .saat, .puan { font-size: 17px; }
}

@media (min-width: 1041px) {
  .carpan { grid-row: auto; grid-column: auto; }
  .duyuru { grid-column: 1 / -1; }
}

.dugme[aria-pressed='true'] {
  color: var(--bakir-acik);
}

/* Duyuru satırı görünür (K7); canlı bölge aynı öğe. */
.duyuru {
  grid-row: 2;
  grid-column: 1 / 7;
  min-height: 16px;
  margin: 0;
  font: 500 13px/1.2 var(--font-govde);
  color: var(--krem-70);
}
```

- [ ] **Step 3: Şeritler: sofralar ve ocak**

`components/oyun/Seritler.tsx`:

```tsx
import type { Sozluk } from '@/content'
import { KorKivilcimi } from '@/components/ember/KorKivilcimi'
import { servisEdilenler } from '@/lib/oyun/gorsel'
import type { Goruntu } from '@/lib/oyun/gosterim'
import type { Hedef, Urun } from '@/lib/oyun/tipler'
import { seritOdagi, seritTusu } from './odak'
import { DayamaCentigi, KapaliYuva, KozYatagi, Sis } from './SahneOcak'
import { IkramTabaklari, KalktiHalkasi, KapaliSofra, KorHalkasi, SofraPlakasi } from './SahneSofra'
import { KarisikSimgesi, TaneSimgesi } from './SahneTane'
import { CevirmeIsareti, KalktiIsareti, KorNoktasi } from './Semboller'
import stil from './Saha.module.css'
import ocakStil from './SahneOcak.module.css'
import sofraStil from './SahneSofra.module.css'

/*
 * Sahanın şeritleri: sofralar ve ocak burada, tezgah ve raf `SeritlerTezgah.tsx`, HUD `Hud.tsx`
 * (spec §3). React yalnız yapı
 * değişince çizer; her karedeki değerler `ciz.ts`'ten `data-ciz` öğelerine yazılır, anlık
 * tepkiler `tepkiler.ts`'ten gizli bekleyen öğeleri oynatır.
 */

export type Metin = Sozluk['oyun']
export type SeritProps = {
  goruntu: Goruntu
  ad: (u: Urun) => string
  dokun: (hedef: Hedef, el: HTMLElement) => void
  metin: Metin
}

const YUVALAR = [0, 1, 2, 3] as const

/** Her düğmenin son iki katmanı: ilk turun kor noktası ve dokunma dolgusu. */
export function DugmeKatmanlari() {
  return (
    <>
      <span className={stil.ipucu} aria-hidden="true">
        <KorNoktasi />
      </span>
      <span className={stil.dolgu} data-dolgu aria-hidden="true" />
    </>
  )
}

type SeritKabi = {
  sinif?: string
  ad: string
  etiket: string
  ciz?: string
  sag?: React.ReactNode
  children: React.ReactNode
}

/** Şerit: görünür etiket satırı (sağında isteğe bağlı çip), tek Tab durağı, ok tuşları içeride. */
export function Serit({ sinif, ad, etiket, ciz, sag, children }: SeritKabi) {
  const id = `oyun-serit-${ad}`
  return (
    <section
      className={sinif}
      data-serit
      data-ciz={ciz}
      aria-labelledby={id}
      onKeyDown={seritTusu}
      onFocus={seritOdagi}
    >
      <span className={stil.etiketSatiri}>
        <span id={id} className={stil.etiket}>
          {etiket}
        </span>
        {sag}
      </span>
      {children}
    </section>
  )
}

type SofraProps = Omit<SeritProps, 'goruntu'> & {
  no: number
  sofra: Goruntu['sofralar'][number]
  vurgu: Urun | null
}

function sofraEtiketi(metin: Metin, no: number, sofra: SofraProps['sofra'], ad: SofraProps['ad']): string {
  if (!sofra) return `${metin.sofra} ${no + 1}: ${metin.bosSofra}`
  const durum = sofra.kurulu ? `, ${metin.kurulu}` : ''
  return `${metin.sofra} ${no + 1}${durum}: ${sofra.kalan.map(ad).join(', ')}`
}

/** Fiş: yırtık kağıt, kalemler 14 px tane; servis edilen üstü çizili. */
function Fis({ sofra }: { sofra: NonNullable<SofraProps['sofra']> }) {
  const servis = servisEdilenler(sofra.fis, sofra.kalan)
  return (
    <span className={sofraStil.fis} data-fis aria-hidden="true">
      {sofra.karisik && <KarisikSimgesi />}
      {sofra.fis.map((u, i) => (
        <span key={i} className={sofraStil.kalem} data-servis={servis[i] ? '' : undefined}>
          <TaneSimgesi urun={u} />
        </span>
      ))}
    </span>
  )
}

function Sofra({ no, sofra, ad, dokun, metin, vurgu }: SofraProps) {
  return (
    <button
      type="button"
      className={sofraStil.sofra}
      data-hedef={`s${no}`}
      data-bos={sofra ? undefined : ''}
      data-kurulu={sofra?.kurulu ? '' : undefined}
      data-vurgu={sofra && vurgu && sofra.kalan.includes(vurgu) ? '' : undefined}
      aria-label={sofraEtiketi(metin, no, sofra, ad)}
      onClick={(e) => dokun(`s${no}` as Hedef, e.currentTarget)}
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
      <DugmeKatmanlari />
    </button>
  )
}

export function Sofralar({ goruntu, vurgu, ...kalan }: SeritProps & { vurgu: Urun | null }) {
  const kapida = goruntu.kapida > 0 && (
    <span className={stil.kapida}>
      {kalan.metin.kapida} {goruntu.kapida}
    </span>
  )
  return (
    <Serit ad="sofra" etiket={kalan.metin.sofra} sag={kapida}>
      <div className={sofraStil.sofraIzgara}>
        {YUVALAR.map((no) =>
          no >= goruntu.acikSofra ? (
            <div key={no} className={sofraStil.kapaliSofra}>
              <KapaliSofra />
            </div>
          ) : (
            <Sofra key={no} no={no} sofra={goruntu.sofralar[no] ?? null} vurgu={vurgu} {...kalan} />
          ),
        )}
      </div>
    </Serit>
  )
}

type YuvaProps = Omit<SeritProps, 'goruntu'> & { no: number; sis: Goruntu['ocak'][number] }

function Yuva({ no, sis, ad, dokun, metin }: YuvaProps) {
  const ray = sis
    ? ({ '--centik': sis.centik, '--pencere': sis.pencere, '--kivam': sis.kivam, '--bant': sis.bant } as React.CSSProperties)
    : undefined
  return (
    <button
      type="button"
      className={ocakStil.yuva}
      data-hedef={`o${no}`}
      data-ciz="ocak"
      data-no={no}
      data-cevirme={sis?.cevirme}
      aria-label={`${metin.ocak} ${no + 1}${sis ? `: ${ad(sis.urun)}` : ''}`}
      style={ray}
      onClick={(e) => dokun(`o${no}` as Hedef, e.currentTarget)}
    >
      <span className={ocakStil.sisKap} aria-hidden="true">
        <DayamaCentigi />
        {sis && (
          <span className={ocakStil.sis} data-sis>
            <Sis urun={sis.urun} />
          </span>
        )}
        <span className={ocakStil.yanik} data-yanik>
          <Sis urun="ciger" yanik />
        </span>
        <span className={ocakStil.cevir}>
          <CevirmeIsareti boy={22} />
        </span>
        <span className={ocakStil.kivamCerceve} />
        <span className={ocakStil.kivamPuan}>+150</span>
        <span className={ocakStil.kivilcimUcu} data-kivilcim />
      </span>
      <span className={ocakStil.ray} aria-hidden="true">
        {sis && <span className={ocakStil.pencere} />}
        {sis && <span className={ocakStil.kivam} />}
        <span className={ocakStil.rayDolum} />
        <span className={ocakStil.centik} />
      </span>
      <DugmeKatmanlari />
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
                <Yuva key={no} no={no} sis={goruntu.ocak[no] ?? null} {...kalan} />
              ),
            )}
          </div>
          <span className={stil.yatakKabi} aria-hidden="true">
            <KozYatagi />
          </span>
        </div>
        <span className={stil.tekneAlt} aria-hidden="true" />
      </div>
    </Serit>
  )
}
```

- [ ] **Step 4: Şeritler: tezgah ve raf**

`components/oyun/SeritlerTezgah.tsx`:

```tsx
import type { Goruntu } from '@/lib/oyun/gosterim'
import type { Urun } from '@/lib/oyun/tipler'
import { AcikYayik, RafTepsisi, TezgahTabagi, TezgahUrunu } from './SahneTezgah'
import { TezgahDoluIsareti } from './Semboller'
import { DugmeKatmanlari, Serit, type SeritProps } from './Seritler'
import stil from './Saha.module.css'
import tezgahStil from './SahneTezgah.module.css'

/* Tezgah ve raf şeritleri (spec §3): mermer slab üstünde dört tabak ve yayık, ceviz raf. */

const YUVALAR = [0, 1, 2, 3] as const

type KalemProps = {
  no: number
  kalem: NonNullable<Goruntu['tezgah'][number]>
  etiket: string
  vurgula: TezgahProps['vurgula']
}

function TezgahKalemi({ no, kalem, etiket, vurgula }: KalemProps) {
  return (
    <button
      type="button"
      className={tezgahStil.tezgahKalem}
      data-kalite={kalem.kalite ?? 'ayran'}
      data-urun={kalem.urun}
      aria-label={etiket}
      onClick={(e) => vurgula(kalem.urun, e.currentTarget)}
    >
      <svg viewBox="0 0 80 60" className={tezgahStil.urun} aria-hidden="true">
        <TezgahUrunu urun={kalem.urun} />
      </svg>
      {kalem.kalite && <span className={tezgahStil.soguma} data-ciz="soguma" data-no={no} aria-hidden="true" />}
      <span className={stil.dolgu} data-dolgu aria-hidden="true" />
    </button>
  )
}

type TezgahProps = SeritProps & { vurgula: (u: Urun, el: HTMLElement) => void }

export function Tezgah({ goruntu, ad, dokun, metin, vurgula }: TezgahProps) {
  const dolu = goruntu.tezgah.every(Boolean) && (
    <span className={tezgahStil.tezgahDolu} aria-hidden="true">
      <TezgahDoluIsareti boy={24} />
    </span>
  )
  return (
    <Serit ad="tezgah" etiket={metin.tezgah} sag={dolu}>
      <div className={tezgahStil.mermer} data-tezgah>
        <svg className={tezgahStil.damar} aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#fMarble)" />
        </svg>
        <div className={tezgahStil.slotlar}>
          {YUVALAR.map((no) => {
            const kalem = goruntu.tezgah[no]
            return (
              <span key={no} className={tezgahStil.tezgahYuva} data-tezgah-yuva={no}>
                <TezgahTabagi />
                {kalem && <TezgahKalemi no={no} kalem={kalem} etiket={`${metin.tezgah}: ${ad(kalem.urun)}`} vurgula={vurgula} />}
              </span>
            )
          })}
          <button
            type="button"
            className={tezgahStil.yayik}
            data-hedef="ayran"
            data-ciz="ayran"
            data-durum={goruntu.ayran}
            aria-label={ad('ayran')}
            onClick={(e) => dokun('ayran', e.currentTarget)}
          >
            <AcikYayik />
            <span className={tezgahStil.yayikDolum} aria-hidden="true" />
            <DugmeKatmanlari />
          </button>
        </div>
      </div>
      <span className={tezgahStil.pirincKenar} aria-hidden="true" />
    </Serit>
  )
}

export function Raf({ goruntu, ad, dokun, metin }: SeritProps) {
  const ocakDolu = goruntu.ocak.slice(0, goruntu.acikOcak).every(Boolean)
  return (
    <Serit ad="raf" etiket={metin.raf}>
      <div className={tezgahStil.ceviz} data-pasif={ocakDolu ? '' : undefined}>
        <svg className={tezgahStil.damar} aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#fWood)" />
        </svg>
        {goruntu.raf.map((urun) => (
          <button key={urun} type="button" className={tezgahStil.rafUrun} data-hedef={urun} onClick={(e) => dokun(urun, e.currentTarget)}>
            <RafTepsisi urun={urun} />
            <span>{ad(urun)}</span>
            <DugmeKatmanlari />
          </button>
        ))}
      </div>
      <span className={tezgahStil.rafAlt} aria-hidden="true" />
    </Serit>
  )
}
```

- [ ] **Step 5: Saha: zemin katmanları, defs, perde**

`components/oyun/Saha.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import type { Girdi, Sonuc, Urun } from '@/lib/oyun/tipler'
import { Hud } from './Hud'
import { SahneDefs } from './SahneDefs'
import { Ocak, Sofralar } from './Seritler'
import { Raf, Tezgah } from './SeritlerTezgah'
import { dokunus } from './tepkiler'
import { useOyunAlani } from './useOyunAlani'
import stil from './Saha.module.css'

type Props = {
  dil: Dil
  tohum: number
  ipucu: boolean
  bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void
  cik: () => void
}

type PerdeProps = { metin: Sozluk['oyun']; devam: () => void; cik: () => void }

/** Duraklatma perdesi (handoff 280-288). Çıkış girişe döner; tur boyunca gizli kabuk orada geri gelir. */
function Perde({ metin, devam, cik }: PerdeProps) {
  return (
    <div className={stil.perde}>
      <span className={stil.perdeBaslik}>{metin.duraklat}</span>
      <div className={stil.perdeDugmeleri}>
        <button type="button" className={stil.devam} onClick={devam} autoFocus>
          {metin.devam}
        </button>
        <button type="button" className={stil.cik} onClick={cik}>
          {metin.cik}
        </button>
      </div>
    </div>
  )
}

/** Zemin katmanları (handoff 42-46): gece, nokta deseni, kor radyali, vinyet, tanecik. */
function Zemin() {
  return (
    <>
      <span className={stil.gece} data-gece aria-hidden="true" />
      <span className={stil.desen} aria-hidden="true" />
      <span className={stil.zeminKoru} aria-hidden="true" />
      <span className={stil.vinyet} aria-hidden="true" />
      <svg className={stil.tanecik} aria-hidden="true">
        <rect width="100%" height="100%" filter="url(#fGrain)" />
      </svg>
    </>
  )
}

/** Oyun alanı. Yalnız istemci `OyunSayfasi`'ndan çağrılır, kendi sınırı yoktur. */
export function Saha({ dil, tohum, ipucu, bitince, cik }: Props) {
  const s = sozluk(dil)
  const ad = (u: Urun): string => (u === 'ayran' ? s.menu.icecekler.urunler.ayran : s.menu.ocakbasi.urunler[u].ad)
  const kok = useRef<HTMLDivElement>(null)
  const [vurgu, setVurgu] = useState<Urun | null>(null)
  const { goruntu, dokun, duraklatildi, duraklat, devam, azalt, ses } = useOyunAlani({
    kok,
    tohum,
    ipucu,
    metin: s.oyun,
    bitince,
  })

  useEffect(() => {
    if (!vurgu) return
    const zaman = setTimeout(() => setVurgu(null), 700)
    return () => clearTimeout(zaman)
  }, [vurgu])

  const vurgula = (urun: Urun, el: HTMLElement) => {
    setVurgu(urun)
    dokunus(el, azalt)
  }
  const serit = { goruntu, ad, dokun, metin: s.oyun }
  return (
    <div ref={kok} className={stil.saha}>
      <SahneDefs />
      <Zemin />
      <Hud metin={s.oyun} duraklat={duraklat} ses={ses} />
      <Sofralar {...serit} vurgu={vurgu} />
      <Ocak {...serit} />
      <Tezgah {...serit} vurgula={vurgula} />
      <Raf {...serit} />
      {duraklatildi && <Perde metin={s.oyun} devam={devam} cik={cik} />}
    </div>
  )
}
```

- [ ] **Step 6: Saha CSS'i: zemin, etiket, tekne, perde, tepki sınıfları**

`components/oyun/Saha.module.css`:

```css
/*
 * Oyun alanının boyalı görsel dili (handoff OyunAlani, karar belgesi K1-K11): sahne katmanı
 * serbest sıcak palet, UI katmanı token. Dikey akış HUD, Sofra, Ocak (esner), Tezgah, Raf;
 * bölümler arası 12 px, iç pay 12 px. Her karede değişen değerler `--oran`, `--pisme`,
 * `--yanma`, `--kor-yogunluk` ile gelir (`ciz.ts`).
 */
.saha {
  --sahne-zemin: var(--zemin);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: calc(100dvh - 24px);
  padding: 12px 12px 14px;
  background: var(--zemin);
  color: var(--krem);
  touch-action: manipulation;
  user-select: none;
  overflow: hidden;
}

.saha > * {
  position: relative;
  z-index: 1;
}

.saha[data-evre='4'] {
  --sahne-zemin: var(--gece);
}

/* Zemin katmanları, alttan üste: gece (opaklıkla açılır, `tepkiler.ts`), nokta deseni,
   kor radyali, vinyet, tanecik. Hepsi içeriğin altında (z-index 0). */
.gece,
.desen,
.zeminKoru,
.vinyet,
.tanecik {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.gece {
  background: var(--gece);
  opacity: 0;
}

.desen {
  background-image: radial-gradient(circle at 50% 50%, rgba(255, 235, 210, 0.035) 0 36%, rgba(0, 0, 0, 0) 38%);
  background-size: 34px 34px;
}

.zeminKoru {
  background: radial-gradient(
    ellipse 80% 34% at 50% 58%,
    rgba(255, 122, 26, 0.26),
    color-mix(in srgb, var(--kor) 10%, transparent) 50%,
    rgba(0, 0, 0, 0) 75%
  );
}

.vinyet {
  background: radial-gradient(ellipse 110% 85% at 50% 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.6));
}

/* feTurbulence bir kez raster'a alınır; `will-change` katmanı sabitler (K10 adım 1). */
.tanecik {
  width: 100%;
  height: 100%;
  opacity: 0.5;
  mix-blend-mode: overlay;
  will-change: transform;
}

/* Bölüm etiketi satırı (Archivo 13/600), sağında isteğe bağlı çip. */
.etiketSatiri {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 20px;
  margin-bottom: 6px;
}

.etiket {
  font: 600 13px/1 var(--font-govde);
  letter-spacing: 0.04em;
  color: var(--krem-56);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.kapida {
  padding: 4px 8px;
  border: 1px solid var(--cizgi-buton);
  background: var(--panel-acik);
  font: 600 13px/1 var(--font-govde);
  color: var(--krem);
}

/* Her düğmede: dokunma dolgusu ve kor noktası ipucu (yalnız ilk tur, spec §3). */
.dolgu {
  position: absolute;
  inset: 0;
  background: var(--bakir-30);
  opacity: 0;
  pointer-events: none;
}

.ipucu {
  position: absolute;
  top: -4px;
  right: -4px;
  display: none;
  line-height: 0;
  pointer-events: none;
}

.saha [data-ipucu] .ipucu {
  display: block;
  animation: nabiz 1.2s ease-in-out infinite;
}

/* Ocak: tahtanın kahramanı, dikeyde esner. Bakır üst kenar, karanlık tekne, köz yatağı. */
.ocak {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.tekne {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.tekneGolge {
  position: absolute;
  left: -6px;
  right: -6px;
  bottom: -14px;
  height: 40px;
  background: radial-gradient(ellipse at 50% 100%, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0) 70%);
}

.tekneUst {
  position: relative;
  height: 16px;
  background: linear-gradient(180deg, #F6C892 0%, #D08A4C 30%, #9A5428 70%, #5A2E16 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 240, 210, 0.7),
    0 2px 4px rgba(0, 0, 0, 0.6);
}

.tekneIci {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 14px 16px 0;
  background: linear-gradient(180deg, #2A1710 0%, #1A0F0C 100%);
  box-shadow:
    inset 8px 0 0 #6E3A1C,
    inset -8px 0 0 #6E3A1C,
    inset 10px 0 6px rgba(0, 0, 0, 0.5),
    inset -10px 0 6px rgba(0, 0, 0, 0.5),
    inset 0 -18px 30px rgba(255, 122, 26, 0.25),
    0 0 46px rgba(255, 122, 26, 0.28);
  overflow: hidden;
}

/* Alt kor radyali: yoğunluk komboyla (`--kor-yogunluk` .25 ... 1 > opaklık .34 ... .75). */
.tekneKoru {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 72%;
  background: radial-gradient(
    ellipse 60% 70% at 50% 100%,
    rgb(255 140 40 / 0.8),
    color-mix(in srgb, var(--kor) 18%, transparent) 50%,
    rgba(0, 0, 0, 0) 80%
  );
  opacity: calc(0.25 + var(--kor-yogunluk, 0.25) * 0.65);
  transition: opacity var(--gecis-yogunluk);
  pointer-events: none;
}

.yatakKabi {
  position: relative;
  display: block;
  height: 34px;
  margin: 8px -8px 0;
}

.tekneAlt {
  position: relative;
  height: 12px;
  background: linear-gradient(180deg, #6E3A1C, #3E1F0E);
  box-shadow: inset 0 1px 0 rgba(255, 200, 150, 0.25);
}

/* Uçan rakam ve servis hayaleti: `tepkiler.ts` yaratır, animasyon bitince siler. */
.ucanRakam {
  position: absolute;
  left: 50%;
  top: 2px;
  transform: translate(-50%, 0);
  font: 400 15.5px/1 var(--font-baslik);
  font-variant-numeric: tabular-nums;
  color: var(--bakir-acik);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  pointer-events: none;
}

.hayalet {
  position: fixed;
  z-index: 2;
  width: 72px;
  height: 54px;
  overflow: visible;
  pointer-events: none;
}

/* Duraklat perdesi (handoff 281): zemin alfa .92, 300 ms belirir. */
.perde {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  padding: 24px;
  background: color-mix(in srgb, var(--zemin) 92%, transparent);
  animation: perdeAc var(--gecis-orta) both;
}

.perdeBaslik {
  font: 400 28px/1.1 var(--font-baslik);
  color: var(--krem);
}

.perdeDugmeleri {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 300px;
}

.devam,
.cik {
  height: 56px;
  font: 600 17px/1 var(--font-govde);
  color: var(--krem);
}

.devam {
  background: var(--kor);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.cik {
  border: 1px solid var(--cizgi-buton);
}

/* Olayın karşılığı: kısa bir parlama, yalnız opaklık. */
.tam::before,
.iyi::before,
.odedi::before,
.dolu::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  /* Global kural azaltılmışta animasyonu keser; taban 0 olmazsa parlama kalıcı perde olur. */
  opacity: 0;
  animation: parla 450ms ease-out forwards;
}

.tam::before { background: var(--bakir-acik); }
.iyi::before { background: var(--bakir-40); }
.odedi::before { background: var(--bakir); }
.dolu::before { background: var(--krem-50); }

@keyframes parla {
  from { opacity: 0.7; }
  to { opacity: 0; }
}

@keyframes nabiz {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.25); }
}

@keyframes perdeAc {
  from { opacity: 0; }
}
```

- [ ] **Step 7: Sayfa: cam panel yalnız katılımda, masaüstü 420 px panel ve çevre ışığı**

`components/oyun/OyunSayfasi.tsx`:

```tsx
'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { CamPanel } from '@/components/ui/CamPanel'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { GirisEkrani } from './GirisEkrani'
import { KatilimEkrani } from './KatilimEkrani'
import { Saha } from './Saha'
import { SonucEkrani } from './SonucEkrani'
import { useOdakModu } from './useOdakModu'
import { useOyunAkisi, type Ekran } from './useOyunAkisi'
import stil from './OyunSayfasi.module.css'

/** Ekran geçişi (spec §12): Motion yalnız burada ve sonuç satırlarında; `reducedMotion="user"` kaymayı keser,
 *  opaklık kalır. */
const EKRAN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: 'easeOut' as const },
}

/** `AnimatePresence`'ın doğrudan çocuğu: anahtarlı Motion sarmalı. Giriş, oyun ve sonuç `--zemin` üstünde
 *  düz akar (K8); yalnız katılım cam panelde kalır. */
function ekran(anahtar: string, tur: Ekran, icerik: ReactNode) {
  return (
    <m.div key={anahtar} className={stil.ekran} data-ekran={tur} {...EKRAN}>
      {tur === 'katilim' ? (
        <CamPanel opaklik={0.74} bulanik={false} dolgu="orta" className={stil.panel}>
          {icerik}
        </CamPanel>
      ) : (
        icerik
      )}
    </m.div>
  )
}

export function OyunSayfasi({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  const akis = useOyunAkisi()
  useOdakModu(akis.ekran === 'oyun')
  const { tur, son } = akis

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div className={stil.sayfa} data-ekran={akis.ekran}>
          <span className={stil.cevre} aria-hidden="true" />
          {akis.ekran !== 'giris' && <h1 className={stil.gizliBaslik}>{s.oyun.baslik}</h1>}
          <AnimatePresence mode="wait" initial={false}>
            {akis.ekran === 'giris' &&
              ekran('giris', 'giris', <GirisEkrani dil={dil} basla={akis.basla} bekliyor={akis.bekliyor} />)}
            {akis.ekran === 'oyun' &&
              tur &&
              ekran(
                `oyun-${tur.tohum}`,
                'oyun',
                <Saha dil={dil} tohum={tur.tohum} ipucu={tur.ipucu} bitince={akis.bitir} cik={akis.cik} />,
              )}
            {akis.ekran === 'sonuc' &&
              son &&
              ekran(
                'sonuc',
                'sonuc',
                <SonucEkrani
                  dil={dil}
                  sonuc={son.sonuc}
                  onceki={son.onceki}
                  yeni={son.yeni}
                  tekrar={akis.basla}
                  gonderim={akis.gonderim}
                  katil={akis.katil}
                  tekrarDene={akis.tekrarDene}
                />,
              )}
            {akis.ekran === 'katilim' &&
              ekran('katilim', 'katilim', <KatilimEkrani dil={dil} kaydet={akis.kaydet} vazgec={akis.vazgec} />)}
          </AnimatePresence>
        </div>
      </LazyMotion>
    </MotionConfig>
  )
}
```

`components/oyun/OyunSayfasi.module.css`:

```css
/* Kabuğun sabit barı ve sarkan rozeti için üst pay; turda kabuk gizli, pay da kalkar. */
.sayfa {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
  align-content: start;
  min-height: 100dvh;
  padding: calc(var(--bar-boy) + var(--rozet-sarkma) + 12px) 12px 12px;
  color: var(--krem);
}

:global(body[data-odak]) .sayfa {
  padding-top: 12px;
}

/* Çevre ışığı: girişte ve sonuçta rozetin arkasında kor radyali (handoff 1a/1c), oyunda
   masaüstü panelin çevresinde 1100 px radyal ve vinyet (handoff 1b 1440). */
.cevre {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.cevre::before {
  content: '';
  position: absolute;
  left: 50%;
  top: var(--bar-boy);
  width: 560px;
  height: 560px;
  transform: translateX(-50%);
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--kor) 30%, transparent),
    color-mix(in srgb, var(--kor) 10%, transparent) 38%,
    transparent 66%
  );
}

.sayfa[data-ekran='oyun'] .cevre::before {
  top: 50%;
  width: 1100px;
  height: 1100px;
  transform: translate(-50%, -40%);
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--kor) 26%, transparent),
    color-mix(in srgb, var(--kor) 8%, transparent) 40%,
    transparent 66%
  );
}

.sayfa[data-ekran='oyun'] .cevre::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 90% at 50% 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.5));
}

/* Telefonda tam genişlik; masaüstünde oyun 420 px dikey panel, giriş iki sütun, sonuç tek sütun. */
.ekran {
  width: 100%;
  max-width: 560px;
}

.ekran[data-ekran='giris'] {
  max-width: var(--panel-en);
}

.ekran[data-ekran='oyun'] {
  max-width: 420px;
}

@media (min-width: 1041px) {
  .sayfa[data-ekran='giris'] .cevre::before {
    top: 160px;
    width: 900px;
    height: 900px;
  }

  .ekran[data-ekran='oyun'] {
    box-shadow:
      0 40px 120px rgba(0, 0, 0, 0.6),
      0 0 0 1px var(--cizgi-kart);
  }
}

.panel {
  width: 100%;
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

- [ ] **Step 8: `tepkiler.ts`: son saat 900 ms (hareket notu)**

Eski:
```ts
/** Son saat: sahne `--gece`ye geçer; iki modda da opaklık, yani azaltılmışta aynı. */
function sonSaat(alan: HTMLElement): void {
  const secenek: KeyframeAnimationOptions = { duration: 1200, easing: 'ease-out', fill: 'forwards' }
```
Yeni:
```ts
/** Son saat: sahne `--gece`ye geçer, 900 ms; iki modda da opaklık, yani azaltılmışta aynı. */
function sonSaat(alan: HTMLElement): void {
  const secenek: KeyframeAnimationOptions = { duration: 900, easing: 'ease-out', fill: 'forwards' }
```

- [ ] **Step 9: Derleme ve testler**

Run:
```bash
npm run typecheck && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)' && npm run build 2>&1 | grep -E 'error|Compiled|○ /oyun'
grep -rn "lib/sis" components/oyun; wc -l components/oyun/*.tsx components/oyun/*.css | sort -n | tail -4
```
Expected: temiz; `grep` boş (oyun `lib/sis`i içe aktarmıyor); en uzun dosya `Saha.module.css`
305 satır, `SahneOcak.module.css` 243, `Seritler.tsx` 230.

- [ ] **Step 10: Duman betiği (repo dışı)**

`/tmp/bozo-oyun/sahne/duman.mjs` (ön doğrulamada koşan betik; `out/`u 8411'de sun):

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
// Tek duman testi: giriş ve oyun yüklenir; konsol hatası, axe, yatay taşma, 44 px; 390 ve 1440.
const AXE = '/Users/mk/.npm/_npx/1fc4933a57a44b8f/node_modules/axe-core/axe.min.js'
const KOK = process.argv[2] ?? 'http://localhost:8411'
const ETIKETLER = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
const b = await chromium.launch()
for (const w of [390, 1440]) {
  const c = await b.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, isMobile: w < 600, hasTouch: w < 600 })
  const p = await c.newPage()
  const hatalar = []
  p.on('pageerror', (e) => hatalar.push(String(e)))
  p.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
  await p.route('**/tur', (r) => r.abort())
  await p.route('**/tablo', (r) => r.abort())
  const olc = async (an) => {
    await p.addScriptTag({ path: AXE })
    const r = await p.evaluate(async (e) => (await window.axe.run(document, { runOnly: { type: 'tag', values: e } })).violations, ETIKETLER)
    const o = await p.evaluate(() => ({
      tasma: document.documentElement.scrollWidth,
      kucuk: [...document.querySelectorAll('main button, main a')].map((el) => [el.getAttribute('aria-label') ?? el.textContent.trim().slice(0, 16), el.getBoundingClientRect()])
        .filter(([, r]) => r.width > 0 && (r.width < 44 || r.height < 44)).map(([ad, r]) => `${ad} ${Math.round(r.width)}x${Math.round(r.height)}`),
      defs: document.querySelectorAll('defs').length,
    }))
    console.log(w, an, 'yatay', o.tasma, '44 altı', JSON.stringify(o.kucuk), 'axe', r.length, JSON.stringify(r.map((v) => `${v.id}:${v.nodes.length}`)), 'defs', o.defs)
  }
  await p.goto(KOK + '/oyun/')
  await p.waitForLoadState('networkidle')
  await p.waitForTimeout(2600)
  await olc('giriş')
  await p.getByRole('button', { name: 'Oyna' }).click()
  await p.locator('[data-evre]').waitFor()
  await p.waitForTimeout(1500)
  await p.locator('[data-hedef="s0"]').click()
  await p.locator('[data-hedef="ciger"]').click()
  await p.waitForTimeout(1200)
  await olc('oyun')
  console.log(w, 'kare değişkenleri', await p.evaluate(() => {
    const y = document.querySelector('[data-hedef="o0"]')
    const s = document.querySelector('[data-ciz="sabir"]')
    return { gorunum: y.dataset.gorunum, oran: y.style.getPropertyValue('--oran'), pisme: y.style.getPropertyValue('--pisme'), sabir: s.dataset.sabir, sabirOran: s.style.getPropertyValue('--oran'), kor: document.querySelector('[data-ciz="kor"]').style.getPropertyValue('--kor-yogunluk'), odak: document.body.dataset.odak === '' }
  }))
  await p.getByRole('button', { name: 'Duraklat' }).click()
  await p.waitForTimeout(400)
  await olc('duraklat')
  await p.getByRole('button', { name: 'Oyundan Çık' }).click()
  await p.getByRole('button', { name: 'Oyna' }).waitFor()
  console.log(w, 'çıkış girişe döndü; konsol hataları', JSON.stringify(hatalar))
  await c.close()
}
await b.close()
```

Run: `python3 -m http.server 8411 --directory "$PWD/out" &` sonra `node /tmp/bozo-oyun/sahne/duman.mjs`
Expected (ön doğrulamadaki çıktı): her satırda `yatay` = genişlik, `44 altı []`, `axe 0 []`;
`gorunum: 'pisiyor'`, `--oran`/`--pisme` sıfırdan büyük, `kor: '0.250'`, `odak: true`;
konsolda yalnız iki `ERR_FAILED` (kesilen sahte `/tur`, `/tablo`), sayfa hatası yok.

- [ ] **Step 11: Commit**

```bash
git add components/oyun/Hud.tsx components/oyun/Hud.module.css components/oyun/SeritlerTezgah.tsx \
  components/oyun/Semboller.tsx components/oyun/Semboller.module.css components/oyun/Seritler.tsx \
  components/oyun/Saha.tsx components/oyun/Saha.module.css components/oyun/OyunSayfasi.tsx \
  components/oyun/OyunSayfasi.module.css components/oyun/tepkiler.ts
git commit -m "Switch the board to the painted scene with a visible HUD"
```

---

### Task 6: Giriş ve sonuç ekranları (K8)

**Files:**
- Replace: `components/oyun/OyunAcilisi.tsx` + `.module.css`, `GirisEkrani.tsx` + `.module.css`,
  `GirisTablosu.tsx` + `.module.css`, `SonucEkrani.tsx` + `.module.css`
- Modify: `components/oyun/SonucGonderim.tsx` (iki satır)
- Test: `npm run typecheck`, `npm test`, `npm run build`, duman betiği

**Interfaces:**
- `OyunAcilisi({ baslik, cumle, children, baglantilar, altinda? })`: `baglantilar` yeni zorunlu
  prop (telefonda en altta, masaüstünde Oyna'nın altında). `GirisTablosu({ dil })` yalnız blok;
  `GirisBaglantilari({ dil })` nav (Sıralama, Gizlilik; Kurallar yok). `SonucEkrani` props aynı;
  çevrimdışı kutusu özetin altına taşınır, `GonderimDurumu` artık `cevrimdisi` satırı basmaz.
- Açılış süreleri (hareket notu): kor 600 ms; rozet 800 ms `--gecis-egri` 600 ms gecikme, 60 px
  aşağıdan, .72 → 1; bakır halka 400 ms 1400 ms gecikme, 1 → 1.15, .6 → 0; beş kıvılcım 900 ms
  yukarı 40 px; başlık 1800, cümle 1880, Oyna 1960, sıralama bloğu 2040, bağlantılar 2120 ms.
  Azaltılmışta global kural hepsini keser, temel stiller son hâl.

- [ ] **Step 1: Açılış**

`components/oyun/OyunAcilisi.tsx`:

```tsx
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { ROZET } from '@/components/ui/Rozet'
import stil from './OyunAcilisi.module.css'

type Props = { baslik: string; cumle: string; children: ReactNode; baglantilar: ReactNode; altinda?: ReactNode }

/** Beş kıvılcım (handoff 1a): x ve y (px), gecikme (ms). Sabit dizi; her açılış aynı. */
const KIVILCIMLAR = [[-25, 130, 0], [19, 90, 80], [-45, 70, 160], [41, 40, 40], [3, 10, 120]] as const

/**
 * Giriş ekranının açılışı, handoff'un dört karesi: kor ışığı ve kıvılcım (0-0,6 sn), rozet
 * yükselir (0,6-1,4), bakır halka (1,4-1,8), metin sırayla (1,8+). Yalnız CSS; dokunuş ya da
 * tuş son hâle atlatır. Telefonda tek sütun (bağlantılar en altta); masaüstünde iki sütun: sol açılış ve
 * bağlantılar, sağ `altinda` (sıralama bloğu).
 */
export function OyunAcilisi({ baslik, cumle, children, baglantilar, altinda }: Props) {
  const [atla, setAtla] = useState(false)
  useEffect(() => {
    const tus = () => setAtla(true)
    window.addEventListener('keydown', tus, { once: true })
    return () => window.removeEventListener('keydown', tus)
  }, [])

  return (
    <section className={stil.acilis} data-atla={atla || undefined} onPointerDown={() => setAtla(true)}>
      <div className={stil.sol}>
        <div className={stil.sahne} aria-hidden="true">
          <span className={stil.kor} />
          <span className={stil.halka} />
          <img className={stil.rozet} src={ROZET} alt="" width={1748} height={1999} decoding="async" />
          <span className={stil.kivilcimlar}>
            {KIVILCIMLAR.map(([x, y, g], i) => (
              <span
                key={i}
                className={stil.kivilcim}
                style={{ '--x': `${x}px`, '--y': `${y}px`, '--g': `${g}ms` } as CSSProperties}
              />
            ))}
          </span>
        </div>
        <h1 className={stil.baslik}>{baslik}</h1>
        <p className={stil.cumle}>{cumle}</p>
        <div className={stil.eylem}>{children}</div>
      </div>
      {altinda && <div className={stil.altinda}>{altinda}</div>}
      <div className={stil.baglantilar}>{baglantilar}</div>
    </section>
  )
}
```

`components/oyun/OyunAcilisi.module.css`:

```css
/*
 * Temel stiller SON hâldir, keyframe'ler yalnız başlangıcı taşır: hareket azaltmada global
 * kural animasyonu keser ve ekran doğrudan son hâlde açılır (hareket notu, azaltılmış sütun).
 */
.acilis {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-x: clip;
  text-align: center;
}

.acilis[data-atla] *,
.acilis[data-atla] *::before {
  animation: none;
}

.sol {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Rozet 200 px, üst bardan 28 px yukarı sarkar; kor ışığı ve kıvılcım arkasında. */
.sahne {
  position: relative;
  width: 200px;
  margin-top: -28px;
}

.kor {
  position: absolute;
  z-index: -1;
  left: 50%;
  top: 50%;
  width: 560px;
  height: 560px;
  translate: -50% -50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--kor) 50%, transparent),
    color-mix(in srgb, var(--kor) 18%, transparent) 35%,
    transparent 65%
  );
  animation: tutus 600ms ease-out both;
}

.rozet {
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 24px 40px rgba(0, 0, 0, 0.6));
  animation: yuksel 800ms var(--gecis-egri) 600ms both;
}

/* Bakır halka 1,4-1,8 sn: ölçek 1 > 1,15, opaklık .6 > 0; son hâlde yok. */
.halka {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow:
    0 0 0 3px var(--bakir-60),
    0 0 90px 30px var(--bakir-28);
  opacity: 0;
  animation: parla 400ms ease-out 1400ms both;
}

.kivilcimlar {
  position: absolute;
  left: 50%;
  top: 60%;
}

/* Beş kıvılcım yukarı 40 px, 900 ms; son hâli görünmez. */
.kivilcim {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--bakir-acik);
  opacity: 0;
  animation: savrul 900ms ease-out var(--g) both;
}

.kivilcim:nth-child(2n) {
  width: 2px;
  height: 2px;
}

.baslik {
  margin: 22px 0 0;
  font: 400 40px/1.05 var(--font-baslik);
  letter-spacing: -0.025em;
  animation: belir 400ms ease-out 1800ms both;
}

.cumle {
  margin: 12px 0 0;
  font: 400 17px/1.5 var(--font-govde);
  color: var(--krem-74);
  animation: belir 400ms ease-out 1880ms both;
}

.eylem {
  width: 100%;
  margin-top: 32px;
  animation: beliris 400ms ease-out 1960ms both;
}

.altinda {
  width: 100%;
  animation: belir 400ms ease-out 2040ms both;
}

/* Telefonda en altta; alt pay mobil eylem pilinin (84 px + 18 px alt boşluk) üstünde tutar. */
.baglantilar {
  margin-top: 28px;
  padding-bottom: 110px;
  animation: belir 400ms ease-out 2120ms both;
}

@media (max-width: 359px) {
  .baslik { font-size: 36px; }
}

/* Masaüstü (handoff 1a 1440): sol sütun sola yaslı, sağda 420 px sıralama bloğu. */
@media (min-width: 1041px) {
  .acilis {
    display: grid;
    grid-template-columns: 1fr 420px;
    grid-template-rows: auto auto;
    align-items: center;
    column-gap: 64px;
    min-height: calc(100dvh - var(--bar-boy) - var(--rozet-sarkma) - 24px);
    padding: 0 64px;
    text-align: left;
  }

  .sol { align-self: end; align-items: flex-start; }
  .sahne { width: 220px; margin-top: 0; }
  .baslik { margin-top: 28px; font-size: 80px; line-height: 1; letter-spacing: -0.04em; }
  .cumle { margin-top: 16px; font-size: 19px; }
  .eylem { width: 320px; margin-top: 36px; }
  .altinda { grid-column: 2; grid-row: 1 / 3; justify-self: end; }
  .baglantilar { grid-column: 1; align-self: start; padding-bottom: 0; }
}

@keyframes tutus {
  from { opacity: 0; }
}

@keyframes yuksel {
  from { opacity: 0.72; transform: translateY(60px); }
}

@keyframes parla {
  from { opacity: 0.6; transform: scale(1); }
  to { opacity: 0; transform: scale(1.15); }
}

@keyframes savrul {
  0% { opacity: 0; transform: none; }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-40px); }
}

@keyframes belir {
  from { opacity: 0; }
}

/* Gecikme boyunca `visibility: hidden`: görünmeyen düğmeye dokunulamaz, odak da gitmez. */
@keyframes beliris {
  from { opacity: 0; visibility: hidden; }
}
```

- [ ] **Step 2: Giriş ekranı ve Oyna**

`components/oyun/GirisEkrani.tsx`:

```tsx
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { GirisBaglantilari, GirisTablosu } from './GirisTablosu'
import { OyunAcilisi } from './OyunAcilisi'
import stil from './GirisEkrani.module.css'

type Props = { dil: Dil; basla: () => void; bekliyor: boolean }

/** Giriş (spec §11, handoff 1a): açılış, Oyna 64 px, sıralama bloğu, bağlantılar. Jeton gelene kadar düğme kilitli. */
export function GirisEkrani({ dil, basla, bekliyor }: Props) {
  const s = sozluk(dil)
  return (
    <OyunAcilisi
      baslik={s.oyun.baslik}
      cumle={s.ana.gece.baslik}
      baglantilar={<GirisBaglantilari dil={dil} />}
      altinda={<GirisTablosu dil={dil} />}
    >
      <button type="button" className={stil.oyna} onClick={basla} disabled={bekliyor}>
        {s.oyun.oyna}
      </button>
    </OyunAcilisi>
  )
}
```

`components/oyun/GirisEkrani.module.css`:

```css
/* Oyna: 64 px, tam genişlik (masaüstünde 320), kor zemin, Bevan 22. */
.oyna {
  width: 100%;
  height: 64px;
  background: var(--kor);
  font: 400 22px/1 var(--font-baslik);
  color: var(--krem);
}

.oyna:disabled {
  opacity: 0.7;
}
```

- [ ] **Step 3: Sıralama bloğu ve bağlantılar**

`components/oyun/GirisTablosu.tsx`:

```tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import type { TabloYaniti } from '@/lib/oyun/aktarim'
import { api } from '@/lib/oyun/api'
import { yol } from '@/lib/site'
import stil from './GirisTablosu.module.css'

/** Giriş ekranı (spec §11, handoff 1a): haftanın ilk üçü ve son şampiyon; sunucu yoksa blok yok. */
export function GirisTablosu({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  const [tablo, setTablo] = useState<TabloYaniti | null>(null)
  useEffect(() => {
    let iptal = false
    // Sunucuya ulaşılamazsa tablo yok; giriş yine açılır, oyun çevrimdışı oynanır.
    api.tabloAl().then((t) => !iptal && setTablo(t), () => {})
    return () => {
      iptal = true
    }
  }, [])
  const sayi = (n: number) => n.toLocaleString(dil === 'en' ? 'en-GB' : 'tr-TR')
  const ad = (takmaAd: string | null) => takmaAd ?? s.oyun.siralama.gizliAd
  const ilkUc = tablo?.hafta.slice(0, 3) ?? []
  if (ilkUc.length === 0 && !tablo?.sonSampiyon) return null

  return (
    <div className={stil.tablo}>
      <div className={stil.baslikSatiri}>
        <h2 className={stil.baslik}>{s.oyun.siralama.baslik}</h2>
        <span className={stil.donem}>{s.oyun.siralama.buHafta}</span>
      </div>
      {ilkUc.length > 0 && (
        <ol className={stil.liste}>
          {ilkUc.map((satir) => (
            <li key={satir.sira} className={stil.satir}>
              <span className={stil.sira}>{satir.sira}</span>
              <span className={stil.ad}>{ad(satir.takmaAd)}</span>
              <span className={stil.puan}>{sayi(satir.puan)}</span>
            </li>
          ))}
        </ol>
      )}
      {tablo?.sonSampiyon && (
        <p className={stil.sampiyon}>
          <span className={stil.sampiyonEtiket}>{s.oyun.siralama.sonSampiyon}</span>
          <span>{ad(tablo.sonSampiyon.takmaAd)}</span>
          <span className={stil.sampiyonPuan}>{sayi(tablo.sonSampiyon.puan)}</span>
        </p>
      )}
    </div>
  )
}

/** Sıralama ve Gizlilik bağlantıları; Kurallar sayfası plan 4'te, bağlantısı yok. */
export function GirisBaglantilari({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  return (
    <nav className={stil.baglantilar} aria-label={s.oyun.baslik}>
      <Link href={yol('siralama', dil)} className={stil.baglanti}>
        {s.oyun.siralama.baslik}
      </Link>
      <Link href={yol('gizlilik', dil)} className={stil.baglanti}>
        {s.ortak.nav.gizlilik}
      </Link>
    </nav>
  )
}
```

`components/oyun/GirisTablosu.module.css`:

```css
/* Sıralama bloğu (handoff 1a 86-92): üst kenar güçlü, satırlar hayalet çizgiyle ayrılır. */
.tablo {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 32px;
  border-top: 1px solid var(--cizgi-bolum);
  text-align: left;
}

.baslikSatiri {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 8px;
}

.baslik {
  margin: 0;
  font: 600 13px/1 var(--font-govde);
  letter-spacing: 0.04em;
  color: var(--krem-56);
}

.donem {
  font: 500 13px/1 var(--font-govde);
  color: var(--krem-56);
}

.liste {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Sıra Bevan 15.5 bakır, ad Archivo 16/500, puan Bevan 16 tabular; ad taşarsa kısalır. */
.satir {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--cizgi-hayalet);
}

.sira,
.puan,
.sampiyonPuan {
  font-family: var(--font-baslik);
  font-variant-numeric: tabular-nums;
}

.sira {
  width: 20px;
  font-size: 15.5px;
  line-height: 1;
  color: var(--bakir);
}

.ad {
  flex: 1;
  overflow: hidden;
  font: 500 16px/1 var(--font-govde);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.puan {
  font-size: 16px;
  line-height: 1;
}

.sampiyon {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 0;
  padding: 12px 0;
  border-top: 1px solid var(--cizgi-bolum);
  font: 500 15.5px/1 var(--font-govde);
}

.sampiyonEtiket {
  flex: 1;
  color: var(--krem-74);
}

.sampiyonPuan {
  font-size: 15.5px;
  color: var(--bakir);
}

.baglantilar {
  display: flex;
  gap: 20px;
}

.baglanti {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font: 500 15.5px/1 var(--font-govde);
  color: var(--krem-74);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (min-width: 1041px) {
  .tablo { margin-top: 0; }
  .baslikSatiri { padding: 14px 0 10px; }
  .satir { gap: 14px; padding: 14px 0; }
  .sira { width: 24px; font-size: 17px; }
  .ad, .puan { font-size: 17px; }
  .sampiyon { padding: 16px 0; font-size: 16px; }
  .sampiyonPuan { font-size: 16px; }
  .baglantilar { gap: 24px; }
}
```

- [ ] **Step 4: Sonuç ekranı**

`components/oyun/SonucEkrani.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { m } from 'motion/react'
import { ROZET } from '@/components/ui/Rozet'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { useHareketAzaltilmisMi } from '@/lib/hareket'
import { TUR_TIK } from '@/lib/oyun/ayar'
import { oyunSaati } from '@/lib/oyun/gosterim'
import type { Sonuc } from '@/lib/oyun/tipler'
import { yol } from '@/lib/site'
import { KalktiIsareti, OcakSonerIsareti } from './Semboller'
import { GonderimDurumu, SiraSatiri } from './SonucGonderim'
import type { Gonderim } from './useOyunAkisi'
import stil from './SonucEkrani.module.css'

type Props = {
  dil: Dil
  sonuc: Sonuc
  onceki: number | null
  yeni: boolean
  tekrar: () => void
  gonderim: Gonderim
  katil: () => void
  tekrarDene: () => void
}

const SAYMA_MS = 1200
const GECIS = { duration: 0.3, ease: 'easeOut' as const }

/** Puan sayarak artar, 1,2 sn (hareket notu); azaltılmış harekette son değer doğrudan. */
function useSayac(hedef: number, azalt: boolean): number {
  const [deger, setDeger] = useState(azalt ? hedef : 0)
  useEffect(() => {
    if (azalt) {
      setDeger(hedef)
      return
    }
    const baslangic = performance.now()
    let kare = 0
    const adim = (simdi: number) => {
      const oran = Math.min(1, (simdi - baslangic) / SAYMA_MS)
      setDeger(Math.round(hedef * (1 - (1 - oran) ** 3)))
      if (oran < 1) kare = requestAnimationFrame(adim)
    }
    kare = requestAnimationFrame(adim)
    // Arka plandaki sekmede rAF durur; zamanlayıcı son değeri garanti eder.
    const emniyet = window.setTimeout(() => setDeger(hedef), SAYMA_MS + 120)
    return () => {
      cancelAnimationFrame(kare)
      clearTimeout(emniyet)
    }
  }, [hedef, azalt])
  return deger
}

/** Gecenin bitiş satırı: 05:00 ise ana sayfanın "son tane" satırı, değilse saat ve "üç sofra kalktı". */
function bitisSatiri(s: Sozluk, sonuc: Sonuc): { metin: string; geceTamam: boolean } {
  const sonTane = s.ana.hero.kilometreTaslari.find((k) => k.saat === oyunSaati(TUR_TIK))
  if (sonuc.bitti === 'gece' && sonTane) return { metin: `${sonTane.saat} · ${sonTane.metin}`, geceTamam: true }
  return { metin: `${oyunSaati(sonuc.tik)} · ${s.oyun.ucSofraKalkti}`, geceTamam: false }
}

type Sayi = (n: number) => string

/** Kişisel en iyi (spec §11, handoff 1c): "Yeni en iyi" rozeti ya da kalan fark; ilk turda satır yok. */
function EnIyi({ s, puan, onceki, yeni, sayi }: { s: Sozluk; puan: number; onceki: number | null; yeni: boolean; sayi: Sayi }) {
  if (yeni) return <span className={stil.rozetYeni}>{s.oyun.yeniEnIyi}</span>
  if (onceki === null) return null
  return (
    <p className={stil.karsilastirma}>
      {s.oyun.enIyi} <strong>{sayi(onceki)}</strong>, <strong>{sayi(onceki - puan)}</strong> {s.oyun.kaldi}
    </p>
  )
}

/** Özet (spec §11): sofra, şiş, tam kıvam, en uzun kombo; dört sütun, 100 ms arayla belirir. */
function OzetListesi({ s, sonuc, sayi }: { s: Sozluk; sonuc: Sonuc; sayi: Sayi }) {
  const satirlar = [
    [sayi(sonuc.ozet.sofra), s.oyun.ozet.sofra],
    [sayi(sonuc.ozet.sis), s.oyun.ozet.sis],
    [sayi(sonuc.ozet.tamKivam), s.oyun.ozet.tamKivam],
    [`×${sonuc.ozet.enUzunKombo}`, s.oyun.ozet.enUzunKombo],
  ] as const
  return (
    <ul className={stil.ozet}>
      {satirlar.map(([deger, etiket], i) => (
        <m.li
          key={etiket}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...GECIS, delay: 0.45 + i * 0.1 }}
        >
          <span className={stil.deger}>{deger}</span>
          <span className={stil.etiket}>{etiket}</span>
        </m.li>
      ))}
    </ul>
  )
}

/** Saat mühürlenir: satır büyükten yerine oturur; azaltılmışta Motion ölçeği keser, opaklık kalır. */
const MUHUR = { initial: { opacity: 0, scale: 1.3 }, animate: { opacity: 1, scale: 1 }, transition: GECIS }

export function SonucEkrani({ dil, sonuc, onceki, yeni, tekrar, gonderim, katil, tekrarDene }: Props) {
  const s = sozluk(dil)
  const azalt = useHareketAzaltilmisMi()
  const sayilan = useSayac(sonuc.puan, azalt)
  const puanRef = useRef<HTMLHeadingElement>(null)
  const sayi: Sayi = (n) => n.toLocaleString(dil === 'en' ? 'en-GB' : 'tr-TR')
  const satir = bitisSatiri(s, sonuc)

  // Odak puana gider: ekran okuyucu düğmeyi değil sonucu duyar. Sayım görsel, gizli metin son değer.
  useEffect(() => puanRef.current?.focus(), [])

  return (
    <section className={stil.sonuc}>
      <img className={stil.rozet} src={ROZET} alt="" width={1748} height={1999} decoding="async" />
      <m.p className={stil.satir} {...MUHUR}>
        {satir.geceTamam ? <OcakSonerIsareti boy={24} /> : <KalktiIsareti boy={24} />}
        {satir.metin}
      </m.p>
      <h2 ref={puanRef} tabIndex={-1} className={stil.puan}>
        <span className={stil.gizli}>
          {s.oyun.puan}: {sayi(sonuc.puan)}
        </span>
        <span aria-hidden="true">{sayi(sayilan)}</span>
      </h2>
      <span className={stil.puanEtiketi} aria-hidden="true">
        {s.oyun.puan}
      </span>
      <OzetListesi s={s} sonuc={sonuc} sayi={sayi} />
      <div className={stil.satirlar}>
        {gonderim.durum === 'cevrimdisi' && <p className={stil.cevrimdisi}>{s.oyun.gonderim.cevrimdisi}</p>}
        <EnIyi s={s} puan={sonuc.puan} onceki={onceki} yeni={yeni} sayi={sayi} />
        <SiraSatiri s={s} gonderim={gonderim} sayi={sayi} />
      </div>
      <button type="button" className={stil.tekrar} onClick={tekrar}>
        {s.oyun.tekrar}
      </button>
      <GonderimDurumu
        s={s}
        gonderim={gonderim}
        sayi={sayi}
        katil={katil}
        tekrarDene={tekrarDene}
        siralamaYolu={yol('siralama', dil)}
      />
    </section>
  )
}
```

`components/oyun/SonucEkrani.module.css`:

```css
/* Sonuç (handoff 1c): rozet 132, durum satırı, puan Bevan 72 bakır-açık, 4 sütun özet, 64 px Tekrar Oyna. */
.sonuc {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  text-align: center;
}

.rozet {
  width: 132px;
  height: auto;
  margin-top: -20px;
  filter: drop-shadow(0 20px 36px rgba(0, 0, 0, 0.6));
}

.satir {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 18px 0 0;
  font: 500 15.5px/1 var(--font-govde);
  font-variant-numeric: tabular-nums;
  color: var(--krem-74);
}

.puan {
  margin: 10px 0 0;
  font: 400 72px/1 var(--font-baslik);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: var(--bakir-acik);
}

.puanEtiketi {
  margin-top: 4px;
  font: 600 13px/1 var(--font-govde);
  letter-spacing: 0.04em;
  color: var(--krem-56);
}

.gizli {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.ozet {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  margin: 26px 0 0;
  padding: 0;
  border-top: 1px solid var(--cizgi-bolum);
  border-bottom: 1px solid var(--cizgi-bolum);
  list-style: none;
}

.ozet li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 0;
}

.ozet li + li {
  border-left: 1px solid var(--cizgi-hayalet);
}

.deger {
  font: 400 24px/1 var(--font-baslik);
  font-variant-numeric: tabular-nums;
}

.etiket {
  font: 500 13px/1.2 var(--font-govde);
  color: var(--krem-56);
}

/* Karşılaştırma satırları: Archivo 16/1.4 krem-74, vurgular 600 krem. */
.satirlar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  margin-top: 16px;
  font: 400 16px/1.4 var(--font-govde);
  color: var(--krem-74);
  text-align: left;
}

.satirlar:empty {
  display: none;
}

.karsilastirma,
.sira {
  margin: 0;
}

.karsilastirma strong,
.sira strong {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--krem);
}

.rozetYeni {
  padding: 5px 7px;
  background: var(--bakir-acik);
  font: 600 13px/1 var(--font-govde);
  color: var(--zemin);
}

/* Çevrimdışı tur: kenarlı uyarı kutusu (handoff 1c c). */
.cevrimdisi {
  width: 100%;
  margin: 0;
  padding: 12px 14px;
  border: 1px solid var(--cizgi-plaka);
  font: 400 15.5px/1.4 var(--font-govde);
}

.tekrar {
  width: 100%;
  height: 64px;
  margin-top: 26px;
  background: var(--kor);
  font: 400 22px/1 var(--font-baslik);
  color: var(--krem);
}

.gonderim {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  margin-top: 10px;
}

.durum {
  margin: 0;
  color: var(--krem-74);
}

/* İkincil düğme: 56 px, kenarlık; "Bu Skoru Sıralamaya Yaz" Tekrar Oyna'nın altında. */
.ikincil {
  width: 100%;
  height: 56px;
  border: 1px solid var(--cizgi-buton);
  font: 600 17px/1 var(--font-govde);
  color: var(--krem);
}

.baglantiDugme,
.baglanti {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 10px;
  font: 500 15.5px/1 var(--font-govde);
  color: var(--krem-74);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 359px) {
  .puan { font-size: 64px; }
}

@media (min-width: 1041px) {
  .sonuc { max-width: 560px; }
  .puan { font-size: 96px; }
}
```

- [ ] **Step 5: `SonucGonderim.tsx`: çevrimdışı satırı sonuç ekranına taşındı**

Üst yorumun sonuna bir satır:
```ts
 * Çevrimdışı kutusu `SonucEkrani`de, özetin altında (handoff 1c c).
```
`GonderimDurumu` içinden şu satır SİLİNİR:
```tsx
      {gonderim.durum === 'cevrimdisi' && <p className={stil.durum}>{s.oyun.gonderim.cevrimdisi}</p>}
```

- [ ] **Step 6: Doğrula ve commit**

Run: `npm run typecheck && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail)' && npm run build 2>&1 | grep -E 'error|Compiled' && node /tmp/bozo-oyun/sahne/duman.mjs`
Expected: temiz; duman çıktısı Task 5 Step 10 ile aynı (giriş 390/1440 `axe 0`, taşma yok).

```bash
git add components/oyun/OyunAcilisi.tsx components/oyun/OyunAcilisi.module.css components/oyun/GirisEkrani.tsx \
  components/oyun/GirisEkrani.module.css components/oyun/GirisTablosu.tsx components/oyun/GirisTablosu.module.css \
  components/oyun/SonucEkrani.tsx components/oyun/SonucEkrani.module.css components/oyun/SonucGonderim.tsx
git commit -m "Restyle the entry and result screens on the bare ground"
```

---

### Task 7: Hareket notu ve azaltılmış hareket (K9)

Kod bu görevde değişmez; Task 2-6'nın animasyonları handoff tablosuyla tek tek eşlenir ve
azaltılmış tercihle doğrulanır.

| Handoff anı | Kodda | Azaltılmışta |
|---|---|---|
| Giriş a (kor 600 ms, 5 kıvılcım 40 px/900 ms) | `OyunAcilisi.module.css` `tutus`, `savrul` | global kural keser; kor son hâlde (1), kıvılcım son hâlde görünmez ✓ |
| Giriş b (rozet 60 px, .72 → 1, 800 ms) | `yuksel`, `--gecis-egri`, 600 ms gecikme | son hâl (yerinde, 1) |
| Giriş c (bakır halka 1 → 1.15, .6 → 0, 400 ms) | `.halka` `parla` 1400 ms gecikme | son hâl (yok) |
| Giriş d (80 ms arayla belirme) | `belir`/`beliris` 1800-2120 ms | anında |
| Kor halkası (dashoffset; kızarma 1,5 sn) | `.hale`/`.hat` `--oran`; `[data-sabir='az']` `transition 1.5s` | aynı; geçiş anında |
| Şiş pişme (katman opaklığı; çentik 500 ms yanıp söner) | `.pismis` `--pisme`; `[data-gorunum='centik'] .centik` `centikYanip` | çentik sabit açık ✓ |
| Tam kıvam (+150 24 px, 700 ms; parlama 300 ms) | `tepkiler.ucanRakam` (28 px, 700 ms), `.tam::before` `parla` 450 ms | `+150` yerinde opaklık ✓ (plan 2) |
| Yanma (kömür 400 ms) | `.komur` `--yanma` sürekli; `[data-yanik]` hayaleti 700 ms söner | aynı (opaklık) |
| Kombo (rozet 1.3 → 1, 250 ms; ocak bir kademe 900 ms) | `muhurBas` 220 ms; `.tekneKoru`/`.sicak` `--gecis-yogunluk` | rozet belirir ✓; renk anında |
| Son saat (zemin 900 ms; ray krem → bakır 900 ms) | `tepkiler.sonSaat` 900 ms; `.dolum` `transition var(--gecis-yogunluk)` | opaklık aynı ✓ |
| Sofra kalktı (500 ms; işaret 200 ms) | `tepkiler.kalkis` 600/700 ms (plan 2) | aynı ✓ |
| Tezgah vurgu (150 ms) | `.sofra::after`, `.yayik::after` `--gecis-hizli` | anında |
| Duraklat (perde 0 → .92, 300 ms) | `.perde` `perdeAc var(--gecis-orta)` | anında (global kural; tek karelik fark, kayıtlı) |
| Sonuç puan (1,2 sn sayım; özet 100 ms arayla) | `useSayac` `SAYMA_MS` 1200; `OzetListesi` 0.45 + i×0.1 | son değer anında ✓; Motion `reducedMotion="user"` |

- [ ] **Step 1: Azaltılmış hareket denetimi (repo dışı)**

`/tmp/bozo-oyun/sahne/hareket.mjs`: duman betiğinin aynısı, `newContext`'e
`reducedMotion: 'reduce'` eklenir ve oyun ekranında şu ölçülür:
```js
await p.evaluate(() => ({
  css: document.getAnimations().filter((a) => a instanceof CSSAnimation || a instanceof CSSTransition).length,
  waapi: [...new Set(document.getAnimations().filter((a) => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition))
    .flatMap((a) => a.effect.getKeyframes().flatMap((k) => Object.keys(k).filter((x) => !['offset', 'computedOffset', 'easing', 'composite'].includes(x)))))],
  tuval: !!document.querySelector('canvas') && getComputedStyle(document.querySelector('canvas')).opacity,
}))
```
Expected: `css: 0`; `waapi` yalnız `opacity` (dokunuş ve kombo mührü); kıvılcım tuvali
`KorKivilcimi` döngüyü hiç kurmaz (plan 2 ölçümü). Giriş ekranı son hâlde açılır: rozet
`opacity 1`, `.halka` 0, kıvılcımlar 0.

- [ ] **Step 2: Bu görevde commit yok** (ölçüm Task 8'de kayda girer).

---

### Task 8: Doğrulama ve belgeler

**Files:**
- Modify: `docs/surec/IYILESTIRMELER.md`, `docs/surec/DEVAM.md`
- Test: tam takım + betikler

- [ ] **Step 1: Tam takım**

Run:
```bash
npm run typecheck && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)' && npm run build 2>&1 | grep -E 'error|Compiled|○ /oyun'
git diff a7bddf1 --stat -- lib sunucu content components/oyun/ciz.ts components/oyun/odak.ts components/oyun/useOyunAkisi.ts components/oyun/useOyunAlani.ts components/oyun/useOyunDongusu.ts
```
Expected: `tests 363`, `pass 354`, `fail 0` (`out/` varken `skipped 9`); 21 rota; son komut **boş**.

- [ ] **Step 2: Üç genişlik ve gerçek tur (repo dışı)**

`/tmp/bozo-oyun/sahne/sahne.mjs` (ön doğrulamada 390'da koştu): `/tmp/bozo-vitrin/vitrin2.mjs`
iskeleti, `/tur` ve `/tablo` sahte, `/tmp/bozo-vitrin/kayit-usta.json` gerçek zamanda
oynatılır, 6/56/108/117. saniyede kare, sonuçta `Tekrar Oyna` → ikinci turda `Duraklat` ve
`Oyundan Çık`. 320, 390, 1440 için ayrı ayrı; 1440'ta `deviceScaleFactor: 1` (2'de 2880×1800
kare alımı ana iş parçacığını durdurup kaydı simülasyondan koparıyordu, ölçüldü: tur 108.
saniyeden önce "üç sofra kalktı" ile bitti). Her karede `olc()` (axe, taşma, 44 px). Kareler
`/tmp/bozo-oyun/sahne/ng/<genişlik>-*.png`; handoff'un karşılıkları aynı dizinde `ref-06`..`ref-17`
(`/tmp/bozo-oyun/sahne/handoff-ref.mjs`, handoff klasörü 8410'da sunulur, her kutu kendi
`clip`iyle). Yan yana bakılacak çiftler: giriş 390 ↔ `ref-04`, 1440 ↔ `ref-05`; oyun normal
↔ `ref-06`, yoğun ↔ `ref-07`, son saat ↔ `ref-08`, perde ↔ `ref-09`, 320 ↔ `ref-10..13`, 1440
↔ `ref-14`; sonuç ↔ `ref-15..17`. Fark "değişen ne" listesine (Step 4).

- [ ] **Step 3: Performans kapısı (K10), tarif**

`/tmp/bozo-oyun/sahne/performans.mjs`: 390×844 `isMobile`, `deviceScaleFactor 3`; sayfa
açılınca CDP `const cdp = await c.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })`;
`Oyna` ve kayıt oynatma (`sahne.mjs` gibi); 12 sn boyunca sayfanın kendi rAF damgaları:
```js
await p.evaluate(() => { window.__kare = []; window.__uzun = []
  const d = (t) => { window.__kare.push(t); requestAnimationFrame(d) }; requestAnimationFrame(d)
  new PerformanceObserver((l) => window.__uzun.push(...l.getEntries().map((e) => e.duration))).observe({ type: 'longtask', buffered: true }) })
await p.waitForTimeout(12000)
const { kare, uzun } = await p.evaluate(() => ({ kare: window.__kare, uzun: window.__uzun }))
const sure = kare.slice(1).map((t, i) => t - kare[i]).sort((a, b) => a - b)
const q = (x) => sure[Math.floor(sure.length * x)]
console.log('kare', sure.length, 'p50', q(0.5).toFixed(1), 'p95', q(0.95).toFixed(1), 'p99', q(0.99).toFixed(1), 'en uzun', sure.at(-1).toFixed(1), '25 ms üstü', sure.filter((s) => s > 25).length, 'uzun görev', uzun.length)
```
Ölçüt: p95 ≤ 17,5 ms (plan 2: 723 kare, p95 17,8, 25 ms üstü 0, uzun görev 0) ve uzun görev 0.
Tutmazsa sırayla, her adımdan sonra yeniden ölçerek: (1) tanecik katmanı zaten `will-change:
transform` ile sabit; `.hale`'nin `filter="url(#fBlur6)"`i kaldırılıp CSS `filter: blur(5px)`
denenir (aynı görünüm, kompozitör katmanı); (2) `fGrain`/`fWood`/`fMarble` yerine build-time
üretilmiş küçük döşeme SVG'si (`public/oyun/doku-*.svg`, `background-image`, `feTurbulence`
yalnız üretimde); (3) tanecik katmanı düşürülür. Hangi adımın gerektiği `IYILESTIRMELER.md`'ye
önce/sonra sayılarıyla yazılır. **Bu plan yazılırken ölçüm yapılmadı** (sahibinin isteği);
uygulama turunda Task 8'in parçasıdır.

- [ ] **Step 4: `IYILESTIRMELER.md`**

Dosyanın SONUNA yeni bölüm (ölçüm yerleri `<…>` uygulama turunda doldurulur):

```markdown
## 9 Ekim 2026: oyun sahnesi boyalı tasarıma geçti

Sahibi plan 2'nin düz vektör sahnesini beğenmedi; `design_handoff_bozo_oyun/` boyalı, dokulu
illüstrasyon getirdi. Kararlar `docs/specs/2026-10-08-oyun-sahne-birlestirme-design.md`
(K1-K11), plan `docs/plans/2026-10-08-oyun-sahne-plani.md`. Simülasyon, sunucu, ekran akışı ve
kare değerleri sözleşmesi değişmedi; `git diff` o dosyalarda boş.

### Palet istisnası (K1)

Sahne katmanı handoff'un kendi sıcak paletini literal taşır (ceviz, pirinç, çelik, mermer,
çiğ ve pişmiş et, kömür, kor `#FF7A1A`); palet rengi olan her durak token'a bağlı
(`stop-color: var(--kor)`), palet rgb'si hiçbir modülde literal değil (`palet.test`). UI
katmanı token. `CLAUDE.md` > Colors'a ikinci istisna olarak yazıldı.

### Handoff'tan farklı olan ("değişen ne", handoff açık soru 3)

| Yer | Handoff | Kod | Neden |
|---|---|---|---|
| Giriş bağlantıları | Kurallar, Gizlilik | Sıralama, Gizlilik | Kurallar sayfası plan 4; var olmayan sayfaya bağlantı konmaz |
| Sonuç | Paylaş düğmesi, "Bu skoru sıralamaya yaz" bağlantısı | Paylaş yok; "Bu Skoru Sıralamaya Yaz" 56 px kenarlı düğme | Paylaşım kartı plan 4; eylem düğmedir, bağlantı değil |
| ×2 rozeti | Puanın yanında | Telefonda duyuru satırının sağında, masaüstünde puanın yanında | Beş haneli puanla satır 390'da 362 px > 320 px alan (ölçüldü); 320'de saat/puan Bevan 17 |
| Ocak kıvılcımları | 2/4/7 sabit nokta | `KorKivilcimi` tuvali, yoğunluk kombo ile | Spec §12 hareketli kıvılcım; azaltılmışta kapalı |
| Çevirme çentiği | 2 px çizgi | 2 px çizgi (`--centik`), bant yalnız tam kıvamda | Handoff hifi; spec §3 "bant" cümlesinden sapma |
| Yanık tane | Kömür .92 ikili | Kömür `--yanma` ile sürekli, yanınca .92 hayalet | Pencere boyunca uyarı (spec §15 renkten bağımsızlık, ray ile birlikte) |
| Fiş | En çok 3 kalem | 4+ kalem ikinci sütuna sarar | Simülasyon 5 kalemli fiş üretir (ölçüldü: 5 kalem 84 px hücreyi aşıyordu) |
| Çevrimdışı kutusu | Başlık + cümle | Sözlükteki tek cümle | Yeni metin yok |
| Giriş rozeti | Kabuk rozeti yok, 28 px bara sarkar | Kabuk rozeti kalır; büyük rozet `margin-top: -28px` | Kabuk dokunulmaz (README "mevcut pil neyse o") |
| Oyun zemini | `#1C0E0A` / `#120706` | `--zemin` / `--gece` | Handoff token eşlemesi 1d |
| Kalkmış sofra | Kalıcı hal | 700 ms geçici (hayalet) | Simülasyon kalkan sofrayı hemen boşaltır |
| Duraklat perdesi azaltılmışta | 300 ms | anında | Global `prefers-reduced-motion` kuralı |
| Raf pasifliği | `pasif` alanı | Açık ocak yuvalarının hepsi dolu | Kodda karşılığı bu |
| 320 yükseklik | 700 px'te kırpılır | Saha 781 px, kaydırır | Ray ve raf kırpılmasın |
| Duman | statik yol | statik yol (`--pisme` > .4) | aynı |

### Ölçümler

- Testler 363 (354 geçti, 9 atlandı), 21 rota. 390 ve 1440'ta giriş, oyun, perde: taşma yok,
  44 px altı hedef yok, axe 0. Usta kaydı 390'da gerçek zamanda: 24.400, kombo ×13, 05:00.
- HUD satırı (04:12, 16762, ×2): 320'de 246/250, 390'da 312/320, 1440'ta 374/374.
- Kare süresi (K10, CPU 4×, 390×844 @3, 12 sn): plan 2 p95 17,8 ms → `<p50/p95/p99, 25 ms üstü,
  uzun görev>`; gerekirse hangi K10 adımı uygulandı: `<…>`.
- Etiket kontrastı (pikselden): bölüm etiketi `--krem-56` zemin üstünde `<…>`, raf adı ceviz
  üstünde `<…>`, `+150` tekne üstünde `<…>`, duyuru HUD üstünde `<…>`; AA altı kalan: `<yok/…>`.
- Handoff karşılaştırması: `/tmp/bozo-oyun/sahne/ng/` kareleri yan yana; sahibine 8 Ekim
  vitrin kaydının (`/tmp/bozo-vitrin/`) önce/sonra hali gösterilecek.
```

- [ ] **Step 5: `DEVAM.md`**

`## Durum` listesinin BAŞINA, plan 3 maddesinin üstüne:

```markdown
- **Açılış oyunu, sahne planı bitti: boyalı illüstrasyon** (karar belgesi
  `docs/specs/2026-10-08-oyun-sahne-birlestirme-design.md`, plan
  `docs/plans/2026-10-08-oyun-sahne-plani.md`). Handoff'un gradyan ve filtreleri tek
  `SahneDefs`te (kimlik testi), sahne `Sahne*` modüllerinde, HUD görünür duyuru satırıyla,
  giriş ve sonuç cam panelsiz, masaüstünde 420 px panel. Simülasyon, sunucu, `ciz.ts`
  sözleşmesi değişmedi. "Değişen ne" listesi ve ölçümler `IYILESTIRMELER.md` > 9 Ekim 2026.
  **Açık:** K10 kare süresi ölçümü ve etiket kontrast ölçümü (tarif planın Task 8'inde),
  sahibine önce/sonra vitrin karşılaştırması. Yayında değil.
```

- [ ] **Step 6: Commit**

```bash
git add docs/surec/IYILESTIRMELER.md docs/surec/DEVAM.md
git commit -m "Record the painted scene merge: deviations and measurements"
```

---

## Sahibine sorular

1. **×2 rozetinin yeri.** Telefonda duyuru satırının sağına indi (puan beş haneli olunca satır
   sığmıyor). Puanın yanında kalması isteniyorsa saat 17 px'e iner ya da ses/duraklat 40 px'e
   düşer (44 px dokunma hedefi korunarak çevresine pay verilir); karar.
2. **Masaüstü odak modu** (handoff açık soru 1): davranış aynı, 420 px panel ortada, kabuk yok;
   itiraz varsa `useOdakModu` tek koşul.
3. **Kurallar bağlantısı ve Paylaş** bu turda yok (plan 4). Giriş ekranındaki "Sıralama"
   bağlantısı yerinde kalsın mı?
4. **320 px'te saha kaydırır** (781 px); handoff 700 px'te şişi kırpıyordu. Kaydırma kabul mü?
5. **Rozetin `drop-shadow`u** giriş ve sonuçta `<img>` üstünde (handoff); sitenin barındaki rozet
   LCP ölçümü yüzünden gölgeyi ayrı katmanda taşıyor. `/oyun` noindex prototip; LCP ölçülünce
   aynı teknik uygulanabilir.
6. **[TASLAK] metinler** (sıralama başlığı, haftalık sıra, çevrimdışı cümlesi) hâlâ onay bekliyor
   (spec §19 karar 4).

## Kapsam dışı (plan 4 ve sonraki tur)

Katılım ekranı ve sıralama sayfasının görselleri (cam panelde kalır), ödül kodu, Kurallar
sayfası ve bağlantısı, Paylaş düğmesi ve paylaşım kartı, bileşen sayfası; handoff'un mobil
eylem pili (sitedeki kalır); `/oyun` için ayrı LCP ölçümü ve rozet gölgesi katmanı.
