import type { SiraBilgisi, TabloSatiri } from '../lib/oyun/aktarim.ts'
import type { SiraSatiri } from './depo.ts'

type Siralanabilir = Pick<SiraSatiri, 'puan' | 'tamKivam' | 'kalkan' | 'olusturma'>

/** Beraberlik (spec §6): puan, tam kıvam sayısı, küsüp kalkan misafir azlığı, önce gönderen. */
export function karsilastir(a: Siralanabilir, b: Siralanabilir): number {
  return b.puan - a.puan || b.tamKivam - a.tamKivam || a.kalkan - b.kalkan || a.olusturma - b.olusturma
}

/** Her oyuncunun en iyi turu seçilir ve §6 sırasına dizilir; depolar ham tur listesi verebilir. */
export function enIyiler(turlar: readonly SiraSatiri[]): SiraSatiri[] {
  const enIyi = new Map<number, SiraSatiri>()
  for (const tur of turlar) {
    const onceki = enIyi.get(tur.oyuncuId)
    if (!onceki || karsilastir(tur, onceki) < 0) enIyi.set(tur.oyuncuId, tur)
  }
  return [...enIyi.values()].sort(karsilastir)
}

/** Oyuncunun sırası (1'den) ve bir üsttekine kalan puan; sırada değilse null. */
export function oyuncununSirasi(sirali: readonly SiraSatiri[], oyuncuId: number): SiraBilgisi | null {
  const i = sirali.findIndex((s) => s.oyuncuId === oyuncuId)
  if (i === -1) return null
  const satir = sirali[i] as SiraSatiri
  const ustteki = sirali[i - 1]
  return { puan: satir.puan, sira: i + 1, ustekiFark: ustteki ? ustteki.puan - satir.puan : null }
}

/** Herkese açık tablo: gizlenen ad null gider, sunucu adı hiç yazmaz. */
export function tabloSatirlari(sirali: readonly SiraSatiri[], adet: number): TabloSatiri[] {
  return sirali.slice(0, adet).map((s, i) => ({
    sira: i + 1,
    takmaAd: s.gizli ? null : s.takmaAd,
    puan: s.puan,
    tamKivam: s.tamKivam,
  }))
}
