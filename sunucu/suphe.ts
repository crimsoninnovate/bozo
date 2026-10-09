import type { Girdi, Sonuc } from '../lib/oyun/tipler.ts'

/*
 * İnsan olasılığı (spec §9): makine kadar düzgün zamanlanmış tur işaretlenir, silinmez. Personel
 * yönetim ucundan görür ve sofrada bir tur ister. Tam kıvam oranı işaret değildir: bant halka olarak
 * görünür ve beklemek bedava, dikkatli bir insan %100'e varabilir (spec tabak §13).
 */
export const SUPHE_EN_AZ_DOKUNUS = 100
/** Dokunuşlar arası aralıkların bu payı aynı değerdeyse elin titremesi yoktur. */
export const SUPHE_DUZENLILIK = 0.6

export function zamanlamaSupheli(girdiler: readonly Girdi[]): boolean {
  if (girdiler.length < SUPHE_EN_AZ_DOKUNUS) return false
  const sayim = new Map<number, number>()
  for (let i = 1; i < girdiler.length; i++) {
    const aralik = (girdiler[i]?.[0] ?? 0) - (girdiler[i - 1]?.[0] ?? 0)
    if (aralik > 0) sayim.set(aralik, (sayim.get(aralik) ?? 0) + 1)
  }
  const enCok = Math.max(0, ...sayim.values())
  return enCok / (girdiler.length - 1) > SUPHE_DUZENLILIK
}

export function supheliMi(girdiler: readonly Girdi[], _sonuc: Sonuc): boolean {
  return zamanlamaSupheli(girdiler)
}
