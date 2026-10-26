import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { llmsTxt as llmsTxtBelgeli } from './llmsTxt.ts'
import type { MenuBelgesi } from './menu/tipler.ts'

const belge = JSON.parse(
  readFileSync(new URL('../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

const llmsTxt = () => llmsTxtBelgeli(belge)

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

// Tükendi bayrağı aynı güne ait; deploy'la donan dosya onu taşımaz, kalem adıyla listede kalır.
test('llmsTxt_tukendiKalem_notTasimaz', () => {
  const b = structuredClone(belge)
  const ciger = b.kalemler[0]
  const su = b.icecekler.find((i) => i.id === 'su')
  assert.ok(ciger && su)
  ciger.tukendi = true
  su.tukendi = true
  const metin = llmsTxtBelgeli(b)
  assert.equal(metin.includes('bugün yok'), false)
  const satirlar = metin.split('\n')
  assert.ok(satirlar.includes('- Ciğer'))
  assert.ok(satirlar.includes('- Su'))
  assert.ok(satirlar.includes('- Dalak'))
  assert.ok(satirlar.includes('- Cola'))
})

test('llmsTxt_menuAciklamasi_sayilarBelgedenGelir', () => {
  const metin = llmsTxt()
  assert.equal(metin.includes('{'), false)
  assert.ok(metin.includes('Yedi porsiyon, dürümler, bir özel, sekiz ikram ve içecekler.'))
  assert.ok(metin.includes('Seven portions from the fire, wraps, eight on the house, and drinks.'))
})
