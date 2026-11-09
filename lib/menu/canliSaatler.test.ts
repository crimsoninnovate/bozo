import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sozlukHam } from '../../content/index.ts'
import { durumHesapla } from '../saat.ts'
import { saatleriDoldur } from '../saatMetni.ts'
import { canliSaatleriGetir } from './canli.ts'
import { canliSaatleriSec } from './canliSaatler.ts'
import type { Saatler } from './tipler.ts'

const DERLENMIS: Saatler = { acilis: 10, kapanis: 5 }

/** `console.warn` çağrılarını toplar; test çıktısına sızmaz. */
async function uyarilarla<T>(is: () => T | Promise<T>): Promise<{ sonuc: T; uyarilar: unknown[][] }> {
  const uyarilar: unknown[][] = []
  const eski = console.warn
  console.warn = (...a: unknown[]) => void uyarilar.push(a)
  try {
    return { sonuc: await is(), uyarilar }
  } finally {
    console.warn = eski
  }
}

test('canliSaatleriSec_gecerliCanli_onuDondurur', async () => {
  const { sonuc, uyarilar } = await uyarilarla(() =>
    canliSaatleriSec({ saatler: { acilis: 12, kapanis: 3 } }, DERLENMIS),
  )
  assert.deepEqual(sonuc, { acilis: 12, kapanis: 3 })
  assert.equal(uyarilar.length, 0)
})

test('canliSaatleriSec_gecersizCanli_derlenmisiDondurur', async () => {
  const gecersizler: unknown[] = [
    { saatler: { acilis: 20, kapanis: 3 } },
    { saatler: { acilis: 10, kapanis: 9 } },
    { saatler: { acilis: 4, kapanis: 5 } },
    { saatler: { acilis: 5, kapanis: 5 } },
    { saatler: { acilis: 11.5, kapanis: 3 } },
    { saatler: { acilis: '12', kapanis: 3 } },
    { saatler: { acilis: 12, kapanis: 3, fazla: 1 } },
    { saatler: null },
  ]
  for (const belge of gecersizler) {
    const { sonuc, uyarilar } = await uyarilarla(() => canliSaatleriSec(belge, DERLENMIS))
    assert.deepEqual(sonuc, DERLENMIS, JSON.stringify(belge))
    assert.equal(uyarilar.length, 1, JSON.stringify(belge))
  }
})

test('canliSaatleriSec_belgeYokVeyaSaatlerYok_sessizceDerlenmis', async () => {
  for (const belge of [null, undefined, 'x', [], {}]) {
    const { sonuc, uyarilar } = await uyarilarla(() => canliSaatleriSec(belge, DERLENMIS))
    assert.deepEqual(sonuc, DERLENMIS)
    assert.equal(uyarilar.length, 0)
  }
})

function belgeYaniti(belge: unknown): typeof fetch {
  return async () => new Response(JSON.stringify({ surum: 7, belge }), { status: 200 })
}

test('canliSaatleriGetir_canliBelgeSaatleriVar_onuDondurur', async () => {
  const getir = belgeYaniti({ saatler: { acilis: 12, kapanis: 4 } })
  const sonuc = await canliSaatleriGetir('http://a', getir, 1000, DERLENMIS)
  assert.deepEqual(sonuc, { acilis: 12, kapanis: 4 })
})

test('canliSaatleriGetir_204_derlenmisiDondurur', async () => {
  const getir: typeof fetch = async () => new Response(null, { status: 204 })
  assert.deepEqual(await canliSaatleriGetir('http://b', getir, 1000, DERLENMIS), DERLENMIS)
})

test('canliSaatleriGetir_ayniAndaIkiCagri_tekIstek', async () => {
  let istek = 0
  const getir: typeof fetch = async () => {
    istek += 1
    return new Response(JSON.stringify({ surum: 1, belge: { saatler: { acilis: 11, kapanis: 2 } } }), { status: 200 })
  }
  const [a, b] = await Promise.all([
    canliSaatleriGetir('http://c', getir, 1000, DERLENMIS),
    canliSaatleriGetir('http://c', getir, 1000, DERLENMIS),
  ])
  assert.equal(istek, 1)
  assert.deepEqual(a, b)
})

test('canliSaatler_saat11CanliAcilis12_kapaliMetniAcilisiYazar', () => {
  const canli = canliSaatleriSec({ saatler: { acilis: 12, kapanis: 3 } }, DERLENMIS)
  const girne11 = new Date('2026-11-09T09:00:00Z')
  assert.equal(durumHesapla(girne11, DERLENMIS).acik, true)
  assert.equal(durumHesapla(girne11, canli).acik, false)
  assert.equal(
    saatleriDoldur(sozlukHam('tr').ortak.durum.kapali, canli),
    "Şu an kapalıyız, 12:00'de açılıyoruz",
  )
})
