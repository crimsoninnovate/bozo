/**
 * Çerez onayının saklandığı yer ve okunduğu tek nokta.
 *
 * KKTC 89/2007 Madde 11(2)(A): yurt dışına veri transferi, kişinin şüpheye yer
 * bırakmayacak onayıyla mümkün. Ölçüm bu yüzden OPT-IN: varsayılan "ret" değil,
 * "karar verilmedi", ve karar verilene kadar hiçbir şey yüklenmez.
 */
export const ONAY_ANAHTARI = 'bozo-cerez-onayi'

export type OnayDurumu = 'kabul' | 'ret' | 'karar-yok'

export function onayOku(): OnayDurumu {
  if (typeof window === 'undefined') return 'karar-yok'
  try {
    const deger = window.localStorage.getItem(ONAY_ANAHTARI)
    return deger === 'kabul' || deger === 'ret' ? deger : 'karar-yok'
  } catch {
    // Gizli sekmede ve depolama kapalıyken okuma atar: kararsız say, ölçme.
    return 'karar-yok'
  }
}

export function onayYaz(durum: Exclude<OnayDurumu, 'karar-yok'>): void {
  try {
    window.localStorage.setItem(ONAY_ANAHTARI, durum)
  } catch {
    // Yazamıyorsak da sorun değil: bu oturumda ölçülür, sonrakinde yeniden sorulur.
  }
}

/** Oyun rotalarında ne bant ne ölçüm: oyun birinci taraftır, dışarıya istek yapmaz (spec §10). */
export function onayGerekirMi(yol: string): boolean {
  return !/^\/(en\/)?oyun(\/|$)/.test(yol)
}
