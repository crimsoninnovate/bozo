import { createHash, randomBytes } from 'node:crypto'
import { access, chmod, mkdir, rename, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { FotoYukleYaniti } from '../lib/menu/aktarim.ts'
import { IstekHatasi, type Istek, type Yanit } from './http.ts'
import type { Baglam } from './uclar.ts'
import { islemYaz, type Yetkili } from './yonetim.ts'

/* Fotoğraf yükleme (spec 2026-11-09): WebP ya da JPEG, içerik adı, dosya hiç silinmez. Sunumu nginx yapar. */

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

const SOF_ISARETCILERI = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf])

/** `FF D8 FF` ile başlayan JPEG'in ilk SOF işaretçisindeki piksel boyutu; SOS/EOI'ye dek bulunamazsa null. */
export function jpegBoyutu(veri: Buffer): { en: number; boy: number } | null {
  if (veri.length < 4 || veri[0] !== 0xff || veri[1] !== 0xd8 || veri[2] !== 0xff) return null
  let i = 2
  while (i + 4 <= veri.length) {
    if (veri[i] !== 0xff) return null
    const isaret = veri[i + 1]!
    if (isaret === 0xff) { i += 1; continue } // dolgu baytı
    if (isaret === 0x01 || (isaret >= 0xd0 && isaret <= 0xd8)) { i += 2; continue } // uzunluksuz
    if (isaret === 0xd9 || isaret === 0xda) return null
    if (SOF_ISARETCILERI.has(isaret)) {
      if (i + 9 > veri.length) return null
      const boy = veri.readUInt16BE(i + 5)
      const en = veri.readUInt16BE(i + 7)
      return en > 0 && boy > 0 ? { en, boy } : null
    }
    i += 2 + veri.readUInt16BE(i + 2)
  }
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
    // nginx başka kullanıcı: bozo-oyun'un umask'ı ne olursa olsun herkes okuyabilsin.
    await chmod(gecici, 0o644)
    await rename(gecici, join(dizin, dosya))
  } catch (hata) {
    await rm(gecici, { force: true })
    throw hata
  }
}

/** Başlıktaki tür, baytların gerçek biçimiyle eşleşmeli; boyut okunamazsa biçim de geçersizdir. */
const BICIMLER: Record<string, { uzanti: string; boyut: (veri: Buffer) => { en: number; boy: number } | null }> = {
  'image/webp': { uzanti: 'webp', boyut: webpBoyutu },
  'image/jpeg': { uzanti: 'jpg', boyut: jpegBoyutu },
}

/** Gövde ham WebP ya da JPEG baytlarıdır; yanıt içerik adını ve boyutu verir, aynı baytlar aynı adı verir. */
export async function yonetimFotoYukle(b: Baglam, istek: Istek, y: Yetkili): Promise<Yanit> {
  if (b.fotoDizini === null) throw new IstekHatasi(503, 'fotoKapali')
  const tur = (istek.basliklar['content-type'] ?? '').split(';')[0]?.trim().toLowerCase() ?? ''
  const bicim = BICIMLER[tur]
  if (!bicim) throw new IstekHatasi(415, 'bicimDesteklenmiyor')
  const veri = await istek.hamGovde(FOTO_GOVDE_SINIRI)
  if (veri.length === 0) throw new IstekHatasi(400, 'govdeBos')
  const boyut = bicim.boyut(veri)
  if (!boyut) throw new IstekHatasi(415, 'bicimDesteklenmiyor')
  if (Math.max(boyut.en, boyut.boy) > UZUN_KENAR_SINIRI) throw new IstekHatasi(422, 'fotoBuyuk')
  const dosya = `${createHash('sha256').update(veri).digest('hex').slice(0, 16)}.${bicim.uzanti}`
  if (!(await varMi(join(b.fotoDizini, dosya)))) await atomikYaz(b.fotoDizini, dosya, veri)
  await islemYaz(b, y, 'foto', dosya)
  return { durum: 200, govde: { dosya, ...boyut } satisfies FotoYukleYaniti }
}
