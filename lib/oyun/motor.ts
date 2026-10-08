import { KAYIP_SINIRI, PUAN, TUR_TIK } from './ayar.ts'
import { evreBul } from './durum.ts'
import { ayranaDokun, ayranIlerle, ocagaDokun, ocakIlerle, rafaDokun, tezgahIlerle } from './ocak.ts'
import { gelisleriAl, kuyruguOturt, sofralariIlerle, sofrayaDokun } from './sofra.ts'
import type { Hedef, Olay, Oyun } from './tipler.ts'

function dokun(oyun: Oyun, hedef: Hedef, olaylar: Olay[]): void {
  if (hedef === 'ayran') return ayranaDokun(oyun)
  if (hedef === 'ciger' || hedef === 'dalak' || hedef === 'yurek') return rafaDokun(oyun, hedef, olaylar)
  const no = Number(hedef.slice(1))
  if (hedef.startsWith('s')) sofrayaDokun(oyun, no, olaylar)
  else ocagaDokun(oyun, no, olaylar)
}

function bitisiDenetle(oyun: Oyun, olaylar: Olay[]): void {
  if (oyun.ozet.kalkan >= KAYIP_SINIRI) oyun.bitti = 'ucSofra'
  else if (oyun.tik >= TUR_TIK) {
    oyun.puan += PUAN.geceTamam
    oyun.bitti = 'gece'
  }
  if (oyun.bitti) olaylar.push({ tur: 'bitti', sebep: oyun.bitti })
}

/**
 * Bir tik: önce bu tikin dokunuşları sırasıyla, sonra dünya ilerler (ocak, tezgah,
 * ayran, sofralar), tik artar, gelenler oturur, bitiş denetlenir. Oyun ekranı da
 * sunucu da yalnız bu fonksiyonla ilerler; aynı girdi aynı sonucu verir.
 */
export function ilerle(oyun: Oyun, hedefler: readonly Hedef[]): Olay[] {
  const olaylar: Olay[] = []
  if (oyun.bitti) return olaylar
  for (const hedef of hedefler) dokun(oyun, hedef, olaylar)
  ocakIlerle(oyun, olaylar)
  tezgahIlerle(oyun, olaylar)
  ayranIlerle(oyun, olaylar)
  sofralariIlerle(oyun, olaylar)
  oyun.tik++
  const evre = evreBul(oyun.tik)
  if (evre !== oyun.evre) {
    oyun.evre = evre
    olaylar.push({ tur: 'evre', evre })
  }
  gelisleriAl(oyun)
  kuyruguOturt(oyun, olaylar)
  bitisiDenetle(oyun, olaylar)
  return olaylar
}
