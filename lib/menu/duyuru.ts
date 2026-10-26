import { ZAMAN_DILIMI } from '../saat.ts'
import type { Duyuru } from './tipler.ts'

const bicim = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZAMAN_DILIMI, hourCycle: 'h23',
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
})

/** Girne duvar saati, 'YYYY-MM-DDTHH:mm': `Duyuru.bitis` ile sözlük sırasıyla karşılaştırılır. */
export function girneAnlik(simdi: Date): string {
  const p = Object.fromEntries(bicim.formatToParts(simdi).map((x) => [x.type, x.value]))
  return `${p['year']}-${p['month']}-${p['day']}T${p['hour']}:${p['minute']}`
}

/** Aktif, iki dilde de metin dolu ve bitiş yok ya da henüz gelmedi. */
export function duyuruGoster(d: Duyuru, simdi: Date): boolean {
  if (!d.aktif || d.metin.tr.trim() === '' || d.metin.en.trim() === '') return false
  return d.bitis === null || girneAnlik(simdi) < d.bitis
}
