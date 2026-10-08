import {
  JETON_SURESI_MS,
  SURE_PAYI_MS,
  type BenYaniti,
  type BitirYaniti,
  type JetonYaniti,
  type OyuncuYaniti,
  type Sampiyon,
  type TabloYaniti,
} from '../lib/oyun/aktarim.ts'
import { simule } from '../lib/oyun/motor.ts'
import { takmaAdKatla } from '../lib/oyun/takmaAd.ts'
import { tavan } from '../lib/oyun/tavan.ts'
import type { Girdi, Sonuc } from '../lib/oyun/tipler.ts'
import { rastgeleTohum } from '../lib/oyun/tohum.ts'
import { TIK_MS } from '../lib/oyun/zamanlayici.ts'
import type { Depo, Jeton, Kazanan, Oyuncu } from './depo.ts'
import { girdileriCoz, kanalCoz, oyuncuIstegiCoz } from './dogrulama.ts'
import { donemAnahtari, donemBaslangici, donemBitisi, girneGunu } from './donem.ts'
import type { HizSiniri } from './hiz.ts'
import { bearer, IstekHatasi, type Istek, type Yanit } from './http.ts'
import { KORUNAN_TUR } from './isler.ts'
import { anahtarOzeti, jetonKimligi, odulKodu } from './kod.ts'
import { enIyiler, oyuncununSirasi, tabloSatirlari } from './siralama.ts'
import { supheliMi } from './suphe.ts'
import { yasakliMi } from './yasakli.ts'

/* Herkese açık uçlar (spec §10). Sunucu iddia edilen skoru okumaz; turu kendisi oynatır (§9). */

export const TABLO_ONBELLEK_MS = 20_000

export type Onbellek<T> = { al(simdi: number, uret: () => Promise<T>): Promise<T>; bosalt(): void }

export function onbellekKur<T>(sureMs: number): Onbellek<T> {
  let kayit: { zaman: number; deger: T } | null = null
  return {
    async al(simdi, uret) {
      if (kayit && simdi - kayit.zaman < sureMs) return kayit.deger
      const deger = await uret()
      kayit = { zaman: simdi, deger }
      return deger
    },
    bosalt() {
      kayit = null
    },
  }
}

export type Baglam = {
  depo: Depo
  tuz: string
  simdi: () => number
  oyuncuSiniri: HizSiniri
  tablo: Onbellek<TabloYaniti>
}

export async function turAl(b: Baglam, istek: Istek): Promise<Yanit> {
  const kanal = kanalCoz(await istek.govde())
  const simdi = b.simdi()
  const jeton: Jeton = {
    id: jetonKimligi(),
    tohum: rastgeleTohum(),
    kanal,
    olusturma: simdi,
    sonaErme: simdi + JETON_SURESI_MS,
    kullanildi: false,
  }
  await b.depo.jetonEkle(jeton)
  await b.depo.sayacArtir(girneGunu(new Date(simdi)), kanal)
  const govde: JetonYaniti = { turId: jeton.id, tohum: jeton.tohum, sonaErme: new Date(jeton.sonaErme).toISOString() }
  return { durum: 201, govde }
}

async function oyuncuyuBul(b: Baglam, istek: Istek): Promise<Oyuncu> {
  const anahtar = bearer(istek.basliklar.authorization)
  if (!anahtar) throw new IstekHatasi(401, 'anahtarYok')
  const oyuncu = await b.depo.oyuncuBul(anahtarOzeti(anahtar))
  if (!oyuncu) throw new IstekHatasi(401, 'oyuncuYok')
  return oyuncu
}

/** Her ret aynı nötr kodla döner (spec §8): biçim, yasaklı liste ve kullanımda olan ad ayırt edilmez. */
export async function oyuncuOl(b: Baglam, istek: Istek): Promise<Yanit> {
  const { takmaAd, anahtar, onaySurumu } = oyuncuIstegiCoz(await istek.govde())
  const ozet = anahtarOzeti(anahtar)
  if (await b.depo.oyuncuBul(ozet)) throw new IstekHatasi(409, 'zatenKayitli')
  if (yasakliMi(takmaAd)) throw new IstekHatasi(422, 'takmaAdKullanilamaz')
  const sonuc = await b.depo.oyuncuEkle({
    anahtarOzeti: ozet,
    takmaAd,
    adKatlanmis: takmaAdKatla(takmaAd),
    onaySurumu,
    simdi: b.simdi(),
  })
  if (sonuc === 'adKullanimda') throw new IstekHatasi(422, 'takmaAdKullanilamaz')
  const govde: OyuncuYaniti = { takmaAd: sonuc.takmaAd }
  return { durum: 201, govde }
}

/** Jeton önce yakılır: ret yiyen kayıt bekleyip yeniden gönderilemez (duvar saati kuralı). */
async function jetonuYak(b: Baglam, id: string, simdi: number): Promise<Jeton> {
  const jeton = await b.depo.jetonBul(id)
  if (!jeton) throw new IstekHatasi(404, 'jetonYok')
  if (jeton.kullanildi) throw new IstekHatasi(409, 'jetonKullanildi')
  if (jeton.sonaErme < simdi) throw new IstekHatasi(410, 'jetonSuresiDoldu')
  if (!(await b.depo.jetonKullan(id))) throw new IstekHatasi(409, 'jetonKullanildi')
  return jeton
}

function oynat(jeton: Jeton, girdiler: readonly Girdi[], simdi: number): Sonuc {
  let sonuc: Sonuc
  try {
    sonuc = simule(jeton.tohum, girdiler)
  } catch (hata) {
    if (hata instanceof RangeError) throw new IstekHatasi(422, 'girdilerGecersiz')
    throw hata
  }
  if (simdi - jeton.olusturma < sonuc.tik * TIK_MS - SURE_PAYI_MS) throw new IstekHatasi(422, 'cokHizli')
  if (sonuc.puan > tavan(jeton.tohum)) throw new IstekHatasi(422, 'tavanUstu')
  return sonuc
}

async function turuKaydet(b: Baglam, oyuncu: Oyuncu, jeton: Jeton, girdiler: Girdi[], sonuc: Sonuc, simdi: number) {
  const an = new Date(simdi)
  const donem = donemAnahtari(an)
  await b.depo.donemKaydet({
    anahtar: donem,
    baslangic: donemBaslangici(an).getTime(),
    bitis: donemBitisi(an).getTime(),
    kapanis: null,
  })
  const turId = await b.depo.turEkle({
    jetonId: jeton.id,
    oyuncuId: oyuncu.id,
    donem,
    tohum: jeton.tohum,
    puan: sonuc.puan,
    ozet: sonuc.ozet,
    bitti: sonuc.bitti,
    tik: sonuc.tik,
    kanal: jeton.kanal,
    supheli: supheliMi(girdiler, sonuc),
    girdiler,
    olusturma: simdi,
  })
  const sirali = enIyiler(await b.depo.siralama(donem))
  await b.depo.girdileriKirp(donem, sirali.slice(0, KORUNAN_TUR).map((s) => s.turId))
  b.tablo.bosalt()
  return { turId, sirali }
}

export async function turBitir(b: Baglam, istek: Istek, turId: string): Promise<Yanit> {
  const oyuncu = await oyuncuyuBul(b, istek)
  const simdi = b.simdi()
  if (!b.oyuncuSiniri.izinVar(String(oyuncu.id), simdi)) throw new IstekHatasi(429, 'cokTur')
  const jeton = await jetonuYak(b, turId, simdi)
  const girdiler = girdileriCoz(await istek.govde())
  const sonuc = oynat(jeton, girdiler, simdi)
  const { turId: yeniTurId, sirali } = await turuKaydet(b, oyuncu, jeton, girdiler, sonuc, simdi)
  const hafta = oyuncununSirasi(sirali, oyuncu.id)
  if (!hafta) throw new Error(`kaydedilen tur sıralamada yok: ${yeniTurId}`)
  const govde: BitirYaniti = {
    puan: sonuc.puan,
    ozet: sonuc.ozet,
    bitti: sonuc.bitti,
    tik: sonuc.tik,
    hafta,
    buTurEnIyi: sirali.find((s) => s.oyuncuId === oyuncu.id)?.turId === yeniTurId,
  }
  return { durum: 200, govde }
}

const sampiyonOku = (k: Kazanan | null): Sampiyon | null =>
  k ? { takmaAd: k.gizli ? null : k.takmaAd, puan: k.puan, donem: k.donem } : null

export async function tabloAl(b: Baglam): Promise<Yanit> {
  const govde = await b.tablo.al(b.simdi(), async () => {
    const an = new Date(b.simdi())
    const donem = donemAnahtari(an)
    const [hafta, tum, sampiyon] = await Promise.all([
      b.depo.siralama(donem),
      b.depo.tumZamanlar(3),
      b.depo.sonSampiyon(),
    ])
    return {
      donem,
      bitis: donemBitisi(an).toISOString(),
      hafta: tabloSatirlari(enIyiler(hafta), 10),
      tumZamanlar: tabloSatirlari(tum, 3),
      sonSampiyon: sampiyonOku(sampiyon),
    }
  })
  return { durum: 200, govde, basliklar: { 'Cache-Control': `public, max-age=${TABLO_ONBELLEK_MS / 1000}` } }
}

export async function benAl(b: Baglam, istek: Istek): Promise<Yanit> {
  const oyuncu = await oyuncuyuBul(b, istek)
  const simdi = b.simdi()
  const hafta = oyuncununSirasi(enIyiler(await b.depo.siralama(donemAnahtari(new Date(simdi)))), oyuncu.id)
  const kazanan = await b.depo.oyuncununOdulu(oyuncu.id)
  const odul =
    kazanan && kazanan.gecerlilik >= simdi
      ? {
          kod: odulKodu(b.tuz, kazanan.donem, oyuncu.id, kazanan.deneme),
          sira: kazanan.sira,
          donem: kazanan.donem,
          gecerlilik: new Date(kazanan.gecerlilik).toISOString(),
          kullanildi: kazanan.kullanildi !== null,
        }
      : null
  const govde: BenYaniti = { takmaAd: oyuncu.takmaAd, hafta, odul }
  return { durum: 200, govde }
}

export async function hesabiSil(b: Baglam, istek: Istek): Promise<Yanit> {
  const oyuncu = await oyuncuyuBul(b, istek)
  await b.depo.oyuncuSil(oyuncu.id)
  b.tablo.bosalt()
  return { durum: 204 }
}
