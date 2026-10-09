import { ACILDIGI_EVRE, TABAK_SINIRI } from './ayar.ts'
import type { Eslikci, Olay, Oyun } from './tipler.ts'

/** Kase tükenmez: el boşsa ve eşlikçi açıldıysa eşlikçi ele. */
export function kasedenTut(oyun: Oyun, urun: Eslikci, olaylar: Olay[]): void {
  if (oyun.el || ACILDIGI_EVRE[urun] > oyun.evre) return
  oyun.el = { tur: 'eslikci', urun }
  olaylar.push({ tur: 'tutuldu', el: oyun.el })
}

/**
 * Tabak hem hedef hem kaynak: elde şiş ya da eşlikçi varsa tabağa iner (en çok dört kalem, beşinci
 * elde kalır); el boşsa ve tabak doluysa tabak ele; elde tabak varken etkisiz.
 */
export function tabagaDokun(oyun: Oyun, no: number, olaylar: Olay[]): void {
  const tabak = oyun.tabaklar[no]
  if (!tabak) return
  const el = oyun.el
  if (el === null) {
    if (tabak.length === 0) return
    oyun.el = { tur: 'tabak', no }
    olaylar.push({ tur: 'tutuldu', el: oyun.el })
    return
  }
  if (el.tur === 'tabak') return
  if (tabak.length >= TABAK_SINIRI) {
    olaylar.push({ tur: 'tabakDolu', no })
    return
  }
  const kalem = { urun: el.urun, kalite: el.tur === 'sis' ? el.kalite : null }
  tabak.push(kalem)
  oyun.el = null
  olaylar.push({ tur: 'tabagaKondu', no, kalem, el })
}

/** Çöp: eldeki yok olur, tabaksa boşalıp yerine döner. Puan ve kombo değişmez. */
export function copeBirak(oyun: Oyun, olaylar: Olay[]): void {
  const el = oyun.el
  if (!el) return
  if (el.tur === 'tabak') oyun.tabaklar[el.no] = []
  oyun.el = null
  olaylar.push({ tur: 'copeGitti', el })
}

/** Bırakma: tabak yerine, eşlikçi kaseye döner. Şişte etkisiz: yuvası boşaldı, yemeği yalnız çöp atar (spec §13). */
export function birak(oyun: Oyun, olaylar: Olay[]): void {
  const el = oyun.el
  if (!el || el.tur === 'sis') return
  oyun.el = null
  olaylar.push({ tur: 'birakildi', el })
}
