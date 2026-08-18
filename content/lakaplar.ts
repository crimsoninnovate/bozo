import type { Lakap } from './types.ts'

/**
 * Hitap örnekleri, işletme sahibinin kendi anlatımından (19 Ağustos 2026). Adlar ve
 * karşılıkları dile göre değişmediği için sözlükte değil burada; yalnız sıfatın
 * açıklaması çevrilir (`hikaye.lakap.notlar`).
 *
 * Anlatımdaki örneklerin hepsi basılmıyor: kişiyi bedeni ya da zekasıyla etiketleyenler
 * dışarıda kaldı, gerekçe `docs/surec/IYILESTIRMELER.md` > lakap bölümü.
 */
export const lakaplar: Lakap[] = [
  { id: 'ahmet', ad: 'Ahmet', lakap: 'Ahmo', tur: 'kisaltma' },
  { id: 'mustafa', ad: 'Mustafa', lakap: 'Mıço', tur: 'kisaltma' },
  { id: 'ali', ad: 'Ali', lakap: 'Alo', tur: 'kisaltma' },
  { id: 'kemal', ad: 'Kemal', lakap: 'artist Kemo', tur: 'lakap' },
  { id: 'ismail', ad: 'İsmail', lakap: 'culuk İsmo', tur: 'lakap' },
]
