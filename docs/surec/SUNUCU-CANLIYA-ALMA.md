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

Şema değişince (`sema.sql` yalnız `CREATE TABLE IF NOT EXISTS`, tekrar uygulamak zararsız), servisi
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
"Beni hatırla") `bitisMs.HMAC(GIZLI_TUZ, kullanici:sifre:bitisMs)` biçimindedir: durumsuz, 30 gün geçerli;
`YONETIM_SIFRE`, `YONETIM_KULLANICI` ya da `GIZLI_TUZ` değişince hepsi düşer (iptal yolu budur). Site her build öncesi son sürümü
çeker (`scripts/menuCek.ts`, `content/menu.canli.json`); panelden yayın siteyi kendiliğinden yeniden
basmaz, elle build ve deploy gerekir (Aşama 2 yapılmadı). Menü sayfası ise tarayıcıda `GET /menu`'yü
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
