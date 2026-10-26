import assert from 'node:assert/strict'
import { test } from 'node:test'
import { duyuruGoster, girneAnlik } from './duyuru.ts'
import type { Duyuru } from './tipler.ts'

const duyuru = (degisiklik: Partial<Duyuru> = {}): Duyuru => ({
  aktif: true,
  metin: { tr: 'Bayramda açığız', en: 'Open on the holiday' },
  bitis: null,
  ...degisiklik,
})

// Yaz saati (UTC+3) 25 Ekim 2026'da biter; yaz örnekleri 24 Ekim ve öncesinden seçilir.
test('girneAnlik_utc2130_ertesiGun0030', () => {
  assert.equal(girneAnlik(new Date('2026-07-01T21:30:00Z')), '2026-07-02T00:30')
})

test('girneAnlik_kisOfseti_utcArtiIki', () => {
  assert.equal(girneAnlik(new Date('2026-12-15T22:30:00Z')), '2026-12-16T00:30')
})

test('duyuruGoster_bitisGecmis_false', () => {
  const d = duyuru({ bitis: '2026-07-01T12:00' })
  assert.equal(duyuruGoster(d, new Date('2026-07-01T09:00:00Z')), false)
})

test('duyuruGoster_bitisGelecek_true', () => {
  const d = duyuru({ bitis: '2026-07-01T12:00' })
  assert.equal(duyuruGoster(d, new Date('2026-07-01T08:59:00Z')), true)
})

test('duyuruGoster_bitisYok_true', () => {
  assert.equal(duyuruGoster(duyuru(), new Date('2030-01-01T00:00:00Z')), true)
})

test('duyuruGoster_pasif_false', () => {
  assert.equal(duyuruGoster(duyuru({ aktif: false }), new Date('2026-10-26T09:00:00Z')), false)
})

test('duyuruGoster_kisSaatiUtcArtiIki_dogruKarar', () => {
  const d = duyuru({ bitis: '2026-12-16T00:30' })
  assert.equal(duyuruGoster(d, new Date('2026-12-15T22:29:00Z')), true)
  assert.equal(duyuruGoster(d, new Date('2026-12-15T22:30:00Z')), false)
})

test('duyuruGoster_metinBos_false', () => {
  assert.equal(duyuruGoster(duyuru({ metin: { tr: '  ', en: 'x' } }), new Date('2026-10-26T09:00:00Z')), false)
})

test('duyuruGoster_bitisGirneGecesindeUtcFarkli_dogruKarar', () => {
  // Bitiş 00:30 Girne = önceki günün 21:30 UTC'si; UTC'ye bakan kod bandı üç saat geç kaldırırdı.
  const d = duyuru({ bitis: '2026-07-02T00:30' })
  assert.equal(duyuruGoster(d, new Date('2026-07-01T21:29:00Z')), true)
  assert.equal(duyuruGoster(d, new Date('2026-07-01T21:30:00Z')), false)
})
