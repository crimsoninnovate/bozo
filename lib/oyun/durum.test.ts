import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EN_COK_MISAFIR, TABAK_SAYISI } from './ayar.ts'
import { eksikKalemler, yeniOyun } from './durum.ts'
import { sahne } from './deneme.ts'

test('yeniOyun_ikiBosTabak_ucMisafirYeri_elBos_paraYok', () => {
  const oyun = yeniOyun(1)
  assert.deepEqual(oyun.tabaklar, Array.from({ length: TABAK_SAYISI }, () => []))
  assert.equal(oyun.misafirler.length, EN_COK_MISAFIR)
  assert.equal(oyun.el, null)
  assert.deepEqual(oyun.paralar, [null, null, null])
  assert.deepEqual(oyun.ozet, { misafir: 0, sis: 0, tamKivam: 0, enUzunKombo: 0, kalkan: 0, bahsis: 0 })
})

test('eksikKalemler_ocaktakiTabaktakiVeEldeki_dusulur_odemisSayilmaz', () => {
  const oyun = sahne([['ciger', 'ciger', 'domates']])
  // Görev 1'in `ilerle` taslağı oturtmaz: misafir elle oturtulur.
  oyun.misafirler[0] = { misafir: oyun.gelecek[0]!, sabir: 100, toplamSabir: 100, kalkis: null }
  assert.deepEqual(eksikKalemler(oyun), ['ciger', 'ciger', 'domates'])
  oyun.ocak[0] = { urun: 'ciger', gecen: 0, pisme: 240, pencere: 180, bant: 36 }
  oyun.tabaklar[0] = [{ urun: 'domates', kalite: null }]
  oyun.el = { tur: 'sis', urun: 'ciger', kalite: 'iyi', yuva: 1 }
  assert.deepEqual(eksikKalemler(oyun), [])
  const yer = oyun.misafirler[0]
  assert.ok(yer)
  yer.kalkis = 10
  oyun.ocak[0] = null
  assert.deepEqual(eksikKalemler(oyun), [])
})
