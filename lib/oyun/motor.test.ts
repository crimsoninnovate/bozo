import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TUR_TIK } from './ayar.ts'
import { bekle, dokun, sahne, ustaOyna } from './deneme.ts'
import { yeniOyun } from './durum.ts'
import { ilerle, simule } from './motor.ts'
import { rastgele } from './rastgele.ts'
import type { Girdi, Hedef } from './tipler.ts'

export const TUM_HEDEFLER: readonly Hedef[] = [
  'ciger', 'dalak', 'yurek', 'domates', 'sogan', 'o0', 'o1', 'o2', 'o3', 't0', 't1', 'm0', 'm1', 'm2',
  'p0', 'p1', 'p2', 'cop', 'birak',
]

test('simule_siraDisiAralikDisiYaDaKesirliTik_hataVerir', () => {
  assert.throws(() => simule(1, [[5, 'ciger'], [4, 'ciger']]), RangeError)
  assert.throws(() => simule(1, [[TUR_TIK, 'ciger']]), RangeError)
  assert.throws(() => simule(1, [[-1, 'ciger']]), RangeError)
  assert.throws(() => simule(1, [[1.5, 'ciger']]), RangeError)
})

test('simule_tanimsizYaDaEskiHedefYaDaBozukGirdi_hataVerir', () => {
  const bozuk = (g: unknown) => g as Girdi[]
  for (const h of ['x', 's0', 'ayran', 'o4', 't2', 'm3', 'p3', 5, null]) {
    assert.throws(() => simule(1, bozuk([[0, h]])), RangeError, String(h))
  }
  assert.throws(() => simule(1, bozuk([null])), RangeError)
  assert.throws(() => simule(1, bozuk([[0, 'o0', 'fazla']])), RangeError)
})

test('simule_ondokuzHedefinHepsi_gecerli', () => {
  assert.equal(TUM_HEDEFLER.length, 19)
  assert.doesNotThrow(() => simule(1, TUM_HEDEFLER.map((h, i) => [i, h] as const)))
})

test('ilerle_ayniTikteTutVeBirakmaHedefi_sirayla', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  dokun(oyun, 'ciger')
  bekle(oyun, 300)
  const olaylar = dokun(oyun, 'o0', 't0')
  assert.deepEqual(olaylar.map((o) => o.tur), ['tutuldu', 'tabagaKondu'])
  assert.equal(oyun.el, null)
})

test('ilerle_bittiktenSonra_hicbirSeyDegismez', () => {
  const oyun = sahne([])
  oyun.bitti = 'gece'
  assert.deepEqual(ilerle(oyun, ['ciger', 'p0']), [])
  assert.equal(oyun.tik, 0)
})

test('evre_sinirdaGecer_olayVerir', () => {
  const oyun = sahne([])
  bekle(oyun, 899)
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'evre', evre: 1 }])
})

test('puan_rastgeleGirdiyle_hicbirTikteDusmez_500Tohum', () => {
  for (let tohum = 1; tohum <= 500; tohum++) {
    const r = rastgele(tohum * 31)
    const oyun = yeniOyun(tohum)
    let onceki = 0
    while (!oyun.bitti) {
      const hedef = TUM_HEDEFLER[r.tam(0, TUM_HEDEFLER.length - 1)] as Hedef
      ilerle(oyun, r.tam(0, 5) === 0 ? [hedef] : [])
      assert.ok(oyun.puan >= onceki, `tohum ${tohum}, tik ${oyun.tik}: ${onceki} -> ${oyun.puan}`)
      onceki = oyun.puan
    }
  }
})

test('simule_ayniTohumVeGirdi_herSeferindeAyniSonuc', () => {
  const kayit = ustaOyna(77, 'usta')
  assert.deepEqual(simule(77, kayit), simule(77, kayit))
})

test('simule_bitistenSonrakiGirdiler_yokSayilir', () => {
  const kayit = ustaOyna(2026, 'hareketsiz')
  const sonuc = simule(2026, kayit)
  assert.equal(sonuc.bitti, 'ucMisafir')
  const fazla: Girdi[] = [...kayit, [sonuc.tik + 10, 'ciger']]
  assert.deepEqual(simule(2026, fazla), sonuc)
})

/* Altın kayıtlar: sabit tohum ve otomatik oyuncu, sabit sonuç. Kural, ayar ya da oyuncu değişince bilerek kırılır. */
test('altin_tohum1_usta', () => {
  assert.deepEqual(simule(1, ustaOyna(1, 'usta')), {
    puan: 20999,
    ozet: { misafir: 20, sis: 36, tamKivam: 31, enUzunKombo: 14, kalkan: 0, bahsis: 6679 },
    bitti: 'gece',
    tik: 7200,
  })
})

test('altin_tohum1_duzenli', () => {
  assert.deepEqual(simule(1, ustaOyna(1, 'duzenli')), {
    puan: 11091,
    ozet: { misafir: 17, sis: 29, tamKivam: 2, enUzunKombo: 10, kalkan: 1, bahsis: 4131 },
    bitti: 'gece',
    tik: 7200,
  })
})

test('altin_tohum2026_rastgele', () => {
  assert.deepEqual(simule(2026, ustaOyna(2026, 'rastgele')), {
    puan: 0,
    ozet: { misafir: 0, sis: 0, tamKivam: 0, enUzunKombo: 0, kalkan: 3, bahsis: 0 },
    bitti: 'ucMisafir',
    tik: 4380,
  })
})
