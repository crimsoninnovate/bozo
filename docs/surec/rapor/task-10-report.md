# Task 10 raporu: Ana sayfa, ikinci yarı

Kapsam: `gece`, `bozo`, `konum` bölümleri, paket şeridi, `BeadRay` bağlantısı.
Spec: `Ana Sayfa Alternatif.dc.html:244-348` ve `:66-80` (bead rayı).

## Yazdığım dosyalar

| Dosya | Durum |
| --- | --- |
| `components/sayfa/ana/Gece.tsx` + `.module.css` | yeni |
| `components/sayfa/ana/Bozo.tsx` + `.module.css` | yeni |
| `components/sayfa/ana/Konum.tsx` + `.module.css` | yeni |
| `components/sayfa/HaritaPlakasi.tsx` + `.module.css` | yeni, paylaşılan |
| `components/sayfa/PaketSeridi.tsx` + `.module.css` | yeni, paylaşılan |
| `components/sayfa/AnaSayfa.tsx` | üç bölüm + paket şeridi + `BeadRay` bağlandı |
| `components/saat/SaatTablosu.tsx` + `.module.css` | `not?` satırı eklendi, iki satır tasarıma karşı ölçüldü |
| `components/saat/VardiyaSeridi.module.css` | iki ham rgba token'a çevrildi |

Dokunulmayan (başka ajanların): `styles/tokens.css`, `components/ui/Buton.*`,
`CamPanel.*`, `BolumBasligi.*`, `components/layout/*`, `components/sayfa/Kabuk.*`,
`lib/kabuk.*`, `components/sayfa/GizlilikSayfasi.*`, `HataSayfasi.*`,
`app/global-not-found.tsx`.

## Kapılar

| Kapı | Sonuç |
| --- | --- |
| `npm run typecheck` | temiz |
| `npm test` | 60/60 geçti |
| `npm run build` | temiz, 14 sayfa, static export |
| Tarayıcı | kendi dev sunucum, port 4611; konsolda yalnız `favicon.ico` 404'ü |

Rota tablosu (`gecici-` ile başlayan rota yok, `app/**` dosyalarına dokunulmadı):

    Route (app)
    ┌ ○ /
    ├ ○ /_not-found
    ├ ○ /en
    ├ ○ /en/gizlilik
    ├ ○ /en/hikaye
    ├ ○ /en/konum
    ├ ○ /en/menu
    ├ ○ /gizlilik
    ├ ○ /hikaye
    ├ ○ /konum
    ├ ○ /menu
    ├ ○ /robots.txt
    └ ○ /sitemap.xml

**Not:** ilk `npm run build` denemesi benim kodumdan değil, paralel bir ajanın
yarım işinden kırıldı (`GizlilikSayfasi.tsx` var olmayan bir `.module.css`
import ediyordu). O dosya ağaca düştükten sonra build temiz geçti.

## Ölçüm tablosu

1440x900, `getComputedStyle`. "Tasarım" sütunu `Ana Sayfa Alternatif.dc.html`.

### Gece (Ana:244-267)

| Ne | Tasarım | Ölçülen |
| --- | --- | --- |
| bölüm | `min-height:100vh; flex; center; 120px clamp(24,5vw,64)` | 900px / flex / center / 120px / 64px |
| `data-yogunluk` | 1.25 | 1.25 |
| erit | `relative; max-width:1100px; column; gap:30` | aynı |
| hayalet saat | `absolute; z-index:-1; top:-16%; right:-2%; 800 clamp(120,22vw,320); ls -.04em; rgba(242,233,220,.055)` | absolute / -1 / -67.97px (-16%) / -22px (-2%) / 316.8px / -12.672px / aynı renk |
| ön saat | `700 clamp(28,3.4vw,44)/1; ls -.02em; #FAAA1F; tabular` | 44px / 700 / -0.88px / rgb(250,170,31) / tabular |
| saat satırı | `relative; flex-wrap; center; gap:20` | aynı |
| çizgi | `clamp(30,5vw,70) x 1px; rgba(242,233,220,.34)` | 70x1 / `--cizgi-saat` |
| etiket | `400 16.5px/1; rgba(242,233,220,.76)` | 16.5 / 400 / 16.5px satır / `--krem-76` |
| H2 | `800 clamp(44,7vw,112)/1.08; ls -.03em; #F2E9DC; 0 10px 60px rgba(10,8,7,.7)` | 100.8 / 800 / 108.864 / -3.024 / krem / birebir gölge |
| H2 metni | nokta yok | "Girne uyurken ocak yanıyor" |
| paragraf | `400 clamp(17,1.5vw,21)/1.6; rgba(...,.8); max-width:640` | 21 / 33.6 / `--krem-80` / 640px |
| vardiya şeridi | `flex-wrap; center; gap:10; margin-top:6`, 7 öğe | aynı, 7 öğe |
| vardiya çipi | `9px 15px; 1px .16; bg rgba(10,8,7,.5); 500 13.5/1; tabular` | birebir |
| bitiş notu | `padding-left:6; 26x1px .3 çizgi; 400 13px; .62` | birebir |

### Bozo (Ana:269-294)

| Ne | Tasarım | Ölçülen |
| --- | --- | --- |
| `data-yogunluk` | 0.45 | 0.45 |
| erit | `flex-wrap; gap:clamp(28,3vw,56); width:100%; center` | 43.2px gap / 1312px / center |
| panel | `flex:1 1 460; min-width:0; padding clamp(28,3vw,48); bg .72; border .1; blur(3px); column; gap:24` | birebir (43.2px dolgu) |
| kicker karesi | `11x11; radius 1px; #FAAA1F` | birebir |
| kicker metni | `500 14.5/1; rgba(...,.72)` | birebir |
| H2 | `700 clamp(32,4vw,54)/1.12; ls -.02em` | 54 / 60.48 / -1.08 |
| paragraf | `400 clamp(16,1.35vw,19)/1.7; .78; max-width:560` | 19 / 32.3 / `--krem-78` / 560 |
| hikaye bağlantısı | `flex; center; gap:10 -> hover 18; fit-content; 600 15/1 #FAAA1F; transition gap .18s` | birebir, `href="/hikaye/"` (EN: `/en/hikaye/`) |
| bağlantı çizgisi | `24x1px #FAAA1F` | birebir |
| plaka | `flex:1 1 360; min-width:280; max-width:520; height clamp(360,54vh,560); border .22; inset 0 0 90px .5` | birebir, 4 köşe, "ustanın eli" |

### Konum (Ana:296-334)

| Ne | Tasarım | Ölçülen |
| --- | --- | --- |
| `data-yogunluk` | 0.3 | 0.3 |
| erit | `flex-wrap; gap:clamp(28,3vw,56); width:100%; **stretch**` | 43.2 / 1312 / stretch |
| panel | `flex:1 1 460; padding clamp(28,3vw,44); bg .74; border .1; blur; column; gap:26` | birebir |
| H2 | `700 clamp(30,3.6vw,48)/1.14; ls -.02em` | 48 / 54.72 / -0.96 |
| adres satırı | `flex; gap:9; flex-start; margin-top:-12; .72`, pin 15px `flex:none; margin-top:3` | birebir |
| adres metni | `400 15px/1.55` | 15 / 23.25 |
| tablo satırı 1 | `15px 12px; bottom .12; bg rgba(250,170,31,.07); 600 16px` | birebir (`--cizgi-kart`, `--tangerine-07`) |
| tablo satırı 2 | `15px 12px; bottom .1; 400 16px; .76` | birebir |
| tablo notu | `15px 12px; 400 14.5/1.6; .66; alt çizgi YOK` | birebir, `border-bottom-width: 0` |
| komşuluk çipleri | `flex-wrap; gap:10`; `9px 14px; 1px .14; 500 13/1; .7` | birebir, üç çip |
| buton şeridi | `flex-wrap; gap:12; margin-top:auto` | birebir (`auto` bu satırda 0px'e çözülüyor: panelde artan boşluk yok) |
| buton 1 | birincil `18px 30px; 16px` | `<a>`, birebir; **gölge farklı, aşağıda** |
| buton 2 | ikincil telefon `17px 29px; tabular` | `<span aria-disabled>`, birebir |
| buton 3 | ikincil WhatsApp `17px 29px` | `<span aria-disabled>`, birebir |
| harita kabı | `flex:1 1 380; min-width:280; max-width:560; min-height:420; border .16; bg rgba(10,8,7,.55)` | birebir; panelle birlikte 494px'e uzuyor (stretch) |

### Harita levhası (Ana:323-331)

| Katman | Tasarım | Ölçülen |
| --- | --- | --- |
| ızgara | `inset:0`, iki eksen, `.05`, adım 50px | birebir |
| yatay yol | `top:56%; height:14px; .08` | 275.5/494 = %55.8, 14px, `--cizgi-hayalet` |
| dikey yol | `left:44%; width:9px; .06` | 245.5/560 = %43.8, 9px, `--cizgi-harita-yol` |
| halka | `46%/53%; 80x80; margin -40; %50; 1px rgba(183,53,28,.5)` | birebir |
| nabız | `46%/53%; 16x16; margin -8; #B7351C; 0 0 0 6px .22, 0 0 30px .85; dotPulse 2.6s` | birebir |
| işletme adı | `26px 0 0 14px; 500 12.5/1; .82` | birebir |
| cadde | `left:8%; top:59%; 400 11.5/1; .62` | birebir |
| alt not | `left:24; bottom:22; 500 12.5/1.5; .68` | birebir |
| POI çipi | **yok** | yok |

Beş dekoratif katman `aria-hidden="true"`, üç metin değil.

### Paket şeridi (Ana:336-348)

| Ne | Tasarım | Ölçülen |
| --- | --- | --- |
| kap | düz `<div>`, `id`/`data-*` yok; `clamp(40,6vh,64) clamp(24,5vw,64); #E96112; flex-wrap; center; space-between; gap:24 40` | `<div>`, `dataset` boş, 54px/64px dolgu, birebir |
| tane rayı | 12px r2 `#1A1614`, 7px r0 `rgba(26,22,20,.55)`, gap 8 | birebir, `aria-hidden` |
| başlık | `700 clamp(28,3vw,40)/1.16; ls -.02em; #1A1614` | 40 / 46.4 / -0.8 / komür |
| paragraf | `400 clamp(15,1.3vw,17)/1.6; rgba(26,22,20,.9)` | 17 / 27.2 / `--komur-90` |
| buton şeridi | `flex-wrap; gap:12`, **üç buton** | üçü de basıldı, hepsi pasif (`aria-disabled`) |
| koyu buton | `18px 30px; 16px; #1A1614` | birebir |
| WhatsApp | `17px 26px; gap 9; ikon 15` | `17px 29px`, gap 9, ikon 15: **3px sapma, aşağıda** |
| telefon | `17px 29px; tabular` | birebir |
| pumpkin | yalnız bu şerit | sayfada `#E96112` taşıyan tam **1** öğe |

### Bead rayı (Ana:66-80)

Yedi boncuk, genişlikler `14/9/14/14/9/14/14`, sıra `acilis, iddia, ocaktan,
ikram, gece, bozo, konum`: birebir. Kaydırırken yedi bölümün hepsinde doğru
boncuk aktif oluyor (aktif boncuk = `lib/cerceve.ts`'in en yakın bölümü, yedi
hedefte de eşleşti). Tıklama: `#gece` boncuğu bölümü tam **70px** ofsete
oturttu; `#konum` boncuğu 79px'e oturdu, çünkü konum son bölüm ve belge sonuna
9px kala kaydırma bitiyor (davranış doğru, ofset hesabı doğru).

### Yoğunluk (tarayıcıda ölçüldü, göz kararıyla değil)

`KorSahnesi` inline yazdığı değerlerden geri çözülen yoğunluk:

| Bölüm | `data-yogunluk` | ölçülen `opacity` | çözülen | `scale` |
| --- | --- | --- | --- | --- |
| acilis | 1 | 1 | 1 | 1.06 |
| iddia | 0.55 | 0.685 | 0.55 | 0.988 |
| ocaktan | 0.4 | 0.58 | 0.4 | 0.964 |
| ikram | 0.7 | 0.79 | 0.7 | 1.012 |
| **gece** | **1.25** | **1 (tavan)** | >=1 | **1.1** (= 0.9 + 1.25x0.16) |
| bozo | 0.45 | 0.615 | 0.45 | 0.972 |
| **konum** | **0.3** | **0.51** | **0.3** | **0.948** |

Gece en parlak (opaklık tavana vuruyor, ölçek zirvede), konum en sönük. Yedi
değerin hepsi tasarımın `data-yogunluk` listesiyle birebir.

### Hareket azaltılmış (`prefers-reduced-motion: reduce`, emülasyon)

| Beklenen | Ölçülen |
| --- | --- |
| nabızlı harita noktası durur | `animation-name: none`, 700ms arayla opaklık 1 -> 1 |
| erime kapanır | erit `opacity:1`, `transform:none`, `transition-duration:0s` |
| bead ölçeği kapanır, renk kalır | aktif boncuk `transform:none`, zemin `rgb(183,53,28)`, `box-shadow` yerinde |
| hikaye bağlantısının gap geçişi | `transition-duration: 0s` |

### 390x844

Yatay taşma yok (`scrollWidth == innerWidth == 390`). Dokunma hedefleri:

| Hedef | Yükseklik | Çakışma |
| --- | --- | --- |
| konum butonları (3) | 56px | yok (dikeyde 67px aralık) |
| paket butonları (3) | 56px | yok |
| hikaye bağlantısı | 44px (görünür kutu 15px, `::before` ile) | yok, üstündeki paragrafa 24px |

Aynı ölçüm 1440px'de de tekrarlandı, sonuç aynı.

### `/en/`

Üç bölüm, harita levhası ve paket şeridi tamamen İngilizce basıyor
(`lang="en"`, "The fire burns while Kyrenia sleeps", "Bozo is not a brand name,
it is a person", "Naci Talat Street, Kyrenia", "map · dark theme, one marker",
"Straight from the fire"). Hikaye bağlantısı `/en/hikaye/`. İşletme adı
çevrilmiyor ("Ciğerci Bozo"), doğru.

## Kapattığım denetim maddeleri

| Denetim maddesi | Durum |
| --- | --- |
| Konum buton şeridi iki değil **üç** buton | kapandı, üçü de basılıyor |
| Haritada POI çipi uydurulmuş | kapandı, POI yok; `Cip tur="poi"` kullanılmadı |
| Paket şeridi iki değil **üç** buton, biri ikonlu | kapandı |
| `TaneDizilimi bosluk={8}` (7 değil) | kapandı, `adet 6 / buyuk 12 / kucuk 7 / bosluk 8 / ton koyu` |
| Paket metin renkleri (`--komur` + `--komur-90`) | kapandı |
| `OkluBaglanti` üç kullanımı ifade edemiyor | kapandı, bileşen yazılmadı (aşağıda) |
| Konum panelinin 44px dolgusu | kapandı, `dolgu="orta"` |
| Bozo metni: kesilmiş başlık, hazır blok kullanılmadı | kapandı, sözlükteki hali basıldı |
| "ocak 05:00'te söner" ayrı satır değil | zaten kapalıydı, `VardiyaSeridi`'nin yedinci öğesi, sarmalayıcı eklemedim |
| Gece başlığında nokta yok | kapandı |
| Hayalet saat opaklıkla değil renk alfasıyla | zaten kapalıydı |
| Gece ön saat satırı eksik | kapandı |
| Gece paragrafı eksik | kapandı |
| Gece ölçüleri (1100px, gap 30, hayalet konumu) | kapandı |
| Konum H2 eksik | kapandı |
| Saat tablosunun üçüncü satırı | kapandı, `not?: string` |
| Komşuluk çipi | zaten kapalıydı, `Cip tur="komsuluk"` |
| Konum kolon düzeni (stretch, 460/380, margin-top:auto) | kapandı |
| Bozo düzeni ve ölçüleri | kapandı |
| Paket şeridi `<section>` değil, düz `<div>` | kapandı, `Bolum` kullanılmadı |
| Paket kap ve paragraf ölçüleri | kapandı |
| `HaritaPlakasi` dosya listesinde yok | kapandı, `components/sayfa/` altında ve stage edildi |
| `FotoYuvasi` çağrısında `dil` yok | kapandı, `koseIsaretleri` verilmedi (portre varsayılanı 4) |
| Footer render edilmiyor | Task 10'un işi değil, kabuk turu kapattı |

## Kararlar

### `PaketSeridi` imzası (Task 13 bunu okuyacak)

```tsx
<PaketSeridi dil={dil} whatsappVarMi />   // ana sayfa: üç buton
<PaketSeridi dil={dil} />                 // Konum sayfası: iki buton
```

`children` yerine tek bir boolean seçildi. Gerekçe: iki kullanım arasındaki tek
fark WhatsApp butonunun varlığı; butonların hedef üretimi (`whatsappUrl`,
`telefonUrl`, `TELEFON_YER_TUTUCU`, pasif dal) `children` ile geçilseydi iki
çağrı yerinde de tekrarlanırdı, yani şeridin asıl mantığı ikiye bölünürdü.
Varsayılan **`false`**: taban hal küçük olan (Konum'unki), ekleyen taraf açıkça
ekler. Task 13 sıfır prop ile doğru şeridi alır.

### `HaritaPlakasi` imzası (Task 13 bunu okuyacak)

```tsx
<HaritaPlakasi
  className={stil.harita}   // flex/min-width/max-width/min-height: sayfanın düzeni
  isletmeAdi={...} sokak={...} altNot={...}
>
  {/* Konum'un pin etiketi ve POI çipleri buradan geçer */}
</HaritaPlakasi>
```

Metinler prop, ek katmanlar `children`, kutunun ızgaradaki yeri `className`
(`CamPanel` ile aynı ayrım). Geometri prop değil: ön geçiş raporunun ölçtüğü
gibi iki levha **on değerin sekizinde** ayrışıyor (zemin .55/.6, yükseklik
sabit/clamp, ızgara 50/52, yatay yol 56%/14px ile 54%/16px, dikey yol tek/çift,
halka 80/.5 ile 110/.45, nabız 16/6/30 ile 18/7/32, cadde etiketi 11.5/.62 ile
12/.55). Sekiz değeri prop yapmak, tek kullanımlık bir bileşene tasarım sistemi
takmak olurdu. Onun yerine her katman kendi sınıfında duruyor ve `.module.css`
dosya başında Konum'un sekiz farkı satır satır yazılı; Task 13 ya bir `varyant`
sınıfı ekler (o sınıf yalnız farkları ezer) ya da kendi levhasını yazar. İkisi
de ucuz, ve POI için ikinci bir kopya gerekmiyor.

### `OkluBaglanti` yazılmadı

Ölçtüm, brief'in okuması doğru çıktı: bugün geriye tek kullanım kalmış.
Footer'ın ok bağlantısı `AltBilgi.module.css:193-226`'da kapalı işin içinde ve
bir adım küçük (14px metin, 22px çizgi, gap 9->16), hero'nun kaydırma ipucu
(`Acilis.module.css:83-127`) kare + çizgi + metin, üçüncü bir yapı. Altı satırlık
bir kural için kapalı iki dosyayı açmak kazanç değil; `Bozo.module.css` kendi
`.hikayeLinki` kuralını taşıyor.

### Birincil butonun `lg` gölgesi: ölçüldü, düzeltilmedi

`boy="lg"` geçildi, sonuç ölçüldü: `rgba(183,53,28,.4) 0 12px 34px`. Tasarım
Ana:318'de `0 10px 30px rgba(183,53,28,.34)` istiyor. Bu, ön geçişin çoğunluğa
normalize etme kararının kayıtlı bir sonucu (`on-gecis-report.md` §6, "Kalan
sapmalar"), `Buton.module.css:31-44`'te yorum olarak duruyor. Yerel override
yazılmadı, `Buton` dosyalarına dokunulmadı.

### İkonlu butonun dolgusu: rampa **doğrulandı**, ama `Buton`'a yazmadım

Beş tasarım dosyasında ikon taşıyan tam **iki** buton var ve ikisi de aynı
kuralı izliyor: **yatay dolgu 3px kısalıyor, dikey aynı kalıyor.**

| Kaynak | İkonlu buton | Aynı adımdaki ikonsuz karşılığı | Fark |
| --- | --- | --- | --- |
| Ana:346 (paket WhatsApp, koyuOutline) | `17px 26px` | Ana:347 `17px 29px` | -3px yatay |
| Konum:81 (hero ikincil, ikonlu) | `18px 28px` | Konum:80 dolu `19px 32px` -> kenarlıklı karşılığı `18px 31px` | -3px yatay |

İki örnek de `gap:9px` + 15px ikon taşıyor, yani ikon + boşluk kutuyu genişlettiği
için yatay dolgu geri alınmış. Gölge merdiveninin aksine bu **çelişkisiz**:
`Buton`'a `ikonlu` bir dolgu adımı (`padding-inline` 3px kısa) eklenmeyi hak
ediyor ve Task 13'ün Konum hero'sunu da düzeltir.

Uygulamadım: `components/ui/Buton.*` bu turda benim dosyam değil ve talimat
"tasarımla uyuşmayan bir şey görürsen düzeltme, raporla" diyordu. Sessizce
29px basmadım, ölçüp yazıyorum. **Sahibine/`Buton` sahibine gidiyor.**
Bugünkü sapma: paket şeridinin WhatsApp butonu `17px 29px`, tasarım `17px 26px`.

### `SaatTablosu`: Ana Sayfa'nın değerlerine çekildi

Bileşen Task 8'de **Konum sayfasının** tablosundan (Konum:108-118) yazılmıştı ve
hiçbir çağrı yeri yoktu (`grep` ile doğrulandı, bugün ilk çağrı yeri benim).
Ana Sayfa'nın tablosu (Ana:301-311) bir tık sıkı:

| | Ana (benim spec'im) | Konum (Task 13) |
| --- | --- | --- |
| satır dolgusu | `15px 12px` | `16px 14px` |
| not satırı | `14.5px/1.6`, `.66` | `14.5px/1.65`, `.68` |
| not metni | alkolsüz cümlesi | kapanış aralığı cümlesi |

Tek gerçek tüketicinin değerlerini aldım (`15px 12px`, `1.6`, `--krem-66`) ve
Konum'un üç farkını `.module.css` dosya başına yazdım. Not satırı zaten
`not?: string` ile opsiyonel; Task 13 bu tabloyu kullanacaksa bir varyant sınıfı
ekler. Ayrıca "Bugün" satırının iki ham rgba'sı token'a çekildi
(`rgba(242,233,220,.12)` -> `--cizgi-kart`, `rgba(250,170,31,.07)` -> `--tangerine-07`).

### `VardiyaSeridi`: değerler tuttu, iki ham rgba token'a çekildi

Tasarımın 254-264 satırlarına karşı ölçüldü, **hiçbir değer sapmıyor**. Şerit
`margin-top:6px`'i ve yedinci öğeyi zaten kendi içinde taşıyor, bu yüzden
brief'in istediği sarmalayıcı `<div>` gereksiz ve eklenmedi. KISITLAR'ın "ham
rgba yazma" kuralı gereği `rgba(242,233,220,.16)` -> `--cizgi-bolum` ve
`rgba(242,233,220,.3)` -> `--cizgi-tire` çevrildi.

### Adres ayırıcısı JSX'te

`s.ortak.satirlar.adresTamSatir` + ` · ` + `s.ortak.satirlar.adresSehirUlke`.
Nokta sözlüğe girmedi; `TelifSeridi.tsx:25` aynı kalıbı zaten kullanıyor (iki
doğrulanmış parça, aralarındaki noktalama JSX'te). Sözlükte birleşik bir anahtar
yok ve yeni metin uydurulmadı.

### 16px altı metin (KISITLAR 2. katman, sayfa başına bir kez)

Bu üç bölümde 16px'in altına inen her metin arayüz mikro metni: komşuluk çipleri
13px, vardiya çipleri 13.5px, bitiş notu 13px, bozo kicker'ı 14.5px, harita
etiketleri 11.5-12.5px, saat tablosunun not satırı 14.5px (tablo notu), adres
satırı 15px (meta satırı). Hiçbiri bölümün okuma metni değil; üç bölümün gövde
paragrafları 17-21px (gece), 16-19px (bozo). **3. katman kaydı gerekmedi.**

## Token durumu

`styles/tokens.css`'e **dokunulmadı, yeni token eklenmedi.** Ön geçişin eklediği
33 token'ın Task 10'a ait olanlarının hepsi kullanıldı: `--cizgi-saat`,
`--komur-90`, `--ol-govde-kucuk`, `--cizgi-harita`, `--cizgi-harita-yol`,
`--kor-halka`, `--kor-pin-halka`, `--kor-pin-parilti`, `--panel-yari` (levha
zemini, `--panel-60` DEĞİL).

Token'ı olmayıp ham yazdığım üç değer, üçü de gerekçeli:

| Değer | Nerede | Neden ham |
| --- | --- | --- |
| `0 10px 60px rgba(10,8,7,.7)` | gece H2 gölgesi (Ana:252) | `--golge-baslik` `0 8px 50px`, farklı değer; tasarımda tek kullanım. `Acilis.module.css:29` aynı deseni (tek kullanımlık gölge, yorumlu, ham) zaten kurmuş |
| `clamp(28px,3vw,40px)` | paket başlığı (Ana:341, Konum:157) | `--ol-*` ailesinde karşılığı yok; **2 kullanım, token hak ediyor** |
| `max-width: 1100px` | gece erit (Ana:245) | `--panel-en` 1180px; tek kullanımlık ölçü |
| `0.18s ease-out` | hikaye bağlantısı gap geçişi (Ana:280) | `--gecis-yerlesim` 0.2s, yuvarlamak sessiz sapma olurdu; `AltBilgi.module.css:205` aynı değeri zaten ham yazıyor, **artık 2 kullanım, token hak ediyor** |
| `rgba(10,8,7,.5)` | vardiya çipi zemini (Ana:255) | `--panel-*` merdiveninde `.5` adımı yok; Task 8'den beri ham |

Son üçü token turuna gitmeli; `tokens.css` bu turda başka bir görevin kapsamı
olduğu için ekleyemedim (talimat: eksik değeri raporla, sessizce ham yazma).

## Sahibine / diğer görevlere açık kalanlar

1. **`Buton`'a ikonlu dolgu adımı.** Kanıt yukarıda, iki örnek de -3px yatay.
   Bugün Ana Sayfa'nın paket WhatsApp butonu 3px geniş basıyor; Task 13'ün
   Konum hero'sunda aynı sorun çıkacak.
2. **Birincil `lg` gölgesi** (Ana:318, 0.06 alfa + 2px/4px yayılım farkı). Ön
   geçişin bilinçli normalizasyonu; kayıtlı, ama hâlâ görünür bir sapma.
3. **`clamp(28px,3vw,40px)`, `0.18s ease-out`, `rgba(10,8,7,.5)`** token'ları.
4. **`SaatTablosu`'nun Konum varyantı**: Task 13 bu tabloyu kullanacak mı? Brief
   "kullanmayacak" diyor ama Konum:108-118 tam olarak aynı üç satırlı yapıyı
   taşıyor, yalnız dolgusu ve not metni farklı. Kullanacaksa bir `varyant`
   prop'u gerekiyor.
5. **Harita levhasının metinleri ekran okuyucuya açık.** Beş dekoratif katman
   `aria-hidden`, üç metin değil. "Ciğerci Bozo / Naci Talat Caddesi / harita ·
   koyu tema, tek işaret" sırası, sayfanın adres bilgisini bir kez daha
   tekrarlıyor. Tasarım bu ayrımı yapmıyor (hepsi `<div>`); levhanın tamamının
   `aria-hidden` olması da savunulabilir, ama o zaman cadde adı hiç okunmaz.
   Brief "metinler hariç" dediği için öyle bırakıldı.
6. **`IYILESTIRMELER.md`'ye geçmesi gereken satırlar**: ikonlu buton dolgusu,
   `SaatTablosu`'nun Ana Sayfa değerlerine çekilmesi, adres ayırıcısının JSX'te
   olması. Ağaçta üç ajan yazdığı için o paylaşılan dosyaya bu turda
   dokunulmadı (ön geçişin de aynı gerekçeyle atladığı dosya).
