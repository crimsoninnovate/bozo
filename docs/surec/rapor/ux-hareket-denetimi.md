# Ana sayfa UX, arayüz ve hareket denetimi

12 Ağustos 2026. Ölçüm ortamı: `next dev`, 1440x980 ve 1280x720 masaüstü, 390x844 mobil.
Kaynak otoritesi `Ana Sayfa Alternatif.dc.html` ve `docs/surec/KISITLAR.md`.

## Özet

| Alan | Not |
|---|---|
| Görsel hiyerarşi | B+ |
| Tipografi | A |
| Renk ve kontrast | A- |
| Boşluk ve yerleşim | B- |
| Etkileşim durumları | B |
| Duyarlılık | A- |
| Hareket | A |
| Metin | A |
| Yapay zeka klişesi | A (on bir kalıbın hiçbiri yok) |

Toplam: B+. Ana sayfa tasarım olarak sağlam duruyor. Bulguların ikisi tasarım
dosyasından birebir geliyor, yani port hatası değil, tasarımın kendi davranışı.
KISITLAR.md'nin kuralı gereği sessizce düzeltilmediler; sahibine sunuldu ve
onaydan sonra uygulandı.

## Durum

| Bulgu | Etki | Karar | İşlem |
|---|---|---|---|
| F1 üst bar çakışması | yüksek | uygulandı | `39e88f3`, `bf263b6` |
| F2 bölüm doluluğu ve ritim | orta | uygulandı | `c9b6a26` |
| F3 Ocaktan isim sütunu | orta | uygulandı | `ebcf42a` |
| F4 `transition: all` | düşük | uygulandı | `a4271b7` |
| F5 telefon yer tutucusu | bilgi | açık, veri bekliyor | numara geldiğinde ölçülecek |

Uygulama sonrası ölçüm: her iki dilde bölüm aralıkları 213 (hero) ve beş kez
240px, `transition: all` sayısı 0, 390px'te yatay taşma yok, AA eşiğinin altında
kalan tek öğe F5. 76/76 test geçiyor, statik dışa aktarım 24 rotayla temiz.

## İlk izlenim

Sayfa "burası gerçek bir ocak" diyor. Göz sırayla şuraya gidiyor: 133px'lik
"Tavla zarı ciğer", sağ üstteki tane ızgarası, sonra canlı saat ve "Şu an açığız"
çipi. Üçü de tasarımcının istediği üç şey. Hiyerarşi yalan söylemiyor.

Tek kelimeyle: sıcak.

## F1: Sabit üst bar kaydırma sırasında altındaki içerikle çakışıyor

Etki: yüksek. Kaynak: tasarımın kendi eksiği.

Masaüstü barın zemini `linear-gradient(to bottom, rgba(10,8,7,.9), rgba(10,8,7,0))`.
Marka adı barın dikey ortasında duruyor, yani gradyanın yaklaşık yarı saydam
olduğu yerde. Altından geçen her içerik marka adının ve nav bağlantılarının
içinden görünüyor.

Ölçülen kanıt: `scrollY 6351`'de "Ciğerci Bozo" ile Konum bölümünün "Soli Bet
Casino, yanımızda" çipi üst üste biniyor, ikisi de okunmuyor.

İki şey bunun bir karar değil eksik iş olduğunu söylüyor:

1. Tasarım barda `transition: background .3s ease-out` tanımlıyor, ama `support.js`
   içinde bu zemini değiştiren hiçbir kod yok. Kaydırma durumu düşünülmüş,
   bağlanmamış.
2. 780px altında tasarım sorunu zaten çözüyor: `rgba(10,8,7,.94)` üstten
   `--panel-60` alta, üstüne `backdrop-filter: blur(10px)`. Mobilde çözülen şey
   masaüstünde açık kalmış.

Öneri: masaüstü varyantına da `backdrop-filter: blur(10px)` vermek, ya da
gradyanın alt durağını sıfırdan yukarı çekmek. İkincisi tasarıma daha yakın,
birincisi daha temiz durur.

## F2: Bölümler ekranın yarısı kadar dolu, dikey ritim düzensiz

Etki: orta. Kaynak: tasarım dosyası (`min-height:100vh`, yedi bölümün hepsinde).

1440x980'de ölçülen doluluk:

| Bölüm | Bölüm yüksekliği | İçerik | Doluluk |
|---|---|---|---|
| acilis | 980 | 674 | %69 |
| iddia | 980 | 529 | %54 |
| ocaktan | 980 | 602 | %61 |
| ikram | 980 | 540 | %55 |
| gece | 980 | 425 | %43 |
| bozo | 980 | 529 | %54 |
| konum | 980 | 549 | %56 |

İçerik dikeyde ortalandığı için (`align-items: center`, tasarımla aynı) boşluk
üstte ve altta eşit paylaşılıyor. Sorun boşluğun kendisi değil, düzensizliği:
1280x720'de ardışık iki bölümün içerikleri arasındaki mesafe sırayla 240, 243,
334, 375, 286 piksel. Bu bir ritim değil, içerik yüksekliğinin rastgele
artığı. Ekran ne kadar uzunsa fark o kadar büyüyor.

En görünür yeri Gece bölümü: 425px içerik, 980px bölüm, 555px boşluk.

Öneri: karar sahibinin. Üç seçenek var, hiçbiri sessizce uygulanmamalı.
`min-height`'ı kaldırıp ritmi yalnız 120px'lik `--bolum-dikey` taşıyabilir;
`min-height` kalıp Gece bölümüne içerik eklenebilir; ya da olduğu gibi
bırakılabilir, çünkü sinema hissi kasıtlı olabilir.

## F3: Ocaktan satırında isim sarıyor, yanındaki 300px boş duruyor

Etki: orta. Kaynak: tasarım dosyası.

İsim sütunu `width: clamp(160px, 20vw, 260px); flex: none`. 1440px'te 260px'e
sabitleniyor. "Terbiyesiz tavuk şiş" bu genişliğe sığmayıp iki satıra iniyor ve
satır yüksekliği 79px'ten 113px'e çıkıyor, listenin alt ucu bozuluyor.

Aynı satırda açıklama sütunu 551px genişliğinde ama en uzun açıklaması yaklaşık
250px kaplıyor. Yani sarmayı zorlayan 260px sınırının hemen sağında 300px
kullanılmayan yer var.

Öneri: isim sütununun üst sınırını yükseltmek (`clamp(160px, 24vw, 300px)`) ya da
`flex: none`u bırakıp sütunun içeriğe göre büyümesine izin vermek. Tasarımdan
sapma olduğu için karar ve gerekçe `iyilestirmeler.md`'ye yazılmalı.

## F4: On üç öğede `transition: all`

Etki: düşük. Kaynak: port.

`VardiyaSeridi` çipleri (6) ve `BeadRay` boncukları (7) `transition: all 0.3s`
kullanıyor. Geri kalan bütün geçişler özelliklerini tek tek sayıyor. `all`
listelenmemiş özellikleri de canlandırır, ileride eklenecek bir `width` ya da
`padding` beklenmedik şekilde animasyonlanır.

Öneri: iki dosyada `all` yerine gerçekten değişen özellikleri yazmak.

## F5: Paket şeridindeki telefon yer tutucusu 2.62:1

Etki: bilgi. Şimdilik ihlal değil.

`000 000 00 00` yer tutucusu `aria-disabled="true"` işaretli bir `<span>`,
`opacity: .55` ile turuncu şerit üstünde kömür rengi. WCAG 1.4.3 etkin olmayan
arayüz bileşenlerini kontrast şartından muaf tutuyor, dolayısıyla bugün geçerli.

Gerçek telefon numarası `content/isletme.ts`'e girdiği anda bu öğe `<a>` olup
etkin hale gelecek ve 4.5:1'i sağlaması gerekecek. Numara geldiğinde bu satır
tekrar ölçülmeli.

## Temiz çıkan, işlem gerekmeyen alanlar

- **Yapay zeka klişesi yok.** On bir kalıbın hiçbiri bulunmadı: mor gradyan yok,
  üç sütunlu ikonlu özellik ızgarası yok, her şey ortalanmamış, köşe yarıçapı
  0-3px, gerçek bir yazı karakteri seçilmiş, dekoratif blob yok, emoji yok.
- **Dokunma hedefleri.** Kutu ölçüsü 44px altında görünen on üç bağlantının
  hepsi `::before` ya da `::after` ile negatif `inset` kullanarak isabet alanını
  44px'e taşıyor. `BeadRay` boncukları `aria-hidden="true"` ve `tabindex="-1"`,
  yani klavyeyle erişilemiyor; ekran okuyucudan gizli ama odaklanabilir bir öğe
  bırakılmamış.
- **Hareket.** Ortam animasyonları yalnız `opacity` ve `transform` üzerinde,
  2.4s ile 32s arasında, dekoratif katmanların hepsi `aria-hidden`. Bölüm
  belirme geçişi 0.5s `ease-out`, yerleşim özelliği canlandırılmıyor.
- **Kontrast.** Görünen bütün metin tarandı; AA eşiğinin altında kalan tek öğe
  F5'teki etkin olmayan yer tutucu.
- **Yazı karakteri sayısı.** Tam iki aile: Bricolage Grotesque ve Inter.
  Ölçümde görünen `Times New Roman` yalnız `<html>` öğesinin hesaplanan değeri
  (metin taşımıyor), `__nextjs-Geist` ise geliştirme katmanının kendi arayüzü.
- **390px'te yatay taşma yok.** `scrollWidth` ile `clientWidth` eşit.

## Fotoğraflar gelmeden kapanmayacak olan

Üç `FotoYuvasi` yer tutucusu ana sayfada toplam 1400 pikselden fazla dikey alan
tutuyor. Sayfanın görsel dengesi hakkında son yargı, gerçek fotoğraflar
yerleşmeden verilemez. F2'deki doluluk oranları da fotoğraflarla birlikte
değişecek.
