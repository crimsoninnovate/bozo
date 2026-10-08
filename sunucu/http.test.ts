import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bearer, corsBasliklari, temelKimlik } from './http.ts'

test('corsBasliklari_yalnizIzinliKoken', () => {
  const koken = 'https://cigercibozo.com'
  const izinli = [koken]
  assert.equal(corsBasliklari(koken, izinli)['Access-Control-Allow-Origin'], koken)
  assert.deepEqual(corsBasliklari('https://kotu.example', izinli), {})
  assert.deepEqual(corsBasliklari(undefined, izinli), {})
})

test('bearer_hex32_kucukHarfeCevrilir_digerleriNull', () => {
  assert.equal(bearer(`Bearer ${'AB'.repeat(16)}`), 'ab'.repeat(16))
  assert.equal(bearer('Bearer kisa'), null)
  assert.equal(bearer(undefined), null)
  assert.equal(bearer('Basic abc'), null)
})

test('temelKimlik_base64Cozer_ikiNoktaliSifre_bozukNull', () => {
  const yetki = `Basic ${Buffer.from('personel:gizli:sifre').toString('base64')}`
  assert.deepEqual(temelKimlik(yetki), { kullanici: 'personel', sifre: 'gizli:sifre' })
  assert.equal(temelKimlik(`Basic ${Buffer.from('sifresiz').toString('base64')}`), null)
  assert.equal(temelKimlik('Bearer x'), null)
})
