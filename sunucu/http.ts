import type { IncomingMessage, ServerResponse } from 'node:http'
import { GOVDE_SINIRI } from '../lib/oyun/aktarim.ts'

/* `node:http` üstündeki ince katman: gövde sınırı, JSON, CORS, kimlik başlıkları. */

export class IstekHatasi extends Error {
  durum: number
  kod: string
  constructor(durum: number, kod: string) {
    super(kod)
    this.durum = durum
    this.kod = kod
  }
}

export type Istek = {
  yontem: string
  yol: string
  sorgu: URLSearchParams
  basliklar: IncomingMessage['headers']
  ip: string
  govde(): Promise<unknown>
}

export type Yanit = { durum: number; govde?: unknown; basliklar?: Record<string, string> }

/** Gövdeyi en çok `sinir` bayt okur (spec §9: 64 KB); aşarsa okumayı durdurur ve 413 döner. */
export function govdeOku(req: IncomingMessage, sinir = GOVDE_SINIRI): Promise<unknown> {
  return new Promise((coz, reddet) => {
    const parcalar: Buffer[] = []
    let toplam = 0
    req.on('data', (parca: Buffer) => {
      toplam += parca.length
      if (toplam > sinir) {
        req.pause()
        reddet(new IstekHatasi(413, 'govdeBuyuk'))
        return
      }
      parcalar.push(parca)
    })
    req.on('end', () => {
      const metin = Buffer.concat(parcalar).toString('utf8')
      if (metin.trim() === '') return coz(null)
      try {
        coz(JSON.parse(metin))
      } catch {
        reddet(new IstekHatasi(400, 'bozukJson'))
      }
    })
    req.on('error', () => reddet(new IstekHatasi(400, 'govdeOkunamadi')))
  })
}

/** CORS yalnız izinli kökene (spec §10); izinli değilse başlık yazılmaz ve tarayıcı yanıtı okuyamaz. */
export function corsBasliklari(koken: string | undefined, izinliler: readonly string[]): Record<string, string> {
  if (!koken || !izinliler.includes(koken)) return {}
  return {
    'Access-Control-Allow-Origin': koken,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  }
}

export function yanitYaz(res: ServerResponse, yanit: Yanit, ek: Record<string, string>): void {
  const basliklar: Record<string, string> = {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...ek,
    ...yanit.basliklar,
  }
  // Okunmamış gövde kalan bağlantı yeniden kullanılmaz.
  if (yanit.durum === 413) basliklar.Connection = 'close'
  if (yanit.govde === undefined) {
    res.writeHead(yanit.durum, basliklar)
    res.end()
    return
  }
  const metin = JSON.stringify(yanit.govde)
  res.writeHead(yanit.durum, { ...basliklar, 'Content-Type': 'application/json; charset=utf-8' })
  res.end(metin)
}

export function bearer(yetki: string | undefined): string | null {
  const es = /^Bearer\s+([0-9a-f]{32})$/i.exec(yetki ?? '')
  return es?.[1]?.toLowerCase() ?? null
}

export function temelKimlik(yetki: string | undefined): { kullanici: string; sifre: string } | null {
  const es = /^Basic\s+([A-Za-z0-9+/=]+)$/.exec(yetki ?? '')
  if (!es?.[1]) return null
  const [kullanici, ...sifre] = Buffer.from(es[1], 'base64').toString('utf8').split(':')
  if (!kullanici || sifre.length === 0) return null
  return { kullanici, sifre: sifre.join(':') }
}
