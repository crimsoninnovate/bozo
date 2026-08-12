# Hareket katmanı düzeltmesi (Task 16 / Y1-Y3)

12 Ağustos 2026. Ölçen: kendi Chromium örneği (playwright 1.58.2), kendi statik
sunucusu (`python3 -m http.server 8477 --directory out`). Genişlikler 1440x900 ve
390x844.

## Sorun

`.module.css` içindeki her `animation-name` değeri Next 16 / Turbopack /
lightningcss tarafından modül-yerel bir hash'e çevriliyor, o adda bir `@keyframes`
orada tanımlı olmasa bile. Sekiz keyframe'in tamamı global `styles/animasyonlar.css`
içinde düz adıyla duruyordu; hash'li ad hiçbir zaman çözülmedi. Derleme temiz geçti,
tarayıcı uyarmadı, animasyon hiç kurulmadı.

Sonuç: sitedeki 42 animasyon bildirimi beş sayfada da ölüydü. Kor nefes almadı,
duman yükselmedi, plaka korları yanmadı, nabız noktaları atmadı, saatin iki noktası
yanıp sönmedi.

## Çözüm

1. Keyframe'ler onları kullanan modül dosyalarının içine taşındı (8 modül).
   `styles/animasyonlar.css` yalnız `prefers-reduced-motion` bloğunu tutuyor.
   Denenip elenen yollar (öneri turunda bu ağaçta build edilerek sınandı):
   `animation: global(ad)` geçersiz CSS üretiyor, string biçimi yine hash'leniyor,
   `:global { @keyframes }` bloğu build'i kırıyor. Next 16 lightningcss'in CSS
   Modules `animation` yeniden adlandırma anahtarını dışarıya açmıyor
   (`useLightningcss.md`: yalnız `lightningCssFeatures.include/exclude`).
2. `KorSahnesi`'nde yoğunluk ve nefes iki katmana ayrıldı. Animasyon bildirimleri
   author-normal bildirimleri (inline `style` dahil) yener; tek başına 1. madde
   uygulansaydı `KorSahnesi.tsx`'in kaydırmaya göre yazdığı opaklık/ölçek etkisiz
   kalır ve bugün çalışan tek sahne davranışı ölürdü. Yeni yapıda dış span
   (`.korYogunluk` / `.cekirdekYogunluk`) yoğunluğu, iç span nefesi taşıyor; iç içe
   opaklıklar çarpılır, transform'lar birleşir.
3. `.duman` bloğuna `animation-fill-mode: backwards`. Gecikmeli iki puf (8s ve 16s)
   gecikme boyunca animasyon öncesi statik `opacity: 1`'de bekliyordu.

## Keyframe değerleri: tasarımdan karar

Öneri turunun hazır yaması `emberBreathAna` tabanını `.62` yerine `.78`, `emberSoftAna`
tabanını `.4` yerine `.62` yapıyor ve `emberSoftAna`'ya bir `transform: scale()`
ekliyordu. **Üçü de alınmadı.** Tasarımın değerleri korundu:

| Keyframe | Tasarım kaynağı | Alınan değer |
|---|---|---|
| `emberBreathAna` | `Ana Sayfa Alternatif.dc.html:18` | `.62` / `1`, `scale(1)` / `scale(1.06)` |
| `emberSoftAna` | `Ana:19` | `.4` / `.85`, transform yok |
| `smokeDriftAna` | `Ana:20` | değişmedi |
| `emberBreath` | `Menu/Hikaye/Konum:18` | `.6` / `1`, `scale(1)` / `scale(1.05)` |
| `emberSoft` | `Menu/Hikaye/Konum:19` | `.4` / `.82` |
| `smokeDrift` | `Menu/Hikaye/Konum:20` | değişmedi |

Gerekçe, üç madde:

1. `.dc.html` kanonik görsel kaynak (`CLAUDE.md`). Dört handoff dosyasının dördü de
   aynı değerleri veriyor; `.78` / `.62`'nin tasarımda dayanağı yok.
2. `.78`'e çekmek nefesin derinliğini düşürür: `.62 - 1` salınımı 1.61 katlık,
   `.78 - 1` salınımı 1.28 katlık. Bu görevin restore ettiği şeyin ta kendisi
   sığlaşırdı. Taban yükseltmesi, kendisi bilinçli bir port sapması olan ve amacı
   zaten karartmak olan yoğunluk merdivenini telafi etmek için önerilmişti.
3. `emberSoftAna`'ya eklenen `transform: scale()` bir hata olurdu: `.cekirdek`
   ortalanmasını `transform: translateX(-50%)` ile kuruyor ve animasyonun yazdığı
   transform onu ezerdi. 1440px'te 780px genişliğindeki çekirdek 390px sağa kayardı.
   Ölçüldü, mevcut halde kaymıyor: 1440'ta `x=330, w=780`, merkez 720 = viewport
   merkezi; 390'da `x=-15, w=420`, merkez 195 = viewport merkezi.

Bileşik aralık (sarmalayıcı x nefes) bir ayar düğmesi olarak duruyor: en parlak
bölümde `.62 - 1` (tasarımın aralığı birebir), en sönük bölümde (`konum`, yoğunluk
0.3) `.32 - .51`. Sayı değiştirilecekse mekanizma değil, yalnız keyframe tabanı
değişir.

## Ölçümler

### 1. Bildirim ve koşan animasyon

| Sayfa | Bildirim | Koşan (önce) | Koşan (sonra) |
|---|---|---|---|
| `/` | 9 | 0 | **9** |
| `/menu/` | 15 | 0 | **15** |
| `/hikaye/` | 5 | 0 | **5** |
| `/konum/` | 8 | 0 | **8** |
| `/gizlilik/` | 5 | 0 | **5** |
| **toplam** | **42** | **0** | **42** |

Derleme çıktısında 13 hash'li `@keyframes` üretiliyor, bildirilen her ada bir tane.

### 2. Yoğunluk merdiveni hâlâ çalışıyor

Ana sayfada yedi bölüme sırayla kaydırıldı, geçiş bitmesi için 1.4s beklendi,
animasyonlar `t=0`'da dondurularak ölçüldü. `korYazilan` = JS'in sarmalayıcıya
yazdığı değer, `korEtkin` = katman opaklıklarının çarpımı.

| Bölüm | `data-yogunluk` | Beklenen `0.3 + y*0.7` | korYazilan (önce) | korYazilan (sonra) | korEtkin (sonra, `t=0`) |
|---|---|---|---|---|---|
| acilis | 1 | 1 | 1 | **1** | 0.620 |
| iddia | 0.55 | 0.685 | 0.685 | **0.685** | 0.425 |
| ocaktan | 0.4 | 0.58 | 0.58 | **0.58** | 0.360 |
| ikram | 0.7 | 0.79 | 0.79 | **0.79** | 0.490 |
| gece | 1.25 | 1 (kırpılmış) | 1 | **1** | 0.620 |
| bozo | 0.45 | 0.615 | 0.615 | **0.615** | 0.381 |
| konum | 0.3 | 0.51 | 0.51 | **0.51** | 0.316 |

Yedi bölümün yedisinde de yazılan değer düzeltmeden önceki değerle birebir aynı ve
formülü tutuyor; `korEtkin` her satırda `korYazilan * 0.62` (nefesin dip noktası),
yani merdiven orantılı olarak taşınıyor. Çekirdek merdiveni de aynı:
`0.24 + y*0.6` sırasıyla 0.84 / 0.57 / 0.48 / 0.66 / 0.99 / 0.51 / 0.42.

### 3. Duman

| | önce | sonra |
|---|---|---|
| Koşuyor mu | hayır | evet |
| Tepe opaklık (üç pufun üçü) | **1.0** (statik) | **0.16** |
| `t=0`, gecikme penceresi (8s / 16s) | **1.0** | **0** |

Tepe değer, animasyonun tüm süresi 200 adımda taranarak alındı. Tasarımın
`smokeDriftAna` tepe değeri `.16`; önceki durum bunun 6.25 katıydı ve sabitti.

### 4. İç sayfaların koru artık aralıkta

Düzeltmeden önce `.ic .kor` ve `.ic .cekirdek` CSS varsayılanı olan `1` opaklıkta
sabitti. Sonra (`/hikaye/`, `/menu/`, `/konum/`, üçünde de aynı):

| | dip | tepe | tasarım |
|---|---|---|---|
| `.ic .kor` | 0.6 | 1 | `.6 - 1` |
| `.ic .cekirdek` | 0.4 | 0.82 | `.4 - .82` |

### 5. `prefers-reduced-motion: reduce`

| Sayfa | Koşan animasyon | Geçişli eleman |
|---|---|---|
| `/`, `/menu/`, `/hikaye/`, `/konum/`, `/gizlilik/` | **0** | **0** |

`animasyonlar.css`'in `animation: none !important` kuralı hâlâ kazanıyor. Sarmalayıcı
yoğunluğu izlemeye devam ediyor, `scale` nötr yoğunlukta sabitleniyor
(`KISITLAR.md`'deki kayıtlı karar yerinde).

### 6. Kontrast: Task 15'in 14 hatasına etkisi

Task 15 hipotezi doğrulandı ama hatalar tamamen kapanmadı: **sonuç (2), marj açıldı.**

Yöntem: 390x844, `*{transition:none !important}` enjekte edildi, hedef
`scrollIntoView({block:'center'})` ile ortalandı, metin geçici `transparent` yapıldı,
`fullPage` değil yalnız o kutunun viewport yakalaması alındı. Animasyon koşarken zemin
salındığı için tek an değil, tüm animasyonlar duraklatılıp zaman çizgisi 0-32s
arasında 16 noktada tarandı; **en açık zemin** (en kötü oran) ve en koyu zemin (en iyi
oran) ayrı ayrı raporlanıyor.

| Rota / öğe | önce | sonra, en kötü an | sonra, en iyi an |
|---|---|---|---|
| `/` telifMetin | 3.99 | **4.44** | 4.59 |
| `/` gizlilikLink | 4.01 | **4.44** | 4.59 |
| `/hikaye/` telifMetin | 3.83 | **4.38** | 4.58 |
| `/hikaye/` gizlilikLink | 3.35 | **4.33** | 4.58 |
| `/konum/` telifMetin | 3.83 | **4.38** | 4.58 |
| `/konum/` gizlilikLink | 3.35 | **4.33** | 4.58 |
| `/gizlilik/` telifMetin | 3.96 | **4.40** | 4.58 |

("önce" sütunu aynı betiğin düzeltme öncesi koşumu; Task 15'in sayılarıyla 0.02
içinde örtüşüyor, yani yöntem aynı şeyi ölçüyor.)

Okuma: en kötü an 3.35'ten 4.33'e çıktı, en iyi an 4.58-4.59'a, yani Task 15'in
"kor sahnesi gizli" tavanı olan 4.60'a. Duman düzeltmesi kor sahnesinin telif
şeridine bindirdiği bedeli 1.25 puandan en fazla 0.26 puana indirdi. Kalan açık
artık dumandan değil: `--krem-50` düz `#0A0807` üstünde zaten 4.60, eşiğin yalnız
0.10 üstünde. Yani kusursuz bir sahnede bile bu iki öğenin payı yok. Bundan sonrası
token kararı (12.5px `--krem-50`), hareket kararı değil; bu görevin kapsamı dışında
bırakıldı.

## Regresyon testi

`styles/animasyon.test.ts`, üç test:

| Test | Ne doğruluyor | Derleme ister mi |
|---|---|---|
| `modulCssleri_animasyonAdi_ayniDosyadaKeyframeTanimli` | Her `.module.css`'te bildirilen her animasyon adının `@keyframes` tanımı AYNI dosyada | hayır |
| `globalCssleri_animasyonAdi_globalKeyframeTanimli` | `styles/` altındaki global sayfalarda karşılıksız ad yok | hayır |
| `derlemeCiktisi_animasyonAdi_keyframeKarsiligiVar` | `out/**/*.css` içinde geçen her adın bir `@keyframes` karşılığı var | evet; `out/` yoksa atlanır |

Üçüncüsü için koşum sırası `npm run build && npm test`; `docs/PARITE.md` madde 1.10'a
ve testin dosya başı yorumuna yazıldı.

Negatif kontrol yapıldı: `DurumCipi.module.css`'ten `@keyframes dotPulse` çıkarılınca
ilk test `components/saat/DurumCipi.module.css: dotPulse` diyerek düştü, geri
konunca geçti. Yani test tam bu hatayı yakalıyor.

## Kapılar

| Komut | Sonuç |
|---|---|
| `npm run typecheck` | temiz, çıktı boş |
| `npm test` | 68 test, 0 hata (65 + 3 yeni) |
| `npm run build` | temiz, 14 sayfa |

## Değişen dosyalar

`components/ember/KorSahnesi.module.css`, `components/ember/KorSahnesi.tsx`,
`components/ui/FotoYuvasi.module.css`, `components/saat/CanliSaat.module.css`,
`components/saat/DurumCipi.module.css`, `components/layout/Cekmece.module.css`,
`components/layout/GeceSeridi.module.css`, `components/sayfa/HaritaPlakasi.module.css`,
`components/sayfa/konum/Harita.module.css`, `styles/animasyonlar.css`,
`styles/animasyon.test.ts` (yeni), `docs/PARITE.md` (madde 1.10 ve test sayısı).
