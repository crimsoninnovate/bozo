import { EVRELER } from './ayar.ts'
import { evreAyari, yeniOyun } from './durum.ts'
import { ilerle } from './motor.ts'
import type { Girdi, Hedef, Olay, Oyun, SisUrun, Urun } from './tipler.ts'

/*
 * Testlerin fikstürleri; üretim kodu bu dosyayı çağırmaz. İki parça: elle kurulan
 * sahneler (birim testleri) ve otomatik oyuncular (altın kayıtlar, zorluk bandı).
 */

/** Verilen fişlerle, hepsi ilk tikte gelen bir gece. Başka misafir gelmez. */
export function sahne(fisler: Urun[][], tukenmez = false): Oyun {
  const oyun = yeniOyun(1)
  oyun.gelecek = fisler.map((fis, no) => ({ no, gelis: 0, fis, karisik: false, tukenmez }))
  return oyun
}

/** Oyunun saatini bir evrenin başına alır; gelecek misafirler yerinde kalır. */
export function evreyeGec(oyun: Oyun, evre: number): void {
  oyun.tik = evreAyari(evre).baslangic
  oyun.evre = evre
}

/** Tek tikte verilen hedeflere dokunur. */
export function dokun(oyun: Oyun, ...hedefler: Hedef[]): Olay[] {
  return ilerle(oyun, hedefler)
}

/** `n` tik dokunmadan ilerler, olayları toplar. */
export function bekle(oyun: Oyun, n: number): Olay[] {
  const olaylar: Olay[] = []
  for (let i = 0; i < n; i++) olaylar.push(...ilerle(oyun, []))
  return olaylar
}

/** Bitene kadar dokunmadan ilerler; sonsuz döngüye karşı tur süresiyle sınırlı. */
export function sonaKadarBekle(oyun: Oyun): void {
  const sinir = (EVRELER.at(-1)?.bitis ?? 0) + 1
  for (let i = 0; i < sinir && !oyun.bitti; i++) ilerle(oyun, [])
}

/**
 * Otomatik oyuncu. 'usta' her şişi çentikte çevirir ve pencerenin ortasında alır;
 * 'acemi' ve 'siradan' hiç çevirmez, şiş hazır olur olmaz alır. Hepsi tek parmakla
 * oynar: iki dokunuş arası en az `ARALIK[beceri]` tik.
 */
export type Beceri = 'usta' | 'acemi' | 'siradan'

/** Usta saniyede 4, acemi 2,5, sıradan 1,5 dokunuş. */
const ARALIK: Record<Beceri, number> = { usta: 15, acemi: 24, siradan: 40 }

const SISLER: readonly SisUrun[] = ['ciger', 'dalak', 'yurek']

/** Sofralarda bekleyen kalemlerden ocakta, tezgahta ve yayıkta olanlar düşülür. */
function eksikler(oyun: Oyun): Urun[] {
  const istenen: Urun[] = oyun.sofralar.flatMap((s) => (s && s.kalkis === null ? s.kalan : []))
  const hazirlanan: Urun[] = [
    ...oyun.ocak.flatMap((s) => (s ? [s.urun] : [])),
    ...oyun.tezgah.flatMap((k) => (k ? [k.urun] : [])),
    ...(oyun.ayran !== null ? (['ayran'] as const) : []),
  ]
  for (const urun of hazirlanan) {
    const i = istenen.indexOf(urun)
    if (i !== -1) istenen.splice(i, 1)
  }
  return istenen
}

/** Öncelik sırası: yanacak şişi al, servis et, sofra kur, şiş koy, ayran, çevir. */
function karar(oyun: Oyun, beceri: Beceri): Hedef | null {
  const al: Hedef[] = []
  const cevir: Hedef[] = []
  oyun.ocak.forEach((sis, yuva) => {
    if (!sis) return
    const hedef = `o${yuva}` as Hedef
    if (sis.gecen < sis.pisme) {
      if (beceri === 'usta' && sis.cevirme === 'yok' && 2 * sis.gecen >= sis.pisme) cevir.push(hedef)
      return
    }
    const ortada = 2 * (sis.gecen - sis.pisme) >= sis.pencere
    const yanacak = sis.gecen >= sis.pisme + sis.pencere - ARALIK[beceri]
    if (beceri !== 'usta' || ortada || yanacak) al.push(hedef)
  })
  const servis: Hedef[] = []
  const kur: Hedef[] = []
  oyun.sofralar.forEach((s, no) => {
    if (!s || s.kalkis !== null) return
    if (!s.kurulu) kur.push(`s${no}` as Hedef)
    else if (oyun.tezgah.some((k) => k && s.kalan.includes(k.urun))) servis.push(`s${no}` as Hedef)
  })
  const eksik = eksikler(oyun)
  const ilkSis = eksik.find((u): u is SisUrun => SISLER.includes(u as SisUrun))
  const ocakBos = oyun.ocak.some((s, i) => !s && i < 4)
  const koy: Hedef[] = ilkSis && ocakBos ? [ilkSis] : []
  const ayran: Hedef[] = eksik.includes('ayran') && oyun.ayran === null ? ['ayran'] : []
  return [...al, ...servis, ...kur, ...koy, ...ayran, ...cevir][0] ?? null
}

/** Bütün geceyi oynar, girdi kaydını döner. */
export function ustaOyna(tohum: number, beceri: Beceri): Girdi[] {
  const oyun = yeniOyun(tohum)
  const kayit: Girdi[] = []
  let sonDokunus = -ARALIK[beceri]
  while (!oyun.bitti) {
    const hedef = oyun.tik - sonDokunus >= ARALIK[beceri] ? karar(oyun, beceri) : null
    if (hedef) {
      kayit.push([oyun.tik, hedef])
      sonDokunus = oyun.tik
    }
    ilerle(oyun, hedef ? [hedef] : [])
  }
  return kayit
}
