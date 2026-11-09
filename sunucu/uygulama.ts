import type { IncomingMessage, ServerResponse } from 'node:http'
import type { BlockList } from 'node:net'
import type { Depo } from './depo.ts'
import { hizSiniriKur } from './hiz.ts'
import { corsBasliklari, govdeOku, hamGovdeOku, IstekHatasi, yanitYaz, type Istek, type Yanit } from './http.ts'
import { gercekIp } from './ip.ts'
import { yonetimDerlemeDurumu, yonetimDerlemeIste } from './derleme.ts'
import { yonetimFotoYukle } from './foto.ts'
import { islerKur, type Isler } from './isler.ts'
import {
  yonetimBen, yonetimIslemler, yonetimPersonelEkle, yonetimPersonelKapat, yonetimPersonelListe, yonetimPersonelSifre,
  yonetimSifre,
} from './personel.ts'
import {
  MENU_ONBELLEK_MS, menuAl, yonetimMenuAl, yonetimMenuGeriAl, yonetimMenuSurumAl, yonetimMenuYayinla,
} from './menu.ts'
import {
  benAl,
  hesabiSil,
  onbellekKur,
  oyuncuOl,
  tabloAl,
  taramaKaydet,
  turAl,
  turBitir,
  TABLO_ONBELLEK_MS,
  type Baglam,
} from './uclar.ts'
import {
  yonetimGizle,
  yonetimKod,
  yonetimOturum,
  yonetimSayac,
  yonetimSiralama,
  yonetimTarama,
  yonetimTur,
  yetkiliCoz,
  type YonetimKimligi,
  type Yetkili,
} from './yonetim.ts'

export type Ayar = {
  kokenler: readonly string[]
  tuz: string
  yonetim: YonetimKimligi | null
  guvenilirVekil: BlockList
  kampanyaBitis: number | null
  /** Yalnız test: `GET /menu` IP başına saatlik sınırı (varsayılan `MENU_SAATLIK`). */
  menuSaatlik?: number
  /** Yüklenen fotoğrafların dizini; yoksa `POST /yonetim/foto` 503 `fotoKapali` döner. */
  fotoDizini?: string | null
  /** Derleme istek/durum dizini; yoksa `/yonetim/derleme` 503 `derlemeKapali` döner. */
  derlemeDizini?: string | null
}

export type Gunluk = Pick<Console, 'warn' | 'error'>

export type Uygulama = {
  isle(req: IncomingMessage, res: ServerResponse): Promise<void>
  isler: Isler
  /** Hız sınırı belleğini kırpar; zamanlayıcıdan çağrılır. */
  temizle(simdi: number): void
}

const SAAT_MS = 60 * 60_000
/** Spec §9: oyuncu 40 tur/saat, IP 600 istek/saat; yönetim ucuna IP başına 60/saat (kod tahmini);
 * `GET /yonetim/derleme` bunun dışında, geçerli kimlikle kendi 1200/saat kovasında. */
const OYUNCU_SAATLIK = 40
const IP_SAATLIK = 600
const YONETIM_SAATLIK = 60
/** `GET /menu` için ayrı, geniş kova: restoranın wifi'si tek IP, genel 600'lük kovayı yemez. */
const MENU_SAATLIK = 6000
/** `GET /yonetim/derleme`: panel 5 sn'de bir yoklar (~84 istek/derleme), 60'lık yönetim kovasına girmez. */
const DERLEME_SAATLIK = 1200

type Rota = { yontem: string; desen: RegExp; isle: (istek: Istek, es: string[]) => Promise<Yanit> }
type YetkiliIsle = (istek: Istek, es: string[], yetkili: Yetkili) => Promise<Yanit>

function rotalar(b: Baglam, yonetim: YonetimKimligi | null): Rota[] {
  /** `serbest`: şifresi değişmesi gereken hesap da geçer (yalnız `/yonetim/ben` ve `/yonetim/sifre`). */
  const korunan = (isle: YetkiliIsle, { serbest = false, yalnizAdmin = false } = {}) =>
    async (istek: Istek, es: string[]) => {
      const yetkili = await yetkiliCoz(b, yonetim, istek)
      if (yetkili.sifreDegismeli && !serbest) throw new IstekHatasi(403, 'sifreDegismeli')
      if (yalnizAdmin && !yetkili.admin) throw new IstekHatasi(403, 'adminGerekli')
      return isle(istek, es, yetkili)
    }
  const y = (isle: YetkiliIsle) => korunan(isle)
  const a = (isle: YetkiliIsle) => korunan(isle, { yalnizAdmin: true })
  const s = (isle: YetkiliIsle) => korunan(isle, { serbest: true })
  const admin = yonetim as YonetimKimligi
  return [
    { yontem: 'GET', desen: /^\/yonetim\/ben$/, isle: s(async (_, __, k) => yonetimBen(k)) },
    { yontem: 'POST', desen: /^\/yonetim\/sifre$/, isle: s((i, _, k) => yonetimSifre(b, yonetim, i, k)) },
    { yontem: 'GET', desen: /^\/yonetim\/personel$/, isle: a(() => yonetimPersonelListe(b)) },
    { yontem: 'POST', desen: /^\/yonetim\/personel$/, isle: a((i, _, k) => yonetimPersonelEkle(b, admin, i, k)) },
    {
      yontem: 'POST',
      desen: /^\/yonetim\/personel\/(\d{1,9})\/kapat$/,
      isle: a((i, [id], k) => yonetimPersonelKapat(b, i, id ?? '', k)),
    },
    {
      yontem: 'POST',
      desen: /^\/yonetim\/personel\/(\d{1,9})\/sifre$/,
      isle: a((i, [id], k) => yonetimPersonelSifre(b, i, id ?? '', k)),
    },
    { yontem: 'GET', desen: /^\/yonetim\/islemler$/, isle: a((i) => yonetimIslemler(b, i)) },
    { yontem: 'POST', desen: /^\/tur$/, isle: (i) => turAl(b, i) },
    { yontem: 'POST', desen: /^\/oyuncu$/, isle: (i) => oyuncuOl(b, i) },
    { yontem: 'POST', desen: /^\/tur\/([0-9a-f]{32})\/bitir$/, isle: (i, [id]) => turBitir(b, i, id ?? '') },
    { yontem: 'GET', desen: /^\/tablo$/, isle: () => tabloAl(b) },
    { yontem: 'GET', desen: /^\/ben$/, isle: (i) => benAl(b, i) },
    { yontem: 'DELETE', desen: /^\/oyuncu$/, isle: (i) => hesabiSil(b, i) },
    { yontem: 'POST', desen: /^\/tarama\/(\d{1,3})$/, isle: (_, [masa]) => taramaKaydet(b, masa ?? '') },
    { yontem: 'POST', desen: /^\/yonetim\/oturum$/, isle: async (i) => yonetimOturum(b, yonetim, i) },
    { yontem: 'GET', desen: /^\/yonetim\/siralama$/, isle: y((i) => yonetimSiralama(b, i)) },
    { yontem: 'GET', desen: /^\/yonetim\/tur\/(\d+)$/, isle: y((_, [id]) => yonetimTur(b, id ?? '')) },
    { yontem: 'POST', desen: /^\/yonetim\/kod$/, isle: y((i, _, k) => yonetimKod(b, i, k)) },
    { yontem: 'POST', desen: /^\/yonetim\/oyuncu\/(\d+)\/gizle$/, isle: y((i, [id], k) => yonetimGizle(b, i, id ?? '', k)) },
    { yontem: 'GET', desen: /^\/yonetim\/sayac$/, isle: y((i) => yonetimSayac(b, i)) },
    { yontem: 'GET', desen: /^\/yonetim\/tarama$/, isle: y(() => yonetimTarama(b)) },
    { yontem: 'GET', desen: /^\/menu$/, isle: () => menuAl(b) },
    { yontem: 'GET', desen: /^\/yonetim\/menu$/, isle: y(() => yonetimMenuAl(b)) },
    { yontem: 'GET', desen: /^\/yonetim\/menu\/(\d{1,9})$/, isle: y((_, [id]) => yonetimMenuSurumAl(b, id ?? '')) },
    { yontem: 'PUT', desen: /^\/yonetim\/menu$/, isle: y((i, _, k) => yonetimMenuYayinla(b, i, k)) },
    { yontem: 'POST', desen: /^\/yonetim\/foto$/, isle: y((i, _, k) => yonetimFotoYukle(b, i, k)) },
    { yontem: 'GET', desen: /^\/yonetim\/derleme$/, isle: y(() => yonetimDerlemeDurumu(b)) },
    { yontem: 'POST', desen: /^\/yonetim\/derleme$/, isle: y((_, __, k) => yonetimDerlemeIste(b, k)) },
    {
      yontem: 'POST',
      desen: /^\/yonetim\/menu\/(\d{1,9})\/geri-al$/,
      isle: y((i, [id], k) => yonetimMenuGeriAl(b, i, id ?? '', k)),
    },
  ]
}

function hatayaYanit(hata: unknown, istek: Istek, gunluk: Gunluk): Yanit {
  if (hata instanceof IstekHatasi) {
    if (istek.yol.endsWith('/bitir')) gunluk.warn('tur reddedildi', { kod: hata.kod, yol: istek.yol })
    const basliklar: Record<string, string> = {}
    if (hata.durum === 401 && istek.yol.startsWith('/yonetim')) basliklar['WWW-Authenticate'] = 'Basic realm="yonetim"'
    return { durum: hata.durum, govde: { hata: hata.kod }, basliklar }
  }
  gunluk.error('istek hatası', { yontem: istek.yontem, yol: istek.yol }, hata)
  return { durum: 500, govde: { hata: 'sunucu' } }
}

export function uygulamaKur(
  depo: Depo,
  ayar: Ayar,
  simdi: () => number = Date.now,
  gunluk: Gunluk = console,
): Uygulama {
  const ipSiniri = hizSiniriKur(IP_SAATLIK, SAAT_MS)
  const yonetimSiniri = hizSiniriKur(YONETIM_SAATLIK, SAAT_MS)
  const menuSiniri = hizSiniriKur(ayar.menuSaatlik ?? MENU_SAATLIK, SAAT_MS)
  const derlemeSiniri = hizSiniriKur(DERLEME_SAATLIK, SAAT_MS)
  const b: Baglam = {
    depo,
    tuz: ayar.tuz,
    simdi,
    oyuncuSiniri: hizSiniriKur(OYUNCU_SAATLIK, SAAT_MS),
    tablo: onbellekKur(TABLO_ONBELLEK_MS),
    menu: onbellekKur(MENU_ONBELLEK_MS),
    fotoDizini: ayar.fotoDizini ?? null,
    derlemeDizini: ayar.derlemeDizini ?? null,
  }
  const liste = rotalar(b, ayar.yonetim)

  /** Geniş kova yalnız geçerli kimliğe açık: yanlış parola her `/yonetim` ucundaki gibi 60/saate sayılır. */
  async function yetkiliMi(istek: Istek): Promise<boolean> {
    try {
      await yetkiliCoz(b, ayar.yonetim, istek)
      return true
    } catch (hata) {
      if (hata instanceof IstekHatasi) return false
      throw hata
    }
  }

  async function yonlendir(istek: Istek): Promise<Yanit> {
    // Menü ve derleme durumu okumaları kendi geniş kovalarını kullanır (restoran wifi'si tek IP).
    const menuOkuma = istek.yontem === 'GET' && istek.yol === '/menu'
    const derlemeGet = istek.yontem === 'GET' && istek.yol === '/yonetim/derleme'
    // Yanlış parolayı reddedebilecek her kovaya kimlikten önce bakılır: yanıt kimlik sızdırmaz.
    if (derlemeGet && (ipSiniri.dolu(istek.ip, simdi()) || yonetimSiniri.dolu(istek.ip, simdi()))) {
      return { durum: 429, govde: { hata: 'cokIstek' } }
    }
    const derlemeOkuma = derlemeGet && (await yetkiliMi(istek))
    const kova = menuOkuma ? menuSiniri : derlemeOkuma ? derlemeSiniri : ipSiniri
    if (!kova.izinVar(istek.ip, simdi())) return { durum: 429, govde: { hata: 'cokIstek' } }
    if (istek.yol.startsWith('/yonetim') && !derlemeOkuma && !yonetimSiniri.izinVar(istek.ip, simdi())) {
      return { durum: 429, govde: { hata: 'cokIstek' } }
    }
    const adaylar = liste.filter((r) => r.desen.test(istek.yol))
    if (adaylar.length === 0) return { durum: 404, govde: { hata: 'yolYok' } }
    const rota = adaylar.find((r) => r.yontem === istek.yontem)
    if (!rota) return { durum: 405, govde: { hata: 'yontemYok' } }
    const es = rota.desen.exec(istek.yol) ?? []
    return rota.isle(istek, [...es].slice(1))
  }

  return {
    async isle(req, res) {
      const url = new URL(req.url ?? '/', 'http://sunucu')
      const istek: Istek = {
        yontem: req.method ?? 'GET',
        yol: url.pathname.replace(/\/+$/, '') || '/',
        sorgu: url.searchParams,
        basliklar: req.headers,
        ip: gercekIp(req.socket.remoteAddress, req.headers as Record<string, string | undefined>, ayar.guvenilirVekil),
        govde: (sinir) => govdeOku(req, sinir),
        hamGovde: (sinir) => hamGovdeOku(req, sinir),
      }
      const cors = corsBasliklari(req.headers.origin, ayar.kokenler)
      if (istek.yontem === 'OPTIONS') return yanitYaz(res, { durum: 204 }, cors)
      let yanit: Yanit
      try {
        yanit = await yonlendir(istek)
      } catch (hata) {
        yanit = hatayaYanit(hata, istek, gunluk)
      }
      if (yanit.durum === 413) res.once('finish', () => req.destroy())
      yanitYaz(res, yanit, cors)
    },
    isler: islerKur(depo, ayar.tuz, ayar.kampanyaBitis),
    temizle(an) {
      ipSiniri.temizle(an)
      menuSiniri.temizle(an)
      derlemeSiniri.temizle(an)
      yonetimSiniri.temizle(an)
      b.oyuncuSiniri.temizle(an)
    },
  }
}
