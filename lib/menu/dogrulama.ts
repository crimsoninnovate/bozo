import { fotograflar } from '../../content/fotograflar.ts'
import type { Cift, IcecekKalemi, IcecekOlcusu, MenuBelgesi, MenuKalemi, OzelKalem } from './tipler.ts'

/** `yol`: "kalemler[2].fiyatlar.porsiyon". */
export type Sorun = { yol: string; kod: string; metin: string }
export type Sonuc =
  | { tamam: true; belge: MenuBelgesi; uyarilar: Sorun[] }
  | { tamam: false; hatalar: Sorun[] }

type Ctx = { hatalar: Sorun[]; uyarilar: Sorun[] }
type Nesne = Record<string, unknown>

const FOTO_IDLERI = new Set(Object.keys(fotograflar))
const KALEM_KIMLIK = /^[a-z0-9-]{2,40}$/
// Seed icecek kimlikleri camelCase (`kolaZero`); kalem kimligi kuraldan muaf degil.
const ICECEK_KIMLIK = /^[a-zA-Z0-9-]{2,40}$/
const ENFAZLA_KALEM = 40
const ENFAZLA_ICECEK = 30
const YASAK = /(?<![\p{L}])(müşteri|bedava|mangal|şef|parça|adet|masa)|7\/24/iu
const ONERI: Record<string, string> = {
  müşteri: 'misafir', bedava: 'ikram', mangal: 'ocak veya kor', şef: 'usta',
  parça: 'tane', adet: 'şiş veya porsiyon', masa: 'sofra', '7/24': 'gece açığız',
}

function hata(c: Ctx, yol: string, kod: string, metin: string): undefined {
  c.hatalar.push({ yol, kod, metin })
}

function nesneMi(v: unknown): v is Nesne {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function nesne(c: Ctx, v: unknown, yol: string, izinli: string[]): Nesne | undefined {
  if (!nesneMi(v)) return hata(c, yol, 'sema', 'Nesne bekleniyordu.')
  for (const anahtar of Object.keys(v)) {
    if (!izinli.includes(anahtar)) hata(c, `${yol}.${anahtar}`, 'bilinmeyenAlan', 'Bilinmeyen alan.')
  }
  return v
}

function dizi(c: Ctx, v: unknown, yol: string, en: number): unknown[] | undefined {
  if (!Array.isArray(v)) return hata(c, yol, 'sema', 'Liste bekleniyordu.')
  if (v.length > en) return hata(c, yol, 'cokFazla', `En çok ${en} kayıt olabilir.`)
  return v
}

function metinKurallari(c: Ctx, s: string, yol: string): void {
  if (/[—–]/.test(s)) hata(c, yol, 'tire', 'Uzun ve kısa tire kullanılmaz; virgül ya da kısa çizgi yaz.')
  if (/[âîûÂÎÛ]/.test(s)) hata(c, yol, 'sapka', 'Şapkalı harf kullanılmaz (â, î, û).')
  const tamBuyuk = (k: string) => k === k.toLocaleUpperCase('tr') && k !== k.toLocaleLowerCase('tr')
  const buyuk = (s.match(/\p{L}{4,}/gu) ?? []).find(tamBuyuk)
  if (buyuk) hata(c, yol, 'buyukHarf', `Tamamı büyük harf yazılmaz: ${buyuk}`)
  const yasak = s.match(YASAK)
  if (yasak) {
    const oneri = ONERI[(yasak[1] ?? '7/24').toLocaleLowerCase('tr')]
    c.uyarilar.push({ yol, kod: 'yasakTerim', metin: `"${yasak[0]}" yerine: ${oneri}` })
  }
}

function metin(c: Ctx, v: unknown, yol: string, en: number): string | undefined {
  if (typeof v !== 'string') return hata(c, yol, 'sema', 'Metin bekleniyordu.')
  // NFC: ayrık işaretler harf dizisini bölüp şapka ve büyük harf kurallarını atlatmasın.
  const s = v.normalize('NFC')
  if (s.trim() === '') return hata(c, yol, 'bos', 'Boş bırakılamaz.')
  if (s.length > en) return hata(c, yol, 'uzun', `En çok ${en} karakter olabilir.`)
  metinKurallari(c, s, yol)
  return s
}

function cift(c: Ctx, v: unknown, yol: string, en: number): Cift | undefined {
  const o = nesne(c, v, yol, ['tr', 'en'])
  if (!o) return undefined
  const tr = metin(c, o.tr, `${yol}.tr`, en)
  const eng = metin(c, o.en, `${yol}.en`, en)
  return tr !== undefined && eng !== undefined ? { tr, en: eng } : undefined
}

/** `null` serbest: dönüş `null` geçerli, `undefined` hatalı demektir. */
function ciftVeyaNull(c: Ctx, v: unknown, yol: string, en: number): Cift | null | undefined {
  return v === null ? null : cift(c, v, yol, en)
}

function fiyat(c: Ctx, v: unknown, yol: string): number | undefined {
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > 99999) {
    return hata(c, yol, 'fiyat', 'Fiyat 1 ile 99999 arasında, kuruşsuz tam sayı olmalı.')
  }
  return v
}

function kimlik(
  c: Ctx, v: unknown, yol: string, gorulen: Set<string>, desen: RegExp, harfler: string,
): string | undefined {
  if (typeof v !== 'string' || !desen.test(v)) {
    return hata(c, yol, 'kimlik', `Kimlik 2-40 karakter; ${harfler}, rakam ve tire olmalı.`)
  }
  if (gorulen.has(v)) return hata(c, yol, 'tekrar', 'Bu kimlik başka bir kayıtta var.')
  gorulen.add(v)
  return v
}

function fiyatlar(c: Ctx, v: unknown, yol: string): MenuKalemi['fiyatlar'] | undefined {
  const o = nesne(c, v, yol, ['porsiyon', 'durum'])
  if (!o) return undefined
  if (o.durum !== undefined && o.porsiyon === undefined) {
    return hata(c, `${yol}.porsiyon`, 'durum', 'Dürüm fiyatı varken porsiyon fiyatı da olmalı.')
  }
  const porsiyon = fiyat(c, o.porsiyon, `${yol}.porsiyon`)
  const durum = o.durum === undefined ? undefined : fiyat(c, o.durum, `${yol}.durum`)
  if (porsiyon === undefined || (o.durum !== undefined && durum === undefined)) return undefined
  return durum === undefined ? { porsiyon } : { porsiyon, durum }
}

function foto(c: Ctx, v: unknown, yol: string): MenuKalemi['fotoId'] | undefined {
  if (v === null) return null
  if (typeof v === 'string' && FOTO_IDLERI.has(v)) return v as MenuKalemi['fotoId']
  return hata(c, yol, 'foto', 'Bilinmeyen fotoğraf kimliği.')
}

const KALEM_ALANLARI = ['id', 'ad', 'aciklama', 'fiyatlar', 'porsiyonNotu', 'durumNotu', 'fotoId']

function kalem(c: Ctx, v: unknown, yol: string, gorulen: Set<string>): MenuKalemi | undefined {
  const o = nesne(c, v, yol, KALEM_ALANLARI)
  if (!o) return undefined
  const sonuc = {
    id: kimlik(c, o.id, `${yol}.id`, gorulen, KALEM_KIMLIK, 'küçük harf'),
    ad: cift(c, o.ad, `${yol}.ad`, 60),
    aciklama: ciftVeyaNull(c, o.aciklama, `${yol}.aciklama`, 240),
    fiyatlar: fiyatlar(c, o.fiyatlar, `${yol}.fiyatlar`),
    porsiyonNotu: ciftVeyaNull(c, o.porsiyonNotu, `${yol}.porsiyonNotu`, 40),
    durumNotu: ciftVeyaNull(c, o.durumNotu, `${yol}.durumNotu`, 40),
    fotoId: foto(c, o.fotoId, `${yol}.fotoId`),
  }
  return Object.values(sonuc).includes(undefined) ? undefined : (sonuc as MenuKalemi)
}

function kalemler(c: Ctx, v: unknown): MenuKalemi[] | undefined {
  const liste = dizi(c, v, 'kalemler', ENFAZLA_KALEM)
  if (!liste) return undefined
  const gorulen = new Set<string>()
  const cikti = liste.map((k, n) => kalem(c, k, `kalemler[${n}]`, gorulen))
  const ilk = cikti[0]
  if (liste.length === 0 || (ilk !== undefined && ilk.id !== 'ciger')) {
    hata(c, 'kalemler[0]', 'ilkKalem', 'İlk kalem ciğer olmalı.')
  }
  return cikti.every((k) => k !== undefined) ? cikti : undefined
}

function ozel(c: Ctx, v: unknown): OzelKalem | undefined {
  const o = nesne(c, v, 'ozel', ['ad', 'miktarNotu', 'aciklama', 'fiyat'])
  if (!o) return undefined
  const sonuc = {
    ad: cift(c, o.ad, 'ozel.ad', 60),
    miktarNotu: cift(c, o.miktarNotu, 'ozel.miktarNotu', 40),
    aciklama: cift(c, o.aciklama, 'ozel.aciklama', 240),
    fiyat: fiyat(c, o.fiyat, 'ozel.fiyat'),
  }
  return Object.values(sonuc).includes(undefined) ? undefined : (sonuc as OzelKalem)
}

function olcu(c: Ctx, v: unknown, yol: string): IcecekOlcusu | undefined {
  const o = nesne(c, v, yol, ['ad', 'fiyat'])
  if (!o) return undefined
  const ad = cift(c, o.ad, `${yol}.ad`, 60)
  const f = fiyat(c, o.fiyat, `${yol}.fiyat`)
  return ad !== undefined && f !== undefined ? { ad, fiyat: f } : undefined
}

function icecek(c: Ctx, v: unknown, yol: string, gorulen: Set<string>): IcecekKalemi | undefined {
  const o = nesne(c, v, yol, ['id', 'ad', 'olculer'])
  if (!o) return undefined
  const id = kimlik(c, o.id, `${yol}.id`, gorulen, ICECEK_KIMLIK, 'harf')
  const ad = cift(c, o.ad, `${yol}.ad`, 60)
  const liste = dizi(c, o.olculer, `${yol}.olculer`, Number.POSITIVE_INFINITY)
  if (liste?.length === 0) hata(c, `${yol}.olculer`, 'olcuYok', 'En az bir ölçü olmalı.')
  const olculer = liste?.map((x, n) => olcu(c, x, `${yol}.olculer[${n}]`))
  if (id === undefined || ad === undefined || !olculer?.length || olculer.includes(undefined)) return undefined
  return { id, ad, olculer: olculer as IcecekOlcusu[] }
}

function icecekler(c: Ctx, v: unknown): IcecekKalemi[] | undefined {
  const liste = dizi(c, v, 'icecekler', ENFAZLA_ICECEK)
  if (!liste) return undefined
  const gorulen = new Set<string>()
  const cikti = liste.map((i, n) => icecek(c, i, `icecekler[${n}]`, gorulen))
  return cikti.every((i) => i !== undefined) ? cikti : undefined
}

export function menuBelgesiDogrula(girdi: unknown): Sonuc {
  const c: Ctx = { hatalar: [], uyarilar: [] }
  const kok = nesne(c, girdi, 'belge', ['kalemler', 'ozel', 'icecekler'])
  const belge = kok && {
    kalemler: kalemler(c, kok.kalemler),
    ozel: ozel(c, kok.ozel),
    icecekler: icecekler(c, kok.icecekler),
  }
  if (c.hatalar.length > 0 || !belge || !belge.kalemler || !belge.ozel || !belge.icecekler) {
    return { tamam: false, hatalar: c.hatalar }
  }
  return { tamam: true, belge: belge as MenuBelgesi, uyarilar: c.uyarilar }
}
