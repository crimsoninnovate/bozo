# Tasarım kararları turu

Brief: `docs/surec/brief/tasarim-kararlari-brief.md`. Sahibinin onayladığı dört
madde (G1, G2, G4, G5) ve erişilebilirlik turundan devrolan iki madde.

Ölçüm ortamı: statik export (`npm run build`), `serve out -l 4317`, kendi
Playwright örneği (chromium 151), `timezoneId: 'Asia/Nicosia'`. Gece şeridi
ölçümlerinde saat `03:30`'a sabitlendi (`context.clock`). Beş rota, altı genişlik
(390 / 1280 / 1440 / 1680 / 1920 / 2560), her rota 1440x900 ve 390x844'te tam
sayfa karesiyle önce/sonra çekildi (30 kare, `scratchpad/kare/`).

Özet: altı maddenin altısı da uygulandı. Biri (G4) brief'in yazdığı biçimde
değil: gerekçesindeki tasarım referansı bayat çıktı, aşağıda.

---

## G1. Gece şeridi yalnız canlı durum göstergesi olmayan rotalarda

### Bugünkü ölçüm (değişiklikten önce)

| Rota | Gece şeridi | `<main>` içindeki canlı durum metinleri | `<main> [id]` sayısı | `scroll-margin-top` |
|---|---|---|---|---|
| ana | var | "Şu an açığız", "Ocak 05:00'e kadar yanıyor", "Her gün 10:00 - 05:00" | 7 | 70px |
| menu | var | "Şu an açığız" | 3 | **125px** |
| hikaye | var | yok | 0 | yok |
| konum | var | "Şu an açığız", "10:00 - 05:00" (+ Saatler tablosu) | 1 | **125px** |
| gizlilik | var | yok | 0 | yok |

Rapordaki tablo doğrulandı: şerit beş rotanın beşinde de basılıyor, ve ana / menü
/ konum'da aynı olguyu söyleyen başka canlı gösterge zaten var. Hikaye ve
gizlilikte şerit tek kaynak.

### Ne değişti

- `lib/kabuk.ts`: `geceSeridiGosterilirMi(aktif)`, `hikaye` ve `gizlilik` için
  `true`. Ayrı bir fonksiyon, `UstBarVaryanti`'nin alanı değil: o tablonun her
  satırının bir `.dc.html` kaynağı var, bu ise kayıtlı bir sapma.
- `components/layout/UstBar.tsx`: `{geceSeridiGosterilirMi(aktif) && <GeceSeridi …>}`.
- `lib/kabuk.test.ts`: `geceSeridi_yalnizCanliGostergesizRotalarda`, beş rotayı da
  tarar.
- `components/sayfa/Kabuk.module.css`: `body:has([data-gece-serit]) .icSayfa [id]`
  kuralı silindi (aşağıda).

### Sonraki ölçüm

| Rota | Gece şeridi | `scroll-margin-top` |
|---|---|---|
| ana | yok | 70px (değişmedi, `Bolum` veriyor) |
| menu | yok | 96px |
| hikaye | **var** | yok (çapa yok) |
| konum | yok | 96px |
| gizlilik | **var** | yok (çapa yok) |

### Yan etki: 125px'lik çapa payı

Brief "gereksizleştiyse kaldır" diyor. Ölçüldü, gereksizleşti ve kaldırıldı.

Kural iki koşulun aynı anda tutmasını gerektiriyor: sayfada gece şeridi olacak
**ve** `.icSayfa` kapsamında bir çapa hedefi olacak. Değişiklikten sonra bu
kesişim boş: şeridi basan iki rotanın `<main>`'inde hiç `[id]` yok (ölçüldü,
hikaye 0, gizlilik 0), çapası olan iki rotada da (`menu` 3, `konum` 1) şerit yok.
Ana sayfa zaten `.icSayfa` değil. Kural hiçbir kutuya değmiyordu.

Not: bu, "bugün tetiklenmiyorsa sil" demek değil (5. maddede tam tersini
savunuyorum). Fark şu: orada yüzey duruyor ve yalnız veri eksik; burada kuralın
iki koşulu birbirini dışlar hale geldi, yani veri gelse de tetiklenemez.

---

## G2. Geniş ekranda sayfanın birden çok sağ kenarı

### Bugünkü ölçüm (değişiklikten önce)

Ana sayfa, bölüm başına içerik kutusunun sağ kenarı:

| Bölüm | 1280 | 1440 | 1680 | 1920 | 2560 | kaynak |
|---|---|---|---|---|---|---|
| `#acilis` | 1216 | 1244 | 1244 | 1244 | 1244 | `max-width:1180` |
| `#iddia` | 1216 | 1376 | 1616 | 1856 | 2496 | kapaksız |
| `#ocaktan` | 1216 | 1244 | 1244 | 1244 | 1244 | `.sayfaEni` 1180 |
| `#ikram` | 950 | 1030 | 1150 | 1270 | 1590 | ortalı 620 |
| `#gece` | 1216 | 1164 | 1164 | 1164 | 1164 | `max-width:1100` |
| `#bozo` | 1216 | 1376 | 1616 | 1856 | 2496 | kapaksız |
| `#konum` | 1216 | 1376 | 1616 | 1856 | 2496 | kapaksız |
| paket şeridi | 1216 | 1376 | 1616 | 1856 | 2496 | kapaksız |
| üst bar / alt bilgi | 1216 | 1376 | 1616 | 1856 | 2496 | kapaksız |

1280px'te tek kenar (1216): 1180px'lik kapaklar orada bağlamıyor. 1440px'ten
sonra dört kenar açılıyor. 1920px'te kapaklı bölümle tam genişlik bölüm arası
fark **612px** (1856 - 1244); rapordaki değer birebir doğrulandı.

Menü, hikaye ve konum sayfalarında da aynı ayrışma var (örn. hikaye 1920'de:
`Acilis.baslik` 1164, `Usul` paneli 1244, `Portre` fotoğrafı 1856).

### Ne değişti

`.sayfaEni`'ye `margin-inline: auto` **yetmezdi**: ölçüm o sınıfın yalnız iki
çağıranı olduğunu gösterdi (`components/sayfa/ana/Ocaktan.tsx:30`,
`components/sayfa/hikaye/Usul.tsx:43`), sayfanın geri kalanı kapaksız. Panelleri
ortalamak onları geri kalanın sol kenarından da koparırdı: 1920'de Ocaktan paneli
64..1244'ten 370..1550'ye giderken komşusu `#iddia` 64'te kalırdı.

Bunun yerine sayfanın kendisine tek bir içerik sütunu verildi, tek satırda:

```css
/* styles/tokens.css */
--sayfa-yatay: max(clamp(24px, 5vw, 64px), (100vw - var(--panel-en)) / 2);
```

`--sayfa-yatay` zaten üst barın, yedi bölümün, paket şeridinin, alt bilginin ve
dört iç sayfanın yatay payı (28 kullanım yeri). 1308px'e kadar tasarımın kendi
clamp'i kazanır, ondan sonra pay oluğa dönüşür ve sütun `--panel-en`'de (1180px)
durur. Kapaklı bloklar sütunu tam doldurur, kapaksızlar da aynı sütuna oturur.

Tasarımın kendi kanıtı: beş `.dc.html` dosyasında `margin:0 auto` **sıfır kez**
geçiyor, yani tasarımın geniş ekran için bir cevabı yok; kapaklar 924px'lik
yakalama genişliğinde hiç bağlamadığı için sorun orada görünmüyor.

### Sonraki ölçüm

Her rotanın her bölümünün iç sağ kenarı, üst bar ve alt bilgi dahil:

| Genişlik | 390 | 1280 | 1440 | 1680 | 1920 | 2560 |
|---|---|---|---|---|---|---|
| tüm bölümler + bar + footer | 366 | 1216 | 1310 | 1430 | 1550 | 1870 |

Beş rotanın beşinde de tek değer. 390 ve 1280 değişmedi (öncekiyle birebir aynı).
Yatay kaydırma hiçbir genişlikte yok (`scrollWidth > clientWidth` altı genişlikte
de `false`).

Sütunun içinde kalan üç kasıtlı girinti:

- `#gece` ve hikaye `Acilis.baslik`: `max-width:1100px`, yani sütunun 80px içinde
  biter. İkisi de tasarımın kendi değeri (`max-width:1100px`, iki kullanım).
  Ortalamadım: ortalamak onları sütunun sol kenarından koparırdı, bu bir kenar
  değil bir satır uzunluğu ölçüsü.
- `#ikram` ve hikaye `Sofra`: tasarımda zaten ortalı bloklar, sütunun ortasında
  ortalı kalıyorlar.
- `BeadRay`: sağ kenardan 26px'lik sabit ray. Viewport'a demirli bir gezinme
  aracı, içerik sütununun üyesi değil; kasten sütunla hizalanmadı.

---

## G4. Harita levhası 390px'te etiketsiz — **brief'in gerekçesi bayat**

### Bugünkü ölçüm (değişiklikten önce)

390px'te Konum levhası 342px geniş, sağ kenarı x=366. Katmanlar:

| Katman | sağ kenar | taşma |
|---|---|---|
| ızgara / yatay yol / alt not | 365 | -1 |
| pin etiketi "Ciğerci Bozo · No:4" | 334 | -32 |
| POI "Soli Bet Casino" | 234 | -132 |
| POI "Hitit Bet" | 300 | -66 |
| **POI "Girne Macro Market"** | **383** | **+17** |

Kırpılma doğrulandı: 17px, `.levha`'nın `overflow:hidden`'ı kesiyor. Rapordaki
değer birebir tuttu.

### Brief'le çelişen bulgu

Brief G4'ün gerekçesini şuna dayandırıyor: "`Mobil Prototip.dc.html:169-174`
levhayı **etiketsiz** çiziyor". O satırlar okundu. Çizdiği levha **ana sayfanın**
levhası, Konum'unki değil:

| Değer | Mobil:169-174 | Ana levhası (`HaritaPlakasi`) | Konum levhası (`konum/Harita`) |
|---|---|---|---|
| zemin | `rgba(10,8,7,.55)` | `.55` (`--panel-yari`) | `.6` (`--panel-60`) |
| halka konumu | `left:46%; top:53%` | `46% / 53%` | `42% / 47%` |
| ızgara adımı | 40px | 50px -> mobilde 40px | 52px |
| yükseklik | 180px | `min-height:420px` | `clamp(420px,58vh,600px)` |

Üstelik `Mobil Prototip.dc.html`'de "Soli Bet", "Hitit Bet" ve "Macro Market"
kelimeleri **hiç geçmiyor** (grep, 0 eşleşme): mobil prototip yalnız ana sayfayı
taşıyor, Konum sayfasının mobil hali tasarımda yok.

Ve tasarımın o cevabı **zaten uygulanmış**:
`components/sayfa/HaritaPlakasi.module.css:141-146`, 780px altında `.dikeyYol`,
`.isletmeAdi`, `.sokak` ve `.altNot` için `display:none`.

Yani Konum levhasını etiketsiz çizmek tasarımdan gelmiyor, tasarımdan
çıkarsanıyor.

### Brief'in kendi kapısı

Brief: "Kaybolan bilginin aynı ekranda İletişim kartında zaten durduğunu
doğrula; durmuyorsa uygulama, raporla." Doğrulandı, 390px'te konum sayfasının
tam metni tarandı:

| Levhanın metni | Aynı ekranda başka yerde? |
|---|---|
| `.sokak` "Naci Talat Caddesi" | **evet**, hero'da iki kez |
| `.pinEtiketi` "Ciğerci Bozo · No:4" | **evet**, hero adresi "Naci Talat Caddesi No:4" |
| POI "Soli Bet Casino" | **hayır** |
| POI "Hitit Bet" | **hayır** |
| POI "Girne Macro Market" | **hayır** |
| `.altNot` "harita · koyu tema, tek işaret; canlı harita entegrasyonla gelir" | **hayır** |

Dört metin grubunun ikisi tek kaynak. Üç POI çipi yol tarifi bilgisi taşıyor
("şu işaretlerin yanındayız") ve alt not levhanın canlı harita olmadığını söyleyen
dürüstlük notu. Brief'in kapısı kapalı: uygulanmadı.

### Ne değişti

Kırpılma bir hata ve bilgi silmeden düzeltilebilir. 780px altında üçüncü çip sağ
kenara demirlendi:

```css
/* components/sayfa/konum/Harita.module.css */
@media (max-width: 780px) {
  .poiMacroMarket { left: auto; right: 12px; top: 74%; }
}
```

`top` da değişti çünkü yalnız sağa demirlemek çipi `.poiSoliBet` ile üst üste
getiriyordu (yatayda 219..234 çakışma, dikeyde 2%). Çip levhanın güneydoğu
çeyreğinde kalır, yani pinle arasındaki yön ilişkisi bozulmaz.

Erişilebilirlik kararı: `display:none` de görsel gizleme de kullanılmadı, çünkü
hiçbir şey gizlenmedi. Levhanın altı metinli katmanı da ekran okuyucu ağacında
kaldı. Brief'in "bilgi başka yerde varsa gizlemek dürüst; yoksa değil" ölçütü
uygulandı ve sonuç "gizleme" çıktı.

### Sonraki ölçüm

| Katman | sağ kenar | taşma |
|---|---|---|
| POI "Girne Macro Market" | 353 | **-13** |

Levhanın altı metinli katmanı arasında çakışan çift yok (kutu kesişim taraması,
sonuç boş).

### Sahibine kalan

Etiketlerin dar ekranda kalıp kalmayacağı hâlâ açık ve artık bilgi taramasıyla
birlikte `IYILESTIRMELER.md`'de duruyor. Üç POI çipi silinecekse önce onları
İletişim kartına taşımak gerekir; o yeni metin demektir, uydurulmadı.

---

## G5. Ocaktan satırlarının hover kayması — **açıktı, kapatıldı**

Brief "paralel hareket turu bunu zaten kaldırmış olabilir, ölç" diyor. Ölçüldü:
kalkmamıştı.

### Bugünkü ölçüm (değişiklikten önce)

`components/ui/MenuSatiri.module.css`, ana sayfanın beş `#ocaktan` satırı
(`MenuSatiri` başka hiçbir yerde kullanılmıyor, tek çağıran `ana/Ocaktan.tsx`):

| | hover öncesi | hover sonrası |
|---|---|---|
| `padding-left` | 12px | **24px** |
| `background` | `rgba(0,0,0,0)` | `rgba(250,170,31,0.07)` |
| `transition` | `background .2s ease-out, padding-left .2s ease-out` | |

12px'lik kayma yerinde. Hareket turu bu dosyaya dokunmamış.

### Ne değişti

`.satir:hover`'dan `padding-left: 24px` silindi; `transition` yalnız `background`
kaldı; 780px altındaki `.satir:hover { padding-left: 0 }` sıfırlaması da
gereksizleştiği için düştü. Zemin rengi duruyor.

### Sonraki ölçüm

| | hover öncesi | hover sonrası |
|---|---|---|
| `padding-left` | 12px | **12px** |
| `background` | `rgba(0,0,0,0)` | `rgba(250,170,31,0.07)` |
| `transition` | `background .2s ease-out` | |

---

## 5. Paket şeridinin odak halkası

### Bugünkü ölçüm (değişiklikten önce)

`PaketSeridi` zemini `--pumpkin` `#E96112` (tarayıcıda `rgb(233,97,18)`),
`styles/reset.css:23` site geneli halkası `2px solid var(--tangerine)`.

Hesaplanan kontrast (WCAG 2.x rölatif parlaklık):

| Çift | oran | eşik (1.4.11) |
|---|---|---|
| tangerine `#FAAA1F` / pumpkin `#E96112` | **1.75:1** | 3:1, **kalıyor** |
| kömür `#1A1614` / pumpkin `#E96112` | **5.29:1** | 3:1, geçiyor |

Brief'in değerleriyle küçük fark: brief 1.76:1 ve 5.33:1 diyor, ölçüm 1.75:1 ve
5.29:1 veriyor. 5.29 `styles/tokens.css`'in kendi yorumundaki değerle birebir
aynı. Yuvarlama farkı, sonucu değiştirmiyor.

Şeridin üç butonu bugün gerçekten odak almıyor: `content/isletme.ts`'te `telefon`
ve `whatsapp` `null` olduğu için `Buton` üçünü de `aria-disabled="true"` taşıyan
`<span>` basıyor (ölçümde üçü de `SPAN`, `href` yok).

### Karar

Kural eklendi. Erişilebilirlik turunun "bugün tetiklenmeyen kural ölü koddur"
gerekçesine katılmıyorum ve gerekçe ölçümle destekleniyor: ölü olan kural değil
veri. Pumpkin yüzey bugün sayfada duruyor, üç buton yerinde duruyor, tek eksik
telefon numarası. Numarayı ekleyecek kişi `content/isletme.ts`'e bir string
yazacak ve `PaketSeridi.module.css`'i açmayacak.

### Ne değişti

```css
/* components/sayfa/PaketSeridi.module.css */
.serit :focus-visible { outline-color: var(--komur); }
```

Kapsamlı seçici, tek butona değil şeride ait: şeride sonradan eklenecek her
odaklanabilir öğe de kuralı alır. Halkanın kalınlığı ve `outline-offset` site
genelinden gelir, yalnız renk değişir.

### Sonraki ölçüm

Kural şeridin üç `<span>`'ında `outline-color: rgb(26,22,20)` olarak hesaplanıyor
(`getComputedStyle`), yani veri geldiği gün halka 5.29:1 ile çizilecek. Şeridin
dışındaki hiçbir odak halkası değişmedi (`npm test`'in `reset_odakHalkasi…` ve
`derlemeCiktisi_odakHalkasiVar` testleri geçiyor).

---

## 6. Ölü medya sorgusu (`UstBar.sagGrup`)

### Bugünkü ölçüm (değişiklikten önce)

`UstBar.module.css:195` `@media (max-width: 780px) { .sagGrup { gap: 14px } }`.
390px'te hesaplanan `gap`:

| Rota | varyant | ölçülen gap |
|---|---|---|
| `/` | `.anaVaryant` | **30px** |
| `/menu/` | `.icVaryant` | **28px** |

Brief'in 30/28px'i doğrulandı. Sebep özgüllük: `.anaVaryant .sagGrup` (0,2,0) düz
`.sagGrup`'u (0,1,0) yeniyor, medya sorgusu özgüllüğe katkı yapmıyor.

### Tasarımdan doğrulama

`Mobil Prototip.dc.html`, üst barın sağ grubu:
`<div style="display:flex;align-items:center;gap:14px">`, içinde `TR` dil
göstergesi ve `data-menu-ac` hamburgeri. Tasarım gerçekten 14px istiyor.

Yani ölü kural silinmemeli, canlandırılmalı: seçici varyantlarla aynı özgüllüğe
çıkarıldı.

### Ne değişti

```css
.anaVaryant .sagGrup,
.icVaryant .sagGrup { gap: 14px; }
```

### Sonraki ölçüm

| Rota | gap | dil anahtarı | hamburger |
|---|---|---|---|
| `/` | **14px** | 255..314 | 328..372 |
| `/menu/` | **14px** | 255..314 | 328..372 |

İki dokunma hedefi arasındaki gerçek boşluk 14px, ikisi de 44px'lik tabanını
koruyor (dil anahtarı 59px geniş, hamburger 44px), çakışma yok. Erişilebilirlik
turunun `.marka::before` dokunma alanı da bozulmadı: markanın sağ kenarı 390px'te
hâlâ dil anahtarının solunda.

---

## Raporlarla çelişen bulgular

1. **G4'ün tasarım referansı yanlış eşleştirilmiş.** `Mobil Prototip.dc.html:169-174`
   Konum levhasının değil ana sayfa levhasının mobil hali, ve o karşılık
   `HaritaPlakasi`'da zaten uygulanmış. Konum sayfasının mobil hali tasarımda hiç
   yok. Detay yukarıda.
2. **G4'ün bilgi kapısı kapalı çıktı.** Levhanın dört metin grubundan ikisi
   (üç POI çipi ve alt not) 390px'lik ekranda başka hiçbir yerde geçmiyor.
3. **G2'nin önerdiği tek satır yetmiyor.** `.sayfaEni`'nin yalnız iki çağıranı
   var; o sınıfı ortalamak dört sağ kenarı üçe indirir ve sol kenarları böler.
   Sorun panel sınıfında değil sayfa payında.
4. **Kontrast değerlerinde yuvarlama farkı.** Brief 1.76:1 / 5.33:1, ölçüm
   1.75:1 / 5.29:1. Sonucu değiştirmiyor; 5.29 `tokens.css`'in kendi kaydıyla
   aynı.
5. **G5 kapalı değildi.** Brief paralel hareket turunun kaldırmış olabileceğini
   söylüyor; ölçüm 12px kaymanın yerinde durduğunu gösterdi. Dosya çakışması da
   görülmedi, tur başlarken ağaç temizdi.

## Kapılar

| Kapı | Sonuç |
|---|---|
| `npm run typecheck` | temiz |
| `npm test` | 73 test, 73 geçti (72 idi, G1 bir test ekledi) |
| `npm run build` | temiz, 14 rota |
| Yatay kaydırma, 5 rota x 6 genişlik | yok |
| Önce/sonra kareleri | 30 kare, `1440 / 1920 / 390` x 5 rota |
