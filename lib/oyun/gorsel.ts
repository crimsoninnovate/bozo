import { komboCarpani } from './puan.ts'
import type { OcakSisi, Oyun, Urun } from './tipler.ts'

/*
 * Görsel dilin saf hesapları (spec §12-§13): tane rengi, kor ışığı, sabır halkası,
 * fişteki servis işaretleri. Oyun durumunu değiştirmez; yalnız ekran çağırır.
 */

/** Tanenin kremden bakıra dönüşü: 0 çiğ, 1 pişti; alma penceresinde 1'de kalır. */
export function pismeOrani(sis: OcakSisi): number {
  return Math.min(1, sis.gecen / sis.pisme)
}

/** Alma penceresinde kömüre yaklaşma: 0 pencere başı, 1 yanma anı; pişmeden önce 0. */
export function yanmaOrani(sis: OcakSisi): number {
  if (sis.gecen < sis.pisme) return 0
  return Math.min(1, (sis.gecen - sis.pisme) / sis.pencere)
}

/** Ocağın kor ışığı (0-1): kombo kademesiyle bir basamak ısınır (×1 0.25 ... ×4 1). */
export function korYogunlugu(kombo: number): number {
  return komboCarpani(kombo) / 4
}

/** Kıvılcım yalnız ocakta şiş varken; yoğunluğu kor ışığı belirler. */
export function kivilcimYogunlugu(oyun: Oyun): number {
  return oyun.ocak.some((s) => s !== null) ? korYogunlugu(oyun.kombo) : 0
}

/** Kalan sabrın bu payının altında halka kızarır (spec §12). */
export const SABIR_ESIGI = 0.3

export function sabirDurumu(oran: number): 'var' | 'az' {
  return oran <= SABIR_ESIGI ? 'az' : 'var'
}

function sayim(urunler: readonly Urun[]): Map<Urun, number> {
  const m = new Map<Urun, number>()
  for (const u of urunler) m.set(u, (m.get(u) ?? 0) + 1)
  return m
}

/**
 * Fişin her kalemi için servis edildi mi: aynı üründen önce yazılanlar önce servis
 * sayılır. `fis` misafirin tam fişi, `kalan` henüz gelmeyenler.
 */
export function servisEdilenler(fis: readonly Urun[], kalan: readonly Urun[]): boolean[] {
  const fisSayisi = sayim(fis)
  const kalanSayisi = sayim(kalan)
  const gorulen = new Map<Urun, number>()
  return fis.map((u) => {
    const sira = gorulen.get(u) ?? 0
    gorulen.set(u, sira + 1)
    return sira < (fisSayisi.get(u) ?? 0) - (kalanSayisi.get(u) ?? 0)
  })
}

export type FisSatiri =
  | { tur: 'karisik'; servis: readonly [boolean, boolean, boolean] }
  | { tur: 'urun'; urun: Urun; kalan: number }

/**
 * Fişin ekranda gösterilen satırları: aynı ürün tek satırda, yanında henüz gelmeyen adet.
 * Karışık fişte ilk üç kalem (ciğer, dalak, yürek) tek kümedir, servisleri ayrı taşınır.
 */
export function fisSatirlari(fis: readonly Urun[], kalan: readonly Urun[], karisik: boolean): FisSatiri[] {
  const servis = servisEdilenler(fis, kalan)
  const bekleyen = sayim(kalan)
  const satirlar: FisSatiri[] = []
  if (karisik) {
    fis.slice(0, 3).forEach((u, i) => {
      if (!servis[i]) bekleyen.set(u, (bekleyen.get(u) ?? 1) - 1)
    })
    satirlar.push({ tur: 'karisik', servis: [servis[0]!, servis[1]!, servis[2]!] })
  }
  for (const urun of new Set(fis.slice(karisik ? 3 : 0))) {
    satirlar.push({ tur: 'urun', urun, kalan: bekleyen.get(urun) ?? 0 })
  }
  return satirlar
}
