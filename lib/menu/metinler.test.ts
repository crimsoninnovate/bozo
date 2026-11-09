import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tr } from '../../content/tr/index.ts'
import { en } from '../../content/en/index.ts'
import { metinleriUygula, varsayilanMetinler, yerTutuculari } from './metinler.ts'

test('varsayilanMetinler_besSayfa_ikiDildeAyniYollar', () => {
  const t = varsayilanMetinler('tr')
  const e = varsayilanMetinler('en')
  assert.equal(t.size, 121)
  assert.deepEqual([...t.keys()].sort(), [...e.keys()].sort())
  assert.equal(t.get('ana.hero.baslikSatir1'), tr.ana.hero.baslikSatir1)
  assert.equal(e.get('ana.hero.kilometreTaslari.1.metin'), en.ana.hero.kilometreTaslari[1]?.metin)
  assert.equal([...t.keys()].some((y) => /^(ortak|gizlilik|hata|oyun)\./.test(y)), false)
})

test('yerTutuculari_siraliVeTekil', () => {
  assert.deepEqual(yerTutuculari('Ocak {kapanis-de} söner, {acilis} ile {acilis}'), ['{acilis}', '{kapanis-de}'])
  assert.deepEqual(yerTutuculari('düz metin'), [])
})

test('metinleriUygula_yalnizVerilenYolDegisir_girdiDegismez', () => {
  const once = tr.ana.hero.govde
  const sonuc = metinleriUygula(tr, { 'ana.hero.govde': 'Yeni gövde', 'ana.hero.kilometreTaslari.1.metin': 'gece' })
  assert.equal(sonuc.ana.hero.govde, 'Yeni gövde')
  assert.equal(sonuc.ana.hero.kilometreTaslari[1]?.metin, 'gece')
  assert.equal(sonuc.ana.hero.kilometreTaslari[0]?.metin, tr.ana.hero.kilometreTaslari[0]?.metin)
  assert.ok(Array.isArray(sonuc.ana.hero.kilometreTaslari))
  assert.equal(tr.ana.hero.govde, once)
  assert.deepEqual(sonuc.oyun, tr.oyun)
})

test('metinleriUygula_bilinmeyenYaDaDuzenlenemezYol_atlanir', () => {
  const sonuc = metinleriUygula(tr, { 'ana.yok.alan': 'x', 'gizlilik.baslik': 'x', 'ana.hero': 'x' })
  assert.deepEqual(sonuc, tr)
})
