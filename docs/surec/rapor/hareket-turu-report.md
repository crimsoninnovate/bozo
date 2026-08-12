# Hareket turu: tasarımın üstüne

12 Ağustos 2026. Ölçen: kendi Chromium örneği (playwright 1.58.2, chromium-headless-shell
145.0.7632.6), kendi statik sunucusu (`python3 -m http.server 8491 --directory out`).
Genişlikler 1440x900 ve 390x844, `deviceScaleFactor: 2`, normal ve
`prefers-reduced-motion: reduce`.

Bu tur, hareket düzeltmesinin (`80ad3b6`) restore ettiği tasarım hareketinin **üstüne**
ekleme yapar. Önce mevcut hareket ölçüldü, sonra üç ekleme yapıldı.

## Önce: ne vardı

Düzeltme sonrası hareket gerçekten koşuyor. Kendi ölçümüm (turun başlangıç durumu):

| Genişlik | Koşan (normal) | Koşan (azaltılmış) |
|---|---|---|
| 1440x900 | 34 | **0** |
| 390x844 | 33 | **0** |

Kor nefes alıyor, duman sürükleniyor, plaka korları yanıyor, nabız noktaları atıyor,
yoğunluk merdiveni çalışıyor. Ekleme yapılacak yer bunlar değil.

## Ölçtüğüm iki boşluk

### 1. Kor tam periyodik salınıyor. Ateş değil, kısılan bir lamba

Ana sayfada kor katmanının opaklığı 24 saniye boyunca 0.5s adımlarla tarandı
(animasyonlar duraklatılıp `currentTime` ile):

| t (s) | 0 | 4 | 8 | 12 | 16 | 20 | 24 |
|---|---|---|---|---|---|---|---|
| kor | 0.620 | 1.000 | 0.620 | 1.000 | 0.620 | 1.000 | 0.620 |

`emberBreathAna` 8 saniyede **birebir** aynı değere dönüyor; sapma 0.000. Çekirdek de
öyle, 11s periyotla. İki `ease-in-out` sinüs, ikisi de kusursuz düzenli. Brief'in sorusu
("ateşin kendi düzensizliği var mı, yoksa fazla düzenli mi salınıyor?") ölçülebilir bir
cevap veriyor: düzensizlik **sıfır**. Ateşi ateş gibi okutan şey salınımın kendisi değil,
salınımın her seferinde biraz farklı olması.

### 2. Gecenin `data-yogunluk: 1.25` değeri sahnenin en gür katmanında hiç görünmüyor

`KorSahnesi.tsx` kor sarmalayıcısına `Math.min(1, 0.3 + yogunluk * 0.7)` yazıyor:

| Bölüm | yoğunluk | kor (önce) |
|---|---|---|
| acilis | 1 | **1.000** |
| gece | 1.25 | **1.000** (1.175'ten kırpıldı) |

Tasarım geceye sitedeki en yüksek yoğunluğu vermiş, ama formül 1.0'ın üstünü kırptığı
için gece ile açılış **birebir aynı** parlıyor. Çekirdek katmanı farkı taşıyor
(0.84 / 0.99) ama gür olan dış katman taşımıyor. Yani gecenin geçişi, sahnenin en
yüksek sesli yerinde hiç duyulmuyor.

## Ne ekledim

### E1. Kor titremesi

**Ne gördüm.** Yukarıdaki 1. madde: nefes tam periyodik.

**Neden bu markaya ait.** Ateş nefes alır ama düzenli nefes almaz. Kor sahnesi zaten
nefes ve sürükleniş taşıyor; eksik olan üçüncü şey düzensizlik. Bu hareket "modern site"
demiyor, "ocak" diyor: eklenen tek bilgi, her salınımın bir öncekinden biraz farklı
olması.

**Ne yaptım.** Yoğunluk ile nefes arasına üçüncü bir katman girdi
(`.korTitreme` / `.cekirdekTitreme`). Üç katmanın üçü de opaklık yazdığı için ayrı
elemanlarda olmak zorunda: animasyon aynı elemanda inline `style`ı ezer (Y2'de kayıtlı
tuzak). Dıştan içe: yoğunluk (nerede olduğun), titreme (ateşin düzensizliği), nefes
(yavaş salınım). Opaklıklar çarpılır.

Keyframe'lerin durakları bilerek eşit aralıklı değil; eşit aralık ikinci bir sinüs üretir
ve nefesin yanında ikinci bir nabız gibi okunur. Periyotlar nefesle asal (kor 13s / 15s,
çekirdek 17s / 19s), genlik en fazla %11 düşüş.

**Ölçüm: artık tekrar etmiyor.** Bileşik opaklık (nefes x titreme) 40 saniye tarandı:

| t (s) | 0 | 8 | 16 | 24 | 32 | 40 |
|---|---|---|---|---|---|---|
| bileşik | 0.6200 | 0.6051 | 0.5647 | 0.5891 | 0.6153 | 0.5864 |
| t=0'dan fark | - | 0.0149 | 0.0553 | 0.0309 | 0.0047 | 0.0336 |

Önce bu farkların hepsi 0.000 idi. Salınım tepeleri de artık eşit değil: t=4/12/20/28/36
anlarında 0.960 / 0.933 / 0.947 / 0.966 / 0.924. Her nefes biraz farklı büyüklükte.

**Maliyet.** 2 span (sahne başına), ~10 satır CSS, 2 keyframe. Mantık değişikliği yok.

### E2. Gece gerçekten en parlak an oldu

**Ne gördüm.** Yukarıdaki 2. madde: 1.25 ile 1.0 aynı piksele çözülüyor.

**Neden bu markaya ait.** Sitenin cümlesi "Girne uyurken ocak yanıyor". Gece bölümü
sayfanın duygusal tepesi ve tasarım bunu `data-yogunluk` ile açıkça söylemiş. Bir
kırpma yüzünden söylenmemiş oluyordu. Bu bir hareket eklemesi değil, var olan
kaydırma hareketinin menzilini açması.

**Ne yaptım.** Katsayı `0.7` yerine `0.56`. Tavan artık 1.25'e bırakılıyor.

| Bölüm | yoğunluk | kor (önce) | kor (sonra) |
|---|---|---|---|
| acilis | 1 | 1.000 | 0.860 |
| iddia | 0.55 | 0.685 | 0.608 |
| ocaktan | 0.4 | 0.580 | 0.524 |
| ikram | 0.7 | 0.790 | 0.692 |
| **gece** | 1.25 | **1.000** | **1.000** |
| bozo | 0.45 | 0.615 | 0.552 |
| konum | 0.3 | 0.510 | 0.468 |

Merdivenin sırası değişmedi, yalnız gece tek başına tepeye çıktı. Açılış %14 sönükleşti;
ekran görüntüsünde hero hâlâ sıcak ve kor açıkça okunuyor
(`shots/sonra/ana-hero.png`). Çekirdek katsayısına dokunulmadı, o zaten kırpılmıyordu.

**Maliyet.** Bir katsayı.

### E3. Hero tane rayının küçük taneleri kor gibi nefes alıyor

**Ne gördüm.** `TaneDizilimi` on altı rayda geçiyor ve hepsi hareketsiz. Tane markanın
merkezindeki fikir, ve hero rayı tam "İddianın kanıtı tanede" satırının yanında duruyor.

**Neden bu markaya ait, ve neden yalnız küçük taneler.** Rayın ritmi büyük-küçük-büyük-
büyük-küçük-büyük. Büyük tane **krem**, küçük tane **tangerine**. Yani küçük taneler
zaten tanelerin ARASINDAKİ kor. Ateş yanar, et yanmaz: nefesi yalnız tangerine olanlara
verdim. Ayrım anlamsal, süs değil, ve kendiliğinden ölçülü kalıyor (altı öğenin ikisi,
üstelik küçük olanları).

Aralık (.62 - 1) kor sahnesinin kendi nefes aralığıyla aynı; periyot 9s, sahnenin
8s'inden ayrı, böylece ikisi kilitlenmiyor ve faz kayıyor. İki küçük tane aynı anda
parlamasın diye ikincisi `-4.5s` negatif gecikmeyle karşı faza alındı (`~` birleştiricisi,
eleman başına stil yazmadan).

**Opt-in.** `kor` prop'u; on altı rayın yalnız hero rayı alıyor. Ölçüldü: rayın altı
tanesinden yalnız 2. ve 5. (küçük olanlar) animasyon taşıyor, gecikmeleri `0s` ve `-4.5s`;
büyük dördü `none`.

**Maliyet.** Bir prop, ~4 satır CSS, 1 keyframe.

## Denediklerim ve almadıklarım

| Fikir | Neden almadım |
|---|---|
| Tane rayında soldan sağa gezen parlaklık dalgası | "Isı ray boyunca ilerliyor" diye okutmak istedim, ama gezen bir vurgu yükleniyor-iskeleti (skeleton loader) kalıbının ta kendisi. Faz kaydırmalı nefes aynı şeyi söylüyor ve o kalıba benzemiyor |
| On altı tane rayının hepsine nefes | Ray sayısı fazla; menü satırlarında, bölüm başlıklarında ve footer'da aynı anda nefes alan yirmiden fazla kare gürültü olurdu. Hareketin nadir olması onu anlamlı tutan şey |
| Boş fotoğraf plakalarına "bekliyor" katmanı | `portre`/`geniş` plakaları bilerek zeminsiz: arkadaki kor sahnesine açılan pencereler (IYILESTIRMELER 42). Mobilde boş görünmeleri gerçek bir sorun ama tasarımda karşılığı olmayan bir katman ekler ve zaten `G9`'da sahibine bırakılmış bir karar maddesi. 16 kare yakında geliyorsa doğru hamle hiçbir şey yapmamak |
| Gece şeridindeki altı vardiya çipinden o anki saati yakmak | Gecenin geçişini anlatırdı ama bir içerik/durum kararı, hareket değil; ayrıca gündüz saatlerinde hiçbir çip yanmaz ve şerit anlamsızlaşır |
| Bölüm girişlerinde "fade up" | Brief'in açıkça kaçınılacaklar listesinde, ve `Bolum` zaten kaydırmaya bağlı sürekli bir erime taşıyor. İkincisi birincisinin yerini tutuyor |

## Kapılar

| Komut | Sonuç |
|---|---|
| `npm run typecheck` | temiz, çıktı boş |
| `npm test` | 72 test, 0 hata (bu tur test eklemedi; 68 + paralel erişilebilirlik turunun 4 testi) |
| `npm run build` | temiz, 14 sayfa |

`styles/animasyon.test.ts`'in ilk testi eklenen üç keyframe'i de kapsıyor: üçü de
kullanıldıkları modül dosyasının içinde tanımlı, global sayfaya konmadı.

## prefers-reduced-motion

Beş sayfa, iki genişlik, `reducedMotion: 'reduce'`:

| Genişlik | Koşan animasyon |
|---|---|
| 1440x900 | **0** (5 sayfanın 5'inde) |
| 390x844 | **0** (5 sayfanın 5'inde) |

Eklenen hareketlerin üçü de CSS animasyonu, yani `styles/animasyonlar.css`'in
`animation: none !important` kuralı üçünü de susturuyor. E2 bir animasyon değil,
kaydırmaya bağlı bir **kararma**; `KISITLAR.md`'nin kayıtlı kararı gereği azaltılmış
modda da izlemeye devam ediyor (kararma vestibüler rahatsızlık yapan tür hareket
değildir), `scale` ise eskisi gibi nötr yoğunlukta sabitleniyor.

Normal moddaki sayım (ekleme sonrası): 1440'ta 46, 390'da 45. Artış tamamı hesaplanıyor:
sahne başına 2 titreme katmanı (beş sayfada 10) + hero rayının 2 tanesi.

## Performans

`transform` ve `opacity` dışında hiçbir özellik animasyonlu değil; eklenen üç hareketin
üçü de yalnız `opacity`. Uzun listelerde eleman başına gözlemci kurulmadı: tane rayı saf
CSS, titreme saf CSS, E2 zaten var olan tek `cerceve` aboneliğini kullanıyor (yeni
dinleyici yok).

Kare süreleri ölçüldü (iddia değil), 175 kare, `requestAnimationFrame` aralıkları:

| Genişlik | Durum | Ortalama | p95 | En kötü | >18ms |
|---|---|---|---|---|---|
| 1440x900 | durgun | 16.67ms | 17.30 | 17.60 | **0/175** |
| 1440x900 | kaydırırken | 16.67ms | 17.40 | 17.70 | **0/175** |
| 390x844 | durgun | 16.67ms | 17.10 | 17.60 | **0/175** |
| 390x844 | kaydırırken | 16.67ms | 17.10 | 17.60 | **0/175** |

16.67ms = 60fps. Düşen kare yok.

## Değişen dosyalar

`components/ember/KorSahnesi.tsx`, `components/ember/KorSahnesi.module.css`,
`components/ui/TaneDizilimi.tsx`, `components/ui/TaneDizilimi.module.css`,
`components/sayfa/ana/Acilis.tsx`, `docs/surec/IYILESTIRMELER.md`.

Paralel erişilebilirlik turunun dosyalarına (`components/layout/*`,
`components/sayfa/Kabuk.tsx`, `app/globals.css`, `content/{tr,en}/ortak.ts`)
dokunulmadı.

## Sahibinin bakması gereken yer

**Ana sayfada gece bölümü** (`/#gece`). Açılıştan geceye kaydırın: kor artık açılışta
0.86, gecede 1.00. Tasarımın "burası en parlak an" işareti ilk kez görünüyor, ve bunun
bedeli açılışın %14 sönükleşmesi. Sayı bir ayar düğmesi, mekanizma değil: açılış fazla
sönük geldiyse katsayı `0.56`'dan yukarı çekilir, ama 1.25'e yer bırakmak için 0.8'in
altında kalmalı.
