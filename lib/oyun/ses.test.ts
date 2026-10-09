import { test } from 'node:test'
import assert from 'node:assert/strict'
import { SESLER, olayinSesi, sesSec } from './ses.ts'
import type { Olay } from './tipler.ts'

test('sesler_herSes_katmanlarKisikVeSinirIcinde', () => {
  assert.deepEqual(Object.keys(SESLER).sort(), [
    'bahsis', 'birak', 'cizirti', 'gece', 'kalkti', 'kayip', 'sonSaat', 'tamKivam', 'teslim', 'tik', 'tut', 'yanik', 'yanlis',
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
  const SIS = { tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 0 } as const
  const ornekler: [Olay, ReturnType<typeof olayinSesi>][] = [
    [{ tur: 'sisKondu', yuva: 0, urun: 'ciger' }, 'cizirti'],
    [{ tur: 'tutuldu', el: SIS }, 'tamKivam'],
    [{ tur: 'tutuldu', el: { ...SIS, kalite: 'iyi' } }, 'tut'],
    [{ tur: 'tutuldu', el: { tur: 'eslikci', urun: 'domates' } }, 'tut'],
    [{ tur: 'tutuldu', el: { tur: 'tabak', no: 0 } }, 'tut'],
    [{ tur: 'tabagaKondu', no: 0, kalem: { urun: 'ciger', kalite: 'tam' }, el: SIS }, 'tik'],
    [{ tur: 'teslim', yer: 0, no: 0, hesap: 150 }, 'teslim'],
    [{ tur: 'bahsisAlindi', yer: 0, tutar: 200 }, 'bahsis'],
    [{ tur: 'birakildi', el: SIS }, 'birak'],
    [{ tur: 'copeGitti', el: SIS }, 'birak'],
    [{ tur: 'yanlisTabak', yer: 0, no: 0 }, 'yanlis'],
    [{ tur: 'sisYandi', yuva: 1 }, 'yanik'],
    [{ tur: 'misafirKalkti', yer: 0, odedi: false }, 'kalkti'],
    [{ tur: 'misafirKalkti', yer: 0, odedi: true }, null],
    [{ tur: 'evre', evre: 4 }, 'sonSaat'],
    [{ tur: 'evre', evre: 3 }, null],
    [{ tur: 'sisErken', yuva: 0 }, null],
    [{ tur: 'paraDustu', yer: 0, tutar: 200 }, null],
    [{ tur: 'bitti', sebep: 'gece' }, 'gece'],
    [{ tur: 'bitti', sebep: 'ucMisafir' }, 'kayip'],
  ]
  for (const [olay, beklenen] of ornekler) assert.equal(olayinSesi(olay), beklenen, olay.tur)
})

test('sesSec_ayniKaredeAyniSes_birKez', () => {
  const tam = { tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 0 } as const
  const olaylar: Olay[] = [
    { tur: 'tutuldu', el: tam },
    { tur: 'tutuldu', el: { ...tam, yuva: 1 } },
    { tur: 'sisYandi', yuva: 2 },
  ]
  assert.deepEqual(sesSec(olaylar), ['tamKivam', 'yanik'])
  assert.deepEqual(sesSec([]), [])
})
