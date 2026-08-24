import { test } from 'node:test'
import assert from 'node:assert/strict'
import { llmsTxt } from './llmsTxt.ts'

test('llmsTxt_baslikIsletmeAdiTasir', () => {
  const metin = llmsTxt()
  assert.ok(metin.startsWith('# Ciğerci Bozo'))
})

test('llmsTxt_onIkiRotaninHepsiniIcerir', () => {
  const metin = llmsTxt()
  const trYollar = ['https://cigercibozo.com/', 'https://cigercibozo.com/menu/',
    'https://cigercibozo.com/galeri/', 'https://cigercibozo.com/hikaye/',
    'https://cigercibozo.com/konum/', 'https://cigercibozo.com/gizlilik/']
  const enYollar = trYollar.map((y) => y.replace('cigercibozo.com/', 'cigercibozo.com/en/'))
  for (const y of [...trYollar, ...enYollar]) {
    assert.ok(metin.includes(y), `${y} eksik`)
  }
})

test('llmsTxt_ikiDilBasligiTasir', () => {
  const metin = llmsTxt()
  assert.ok(metin.includes('## Türkçe'))
  assert.ok(metin.includes('## English'))
})

test('llmsTxt_uydurmaFiyatVeyaDereceTasimaz', () => {
  const metin = llmsTxt()
  assert.equal(/\$\$|★|rating/i.test(metin), false)
})

test('llmsTxt_ozetSatiri_saatVeAdresiTasir', () => {
  const metin = llmsTxt()
  assert.ok(metin.includes('Naci Talat Caddesi No:4'))
  assert.ok(metin.includes("10:00'dan ertesi sabah 05:00'e kadar"))
})
