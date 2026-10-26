import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { canliDuyuruGetir, canliMenuGetir, menuKarar } from './canli.ts'
import type { MenuBelgesi } from './tipler.ts'

const varsayilan = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

type Kayit = { url?: string; secenek?: RequestInit }

function yanitla(durum: number, govde: string | null, kayit: Kayit = {}): typeof fetch {
  return async (girdi, secenek) => {
    kayit.url = String(girdi)
    kayit.secenek = secenek
    return new Response(govde, { status: durum })
  }
}

/** `console.warn` çağrılarını toplar; test çıktısına sızmaz. */
async function uyarilarla<T>(is: () => Promise<T>): Promise<{ sonuc: T; uyarilar: unknown[][] }> {
  const uyarilar: unknown[][] = []
  const eski = console.warn
  console.warn = (...a: unknown[]) => void uyarilar.push(a)
  try {
    return { sonuc: await is(), uyarilar }
  } finally {
    console.warn = eski
  }
}

test('canliMenuGetir_204_nullDoner', async () => {
  const { sonuc, uyarilar } = await uyarilarla(() => canliMenuGetir('http://x', yanitla(204, null), 1000))
  assert.equal(sonuc, null)
  assert.equal(uyarilar.length, 0)
})

test('canliMenuGetir_agHatasi_nullDonerVeLoglar', async () => {
  const getir: typeof fetch = async () => {
    throw new TypeError('fetch failed')
  }
  const { sonuc, uyarilar } = await uyarilarla(() => canliMenuGetir('http://x', getir, 1000))
  assert.equal(sonuc, null)
  assert.equal(uyarilar.length, 1)
})

test('canliMenuGetir_bozukJson_null', async () => {
  const { sonuc, uyarilar } = await uyarilarla(() => canliMenuGetir('http://x', yanitla(200, '{bozuk'), 1000))
  assert.equal(sonuc, null)
  assert.equal(uyarilar.length, 1)
})

test('canliMenuGetir_semayaUymayanBelge_null', async () => {
  const bozuk = JSON.stringify({ surum: 3, belge: { kalemler: 'yok' } })
  const { sonuc, uyarilar } = await uyarilarla(() => canliMenuGetir('http://x', yanitla(200, bozuk), 1000))
  assert.equal(sonuc, null)
  assert.equal(uyarilar.length, 1)
})

test('canliMenuGetir_surumSayiDegil_null', async () => {
  const govde = JSON.stringify({ surum: '3', belge: varsayilan })
  const { sonuc, uyarilar } = await uyarilarla(() => canliMenuGetir('http://x', yanitla(200, govde), 1000))
  assert.equal(sonuc, null)
  assert.equal(uyarilar.length, 1)
})

test('canliMenuGetir_hataDurumu429_nullDonerVeDurumuLoglar', async () => {
  const { sonuc, uyarilar } = await uyarilarla(() =>
    canliMenuGetir('http://x', yanitla(429, '{"hata":"cokIstek"}'), 1000),
  )
  assert.equal(sonuc, null)
  assert.equal(uyarilar.length, 1)
  assert.ok(uyarilar[0]?.includes(429))
})

test('canliMenuGetir_zamanAsimi_null', async () => {
  const takilan: typeof fetch = (_girdi, secenek) =>
    new Promise((_coz, red) => {
      secenek?.signal?.addEventListener('abort', () => red(secenek.signal?.reason))
    })
  const { sonuc, uyarilar } = await uyarilarla(() => canliMenuGetir('http://x', takilan, 20))
  assert.equal(sonuc, null)
  assert.equal(uyarilar.length, 1)
})

test('canliMenuGetir_gecerli_belgeyiDoner', async () => {
  const kayit: Kayit = {}
  const govde = JSON.stringify({ surum: 7, belge: varsayilan })
  const { sonuc, uyarilar } = await uyarilarla(() => canliMenuGetir('http://x', yanitla(200, govde, kayit), 1000))
  assert.deepEqual(sonuc, { surum: 7, belge: varsayilan })
  assert.equal(uyarilar.length, 0)
  assert.equal(kayit.url, 'http://x/menu')
  assert.equal(kayit.secenek?.method, 'GET')
})

test('canliMenuGetir_istek_kimliksizVeCerezsiz', async () => {
  const kayit: Kayit = {}
  await uyarilarla(() => canliMenuGetir('http://x', yanitla(204, null, kayit), 1000))
  const basliklar = new Headers(kayit.secenek?.headers)
  assert.equal(basliklar.has('authorization'), false)
  assert.notEqual(kayit.secenek?.credentials, 'include')
})

test('menuKarar_getirilenNull_bazDoner', () => {
  assert.equal(menuKarar(varsayilan, null), varsayilan)
})

test('menuKarar_getirilenGecerli_getirileniDoner', () => {
  const baska = structuredClone(varsayilan)
  assert.equal(menuKarar(varsayilan, { surum: 2, belge: baska }), baska)
})

test('canliMenuGetir_birinciSurumBelgesi_tamIleTamamlanir', async () => {
  const { duyuru: _d, ikramlar: _i, iletisim: _t, ...eski } = structuredClone(varsayilan)
  const govde = JSON.stringify({ surum: 3, belge: eski })
  const { sonuc: yok } = await uyarilarla(() => canliMenuGetir('http://x', yanitla(200, govde), 1000))
  assert.equal(yok, null, 'tam verilmezse v1 belge geçersiz sayılır')
  const { sonuc } = await uyarilarla(() => canliMenuGetir('http://x', yanitla(200, govde), 1000, varsayilan))
  assert.deepEqual(sonuc, { surum: 3, belge: varsayilan })
})

test('canliMenuGetir_ayniAndaIkiCagri_tekIstekAtilir', async () => {
  let istek = 0
  const getir: typeof fetch = async () => {
    istek += 1
    return new Response(JSON.stringify({ surum: 3, belge: varsayilan }), { status: 200 })
  }
  const [a, b] = await Promise.all([
    canliMenuGetir('http://x', getir, 1000, varsayilan),
    canliMenuGetir('http://x', getir, 1000, varsayilan),
  ])
  assert.equal(istek, 1)
  assert.equal(a?.surum, 3)
  assert.equal(b?.surum, 3)
})

test('canliMenuGetir_oncekiBitince_yeniIstekAtilir', async () => {
  let istek = 0
  const getir: typeof fetch = async () => {
    istek += 1
    return new Response(null, { status: 204 })
  }
  await canliMenuGetir('http://x', getir, 1000)
  await canliMenuGetir('http://x', getir, 1000)
  assert.equal(istek, 2)
})

test('canliDuyuruGetir_gecerli_yalnizDuyuruyuDoner', async () => {
  const b = structuredClone(varsayilan)
  b.duyuru = { aktif: true, metin: { tr: 'Bayramda açığız', en: 'Open on the holiday' }, bitis: null }
  const govde = JSON.stringify({ surum: 4, belge: b })
  const { sonuc, uyarilar } = await uyarilarla(() => canliDuyuruGetir('http://x', yanitla(200, govde), 1000))
  assert.deepEqual(sonuc, b.duyuru)
  assert.equal(uyarilar.length, 0)
})

test('canliDuyuruGetir_belgeninGeriKalaniGecersiz_duyuruYineGelir', async () => {
  const duyuru = { aktif: true, metin: { tr: 'Erken kapanıyoruz', en: 'Closing early' }, bitis: null }
  const govde = JSON.stringify({ surum: 4, belge: { kalemler: 'yok', duyuru } })
  const { sonuc } = await uyarilarla(() => canliDuyuruGetir('http://x', yanitla(200, govde), 1000))
  assert.deepEqual(sonuc, duyuru)
})

test('canliDuyuruGetir_birinciSurum_pasifDuyuru', async () => {
  const { duyuru: _d, ikramlar: _i, iletisim: _t, ...eski } = structuredClone(varsayilan)
  const govde = JSON.stringify({ surum: 3, belge: eski })
  const { sonuc } = await uyarilarla(() => canliDuyuruGetir('http://x', yanitla(200, govde), 1000))
  assert.deepEqual(sonuc, { aktif: false, metin: { tr: '', en: '' }, bitis: null })
})

test('canliDuyuruGetir_duyuruGecersizYaDaBelgeNesneDegil_nullVeLoglar', async () => {
  const bozuk = { aktif: true, metin: { tr: '', en: 'x' }, bitis: null }
  for (const belge of [{ ...varsayilan, duyuru: bozuk }, 'metin', null]) {
    const govde = JSON.stringify({ surum: 5, belge })
    const { sonuc, uyarilar } = await uyarilarla(() => canliDuyuruGetir('http://x', yanitla(200, govde), 1000))
    assert.equal(sonuc, null, JSON.stringify(belge).slice(0, 30))
    assert.equal(uyarilar.length, 1)
  }
})

test('canliDuyuruGetir_menuIleAyniAnda_tekIstekAtilir', async () => {
  let istek = 0
  const getir: typeof fetch = async () => {
    istek += 1
    return new Response(JSON.stringify({ surum: 3, belge: varsayilan }), { status: 200 })
  }
  const [menu, duyuru] = await Promise.all([
    canliMenuGetir('http://x', getir, 1000, varsayilan),
    canliDuyuruGetir('http://x', getir, 1000),
  ])
  assert.equal(istek, 1)
  assert.equal(menu?.surum, 3)
  assert.deepEqual(duyuru, varsayilan.duyuru)
})
