# Tasarım kararları turu

Sahibi dört maddeyi onayladı ("uygula"). Hepsinin ölçümü ve gerekçesi
`docs/surec/rapor/task-16-oneriler.md` içinde; maddeler **G1, G2, G4, G5**.

## Önce: brief'imdeki değerlere güvenme

Bu gece iki kez brief'imdeki bir değer bayat çıktı ve ölçüm onu düzeltti. Ağaç o
raporlar yazıldıktan sonra iki tur daha aldı (erişilebilirlik ve hareket). **Her
maddeyi uygulamadan önce bugünkü halini ölç**, sonra karar ver. Rapordaki değer
bugünküyle çelişiyorsa bugünkü kazanır ve çelişkiyi raporla.

## G1. Gece şeridi yalnız canlı durum göstergesi olmayan rotalarda kalsın

Sahibinin kendi maddesi: "üstteki ince şerit anlaşılmıyor, zaten altta yazıyor."

Ölçüm (Girne saati 03:36-03:47, şerit canlı render edilmişken), rota başına aynı
olgunun kaç kez söylendiği:

| Rota | Gece şeridi | Hero durum çipi | Saat / alt metin | Toplam |
|---|---|---|---|---|
| ana | var | "Şu an açığız" | "Ocak 05:00'e kadar yanıyor" | **3** |
| menu | var | "Şu an açığız" | canlı saat | **3** |
| konum | var | "Şu an açığız" | canlı saat + Saatler tablosu | **4** |
| hikaye | var | yok | yok | **1** |
| gizlilik | var | yok | yok | **1** |

Ölçüt sayfa kimliği **değil**, o rotada canlı bir durum göstergesi olup olmadığı.
Hikaye ve gizlilikte şerit tek kaynak; onu oradan kaldırmak "gece açığız" bilgisini
tümüyle siler.

Uygula: `lib/kabuk.ts`'e rota başına bayrak, `UstBar` koşullu render, `lib/kabuk.test.ts`
bir satır. Şeridi tümüyle kaldırma; sahibi bu seçeneği değil bunu onayladı.

Yan etki, doğrula: iç sayfa çapa payının 01:00-05:00 arasında 96→125px büyümesi
(`Kabuk.module.css`, `body:has([data-gece-serit])`) artık yalnız çapası olmayan iki
rotada kalıyor, yani fiilen gereksizleşiyor. Gereksizleştiyse kaldır; hâlâ bir işe
yarıyorsa bırak ve neden yaradığını yaz.

## G2. Geniş ekranda sayfanın birden çok sağ kenarı var

Usul kartının sola yaslılığı semptom, hastalık değil: 1440px'te ana sayfanın dört
ayrı sağ kenarı var, bazı bölümler ortalı bazıları sola yaslı. 1920px'te ölü alan
612px'e çıkıyor. Referans kareleri 924px'te çekildiği için orada görünmüyor.

Öneri: `CamPanel`'in `.sayfaEni` sınıfına `margin-inline: auto`.

**Ama önce ölç.** 1280 / 1440 / 1680 / 1920 / 2560px'te her sayfanın her bölümünün
sağ kenarını çıkar, tabloyu rapora koy. Tek satırlık düzeltme bütün kenarları
hizalıyor mu, yoksa `.sayfaEni` kullanmayan bölümler kalıyor mu? Kalıyorsa onları da
listele ve hizala; amaç tek satır atmak değil, sayfanın tek bir sağ kenarı olması.

Masaüstünü ölç ama 390px'i de ölç: ortalamanın dar ekranda hiçbir şeyi kaydırmadığını
doğrula.

## G4. Harita levhası 390px'te etiketsiz

Konum sayfasında üçüncü POI çipi levhayı 17px aşıp kırpılıyor. Tasarımın kendi mobil
cevabı ölçü ayarı değil: `Mobil Prototip.dc.html:169-174` levhayı **etiketsiz**
çiziyor (cadde etiketi, pin etiketi, POI çipleri, alt not, hiçbiri yok).

Kaybolan bilginin aynı ekranda İletişim kartında zaten durduğunu doğrula; durmuyorsa
uygulama, raporla.

Erişilebilirlik notu: levhanın dört metni bugün ekran okuyucu ağacında. Mobilde
görsel olarak kaldırırken `display: none` mu kullanıyorsun yoksa görsel gizleme mi,
kararını ver ve gerekçelendir. Bilgi başka yerde varsa gizlemek dürüst; yoksa değil.

## G5. Ocaktan satırlarının hover kayması

Ana sayfanın beş ürün satırında tasarım `cursor:pointer` veriyor ama hiçbir hedef
yok. Daha önce imleç kaldırıldı, hover korundu. Ölçüm şunu gösterdi: hover hem zemin
rengi hem **12px kayma** veriyor, yani iki sinyalin **zayıf olanı** kaldırılmış.
Kayma "tıkla" demenin daha yüksek sesli hali.

Uygula: kaymayı sil, zemin rengini koru.

**Dikkat:** paralel bir hareket turu hover ve geçişlere dokunuyor olabilir. Bu satırın
bugünkü hover davranışını önce ölç; kayma zaten kaldırılmışsa maddeyi kapalı say ve
raporla.

## Kısıtlar

- Dördü de **kayıtlı sapma**: `docs/surec/IYILESTIRMELER.md`'ye "nerede / ne / neden"
  olarak işle. G1 ve G5 sahibinin kendi gözlemlerinden geldi, bunu da yaz.
- **Asla `git add -A`.** Commit'te asistan imzası yok.
- **Yorum kısa.** `CLAUDE.md`'nin "Comments" bölümü.
- Yeni token gerekirse önce beş tasarım dosyasında karşılığı var mı bak.
- Kendi playwright örneğin, kendi portun.

## Kapılar

`npm run typecheck`, `npm test`, `npm run build` temiz. Beş sayfa 1440x900 ve
390x844; G2 için ayrıca 1280 / 1680 / 1920 / 2560.

Rapor: `docs/surec/rapor/tasarim-kararlari-report.md`. Her madde: bugünkü ölçüm,
ne değişti, sonraki ölçüm, ve raporla çelişen bir şey bulduysan o.
