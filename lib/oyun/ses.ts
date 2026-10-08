import type { Olay } from './tipler.ts'

/*
 * Ses dili (spec §13): dosya yok, beş ses Web Audio ile üretilir. Burada yalnız
 * tanımlar ve olay eşlemesi; sentez `components/oyun/sesCalar.ts`'te.
 */

export type SesAdi = 'cizirti' | 'tik' | 'servis' | 'yanik' | 'sonSaat'

export type Nota = { hz: number; ms: number }
export type SesTanimi = { tur: 'ton' | 'gurultu'; notalar: readonly Nota[]; kazanc: number }

/** Kor cızırtısı, bakır tık, servis için iki nota, yanık için alçak vuruş, son saat için derin ton. */
export const SESLER: Readonly<Record<SesAdi, SesTanimi>> = {
  cizirti: { tur: 'gurultu', notalar: [{ hz: 1800, ms: 220 }], kazanc: 0.12 },
  tik: { tur: 'ton', notalar: [{ hz: 1320, ms: 40 }], kazanc: 0.1 },
  servis: { tur: 'ton', notalar: [{ hz: 659, ms: 90 }, { hz: 988, ms: 140 }], kazanc: 0.12 },
  yanik: { tur: 'ton', notalar: [{ hz: 110, ms: 180 }], kazanc: 0.16 },
  sonSaat: { tur: 'ton', notalar: [{ hz: 82, ms: 900 }], kazanc: 0.14 },
}

/** Olayın sesi; sessiz olaylar null. */
export function olayinSesi(olay: Olay): SesAdi | null {
  switch (olay.tur) {
    case 'sisKondu':
      return 'cizirti'
    case 'sisCevrildi':
    case 'sisAlindi':
    case 'sofraKuruldu':
    case 'ayranDoldu':
      return 'tik'
    case 'servis':
      return 'servis'
    case 'sisYandi':
    case 'sogudu':
      return 'yanik'
    case 'sofraKalkti':
      return olay.odedi ? null : 'yanik'
    case 'evre':
      return olay.evre === 4 ? 'sonSaat' : null
    default:
      return null
  }
}

/** Karenin sesleri, her ad bir kez: aynı karede iki servis tek çift nota çalar. */
export function sesSec(olaylar: readonly Olay[]): SesAdi[] {
  const secilen: SesAdi[] = []
  for (const olay of olaylar) {
    const ad = olayinSesi(olay)
    if (ad && !secilen.includes(ad)) secilen.push(ad)
  }
  return secilen
}
