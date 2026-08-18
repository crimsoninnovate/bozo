// lib/sis.test.ts
//
// Şiş işaretinin ölçüleri marka kararıyla kilitli
// (design_handoff_bozo_website/marka/01-Logo-Final-Karar.md, "Yapı, kilitlenen
// ölçüler"). Bu testler o tabloyu koda bağlar: oran ya da dizilim kayarsa
// derleme değil, bu dosya söyler.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sisGeometrisi, SIS_ORANLARI, SIS_DIZILIMI } from './sis.ts'

const yakin = (a: number, b: number, pay = 1e-9) => assert.ok(Math.abs(a - b) < pay, `${a} != ${b}`)

test('sis_dizilim_cigerYagCigerCigerYagCiger', () => {
  assert.deepEqual([...SIS_DIZILIMI], [true, false, true, true, false, true])
  const g = sisGeometrisi(10)
  assert.deepEqual(g.taneler.map((t) => t.ciger), [true, false, true, true, false, true])
})

test('sis_yagTanesi_buyugun06Kati', () => {
  const g = sisGeometrisi(10)
  const buyuk = g.taneler.find((t) => t.ciger)!
  const kucuk = g.taneler.find((t) => !t.ciger)!
  yakin(kucuk.kenar / buyuk.kenar, SIS_ORANLARI.yag)
  yakin(SIS_ORANLARI.yag, 0.6)
})

test('sis_bosluk_043x_herAralikta', () => {
  const g = sisGeometrisi(10)
  for (let i = 1; i < g.taneler.length; i++) {
    const onceki = g.taneler[i - 1]!
    yakin(g.taneler[i]!.x - (onceki.x + onceki.kenar), 0.43 * 10)
  }
})

test('sis_cubuk_013x_veEnInceOge', () => {
  const g = sisGeometrisi(10)
  yakin(g.cubuk.boy, 0.13 * 10)
  yakin(g.halka.kalinlik, g.cubuk.boy)
  const enKucukTane = Math.min(...g.taneler.map((t) => t.kenar))
  assert.ok(g.cubuk.boy < enKucukTane)
  assert.ok(g.cubuk.boy < g.halka.cap)
})

test('sis_uc_12x_halka_07x', () => {
  const g = sisGeometrisi(10)
  yakin(g.uc.uzunluk, 1.2 * 10)
  yakin(g.halka.cap, 0.7 * 10)
})

test('sis_herTane_cubukEksenindeOrtali', () => {
  const g = sisGeometrisi(10)
  yakin(g.cubuk.y + g.cubuk.boy / 2, g.eksen)
  for (const t of g.taneler) yakin(t.y + t.kenar / 2, g.eksen)
  yakin(g.halka.cy, g.eksen)
})

test('sis_toplamEn_olcuyleOrantili', () => {
  const on = sisGeometrisi(10)
  const yirmi = sisGeometrisi(20)
  yakin(yirmi.en, on.en * 2)
  yakin(on.boy, 10)
  // uç + boşluk + 4 büyük + 2 küçük + 6 boşluk + halka
  yakin(on.en, 12 + 4.3 + 40 + 12 + 6 * 4.3 + 7)
})
