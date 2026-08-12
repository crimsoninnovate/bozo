# Yayın kontrol listesi

Site yayına çıkmadan önce kapanması gerekenler ve çıktıktan hemen sonra koşulacak
duman testi. Sunucu yapılandırmasının kendisi burada tekrarlanmaz, tek kaynağı
`README.md` > Publishing.

Son güncelleme: 12 Ağustos 2026.

## Bugünkü zemin

`npm run build` temiz, 15 HTML dosyası, `out/` 3.1 MB. 84 test geçiyor, typecheck
temiz. On iki gezilebilir rota (altı Türkçe, altı İngilizce) artı `sitemap.xml`,
`robots.txt` ve 404.

## Yayından önce kapanması gerekenler

| # | Madde | Nerede | Durum |
|---|---|---|---|
| 1 | Alan adı alınmış ve DNS sunucuya bakıyor | `lib/site.ts` > `SITE_URL` | `cigercibozo.com` **varsayılıyor**, alınmadı |
| 2 | Site ikonu | `app/icon.svg` + `app/apple-icon.png` | **Dosya yok.** Her sayfada konsola favicon 404'ü düşüyor; yerelde doğrulandı |
| 3 | Caddy `handle_errors` bloğu sunucuda | `README.md` > Publishing | Blok yazıldı, **canlıda doğrulanmadı** |
| 4 | Uydurulmuş veri yok | `content/` | Sağlanıyor: fiyat, telefon, WhatsApp, e-posta, Instagram, koordinat hâlâ `null` ve arayüz yer tutucu basıyor |

**2. maddenin engeli veri değil karar.** Marka paketinde (`design_handoff_bozo_website/marka/`)
çizilmiş logo dosyası yok, yalnız iki markdown ve işaretin sözle tarifi var
("şiş kilidi"). Geçici emoji ya da jenerik ikon konmadı; onaylı işaret gelince
Next iki dosyayı kendisi bağlar.

**3. maddenin sebebi:** `file_server` bilinmeyen bir yolda `out/404.html`'i değil
kendi boş 404'ünü döndürür. Blok olmadan tasarlanmış 404 sayfası yayında hiç
görünmez. Aşağıdaki duman testinin ikinci adımı tam olarak bunu ölçer.

## Yayından sonra: duman testi

Repo kökünden koşulur (dördüncü adım `out/` içindeki dosya adını okur, o ad her
derlemede değişir). `ALAN`'ı gerçek alan adıyla değiştir.

```bash
ALAN=https://cigercibozo.com

# 1. On iki rota da 200 dönmeli
for y in / /menu/ /galeri/ /hikaye/ /konum/ /gizlilik/ \
         /en/ /en/menu/ /en/galeri/ /en/hikaye/ /en/konum/ /en/gizlilik/; do
  printf '%-18s %s\n' "$y" "$(curl -s -o /dev/null -w '%{http_code}' "$ALAN$y")"
done

# 2. Bilinmeyen yol: durum 404 VE tasarlanmış sayfanın gövdesi
curl -s -o /dev/null -w 'durum: %{http_code}\n' "$ALAN/boyle-bir-sayfa-yok/"
curl -s "$ALAN/boyle-bir-sayfa-yok/" | grep -c 'Bu sayfa ocakta yok'

# 3. Bitiş eğik çizgisiz yol
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' "$ALAN/menu"

# 4. Adında ! olan RSC yükü sunuluyor mu
RSC=$(ls out/menu | grep '^__next\.!' | head -1)
curl -s -o /dev/null -w "$RSC : %{http_code}\n" "$ALAN/menu/$RSC"

# 5. Arama motoru dosyaları ve ikon
curl -s -o /dev/null -w 'sitemap:%{http_code} ' "$ALAN/sitemap.xml"
curl -s -o /dev/null -w 'robots:%{http_code} '  "$ALAN/robots.txt"
curl -s -o /dev/null -w 'favicon:%{http_code}\n' "$ALAN/favicon.ico"
```

Beklenen çıktı ve okuması:

| Adım | Beklenen | Sapma ne demek |
|---|---|---|
| 1 | on iki satırın hepsi `200` | eksik rota: `out/` eksik kopyalanmış |
| 2 | `durum: 404` ve ardından `1` | `1` yerine `0`: `handle_errors` bloğu yok, misafir boş 404 görüyor |
| 3 | `301 -> .../menu/` ya da `200` | `404`: `trailingSlash` ile sunucunun dizin davranışı çakışıyor |
| 4 | `200` | `403`/`404`: sunucuda olağandışı dosya adlarını eleyen bir kural var; **sayfalar tek tek açılır ama sayfa içi gezinme kırılır**, iyi saklanan bir arıza |
| 5 | `sitemap:200 robots:200 favicon:200` | `favicon:404`: 2. madde hâlâ açık |

Bu probe'ların beşi de 12 Ağustos 2026'da yerel export üstünde (`npm run preview`)
koşuldu ve beklenen değerleri verdi; tek istisna `favicon:404`, o da yukarıdaki
açık madde. Yani liste canlıda ilk kez koşarken kendi doğruluğu sorun değil.

## Demo yayını: bozo.crimsoninnovate.com

12 Ağustos 2026'da sahibi demo için researchos sunucusuna kurulum istedi. Yapılan
ve kalan:

- **Yapıldı:** derleme `researchos-server:/srv/enliq/bozo/out` altına yüklendi
  (3.0 MB, 15 HTML). Caddy blok adayı `/tmp/bozo-aday.Caddyfile` içinde duruyor,
  `caddy validate` ile tam yapılandırmaya karşı doğrulandı ve **canlı Caddyfile'a
  yazılmadı**.
- **Engel: DNS başka sunucuyu gösteriyor.** `bozo.crimsoninnovate.com` ve
  `crimsoninnovate.com` 185.210.92.206'ya çözülüyor; researchos sunucusu
  185.210.92.166. Blok bugün kurulsa Let's Encrypt HTTP-01 doğrulaması .206'ya
  gider, sertifika çıkmaz ve adres açılmaz. .206'ya devops anahtarıyla erişim yok.
- **Sahibi seçti (12 Ağustos 2026): A kaydı researchos'a çevrilecek.** Gereken tek
  kayıt:

  | Tip | Ad | Değer | Proxy |
  |---|---|---|---|
  | A | `bozo` (`bozo.crimsoninnovate.com`) | `185.210.92.166` | **kapalı** |

  Proxy'nin kapalı olması şart: Let's Encrypt HTTP-01 doğrulaması sunucuya
  doğrudan ulaşmak zorunda, Cloudflare turuncu bulut arkasında sertifika çıkmaz.

- **Kayıt değişince kalan iş bir dakika:** blok `/etc/caddy/Caddyfile`'a eklenir
  (önce yedek, sonra `caddy validate`, sonra `systemctl reload caddy`), ardından
  yukarıdaki duman testi canlı adrese karşı koşulur. Reload beş canlı siteyi
  (`pomobile.loodos.space`, `bigo.adelonlaw.com`, `api.loodos.space`,
  `vox.loodos.space`, `loodos.space`) etkilediği için doğrulama adımı atlanmaz.
  Blok DNS'ten ÖNCE kurulmadı: Caddy başarısız ACME denemelerinde katlanarak
  geri çekilir, erken kurulum yayını hızlandırmaz, geciktirir.

Blok demo olduğu için `X-Robots-Tag: noindex, nofollow` taşıyor: derlemenin
canonical URL'leri ve `sitemap.xml`'i `cigercibozo.com`'u gösteriyor, demo
kopyasının indekslenmesi o adresle çakışırdı.

## Yayınla birlikte açılacak kararlar

- **Prefetch.** İlk yüklemede 344 KB indirilip atılıyor (6 iptal edilmiş istek);
  gerçekten kullanılan yük 176 KB. `prefetch={false}` bunu kapatır, sayfa
  geçişlerinin anındalığını götürür. Mobil veriyle gelen misafir için gerçek bir
  bedel. `IYILESTIRMELER.md`'de kayıtlı, sahibinin hız kararı.
- **`aria-disabled` telefon yer tutucuları.** Bugün WCAG 1.4.3 muafiyeti altında
  ihlal değil (2.62:1 ve 3.14:1). Numara `content/isletme.ts`'e girdiği an bu
  öğeler `<a>` olup etkinleşecek ve 4.5:1 gerekecek; doldurma turunda hepsi
  birlikte ölçülmeli.

## Bilinen ve kabul edilmiş çıktı davranışları

`/_not-found/` ve `/404/` de 200 döner. Üçü bayt bayt aynı, üçü de
`<meta name="robots" content="noindex">` taşır ve `sitemap.xml`'de geçmez, yani
indeksleme sızıntısı yok. Kayıtlı, düzeltilmedi.
