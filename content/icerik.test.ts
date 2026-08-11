import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tr } from './tr/index.ts'
import { en } from './en/index.ts'
import { isletme } from './isletme.ts'
import { fotograflar } from './fotograflar.ts'
import { ocaktanUrunler, ikramlar } from './urunler.ts'

/** İç içe nesnenin tüm yaprak yollarını sıralı liste olarak döner. */
function yollar(nesne: unknown, onek = ''): string[] {
  if (typeof nesne !== 'object' || nesne === null) return [onek]
  return Object.entries(nesne)
    .flatMap(([anahtar, deger]) => yollar(deger, onek ? `${onek}.${anahtar}` : anahtar))
    .sort()
}

test('sozluk_trVeEn_ayniAnahtarlariTasir', () => {
  assert.deepEqual(yollar(en), yollar(tr))
})

test('sozluk_hicbirDegerBosDegil', () => {
  const bosOlanlar: string[] = []
  const gez = (nesne: unknown, onek = ''): void => {
    if (typeof nesne === 'string') {
      if (nesne.trim() === '') bosOlanlar.push(onek)
      return
    }
    if (typeof nesne === 'object' && nesne !== null) {
      for (const [k, v] of Object.entries(nesne)) gez(v, onek ? `${onek}.${k}` : k)
    }
  }
  gez(tr)
  gez(en)
  assert.deepEqual(bosOlanlar, [])
})

test('sozluk_emDashIcermez', () => {
  const kirli: string[] = []
  const gez = (nesne: unknown, onek = ''): void => {
    if (typeof nesne === 'string') {
      // U+2014 em dash, kod noktasıyla yazılır: kaynak dosyaya glif gömülmez
      if (nesne.includes('\u2014')) kirli.push(onek)
      return
    }
    if (typeof nesne === 'object' && nesne !== null) {
      for (const [k, v] of Object.entries(nesne)) gez(v, onek ? `${onek}.${k}` : k)
    }
  }
  gez(tr)
  gez(en)
  assert.deepEqual(kirli, [], 'Marka kuralı: em dash kullanılmaz')
})

test('isletme_bilinmeyenAlanlarNullDur', () => {
  assert.equal(isletme.telefon, null)
  assert.equal(isletme.whatsapp, null)
  assert.equal(isletme.instagram, null)
  assert.equal(isletme.eposta, null)
  assert.equal(isletme.koordinat, null)
})

test('isletme_dogrulanmisAlanlarDoludur', () => {
  assert.equal(isletme.ad, 'Ciğerci Bozo')
  assert.equal(isletme.cadde, 'Naci Talat Caddesi')
  assert.equal(isletme.sehir, 'Girne')
  assert.equal(isletme.alkolServisi, false)
})

test('urunler_ocaktanBesUrundur', () => {
  assert.equal(ocaktanUrunler.length, 5)
  assert.deepEqual(
    ocaktanUrunler.map((u) => u.id),
    ['ciger', 'dalak', 'yurek', 'kuzu-sis', 'terbiyesiz-tavuk-sis'],
  )
})

test('ikramlar_fiyatTasimaz', () => {
  assert.equal(ikramlar.length, 2)
  for (const i of ikramlar) assert.equal('fiyat' in i, false)
})

test('fotograflar_hicbiriHenuzDosyaTasimaz', () => {
  for (const [id, foto] of Object.entries(fotograflar)) {
    assert.equal(foto.dosya, undefined, `${id} için fotoğraf henüz çekilmedi`)
    assert.ok(foto.etiket.length > 0)
  }
})
