import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { DerlemeDurumu } from '../lib/menu/aktarim.ts'
import { IstekHatasi, type Yanit } from './http.ts'
import type { Baglam } from './uclar.ts'

/* Site derleme isteği (spec 2026-11-09 C): istek dosyası yazar, durum dosyasını okur; derlemeyi başka birim yapar. */

const GUNLUK_SATIRI = 200
const ASAMALAR: readonly string[] = ['bos', 'sirada', 'derleniyor', 'yayinda', 'hata']
const BOS: DerlemeDurumu = { asama: 'bos', surum: null, zaman: null, gunluk: [] }

const varMi = (yol: string): Promise<boolean> =>
  access(yol).then(() => true, () => false)

function durumMu(d: unknown): d is DerlemeDurumu {
  if (typeof d !== 'object' || d === null) return false
  const o = d as Record<string, unknown>
  return (
    typeof o.asama === 'string' && ASAMALAR.includes(o.asama) &&
    (o.surum === null || (typeof o.surum === 'number' && Number.isFinite(o.surum))) &&
    (o.zaman === null || typeof o.zaman === 'string') &&
    Array.isArray(o.gunluk) && o.gunluk.every((s) => typeof s === 'string')
  )
}

/** `durum.json`; yok ya da bozuksa `bos` (bozuksa bir uyarıyla). Günlük son 200 satıra kırpılır. */
async function durumOku(dizin: string): Promise<DerlemeDurumu> {
  const yol = join(dizin, 'durum.json')
  let ham: string
  try {
    ham = await readFile(yol, 'utf8')
  } catch (hata) {
    if ((hata as NodeJS.ErrnoException).code === 'ENOENT') return BOS
    console.warn('derleme durumu okunamadı', yol, hata)
    return BOS
  }
  try {
    const d: unknown = JSON.parse(ham)
    if (durumMu(d)) return { ...d, gunluk: d.gunluk.slice(-GUNLUK_SATIRI) }
  } catch {
    // Aşağıdaki uyarı bozuk JSON'u da kapsar.
  }
  console.warn('derleme durumu geçersiz', yol)
  return BOS
}

async function durumAl(dizin: string): Promise<DerlemeDurumu> {
  const durum = await durumOku(dizin)
  if (durum.asama !== 'derleniyor' && (await varMi(join(dizin, 'istek')))) return { ...durum, asama: 'sirada' }
  return durum
}

function dizinAl(b: Baglam): string {
  if (b.derlemeDizini === null) throw new IstekHatasi(503, 'derlemeKapali')
  return b.derlemeDizini
}

export async function yonetimDerlemeDurumu(b: Baglam): Promise<Yanit> {
  return { durum: 200, govde: { durum: await durumAl(dizinAl(b)) } }
}

/** İstek dosyası varsa dokunmaz: derleme sürerken ya da sırada gelen istek birleşir. */
export async function yonetimDerlemeIste(b: Baglam): Promise<Yanit> {
  const dizin = dizinAl(b)
  await mkdir(dizin, { recursive: true })
  try {
    await writeFile(join(dizin, 'istek'), new Date(b.simdi()).toISOString(), { flag: 'wx' })
  } catch (hata) {
    if ((hata as NodeJS.ErrnoException).code !== 'EEXIST') throw hata
  }
  return { durum: 202, govde: { durum: await durumAl(dizin) } }
}
