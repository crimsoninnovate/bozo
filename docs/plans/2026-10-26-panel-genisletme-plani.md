# Yönetim paneli genişletmesi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Panelden tükendi işareti, duyuru bandı, ikramlar ve iletişim bilgisi de yönetilsin; panel neyin anında, neyin site yayınında göründüğünü söylesin.

**Architecture:** Mevcut sürümlü `MenuBelgesi`ya üç bölüm (`duyuru`, `ikramlar`, `iletisim`) ve `tukendi` alanı eklenir; sürüm, geri alma, 409 ve sunucu uçları aynen kalır. Menü sayfası ve yeni `DuyuruBandi` canlı belgeyi tarayıcıda uygular; iletişim `next.config.ts` ile derlemeye gömülür.

**Tech Stack:** Next.js 16 (statik dışa aktarım), TypeScript strict, CSS Modules, `node:test`; yeni bağımlılık yok.

**Spec:** `docs/specs/2026-10-26-panel-genisletme-design.md` (önceki tasarım: `docs/specs/2026-10-26-menu-yonetim-design.md`; kod haritası: `components/yonetim/`, `lib/menu/`, `components/sayfa/menu/`).

## Global Constraints

- Proje kuralları: `CLAUDE.md` (kök), `content/CLAUDE.md`, `sunucu/CLAUDE.md`. Fonksiyon <= 50 satır, dosya <= ~700, satır <= 120, `any` yok, yorum bir iki satır.
- `lib/`, `content/`, `sunucu/` bağıl `.ts` importu kullanır (`@/` yok); bileşenler `@/*`.
- Metinlerde uzun/orta tire (U+2014, U+2013) ve Türkçede şapkalı harf yok. Panel yalnız Türkçe, metinler `content/yonetim.ts`'te.
- Renk ve kenar kuralları: yeni renk yok, köşe yarıçapı 0-3px, dokunma hedefi >= 44px, her alanın `label`'ı var.
- Commit: İngilizce, emir kipi, ilk satır < 72 karakter. **Co-Authored-By, Claude imzası ya da benzeri hiçbir satır yok** (proje kuralı).
- `npm run build` sandbox dışında çalışır (Google Fonts). Test: `rtk proxy npm test 2>&1 | grep -E "ℹ (pass|fail)"`.
- Her yeni bölüm eski belgeyle (yalnız `kalemler`, `ozel`, `icecekler`) uyumlu: doğrulayıcı eksik bölümü seed'in değeriyle tamamlar; 26 Ekim'de canlı yayınlanan 1. sürüm geçerli kalır.
- Sınırlar (doğrulayıcı reddeder): duyuru metni <= 140 karakter her dil; ikram ürünü <= 12, küme <= 8, kümede öğe <= 10; ikram/öğe/küme kimliği kalem kimliğiyle aynı kalıp; kullanıcı adı `^[A-Za-z0-9._]{1,40}$`; e-posta `^[^\s@]+@[^\s@]+\.[^\s@]+$` <= 100; telefon `^\+[0-9 ]{8,20}$`; Google yorum kodu `^[A-Za-z0-9_-]{6,40}$`; metinlerde `<` ve `>` yok (düz metin).

## Review Focus

1. 1. sürüm belgesi (yeni bölümsüz) panelde açılır, düzenlenir ve yayınlanır; geri alma çalışır (Task 1, 6).
2. Duyuru bitişi geçmişte ya da boş metin + `aktif: true`: bant çıkmaz, panelde hata verir (Task 1, 4, 6).
3. Girne saatine göre bitiş: UTC ile Girne arası fark gece yarısına denk gelirse bant yanlış kalkmaz (Task 1).
4. Ikram ürünü ya da kalem eklenince menü açılış cümlesindeki sayılar ve meta açıklaması kaymaz (Task 3).
5. İletişimde geçersiz e-posta/numara/kullanıcı adı yayına gitmez; telefon kapalıyken numara hiçbir yüzeyde çıkmaz (Task 1, 5, 7).

---

### Task 1: Belge modeli v2, doğrulama, tamamlama, seed ve fark

**Files:**
- Modify: `lib/menu/tipler.ts`, `lib/menu/dogrulama.ts`, `lib/menu/fark.ts`, `content/menu.varsayilan.json`, testleri (`dogrulama.test.ts`, `fark.test.ts`, `varsayilan.test.ts`)
- Create: `lib/menu/duyuru.ts`, `lib/menu/duyuru.test.ts`, `lib/menu/sayilar.ts`, `lib/menu/sayilar.test.ts`, `lib/menu/tamamla.ts`, `lib/menu/tamamla.test.ts`; Modify ayrıca `lib/menu/belgeYukle.ts`, `components/sayfa/menu/MenuVerisi.tsx`, `sunucu/menu.ts` (+ testleri)

**Interfaces:**
- Produces (`tipler.ts`):
```ts
export type Duyuru = { aktif: boolean; metin: Cift; bitis: string | null } // bitis: 'YYYY-MM-DDTHH:mm', Girne saati
export type IkramUrunu = { id: string; ad: Cift; aciklama: Cift; fotoId: FotoId | null }
export type IkramOgesi = { id: string; ad: Cift }
export type IkramGrubu = { id: string; ad: Cift; not: Cift | null; ogeler: IkramOgesi[] }
export type Ikramlar = { altMetin: Cift; urunler: IkramUrunu[]; gruplar: IkramGrubu[] }
export type Iletisim = { telefonAcik: boolean; telefon: string; eposta: string; instagram: string;
  facebook: string; tiktok: string; googleYorumKodu: string }
// MenuKalemi ve IcecekKalemi: + tukendi: boolean. MenuBelgesi: + duyuru, ikramlar, iletisim.
```
- Produces (`duyuru.ts`): `girneAnlik(simdi: Date): string` ('YYYY-MM-DDTHH:mm', Europe/Nicosia) ve `duyuruGoster(d: Duyuru, simdi: Date): boolean` (aktif, metin dolu ve bitis yok ya da `girneAnlik(simdi) < bitis`).
- Produces (`sayilar.ts`): `sayiYaz(n: number, dil: 'tr' | 'en'): string` (0-20 sözcük, üstü rakam; TR küçük harf, EN küçük harf) ve `ikramSayisi(b: MenuBelgesi): number` (ürün sayısı + tüm kümelerdeki öğe sayısı).
- `menuBelgesiDogrula(girdi: unknown): Sonuc` aynı imza; `duyuru` ve `tukendi` isteğe bağlı (varsayılan `aktif: false`, `false`), `ikramlar` ve `iletisim` zorunlu. Bilinmeyen anahtar yine ret. `menuBelgesiTamamla(girdi: unknown, tam: MenuBelgesi): unknown` (`tamamla.ts`).

- [ ] **Step 1: Failing testler.** `dogrulama.test.ts` (adlar `menuBelgesiDogrula` önekiyle): `_duyuruAktifMetinBos_hataVerir`, `_duyuruMetin141Karakter_hataVerir`, `_duyuruHtmlIsareti_hataVerir`, `_bitisBicimiYanlis_hataVerir`, `_ikramlarEksik_bolumEksikKodu`, `_iletisimEksik_bolumEksikKodu`, `_duyuruveTukendiEksik_varsayilanlarlaTamamlar`, `_ikramUrunuIkiKezAyniId_hataVerir`, `_ikram13Urun_hataVerir`, `_eposta_gecersiz_hataVerir`, `_telefon_artisizNumara_hataVerir`, `_kullaniciAdiBosluklu_hataVerir`, `_tukendiBoolDegil_hataVerir`. `duyuru.test.ts`: `duyuruGoster_bitisGecmis_false`, `_bitisYok_true`, `_pasif_false`, `girneAnlik_utc2130_ertesiGun0030` (Girne UTC+3 yazın, `2026-10-26T21:30:00Z` → `2026-10-27T00:30`), `duyuruGoster_bitisGirneGecesindeUtcFarkli_dogruKarar`. `sayilar.test.ts`: `sayiYaz_7_tr_yedi`, `_8_en_eight`, `_21_rakam`, `ikramSayisi_seed_sekiz`. `fark.test.ts`: yeni bölümlerde değişen alan listelenir (`duyuru.aktif`, `iletisim.eposta`, `ikramlar.urunler[...]`, `tukendi`); `buyukSicrama` yalnız fiyatta. `varsayilan.test.ts`: seed v2 geçerli.
- [ ] **Step 2: Run**, FAIL.
- [ ] **Step 3: Implement.** Tipleri ekle; doğrulayıcıya bölümleri ekle (mevcut alan-alan stil, her hata bir `Sorun` yoluyla). Kural: `duyuru` ve `tukendi` isteğe bağlıdır (eksikse `aktif: false` duyuru ve `tukendi: false` ile tamamlanır); `ikramlar` ve `iletisim` zorunludur (eksikse `kod: 'bolumEksik'`). Eski (1. sürüm) belgeler için saf `menuBelgesiTamamla(girdi: unknown, tam: MenuBelgesi): unknown` (`lib/menu/tamamla.ts`): `girdi`de eksik olan `ikramlar`/`iletisim`/`duyuru` bölümlerini `tam`dan alır, başka bir şeye dokunmaz. Kullanım yerleri: `belgeYukle.ts` (canlı dosya eksikse seed'den), istemci `MenuVerisi` ve `DuyuruBandi` (canlı belge eksikse `baz`dan; `canliMenuGetir`in doğrulamasından önce uygulanır), panelin açılışı (`gecerli.belge` eksikse `baz`dan), sunucu geri alma (`sunucu/menu.ts`: eski sürüm, **şu an geçerli** sürümün bölümleriyle tamamlanır, sonra doğrulanır; seed sunucu paketinde yok). Testlere `tamamla_bolumEksik_tamdanEkler`, `tamamla_bolumVar_dokunmaz` ve `sunucu/menu.test.ts`'e `postGeriAl_bolumsuzBirinciSurum_tamamlanmisYayinlanir` ekle. Seed JSON'a bölümleri ekle: ikram metinleri `content/{tr,en}/menu.ts` `ikramlar` bölümünden (`yesillikNotu` yeşillik kümesinin `not`u olur, `altMetin` ikram alt metni), iletişim `content/isletme.ts`'ten (`telefonAcik: false`, `telefon: '+90 533 888 74 24'`); id'ler mevcut ikram, küme ve öğe kimlikleri, foto kimlikleri `content/urunler.ts`'ten. `fark.ts`: yeni alanlar için etiket, önce/sonra metni.
- [ ] **Step 4: Run** tüm testler + typecheck, PASS. **Step 5: Commit** `Extend the menu document with announcement, treats and contact`.

### Task 2: Düzenleme işlemleri

**Files:** Modify `lib/menu/duzenleme.ts`, `lib/menu/duzenleme.test.ts`.

**Interfaces:**
- Consumes: Task 1 tipleri.
- Produces (hepsi yeni belge döner, girdiyi değiştirmez): `ikramUrunuEkle(b, adTr: string): MenuBelgesi`, `ikramUrunuSil(b, id: string)`, `ikramUrunuTasi(b, id: string, yon: -1 | 1)`, `ikramGrubuEkle(b, adTr: string)`, `ikramGrubuSil(b, id: string)` (en az bir küme kalır, yoksa Error), `ikramOgesiEkle(b, grupId: string, adTr: string)`, `ikramOgesiSil(b, grupId: string, ogeId: string)`; kimlikler `kimlikUret` ile (aynı ad çakışırsa `-2`).

- [ ] **Step 1: Failing testler:** `ikramUrunuEkle_girdiyiDegistirmez`, `ikramUrunuEkle_ayniAd_sonekEkler`, `ikramUrunuTasi_ilkiYukari_hataFirlatmaz_yerindeKalir`, `ikramGrubuSil_sonKume_hataFirlatir`, `ikramOgesiSil_olmayanId_hataFirlatir`, `ikramOgesiEkle_olmayanGrup_hataFirlatir`.
- [ ] **Step 2: Run**, FAIL. **Step 3: Implement** mevcut `kalemEkle/Sil/Tasi` desenine göre. **Step 4: Run**, PASS. **Step 5: Commit** `Add edit operations for treats`.

### Task 3: Site belgeden ikram, tükendi ve sayıları okur

**Files:**
- Modify: `components/sayfa/menu/Ikramlar.tsx` (`'use client'`, `useMenu()`), `components/sayfa/menu/Acilis.tsx` (spot sayıları), `components/sayfa/menu/{Ocakbasi,Icecekler,UrunKarti,OlcuSatirlari}.tsx` + css (tükendi), `content/{tr,en}/menu.ts` (`spot` şablon: `{kalem}`, `{ikram}`; `ikramlar` bölümü silinir), `content/{tr,en}/ortak.ts` (meta açıklaması şablonu), `content/urunler.ts` (`ikramlar`, `ikramGruplari` silinir), `content/types.ts`, `lib/jsonld.ts` ve `lib/llmsTxt.ts` (ikram ve tükendi), `content/icerik.test.ts`, ilgili testler.

**Interfaces:**
- Consumes: Task 1 `sayiYaz`, `ikramSayisi`, `Ikramlar`, `tukendi`.
- Produces: `acilisSpotu(sablon: string, b: MenuBelgesi, dil: 'tr' | 'en'): string` (`lib/menu/sayilar.ts` içinde; `{kalem}` yerine `sayiYaz(b.kalemler.length)`, `{ikram}` yerine `sayiYaz(ikramSayisi(b))`, cümle başına gelen sayının ilk harfi büyük). Kalem tükendiyse menü sayfasında ad soluk (`opacity` 0.55), fiyat yerine `s.menu.tukendi` ("Bugün yok" / "Sold out today"), kart tıklanabilir değil değişikliği yok. Aynı için içecek satırı. JSON-LD `Offer.availability`: tükendiyse `https://schema.org/OutOfStock`, aksi `InStock`. `llms.txt` tükendi kalemi listeler ama "(bugün yok)" ekler.

- [ ] **Step 1: Failing testler:** `acilisSpotu_yediKalemSekizIkram_tr`, `_sekizKalem_en`, `icerik.test.ts`'teki `menu_porsiyonSayisi_metindekiSayiylaAyni` testini yeni şablona uyarla (kalem sayısı değişince spot ve meta değişir, test sabit tabloya bağlı kalmaz), `menuJsonLd_tukendiKalem_outOfStock`, `llmsTxt_tukendiKalem_bugunYokNotu`, ikram render için `ikramlar_belgedenGelir_sozluktenDegil` (bileşen yerine saf `ikramGorunumu(b, dil)` yardımcı testi).
- [ ] **Step 2: Run**, FAIL. **Step 3: Implement.** `Ikramlar.tsx` belgeden okur (foto yuvası `fotoId` boşsa plakasız küme gibi), sözlükteki `ikramlar` metinlerini ve `urunler.ts` verisini kaldır (kalıntı bırakma). `docs/surec/` ve `content/CLAUDE.md` bu görevde değişmez (Task 8). **Step 4: Run** tüm testler, typecheck, `npm run build`; `out/menu/index.html` önceki build'e göre yalnız beklenen farkları taşır (spot aynı metin: "Yedi porsiyon, bir özel, sekiz ikram."). **Step 5: Commit** `Read treats and sold-out state from the menu document`.

### Task 4: Duyuru bandı ve gizlilik cümlesi

**Files:**
- Create: `components/layout/DuyuruBandi.tsx`, `components/layout/DuyuruBandi.module.css`
- Modify: `components/sayfa/Kabuk.tsx`, `content/{tr,en}/ortak.ts` (erişim etiketi), `content/{tr,en}/gizlilik.ts` (`aliciMetni`, `guncellemeMetni`), testler

**Interfaces:**
- Consumes: Task 1 `duyuruGoster`; `canliMenuGetir`, `menuKarar`, `API_KOKU` (T5 önceki iş).
- Produces: `<DuyuruBandi dil={Dil} baz={Duyuru} />` (`'use client'`). SSR: `baz` gösterilecekse (`duyuruGoster(baz, new Date())` derleme anında) bant derlenmiş HTML'de vardır. Tarayıcıda `canliMenuGetir(API_KOKU, fetch, 4000)` ile belge çekilir; bant `duyuruGoster` sonucuna göre açılır/kapanır; yükseklik geçişi, `prefers-reduced-motion`'da geçişsiz. `role="status"`, dil `lang` öznitelikli, rozet yok, yalnız metin ve (varsa) "Kapat" düğmesi (oturum boyu `sessionStorage`; kapatma bir sonraki duyuru metninde sıfırlanır: anahtar metnin özeti). Her sayfa açılışında tek istek.
- Yerleşim: üst barın hemen altı, `Kabuk` içinde; oyun rotalarında (`aktif === 'oyun'`) yok.

- [ ] **Step 1: Failing testler:** saf kısım `duyuruKarari(baz: Duyuru, canli: MenuBelgesi | null, simdi: Date): Duyuru` (`lib/menu/duyuru.ts`): `duyuruKarari_canliYok_bazKalir`, `_canliVar_canliKazanir`, `_canliPasif_bantYok`. Gizlilik: `gizlilik_aliciMetni_duyuruyuAnar` (TR ve EN, `guncellemeMetni` bugünün tarihi).
- [ ] **Step 2: Run**, FAIL. **Step 3: Implement.** Gizlilik cümlesi: sayfaların menü ve duyuru verisi için `api.cigercibozo.com`'a istek attığı, IP adresinin sitenin zaten barındığı sunucuya ulaştığı; yeni hukuki iddia yok. **Step 4:** testler, typecheck, build; `out/yonetim/` ve oyun rotalarında bant yok. **Step 5: Commit** `Show a live announcement bar on every page`.

### Task 5: İletişim derleme zamanı, sürüm gömme

**Files:**
- Modify: `next.config.ts`, `content/isletme.ts`, `scripts/menuCek.ts` (+ test), `lib/menu/belgeYukle.ts`, `.gitignore`
- Create: `lib/menu/iletisimEnv.ts`, `lib/menu/iletisimEnv.test.ts`

**Interfaces:**
- Produces: `iletisimiEnveCevir(b: MenuBelgesi): { iletisim: string; surum: string }` ve `iletisimiEnvdenOku(ham: string | undefined, varsayilan: Isletme): Isletme` (`lib/menu/iletisimEnv.ts`, saf; ham yoksa ya da bozuksa `console.warn` ve varsayılan). `content/isletme.ts` `isletme` nesnesini `iletisimiEnvdenOku(process.env.NEXT_PUBLIC_ILETISIM, varsayilanIsletme)` ile kurar: `telefonAcik` false ise `telefon` ve `whatsapp` `null`. `menuCek` sunucudan gelen `surum`'u `content/menu.canli.meta.json` (`{ surum: number, cekilme: string }`, gitignore) yazar; `next.config.ts` `env: { NEXT_PUBLIC_ILETISIM, NEXT_PUBLIC_MENU_SURUMU }` (meta dosyası yoksa `'0'`).

- [ ] **Step 1: Failing testler:** `iletisimiEnvdenOku_hamYok_varsayilanKalir`, `_hamBozuk_uyarirVeVarsayilan`, `_telefonKapali_telefonVeWhatsappNull`, `_telefonAcik_ikisiDeNumara`, `_eposta_ustuneYazar`, `menuCek_yaziliyor_metaDosyasiSurumuTasir`.
- [ ] **Step 2: Run**, FAIL. **Step 3: Implement.** `next.config.ts` `belgeYukle`'yi (node tarafı) içe aktarıp iletişimi okur; `isletme`'yi içe aktaran dosyalara dokunma. `TELEFONLA_ILETISIM_ACIK` sabiti kalkar (yerini belge alır; yorum bloğu kısalır). **Step 4:** testler, typecheck; `BOZO_MENU_API` bir test sunucusuna ya da elle yazılmış `content/menu.canli.json`'a karşı `npm run build`: `out/` içinde e-posta ve sosyal kullanıcı adları değişir (grep ile doğrula, değişiklikten sonra dosyayı sil). **Step 5: Commit** `Bake the contact details from the menu document into the build`.

### Task 6: Panel: tükendi, duyuru ve ikramlar

**Files:**
- Create: `components/yonetim/DuyuruFormu.tsx`, `components/yonetim/IkramFormu.tsx` (+ `.module.css`)
- Modify: `components/yonetim/{MenuYonetimi,KalemFormu,IcecekFormu,Alanlar}.tsx`, `content/yonetim.ts`, `content/yonetim.test.ts`

**Interfaces:**
- Consumes: Task 1-2 tipleri ve işlemler.
- Produces: sekmeler Ocakbaşı, Bozo Special, İçecekler, **İkramlar**, **Duyuru**, (İletişim Task 7'de), Geçmiş. Her kalem ve içecek satırında "Bugün yok" onay kutusu (`tukendi`), etiketli, 44px. Duyuru sekmesi: aktif anahtarı, TR/EN metin (sayaç `n/140`), bitiş (`datetime-local`, Girne saati; boş = süresiz), canlı önizleme bandı. İkramlar sekmesi: ürün kartları (ad, açıklama TR/EN, foto seçimi), kümeler (ad, not, öğeler), ekle, sil, yukarı/aşağı. Doğrulayıcı hataları alanın yanında (mevcut desen), "Yayınla" hata varken kapalı.

- [ ] **Step 1: Failing testler:** saf yardımcılar `lib/menu/panel.ts`: `bitisGirdisindenDegere('2026-10-27T09:00'): string | null` ve `degerdenBitisGirdisine`, `''` → `null` testleri; `content/yonetim.test.ts` yeni metinleri yasak ifade ve çizgi kurallarından geçirir.
- [ ] **Step 2: Run**, FAIL. **Step 3: Implement** mevcut form desenine uyarak; her sekme tek dosya, `MenuYonetimi.tsx` 700 satırı geçmez (geçerse sekme içeriğini ayır). **Step 4:** typecheck, testler, build; yerel duman (önceki planın duman düzeneği: statik build + bellek depolu yerel skor sunucusu, boş port; arc'a ya da üretim API'sine dokunma): duyuru yayınla, `/menu/` ve `/`'da bantı gör (`take_snapshot` metni), tükendi işareti `/menu/`'de görünür, 1. sürüm belgesini geri al ve yeni sekmelerin boş hatasız açıldığını doğrula. **Step 5: Commit** `Manage sold-out items, the announcement and treats from the panel`.

### Task 7: Panel: iletişim, site sürümü göstergesi, kaydedilmemiş koruma

**Files:**
- Create: `components/yonetim/IletisimFormu.tsx`, `components/yonetim/SiteDurumu.tsx` (+ css)
- Modify: `components/yonetim/{MenuYonetimi,YayinOnayi}.tsx`, `app/(tr)/yonetim/page.tsx`, `content/yonetim.ts`

**Interfaces:**
- Consumes: Task 5 `NEXT_PUBLIC_MENU_SURUMU`; Task 1 tipleri.
- Produces: `siteDurumu(yayinSurum: number | null, siteSurum: number): { guncel: boolean; metin: string }` (`lib/menu/panel.ts`; `siteSurum` 0 ya da küçükse "site tohum menüyle basılmış"; fark varsa "Sitede #N, panelde #M: iletişim bilgisi, arama motoru verisi ve ikram metinleri siteyi yeniden yayınlayınca güncellenir"). İletişim sekmesi alanlarının altında "Bu alanlar bir sonraki site yayınında görünür" notu. Kaydedilmemiş koruma: çalışma kopyası yayındakinden farklıyken `beforeunload` uyarısı ve "Değişiklikleri at" düğmesi (onaylı). `YayinOnayi` iletişim ve ikram farklarını aynı listede gösterir; telefon açılıyorsa satır vurgulanır ("Numara sitede herkese görünür olacak").

- [ ] **Step 1: Failing testler:** `siteDurumu_ayniSurum_guncel`, `_farkli_metinSurumleriTasir`, `_siteTohum_tohumMetni`, `degisiklikVarMi_ayniBelge_false` (`lib/menu/panel.ts`, `JSON` eşitliği yerine alan eşitliği), `iletisimDogrula_gecersizEposta_hata` (alan hata yolu doğrulayıcıdan).
- [ ] **Step 2: Run**, FAIL. **Step 3: Implement.** **Step 4:** typecheck, testler, build; yerel duman: e-posta geçersizken yayın kapalı, telefon açma onay satırı vurgulu, sekme kapatma uyarısı `beforeunload` ile (kod okunarak doğrula; tarayıcıda tetiklenmez). **Step 5: Commit** `Add contact management and the site version indicator to the panel`.

### Task 8: Tek komutla yayın, sunucu sınırı, belgeler

**Files:**
- Create: `scripts/yayinla.sh`
- Modify: `package.json` (`yayinla`), `README.md` (Publishing), `docs/surec/SUNUCU-CANLIYA-ALMA.md`, `docs/surec/DEVAM.md`, `content/CLAUDE.md`, `sunucu/CLAUDE.md` (gövde sınırı notu), kök `CLAUDE.md` (yalnız `components/` kova ve `lib/` sayım cümlelerine ek; 197 satırı aşma), `sunucu/menu.test.ts`

**Interfaces:** `npm run yayinla`: `npm run build`, `rsync -az --delete out/ plesk-206:/var/www/vhosts/cigercibozo.com/httpdocs/`, `chown` iki satırı, `plesk repair fs cigercibozo.com -n`, `--checksum` kuru çalıştırmada fark sayısı 0 beklenir; her adım hata verirse durur (`set -euo pipefail`), `plesk-206`'ya erişemezse anlaşılır mesaj. Betik sır içermez.

- [ ] **Step 1: Failing test:** `sunucu/menu.test.ts`: `putYonetimMenu_enBuyukGecerliBelge_64KBAltinda` (her sınırda en uzun belge: 40 kalem, 30 içecek, 12 ikram ürünü, 8 küme x 10 öğe, tüm metinler azami uzunlukta, `JSON.stringify` boyutu < 64 * 1024; aşıyorsa gövde sınırı bu görevde 128 KB'a çıkar ve `sunucu/http.ts` testi güncellenir).
- [ ] **Step 2: Run**, FAIL ya da ölçüm. **Step 3: Implement** betik ve belgeler: "ne anında, ne yayınla gerektirir" tablosu (fiyat, tükendi, duyuru, ikram: menü sayfasında anında; ikram/iletişim/JSON-LD/llms.txt/meta: site yayınında), `content/CLAUDE.md` Prices güncel, DEVAM yeni durum ve bekleyenler (çalışma saatleri neden alan değil, Aşama 2, fotoğraf yükleme). **Step 4:** tüm testler, typecheck, `bash -n scripts/yayinla.sh`. **Step 5: Commit** `Add a one-command site deploy and document the panel sections`.
