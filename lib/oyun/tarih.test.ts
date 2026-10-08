import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sifirlanmaMetni, tarihMetni } from './tarih.ts'

test('sifirlanmaMetni_girneSaatiyle_gunAyHaftaGunuSaat', () => {
  assert.equal(sifirlanmaMetni('2026-10-12T02:00:00.000Z', 'tr'), '12 Ekim Pazartesi 05:00')
  assert.equal(sifirlanmaMetni('2026-10-12T02:00:00.000Z', 'en'), 'Monday 12 October at 05:00')
})

test('tarihMetni_girneTarihi', () => {
  assert.equal(tarihMetni('2026-10-25T22:30:00.000Z', 'tr'), '26 Ekim 2026')
  assert.equal(tarihMetni('2026-10-25T22:30:00.000Z', 'en'), '26 October 2026')
})
