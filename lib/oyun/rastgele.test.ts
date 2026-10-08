import { test } from 'node:test'
import assert from 'node:assert/strict'
import { karistir, rastgele } from './rastgele.ts'

test('rastgele_tohum1_mulberry32ReferansDizisiniVerir', () => {
  const r = rastgele(1)
  assert.deepEqual([r.sayi(), r.sayi(), r.sayi()], [2693262067, 11749833, 2265367787])
})

test('rastgele_ayniTohum_ayniDiziyiVerir', () => {
  const a = rastgele(2026)
  const b = rastgele(2026)
  for (let i = 0; i < 100; i++) assert.equal(a.sayi(), b.sayi())
})

test('rastgele_tam_ikiUcDahilAraliktaKalir', () => {
  const r = rastgele(7)
  const gorulen = new Set<number>()
  for (let i = 0; i < 1000; i++) {
    const n = r.tam(-3, 3)
    assert.ok(Number.isInteger(n) && n >= -3 && n <= 3, `aralık dışı: ${n}`)
    gorulen.add(n)
  }
  assert.equal(gorulen.size, 7)
})

test('karistir_ogeleriKorur_tohumaGoreSiralar', () => {
  assert.deepEqual(karistir([1, 2, 3, 4, 5, 6], rastgele(42)), [2, 4, 3, 5, 6, 1])
})
