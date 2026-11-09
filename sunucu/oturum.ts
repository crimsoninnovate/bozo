import { createHmac } from 'node:crypto'
import { esitMi } from './kod.ts'

/*
 * Personel oturum anahtarı, durumsuz, 30 gün: `k<id>.<surum>.<bitisMs>.<hmacHex>`. Admin `id` 0 ve imzası
 * kullanıcı adı ile şifresini de kapsar; personelin `surum`'u kapatma ve şifre değişiminde artar.
 */
export const OTURUM_SURESI_MS = 30 * 24 * 60 * 60_000
const SAAT_FARKI_MS = 60_000
/** Eski biçimli (`<bitisMs>.<hex>`) admin anahtarları bu tarihe kadar geçer; sonra bu dal silinir. */
export const ESKI_ANAHTAR_SONU = Date.UTC(2026, 11, 15)

type Kimlik = { kullanici: string; sifre: string }
/** Admin: `{ id: 0, surum: 0, gizli: 'kullanici:sifre' }`; personel: `gizli` boş. */
export type OturumSahibi = { id: number; surum: number; gizli: string }
export type CozulenAnahtar = { id: number; surum: number; bitis: number; imza: string }

const imzala = (tuz: string, s: OturumSahibi, bitisMs: number): string =>
  createHmac('sha256', tuz).update(`yonetim-oturum2:${s.id}:${s.surum}:${s.gizli}:${bitisMs}`).digest('hex')

const sureUygun = (bitis: number, simdi: number): boolean =>
  Number.isSafeInteger(bitis) && bitis > simdi && bitis <= simdi + OTURUM_SURESI_MS + SAAT_FARKI_MS

export function oturumAnahtariUret(tuz: string, sahip: OturumSahibi, bitisMs: number): string {
  return `k${sahip.id}.${sahip.surum}.${bitisMs}.${imzala(tuz, sahip, bitisMs)}`
}

/** Biçim ve süre denetimi; imzayı `oturumImzasiTutar` sahibin güncel sürümüyle denetler. */
export function oturumAnahtariCoz(yetki: string | undefined, simdi: number): CozulenAnahtar | 'eski' | null {
  if (/^Bearer [1-9]\d{0,14}\.[0-9a-f]{64}$/.test(yetki ?? '')) return 'eski'
  const es = /^Bearer k(0|[1-9]\d{0,8})\.(0|[1-9]\d{0,9})\.([1-9]\d{0,14})\.([0-9a-f]{64})$/.exec(yetki ?? '')
  if (!es?.[4]) return null
  const bitis = Number(es[3])
  if (!sureUygun(bitis, simdi)) return null
  return { id: Number(es[1]), surum: Number(es[2]), bitis, imza: es[4] }
}

export function oturumImzasiTutar(tuz: string, sahip: OturumSahibi, c: { bitis: number; imza: string }): boolean {
  return esitMi(c.imza, imzala(tuz, sahip, c.bitis))
}

const eskiImza = (tuz: string, k: Kimlik, bitisMs: number): string =>
  createHmac('sha256', tuz).update(`yonetim-oturum:${k.kullanici}:${k.sifre}:${bitisMs}`).digest('hex')

/** Yalnız testler ve geçiş: 9 Kasım 2026 öncesi panelin verdiği biçim. */
export function eskiAdminAnahtariUret(tuz: string, kimlik: Kimlik, bitisMs: number): string {
  return `${bitisMs}.${eskiImza(tuz, kimlik, bitisMs)}`
}

/** `Bearer <bitisMs>.<hex>`; süre dolmamış, en çok süre + 1 dk ilerde, `ESKI_ANAHTAR_SONU` geçmemiş. */
export function eskiAdminAnahtariGecerliMi(
  tuz: string, kimlik: Kimlik, yetki: string | undefined, simdi: number,
): boolean {
  if (simdi >= ESKI_ANAHTAR_SONU) return false
  const es = /^Bearer ([1-9]\d{0,14})\.([0-9a-f]{64})$/.exec(yetki ?? '')
  if (!es?.[1] || !es[2]) return false
  const bitis = Number(es[1])
  return sureUygun(bitis, simdi) && esitMi(es[2], eskiImza(tuz, kimlik, bitis))
}
