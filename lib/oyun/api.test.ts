import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ApiHatasi, apiKur, jetonCoz, kanalCoz, tekrarDenenebilirMi, temelYetki, yonetimApiKur } from './api.ts'

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
