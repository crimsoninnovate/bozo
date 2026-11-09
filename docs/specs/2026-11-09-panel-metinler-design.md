# Panelden sayfa metinleri

9 Kasım 2026. Sahibi soruları atlayıp "başla" dedi; aşağıdaki kararların hepsi geliştiricinin, sahibin
onayıyla değil. Plan: `docs/plans/2026-11-09-panel-metinler-plani.md`.

## Neden

Sayfa metinleri (`content/tr`, `content/en`) bugün yalnız kodla değişir; her düzeltme geliştiriciye yazılan
bir mesaj, bir commit ve bir yayın demek. Fiyat, saat, iletişim ve fotoğraf zaten panelden yönetiliyor;
metinler de aynı yoldan, aynı "Siteyi Güncelle" düğmesiyle değişmeli.

## Hedefler

- Ana sayfa, Menü, Hikaye, Konum ve Galeri sayfalarının metinleri panelde, Türkçe ve İngilizce yan yana.
- Değiştirilen metin "Siteyi Güncelle" ile derlenen sitede görünür; değiştirilmeyen metin koddaki
  varsayılandır. Varsayılana tek düğmeyle dönülür.
- Sitenin metin kuralları panelde de geçerli: kuralı bozan metin yayınlanamaz.

## Hedef dışı

- Gizlilik sayfası (hukuki metin, KKTC 89/2007), çerez bandı ve gezinme gibi ortak parçalar (`ortak`),
  404 (`hata`) ve oyun (`oyun`) metinleri. Bunlar kodda kalır.
- Yeni bölüm ya da alan eklemek, metin sırasını değiştirmek: panel yalnız var olan metni değiştirir.
- Menü sayfasının canlı okumasında anında görünmek: metinler statik HTML'dedir, yayın ister.

## Başarısızlık sayılır (çalışsa bile)

- Bir yer tutucunun (`{acilis}`, `{kapanis-de}`, `{ikram}`, `{sure}` gibi) silinmesi ya da eklenmesi:
  saat değişince metin bayatlar ya da `{x}` olduğu gibi basılır.
- Saati elle yazmak (`10:00`): saat panelden değişince metin yanlış kalır.
- Başlığı taşıracak uzunlukta metin.
- Panelde kaydedilip yayında hiçbir yerde görünmeyen metin.

## Nasıl (geliştiricinin kararları)

**Belge.** Menü belgesine yeni bölüm: `metinler: { tr: Record<yol, string>; en: Record<yol, string> }`.
Yalnız değiştirilen metinler tutulur; `yol` sözlükteki noktalı yoldur (`ana.hero.govde`,
`ana.hero.kilometreTaslari.1.metin`). Varsayılana eşit metin kaydedilmez (panel siler), belge küçük kalır.
Tohumda `{ "tr": {}, "en": {} }`. Eski panelin `metinler`siz belgesi `tamamla.ts` ile geçerli sürümden
(yoksa tohumdan) tamamlanır.

**Düzenlenebilir yollar.** `ana`, `menu`, `hikaye`, `konum`, `galeri` altındaki her metin yaprağı
(`lib/menu/metinler.ts` > `METIN_YOLLARI`, Türkçe sözlükten türetilir). İngilizce sözlük aynı tipte, yollar
ortak.

**Doğrulama** (`lib/menu/dogrulama.ts`, sunucu ve panel aynı kodu çalıştırır), her dil ayrı:
- Bilinmeyen yol hata.
- Boş metin hata.
- Uzunluk: en çok `max(40, ceil(1.5 × varsayılan))` karakter.
- Yer tutucu kümesi varsayılanınkiyle aynı olmalı, yoksa hata ve hangi yer tutucunun eksik ya da fazla olduğu
  yazılır.
- Varsayılanda olmayan `SS:DD` biçimli saat hata.
- Mevcut `metinKurallari`: tire, şapka, tamamı büyük harf hata; yasak terim uyarı.

**Derleme.** `next.config.ts` belgenin `metinler`ini `NEXT_PUBLIC_METINLER` olarak gömer (saatler ve
iletişimle aynı yol); `content/index.ts` saatleri doldurmadan önce bu değişiklikleri ham sözlüğe uygular,
böylece `sozluk` ve `sozlukHam` ikisi de değişmiş metni verir. Env okunamaz ya da geçersizse uyarı yazılır ve
varsayılan sözlük kullanılır; build kırılmaz.

**Panel.** "Site" grubunda yeni "Metinler" sekmesi, bütün hesaplara açık (saatler gibi). Üstte sayfa seçimi
(Ana sayfa, Menü, Hikaye, Konum, Galeri); her metin bir Türkçe/İngilizce alan çifti, etiketi yolun sayfa
sonrası kısmı (`hero › govde`). Değişmiş alanın yanında "Varsayılana dön". Sekmenin başında not: metin
değişikliği "Siteyi Güncelle" ile yayına çıkar. Yayın onayındaki değişiklik listesi ve Geçmiş farkı
metin değişikliklerini gösterir (`fark.ts`).

**Uygulamada eklenenler.** Yalnız yer tutucudan oluşan iki metin (`{kapanis}` gibi) listede değil: 119 metin.
Kod değişince geçersizleşen metin (silinen anahtar, değişen yer tutucu) okurken uyarıyla düşer
(`metinleriAyikla`: panel, taslak, derleme, sunucunun tamamlaması); yazarken doğrulama katı kalır.

## Kurucuya kalanlar

- Panelde alan etiketlerinin biçimi ve sayfa seçiminin görünümü (mevcut sekmelerin kalıbıyla).
- Uzun metinler için tek satır mı çok satır mı: varsayılanı 60 karakteri geçen alan çok satırlı.
