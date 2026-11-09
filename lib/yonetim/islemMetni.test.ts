import { test } from 'node:test'
import assert from 'node:assert/strict'
import { islemMetni } from './islemMetni.ts'
import { ISLEM_TURLERI } from './personel.ts'

test('islemMetni_herTurIcinMetin', () => {
  for (const tur of ISLEM_TURLERI) {
    const metin = islemMetni({ ad: 'ajans', tur, ayrinti: 'sürüm 12', zaman: '2026-11-10T12:00:00Z' })
    assert.ok(metin.length > 0, tur)
    assert.ok(!metin.includes('{'), `${tur}: ${metin}`)
  }
  const yayin = islemMetni({ ad: 'a', tur: 'menuYayin', ayrinti: 'sürüm 12', zaman: '' })
  assert.equal(yayin, 'Menüyü yayınladı (sürüm 12)')
})
