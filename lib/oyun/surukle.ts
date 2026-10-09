import type { Elde, Hedef } from './tipler.ts'

/*
 * Sürükleme durum makinesi (spec tabak §3). Simülasyon için sürükleme yoktur: her jest `tut` ve bir
 * hedef ya da `birak` girdisine iner. DOM yok; `useSurukleme.ts` işaretçiyi buraya çevirir.
 */

/** Parmak bu kadar yürürse öğe parmağa yapışır; altı dokun-dokun sayılır. */
export const ESIK_PX = 8
/** Sürüklenen öğe parmağın bu kadar üstünde durur ki görünsün. */
export const KALDIRMA_PX = 12

export type Isaret =
  | { tur: 'bas'; id: number; hedef: Hedef | null; x: number; y: number }
  | { tur: 'yuru'; id: number; x: number; y: number }
  | { tur: 'kaldir'; id: number; hedef: Hedef | null; x: number; y: number }
  | { tur: 'iptal'; id: number }
  | { tur: 'dokun'; hedef: Hedef }
  | { tur: 'birak' }

export type Surukleme =
  | { tur: 'bos' }
  | { tur: 'basili'; id: number; kaynak: Hedef; x0: number; y0: number; suruklendi: boolean }

/** Simülasyonun eli: tutulan öğenin kaynağı (`eldeKaynagi`) ya da null. */
export type Baglam = { elde: Hedef | null }

export type SuruklemeSonucu = {
  durum: Surukleme
  girdiler: Hedef[]
  /** Sürüklenen öğenin basılan noktaya göre ötelemesi; sürükleme yokken null. */
  tasima: { dx: number; dy: number } | null
}

const KAYNAK = /^(o[0-3]|t[01]|domates|sogan)$/
const DOKUNMA = /^(ciger|dalak|yurek|p[0-2])$/

export const kaynakMi = (h: Hedef): boolean => KAYNAK.test(h)

/** Eldeki türe göre bırakma hedefi: şiş ve eşlikçi tabağa ya da çöpe, tabak misafire ya da çöpe. */
export function birakmaHedefiMi(elde: Hedef, h: Hedef): boolean {
  if (h === 'cop') return true
  return elde.startsWith('t') ? /^m[0-2]$/.test(h) : /^t[01]$/.test(h)
}

/** Ekranın sürüklediği öğe hangi düğmede durur. */
export function eldeKaynagi(el: Elde): Hedef | null {
  if (!el) return null
  if (el.tur === 'sis') return `o${el.yuva}` as Hedef
  if (el.tur === 'eslikci') return el.urun
  return `t${el.no}` as Hedef
}

const bos = (girdiler: Hedef[] = []): SuruklemeSonucu => ({ durum: { tur: 'bos' }, girdiler, tasima: null })
const ayni = (durum: Surukleme): SuruklemeSonucu => ({ durum, girdiler: [], tasima: null })

function basma(i: Extract<Isaret, { tur: 'bas' }>, elde: Hedef | null): SuruklemeSonucu {
  const tut = (kaynak: Hedef, girdiler: Hedef[]): SuruklemeSonucu => ({
    durum: { tur: 'basili', id: i.id, kaynak, x0: i.x, y0: i.y, suruklendi: false },
    girdiler,
    tasima: null,
  })
  if (elde === null) {
    if (i.hedef === null) return bos()
    if (kaynakMi(i.hedef)) return tut(i.hedef, [i.hedef])
    return bos(DOKUNMA.test(i.hedef) ? [i.hedef] : [])
  }
  if (i.hedef === null) return bos(['birak'])
  if (i.hedef === elde) return tut(elde, [])
  if (birakmaHedefiMi(elde, i.hedef) || DOKUNMA.test(i.hedef)) return bos([i.hedef])
  return bos()
}

function yurume(durum: Surukleme, i: Extract<Isaret, { tur: 'yuru' }>, elde: Hedef | null): SuruklemeSonucu {
  if (durum.tur !== 'basili' || durum.id !== i.id) return ayni(durum)
  const dx = i.x - durum.x0
  const dy = i.y - durum.y0
  const suruklendi = durum.suruklendi || Math.hypot(dx, dy) >= ESIK_PX
  const yeni = suruklendi === durum.suruklendi ? durum : { ...durum, suruklendi }
  return { durum: yeni, girdiler: [], tasima: suruklendi && elde !== null ? { dx, dy: dy - KALDIRMA_PX } : null }
}

function kaldirma(durum: Surukleme, i: Extract<Isaret, { tur: 'kaldir' }>, elde: Hedef | null): SuruklemeSonucu {
  if (durum.tur !== 'basili' || durum.id !== i.id) return ayni(durum)
  if (!durum.suruklendi || elde === null) return bos()
  if (i.hedef === null) return bos(['birak'])
  return bos(birakmaHedefiMi(elde, i.hedef) ? [i.hedef] : [])
}

/** Her işaret için yeni durum, simülasyona gidecek girdiler ve taşıma ötelemesi. */
export function surukle(durum: Surukleme, isaret: Isaret, { elde }: Baglam): SuruklemeSonucu {
  switch (isaret.tur) {
    case 'bas':
      return durum.tur === 'bos' ? basma(isaret, elde) : ayni(durum)
    case 'yuru':
      return yurume(durum, isaret, elde)
    case 'kaldir':
      return kaldirma(durum, isaret, elde)
    case 'iptal':
      return durum.tur === 'basili' && durum.id === isaret.id ? bos(elde ? ['birak'] : []) : ayni(durum)
    case 'dokun':
      return { ...basma({ tur: 'bas', id: -1, hedef: isaret.hedef, x: 0, y: 0 }, elde), durum: { tur: 'bos' } }
    case 'birak':
      return bos(elde ? ['birak'] : [])
  }
}
