// lib/saat.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { durumHesapla, gosterimGunIndeksi, saatMetni } from './saat.ts'

/** Girne yerel saatini veren yardımcı. Girne yazın UTC+3, kışın UTC+2. */
function girne(iso: string): Date {
  return new Date(iso)
}

test('durum_ogleVakti_aciktir', () => {
  const d = durumHesapla(girne('2026-08-11T12:00:00+03:00'))
  assert.equal(d.acik, true)
  assert.equal(d.gece, false)
  assert.equal(d.saat, 12)
})

test('durum_gecikSaat0230_acikVeGecedir', () => {
  const d = durumHesapla(girne('2026-08-12T02:30:00+03:00'))
  assert.equal(d.acik, true)
  assert.equal(d.gece, true)
})

test('durum_0459_halaAciktir', () => {
  const d = durumHesapla(girne('2026-08-12T04:59:00+03:00'))
  assert.equal(d.acik, true)
  assert.equal(d.gece, true)
})

test('durum_0500_kapalidir', () => {
  const d = durumHesapla(girne('2026-08-12T05:00:00+03:00'))
  assert.equal(d.acik, false)
  assert.equal(d.gece, false)
})

test('durum_0959_kapalidir', () => {
  assert.equal(durumHesapla(girne('2026-08-12T09:59:00+03:00')).acik, false)
})

test('durum_1000_acilir', () => {
  assert.equal(durumHesapla(girne('2026-08-12T10:00:00+03:00')).acik, true)
})

test('durum_0030_geceDegildir_ciftGeceEsigi', () => {
  // gece şeridi 01:00'de başlar, 00:30 henüz gece değil
  const d = durumHesapla(girne('2026-08-12T00:30:00+03:00'))
  assert.equal(d.acik, true)
  assert.equal(d.gece, false)
})

test('gosterimGunu_gececeyariSonrasi_oncekiGunuGosterir', () => {
  // 12 Ağustos 2026 Çarşamba, saat 02:00. Vardiya Salı gecesine ait.
  const gun = gosterimGunIndeksi(girne('2026-08-12T02:00:00+03:00'))
  assert.equal(gun, 2) // Salı
})

test('gosterimGunu_0500Sonrasi_ayniGunuGosterir', () => {
  const gun = gosterimGunIndeksi(girne('2026-08-12T05:00:00+03:00'))
  assert.equal(gun, 3) // Çarşamba
})

test('gosterimGunu_pazartesi0300_pazariGosterir_haftaBasiSarmasi', () => {
  // 10 Ağustos 2026 Pazartesi, saat 03:00 -> Pazar (0)
  assert.equal(gosterimGunIndeksi(girne('2026-08-10T03:00:00+03:00')), 0)
})

test('saatMetni_tekHaneleriIkiHaneYazar', () => {
  const m = saatMetni(durumHesapla(girne('2026-08-11T09:05:00+03:00')))
  assert.deepEqual(m, { saat: '09', dakika: '05' })
})

test('durum_kisSaatiUTCArti2_dogruCevirir', () => {
  // 15 Ocak 2026, Girne UTC+2. UTC 02:30 -> yerel 04:30, hala açık ve gece.
  const d = durumHesapla(new Date('2026-01-15T02:30:00Z'))
  assert.equal(d.saat, 4)
  assert.equal(d.acik, true)
  assert.equal(d.gece, true)
})
