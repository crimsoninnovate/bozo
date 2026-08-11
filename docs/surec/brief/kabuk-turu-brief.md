# Kabuk turu: sayfa varyantları

Task 6 kabuğu (`UstBar`, `AltBilgi`, `Kabuk`) yalnız **ana sayfanın** tasarımına
bakılarak kuruldu ve on rotanın hepsine aynı kabuğu basıyor. Menü, Hikaye ve Konum
dosyaları açıldığında üçünün de kabuğu tasarımdan ayrıldığı görüldü. Bu tur o farkı
kapatır. Sayfa görevleri (11, 12, 13) buna bağlı; onlar başlamadan bitmeli.

Kaynak: `.superpowers/sdd/2026-08-11-web-uygulama-plani/denetim-bayatlik-11-13.md`
maddeler **O2, O7, O8**. Spec her zaman `.dc.html` dosyasının kendisi.

## Neden bu bir "düzeltme" değil, eksik kanıtla verilmiş bir kararın revizyonu

`AltBilgi.tsx:102-107`'de yazılı bir karar var: "Sayfalar kolonu açmayalım, tek
yetim anahtara sayfa uydurmak olurdu." O karar doğru sebeple ama eksik kanıtla
verilmiş. Tasarımda Sayfalar kolonu **var** (`Hikaye:141`, `Konum:173`) ve içindeki
üç bağlantı gerçek sayfalara gidiyor.

Daha da net olanı: sözlükteki iki "yetim" anahtar, yapılmamış iki varyanta tam
oturuyor.

- `ortak.footer.sayfalarBaslik` (`content/tr/ortak.ts:85`) → Hikaye/Konum footer'ı
- `ortak.satirlar.adresVeSaat` = `Girne, Naci Talat Caddesi · Her gün 10:00 - 05:00`
  (`content/tr/ortak.ts:60`) → menü şeridinin tek satırı, karakteri karakterine

Sözlük Task 3'te beş tasarım dosyasının tamamından çıkarıldı, yani doğru okumuştu.
Yetim sanılan anahtarlar yetim değilmiş.

## Karar: tasarım izlenir, üç varyant da kurulur

Çeşitliliğin gerekçesi söylenebiliyor: menü uzun ve tek amaçlı bir sayfa, kompakt
bitişi ve bölüm atlama navigasyonu bunun sonucu. Task 17'nin kuralı burada "ikisini
de koru ve adlandır" diyor. `IYILESTIRMELER.md`'ye yazılacak bir sapma değil, kabuğun
eksik kalmış bir parçası; yine de kararın kendisi rapora geçer.

## O7: `UstBar` sayfa varyantları

Bugünkü `UstBar` (`components/layout/UstBar.tsx`) her rotada aynı nav'ı ve aynı
CTA'yı basıyor. Tasarım:

| Sayfa | Nav | CTA |
| --- | --- | --- |
| Ana sayfa | bugünkü hali | `yolTarifiUrl()` (harici) |
| **Menü** | `Ocaktan / İkramlar / İçecekler / Hikaye / Konum` (`Menu:50-54`); ilk üçü **sayfa içi çapa**, aktif sekme yok | ölç |
| **Hikaye** | ölç | Konum **sayfasına** link (`Hikaye:56`) |
| **Konum** | ölç | sayfa içi `#harita` (`Konum:56`) |

"ölç" yazan hücreleri tasarımdan siz çıkarın; yukarıdaki üç satır taramadan geliyor
ve türetilmiş bir belge, kaynak değil. Her hücreyi `.dc.html`'den doğrulayın.

`Kabuk` zaten `aktif: RotaAnahtari` alıyor (`components/sayfa/Kabuk.tsx:24`), yani
varyantı seçmek için yeni bir kanal açmanız gerekmiyor.

Mobil çekmece (`Cekmece.tsx`) ve `MobilAksiyonBari` de aynı sayfa farkını taşıyor mu,
`Mobil Prototip.dc.html`'e bakıp doğrulayın. Taşıyorsa kapsamdadır.

## O8: `AltBilgi` sayfa varyantları

| Sayfa | Footer |
| --- | --- |
| Ana sayfa | Dört kolon: marka, **Adres**, Saatler, İletişim + telif şeridi (`Ana:351-380`, bugünkü uygulama) |
| **Hikaye, Konum** | Dört kolon ama ikinci kolon **Sayfalar**: `Ana sayfa / Menü / Konum` bağlantı listesi, bulunulan sayfa listede yok (`Hikaye:138-150`, `Konum:170-185`) |
| **Menü** | Dört kolon **değil**: kompakt tek şerit, marka + `adresVeSaat` + iki buton (`Menu:283-292`) |

Menü şeridinin ölçüleri (`Menu:283`): `padding:60px var(--sayfa-yatay);
background:var(--panel-koyu); border-top:1px solid var(--cizgi-soluk); display:flex;
flex-wrap:wrap; align-items:center; justify-content:space-between; gap:26px`. Sol
kolon `flex-direction:column; gap:9px`: wordmark `800 20px/1` Bricolage
`letter-spacing:-.04em` + satır `400 14.5px/1.6` Inter tabular `--krem-68`. Sağda
`Buton` çifti (birincil "Yol tarifi al" + ikincil telefon). Bunları da tasarımdan
teyit edin.

Hikaye/Konum'un Sayfalar kolonu: başlık `ortak.footer.sayfalarBaslik`, bağlantılar
`400 14.5px/1` Inter `--krem-70`, hover `--tangerine`. Bağlantı adları
`ortak.nav`'dan gelir, yeni metin yazılmaz. **Bulunulan sayfa listede yer almaz**;
bunu tasarımdan doğrulayın (Hikaye'de "Hikaye" yok, Konum'da "Konum" yok mu).

Telif şeridinin üç varyantta da olup olmadığını ölçün.

## O2: çapa payı 96px

`Menu Sayfasi.dc.html:347` ve `Konum Sayfasi.dc.html:252` sayfa içi kaydırmayı
**96px** ofsetle yapıyor; ana sayfa (`Ana:554`) 70px. Repo yalnız 70px'i biliyor:
`components/ui/Bolum.module.css:12` ve `components/layout/BeadRay.tsx:35`.

Menü'nün `#ocaktan / #ikramlar / #icecekler` ve Konum'un `#harita` hedefleri 96px
istiyor. Ama o üç sayfa `Bolum` **kullanmayacak** (tasarımlarında `data-erit` ve
`data-yogunluk` hiç yok, üç dosyada da sıfır kez), yani `Bolum`'un
`scroll-margin-top`'unu miras almazlar.

Payı sağlayacak mekanizmaya siz karar verin, ama şu iki şartı tutsun: (a) sayfa
görevlerinin her bölümde elle tekrar etmesi gerekmesin, (b) ana sayfanın 70px'i
bozulmasın. Neden iki farklı pay olduğu tasarımda açıklanmıyor; sabit üst barın
yüksekliği iki bağlamda farklı olabilir, **ölçün** ve bulduğunuzu raporlayın. Eğer
ölçüm iki payın da aynı bara denk geldiğini gösteriyorsa, bu açıklanamayan
çeşitliliktir ve kural çoğunluğa normalize etmektir; gerekçesini yazın.

## Dokunmayacağınız dosyalar

Ağaçta paralel ajanlar var.

- `styles/tokens.css`, `components/ui/Buton.*`, `CamPanel.*`, `BolumBasligi.*`: bir
  ön geçiş görevi bunları tutuyor. **Token eklemeyin.** Bu turun yeni token'a
  ihtiyacı olmaması bekleniyor (menü şeridinin bütün değerlerinin karşılığı var:
  `--panel-koyu`, `--cizgi-soluk`, `--krem-68`, `--iz-sayfa-baslik`). Gerçekten
  eksik bir değer bulursanız ham yazmayın, **raporlayın**.
- `components/sayfa/ana/`, `components/sayfa/AnaSayfa.tsx`, `components/sayfa/PaketSeridi.*`:
  Task 10'a ait.
- `components/saat/SaatTablosu.*`: Task 10'a ait.

## Kısıtlar ve kapılar

- **Asla `git add -A`.** Yalnız kendi dosyalarınızı yol vererek stage edin.
- `app/**/page.tsx` dosyalarına dokunmayın.
- Metinler sözlükten gelir, JSX'te sabit metin yok. Anahtar eksikse uydurmayın,
  raporlayın.
- `npm run typecheck`, `npm test` (51 test), `npm run build` temiz.
- Kendi playwright örneğinizi kendi portunuzda başlatın. Ana sayfa şu an dört bölüm
  dolu: kabuğun ana sayfa varyantının **bozulmadığını** orada ölçün. Menü, Hikaye ve
  Konum sayfaları henüz boş; kabuk varyantlarını o boş rotalarda ölçebilirsiniz.
- Erişilebilirlik: `UstBar`'ın üç varyantı da ayrı landmark adı taşımalı mı, yoksa
  tek `Ana gezinme` yeterli mi, karar verin (`ortak.erisim` anahtarları hazır).
  44px dokunma hedefi kuralı menü şeridinin butonlarında da geçerli.

## Rapor

`.superpowers/sdd/2026-08-11-web-uygulama-plani/kabuk-turu-report.md`. İçinde:
varyant başına ölçülen ve tasarımdaki değerlerin tablosu, 96px/70px ayrımı için
bulduğunuz gerçek sebep, `UstBar` ve `AltBilgi`'nin yeni imzaları (sayfa görevleri
bunu okuyacak), ve tasarımda karar değil gözden kaçmış gibi duran her şey.
