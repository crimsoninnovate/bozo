# Task 12 brief (v2): Hikaye sayfası

> v1 (`task-12-brief.md`) **iptaldir**. Denetimi 29 madde çıkardı. Değer kaynağı
> olarak kullanmayın. Bu brief'te tek tek uyarılan iki talimatı özellikle uygulamayın.

## İş listeniz nerede

**`.superpowers/sdd/2026-08-11-web-uygulama-plani/denetim-bayatlik-11-13.md`,
"Task 12: Hikaye sayfası" bölümü.** 29 maddenin her biri kova, kanıt ve kalan iş
olarak duruyor. 12 madde kapandı, 14'ü geçerli, 3'ü kısmen.

Spec: `/Users/mk/Desktop/Bozo/design_handoff_bozo_website/Hikaye Sayfasi.dc.html`.
Ayrıca: `docs/surec/SAYFA-GOREVI-CERCEVESI.md`, `docs/surec/KISITLAR.md`,
`docs/surec/denetim/denetim-task-12.json`.

## Eski brief'in iki tehlikeli talimatı

**1. "Hazır metin bloğunu bas" (S7).** Uygulamayın. `content/tr/hikaye.ts:17-32`
Usul'ün üç satırının onaylı halini tutuyor. Envanterdeki hazır bloğa dönmek onaylı
metni bozar. Aynı şey açılış metni için de geçerli (S6): sözlük
`'Bozo bir marka ismi değil, bir insan'` diyor, envanter `'insandır.'` diyor;
**sözlük kazanır**.

**2. "Usül" yazımı (E15).** Tasarım "Usül" yazıyor, içerik katmanı bilinçli olarak
"Usul"e düzeltti ve gerekçesi `content/tr/hikaye.ts:18-19` yorumunda yazılı. Tasarıma
bakıp geri "düzeltmeyin". Kısıtlar şapka işaretini yasaklıyor.

## Bu sayfaya özel üç karar

**1. `Bolum` KULLANMAYIN.** `Hikaye Sayfasi.dc.html`'de `data-erit` ve
`data-yogunluk` sıfır kez geçiyor. Düz `<section>` yazın.

**2. `EtiketSatiri` ana sayfada da var, iki kopya çıkmasın (E10).** Hikaye açılışının
etiket satırı (`Hikaye:64-66`: küçük tangerine kare + metin), ana sayfanın Bozo
bölümünün kicker satırıyla (`Ana:272-275`: 11x11 tangerine kare, `gap:12px`, metin
`500 14.5px/1` `--krem-72`) **aynı kalıp**.

Task 10 o kickerı şu anda yazıyor. Sizin işiniz:
- İki kullanımın değerlerini tasarımdan yan yana koyup **ölçün**
- Birebir aynıysa: paylaşılan `components/ui/EtiketSatiri.tsx` yazın ve Task 10'un
  çağrı yerini **siz taşıyın** (paylaşılan bir API'yi değiştiren çağrı yerlerini de
  taşır; tüketicileri bozuk bırakmak yarım iştir)
- Farklıysa: farkın gerekçesini söyleyebiliyor musunuz? Söyleyebiliyorsanız ikisini
  de koruyup adlandırın, söyleyemiyorsanız çoğunluğa normalize edin
- Hangi sonuca varırsanız varın gerekçesini ve ölçümü raporlayın

`TaneDizilimi` ile yapılmaz: o en az üç tane basar, burada tek kare var.

**3. `NotBlogu` semantiği (E9).** Token yarısı kapandı (`--tangerine-50` var).
Bileşen hâlâ yok. Uyarı: bu bir **alıntı değil not**; `<blockquote>` değil `<p>`
kullanın. Adlandırma da bunu yansıtsın.

## Dokunmayacağınız dosyalar

- `styles/tokens.css`: ön geçiş O3'teki ölçü token'larını ekledi (Hikaye H1
  `clamp(44px,6.6vw,104px)`, Sofra `clamp(34px,4.6vw,64px)`, Portre "İsim"
  `clamp(28px,3.2vw,44px)`). **Yeni token eklemeyin**, dosyayı okuyup adları alın.
  `--ol-duygusal` bu sayfaya ait değil, yalnız `Ana:252`'nin değeri; kullanmayın.
- `components/ui/Buton.*`, `CamPanel.*`, `BolumBasligi.*`: ön geçişe ait.
  `on-gecis-report.md`'yi okuyun; ikincil buton kenarlığının `.36`/`.38` ayrımı
  (E12) orada karara bağlandı.
- `components/layout/*`, `components/sayfa/Kabuk.tsx`: kabuk turu Hikaye'nin
  footer'ını (Sayfalar kolonlu varyant) ve üst bar CTA'sını kuruyor.
- `components/sayfa/{AnaSayfa,PaketSeridi,HaritaPlakasi}.tsx`, `components/sayfa/ana/`:
  Task 10'a ait. Tek istisna yukarıdaki `EtiketSatiri` kararı; onu yaparsanız
  **yalnız o çağrıyı** değiştirin ve raporda söyleyin.

## Sizin dosyalarınız

`components/sayfa/HikayeSayfasi.tsx` (mevcut, "modify"; denetimin "create" demesi
bayat, dizin `be51a74` ile geldi) ve `components/sayfa/hikaye/` altındaki bölüm
bileşenleri.

## Doğrulama

1. `npm run typecheck`, `npm test`, `npm run build` temiz; `gecici-` rota yok
2. Kendi playwright örneğiniz, kendi portunuz
3. `/hikaye/` ve `/en/hikaye/`, 1440px ve 390px
4. Parite: `screenshots/01-hikaye.jpg`, **`02-hikaye.jpg`** ve `03-hikaye.jpg`.
   İkinci kare Usul bölümünün doğrulanabildiği tek karedir, atlamayın (E16)
5. Sayfada hiç `@media` yok (E13): responsive davranış `flex-wrap` ve `clamp` ile
   geliyor. Ad hoc breakpoint uydurmayın; 390px'te bozulan bir şey varsa önce
   tasarımın kendi mekanizmasıyla çözmeyi deneyin, çözemezseniz raporlayın
6. 16px altı gövde puntoları (E14): raporlayın, sessizce büyütmeyin. Repo bu
   çelişkiyi zaten tasarım lehine çözmüş ve ön geçiş bunu `KISITLAR.md`'ye kural
   olarak yazdı; okuyun
7. `prefers-reduced-motion: reduce` altında sayfa
8. Dokunma hedefleri 44px, çakışma raporlanır

## Staging ve rapor

**Asla `git add -A`.** `git add` listeniz `components/sayfa/HikayeSayfasi.tsx`'i de
kapsasın (denetimin S13'te yakaladığı eksik). Rapor: `task-12-report.md`.
İçinde: kapattığınız madde numaraları, `EtiketSatiri` kararınız ve ölçümü,
16px altı puntoların listesi, ve tasarımda gözden kaçmış gibi duran her şey.
