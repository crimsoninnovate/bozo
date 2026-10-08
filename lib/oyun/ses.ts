import type { Olay } from './tipler.ts'

/*
 * Ses dili (spec §13): dosya yok, sesler Web Audio ile üretilir. Burada yalnız tanımlar
 * ve olay eşlemesi; sentez `components/oyun/sesCalar.ts`'te. Her ses birkaç katmandır:
 * çan tınısı (bakır tık, servis), süzgeçli gürültü (cızırtı, çevirme), alçak vuruş (yanık).
 */

export type SesAdi =
  | 'cizirti' | 'cevir' | 'tik' | 'tamKivam' | 'servis' | 'fisTamam'
  | 'yanik' | 'kalkti' | 'sonSaat' | 'gece' | 'kayip'

/** `ton`: osilatör frekansı; `gurultu`: süzgeç merkezi. `hzSon` verilirse üstel kayar. */
export type Katman = {
  tur: 'ton' | 'gurultu'
  dalga?: OscillatorType
  suzgec?: BiquadFilterType
  hz: number
  hzSon?: number
  ms: number
  gecikme?: number
  kazanc: number
}

/** Bakır çan: temel ton ve kısa süren uyumsuz üst ton. */
function zil(hz: number, ms: number, kazanc: number, gecikme = 0): Katman[] {
  return [
    { tur: 'ton', hz, ms, kazanc, gecikme },
    { tur: 'ton', hz: hz * 2.76, ms: ms / 2, kazanc: kazanc * 0.35, gecikme },
  ]
}

export const SESLER: Readonly<Record<SesAdi, readonly Katman[]>> = {
  cizirti: [
    { tur: 'gurultu', suzgec: 'highpass', hz: 2600, hzSon: 1400, ms: 380, kazanc: 0.08 },
    { tur: 'ton', hz: 150, hzSon: 70, ms: 90, kazanc: 0.12 },
  ],
  cevir: [{ tur: 'gurultu', hz: 500, hzSon: 2200, ms: 170, kazanc: 0.09 }],
  tik: zil(1320, 70, 0.08),
  tamKivam: [...zil(1568, 420, 0.1), ...zil(2349, 300, 0.06, 70)],
  servis: [...zil(659, 120, 0.1), ...zil(988, 200, 0.11, 100)],
  fisTamam: [...zil(784, 120, 0.1), ...zil(988, 120, 0.1, 110), ...zil(1319, 320, 0.11, 220)],
  yanik: [
    { tur: 'ton', dalga: 'triangle', hz: 120, hzSon: 55, ms: 240, kazanc: 0.15 },
    { tur: 'gurultu', suzgec: 'lowpass', hz: 900, ms: 140, kazanc: 0.1 },
  ],
  kalkti: [
    { tur: 'ton', dalga: 'triangle', hz: 392, hzSon: 330, ms: 150, kazanc: 0.1 },
    { tur: 'ton', dalga: 'triangle', hz: 294, hzSon: 247, ms: 260, kazanc: 0.1, gecikme: 150 },
  ],
  sonSaat: [
    { tur: 'ton', hz: 82, hzSon: 164, ms: 900, kazanc: 0.13 },
    { tur: 'gurultu', hz: 300, hzSon: 1200, ms: 900, kazanc: 0.05 },
  ],
  gece: [
    { tur: 'ton', hz: 392, ms: 900, kazanc: 0.08 },
    { tur: 'ton', hz: 494, ms: 800, kazanc: 0.08, gecikme: 60 },
    { tur: 'ton', hz: 587, ms: 700, kazanc: 0.08, gecikme: 120 },
  ],
  kayip: [{ tur: 'ton', dalga: 'triangle', hz: 330, hzSon: 165, ms: 700, kazanc: 0.12 }],
}

/** Olayın sesi; sessiz olaylar null. */
export function olayinSesi(olay: Olay): SesAdi | null {
  switch (olay.tur) {
    case 'sisKondu':
      return 'cizirti'
    case 'sisCevrildi':
      return 'cevir'
    case 'sisAlindi':
      return olay.kalite === 'tam' ? 'tamKivam' : 'tik'
    case 'sofraKuruldu':
    case 'ayranDoldu':
      return 'tik'
    case 'servis':
      return 'servis'
    case 'fisTamam':
      return 'fisTamam'
    case 'sisYandi':
    case 'sogudu':
      return 'yanik'
    case 'sofraKalkti':
      return olay.odedi ? null : 'kalkti'
    case 'evre':
      return olay.evre === 4 ? 'sonSaat' : null
    case 'bitti':
      return olay.sebep === 'gece' ? 'gece' : 'kayip'
    default:
      return null
  }
}

/** Karenin sesleri, her ad bir kez; fiş tamamlanınca onun akoru servis zilinin yerine çalar. */
export function sesSec(olaylar: readonly Olay[]): SesAdi[] {
  const secilen: SesAdi[] = []
  for (const olay of olaylar) {
    const ad = olayinSesi(olay)
    if (ad && !secilen.includes(ad)) secilen.push(ad)
  }
  return secilen.includes('fisTamam') ? secilen.filter((ad) => ad !== 'servis') : secilen
}
