# Toparlama turu

On görev boyunca, "bu benim dosyam değil" kuralı doğru çalıştı: ajanlar paylaşılan
dosyalara dokunmak yerine ölçtü ve raporladı. Bu tur o birikmiş ölçümleri uygular.
Yeni bir şey keşfetmek değil, kanıtı zaten toplanmış olanı yerine koymak.

Her maddenin kanıtı `docs/surec/rapor/` altındaki raporlarda. **Uygulamadan önce o
ölçümü kendiniz doğrulayın**; bir madde ölçümle çelişiyorsa uygulamayın, raporlayın.

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

## 3. `ImlecKoru` hiçbir yere bağlı değil

Task 5'te yazıldı, hiçbir sayfa render etmiyor. Tasarımda o katman kor sahnesinin
**içinde** ve yalnız ana sayfada (`Ana Sayfa Alternatif.dc.html:31`, `data-imlec`:
`left:50%;top:62%;620x620;margin:-310px 0 0 -310px;border-radius:50%;
background:radial-gradient(closest-side,rgba(250,170,31,.16),transparent 74%);
transition:transform .7s cubic-bezier(.2,.7,.2,1)`).

`KorSahnesi`'nin `ana` varyantına bağlayın. Ölçülecekler: sahne kabının içinde mi
dışında mı duruyor (bileşenin kendi `.kap`'ı var), z-index sırası, ve `overflow:hidden`
kabın ışığı kırpıp kırpmadığı. Hareket azaltılmışta dinleyici zaten bağlanmıyor, o
davranışı bozmayın.

## 4. `-0.015em` izi token'a çıkarılmalı

İki dosyada ham yazılı: `components/ui/MenuSatiri.module.css:31-33` ve Task 12'nin
`Usul.module.css`'i. Kural "birden çok yerde geçen değer token olur" diyor, iki
kullanım eşiği geçiyor. Token'ı ekleyin ve iki çağrı yerini taşıyın.

Aynı taramayı yaparken `clamp(28px,3vw,40px)`, `0.18s ease-out` ve `rgba(10,8,7,.5)`
değerlerine de bakın: Task 10 bunları ham yazıp gerekçelendirdi (o sırada
`tokens.css` kilitliydi). Beş tasarım dosyasında kaç kez geçtiklerini sayın; eşiği
geçen token olur, geçmeyen kaynak yorumuyla ham kalır.

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

## 8. Kor sahnesinin mobil ölçüsü yok, ve bu bir AA hatasına yol açıyor

Task 11 ölçtü: menü sayfasında 390px'te `--krem-58` metin **3.80:1** ile AA'yı
geçmiyor ("liste tamamlanacak"), QR notu 4.51 ve içecek notu 4.55 ile sınırda.
Sebep metin değil: çekirdek mobilde kolonun tamamını kaplıyor.

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
