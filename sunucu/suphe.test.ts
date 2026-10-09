import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { Girdi } from '../lib/oyun/tipler.ts'
import { supheliMi, zamanlamaSupheli } from './suphe.ts'

const titreyen = (): Girdi[] => {
  const kayit: Girdi[] = []
  let tik = 0
  for (let i = 0; i < 200; i++) {
    tik += 10 + ((i * 7) % 11)
    kayit.push([tik, 'ciger'])
  }
  return kayit
}

const sabit = (): Girdi[] => Array.from({ length: 200 }, (_, i) => [i * 20, i % 2 ? 'ciger' : 'birak'] as Girdi)

test('zamanlamaSupheli_sabitAralikliKayit_isaretlenir', () => {
  assert.equal(zamanlamaSupheli(sabit()), true)
})

test('zamanlamaSupheli_titreyenAraliklar_isaretlenmez', () => {
  assert.equal(zamanlamaSupheli(titreyen()), false)
})

test('zamanlamaSupheli_yuzDokunusAlti_isaretlenmez', () => {
  const kayit: Girdi[] = Array.from({ length: 50 }, (_, i) => [i * 15, 'ciger'])
  assert.equal(zamanlamaSupheli(kayit), false)
})

test('supheliMi_yuzdeYuzTamKivam_tekBasinaIsaretlemez', () => {
  assert.equal(supheliMi(titreyen()), false)
})

test('supheliMi_sabitAralik_isaretler', () => {
  assert.equal(supheliMi(sabit()), true)
})
