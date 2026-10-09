import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PARA_TIK } from './ayar.ts'
import {
  fisSatirlari, kivilcimYogunlugu, korYogunlugu, paraOrani, pismeOrani, sabirDurumu, yanmaOrani,
} from './gorsel.ts'
import { bekle, dokun, sahne } from './deneme.ts'

const SIS = { urun: 'ciger' as const, gecen: 0, pisme: 240, pencere: 120, bant: 30 }

test('pismeOrani_cigdenPismiseSifirBir_penceredeBirdeKalir', () => {
  assert.equal(pismeOrani({ ...SIS, gecen: 0 }), 0)
  assert.equal(pismeOrani({ ...SIS, gecen: 120 }), 0.5)
  assert.equal(pismeOrani({ ...SIS, gecen: 240 }), 1)
  assert.equal(pismeOrani({ ...SIS, gecen: 330 }), 1)
})

test('yanmaOrani_pismedenOnceSifir_pencereBoyuncaBire', () => {
  assert.equal(yanmaOrani({ ...SIS, gecen: 200 }), 0)
  assert.equal(yanmaOrani({ ...SIS, gecen: 240 }), 0)
  assert.equal(yanmaOrani({ ...SIS, gecen: 300 }), 0.5)
  assert.equal(yanmaOrani({ ...SIS, gecen: 360 }), 1)
})

test('korYogunlugu_komboKademesiyleDortBasamak', () => {
  assert.deepEqual([0, 2, 3, 6, 9, 40].map(korYogunlugu), [0.25, 0.25, 0.5, 0.75, 1, 1])
})

test('kivilcimYogunlugu_ocakBosken_sifir_sisVarkenKorIsigi', () => {
  const oyun = sahne([])
  oyun.kombo = 4
  assert.equal(kivilcimYogunlugu(oyun), 0)
  dokun(oyun, 'ciger')
  assert.equal(kivilcimYogunlugu(oyun), 0.5)
  bekle(oyun, 420)
  assert.equal(kivilcimYogunlugu(oyun), 0)
})

test('sabirDurumu_yuzdeOtuzVeAltinda_az', () => {
  assert.equal(sabirDurumu(1), 'var')
  assert.equal(sabirDurumu(0.31), 'var')
  assert.equal(sabirDurumu(0.3), 'az')
  assert.equal(sabirDurumu(0), 'az')
})

test('paraOrani_kalanSure_sifirBir', () => {
  assert.equal(paraOrani(null), 0)
  assert.equal(paraOrani({ tutar: 200, kalan: PARA_TIK }), 1)
  assert.equal(paraOrani({ tutar: 200, kalan: PARA_TIK / 4 }), 0.25)
})

test('fisSatirlari_ayniKalemTekSatirdaAdetle_karisikIlkUcuTekKume', () => {
  assert.deepEqual(fisSatirlari(['ciger', 'ciger', 'domates'], false), [
    { tur: 'kalem', urun: 'ciger', adet: 2 },
    { tur: 'kalem', urun: 'domates', adet: 1 },
  ])
  assert.deepEqual(fisSatirlari(['ciger', 'dalak', 'yurek', 'domates'], true), [
    { tur: 'karisik' },
    { tur: 'kalem', urun: 'domates', adet: 1 },
  ])
})
