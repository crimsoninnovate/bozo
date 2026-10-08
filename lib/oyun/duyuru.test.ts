import { test } from 'node:test'
import assert from 'node:assert/strict'
import { duyurucuKur, duyuruSec } from './duyuru.ts'
import type { Olay } from './tipler.ts'

test('duyuruSec_onemliOlayYoksa_null', () => {
  const olaylar: Olay[] = [
    { tur: 'sofraGeldi', sofra: 0 },
    { tur: 'sisKondu', yuva: 0, urun: 'ciger' },
    { tur: 'evre', evre: 2 },
    { tur: 'sofraKalkti', sofra: 1, odedi: true },
  ]
  assert.equal(duyuruSec(olaylar), null)
})

test('duyuruSec_ayniKaredeBirkacOlay_enOnemlisiSecilir', () => {
  const olaylar: Olay[] = [
    { tur: 'sisYandi', yuva: 2 },
    { tur: 'fisTamam', sofra: 0, odeme: 640 },
    { tur: 'sofraKalkti', sofra: 1, odedi: false },
    { tur: 'sogudu', tezgah: 0 },
  ]
  assert.deepEqual(duyuruSec(olaylar), { anahtar: 'sofraKalkti' })
  assert.deepEqual(duyuruSec([{ tur: 'fisTamam', sofra: 0, odeme: 640 }]), { anahtar: 'fisTamam', puan: 640 })
  assert.deepEqual(duyuruSec([{ tur: 'evre', evre: 4 }, { tur: 'porsiyon' }]), { anahtar: 'sonSaat' })
})

test('duyurucu_saniyedeEnCokBir_aradakilerinEnOnemlisiBekler', () => {
  const d = duyurucuKur(1000)
  assert.equal(d.al(0), null)
  d.ekle({ anahtar: 'fisTamam', puan: 100 })
  assert.deepEqual(d.al(0), { anahtar: 'fisTamam', puan: 100 })
  d.ekle({ anahtar: 'sogudu' })
  d.ekle({ anahtar: 'sisYandi' })
  d.ekle({ anahtar: 'sogudu' })
  assert.equal(d.al(999), null)
  assert.deepEqual(d.al(1000), { anahtar: 'sisYandi' })
  assert.equal(d.al(2500), null)
})

test('duyurucu_esitOncelikteSonGelenKazanir', () => {
  const d = duyurucuKur(1000)
  d.ekle({ anahtar: 'fisTamam', puan: 100 })
  d.ekle({ anahtar: 'fisTamam', puan: 300 })
  assert.deepEqual(d.al(5000), { anahtar: 'fisTamam', puan: 300 })
})
