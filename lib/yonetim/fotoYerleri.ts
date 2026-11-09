import type { FotoId } from '../../content/types.ts'

/* Panelin Fotoğraflar sekmesi için: yuvanın sitede durduğu yer ve önizleme kırpımının oranı.
   Kaynak `FotoYuvasi` çağrıları; her kare ayrıca galeride görünür. */

/** Personelin okuduğu "nerede" satırı. Menü kartları varsayılan menüdeki `fotoId` eşlemesidir. */
export const fotoYerleri: Record<FotoId, string> = {
  'tane-yakin-cekim': 'Ana sayfa · İddia, Menü · Ciğer kartı',
  'tane-yakin-cekim-yatay': 'Menü · Ocakbaşı açılışı',
  'kor-uzerinde-sis': 'Galeri',
  'ustanin-eli': 'Ana sayfa · Bozo',
  'kurulu-sofra': 'Ana sayfa · İkram',
  'gece-cephesi': 'Galeri',
  'bes-urun': 'Galeri',
  dalak: 'Menü · Dalak kartı',
  yurek: 'Menü · Yürek kartı',
  'terbiyeli-kusbasi': 'Menü · Terbiyeli Kuşbaşı kartı',
  'bozo-karisik': 'Menü · Bozani kartı',
  'tavuk-sis': 'Menü · Terbiyesiz Tavuk Şiş kartı',
  'terbiyeli-tavuk-sis': 'Menü · Terbiyeli Tavuk Şiş kartı',
  lebeni: 'Menü · Lebeni Çorbası ikramı',
  bostana: 'Menü · Bostana ikramı',
  ayran: 'Menü · İçecekler',
  'bozo-portre': 'Hikaye · Portre',
}

/**
 * İlk yerleşimin yaklaşık oranı (CSS `aspect-ratio`), `FotoYuvasi.module.css` ölçülerinden: portre ~440x560,
 * genis 760x200, spread ~600x400, kart ~360x270, ikram ~180x200, icecek ~340x260.
 */
export const fotoOranlari: Record<FotoId, string> = {
  'tane-yakin-cekim': '4 / 5',
  'tane-yakin-cekim-yatay': '3 / 2',
  'kor-uzerinde-sis': '4 / 3',
  'ustanin-eli': '19 / 5',
  'kurulu-sofra': '19 / 5',
  'gece-cephesi': '4 / 3',
  'bes-urun': '4 / 3',
  dalak: '4 / 3',
  yurek: '4 / 3',
  'terbiyeli-kusbasi': '4 / 3',
  'bozo-karisik': '4 / 3',
  'tavuk-sis': '4 / 3',
  'terbiyeli-tavuk-sis': '4 / 3',
  lebeni: '9 / 10',
  bostana: '9 / 10',
  ayran: '4 / 3',
  'bozo-portre': '4 / 5',
}
