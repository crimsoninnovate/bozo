// lib/saatMetni.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { saatEki, saatleriDoldur, saatYaz } from './saatMetni.ts'

// Saatin söylenen son kelimesine göre [bulunma, ayrılma, yönelme] ekleri.
const SON_KELIME: Record<string, [string, string, string]> = {
  sifir: ['da', 'dan', 'a'],
  bir: ['de', 'den', 'e'],
  iki: ['de', 'den', 'ye'],
  uc: ['te', 'ten', 'e'],
  dort: ['te', 'ten', 'e'],
  bes: ['te', 'ten', 'e'],
  alti: ['da', 'dan', 'ya'],
  yedi: ['de', 'den', 'ye'],
  sekiz: ['de', 'den', 'e'],
  dokuz: ['da', 'dan', 'a'],
  on: ['da', 'dan', 'a'],
  yirmi: ['de', 'den', 'ye'],
}

const KELIMELER = [
  'sifir', 'bir', 'iki', 'uc', 'dort', 'bes', 'alti', 'yedi', 'sekiz', 'dokuz',
  'on', 'bir', 'iki', 'uc', 'dort', 'bes', 'alti', 'yedi', 'sekiz', 'dokuz',
  'yirmi', 'bir', 'iki', 'uc',
]

test('saatYaz_tekHaneli_basinaSifirEkler', () => {
  assert.equal(saatYaz(5), '05:00')
  assert.equal(saatYaz(10), '10:00')
  assert.equal(saatYaz(0), '00:00')
})

test('saatEki_tumSaatler_tabloyaUyar', () => {
  assert.equal(KELIMELER.length, 24)
  for (let saat = 0; saat < 24; saat++) {
    const ekler = SON_KELIME[KELIMELER[saat]!]!
    ;(['de', 'den', 'e'] as const).forEach((ek, i) => {
      assert.equal(saatEki(saat, ek), `${saatYaz(saat)}'${ekler[i]}`, `${saat} ${ek}`)
    })
  }
})

test('saatEki_ornekler_beklenenMetniVerir', () => {
  assert.equal(saatEki(10, 'de'), "10:00'da")
  assert.equal(saatEki(5, 'e'), "05:00'e")
})

test('saatleriDoldur_yerTutucular', () => {
  const s = { acilis: 10, kapanis: 5 }
  assert.equal(saatleriDoldur('{acilis}', s), '10:00')
  assert.equal(saatleriDoldur('{kapanis}', s), '05:00')
  assert.equal(saatleriDoldur('{acilis-de}', s), "10:00'da")
  assert.equal(saatleriDoldur('{acilis-den}', s), "10:00'dan")
  assert.equal(saatleriDoldur('{acilis-e}', s), "10:00'a")
  assert.equal(saatleriDoldur('{kapanis-de}', s), "05:00'te")
  assert.equal(saatleriDoldur('{kapanis-den}', s), "05:00'ten")
  assert.equal(saatleriDoldur('{kapanis-e}', s), "05:00'e")
  assert.equal(
    saatleriDoldur('Her gün {acilis-den} ertesi sabah {kapanis-e} kadar', s),
    "Her gün 10:00'dan ertesi sabah 05:00'e kadar",
  )
})

test('saatleriDoldur_bilinmeyenYerTutucu_oldugugibiKalir', () => {
  assert.equal(saatleriDoldur('{x} {acilis-xx} {acilis}', { acilis: 12, kapanis: 3 }), '{x} {acilis-xx} 12:00')
})
