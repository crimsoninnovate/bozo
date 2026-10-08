import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ustaOyna } from './deneme.ts'
import { simule } from './motor.ts'
import type { Girdi } from './tipler.ts'

test('simule_siraDisiAralikDisiYaDaKesirliTik_hataVerir', () => {
  assert.throws(() => simule(1, [[5, 's0'], [4, 's0']]), RangeError)
  assert.throws(() => simule(1, [[7200, 's0']]), RangeError)
  assert.throws(() => simule(1, [[-1, 's0']]), RangeError)
  assert.throws(() => simule(1, [[1.5, 's0']]), RangeError)
})

test('simule_ayniTohumVeGirdi_herSeferindeAyniSonuc', () => {
  const kayit = ustaOyna(77, 'usta')
  assert.deepEqual(simule(77, kayit), simule(77, kayit))
})

test('simule_bitistenSonrakiGirdiler_yokSayilir', () => {
  const kayit = ustaOyna(2026, 'siradan')
  const sonuc = simule(2026, kayit)
  assert.equal(sonuc.bitti, 'ucSofra')
  const fazla: Girdi[] = [...kayit, [sonuc.tik + 10, 'ciger']]
  assert.deepEqual(simule(2026, fazla), sonuc)
})

/*
 * Altın kayıtlar: sabit tohum ve otomatik oyuncu, sabit sonuç. Kural, ayar ya da
 * oyuncu değişince bilerek kırılır; yeni değer bilinçli olarak yazılır.
 */
test('altin_tohum1_usta', () => {
  assert.deepEqual(simule(1, ustaOyna(1, 'usta')), {
    puan: 40470,
    ozet: { sofra: 22, sis: 48, tamKivam: 36, enUzunKombo: 22, kalkan: 1 },
    bitti: 'gece',
    tik: 7200,
  })
})

test('altin_tohum1_acemi', () => {
  assert.deepEqual(simule(1, ustaOyna(1, 'acemi')), {
    puan: 30769,
    ozet: { sofra: 22, sis: 46, tamKivam: 0, enUzunKombo: 20, kalkan: 1 },
    bitti: 'gece',
    tik: 7200,
  })
})

test('altin_tohum2026_siradan', () => {
  assert.deepEqual(simule(2026, ustaOyna(2026, 'siradan')), {
    puan: 10001,
    ozet: { sofra: 15, sis: 32, tamKivam: 0, enUzunKombo: 12, kalkan: 3 },
    bitti: 'ucSofra',
    tik: 6504,
  })
})

/*
 * Zorluk bandı (plan 1, Görev 5): saniyede 4 dokunan kusursuz usta gecelerin en az
 * %90'ını tamamlar; saniyede 1,5 dokunan sıradan oyuncu en fazla %30'unu. Ayar
 * değişikliği bu bandın dışına düşerse oyun ya yapılamaz ya baskısız hale gelmiştir.
 */
test('zorlukBandi_ustaTamamlar_siradanTamamlayamaz', () => {
  const tohumlar = Array.from({ length: 40 }, (_, i) => i + 1)
  const tamamlayan = (beceri: 'usta' | 'siradan'): number =>
    tohumlar.filter((t) => simule(t, ustaOyna(t, beceri)).bitti === 'gece').length
  assert.ok(tamamlayan('usta') >= 36, 'usta gecelerin %90ından azını tamamlıyor')
  assert.ok(tamamlayan('siradan') <= 12, 'sıradan oyuncu gecelerin %30undan fazlasını tamamlıyor')
})
