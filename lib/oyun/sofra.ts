import { KALKIS_TIK, KURMA_IADESI_YUZDE, PORSIYON_SIS, PUAN } from './ayar.ts'
import { evreAyari } from './durum.ts'
import { komboCarpani, sabirBonusu } from './puan.ts'
import type { Kalite, Olay, Oyun, Sofra, Urun } from './tipler.ts'

/** Geliş tiki gelen misafirler kapıdaki sıraya geçer. */
export function gelisleriAl(oyun: Oyun): void {
  while (oyun.gelecek[0] && oyun.gelecek[0].gelis <= oyun.tik) {
    oyun.kuyruk.push(oyun.gelecek.shift() as Oyun['gelecek'][number])
  }
}

/** Sıradaki misafir açık sofraların en küçük boş yuvasına oturur; sabır oturunca başlar. */
export function kuyruguOturt(oyun: Oyun, olaylar: Olay[]): void {
  const acik = evreAyari(oyun.evre).sofra
  for (let no = 0; no < acik && oyun.kuyruk.length > 0; no++) {
    if (oyun.sofralar[no]) continue
    const misafir = oyun.kuyruk.shift()
    if (!misafir) return
    const toplam = evreAyari(oyun.evre).sabir
    oyun.sofralar[no] = {
      misafir,
      kalan: [...misafir.fis],
      birikim: 0,
      kurulu: false,
      sabir: toplam,
      toplamSabir: toplam,
      kalkis: null,
    }
    olaylar.push({ tur: 'sofraGeldi', sofra: no })
  }
}

function kalemPuani(urun: Urun, kalite: Kalite | null): number {
  if (urun === 'ayran') return PUAN.ayran
  return kalite === 'tam' ? PUAN.tamKivam : PUAN.iyi
}

/** Servis edilen şiş porsiyon dizisini ilerletir ya da bozar. */
function porsiyonIlerlet(oyun: Oyun, kalite: Kalite | null, olaylar: Olay[]): void {
  if (kalite === null) return
  if (kalite === 'iyi') {
    oyun.porsiyonDizisi = 0
    return
  }
  oyun.porsiyonDizisi++
  if (oyun.porsiyonDizisi === PORSIYON_SIS) {
    oyun.puan += PUAN.porsiyon
    oyun.porsiyonDizisi = 0
    olaylar.push({ tur: 'porsiyon' })
  }
}

/** Tezgahta fişle eşleşen her kalemi sofraya taşır; fiş biterse öder. */
function servisEt(oyun: Oyun, no: number, sofra: Sofra, olaylar: Olay[]): void {
  oyun.tezgah.forEach((kalem, yuva) => {
    if (!kalem) return
    const sira = sofra.kalan.indexOf(kalem.urun)
    if (sira === -1) return
    sofra.kalan.splice(sira, 1)
    oyun.tezgah[yuva] = null
    sofra.birikim += kalemPuani(kalem.urun, kalem.kalite)
    if (kalem.urun !== 'ayran') oyun.ozet.sis++
    if (kalem.kalite === 'tam') oyun.ozet.tamKivam++
    porsiyonIlerlet(oyun, kalem.kalite, olaylar)
    olaylar.push({ tur: 'servis', sofra: no, urun: kalem.urun, kalite: kalem.kalite })
  })
  if (sofra.kalan.length > 0) return
  const taban = sofra.birikim + sabirBonusu(sofra.sabir, sofra.toplamSabir)
  const odeme = taban * komboCarpani(oyun.kombo) * evreAyari(oyun.evre).puanCarpani
  oyun.puan += odeme
  oyun.kombo++
  oyun.ozet.enUzunKombo = Math.max(oyun.ozet.enUzunKombo, oyun.kombo)
  oyun.ozet.sofra++
  sofra.kalkis = KALKIS_TIK
  olaylar.push({ tur: 'fisTamam', sofra: no, odeme })
}

/**
 * Kurulmamış sofraya dokunmak onu kurar ("Sofra kurulu gelir"); kurulu sofraya
 * dokunmak servis eder. Servis dokunuşu kurulmamış sofrayı önce kurar, yani
 * "lebeni şişlerden önce gelir" çiğnenemez.
 */
export function sofrayaDokun(oyun: Oyun, no: number, olaylar: Olay[]): void {
  const sofra = oyun.sofralar[no]
  if (!sofra || sofra.kalkis !== null) return
  if (!sofra.kurulu) {
    sofra.kurulu = true
    const iade = Math.floor((sofra.toplamSabir * KURMA_IADESI_YUZDE) / 100)
    sofra.sabir = Math.min(sofra.toplamSabir, sofra.sabir + iade)
    olaylar.push({ tur: 'sofraKuruldu', sofra: no })
    return
  }
  servisEt(oyun, no, sofra, olaylar)
}

/** Sabır tükenir (kurulmamışta iki kat), ödeyen sofra kalkar, sabrı biten küsüp kalkar. */
export function sofralariIlerle(oyun: Oyun, olaylar: Olay[]): void {
  oyun.sofralar.forEach((sofra, no) => {
    if (!sofra) return
    if (sofra.kalkis !== null) {
      sofra.kalkis--
      if (sofra.kalkis <= 0) {
        oyun.sofralar[no] = null
        olaylar.push({ tur: 'sofraKalkti', sofra: no, odedi: true })
      }
      return
    }
    if (sofra.misafir.tukenmez) return
    sofra.sabir -= sofra.kurulu ? 1 : 2
    if (sofra.sabir > 0) return
    oyun.sofralar[no] = null
    oyun.puan += PUAN.kalkis
    oyun.kombo = 0
    oyun.ozet.kalkan++
    olaylar.push({ tur: 'sofraKalkti', sofra: no, odedi: false })
  })
}
