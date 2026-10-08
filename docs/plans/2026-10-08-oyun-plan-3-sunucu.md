# Açılış oyunu · Plan 3: skor sunucusu, "önce oyna, sonra kaydet", sıralama

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Oyuna skor sunucusunu (`sunucu/`, spec §10) ve "önce oyna, sonra kaydet" akışını (§7)
eklemek: jeton, `simule` ile yeniden oynatma, haftalık sıralama, Pazartesi 05:00 dönem kapanışı
ve ödül kodları, gece silme, katılım ekranı, sonuçta haftalık sıra, `/oyun/siralama/`.

**Architecture:** Sunucu `node:http` üstünde ince bir katman; tek bağımlılık `mariadb`, kendi
`package.json`'ıyla bir npm workspace. `lib/oyun/`'u doğrudan içe aktarır: iddia edilen skoru
okumaz, her turu `simule(tohum, girdiler)` ile kendisi oynatır (§9). Depo bir arabirimdir
(`sunucu/depo.ts`): `bellekDepo` uç testleri ve yerel koşu, `mariaDepo` üretim; ikisi aynı
sözleşme testini geçer. Tarayıcı ile sunucunun ortak tipleri `lib/oyun/aktarim.ts`'te; tavan,
tohum sınırı ve takma ad kuralları `lib/oyun/` altında saf modüllerdir. Sitede akış
`useOyunAkisi`: tur başında jeton (yoksa çevrimdışı tur), sonuçta katılmış oyuncu kendiliğinden
gönderir, katılmamış olan "Bu Skoru Sıralamaya Yaz" ile katılım ekranına gider.

**Tech Stack:** Node 24 (`node:http`, `node:crypto`, `node:net.BlockList`), TypeScript 5.9
(`rewriteRelativeImportExtensions`, `erasableSyntaxOnly`), `mariadb` 3.5 (hazır ifadeler),
MariaDB 10.11 (pencere fonksiyonu), npm workspaces, Next.js 16 App Router (statik export), React
19.2, `motion` 14 (sıralama satırları), `node --test`, Playwright 1.62 + axe-core 4.13, Docker
(yalnız MariaDB adaptör testi için, isteğe bağlı).

**Spec:** `docs/specs/2026-10-08-oyun-design.md` (§6 puan ve tavan, §7 dönem ve "önce oyna",
§8 oyuncu verisi, §9 hile modeli, §10 mimari, §11 ekranlar, §16 sunucu testleri; §17 adım 4-5).
Plan 2: `docs/plans/2026-10-08-oyun-plan-2-gorsel-dil.md` (bu plan onun "Kapsam dışı > Plan 3"
maddesini uygular). Başlangıç noktası `feat/site-kurulumu` dalı, HEAD `23a25de` (`b1870d1`
kabuk içinde oyun, `OyunAcilisi`, `site` kanalı; `23a25de` yalnız `docs/tasarim/` ekler, kod aynı).

**Ön doğrulama.** Bu plandaki her dosya, plan yazılırken reponun `/tmp/bozo-oyun/plan3/repo`
kopyasında (HEAD `b1870d1`) yazıldı ve doğrulandı: `npm run typecheck` temiz, `tsc -p
sunucu/tsconfig.json --noEmit` temiz, `npm test` 356 test, 348 geçti, 8 atlandı (MariaDB
sözleşme testi, `BOZO_TEST_DB_URL` yokken; plan 2 sonunda 258 idi, 98 yeni), `npm run build` 21
rota (`○ /oyun/siralama`, `○ /en/oyun/siralama` dahil), sitemap ve `llms.txt`'te oyun yok, iki
yeni rota `noindex, nofollow`. **MariaDB adaptörü gerçekten koştu:** Docker'da `mariadb:10.11`
(10.11.19) ile sözleşme testi 8/8. Node 24.12'de sunucu testleri 67 geçti (8 atlandı); `npm run
build -w sunucu` `dist/` üretti ve `node sunucu/dist/sunucu/ana.js` Node 24.12 altında `/tablo`
döndü. Yerel sunucuya karşı betikli tur: jeton → bot kaydı → gönderim → tablo (uç testleri aynı
akışı sahte depoyla 14 testte kapsar). Tarayıcı (Playwright): uçtan uca akış giriş → tur →
"Bu Skoru Sıralamaya Yaz" → katılım (`ab` ve `Bozo` aynı nötr mesajla reddedildi, `Gece Kuşu`
kabul) → "Haftalık sıra: 1" → `/oyun/siralama/` (satır, "Sıran: 1", "Sıfırlanır: 12 Ekim
Pazartesi 05:00") → "Hesabımı Sil" → "Hesap silindi.", anahtar silindi; axe katılım, sonuç ve
sıralama 0 ihlal; 320/390/1440'ta sıralama, giriş, sonuç ve katılım ekranlarında yatay taşma
yok, 44 px altı hedef yok; konsolda yalnız reddedilen takma adın 422 ağ satırı. Sunucu
kapalıyken: Oyna 387 ms'de sahaya geçti, sonuçta "Çevrimdışı tur: sıralamaya girmez.", katılım
düğmesi yok, sayfa hatası 0. `git diff HEAD -- lib/oyun/motor.ts lib/oyun/motor.test.ts
lib/oyun/ocak.ts lib/oyun/sofra.ts lib/oyun/ayar.ts lib/oyun/tipler.ts` boş. Kod blokları o
dosyaların birebir kopyasıdır.

## Yayın engeli (bu plan yayına çıkamaz)

Gizlilik sayfası (`content/tr/gizlilik.ts` > `saklamaMetni`, EN karşılığı) hâlâ "Site kendi
sunucusunda ziyaretçi verisi saklamaz" diyor. Bu sunucu tam olarak bunu yapar: takma ad,
tarayıcı anahtarının özeti, onay zamanı, turlar (dokunuş kaydı dahil). Sunucu İstanbul'dadır ve
her kaydı KKTC 89/2007 Md. 11 anlamında yurt dışına aktarımdır (spec §8). **Sunucu, plan 4'ün
gizlilik metni değişikliği ve sahibinin/hukukçunun onayı olmadan canlıya alınamaz;** bu plan
yalnız yerelde çalışır, alt alan adı, DNS, Plesk Node.js uygulaması ve veritabanı plan 4'tedir.
Siteyi bu daldan deploy etmek `/oyun`'u sunucusuz (her tur çevrimdışı) yayına alır; ayrı onay.

## Global Constraints

- **Simülasyon değişmez.** `lib/oyun/` içinde `rastgele`, `ayar`, `tipler`, `gece`, `durum`,
  `puan`, `sofra`, `ocak`, `motor`, `deneme`, `canli`, `zamanlayici`, `gosterim`, `gorsel`,
  `klavye`, `duyuru`, `ses` dosyalarına ve `motor.test.ts`'in altın kayıtlarına dokunulmaz;
  `git diff HEAD -- lib/oyun/motor.ts lib/oyun/motor.test.ts lib/oyun/ocak.ts lib/oyun/sofra.ts
  lib/oyun/ayar.ts lib/oyun/tipler.ts` plan sonunda boş çıkar. Yeni `lib/oyun` dosyaları saf ve
  simülasyona dönmeyen modüllerdir: `tohum`, `tavan` (yalnız `geceKur`, `komboCarpani` ve
  `ayar` sabitlerini okur), `takmaAd`, `aktarim`, `api`, `tarih`; `defter.ts` tarayıcı deposu.
- **Sunucu iddia edilen skoru okumaz** (spec §9): `/tur/:id/bitir` gövdesindeki `puan` gibi
  alanlar yok sayılır; puan `simule`den gelir, tavanı aşan tur reddedilir. Jeton 15 dakika ve tek
  kullanımlık; **ret yemeden önce yakılır**, böylece "çok hızlı" reddi yiyen kayıt bekleyip
  yeniden gönderilemez. Duvar saati ≥ simülasyon süresi − 2 sn; hedef başına tikte en çok bir
  dokunuş; ≤ 1.200 dokunuş; gövde ≤ 64 KB (aşan bağlantı 413 ile kapanır).
- **Hız sınırı yalnız bellekte**, uygulama IP yazmaz (spec §8): oyuncu 40 tur/saat, IP 600
  istek/saat, yönetim uçlarına IP başına 60/saat. Gerçek IP `CF-Connecting-IP`'den yalnız eş
  Cloudflare aralığındayken; Plesk'in yerel vekili (`GUVENILIR_VEKIL`) `X-Forwarded-For`'un son
  adımını eş sayar. Günlüğe IP, takma ad ya da anahtar yazılmaz.
- **CORS yalnız `KOKEN`** (varsayılan `https://cigercibozo.com`; yerelde `http://localhost:3000`
  ya da `http://localhost:8398`). Gizli değerler ortam değişkenlerinden (`GIZLI_TUZ` zorunlu).
  Hazır ifadeli sorgular (`pool.execute`). Tarayıcı anahtarı 128 bit; sunucu SHA-256 özetini,
  ödül kodu için HMAC özetini tutar. Tohum her girişte uint32 denetlenir (`tohumGecerliMi`):
  sunucu kendi üretir, tarayıcı jeton yanıtını doğrular, sınır dışı tohum çevrimdışı tura düşer.
- **Saat dilimi tek yerden:** Pazartesi 05:00 Girne sınırı `sunucu/donem.ts`'te `lib/saat.ts`'in
  `girneParcalari`, `KAPANIS_SAATI` ve `ZAMAN_DILIMI`'siyle hesaplanır; ikinci bir dilim kodu
  yazılmaz. Veritabanında zamanlar epoch milisaniye (`BIGINT`), dilim yorumu yalnız sunucuda.
- **Bağımlılık:** site tarafında yeni paket yok; `sunucu/package.json` yalnız `mariadb`. Kök
  `package.json`'a `"workspaces": ["sunucu"]` girer (sitenin `dependencies` listesi değişmez),
  `package-lock.json` buna göre güncellenir. Test çerçevesi yalnız `node:test`; MariaDB
  sözleşme testi `BOZO_TEST_DB_URL` yokken atlanır, bare `npm test` hermetik kalır.
- Derleme: `sunucu/tsconfig.json` (`module: nodenext`, `rewriteRelativeImportExtensions`,
  `erasableSyntaxOnly`, `rootDir: ..`, `outDir: dist`) `.ts` içe aktarmalarını `.js`'e çevirir;
  `lib/oyun` ve `lib/saat` geçişli olarak derlenir. Kök `tsconfig.json` değişmez: `**/*.ts`
  `sunucu/`yu da kapsar, `noUnusedLocals` orada da bağlayıcıdır. Yerelde `node sunucu/ana.ts`
  (Node tip silme) yeter. `sunucu/dist/` `.gitignore`'da.
- Metin yalnız `content/` altında; yeni oyun metinleri **TASLAK** (spec §19 karar 4), em dash
  yok, terimler sofra/ikram/usta/tane/şiş/ocak. CTA'lar title case (`Kaydet ve Katıl`,
  `Bu Skoru Sıralamaya Yaz`, `Hesabımı Sil`), başlıklar sentence case (`Sıralamaya katıl`).
  Katılım cümlesi §8'in istediği tek cümledir, pazarlama metni değildir. Reddedilen takma ad
  tek nötr mesajla döner; sunucu da tek kodla (`takmaAdKullanilamaz`) reddeder.
- Renk yalnız token, **yeni token yok**, `styles/` değişmez. Köşe 0-3 px. Rakamlar Bevan 400
  `tabular-nums`, etiketler Archivo; 16 px tabanı okunan metinde (giriş alanı 16 px). Her hedef
  ≥ 44 px (satır içi bağlantı değil, kendi satırında bağlantı). Keyframe kullanılmadı; sıralama
  satırları Motion ile, `MotionConfig reducedMotion="user"` altında; `motion` yalnız
  `components/oyun/` altından içe aktarılır.
- Fonksiyon en çok 50 satır, dosya 700, satır 120 karakter. Yorumlar kısa.
- `/oyun/siralama/` prototiptir: `noindex, nofollow`; `siralama` bir `SayfaAnahtari`'dır
  (`RotaAnahtari` değil), sitemap, `llms.txt` ve breadcrumb'a girmez, nav ve çekmecede yok.
- Testler `/tmp/bozo-oyun/plan3/` altındaki Playwright betikleriyle, **repoya girmez**. `out/`
  `python3 -m http.server 8398 --directory <mutlak out yolu>` ile sunulur (8391 sahibinin
  portu), sunucu 8402'de. Betikler sırayla koşar.
- Deploy yok, SSH yok, Plesk yok, DNS yok, push yok.
- Commit: İngilizce, emir kipi, ilk satır < 72 karakter. **`Co-Authored-By`, `Claude-Session` ya
  da benzeri imza satırı yok** (CLAUDE.md, sahibinin 12 Ağustos kararı; harness varsayılanını ezer).

## Review Focus

1. **Ret yiyen kayıt bekleyip yeniden gönderilir** (bot önce anında gönderir, 422 alınca iki
   dakika bekler): jeton ilk denemede yanmıştır, ikinci deneme 409 `jetonKullanildi`. Test:
   Task 3 `bitir_cokHizli_422_jetonYanar_beklesenDeGonderemez`.
2. **Yaz saati geçişi haftanın ortasına düşer** (25 Ekim 2026, 28 Mart 2027): dönem 7 gün ± 1
   saat sürer, sınır yine Pazartesi 05:00 Girne'dir, anahtar Pazartesi'nin tarihidir. Test:
   Task 2 `donem_yazSaatiBitenHafta_yediGunArtiBirSaat`, `donem_yazSaatiBaslayanHafta_yediGunEksiBirSaat`.
3. **Anahtarı tarayıcıda kalan ama sunucuda silinmiş oyuncu** (90 gün sessizlik, ya da başka
   cihazdan "Hesabımı sil"): sunucu 401 `oyuncuYok` döner, tarayıcı anahtarı siler ve turu
   "katılmamış" olarak gösterir; tur kaybolmaz, "Bu Skoru Sıralamaya Yaz" yeniden çıkar. Test:
   Task 3 `bitir_anahtarsiz401_bilinmeyenOyuncu401`, Task 2 `oyuncu_eskiOyunculariSil_sonTuraYoksaKayitZamaninaGore`;
   tarayıcı tarafı `useOyunAkisi` > `turuGonder` ('hesapYok') ve `useSiralama` (401 → `hesapSil`),
   uçtan uca `akis.mjs` silme adımı (anahtar null).
4. **Sınırların tam ucu:** 1.200 dokunuş geçer, 1.201 `cokDokunus`; aynı tikte aynı hedefe iki
   dokunuş `ayniTikteAyniHedef`; 65 KB gövde 413 ve bağlantı kapanır (tarayıcı yanıtı okur, soket
   asılı kalmaz). Test: Task 2 `girdileriCoz_binIkiYuzDokunus_sinirdaGecer`, Task 3
   `bitir_cokDokunus_ayniTikteAyniHedef_govdeBuyuk_tavan`.
5. **Sunucu kapalı ya da yavaş:** jeton isteği 4 sn'de düşer, tur yerel tohumla çevrimdışı
   oynanır, sonuçta "Çevrimdışı tur" yazar ve katılım düğmesi çıkmaz; giriş tablosu sessizce
   boş kalır. Test: Task 1 `api_agHatasi_durumSifirKodAg`, Task 6 `cevrimdisi.mjs`.

Ayrıca kod özeti çakışması (milyonda bir, iki dönemde aynı 6 hane): deneme sayacı artar ve
`/ben` aynı sayaçla türetir, Task 3 `donemleriKapat_kodOzetiCakisirsa_denemeSayaciArtar`.

## Dosya haritası

| Dosya | Sorumluluk | Görev |
|---|---|---|
| `lib/oyun/tohum.ts` | Tohum uint32 sınırı, rastgele tohum (tarayıcı ve Node) | 1 |
| `lib/oyun/tavan.ts` | Tohumun üst sınırı (spec §6), gevşek ama kanıtlanabilir | 1 |
| `lib/oyun/takmaAd.ts` | Takma ad biçimi, düzeltme, katlama (tarayıcı ve sunucu ortak) | 1 |
| `lib/oyun/aktarim.ts` | Tarayıcı-sunucu sözleşmesi: tipler, sınırlar, kanal, onay sürümü | 1 |
| `lib/oyun/api.ts` | Tarayıcı istemcisi: kök adres, 4 sn zaman aşımı, kanal çözümü, jeton doğrulama | 1 |
| `lib/oyun/tarih.ts` | Sıfırlanma ve ödül tarihlerinin Girne saatiyle metni | 1 |
| `lib/metin.ts` (değişir) | `doldur`: sözlükteki `{ad}` yer tutucuları | 1 |
| `package.json`, `.gitignore`, `sunucu/package.json`, `sunucu/tsconfig.json` | Workspace, tek bağımlılık, derleme | 2 |
| `sunucu/depo.ts` | Depo arabirimi ve kayıt tipleri | 2 |
| `sunucu/bellekDepo.ts` | Bellekte depo (test, yerel) | 2 |
| `sunucu/siralama.ts` | §6 beraberlik sırası, oyuncu başına en iyi, sıra ve fark, açık tablo | 2 |
| `sunucu/donem.ts` | Pazartesi 05:00 Girne dönem sınırı, anahtar, Girne günü | 2 |
| `sunucu/hiz.ts`, `ip.ts`, `kod.ts`, `suphe.ts`, `yasakli.ts` | Hız sınırı; Cloudflare ve vekil; özetler ve ödül kodu; şüphe işareti; ayrılmış ad ve küfür listesi | 2 |
| `sunucu/http.ts`, `dogrulama.ts` | Gövde sınırı, JSON, CORS, kimlik başlıkları; istek gövdesi denetimi | 2 |
| `sunucu/depoSozlesmesi.ts` | İki deponun ortak testi | 2 |
| `sunucu/isler.ts` | Dönem kapanışı ve kodlar, gece silme, dakikalık tik | 3 |
| `sunucu/uclar.ts`, `yonetim.ts`, `uygulama.ts`, `ana.ts` | Herkese açık uçlar, yönetim uçları, yönlendirme ve hız sınırı, giriş noktası ve ortam | 3 |
| `sunucu/sema.sql`, `mariaDepo.ts` | MariaDB 10.11 şeması ve deposu | 4 |
| `content/{tr,en}/oyun.ts` (değişir) | Sıralama, katılım, gönderim, hesap, ödül metinleri (TASLAK) | 5 |
| `lib/oyun/defter.ts` (değişir) | Tarayıcı anahtarı ve takma ad | 5 |
| `lib/site.ts`, `lib/kabuk.ts`, `components/sayfa/Kabuk.tsx` (değişir) | `siralama` sayfa anahtarı, `dizindeMi` | 5 |
| `components/oyun/Saha.tsx`, `useOyunAlani.ts`, `useOyunDongusu.ts` (değişir) | `bitince(sonuc, kayit)`: dokunuş kaydı sonuçla birlikte döner | 5 |
| `components/oyun/OyunAcilisi.tsx` + `.module.css` (değişir) | `altinda` yuvası: düğmenin altındaki tablo | 5 |
| `components/oyun/GirisTablosu.tsx`, `GirisEkrani.tsx` (+ css) | Haftanın ilk üçü, son şampiyon, Sıralama ve Gizlilik bağlantıları; giriş paneli | 5 |
| `components/oyun/KatilimEkrani.tsx` + `.module.css` | Katılım ekranı (spec §8) | 5 |
| `components/oyun/useOyunAkisi.ts` | Ekran akışı: jeton, çevrimdışı, gönderim, katılım | 5 |
| `components/oyun/SonucGonderim.tsx`, `SonucEkrani.tsx` + css (değişir) | Haftalık sıra satırı, gönderim durumu, "Bu Skoru Sıralamaya Yaz" | 5 |
| `components/oyun/OyunSayfasi.tsx` + `.module.css` (değişir) | Dört ekran, `panel` sarmalı | 5 |
| `components/oyun/useSiralama.ts`, `SiralamaSayfasi.tsx` + `.module.css` | Sıralama sayfası: ilk 10, sıra ve fark, son şampiyon, sıfırlanma, ödül kodu, hesabı sil | 6 |
| `app/(tr)/oyun/siralama/page.tsx`, `app/(en)/en/oyun/siralama/page.tsx` | Rotalar, noindex, kabuk içinde | 6 |
| `CLAUDE.md`, `README.md`, `docs/surec/DEVAM.md` (değişir) | Belgeler | 7 |

## Spec §19'a bağlı kararlar

Plan bunları **kararlaştırmaz**; sahibi karar verince değişecek yer yanında:

- **3, kampanya süresi.** Şampiyon kayıtlarının 90 gün sonra silineceği kampanya bitişi
  `KAMPANYA_BITIS` ortam değişkeniyle verilir; tanımlı değilken silinmez (`isler.ts`).
- **4, oyun metinleri.** Yeni anahtarlar TASLAK: `siralamayaYaz`, `siralama.*`, `katilim.*`
  (onay cümlesi `katilim.aciklama`, Md. 11(2)(A)), `gonderim.*`, `hesap.*`, `odul.*`
  (`content/tr/oyun.ts`). Onay cümlesi değişince `ONAY_SURUMU` (`lib/oyun/aktarim.ts`) artar;
  sunucu oyuncuda sürümü tutar (§8).
- **9, kod onayını kim yapar.** Yönetim uçları temel kimlikle (`YONETIM_KULLANICI`,
  `YONETIM_SIFRE`); kimin elinde olacağı sahibine. Yönetim **arayüz sayfası** (kod girme, tur
  izleyici, ad gizleme düğmeleri) bu planda yok, yalnız API; sayfa plan 4'te (tur izleyici
  oynatıcı tek başına bir ekran işi).

## Spec ile çözülen çelişkiler ve plan kararları

- **Tavan gevşek** (§6): her fişe tam kıvam ve tam sabır, en büyük fişler en yüksek çarpanlara,
  her fişe son saat ×2, bütün rozetler, gece tamam. Tohum 1'de 90.060; usta botu 40.470 alır.
  Son saatte hangi fişlerin ödeneceği sıkı biçimde sınırlanamıyor: tükenmez ilk misafir bir
  sofrayı sonsuza kadar tutabilir, iki kalkan sofra bedeliyle kuyruk bekletilebilir, yani erken
  bir misafir de 05:00'ten sonra ödeyebilir. Sınır bu yüzden kanıtlanabilir olanı seçer; asıl
  savunma yeniden oynatmadır. Kalemlerin fişlere dağılımı tohuma bağlı olduğu için tavan tohumdan
  tohuma az oynar (`tavan_tohumaGoreAzOynar_doksanBinCivari`).
- **Jeton tıklamada alınır, ön yükleme yok** (§7 "her tur başında"): giriş ekranında önceden
  jeton almak kanal sayacını (§1 taban ölçütü) oynamayan ziyaretçiyle şişirirdi. Bedel: Oyna ile
  saha arasında bir istek; yerelde 387 ms ölçüldü, 4 sn'de düşer ve çevrimdışı tura geçer.
- **Jeton ret öncesi yakılır** (§9 duvar saati): yanıtı kaybolan dürüst gönderim 409 alır,
  tarayıcı sırayı `/ben`'den okur (`turuGonder`).
- **Takma ad benzersizdir** (§8'de yazmıyor): katlanmış hal üstünden (`B0zo Usta` = `Bozo Usta`),
  "Bozo Usta"yı taklit eden ikinci bir ad tabloya giremez; ret aynı nötr mesajla.
- **Ödül kodu türetilir, özeti saklanır** (§7, §8): kod `HMAC(GIZLI_TUZ, dönem, oyuncu, deneme)`
  ile 6 haneye indirilir, veritabanında yalnız `HMAC(GIZLI_TUZ, kod)` özeti durur; `/ben` kodu
  aynı türetmeyle her açılışta gösterir (kazanan ekranı kaçırmaz, "ekran görüntüsünü al" yine
  yazar). Veritabanı tek başına kodu vermez; tuz kaybolursa kodlar da gider, yedeklenmeli.
- **"Haftanın ilk 20'si"** (§8 saklama) oyuncuların en iyi turlarıdır, tur listesi değil: ilk 3'ün
  izleyici verisi iki oyuncunun 20 turu arasında kaybolmaz. Kırpma gönderimde ve gece.
- **Zamanlar epoch ms `BIGINT`:** sunucu ile veritabanının dilim ayarı birbirinden bağımsız kalır;
  Girne yorumu yalnız `donem.ts`'te.
- **`/tablo` 15-30 sn önbellek** (§10): sunucuda 20 sn bellek önbelleği ve `Cache-Control:
  public, max-age=20`; gönderim, silme ve gizleme sunucu önbelleğini boşaltır ama tarayıcı kendi
  kopyasını 20 sn tutar (ölçüldü: silinen hesabın adı giriş tablosunda 20 sn daha göründü).
- **Dört kanal:** `sofra`, `ig`, `site` (ana sayfa Gece bandı, `?k=site`), `yok`; şema `ENUM`'u
  ve `KANALLAR` buna göre. Sayaç `POST /tur`'da artar, günlük ve kimliksiz.
- **Kurallar bağlantısı giriş ekranında yok:** sayfa plan 4'te; Gizlilik bağlantısı var.
- **Negatif puanlar tabloya girer:** spec sessiz; `-250` ilk sırada görünebilir. Sahibine soru.
- **Plesk vekili:** Node'un önündeki yerel vekil `GUVENILIR_VEKIL` ile tanımlanır; `X-Forwarded-For`'un
  o vekilin eklediği son adımı eş adres sayılır, Cloudflare denetimi ona uygulanır. Bu olmadan eş
  hep 127.0.0.1 olur ve `CF-Connecting-IP` hiç okunmazdı.
- **`siralama` sayfa anahtarı:** `DilAnahtari` `yol(aktif, dil)` ile dil değiştirir; `oyun` anahtarı
  sıralama sayfasında dil geçişini `/en/oyun/`'a atardı. `dizindeMi` sitemap, `llms.txt` ve
  breadcrumb dışlamasını tek yerde toplar.
- **Katılım ekranı dikey ortalanmaz:** ortalanan formun "Vazgeç"i 844 px'lik telefonda mobil
  eylem barının altına düşüyordu; form üstten başlar.

## Ertelenen inceleme maddeleri (plan 2 sonrası), bu planda nerede kapanıyor

- `OyunSayfasi` 51 satırlık fonksiyon: Task 5, ekran akışı `useOyunAkisi.ts`'e, giriş paneli
  `GirisEkrani.tsx`'e, sarmal `panel()` yardımcısına; `OyunSayfasi` 43 satır.
- Tohum sınırı: Task 1 `lib/oyun/tohum.ts`; `OyunSayfasi`'ndaki `yeniTohum` kalkar.
- Fikstür ayarı ve kaba prototip testinden gelen evre ayarları: bu planda yok, test sahada
  yapılmadı; `ayar.ts` değişmedi.

---

### Task 1: Paylaşılan modüller: tohum sınırı, tavan, takma ad, sözleşme, istemci, tarih

**Files:**
- Create: `lib/oyun/tohum.ts`, `lib/oyun/tavan.ts`, `lib/oyun/takmaAd.ts`, `lib/oyun/aktarim.ts`,
  `lib/oyun/api.ts`, `lib/oyun/tarih.ts`
- Modify: `lib/metin.ts`
- Test: `lib/oyun/tohum.test.ts`, `lib/oyun/tavan.test.ts`, `lib/oyun/takmaAd.test.ts`,
  `lib/oyun/api.test.ts`, `lib/oyun/tarih.test.ts`, `lib/metin.test.ts`

**Interfaces:**
- Consumes: `geceKur` (`gece.ts`), `komboCarpani` (`puan.ts`), `PUAN`, `PORSIYON_SIS` (`ayar.ts`),
  `Girdi`, `Ozet`, `Bitis` (`tipler.ts`), `ZAMAN_DILIMI` (`lib/saat.ts`); testlerde `ustaOyna`,
  `simule`.
- Produces:
  - `tohum.ts`: `TOHUM_USTU`, `tohumGecerliMi(deger: unknown): deger is number`, `rastgeleTohum(): number`.
  - `tavan.ts`: `tavan(tohum: number): number`.
  - `takmaAd.ts`: `TAKMA_AD_EN_AZ = 3`, `TAKMA_AD_EN_COK = 12`, `takmaAdDuzelt(ad): string`,
    `takmaAdBicimiGecerliMi(ad): boolean`, `takmaAdKatla(ad): string`.
  - `aktarim.ts`: `Kanal`, `KANALLAR`, `JETON_SURESI_MS`, `EN_COK_DOKUNUS`, `GOVDE_SINIRI`,
    `SURE_PAYI_MS`, `ANAHTAR_HEX`, `ONAY_SURUMU` ve yanıt/istek tipleri (`JetonYaniti`,
    `OyuncuIstegi`, `BitirYaniti`, `SiraBilgisi`, `TabloYaniti`, `TabloSatiri`, `Sampiyon`,
    `BenYaniti`, `Odul`, `HataYaniti`).
  - `api.ts`: `API_KOKU`, `ZAMAN_ASIMI_MS`, `ApiHatasi { durum, kod }`, `kanalCoz(arama)`,
    `jetonCoz(yanit)`, `apiKur(kok, getir)`, `api` (`turAl`, `oyuncuOl`, `turBitir`, `tabloAl`,
    `benAl`, `hesabiSil`), `Api`.
  - `tarih.ts`: `sifirlanmaMetni(iso, dil)`, `tarihMetni(iso, dil)`.
  - `metin.ts`: `doldur(metin, degerler)`.

- [ ] **Step 1: Tohum sınırı ve testi**

`lib/oyun/tohum.ts`:

```ts
/** Tohum 32 bitlik işaretsiz tamsayı (`rastgele.ts`); sınır dışı değer `| 0` ile başka tohuma katlanırdı. */
export const TOHUM_USTU = 0xffffffff

export function tohumGecerliMi(deger: unknown): deger is number {
  return typeof deger === 'number' && Number.isInteger(deger) && deger >= 0 && deger <= TOHUM_USTU
}

/** Tarayıcıda ve Node'da aynı kaynak: `globalThis.crypto`. Çevrimdışı turun ve sunucunun tohumu buradan. */
export function rastgeleTohum(): number {
  const dizi = new Uint32Array(1)
  globalThis.crypto.getRandomValues(dizi)
  return dizi[0] ?? 1
}
```

`lib/oyun/tohum.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { rastgeleTohum, TOHUM_USTU, tohumGecerliMi } from './tohum.ts'

test('tohumGecerliMi_sifirIleUint32Arasi_gecerli', () => {
  assert.equal(tohumGecerliMi(0), true)
  assert.equal(tohumGecerliMi(2026), true)
  assert.equal(tohumGecerliMi(TOHUM_USTU), true)
})

test('tohumGecerliMi_negatifKesirliBuyukYaDaSayiDegil_gecersiz', () => {
  assert.equal(tohumGecerliMi(-1), false)
  assert.equal(tohumGecerliMi(1.5), false)
  assert.equal(tohumGecerliMi(TOHUM_USTU + 1), false)
  assert.equal(tohumGecerliMi('7'), false)
  assert.equal(tohumGecerliMi(null), false)
  assert.equal(tohumGecerliMi(Number.NaN), false)
})

test('rastgeleTohum_herZamanGecerliAralikta', () => {
  for (let i = 0; i < 100; i++) assert.ok(tohumGecerliMi(rastgeleTohum()))
})
```

- [ ] **Step 2: Tavan ve testi**

Tavan gevşektir ve öyle kalır (bkz. "Spec ile çözülen çelişkiler"). Altın değer 90.060; `ayar.ts`
ya da puan tablosu değişince bilerek kırılır.

`lib/oyun/tavan.ts`:

```ts
import { PORSIYON_SIS, PUAN } from './ayar.ts'
import { geceKur } from './gece.ts'
import { komboCarpani } from './puan.ts'
import type { Urun } from './tipler.ts'

function fisTabani(fis: readonly Urun[]): number {
  return fis.reduce<number>((t, u) => t + (u === 'ayran' ? PUAN.ayran : PUAN.tamKivam), PUAN.sabirBonusu)
}

/**
 * Tohumun üst sınırı (spec §6): her kalem tam kıvam, tam sabır, en büyük fişler en yüksek
 * çarpanlarda, her fiş son saat çarpanıyla, bütün rozetler, gece tamam. Gevşektir ama
 * kanıtlanabilir: sayaç ancak ödemeyle artar, ceza hep negatiftir. Sunucu bunun üstünü reddeder.
 */
export function tavan(tohum: number): number {
  const misafirler = geceKur(tohum)
  const tabanlar = misafirler.map((m) => fisTabani(m.fis)).sort((a, b) => a - b)
  const odemeler = tabanlar.reduce((t, taban, k) => t + taban * komboCarpani(k) * 2, 0)
  const sis = misafirler.reduce((t, m) => t + m.fis.filter((u) => u !== 'ayran').length, 0)
  return odemeler + Math.floor(sis / PORSIYON_SIS) * PUAN.porsiyon + PUAN.geceTamam
}
```

`lib/oyun/tavan.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ustaOyna } from './deneme.ts'
import { simule } from './motor.ts'
import { tavan } from './tavan.ts'

test('tavan_hicbirAltinKaydinAltindaKalmaz', () => {
  assert.ok(tavan(1) >= 40470)
  assert.ok(tavan(2026) >= 10001)
})

test('tavan_kirkTohumdaUstaVeAcemiSkorununUstunde', () => {
  for (let t = 1; t <= 40; t++) {
    const sinir = tavan(t)
    assert.ok(simule(t, ustaOyna(t, 'usta')).puan <= sinir, `tohum ${t}: usta tavanı aştı`)
    assert.ok(simule(t, ustaOyna(t, 'acemi')).puan <= sinir, `tohum ${t}: acemi tavanı aştı`)
  }
})

test('tavan_ayniTohum_ayniDeger_veTamsayi', () => {
  assert.equal(tavan(1), tavan(1))
  assert.ok(Number.isInteger(tavan(1)))
})

/* Altın değer: bütçe ya da puan tablosu değişince bilerek kırılır. Usta 40470 alır; sınır gevşek. */
test('altin_tavan_tohum1', () => {
  assert.equal(tavan(1), 90060)
})

/** Bütçe sabit ama kalemlerin fişlere dağılımı tohuma bağlı: tavan tohumdan tohuma az oynar. */
test('tavan_tohumaGoreAzOynar_doksanBinCivari', () => {
  for (let t = 2; t <= 40; t++) assert.ok(Math.abs(tavan(t) - 90000) < 1500, `tohum ${t}: ${tavan(t)}`)
})
```

- [ ] **Step 3: Takma ad biçimi ve katlama**

Biçim denetimi tarayıcıda da koşar (katılım ekranı sunucuya gitmeden reddeder); yasaklı liste
yalnız sunucudadır (Task 2 `yasakli.ts`), tarayıcı paketine küfür listesi girmez.

`lib/oyun/takmaAd.ts`:

```ts
/*
 * Takma ad kuralları (spec §8): 3-12 karakter; harf (Türkçe dahil), rakam, boşluk, nokta,
 * alt çizgi, tire. Biçim denetimi tarayıcıda ve sunucuda aynı; yasaklı liste yalnız sunucuda.
 */
export const TAKMA_AD_EN_AZ = 3
export const TAKMA_AD_EN_COK = 12

const BICIM = /^[\p{L}0-9 ._-]+$/u

/** Uçlardaki boşluk atılır, ardışık boşluklar teke iner; sözlük metni budur, sunucuya bu gider. */
export function takmaAdDuzelt(ad: string): string {
  return ad.trim().replace(/\s+/g, ' ')
}

export function takmaAdBicimiGecerliMi(ad: string): boolean {
  if (ad !== takmaAdDuzelt(ad)) return false
  const uzunluk = [...ad].length
  return uzunluk >= TAKMA_AD_EN_AZ && uzunluk <= TAKMA_AD_EN_COK && BICIM.test(ad)
}

const HARF: Record<string, string> = {
  ı: 'i', ş: 's', ç: 'c', ğ: 'g', ö: 'o', ü: 'u', â: 'a', î: 'i', û: 'u',
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't',
}

/**
 * Katlama: Türkçe küçük harf, aksan ve rakam benzerleri düz harfe, ayraçlar atılır, tekrar
 * harf teke iner ("B0z0  Usta" → "bozousta"). Yasaklı liste ve ad benzersizliği bunun üstünden.
 */
export function takmaAdKatla(ad: string): string {
  const harfler = [...ad.toLocaleLowerCase('tr')].map((h) => HARF[h] ?? h).join('')
  return harfler.replace(/[^a-z]/g, '').replace(/(.)\1+/g, '$1')
}
```

`lib/oyun/takmaAd.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { takmaAdBicimiGecerliMi, takmaAdDuzelt, takmaAdKatla } from './takmaAd.ts'

test('takmaAdDuzelt_uclardakiVeArdisikBosluk_teke', () => {
  assert.equal(takmaAdDuzelt('  Bozo   Usta '), 'Bozo Usta')
})

test('takmaAdBicimi_turkceHarfRakamBoslukNoktaAltCizgiTire_gecerli', () => {
  for (const ad of ['Ayşe', 'Şişçi_01', 'Gece.Kuşu', 'Tane-12', 'Ali Veli', 'İpek']) {
    assert.equal(takmaAdBicimiGecerliMi(ad), true, ad)
  }
})

test('takmaAdBicimi_kisaUzunEmojiVeBaskaIsaret_gecersiz', () => {
  for (const ad of ['Al', 'OnUcKarakterli', 'Bozo🔥', 'a@b', 'ad!', ' Ali', 'Ali  Veli', '']) {
    assert.equal(takmaAdBicimiGecerliMi(ad), false, JSON.stringify(ad))
  }
})

test('takmaAdBicimi_onIkiKarakterTurkceHarfle_gecerli', () => {
  assert.equal(takmaAdBicimiGecerliMi('Şşşşşşşşşşşş'), true)
})

test('takmaAdKatla_turkceHarfRakamBenzeriAyracVeTekrar_katlanir', () => {
  assert.equal(takmaAdKatla('B0z0  Usta'), 'bozousta')
  assert.equal(takmaAdKatla('Bozoo-Ustaa'), 'bozousta')
  assert.equal(takmaAdKatla('Şişçi_01'), 'siscioi')
  assert.equal(takmaAdKatla('İIıi'), 'i')
  assert.equal(takmaAdKatla('G3ce-Kuşu'), 'gecekusu')
  assert.equal(takmaAdKatla('...'), '')
})
```

- [ ] **Step 4: Sözleşme**

`lib/oyun/aktarim.ts`:

```ts
import type { Bitis, Girdi, Ozet } from './tipler.ts'

/*
 * Tarayıcı ile skor sunucusunun ortak sözleşmesi (spec §10 uç tablosu, §9 sınırlar). Tipler ve
 * sabitler burada; iki taraf da buradan okur, ikinci bir tanım yok.
 */

/** Giriş kanalı: sofradaki QR, Instagram, ana sayfadaki Gece bandı, doğrudan. */
export type Kanal = 'sofra' | 'ig' | 'site' | 'yok'
export const KANALLAR: readonly Kanal[] = ['sofra', 'ig', 'site', 'yok']

/** Jeton 15 dakika; gönderim en çok 1.200 dokunuş, gövde 64 KB; duvar saati payı 2 sn. */
export const JETON_SURESI_MS = 15 * 60_000
export const EN_COK_DOKUNUS = 1200
export const GOVDE_SINIRI = 64 * 1024
export const SURE_PAYI_MS = 2000
/** Tarayıcı anahtarı 128 bit, hex 32 karakter; sunucu yalnız özetini tutar. */
export const ANAHTAR_HEX = 32
/** Katılım ekranındaki onay cümlesinin sürümü; metin değişince artar, sunucu oyuncuda tutar. */
export const ONAY_SURUMU = 'taslak-2026-10-08'

export type JetonYaniti = { turId: string; tohum: number; sonaErme: string }
export type OyuncuIstegi = { takmaAd: string; anahtar: string; onaySurumu: string }
export type OyuncuYaniti = { takmaAd: string }
export type BitirIstegi = { girdiler: Girdi[] }
export type SiraBilgisi = { puan: number; sira: number; ustekiFark: number | null }
export type BitirYaniti = {
  puan: number
  ozet: Ozet
  bitti: Bitis
  tik: number
  hafta: SiraBilgisi
  /** Bu tur oyuncunun haftalık en iyisi mi; değilse sonuç ekranı en iyiyi de yazar. */
  buTurEnIyi: boolean
}
export type TabloSatiri = { sira: number; takmaAd: string | null; puan: number; tamKivam: number }
export type Sampiyon = { takmaAd: string | null; puan: number; donem: string }
export type TabloYaniti = {
  donem: string
  bitis: string
  hafta: TabloSatiri[]
  tumZamanlar: TabloSatiri[]
  sonSampiyon: Sampiyon | null
}
export type Odul = { kod: string; sira: number; donem: string; gecerlilik: string; kullanildi: boolean }
export type BenYaniti = { takmaAd: string; hafta: SiraBilgisi | null; odul: Odul | null }
export type HataYaniti = { hata: string }
```

- [ ] **Step 5: Tarayıcı istemcisi ve testi**

`process.env.NEXT_PUBLIC_OYUN_API` derleme zamanında gömülür; testler `apiKur`'a sahte `fetch`
verir. `AbortSignal.timeout` Node 22.18 ve tarayıcılarda var.

`lib/oyun/api.ts`:

```ts
import {
  KANALLAR,
  type BenYaniti,
  type BitirYaniti,
  type JetonYaniti,
  type Kanal,
  type OyuncuYaniti,
  type TabloYaniti,
} from './aktarim.ts'
import { tohumGecerliMi } from './tohum.ts'
import type { Girdi } from './tipler.ts'

/*
 * Skor sunucusunun tarayıcı istemcisi (spec §7, §10). Kök adres derleme zamanında gömülür;
 * yerel geliştirmede `NEXT_PUBLIC_OYUN_API=http://127.0.0.1:8402`. Her istek 4 sn'de düşer:
 * sunucuya ulaşılamazsa tur çevrimdışı oynanır, oyun beklemez.
 */
export const API_KOKU = (process.env.NEXT_PUBLIC_OYUN_API ?? 'https://api.cigercibozo.com').replace(/\/$/, '')
export const ZAMAN_ASIMI_MS = 4000

/** `durum` 0: ağ ya da zaman aşımı; `kod` sunucunun `{ hata }` alanı, yoksa 'ag'. */
export class ApiHatasi extends Error {
  durum: number
  kod: string
  constructor(durum: number, kod: string) {
    super(`${durum} ${kod}`)
    this.durum = durum
    this.kod = kod
  }
}

/** QR `/oyun/?k=sofra`, Instagram `/oyun/?k=ig`, ana sayfa bandı `/oyun/?k=site`; başka her şey 'yok'. */
export function kanalCoz(arama: string): Kanal {
  const k = new URLSearchParams(arama).get('k')
  return KANALLAR.find((kanal) => kanal === k) ?? 'yok'
}

/** Jeton yanıtı tarayıcıya girmeden doğrulanır: tohum uint32 değilse yanıt yok sayılır. */
export function jetonCoz(yanit: unknown): JetonYaniti | null {
  if (typeof yanit !== 'object' || yanit === null) return null
  const { turId, tohum, sonaErme } = yanit as Record<string, unknown>
  if (typeof turId !== 'string' || !/^[0-9a-f]{32}$/.test(turId)) return null
  if (!tohumGecerliMi(tohum) || typeof sonaErme !== 'string') return null
  return { turId, tohum, sonaErme }
}

type Secenek = { yontem?: 'GET' | 'POST' | 'DELETE'; govde?: unknown; anahtar?: string }

export function apiKur(kok: string, getir: typeof fetch) {
  async function istek<T>(yol: string, { yontem = 'GET', govde, anahtar }: Secenek = {}): Promise<T> {
    const basliklar: Record<string, string> = {}
    if (govde !== undefined) basliklar['Content-Type'] = 'application/json'
    if (anahtar) basliklar.Authorization = `Bearer ${anahtar}`
    let yanit: Response
    try {
      yanit = await getir(kok + yol, {
        method: yontem,
        headers: basliklar,
        body: govde === undefined ? undefined : JSON.stringify(govde),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      })
    } catch {
      throw new ApiHatasi(0, 'ag')
    }
    const metin = await yanit.text()
    const veri: unknown = metin ? JSON.parse(metin) : null
    if (!yanit.ok) {
      const kod = (veri as { hata?: unknown } | null)?.hata
      throw new ApiHatasi(yanit.status, typeof kod === 'string' ? kod : 'bilinmeyen')
    }
    return veri as T
  }

  return {
    async turAl(kanal: Kanal): Promise<JetonYaniti> {
      const jeton = jetonCoz(await istek<unknown>('/tur', { yontem: 'POST', govde: { kanal } }))
      if (!jeton) throw new ApiHatasi(0, 'bozukJeton')
      return jeton
    },
    oyuncuOl: (takmaAd: string, anahtar: string, onaySurumu: string) =>
      istek<OyuncuYaniti>('/oyuncu', { yontem: 'POST', govde: { takmaAd, anahtar, onaySurumu } }),
    turBitir: (turId: string, anahtar: string, girdiler: readonly Girdi[]) =>
      istek<BitirYaniti>(`/tur/${turId}/bitir`, { yontem: 'POST', govde: { girdiler }, anahtar }),
    tabloAl: () => istek<TabloYaniti>('/tablo'),
    benAl: (anahtar: string) => istek<BenYaniti>('/ben', { anahtar }),
    hesabiSil: (anahtar: string) => istek<void>('/oyuncu', { yontem: 'DELETE', anahtar }),
  }
}

export type Api = ReturnType<typeof apiKur>

export const api: Api = apiKur(API_KOKU, (girdi, secenek) => fetch(girdi, secenek))
```

`lib/oyun/api.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ApiHatasi, apiKur, jetonCoz, kanalCoz } from './api.ts'

test('kanalCoz_sofraVeIg_taninir_digerleriYok', () => {
  assert.equal(kanalCoz('?k=sofra'), 'sofra')
  assert.equal(kanalCoz('?k=ig'), 'ig')
  assert.equal(kanalCoz('?k=site'), 'site')
  assert.equal(kanalCoz('?k=tiktok'), 'yok')
  assert.equal(kanalCoz(''), 'yok')
})

test('jetonCoz_gecerliYanit_doner_bozukTohumYaDaKimlik_null', () => {
  const id = 'a'.repeat(32)
  assert.deepEqual(jetonCoz({ turId: id, tohum: 7, sonaErme: 'x' }), { turId: id, tohum: 7, sonaErme: 'x' })
  assert.equal(jetonCoz({ turId: id, tohum: -1, sonaErme: 'x' }), null)
  assert.equal(jetonCoz({ turId: id, tohum: 2 ** 32, sonaErme: 'x' }), null)
  assert.equal(jetonCoz({ turId: 'kisa', tohum: 7, sonaErme: 'x' }), null)
  assert.equal(jetonCoz(null), null)
})

function sahteGetir(durum: number, govde: unknown, kayit: { url?: string; secenek?: RequestInit } = {}) {
  const getir: typeof fetch = async (girdi, secenek) => {
    kayit.url = String(girdi)
    kayit.secenek = secenek
    return new Response(JSON.stringify(govde), { status: durum })
  }
  return getir
}

test('api_turAl_kokVeYolBirlesir_jetonDoner', async () => {
  const kayit: { url?: string; secenek?: RequestInit } = {}
  const api = apiKur('http://x', sahteGetir(200, { turId: 'b'.repeat(32), tohum: 5, sonaErme: 's' }, kayit))
  const jeton = await api.turAl('sofra')
  assert.equal(jeton.tohum, 5)
  assert.equal(kayit.url, 'http://x/tur')
  assert.equal(kayit.secenek?.method, 'POST')
  assert.equal(kayit.secenek?.body, '{"kanal":"sofra"}')
})

test('api_hataYaniti_ApiHatasiDurumVeKodla', async () => {
  const api = apiKur('http://x', sahteGetir(422, { hata: 'takmaAdKullanilamaz' }))
  await assert.rejects(
    api.oyuncuOl('a', 'b', 'c'),
    (h: unknown) => h instanceof ApiHatasi && h.durum === 422 && h.kod === 'takmaAdKullanilamaz',
  )
})

test('api_agHatasi_durumSifirKodAg', async () => {
  const api = apiKur('http://x', async () => {
    throw new TypeError('fetch failed')
  })
  await assert.rejects(api.tabloAl(), (h: unknown) => h instanceof ApiHatasi && h.durum === 0 && h.kod === 'ag')
})

test('api_anahtar_bearerBasligiylaGider', async () => {
  const kayit: { url?: string; secenek?: RequestInit } = {}
  const api = apiKur('http://x', sahteGetir(200, { takmaAd: 'A', hafta: null, odul: null }, kayit))
  await api.benAl('deadbeef')
  assert.equal((kayit.secenek?.headers as Record<string, string>).Authorization, 'Bearer deadbeef')
})
```

- [ ] **Step 6: Tarih metinleri**

`lib/oyun/tarih.ts`:

```ts
import type { Dil } from '../../content/types.ts'
import { ZAMAN_DILIMI } from '../saat.ts'

/* Sıralama ekranının tarihleri: sunucunun ISO anı, Girne saatiyle okunur. */

const YEREL: Record<Dil, string> = { tr: 'tr-TR', en: 'en-GB' }

/** Dönemin sıfırlanma anı: "12 Ekim Pazartesi 05:00". */
export function sifirlanmaMetni(iso: string, dil: Dil): string {
  return new Intl.DateTimeFormat(YEREL[dil], {
    timeZone: ZAMAN_DILIMI,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

/** Ödül kodunun son günü: "26 Ekim 2026". */
export function tarihMetni(iso: string, dil: Dil): string {
  const bicim = { timeZone: ZAMAN_DILIMI, day: 'numeric', month: 'long', year: 'numeric' } as const
  return new Intl.DateTimeFormat(YEREL[dil], bicim).format(new Date(iso))
}
```

`lib/oyun/tarih.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sifirlanmaMetni, tarihMetni } from './tarih.ts'

test('sifirlanmaMetni_girneSaatiyle_gunAyHaftaGunuSaat', () => {
  assert.equal(sifirlanmaMetni('2026-10-12T02:00:00.000Z', 'tr'), '12 Ekim Pazartesi 05:00')
  assert.equal(sifirlanmaMetni('2026-10-12T02:00:00.000Z', 'en'), 'Monday 12 October at 05:00')
})

test('tarihMetni_girneTarihi', () => {
  assert.equal(tarihMetni('2026-10-25T22:30:00.000Z', 'tr'), '26 Ekim 2026')
  assert.equal(tarihMetni('2026-10-25T22:30:00.000Z', 'en'), '26 October 2026')
})
```

- [ ] **Step 7: `doldur`**

`lib/metin.ts`'in sonuna eklenir:

```ts

/** `{ad}` yer tutucularını doldurur; kalıp sözlükten, değer çağırandan. Tanımsız ad olduğu gibi kalır. */
export function doldur(metin: string, degerler: Record<string, string | number>): string {
  return metin.replace(/\{(\w+)\}/g, (butun, ad: string) => (ad in degerler ? String(degerler[ad]) : butun))
}
```

`lib/metin.test.ts`'te içe aktarma `import { doldur, dulOnle } from './metin.ts'` olur ve dosyanın
sonuna eklenir:

```ts

test('doldur_yerTutucular_degerleAlir_tanimsizKalir', () => {
  assert.equal(doldur('Sıran: {sira}', { sira: 4 }), 'Sıran: 4')
  assert.equal(doldur('{fark} kaldı, {yok}', { fark: '1.200' }), '1.200 kaldı, {yok}')
  assert.equal(doldur('düz metin', {}), 'düz metin')
})
```

- [ ] **Step 8: Test ve tip denetimi**

Run: `node --test lib/oyun/tohum.test.ts lib/oyun/tavan.test.ts lib/oyun/takmaAd.test.ts lib/oyun/api.test.ts lib/oyun/tarih.test.ts lib/metin.test.ts && npm run typecheck`
Expected: `ℹ pass 27`, `ℹ fail 0`; typecheck temiz.

- [ ] **Step 9: Commit**

```bash
git add lib/oyun/tohum.ts lib/oyun/tohum.test.ts lib/oyun/tavan.ts lib/oyun/tavan.test.ts \
  lib/oyun/takmaAd.ts lib/oyun/takmaAd.test.ts lib/oyun/aktarim.ts lib/oyun/api.ts lib/oyun/api.test.ts \
  lib/oyun/tarih.ts lib/oyun/tarih.test.ts lib/metin.ts lib/metin.test.ts
git commit -m "Add the game's wire contract, seed ceiling and nickname rules"
```

---

### Task 2: Sunucu temeli: workspace, depo arabirimi, bellek deposu, yardımcılar

**Files:**
- Modify: `package.json`, `.gitignore`
- Create: `sunucu/package.json`, `sunucu/tsconfig.json`, `sunucu/depo.ts`, `sunucu/bellekDepo.ts`,
  `sunucu/siralama.ts`, `sunucu/donem.ts`, `sunucu/hiz.ts`, `sunucu/ip.ts`, `sunucu/kod.ts`,
  `sunucu/suphe.ts`, `sunucu/yasakli.ts`, `sunucu/http.ts`, `sunucu/dogrulama.ts`,
  `sunucu/depoSozlesmesi.ts`
- Test: `sunucu/bellekDepo.test.ts`, `sunucu/siralama.test.ts`, `sunucu/donem.test.ts`,
  `sunucu/hiz.test.ts`, `sunucu/ip.test.ts`, `sunucu/kod.test.ts`, `sunucu/suphe.test.ts`,
  `sunucu/yasakli.test.ts`, `sunucu/http.test.ts`, `sunucu/dogrulama.test.ts`

**Interfaces:**
- Consumes: Task 1'in `aktarim`, `takmaAd`, `tohum` modülleri; `lib/saat.ts` (`girneParcalari`,
  `KAPANIS_SAATI`, `ZAMAN_DILIMI`); `lib/oyun/deneme.ts` (testlerde).
- Produces:
  - `depo.ts`: `Depo` arabirimi ve `Jeton`, `Oyuncu`, `YeniOyuncu`, `YeniTur`, `Tur`,
    `SiraSatiri`, `Donem`, `YeniKazanan`, `Kazanan` tipleri.
  - `bellekDepo.ts`: `bellekDepoKur(): Depo`.
  - `siralama.ts`: `karsilastir(a, b)`, `enIyiler(turlar): SiraSatiri[]`,
    `oyuncununSirasi(sirali, oyuncuId): SiraBilgisi | null`, `tabloSatirlari(sirali, adet)`.
  - `donem.ts`: `HAFTA_MS`, `donemBaslangici(simdi: Date): Date`, `donemBitisi(simdi): Date`,
    `girneGunu(an): string`, `donemAnahtari(simdi): string`.
  - `hiz.ts`: `hizSiniriKur(limit, pencereMs): HizSiniri { izinVar(anahtar, simdi), temizle(simdi) }`.
  - `ip.ts`: `CLOUDFLARE_V4`, `CLOUDFLARE_V6`, `ipDuzelt`, `listeKur(cidrler): BlockList`,
    `CLOUDFLARE`, `gercekIp(soket, basliklar, guvenilirVekil): string`.
  - `kod.ts`: `anahtarOzeti(anahtar)`, `odulKodu(tuz, donem, oyuncuId, deneme = 0)`,
    `kodOzeti(tuz, kod)`, `jetonKimligi()`, `esitMi(a, b)`.
  - `suphe.ts`: `tamKivamSupheli(sonuc)`, `zamanlamaSupheli(girdiler)`, `supheliMi(girdiler, sonuc)`.
  - `yasakli.ts`: `yasakliMi(ad): boolean`.
  - `http.ts`: `IstekHatasi(durum, kod)`, `Istek`, `Yanit`, `govdeOku(req, sinir)`,
    `corsBasliklari(koken, izinliler)`, `yanitYaz(res, yanit, ek)`, `bearer(yetki)`,
    `temelKimlik(yetki)`.
  - `dogrulama.ts`: `kanalCoz(govde)`, `oyuncuIstegiCoz(govde)`, `girdileriCoz(govde): Girdi[]`.
  - `depoSozlesmesi.ts`: `depoSozlesmesi(ad, kur: DepoKurucu | null)`.

- [ ] **Step 1: Workspace**

`package.json`'da `"engines"` bloğundan sonra, `"scripts"`tan önce eklenir (sitenin
`dependencies` listesi değişmez):

```json
  "workspaces": [
    "sunucu"
  ],
```

`.gitignore`'da `/build` satırının altına `/sunucu/dist/` eklenir.

`sunucu/package.json`:

```json
{
  "name": "cigerci-bozo-sunucu",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Ciğerci Bozo açılış oyununun skor sunucusu (spec §10)",
  "engines": {
    "node": ">=24"
  },
  "scripts": {
    "dev": "node --watch ana.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/sunucu/ana.js"
  },
  "dependencies": {
    "mariadb": "^3.5.4"
  }
}
```

`sunucu/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "types": ["node"],
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "erasableSyntaxOnly": true,
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "rootDir": "..",
    "outDir": "dist"
  },
  "include": ["*.ts"],
  "exclude": ["*.test.ts", "depoSozlesmesi.ts", "dist", "node_modules"]
}
```

Run: `npm install`
Expected: `added 7 packages` (ya da benzeri); `node_modules/mariadb/package.json` var;
`package-lock.json` `sunucu` workspace'ini ve `mariadb` ağacını taşır. Site çalışma zamanı
bağımlılıkları değişmedi: `git diff package.json` yalnız `workspaces` bloğunu gösterir.

- [ ] **Step 2: Depo arabirimi ve sıralama**

`sunucu/depo.ts`:

```ts
import type { Kanal } from '../lib/oyun/aktarim.ts'
import type { Bitis, Girdi, Ozet } from '../lib/oyun/tipler.ts'

/*
 * Depo arabirimi (spec §10 tabloları): `bellekDepo` uç testleri için, `mariaDepo` üretim için.
 * Zamanlar epoch milisaniye; saat dilimi yorumu yalnız `donem.ts`'te yapılır.
 */

export type Jeton = {
  id: string
  tohum: number
  kanal: Kanal
  olusturma: number
  sonaErme: number
  kullanildi: boolean
}

export type Oyuncu = { id: number; takmaAd: string; gizli: boolean }

export type YeniOyuncu = {
  anahtarOzeti: string
  takmaAd: string
  adKatlanmis: string
  onaySurumu: string
  simdi: number
}

export type YeniTur = {
  jetonId: string
  oyuncuId: number
  donem: string
  tohum: number
  puan: number
  ozet: Ozet
  bitti: Bitis
  tik: number
  kanal: Kanal
  supheli: boolean
  girdiler: readonly Girdi[]
  olusturma: number
}

export type Tur = Omit<YeniTur, 'girdiler'> & { id: number; takmaAd: string; girdiler: Girdi[] | null }

/** Sıralama satırı: oyuncunun bir turu; `siralama` her oyuncu için en iyisini döner. */
export type SiraSatiri = {
  turId: number
  oyuncuId: number
  takmaAd: string
  gizli: boolean
  supheli: boolean
  puan: number
  tamKivam: number
  kalkan: number
  olusturma: number
}

export type Donem = { anahtar: string; baslangic: number; bitis: number; kapanis: number | null }

export type YeniKazanan = {
  donem: string
  sira: number
  oyuncuId: number
  takmaAd: string
  puan: number
  kodOzeti: string
  /** Kod türetme sayacı: aynı özet başka dönemden çıkmışsa artar (`isler.ts`). */
  deneme: number
  gecerlilik: number
}

/** `gizli` oyuncunun o anki bayrağı; oyuncu silinmişse false. */
export type Kazanan = Omit<YeniKazanan, 'oyuncuId'> & {
  id: number
  oyuncuId: number | null
  gizli: boolean
  kullanildi: number | null
}

export type Depo = {
  jetonEkle(jeton: Jeton): Promise<void>
  jetonBul(id: string): Promise<Jeton | null>
  /** Kullanılmamışsa tek adımda kullanılmış yapar ve true döner; yarışta ikinci çağrı false alır. */
  jetonKullan(id: string): Promise<boolean>
  suresiDolanJetonlariSil(simdi: number): Promise<number>

  oyuncuEkle(oyuncu: YeniOyuncu): Promise<Oyuncu | 'adKullanimda'>
  oyuncuBul(anahtarOzeti: string): Promise<Oyuncu | null>
  oyuncuGizle(id: number, gizli: boolean): Promise<boolean>
  oyuncuSil(id: number): Promise<boolean>
  /** Son etkinliği (son tur, yoksa kayıt) sınırdan eski oyuncuları turlarıyla siler. */
  eskiOyunculariSil(oncesi: number): Promise<number>

  turEkle(tur: YeniTur): Promise<number>
  turBul(id: number): Promise<Tur | null>
  /** Dönemde her oyuncunun en iyi turu, spec §6 sırasıyla. */
  siralama(donem: string): Promise<SiraSatiri[]>
  tumZamanlar(adet: number): Promise<SiraSatiri[]>
  /** Dönemdeki turların dokunuş kaydını siler; `korunan` listesindekiler kalır. */
  girdileriKirp(donem: string, korunan: readonly number[]): Promise<number>
  /** Bitişi sınırdan eski dönemlerin bütün dokunuş kayıtlarını siler. */
  eskiGirdileriSil(bitisiOncesi: number): Promise<number>

  donemKaydet(donem: Donem): Promise<void>
  acikDonemler(): Promise<Donem[]>
  donemKapat(anahtar: string, simdi: number): Promise<void>

  kazananEkle(kazanan: YeniKazanan): Promise<number>
  kazananlar(donem: string): Promise<Kazanan[]>
  sonSampiyon(): Promise<Kazanan | null>
  oyuncununOdulu(oyuncuId: number): Promise<Kazanan | null>
  kazananBul(kodOzeti: string): Promise<Kazanan | null>
  kazananKullan(id: number, simdi: number): Promise<boolean>
  kazananlariSil(): Promise<number>

  sayacArtir(gun: string, kanal: Kanal): Promise<void>
  sayaclar(gun: string): Promise<Record<Kanal, number>>

  kapat(): Promise<void>
}
```

`sunucu/siralama.ts`:

```ts
import type { SiraBilgisi, TabloSatiri } from '../lib/oyun/aktarim.ts'
import type { SiraSatiri } from './depo.ts'

type Siralanabilir = Pick<SiraSatiri, 'puan' | 'tamKivam' | 'kalkan' | 'olusturma'>

/** Beraberlik (spec §6): puan, tam kıvam sayısı, kalkan sofra azlığı, önce gönderen. */
export function karsilastir(a: Siralanabilir, b: Siralanabilir): number {
  return b.puan - a.puan || b.tamKivam - a.tamKivam || a.kalkan - b.kalkan || a.olusturma - b.olusturma
}

/** Her oyuncunun en iyi turu seçilir ve §6 sırasına dizilir; depolar ham tur listesi verebilir. */
export function enIyiler(turlar: readonly SiraSatiri[]): SiraSatiri[] {
  const enIyi = new Map<number, SiraSatiri>()
  for (const tur of turlar) {
    const onceki = enIyi.get(tur.oyuncuId)
    if (!onceki || karsilastir(tur, onceki) < 0) enIyi.set(tur.oyuncuId, tur)
  }
  return [...enIyi.values()].sort(karsilastir)
}

/** Oyuncunun sırası (1'den) ve bir üsttekine kalan puan; sırada değilse null. */
export function oyuncununSirasi(sirali: readonly SiraSatiri[], oyuncuId: number): SiraBilgisi | null {
  const i = sirali.findIndex((s) => s.oyuncuId === oyuncuId)
  if (i === -1) return null
  const satir = sirali[i] as SiraSatiri
  const ustteki = sirali[i - 1]
  return { puan: satir.puan, sira: i + 1, ustekiFark: ustteki ? ustteki.puan - satir.puan : null }
}

/** Herkese açık tablo: gizlenen ad null gider, sunucu adı hiç yazmaz. */
export function tabloSatirlari(sirali: readonly SiraSatiri[], adet: number): TabloSatiri[] {
  return sirali.slice(0, adet).map((s, i) => ({
    sira: i + 1,
    takmaAd: s.gizli ? null : s.takmaAd,
    puan: s.puan,
    tamKivam: s.tamKivam,
  }))
}
```

`sunucu/siralama.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { SiraSatiri } from './depo.ts'
import { enIyiler, karsilastir, oyuncununSirasi, tabloSatirlari } from './siralama.ts'

const satir = (p: Partial<SiraSatiri>): SiraSatiri => ({
  turId: 1,
  oyuncuId: 1,
  takmaAd: 'A',
  gizli: false,
  supheli: false,
  puan: 100,
  tamKivam: 0,
  kalkan: 0,
  olusturma: 0,
  ...p,
})

test('karsilastir_puanTamKivamKalkanZaman_sirasiyla', () => {
  assert.ok(karsilastir(satir({ puan: 200 }), satir({ puan: 100 })) < 0)
  assert.ok(karsilastir(satir({ tamKivam: 5 }), satir({ tamKivam: 4 })) < 0)
  assert.ok(karsilastir(satir({ kalkan: 0 }), satir({ kalkan: 1 })) < 0)
  assert.ok(karsilastir(satir({ olusturma: 1 }), satir({ olusturma: 2 })) < 0)
  assert.equal(karsilastir(satir({}), satir({})), 0)
})

test('enIyiler_oyuncuBasinaTekSatir_enIyisi_sirali', () => {
  const turlar = [
    satir({ turId: 1, oyuncuId: 1, puan: 100 }),
    satir({ turId: 2, oyuncuId: 1, puan: 300 }),
    satir({ turId: 3, oyuncuId: 2, puan: 200 }),
    satir({ turId: 4, oyuncuId: 1, puan: 300, tamKivam: 1 }),
  ]
  assert.deepEqual(enIyiler(turlar).map((s) => s.turId), [4, 3])
})

test('oyuncununSirasi_birinciFarkNull_ikinciUsttekineFark_yoksaNull', () => {
  const sirali = [satir({ oyuncuId: 1, puan: 500 }), satir({ oyuncuId: 2, puan: 320 })]
  assert.deepEqual(oyuncununSirasi(sirali, 1), { puan: 500, sira: 1, ustekiFark: null })
  assert.deepEqual(oyuncununSirasi(sirali, 2), { puan: 320, sira: 2, ustekiFark: 180 })
  assert.equal(oyuncununSirasi(sirali, 3), null)
})

test('tabloSatirlari_gizliAdNull_adetKadar', () => {
  const sirali = [satir({ takmaAd: 'A' }), satir({ oyuncuId: 2, takmaAd: 'B', gizli: true }), satir({ oyuncuId: 3 })]
  const tablo = tabloSatirlari(sirali, 2)
  assert.equal(tablo.length, 2)
  assert.equal(tablo[0]?.takmaAd, 'A')
  assert.equal(tablo[1]?.takmaAd, null)
  assert.equal(tablo[1]?.sira, 2)
})
```

- [ ] **Step 3: Bellek deposu ve sözleşme testi**

Sözleşme testi iki depo için tek dosyadır: bellek deposu her zaman koşar, MariaDB deposu
(Task 4) `BOZO_TEST_DB_URL` ile.

`sunucu/bellekDepo.ts`:

```ts
import type { Kanal } from '../lib/oyun/aktarim.ts'
import type { Depo, Donem, Jeton, Kazanan, Oyuncu, SiraSatiri, Tur } from './depo.ts'
import { enIyiler } from './siralama.ts'

/* Bellekte depo: uç testleri ve veritabanısız yerel geliştirme. Süreç bitince her şey gider. */

type OyuncuKaydi = Oyuncu & {
  anahtarOzeti: string
  adKatlanmis: string
  onaySurumu: string
  olusturma: number
  sonTur: number | null
}

type Bellek = {
  jetonlar: Map<string, Jeton>
  oyuncular: Map<number, OyuncuKaydi>
  turlar: Map<number, Tur>
  donemler: Map<string, Donem>
  kazananlar: Map<number, Kazanan>
  sayac: Map<string, number>
  sonId: number
}

type Parca<K extends keyof Depo> = Pick<Depo, K>

function jetonlar(b: Bellek): Parca<'jetonEkle' | 'jetonBul' | 'jetonKullan' | 'suresiDolanJetonlariSil'> {
  return {
    async jetonEkle(j) {
      b.jetonlar.set(j.id, { ...j })
    },
    async jetonBul(id) {
      const j = b.jetonlar.get(id)
      return j ? { ...j } : null
    },
    async jetonKullan(id) {
      const j = b.jetonlar.get(id)
      if (!j || j.kullanildi) return false
      j.kullanildi = true
      return true
    },
    async suresiDolanJetonlariSil(simdi) {
      let sayi = 0
      for (const [id, j] of b.jetonlar) if (j.sonaErme < simdi) sayi += Number(b.jetonlar.delete(id))
      return sayi
    },
  }
}

function oyuncuyuSil(b: Bellek, id: number): boolean {
  for (const [tid, t] of b.turlar) if (t.oyuncuId === id) b.turlar.delete(tid)
  for (const k of b.kazananlar.values()) if (k.oyuncuId === id) k.oyuncuId = null
  return b.oyuncular.delete(id)
}

type OyuncuUclari = Parca<'oyuncuEkle' | 'oyuncuBul' | 'oyuncuGizle' | 'oyuncuSil' | 'eskiOyunculariSil'>

function oyuncular(b: Bellek): OyuncuUclari {
  return {
    async oyuncuEkle(y) {
      for (const o of b.oyuncular.values()) if (o.adKatlanmis === y.adKatlanmis) return 'adKullanimda'
      const id = ++b.sonId
      b.oyuncular.set(id, {
        id,
        anahtarOzeti: y.anahtarOzeti,
        takmaAd: y.takmaAd,
        adKatlanmis: y.adKatlanmis,
        onaySurumu: y.onaySurumu,
        gizli: false,
        olusturma: y.simdi,
        sonTur: null,
      })
      return { id, takmaAd: y.takmaAd, gizli: false }
    },
    async oyuncuBul(anahtarOzeti) {
      for (const o of b.oyuncular.values()) {
        if (o.anahtarOzeti === anahtarOzeti) return { id: o.id, takmaAd: o.takmaAd, gizli: o.gizli }
      }
      return null
    },
    async oyuncuGizle(id, gizli) {
      const o = b.oyuncular.get(id)
      if (!o) return false
      o.gizli = gizli
      return true
    },
    async oyuncuSil(id) {
      return oyuncuyuSil(b, id)
    },
    async eskiOyunculariSil(oncesi) {
      let sayi = 0
      for (const o of [...b.oyuncular.values()]) {
        if ((o.sonTur ?? o.olusturma) < oncesi) sayi += Number(oyuncuyuSil(b, o.id))
      }
      return sayi
    },
  }
}

function siraSatiri(b: Bellek, t: Tur): SiraSatiri | null {
  const o = b.oyuncular.get(t.oyuncuId)
  if (!o) return null
  return {
    turId: t.id,
    oyuncuId: t.oyuncuId,
    takmaAd: o.takmaAd,
    gizli: o.gizli,
    supheli: t.supheli,
    puan: t.puan,
    tamKivam: t.ozet.tamKivam,
    kalkan: t.ozet.kalkan,
    olusturma: t.olusturma,
  }
}

type TurUclari = Parca<'turEkle' | 'turBul' | 'siralama' | 'tumZamanlar' | 'girdileriKirp' | 'eskiGirdileriSil'>

function turlar(b: Bellek): TurUclari {
  const satirlar = (sec: (t: Tur) => boolean) =>
    [...b.turlar.values()].filter(sec).flatMap((t) => siraSatiri(b, t) ?? [])
  return {
    async turEkle(t) {
      const o = b.oyuncular.get(t.oyuncuId)
      if (!o) throw new Error(`tur için oyuncu yok: ${t.oyuncuId}`)
      const id = ++b.sonId
      b.turlar.set(id, { ...t, id, takmaAd: o.takmaAd, girdiler: [...t.girdiler] })
      o.sonTur = Math.max(o.sonTur ?? 0, t.olusturma)
      return id
    },
    async turBul(id) {
      const t = b.turlar.get(id)
      return t ? { ...t, girdiler: t.girdiler ? [...t.girdiler] : null } : null
    },
    async siralama(donem) {
      return enIyiler(satirlar((t) => t.donem === donem))
    },
    async tumZamanlar(adet) {
      return enIyiler(satirlar(() => true)).slice(0, adet)
    },
    async girdileriKirp(donem, korunan) {
      let sayi = 0
      for (const t of b.turlar.values()) {
        if (t.donem !== donem || t.girdiler === null || korunan.includes(t.id)) continue
        t.girdiler = null
        sayi++
      }
      return sayi
    },
    async eskiGirdileriSil(bitisiOncesi) {
      let sayi = 0
      for (const t of b.turlar.values()) {
        const d = b.donemler.get(t.donem)
        if (!d || d.bitis >= bitisiOncesi || t.girdiler === null) continue
        t.girdiler = null
        sayi++
      }
      return sayi
    },
  }
}

function donemler(b: Bellek): Parca<'donemKaydet' | 'acikDonemler' | 'donemKapat'> {
  return {
    async donemKaydet(d) {
      if (!b.donemler.has(d.anahtar)) b.donemler.set(d.anahtar, { ...d })
    },
    async acikDonemler() {
      return [...b.donemler.values()].filter((d) => d.kapanis === null).sort((x, y) => x.baslangic - y.baslangic)
    },
    async donemKapat(anahtar, simdi) {
      const d = b.donemler.get(anahtar)
      if (d) d.kapanis = simdi
    },
  }
}

type KazananUclari = Parca<
  'kazananEkle' | 'kazananlar' | 'sonSampiyon' | 'oyuncununOdulu' | 'kazananBul' | 'kazananKullan' | 'kazananlariSil'
>

function kazananlar(b: Bellek): KazananUclari {
  const sira = (x: Kazanan, y: Kazanan) => y.donem.localeCompare(x.donem) || x.sira - y.sira
  const oku = (k: Kazanan): Kazanan => ({
    ...k,
    gizli: k.oyuncuId !== null && (b.oyuncular.get(k.oyuncuId)?.gizli ?? false),
  })
  const sec = (uyan: (k: Kazanan) => boolean) => [...b.kazananlar.values()].filter(uyan).sort(sira).map(oku)
  return {
    async kazananEkle(k) {
      const id = ++b.sonId
      b.kazananlar.set(id, { ...k, id, gizli: false, kullanildi: null })
      return id
    },
    async kazananlar(donem) {
      return sec((k) => k.donem === donem)
    },
    async sonSampiyon() {
      return sec((k) => k.sira === 1)[0] ?? null
    },
    async oyuncununOdulu(oyuncuId) {
      return sec((k) => k.oyuncuId === oyuncuId)[0] ?? null
    },
    async kazananBul(kodOzeti) {
      return sec((k) => k.kodOzeti === kodOzeti)[0] ?? null
    },
    async kazananKullan(id, simdi) {
      const k = b.kazananlar.get(id)
      if (!k || k.kullanildi !== null) return false
      k.kullanildi = simdi
      return true
    },
    async kazananlariSil() {
      const sayi = b.kazananlar.size
      b.kazananlar.clear()
      return sayi
    },
  }
}

function sayaclar(b: Bellek): Parca<'sayacArtir' | 'sayaclar'> {
  return {
    async sayacArtir(gun, kanal) {
      b.sayac.set(`${gun}:${kanal}`, (b.sayac.get(`${gun}:${kanal}`) ?? 0) + 1)
    },
    async sayaclar(gun) {
      const al = (k: Kanal) => b.sayac.get(`${gun}:${k}`) ?? 0
      return { sofra: al('sofra'), ig: al('ig'), site: al('site'), yok: al('yok') }
    },
  }
}

export function bellekDepoKur(): Depo {
  const b: Bellek = {
    jetonlar: new Map(),
    oyuncular: new Map(),
    turlar: new Map(),
    donemler: new Map(),
    kazananlar: new Map(),
    sayac: new Map(),
    sonId: 0,
  }
  return {
    ...jetonlar(b),
    ...oyuncular(b),
    ...turlar(b),
    ...donemler(b),
    ...kazananlar(b),
    ...sayaclar(b),
    async kapat() {
      /* bellek */
    },
  }
}
```

`sunucu/depoSozlesmesi.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { Depo, YeniTur } from './depo.ts'

/*
 * Depo sözleşmesi: bellek ve MariaDB uygulamaları aynı testleri geçer. `kur` her testte boş
 * bir depo verir; null ise testler atlanır (MariaDB testi `BOZO_TEST_DB_URL` ister).
 */
export type DepoKurucu = () => Promise<Depo>
type Testci = (isim: string, govde: (depo: Depo) => Promise<void>) => void

const GUN = 24 * 60 * 60_000

async function oyuncuEkle(depo: Depo, ad: string, simdi = 1000) {
  const sonuc = await depo.oyuncuEkle({
    anahtarOzeti: `ozet-${ad}`,
    takmaAd: ad,
    adKatlanmis: ad.toLowerCase(),
    onaySurumu: 's1',
    simdi,
  })
  if (sonuc === 'adKullanimda') throw new Error(`ad kullanımda: ${ad}`)
  return sonuc
}

function tur(oyuncuId: number, donem: string, puan: number, ek: Partial<YeniTur> = {}): YeniTur {
  return {
    jetonId: `j${oyuncuId}-${donem}-${puan}-${ek.olusturma ?? 0}`,
    oyuncuId,
    donem,
    tohum: 1,
    puan,
    ozet: { sofra: 1, sis: 2, tamKivam: 0, enUzunKombo: 1, kalkan: 0 },
    bitti: 'gece',
    tik: 7200,
    kanal: 'yok',
    supheli: false,
    girdiler: [[0, 's0']],
    olusturma: 5000,
    ...ek,
  }
}

function jetonVeOyuncuTestleri(t: Testci): void {
  t('jeton_ekleBulKullanTekSefer_suresiDolanSilinir', async (depo) => {
    const a = 'a'.repeat(32)
    await depo.jetonEkle({ id: a, tohum: 7, kanal: 'sofra', olusturma: 100, sonaErme: 200, kullanildi: false })
    const b = 'b'.repeat(32)
    await depo.jetonEkle({ id: b, tohum: 8, kanal: 'ig', olusturma: 100, sonaErme: 900, kullanildi: false })
    assert.deepEqual(await depo.jetonBul(a), {
      id: a, tohum: 7, kanal: 'sofra', olusturma: 100, sonaErme: 200, kullanildi: false,
    })
    assert.equal(await depo.jetonKullan(a), true)
    assert.equal(await depo.jetonKullan(a), false)
    assert.equal((await depo.jetonBul(a))?.kullanildi, true)
    assert.equal(await depo.jetonKullan('c'.repeat(32)), false)
    assert.equal(await depo.suresiDolanJetonlariSil(500), 1)
    assert.equal(await depo.jetonBul(a), null)
    assert.notEqual(await depo.jetonBul(b), null)
  })

  t('oyuncu_ekleBulGizleSil_ayniKatlanmisAdReddedilir', async (depo) => {
    const ayse = await oyuncuEkle(depo, 'Ayşe')
    assert.deepEqual(await depo.oyuncuBul('ozet-Ayşe'), { id: ayse.id, takmaAd: 'Ayşe', gizli: false })
    const ayni = { anahtarOzeti: 'baska', takmaAd: 'AYŞE', adKatlanmis: 'ayşe', onaySurumu: 's1', simdi: 1 }
    assert.equal(await depo.oyuncuEkle(ayni), 'adKullanimda')
    assert.equal(await depo.oyuncuGizle(ayse.id, true), true)
    assert.equal((await depo.oyuncuBul('ozet-Ayşe'))?.gizli, true)
    assert.equal(await depo.oyuncuGizle(999, true), false)
    assert.equal(await depo.oyuncuSil(ayse.id), true)
    assert.equal(await depo.oyuncuBul('ozet-Ayşe'), null)
    assert.equal(await depo.oyuncuSil(ayse.id), false)
  })

  t('oyuncu_eskiOyunculariSil_sonTuraYoksaKayitZamaninaGore', async (depo) => {
    const eski = await oyuncuEkle(depo, 'Eski', 1000)
    const yeni = await oyuncuEkle(depo, 'Yeni', 1000)
    await oyuncuEkle(depo, 'Sessiz', 1000)
    await depo.turEkle(tur(eski.id, '2026-10-05', 10, { olusturma: 2000 }))
    await depo.turEkle(tur(yeni.id, '2026-10-05', 10, { olusturma: 9000 }))
    assert.equal(await depo.eskiOyunculariSil(5000), 2)
    assert.equal(await depo.oyuncuBul('ozet-Eski'), null)
    assert.equal(await depo.oyuncuBul('ozet-Sessiz'), null)
    assert.notEqual(await depo.oyuncuBul('ozet-Yeni'), null)
    assert.equal((await depo.siralama('2026-10-05')).length, 1)
  })
}

function turTestleri(t: Testci): void {
  t('tur_siralama_oyuncuBasinaEnIyi_beraberlik_tumZamanlar_turBul', async (depo) => {
    const a = await oyuncuEkle(depo, 'A')
    const b = await oyuncuEkle(depo, 'B')
    await depo.turEkle(tur(a.id, '2026-10-05', 100, { olusturma: 1 }))
    const aEnIyi = await depo.turEkle(tur(a.id, '2026-10-05', 300, { olusturma: 2 }))
    const ozet = { sofra: 1, sis: 2, tamKivam: 1, enUzunKombo: 1, kalkan: 0 }
    await depo.turEkle(tur(b.id, '2026-10-05', 300, { olusturma: 3, ozet }))
    await depo.turEkle(tur(b.id, '2026-09-28', 900, { olusturma: 0 }))
    const sirali = await depo.siralama('2026-10-05')
    assert.deepEqual(sirali.map((s) => [s.takmaAd, s.puan, s.tamKivam]), [['B', 300, 1], ['A', 300, 0]])
    assert.equal(sirali[1]?.turId, aEnIyi)
    assert.deepEqual((await depo.tumZamanlar(1)).map((s) => [s.takmaAd, s.puan]), [['B', 900]])
    const bulunan = await depo.turBul(aEnIyi)
    assert.equal(bulunan?.takmaAd, 'A')
    assert.deepEqual(bulunan?.girdiler, [[0, 's0']])
    assert.equal(bulunan?.ozet.sis, 2)
    assert.equal(await depo.turBul(999999), null)
  })

  t('tur_girdileriKirpVeEskiGirdileriSil_korunanKalir', async (depo) => {
    const a = await oyuncuEkle(depo, 'A')
    const korunan = await depo.turEkle(tur(a.id, '2026-10-05', 300, { olusturma: 1 }))
    const kirpilan = await depo.turEkle(tur(a.id, '2026-10-05', 100, { olusturma: 2 }))
    const eski = await depo.turEkle(tur(a.id, '2026-09-28', 100, { olusturma: 0 }))
    await depo.donemKaydet({ anahtar: '2026-09-28', baslangic: 0, bitis: 10 * GUN, kapanis: null })
    await depo.donemKaydet({ anahtar: '2026-10-05', baslangic: 10 * GUN, bitis: 17 * GUN, kapanis: null })
    assert.equal(await depo.girdileriKirp('2026-10-05', [korunan]), 1)
    assert.notEqual((await depo.turBul(korunan))?.girdiler, null)
    assert.equal((await depo.turBul(kirpilan))?.girdiler, null)
    assert.equal(await depo.eskiGirdileriSil(12 * GUN), 1)
    assert.equal((await depo.turBul(eski))?.girdiler, null)
    assert.notEqual((await depo.turBul(korunan))?.girdiler, null)
  })
}

function donemVeKazananTestleri(t: Testci): void {
  t('donem_kaydetYalnizIlkKez_kapat_acikListedenDuser', async (depo) => {
    await depo.donemKaydet({ anahtar: '2026-10-05', baslangic: 1, bitis: 2, kapanis: null })
    await depo.donemKapat('2026-10-05', 3)
    await depo.donemKaydet({ anahtar: '2026-10-05', baslangic: 1, bitis: 2, kapanis: null })
    await depo.donemKaydet({ anahtar: '2026-10-12', baslangic: 2, bitis: 4, kapanis: null })
    assert.deepEqual(await depo.acikDonemler(), [{ anahtar: '2026-10-12', baslangic: 2, bitis: 4, kapanis: null }])
  })

  t('kazanan_ekleBulKullan_sonSampiyon_gizliYansir_oyuncuSilinceBagKopar', async (depo) => {
    const a = await oyuncuEkle(depo, 'A')
    const b = await oyuncuEkle(depo, 'B')
    const ortak = { donem: '2026-09-28', puan: 500, deneme: 0, gecerlilik: 9000 }
    const k1 = await depo.kazananEkle({ ...ortak, sira: 1, oyuncuId: a.id, takmaAd: 'A', kodOzeti: 'oz1' })
    await depo.kazananEkle({ ...ortak, sira: 2, oyuncuId: b.id, takmaAd: 'B', kodOzeti: 'oz2' })
    await depo.kazananEkle({ ...ortak, donem: '2026-09-21', sira: 1, oyuncuId: b.id, takmaAd: 'B', kodOzeti: 'oz3' })
    assert.deepEqual((await depo.kazananlar('2026-09-28')).map((k) => [k.sira, k.takmaAd]), [[1, 'A'], [2, 'B']])
    assert.equal((await depo.sonSampiyon())?.id, k1)
    assert.equal((await depo.oyuncununOdulu(b.id))?.kodOzeti, 'oz2')
    assert.equal((await depo.kazananBul('oz1'))?.sira, 1)
    assert.equal(await depo.kazananBul('yok'), null)
    assert.equal(await depo.kazananKullan(k1, 7000), true)
    assert.equal(await depo.kazananKullan(k1, 7001), false)
    assert.equal((await depo.kazananBul('oz1'))?.kullanildi, 7000)
    await depo.oyuncuGizle(a.id, true)
    assert.equal((await depo.sonSampiyon())?.gizli, true)
    await depo.oyuncuSil(a.id)
    const kopuk = await depo.kazananBul('oz1')
    assert.deepEqual([kopuk?.oyuncuId, kopuk?.takmaAd, kopuk?.gizli], [null, 'A', false])
    assert.equal(await depo.kazananlariSil(), 3)
    assert.equal(await depo.sonSampiyon(), null)
  })

  t('sayac_artirVeOku_gunVeKanalBasina', async (depo) => {
    await depo.sayacArtir('2026-10-08', 'sofra')
    await depo.sayacArtir('2026-10-08', 'sofra')
    await depo.sayacArtir('2026-10-08', 'site')
    await depo.sayacArtir('2026-10-09', 'ig')
    assert.deepEqual(await depo.sayaclar('2026-10-08'), { sofra: 2, ig: 0, site: 1, yok: 0 })
    assert.deepEqual(await depo.sayaclar('2026-10-10'), { sofra: 0, ig: 0, site: 0, yok: 0 })
  })
}

export function depoSozlesmesi(ad: string, kur: DepoKurucu | null): void {
  const t: Testci = (isim, govde) =>
    test(`${ad}_${isim}`, { skip: kur ? false : 'BOZO_TEST_DB_URL tanımlı değil' }, async () => {
      const depo = await (kur as DepoKurucu)()
      try {
        await govde(depo)
      } finally {
        await depo.kapat()
      }
    })
  jetonVeOyuncuTestleri(t)
  turTestleri(t)
  donemVeKazananTestleri(t)
}
```

`sunucu/bellekDepo.test.ts`:

```ts
import { bellekDepoKur } from './bellekDepo.ts'
import { depoSozlesmesi } from './depoSozlesmesi.ts'

depoSozlesmesi('bellekDepo', async () => bellekDepoKur())
```

- [ ] **Step 4: Dönem**

Yaz saati: Girne 25 Ekim 2026'da UTC+2'ye döner, 28 Mart 2027'de UTC+3'e; iki test o haftaları
tutar.

`sunucu/donem.ts`:

```ts
import { girneParcalari, KAPANIS_SAATI, ZAMAN_DILIMI } from '../lib/saat.ts'

/*
 * Haftalık dönem (spec §7): Pazartesi 05:00 Girne'de sıfırlanır. Saat dilimi işi sitenin
 * `lib/saat.ts`'inden; burada yalnız hafta aritmetiği var.
 */
const DAKIKA = 60_000
const HAFTA_DAKIKASI = 7 * 24 * 60
export const HAFTA_MS = HAFTA_DAKIKASI * DAKIKA

/** Pazartesi 05:00'ten bu yana geçen yerel dakika. */
function haftaDakikasi(an: Date): number {
  const { saat, dakika, gunIndeksi } = girneParcalari(an)
  const gun = (gunIndeksi + 6) % 7
  return (((gun * 24 + saat - KAPANIS_SAATI) * 60 + dakika) % HAFTA_DAKIKASI + HAFTA_DAKIKASI) % HAFTA_DAKIKASI
}

/** İçinde bulunulan dönemin başı, UTC anı. Arada yaz saati geçişi varsa bir saatlik kayma ikinci adımda düzelir. */
export function donemBaslangici(simdi: Date): Date {
  const dakikaBasi = simdi.getTime() - (simdi.getTime() % DAKIKA)
  const kaba = dakikaBasi - haftaDakikasi(new Date(dakikaBasi)) * DAKIKA
  const parcalar = girneParcalari(new Date(kaba))
  const sapma = (parcalar.saat - KAPANIS_SAATI) * 60 + parcalar.dakika
  return new Date(kaba - sapma * DAKIKA)
}

/** Bir sonraki Pazartesi 05:00; yaz saati haftası 7 gün ± 1 saattir. */
export function donemBitisi(simdi: Date): Date {
  return donemBaslangici(new Date(donemBaslangici(simdi).getTime() + HAFTA_MS + 120 * DAKIKA))
}

const TARIH = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZAMAN_DILIMI,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** Girne'deki takvim günü, `YYYY-MM-DD`. Dönem anahtarı ve günlük sayaç bunu kullanır. */
export function girneGunu(an: Date): string {
  const al = (tur: Intl.DateTimeFormatPartTypes) => TARIH.formatToParts(an).find((p) => p.type === tur)?.value ?? ''
  return `${al('year')}-${al('month')}-${al('day')}`
}

/** Dönemin anahtarı: başladığı Pazartesi'nin Girne tarihi. */
export function donemAnahtari(simdi: Date): string {
  return girneGunu(donemBaslangici(simdi))
}
```

`sunucu/donem.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { donemAnahtari, donemBaslangici, donemBitisi, girneGunu } from './donem.ts'

/* 5 Ekim 2026 Pazartesi; Girne yazın UTC+3, 25 Ekim 2026'da UTC+2'ye döner, 28 Mart 2027'de geri. */

test('donemBaslangici_pazartesi0459_oncekiHafta_0500_yeniHafta', () => {
  assert.equal(donemBaslangici(new Date('2026-10-05T04:59:00+03:00')).toISOString(), '2026-09-28T02:00:00.000Z')
  assert.equal(donemBaslangici(new Date('2026-10-05T05:00:00+03:00')).toISOString(), '2026-10-05T02:00:00.000Z')
  assert.equal(donemBaslangici(new Date('2026-10-08T23:30:17+03:00')).toISOString(), '2026-10-05T02:00:00.000Z')
})

test('donemBaslangici_pazarGecesi_aynıHaftadaKalir', () => {
  assert.equal(donemBaslangici(new Date('2026-10-12T03:00:00+03:00')).toISOString(), '2026-10-05T02:00:00.000Z')
})

test('donemBitisi_sonrakiPazartesi0500', () => {
  assert.equal(donemBitisi(new Date('2026-10-08T12:00:00+03:00')).toISOString(), '2026-10-12T02:00:00.000Z')
})

test('donem_yazSaatiBitenHafta_yediGunArtiBirSaat', () => {
  const bas = donemBaslangici(new Date('2026-10-20T12:00:00+03:00'))
  const bit = donemBitisi(new Date('2026-10-20T12:00:00+03:00'))
  assert.equal(bas.toISOString(), '2026-10-19T02:00:00.000Z')
  assert.equal(bit.toISOString(), '2026-10-26T03:00:00.000Z')
  assert.equal(donemBaslangici(new Date('2026-10-27T00:00:00Z')).toISOString(), '2026-10-26T03:00:00.000Z')
})

test('donem_yazSaatiBaslayanHafta_yediGunEksiBirSaat', () => {
  assert.equal(donemBaslangici(new Date('2027-03-25T12:00:00+02:00')).toISOString(), '2027-03-22T03:00:00.000Z')
  assert.equal(donemBitisi(new Date('2027-03-25T12:00:00+02:00')).toISOString(), '2027-03-29T02:00:00.000Z')
})

test('donemAnahtari_pazartesininGirneTarihi', () => {
  assert.equal(donemAnahtari(new Date('2026-10-08T23:30:00+03:00')), '2026-10-05')
  assert.equal(donemAnahtari(new Date('2026-10-05T04:59:00+03:00')), '2026-09-28')
})

test('girneGunu_geceYarisindanSonra_girneTarihi', () => {
  assert.equal(girneGunu(new Date('2026-10-08T22:30:00Z')), '2026-10-09')
})
```

- [ ] **Step 5: Hız sınırı, IP, özetler, şüphe, yasaklı liste**

`sunucu/hiz.ts`:

```ts
/** Kayan pencereli hız sınırı, yalnız bellekte (spec §8: uygulama IP yazmaz). */
export type HizSiniri = {
  /** İzin varsa sayar ve true döner; limit dolduysa false. */
  izinVar(anahtar: string, simdi: number): boolean
  /** Penceresi boşalan anahtarları atar; bellek büyümesin diye ara ara çağrılır. */
  temizle(simdi: number): void
}

export function hizSiniriKur(limit: number, pencereMs: number): HizSiniri {
  const kayit = new Map<string, number[]>()
  const kirp = (zamanlar: number[], simdi: number): number[] => zamanlar.filter((t) => t > simdi - pencereMs)
  return {
    izinVar(anahtar, simdi) {
      const zamanlar = kirp(kayit.get(anahtar) ?? [], simdi)
      if (zamanlar.length >= limit) {
        kayit.set(anahtar, zamanlar)
        return false
      }
      zamanlar.push(simdi)
      kayit.set(anahtar, zamanlar)
      return true
    },
    temizle(simdi) {
      for (const [anahtar, zamanlar] of kayit) {
        const kalan = kirp(zamanlar, simdi)
        if (kalan.length === 0) kayit.delete(anahtar)
        else kayit.set(anahtar, kalan)
      }
    },
  }
}
```

`sunucu/hiz.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { hizSiniriKur } from './hiz.ts'

test('hizSiniri_limitKadarIzin_sonrasiRet_pencereGecinceYenidenIzin', () => {
  const sinir = hizSiniriKur(3, 1000)
  assert.equal(sinir.izinVar('a', 0), true)
  assert.equal(sinir.izinVar('a', 10), true)
  assert.equal(sinir.izinVar('a', 20), true)
  assert.equal(sinir.izinVar('a', 30), false)
  assert.equal(sinir.izinVar('b', 30), true)
  assert.equal(sinir.izinVar('a', 1001), true)
})

test('hizSiniri_temizle_bosAnahtarlariAtar_dolulariTutar', () => {
  const sinir = hizSiniriKur(1, 100)
  sinir.izinVar('a', 0)
  sinir.izinVar('b', 90)
  sinir.temizle(150)
  assert.equal(sinir.izinVar('a', 151), true)
  assert.equal(sinir.izinVar('b', 151), false)
})
```

`sunucu/ip.ts`:

```ts
import { BlockList, isIP } from 'node:net'

/*
 * Gerçek IP (spec §10): `CF-Connecting-IP` yalnız istek Cloudflare aralığından geliyorsa.
 * Plesk'te Node'un önünde yerel bir vekil durur; güvenilir vekilin eklediği son
 * `X-Forwarded-For` adımı eş adres sayılır. IP yalnız bellekteki hız sınırında kullanılır.
 */

/** cloudflare.com/ips, 8 Ekim 2026. */
export const CLOUDFLARE_V4 = [
  '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18',
  '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17',
  '162.158.0.0/15', '104.16.0.0/13', '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
]
export const CLOUDFLARE_V6 = [
  '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32',
  '2a06:98c0::/29', '2c0f:f248::/32',
]

/** `::ffff:1.2.3.4` biçimindeki IPv4 adresi düz yazılır. */
export function ipDuzelt(adres: string): string {
  return adres.replace(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i, '$1')
}

export function listeKur(cidrler: readonly string[]): BlockList {
  const liste = new BlockList()
  for (const cidr of cidrler) {
    const [adres = '', uzunluk] = cidr.split('/')
    const tur = isIP(adres) === 6 ? 'ipv6' : 'ipv4'
    if (uzunluk === undefined) liste.addAddress(adres, tur)
    else liste.addSubnet(adres, Number(uzunluk), tur)
  }
  return liste
}

function listede(liste: BlockList, adres: string): boolean {
  const tur = isIP(adres)
  return tur !== 0 && liste.check(adres, tur === 6 ? 'ipv6' : 'ipv4')
}

export const CLOUDFLARE = listeKur([...CLOUDFLARE_V4, ...CLOUDFLARE_V6])

export type IpBasliklari = { 'cf-connecting-ip'?: string; 'x-forwarded-for'?: string }

export function gercekIp(soket: string | undefined, basliklar: IpBasliklari, guvenilirVekil: BlockList): string {
  let es = ipDuzelt(soket ?? '')
  const iletilen = basliklar['x-forwarded-for']
  if (iletilen && listede(guvenilirVekil, es)) {
    const son = ipDuzelt(iletilen.split(',').at(-1)?.trim() ?? '')
    if (isIP(son)) es = son
  }
  const cf = ipDuzelt(basliklar['cf-connecting-ip'] ?? '')
  if (cf && isIP(cf) && listede(CLOUDFLARE, es)) return cf
  return es || 'bilinmiyor'
}
```

`sunucu/ip.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gercekIp, ipDuzelt, listeKur } from './ip.ts'

const VEKIL = listeKur(['127.0.0.1', '::1'])

test('gercekIp_cloudflareDisindanGelenCfBasligi_yokSayilir', () => {
  assert.equal(gercekIp('1.2.3.4', { 'cf-connecting-ip': '9.9.9.9' }, VEKIL), '1.2.3.4')
})

test('gercekIp_cloudflareAraligindanGelenCfBasligi_gercekIp', () => {
  assert.equal(gercekIp('173.245.50.7', { 'cf-connecting-ip': '9.9.9.9' }, VEKIL), '9.9.9.9')
  assert.equal(gercekIp('2606:4700::1', { 'cf-connecting-ip': '2001:db8::5' }, VEKIL), '2001:db8::5')
})

test('gercekIp_guvenilirVekilArkasinda_xForwardedForSonAdimiEsSayilir', () => {
  const basliklar = { 'x-forwarded-for': '9.9.9.9, 104.16.1.1', 'cf-connecting-ip': '9.9.9.9' }
  assert.equal(gercekIp('127.0.0.1', basliklar, VEKIL), '9.9.9.9')
  assert.equal(gercekIp('::ffff:127.0.0.1', { 'x-forwarded-for': '5.5.5.5' }, VEKIL), '5.5.5.5')
})

test('gercekIp_guvenilmeyenEsinXForwardedFor_yokSayilir', () => {
  const basliklar = { 'x-forwarded-for': '104.16.1.1', 'cf-connecting-ip': '9.9.9.9' }
  assert.equal(gercekIp('8.8.8.8', basliklar, VEKIL), '8.8.8.8')
})

test('gercekIp_bozukBasliklar_esAdresKalir', () => {
  assert.equal(gercekIp('173.245.50.7', { 'cf-connecting-ip': 'abc' }, VEKIL), '173.245.50.7')
  assert.equal(gercekIp(undefined, {}, VEKIL), 'bilinmiyor')
})

test('ipDuzelt_ipv4Eslemeli_duzYazilir', () => {
  assert.equal(ipDuzelt('::ffff:10.0.0.1'), '10.0.0.1')
  assert.equal(ipDuzelt('2001:db8::1'), '2001:db8::1')
})
```

`sunucu/kod.ts`:

```ts
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/*
 * Özetler. Tarayıcı anahtarı 128 bit rastgeledir, düz SHA-256 yeter. Ödül kodu 6 hanedir:
 * sunucu gizli tuzuyla türetilir ve HMAC ile saklanır, veritabanı tek başına kodu vermez.
 */
export function anahtarOzeti(anahtar: string): string {
  return createHash('sha256').update(anahtar, 'utf8').digest('hex')
}

export function odulKodu(tuz: string, donem: string, oyuncuId: number, deneme = 0): string {
  const ozet = createHmac('sha256', tuz).update(`kod:${donem}:${oyuncuId}:${deneme}`).digest()
  return String(ozet.readUInt32BE(0) % 1_000_000).padStart(6, '0')
}

/** Özet döneme bağlı değil: personel yalnız kodu görür ve tek sorguyla bulur. */
export function kodOzeti(tuz: string, kod: string): string {
  return createHmac('sha256', tuz).update(`ozet:${kod}`).digest('hex')
}

export function jetonKimligi(): string {
  return randomBytes(16).toString('hex')
}

/** Sabit zamanlı karşılaştırma; uzunluklar farklıysa da zamanı belli etmez. */
export function esitMi(a: string, b: string): boolean {
  const ao = createHash('sha256').update(a).digest()
  const bo = createHash('sha256').update(b).digest()
  return timingSafeEqual(ao, bo)
}
```

`sunucu/kod.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { anahtarOzeti, esitMi, jetonKimligi, kodOzeti, odulKodu } from './kod.ts'

test('odulKodu_altiHane_ayniGirdiAyniKod_farkliOyuncuFarkli', () => {
  const kod = odulKodu('tuz', '2026-10-05', 1)
  assert.match(kod, /^\d{6}$/)
  assert.equal(odulKodu('tuz', '2026-10-05', 1), kod)
  assert.notEqual(odulKodu('tuz', '2026-10-05', 2), kod)
  assert.notEqual(odulKodu('baska', '2026-10-05', 1), kod)
  assert.notEqual(odulKodu('tuz', '2026-10-05', 1, 1), kod)
})

test('kodOzeti_tuzaBagli_donemdenBagimsiz', () => {
  assert.equal(kodOzeti('t', '123456'), kodOzeti('t', '123456'))
  assert.notEqual(kodOzeti('t', '123456'), kodOzeti('u', '123456'))
})

test('anahtarOzeti_hex64_jetonKimligi_hex32', () => {
  assert.match(anahtarOzeti('x'), /^[0-9a-f]{64}$/)
  assert.match(jetonKimligi(), /^[0-9a-f]{32}$/)
  assert.notEqual(jetonKimligi(), jetonKimligi())
})

test('esitMi_farkliUzunluk_false_ayni_true', () => {
  assert.equal(esitMi('abc', 'abc'), true)
  assert.equal(esitMi('abc', 'abcd'), false)
})
```

`sunucu/suphe.ts`:

```ts
import type { Girdi, Sonuc } from '../lib/oyun/tipler.ts'

/*
 * İnsan olasılığı (spec §9): tam kıvam oranı %95'i aşan ya da makine kadar düzgün zamanlanmış
 * tur işaretlenir, silinmez. Personel yönetim ucundan görür ve sofrada bir tur ister.
 */
export const SUPHE_TAM_KIVAM_ORANI = 0.95
export const SUPHE_EN_AZ_DOKUNUS = 100
/** Dokunuşlar arası aralıkların bu payı aynı değerdeyse elin titremesi yoktur. */
export const SUPHE_DUZENLILIK = 0.6

export function tamKivamSupheli(sonuc: Sonuc): boolean {
  return sonuc.ozet.sis >= 20 && sonuc.ozet.tamKivam / sonuc.ozet.sis > SUPHE_TAM_KIVAM_ORANI
}

export function zamanlamaSupheli(girdiler: readonly Girdi[]): boolean {
  if (girdiler.length < SUPHE_EN_AZ_DOKUNUS) return false
  const sayim = new Map<number, number>()
  for (let i = 1; i < girdiler.length; i++) {
    const aralik = (girdiler[i]?.[0] ?? 0) - (girdiler[i - 1]?.[0] ?? 0)
    if (aralik > 0) sayim.set(aralik, (sayim.get(aralik) ?? 0) + 1)
  }
  const enCok = Math.max(0, ...sayim.values())
  return enCok / (girdiler.length - 1) > SUPHE_DUZENLILIK
}

export function supheliMi(girdiler: readonly Girdi[], sonuc: Sonuc): boolean {
  return tamKivamSupheli(sonuc) || zamanlamaSupheli(girdiler)
}
```

`sunucu/suphe.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ustaOyna } from '../lib/oyun/deneme.ts'
import { simule } from '../lib/oyun/motor.ts'
import type { Girdi, Sonuc } from '../lib/oyun/tipler.ts'
import { supheliMi, tamKivamSupheli, zamanlamaSupheli } from './suphe.ts'

const sonuc = (sis: number, tamKivam: number): Sonuc => ({
  puan: 0,
  ozet: { sofra: 0, sis, tamKivam, enUzunKombo: 0, kalkan: 0 },
  bitti: 'gece',
  tik: 7200,
})

test('tamKivamSupheli_yuzde95Ustu_yirmiSisVeUstu', () => {
  assert.equal(tamKivamSupheli(sonuc(40, 39)), true)
  assert.equal(tamKivamSupheli(sonuc(40, 38)), false)
  assert.equal(tamKivamSupheli(sonuc(10, 10)), false)
})

test('zamanlamaSupheli_sabitAralikliBot_isaretlenir', () => {
  const kayit = ustaOyna(1, 'usta')
  assert.ok(kayit.length >= 100)
  assert.equal(zamanlamaSupheli(kayit), true)
})

test('zamanlamaSupheli_titreyenAraliklar_isaretlenmez', () => {
  const kayit: Girdi[] = []
  let tik = 0
  for (let i = 0; i < 200; i++) {
    tik += 10 + ((i * 7) % 11)
    kayit.push([tik, 's0'])
  }
  assert.equal(zamanlamaSupheli(kayit), false)
})

test('zamanlamaSupheli_yuzDokunusAlti_isaretlenmez', () => {
  const kayit: Girdi[] = Array.from({ length: 50 }, (_, i) => [i * 15, 's0'])
  assert.equal(zamanlamaSupheli(kayit), false)
})

test('supheliMi_ustaBotu_zamanlamadanIsaretlenir', () => {
  const kayit = ustaOyna(1, 'usta')
  assert.equal(supheliMi(kayit, simule(1, kayit)), true)
})
```

`sunucu/yasakli.ts`:

```ts
import { takmaAdKatla } from '../lib/oyun/takmaAd.ts'

/*
 * Yalnız sunucuda: ayrılmış adlar ve ölçülü bir TR/EN küfür listesi (spec §8). Katlanmış ad
 * üstünden bakılır; kısa kökler tam sözcük olarak (Kamil "am" değildir), uzunlar parça olarak.
 */
const AYRILMIS = ['bozo', 'cigercibozo', 'usta', 'admin'].map(takmaAdKatla)

const KISA = ['am', 'amk', 'aq', 'got', 'sik', 'pic', 'oc', 'ibne', 'fuck', 'shit', 'cunt', 'ass', 'dick', 'cock']
const UZUN = ['orospu', 'pezevenk', 'yarak', 'yarrak', 'amcik', 'sikik', 'sikis', 'siktir', 'gavat', 'kahpe',
  'bitch', 'nigger', 'faggot', 'whore', 'pussy', 'penis', 'vagina'].map(takmaAdKatla)

/** Adın katlanmış hali ayrılmışsa, küfür içeriyorsa ya da harfi kalmıyorsa true. */
export function yasakliMi(ad: string): boolean {
  const katlanmis = takmaAdKatla(ad)
  if (katlanmis.length === 0 || AYRILMIS.includes(katlanmis)) return true
  if (UZUN.some((kok) => katlanmis.includes(kok))) return true
  const sozcukler = ad.toLocaleLowerCase('tr').split(/[\s._-]+/).map(takmaAdKatla)
  return sozcukler.some((s) => KISA.includes(s))
}
```

`sunucu/yasakli.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { yasakliMi } from './yasakli.ts'

test('yasakli_ayrilmisAdlar_katlanmisHaliyle', () => {
  for (const ad of ['Bozo', 'B0ZO', 'Ciğerci Bozo', 'cigerci-bozo', 'USTA', 'Admin', '...']) {
    assert.equal(yasakliMi(ad), true, ad)
  }
})

test('yasakli_kufurKokleri_parcaOlarakVeKatlanarak', () => {
  for (const ad of ['0r0spu', 'Pezevenk1', 'yaraaak', 'si.ktir', 'B1tch']) assert.equal(yasakliMi(ad), true, ad)
})

test('yasakli_kisaSozcukler_yalnizTamSozcuk', () => {
  assert.equal(yasakliMi('Am Usta'), true)
  assert.equal(yasakliMi('Kamil'), false)
  assert.equal(yasakliMi('Göt Dede'), true)
  assert.equal(yasakliMi('Gece Kuşu'), false)
})

test('yasakli_sıradanAdlar_serbest', () => {
  for (const ad of ['Ayşe', 'Bozo Fan', 'Usta Ali', 'Ciğerci', 'Gece.Kuşu', 'Tane 12']) {
    assert.equal(yasakliMi(ad), false, ad)
  }
})
```

- [ ] **Step 6: HTTP katmanı ve istek doğrulama**

`sunucu/http.ts`:

```ts
import type { IncomingMessage, ServerResponse } from 'node:http'
import { GOVDE_SINIRI } from '../lib/oyun/aktarim.ts'

/* `node:http` üstündeki ince katman: gövde sınırı, JSON, CORS, kimlik başlıkları. */

export class IstekHatasi extends Error {
  durum: number
  kod: string
  constructor(durum: number, kod: string) {
    super(kod)
    this.durum = durum
    this.kod = kod
  }
}

export type Istek = {
  yontem: string
  yol: string
  sorgu: URLSearchParams
  basliklar: IncomingMessage['headers']
  ip: string
  govde(): Promise<unknown>
}

export type Yanit = { durum: number; govde?: unknown; basliklar?: Record<string, string> }

/** Gövdeyi en çok `sinir` bayt okur (spec §9: 64 KB); aşarsa okumayı durdurur ve 413 döner. */
export function govdeOku(req: IncomingMessage, sinir = GOVDE_SINIRI): Promise<unknown> {
  return new Promise((coz, reddet) => {
    const parcalar: Buffer[] = []
    let toplam = 0
    req.on('data', (parca: Buffer) => {
      toplam += parca.length
      if (toplam > sinir) {
        req.pause()
        reddet(new IstekHatasi(413, 'govdeBuyuk'))
        return
      }
      parcalar.push(parca)
    })
    req.on('end', () => {
      const metin = Buffer.concat(parcalar).toString('utf8')
      if (metin.trim() === '') return coz(null)
      try {
        coz(JSON.parse(metin))
      } catch {
        reddet(new IstekHatasi(400, 'bozukJson'))
      }
    })
    req.on('error', () => reddet(new IstekHatasi(400, 'govdeOkunamadi')))
  })
}

/** CORS yalnız izinli kökene (spec §10); izinli değilse başlık yazılmaz ve tarayıcı yanıtı okuyamaz. */
export function corsBasliklari(koken: string | undefined, izinliler: readonly string[]): Record<string, string> {
  if (!koken || !izinliler.includes(koken)) return {}
  return {
    'Access-Control-Allow-Origin': koken,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  }
}

export function yanitYaz(res: ServerResponse, yanit: Yanit, ek: Record<string, string>): void {
  const basliklar: Record<string, string> = {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...ek,
    ...yanit.basliklar,
  }
  // Okunmamış gövde kalan bağlantı yeniden kullanılmaz.
  if (yanit.durum === 413) basliklar.Connection = 'close'
  if (yanit.govde === undefined) {
    res.writeHead(yanit.durum, basliklar)
    res.end()
    return
  }
  const metin = JSON.stringify(yanit.govde)
  res.writeHead(yanit.durum, { ...basliklar, 'Content-Type': 'application/json; charset=utf-8' })
  res.end(metin)
}

export function bearer(yetki: string | undefined): string | null {
  const es = /^Bearer\s+([0-9a-f]{32})$/i.exec(yetki ?? '')
  return es?.[1]?.toLowerCase() ?? null
}

export function temelKimlik(yetki: string | undefined): { kullanici: string; sifre: string } | null {
  const es = /^Basic\s+([A-Za-z0-9+/=]+)$/.exec(yetki ?? '')
  if (!es?.[1]) return null
  const [kullanici, ...sifre] = Buffer.from(es[1], 'base64').toString('utf8').split(':')
  if (!kullanici || sifre.length === 0) return null
  return { kullanici, sifre: sifre.join(':') }
}
```

`sunucu/http.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bearer, corsBasliklari, temelKimlik } from './http.ts'

test('corsBasliklari_yalnizIzinliKoken', () => {
  const koken = 'https://cigercibozo.com'
  const izinli = [koken]
  assert.equal(corsBasliklari(koken, izinli)['Access-Control-Allow-Origin'], koken)
  assert.deepEqual(corsBasliklari('https://kotu.example', izinli), {})
  assert.deepEqual(corsBasliklari(undefined, izinli), {})
})

test('bearer_hex32_kucukHarfeCevrilir_digerleriNull', () => {
  assert.equal(bearer(`Bearer ${'AB'.repeat(16)}`), 'ab'.repeat(16))
  assert.equal(bearer('Bearer kisa'), null)
  assert.equal(bearer(undefined), null)
  assert.equal(bearer('Basic abc'), null)
})

test('temelKimlik_base64Cozer_ikiNoktaliSifre_bozukNull', () => {
  const yetki = `Basic ${Buffer.from('personel:gizli:sifre').toString('base64')}`
  assert.deepEqual(temelKimlik(yetki), { kullanici: 'personel', sifre: 'gizli:sifre' })
  assert.equal(temelKimlik(`Basic ${Buffer.from('sifresiz').toString('base64')}`), null)
  assert.equal(temelKimlik('Bearer x'), null)
})
```

`sunucu/dogrulama.ts`:

```ts
import {
  ANAHTAR_HEX,
  EN_COK_DOKUNUS,
  KANALLAR,
  ONAY_SURUMU,
  type Kanal,
  type OyuncuIstegi,
} from '../lib/oyun/aktarim.ts'
import { takmaAdBicimiGecerliMi } from '../lib/oyun/takmaAd.ts'
import type { Girdi } from '../lib/oyun/tipler.ts'
import { IstekHatasi } from './http.ts'

/* İstek gövdelerinin sınır denetimi (spec §9). Simülasyonun kendi denetimi `simule` içinde kalır. */

const nesne = (govde: unknown): Record<string, unknown> => {
  if (typeof govde !== 'object' || govde === null || Array.isArray(govde)) throw new IstekHatasi(400, 'govdeGecersiz')
  return govde as Record<string, unknown>
}

export function kanalCoz(govde: unknown): Kanal {
  const { kanal } = nesne(govde)
  const bulunan = KANALLAR.find((k) => k === kanal)
  if (!bulunan) throw new IstekHatasi(400, 'kanalGecersiz')
  return bulunan
}

export function oyuncuIstegiCoz(govde: unknown): OyuncuIstegi {
  const { takmaAd, anahtar, onaySurumu } = nesne(govde)
  if (typeof anahtar !== 'string' || !new RegExp(`^[0-9a-f]{${ANAHTAR_HEX}}$`).test(anahtar)) {
    throw new IstekHatasi(400, 'anahtarGecersiz')
  }
  if (onaySurumu !== ONAY_SURUMU) throw new IstekHatasi(400, 'onaySurumuEski')
  if (typeof takmaAd !== 'string' || !takmaAdBicimiGecerliMi(takmaAd)) throw new IstekHatasi(422, 'takmaAdKullanilamaz')
  return { takmaAd, anahtar, onaySurumu }
}

/** Dizi, en çok 1.200 dokunuş, hedef başına tikte en çok bir; öğelerin kalan denetimi `simule`de. */
export function girdileriCoz(govde: unknown): Girdi[] {
  const { girdiler } = nesne(govde)
  if (!Array.isArray(girdiler)) throw new IstekHatasi(400, 'girdilerGecersiz')
  if (girdiler.length > EN_COK_DOKUNUS) throw new IstekHatasi(422, 'cokDokunus')
  const ayniTik = new Set<string>()
  let oncekiTik = -1
  for (const girdi of girdiler) {
    if (!Array.isArray(girdi) || girdi.length !== 2) throw new IstekHatasi(422, 'girdilerGecersiz')
    const [tik, hedef] = girdi as [unknown, unknown]
    if (typeof tik !== 'number' || typeof hedef !== 'string') throw new IstekHatasi(422, 'girdilerGecersiz')
    if (tik !== oncekiTik) ayniTik.clear()
    if (ayniTik.has(hedef)) throw new IstekHatasi(422, 'ayniTikteAyniHedef')
    ayniTik.add(hedef)
    oncekiTik = tik
  }
  return girdiler as Girdi[]
}
```

`sunucu/dogrulama.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ONAY_SURUMU } from '../lib/oyun/aktarim.ts'
import { girdileriCoz, kanalCoz, oyuncuIstegiCoz } from './dogrulama.ts'
import { IstekHatasi } from './http.ts'

const hata = (kod: string) => (h: unknown) => h instanceof IstekHatasi && h.kod === kod

test('kanalCoz_dortKanal_gecerli_digerleri400', () => {
  for (const kanal of ['sofra', 'ig', 'site', 'yok']) assert.equal(kanalCoz({ kanal }), kanal)
  assert.throws(() => kanalCoz({ kanal: 'tiktok' }), hata('kanalGecersiz'))
  assert.throws(() => kanalCoz(null), hata('govdeGecersiz'))
  assert.throws(() => kanalCoz([]), hata('govdeGecersiz'))
})

test('oyuncuIstegiCoz_anahtarHex32_onaySurumu_takmaAdBicimi', () => {
  const anahtar = 'ab'.repeat(16)
  const gecerli = { takmaAd: 'Ayşe', anahtar, onaySurumu: ONAY_SURUMU }
  assert.deepEqual(oyuncuIstegiCoz(gecerli), gecerli)
  assert.throws(() => oyuncuIstegiCoz({ ...gecerli, anahtar: 'kisa' }), hata('anahtarGecersiz'))
  assert.throws(() => oyuncuIstegiCoz({ takmaAd: 'Ayşe', anahtar, onaySurumu: 'eski' }), hata('onaySurumuEski'))
  assert.throws(() => oyuncuIstegiCoz({ takmaAd: 'A', anahtar, onaySurumu: ONAY_SURUMU }), hata('takmaAdKullanilamaz'))
  assert.throws(() => oyuncuIstegiCoz({ takmaAd: 7, anahtar, onaySurumu: ONAY_SURUMU }), hata('takmaAdKullanilamaz'))
})

test('girdileriCoz_diziSiniri_ayniTikteAyniHedef_bicim', () => {
  assert.deepEqual(girdileriCoz({ girdiler: [[0, 's0'], [0, 's1'], [5, 's0']] }), [[0, 's0'], [0, 's1'], [5, 's0']])
  assert.deepEqual(girdileriCoz({ girdiler: [] }), [])
  assert.throws(() => girdileriCoz({}), hata('girdilerGecersiz'))
  assert.throws(() => girdileriCoz({ girdiler: Array.from({ length: 1201 }, (_, i) => [i, 's0']) }), hata('cokDokunus'))
  assert.throws(() => girdileriCoz({ girdiler: [[3, 's0'], [3, 's0']] }), hata('ayniTikteAyniHedef'))
  assert.throws(() => girdileriCoz({ girdiler: [[3, 's0', 'x']] }), hata('girdilerGecersiz'))
  assert.throws(() => girdileriCoz({ girdiler: [['3', 's0']] }), hata('girdilerGecersiz'))
  assert.throws(() => girdileriCoz({ girdiler: [null] }), hata('girdilerGecersiz'))
})

test('girdileriCoz_binIkiYuzDokunus_sinirdaGecer', () => {
  const girdiler = Array.from({ length: 1200 }, (_, i) => [i, 's0'])
  assert.equal(girdileriCoz({ girdiler }).length, 1200)
})
```

- [ ] **Step 7: Test ve tip denetimi**

Run: `node --test sunucu/*.test.ts && npm run typecheck && npx tsc -p sunucu/tsconfig.json --noEmit`
Expected: `ℹ pass 47`, `ℹ fail 0`, `ℹ skipped 0` (bu adımda MariaDB testi henüz yok); iki tip
denetimi temiz. `node --test sunucu/` (dizin argümanı) çalışmaz, dosya listesi ya da bare
`npm test` gerekir.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .gitignore sunucu/package.json sunucu/tsconfig.json \
  sunucu/depo.ts sunucu/bellekDepo.ts sunucu/bellekDepo.test.ts sunucu/depoSozlesmesi.ts \
  sunucu/siralama.ts sunucu/siralama.test.ts sunucu/donem.ts sunucu/donem.test.ts \
  sunucu/hiz.ts sunucu/hiz.test.ts sunucu/ip.ts sunucu/ip.test.ts sunucu/kod.ts sunucu/kod.test.ts \
  sunucu/suphe.ts sunucu/suphe.test.ts sunucu/yasakli.ts sunucu/yasakli.test.ts \
  sunucu/http.ts sunucu/http.test.ts sunucu/dogrulama.ts sunucu/dogrulama.test.ts
git commit -m "Add the score server core with an in-memory store"
```

---

### Task 3: Uçlar, yönetim uçları, zamanlanmış işler, giriş noktası

**Files:**
- Create: `sunucu/isler.ts`, `sunucu/uclar.ts`, `sunucu/yonetim.ts`, `sunucu/uygulama.ts`,
  `sunucu/ana.ts`
- Test: `sunucu/isler.test.ts`, `sunucu/uygulama.test.ts`

**Interfaces:**
- Consumes: Task 2'nin tamamı; `simule` (`motor.ts`), `tavan`, `rastgeleTohum`, `TIK_MS`
  (`zamanlayici.ts`), `takmaAdKatla`.
- Produces:
  - `isler.ts`: `KOD_GECERLILIK_MS`, `GIRDI_SAKLAMA_MS`, `OYUNCU_SAKLAMA_MS`,
    `SAMPIYON_SAKLAMA_MS`, `KORUNAN_TUR = 20`, `ODUL_SAYISI = 3`,
    `donemleriKapat(depo, tuz, simdi): Promise<string[]>`,
    `suresiDolaniSil(depo, simdi, kampanyaBitis)`, `islerKur(depo, tuz, kampanyaBitis): Isler`.
  - `uclar.ts`: `TABLO_ONBELLEK_MS`, `onbellekKur<T>(sureMs)`, `Baglam`, `turAl`, `oyuncuOl`,
    `turBitir`, `tabloAl`, `benAl`, `hesabiSil` (hepsi `(b: Baglam, istek, ...) => Promise<Yanit>`).
  - `yonetim.ts`: `YonetimKimligi`, `yonetimDenetle`, `yonetimSiralama`, `yonetimTur`,
    `yonetimKod`, `yonetimGizle`, `yonetimSayac`.
  - `uygulama.ts`: `Ayar { kokenler, tuz, yonetim, guvenilirVekil, kampanyaBitis }`, `Gunluk`,
    `Uygulama { isle(req, res), isler, temizle(simdi) }`,
    `uygulamaKur(depo, ayar, simdi = Date.now, gunluk = console)`.
  - `ana.ts`: ortam değişkenlerini okur, sunucuyu dinletir, dakikalık zamanlayıcı, SIGTERM.

Uç tablosu (spec §10) ve hata kodları (`{ hata }` gövdesi):

| Uç | Başarı | Ret |
|---|---|---|
| `POST /tur` `{ kanal }` | 201 `{ turId, tohum, sonaErme }` | 400 `kanalGecersiz` |
| `POST /oyuncu` `{ takmaAd, anahtar, onaySurumu }` | 201 `{ takmaAd }` | 400 `anahtarGecersiz`/`onaySurumuEski`, 409 `zatenKayitli`, 422 `takmaAdKullanilamaz` |
| `POST /tur/:id/bitir` `{ girdiler }`, `Authorization: Bearer <anahtar>` | 200 `{ puan, ozet, bitti, tik, hafta, buTurEnIyi }` | 401 `anahtarYok`/`oyuncuYok`, 404 `jetonYok`, 409 `jetonKullanildi`, 410 `jetonSuresiDoldu`, 413 `govdeBuyuk`, 422 `cokDokunus`/`ayniTikteAyniHedef`/`girdilerGecersiz`/`cokHizli`/`tavanUstu`, 429 `cokTur` |
| `GET /tablo` | 200 `{ donem, bitis, hafta[10], tumZamanlar[3], sonSampiyon }`, `Cache-Control: public, max-age=20` | |
| `GET /ben` | 200 `{ takmaAd, hafta, odul }` | 401 |
| `DELETE /oyuncu` | 204 | 401 |
| `GET /yonetim/siralama?donem=` | 200 `{ donem, satirlar[20], kazananlar }` | 401 `kimlikGerekli`, 503 `yonetimKapali` |
| `GET /yonetim/tur/:id` | 200 tur (`girdiler` ya da null) | 404 `turYok` |
| `POST /yonetim/kod` `{ kod }` | 200 `{ sira, donem, takmaAd, puan }` | 400 `kodGecersiz`, 404 `kodYok`, 409 `kodKullanildi`, 410 `kodSuresiDoldu` |
| `POST /yonetim/oyuncu/:id/gizle` `{ gizli }` | 204 | 404 `oyuncuYok` |
| `GET /yonetim/sayac?gun=` | 200 `{ gun, sofra, ig, site, yok }` | |
| her yol | | 404 `yolYok`, 405 `yontemYok`, 429 `cokIstek`, 500 `sunucu` |

- [ ] **Step 1: İşler ve testi**

`sunucu/isler.ts`:

```ts
import type { Depo } from './depo.ts'
import { donemAnahtari, girneGunu } from './donem.ts'
import { kodOzeti, odulKodu } from './kod.ts'
import { enIyiler } from './siralama.ts'

/*
 * Zamanlanmış işler (spec §7, §8): dönem kapanışı ve ödül kodları, gece silme. Sunucunun kendi
 * zamanlayıcısından dakikada bir çağrılır; her adım tekrar çalıştırılabilir.
 */
const GUN_MS = 24 * 60 * 60_000
export const KOD_GECERLILIK_MS = 14 * GUN_MS
export const GIRDI_SAKLAMA_MS = 30 * GUN_MS
export const OYUNCU_SAKLAMA_MS = 90 * GUN_MS
export const SAMPIYON_SAKLAMA_MS = 90 * GUN_MS
export const KORUNAN_TUR = 20
export const ODUL_SAYISI = 3

/** Bir dönemin ilk üçüne kod üretir; aynı özet başka dönemden çıkmışsa deneme sayacı artar. */
async function kazananlariYaz(depo: Depo, tuz: string, donem: string, simdi: number): Promise<void> {
  const sirali = enIyiler(await depo.siralama(donem))
  for (const [i, satir] of sirali.slice(0, ODUL_SAYISI).entries()) {
    for (let deneme = 0; deneme < 10; deneme++) {
      const ozet = kodOzeti(tuz, odulKodu(tuz, donem, satir.oyuncuId, deneme))
      if (await depo.kazananBul(ozet)) continue
      await depo.kazananEkle({
        donem,
        sira: i + 1,
        oyuncuId: satir.oyuncuId,
        takmaAd: satir.takmaAd,
        puan: satir.puan,
        kodOzeti: ozet,
        deneme,
        gecerlilik: simdi + KOD_GECERLILIK_MS,
      })
      break
    }
  }
}

/** Bitişi geçmiş her açık dönemi kapatır; kapananların anahtarlarını döner. */
export async function donemleriKapat(depo: Depo, tuz: string, simdi: number): Promise<string[]> {
  const kapananlar: string[] = []
  for (const donem of await depo.acikDonemler()) {
    if (donem.bitis > simdi) continue
    await kazananlariYaz(depo, tuz, donem.anahtar, simdi)
    await depo.donemKapat(donem.anahtar, simdi)
    kapananlar.push(donem.anahtar)
  }
  return kapananlar
}

/** Spec §8 saklama tablosu: ilk 20 dışı kayıt, 30 günlük kayıt, 90 günlük oyuncu, kampanya sonrası şampiyonlar. */
export async function suresiDolaniSil(depo: Depo, simdi: number, kampanyaBitis: number | null): Promise<void> {
  await depo.suresiDolanJetonlariSil(simdi)
  const donem = donemAnahtari(new Date(simdi))
  const korunan = (await depo.siralama(donem)).slice(0, KORUNAN_TUR).map((s) => s.turId)
  await depo.girdileriKirp(donem, korunan)
  await depo.eskiGirdileriSil(simdi - GIRDI_SAKLAMA_MS)
  await depo.eskiOyunculariSil(simdi - OYUNCU_SAKLAMA_MS)
  if (kampanyaBitis !== null && simdi > kampanyaBitis + SAMPIYON_SAKLAMA_MS) await depo.kazananlariSil()
}

export type Isler = { calistir(simdi: number): Promise<string[]> }

/** Dakikalık tik: kapanış her seferinde denetlenir, silme Girne'de gün değişince bir kez koşar. */
export function islerKur(depo: Depo, tuz: string, kampanyaBitis: number | null): Isler {
  let sonSilmeGunu: string | null = null
  return {
    async calistir(simdi) {
      const kapananlar = await donemleriKapat(depo, tuz, simdi)
      const gun = girneGunu(new Date(simdi))
      if (gun !== sonSilmeGunu) {
        await suresiDolaniSil(depo, simdi, kampanyaBitis)
        sonSilmeGunu = gun
      }
      return kapananlar
    },
  }
}
```

`sunucu/isler.test.ts`:

```ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bellekDepoKur } from './bellekDepo.ts'
import type { Depo, YeniTur } from './depo.ts'
import {
  donemleriKapat,
  GIRDI_SAKLAMA_MS,
  islerKur,
  OYUNCU_SAKLAMA_MS,
  SAMPIYON_SAKLAMA_MS,
  suresiDolaniSil,
} from './isler.ts'
import { kodOzeti, odulKodu } from './kod.ts'

const TUZ = 'test-tuzu'
const GUN = 24 * 60 * 60_000
/* 5 Ekim 2026 Pazartesi 05:00 Girne = 02:00Z; dönem 12 Ekim 02:00Z'de biter. */
const BAS = Date.parse('2026-10-05T02:00:00Z')
const BIT = Date.parse('2026-10-12T02:00:00Z')
const DONEM = '2026-10-05'

async function oyuncu(depo: Depo, ad: string, simdi = BAS) {
  const kayit = { anahtarOzeti: `oz-${ad}`, takmaAd: ad, adKatlanmis: ad.toLowerCase(), onaySurumu: 's', simdi }
  const o = await depo.oyuncuEkle(kayit)
  if (o === 'adKullanimda') throw new Error(ad)
  return o.id
}

async function tur(depo: Depo, oyuncuId: number, puan: number, olusturma: number, donem = DONEM): Promise<number> {
  const t: YeniTur = {
    jetonId: `${oyuncuId}-${puan}-${olusturma}`, oyuncuId, donem, tohum: 1, puan,
    ozet: { sofra: 1, sis: 1, tamKivam: 0, enUzunKombo: 1, kalkan: 0 },
    bitti: 'gece', tik: 7200, kanal: 'yok', supheli: false, girdiler: [[0, 's0']], olusturma,
  }
  return depo.turEkle(t)
}

const jeton = (harf: string) => ({
  id: harf.repeat(32), tohum: 1, kanal: 'yok' as const, olusturma: BAS, sonaErme: BAS + 1, kullanildi: false,
})

async function haftaKur(depo: Depo) {
  await depo.donemKaydet({ anahtar: DONEM, baslangic: BAS, bitis: BIT, kapanis: null })
  const [a, b, c, d] = await Promise.all([oyuncu(depo, 'A'), oyuncu(depo, 'B'), oyuncu(depo, 'C'), oyuncu(depo, 'D')])
  await tur(depo, a, 900, BAS + 1)
  await tur(depo, a, 950, BAS + 2)
  await tur(depo, b, 800, BAS + 3)
  await tur(depo, c, 700, BAS + 4)
  await tur(depo, d, 600, BAS + 5)
  return { a, b, c, d }
}

test('donemleriKapat_bitisGecmemis_kapatmaz', async () => {
  const depo = bellekDepoKur()
  await haftaKur(depo)
  assert.deepEqual(await donemleriKapat(depo, TUZ, BIT - 1), [])
  assert.equal((await depo.kazananlar(DONEM)).length, 0)
})

test('donemleriKapat_ilkUcKisiyeBirerKod_kodOzetiBulunur_ikinciKosuTekrarEtmez', async () => {
  const depo = bellekDepoKur()
  const { a, b, c } = await haftaKur(depo)
  assert.deepEqual(await donemleriKapat(depo, TUZ, BIT), [DONEM])
  const kazananlar = await depo.kazananlar(DONEM)
  assert.deepEqual(kazananlar.map((k) => [k.sira, k.oyuncuId, k.puan]), [[1, a, 950], [2, b, 800], [3, c, 700]])
  assert.equal(kazananlar[0]?.gecerlilik, BIT + 14 * GUN)
  const kod = odulKodu(TUZ, DONEM, a, 0)
  assert.equal((await depo.kazananBul(kodOzeti(TUZ, kod)))?.sira, 1)
  assert.deepEqual(await donemleriKapat(depo, TUZ, BIT + 1), [])
  assert.equal((await depo.kazananlar(DONEM)).length, 3)
})

/** Milyonda bir: aynı özet başka dönemden çıkmışsa deneme sayacı artar, `/ben` aynı sayaçla türetir. */
test('donemleriKapat_kodOzetiCakisirsa_denemeSayaciArtar', async () => {
  const depo = bellekDepoKur()
  const { a } = await haftaKur(depo)
  const cakisan = kodOzeti(TUZ, odulKodu(TUZ, DONEM, a, 0))
  const eski = { donem: '2026-09-28', sira: 1, oyuncuId: a, takmaAd: 'A', puan: 1, deneme: 0, gecerlilik: BAS }
  await depo.kazananEkle({ ...eski, kodOzeti: cakisan })
  await donemleriKapat(depo, TUZ, BIT)
  const birinci = (await depo.kazananlar(DONEM))[0]
  assert.equal(birinci?.deneme, 1)
  assert.equal(birinci?.kodOzeti, kodOzeti(TUZ, odulKodu(TUZ, DONEM, a, 1)))
})

test('suresiDolaniSil_ilkYirmiDisiGirdiler_otuzGunlukGirdiler_doksanGunlukOyuncular', async () => {
  const depo = bellekDepoKur()
  const { a, d } = await haftaKur(depo)
  const eskiDonem = '2026-08-03'
  const eskiBitis = BAS - 8 * 7 * GUN
  await depo.donemKaydet({ anahtar: eskiDonem, baslangic: eskiBitis - 7 * GUN, bitis: eskiBitis, kapanis: eskiBitis })
  const eskiTur = await tur(depo, a, 10, BAS - 8 * 7 * GUN, eskiDonem)
  const sessiz = await oyuncu(depo, 'Sessiz', BAS - OYUNCU_SAKLAMA_MS - GUN)
  for (let i = 0; i < 22; i++) await tur(depo, d, 1000 + i, BAS + 100 + i)
  const simdi = BAS + GIRDI_SAKLAMA_MS + 7 * GUN
  await suresiDolaniSil(depo, simdi, null)
  assert.equal((await depo.turBul(eskiTur))?.girdiler, null, '30 günü geçen dönemin kaydı silinir')
  assert.equal(await depo.oyuncuBul('oz-Sessiz'), null, '90 gün etkinliksiz oyuncu silinir')
  assert.equal(sessiz > 0, true)
  const buHafta = await depo.siralama(DONEM)
  assert.equal(buHafta.length, 4)
})

test('suresiDolaniSil_kampanyaBitisindenDoksanGunSonra_sampiyonlarSilinir', async () => {
  const depo = bellekDepoKur()
  await haftaKur(depo)
  await donemleriKapat(depo, TUZ, BIT)
  await suresiDolaniSil(depo, BIT + SAMPIYON_SAKLAMA_MS, BIT)
  assert.equal((await depo.kazananlar(DONEM)).length, 3)
  await suresiDolaniSil(depo, BIT + SAMPIYON_SAKLAMA_MS + 1, BIT)
  assert.equal((await depo.kazananlar(DONEM)).length, 0)
})

test('islerKur_calistir_kapanisHerSeferinde_silmeGundeBirKez', async () => {
  const depo = bellekDepoKur()
  await haftaKur(depo)
  await depo.jetonEkle(jeton('j'))
  const isler = islerKur(depo, TUZ, null)
  assert.deepEqual(await isler.calistir(BAS + 10 * 60_000), [])
  assert.equal(await depo.jetonBul('j'.repeat(32)), null, 'ilk koşu günün silmesini yapar')
  await depo.jetonEkle(jeton('k'))
  await isler.calistir(BAS + 11 * 60_000)
  assert.notEqual(await depo.jetonBul('k'.repeat(32)), null, 'aynı gün ikinci koşu silmez')
  assert.deepEqual(await isler.calistir(BIT), [DONEM])
  assert.equal(await depo.jetonBul('k'.repeat(32)), null, 'gün değişince siler')
})
```

- [ ] **Step 2: Herkese açık uçlar**

`sunucu/uclar.ts`:

```ts
import {
  JETON_SURESI_MS,
  SURE_PAYI_MS,
  type BenYaniti,
  type BitirYaniti,
  type JetonYaniti,
  type OyuncuYaniti,
  type Sampiyon,
  type TabloYaniti,
} from '../lib/oyun/aktarim.ts'
import { simule } from '../lib/oyun/motor.ts'
import { takmaAdKatla } from '../lib/oyun/takmaAd.ts'
import { tavan } from '../lib/oyun/tavan.ts'
import type { Girdi, Sonuc } from '../lib/oyun/tipler.ts'
import { rastgeleTohum } from '../lib/oyun/tohum.ts'
import { TIK_MS } from '../lib/oyun/zamanlayici.ts'
import type { Depo, Jeton, Kazanan, Oyuncu } from './depo.ts'
import { girdileriCoz, kanalCoz, oyuncuIstegiCoz } from './dogrulama.ts'
import { donemAnahtari, donemBaslangici, donemBitisi, girneGunu } from './donem.ts'
import type { HizSiniri } from './hiz.ts'
import { bearer, IstekHatasi, type Istek, type Yanit } from './http.ts'
import { KORUNAN_TUR } from './isler.ts'
import { anahtarOzeti, jetonKimligi, odulKodu } from './kod.ts'
import { enIyiler, oyuncununSirasi, tabloSatirlari } from './siralama.ts'
import { supheliMi } from './suphe.ts'
import { yasakliMi } from './yasakli.ts'

/* Herkese açık uçlar (spec §10). Sunucu iddia edilen skoru okumaz; turu kendisi oynatır (§9). */

export const TABLO_ONBELLEK_MS = 20_000

export type Onbellek<T> = { al(simdi: number, uret: () => Promise<T>): Promise<T>; bosalt(): void }

export function onbellekKur<T>(sureMs: number): Onbellek<T> {
  let kayit: { zaman: number; deger: T } | null = null
  return {
    async al(simdi, uret) {
      if (kayit && simdi - kayit.zaman < sureMs) return kayit.deger
      const deger = await uret()
      kayit = { zaman: simdi, deger }
      return deger
    },
    bosalt() {
      kayit = null
    },
  }
}

export type Baglam = {
  depo: Depo
  tuz: string
  simdi: () => number
  oyuncuSiniri: HizSiniri
  tablo: Onbellek<TabloYaniti>
}

export async function turAl(b: Baglam, istek: Istek): Promise<Yanit> {
  const kanal = kanalCoz(await istek.govde())
  const simdi = b.simdi()
  const jeton: Jeton = {
    id: jetonKimligi(),
    tohum: rastgeleTohum(),
    kanal,
    olusturma: simdi,
    sonaErme: simdi + JETON_SURESI_MS,
    kullanildi: false,
  }
  await b.depo.jetonEkle(jeton)
  await b.depo.sayacArtir(girneGunu(new Date(simdi)), kanal)
  const govde: JetonYaniti = { turId: jeton.id, tohum: jeton.tohum, sonaErme: new Date(jeton.sonaErme).toISOString() }
  return { durum: 201, govde }
}

async function oyuncuyuBul(b: Baglam, istek: Istek): Promise<Oyuncu> {
  const anahtar = bearer(istek.basliklar.authorization)
  if (!anahtar) throw new IstekHatasi(401, 'anahtarYok')
  const oyuncu = await b.depo.oyuncuBul(anahtarOzeti(anahtar))
  if (!oyuncu) throw new IstekHatasi(401, 'oyuncuYok')
  return oyuncu
}

/** Her ret aynı nötr kodla döner (spec §8): biçim, yasaklı liste ve kullanımda olan ad ayırt edilmez. */
export async function oyuncuOl(b: Baglam, istek: Istek): Promise<Yanit> {
  const { takmaAd, anahtar, onaySurumu } = oyuncuIstegiCoz(await istek.govde())
  const ozet = anahtarOzeti(anahtar)
  if (await b.depo.oyuncuBul(ozet)) throw new IstekHatasi(409, 'zatenKayitli')
  if (yasakliMi(takmaAd)) throw new IstekHatasi(422, 'takmaAdKullanilamaz')
  const sonuc = await b.depo.oyuncuEkle({
    anahtarOzeti: ozet,
    takmaAd,
    adKatlanmis: takmaAdKatla(takmaAd),
    onaySurumu,
    simdi: b.simdi(),
  })
  if (sonuc === 'adKullanimda') throw new IstekHatasi(422, 'takmaAdKullanilamaz')
  const govde: OyuncuYaniti = { takmaAd: sonuc.takmaAd }
  return { durum: 201, govde }
}

/** Jeton önce yakılır: ret yiyen kayıt bekleyip yeniden gönderilemez (duvar saati kuralı). */
async function jetonuYak(b: Baglam, id: string, simdi: number): Promise<Jeton> {
  const jeton = await b.depo.jetonBul(id)
  if (!jeton) throw new IstekHatasi(404, 'jetonYok')
  if (jeton.kullanildi) throw new IstekHatasi(409, 'jetonKullanildi')
  if (jeton.sonaErme < simdi) throw new IstekHatasi(410, 'jetonSuresiDoldu')
  if (!(await b.depo.jetonKullan(id))) throw new IstekHatasi(409, 'jetonKullanildi')
  return jeton
}

function oynat(jeton: Jeton, girdiler: readonly Girdi[], simdi: number): Sonuc {
  let sonuc: Sonuc
  try {
    sonuc = simule(jeton.tohum, girdiler)
  } catch (hata) {
    if (hata instanceof RangeError) throw new IstekHatasi(422, 'girdilerGecersiz')
    throw hata
  }
  if (simdi - jeton.olusturma < sonuc.tik * TIK_MS - SURE_PAYI_MS) throw new IstekHatasi(422, 'cokHizli')
  if (sonuc.puan > tavan(jeton.tohum)) throw new IstekHatasi(422, 'tavanUstu')
  return sonuc
}

async function turuKaydet(b: Baglam, oyuncu: Oyuncu, jeton: Jeton, girdiler: Girdi[], sonuc: Sonuc, simdi: number) {
  const an = new Date(simdi)
  const donem = donemAnahtari(an)
  await b.depo.donemKaydet({
    anahtar: donem,
    baslangic: donemBaslangici(an).getTime(),
    bitis: donemBitisi(an).getTime(),
    kapanis: null,
  })
  const turId = await b.depo.turEkle({
    jetonId: jeton.id,
    oyuncuId: oyuncu.id,
    donem,
    tohum: jeton.tohum,
    puan: sonuc.puan,
    ozet: sonuc.ozet,
    bitti: sonuc.bitti,
    tik: sonuc.tik,
    kanal: jeton.kanal,
    supheli: supheliMi(girdiler, sonuc),
    girdiler,
    olusturma: simdi,
  })
  const sirali = enIyiler(await b.depo.siralama(donem))
  await b.depo.girdileriKirp(donem, sirali.slice(0, KORUNAN_TUR).map((s) => s.turId))
  b.tablo.bosalt()
  return { turId, sirali }
}

export async function turBitir(b: Baglam, istek: Istek, turId: string): Promise<Yanit> {
  const oyuncu = await oyuncuyuBul(b, istek)
  const simdi = b.simdi()
  if (!b.oyuncuSiniri.izinVar(String(oyuncu.id), simdi)) throw new IstekHatasi(429, 'cokTur')
  const jeton = await jetonuYak(b, turId, simdi)
  const girdiler = girdileriCoz(await istek.govde())
  const sonuc = oynat(jeton, girdiler, simdi)
  const { turId: yeniTurId, sirali } = await turuKaydet(b, oyuncu, jeton, girdiler, sonuc, simdi)
  const hafta = oyuncununSirasi(sirali, oyuncu.id)
  if (!hafta) throw new Error(`kaydedilen tur sıralamada yok: ${yeniTurId}`)
  const govde: BitirYaniti = {
    puan: sonuc.puan,
    ozet: sonuc.ozet,
    bitti: sonuc.bitti,
    tik: sonuc.tik,
    hafta,
    buTurEnIyi: sirali.find((s) => s.oyuncuId === oyuncu.id)?.turId === yeniTurId,
  }
  return { durum: 200, govde }
}

const sampiyonOku = (k: Kazanan | null): Sampiyon | null =>
  k ? { takmaAd: k.gizli ? null : k.takmaAd, puan: k.puan, donem: k.donem } : null

export async function tabloAl(b: Baglam): Promise<Yanit> {
  const govde = await b.tablo.al(b.simdi(), async () => {
    const an = new Date(b.simdi())
    const donem = donemAnahtari(an)
    const [hafta, tum, sampiyon] = await Promise.all([
      b.depo.siralama(donem),
      b.depo.tumZamanlar(3),
      b.depo.sonSampiyon(),
    ])
    return {
      donem,
      bitis: donemBitisi(an).toISOString(),
      hafta: tabloSatirlari(enIyiler(hafta), 10),
      tumZamanlar: tabloSatirlari(tum, 3),
      sonSampiyon: sampiyonOku(sampiyon),
    }
  })
  return { durum: 200, govde, basliklar: { 'Cache-Control': `public, max-age=${TABLO_ONBELLEK_MS / 1000}` } }
}

export async function benAl(b: Baglam, istek: Istek): Promise<Yanit> {
  const oyuncu = await oyuncuyuBul(b, istek)
  const simdi = b.simdi()
  const hafta = oyuncununSirasi(enIyiler(await b.depo.siralama(donemAnahtari(new Date(simdi)))), oyuncu.id)
  const kazanan = await b.depo.oyuncununOdulu(oyuncu.id)
  const odul =
    kazanan && kazanan.gecerlilik >= simdi
      ? {
          kod: odulKodu(b.tuz, kazanan.donem, oyuncu.id, kazanan.deneme),
          sira: kazanan.sira,
          donem: kazanan.donem,
          gecerlilik: new Date(kazanan.gecerlilik).toISOString(),
          kullanildi: kazanan.kullanildi !== null,
        }
      : null
  const govde: BenYaniti = { takmaAd: oyuncu.takmaAd, hafta, odul }
  return { durum: 200, govde }
}

export async function hesabiSil(b: Baglam, istek: Istek): Promise<Yanit> {
  const oyuncu = await oyuncuyuBul(b, istek)
  await b.depo.oyuncuSil(oyuncu.id)
  b.tablo.bosalt()
  return { durum: 204 }
}
```

- [ ] **Step 3: Yönetim uçları**

`sunucu/yonetim.ts`:

```ts
import { donemAnahtari, girneGunu } from './donem.ts'
import { IstekHatasi, temelKimlik, type Istek, type Yanit } from './http.ts'
import { esitMi, kodOzeti } from './kod.ts'
import { enIyiler } from './siralama.ts'
import type { Baglam } from './uclar.ts'

/* Yönetim uçları (spec §10): temel kimlik doğrulama; kod onayı, izleyici verisi, ad gizleme, sayaç. */

export type YonetimKimligi = { kullanici: string; sifre: string }

export function yonetimDenetle(kimlik: YonetimKimligi | null, istek: Istek): void {
  if (!kimlik) throw new IstekHatasi(503, 'yonetimKapali')
  const gelen = temelKimlik(istek.basliklar.authorization)
  if (!gelen || !esitMi(gelen.kullanici, kimlik.kullanici) || !esitMi(gelen.sifre, kimlik.sifre)) {
    throw new IstekHatasi(401, 'kimlikGerekli')
  }
}

const iso = (ms: number | null) => (ms === null ? null : new Date(ms).toISOString())

/** Dönemin ilk 20 oyuncusu (tur kimliği ve şüphe işaretiyle) ve kazananları. */
export async function yonetimSiralama(b: Baglam, istek: Istek): Promise<Yanit> {
  const donem = istek.sorgu.get('donem') ?? donemAnahtari(new Date(b.simdi()))
  if (!/^\d{4}-\d{2}-\d{2}$/.test(donem)) throw new IstekHatasi(400, 'donemGecersiz')
  const [sirali, kazananlar] = await Promise.all([b.depo.siralama(donem), b.depo.kazananlar(donem)])
  return {
    durum: 200,
    govde: {
      donem,
      satirlar: enIyiler(sirali).slice(0, 20),
      kazananlar: kazananlar.map((k) => ({
        sira: k.sira,
        oyuncuId: k.oyuncuId,
        takmaAd: k.takmaAd,
        puan: k.puan,
        gecerlilik: iso(k.gecerlilik),
        kullanildi: iso(k.kullanildi),
      })),
    },
  }
}

/** İzleyici verisi: tohum ve dokunuş kaydı (saklama süresi geçmişse null). */
export async function yonetimTur(b: Baglam, id: string): Promise<Yanit> {
  const tur = await b.depo.turBul(Number(id))
  if (!tur) throw new IstekHatasi(404, 'turYok')
  return { durum: 200, govde: { ...tur, olusturma: iso(tur.olusturma) } }
}

export async function yonetimKod(b: Baglam, istek: Istek): Promise<Yanit> {
  const govde = (await istek.govde()) as { kod?: unknown } | null
  const kod = govde?.kod
  if (typeof kod !== 'string' || !/^\d{6}$/.test(kod)) throw new IstekHatasi(400, 'kodGecersiz')
  const kazanan = await b.depo.kazananBul(kodOzeti(b.tuz, kod))
  if (!kazanan) throw new IstekHatasi(404, 'kodYok')
  const simdi = b.simdi()
  if (kazanan.gecerlilik < simdi) throw new IstekHatasi(410, 'kodSuresiDoldu')
  if (kazanan.kullanildi !== null || !(await b.depo.kazananKullan(kazanan.id, simdi))) {
    throw new IstekHatasi(409, 'kodKullanildi')
  }
  const { sira, donem, takmaAd, puan } = kazanan
  return { durum: 200, govde: { sira, donem, takmaAd, puan } }
}

export async function yonetimGizle(b: Baglam, istek: Istek, id: string): Promise<Yanit> {
  const govde = (await istek.govde()) as { gizli?: unknown } | null
  if (typeof govde?.gizli !== 'boolean') throw new IstekHatasi(400, 'gizliGecersiz')
  if (!(await b.depo.oyuncuGizle(Number(id), govde.gizli))) throw new IstekHatasi(404, 'oyuncuYok')
  b.tablo.bosalt()
  return { durum: 204 }
}

export async function yonetimSayac(b: Baglam, istek: Istek): Promise<Yanit> {
  const gun = istek.sorgu.get('gun') ?? girneGunu(new Date(b.simdi()))
  if (!/^\d{4}-\d{2}-\d{2}$/.test(gun)) throw new IstekHatasi(400, 'gunGecersiz')
  return { durum: 200, govde: { gun, ...(await b.depo.sayaclar(gun)) } }
}
```

- [ ] **Step 4: Yönlendirme, hız sınırı, CORS ve giriş noktası**

`sunucu/uygulama.ts`:

```ts
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { BlockList } from 'node:net'
import type { Depo } from './depo.ts'
import { hizSiniriKur } from './hiz.ts'
import { corsBasliklari, govdeOku, IstekHatasi, yanitYaz, type Istek, type Yanit } from './http.ts'
import { gercekIp } from './ip.ts'
import { islerKur, type Isler } from './isler.ts'
import {
  benAl,
  hesabiSil,
  onbellekKur,
  oyuncuOl,
  tabloAl,
  turAl,
  turBitir,
  TABLO_ONBELLEK_MS,
  type Baglam,
} from './uclar.ts'
import {
  yonetimDenetle,
  yonetimGizle,
  yonetimKod,
  yonetimSayac,
  yonetimSiralama,
  yonetimTur,
  type YonetimKimligi,
} from './yonetim.ts'

export type Ayar = {
  kokenler: readonly string[]
  tuz: string
  yonetim: YonetimKimligi | null
  guvenilirVekil: BlockList
  kampanyaBitis: number | null
}

export type Gunluk = Pick<Console, 'warn' | 'error'>

export type Uygulama = {
  isle(req: IncomingMessage, res: ServerResponse): Promise<void>
  isler: Isler
  /** Hız sınırı belleğini kırpar; zamanlayıcıdan çağrılır. */
  temizle(simdi: number): void
}

const SAAT_MS = 60 * 60_000
/** Spec §9: oyuncu 40 tur/saat, IP 600 istek/saat; yönetim ucuna IP başına 60/saat (kod tahmini). */
const OYUNCU_SAATLIK = 40
const IP_SAATLIK = 600
const YONETIM_SAATLIK = 60

type Rota = { yontem: string; desen: RegExp; isle: (istek: Istek, es: string[]) => Promise<Yanit> }

function rotalar(b: Baglam, yonetim: YonetimKimligi | null): Rota[] {
  const y = (isle: (istek: Istek, es: string[]) => Promise<Yanit>) => async (istek: Istek, es: string[]) => {
    yonetimDenetle(yonetim, istek)
    return isle(istek, es)
  }
  return [
    { yontem: 'POST', desen: /^\/tur$/, isle: (i) => turAl(b, i) },
    { yontem: 'POST', desen: /^\/oyuncu$/, isle: (i) => oyuncuOl(b, i) },
    { yontem: 'POST', desen: /^\/tur\/([0-9a-f]{32})\/bitir$/, isle: (i, [id]) => turBitir(b, i, id ?? '') },
    { yontem: 'GET', desen: /^\/tablo$/, isle: () => tabloAl(b) },
    { yontem: 'GET', desen: /^\/ben$/, isle: (i) => benAl(b, i) },
    { yontem: 'DELETE', desen: /^\/oyuncu$/, isle: (i) => hesabiSil(b, i) },
    { yontem: 'GET', desen: /^\/yonetim\/siralama$/, isle: y((i) => yonetimSiralama(b, i)) },
    { yontem: 'GET', desen: /^\/yonetim\/tur\/(\d+)$/, isle: y((_, [id]) => yonetimTur(b, id ?? '')) },
    { yontem: 'POST', desen: /^\/yonetim\/kod$/, isle: y((i) => yonetimKod(b, i)) },
    { yontem: 'POST', desen: /^\/yonetim\/oyuncu\/(\d+)\/gizle$/, isle: y((i, [id]) => yonetimGizle(b, i, id ?? '')) },
    { yontem: 'GET', desen: /^\/yonetim\/sayac$/, isle: y((i) => yonetimSayac(b, i)) },
  ]
}

function hatayaYanit(hata: unknown, istek: Istek, gunluk: Gunluk): Yanit {
  if (hata instanceof IstekHatasi) {
    if (istek.yol.endsWith('/bitir')) gunluk.warn('tur reddedildi', { kod: hata.kod, yol: istek.yol })
    const basliklar: Record<string, string> = {}
    if (hata.durum === 401 && istek.yol.startsWith('/yonetim')) basliklar['WWW-Authenticate'] = 'Basic realm="yonetim"'
    return { durum: hata.durum, govde: { hata: hata.kod }, basliklar }
  }
  gunluk.error('istek hatası', { yontem: istek.yontem, yol: istek.yol }, hata)
  return { durum: 500, govde: { hata: 'sunucu' } }
}

export function uygulamaKur(
  depo: Depo,
  ayar: Ayar,
  simdi: () => number = Date.now,
  gunluk: Gunluk = console,
): Uygulama {
  const ipSiniri = hizSiniriKur(IP_SAATLIK, SAAT_MS)
  const yonetimSiniri = hizSiniriKur(YONETIM_SAATLIK, SAAT_MS)
  const b: Baglam = {
    depo,
    tuz: ayar.tuz,
    simdi,
    oyuncuSiniri: hizSiniriKur(OYUNCU_SAATLIK, SAAT_MS),
    tablo: onbellekKur(TABLO_ONBELLEK_MS),
  }
  const liste = rotalar(b, ayar.yonetim)

  async function yonlendir(istek: Istek): Promise<Yanit> {
    if (!ipSiniri.izinVar(istek.ip, simdi())) return { durum: 429, govde: { hata: 'cokIstek' } }
    if (istek.yol.startsWith('/yonetim') && !yonetimSiniri.izinVar(istek.ip, simdi())) {
      return { durum: 429, govde: { hata: 'cokIstek' } }
    }
    const adaylar = liste.filter((r) => r.desen.test(istek.yol))
    if (adaylar.length === 0) return { durum: 404, govde: { hata: 'yolYok' } }
    const rota = adaylar.find((r) => r.yontem === istek.yontem)
    if (!rota) return { durum: 405, govde: { hata: 'yontemYok' } }
    const es = rota.desen.exec(istek.yol) ?? []
    return rota.isle(istek, [...es].slice(1))
  }

  return {
    async isle(req, res) {
      const url = new URL(req.url ?? '/', 'http://sunucu')
      const istek: Istek = {
        yontem: req.method ?? 'GET',
        yol: url.pathname.replace(/\/+$/, '') || '/',
        sorgu: url.searchParams,
        basliklar: req.headers,
        ip: gercekIp(req.socket.remoteAddress, req.headers as Record<string, string | undefined>, ayar.guvenilirVekil),
        govde: () => govdeOku(req),
      }
      const cors = corsBasliklari(req.headers.origin, ayar.kokenler)
      if (istek.yontem === 'OPTIONS') return yanitYaz(res, { durum: 204 }, cors)
      let yanit: Yanit
      try {
        yanit = await yonlendir(istek)
      } catch (hata) {
        yanit = hatayaYanit(hata, istek, gunluk)
      }
      if (yanit.durum === 413) res.once('finish', () => req.destroy())
      yanitYaz(res, yanit, cors)
    },
    isler: islerKur(depo, ayar.tuz, ayar.kampanyaBitis),
    temizle(an) {
      ipSiniri.temizle(an)
      yonetimSiniri.temizle(an)
      b.oyuncuSiniri.temizle(an)
    },
  }
}
```

`sunucu/ana.ts`:

```ts
import { createServer } from 'node:http'
import { bellekDepoKur } from './bellekDepo.ts'
import type { Depo } from './depo.ts'
import { listeKur } from './ip.ts'
import { mariaDepoKur } from './mariaDepo.ts'
import { uygulamaKur, type Ayar } from './uygulama.ts'

/*
 * Giriş noktası. Gizli değerler ortam değişkenlerinden (spec §10):
 *   PORT              dinlenen port, varsayılan 8402
 *   KOKEN             CORS'a izinli kökenler, virgülle; varsayılan https://cigercibozo.com
 *   GIZLI_TUZ         ödül kodu HMAC tuzu, zorunlu
 *   DB_URL            mariadb://kullanici:sifre@sunucu:3306/veritabani; yoksa bellek deposu (yalnız yerel)
 *   YONETIM_KULLANICI, YONETIM_SIFRE   /yonetim temel kimliği; biri yoksa yönetim uçları 503 döner
 *   GUVENILIR_VEKIL   önündeki yerel vekilin adresleri, virgülle; varsayılan 127.0.0.1,::1
 *   KAMPANYA_BITIS    ISO tarih; şampiyon kayıtları bundan 90 gün sonra silinir (spec §8)
 */
const ZAMANLAYICI_MS = 60_000

const liste = (deger: string): string[] => deger.split(',').map((k) => k.trim()).filter(Boolean)

function ortamOku(): { port: number; ayar: Ayar; dbUrl: string | null } {
  const env = process.env
  const tuz = env.GIZLI_TUZ
  if (!tuz) throw new Error('GIZLI_TUZ tanımlı değil')
  const kampanya = env.KAMPANYA_BITIS ? Date.parse(env.KAMPANYA_BITIS) : Number.NaN
  const yonetim =
    env.YONETIM_KULLANICI && env.YONETIM_SIFRE ? { kullanici: env.YONETIM_KULLANICI, sifre: env.YONETIM_SIFRE } : null
  return {
    port: Number(env.PORT ?? 8402),
    dbUrl: env.DB_URL ?? null,
    ayar: {
      kokenler: liste(env.KOKEN ?? 'https://cigercibozo.com'),
      tuz,
      yonetim,
      guvenilirVekil: listeKur(liste(env.GUVENILIR_VEKIL ?? '127.0.0.1,::1')),
      kampanyaBitis: Number.isNaN(kampanya) ? null : kampanya,
    },
  }
}

function depoKur(dbUrl: string | null): Depo {
  if (dbUrl) return mariaDepoKur(dbUrl)
  console.warn('DB_URL yok: bellek deposu, süreç bitince her şey silinir')
  return bellekDepoKur()
}

const { port, ayar, dbUrl } = ortamOku()
const depo = depoKur(dbUrl)
const uygulama = uygulamaKur(depo, ayar)
const sunucu = createServer((req, res) => {
  uygulama.isle(req, res).catch((hata: unknown) => {
    console.error('yanıt yazılamadı', hata)
    if (!res.headersSent) res.writeHead(500).end()
  })
})

const zamanlayici = setInterval(() => {
  const simdi = Date.now()
  uygulama.temizle(simdi)
  uygulama.isler.calistir(simdi).then(
    (kapananlar) => kapananlar.forEach((d) => console.info('dönem kapandı', d)),
    (hata: unknown) => console.error('zamanlanmış iş başarısız', hata),
  )
}, ZAMANLAYICI_MS)

sunucu.listen(port, () => console.info(`skor sunucusu ${port} portunda, depo: ${dbUrl ? 'mariadb' : 'bellek'}`))

for (const sinyal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(sinyal, () => {
    clearInterval(zamanlayici)
    sunucu.close(() => depo.kapat().finally(() => process.exit(0)))
  })
}
```

- [ ] **Step 5: Uç testleri (sahte depo, sahte saat)**

`sunucu/uygulama.test.ts`:

```ts
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createServer, type Server } from 'node:http'
import {
  JETON_SURESI_MS,
  ONAY_SURUMU,
  type BitirYaniti,
  type JetonYaniti,
  type TabloYaniti,
} from '../lib/oyun/aktarim.ts'
import { ustaOyna } from '../lib/oyun/deneme.ts'
import { simule } from '../lib/oyun/motor.ts'
import type { Girdi } from '../lib/oyun/tipler.ts'
import { TIK_MS } from '../lib/oyun/zamanlayici.ts'
import { bellekDepoKur } from './bellekDepo.ts'
import { listeKur } from './ip.ts'
import { uygulamaKur, type Uygulama } from './uygulama.ts'

/*
 * Uçlar sahte depoyla (spec §16): doğrulama, ret yolları, hız sınırı, dönem kapanışı.
 * Saat sahte: 8 Ekim 2026 Perşembe 20:00 Girne; dönem 12 Ekim 05:00 Girne'de (02:00Z) kapanır.
 */
const KOKEN = 'https://cigercibozo.com'
const YONETIM = { kullanici: 'personel', sifre: 'gizli' }
let saat = Date.parse('2026-10-08T20:00:00+03:00')
const PAZARTESI = Date.parse('2026-10-12T02:00:00Z')

let sunucu: Server
let uygulama: Uygulama
let kok = ''

before(async () => {
  uygulama = uygulamaKur(
    bellekDepoKur(),
    {
      kokenler: [KOKEN],
      tuz: 'test-tuzu',
      yonetim: YONETIM,
      guvenilirVekil: listeKur(['127.0.0.1', '::1']),
      kampanyaBitis: null,
    },
    () => saat,
    { warn() {}, error: console.error },
  )
  sunucu = createServer((req, res) => void uygulama.isle(req, res))
  await new Promise<void>((coz) => sunucu.listen(0, '127.0.0.1', coz))
  const adres = sunucu.address()
  if (!adres || typeof adres === 'string') throw new Error('adres yok')
  kok = `http://127.0.0.1:${adres.port}`
})

after(() => sunucu.close())

type Secenek = { yontem?: string; govde?: unknown; anahtar?: string; basliklar?: Record<string, string>; ham?: string }

async function istek(yol: string, { yontem = 'GET', govde, anahtar, basliklar = {}, ham }: Secenek = {}) {
  const b: Record<string, string> = { ...basliklar }
  if (govde !== undefined || ham !== undefined) b['Content-Type'] = 'application/json'
  if (anahtar) b.Authorization = `Bearer ${anahtar}`
  const body = ham ?? (govde === undefined ? undefined : JSON.stringify(govde))
  const yanit = await fetch(kok + yol, { method: yontem, headers: b, body })
  const metin = await yanit.text()
  const okunan = metin ? (JSON.parse(metin) as Record<string, unknown>) : null
  return { durum: yanit.status, govde: okunan, basliklar: yanit.headers }
}

const temel = (kullanici: string, sifre: string) => `Basic ${Buffer.from(`${kullanici}:${sifre}`).toString('base64')}`
const yonetimBasligi = { Authorization: temel(YONETIM.kullanici, YONETIM.sifre) }
let anahtarSayaci = 0
const yeniAnahtar = () => String(++anahtarSayaci).padStart(32, '0')

async function oyuncuOl(takmaAd: string) {
  const anahtar = yeniAnahtar()
  const y = await istek('/oyuncu', { yontem: 'POST', govde: { takmaAd, anahtar, onaySurumu: ONAY_SURUMU } })
  assert.equal(y.durum, 201, JSON.stringify(y.govde))
  return anahtar
}

async function jetonAl(kanal = 'yok'): Promise<JetonYaniti> {
  const y = await istek('/tur', { yontem: 'POST', govde: { kanal } })
  assert.equal(y.durum, 201)
  return y.govde as JetonYaniti
}

function kayitSuresi(tohum: number, kayit: Girdi[]): number {
  try {
    return simule(tohum, kayit).tik * TIK_MS
  } catch {
    return 7200 * TIK_MS
  }
}

/** Jeton alır, kaydın süresi kadar saati ilerletir, gönderir. */
async function turOyna(anahtar: string, girdiler: (tohum: number) => Girdi[], ek: Secenek = {}) {
  const jeton = await jetonAl()
  const kayit = girdiler(jeton.tohum)
  saat += kayitSuresi(jeton.tohum, kayit) + 500
  const govde = { girdiler: kayit, puan: 999999 }
  return istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', govde, anahtar, ...ek })
}

const usta = (tohum: number) => ustaOyna(tohum, 'usta')
const acemi = (tohum: number) => ustaOyna(tohum, 'acemi')
const bos = () => []

test('tur_jetonVerir_tohumUint32_kanalGunlukSayacaYazilir', async () => {
  const jeton = await jetonAl('sofra')
  assert.match(jeton.turId, /^[0-9a-f]{32}$/)
  assert.ok(Number.isInteger(jeton.tohum) && jeton.tohum >= 0 && jeton.tohum <= 0xffffffff)
  assert.equal(Date.parse(jeton.sonaErme), saat + JETON_SURESI_MS)
  const sayac = await istek('/yonetim/sayac?gun=2026-10-08', { basliklar: yonetimBasligi })
  assert.equal(sayac.durum, 200)
  assert.ok((sayac.govde?.sofra as number) >= 1)
  assert.equal((await istek('/tur', { yontem: 'POST', govde: { kanal: 'tiktok' } })).durum, 400)
})

test('bitir_sunucuSkoruKendiHesaplar_iddiaOkunmaz_siraVeFark', async () => {
  const a = await oyuncuOl('Usta Ali')
  const y = await turOyna(a, usta)
  assert.equal(y.durum, 200, JSON.stringify(y.govde))
  const sonuc = y.govde as unknown as BitirYaniti
  assert.notEqual(sonuc.puan, 999999)
  assert.ok(sonuc.puan > 10000)
  assert.equal(sonuc.hafta.sira, 1)
  assert.equal(sonuc.hafta.ustekiFark, null)
  assert.equal(sonuc.buTurEnIyi, true)
  const b = await oyuncuOl('Acemi Veli')
  const y2 = (await turOyna(b, acemi)).govde as unknown as BitirYaniti
  assert.equal(y2.hafta.sira, 2)
  assert.equal(y2.hafta.ustekiFark, sonuc.puan - y2.puan)
})

test('bitir_cokHizli_422_jetonYanar_beklesenDeGonderemez', async () => {
  const a = await oyuncuOl('Hizli')
  const jeton = await jetonAl()
  const kayit = usta(jeton.tohum)
  const erken = await istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', govde: { girdiler: kayit }, anahtar: a })
  assert.deepEqual([erken.durum, erken.govde?.hata], [422, 'cokHizli'])
  saat += 130_000
  const gec = await istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', govde: { girdiler: kayit }, anahtar: a })
  assert.deepEqual([gec.durum, gec.govde?.hata], [409, 'jetonKullanildi'])
})

test('bitir_jetonYok404_kullanildi409_suresiDoldu410', async () => {
  const a = await oyuncuOl('Jetoncu')
  const yok = await istek(`/tur/${'f'.repeat(32)}/bitir`, { yontem: 'POST', govde: { girdiler: [] }, anahtar: a })
  assert.deepEqual([yok.durum, yok.govde?.hata], [404, 'jetonYok'])
  const ilk = await turOyna(a, bos)
  assert.equal(ilk.durum, 200)
  const eski = await jetonAl()
  saat += JETON_SURESI_MS + 1
  const dolmus = await istek(`/tur/${eski.turId}/bitir`, { yontem: 'POST', govde: { girdiler: [] }, anahtar: a })
  assert.deepEqual([dolmus.durum, dolmus.govde?.hata], [410, 'jetonSuresiDoldu'])
})

test('bitir_cokDokunus_ayniTikteAyniHedef_govdeBuyuk_tavan', async () => {
  const a = await oyuncuOl('Sinirci')
  const cok = await turOyna(a, () => Array.from({ length: 1201 }, (_, i) => [i, 's0'] as Girdi))
  assert.deepEqual([cok.durum, cok.govde?.hata], [422, 'cokDokunus'])
  const cift = await turOyna(a, () => [[5, 's0'], [5, 's0']])
  assert.deepEqual([cift.durum, cift.govde?.hata], [422, 'ayniTikteAyniHedef'])
  const bozuk = await turOyna(a, () => [[7200, 's0']])
  assert.deepEqual([bozuk.durum, bozuk.govde?.hata], [422, 'girdilerGecersiz'])
  const jeton = await jetonAl()
  const ham = `{"girdiler":[],"x":"${'a'.repeat(65 * 1024)}"}`
  const buyuk = await istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', ham, anahtar: a })
  assert.equal(buyuk.durum, 413)
})

test('bitir_anahtarsiz401_bilinmeyenOyuncu401', async () => {
  const jeton = await jetonAl()
  assert.equal((await istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', govde: { girdiler: [] } })).durum, 401)
  const govde = { girdiler: [] }
  const y = await istek(`/tur/${jeton.turId}/bitir`, { yontem: 'POST', govde, anahtar: 'e'.repeat(32) })
  assert.deepEqual([y.durum, y.govde?.hata], [401, 'oyuncuYok'])
})

test('oyuncu_reddedilenAdlarTekNotrKod_eskiOnay400_ayniAnahtar409', async () => {
  for (const takmaAd of ['ab', 'Bozo', 'ciğerci bozo', 'Orospu', 'Usta Ali', 'usta ali', 'Ali🔥']) {
    const govde = { takmaAd, anahtar: yeniAnahtar(), onaySurumu: ONAY_SURUMU }
    const y = await istek('/oyuncu', { yontem: 'POST', govde })
    assert.deepEqual([y.durum, y.govde?.hata], [422, 'takmaAdKullanilamaz'], takmaAd)
  }
  const eskiGovde = { takmaAd: 'Yeni Ad', anahtar: yeniAnahtar(), onaySurumu: 'eski' }
  const eski = await istek('/oyuncu', { yontem: 'POST', govde: eskiGovde })
  assert.deepEqual([eski.durum, eski.govde?.hata], [400, 'onaySurumuEski'])
  const anahtar = await oyuncuOl('Tekrarci')
  const tekrarGovde = { takmaAd: 'Baska', anahtar, onaySurumu: ONAY_SURUMU }
  const tekrar = await istek('/oyuncu', { yontem: 'POST', govde: tekrarGovde })
  assert.deepEqual([tekrar.durum, tekrar.govde?.hata], [409, 'zatenKayitli'])
})

test('tablo_haftaninIlkOnu_gizliAdNull_onbellekGonderimdeBosalir', async () => {
  const once = await istek('/tablo')
  assert.equal(once.durum, 200)
  assert.equal(once.basliklar.get('cache-control'), 'public, max-age=20')
  const tablo = once.govde as unknown as TabloYaniti
  assert.equal(tablo.donem, '2026-10-05')
  assert.equal(tablo.bitis, '2026-10-12T02:00:00.000Z')
  assert.equal(tablo.hafta[0]?.takmaAd, 'Usta Ali')
  assert.ok(tablo.hafta.length <= 10)
  assert.equal(tablo.sonSampiyon, null)
  const yonetim = await istek('/yonetim/siralama', { basliklar: yonetimBasligi })
  const satirlar = yonetim.govde?.satirlar as { oyuncuId: number; takmaAd: string }[]
  const ali = satirlar.find((s) => s.takmaAd === 'Usta Ali')
  assert.ok(ali)
  const gizleIstegi = { yontem: 'POST', govde: { gizli: true }, basliklar: yonetimBasligi }
  const gizle = await istek(`/yonetim/oyuncu/${ali.oyuncuId}/gizle`, gizleIstegi)
  assert.equal(gizle.durum, 204)
  const sonra = (await istek('/tablo')).govde as unknown as TabloYaniti
  assert.equal(sonra.hafta[0]?.takmaAd, null)
})

test('yonetim_kimliksiz401_yanlis401_turIzleyiciVerisi', async () => {
  const kimliksiz = await istek('/yonetim/siralama')
  assert.equal(kimliksiz.durum, 401)
  assert.equal(kimliksiz.basliklar.get('www-authenticate'), 'Basic realm="yonetim"')
  const yanlis = await istek('/yonetim/siralama', { basliklar: { Authorization: temel('personel', 'yanlis') } })
  assert.equal(yanlis.durum, 401)
  const yonetim = await istek('/yonetim/siralama', { basliklar: yonetimBasligi })
  const siralama = yonetim.govde?.satirlar as { turId: number; supheli: boolean }[]
  const tur = await istek(`/yonetim/tur/${siralama[0]?.turId}`, { basliklar: yonetimBasligi })
  assert.equal(tur.durum, 200)
  assert.ok(Array.isArray(tur.govde?.girdiler))
  assert.equal(siralama[0]?.supheli, true, 'sabit aralıklı bot işaretlenir')
  assert.equal((await istek('/yonetim/tur/999999', { basliklar: yonetimBasligi })).durum, 404)
})

test('donemKapanisi_kodUretir_benKoduGosterir_personelOnaylar_ikinciOnay409', async () => {
  const birinci = await oyuncuOl('Sampiyon')
  await turOyna(birinci, usta)
  saat = PAZARTESI
  assert.deepEqual(await uygulama.isler.calistir(saat), ['2026-10-05'])
  const ben = await istek('/ben', { anahtar: birinci })
  assert.equal(ben.durum, 200)
  const odul = ben.govde?.odul as { kod: string; sira: number; donem: string; kullanildi: boolean }
  assert.match(odul.kod, /^\d{6}$/)
  assert.equal(odul.donem, '2026-10-05')
  assert.equal(odul.kullanildi, false)
  assert.equal(ben.govde?.hafta, null, 'yeni haftada henüz tur yok')
  const tablo = (await istek('/tablo')).govde as unknown as TabloYaniti
  assert.equal(tablo.sonSampiyon?.puan, (ben.govde as { odul: { puan?: number } }).odul.puan ?? tablo.sonSampiyon?.puan)
  const baskaKod = odul.kod === '000000' ? '000001' : '000000'
  const yanlis = await istek('/yonetim/kod', { yontem: 'POST', govde: { kod: baskaKod }, basliklar: yonetimBasligi })
  assert.deepEqual([yanlis.durum, yanlis.govde?.hata], [404, 'kodYok'])
  const onay = await istek('/yonetim/kod', { yontem: 'POST', govde: { kod: odul.kod }, basliklar: yonetimBasligi })
  assert.equal(onay.durum, 200)
  assert.equal(onay.govde?.sira, odul.sira)
  const ikinci = await istek('/yonetim/kod', { yontem: 'POST', govde: { kod: odul.kod }, basliklar: yonetimBasligi })
  assert.deepEqual([ikinci.durum, ikinci.govde?.hata], [409, 'kodKullanildi'])
  assert.equal(((await istek('/ben', { anahtar: birinci })).govde?.odul as { kullanildi: boolean }).kullanildi, true)
})

test('hesabiSil_204_sonraBen401_tablodanDuser', async () => {
  const a = await oyuncuOl('Silinecek')
  await turOyna(a, acemi)
  assert.equal((await istek('/oyuncu', { yontem: 'DELETE', anahtar: a })).durum, 204)
  assert.equal((await istek('/ben', { anahtar: a })).durum, 401)
  const tablo = (await istek('/tablo')).govde as unknown as TabloYaniti
  assert.equal(tablo.hafta.some((s) => s.takmaAd === 'Silinecek'), false)
})

test('cors_yalnizIzinliKoken_preflight204', async () => {
  const izinli = await istek('/tablo', { basliklar: { Origin: KOKEN } })
  assert.equal(izinli.basliklar.get('access-control-allow-origin'), KOKEN)
  const yabanci = await istek('/tablo', { basliklar: { Origin: 'https://kotu.example' } })
  assert.equal(yabanci.basliklar.get('access-control-allow-origin'), null)
  const onBasliklar = { Origin: KOKEN, 'Access-Control-Request-Method': 'POST' }
  const on = await fetch(kok + '/tur', { method: 'OPTIONS', headers: onBasliklar })
  assert.equal(on.status, 204)
  assert.equal(on.headers.get('access-control-allow-headers'), 'Content-Type, Authorization')
})

test('hizSiniri_oyuncuSaatteKirkTur_kirkBirinci429', async () => {
  const a = await oyuncuOl('Doymaz')
  for (let i = 0; i < 40; i++) assert.equal((await turOyna(a, bos)).durum, 200, `tur ${i}`)
  const fazla = await turOyna(a, bos)
  assert.deepEqual([fazla.durum, fazla.govde?.hata], [429, 'cokTur'])
  saat += 60 * 60_000
  assert.equal((await turOyna(a, bos)).durum, 200)
})

test('bilinmeyenYol404_yanlisYontem405_bozukJson400', async () => {
  assert.equal((await istek('/yok')).durum, 404)
  assert.equal((await istek('/tablo', { yontem: 'POST', govde: {} })).durum, 405)
  const bozuk = await istek('/tur', { yontem: 'POST', ham: '{bozuk' })
  assert.deepEqual([bozuk.durum, bozuk.govde?.hata], [400, 'bozukJson'])
})
```

- [ ] **Step 6: Test ve tip denetimi**

Run: `node --test sunucu/*.test.ts && npm run typecheck && npx tsc -p sunucu/tsconfig.json --noEmit`
Expected: `ℹ pass 67`, `ℹ fail 0`; tip denetimleri temiz. Uç testleri `warn`'ı susturur;
`console.error` açık kalır, 500 görülürse yığını yazar.

- [ ] **Step 7: Sunucuyu yerelde çalıştır, betikli tur**

Run (ayrı bir terminalde, bellek deposu):
```bash
GIZLI_TUZ=yerel-tuz KOKEN=http://localhost:8398 PORT=8402 YONETIM_KULLANICI=personel YONETIM_SIFRE=sifre node sunucu/ana.ts
```
Expected: `DB_URL yok: bellek deposu, süreç bitince her şey silinir` ve `skor sunucusu 8402
portunda, depo: bellek`.

`/tmp/bozo-oyun/plan3/tur-gonder.mjs`:

```js
// Sıralamaya 12 karakterlik adla bir oyuncu ve bir tur yazar (taşma ölçümü için satır). Boş kayıt: üç sofra kalkınca biter.
import { simule } from '/tmp/bozo-oyun/plan3/repo/lib/oyun/motor.ts'
const KOK = process.argv[2] ?? 'http://127.0.0.1:8402'
const anahtar = 'c'.repeat(32)
const json = { 'Content-Type': 'application/json' }
const kayit = await fetch(KOK + '/oyuncu', { method: 'POST', headers: json, body: JSON.stringify({ takmaAd: 'Şşşşşşşşşşşş', anahtar, onaySurumu: 'taslak-2026-10-08' }) })
console.log('oyuncu', kayit.status, await kayit.text())
const jeton = await (await fetch(KOK + '/tur', { method: 'POST', headers: json, body: JSON.stringify({ kanal: 'site' }) })).json()
const sure = simule(jeton.tohum, []).tik * (1000 / 60)
console.log('bekleme ms', Math.round(sure))
await new Promise((r) => setTimeout(r, sure - 1000))
const bitir = await fetch(`${KOK}/tur/${jeton.turId}/bitir`, { method: 'POST', headers: { ...json, Authorization: `Bearer ${anahtar}` }, body: JSON.stringify({ girdiler: [] }) })
console.log('bitir', bitir.status, await bitir.text())
```

Run: `node /tmp/bozo-oyun/plan3/tur-gonder.mjs http://127.0.0.1:8402`
Expected (boş kayıt: üç sofra 2.760 tikte kalkar, betik 45 sn bekler):
```
oyuncu 201 {"takmaAd":"Şşşşşşşşşşşş"}
bekleme ms 46000
bitir 200 {"puan":-600,"ozet":{"sofra":0,"sis":0,"tamKivam":0,"enUzunKombo":0,"kalkan":3},"bitti":"ucSofra","tik":2760,"hafta":{"puan":-600,"sira":1,"ustekiFark":null},"buTurEnIyi":true}
```
Sonra `curl -s http://127.0.0.1:8402/tablo` haftada bir satır (`Şşşşşşşşşşşş`, -600) ve
`curl -s -u personel:sifre 'http://127.0.0.1:8402/yonetim/sayac'` `"site":1` döner. Sunucu
Task 6'nın tarayıcı denetimleri için açık kalır.

- [ ] **Step 8: Node 24 ve derleme**

Spec Node 24 der; makinede `~/.nvm/versions/node/v24.12.0/bin/node` var (varsayılan 25.6).

Run:
```bash
~/.nvm/versions/node/v24.12.0/bin/node --test sunucu/*.test.ts 2>&1 | grep -E '^ℹ (pass|fail)'
npm run build -w sunucu && ls sunucu/dist/sunucu | head -3
GIZLI_TUZ=t PORT=8403 ~/.nvm/versions/node/v24.12.0/bin/node sunucu/dist/sunucu/ana.js &
sleep 1.5; curl -s http://127.0.0.1:8403/tablo; kill %1; rm -rf sunucu/dist
```
Expected: `ℹ pass 67`, `ℹ fail 0`; `dist/sunucu/ana.js bellekDepo.js depo.js` ve `dist/lib/...`;
`{"donem":"...","bitis":"...","hafta":[],"tumZamanlar":[],"sonSampiyon":null}`. `dist/`
`.gitignore`'dadır; silinir, commit'e girmez.

- [ ] **Step 9: Commit**

```bash
git add sunucu/isler.ts sunucu/isler.test.ts sunucu/uclar.ts sunucu/yonetim.ts sunucu/uygulama.ts \
  sunucu/uygulama.test.ts sunucu/ana.ts
git commit -m "Serve the game's endpoints, period close and retention jobs"
```

---

### Task 4: MariaDB şeması ve deposu (isteğe bağlı Docker doğrulaması)

**Files:**
- Create: `sunucu/sema.sql`, `sunucu/mariaDepo.ts`
- Test: `sunucu/mariaDepo.test.ts`

**Interfaces:**
- Consumes: `Depo` ve tipleri (Task 2), `depoSozlesmesi`, `mariadb` (`createPool`,
  `createConnection`, `execute`).
- Produces: `baglantiCoz(url)`, `semayiUygula(url, sema, bosalt)`, `mariaDepoKur(url): Depo`.

- [ ] **Step 1: Şema**

`sunucu/sema.sql`:

```sql
-- Skor sunucusu şeması, MariaDB 10.11 (spec §10). Zamanlar epoch milisaniye (BIGINT): sunucu ile
-- veritabanının saat dilimi ayarı birbirinden bağımsız kalır. Girne yorumu yalnız sunucuda.

CREATE TABLE IF NOT EXISTS oyuncu (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  anahtar_ozeti CHAR(64) NOT NULL,
  takma_ad VARCHAR(12) NOT NULL,
  ad_katlanmis VARCHAR(12) NOT NULL,
  onay_zamani_ms BIGINT NOT NULL,
  onay_surumu VARCHAR(32) NOT NULL,
  gizli TINYINT(1) NOT NULL DEFAULT 0,
  olusturma_ms BIGINT NOT NULL,
  son_tur_ms BIGINT NULL,
  UNIQUE KEY oyuncu_anahtar (anahtar_ozeti),
  UNIQUE KEY oyuncu_ad (ad_katlanmis),
  KEY oyuncu_son_tur (son_tur_ms)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS tur_jetonu (
  id CHAR(32) NOT NULL PRIMARY KEY,
  tohum INT UNSIGNED NOT NULL,
  kanal ENUM('sofra', 'ig', 'site', 'yok') NOT NULL,
  olusturma_ms BIGINT NOT NULL,
  sona_erme_ms BIGINT NOT NULL,
  kullanildi TINYINT(1) NOT NULL DEFAULT 0,
  KEY jeton_sona_erme (sona_erme_ms)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS donem (
  anahtar CHAR(10) NOT NULL PRIMARY KEY,
  baslangic_ms BIGINT NOT NULL,
  bitis_ms BIGINT NOT NULL,
  kapanis_ms BIGINT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tur (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  jeton_id CHAR(32) NOT NULL,
  oyuncu_id INT UNSIGNED NOT NULL,
  donem CHAR(10) NOT NULL,
  tohum INT UNSIGNED NOT NULL,
  puan INT NOT NULL,
  sofra SMALLINT UNSIGNED NOT NULL,
  sis SMALLINT UNSIGNED NOT NULL,
  tam_kivam SMALLINT UNSIGNED NOT NULL,
  en_uzun_kombo SMALLINT UNSIGNED NOT NULL,
  kalkan TINYINT UNSIGNED NOT NULL,
  bitti ENUM('gece', 'ucSofra') NOT NULL,
  tik SMALLINT UNSIGNED NOT NULL,
  kanal ENUM('sofra', 'ig', 'site', 'yok') NOT NULL,
  supheli TINYINT(1) NOT NULL DEFAULT 0,
  girdiler MEDIUMTEXT NULL,
  olusturma_ms BIGINT NOT NULL,
  UNIQUE KEY tur_jeton (jeton_id),
  KEY tur_donem_sira (donem, puan, tam_kivam, kalkan, olusturma_ms),
  KEY tur_oyuncu (oyuncu_id, donem),
  CONSTRAINT tur_oyuncu_fk FOREIGN KEY (oyuncu_id) REFERENCES oyuncu (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS kazanan (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  donem CHAR(10) NOT NULL,
  sira TINYINT UNSIGNED NOT NULL,
  oyuncu_id INT UNSIGNED NULL,
  takma_ad VARCHAR(12) NOT NULL,
  puan INT NOT NULL,
  kod_ozeti CHAR(64) NOT NULL,
  deneme TINYINT UNSIGNED NOT NULL DEFAULT 0,
  gecerlilik_ms BIGINT NOT NULL,
  kullanildi_ms BIGINT NULL,
  UNIQUE KEY kazanan_donem_sira (donem, sira),
  UNIQUE KEY kazanan_kod (kod_ozeti),
  KEY kazanan_oyuncu (oyuncu_id),
  CONSTRAINT kazanan_oyuncu_fk FOREIGN KEY (oyuncu_id) REFERENCES oyuncu (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE IF NOT EXISTS gunluk_sayac (
  gun CHAR(10) NOT NULL,
  kanal ENUM('sofra', 'ig', 'site', 'yok') NOT NULL,
  tur INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (gun, kanal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

- [ ] **Step 2: Depo**

`sunucu/mariaDepo.ts`:

```ts
import { createConnection, createPool, type Pool } from 'mariadb'
import type { Kanal } from '../lib/oyun/aktarim.ts'
import type { Bitis, Girdi } from '../lib/oyun/tipler.ts'
import type { Depo, Jeton, Kazanan, Oyuncu, SiraSatiri, Tur, YeniTur } from './depo.ts'

/* MariaDB 10.11 deposu: hazır ifadeli sorgular (`execute`), zamanlar epoch ms (bkz. sema.sql). */

type Satir = Record<string, unknown>
type Yazim = { affectedRows: number; insertId: number }
type Sorgu = {
  sec(sql: string, p?: unknown[]): Promise<Satir[]>
  ilk(sql: string, p?: unknown[]): Promise<Satir | null>
  yaz(sql: string, p?: unknown[]): Promise<Yazim>
}
type Parca<K extends keyof Depo> = Pick<Depo, K>

const SIRA = 'puan DESC, tam_kivam DESC, kalkan ASC, olusturma_ms ASC'
const SIRA_T = 't.puan DESC, t.tam_kivam DESC, t.kalkan ASC, t.olusturma_ms ASC'
const SIRA_SECIM =
  't.id AS turId, t.oyuncu_id AS oyuncuId, o.takma_ad AS takmaAd, o.gizli, t.supheli, t.puan, ' +
  't.tam_kivam AS tamKivam, t.kalkan, t.olusturma_ms AS olusturma'
/** Her oyuncunun en iyi turu: pencere fonksiyonu oyuncu başına §6 sırasında numaralar. */
const EN_IYILER = `SELECT *, ROW_NUMBER() OVER (PARTITION BY oyuncu_id ORDER BY ${SIRA}) AS sira_no FROM tur`
const KAZANAN_SECIM =
  'k.id, k.donem, k.sira, k.oyuncu_id AS oyuncuId, k.takma_ad AS takmaAd, k.puan, k.kod_ozeti AS kodOzeti, ' +
  'k.deneme, k.gecerlilik_ms AS gecerlilik, k.kullanildi_ms AS kullanildi, COALESCE(o.gizli, 0) AS gizli ' +
  'FROM kazanan k LEFT JOIN oyuncu o ON o.id = k.oyuncu_id'

export function baglantiCoz(url: string) {
  const u = new URL(url)
  return {
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
  }
}

/** Şemayı kurar ve verilen tabloları boşaltır; yalnız test ve ilk kurulum için. */
export async function semayiUygula(url: string, sema: string, bosalt: readonly string[] = []): Promise<void> {
  const baglanti = await createConnection(baglantiCoz(url))
  try {
    const ifadeler = sema.replace(/^--.*$/gm, '').split(';').map((s) => s.trim()).filter(Boolean)
    for (const ifade of ifadeler) await baglanti.query(ifade)
    await baglanti.query('SET FOREIGN_KEY_CHECKS = 0')
    for (const tablo of bosalt) await baglanti.query(`TRUNCATE TABLE ${tablo}`)
    await baglanti.query('SET FOREIGN_KEY_CHECKS = 1')
  } finally {
    await baglanti.end()
  }
}

const sayi = (deger: unknown): number => Number(deger)
const bayrak = (deger: unknown): boolean => Number(deger) === 1
const sayiYaDaNull = (deger: unknown): number | null => (deger === null || deger === undefined ? null : Number(deger))

const jetonOku = (r: Satir): Jeton => ({
  id: String(r.id),
  tohum: sayi(r.tohum),
  kanal: r.kanal as Kanal,
  olusturma: sayi(r.olusturma_ms),
  sonaErme: sayi(r.sona_erme_ms),
  kullanildi: bayrak(r.kullanildi),
})

const oyuncuOku = (r: Satir): Oyuncu => ({ id: sayi(r.id), takmaAd: String(r.takma_ad), gizli: bayrak(r.gizli) })

const siraOku = (r: Satir): SiraSatiri => ({
  turId: sayi(r.turId),
  oyuncuId: sayi(r.oyuncuId),
  takmaAd: String(r.takmaAd),
  gizli: bayrak(r.gizli),
  supheli: bayrak(r.supheli),
  puan: sayi(r.puan),
  tamKivam: sayi(r.tamKivam),
  kalkan: sayi(r.kalkan),
  olusturma: sayi(r.olusturma),
})

const turOku = (r: Satir): Tur => ({
  id: sayi(r.id),
  jetonId: String(r.jeton_id),
  oyuncuId: sayi(r.oyuncu_id),
  takmaAd: String(r.takma_ad),
  donem: String(r.donem),
  tohum: sayi(r.tohum),
  puan: sayi(r.puan),
  ozet: {
    sofra: sayi(r.sofra),
    sis: sayi(r.sis),
    tamKivam: sayi(r.tam_kivam),
    enUzunKombo: sayi(r.en_uzun_kombo),
    kalkan: sayi(r.kalkan),
  },
  bitti: r.bitti as Bitis,
  tik: sayi(r.tik),
  kanal: r.kanal as Kanal,
  supheli: bayrak(r.supheli),
  girdiler: r.girdiler === null ? null : (JSON.parse(String(r.girdiler)) as Girdi[]),
  olusturma: sayi(r.olusturma_ms),
})

const kazananOku = (r: Satir): Kazanan => ({
  id: sayi(r.id),
  donem: String(r.donem),
  sira: sayi(r.sira),
  oyuncuId: sayiYaDaNull(r.oyuncuId),
  takmaAd: String(r.takmaAd),
  puan: sayi(r.puan),
  kodOzeti: String(r.kodOzeti),
  deneme: sayi(r.deneme),
  gecerlilik: sayi(r.gecerlilik),
  kullanildi: sayiYaDaNull(r.kullanildi),
  gizli: bayrak(r.gizli),
})

function jetonlar(q: Sorgu): Parca<'jetonEkle' | 'jetonBul' | 'jetonKullan' | 'suresiDolanJetonlariSil'> {
  return {
    async jetonEkle(j) {
      await q.yaz(
        'INSERT INTO tur_jetonu (id, tohum, kanal, olusturma_ms, sona_erme_ms, kullanildi) VALUES (?, ?, ?, ?, ?, ?)',
        [j.id, j.tohum, j.kanal, j.olusturma, j.sonaErme, j.kullanildi ? 1 : 0],
      )
    },
    async jetonBul(id) {
      const r = await q.ilk('SELECT * FROM tur_jetonu WHERE id = ?', [id])
      return r ? jetonOku(r) : null
    },
    async jetonKullan(id) {
      const r = await q.yaz('UPDATE tur_jetonu SET kullanildi = 1 WHERE id = ? AND kullanildi = 0', [id])
      return r.affectedRows === 1
    },
    async suresiDolanJetonlariSil(simdi) {
      return (await q.yaz('DELETE FROM tur_jetonu WHERE sona_erme_ms < ?', [simdi])).affectedRows
    },
  }
}

type OyuncuUclari = Parca<'oyuncuEkle' | 'oyuncuBul' | 'oyuncuGizle' | 'oyuncuSil' | 'eskiOyunculariSil'>

function oyuncular(q: Sorgu): OyuncuUclari {
  return {
    async oyuncuEkle(o) {
      try {
        const r = await q.yaz(
          'INSERT INTO oyuncu (anahtar_ozeti, takma_ad, ad_katlanmis, onay_zamani_ms, onay_surumu, olusturma_ms) ' +
            'VALUES (?, ?, ?, ?, ?, ?)',
          [o.anahtarOzeti, o.takmaAd, o.adKatlanmis, o.simdi, o.onaySurumu, o.simdi],
        )
        return { id: r.insertId, takmaAd: o.takmaAd, gizli: false }
      } catch (hata) {
        if ((hata as { errno?: number }).errno === 1062) return 'adKullanimda'
        throw hata
      }
    },
    async oyuncuBul(anahtarOzeti) {
      const r = await q.ilk('SELECT id, takma_ad, gizli FROM oyuncu WHERE anahtar_ozeti = ?', [anahtarOzeti])
      return r ? oyuncuOku(r) : null
    },
    async oyuncuGizle(id, gizli) {
      return (await q.yaz('UPDATE oyuncu SET gizli = ? WHERE id = ?', [gizli ? 1 : 0, id])).affectedRows === 1
    },
    async oyuncuSil(id) {
      return (await q.yaz('DELETE FROM oyuncu WHERE id = ?', [id])).affectedRows === 1
    },
    async eskiOyunculariSil(oncesi) {
      const r = await q.yaz('DELETE FROM oyuncu WHERE COALESCE(son_tur_ms, olusturma_ms) < ?', [oncesi])
      return r.affectedRows
    },
  }
}

/** Tur ve oyuncunun son turu tek işlemde yazılır. */
async function turYaz(havuz: Pool, t: YeniTur): Promise<number> {
  const baglanti = await havuz.getConnection()
  try {
    await baglanti.beginTransaction()
    const r = (await baglanti.execute(
      'INSERT INTO tur (jeton_id, oyuncu_id, donem, tohum, puan, sofra, sis, tam_kivam, en_uzun_kombo, kalkan, ' +
        'bitti, tik, kanal, supheli, girdiler, olusturma_ms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        t.jetonId, t.oyuncuId, t.donem, t.tohum, t.puan, t.ozet.sofra, t.ozet.sis, t.ozet.tamKivam,
        t.ozet.enUzunKombo, t.ozet.kalkan, t.bitti, t.tik, t.kanal, t.supheli ? 1 : 0, JSON.stringify(t.girdiler),
        t.olusturma,
      ],
    )) as Yazim
    await baglanti.execute('UPDATE oyuncu SET son_tur_ms = GREATEST(COALESCE(son_tur_ms, 0), ?) WHERE id = ?', [
      t.olusturma, t.oyuncuId,
    ])
    await baglanti.commit()
    return r.insertId
  } catch (hata) {
    await baglanti.rollback()
    throw hata
  } finally {
    baglanti.release()
  }
}

type TurUclari = Parca<'turEkle' | 'turBul' | 'siralama' | 'tumZamanlar' | 'girdileriKirp' | 'eskiGirdileriSil'>

function turlar(q: Sorgu, havuz: Pool): TurUclari {
  return {
    turEkle: (t) => turYaz(havuz, t),
    async turBul(id) {
      const sql = 'SELECT t.*, o.takma_ad FROM tur t JOIN oyuncu o ON o.id = t.oyuncu_id WHERE t.id = ?'
      const r = await q.ilk(sql, [id])
      return r ? turOku(r) : null
    },
    async siralama(donem) {
      const sql =
        `SELECT ${SIRA_SECIM} FROM (${EN_IYILER} WHERE donem = ?) t JOIN oyuncu o ON o.id = t.oyuncu_id ` +
        `WHERE t.sira_no = 1 ORDER BY ${SIRA_T}`
      return (await q.sec(sql, [donem])).map(siraOku)
    },
    async tumZamanlar(adet) {
      const sql =
        `SELECT ${SIRA_SECIM} FROM (${EN_IYILER}) t JOIN oyuncu o ON o.id = t.oyuncu_id ` +
        `WHERE t.sira_no = 1 ORDER BY ${SIRA_T} LIMIT ?`
      return (await q.sec(sql, [adet])).map(siraOku)
    },
    async girdileriKirp(donem, korunan) {
      const disinda = korunan.length ? ` AND id NOT IN (${korunan.map(() => '?').join(', ')})` : ''
      const sql = `UPDATE tur SET girdiler = NULL WHERE donem = ? AND girdiler IS NOT NULL${disinda}`
      return (await q.yaz(sql, [donem, ...korunan])).affectedRows
    },
    async eskiGirdileriSil(bitisiOncesi) {
      const sql =
        'UPDATE tur t JOIN donem d ON d.anahtar = t.donem SET t.girdiler = NULL ' +
        'WHERE d.bitis_ms < ? AND t.girdiler IS NOT NULL'
      return (await q.yaz(sql, [bitisiOncesi])).affectedRows
    },
  }
}

function donemler(q: Sorgu): Parca<'donemKaydet' | 'acikDonemler' | 'donemKapat'> {
  return {
    async donemKaydet(d) {
      await q.yaz('INSERT IGNORE INTO donem (anahtar, baslangic_ms, bitis_ms, kapanis_ms) VALUES (?, ?, ?, ?)', [
        d.anahtar, d.baslangic, d.bitis, d.kapanis,
      ])
    },
    async acikDonemler() {
      const satirlar = await q.sec('SELECT * FROM donem WHERE kapanis_ms IS NULL ORDER BY baslangic_ms')
      return satirlar.map((r) => ({
        anahtar: String(r.anahtar),
        baslangic: sayi(r.baslangic_ms),
        bitis: sayi(r.bitis_ms),
        kapanis: null,
      }))
    },
    async donemKapat(anahtar, simdi) {
      await q.yaz('UPDATE donem SET kapanis_ms = ? WHERE anahtar = ?', [simdi, anahtar])
    },
  }
}

type KazananUclari = Parca<
  'kazananEkle' | 'kazananlar' | 'sonSampiyon' | 'oyuncununOdulu' | 'kazananBul' | 'kazananKullan' | 'kazananlariSil'
>

function kazananlar(q: Sorgu): KazananUclari {
  const bul = async (kosul: string, p: unknown[]) => {
    const r = await q.ilk(`SELECT ${KAZANAN_SECIM} WHERE ${kosul}`, p)
    return r ? kazananOku(r) : null
  }
  return {
    async kazananEkle(k) {
      const r = await q.yaz(
        'INSERT INTO kazanan (donem, sira, oyuncu_id, takma_ad, puan, kod_ozeti, deneme, gecerlilik_ms) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [k.donem, k.sira, k.oyuncuId, k.takmaAd, k.puan, k.kodOzeti, k.deneme, k.gecerlilik],
      )
      return r.insertId
    },
    async kazananlar(donem) {
      return (await q.sec(`SELECT ${KAZANAN_SECIM} WHERE k.donem = ? ORDER BY k.sira`, [donem])).map(kazananOku)
    },
    sonSampiyon: () => bul('k.sira = 1 ORDER BY k.donem DESC LIMIT 1', []),
    oyuncununOdulu: (oyuncuId) => bul('k.oyuncu_id = ? ORDER BY k.donem DESC LIMIT 1', [oyuncuId]),
    kazananBul: (kodOzeti) => bul('k.kod_ozeti = ?', [kodOzeti]),
    async kazananKullan(id, simdi) {
      const r = await q.yaz('UPDATE kazanan SET kullanildi_ms = ? WHERE id = ? AND kullanildi_ms IS NULL', [simdi, id])
      return r.affectedRows === 1
    },
    async kazananlariSil() {
      return (await q.yaz('DELETE FROM kazanan')).affectedRows
    },
  }
}

function sayaclar(q: Sorgu): Parca<'sayacArtir' | 'sayaclar'> {
  return {
    async sayacArtir(gun, kanal) {
      await q.yaz('INSERT INTO gunluk_sayac (gun, kanal, tur) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE tur = tur + 1', [
        gun, kanal,
      ])
    },
    async sayaclar(gun) {
      const sayim: Record<Kanal, number> = { sofra: 0, ig: 0, site: 0, yok: 0 }
      for (const r of await q.sec('SELECT kanal, tur FROM gunluk_sayac WHERE gun = ?', [gun])) {
        sayim[r.kanal as Kanal] = sayi(r.tur)
      }
      return sayim
    },
  }
}

export function mariaDepoKur(url: string): Depo {
  const havuz = createPool({ ...baglantiCoz(url), connectionLimit: 5, bigIntAsNumber: true, insertIdAsNumber: true })
  const q: Sorgu = {
    sec: async (sql, p = []) => (await havuz.execute(sql, p)) as Satir[],
    ilk: async (sql, p = []) => ((await havuz.execute(sql, p)) as Satir[])[0] ?? null,
    yaz: async (sql, p = []) => (await havuz.execute(sql, p)) as Yazim,
  }
  return {
    ...jetonlar(q),
    ...oyuncular(q),
    ...turlar(q, havuz),
    ...donemler(q),
    ...kazananlar(q),
    ...sayaclar(q),
    kapat: () => havuz.end(),
  }
}
```

- [ ] **Step 3: Sözleşme testi (isteğe bağlı)**

`sunucu/mariaDepo.test.ts`:

```ts
import { readFileSync } from 'node:fs'
import { depoSozlesmesi } from './depoSozlesmesi.ts'
import { mariaDepoKur, semayiUygula } from './mariaDepo.ts'

/*
 * Gerçek MariaDB'ye karşı aynı sözleşme; isteğe bağlı, `npm test` hermetik kalır:
 *   docker run -d --name bozo-maria -e MARIADB_ROOT_PASSWORD=sifre -e MARIADB_DATABASE=bozo_test \
 *     -p 127.0.0.1:3399:3306 mariadb:10.11
 *   BOZO_TEST_DB_URL=mariadb://root:sifre@127.0.0.1:3399/bozo_test node --test sunucu/mariaDepo.test.ts
 */
const DB_URL = process.env.BOZO_TEST_DB_URL ?? null
const SEMA = readFileSync(new URL('./sema.sql', import.meta.url), 'utf8')
const TABLOLAR = ['kazanan', 'tur', 'donem', 'tur_jetonu', 'oyuncu', 'gunluk_sayac']

depoSozlesmesi(
  'mariaDepo',
  DB_URL
    ? async () => {
        await semayiUygula(DB_URL, SEMA, TABLOLAR)
        return mariaDepoKur(DB_URL)
      }
    : null,
)
```

- [ ] **Step 4: Hermetik koşu**

Run: `npm test 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)'`
Expected: `skipped 8` (MariaDB sözleşmesi, `BOZO_TEST_DB_URL` yok), `fail 0`.

- [ ] **Step 5: Docker ile gerçek MariaDB**

Docker Desktop'ın daemon'u kapalıysa `open -a Docker` ve `docker info` dönene kadar bekle.

Run:
```bash
docker run -d --name bozo-maria -e MARIADB_ROOT_PASSWORD=sifre -e MARIADB_DATABASE=bozo_test \
  -p 127.0.0.1:3399:3306 mariadb:10.11
sleep 15; docker exec bozo-maria mariadb -uroot -psifre -e 'SELECT VERSION()'
BOZO_TEST_DB_URL=mariadb://root:sifre@127.0.0.1:3399/bozo_test node --test sunucu/mariaDepo.test.ts 2>&1 | grep -E '^✖|^ℹ (pass|fail)'
docker rm -f bozo-maria
```
Expected: `10.11.19-MariaDB` (ya da 10.11.x); `ℹ pass 8`, `ℹ fail 0`. Ön doğrulamada 8/8 geçti.
Docker gelmezse: adaptör yalnız tip denetimi ve şemanın elle okunmasıyla doğrulanmış kalır; bunu
DEVAM.md'ye yaz.

- [ ] **Step 6: Commit**

```bash
git add sunucu/sema.sql sunucu/mariaDepo.ts sunucu/mariaDepo.test.ts
git commit -m "Add the MariaDB store and its schema"
```

---

### Task 5: Sitede "önce oyna, sonra kaydet": katılım ekranı, gönderim, haftalık sıra

**Files:**
- Modify: `content/tr/oyun.ts`, `content/en/oyun.ts`, `lib/oyun/defter.ts`, `lib/site.ts`,
  `lib/site.test.ts`, `lib/kabuk.ts`, `lib/kabuk.test.ts`, `components/sayfa/Kabuk.tsx`,
  `components/oyun/Saha.tsx`, `components/oyun/useOyunAlani.ts`, `components/oyun/useOyunDongusu.ts`,
  `components/oyun/OyunAcilisi.tsx`, `components/oyun/OyunAcilisi.module.css`,
  `components/oyun/SonucEkrani.tsx`, `components/oyun/SonucEkrani.module.css`,
  `components/oyun/OyunSayfasi.tsx`, `components/oyun/OyunSayfasi.module.css`
- Create: `components/oyun/GirisTablosu.tsx`, `components/oyun/GirisTablosu.module.css`,
  `components/oyun/GirisEkrani.tsx`, `components/oyun/GirisEkrani.module.css`,
  `components/oyun/KatilimEkrani.tsx`, `components/oyun/KatilimEkrani.module.css`,
  `components/oyun/SonucGonderim.tsx`, `components/oyun/useOyunAkisi.ts`

**Interfaces:**
- Consumes: `api`, `ApiHatasi`, `kanalCoz` (`lib/oyun/api`), `ONAY_SURUMU`, `SiraBilgisi`,
  `TabloYaniti` (`aktarim`), `rastgeleTohum`, `takmaAdDuzelt`, `takmaAdBicimiGecerliMi`,
  `TAKMA_AD_EN_COK`, `doldur` (`lib/metin`), `yol` (`lib/site`), `Girdi`, `Sonuc`.
- Produces:
  - `defter.ts`: `Hesap { anahtar, takmaAd }`, `anahtarUret()`, `hesapOku()`, `hesapYaz(hesap)`,
    `hesapSil()`.
  - `lib/site.ts`: `SayfaAnahtari` `'siralama'` ile genişler (`/oyun/siralama/`), `dizindeMi(anahtar)`.
  - `useOyunAkisi.ts`: `Gonderim`, `Ekran`, `Tur`, `Son`, `Kayit`, `useOyunAkisi()` →
    `{ ekran, tur, son, gonderim, hesap, bekliyor, basla, bitir, kaydet, tekrarDene, katil, vazgec, cik }`.
  - `Saha`, `useOyunAlani`, `useOyunDongusu`: `bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void`.
  - `OyunAcilisi`: `altinda?: ReactNode`.
  - `SonucEkrani` props: `gonderim`, `katil`, `tekrarDene` eklenir.
  - `KatilimEkrani({ dil, kaydet, vazgec })`, `GirisEkrani({ dil, basla, bekliyor })`,
    `GirisTablosu({ dil })`, `SiraSatiri`, `GonderimDurumu` (`SonucGonderim.tsx`).

- [ ] **Step 1: Sözlük anahtarları (TASLAK)**

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
  cik: 'Oyundan Çık',
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
  /** Sıralama ve katılım (spec §7, §8, §11). Katılım cümlesi Md. 11(2)(A) onayının metnidir. */
  siralamayaYaz: 'Bu Skoru Sıralamaya Yaz',
  siralama: {
    baslik: 'Sıralama',
    haftaninIlkUcu: 'Haftanın ilk üçü',
    buHafta: 'Bu hafta',
    tumZamanlar: 'Tüm zamanlar',
    sonSampiyon: 'Son şampiyon',
    sira: 'Sıran: {sira}',
    ustekiFark: 'bir üsttekine {fark} kaldı',
    sifirlanma: 'Sıfırlanır: {zaman}',
    bos: 'Bu hafta henüz skor yok.',
    gizliAd: 'Gizli',
    alinamadi: 'Sıralama şu an alınamıyor.',
    oyunaDon: 'Oyuna Dön',
  },
  katilim: {
    baslik: 'Sıralamaya katıl',
    takmaAd: 'Takma ad',
    kural: '3-12 karakter: harf, rakam, boşluk, nokta, alt çizgi, tire.',
    aciklama:
      "Takma adın ve turların Türkiye'deki sunucumuzda tutulur; takma adın herkese açık sıralamada görünür.",
    uyari: 'Hesap bu tarayıcıya bağlıdır: tarayıcı verisi silinirse hesap ve ödül kodu kaybolur.',
    kaydet: 'Kaydet ve Katıl',
    vazgec: 'Vazgeç',
    red: 'Bu takma ad kullanılamaz.',
    hata: 'Kayıt yapılamadı, tekrar dene.',
  },
  gonderim: {
    cevrimdisi: 'Çevrimdışı tur: sıralamaya girmez.',
    gonderiliyor: 'Sıralamaya yazılıyor',
    hata: 'Sıralamaya yazılamadı.',
    tekrarDene: 'Tekrar Dene',
    sira: 'Haftalık sıra: {sira}',
    enIyin: 'Haftalık en iyin: {puan}',
  },
  hesap: {
    hesabin: 'Hesabın: {ad}',
    sil: 'Hesabımı Sil',
    silSoru: 'Hesap, turlar ve ödül kodu silinir.',
    silOnay: 'Evet, Sil',
    silindi: 'Hesap silindi.',
    silinemedi: 'Silinemedi, tekrar dene.',
  },
  odul: {
    baslik: 'Ödül kodun',
    sira: 'Haftanın {sira}. sırası',
    gecerlilik: 'Son gün: {tarih}',
    ekranGoruntusu: 'Ekran görüntüsünü al; kodu sofrada göster.',
    kullanildi: 'Kullanıldı',
  },
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
  cik: 'Leave Game',
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
  siralamayaYaz: 'Put This Score on the Board',
  siralama: {
    baslik: 'Leaderboard',
    haftaninIlkUcu: 'Top three this week',
    buHafta: 'This week',
    tumZamanlar: 'All time',
    sonSampiyon: 'Last champion',
    sira: 'Your rank: {sira}',
    ustekiFark: '{fark} behind the one above',
    sifirlanma: 'Resets: {zaman}',
    bos: 'No scores yet this week.',
    gizliAd: 'Hidden',
    alinamadi: 'The leaderboard is not available right now.',
    oyunaDon: 'Back to the Game',
  },
  katilim: {
    baslik: 'Join the leaderboard',
    takmaAd: 'Nickname',
    kural: '3-12 characters: letters, digits, space, dot, underscore, hyphen.',
    aciklama:
      'Your nickname and rounds are stored on our server in Turkey; your nickname is shown on the public ' +
      'leaderboard.',
    uyari: 'The account is tied to this browser: if browser data is cleared, the account and the prize code are lost.',
    kaydet: 'Save and Join',
    vazgec: 'Cancel',
    red: 'This nickname cannot be used.',
    hata: 'Could not sign up, try again.',
  },
  gonderim: {
    cevrimdisi: 'Offline round: it does not count for the board.',
    gonderiliyor: 'Sending to the board',
    hata: 'Could not send to the board.',
    tekrarDene: 'Try Again',
    sira: 'Weekly rank: {sira}',
    enIyin: 'Your weekly best: {puan}',
  },
  hesap: {
    hesabin: 'Your account: {ad}',
    sil: 'Delete My Account',
    silSoru: 'The account, its rounds and the prize code are deleted.',
    silOnay: 'Yes, Delete',
    silindi: 'Account deleted.',
    silinemedi: 'Could not delete, try again.',
  },
  odul: {
    baslik: 'Your prize code',
    sira: 'Rank {sira} of the week',
    gecerlilik: 'Last day: {tarih}',
    ekranGoruntusu: 'Take a screenshot; show the code at the table.',
    kullanildi: 'Used',
  },
}
```

- [ ] **Step 2: Tarayıcı anahtarı**

`lib/oyun/defter.ts`:

```ts
/**
 * Oyunun tarayıcıda tuttukları: kişisel en iyi, ilk turun bittiği, ses tercihi (spec §3, §11,
 * §13) ve sıralama hesabı: 128 bitlik anahtar ile takma ad (spec §8, §10).
 */
const EN_IYI = 'bozo-oyun-en-iyi'
const ILK_TUR = 'bozo-oyun-ilk-tur-bitti'
const SES = 'bozo-oyun-ses'
const ANAHTAR = 'bozo-oyun-anahtar'
const TAKMA_AD = 'bozo-oyun-takma-ad'

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

export type Hesap = { anahtar: string; takmaAd: string }

/** Tarayıcı anahtarı: 16 rastgele bayt, hex. Sunucu yalnız özetini tutar. */
export function anahtarUret(): string {
  const baytlar = new Uint8Array(16)
  crypto.getRandomValues(baytlar)
  return Array.from(baytlar, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function hesapOku(): Hesap | null {
  try {
    const anahtar = window.localStorage.getItem(ANAHTAR)
    const takmaAd = window.localStorage.getItem(TAKMA_AD)
    return anahtar && /^[0-9a-f]{32}$/.test(anahtar) && takmaAd ? { anahtar, takmaAd } : null
  } catch {
    return null
  }
}

/** Yazılamazsa (depolama kapalı) hesap yalnız bu oturumda yaşar; katılım ekranı bunu söyler. */
export function hesapYaz(hesap: Hesap): boolean {
  try {
    window.localStorage.setItem(ANAHTAR, hesap.anahtar)
    window.localStorage.setItem(TAKMA_AD, hesap.takmaAd)
    return true
  } catch {
    return false
  }
}

export function hesapSil(): void {
  try {
    window.localStorage.removeItem(ANAHTAR)
    window.localStorage.removeItem(TAKMA_AD)
  } catch {
    // Zaten okunamıyordu; silecek bir şey yok.
  }
}
```

- [ ] **Step 3: `siralama` sayfa anahtarı**

`lib/site.ts`:

```ts
import { isletme } from '../content/isletme.ts'
import type { Dil, Isletme } from '../content/types.ts'

/** Sitenin tek mutlak adresi; canonical, sitemap ve sosyal kartlar buradan kurulur. */
export const SITE_URL = 'https://cigercibozo.com'

/** Dizine giren rotalar: sitemap, llms.txt, breadcrumb ve sayfa metası bunlardan türer. */
export type RotaAnahtari = 'ana' | 'menu' | 'galeri' | 'hikaye' | 'konum' | 'gizlilik'

/** Kabuğu taşıyan her sayfa. Oyun prototipi ve sıralaması noindex, dizine girmez. */
export type SayfaAnahtari = RotaAnahtari | 'oyun' | 'siralama'

const YOLLAR: Record<SayfaAnahtari, string> = {
  ana: '',
  menu: 'menu',
  galeri: 'galeri',
  hikaye: 'hikaye',
  konum: 'konum',
  gizlilik: 'gizlilik',
  oyun: 'oyun',
  siralama: 'oyun/siralama',
}

/** Sitemap, llms.txt ve breadcrumb yalnız dizindeki rotaları görür. */
export function dizindeMi(anahtar: SayfaAnahtari): anahtar is RotaAnahtari {
  return anahtar !== 'oyun' && anahtar !== 'siralama'
}

/** EN rotalarında yol adları Türkçe kalır: /en/menu/, /en/hikaye/. */
export function yol(anahtar: SayfaAnahtari, dil: Dil): string {
  const parca = YOLLAR[anahtar]
  const onek = dil === 'en' ? '/en' : ''
  return parca === '' ? `${onek}/` : `${onek}/${parca}/`
}

/**
 * Tarayıcıdaki yoldan dili okur. Yalnız 404'ün istemci tarafı kullanır; statik
 * export tek bir `out/404.html` ürettiği için sayfa hangi dilde istendiğini
 * sunucudan öğrenemez. Karşılaştırma dize öneki değil yol parçası üstünden:
 * 404 tam da uydurma yolları görür ve `/enfes-ciger/` İngilizce değildir.
 */
export function yoldanDil(yolAdi: string): Dil {
  return yolAdi === '/en' || yolAdi.startsWith('/en/') ? 'en' : 'tr'
}

export function tumYollar(): { anahtar: RotaAnahtari; tr: string; en: string }[] {
  const dizindekiler = (Object.keys(YOLLAR) as SayfaAnahtari[]).filter(dizindeMi)
  return dizindekiler.map((a) => ({
    anahtar: a,
    tr: yol(a, 'tr'),
    en: yol(a, 'en'),
  }))
}

/** "Ciğerci Bozo, Naci Talat Caddesi No:4, Girne, KKTC": Maps aramalarının metin hedefi. */
function adresMetni(isletmeVerisi: Isletme): string {
  // Cadde ile numara tek parça: "Naci Talat Caddesi, No:4" araması numarayı ayrı
  // bir bileşen sanır ve sonucu bozar.
  const sokak = isletmeVerisi.binaNo
    ? `${isletmeVerisi.cadde} ${isletmeVerisi.binaNo}`
    : isletmeVerisi.cadde
  return [isletmeVerisi.ad, sokak, isletmeVerisi.sehir, isletmeVerisi.ulke]
    .filter((parca): parca is string => Boolean(parca))
    .join(', ')
}

/** Google'daki işletme kartı (ad, saat, yorumlar). Place ID bilinmiyorken null. */
export function haritaUrl(isletmeVerisi: Isletme = isletme): string | null {
  const placeId = isletmeVerisi.googlePlaceId
  if (!placeId) return null
  const sorgu = encodeURIComponent(adresMetni(isletmeVerisi))
  return `https://www.google.com/maps/search/?api=1&query=${sorgu}&query_place_id=${placeId}`
}

/**
 * Yön tarifi: önce işletme kartına, sonra koordinata, en son adres aramasına.
 * `isletmeVerisi` parametresi yalnız testlerin gerçek veriyi değiştirmeden geri
 * dalları kapsayabilmesi için var; çağıranlar sıfır argümanla çağırır.
 */
export function yolTarifiUrl(isletmeVerisi: Isletme = isletme): string {
  const adres = encodeURIComponent(adresMetni(isletmeVerisi))
  // Hedef metin olmalı: koordinatla verilince Maps place ID'yi yok sayıp en yakın
  // kaydı ("Kıbrıs İnşaat") gösterdi, ölçüldü 8 Ekim 2026.
  if (isletmeVerisi.googlePlaceId) {
    return (
      `https://www.google.com/maps/dir/?api=1&destination=${adres}` +
      `&destination_place_id=${isletmeVerisi.googlePlaceId}`
    )
  }
  if (isletmeVerisi.koordinat) {
    const { enlem, boylam } = isletmeVerisi.koordinat
    return `https://www.google.com/maps/dir/?api=1&destination=${enlem},${boylam}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${adres}`
}

export function whatsappUrl(numara: string | null): string | null {
  if (!numara) return null
  return `https://wa.me/${numara.replace(/\D/g, '')}`
}

export function telefonUrl(numara: string | null): string | null {
  return numara ? `tel:${numara.replace(/\s/g, '')}` : null
}

/** `isletme.instagram` kullanıcı adıdır, tam URL değil; adres yalnız burada kurulur. */
export function instagramUrl(kullanici: string | null): string | null {
  return kullanici ? `https://instagram.com/${kullanici}` : null
}
```

`lib/site.test.ts`'te `./site.ts` içe aktarmasına `dizindeMi` eklenir ve `tumYollar_oyunuIcermez`
testi şununla değiştirilir:

```ts
test('yol_siralama_oyunAltinda', () => {
  assert.equal(yol('siralama', 'tr'), '/oyun/siralama/')
  assert.equal(yol('siralama', 'en'), '/en/oyun/siralama/')
})

/** Oyun prototipi noindex: sitemap ve llms.txt `tumYollar`'dan türer, oyun ve sıralaması oraya girmez. */
test('tumYollar_oyunuVeSiralamayiIcermez', () => {
  const anahtarlar = tumYollar().map((g) => g.anahtar as string)
  assert.equal(anahtarlar.includes('oyun') || anahtarlar.includes('siralama'), false)
  assert.equal(dizindeMi('oyun') || dizindeMi('siralama'), false)
  assert.equal(dizindeMi('menu'), true)
})
```

`lib/kabuk.ts` > `ustBarVaryanti` içinde `case 'oyun':` satırının altına `case 'siralama':`
eklenir. `lib/kabuk.test.ts` > `ustBar_oyun_icSayfaVaryantiTasir` testinin sonuna
`assert.deepEqual(ustBarVaryanti('siralama'), oyun)` eklenir.

`components/sayfa/Kabuk.tsx`: içe aktarma `import { dizindeMi, type SayfaAnahtari } from '@/lib/site'`
olur; breadcrumb koşulu `{aktif !== 'ana' && aktif !== 'oyun' && (` yerine
`{aktif !== 'ana' && dizindeMi(aktif) && (`.

- [ ] **Step 4: Dokunuş kaydı sonuçla birlikte döner**

`components/oyun/Saha.tsx`: `import type { Girdi, Sonuc, Urun } from '@/lib/oyun/tipler'` ve
`Props`:

```tsx
type Props = {
  dil: Dil
  tohum: number
  ipucu: boolean
  bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void
  cik: () => void
}
```

`components/oyun/useOyunAlani.ts`: tip içe aktarmasına `Girdi` eklenir;
`Secenek.bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void`.

`components/oyun/useOyunDongusu.ts`: tip içe aktarmasına `Girdi` eklenir; `Secenek`:

```ts
  tepki: (olaylar: Olay[]) => void
  /** Tur bitince sonuç ve dokunuş kaydı; kayıt sunucuya gider (spec §7). */
  bitince: (sonuc: Sonuc, kayit: readonly Girdi[]) => void
```

ve `kareSonu` içindeki çağrı:

```ts
    if (bitti) bitince({ puan: canli.oyun.puan, ozet: { ...canli.oyun.ozet }, bitti, tik: canli.oyun.tik }, canli.kayit)
```

- [ ] **Step 5: Giriş: `OyunAcilisi`'na `altinda` yuvası, tablo, giriş paneli**

`components/oyun/OyunAcilisi.tsx`:

```tsx
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { ROZET } from '@/components/ui/Rozet'
import stil from './OyunAcilisi.module.css'

type Props = { baslik: string; cumle: string; children: ReactNode; altinda?: ReactNode }

/** Kıvılcım: yatay savrulma ve yükselme (px), gecikme (ms). Sabit dizi; her açılış aynı. */
const KIVILCIMLAR = [
  [-96, 150, 0], [-62, 190, 60], [-34, 120, 140], [-12, 210, 30], [14, 170, 110], [38, 230, 20],
  [66, 140, 90], [92, 180, 50], [-78, 100, 170], [52, 110, 160], [-4, 250, 80], [110, 130, 130],
] as const

/**
 * Giriş ekranının açılışı, ~1,6 sn: kor tutuşur, rozet oturur, kıvılcım savrulur, bakır parlama
 * geçer, sonra başlık, cümle ve düğme. Yalnız CSS; dokunuş ya da tuş son hâle atlatır.
 */
export function OyunAcilisi({ baslik, cumle, children, altinda }: Props) {
  const [atla, setAtla] = useState(false)
  useEffect(() => {
    const tus = () => setAtla(true)
    window.addEventListener('keydown', tus, { once: true })
    return () => window.removeEventListener('keydown', tus)
  }, [])
  const maske = `url(${ROZET})`

  return (
    <section className={stil.acilis} data-atla={atla || undefined} onPointerDown={() => setAtla(true)}>
      <div className={stil.sahne} aria-hidden="true">
        <span className={stil.kor} />
        <span className={stil.rozet}>
          <img src={ROZET} alt="" width={1748} height={1999} decoding="async" />
          <span className={stil.parlama} style={{ maskImage: maske, WebkitMaskImage: maske }}>
            <span className={stil.bant} />
          </span>
        </span>
        <span className={stil.kivilcimlar}>
          {KIVILCIMLAR.map(([x, y, g], i) => (
            <span
              key={i}
              className={stil.kivilcim}
              style={{ '--x': `${x}px`, '--y': `${-y}px`, '--g': `${g}ms` } as CSSProperties}
            />
          ))}
        </span>
      </div>
      <h1 className={stil.baslik}>{baslik}</h1>
      <p className={stil.cumle}>{cumle}</p>
      <div className={stil.eylem}>{children}</div>
      {altinda && <div className={stil.altinda}>{altinda}</div>}
    </section>
  )
}
```

`components/oyun/OyunAcilisi.module.css`'te `@keyframes tutus` bloğundan önce eklenir:

```css
/* Düğmenin altındaki tablo: açılışın son adımı, aynı belirme. */
.altinda {
  width: 100%;
  animation: belir 400ms ease-out 1400ms both;
}

```

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

/** Giriş ekranı (spec §11): haftanın ilk üçü, son şampiyon, Sıralama ve Gizlilik bağlantıları. */
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

  return (
    <div className={stil.tablo}>
      {ilkUc.length > 0 && (
        <>
          <h2 className={stil.baslik}>{s.oyun.siralama.haftaninIlkUcu}</h2>
          <ol className={stil.liste}>
            {ilkUc.map((satir) => (
              <li key={satir.sira} className={stil.satir}>
                <span className={stil.sira}>{satir.sira}</span>
                <span className={stil.ad}>{ad(satir.takmaAd)}</span>
                <span className={stil.puan}>{sayi(satir.puan)}</span>
              </li>
            ))}
          </ol>
        </>
      )}
      {tablo?.sonSampiyon && (
        <p className={stil.sampiyon}>
          {s.oyun.siralama.sonSampiyon}: {ad(tablo.sonSampiyon.takmaAd)} · {sayi(tablo.sonSampiyon.puan)}
        </p>
      )}
      <nav className={stil.baglantilar} aria-label={s.oyun.baslik}>
        <Link href={yol('siralama', dil)} className={stil.baglanti}>
          {s.oyun.siralama.baslik}
        </Link>
        <Link href={yol('gizlilik', dil)} className={stil.baglanti}>
          {s.ortak.nav.gizlilik}
        </Link>
      </nav>
    </div>
  )
}
```

`components/oyun/GirisTablosu.module.css`:

```css
.tablo {
  display: grid;
  justify-items: center;
  gap: 8px;
  width: min(100%, 360px);
  margin: 8px auto 0;
}

.baslik {
  margin: 0;
  font: 500 14.5px/1.2 var(--font-govde);
  letter-spacing: 0.04em;
  color: var(--krem-70);
}

.liste {
  display: grid;
  gap: 2px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Sıra, ad, puan: rakamlar Bevan tabular, ad taşarsa kısalır. */
.satir {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 10px;
  min-height: 32px;
  padding: 0 10px;
  border-top: 1px solid var(--cizgi-kart);
}

.satir:first-child {
  border-top: 0;
}

.sira,
.puan {
  font-family: var(--font-baslik);
  font-variant-numeric: tabular-nums;
}

.sira {
  color: var(--bakir);
}

.ad {
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sampiyon {
  margin: 0;
  color: var(--krem-70);
}

.baglantilar {
  display: flex;
  gap: 8px;
}

.baglanti {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 10px;
  font: 500 14.5px/1.2 var(--font-govde);
  color: var(--bakir);
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

`components/oyun/GirisEkrani.tsx`:

```tsx
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { GirisTablosu } from './GirisTablosu'
import { OyunAcilisi } from './OyunAcilisi'
import stil from './GirisEkrani.module.css'

type Props = { dil: Dil; basla: () => void; bekliyor: boolean }

/** Giriş (spec §11): açılış, Oyna, altında haftanın ilk üçü ve son şampiyon. Jeton gelene kadar düğme kilitli. */
export function GirisEkrani({ dil, basla, bekliyor }: Props) {
  const s = sozluk(dil)
  return (
    <OyunAcilisi baslik={s.oyun.baslik} cumle={s.ana.gece.baslik} altinda={<GirisTablosu dil={dil} />}>
      <button type="button" className={stil.oyna} onClick={basla} disabled={bekliyor}>
        {s.oyun.oyna}
      </button>
    </OyunAcilisi>
  )
}
```

`components/oyun/GirisEkrani.module.css`:

```css
.oyna {
  min-width: 200px;
  min-height: 56px;
  border-radius: 3px;
  background: var(--kor);
  box-shadow: var(--kor-golge);
  font: 600 18px/1 var(--font-govde);
  color: var(--krem);
}

.oyna:disabled {
  opacity: 0.7;
}
```

`.oyna` `OyunSayfasi.module.css`'ten `GirisEkrani.module.css`'e taşındı; `OyunSayfasi.module.css`
tam hali:

`components/oyun/OyunSayfasi.module.css`:

```css
/* Kabuğun sabit barı ve sarkan rozeti için üst pay; turda kabuk gizli, pay da kalkar. */
.sayfa {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  align-content: start;
  min-height: 100dvh;
  padding: calc(var(--bar-boy) + var(--rozet-sarkma) + 12px) 12px 12px;
  color: var(--krem);
}

:global(body[data-odak]) .sayfa {
  padding-top: 12px;
}

/* Telefonda tam genişlik, masaüstünde 560px'lik tek sütun; cam panel sahanın zemini. */
.ekran {
  width: 100%;
  max-width: 560px;
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

- [ ] **Step 6: Katılım ekranı**

`components/oyun/KatilimEkrani.tsx`:

```tsx
import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { TAKMA_AD_EN_COK, takmaAdBicimiGecerliMi, takmaAdDuzelt } from '@/lib/oyun/takmaAd'
import { yol } from '@/lib/site'
import type { Kayit } from './useOyunAkisi'
import stil from './KatilimEkrani.module.css'

type Props = { dil: Dil; kaydet: (takmaAd: string) => Promise<Kayit>; vazgec: () => void }
type Durum = 'bos' | 'gonderiliyor' | 'red' | 'hata'
type AlanProps = { s: Sozluk; ad: string; hata: string | null; degis: (ad: string) => void }

/** Takma ad alanı: kural her zaman, hata varsa `role="alert"`; ikisi de alana bağlı. Odak açılışta burada. */
function TakmaAdAlani({ s, ad, hata, degis }: AlanProps) {
  const alanRef = useRef<HTMLInputElement>(null)
  useEffect(() => alanRef.current?.focus(), [])
  return (
    <>
      <label className={stil.etiket} htmlFor="takma-ad">
        {s.oyun.katilim.takmaAd}
      </label>
      <input
        ref={alanRef}
        id="takma-ad"
        className={stil.alan}
        value={ad}
        onChange={(e) => degis(e.target.value)}
        maxLength={TAKMA_AD_EN_COK}
        autoComplete="off"
        autoCapitalize="words"
        spellCheck={false}
        aria-invalid={hata ? true : undefined}
        aria-describedby={hata ? 'takma-ad-kural takma-ad-hata' : 'takma-ad-kural'}
      />
      <p id="takma-ad-kural" className={stil.kural}>
        {s.oyun.katilim.kural}
      </p>
      {hata && (
        <p id="takma-ad-hata" className={stil.hata} role="alert">
          {hata}
        </p>
      )}
    </>
  )
}

/**
 * Katılım ekranı (spec §8), tek amaçlı: takma ad, onay cümlesi, Gizlilik, "Kaydet ve Katıl".
 * Düğme Md. 11(2)(A) açık onayıdır. Biçim tarayıcıda, yasaklı liste sunucuda denetlenir.
 */
export function KatilimEkrani({ dil, kaydet, vazgec }: Props) {
  const s = sozluk(dil)
  const [ad, setAd] = useState('')
  const [durum, setDurum] = useState<Durum>('bos')

  const gonder = async (olay: FormEvent) => {
    olay.preventDefault()
    const duzgun = takmaAdDuzelt(ad)
    if (!takmaAdBicimiGecerliMi(duzgun)) return setDurum('red')
    setDurum('gonderiliyor')
    const sonuc = await kaydet(duzgun)
    if (sonuc !== 'tamam') setDurum(sonuc)
  }
  const degis = (yeni: string) => {
    setAd(yeni)
    setDurum('bos')
  }
  const hata = durum === 'red' ? s.oyun.katilim.red : durum === 'hata' ? s.oyun.katilim.hata : null

  return (
    <form className={stil.katilim} onSubmit={gonder} noValidate>
      <h2 className={stil.baslik}>{s.oyun.katilim.baslik}</h2>
      <TakmaAdAlani s={s} ad={ad} hata={hata} degis={degis} />
      <p className={stil.aciklama}>{s.oyun.katilim.aciklama}</p>
      <p className={stil.uyari}>{s.oyun.katilim.uyari}</p>
      <Link href={yol('gizlilik', dil)} className={stil.baglanti} target="_blank" rel="noopener">
        {s.ortak.nav.gizlilik}
      </Link>
      <div className={stil.dugmeler}>
        <button type="submit" className={stil.kaydet} disabled={durum === 'gonderiliyor'}>
          {s.oyun.katilim.kaydet}
        </button>
        <button type="button" className={stil.vazgec} onClick={vazgec}>
          {s.oyun.katilim.vazgec}
        </button>
      </div>
    </form>
  )
}
```

`components/oyun/KatilimEkrani.module.css`:

```css
/* Dikey ortalama yok: form üstten başlar, son düğme mobil eylem barının altında kalmaz. */
.katilim {
  display: grid;
  justify-items: stretch;
  gap: 10px;
  width: min(100%, 420px);
  margin: 0 auto;
}

.baslik {
  margin: 0 0 6px;
  font: 400 26px/1.15 var(--font-baslik);
  text-shadow: var(--golge-baslik);
}

.etiket {
  font: 500 14.5px/1.2 var(--font-govde);
  color: var(--krem-70);
}

/* Okunan metin: 16px tabanı, iOS'un odakta yakınlaştırmasını da keser. */
.alan {
  min-height: 48px;
  padding: 0 12px;
  border: 1px solid var(--cizgi-guclu);
  border-radius: 3px;
  background: var(--krem-dolgu);
  font: 400 16px/1.4 var(--font-govde);
  color: var(--krem);
}

.alan[aria-invalid='true'] {
  border-color: var(--kor);
}

.kural,
.aciklama,
.uyari {
  margin: 0;
  font: 400 14.5px/1.5 var(--font-govde);
  color: var(--krem-70);
}

.hata {
  margin: 0;
  font: 500 14.5px/1.5 var(--font-govde);
  color: var(--bakir-acik);
}

.aciklama {
  margin-top: 8px;
  color: var(--krem);
}

.baglanti {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  min-width: 44px;
  min-height: 44px;
  font: 500 14.5px/1.2 var(--font-govde);
  color: var(--bakir);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.dugmeler {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.kaydet {
  min-height: 56px;
  border-radius: 3px;
  background: var(--kor);
  box-shadow: var(--kor-golge);
  font: 600 18px/1 var(--font-govde);
  color: var(--krem);
}

.kaydet:disabled {
  opacity: 0.6;
}

.vazgec {
  min-height: 44px;
  font: 500 14.5px/1.2 var(--font-govde);
  color: var(--krem-70);
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

- [ ] **Step 7: Sonuç ekranı: haftalık sıra ve gönderim durumu**

`components/oyun/SonucGonderim.tsx`:

```tsx
import Link from 'next/link'
import { m } from 'motion/react'
import type { Sozluk } from '@/content'
import { doldur } from '@/lib/metin'
import type { Gonderim } from './useOyunAkisi'
import stil from './SonucEkrani.module.css'

/*
 * Sonuç ekranının sunucuya bakan iki parçası (spec §7, §11): puanın altındaki haftalık sıra
 * satırı ve "Tekrar Oyna"nın altındaki durum ya da "Bu Skoru Sıralamaya Yaz" düğmesi.
 */
type Ortak = { s: Sozluk; gonderim: Gonderim; sayi: (n: number) => string }

const GECIS = { duration: 0.3, ease: 'easeOut' as const }

export function SiraSatiri({ s, gonderim, sayi }: Ortak) {
  if (gonderim.durum !== 'gonderildi') return null
  const { hafta, buTurEnIyi } = gonderim
  const fark =
    hafta.ustekiFark === null ? '' : ` · ${doldur(s.oyun.siralama.ustekiFark, { fark: sayi(hafta.ustekiFark) })}`
  return (
    <m.p className={stil.sira} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={GECIS}>
      {doldur(s.oyun.gonderim.sira, { sira: hafta.sira })}
      {fark}
      {!buTurEnIyi && (
        <>
          <br />
          {doldur(s.oyun.gonderim.enIyin, { puan: sayi(hafta.puan) })}
        </>
      )}
    </m.p>
  )
}

type DurumProps = Ortak & { katil: () => void; tekrarDene: () => void; siralamaYolu: string }

export function GonderimDurumu({ s, gonderim, katil, tekrarDene, siralamaYolu }: DurumProps) {
  return (
    <div className={stil.gonderim}>
      {gonderim.durum === 'cevrimdisi' && <p className={stil.durum}>{s.oyun.gonderim.cevrimdisi}</p>}
      {gonderim.durum === 'gonderiliyor' && <p className={stil.durum}>{s.oyun.gonderim.gonderiliyor}</p>}
      {gonderim.durum === 'bekliyor' && (
        <button type="button" className={stil.ikincil} onClick={katil}>
          {s.oyun.siralamayaYaz}
        </button>
      )}
      {gonderim.durum === 'hata' && (
        <p className={stil.durum}>
          {s.oyun.gonderim.hata}{' '}
          <button type="button" className={stil.baglantiDugme} onClick={tekrarDene}>
            {s.oyun.gonderim.tekrarDene}
          </button>
        </p>
      )}
      <Link href={siralamaYolu} className={stil.baglanti}>
        {s.oyun.siralama.baslik}
      </Link>
    </div>
  )
}
```

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
import { OcakSonerIsareti } from './Semboller'
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

/** Özet satırları (spec §11): sofra, şiş, tam kıvam, en uzun kombo; sırayla belirir. */
function OzetListesi({ s, sonuc, sayi }: { s: Sozluk; sonuc: Sonuc; sayi: (n: number) => string }) {
  const satirlar = [
    [sonuc.ozet.sofra, s.oyun.ozet.sofra],
    [sonuc.ozet.sis, s.oyun.ozet.sis],
    [sonuc.ozet.tamKivam, s.oyun.ozet.tamKivam],
    [sonuc.ozet.enUzunKombo, s.oyun.ozet.enUzunKombo],
  ] as const
  return (
    <ul className={stil.ozet}>
      {satirlar.map(([deger, etiket], i) => (
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
  )
}

/** Saat mühürlenir: satır büyükten yerine oturur; azaltılmışta Motion ölçeği keser, opaklık kalır. */
const MUHUR = { initial: { opacity: 0, scale: 1.3 }, animate: { opacity: 1, scale: 1 }, transition: GECIS }

export function SonucEkrani({ dil, sonuc, onceki, yeni, tekrar, gonderim, katil, tekrarDene }: Props) {
  const s = sozluk(dil)
  const azalt = useHareketAzaltilmisMi()
  const sayilan = useSayac(sonuc.puan, azalt)
  const puanRef = useRef<HTMLHeadingElement>(null)
  const sayi = (n: number) => n.toLocaleString(dil === 'en' ? 'en-GB' : 'tr-TR')
  const satir = bitisSatiri(s, sonuc)
  const enIyi = enIyiSatiri(s, sonuc.puan, onceki, yeni, sayi)

  // Odak puana gider: ekran okuyucu düğmeyi değil sonucu duyar. Sayım görsel, gizli metin son değer.
  useEffect(() => puanRef.current?.focus(), [])

  return (
    <section className={stil.sonuc}>
      <img className={stil.rozet} src={ROZET} alt="" width={1748} height={1999} decoding="async" />
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
      <OzetListesi s={s} sonuc={sonuc} sayi={sayi} />
      {enIyi && <p className={stil.enIyi}>{enIyi}</p>}
      <SiraSatiri s={s} gonderim={gonderim} sayi={sayi} />
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
.sonuc {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 14px;
  min-height: calc(100dvh - 26px - var(--bar-boy) - var(--rozet-sarkma) - 2 * var(--kart-ic-orta));
  text-align: center;
}

/* Paylaşılan ekran görüntüsünde marka. */
.rozet {
  width: 84px;
  height: auto;
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

/* Haftalık sıra satırı (spec §11): kişisel en iyinin altında, bakır. */
.sira {
  margin: 0;
  color: var(--bakir);
}

.gonderim {
  display: grid;
  justify-items: center;
  gap: 6px;
}

.durum {
  margin: 0;
  color: var(--krem-70);
}

/* İkincil düğme: kor dolgu yok, kenarlık. "Bu Skoru Sıralamaya Yaz" Tekrar Oyna'nın altında. */
.ikincil {
  min-width: 200px;
  min-height: 48px;
  padding: 0 20px;
  border: 1px solid var(--cizgi-buton);
  border-radius: 3px;
  font: 600 16px/1 var(--font-govde);
  color: var(--krem);
}

.baglantiDugme,
.baglanti {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 10px;
  font: 500 14.5px/1.2 var(--font-govde);
  color: var(--bakir);
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

- [ ] **Step 8: Akış ve sayfa**

`components/oyun/useOyunAkisi.ts`:

```ts
import { useEffect, useState } from 'react'
import { ONAY_SURUMU, type SiraBilgisi } from '@/lib/oyun/aktarim'
import { api, ApiHatasi, kanalCoz } from '@/lib/oyun/api'
import {
  anahtarUret,
  enIyiOku,
  enIyiYaz,
  hesapOku,
  hesapSil,
  hesapYaz,
  ilkTurBitti,
  ilkTurMu,
  type Hesap,
} from '@/lib/oyun/defter'
import type { Girdi, Sonuc } from '@/lib/oyun/tipler'
import { rastgeleTohum } from '@/lib/oyun/tohum'

/*
 * "Önce oyna, sonra kaydet" (spec §7): tur başında jeton, sunucu yoksa çevrimdışı tur; sonuçta
 * katılmış oyuncu kendiliğinden gönderir, katılmamış olan "Bu skoru sıralamaya yaz" ile katılır.
 */
export type Gonderim =
  | { durum: 'cevrimdisi' }
  | { durum: 'bekliyor' }
  | { durum: 'gonderiliyor' }
  | { durum: 'gonderildi'; hafta: SiraBilgisi; buTurEnIyi: boolean }
  | { durum: 'hata' }

export type Ekran = 'giris' | 'oyun' | 'sonuc' | 'katilim'
export type Tur = { tohum: number; turId: string | null; ipucu: boolean }
export type Son = { sonuc: Sonuc; kayit: readonly Girdi[]; turId: string | null; onceki: number | null; yeni: boolean }
export type Kayit = 'tamam' | 'red' | 'hata'

/** Jeton sunucudan; ulaşılamazsa yerel tohumla çevrimdışı tur. */
async function jetonIste(): Promise<Tur> {
  const ipucu = ilkTurMu()
  try {
    const jeton = await api.turAl(kanalCoz(window.location.search))
    return { tohum: jeton.tohum, turId: jeton.turId, ipucu }
  } catch {
    return { tohum: rastgeleTohum(), turId: null, ipucu }
  }
}

/** Yanıtı kaybolmuş (yakılmış jeton) gönderim sırayı /ben'den alır; silinmiş hesap düşer. */
async function turuGonder(turId: string, kayit: readonly Girdi[], hesap: Hesap): Promise<Gonderim | 'hesapYok'> {
  try {
    const yanit = await api.turBitir(turId, hesap.anahtar, kayit)
    return { durum: 'gonderildi', hafta: yanit.hafta, buTurEnIyi: yanit.buTurEnIyi }
  } catch (hata) {
    if (!(hata instanceof ApiHatasi)) return { durum: 'hata' }
    if (hata.durum === 401) return 'hesapYok'
    if (hata.kod === 'jetonKullanildi') {
      const ben = await api.benAl(hesap.anahtar).catch(() => null)
      if (ben?.hafta) return { durum: 'gonderildi', hafta: ben.hafta, buTurEnIyi: false }
    }
    return { durum: 'hata' }
  }
}

/** Hesap ve gönderim durumu. Depolama yalnız tarayıcıda: ilk çizim sunucu çıktısıyla aynı kalır. */
function useGonderim() {
  const [hesap, setHesap] = useState<Hesap | null>(null)
  const [gonderim, setGonderim] = useState<Gonderim>({ durum: 'cevrimdisi' })
  useEffect(() => setHesap(hesapOku()), [])

  const gonder = async (turId: string, kayit: readonly Girdi[], kimin: Hesap) => {
    setGonderim({ durum: 'gonderiliyor' })
    const sonuc = await turuGonder(turId, kayit, kimin)
    if (sonuc !== 'hesapYok') return setGonderim(sonuc)
    hesapSil()
    setHesap(null)
    setGonderim({ durum: 'bekliyor' })
  }

  /** Katılım: anahtar üretilir, sunucuya kayıt, tarayıcıya yazım; sonra bekleyen tur gönderilir. */
  const kaydet = async (takmaAd: string, son: Son | null): Promise<Kayit> => {
    const anahtar = anahtarUret()
    try {
      await api.oyuncuOl(takmaAd, anahtar, ONAY_SURUMU)
    } catch (hata) {
      return hata instanceof ApiHatasi && hata.durum === 422 ? 'red' : 'hata'
    }
    const yeniHesap = { anahtar, takmaAd }
    hesapYaz(yeniHesap)
    setHesap(yeniHesap)
    if (son?.turId) void gonder(son.turId, son.kayit, yeniHesap)
    return 'tamam'
  }

  return { hesap, gonderim, setGonderim, gonder, kaydet }
}

export function useOyunAkisi() {
  const [ekran, setEkran] = useState<Ekran>('giris')
  const [tur, setTur] = useState<Tur | null>(null)
  const [son, setSon] = useState<Son | null>(null)
  const [bekliyor, setBekliyor] = useState(false)
  const { hesap, gonderim, setGonderim, gonder, kaydet } = useGonderim()

  const basla = async () => {
    if (bekliyor) return
    setBekliyor(true)
    const yeniTur = await jetonIste()
    setBekliyor(false)
    setTur(yeniTur)
    setEkran('oyun')
  }

  const bitir = (sonuc: Sonuc, kayit: readonly Girdi[]) => {
    const onceki = enIyiOku()
    const yeni = enIyiYaz(sonuc.puan)
    ilkTurBitti()
    const turId = tur?.turId ?? null
    setSon({ sonuc, kayit, turId, onceki, yeni })
    setEkran('sonuc')
    if (!turId) return setGonderim({ durum: 'cevrimdisi' })
    if (!hesap) return setGonderim({ durum: 'bekliyor' })
    void gonder(turId, kayit, hesap)
  }

  return {
    ekran, tur, son, gonderim, hesap, bekliyor, basla, bitir,
    kaydet: async (takmaAd: string) => {
      const sonuc = await kaydet(takmaAd, son)
      if (sonuc === 'tamam') setEkran('sonuc')
      return sonuc
    },
    tekrarDene: () => {
      if (son?.turId && hesap) void gonder(son.turId, son.kayit, hesap)
    },
    katil: () => setEkran('katilim'),
    vazgec: () => setEkran('sonuc'),
    cik: () => setEkran('giris'),
  }
}
```

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
import { useOyunAkisi } from './useOyunAkisi'
import stil from './OyunSayfasi.module.css'

/** Ekran geçişi (spec §12): Motion yalnız burada ve sonuç satırlarında; `reducedMotion="user"` kaymayı keser,
 *  opaklık kalır. */
const EKRAN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: 'easeOut' as const },
}

/** `AnimatePresence`'ın doğrudan çocuğu: anahtarlı Motion sarmalı ve cam panel. */
function panel(anahtar: string, dolgu: 'orta' | 'yok', icerik: ReactNode) {
  return (
    <m.div key={anahtar} className={stil.ekran} {...EKRAN}>
      <CamPanel opaklik={0.74} bulanik={false} dolgu={dolgu} className={stil.panel}>
        {icerik}
      </CamPanel>
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
        <div className={stil.sayfa}>
          {akis.ekran !== 'giris' && <h1 className={stil.gizliBaslik}>{s.oyun.baslik}</h1>}
          <AnimatePresence mode="wait" initial={false}>
            {akis.ekran === 'giris' &&
              panel('giris', 'orta', <GirisEkrani dil={dil} basla={akis.basla} bekliyor={akis.bekliyor} />)}
            {akis.ekran === 'oyun' &&
              tur &&
              panel(
                `oyun-${tur.tohum}`,
                'yok',
                <Saha dil={dil} tohum={tur.tohum} ipucu={tur.ipucu} bitince={akis.bitir} cik={akis.cik} />,
              )}
            {akis.ekran === 'sonuc' &&
              son &&
              panel(
                'sonuc',
                'orta',
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
              panel('katilim', 'orta', <KatilimEkrani dil={dil} kaydet={akis.kaydet} vazgec={akis.vazgec} />)}
          </AnimatePresence>
        </div>
      </LazyMotion>
    </MotionConfig>
  )
}
```

- [ ] **Step 9: Typecheck, test, build**

Run: `npm run typecheck && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)' && npm run build 2>&1 | grep -E 'error|○ /oyun'`
Expected: typecheck temiz; `tests 356`, `pass 348`, `fail 0`, `skipped 8`; build hatasız,
`○ /oyun` ve `○ /en/oyun` (sıralama rotası Task 6'da gelir). `content/icerik.test.ts`'in sözlük
eşitliği ve em dash testleri geçer.

- [ ] **Step 10: Commit**

```bash
git add content/tr/oyun.ts content/en/oyun.ts lib/oyun/defter.ts lib/site.ts lib/site.test.ts \
  lib/kabuk.ts lib/kabuk.test.ts components/sayfa/Kabuk.tsx components/oyun/Saha.tsx \
  components/oyun/useOyunAlani.ts components/oyun/useOyunDongusu.ts components/oyun/OyunAcilisi.tsx \
  components/oyun/OyunAcilisi.module.css components/oyun/GirisTablosu.tsx components/oyun/GirisTablosu.module.css \
  components/oyun/GirisEkrani.tsx components/oyun/GirisEkrani.module.css components/oyun/KatilimEkrani.tsx \
  components/oyun/KatilimEkrani.module.css components/oyun/SonucGonderim.tsx components/oyun/SonucEkrani.tsx \
  components/oyun/SonucEkrani.module.css components/oyun/useOyunAkisi.ts components/oyun/OyunSayfasi.tsx \
  components/oyun/OyunSayfasi.module.css
git commit -m "Submit rounds from the result screen and add the join screen"
```

---

### Task 6: Sıralama sayfası ve tarayıcı denetimleri

**Files:**
- Create: `components/oyun/useSiralama.ts`, `components/oyun/SiralamaSayfasi.tsx`,
  `components/oyun/SiralamaSayfasi.module.css`, `app/(tr)/oyun/siralama/page.tsx`,
  `app/(en)/en/oyun/siralama/page.tsx`

**Interfaces:**
- Consumes: `api`, `ApiHatasi`, `BenYaniti`, `TabloYaniti`, `hesapOku`, `hesapSil`, `Hesap`,
  `doldur`, `sifirlanmaMetni`, `tarihMetni`, `yol('oyun' | 'siralama')`, `Kabuk`
  (`aktif="siralama"`).
- Produces: `useSiralama()` → `{ tablo, hesap, ben, silme, sor, vazgec, sil }`;
  `SiralamaSayfasi({ dil })` (istemci sınırı).

- [ ] **Step 1: Veri kancası ve sayfa**

`components/oyun/useSiralama.ts`:

```ts
import { useEffect, useState } from 'react'
import type { BenYaniti, TabloYaniti } from '@/lib/oyun/aktarim'
import { api, ApiHatasi } from '@/lib/oyun/api'
import { hesapOku, hesapSil, type Hesap } from '@/lib/oyun/defter'

export type Yukleme<T> = { durum: 'yukleniyor' } | { durum: 'hata' } | { durum: 'tamam'; veri: T }
export type Silme = 'yok' | 'soruyor' | 'siliniyor' | 'silindi' | 'hata'

/** Sıralama sayfasının verisi: herkese açık tablo, varsa oyuncunun kendi satırı ve ödülü, hesap silme. */
export function useSiralama() {
  const [tablo, setTablo] = useState<Yukleme<TabloYaniti>>({ durum: 'yukleniyor' })
  const [hesap, setHesap] = useState<Hesap | null>(null)
  const [ben, setBen] = useState<BenYaniti | null>(null)
  const [silme, setSilme] = useState<Silme>('yok')

  useEffect(() => {
    api.tabloAl().then(
      (veri) => setTablo({ durum: 'tamam', veri }),
      () => setTablo({ durum: 'hata' }),
    )
  }, [])

  useEffect(() => {
    const kayitli = hesapOku()
    setHesap(kayitli)
    if (!kayitli) return
    // Sunucu hesabı silmişse (90 gün) tarayıcıdaki anahtar da gider.
    api.benAl(kayitli.anahtar).then(setBen, (hata: unknown) => {
      if (hata instanceof ApiHatasi && hata.durum === 401) {
        hesapSil()
        setHesap(null)
      }
    })
  }, [])

  const sil = async () => {
    if (!hesap) return
    setSilme('siliniyor')
    try {
      await api.hesabiSil(hesap.anahtar)
    } catch {
      return setSilme('hata')
    }
    hesapSil()
    setHesap(null)
    setBen(null)
    setSilme('silindi')
  }

  return { tablo, hesap, ben, silme, sor: () => setSilme('soruyor'), vazgec: () => setSilme('yok'), sil }
}
```

`components/oyun/SiralamaSayfasi.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { CamPanel } from '@/components/ui/CamPanel'
import { sozluk, type Sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { doldur } from '@/lib/metin'
import type { BenYaniti, TabloYaniti } from '@/lib/oyun/aktarim'
import { sifirlanmaMetni, tarihMetni } from '@/lib/oyun/tarih'
import { yol } from '@/lib/site'
import { useSiralama, type Silme } from './useSiralama'
import stil from './SiralamaSayfasi.module.css'

/* Sıralama sayfası (spec §11): haftanın ilk 10'u, oyuncunun sırası ve farkı, son şampiyon, sıfırlanma. */

const GECIS = { duration: 0.3, ease: 'easeOut' as const }
type Sayi = (n: number) => string

function Tablo({ s, dil, tablo, sayi }: { s: Sozluk; dil: Dil; tablo: TabloYaniti; sayi: Sayi }) {
  const ad = (takmaAd: string | null) => takmaAd ?? s.oyun.siralama.gizliAd
  return (
    <>
      <h2 className={stil.altBaslik}>{s.oyun.siralama.buHafta}</h2>
      {tablo.hafta.length === 0 ? (
        <p className={stil.not}>{s.oyun.siralama.bos}</p>
      ) : (
        <ol className={stil.liste}>
          {tablo.hafta.map((satir, i) => (
            <m.li
              key={satir.sira}
              className={stil.satir}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...GECIS, delay: i * 0.05 }}
            >
              <span className={stil.sira}>{satir.sira}</span>
              <span className={stil.ad}>{ad(satir.takmaAd)}</span>
              <span className={stil.puan}>{sayi(satir.puan)}</span>
            </m.li>
          ))}
        </ol>
      )}
      {tablo.sonSampiyon && (
        <p className={stil.not}>
          {s.oyun.siralama.sonSampiyon}: {ad(tablo.sonSampiyon.takmaAd)} · {sayi(tablo.sonSampiyon.puan)}
        </p>
      )}
      <p className={stil.not}>{doldur(s.oyun.siralama.sifirlanma, { zaman: sifirlanmaMetni(tablo.bitis, dil) })}</p>
    </>
  )
}

function Ben({ s, dil, ben, sayi }: { s: Sozluk; dil: Dil; ben: BenYaniti; sayi: Sayi }) {
  const { hafta, odul } = ben
  return (
    <>
      {hafta && (
        <p className={stil.ben}>
          {doldur(s.oyun.siralama.sira, { sira: hafta.sira })}
          {hafta.ustekiFark !== null &&
            ` · ${doldur(s.oyun.siralama.ustekiFark, { fark: sayi(hafta.ustekiFark) })}`}
        </p>
      )}
      {odul && (
        <section className={stil.odul} aria-labelledby="odul-baslik">
          <h2 id="odul-baslik" className={stil.altBaslik}>
            {s.oyun.odul.baslik}
          </h2>
          <p className={stil.kod}>{odul.kod}</p>
          <p className={stil.not}>
            {doldur(s.oyun.odul.sira, { sira: odul.sira })} ·{' '}
            {doldur(s.oyun.odul.gecerlilik, { tarih: tarihMetni(odul.gecerlilik, dil) })}
          </p>
          <p className={stil.not}>{odul.kullanildi ? s.oyun.odul.kullanildi : s.oyun.odul.ekranGoruntusu}</p>
        </section>
      )}
    </>
  )
}

type HesapProps = { s: Sozluk; takmaAd: string; silme: Silme; sor: () => void; vazgec: () => void; sil: () => void }

/** "Hesabımı sil" (spec §8): iki dokunuş, ikincisi onay. */
function Hesap({ s, takmaAd, silme, sor, vazgec, sil }: HesapProps) {
  return (
    <div className={stil.hesap}>
      <p className={stil.not}>{doldur(s.oyun.hesap.hesabin, { ad: takmaAd })}</p>
      {silme === 'yok' ? (
        <button type="button" className={stil.baglantiDugme} onClick={sor}>
          {s.oyun.hesap.sil}
        </button>
      ) : (
        <>
          <p className={stil.not}>{silme === 'hata' ? s.oyun.hesap.silinemedi : s.oyun.hesap.silSoru}</p>
          <div className={stil.dugmeler}>
            <button type="button" className={stil.tehlike} onClick={sil} disabled={silme === 'siliniyor'}>
              {s.oyun.hesap.silOnay}
            </button>
            <button type="button" className={stil.baglantiDugme} onClick={vazgec}>
              {s.oyun.katilim.vazgec}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function SiralamaSayfasi({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  const { tablo, hesap, ben, silme, sor, vazgec, sil } = useSiralama()
  const sayi: Sayi = (n) => n.toLocaleString(dil === 'en' ? 'en-GB' : 'tr-TR')

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div className={stil.sayfa}>
          <CamPanel opaklik={0.74} dolgu="orta" bulanik={false} className={stil.panel}>
            <section className={stil.siralama}>
              <h1 className={stil.baslik}>{s.oyun.siralama.baslik}</h1>
              {tablo.durum === 'hata' && <p className={stil.not}>{s.oyun.siralama.alinamadi}</p>}
              {tablo.durum === 'tamam' && <Tablo s={s} dil={dil} tablo={tablo.veri} sayi={sayi} />}
              {ben && <Ben s={s} dil={dil} ben={ben} sayi={sayi} />}
              {silme === 'silindi' && <p className={stil.not}>{s.oyun.hesap.silindi}</p>}
              {hesap && <Hesap s={s} takmaAd={hesap.takmaAd} silme={silme} sor={sor} vazgec={vazgec} sil={sil} />}
              <Link href={yol('oyun', dil)} className={stil.oyunaDon}>
                {s.oyun.siralama.oyunaDon}
              </Link>
            </section>
          </CamPanel>
        </div>
      </LazyMotion>
    </MotionConfig>
  )
}
```

`components/oyun/SiralamaSayfasi.module.css`:

```css
/* Oyun sayfasıyla aynı yerleşim: kabuğun barı ve sarkan rozeti için üst pay, 560px tek sütun. */
.sayfa {
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  align-content: start;
  min-height: 100dvh;
  padding: calc(var(--bar-boy) + var(--rozet-sarkma) + 12px) 12px 12px;
  color: var(--krem);
}

.panel {
  width: 100%;
  max-width: 560px;
}

.siralama {
  display: grid;
  justify-items: center;
  gap: 12px;
  text-align: center;
}

.baslik {
  margin: 0;
  font: 400 32px/1.1 var(--font-baslik);
  text-shadow: var(--golge-baslik);
}

.altBaslik {
  margin: 6px 0 0;
  font: 500 14.5px/1.2 var(--font-govde);
  letter-spacing: 0.04em;
  color: var(--krem-70);
}

.liste {
  display: grid;
  gap: 2px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Sıra, ad, puan: rakamlar Bevan tabular, uzun ad kısalır. */
.satir {
  display: grid;
  grid-template-columns: 32px 1fr auto;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 10px;
  border-top: 1px solid var(--cizgi-kart);
}

.satir:first-child {
  border-top: 0;
}

.sira,
.puan {
  font-family: var(--font-baslik);
  font-variant-numeric: tabular-nums;
}

.sira {
  color: var(--bakir);
}

.ad {
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.not {
  margin: 0;
  color: var(--krem-70);
}

.ben {
  margin: 4px 0 0;
  color: var(--bakir);
}

.odul {
  display: grid;
  justify-items: center;
  gap: 6px;
  width: 100%;
  padding: 14px 10px;
  border: 1px solid var(--bakir-32);
  border-radius: 3px;
}

/* Kod sofrada telefondan okunur: büyük, aralıklı, tabular. */
.kod {
  margin: 0;
  font: 400 40px/1 var(--font-baslik);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.12em;
  color: var(--bakir-acik);
}

.hesap {
  display: grid;
  justify-items: center;
  gap: 6px;
  margin-top: 8px;
}

.dugmeler {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.tehlike {
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--cizgi-buton);
  border-radius: 3px;
  font: 500 14.5px/1.2 var(--font-govde);
  color: var(--krem);
}

.tehlike:disabled {
  opacity: 0.6;
}

.baglantiDugme {
  min-height: 44px;
  padding: 0 10px;
  font: 500 14.5px/1.2 var(--font-govde);
  color: var(--krem-70);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.oyunaDon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  min-height: 56px;
  margin-top: 8px;
  border-radius: 3px;
  background: var(--kor);
  box-shadow: var(--kor-golge);
  font: 600 18px/1 var(--font-govde);
  color: var(--krem);
  text-decoration: none;
}
```

- [ ] **Step 2: Rotalar**

`app/(tr)/oyun/siralama/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { SiralamaSayfasi } from '@/components/oyun/SiralamaSayfasi'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { tr } from '@/content'

// Prototip: dizine girmez; sitemap'te, menüde ve çekmecede yok (spec §19 karar 8).
export const metadata: Metadata = {
  title: `${tr.oyun.siralama.baslik} · ${tr.oyun.baslik} · ${tr.ortak.marka.ad}`,
  robots: { index: false, follow: false },
}

export default function Sayfa() {
  return (
    <Kabuk dil="tr" aktif="siralama">
      <SiralamaSayfasi dil="tr" />
    </Kabuk>
  )
}
```

`app/(en)/en/oyun/siralama/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { SiralamaSayfasi } from '@/components/oyun/SiralamaSayfasi'
import { Kabuk } from '@/components/sayfa/Kabuk'
import { en } from '@/content'

// Prototip: dizine girmez; sitemap'te, menüde ve çekmecede yok (spec §19 karar 8).
export const metadata: Metadata = {
  title: `${en.oyun.siralama.baslik} · ${en.oyun.baslik} · ${en.ortak.marka.ad}`,
  robots: { index: false, follow: false },
}

export default function Sayfa() {
  return (
    <Kabuk dil="en" aktif="siralama">
      <SiralamaSayfasi dil="en" />
    </Kabuk>
  )
}
```

- [ ] **Step 3: Build, sitemap, noindex, API adresi**

Yerel sunucuya karşı derleme (Task 3 adım 7'deki sunucu 8402'de açık):

Run:
```bash
NEXT_PUBLIC_OYUN_API=http://127.0.0.1:8402 npm run build 2>&1 | grep -E 'error|oyun'
grep -c oyun out/sitemap.xml; grep -c oyun out/llms.txt
grep -o '<meta name="robots"[^>]*>' out/oyun/siralama/index.html out/en/oyun/siralama/index.html
grep -o '127.0.0.1:8402' out/_next/static/chunks/*.js | sort | uniq -c
```
Expected: `○ /oyun`, `○ /oyun/siralama`, `○ /en/oyun`, `○ /en/oyun/siralama`; `0` ve `0`;
iki dosyada `<meta name="robots" content="noindex, nofollow"/>`; API adresi tek chunk'ta bir kez.
`NEXT_PUBLIC_OYUN_API` verilmeden derlenince aynı yerde `api.cigercibozo.com` durur.

- [ ] **Step 4: Tarayıcı: uçtan uca akış**

`out/` 8398'de sunulur: `python3 -m http.server 8398 --directory <mutlak out yolu>` (bellekteki
`olcum-harnesi` notu: `--directory` şart, 8391 sahibinin). Sunucu `KOKEN=http://localhost:8398` ile
8402'de koşar; sayfa `localhost:8398`'den açılır, `Origin` buna eşittir.

`/tmp/bozo-oyun/plan3/akis.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const AXE = '/Users/mk/.npm/_npx/1fc4933a57a44b8f/node_modules/axe-core/axe.min.js'
const KOK = process.argv[2] ?? 'http://localhost:8398'
const ETIKETLER = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
// Uçtan uca (spec §7, §16): oyna → "Bu Skoru Sıralamaya Yaz" → katıl → sıra gelir → sıralama sayfası → hesabı sil.
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
const p = await c.newPage()
const hatalar = []
p.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
p.on('pageerror', (e) => hatalar.push(String(e)))
const axe = async (an) => {
  await p.addScriptTag({ path: AXE })
  const r = await p.evaluate(async (e) => (await window.axe.run(document, { runOnly: { type: 'tag', values: e } })).violations, ETIKETLER)
  const tasma = await p.evaluate(() => document.documentElement.scrollWidth)
  console.log(an, 'axe ihlal', r.length, JSON.stringify(r.map((v) => `${v.id}:${v.nodes.length}`)), 'yatay genişlik', tasma)
}
await p.goto(KOK + '/oyun/')
await p.waitForLoadState('networkidle')
await p.waitForTimeout(1800)
console.log('giriş bağlantıları:', await p.locator('nav[aria-label] a').allTextContents())
await p.getByRole('button', { name: 'Oyna' }).click()
// İlk misafire ipucuyla servis, sonra tur kendi biter (üç sofra kalkar, ~50 sn).
const t0 = Date.now()
while (Date.now() - t0 < 20000) {
  const ipucu = p.locator('[data-ipucu]')
  if (await ipucu.count()) await ipucu.first().click().catch(() => {})
  if (Number(await p.locator('[data-ciz="puan"]').textContent()) > 0) break
  await p.waitForTimeout(50)
}
await p.getByRole('button', { name: 'Tekrar Oyna' }).waitFor({ timeout: 150000 })
await p.waitForTimeout(1200)
console.log('sonuç (katılmamış):', (await p.locator('main').innerText()).replace(/\n+/g, ' | '))
await p.getByRole('button', { name: 'Bu Skoru Sıralamaya Yaz' }).click()
await p.getByLabel('Takma ad').waitFor()
await p.waitForTimeout(400)
console.log('katılım odak:', await p.evaluate(() => document.activeElement.id))
await axe('katılım')
await p.getByLabel('Takma ad').fill('ab')
await p.getByRole('button', { name: 'Kaydet ve Katıl' }).click()
console.log('kısa ad:', await p.locator('#takma-ad-hata').textContent())
await p.getByLabel('Takma ad').fill('Bozo')
await p.getByRole('button', { name: 'Kaydet ve Katıl' }).click()
await p.locator('#takma-ad-hata').waitFor()
console.log('ayrılmış ad:', await p.locator('#takma-ad-hata').textContent())
await p.getByLabel('Takma ad').fill('Gece Kuşu')
await p.getByRole('button', { name: 'Kaydet ve Katıl' }).click()
await p.getByText('Haftalık sıra: 1').waitFor({ timeout: 10000 })
await p.waitForTimeout(600)
console.log('sonuç (katıldı):', (await p.locator('main').innerText()).replace(/\n+/g, ' | '))
await axe('sonuç')
console.log('depo:', await p.evaluate(() => [localStorage.getItem('bozo-oyun-takma-ad'), localStorage.getItem('bozo-oyun-anahtar')?.length]))
await p.getByRole('link', { name: 'Sıralama' }).click()
await p.waitForURL('**/oyun/siralama/')
await p.waitForLoadState('networkidle')
await p.getByText('Sıran: 1').waitFor({ timeout: 10000 })
await p.waitForTimeout(800)
console.log('sıralama:', (await p.locator('main').innerText()).replace(/\n+/g, ' | '))
await axe('sıralama')
await p.getByRole('button', { name: 'Hesabımı Sil' }).click()
await p.getByRole('button', { name: 'Evet, Sil' }).click()
await p.getByText('Hesap silindi.').waitFor({ timeout: 10000 })
console.log('silindi, depo:', await p.evaluate(() => localStorage.getItem('bozo-oyun-anahtar')))
await p.getByRole('link', { name: 'Oyuna Dön' }).click()
await p.waitForURL('**/oyun/')
await p.waitForTimeout(1800)
console.log('giriş tablosu (silinmiş hesap):', (await p.locator('main').innerText()).replace(/\n+/g, ' | '))
console.log('konsol hataları', JSON.stringify(hatalar))
await b.close()
```

Run: `node /tmp/bozo-oyun/plan3/akis.mjs http://localhost:8398`
Expected (ön doğrulamada ölçülen; puan ve saat tura göre değişir):
```
sonuç (katılmamış): Sofra Yetiştir | 23:22 · üç sofra kalktı | Puan: -250 | -250 | 1 sofra | 1 şiş | 1 tam kıvam | 1 en uzun kombo | Tekrar Oyna | Bu Skoru Sıralamaya Yaz | Sıralama
katılım odak: takma-ad
katılım axe ihlal 0 [] yatay genişlik 390
kısa ad: Bu takma ad kullanılamaz.
ayrılmış ad: Bu takma ad kullanılamaz.
sonuç (katıldı): Sofra Yetiştir | 23:22 · üç sofra kalktı | Puan: -250 | -250 | 1 sofra | 1 şiş | 1 tam kıvam | 1 en uzun kombo | Haftalık sıra: 1 | Tekrar Oyna | Sıralama
sonuç axe ihlal 0 [] yatay genişlik 390
depo: [ 'Gece Kuşu', 32 ]
sıralama: Sıralama | Bu hafta | 1 | Gece Kuşu | -250 | Sıfırlanır: 12 Ekim Pazartesi 05:00 | Sıran: 1 | Hesabın: Gece Kuşu | Hesabımı Sil | Oyuna Dön
sıralama axe ihlal 0 [] yatay genişlik 390
silindi, depo: null
giriş tablosu (silinmiş hesap): Sofra Yetiştir | Girne uyurken ocak yanıyor | Oyna | Haftanın ilk üçü | 1 | Gece Kuşu | -250 | Sıralama | Gizlilik
konsol hataları ["Failed to load resource: the server responded with a status of 422 (Unprocessable Entity)"]
```
Ölçütler: üç axe satırı 0; katılım odağı `takma-ad`; iki ret aynı nötr mesaj; "Haftalık sıra: 1";
depo `['Gece Kuşu', 32]`; silme sonrası `null`. Tek konsol satırı reddedilen takma adın 422
yanıtıdır (tarayıcının ağ günlüğü, uygulama hatası değil). "giriş tablosu" satırında silinen
hesabın adı tarayıcının 20 sn'lik `/tablo` önbelleğinden gelir, beklenir. Sıralama satırında
"Şşşşşşşşşşşş" (Task 3 adım 7) de görünebilir; sunucu o arada yeniden başlatıldıysa görünmez.

- [ ] **Step 5: Tarayıcı: üç genişlik, taşma, 44 px, axe**

Sıralama sayfasında satır olması için önce Task 3 adım 7'deki `tur-gonder.mjs` koşar (12 karakterlik
ad, en uzun satır).

`/tmp/bozo-oyun/plan3/tasma.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const AXE = '/Users/mk/.npm/_npx/1fc4933a57a44b8f/node_modules/axe-core/axe.min.js'
const KOK = process.argv[2] ?? 'http://localhost:8398'
const DIZIN = process.argv[3] ?? '/tmp/bozo-oyun/plan3'
const ETIKETLER = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
// Üç genişlikte sıralama sayfası ve katılım ekranı: taşma, 44 px altı hedef, axe. Sunucu açık, tabloda satır var.
const b = await chromium.launch()
for (const genislik of [320, 390, 1440]) {
  const c = await b.newContext({ viewport: { width: genislik, height: genislik < 500 ? 740 : 900 }, isMobile: genislik < 500, hasTouch: genislik < 500, deviceScaleFactor: 2 })
  const p = await c.newPage()
  const hatalar = []
  p.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
  p.on('pageerror', (e) => hatalar.push(String(e)))
  const olc = async (an) => {
    await p.addScriptTag({ path: AXE })
    const r = await p.evaluate(async (e) => (await window.axe.run(document, { runOnly: { type: 'tag', values: e } })).violations, ETIKETLER)
    const o = await p.evaluate(() => ({
      tasma: document.documentElement.scrollWidth,
      kucuk: [...document.querySelectorAll('main button, main a, main input')].map((el) => [el.textContent.trim().slice(0, 16), el.getBoundingClientRect()])
        .filter(([, r]) => r.width > 0 && (r.width < 44 || r.height < 44)).map(([ad, r]) => `${ad} ${Math.round(r.width)}x${Math.round(r.height)}`),
    }))
    console.log(genislik, an, 'yatay genişlik', o.tasma, '44 altı', JSON.stringify(o.kucuk), 'axe ihlal', r.length, JSON.stringify(r.map((v) => `${v.id}:${v.nodes.length}`)))
  }
  await p.goto(KOK + '/oyun/siralama/')
  await p.waitForLoadState('networkidle')
  await p.waitForTimeout(1000)
  await p.screenshot({ path: `${DIZIN}/siralama-${genislik}.png`, fullPage: true })
  await olc('sıralama')
  await p.goto(KOK + '/oyun/')
  await p.waitForLoadState('networkidle')
  await p.waitForTimeout(1800)
  await p.screenshot({ path: `${DIZIN}/giris-${genislik}.png`, fullPage: true })
  await olc('giriş')
  await p.getByRole('button', { name: 'Oyna' }).click()
  await p.getByRole('button', { name: 'Tekrar Oyna' }).waitFor({ timeout: 150000 })
  await p.waitForTimeout(1200)
  await p.screenshot({ path: `${DIZIN}/sonuc-${genislik}.png`, fullPage: true })
  await olc('sonuç')
  await p.getByRole('button', { name: 'Bu Skoru Sıralamaya Yaz' }).click()
  await p.getByLabel('Takma ad').waitFor()
  await p.waitForTimeout(400)
  await p.screenshot({ path: `${DIZIN}/katilim-${genislik}.png`, fullPage: true })
  await olc('katılım')
  console.log(genislik, 'konsol hataları', JSON.stringify(hatalar))
  await c.close()
}
await b.close()
```

Run: `node /tmp/bozo-oyun/plan3/tur-gonder.mjs; node /tmp/bozo-oyun/plan3/tasma.mjs http://localhost:8398`
Expected (her genişlik için dört satır):
```
320 sıralama yatay genişlik 320 44 altı [] axe ihlal 0 []
320 giriş yatay genişlik 320 44 altı [] axe ihlal 0 []
320 sonuç yatay genişlik 320 44 altı [] axe ihlal 0 []
320 katılım yatay genişlik 320 44 altı [] axe ihlal 0 []
320 konsol hataları []
```
ve aynısı 390 ile 1440 için (yatay genişlik viewport'a eşit, listeler boş). On iki PNG yazar;
390'da sıralama sayfasında kabuk, panel, `Şşşşşşşşşşşş -600` satırı ve "Sıfırlanır: ..." satırı,
katılımda başlık, alan, kural, cümle, uyarı, Gizlilik, iki düğme görünmeli. `tur-gonder.mjs`
ikinci koşuda `oyuncu 409` (aynı anahtar) der; tur yine yazılır.

- [ ] **Step 6: Tarayıcı: sunucu kapalı**

Sunucu (8402) durdurulur, statik sunucu açık kalır.

`/tmp/bozo-oyun/plan3/cevrimdisi.mjs`:

```js
import { chromium } from '/Users/mk/.npm/_npx/db89d7302a373f10/node_modules/playwright/index.mjs'
const KOK = process.argv[2] ?? 'http://localhost:8398'
// Sunucu kapalı: tur çevrimdışı oynanır, sonuçta "Çevrimdışı tur" yazar, katılım düğmesi yok (spec §7).
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
const p = await c.newPage()
const hatalar = []
p.on('console', (m) => m.type() === 'error' && hatalar.push(m.text()))
p.on('pageerror', (e) => hatalar.push(String(e)))
await p.goto(KOK + '/oyun/')
await p.waitForLoadState('networkidle')
await p.waitForTimeout(1800)
const t0 = Date.now()
await p.getByRole('button', { name: 'Oyna' }).click()
await p.locator('[data-hedef="s0"]').waitFor({ timeout: 10000 })
console.log('Oyna → saha ms', Date.now() - t0)
await p.getByRole('button', { name: 'Tekrar Oyna' }).waitFor({ timeout: 150000 })
await p.waitForTimeout(1200)
const metin = (await p.locator('main').innerText()).replace(/\n+/g, ' | ')
console.log('sonuç:', metin)
console.log('katılım düğmesi', await p.getByRole('button', { name: 'Bu Skoru Sıralamaya Yaz' }).count())
console.log('sayfa hataları', JSON.stringify(hatalar.filter((h) => !/ERR_CONNECTION_REFUSED|Failed to load resource/.test(h))))
console.log('ağ hataları (beklenen)', hatalar.filter((h) => /ERR_CONNECTION_REFUSED|Failed to load resource/.test(h)).length)
await b.close()
```

Run: `node /tmp/bozo-oyun/plan3/cevrimdisi.mjs http://localhost:8398`
Expected (ön doğrulamada ölçülen):
```
Oyna → saha ms 387
sonuç: Sofra Yetiştir | 00:04 · üç sofra kalktı | Puan: -600 | -600 | 0 sofra | 0 şiş | 0 tam kıvam | 0 en uzun kombo | Tekrar Oyna | Çevrimdışı tur: sıralamaya girmez. | Sıralama
katılım düğmesi 0
sayfa hataları []
ağ hataları (beklenen) 2
```
Ölçütler: saha 4 sn'den önce (bağlantı reddi anında döner; bağlantı asılı kalırsa `ZAMAN_ASIMI_MS`
4 sn), "Çevrimdışı tur" satırı var, katılım düğmesi 0, sayfa hatası boş; iki ağ satırı giriş
tablosunun ve jetonun reddedilen bağlantılarıdır.

- [ ] **Step 7: Üretim derlemesi ve commit**

Run: `npm run build 2>&1 | grep -E 'error|✓ Compiled' && grep -c 'api.cigercibozo.com' out/_next/static/chunks/*.js | grep -v ':0'`
Expected: derleme temiz, varsayılan API adresi tek chunk'ta.

```bash
git add components/oyun/useSiralama.ts components/oyun/SiralamaSayfasi.tsx components/oyun/SiralamaSayfasi.module.css \
  "app/(tr)/oyun/siralama/page.tsx" "app/(en)/en/oyun/siralama/page.tsx"
git commit -m "Add the weekly leaderboard page"
```

---

### Task 7: Belgeler

**Files:**
- Modify: `CLAUDE.md`, `README.md`, `docs/surec/DEVAM.md`

- [ ] **Step 1: CLAUDE.md**

`## Architecture` içinde `lib/` maddesinin "`lib/oyun/` is the opening-period game" ile başlayan
kısmı şununla değiştirilir ve hemen ardından yeni bir madde gelir:

```markdown
  `lib/oyun/` is the opening-period game (spec `docs/specs/2026-10-08-oyun-design.md`): an
  integer-only deterministic simulation pinned by golden records in `motor.test.ts`, plus
  display-only modules (`gosterim`, `gorsel`, `zamanlayici`, `defter`, `klavye`, `duyuru`,
  `ses`, `tarih`) that never feed values back into it, and the server-facing modules shared
  with `sunucu/`: `aktarim` (the wire contract), `api` (browser client), `tavan` (per-seed score
  ceiling), `tohum` (uint32 seed bounds), `takmaAd` (nickname format and folding).
- **`sunucu/` is the game's score server** (spec §10): Node 24, `node:http`, one dependency
  (`mariadb`) in its own `package.json`, wired in as an npm workspace so the root `npm install`,
  `npm run typecheck` and `npm test` cover it. It imports `lib/oyun/` directly and replays every
  round with `simule`; it never reads a claimed score. Storage is behind `sunucu/depo.ts`:
  `bellekDepo` for tests and local runs, `mariaDepo` for production (`sema.sql`). The MariaDB
  contract test is opt-in (`BOZO_TEST_DB_URL`), so bare `npm test` stays hermetic. Run locally
  with `GIZLI_TUZ=x KOKEN=http://localhost:3000 node sunucu/ana.ts`; the site reads the API base
  from `NEXT_PUBLIC_OYUN_API` at build time (default `https://api.cigercibozo.com`). **Not
  deployed:** the privacy page still says the site stores no visitor data on its own server; the
  server cannot go live before that text changes (plan 4) and the owner's lawyer approves.
```

`## Dependencies` ilk paragrafı:

```markdown
Runtime: `next`, `react`, `react-dom`, `lucide-react`, `motion` (imported only under
`components/oyun/`, so it ships only in the `/oyun` chunks; spec §10). Dev: `typescript` and the three
`@types` packages. The `sunucu` workspace adds `mariadb` for the score server only; it is not
imported by the site.
```

- [ ] **Step 2: README.md**

`## Publishing` başlığından hemen önce yeni bölüm:

```markdown
## Score server

`sunucu/` is the game's score server (spec `docs/specs/2026-10-08-oyun-design.md` §10), an npm
workspace: the root `npm install` installs its one dependency (`mariadb`), and the root
`npm run typecheck` and `npm test` cover its files. Run it locally against the in-memory store:

```bash
GIZLI_TUZ=yerel KOKEN=http://localhost:3000 PORT=8402 node sunucu/ana.ts
NEXT_PUBLIC_OYUN_API=http://127.0.0.1:8402 npm run dev   # the site reads the API base at build time
```

Environment (all read in `sunucu/ana.ts`): `PORT` (8402), `KOKEN` (CORS origins, comma-separated,
default `https://cigercibozo.com`), `GIZLI_TUZ` (prize-code HMAC secret, required), `DB_URL`
(`mariadb://user:pass@host:3306/db`; without it the in-memory store is used and nothing survives a
restart), `YONETIM_KULLANICI` and `YONETIM_SIFRE` (basic auth for `/yonetim/*`; without both the
admin endpoints answer 503), `GUVENILIR_VEKIL` (the local reverse proxy in front of Node, default
`127.0.0.1,::1`), `KAMPANYA_BITIS` (ISO date; champion records are purged 90 days after it).

Schema: `sunucu/sema.sql` (MariaDB 10.11). Production build: `npm run build -w sunucu` emits
`sunucu/dist/` (`tsc` with `rewriteRelativeImportExtensions`), started with `npm start -w sunucu`.
The MariaDB adapter test runs only when `BOZO_TEST_DB_URL` points at a throwaway database:

```bash
docker run -d --name bozo-maria -e MARIADB_ROOT_PASSWORD=sifre -e MARIADB_DATABASE=bozo_test \
  -p 127.0.0.1:3399:3306 mariadb:10.11
BOZO_TEST_DB_URL=mariadb://root:sifre@127.0.0.1:3399/bozo_test node --test sunucu/mariaDepo.test.ts
```

Not deployed yet: subdomain, DNS, Plesk Node.js app and database are plan 4, each step with its
own approval, after the privacy text changes and the lawyer's review.

```

(İç içe kod çitleri README'de üç ters tırnakla yazılır; buradaki gösterim okunurluk için.)

- [ ] **Step 3: DEVAM.md**

`## Durum` listesinin başına, plan 2 maddesinin üstüne:

```markdown
- **Açılış oyunu, plan 3 bitti: skor sunucusu ve sıralama** (spec §6-§10, §16; plan
  `docs/plans/2026-10-08-oyun-plan-3-sunucu.md`). `sunucu/` npm workspace: `node:http`, tek
  bağımlılık `mariadb`, `simule` ile yeniden oynatma, tavan, 15 dk tek kullanımlık jeton, hız
  sınırı, Cloudflare IP, dönem kapanışı (Pazartesi 05:00 Girne) ve ödül kodları, gece silme,
  `/yonetim/*` temel kimlikle. Sitede "önce oyna, sonra kaydet": katılım ekranı, sonuçta
  haftalık sıra, `/oyun/siralama/` (TR ve EN), "Hesabımı sil", çevrimdışı tur. Yönetim
  arayüzü sayfası ve paylaşım kartı plan 4'te. **Yayında değil ve yayınlanamaz:** gizlilik
  sayfası hâlâ "site kendi sunucusunda ziyaretçi verisi saklamaz" diyor; plan 4'ün gizlilik
  değişikliği ve hukukçu onayı olmadan sunucu açılmaz.
```

- [ ] **Step 4: Son doğrulama**

Run:
```bash
npm run typecheck && npx tsc -p sunucu/tsconfig.json --noEmit && npm test 2>&1 | grep -E '^ℹ (tests|pass|fail|skipped)' && npm run build 2>&1 | grep -E 'error|✓ Compiled'
git diff HEAD~6 --stat -- lib/oyun/motor.ts lib/oyun/motor.test.ts lib/oyun/ocak.ts lib/oyun/sofra.ts lib/oyun/ayar.ts lib/oyun/tipler.ts lib/oyun/canli.ts lib/oyun/deneme.ts
```
Expected: iki tip denetimi temiz; `tests 356`, `pass 348`, `fail 0`, `skipped 8`; derleme temiz;
son komut **boş** (simülasyon ve altın kayıtlar plan boyunca değişmedi). `styles/palet.test.ts`
ve `styles/animasyon.test.ts` geçmeye devam eder (yeni token yok, keyframe yok).

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md README.md docs/surec/DEVAM.md
git commit -m "Document the score server and the leaderboard"
```

---

## Sahibine sorular

1. Negatif puanlı tur tabloya girsin mi (şu an girer; `-250` birinci olabilir)?
2. Takma ad benzersizliği (katlanmış hal üstünden, "B0zo Usta" = "Bozo Usta") kabul mü?
3. Kampanya bitiş tarihi (`KAMPANYA_BITIS`) ve yönetim kimliğinin (`YONETIM_*`) sahibi kim
   (spec §19 karar 3 ve 9)?
4. Katılım cümlesi ve diğer TASLAK metinler (spec §19 karar 4); onay cümlesi değişirse
   `ONAY_SURUMU` artar.
5. Günlük kanal sayaçlarını (`GET /yonetim/sayac`) kim okuyacak; haftalık özet mi istenir?

## Kapsam dışı (plan 4)

Paylaşım kartı (sabit QR ve kart şablonu), kurallar sayfası ve giriş ekranındaki Kurallar
bağlantısı, gizlilik metni değişiklikleri (`saklamaMetni`, `aliciMetni`, `aktarimMetni`,
`haklarMetni`; hukukçu), yönetim arayüzü sayfası (kod onayı, tur izleyici oynatıcı, ad gizleme),
`RotaAnahtari`/sitemap kaydı (noindex kalktığında), alt alan adı `api.cigercibozo.com`, DNS,
Plesk Node.js uygulaması (`GUVENILIR_VEKIL` ve `KOKEN` değerleri orada), veritabanı ve deploy;
her dış adım ayrı onayla.
