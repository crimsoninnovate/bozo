# İsim çalışması: "Bozo Karışık Full"

Tarih: 9 Kasım 2026. Durum: öneri, karar sahibinin.

## 1. Varsayım ve ürünün ne olduğu

Menü belgesinde "Bozo Karışık Full" diye bir kalem yok. En yakını `bozo-karisik`
(`content/menu.varsayilan.json`, canlı belgede de aynı):

| Alan | Değer |
|---|---|
| Ad | Bozo Karışık / Bozo Mixed (Bozo Karışık) |
| Açıklama | Üç şiş ciğer, üç şiş dalak, üç şiş yürek, bir şiş kuyruk yağı |
| Ölçü | Yalnız porsiyon, 10 şiş (dürümü yok; sahibi 8 Ekim 2026: "listedeki gibi") |
| Fiyat | 700 TL (Ciğer 10 şiş 690 TL, Bozo Special 2 şiş 200 gr haşhaş 900 TL) |
| Foto yuvası | `bozo-karisik`, kare henüz yok |

"Full" sahibinin çalışma adı; iki okuması var ve ikisi için de ayrı ayrı not düştüm:

- **A, yeniden adlandırma:** mevcut 10 şişlik karışık yeni adı alır. Menüde tek karışık kalır.
- **B, büyük kardeş:** Bozo Karışık yerinde durur, yanına daha dolu bir sürüm gelir (daha çok
  şiş ya da tavuk ve kuşbaşı da eklenmiş hali). İçeriği belgede yok, sahibine sorulacak;
  aşağıdaki hiçbir ad içeriğe dair iddia taşımaz, biri hariç (Ocağın Hepsi, bkz. riski).

Bağlayıcı iki kural bu çalışmayı sınırlıyor. Envanter "marka adı ürüne eklenmez, yaratıcı
ürün ismi üretilmez" der; sahibi bunu Bozo Karışık ve Bozo Special ile zaten aşmış, o yüzden
Bozo'lu adlar envanterin değil sahibinin çizgisinin devamı. Kilitli terimler ise doğrudan
geçerli: adet, parça, tabak, masa, mangal, şef yok; şiş, porsiyon, tane, sofra, ocak, kor,
usta var. Yasaklı sıfatlar (efsane, sınırsız, bomba, leziz) hiçbir adayda yok.

Telefon ölçüsü: 390 px'te ürün adı Bevan ile `min(19px, 7.4cqw)` puntoda, sağında tam fiyat
aynı satırda. Bugünkü en uzun ad Terbiyesiz Tavuk Şiş (20 karakter) tek satıra sığıyor; adaylar
20 karakterin altında tutuldu. Panel doğrulayıcısı ad için 60 karakter, uzun tire ve şapkalı
harf yasağı, tamamı büyük harf yasağı uygular.

## 2. Adaylar

İngilizce etiket menüdeki kalıbı izler: İngilizce açıklama, parantezde Türkçe ad.

### Urfa ve ocak kültürü

**1. Ocak Karışık** / Mixed Skewers from the Fire (Ocak Karışık)
Neden: "Ocaktan" menünün ana bölümü, "From the Fire" onun İngilizcesi; ad bölümüyle aynı
kelimeyi taşır. Risk: Bozo adı düşer; ciğerci tabelalarında "ocakbaşı karışık" yaygın, ayırt
ediciliği düşük.

**2. Urfa Karışık** / Urfa Mixed Skewers (Urfa Karışık)
Neden: "Urfa usulü" kilitli ifade, üç sakatat da "Urfa sakatat hattının klasiği" diye
anlatılıyor. Risk: "Adana karışık" kalıbını çağrıştırır, Urfa kebap dükkanlarının genel adı
gibi okunur; turist söyler ama Urfa'yı bilmez.

**3. Sakatat Hattı** / The Offal Line (Sakatat Hattı)
Neden: Dalak ve Yürek açıklamalarındaki ifadenin kendisi, karışığın da tam tarifi (ciğer, dalak,
yürek). Risk: "offal" İngilizce konuşan misafiri uzaklaştırır; "hat" soyut, yemek adı gibi
durmaz; tavuk ya da kuşbaşı eklenirse yanlış olur.

### Evin lakapları ve mizahı

**4. Bozani** / The Full Mix (Bozani)
Neden: Sahibinin kendi cümlesi: "abilerim ve arkadaşlarım bana Bozo, kimi zaman Bozani diye
seslendi" (`hikaye.lakap.kapanis`). Bozo porsiyon, Bozani onun dolusu: ad üründen ve evin
hikayesinden çıkıyor, Terbiyesiz Tavuk Şiş'in mizahıyla aynı damar. Hikaye sayfası kelimeyi
zaten açıklıyor. Risk: menüde tek başına anlaşılmaz, parantezli İngilizce ve kısa açıklama
şart; B okumasında Bozo Karışık ile aynı satır ailesinde durduğu ilk bakışta görülmez.

**5. Muzip Karışık** / The Mischievous Mix (Muzip Karışık)
Neden: "Sarışın, muzip, yerinde duramayan çocuğa Bozo derler" tanımından. Risk: envanter
"mizah üründen gelir, zorlanmaz" der; Terbiyesiz'de sıfat marine ile ilgilidir, burada sıfat
ürünle değil kişiyle ilgili, zorlama okunabilir. Zayıf aday, tamlık için listede.

### Boyut ve bolluk

**6. Bozo Karışık Büyük** / Bozo Mixed, Large (Bozo Karışık Büyük)
Neden: En dürüst B adı; Ayran'ın Büyük / Küçük ölçü sözüyle aynı kelime, menü kendi içinde
tutarlı kalır. Mevcut satırın hemen altında kardeş olarak okunur. Risk: 18 karakter, telefonda
sınırda; A okumasında (tek karışık) "Büyük" karşılıksız kalır; İngilizce etiketi uzun.

**7. Tam Karışık** / The Full Mix (Tam Karışık)
Neden: "Full"ün Türkçesi, kısa, dürüst. Risk: "Tam" 8 Ekim 2026'da kaldırılan eski ölçü
adıydı (Tam / Yarım); eski fiyat listesini bilen misafir yarım sürümü arar. Sahibi o kelimeyi
bilerek bıraktı.

**8. Kalabalık Sofra** / Mixed Skewers for the Table (Kalabalık Sofra)
Neden: Sofra kilitli ve evin sözü; paylaşım fikrini tabak demeden verir. Risk: "Sofra kurulu
gelir" ikram bloğunun kelimesi, misafir ikram setiyle karıştırabilir; Karışık ve Bozo ikisi de
düşer; İngilizcede "platter" denmez, etiket uzar.

**9. Ocağın Hepsi** / Everything on the Fire (Ocağın Hepsi)
Neden: Ocaktan bölümünün tamamı tek şişte fikrini en kısa söyleyen ad; 12 karakter. Risk:
yalnız dolusu gerçekten ocaktaki her kalemi (tavuk ve kuşbaşı dahil) taşıyorsa doğru; üç
sakatatla kalıyorsa yanlış iddia olur, envanter uydurma iddiayı yasaklar. İçerik netleşmeden
seçilmez.

### Bozo adı

**10. Bozo Full** / The Full Bozo (Bozo Full)
Neden: Sahibinin kendi çalışma adının kısası; 9 karakter; Bozo Special zaten İngilizce bir
kelime taşıyor, menüde yabancı durmaz; turist okur ve söyler. Risk: envanterin "marka adı
ürüne eklenmez" kuralına bir ürün daha eklenir (sahibinin tercihi); Türkçe menüde "full"
fast food dilini çağrıştırabilir ("full menü"); İngilizcede "The Full Bozo" kişi hakkında bir
şaka gibi okunabilir, "Bozo" kelimesinin olumsuz anlamı İngilizce sayfada zaten tek cümleyle
nötrleniyor, bu ad o cümleye bir kez daha yaslanır.

**11. Bozo Sofrası** / The Bozo Table (Bozo Sofrası)
Neden: Bozo ve sofra, ikisi de evin kelimesi; "sofranızın yanında" cümlesiyle aynı yerden.
Risk: ikram setiyle karışma (8 ile aynı); İngilizcede "Bozo's" yasak, etiket "The Bozo Table"
olmak zorunda ve bu kalıp İngilizcede biraz tuhaf durur.

### Baştan elenenler

- Büyük Bozo, Koca Bozo: Bozo bir kişi; lakap bölümünde kişiyi bedeniyle etiketleyen adlar
  bilerek dışarıda bırakıldı (`IYILESTIRMELER.md` > lakap bölümü). Aynı çizgi.
- Bozo XL, Bozo Mega, Bozo Max: fast food dili, menüdeki hiçbir adla akraba değil.
- Karışık Tabak, 15 Adet Karışık: tabak ve adet kilitli terime takılır; panel doğrulayıcısı
  "adet" için uyarı verir.
- Efsane Karışık ve benzerleri: yasaklı ifade listesi.

## 3. İlk üç

1. **Bozani.** Tek sahici seçenek: sahibinin kendi kelimesi, hikaye sayfasında açıklaması
   hazır, menüye bir cümle açıklama ("Bozo Karışık'ın dolusu: ...") yeterli. A okumasında tek
   karışığın adı olur, B okumasında Bozo'nun yanındaki Bozani. İngilizce etiket The Full Mix
   (Bozani); "Full Mix" açıklama, Bozani ad.
2. **Bozo Full.** Sahibinin kelimesi, en kısa, Bozo Special ile aynı aileden. Bozani sahibine
   fazla kişisel gelirse bu.
3. **Bozo Karışık Büyük** (B okuması) ya da **Tam Karışık** (A okuması). Sıfatı olmayan, ölçü
   söyleyen adlar; envanterin "sayı ve ölçü sıfattan üstündür" ilkesine en yakını. Heyecansız
   ama hatasız.

Ocağın Hepsi yalnız içerik tüm ocak kalemlerini kapsıyorsa ilk üçe girer; o zaman 3. sıranın
yerini alır.

## 4. Seçilince repoda ne değişir

Bu çalışma hiçbir dosyayı değiştirmedi. Seçimden sonra:

**A, yeniden adlandırma (`bozo-karisik` kalır):**

- [ ] `/yonetim/` panelinde `ad.tr`, `ad.en` ve gerekirse `aciklama`; yayınla. Menü sayfası
      15 saniyede; JSON-LD, `llms.txt` ve meta açıklaması `npm run yayinla` ister.
- [ ] Tohum `content/menu.varsayilan.json` aynı değerlerle (kimlik `bozo-karisik` ve `fotoId`
      değişmez: kimliği değiştirmek `content/types.ts` FotoId birliğine ve foto dosya adına
      dokunur, gereksiz).
- [ ] `lib/jsonld.test.ts` satır 171 kalemi `'Bozo Karışık'` adıyla buluyor; yeni ad.
- [ ] Altın dosyalar `lib/__altin__/menu-jsonld-tr.json` ve `-en.json` (satır 133) yeni adla.
- [ ] `content/fotograflar.ts` alt metni `'bozo karışık karesi'` / `'the Bozo mix'` yeni ada göre.
- [ ] `kalemAdlari` (`content/tr/oyun.ts`, `content/en/oyun.ts`): **değişmez.** Sözlükte yalnız
      ciger, dalak, yurek, domates, sogan var; oyun karışık fişi metinsiz simgeyle gösteriyor
      (`KarisikSimgesi`, `aria-hidden`). `icerik.test.ts` de karışığı karşılaştırmıyor. Kod
      yorumlarındaki "Bozo Karışık" (`SahneTane.tsx:118`, `lib/oyun/gece.ts:35`,
      `lib/oyun/ayar.ts:80`) istenirse güncellenir, test etkisi yok.
- [ ] `llms.txt` `## Menü` bölümü belgeden türüyor (`lib/llmsTxt.ts`), kod değişmez; yayınla
      yeter. `lib/llmsTxt.test.ts` yalnız Ciğer'i arıyor.
- [ ] Yerel denemede eski `content/menu.canli.json` tohumu ezer; silip bakılır.
- [ ] Karar ve gerekçe `IYILESTIRMELER.md`'ye, kısa not `DEVAM.md`'ye.
- [ ] `npm run test` ve `npm run typecheck`.

**B, yeni kardeş kalem:**

- [ ] Panelde "kalem ekle" (`kalemEkle`): `ad.tr`; sonra `ad.en`, `aciklama`, `fiyatlar.porsiyon`
      (dürüm yoksa boş), `porsiyonNotu` (şiş sayısı, sahibinden), `fotoId` boş (boş plaka zaten
      gizli, `bosGizli`); `kalemTasi` ile Bozo Karışık'ın hemen altına; yayınla.
- [ ] Tohum `content/menu.varsayilan.json` aynı kalemle. Kimlik listeleri ve fiyat tablosu:
      `content/icerik.test.ts` (satır 251 sıra, 267 fiyatlar), `lib/menu/varsayilan.test.ts`
      (satır 21). Üçü birlikte değişir (`content/CLAUDE.md`).
- [ ] Altın JSON-LD dosyaları bir kalem büyür; `lib/jsonld.test.ts` yalnız porsiyon offer'ı
      taşıdığını doğrulayan testin bir eşi düşünülür.
- [ ] Menü açılış cümlesi ve meta açıklaması `{kalem}` sayısını belgeden alır, kendiliğinden
      sekiz olur. Ana sayfadaki `ana.ocakbasi.altNot` "Beş ürün" elle yazılı, zaten yedi kalemle
      de eski; bu vesileyle sahibine sorulur.
- [ ] Yeni foto yuvası istenirse `content/types.ts` FotoId birliği, `content/fotograflar.ts`
      etiketi ve kare; istenmezse `fotoId: null`.
- [ ] `kalemAdlari`: değişmez (yukarıdaki gerekçe). Oyundaki karışık fişi üç şişlik sürüm
      olarak kalır; dolusunu oyuna taşımak ayrı bir oyun tasarım kararıdır (`lib/oyun/ayar.ts`).
- [ ] `llms.txt`: belgeden, yayınla yeter.
- [ ] `IYILESTIRMELER.md` ve `DEVAM.md` kaydı; `npm run test`, `npm run typecheck`.
