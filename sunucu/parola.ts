import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto'

/* Personel şifresi: `scrypt$N$r$p$tuz$ozet` (base64). Admin şifresi ortamda kalır, buradan geçmez. */

const N = 16384
const R = 8
const P = 1
const UZUNLUK = 32
const SECENEK: ScryptOptions = { N, r: R, p: P, maxmem: 64 * 1024 * 1024 }

const turet = (sifre: string, tuz: Buffer): Promise<Buffer> =>
  new Promise((coz, reddet) => scrypt(sifre, tuz, UZUNLUK, SECENEK, (h, ozet) => (h ? reddet(h) : coz(ozet))))

export async function parolaOzeti(sifre: string): Promise<string> {
  const tuz = randomBytes(16)
  const ozet = await turet(sifre, tuz)
  return `scrypt$${N}$${R}$${P}$${tuz.toString('base64')}$${ozet.toString('base64')}`
}

/** Bozuk ya da başka parametreli özet false döner; yalnız bu modülün ürettiği biçim kabul edilir. */
export async function parolaDogrula(sifre: string, ozet: string): Promise<boolean> {
  const es = /^scrypt\$(\d+)\$(\d+)\$(\d+)\$([A-Za-z0-9+/]+={0,2})\$([A-Za-z0-9+/]+={0,2})$/.exec(ozet)
  if (!es || Number(es[1]) !== N || Number(es[2]) !== R || Number(es[3]) !== P) return false
  const beklenen = Buffer.from(es[5] ?? '', 'base64')
  if (beklenen.length !== UZUNLUK) return false
  return timingSafeEqual(await turet(sifre, Buffer.from(es[4] ?? '', 'base64')), beklenen)
}

/** Bilinmeyen hesap adında da bir scrypt koşsun: yanıt süresi adın var olup olmadığını söylemez. */
export const SAHTE_OZET = await parolaOzeti(randomBytes(24).toString('base64'))
