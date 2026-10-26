import assert from 'node:assert/strict'
import { test } from 'node:test'
import { yonetim } from './yonetim.ts'

/* Menü paneli metinleri `content/CLAUDE.md` kopya kurallarına tabidir (oyun bölümleri eskidir, kapsam dışı). */

function metinler(deger: unknown, yol: string): [string, string][] {
  if (typeof deger === 'string') return [[yol, deger]]
  if (typeof deger !== 'object' || deger === null) return []
  return Object.entries(deger).flatMap(([a, d]) => metinler(d, `${yol}.${a}`))
}

const panel = [...metinler(yonetim.menu, 'menu'), ...metinler(yonetim.hata, 'hata')]

test('yonetimMenuMetinleri_uzunTireVeSapka_yok', () => {
  for (const [yol, s] of panel) {
    assert.doesNotMatch(s, /[—–]/, yol)
    assert.doesNotMatch(s, /[âîûÂÎÛ]/, yol)
  }
})

test('yonetimMenuMetinleri_yasakTerim_yok', () => {
  const yasak = /(?<![\p{L}])(müşteri|bedava|mangal|şef|parça|adet|masa)|7\/24/iu
  for (const [yol, s] of panel) assert.doesNotMatch(s, yasak, yol)
})

test('yonetimMenuMetinleri_tamBuyukHarfliCumle_yok', () => {
  for (const [yol, s] of panel) assert.doesNotMatch(s, /\p{Lu}{4,}/u, yol)
})

test('yonetimMenuMetinleri_yeniSekmeler_tanimli', () => {
  const m = yonetim.menu
  for (const s of ['ikramlar', 'duyuru'] as const) assert.ok(m.sekme[s], s)
  assert.ok(m.tukendi && m.duyuru.aktif && m.ikram.urunEkle && m.eskiSurum && m.belgeOkunamadi)
})

test('yonetimHata_gecerliSurumEski_yazilmis', () => {
  assert.match(yonetim.hata.gecerliSurumEski, /yayınlayın/)
})

test('yonetimMenuMetinleri_sayacSablonu_yok', () => {
  // Sayaç `n/140` koddan gelir; metinde sabit sayı kalmaz.
  for (const [yol, s] of panel) assert.doesNotMatch(s, /\b140\b/, yol)
})
