import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { SiraSatiri } from './depo.ts'
import { enIyiler, karsilastir, oyuncununSirasi, tabloSatirlari } from './siralama.ts'

const satir = (p: Partial<SiraSatiri>): SiraSatiri => ({
  turId: 1,
  oyuncuId: 1,
  takmaAd: 'A',
  gizli: false,
  supheli: false,
  puan: 100,
  tamKivam: 0,
  kalkan: 0,
  olusturma: 0,
  ...p,
})

test('karsilastir_puanTamKivamKalkanZaman_sirasiyla', () => {
  assert.ok(karsilastir(satir({ puan: 200 }), satir({ puan: 100 })) < 0)
  assert.ok(karsilastir(satir({ tamKivam: 5 }), satir({ tamKivam: 4 })) < 0)
  assert.ok(karsilastir(satir({ kalkan: 0 }), satir({ kalkan: 1 })) < 0)
  assert.ok(karsilastir(satir({ olusturma: 1 }), satir({ olusturma: 2 })) < 0)
  assert.equal(karsilastir(satir({}), satir({})), 0)
})

test('enIyiler_oyuncuBasinaTekSatir_enIyisi_sirali', () => {
  const turlar = [
    satir({ turId: 1, oyuncuId: 1, puan: 100 }),
    satir({ turId: 2, oyuncuId: 1, puan: 300 }),
    satir({ turId: 3, oyuncuId: 2, puan: 200 }),
    satir({ turId: 4, oyuncuId: 1, puan: 300, tamKivam: 1 }),
  ]
  assert.deepEqual(enIyiler(turlar).map((s) => s.turId), [4, 3])
})

test('oyuncununSirasi_birinciFarkNull_ikinciUsttekineFark_yoksaNull', () => {
  const sirali = [satir({ oyuncuId: 1, puan: 500 }), satir({ oyuncuId: 2, puan: 320 })]
  assert.deepEqual(oyuncununSirasi(sirali, 1), { puan: 500, sira: 1, ustekiFark: null })
  assert.deepEqual(oyuncununSirasi(sirali, 2), { puan: 320, sira: 2, ustekiFark: 180 })
  assert.equal(oyuncununSirasi(sirali, 3), null)
})

test('tabloSatirlari_gizliAdNull_adetKadar', () => {
  const sirali = [satir({ takmaAd: 'A' }), satir({ oyuncuId: 2, takmaAd: 'B', gizli: true }), satir({ oyuncuId: 3 })]
  const tablo = tabloSatirlari(sirali, 2)
  assert.equal(tablo.length, 2)
  assert.equal(tablo[0]?.takmaAd, 'A')
  assert.equal(tablo[1]?.takmaAd, null)
  assert.equal(tablo[1]?.sira, 2)
})
