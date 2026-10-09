import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ustaOyna } from './deneme.ts'
import { simule } from './motor.ts'
import { oncekiDonem, turuDogrula } from './yonetim.ts'

test('oncekiDonem_yediGunGeri_ayVeYilSinirindan', () => {
  assert.equal(oncekiDonem('2026-10-12'), '2026-10-05')
  assert.equal(oncekiDonem('2026-03-02'), '2026-02-23')
  assert.equal(oncekiDonem('2027-01-04'), '2026-12-28')
})

test('turuDogrula_ayniPuan_tutuyor_farkliPuan_tutmuyor_kayitYok', () => {
  const girdiler = ustaOyna(7, 'duzenli')
  const { puan } = simule(7, girdiler)
  assert.deepEqual(turuDogrula({ tohum: 7, puan, girdiler }), { durum: 'tutuyor', puan })
  assert.deepEqual(turuDogrula({ tohum: 7, puan: puan + 1, girdiler }), { durum: 'tutmuyor', puan })
  assert.deepEqual(turuDogrula({ tohum: 7, puan, girdiler: null }), { durum: 'kayitYok', puan: null })
})
