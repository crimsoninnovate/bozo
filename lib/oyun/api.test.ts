import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ApiHatasi, apiKur, jetonCoz, kanalCoz } from './api.ts'

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

test('api_anahtar_bearerBasligiylaGider', async () => {
  const kayit: { url?: string; secenek?: RequestInit } = {}
  const api = apiKur('http://x', sahteGetir(200, { takmaAd: 'A', hafta: null, odul: null }, kayit))
  await api.benAl('deadbeef')
  assert.equal((kayit.secenek?.headers as Record<string, string>).Authorization, 'Bearer deadbeef')
})
