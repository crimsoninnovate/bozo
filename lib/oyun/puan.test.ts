import { test } from 'node:test'
import assert from 'node:assert/strict'
import { komboCarpani, sabirBonusu } from './puan.ts'

test('komboCarpani_esiklereGore_birdenDordeKadar', () => {
  assert.deepEqual(
    [0, 2, 3, 5, 6, 8, 9, 30].map(komboCarpani),
    [1, 1, 2, 2, 3, 3, 4, 4],
  )
})

test('sabirBonusu_kalanPayiTamsayi_sinirlarKirpilir', () => {
  assert.equal(sabirBonusu(900, 1800), 100)
  assert.equal(sabirBonusu(1799, 1800), 199)
  assert.equal(sabirBonusu(-5, 1800), 0)
  assert.equal(sabirBonusu(2000, 1800), 200)
})
