import { tr as trHam } from './tr/index.ts'
import { en as enHam } from './en/index.ts'
import type { Dil } from './types.ts'
import { derlenmisSaatler } from '../lib/menu/saatEnv.ts'
import type { Saatler } from '../lib/menu/tipler.ts'
import { saatleriDoldur } from '../lib/saatMetni.ts'

export type Sozluk = typeof trHam

/** Sözlüğün her metnindeki `{acilis}` / `{kapanis}` yer tutucularını doldurur; diziler dahil. */
function doldur<T>(deger: T, saatler: Saatler): T {
  if (typeof deger === 'string') return saatleriDoldur(deger, saatler) as T
  if (Array.isArray(deger)) return deger.map((oge: unknown) => doldur(oge, saatler)) as T
  if (typeof deger === 'object' && deger !== null) {
    return Object.fromEntries(Object.entries(deger).map(([k, v]) => [k, doldur(v, saatler)])) as T
  }
  return deger
}

const saatler = derlenmisSaatler()
const tr: Sozluk = doldur(trHam, saatler)
const en: Sozluk = doldur(enHam, saatler)

export function sozluk(dil: Dil): Sozluk {
  return dil === 'en' ? en : tr
}

/** Doldurulmamış sözlük: saat yer tutucuları durur. Canlı saatle istemcide `saatleriDoldur` doldurur. */
export function sozlukHam(dil: Dil): Sozluk {
  return dil === 'en' ? enHam : trHam
}

export { tr, en }
export type { Dil }
