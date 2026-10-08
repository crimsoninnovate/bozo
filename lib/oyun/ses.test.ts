import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SESLER, olayinSesi, sesSec } from './ses.ts'
import type { Olay } from './tipler.ts'

test('sesler_herSes_katmanlarKisikVeSinirIcinde', () => {
  assert.deepEqual(Object.keys(SESLER).sort(), [
    'cevir', 'cizirti', 'fisTamam', 'gece', 'kalkti', 'kayip', 'servis', 'sonSaat', 'tamKivam', 'tik', 'yanik',
  ])
  for (const [ad, katmanlar] of Object.entries(SESLER)) {
    assert.ok(katmanlar.length >= 1 && katmanlar.length <= 7, ad)
    for (const k of katmanlar) {
      assert.ok(k.kazanc > 0 && k.kazanc <= 0.15, `${ad} kazancı kulak yormamalı`)
      assert.ok(k.hz >= 40 && k.hz <= 7000 && (k.hzSon === undefined || (k.hzSon >= 40 && k.hzSon <= 7000)), ad)
      assert.ok(k.ms > 0 && (k.gecikme ?? 0) + k.ms <= 1000, `${ad} bir saniyeyi aşmaz (gürültü tamponu)`)
    }
  }
})

test('olayinSesi_olayTurune_gore', () => {
  const ornekler: [Olay, ReturnType<typeof olayinSesi>][] = [
    [{ tur: 'sisKondu', yuva: 0, urun: 'ciger' }, 'cizirti'],
    [{ tur: 'sisCevrildi', yuva: 0, iyi: true }, 'cevir'],
    [{ tur: 'sisAlindi', yuva: 0, kalite: 'tam' }, 'tamKivam'],
    [{ tur: 'sisAlindi', yuva: 0, kalite: 'iyi' }, 'tik'],
    [{ tur: 'sofraKuruldu', sofra: 0 }, 'tik'],
    [{ tur: 'fisTamam', sofra: 0, odeme: 500 }, 'fisTamam'],
    [{ tur: 'servis', sofra: 0, urun: 'ciger', kalite: 'iyi' }, 'servis'],
    [{ tur: 'sisYandi', yuva: 1 }, 'yanik'],
    [{ tur: 'sofraKalkti', sofra: 0, odedi: false }, 'kalkti'],
    [{ tur: 'sofraKalkti', sofra: 0, odedi: true }, null],
    [{ tur: 'evre', evre: 4 }, 'sonSaat'],
    [{ tur: 'evre', evre: 3 }, null],
    [{ tur: 'sofraGeldi', sofra: 0 }, null],
    [{ tur: 'bitti', sebep: 'gece' }, 'gece'],
    [{ tur: 'bitti', sebep: 'ucSofra' }, 'kayip'],
  ]
  for (const [olay, beklenen] of ornekler) assert.equal(olayinSesi(olay), beklenen, olay.tur)
})

test('sesSec_ayniKaredeAyniSes_birKez_fisTamamServisiBastirir', () => {
  const olaylar: Olay[] = [
    { tur: 'servis', sofra: 0, urun: 'ciger', kalite: 'tam' },
    { tur: 'servis', sofra: 0, urun: 'ayran', kalite: null },
    { tur: 'fisTamam', sofra: 0, odeme: 500 },
    { tur: 'sisYandi', yuva: 2 },
  ]
  assert.deepEqual(sesSec(olaylar), ['fisTamam', 'yanik'])
  assert.deepEqual(sesSec([]), [])
})
