import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EVRELER } from './ayar.ts'
import { bekle, dokun, sahne } from './deneme.ts'
import { yeniOyun } from './durum.ts'
import { rehberAtla, rehberBasla, rehberDurdurur, rehberIlerle, rehberIzni, rehberTamam, type Rehber } from './rehber.ts'
import type { Hedef, Oyun } from './tipler.ts'

const E0 = EVRELER[0]!
const HEDEFLER: readonly Hedef[] = ['ciger', 'dalak', 'domates', 'o0', 'o1', 't0', 't1', 'm0', 'm1', 'p0', 'cop', 'birak']
const izinliler = (r: Rehber) => HEDEFLER.filter((h) => rehberIzni(r, h))

/** Rehberi bir adım ilerletir: oyun `n` tik akar (ya da dokunur), rehber olayları görür. */
function akit(r: Rehber, oyun: Oyun, n: number): Rehber {
  return rehberIlerle(r, oyun, bekle(oyun, n))
}

function dokunup(r: Rehber, oyun: Oyun, ...h: Hedef[]): Rehber {
  return rehberIlerle(r, oyun, dokun(oyun, ...h))
}

test('rehber_misafirOturmadanBekler_oturuncaFis_tamamlaRaf', () => {
  const oyun = sahne([['ciger']])
  let r = rehberIlerle(rehberBasla(), oyun, [])
  assert.equal(r.adim, 'bekle')
  assert.deepEqual(izinliler(r), [])
  r = akit(r, oyun, 1)
  assert.equal(r.adim, 'fis')
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), [])
  assert.equal(rehberTamam(rehberBasla()).adim, 'bekle')
  r = rehberTamam(r)
  assert.equal(r.adim, 'raf')
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['ciger'])
})

test('rehber_tamYol_rafPisiyorHazirTabakMisafirParaIkinci', () => {
  const oyun = sahne([['ciger']])
  let r = rehberTamam(akit(rehberBasla(), oyun, 1))
  r = dokunup(r, oyun, 'ciger')
  assert.equal(r.adim, 'pisiyor')
  assert.ok(!rehberDurdurur(r))
  assert.deepEqual(izinliler(r), [])
  r = akit(r, oyun, E0.cigerPisme - 1)
  assert.equal(r.adim, 'hazir')
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['o0'])
  r = dokunup(r, oyun, 'o0')
  assert.equal(r.adim, 'tabak')
  assert.ok(!rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['t0'])
  r = dokunup(r, oyun, 't0')
  assert.equal(r.adim, 'misafir')
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['t0', 'm0'])
  r = dokunup(r, oyun, 't0')
  assert.equal(r.adim, 'misafir')
  r = dokunup(r, oyun, 'm0')
  assert.equal(r.adim, 'para')
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['p0'])
  r = dokunup(r, oyun, 'p0')
  assert.equal(r.adim, 'ikinci')
  assert.ok(!rehberDurdurur(r))
  assert.deepEqual(izinliler(r), HEDEFLER)
})

test('rehber_tabakAdiminda_birakReddedilir_adimTekrarEder', () => {
  const oyun = sahne([['ciger']])
  let r = rehberTamam(akit(rehberBasla(), oyun, 1))
  r = dokunup(r, oyun, 'ciger')
  r = akit(r, oyun, E0.cigerPisme - 1)
  r = dokunup(r, oyun, 'o0')
  assert.equal(r.adim, 'tabak')
  assert.ok(!rehberIzni(r, 'birak'))
  assert.ok(!rehberIzni(r, 'cop'))
  r = akit(r, oyun, 300)
  assert.equal(r.adim, 'tabak')
  assert.equal(oyun.el?.tur, 'sis')
})

test('rehber_ikinciMisafirOturunca_eslikciAdimi_domatesTabagaInincebiter', () => {
  const oyun = yeniOyun(1)
  let r = rehberBasla()
  r = akit(r, oyun, 61)
  assert.equal(r.adim, 'fis')
  r = rehberTamam(r)
  r = dokunup(r, oyun, 'ciger')
  r = akit(r, oyun, E0.cigerPisme - 1)
  r = dokunup(r, oyun, 'o0')
  r = dokunup(r, oyun, 't0')
  r = dokunup(r, oyun, 't0')
  r = dokunup(r, oyun, 'm0')
  r = dokunup(r, oyun, 'p0')
  assert.equal(r.adim, 'ikinci')
  r = dokunup(r, oyun, 'ciger')
  assert.equal(r.adim, 'ikinci')
  while (r.adim === 'ikinci') r = akit(r, oyun, 1)
  assert.equal(r.adim, 'eslikci')
  assert.equal(oyun.misafirler[0]?.misafir.no, 1)
  assert.ok(rehberDurdurur(r))
  assert.deepEqual(izinliler(r), ['domates', 't0', 't1', 'm0', 'm1', 'cop', 'birak'])
  r = dokunup(r, oyun, 'domates')
  assert.equal(r.adim, 'eslikci')
  r = dokunup(r, oyun, 't1')
  assert.equal(r.adim, 'bitti')
  assert.deepEqual(izinliler(r), HEDEFLER)
})

test('rehber_eslikciAdiminda_eldekiTabak_birakilirYaDaCopeGider', () => {
  const oyun = yeniOyun(1)
  let r: Rehber = { adim: 'ikinci' }
  oyun.tabaklar[1] = [{ urun: 'ciger', kalite: 'iyi' }]
  dokun(oyun, 't1')
  assert.equal(oyun.el?.tur, 'tabak')
  while (r.adim === 'ikinci') r = akit(r, oyun, 1)
  assert.equal(r.adim, 'eslikci')
  assert.ok(rehberIzni(r, 'birak') && rehberIzni(r, 'cop'))
  r = dokunup(r, oyun, 'birak')
  assert.equal(oyun.el, null)
  assert.equal(r.adim, 'eslikci')
})

test('rehber_atla_herAdimdaBitirir_degismeyenNesneAyniKalir_geceBittiyseBiter', () => {
  const r = rehberBasla()
  assert.equal(rehberAtla(r).adim, 'bitti')
  assert.equal(rehberIlerle(r, sahne([]), []), r)
  const oyun = sahne([])
  oyun.bitti = 'ucMisafir'
  assert.equal(rehberIlerle(rehberBasla(), oyun, []).adim, 'bitti')
})
