import { EVRELER } from './ayar.ts'
import { evreAyari, yeniOyun } from './durum.ts'
import { ilerle } from './motor.ts'
import type { Hedef, Olay, Oyun, Urun } from './tipler.ts'

/*
 * Testlerin fikstürleri; üretim kodu bu dosyayı çağırmaz. Elle kurulan sahneler
 * birim testleri içindir.
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
