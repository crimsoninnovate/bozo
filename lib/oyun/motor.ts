import { KAYIP_SINIRI, PUAN, TUR_TIK } from './ayar.ts'
import { evreBul, yeniOyun } from './durum.ts'
import type { Girdi, Hedef, Olay, Oyun, Sonuc } from './tipler.ts'

function bitisiDenetle(oyun: Oyun, olaylar: Olay[]): void {
  if (oyun.ozet.kalkan >= KAYIP_SINIRI) oyun.bitti = 'ucMisafir'
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
export function ilerle(oyun: Oyun, _hedefler: readonly Hedef[]): Olay[] {
  const olaylar: Olay[] = []
  if (oyun.bitti) return olaylar
  oyun.tik++
  const evre = evreBul(oyun.tik)
  if (evre !== oyun.evre) {
    oyun.evre = evre
    olaylar.push({ tur: 'evre', evre })
  }
  bitisiDenetle(oyun, olaylar)
  return olaylar
}

/** Her girdi `[tik, hedef]`: tik tamsayı, tur içinde ve sıralı, hedef tanımlı; değilse kayıt bozuktur. */
function girdileriDogrula(girdiler: readonly Girdi[]): void {
  let onceki = 0
  for (const girdi of girdiler) {
    if (!Array.isArray(girdi) || girdi.length !== 2) throw new RangeError(`bozuk girdi: ${JSON.stringify(girdi)}`)
    const [tik] = girdi
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
