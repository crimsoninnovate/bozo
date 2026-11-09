import { test } from 'node:test'
import assert from 'node:assert/strict'
import { adSorunu, sifreSorunu } from './personel.ts'

test('adSorunu_gecerliVeGecersizAdlar', () => {
  for (const ad of ['ajans', 'ajans.ali', 'a1', 'web-ajans']) assert.equal(adSorunu(ad, 'bozo'), null, ad)
  for (const ad of ['A', 'Ajans', 'a', '-ajans', '.ajans', 'a'.repeat(31), 'aj ans', 'ajanş']) {
    assert.equal(adSorunu(ad, 'bozo'), 'adGecersiz', ad)
  }
  assert.equal(adSorunu('bozo', 'Bozo'), 'adAdminin')
})

test('sifreSorunu_sinirlar', () => {
  assert.equal(sifreSorunu('a'.repeat(9)), 'sifreKisa')
  assert.equal(sifreSorunu('a'.repeat(10)), null)
  assert.equal(sifreSorunu('a'.repeat(200)), null)
  assert.equal(sifreSorunu('a'.repeat(201)), 'sifreUzun')
})
