import { test } from 'node:test'
import assert from 'node:assert/strict'
import { kisayolHedefi, komsuIndeks, okAdimi } from './klavye.ts'

test('kisayolHedefi_birDortSofra_besSekizOcak_digerleriNull', () => {
  assert.deepEqual(
    ['1', '2', '3', '4', '5', '6', '7', '8'].map(kisayolHedefi),
    ['s0', 's1', 's2', 's3', 'o0', 'o1', 'o2', 'o3'],
  )
  assert.deepEqual(['0', '9', 'a', 'Enter', ' ', 'Numpad1'].map(kisayolHedefi), [null, null, null, null, null, null])
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
