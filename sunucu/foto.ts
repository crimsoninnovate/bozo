import { createHash, randomBytes } from 'node:crypto'
import { access, mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { FotoYukleYaniti } from '../lib/menu/aktarim.ts'
import { IstekHatasi, type Istek, type Yanit } from './http.ts'
import type { Baglam } from './uclar.ts'

/* Fotoğraf yükleme (spec 2026-11-09): yalnız WebP, içerik adı, dosya hiç silinmez. Sunumu nginx yapar. */

export const FOTO_GOVDE_SINIRI = 3 * 1024 * 1024
const UZUN_KENAR_SINIRI = 2000

/** `RIFF....WEBP` kabuğundaki ilk parçanın (VP8, VP8L, VP8X) piksel boyutu; tanınmazsa ya da kesikse null. */
export function webpBoyutu(veri: Buffer): { en: number; boy: number } | null {
  if (veri.length < 30) return null
  if (veri.toString('ascii', 0, 4) !== 'RIFF' || veri.toString('ascii', 8, 12) !== 'WEBP') return null
  const boyut = parcaBoyutu(veri, veri.toString('ascii', 12, 16))
  return boyut && boyut.en > 0 && boyut.boy > 0 ? boyut : null
}

function parcaBoyutu(veri: Buffer, parca: string): { en: number; boy: number } | null {
  if (parca === 'VP8 ') {
    if (veri[23] !== 0x9d || veri[24] !== 0x01 || veri[25] !== 0x2a) return null
    return { en: veri.readUInt16LE(26) & 0x3fff, boy: veri.readUInt16LE(28) & 0x3fff }
  }
  if (parca === 'VP8L') {
    if (veri[20] !== 0x2f) return null
    const bitler = veri.readUInt32LE(21)
    return { en: (bitler & 0x3fff) + 1, boy: ((bitler >>> 14) & 0x3fff) + 1 }
  }
  if (parca === 'VP8X') return { en: veri.readUIntLE(24, 3) + 1, boy: veri.readUIntLE(27, 3) + 1 }
  return null
}

const varMi = (yol: string): Promise<boolean> =>
  access(yol).then(() => true, () => false)

/** Geçici dosyaya yazıp aynı dizinde yeniden adlandırır: yarım dosya hiç görünmez. */
async function atomikYaz(dizin: string, dosya: string, veri: Buffer): Promise<void> {
  await mkdir(dizin, { recursive: true })
  const gecici = join(dizin, `.${dosya}.${randomBytes(6).toString('hex')}.tmp`)
  try {
    await writeFile(gecici, veri)
    await rename(gecici, join(dizin, dosya))
  } catch (hata) {
    await rm(gecici, { force: true })
    throw hata
  }
}

/** Gövde ham WebP baytlarıdır; yanıt içerik adını ve boyutu verir, aynı baytlar aynı adı verir. */
export async function yonetimFotoYukle(b: Baglam, istek: Istek): Promise<Yanit> {
  if (b.fotoDizini === null) throw new IstekHatasi(503, 'fotoKapali')
  const tur = (istek.basliklar['content-type'] ?? '').split(';')[0]?.trim().toLowerCase()
  if (tur !== 'image/webp') throw new IstekHatasi(415, 'webpDegil')
  const veri = await istek.hamGovde(FOTO_GOVDE_SINIRI)
  if (veri.length === 0) throw new IstekHatasi(400, 'govdeBos')
  const boyut = webpBoyutu(veri)
  if (!boyut) throw new IstekHatasi(415, 'webpDegil')
  if (Math.max(boyut.en, boyut.boy) > UZUN_KENAR_SINIRI) throw new IstekHatasi(422, 'fotoBuyuk')
  const dosya = `${createHash('sha256').update(veri).digest('hex').slice(0, 16)}.webp`
  if (!(await varMi(join(b.fotoDizini, dosya)))) await atomikYaz(b.fotoDizini, dosya, veri)
  return { durum: 200, govde: { dosya, ...boyut } satisfies FotoYukleYaniti }
}
