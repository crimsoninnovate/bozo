# Sayfa görevleri için çerçeve (9-13)

Bu dosya, beş sayfa görevinin ortak zeminidir. Her sayfa görevinin gönderiminde
buraya yönlendirilir, böylece aynı şeyler beş kez yazılmaz ve beş farklı biçimde
yorumlanmaz.

## Neden bu çerçeve var

Bu görevlerin brief'leri, plan yazarının tasarımı kendi cümleleriyle özetlemesiyle
oluşmuştu. Gönderimden önce beşi de tasarım kaynağına karşı denetlendi ve
**138 hata çıktı, 64'ü yapısal.** Bir tasarım zaten tam olarak belirtilmişken onu
paraphrase etmek negatif değer üretti: özet hem eksikti hem yanlıştı, ama
uygulayıcıya otoriteymiş gibi görünüyordu.

Bu yüzden kural değişti.

## Otorite sırası

1. **Ham tasarım dosyası.** Sayfanın `.dc.html` dosyası spec'tir.
   `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/`
2. **Denetim bulguları.** `denetim-task-N.json`, o sayfanın brief'inin nerede
   yanıldığını ve tasarımda ne olduğunu kaynak göstererek listeler. Bunu okumak,
   eski brief'in tuzaklarına düşmemenizi sağlar.
3. **Çıkarılmış envanter.** `docs/tasarim/*.json`, ucuz ve yapısal, ama türetilmiş
   ve daha önce eksik çıktı. Yön bulmak için kullanın, değer doğrulamak için değil.
4. **Metin envanteri.** `docs/tasarim/metin-envanteri.json`, hazır metin blokları,
   kilitli terminoloji, yasaklı ifadeler.
5. **Kısıtlar.** `kisitlar.md`.

**Eski plan dosyasını ve eski brief'i değer kaynağı olarak kullanmayın.**

## Bileşen API'leri

Bileşenlerin imzalarını **diskten okuyun**, hiçbir belgeden değil. `components/ui/`,
`components/layout/`, `components/saat/`, `components/ember/` altındaki dosyalar
tek doğrudur. Paylaşılan primitifler, tam da bu denetimin bulgularına göre yeniden
şekillendirildi; herhangi bir yazılı özet bayat olabilir.

Bir bileşen ihtiyacınızı karşılamıyorsa: önce tasarımda o kullanımın gerçekten
ne istediğini doğrulayın, sonra bildirin. Sayfa içinde yerel bir kopya yazarak
geçmeyin; paylaşılan bir primitifin ikinci bir kopyası, ilk kopyanın düzeltilmesini
sonsuza kadar erteler.

## Metin

Hiçbir metin JSX içinde sabit yazılmaz. Hepsi `content/` altındaki sözlükten gelir.
İhtiyacınız olan anahtar yoksa: uydurmayın, bildirin. Sözlükte olmayan bir metin,
ya sözlük eksiktir ya da o metin siteye ait değildir; ikisi de sizin çözeceğiniz
şey değil.

Anahtar adlarını varsaymak yerine `content/tr/` altındaki modülleri okuyun.

## Doğrulama

Her sayfa görevi tarayıcıda ölçülür, göz kararı onaylanmaz.

1. `npm run typecheck`, `npm test`, `npm run build` temiz
2. Sayfa 1440px ve 390px genişlikte gerçek tarayıcıda açılır
3. `design_handoff_bozo_website/screenshots/` altındaki karşılığıyla yan yana
   karşılaştırılır, bölüm bölüm
4. Raporda ölçülen değerler, tasarımın değerlerinin karşısında tablo halinde durur

**Kendi tarayıcı örneğinizi ve kendi portunuzu başlatın.** Paylaşılan sekme
çekişmesi daha önce ölçümleri kaygan hale getirdi.

Geçici rota kendi yolunda açılır (`app/(tr)/gecici-<gorev>/`) ve **commit'ten önce
silinir**. Bitirdiğinizde `npm run build`'in rota tablosunda `gecici-` ile başlayan
hiçbir rota olmamalı; tabloyu rapora yapıştırın. `app/(tr)/page.tsx` dosyasına
dokunmayın.

## Sapma kuralı

Tasarım bir taslak ve iyileştirilebilir, ama sessizce değil.

- Marka kuralları, olgusal doğruluk ve erişilebilirlik tabanı **serttir**.
- Piksel değerleri, sıralama ve kelime seçimi **varsayılandır**: birebir uygulanır,
  daha iyisi görülürse gerekçesiyle değiştirilir ve `iyilestirmeler.md`'ye yazılır.
- Tasarımda karar değil de gözden kaçmış gibi duran bir şey görürseniz, ne sessizce
  düzeltin ne sessizce kopyalayın. Bildirin.

## Staging

Ağaçta başka ajanlar var. Yalnız kendi yazdığınız dosyaları, yol vererek stage edin.
**Asla `git add -A`.** Bu kural bir kez ihlal edildi ve iki görevin yarım işi
alakasız bir commit'e karıştı.

## Rapor

Raporunuz şunları taşır: ölçülen ve tasarımdaki değerlerin karşılaştırma tablosu,
kapattığınız denetim bulguları ve kapatmadıklarınız gerekçesiyle, tasarımda tutarsız
görünen her şey, geçici rotanın silindiğinin kanıtı olarak rota tablosu, öz denetim
bulguları ve endişeler.
