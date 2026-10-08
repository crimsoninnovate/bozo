import type { Girdi, Sonuc } from '../lib/oyun/tipler.ts'

/*
 * İnsan olasılığı (spec §9): tam kıvam oranı %95'i aşan ya da makine kadar düzgün zamanlanmış
 * tur işaretlenir, silinmez. Personel yönetim ucundan görür ve sofrada bir tur ister.
 */
export const SUPHE_TAM_KIVAM_ORANI = 0.95
export const SUPHE_EN_AZ_DOKUNUS = 100
/** Dokunuşlar arası aralıkların bu payı aynı değerdeyse elin titremesi yoktur. */
export const SUPHE_DUZENLILIK = 0.6

export function tamKivamSupheli(sonuc: Sonuc): boolean {
  return sonuc.ozet.sis >= 20 && sonuc.ozet.tamKivam / sonuc.ozet.sis > SUPHE_TAM_KIVAM_ORANI
}

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

export function supheliMi(girdiler: readonly Girdi[], sonuc: Sonuc): boolean {
  return tamKivamSupheli(sonuc) || zamanlamaSupheli(girdiler)
}
