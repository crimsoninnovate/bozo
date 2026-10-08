import { yeniOyun } from './durum.ts'
import { ilerle } from './motor.ts'
import type { Girdi, Hedef, Olay, Oyun } from './tipler.ts'

/** Oyun ekranının simülasyonu: dokunuş bir sonraki tikte işlenir ve kayda geçer. */
export type CanliOyun = { oyun: Oyun; kayit: Girdi[]; bekleyen: Hedef[] }

export function canliBaslat(tohum: number): CanliOyun {
  return { oyun: yeniOyun(tohum), kayit: [], bekleyen: [] }
}

/** Dokunuşu sıraya alır. Aynı hedefe aynı tikte ikinci dokunuş düşer (spec §9). */
export function canliDokun(canli: CanliOyun, hedef: Hedef): void {
  if (canli.oyun.bitti || canli.bekleyen.includes(hedef)) return
  canli.bekleyen.push(hedef)
}

/** Bir tik: bekleyen dokunuşlar o tikin numarasıyla kaydedilir, sonra işlenir. */
export function canliAdim(canli: CanliOyun): Olay[] {
  const hedefler = canli.bekleyen.splice(0)
  for (const hedef of hedefler) canli.kayit.push([canli.oyun.tik, hedef])
  return ilerle(canli.oyun, hedefler)
}
