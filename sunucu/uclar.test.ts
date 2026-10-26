import { test } from 'node:test'
import assert from 'node:assert/strict'
import { onbellekKur } from './uclar.ts'

type Bekleyen<T> = { vaat: Promise<T>; coz(deger: T): void; reddet(hata: Error): void }

function bekleyen<T>(): Bekleyen<T> {
  let coz!: (deger: T) => void
  let reddet!: (hata: Error) => void
  const vaat = new Promise<T>((c, r) => {
    coz = c
    reddet = r
  })
  return { vaat, coz, reddet }
}

test('onbellek_eszamanliCagrilar_tekUretimiPaylasir', async () => {
  const onbellek = onbellekKur<string>(1000)
  const b = bekleyen<string>()
  let uretim = 0
  const uret = () => {
    uretim++
    return b.vaat
  }
  const sonuclar = [onbellek.al(0, uret), onbellek.al(1, uret), onbellek.al(2, uret)]
  b.coz('deger')
  assert.deepEqual(await Promise.all(sonuclar), ['deger', 'deger', 'deger'])
  assert.equal(uretim, 1)
  assert.equal(await onbellek.al(3, uret), 'deger')
  assert.equal(uretim, 1, 'sonuç süre içinde önbellekten gelir')
})

test('onbellek_uretimReddedilirse_onbelleklenmezSonrakiCagriYenidenDener', async () => {
  const onbellek = onbellekKur<string>(1000)
  await assert.rejects(onbellek.al(0, () => Promise.reject(new Error('depo düştü'))), /depo düştü/)
  assert.equal(await onbellek.al(1, async () => 'iyi'), 'iyi')
})

test('onbellek_uretimSenkronFirlatirsa_reddedilirVeOnbelleklenmez', async () => {
  const onbellek = onbellekKur<string>(1000)
  await assert.rejects(onbellek.al(0, () => { throw new Error('anlık') }), /anlık/)
  assert.equal(await onbellek.al(1, async () => 'iyi'), 'iyi')
})

test('onbellek_bosaltSonrasiBitenEskiUretim_saklanmazVeYeniCagriPaylasmaz', async () => {
  const onbellek = onbellekKur<string>(1000)
  const eski = bekleyen<string>()
  const ilk = onbellek.al(0, () => eski.vaat)
  onbellek.bosalt()
  let yeniUretim = 0
  const yeni = () => {
    yeniUretim++
    return Promise.resolve('yeni')
  }
  assert.equal(await onbellek.al(1, yeni), 'yeni', 'boşaltmadan önce başlayan okumayı paylaşmaz')
  eski.coz('eski')
  assert.equal(await ilk, 'eski', 'eski okumayı başlatan kendi değerini alır')
  assert.equal(await onbellek.al(2, yeni), 'yeni', 'eski sonuç yeni değerin üstüne yazılmaz')
  assert.equal(yeniUretim, 1)
})

test('onbellek_bosaltSonrasiBitenEskiUretim_bosOnbellegeYazilmaz', async () => {
  const onbellek = onbellekKur<string>(1000)
  const eski = bekleyen<string>()
  const ilk = onbellek.al(0, () => eski.vaat)
  onbellek.bosalt()
  eski.coz('eski')
  await ilk
  assert.equal(await onbellek.al(1, async () => 'taze'), 'taze')
})

test('onbellek_sureDolunca_yenidenUretir', async () => {
  const onbellek = onbellekKur<number>(1000)
  let sayac = 0
  const uret = async () => ++sayac
  assert.equal(await onbellek.al(0, uret), 1)
  assert.equal(await onbellek.al(999, uret), 1)
  assert.equal(await onbellek.al(1000, uret), 2)
})
