import type { Olcu } from '../../content/types.ts'
import type { MenuKalemi } from './tipler.ts'

/** Ölçülerin menüdeki sırası, fiyat listesinin sütun sırası. */
const OLCU_SIRASI: Olcu[] = ['porsiyon', 'durum']

/** Kalemin fiyatı olan ölçüleri, menüdeki sırayla. */
export function kalemOlculeri(kalem: MenuKalemi): { olcu: Olcu; fiyat: number }[] {
  return OLCU_SIRASI.flatMap((olcu) => {
    const fiyat = kalem.fiyatlar[olcu]
    return fiyat === undefined ? [] : [{ olcu, fiyat }]
  })
}
