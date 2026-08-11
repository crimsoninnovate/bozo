# Mobil turu

Kabuk bileşenleri (üst bar, çekmece, mobil eylem barı, alt bilgi) mobil
prototipten değer aldı. **İçerik bileşenlerinin hiçbiri almadı.** 390px'te site
masaüstü `clamp()` değerlerinin alt ucunu basıyor, tasarımın mobil ölçülerini değil.

Kaynak: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/Mobil Prototip.dc.html`.
Bulgular: `docs/surec/rapor/bagimsiz-sadakat-denetimi.md` F3 ve F9.

Bu dosya beş tasarım dosyasının **en az bakılanı** ve bu gece ondan üç ayrı eksik
çıktı. Değer okurken kaynaktan teyit edin, aşağıdaki tablolar türetilmiş.

## 1. Kor sahnesinin mobil ölçüsü

`Mobil Prototip.dc.html:30-35`. Uygulama mobilde masaüstü değerlerini basıyor.

| Katman | Masaüstü (ana) | Mobil |
|---|---|---|
| kap | `height:100vh` | `height:844px` |
| kor | -14%, 96%, `72% 96%` | **-12%, 92%, `78% 92%`** |
| çekirdek | `min(780px,110%)` x **520px** | **`420px` x `340px`**, `margin-left:-210px` |
| çekirdek alfa | `.42` | `.4` |
| duman | 3 puf (260/220/200), 22/27/32s | **2 puf (170/150), 20s ve 26s** |
| vinyet | inset **260px** | inset **170px** |

Belirleyici olan çekirdeğin yüksekliği: 520px yerine 340px.

**Sınırı bilin:** mobil prototip **ana sayfanın** mobil hali. İç sayfaların mobil
sahnesi için tasarımda karşılık yok. İki varyanta da mobil adım gerekiyorsa iç
sayfanınki çıkarım olur; çıkarımı `IYILESTIRMELER.md`'ye gerekçesiyle yazın.

Kırılma noktasını uydurmayın: prototipin genişliğinden (390px) ve kabuk
bileşenlerinin zaten kullandığı eşikten (`UstBar.module.css` `max-width: 780px`)
türetin, gerekçesini yazın.

**Not:** bu maddenin ilk gerekçesi "390px'te AA hatası var" idi ve **o ölçüm
yanlıştı**. Koordinatör beş sayfayı iki genişlikte yeniden ölçtü: 198 metin, sıfır
hata. Bu bir sadakat eksiği, erişilebilirlik acili değil. **Hiçbir metnin opaklığını
yükseltmeyin.**

## 2. İçerik tipografisinin mobil ölçüleri

| Öğe | Mobil prototip | Portun bugün 390px'te bastığı |
|---|---|---|
| Hero H1 (`Mobil:77`) | `800 52px/.92`, `-.05em` | `clamp(60px,10.4vw,168px)` → 60px, `/1.06`, `-.018em` |
| Hero alt satır (`Mobil:79`) | `800 26px/1`, `-.04em` | → 34px, `-.025em` |
| Hero tane rayı (`Mobil:80-88`) | büyük 13 / küçük 8 / gap 7; çizgi `2px`, `-1px`, durak `50%`; `padding:10px 0` | 20 / 12 / gap 12; çizgi `3px`, `-1.5px`, durak `54%`; `padding:16px 0` |
| Sayaç hücreleri (`Mobil:101-103`) | `700 30px/1`, `-.04em`; etiket `400 11.5px/1.35` `.72`; `padding:16px 14px`; zemin `rgba(10,8,7,.86)` | → 44px, `-.02em`; etiket `400 14px/1.45` `.74`; `22px 24px`; zemin `.9` |
| Gece H2 (`Mobil:157`) | `800 40px/1.02`, `-.045em` | → 44px, `/1.08`, `-.03em` |
| Vardiya çipleri (`Mobil:160-163`) | **4 çip** (21/23/01/03), `8px 12px`, `12.5px`, `.66`, zeminsiz | 6 çip, `9px 15px`, `13.5px`, zemin `rgba(10,8,7,.5)` |
| Sofra H2 (`Mobil:148`) | `700 34px/1.06`, `-.04em` | → 34px, `/1.1`, `-.025em` |
| Konum mini haritası (`Mobil:169-174`) | `height:180px`; ızgara `40px`; yol `top:56%` `11px`; halka `60px` `margin:-30px`; pin `14px`, `0 0 0 5px`, `0 0 24px` | karşılığı yok |
| Durum çipi (`Mobil:73`) | `9px 14px`, kenarlık `.32`, metin `13px` | `9px 15px`, `.3`, `13.5px` |

**Vardiya çipleri özel dikkat ister:** mobilde altı değil **dört** çip var. Bu bir
ölçü değil içerik farkı; `VardiyaSeridi` altı saati sabit dizide tutuyor. Tasarımın
hangi dördü seçtiğini kaynaktan doğrulayın ve bunun bilinçli bir mobil kısaltma mı
yoksa prototipin eksik çizimi mi olduğuna karar verip **raporlayın**. Emin
değilseniz uygulamayın, sorun.

`Mobil:392` menü listesinin mobilde kart değil **satır** olmasını açık bir tasarım
kararı olarak yazıyor; o da uygulanmamış. Kapsamınızda, ama önce ölçün: menü
sayfası şu an 390px'te ne basıyor.

## 3. `ImlecKoru` hiçbir yere bağlı değil

Task 5'te yazıldı, hiçbir sayfa render etmiyor, yani `out/` ölü CSS taşıyor.
Tasarımda katman kor sahnesinin **içinde** ve yalnız ana sayfada
(`Ana Sayfa Alternatif.dc.html:31`): `left:50%; top:62%; 620x620;
margin:-310px 0 0 -310px; border-radius:50%;
background:radial-gradient(closest-side,rgba(250,170,31,.16),transparent 74%);
transition:transform .7s cubic-bezier(.2,.7,.2,1)`.

`KorSahnesi`'nin `ana` varyantına bağlayın. Ölçülecek: sahne kabının içinde mi
dışında mı (bileşenin kendi `.kap`'ı var), z-index sırası, `overflow:hidden`
ışığı kırpıyor mu. Mobilde fare yok: prototipte bu katman **yok**, mobil varyantta
basmayın. Hareket azaltılmışta dinleyici zaten bağlanmıyor, o davranışı bozmayın.

## Sizin dosyalarınız

`components/ember/`, `components/sayfa/` altındaki içerik bileşenleri, ve
**`styles/tokens.css`** (mobil ölçüler için token gerekecek).

## Dokunmayacağınız dosyalar

Paralel bir toparlama turu çalışıyor: `components/ui/Buton.*`,
`components/layout/*`, `components/saat/*`, `docs/surec/IYILESTIRMELER.md`,
`docs/surec/KISITLAR.md`, `app/`, `components/sayfa/GizlilikSayfasi.*`,
`components/sayfa/HataSayfasi.*`, `components/sayfa/konum/Harita.module.css`.

Yani `components/sayfa/` altında **iki dosya sizin değil**: `GizlilikSayfasi` ve
`HataSayfasi`. Geri kalan içerik bileşenleri sizin.

`IYILESTIRMELER.md`'ye yazmanız gereken kayıtları **raporunuzda toplayın**, dosyaya
siz yazmayın; toparlama turu işleyecek.

## Kısıtlar

- **Asla `git add -A`.** Commit'te asistan imzası yok.
- **Yorum kısa.** `CLAUDE.md`'nin yeni "Comments" bölümünü okuyun: yorum yalnız
  kaynak atfı, ölçüm veya bağlamsız yanlış görünen bir kararı kaydeder. Paragraf yok.
- Ad hoc breakpoint uydurmayın; mevcut eşiği kullanın veya gerekçelendirin.
- Masaüstü görünümünü bozmayın: her değişiklikten sonra 1440px'i de ölçün.

## Kapılar

`npm run typecheck`, `npm test`, `npm run build` temiz. Tarayıcıda beş sayfa
390x844 **ve** 1440x900. Kendi playwright örneğiniz, kendi portunuz; MCP tarayıcısı
paylaşılan ve bu gece üç ajanın ölçümüne karıştı.

Kontrast ölçerken **`fullPage` yakalama kullanmayın**: kor sahnesi `position:fixed`,
`fullPage` onu belge boyuna gerer ve sahte sonuç verir. Bu hata bu gece iki raporda
dört sahte "AA FAIL" üretti. Doğru yöntem: hedefi viewport ortasına kaydır, metnin
rengini geçici `transparent` yap, yalnız o kutunun viewport yakalamasını al.

Rapor: `docs/surec/rapor/mobil-turu-report.md`.
