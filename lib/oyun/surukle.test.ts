import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ESIK_PX, KALDIRMA_PX, birakmaHedefiMi, eldeKaynagi, surukle, type Surukleme } from './surukle.ts'
import type { Hedef } from './tipler.ts'

const BOS: Surukleme = { tur: 'bos' }
const bas = (hedef: Hedef | null, x = 0, y = 0, id = 1) => ({ tur: 'bas', id, hedef, x, y }) as const
const yuru = (x: number, y: number, id = 1) => ({ tur: 'yuru', id, x, y }) as const
const kaldir = (hedef: Hedef | null, x = 0, y = 0, id = 1) => ({ tur: 'kaldir', id, hedef, x, y }) as const

/** Baştan sona bir jest: her işaretin girdileri birleştirilir, son durum döner. */
function oynat(isaretler: Parameters<typeof surukle>[1][], elde: Hedef | null) {
  let durum: Surukleme = BOS
  const girdiler: Hedef[] = []
  let sonTasima: { dx: number; dy: number } | null = null
  for (const i of isaretler) {
    const s = surukle(durum, i, { elde })
    durum = s.durum
    girdiler.push(...s.girdiler)
    sonTasima = s.tasima
  }
  return { durum, girdiler, sonTasima }
}

test('surukle_esikAltiDokunus_tutVerir_eldeKalir', () => {
  const s = oynat([bas('o0'), yuru(ESIK_PX - 1, 0), kaldir('o0', ESIK_PX - 1, 0)], null)
  assert.deepEqual(s.girdiler, ['o0'])
  assert.deepEqual(s.durum, BOS)
})

test('surukle_esikUstuSurukleme_hedefteBirakir_tasimaParmaginUstunde', () => {
  const s = oynat([bas('o0'), yuru(0, ESIK_PX), yuru(0, 120)], 'o0')
  assert.deepEqual(s.sonTasima, { dx: 0, dy: 120 - KALDIRMA_PX })
  const son = surukle(s.durum, kaldir('t0', 0, 120), { elde: 'o0' })
  assert.deepEqual(son.girdiler, ['t0'])
  assert.deepEqual(son.durum, BOS)
  assert.equal(son.tasima, null)
})

test('surukle_tasima_elBoskenYok', () => {
  const s = oynat([bas('o0'), yuru(0, 40)], null)
  assert.equal(s.sonTasima, null)
})

test('surukle_bosAlanaBirakis_birakVerir', () => {
  const s = oynat([bas('o0'), yuru(0, 40), kaldir(null, 0, 40)], 'o0')
  assert.deepEqual(s.girdiler, ['birak'])
})

test('surukle_yanlisTurHedef_eldeKalir', () => {
  const sis = oynat([bas('o0'), yuru(0, 40), kaldir('m0', 0, 40)], 'o0')
  assert.deepEqual(sis.girdiler, [])
  const tabak = oynat([bas('t0'), yuru(0, 40), kaldir('t1', 0, 40)], 't0')
  assert.deepEqual(tabak.girdiler, [])
  const kendi = oynat([bas('o0'), yuru(0, 40), kaldir('o0', 0, 40)], 'o0')
  assert.deepEqual(kendi.girdiler, [])
})

test('surukle_tabak_misafireVeCope_sisVeEslikci_tabagaVeCope', () => {
  assert.ok(birakmaHedefiMi('t1', 'm2') && birakmaHedefiMi('t1', 'cop') && !birakmaHedefiMi('t1', 't0'))
  assert.ok(birakmaHedefiMi('o3', 't0') && birakmaHedefiMi('domates', 'cop') && !birakmaHedefiMi('o3', 'm0'))
  assert.ok(!birakmaHedefiMi('o0', 'p0') && !birakmaHedefiMi('o0', 'ciger'))
})

test('surukle_iptal_birakVerir', () => {
  const s = oynat([bas('t0'), yuru(0, 30), { tur: 'iptal', id: 1 }], 't0')
  assert.deepEqual(s.girdiler, ['birak'])
  assert.deepEqual(s.durum, BOS)
  assert.deepEqual(oynat([{ tur: 'iptal', id: 1 }], null).girdiler, [])
})

test('surukle_ikinciParmak_yokSayilir', () => {
  const s = oynat([bas('o0'), bas('t0', 0, 0, 2), yuru(0, 50, 2), kaldir('cop', 0, 50, 2), yuru(0, 50)], 'o0')
  assert.deepEqual(s.girdiler, [])
  assert.equal(s.durum.tur, 'basili')
  assert.deepEqual(s.sonTasima, { dx: 0, dy: 50 - KALDIRMA_PX })
})

test('surukle_dokunDokun_eldeykenHedefeDokunus_hedefVerir_bosAlanBirak', () => {
  assert.deepEqual(surukle(BOS, bas('t1'), { elde: 'o0' }).girdiler, ['t1'])
  assert.deepEqual(surukle(BOS, bas('m1'), { elde: 't0' }).girdiler, ['m1'])
  assert.deepEqual(surukle(BOS, bas(null), { elde: 'o0' }).girdiler, ['birak'])
})

test('surukle_eldeyken_kaynakYokSayilir_rafVeParaGecer_kendiKaynagiYenidenTutar', () => {
  assert.deepEqual(surukle(BOS, bas('o1'), { elde: 'o0' }).girdiler, [])
  assert.deepEqual(surukle(BOS, bas('domates'), { elde: 'o0' }).girdiler, [])
  assert.deepEqual(surukle(BOS, bas('m0'), { elde: 'o0' }).girdiler, [])
  assert.deepEqual(surukle(BOS, bas('ciger'), { elde: 'o0' }).girdiler, ['ciger'])
  assert.deepEqual(surukle(BOS, bas('p2'), { elde: 't0' }).girdiler, ['p2'])
  const tekrar = surukle(BOS, bas('o0'), { elde: 'o0' })
  assert.deepEqual(tekrar.girdiler, [])
  assert.equal(tekrar.durum.tur, 'basili')
})

test('surukle_elBosken_rafVeParaDokunma_hedefVeCopEtkisiz', () => {
  assert.deepEqual(surukle(BOS, bas('ciger'), { elde: null }).girdiler, ['ciger'])
  assert.deepEqual(surukle(BOS, bas('p0'), { elde: null }).girdiler, ['p0'])
  assert.deepEqual(surukle(BOS, bas('m0'), { elde: null }).girdiler, [])
  assert.deepEqual(surukle(BOS, bas('cop'), { elde: null }).girdiler, [])
  assert.equal(surukle(BOS, bas('ciger'), { elde: null }).durum.tur, 'bos')
})

test('surukle_klavye_dokunVeBirak', () => {
  assert.deepEqual(surukle(BOS, { tur: 'dokun', hedef: 'o0' }, { elde: null }).girdiler, ['o0'])
  assert.deepEqual(surukle(BOS, { tur: 'dokun', hedef: 't0' }, { elde: 'o0' }).girdiler, ['t0'])
  assert.deepEqual(surukle(BOS, { tur: 'birak' }, { elde: 'o0' }).girdiler, ['birak'])
  assert.deepEqual(surukle(BOS, { tur: 'birak' }, { elde: null }).girdiler, [])
})

test('eldeKaynagi_sisYuvasi_eslikciKasesi_tabakYeri', () => {
  assert.equal(eldeKaynagi(null), null)
  assert.equal(eldeKaynagi({ tur: 'sis', urun: 'ciger', kalite: 'tam', yuva: 2 }), 'o2')
  assert.equal(eldeKaynagi({ tur: 'eslikci', urun: 'sogan' }), 'sogan')
  assert.equal(eldeKaynagi({ tur: 'tabak', no: 1 }), 't1')
})
