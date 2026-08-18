/**
 * 404 metni. Statik export tek bir 404.html üretir, yani SUNUCU dili bilemez ve
 * ilk boyama TR gelir; `HataSayfasi` bağlandıktan sonra `/en/` altında metni,
 * `lang`'i ve başlığı İngilizceye çevirir. Espri tek ve ölçülüdür.
 */
export const hata = {
  kicker: '404',
  baslik: 'Bu sayfa ocakta yok.',
  metin: 'Aradığınız sayfayı bulamadık. Ocak yanmaya devam ediyor, aşağıdan devam edin.',
  anaSayfa: 'Ana Sayfa',
  menu: 'Menüyü Gör',
}
