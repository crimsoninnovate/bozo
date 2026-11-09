import {
  adSorunu, sifreSorunu, type BenYaniti, type IslemSatiri, type PersonelSatiri,
  type YonetimIslemlerYaniti, type YonetimPersonelYaniti,
} from '../lib/yonetim/personel.ts'
import type { Islem, Personel } from './depo.ts'
import { IstekHatasi, type Istek, type Yanit } from './http.ts'
import { parolaDogrula, parolaOzeti } from './parola.ts'
import type { Baglam } from './uclar.ts'
import { islemYaz, oturumYaniti, type YonetimKimligi, type Yetkili } from './yonetim.ts'

/* Hesap yönetimi (spec 2026-11-09 kullanıcılar): kendi şifresi her hesapta, geri kalanı yalnız adminde. */

const SON_ISLEM = 5
const ISLEM_LISTESI = 100

const iso = (ms: number) => new Date(ms).toISOString()
const islemSatiri = (i: Islem): IslemSatiri => ({ ad: i.ad, tur: i.tur, ayrinti: i.ayrinti, zaman: iso(i.zaman) })

async function personelSatiri(b: Baglam, p: Personel): Promise<PersonelSatiri> {
  return {
    id: p.id,
    ad: p.ad,
    kapali: p.kapali,
    sifreDegismeli: p.sifreDegismeli,
    olusturma: iso(p.olusturma),
    sonGiris: p.sonGiris === null ? null : iso(p.sonGiris),
    sonIslemler: (await b.depo.islemler(SON_ISLEM, p.id)).map(islemSatiri),
  }
}

/** Gövdeden metin alanları; eksik ya da metin olmayan alan 400 `govdeGecersiz`. */
async function metinler<K extends string>(istek: Istek, alanlar: readonly K[]): Promise<Record<K, string>> {
  const govde = (await istek.govde()) as Record<string, unknown> | null
  const sonuc = {} as Record<K, string>
  for (const alan of alanlar) {
    const deger = govde?.[alan]
    if (typeof deger !== 'string') throw new IstekHatasi(400, 'govdeGecersiz')
    sonuc[alan] = deger
  }
  return sonuc
}

function sifreDenetle(sifre: string): void {
  const sorun = sifreSorunu(sifre)
  if (sorun) throw new IstekHatasi(400, sorun)
}

export function yonetimBen(y: Yetkili): Yanit {
  return { durum: 200, govde: { ad: y.ad, admin: y.admin, sifreDegismeli: y.sifreDegismeli } satisfies BenYaniti }
}

/** Kendi şifresi: bu cihaz yeni anahtarla oturumda kalır, hesabın diğer anahtarları düşer. */
export async function yonetimSifre(b: Baglam, admin: YonetimKimligi | null, istek: Istek, y: Yetkili): Promise<Yanit> {
  if (y.admin || !admin) throw new IstekHatasi(400, 'adminSifresiSunucuda')
  const { eski, yeni } = await metinler(istek, ['eski', 'yeni'])
  const p = await b.depo.personelBul(y.id)
  if (!p) throw new IstekHatasi(401, 'kimlikGerekli')
  // 401 değil: panel 401'de oturumu kapatır, yanlış eski şifre ise formda kalmalı.
  if (!(await parolaDogrula(eski, p.parolaOzeti))) throw new IstekHatasi(403, 'eskiSifreYanlis')
  if (yeni === eski) throw new IstekHatasi(400, 'sifreAyni')
  sifreDenetle(yeni)
  const guncel = await b.depo.personelSifreKoy(p.id, await parolaOzeti(yeni), false)
  if (!guncel) throw new IstekHatasi(401, 'kimlikGerekli')
  await islemYaz(b, y, 'sifreDegistir', '')
  const yetkili = { ...y, sifreDegismeli: false }
  return { durum: 200, govde: oturumYaniti(b, admin, { yetkili, surum: guncel.oturumSurumu }) }
}

export async function yonetimPersonelListe(b: Baglam): Promise<Yanit> {
  const personel = await Promise.all((await b.depo.personelListesi()).map((p) => personelSatiri(b, p)))
  const adminIslemleri = (await b.depo.islemler(SON_ISLEM, null)).map(islemSatiri)
  return { durum: 200, govde: { personel, adminIslemleri } satisfies YonetimPersonelYaniti }
}

export async function yonetimPersonelEkle(b: Baglam, admin: YonetimKimligi, istek: Istek, y: Yetkili): Promise<Yanit> {
  const { ad, sifre } = await metinler(istek, ['ad', 'sifre'])
  const adHatasi = adSorunu(ad, admin.kullanici)
  if (adHatasi) throw new IstekHatasi(400, adHatasi)
  sifreDenetle(sifre)
  const p = await b.depo.personelEkle(ad, await parolaOzeti(sifre), b.simdi())
  if (p === 'adKullanimda') throw new IstekHatasi(409, 'adKullanimda')
  await islemYaz(b, y, 'personelEkle', ad)
  return { durum: 201, govde: await personelSatiri(b, p) }
}

export async function yonetimPersonelKapat(b: Baglam, istek: Istek, id: string, y: Yetkili): Promise<Yanit> {
  const govde = (await istek.govde()) as { kapali?: unknown } | null
  if (typeof govde?.kapali !== 'boolean') throw new IstekHatasi(400, 'govdeGecersiz')
  const p = await b.depo.personelKapat(Number(id), govde.kapali)
  if (!p) throw new IstekHatasi(404, 'personelYok')
  await islemYaz(b, y, govde.kapali ? 'personelKapat' : 'personelAc', p.ad)
  return { durum: 200, govde: await personelSatiri(b, p) }
}

export async function yonetimPersonelSifre(b: Baglam, istek: Istek, id: string, y: Yetkili): Promise<Yanit> {
  const { sifre } = await metinler(istek, ['sifre'])
  sifreDenetle(sifre)
  const p = await b.depo.personelSifreKoy(Number(id), await parolaOzeti(sifre), true)
  if (!p) throw new IstekHatasi(404, 'personelYok')
  await islemYaz(b, y, 'sifreSifirla', p.ad)
  return { durum: 200, govde: await personelSatiri(b, p) }
}

/** `personel`: hesap kimliği ya da `admin`; yoksa herkes. En çok 100, yeniden eskiye. */
export async function yonetimIslemler(b: Baglam, istek: Istek): Promise<Yanit> {
  const secim = istek.sorgu.get('personel')
  if (secim !== null && secim !== 'admin' && !/^\d{1,9}$/.test(secim)) throw new IstekHatasi(400, 'personelGecersiz')
  const kim = secim === null ? undefined : secim === 'admin' ? null : Number(secim)
  const islemler = (await b.depo.islemler(ISLEM_LISTESI, kim)).map(islemSatiri)
  return { durum: 200, govde: { islemler } satisfies YonetimIslemlerYaniti }
}
