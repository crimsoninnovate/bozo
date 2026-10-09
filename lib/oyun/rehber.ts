import type { Hedef, Olay, Oyun } from './tipler.ts'

/*
 * Rehberli ilk tur (spec tabak §7): saf durum makinesi. Simülasyonu değiştirmez; hangi adımda
 * saatin durduğunu ve hangi girdiye izin verildiğini söyler. Reddedilen girdi kayda girmez.
 */
export type RehberAdimi =
  | 'bekle' | 'fis' | 'raf' | 'pisiyor' | 'hazir' | 'tabak' | 'misafir' | 'para' | 'ikinci' | 'eslikci' | 'bitti'
export type Rehber = { adim: RehberAdimi }

const IZIN: Readonly<Partial<Record<RehberAdimi, readonly Hedef[]>>> = {
  raf: ['ciger'],
  hazir: ['o0'],
  tabak: ['t0'],
  misafir: ['t0', 'm0'],
  para: ['p0'],
  // Adım açılırken elde tabak olabilir: bırakma, çöp ve teslim de geçer, yoksa adım kilitlenir.
  eslikci: ['domates', 't0', 't1', 'm0', 'm1', 'cop', 'birak'],
}

const DURAN: ReadonlySet<RehberAdimi> = new Set(['fis', 'raf', 'hazir', 'misafir', 'para', 'eslikci'])

export const rehberBasla = (): Rehber => ({ adim: 'bekle' })
export const rehberAtla = (r: Rehber): Rehber => (r.adim === 'bitti' ? r : { adim: 'bitti' })
/** Oyuncunun "Tamam" demesiyle fiş adımından rafa geçilir. */
export const rehberTamam = (r: Rehber): Rehber => (r.adim === 'fis' ? { adim: 'raf' } : r)
/** Bu adımlarda saat girdiyi bekler; `tabak` ve `ikinci` akar. */
export const rehberDurdurur = (r: Rehber): boolean => DURAN.has(r.adim)

/** Adımın izin verdiği girdi; serbest adımlarda (`ikinci`, `bitti`) hepsi. `birak` hiçbir öğretici adımda geçmez. */
export function rehberIzni(r: Rehber, hedef: Hedef): boolean {
  if (r.adim === 'ikinci' || r.adim === 'bitti') return true
  return IZIN[r.adim]?.includes(hedef) ?? false
}

const olayVar = (olaylar: readonly Olay[], tur: Olay['tur']): boolean => olaylar.some((o) => o.tur === tur)
const hazirMi = (oyun: Oyun): boolean => oyun.ocak.some((s) => s !== null && s.gecen >= s.pisme)

function sonraki(r: Rehber, oyun: Oyun, olaylar: readonly Olay[]): RehberAdimi {
  if (oyun.bitti) return 'bitti'
  switch (r.adim) {
    case 'bekle':
      return oyun.misafirler[0] ? 'fis' : 'bekle'
    case 'raf':
      return olayVar(olaylar, 'sisKondu') ? 'pisiyor' : 'raf'
    case 'pisiyor':
      return hazirMi(oyun) ? 'hazir' : 'pisiyor'
    case 'hazir':
      return olayVar(olaylar, 'tutuldu') ? 'tabak' : 'hazir'
    case 'tabak':
      return olayVar(olaylar, 'tabagaKondu') ? 'misafir' : 'tabak'
    case 'misafir':
      return olayVar(olaylar, 'teslim') ? 'para' : 'misafir'
    case 'para':
      return olayVar(olaylar, 'bahsisAlindi') ? 'ikinci' : 'para'
    case 'ikinci':
      return oyun.misafirler.some((m) => m?.misafir.no === 1) ? 'eslikci' : 'ikinci'
    case 'eslikci':
      return olaylar.some((o) => o.tur === 'tabagaKondu' && o.kalem.urun === 'domates') ? 'bitti' : 'eslikci'
    default:
      return r.adim
  }
}

/** Her karede, o karenin olaylarıyla; adım değişmediyse aynı nesne döner. */
export function rehberIlerle(r: Rehber, oyun: Oyun, olaylar: readonly Olay[]): Rehber {
  const adim = sonraki(r, oyun, olaylar)
  return adim === r.adim ? r : { adim }
}
