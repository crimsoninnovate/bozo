import { ACILDIGI_EVRE, OYUN_SAATI_TIK, TUR_TIK } from './ayar.ts'
import { evreAyari } from './durum.ts'
import type { Hedef, Kalite, OcakSisi, Oyun, SisUrun, Urun } from './tipler.ts'

/*
 * Simülasyonun ekrana dönük okumaları. Saf fonksiyonlar: oyun durumunu değiştirmez,
 * yalnız oyun ekranı çağırır. Kesirli sayılar burada serbesttir, simülasyona dönmez.
 */

/** Tikten oyun saati: 0 → '21:00', 7200 → '05:00'. */
export function oyunSaati(tik: number): string {
  const dakika = Math.floor((Math.min(Math.max(tik, 0), TUR_TIK) * 60) / OYUN_SAATI_TIK)
  const saat = (21 + Math.floor(dakika / 60)) % 24
  return `${String(saat).padStart(2, '0')}:${String(dakika % 60).padStart(2, '0')}`
}

export type SisGorunumu = 'pisiyor' | 'centik' | 'hazir' | 'kivam'

/** Rayın o anki hali: çevirme bandı, alma penceresi, ve çevrilmiş şişte tam kıvam bandı. */
export function sisGorunumu(sis: OcakSisi): SisGorunumu {
  if (sis.gecen < sis.pisme) {
    const bantta = Math.abs(2 * sis.gecen - sis.pisme) <= sis.bant
    return sis.cevirme === 'yok' && bantta ? 'centik' : 'pisiyor'
  }
  const kivamda = Math.abs(2 * (sis.gecen - sis.pisme) - sis.pencere) <= sis.bant
  return sis.cevirme === 'iyi' && kivamda ? 'kivam' : 'hazir'
}

export type Goruntu = {
  acikSofra: number
  acikOcak: number
  raf: readonly SisUrun[]
  kapida: number
  sofralar: ({ fis: readonly Urun[]; kalan: readonly Urun[]; kurulu: boolean; odedi: boolean } | null)[]
  /** Çentik ve pencere başlangıcı rayın kesri olarak (0-1). */
  ocak: ({ urun: SisUrun; centik: number; pencere: number; cevirme: OcakSisi['cevirme'] } | null)[]
  tezgah: ({ urun: Urun; kalite: Kalite | null } | null)[]
  ayran: 'bos' | 'doluyor' | 'bekliyor'
}

/** React'in çizdiği yapı: yalnız olay olunca değişen kısım. */
export function goruntuAl(oyun: Oyun): Goruntu {
  const ayar = evreAyari(oyun.evre)
  return {
    acikSofra: ayar.sofra,
    acikOcak: ayar.ocak,
    raf: (['ciger', 'dalak', 'yurek'] as const).filter((u) => ACILDIGI_EVRE[u] <= oyun.evre),
    kapida: oyun.kuyruk.length,
    sofralar: oyun.sofralar.map((s) =>
      s ? { fis: s.misafir.fis, kalan: [...s.kalan], kurulu: s.kurulu, odedi: s.kalkis !== null } : null,
    ),
    ocak: oyun.ocak.map((s) => {
      if (!s) return null
      const ray = s.pisme + s.pencere
      return { urun: s.urun, centik: s.pisme / 2 / ray, pencere: s.pisme / ray, cevirme: s.cevirme }
    }),
    tezgah: oyun.tezgah.map((k) => (k ? { urun: k.urun, kalite: k.kalite } : null)),
    ayran: oyun.ayran === null ? 'bos' : oyun.ayran > 0 ? 'doluyor' : 'bekliyor',
  }
}

const SISLER: readonly Urun[] = ['ciger', 'dalak', 'yurek']

/** Ocaktaki şiş için yapılacak bir hamle var mı: çevir, tam kıvamda al ya da yanmadan al. */
function ocakHamlesiVar(sis: OcakSisi): boolean {
  const gorunum = sisGorunumu(sis)
  if (gorunum === 'centik' || gorunum === 'kivam') return true
  if (gorunum !== 'hazir') return false
  return sis.cevirme !== 'iyi' || 2 * (sis.gecen - sis.pisme) > sis.pencere
}

/**
 * Tarayıcıdaki ilk turda yönlendirmeli iki misafirin bir sonraki doğru dokunuşu
 * (spec §3); beklenecek anda ve diğer misafirlerde null.
 */
export function ipucuHedefi(oyun: Oyun): Hedef | null {
  const no = oyun.sofralar.findIndex((s) => s !== null && s.misafir.no < 2 && s.kalkis === null)
  const sofra = oyun.sofralar[no]
  if (!sofra) return null
  const sofraHedefi = `s${no}` as Hedef
  if (!sofra.kurulu) return sofraHedefi
  if (oyun.tezgah.some((k) => k && sofra.kalan.includes(k.urun))) return sofraHedefi
  const yuva = oyun.ocak.findIndex((s) => s !== null && sofra.kalan.includes(s.urun) && ocakHamlesiVar(s))
  if (yuva !== -1) return `o${yuva}` as Hedef
  const hazirlanan = [...oyun.ocak.flatMap((s) => (s ? [s.urun] : [])), ...(oyun.ayran !== null ? ['ayran'] : [])]
  const eksik = sofra.kalan.find((u) => !hazirlanan.includes(u))
  if (!eksik) return null
  return SISLER.includes(eksik) ? (eksik as SisUrun) : 'ayran'
}
