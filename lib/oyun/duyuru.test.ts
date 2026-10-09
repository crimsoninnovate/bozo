import { test } from 'node:test'
import assert from 'node:assert/strict'
import { duyurucuKur, duyuruSec } from './duyuru.ts'
import type { Olay } from './tipler.ts'

test('duyuruSec_onemliOlayYoksa_null', () => {
  const olaylar: Olay[] = [
    { tur: 'misafirGeldi', yer: 0 },
    { tur: 'sisKondu', yuva: 0, urun: 'ciger' },
    { tur: 'evre', evre: 2 },
    { tur: 'misafirKalkti', yer: 1, odedi: true },
  ]
  assert.equal(duyuruSec(olaylar), null)
})

test('duyuruSec_ayniKaredeBirkacOlay_enOnemlisiSecilir', () => {
  const olaylar: Olay[] = [
    { tur: 'sisYandi', yuva: 2 },
    { tur: 'teslim', yer: 0, no: 0, hesap: 640 },
    { tur: 'misafirKalkti', yer: 1, odedi: false },
    { tur: 'paraSoldu', yer: 0 },
  ]
  assert.deepEqual(duyuruSec(olaylar), { anahtar: 'misafirKalkti' })
  assert.deepEqual(duyuruSec([{ tur: 'teslim', yer: 1, no: 0, hesap: 640 }]), { anahtar: 'teslim', no: 2, puan: 640 })
  assert.deepEqual(duyuruSec([{ tur: 'tutuldu', el: { tur: 'eslikci', urun: 'domates' } }]), { anahtar: 'elde', urun: 'domates' })
  assert.deepEqual(duyuruSec([{ tur: 'evre', evre: 4 }, { tur: 'yanlisTabak', yer: 0, no: 0 }]), { anahtar: 'sonSaat' })
})

test('duyurucu_saniyedeEnCokBir_aradakilerinEnOnemlisiBekler', () => {
  const d = duyurucuKur(1000)
  assert.equal(d.al(0), null)
  d.ekle({ anahtar: 'bahsis', puan: 100 })
  assert.deepEqual(d.al(0), { anahtar: 'bahsis', puan: 100 })
  d.ekle({ anahtar: 'paraSoldu' })
  d.ekle({ anahtar: 'sisYandi' })
  d.ekle({ anahtar: 'paraSoldu' })
  assert.equal(d.al(999), null)
  assert.deepEqual(d.al(1000), { anahtar: 'sisYandi' })
  assert.equal(d.al(2500), null)
})

test('duyurucu_esitOncelikteSonGelenKazanir', () => {
  const d = duyurucuKur(1000)
  d.ekle({ anahtar: 'bahsis', puan: 100 })
  d.ekle({ anahtar: 'bahsis', puan: 300 })
  assert.deepEqual(d.al(5000), { anahtar: 'bahsis', puan: 300 })
})

test('duyuruSec_tabakTutulurGeriDonerYaDaDolar_duyurulur', () => {
  assert.deepEqual(duyuruSec([{ tur: 'tutuldu', el: { tur: 'tabak', no: 1 } }]), { anahtar: 'tabakElde', no: 2 })
  assert.deepEqual(duyuruSec([{ tur: 'birakildi', el: { tur: 'tabak', no: 0 } }]), { anahtar: 'tabakDondu', no: 1 })
  assert.deepEqual(duyuruSec([{ tur: 'tabakDolu', no: 1 }]), { anahtar: 'tabakDolu', no: 2 })
})

test('duyuruSec_sisBirakilinca_duyurulmaz', () => {
  assert.equal(duyuruSec([{ tur: 'birakildi', el: { tur: 'sis', yuva: 0, urun: 'ciger', kalite: 'tam' } }]), null)
})
