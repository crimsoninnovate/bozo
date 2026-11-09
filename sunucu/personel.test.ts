import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { bellekDepoKur } from './bellekDepo.ts'
import { listeKur } from './ip.ts'
import { uygulamaKur } from './uygulama.ts'

/* Hesap yönetimi uçları (spec 2026-11-09 kullanıcılar): yalnız admin açar, kapatır, sıfırlar. */

const ADMIN = { kullanici: 'bozo', sifre: 'admin-sifresi' }
const SAAT = Date.parse('2026-11-10T12:00:00Z')
const temel = (k: string, s: string) => `Basic ${Buffer.from(`${k}:${s}`).toString('base64')}`
const ADMIN_YETKI = temel(ADMIN.kullanici, ADMIN.sifre)

type Yanit = { durum: number; govde: Record<string, unknown> | null }
type Iste = (yol: string, yetki: string, yontem?: string, govde?: unknown) => Promise<Yanit>

async function sunucuyla(govde: (iste: Iste) => Promise<void>) {
  const uygulama = uygulamaKur(
    bellekDepoKur(),
    { kokenler: [], tuz: 'tuz', yonetim: ADMIN, guvenilirVekil: listeKur(['127.0.0.1']), kampanyaBitis: null },
    () => SAAT,
    { warn() {}, error: console.error },
  )
  const s = createServer((req, res) => void uygulama.isle(req, res))
  await new Promise<void>((coz) => s.listen(0, '127.0.0.1', coz))
  const adres = s.address()
  if (!adres || typeof adres === 'string') throw new Error('adres yok')
  const iste: Iste = async (yol, yetki, yontem = 'GET', g) => {
    const headers: Record<string, string> = { Authorization: yetki }
    if (g !== undefined) headers['Content-Type'] = 'application/json'
    const y = await fetch(`http://127.0.0.1:${adres.port}${yol}`, {
      method: yontem, headers, body: g === undefined ? undefined : JSON.stringify(g),
    })
    const metin = await y.text()
    return { durum: y.status, govde: metin ? (JSON.parse(metin) as Record<string, unknown>) : null }
  }
  try {
    await govde(iste)
  } finally {
    s.close()
  }
}

const ac = (iste: Iste, ad = 'ajans', sifre = 'gecici-sifre') =>
  iste('/yonetim/personel', ADMIN_YETKI, 'POST', { ad, sifre })

async function girisYap(iste: Iste, ad: string, sifre: string): Promise<string> {
  const y = await iste('/yonetim/oturum', temel(ad, sifre), 'POST')
  assert.equal(y.durum, 200, JSON.stringify(y.govde))
  return `Bearer ${String(y.govde?.anahtar)}`
}

test('personel_adminAcar_kullaniciGeciciSifreyleGirerSifreDegistirir', async () => {
  await sunucuyla(async (iste) => {
    const acilan = await ac(iste)
    assert.equal(acilan.durum, 201)
    assert.equal(acilan.govde?.ad, 'ajans')
    const gecici = await girisYap(iste, 'ajans', 'gecici-sifre')
    assert.deepEqual((await iste('/yonetim/ben', gecici)).govde, { ad: 'ajans', admin: false, sifreDegismeli: true })
    assert.equal((await iste('/yonetim/menu', gecici)).durum, 403)
    const degisti = await iste('/yonetim/sifre', gecici, 'POST', { eski: 'gecici-sifre', yeni: 'kendi-sifrem-1' })
    assert.equal(degisti.durum, 200)
    const yeni = `Bearer ${String(degisti.govde?.anahtar)}`
    assert.equal(degisti.govde?.sifreDegismeli, false)
    assert.equal((await iste('/yonetim/menu', yeni)).durum, 200)
    assert.equal((await iste('/yonetim/menu', gecici)).durum, 401, 'eski anahtar düşer')
    await girisYap(iste, 'ajans', 'kendi-sifrem-1')
  })
})

test('personel_kapatilir_eskiAnahtar401VeYenidenAcmakCanlandirmaz', async () => {
  await sunucuyla(async (iste) => {
    const id = Number((await ac(iste)).govde?.id)
    const anahtar = await girisYap(iste, 'ajans', 'gecici-sifre')
    const kapat = await iste(`/yonetim/personel/${id}/kapat`, ADMIN_YETKI, 'POST', { kapali: true })
    assert.equal(kapat.govde?.kapali, true)
    assert.equal((await iste('/yonetim/ben', anahtar)).durum, 401)
    assert.equal((await iste('/yonetim/oturum', temel('ajans', 'gecici-sifre'), 'POST')).durum, 401)
    await iste(`/yonetim/personel/${id}/kapat`, ADMIN_YETKI, 'POST', { kapali: false })
    assert.equal((await iste('/yonetim/ben', anahtar)).durum, 401)
    assert.equal((await iste('/yonetim/personel/999/kapat', ADMIN_YETKI, 'POST', { kapali: true })).durum, 404)
  })
})

test('personel_sifreSifirlanir_eskiAnahtar401VeGeciciyleGirilir', async () => {
  await sunucuyla(async (iste) => {
    const id = Number((await ac(iste)).govde?.id)
    const anahtar = await girisYap(iste, 'ajans', 'gecici-sifre')
    const sifirla = await iste(`/yonetim/personel/${id}/sifre`, ADMIN_YETKI, 'POST', { sifre: 'yeni-gecici-1' })
    assert.equal(sifirla.durum, 200)
    assert.equal((await iste('/yonetim/ben', anahtar)).durum, 401)
    const yeni = await girisYap(iste, 'ajans', 'yeni-gecici-1')
    assert.equal((await iste('/yonetim/ben', yeni)).govde?.sifreDegismeli, true)
  })
})

test('personel_adminOlmayan_personelUclari403', async () => {
  await sunucuyla(async (iste) => {
    const id = Number((await ac(iste)).govde?.id)
    const gecici = await girisYap(iste, 'ajans', 'gecici-sifre')
    const d = await iste('/yonetim/sifre', gecici, 'POST', { eski: 'gecici-sifre', yeni: 'kendi-sifrem-1' })
    const ajans = `Bearer ${String(d.govde?.anahtar)}`
    for (const [yol, yontem, govde] of [
      ['/yonetim/personel', 'GET', undefined],
      ['/yonetim/personel', 'POST', { ad: 'baska', sifre: 'gecici-sifre' }],
      [`/yonetim/personel/${id}/kapat`, 'POST', { kapali: true }],
      [`/yonetim/personel/${id}/sifre`, 'POST', { sifre: 'gecici-sifre' }],
      ['/yonetim/islemler', 'GET', undefined],
    ] as const) {
      const y = await iste(yol, ajans, yontem, govde)
      assert.deepEqual([y.durum, y.govde], [403, { hata: 'adminGerekli' }], yol)
    }
  })
})

test('personel_ayniAd409_adminAdi400_gecersizSifre400', async () => {
  await sunucuyla(async (iste) => {
    await ac(iste)
    assert.equal((await ac(iste)).durum, 409)
    assert.deepEqual((await ac(iste, 'bozo')).govde, { hata: 'adAdminin' })
    assert.deepEqual((await ac(iste, 'Ajans2')).govde, { hata: 'adGecersiz' })
    assert.deepEqual((await ac(iste, 'ikinci', 'kisa')).govde, { hata: 'sifreKisa' })
  })
})

test('sifre_admin400_yanlisEski403_yeniEskiyleAyni400', async () => {
  await sunucuyla(async (iste) => {
    const admin = await iste('/yonetim/sifre', ADMIN_YETKI, 'POST', { eski: ADMIN.sifre, yeni: 'yepyeni-sifre' })
    assert.deepEqual([admin.durum, admin.govde], [400, { hata: 'adminSifresiSunucuda' }])
    await ac(iste)
    const g = await girisYap(iste, 'ajans', 'gecici-sifre')
    const yanlis = await iste('/yonetim/sifre', g, 'POST', { eski: 'yanlis-sifre', yeni: 'kendi-sifrem-1' })
    assert.deepEqual([yanlis.durum, yanlis.govde], [403, { hata: 'eskiSifreYanlis' }])
    const ayni = await iste('/yonetim/sifre', g, 'POST', { eski: 'gecici-sifre', yeni: 'gecici-sifre' })
    assert.deepEqual(ayni.govde, { hata: 'sifreAyni' })
  })
})

test('personel_liste_sonGirisVeSonIslemler', async () => {
  await sunucuyla(async (iste) => {
    await ac(iste)
    await girisYap(iste, 'ajans', 'gecici-sifre')
    const liste = await iste('/yonetim/personel', ADMIN_YETKI)
    const [satir] = liste.govde?.personel as Record<string, unknown>[]
    assert.equal(satir?.sonGiris, new Date(SAAT).toISOString())
    assert.deepEqual((satir?.sonIslemler as { tur: string }[]).map((i) => i.tur), ['giris'])
    assert.equal('parolaOzeti' in (satir ?? {}), false, 'özet yanıtta yok')
    const admin = liste.govde?.adminIslemleri as { tur: string; ayrinti: string }[]
    assert.deepEqual(admin.map((i) => [i.tur, i.ayrinti]), [['personelEkle', 'ajans']])
    const islemler = await iste('/yonetim/islemler?personel=admin', ADMIN_YETKI)
    assert.equal((islemler.govde?.islemler as unknown[]).length, 1)
  })
})
