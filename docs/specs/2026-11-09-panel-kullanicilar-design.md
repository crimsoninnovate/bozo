# Panel: kişi başına giriş ve değişiklik kaydı

Tarih: 9 Kasım 2026 · Durum: sahibi "devam et" dedi (9 Kasım 21:55); oyun kısmı arka planda. Önceki tasarımlar:
`2026-10-26-menu-yonetim-design.md`, `2026-11-09-panel-icerik-design.md`.

## Amaç

Panele bugün tek bir kullanıcı adı ve şifreyle giriliyor (`YONETIM_KULLANICI`, `YONETIM_SIFRE`, arc'ta
`/etc/bozo-oyun.env`). Kimin girdiği ayırt edilmiyor; şifre değişince herkes birden düşüyor.

Sahibi, bir ajansa panel erişimi vermesi gerekirse şunu istiyor: ajans kendi hesabıyla girer, ne yaptığı
görünür, iş bitince yalnız onun erişimi kapanır. Bugüne kadar bir sorun yaşanmadı; bu, erişimi
paylaşmadan önce hazır olsun diye yapılıyor.

Başarı: sahibi panelden ajansa bir hesap açar ve geçici şifreyi iletir. Ajans ilk girişte kendi şifresini
koyar, menüyü değiştirir. Geçmiş sekmesinde o sürümün yanında ajansın adı yazar. Sahibi hesabı kapatınca
ajansın açık oturumu bir sonraki istekte düşer. Sahibinin kendi girişi hiçbir adımda etkilenmez.

## Sahibinin kararları

- **Tek admin, sahibinin hesabı.** Kullanıcı ekleyip çıkarabilen tek hesap bu.
- **Diğer hesaplar panelin geri kalanına tam erişir:** menü, fiyat, saatler, fotoğraflar, duyuru,
  ikramlar, iletişim, geri alma, Siteyi Güncelle. Yalnız kullanıcı yönetimi kapalı.
- **Hesabı admin açar, geçici şifreyi o belirler ve iletir; kullanıcı ilk girişte kendi şifresini koymak
  zorunda.** Admin kullanıcının asıl şifresini bilmez.
- **Kayıt düzeyi benim kararım, sahibi "sen karar ver" dedi:** her menü sürümünde yayınlayanın adı, ayrıca
  yalnız adminin gördüğü bir işlem listesi. Ayrıntılı alan farkı ayrıca tutulmaz: Geçmiş sekmesi iki sürüm
  arasındaki farkı zaten gösteriyor, sürüme yazar eklenince "kim neyi değiştirdi" oradan okunur.
- **Oyun kısmı arka planda kalır** (sahibi). Oyuna özel dar bir rol yok; `/oyun/yonetim/` her hesapla
  bugünkü gibi çalışır.

## Benim kararlarım (kurucu sorularından)

- Şifresi değişmesi gereken bir hesap `/oyun/yonetim/`'e girerse ekran şifrenin `/yonetim/`'de
  değiştirileceğini söyler ve oraya bağlantı verir; ikinci bir şifre ekranı yapılmaz.
- Ödül kodu onayı ve oyuncu adı gizleme de kayda girer: kodu kimin onayladığı en çok sorulacak şeydir.
- Sahibinin bugünkü "Beni hatırla" anahtarı yayında düşmez: eski biçimli admin anahtarı süresi dolana kadar
  (en çok 30 gün) kabul edilir. Bu kabul, kodda kaldırma tarihiyle işaretlenir.
- Adminin yayınladığı sürümlerde yazar adı `YONETIM_KULLANICI`'dır.

## Açık konu: personel şifreyi biliyor olabilir

Oyun personel ekranına bugün adminin kimliğiyle giriliyor; ödül kodunu onaylayan çalışanlar bu şifreyi
biliyor olabilir. Sahibi oyun kısmını şimdilik arka plana aldı. Biliyorlarsa, kurulumdan sonra sahibi
onlara kendi hesaplarını açar ve admin şifresini sunucuda değiştirir (kurulum notunda yazılır); o güne
kadar personelin işlemleri kayıtta admin adıyla görünür.

## Hedefler

1. Admin, panelde **Kullanıcılar** sekmesinden hesap açar (ad, geçici şifre), hesabı kapatır, kapalı
   hesabı yeniden açar ve şifresini sıfırlar (yeni geçici şifre).
2. Admin dışındaki her kullanıcı, geçici şifreyle girdiğinde yeni şifresini koymadan hiçbir şey yapamaz.
   Sonra istediği zaman şifresini değiştirebilir.
3. Hesap kapanınca, şifre sıfırlanınca ya da kullanıcı şifresini değiştirince o hesabın **bütün** açık
   oturumları (30 günlük "Beni hatırla" anahtarları dahil) bir sonraki istekte geçersiz olur.
4. Her menü sürümü yayınlayanı taşır; Geçmiş sekmesi sürüm satırında adı gösterir. Bu özellikten önceki
   sürümler "bilinmiyor" görünür.
5. İşlem kaydı: kim, ne zaman, ne yaptı. Kullanıcılar sekmesinde her hesabın son girişi ve son işlemleri
   listelenir.
6. Panelin üst kısmında giriş yapanın adı görünür.

## Kapsam dışı

- Bölüm bazında yetki (örneğin "yalnız fotoğraf"). Sahibi tam erişim dedi.
- İki adımlı doğrulama, e-postayla davet, "şifremi unuttum" bağlantısı. Unutan kullanıcının şifresini
  admin sıfırlar.
- Adminin şifresini panelden değiştirmek. Admin bugünkü gibi sunucudaki ortam dosyasında kalır (aşağıda).
- Birden fazla admin.

## Kaçınılacaklar (çalışsa bile başarısızlık sayılır)

- Sahibinin kendini dışarıda bırakabilmesi: veritabanı bozulsa, tablo boş kalsa ya da bir hata olsa bile
  admin girişi çalışmalı.
- Admin olmayan bir hesabın kendini ya da başkasını admin yapabilmesi, başka hesapların şifresine ya da
  oturumuna dokunabilmesi.
- Kapatılan bir hesabın elinde kalan bir anahtarla 30 gün boyunca girmeye devam edebilmesi.
- Bugünkü girişin bozulması: sahibi bugünkü kullanıcı adı ve şifresiyle, aynı ekrandan girmeye devam eder.
- Şifrenin ya da şifre özetinin kayıtta, günlükte veya bir yanıtta görünmesi.

## Sınırlar

- Skor sunucusu Node 24, `node:http`, tek bağımlılık `mariadb` (`sunucu/CLAUDE.md`). Şifre özeti için
  paket eklenmez: `node:crypto` `scrypt` yeterli.
- Depo arabirimi `sunucu/depo.ts`: `bellekDepo` (testler) ve `mariaDepo` (üretim) ikisi de genişler,
  `depoSozlesmesi.ts` ikisini aynı testlerden geçirir.
- Şema değişikliği `sunucu/sema.sql`'de, `CREATE TABLE IF NOT EXISTS` ve canlı tabloya eklenen sütun için
  ayrı bir `ALTER` adımı ile (`SUNUCU-CANLIYA-ALMA.md`'ye yazılır). `menu_surum` satırları silinmez.
- Panel statik dışa aktarılan sitenin parçası (`app/(tr)/yonetim/`); yeni ekran da istemci tarafında
  çalışır, metinleri `content/yonetim.ts`'te.
- `/oyun/yonetim` (oyun personel ekranı) aynı kimliği kullanıyor; yeni hesaplarla da çalışmalı.
- Mevcut hız sınırları kalır: `/yonetim/*` için IP başına saatte 60 istek, yanlış şifre bu kovaya sayılır.
- Yayın sırası kilitlemesin: yeni sunucu eski paneli (yazarsız, Basic ya da eski Bearer) bir süre
  kaldırabilmeli ya da kaldıramıyorsa geçiş adımı kurulum notunda açıkça yazmalı.

## Nasıl (karar verilenler)

### Admin ortamda kalır

`YONETIM_KULLANICI` ve `YONETIM_SIFRE` bugünkü gibi adminin kimliği olarak kalır ve veritabanında
tutulmaz. Böylece veritabanı ne durumda olursa olsun sahibi girebilir, bugünkü girişi de değişmez.
Admin şifresi sunucuda değişir, değişince adminin oturumları düşer (bugünkü davranış). Admin dışındaki
hesaplar veritabanındadır. Bir veritabanı hesabı adminin adını alamaz.

### Oturum anahtarı hesaba bağlanır

Bugünkü anahtar `<bitisMs>.<hmac>` biçiminde ve kullanıcı adı ile şifreyle imzalı. Yeni anahtar hangi
hesaba ait olduğunu ve hesabın **oturum sürümünü** taşır. Sürüm, hesap kapandığında, şifresi
sıfırlandığında ya da kullanıcı şifresini değiştirdiğinde bir artar. Her yönetim isteğinde hesap ve sürüm
veritabanından denetlenir. Kapalı hesap ya da eski sürüm 401 alır. Adminin anahtarı veritabanına
bakmadan, bugünkü gibi ortamdaki şifreyle doğrulanır.

### Geçici şifre

Geçici şifreyle açılan ya da sıfırlanan hesap "şifre değişmeli" durumundadır. Bu durumda giriş ve şifre
değiştirme dışındaki her yönetim ucu 403 döner, panel doğrudan "Yeni şifrenizi belirleyin" ekranını açar.
Şifre en az 10 karakter. Yeni şifre geçici şifreyle aynı olamaz.

### Kayıt

Kaydedilen işlemler: giriş, menü yayını ve geri alma (sürüm numarasıyla), fotoğraf yükleme (dosya adıyla),
Siteyi Güncelle isteği, hesap açma, kapatma, yeniden açma, şifre sıfırlama, şifre değiştirme. Kayıt satırı
kısa bir ayrıntı taşır, şifre ya da belge içeriği taşımaz. Kayıtlar bir yıl tutulur, sonra sunucunun
mevcut günlük temizlik işi (`isler.ts`) siler.

## Kurucuya bırakılanlar

- Tablo ve sütun adları, uç adları ve yanıt biçimleri (proje adlandırma kuralına uyarak).
- Anahtar biçiminin ayrıntısı ve eski anahtarlarla geçişin nasıl yapılacağı (yukarıdaki sınır içinde).
- Kullanıcılar sekmesinin yerleşimi; mevcut panel bileşenleri ve mobil öncelikli düzen kullanılır.
- scrypt parametreleri ve hesap adı kuralları (ASCII, küçük harf gibi).
- İşlem listesinin sayfalaması (son 100 kayıt yeterli).
