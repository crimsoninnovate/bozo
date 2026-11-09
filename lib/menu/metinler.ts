import { tr } from '../../content/tr/index.ts'
import { en } from '../../content/en/index.ts'
import type { Dil } from '../../content/types.ts'

/*
 * Panelden düzenlenen sayfa metinleri. Belgede yalnız değişen metin durur (`yol -> metin`); yol sözlükteki
 * noktalı yoldur (`ana.hero.kilometreTaslari.1.metin`). Gizlilik, ortak, 404 ve oyun kodda kalır.
 */
export const METIN_SAYFALARI = ['ana', 'menu', 'hikaye', 'konum', 'galeri'] as const
export type MetinSayfasi = (typeof METIN_SAYFALARI)[number]

type Sozluk = typeof tr

function yapraklar(v: unknown, yol: string, sonuc: Map<string, string>): void {
  if (typeof v === 'string') {
    sonuc.set(yol, v)
    return
  }
  if (typeof v === 'object' && v !== null) {
    for (const [k, alt] of Object.entries(v)) yapraklar(alt, `${yol}.${k}`, sonuc)
  }
}

function yollariCikar(s: Sozluk): ReadonlyMap<string, string> {
  const sonuc = new Map<string, string>()
  for (const sayfa of METIN_SAYFALARI) yapraklar(s[sayfa], sayfa, sonuc)
  return sonuc
}

const VARSAYILAN: Record<Dil, ReadonlyMap<string, string>> = { tr: yollariCikar(tr), en: yollariCikar(en) }

/** Düzenlenebilir her yol ve koddaki metni, sözlük sırasıyla. */
export function varsayilanMetinler(dil: Dil): ReadonlyMap<string, string> {
  return VARSAYILAN[dil]
}

/** `{acilis}`, `{kapanis-de}` gibi yer tutucular; sıralı, tekrarsız. */
export function yerTutuculari(s: string): string[] {
  return [...new Set(s.match(/\{[^{}]+\}/g) ?? [])].sort()
}

/** Değişen metinleri sözlüğün kopyasına yazar; düzenlenemeyen yol atlanır, girdi değişmez. */
export function metinleriUygula<T extends Sozluk>(sozluk: T, degisiklik: Readonly<Record<string, string>>): T {
  const yollar = VARSAYILAN.tr
  const kopya = structuredClone(sozluk)
  for (const [yol, metin] of Object.entries(degisiklik)) {
    if (!yollar.has(yol)) continue
    const parcalar = yol.split('.')
    const son = parcalar.pop() as string
    let ust: Record<string, unknown> = kopya
    for (const p of parcalar) ust = ust[p] as Record<string, unknown>
    ust[son] = metin
  }
  return kopya
}
