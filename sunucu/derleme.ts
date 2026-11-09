import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { DerlemeDurumu } from '../lib/menu/aktarim.ts'
import { IstekHatasi, type Yanit } from './http.ts'
import type { Baglam } from './uclar.ts'
import { islemYaz, type Yetkili } from './yonetim.ts'

/* Site derleme isteği (spec 2026-11-09 C): istek dosyası yazar, durum dosyasını okur; derlemeyi başka birim yapar. */

const GUNLUK_SATIRI = 200
const ASAMALAR: readonly string[] = ['bos', 'sirada', 'derleniyor', 'yayinda', 'hata']
const BOS: DerlemeDurumu = { asama: 'bos', surum: null, zaman: null, gunluk: [] }
/** Bu kadar süredir `derleniyor` diyen durum yarıda kalmıştır (yeniden başlatma, elektrik kesintisi). */
const YARIDA_KALDI_MS = 60 * 60_000
const YARIDA_KALDI_NOTU = 'Derleme yarıda kaldı (sunucu yeniden başlamış olabilir).'

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

/** Eskimiş `derleniyor` `hata` sayılır, yoksa düğme sonsuza dek kilitli kalır; `zaman` yoksa dokunulmaz. */
function yaridaKaldiysaHata(durum: DerlemeDurumu, simdi: number): DerlemeDurumu {
  if (durum.asama !== 'derleniyor' || durum.zaman === null) return durum
  const baslangic = Date.parse(durum.zaman)
  if (Number.isNaN(baslangic) || simdi - baslangic <= YARIDA_KALDI_MS) return durum
  return { ...durum, asama: 'hata', gunluk: [...durum.gunluk, YARIDA_KALDI_NOTU].slice(-GUNLUK_SATIRI) }
}

async function durumAl(dizin: string, simdi: number): Promise<DerlemeDurumu> {
  const durum = yaridaKaldiysaHata(await durumOku(dizin), simdi)
  if (durum.asama !== 'derleniyor' && (await varMi(join(dizin, 'istek')))) return { ...durum, asama: 'sirada' }
  return durum
}

function dizinAl(b: Baglam): string {
  if (b.derlemeDizini === null) throw new IstekHatasi(503, 'derlemeKapali')
  return b.derlemeDizini
}

export async function yonetimDerlemeDurumu(b: Baglam): Promise<Yanit> {
  return { durum: 200, govde: { durum: await durumAl(dizinAl(b), b.simdi()) } }
}

/** İstek dosyası varsa dokunmaz: derleme sürerken ya da sırada gelen istek birleşir. */
export async function yonetimDerlemeIste(b: Baglam, y: Yetkili): Promise<Yanit> {
  const dizin = dizinAl(b)
  await mkdir(dizin, { recursive: true })
  try {
    await writeFile(join(dizin, 'istek'), new Date(b.simdi()).toISOString(), { flag: 'wx' })
  } catch (hata) {
    if ((hata as NodeJS.ErrnoException).code !== 'EEXIST') throw hata
  }
  await islemYaz(b, y, 'derleme', '')
  return { durum: 202, govde: { durum: await durumAl(dizin, b.simdi()) } }
}
