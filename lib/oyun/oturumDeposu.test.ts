import { test } from 'node:test'
import assert from 'node:assert/strict'
import { oturumOku, oturumYaz } from './oturumDeposu.ts'

const SIMDI = Date.parse('2026-10-26T12:00:00Z')
const GELECEK = new Date(SIMDI + 60_000).toISOString()
const GECMIS = new Date(SIMDI - 1).toISOString()
const anahtar = `Bearer ${SIMDI}.${'a'.repeat(64)}`

test('oturumOku_gecerliKayit_yetkiDoner', () => {
  assert.equal(oturumOku(oturumYaz(anahtar, GELECEK), SIMDI, false), anahtar)
})

test('oturumOku_bitisGecmis_null', () => {
  assert.equal(oturumOku(oturumYaz(anahtar, GECMIS), SIMDI, false), null)
  assert.equal(oturumOku(oturumYaz(anahtar, new Date(SIMDI).toISOString()), SIMDI, false), null)
})

test('oturumOku_bozukKayit_null', () => {
  const bozuklar = [
    null,
    '',
    '{',
    'null',
    '[]',
    '{}',
    JSON.stringify({ yetki: anahtar }),
    JSON.stringify({ bitis: GELECEK }),
    JSON.stringify({ yetki: 5, bitis: GELECEK }),
    JSON.stringify({ yetki: anahtar, bitis: 'dun' }),
    JSON.stringify({ yetki: 'Basic eDp5', bitis: GELECEK }),
  ]
  for (const ham of bozuklar) assert.equal(oturumOku(ham, SIMDI, true), null, String(ham))
})

test('oturumOku_bosBasicDizesi_yalnizEskiBicimdeKabulEdilir', () => {
  assert.equal(oturumOku('Basic eDp5', SIMDI, true), 'Basic eDp5')
  assert.equal(oturumOku('Basic eDp5', SIMDI, false), null)
  assert.equal(oturumOku('Bearer abc', SIMDI, true), null)
})
