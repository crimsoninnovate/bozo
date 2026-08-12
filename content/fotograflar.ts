import type { Foto, FotoId } from './types.ts'

/**
 * Çekim listesi manifesti. dosya alanı boşken FotoYuvasi kadraj etiketli
 * koyu plaka basar. Fotoğraflar geldiğinde yalnızca bu dosyaya yol yazılır.
 * Yapay zeka ile üretilmiş yemek görseli kullanılmaz.
 */
export const fotograflar: Record<FotoId, Foto> = {
  'tane-yakin-cekim': { etiket: 'tane yakın çekimi', etiketEn: 'the cut, close up' },
  // Menü imza panosu geniş ve alçaktır; ana sayfadaki dikey pano ile aynı dosya
  // ikisini birden kadrajlayamaz. Tasarım bu yuvada kadrajı açıkça yazar.
  'tane-yakin-cekim-yatay': {
    etiket: 'tane yakın çekimi · yatay',
    etiketEn: 'the cut, close up, landscape',
  },
  'kor-uzerinde-sis': { etiket: 'kor üzerinde şiş', etiketEn: 'skewers over embers' },
  'ustanin-eli': { etiket: 'ustanın eli', etiketEn: "the master's hand" },
  'kurulu-sofra': { etiket: 'kurulu sofra, üstten', etiketEn: 'the table, from above' },
  'gece-cephesi': { etiket: 'gece cephesi', etiketEn: 'the front at night' },
  'paket-ve-gel-al': { etiket: 'paket ve gel al', etiketEn: 'takeaway' },
  'bes-urun': { etiket: 'ürünler ayrı ayrı', etiketEn: 'each dish, one by one' },
  dalak: { etiket: 'dalak karesi', etiketEn: 'spleen' },
  yurek: { etiket: 'yürek karesi', etiketEn: 'heart' },
  'terbiyeli-kusbasi': { etiket: 'terbiyeli kuşbaşı karesi', etiketEn: 'marinated cubes' },
  'bozo-karisik': { etiket: 'bozo karışık karesi', etiketEn: 'the Bozo mix' },
  'tavuk-sis': { etiket: 'tavuk şiş karesi', etiketEn: 'chicken skewer' },
  lebeni: { etiket: 'lebeni karesi', etiketEn: 'lebeni soup' },
  bostana: { etiket: 'bostana karesi', etiketEn: 'bostana salad' },
  ayran: { etiket: 'bakır maşrapada ayran', etiketEn: 'ayran in a copper cup' },
  'bozo-portre': { etiket: 'portre, ocak başında', etiketEn: 'portrait, at the fire' },
}
