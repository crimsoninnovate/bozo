import { test } from 'node:test'
import assert from 'node:assert/strict'
import { komsuIndeks, okAdimi, tusEylemi } from './klavye.ts'

test('tusEylemi_enterVeBoslukDokunur_escBirakir_digerleriNull', () => {
  assert.deepEqual(['Enter', ' ', 'Escape', 'a', 'Tab', '1'].map(tusEylemi), ['dokun', 'dokun', 'birak', null, null, null])
})

test('okAdimi_solYukariGeri_sagAsagiIleri', () => {
  const tuslar = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Tab', 'Home']
  assert.deepEqual(tuslar.map(okAdimi), [-1, -1, 1, 1, null, null])
})

test('komsuIndeks_uclardaSarar_disaridanGirisIlkYaDaSon', () => {
  assert.equal(komsuIndeks(0, 1, 4), 1)
  assert.equal(komsuIndeks(3, 1, 4), 0)
  assert.equal(komsuIndeks(0, -1, 4), 3)
  assert.equal(komsuIndeks(-1, 1, 4), 0)
  assert.equal(komsuIndeks(-1, -1, 4), 3)
  assert.equal(komsuIndeks(0, 1, 0), -1)
})
