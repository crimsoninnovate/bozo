import { yonetim } from '../../content/yonetim.ts'
import { doldur } from '../metin.ts'
import type { IslemSatiri } from './personel.ts'

/* İşlem kaydının paneldeki Türkçe satırı; sunucu paketine girmesin diye `personel.ts`'ten ayrı. */

export function islemMetni(i: IslemSatiri): string {
  return doldur(yonetim.kayit.tur[i.tur], { ayrinti: i.ayrinti })
}
