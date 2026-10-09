import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ustaOyna } from './deneme.ts'
import { simule } from './motor.ts'
import { tavan } from './tavan.ts'

test('tavan_hicbirAltinKayitTavaniAsmaz', () => {
  for (const [t, b] of [[1, 'usta'], [1, 'duzenli'], [2026, 'rastgele']] as const) {
    assert.ok(simule(t, ustaOyna(t, b)).puan <= tavan(t), `${t} ${b}`)
  }
})

test('tavan_kirkTohumdaUcBotunUstunde', () => {
  for (let t = 1; t <= 40; t++) {
    const sinir = tavan(t)
    for (const beceri of ['usta', 'duzenli', 'rastgele'] as const) {
      assert.ok(simule(t, ustaOyna(t, beceri)).puan <= sinir, `tohum ${t}, ${beceri}`)
    }
  }
})

test('tavan_ayniTohum_ayniDeger_veTamsayi', () => {
  assert.equal(tavan(1), tavan(1))
  assert.ok(Number.isInteger(tavan(1)))
})

/* Altın değer: bütçe ya da puan tablosu değişince bilerek kırılır. */
test('altin_tavan_tohum1', () => {
  assert.equal(tavan(1), 80780)
})

/** Bütçe ve Karışık her tohumda aynı kalem kümesini verir; sıralanmış tabanlar da aynıdır: tavan tohumdan bağımsız. */
test('tavan_tohumdanBagimsiz', () => {
  for (let t = 2; t <= 40; t++) assert.equal(tavan(t), tavan(1), `tohum ${t}`)
})
