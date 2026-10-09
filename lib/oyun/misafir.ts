import { KALKIS_TIK, PARA_TIK, PUAN } from './ayar.ts'
import { evreAyari } from './durum.ts'
import { komboCarpani, sabirBonusu } from './puan.ts'
import type { Kalem, Olay, Oyun, TabakKalemi } from './tipler.ts'

/** Geliş tiki gelen misafirler kapıdaki sıraya geçer. */
export function gelisleriAl(oyun: Oyun): void {
  while (oyun.gelecek[0] && oyun.gelecek[0].gelis <= oyun.tik) {
    oyun.kuyruk.push(oyun.gelecek.shift() as Oyun['gelecek'][number])
  }
}

/** Sıradaki misafir açık yerlerin en küçük boşuna oturur; sabır oturunca başlar. Para yeri kapatmaz. */
export function kuyruguOturt(oyun: Oyun, olaylar: Olay[]): void {
  const ayar = evreAyari(oyun.evre)
  for (let yer = 0; yer < ayar.misafir && oyun.kuyruk.length > 0; yer++) {
    if (oyun.misafirler[yer]) continue
    const misafir = oyun.kuyruk.shift()
    if (!misafir) return
    oyun.misafirler[yer] = { misafir, sabir: ayar.sabir, toplamSabir: ayar.sabir, kalkis: null }
    olaylar.push({ tur: 'misafirGeldi', yer })
  }
}

/** Doğru tabak: kalemler kümesi fişle birebir aynı; sıra ve şiş kalitesi önemsiz. */
export function fiseUyuyorMu(fis: readonly Kalem[], tabak: readonly TabakKalemi[]): boolean {
  if (fis.length !== tabak.length) return false
  const kalan = [...fis]
  for (const k of tabak) {
    const i = kalan.indexOf(k.urun)
    if (i === -1) return false
    kalan.splice(i, 1)
  }
  return true
}

function kalemPuani(k: TabakKalemi): number {
  if (k.kalite === null) return PUAN.eslikci
  return k.kalite === 'tam' ? PUAN.tamKivam : PUAN.iyi
}

/** Aynı yere ikinci para tek paraya eklenir, süre yeniden başlar. */
function paraDusur(oyun: Oyun, yer: number, tutar: number, olaylar: Olay[]): void {
  if (tutar <= 0) return
  oyun.paralar[yer] = { tutar: (oyun.paralar[yer]?.tutar ?? 0) + tutar, kalan: PARA_TIK }
  olaylar.push({ tur: 'paraDustu', yer, tutar })
}

/**
 * Elde tabak varsa misafire bırakılır: fişe uyuyorsa hesap puana, bahşiş tezgaha, tabak boşalır,
 * misafir öder; uymuyorsa, yer boşsa ya da ödemişse tabak yerine döner. Elde başka şey varsa etkisiz.
 */
export function misafireBirak(oyun: Oyun, yer: number, olaylar: Olay[]): void {
  const el = oyun.el
  if (!el || el.tur !== 'tabak') return
  oyun.el = null
  const misafir = oyun.misafirler[yer]
  const tabak = oyun.tabaklar[el.no] ?? []
  if (!misafir || misafir.kalkis !== null || !fiseUyuyorMu(misafir.misafir.fis, tabak)) {
    olaylar.push({ tur: 'yanlisTabak', yer, no: el.no })
    return
  }
  const carpan = komboCarpani(oyun.kombo) * evreAyari(oyun.evre).puanCarpani
  const hesap = tabak.reduce((t, k) => t + kalemPuani(k), 0) * carpan
  oyun.puan += hesap
  oyun.kombo++
  oyun.ozet.enUzunKombo = Math.max(oyun.ozet.enUzunKombo, oyun.kombo)
  oyun.ozet.misafir++
  for (const k of tabak) {
    if (k.kalite !== null) oyun.ozet.sis++
    if (k.kalite === 'tam') oyun.ozet.tamKivam++
  }
  oyun.tabaklar[el.no] = []
  misafir.kalkis = KALKIS_TIK
  olaylar.push({ tur: 'teslim', yer, no: el.no, hesap })
  paraDusur(oyun, yer, sabirBonusu(misafir.sabir, misafir.toplamSabir) * carpan, olaylar)
}

/** Bahşiş: dokununca puana yazılır, para silinir. */
export function paraAl(oyun: Oyun, yer: number, olaylar: Olay[]): void {
  const para = oyun.paralar[yer]
  if (!para) return
  oyun.puan += para.tutar
  oyun.ozet.bahsis += para.tutar
  oyun.paralar[yer] = null
  olaylar.push({ tur: 'bahsisAlindi', yer, tutar: para.tutar })
}

/** Para bekler, süresi dolunca solar: alınmamış ödül, ceza değil. */
export function paraIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.paralar.forEach((para, yer) => {
    if (!para) return
    para.kalan--
    if (para.kalan > 0) return
    oyun.paralar[yer] = null
    olaylar.push({ tur: 'paraSoldu', yer })
  })
}

/** Sabır her tik bir azalır, ödeyen kalkar, sabrı biten küser: yalnız kombo ve kalkan sayısı bedel öder. */
export function misafirleriIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.misafirler.forEach((yer, no) => {
    if (!yer) return
    if (yer.kalkis !== null) {
      yer.kalkis--
      if (yer.kalkis <= 0) {
        oyun.misafirler[no] = null
        olaylar.push({ tur: 'misafirKalkti', yer: no, odedi: true })
      }
      return
    }
    if (yer.misafir.tukenmez) return
    yer.sabir--
    if (yer.sabir > 0) return
    oyun.misafirler[no] = null
    oyun.kombo = 0
    oyun.ozet.kalkan++
    olaylar.push({ tur: 'misafirKalkti', yer: no, odedi: false })
  })
}
