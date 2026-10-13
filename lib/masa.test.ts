import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { MASA_SAYISI, masaCoz, masaGecerliMi, yediGunlukBaslangic } from './masa.ts'

test('masaGecerliMi_birIleOtuzArasi_dogru_disi_yanlis', () => {
  assert.equal(MASA_SAYISI, 30)
  for (const n of [1, 7, 30]) assert.equal(masaGecerliMi(n), true)
  for (const n of [0, 31, -1, 7.5, Number.NaN]) assert.equal(masaGecerliMi(n), false)
})

test('masaCoz_plakaninYazdigiBicim_doner_baskasi_null', () => {
  assert.equal(masaCoz('?masa=7'), 7)
  assert.equal(masaCoz('?masa=30&x=1'), 30)
  for (const arama of ['', '?masa=', '?masa=0', '?masa=31', '?masa=07', '?masa=7a', '?masa= 7', '?k=sofra']) {
    assert.equal(masaCoz(arama), null, arama)
  }
})

test('yediGunlukBaslangic_bugunDahilAltiGunGeri_ayVeYilSinirindan', () => {
  assert.equal(yediGunlukBaslangic('2026-10-13'), '2026-10-07')
  assert.equal(yediGunlukBaslangic('2026-11-03'), '2026-10-28')
  assert.equal(yediGunlukBaslangic('2027-01-02'), '2026-12-27')
})

test('htaccess_birdenOtuzaHerPlakaAdresi_menuyeYonlenir_digerleri404', () => {
  const htaccess = readFileSync(new URL('../public/.htaccess', import.meta.url), 'utf8')
  const kural = /^RedirectMatch 302 (\S+) (\S+)$/m.exec(htaccess)
  assert.ok(kural, 'RedirectMatch 302 satırı yok')
  const [, desen = '', hedef = ''] = kural
  const yonlen = (yol: string) => {
    const es = new RegExp(desen).exec(yol)
    return es ? hedef.replace('$1', es[1] ?? '') : null
  }
  for (let n = 1; n <= MASA_SAYISI; n++) {
    assert.equal(yonlen(`/m/${n}`), `/menu/?masa=${n}`)
    assert.equal(yonlen(`/m/${n}/`), `/menu/?masa=${n}`)
    assert.equal(masaCoz(`?masa=${n}`), n)
  }
  for (const yol of ['/m/0', '/m/31', '/m/07', '/m/', '/m/7/x', '/menu/']) assert.equal(yonlen(yol), null, yol)
})
