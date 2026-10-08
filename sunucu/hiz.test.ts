import { test } from 'node:test'
import assert from 'node:assert/strict'
import { hizSiniriKur } from './hiz.ts'

test('hizSiniri_limitKadarIzin_sonrasiRet_pencereGecinceYenidenIzin', () => {
  const sinir = hizSiniriKur(3, 1000)
  assert.equal(sinir.izinVar('a', 0), true)
  assert.equal(sinir.izinVar('a', 10), true)
  assert.equal(sinir.izinVar('a', 20), true)
  assert.equal(sinir.izinVar('a', 30), false)
  assert.equal(sinir.izinVar('b', 30), true)
  assert.equal(sinir.izinVar('a', 1001), true)
})

test('hizSiniri_temizle_bosAnahtarlariAtar_dolulariTutar', () => {
  const sinir = hizSiniriKur(1, 100)
  sinir.izinVar('a', 0)
  sinir.izinVar('b', 90)
  sinir.temizle(150)
  assert.equal(sinir.izinVar('a', 151), true)
  assert.equal(sinir.izinVar('b', 151), false)
})
