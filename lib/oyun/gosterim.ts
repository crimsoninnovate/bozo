import { ACILDIGI_EVRE, KASELER, OYUN_SAATI_TIK, RAF, TUR_TIK } from './ayar.ts'
import { eksikKalemler, evreAyari } from './durum.ts'
import { sisKalitesi } from './ocak.ts'
import type { Elde, Eslikci, Kalem, OcakSisi, Oyun, TabakKalemi, Urun } from './tipler.ts'

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

export type SisGorunumu = 'pisiyor' | 'hazir' | 'kivam'

/** Rayın o anki hali: pişiyor, alma penceresi (hazır), pencerenin ortasındaki tam kıvam bandı. */
export function sisGorunumu(sis: OcakSisi): SisGorunumu {
  if (sis.gecen < sis.pisme) return 'pisiyor'
  return sisKalitesi(sis) === 'tam' ? 'kivam' : 'hazir'
}

export type Goruntu = {
  acikMisafir: number
  acikOcak: number
  raf: readonly Urun[]
  kaseler: readonly Eslikci[]
  /** Misafirlerin beklediği ve henüz hazırlanmayan kalemler: raf düğmesi ve kase parlar (raf rehberi). */
  rafIstenen: readonly Urun[]
  kaseIstenen: readonly Eslikci[]
  kapida: number
  /** `varyant`: üç yüzsüz siluetten hangisi (misafir no mod 3). */
  misafirler: ({ fis: readonly Kalem[]; karisik: boolean; odedi: boolean; varyant: number } | null)[]
  paralar: (number | null)[]
  /** Rayın kesirleri (0-1): alma penceresinin başı, tam kıvam bandının ortası ve genişliği. */
  ocak: ({ urun: Urun; pencere: number; kivam: number; bant: number } | null)[]
  tabaklar: readonly (readonly TabakKalemi[])[]
  el: Elde
}

/** React'in çizdiği yapı: yalnız olay olunca değişen kısım. Kopyalar döner; simülasyonla paylaşılan dizi yok. */
export function goruntuAl(oyun: Oyun): Goruntu {
  const ayar = evreAyari(oyun.evre)
  const eksik = eksikKalemler(oyun)
  return {
    acikMisafir: ayar.misafir,
    acikOcak: ayar.ocak,
    raf: RAF.filter((u) => ACILDIGI_EVRE[u] <= oyun.evre),
    kaseler: KASELER.filter((e) => ACILDIGI_EVRE[e] <= oyun.evre),
    rafIstenen: RAF.filter((u) => eksik.includes(u)),
    kaseIstenen: KASELER.filter((e) => eksik.includes(e)),
    kapida: oyun.kuyruk.length,
    misafirler: oyun.misafirler.map((m) =>
      m ? { fis: m.misafir.fis, karisik: m.misafir.karisik, odedi: m.kalkis !== null, varyant: m.misafir.no % 3 } : null,
    ),
    paralar: oyun.paralar.map((p) => (p ? p.tutar : null)),
    ocak: oyun.ocak.map((s) => {
      if (!s) return null
      const ray = s.pisme + s.pencere
      return { urun: s.urun, pencere: s.pisme / ray, kivam: (s.pisme + s.pencere / 2) / ray, bant: s.bant / ray }
    }),
    tabaklar: oyun.tabaklar.map((t) => t.map((k) => ({ ...k }))),
    el: oyun.el ? { ...oyun.el } : null,
  }
}
