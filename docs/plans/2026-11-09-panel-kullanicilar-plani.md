# Panel: kişi başına giriş ve değişiklik kaydı Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admin (sahibi) panelden hesap açıp kapatabilsin; her hesap kendi şifresiyle girsin; her menü sürümü ve önemli işlem yapanın adını taşısın.

**Architecture:** Admin bugünkü gibi ortamda (`YONETIM_KULLANICI`/`YONETIM_SIFRE`), veritabanına hiç dokunmadan doğrulanır. Diğer hesaplar `yonetim_personel` tablosunda, scrypt özetiyle. Oturum anahtarı hesabı ve hesabın `oturum_surumu`'nu imzalar; kapatma, sıfırlama ve şifre değişikliği sürümü artırır, eski anahtarlar düşer. Her yönetim isteği bir `Yetkili` çözer; işleyiciler bunu kayda (`yonetim_islem`) ve sürüm yazarına (`menu_surum.yazar`) geçirir.

**Tech Stack:** Node 24 `node:http`, `node:crypto` (`scrypt`, `createHmac`, `timingSafeEqual`), MariaDB, `node:test`, Next.js 16 statik panel, CSS Modules. Yeni bağımlılık yok.

**Spec:** `docs/specs/2026-11-09-panel-kullanicilar-design.md`

## Global Constraints

- Proje kuralları: `CLAUDE.md` (kök), `sunucu/CLAUDE.md`, `content/CLAUDE.md`. Fonksiyon <= 50 satır, dosya <= ~700, satır <= 120, `any` yok, yorumlar bir iki satır.
- `lib/`, `content/`, `sunucu/` bağıl `.ts` importu; bileşenler ve `app/` `@/*`. Alan kavramları Türkçe ASCII adlarla.
- Panel metinleri yalnız Türkçe, `content/yonetim.ts`'te; uzun/orta tire yok, şapkalı harf yok.
- Admin girişi veritabanına bağlı değildir: depo hata verse de admin Basic ve admin Bearer geçer.
- Şifre: en az 10, en çok 200 karakter. Hesap adı `^[a-z0-9][a-z0-9.-]{1,29}$`, adminin adıyla (büyük/küçük harf duyarsız) aynı olamaz.
- Eski biçimli admin anahtarı (`<bitisMs>.<hex64>`) `ESKI_ANAHTAR_SONU = Date.UTC(2026, 11, 15)` tarihine kadar kabul edilir.
- Kayıt bir yıl (365 gün) tutulur. Kayıtta şifre, özet ya da belge içeriği yok.
- Commit: İngilizce, emir kipi, ilk satır < 72, **imza/Co-Authored-By satırı yok**, yalnız açık yollar `git add`; `git commit -a` yasak.
- Test: `npm test 2>&1 | grep -E "ℹ (pass|fail)"`; typecheck: `npm run typecheck`. MariaDB sözleşme testi `BOZO_TEST_DB_URL` ile isteğe bağlı.

## Review Focus

1. Var olmayan hesap adı ile yanlış şifre ayırt edilemez: ikisi de 401 `kimlikGerekli` ve ikisinde de bir scrypt koşar (Task 3).
2. Veritabanı çökükken sahibi girebilir: `personel*` yöntemleri hata atan bir depoyla admin Basic ve Bearer geçer (Task 3).
3. Kapatılan hesabın elindeki 30 günlük anahtar bir sonraki istekte 401 alır; yeniden açmak eski anahtarı canlandırmaz (Task 2, 4).
4. Şifresi değişmesi gereken hesap menüyü yayınlayamaz, fotoğraf yükleyemez, derleme isteyemez: 403 `sifreDegismeli` (Task 3).
5. Admin olmayan hesap `/yonetim/personel*` uçlarına 403 `adminGerekli` alır; kendi kaydını ya da başkasını değiştiremez (Task 4).

---

### Task 1: Şifre özeti ve hesaba bağlı oturum anahtarı

**Files:**
- Create: `sunucu/parola.ts`, `sunucu/parola.test.ts`
- Modify: `sunucu/oturum.ts`, `sunucu/oturum.test.ts`

**Interfaces:**
- Produces:
  - `parolaOzeti(sifre: string): Promise<string>`: `scrypt$<N>$<r>$<p>$<tuzB64>$<ozetB64>`, N=16384, r=8, p=1, 16 bayt rastgele tuz, 32 bayt özet.
  - `parolaDogrula(sifre: string, ozet: string): Promise<boolean>`: bozuk özet false döner, atmaz; `timingSafeEqual`.
  - `SAHTE_OZET: string`: bilinmeyen hesapta da bir scrypt koşsun diye modül yüklenirken üretilen özet.
  - `type OturumSahibi = { id: number; surum: number; gizli: string }`: admin için `id: 0, surum: 0, gizli: \`${kullanici}:${sifre}\``; personel için `gizli: ''`.
  - `oturumAnahtariUret(tuz: string, sahip: OturumSahibi, bitisMs: number): string`: `k<id>.<surum>.<bitisMs>.<hex64>`, HMAC girdisi `yonetim-oturum2:${id}:${surum}:${gizli}:${bitisMs}`.
  - `oturumAnahtariCoz(yetki: string | undefined, simdi: number): { id: number; surum: number; bitis: number; imza: string } | 'eski' | null`: biçim ve süre denetimi; eski biçim `'eski'`.
  - `oturumImzasiTutar(tuz: string, sahip: OturumSahibi, cozulen: { bitis: number; imza: string }): boolean`.
  - `eskiAdminAnahtariGecerliMi(tuz, kimlik: { kullanici; sifre }, yetki, simdi): boolean`: bugünkü `oturumAnahtariGecerliMi`, `simdi >= ESKI_ANAHTAR_SONU` iken false. `ESKI_ANAHTAR_SONU` dışa aktarılır.

- [ ] **Step 1: Failing tests** in `sunucu/parola.test.ts`:
  - `parolaOzeti_dogruSifre_dogrular`: `parolaDogrula('dogru-sifre-1', await parolaOzeti('dogru-sifre-1'))` true; `'yanlis-sifre'` false.
  - `parolaOzeti_ayniSifreIkiKez_farkliOzet`.
  - `parolaDogrula_bozukOzet_falseAtmaz`: `''`, `'scrypt$x'`, `'md5$...'` false.
  And in `sunucu/oturum.test.ts`:
  - `oturumAnahtari_personel_cozulurVeImzaTutar`: `k7.3.<bitis>.<hex>` çözülür, `{id:7, surum:3}`; aynı sahip için imza tutar.
  - `oturumAnahtari_surumArtinca_imzaTutmaz`: sahip `surum: 4` ile imza false.
  - `oturumAnahtari_sureDolmusYaDaCokIleri_null`: bugünkü sınırlar (bitis <= simdi; > simdi + 30 gün + 1 dk).
  - `oturumAnahtari_eskiBicim_eskiDoner` ve `eskiAdminAnahtari_sonTarihtenSonra_gecersiz`: `simdi = ESKI_ANAHTAR_SONU` iken eskiden geçerli olan anahtar false.
- [ ] **Step 2: Run** `node --test sunucu/parola.test.ts sunucu/oturum.test.ts`, expect FAIL (modül yok).
- [ ] **Step 3: Implement** both modules. `scrypt` promisified via `node:util`; `maxmem` 64 MB. Bugünkü `oturumAnahtariGecerliMi`/`oturumAnahtariUret` `eskiAdminAnahtariGecerliMi`/`eskiAdminAnahtariUret` olarak yeniden adlanır ve `yonetim.ts` importları güncellenir; Task 3 yeni biçime geçer ve `eskiAdminAnahtariUret`'i siler.
- [ ] **Step 4: Run** the two test files and `npm run typecheck`, expect PASS.
- [ ] **Step 5: Commit** `git add sunucu/parola.ts sunucu/parola.test.ts sunucu/oturum.ts sunucu/oturum.test.ts sunucu/yonetim.ts` -> "Add scrypt password hashes and account-bound session keys".

### Task 2: Depo: personel, işlem kaydı, sürüm yazarı

**Files:**
- Create: `lib/yonetim/personel.ts` (yalnız `IslemTuru`; Task 4 genişletir)
- Modify: `sunucu/depo.ts`, `sunucu/bellekDepo.ts`, `sunucu/mariaDepo.ts`, `sunucu/depoSozlesmesi.ts`, `sunucu/sema.sql`, `sunucu/menu.ts` (yalnız yeni `yazar` parametresini geçirir), `sunucu/menu.test.ts`

**Interfaces:**
- Produces in `sunucu/depo.ts`:
  - `type Personel = { id: number; ad: string; parolaOzeti: string; sifreDegismeli: boolean; kapali: boolean; oturumSurumu: number; olusturma: number; sonGiris: number | null }`
  - `IslemTuru`, yeni `lib/yonetim/personel.ts`'ten (sunucu ve panel paylaşır): `'giris' | 'menuYayin' | 'menuGeriAl' | 'foto' | 'derleme' | 'kod' | 'gizle' | 'personelEkle' | 'personelKapat' | 'personelAc' | 'sifreSifirla' | 'sifreDegistir'`
  - `type Islem = { id: number; personelId: number | null; ad: string; tur: IslemTuru; ayrinti: string; zaman: number }` (`personelId` null = admin)
  - Depo yöntemleri:
    - `personelEkle(ad: string, parolaOzeti: string, simdi: number): Promise<Personel | 'adKullanimda'>` (yeni hesap `sifreDegismeli: true`, `oturumSurumu: 1`)
    - `personelBul(id: number): Promise<Personel | null>`, `personelAdla(ad: string): Promise<Personel | null>`, `personelListesi(): Promise<Personel[]>` (ada göre)
    - `personelSifreKoy(id: number, parolaOzeti: string, sifreDegismeli: boolean): Promise<Personel | null>`: `oturumSurumu` +1
    - `personelKapat(id: number, kapali: boolean): Promise<Personel | null>`: `oturumSurumu` +1
    - `personelGirisKaydet(id: number, simdi: number): Promise<void>`
    - `islemEkle(islem: Omit<Islem, 'id'>): Promise<void>`, `islemler(adet: number, personelId?: number | null): Promise<Islem[]>` (yeniden eskiye; `null` yalnız admin), `eskiIslemleriSil(oncesi: number): Promise<number>`
    - `menuYayinla(belge, kaynak, simdi, taban, yazar: string | null)`; `menuSurumleri` satırı `yazar: string | null` taşır.
- `sema.sql`: `yonetim_personel` (`ad` UNIQUE, `parola_ozeti VARCHAR(200)`, `sifre_degismeli`, `kapali`, `oturum_surumu INT UNSIGNED`, `olusturma_ms`, `son_giris_ms` NULL), `yonetim_islem` (`personel_id` NULL, `ad`, `tur` ENUM yukarıdaki değerler, `ayrinti VARCHAR(200)`, `zaman_ms`, indeks `(zaman_ms)` ve `(personel_id, zaman_ms)`), ve bir yorumla işaretli `ALTER TABLE menu_surum ADD COLUMN IF NOT EXISTS yazar VARCHAR(40) NULL` (MariaDB destekler).

- [ ] **Step 1: Failing contract tests** in `depoSozlesmesi.ts` (her iki depoda koşar):
  - `personelEkle_ayniAd_adKullanimda`; `personelEkle_yeniHesap_sifreDegismeliSurum1`.
  - `personelSifreKoy_surumArtar` ve `personelKapat_surumArtar`: kapatıp açınca sürüm 1 -> 3.
  - `islemler_yenidenEskiyeVeKisiyeGore`: üç kayıt, `islemler(2)` son ikisi; `islemler(10, null)` yalnız admin satırları.
  - `eskiIslemleriSil_sinirdanEskiler`.
  - `menuSurumleri_yazarTasir`: `menuYayinla(..., 'ajans')` sonra özet `yazar: 'ajans'`.
- [ ] **Step 2: Run** `node --test sunucu/bellekDepo.test.ts`, expect FAIL.
- [ ] **Step 3: Implement** in `bellekDepo.ts` and `mariaDepo.ts`. `menuYayinla`'nın `yazar` parametresi `string | null`; `menu.ts` bu task'te `null` geçer, Task 5 giriş yapanın adını geçirir.
- [ ] **Step 4: Run** `npm test` (and with `BOZO_TEST_DB_URL` if a local MariaDB exists), expect PASS.
- [ ] **Step 5: Commit** "Store staff accounts, an action log and version authors".

### Task 3: Kimlik çözme ve rota korumaları

**Files:**
- Modify: `sunucu/yonetim.ts`, `sunucu/uygulama.ts`, `sunucu/uygulama.test.ts`, `sunucu/uclar.test.ts` gerekiyorsa
- Create: `sunucu/yetki.test.ts`

**Interfaces:**
- Consumes: Task 1 tamamı; Task 2 `personelBul`, `personelAdla`, `personelGirisKaydet`, `islemEkle`.
- Produces in `sunucu/yonetim.ts`:
  - `type Yetkili = { id: number; ad: string; admin: boolean; sifreDegismeli: boolean }` (admin `id: 0`, `ad: YONETIM_KULLANICI`)
  - `yetkiliCoz(b: Baglam, admin: YonetimKimligi | null, istek: Istek): Promise<Yetkili>`: admin `null` ise 503 `yonetimKapali`; Basic: önce admin (`esitMi`), sonra `personelAdla` + `parolaDogrula` (bilinmeyen adda `SAHTE_OZET`), kapalıysa 401; Bearer: `'eski'` -> `eskiAdminAnahtariGecerliMi`; `id 0` -> admin gizlisiyle imza; diğer -> `personelBul`, kapalı değil, `oturumSurumu === surum`, imza. Hepsinde hata `401 kimlikGerekli`.
  - `yonetimOturum(b, admin, istek)`: yalnız Basic; yanıt `YonetimOturumYaniti` artık `{ anahtar, bitis, ad, admin, sifreDegismeli }`; personelde `personelGirisKaydet` ve `islemEkle({ tur: 'giris', ayrinti: '' })`, admin girişi de kaydedilir (`personelId: null`), kayıt hatası girişi bozmaz (`console.warn`).
- `uygulama.ts`: `Rota.isle` imzası `(istek: Istek, es: string[], yetkili: Yetkili) => Promise<Yanit>` olur (yönetim dışı rotalar üçüncü argümanı yok sayar). Sarmalayıcılar:
  - `y(isle)`: `yetkiliCoz`; `sifreDegismeli` ise 403 `sifreDegismeli`.
  - `s(isle)`: `yetkiliCoz`, `sifreDegismeli` serbest; yalnız `GET /yonetim/ben` ve `POST /yonetim/sifre` için.
  - `a(isle)`: `y` + `admin` değilse 403 `adminGerekli`.
  - `yetkiliMi` async olur; davranışı (geniş kova yalnız geçerli kimliğe) aynı kalır.

- [ ] **Step 1: Failing tests** `sunucu/yetki.test.ts` (bellek deposu ile, `uygulamaKur` üzerinden HTTP değil, doğrudan `yetkiliCoz`):
  - `yetkiliCoz_adminBasic_adminDoner` ve `yetkiliCoz_adminBearerYeni_adminDoner`.
  - `yetkiliCoz_eskiAdminAnahtari_sonTarihtenOnceGecer`.
  - `yetkiliCoz_depoHataAtar_adminYineGecer`: `personelAdla`/`personelBul` throw eden depo sarmalayıcısıyla.
  - `yetkiliCoz_personelBasic_dogruSifreGecerYanlis401`.
  - `yetkiliCoz_bilinmeyenAdVeYanlisSifre_ayniHata`: ikisi de `IstekHatasi(401, 'kimlikGerekli')`. Bilinmeyen adda `parolaDogrula(sifre, SAHTE_OZET)` çağrısı kod incelemesinde denetlenir.
  - `yetkiliCoz_kapaliHesap_basicVeBearer401`; `yetkiliCoz_surumEski_401`.
  And in `sunucu/uygulama.test.ts`:
  - `yonetim_sifreDegismeli_menuPut403VeBenGecer`.
  - `yonetimOturum_personel_adAdminSifreDegismeliDoner`.
- [ ] **Step 2: Run** `node --test sunucu/yetki.test.ts sunucu/uygulama.test.ts`, expect FAIL.
- [ ] **Step 3: Implement** `yetkiliCoz`, `yonetimOturum` ve sarmalayıcılar. Mevcut bütün `y(...)` rotaları `y` olarak kalır; `yonetimDenetle` silinir (çağıranı kalmaz).
- [ ] **Step 4: Run** `npm test` and `npm run typecheck`, expect PASS (mevcut uygulama testleri değişmeden geçer).
- [ ] **Step 5: Commit** "Resolve each staff request to an account".

### Task 4: Hesap yönetimi uçları

**Files:**
- Create: `sunucu/personel.ts`, `sunucu/personel.test.ts`, `lib/yonetim/personel.test.ts`
- Modify: `lib/yonetim/personel.ts`
- Modify: `sunucu/uygulama.ts` (rotalar), `lib/oyun/aktarim.ts` (`YonetimOturumYaniti`)

**Interfaces:**
- Produces in `lib/yonetim/personel.ts` (sunucu ve panel paylaşır):
  - `AD_DESENI = /^[a-z0-9][a-z0-9.-]{1,29}$/`, `SIFRE_EN_AZ = 10`, `SIFRE_EN_COK = 200`
  - `adSorunu(ad: string, adminAdi: string): 'adGecersiz' | 'adAdminin' | null`, `sifreSorunu(sifre: string): 'sifreKisa' | 'sifreUzun' | null`
  - Yanıt tipleri: `BenYaniti = { ad: string; admin: boolean; sifreDegismeli: boolean }`, `PersonelSatiri = { id: number; ad: string; kapali: boolean; sifreDegismeli: boolean; olusturma: string; sonGiris: string | null; sonIslemler: IslemSatiri[] }`, `IslemSatiri = { ad: string; tur: IslemTuru; ayrinti: string; zaman: string }`.
- Uçlar (`sunucu/personel.ts`, kod adları hata gövdesi `{ hata }`):
  - `GET /yonetim/ben` (`s`) -> `BenYaniti`.
  - `POST /yonetim/sifre` (`s`) `{ eski, yeni }`: admin -> 400 `adminSifresiSunucuda`; `eski` yanlış -> 401 `kimlikGerekli`; `yeni === eski` -> 400 `sifreAyni`; `sifreSorunu` -> 400; başarıda `personelSifreKoy(id, ozet, false)`, kayıt `sifreDegistir`, yanıt yeni sürümle yeni `YonetimOturumYaniti` (bu cihaz oturumda kalır, diğerleri düşer).
  - `GET /yonetim/personel` (`a`) -> `{ personel: PersonelSatiri[]; adminIslemleri: IslemSatiri[] }` (her hesaba son 5 işlem; admininki ayrı, son 5).
  - `POST /yonetim/personel` (`a`) `{ ad, sifre }` -> 201 `PersonelSatiri`; `adSorunu`/`sifreSorunu` -> 400; `adKullanimda` -> 409. Kayıt `personelEkle`, ayrıntı hesap adı.
  - `POST /yonetim/personel/:id/kapat` (`a`) `{ kapali: boolean }` -> `PersonelSatiri`; yoksa 404 `personelYok`; kayıt `personelKapat` ya da `personelAc`.
  - `POST /yonetim/personel/:id/sifre` (`a`) `{ sifre }` -> `personelSifreKoy(id, ozet, true)`; kayıt `sifreSifirla`.
  - `GET /yonetim/islemler?personel=<id|admin>` (`a`) -> `{ islemler: IslemSatiri[] }`, en çok 100.

- [ ] **Step 1: Failing tests** `lib/yonetim/personel.test.ts`: `adSorunu_gecerliVeGecersizAdlar` (`'ajans'`, `'ajans.ali'` geçer; `'A'`, `'Ajans'`, `'a'`, `'-ajans'`, 31 karakter, `'Bozo'` admin `'bozo'` iken `adAdminin`), `sifreSorunu_sinirlar` (9 ve 201 karakter). `sunucu/personel.test.ts` (`uygulamaKur` + bellek deposu, mevcut `uygulama.test.ts` yardımcılarıyla):
  - `personel_adminAcar_kullaniciGeciciSifreyleGirerSifreDegistirir`: aç, Basic ile `/yonetim/oturum`, `sifreDegismeli: true`, `PUT /yonetim/menu` 403, `POST /yonetim/sifre`, yeni anahtarla `PUT` geçer.
  - `personel_kapatilir_eskiAnahtar401VeYenidenAcmakCanlandirmaz`.
  - `personel_sifreSifirlanir_eskiAnahtar401`.
  - `personel_adminOlmayan_personelUclari403`.
  - `personel_ayniAd_409` ve `personel_adminAdi_400`.
  - `sifre_admin_400AdminSifresiSunucuda`; `sifre_yeniEskiyleAyni_400`.
  - `personel_liste_sonGirisVeSonIslemler`.
- [ ] **Step 2: Run** `node --test sunucu/personel.test.ts lib/yonetim/personel.test.ts`, expect FAIL.
- [ ] **Step 3: Implement** `sunucu/personel.ts` and routes; ad `/:id` deseni `(\d{1,9})`; gövde `istek.govde()` (mevcut 64 KB sınırı).
- [ ] **Step 4: Run** `npm test`, typecheck, expect PASS.
- [ ] **Step 5: Commit** "Let the admin open, close and reset staff accounts".

### Task 5: İşlemleri kaydet, sürüme yazarı yaz, kaydı buda

**Files:**
- Modify: `sunucu/menu.ts`, `sunucu/foto.ts`, `sunucu/derleme.ts`, `sunucu/yonetim.ts` (`yonetimKod`, `yonetimGizle`), `sunucu/uygulama.ts` (yetkiliyi geçir), `sunucu/isler.ts`, ilgili `*.test.ts`, `lib/menu/aktarim.ts` (`SurumOzeti.yazar: string | null`)

**Interfaces:**
- Consumes: `Yetkili` (Task 3), `islemEkle`/`eskiIslemleriSil` (Task 2).
- Produces: `islemYaz(b: Baglam, yetkili: Yetkili, tur: IslemTuru, ayrinti: string): Promise<void>` in `sunucu/yonetim.ts`: kayıt hatası işlemi bozmaz, `console.warn` ile günlüğe düşer. Ayrıntılar: `menuYayin`/`menuGeriAl` -> `sürüm <yeni id>` (geri almada `sürüm <yeni> (<eski> geri alındı)`), `foto` -> dosya adı, `derleme` -> `''`, `kod` -> `<sira>. <takmaAd>`, `gizle` -> `oyuncu <id> gizli|açık`.
- `yayinla(..., yazar = yetkili.ad)`; `GET /yonetim/menu` sürüm özetleri `yazar` taşır.
- `isler.ts`: `ISLEM_SAKLAMA_MS = 365 * 24 * 60 * 60_000`; `suresiDolaniSil` `depo.eskiIslemleriSil(simdi - ISLEM_SAKLAMA_MS)` çağırır.

- [ ] **Step 1: Failing tests**:
  - `menu.test.ts`: `menuYayinla_personel_surumYazariVeIslemKaydi` (personel anahtarıyla PUT, `GET /yonetim/menu` özetinde `yazar: 'ajans'`, `islemler` son satır `menuYayin`, ayrıntı `sürüm N`).
  - `foto.test.ts`: `fotoYukle_islemKaydiDosyaAdi`.
  - `uygulama.test.ts`: `derlemeIste_islemKaydi`, `kod_islemKaydiSiraVeAd`.
  - `isler.test.ts`: `suresiDolaniSil_birYildanEskiIslemleriSiler`.
  - `menu.test.ts`: `islemKaydiAtar_yayinYineBasarili` (islemEkle throw eden depo).
- [ ] **Step 2: Run** the affected test files, expect FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `npm test`, typecheck, expect PASS.
- [ ] **Step 5: Commit** "Log staff actions and record who published each version".

### Task 6: Panel: istemci, kimlik ve şifre ekranı

**Files:**
- Modify: `lib/oyun/api.ts` (yeni yöntemler), `components/yonetim/oturum.tsx`, `components/yonetim/PanelUst.tsx`, `components/yonetim/MenuYonetimi.tsx` (açılışta `ben`), `components/oyun/YonetimSayfasi.tsx`, `content/yonetim.ts`
- Create: `components/yonetim/SifreFormu.tsx`, `components/yonetim/SifreFormu.module.css`

**Interfaces:**
- Consumes: Task 4 uçları ve tipleri.
- Produces in `lib/oyun/api.ts` `yonetimApiKur` dönüşüne: `ben()`, `sifreDegistir(eski: string, yeni: string): Promise<YonetimOturumYaniti>`, `personel()`, `personelEkle(ad, sifre)`, `personelKapat(id, kapali)`, `personelSifre(id, sifre)`, `islemler(personel: number | 'admin')`.
- `SifreFormu` props: `{ zorunlu: boolean; yetki: string; yeniOturum: (yetki: string, bitis: string) => void; vazgec?: () => void }`. Başarıda yeni anahtar aynı depoya (hatırla seçimi korunur) yazılır.
- Davranış: panel açılışta `ben()` çağırır; `sifreDegismeli` ise yalnız `SifreFormu zorunlu` görünür. `PanelUst` giriş yapanın adını ve admin olmayanlar için "Şifremi değiştir" düğmesini gösterir. 403 `sifreDegismeli` alan oyun ekranı `m.hata.sifreDegismeli` metnini ve `/yonetim/` bağlantısını gösterir.
- Metinler `content/yonetim.ts`: `hata.sifreDegismeli`, `hata.adminGerekli`, `hata.sifreKisa`, `hata.sifreUzun`, `hata.sifreAyni`, `hata.adGecersiz`, `hata.adAdminin`, `hata.adKullanimda`, `hata.personelYok`, `hata.adminSifresiSunucuda`, ve `sifre.{baslik, zorunluNot, eski, yeni, yeniTekrar, eslesmiyor, dugme, vazgec}`, `ust.{girisYapan, sifreDegistir}`.

- [ ] **Step 1: Failing tests** in `lib/oyun/api.test.ts`, mevcut sahte `getir` deseniyle: `yonetimApi_sifreDegistir_postVeGovde` (`POST /yonetim/sifre`, gövde `{eski, yeni}`, `Authorization` aynen) ve `yonetimApi_personelKapat_yol` (`POST /yonetim/personel/7/kapat`, gövde `{kapali: true}`). Ekranlar Task 8'de tarayıcıda doğrulanır.
- [ ] **Step 2: Run**, expect FAIL.
- [ ] **Step 3: Implement** client methods, `SifreFormu` (iki yeni alan eşleşmeli, `sifreSorunu` istemcide de), `PanelUst` adı, oyun ekranı mesajı.
- [ ] **Step 4: Run** `npm test`, typecheck, expect PASS.
- [ ] **Step 5: Commit** "Show who is signed in and let staff set their password".

### Task 7: Panel: Kullanıcılar sekmesi ve Geçmiş'te yazar

**Files:**
- Create: `components/yonetim/Kullanicilar.tsx`, `components/yonetim/Kullanicilar.module.css`
- Modify: `lib/menu/panel.ts` (`SEKMELER`'e `kullanicilar`, yalnız adminde gösterilir), `components/yonetim/MenuYonetimi.tsx`, `components/yonetim/Gecmis.tsx`, `content/yonetim.ts`, `lib/menu/panel.test.ts`

**Interfaces:**
- Consumes: Task 6 istemci yöntemleri, `PersonelSatiri`, `IslemSatiri`.
- Produces: `islemMetni(i: IslemSatiri): string` in `lib/yonetim/personel.ts` (Türkçe, `content/yonetim.ts`'teki `kayit.tur` sözlüğünden; ör. `menuYayin` -> "Menüyü yayınladı (sürüm 12)"), `gorunurSekmeler(admin: boolean): readonly Sekme[]` in `lib/menu/panel.ts`.
- Davranış: Kullanıcılar sekmesi hesap listesi (ad, durum: açık/kapalı/şifre bekliyor, son giriş, son işlemler), "Hesap aç" formu (ad, geçici şifre, `adSorunu`/`sifreSorunu` istemcide), satırda "Kapat"/"Aç" ve "Şifre sıfırla" (yeni geçici şifre alanı). Kapatma onay ister (panelin mevcut onay deseni, tarayıcı `confirm` değil). Geçmiş satırı `g.satir` metnine `{yazar}` alır; `yazar` null ise `g.yazarBilinmiyor`.

- [ ] **Step 1: Failing tests**: `lib/yonetim/personel.test.ts` `islemMetni_herTurIcinMetin` (her `IslemTuru` boş olmayan, `{` içermeyen metin); `lib/menu/panel.test.ts` `gorunurSekmeler_adminDegil_kullanicilarYok`.
- [ ] **Step 2: Run**, expect FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4: Run** `npm test`, typecheck, expect PASS.
- [ ] **Step 5: Commit** "Add the admin's Kullanicilar tab and version authors".

### Task 8: Uçtan uca doğrulama, belgeler, kurulum notu

**Files:**
- Modify: `docs/surec/SUNUCU-CANLIYA-ALMA.md` (şema adımı: iki `CREATE TABLE` ve `ALTER`; yayın sırası: önce skor sunucusu, sonra site; personel şifreyi biliyorsa admin şifresini değiştirme adımı), `sunucu/CLAUDE.md` (Staff auth maddesi), `README.md` > Publishing tablosu gerekiyorsa, `docs/surec/DEVAM.md`

- [ ] **Step 1:** Yerelde skor sunucusu (`GIZLI_TUZ=x KOKEN=http://localhost:3000 YONETIM_KULLANICI=bozo YONETIM_SIFRE=... node sunucu/ana.ts`, bellek deposu) ve statik panel (`out/` + `python3 -m http.server`, `NEXT_PUBLIC_OYUN_API=http://localhost:<port>` ile derlenmiş) üzerinde 390px ve masaüstü ekran görüntüsü: admin girişi, hesap açma, yeni hesapla zorunlu şifre ekranı, yayın, Geçmiş'te yazar, kapatınca diğer sekmenin düşmesi, admin olmayanın Kullanıcılar sekmesini görmemesi.
- [ ] **Step 2:** Belgeleri güncelle; `npm test`, typecheck PASS.
- [ ] **Step 3: Commit** "Document per-user panel login rollout".
