import assert from 'node:assert/strict'
import { test } from 'node:test'
import { HazirlamaHatasi, hedefBoyut, kodla, odakKaydir, odakNoktasi } from './fotoHazirla.ts'

test('hedefBoyut_yatayUzunKenarSiniriAsar_oranKorunarakKuculur', () => {
  assert.deepEqual(hedefBoyut(4000, 3000), { en: 2000, boy: 1500 })
})

test('hedefBoyut_sinirAltinda_buyutulmez', () => {
  assert.deepEqual(hedefBoyut(1200, 1600), { en: 1200, boy: 1600 })
})

test('hedefBoyut_kare_ikiKenarSinira', () => {
  assert.deepEqual(hedefBoyut(3000, 3000), { en: 2000, boy: 2000 })
})

test('hedefBoyut_dikeyVeKesirli_yuvarlanirSiniriAsmaz', () => {
  assert.deepEqual(hedefBoyut(3024, 4032), { en: 1500, boy: 2000 })
  assert.deepEqual(hedefBoyut(1001, 3001, 1000), { en: 334, boy: 1000 })
})

test('odakNoktasi_dokunusYuzdeye_yuvarlanirVeSinirlanir', () => {
  assert.equal(odakNoktasi(50, 70, 200, 100), '25% 70%')
  assert.equal(odakNoktasi(33.3, 66.6, 100, 100), '33% 67%')
  assert.equal(odakNoktasi(-5, 120, 100, 100), '0% 100%')
})

test('odakNoktasi_dogrulayicininBicimiyleUyumlu', () => {
  for (const [x, y] of [[0, 0], [100, 100], [7, 93]] as const) {
    assert.match(odakNoktasi(x, y, 100, 100), /^(100|[1-9]?\d)% (100|[1-9]?\d)%$/)
  }
})

/** `toBlob` taklidi: tarayıcının gerçekte döndürdüğü tür `desteklenen` listesinde değilse PNG verir. */
function sahteKodlayici(desteklenen: string[], kayit: Array<[string, number]> = []) {
  return async (tur: string, kalite: number): Promise<Blob | null> => {
    kayit.push([tur, kalite])
    return new Blob([new Uint8Array([1])], { type: desteklenen.includes(tur) ? tur : 'image/png' })
  }
}

test('kodla_webpDestekleniyor_webpDonerJpegDenenmez', async () => {
  const kayit: Array<[string, number]> = []
  const blob = await kodla(sahteKodlayici(['image/webp', 'image/jpeg'], kayit), 'hata')
  assert.equal(blob.type, 'image/webp')
  assert.deepEqual(kayit, [['image/webp', 0.82]])
})

test('kodla_webpYerinePngGelir_jpegle085KaliteyleYenilenir', async () => {
  const kayit: Array<[string, number]> = []
  const blob = await kodla(sahteKodlayici(['image/jpeg'], kayit), 'hata')
  assert.equal(blob.type, 'image/jpeg')
  assert.deepEqual(kayit, [['image/webp', 0.82], ['image/jpeg', 0.85]])
})

test('kodla_ikiBicimdeBasarisiz_kodlanamadiMetniyleHataFirlatir', async () => {
  await assert.rejects(
    kodla(sahteKodlayici([]), 'Kodlanamadı.'),
    (h) => h instanceof HazirlamaHatasi && h.message === 'Kodlanamadı.',
  )
  await assert.rejects(kodla(async () => null, 'Kodlanamadı.'), HazirlamaHatasi)
})

test('odakKaydir_okTusu_adimKadarKaydirirVeSinirdaDurur', () => {
  assert.equal(odakKaydir(null, 5, 0), '55% 50%')
  assert.equal(odakKaydir('10% 20%', -5, 5), '5% 25%')
  assert.equal(odakKaydir('2% 99%', -5, 5), '0% 100%')
})

test('odakKaydir_bozukOdak_ortadanBaslar', () => {
  assert.equal(odakKaydir('sol üst', 0, -5), '50% 45%')
})
