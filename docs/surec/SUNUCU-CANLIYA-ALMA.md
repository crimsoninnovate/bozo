# Skor sunucusunu canlıya alma

Oyunun skor sunucusu (`sunucu/`) canlıya alınırken sırayla geçilecek kapılar. 10 Ekim 2026'da sahibi
"sunucuyu canlıya al" kararını verdi; bu belge o kararın adımlarıdır. Her üretim adımı yine kendi
onayıyla yapılır (`plans/2026-10-08-oyun-plan-3-sunucu.md` > Yayın engeli).

## Kapılar

| # | Kapı | Kim | Durum |
|---|---|---|---|
| 1 | Gizlilik metni (TR/EN), bu belgedeki taslak | hukukçu onayı | **taslak hazır, onay bekliyor** |
| 2 | KKTC 89/2007 Md. 8 bildirimi ve Md. 11 Transfer Ruhsatı | sahibi / hukukçu | `content/tr/gizlilik.ts` başındaki not: kodla çözülmez |
| 3 | `api.cigercibozo.com` DNS | sahibi (Cloudflare) | **tamam** (10 Ekim 2026): Cloudflare üzerinden arc'a çözülüyor; Plesk'te `api` alt alanı yok, varsayılan sayfa yanıtlıyor |
| 4 | Plesk altyapısı: alt alan, veritabanı, Node 24, ortam değişkenleri | Claude, sahibi onayıyla | yapılmadı |
| 5 | Sitenin yeniden derlenip yayınlanması (gizlilik metni + oyun) | Claude, sahibi onayıyla | 1. kapıdan sonra |

Sıra: **1 ve 2 bitmeden 4 ve 5 yapılmaz.** Yayındaki oyun `/api/tablo` yanıt verir vermez giriş
ekranında ad alanını gösterir, yani 4. adım tek başına veri toplamayı başlatır. Gizlilik sayfası yayında "site sunucuda veri saklamaz" derken
sunucu veri alırsa metin yanlış olur.

## Sunucunun durumu (10 Ekim 2026, salt okunur bakıldı)

arc (`plesk-206`): AlmaLinux 8.10, Plesk Obsidian 18.0.77, MariaDB 10.11.19, Git ve Node.js eklentisi
kurulu. Sistem `node` v20.20.2; Plesk'in Node sürümleri `/opt/plesk/node/{20,21,24}`. Oyun sunucusu
`engines: node >=24` ister, yani Plesk'in 24'ü kullanılır. `api.cigercibozo.com` şimdi 303 ile
`/login.php`'ye yönleniyor: Plesk'in varsayılan sitesi yanıtlıyor, API değil.

## 4. Altyapı adımları (onaydan sonra, root, `plesk-206`)

1. Alt alan: `plesk bin subdomain --create api -domain cigercibozo.com -www-root api.cigercibozo.com`.
   Let's Encrypt sertifikası Plesk'ten; Cloudflare SSL modu Full (strict) olmalı.
2. Veritabanı: `plesk bin database --create bozo_oyun -domain cigercibozo.com -type mysql`, ayrı kullanıcı
   (yalnız bu veritabanında yetkili, rastgele 32 karakter parola), ardından
   `mariadb bozo_oyun < sunucu/sema.sql`.
3. Kod: derleme yerelde (`npm ci && npm run build -w sunucu`), `sunucu/dist/`, kökteki `package.json` ve
   `sunucu/package.json` ile birlikte `/var/www/vhosts/cigercibozo.com/oyun-sunucu/` altına rsync;
   orada `npm ci --omit=dev -w sunucu` Plesk'in Node 24'üyle. Sahip `engincaglar:psacln`, siteyle aynı kural.
4. Çalıştırma: systemd birimi (Node 24, `127.0.0.1:8402`) ve alt alanın nginx ek yönergesinde
   `location / { proxy_pass http://127.0.0.1:8402; }`. Plesk'in Passenger tabanlı Node arayüzü ESM
   (`"type": "module"`) başlangıç dosyasıyla denenmedi; çalışırsa o yola geçilebilir.
5. Ortam: `GIZLI_TUZ` (rastgele, ödül kodu HMAC'i, yedeklenir), `KOKEN=https://cigercibozo.com`,
   `DB_URL=mariadb://...@127.0.0.1:3306/bozo_oyun`, `YONETIM_KULLANICI` / `YONETIM_SIFRE`,
   `GUVENILIR_VEKIL` (nginx ve Apache atlaması, README'deki uyarı), `KAMPANYA_BITIS`. Birim dosyası
   `0600` ve yalnız root okur; repoya girmez.
6. Doğrulama: `curl https://api.cigercibozo.com/api/tablo` 200 ve JSON; sahte `CF-Connecting-IP`
   doğrudan kaynağa gönderilince yok sayılmalı (hız sınırı ortak kalmasın); `/yonetim/*` kimliksiz 401.

Geri alma: systemd birimini durdur, alt alanın nginx yönergesini sil. Site `/oyun` çevrimdışı tura
döner (tablo isteği düşer, ad alanı gizlenir); veri gitmez.

## 5. Site tarafı

`content/{tr,en}/gizlilik.ts` aşağıdaki metne göre güncellenir, `npm run build`, README > Deploy
(iki `chown`, `plesk repair fs`, sağlama toplamlı kuru çalıştırma). Katılım ekranının (`KatilimEkrani`)
onay cümlesi Md. 11(2)(A) açık onayıdır; gizlilik metni onunla çelişmemeli.

## Gizlilik metni taslağı (hukukçuya)

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

Hukukçuya açık sorular: (a) Md. 8 bildirimi ve Md. 11 Transfer Ruhsatı oyun verisi için de gerekli mi;
(b) tarayıcı anahtarının özeti ve dokunuş kaydı kişisel veri sayılıyor mu (taslak sayıyor, tedbirli);
(c) "Hesabımı Sil" düğmesinin adı ve yeri metindekiyle aynı mı (`content/*/oyun.ts` > `siralama`).
