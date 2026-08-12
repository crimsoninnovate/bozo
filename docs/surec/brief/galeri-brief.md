# Galeri sayfası

Sahibinin tasarım talebi (`~/Desktop/Bozo/Cigerci-Bozo-Web-Tasarim-Talebi.md:17`)
yedi sayfa istiyor; beşincisi **Galeri: 12-18 kare, tembel yüklemeli ızgara.**

Tasarım handoff'u dört sayfada durmuş (aynı belgenin son satırı sebebini yazıyor:
aşamalı üretim, onaydan sonra devam). Yani **bu sayfanın çizimi yok.** Ölçüt tasarıma
sadakat değil, sitenin kendi kurduğu dilden sapmamak.

## Bugünkü zemin

`content/fotograflar.ts` **16 kare** taşıyor, hepsinin `dosya` alanı boş: fotoğraflar
işletmeden bekleniyor. `FotoYuvasi` boş kareyi kadraj etiketli koyu plaka olarak
basıyor ve `dosya` dolduğunda `next/image`'a geçiyor. Yani sayfa bugün kurulur,
fotoğraflar geldiğinde tek noktadan dolar.

Menü sayfasında zaten bir **Çekim listesi** bölümü var (`components/sayfa/menu/`),
aynı 16 kareyi listeliyor. **Önce onu oku ve ölç.** Galeri onun büyütülmüş hali mi
olmalı, yoksa başka bir şey mi? İkisi aynı şeyi iki kez söylüyorsa bu bir sorundur;
kararını gerekçelendir ve gerekirse menüdeki bölümün ne olacağını da öner (kendin
değiştirme, raporla).

## Yapılacaklar

- Rota: TR `/galeri/`, EN `/en/galeri/`. Rota adları iki dilde de Türkçe
  (`KISITLAR.md` > Architecture). `lib/site.ts` `RotaAnahtari` ve `tumYollar`,
  `lib/kabuk.ts` varyant tabloları, `app/sitemap.ts`, üst bar ve footer gezinme
  listeleri: hepsi tek tabloya bağlı, hepsini taşı.
- Sayfa bileşeni `components/sayfa/GaleriSayfasi.tsx` (+ bölümleri), `Kabuk` ile
  sarılı. Kabuk varyantı: bu rotada canlı durum çipi **yok**, yani gece şeridi
  basılır (`lib/kabuk.ts` > `geceSeridiGosterilirMi` kuralı).
- Metin: `content/{tr,en}/galeri.ts`. **Yeni pazarlama metni uydurma.** Başlık ve
  spot için önce `docs/tasarim/metin-envanteri.json` ve
  `~/Desktop/Bozo/Cigerci-Bozo-proje-bilgi-dosyasi-v2.md` içindeki hazır bloklara bak.
  Karşılığı yoksa **en az metinle** kur (sayfa başlığı + kadraj etiketleri yeter) ve
  eksik metni raporla; uydurma.
- Izgara: tembel yükleme istenmiş. Fotoğraflar gelene kadar yükleyecek bir şey yok,
  ama `next/image`'ın `loading="lazy"` yolu `FotoYuvasi`'nda hazır olmalı. Bugün
  ölçemeyeceğin bir şeyi "çalışıyor" diye raporlama.
- Metadata ve JSON-LD: `lib/metadata.ts` ve `app/sitemap.ts` desenini izle; sayfa
  meta metni `ortak.sayfaMeta` ailesine katılır.

## Kısıtlar

- **Tasarımı olmayan sayfa, sitenin kalıplarından türetilir.** `BolumBasligi`,
  `FotoYuvasi`, `Bolum` (ana sayfaya ait, iç sayfada **kullanma**), `--sayfa-yatay`,
  tip merdiveni. Yeni bir görsel dil icat etme.
- Yeni token gerekirse önce beş tasarım dosyasında karşılığı var mı bak.
- Erişilebilirlik tabanı: 44px dokunma hedefi, `:focus-visible` halkası zaten global,
  başlık hiyerarşisi (tam bir `h1`), dekoratif katmanlar `aria-hidden`.
- `prefers-reduced-motion: reduce` altında eklediğin her hareket susar.
- **Asla `git add -A`.** Commit'te asistan imzası yok. **Yorum kısa**
  (`CLAUDE.md` > Comments).

## Kapılar

`npm run typecheck`, `npm test` (şu an 73), `npm run build` temiz; rota tablosunda
`/galeri/` ve `/en/galeri/` görünmeli, `gecici-` görünmemeli. Sitemap'e girmeli.
Beş değil **altı** sayfa 1440x900 ve 390x844. Kendi playwright örneğin, kendi portun.

Sözlük testi (`content/icerik.test.ts`) TR ve EN'in aynı anahtarları taşımasını şart
koşuyor; yeni sözlük dosyası ikisinde de olmalı.

## Rapor

`docs/surec/rapor/galeri-report.md`: menü Çekim listesi ile ilişki kararın, metin
için ne bulduğun ve neyi uydurmadığın, ölçümler, ve sahibine sorulacak konular.
