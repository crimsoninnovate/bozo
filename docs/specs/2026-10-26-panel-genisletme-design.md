# Yönetim paneli genişletmesi

Tarih: 26 Ekim 2026 · Durum: sahibi "sen karar ver, hepsini ekle" dedi (26 Ekim, sohbet); aşağıdaki
sınır ve ayrıntılar benim kararlarımdır, yazılı onay yok. Ön sürüm: `2026-10-26-menu-yonetim-design.md`.

## Amaç

Panel bugün yalnız menü fiyatı ve metnini değiştiriyor. Restoranın gün içinde gerçekten değiştirdiği
diğer şeyler (bir ürün bitti, bayramda kapalıyız, ikram listesi, e-posta ve sosyal hesaplar) hâlâ koddan
geçiyor. Hedef: bunları da panelden, hata yaparsa geri alınabilecek biçimde değiştirmek; ve panelin,
neyin sitede anında, neyin bir sonraki site yayınında göründüğünü dürüstçe söylemesi.

## Eklenenler

1. **Tükendi işareti** (kalem ve içecek başına açma/kapama). Menü sayfasında anında görünür: ad
   soluk, fiyat yerine "Bugün yok / Sold out today". Ana sayfa statik kalır (zaten fiyat göstermiyor).
2. **Duyuru bandı**: aktif/pasif, iki dilli tek cümle, isteğe bağlı bitiş (tarih ve saat, Girne saati).
   Her sayfada, üst barın altında; sayfa derlenmiş duyuruyla basılır, canlı belge farklıysa tarayıcıda
   güncellenir (anında). Bitiş geçince kendiliğinden kalkar. Bayram, erken kapanış, "bugün kapalıyız"
   için: sabit çalışma saatlerinin düzenlenebilir olmasının yerine geçer (aşağıda kapsam dışı).
3. **İkramlar**: ikram ürünleri (ad, açıklama, TR/EN, foto seçimi), plakasız küme ve öğeleri, ekleme,
   silme, sıralama; "İkramlar" alt metni ve "temizlenmiş ve ayıklanmış" notu. Menü açılış cümlesindeki
   "Yedi porsiyon, bir özel, sekiz ikram" sayıları belgeden hesaplanır; ikram ya da kalem eklenince
   cümle yanlış kalmaz (sahibinden bekleyen "Yedi porsiyon" kararı kapanır).
4. **İletişim ve sosyal**: e-posta, telefon ve WhatsApp numarası, "telefonla iletişim açık" anahtarı
   (bugünkü `TELEFONLA_ILETISIM_ACIK` sabiti), Instagram/Facebook/TikTok kullanıcı adları, Google
   yorum kodu. Bunlar sitenin onlarca yerinde statik basılır: **değişiklik bir sonraki site
   yayınında görünür**, panel bunu söyler.
5. **Panel iyileştirmeleri**: kaydedilmemiş değişiklik koruması (sekme kapatma uyarısı, "Değişiklikleri
   at"); onay ekranında yeni bölümlerin farkı; "Sitede yayında olan sürüm" göstergesi (derlemenin
   gömülü sürüm numarası ile son yayın karşılaştırılır, fark varsa "siteyi yeniden yayınlamak gerekiyor").
6. **Tek komutla site yayını**: `npm run yayinla` (build, rsync, chown, doğrulama); README'deki adımların
   betiği. Panelden "siteyi yeniden yayınla" düğmesi yok (aşağıda).

## Kararlar

- **Tek belge, tek sürüm hattı.** Yeni bölümler mevcut belgeye (`MenuBelgesi`) eklenir (`duyuru`,
  `ikramlar`, `iletisim`; `tukendi` kalem ve içecek alanı). Sürüm, geri alma ve 409 koruması aynen
  çalışır. 26 Ekim'de yayınlanan 1. sürüm bu bölümleri taşımaz: doğrulayıcı eksik bölümü seed'in
  değeriyle tamamlar, eski sürüm geri alınabilir kalır.
- **Doğrulama sunucuda da.** Aynı `menuBelgesiDogrula` sunucuda, panelde, build betiğinde ve yükleyicide
  çalışır; duyuru metni ve kullanıcı adları uzunluk ve karakter kısıtı alır (düz metin, HTML yok;
  kullanıcı adı `[A-Za-z0-9._]`, e-posta basit biçim, telefon `+` ve rakam).
- **İletişim derleme zamanı.** `next.config.ts` derleme sırasında belgeden iletişim bölümünü okuyup
  `NEXT_PUBLIC_ILETISIM` olarak gömer; `content/isletme.ts` bunu varsayılanların üstüne yazar. Env yoksa
  (test, typecheck) bugünkü değerler kalır. `isletme`'yi içe aktaran onaltı dosya değişmez.
- **Duyuru canlı kanalı.** Menü sayfasının mevcut sağlayıcısı `MenuVerisi` yalnız menü sayfasında
  çalışıyordu; duyuru için kabuğa küçük bir `DuyuruBandi` bileşeni gelir, aynı `canliMenuGetir`'i
  çağırır (kimlik bilgisi yok, 15 sn önbellek, saatte 6000 IP kovası: mekan wifi'si için yeterli).
  Yeni istek her sayfa açılışında atılır; gizlilik cümlesi buna göre "menü ve duyuru" diye genişler
  (sahibi ya da hukukçu gözden geçirmeli, T8'deki cümleyle aynı durum).
- **Yerleşim kayması.** Derlenmiş duyuru varsa bant ilk boyamada yerindedir; canlıda yeni çıkarsa
  yükseklik geçişiyle açılır (`prefers-reduced-motion`'da anında). Canlıda kalkarsa kapanır.
- **Çalışma saatleri kapsam dışı.** 10:00 - 05:00 bir marka cümlesi: ortak sözlükte, hikaye çizelgesinde,
  Gece bölümünde, JSON-LD'de, oyun saatinde kırktan fazla yerde yazılı. Alan olarak düzenlenebilir
  yapmak bir tasarım işi, panel alanı değil. Bayram ve erken kapanış duyuruyla yönetilir.
- **Diğer kapsam dışı:** adres, koordinat, posta kodu, Google place id (harita plakaları derlemede OSM'den
  üretiliyor, nadir değişir); fotoğraf yükleme (statik dışa aktarımda depolama yok, ayrı bir altyapı
  işi); hikaye, gizlilik, ana sayfa metinleri (uzun marka ve hukuk metni); kullanıcı başına hesap;
  oyun ayarları (oyun tamamlanmadı, bağlantısı sahibin kararıyla panelden gizli); panelden otomatik
  yeniden build (arc'ta derleme hattı gerekir, Aşama 2, yapılmadı).

## Anti-hedefler

- Panel, sitede görünmeyecek bir alanı sessizce kabul etmesin: iletişim ve ikram değişikliğinin
  sitede ne zaman görüneceği panelde yazılı olsun.
- Yeni alan eski belgeyi (1. sürüm) ve geri almayı bozmasın.
- Yeni bir bağımlılık, tablo ya da sunucu ucu yok: `menu_surum` ve mevcut beş uç aynen kalır. Gövde
  sınırı 64 KB; yeni bölümler birkaç KB ekler.

## Doğrulama

Her görev kendi testiyle; sonda yerel uçtan uca: panelden duyuru ve tükendi yayınla, menü sayfasında
görün; iletişim değişince build çıktısında (`out/`) görünsün. Deploy bu planın dışında, sahibin
onayıyla ayrı yapılır.
