# Açılış oyunu · Sade mod: iki dokunuşlu akış

Tarih: 9 Ekim 2026 · Durum: sahibin kararı alındı ("Sade 2 dokunuşlu oyun"), spec incelemede.
Üst belge: `docs/specs/2026-10-08-oyun-design.md` (§3, §5, §6-§7, §12 bu belgeyle geçersiz
kılınır; sunucu, sıralama, ödül, gizlilik ve görsel dil olduğu gibi kalır).

## 1. Neden

Sahibi canlı prototipi telefonda açtı ve "oyundan hiçbir şey anlamadım, oynayamadım" dedi.
Sonuç ekranı: hiçbir şey yapamadan "üç sofra kalktı", puan **−800**. Kök neden: altı farklı
dokunuş (sofra kur, raftan şiş, çevir, tezgaha al, sofraya servis, ayran), dört istasyon ve her
birinde zamanlama. QR okutup gelen biri bunu öğrenemez. Eski spec'in "ilk tur metinsiz ipucu"
çözümü de yetmedi: ipucu raf yanında küçük bir turuncu noktaydı.

**Hedef:** ilk 10 saniyede, hiç okumadan oynanır; 2 dakikada keyif verir; kaybetmek haksız
hissettirmez. İlke aynı: bir mod, bir tur, bir skor tablosu.

## 2. Kurallar

İki fiil var:

1. **Rafa dokun:** ürünün şişi ocakta ilk boş yuvaya girer, pişmeye başlar.
2. **Ocaktaki hazır şişe dokun:** şiş, o ürünü isteyen misafire **kendiliğinden** servis edilir.

Gerisi otomatik ya da kalktı:

| Eski | Yeni |
|---|---|
| Sofra kurma (tabaklar, lebeni) | Kalktı. Sofra kurulu gelir, dokunulmaz |
| Çevirme (çentik, bant) | Kalktı |
| Tezgah (4 yuva, soğuma) | Kalktı; şiş alınınca doğrudan servis |
| Ayran, yayık, maşrapa | Kalktı |
| Sofraya dokunup servis | Kalktı; servis otomatik |

**Otomatik servis.** Alınan şişi isteyen misafirler arasında sabrı en az kalan olan alır
(eşitlikte soldaki). Kimse istemiyorsa şiş boşa gider: kombo sıfırlanır, puan kaybı yok.
**Raf rehberi:** misafirlerin henüz beklediği ürünlerin raf düğmeleri nabız atarak parlar;
böylece "ne yapacağım" sorusunun cevabı ekranda durur.

**Pişme.** Ray aynı: çiğ → hazır penceresi (altın) → yanık. Pencerenin ortasında dar bir **tam
kıvam** bandı var; oraya vurmak tam kıvam, pencerede başka yer iyi. Pişerken dokunmak etkisizdir
(şiş kısa bir sallanma verir, ceza yok). Pencere geçerse şiş yanar: yuva boşalır, kombo
sıfırlanır.

**Misafir.** Üst sıra, en çok 4. Her misafir 1-3 kalem ister (fiş, mevcut simgeler ve gruplama).
Sabır halkası mevcut. Sabrı biten kalkar (`kalkan` sayısı artar); **üç misafir kalkarsa gece
biter**. Fiş tamamlanınca misafir öder ve gider.

**Puan.** Hiçbir olay puanı düşürmez, skor **asla negatif olmaz**. Servis: tam kıvam 150, iyi 100
(kombo çarpanıyla); fiş ödemesi, porsiyon rozeti, gece tamam bonusu aynen (`PUAN` tablosundan
`yanik`, `soguma`, `kalkis`, `ayran` çıkar). Ceza yalnız kombo ve kalkan sayısıdır.

**Zorluk.** Evre yapısı (5 evre, 15 sn'lik oyun saati, 120 sn tur, son saatte ×2) ve ürün açılışı
(ciğer, dalak, yürek) kalır; ayran açılışı ve karışık-ayran kalemleri çıkar. Sayılar yeniden
ayarlanır: ilk evre cömert (ilk misafir tükenmez, ikinci misafirin sabri uzun), ocak yuvası 3
(evre 3'ten 4), alma penceresi bugünkünden geniş. Kapı: aşağıdaki botlar.

## 3. Ekran

Dikey akış **HUD → Sofra → Ocak → Raf** (Tezgah satırı kalkar, ocağa ve fişe yer açılır).

- Sofra hücreleri artık düğme değil, bilgi: misafirin fişi ve sabır halkası. Dokunma hedefi yok.
- Ocakta her yuva bir düğme. Hazır olan şiş altın bir halka ve nabızla "bana dokun" der.
- Raf düğmeleri istenen ürünü parlatır (yukarıdaki rehber).
- **Görsel dil değişmez:** ürün glifleri, ateş, duman, ses, açılış, parallax, bakır tabak (ikram
  tabakları sofrada kalır). Silinenler: tezgah mermeri ve tabakları, yayık, maşrapa, çevirme çentiği.

**Rehberli ilk tur (yalnız bu tarayıcıdaki ilk turda; sahibin 9 Ekim kararı: "öğreten,
anlatan, yönlendiren bir akış oyun ekranının üstünde olmalı").** Ayrı bir sayfa değil, oyun
alanının üstünde bir katman: ekran kararır, yalnız dokunulacak yer açık kalır, üstünde nabız atan
bir el ve tek cümlelik bir balon. Oyun **dokunuşu bekler**: saat durur, kaybedilecek bir şey yok.

| Adım | Ne açık kalır | Balon | Beklenen | Saat |
|---|---|---|---|---|
| 1 | Fiş (ilk misafir, ciğer) | "Misafir ciğer istiyor" | Dokun (Tamam) | durur |
| 2 | Raf: Ciğer | "Ciğer şişini ocağa koy" | Rafa dokun | durur |
| 3 | Ocaktaki şiş ve ray | "Şiş pişiyor. Altın olunca dokun" | Gözler (balon kalır) | akar |
| 4 | Hazır şiş (altın halka) | "Şimdi dokun!" | Şişe dokun | durur, dokununca akar |
| 5 | Sofra | "Afiyet olsun! Misafir ödedi" | 2 sn sonra kapanır | akar |
| 6 | Yok | Sıradaki misafir için raf yine parlar | Serbest oyun | akar |

- Adım 3'te şiş pişerken saat akar ama ilk misafir tükenmezdir; adım 4'te pencere açılınca saat
  durur ki öğrenen kaçırmasın, dokununca kaldığı yerden sürer. Yanlış yere dokunmak etkisiz.
- **Atla** düğmesi her adımda var (44 px hedef); atlanınca rehber kapanır, oyun serbest.
- Duraklama simülasyonu etkilemez: tik ilerlemez, kayıt ve sunucu yeniden oynatması aynıdır.
- İkinci turdan itibaren rehber yok; yalnız raf rehberi (parlayan düğmeler) kalır.
- Metinler sözlükten (TR ve EN), her cümle en çok 6 sözcük; rehber `prefers-reduced-motion`
  altında el nabzı olmadan, opaklık geçişiyle çalışır.
- Eski spec §1'in "nasıl oynanır ekranı yok" ilkesi şöyle okunur: ayrı ekran ve ayrı metin sayfası
  yok, öğretim oyunun kendi içinde ve ilk turda.

**Takma ad (sahibin 9 Ekim kararı).** Giriş ekranında Oyna'nın üstünde isteğe bağlı bir alan:
"Takma adın (isteğe bağlı)". Doldurulursa tur sonunda skor **doğrudan** sıralamaya yazılır
(katılım ekranı atlanır, yalnız "Sıralamaya yazıldı: sıra N" görünür); boş bırakılırsa sonuç
ekranındaki "Bu Skoru Sıralamaya Yaz" düğmesi eskisi gibi takma ad sorar. Geri dönen oyuncunun
adı tarayıcı hafızasından gelir ve alanda hazır durur. Biçim ve yasaklı adlar mevcut `takmaAd`
kurallarıyla. Alan yalnız sıralama ulaşılabilirken görünür: skor sunucusu kapalıyken (çevrimdışı
tur) oyun ad sormaz ve sonuçta "sıralamaya girmez" der. **Skor sunucusu sade mod bittikten sonra
yayına alınır** (sahibi 9 Ekim'de hukuk onayı beklemeyeceğini söyledi; kapı kalktı). Yayından önce
gizlilik metni (TR ve EN) olguya uygun güncellenir: takma ad, skor ve tur kaydı sunucuda tutulur
(neyin, ne kadar süre, hangi amaçla; `docs/specs/2026-10-08-oyun-design.md` §16-§17). Altyapı ayrı
bir iş: Node 24 süreci, MariaDB, `api.cigercibozo.com` DNS ve proxy, gizli anahtarlar (README >
Score server). O zamana kadar canlıdaki sürümde bu alan görünmez; headless testlerde sahte
sunucuyla doğrulanır.

## 4. Kod etkisi

Aynı simülasyon deseni korunur (tamsayı, tik, deterministik, `simule` ve `ilerle` imzaları aynı).

- `lib/oyun/`: `ocak.ts` (çevirme ve tezgah çıkar, otomatik servis girer), `sofra.ts` (kurma ve
  sofra dokunuşu çıkar), `ayar.ts`, `tipler.ts`, `durum.ts`, `gece.ts`, `puan.ts`, `motor.ts`
  (`HEDEFLER`: `o0-o3`, `ciger`, `dalak`, `yurek`), `gosterim.ts`, `gorsel.ts`, `ses.ts`
  (çevirme ve tık sesleri çıkar), `deneme.ts` (test yardımcıları).
- Altın kayıtlar (`motor.test.ts`) yeniden üretilir; zorluk botları yeniden yazılır (aşağıda).
- Sunucu: `simule` aynı olduğu için yeniden oynatma aynı kalır; `aktarim.ts` hedef sözleşmesi ve
  `tavan.ts` (tohum başına skor tavanı) yeni kurala göre güncellenir. Sunucu yayında olmadığı için
  eski kayıtlarla uyum gerekmez.
- Giriş ekranı: `GirisEkrani.tsx` takma ad alanı, `useOyunAkisi.ts` doğrudan gönderim,
  `defter.ts` ad hafızası (mevcut katılım akışı yeniden kullanılır).
- Bileşenler: `SeritlerTezgah.tsx` yalnız Raf'ı tutar; `SahneTezgah` içinden tabak, maşrapa ve
  yayık silinir (raf tepsisi kalır); `Semboller` içinden çevirme ve ayran işaretleri; `tepkiler.ts`
  içinden servis uçuşunun tezgah kısmı (şiş doğrudan hedef sofranın fişine uçar).
- Ölü kod kalmaz (CLAUDE.md): kullanılmayan her dosya, sınıf ve sözlük anahtarı silinir.

## 5. Doğrulama

- **Botlar** (`gece.test.ts`, 200 tohum): *usta* (her hazır şişi tam bandında alır) geceyi
  tamamlar ve en yüksek puanı alır; *düzenli* (hazır olunca alır, bandı umursamaz, saniyede ~1,5
  dokunuş) gecelerin en az %80'ini tamamlar; *rastgele dokunan* (bilgisizce raf ve ocak yuvalarına
  vurur) ilk iki evreyi geçer; *hareketsiz* 0:40 içinde biter (kaybetme mümkün, haksız değil).
- **Skor negatif olmaz** (mülkiyet testi, rastgele girdilerle).
- Tarayıcı: aynı headless hat (duman, azaltılmış hareket, kare süresi); rehber altı adımı sırayla
  gösterir, saat adım 1, 2 ve 4'te durur, Atla her adımda çalışır.
- **İnsan testi** sahibin telefonu: rehberle ilk misafir servis edilebiliyor mu, rehber bittikten
  sonra ikinci misafir yardımsız servis ediliyor mu (ölçüt: ilk 60 sn içinde iki misafir).

## 6. Kapsam dışı

Sıralama, ödül, katılım, paylaşım kartı, raster varlıklar (brief hazır; sade mod görsellerle
bağımsız), yeni oyun konsepti (sahibi bu turda mevcut konseptin sadeleşmesini seçti).

**Ayran (ilk sürümde yok).** Sahibi 9 Ekim'de ayranın "ayran olduğunun, dökülüp konduğunun
tasarımsal anlaşılmadığını" söyledi; sade mod yayık, dolum ve maşrapayı kaldırır. Geri gelirse
**tek dokunuşlu içecek** olarak: rafta 4. ürün (sürahi), dokununca sürahi eğilir, beyaz akış
bardağa dolar, köpük çıkar (~1,5 sn, zamanlama yok) ve bardak doğrudan ayran isteyen misafire
gider, ocak yuvası tutmaz. Net okunması için sürahi ve bardak gerçekçi varlık olarak üretilir
(`docs/surec/OYUN-VARLIK-BRIEFI.md` madde 15).
