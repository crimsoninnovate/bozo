// components/saat/VardiyaSeridi.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  enYakinVardiya,
  MOBIL_VARDIYA_SAATLERI,
  VARDIYA_SAATLERI,
} from './VardiyaSeridi.saatler.ts'

/** Şeridin göründüğü gece penceresi ve iki komşu akşam saati. */
const GECE_SAATLERI = [21, 22, 23, 0, 1, 2, 3, 4]

test('vardiya_masaustuAltiCip_herSaatKendiCipiniYakar', () => {
  const beklenen: Record<number, number> = { 21: 21, 22: 21, 23: 23, 0: 23, 1: 1, 2: 2, 3: 3, 4: 4 }
  for (const saat of GECE_SAATLERI) {
    assert.equal(enYakinVardiya(saat, VARDIYA_SAATLERI), beklenen[saat], `saat ${saat}`)
  }
})

test('vardiya_mobilDortCip_02de01i_04te03uYakar', () => {
  assert.equal(enYakinVardiya(2, MOBIL_VARDIYA_SAATLERI), 1)
  assert.equal(enYakinVardiya(4, MOBIL_VARDIYA_SAATLERI), 3)
})

test('vardiya_mobilDortCip_gecePenceresindeBosSaatYok', () => {
  for (const saat of GECE_SAATLERI) {
    const yakin = enYakinVardiya(saat, MOBIL_VARDIYA_SAATLERI)
    assert.notEqual(yakin, null, `saat ${saat} icin yanan cip yok`)
    assert.ok(MOBIL_VARDIYA_SAATLERI.includes(yakin as number), `saat ${saat} listede olmayan cipi secti`)
  }
})

test('vardiya_gunduzSaatleri_hicbirCipYanmaz', () => {
  for (const saat of [6, 10, 14, 19, 20]) {
    assert.equal(enYakinVardiya(saat, VARDIYA_SAATLERI), null, `masaustu ${saat}`)
    assert.equal(enYakinVardiya(saat, MOBIL_VARDIYA_SAATLERI), null, `mobil ${saat}`)
  }
})

test('vardiya_mobilListe_masaustuListesininAltKumesi', () => {
  for (const saat of MOBIL_VARDIYA_SAATLERI) {
    assert.ok(VARDIYA_SAATLERI.includes(saat), `${saat} masaustu listesinde yok`)
    // Etiket, saatin masaüstü listesindeki konumundan okunuyor; alt küme olmazsa etiket kayar.
    assert.ok(VARDIYA_SAATLERI.indexOf(saat) >= 0)
  }
})
