# Task 14 brief: 404 ve Gizlilik sayfaları

Bu görevin denetimi yok, çünkü bu iki sayfanın **tasarım karşılığı da yok**. Handoff
paketinde 404 ve gizlilik sayfası çizilmedi. Yani burada "tasarıma sadakat" ölçütü
işlemiyor; ölçüt şu: sitenin kendi kurduğu dilden sapmamak ve hiçbir şey uydurmamak.

## Metin zaten yazıldı, yeniden yazmayın

`content/tr/hata.ts`, `content/en/hata.ts`, `content/tr/gizlilik.ts`,
`content/en/gizlilik.ts` Task 3'te yazıldı ve onaylandı. Planın Task 14 bölümü
"Modify: content/..." diyor; **bu bayat**, dosyalar hazır. Metne dokunmayın.

Gizlilik metni yalnız doğrulanabilir şeyleri söylüyor: site bugün çerez yazmaz, form
toplamaz, ölçüm aracı barındırmaz. **Bu üç iddiayı kodda doğrulayın.** Biri yanlışsa
metin değil kod yanlıştır, ya da tersi; hangisi olursa olsun raporlayın. Uydurma veri
işleme iddiası eklemeyin, KVKK/GDPR maddesi uydurmayın.

## Yapılacaklar

1. `components/sayfa/HataSayfasi.tsx` + `.module.css`
2. `app/global-not-found.tsx`
3. `components/sayfa/GizlilikSayfasi.tsx` (mevcut yer tutucuyu doldurun) + `.module.css`

## Next 16 uyarısı

`app/global-not-found.tsx` bu Next sürümünde deneysel bir API
(`next.config.ts`'te `experimental.globalNotFound: true` zaten açık ve
`CLAUDE.md` onu kaldırmayı yasaklıyor). **Bu Next sürümü eğitim verinizden farklı.**
Kod yazmadan önce `node_modules/next/dist/docs/` altındaki ilgili rehberi okuyun.
Planın Task 14 bölümündeki kod bloğu bir örnektir, spec değildir; API farklıysa
dokümanı izleyin ve farkı raporlayın.

Dosya kök layout'u **atlar**, yani `<html>`, `<body>`, `globals.css` ve font
sınıflarını kendisi taşımak zorunda. Fontlar `lib/fontlar.ts`'te tek yerde tanımlı
ve iki kök layout onu paylaşıyor; üçüncü tüketici bu dosya. Font sınıflarını elle
tekrar yazmayın.

Statik export tek bir `404.html` üretir, dil ayrımı yapılamaz: TR sözlüğü kullanılır.
Bu bir sınırlama, tercih değil; dosya başı yorumunda söyleyin.

## 404 sayfası kabuk taşımaz

`components/sayfa/Kabuk.tsx` **sizin değil**, paralel bir kabuk turu onu ve
`components/layout/*` dosyalarını değiştiriyor. Ayrıca `Kabuk` zorunlu bir
`aktif: RotaAnahtari` istiyor ve 404'ün rota anahtarı yok.

Bu yüzden `HataSayfasi` kendi başına durur: ortalanmış bir blok, kicker (`404`),
başlık, metin ve iki `Buton` (`Ana sayfa` birincil, `Menüyü gör` ikincil). Marka
sürekliliği için `KorSahnesi`'ni arkasına koyabilirsiniz (`yogunlukTakip={false}`),
ama üst bar ve alt bilgi basmayın. Bu bir karar, gerekçesiyle raporlayın: kullanıcıya
çıkış yolu iki butonla veriliyor, kabuk kopyalanmıyor.

Tipografi ve renkler için sitenin kendi token'larını kullanın, yeni token eklemeyin
(`styles/tokens.css` bir ön geçişte az önce tamamlandı, 33 token). Ham renk yazmayın.

## Gizlilik sayfası

`GizlilikSayfasi` zaten `/gizlilik/` ve `/en/gizlilik/` altında render ediliyor ve
kabuğu `Kabuk`'tan alıyor; siz yalnız gövdeyi yazın. Dört bölüm (`cerez`, `veri`,
`olcum`, `soru`) başlık + paragraf olarak dizilir. Okunabilir bir ölçü tutun: bu
sayfanın metni **okunan metindir**, yani `KISITLAR.md`'nin 16px tabanı burada
**bağlayıcıdır** (arayüz mikro metni değil). O kuralı okuyun, üç katmanı yeni yazıldı.

`soruMetni` "doğrudan bize iletebilirsiniz" diyor ama iletişim bilgileri henüz
`null`. Ne yapacağınıza karar verin ve gerekçelendirin: alt bilgideki iletişim
kolonuna yönlendirmek bir seçenek, `isletme.eposta` gelene kadar bağlantısız bırakmak
başka bir seçenek. **Uydurma e-posta veya telefon yazmayın.**

## Kısıtlar

- **Asla `git add -A`.** Ağaçta üç ajanın işi var. Yalnız kendi dosyalarınızı yol
  vererek stage edin.
- `components/layout/*`, `components/sayfa/Kabuk.tsx`, `components/sayfa/ana/`,
  `components/sayfa/{AnaSayfa,PaketSeridi,HaritaPlakasi}.tsx`,
  `components/ui/{Buton,CamPanel,BolumBasligi}.*`, `styles/tokens.css`: sizin değil.
- `app/(tr)/` ve `app/(en)/` altındaki `page.tsx` dosyalarına dokunmayın. Yeni
  dosyanız yalnız `app/global-not-found.tsx`.
- Kök `app/layout.tsx` **yaratmayın**: iki kök layout kurulumunu bozar.

## Kapılar

1. `npm run typecheck`, `npm test`, `npm run build` temiz
2. `out/404.html`, `out/gizlilik/index.html`, `out/en/gizlilik/index.html` üçü de var
3. `out/404.html` içinde `<html lang="tr"` var ve **en az bir stylesheet bağlantısı**
   var. Stylesheet yoksa `globals.css` importu eksiktir; bu sessiz bir hatadır,
   sayfa çıplak görünür
4. `out/404.html` içinde font sınıflarının basıldığını doğrulayın (Türkçe karakter
   latin-ext'ten geliyor; font düşerse `ğ ş İ` bozulur)
5. Kendi playwright örneğinizde `/gizlilik/`, `/en/gizlilik/` ve statik `404.html`
   dosyasını 1440px ve 390px'te açın
6. Dokunma hedefleri 44px
7. `prefers-reduced-motion: reduce` altında iki sayfa

## Rapor

`docs/surec/rapor/task-14-report.md`. İçinde: 404'ün kabuksuz olması kararı,
`soruMetni`'nin bağlantı kararı, gizlilik metnindeki üç iddianın kod doğrulaması,
Next 16 `global-not-found` API'sinin plandaki örnekten farkı, ve tasarımı olmayan
iki sayfa için verdiğiniz her biçim kararı.
