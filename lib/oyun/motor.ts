import { KAYIP_SINIRI, PUAN, TUR_TIK } from './ayar.ts'
import { evreBul, yeniOyun } from './durum.ts'
import { ayranaDokun, ayranIlerle, ocagaDokun, ocakIlerle, rafaDokun, tezgahIlerle } from './ocak.ts'
import { gelisleriAl, kuyruguOturt, sofralariIlerle, sofrayaDokun } from './sofra.ts'
import type { Girdi, Hedef, Olay, Oyun, Sonuc } from './tipler.ts'

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

/** Girdi kaydı tik sırasında, tamsayı ve tur içinde olmalı; değilse kayıt bozuktur. */
function girdileriDogrula(girdiler: readonly Girdi[]): void {
  let onceki = 0
  for (const [tik] of girdiler) {
    if (!Number.isInteger(tik) || tik < 0 || tik >= TUR_TIK) throw new RangeError(`geçersiz tik: ${tik}`)
    if (tik < onceki) throw new RangeError(`girdiler tik sırasında değil: ${tik} < ${onceki}`)
    onceki = tik
  }
}

/** Tohum ve girdi kaydından bütün geceyi oynatır. Sunucu skoru buradan hesaplar. */
export function simule(tohum: number, girdiler: readonly Girdi[]): Sonuc {
  girdileriDogrula(girdiler)
  const oyun = yeniOyun(tohum)
  let i = 0
  while (!oyun.bitti) {
    const hedefler: Hedef[] = []
    while (girdiler[i] && girdiler[i]![0] === oyun.tik) hedefler.push(girdiler[i++]![1])
    ilerle(oyun, hedefler)
  }
  return { puan: oyun.puan, ozet: { ...oyun.ozet }, bitti: oyun.bitti, tik: oyun.tik }
}
