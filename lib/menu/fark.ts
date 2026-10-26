import { fiyatMetni } from '../../content/isletme.ts'
import type { Cift, IcecekKalemi, IkramGrubu, IkramOgesi, IkramUrunu, MenuBelgesi, MenuKalemi } from './tipler.ts'

export type Degisiklik = { yol: string; etiket: string; once: string; sonra: string; buyukSicrama: boolean }

const YOK = 'yok'

function satir(yol: string, etiket: string, once: string, sonra: string, buyukSicrama = false): Degisiklik {
  return { yol, etiket, once, sonra, buyukSicrama }
}
const SICRAMA_ORANI = 0.5

type Fiyat = number | undefined

function fiyatSatiri(yol: string, etiket: string, once: Fiyat, sonra: Fiyat): Degisiklik[] {
  if (once === sonra) return []
  const buyukSicrama = once !== undefined && sonra !== undefined && Math.abs(sonra - once) / once > SICRAMA_ORANI
  const metin = (f: Fiyat) => (f === undefined ? YOK : fiyatMetni(f))
  return [satir(yol, etiket, metin(once), metin(sonra), buyukSicrama)]
}

function metinSatirlari(yol: string, etiket: string, once: Cift | null, sonra: Cift | null): Degisiklik[] {
  return (['tr', 'en'] as const).flatMap((dil) => {
    const a = once?.[dil] || YOK
    const b = sonra?.[dil] || YOK
    const ek = dil === 'tr' ? 'TR' : 'EN'
    return a === b ? [] : [satir(`${yol}.${dil}`, `${etiket} (${ek})`, a, b)]
  })
}

function fotoSatiri(yol: string, etiket: string, once: string | null, sonra: string | null): Degisiklik[] {
  if (once === sonra) return []
  return [satir(yol, etiket, once ?? YOK, sonra ?? YOK)]
}

function anahtarSatiri(
  yol: string, etiket: string, once: boolean, sonra: boolean, adlar: [string, string],
): Degisiklik[] {
  const ad = (b: boolean) => adlar[b ? 1 : 0]
  return once === sonra ? [] : [satir(yol, etiket, ad(once), ad(sonra))]
}

const TUKENDI: [string, string] = ['var', 'tükendi']

function kalemFarki(eski: MenuKalemi, yeni: MenuKalemi): Degisiklik[] {
  const yol = `kalemler.${yeni.id}`
  const ad = eski.ad.tr
  const e = eski.fiyatlar
  const y = yeni.fiyatlar
  return [
    ...metinSatirlari(`${yol}.ad`, `${ad}: ad`, eski.ad, yeni.ad),
    ...metinSatirlari(`${yol}.aciklama`, `${ad}: açıklama`, eski.aciklama, yeni.aciklama),
    ...fiyatSatiri(`${yol}.fiyatlar.porsiyon`, `${ad}: porsiyon fiyatı`, e.porsiyon, y.porsiyon),
    ...fiyatSatiri(`${yol}.fiyatlar.durum`, `${ad}: dürüm fiyatı`, e.durum, y.durum),
    ...metinSatirlari(`${yol}.porsiyonNotu`, `${ad}: porsiyon notu`, eski.porsiyonNotu, yeni.porsiyonNotu),
    ...metinSatirlari(`${yol}.durumNotu`, `${ad}: dürüm notu`, eski.durumNotu, yeni.durumNotu),
    ...fotoSatiri(`${yol}.fotoId`, `${ad}: fotoğraf`, eski.fotoId, yeni.fotoId),
    ...anahtarSatiri(`${yol}.tukendi`, `${ad}: bugün`, eski.tukendi, yeni.tukendi, TUKENDI),
  ]
}

function kalemOzeti(k: MenuKalemi): string {
  return `porsiyon ${fiyatMetni(k.fiyatlar.porsiyon)}`
}

function icecekFarki(eski: IcecekKalemi, yeni: IcecekKalemi): Degisiklik[] {
  const yol = `icecekler.${yeni.id}`
  const cikti = metinSatirlari(`${yol}.ad`, `İçecekler: ${eski.ad.tr}: ad`, eski.ad, yeni.ad)
  const en = Math.max(eski.olculer.length, yeni.olculer.length)
  for (let n = 0; n < en; n++) {
    const a = eski.olculer[n]
    const b = yeni.olculer[n]
    const olcuAdi = (a ?? b)?.ad.tr.toLocaleLowerCase('tr') ?? ''
    const etiket = `İçecekler: ${eski.ad.tr}, ${olcuAdi}`
    const olcuYol = `${yol}.olculer[${n}]`
    cikti.push(...fiyatSatiri(`${olcuYol}.fiyat`, etiket, a?.fiyat, b?.fiyat))
    if (a && b) cikti.push(...metinSatirlari(`${olcuYol}.ad`, `${etiket}: ad`, a.ad, b.ad))
  }
  const bugun = `İçecekler: ${eski.ad.tr}: bugün`
  return [...cikti, ...anahtarSatiri(`${yol}.tukendi`, bugun, eski.tukendi, yeni.tukendi, TUKENDI)]
}

function icecekOzeti(i: IcecekKalemi): string {
  return i.olculer.map((o) => `${o.ad.tr.toLocaleLowerCase('tr')} ${fiyatMetni(o.fiyat)}`).join(', ')
}

type Kayit = { id: string; ad: Cift }

/** Kimliğe göre eşler; ortak kimliklerin sırası değiştiyse sıra satırı ekler. */
function listeFarki<T extends Kayit>(
  yolOn: string, baslik: string, eski: T[], yeni: T[],
  ozet: (k: T) => string, degisen: (a: T, b: T) => Degisiklik[],
): Degisiklik[] {
  const eskiler = new Map(eski.map((k) => [k.id, k]))
  const yeniler = new Map(yeni.map((k) => [k.id, k]))
  const cikti: Degisiklik[] = []
  for (const k of eski) {
    const b = yeniler.get(k.id)
    if (b) cikti.push(...degisen(k, b))
    else cikti.push(satir(`${yolOn}.${k.id}`, `${k.ad.tr}: ${baslik}`, ozet(k), 'silindi'))
  }
  for (const k of yeni) {
    if (!eskiler.has(k.id)) {
      cikti.push(satir(`${yolOn}.${k.id}`, `${k.ad.tr}: ${baslik}`, YOK, `eklendi, ${ozet(k)}`))
    }
  }
  const ortakSira = (liste: T[], diger: Map<string, T>) => liste.filter((k) => diger.has(k.id))
  const a = ortakSira(eski, yeniler)
  const b = ortakSira(yeni, eskiler)
  if (a.map((k) => k.id).join() !== b.map((k) => k.id).join()) {
    const etiket = `${baslik.charAt(0).toLocaleUpperCase('tr')}${baslik.slice(1)} sırası`
    cikti.push(satir(yolOn, etiket, a.map((k) => k.ad.tr).join(', '), b.map((k) => k.ad.tr).join(', ')))
  }
  return cikti
}

function ozelFarki(eski: MenuBelgesi['ozel'], yeni: MenuBelgesi['ozel']): Degisiklik[] {
  const ad = eski.ad.tr
  return [
    ...metinSatirlari('ozel.ad', `${ad}: ad`, eski.ad, yeni.ad),
    ...metinSatirlari('ozel.miktarNotu', `${ad}: miktar notu`, eski.miktarNotu, yeni.miktarNotu),
    ...metinSatirlari('ozel.aciklama', `${ad}: açıklama`, eski.aciklama, yeni.aciklama),
    ...fiyatSatiri('ozel.fiyat', `${ad}: fiyat`, eski.fiyat, yeni.fiyat),
  ]
}

const bitisSatiri = (once: string | null, sonra: string | null) =>
  satir('duyuru.bitis', 'Duyuru: bitiş', once ?? YOK, sonra ?? YOK)

function duyuruFarki(eski: MenuBelgesi['duyuru'], yeni: MenuBelgesi['duyuru']): Degisiklik[] {
  return [
    ...anahtarSatiri('duyuru.aktif', 'Duyuru: bant', eski.aktif, yeni.aktif, ['kapalı', 'açık']),
    ...metinSatirlari('duyuru.metin', 'Duyuru: metin', eski.metin, yeni.metin),
    ...(eski.bitis === yeni.bitis ? [] : [bitisSatiri(eski.bitis, yeni.bitis)]),
  ]
}

const ILETISIM_ETIKETLERI = {
  telefon: 'telefon', eposta: 'e-posta', instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok',
  googleYorumKodu: 'Google yorum kodu',
} as const

function iletisimFarki(eski: MenuBelgesi['iletisim'], yeni: MenuBelgesi['iletisim']): Degisiklik[] {
  const kapali: [string, string] = ['kapalı', 'açık']
  const acik = anahtarSatiri(
    'iletisim.telefonAcik', 'İletişim: telefonla iletişim', eski.telefonAcik, yeni.telefonAcik, kapali,
  )
  const alanlar = (Object.keys(ILETISIM_ETIKETLERI) as (keyof typeof ILETISIM_ETIKETLERI)[]).flatMap((k) =>
    eski[k] === yeni[k] ? [] : [satir(`iletisim.${k}`, `İletişim: ${ILETISIM_ETIKETLERI[k]}`, eski[k], yeni[k])],
  )
  return [...acik, ...alanlar]
}

function ikramUrunuFarki(eski: IkramUrunu, yeni: IkramUrunu): Degisiklik[] {
  const yol = `ikramlar.urunler.${yeni.id}`
  const ad = eski.ad.tr
  return [
    ...metinSatirlari(`${yol}.ad`, `${ad}: ad`, eski.ad, yeni.ad),
    ...metinSatirlari(`${yol}.aciklama`, `${ad}: açıklama`, eski.aciklama, yeni.aciklama),
    ...fotoSatiri(`${yol}.fotoId`, `${ad}: fotoğraf`, eski.fotoId, yeni.fotoId),
  ]
}

function ikramOgesiFarki(yolOn: string): (a: IkramOgesi, b: IkramOgesi) => Degisiklik[] {
  return (a, b) => metinSatirlari(`${yolOn}.${b.id}.ad`, `${a.ad.tr}: ad`, a.ad, b.ad)
}

function ikramGrubuFarki(eski: IkramGrubu, yeni: IkramGrubu): Degisiklik[] {
  const yol = `ikramlar.gruplar.${yeni.id}`
  const ad = eski.ad.tr
  return [
    ...metinSatirlari(`${yol}.ad`, `${ad}: küme adı`, eski.ad, yeni.ad),
    ...metinSatirlari(`${yol}.not`, `${ad}: küme notu`, eski.not, yeni.not),
    ...listeFarki(
      `${yol}.ogeler`, `${ad} öğesi`, eski.ogeler, yeni.ogeler, (o) => o.ad.en, ikramOgesiFarki(`${yol}.ogeler`),
    ),
  ]
}

function ikramlarFarki(eski: MenuBelgesi['ikramlar'], yeni: MenuBelgesi['ikramlar']): Degisiklik[] {
  return [
    ...metinSatirlari('ikramlar.altMetin', 'İkramlar: alt metin', eski.altMetin, yeni.altMetin),
    ...listeFarki('ikramlar.urunler', 'ikram', eski.urunler, yeni.urunler, (u) => u.ad.en, ikramUrunuFarki),
    ...listeFarki(
      'ikramlar.gruplar', 'küme', eski.gruplar, yeni.gruplar, (g) => `${g.ogeler.length} öğe`, ikramGrubuFarki,
    ),
  ]
}

/** İki belge arasındaki değişiklikler; `buyukSicrama`: fiyat eskiye göre %50'den fazla oynadı. */
export function menuFarki(eski: MenuBelgesi, yeni: MenuBelgesi): Degisiklik[] {
  return [
    ...listeFarki('kalemler', 'kalem', eski.kalemler, yeni.kalemler, kalemOzeti, kalemFarki),
    ...ozelFarki(eski.ozel, yeni.ozel),
    ...listeFarki('icecekler', 'içecek', eski.icecekler, yeni.icecekler, icecekOzeti, icecekFarki),
    ...duyuruFarki(eski.duyuru, yeni.duyuru),
    ...ikramlarFarki(eski.ikramlar, yeni.ikramlar),
    ...iletisimFarki(eski.iletisim, yeni.iletisim),
  ]
}
