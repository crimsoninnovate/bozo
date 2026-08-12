# Task 16: tasarım ve hareket turu, öneriler

Tarih: 12 Ağustos 2026. **Hiçbir dosya değiştirilmedi, hiçbir commit atılmadı.**

## Ölçüm ortamı

Ana ağaç bu tur boyunca paralel işin altındaydı, o yüzden çalışma kopyası
scratchpad'e alındı ve kendi portunda sunuldu:

- Kaynak: `/Users/mk/Desktop/Bozo/Web` (rsync kopyası, `npm run build`, `serve out -l 4319`)
- Tarayıcı: kendi Playwright örneği, Chromium 1228, `deviceScaleFactor: 2`
- Genişlikler: 1440x900, 390x844, ayrıca 1280 / 1680 / 1920 / 2560 (madde 4 için)
- `prefers-reduced-motion: reduce` ile ayrı tur
- Kontrast ölçümlerinde `fullPage` **kullanılmadı**; her hedef için kutu kırpması alındı,
  metin gizlendi, kutudaki en parlak piksel en kötü durum zemin sayıldı ve metin rengi
  `getComputedStyle`'ın rgba'sından analitik olarak karıştırıldı (anti-aliasing hatası yok)
- Dokunma hedefleri kutu boyuyla değil `document.elementFromPoint` ile 1px adımlarla
  taranarak ölçüldü
- Ekran görüntüleri: `scratchpad/shots/oncesi/` (51 kare), `scratchpad/shots/sonrasi/`
  (önerilen kor düzeltmesi uygulanmış hali), `scratchpad/shots/azalt/`
- Önerilen kor yamasının çalışan hali: `scratchpad/onerilen-KorSahnesi.module.css`
  ve `scratchpad/onerilen-KorSahnesi.tsx`

**Ara not:** tur sırasında paralel doğrulama turu `Cekmece.module.css`'in `z-index`'ini
40'tan 80'e çekti. Aynı hatayı bağımsız olarak ben de bulmuştum (çekmece açıkken
kapatma düğmesinin merkezine dokunuş hamburgere gidiyordu, `elementFromPoint` ile
doğrulandı); madde artık kapalı, listeye alınmadı. Aşağıdaki bütün bulgular
**resenkronize edilmiş güncel ağaca karşı yeniden doğrulandı.**

Toplam 21 öneri: **yapılmalı 5**, **yapılabilir 11**, **yapılmamalı 5**.

---

# YAPILMALI

## Y1. Sitedeki CSS animasyonlarının tamamı ölü. Beş sayfada 42 bildirim, 0 çalışan

**Ne gördüm.** Beş sayfanın hepsinde her elemanı taradım:

| Sayfa | `animation-name` taşıyan eleman | Gerçekten koşan |
|---|---|---|
| ana | 9 | **0** |
| menu | 15 | **0** |
| hikaye | 5 | **0** |
| konum | 8 | **0** |
| gizlilik | 5 | **0** |

Derlenmiş CSS'te sebep açık:

    /* out/_next/static/chunks/*.css */
    animation:8s ease-in-out infinite KorSahnesi-module__AFsT6q__emberBreathAna
    animation:2.4s ease-in-out infinite DurumCipi-module__0h0GKa__dotPulse
    ...
    /* ama tanımlı olan keyframe'ler: */
    @keyframes emberBreathAna
    @keyframes dotPulse

**Neden sorun.** CSS Modules (Next 16 / Turbopack / lightningcss) `.module.css`
içindeki **her** `animation-name` değerini modül-yerel bir hash'e çeviriyor, o adda bir
`@keyframes` orada tanımlı olmasa bile. Keyframe'lerin tamamı global
`styles/animasyonlar.css`'te düz adlarıyla duruyor. Sonuç: hash'li ad hiçbir zaman
çözülmüyor, animasyon hiç kurulmuyor. 8 modül dosyasında 17 bildirim etkileniyor:

| Keyframe | Nerede bildiriliyor | Görünmeyen şey |
|---|---|---|
| `emberBreathAna` / `emberBreath` | `KorSahnesi.module.css:28,43` | kor nefes almıyor |
| `emberSoftAna` / `emberSoft` | `KorSahnesi.module.css:57,66` | çekirdek nefes almıyor |
| `smokeDriftAna` / `smokeDrift` | `KorSahnesi.module.css:75,76,177` | duman hiç yükselmiyor |
| `emberSoft` x4 | `FotoYuvasi.module.css:73,80,87,91` | plaka korları (commit `71dcdbe`) hiç çalışmadı |
| `dotPulse` x5 | `DurumCipi:43`, `GeceSeridi:21`, `Cekmece:92`, `HaritaPlakasi:81`, `Harita:93` | "açığız" noktası nabız atmıyor |
| `colonBlink` | `CanliSaat.module.css:20` | saatin iki noktası yanıp sönmüyor |

Görsel bedeli en ağır olan duman: `smokeDrift`in tepe opaklığı **.16**. Animasyon
kurulmadığı için üç puf statik varsayılanda, yani **opacity 1** duruyor. Tasarımın en
parlak anının **6,25 katı**, üstelik sabit ve tek noktada. `1440-ana-00.png`,
`1440-ana-04.png` ve `1440-ana-06.png` karelerinde ekranın alt üçte biri gri-bej
lekelerle kaplı; `meşe korunda` satırının arkasındaki leke o satırın kontrastını
düşüren şeyin ta kendisi.

İç sayfalarda ikinci bir etki var: `.ic .kor` ve `.ic .cekirdek` yoğunluk takibi
almadıkları için CSS varsayılanı olan **1** opaklıkta kalıyor. Tasarımın hedefi kor
için .6-1 arası, çekirdek için .4-.82 arası. Yani iç sayfaların koru şu an hedeflenen
aralığın **tepe noktasında sabit**; çekirdek tepe değerinin 1,22 katı, dip değerinin
2,5 katı.

**Sahibinin 1. maddesine cevabı bu madde veriyor:** sorun (a) da değil (b) de değil.
Efekt ne fazla sönük ne fazla parlak; **sahnenin kendisi çalışmıyor.** Bir kor sahnesini
ateş gibi okutan üç şey nefes, sürüklenme ve yükselme; üçü de kapalı. Geriye kalan
şey, sabit bir haleyle üç sabit leke, ve "pek anlaşılmıyor" tam olarak bunu tarif ediyor.
Handoff'un kendi referans karesi (`screenshots/01-ana-sayfa.jpg`) lekesiz, sıcak bir
haleyi gösteriyor: tasarımcının gördüğü sahne bu değildi.

**Ne öneriyorum.** Keyframe'leri kullanan modülün içine taşı. Denenip elenen yollar
(hepsi bu ağaçta build edilerek sınandı):

- `animation: global(emberBreathAna) 8s ...` → lightningcss `global(...)`ı olduğu gibi
  geçiriyor, geçersiz CSS üretiyor
- `animation: "dotPulse" 2.4s ...` (string biçimi) → yine hash'leniyor
- `:global { @keyframes ... }` bloğu → `Parsing CSS source code failed`, build kırılıyor

Çalışan tek yol modül-yerel `@keyframes`; doğrulandı, derlenmiş çıktıda
`@keyframes KorSahnesi-module__AFsT6q__emberBreathAna` üretiliyor ve 42/42 animasyon
koşuyor.

**Hangi dosyada ne değişir.**

- `styles/animasyonlar.css`: 8 keyframe bloğu çıkar, yalnız `prefers-reduced-motion`
  bloğu ve dosya başındaki kaynak yorumları kalır
- `components/ember/KorSahnesi.module.css`: 6 keyframe eklenir
- `components/ui/FotoYuvasi.module.css`: `emberSoft` eklenir
- `components/saat/CanliSaat.module.css`: `colonBlink` eklenir
- `DurumCipi`, `GeceSeridi`, `Cekmece`, `HaritaPlakasi`, `konum/Harita` modülleri:
  `dotPulse` beş kopya (blok başına 1 satır)

Alternatif B (tek kaynak, ama kural bölünür): animasyon bildirimini
`styles/animasyonlar.css`'te global bir sınıfa koy (`.nabizNoktasi { animation: ... }`)
ve sınıfı TSX'ten modül sınıfının yanına ekle. Kopya kalmaz ama stil kararı modül ile
global arasında bölünür; projenin "bileşen stili CSS Modules'te" konvansiyonuna ters.
A'yı öneriyorum.

**Maliyet.** ~40 satır CSS, sıfır mantık değişikliği. Regresyon ağı bir satır: derleme
sonrası `out/**/*.css` içinde geçen her `animation(-name)?:` adının bir `@keyframes`
karşılığı olmalı; `docs/PARITE.md` betiğine eklenebilir, bu hatayı bir daha geçirmez.

---

## Y2. Y1 tek başına uygulanırsa kor yoğunluk merdiveni ölür. İkisi birlikte gitmeli

**Ne gördüm.** Y1'i uygulayıp aynı ölçümü tekrarladım. `KorSahnesi.tsx`'in kaydırmaya
göre yazdığı inline `opacity`/`transform` **hiçbir etki etmiyor**:

| Bölüm | yoğunluk | inline opacity | hesaplanan opacity |
|---|---|---|---|
| acilis | 1 | 1 | 0.879 |
| iddia | 0.55 | 0.685 | 0.994 |
| ocaktan | 0.4 | 0.58 | 0.965 |
| gece | 1.25 | 1 | 0.647 |
| konum | 0.3 | 0.51 | 0.756 |

İlişki yok, çünkü CSS cascade'inde **animasyon bildirimleri normal author
bildirimlerini yener** ve inline `style` da normal author katmanındadır.
`emberBreathAna` hem `opacity` hem `transform` yazdığı için merdivenin ikisi de düşer.

Bugünkü davranış bunun tersi: animasyon ölü olduğu için merdiven **çalışıyor** (ölçtüm,
yukarıdaki inline sütunu birebir hesaplanan değere eşitti) ve `prefers-reduced-motion`
altında da çalışıyor. Yani Y1 tek başına uygulanırsa bugün çalışan tek sahne davranışı
kaybolur ve sahne yedi bölümde de aynı görünür.

Not: handoff'un kendi betiği (`Ana Sayfa Alternatif.dc.html:496`) aynı çakışmayı
taşıyor, orada da merdiven ölü. Yani "tasarıma sadık kalırsak ne olur"un cevabı da
"merdiven çalışmaz". Bu bir sapma kararı, kayıt gerektirir.

**Ne öneriyorum.** Sorumlulukları iki katmana ayır: dış span yoğunluğu (inline
opacity + scale + 0.9s geçiş), iç span nefesi taşısın. İç içe opaklıklar çarpılır,
transform'lar birleşir, ikisi de yaşar.

    <span ref={korRef} className={stil.yogunluk}>
      <span className={stil.kor} />
    </span>

    .yogunluk { position: absolute; inset: 0 }
    .ana .yogunluk { transition: opacity .9s ease-out, transform .9s ease-out;
                     will-change: opacity, transform }

`.kap` zaten `height:100vh` ve `.yogunluk` `inset:0` olduğu için `.kor`un
`bottom:-14%; height:96%` yüzdeleri aynı kutuya çözülür, geometri değişmez.

Bileşik aralık bir ayar düğmesi: tasarımın nefes tabanı .62, yoğunluk tabanı .51,
çarpım .32. Ölçüp nefes tabanını **.78**'e çektim (bileşik .40-1); gece bölümü hâlâ
dolu, konum bölümü sönük, aradaki merdiven okunuyor (`shots/sonrasi/1440-ana-00.png`
ve `1440-ana-04.png`). Sayı sizin, mekanizma değil.

`prefers-reduced-motion` sözleşmesi korunuyor, doğrulandı: azaltılmış modda 0 animasyon
koşuyor, sarmalayıcı yoğunluğu izlemeye devam ediyor (bozo bölümünde 0.615), `scale`
nötr 1.06'da sabitleniyor. Yani `lib/cerceve.ts`'teki uzun yorumun anlattığı davranış
birebir yerinde kalıyor.

**Hangi dosyada ne değişir.** `components/ember/KorSahnesi.tsx` (+2 sarmalayıcı span),
`components/ember/KorSahnesi.module.css` (`.yogunluk` sınıfı; `transition` ve
`will-change` `.kor`/`.cekirdek`ten sarmalayıcıya taşınır). Çalışan hali scratchpad'de.

**Maliyet.** ~15 satır. `IYILESTIRMELER.md`'ye bir satır (nefes tabanının .62'den
.78'e çekilmesi bir sapmadır).

---

## Y3. Gecikmeli iki duman pufu, gecikme boyunca tam güçte duruyor

**Ne gördüm.** Y1'den sonra: `duman1` opacity 0.034 (animasyon dönüyor), `duman2` ve
`duman3` hâlâ **1**. Sebep `animation-delay: 8s` ve `16s` var ama `animation-fill-mode`
yok; gecikme boyunca eleman animasyon öncesi statik değerinde kalıyor.

**Neden sorun.** Her sayfa açılışında ilk 8 saniye bir, ilk 16 saniye iki gri leke tam
güçte ekranda duruyor. Bir misafirin ana sayfada geçirdiği süre büyük olasılıkla bu
pencerenin içinde. Y1 uygulanıp bu uygulanmazsa düzeltmenin yarısı görünmez.
Tasarımda da aynı eksik var (`animation:smokeDrift 27s linear infinite 8s`), yani bu
handoff'un gözden kaçması.

**Ne öneriyorum.** `.duman { animation-fill-mode: backwards }`. Uygulandı ve ölçüldü:
üç pufun üçü de 0'dan başlıyor (`shots/sonrasi/1440-ana-00-fill.png`).

**Hangi dosyada.** `components/ember/KorSahnesi.module.css`, `.duman` bloğu, 1 satır.

**Maliyet.** 1 satır.

---

## Y4. Üst bardaki marka bağlantısı iki genişlikte de 44px'in altında

**Ne gördüm.** `document.elementFromPoint` ile gerçek isabet taraması (kutu boyu değil):

| Hedef | 390px kutu / isabet | 1440px kutu / isabet |
|---|---|---|
| **Marka (Ciğerci Bozo)** | 17px / **21px** | 21px / **26px** |
| Nav bağlantıları | gizli | 44px / 45px |
| Dil anahtarı (EN) | 44px / 44px | 44px / 45px |
| Hamburger | 44px / 44px | gizli |
| Üst bar CTA | gizli | 44px / 45px |
| Mobil eylem barı | 50px / 50px | gizli |

Bardaki yedi hedeften altısı 44px'i geçiyor, yalnız marka geçmiyor.

**Neden sorun.** Erişilebilirlik minimumu sert kısıtta. Üstelik 390px'te nav gizli,
yani marka "ana sayfaya dön"ün **tek** yolu ve bardaki en küçük hedef. Bugüne kadar
ölçülmemiş; footer hedefleri üç kez ölçüldü, üst bardaki bu satır hiç.

**Ne öneriyorum.** `AltBilgi`'de altı kez kullanılan görünmez `::before` tekniği. Marka
satırı flex kutusu içinde, kutu boyu değişmediği için barın yerleşimi kımıldamaz;
footer'daki çakışma riski burada yok, çünkü komşu hedef yatayda ve 44px uzakta.

    .marka { position: relative }
    .marka::before { content: ''; position: absolute; top: 50%; left: 0; right: 0;
                     height: 44px; transform: translateY(-50%) }

**Hangi dosyada.** `components/layout/UstBar.module.css`, `.marka`, ~7 satır.

**Maliyet.** 7 satır, görsel değişiklik yok. Footer'ın 26-28px'lik hedeflerinden
(aşağıda G3) bağımsız yapılabilir; onlar görünür bir yeniden düzen ister, bu istemez.

---

## Y5. Odak halkası tarayıcı varsayılanına bırakılmış

**Ne gördüm.** Ana sayfada sekmeyle ilk altı durak; hepsinde
`outline: auto 1px rgb(0, 95, 204)`. Sitede `:focus-visible` veya `:focus` kuralı
**hiç yok** (`grep -rn "focus" styles/ components/` sıfır sonuç).

**Neden sorun.** WCAG 2.4.7 (AA) "Focus Visible". Chrome'un varsayılanı beyaz + mavi
çift halka çizdiği için `#0A0807` üstünde geçiyor, ama bu Chrome'a özgü: Firefox ve
Safari kendi ince halkalarını çiziyor ve bu zemin üstünde görünürlükleri garanti değil.
Eksiklik eleştirisinin 4. maddesi zaten "gece boyunca tek motor ölçüldü" diyor; odak
halkası bu kör noktanın tam ortasında. Ayrıca `rgb(0,95,204)` sekiz renkli paletin
dışında, ve site geri kalan her yerde ham renk kullanmama kuralını uyguluyor.

Gecenin erişilebilirlik işi ciddiydi (focus trap, landmark adları, 44px, kontrast) ama
hepsi bileşen düzeyinde kaldı; "odak şu an nerede" sorusu hiç sorulmadı.

**Ne öneriyorum.** Tek kural, marka rengiyle:

    :focus-visible { outline: 2px solid var(--tangerine); outline-offset: 3px }
    :focus:not(:focus-visible) { outline: none }

`prefers-reduced-motion` bloğunun animasyonu kapattığı yerde bu halka etkilenmez
(geçiş değil, kalıcı bir çerçeve).

**Hangi dosyada.** `styles/reset.css` (veya `app/globals.css`), 5 satır.

**Maliyet.** 5 satır. Eksiklik eleştirisinin 7. maddesindeki atlama bağlantısı (skip
link) ile aynı turda yapılırsa ikisi tek commit olur.

---

# YAPILABİLİR

## G1. Gece şeridi: "ana sayfa mı değil mi" değil, "bu rotada canlı durum çipi var mı"

*(Sahibinin 2. maddesi)*

**Ne gördüm.** Ölçüm sırasında Girne saati 03:36-03:47 arasındaydı, yani şerit canlı
olarak render edildi ve beş sayfanın hepsinde görüldü. Hangi rotada kaç kez aynı olgu
söyleniyor:

| Rota | Gece şeridi | Hero durum çipi | Hero alt metni / saat | Toplam |
|---|---|---|---|---|
| ana | var | "Şu an açığız" | "Ocak 05:00'e kadar yanıyor" | **3** |
| menu | var | "Şu an açığız" | canlı saat | **3** |
| konum | var | "Şu an açığız" | canlı saat + Saatler tablosu | **4** |
| hikaye | var | yok | yok | **1** |
| gizlilik | var | yok | yok | **1** |

**Neden sorun / neden değil.** Sahibinin gözlemi doğru ama DEVAM'daki üçüncü seçenek
("şeridi yalnız ana sayfa dışında göster") yanlış hedefliyor: menü ve konum sayfaları
da hero durum çipini basıyor. Tekrarın gerçek ölçütü sayfa kimliği değil, o rotada
canlı bir durum göstergesi olup olmadığı. Öte yandan hikaye ve gizlilik sayfalarında
şerit **tek** kaynak: onu kaldırmak o iki rotada "gece açığız" bilgisini tamamen
siler ve tasarımın niyetini de bozar.

Ek bir gerekçe: şerit `rgba(183,53,28,.2)`, yani %80 saydam ve iç sayfa barının
gradyan ucu `.55`. `1440-hikaye-01.png` karesinde altından geçen not metni şeridin
içinden okunuyor. Şerit hem tekrar ediyor hem de barın en zayıf yerini büyütüyor.

**Ne öneriyorum.** `lib/kabuk.ts`'e rota başına bir bayrak: şerit yalnız hero durum
çipi olmayan rotalarda basılsın (bugün hikaye ve gizlilik). Tasarımın niyeti korunur,
tekrar biter, ve 01:00-05:00 arasında iç sayfa çapa payının 96→125px büyümesi de
(`Kabuk.module.css`, `body:has([data-gece-serit])`) yalnız çapası olmayan iki rotada
kalır, yani o düzeltme fiilen gereksizleşir.

**Hangi dosyada ne değişir.** `lib/kabuk.ts` (`ustBarVaryanti` dönüşüne
`geceSeridi: boolean`), `components/layout/UstBar.tsx` (koşullu render),
`lib/kabuk.test.ts` (bir satır). ~12 satır.

**Alternatif.** Şeridi tümüyle kaldırmak da savunulabilir; "gece açığız" bilgisi zaten
her footer'da `10:00 - 05:00` olarak duruyor. Ama o tasarımdan bir öğe silmek olur ve
kararı sizin vermeniz gerekir. Yukarıdaki seçenek daha az kayıpla aynı şikayeti çözüyor.

---

## G2. Geniş ekranda sayfanın üç ayrı sağ kenarı var. Usul kartı bunun semptomu

*(Sahibinin 4. maddesi)*

**Ne gördüm.** Bölüm başına en sağdaki görünür içeriğin sağ kenarı:

| Sayfa / bölüm | 1440px sağ kenar | 1920px sağ kenar | 1920'de ölü alan |
|---|---|---|---|
| hikaye · Açılış | 1376 | 1856 | 0 (beklenen 64px pay) |
| hikaye · Portre | 1376 | 1856 | 0 |
| **hikaye · Usul** | **1244** | **1244** | **612px** |
| hikaye · Sofra (ortalı) | 1150 | 1390 | 530 (ortalı, kasıtlı) |
| ana · Ocaktan paneli | 1244 | 1244 | 612 |
| ana · Gece | 1376 | 1856 | 0 |
| ana · İkram (ortalı) | 1030 | 1270 | ortalı |
| ana · Konum | 1186 | 1186 | 670 |

1440px'te bile ana sayfada dört farklı sağ kenar var (1244 / 1376 / 1030 / 1186).

**Neden sorun.** Site bilinçli olarak sola yaslı ve sayfa kabı yok; okunan metnin kendi
ölçüsü var (`GizlilikSayfasi` 680px), duygusal bölümler ortalı, kabuk tam genişlik.
Bu tutarlı bir karar. Ama `--panel-en: 1180px` ile sınırlanan iki panel (`Ocaktan`,
`Usul`) `margin-inline: auto` almadığı için sola yapışıyor ve komşu bölümler tam
genişliğe açılırken sağda büyüyen bir boşluk bırakıyor. Referans kareleri 924px'te
çekildiği için orada `1180 > 924-2*46` olduğundan kap hiç bağlamıyor, sapma görünmüyor.

Bu tek bir kart meselesi değil; sayfanın yatay sistemi 1310px'in üstünde dağılıyor.

**Ne öneriyorum, üç seçenek.**

1. **En küçük dokunuş:** `CamPanel.module.css` `.sayfaEni`ye `margin-inline: auto`.
   İki panel ortalanır, Sofra ve İkram zaten ortalı, kalan tek aykırı `ana · Konum`
   (1186). 1 satır, ama panelleri ortalarken başlıkları sola bırakır: kartın kendisi
   ortalanır, içindeki metin sola yaslı kalır. 1920'de daha dengeli, 1440'ta fark küçük.
2. **Tutarlı çözüm:** `--panel-en`i tüm sayfa içeriği için bir kap haline getir
   (`main > *` için `max-width: var(--panel-en); margin-inline: auto`), tam genişlik
   isteyen bölümler (Portre, Harita, kabuk) bunun dışında bırakılır. Sayfanın tek bir
   sağ kenarı olur. ~20 satır, ama Portre/Açılış gibi bilinçli tam-genişlik bölümlerin
   tek tek işaretlenmesi gerekir; orta risk.
3. **Hiçbir şey yapma ve kaydet.** 1440px hedef genişlikse sapma 132px, göze batmıyor.
   1920 gerçek bir kullanım senaryosu değilse bu savunulabilir; ama o zaman
   `IYILESTIRMELER.md`'ye yazılmalı, çünkü kayıtsız sapma projenin kendi tanımıyla kusur.

Ben 1'i öneriyorum: en ucuz, geri alması kolay, ve en görünür sapmayı (612px) kapatıyor.

**Hangi dosyada.** `components/ui/CamPanel.module.css:20`.

---

## G3. Footer dokunma hedefleri: bugün gerçek bir başarısızlık yok, veri gelince olacak

*(Sahibinin 3. maddesi)*

**Ne gördüm.** `elementFromPoint` ile gerçek isabet, 390px, sayfa dibine kaydırılmış:

| Footer | Hedef | Kutu | Gerçek isabet |
|---|---|---|---|
| `tam` (ana) | Yol tarifi al | 14px | **45px** |
| `tam` (ana) | Gizlilik | 15px | **45px** |
| `sayfalar` (hikaye) | Ana sayfa / Menü / Konum | 15px | **26-27px** |
| `sayfalar` (konum) | Ana sayfa / Menü / Hikaye | 15px | **26-27px** |
| `serit` (menu) | Yol tarifi al | 53px | **54px** |

DEVAM'ın tablosundaki üçüncü satır, `tam` footer'ın 28px'lik iletişim satırları,
**bugün hiç görünmüyor**: `isletme.telefon`, `whatsapp`, `instagram` hâlâ `null`
olduğu için o satırlar `<a>` değil `<div>` olarak basılıyor, yani dokunma hedefi bile
değiller. Görünmez `::before`ları hedefsiz.

**Neden yapmıyorum.** Kalan tek eksik hedef `sayfalar` footer'ının sayfa bağlantıları
(26-27px). Bu üç rotanın üçü de aynı ekranda 44px'lik iki başka yoldan erişilebilir
durumda: üst bardaki hamburger menüsü (çekmecede 50-66px hedefler, ölçtüm) ve mobil
eylem barı. Yani hedef kısa ama **tek yol değil**, ve `.kolon` gap'ini 13→29px yapmak
üç footer varyantının ritmini birden değiştirir.

**Ne öneriyorum.** Bu maddeyi kapatın: bugün için "kabul edildi, gerekçesi kayıtlı"
statüsüne alın. Tetik şu: **`isletme.telefon` / `whatsapp` / `instagram` dolduğu gün**
`tam` footer'ın iletişim satırları gerçek `<a>` olur ve o zaman 28px'lik hedefler
sitenin birincil eylemleri haline gelir; alternatif yolları yok (mobil eylem barındaki
"Ara" ve "WhatsApp" aynı veriye bağlı). O gün `.kolon` gap'i 13→29px yapılmalı, ve o
gün footer'a zaten dokunulacak.

Bugün yapılacak tek şey Y4 (marka bağlantısı), çünkü onun alternatifi yok.

---

## G4. Harita levhası 390px'te: ölçü ayarı değil, etiket kararı

*(Sahibinin 5. maddesi)*

**Ne gördüm.** 390px'te levha 342px geniş. Levhanın içindeki her elemanın konumu:

    sokak "Naci Talat Caddesi"      35-141
    pinEtiketi "Ciğerci Bozo · No:4" 162-310
    poi "Soli Bet Casino"           103-210
    poi "Hitit Bet"                 208-276
    poi "Girne Macro Market"        225-359   <- 17px taşıyor, overflow:hidden kesiyor
    altNot "harita · koyu tema..."  25-341

Tek taşan eleman üçüncü POI çipi; `390-konum-01.png` karesinde sağ kenarda kesik
duruyor. Ayrıca ikinci ve üçüncü çip yatayda 208-210'da örtüşüyor.

**Ne öneriyorum.** Tasarımın kendi mobil cevabı doğru cevap: `Mobil Prototip.dc.html:169-174`
levhayı etiketsiz çiziyor. 780px altında levhanın metin katmanlarını (cadde adı, pin
etiketi, üç POI çipi, alt not) gizleyin; ızgara, yollar, halka ve pin kalsın. Kaybolan
bilgi kaybolmuyor: aynı ekranda "Soli Bet Casino, yanımızda / Hitit Bet, yanımızda /
Girne Macro Market" çipleri zaten İletişim kartında tam metinle duruyor, cadde adı
sayfanın H1'i, kapı numarası adres satırında.

Yan fayda: levhanın kapı numarasını (`· No:4`) taşımaması, eksiklik eleştirisinin 1.
maddesindeki "sahibi teyit etmedi" alanının görünürlüğünü de azaltır.

**Alternatif (daha ucuz, daha zayıf).** Çipleri `flex-wrap` ile alt alta akıtmak: 17px
taşma biter ama levhanın üçte biri çip yığınına döner ve harita hissi kaybolur.

**Hangi dosyada.** `components/sayfa/konum/Harita.module.css`, `@media (max-width: 780px)`
bloğu, ~10 satır. `Harita.tsx` değişmez.

---

## G5. Ocaktan satırlarında imleç yok ama hover var, ve hover imleçten daha yüksek sesle "tıkla" diyor

*(Sahibinin 6. maddesi)*

**Ne gördüm / ölçtüm.**

| | Durgun | Hover |
|---|---|---|
| `cursor` | `auto` | `auto` |
| `background` | saydam | `rgba(250,170,31,.07)` |
| `padding-left` | 12px | **24px** |

Yani satır fare altında hem renk alıyor hem 12px sağa kayıyor, 0.2s geçişle. Tıklama
hiçbir şey yapmıyor.

**Neden sorun.** `cursor:pointer` kaldırılırken hedef, sahte tıklanabilirliği önlemekti;
ama kaldırılan yarı, iki sinyalin **zayıf** olanıydı. İmleç yalnız fare kullanıcısının
gördüğü bir işaret; zeminin renk alması ve satırın kayması bir "bu bir eylem" vaadidir
ve dokunmatik cihazda da (`:hover` dokunuşta tetiklenir) görünür. Şu anki durum en
kötü kombinasyon: kullanıcı bir tepki görüyor, imleçten bunun link olmadığını
anlayamıyor, tıklıyor, hiçbir şey olmuyor.

**Ne öneriyorum, iki seçenekten biri.**

1. **Vaadi kaldır.** Hover'ın kayma kısmını (`padding-left` geçişi) sil, zemin
   vurgusunu bırak veya onu da sil. Satırlar bir liste olur ve öyle okunur.
   `components/ui/MenuSatiri.module.css`, ~4 satır. Bunu öneriyorum.
2. **Vaadi tut.** Beş satırın hepsini `/menu/#ocaktan` bağlantısına çevir ve
   `cursor:pointer`ı geri getir. Tasarımın niyetine daha yakın, ama beş özdeş hedef
   ekran okuyucuda gürültü yapar ve ürün başına bir çapa olmadığı için beşi de aynı
   yere gider.

Üçüncü bir yol (bölümün altına "Menüyü gör" bağlantısı) tasarımda olmayan bir yerleşim
öğesi ekler; metin sözlükte hazır olsa bile bunu uydurma sayarım, önermiyorum.

---

## G6. Mobilde ilk ekranın üst %23'ü boş

**Ne gördüm.** 390x844'te ana sayfa: üst bar (şeritle birlikte) 87px'te bitiyor, ilk
içerik (durum çipi) 281px'te başlıyor. Arada **194px** boşluk, ekranın %23'ü.
1440x900'de aynı boşluk 98px, yani %11. Sebep hero'nun `min-height:100vh` +
`justify-content:center` + `--bolum-dikey: 120px` üçlüsünün mobilde hiç azalmaması;
bar 109px'ten 87px'e inerken dikey pay 120px'te kalıyor.

**Neden sorun.** `390-ana-00.png` karesinde sayfa yüklenmemiş gibi duruyor. Ekranın
üstünde kor da yok (kor alttan geliyor), yani boşluk gerçekten boş.

**Ne öneriyorum.** 780px altında `--bolum-dikey`i 120px'ten ~72px'e indirin. Bu bir
sapma: mobil prototip hero'yu tek ekranda çiziyor ama dikey payı için değer vermiyor,
yani kaynak sessiz. Tek satır, `styles/tokens.css` medya sorgusu.

**Ölçmeden yapmayın:** `min-height:100vh` + `justify-content:center` birlikteyken
padding yalnız taban görevi görür, asıl konumu ortalama belirler. Değeri düşürmek
hero'yu yukarı çeker ama içerik yüksekliğine bağlı; 390 ve 320'de tekrar ölçün.

---

## G7. Konum sayfasında telefon yer tutucusu bir butonun etiketi

**Ne gördüm.** `000 000 00 00` dizesi beş sayfanın hepsinde var; toplam 10 kez.
Konum sayfasında bunlardan biri "Yol tarifi al"ın **yanındaki bir butonun etiketi**
(`1440-ana-06.png`). Yanında hedefi olmayan bir "WhatsApp" butonu daha var.

**Neden sorun.** Sitenin geri kalanındaki yer tutucular dürüst: "Porsiyon detayı
işletmeden bekleniyor", "Hangi ürünlerin ocakta kalacağı henüz belli değil", kesik
içecek slotu. Bunlar okunduğunda "bu bilgi henüz yok" diyor. `000 000 00 00` ise bir
telefon numarası **biçiminde**; bir butonun içinde durduğunda bozuk bir numara gibi
okunuyor, eksik bir numara gibi değil. `000 TL` daha az riskli çünkü fiyat bağlamı ve
üç sıfır kalıbı yer tutucu olduğunu belli ediyor.

**Ne öneriyorum.** Butonun etiketi veri gelene kadar numara yerine sözlükteki bir
"henüz yok" cümlesi olsun; `isletme.telefon === null` dalında zaten ayrı bir render
yolu var. Yeni metin uydurmak gerekmez, `content/`'te bu kalıbın örnekleri hazır.
Footer'daki `000 000 00 00` (düz metin, ikonlu satır) bence kalabilir: orada bir
eylem vaadi taşımıyor.

**Hangi dosyada.** `components/sayfa/konum/SaatlerVeIletisim.tsx` ve
`components/sayfa/konum/Acilis.tsx` butonları, artı `content/*/ortak.ts`'ye tek anahtar.
İçerik sahibinin onayı gerekir.

---

## G8. İç sayfa üst barının gradyan ucu `.55`; altından geçen metin okunuyor

**Ne gördüm.** `1440-menu-01.png`: barın altından "tane oyun çekimi · yatay",
"porsiyon" ve "000 TL" dizeleri barın içinden okunuyor ve nav bağlantılarıyla
("Ocaktan", "İkramlar") üst üste biniyor. `1440-hikaye-01.png`'de aynı şey bir not
paragrafıyla oluyor.

**Neden sorun (ve neden yapılabilir, yapılmalı değil).** Değer tasarımdan birebir:
`linear-gradient(to bottom, rgba(10,8,7,.94), rgba(10,8,7,.55))`, üç iç sayfa dosyasında
da aynı. Yani sadakat açısından doğru. Ama tasarımın kendi karesi 924px'te ve daha kısa
içerikle çekilmiş; portun uzun sayfalarında barın altından sürekli metin geçiyor.
Gece şeridi açıkken bar 107px oluyor ve saydam alan büyüyor.

**Ne öneriyorum.** Alt ucu `.55`'ten `.78`'e çekin, ya da bara `backdrop-filter: blur(6px)`
ekleyin (mobil varyantta zaten var, `Mobil:55`'ten geldi). İkincisi tasarımın kendi
çözümünü masaüstüne genişletmek olur, kayıt gerekçesi hazır.

**Hangi dosyada.** `components/layout/UstBar.module.css`, `.icVaryant`, 1 satır.
Kayıt: `IYILESTIRMELER.md`.

---

## G9. Menü sayfasının ürün plakaları mobilde tamamen boş

**Ne gördüm.** `390-menu-00.png`: ilk ürün plakası ~600px yüksekliğinde tamamen siyah
bir dikdörtgen, yalnız sol üst köşe işareti görünüyor. 1440'ta aynı plakaların içinde
sıcak bir kor bulutu var (`1440-menu-01.png`).

**Neden.** Plakalar bilinçli olarak zeminsiz (IYILESTIRMELER 42. satır: "kor sahnesine
açılan bir pencere"). Pencere fikri korun bulunduğu yerde işe yarıyor; kor viewport'un
altından geliyor, mobilde plakalar ekranın üstünde olduğu için pencere hiçbir şey
göstermiyor.

**Neden sorun.** Fotoğraflar gelene kadar menü sayfası mobilde boş siyah dikdörtgen
dizisi. Fotoğraf günü bunu çözecek, ama site bugün yayına girerse bu hali görünür.

**Ne öneriyorum.** Karar maddesi, ucuz çözüm yok. İki seçenek: (a) 780px altında
plakaların yüksekliğini kısaltmak (aspect-ratio'yu değiştirmek, tasarım sapması),
(b) `FotoYuvasi`'nın `karo` varyantındaki kendi kor lekesini (`--plaka-zemin` + sol-alt
radial) portre varyantına da vermek. (b) tasarımda karşılığı olmayan bir katman ekler
ama plakayı "boş" değil "bekliyor" gibi gösterir. Fotoğraflar yakında geliyorsa
hiçbir şey yapmamak da doğru.

---

## G10. Tip merdiveni 21 token, ama iki gerçek genişlikte 16-18 farklı değer

**Ne gördüm.** Token'ları tarayıcıda çözdürdüm:

| Genişlik | Token | Farklı değer | Çakışanlar |
|---|---|---|---|
| 1440px | 21 | 18 | 54px x2, 30px x2, 19px x2 |
| 390px | 21 | 16 | 34px x3, 44px x2, 22px x2, 16px x2 |

Yani `--ol-bolum-baslik` ile `--ol-imza-ad` 1440'ta birebir aynı; `--ol-sofra-baslik`,
`--ol-imza-ad` ve `--ol-hero-alt` 390'da birebir aynı. Fark yalnız `vw` eğiminde
yaşıyor, yani hiçbir gerçek genişlikte görünmüyor.

**Neden sorun değil (bugün).** Her token `tokens.css`'te kaynak satırı ve kullanım
sayısıyla belgelenmiş; bu bir sistem değil ama bilinçli bir **transkripsiyon**, ve
"tasarıma sadık" kısıtı altında doğru. Ana sayfanın kendi hiyerarşisi ayrıca gerçekten
çalışıyor: H1 149.8px, ve H2'ler 54 / 54 / 77.8 / **100.8** / 54 / 48, yani Gece ve
İkram bölümleri duygusal tepe olarak açıkça öne çıkıyor. Bu okunuyor ve iyi.

**Ne öneriyorum.** Bugün hiçbir şey. Fotoğraflar ve fiyatlar gelip sayfalar son
halini aldıktan sonra, çakışan üç-dört çifti birleştirmek 21 token'ı ~16'ya indirir
ve bakım yükünü azaltır. Şimdi yapılırsa sadakat denetimlerinin dayanağını bozar.

---

## G11. Kontrast: ölçüldü, temiz. En dar marj 4.62:1

**Ne gördüm.** İlk turda piksel örneklemesiyle iki AA hatası çıktı (footer telif 4.47,
isim notu 4.20). Yöntemi düzelttim: 12.5-13px metinde anti-aliasing "en farklı piksel"i
gerçek metin renginden daha sönük gösteriyor. `getComputedStyle`ın rgba'sını en parlak
zemin pikseli üzerine analitik karıştırınca:

| Hedef | Renk | Oran |
|---|---|---|
| footer telif metni (iki varyant) | `--krem-50` 12.5px | **4.62:1** |
| footer isim notu | `--krem-58` 13px | 5.86:1 |
| harita cadde adı | `--krem-55` 12px | 5.28:1 |
| harita kapı no | `--krem-55` 13px | 5.40:1 |
| gece şeridi metni | tangerine 12.5px | 9.00:1 |
| footer tanım / adres / saat | `--krem-66/70` | 7.10-7.29:1 |
| menü şerit satırı | `--krem-68` | 7.55:1 |
| hero 2. satır / meta | krem tam | 9.53-10.92:1 |

**AA ihlali yok.** En dar marj footer telif satırı: 4.62 vs 4.50, yani %2,7 pay.

**Ne öneriyorum.** Bugün bir şey değil, ama iki not: (1) bu marj Y1+Y2 sonrası
yeniden ölçüldü ve değişmedi, yani kor düzeltmesi kontrastı bozmuyor; (2) footer'a
bir gün daha parlak bir zemin ya da bir kor katmanı gelirse 4.62 önce düşecek yer.
`--krem-50` yerine `--krem-55` tek adımlık bir sigorta olurdu, ama tasarımın `.5`
değerinden sapmayı bu marj için gerekli görmüyorum.

---

# YAPILMAMALI

## R1. Kor sahnesini toptan parlatmak veya toptan söndürmek

Sahibinin maddesindeki (a) ve (b) okumalarının ikisi de yanlış teşhis. `--kor-leke*`
alfalarını yükseltmek Y1'den sonra sahneyi tasarımın hedefinin üstüne çıkarır; iç
sayfaların sahnesini daha da söndürmek (`4f8b085` bir kez yaptı) zaten tepe değerde
sıkışmış bir sahneyi kırpar. Ölçüm net: değer yanlış değil, mekanizma çalışmıyor.
Y1+Y2+Y3 uygulanıp sahne bir kez daha bakılmadan alfa dokunmasın.

## R2. Footer `.kolon` gap'ini 13px'ten 29px'e çıkarmak (bugün)

44px'e ulaşmak için gerekli, ama bugün kazandırdığı bir hedef yok: kısa hedefler
`sayfalar` footer'ının sayfa bağlantıları ve o üç rotanın üçü de aynı ekranda çekmece
(50-66px) ve mobil eylem barı üzerinden 44px'in üstünde erişilebilir. `tam` footer'ın
28px'lik iletişim satırları ise bugün `<div>`, çünkü veri `null`. Üç footer varyantının
ritmini bugün bozmak, karşılığı ancak veri geldiğinde doğacak bir kazanç için.
Tetik kayda geçsin, iş o güne kalsın (G3).

## R3. `ImlecKoru`'yu 780px altında açmak

Mobil prototipin sahnesinde bu katman yok ve dokunmatik cihazda takip edecek bir imleç
de yok. `display:none` doğru karar; sabit bir konumda render etmek sahneye anlamsız
bir ikinci hale ekler.

## R4. Ocaktan satırlarını beş özdeş `/menu/#ocaktan` bağlantısına çevirmek

G5'in ikinci seçeneği. Tasarımın `cursor:pointer` niyetine sadık ama ekran okuyucuda
beş özdeş bağlantı üretir ve beşi de aynı bölüme gider; ürün başına çapa yok. Vaadi
tutmak yerine kaldırmak daha dürüst.

## R5. Tip merdivenini bugün normalize etmek

21 token'ın 4-5 çifti gerçek genişliklerde aynı değere çözülüyor, ama hepsi kaynak
satırıyla belgeli ve sadakat denetimlerinin dayanağı. Sayfalar son halini almadan
birleştirmek, ileride "bu değer nereden geldi" sorusunun cevabını siler. Fotoğraf ve
fiyat turundan sonraya.

---

# Sahibinin iki maddesine kısa cevap

**1. "Kor pek anlaşılmıyor."** Ne (a) ne (b). Sahne çalışmıyor: sitedeki 42 animasyon
bildiriminin **hiçbiri** koşmuyor (Y1). Kor nefes almıyor, duman sürüklenmiyor ve üç
duman pufu tasarımın tepe opaklığının 6 katında donmuş halde ekranın altını gri
lekelerle kaplıyor; iç sayfalarda kor ve çekirdek hedeflenen aralığın tepesinde sabit.
Gördüğünüz şey sönük bir ateş değil, hiç yanmayan bir ateş. Düzeltme uygulandı ve
ölçüldü (`shots/oncesi/` ile `shots/sonrasi/` karşılaştırın); ama tek başına
uygulanırsa bugün çalışan yoğunluk merdivenini öldürür, o yüzden Y1+Y2+Y3 birlikte
gitmeli. Sahne düzeldikten sonra "yeterince anlaşılıyor mu" sorusunu bir kez daha
sormanızı öneririm; alfa değerlerine ondan önce dokunmayın.

**2. "Gece şeridi gereksiz."** Gözlem doğru ama DEVAM'daki üçüncü seçenek eksik
hedefliyor. Ölçtüm: menü ve konum sayfaları da hero durum çipini basıyor, yani tekrar
üç rotada var (ana, menü, konum: 3-4 kez aynı olgu), iki rotada yok (hikaye, gizlilik).
Doğru ölçüt "ana sayfa mı" değil, "bu rotada canlı durum göstergesi var mı". Şeridi
yalnız hikaye ve gizlilikte gösterin: tekrar biter, tasarımın niyeti korunur, ve
şeridin barın en saydam yerini büyütme sorunu (gradyan ucu `.55`, altından metin
okunuyor) çapası olmayan iki rotayla sınırlanır. `lib/kabuk.ts`'e bir bayrak, ~12 satır.
