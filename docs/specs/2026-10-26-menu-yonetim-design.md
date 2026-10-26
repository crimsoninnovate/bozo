# Menü yönetim paneli ve canlı menü

Tarih: 26 Ekim 2026 · Durum: taslak. Sahibin yönergeleri sohbette alındı, yazılı onay yok; "benim
kararım" diye işaretli maddeleri kullanıcı henüz görmedi. Plan: `docs/plans/2026-10-26-menu-yonetim-plani.md`.

## Amaç

Fiyat ve menü metni değişikliği bugün koddan, build'den ve deploy'dan geçiyor. Restoranda yetkili
şifreyi bilen herkes bunu kendisi yapabilsin: teknik bilgi gerekmeden, hata yaparsa geri alabilerek.
Şimdilik yalnız menü; ilerde bölüm bölüm başka içerik de eklenebilir.

## Kullanıcının kararları

- Panele restorandaki yetkili şifreyle giren herkes girer ve değiştirir.
- Değişecekler: menü kalemlerinin adı ve alt açıklaması, fiyatlar, kalem ekleme ve çıkarma, içecek
  adı ve fiyatları (ekleme ve çıkarma dahil).
- Menü sayfası dinamik olur: kaydedince sayfa bekleme olmadan değişir. Arama motoru verisinin
  (JSON-LD, `llms.txt`) birkaç dakika geriden gelmesi kabul.
- Her kalem iki dilli; İngilizceyi de değişikliği yapan kişi girer.
- Hazır panel kiti aranıp uygunsa alınabilir; veritabanını sunucuda ben açabilirim.

## Benim kararlarım (kullanıcı görmedi)

- **Hazır kit alınmıyor.** Bulunanların hepsi Tailwind (shadcn şablonları, TailAdmin) ya da Material
  UI (react-admin) tabanlı; proje CSS framework'ünü mimari kararla dışarıda tutuyor. Refine arayüzden
  bağımsız ama bu sunucu için yine elle veri katmanı gerektirir. Panel mevcut personel ekranının
  yapısıyla (CSS Modules, `yonetimApiKur`) yazılır.
- **Aynı yetkili şifre.** Ödül kodunu kullanan kişi fiyat da değiştirebilir. Ayrı şifre sonra eklenebilir.
- **Tek belge, sürümlü.** Menü tek bir JSON belgesi; her yayın yeni sürüm olarak saklanır, geri alma
  eski sürümü yeni sürüm olarak yeniden yayınlar. Geçmiş sınırsız, panel son 20'yi listeler.
- **Eşzamanlı düzenleme:** kayıt `taban` sürüm numarasını taşır; sunucudaki son sürüm farklıysa 409,
  kimsenin değişikliği sessizce ezilmez.
- **Hata koruması:** yayından önce eski ve yeni değerleri yan yana gösteren onay ekranı; fiyat
  %50'den fazla değişirse kırmızı uyarı. Kesin ret: tam sayı olmayan, 1 altı ya da 99999 üstü fiyat.
- **Ciğer sabit:** menünün imza kalemi (`ciger`) silinmez ve ilk sırada kalır; sayfadaki "10 şiş / 3
  dakika" çipleri sözlükte kalır. Diğer kalemler eklenir, silinir, sıralanır.
- **Ana sayfa statik kalır.** Ana sayfa fiyat göstermiyor (sahip kararı, 13 Ağustos); adları ve
  açıklamaları `content/*/ana.ts`'te. Ana sayfa yalnız hem menüde hem ana sayfa sözlüğünde olan
  kalemleri basar; panelden eklenen kalem ana sayfada çıkmaz.
- **Fotoğraf yüklenmez.** Kalem mevcut `FotoId` listesinden birini seçer ya da fotoğrafsız kalır;
  fotoğrafsız kalem boş plaka göstermez (sahip kararı, 13 Ekim).
- **Gizlilik:** menü sayfası artık `api.cigercibozo.com`'a istek atıyor. Aynı işletmenin, sitenin
  zaten yayınlandığı sunucudur; yeni bir aktarım değil, ama gizlilik metni bunu söylemeli (plan T8).
- **Kapsam dışı:** bölüm başlıkları (`Ocakbaşı`, `İçecekler`), ikramlar, çip metinleri, ana sayfa
  metni, fotoğraf yükleme, kullanıcı başına hesap, otomatik yeniden build (Aşama 2).

## Mimari

- `lib/menu/`: belge tipleri, doğrulama, fark, düzenleme işlemleri. Siteyi de sunucuyu da besler,
  `lib/oyun/` gibi bağıl `.ts` importlarıyla.
- Başlangıç belgesi `content/menu.varsayilan.json` (bugünkü `urunler.ts` ve menü sözlüğünden
  üretilir). Build öncesi `scripts/menuCek.ts` canlı sürümü `content/menu.canli.json`'a (gitignore)
  çeker; bulunursa site onu, yoksa varsayılanı basar. Yerel bir deploy panelde girilen fiyatı bu
  yüzden ezmez.
- Skor sunucusu (`sunucu/`) tabloya `menu_surum` ekler ve dört uç: `GET /menu` (herkese açık, 15 sn
  önbellek, IP sınırı dışında: restoranın wifi'si tek IP), `GET /yonetim/menu`, `PUT /yonetim/menu`,
  `POST /yonetim/menu/N/geri-al`.
- Menü sayfası derlenmiş belgeyle basılır (arama motorları görür). Tarayıcıda sağlayıcı canlı belgeyi
  çeker, doğrular, farklıysa değiştirir. Çekilene kadar (en çok 1,5 sn) fiyatlar gizlenir, sunucu
  kapalıysa derlenmiş menü kalır.
- Panel `/yonetim/` (noindex, hiçbir yerden bağlantı yok), `/oyun/yonetim/` ile aynı oturum anahtarı.

## Aşama 2 (ayrı plan)

Her yayından sonra sitenin kendiliğinden yeniden build ve deploy olması (JSON-LD ve `llms.txt`
güncel kalsın). Build `fonts.googleapis.com` ister; çalıştırıcı olarak arc ya da GitHub Actions
seçilecek, sır ve anahtar kararı gerekir. Aşama 1 bitene kadar yayından sonra elle build ve deploy.
