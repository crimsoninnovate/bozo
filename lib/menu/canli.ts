import { menuBelgesiDogrula } from './dogrulama.ts'
import type { MenuYaniti } from './aktarim.ts'
import type { MenuBelgesi } from './tipler.ts'

/*
 * Herkese açık canlı menü okuması (spec: Review Focus 2). Hiçbir hata menüyü bozmaz: her başarısızlık
 * `null` döner, sayfa derlenmiş belgeyle kalır. 204 beklenen durumdur; geri kalanı `console.warn` ile
 * yazılır. Kimlik başlığı ve çerez yok. Tarayıcıdan içe aktarılır: `node:fs` ya da sunucu modülü alınmaz.
 */
export async function canliMenuGetir(
  kok: string,
  getir: typeof fetch,
  zamanAsimiMs: number,
): Promise<MenuYaniti | null> {
  let yanit: Response
  try {
    yanit = await getir(`${kok}/menu`, {
      method: 'GET',
      credentials: 'omit',
      signal: AbortSignal.timeout(zamanAsimiMs),
    })
  } catch (hata) {
    console.warn('canli menu alinamadi (ag ya da zaman asimi)', kok, hata)
    return null
  }
  if (yanit.status === 204) return null
  if (!yanit.ok) {
    console.warn('canli menu reddedildi', yanit.status)
    return null
  }
  let girdi: unknown
  try {
    girdi = await yanit.json()
  } catch (hata) {
    console.warn('canli menu govdesi okunamadi (bozuk JSON)', hata)
    return null
  }
  const surum = (girdi as { surum?: unknown } | null)?.surum
  if (typeof surum !== 'number' || !Number.isFinite(surum)) {
    console.warn('canli menu yok sayildi: surum sayi degil', surum)
    return null
  }
  const sonuc = menuBelgesiDogrula((girdi as { belge?: unknown }).belge)
  if (!sonuc.tamam) {
    const ozet = sonuc.hatalar.map((h) => `${h.yol}: ${h.metin}`).join('; ')
    console.warn('canli menu yok sayildi: belge gecersiz', surum, ozet)
    return null
  }
  return { surum, belge: sonuc.belge }
}

/** Canlı belge varsa o, yoksa derlenmiş `baz`. */
export function menuKarar(baz: MenuBelgesi, getirilen: MenuYaniti | null): MenuBelgesi {
  return getirilen === null ? baz : getirilen.belge
}
