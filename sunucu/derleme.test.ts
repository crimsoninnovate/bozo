import { test, before, after, mock } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { DerlemeDurumu } from '../lib/menu/aktarim.ts'
import { bellekDepoKur } from './bellekDepo.ts'
import { listeKur } from './ip.ts'
import { uygulamaKur, type Ayar } from './uygulama.ts'

/* `GET`/`POST /yonetim/derleme`: istek dosyası yazılır, durum `durum.json`'dan okunur. */
const KIMLIK = { Authorization: `Basic ${Buffer.from('personel:gizli').toString('base64')}` }

let dizin = ''
let sunucu: Server
let kok = ''
let kapaliSunucu: Server
let kapaliKok = ''

async function sunucuAc(derlemeDizini: string | null): Promise<{ sunucu: Server; kok: string }> {
  const ayar: Ayar = {
    kokenler: ['https://cigercibozo.com'],
    tuz: 'test-tuzu',
    yonetim: { kullanici: 'personel', sifre: 'gizli' },
    guvenilirVekil: listeKur(['127.0.0.1', '::1']),
    kampanyaBitis: null,
    derlemeDizini,
  }
  const uygulama = uygulamaKur(bellekDepoKur(), ayar, Date.now, { warn() {}, error() {} })
  const s = createServer((req, res) => void uygulama.isle(req, res))
  await new Promise<void>((coz) => s.listen(0, '127.0.0.1', coz))
  const adres = s.address()
  if (!adres || typeof adres === 'string') throw new Error('adres yok')
  return { sunucu: s, kok: `http://127.0.0.1:${adres.port}` }
}

before(async () => {
  dizin = await mkdtemp(join(tmpdir(), 'bozo-derleme-'))
  ;({ sunucu, kok } = await sunucuAc(dizin))
  ;({ sunucu: kapaliSunucu, kok: kapaliKok } = await sunucuAc(null))
})

after(async () => {
  sunucu.close()
  kapaliSunucu.close()
  await rm(dizin, { recursive: true, force: true })
})

/** Her test temiz bir dizinle başlar (istek ve durum dosyaları). */
const temizle = async (): Promise<void> => {
  await Promise.all([rm(join(dizin, 'istek'), { force: true }), rm(join(dizin, 'durum.json'), { force: true })])
}

async function cagir(yontem: 'GET' | 'POST', basliklar: Record<string, string> = KIMLIK, taban = kok) {
  const yanit = await fetch(`${taban}/yonetim/derleme`, { method: yontem, headers: basliklar })
  const metin = await yanit.text()
  return { durum: yanit.status, govde: (metin ? JSON.parse(metin) : null) as Record<string, unknown> | null }
}

const durumu = (g: Record<string, unknown> | null) => g?.durum as DerlemeDurumu

test('getDerleme_dosyaYok_bos', async () => {
  await temizle()
  const y = await cagir('GET')
  assert.equal(y.durum, 200)
  assert.deepEqual(durumu(y.govde), { asama: 'bos', surum: null, zaman: null, gunluk: [] })
})

test('postDerleme_istekYok_istekDosyasiYazar_202Sirada', async () => {
  await temizle()
  const y = await cagir('POST')
  assert.equal(y.durum, 202)
  assert.equal(durumu(y.govde).asama, 'sirada')
  assert.match(await readFile(join(dizin, 'istek'), 'utf8'), /^\d{4}-\d\d-\d\dT[\d:.]+Z$/)
})

test('postDerleme_istekVarken_tekDosyaKalir_202', async () => {
  await temizle()
  await cagir('POST')
  const ilk = await readFile(join(dizin, 'istek'), 'utf8')
  const y = await cagir('POST')
  assert.equal(y.durum, 202)
  assert.equal(durumu(y.govde).asama, 'sirada')
  assert.deepEqual((await readdir(dizin)).filter((d) => d === 'istek'), ['istek'])
  assert.equal(await readFile(join(dizin, 'istek'), 'utf8'), ilk)
})

test('getDerleme_derleniyorVeIstekVar_derleniyor', async () => {
  await temizle()
  const durum = { asama: 'derleniyor', surum: 4, zaman: 'z', gunluk: ['a'] }
  await writeFile(join(dizin, 'durum.json'), JSON.stringify(durum))
  await writeFile(join(dizin, 'istek'), '2026-11-09T10:00:00.000Z')
  const y = await cagir('GET')
  assert.deepEqual(durumu(y.govde), durum)
})

test('getDerleme_yayindaVeIstekVar_siradaVeEskiSurumKorunur', async () => {
  await temizle()
  await writeFile(join(dizin, 'durum.json'), JSON.stringify({ asama: 'yayinda', surum: 4, zaman: 'z', gunluk: [] }))
  await writeFile(join(dizin, 'istek'), '2026-11-09T10:00:00.000Z')
  const d = durumu((await cagir('GET')).govde)
  assert.deepEqual([d.asama, d.surum], ['sirada', 4])
})

test('getDerleme_yayindaIstekYok_durumDosyasiAynen', async () => {
  await temizle()
  await writeFile(join(dizin, 'durum.json'), JSON.stringify({ asama: 'hata', surum: null, zaman: null, gunluk: ['x'] }))
  assert.deepEqual(durumu((await cagir('GET')).govde), { asama: 'hata', surum: null, zaman: null, gunluk: ['x'] })
})

test('getDerleme_gunlukIkiYuzSatiriAsar_sonIkiYuzKalir', async () => {
  await temizle()
  const gunluk = Array.from({ length: 250 }, (_, i) => `satir ${i}`)
  await writeFile(join(dizin, 'durum.json'), JSON.stringify({ asama: 'yayinda', surum: 1, zaman: 'z', gunluk }))
  const d = durumu((await cagir('GET')).govde)
  assert.equal(d.gunluk.length, 200)
  assert.deepEqual([d.gunluk[0], d.gunluk[199]], ['satir 50', 'satir 249'])
})

const BOZUKLAR: Array<[string, string]> = [
  ['jsonDegil', '{bozuk'],
  ['asamaBilinmiyor', JSON.stringify({ asama: 'x', surum: null, zaman: null, gunluk: [] })],
  ['surumMetin', JSON.stringify({ asama: 'yayinda', surum: '4', zaman: null, gunluk: [] })],
  ['gunlukSayiIceriyor', JSON.stringify({ asama: 'yayinda', surum: 4, zaman: null, gunluk: [1] })],
  ['alanEksik', JSON.stringify({ asama: 'yayinda' })],
]
for (const [ad, icerik] of BOZUKLAR) {
  test(`getDerleme_durumDosyasiBozuk_${ad}_bosVeBirUyari`, async () => {
    await temizle()
    await writeFile(join(dizin, 'durum.json'), icerik)
    const uyari = mock.method(console, 'warn', () => {})
    try {
      const y = await cagir('GET')
      assert.deepEqual(durumu(y.govde), { asama: 'bos', surum: null, zaman: null, gunluk: [] })
      assert.equal(uyari.mock.callCount(), 1)
      const bagimsiz = (uyari.mock.calls[0]?.arguments ?? []) as unknown[]
      assert.ok(bagimsiz.includes(join(dizin, 'durum.json')), 'uyarı yolu içerir')
    } finally {
      uyari.mock.restore()
    }
  })
}

test('derleme_kimlikYok_401', async () => {
  assert.equal((await cagir('GET', {})).durum, 401)
  assert.equal((await cagir('POST', {})).durum, 401)
})

test('derleme_derlemeDizini_yok_503DerlemeKapali', async () => {
  for (const yontem of ['GET', 'POST'] as const) {
    const y = await cagir(yontem, KIMLIK, kapaliKok)
    assert.deepEqual([y.durum, y.govde?.hata], [503, 'derlemeKapali'])
  }
})

test('getDerleme_cokSayida_yonetimKovasiniYemez_sonrakiPostBasarili', async () => {
  await temizle()
  // 60/saatlik yönetim kovasının üstünde yoklama; panel derleme boyunca ~84 kez sorar.
  for (let i = 0; i < 90; i++) assert.equal((await cagir('GET')).durum, 200, `GET ${i}`)
  assert.equal((await cagir('POST')).durum, 202)
  const siniri = await sunucuAc(dizin)
  try {
    for (let i = 0; i < 60; i++) await cagir('POST', KIMLIK, siniri.kok)
    assert.equal((await cagir('POST', KIMLIK, siniri.kok)).durum, 429, 'yönetim kovası hâlâ 60 ile kesilir')
  } finally {
    siniri.sunucu.close()
  }
})

/** Yanlış parolayla `yol`'a art arda GET atar; ilk 429'un sırasını döner. */
async function ilk429(yol: string, taban: string): Promise<number> {
  const yanlis = { Authorization: `Basic ${Buffer.from('personel:yanlis').toString('base64')}` }
  for (let i = 1; i <= 700; i++) {
    const durum = (await fetch(taban + yol, { headers: yanlis }).then(async (y) => (await y.arrayBuffer(), y.status)))
    if (durum === 429) return i
    assert.equal(durum, 401, `istek ${i}`)
  }
  return -1
}

test('getDerleme_yanlisParola_yonetimKovasinaSayilir_digerUclarlaAyniNoktadaKesilir', async () => {
  const a = await sunucuAc(dizin)
  const b = await sunucuAc(dizin)
  try {
    const derleme = await ilk429('/yonetim/derleme', a.kok)
    const sayac = await ilk429('/yonetim/sayac', b.kok)
    assert.equal(sayac, 61)
    assert.equal(derleme, sayac)
  } finally {
    a.sunucu.close()
    b.sunucu.close()
  }
})
