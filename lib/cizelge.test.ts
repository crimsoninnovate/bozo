import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cizelgeSaatleri } from './cizelge.ts'

test('cizelgeSaatleri_varsayilanSaatler_bugunkuDiziyiVerir', () => {
  assert.deepEqual(cizelgeSaatleri({ acilis: 10, kapanis: 5 }), [
    '10:00', '13:00', '16:00', '19:00', '22:00', '01:00', '04:00',
  ])
})

test('cizelgeSaatleri_ozelSaatler_acilistanKapanistanBirSaatOnceyeTamSaatlerVerir', () => {
  const etiketler = cizelgeSaatleri({ acilis: 12, kapanis: 4 })
  assert.equal(etiketler.length, 7)
  assert.equal(etiketler[0], '12:00')
  assert.equal(etiketler.at(-1), '03:00')
  const saatler = etiketler.map((e) => {
    assert.match(e, /^\d{2}:00$/)
    const saat = Number(e.slice(0, 2))
    return saat < 12 ? saat + 24 : saat
  })
  for (let i = 1; i < saatler.length; i++) {
    assert.ok((saatler[i] ?? 0) > (saatler[i - 1] ?? 0), `${etiketler.join(', ')} artan değil`)
  }
})
