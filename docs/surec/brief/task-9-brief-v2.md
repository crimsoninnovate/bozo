# Task 9 brief (v2): Ana sayfa, birinci yarı

> v1 (`task-9-brief.md`) **iptaldir**. Denetimi 14 sapma ve 12 eksik çıkardı
> (`docs/surec/denetim/denetim-task-9.json`). Değer kaynağı olarak kullanmayın.

## Önce oku, bu sırayla

1. `docs/surec/SAYFA-GOREVI-CERCEVESI.md` (otorite sırası, sapma kuralı, staging, rapor)
2. `docs/surec/denetim/denetim-task-9.json` (v1'in nerede yanıldığı; her madde bir tuzak)
3. `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/Ana Sayfa Alternatif.dc.html`
   satır **86-241**. Bu dosya spec'tir. Aşağıdaki her değer oradan alındı, ama şüphede
   kalırsanız dosyaya bakın, buraya değil.
4. `docs/surec/KISITLAR.md`
5. `docs/plans/2026-08-11-web-uygulama-plani.md` Task 9 bölümü: **değer kaynağı değildir.**
   Yalnız dosya listesini kabaca gösterir.

## Kapsam

Dört bölüm: `acilis` (yoğunluk 1), `iddia` (0.55), `ocaktan` (0.4), `ikram` (0.7).
`gece`, `bozo`, `konum`, `paket` Task 10'dur, dokunmayın. `BeadRay`'i bağlamak da
Task 10'dur.

## Dosyalar

Yeni:
- `components/sayfa/ana/Acilis.tsx` + `.module.css`
- `components/sayfa/ana/Iddia.tsx` + `.module.css`
- `components/sayfa/ana/Ocaktan.tsx` + `.module.css`
- `components/sayfa/ana/Ikram.tsx` + `.module.css`
- `components/ui/AnimasyonluSayac.tsx`
- `components/ui/MenuSatiri.tsx` + `.module.css`
- `components/saat/DurumAltMetni.tsx` + `.module.css`

Değişen:
- `components/sayfa/AnaSayfa.tsx` (yer tutucu gövde dört bölümle değişir)
- `styles/tokens.css` (aşağıdaki token'lar)
- `components/ui/Bolum.tsx` + `.module.css` (aşağıya bak, iki küçük ekleme)

Dört bölüm bileşeninin de imzası `{ dil: Dil }`. Metinler `sozluk(dil)`'den gelir,
JSX'te sabit metin yok. `/en/` ağacında aynı bileşenler basılır; parite doğrulamanızın
parçası.

## Bolum'a iki ekleme

`components/ui/Bolum.tsx` şu an yalnız `section`'a `className` geçiriyor, iç `.erit`
katmanına geçirmiyor. Tasarımda dört bölümün de `data-erit` katmanı kendi yerleşimini
taşıyor (`max-width`, `display:flex`, `gap`). İki seçenek var; **birincisini uygulayın**:

1. `eritClassName?: string` prop'u ekleyin, `.erit`'in sınıfına eklenir. Opsiyonel,
   çağrı yeri bozmaz. `Bolum`'un bugün hiç çağrı yeri yok, Task 9 ilki.
2. (Yapmayın) İç katmanı sayfa CSS'inden `> div` ile seçmek.

Ayrıca `.bolum` sınıfına `scroll-margin-top: 70px` ekleyin. Gerekçe: hero'nun ikinci
CTA'sı `#ocaktan`'a, kaydırma ipucu `#iddia`'ya gider; tasarım bunu JS ile 70px ofsetle
yapıyor (`BeadRay.tsx:35` aynı sabiti kullanıyor). `reset.css` zaten
`html { scroll-behavior: smooth }` veriyor ve `animasyonlar.css` bunu
`prefers-reduced-motion`'da `auto !important` ile kapatıyor. Yani **JS kaydırma
yardımcısı yazmayın**; düz `<a href="#ocaktan">` + `scroll-margin-top` tasarımın
davranışını tarayıcının kendi mekanizmasıyla verir. Bunu raporda sapma olarak değil,
mekanizma seçimi olarak yazın.

## Yeni token'lar (`styles/tokens.css`)

KISITLAR kuralı: tasarımda olup token'ı olmayan krem/tangerine değeri **eklenir**, en
yakınına yuvarlanmaz. Sayımlar beş `.dc.html` dosyasının tamamından:

| Değer | Nerede | Sayım |
|---|---|---|
| `rgba(242,233,220,0.24)` | hero meta ayırıcısı, Ana:116 | 1 |
| `rgba(242,233,220,0.3)` | kaydırma ipucu çizgisi, Ana:122 | 7, beş dosyada |
| `rgba(242,233,220,0.12)` | iddia sayaç ızgarasının hairline zemini, Ana:133 | 25 |
| `rgba(250,170,31,0.07)` | ocaktan satır hover zemini, Ana:176 | 12 |
| `0.2s ease-out` | satır hover + ipucu gap geçişi, Ana:120,176 | 11 |

Krem olanlar `.5` altı, yani `--cizgi*` ailesine ait (`--cizgi-buton .36`,
`--cizgi-guclu .22`, `--cizgi-plaka .2`, `--cizgi-bolum .16`, `--cizgi .14`,
`--cizgi-soluk .1`, `--cizgi-hayalet .08`). Adlandırmayı siz verin ama kurala uyun:
**birden çok yerde kullanılan değer paylaşılan rolüne göre, tek kullanımlık değer o
kullanıma göre adlandırılır.** `.3`'ün yedi kullanımına bakıp öyle adlandırın.
Tangerine `--tangerine-07`, geçiş `--gecis-*` ailesine katılır.

Ölçek (`clamp`) ve `letter-spacing` için kural farklı, mevcut pratikten:
**birden çok yerde geçen değer token olur, tek kullanımlık değer bileşenin kendi CSS'ine
`/* Ana:NNN */` kaynak yorumuyla ham yazılır** (bkz. `CanliSaat.module.css:14`,
`IkramCipi.module.css:13`, `AltBilgi.module.css:38`). Krem rgba'ları bu istisnaya
girmez, onlar her durumda token.

---

## Bölüm 1: Açılış (`acilis`, yoğunluk 1)

Bölüm kabuğu: `min-height:100vh; display:flex; flex-direction:column;
justify-content:center; padding:120px var(--sayfa-yatay) 0` (alt dolgu **0**).
Erit katmanı: `max-width:1180px`.

**Durum satırı**: `display:flex; flex-wrap:wrap; align-items:center; gap:14px 26px;
margin-bottom:38px`. İçinde sırayla:
- `<DurumCipi dil={dil} boy="dev" />`
- `<CanliSaat boy="dev" />`
- **yeni** `<DurumAltMetni dil={dil} />`

`DurumAltMetni` (`components/saat/`, `'use client'`): `useGirneSaati()` okur,
`durum?.acik ?? false` ile `s.ortak.durum.acikAlt` / `kapaliAlt` basar. Bu iki anahtar
sözlükte hazır ve bugüne kadar hiçbir bileşen tüketmiyor. `DurumCipi.tsx`'in desenini
birebir izleyin: `durum === null` iken kapalı görünüm basılır, böylece SSR ile ilk
istemci render'ı eşleşir ve hydration uyuşmazlığı olmaz (KISITLAR şartı).
Stil: `font:400 14.5px/1 Inter; color:var(--krem-70)`.

**H1**: iki satır, `{s.ana.hero.baslikSatir1}<br />{s.ana.hero.baslikSatir2}`.
`font:800 var(--ol-hero)/1.06 var(--font-baslik); letter-spacing:var(--iz-hero);
color:var(--krem); text-shadow:0 8px 60px rgba(10,8,7,.6)`.

**Alt başlık satırı**: `display:flex; flex-wrap:wrap; align-items:center;
gap:24px 34px; margin-top:28px`.
- "meşe korunda" (`s.ana.hero.altBaslik`): `font:800 var(--ol-hero-alt)/1
  var(--font-baslik); letter-spacing:-0.025em; color:var(--krem-72)`
- `<TaneDizilimi adet={6} buyuk={20} kucuk={12} bosluk={12} cizgi />`
  Bileşenin `.cizgiliKap` sınıfı `flex:1; min-width:260px; padding:16px 0` ve çizgiyi
  karelerin **arkasından** geçiren mutlak katmanı zaten taşıyor (Ana:101-103). Sarmalayıcı
  yazmayın, prop'u geçin.

**CTA satırı**: `display:flex; flex-wrap:wrap; align-items:center; gap:14px;
margin-top:46px`.
- `<Buton tur="birincil" boy="xl" href={yolTarifiUrl()} hariciMi>` +
  `s.ortak.cta.yolTarifiAl`. (`xl` = 20px 34px, tasarımla birebir.)
- `<Buton tur="ikincil" boy="xl" href="#ocaktan">` + `s.ortak.cta.menuyuGor`.
  **`/menu` DEĞİL.** Tasarımda `data-git="ocaktan"`, yani sayfa içi kaydırma.
  `Buton` `#` ile başlayan href'i düz `<a>` olarak basıyor, `Link`'e sokmuyor.
- Meta satırı: `display:flex; flex-wrap:wrap; align-items:center; gap:12px 22px;
  padding-left:10px; font:500 14.5px/1.6 Inter; font-variant-numeric:tabular-nums;
  color:var(--krem-74)`. İçinde `s.ortak.satirlar.adresKisa`, sonra ayırıcı
  (`width:1px; height:14px; background:` .24 token'ı), sonra
  `s.ortak.satirlar.saatlerGunluk`.

**Kaydırma ipucu**: `<a href="#iddia">`, `margin-top:clamp(40px,6vh,72px);
display:flex; align-items:center; gap:12px; width:fit-content;
transition:gap <0.2s token>`, hover'da `gap:22px`.
- kare `15x15`, `border-radius:2px`, `background:var(--krem-55)`
- çizgi `52x1`, `background:` .3 token'ı
- metin `s.ana.hero.scrollIpucu`, `font:400 13px/1 Inter; color:var(--krem-66)`

İki uyarı: (a) `reset.css` her `<a>`'ya `color:var(--tangerine)` ve hover'da
`color:var(--krem)` veriyor; ipucu kendi rengini açıkça yazmalı, yoksa turuncu çıkar.
(b) 15px yüksekliğinde gerçek bir dokunma hedefi; 44px'e çıkarılmalı. `AltBilgi`de
kurulan overlay tekniğini okuyup uygulayın (mutlak konumlu `::after`). Orada hedefler
komşu satır aralığına (28px) kısıldı; burada komşu interaktif öge yok, tam 44px güvenli.
**Çakışmayı ölçün ve raporlayın**: çakışan hedef kısa hedeften kötüdür.

---

## Bölüm 2: İddia (`iddia`, yoğunluk 0.55)

Bölüm kabuğu: `min-height:100vh; display:flex; align-items:center;
padding:120px var(--sayfa-yatay)`.
Erit katmanı: `display:flex; flex-wrap:wrap; align-items:center;
gap:clamp(32px,4vw,72px); width:100%`.

**Sol, cam panel**: `<CamPanel opaklik={0.72} dolgu="genis" className={...}>`,
className yalnız `flex:1 1 480px; min-width:0` taşır. (Panelin zemini, kenarlığı,
bulanıklığı ve `clamp(28px,3vw,48px)` dolgusu bileşenin kendisinde.)

- Başlık `<h2>`: `font:700 var(--ol-bolum-baslik)/1.12 var(--font-baslik);
  letter-spacing:var(--iz-bolum); color:var(--krem); margin:0`.
  **`BolumBasligi` kullanmayın**: onun `.genis` varyantı `padding-bottom:22px` ve
  `border-bottom` taşıyor, o ocaktan başlık satırının chrome'u. Burada çizgi yok.
  Üç font bildirimini yerel yazmak, primitifin ikinci bir kopyası değildir.
- Paragraf: `margin-top:22px; font:400 var(--ol-govde)/1.65 Inter;
  color:var(--krem-78); max-width:560px`.
- Sayaç ızgarası: kap `margin-top:34px; display:flex; flex-wrap:wrap; gap:1px;
  background:` .12 token'ı. Üç hücre: `flex:1 1 150px; background:var(--panel-koyu);
  padding:22px 24px; display:flex; flex-direction:column; gap:9px`.
  - Sayı: `font:700 clamp(44px,4.6vw,64px)/1 var(--font-baslik);
    font-variant-numeric:tabular-nums; letter-spacing:var(--iz-bolum);
    color:var(--tangerine)`
  - Etiket: `font:400 14px/1.45 Inter; color:var(--krem-74)`
  - Hücre 1 `<AnimasyonluSayac hedef={8} />`, hücre 2 **statik `4+2`**, hücre 3
    `<AnimasyonluSayac hedef={3} />`. Değerler ve etiketler
    `s.ana.iddia.sayac1/2/3`'ten gelir; `deger` alanı string, sayaç `hedef` sayı ister,
    dönüşümü çağıran taraf yapar ve `4+2`'yi sayaç saymaz.

**Sağ, foto plakası**:
```tsx
<FotoYuvasi id="tane-yakin-cekim" dil={dil} bicim="portre">
  <span className={stil.ortaRay}>
    <TaneDizilimi adet={6} buyuk={22} kucuk={13} bosluk={11} ton="anahat" />
  </span>
</FotoYuvasi>
```
`.ortaRay`: `position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
opacity:.5`. `dil` prop'u **zorunlu** (etiketin TR/EN seçimi ondan gelir), v1 iki
çağrıda da atlamıştı. `.portre` sınıfı `flex/min-width/max-width/height/border/
inset shadow` değerlerinin hepsini zaten taşıyor; elle tekrarlamayın.

## AnimasyonluSayac (`components/ui/`)

`'use client'`. İmza: `{ hedef: number; sure?: number }` (varsayılan 900ms).

**Kritik, v1 bunu yanlış yazmıştı**: ilk değer `hedef`tir, `0` değil.
`useState(hedef)` ile başlayın. Tasarımda hedef doğrudan işaretlemede duruyor
(`<div data-sayac="8">8</div>`) ve JS yalnız görünür olunca üstüne yazıyor. Statik
export'ta `0` basmak demek, JS çalışmadan, hydration öncesi veya kullanıcı o bölüme
hiç inmezse rakamın **0** görünmesi demek. SEO çıktısında da 0 yazar.

Davranış: `IntersectionObserver` eşiği 0.5, kesişince `unobserve` + 0'dan `hedef`e
900ms ease-out cubic, `requestAnimationFrame` ile, **bir kez**.
`hareketAzaltilmisMi()` true ise gözlemci hiç kurulmaz, değer `hedef`te kalır.
`aria-hidden` vermeyin: rakam gerçek içerik. Sayarken ekran okuyucunun her kareyi
okumaması için hücrede `aria-live` **kullanmayın** (zaten yok, eklemeyin).

---

## Bölüm 3: Ocaktan (`ocaktan`, yoğunluk 0.4)

Bölüm kabuğu: `min-height:100vh; display:flex; align-items:center;
padding:120px var(--sayfa-yatay)`.

Erit katmanı doğrudan cam paneldir:
`<CamPanel opaklik={0.74} dolgu="orta" genislik="sayfa">`.
`dolgu="orta"` = `clamp(28px,3vw,44px)` ✓ ve `genislik="sayfa"` =
`width:100%; max-width:1180px` ✓. v1 ikisini de kaçırmıştı.

**Başlık satırı**: `<BolumBasligi baslik={s.ana.ocaktan.baslik} not={s.ana.ocaktan.altNot} />`.
Varsayılan `olcek="genis"` tasarımın `padding-bottom:22px` + `1px solid var(--cizgi)`
değerlerini birebir veriyor.

**Beş satır**: `<ol>` içinde beş `<li>`, `ocaktanUrunler` sırasıyla. Ad ve açıklama
`s.ana.ocaktan.urunler[urun.id]`'den, fiyat `fiyatMetni(urun.fiyat)`'ten
(`content/isletme.ts`, `null` iken `000 TL`). Liste `list-style:none; margin:0;
padding:0`.

`MenuSatiri` imzası: `{ sira: number; ad: string; aciklama: string; fiyat: number | null }`.
Sözlüğe bağlanmaz. Sıra **iki haneli** basılır (`String(sira).padStart(2,'0')`).

Satır: `display:flex; flex-wrap:wrap; align-items:center; gap:18px 26px;
padding:22px 12px; border-bottom:1px solid var(--cizgi-soluk);
transition:background <0.2s>, padding-left <0.2s>`.
Hover: `background:` .07 tangerine token'ı, `padding-left:24px`.

- **`translateX` DEĞİL.** v1 öyle yazıyordu; satırı, hover zeminini ve alt çizgisini
  birlikte sağa kaydırır, solda boşluk bırakıp sağdan taşar. Tasarım yalnız iç dolguyu
  büyütüyor, satır yerinde duruyor.
- **Son satırın çizgisi kalkmaz.** Tasarımda beşinin de `border-bottom`'ı var,
  `:last-child` istisnası yok. Refleksle kaldırmayın.

Hücreler:
| Hücre | Stil |
|---|---|
| sıra | `font:600 13px/1 Inter; font-variant-numeric:tabular-nums; color:var(--krem-62); width:26px; flex:none` |
| ad | `font:700 var(--ol-menu-kalem)/1.14 var(--font-baslik); letter-spacing:-0.015em; color:var(--krem); width:clamp(160px,20vw,260px); flex:none` |
| açıklama | `flex:1; min-width:200px; font:400 15px/1.5 Inter; color:var(--krem-70)` |
| ray | `<TaneDizilimi adet={3} buyuk={9} kucuk={5} bosluk={4} ton="krem50" />` |
| fiyat | `font:600 17px/1 Inter; font-variant-numeric:tabular-nums; color:var(--tangerine); width:96px; text-align:right; flex:none` |

Ray üzerine üç not: **üç** kare (v1 altı üretiyordu), boşluk **4px** (v1 5px yazıyordu,
5px küçük karenin kendi ölçüsü), ton **krem50** (büyük kare `rgba(242,233,220,.5)`,
küçük kare `--tangerine-80`, yarıçaplar 1px ve 0 olarak bileşenden doğru çıkıyor).

**Bildirilecek konu, sessizce çözmeyin:** tasarım satırlara `cursor:pointer` veriyor
ama hiçbir hedef vermiyor (`data-git` yok, href yok). Menü sayfasında bu satır hiç
yok, orada ürünler tam genişlikte plaka. Yani bu bir sahte tıklanabilirlik izlenimi.
Uygulama: satırı **interaktif yapmayın** (link/button yok), `cursor:pointer`
**yazmayın**, hover zeminini ve dolgu geçişini koruyun. Raporda sahibine açık soru
olarak yazın: satırlar bir yere gitmeli mi, gitmeliyse nereye.

---

## Bölüm 4: İkram (`ikram`, yoğunluk 0.7)

Bölüm kabuğu: `min-height:100vh; display:flex; align-items:center;
justify-content:center; padding:120px var(--sayfa-yatay); text-align:center`.
Erit katmanı: `max-width:900px; display:flex; flex-direction:column;
align-items:center; gap:28px`.

Sırayla, **beş blok** (v1 paragrafı tümüyle düşürmüştü):

1. `<TaneDizilimi adet={6} buyuk={16} kucuk={10} bosluk={10} />`
2. `<h2>` `s.ana.ikram.baslik`: `font:700 clamp(38px,5.4vw,78px)/1.1
   var(--font-baslik); letter-spacing:-0.025em; color:var(--krem);
   text-shadow:0 8px 50px rgba(10,8,7,.7)`.
   **`--ol-duygusal` / `--iz-duygusal` DEĞİL.** O ikili gece bölümünün H2'sidir
   (800, `clamp(44px,7vw,112px)`/1.08, -.03em). Burada ağırlık 700.
3. Paragraf `s.ana.ikram.metin`: `font:400 clamp(17px,1.5vw,21px)/1.6 Inter;
   color:var(--krem-80); max-width:620px`.
4. Çip sarmalayıcı `display:flex; flex-wrap:wrap; justify-content:center; gap:12px`,
   içinde iki `<IkramCipi ad detay />` (`s.ana.ikram.cip1`, `cip2`).
   **`Cip tur="ikram"` DEĞİL**: o, menü sayfasının tek kelimelik "ikram" etiketi.
   Kutulu iki parçalı çip artık ayrı bileşen: `components/ui/IkramCipi.tsx`.
5. `<FotoYuvasi id="kurulu-sofra" dil={dil} bicim="genis" />`, `margin-top:14px`
   taşıyan bir sarmalayıcı `<div>` içinde (bileşen `className` almıyor; sarmalayıcı
   kolonun 28px gap'ine 14px ekler, tasarımdaki gibi). `bicim="genis"` varsayılan köşe
   sayısı zaten 2 ve `width:min(760px,100%)` sınıfın içinde; ikisini de elle vermeyin.

---

## AnaSayfa.tsx

Yer tutucu `<h1>` gider, yerine dört bölüm sırayla gelir. `Kabuk` zaten
`<main>` sarmalıyor, `KorSahnesi yogunlukTakip` ana sayfada açık. `BeadRay` Task 10.

## Doğrulama

Task 9 geçici rota **istemiyor**: `AnaSayfa` zaten `app/(tr)/page.tsx` ve
`app/(en)/en/page.tsx` tarafından render ediliyor, yani `/` ve `/en/` doğrudan
ölçülür. `app/**/page.tsx` dosyalarına dokunmayın. Build rota tablosunda `gecici-`
ile başlayan rota olmadığını yine de raporlayın.

1. `npm run typecheck`, `npm test` (51 test), `npm run build` temiz
2. **Kendi dev sunucunuzu kendi portunuzda başlatın.** Paylaşılan sekme çekişmesi daha
   önce ölçümleri kaydırdı.
3. `/` ve `/en/` sayfalarını 1440px ve 390px genişlikte açın
4. `design_handoff_bozo_website/screenshots/01-ana-sayfa.jpg`, `02-`, `03-` ile bölüm
   bölüm karşılaştırın. Not: ikram bölümünün alt yarısı (paragraf, iki çip, geniş
   plaka) **üç karenin hiçbirinde yok**; 03 "Sofra kurulu gelir" başlığında bitiyor,
   04 Bozo bölümüyle başlıyor. O bloklar için ekran görüntüsü paritesi kanıt değil,
   `.dc.html` değerleri kanıttır.
5. Tarayıcıda **ölç**, göz kararı onaylamayın. Raporda ölçülen değer tasarımın
   değerinin karşısında tablo halinde dursun.
6. Sayaç davranışı: sayfayı yenileyin, iddia bölümüne kaydırın. 8 ve 3 dolar, `4+2`
   statik kalır, animasyon bir kez çalışır. Ayrıca `out/index.html` içinde rakamların
   **8 ve 3** olarak basıldığını doğrulayın, 0 değil.
7. `prefers-reduced-motion: reduce` ile: erime, sayaç ve yumuşak kaydırma kapalı;
   bölümler son hallerinde; `#ocaktan` bağlantısı anında zıplar.
8. Dokunma hedefleri: kaydırma ipucu ve iki CTA için gerçek kutu ölçün, 44px altını
   ve çakışmayı raporlayın.
9. `/en/` sayfasında dört bölümün de İngilizce bastığını doğrulayın.

## Staging

Ağaçta başka ajanlar olabilir. **Asla `git add -A`.** Yalnız yukarıdaki dosya
listesini yol vererek stage edin. Commit mesajı İngilizce, emir kipi, ilk satır 72
karakterin altında. **Asistan imzası yok**: `Co-Authored-By`, `Claude-Session` veya
benzeri bir dipnot eklenmez (sahibinin kararı, 12 Ağustos 2026).

## Rapor

Çerçeve dosyasının "Rapor" bölümündeki altı başlığa ek olarak şunlar:
- Denetimdeki hangi maddeyi nasıl kapattığınız (14 sapma + 12 eksik, madde madde)
- Eklediğiniz token'ların adı, değeri ve neden o adı seçtiğiniz
- Ocaktan satırlarının hedefsiz `cursor:pointer` sorusu
- Tasarımda karar değil de gözden kaçmış gibi duran her şey
