import { ACILDIGI_EVRE, EVRELER, KASELER, RAF, TABAK_SINIRI } from './ayar.ts'
import { eksikKalemler, evreAyari, yeniOyun } from './durum.ts'
import { fiseUyuyorMu } from './misafir.ts'
import { ilerle } from './motor.ts'
import { sisKalitesi } from './ocak.ts'
import { rastgele, type Rastgele } from './rastgele.ts'
import type { Eslikci, Girdi, Hedef, Kalem, MisafirYeri, Olay, Oyun, Urun } from './tipler.ts'

/* Testlerin fikstürleri; üretim kodu bu dosyayı çağırmaz. İki parça: elle kurulan sahneler ve otomatik oyuncular. */

/** Verilen fişlerle, hepsi ilk tikte gelen bir gece. Başka misafir gelmez. */
export function sahne(fisler: Kalem[][], tukenmez = false): Oyun {
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
 * Otomatik oyuncular (spec tabak §5, §13). 'usta' saniyede 3 girdi, şişi tam kıvam bandında tutar,
 * fişlere sabrı en az kalandan başlar, her bahşişi alır; 'duzenli' saniyede 2, hazır olur olmaz
 * tutar; 'cirak' ilk kez oynayan insanın yerine: 40 tik aralık, yani tut ile bırak arası en az 36 tik,
 * kararları düzenliyle aynı; 'rastgele' saniyede 2 geçerli hedefe rastgele; 'hareketsiz' hiç girdi vermez.
 */
export type Beceri = 'usta' | 'duzenli' | 'cirak' | 'rastgele' | 'hareketsiz'

const ARALIK: Record<Beceri, number> = { usta: 20, duzenli: 30, cirak: 40, rastgele: 30, hareketsiz: Number.MAX_SAFE_INTEGER }

/** Kalem çoklu-kümesi fişin altkümesi mi. */
function altKume(kalemler: readonly Kalem[], fis: readonly Kalem[]): boolean {
  const kalan = [...fis]
  return kalemler.every((k) => {
    const i = kalan.indexOf(k)
    if (i === -1) return false
    kalan.splice(i, 1)
    return true
  })
}

const fisi = (oyun: Oyun, yer: number): readonly Kalem[] => oyun.misafirler[yer]?.misafir.fis ?? []

/** Oturan, ödememiş misafir yerleri, sabrı en az kalandan başlayarak. */
function bekleyenler(oyun: Oyun): number[] {
  return oyun.misafirler
    .map((m, yer) => ({ m, yer }))
    .filter((x): x is { m: MisafirYeri; yer: number } => x.m !== null && x.m.kalkis === null)
    .sort((a, b) => a.m.sabir - b.m.sabir || a.yer - b.yer)
    .map((x) => x.yer)
}

/** Her tabağın hedef misafiri: tabaktakiler fişin altkümesiyse; bir misafire bir tabak; yoksa -1. */
function tabakHedefleri(oyun: Oyun): number[] {
  const alinan = new Set<number>()
  return oyun.tabaklar.map((tabak) => {
    if (tabak.length === 0) return -1
    const kalemler = tabak.map((k) => k.urun)
    const yer = bekleyenler(oyun).find((y) => !alinan.has(y) && altKume(kalemler, fisi(oyun, y)))
    if (yer === undefined) return -1
    alinan.add(yer)
    return yer
  })
}

/** Eldeki kalem hangi tabağa: hedefi olan ve kalemi daha eksik olan tabak, yoksa isteyen misafir varsa boş tabak, yoksa çöp. */
function koyulacakTabak(oyun: Oyun, urun: Kalem): Hedef {
  const hedefler = tabakHedefleri(oyun)
  for (const [no, tabak] of oyun.tabaklar.entries()) {
    const yer = hedefler[no] ?? -1
    if (yer === -1 || tabak.length >= TABAK_SINIRI) continue
    if (altKume([...tabak.map((k) => k.urun), urun], fisi(oyun, yer))) return `t${no}` as Hedef
  }
  const alinan = new Set(hedefler)
  const bos = oyun.tabaklar.findIndex((t) => t.length === 0)
  if (bos !== -1 && bekleyenler(oyun).some((y) => !alinan.has(y) && fisi(oyun, y).includes(urun))) {
    return `t${bos}` as Hedef
  }
  return 'cop'
}

/** Elde tabak: fişe uyuyorsa misafire, hedefi yoksa çöpe, eksikse yerine. */
function tabakla(oyun: Oyun, no: number): Hedef {
  const yer = tabakHedefleri(oyun)[no] ?? -1
  if (yer === -1) return 'cop'
  return fiseUyuyorMu(fisi(oyun, yer), oyun.tabaklar[no] ?? []) ? (`m${yer}` as Hedef) : 'birak'
}

/** Ocaktaki hazır şişlerden tutulacak ilk yuva: usta bandı bekler, düzenli hazır olunca; yanacaksa herkes tutar. */
function alinacakSis(oyun: Oyun, beceri: Beceri): Hedef | null {
  for (const [yuva, sis] of oyun.ocak.entries()) {
    if (!sis || sis.gecen < sis.pisme) continue
    const yanacak = sis.gecen >= sis.pisme + sis.pencere - ARALIK[beceri]
    const istenen = koyulacakTabak(oyun, sis.urun) !== 'cop'
    const zamani = beceri !== 'usta' || sisKalitesi(sis) === 'tam' || yanacak
    if ((istenen && zamani) || yanacak) return `o${yuva}` as Hedef
  }
  return null
}

function elBosKarar(oyun: Oyun, beceri: Beceri): Hedef | null {
  const para = oyun.paralar.findIndex(Boolean)
  if (para !== -1) return `p${para}` as Hedef
  const hedefler = tabakHedefleri(oyun)
  const hazir = hedefler.findIndex((yer, no) => yer !== -1 && fiseUyuyorMu(fisi(oyun, yer), oyun.tabaklar[no] ?? []))
  if (hazir !== -1) return `t${hazir}` as Hedef
  const yetim = hedefler.findIndex((yer, no) => yer === -1 && (oyun.tabaklar[no]?.length ?? 0) > 0)
  if (yetim !== -1) return `t${yetim}` as Hedef
  const al = alinacakSis(oyun, beceri)
  if (al) return al
  const eksik = eksikKalemler(oyun)
  const eslikci = eksik.find((k): k is Eslikci => KASELER.includes(k as Eslikci) && ACILDIGI_EVRE[k] <= oyun.evre)
  if (eslikci && koyulacakTabak(oyun, eslikci) !== 'cop') return eslikci
  const sis = eksik.find((k): k is Urun => RAF.includes(k as Urun) && ACILDIGI_EVRE[k] <= oyun.evre)
  const bosYuva = oyun.ocak.slice(0, evreAyari(oyun.evre).ocak).some((s) => !s)
  return sis && bosYuva ? sis : null
}

function rastgeleGirdi(oyun: Oyun, r: Rastgele): Hedef {
  const ayar = evreAyari(oyun.evre)
  const hedefler: Hedef[] = [
    ...RAF.filter((u) => ACILDIGI_EVRE[u] <= oyun.evre),
    ...KASELER.filter((e) => ACILDIGI_EVRE[e] <= oyun.evre),
    ...Array.from({ length: ayar.ocak }, (_, i) => `o${i}` as Hedef),
    't0', 't1',
    ...Array.from({ length: ayar.misafir }, (_, i) => `m${i}` as Hedef),
    'p0', 'p1', 'p2', 'cop', 'birak',
  ]
  return hedefler[r.tam(0, hedefler.length - 1)] as Hedef
}

function karar(oyun: Oyun, beceri: Beceri, r: Rastgele): Hedef | null {
  if (beceri === 'hareketsiz') return null
  if (beceri === 'rastgele') return rastgeleGirdi(oyun, r)
  const el = oyun.el
  if (el === null) return elBosKarar(oyun, beceri)
  return el.tur === 'tabak' ? tabakla(oyun, el.no) : koyulacakTabak(oyun, el.urun)
}

/** Bütün geceyi oynar, girdi kaydını döner. */
export function ustaOyna(tohum: number, beceri: Beceri): Girdi[] {
  const oyun = yeniOyun(tohum)
  const r = rastgele(tohum ^ 0x5bd1e995)
  const kayit: Girdi[] = []
  let sonGirdi = -ARALIK[beceri]
  while (!oyun.bitti) {
    const hedef = oyun.tik - sonGirdi >= ARALIK[beceri] ? karar(oyun, beceri, r) : null
    if (hedef) {
      kayit.push([oyun.tik, hedef])
      sonGirdi = oyun.tik
    }
    ilerle(oyun, hedef ? [hedef] : [])
  }
  return kayit
}
