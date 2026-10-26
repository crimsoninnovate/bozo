import assert from 'node:assert/strict'
import { test } from 'node:test'
import { canliOturumu, duyuruGoster, duyuruKarari, girneAnlik, metinOzeti } from './duyuru.ts'
import type { Duyuru, MenuBelgesi } from './tipler.ts'

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

const ZAMAN = new Date('2026-10-26T09:00:00Z')
const belge = (d: Duyuru): MenuBelgesi => ({ duyuru: d }) as MenuBelgesi

test('duyuruKarari_canliYok_bazKalir', () => {
  const baz = duyuru()
  assert.deepEqual(duyuruKarari(baz, null, ZAMAN), baz)
})

test('duyuruKarari_canliVar_canliKazanir', () => {
  const canli = duyuru({ metin: { tr: 'Erken kapanıyoruz', en: 'Closing early' } })
  assert.deepEqual(duyuruKarari(duyuru(), belge(canli), ZAMAN), canli)
})

test('duyuruKarari_canliPasif_bantYok', () => {
  const karar = duyuruKarari(duyuru(), belge(duyuru({ aktif: false })), ZAMAN)
  assert.equal(duyuruGoster(karar, ZAMAN), false)
  assert.equal(karar.aktif, false)
})

test('duyuruKarari_bazSuresiDolmus_canliYokken_bantYok', () => {
  const karar = duyuruKarari(duyuru({ bitis: '2026-10-26T10:00' }), null, new Date('2026-10-26T08:00:00Z'))
  assert.equal(karar.aktif, false)
})

test('metinOzeti_metinDegisince_degisir', () => {
  const a = metinOzeti(duyuru())
  assert.equal(a, metinOzeti(duyuru({ bitis: '2026-12-01T10:00' })))
  assert.notEqual(a, metinOzeti(duyuru({ metin: { tr: 'Bayramda açığız', en: 'Open on holidays' } })))
})

test('canliOturumu_basariliBelge_sonrakiGezintideTekrarDenenmez', () => {
  const o = canliOturumu()
  assert.equal(o.getirmeli(), true)
  o.kaydet(belge(duyuru()))
  assert.equal(o.getirmeli(), false)
  assert.deepEqual(o.belge()?.duyuru, duyuru())
})

test('canliOturumu_ilkIstekBasarisiz_birKezDahaDenerSonraDurur', () => {
  const o = canliOturumu()
  o.kaydet(null)
  assert.equal(o.belge(), null)
  assert.equal(o.getirmeli(), true)
  o.kaydet(null)
  assert.equal(o.getirmeli(), false)
})

test('canliOturumu_oncedenBasarisiz_sonraBasarili_canliKalir', () => {
  const o = canliOturumu()
  o.kaydet(null)
  o.kaydet(belge(duyuru()))
  assert.equal(o.getirmeli(), false)
  assert.notEqual(o.belge(), null)
})

test('canliOturumu_onbellektekiSuresiDolmusDuyuru_karardaGizlenir', () => {
  const o = canliOturumu()
  o.kaydet(belge(duyuru({ bitis: '2026-10-26T10:00' })))
  const sonra = new Date('2026-10-26T08:00:00Z')
  assert.equal(duyuruKarari(duyuru(), o.belge(), sonra).aktif, false)
})
