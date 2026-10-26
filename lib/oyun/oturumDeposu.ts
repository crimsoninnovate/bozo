/*
 * Personel oturumunun tarayıcıda saklanan biçimi (`bozo-yonetim`): `{ yetki: 'Bearer ...', bitis }`.
 * Çözümleme saf; depoya yazıp okumak `components/yonetim/oturum.tsx`'in işi.
 */
export const OTURUM_ANAHTARI = 'bozo-yonetim'

export type Depo = 'localStorage' | 'sessionStorage'

/**
 * Oturumu hangi depo tutar, hangisi temizlenir. "Beni hatırla" açıkken kalıcı yazım düşerse (gizli sekme,
 * dolu kota) oturum sekme deposunda kalır; temizlenen depo hep diğeridir, böylece eski kayıt kalmaz.
 */
export function oturumDepolari(hatirla: boolean, kaliciYazildi: boolean): { tut: Depo; sil: Depo } {
  return hatirla && kaliciYazildi
    ? { tut: 'localStorage', sil: 'sessionStorage' }
    : { tut: 'sessionStorage', sil: 'localStorage' }
}

export function oturumYaz(yetki: string, bitis: string): string {
  return JSON.stringify({ yetki, bitis })
}

/**
 * Kullanılabilir `Authorization` değeri ya da null. `eskiBicim`: `sessionStorage`'daki eski çıplak
 * `Basic ...` dizesini de kabul eder (sekme kapanınca zaten düşer); kalıcı depoda hiçbir zaman.
 */
export function oturumOku(ham: string | null, simdi: number, eskiBicim: boolean): string | null {
  if (!ham) return null
  if (eskiBicim && ham.startsWith('Basic ')) return ham
  let kayit: unknown
  try {
    kayit = JSON.parse(ham)
  } catch {
    return null
  }
  if (typeof kayit !== 'object' || kayit === null) return null
  const { yetki, bitis } = kayit as Record<string, unknown>
  if (typeof yetki !== 'string' || !yetki.startsWith('Bearer ') || typeof bitis !== 'string') return null
  return Date.parse(bitis) > simdi ? yetki : null
}
