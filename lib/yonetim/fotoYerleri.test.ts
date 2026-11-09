import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fotograflar } from '../../content/fotograflar.ts'
import { fotoOranlari, fotoYerleri } from './fotoYerleri.ts'

const kimlikler = Object.keys(fotograflar).sort()

test('fotoYerleri_herFotoIdIcinDoluEtiket', () => {
  assert.deepEqual(Object.keys(fotoYerleri).sort(), kimlikler)
  for (const [id, yer] of Object.entries(fotoYerleri)) assert.ok(yer.trim().length > 0, id)
})

test('fotoOranlari_herFotoIdIcinGecerliAspectRatio', () => {
  assert.deepEqual(Object.keys(fotoOranlari).sort(), kimlikler)
  for (const [id, oran] of Object.entries(fotoOranlari)) assert.match(oran, /^\d+ \/ \d+$/, id)
})
