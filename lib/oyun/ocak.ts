import { ACILDIGI_EVRE, PISME_YUZDESI } from './ayar.ts'
import { evreAyari } from './durum.ts'
import type { Kalite, OcakSisi, Olay, Oyun, Urun } from './tipler.ts'

/** Raftan şiş: açık ocak yuvalarının ilk boşuna iner; elde tutulan şişin boşalmış yuvası atlanır (ekran şişi orada gösterir). */
export function rafaDokun(oyun: Oyun, urun: Urun, olaylar: Olay[]): void {
  if (ACILDIGI_EVRE[urun] > oyun.evre) return
  const ayar = evreAyari(oyun.evre)
  const el = oyun.el
  const yuva = oyun.ocak.slice(0, ayar.ocak).findIndex((sis, i) => !sis && !(el?.tur === 'sis' && el.yuva === i))
  if (yuva === -1) {
    olaylar.push({ tur: 'rafDolu', urun })
    return
  }
  oyun.ocak[yuva] = {
    urun,
    gecen: 0,
    pisme: Math.floor((ayar.cigerPisme * PISME_YUZDESI[urun] + 50) / 100),
    pencere: ayar.almaPenceresi,
    bant: ayar.tamKivamBandi,
  }
  olaylar.push({ tur: 'sisKondu', yuva, urun })
}

/** Tam kıvam bandı pencerenin ortasında: |gecen - pisme - pencere/2| <= bant/2, tamsayıda iki katıyla. */
export function sisKalitesi(sis: OcakSisi): Kalite {
  return Math.abs(2 * (sis.gecen - sis.pisme) - sis.pencere) <= sis.bant ? 'tam' : 'iyi'
}

/** Hazır şiş ele alınır, kalite o tikte mühürlenir, yuva boşalır. Pişerken dokunuş sallanır, el doluyken etkisiz. */
export function ocaktanTut(oyun: Oyun, yuva: number, olaylar: Olay[]): void {
  const sis = oyun.ocak[yuva]
  if (!sis || oyun.el) return
  if (sis.gecen < sis.pisme) {
    olaylar.push({ tur: 'sisErken', yuva })
    return
  }
  oyun.el = { tur: 'sis', urun: sis.urun, kalite: sisKalitesi(sis), yuva }
  oyun.ocak[yuva] = null
  olaylar.push({ tur: 'tutuldu', el: oyun.el })
}

/** Şişler pişer; pencereyi geçen yanar: yuva boşalır, kombo sıfırlanır, puan düşmez. */
export function ocakIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.ocak.forEach((sis, yuva) => {
    if (!sis) return
    sis.gecen++
    if (sis.gecen < sis.pisme + sis.pencere) return
    oyun.ocak[yuva] = null
    oyun.kombo = 0
    olaylar.push({ tur: 'sisYandi', yuva })
  })
}
