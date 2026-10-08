import { test } from 'node:test'
import assert from 'node:assert/strict'
import { canliAdim, canliBaslat, canliDokun } from './canli.ts'
import { ustaOyna } from './deneme.ts'
import { simule } from './motor.ts'

test('canli_kayitYenidenOynatilinca_ayniSonucuVerir', () => {
  const tohum = 2026
  const plan = ustaOyna(tohum, 'usta')
  const canli = canliBaslat(tohum)
  let i = 0
  while (!canli.oyun.bitti) {
    while (plan[i] && plan[i]![0] === canli.oyun.tik) canliDokun(canli, plan[i++]![1])
    canliAdim(canli)
  }
  assert.deepEqual(canli.kayit, plan)
  assert.deepEqual(simule(tohum, canli.kayit), {
    puan: canli.oyun.puan,
    ozet: canli.oyun.ozet,
    bitti: canli.oyun.bitti,
    tik: canli.oyun.tik,
  })
})

test('canli_ayniTiktekiIkinciDokunus_duser', () => {
  const canli = canliBaslat(1)
  canliDokun(canli, 'ciger')
  canliDokun(canli, 'ciger')
  canliDokun(canli, 's0')
  canliAdim(canli)
  assert.deepEqual(canli.kayit, [
    [0, 'ciger'],
    [0, 's0'],
  ])
})

test('canli_bittiktenSonra_dokunusKaydaGecmez', () => {
  const canli = canliBaslat(1)
  canli.oyun.bitti = 'gece'
  canliDokun(canli, 'ciger')
  assert.deepEqual(canli.bekleyen, [])
})
