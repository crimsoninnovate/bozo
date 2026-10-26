import { createHmac } from 'node:crypto'
import { esitMi } from './kod.ts'

/*
 * Personel oturum anahtarı: `${bitisMs}.${hmacHex}`, durumsuz. İmza tuzun yanında kullanıcı adı ve şifreyi de
 * kapsar: bunlardan biri değişince eski anahtarların hepsi geçersiz olur.
 */
export const OTURUM_SURESI_MS = 30 * 24 * 60 * 60_000
const SAAT_FARKI_MS = 60_000

type Kimlik = { kullanici: string; sifre: string }

const imzala = (tuz: string, k: Kimlik, bitisMs: number): string =>
  createHmac('sha256', tuz).update(`yonetim-oturum:${k.kullanici}:${k.sifre}:${bitisMs}`).digest('hex')

export function oturumAnahtariUret(tuz: string, kimlik: Kimlik, bitisMs: number): string {
  return `${bitisMs}.${imzala(tuz, kimlik, bitisMs)}`
}

/** `Authorization` değeri `Bearer <bitisMs>.<hex>`; süre dolmamış, en çok süre + 1 dk ilerde ve imza tutmalı. */
export function oturumAnahtariGecerliMi(
  tuz: string,
  kimlik: Kimlik,
  yetki: string | undefined,
  simdi: number,
): boolean {
  const es = /^Bearer (\d{1,15})\.([0-9a-f]{64})$/.exec(yetki ?? '')
  if (!es?.[1] || !es[2]) return false
  const bitis = Number(es[1])
  if (!Number.isSafeInteger(bitis) || bitis <= simdi || bitis > simdi + OTURUM_SURESI_MS + SAAT_FARKI_MS) return false
  return esitMi(es[2], imzala(tuz, kimlik, bitis))
}
