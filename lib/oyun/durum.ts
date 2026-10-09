import { EN_COK_MISAFIR, EN_COK_OCAK, EVRELER, TABAK_SAYISI } from './ayar.ts'
import { geceKur } from './gece.ts'
import type { EvreAyari } from './ayar.ts'
import type { Kalem, Oyun } from './tipler.ts'

/** Tikin düştüğü evre; tur bittikten sonra son evrede kalır. */
export function evreBul(tik: number): number {
  const i = EVRELER.findIndex((e) => tik >= e.baslangic && tik < e.bitis)
  return i === -1 ? EVRELER.length - 1 : i
}

export function evreAyari(evre: number): EvreAyari {
  const ayar = EVRELER[evre]
  if (!ayar) throw new RangeError(`tanımsız evre: ${evre}`)
  return ayar
}

export function yeniOyun(tohum: number): Oyun {
  if (!Number.isInteger(tohum)) throw new RangeError(`tohum tamsayı olmalı: ${tohum}`)
  return {
    tik: 0,
    evre: 0,
    puan: 0,
    misafirler: Array.from({ length: EN_COK_MISAFIR }, () => null),
    ocak: Array.from({ length: EN_COK_OCAK }, () => null),
    tabaklar: Array.from({ length: TABAK_SAYISI }, () => []),
    el: null,
    paralar: Array.from({ length: EN_COK_MISAFIR }, () => null),
    kuyruk: [],
    gelecek: geceKur(tohum),
    kombo: 0,
    ozet: { misafir: 0, sis: 0, tamKivam: 0, enUzunKombo: 0, kalkan: 0, bahsis: 0 },
    bitti: null,
  }
}

/** Oturan, ödememiş misafirlerin istediği kalemlerden ocakta, tabaklarda ve elde olanlar düşülür: raf rehberi ve botlar. */
export function eksikKalemler(oyun: Oyun): Kalem[] {
  const istenen = oyun.misafirler.flatMap((m) => (m && m.kalkis === null ? [...m.misafir.fis] : []))
  const hazirlanan: Kalem[] = [
    ...oyun.ocak.flatMap((s) => (s ? [s.urun] : [])),
    ...oyun.tabaklar.flatMap((t) => t.map((k) => k.urun)),
    ...(oyun.el && oyun.el.tur !== 'tabak' ? [oyun.el.urun] : []),
  ]
  for (const urun of hazirlanan) {
    const i = istenen.indexOf(urun)
    if (i !== -1) istenen.splice(i, 1)
  }
  return istenen
}
