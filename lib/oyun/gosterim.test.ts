import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EVRELER } from './ayar.ts'
import { bekle, dokun, sahne } from './deneme.ts'
import { goruntuAl, oyunSaati, sisGorunumu } from './gosterim.ts'

const E0 = EVRELER[0]!

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

test('sisGorunumu_pisiyorHazirKivam', () => {
  const sis = { urun: 'ciger' as const, gecen: 0, pisme: 240, pencere: 180, bant: 36 }
  assert.equal(sisGorunumu({ ...sis, gecen: 50 }), 'pisiyor')
  assert.equal(sisGorunumu({ ...sis, gecen: 240 }), 'hazir')
  assert.equal(sisGorunumu({ ...sis, gecen: 330 }), 'kivam')
  assert.equal(sisGorunumu({ ...sis, gecen: 400 }), 'hazir')
})

test('goruntuAl_evreAciklari_rayKesirleri_istenenlerVeEl', () => {
  const oyun = sahne([['ciger', 'ciger', 'domates']])
  bekle(oyun, 1)
  dokun(oyun, 'ciger')
  dokun(oyun, 'domates')
  const g = goruntuAl(oyun)
  assert.equal(g.acikMisafir, 2)
  assert.equal(g.acikOcak, 3)
  assert.deepEqual(g.raf, ['ciger'])
  assert.deepEqual(g.kaseler, ['domates'])
  assert.deepEqual(g.rafIstenen, ['ciger'])
  assert.deepEqual(g.kaseIstenen, [])
  assert.deepEqual(g.misafirler[0], { fis: ['ciger', 'ciger', 'domates'], karisik: false, odedi: false, varyant: 0 })
  assert.deepEqual(g.paralar, [null, null, null])
  const ray = E0.cigerPisme + E0.almaPenceresi
  assert.deepEqual(g.ocak[0], {
    urun: 'ciger',
    pencere: E0.cigerPisme / ray,
    kivam: (E0.cigerPisme + E0.almaPenceresi / 2) / ray,
    bant: E0.tamKivamBandi / ray,
  })
  assert.deepEqual(g.tabaklar, [[], []])
  assert.deepEqual(g.el, { tur: 'eslikci', urun: 'domates' })
  dokun(oyun, 't1')
  assert.deepEqual(goruntuAl(oyun).tabaklar[1], [{ urun: 'domates', kalite: null }])
})
