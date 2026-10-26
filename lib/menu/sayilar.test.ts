import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { tr } from '../../content/tr/index.ts'
import { en } from '../../content/en/index.ts'
import { acilisSpotu, ikramSayisi, sayiYaz } from './sayilar.ts'
import type { MenuBelgesi } from './tipler.ts'

const seed = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

test('sayiYaz_7_tr_yedi', () => assert.equal(sayiYaz(7, 'tr'), 'yedi'))
test('sayiYaz_8_en_eight', () => assert.equal(sayiYaz(8, 'en'), 'eight'))
test('sayiYaz_0_tr_sifir', () => assert.equal(sayiYaz(0, 'tr'), 'sıfır'))
test('sayiYaz_20_en_twenty', () => assert.equal(sayiYaz(20, 'en'), 'twenty'))
test('sayiYaz_11_tr_onBir', () => assert.equal(sayiYaz(11, 'tr'), 'on bir'))
test('sayiYaz_21_rakam', () => {
  assert.equal(sayiYaz(21, 'tr'), '21')
  assert.equal(sayiYaz(21, 'en'), '21')
})

test('ikramSayisi_seed_sekiz', () => assert.equal(ikramSayisi(seed), 8))

test('ikramSayisi_ogeEklenince_artar', () => {
  const b = structuredClone(seed)
  const kume = b.ikramlar.gruplar[0]
  assert.ok(kume)
  kume.ogeler.push({ id: 'roka', ad: { tr: 'Roka', en: 'Rocket' } })
  assert.equal(ikramSayisi(b), 9)
})

test('acilisSpotu_yediKalemSekizIkram_tr', () => {
  assert.equal(
    acilisSpotu(tr.menu.acilis.spot, seed, 'tr'),
    'Hepsi tek ocakta pişer. Yedi porsiyon, bir özel, sekiz ikram.',
  )
})

test('acilisSpotu_sekizKalem_en', () => {
  const b = structuredClone(seed)
  const ilk = b.kalemler[0]
  assert.ok(ilk)
  b.kalemler.push({ ...ilk, id: 'sekizinci' })
  assert.equal(
    acilisSpotu(en.menu.acilis.spot, b, 'en'),
    'Everything comes off the fire. Eight portions, one special, eight on the house.',
  )
})

test('acilisSpotu_metaSablonu_basindaVeCumleBasindaBuyukHarf', () => {
  assert.equal(
    acilisSpotu('{kalem} ve {ikram}. {ikram} sonra', seed, 'en'),
    'Seven ve eight. Eight sonra',
  )
  const bos = { ...seed, ikramlar: { ...seed.ikramlar, urunler: [], gruplar: [] } }
  assert.equal(acilisSpotu('{ikram} ikram', bos, 'tr'), 'Sıfır ikram')
})

test('acilisSpotu_sablonsuzMetin_oldugunGibiDoner', () => {
  assert.equal(acilisSpotu('Menü', seed, 'tr'), 'Menü')
})
