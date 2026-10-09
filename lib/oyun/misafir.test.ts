import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EVRELER, KALKIS_TIK, PARA_TIK, PUAN } from './ayar.ts'
import { bekle, dokun, evreyeGec, sahne, sonaKadarBekle } from './deneme.ts'
import { fiseUyuyorMu } from './misafir.ts'
import { sabirBonusu } from './puan.ts'
import type { Oyun } from './tipler.ts'

const E0 = EVRELER[0]!
const MERKEZ = E0.cigerPisme + E0.almaPenceresi / 2

/** Ciğeri tam kıvamda tabak 0'a koyar, tabağı ele alır; olayları döner. */
function cigerTabagi(oyun: Oyun) {
  dokun(oyun, 'ciger')
  bekle(oyun, MERKEZ - 1)
  dokun(oyun, 'o0')
  dokun(oyun, 't0')
  return dokun(oyun, 't0')
}

test('misafir_kuyruktakiler_acikYerlerinEnKucukBosunaOturur_sabirOturuncaBaslar', () => {
  const oyun = sahne([['ciger'], ['ciger'], ['ciger']])
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'misafirGeldi', yer: 0 }, { tur: 'misafirGeldi', yer: 1 }])
  assert.equal(oyun.kuyruk.length, 1)
  assert.equal(oyun.misafirler[0]?.toplamSabir, E0.sabir)
  bekle(oyun, 5)
  assert.equal(oyun.misafirler[0]?.sabir, E0.sabir - 5)
})

test('misafir_tukenmezMisafirinSabri_azalmaz', () => {
  const oyun = sahne([['ciger']], true)
  bekle(oyun, 50)
  assert.equal(oyun.misafirler[0]?.sabir, E0.sabir)
})

test('fiseUyuyorMu_kumeBirebir_siraVeKaliteOnemsiz', () => {
  assert.ok(fiseUyuyorMu(['ciger', 'domates'], [{ urun: 'domates', kalite: null }, { urun: 'ciger', kalite: 'iyi' }]))
  assert.ok(!fiseUyuyorMu(['ciger', 'domates'], [{ urun: 'ciger', kalite: 'tam' }]))
  assert.ok(!fiseUyuyorMu(['ciger'], [{ urun: 'ciger', kalite: 'tam' }, { urun: 'ciger', kalite: 'tam' }]))
  assert.ok(!fiseUyuyorMu(['ciger', 'ciger'], [{ urun: 'ciger', kalite: 'tam' }, { urun: 'dalak', kalite: 'tam' }]))
})

test('misafir_dogruTabak_hesapPuana_bahsisTezgaha_tabakBosalir_otuzTikteKalkar', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  const olaylar = cigerTabagi(oyun)
  assert.deepEqual(olaylar, [{ tur: 'tutuldu', el: { tur: 'tabak', no: 0 } }])
  const yer = oyun.misafirler[0]!
  const bahsis = sabirBonusu(yer.sabir, yer.toplamSabir)
  const teslim = dokun(oyun, 'm0')
  assert.deepEqual(teslim, [
    { tur: 'teslim', yer: 0, no: 0, hesap: PUAN.tamKivam },
    { tur: 'paraDustu', yer: 0, tutar: bahsis },
  ])
  assert.equal(oyun.puan, PUAN.tamKivam)
  assert.equal(oyun.kombo, 1)
  assert.deepEqual(oyun.tabaklar[0], [])
  assert.equal(oyun.el, null)
  assert.deepEqual(oyun.paralar[0], { tutar: bahsis, kalan: PARA_TIK - 1 })
  assert.deepEqual(oyun.ozet, { misafir: 1, sis: 1, tamKivam: 1, enUzunKombo: 1, kalkan: 0, bahsis: 0 })
  assert.deepEqual(bekle(oyun, KALKIS_TIK - 2), [])
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'misafirKalkti', yer: 0, odedi: true }])
  assert.equal(oyun.misafirler[0], null)
})

test('misafir_eksikYaDaFazlaTabak_geriDoner_puanKomboTabakDegismez', () => {
  const oyun = sahne([['ciger', 'domates']])
  bekle(oyun, 1)
  oyun.kombo = 2
  cigerTabagi(oyun)
  assert.deepEqual(dokun(oyun, 'm0'), [{ tur: 'yanlisTabak', yer: 0, no: 0 }])
  assert.equal(oyun.el, null)
  assert.equal(oyun.puan, 0)
  assert.equal(oyun.kombo, 2)
  assert.deepEqual(oyun.tabaklar[0], [{ urun: 'ciger', kalite: 'tam' }])
  dokun(oyun, 'domates')
  dokun(oyun, 't0')
  dokun(oyun, 't0')
  assert.equal(dokun(oyun, 'm0')[0]?.tur, 'teslim')
  assert.equal(oyun.puan, PUAN.tamKivam + PUAN.eslikci)
})

test('misafir_bosYaDaOdemisYereTabak_geriDoner', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  cigerTabagi(oyun)
  assert.deepEqual(dokun(oyun, 'm2'), [{ tur: 'yanlisTabak', yer: 2, no: 0 }])
  assert.equal(oyun.el, null)
  dokun(oyun, 't0')
  dokun(oyun, 'm0')
  oyun.tabaklar[1] = [{ urun: 'ciger', kalite: 'iyi' }]
  dokun(oyun, 't1')
  assert.deepEqual(dokun(oyun, 'm0'), [{ tur: 'yanlisTabak', yer: 0, no: 1 }])
  assert.deepEqual(oyun.tabaklar[1], [{ urun: 'ciger', kalite: 'iyi' }])
})

test('misafir_sisDogrudanMisafire_etkisiz', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  dokun(oyun, 'ciger')
  bekle(oyun, MERKEZ - 1)
  dokun(oyun, 'o0')
  assert.deepEqual(dokun(oyun, 'm0'), [])
  assert.equal(oyun.el?.tur, 'sis')
})

test('odeme_komboVeSonSaatCarpanlari_hesabaVeBahsiseAyniUygulanir', () => {
  const oyun = sahne([['ciger']])
  evreyeGec(oyun, 4)
  bekle(oyun, 1)
  oyun.kombo = 3
  const E4 = EVRELER[4]!
  dokun(oyun, 'ciger')
  bekle(oyun, E4.cigerPisme + E4.almaPenceresi / 2 - 1)
  dokun(oyun, 'o0')
  dokun(oyun, 't0')
  dokun(oyun, 't0')
  const yer = oyun.misafirler[0]!
  const bahsis = sabirBonusu(yer.sabir, yer.toplamSabir) * 2 * 2
  const olaylar = dokun(oyun, 'm0')
  assert.deepEqual(olaylar[0], { tur: 'teslim', yer: 0, no: 0, hesap: PUAN.tamKivam * 2 * 2 })
  assert.deepEqual(olaylar[1], { tur: 'paraDustu', yer: 0, tutar: bahsis })
  assert.equal(oyun.kombo, 4)
})

test('para_dokununcaPuanaYazilir_sekizSaniyedeSolar_cezaYok', () => {
  const oyun = sahne([['ciger']])
  bekle(oyun, 1)
  cigerTabagi(oyun)
  dokun(oyun, 'm0')
  const tutar = oyun.paralar[0]!.tutar
  const puan = oyun.puan
  assert.deepEqual(dokun(oyun, 'p0'), [{ tur: 'bahsisAlindi', yer: 0, tutar }])
  assert.equal(oyun.puan, puan + tutar)
  assert.equal(oyun.ozet.bahsis, tutar)
  assert.equal(oyun.paralar[0], null)
  assert.deepEqual(dokun(oyun, 'p0'), [])
  const ikinci = sahne([['ciger']])
  bekle(ikinci, 1)
  cigerTabagi(ikinci)
  dokun(ikinci, 'm0')
  assert.deepEqual(bekle(ikinci, PARA_TIK - 2).filter((o) => o.tur === 'paraSoldu'), [])
  assert.deepEqual(bekle(ikinci, 1), [{ tur: 'paraSoldu', yer: 0 }])
  assert.equal(ikinci.puan, puan)
})

test('para_ayniYereIkinciPara_toplanirSureYenidenBaslar_misafirOturur', () => {
  const oyun = sahne([['ciger'], ['ciger'], ['ciger']])
  bekle(oyun, 1)
  cigerTabagi(oyun)
  dokun(oyun, 'm0')
  const ilk = oyun.paralar[0]!.tutar
  bekle(oyun, KALKIS_TIK)
  assert.equal(oyun.misafirler[0]?.misafir.no, 2)
  assert.ok(oyun.paralar[0])
  cigerTabagi(oyun)
  dokun(oyun, 'm0')
  const para = oyun.paralar[0]!
  assert.ok(para.tutar > ilk)
  assert.equal(para.kalan, PARA_TIK - 1)
})

test('misafir_sabriBiten_kalkar_puanDusmez_komboSifir_ucuncuGeceyiBitirir', () => {
  const oyun = sahne([['ciger'], ['ciger'], ['ciger']])
  bekle(oyun, 1)
  oyun.puan = 500
  oyun.kombo = 4
  oyun.ozet.kalkan = 1
  const yer = oyun.misafirler[0]!
  yer.sabir = 1
  assert.deepEqual(bekle(oyun, 1), [{ tur: 'misafirKalkti', yer: 0, odedi: false }, { tur: 'misafirGeldi', yer: 0 }])
  assert.equal(oyun.puan, 500)
  assert.equal(oyun.kombo, 0)
  assert.equal(oyun.ozet.kalkan, 2)
  sonaKadarBekle(oyun)
  assert.equal(oyun.bitti, 'ucMisafir')
  assert.ok(oyun.tik < 7200)
})

test('bitis_0500eUlasan_geceTamamOlur_1000Puan', () => {
  const oyun = sahne([])
  sonaKadarBekle(oyun)
  assert.equal(oyun.bitti, 'gece')
  assert.equal(oyun.tik, 7200)
  assert.equal(oyun.puan, PUAN.geceTamam)
})
