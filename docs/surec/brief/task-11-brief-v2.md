# Task 11 brief (v2): Menü sayfası

> v1 (`task-11-brief.md`) **iptaldir**. Denetimi 27 madde çıkardı. Değer kaynağı
> olarak kullanmayın.

## İş listeniz nerede

Bu brief tasarımı yeniden anlatmaz, o iş zaten iki kez yapıldı. Sizin iş listeniz:

**`.superpowers/sdd/2026-08-11-web-uygulama-plani/denetim-bayatlik-11-13.md`,
"Task 11: Menü sayfası" bölümü.** 27 maddenin her biri kova (KAPANDI / GEÇERLİ /
KISMEN), kanıt (dosya:satır) ve kalan iş olarak duruyor. 10 madde kapandı, onları
tekrar yapmayın; 13'ü geçerli, 4'ü kısmen.

Spec her zaman `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/Menu Sayfasi.dc.html`.
O belge türetilmiş; bir değeri yazmadan önce kaynaktan teyit edin.

Ayrıca okuyun: `docs/surec/SAYFA-GOREVI-CERCEVESI.md`, `docs/surec/KISITLAR.md`,
`docs/surec/denetim/denetim-task-11.json` (orijinal denetim).

## Bu sayfaya özel dört karar

**1. `Bolum` KULLANMAYIN.** `Menu Sayfasi.dc.html`'de `data-erit` ve `data-yogunluk`
sıfır kez geçiyor (ana sayfada 8'er kez). Erime ve kaydırmaya bağlı yükselme
**ana sayfaya ait**. Düz `<section>` yazın. Bunun sonucu: `Bolum.module.css`'in
`scroll-margin-top`'unu da miras almazsınız.

**2. Çapa payı 96px, 70px değil.** `Menu:347` `- 96` kullanıyor, ana sayfa `- 70`.
`#ocaktan / #ikramlar / #icecekler` hedefleri bunu ister. **Mekanizmayı siz
kurmayın**: kabuk turu bu ayrımı çözüyor ve raporunda hangi yolu seçtiğini yazacak.
`kabuk-turu-report.md`'yi okuyun, oradaki mekanizmayı kullanın. Rapor yoksa veya
mekanizma sizin sayfanızı kapsamıyorsa, kendi çözümünüzü yazın ve **bildirin**.

**3. `kurulu-sofra` etiketi (S10).** Manifest `'kurulu sofra, üstten'` tutuyor, ana
sayfa öyle basıyor (`Ana:239`), menünün çekim karosu `'kurulu sofra'` diyor
(`Menu:274`). Bu, `tane-yakin-cekim` için `fac8f05`'te çözülen kalıbın ikinci örneği,
ama **aynı çözüm doğru olmayabilir**: orada iki farklı en-boy oranı, yani iki ayrı
çekim vardı. Burada aynı çekimin 110px'lik bir karoda kısaltılmış etiketi olması daha
olası.

İki seçenek var, ikisi de meşru, **ölçüp seçin ve gerekçesini yazın**:
- (a) Karoda ", üstten" ile bas, tasarımdan bilinçli sapma olarak kaydet
- (b) Manifest kaydına kısa etiket alanı ekle, `bicim="karo"` onu kullansın

(b)'yi seçerseniz `FotoYuvasi` paylaşılan bir primitif: çağrı yerlerini siz taşırsınız
ve diğer `karo` kullanımlarının da kısa etiket isteyip istemediğini tasarımdan
doğrularsınız. Ölçüt: 110px karoda uzun etiket sarıyor mu, gerçekten ölçün.

**4. `alkolsuzKisa` sondaki nokta (S7).** `Menu:252` "Mekanımız alkolsüzdür."
şeklinde, sözlükteki `ortak.alkolsuzKisa` noktasız. `ortak.alkolsuz`u kullanmayın,
o menüde olmayan ikinci bir cümle taşıyor. Sözlüğe elle nokta **eklemeyin**; farkı
raporlayın.

## Dokunmayacağınız dosyalar

Ağaçta paralel ajanlar var, hepsi kendi dosyalarını tutuyor.

- `styles/tokens.css`: bir ön geçiş görevi O3 ve O4'teki bütün token'ları önceden
  ekledi. **Yeni token eklemeyin.** İşe başlarken dosyayı okuyup gerçek adları alın.
  Gerçekten eksik bir değer bulursanız ham yazmayın, raporlayın.
- `components/ui/Buton.*`, `CamPanel.*`, `BolumBasligi.*`: aynı ön geçiş bunları
  değiştirdi (`BolumBasligi`'nin not rengi artık prop, O5). `on-gecis-report.md`'yi
  okuyun.
- `components/layout/*`, `components/sayfa/Kabuk.tsx`: kabuk turu menü sayfasının
  navigasyonunu ve kompakt footer şeridini kuruyor. **Footer'a dokunmayın** (E14
  orada çözülüyor).
- `components/sayfa/{AnaSayfa,PaketSeridi,HaritaPlakasi}.tsx` ve
  `components/sayfa/ana/`: Task 10'a ait.

## Sizin dosyalarınız

`components/sayfa/MenuSayfasi.tsx` (mevcut yer tutucuyu doldurun) ve
`components/sayfa/menu/` altında bölüm bileşenleri + `.module.css` dosyaları.
Yeni paylaşılan primitif yazacaksanız (`UrunKarti` gibi) `components/ui/` altına
koyun ve bunu raporda gerekçelendirin: menü sayfasından başka kullanıcısı var mı.

## Doğrulama

Geçici rota gerekmiyor: `MenuSayfasi` zaten `/menu/` ve `/en/menu/` altında render
ediliyor. `app/**/page.tsx` dosyalarına dokunmayın.

1. `npm run typecheck`, `npm test`, `npm run build` temiz; rota tablosunda `gecici-` yok
2. **Kendi playwright örneğiniz, kendi portunuz.** Paylaşılan sekme ölçümleri kaydırır
3. `/menu/` ve `/en/menu/`, 1440px ve 390px
4. Parite: `screenshots/01-menu.jpg`, `02-menu.jpg`, `03-menu.jpg`. **`04-menu.jpg`
   yok** (S11), dördüncü kareye dayanan bir doğrulama kurmayın
5. EN farkı (E15): `content/en/menu.ts` ürün adlarını açıklayarak çeviriyor
   (`'Spleen (dalak)'`), tasarımda o metinler `data-en` taşımıyor. Bu içerik
   katmanının **bilinçli kararı**; ekran karşılaştırmasında hata saymayın, bilinçli
   sapma olarak raporlayın
6. Üç çapa (`#ocaktan`, `#ikramlar`, `#icecekler`) gerçekten 96px payla iniyor mu,
   ölçün
7. `prefers-reduced-motion: reduce`: plaka kor nefesleri durur, çapa anında zıplar
8. Dokunma hedefleri 44px; çakışma varsa raporlanır (çakışan hedef kısadan kötüdür)

## Staging ve rapor

**Asla `git add -A`.** Rapor: `task-11-report.md`. Çerçeve dosyasının başlıklarına
ek olarak: kapattığınız denetim maddeleri (numarayla, S1-S11 ve E1-E16), `kurulu-sofra`
kararınız ve ölçümü, yeni yazdığınız her bileşenin neden paylaşılan/yerel olduğu,
ve tasarımda karar değil gözden kaçmış gibi duran her şey.
