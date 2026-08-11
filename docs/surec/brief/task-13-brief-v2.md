# Task 13 brief (v2): Konum sayfası

> v1 (`task-13-brief.md`) **iptaldir**. Denetimi 30 madde çıkardı ve bu üç sayfanın
> en az kapananı: yalnız 4 madde kapandı, 18'i geçerli, 8'i kısmen. Yani burada
> gerçekten en çok yazılacak iş var.
>
> **v1'in Step 2 kod bloğunu tamamen atın.** Harita levhasının CSS'ini yanlış
> sayfadan (ana sayfanın envanterinden) kopyalamış; iki levhanın değerleri farklı.

## İş listeniz nerede

**`.superpowers/sdd/2026-08-11-web-uygulama-plani/denetim-bayatlik-11-13.md`,
"Task 13: Konum sayfası" bölümü.** 30 maddenin her biri kova, kanıt ve kalan iş
olarak duruyor.

Spec: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/Konum Sayfasi.dc.html`.
Ayrıca: `docs/surec/SAYFA-GOREVI-CERCEVESI.md`, `docs/surec/KISITLAR.md`,
`docs/surec/denetim/denetim-task-13.json`.

## Bu sayfaya özel beş karar

**1. `Bolum` KULLANMAYIN.** `Konum Sayfasi.dc.html`'de `data-erit` ve
`data-yogunluk` sıfır kez geçiyor. Düz `<section>` yazın. `#harita` çapası 96px pay
istiyor (`Konum:252`), ana sayfanın 70px'i değil; mekanizmayı kabuk turu çözüyor,
`kabuk-turu-report.md`'yi okuyun.

**2. Harita levhası: Task 10'unkiyle aynı fikir, farklı değerler.** Task 10
`components/sayfa/HaritaPlakasi.tsx` yazıyor (ana sayfa: ızgara 50px, halka 80px
@46/53, pin 16px, tek dikey yol). Konum'unki (`Konum:89-101`): ızgara **52px**, halka
**110px** @42/47, pin **18px**, **iki** dikey yol (20%/9px ve 64%/7px), zemin `.6`
(ana sayfada `.55`), `min-height:clamp(420px,58vh,600px)` ve tam genişlik.

Karar sizin, ama **ölçerek** verin: on iki değerin kaçı farklı? Az sayıda farklıysa
varyant prop'u ekleyip Task 10'un çağrı yerini siz taşıyın. Çoğu farklıysa iki ayrı
bileşen dürüst çözümdür, "aynı fikir" tek başına ortaklaştırma gerekçesi değil.
Hangisini seçerseniz seçin ölçümü ve gerekçeyi raporlayın.

Levhanın içinde okunması gereken dört metin var (cadde etiketi, pin etiketi, üç POI
çipi, alt yazı). **Levhanın tamamına `role="img"` veya `aria-hidden` vermeyin** (S10);
yalnız ızgara, yollar, halka ve pin noktası dekoratiftir.

**3. Paket şeridi Task 10'un bileşeninden gelir (O9).** `Konum:152-163` ana
sayfanınkiyle satır satır aynı kabuk, tek fark buton sayısı (burada iki: `Paket
sipariş` + telefon; ana sayfada üç, WhatsApp da var). Task 10 bunu
`components/sayfa/PaketSeridi.tsx` altına paylaşılan olarak koydu ve buton kümesini
prop/slot ile alıyor. **İkinci bir kopya yazmayın.** İmzası ihtiyacınızı
karşılamıyorsa genişletin ve Task 10'un çağrı yerini taşıyın.

**4. İki yeni bileşen yazacaksınız.**
- `IletisimSatiri` (S13, E14): tek `deger: string` prop'u yetmez, iki tipografi var
  (`Konum:131` `400 14px/1` + tabular vs `:138,145` `400 14px/1.4`, tabular yok).
  Bir `tur` prop'uyla yazın. Hover kenarlığı `rgba(250,170,31,.7)` için token ön
  geçişte eklendi, hover zemini `--tangerine-07` hazır.
  **Üç satırı aynı muameleye tabi tutmayın (S12):** yalnız telefonun alt satırı yer
  tutucudur; WhatsApp ve Instagram'ın alt satırları sabit açıklama metnidir. Ve
  **e-posta satırı eklemeyin** (S11): tasarımda üç satır var, `isletme.eposta` null.
- `AlkolsuzRozeti` (E11): 7x7 nokta **animasyonsuz**. `DurumCipi`'nin nabızlı
  noktasıyla karıştırmayın; oradaki nabız açık/kapalı durumu gösterir, buradaki
  sabit bir işaret. Kenarlık `--cizgi`, metin `--krem-74`, nokta `--tangerine`,
  üçü de hazır.

İkisi de yalnız bu sayfada kullanılıyorsa `components/sayfa/konum/` altına koyun;
başka kullanıcısı olduğunu gösterebiliyorsanız `components/ui/`. Kararı gerekçelendirin.

**5. Hero butonlarının boyu hiçbir adıma oturmuyor (E4).** Tasarım birincil için
`19px 32px / 16px`, hayalet için `18px 28px / 16px` diyor; `Buton`'un `lg`'si
`18px 30px` ve `cerceveli.lg` `17px 29px`. **Hiçbiri birebir değil.** Ölçün, en
yakınını seçin, farkı raporlayın. `Buton`'u kendiniz değiştirmeyin: ön geçiş o
dosyayı tuttu ve boya bağlı merdiveni orada karara bağladı, `on-gecis-report.md`'yi
okuyun.

## Dokunmayacağınız dosyalar

- `styles/tokens.css`: ön geçiş O3/O4'ün hepsini ekledi; bu sayfanın ihtiyaç
  duyduğu levha alfaları (`.6` zemin, `.05` ve `.045` ızgara/yol, `.45` halka,
  `.22` ve `.85` pin, `.4` pin etiketi kenarlığı, `.7` hover kenarlığı) dahil.
  **Yeni token eklemeyin**, dosyayı okuyup adları alın.
- `components/ui/Buton.*`, `CamPanel.*`, `BolumBasligi.*`: ön geçişe ait.
  `CamPanel`'e bulanıklığı kapatma yolu orada eklendi (O6): Konum'un iki kartında
  tasarımda `backdrop-filter` **yok**, kapalı geçin.
- `components/layout/*`, `components/sayfa/Kabuk.tsx`: kabuk turu Konum'un üst bar
  CTA'sını (`#harita` kaydırması) ve Sayfalar kolonlu footer'ını kuruyor.
- `components/saat/SaatTablosu.*`: Task 10 üçüncü satır prop'unu ekledi. Konum'un
  saatler kartı **farklı bir yerleşim** (`Konum:107-122`); tabloyu kullanacaksanız
  imzasını `on-gecis`/`task-10` raporlarından okuyun, değiştirmeyin.
  Yerleşim tuzağı (E10): kartın `gap:22px`'i tablo ile not paragrafının arasına
  girmemeli, ikisi aynı sarmalayıcıda boşluksuz durmalı. `02-konum.jpg` bunu
  doğruluyor.

## Sizin dosyalarınız

`components/sayfa/KonumSayfasi.tsx` (mevcut yer tutucuyu doldurun) ve
`components/sayfa/konum/` altındaki bölüm bileşenleri.

## Doğrulama

1. `npm run typecheck`, `npm test`, `npm run build` temiz; `gecici-` rota yok
2. Kendi playwright örneğiniz, kendi portunuz
3. `/konum/` ve `/en/konum/`, 1440px ve 390px
4. Parite: `01-konum.jpg`, **`02-konum.jpg`** (Saatler + İletişim kartları, atlamayın)
   ve `03-konum.jpg` (paket şeridi + footer, sizin kapsamınızda değil ama şeridin
   doğru yerde durduğunu gösterir)
5. `#harita` çapası 96px payla iniyor mu, ölçün
6. `prefers-reduced-motion: reduce`: pin nabzı durur (`dotPulse` zaten
   `animasyonlar.css:24-30` ile kapatılıyor, doğrulayın), çapa anında zıplar
7. Levhanın içindeki dört metnin ekran okuyucuya ulaştığını, dekoratif katmanların
   ulaşmadığını doğrulayın
8. Dokunma hedefleri 44px; üç `IletisimSatiri` yan yana dururken **çakışma** olup
   olmadığını ölçün. Footer'da bu tam olarak sorun çıkardı: çakışan hedef kısa
   hedeften kötüdür, çünkü kısa hedef görünür biçimde başarısız olur, yanlış hedef
   başarılı olur ama yanlış şeyi yapar

## Staging ve rapor

**Asla `git add -A`.** Rapor: `task-13-report.md`. İçinde: kapattığınız madde
numaraları, harita levhası kararınız ve on iki değerin karşılaştırma tablosu, iki
yeni bileşenin yerleşim gerekçesi, hero buton boyu farkı, ve tasarımda karar değil
gözden kaçmış gibi duran her şey.
