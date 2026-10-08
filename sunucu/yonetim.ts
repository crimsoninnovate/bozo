import { donemAnahtari, girneGunu } from './donem.ts'
import { IstekHatasi, temelKimlik, type Istek, type Yanit } from './http.ts'
import { esitMi, kodOzeti } from './kod.ts'
import { enIyiler } from './siralama.ts'
import type { Baglam } from './uclar.ts'

/* Yönetim uçları (spec §10): temel kimlik doğrulama; kod onayı, izleyici verisi, ad gizleme, sayaç. */

export type YonetimKimligi = { kullanici: string; sifre: string }

export function yonetimDenetle(kimlik: YonetimKimligi | null, istek: Istek): void {
  if (!kimlik) throw new IstekHatasi(503, 'yonetimKapali')
  const gelen = temelKimlik(istek.basliklar.authorization)
  if (!gelen || !esitMi(gelen.kullanici, kimlik.kullanici) || !esitMi(gelen.sifre, kimlik.sifre)) {
    throw new IstekHatasi(401, 'kimlikGerekli')
  }
}

const iso = (ms: number | null) => (ms === null ? null : new Date(ms).toISOString())

/** Dönemin ilk 20 oyuncusu (tur kimliği ve şüphe işaretiyle) ve kazananları. */
export async function yonetimSiralama(b: Baglam, istek: Istek): Promise<Yanit> {
  const donem = istek.sorgu.get('donem') ?? donemAnahtari(new Date(b.simdi()))
  if (!/^\d{4}-\d{2}-\d{2}$/.test(donem)) throw new IstekHatasi(400, 'donemGecersiz')
  const [sirali, kazananlar] = await Promise.all([b.depo.siralama(donem), b.depo.kazananlar(donem)])
  return {
    durum: 200,
    govde: {
      donem,
      satirlar: enIyiler(sirali).slice(0, 20),
      kazananlar: kazananlar.map((k) => ({
        sira: k.sira,
        oyuncuId: k.oyuncuId,
        takmaAd: k.takmaAd,
        puan: k.puan,
        gecerlilik: iso(k.gecerlilik),
        kullanildi: iso(k.kullanildi),
      })),
    },
  }
}

/** İzleyici verisi: tohum ve dokunuş kaydı (saklama süresi geçmişse null). */
export async function yonetimTur(b: Baglam, id: string): Promise<Yanit> {
  const tur = await b.depo.turBul(Number(id))
  if (!tur) throw new IstekHatasi(404, 'turYok')
  return { durum: 200, govde: { ...tur, olusturma: iso(tur.olusturma) } }
}

export async function yonetimKod(b: Baglam, istek: Istek): Promise<Yanit> {
  const govde = (await istek.govde()) as { kod?: unknown } | null
  const kod = govde?.kod
  if (typeof kod !== 'string' || !/^\d{6}$/.test(kod)) throw new IstekHatasi(400, 'kodGecersiz')
  const kazanan = await b.depo.kazananBul(kodOzeti(b.tuz, kod))
  if (!kazanan) throw new IstekHatasi(404, 'kodYok')
  const simdi = b.simdi()
  if (kazanan.gecerlilik < simdi) throw new IstekHatasi(410, 'kodSuresiDoldu')
  if (kazanan.kullanildi !== null || !(await b.depo.kazananKullan(kazanan.id, simdi))) {
    throw new IstekHatasi(409, 'kodKullanildi')
  }
  const { sira, donem, takmaAd, puan } = kazanan
  return { durum: 200, govde: { sira, donem, takmaAd, puan } }
}

export async function yonetimGizle(b: Baglam, istek: Istek, id: string): Promise<Yanit> {
  const govde = (await istek.govde()) as { gizli?: unknown } | null
  if (typeof govde?.gizli !== 'boolean') throw new IstekHatasi(400, 'gizliGecersiz')
  if (!(await b.depo.oyuncuGizle(Number(id), govde.gizli))) throw new IstekHatasi(404, 'oyuncuYok')
  b.tablo.bosalt()
  return { durum: 204 }
}

export async function yonetimSayac(b: Baglam, istek: Istek): Promise<Yanit> {
  const gun = istek.sorgu.get('gun') ?? girneGunu(new Date(b.simdi()))
  if (!/^\d{4}-\d{2}-\d{2}$/.test(gun)) throw new IstekHatasi(400, 'gunGecersiz')
  return { durum: 200, govde: { gun, ...(await b.depo.sayaclar(gun)) } }
}
