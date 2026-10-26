import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { menuBelgesiDogrula } from './dogrulama.ts'
import {
  fiyatYaz, icecekEkle, icecekSil, kalemEkle, kalemSil, kalemTasi, kimlikUret, olcuEkle, olcuSil,
} from './duzenleme.ts'
import type { MenuBelgesi } from './tipler.ts'

const varsayilan = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

const kimlikler = (b: MenuBelgesi) => b.kalemler.map((k) => k.id)

test('kimlikUret_turkceKarakter_asciiSlug', () => {
  assert.equal(kimlikUret('Kuzu Şiş', []), 'kuzu-sis')
  assert.equal(kimlikUret('Çiğ Köfte', []), 'cig-kofte')
  assert.equal(kimlikUret('  IŞIK -- Ünlü!  ', []), 'isik-unlu')
})

test('kimlikUret_cakisma_sonekEkler', () => {
  assert.equal(kimlikUret('Kuzu Şiş', ['kuzu-sis']), 'kuzu-sis-2')
  assert.equal(kimlikUret('Kuzu Şiş', ['kuzu-sis', 'kuzu-sis-2']), 'kuzu-sis-3')
})

test('kimlikUret_bosVeyaKisaAd_dogrulamaninIstedigiUzunlugaCikar', () => {
  assert.match(kimlikUret('', []), /^[a-z0-9-]{2,40}$/)
  assert.match(kimlikUret('Ç', []), /^[a-z0-9-]{2,40}$/)
  assert.ok(kimlikUret('a'.repeat(80), ['a'.repeat(40)]).length <= 40)
})

test('kalemSil_ciger_hataFirlatir', () => {
  assert.throws(() => kalemSil(varsayilan, 'ciger'))
})

test('kalemSil_digerKalem_listedenCikarir', () => {
  assert.deepEqual(kimlikler(kalemSil(varsayilan, 'dalak')).slice(0, 2), ['ciger', 'yurek'])
})

test('kalemTasi_ciger_hataFirlatir', () => {
  assert.throws(() => kalemTasi(varsayilan, 'ciger', 1))
})

test('kalemTasi_ikinciKalemiYukari_cigerinAltinaGirmez', () => {
  assert.throws(() => kalemTasi(varsayilan, 'dalak', -1))
})

test('kalemTasi_sonKalemiAsagi_hataFirlatir', () => {
  const son = varsayilan.kalemler.at(-1)?.id ?? ''
  assert.throws(() => kalemTasi(varsayilan, son, 1))
})

test('kalemTasi_ikinciKalemiAsagi_yerDegistirir', () => {
  assert.deepEqual(kimlikler(kalemTasi(varsayilan, 'dalak', 1)).slice(0, 3), ['ciger', 'yurek', 'dalak'])
})

test('kalemEkle_girdiyiDegistirmez', () => {
  const once = structuredClone(varsayilan)
  const yeni = kalemEkle(varsayilan, 'Kuzu Şiş')
  assert.deepEqual(varsayilan, once)
  assert.equal(yeni.kalemler.length, once.kalemler.length + 1)
})

test('kalemEkle_yeniKalem_sonaEklenirPorsiyonSifirdanBaslar', () => {
  const son = kalemEkle(varsayilan, 'Kuzu Şiş').kalemler.at(-1)
  assert.equal(son?.id, 'kuzu-sis')
  assert.equal(son?.ad.tr, 'Kuzu Şiş')
  assert.equal(son?.fiyatlar.porsiyon, 0)
})

test('kalemEkle_fiyatDoldurulmadan_dogrulamaYayiniEngeller', () => {
  assert.equal(menuBelgesiDogrula(kalemEkle(varsayilan, 'Kuzu Şiş')).tamam, false)
})

test('icecekEkle_yeniIcecek_birOlcuylePorsiyonSifirdanBaslar', () => {
  const son = icecekEkle(varsayilan, 'Şalgam').icecekler.at(-1)
  assert.equal(son?.id, 'salgam')
  assert.equal(son?.olculer.length, 1)
  assert.equal(son?.olculer[0]?.fiyat, 0)
})

test('icecekSil_kimlik_listedenCikarir', () => {
  const b = icecekSil(varsayilan, 'kolaZero')
  assert.equal(b.icecekler.some((i) => i.id === 'kolaZero'), false)
  assert.equal(b.icecekler.length, varsayilan.icecekler.length - 1)
})

test('olcuEkle_icecek_sonaOlcuEkler', () => {
  const b = olcuEkle(varsayilan, 'ayran')
  const ayran = b.icecekler.find((i) => i.id === 'ayran')
  assert.equal(ayran?.olculer.length, 4)
  assert.equal(varsayilan.icecekler.find((i) => i.id === 'ayran')?.olculer.length, 3)
})

test('olcuSil_ortadakiOlcu_cikarir', () => {
  const b = olcuSil(varsayilan, 'ayran', 1)
  assert.deepEqual(b.icecekler.find((i) => i.id === 'ayran')?.olculer.map((o) => o.fiyat), [40, 50])
})

test('olcuSil_sonOlcu_hataFirlatir', () => {
  const tek = icecekEkle(varsayilan, 'Şalgam')
  assert.throws(() => olcuSil(tek, 'salgam', 0))
})

test('icecekIslemleri_bilinmeyenKimlik_hataFirlatir', () => {
  assert.throws(() => icecekSil(varsayilan, 'yok'))
  assert.throws(() => olcuEkle(varsayilan, 'yok'))
  assert.throws(() => kalemSil(varsayilan, 'yok'))
})

test('fiyatYaz_bosGirdi_null', () => {
  assert.equal(fiyatYaz('', false), null)
})

test('fiyatYaz_sifir_sifirdirBosDegil', () => {
  assert.equal(fiyatYaz('0', false), 0)
})

test('fiyatYaz_tarayiciSayiSaymadi_nanDonerVeDogrulamaReddeder', () => {
  assert.ok(Number.isNaN(fiyatYaz('', true)))
  for (const alan of ['porsiyon', 'durum'] as const) {
    const b = structuredClone(varsayilan)
    const kalem = b.kalemler[0]
    assert.ok(kalem)
    kalem.fiyatlar[alan] = fiyatYaz('', true) ?? 0
    assert.equal(menuBelgesiDogrula(b).tamam, false, alan)
  }
})
