import {
  KANALLAR,
  type BenYaniti,
  type BitirYaniti,
  type JetonYaniti,
  type Kanal,
  type OyuncuYaniti,
  type TabloYaniti,
} from './aktarim.ts'
import { tohumGecerliMi } from './tohum.ts'
import type { Girdi } from './tipler.ts'

/*
 * Skor sunucusunun tarayıcı istemcisi (spec §7, §10). Kök adres derleme zamanında gömülür;
 * yerel geliştirmede `NEXT_PUBLIC_OYUN_API=http://127.0.0.1:8402`. Her istek 4 sn'de düşer:
 * sunucuya ulaşılamazsa tur çevrimdışı oynanır, oyun beklemez.
 */
export const API_KOKU = (process.env.NEXT_PUBLIC_OYUN_API ?? 'https://api.cigercibozo.com').replace(/\/$/, '')
export const ZAMAN_ASIMI_MS = 4000

/** `durum` 0: ağ ya da zaman aşımı; `kod` sunucunun `{ hata }` alanı, yoksa 'ag'. */
export class ApiHatasi extends Error {
  durum: number
  kod: string
  constructor(durum: number, kod: string) {
    super(`${durum} ${kod}`)
    this.durum = durum
    this.kod = kod
  }
}

/** QR `/oyun/?k=sofra`, Instagram `/oyun/?k=ig`, ana sayfa bandı `/oyun/?k=site`; başka her şey 'yok'. */
export function kanalCoz(arama: string): Kanal {
  const k = new URLSearchParams(arama).get('k')
  return KANALLAR.find((kanal) => kanal === k) ?? 'yok'
}

/** Jeton yanıtı tarayıcıya girmeden doğrulanır: tohum uint32 değilse yanıt yok sayılır. */
export function jetonCoz(yanit: unknown): JetonYaniti | null {
  if (typeof yanit !== 'object' || yanit === null) return null
  const { turId, tohum, sonaErme } = yanit as Record<string, unknown>
  if (typeof turId !== 'string' || !/^[0-9a-f]{32}$/.test(turId)) return null
  if (!tohumGecerliMi(tohum) || typeof sonaErme !== 'string') return null
  return { turId, tohum, sonaErme }
}

type Secenek = { yontem?: 'GET' | 'POST' | 'DELETE'; govde?: unknown; anahtar?: string }

export function apiKur(kok: string, getir: typeof fetch) {
  async function istek<T>(yol: string, { yontem = 'GET', govde, anahtar }: Secenek = {}): Promise<T> {
    const basliklar: Record<string, string> = {}
    if (govde !== undefined) basliklar['Content-Type'] = 'application/json'
    if (anahtar) basliklar.Authorization = `Bearer ${anahtar}`
    let yanit: Response
    try {
      yanit = await getir(kok + yol, {
        method: yontem,
        headers: basliklar,
        body: govde === undefined ? undefined : JSON.stringify(govde),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      })
    } catch {
      throw new ApiHatasi(0, 'ag')
    }
    const metin = await yanit.text()
    const veri: unknown = metin ? JSON.parse(metin) : null
    if (!yanit.ok) {
      const kod = (veri as { hata?: unknown } | null)?.hata
      throw new ApiHatasi(yanit.status, typeof kod === 'string' ? kod : 'bilinmeyen')
    }
    return veri as T
  }

  return {
    async turAl(kanal: Kanal): Promise<JetonYaniti> {
      const jeton = jetonCoz(await istek<unknown>('/tur', { yontem: 'POST', govde: { kanal } }))
      if (!jeton) throw new ApiHatasi(0, 'bozukJeton')
      return jeton
    },
    oyuncuOl: (takmaAd: string, anahtar: string, onaySurumu: string) =>
      istek<OyuncuYaniti>('/oyuncu', { yontem: 'POST', govde: { takmaAd, anahtar, onaySurumu } }),
    turBitir: (turId: string, anahtar: string, girdiler: readonly Girdi[]) =>
      istek<BitirYaniti>(`/tur/${turId}/bitir`, { yontem: 'POST', govde: { girdiler }, anahtar }),
    tabloAl: () => istek<TabloYaniti>('/tablo'),
    benAl: (anahtar: string) => istek<BenYaniti>('/ben', { anahtar }),
    hesabiSil: (anahtar: string) => istek<void>('/oyuncu', { yontem: 'DELETE', anahtar }),
  }
}

export type Api = ReturnType<typeof apiKur>

export const api: Api = apiKur(API_KOKU, (girdi, secenek) => fetch(girdi, secenek))
