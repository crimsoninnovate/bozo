import { MASA_SAYISI, yediGunlukBaslangic, type YonetimTaramaYaniti } from '../lib/masa.ts'
import type { KodYaniti, YonetimOturumYaniti, YonetimSiralamaYaniti, YonetimTurYaniti } from '../lib/oyun/aktarim.ts'
import { donemAnahtari, girneGunu } from './donem.ts'
import type { IslemTuru } from '../lib/yonetim/personel.ts'
import type { Personel } from './depo.ts'
import { IstekHatasi, temelKimlik, type Istek, type Yanit } from './http.ts'
import { esitMi, kodOzeti } from './kod.ts'
import {
  eskiAdminAnahtariGecerliMi, OTURUM_SURESI_MS, oturumAnahtariCoz, oturumAnahtariUret, oturumImzasiTutar,
} from './oturum.ts'
import { parolaDogrula, SAHTE_OZET } from './parola.ts'
import { enIyiler } from './siralama.ts'
import type { Baglam } from './uclar.ts'

/*
 * Yönetim uçları (spec §10): kimlik çözme (admin ortamda, personel veritabanında, spec 2026-11-09
 * kullanıcılar), kod onayı, izleyici verisi, ad gizleme, sayaç.
 */

export type YonetimKimligi = { kullanici: string; sifre: string }
/** Admin `id` 0 ve adı `YONETIM_KULLANICI`; personel veritabanındaki hesap. */
export type Yetkili = { id: number; ad: string; admin: boolean; sifreDegismeli: boolean }

const kimlikGerekli = () => new IstekHatasi(401, 'kimlikGerekli')
const adminSahibi = (k: YonetimKimligi) => ({ id: 0, surum: 0, gizli: `${k.kullanici}:${k.sifre}` })
const adminYetkili = (k: YonetimKimligi): Yetkili => ({
  id: 0, ad: k.kullanici, admin: true, sifreDegismeli: false,
})
const personelYetkili = (p: Personel): Yetkili => ({
  id: p.id, ad: p.ad, admin: false, sifreDegismeli: p.sifreDegismeli,
})

type Cozum = { yetkili: Yetkili; surum: number }

/** Admin veritabanına hiç bakılmadan doğrulanır; bilinmeyen adda da bir scrypt koşar. */
async function temelCoz(b: Baglam, admin: YonetimKimligi, yetki: string | undefined): Promise<Cozum> {
  const gelen = temelKimlik(yetki)
  if (!gelen) throw kimlikGerekli()
  if (esitMi(gelen.kullanici, admin.kullanici)) {
    if (!esitMi(gelen.sifre, admin.sifre)) throw kimlikGerekli()
    return { yetkili: adminYetkili(admin), surum: 0 }
  }
  const p = await b.depo.personelAdla(gelen.kullanici.toLowerCase())
  const tutar = await parolaDogrula(gelen.sifre, p?.parolaOzeti ?? SAHTE_OZET)
  if (!p || !tutar || p.kapali) throw kimlikGerekli()
  return { yetkili: personelYetkili(p), surum: p.oturumSurumu }
}

async function bearerCoz(b: Baglam, admin: YonetimKimligi, yetki: string): Promise<Cozum> {
  const c = oturumAnahtariCoz(yetki, b.simdi())
  if (c === 'eski') {
    if (!eskiAdminAnahtariGecerliMi(b.tuz, admin, yetki, b.simdi())) throw kimlikGerekli()
    return { yetkili: adminYetkili(admin), surum: 0 }
  }
  if (!c) throw kimlikGerekli()
  if (c.id === 0) {
    if (c.surum !== 0 || !oturumImzasiTutar(b.tuz, adminSahibi(admin), c)) throw kimlikGerekli()
    return { yetkili: adminYetkili(admin), surum: 0 }
  }
  const p = await b.depo.personelBul(c.id)
  if (!p || p.kapali || p.oturumSurumu !== c.surum) throw kimlikGerekli()
  if (!oturumImzasiTutar(b.tuz, { id: p.id, surum: p.oturumSurumu, gizli: '' }, c)) throw kimlikGerekli()
  return { yetkili: personelYetkili(p), surum: p.oturumSurumu }
}

function coz(b: Baglam, admin: YonetimKimligi | null, istek: Istek): Promise<Cozum> {
  if (!admin) throw new IstekHatasi(503, 'yonetimKapali')
  const yetki = istek.basliklar.authorization
  return yetki?.startsWith('Bearer ') ? bearerCoz(b, admin, yetki) : temelCoz(b, admin, yetki)
}

/** Temel kimlik ya da `POST /yonetim/oturum`'un verdiği Bearer anahtarı; geçersizse 401, kapalıysa 503. */
export async function yetkiliCoz(b: Baglam, admin: YonetimKimligi | null, istek: Istek): Promise<Yetkili> {
  return (await coz(b, admin, istek)).yetkili
}

/** Kayıt hatası işlemi bozmaz: günlüğe düşer, işlem sürer. */
export async function islemYaz(b: Baglam, y: Yetkili, tur: IslemTuru, ayrinti: string): Promise<void> {
  try {
    await b.depo.islemEkle({ personelId: y.admin ? null : y.id, ad: y.ad, tur, ayrinti, zaman: b.simdi() })
  } catch (hata) {
    console.warn('yönetim işlemi kaydedilemedi', { tur, ad: y.ad }, hata)
  }
}

/** Oturum anahtarı: hesabın güncel sürümüyle imzalı, 30 gün. */
export function oturumYaniti(b: Baglam, admin: YonetimKimligi, cozum: Cozum): YonetimOturumYaniti {
  const { yetkili } = cozum
  const bitis = b.simdi() + OTURUM_SURESI_MS
  const sahip = yetkili.admin ? adminSahibi(admin) : { id: yetkili.id, surum: cozum.surum, gizli: '' }
  return {
    anahtar: oturumAnahtariUret(b.tuz, sahip, bitis),
    bitis: new Date(bitis).toISOString(),
    ad: yetkili.ad,
    admin: yetkili.admin,
    sifreDegismeli: yetkili.sifreDegismeli,
  }
}

/** Yalnız temel kimlikle: çalınan anahtar yeni anahtar üretemez, süresi dolunca biter. */
export async function yonetimOturum(b: Baglam, admin: YonetimKimligi | null, istek: Istek): Promise<Yanit> {
  if (admin && !istek.basliklar.authorization?.startsWith('Basic ')) throw kimlikGerekli()
  const cozum = await coz(b, admin, istek)
  const { yetkili } = cozum
  if (!yetkili.admin) {
    await b.depo.personelGirisKaydet(yetkili.id, b.simdi())
      .catch((h: unknown) => console.warn('son giriş yazılamadı', h))
  }
  await islemYaz(b, yetkili, 'giris', '')
  return { durum: 200, govde: oturumYaniti(b, admin as YonetimKimligi, cozum) }
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

export async function yonetimKod(b: Baglam, istek: Istek, y: Yetkili): Promise<Yanit> {
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
  await islemYaz(b, y, 'kod', `${sira}. ${takmaAd}`)
  return { durum: 200, govde: { sira, donem, takmaAd, puan } satisfies KodYaniti }
}

export async function yonetimGizle(b: Baglam, istek: Istek, id: string, y: Yetkili): Promise<Yanit> {
  const govde = (await istek.govde()) as { gizli?: unknown } | null
  if (typeof govde?.gizli !== 'boolean') throw new IstekHatasi(400, 'gizliGecersiz')
  if (!(await b.depo.oyuncuGizle(Number(id), govde.gizli))) throw new IstekHatasi(404, 'oyuncuYok')
  b.tablo.bosalt()
  await islemYaz(b, y, 'gizle', `oyuncu ${Number(id)} ${govde.gizli ? 'gizli' : 'açık'}`)
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
