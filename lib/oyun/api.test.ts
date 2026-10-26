import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  ApiHatasi,
  apiKur,
  jetonCoz,
  kanalCoz,
  taramaBildir,
  tekrarDenenebilirMi,
  temelYetki,
  yonetimApiKur,
} from './api.ts'

test('kanalCoz_sofraVeIg_taninir_digerleriYok', () => {
  assert.equal(kanalCoz('?k=sofra'), 'sofra')
  assert.equal(kanalCoz('?k=ig'), 'ig')
  assert.equal(kanalCoz('?k=site'), 'site')
  assert.equal(kanalCoz('?k=tiktok'), 'yok')
  assert.equal(kanalCoz(''), 'yok')
})

test('jetonCoz_gecerliYanit_doner_bozukTohumYaDaKimlik_null', () => {
  const id = 'a'.repeat(32)
  assert.deepEqual(jetonCoz({ turId: id, tohum: 7, sonaErme: 'x' }), { turId: id, tohum: 7, sonaErme: 'x' })
  assert.equal(jetonCoz({ turId: id, tohum: -1, sonaErme: 'x' }), null)
  assert.equal(jetonCoz({ turId: id, tohum: 2 ** 32, sonaErme: 'x' }), null)
  assert.equal(jetonCoz({ turId: 'kisa', tohum: 7, sonaErme: 'x' }), null)
  assert.equal(jetonCoz(null), null)
})

function sahteGetir(durum: number, govde: unknown, kayit: { url?: string; secenek?: RequestInit } = {}) {
  const getir: typeof fetch = async (girdi, secenek) => {
    kayit.url = String(girdi)
    kayit.secenek = secenek
    return new Response(JSON.stringify(govde), { status: durum })
  }
  return getir
}

test('api_turAl_kokVeYolBirlesir_jetonDoner', async () => {
  const kayit: { url?: string; secenek?: RequestInit } = {}
  const api = apiKur('http://x', sahteGetir(200, { turId: 'b'.repeat(32), tohum: 5, sonaErme: 's' }, kayit))
  const jeton = await api.turAl('sofra')
  assert.equal(jeton.tohum, 5)
  assert.equal(kayit.url, 'http://x/tur')
  assert.equal(kayit.secenek?.method, 'POST')
  assert.equal(kayit.secenek?.body, '{"kanal":"sofra"}')
})

test('api_hataYaniti_ApiHatasiDurumVeKodla', async () => {
  const api = apiKur('http://x', sahteGetir(422, { hata: 'takmaAdKullanilamaz' }))
  await assert.rejects(
    api.oyuncuOl('a', 'b', 'c'),
    (h: unknown) => h instanceof ApiHatasi && h.durum === 422 && h.kod === 'takmaAdKullanilamaz',
  )
})

test('api_agHatasi_durumSifirKodAg', async () => {
  const api = apiKur('http://x', async () => {
    throw new TypeError('fetch failed')
  })
  await assert.rejects(api.tabloAl(), (h: unknown) => h instanceof ApiHatasi && h.durum === 0 && h.kod === 'ag')
})

/** Süresi dolmuş, yakılmış ya da reddedilmiş tur yeniden gönderilse de aynı yanıtı alır. */
test('tekrarDenenebilirMi_agSinirVeSunucuHatasi_evet_kaliciRetler_hayir', () => {
  for (const durum of [0, 429, 500, 503]) assert.equal(tekrarDenenebilirMi(new ApiHatasi(durum, 'x')), true, String(durum))
  for (const durum of [400, 404, 409, 410, 413, 422]) assert.equal(tekrarDenenebilirMi(new ApiHatasi(durum, 'x')), false, String(durum))
})

test('api_anahtar_bearerBasligiylaGider', async () => {
  const kayit: { url?: string; secenek?: RequestInit } = {}
  const api = apiKur('http://x', sahteGetir(200, { takmaAd: 'A', hafta: null, odul: null }, kayit))
  await api.benAl('deadbeef')
  assert.equal((kayit.secenek?.headers as Record<string, string>).Authorization, 'Bearer deadbeef')
})

test('temelYetki_turkceHarfler_utf8Base64', () => {
  assert.equal(temelYetki('personel', 'gizli'), `Basic ${Buffer.from('personel:gizli').toString('base64')}`)
  assert.equal(temelYetki('usta', 'şiş:ğ'), `Basic ${Buffer.from('usta:şiş:ğ', 'utf8').toString('base64')}`)
})

test('yonetimApi_yollarYontemlerVeTemelKimlik', async () => {
  const kayit: { url?: string; secenek?: RequestInit } = {}
  const yonetim = yonetimApiKur('http://x', sahteGetir(200, {}, kayit), 'Basic abc')
  const cagrilar: [() => Promise<unknown>, string, string, string | undefined][] = [
    [() => yonetim.siralama(), 'http://x/yonetim/siralama', 'GET', undefined],
    [() => yonetim.siralama('2026-10-05'), 'http://x/yonetim/siralama?donem=2026-10-05', 'GET', undefined],
    [() => yonetim.tur(42), 'http://x/yonetim/tur/42', 'GET', undefined],
    [() => yonetim.kod('123456'), 'http://x/yonetim/kod', 'POST', '{"kod":"123456"}'],
    [() => yonetim.gizle(7, true), 'http://x/yonetim/oyuncu/7/gizle', 'POST', '{"gizli":true}'],
    [() => yonetim.tarama(), 'http://x/yonetim/tarama', 'GET', undefined],
  ]
  for (const [cagri, url, yontem, govde] of cagrilar) {
    await cagri()
    assert.equal(kayit.url, url)
    assert.equal(kayit.secenek?.method, yontem)
    assert.equal(kayit.secenek?.body, govde)
    assert.equal((kayit.secenek?.headers as Record<string, string>).Authorization, 'Basic abc')
  }
})

test('yonetimApi_bosGovde204_hataVermez', async () => {
  const yonetim = yonetimApiKur('http://x', async () => new Response(null, { status: 204 }), 'Basic abc')
  assert.equal(await yonetim.gizle(1, false), null)
})

test('taramaBildir_govdesizPost_keepalive_hataYutulmazGunluge', async () => {
  let kayit: { url: string; secenek?: RequestInit } | null = null
  await taramaBildir('http://x', async (url, secenek) => {
    kayit = { url: String(url), secenek }
    return new Response(null, { status: 204 })
  }, 7)
  assert.deepEqual(kayit, { url: 'http://x/tarama/7', secenek: { method: 'POST', keepalive: true } })
  const uyarilar: unknown[][] = []
  const uyari = console.warn
  console.warn = (...a: unknown[]) => void uyarilar.push(a)
  try {
    await taramaBildir('http://x', async () => { throw new TypeError('ag') }, 7)
  } finally {
    console.warn = uyari
  }
  assert.equal(uyarilar.length, 1)
  assert.equal(uyarilar[0]?.[1], 7)
})

const BELGE_ORNEGI = { surum: 1 } as unknown as Parameters<ReturnType<typeof yonetimApiKur>['menuYayinla']>[1]

test('yonetimApi_menuYayinla_putVeTabanGonderir', async () => {
  const kayit: { url?: string; secenek?: RequestInit } = {}
  const yonetim = yonetimApiKur('http://x', sahteGetir(200, { surum: 4 }, kayit), 'Basic abc')
  assert.deepEqual(await yonetim.menuYayinla(3, BELGE_ORNEGI), { surum: 4 })
  assert.equal(kayit.url, 'http://x/yonetim/menu')
  assert.equal(kayit.secenek?.method, 'PUT')
  assert.equal(kayit.secenek?.body, JSON.stringify({ taban: 3, belge: BELGE_ORNEGI }))
  assert.equal((kayit.secenek?.headers as Record<string, string>).Authorization, 'Basic abc')
  await yonetim.menuYayinla(null, BELGE_ORNEGI)
  assert.equal(kayit.secenek?.body, JSON.stringify({ taban: null, belge: BELGE_ORNEGI }))
})

test('yonetimApi_menuGeriAl_postGonderir', async () => {
  const kayit: { url?: string; secenek?: RequestInit } = {}
  const yonetim = yonetimApiKur('http://x', sahteGetir(200, { surum: 9 }, kayit), 'Basic abc')
  assert.deepEqual(await yonetim.menuGeriAl(5, 8), { surum: 9 })
  assert.equal(kayit.url, 'http://x/yonetim/menu/5/geri-al')
  assert.equal(kayit.secenek?.method, 'POST')
  assert.equal(kayit.secenek?.body, '{"taban":8}')
})

test('yonetimApi_menuOkuma_getVeYaniti', async () => {
  const kayit: { url?: string; secenek?: RequestInit } = {}
  const yanit = { gecerli: null, surumler: [] }
  const yonetim = yonetimApiKur('http://x', sahteGetir(200, yanit, kayit), 'Basic abc')
  assert.deepEqual(await yonetim.menu(), yanit)
  assert.equal(kayit.url, 'http://x/yonetim/menu')
  assert.equal(kayit.secenek?.method, 'GET')
})

test('yonetimApi_menuSurumu_getVeYaniti', async () => {
  const kayit: { url?: string; secenek?: RequestInit } = {}
  const yanit = { surum: 5, belge: BELGE_ORNEGI }
  const yonetim = yonetimApiKur('http://x', sahteGetir(200, yanit, kayit), 'Basic abc')
  assert.deepEqual(await yonetim.menuSurumu(5), yanit)
  assert.equal(kayit.url, 'http://x/yonetim/menu/5')
  assert.equal(kayit.secenek?.method, 'GET')
})

test('yonetimApi_menuHatalari_durumVeKodlaYuzeyeCikar', async () => {
  const durumlar: [number, string][] = [
    [400, 'belgeGecersiz'], [400, 'tabanGecersiz'], [401, 'yetkisiz'], [404, 'surumYok'],
    [409, 'surumEskidi'], [413, 'govdeBuyuk'], [429, 'cokIstek'],
  ]
  for (const [durum, kod] of durumlar) {
    const yonetim = yonetimApiKur('http://x', sahteGetir(durum, { hata: kod }), 'Basic abc')
    const bekle = (h: unknown) => h instanceof ApiHatasi && h.durum === durum && h.kod === kod
    await assert.rejects(yonetim.menuYayinla(1, BELGE_ORNEGI), bekle, `PUT ${durum} ${kod}`)
    await assert.rejects(yonetim.menuGeriAl(1, 1), bekle, `POST ${durum} ${kod}`)
  }
})
