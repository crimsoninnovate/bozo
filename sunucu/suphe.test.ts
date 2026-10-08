import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ustaOyna } from '../lib/oyun/deneme.ts'
import { simule } from '../lib/oyun/motor.ts'
import type { Girdi, Sonuc } from '../lib/oyun/tipler.ts'
import { supheliMi, tamKivamSupheli, zamanlamaSupheli } from './suphe.ts'

const sonuc = (sis: number, tamKivam: number): Sonuc => ({
  puan: 0,
  ozet: { sofra: 0, sis, tamKivam, enUzunKombo: 0, kalkan: 0 },
  bitti: 'gece',
  tik: 7200,
})

test('tamKivamSupheli_yuzde95Ustu_yirmiSisVeUstu', () => {
  assert.equal(tamKivamSupheli(sonuc(40, 39)), true)
  assert.equal(tamKivamSupheli(sonuc(40, 38)), false)
  assert.equal(tamKivamSupheli(sonuc(10, 10)), false)
})

test('zamanlamaSupheli_sabitAralikliBot_isaretlenir', () => {
  const kayit = ustaOyna(1, 'usta')
  assert.ok(kayit.length >= 100)
  assert.equal(zamanlamaSupheli(kayit), true)
})

test('zamanlamaSupheli_titreyenAraliklar_isaretlenmez', () => {
  const kayit: Girdi[] = []
  let tik = 0
  for (let i = 0; i < 200; i++) {
    tik += 10 + ((i * 7) % 11)
    kayit.push([tik, 's0'])
  }
  assert.equal(zamanlamaSupheli(kayit), false)
})

test('zamanlamaSupheli_yuzDokunusAlti_isaretlenmez', () => {
  const kayit: Girdi[] = Array.from({ length: 50 }, (_, i) => [i * 15, 's0'])
  assert.equal(zamanlamaSupheli(kayit), false)
})

test('supheliMi_ustaBotu_zamanlamadanIsaretlenir', () => {
  const kayit = ustaOyna(1, 'usta')
  assert.equal(supheliMi(kayit, simule(1, kayit)), true)
})
