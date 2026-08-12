/**
 * Galeri sayfasının metni.
 *
 * Bu sayfanın tasarım dosyası yok ve `metin-envanteri.json` içinde ona ait hazır
 * bir blok da yok (tarandı: 31 hazır metnin hiçbiri fotoğrafla ilgili değil).
 * Bu yüzden metin en aza indirildi ve her satırın kaynağı burada yazıyor:
 *
 * - `baslik`: sayfanın adı. Sahibinin tasarım talebi 17. satır ("Galeri") ve
 *   proje bilgi dosyasının site haritası satırı. Pazarlama metni değil, sayfa adı.
 * - `altMetin`: menünün onaylı "Menünün beklediği yedi kare" satırının aynı
 *   kalıbı, kapsamı ve sayısı değişmiş hali. Olgusal, iddiasız.
 * - `aiNotu`: `menu.cekim.aiGorselNotu` ile birebir aynı cümle (kaynağı
 *   Menu Sayfasi.dc.html:279). Yeni cümle yazılmadı; site genelindeki fotoğraf
 *   yüzeyi bu sayfa olduğu için not burada da duruyor.
 *
 * Eksik olan ve uydurulmayan: bir spot paragrafı, kare başına açıklama, ve
 * fotoğraflar geldikten sonra bu sayfanın ne diyeceği. Bkz. galeri-report.md.
 */
export const galeri = {
  baslik: 'Galeri',
  altMetin: 'Sitenin beklediği on altı kare',
  aiNotu:
    'Yapay zeka ile üretilmiş yemek görseli kullanılmıyor. ' +
    'Yuvalar çekim gelene kadar karanlık kalır.',
}
