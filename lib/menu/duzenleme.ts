import type { IcecekKalemi, IcecekOlcusu, MenuBelgesi, MenuKalemi } from './tipler.ts'

/* Panelin liste işlemleri: hepsi yeni belge döner, girdiyi değiştirmez. */

const KIMLIK_EN_FAZLA = 40
const SONEK_PAYI = 6
const ASCII: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' }

function govde(ad: string): string {
  const slug = ad
    .toLocaleLowerCase('tr')
    .replace(/[çğıöşü]/g, (h) => ASCII[h] ?? h)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, KIMLIK_EN_FAZLA - SONEK_PAYI)
    .replace(/-+$/, '')
  return slug.length >= 2 ? slug : `yeni-${slug}`.replace(/-+$/, '')
}

/** "Kuzu Şiş" -> "kuzu-sis"; `mevcut` içinde varsa "-2", "-3" eklenir. */
export function kimlikUret(ad: string, mevcut: readonly string[]): string {
  const dolu = new Set(mevcut.map((k) => k.toLowerCase()))
  const temel = govde(ad)
  let kimlik = temel
  for (let n = 2; dolu.has(kimlik); n++) kimlik = `${temel}-${n}`
  return kimlik
}

function indeks<T extends { id: string }>(liste: readonly T[], id: string): number {
  const n = liste.findIndex((k) => k.id === id)
  if (n < 0) throw new Error(`kayıt yok: ${id}`)
  return n
}

function icecekGuncelle(
  b: MenuBelgesi, id: string, degis: (i: IcecekKalemi) => IcecekKalemi,
): MenuBelgesi {
  const n = indeks(b.icecekler, id)
  return { ...b, icecekler: b.icecekler.map((i, s) => (s === n ? degis(i) : i)) }
}

const bosOlcu = (): IcecekOlcusu => ({ ad: { tr: '', en: '' }, fiyat: 0 })

/** Sona eklenir; porsiyon 0 ile başlar, doğrulama doldurulana kadar yayını engeller. */
export function kalemEkle(b: MenuBelgesi, adTr: string): MenuBelgesi {
  const kalem: MenuKalemi = {
    id: kimlikUret(adTr, b.kalemler.map((k) => k.id)),
    ad: { tr: adTr, en: '' },
    aciklama: null,
    fiyatlar: { porsiyon: 0 },
    porsiyonNotu: null,
    durumNotu: null,
    fotoId: null,
  }
  return { ...b, kalemler: [...b.kalemler, kalem] }
}

export function kalemSil(b: MenuBelgesi, id: string): MenuBelgesi {
  if (id === 'ciger') throw new Error('Ciğer menüden silinemez.')
  const n = indeks(b.kalemler, id)
  return { ...b, kalemler: b.kalemler.filter((_, s) => s !== n) }
}

/** Ciğer sabittir: ne kendisi taşınır ne de başka kalem onun yerine (ilk sıraya) geçer. */
export function kalemTasi(b: MenuBelgesi, id: string, yon: -1 | 1): MenuBelgesi {
  if (id === 'ciger') throw new Error('Ciğer taşınamaz.')
  const n = indeks(b.kalemler, id)
  const hedef = n + yon
  if (hedef < 1 || hedef >= b.kalemler.length) throw new Error(`kalem bu yöne taşınamaz: ${id}`)
  const liste = [...b.kalemler]
  const [kalem] = liste.splice(n, 1)
  liste.splice(hedef, 0, kalem as MenuKalemi)
  return { ...b, kalemler: liste }
}

export function icecekEkle(b: MenuBelgesi, adTr: string): MenuBelgesi {
  const icecek: IcecekKalemi = {
    id: kimlikUret(adTr, b.icecekler.map((i) => i.id)),
    ad: { tr: adTr, en: '' },
    olculer: [bosOlcu()],
  }
  return { ...b, icecekler: [...b.icecekler, icecek] }
}

export function icecekSil(b: MenuBelgesi, id: string): MenuBelgesi {
  const n = indeks(b.icecekler, id)
  return { ...b, icecekler: b.icecekler.filter((_, s) => s !== n) }
}

export function olcuEkle(b: MenuBelgesi, icecekId: string): MenuBelgesi {
  return icecekGuncelle(b, icecekId, (i) => ({ ...i, olculer: [...i.olculer, bosOlcu()] }))
}

/** İçecekte en az bir ölçü kalmalı. */
export function olcuSil(b: MenuBelgesi, icecekId: string, sira: number): MenuBelgesi {
  return icecekGuncelle(b, icecekId, (i) => {
    if (i.olculer.length <= 1) throw new Error(`son ölçü silinemez: ${icecekId}`)
    if (!Number.isInteger(sira) || sira < 0 || sira >= i.olculer.length) throw new Error(`ölçü yok: ${sira}`)
    return { ...i, olculer: i.olculer.filter((_, s) => s !== sira) }
  })
}

/**
 * Sayı alanındaki girdiyi fiyata çevirir: boş `null`, tarayıcının sayı saymadığı metin (`bozuk`) `NaN`,
 * ki doğrulama reddetsin; sessizce "fiyat yok" sayılmasın.
 */
export function fiyatYaz(girdi: string, bozuk: boolean): number | null {
  if (bozuk) return Number.NaN
  return girdi === '' ? null : Number(girdi)
}
