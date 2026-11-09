import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fotoKaynagi, odakSec } from './fotoKaynagi.ts'

const KOK = 'https://api.cigercibozo.com'

test('fotoKaynagi_belgedeAtamaVarsa_apiAdresiniVeOdagiVerir', () => {
  const belge = { fotograflar: { 'tane-yakin-cekim': { dosya: '0123456789abcdef.webp', odak: '20% 20%' } } }
  assert.deepEqual(fotoKaynagi('tane-yakin-cekim', belge, KOK), {
    src: `${KOK}/foto/0123456789abcdef.webp`,
    odak: '20% 20%',
  })
})

test('fotoKaynagi_belgedeAtamaYoksa_tohumDosyasiniOdaksizVerir', () => {
  assert.deepEqual(fotoKaynagi('tane-yakin-cekim', { fotograflar: {} }, KOK), {
    src: '/foto/tane-yakin-cekim.webp',
    odak: null,
  })
})

test('fotoKaynagi_belgedeVeTohumdaYoksa_nullDoner', () => {
  assert.equal(fotoKaynagi('bozo-portre', { fotograflar: {} }, KOK), null)
})

test('odakSec_belgeOdagiVarsa_propuEzer', () => {
  assert.equal(odakSec('20% 20%', '50% 70%'), '20% 20%')
})

test('odakSec_belgeOdagiNullsa_propKalir', () => {
  assert.equal(odakSec(null, '50% 70%'), '50% 70%')
  assert.equal(odakSec(null, undefined), undefined)
})
