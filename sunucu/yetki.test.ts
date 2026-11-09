import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { bellekDepoKur } from './bellekDepo.ts'
import type { Depo } from './depo.ts'
import { IstekHatasi, type Istek } from './http.ts'
import { listeKur } from './ip.ts'
import { eskiAdminAnahtariUret, OTURUM_SURESI_MS, oturumAnahtariUret } from './oturum.ts'
import { parolaOzeti } from './parola.ts'
import type { Baglam } from './uclar.ts'
import { uygulamaKur } from './uygulama.ts'
import { yetkiliCoz } from './yonetim.ts'

/* Her yönetim isteği bir hesaba çözülür: admin ortamda, personel veritabanında (spec 2026-11-09). */

const ADMIN = { kullanici: 'bozo', sifre: 'admin-sifresi' }
const TUZ = 'test-tuzu'
const SAAT = Date.parse('2026-11-10T12:00:00Z')
const BITIS = SAAT + OTURUM_SURESI_MS
const ADMIN_SAHIP = { id: 0, surum: 0, gizli: `${ADMIN.kullanici}:${ADMIN.sifre}` }

const temel = (k: string, s: string) => `Basic ${Buffer.from(`${k}:${s}`).toString('base64')}`
const baglam = (depo: Depo) => ({ depo, tuz: TUZ, simdi: () => SAAT }) as unknown as Baglam
const istekle = (authorization?: string) => ({ basliklar: { authorization } }) as unknown as Istek

async function personelli(sifreDegismeli = false) {
  const depo = bellekDepoKur()
  const p = await depo.personelEkle('ajans', await parolaOzeti('ajans-sifresi'), SAAT)
  if (p === 'adKullanimda') throw new Error('ad')
  const son = sifreDegismeli ? p : await depo.personelSifreKoy(p.id, p.parolaOzeti, false)
  if (!son) throw new Error('personel yok')
  return { depo, p: son }
}

async function reddedilir(soz: Promise<unknown>, durum = 401, kod = 'kimlikGerekli') {
  await assert.rejects(soz, (h: unknown) => h instanceof IstekHatasi && h.durum === durum && h.kod === kod)
}

test('yetkiliCoz_adminBasic_adminDoner', async () => {
  const y = await yetkiliCoz(baglam(bellekDepoKur()), ADMIN, istekle(temel('bozo', 'admin-sifresi')))
  assert.deepEqual(y, { id: 0, ad: 'bozo', admin: true, sifreDegismeli: false })
  await reddedilir(yetkiliCoz(baglam(bellekDepoKur()), ADMIN, istekle(temel('bozo', 'yanlis'))))
})

test('yetkiliCoz_adminBearerYeni_adminDoner', async () => {
  const anahtar = oturumAnahtariUret(TUZ, ADMIN_SAHIP, BITIS)
  const y = await yetkiliCoz(baglam(bellekDepoKur()), ADMIN, istekle(`Bearer ${anahtar}`))
  assert.equal(y.admin, true)
  const eskiSifre = oturumAnahtariUret(TUZ, { ...ADMIN_SAHIP, gizli: 'bozo:eski' }, BITIS)
  await reddedilir(yetkiliCoz(baglam(bellekDepoKur()), ADMIN, istekle(`Bearer ${eskiSifre}`)))
})

test('yetkiliCoz_eskiAdminAnahtari_sonTarihtenOnceGecer', async () => {
  const anahtar = eskiAdminAnahtariUret(TUZ, ADMIN, BITIS)
  assert.equal((await yetkiliCoz(baglam(bellekDepoKur()), ADMIN, istekle(`Bearer ${anahtar}`))).admin, true)
})

test('yetkiliCoz_depoHataAtar_adminYineGecer', async () => {
  const bozuk = new Proxy(bellekDepoKur(), {
    get: (hedef, ad) =>
      String(ad).startsWith('personel') ? () => Promise.reject(new Error('db yok')) : hedef[ad as keyof Depo],
  })
  const b = baglam(bozuk)
  assert.equal((await yetkiliCoz(b, ADMIN, istekle(temel('bozo', 'admin-sifresi')))).admin, true)
  const anahtar = oturumAnahtariUret(TUZ, ADMIN_SAHIP, BITIS)
  assert.equal((await yetkiliCoz(b, ADMIN, istekle(`Bearer ${anahtar}`))).admin, true)
})

test('yetkiliCoz_personelBasic_dogruSifreGecerYanlis401', async () => {
  const { depo, p } = await personelli()
  const y = await yetkiliCoz(baglam(depo), ADMIN, istekle(temel('ajans', 'ajans-sifresi')))
  assert.deepEqual(y, { id: p.id, ad: 'ajans', admin: false, sifreDegismeli: false })
  await reddedilir(yetkiliCoz(baglam(depo), ADMIN, istekle(temel('ajans', 'yanlis-sifre'))))
})

test('yetkiliCoz_bilinmeyenAdVeYanlisSifre_ayniHata', async () => {
  const { depo } = await personelli()
  await reddedilir(yetkiliCoz(baglam(depo), ADMIN, istekle(temel('olmayan', 'ajans-sifresi'))))
  await reddedilir(yetkiliCoz(baglam(depo), ADMIN, istekle(temel('ajans', 'baska-sifre'))))
  await reddedilir(yetkiliCoz(baglam(depo), ADMIN, istekle()))
})

/** Tek ölçümde gürültü olur: en kısa süre. scrypt (~onlarca ms) ile anında red arasındaki fark ölçülür. */
async function enKisaSure(is: () => Promise<unknown>): Promise<number> {
  let en = Infinity
  for (let i = 0; i < 3; i++) {
    const bas = performance.now()
    await is().catch(() => undefined)
    en = Math.min(en, performance.now() - bas)
  }
  return en
}

test('yetkiliCoz_adminAdiYanlisSifre_bilinmeyenAdKadarSurer', async () => {
  const b = baglam(bellekDepoKur())
  const adminYanlis = await enKisaSure(() => yetkiliCoz(b, ADMIN, istekle(temel(ADMIN.kullanici, 'yanlis'))))
  const bilinmeyen = await enKisaSure(() => yetkiliCoz(b, ADMIN, istekle(temel('kimse', 'yanlis'))))
  assert.ok(adminYanlis > bilinmeyen / 3, `admin ${adminYanlis.toFixed(1)} ms, bilinmeyen ${bilinmeyen.toFixed(1)} ms`)
})

test('yetkiliCoz_personelBearer_gecerVeSurumEski401', async () => {
  const { depo, p } = await personelli()
  const anahtar = oturumAnahtariUret(TUZ, { id: p.id, surum: p.oturumSurumu, gizli: '' }, BITIS)
  assert.equal((await yetkiliCoz(baglam(depo), ADMIN, istekle(`Bearer ${anahtar}`))).ad, 'ajans')
  await depo.personelSifreKoy(p.id, p.parolaOzeti, false)
  await reddedilir(yetkiliCoz(baglam(depo), ADMIN, istekle(`Bearer ${anahtar}`)))
})

test('yetkiliCoz_kapaliHesap_basicVeBearer401', async () => {
  const { depo, p } = await personelli()
  const kapali = await depo.personelKapat(p.id, true)
  assert.ok(kapali)
  const anahtar = oturumAnahtariUret(TUZ, { id: p.id, surum: kapali.oturumSurumu, gizli: '' }, BITIS)
  await reddedilir(yetkiliCoz(baglam(depo), ADMIN, istekle(temel('ajans', 'ajans-sifresi'))))
  await reddedilir(yetkiliCoz(baglam(depo), ADMIN, istekle(`Bearer ${anahtar}`)))
})

test('yetkiliCoz_yonetimKapali_503', async () => {
  await reddedilir(yetkiliCoz(baglam(bellekDepoKur()), null, istekle(temel('bozo', 'x'))), 503, 'yonetimKapali')
})

async function sunucuyla(depo: Depo, govde: (kok: string) => Promise<void>) {
  const uygulama = uygulamaKur(
    depo,
    { kokenler: [], tuz: TUZ, yonetim: ADMIN, guvenilirVekil: listeKur(['127.0.0.1']), kampanyaBitis: null },
    () => SAAT,
    { warn() {}, error: console.error },
  )
  const s = createServer((req, res) => void uygulama.isle(req, res))
  await new Promise<void>((coz) => s.listen(0, '127.0.0.1', coz))
  const adres = s.address()
  try {
    if (!adres || typeof adres === 'string') throw new Error('adres yok')
    await govde(`http://127.0.0.1:${adres.port}`)
  } finally {
    s.close()
  }
}

test('yonetimOturum_personel_adAdminSifreDegismeliDoner', async () => {
  const { depo, p } = await personelli(true)
  await sunucuyla(depo, async (kok) => {
    const yanit = await fetch(`${kok}/yonetim/oturum`, {
      method: 'POST', headers: { Authorization: temel('ajans', 'ajans-sifresi') },
    })
    assert.equal(yanit.status, 200)
    const govde = (await yanit.json()) as Record<string, unknown>
    assert.deepEqual({ ad: govde.ad, admin: govde.admin, sifreDegismeli: govde.sifreDegismeli }, {
      ad: 'ajans', admin: false, sifreDegismeli: true,
    })
    assert.match(String(govde.anahtar), new RegExp(`^k${p.id}\\.${p.oturumSurumu}\\.`))
    assert.equal((await depo.personelBul(p.id))?.sonGiris, SAAT)
    assert.deepEqual((await depo.islemler(5)).map((i) => [i.ad, i.tur]), [['ajans', 'giris']])
  })
})

test('yonetim_sifreDegismeli_yonetimUcu403', async () => {
  const { depo, p } = await personelli(true)
  const anahtar = oturumAnahtariUret(TUZ, { id: p.id, surum: p.oturumSurumu, gizli: '' }, BITIS)
  await sunucuyla(depo, async (kok) => {
    const yanit = await fetch(`${kok}/yonetim/tarama`, { headers: { Authorization: `Bearer ${anahtar}` } })
    assert.equal(yanit.status, 403)
    assert.deepEqual(await yanit.json(), { hata: 'sifreDegismeli' })
  })
})
