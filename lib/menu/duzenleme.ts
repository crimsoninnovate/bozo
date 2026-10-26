import type {
  IcecekKalemi, IcecekOlcusu, IkramGrubu, IkramOgesi, IkramUrunu, Ikramlar, MenuBelgesi, MenuKalemi,
} from './tipler.ts'

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
    tukendi: false,
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
    tukendi: false,
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

function ikramGuncelle(b: MenuBelgesi, degis: (i: Ikramlar) => Ikramlar): MenuBelgesi {
  return { ...b, ikramlar: degis(b.ikramlar) }
}

function grupGuncelle(
  b: MenuBelgesi, id: string, degis: (g: IkramGrubu) => IkramGrubu,
): MenuBelgesi {
  return ikramGuncelle(b, (i) => {
    const n = indeks(i.gruplar, id)
    return { ...i, gruplar: i.gruplar.map((g, s) => (s === n ? degis(g) : g)) }
  })
}

/** Sona eklenir; açıklama ve EN boş başlar, doğrulama doldurulana kadar yayını engeller. */
export function ikramUrunuEkle(b: MenuBelgesi, adTr: string): MenuBelgesi {
  const urun: IkramUrunu = {
    id: kimlikUret(adTr, b.ikramlar.urunler.map((u) => u.id)),
    ad: { tr: adTr, en: '' },
    aciklama: { tr: '', en: '' },
    fotoId: null,
  }
  return ikramGuncelle(b, (i) => ({ ...i, urunler: [...i.urunler, urun] }))
}

export function ikramUrunuSil(b: MenuBelgesi, id: string): MenuBelgesi {
  const n = indeks(b.ikramlar.urunler, id)
  return ikramGuncelle(b, (i) => ({ ...i, urunler: i.urunler.filter((_, s) => s !== n) }))
}

/** Uçtaki ürün dışarı taşınmaz: yerinde kalır, hata atılmaz (düğme zaten pasif olur). */
export function ikramUrunuTasi(b: MenuBelgesi, id: string, yon: -1 | 1): MenuBelgesi {
  const n = indeks(b.ikramlar.urunler, id)
  const hedef = n + yon
  if (hedef < 0 || hedef >= b.ikramlar.urunler.length) return b
  const liste = [...b.ikramlar.urunler]
  const [urun] = liste.splice(n, 1)
  liste.splice(hedef, 0, urun as IkramUrunu)
  return ikramGuncelle(b, (i) => ({ ...i, urunler: liste }))
}

/** `n`. öğe `yon` kadar kaydırılmış kopya; uçta kalırsa sıra değişmez. */
function kaydir<T>(liste: readonly T[], n: number, yon: -1 | 1): T[] {
  const kopya = [...liste]
  const hedef = n + yon
  if (hedef < 0 || hedef >= kopya.length) return kopya
  const [oge] = kopya.splice(n, 1)
  kopya.splice(hedef, 0, oge as T)
  return kopya
}

export function ikramGrubuEkle(b: MenuBelgesi, adTr: string): MenuBelgesi {
  const grup: IkramGrubu = {
    id: kimlikUret(adTr, b.ikramlar.gruplar.map((g) => g.id)),
    ad: { tr: adTr, en: '' },
    not: null,
    ogeler: [],
  }
  return ikramGuncelle(b, (i) => ({ ...i, gruplar: [...i.gruplar, grup] }))
}

/** Uçtaki küme yerinde kalır, hata atılmaz (ürünlerdeki gibi). */
export function ikramGrubuTasi(b: MenuBelgesi, id: string, yon: -1 | 1): MenuBelgesi {
  const gruplar = b.ikramlar.gruplar
  return ikramGuncelle(b, (i) => ({ ...i, gruplar: kaydir(gruplar, indeks(gruplar, id), yon) }))
}

/** En az bir küme kalmalı. */
export function ikramGrubuSil(b: MenuBelgesi, id: string): MenuBelgesi {
  const n = indeks(b.ikramlar.gruplar, id)
  if (b.ikramlar.gruplar.length <= 1) throw new Error(`son küme silinemez: ${id}`)
  return ikramGuncelle(b, (i) => ({ ...i, gruplar: i.gruplar.filter((_, s) => s !== n) }))
}

/** Öğe kimlikleri bütün kümelerde tekil olmalı (doğrulama böyle okur). */
export function ikramOgesiEkle(b: MenuBelgesi, grupId: string, adTr: string): MenuBelgesi {
  const tum = b.ikramlar.gruplar.flatMap((g) => g.ogeler.map((o) => o.id))
  const oge: IkramOgesi = { id: kimlikUret(adTr, tum), ad: { tr: adTr, en: '' } }
  return grupGuncelle(b, grupId, (g) => ({ ...g, ogeler: [...g.ogeler, oge] }))
}

export function ikramOgesiSil(b: MenuBelgesi, grupId: string, ogeId: string): MenuBelgesi {
  return grupGuncelle(b, grupId, (g) => {
    const n = indeks(g.ogeler, ogeId)
    return { ...g, ogeler: g.ogeler.filter((_, s) => s !== n) }
  })
}

/** Yalnız o kümenin içinde taşınır; uçtaki öğe yerinde kalır. */
export function ikramOgesiTasi(b: MenuBelgesi, grupId: string, ogeId: string, yon: -1 | 1): MenuBelgesi {
  return grupGuncelle(b, grupId, (g) => ({ ...g, ogeler: kaydir(g.ogeler, indeks(g.ogeler, ogeId), yon) }))
}

/**
 * Sayı alanındaki girdiyi fiyata çevirir: boş `null`, tarayıcının sayı saymadığı metin (`bozuk`) `NaN`,
 * ki doğrulama reddetsin; sessizce "fiyat yok" sayılmasın.
 */
export function fiyatYaz(girdi: string, bozuk: boolean): number | null {
  if (bozuk) return Number.NaN
  return girdi === '' ? null : Number(girdi)
}
