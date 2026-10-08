import { test } from 'node:test'
import assert from 'node:assert/strict'
import { donemAnahtari, donemBaslangici, donemBitisi, girneGunu } from './donem.ts'

/* 5 Ekim 2026 Pazartesi; Girne yazın UTC+3, 25 Ekim 2026'da UTC+2'ye döner, 28 Mart 2027'de geri. */

test('donemBaslangici_pazartesi0459_oncekiHafta_0500_yeniHafta', () => {
  assert.equal(donemBaslangici(new Date('2026-10-05T04:59:00+03:00')).toISOString(), '2026-09-28T02:00:00.000Z')
  assert.equal(donemBaslangici(new Date('2026-10-05T05:00:00+03:00')).toISOString(), '2026-10-05T02:00:00.000Z')
  assert.equal(donemBaslangici(new Date('2026-10-08T23:30:17+03:00')).toISOString(), '2026-10-05T02:00:00.000Z')
})

test('donemBaslangici_pazarGecesi_aynıHaftadaKalir', () => {
  assert.equal(donemBaslangici(new Date('2026-10-12T03:00:00+03:00')).toISOString(), '2026-10-05T02:00:00.000Z')
})

test('donemBitisi_sonrakiPazartesi0500', () => {
  assert.equal(donemBitisi(new Date('2026-10-08T12:00:00+03:00')).toISOString(), '2026-10-12T02:00:00.000Z')
})

test('donem_yazSaatiBitenHafta_yediGunArtiBirSaat', () => {
  const bas = donemBaslangici(new Date('2026-10-20T12:00:00+03:00'))
  const bit = donemBitisi(new Date('2026-10-20T12:00:00+03:00'))
  assert.equal(bas.toISOString(), '2026-10-19T02:00:00.000Z')
  assert.equal(bit.toISOString(), '2026-10-26T03:00:00.000Z')
  assert.equal(donemBaslangici(new Date('2026-10-27T00:00:00Z')).toISOString(), '2026-10-26T03:00:00.000Z')
})

test('donem_yazSaatiBaslayanHafta_yediGunEksiBirSaat', () => {
  assert.equal(donemBaslangici(new Date('2027-03-25T12:00:00+02:00')).toISOString(), '2027-03-22T03:00:00.000Z')
  assert.equal(donemBitisi(new Date('2027-03-25T12:00:00+02:00')).toISOString(), '2027-03-29T02:00:00.000Z')
})

test('donemAnahtari_pazartesininGirneTarihi', () => {
  assert.equal(donemAnahtari(new Date('2026-10-08T23:30:00+03:00')), '2026-10-05')
  assert.equal(donemAnahtari(new Date('2026-10-05T04:59:00+03:00')), '2026-09-28')
})

test('girneGunu_geceYarisindanSonra_girneTarihi', () => {
  assert.equal(girneGunu(new Date('2026-10-08T22:30:00Z')), '2026-10-09')
})
