import { VARSAYILAN_SAATLER } from '../saat.ts'
import { saatlerDogrula } from './dogrulama.ts'
import type { MenuBelgesi, Saatler } from './tipler.ts'

/*
 * Menü belgesinin çalışma saatleri, statik build'e `NEXT_PUBLIC_SAATLER` ile gömülür.
 * Sözlükteki `{acilis}` / `{kapanis}` yer tutucuları bununla dolar (`content/index.ts`).
 */

export function saatleriEnveCevir(b: MenuBelgesi): string {
  const { acilis, kapanis } = b.saatler
  return JSON.stringify({ acilis, kapanis })
}

/** Ham yoksa varsayılan sessizce kalır; bozuksa uyarır ve varsayılan kalır (build kırılmaz). */
export function saatleriEnvdenOku(ham: string | undefined): Saatler {
  if (ham === undefined) return VARSAYILAN_SAATLER
  let girdi: unknown
  try {
    girdi = JSON.parse(ham)
  } catch (hata) {
    console.warn('NEXT_PUBLIC_SAATLER okunamadi (bozuk JSON), varsayilan saatler kullaniliyor', hata)
    return VARSAYILAN_SAATLER
  }
  const sonuc = saatlerDogrula(girdi)
  if (!sonuc.tamam) {
    console.warn('NEXT_PUBLIC_SAATLER gecersiz, varsayilan saatler kullaniliyor', ham)
    return VARSAYILAN_SAATLER
  }
  return sonuc.saatler
}

/** Build'e gömülen saatler. Düz `process.env.X` ifadesi: Next onu build'de yazıya çevirir. */
export function derlenmisSaatler(): Saatler {
  return saatleriEnvdenOku(process.env.NEXT_PUBLIC_SAATLER)
}
