import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SESLER, olayinSesi, sesSec } from './ses.ts'
import type { Olay } from './tipler.ts'

test('sesler_besSes_herBiriEnAzBirNota_kazancKisik', () => {
  assert.deepEqual(Object.keys(SESLER).sort(), ['cizirti', 'servis', 'sonSaat', 'tik', 'yanik'])
  for (const [ad, ses] of Object.entries(SESLER)) {
    assert.ok(ses.notalar.length >= 1, ad)
    assert.ok(ses.kazanc > 0 && ses.kazanc <= 0.2, `${ad} kazancı kulak yormamalı`)
    for (const nota of ses.notalar) assert.ok(nota.hz >= 60 && nota.hz <= 4000 && nota.ms > 0, ad)
  }
  assert.equal(SESLER.servis.notalar.length, 2)
})

test('olayinSesi_olayTurune_gore', () => {
  const ornekler: [Olay, ReturnType<typeof olayinSesi>][] = [
    [{ tur: 'sisKondu', yuva: 0, urun: 'ciger' }, 'cizirti'],
    [{ tur: 'sisCevrildi', yuva: 0, iyi: true }, 'tik'],
    [{ tur: 'sisAlindi', yuva: 0, kalite: 'tam' }, 'tik'],
    [{ tur: 'servis', sofra: 0, urun: 'ciger', kalite: 'iyi' }, 'servis'],
    [{ tur: 'sisYandi', yuva: 1 }, 'yanik'],
    [{ tur: 'sofraKalkti', sofra: 0, odedi: false }, 'yanik'],
    [{ tur: 'sofraKalkti', sofra: 0, odedi: true }, null],
    [{ tur: 'evre', evre: 4 }, 'sonSaat'],
    [{ tur: 'evre', evre: 3 }, null],
    [{ tur: 'sofraGeldi', sofra: 0 }, null],
    [{ tur: 'bitti', sebep: 'gece' }, null],
  ]
  for (const [olay, beklenen] of ornekler) assert.equal(olayinSesi(olay), beklenen, olay.tur)
})

test('sesSec_ayniKaredeAyniSes_birKez_siraKorunur', () => {
  const olaylar: Olay[] = [
    { tur: 'servis', sofra: 0, urun: 'ciger', kalite: 'tam' },
    { tur: 'servis', sofra: 0, urun: 'ayran', kalite: null },
    { tur: 'fisTamam', sofra: 0, odeme: 500 },
    { tur: 'sisYandi', yuva: 2 },
  ]
  assert.deepEqual(sesSec(olaylar), ['servis', 'yanik'])
  assert.deepEqual(sesSec([]), [])
})
