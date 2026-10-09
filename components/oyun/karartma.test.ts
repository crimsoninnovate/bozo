import { test } from 'node:test'
import assert from 'node:assert/strict'
import { karartmaYolu } from './karartma.ts'

const KUTU = { sol: 10, ust: 20, en: 30, boy: 40 }

test('karartmaYolu_tekDelik_evenoddIcIceIkiDikdortgen', () => {
  assert.equal(karartmaYolu(200, 100, [KUTU]), 'path(evenodd, "M0 0H200V100H0Z M10 20H40V60H10Z")')
})

test('karartmaYolu_ikiDelik_ikisiDeAcik', () => {
  const yol = karartmaYolu(200, 100, [KUTU, { sol: 100, ust: 10, en: 20, boy: 20 }])
  assert.equal(yol, 'path(evenodd, "M0 0H200V100H0Z M10 20H40V60H10Z M100 10H120V30H100Z")')
})
