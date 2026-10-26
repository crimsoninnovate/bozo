import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { menuBelgesiDogrula } from './dogrulama.ts'
import {
  fiyatYaz, icecekEkle, icecekSil, ikramGrubuEkle, ikramGrubuSil, ikramGrubuTasi, ikramOgesiEkle, ikramOgesiSil,
  ikramOgesiTasi, ikramUrunuEkle, ikramUrunuSil, ikramUrunuTasi, kalemEkle, kalemSil, kalemTasi, kimlikUret, olcuEkle,
  olcuSil,
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

const ikramKimlikleri = (b: MenuBelgesi) => b.ikramlar.urunler.map((u) => u.id)

test('ikramUrunuEkle_girdiyiDegistirmez', () => {
  const once = structuredClone(varsayilan)
  const yeni = ikramUrunuEkle(varsayilan, 'Közlenmiş Biber')
  assert.deepEqual(varsayilan, once)
  assert.equal(yeni.ikramlar.urunler.length, once.ikramlar.urunler.length + 1)
  const son = yeni.ikramlar.urunler.at(-1)
  assert.equal(son?.id, 'kozlenmis-biber')
  assert.equal(son?.ad.tr, 'Közlenmiş Biber')
  assert.equal(son?.fotoId, null)
})

test('ikramUrunuEkle_ayniAd_sonekEkler', () => {
  const b = ikramUrunuEkle(ikramUrunuEkle(varsayilan, 'Biber'), 'Biber')
  assert.deepEqual(ikramKimlikleri(b).slice(-2), ['biber', 'biber-2'])
})

test('ikramUrunuSil_kimlik_listedenCikarir', () => {
  const ilk = ikramKimlikleri(varsayilan)[0] ?? ''
  assert.equal(ikramKimlikleri(ikramUrunuSil(varsayilan, ilk)).includes(ilk), false)
  assert.throws(() => ikramUrunuSil(varsayilan, 'yok'))
})

test('ikramUrunuTasi_ikinciyiYukari_yerDegistirir', () => {
  const [a, b] = ikramKimlikleri(varsayilan)
  assert.deepEqual(ikramKimlikleri(ikramUrunuTasi(varsayilan, b ?? '', -1)).slice(0, 2), [b, a])
})

test('ikramUrunuTasi_ilkiYukari_hataFirlatmaz_yerindeKalir', () => {
  const ilk = ikramKimlikleri(varsayilan)[0] ?? ''
  const b = ikramUrunuTasi(varsayilan, ilk, -1)
  assert.deepEqual(ikramKimlikleri(b), ikramKimlikleri(varsayilan))
  const son = ikramKimlikleri(varsayilan).at(-1) ?? ''
  assert.deepEqual(ikramKimlikleri(ikramUrunuTasi(varsayilan, son, 1)), ikramKimlikleri(varsayilan))
})

test('ikramGrubuEkle_yeniKume_ogesizVeNotsuzEklenir', () => {
  const once = structuredClone(varsayilan)
  const b = ikramGrubuEkle(varsayilan, 'Yanında')
  assert.deepEqual(varsayilan, once)
  assert.deepEqual(b.ikramlar.gruplar.at(-1), { id: 'yaninda', ad: { tr: 'Yanında', en: '' }, not: null, ogeler: [] })
})

test('ikramGrubuSil_kume_listedenCikarir', () => {
  const ilk = varsayilan.ikramlar.gruplar[0]?.id ?? ''
  const b = ikramGrubuSil(ikramGrubuEkle(varsayilan, 'Yanında'), ilk)
  assert.equal(b.ikramlar.gruplar.some((g) => g.id === ilk), false)
})

test('ikramGrubuSil_sonKume_hataFirlatir', () => {
  let b = varsayilan
  for (const g of varsayilan.ikramlar.gruplar.slice(1)) b = ikramGrubuSil(b, g.id)
  assert.equal(b.ikramlar.gruplar.length, 1)
  assert.throws(() => ikramGrubuSil(b, b.ikramlar.gruplar[0]?.id ?? ''))
})

test('ikramOgesiEkle_kume_sonaEklerBaskaKumeyeDokunmaz', () => {
  const grup = varsayilan.ikramlar.gruplar[0]
  const b = ikramOgesiEkle(varsayilan, grup?.id ?? '', 'Sumak')
  const yeni = b.ikramlar.gruplar[0]
  assert.equal(yeni?.ogeler.length, (grup?.ogeler.length ?? 0) + 1)
  assert.deepEqual(yeni?.ogeler.at(-1), { id: 'sumak', ad: { tr: 'Sumak', en: '' } })
  assert.equal(varsayilan.ikramlar.gruplar[0]?.ogeler.length, grup?.ogeler.length)
})

test('ikramOgesiEkle_baskaKumedeAyniKimlik_sonekEkler', () => {
  const [g1, g2] = varsayilan.ikramlar.gruplar
  const b = ikramOgesiEkle(ikramOgesiEkle(varsayilan, g1?.id ?? '', 'Sumak'), g2?.id ?? '', 'Sumak')
  assert.equal(b.ikramlar.gruplar[1]?.ogeler.at(-1)?.id, 'sumak-2')
})

test('ikramOgesiEkle_olmayanGrup_hataFirlatir', () => {
  assert.throws(() => ikramOgesiEkle(varsayilan, 'yok', 'Sumak'))
})

test('ikramOgesiSil_oge_listedenCikarir', () => {
  const grup = varsayilan.ikramlar.gruplar[0]
  const oge = grup?.ogeler[0]?.id ?? ''
  const b = ikramOgesiSil(varsayilan, grup?.id ?? '', oge)
  assert.equal(b.ikramlar.gruplar[0]?.ogeler.some((o) => o.id === oge), false)
})

test('ikramOgesiSil_olmayanId_hataFirlatir', () => {
  const grup = varsayilan.ikramlar.gruplar[0]?.id ?? ''
  assert.throws(() => ikramOgesiSil(varsayilan, grup, 'yok'))
  assert.throws(() => ikramOgesiSil(varsayilan, 'yok', 'yok'))
})

const grupKimlikleri = (b: MenuBelgesi) => b.ikramlar.gruplar.map((g) => g.id)
const ogeKimlikleri = (b: MenuBelgesi, grup: number) => b.ikramlar.gruplar[grup]?.ogeler.map((o) => o.id)

test('ikramGrubuTasi_ikinciyiYukari_yerDegistirirGirdiyiDegistirmez', () => {
  const [a, b, c] = grupKimlikleri(varsayilan)
  const once = structuredClone(varsayilan)
  assert.deepEqual(grupKimlikleri(ikramGrubuTasi(varsayilan, b ?? '', -1)), [b, a, c])
  assert.deepEqual(varsayilan, once)
})

test('ikramGrubuTasi_ilkiAsagi_ogeleriyleBirlikteTasinir', () => {
  const ilk = varsayilan.ikramlar.gruplar[0]
  const t = ikramGrubuTasi(varsayilan, ilk?.id ?? '', 1)
  assert.deepEqual(t.ikramlar.gruplar[1], ilk)
})

test('ikramGrubuTasi_uctakiKume_hataFirlatmaz_yerindeKalir', () => {
  const ids = grupKimlikleri(varsayilan)
  assert.deepEqual(grupKimlikleri(ikramGrubuTasi(varsayilan, ids[0] ?? '', -1)), ids)
  assert.deepEqual(grupKimlikleri(ikramGrubuTasi(varsayilan, ids.at(-1) ?? '', 1)), ids)
})

test('ikramGrubuTasi_olmayanId_hataFirlatir', () => {
  assert.throws(() => ikramGrubuTasi(varsayilan, 'yok', 1))
})

test('ikramOgesiTasi_ikinciyiYukari_yalnizKendiKumesindeYerDegistirir', () => {
  const [a, b] = ogeKimlikleri(varsayilan, 1) ?? []
  const t = ikramOgesiTasi(varsayilan, varsayilan.ikramlar.gruplar[1]?.id ?? '', b ?? '', -1)
  assert.deepEqual(ogeKimlikleri(t, 1), [b, a])
  assert.deepEqual(ogeKimlikleri(t, 0), ogeKimlikleri(varsayilan, 0))
  assert.deepEqual(ogeKimlikleri(t, 2), ogeKimlikleri(varsayilan, 2))
})

test('ikramOgesiTasi_uctakiOge_hataFirlatmaz_yerindeKalir', () => {
  const g = varsayilan.ikramlar.gruplar[0]
  const ids = ogeKimlikleri(varsayilan, 0)
  assert.deepEqual(ogeKimlikleri(ikramOgesiTasi(varsayilan, g?.id ?? '', ids?.[0] ?? '', -1), 0), ids)
  assert.deepEqual(ogeKimlikleri(ikramOgesiTasi(varsayilan, g?.id ?? '', ids?.at(-1) ?? '', 1), 0), ids)
})

test('ikramOgesiTasi_olmayanKumeVeyaOge_hataFirlatir', () => {
  const g = varsayilan.ikramlar.gruplar[0]?.id ?? ''
  assert.throws(() => ikramOgesiTasi(varsayilan, g, 'yok', 1))
  assert.throws(() => ikramOgesiTasi(varsayilan, 'yok', 'yok', 1))
})
