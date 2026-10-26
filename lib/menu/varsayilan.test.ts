import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import type { Cift, MenuBelgesi } from './tipler.ts'

const belge = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

function kalem(id: string) {
  const bulunan = belge.kalemler.find((k) => k.id === id)
  assert.ok(bulunan, `kalem yok: ${id}`)
  return bulunan
}

test('varsayilan_bugunkuMenuyuTasir', () => {
  assert.deepEqual(
    belge.kalemler.map((k) => k.id),
    ['ciger', 'dalak', 'yurek', 'terbiyeli-tavuk-sis', 'terbiyesiz-tavuk-sis', 'terbiyeli-kusbasi', 'bozo-karisik'],
  )
  assert.deepEqual(kalem('ciger').fiyatlar, { porsiyon: 690, durum: 690 })
  assert.deepEqual(kalem('terbiyeli-kusbasi').fiyatlar, { porsiyon: 850, durum: 850 })
  assert.equal(belge.ozel.fiyat, 900)
  assert.deepEqual(
    belge.icecekler.map((i) => i.id),
    ['kola', 'kolaZero', 'fanta', 'cappy', 'ayran', 'su'],
  )
  const ayran = belge.icecekler.find((i) => i.id === 'ayran')
  assert.deepEqual(ayran?.olculer.map((o) => o.fiyat), [40, 30, 50])
})

test('varsayilan_trVeEnAlanlariDoludur', () => {
  const dolu = (c: Cift, yol: string) => {
    assert.ok(c.tr.trim() !== '', `${yol}.tr bos`)
    assert.ok(c.en.trim() !== '', `${yol}.en bos`)
  }
  const bos = (c: Cift | null, yol: string) => {
    if (c !== null) dolu(c, yol)
  }
  for (const k of belge.kalemler) {
    dolu(k.ad, `${k.id}.ad`)
    bos(k.aciklama, `${k.id}.aciklama`)
    bos(k.porsiyonNotu, `${k.id}.porsiyonNotu`)
    bos(k.durumNotu, `${k.id}.durumNotu`)
  }
  dolu(belge.ozel.ad, 'ozel.ad')
  dolu(belge.ozel.miktarNotu, 'ozel.miktarNotu')
  dolu(belge.ozel.aciklama, 'ozel.aciklama')
  for (const i of belge.icecekler) {
    dolu(i.ad, `${i.id}.ad`)
    i.olculer.forEach((o, n) => dolu(o.ad, `${i.id}.olculer[${n}].ad`))
  }
})
