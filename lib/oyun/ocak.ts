import { ACILDIGI_EVRE, AYRAN_TIK, PISME_YUZDESI, PUAN, SOGUMA_TIK } from './ayar.ts'
import { evreAyari } from './durum.ts'
import { komboDusur } from './puan.ts'
import type { Olay, Oyun, SisUrun } from './tipler.ts'

function bosYuva<T>(yuvalar: readonly (T | null)[], ustSinir = yuvalar.length): number {
  for (let i = 0; i < ustSinir; i++) if (!yuvalar[i]) return i
  return -1
}

/** Yanık ve soğuma aynı bedeli öder: puan, kombo kademesi, porsiyon dizisi. */
function ihmal(oyun: Oyun, ceza: number): void {
  oyun.puan += ceza
  oyun.kombo = komboDusur(oyun.kombo)
  oyun.porsiyonDizisi = 0
}

/** Raftan şiş: açık ocak yuvalarının ilk boşuna iner; süreler o anki evreden sabitlenir. */
export function rafaDokun(oyun: Oyun, urun: SisUrun, olaylar: Olay[]): void {
  if (ACILDIGI_EVRE[urun] > oyun.evre) return
  const ayar = evreAyari(oyun.evre)
  const yuva = bosYuva(oyun.ocak, ayar.ocak)
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
    cevirme: 'yok',
  }
  olaylar.push({ tur: 'sisKondu', yuva, urun })
}

/**
 * Pişerken ilk dokunuş şişi çevirir: çentiğin bandındaysa tam kıvam mümkün kalır.
 * Alma penceresindeki dokunuş şişi tezgaha alır. Karşılaştırmalar iki katı alınarak
 * tamsayıda yapılır: |gecen - pisme/2| <= bant/2  ⇔  |2·gecen - pisme| <= bant.
 */
export function ocagaDokun(oyun: Oyun, yuva: number, olaylar: Olay[]): void {
  const sis = oyun.ocak[yuva]
  if (!sis) return
  if (sis.gecen < sis.pisme) {
    if (sis.cevirme !== 'yok') return
    const iyi = Math.abs(2 * sis.gecen - sis.pisme) <= sis.bant
    sis.cevirme = iyi ? 'iyi' : 'kotu'
    olaylar.push({ tur: 'sisCevrildi', yuva, iyi })
    return
  }
  const bos = bosYuva(oyun.tezgah)
  if (bos === -1) {
    olaylar.push({ tur: 'tezgahDolu', yuva })
    return
  }
  const merkezFarki = Math.abs(2 * (sis.gecen - sis.pisme) - sis.pencere)
  const kalite = sis.cevirme === 'iyi' && merkezFarki <= sis.bant ? 'tam' : 'iyi'
  oyun.tezgah[bos] = { urun: sis.urun, kalite, bekleme: 0 }
  oyun.ocak[yuva] = null
  olaylar.push({ tur: 'sisAlindi', yuva, kalite })
}

export function ayranaDokun(oyun: Oyun): void {
  if (oyun.ayran !== null || ACILDIGI_EVRE.ayran > oyun.evre) return
  oyun.ayran = AYRAN_TIK
}

/** Şişler pişer; alma penceresi geçen yanar. */
export function ocakIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.ocak.forEach((sis, yuva) => {
    if (!sis) return
    sis.gecen++
    if (sis.gecen < sis.pisme + sis.pencere) return
    oyun.ocak[yuva] = null
    ihmal(oyun, PUAN.yanik)
    olaylar.push({ tur: 'sisYandi', yuva })
  })
}

/** Tezgahta bekleyen şiş soğur; ayran soğumaz. */
export function tezgahIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.tezgah.forEach((kalem, yuva) => {
    if (!kalem || kalem.kalite === null) return
    kalem.bekleme++
    if (kalem.bekleme < SOGUMA_TIK) return
    oyun.tezgah[yuva] = null
    ihmal(oyun, PUAN.soguma)
    olaylar.push({ tur: 'sogudu', tezgah: yuva })
  })
}

/** Maşrapa dolar; dolunca tezgahta ilk boş yere geçer, yer yoksa yayıkta bekler. */
export function ayranIlerle(oyun: Oyun, olaylar: Olay[]): void {
  if (oyun.ayran === null) return
  if (oyun.ayran > 0) oyun.ayran--
  if (oyun.ayran > 0) return
  const bos = bosYuva(oyun.tezgah)
  if (bos === -1) return
  oyun.tezgah[bos] = { urun: 'ayran', kalite: null, bekleme: 0 }
  oyun.ayran = null
  olaylar.push({ tur: 'ayranDoldu' })
}
