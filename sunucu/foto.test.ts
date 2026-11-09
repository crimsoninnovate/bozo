import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdtemp, readdir, readFile, rm, stat, utimes } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { FotoYukleYaniti } from '../lib/menu/aktarim.ts'
import { bellekDepoKur } from './bellekDepo.ts'
import { FOTO_GOVDE_SINIRI, jpegBoyutu, webpBoyutu } from './foto.ts'
import { listeKur } from './ip.ts'
import { uygulamaKur, type Ayar } from './uygulama.ts'

/* `POST /yonetim/foto`: WebP ve JPEG doğrulama, içerik adı, atomik yazım.
   Görüntü kütüphanesi yok, baytlar elle kurulur. */
const KOKEN = 'https://cigercibozo.com'
const kimlik = { Authorization: `Basic ${Buffer.from('personel:gizli').toString('base64')}` }
const WEBP = { 'Content-Type': 'image/webp' }
const JPEG = { 'Content-Type': 'image/jpeg' }

const depo = bellekDepoKur()
let dizin = ''
let sunucu: Server
let kok = ''
let kapaliSunucu: Server
let kapaliKok = ''

/** RIFF kabuğu: `RIFF`, boyut, `WEBP`, tek parça. */
function riff(parca: string, yuk: Buffer): Buffer {
  const baslik = Buffer.alloc(20)
  baslik.write('RIFF', 0, 'ascii')
  baslik.writeUInt32LE(12 + yuk.length, 4)
  baslik.write('WEBP', 8, 'ascii')
  baslik.write(parca, 12, 'ascii')
  baslik.writeUInt32LE(yuk.length, 16)
  return Buffer.concat([baslik, yuk])
}

function vp8(en: number, boy: number, ek = 0): Buffer {
  const yuk = Buffer.alloc(10 + ek)
  yuk.set([0x10, 0x00, 0x00, 0x9d, 0x01, 0x2a])
  yuk.writeUInt16LE(en, 6)
  yuk.writeUInt16LE(boy, 8)
  return riff('VP8 ', yuk)
}

function vp8l(en: number, boy: number): Buffer {
  const yuk = Buffer.alloc(10)
  yuk[0] = 0x2f
  yuk.writeUInt32LE((en - 1) | ((boy - 1) << 14), 1)
  return riff('VP8L', yuk)
}

function vp8x(en: number, boy: number): Buffer {
  const yuk = Buffer.alloc(10)
  yuk.writeUIntLE(en - 1, 4, 3)
  yuk.writeUIntLE(boy - 1, 7, 3)
  return riff('VP8X', yuk)
}

const ad = (veri: Buffer, uzanti = 'webp'): string =>
  `${createHash('sha256').update(veri).digest('hex').slice(0, 16)}.${uzanti}`

/** SOI, APP0 (JFIF), SOF (`sof` işaretçisi), EOI: boyutları okumaya yeten en küçük JPEG. */
function jpeg(en: number, boy: number, sof = 0xc0): Buffer {
  const app0 = Buffer.from([0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 1, 1, 0, 0, 1, 0, 1, 0, 0])
  const sofGovde = Buffer.alloc(19)
  sofGovde.set([0xff, sof, 0x00, 0x11, 0x08])
  sofGovde.writeUInt16BE(boy, 5)
  sofGovde.writeUInt16BE(en, 7)
  sofGovde.set([0x03, 1, 0x22, 0, 2, 0x11, 1, 3, 0x11, 1], 9)
  return Buffer.concat([Buffer.from([0xff, 0xd8]), app0, sofGovde, Buffer.from([0xff, 0xd9])])
}

async function sunucuAc(fotoDizini: string | null): Promise<{ sunucu: Server; kok: string }> {
  const ayar: Ayar = {
    kokenler: [KOKEN],
    tuz: 'test-tuzu',
    yonetim: { kullanici: 'personel', sifre: 'gizli' },
    guvenilirVekil: listeKur(['127.0.0.1', '::1']),
    kampanyaBitis: null,
    fotoDizini,
  }
  const uygulama = uygulamaKur(depo, ayar, Date.now, { warn() {}, error() {} })
  const s = createServer((req, res) => void uygulama.isle(req, res))
  await new Promise<void>((coz) => s.listen(0, '127.0.0.1', coz))
  const adres = s.address()
  if (!adres || typeof adres === 'string') throw new Error('adres yok')
  return { sunucu: s, kok: `http://127.0.0.1:${adres.port}` }
}

before(async () => {
  dizin = await mkdtemp(join(tmpdir(), 'bozo-foto-'))
  ;({ sunucu, kok } = await sunucuAc(dizin))
  ;({ sunucu: kapaliSunucu, kok: kapaliKok } = await sunucuAc(null))
})

after(async () => {
  sunucu.close()
  kapaliSunucu.close()
  await rm(dizin, { recursive: true, force: true })
})

async function yukle(veri: Buffer, basliklar: Record<string, string> = { ...kimlik, ...WEBP }, taban = kok) {
  const yanit = await fetch(`${taban}/yonetim/foto`, { method: 'POST', headers: basliklar, body: new Uint8Array(veri) })
  const metin = await yanit.text()
  return { durum: yanit.status, govde: (metin ? JSON.parse(metin) : null) as Record<string, unknown> | null }
}

test('webpBoyutu_uchBicim_boyutlariOkur', () => {
  assert.deepEqual(webpBoyutu(vp8(640, 480)), { en: 640, boy: 480 })
  assert.deepEqual(webpBoyutu(vp8l(1200, 800)), { en: 1200, boy: 800 })
  assert.deepEqual(webpBoyutu(vp8x(2000, 1500)), { en: 2000, boy: 1500 })
})

test('webpBoyutu_webpDegilYaDaKesik_null', () => {
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, ...new Array<number>(40).fill(0)])
  assert.equal(webpBoyutu(jpeg), null)
  assert.equal(webpBoyutu(vp8(10, 10).subarray(0, 25)), null)
  assert.equal(webpBoyutu(Buffer.alloc(0)), null)
  const baslikBozuk = vp8(10, 10)
  baslikBozuk.write('WEBX', 8, 'ascii')
  assert.equal(webpBoyutu(baslikBozuk), null)
  const baslangicBozuk = vp8(10, 10)
  baslangicBozuk[23] = 0
  assert.equal(webpBoyutu(baslangicBozuk), null, 'VP8 başlangıç kodu yok')
})

test('postFoto_gecerliUcBicim_200VeIcerikAdliDosya', async () => {
  for (const veri of [vp8(640, 480, 4), vp8l(1200, 800), vp8x(2000, 2000)]) {
    const y = await yukle(veri)
    const en = webpBoyutu(veri)
    assert.equal(y.durum, 200)
    assert.deepEqual(y.govde as FotoYukleYaniti | null, { dosya: ad(veri), ...en })
    assert.match(String(y.govde?.dosya), /^[0-9a-f]{16}\.webp$/)
    assert.deepEqual(await readFile(join(dizin, ad(veri))), veri)
  }
})

test('postFoto_ayniBaytlarIkiKez_ayniAdTekDosyaYenidenYazilmaz', async () => {
  const veri = vp8(321, 123)
  const bir = await yukle(veri)
  const gecmis = new Date('2020-01-01T00:00:00Z')
  await utimes(join(dizin, ad(veri)), gecmis, gecmis)
  const iki = await yukle(veri)
  assert.deepEqual([bir.durum, iki.durum], [200, 200])
  assert.equal(bir.govde?.dosya, iki.govde?.dosya)
  assert.equal((await readdir(dizin)).filter((d) => d === ad(veri)).length, 1)
  assert.equal((await stat(join(dizin, ad(veri)))).mtimeMs, gecmis.getTime(), 'var olan dosya yazılmaz')
  assert.deepEqual((await readdir(dizin)).filter((d) => d.endsWith('.tmp')), [], 'geçici dosya kalmaz')
})

test('postFoto_jpegBaytlarWebpBasligiyla_415BicimDesteklenmiyorDiskeYazilmaz', async () => {
  const oncesi = await readdir(dizin)
  const y = await yukle(jpeg(640, 480))
  assert.deepEqual([y.durum, y.govde?.hata], [415, 'bicimDesteklenmiyor'])
  assert.deepEqual(await readdir(dizin), oncesi)
})

test('postFoto_webpBaytlarJpegBasligiyla_415', async () => {
  const oncesi = await readdir(dizin)
  const y = await yukle(vp8(50, 50), { ...kimlik, ...JPEG })
  assert.deepEqual([y.durum, y.govde?.hata], [415, 'bicimDesteklenmiyor'])
  assert.deepEqual(await readdir(dizin), oncesi)
})

test('postFoto_desteklenmeyenIcerikTuru_415', async () => {
  const y = await yukle(vp8(50, 50), { ...kimlik, 'Content-Type': 'image/png' })
  assert.deepEqual([y.durum, y.govde?.hata], [415, 'bicimDesteklenmiyor'])
})

test('postFoto_gecerliJpeg_200JpgAdliAyniBaytlar', async () => {
  const veri = jpeg(1600, 1200)
  const y = await yukle(veri, { ...kimlik, ...JPEG })
  assert.equal(y.durum, 200)
  assert.deepEqual(y.govde as FotoYukleYaniti | null, { dosya: ad(veri, 'jpg'), en: 1600, boy: 1200 })
  assert.match(String(y.govde?.dosya), /^[0-9a-f]{16}\.jpg$/)
  assert.deepEqual(await readFile(join(dizin, ad(veri, 'jpg'))), veri)
})

test('postFoto_dar_umaskAltinda_dosyaHerkesceOkunur0644', async () => {
  const onceki = process.umask(0o077)
  try {
    const veri = jpeg(320, 240)
    assert.equal((await yukle(veri, { ...kimlik, ...JPEG })).durum, 200)
    assert.equal((await stat(join(dizin, ad(veri, 'jpg')))).mode & 0o777, 0o644, 'nginx okuyabilsin')
  } finally {
    process.umask(onceki)
  }
})

test('postFoto_asamaliJpegSof2_200', async () => {
  const y = await yukle(jpeg(800, 600, 0xc2), { ...kimlik, ...JPEG })
  assert.deepEqual([y.durum, y.govde?.en, y.govde?.boy], [200, 800, 600])
})

test('postFoto_jpegSofBulunamaz_415', async () => {
  const kesik = jpeg(640, 480).subarray(0, 20)
  const y = await yukle(kesik, { ...kimlik, ...JPEG })
  assert.deepEqual([y.durum, y.govde?.hata], [415, 'bicimDesteklenmiyor'])
})

test('jpegBoyutu_sofTurleriVeBozukGirdi_boyutYaDaNull', () => {
  for (const sof of [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]) {
    assert.deepEqual(jpegBoyutu(jpeg(70, 50, sof)), { en: 70, boy: 50 }, sof.toString(16))
  }
  const sosOnce = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xda, 0x00, 0x02]), jpeg(70, 50).subarray(2)])
  assert.equal(jpegBoyutu(sosOnce), null, 'SOF taramadan önce gelmeli')
  assert.equal(jpegBoyutu(jpeg(0, 50)), null, 'sıfır boyut')
  assert.equal(jpegBoyutu(vp8(10, 10)), null)
  assert.equal(jpegBoyutu(Buffer.alloc(0)), null)
  const uzunlukTasar = jpeg(70, 50)
  uzunlukTasar.writeUInt16BE(0xffff, 4)
  assert.equal(jpegBoyutu(uzunlukTasar), null, 'APP0 uzunluğu dosyayı aşıyor')
})

test('postFoto_uzunKenar2001_422FotoBuyuk_2000Gecer', async () => {
  const buyuk = await yukle(vp8x(2001, 100))
  assert.deepEqual([buyuk.durum, buyuk.govde?.hata], [422, 'fotoBuyuk'])
  const uzun = await yukle(vp8l(100, 2001))
  assert.deepEqual([uzun.durum, uzun.govde?.hata], [422, 'fotoBuyuk'], 'boy da sayılır')
  assert.equal((await yukle(vp8x(2000, 100))).durum, 200)
})

test('postFoto_jpegUzunKenar2001_422FotoBuyuk_2000Gecer', async () => {
  const buyuk = await yukle(jpeg(2001, 100), { ...kimlik, ...JPEG })
  assert.deepEqual([buyuk.durum, buyuk.govde?.hata], [422, 'fotoBuyuk'])
  assert.equal((await yukle(jpeg(100, 2000), { ...kimlik, ...JPEG })).durum, 200)
})

test('postFoto_bosGovde_400', async () => {
  const y = await yukle(Buffer.alloc(0))
  assert.deepEqual([y.durum, y.govde?.hata], [400, 'govdeBos'])
})

test('postFoto_3MBiAsan_413GovdeBuyuk', async () => {
  const y = await yukle(Buffer.alloc(FOTO_GOVDE_SINIRI + 1))
  assert.deepEqual([y.durum, y.govde?.hata], [413, 'govdeBuyuk'])
})

test('postFoto_kimliksiz_401', async () => {
  const oncesi = await readdir(dizin)
  const y = await yukle(vp8(50, 50), WEBP)
  assert.deepEqual([y.durum, y.govde?.hata], [401, 'kimlikGerekli'])
  assert.deepEqual(await readdir(dizin), oncesi)
})

test('postFoto_fotoDizini_yok_503FotoKapali', async () => {
  const y = await yukle(vp8(50, 50), { ...kimlik, ...WEBP }, kapaliKok)
  assert.deepEqual([y.durum, y.govde?.hata], [503, 'fotoKapali'])
})

test('fotoYukle_islemKaydiDosyaAdi', async () => {
  const veri = vp8(64, 48, 3)
  const y = await yukle(veri)
  assert.equal(y.durum, 200)
  const [son] = await depo.islemler(1)
  assert.deepEqual([son?.ad, son?.tur, son?.ayrinti], ['personel', 'foto', ad(veri)])
})
