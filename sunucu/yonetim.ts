import { MASA_SAYISI, yediGunlukBaslangic, type YonetimTaramaYaniti } from '../lib/masa.ts'
import type { KodYaniti, YonetimOturumYaniti, YonetimSiralamaYaniti, YonetimTurYaniti } from '../lib/oyun/aktarim.ts'
import { donemAnahtari, girneGunu } from './donem.ts'
import { IstekHatasi, temelKimlik, type Istek, type Yanit } from './http.ts'
import { esitMi, kodOzeti } from './kod.ts'
import { OTURUM_SURESI_MS, oturumAnahtariGecerliMi, oturumAnahtariUret } from './oturum.ts'
import { enIyiler } from './siralama.ts'
import type { Baglam } from './uclar.ts'

/* Yönetim uçları (spec §10): temel kimlik doğrulama; kod onayı, izleyici verisi, ad gizleme, sayaç. */

export type YonetimKimligi = { kullanici: string; sifre: string }

function temelDenetle(kimlik: YonetimKimligi | null, istek: Istek): asserts kimlik is YonetimKimligi {
  if (!kimlik) throw new IstekHatasi(503, 'yonetimKapali')
  const gelen = temelKimlik(istek.basliklar.authorization)
  if (!gelen || !esitMi(gelen.kullanici, kimlik.kullanici) || !esitMi(gelen.sifre, kimlik.sifre)) {
    throw new IstekHatasi(401, 'kimlikGerekli')
  }
}

/** Temel kimlik ya da `POST /yonetim/oturum`'un verdiği Bearer anahtarı. */
export function yonetimDenetle(kimlik: YonetimKimligi | null, istek: Istek, tuz: string, simdi: number): void {
  const yetki = istek.basliklar.authorization
  if (kimlik && yetki?.startsWith('Bearer ')) {
    if (!oturumAnahtariGecerliMi(tuz, kimlik, yetki, simdi)) throw new IstekHatasi(401, 'kimlikGerekli')
    return
  }
  temelDenetle(kimlik, istek)
}

/** Yalnız temel kimlikle: çalınan anahtar yeni anahtar üretemez, süresi dolunca biter. */
export function yonetimOturum(b: Baglam, kimlik: YonetimKimligi | null, istek: Istek): Yanit {
  temelDenetle(kimlik, istek)
  const bitis = b.simdi() + OTURUM_SURESI_MS
  const govde: YonetimOturumYaniti = {
    anahtar: oturumAnahtariUret(b.tuz, kimlik, bitis),
    bitis: new Date(bitis).toISOString(),
  }
  return { durum: 200, govde }
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
    } satisfies YonetimSiralamaYaniti,
  }
}

/** İzleyici verisi: tohum ve dokunuş kaydı (saklama süresi geçmişse null). */
export async function yonetimTur(b: Baglam, id: string): Promise<Yanit> {
  const tur = await b.depo.turBul(Number(id))
  if (!tur) throw new IstekHatasi(404, 'turYok')
  const { jetonId: _jeton, olusturma, ...kalan } = tur
  return { durum: 200, govde: { ...kalan, olusturma: new Date(olusturma).toISOString() } satisfies YonetimTurYaniti }
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
  return { durum: 200, govde: { sira, donem, takmaAd, puan } satisfies KodYaniti }
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

/** Masa okumaları: bugün, son 7 gün ve toplam; okunmamış masa da sıfırla listelenir. */
export async function yonetimTarama(b: Baglam): Promise<Yanit> {
  const gun = girneGunu(new Date(b.simdi()))
  const okunan = new Map((await b.depo.taramaOzeti(gun, yediGunlukBaslangic(gun))).map((s) => [s.masa, s]))
  const satirlar = Array.from(
    { length: MASA_SAYISI },
    (_, i) => okunan.get(i + 1) ?? { masa: i + 1, bugun: 0, hafta: 0, toplam: 0 },
  )
  return { durum: 200, govde: { gun, satirlar } satisfies YonetimTaramaYaniti }
}
