import { KAYIP_SINIRI, PUAN, TUR_TIK } from './ayar.ts'
import { evreBul, yeniOyun } from './durum.ts'
import { gelisleriAl, kuyruguOturt, misafireBirak, misafirleriIlerle, paraAl, paraIlerle } from './misafir.ts'
import { ocakIlerle, ocaktanTut, rafaDokun } from './ocak.ts'
import { birak, copeBirak, kasedenTut, tabagaDokun } from './tabak.ts'
import type { Girdi, Hedef, Olay, Oyun, Sonuc } from './tipler.ts'

/** Tanınan 19 hedef; kayıttaki başka her şey bozuktur. */
const HEDEFLER: ReadonlySet<string> = new Set<Hedef>([
  'ciger', 'dalak', 'yurek', 'domates', 'sogan', 'o0', 'o1', 'o2', 'o3', 't0', 't1', 'm0', 'm1', 'm2',
  'p0', 'p1', 'p2', 'cop', 'birak',
])

function dokun(oyun: Oyun, hedef: Hedef, olaylar: Olay[]): void {
  if (!HEDEFLER.has(hedef)) return
  if (hedef === 'cop') return copeBirak(oyun, olaylar)
  if (hedef === 'birak') return birak(oyun, olaylar)
  if (hedef === 'domates' || hedef === 'sogan') return kasedenTut(oyun, hedef, olaylar)
  if (hedef === 'ciger' || hedef === 'dalak' || hedef === 'yurek') return rafaDokun(oyun, hedef, olaylar)
  const no = Number(hedef.slice(1))
  if (hedef.startsWith('o')) return ocaktanTut(oyun, no, olaylar)
  if (hedef.startsWith('t')) return tabagaDokun(oyun, no, olaylar)
  if (hedef.startsWith('m')) return misafireBirak(oyun, no, olaylar)
  paraAl(oyun, no, olaylar)
}

function bitisiDenetle(oyun: Oyun, olaylar: Olay[]): void {
  if (oyun.ozet.kalkan >= KAYIP_SINIRI) oyun.bitti = 'ucMisafir'
  else if (oyun.tik >= TUR_TIK) {
    oyun.puan += PUAN.geceTamam
    oyun.bitti = 'gece'
  }
  if (oyun.bitti) olaylar.push({ tur: 'bitti', sebep: oyun.bitti })
}

/**
 * Bir tik: önce bu tikin girdileri sırasıyla (aynı tikte tut ve bırakma hedefi olabilir), sonra
 * dünya ilerler (ocak, paralar, misafirler), tik artar, gelenler oturur, bitiş denetlenir.
 * Oyun ekranı da sunucu da yalnız bu fonksiyonla ilerler; aynı girdi aynı sonucu verir.
 */
export function ilerle(oyun: Oyun, hedefler: readonly Hedef[]): Olay[] {
  const olaylar: Olay[] = []
  if (oyun.bitti) return olaylar
  for (const hedef of hedefler) dokun(oyun, hedef, olaylar)
  ocakIlerle(oyun, olaylar)
  paraIlerle(oyun, olaylar)
  misafirleriIlerle(oyun, olaylar)
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

/** Her girdi `[tik, hedef]`: tik tamsayı, tur içinde ve sıralı, hedef tanımlı; değilse kayıt bozuktur. */
function girdileriDogrula(girdiler: readonly Girdi[]): void {
  let onceki = 0
  for (const girdi of girdiler) {
    if (!Array.isArray(girdi) || girdi.length !== 2) throw new RangeError(`bozuk girdi: ${JSON.stringify(girdi)}`)
    const [tik, hedef] = girdi
    if (!HEDEFLER.has(hedef)) throw new RangeError(`tanımsız hedef: ${String(hedef)}`)
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
