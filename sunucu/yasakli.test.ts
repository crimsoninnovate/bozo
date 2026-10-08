import { test } from 'node:test'
import assert from 'node:assert/strict'
import { yasakliMi } from './yasakli.ts'

test('yasakli_ayrilmisAdlar_katlanmisHaliyle', () => {
  for (const ad of ['Bozo', 'B0ZO', 'Ciğerci Bozo', 'cigerci-bozo', 'USTA', 'Admin', '...']) {
    assert.equal(yasakliMi(ad), true, ad)
  }
})

test('yasakli_kufurKokleri_parcaOlarakVeKatlanarak', () => {
  for (const ad of ['0r0spu', 'Pezevenk1', 'yaraaak', 'si.ktir', 'B1tch']) assert.equal(yasakliMi(ad), true, ad)
})

test('yasakli_kisaSozcukler_yalnizTamSozcuk', () => {
  assert.equal(yasakliMi('Am Usta'), true)
  assert.equal(yasakliMi('Kamil'), false)
  assert.equal(yasakliMi('Göt Dede'), true)
  assert.equal(yasakliMi('Gece Kuşu'), false)
})

test('yasakli_sıradanAdlar_serbest', () => {
  for (const ad of ['Ayşe', 'Bozo Fan', 'Usta Ali', 'Ciğerci', 'Gece.Kuşu', 'Tane 12']) {
    assert.equal(yasakliMi(ad), false, ad)
  }
})
