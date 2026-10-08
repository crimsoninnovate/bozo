# Açılış oyunu · Plan 2: görsel ve ses dili, animasyon, erişilebilirlik

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Plan 1'in gri kutulu prototipine spec'in görsel ve ses dilini (§13), animasyon ve his
tablosunu (§12) ve §15'in kalanını (canlı bölge, ok tuşları, 1-8 kısayolları) giydirmek; simülasyon
tek satır değişmeden.

**Architecture:** Oyun `KorSahnesi` kor zemini üstünde bir `CamPanel` içinde durur. Yapıyı React
çizer; her karede değişen değerleri (`--oran`, `--pisme`, `--yanma`, `--kor-yogunluk`) rAF döngüsü
`data-ciz` öğelerine korumalı yazar (`ciz.ts`). Anlık tepkiler Web Animations API ile olayın
geldiği karede başlar (`tepkiler.ts`); hedef öğeler DOM'da gizli bekler, çünkü olaylar React'in
yeniden çizmesinden önce gelir. Ekran geçişleri ve sonuç satırları Motion (`motion/react`, yalnız
`components/oyun/`). Semboller elle çizilmiş inline SVG (`Semboller.tsx`), şiş gövdesi markanın
kilitli geometrisinden. Ses Web Audio ile üretilir, varsayılan kapalı. Hareket azaltma tercihi
`useHareketAzaltilmisMi` ile WAAPI ve Motion kodunda okunur; CSS keyframe'lerini global kural keser.

**Tech Stack:** Next.js 16 App Router (statik export), React 19.2 (`useEffectEvent`), TypeScript
strict, CSS Modules + token'lar, Web Animations API, Web Audio API, `motion` 14 (`LazyMotion` +
`domAnimation`, `MotionConfig reducedMotion="user"`), `node --test`, Playwright 1.62 + axe-core 4.13.

**Spec:** `docs/specs/2026-10-08-oyun-design.md` (§12, §13, §15'in kalanı; §17 adım 3). Plan 1:
`docs/plans/2026-10-08-oyun-plan-1-prototip.md` (bu plan onun "Kapsam dışı > Plan 2" maddesini
uygular). Başlangıç noktası `feat/site-kurulumu` dalı, HEAD `947cf76`.

**Ön doğrulama.** Bu plandaki her dosya, plan yazılırken reponun `/tmp/bozo-oyun/plan2/repo`
kopyasında yazıldı ve doğrulandı: `npm run typecheck` temiz, `npm test` 254/254 (plan 1'in 238'i
artı 16 yeni), `npm run build` 17 rota ve `○ /oyun`, Motion yalnız `/oyun`un chunk'ında. Tarayıcı:
320/390/1440 px'te yatay taşma yok, 44 px altı düğme yok, konsol hatası yok, ilk ziyarette çerez
bandı yok; axe giriş/oyun/sonuç 0 ihlal; hareket azaltılmışta CSS animasyonu 0, WAAPI yalnız
`opacity`; depolama kapalıyken oyun oynanıyor, ses açılıyor, sonuç geliyor. Performans: CPU 4×
yavaşlatılmış 390×844 @3 emülasyonda 12 sn oyun, 723 kare, p50 16,7 ms, p95 17,8 ms, p99 18,5 ms,
en uzun 18,6 ms, 25 ms üstü kare 0, uzun görev 0. Kod blokları o dosyaların birebir kopyasıdır.

## Global Constraints

- **Simülasyon değişmez.** `lib/oyun/` içinde `rastgele`, `ayar`, `tipler`, `gece`, `durum`,
  `puan`, `sofra`, `ocak`, `motor`, `deneme`, `canli`, `zamanlayici` dosyalarına ve
  `motor.test.ts`'in altın kayıtlarına dokunulmaz; `git diff HEAD -- lib/oyun/motor.ts
  lib/oyun/motor.test.ts lib/oyun/ocak.ts lib/oyun/sofra.ts lib/oyun/ayar.ts lib/oyun/tipler.ts`
  plan sonunda boş çıkar. Değişen tek `lib/oyun` dosyası `gosterim.ts` (ekrana dönük okuma,
  simülasyona dönmez) ve `defter.ts` (tarayıcı tercihi).
- **Animasyon yalnız görseldir** (spec §12): hiçbir WAAPI, Motion ya da CSS kuralı simülasyona
  değer yazmaz; dokunuş `canliDokun`'a plan 1'deki gibi gider, tepki ayrı koşar.
- Hareket azaltma: CSS keyframe'lerini `styles/animasyonlar.css` keser; WAAPI (`tepkiler.ts`) ve
  Motion (`OyunSayfasi`, `SonucEkrani`) tercihi `useHareketAzaltilmisMi()` ile okur ve spec §12
  tablosunun sağ sütununu uygular (yalnız opaklık). Yeni her CSS dışı animasyon aynı yolu izler.
- Yanıp sönme saniyede 3'ü geçmez: kor noktası nabzı 1,2 s, sabır halkası nabzı 1 s; başka
  tekrar eden parlama yok.
- Yeni bağımlılık yalnız `motion` (spec §10); yalnız `components/oyun/` altından içe aktarılır,
  derleme sonrası `popLayout` dizesini (framer-motion'ın `AnimatePresence` kipi) taşıyan chunk
  yalnız `out/oyun/index.html`'den bağlanır (Task 4 adım 6 bunu ölçer). Üçüncü taraf çalışma zamanı isteği yok: semboller inline
  SVG, ses Web Audio sentezi, kıvılcım `KorKivilcimi` tuvali, font sitenin kendi fontu.
- Renk yalnız token; **yeni token yok**, `styles/` değişmez (`styles/palet.test.ts` literal
  reddeder). Keyframe kullandığı `.module.css` içinde (`styles/animasyon.test.ts`). CSS Modules
  seçicisi yerel bir sınıf içerir (`.saha [data-ipucu] .ipucu`). Köşe 0-3 px. Rakamlar Bevan 400
  `tabular-nums`, etiketler Archivo; `--font-baslik` kuralında 500+ ağırlık yazılmaz.
- Metin yalnız `content/` altında; oyun metinleri **TASLAK** (spec §19 karar 4). Em dash yok.
  Terimler: sofra, ikram, usta, tane, şiş, ocak/kor. Ürün adları menüden, gece cümleleri ana
  sayfadan okunur. Oyun alanındaki tek yazı raf etiketleri ve rakamlar (spec §3); HUD düğmeleri
  simgeli, adları `aria-label`.
- Erişilebilirlik: her hedef gerçek `<button>`, ≥ 44 px; odak halkası global `:focus-visible`
  (`--bakir`, `styles/reset.css`). Dekoratif katmanlar `aria-hidden="true"`. `aria-label` yalnız
  rolü olan öğelerde; rolsüz `<span>` etiketini `.gizli` metinle taşır.
- Fonksiyon en çok 50 satır, dosya 700, satır 120 karakter. Yorumlar kısa (CLAUDE.md > Comments).
- Testler: saf mantık `node:test` ile `lib/oyun/*.test.ts`; tarayıcı denetimleri `/tmp/bozo-oyun/plan2/`
  altındaki Playwright betikleriyle, **repoya girmez**. Betikler `out/`u
  `python3 -m http.server 8397 --directory <mutlak out yolu>` ile sunar (8391 sahibinin portu).
  **Betikler sırayla koşar:** Python sunucusunun dinleme kuyruğu 5; üç tarayıcı aynı anda açılınca
  chunk istekleri düşüyor ve sayfa hidrasyonsuz kalıyordu (ölçüldü: `ERR_SOCKET_NOT_CONNECTED`,
  "Oyna" tıklanıyor ama oyun başlamıyor). Her betik `goto`dan sonra `networkidle` bekler.
- Next 16'ya özgü yeni kod yok; plan 1'in `metadata.robots` kullanımı duruyor. `'use client'`
  yalnız sınır dosyasında (`OyunSayfasi.tsx`): `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-client.md`
  "You only need to add it to the files whose components you want to render directly within
  Server Components"; `Saha.tsx` bu yüzden yönergesini kaybeder (ertelenen inceleme maddesi 5).
- `/oyun/` prototiptir: `robots: noindex, nofollow`, sitemap'te, üst barda ve çekmecede yok. EN
  rotası yok; `content/en/oyun.ts` yalnız sözlük eşitliği için. Deploy yok, sunucu yok.
- Commit: İngilizce, emir kipi, ilk satır < 72 karakter. **`Co-Authored-By`, `Claude-Session` ya
  da benzeri imza satırı yok** (CLAUDE.md, sahibinin 12 Ağustos kararı; harness varsayılanını ezer).

## Review Focus

1. **Aynı karede birden çok önemli olay** (fiş tamam + sofra kalktı + şiş yandı): canlı bölge
   yalnız en önemlisini söyler ve saniyede bir duyuruyu geçmez; bekleyen daha önemliyse yenisi
   düşer. Test: Task 1 `duyuruSec_ayniKaredeBirkacOlay_enOnemlisiSecilir`,
   `duyurucu_saniyedeEnCokBir_aradakilerinEnOnemlisiBekler`, `duyurucu_esitOncelikteSonGelenKazanir`.
2. **120 Hz ekran ve tiksiz kare:** iki karede bir tik olmayan ekranda DOM'a hiçbir şey yazılmaz;
   değer değişmeyen kare `style`e dokunmaz. Kod: `useOyunDongusu` `ciz(oyun, adim > 0)`, `ciz.ts`
   `degiskenYaz`/`nitelikYaz` korumaları. Ölçüm: Task 4 `performans.mjs` (CPU 4×, p95 17,8 ms,
   düşen kare 0).
3. **Ses: depolama kapalı, `AudioContext` yok ya da kullanıcı hareketi geçmiş:** ses düğmesi
   basılı görünür ve tercih yazılamasa da bu turda çalar; `AudioContext` yoksa `sesCalarKur` null
   döner ve `cal` sessizce geçer; bağlam ilk sese kadar kurulmaz ve `suspended` ise `resume`
   edilir. Test: Task 4 `depolamasiz.mjs` ("ses true", sayfa hatası yok); Task 1
   `sesSec_ayniKaredeAyniSes_birKez_siraKorunur`.
4. **Hareket azaltma oturum içinde açılırsa:** sonraki her tepki yalnız opaklık, CSS nabızları
   durur, Motion kaymayı keser; kıvılcım tuvali `KorKivilcimi`'nin kendi okumasıyla söner. Test:
   Task 3 `hareket.mjs` (azaltılmışta CSS animasyonu 0, WAAPI özellikleri yalnız `opacity`).
5. **Klavye: odak şeritte değilken ok tuşu, boş şerit, duraklatılmış oyunda kısayol:** ok tuşu
   şeridin ilk/son düğmesine gider, boş şeritte hiçbir şey yapmaz, 1-8 duraklatılmışken `dokun`
   plan 1'deki gibi etkisizdir. Test: Task 1 `komsuIndeks_uclardaSarar_disaridanGirisIlkYaDaSon`,
   `kisayolHedefi_birDortSofra_besSekizOcak_digerleriNull`; Task 3 `erisim.mjs` (ok sonrası `s1`,
   Tab sonrası `o0`, her şeritte tek durak, `1` tuşu sofrayı kurar).

## Dosya haritası

| Dosya | Sorumluluk | Görev |
|---|---|---|
| `lib/oyun/gorsel.ts` | Saf gösterim hesapları: pişme/yanma oranı, kor yoğunluğu, sabır eşiği, fişte servis işaretleri | 1 |
| `lib/oyun/klavye.ts` | 1-8 kısayol eşlemesi, ok tuşu adımı, şeritte komşu indeks | 1 |
| `lib/oyun/duyuru.ts` | Canlı bölge: olaydan duyuru seçimi ve saniyede bir kısıtı | 1 |
| `lib/oyun/ses.ts` | Beş sesin tanımı ve olay eşlemesi | 1 |
| `lib/oyun/gosterim.ts` (değişir) | `Goruntu.ocak`a `kivam` ve `bant`, `Goruntu.sofralar`a `karisik` | 1 |
| `lib/oyun/defter.ts` (değişir) | Ses tercihi (`sesAcikMi`, `sesYaz`) | 1 |
| `content/{tr,en}/oyun.ts` (değişir) | `ses`, `saat`, `raf`, `kurulu`, `duyuru.*` anahtarları (TASLAK) | 2 |
| `components/oyun/Semboller.tsx` + `.module.css` | 26 elle çizilmiş SVG sembol (spec §13 tablosu) | 2 |
| `components/oyun/useOyunDongusu.ts` (değişir) | `ciz(oyun, ilerledi)`: tiksiz karede yazım yok | 3 |
| `components/oyun/ciz.ts` | Her karede korumalı DOM yazımı, kombo mührü, canlı bölge metni | 3 |
| `components/oyun/tepkiler.ts` | Spec §12 tablosunun WAAPI tepkileri, hareket azaltma dalları | 3 |
| `components/oyun/odak.ts` | Şerit içi gezici tabindex ve ok tuşları | 3 |
| `components/oyun/sesCalar.ts`, `useSes.ts` | Web Audio sentezi; tercih ve tembel bağlam | 3 |
| `components/oyun/useOyunAlani.ts` | Döngüyü sahaya bağlar: çizim, tepki, ses, duyuru, kısayollar | 3 |
| `components/oyun/Seritler.tsx` | HUD, sofralar, ocak, tezgah, raf şeritleri | 3 |
| `components/oyun/Saha.tsx` + `.module.css` (değişir) | Saha yapısı ve görsel dil; `'use client'` kalkar | 3 |
| `package.json` (değişir) | `motion` | 4 |
| `components/ui/CamPanel.tsx` (değişir) | `dolgu="yok"`: dolguyu içerik verir | 4 |
| `components/oyun/OyunSayfasi.tsx` + `.module.css` (değişir) | `KorSahnesi` + `CamPanel`, Motion ekran geçişleri | 4 |
| `components/oyun/SonucEkrani.tsx` + `.module.css` (değişir) | Sayan puan, mühürlenen saat, odak puanda, Motion satırlar | 4 |
| `CLAUDE.md`, `docs/surec/DEVAM.md` (değişir) | Belgeler (ertelenen inceleme maddesi 6) | 5 |

## Ertelenen inceleme maddeleri (plan 1 sonrası), bu planda nerede kapanıyor

1. `ogeyiCiz` her karede korumasız yazıyordu; `kareSonu` tiksiz karede `ciz` çağırıyordu: Task 3
   `ciz.ts` (`degiskenYaz`, `nitelikYaz`) ve `useOyunDongusu` (`adim > 0`).
2. `Saha` gövdesi 51 satırdı: Task 3, şeritler `Seritler.tsx`'e, bağlantı `useOyunAlani.ts`'e;
   `Saha` 55 satırlık dosyada 30 satırlık fonksiyon.
3. `SonucEkrani` `aria-live`, `autoFocus` ve rolsüz `aria-label`: Task 4 (`aria-live` yok, odak
   `h2`'deki puana, sayım `aria-hidden`, son değer `.gizli`); Task 3 HUD etiketleri `.gizli` metin.
4. `[data-son]` son ödemeyi sonsuza kadar tutuyordu: Task 3, uçan rakam (`ucanRakam`) animasyon
   bitince silinir.
5. `Saha.tsx` `'use client'` sınırında fonksiyon prop: Task 3, yönerge kalkar (yalnız istemci
   `OyunSayfasi` çağırıyor).
6. CLAUDE.md "eleven modules" / "five buckets" / `CerezOnayi` oyun rotası: Task 5.

Tohum sınırı ve fikstür ayarı plan 3'e kaldı.

## Spec §19'a bağlı kararlar

Plan bunları **kararlaştırmaz**; sahibi karar verince değişecek yer yanında:

- **1, oyun adı.** Giriş ve sekme başlığı çalışma adını gösterir (`oyun.baslik`).
- **4, oyun metinleri.** Yeni anahtarlar TASLAK: `ses`, `saat`, `raf`, `kurulu`, `duyuru.*`
  (`content/tr/oyun.ts`).
- **5, geç kalan şişin adı.** Canlı bölge "Şiş yandı" der (`duyuru.sisYandi`); "kurudu" seçilirse
  tek anahtar.
- **7, fotoğraf ve yapay zeka görseli kuralı.** Plan tamamen vektör varsayar: 26 sembol inline SVG,
  hiçbir görsel dosya yok.

## Spec ile çözülen çelişkiler

- **Sofra 84 px (§15) 320 px'te sığmıyor:** dört sütun 64 px; `min-height: 84px` ile 347 px yatay
  taşma ölçüldü. Sofra sütun kadar kare: 390'da 81 px, 320'de 64 px (§15'in "320 px'te ≥ 44 px,
  ölçülecek" cümlesi bunu kapsar), 1440'ta 130 px.
- **"Yaklaşık 28" sembol (§13):** 26 çizildi. Sabit QR ve paylaşım kartı şablonu §14'ün (plan 4)
  varlığıdır; fiş çerçevesi, ray + çentik + bantlar, tezgah yuvası ve saat rayı SVG değil CSS
  yapısıdır (daha ucuz, `--oran` ile çizilir); ses düğmesi için listede olmayan bir sembol eklendi.
- **Kor halkası, azaltılmışta "aynı, hareketsiz" (§12):** halka durum olarak kısalmaya devam eder
  (sabır bir harekettir değil bilgi), yalnız sona doğru nabız (`korNabzi`) global kuralla durur.
- **Son saat "opaklık geçişi":** iki modda da opaklık (WAAPI `[data-gece]` katmanı); CSS geçişi
  değil, çünkü global kural geçişi keserdi ve sahne tek karede kararırdı.
- **Ses "tek dokunuşla açılır" (§13):** düğme tercihi yazar; `AudioContext` tarayıcı kuralı gereği
  ilk gereken seste kurulur (`cal`), düğmede değil. Depolama kapalıysa tercih bu turda kalır.
- **Ok tuşları (§15):** Sol/Sağ gibi Yukarı/Aşağı da şerit içinde dolaşır; şeritler arası geçiş
  yalnız Tab.
- **`Goruntu` genişledi** (`kivam`, `bant`, `karisik`): `gosterim.ts` ekrana dönük modüldür
  (plan 1 Global Constraints), simülasyon dosyası değil; `gosterim.test.ts` beklentisi güncellendi.
- **`CamPanel` `dolgu="yok"`:** tasarımın üç dolgusu (40-48 px) 320 px sahada dört sütun bırakmıyor;
  panel yalnız zemin ve kenarlık verir, dolguyu `.saha` (10 px) taşır.
- **Dokunma "2 px kalkar":** düğmenin kendisi WAAPI ile kalkar; klavyeden Enter/Boşluk da aynı
  `onClick`ten geçtiği için aynı tepkiyi alır.

---

### Task 1: Saf gösterim hesapları, klavye eşlemesi, canlı bölge sırası, ses tablosu

**Files:**
- Create: `lib/oyun/gorsel.ts`, `lib/oyun/klavye.ts`, `lib/oyun/duyuru.ts`, `lib/oyun/ses.ts`
- Modify: `lib/oyun/gosterim.ts`, `lib/oyun/defter.ts`
- Test: `lib/oyun/gorsel.test.ts`, `lib/oyun/klavye.test.ts`, `lib/oyun/duyuru.test.ts`,
  `lib/oyun/ses.test.ts`, `lib/oyun/gosterim.test.ts` (beklenti güncellenir)

**Interfaces:**
- Consumes: `komboCarpani` (`puan.ts`); `OcakSisi`, `Oyun`, `Olay`, `Hedef`, `Urun` (`tipler.ts`);
  testlerde `sahne`, `dokun`, `bekle` (`deneme.ts`).
- Produces:
  - `gorsel.ts`: `pismeOrani(sis): number` (0-1), `yanmaOrani(sis): number` (0-1),
    `korYogunlugu(kombo): number` (0,25-1), `kivilcimYogunlugu(oyun): number`, `SABIR_ESIGI = 0.3`,
    `sabirDurumu(oran): 'var' | 'az'`, `servisEdilenler(fis, kalan): boolean[]`.
  - `klavye.ts`: `kisayolHedefi(tus): Hedef | null`, `okAdimi(tus): -1 | 1 | null`,
    `komsuIndeks(simdiki, adim, adet): number`.
  - `duyuru.ts`: `DuyuruAnahtari`, `Duyuru = { anahtar; puan? }`, `duyuruSec(olaylar): Duyuru | null`,
    `Duyurucu = { ekle(d); al(simdiMs): Duyuru | null }`, `duyurucuKur(aralikMs = 1000)`.
  - `ses.ts`: `SesAdi`, `SESLER`, `olayinSesi(olay): SesAdi | null`, `sesSec(olaylar): SesAdi[]`.
  - `gosterim.ts`: `Goruntu.ocak[n]` artık `{ urun, centik, pencere, kivam, bant, cevirme }`,
    `Goruntu.sofralar[n]` artık `{ fis, kalan, kurulu, odedi, karisik }`.
  - `defter.ts`: `sesAcikMi(): boolean`, `sesYaz(acik: boolean): void`.

Simülasyon dosyalarına dokunulmaz. `duyurucuKur` sınıf değil kapanış: Node'un tip silmesi
parametre özelliklerini çalıştırmaz, projede fabrika kalıbı (`rastgele`) zaten var.

- [ ] **Step 1: Write the failing tests**

`lib/oyun/gorsel.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { kivilcimYogunlugu, korYogunlugu, pismeOrani, sabirDurumu, servisEdilenler, yanmaOrani } from './gorsel.ts'
import { bekle, dokun, sahne } from './deneme.ts'

const SIS = { urun: 'ciger' as const, gecen: 0, pisme: 240, pencere: 120, bant: 30, cevirme: 'yok' as const }

test('pismeOrani_cigdenPismiseSifirBir_penceredeBirdeKalir', () => {
  assert.equal(pismeOrani({ ...SIS, gecen: 0 }), 0)
  assert.equal(pismeOrani({ ...SIS, gecen: 120 }), 0.5)
  assert.equal(pismeOrani({ ...SIS, gecen: 240 }), 1)
  assert.equal(pismeOrani({ ...SIS, gecen: 330 }), 1)
})

test('yanmaOrani_pismedenOnceSifir_pencereBoyuncaBire', () => {
  assert.equal(yanmaOrani({ ...SIS, gecen: 200 }), 0)
  assert.equal(yanmaOrani({ ...SIS, gecen: 240 }), 0)
  assert.equal(yanmaOrani({ ...SIS, gecen: 300 }), 0.5)
  assert.equal(yanmaOrani({ ...SIS, gecen: 360 }), 1)
})

test('korYogunlugu_komboKademesiyleDortBasamak', () => {
  assert.deepEqual([0, 2, 3, 6, 9, 40].map(korYogunlugu), [0.25, 0.25, 0.5, 0.75, 1, 1])
})

test('kivilcimYogunlugu_ocakBosken_sifir_sisVarkenKorIsigi', () => {
  const oyun = sahne([])
  oyun.kombo = 4
  assert.equal(kivilcimYogunlugu(oyun), 0)
  dokun(oyun, 'ciger')
  assert.equal(kivilcimYogunlugu(oyun), 0.5)
  bekle(oyun, 400)
  assert.equal(kivilcimYogunlugu(oyun), 0)
})

test('sabirDurumu_yuzdeOtuzVeAltinda_az', () => {
  assert.equal(sabirDurumu(1), 'var')
  assert.equal(sabirDurumu(0.31), 'var')
  assert.equal(sabirDurumu(0.3), 'az')
  assert.equal(sabirDurumu(0), 'az')
})

test('servisEdilenler_ayniUrundenOnceYazilanOnceServisSayilir', () => {
  assert.deepEqual(servisEdilenler(['ciger', 'ayran'], ['ciger', 'ayran']), [false, false])
  assert.deepEqual(servisEdilenler(['ciger', 'ayran'], ['ciger']), [false, true])
  assert.deepEqual(servisEdilenler(['ciger', 'ciger', 'dalak'], ['ciger', 'dalak']), [true, false, false])
  assert.deepEqual(servisEdilenler(['ciger', 'dalak', 'yurek'], []), [true, true, true])
})
```

`lib/oyun/klavye.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { kisayolHedefi, komsuIndeks, okAdimi } from './klavye.ts'

test('kisayolHedefi_birDortSofra_besSekizOcak_digerleriNull', () => {
  assert.deepEqual(
    ['1', '2', '3', '4', '5', '6', '7', '8'].map(kisayolHedefi),
    ['s0', 's1', 's2', 's3', 'o0', 'o1', 'o2', 'o3'],
  )
  assert.deepEqual(['0', '9', 'a', 'Enter', ' ', 'Numpad1'].map(kisayolHedefi), [null, null, null, null, null, null])
})

test('okAdimi_solYukariGeri_sagAsagiIleri', () => {
  const tuslar = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Tab', 'Home']
  assert.deepEqual(tuslar.map(okAdimi), [-1, -1, 1, 1, null, null])
})

test('komsuIndeks_uclardaSarar_disaridanGirisIlkYaDaSon', () => {
  assert.equal(komsuIndeks(0, 1, 4), 1)
  assert.equal(komsuIndeks(3, 1, 4), 0)
  assert.equal(komsuIndeks(0, -1, 4), 3)
  assert.equal(komsuIndeks(-1, 1, 4), 0)
  assert.equal(komsuIndeks(-1, -1, 4), 3)
  assert.equal(komsuIndeks(0, 1, 0), -1)
})
```

`lib/oyun/duyuru.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { duyurucuKur, duyuruSec } from './duyuru.ts'
import type { Olay } from './tipler.ts'

test('duyuruSec_onemliOlayYoksa_null', () => {
  const olaylar: Olay[] = [
    { tur: 'sofraGeldi', sofra: 0 },
    { tur: 'sisKondu', yuva: 0, urun: 'ciger' },
    { tur: 'evre', evre: 2 },
    { tur: 'sofraKalkti', sofra: 1, odedi: true },
  ]
  assert.equal(duyuruSec(olaylar), null)
})

test('duyuruSec_ayniKaredeBirkacOlay_enOnemlisiSecilir', () => {
  const olaylar: Olay[] = [
    { tur: 'sisYandi', yuva: 2 },
    { tur: 'fisTamam', sofra: 0, odeme: 640 },
    { tur: 'sofraKalkti', sofra: 1, odedi: false },
    { tur: 'sogudu', tezgah: 0 },
  ]
  assert.deepEqual(duyuruSec(olaylar), { anahtar: 'sofraKalkti' })
  assert.deepEqual(duyuruSec([{ tur: 'fisTamam', sofra: 0, odeme: 640 }]), { anahtar: 'fisTamam', puan: 640 })
  assert.deepEqual(duyuruSec([{ tur: 'evre', evre: 4 }, { tur: 'porsiyon' }]), { anahtar: 'sonSaat' })
})

test('duyurucu_saniyedeEnCokBir_aradakilerinEnOnemlisiBekler', () => {
  const d = duyurucuKur(1000)
  assert.equal(d.al(0), null)
  d.ekle({ anahtar: 'fisTamam', puan: 100 })
  assert.deepEqual(d.al(0), { anahtar: 'fisTamam', puan: 100 })
  d.ekle({ anahtar: 'sogudu' })
  d.ekle({ anahtar: 'sisYandi' })
  d.ekle({ anahtar: 'sogudu' })
  assert.equal(d.al(999), null)
  assert.deepEqual(d.al(1000), { anahtar: 'sisYandi' })
  assert.equal(d.al(2500), null)
})

test('duyurucu_esitOncelikteSonGelenKazanir', () => {
  const d = duyurucuKur(1000)
  d.ekle({ anahtar: 'fisTamam', puan: 100 })
  d.ekle({ anahtar: 'fisTamam', puan: 300 })
  assert.deepEqual(d.al(5000), { anahtar: 'fisTamam', puan: 300 })
})
```

`lib/oyun/ses.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SESLER, olayinSesi, sesSec } from './ses.ts'
import type { Olay } from './tipler.ts'

test('sesler_besSes_herBiriEnAzBirNota_kazancKisik', () => {
  assert.deepEqual(Object.keys(SESLER).sort(), ['cizirti', 'servis', 'sonSaat', 'tik', 'yanik'])
  for (const [ad, ses] of Object.entries(SESLER)) {
    assert.ok(ses.notalar.length >= 1, ad)
    assert.ok(ses.kazanc > 0 && ses.kazanc <= 0.2, `${ad} kazancı kulak yormamalı`)
    for (const nota of ses.notalar) assert.ok(nota.hz >= 60 && nota.hz <= 4000 && nota.ms > 0, ad)
  }
  assert.equal(SESLER.servis.notalar.length, 2)
})

test('olayinSesi_olayTurune_gore', () => {
  const ornekler: [Olay, ReturnType<typeof olayinSesi>][] = [
    [{ tur: 'sisKondu', yuva: 0, urun: 'ciger' }, 'cizirti'],
    [{ tur: 'sisCevrildi', yuva: 0, iyi: true }, 'tik'],
    [{ tur: 'sisAlindi', yuva: 0, kalite: 'tam' }, 'tik'],
    [{ tur: 'servis', sofra: 0, urun: 'ciger', kalite: 'iyi' }, 'servis'],
    [{ tur: 'sisYandi', yuva: 1 }, 'yanik'],
    [{ tur: 'sofraKalkti', sofra: 0, odedi: false }, 'yanik'],
    [{ tur: 'sofraKalkti', sofra: 0, odedi: true }, null],
    [{ tur: 'evre', evre: 4 }, 'sonSaat'],
    [{ tur: 'evre', evre: 3 }, null],
    [{ tur: 'sofraGeldi', sofra: 0 }, null],
    [{ tur: 'bitti', sebep: 'gece' }, null],
  ]
  for (const [olay, beklenen] of ornekler) assert.equal(olayinSesi(olay), beklenen, olay.tur)
})

test('sesSec_ayniKaredeAyniSes_birKez_siraKorunur', () => {
  const olaylar: Olay[] = [
    { tur: 'servis', sofra: 0, urun: 'ciger', kalite: 'tam' },
    { tur: 'servis', sofra: 0, urun: 'ayran', kalite: null },
    { tur: 'fisTamam', sofra: 0, odeme: 500 },
    { tur: 'sisYandi', yuva: 2 },
  ]
  assert.deepEqual(sesSec(olaylar), ['servis', 'yanik'])
  assert.deepEqual(sesSec([]), [])
})
```

`lib/oyun/gosterim.test.ts`'in tamamı (yalnız `goruntuAl_evreAciklariVeOcakRayi` testinin iki
beklentisi değişti: `karisik: false`, `kivam: 5 / 6`, `bant: 1 / 12`):

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
  assert.deepEqual(g.sofralar[0], {
    fis: ['ciger', 'ayran'],
    kalan: ['ciger', 'ayran'],
    kurulu: false,
    odedi: false,
    karisik: false,
  })
  assert.deepEqual(g.ocak[0], {
    urun: 'ciger',
    centik: 1 / 3,
    pencere: 2 / 3,
    kivam: 5 / 6,
    bant: 1 / 12,
    cevirme: 'yok',
  })
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

Run: `node --test lib/oyun/gorsel.test.ts lib/oyun/klavye.test.ts lib/oyun/duyuru.test.ts lib/oyun/ses.test.ts lib/oyun/gosterim.test.ts`
Expected: dört dosya `Cannot find module '.../lib/oyun/gorsel.ts'` (ve `klavye.ts`, `duyuru.ts`,
`ses.ts`) ile düşer; `gosterim.test.ts`'te `goruntuAl_evreAciklariVeOcakRayi` deepEqual ile düşer
(`karisik`, `kivam`, `bant` yok), diğer dört gosterim testi geçer.

- [ ] **Step 3: Write the implementation**

`lib/oyun/gorsel.ts`:

```ts
import { komboCarpani } from './puan.ts'
import type { OcakSisi, Oyun, Urun } from './tipler.ts'

/*
 * Görsel dilin saf hesapları (spec §12-§13): tane rengi, kor ışığı, sabır halkası,
 * fişteki servis işaretleri. Oyun durumunu değiştirmez; yalnız ekran çağırır.
 */

/** Tanenin kremden bakıra dönüşü: 0 çiğ, 1 pişti; alma penceresinde 1'de kalır. */
export function pismeOrani(sis: OcakSisi): number {
  return Math.min(1, sis.gecen / sis.pisme)
}

/** Alma penceresinde kömüre yaklaşma: 0 pencere başı, 1 yanma anı; pişmeden önce 0. */
export function yanmaOrani(sis: OcakSisi): number {
  if (sis.gecen < sis.pisme) return 0
  return Math.min(1, (sis.gecen - sis.pisme) / sis.pencere)
}

/** Ocağın kor ışığı (0-1): kombo kademesiyle bir basamak ısınır (×1 0.25 ... ×4 1). */
export function korYogunlugu(kombo: number): number {
  return komboCarpani(kombo) / 4
}

/** Kıvılcım yalnız ocakta şiş varken; yoğunluğu kor ışığı belirler. */
export function kivilcimYogunlugu(oyun: Oyun): number {
  return oyun.ocak.some((s) => s !== null) ? korYogunlugu(oyun.kombo) : 0
}

/** Kalan sabrın bu payının altında halka kızarır (spec §12). */
export const SABIR_ESIGI = 0.3

export function sabirDurumu(oran: number): 'var' | 'az' {
  return oran <= SABIR_ESIGI ? 'az' : 'var'
}

function sayim(urunler: readonly Urun[]): Map<Urun, number> {
  const m = new Map<Urun, number>()
  for (const u of urunler) m.set(u, (m.get(u) ?? 0) + 1)
  return m
}

/**
 * Fişin her kalemi için servis edildi mi: aynı üründen önce yazılanlar önce servis
 * sayılır. `fis` misafirin tam fişi, `kalan` henüz gelmeyenler.
 */
export function servisEdilenler(fis: readonly Urun[], kalan: readonly Urun[]): boolean[] {
  const fisSayisi = sayim(fis)
  const kalanSayisi = sayim(kalan)
  const gorulen = new Map<Urun, number>()
  return fis.map((u) => {
    const sira = gorulen.get(u) ?? 0
    gorulen.set(u, sira + 1)
    return sira < (fisSayisi.get(u) ?? 0) - (kalanSayisi.get(u) ?? 0)
  })
}
```

`lib/oyun/klavye.ts`:

```ts
import type { Hedef } from './tipler.ts'

/** 1-4 sofra, 5-8 ocak yuvası (spec §15). */
const KISAYOLLAR: Readonly<Record<string, Hedef>> = {
  '1': 's0',
  '2': 's1',
  '3': 's2',
  '4': 's3',
  '5': 'o0',
  '6': 'o1',
  '7': 'o2',
  '8': 'o3',
}

export function kisayolHedefi(tus: string): Hedef | null {
  return KISAYOLLAR[tus] ?? null
}

/** Şerit içi gezinme: sol ve yukarı geri, sağ ve aşağı ileri; başka tuş null. */
export function okAdimi(tus: string): -1 | 1 | null {
  if (tus === 'ArrowLeft' || tus === 'ArrowUp') return -1
  if (tus === 'ArrowRight' || tus === 'ArrowDown') return 1
  return null
}

/** Şeritteki bir sonraki odak; uçlarda sarar. Odak şeritte değilse ilk ya da son; boş şeritte -1. */
export function komsuIndeks(simdiki: number, adim: -1 | 1, adet: number): number {
  if (adet <= 0) return -1
  if (simdiki < 0 || simdiki >= adet) return adim === 1 ? 0 : adet - 1
  return (simdiki + adim + adet) % adet
}
```

`lib/oyun/duyuru.ts`:

```ts
import type { Olay } from './tipler.ts'

/*
 * Canlı bölge (spec §15): önemli anlar saniyede en çok bir kez duyurulur. Metin
 * sözlükten gelir; burada yalnız hangi anın duyurulacağı ve sırası seçilir.
 */

export type DuyuruAnahtari = 'sonSaat' | 'porsiyon' | 'sofraKalkti' | 'fisTamam' | 'sisYandi' | 'sogudu'
export type Duyuru = { anahtar: DuyuruAnahtari; puan?: number }

/** Önem sırası: büyük sayı önce söylenir. */
const ONCELIK: Readonly<Record<DuyuruAnahtari, number>> = {
  sonSaat: 6,
  porsiyon: 5,
  sofraKalkti: 4,
  fisTamam: 3,
  sisYandi: 2,
  sogudu: 1,
}

function olayDuyurusu(olay: Olay): Duyuru | null {
  switch (olay.tur) {
    case 'evre':
      return olay.evre === 4 ? { anahtar: 'sonSaat' } : null
    case 'porsiyon':
      return { anahtar: 'porsiyon' }
    case 'sofraKalkti':
      return olay.odedi ? null : { anahtar: 'sofraKalkti' }
    case 'fisTamam':
      return { anahtar: 'fisTamam', puan: olay.odeme }
    case 'sisYandi':
      return { anahtar: 'sisYandi' }
    case 'sogudu':
      return { anahtar: 'sogudu' }
    default:
      return null
  }
}

/** Karedeki olayların en önemlisi; duyurulacak bir şey yoksa null. */
export function duyuruSec(olaylar: readonly Olay[]): Duyuru | null {
  let secilen: Duyuru | null = null
  for (const olay of olaylar) {
    const d = olayDuyurusu(olay)
    if (d && (!secilen || ONCELIK[d.anahtar] > ONCELIK[secilen.anahtar])) secilen = d
  }
  return secilen
}

export type Duyurucu = {
  /** Sıraya alır; bekleyen daha önemliyse yenisi düşer. */
  ekle(duyuru: Duyuru): void
  /** Aralık dolduysa bekleyeni verir ve saati başlatır; yoksa null. */
  al(simdiMs: number): Duyuru | null
}

/** Saniyede en çok bir duyuru; aradakilerin en önemlisi bir sonraki sırayı bekler. */
export function duyurucuKur(aralikMs = 1000): Duyurucu {
  let son = Number.NEGATIVE_INFINITY
  let bekleyen: Duyuru | null = null
  return {
    ekle(duyuru) {
      if (!bekleyen || ONCELIK[duyuru.anahtar] >= ONCELIK[bekleyen.anahtar]) bekleyen = duyuru
    },
    al(simdiMs) {
      if (!bekleyen || simdiMs - son < aralikMs) return null
      const d = bekleyen
      bekleyen = null
      son = simdiMs
      return d
    },
  }
}
```

`lib/oyun/ses.ts`:

```ts
import type { Olay } from './tipler.ts'

/*
 * Ses dili (spec §13): dosya yok, beş ses Web Audio ile üretilir. Burada yalnız
 * tanımlar ve olay eşlemesi; sentez `components/oyun/sesCalar.ts`'te.
 */

export type SesAdi = 'cizirti' | 'tik' | 'servis' | 'yanik' | 'sonSaat'

export type Nota = { hz: number; ms: number }
export type SesTanimi = { tur: 'ton' | 'gurultu'; notalar: readonly Nota[]; kazanc: number }

/** Kor cızırtısı, bakır tık, servis için iki nota, yanık için alçak vuruş, son saat için derin ton. */
export const SESLER: Readonly<Record<SesAdi, SesTanimi>> = {
  cizirti: { tur: 'gurultu', notalar: [{ hz: 1800, ms: 220 }], kazanc: 0.12 },
  tik: { tur: 'ton', notalar: [{ hz: 1320, ms: 40 }], kazanc: 0.1 },
  servis: { tur: 'ton', notalar: [{ hz: 659, ms: 90 }, { hz: 988, ms: 140 }], kazanc: 0.12 },
  yanik: { tur: 'ton', notalar: [{ hz: 110, ms: 180 }], kazanc: 0.16 },
  sonSaat: { tur: 'ton', notalar: [{ hz: 82, ms: 900 }], kazanc: 0.14 },
}

/** Olayın sesi; sessiz olaylar null. */
export function olayinSesi(olay: Olay): SesAdi | null {
  switch (olay.tur) {
    case 'sisKondu':
      return 'cizirti'
    case 'sisCevrildi':
    case 'sisAlindi':
    case 'sofraKuruldu':
    case 'ayranDoldu':
      return 'tik'
    case 'servis':
      return 'servis'
    case 'sisYandi':
    case 'sogudu':
      return 'yanik'
    case 'sofraKalkti':
      return olay.odedi ? null : 'yanik'
    case 'evre':
      return olay.evre === 4 ? 'sonSaat' : null
    default:
      return null
  }
}

/** Karenin sesleri, her ad bir kez: aynı karede iki servis tek çift nota çalar. */
export function sesSec(olaylar: readonly Olay[]): SesAdi[] {
  const secilen: SesAdi[] = []
  for (const olay of olaylar) {
    const ad = olayinSesi(olay)
    if (ad && !secilen.includes(ad)) secilen.push(ad)
  }
  return secilen
}
```

`lib/oyun/gosterim.ts`'in tamamı (`Goruntu` tipi ve `goruntuAl` içindeki `sofralar`/`ocak`
eşlemeleri değişti, gerisi plan 1 ile aynı):

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
  sofralar: (
    | { fis: readonly Urun[]; kalan: readonly Urun[]; kurulu: boolean; odedi: boolean; karisik: boolean }
    | null
  )[]
  /**
   * Rayın kesirleri (0-1): çevirme çentiğinin ortası, alma penceresinin başı, tam
   * kıvam bandının ortası; `bant` iki bandın ortak genişliği.
   */
  ocak: (
    | { urun: SisUrun; centik: number; pencere: number; kivam: number; bant: number; cevirme: OcakSisi['cevirme'] }
    | null
  )[]
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
      s
        ? {
            fis: s.misafir.fis,
            kalan: [...s.kalan],
            kurulu: s.kurulu,
            odedi: s.kalkis !== null,
            karisik: s.misafir.karisik,
          }
        : null,
    ),
    ocak: oyun.ocak.map((s) => {
      if (!s) return null
      const ray = s.pisme + s.pencere
      return {
        urun: s.urun,
        centik: s.pisme / 2 / ray,
        pencere: s.pisme / ray,
        kivam: (s.pisme + s.pencere / 2) / ray,
        bant: s.bant / ray,
        cevirme: s.cevirme,
      }
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

`lib/oyun/defter.ts`'in tamamı (üst yorum, `SES` anahtarı ve son iki fonksiyon yeni):

`lib/oyun/defter.ts`:

```ts
/** Oyunun tarayıcıda tuttuğu üç şey: kişisel en iyi, ilk turun bittiği, ses tercihi (spec §3, §11, §13). */
const EN_IYI = 'bozo-oyun-en-iyi'
const ILK_TUR = 'bozo-oyun-ilk-tur-bitti'
const SES = 'bozo-oyun-ses'

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

/** Ses varsayılan kapalı; açılırsa tercih tarayıcıda kalır (spec §13). */
export function sesAcikMi(): boolean {
  try {
    return window.localStorage.getItem(SES) === '1'
  } catch {
    return false
  }
}

export function sesYaz(acik: boolean): void {
  try {
    window.localStorage.setItem(SES, acik ? '1' : '0')
  } catch {
    // Yazılamazsa tercih yalnız bu turda geçerli; bir sonraki açılışta ses yine kapalı.
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test lib/oyun/gorsel.test.ts lib/oyun/klavye.test.ts lib/oyun/duyuru.test.ts lib/oyun/ses.test.ts lib/oyun/gosterim.test.ts && node --test lib/oyun/motor.test.ts && npm run typecheck`
Expected: ilk komut `ℹ tests 21`, `ℹ pass 21` (gorsel 6, klavye 3, duyuru 4, ses 3, gosterim 5);
`motor.test.ts` `ℹ pass 8` (altın kayıtlar aynı: 40470 / 30769 / 10001); typecheck çıktısız biter.
Not: `5 / 6` ve `300 / 360` aynı çift duyarlıklı sayıdır, deepEqual tam eşitlikle geçer.

- [ ] **Step 5: Commit**

```bash
git add lib/oyun/gorsel.ts lib/oyun/gorsel.test.ts lib/oyun/klavye.ts lib/oyun/klavye.test.ts \
  lib/oyun/duyuru.ts lib/oyun/duyuru.test.ts lib/oyun/ses.ts lib/oyun/ses.test.ts \
  lib/oyun/gosterim.ts lib/oyun/gosterim.test.ts lib/oyun/defter.ts
git commit -m "Add pure display math, keyboard, live-region and sound tables"
```

---

### Task 2: Sözlük anahtarları ve elle çizilmiş semboller

**Files:**
- Modify: `content/tr/oyun.ts`, `content/en/oyun.ts`
- Create: `components/oyun/Semboller.tsx`, `components/oyun/Semboller.module.css`
- Test: mevcut `content/icerik.test.ts` (TR/EN anahtar eşitliği, boş değer, em dash)

**Interfaces:**
- Consumes: `sisGeometrisi`, `Tane` (`lib/sis.ts`, kilitli şiş geometrisi); `SisUrun`, `Urun`.
- Produces: `s.oyun.ses`, `s.oyun.saat`, `s.oyun.raf`, `s.oyun.kurulu`, `s.oyun.duyuru.{sonSaat,
  porsiyon, sofraKalkti, fisTamam, sisYandi, sogudu}` (`{puan}` yer tutucusu). Semboller, hepsi
  `aria-hidden`, `currentColor` çizgi, `boy` propu: `SofraPlakasi`, `KorHalkasi` (`pathLength=100`,
  `--oran` ile kısalır), `KalktiIsareti`, `Lebeni`, `Bostana`, `Yesillik`, `SumakliSogan`,
  `UrunSimgesi({ urun })` (tek tane siluet; ayran için maşrapa), `KarisikFis`, `UrunSisi({ urun })`
  (dikey şiş, üç katman: `.cig`, `.pismis` `--pisme`, `.komur` `--yanma`), `YanikSis`,
  `CevirmeIsareti`, `OcakYatagi`, `AcikYayik`, `BakirMasrapa({ dolu })` (`.dolum` `--oran` ile
  dolar), `KomboRozeti`, `PorsiyonRozeti`, `OcakSonerIsareti`, `DuraklatIsareti`,
  `SesIsareti({ acik })`, `KorNoktasi`.

Siluet ürünü söyler, renk değil (spec §15): ciğer kare, dalak enine oval, yürek yuvarlak köşeli
eşkenar dörtgen. Şiş gövdesi `sisGeometrisi(6)`'nın yatay geometrisini x/y değiştirerek dikey kurar;
taneler `t.ciger` ile büyük (ürün biçimi) ya da küçük (kuyruk yağı, kare) seçilir.

- [ ] **Step 1: Sözlüğe yeni anahtarları ekle**

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
  ses: 'Ses',
  saat: 'Saat',
  puan: 'Puan',
  kombo: 'Kombo',
  kapida: 'Kapıda',
  ocak: 'Ocak',
  tezgah: 'Tezgah',
  raf: 'Raf',
  sofra: 'Sofra',
  bosSofra: 'Boş sofra',
  kurulu: 'kurulu',
  ucSofraKalkti: 'üç sofra kalktı',
  /** Canlı bölge (spec §15): önemli anlar, saniyede en çok bir. `{puan}` ödemeyle değişir. */
  duyuru: {
    sonSaat: 'Son saat',
    porsiyon: 'Bir porsiyon',
    sofraKalkti: 'Sofra kalktı',
    fisTamam: 'Fiş tamam, +{puan}',
    sisYandi: 'Şiş yandı',
    sogudu: 'Şiş soğudu',
  },
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
  ses: 'Sound',
  saat: 'Time',
  puan: 'Score',
  kombo: 'Combo',
  kapida: 'At the door',
  ocak: 'Fire',
  tezgah: 'Counter',
  raf: 'Rack',
  sofra: 'Table',
  bosSofra: 'Empty table',
  kurulu: 'set',
  ucSofraKalkti: 'three tables walked out',
  duyuru: {
    sonSaat: 'Last hour',
    porsiyon: 'One portion',
    sofraKalkti: 'A table walked out',
    fisTamam: 'Ticket done, +{puan}',
    sisYandi: 'Skewer burnt',
    sogudu: 'Skewer went cold',
  },
  ozet: { sofra: 'tables', sis: 'skewers', tamKivam: 'just right', enUzunKombo: 'longest combo' },
  enIyi: 'Your best',
  yeniEnIyi: 'New best',
  kaldi: 'to go',
}
```

Run: `node --test content/icerik.test.ts`
Expected: `ℹ tests 35`, `ℹ pass 35` (anahtar eşitliği, boş değer yok, em dash yok).

- [ ] **Step 2: Sembolleri yaz**

`components/oyun/Semboller.tsx`:

```tsx
import { sisGeometrisi, type Tane } from '@/lib/sis'
import type { SisUrun, Urun } from '@/lib/oyun/tipler'
import stil from './Semboller.module.css'

/*
 * Oyunun elle çizilmiş sembolleri (spec §13): 24'lük kare, çizgi `currentColor`,
 * fotoğraf ve üretilmiş görsel yok. Hepsi dekoratif; anlam düğmenin adından gelir.
 * Şiş gövdesi markanın kilitli geometrisinden (`lib/sis.ts`) türer.
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

/* Sofra: plaka, kor halkası, kalktı işareti. Fiş çerçevesi CSS'te (`.fis`). */

/** Üstten sini: düğmenin zemini, kenara kadar dolar. */
export function SofraPlakasi() {
  return (
    <svg viewBox="0 0 24 24" className={stil.plaka} aria-hidden="true">
      <circle cx={12} cy={12} r={11} className={stil.plakaZemin} />
      <circle cx={12} cy={12} r={8.6} className={stil.plakaIc} />
    </svg>
  )
}

/** Sabır halkası: `--oran` (0-1) kadar dolu, `pathLength` 100 ile CSS'ten kısalır. */
export function KorHalkasi() {
  return (
    <svg viewBox="0 0 24 24" className={stil.halka} aria-hidden="true">
      <circle cx={12} cy={12} r={11} pathLength={100} />
    </svg>
  )
}

export function KalktiIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <circle cx={12} cy={12} r={9} strokeDasharray="3 3" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </Simge>
  )
}

/* İkram tabakları: lebeni kasesi, bostana, yeşillik, sumaklı soğan. */

export function Lebeni({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <circle cx={12} cy={12} r={7.5} />
      <path d="M8.4 12.6c1.2-1.6 2.6-1.6 3.6 0s2.4 1.6 3.6 0" />
    </Simge>
  )
}

export function Bostana({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <circle cx={12} cy={12} r={7.5} />
      <g fill="currentColor" stroke="none">
        <rect x={8.6} y={9} width={2.6} height={2.6} />
        <rect x={12.6} y={10.4} width={2.6} height={2.6} />
        <rect x={9.8} y={13.2} width={2.6} height={2.6} />
      </g>
    </Simge>
  )
}

export function Yesillik({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M12 20V7" />
      <path d="M12 11c-3.2 0-5.4-2.2-5.4-5.4 3.2 0 5.4 2.2 5.4 5.4z" />
      <path d="M12 15c3.2 0 5.4-2.2 5.4-5.4-3.2 0-5.4 2.2-5.4 5.4z" />
    </Simge>
  )
}

export function SumakliSogan({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M4 16a8 8 0 0 1 16 0" />
      <path d="M7 16a5 5 0 0 1 10 0" />
      <path d="M10 16a2 2 0 0 1 4 0" />
      <path d="M4 16h16" />
      <g fill="currentColor" stroke="none">
        <circle cx={8} cy={5.5} r={0.9} />
        <circle cx={12} cy={4.2} r={0.9} />
        <circle cx={16} cy={5.5} r={0.9} />
      </g>
    </Simge>
  )
}

/* Ürün siluetleri: tane biçimi ürünü söyler, renk değil (spec §15). */

type TaneProps = { urun: SisUrun; cx: number; cy: number; kenar: number }

/** Ciğer kare, dalak enine oval, yürek yuvarlak köşeli eşkenar dörtgen. */
function TaneSekli({ urun, cx, cy, kenar }: TaneProps) {
  if (urun === 'dalak') return <ellipse cx={cx} cy={cy} rx={kenar * 0.34} ry={kenar * 0.6} />
  if (urun === 'yurek') {
    const k = kenar * 0.76
    const donus = `rotate(45 ${cx} ${cy})`
    return <rect x={cx - k / 2} y={cy - k / 2} width={k} height={k} rx={k * 0.28} transform={donus} />
  }
  return <rect x={cx - kenar / 2} y={cy - kenar / 2} width={kenar} height={kenar} rx={kenar * 0.15} />
}

/** Fiş, tezgah ve raf simgesi: tek tane, 24'lük karede. */
export function UrunSimgesi({ urun, boy }: Boy & { urun: Urun }) {
  if (urun === 'ayran') return <BakirMasrapa boy={boy} dolu />
  return (
    <Simge boy={boy}>
      <g fill="currentColor" stroke="none">
        <TaneSekli urun={urun} cx={12} cy={12} kenar={13} />
      </g>
    </Simge>
  )
}

/** Bozo Karışık fişi: üç siluet tek çubukta. */
export function KarisikFis({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M12 2.5v19" strokeWidth={1.2} />
      <g fill="currentColor" stroke="none">
        <TaneSekli urun="ciger" cx={12} cy={6.5} kenar={5.2} />
        <TaneSekli urun="dalak" cx={12} cy={12} kenar={5.6} />
        <TaneSekli urun="yurek" cx={12} cy={17.5} kenar={5.6} />
      </g>
    </Simge>
  )
}

/* Ocak: şiş gövdesi, ürün şişi (katmanlı), yanık şiş, çevirme işareti, yatak. */

const SIS = sisGeometrisi(6)
const s = (n: number) => n.toFixed(2)

/** Kilitli geometri yatay; ocakta dikey durur: x ve y yer değiştirir, uç üstte. */
function SisGovdesi() {
  const { uzunluk, taban, bogaz } = SIS.uc
  const uc = [
    `${s(SIS.eksen)},0`,
    `${s(SIS.eksen - taban / 2)},${s(uzunluk)}`,
    `${s(SIS.cubuk.y)},${s(uzunluk + bogaz)}`,
    `${s(SIS.cubuk.y + SIS.cubuk.boy)},${s(uzunluk + bogaz)}`,
    `${s(SIS.eksen + taban / 2)},${s(uzunluk)}`,
  ].join(' ')
  return (
    <g className={stil.govde}>
      <rect x={s(SIS.cubuk.y)} y={s(SIS.cubuk.x)} width={s(SIS.cubuk.boy)} height={s(SIS.cubuk.en)} />
      <polygon points={uc} />
      <circle cx={s(SIS.halka.cy)} cy={s(SIS.halka.cx)} r={s(SIS.halka.r)} strokeWidth={s(SIS.halka.kalinlik)} />
    </g>
  )
}

function Taneler({ urun }: { urun: SisUrun }) {
  return (
    <>
      {SIS.taneler.map((t: Tane) => {
        const cx = t.y + t.kenar / 2
        const cy = t.x + t.kenar / 2
        return t.ciger ? (
          <TaneSekli key={t.x} urun={urun} cx={cx} cy={cy} kenar={t.kenar} />
        ) : (
          <rect key={t.x} className={stil.yag} x={t.y} y={t.x} width={t.kenar} height={t.kenar} rx={t.kose} />
        )
      })}
    </>
  )
}

/**
 * Ocaktaki şiş. Üç katman aynı biçim: çiğ krem, üstünde `--pisme` kadar bakır,
 * onun üstünde `--yanma` kadar kömür; renk geçişi yalnız opaklıkla.
 */
export function UrunSisi({ urun }: { urun: SisUrun }) {
  return (
    <svg viewBox={`0 0 ${s(SIS.boy)} ${s(SIS.en)}`} className={stil.sis} aria-hidden="true">
      <SisGovdesi />
      <g className={stil.cig}>
        <Taneler urun={urun} />
      </g>
      <g className={stil.pismis}>
        <Taneler urun={urun} />
      </g>
      <g className={stil.komur}>
        <Taneler urun={urun} />
      </g>
    </svg>
  )
}

/** Yanık şiş: kömür dolgu, krem kontur; renkten bağımsız okunsun diye kontur var. */
export function YanikSis() {
  return (
    <svg viewBox={`0 0 ${s(SIS.boy)} ${s(SIS.en)}`} className={stil.sis} aria-hidden="true">
      <SisGovdesi />
      <g className={stil.yanik}>
        <Taneler urun="ciger" />
      </g>
    </svg>
  )
}

export function CevirmeIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M5.5 12a6.5 6.5 0 1 1 2.3 5" />
      <path d="M7.8 13.2V17H4" />
    </Simge>
  )
}

/** Ocak yatağı: közler, en altta; `xMidYMax slice` ile şeridin dibine yaslanır. */
export function OcakYatagi() {
  const kozler = [3, 11, 19, 28, 36, 45, 54, 62, 71, 80, 88, 96]
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="xMidYMax slice" className={stil.yatak} aria-hidden="true">
      {kozler.map((x, i) => (
        <rect
          key={x}
          x={x}
          y={16 + (i % 3) * 2}
          width={2.4}
          height={2.4}
          className={i % 4 === 0 ? stil.kozSicak : stil.koz}
        />
      ))}
    </svg>
  )
}

/* İstasyon: açık yayık, bakır maşrapa. Tezgah yuvası CSS'te (`.tezgahYuva`). */

export function AcikYayik({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M8 9h8l1 11H7z" />
      <path d="M6.5 9h11M12 9V3M9.5 3h5" />
    </Simge>
  )
}

/** Maşrapa; `dolu` değilse dolum `--oran` ile alttan yükselir. */
export function BakirMasrapa({ boy, dolu = false }: Boy & { dolu?: boolean }) {
  return (
    <Simge boy={boy}>
      <rect x={6} y={6} width={10} height={13} rx={1} />
      <path d="M16 9.5h1.5a2.5 2.5 0 0 1 0 5H16" />
      <rect
        x={7.5}
        y={7.5}
        width={7}
        height={10}
        className={dolu ? stil.dolu : stil.dolum}
        fill="currentColor"
        stroke="none"
      />
    </Simge>
  )
}

/* HUD: kombo rozeti, porsiyon rozeti, ocak söner, duraklat, ses. Saat rayı CSS'te. */

export function KomboRozeti() {
  return (
    <svg viewBox="0 0 24 24" className={stil.rozet} aria-hidden="true">
      <circle cx={12} cy={12} r={11} />
      <circle cx={12} cy={12} r={8.6} strokeDasharray="1.6 1.6" />
    </svg>
  )
}

export function PorsiyonRozeti() {
  return (
    <svg viewBox="0 0 24 24" className={stil.rozet} aria-hidden="true">
      <circle cx={12} cy={12} r={11} />
      <path d="M12 1.5l1.2 2.4M12 22.5l-1.2-2.4M1.5 12l2.4-1.2M22.5 12l-2.4 1.2" />
    </svg>
  )
}

export function OcakSonerIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M5 19h14M5 15.5h14" />
      <path d="M12 12c-2.2-2.2.4-4-1.4-6.4" />
    </Simge>
  )
}

export function DuraklatIsareti({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <path d="M9 6v12M15 6v12" strokeWidth={2.2} />
    </Simge>
  )
}

export function SesIsareti({ boy, acik }: Boy & { acik: boolean }) {
  return (
    <Simge boy={boy}>
      <path d="M5 10v4h3l4 3.5v-11L8 10z" />
      {acik ? <path d="M15.5 9.5a3.6 3.6 0 0 1 0 5M18 7.5a7 7 0 0 1 0 9" /> : <path d="M15.5 9.5l4 5M19.5 9.5l-4 5" />}
    </Simge>
  )
}

/* Diğer: kor noktası ipucu. Sabit QR ve paylaşım kartı şablonu plan 4'te (spec §14). */

export function KorNoktasi({ boy }: Boy) {
  return (
    <Simge boy={boy}>
      <circle cx={12} cy={12} r={3.2} fill="currentColor" stroke="none" />
      <circle cx={12} cy={12} r={7.5} className={stil.hale} />
    </Simge>
  )
}
```

`components/oyun/Semboller.module.css`:

```css
/* Sembollerin kendi renkleri; konum ve ölçü çağıran modülde. Yalnız token. */

.plaka {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.plakaZemin {
  fill: var(--komur);
  stroke: var(--cizgi-guclu);
  stroke-width: 0.6;
}

.plakaIc {
  fill: none;
  stroke: var(--cizgi-soluk);
  stroke-width: 0.5;
}

/* Halka `--oran` kadar dolu: pathLength 100, ofset kalan pay. Üstten başlar. */
.halka {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.halka circle {
  fill: none;
  stroke: var(--kor-60);
  stroke-width: 2.4;
  stroke-dasharray: 100;
  stroke-dashoffset: calc((1 - var(--oran, 1)) * 100);
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.sis {
  display: block;
  height: 100%;
  width: auto;
  overflow: visible;
}

.govde {
  fill: currentColor;
}

.govde circle {
  fill: none;
  stroke: currentColor;
}

/* Kuyruk yağı: çiğde de pişmişte de bir ton açık kalsın. */
.yag {
  opacity: 0.8;
}

/* Üç katman aynı biçim: krem altta, bakır `--pisme`, kömür `--yanma` kadar üstte. */
.cig {
  fill: var(--krem);
}

.pismis {
  fill: var(--bakir);
  opacity: var(--pisme, 0);
}

.komur {
  fill: var(--komur);
  opacity: calc(var(--yanma, 0) * 0.8);
}

/* Yanık: kömür dolgu, krem kontur (spec §13); kontur renkten bağımsız okunur. */
.yanik {
  fill: var(--komur);
  stroke: var(--krem-50);
  stroke-width: 0.5;
}

.yatak {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 26px;
}

.koz {
  fill: var(--kor);
  opacity: 0.7;
}

.kozSicak {
  fill: var(--bakir);
  opacity: 0.85;
}

/* Maşrapa dolumu alttan yükselir; `fill-box` olmadan ölçek viewBox'ın köşesinden alınır. */
.dolum {
  transform: scaleY(var(--oran, 0));
  transform-origin: bottom;
  transform-box: fill-box;
}

.dolu {
  opacity: 0.85;
}

.rozet {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.2;
}

.hale {
  opacity: 0.5;
}
```

- [ ] **Step 3: Typecheck ve test**

Run: `npm run typecheck && npm test`
Expected: typecheck temiz; `ℹ pass 254`, `ℹ fail 0` (`styles/palet.test.ts` literal bulmaz,
`styles/animasyon.test.ts` yetim keyframe bulmaz). Henüz hiçbir bileşen sembolleri çağırmıyor;
`noUnusedLocals` dışa aktarılanlara bakmaz.

- [ ] **Step 4: Commit**

```bash
git add content/tr/oyun.ts content/en/oyun.ts components/oyun/Semboller.tsx components/oyun/Semboller.module.css
git commit -m "Add the game's hand-drawn symbol set and copy keys"
```

---

### Task 3: Saha görsel dili: şeritler, kare çizimi, WAAPI tepkiler, ses, klavye, canlı bölge

**Files:**
- Modify: `components/oyun/useOyunDongusu.ts`, `components/oyun/Saha.tsx`, `components/oyun/Saha.module.css`
- Create: `components/oyun/ciz.ts`, `components/oyun/tepkiler.ts`, `components/oyun/odak.ts`,
  `components/oyun/sesCalar.ts`, `components/oyun/useSes.ts`, `components/oyun/useOyunAlani.ts`,
  `components/oyun/Seritler.tsx`
- Test: `npm run typecheck`, `npm test`, `npm run build`; üç tarayıcı betiği (`/tmp` altında)

**Interfaces:**
- Consumes: Task 1 ve 2'nin hepsi; `KorKivilcimi` (`components/ember/`), `useHareketAzaltilmisMi`
  (`lib/hareket`), `ipucuHedefi`, `oyunSaati`, `sisGorunumu`, `goruntuAl`, `canli*`, `adimSayisi`.
- Produces: `useOyunDongusu({ tohum, ciz: (oyun, ilerledi) => void, tepki, bitince })` (imza
  değişti); `sahayiCiz(alan, oyun, ipucu, azalt)`, `duyuruYaz(alan, duyuru, metinler)`,
  `degiskenYaz`, `metinYaz` (`ciz.ts`); `dokunus(el, azalt)`, `muhurBas(el, azalt)`,
  `olaylaraTepki(alan, olaylar, azalt)` (`tepkiler.ts`); `seritleriDuzenle(alan)`, `seritOdagi(e)`,
  `seritTusu(e)` (`odak.ts`); `sesCalarKur(): SesCalar | null`; `useSes(): Ses`;
  `useOyunAlani({ kok, tohum, ipucu, metin, bitince })` → `{ goruntu, dokun(hedef, el), duraklatildi,
  duraklat, devam, azalt, ses }`; `Hud`, `Sofralar`, `Ocak`, `Tezgah`, `Raf` (`Seritler.tsx`);
  `Saha({ dil, tohum, ipucu, bitince })` (props aynı, Task 4 aynen çağırır).

DOM sözleşmesi (betikler ve `tepkiler.ts` buna dayanır): her simülasyon hedefi `[data-hedef]`
düğmesi ve içinde `[data-dolgu]` ile `.ipucu`; sofrada `[data-tabak]`×4, `[data-fis]`,
`[data-kalkti]`, `[data-ciz="sabir"]`; yuvada `[data-sis]`, `[data-yanik]`, `[data-kivilcim]`;
tezgah `[data-tezgah]`, yuvaları `[data-tezgah-yuva]`, kalemleri `[data-urun]`; HUD
`[data-rozet="kombo"|"porsiyon"]`, `[data-kombo]`; sahada `[data-gece]`, `[data-duyuru]`,
`[data-serit]` bölümler; `data-evre` sahaya her karede yazılır.

- [ ] **Step 1: Döngü kancası: tiksiz karede çizim yok**

`components/oyun/useOyunDongusu.ts`:

```ts
import { useEffect, useEffectEvent, useState } from 'react'
import { canliAdim, canliBaslat, canliDokun } from '@/lib/oyun/canli'
import { goruntuAl } from '@/lib/oyun/gosterim'
import type { Hedef, Olay, Oyun, Sonuc } from '@/lib/oyun/tipler'
import { adimSayisi } from '@/lib/oyun/zamanlayici'

type Secenek = {
  tohum: number
  /** Her karede çağrılır; `ilerledi` false ise bu karede tik olmadı (120 Hz ekran), DOM yazımı atlanır. */
  ciz: (oyun: Oyun, ilerledi: boolean) => void
  /** Karede olan olaylar; anlık tepkiler için. */
  tepki: (olaylar: Olay[]) => void
  bitince: (sonuc: Sonuc) => void
}

/** Sekme arka plana geçince oyun duraklar; otomatik başlama yok (spec §15). Setter sabit, abonelik bir kez. */
function useGizleninceDuraklat(setDuraklatildi: (durum: boolean) => void): void {
  useEffect(() => {
    const gizlenince = () => {
      if (document.hidden) setDuraklatildi(true)
    }
    document.addEventListener('visibilitychange', gizlenince)
    return () => document.removeEventListener('visibilitychange', gizlenince)
  }, [setDuraklatildi])
}

/**
 * Sabit adımlı oyun döngüsü (spec §10). Simülasyon tikte, çizim karede ilerler; React
 * yalnız olay olunca yeniden çizer, sürekli değerleri `ciz` doğrudan yazar.
 */
export function useOyunDongusu({ tohum, ciz, tepki, bitince }: Secenek) {
  const [canli] = useState(() => canliBaslat(tohum))
  const [goruntu, setGoruntu] = useState(() => goruntuAl(canli.oyun))
  const [duraklatildi, setDuraklatildi] = useState(false)

  const kareSonu = useEffectEvent((olaylar: Olay[], adim: number) => {
    if (olaylar.length > 0) {
      setGoruntu(goruntuAl(canli.oyun))
      tepki(olaylar)
    }
    ciz(canli.oyun, adim > 0)
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
      kareSonu(olaylar, sonuc.adim)
      if (!canli.oyun.bitti) istek = requestAnimationFrame(kare)
    }
    istek = requestAnimationFrame(kare)
    return () => cancelAnimationFrame(istek)
  }, [canli, duraklatildi])

  useGizleninceDuraklat(setDuraklatildi)

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

- [ ] **Step 2: Kare çizimi**

`components/oyun/ciz.ts`:

```ts
import { AYRAN_TIK, SOGUMA_TIK, TUR_TIK } from '@/lib/oyun/ayar'
import type { Duyuru } from '@/lib/oyun/duyuru'
import { kivilcimYogunlugu, korYogunlugu, pismeOrani, sabirDurumu, yanmaOrani } from '@/lib/oyun/gorsel'
import { oyunSaati, sisGorunumu } from '@/lib/oyun/gosterim'
import { komboCarpani } from '@/lib/oyun/puan'
import type { Hedef, Oyun } from '@/lib/oyun/tipler'
import { muhurBas } from './tepkiler'

/*
 * Her karede değişen değerler DOM'a buradan yazılır (spec §10): React'e uğramaz.
 * Her yazım korumalı: değer aynıysa stile dokunulmaz, 120 Hz ekranda boş kare
 * yazmaz; ölçüldü, korumasız `--oran` yazımı her karede stil yeniden hesaplatıyordu.
 */

const sonDegerler = new WeakMap<HTMLElement, Record<string, string>>()

export function degiskenYaz(el: HTMLElement, ad: string, deger: number): void {
  const yeni = deger.toFixed(3)
  const kayit = sonDegerler.get(el) ?? {}
  if (kayit[ad] === yeni) return
  kayit[ad] = yeni
  sonDegerler.set(el, kayit)
  el.style.setProperty(ad, yeni)
}

export function metinYaz(el: HTMLElement | null, metin: string): void {
  if (el && el.textContent !== metin) el.textContent = metin
}

function nitelikYaz(el: HTMLElement, ad: string, deger: string): void {
  if (el.dataset[ad] !== deger) el.dataset[ad] = deger
}

/** Çarpan değişince rakam yazılır; yükseldiyse rozet mühür gibi basılır (spec §12). */
function komboYaz(el: HTMLElement, kombo: number, azalt: boolean): void {
  const carpan = komboCarpani(kombo)
  const onceki = Number(el.dataset.carpan ?? 1)
  if (carpan === onceki) return
  el.dataset.carpan = String(carpan)
  metinYaz(el.querySelector<HTMLElement>('[data-kombo]'), `×${carpan}`)
  if (carpan > onceki) muhurBas(el, azalt)
}

function ocagiCiz(el: HTMLElement, oyun: Oyun, no: number): void {
  const sis = oyun.ocak[no]
  if (!sis) return nitelikYaz(el, 'gorunum', 'bos')
  nitelikYaz(el, 'gorunum', sisGorunumu(sis))
  degiskenYaz(el, '--oran', sis.gecen / (sis.pisme + sis.pencere))
  degiskenYaz(el, '--pisme', pismeOrani(sis))
  degiskenYaz(el, '--yanma', yanmaOrani(sis))
}

/** Bir çizim öğesinin bu karedeki değeri; `data-ciz` adına göre. */
function ogeyiCiz(el: HTMLElement, oyun: Oyun, azalt: boolean): void {
  const no = Number(el.dataset.no)
  const sofra = oyun.sofralar[no]
  const kalem = oyun.tezgah[no]
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
      const oran = sofra ? sofra.sabir / sofra.toplamSabir : 0
      degiskenYaz(el, '--oran', oran)
      return nitelikYaz(el, 'sabir', sabirDurumu(oran))
    }
    case 'ocak':
      return ocagiCiz(el, oyun, no)
    case 'soguma':
      return degiskenYaz(el, '--oran', kalem ? 1 - kalem.bekleme / SOGUMA_TIK : 0)
    case 'ayran':
      return degiskenYaz(el, '--oran', oyun.ayran === null ? 0 : 1 - oyun.ayran / AYRAN_TIK)
    case 'kor':
      return degiskenYaz(el, '--kor-yogunluk', korYogunlugu(oyun.kombo))
    case 'kivilcim':
      return degiskenYaz(el, '--oran', kivilcimYogunlugu(oyun))
  }
}

/** Bütün `data-ciz` öğeleri, ipucu halkası ve evre niteliği. */
export function sahayiCiz(alan: HTMLElement, oyun: Oyun, ipucu: Hedef | null, azalt: boolean): void {
  for (const el of alan.querySelectorAll<HTMLElement>('[data-ciz]')) ogeyiCiz(el, oyun, azalt)
  for (const el of alan.querySelectorAll<HTMLElement>('[data-hedef]')) {
    el.toggleAttribute('data-ipucu', el.dataset.hedef === ipucu)
  }
  nitelikYaz(alan, 'evre', String(oyun.evre))
}

/** Canlı bölgeye bu karenin duyurusu; metin sözlükten, `{puan}` ödemeyle değişir. */
export function duyuruYaz(alan: HTMLElement, duyuru: Duyuru | null, metinler: Record<Duyuru['anahtar'], string>): void {
  if (!duyuru) return
  const bolge = alan.querySelector<HTMLElement>('[data-duyuru]')
  if (!bolge) return
  bolge.textContent = metinler[duyuru.anahtar].replace('{puan}', String(duyuru.puan ?? ''))
}
```

- [ ] **Step 3: Anlık tepkiler (spec §12 tablosu)**

`components/oyun/tepkiler.ts`:

```ts
import { PUAN } from '@/lib/oyun/ayar'
import type { Olay } from '@/lib/oyun/tipler'
import stil from './Saha.module.css'

/*
 * Anlık tepkiler (spec §12), Web Animations API ile: tepki aynı karede başlar,
 * 300 ms'yi geçmez, simülasyona dokunmaz. Hareket azaltılmışta tabloya göre yalnız
 * opaklık kalır; global CSS kuralı WAAPI'ye ulaşmadığı için tercih burada okunur.
 * Olaylar React'in yeniden çizmesinden ÖNCE gelir: hedef öğeler hep DOM'da durur
 * (tabaklar, yanık şiş, rozetler gizli bekler), tezgah kalemi henüz yerindedir.
 */

const ANLIK: KeyframeAnimationOptions = { duration: 120, easing: 'ease-out' }
const EGRI = 'cubic-bezier(0.2, 0.7, 0.2, 1)'
const DONUS: KeyframeAnimationOptions = { duration: 180, easing: 'ease-in-out' }

const hedef = (alan: HTMLElement, h: string) => alan.querySelector<HTMLElement>(`[data-hedef="${h}"]`)
const opaklik = (bas: number, son: number): Keyframe[] => [{ opacity: bas }, { opacity: son }]

/** Dokunma: hedef 2 px kalkar, dolgu 120 ms; azaltılmışta yalnız dolgu. */
export function dokunus(el: HTMLElement | null, azalt: boolean): void {
  if (!el) return
  el.querySelector<HTMLElement>('[data-dolgu]')?.animate(opaklik(0.85, 0), ANLIK)
  if (azalt) return
  const y = (px: number) => ({ transform: `translateY(${px}px)` })
  el.animate([y(0), { ...y(-2), offset: 0.4 }, y(0)], ANLIK)
}

/** Sınıfı söküp takar: CSS parlaması baştan oynar (global kural azaltılmışta kapatır). */
function parla(el: HTMLElement | null, sinif: string | undefined): void {
  if (!el || !sinif) return
  el.classList.remove(sinif)
  void el.offsetWidth
  el.classList.add(sinif)
}

/** Rozet mühür gibi basılır; azaltılmışta belirir. */
export function muhurBas(el: HTMLElement, azalt: boolean): void {
  const kareler = azalt
    ? opaklik(0, 1)
    : [{ transform: 'scale(1.7)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }]
  el.animate(kareler, { duration: 220, easing: EGRI })
}

/** "+150" ya da fiş ödemesi yükselir; azaltılmışta yerinde belirip söner. */
function ucanRakam(el: HTMLElement | null, metin: string, azalt: boolean): void {
  if (!el) return
  const rakam = document.createElement('span')
  rakam.className = stil.ucanRakam ?? ''
  rakam.textContent = metin
  el.append(rakam)
  const kareler: Keyframe[] = azalt
    ? [{ opacity: 0 }, { opacity: 1, offset: 0.2 }, { opacity: 1, offset: 0.75 }, { opacity: 0 }]
    : [
        { opacity: 0, transform: 'translate(-50%, 0)' },
        { opacity: 1, offset: 0.2 },
        { opacity: 0, transform: 'translate(-50%, -28px)' },
      ]
  const kaldir = () => rakam.remove()
  rakam.animate(kareler, { duration: 700, easing: 'ease-out' }).finished.then(kaldir, kaldir)
}

/** İkram tabakları sırayla iner, lebeni önce; azaltılmışta çapraz geçiş. */
function tabaklarIner(sofra: HTMLElement | null, azalt: boolean): void {
  sofra?.querySelectorAll<HTMLElement>('[data-tabak]').forEach((tabak, i) => {
    const kareler = azalt
      ? opaklik(0, 1)
      : [
          { opacity: 0, transform: 'translateY(-10px) scale(1.3)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ]
    tabak.animate(kareler, { duration: 200, delay: i * 70, easing: 'ease-out', fill: 'backwards' })
  })
}

/** 180 ms dönüş ve çevrilen yüzde küçük kıvılcım; azaltılmışta yüz anında değişir (CSS). */
function cevir(yuva: HTMLElement | null, azalt: boolean): void {
  if (!yuva || azalt) return
  yuva.querySelector('[data-sis]')?.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(180deg)' }], DONUS)
  const kivilcim = [
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: 0, transform: 'translateY(-14px)' },
  ]
  yuva.querySelector('[data-kivilcim]')?.animate(kivilcim, { duration: 220, easing: 'ease-out' })
}

function titre(): void {
  if ('vibrate' in navigator) navigator.vibrate(12)
}

/** Şiş tezgahtan sofraya kavisle uçar (250 ms), tabak oturur; azaltılmışta çapraz geçiş. */
function servisUcusu(alan: HTMLElement, sofra: HTMLElement | null, urun: string, azalt: boolean): void {
  const kalem = alan.querySelector<HTMLElement>(`[data-tezgah] [data-urun="${urun}"] svg`)
  if (!sofra || !kalem) return
  const fis = sofra.querySelector<HTMLElement>('[data-fis]')
  if (azalt) {
    fis?.animate(opaklik(0.2, 1), { duration: 250, easing: 'ease-out' })
    return
  }
  const hayalet = kalem.cloneNode(true) as SVGElement
  hayalet.setAttribute('class', stil.hayalet ?? '')
  const a = kalem.getBoundingClientRect()
  const b = sofra.getBoundingClientRect()
  hayalet.style.left = `${a.left}px`
  hayalet.style.top = `${a.top}px`
  document.body.append(hayalet)
  const dx = b.left + b.width / 2 - a.left - a.width / 2
  const dy = b.top + b.height / 2 - a.top - a.height / 2
  const kavis = [
    { transform: 'translate(0, 0) scale(1)' },
    { transform: `translate(${dx / 2}px, ${Math.min(dy / 2, 0) - 36}px) scale(1.25)`, offset: 0.5 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.9)` },
  ]
  const kaldir = () => hayalet.remove()
  hayalet.animate(kavis, { duration: 250, easing: 'ease-in-out' }).finished.then(kaldir, kaldir)
  const oturma = [{ transform: 'scale(1)' }, { transform: 'scale(1.12)', offset: 0.5 }, { transform: 'scale(1)' }]
  fis?.animate(oturma, { duration: 160, delay: 250, easing: 'ease-out' })
}

/** Halka söner, sofra kararıp kaybolur, boş sofra geri gelir; hepsi opaklık. */
function kalkis(sofra: HTMLElement | null): void {
  if (!sofra) return
  const kareler = [{ opacity: 1 }, { opacity: 0.15, offset: 0.5 }, { opacity: 1 }]
  sofra.animate(kareler, { duration: 600, easing: 'ease-in-out' })
  sofra.querySelector('[data-kalkti]')?.animate(opaklik(1, 0), { duration: 700, easing: 'ease-in' })
}

/** Raf sallanır (spec §3); azaltılmışta yalnız dolu parlaması. */
function salla(el: HTMLElement | null, azalt: boolean): void {
  parla(el, stil.dolu)
  if (!el || azalt) return
  const x = (px: number) => ({ transform: `translateX(${px}px)` })
  el.animate([x(0), x(-3), x(3), x(-2), x(0)], { duration: 250, easing: 'ease-out' })
}

function porsiyonRozeti(alan: HTMLElement, azalt: boolean): void {
  const kareler = [
    { opacity: 0, transform: azalt ? 'none' : 'scale(1.7)' },
    { opacity: 1, transform: 'scale(1)', offset: 0.15 },
    { opacity: 1, offset: 0.8 },
    { opacity: 0 },
  ]
  alan.querySelector('[data-rozet="porsiyon"]')?.animate(kareler, { duration: 1800, easing: EGRI })
}

/** Son saat: sahne `--gece`ye geçer; iki modda da opaklık, yani azaltılmışta aynı. */
function sonSaat(alan: HTMLElement): void {
  const secenek: KeyframeAnimationOptions = { duration: 1200, easing: 'ease-out', fill: 'forwards' }
  alan.querySelector('[data-gece]')?.animate(opaklik(0, 1), secenek)
}

function yanik(yuva: HTMLElement | null): void {
  yuva?.querySelector('[data-yanik]')?.animate(opaklik(1, 0), { duration: 700, easing: 'ease-in' })
}

function olayaTepki(alan: HTMLElement, olay: Olay, azalt: boolean): void {
  switch (olay.tur) {
    case 'sofraKuruldu':
      return tabaklarIner(hedef(alan, `s${olay.sofra}`), azalt)
    case 'sisCevrildi':
      return cevir(hedef(alan, `o${olay.yuva}`), azalt)
    case 'sisAlindi': {
      const yuva = hedef(alan, `o${olay.yuva}`)
      parla(yuva, stil[olay.kalite])
      if (olay.kalite !== 'tam') return
      ucanRakam(yuva, `+${PUAN.tamKivam}`, azalt)
      return titre()
    }
    case 'sisYandi':
      return yanik(hedef(alan, `o${olay.yuva}`))
    case 'servis':
      return servisUcusu(alan, hedef(alan, `s${olay.sofra}`), olay.urun, azalt)
    case 'fisTamam':
      parla(hedef(alan, `s${olay.sofra}`), stil.odedi)
      return ucanRakam(hedef(alan, `s${olay.sofra}`), `+${olay.odeme}`, azalt)
    case 'sofraKalkti':
      return olay.odedi ? undefined : kalkis(hedef(alan, `s${olay.sofra}`))
    case 'rafDolu':
      return salla(hedef(alan, olay.urun), azalt)
    case 'tezgahDolu':
      return parla(alan.querySelector<HTMLElement>('[data-tezgah]'), stil.dolu)
    case 'porsiyon':
      return porsiyonRozeti(alan, azalt)
    case 'evre':
      return olay.evre === 4 ? sonSaat(alan) : undefined
    default:
      return undefined
  }
}

export function olaylaraTepki(alan: HTMLElement, olaylar: readonly Olay[], azalt: boolean): void {
  for (const olay of olaylar) olayaTepki(alan, olay, azalt)
}
```

- [ ] **Step 4: Odak, ses sentezi ve ses kancası**

`components/oyun/odak.ts`:

```ts
import type { KeyboardEvent, FocusEvent } from 'react'
import { komsuIndeks, okAdimi } from '@/lib/oyun/klavye'

/*
 * Şerit içi klavye gezinmesi (spec §15): her `[data-serit]` tek Tab durağıdır,
 * ok tuşları şerit içinde dolaşır. Gezici tabindex: odaktaki düğme 0, diğerleri -1.
 */

const DUGME = 'button:not([disabled])'

function dugmeler(serit: HTMLElement): HTMLElement[] {
  return [...serit.querySelectorAll<HTMLElement>(DUGME)]
}

function durakYap(serit: HTMLElement, durak: HTMLElement | null): void {
  const liste = dugmeler(serit)
  const secilen = durak && liste.includes(durak) ? durak : liste[0]
  for (const d of liste) d.tabIndex = d === secilen ? 0 : -1
}

/** Her şeritte tek durak: odak içerideyse o, değilse ilk düğme. Yapı değişince çağrılır. */
export function seritleriDuzenle(alan: HTMLElement): void {
  const odak = document.activeElement instanceof HTMLElement ? document.activeElement : null
  for (const serit of alan.querySelectorAll<HTMLElement>('[data-serit]')) durakYap(serit, odak)
}

export function seritOdagi(e: FocusEvent<HTMLElement>): void {
  if (e.target instanceof HTMLElement) durakYap(e.currentTarget, e.target)
}

export function seritTusu(e: KeyboardEvent<HTMLElement>): void {
  const adim = okAdimi(e.key)
  if (adim === null) return
  const liste = dugmeler(e.currentTarget)
  const sonraki = liste[komsuIndeks(liste.indexOf(e.target as HTMLElement), adim, liste.length)]
  if (!sonraki) return
  e.preventDefault()
  durakYap(e.currentTarget, sonraki)
  sonraki.focus()
}
```

`components/oyun/sesCalar.ts`:

```ts
import { SESLER, type SesAdi } from '@/lib/oyun/ses'

/*
 * Web Audio sentezi (spec §13): dosya yok, beş ses anında üretilir. Bağlam ilk
 * dokunuşta kurulur; tarayıcı kullanıcı hareketi olmadan ses başlatmaz.
 */

export type SesCalar = { cal: (ad: SesAdi) => void; kapat: () => void }

/** Bir saniyelik beyaz gürültü, bir kez üretilir: cızırtının kaynağı. */
function gurultuTamponu(ctx: AudioContext): AudioBuffer {
  const tampon = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const veri = tampon.getChannelData(0)
  for (let i = 0; i < veri.length; i++) veri[i] = Math.random() * 2 - 1
  return tampon
}

function ton(ctx: AudioContext, hz: number, hedef: AudioNode): AudioScheduledSourceNode {
  const osilator = ctx.createOscillator()
  osilator.type = 'triangle'
  osilator.frequency.value = hz
  osilator.connect(hedef)
  return osilator
}

function cizirti(ctx: AudioContext, tampon: AudioBuffer, hz: number, hedef: AudioNode): AudioScheduledSourceNode {
  const kaynak = ctx.createBufferSource()
  kaynak.buffer = tampon
  const suzgec = ctx.createBiquadFilter()
  suzgec.type = 'bandpass'
  suzgec.frequency.value = hz
  suzgec.Q.value = 0.8
  kaynak.connect(suzgec)
  suzgec.connect(hedef)
  return kaynak
}

export function sesCalarKur(): SesCalar | null {
  if (typeof AudioContext === 'undefined') return null
  const ctx = new AudioContext()
  const tampon = gurultuTamponu(ctx)
  const cal = (ad: SesAdi): void => {
    if (ctx.state === 'suspended') void ctx.resume()
    const ses = SESLER[ad]
    let t = ctx.currentTime
    for (const nota of ses.notalar) {
      const sure = nota.ms / 1000
      const kazanc = ctx.createGain()
      kazanc.gain.setValueAtTime(ses.kazanc, t)
      kazanc.gain.exponentialRampToValueAtTime(0.001, t + sure)
      kazanc.connect(ctx.destination)
      const kaynak = ses.tur === 'ton' ? ton(ctx, nota.hz, kazanc) : cizirti(ctx, tampon, nota.hz, kazanc)
      kaynak.start(t)
      kaynak.stop(t + sure)
      t += sure
    }
  }
  return { cal, kapat: () => void ctx.close() }
}
```

`components/oyun/useSes.ts`:

```ts
import { useEffect, useRef, useState } from 'react'
import { sesAcikMi, sesYaz } from '@/lib/oyun/defter'
import type { SesAdi } from '@/lib/oyun/ses'
import { sesCalarKur, type SesCalar } from './sesCalar'

export type Ses = { acik: boolean; degistir: () => void; cal: (ad: SesAdi) => void }

/** Ses varsayılan kapalı; tercih tarayıcıda kalır. Bağlam ilk gereken anda kurulur (spec §13). */
export function useSes(): Ses {
  // İlk boyama sunucuyla aynı: tercih istemcide, depolama okununca gelir.
  const [acik, setAcik] = useState(false)
  const calar = useRef<SesCalar | null>(null)

  useEffect(() => {
    setAcik(sesAcikMi())
    return () => calar.current?.kapat()
  }, [])

  const degistir = () => {
    const yeni = !acik
    setAcik(yeni)
    sesYaz(yeni)
  }
  const cal = (ad: SesAdi) => {
    if (!acik) return
    calar.current ??= sesCalarKur()
    calar.current?.cal(ad)
  }
  return { acik, degistir, cal }
}
```

- [ ] **Step 5: Döngüyü sahaya bağlayan kanca**

`components/oyun/useOyunAlani.ts`:

```ts
import { useEffect, useEffectEvent, useState, type RefObject } from 'react'
import { useHareketAzaltilmisMi } from '@/lib/hareket'
import { duyurucuKur, duyuruSec } from '@/lib/oyun/duyuru'
import { ipucuHedefi } from '@/lib/oyun/gosterim'
import { kisayolHedefi } from '@/lib/oyun/klavye'
import { sesSec } from '@/lib/oyun/ses'
import type { Hedef, Olay, Oyun, Sonuc } from '@/lib/oyun/tipler'
import { duyuruYaz, sahayiCiz } from './ciz'
import { seritleriDuzenle } from './odak'
import type { Metin } from './Seritler'
import { dokunus, olaylaraTepki } from './tepkiler'
import { useOyunDongusu } from './useOyunDongusu'
import { useSes } from './useSes'

type Secenek = {
  kok: RefObject<HTMLDivElement | null>
  tohum: number
  ipucu: boolean
  metin: Metin
  bitince: (sonuc: Sonuc) => void
}

/**
 * Döngüyü sahaya bağlar: her karede DOM yazımı, olaylara tepki, ses, canlı bölge
 * ve klavye kısayolları (1-4 sofra, 5-8 ocak). Saha yalnız yapıyı çizer.
 */
export function useOyunAlani({ kok, tohum, ipucu, metin, bitince }: Secenek) {
  const azalt = useHareketAzaltilmisMi()
  const ses = useSes()
  const [duyurucu] = useState(() => duyurucuKur())

  const ciz = (oyun: Oyun, ilerledi: boolean) => {
    const alan = kok.current
    if (!alan) return
    if (ilerledi) sahayiCiz(alan, oyun, ipucu ? ipucuHedefi(oyun) : null, azalt)
    duyuruYaz(alan, duyurucu.al(performance.now()), metin.duyuru)
  }
  const tepki = (olaylar: Olay[]) => {
    const alan = kok.current
    if (!alan) return
    olaylaraTepki(alan, olaylar, azalt)
    for (const ad of sesSec(olaylar)) ses.cal(ad)
    const duyuru = duyuruSec(olaylar)
    if (duyuru) duyurucu.ekle(duyuru)
  }
  const dongu = useOyunDongusu({ tohum, ciz, tepki, bitince })

  /** Dokunuş: simülasyona sıraya girer, hedefte anlık tepki başlar. */
  const dokun = (hedef: Hedef, el: HTMLElement | null) => {
    dongu.dokun(hedef)
    dokunus(el, azalt)
  }

  const kisayol = useEffectEvent((e: KeyboardEvent) => {
    if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return
    const hedef = kisayolHedefi(e.key)
    if (!hedef) return
    e.preventDefault()
    dokun(hedef, kok.current?.querySelector<HTMLElement>(`[data-hedef="${hedef}"]`) ?? null)
  })
  useEffect(() => {
    document.addEventListener('keydown', kisayol)
    return () => document.removeEventListener('keydown', kisayol)
  }, [])

  useEffect(() => {
    if (kok.current) seritleriDuzenle(kok.current)
  }, [kok, dongu.goruntu])

  return { ...dongu, dokun, azalt, ses }
}
```

- [ ] **Step 6: Şeritler**

`components/oyun/Seritler.tsx`:

```tsx
import type { Sozluk } from '@/content'
import { KorKivilcimi } from '@/components/ember/KorKivilcimi'
import { servisEdilenler } from '@/lib/oyun/gorsel'
import type { Goruntu } from '@/lib/oyun/gosterim'
import type { Hedef, Urun } from '@/lib/oyun/tipler'
import { seritOdagi, seritTusu } from './odak'
import type { Ses } from './useSes'
import {
  AcikYayik,
  BakirMasrapa,
  Bostana,
  CevirmeIsareti,
  DuraklatIsareti,
  KalktiIsareti,
  KarisikFis,
  KomboRozeti,
  KorHalkasi,
  KorNoktasi,
  Lebeni,
  OcakSonerIsareti,
  OcakYatagi,
  PorsiyonRozeti,
  SesIsareti,
  SofraPlakasi,
  SumakliSogan,
  UrunSimgesi,
  UrunSisi,
  YanikSis,
  Yesillik,
} from './Semboller'
import stil from './Saha.module.css'

/*
 * Sahanın beş şeridi: HUD, sofralar, ocak, tezgah, raf (spec §3). React yalnız yapı
 * değişince çizer; her karedeki değerler `ciz.ts`'ten `data-ciz` öğelerine yazılır,
 * anlık tepkiler `tepkiler.ts`'ten gizli bekleyen öğeleri oynatır.
 */

export type Metin = Sozluk['oyun']
export type SeritProps = {
  goruntu: Goruntu
  ad: (u: Urun) => string
  dokun: (hedef: Hedef, el: HTMLElement) => void
  metin: Metin
}

const YUVALAR = [0, 1, 2, 3] as const
const TABAKLAR = [Lebeni, Bostana, Yesillik, SumakliSogan]

/** Her düğmenin son iki katmanı: ilk turun kor noktası ve dokunma dolgusu. */
function DugmeKatmanlari() {
  return (
    <>
      <span className={stil.ipucu} aria-hidden="true">
        <KorNoktasi boy={18} />
      </span>
      <span className={stil.dolgu} data-dolgu aria-hidden="true" />
    </>
  )
}

type SeritKabi = { sinif: string | undefined; etiket: string; ciz?: string; children: React.ReactNode }

/** Şerit sarmalayıcı: tek Tab durağı, ok tuşları içeride (`odak.ts`). */
function Serit({ sinif, etiket, ciz, children }: SeritKabi) {
  return (
    <section
      className={sinif}
      data-serit
      data-ciz={ciz}
      aria-label={etiket}
      onKeyDown={seritTusu}
      onFocus={seritOdagi}
    >
      {children}
    </section>
  )
}

type HudProps = { metin: Metin; duraklat: () => void; ses: Ses }

export function Hud({ metin, duraklat, ses }: HudProps) {
  return (
    <header className={stil.hud}>
      <span className={stil.saat}>
        <span className={stil.gizli}>{metin.saat} </span>
        <span data-ciz="saat">21:00</span>
      </span>
      <span className={stil.puan}>
        <span className={stil.gizli}>{metin.puan} </span>
        <span data-ciz="puan">0</span>
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
      <button
        type="button"
        className={stil.hudDugme}
        aria-label={metin.ses}
        aria-pressed={ses.acik}
        onClick={ses.degistir}
      >
        <SesIsareti boy={22} acik={ses.acik} />
      </button>
      <button type="button" className={stil.hudDugme} aria-label={metin.duraklat} onClick={duraklat}>
        <DuraklatIsareti boy={22} />
      </button>
      <span className={stil.geceRayi} data-ciz="gece" aria-hidden="true">
        <span className={stil.geceUcu}>
          <OcakSonerIsareti boy={14} />
        </span>
      </span>
    </header>
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

function Sofra({ no, sofra, ad, dokun, metin, vurgu }: SofraProps) {
  const servis = sofra ? servisEdilenler(sofra.fis, sofra.kalan) : []
  return (
    <button
      type="button"
      className={stil.sofra}
      data-hedef={`s${no}`}
      data-bos={sofra ? undefined : ''}
      data-kurulu={sofra?.kurulu ? '' : undefined}
      data-vurgu={sofra && vurgu && sofra.kalan.includes(vurgu) ? '' : undefined}
      aria-label={sofraEtiketi(metin, no, sofra, ad)}
      onClick={(e) => dokun(`s${no}` as Hedef, e.currentTarget)}
    >
      <SofraPlakasi />
      <span className={stil.halka} data-ciz="sabir" data-no={no} aria-hidden="true">
        <KorHalkasi />
      </span>
      <span className={stil.tabaklar} aria-hidden="true">
        {TABAKLAR.map((Tabak, i) => (
          <span key={i} data-tabak>
            <Tabak boy={14} />
          </span>
        ))}
      </span>
      <span className={stil.fis} data-fis aria-hidden="true">
        {sofra?.karisik && <KarisikFis boy={16} />}
        {sofra?.fis.map((u, i) => (
          <span key={i} className={stil.kalem} data-servis={servis[i] ? '' : undefined}>
            <UrunSimgesi urun={u} boy={16} />
          </span>
        ))}
      </span>
      <span className={stil.kalkti} data-kalkti aria-hidden="true">
        <KalktiIsareti boy={28} />
      </span>
      <DugmeKatmanlari />
    </button>
  )
}

export function Sofralar({ goruntu, vurgu, ...kalan }: SeritProps & { vurgu: Urun | null }) {
  return (
    <Serit sinif={stil.sofralar} etiket={kalan.metin.sofra}>
      {YUVALAR.map((no) =>
        no >= goruntu.acikSofra ? (
          <div key={no} className={stil.kapali} />
        ) : (
          <Sofra key={no} no={no} sofra={goruntu.sofralar[no] ?? null} vurgu={vurgu} {...kalan} />
        ),
      )}
      {goruntu.kapida > 0 && (
        <span className={stil.kapida}>
          {kalan.metin.kapida} {goruntu.kapida}
        </span>
      )}
    </Serit>
  )
}

type YuvaProps = Omit<SeritProps, 'goruntu'> & { no: number; sis: Goruntu['ocak'][number] }

function Yuva({ no, sis, ad, dokun, metin }: YuvaProps) {
  const ray = sis
    ? ({
        '--centik': sis.centik,
        '--pencere': sis.pencere,
        '--kivam': sis.kivam,
        '--bant': sis.bant,
      } as React.CSSProperties)
    : undefined
  return (
    <button
      type="button"
      className={stil.yuva}
      data-hedef={`o${no}`}
      data-ciz="ocak"
      data-no={no}
      data-cevirme={sis?.cevirme}
      aria-label={`${metin.ocak} ${no + 1}${sis ? `: ${ad(sis.urun)}` : ''}`}
      style={ray}
      onClick={(e) => dokun(`o${no}` as Hedef, e.currentTarget)}
    >
      <span className={stil.sisKap} aria-hidden="true">
        {sis && (
          <span className={stil.sis} data-sis>
            <UrunSisi urun={sis.urun} />
          </span>
        )}
        <span className={stil.yanik} data-yanik>
          <YanikSis />
        </span>
        <span className={stil.cevir}>
          <CevirmeIsareti boy={18} />
        </span>
        <span className={stil.kivilcimUcu} data-kivilcim />
      </span>
      <span className={stil.ray} aria-hidden="true">
        <span className={stil.rayDolum} />
        {sis && <span className={stil.centik} />}
        {sis && <span className={stil.pencere} />}
        {sis && <span className={stil.kivam} />}
      </span>
      <DugmeKatmanlari />
    </button>
  )
}

export function Ocak({ goruntu, ...kalan }: SeritProps) {
  return (
    <Serit sinif={stil.ocak} etiket={kalan.metin.ocak} ciz="kor">
      <OcakYatagi />
      <span className={stil.kivilcim} data-ciz="kivilcim" aria-hidden="true">
        <KorKivilcimi />
      </span>
      {YUVALAR.map((no) =>
        no >= goruntu.acikOcak ? (
          <div key={no} className={stil.kapali} />
        ) : (
          <Yuva key={no} no={no} sis={goruntu.ocak[no] ?? null} {...kalan} />
        ),
      )}
    </Serit>
  )
}

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
      className={stil.tezgahKalem}
      data-kalite={kalem.kalite ?? 'ayran'}
      data-urun={kalem.urun}
      aria-label={etiket}
      onClick={(e) => vurgula(kalem.urun, e.currentTarget)}
    >
      <UrunSimgesi urun={kalem.urun} boy={22} />
      {kalem.kalite && <span className={stil.soguma} data-ciz="soguma" data-no={no} aria-hidden="true" />}
      <span className={stil.dolgu} data-dolgu aria-hidden="true" />
    </button>
  )
}

type TezgahProps = SeritProps & { vurgula: (u: Urun, el: HTMLElement) => void }

export function Tezgah({ goruntu, ad, dokun, metin, vurgula }: TezgahProps) {
  return (
    <section
      className={stil.tezgah}
      data-tezgah
      data-serit
      aria-label={metin.tezgah}
      onKeyDown={seritTusu}
      onFocus={seritOdagi}
    >
      {YUVALAR.map((no) => {
        const kalem = goruntu.tezgah[no]
        const etiket = kalem ? `${metin.tezgah}: ${ad(kalem.urun)}` : ''
        return (
          <span key={no} className={stil.tezgahYuva} data-tezgah-yuva={no}>
            {kalem && <TezgahKalemi no={no} kalem={kalem} etiket={etiket} vurgula={vurgula} />}
          </span>
        )
      })}
      <button
        type="button"
        className={stil.yayik}
        data-hedef="ayran"
        data-ciz="ayran"
        data-durum={goruntu.ayran}
        aria-label={ad('ayran')}
        onClick={(e) => dokun('ayran', e.currentTarget)}
      >
        <AcikYayik boy={26} />
        <span className={stil.masrapa} aria-hidden="true">
          <BakirMasrapa boy={22} />
        </span>
        <DugmeKatmanlari />
      </button>
    </section>
  )
}

export function Raf({ goruntu, ad, dokun, metin }: SeritProps) {
  return (
    <Serit sinif={stil.raf} etiket={metin.raf}>
      {goruntu.raf.map((urun) => (
        <button
          key={urun}
          type="button"
          className={stil.rafUrun}
          data-hedef={urun}
          onClick={(e) => dokun(urun, e.currentTarget)}
        >
          <UrunSimgesi urun={urun} boy={22} />
          <span>{ad(urun)}</span>
          <DugmeKatmanlari />
        </button>
      ))}
    </Serit>
  )
}
```

- [ ] **Step 7: Saha (yönergesiz) ve görsel dil**

`components/oyun/Saha.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import type { Sonuc, Urun } from '@/lib/oyun/tipler'
import { Hud, Ocak, Raf, Sofralar, Tezgah } from './Seritler'
import { dokunus } from './tepkiler'
import { useOyunAlani } from './useOyunAlani'
import stil from './Saha.module.css'

type Props = { dil: Dil; tohum: number; ipucu: boolean; bitince: (sonuc: Sonuc) => void }

/** Oyun alanı. Yalnız istemci `OyunSayfasi`'ndan çağrılır, kendi sınırı yoktur. */
export function Saha({ dil, tohum, ipucu, bitince }: Props) {
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
      <span className={stil.gece} data-gece aria-hidden="true" />
      <Hud metin={s.oyun} duraklat={duraklat} ses={ses} />
      <Sofralar {...serit} vurgu={vurgu} />
      <Ocak {...serit} />
      <Tezgah {...serit} vurgula={vurgula} />
      <Raf {...serit} />
      <p className={stil.gizli} aria-live="polite" data-duyuru />
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
```

`components/oyun/Saha.module.css`:

```css
/*
 * Oyun alanının görsel dili (spec §13): kor zemin üstünde cam panel, yalnız marka
 * token'ları, köşe 0-3 px, rakamlar Bevan tabular, etiketler Archivo. Her karede
 * değişen değerler `--oran`, `--pisme`, `--yanma`, `--kor-yogunluk` ile gelir.
 */
.saha {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto auto auto;
  gap: 10px;
  min-height: calc(100dvh - 26px);
  padding: 10px;
  color: var(--krem);
  touch-action: manipulation;
  user-select: none;
  overflow: hidden;
}

.saha > * {
  position: relative;
  z-index: 1;
}

/* Son saat (spec §12): sahne `--gece`ye geçer. Katman opaklıkla açılır, `tepkiler.ts`. */
.gece {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--gece);
  opacity: 0;
  pointer-events: none;
}

/* Yalnız ekran okuyucuya; `display:none` ağaçtan da siler. */
.gizli {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* HUD: saat, puan, kombo, porsiyon, ses, duraklat; altta saat rayı. */
.hud {
  position: relative;
  display: grid;
  grid-template-columns: auto auto auto 1fr auto auto;
  align-items: center;
  gap: 6px;
}

.saat,
.puan {
  font-family: var(--font-baslik);
  font-variant-numeric: tabular-nums;
}

/* 320 px'te beş haneli puan, saat, rozet ve iki düğme tek satıra sığmak zorunda (ölçüldü). */
.saat {
  font-size: 15px;
  color: var(--krem-80);
}

.puan {
  font-size: 20px;
}

.kombo,
.porsiyon {
  position: relative;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  font: 400 13px/1 var(--font-baslik);
  font-variant-numeric: tabular-nums;
  color: var(--bakir-acik);
}

.kombo[data-carpan='1'],
.kombo:not([data-carpan]) {
  color: var(--krem-50);
}

/* Porsiyon rozeti akışta yer tutmaz: görünmezken HUD'u 40 px genişletiyordu (320 px'te taşma). */
.porsiyon {
  position: absolute;
  left: calc(50% - 20px);
  top: 0;
  opacity: 0;
  pointer-events: none;
}

.hudDugme {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--cizgi-guclu);
  border-radius: 3px;
  color: var(--krem-80);
}

.hudDugme[aria-pressed='true'] {
  border-color: var(--bakir-60);
  color: var(--bakir);
}

/* Saat rayı: 21:00'den 05:00'e, ucunda ocak söner işareti; son saatte bakırlaşır. */
.geceRayi {
  grid-column: 1 / -1;
  position: relative;
  display: block;
  height: 4px;
  margin-right: 20px;
  background: var(--cizgi);
}

.geceRayi::after {
  content: '';
  position: absolute;
  inset: 0;
  transform-origin: left;
  transform: scaleX(var(--oran, 0));
  background: var(--bakir);
}

.saha[data-evre='4'] .geceRayi::after {
  background: var(--bakir-acik);
}

.geceUcu {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--krem-50);
}

.saha[data-evre='4'] .geceUcu {
  color: var(--bakir-acik);
}

/* Şeritler: dört sütun, raf üç. Sofralar ekranın altına toplanır (başparmak yetişsin). */
.sofralar,
.ocak,
.raf {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.sofralar {
  position: relative;
  align-self: end;
}

.raf {
  grid-template-columns: repeat(3, 1fr);
}

.kapali {
  border: 1px dashed var(--cizgi-soluk);
  border-radius: 3px;
}

.kapida {
  position: absolute;
  top: -18px;
  right: 0;
  font-size: 12px;
  color: var(--krem-70);
}

/* Her düğmede: dokunma dolgusu ve kor noktası ipucu (yalnız ilk tur, spec §3). */
.dolgu {
  position: absolute;
  inset: 0;
  border-radius: 3px;
  background: var(--bakir-30);
  opacity: 0;
  pointer-events: none;
}

.ipucu {
  position: absolute;
  top: -7px;
  right: -7px;
  display: none;
  color: var(--kor);
  pointer-events: none;
}

.saha [data-ipucu] .ipucu {
  display: block;
  animation: nabiz 1.2s ease-in-out infinite;
}

/* Sofra: üstten sini, çevresinde kor halkası, köşelerde ikram tabakları, ortada fiş.
   Kare, sütun kadar: 390'da 81 px, 320'de 64 px. Spec §15'in 84 px'i 320'de sığmıyordu
   (ölçüldü: min-height 84 ile 347 px yatay taşma). */
.sofra {
  position: relative;
  aspect-ratio: 1;
  border-radius: 3px;
}

.sofra[data-bos] {
  opacity: 0.45;
}

.sofra[data-bos] .halka {
  display: none;
}

.sofra[data-vurgu] {
  box-shadow: inset 0 0 0 2px var(--bakir-acik);
}

.halka {
  position: absolute;
  inset: 0;
}

/* Sona doğru kızarır, bitince kül (spec §12); nabız azaltılmışta global kuralla durur. */
.halka[data-sabir='az'] circle {
  stroke: var(--kor);
  animation: korNabzi 1s ease-in-out infinite;
}

.kalkti .halka circle {
  stroke: var(--krem-32);
}

.tabaklar {
  position: absolute;
  inset: 8%;
  color: var(--krem-80);
}

.tabaklar span {
  position: absolute;
  display: block;
  line-height: 0;
  opacity: 0;
}

.sofra[data-kurulu] .tabaklar span {
  opacity: 1;
}

.tabaklar span:nth-child(1) { top: 0; left: 0; }
.tabaklar span:nth-child(2) { top: 0; right: 0; }
.tabaklar span:nth-child(3) { bottom: 0; left: 0; }
.tabaklar span:nth-child(4) { bottom: 0; right: 0; }

/* Fiş çerçevesi: sininin ortasında, üstü delikli kağıt. */
.fis {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1px;
  max-width: 64%;
  padding: 2px 3px;
  border-top: 1px dashed var(--cizgi-guclu);
  transform: translate(-50%, -50%);
  background: var(--panel-60);
  color: var(--krem);
}

.sofra[data-bos] .fis {
  display: none;
}

.kalem {
  display: block;
  line-height: 0;
}

/* Servis edilen kalem tabağa oturdu: bakır ve soluk. */
.kalem[data-servis] {
  color: var(--bakir);
  opacity: 0.5;
}

.kalkti {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--krem-50);
  opacity: 0;
}

/* Ocak: kömür yatak, kor ışığı kombo ile ısınır, üstünde kıvılcım tuvali. */
.ocak {
  position: relative;
  padding: 8px 6px 6px;
  border-radius: 3px;
  background: var(--komur);
  overflow: hidden;
}

.ocak::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(80% 70% at 50% 100%, var(--kor-leke-guclu), var(--kor-leke-solgun) 45%, transparent 75%);
  opacity: calc(0.3 + var(--kor-yogunluk, 0.25) * 0.7);
  transition: opacity var(--gecis-yogunluk);
}

.kivilcim {
  position: absolute;
  inset: 0;
  opacity: var(--oran, 0);
  transition: opacity var(--gecis-erit);
  pointer-events: none;
}

.yuva {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 140px;
  padding: 6px 4px 4px;
  border: 1px solid var(--cizgi-guclu);
  border-radius: 3px;
  background: var(--panel-60);
  color: var(--krem-70);
}

.yuva[data-gorunum='hazir'] {
  border-color: var(--bakir);
}

.yuva[data-gorunum='kivam'] {
  border-color: var(--bakir-acik);
}

.sisKap {
  position: relative;
  display: grid;
  flex: 1;
  place-items: center;
  perspective: 300px;
}

.sis {
  display: block;
  height: 100%;
  max-height: 112px;
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
  height: 100%;
  max-height: 112px;
  margin: auto;
  opacity: 0;
}

.cevir {
  position: absolute;
  top: 0;
  right: 0;
  color: var(--bakir-acik);
  opacity: 0;
}

.yuva[data-gorunum='centik'] .cevir {
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

/* Ray: ortada bakır çevirme bandı, sonda alma penceresi, onun ortasında tam kıvam bandı. */
.ray {
  position: relative;
  display: block;
  height: 10px;
  margin-top: 4px;
  overflow: hidden;
  background: var(--cizgi);
}

.rayDolum {
  position: absolute;
  inset: 0;
  transform-origin: left;
  transform: scaleX(var(--oran, 0));
  background: var(--krem-50);
}

.centik,
.pencere,
.kivam {
  position: absolute;
  top: 0;
  bottom: 0;
}

.centik {
  left: calc((var(--centik) - var(--bant) / 2) * 100%);
  width: calc(var(--bant) * 100%);
  background: var(--bakir-60);
}

.yuva[data-gorunum='centik'] .centik,
.yuva[data-cevirme='iyi'] .centik {
  background: var(--bakir-acik);
}

.yuva[data-cevirme='kotu'] .centik {
  background: var(--krem-50);
}

.pencere {
  left: calc(var(--pencere) * 100%);
  right: 0;
  border-left: 1px solid var(--bakir);
  background: var(--bakir-30);
}

.kivam {
  left: calc((var(--kivam) - var(--bant) / 2) * 100%);
  width: calc(var(--bant) * 100%);
  background: var(--bakir-acik);
}

/* Tezgah: dört yuva ve açık yayık. */
.tezgah {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.tezgahYuva {
  position: relative;
  display: block;
  min-height: 56px;
  border: 1px dashed var(--cizgi-soluk);
  border-radius: 3px;
}

.tezgahKalem {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border: 1px solid var(--cizgi-guclu);
  border-radius: 3px;
  background: var(--komur);
  color: var(--bakir);
}

.tezgahKalem[data-kalite='tam'] {
  border-color: var(--bakir-acik);
  color: var(--bakir-acik);
}

.tezgahKalem[data-kalite='ayran'] {
  color: var(--krem-80);
}

.soguma {
  position: absolute;
  left: 4px;
  right: 4px;
  bottom: 3px;
  display: block;
  height: 3px;
  overflow: hidden;
  background: var(--cizgi);
}

.soguma::after {
  content: '';
  position: absolute;
  inset: 0;
  transform-origin: left;
  transform: scaleX(var(--oran, 0));
  background: var(--krem-50);
}

.yayik {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 56px;
  border: 1px solid var(--bakir-60);
  border-radius: 3px;
  color: var(--krem-80);
}

.masrapa {
  line-height: 0;
  color: var(--bakir);
}

.yayik[data-durum='bekliyor'] {
  background: var(--bakir-30);
}

/* Raf: siluet ve etiket, oyundaki tek yazı (spec §3). */
.rafUrun {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 56px;
  border: 1px solid var(--cizgi-guclu);
  border-radius: 3px;
  background: var(--komur);
  font: 600 15px/1 var(--font-govde);
  color: var(--krem);
}

.rafUrun svg {
  color: var(--bakir);
}

/* Uçan rakam ve servis hayaleti: `tepkiler.ts` yaratır, animasyon bitince siler. */
.ucanRakam {
  position: absolute;
  left: 50%;
  top: 2px;
  transform: translate(-50%, 0);
  font: 400 14px/1 var(--font-baslik);
  font-variant-numeric: tabular-nums;
  color: var(--bakir-acik);
  white-space: nowrap;
  pointer-events: none;
}

.hayalet {
  position: fixed;
  z-index: 2;
  color: var(--bakir);
  pointer-events: none;
}

.perde {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  background: var(--zemin);
}

.devam {
  min-height: 56px;
  padding: 0 28px;
  border: 1px solid var(--cizgi-guclu);
  border-radius: 3px;
  font: 500 14px/1.2 var(--font-govde);
}

/* Olayın karşılığı: kısa bir parlama, yalnız opaklık. */
.tam::before,
.iyi::before,
.odedi::before,
.dolu::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 3px;
  pointer-events: none;
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

@keyframes korNabzi {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}
```

- [ ] **Step 8: Typecheck, test, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: typecheck temiz; `ℹ pass 254`, `ℹ fail 0`; build çıktısında `○ /oyun`. Eski `OyunSayfasi`
yeni `Saha`yı aynı props ile çağırır; görünüm bu adımda düz zemin üstündedir, panel Task 4'te gelir.

- [ ] **Step 9: Tarayıcı: hareket azaltma ve erişilebilirlik**

`out/`u sun (8391 sahibinin portu, kullanılmaz):

```bash
python3 -m http.server 8397 --directory "$(pwd)/out" > /tmp/bozo-oyun/plan2/sunucu.log 2>&1 &
```

Betikleri `/tmp/bozo-oyun/plan2/` altına yaz; repoya girmez. Playwright ve axe yolları ölçüm
harnesiyle aynı (bellekteki `olcum-harnesi`).

`/tmp/bozo-oyun/plan2/hareket.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const KOK = process.argv[2] ?? 'http://localhost:8397'
const b = await chromium.launch()
for (const azalt of [false, true]) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: azalt ? 'reduce' : 'no-preference' })
  const p = await c.newPage()
  await p.goto(KOK + '/oyun/')
  await p.waitForLoadState('networkidle')
  await p.getByRole('button', { name: 'Oyna' }).click()
  await p.waitForTimeout(1500)
  // Sofrayı kur, şişi koy, bir süre sonra tezgaha al: dokunma, tabaklar, çevirme ve alma tepkileri koşar.
  await p.locator('[data-hedef="s0"]').click()
  await p.locator('[data-hedef="ciger"]').click()
  await p.waitForTimeout(1900)
  await p.locator('[data-hedef="o0"]').click()
  await p.waitForTimeout(60)
  const ornek = await p.evaluate(() => {
    const anims = document.getAnimations()
    const css = anims.filter((a) => a instanceof CSSAnimation).map((a) => a.animationName)
    const gecis = anims.filter((a) => a instanceof CSSTransition).map((a) => a.transitionProperty)
    const waapi = anims.filter((a) => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition))
    const ozellikler = new Set()
    for (const a of waapi) for (const k of a.effect.getKeyframes()) for (const ad of Object.keys(k)) if (!['offset', 'computedOffset', 'easing', 'composite'].includes(ad)) ozellikler.add(ad)
    const tuval = document.querySelector('canvas')
    return { css: [...new Set(css)], gecis: [...new Set(gecis)], waapi: waapi.length, ozellikler: [...ozellikler], tuvalVar: !!tuval }
  })
  console.log(azalt ? 'azaltılmış' : 'normal', JSON.stringify(ornek))
  await c.close()
}
await b.close()
```

`/tmp/bozo-oyun/plan2/erisim.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const AXE = '/Users/mk/.npm/_npx/1fc4933a57a44b8f/node_modules/axe-core/axe.min.js'
const KOK = process.argv[2] ?? 'http://localhost:8397'
const ETIKETLER = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
const b = await chromium.launch()
for (const genislik of [390, 1440]) {
  const c = await b.newContext({ viewport: { width: genislik, height: 844 }, reducedMotion: 'reduce' })
  const p = await c.newPage()
  await p.goto(KOK + '/oyun/')
  await p.waitForLoadState('networkidle')
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
  // Klavye: Tab şeritler arası (her şeritte tek durak), ok tuşu şerit içi, 5 ocak kısayolu.
  await p.locator('[data-hedef="s0"]').focus()
  await p.keyboard.press('ArrowRight')
  const okSonrasi = await p.evaluate(() => document.activeElement.dataset.hedef)
  await p.keyboard.press('Tab')
  const tabSonrasi = await p.evaluate(() => document.activeElement.dataset.hedef)
  const duraklar = await p.evaluate(() => [...document.querySelectorAll('[data-serit]')].map((s) => [...s.querySelectorAll('button')].filter((b) => b.tabIndex === 0).length))
  await p.keyboard.press('1')
  await p.waitForTimeout(200)
  const kuruldu = await p.evaluate(() => document.querySelector('[data-hedef="s0"]').hasAttribute('data-kurulu'))
  console.log(genislik, 'ok sonrası', okSonrasi, 'tab sonrası', tabSonrasi, 'şerit durakları', JSON.stringify(duraklar), '1 tuşu sofrayı kurdu', kuruldu)
  await c.close()
}
await b.close()
```

Run (sırayla, aynı anda değil):
```bash
node /tmp/bozo-oyun/plan2/hareket.mjs http://localhost:8397
node /tmp/bozo-oyun/plan2/erisim.mjs http://localhost:8397
```
Expected (ön doğrulamada ölçülen; `KorSahnesi` adları Task 4'ten önce listede yoktur, Task 4
sonrasında aşağıdaki gibi beş CSS animasyonu görünür):
```
normal {"css":["KorSahnesi-module__AFsT6q__korTitremesi","KorSahnesi-module__AFsT6q__emberBreath","KorSahnesi-module__AFsT6q__cekirdekTitremesi","KorSahnesi-module__AFsT6q__emberSoft","KorSahnesi-module__AFsT6q__smokeDrift"],"gecis":[],"waapi":4,"ozellikler":["opacity","transform"],"tuvalVar":true}
azaltılmış {"css":[],"gecis":[],"waapi":1,"ozellikler":["opacity"],"tuvalVar":true}
390 giris ihlal 0 [] taşma false
390 oyun ihlal 0 [] taşma false
390 ok sonrası s1 tab sonrası o0 şerit durakları [1,1,1,1] 1 tuşu sofrayı kurdu true
1440 giris ihlal 0 [] taşma false
1440 oyun ihlal 0 [] taşma false
1440 ok sonrası s1 tab sonrası o0 şerit durakları [1,1,1,1] 1 tuşu sofrayı kurdu true
```
Ölçüt: azaltılmışta `css` boş ve `ozellikler` yalnız `opacity`; ihlal 0, taşma false; ok tuşu `s1`,
Tab `o0`, her şeritte tek durak, `1` tuşu sofrayı kurar. `tuvalVar` iki modda da true: tuval DOM'da
durur, azaltılmışta `KorKivilcimi` döngüyü hiç başlatmaz.

- [ ] **Step 10: Commit**

```bash
git add components/oyun/useOyunDongusu.ts components/oyun/ciz.ts components/oyun/tepkiler.ts \
  components/oyun/odak.ts components/oyun/sesCalar.ts components/oyun/useSes.ts \
  components/oyun/useOyunAlani.ts components/oyun/Seritler.tsx components/oyun/Saha.tsx \
  components/oyun/Saha.module.css
git commit -m "Give the game field its visual language and instant reactions"
```

---

### Task 4: Ekranlar: kor zemin, cam panel, Motion geçişleri, sonuç ekranı

**Files:**
- Modify: `package.json`, `package-lock.json` (`npm install motion@14`), `components/ui/CamPanel.tsx`,
  `components/oyun/OyunSayfasi.tsx`, `components/oyun/OyunSayfasi.module.css`,
  `components/oyun/SonucEkrani.tsx`, `components/oyun/SonucEkrani.module.css`
- Test: `npm run typecheck`, `npm test`, `npm run build` + chunk denetimi; dört tarayıcı betiği

**Interfaces:**
- Consumes: `Saha` (Task 3), `KorSahnesi varyant="ic"`, `CamPanel`, `OcakSonerIsareti` (Task 2),
  `useHareketAzaltilmisMi`, `enIyiOku/enIyiYaz/ilkTurMu/ilkTurBitti`; `motion/react`:
  `MotionConfig`, `LazyMotion`, `domAnimation`, `AnimatePresence`, `m`.
- Produces: `CamPanel` `dolgu` artık `'genis' | 'orta' | 'dar' | 'yok'`; `OyunSayfasi({ dil })` ve
  `SonucEkrani` props'ları plan 1 ile aynı.

Motion yalnız burada: ekran geçişi (`m.div`, opaklık + 12 px kayma, 250 ms) ve sonuç satırları
(`m.p` mühür, `m.li` kademeli). `LazyMotion ... strict` ile `motion.*` yerine `m.*` kullanılır, paket
küçük kalır. `MotionConfig reducedMotion="user"` dönüşümleri keser, opaklık kalır.

- [ ] **Step 1: Bağımlılık**

Run: `npm install motion@14`
Expected: `package.json` > `dependencies` içine `"motion": "^14.0.0"` girer (`lucide-react` ile
`next` arasına, alfabetik); `node -e "console.log(require('motion/package.json').version)"` →
`14.0.0`. `motion/react`, `framer-motion` 14'ü yeniden dışa aktarır; React 19 eş bağımlılık aralığında.

- [ ] **Step 2: CamPanel `yok` dolgusu**

`components/ui/CamPanel.tsx`:

```tsx
import stil from './CamPanel.module.css'

/** genis 48px, orta 44px, dar 40px: tasarımın üç panel dolgusu. yok: dolguyu içerik verir (oyun sahası). */
export type PanelDolgusu = 'genis' | 'orta' | 'dar' | 'yok'

const DOLGU_SINIFI: Record<PanelDolgusu, string | undefined> = {
  genis: stil.dolguGenis,
  orta: stil.dolguOrta,
  dar: stil.dolguDar,
  yok: undefined,
}

type Props = {
  opaklik: 0.72 | 0.74
  dolgu?: PanelDolgusu
  /** 'sayfa': tam genişlik, 1180px'de durur (Ana:170, Hikaye:91). */
  genislik?: 'serbest' | 'sayfa'
  /**
   * Arkaplan bulanıklığı. Tasarımda yalnız Ana Sayfa ve Hikaye panellerinde var;
   * Menü ve Konum'un panelleri bulanıklık taşımıyor, onlar bunu false geçer.
   */
  bulanik?: boolean
  /**
   * Panelin sayfa ızgarasındaki yeri (flex tabanı, min-width, iç yerleşim).
   * Bu değerler her çağrıda farklı ve sayfanın kendi düzenine ait; panel
   * yalnız zemini, kenarlığı, bulanıklığı ve dolgusunu sahiplenir.
   */
  className?: string
  children: React.ReactNode
}

export function CamPanel({
  opaklik,
  dolgu = 'genis',
  genislik = 'serbest',
  bulanik = true,
  className,
  children,
}: Props) {
  const zeminSinif = opaklik === 0.72 ? stil.acik : stil.orta
  const sinif = [
    stil.panel,
    zeminSinif,
    DOLGU_SINIFI[dolgu],
    genislik === 'sayfa' ? stil.sayfaEni : '',
    bulanik ? stil.bulanik : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={sinif}>{children}</div>
}
```

`components/ui/CamPanel.module.css` değişmez: `yok` için sınıf yoktur, `DOLGU_SINIFI.yok` `undefined`.

- [ ] **Step 3: Sayfa gövdesi**

`components/oyun/OyunSayfasi.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { KorSahnesi } from '@/components/ember/KorSahnesi'
import { CamPanel } from '@/components/ui/CamPanel'
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

/** Ekran geçişi (spec §12): Motion yalnız burada ve sonuç satırlarında; `reducedMotion="user"` kaymayı keser,
 *  opaklık kalır. */
const EKRAN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: 'easeOut' as const },
}

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
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <KorSahnesi varyant="ic" />
        <main className={stil.sayfa}>
          {ekran.ad !== 'giris' && <h1 className={stil.gizliBaslik}>{s.oyun.baslik}</h1>}
          <AnimatePresence mode="wait" initial={false}>
            {ekran.ad === 'giris' && (
              <m.div key="giris" className={stil.ekran} {...EKRAN}>
                <CamPanel opaklik={0.74} dolgu="orta" bulanik={false} className={stil.panel}>
                  <section className={stil.giris}>
                    <h1 className={stil.baslik}>{s.oyun.baslik}</h1>
                    <p className={stil.cumle}>{s.ana.gece.baslik}</p>
                    <button type="button" className={stil.oyna} onClick={basla}>
                      {s.oyun.oyna}
                    </button>
                  </section>
                </CamPanel>
              </m.div>
            )}
            {ekran.ad === 'oyun' && (
              <m.div key={`oyun-${ekran.tohum}`} className={stil.ekran} {...EKRAN}>
                <CamPanel opaklik={0.74} dolgu="yok" bulanik={false} className={stil.panel}>
                  <Saha dil={dil} tohum={ekran.tohum} ipucu={ekran.ipucu} bitince={bitir} />
                </CamPanel>
              </m.div>
            )}
            {ekran.ad === 'sonuc' && (
              <m.div key="sonuc" className={stil.ekran} {...EKRAN}>
                <CamPanel opaklik={0.74} dolgu="orta" bulanik={false} className={stil.panel}>
                  <SonucEkrani dil={dil} sonuc={ekran.sonuc} onceki={ekran.onceki} yeni={ekran.yeni} tekrar={basla} />
                </CamPanel>
              </m.div>
            )}
          </AnimatePresence>
        </main>
      </LazyMotion>
    </MotionConfig>
  )
}
```

`components/oyun/OyunSayfasi.module.css`:

```css
/* z-index 1: `KorSahnesi` sabit ve z-index 0; içerik onun üstünde durur. */
.sayfa {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  align-content: start;
  min-height: 100dvh;
  padding: 12px;
  color: var(--krem);
}

/* Telefonda tam genişlik, masaüstünde 560px'lik tek sütun; cam panel sahanın zemini. */
.ekran {
  width: 100%;
  max-width: 560px;
}

.panel {
  width: 100%;
}

.giris {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 18px;
  min-height: calc(100dvh - 26px - 2 * var(--kart-ic-orta));
  text-align: center;
}

.baslik {
  margin: 0;
  font: 400 32px/1.1 var(--font-baslik);
  text-shadow: var(--golge-baslik);
}

.cumle {
  margin: 0;
  color: var(--krem-70);
}

.oyna {
  min-width: 200px;
  min-height: 56px;
  border-radius: 3px;
  background: var(--kor);
  box-shadow: var(--kor-golge);
  font: 600 18px/1 var(--font-govde);
  color: var(--krem);
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

- [ ] **Step 4: Sonuç ekranı**

`components/oyun/SonucEkrani.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import { m } from 'motion/react'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { useHareketAzaltilmisMi } from '@/lib/hareket'
import { TUR_TIK } from '@/lib/oyun/ayar'
import { oyunSaati } from '@/lib/oyun/gosterim'
import type { Sonuc } from '@/lib/oyun/tipler'
import { OcakSonerIsareti } from './Semboller'
import stil from './SonucEkrani.module.css'

type Props = { dil: Dil; sonuc: Sonuc; onceki: number | null; yeni: boolean; tekrar: () => void }

const SAYMA_MS = 900
const GECIS = { duration: 0.3, ease: 'easeOut' as const }

/** Puan sayarak artar (spec §12); azaltılmış harekette son değer doğrudan. */
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

/** Kişisel en iyiye kalan fark (spec §11); ilk turda satır yok. */
function enIyiSatiri(s: Sozluk, puan: number, onceki: number | null, yeni: boolean, sayi: (n: number) => string) {
  if (yeni) return s.oyun.yeniEnIyi
  if (onceki === null) return null
  return `${s.oyun.enIyi} ${sayi(onceki)}, ${sayi(onceki - puan)} ${s.oyun.kaldi}`
}

/** Saat mühürlenir: satır büyükten yerine oturur; azaltılmışta Motion ölçeği keser, opaklık kalır. */
const MUHUR = { initial: { opacity: 0, scale: 1.3 }, animate: { opacity: 1, scale: 1 }, transition: GECIS }

export function SonucEkrani({ dil, sonuc, onceki, yeni, tekrar }: Props) {
  const s = sozluk(dil)
  const azalt = useHareketAzaltilmisMi()
  const sayilan = useSayac(sonuc.puan, azalt)
  const puanRef = useRef<HTMLHeadingElement>(null)
  const sayi = (n: number) => n.toLocaleString(dil === 'en' ? 'en-GB' : 'tr-TR')
  const satir = bitisSatiri(s, sonuc)
  const enIyi = enIyiSatiri(s, sonuc.puan, onceki, yeni, sayi)
  const ozet = [
    [sonuc.ozet.sofra, s.oyun.ozet.sofra],
    [sonuc.ozet.sis, s.oyun.ozet.sis],
    [sonuc.ozet.tamKivam, s.oyun.ozet.tamKivam],
    [sonuc.ozet.enUzunKombo, s.oyun.ozet.enUzunKombo],
  ] as const

  // Odak puana gider: ekran okuyucu düğmeyi değil sonucu duyar. Sayım görsel, gizli metin son değer.
  useEffect(() => puanRef.current?.focus(), [])

  return (
    <section className={stil.sonuc}>
      <m.p className={stil.satir} {...MUHUR}>
        {satir.geceTamam && <OcakSonerIsareti boy={18} />}
        {satir.metin}
      </m.p>
      <h2 ref={puanRef} tabIndex={-1} className={stil.puan}>
        <span className={stil.gizli}>
          {s.oyun.puan}: {sayi(sonuc.puan)}
        </span>
        <span aria-hidden="true">{sayi(sayilan)}</span>
      </h2>
      <ul className={stil.ozet}>
        {ozet.map(([deger, etiket], i) => (
          <m.li
            key={etiket}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...GECIS, delay: 0.45 + i * 0.08 }}
          >
            <span className={stil.deger}>{sayi(deger)}</span> {etiket}
          </m.li>
        ))}
      </ul>
      {enIyi && <p className={stil.enIyi}>{enIyi}</p>}
      <button type="button" className={stil.tekrar} onClick={tekrar}>
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
  min-height: calc(100dvh - 26px - 2 * var(--kart-ic-orta));
  text-align: center;
}

.satir {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--krem-70);
}

.puan {
  margin: 0;
  font: 400 48px/1 var(--font-baslik);
  font-variant-numeric: tabular-nums;
  text-shadow: var(--golge-baslik);
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
  box-shadow: var(--kor-golge);
  font: 600 18px/1 var(--font-govde);
  color: var(--krem);
}
```

- [ ] **Step 5: Typecheck, test, build**

Run: `npm run typecheck && npm test && npm run build`
Expected: typecheck temiz; `ℹ pass 254`, `ℹ fail 0`; build 17 rota, `○ /oyun`.

- [ ] **Step 6: Motion yalnız `/oyun`da, noindex ve sitemap**

Run:
```bash
for f in $(grep -l "popLayout" out/_next/static/chunks/*.js); do
  echo "$(basename $f) -> $(grep -l "$(basename $f)" out/*.html out/*/index.html out/en/*/index.html | tr '\n' ' ')"
done
grep -c oyun out/sitemap.xml; grep -o '<meta name="robots"[^>]*>' out/oyun/index.html
```
Expected: tek chunk ve yalnız `out/oyun/index.html` bağlar (ön doğrulamada
`2tmc_s1_tgy2q.js -> out/oyun/index.html`, 152 KB; chunk adı derlemeye göre değişir); `0` ve
`<meta name="robots" content="noindex, nofollow"/>`. `popLayout` framer-motion'ın `AnimatePresence`
kipinin adıdır ve küçültmeden sağ çıkar; bileşen adları çıkmaz.

- [ ] **Step 7: Tarayıcı: duman, depolama kapalı, görüntü, performans**

Sunucu Task 3 adım 9'daki gibi 8397'de koşar; `out/` yeniden derlendiği için `--directory` ile
başlatılmış olması şart (bellekteki `olcum-harnesi` notu: `cwd` ile başlayan sunucu silinmiş ağacı
sunar).

`/tmp/bozo-oyun/plan2/duman.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const AXE = '/Users/mk/.npm/_npx/1fc4933a57a44b8f/node_modules/axe-core/axe.min.js'
const KOK = process.argv[2] ?? 'http://localhost:8397'
const ETIKETLER = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
const b = await chromium.launch()
for (const genislik of [320, 390, 1440]) {
  const c = await b.newContext({ viewport: { width: genislik, height: genislik < 500 ? 740 : 900 }, isMobile: genislik < 500, hasTouch: genislik < 500, deviceScaleFactor: 2 })
  const p = await c.newPage()
  const hatalar = []
  p.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
  p.on('pageerror', (e) => hatalar.push(String(e)))
  await p.goto(KOK + '/oyun/')
  await p.waitForLoadState('networkidle')
  // İlk ziyaret, onay yok: oyun rotasında bant çıkmaz (onayGerekirMi).
  const bant = await p.getByRole('dialog').count()
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
    const sofra = document.querySelector('[data-hedef="s0"]').getBoundingClientRect()
    const yuva = document.querySelector('[data-hedef="o0"]').getBoundingClientRect()
    return { tasma: document.documentElement.scrollWidth, kucuk, sofra: `${Math.round(sofra.width)}x${Math.round(sofra.height)}`, yuva: `${Math.round(yuva.width)}x${Math.round(yuva.height)}` }
  })
  console.log(genislik, 'bant', bant, 'ilk servis ms', ilkServis, 'yatay genişlik', olcu.tasma, '44 altı düğme', JSON.stringify(olcu.kucuk), 'sofra', olcu.sofra, 'yuva', olcu.yuva)
  if (genislik === 390) {
    await p.getByRole('button', { name: 'Tekrar Oyna' }).waitFor({ timeout: 150000 })
    // Motion girişi 0,8 s'de biter; erken koşan axe solan satırı kontrast ihlali sayar (ölçüldü).
    await p.waitForTimeout(1200)
    console.log('sonuç:', (await p.locator('main').innerText()).replace(/\n+/g, ' | '))
    console.log('odak:', await p.evaluate(() => document.activeElement.tagName + ' ' + document.activeElement.textContent.slice(0, 20)))
    await p.addScriptTag({ path: AXE })
    const r = await p.evaluate(async (e) => (await window.axe.run(document, { runOnly: { type: 'tag', values: e } })).violations, ETIKETLER)
    console.log('sonuç axe ihlal', r.length, JSON.stringify(r.map((v) => `${v.id}:${v.nodes.length}`)))
  }
  console.log(genislik, 'konsol hataları', JSON.stringify(hatalar))
  await c.close()
}
await b.close()
```

`/tmp/bozo-oyun/plan2/depolamasiz.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const KOK = process.argv[2] ?? 'http://localhost:8397'
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
await c.addInitScript(() => {
  Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('kapalı', 'SecurityError') } })
})
const p = await c.newPage()
const hatalar = []
p.on('pageerror', (e) => hatalar.push(String(e)))
await p.goto(KOK + '/oyun/')
await p.waitForLoadState('networkidle')
await p.getByRole('button', { name: 'Oyna' }).click()
await p.locator('[data-ipucu]').first().waitFor({ timeout: 5000 })
// Ses açılır (AudioContext kurulur), tercih yazılamaz, hata atılmaz.
await p.getByRole('button', { name: 'Ses' }).click()
const basili = await p.getByRole('button', { name: 'Ses' }).getAttribute('aria-pressed')
await p.locator('[data-hedef="s0"]').click()
await p.locator('[data-hedef="ciger"]').click()
await p.waitForTimeout(500)
await p.getByRole('button', { name: 'Tekrar Oyna' }).waitFor({ timeout: 150000 })
console.log('depolama kapalı: ipucu çıktı, ses', basili, 'sonuç ekranı geldi, sayfa hataları', JSON.stringify(hatalar))
await b.close()
```

`/tmp/bozo-oyun/plan2/goruntu.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const KOK = process.argv[2] ?? 'http://localhost:8397'
const DIZIN = process.argv[3] ?? '/tmp/bozo-oyun/plan2'
const b = await chromium.launch()
for (const genislik of [320, 390, 1440]) {
  const c = await b.newContext({ viewport: { width: genislik, height: genislik < 500 ? 740 : 900 }, isMobile: genislik < 500, hasTouch: genislik < 500, deviceScaleFactor: 2 })
  const p = await c.newPage()
  await p.goto(KOK + '/oyun/')
  await p.waitForLoadState('networkidle')
  await p.waitForTimeout(600)
  await p.screenshot({ path: `${DIZIN}/giris-${genislik}.png` })
  await p.getByRole('button', { name: 'Oyna' }).click()
  await p.waitForTimeout(1200)
  await p.locator('[data-hedef="s0"]').click()
  await p.locator('[data-hedef="ciger"]').click()
  await p.waitForTimeout(1500)
  await p.locator('[data-hedef="o0"]').click()
  await p.locator('[data-hedef="ciger"]').click()
  await p.locator('[data-hedef="ayran"]').click()
  await p.waitForTimeout(2600)
  await p.locator('[data-hedef="o0"]').click()
  await p.waitForTimeout(200)
  await p.screenshot({ path: `${DIZIN}/oyun-${genislik}.png` })
  await c.close()
}
await b.close()
```

`performans.mjs` spec §12 ve §16'nın ölçümü: orta seviye Android emülasyonu (390×844, DPR 3, CDP ile
CPU 4× yavaşlatma, chrome-devtools'un "4x slowdown"ı), 12 sn boyunca ipucuna ya da sırayla sofra,
raf ve ocağa dokunarak tepkileri koşturur, rAF aralıklarını ve `longtask` sayısını toplar; ayrıca
`devtools.timeline` kategorili bir iz dosyası yazar (`chrome://tracing` ya da DevTools Performance >
Load profile ile açılır).

`/tmp/bozo-oyun/plan2/performans.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const KOK = process.argv[2] ?? 'http://localhost:8397'
const IZ = process.argv[3] ?? '/tmp/bozo-oyun/plan2/iz.json'
// Orta seviye Android emülasyonu: 390x844, DPR 3, CPU 4x yavaş (chrome-devtools "4x slowdown").
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 })
const p = await c.newPage()
const cdp = await c.newCDPSession(p)
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
await p.goto(KOK + '/oyun/')
await p.waitForLoadState('networkidle')
await p.getByRole('button', { name: 'Oyna' }).click()
await p.waitForTimeout(800)
await b.startTracing(p, { path: IZ, screenshots: false, categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame'] })
await p.evaluate(() => {
  window.__kareler = []
  window.__uzun = 0
  let onceki = performance.now()
  const adim = (t) => { window.__kareler.push(t - onceki); onceki = t; requestAnimationFrame(adim) }
  requestAnimationFrame(adim)
  new PerformanceObserver((l) => { window.__uzun += l.getEntries().length }).observe({ type: 'longtask' })
})
// 12 saniye oyun: ipucu varsa ona, yoksa sırayla sofra, raf ve ocağa dokunulur; tepkiler koşar.
const hedefler = ['s0', 'ciger', 's1', 'dalak', 'o0', 'o1', 's0', 'o0', 'o1', 's1']
const t0 = Date.now()
let i = 0
while (Date.now() - t0 < 12000) {
  const ipucu = p.locator('[data-ipucu]')
  const secim = (await ipucu.count()) ? ipucu.first() : p.locator(`[data-hedef="${hedefler[i++ % hedefler.length]}"]`)
  await secim.click({ timeout: 500 }).catch(() => {})
  await p.waitForTimeout(400)
}
const olcum = await p.evaluate(() => {
  const k = window.__kareler.slice(5).sort((a, b) => a - b)
  const y = (q) => k[Math.min(k.length - 1, Math.floor(k.length * q))].toFixed(1)
  const dusen = k.filter((x) => x > 25).length
  return { kare: k.length, p50: y(0.5), p95: y(0.95), p99: y(0.99), enUzun: k[k.length - 1].toFixed(1), dusenKare: dusen, dusenYuzde: ((100 * dusen) / k.length).toFixed(1), uzunGorev: window.__uzun }
})
await b.stopTracing()
console.log('CPU 4x, 390x844 @3:', JSON.stringify(olcum), 'iz:', IZ)
await b.close()
```

Run (sırayla):
```bash
node /tmp/bozo-oyun/plan2/duman.mjs http://localhost:8397
node /tmp/bozo-oyun/plan2/depolamasiz.mjs http://localhost:8397
node /tmp/bozo-oyun/plan2/goruntu.mjs http://localhost:8397
node /tmp/bozo-oyun/plan2/performans.mjs http://localhost:8397
```
Expected (ön doğrulamada ölçülen):
```
320 bant 0 ilk servis ms 6378 yatay genişlik 320 44 altı düğme [] sofra 64x64 yuva 61x140
320 konsol hataları []
390 bant 0 ilk servis ms 6349 yatay genişlik 390 44 altı düğme [] sofra 82x82 yuva 79x140
sonuç: Sofra Yetiştir | 23:22 · üç sofra kalktı | Puan: -250 | -250 | 1 sofra | 1 şiş | 1 tam kıvam | 1 en uzun kombo | Tekrar Oyna
odak: H2 Puan: -250-250
sonuç axe ihlal 0 []
390 konsol hataları []
1440 bant 0 ilk servis ms 6334 yatay genişlik 1440 44 altı düğme [] sofra 130x130 yuva 127x140
1440 konsol hataları []
depolama kapalı: ipucu çıktı, ses true sonuç ekranı geldi, sayfa hataları []
CPU 4x, 390x844 @3: {"kare":723,"p50":"16.7","p95":"17.8","p99":"18.5","enUzun":"18.6","dusenKare":0,"dusenYuzde":"0.0","uzunGorev":0} iz: /tmp/bozo-oyun/plan2/iz.json
```
Ölçütler: `bant 0` (ilk ziyaret, onay tohumlanmadı, oyun rotasında bant yok); ilk servis 12 sn
altında; yatay genişlik viewport'a eşit; 44 altı düğme listesi, konsol ve sayfa hataları, axe ihlal
listesi boş; odak `H2` (puan); `ses true`. Performans sınırı: p95 ≤ 20 ms, 25 ms üstü kare ≤ %2,
uzun görev ≤ 2 (ölçülen 17,8 / 0 / 0; üç ayrı koşuda p95 17,4-17,8 ms). "sonuç" satırındaki ikinci rakam sayım anında yakalanır,
`-250` ile `-40` arası bir ara değer olabilir; gizli metin her zaman son değerdir. Bitiş saati ve
ilk servis süresi makineye göre birkaç yüz ms oynar. `goruntu.mjs` altı PNG yazar; 390'da sofra
halkası, dikey şiş, ray bantları, közler, maşrapa ve raf etiketi görünmeli, 1440'ta panel 560 px
ortada.

- [ ] **Step 8: Elle deneme**

`npm run dev`, 390 px emülasyonda `/oyun/`:
1. Dokunuş: düğme 2 px kalkıp dolgusu parlar; ilk turda kor noktası sırayla sofra, Ciğer, ocak, sofra üstünde.
2. Sofra kurulunca dört tabak sırayla iner (lebeni önce); şiş kremden bakıra döner, çentik bandında
   çevirme işareti belirir, çevirince 180 ms döner ve küçük kıvılcım çıkar; tam kıvamda bakır parlama
   ve "+150" yükselir.
3. Servis: siluet tezgahtan sofraya kavisle uçar, fiş kalemi bakıra döner; fiş tamamlanınca "+ödeme"
   yükselir, kombo ×2'de rozet mühürlenir ve ocak bir kademe ısınır (kıvılcım yoğunlaşır).
4. Sabır azalınca halka kızarıp nabız atar; sofra kalkınca kararıp boş sofra geri gelir.
5. Ses düğmesi: açınca cızırtı, tık, iki nota, alçak vuruş duyulur; sayfa yenilenince tercih kalır.
6. 04:00'te (evre 5) sahne `--gece`ye geçer, saat rayı bakırlaşır; 05:00'te sonuç "05:00 · son tane,
   ocak söner" satırı ocak söner işaretiyle gelir, puan sayarak artar.
7. Sistem hareket azaltmasını açınca aynı tur: dönüş, uçuş ve kalkma yok, dolgu ve opaklık var;
   Motion geçişleri yalnız solar.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json components/ui/CamPanel.tsx components/oyun/OyunSayfasi.tsx \
  components/oyun/OyunSayfasi.module.css components/oyun/SonucEkrani.tsx components/oyun/SonucEkrani.module.css
git commit -m "Put the game on the ember ground with screen transitions"
```

---

### Task 5: Belgeler

**Files:**
- Modify: `CLAUDE.md`, `docs/surec/DEVAM.md`

- [ ] **Step 1: CLAUDE.md**

`## Architecture` listesinde dört değişiklik, metinler birebir:

(a) "`lib/` is eleven small modules, each with a `.test.ts` beside it where behaviour is" ile
başlayan madde şununla değiştirilir:

```markdown
- `lib/` is eleven small modules plus the game's `lib/oyun/`, each with a `.test.ts` beside it
  where behaviour is load-bearing: `saat` (the one business rule), `site` (routes and every
  outbound URL), `kabuk` (the shell parts that change per route: top-bar variant, anchors,
  drawer links), `metadata` (page metadata and the social card), `jsonld`, `onay` (consent
  storage), `fontlar`, `sis` (the locked mark geometry), `cerceve` (shared scroll frame),
  `hareket` (reduced-motion preference and rAF throttling), `metin` (widow prevention).
  `lib/oyun/` is the opening-period game (spec `docs/specs/2026-10-08-oyun-design.md`): an
  integer-only deterministic simulation pinned by golden records in `motor.test.ts`, plus
  display-only modules (`gosterim`, `gorsel`, `zamanlayici`, `defter`, `klavye`, `duyuru`,
  `ses`) that never feed values back into it.
```

(b) Onay maddesinin son cümlesi "attribution required on every surface that shows it) for exactly
this reason." şöyle uzar:

```markdown
  attribution required on every surface that shows it) for exactly this reason. The game
  routes (`/oyun`, `/en/oyun`) are first-party and make no outbound request, so `CerezOnayi`
  renders nothing there (`onayGerekirMi` in `lib/onay.ts`): no banner, no GA.
```

(c) "`components/` has five buckets" maddesi şununla değiştirilir:

```markdown
- `components/` has six buckets: `ui/` primitives, `sayfa/` page bodies (a subfolder per page),
  `layout/` shell, `saat/` opening hours, `ember/` decorative scene, `oyun/` the game screen
  (DOM + hand-drawn SVG, per-frame values written by a rAF loop, instant reactions in WAAPI,
  `motion` only for screen transitions). Each component is `X.tsx` next to `X.module.css`.
  Imports go through the `@/*` alias, not relative paths.
```

(d) `## Dependencies` ilk satırı:

```markdown
Runtime: `next`, `react`, `react-dom`, `lucide-react`, `motion` (imported only under
`components/oyun/`, so it ships only in the `/oyun` chunk; spec §10). Dev: `typescript` and the three
`@types` packages.
```

(e) `## Accessibility` içinde "The rule does NOT reach canvas loops or SMIL" cümlesi şununla
değiştirilir:

```markdown
  The rule does NOT reach canvas loops, SMIL, Web Animations API calls or Motion: those read
  the preference themselves (see `components/ember/KorKivilcimi.tsx`; the game's
  `components/oyun/tepkiler.ts` keeps opacity-only keyframes when `useHareketAzaltilmisMi()` is
  true, and `OyunSayfasi` wraps Motion in `MotionConfig reducedMotion="user"`). Any new non-CSS
  animation must do the same, or the guarantee is silently broken.
```

- [ ] **Step 2: DEVAM.md**

`## Durum` listesinin ilk maddesi (plan 1'in "plan 1 bitti" maddesi) şununla değiştirilir:

```markdown
- **Açılış oyunu, plan 2 bitti: görsel ve ses dili `/oyun/`** (spec
  `docs/specs/2026-10-08-oyun-design.md` §12-§13 ve §15; plan
  `docs/plans/2026-10-08-oyun-plan-2-gorsel-dil.md`). Kor zemin üstünde cam panel, elle çizilmiş
  SVG semboller, WAAPI tepkiler, Motion ekran geçişleri, Web Audio ses (varsayılan kapalı),
  klavye kısayolları ve canlı bölge. Simülasyon değişmedi (altın kayıtlar aynı). Sunucusuz,
  noindex, menüde yok; **yayında değil**. Ölçüldü: CPU 4x 390 px'te p95 17,8 ms, düşen kare 0;
  320/390/1440 taşma yok, axe 0. Sırada kaba prototip testi (spec §16) ve plan 3 (skor
  sunucusu). Sahibine açık kararlar spec §19'da.
```

- [ ] **Step 3: Son doğrulama**

Run: `npm run typecheck && npm test && npm run build && git diff --stat HEAD~4 -- lib/oyun/motor.ts lib/oyun/motor.test.ts lib/oyun/ocak.ts lib/oyun/sofra.ts lib/oyun/ayar.ts lib/oyun/tipler.ts lib/oyun/canli.ts lib/oyun/deneme.ts`
Expected: typecheck temiz; `ℹ pass 254`; `○ /oyun`; son komut **boş** (simülasyon ve altın
kayıtlar plan boyunca değişmedi). `styles/palet.test.ts`'in CLAUDE.md renk tablosu testi geçmeye
devam eder (tablo değişmedi).

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md docs/surec/DEVAM.md
git commit -m "Document the game's visual layer and the motion dependency"
```

---

## Kapsam dışı (sonraki planlar)

- **Plan 3, skor sunucusu:** `sunucu/`, MariaDB, jeton, `simule` ile yeniden oynatma, tavan hesabı,
  dönem kapanışı, "önce oyna, sonra kaydet", katılım ve sıralama ekranları (Motion'ın sıralama
  satırları burada), tohum sınırı ve fikstür ayarı, kaba prototip testinden gelen evre ayarları.
- **Plan 4, paylaşım ve yayın:** paylaşım kartı (sabit QR ve kart şablonu, §13'ün son iki varlığı),
  kurallar sayfası, gizlilik değişiklikleri, EN rotası, `RotaAnahtari`/sitemap kaydı, alt alan adı
  ve deploy.
