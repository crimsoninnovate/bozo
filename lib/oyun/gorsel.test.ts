import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  fisSatirlari, kivilcimYogunlugu, korYogunlugu, pismeOrani, sabirDurumu, servisEdilenler, yanmaOrani,
} from './gorsel.ts'
import { bekle, dokun, sahne } from './deneme.ts'

const SIS = { urun: 'ciger' as const, gecen: 0, pisme: 240, pencere: 120, bant: 30, cevirme: 'yok' as const }

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
  bekle(oyun, 400)
  assert.equal(kivilcimYogunlugu(oyun), 0)
})

test('sabirDurumu_yuzdeOtuzVeAltinda_az', () => {
  assert.equal(sabirDurumu(1), 'var')
  assert.equal(sabirDurumu(0.31), 'var')
  assert.equal(sabirDurumu(0.3), 'az')
  assert.equal(sabirDurumu(0), 'az')
})

test('servisEdilenler_ayniUrundenOnceYazilanOnceServisSayilir', () => {
  assert.deepEqual(servisEdilenler(['ciger', 'ayran'], ['ciger', 'ayran']), [false, false])
  assert.deepEqual(servisEdilenler(['ciger', 'ayran'], ['ciger']), [false, true])
  assert.deepEqual(servisEdilenler(['ciger', 'ciger', 'dalak'], ['ciger', 'dalak']), [true, false, false])
  assert.deepEqual(servisEdilenler(['ciger', 'dalak', 'yurek'], []), [true, true, true])
})

test('fisSatirlari_ayniUrunuTekSatirdaTopla_kalanAdediniSay', () => {
  assert.deepEqual(fisSatirlari(['ciger', 'ciger', 'dalak'], ['ciger', 'ciger', 'dalak'], false), [
    { tur: 'urun', urun: 'ciger', kalan: 2 },
    { tur: 'urun', urun: 'dalak', kalan: 1 },
  ])
  assert.deepEqual(fisSatirlari(['ciger', 'ciger', 'dalak'], ['ciger'], false), [
    { tur: 'urun', urun: 'ciger', kalan: 1 },
    { tur: 'urun', urun: 'dalak', kalan: 0 },
  ])
})

test('fisSatirlari_karisikFis_ilkUcuTekKumeOlurServisleriAyriTasir', () => {
  const fis = ['ciger', 'dalak', 'yurek', 'ayran'] as const
  assert.deepEqual(fisSatirlari(fis, ['dalak', 'yurek', 'ayran'], true), [
    { tur: 'karisik', servis: [true, false, false] },
    { tur: 'urun', urun: 'ayran', kalan: 1 },
  ])
  assert.deepEqual(fisSatirlari(['ciger', 'dalak', 'yurek', 'ciger'], ['ciger'], true), [
    { tur: 'karisik', servis: [true, true, true] },
    { tur: 'urun', urun: 'ciger', kalan: 1 },
  ])
})
