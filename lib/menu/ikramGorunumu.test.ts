import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { ikramGorunumu } from './ikramGorunumu.ts'
import type { MenuBelgesi } from './tipler.ts'

const seed = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

test('ikramlar_belgedenGelir_sozluktenDegil', () => {
  const b = structuredClone(seed)
  const urun = b.ikramlar.urunler[0]
  const kume = b.ikramlar.gruplar[0]
  assert.ok(urun && kume)
  urun.ad = { tr: 'Mercimek', en: 'Lentil' }
  kume.ogeler.push({ id: 'roka', ad: { tr: 'Roka', en: 'Rocket' } })
  b.ikramlar.altMetin = { tr: 'Yeni alt metin', en: 'New sub text' }

  const tr = ikramGorunumu(b, 'tr')
  assert.equal(tr.altMetin, 'Yeni alt metin')
  assert.equal(tr.urunler[0]?.ad, 'Mercimek')
  assert.ok(tr.gruplar[0]?.ogeler.some((o) => o.ad === 'Roka'))
  assert.equal(ikramGorunumu(b, 'en').urunler[0]?.ad, 'Lentil')
})

test('ikramGorunumu_seed_ikiUrunUcKume', () => {
  const g = ikramGorunumu(seed, 'tr')
  assert.deepEqual(g.urunler.map((u) => u.id), ['lebeni', 'bostana'])
  assert.deepEqual(g.gruplar.map((k) => k.id), ['yesillik', 'sogan', 'kozde'])
  assert.deepEqual(g.gruplar[0]?.not, 'temizlenmiş ve ayıklanmış')
  assert.equal(g.gruplar[1]?.not, null)
})

test('ikramGorunumu_fotoIdBos_nullKalir', () => {
  const b = structuredClone(seed)
  const urun = b.ikramlar.urunler[0]
  assert.ok(urun)
  urun.fotoId = null
  assert.equal(ikramGorunumu(b, 'tr').urunler[0]?.fotoId, null)
})
