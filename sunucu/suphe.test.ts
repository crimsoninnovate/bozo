import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { Girdi, Sonuc } from '../lib/oyun/tipler.ts'
import { supheliMi, zamanlamaSupheli } from './suphe.ts'

const sonuc = (sis: number, tamKivam: number): Sonuc => ({
  puan: 0,
  ozet: { misafir: 0, sis, tamKivam, enUzunKombo: 0, kalkan: 0, bahsis: 0 },
  bitti: 'gece',
  tik: 7200,
})

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
  assert.equal(supheliMi(titreyen(), sonuc(40, 40)), false)
})

test('supheliMi_sabitAralik_isaretler', () => {
  assert.equal(supheliMi(sabit(), sonuc(40, 0)), true)
})
