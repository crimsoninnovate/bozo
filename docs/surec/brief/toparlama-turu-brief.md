# Toparlama turu

On görev boyunca, "bu benim dosyam değil" kuralı doğru çalıştı: ajanlar paylaşılan
dosyalara dokunmak yerine ölçtü ve raporladı. Bu tur o birikmiş ölçümleri uygular.
Yeni bir şey keşfetmek değil, kanıtı zaten toplanmış olanı yerine koymak.

Her maddenin kanıtı `docs/surec/rapor/` altındaki raporlarda. **Uygulamadan önce o
ölçümü kendiniz doğrulayın**; bir madde ölçümle çelişiyorsa uygulamayın, raporlayın.

## 0. Önce bunu okuyun: iki ajanı yanıltan ölçüm hatası

Kontrast ölçerken **`fullPage` ekran yakalaması kullanmayın.** Kor sahnesi
`position: fixed`; `fullPage` yakalama sabit katmanı belge boyuna gerer ve metnin
arkasına gerçekte hiç gelmeyen bir parıltı bindirir. Bu hata iki ayrı raporda
toplam **dört sahte "AA FAIL"** üretti (menü sayfasında üç, konum sayfasında üç;
konumunki kendi ajanı tarafından yakalandı).

Doğru yöntem, koordinatörün kullandığı ve sonuçlarını aşağıda verdiği yöntem:
hedefi `scrollIntoView({block:'center'})` ile viewport ortasına getir, metnin
rengini geçici olarak `transparent` yap, **yalnız o kutunun** viewport
yakalamasını al, piksel ortalamasını zemin kabul et, metnin kendi rengini alfasıyla
o zemine bindir, sonra oranı hesapla.

**Sitenin bugünkü durumu, ölçüldü:** beş sayfa (`/`, `/menu/`, `/hikaye/`,
`/konum/`, `/gizlilik/`) x iki genişlik (390x844, 1440x900), `main` içindeki
toplam **198 metin**. **Gerçek hata: sıfır.** Tek eşik altı sonuç gece bölümünün
arka planındaki hayalet saat (alfa `.055`, 1.11:1) ve o dekoratif, `aria-hidden`,
`CanliSaat` onu bilerek gizliyor.

Yani bu turda **hiçbir metnin opaklığını yükseltmek için sebep yok.** Bir ölçüm
size aksini söylüyorsa önce yönteminizi sorgulayın.

## 1. `Buton`: ikonlu dolgu adımı

Task 10 ölçtü ve rampa **çelişkisiz**: tasarımdaki iki ikonlu butonun ikisi de yatay
dolgusunu tam **3px** kısaltıyor, dikeyi koruyor.

| Yer | İkonsuz | İkonlu |
|---|---|---|
| `Ana:346` / `Ana:347` | `17px 29px` | `17px 26px` |
| `Konum:80` / `Konum:81` | `18px 31px` | `18px 28px` |

Sebebi anlaşılır: ikon 15px + `gap:9px` ekleniyor, yatay dolgu onu karşılamak için
kısalıyor. `Buton.module.css` bu adımı taşımıyor.

Ekleyin. Etkilenen çağrı yerleri: paket şeridinin WhatsApp butonu ve Konum hero'sunun
hayalet butonu. **Ölçün**: tasarımın beş dosyasındaki bütün ikonlu butonları çıkarıp
3px kuralının istisnası olup olmadığına bakın. İstisna varsa uygulamayın, raporlayın.

Not: ön geçiş **gölge ve kenarlık** rampalarını ölçüp reddetmişti (`on-gecis-report.md`),
o karar duruyor. Bu ondan ayrı bir eksen; ikisini karıştırmayın.

## 2. `GizlilikSayfasi` gövde metni: `.86` geri `.78` olmalı mı

Task 14 gövde metnini krem `.86`'ya çıkardı çünkü parlak kor sahnesinde tasarımın
`.78`'i 4.34:1 ile AA'yı geçmiyordu. Ölçümü doğruydu ama sebep başka katmandaydı:
`4f8b085` ile iç sayfalar artık kendi sönük sahnesini alıyor (kor `.55`, çekirdek `.26`).

**Yeniden ölçün.** `.78` şimdi geçiyorsa tasarımın değerine dönün ve
`IYILESTIRMELER.md`'deki kaydı kapatın. Hâlâ geçmiyorsa `.86`'da bırakın ve yeni
ölçümü kaydedin. Ölçüm sahnenin en parlak noktasında yapılmalı, sayfanın ortasında
değil; Task 14 raporu yöntemi yazıyor.

Aynı soruyu `HataSayfasi` için de sorun: o `.80`'de kaldı ve dikey ortalı olduğu için
sahnenin bandına hiç girmiyordu, ama sahne değişti.

## 3. (mobil turuna taşındı)

`ImlecKoru`'nun bağlanması `mobil-turu-brief.md` madde 3'te. Sebep: `components/ember/`
dosyalarının tamamı o turun elinde.

<!--

Task 5'te yazıldı, hiçbir sayfa render etmiyor. Tasarımda o katman kor sahnesinin
**içinde** ve yalnız ana sayfada (`Ana Sayfa Alternatif.dc.html:31`, `data-imlec`:
`left:50%;top:62%;620x620;margin:-310px 0 0 -310px;border-radius:50%;
background:radial-gradient(closest-side,rgba(250,170,31,.16),transparent 74%);
transition:transform .7s cubic-bezier(.2,.7,.2,1)`).

`KorSahnesi`'nin `ana` varyantına bağlayın. Ölçülecekler: sahne kabının içinde mi
dışında mı duruyor (bileşenin kendi `.kap`'ı var), z-index sırası, ve `overflow:hidden`
kabın ışığı kırpıp kırpmadığı. Hareket azaltılmışta dinleyici zaten bağlanmıyor, o
davranışı bozmayın.

-->

## 4. (mobil turuna taşındı)

Token işi `styles/tokens.css`'e dokunuyor ve o dosya mobil turunun elinde (mobil
ölçüler için token gerekecek). Sizin işiniz değil.

<!--

İki dosyada ham yazılı: `components/ui/MenuSatiri.module.css:31-33` ve Task 12'nin
`Usul.module.css`'i. Kural "birden çok yerde geçen değer token olur" diyor, iki
kullanım eşiği geçiyor. Token'ı ekleyin ve iki çağrı yerini taşıyın.

Aynı taramayı yaparken `clamp(28px,3vw,40px)`, `0.18s ease-out` ve `rgba(10,8,7,.5)`
değerlerine de bakın: Task 10 bunları ham yazıp gerekçelendirdi (o sırada
`tokens.css` kilitliydi). Beş tasarım dosyasında kaç kez geçtiklerini sayın; eşiği
geçen token olur, geçmeyen kaynak yorumuyla ham kalır.

-->

## 5. `IYILESTIRMELER.md` birikmiş kayıtlar

Dosya paylaşılan olduğu için üç ajan sırayla ona dokunmadı ve kayıtlar raporlarda
kaldı. Şimdi tek elde işlenecek. En az şunlar var, raporları tarayıp tamamlayın:

- Ön geçiş: buton gölge ve kenarlık sapmaları, 16px tabanının üç katmanlı kararı
- Task 9: kaydırma ipucunun 780px altında basılmaması
- Task 10: paket WhatsApp butonu `17/29` vs `17/26`, Konum birincil butonu
  `0 12px 34px .4` vs `0 10px 30px .34`, `SaatTablosu`'nun Ana Sayfa değerlerine
  çekilmesi
- Task 12: `EtiketSatiri`'nın iki ölçekle korunması
- Task 14: gizlilik gövde metni `.86` (madde 2'nin sonucuna göre güncellenecek)
- Kabuk turu: Konum'un Sayfalar listesinin üçe tamamlanması
- Kor sahnesi varyantı (`4f8b085`)

Her kayıt "nerede / ne / neden" taşısın; dosyanın mevcut tablo biçimini izleyin.

## 6. Favicon yok

Task 14 ölçtü: her sayfada konsola favicon 404'ü düşüyor. `app/` altında ikon dosyası
yok. Marka paketinde bir işaret var mı (`design_handoff_bozo_website/marka/`), bakın.
Yoksa **uydurmayın**: eksik varlık olarak raporlayın, işletmeden beklenenler listesine
girsin (`DEVAM.md`). Geçici bir emoji veya jenerik ikon koymayın.

## 7. `/_not-found/` yinelenen rota

Task 14 ölçtü: statik export `out/404.html` yanında `out/_not-found/index.html` de
üretiyor, yani `/_not-found/` adresi 200 ile 404 sayfasını sunuyor. Next'in kendi
çıktısı. `node_modules/next/dist/docs/` altında bunun beklenen davranış olup olmadığına
bakın; beklenense dokümante edin, değilse çözün. Sitemap'e sızmadığını doğrulayın.

## 8. (mobil turuna taşındı)

Mobil kor sahnesi `mobil-turu-brief.md` madde 1'de.

<!--

> **Bu maddenin gerekçesi düzeltildi.** İlk hali Task 11'in "390px'te AA hatası var"
> ölçümüne dayanıyordu. **O ölçüm yanlıştı** ve madde 0'daki yöntem hatasından
> geliyordu. Koordinatör beş sayfayı iki genişlikte yeniden ölçtü: menü sayfasında
> "liste tamamlanacak" **5.88:1** (3.80 değil), QR notu **6.61:1** (4.51 değil).
> Sitede AA hatası yok. Yani bu madde bir erişilebilirlik acili değil, **sadakat
> eksiği**. Öncelik sırasını buna göre kurun; metin opaklıklarına dokunmak için
> hiçbir sebep kalmadı.

Tasarımın mobil prototipinde sahnenin kendi ölçüleri var ve masaüstünden farklılar.
Uygulama bunları hiç taşımıyor: mobilde masaüstü değerleri basılıyor.

Tasarımın mobil prototipinde sahnenin **kendi ölçüleri** var
(`Mobil Prototip.dc.html:30-35`), ve masaüstünden farklılar:

| Katman | Masaüstü (ana) | Mobil prototip |
|---|---|---|
| kap | `height:100vh` | `height:844px` |
| kor | bottom -14%, height 96%, `72% 96%` | bottom **-12%**, height **92%**, **`78% 92%`** |
| çekirdek | `min(780px,110%)` x **520px** | **`420px` x `340px`**, `margin-left:-210px` |
| çekirdek alfa | `.42` | `.4` |
| duman | 3 puf (260/220/200) | **2 puf (170/150)**, 20s ve 26s |
| vinyet | inset **260px** | inset **170px** |

Belirleyici olan çekirdeğin **yüksekliği**: 520px yerine 340px. 844px'lik bir
ekranda 520px'lik bir çekirdek gövde metninin okunduğu bandı kaplıyor.

**Uygulayın**, ama sınırını bilerek: mobil prototip **ana sayfanın** mobil hali. İç
sayfaların mobil sahnesi için tasarımda karşılık **yok**. İki varyanta da mobil adım
eklemek gerekiyorsa iç sayfanınki çıkarım olur; çıkarımı `IYILESTIRMELER.md`'ye
gerekçesiyle yazın ve ölçün. Ölçüt: 390px'te üç metnin de AA'yı geçmesi, **metnin
opaklığını yükseltmeden**.

Kırılma noktasını uydurmayın; prototipin genişliğinden (390px) ve sayfaların
`flex-wrap` eşiklerinden türetin, gerekçesini yazın.

-->

## 9. Gece şeridi açıkken çapa payı yetmiyor

Task 11 ölçtü: `GeceSeridi` görünürken üst bar 107px oluyor ve 96px'lik çapa payı
`#ocaktan` başlığının üst **11px**'ini örtüyor. Tasarımda da aynı: kendi script'i de
sabit 96 kullanıyor, yani şeridi hesaba katmıyor. Bu bir tasarım gözden kaçması.

Pay barın gerçek yüksekliğinden türetilmeli. `GeceSeridi` yalnız 01:00-05:00 arası
basılıyor, yani sorun günün beş saatinde var ve gündüz yapılan hiçbir incelemede
görünmüyor. Çözüm `lib/kabuk.ts` / `Kabuk.module.css` katmanında; sayfalara
dokunmadan çözün.

## 10. `KISITLAR.md`'nin 16px kuralı iki metni kapsamıyor

Task 11: gece menüsü gövdesi ve yapay zeka görsel notu `13px/1.6`, gerçek paragraf.
2. katmanın "arayüz mikro metni" tanımına girmiyor, 3. katmanın 14.5-15.5px bandının
da altında. Kuralı yazan ön geçiş bu iki metni görmemişti.

Kuralı tamamlayın: ya üçüncü katmanın bandı genişler ve bu iki metin adıyla anılır,
ya da dördüncü bir durum tanımlanır. **Metinleri büyütmeyin**; kural eksik, tasarım
değil. Yeni hâli hangi metni hangi katmana koyduğunu tek tek saysın.

## 11. `Buton`'un iki değerinin kaynağı yok (F6)

`border-radius: 2px` (`Buton.module.css:8`): beş tasarım dosyasındaki hiçbir buton
`border-radius` bildirmiyor, tarandı. `IYILESTIRMELER.md` 21 ve 32. satırları
`Cip`'in 2px'ini tam bu kanıt standardıyla kaldırmış. Marka zarfı 0-3px olduğu için
görsel etkisi küçük ama gerekçesiz: ya kaldırın ya kaydedin.

`letter-spacing: -0.005em` (`Buton.module.css:11`): handoff'ta hiçbir Inter buton
dizisinde `letter-spacing` yok. Uydurulmuş değer.

Madde 1 ile aynı dosyaya dokunuyor, birlikte yapın.

## 12. Konum hero butonları hiçbir `boy` adımına oturmuyor (F5)

Tasarım birincil `19px 32px`, hayalet `18px 28px` (`Konum:80-81`). `boy="lg"`
`18px 30px` ve `cerceveli.lg` `17px 29px` basıyor. İki ajan bunu ayrı ayrı ölçtü ve
ikisi de kendi dosyası olmadığı için dokunmadı.

Karar sizin: yeni bir boy adımı mı, kayıtlı sapma mı. Yeni adım üç sayfayı ilgilendirir,
o yüzden **ölçün**: beş dosyadaki bütün buton dolguları çıkarılsın, `19/32` ve `18/28`
tek örnek mi yoksa bir aile mi. Tek örnekse sapma olarak kaydetmek daha ucuz.

## 13. Mobil üst barın alt saç çizgisi düşmüş (F7)

`Mobil Prototip.dc.html:55` bara `border-bottom:1px solid rgba(242,233,220,.09)`
veriyor. `UstBar.module.css:156-160` (`max-width: 780px`) yüksekliği ve dolguyu
alıyor, kenarlığı almıyor. Aynı `.09` değeri üç footer'ın telif şeridinde de ham
duruyor; token'ı yoksa **eklemeyin**, `styles/tokens.css` mobil turunun elinde.
Ham yazıp raporlayın, o tur token'a çevirir.

## 14. Çekmece noktası tasarımda yanıp sönmüyor (F8)

`Mobil Prototip.dc.html:209` noktayı `animation` olmadan çiziyor.
`Cekmece.module.css:92` `dotPulse 2.4s` ekliyor. `IYILESTIRMELER.md` 56. satırdaki
kayıtlı karar noktanın **kapalıyken sönmesi** hakkında, nabız eklemek hakkında
değil. Ya kaldırın ya kaydedin.

## 15. İki eskimiş yorum, bir yanlış gerekçe (F10 + ek)

- `components/sayfa/konum/Harita.module.css:15` Ana Sayfa pinini `0 0 0 6px + 32px`
  diye yazıyor; `Ana:328` `0 0 30px`. `HaritaPlakasi.module.css:12` aynı satırı
  doğru yazıyor, iki dosya çelişiyor. Kod doğru, yorum yanlış.
- Aynı dosyanın 12. satırındaki tablo satırı bozuk, okunmuyor.
- `IYILESTIRMELER.md` 49. satır `DilAnahtari` pasif rengi için "`.5` hiçbir kaynakta
  yok" diyor; `Menu Sayfasi.dc.html:56` ve betiği `.5` kullanıyor. Seçilen `.58`
  dörtte üç çoğunluk olduğu için **sonuç savunulabilir**, yalnız gerekçe yanlış.
  Gerekçeyi düzeltin, kararı değiştirmeyin.

Bu üçünü düzeltirken `CLAUDE.md`'nin yeni "Comments" kuralına uyun: yorumları
uzatmayın, kısaltın.

## 16. Footer İngilizce sayfalarda Türkçe cadde adını basıyor (B1) — EN CİDDİ MADDE

Beş İngilizce rotanın hepsinde. `AltBilgiTam.tsx:41` ve `AltBilgiSayfalar.tsx:33`
dil-nötr `isletme.cadde`'yi okuyor; sözlükteki `ortak.satirlar.adresCadde`
(EN: `Naci Talat Street`) **sıfır çağıranlı** duruyor. Kanıt:
`out/en/hikaye/index.html` içinde "Naci Talat Street" 0 kez, "Naci Talat Caddesi"
4 kez.

Bu, "yetim sanılan sözlük anahtarı aslında eksik bir bağlantıydı" kalıbının
**üçüncü** örneği (önceki ikisi: `footer.sayfalarBaslik` ve `satirlar.adresVeSaat`).
Düzeltirken aynı kalıbı tarayın: `content/tr/` ve `content/en/` altındaki her
anahtarın gerçek bir çağıranı var mı. Çağıransız kalan her anahtarı raporlayın;
uydurma bir kullanım yaratmayın.

`isletme.cadde` dil-nötr kalmalı (yapısal veri ve harita bağlantıları onu kullanıyor);
görünen metin sözlükten gelir. İkisini karıştırmayın.

## 17. `HataSayfasi` etiket satırının üçüncü kopyasını taşıyor (B2)

`EtiketSatiri`'nin `sayfa` ölçeğiyle birebir aynı (11x11 tangerine kare,
`500 15px/1`, krem `.74`, gap 12px). Kronoloji: 404 sayfası `843524e` ile geldi,
primitif ondan sonra `d94570f` ile yazıldı ve o tur yalnız ana sayfanın kopyasını
ortaklaştırdı.

Primitife bağlayın. **Ölçün**: bağladıktan sonra 404 sayfasının görünümü değişmemeli.

## 18. On yerde token varken ham `rgba()` yazılmış (B5)

Kabuk, saat ve kor modülleri. En keskini `--panel-60`: token'ın kendi yorumu üç rolü
sayıyor, üçünden ikisi (`DurumCipi.module.css:18`, `UstBar.module.css:152`) token'ı
atlıyor. Sebep kronolojik: token turu 48. commit, o modüller 24-31. commit ve çağrı
yerleri hiç taşınmadı.

`capraz-inceleme.md` on yerin listesini veriyor. **Değeri değiştirmeyin**, yalnız
token'a bağlayın; her biri için hesaplanmış stilin aynı kaldığını doğrulayın.

`styles/tokens.css`'e **dokunmayın** (mobil turunun elinde); yeni token gerekiyorsa
raporlayın.

## 19. `GizlilikSayfasi.module.css:103`'teki gerekçe bayat

Yorum, krem `.86` sapmasını "iç sayfalarda kor tam şiddette yanıyor" diye açıklıyor.
`4f8b085` bunu değiştirdi. Madde 2'yi çözerken bu yorumu da düzeltin; sapma kalırsa
gerekçesi yeni ölçüme dayansın, kalkarsa yorum da kalksın.

## Kısıtlar

- **Asla `git add -A`.**
- Commit'te asistan imzası yok (`Co-Authored-By`, `Claude-Session`, dipnot).
- Sayfa bileşenlerinin **içeriğini** değiştirmeyin; bu tur paylaşılan katmanı toparlar.
  Bir sayfa değişikliği gerekiyorsa (madde 2 gibi) yalnız o değeri değiştirin.
- Her madde için "uyguladım / uygulamadım + neden" raporlanır. Ölçümle çelişen
  maddeyi uygulamamak doğru davranıştır.

## Kapılar

`npm run typecheck`, `npm test`, `npm run build` temiz. Tarayıcıda: ana sayfa ve dört
iç sayfa 1440px ve 390px, `Buton` değişikliğinin bozmadığı doğrulanır (on birincil ve
altı ikincil buton ölçülüdür, `on-gecis-report.md`'de tablosu var).

Rapor: `docs/surec/rapor/toparlama-turu-report.md`.
