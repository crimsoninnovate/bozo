# Ciğerci Bozo web sitesi · mimari spec

Tarih: 11 Ağustos 2026 · Durum: onaylandı

## 1. Bağlam

Girne'de (KKTC) açılacak Urfa usulü ciğer restoranının web sitesi. Tasarım çalışması bitti;
bu spec, tasarımın Next.js projesine hangi yapıyla taşınacağını tanımlar.

### Kaynak dosyalar ve otorite sırası

| Kaynak | Konum | Otorite |
|---|---|---|
| Tasarım handoff | `../design_handoff_bozo_website/` | Görünüm ve davranışta **kesin**. `.dc.html` dosyaları esas kaynak, `screenshots/` yardımcı. |
| Marka kararları | `../design_handoff_bozo_website/marka/` | Renk, tipografi, logo, yasaklar |
| Tasarım brief | `../Cigerci-Bozo-Claude-Design-Brief.md` | İçerik blokları (§12), yazım kuralları (§3), yasaklar (§10) |
| Proje bilgi dosyası | `../Cigerci-Bozo-proje-bilgi-dosyasi-v2.md` | Doğrulanmış işletme gerçekleri |
| Yapılacaklar listesi | `../Cigerci-Bozo-yapilacaklar-listesi.md` | Bölüm 5, site teslim kalemleri |

Çelişki halinde `marka/` dosyaları brief'i günceller (örnek: Oswald yerine Bricolage Grotesque,
amber `#E8A33D` yerine tangerine `#FAAA1F`). Handoff README bu güncellemeleri zaten içerir.

## 2. Kararlar

| Karar | Seçim | Gerekçe |
|---|---|---|
| Framework | Next.js 16.3 App Router, React 19.2, TypeScript strict | Handoff'un önerdiği yön; metadata, sitemap ve route yapısı hazır gelir |
| Çıktı | `output: 'export'` statik, `images.unoptimized: true` | Yayın hedefi researchos-server üzerinde Caddy `file_server`; sunucu runtime'ı yok |
| i18n | İki root layout: `(tr)` kökte, `(en)/en` alt ağacında; sözlük modülleri | Statik export'ta middleware çalışmaz; next-intl'in `localePrefix: 'as-needed'` düzeni middleware ister. Bu yapı TR'yi kökte tutar, her dile doğru `<html lang>` verir ve bağımlılık eklemez |
| Stil | CSS Modules + `styles/tokens.css` | Tasarımdaki kesin değerler (`clamp(60px,10.4vw,168px)`, `.5/.58/.62` opaklık skalası) okunur kalır ve handoff'a karşı 1:1 denetlenebilir |
| Yayın | researchos-server, statik | Regulus ve oykualemdar kalıbı |
| Runtime bağımlılığı | `next`, `react`, `react-dom` | Animasyon kütüphanesi yok: tasarımdaki hareket CSS keyframes + `requestAnimationFrame` |

### Statik export'un getirdiği kısıtlar

Middleware, Server Actions, intercepting routes ve varsayılan image optimizer kullanılamaz.
Formlar sunucuya post edemez; rezervasyon ikinci fazda WhatsApp yönlendirmesi ve `mailto` ile çözülür.

### Çoklu root layout ve 404

Kök `app/layout.tsx` yoktur; `<html>` etiketini iki route group layout'u basar. Bu düzende
sıradan bir `app/not-found.tsx` sarmalanacak kök layout bulamaz ve `out/404.html` dosyasını
`<html>`, `<body>` ve stylesheet olmadan üretir. Ölçülerek doğrulanmıştır.

Çözüm: `experimental.globalNotFound: true` ve kendi `<html>` iskeletini taşıyan
`app/global-not-found.tsx`. Bu bayrak deneyseldir; kaldırılırsa geri dönüş yolu tek root layout
(`<html lang="tr">`) ve EN içeriğinin `<div lang="en">` ile sarmalanmasıdır. `hreflang` etiketleri
her iki durumda da doğru kalır.

## 3. Kapsam

**Bu sürüm:** Ana sayfa, Menü, Hikaye, Konum (tasarımı hazır dört sayfa) + 404 + Gizlilik,
TR ve EN olmak üzere iki dilde.

**Kapsam dışı (bilinçli):** Galeri (fotoğraf çekilmedi), Rezervasyon (telefon ve WhatsApp numarası yok),
CMS, Tailwind, animasyon kütüphanesi, e2e test altyapısı.

## 4. Rotalar

| TR | EN | Kaynak tasarım |
|---|---|---|
| `/` | `/en` | Ana Sayfa Alternatif.dc.html |
| `/menu` | `/en/menu` | Menu Sayfasi.dc.html |
| `/hikaye` | `/en/hikaye` | Hikaye Sayfasi.dc.html |
| `/konum` | `/en/konum` | Konum Sayfasi.dc.html |
| `/gizlilik` | `/en/gizlilik` | yeni, marka sesiyle |
| 404 | 404 | yeni, marka sesiyle, tek ölçülü espri |

EN rotalarında da yol adları Türkçe kalır (`/en/menu`, `/en/hikaye`). Gerekçe: tek rota tablosu,
tek sitemap, karışıklık yok; İngilizce ziyaretçi için yol adı bir okuma yükü değil.

`Mobil Prototip.dc.html` bir rota değil, mobil davranış referansıdır (390px, sabit alt eylem barı).

## 5. Dizin yapısı

```
Web/
  app/
    (tr)/layout.tsx             # <html lang="tr">, font, tokens, JSON-LD
    (tr)/page.tsx  menu/  hikaye/  konum/  gizlilik/
    (en)/layout.tsx             # <html lang="en">
    (en)/en/page.tsx  en/menu/  en/hikaye/  en/konum/  en/gizlilik/
    global-not-found.tsx        # kendi <html>/<body> iskeletini taşır
    globals.css
    sitemap.ts
    robots.ts
  components/
    layout/    UstBar  AltBilgi  MobilAksiyonBari  BeadRay
    ember/     KorSahnesi  DumanKatmani  ImlecKoru
    ui/        Buton  DurumCipi  SayiVurgu  FotoYuvasi  TaneDizilimi  Bolum
    saat/      CanliSaat  VardiyaSeridi  SaatTablosu
    sayfa/     AnaSayfa  MenuSayfasi  HikayeSayfasi  KonumSayfasi  GizlilikSayfasi
  content/
    tr/        index.ts  ortak.ts  ana.ts  menu.ts  hikaye.ts  konum.ts  gizlilik.ts  hata.ts
    en/        aynı dosyalar
    isletme.ts  urunler.ts  fotograflar.ts  types.ts
  lib/         saat.ts  site.ts  jsonld.ts
  styles/      tokens.css  reset.css  animasyonlar.css
  public/      fotograflar/  logo/
  docs/specs/
```

`components/sayfa/*` dile bağımsızdır: sözlüğü prop olarak alır, içinde sabit metin bulunmaz.
`app/en/menu/page.tsx` gibi dosyalar yalnızca paylaşılan gövdeyi EN sözlüğüyle çağırır.

Dosya boyutu: bileşen başına 700 satır tavanı, fonksiyon başına 50 satır. Ana sayfa yedi bölümdür;
her bölüm kendi bileşeni olur, tek dosyada toplanmaz.

## 6. Adlandırma kuralı

Marka terminolojisi kilitli ve Türkçedir (tane, ikram, ocak, usta, sofra, kor). Bu yüzden:

- **Alan kavramları Türkçe:** `TaneDizilimi`, `KorSahnesi`, `FotoYuvasi`, `urunler.ts`, `data-yogunluk`
- **Teknik iskele İngilizce:** `lib/`, `components/`, `content/`, `types.ts`, `layout.tsx`
- Kullanıcıya görünen rota adları Türkçe, iki dilde de aynı

Türkçe tanımlayıcılarda ASCII kullanılır (`FotoYuvasi`, `Cigerci` değil `Ciğerci` yalnızca metinde).

## 7. İçerik katmanı sözleşmesi

Hiçbir metin, fiyat, saat veya iletişim bilgisi JSX içinde sabit yazılmaz.

### Sözlük tipi

`content/tr/index.ts` sayfa modüllerini tek nesnede toplar; `content/types.ts` tipi ondan türetir:

```ts
import { tr } from './tr'
export type Sozluk = typeof tr
```

`content/en/index.ts` bu tipe uyar (`export const en: Sozluk = { ... }`); eksik veya fazla anahtar
derleme hatası verir. Handoff'taki `data-en`
değerleri EN sözlüğünün kaynağıdır, çeviri yeniden üretilmez.

### İşletme verisi

`content/isletme.ts` tek gerçek kaynak: adres, koordinat, saat aralığı, telefon, WhatsApp, Instagram,
e-posta. Henüz bilinmeyen alanlar `null` tutulur. UI kuralı: `null` olan alan yer tutucu metnini
gösterir (`000 000 00 00`) ve bağlantısı devre dışı bırakılır, `href` üretilmez.

### Ürünler

`content/urunler.ts`: Ocaktan beş ürün, ikramlar, içecekler. Fiyat alanı `number | null`;
`null` iken `000 TL` basılır. İkramlarda fiyat yerine "ikram" ibaresi kullanılır, bu bir fiyat
değeri değil ayrı bir tiptir.

### Fotoğraflar

`content/fotograflar.ts` çekim listesi manifestidir: `{ id, etiket, oran, dosya? }`.
`dosya` yoksa `FotoYuvasi` köşe işaretli koyu plakayı ve kadraj etiketini basar; varsa `next/image`
render eder. Çekimler geldiğinde yalnızca bu dosyaya yol yazılır, hiçbir JSX değişmez.
Yapay zeka ile üretilmiş yemek görseli kullanılmaz (marka yasağı).

## 8. Saat çekirdeği · `lib/saat.ts`

Projenin tek gerçek iş kuralı. Saf fonksiyonlar, `Date` argümanı dışarıdan verilir.

- Zaman dilimi `Europe/Nicosia`
- `acik = saat >= 10 || saat < 5`
- `gece = 1 <= saat < 5`
- Gösterim günü: 05:00 öncesi **bir önceki** günün adı yazılır (gün aşan kapanış)
- Kapalıyken durum metni "Şu an kapalıyız, 10:00'da açılıyoruz", nokta gri

Sunucu ile istemci saatinin farkı hydration uyuşmazlığı üretir. Çözüm: canlı saat gösteren
bileşenler `'use client'`, ilk render'da yer tutucu basar, gerçek değeri `useEffect` sonrası verir.

Birim testleri (`node:test`) sınırları kapsar: 00:00, 01:00, 04:59, 05:00, 09:59, 10:00, 23:59.

## 9. Tasarım paritesi

Renk, tipografi, aralık, hover durumu ve animasyon değerleri handoff'ta kesindir ve birebir uygulanır.
`styles/tokens.css` bu değerlerin tek kaynağıdır; bileşenler ham hex yazmaz.

Kilitli kurallar:
- Kor `#B7351C` hiçbir zeminde gövde metni değildir
- Tangerine `#FAAA1F` ile kor büyük alanda yan yana gelmez
- Pumpkin `#E96112` yalnız paket servis hattında
- Köşe yarıçapı 0-3px, gövde metni 16px altına inmez

Kor sahnesi tek sabit katmandır; her `<section>` bir `data-yogunluk` katsayısı taşır
(1 / 0.55 / 0.4 / 0.7 / 1.25 / 0.45 / 0.3) ve scroll'da `rAF` ile opaklık `0.3 + y*0.7`,
ölçek `0.9 + y*0.16` hesaplanır.

`prefers-reduced-motion: reduce` tüm animasyon ve geçişleri kapatır, içerik doğrudan görünür.

## 10. Logo

Logo onay bekliyor. Şu an tasarımdaki geçici kilit kullanılır: tane dizilimi (kare-küçük kare ritmi)
+ "Ciğerci Bozo" kelime markası. `components/ui/TaneDizilimi` boyut prop'u alır ve indirgeme
merdivenini uygular: 96px+ tam kilit, 40px üç tane, 24px çubuk incelir, 16px iki ciğer tanesi.
Logo onaylanınca yalnız bu bileşenin içi SVG ile değişir.

## 11. SEO ve yapısal veri

- Sayfa başına `metadata`, TR ve EN ayrı başlık ve açıklama
- `hreflang` tr / en / x-default
- `app/sitemap.ts` ve `app/robots.ts`
- Restaurant JSON-LD: ad, adres, coğrafi konum, `servesCuisine`, `openingHoursSpecification`.
  Gün aşan saat `opens 10:00 / closes 05:00` olarak yazılır; kapanışın açılıştan küçük olması
  ertesi güne taşmayı ifade eder
- Alan adı henüz alınmadı; `lib/site.ts` içinde tek `baseUrl` sabiti, alan adı gelince tek satır değişir

## 12. Erişilebilirlik

- Dokunma hedefleri en az 44px
- Kontrast WCAG AA; ölçülen oranlar `tokens.css` içinde yorum olarak tutulur
- Dil geçişi metin olarak TR / EN, bayrak ikonu yok
- `lang` niteliği rota diline göre; EN sayfalarda `alcohol-free` bilgisi görünür
- Kor sahnesi ve duman katmanı `aria-hidden`

## 13. Doğrulama

1. `npm run build` statik export hatasız üretir
2. `lib/saat.ts` birim testleri geçer
3. Her sayfa `design_handoff_bozo_website/screenshots/` ile görsel olarak karşılaştırılır
4. Mobil 390px genişlikte `Mobil Prototip.dc.html` davranışıyla karşılaştırılır
5. `prefers-reduced-motion` açıkken animasyon kalmadığı doğrulanır

## 14. İşletmeden beklenen veriler

Fiyatlar, telefon, WhatsApp, Instagram hesabı, e-posta, dalak ve yürek porsiyon detayı,
gece menüsü kalemleri, içecek listesinin tamamı, Urfa'dan Girne'ye hikaye metni, fotoğraflar,
onaylı logo, alan adı.

Hepsi yer tutucuyla geçilir ve tek dosyadan doldurulacak biçimde tutulur.
