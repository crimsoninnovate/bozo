import { EN_COK_OCAK, EN_COK_SOFRA, EVRELER, TEZGAH_YUVASI } from './ayar.ts'
import { geceKur } from './gece.ts'
import type { EvreAyari } from './ayar.ts'
import type { Oyun } from './tipler.ts'

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
    sofralar: Array.from({ length: EN_COK_SOFRA }, () => null),
    ocak: Array.from({ length: EN_COK_OCAK }, () => null),
    tezgah: Array.from({ length: TEZGAH_YUVASI }, () => null),
    ayran: null,
    kuyruk: [],
    gelecek: geceKur(tohum),
    kombo: 0,
    porsiyonDizisi: 0,
    ozet: { sofra: 0, sis: 0, tamKivam: 0, enUzunKombo: 0, kalkan: 0 },
    bitti: null,
  }
}
