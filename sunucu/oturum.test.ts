import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createServer, type Server } from 'node:http'
import { bellekDepoKur } from './bellekDepo.ts'
import { listeKur } from './ip.ts'
import { OTURUM_SURESI_MS, oturumAnahtariGecerliMi, oturumAnahtariUret } from './oturum.ts'
import { uygulamaKur } from './uygulama.ts'

/* Personel oturum anahtarı: imzalı, durumsuz, 30 gün; şifre ya da tuz değişince hepsi düşer. */
const KIMLIK = { kullanici: 'personel', sifre: 'gizli' }
const TUZ = 'test-tuzu'
const DAKIKA_MS = 60_000
let saat = Date.parse('2026-10-26T12:00:00Z')

let sunucu: Server
let kok = ''

before(async () => {
  const uygulama = uygulamaKur(
    bellekDepoKur(),
    {
      kokenler: ['https://cigercibozo.com'],
      tuz: TUZ,
      yonetim: KIMLIK,
      guvenilirVekil: listeKur(['127.0.0.1', '::1']),
      kampanyaBitis: null,
    },
    () => saat,
    { warn() {}, error: console.error },
  )
  sunucu = createServer((req, res) => void uygulama.isle(req, res))
  await new Promise<void>((coz) => sunucu.listen(0, '127.0.0.1', coz))
  const adres = sunucu.address()
  if (!adres || typeof adres === 'string') throw new Error('adres yok')
  kok = `http://127.0.0.1:${adres.port}`
})

after(() => sunucu.close())

const temel = (k: string, s: string) => `Basic ${Buffer.from(`${k}:${s}`).toString('base64')}`
const TEMEL = temel(KIMLIK.kullanici, KIMLIK.sifre)

async function istek(yol: string, yetki?: string, yontem = 'GET') {
  const yanit = await fetch(kok + yol, { method: yontem, headers: yetki ? { Authorization: yetki } : {} })
  const metin = await yanit.text()
  const govde = metin ? (JSON.parse(metin) as Record<string, unknown>) : null
  return { durum: yanit.status, govde, basliklar: yanit.headers }
}

async function anahtarAl(): Promise<{ anahtar: string; bitis: string }> {
  const yanit = await istek('/yonetim/oturum', TEMEL, 'POST')
  assert.equal(yanit.durum, 200)
  return yanit.govde as { anahtar: string; bitis: string }
}

const bearerIle = (anahtar: string) => istek('/yonetim/tarama', `Bearer ${anahtar}`)

test('oturum_temelKimlikle_anahtarVeBitisDoner', async () => {
  const { anahtar, bitis } = await anahtarAl()
  assert.match(anahtar, /^\d{13}\.[0-9a-f]{64}$/)
  assert.equal(bitis, new Date(saat + OTURUM_SURESI_MS).toISOString())
  assert.equal(anahtar, oturumAnahtariUret(TUZ, KIMLIK, saat + OTURUM_SURESI_MS))
})

test('oturum_gecerliBearer_yonetimUcunuAcar', async () => {
  const { anahtar } = await anahtarAl()
  assert.equal((await bearerIle(anahtar)).durum, 200)
})

test('oturum_bearerIleYeniAnahtarAlinamaz_401', async () => {
  const { anahtar } = await anahtarAl()
  const yanit = await istek('/yonetim/oturum', `Bearer ${anahtar}`, 'POST')
  assert.equal(yanit.durum, 401)
  assert.equal(yanit.basliklar.get('www-authenticate'), 'Basic realm="yonetim"')
})

test('oturum_kimliksizVeYanlisSifre_401', async () => {
  assert.equal((await istek('/yonetim/oturum', undefined, 'POST')).durum, 401)
  assert.equal((await istek('/yonetim/oturum', temel('personel', 'yanlis'), 'POST')).durum, 401)
})

test('oturum_temelKimlik_hepYonetimUcundaCalisir', async () => {
  assert.equal((await istek('/yonetim/tarama', TEMEL)).durum, 200)
})

test('oturum_suresiDolmus_401', async () => {
  const { anahtar } = await anahtarAl()
  saat += OTURUM_SURESI_MS + DAKIKA_MS
  try {
    const yanit = await bearerIle(anahtar)
    assert.equal(yanit.durum, 401)
    assert.deepEqual(yanit.govde, { hata: 'kimlikGerekli' })
  } finally {
    saat -= OTURUM_SURESI_MS + DAKIKA_MS
  }
})

test('oturum_imzaBozuk_401', async () => {
  const { anahtar } = await anahtarAl()
  const sonKarakter = anahtar.endsWith('0') ? '1' : '0'
  assert.equal((await bearerIle(anahtar.slice(0, -1) + sonKarakter)).durum, 401)
  const [bitis, imza] = anahtar.split('.')
  assert.equal((await bearerIle(`${Number(bitis) + 1}.${imza}`)).durum, 401)
})

test('oturum_biciminBozuk_401', async () => {
  const { anahtar } = await anahtarAl()
  const [bitis, imza] = anahtar.split('.') as [string, string]
  const kotuler = ['', 'x', bitis, `${bitis}.`, `.${imza}`, `${bitis}.${imza.toUpperCase()}`, `${bitis}.${imza}0`]
  for (const kotu of [...kotuler, `1.5.${imza}`]) {
    assert.equal((await bearerIle(kotu)).durum, 401, kotu)
  }
})

test('oturum_gelecekteFazlaUzak_401', () => {
  const uzak = saat + OTURUM_SURESI_MS + 2 * DAKIKA_MS
  const anahtar = oturumAnahtariUret(TUZ, KIMLIK, uzak)
  assert.equal(oturumAnahtariGecerliMi(TUZ, KIMLIK, `Bearer ${anahtar}`, saat), false)
  const sinirda = oturumAnahtariUret(TUZ, KIMLIK, saat + OTURUM_SURESI_MS + DAKIKA_MS)
  assert.equal(oturumAnahtariGecerliMi(TUZ, KIMLIK, `Bearer ${sinirda}`, saat), true)
})

test('oturum_eskiSifreyleImzali_401', async () => {
  const eski = oturumAnahtariUret(TUZ, { ...KIMLIK, sifre: 'eski' }, saat + OTURUM_SURESI_MS)
  assert.equal((await bearerIle(eski)).durum, 401)
  const baskaTuz = oturumAnahtariUret('baska-tuz', KIMLIK, saat + OTURUM_SURESI_MS)
  assert.equal((await bearerIle(baskaTuz)).durum, 401)
  const baskaKullanici = oturumAnahtariUret(TUZ, { ...KIMLIK, kullanici: 'baska' }, saat + OTURUM_SURESI_MS)
  assert.equal((await bearerIle(baskaKullanici)).durum, 401)
})
