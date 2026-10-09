import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gonderimKarari } from './giris.ts'

const HESAP = { anahtar: 'a'.repeat(32), takmaAd: 'Bozo Usta' }

test('gonderimKarari_turIdYoksa_cevrimdisi', () => {
  assert.equal(gonderimKarari(null, HESAP, 'Bozo Usta'), 'cevrimdisi')
  assert.equal(gonderimKarari(null, null, null), 'cevrimdisi')
})

test('gonderimKarari_kayitliHesapAyniAdVeyaBos_dogrudanGonderir', () => {
  assert.equal(gonderimKarari('t', HESAP, 'Bozo Usta'), 'gonder')
  assert.equal(gonderimKarari('t', HESAP, null), 'gonder')
})

test('gonderimKarari_hesapYokAdVar_kaydedipGonderir', () => {
  assert.equal(gonderimKarari('t', null, 'Yeni Ad'), 'kaydet')
})

test('gonderimKarari_hesapVarFarkliAd_yeniHesapKaydeder', () => {
  assert.equal(gonderimKarari('t', HESAP, 'Baska Ad'), 'kaydet')
})

test('gonderimKarari_hesapYokAdYok_sonucEkranindaSorar', () => {
  assert.equal(gonderimKarari('t', null, null), 'sor')
})
