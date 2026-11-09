import assert from 'node:assert/strict'
import { test } from 'node:test'
import { odakNoktasi, hedefBoyut } from './fotoHazirla.ts'

test('hedefBoyut_yatayUzunKenarSiniriAsar_oranKorunarakKuculur', () => {
  assert.deepEqual(hedefBoyut(4000, 3000), { en: 2000, boy: 1500 })
})

test('hedefBoyut_sinirAltinda_buyutulmez', () => {
  assert.deepEqual(hedefBoyut(1200, 1600), { en: 1200, boy: 1600 })
})

test('hedefBoyut_kare_ikiKenarSinira', () => {
  assert.deepEqual(hedefBoyut(3000, 3000), { en: 2000, boy: 2000 })
})

test('hedefBoyut_dikeyVeKesirli_yuvarlanirSiniriAsmaz', () => {
  assert.deepEqual(hedefBoyut(3024, 4032), { en: 1500, boy: 2000 })
  assert.deepEqual(hedefBoyut(1001, 3001, 1000), { en: 334, boy: 1000 })
})

test('odakNoktasi_dokunusYuzdeye_yuvarlanirVeSinirlanir', () => {
  assert.equal(odakNoktasi(50, 70, 200, 100), '25% 70%')
  assert.equal(odakNoktasi(33.3, 66.6, 100, 100), '33% 67%')
  assert.equal(odakNoktasi(-5, 120, 100, 100), '0% 100%')
})

test('odakNoktasi_dogrulayicininBicimiyleUyumlu', () => {
  for (const [x, y] of [[0, 0], [100, 100], [7, 93]] as const) {
    assert.match(odakNoktasi(x, y, 100, 100), /^(100|[1-9]?\d)% (100|[1-9]?\d)%$/)
  }
})
