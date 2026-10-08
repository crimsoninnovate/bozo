import { test } from 'node:test'
import assert from 'node:assert/strict'
import { takmaAdBicimiGecerliMi, takmaAdDuzelt, takmaAdKatla } from './takmaAd.ts'

test('takmaAdDuzelt_uclardakiVeArdisikBosluk_teke', () => {
  assert.equal(takmaAdDuzelt('  Bozo   Usta '), 'Bozo Usta')
})

test('takmaAdBicimi_turkceHarfRakamBoslukNoktaAltCizgiTire_gecerli', () => {
  for (const ad of ['Ayşe', 'Şişçi_01', 'Gece.Kuşu', 'Tane-12', 'Ali Veli', 'İpek']) {
    assert.equal(takmaAdBicimiGecerliMi(ad), true, ad)
  }
})

test('takmaAdBicimi_kisaUzunEmojiVeBaskaIsaret_gecersiz', () => {
  for (const ad of ['Al', 'OnUcKarakterli', 'Bozo🔥', 'a@b', 'ad!', ' Ali', 'Ali  Veli', '']) {
    assert.equal(takmaAdBicimiGecerliMi(ad), false, JSON.stringify(ad))
  }
})

test('takmaAdBicimi_onIkiKarakterTurkceHarfle_gecerli', () => {
  assert.equal(takmaAdBicimiGecerliMi('Şşşşşşşşşşşş'), true)
})

test('takmaAdKatla_turkceHarfRakamBenzeriAyracVeTekrar_katlanir', () => {
  assert.equal(takmaAdKatla('B0z0  Usta'), 'bozousta')
  assert.equal(takmaAdKatla('Bozoo-Ustaa'), 'bozousta')
  assert.equal(takmaAdKatla('Şişçi_01'), 'siscioi')
  assert.equal(takmaAdKatla('İIıi'), 'i')
  assert.equal(takmaAdKatla('G3ce-Kuşu'), 'gecekusu')
  assert.equal(takmaAdKatla('...'), '')
})
