import type { MenuYaniti, MenuYayinYaniti, YonetimMenuYaniti } from '../lib/menu/aktarim.ts'
import { menuBelgesiDogrula } from '../lib/menu/dogrulama.ts'
import { herkeseAcik } from '../lib/menu/herkeseAcik.ts'
import { menuBelgesiTamamla, type Tamamlayici } from '../lib/menu/tamamla.ts'
import type { MenuBelgesi } from '../lib/menu/tipler.ts'
import { VARSAYILAN_SAATLER } from '../lib/saat.ts'
import type { MenuKaynagi } from './depo.ts'
import { IstekHatasi, type Istek, type Yanit } from './http.ts'
import type { Baglam } from './uclar.ts'
import { islemYaz, type Yetkili } from './yonetim.ts'

/* Menü uçları (spec 2026-10-26): herkese açık okuma, yetkili yayın ve geri alma. Her yazım doğrulanır. */

export const MENU_ONBELLEK_MS = 15_000
const GECMIS_ADET = 20
/** Her metni azami uzunlukta Türkçe (2 baytlık) harfli en büyük geçerli belge ölçüldü (`menu.test.ts`). */
export const MENU_GOVDE_SINIRI = 256 * 1024

/** Herkese açık güncel menü (`herkeseAcik`); sürüm yoksa 204 (istemci derlenmiş menüyle kalır). */
export async function menuAl(b: Baglam): Promise<Yanit> {
  const govde = await b.menu.al(b.simdi(), async () => {
    const gecerli = await b.depo.menuGecerli()
    return gecerli && { surum: gecerli.id, belge: herkeseAcik(gecerli.belge) }
  })
  const basliklar = { 'Cache-Control': `public, max-age=${MENU_ONBELLEK_MS / 1000}` }
  return govde ? { durum: 200, govde, basliklar } : { durum: 204, basliklar }
}

export async function yonetimMenuAl(b: Baglam): Promise<Yanit> {
  const [gecerli, surumler] = await Promise.all([b.depo.menuGecerli(), b.depo.menuSurumleri(GECMIS_ADET)])
  const govde: YonetimMenuYaniti = {
    gecerli: gecerli && { surum: gecerli.id, belge: gecerli.belge },
    surumler: surumler.map((s) => ({ id: s.id, olusturma: new Date(s.olusturma).toISOString(), kaynak: s.kaynak, yazar: s.yazar })),
  }
  return { durum: 200, govde }
}

/** Tek sürümün belgesi: panel geri almadan önce farkı gösterebilsin diye. */
export async function yonetimMenuSurumAl(b: Baglam, id: string): Promise<Yanit> {
  const eski = await b.depo.menuSurumBul(Number(id))
  if (!eski) throw new IstekHatasi(404, 'surumYok')
  return { durum: 200, govde: { surum: eski.id, belge: eski.belge } satisfies MenuYaniti }
}

/** `taban`: son sürümün kimliği, hiç sürüm yoksa açıkça null; eksik ya da başka tür 400. */
function tabanCoz(govde: unknown): { taban: number | null; belge: unknown } {
  if (typeof govde !== 'object' || govde === null || !('taban' in govde)) throw new IstekHatasi(400, 'tabanGecersiz')
  const { taban } = govde
  const gecerli = taban === null || (typeof taban === 'number' && Number.isInteger(taban) && taban >= 1)
  if (!gecerli) throw new IstekHatasi(400, 'tabanGecersiz')
  return { taban, belge: 'belge' in govde ? govde.belge : undefined }
}

type Yayin = { belge: MenuBelgesi; kaynak: MenuKaynagi; taban: number | null; eskiId?: number }

async function yayinla(b: Baglam, y: Yetkili, { belge, kaynak, taban, eskiId }: Yayin): Promise<Yanit> {
  const surum = await b.depo.menuYayinla(belge, kaynak, b.simdi(), taban, y.ad)
  if (surum === null) throw new IstekHatasi(409, 'surumEskidi')
  b.menu.bosalt()
  if (eskiId === undefined) await islemYaz(b, y, 'menuYayin', `sürüm ${surum}`)
  else await islemYaz(b, y, 'menuGeriAl', `sürüm ${surum} (${eskiId} geri alındı)`)
  return { durum: 200, govde: { surum } satisfies MenuYayinYaniti }
}

/** Seed'in saat ve fotoğraf bölümleri (`content/menu.varsayilan.json` sunucu paketinde yok). */
const SEED_BOLUMLERI: Tamamlayici = { saatler: VARSAYILAN_SAATLER, fotograflar: {} }

/**
 * Gövdedeki belge doğrulanır; saklanan, doğrulayıcının normalleştirdiği belgedir, ham gövde değil.
 * Eski panel saatsiz ve fotosuz belge yollar (R13): eksik bölümler geçerli sürümden, o da yoksa seed'den gelir.
 */
export async function yonetimMenuYayinla(b: Baglam, istek: Istek, y: Yetkili): Promise<Yanit> {
  const { taban, belge } = tabanCoz(await istek.govde(MENU_GOVDE_SINIRI))
  const gecerli = await b.depo.menuGecerli()
  const tamamlanan = gecerli ? menuBelgesiTamamla(belge, gecerli.belge) : belge
  const sonuc = menuBelgesiDogrula(menuBelgesiTamamla(tamamlanan, SEED_BOLUMLERI))
  if (!sonuc.tamam) throw new IstekHatasi(400, 'belgeGecersiz')
  return yayinla(b, y, { belge: sonuc.belge, kaynak: 'panel', taban })
}

/** Eski sürümlerde bölümlerden biri ya da birkaçı yok; tipi tam olsa da depodan öyle gelebilir. */
function tamBelgeMi(belge: MenuBelgesi): boolean {
  const { ikramlar, iletisim, saatler, fotograflar } = belge as Partial<MenuBelgesi>
  return [ikramlar, iletisim, saatler, fotograflar].every((bolum) => bolum !== undefined)
}

/**
 * Eski sürümü yeni sürüm olarak yayınlar; eski kayıt artık doğrulanmıyorsa 500 ile durur (loglanır).
 * Eski sürümde olmayan bölümler şu an geçerli sürümden alınır (seed sunucu paketinde yok); geçerli sürüm
 * de bölümsüzse tamamlanamaz: 409 `gecerliSurumEski` (panelden bir kez yayınlayıp sonra geri al).
 */
export async function yonetimMenuGeriAl(b: Baglam, istek: Istek, id: string, y: Yetkili): Promise<Yanit> {
  const { taban } = tabanCoz(await istek.govde())
  const eski = await b.depo.menuSurumBul(Number(id))
  if (!eski) throw new IstekHatasi(404, 'surumYok')
  const gecerli = await b.depo.menuGecerli()
  if (gecerli && !tamBelgeMi(gecerli.belge)) throw new IstekHatasi(409, 'gecerliSurumEski')
  const sonuc = menuBelgesiDogrula(gecerli ? menuBelgesiTamamla(eski.belge, gecerli.belge) : eski.belge)
  if (!sonuc.tamam) {
    const nedenler = sonuc.hatalar.map((h) => `${h.yol}: ${h.metin}`).join('; ')
    throw new Error(`menü sürümü ${id} geri alınamadı, kayıtlı belge artık geçersiz: ${nedenler}`)
  }
  return yayinla(b, y, { belge: sonuc.belge, kaynak: 'geriAl', taban, eskiId: eski.id })
}
