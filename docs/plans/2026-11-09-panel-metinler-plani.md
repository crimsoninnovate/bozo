# Panelden sayfa metinleri: uygulama planı

Tasarım: `docs/specs/2026-11-09-panel-metinler-design.md`. Her adım TDD, adım sonunda `npm run typecheck`,
`npm test` ve bir commit. Ölçüm (9 Kasım): beş sayfada 121 metin (ikisi yalnız `{acilis}`/`{kapanis}`,
listede değil: 119), iki dilde yollar aynı; yer tutucuları üç yolda dile göre farklı (`ana.hero.ocakSoner`, `ana.konum.saatNotu`, `hikaye.usul.saatMetni`).

1. **`lib/menu/metinler.ts`**: `METIN_SAYFALARI`, `varsayilanMetinler(dil)` (yol -> metin, sözlükten),
   `yerTutuculari(s)`, `metinleriUygula(sozluk, degisiklik)` (saf, girdiyi değiştirmez, bilinmeyen yolu
   atlar). Test: yol sayısı, uygulama, bilinmeyen yol.
2. **Belge ve doğrulama**: `tipler.ts` > `Metinler`; `dogrulama.ts` > `metinler` bölümü (bilinmeyen yol,
   boş, uzunluk, yer tutucu kümesi, yeni saat, `metinKurallari`); `tamamla.ts` > `BOLUMLER`; tohum
   `menu.varsayilan.json` ve iki beklenti tablosu. Test: her kural, varsayılanların hepsi hatasız geçer,
   eski belge tamamlanır.
3. **Derleme**: `lib/menu/metinEnv.ts` (`metinleriEnveCevir`, `metinleriEnvdenOku`, bozuksa uyarı ve
   boş); `next.config.ts` > `NEXT_PUBLIC_METINLER`; `content/index.ts` ham sözlüğe uygular.
4. **Fark**: `fark.ts` metin değişikliklerini (sayfa › yol, dil) satır olarak verir.
5. **Panel**: `duzenleme.ts` > `metinKoy` (varsayılana eşitse siler) ve `metinSifirla`; `panel.ts` >
   `metinler` sekmesi (site grubu) ve yol eşlemesi; `content/yonetim.ts` metinleri;
   `components/yonetim/MetinFormu.tsx`; `MenuYonetimi.tsx` bağlantısı.
6. **Belgeler ve deneme**: README > Deploy tablosu, `content/CLAUDE.md`, `DEVAM.md`; yerel uçtan uca:
   panelde bir metni değiştir, yayınla, derle, sayfada gör (390 ve 1280 px ekran görüntüsü).
