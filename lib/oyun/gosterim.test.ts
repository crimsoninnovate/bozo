import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bekle, dokun, sahne } from './deneme.ts'
import { yeniOyun } from './durum.ts'
import { goruntuAl, ipucuHedefi, oyunSaati, sisGorunumu } from './gosterim.ts'

test('oyunSaati_gecenin21indenSabahin05ine', () => {
  assert.deepEqual([0, 450, 900, 3600, 7199, 7200, 9000].map(oyunSaati), [
    '21:00',
    '21:30',
    '22:00',
    '01:00',
    '04:59',
    '05:00',
    '05:00',
  ])
})

test('sisGorunumu_centikPencereVeKivamBandi', () => {
  const sis = { urun: 'ciger' as const, gecen: 0, pisme: 240, pencere: 120, bant: 30, cevirme: 'yok' as const }
  assert.equal(sisGorunumu({ ...sis, gecen: 50 }), 'pisiyor')
  assert.equal(sisGorunumu({ ...sis, gecen: 120 }), 'centik')
  assert.equal(sisGorunumu({ ...sis, gecen: 120, cevirme: 'kotu' }), 'pisiyor')
  assert.equal(sisGorunumu({ ...sis, gecen: 300 }), 'hazir')
  assert.equal(sisGorunumu({ ...sis, gecen: 300, cevirme: 'iyi' }), 'kivam')
  assert.equal(sisGorunumu({ ...sis, gecen: 340, cevirme: 'iyi' }), 'hazir')
})

test('goruntuAl_evreAciklariVeOcakRayi', () => {
  const oyun = sahne([['ciger', 'ayran']])
  bekle(oyun, 1)
  dokun(oyun, 'ciger', 'ayran')
  const g = goruntuAl(oyun)
  assert.equal(g.acikSofra, 2)
  assert.equal(g.acikOcak, 3)
  assert.deepEqual(g.raf, ['ciger'])
  assert.deepEqual(g.sofralar[0], {
    fis: ['ciger', 'ayran'],
    kalan: ['ciger', 'ayran'],
    kurulu: false,
    odedi: false,
    karisik: false,
  })
  assert.deepEqual(g.ocak[0], {
    urun: 'ciger',
    centik: 1 / 3,
    pencere: 2 / 3,
    kivam: 5 / 6,
    bant: 1 / 12,
    cevirme: 'yok',
  })
  assert.equal(g.ayran, 'doluyor')
})

test('ipucu_ilkMisafir_kurPisirCevirAlServisSirasiyla', () => {
  const oyun = yeniOyun(1)
  bekle(oyun, 61)
  assert.equal(ipucuHedefi(oyun), 's0')
  dokun(oyun, 's0')
  assert.equal(ipucuHedefi(oyun), 'ciger')
  dokun(oyun, 'ciger')
  assert.equal(ipucuHedefi(oyun), null)
  bekle(oyun, 104)
  assert.equal(ipucuHedefi(oyun), 'o0')
  dokun(oyun, 'o0')
  assert.equal(ipucuHedefi(oyun), null)
  bekle(oyun, 178)
  assert.equal(ipucuHedefi(oyun), null)
  bekle(oyun, 1)
  assert.equal(ipucuHedefi(oyun), 'o0')
  dokun(oyun, 'o0')
  assert.equal(ipucuHedefi(oyun), 's0')
  dokun(oyun, 's0')
  assert.equal(ipucuHedefi(oyun), null)
})

test('ipucu_ikinciMisafirdenSonra_yok', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  oyun.sofralar[0]!.misafir = { ...oyun.sofralar[0]!.misafir, no: 2 }
  assert.equal(ipucuHedefi(oyun), null)
})
