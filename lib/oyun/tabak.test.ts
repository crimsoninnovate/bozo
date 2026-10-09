import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TABAK_SINIRI } from './ayar.ts'
import { evreyeGec, sahne } from './deneme.ts'
import { birak, copeBirak, kasedenTut, tabagaDokun } from './tabak.ts'
import type { Elde, Olay, Oyun } from './tipler.ts'

const SIS: NonNullable<Elde> = { tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 2 }

function olaylarla(islem: (olaylar: Olay[]) => void): Olay[] {
  const olaylar: Olay[] = []
  islem(olaylar)
  return olaylar
}

test('kase_elBosken_eslikciEle_tukenmez_evresiGelmemisKaseEtkisiz', () => {
  const oyun = sahne([])
  assert.deepEqual(olaylarla((o) => kasedenTut(oyun, 'sogan', o)), [])
  assert.deepEqual(olaylarla((o) => kasedenTut(oyun, 'domates', o)), [{ tur: 'tutuldu', el: { tur: 'eslikci', urun: 'domates' } }])
  assert.deepEqual(olaylarla((o) => kasedenTut(oyun, 'domates', o)), [])
  oyun.el = null
  evreyeGec(oyun, 1)
  assert.deepEqual(olaylarla((o) => kasedenTut(oyun, 'sogan', o)), [{ tur: 'tutuldu', el: { tur: 'eslikci', urun: 'sogan' } }])
})

test('tabak_eldekiSisTabagaIner_kaliteyleBirlikte_elBosalir', () => {
  const oyun = sahne([])
  oyun.el = SIS
  assert.deepEqual(olaylarla((o) => tabagaDokun(oyun, 1, o)), [{ tur: 'tabagaKondu', no: 1, kalem: { urun: 'ciger', kalite: 'tam' }, el: SIS }])
  assert.deepEqual(oyun.tabaklar, [[], [{ urun: 'ciger', kalite: 'tam' }]])
  assert.equal(oyun.el, null)
})

test('tabak_eldekiEslikci_kalitesizIner', () => {
  const oyun = sahne([])
  oyun.el = { tur: 'eslikci', urun: 'domates' }
  tabagaDokun(oyun, 0, [])
  assert.deepEqual(oyun.tabaklar[0], [{ urun: 'domates', kalite: null }])
})

test('tabak_dorduncudenSonrakiBirakis_eldeKalir', () => {
  const oyun = sahne([])
  for (let i = 0; i < TABAK_SINIRI; i++) {
    oyun.el = { tur: 'eslikci', urun: 'domates' }
    tabagaDokun(oyun, 0, [])
  }
  oyun.el = SIS
  assert.deepEqual(olaylarla((o) => tabagaDokun(oyun, 0, o)), [{ tur: 'tabakDolu', no: 0 }])
  assert.deepEqual(oyun.el, SIS)
  assert.equal(oyun.tabaklar[0]?.length, TABAK_SINIRI)
})

test('tabak_elBoskenDoluTabak_ele_bosTabakEtkisiz_eldeTabakkenEtkisiz', () => {
  const oyun = sahne([])
  assert.deepEqual(olaylarla((o) => tabagaDokun(oyun, 0, o)), [])
  oyun.tabaklar[0] = [{ urun: 'ciger', kalite: 'iyi' }]
  assert.deepEqual(olaylarla((o) => tabagaDokun(oyun, 0, o)), [{ tur: 'tutuldu', el: { tur: 'tabak', no: 0 } }])
  assert.deepEqual(olaylarla((o) => tabagaDokun(oyun, 1, o)), [])
  assert.deepEqual(oyun.el, { tur: 'tabak', no: 0 })
  assert.deepEqual(oyun.tabaklar[0], [{ urun: 'ciger', kalite: 'iyi' }])
})

test('cop_eldekiYokOlur_tabaksaBosalir_puanVeKomboDegismez_elBoskenEtkisiz', () => {
  const oyun = sahne([])
  oyun.puan = 300
  oyun.kombo = 4
  assert.deepEqual(olaylarla((o) => copeBirak(oyun, o)), [])
  oyun.el = SIS
  assert.deepEqual(olaylarla((o) => copeBirak(oyun, o)), [{ tur: 'copeGitti', el: SIS }])
  assert.equal(oyun.el, null)
  oyun.tabaklar[1] = [{ urun: 'ciger', kalite: 'iyi' }, { urun: 'domates', kalite: null }]
  oyun.el = { tur: 'tabak', no: 1 }
  copeBirak(oyun, [])
  assert.deepEqual(oyun.tabaklar[1], [])
  assert.equal(oyun.el, null)
  assert.equal(oyun.puan, 300)
  assert.equal(oyun.kombo, 4)
})

test('birak_tabakYerineDoner_eslikciKaseyeDoner_sisteEtkisiz', () => {
  const oyun = sahne([])
  oyun.tabaklar[0] = [{ urun: 'ciger', kalite: 'iyi' }]
  oyun.el = { tur: 'tabak', no: 0 }
  assert.deepEqual(olaylarla((o) => birak(oyun, o)), [{ tur: 'birakildi', el: { tur: 'tabak', no: 0 } }])
  assert.deepEqual(oyun.tabaklar[0], [{ urun: 'ciger', kalite: 'iyi' }])
  oyun.el = { tur: 'eslikci', urun: 'domates' }
  assert.deepEqual(olaylarla((o) => birak(oyun, o)), [{ tur: 'birakildi', el: { tur: 'eslikci', urun: 'domates' } }])
  assert.equal(oyun.el, null)
  oyun.el = SIS
  assert.deepEqual(olaylarla((o) => birak(oyun, o)), [])
  assert.deepEqual(oyun.el, SIS)
  oyun.el = null
  assert.deepEqual(olaylarla((o) => birak(oyun, o)), [])
})
