import type { Depo } from './depo.ts'
import { donemAnahtari, girneGunu } from './donem.ts'
import { kodOzeti, odulKodu } from './kod.ts'
import { enIyiler } from './siralama.ts'

/*
 * Zamanlanmış işler (spec §7, §8): dönem kapanışı ve ödül kodları, gece silme. Sunucunun kendi
 * zamanlayıcısından dakikada bir çağrılır; her adım tekrar çalıştırılabilir.
 */
const GUN_MS = 24 * 60 * 60_000
export const KOD_GECERLILIK_MS = 14 * GUN_MS
export const GIRDI_SAKLAMA_MS = 30 * GUN_MS
export const OYUNCU_SAKLAMA_MS = 90 * GUN_MS
export const SAMPIYON_SAKLAMA_MS = 90 * GUN_MS
export const KORUNAN_TUR = 20
export const ODUL_SAYISI = 3

/**
 * Bir dönemin ilk üçüne kod üretir; aynı özet başka dönemden çıkmışsa deneme sayacı artar.
 * Yarım kalmış kapanışta yazılmış sıralar atlanır.
 */
async function kazananlariYaz(depo: Depo, tuz: string, donem: string, simdi: number): Promise<void> {
  const sirali = enIyiler(await depo.siralama(donem))
  const yazili = new Set((await depo.kazananlar(donem)).map((k) => k.sira))
  for (const [i, satir] of sirali.slice(0, ODUL_SAYISI).entries()) {
    if (yazili.has(i + 1)) continue
    for (let deneme = 0; deneme < 10; deneme++) {
      const ozet = kodOzeti(tuz, odulKodu(tuz, donem, satir.oyuncuId, deneme))
      if (await depo.kazananBul(ozet)) continue
      await depo.kazananEkle({
        donem,
        sira: i + 1,
        oyuncuId: satir.oyuncuId,
        takmaAd: satir.takmaAd,
        puan: satir.puan,
        kodOzeti: ozet,
        deneme,
        gecerlilik: simdi + KOD_GECERLILIK_MS,
      })
      break
    }
  }
}

/** Bitişi geçmiş her açık dönemi kapatır; kapananların anahtarlarını döner. */
export async function donemleriKapat(depo: Depo, tuz: string, simdi: number): Promise<string[]> {
  const kapananlar: string[] = []
  for (const donem of await depo.acikDonemler()) {
    if (donem.bitis > simdi) continue
    await kazananlariYaz(depo, tuz, donem.anahtar, simdi)
    await depo.donemKapat(donem.anahtar, simdi)
    kapananlar.push(donem.anahtar)
  }
  return kapananlar
}

/** Spec §8 saklama tablosu: ilk 20 dışı kayıt, 30 günlük kayıt, 90 günlük oyuncu, kampanya sonrası şampiyonlar. */
export async function suresiDolaniSil(depo: Depo, simdi: number, kampanyaBitis: number | null): Promise<void> {
  await depo.suresiDolanJetonlariSil(simdi)
  const donem = donemAnahtari(new Date(simdi))
  const korunan = (await depo.siralama(donem)).slice(0, KORUNAN_TUR).map((s) => s.turId)
  await depo.girdileriKirp(donem, korunan)
  await depo.eskiGirdileriSil(simdi - GIRDI_SAKLAMA_MS)
  await depo.eskiOyunculariSil(simdi - OYUNCU_SAKLAMA_MS)
  if (kampanyaBitis !== null && simdi > kampanyaBitis + SAMPIYON_SAKLAMA_MS) await depo.kazananlariSil()
}

export type Isler = { calistir(simdi: number): Promise<string[]> }

/** Dakikalık tik: kapanış her seferinde denetlenir, silme Girne'de gün değişince bir kez koşar. */
export function islerKur(depo: Depo, tuz: string, kampanyaBitis: number | null): Isler {
  let sonSilmeGunu: string | null = null
  return {
    async calistir(simdi) {
      const kapananlar = await donemleriKapat(depo, tuz, simdi)
      const gun = girneGunu(new Date(simdi))
      if (gun !== sonSilmeGunu) {
        await suresiDolaniSil(depo, simdi, kampanyaBitis)
        sonSilmeGunu = gun
      }
      return kapananlar
    },
  }
}
