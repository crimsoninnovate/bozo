import { simule } from './motor.ts'
import type { Girdi } from './tipler.ts'

/* Personel ekranının saf parçaları: geçen haftanın anahtarı ve turun yeniden oynatılması (spec §9). */

const GUN_MS = 86_400_000

/** Dönem anahtarı başladığı Pazartesi'nin tarihidir; bir önceki dönem yedi takvim günü geridedir. */
export function oncekiDonem(donem: string): string {
  return new Date(Date.parse(`${donem}T00:00:00Z`) - 7 * GUN_MS).toISOString().slice(0, 10)
}

export type Dogrulama = { durum: 'tutuyor' | 'tutmuyor'; puan: number } | { durum: 'kayitYok'; puan: null }

/** Sunucunun yaptığını tarayıcıda tekrarlar: kayıt tohumla baştan oynanır, puan karşılaştırılır. */
export function turuDogrula(tur: { tohum: number; puan: number; girdiler: readonly Girdi[] | null }): Dogrulama {
  if (!tur.girdiler) return { durum: 'kayitYok', puan: null }
  const { puan } = simule(tur.tohum, tur.girdiler)
  return { durum: puan === tur.puan ? 'tutuyor' : 'tutmuyor', puan }
}
