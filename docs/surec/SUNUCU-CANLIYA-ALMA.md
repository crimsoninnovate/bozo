# Skor sunucusunu canlıya alma

Oyunun skor sunucusunun (`sunucu/`) canlıya alınışı ve işletme notları. Sahibi 10 Ekim 2026'da
"sunucuyu canlıya al" kararını verdi ve hukukçu adımını kendi üstlendi; kurulum aynı gün yapıldı.

## Durum: canlıda (10 Ekim 2026)

Sahibi hukukçu incelemesini istemedi ve kararı kendisi üstlendi (10 Ekim 2026); Md. 8 bildirimi ve
Md. 11 Transfer Ruhsatı için ayrıca işlem yapılmadı, sorumluluk sahibinde. Gizlilik metni bu belgenin
altındaki taslakla yayında. DNS sahibi tarafından yönlendirildi.

## Sunucudaki kurulum

| Parça | Yer |
|---|---|
| Alt alan | Plesk `api.cigercibozo.com` (cigercibozo.com aboneliği), Let's Encrypt, Cloudflare proxy |
| Vekil | `/var/www/vhosts/system/api.cigercibozo.com/conf/vhost_nginx.conf`: `location ~ ^/` ile `127.0.0.1:8402`, `X-Forwarded-For $remote_addr` |
| Uygulama | `/opt/bozo-oyun/{dist,node_modules,package.json}`, sahip `engincaglar:psacln`, Node `/opt/plesk/node/24/bin/node` |
| Servis | `systemctl status bozo-oyun` (systemd, `Restart=always`, yalnız `127.0.0.1` dinler) |
| Veritabanı | MariaDB `bozo_site`, kullanıcı `bozo_site_k` (Plesk'te cigercibozo.com abonelikte); şema `sunucu/sema.sql`. 26 Ekim 2026'ya dek `bozo_oyun` / `bozo_oyun_k` idi, menü tablosu da girince adı genelleştirildi |
| Sırlar | `/etc/bozo-oyun.env` ve yedeği `/root/.bozo/oyun.env` (0600, root): `GIZLI_TUZ`, `DB_URL`, `YONETIM_KULLANICI` / `YONETIM_SIFRE`. `GIZLI_TUZ` kaybolursa ödül kodları doğrulanamaz; yedeği saklayın. |

Sunucu güncellemesi:

```bash
npm run build -w sunucu
rsync -az --delete sunucu/dist/ plesk-206:/opt/bozo-oyun/dist/
ssh plesk-206 'chown -R engincaglar:psacln /opt/bozo-oyun && systemctl restart bozo-oyun'
```

Şema değişince (`sema.sql` yalnız `CREATE TABLE IF NOT EXISTS` ve `ADD COLUMN IF NOT EXISTS`, tekrar
uygulamak zararsız), servisi
yeniden başlatmadan önce:

```bash
ssh plesk-206 'MYSQL_PWD=$(cat /etc/psa/.psa.shadow) mariadb -uadmin bozo_site' < sunucu/sema.sql
```

Doğrulandı: `/tablo` 200 (Cloudflare üzerinden), CORS yalnız `https://cigercibozo.com`, `/yonetim/*`
kimliksiz 401, uçtan uca tur (jeton, katılım, sunucuda yeniden oynatma puanı yerelle aynı, sıralama,
hesap silme) çalışıyor.

**Personel ekranı** `https://cigercibozo.com/oyun/yonetim/` (10 Ekim 2026): `YONETIM_KULLANICI` /
`YONETIM_SIFRE` ile girilir, oturum sekme kapanınca biter. Ödül kodunu kullanır (kod tek seferlik,
kullanılınca teslim sayılır), haftanın ilk 20'sini gösterir, adı gizler, turu tarayıcıda yeniden
oynatıp puanı karşılaştırır ("tutuyor"). "Masa okumaları" bölümü (13 Ekim 2026) her masa plakasının
bugün, son 7 gün ve toplam okunma sayısını gösterir (`POST /tarama/N`, tablo `masa_tarama`, kişisel
veri yok). Yönetim uçlarına IP başına saatte 60 istek: mekandaki
herkes aynı IP'den çıkar. Geri alma: `systemctl stop bozo-oyun`; site çevrimdışı tura döner, ad alanı gizlenir.

## Menü sürümleri (26 Ekim 2026, canlıda)

Fiyat ve menü metni personel panelinden (`/yonetim/`) yayınlanır; her yayın
`menu_surum` tablosuna yeni bir sürüm olarak eklenir, hiçbiri silinmez. Tablo `sunucu/sema.sql`'de, şemayı
uygulama komutu yukarıdaki. Uçlar (`sunucu/uygulama.ts`):

| Uç | Kim | Ne yapar |
|---|---|---|
| `GET /menu` | herkese açık | son sürüm (200) ya da hiç sürüm yoksa 204; 15 sn tek uçuşlu önbellek, IP başına saatte 6000'lik ayrı kova (genel 600'e girmez, mekanın wifi'si tek IP) |
| `POST /yonetim/oturum` | yalnız temel kimlik | `{ anahtar, bitis }`: 30 günlük imzalı oturum anahtarı (`Authorization: Bearer`), Bearer ile çağrılırsa 401 |
| `GET /yonetim/menu` | personel | geçerli sürüm ve son 20 sürümün özeti |
| `GET /yonetim/menu/N` | personel | tek sürümün belgesi (geri alma farkı için), yoksa 404 `surumYok` |
| `PUT /yonetim/menu` | personel | `{ taban, belge }`: belgeyi doğrular ve yeni sürüm yazar; `taban` son sürüm değilse 409 `surumEskidi` |
| `POST /yonetim/menu/N/geri-al` | personel | N. sürümü yeni sürüm olarak yeniden yayınlar (`kaynak = geriAl`) |

Yönetim uçları öncekiler gibi IP başına saatte 60 istekle sınırlıdır. Oturum anahtarı (`sunucu/oturum.ts`,
"Beni hatırla") `bitisMs.HMAC(GIZLI_TUZ, kullanici:sifre:bitisMs)` biçimindedir: durumsuz, 30 gün geçerli.
Hepsini iptal etmek için `YONETIM_SIFRE` değiştirilir (anahtarlar kimlik bilgisiyle imzalıdır). `GIZLI_TUZ`
bunun için döndürülmez: kullanılmamış ödül kodlarının özeti de aynı tuzla alındığından hepsini geçersiz kılar.
Site her build öncesi son sürümü çeker (`scripts/menuCek.ts`, `content/menu.canli.json`); panelden yayın
siteyi kendiliğinden yeniden basmaz, elle build ve deploy gerekir (Aşama 2 yapılmadı). Menü sayfası ise tarayıcıda `GET /menu`'yü
çağırıp fiyatları anında tazeler.

**Gövde sınırı (26 Ekim 2026, panel genişletmesi).** Her metin azami uzunlukta Türkçe harfle ve içecek başına
6 ölçüyle (doğrulayıcının tavanı) en büyük geçerli menü belgesi 180.067 bayt tutuyor; ortak 64 KB sınırı yetmediği
için yalnız `PUT /yonetim/menu` 256 KB okur (`sunucu/menu.ts` > `MENU_GOVDE_SINIRI`). Her yerde 3 baytlık karakterden
oluşan bir belge yine aşabilir; panel o zaman "Menü çok büyük, kaydedilemedi." der. Sunucu kodu bu daldaki panel genişletmesiyle
değiştiği (v2 doğrulayıcı dahil: eski sunucu `duyuru`, `ikramlar`, `iletisim` alanlarını reddeder) için
yukarıdaki "Sunucu güncellemesi" ile 26 Ekim 2026'da yeniden dağıtıldı. Nginx'in varsayılan gövde
sınırı 1 MB, bu boyutların çok üstünde; arc'ta `client_max_body_size` ayrıca denenmedi.

**Dağıtım sırası:** önce skor sunucusu (yukarıdaki "Sunucu güncellemesi"), sonra site (`npm run yayinla`). Ters
sırada yeni panel eski sunucudan alan hatası göstermeyen bir 400 alır. Gerisi `DEVAM.md` > "Bir sonraki deploy'da".

**Geri alma:** `systemctl stop bozo-oyun`. `GET /menu` yanıt vermez, menü sayfası derlenmiş menüye
döner; sunucu açılınca kaldığı yerden devam eder (sürümler veritabanında durur).

**Canlıya alırken yapılan kontroller (26 Ekim 2026, üçü de temiz).** MariaDB kodu (`sunucu/mariaDepo.ts`)
bundan önce yalnız bellek deposuyla test edilmişti:

1. arc'ta `SELECT @@global.tx_isolation, @@global.innodb_deadlock_detect;` (yayın yarışı `taban`
   sınaması ve deadlock kurbanı varsayımına dayanıyor).
2. Boş bir deneme veritabanına karşı `BOZO_TEST_DB_URL=mariadb://... node --test sunucu/mariaDepo.test.ts`
   (üretim veritabanına karşı koşma; kurulum için dosyanın başındaki docker komutu).
3. `bozo_site_k` kullanıcısının `menu_surum` üzerinde `SELECT`, `INSERT` yetkisi olduğunu
   (`SHOW GRANTS FOR bozo_site_k@'%'`) ve şemanın uygulandığını (`SHOW TABLES LIKE 'menu_surum'`) doğrula.

## Kişi başına panel girişi (9 Kasım 2026, henüz canlıda değil)

Admin ortamda kalır (`YONETIM_KULLANICI`/`YONETIM_SIFRE`, veritabanında satırı yok); panelin Kullanıcılar
sekmesinden açılan diğer hesaplar `yonetim_personel`'de, her işlem `yonetim_islem`'de (bir yıl tutulur), her
menü sürümünün yayınlayanı `menu_surum.yazar`'da. Tasarım `docs/specs/2026-11-09-panel-kullanicilar-design.md`.
Oturum anahtarı artık `k<id>.<surum>.<bitisMs>.<hmac>`: personelin `surum`'u hesap kapanınca, şifresi
sıfırlanınca ya da kendisi değiştirince artar ve o hesabın bütün anahtarları düşer. Eski biçimli admin
anahtarları (`<bitisMs>.<hmac>`, sahibin bugünkü "Beni hatırla"sı) 15 Aralık 2026'ya kadar geçer
(`sunucu/oturum.ts` > `ESKI_ANAHTAR_SONU`); o tarihten sonra bu dal silinir.

**Kurulum sırası:**

1. Şema: yukarıdaki `sema.sql` komutu (iki `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE menu_surum ADD COLUMN
   IF NOT EXISTS yazar` ve `ALTER TABLE kazanan ADD COLUMN IF NOT EXISTS gizli`; tekrar uygulamak zararsız).
   `kazanan.gizli` sütunu sunucudan önce gelmeli: yeni sunucu onu okur.
   Sonra `SHOW GRANTS FOR bozo_site_k@'%'` ile kullanıcının
   yeni tablolarda `SELECT`, `INSERT`, `UPDATE`, `DELETE` yetkisi olduğunu doğrula (şifre ve kapatma `UPDATE`,
   bir yıllık budama `DELETE` ister).
2. Skor sunucusu ("Sunucu güncellemesi"), sonra site. Ters sırada yeni panel `GET /yonetim/ben`'den 404 alır
   ve açılmaz. Sunucu geri alınırsa site de geri alınmalı. `YONETIM_KULLANICI` en çok 40 karakter olmalı
   (`yazar` ve `yonetim_islem.ad` sütunları); uzunsa yeni sunucu açılışta hata verip başlamaz.
3. Denetim: admin girişi, Kullanıcılar sekmesinde deneme hesabı, o hesapla girişte zorunlu şifre ekranı,
   bir yayın ve Geçmiş'te yazar adı, hesabı kapatınca öbür cihazın girişe dönmesi; sonra deneme hesabını kapat.
4. Personel admin şifresini biliyorsa (oyun ekranına bugüne kadar adminin kimliğiyle giriliyordu): sahibi
   her birine kendi hesabını açar, sonra `/etc/bozo-oyun.env` ve yedeğinde `YONETIM_SIFRE`'yi değiştirip
   `systemctl restart bozo-oyun` çalıştırır. Bu, adminin bütün oturumlarını da düşürür; o güne kadar
   personelin işlemleri kayıtta admin adıyla görünür.

## Panelden sayfa metinleri (9 Kasım 2026, henüz canlıda değil)

Menü belgesine `metinler` bölümü eklendi (tasarım `docs/specs/2026-11-09-panel-metinler-design.md`). Şema
değişikliği yok: belge JSON olarak saklanır. Sıra yine önce skor sunucusu, sonra site: eski sunucu yeni panelin
`metinler` alanını bilinmeyen alan sayıp yayını 400 ile reddeder. Yeni sunucu `metinler`siz eski panel
belgesini ve sürüm 6 gibi eski sürümleri boş metinlerle tamamlar. Denetim: panelde Sayfa Metinleri'nde bir
metni değiştir, yayınla, "Siteyi Güncelle", sayfada gör; sonra "Varsayılana dön" ile geri al ve yeniden yayınla.

## Panelden site yayını ve fotoğraflar (canlıda, 9 Kasım 2026)

Panelin **Siteyi güncelle** düğmesi ve **Fotoğraflar** sekmesi için arc'ta yapılacak kurulum. Tasarım:
`docs/specs/2026-11-09-panel-icerik-design.md` > C. Betikler ve birimler `sunucu/derleme/`'de.

| Parça | Yer |
|---|---|
| Derleme kullanıcısı | `bozo-derleme` (sistem kullanıcısı, giriş kabuğu yok, ev dizini `/var/lib/bozo-derleme`) |
| Depo | `/var/lib/bozo-derleme/depo` (`main`, GitHub'da yalnız okuma yetkili deploy key) |
| Hazırlık dizini | `/var/lib/bozo-derleme/cikti` (son başarılı `out/` ve `menu.canli.meta.json`) |
| Derleme günlüğü | `/var/lib/bozo-derleme/derleme.log` (son 200 satırı `durum.json`'a da yazılır) |
| Panel dosyaları | `/var/lib/bozo-derleme/panel/` = `DERLEME_DIZINI`: `istek` (skor sunucusu yazar), `durum.json` (betikler yazar) |
| Betikler | `/opt/bozo-derleme/{derle.sh,yukle.sh,ortak.sh,kap.sh,uyari.sh}`, sahip `root`, 0755 |
| Derleme imajı | `bozo-derleme:1` (`sunucu/derleme/Dockerfile`, `node:24-bookworm-slim`): arc'ın glibc 2.28'i Next'in yerel SWC/Turbopack ikilisine yetmez (2.29 ister). `kap.sh` `derle.sh`'ı bu konteynerde `bozo-derleme` olarak, yetkisiz çalıştırır |
| Birimler | `bozo-derleme.path` -> `bozo-derleme.service` (kullanıcı `bozo-derleme`) -> `ExecStartPost=+` `bozo-yukle.service` (root; arc'ta systemd 239, `OnSuccess=` 249 ister) |
| Hata e-postası | `bozo-uyari.path` `durum.json`'u izler -> `bozo-uyari.service` (kullanıcı `bozo-derleme`): her `hata` için bir kez `bozo@cigercibozo.com`'a, gönderen `web@cigercibozo.com`. Son gönderilen hatanın `zaman`'ı `/var/lib/bozo-derleme/uyari-son`'da |
| Fotoğraflar | `/var/lib/bozo-oyun/foto` = `FOTO_DIZINI`, nginx `https://api.cigercibozo.com/foto/<ad>` olarak sunar |

**Yetki ayrımı.** Skor sunucusu yalnız `panel/istek` yazar ve `panel/durum.json` okur; derlemeye ve
rsync'e yetkisi yoktur. `panel/` derleme ağacının alt dizinidir, kökü değil: web sürecinin yazabildiği
dizin `DEPO`'nun atası olsaydı oraya bırakılan bir `node_modules/`, `.npmrc` ya da `.gitconfig` derleme
kullanıcısıyla kod çalıştırırdı. Bu yüzden istek dosyası `panel/` altında:
`/var/lib/bozo-derleme/panel/istek`. Root birimi dışarıdan girdi almaz: argüman yok, yollar betikte
sabit, sudoers kuralı yok. Betikler depoda değil `/opt/bozo-derleme/`'de durur; root, derleme
kullanıcısının yazabildiği bir dosyayı asla çalıştırmaz. `yukle.sh` `panel/` ve `cikti/` altında hiçbir
dosyayı root olarak okumaz ya da yazmaz: durum yazımı ve sürüm okuması `runuser -u bozo-derleme` ile
yapılır (root'un kendi günlüğü yazıcıya stdin'den verilir), durum yazıcısı root'ken çalışmayı reddeder.
Root `cikti/`'yı yol üzerinden de okumaz: `bozo-derleme` onu `tar` akışı olarak verir (okuyamadığı bir
dosyaya sabit bağ varsa burada düşer), root akışı kendi özel geçici dizinine (`PrivateTmp`) bir dosya
olarak yazar. Açmadan önce listeler: her üye düz dosya ya da dizin, yolu göreli ve `..` içermiyor
olmalı, yoksa hiçbir şey açılmadan reddedilir. Sonra yeni bir alt dizine açar; açılmış ağaçta yine düz
dosya ve dizinden başka bir şey ya da birden çok bağlı dosya varsa yükleme reddedilir (ikinci ağ). Bekçi
ve `rsync` bu ağaç üzerinde çalışır. Birimdeki `+` satırları (root) systemd 239'da `User=`'ın `HOME`'unu, yani derleme kullanıcısının ağacını
taşır (9 Kasım'da arc'ta ölçüldü); bu yüzden üçü de `env -i ... HOME=/root` ile başlar, yoksa root'un `docker`
istemcisi `bozo-derleme`'nin yazdığı bir `~/.docker/config.json`'u okurdu. Root'ta kalanlar: sahneden httpdocs'a `rsync`,
`chown`, `chmod` ve `plesk`.

| Yol | Sahip, kip | Kim yazar |
|---|---|---|
| `/var/lib/bozo-derleme` | `bozo-derleme:bozo-panel` 0710 | `bozo-derleme`; `bozo-panel` (web) yalnız geçer |
| `depo/`, `cikti/`, `derleme.log` | `bozo-derleme:bozo-derleme`, 0750 / 0640 | yalnız `bozo-derleme`; web süreci okuyamaz da |
| `panel/` | `bozo-derleme:bozo-panel` 3770 | web süreci yalnız `istek` yazar, betikler `durum.json` (0640) |

Web süreci (`bozo-oyun`) yalnız `bozo-panel` grubuna girer, derleme kullanıcısının birincil grubu olan
`bozo-derleme`'ye değil: o grup derleme araçlarının oluşturduğu dosyaları okuyup yazabilirdi.

**Önkoşul:** `sysctl fs.protected_hardlinks fs.protected_symlinks` ikisi de `1` olmalı (çoğu dağıtımda
varsayılan). Değilse `/etc/sysctl.d/90-bozo-derleme.conf` içine `fs.protected_hardlinks = 1` ve
`fs.protected_symlinks = 1` yazılır, `sysctl --system` çalıştırılır.

**Durum dosyası.** Her yazım atomik (aynı dizinde geçici dosya, sonra `mv`). `derle.sh` başta
`istek`'i siler (derleme sürerken gelen istek bir sonrakini tetikler), `derleniyor` yazar; başarıda
öyle bırakır, `yukle.sh` `yayinda` (ve `surum`) ya da `hata` yazar. Bir hata ya da sinyal (`TERM`)
`trap` ile `hata` + günlüğün son 200 satırını yazar. `SIGKILL` (zaman aşımından sonra) `trap`'i
atlar; o durumda birimin `ExecStopPost=` satırı aynı betiği `SERVICE_RESULT` ile çalıştırır ve kalan
`derleniyor`'u `hata`'ya çevirir; bunu yalnız kilidi almış ve son durumunu yazamamış bir çalışma yapar
(özel `/tmp`'deki sahiplik izi), kilidi hiç almamış bir çalışma başka bir derlemenin durumuna dokunmaz.
Aynı anda tek derleme: iki betik `/var/lib/bozo-derleme` üzerinde `flock` tutar, derleme bir yüklemenin
bitmesini bekler; derleme sürerken gelen istek yeni derlemeyi yüklemeyle aynı anda başlatırsa
`After=bozo-yukle.service` yüklemeyi öne alır. `npm ci` lockfile özeti `node_modules/.bozo-kilit`'e
yalnız başarıdan sonra yazılır; iz eksik ya da farklıysa her çalışmada yeniden denenir.

### Kurulum (bir kez, root)

```bash
# 1. Kullanıcı, panel grubu ve dizinler
sysctl fs.protected_hardlinks fs.protected_symlinks   # ikisi de 1 (önkoşul, yukarıda)
useradd --system --home-dir /var/lib/bozo-derleme --shell /usr/sbin/nologin --user-group bozo-derleme
groupadd --system bozo-panel
install -d -o bozo-derleme -g bozo-panel -m 0710 /var/lib/bozo-derleme
# setgid: dosyalar grubu alır; sticky: web süreci yalnız kendi dosyasını (istek) silebilir
install -d -o bozo-derleme -g bozo-panel -m 3770 /var/lib/bozo-derleme/panel
install -d -o bozo-derleme -g bozo-derleme -m 0700 /var/lib/bozo-derleme/.ssh
install -d -o bozo-derleme -g bozo-derleme -m 0750 /var/lib/bozo-derleme/depo
# Konteyner ile ExecStopPost= arasında paylaşılan sahiplik izi (TMPDIR)
install -d -o bozo-derleme -g bozo-derleme -m 0700 /var/lib/bozo-derleme/tmp
# Derleme kullanıcısı zamanlanmış iş kuramaz (birim dışında süreci olmasın)
echo bozo-derleme >> /etc/cron.deny; echo bozo-derleme >> /etc/at.deny

# 2. Deploy key (sahibinin onayıyla GitHub'a eklenir)
sudo -u bozo-derleme ssh-keygen -t ed25519 -N '' -C bozo-derleme@arc -f /var/lib/bozo-derleme/.ssh/id_ed25519
cat /var/lib/bozo-derleme/.ssh/id_ed25519.pub
#    -> github.com/crimsoninnovate/bozo > Settings > Deploy keys > Add, "Allow write access" KAPALI
ssh-keyscan -t ed25519 github.com | sudo -u bozo-derleme tee /var/lib/bozo-derleme/.ssh/known_hosts
#    parmak izini GitHub'ın yayımladığıyla karşılaştır (docs.github.com > GitHub's SSH key fingerprints)

# 3. Depo (ilk derleme node_modules olmadığı için npm ci de çalıştırır)
sudo -u bozo-derleme sh -c 'umask 0027 && git clone --branch main git@github.com:crimsoninnovate/bozo.git /var/lib/bozo-derleme/depo'

# 4. Betikler ve birimler (yerelden: rsync -a sunucu/derleme/ plesk-206:/root/bozo-derleme-kaynak/)
install -d -o root -g root -m 0755 /opt/bozo-derleme
install -o root -g root -m 0755 /root/bozo-derleme-kaynak/{derle.sh,yukle.sh,ortak.sh,kap.sh,uyari.sh} \
  /opt/bozo-derleme/
# Derleme imajı; kimlikler ana makinedekiyle aynı olmalı (ssh ve git gerçek bir kullanıcı görür)
docker build --pull -t bozo-derleme:1 --build-arg UID=$(id -u bozo-derleme) \
  --build-arg GID=$(id -g bozo-derleme) /root/bozo-derleme-kaynak
install -o root -g root -m 0644 \
  /root/bozo-derleme-kaynak/bozo-{derleme.path,derleme.service,yukle.service,uyari.path,uyari.service} \
  /etc/systemd/system/
systemctl daemon-reload
systemd-analyze verify /etc/systemd/system/bozo-{derleme,uyari}.{path,service} /etc/systemd/system/bozo-yukle.service
systemctl enable --now bozo-derleme.path bozo-uyari.path

# 5. Fotoğraf dizini, skor sunucusunun kullanıcısına ait (birimde User= yoksa çıktı boştur, süreç root'tur)
OYUN_KULLANICISI=$(systemctl show -p User --value bozo-oyun); OYUN_KULLANICISI=${OYUN_KULLANICISI:-root}
echo "$OYUN_KULLANICISI"; id "$OYUN_KULLANICISI"    # boş satır ya da "no such user" ise burada dur
install -d -o "$OYUN_KULLANICISI" -m 0755 /var/lib/bozo-oyun /var/lib/bozo-oyun/foto
# arc'ta SELinux zorlayıcı: nginx (httpd_t) var_lib_t okuyamaz, etiket yoksa /foto/ 403 verir
semanage fcontext -a -t httpd_sys_content_t "/var/lib/bozo-oyun(/.*)?"
restorecon -Rv /var/lib/bozo-oyun

# 6. Skor sunucusuna iki dizini ver: systemctl edit bozo-oyun (drop-in)
#    [Service]
#    Environment=FOTO_DIZINI=/var/lib/bozo-oyun/foto
#    Environment=DERLEME_DIZINI=/var/lib/bozo-derleme/panel
#    SupplementaryGroups=bozo-panel
#    ReadWritePaths=/var/lib/bozo-oyun/foto /var/lib/bozo-derleme/panel
systemctl restart bozo-oyun
```

`ReadWritePaths=` yalnız `bozo-oyun` birimi `ProtectSystem=` kullanıyorsa etkilidir, yoksa zararsız.
`SupplementaryGroups=bozo-panel` web sürecine `panel/`'e yazma ve `durum.json`'u okuma (0640) yetkisi
verir; `/var/lib/bozo-derleme`'de yalnız geçiş (0710) açıktır. `depo/`, `cikti/` ve `derleme.log`
`bozo-derleme` grubunda 0750 / 0640'tır (`derle.sh` ve birim `UMask=0027`), web süreci onları ne
listeleyebilir ne okuyabilir. Root bu yolları yalnız `runuser` üzerinden okur, nginx hiç okumaz.

### nginx (`api.cigercibozo.com`, Plesk > Additional nginx directives)

arc'ta bu yönergeler Plesk veritabanında değil, doğrudan
`/var/www/vhosts/system/api.cigercibozo.com/conf/vhost_nginx.conf` içinde durur (9 Kasım 2026'da eklendi;
önceki dosya `/root/vhost_nginx.conf.api.2026-11-09.bak`).

Mevcut `location ~ ^/` vekil bloğunun **üstüne** eklenir. `^~` önekli konum düzenli ifadeli vekil
konumunu geçer; `=` tam eşleşme hepsini geçer. Fotoğraf adları içerik özetidir (aynı ad hiç değişmez),
bu yüzden bir yıllık `immutable` önbellek doğru. Dizin listesi yok, sembolik bağ izlenmez, kalıba
uymayan her ad 404. Bir konumdaki `add_header` üst düzeyden gelen bütün `add_header`'ları düşürür: önce
`curl -sI https://api.cigercibozo.com/tablo` ile sunucu düzeyindeki başlıklara bak (HSTS gibi), varsa
iki iç konuma da aynen ekle.

```nginx
location ^~ /foto/ {
    root /var/lib/bozo-oyun;
    autoindex off;
    disable_symlinks on;
    location ~ "^/foto/[0-9a-f]{16}\.webp$" {
        types { } default_type image/webp;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        add_header X-Content-Type-Options nosniff always;
        try_files $uri =404;
    }
    location ~ "^/foto/[0-9a-f]{16}\.jpg$" {
        types { } default_type image/jpeg;
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        add_header X-Content-Type-Options nosniff always;
        try_files $uri =404;
    }
    return 404;
}

# Gövde 3 MB'a kadar (FOTO_GOVDE_SINIRI); nginx varsayılanı 1 MB. Yalnız bu uç.
location = /yonetim/foto {
    client_max_body_size 4m;
    proxy_pass http://127.0.0.1:8402;
    proxy_set_header X-Forwarded-For $remote_addr;
    # mevcut location ~ ^/ bloğundaki diğer proxy_set_header satırları da buraya kopyalanır
}
```

Doğrulama: `nginx -t`; `curl -sI https://api.cigercibozo.com/foto/0123456789abcdef.webp` 404,
`/foto/` 404 (liste yok), `/foto/0123456789abcdef.png` 404; panelden bir fotoğraf yükledikten sonra adresi
`200`, `content-type: image/webp` (ya da `image/jpeg`) ve `cache-control: ... immutable` döner. nginx başka
kullanıcıyla çalışır: `foto.ts` her dosyayı umask'tan bağımsız 0644 yazar; `stat -c '%a %U' /var/lib/bozo-oyun/foto/*`
`644` göstermeli ve dizinler 0755 olmalı, yoksa adres 403 verir.

### Deneme ve işletme

```bash
systemctl start bozo-derleme.service            # istek dosyası olmadan da bir derleme
journalctl -u bozo-derleme -u bozo-yukle -u bozo-uyari -n 50  # birimlerin sonucu; yükleme çıktısı da burada
tail -n 50 /var/lib/bozo-derleme/derleme.log     # derleme çıktısı
cat /var/lib/bozo-derleme/panel/durum.json
```

- Yükleme bekçisi: `cikti/` içinde `index.html`, `favicon.svg`, `sosyal-kart.jpg`, `marka/rozet.svg`
  ya da `foto/tane-yakin-cekim.webp` yoksa hiçbir şey yüklenmez (9 Kasım 2026 kazası). Siteden bu
  dosyalardan biri bilerek kaldırılırsa `yukle.sh`'taki `BEKCI` listesi de güncellenir.
- Zaman aşımları: derleme 40 dk (`TimeoutStartSec`, kilit beklemesi en çok 15 dk dahil), yükleme 15 dk.
  Aşılırsa `durum.json` `hata` olur ve panel yeniden denemeye izin verir.
- `bozo-derleme.service` art arda hızlı düşerse (betik eksik gibi) systemd başlatma sınırına takılır;
  sebebi giderip `systemctl reset-failed bozo-derleme.service bozo-derleme.path`.
- `bozo-yukle.service` `NoNewPrivileges=yes` taşır; `plesk repair fs` bundan etkilenirse (SELinux
  geçişi gibi) ilk bakılacak yer burası.
- İmaj güncellemesi (Node yaması, `Dockerfile` değişikliği): kurulumdaki `docker build` satırı yeniden çalıştırılır.
  Zaman aşımında `docker` istemcisi öldürülürse konteyner kalabilir; birim `ExecStopPost=` ile `docker rm -f
  bozo-derleme-kap` çalıştırır.
- Hata e-postası `sendmail` ile değil, `127.0.0.1:25` üzerinden SMTP ile gider: Plesk'in DKIM imzası yalnız
  `smtpd_milters`'ta, `non_smtpd_milters` boş. Ayrıca `/usr/sbin/sendmail` sunucu yöneticisinin
  `postfix-sendmail-wrapper` betiğine bağlı ve bu betik hata verse de 0 ile çıkıyor (9 Kasım 2026'da denendi).
  Gönderim düşerse birim başarısız olur ve iz yazılmaz; sonraki `durum.json` değişikliği aynı hatayı yeniden
  dener. Alıcıyı değiştirmek için birimdeki `UYARI_ALICI` değiştirilir, boş bırakılırsa e-posta kapanır.
- Geri alma: `systemctl disable --now bozo-derleme.path`. Düğme istek yazmaya devam eder, derleme
  başlamaz; site `npm run yayinla` ile elle yayınlanır, ikisi aynı httpdocs'u aynı sahiplerle yazar.

## Yayındaki gizlilik metninin kaynağı

Değişen alanlar. Diğerleri (sorumlu, haklar, onayı geri alma, başvuru) aynen kalır, yalnız
`guncellemeMetni` tarihi yenilenir. Kaynak: `docs/specs/2026-10-08-oyun-design.md` §8.

**TR**

- `girisMetni`: "Bu sayfa, Ciğerci Bozo web sitesinde hangi verinin, neden ve hangi hukuki dayanakla
  işlendiğini anlatır. Sitede kimlik, adres veya ödeme bilgisi istenmez. Açılış oyununda isteğe bağlı
  bir takma ad girilebilir."
- `amacMetni`: "İki ayrı amaç var. Birincisi ziyaret ölçümü: hangi sayfanın açıldığı, ziyaretin süresi,
  yönlendiren adres, cihaz türü ve ülke düzeyinde konum. İkincisi oyun sıralaması: oyuna katılırsanız
  takma adınız, puanlarınız ve oyun kaydınız haftalık sıralamayı ve ödülü yönetmek için işlenir. Reklam
  yapılmaz, profil çıkarılmaz, veri satılmaz."
- `yontemMetni` (ek cümle): "Sıralamaya katılırsanız takma adı siz yazarsınız; oyun kaydı ve tarayıcı
  anahtarınızın özeti oyun sırasında otomatik oluşur. Gerçek ad, telefon ve e-posta istenmez."
- `dayanakMetni` (ek cümle): "Sıralamaya katılım da açık onaya dayanır: 'Kaydet ve Katıl' düğmesine
  basmadıkça sunucuya hiçbir kişisel veri gitmez. Oyunu katılmadan oynamak mümkündür."
- `aliciMetni` (ek cümle): "Oyun verisi, işletmenin barındırma sağlayıcısı DH Bulut Bilişim'in İstanbul'daki
  sunucusunda tutulur. Takma adınız ve puanınız herkese açık sıralamada görünür."
- `aktarimMetni` (ek cümle): "Oyun verisi KKTC dışında, Türkiye'deki sunucuda tutulur. Bu aktarım, Yasa'nın
  11'inci maddesinin (2)'nci fıkrasının (A) bendi uyarınca 'Kaydet ve Katıl' düğmesiyle verdiğiniz açık
  onaya dayanır."
- `saklamaMetni` (son cümle yerine): "Oyun sunucusunda şunlar tutulur: takma ad, tarayıcı anahtarının
  özeti, onayınızın zamanı, turlarınız. Haftanın ilk yirmisi dışındaki turların dokunuş kaydı puan
  hesaplanınca silinir; ilk yirminin kaydı dönem bitiminden 30 gün sonra; hesabınız son turdan 90 gün
  sonra silinir. 'Hesabımı Sil' düğmesi kaydı anında siler."
- `haklarMetni` (ek cümle): "Oyun hesabınızı sıralama sayfasındaki 'Hesabımı Sil' düğmesiyle kendiniz
  silebilirsiniz."

**EN** (aynı sıra ve içerik)

- `girisMetni`: "This page explains what data the Ciğerci Bozo website processes, why, and on what legal
  basis. The site asks for no identity, address or payment details. In the opening game you may enter an
  optional nickname."
- `amacMetni`: "There are two separate purposes. First, visit measurement: which page opened, visit length,
  referrer, device type and country-level location. Second, the game leaderboard: if you join, your
  nickname, scores and play record are processed to run the weekly ranking and prize. No advertising, no
  profiling, no sale of data."
- `yontemMetni` (extra sentence): "If you join the leaderboard you type the nickname yourself; the play
  record and a digest of your browser key are created automatically during play. No real name, phone number
  or email is asked."
- `dayanakMetni` (extra sentence): "Joining the leaderboard also rests on explicit consent: no personal data
  goes to the server until you press 'Save and Join'. You can play without joining."
- `aliciMetni` (extra sentence): "Game data is kept on the Istanbul server of the business's hosting
  provider, DH Bulut Bilişim. Your nickname and score appear in the public leaderboard."
- `aktarimMetni` (extra sentence): "Game data is kept outside the TRNC, on a server in Türkiye. This transfer
  rests on the explicit consent you give with the 'Save and Join' button, under Article 11(2)(A) of the
  Law."
- `saklamaMetni` (replaces the last sentence): "The game server keeps: your nickname, a digest of your browser
  key, the time of your consent, and your rounds. The input record of rounds outside the week's top twenty
  is deleted once the score is computed; the top twenty's record 30 days after the period ends; your account
  90 days after your last round. The 'Delete My Account' button deletes the record immediately."
- `haklarMetni` (extra sentence): "You can delete your game account yourself with the 'Delete My Account'
  button on the leaderboard page."

Hukukçu incelemesi istenmedi; açık kalan sorular sahibinin bilgisi için: (a) Md. 8 bildirimi ve Md. 11 Transfer Ruhsatı oyun verisi için de gerekli mi;
(b) tarayıcı anahtarının özeti ve dokunuş kaydı kişisel veri sayılıyor mu (taslak sayıyor, tedbirli);
(c) "Hesabımı Sil" düğmesinin adı ve yeri metindekiyle aynı mı (`content/*/oyun.ts` > `siralama`).
