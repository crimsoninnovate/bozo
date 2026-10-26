import { ZAMAN_DILIMI } from '../saat.ts'
import type { Duyuru, MenuBelgesi } from './tipler.ts'

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

/** Canlı belge varsa onun duyurusu, yoksa derlenmiş `baz`; gösterilmeyecekse `aktif: false` döner. */
export function duyuruKarari(baz: Duyuru, canli: MenuBelgesi | null, simdi: Date): Duyuru {
  const secilen = canli === null ? baz : canli.duyuru
  return duyuruGoster(secilen, simdi) ? secilen : { ...secilen, aktif: false }
}

/** Kapatma anahtarı: metin değişince özet değişir, önceki kapatma geçersiz olur (FNV-1a, 32 bit). */
export function metinOzeti(d: Duyuru): string {
  let h = 0x811c9dc5
  for (const c of `${d.metin.tr}\u0000${d.metin.en}`) h = Math.imul(h ^ c.codePointAt(0)!, 0x01000193) >>> 0
  return h.toString(36)
}

const EN_FAZLA_DENEME = 2

/**
 * Bir sayfa oturumunun (tam yükleme) son canlı belgesi: istemci tarafı gezintide kabuk yeniden
 * kurulur, bu yüzden bant ilk durumunu buradan alır ve belge bir daha istenmez. Başarısız istek
 * canlı sayılmaz; bir kez daha denenir, sonra durur.
 */
export function canliOturumu() {
  let son: MenuBelgesi | null = null
  let basarisiz = 0
  return {
    belge: (): MenuBelgesi | null => son,
    getirmeli: (): boolean => son === null && basarisiz < EN_FAZLA_DENEME,
    kaydet(belge: MenuBelgesi | null): void {
      if (belge === null) basarisiz += 1
      else son = belge
    },
  }
}
