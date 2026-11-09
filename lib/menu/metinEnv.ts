import { metinlerDogrula } from './dogrulama.ts'
import type { MenuBelgesi, Metinler } from './tipler.ts'

/*
 * Panelden değişen sayfa metinleri, statik build'e `NEXT_PUBLIC_METINLER` ile gömülür;
 * `content/index.ts` saatleri doldurmadan önce sözlüğe uygular.
 */

const bos = (): Metinler => ({ tr: {}, en: {} })

export function metinleriEnveCevir(b: MenuBelgesi): string {
  return JSON.stringify(b.metinler)
}

/** Ham yoksa sessizce boş; bozuk ya da geçersizse uyarır ve boş kalır: koddaki metinler basılır. */
export function metinleriEnvdenOku(ham: string | undefined): Metinler {
  if (ham === undefined) return bos()
  let girdi: unknown
  try {
    girdi = JSON.parse(ham)
  } catch (hata) {
    console.warn('NEXT_PUBLIC_METINLER okunamadi (bozuk JSON), koddaki metinler kullaniliyor', hata)
    return bos()
  }
  const sonuc = metinlerDogrula(girdi)
  if (!sonuc.tamam) {
    const ozet = sonuc.hatalar.map((h) => `${h.yol}: ${h.metin}`).join('; ')
    console.warn(`NEXT_PUBLIC_METINLER gecersiz, koddaki metinler kullaniliyor: ${ozet}`)
    return bos()
  }
  return sonuc.metinler
}

/** Build'e gömülen metinler. Düz `process.env.X` ifadesi: Next onu build'de yazıya çevirir. */
export function derlenmisMetinler(): Metinler {
  return metinleriEnvdenOku(process.env.NEXT_PUBLIC_METINLER)
}
