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

**Yönerge satırı (yalnız tarayıcıdaki ilk turda).** HUD'daki duyuru satırı duruma göre tek cümle
söyler: "Fişe bak: ciğer istiyor" → "Rafa dokun" → "Altın olunca şişe dokun". Sözlükten, TR ve EN.
Bu bir "nasıl oynanır ekranı" değil, bağlamsal ipucudur; ikinci turdan itibaren kapalı. (Eski spec
§1'in "nasıl oynanır yok" kuralı bu ölçüde gevşer: ekran yok, cümle var.)

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
- Tarayıcı: aynı headless hat (duman, azaltılmış hareket, kare süresi); yönerge satırı üç adımı
  sırayla gösterir.
- **İnsan testi** sahibin telefonu: yönerge olmadan ilk 30 sn anlaşılıyor mu (ölçüt: ilk dokunuş
  raf, ikinci dokunuş şiş).

## 6. Kapsam dışı

Sıralama, ödül, katılım, paylaşım kartı, raster varlıklar (brief hazır; sade mod görsellerle
bağımsız), yeni oyun konsepti (sahibi bu turda mevcut konseptin sadeleşmesini seçti).
