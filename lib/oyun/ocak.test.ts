import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EVRELER, PISME_YUZDESI } from './ayar.ts'
import { evreyeGec, sahne } from './deneme.ts'
import { ocakIlerle, ocaktanTut, rafaDokun } from './ocak.ts'
import type { Olay, Oyun, Urun } from './tipler.ts'

const E0 = EVRELER[0]!
const PISME = E0.cigerPisme
const PENCERE = E0.almaPenceresi

/** Ocağı `n` tik pişirir, olayları döner. */
function pisir(oyun: Oyun, n: number): Olay[] {
  const olaylar: Olay[] = []
  for (let i = 0; i < n; i++) ocakIlerle(oyun, olaylar)
  return olaylar
}

function kondur(oyun: Oyun, urun: Urun): Olay[] {
  const olaylar: Olay[] = []
  rafaDokun(oyun, urun, olaylar)
  return olaylar
}

function tut(oyun: Oyun, yuva: number): Olay[] {
  const olaylar: Olay[] = []
  ocaktanTut(oyun, yuva, olaylar)
  return olaylar
}

test('raf_sisIlkBosOcakYuvasinaIner_sureleriEvredenSabitlenir', () => {
  const oyun = sahne([])
  assert.deepEqual(kondur(oyun, 'ciger'), [{ tur: 'sisKondu', yuva: 0, urun: 'ciger' }])
  assert.deepEqual(oyun.ocak[0], { urun: 'ciger', gecen: 0, pisme: PISME, pencere: PENCERE, bant: E0.tamKivamBandi })
})

test('raf_evresiGelmemisUrun_etkisizdir', () => {
  const oyun = sahne([])
  assert.deepEqual([...kondur(oyun, 'dalak'), ...kondur(oyun, 'yurek')], [])
  assert.deepEqual(oyun.ocak, [null, null, null, null])
})

test('raf_dalakKisaYurekUzunPiser', () => {
  const oyun = sahne([])
  evreyeGec(oyun, 2)
  for (const u of ['ciger', 'dalak', 'yurek'] as const) kondur(oyun, u)
  const ayar = EVRELER[2]!
  const beklenen = (u: Urun) => Math.floor((ayar.cigerPisme * PISME_YUZDESI[u] + 50) / 100)
  assert.deepEqual(oyun.ocak.map((s) => s?.pisme ?? null), [beklenen('ciger'), beklenen('dalak'), beklenen('yurek'), null])
})

test('raf_eldeSisVarken_onunBosYuvasiAtlanir', () => {
  const oyun = sahne([])
  oyun.el = { tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 0 }
  assert.deepEqual(kondur(oyun, 'ciger'), [{ tur: 'sisKondu', yuva: 1, urun: 'ciger' }])
  assert.equal(oyun.ocak[0], null)
})

test('raf_acikYuvalarDoluysa_rafDoluOlayi_eldekineBakmaz', () => {
  const oyun = sahne([])
  oyun.el = { tur: 'eslikci', urun: 'domates' }
  for (let i = 0; i < 3; i++) kondur(oyun, 'ciger')
  assert.deepEqual(kondur(oyun, 'ciger'), [{ tur: 'rafDolu', urun: 'ciger' }])
  assert.equal(oyun.ocak[3], null)
})

test('ocak_pisenSiseDokunmak_etkisiz_yalnizSisErkenOlayi', () => {
  const oyun = sahne([])
  kondur(oyun, 'ciger')
  pisir(oyun, 10)
  assert.deepEqual(tut(oyun, 0), [{ tur: 'sisErken', yuva: 0 }])
  assert.ok(oyun.ocak[0])
  assert.equal(oyun.el, null)
})

test('ocak_pencereninOrtasindaTutulan_tamKivam_yuvaBosalir_kaliteMuhurlenir', () => {
  const oyun = sahne([])
  kondur(oyun, 'ciger')
  pisir(oyun, PISME + PENCERE / 2)
  assert.deepEqual(tut(oyun, 0), [{ tur: 'tutuldu', el: { tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 0 } }])
  assert.equal(oyun.ocak[0], null)
  pisir(oyun, 1000)
  assert.deepEqual(oyun.el, { tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 0 })
})

test('ocak_pencereninKenarindaTutulan_iyi', () => {
  const oyun = sahne([])
  kondur(oyun, 'ciger')
  pisir(oyun, PISME)
  assert.deepEqual(tut(oyun, 0), [{ tur: 'tutuldu', el: { tur: 'sis', urun: 'ciger', kalite: 'iyi', yuva: 0 } }])
})

test('ocak_elDoluyken_tutmakEtkisiz', () => {
  const oyun = sahne([])
  kondur(oyun, 'ciger')
  pisir(oyun, PISME)
  oyun.el = { tur: 'eslikci', urun: 'domates' }
  assert.deepEqual(tut(oyun, 0), [])
  assert.ok(oyun.ocak[0])
})

test('ocak_pencereGecinceSisYanar_komboSifirlanir_puanDusmez', () => {
  const oyun = sahne([])
  oyun.kombo = 5
  oyun.puan = 700
  kondur(oyun, 'ciger')
  assert.deepEqual(pisir(oyun, PISME + PENCERE - 1), [])
  assert.deepEqual(pisir(oyun, 1), [{ tur: 'sisYandi', yuva: 0 }])
  assert.equal(oyun.ocak[0], null)
  assert.equal(oyun.kombo, 0)
  assert.equal(oyun.puan, 700)
})
