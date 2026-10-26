import type { IncomingMessage, ServerResponse } from 'node:http'
import type { BlockList } from 'node:net'
import type { Depo } from './depo.ts'
import { hizSiniriKur } from './hiz.ts'
import { corsBasliklari, govdeOku, IstekHatasi, yanitYaz, type Istek, type Yanit } from './http.ts'
import { gercekIp } from './ip.ts'
import { islerKur, type Isler } from './isler.ts'
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
  yonetimDenetle,
  yonetimGizle,
  yonetimKod,
  yonetimSayac,
  yonetimSiralama,
  yonetimTarama,
  yonetimTur,
  type YonetimKimligi,
} from './yonetim.ts'

export type Ayar = {
  kokenler: readonly string[]
  tuz: string
  yonetim: YonetimKimligi | null
  guvenilirVekil: BlockList
  kampanyaBitis: number | null
  /** Yalnız test: `GET /menu` IP başına saatlik sınırı (varsayılan `MENU_SAATLIK`). */
  menuSaatlik?: number
}

export type Gunluk = Pick<Console, 'warn' | 'error'>

export type Uygulama = {
  isle(req: IncomingMessage, res: ServerResponse): Promise<void>
  isler: Isler
  /** Hız sınırı belleğini kırpar; zamanlayıcıdan çağrılır. */
  temizle(simdi: number): void
}

const SAAT_MS = 60 * 60_000
/** Spec §9: oyuncu 40 tur/saat, IP 600 istek/saat; yönetim ucuna IP başına 60/saat (kod tahmini). */
const OYUNCU_SAATLIK = 40
const IP_SAATLIK = 600
const YONETIM_SAATLIK = 60
/** `GET /menu` için ayrı, geniş kova: restoranın wifi'si tek IP, genel 600'lük kovayı yemez. */
const MENU_SAATLIK = 6000

type Rota = { yontem: string; desen: RegExp; isle: (istek: Istek, es: string[]) => Promise<Yanit> }

function rotalar(b: Baglam, yonetim: YonetimKimligi | null): Rota[] {
  const y = (isle: (istek: Istek, es: string[]) => Promise<Yanit>) => async (istek: Istek, es: string[]) => {
    yonetimDenetle(yonetim, istek)
    return isle(istek, es)
  }
  return [
    { yontem: 'POST', desen: /^\/tur$/, isle: (i) => turAl(b, i) },
    { yontem: 'POST', desen: /^\/oyuncu$/, isle: (i) => oyuncuOl(b, i) },
    { yontem: 'POST', desen: /^\/tur\/([0-9a-f]{32})\/bitir$/, isle: (i, [id]) => turBitir(b, i, id ?? '') },
    { yontem: 'GET', desen: /^\/tablo$/, isle: () => tabloAl(b) },
    { yontem: 'GET', desen: /^\/ben$/, isle: (i) => benAl(b, i) },
    { yontem: 'DELETE', desen: /^\/oyuncu$/, isle: (i) => hesabiSil(b, i) },
    { yontem: 'POST', desen: /^\/tarama\/(\d{1,3})$/, isle: (_, [masa]) => taramaKaydet(b, masa ?? '') },
    { yontem: 'GET', desen: /^\/yonetim\/siralama$/, isle: y((i) => yonetimSiralama(b, i)) },
    { yontem: 'GET', desen: /^\/yonetim\/tur\/(\d+)$/, isle: y((_, [id]) => yonetimTur(b, id ?? '')) },
    { yontem: 'POST', desen: /^\/yonetim\/kod$/, isle: y((i) => yonetimKod(b, i)) },
    { yontem: 'POST', desen: /^\/yonetim\/oyuncu\/(\d+)\/gizle$/, isle: y((i, [id]) => yonetimGizle(b, i, id ?? '')) },
    { yontem: 'GET', desen: /^\/yonetim\/sayac$/, isle: y((i) => yonetimSayac(b, i)) },
    { yontem: 'GET', desen: /^\/yonetim\/tarama$/, isle: y(() => yonetimTarama(b)) },
    { yontem: 'GET', desen: /^\/menu$/, isle: () => menuAl(b) },
    { yontem: 'GET', desen: /^\/yonetim\/menu$/, isle: y(() => yonetimMenuAl(b)) },
    { yontem: 'GET', desen: /^\/yonetim\/menu\/(\d{1,9})$/, isle: y((_, [id]) => yonetimMenuSurumAl(b, id ?? '')) },
    { yontem: 'PUT', desen: /^\/yonetim\/menu$/, isle: y((i) => yonetimMenuYayinla(b, i)) },
    {
      yontem: 'POST',
      desen: /^\/yonetim\/menu\/(\d{1,9})\/geri-al$/,
      isle: y((i, [id]) => yonetimMenuGeriAl(b, i, id ?? '')),
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
  const b: Baglam = {
    depo,
    tuz: ayar.tuz,
    simdi,
    oyuncuSiniri: hizSiniriKur(OYUNCU_SAATLIK, SAAT_MS),
    tablo: onbellekKur(TABLO_ONBELLEK_MS),
    menu: onbellekKur(MENU_ONBELLEK_MS),
  }
  const liste = rotalar(b, ayar.yonetim)

  async function yonlendir(istek: Istek): Promise<Yanit> {
    // Menü okumaları genel 600/saat kovasına girmez (restoran wifi'si tek IP); kendi geniş kovaları var.
    const menuOkuma = istek.yontem === 'GET' && istek.yol === '/menu'
    const kova = menuOkuma ? menuSiniri : ipSiniri
    if (!kova.izinVar(istek.ip, simdi())) return { durum: 429, govde: { hata: 'cokIstek' } }
    if (istek.yol.startsWith('/yonetim') && !yonetimSiniri.izinVar(istek.ip, simdi())) {
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
        govde: () => govdeOku(req),
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
      yonetimSiniri.temizle(an)
      b.oyuncuSiniri.temizle(an)
    },
  }
}
