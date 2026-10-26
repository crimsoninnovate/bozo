# Menü Yönetim Paneli ve Canlı Menü Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restoranda yetkili şifreyle giren biri menü kalemlerini, açıklamalarını (TR ve EN), fiyatları ve içecekleri panelden değiştirsin; menü sayfası kaydedince bekleme olmadan güncellensin.

**Architecture:** Menü tek bir sürümlü JSON belgesi. Skor sunucusu (`sunucu/`) belgeyi MariaDB'de saklar ve sunar. Site derlenmiş belgeyle basılır, tarayıcıda canlı belgeyle değişir. Panel `/yonetim/` rotasında, mevcut personel ekranının yapısıyla yazılır.

**Tech Stack:** Next.js 16 statik export, React 19, CSS Modules, Node 24 `node:http`, MariaDB, `node:test`. Yeni bağımlılık yok.

**Spec:** `docs/specs/2026-10-26-menu-yonetim-design.md`

## Global Constraints

- Sayfa kodu yazmadan önce `node_modules/next/dist/docs/` içinde ilgili kılavuzu oku (kök `CLAUDE.md`: bu Next sürümünde kırıcı değişiklikler var).
- `lib/`, `content/`, `sunucu/`, `scripts/` bağıl import ve `.ts` uzantısı kullanır (`node --test` `@/` çözemez); `components/` ve `app/` `@/*` kullanır.
- Fonksiyon en çok 50 satır, dosya yaklaşık 700, satır en çok 120 karakter; `any` yok; `const`; hatayı yutma, neyin hangi girdiyle düştüğünü logla.
- Türkçe alan adları ASCII (`kalemler`, `fiyatlar`), kullanıcıya görünen metinde Türkçe karakter; teknik iskele İngilizce.
- Metin kuralları (`content/CLAUDE.md`): uzun ve kısa tire (U+2014, U+2013) yok; Türkçede şapkalı harf yok (â î û); büyük harfli cümle yok; sabit terimler: misafir (müşteri değil), ikram (bedava değil), ocak/kor (mangal değil), usta (şef değil), tane (parça değil), şiş/porsiyon (adet değil), sofra (masa değil).
- Stil: CSS Modules ve mevcut token'lar, renk değeri yazma (`styles/palet.test.ts` reddeder), köşe yarıçapı 0-3px, dokunma hedefi en az 44px, anahtar kareler kendi `.module.css` içinde.
- Yeni bağımlılık eklenmez. Test yalnız `node:test`; çıplak `npm test` (`rtk proxy npm test 2>&1 | grep -E "ℹ (pass|fail)"`).
- Yorum bir iki satır, gerekçe `docs/surec/`'te. Commit: İngilizce, emir kipi, 72 karakter altı, **imza satırı yok** (proje kuralı, sistem varsayılanını ezer).
- Paraya dokunan her sayı kuruşsuz tam sayı TL.

## Review Focus

1. İki yetkili aynı anda düzenlerse ikinci kayıt ilkini sessizce ezmez: 409 `surumEskidi` (T4), panel "başkası değiştirdi, yenile" der (T7).
2. Canlı yanıt yavaş, boş, bozuk JSON ya da şemaya uymuyorsa menü derlenmiş haliyle kalır, sayfa boşalmaz (T5, T6).
3. Fiyat yazım hatası: `8500`, `0`, `-5`, `85.5`, `"850 TL"`; yüzde 50'yi aşan değişim onay ekranında kırmızı (T2, T7).
4. Kalem silinince ya da eklenince ana sayfa çökmez, yeni kalem ana sayfada çıkmaz (T3).
5. Restoranın wifi'sindeki misafirler tek IP'dir: `GET /menu` IP sınırına takılmaz (T4).

---

## Dosya Haritası

| Dosya | Sorumluluk |
|---|---|
| `lib/menu/tipler.ts` | Belge ve aktarım tipleri |
| `lib/menu/dogrulama.ts` | `menuBelgesiDogrula`, metin kuralları |
| `lib/menu/fark.ts` | İki belge arasındaki değişiklik listesi |
| `lib/menu/duzenleme.ts` | Panelin saf düzenleme işlemleri |
| `lib/menu/belgeYukle.ts` | Build zamanı: canlı varsa o, yoksa varsayılan (`node:fs`, yalnız sunucu tarafı) |
| `lib/menu/canli.ts` | `canliMenuGetir`, `menuKarar` (tarayıcı tarafı) |
| `content/menu.varsayilan.json` | Başlangıç belgesi |
| `scripts/menuCek.ts` | Build öncesi canlı sürümü çeker |
| `sunucu/menu.ts` | Menü uçlarının işleyicileri |
| `components/sayfa/menu/MenuVerisi.tsx` | Sağlayıcı ve `useMenu` |
| `components/yonetim/*` | Panel: `oturum`, `MenuYonetimi`, `KalemFormu`, `IcecekFormu`, `YayinOnayi`, `Gecmis` |
| `app/(tr)/yonetim/page.tsx` | Panel rotası |

---

### Task 1: Belge modeli, başlangıç belgesi ve altın dosya

**Files:**
- Create: `lib/menu/tipler.ts`, `content/menu.varsayilan.json`, `lib/menu/varsayilan.test.ts`, `lib/__altin__/menu-jsonld-tr.json`, `lib/__altin__/menu-jsonld-en.json`
- Test: `lib/menu/varsayilan.test.ts`

**Interfaces:**
- Produces (`lib/menu/tipler.ts`):
```ts
export type Cift = { tr: string; en: string }
export type MenuKalemi = {
  id: string; ad: Cift; aciklama: Cift | null
  fiyatlar: { porsiyon: number; durum?: number }
  porsiyonNotu: Cift | null; durumNotu: Cift | null; fotoId: FotoId | null
}
export type OzelKalem = { ad: Cift; miktarNotu: Cift; aciklama: Cift; fiyat: number }
export type IcecekOlcusu = { ad: Cift; fiyat: number }
export type IcecekKalemi = { id: string; ad: Cift; olculer: IcecekOlcusu[] }
export type MenuBelgesi = { kalemler: MenuKalemi[]; ozel: OzelKalem; icecekler: IcecekKalemi[] }
```

- [ ] **Step 1: Altın dosyaları üret ve commit et, hiçbir şeyi değiştirmeden.** Bir kerelik komutla bugünkü `menuJsonLd('tr')` ve `menuJsonLd('en')` çıktısını `lib/__altin__/menu-jsonld-{tr,en}.json` olarak yaz. Bu T3'ün "çıktı değişmedi" kanıtı. Ek olarak `rtk proxy npm run build` (sandbox dışı) sonrası `out/` dizinini `$TMPDIR/out-oncesi` altına kopyala.
- [ ] **Step 2: Tipleri yaz** (yukarıdaki blok, `FotoId` `content/types.ts`'ten).
- [ ] **Step 3: Failing test** `lib/menu/varsayilan.test.ts`: `varsayilan_bugunkuMenuyuTasir`: `content/menu.varsayilan.json` içindeki kalem kimlikleri sırayla `['ciger','dalak','yurek','terbiyeli-tavuk-sis','terbiyesiz-tavuk-sis','terbiyeli-kusbasi','bozo-karisik']`, `ciger.fiyatlar` `{porsiyon:690,durum:690}`, `terbiyeli-kusbasi.fiyatlar` `{porsiyon:850,durum:850}`, `ozel.fiyat` 900, içecek kimlikleri `['kola','kolaZero','fanta','cappy','ayran','su']`, `ayran.olculer` fiyatları `[40,30,50]`. İkinci test `varsayilan_trVeEnAlanlariDoludur`: her `Cift` iki dilde boş değil (aciklama/not `null` olabilir, ama `null` ise iki dil de yok).
- [ ] **Step 4: Run** `rtk proxy npm test 2>&1 | grep -E "ℹ (pass|fail)"`. Beklenen: FAIL (dosya yok).
- [ ] **Step 5: JSON'u üret.** Bir kerelik betikle bugünkü `content/urunler.ts`, `content/{tr,en}/menu.ts` değerlerinden yaz (elle yazma, kopya hatası riski). Betik repoya girmez. `porsiyonNotu` / `durumNotu` bugünkü sözlükten; `durumNotu.varsayilan` ("5 şiş") fallback'i her kaleme açıkça yazılır (`ciger`, `dalak`, `yurek`, tavuklar ve `terbiyeli-kusbasi` zaten kendi değerini taşıyor; `bozo-karisik` dürümsüz, `durumNotu: null`). Açıklaması olmayan `terbiyeli-tavuk-sis` için `aciklama: null` (uydurma yok).
- [ ] **Step 6: Run** testler. Beklenen: PASS.
- [ ] **Step 7: Commit** `Add menu document model and seed from current content`.

### Task 2: Doğrulama ve fark

**Files:**
- Create: `lib/menu/dogrulama.ts`, `lib/menu/fark.ts`, `lib/menu/dogrulama.test.ts`, `lib/menu/fark.test.ts`

**Interfaces:**
- Consumes: `MenuBelgesi` (T1), `fotograflar` anahtarları (`content/fotograflar.ts`).
- Produces:
```ts
export type Sorun = { yol: string; kod: string; metin: string }          // yol: "kalemler[2].fiyatlar.porsiyon"
export type Sonuc = { tamam: true; belge: MenuBelgesi; uyarilar: Sorun[] } | { tamam: false; hatalar: Sorun[] }
export function menuBelgesiDogrula(girdi: unknown): Sonuc
export type Degisiklik = { yol: string; etiket: string; once: string; sonra: string; buyukSicrama: boolean }
export function menuFarki(eski: MenuBelgesi, yeni: MenuBelgesi): Degisiklik[]
```

Kurallar. Kesin ret: şema uyumsuzluğu (bilinmeyen alan dahil), fiyat tam sayı değil ya da 1..99999 dışında, iki dilden biri boş (not/açıklama hariç `null` serbest), `ad` en çok 60, `aciklama` en çok 240, `not` en çok 40 karakter, U+2014 ve U+2013, `âîûÂÎÛ`, 4+ harfli sözcüklerin hepsi büyük harf olan alan, kimlik `^[a-z0-9-]{2,40}$` ve tekil, ilk kalem `ciger`, en çok 40 kalem ve 30 içecek, içecekte en az bir ölçü, bilinmeyen `fotoId`, aynı kalemde `durum` varken `porsiyon` yok. Uyarı (onay ekranında gösterilir, engellemez): sabit terimlerin yasak karşılıkları (müşteri, bedava, mangal, şef, parça, adet, masa, 7/24). `buyukSicrama`: fiyat eskiye göre %50 üstünde değişti.

- [ ] **Step 1: Failing testler** (`dogrulama.test.ts`), her biri `menuBelgesiDogrula(varsayilanKopya(degisiklik))`: `dogrulama_varsayilan_tamam`, `dogrulama_fiyat8500_gecerliAraliktadir` (8500 reddedilmez; sıçramayı `fark.test.ts` işaretler), `dogrulama_fiyatKesirli_reddeder` (85.5), `dogrulama_fiyatMetin_reddeder` ("850 TL"), `dogrulama_fiyatSifir_reddeder`, `dogrulama_fiyat100000_reddeder`, `dogrulama_uzunTire_reddeder`, `dogrulama_sapkaliHarf_reddeder` (`'Kebâp'`), `dogrulama_buyukHarfCumle_reddeder`, `dogrulama_enBos_reddeder`, `dogrulama_ilkKalemCigerDegilse_reddeder`, `dogrulama_tekrarKimlik_reddeder`, `dogrulama_bilinmeyenFotoId_reddeder`, `dogrulama_bilinmeyenAlan_reddeder`, `dogrulama_musteriKelimesi_uyariVerir`, `dogrulama_nullVeUndefined_reddederCokmeden`. `fark.test.ts`: `fark_fiyatDegisti_oncekiVeSonrakiniVerir` (`"690 TL"` → `"6.900 TL"`, `buyukSicrama` true), `fark_kalemEklendi_etiketliSatir`, `fark_kalemSilindi_etiketliSatir`, `fark_degisiklikYok_bosListe`, `fark_aciklamaDegisti_ikiDilAyriSatir`.
- [ ] **Step 2: Run**, FAIL beklenir.
- [ ] **Step 3: Implement** `menuBelgesiDogrula` (girdiyi `unknown` olarak elle denetle, kütüphane yok; döndürülen `belge` yeni bir nesne, girdiyle referans paylaşmaz) ve `menuFarki` (etiketler Türkçe: "Ciğer: porsiyon fiyatı", "İçecekler: Ayran, büyük"; fiyat metni `fiyatMetni` ile).
- [ ] **Step 4: Run**, PASS.
- [ ] **Step 5: Commit** `Add menu document validation and diff`.

### Task 3: Site menüyü belgeden okur

**Files:**
- Create: `lib/menu/belgeYukle.ts`, `lib/menu/belgeYukle.test.ts`
- Modify: `content/urunler.ts`, `content/tr/menu.ts`, `content/en/menu.ts`, `content/types.ts`, `content/icerik.test.ts`, `lib/jsonld.ts`, `lib/jsonld.test.ts`, `components/sayfa/Kabuk.tsx`, `components/sayfa/MenuSayfasi.tsx`, `components/sayfa/menu/{Ocakbasi,UrunKarti,OlcuSatirlari,Icecekler}.tsx`, `components/sayfa/ana/Ocakbasi.tsx`, `.gitignore`
- Test: `lib/jsonld.test.ts`, `lib/menu/belgeYukle.test.ts`, `content/icerik.test.ts`

**Interfaces:**
- Consumes: T1 belge, T2 doğrulama.
- Produces:
```ts
export function menuBelgesiYukle(kok?: string): MenuBelgesi   // belgeYukle.ts
export function menuJsonLd(dil: Dil, belge: MenuBelgesi): object   // lib/jsonld.ts
export function anaSayfaKalemleri(belge: MenuBelgesi, anaKimlikleri: readonly string[]): MenuKalemi[]  // lib/menu/belgeYukle.ts
```
Bileşenler `menu: MenuBelgesi` ve `dil` prop'u alır (T6 sağlayıcıya geçince `useMenu()` ile değişir, bu task'ta prop).

- [ ] **Step 1: Failing testler.** `jsonld.test.ts`: `menuJsonLd_varsayilanBelge_altinDosyayaEsit` (tr ve en, `lib/__altin__`). `belgeYukle.test.ts`: `menuBelgesiYukle_canliDosyaYoksa_varsayilanDoner`, `menuBelgesiYukle_canliDosyaGecerliyse_onuDoner`, `menuBelgesiYukle_canliDosyaBozuksa_varsayilanaDonerVeUyarirLoglar` (geçici dizin `kok`), `anaSayfaKalemleri_silinenVeYeniKalem_hataVermez`: menüden `dalak` silinmiş ve ana sözlükte olmayan `yeni-kalem` eklenmiş belgede sonuç yalnız ana sözlük kimliklerinin kesişimi, hata yok.
- [ ] **Step 2: Run**, FAIL.
- [ ] **Step 3: Implement.** `menuBelgesiYukle`: `content/menu.canli.json` varsa oku, `menuBelgesiDogrula`'dan geçirip dön; yoksa ya da geçersizse `varsayilan.json` (geçersizse `console.warn` ile neden). `.gitignore`'a `/content/menu.canli.json`.
- [ ] **Step 4: Tüketicileri taşı.** `content/urunler.ts`'ten `menuUrunler`, `anaUrunler`, `ozelUrun`, `icecekler`, `urunOlculeri` kalkar (ikramlar kalır; `urunOlculeri` benzeri yardımcı `lib/menu/tipler.ts` yanında `kalemOlculeri(kalem)` olarak yaşar). `content/{tr,en}/menu.ts`'ten kalem adları, açıklamaları, `porsiyonNotu`, `durumNotu`, `ozel`, `icecekler.urunler`, `icecekler.olculer` kalkar; bölüm başlıkları, `olculer` (Porsiyon/Dürüm), `cigerSpec`, `imzaRozeti`, ikramlar, `qrNotu` kalır. `Ocakbasi`, `UrunKarti`, `OlcuSatirlari`, `Icecekler` metinleri belgeden `ad[dil]` ile alır; `Kabuk` `menuJsonLd(dil, menuBelgesiYukle())` çağırır; ana sayfa `Ocakbasi` `anaSayfaKalemleri(belge, Object.keys(s.ana.ocakbasi.urunler))` kullanır. `KART_NEFESLERI[sira]` kalem sayısı artınca `undefined` döner: `KART_NEFESLERI[sira % KART_NEFESLERI.length]`.
- [ ] **Step 5: `content/icerik.test.ts` taşı.** Fiyat beklenti tablosu (`urunler_fiyatlarIsletmedenGelenDegerleriTasir`) belgeyi `content/menu.varsayilan.json`'dan okur; ölçü-not testleri aynı şekilde.
- [ ] **Step 6: Çıktı eşitliği.** `rtk proxy npm run typecheck`, tüm testler, sonra `npm run build` (sandbox dışı). `out/menu/index.html` ve `out/en/menu/index.html`, `$TMPDIR/out-oncesi` ile `diff`: yalnız Next build kimliği farkı kabul (diff'ten önce `sed` ile kimliği normalize et). Fark çıkarsa task bitmedi.
- [ ] **Step 7: Commit** `Read the menu from a document instead of code`.

### Task 4: Sunucu: depo, uçlar, sınırlar

**Files:**
- Create: `sunucu/menu.ts`, `sunucu/menu.test.ts`
- Modify: `sunucu/depo.ts`, `sunucu/bellekDepo.ts`, `sunucu/mariaDepo.ts`, `sunucu/depoSozlesmesi.ts`, `sunucu/sema.sql`, `sunucu/uygulama.ts`, `sunucu/http.ts` (CORS yöntemleri), `sunucu/uygulama.test.ts`
- Create: `lib/menu/aktarim.ts`

**Interfaces:**
- Consumes: `MenuBelgesi`, `menuBelgesiDogrula`.
- Produces (`lib/menu/aktarim.ts`, hem sunucu hem istemci):
```ts
export type MenuYaniti = { surum: number; belge: MenuBelgesi }
export type SurumOzeti = { id: number; olusturma: string; kaynak: 'panel' | 'geriAl' }
export type YonetimMenuYaniti = { gecerli: MenuYaniti | null; surumler: SurumOzeti[] }
export type MenuYayinYaniti = { surum: number }
```
Depo (`sunucu/depo.ts`):
```ts
menuGecerli(): Promise<{ id: number; belge: MenuBelgesi } | null>
menuYayinla(belge: MenuBelgesi, kaynak: 'panel' | 'geriAl', simdi: number, taban: number | null): Promise<number | null> // null: taban güncel değil
menuSurumleri(adet: number): Promise<{ id: number; olusturma: number; kaynak: 'panel' | 'geriAl' }[]>
menuSurumBul(id: number): Promise<{ id: number; belge: MenuBelgesi } | null>
```
Uçlar: `GET /menu` (200 `MenuYaniti` ya da 204 sürüm yoksa; `Cache-Control: public, max-age=15`; `ipSiniri` dışında), `GET /yonetim/menu` (`YonetimMenuYaniti`, son 20), `PUT /yonetim/menu` gövde `{ taban: number | null, belge: unknown }` (200 `MenuYayinYaniti`; 400 `belgeGecersiz`; 409 `surumEskidi`), `POST /yonetim/menu/N/geri-al` gövde `{ taban }` (404 `surumYok`, 409 `surumEskidi`). `taban` "son sürümün id'si, hiç sürüm yoksa `null`". CORS izinli yöntemlere `PUT` eklenir.

- [ ] **Step 1: Failing testler.** `depoSozlesmesi.ts`'e (bellek ve MariaDB aynı sözleşmeyi koşar): `menuYayinla_ilkSurumTabanNull_idDoner`, `menuYayinla_tabanEski_nullDoner`, `menuYayinla_tabanGuncel_yeniIdDoner`, `menuGecerli_hicSurumYoksa_nullDoner`, `menuSurumleri_enYeniBasta_adetKadar`, `menuSurumBul_olmayanId_nullDoner`, `menuYayinla_turkceVeEmojiMetni_ayniDonerRoundTrip`. `uygulama.test.ts`'e: `getMenu_surumYok_204`, `getMenu_yayindan_sonra_200VeBelge`, `getMenu_700IstekSonrasi_hala200` (Review Focus 5), `putYonetimMenu_kimliksiz_401`, `putYonetimMenu_gecersizBelge_400`, `putYonetimMenu_tabanEski_409` (Review Focus 1), `putYonetimMenu_gecerli_200VeGetteGorunur` (önbellek 15 sn: testte `simdi` ilerletilir), `postGeriAl_eskiSurum_yeniSurumOlarakYayinlanir` (`surumler[0].kaynak === 'geriAl'`), `postGeriAl_olmayanId_404`, `optionsMenu_corsPutIzinli`.
- [ ] **Step 2: Run**, FAIL.
- [ ] **Step 3: Implement** bellek depo; `sema.sql`'e `menu_surum (id INT UNSIGNED AUTO_INCREMENT PK, belge LONGTEXT NOT NULL, kaynak ENUM('panel','geriAl') NOT NULL, olusturma_ms BIGINT NOT NULL)` (`utf8mb4`); `mariaDepo.menuYayinla` taban denetimini ve eklemeyi tek deyimle yapar (`INSERT ... SELECT ... WHERE (SELECT COALESCE(MAX(id),0) FROM menu_surum) = ?`, `affectedRows === 0` ise `null`), böylece yarış penceresi kalmaz.
- [ ] **Step 4: Implement** `sunucu/menu.ts` işleyicileri ve `uygulama.ts` rotaları. `yonlendir` içinde `GET /menu` için `ipSiniri` atlanır (tek satırlık istisna, yorumuyla). Genel yanıt önbelleği `onbellekKur(15_000)`; başarılı yayın sonrası `bosalt()`.
- [ ] **Step 5: Run** tüm testler; `BOZO_TEST_DB_URL` yoksa MariaDB sözleşmesi atlanır (bilinen).
- [ ] **Step 6: Commit** `Add menu versions, public menu endpoint and staff publish endpoints`.

### Task 5: İstemci API

**Files:**
- Create: `lib/menu/canli.ts`, `lib/menu/canli.test.ts`
- Modify: `lib/oyun/api.ts`, `lib/oyun/api.test.ts`

**Interfaces:**
- Consumes: T4 aktarım tipleri, `menuBelgesiDogrula`.
- Produces:
```ts
// lib/oyun/api.ts: Secenek.yontem 'PUT' alır; yonetimApiKur'a eklenir
menu: () => Promise<YonetimMenuYaniti>
menuYayinla: (taban: number | null, belge: MenuBelgesi) => Promise<MenuYayinYaniti>
menuGeriAl: (id: number, taban: number | null) => Promise<MenuYayinYaniti>
// lib/menu/canli.ts
export async function canliMenuGetir(kok: string, getir: typeof fetch, zamanAsimiMs: number): Promise<MenuYaniti | null>
export function menuKarar(baz: MenuBelgesi, getirilen: MenuYaniti | null): MenuBelgesi
```

- [ ] **Step 1: Failing testler.** `canli.test.ts`: `canliMenuGetir_204_nullDoner`, `canliMenuGetir_agHatasi_nullDonerVeLoglar`, `canliMenuGetir_bozukJson_null`, `canliMenuGetir_semayaUymayanBelge_null`, `canliMenuGetir_zamanAsimi_null` (sahte `getir` AbortSignal'e uyar), `canliMenuGetir_gecerli_belgeyiDoner`, `menuKarar_getirilenNull_bazDoner`, `menuKarar_getirilenGecerli_getirileniDoner`. `api.test.ts`: `yonetimApi_menuYayinla_putVeTabanGonderir`, `yonetimApi_menuGeriAl_postGonderir`.
- [ ] **Step 2: Run**, FAIL. **Step 3: Implement.** `canliMenuGetir` kimliksiz `GET ${kok}/menu`, yanıtı `menuBelgesiDogrula`'dan geçirir (sunucu sınırı: istemci gelen veriye güvenmez), hatayı `console.warn` ile loglar. **Step 4: Run**, PASS. **Step 5: Commit** `Add menu client API and safe live fetch`.

### Task 6: Menü sayfası canlı yenilenir

**Files:**
- Create: `components/sayfa/menu/MenuVerisi.tsx`, `components/sayfa/menu/MenuVerisi.module.css`
- Modify: `components/sayfa/MenuSayfasi.tsx`, `components/sayfa/menu/{Ocakbasi,UrunKarti,OlcuSatirlari,Icecekler}.tsx` (+ fiyat öğelerine `data-fiyat`)
- Test: `lib/menu/canli.test.ts` (saf kısım T5'te); bu task derleme ve duman denemesiyle doğrulanır

**Interfaces:**
- Consumes: `canliMenuGetir`, `menuKarar`, `API_KOKU` (`lib/oyun/api.ts`).
- Produces: `MenuVerisiSaglayici({ baz, children })` ve `useMenu(): MenuBelgesi` (`'use client'`).

- [ ] **Step 1: Implement.** Sağlayıcı `baz` ile başlar. `useLayoutEffect` içinde `bekliyor=true` (yalnız tarayıcıda; SSR HTML'inde fiyatlar görünür, JS yoksa gizli kalmaz), `useEffect` `canliMenuGetir(API_KOKU, fetch, 4000)` çağırır, sonuç gelince ya da 1500 ms dolunca `bekliyor=false`, sonuçla `menuKarar` sonucu state'e yazılır. Sarmal `div` `display: contents`, yerel sınıf ve `data-bekliyor`; CSS `.sarmal[data-bekliyor='true'] [data-fiyat] { visibility: hidden }`. `MenuSayfasi` sağlayıcıyı `menuBelgesiYukle()` sonucuyla kurar; dört bileşen `'use client'` olur ve belgeyi `useMenu()` ile alır (T3'teki prop kalkar). Menü bileşenleri dışında bir şey sağlayıcıyı kullanmaz.
- [ ] **Step 2: Doğrula.** typecheck, testler, `npm run build`. `out/menu/index.html` T3 sonrası halle aynı (sağlayıcı SSR'da `baz` basar). Yerel duman: `GIZLI_TUZ=x KOKEN=http://localhost:3000 node sunucu/ana.ts` bellek depoyla, `NEXT_PUBLIC_OYUN_API=http://127.0.0.1:8402 npm run dev`, `curl -X PUT` ile bir fiyat yayınla (T4 kimlik bilgileriyle), tarayıcıda `/menu/` fiyatın değiştiğini `chrome-devtools-mcp` ile `take_snapshot` metninden doğrula (ekran görüntüsü okuma döngüsü yok, kullanıcı tercihi). Sunucuyu durdurup sayfanın derlenmiş fiyatla açıldığını doğrula (Review Focus 2).
- [ ] **Step 3: Commit** `Refresh the menu page from the live document`.

### Task 7: Yönetim paneli

**Files:**
- Create: `lib/menu/duzenleme.ts`, `lib/menu/duzenleme.test.ts`, `components/yonetim/{oturum.tsx,MenuYonetimi.tsx,KalemFormu.tsx,IcecekFormu.tsx,YayinOnayi.tsx,Gecmis.tsx}` ve her birinin `.module.css`, `app/(tr)/yonetim/page.tsx`
- Modify: `components/oyun/YonetimSayfasi.tsx` (giriş ve oturum kodunu `oturum.tsx`'ten alır), `content/yonetim.ts` (panel metinleri, yalnız Türkçe)

**Interfaces:**
- Consumes: T2 `menuBelgesiDogrula`, `menuFarki`; T5 `yonetimApiKur` menü çağrıları.
- Produces (`lib/menu/duzenleme.ts`, hepsi yeni belge döner, girdiyi değiştirmez):
```ts
export function kimlikUret(ad: string, mevcut: readonly string[]): string   // "Kuzu Şiş" -> "kuzu-sis", çakışırsa "-2"
export function kalemEkle(b: MenuBelgesi, adTr: string): MenuBelgesi         // sona eklenir, porsiyon 0 ile başlar; doğrulama yayını engeller
export function kalemSil(b: MenuBelgesi, id: string): MenuBelgesi            // 'ciger' için Error
export function kalemTasi(b: MenuBelgesi, id: string, yon: -1 | 1): MenuBelgesi // 'ciger' ve ciger'in altına taşıma için Error
export function icecekEkle(b: MenuBelgesi, adTr: string): MenuBelgesi
export function icecekSil(b: MenuBelgesi, id: string): MenuBelgesi
export function olcuEkle(b: MenuBelgesi, icecekId: string): MenuBelgesi
export function olcuSil(b: MenuBelgesi, icecekId: string, sira: number): MenuBelgesi
```
`oturum.tsx`: `Giris`, `hataMetni`, `apiAl`, `useOturum()` (oturum anahtarı `bozo-yonetim`, `/oyun/yonetim/` ile ortak: tek girişle iki ekran).

- [ ] **Step 1: Failing testler** (`duzenleme.test.ts`): `kimlikUret_turkceKarakter_asciiSlug` ("Kuzu Şiş" → `kuzu-sis`, "Çiğ Köfte" → `cig-kofte`), `kimlikUret_cakisma_sonekEkler`, `kalemSil_ciger_hataFirlatir`, `kalemTasi_ciger_hataFirlatir`, `kalemTasi_ikinciKalemiYukari_cigerinAltinaGirmez`, `kalemEkle_girdiyiDegistirmez`, `olcuSil_sonOlcu_hataFirlatir` (içecekte en az bir ölçü).
- [ ] **Step 2: Run**, FAIL. **Step 3: Implement** `duzenleme.ts`.
- [ ] **Step 4: Panel.** `MenuYonetimi` sekmeler: Ocakbaşı, Bozo Special, İçecekler, Geçmiş. Çalışma kopyası state'i; başlangıç `gecerli?.belge ?? baz` (baz = `menuBelgesiYukle()` sonucu sayfadan prop). Kalem formu: ad ve açıklama TR/EN yan yana, fiyatlar, şiş notları, `FotoId` seçimi (`fotograflar[id].etiket`), yukarı/aşağı, sil (Ciğer'de gizli). Alanın yanında `menuBelgesiDogrula` hatası anında; "Yayınla" düğmesi hata varken kapalı. Onay ekranı `YayinOnayi`: `menuFarki` listesi, `buyukSicrama` satırları kırmızı ve "Fiyat yüzde 50'den fazla değişiyor, emin misiniz?", doğrulama uyarıları. Onay `menuYayinla(taban, belge)`; 409'da "Başkası menüyü değiştirmiş, sayfayı yenileyip tekrar deneyin" (Review Focus 1), 401'de oturum kapanır (`oturum.tsx` mevcut `hataIsle`). `Gecmis`: son 20 sürüm (tarih, kaynak) ve "Bu sürüme dön": önce aynı `YayinOnayi` farkı, sonra `menuGeriAl`. Başarıdan sonra yeşil değil, düz metin: "Yayında. Menü sayfası birkaç saniyede güncellenir; arama motorlarındaki fiyat bir sonraki site yayınında güncellenir." (sözcükler kuralları geçer). Dokunma hedefi 44px, her alanın `label`'ı var, klavye ile tüm akış.
- [ ] **Step 5: Rota.** `app/(tr)/yonetim/page.tsx`: `/oyun/yonetim/page.tsx` ile aynı biçim (`robots: { index: false, follow: false }`), `MenuYonetimi`'ne `menuBelgesiYukle()` sonucunu prop verir. Sitemap `tumYollar()`'dan türediği için panel girmez; bunu bir testle sabitle: `sitemap_yonetimRotasiIcermez`.
- [ ] **Step 6: Doğrula.** typecheck, testler, `npm run build`; T6'daki yerel duman düzeneğiyle panelde bir fiyatı değiştirip yayınla, `/menu/`nin değiştiğini ve geçmişten geri almanın çalıştığını `take_snapshot` metniyle doğrula.
- [ ] **Step 7: Commit** `Add the menu management panel`.

### Task 8: Build öncesi çekme ve belgeler

**Files:**
- Create: `scripts/menuCek.ts`, `scripts/menuCek.test.ts`
- Modify: `package.json` (`prebuild`), `content/CLAUDE.md`, `sunucu/CLAUDE.md`, `README.md` (Publishing), `docs/surec/SUNUCU-CANLIYA-ALMA.md`, `docs/surec/DEVAM.md`, kök `CLAUDE.md` (yalnız `lib/` sayım satırı), `content/{tr,en}/gizlilik.ts`

**Interfaces:**
- Produces: `export async function menuCek(kok: string, getir: typeof fetch, hedef: string): Promise<'yazildi' | 'sunucudaYok' | 'basarisiz'>`

- [ ] **Step 1: Failing testler** (geçici dizinde): `menuCek_gecerliYanit_dosyayaYazar`, `menuCek_204_dosyaYazmaz`, `menuCek_agHatasi_varOlanDosyayaDokunmazVeBasarisizDoner`, `menuCek_gecersizBelge_dosyayaYazmaz`.
- [ ] **Step 2: Run**, FAIL. **Step 3: Implement**; betik sonunda durumu loglar, `basarisiz` çıkış kodunu bozmaz (build ağsız ortamda çalışsın) ama satırı `console.warn` ile yüksek sesle yazar. `package.json`: `"prebuild": "node scripts/menuCek.ts"`. `BOZO_MENU_API` ortam değişkeni varsayılanı `https://api.cigercibozo.com`.
- [ ] **Step 4: Belgeler.** `content/CLAUDE.md` > Prices: fiyat değişikliği artık panel; kod yolu yalnız `content/menu.varsayilan.json` ve ona bağlı test; ikram ve çip metinleri hâlâ sözlükte. README Publishing: build öncesi canlı sürüm çekilir, panelden yayın sonrası elle build ve deploy (Aşama 2'ye kadar). `SUNUCU-CANLIYA-ALMA.md`: yeni tablo (şemayı uygulama komutu zaten orada), yeni uçlar, geri alma (`systemctl stop bozo-oyun` menüyü derlenmiş hale döndürür). `sunucu/CLAUDE.md`: menü uçları bir cümle. Kök `CLAUDE.md`: "thirteen small modules plus the game's `lib/oyun/`" cümlesine `lib/menu/` eklenir, başka satır eklenmez (197 satır kalır). `DEVAM.md`: durum ve bekleyenler (aşağıdaki T9 sonuçları dahil, Aşama 2, Ciğer imza kuralı).
- [ ] **Step 5: Gizlilik metni.** Menü sayfasının `api.cigercibozo.com`'a menü okuma isteği attığını gerçeğe uygun tek bir cümleyle ekle (kullanılan veri: IP adresi, sitenin zaten barındığı sunucuda); `guncellemeMetni` tarihini yenile. Metni sahibin ya da hukukçunun gözden geçirmesi gerektiğini T9 raporunda işaretle; yeni hukuki iddia yazma.
- [ ] **Step 6: Run** tüm testler, typecheck. **Step 7: Commit** `Fetch the live menu before building and document the panel`.

### Task 9: Canlıya alma (her adımda kullanıcı onayı)

Bu task sunucuya yazar; her alt adımdan önce kullanıcıya söyle. Sandbox dışı çalışma `ssh`/`rsync` ve build için gerekli.

- [ ] **Step 1: Şema.** `ssh plesk-206 'MYSQL_PWD=$(cat /etc/psa/.psa.shadow) mariadb -uadmin bozo_oyun' < sunucu/sema.sql` (`SUNUCU-CANLIYA-ALMA.md`'deki komut). Doğrula: `SHOW TABLES LIKE 'menu_surum'`.
- [ ] **Step 2: Sunucu.** Runbook'taki güncelleme: `npm run build -w sunucu`, rsync, `chown`, `systemctl restart bozo-oyun`. Doğrula: `curl -s -o /dev/null -w '%{http_code}' https://api.cigercibozo.com/menu` → 204; `/yonetim/menu` kimliksiz → 401; `OPTIONS` ile `Access-Control-Allow-Methods` içinde `PUT`.
- [ ] **Step 3: Site.** `npm run build` (sandbox dışı), README'deki deploy ve doğrulama komutları (`plesk repair fs`, `--checksum` kuru koşu). `/yonetim/` 200 ve `noindex`.
- [ ] **Step 4: Uçtan uca.** Kullanıcıyla birlikte panelde bir deneme yayını (fiyatı değiştirmeden, ya da kuşbaşıyı 850 → 851 → geri al), `/menu/`'de değişimi ve geri alınışını izle. Deneme sürümleri geçmişte kalır, silinmez (tek yönlü kayıt).
- [ ] **Step 5: Teslim.** `git push` (kullanıcı onayıyla), `main` dalı eşit. Rapora: ayrıntılı kalan işler (Aşama 2, gizlilik metni incelemesi, `plesk repair fs` sonucu).

---

## Öz denetim

- **Spec kapsamı:** belge/sürüm (T1, T4), doğrulama ve onay ekranı (T2, T7), eşzamanlı düzenleme (T4, T7), canlı menü ve gizleme (T5, T6), panel (T7), build çekme (T8), ana sayfa kuralı (T3), Ciğer kuralı (T2, T7), gizlilik (T8), canlıya alma (T9). Aşama 2 bilerek planda yok.
- **Tip tutarlılığı:** `MenuBelgesi`, `MenuYaniti`, `YonetimMenuYaniti`, `MenuYayinYaniti`, `menuBelgesiDogrula`, `menuFarki`, `menuKarar`, `canliMenuGetir` adları task'lar arasında aynı.
- **Orantı:** kod gövdeleri yok; imza, test adı ve kural değerleri var.
