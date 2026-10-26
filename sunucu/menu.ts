import type { MenuYaniti, MenuYayinYaniti, YonetimMenuYaniti } from '../lib/menu/aktarim.ts'
import { menuBelgesiDogrula } from '../lib/menu/dogrulama.ts'
import { menuBelgesiTamamla } from '../lib/menu/tamamla.ts'
import type { MenuBelgesi } from '../lib/menu/tipler.ts'
import type { MenuKaynagi } from './depo.ts'
import { IstekHatasi, type Istek, type Yanit } from './http.ts'
import type { Baglam } from './uclar.ts'

/* Menü uçları (spec 2026-10-26): herkese açık okuma, yetkili yayın ve geri alma. Her yazım doğrulanır. */

export const MENU_ONBELLEK_MS = 15_000
const GECMIS_ADET = 20

/** Herkese açık güncel menü; sürüm yoksa 204 (istemci derlenmiş menüyle kalır). */
export async function menuAl(b: Baglam): Promise<Yanit> {
  const govde = await b.menu.al(b.simdi(), async () => {
    const gecerli = await b.depo.menuGecerli()
    return gecerli && { surum: gecerli.id, belge: gecerli.belge }
  })
  const basliklar = { 'Cache-Control': `public, max-age=${MENU_ONBELLEK_MS / 1000}` }
  return govde ? { durum: 200, govde, basliklar } : { durum: 204, basliklar }
}

export async function yonetimMenuAl(b: Baglam): Promise<Yanit> {
  const [gecerli, surumler] = await Promise.all([b.depo.menuGecerli(), b.depo.menuSurumleri(GECMIS_ADET)])
  const govde: YonetimMenuYaniti = {
    gecerli: gecerli && { surum: gecerli.id, belge: gecerli.belge },
    surumler: surumler.map((s) => ({ id: s.id, olusturma: new Date(s.olusturma).toISOString(), kaynak: s.kaynak })),
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

async function yayinla(b: Baglam, belge: MenuBelgesi, kaynak: MenuKaynagi, taban: number | null): Promise<Yanit> {
  const surum = await b.depo.menuYayinla(belge, kaynak, b.simdi(), taban)
  if (surum === null) throw new IstekHatasi(409, 'surumEskidi')
  b.menu.bosalt()
  return { durum: 200, govde: { surum } satisfies MenuYayinYaniti }
}

/** Gövdedeki belge doğrulanır; saklanan, doğrulayıcının normalleştirdiği belgedir, ham gövde değil. */
export async function yonetimMenuYayinla(b: Baglam, istek: Istek): Promise<Yanit> {
  const { taban, belge } = tabanCoz(await istek.govde())
  const sonuc = menuBelgesiDogrula(belge)
  if (!sonuc.tamam) throw new IstekHatasi(400, 'belgeGecersiz')
  return yayinla(b, sonuc.belge, 'panel', taban)
}

/** 1. sürüm belgede `ikramlar` ve `iletisim` yok; tipi tam olsa da depodan öyle gelebilir. */
function tamBelgeMi(belge: MenuBelgesi): boolean {
  const { ikramlar, iletisim } = belge as Partial<MenuBelgesi>
  return ikramlar !== undefined && iletisim !== undefined
}

/**
 * Eski sürümü yeni sürüm olarak yayınlar; eski kayıt artık doğrulanmıyorsa 500 ile durur (loglanır).
 * 1. sürümde olmayan bölümler şu an geçerli sürümden alınır (seed sunucu paketinde yok); geçerli sürüm
 * de 1. sürüm biçimindeyse tamamlanamaz: 409 `gecerliSurumEski` (panelden bir kez yayınlayıp sonra geri al).
 */
export async function yonetimMenuGeriAl(b: Baglam, istek: Istek, id: string): Promise<Yanit> {
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
  return yayinla(b, sonuc.belge, 'geriAl', taban)
}
