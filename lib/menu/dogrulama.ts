import { fotograflar } from '../../content/fotograflar.ts'
import type {
  Cift, Duyuru, IcecekKalemi, IcecekOlcusu, IkramGrubu, IkramOgesi, Ikramlar, IkramUrunu, Iletisim,
  MenuBelgesi, MenuKalemi, OzelKalem,
} from './tipler.ts'

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
export const DUYURU_EN_FAZLA = 140
const ENFAZLA_IKRAM = 12
const ENFAZLA_KUME = 8
const ENFAZLA_OGE = 10
const BITIS = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
const KULLANICI_ADI = /^[A-Za-z0-9._]{1,40}$/
const EPOSTA = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// En az 7 rakam: yalnız boşluktan oluşan gövde geçmesin.
const TELEFON = /^\+(?=(?:\s*[0-9]){7})[0-9 ]{8,20}$/
const YORUM_KODU = /^[A-Za-z0-9_-]{6,40}$/
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

function mantik(c: Ctx, v: unknown, yol: string): boolean | undefined {
  return typeof v === 'boolean' ? v : hata(c, yol, 'sema', 'Evet ya da hayır bekleniyordu.')
}

/** Eski belgede yok: eksikse `false`. */
function tukendi(c: Ctx, v: unknown, yol: string): boolean | undefined {
  return v === undefined ? false : mantik(c, v, yol)
}

const KALEM_ALANLARI = ['id', 'ad', 'aciklama', 'fiyatlar', 'porsiyonNotu', 'durumNotu', 'fotoId', 'tukendi']

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
    tukendi: tukendi(c, o.tukendi, `${yol}.tukendi`),
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
  const o = nesne(c, v, yol, ['id', 'ad', 'olculer', 'tukendi'])
  if (!o) return undefined
  const id = kimlik(c, o.id, `${yol}.id`, gorulen, ICECEK_KIMLIK, 'harf')
  const ad = cift(c, o.ad, `${yol}.ad`, 60)
  const liste = dizi(c, o.olculer, `${yol}.olculer`, Number.POSITIVE_INFINITY)
  if (liste?.length === 0) hata(c, `${yol}.olculer`, 'olcuYok', 'En az bir ölçü olmalı.')
  const olculer = liste?.map((x, n) => olcu(c, x, `${yol}.olculer[${n}]`))
  const yok = tukendi(c, o.tukendi, `${yol}.tukendi`)
  if (id === undefined || ad === undefined || !olculer?.length || olculer.includes(undefined)) return undefined
  return yok === undefined ? undefined : { id, ad, olculer: olculer as IcecekOlcusu[], tukendi: yok }
}

function icecekler(c: Ctx, v: unknown): IcecekKalemi[] | undefined {
  const liste = dizi(c, v, 'icecekler', ENFAZLA_ICECEK)
  if (!liste) return undefined
  const gorulen = new Set<string>()
  const cikti = liste.map((i, n) => icecek(c, i, `icecekler[${n}]`, gorulen))
  return cikti.every((i) => i !== undefined) ? cikti : undefined
}

/** Yeni bölümlerin metni düz metindir: HTML işareti yok. `bosOlur`: pasif duyuruda boş metin geçerli. */
function duzMetin(c: Ctx, v: unknown, yol: string, en: number, bosOlur = false): string | undefined {
  if (bosOlur && typeof v === 'string' && v.trim() === '') return ''
  const s = metin(c, v, yol, en)
  if (s !== undefined && /[<>]/.test(s)) return hata(c, yol, 'htmlIsareti', 'Metinde < ve > kullanılmaz.')
  return s
}

function duzCift(c: Ctx, v: unknown, yol: string, en: number, bosOlur = false): Cift | undefined {
  const o = nesne(c, v, yol, ['tr', 'en'])
  if (!o) return undefined
  const tr = duzMetin(c, o.tr, `${yol}.tr`, en, bosOlur)
  const eng = duzMetin(c, o.en, `${yol}.en`, en, bosOlur)
  return tr !== undefined && eng !== undefined ? { tr, en: eng } : undefined
}

function tamsa<T>(sonuc: Record<string, unknown>): T | undefined {
  return Object.values(sonuc).includes(undefined) ? undefined : (sonuc as T)
}

function bolumEksik(c: Ctx, yol: string): undefined {
  return hata(c, yol, 'bolumEksik', 'Bu bölüm belgede yok.')
}

function bitisGecerliMi(e: RegExpExecArray): boolean {
  const [y = 0, ay = 0, g = 0, saat = 99, dk = 99] = e.slice(1).map(Number)
  const t = new Date(Date.UTC(y, ay - 1, g))
  return t.getUTCFullYear() === y && t.getUTCMonth() === ay - 1 && t.getUTCDate() === g && saat < 24 && dk < 60
}

function bitis(c: Ctx, v: unknown): string | null | undefined {
  if (v === null) return null
  const e = typeof v === 'string' ? BITIS.exec(v) : null
  if (typeof v === 'string' && e && bitisGecerliMi(e)) return v
  return hata(c, 'duyuru.bitis', 'bitis', 'Bitiş "YYYY-AA-GGTSS:DD" biçiminde ve gerçek bir an olmalı.')
}

/** Eksikse pasif duyuru: eski belge geçerli kalır. */
function duyuru(c: Ctx, v: unknown): Duyuru | undefined {
  if (v === undefined) return { aktif: false, metin: { tr: '', en: '' }, bitis: null }
  const o = nesne(c, v, 'duyuru', ['aktif', 'metin', 'bitis'])
  if (!o) return undefined
  const aktif = mantik(c, o.aktif, 'duyuru.aktif')
  const m = duzCift(c, o.metin, 'duyuru.metin', DUYURU_EN_FAZLA, aktif === false)
  return tamsa<Duyuru>({ aktif, metin: m, bitis: bitis(c, o.bitis) })
}

type Tek<T> = (v: unknown, yol: string) => T | undefined

function kayitlar<T>(c: Ctx, v: unknown, yol: string, en: number, tek: Tek<T>): T[] | undefined {
  const liste = dizi(c, v, yol, en)
  if (!liste) return undefined
  const cikti = liste.map((x, n) => tek(x, `${yol}[${n}]`))
  return cikti.every((x) => x !== undefined) ? cikti : undefined
}

function ikramUrunu(c: Ctx, gorulen: Set<string>): Tek<IkramUrunu> {
  return (v, yol) => {
    const o = nesne(c, v, yol, ['id', 'ad', 'aciklama', 'fotoId'])
    if (!o) return undefined
    return tamsa<IkramUrunu>({
      id: kimlik(c, o.id, `${yol}.id`, gorulen, KALEM_KIMLIK, 'küçük harf'),
      ad: duzCift(c, o.ad, `${yol}.ad`, 60),
      aciklama: duzCift(c, o.aciklama, `${yol}.aciklama`, 240),
      fotoId: foto(c, o.fotoId, `${yol}.fotoId`),
    })
  }
}

function ikramOgesi(c: Ctx, gorulen: Set<string>): Tek<IkramOgesi> {
  return (v, yol) => {
    const o = nesne(c, v, yol, ['id', 'ad'])
    if (!o) return undefined
    return tamsa<IkramOgesi>({
      id: kimlik(c, o.id, `${yol}.id`, gorulen, KALEM_KIMLIK, 'küçük harf'),
      ad: duzCift(c, o.ad, `${yol}.ad`, 60),
    })
  }
}

function ikramGrubu(c: Ctx, gorulen: Set<string>, ogeGorulen: Set<string>): Tek<IkramGrubu> {
  return (v, yol) => {
    const o = nesne(c, v, yol, ['id', 'ad', 'not', 'ogeler'])
    if (!o) return undefined
    return tamsa<IkramGrubu>({
      id: kimlik(c, o.id, `${yol}.id`, gorulen, KALEM_KIMLIK, 'küçük harf'),
      ad: duzCift(c, o.ad, `${yol}.ad`, 60),
      not: o.not === null ? null : duzCift(c, o.not, `${yol}.not`, 60),
      ogeler: kayitlar(c, o.ogeler, `${yol}.ogeler`, ENFAZLA_OGE, ikramOgesi(c, ogeGorulen)),
    })
  }
}

function ikramlar(c: Ctx, v: unknown): Ikramlar | undefined {
  if (v === undefined) return bolumEksik(c, 'ikramlar')
  const o = nesne(c, v, 'ikramlar', ['altMetin', 'urunler', 'gruplar'])
  if (!o) return undefined
  return tamsa<Ikramlar>({
    altMetin: duzCift(c, o.altMetin, 'ikramlar.altMetin', 120),
    urunler: kayitlar(c, o.urunler, 'ikramlar.urunler', ENFAZLA_IKRAM, ikramUrunu(c, new Set())),
    gruplar: kayitlar(c, o.gruplar, 'ikramlar.gruplar', ENFAZLA_KUME, ikramGrubu(c, new Set(), new Set())),
  })
}

function desenli(
  c: Ctx, v: unknown, yol: string, desen: RegExp, kod: string, metni: string, en = Number.POSITIVE_INFINITY,
): string | undefined {
  if (typeof v === 'string' && v.length <= en && desen.test(v)) return v
  return hata(c, yol, kod, metni)
}

const KULLANICI_METNI = 'Kullanıcı adı 1-40 karakter; harf, rakam, nokta ve alt çizgi olmalı, @ ve boşluk olmaz.'

function iletisim(c: Ctx, v: unknown): Iletisim | undefined {
  if (v === undefined) return bolumEksik(c, 'iletisim')
  const o = nesne(c, v, 'iletisim', [
    'telefonAcik', 'telefon', 'eposta', 'instagram', 'facebook', 'tiktok', 'googleYorumKodu',
  ])
  if (!o) return undefined
  const kullanici = (alan: string) =>
    desenli(c, o[alan], `iletisim.${alan}`, KULLANICI_ADI, 'kullaniciAdi', KULLANICI_METNI)
  return tamsa<Iletisim>({
    telefonAcik: mantik(c, o.telefonAcik, 'iletisim.telefonAcik'),
    telefon: desenli(
      c, o.telefon, 'iletisim.telefon', TELEFON, 'telefon', 'Telefon "+90 533 888 74 24" gibi, + ile başlamalı.',
    ),
    eposta: desenli(c, o.eposta, 'iletisim.eposta', EPOSTA, 'eposta', 'E-posta adresi geçerli değil.', 100),
    instagram: kullanici('instagram'),
    facebook: kullanici('facebook'),
    tiktok: kullanici('tiktok'),
    googleYorumKodu: desenli(
      c, o.googleYorumKodu, 'iletisim.googleYorumKodu', YORUM_KODU, 'yorumKodu', 'Yorum kodu 6-40 karakter olmalı.',
    ),
  })
}

export function menuBelgesiDogrula(girdi: unknown): Sonuc {
  const c: Ctx = { hatalar: [], uyarilar: [] }
  const kok = nesne(c, girdi, 'belge', ['kalemler', 'ozel', 'icecekler', 'duyuru', 'ikramlar', 'iletisim'])
  const belge = kok && {
    kalemler: kalemler(c, kok.kalemler),
    ozel: ozel(c, kok.ozel),
    icecekler: icecekler(c, kok.icecekler),
    duyuru: duyuru(c, kok.duyuru),
    ikramlar: ikramlar(c, kok.ikramlar),
    iletisim: iletisim(c, kok.iletisim),
  }
  if (c.hatalar.length > 0 || !belge || Object.values(belge).includes(undefined)) {
    return { tamam: false, hatalar: c.hatalar }
  }
  return { tamam: true, belge: belge as MenuBelgesi, uyarilar: c.uyarilar }
}
