import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { isletme } from '../../content/isletme.ts'
import { menu as enMenu } from '../../content/en/menu.ts'
import { menu as trMenu } from '../../content/tr/menu.ts'
import { ikramGruplari, ikramlar } from '../../content/urunler.ts'
import { menuBelgesiDogrula } from './dogrulama.ts'
import type { Cift, MenuBelgesi } from './tipler.ts'

const belge = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

function kalem(id: string) {
  const bulunan = belge.kalemler.find((k) => k.id === id)
  assert.ok(bulunan, `kalem yok: ${id}`)
  return bulunan
}

test('varsayilan_bugunkuMenuyuTasir', () => {
  assert.deepEqual(
    belge.kalemler.map((k) => k.id),
    ['ciger', 'dalak', 'yurek', 'terbiyeli-tavuk-sis', 'terbiyesiz-tavuk-sis', 'terbiyeli-kusbasi', 'bozo-karisik'],
  )
  assert.deepEqual(kalem('ciger').fiyatlar, { porsiyon: 690, durum: 690 })
  assert.deepEqual(kalem('terbiyeli-kusbasi').fiyatlar, { porsiyon: 850, durum: 850 })
  assert.equal(belge.ozel.fiyat, 900)
  assert.deepEqual(
    belge.icecekler.map((i) => i.id),
    ['kola', 'kolaZero', 'fanta', 'cappy', 'ayran', 'su'],
  )
  const ayran = belge.icecekler.find((i) => i.id === 'ayran')
  assert.deepEqual(ayran?.olculer.map((o) => o.fiyat), [40, 30, 50])
})

test('varsayilan_trVeEnAlanlariDoludur', () => {
  const dolu = (c: Cift, yol: string) => {
    assert.ok(c.tr.trim() !== '', `${yol}.tr bos`)
    assert.ok(c.en.trim() !== '', `${yol}.en bos`)
  }
  const bos = (c: Cift | null, yol: string) => {
    if (c !== null) dolu(c, yol)
  }
  for (const k of belge.kalemler) {
    dolu(k.ad, `${k.id}.ad`)
    bos(k.aciklama, `${k.id}.aciklama`)
    bos(k.porsiyonNotu, `${k.id}.porsiyonNotu`)
    bos(k.durumNotu, `${k.id}.durumNotu`)
  }
  dolu(belge.ozel.ad, 'ozel.ad')
  dolu(belge.ozel.miktarNotu, 'ozel.miktarNotu')
  dolu(belge.ozel.aciklama, 'ozel.aciklama')
  for (const i of belge.icecekler) {
    dolu(i.ad, `${i.id}.ad`)
    i.olculer.forEach((o, n) => dolu(o.ad, `${i.id}.olculer[${n}].ad`))
  }
})

test('varsayilan_v2Belgesi_gecerli', () => {
  const sonuc = menuBelgesiDogrula(structuredClone(belge))
  assert.equal(sonuc.tamam, true)
  if (sonuc.tamam) {
    assert.deepEqual(sonuc.uyarilar, [])
    assert.deepEqual(sonuc.belge, belge)
  }
})

test('varsayilan_v2Bolumleri_bugunkuDegerleriTasir', () => {
  assert.deepEqual(belge.duyuru, { aktif: false, metin: { tr: '', en: '' }, bitis: null })
  assert.ok([...belge.kalemler, ...belge.icecekler].every((k) => k.tukendi === false))
  assert.deepEqual(belge.iletisim, {
    telefonAcik: false,
    telefon: '+90 533 888 74 24',
    eposta: isletme.eposta,
    instagram: isletme.instagram,
    facebook: isletme.facebook,
    tiktok: isletme.tiktok,
    googleYorumKodu: isletme.googleYorumKodu,
  })
})

// Task 3 sözlüğü siler; o zaman bu test de kalkar (seed tek kaynak olur).
test('varsayilan_ikramMetinleri_sozluklerleAyni', () => {
  const { urunler, gruplar, altMetin } = belge.ikramlar
  assert.deepEqual(altMetin, { tr: trMenu.ikramlar.altMetin, en: enMenu.ikramlar.altMetin })
  assert.deepEqual(urunler.map((u) => u.id), ikramlar.map((i) => i.id))
  assert.deepEqual(urunler.map((u) => u.fotoId), ikramlar.map((i) => i.fotoId))
  for (const u of urunler) {
    const tr = trMenu.ikramlar.urunler[u.id as 'lebeni']
    const en = enMenu.ikramlar.urunler[u.id as 'lebeni']
    assert.deepEqual(u.ad, { tr: tr.ad, en: en.ad })
    assert.deepEqual(u.aciklama, { tr: tr.aciklama, en: en.aciklama })
  }
  assert.deepEqual(gruplar.map((g) => g.id), ikramGruplari.map((g) => g.id))
  for (const [n, g] of gruplar.entries()) {
    const kaynak = ikramGruplari[n]
    assert.ok(kaynak)
    const anahtar = g.id as 'yesillik'
    assert.deepEqual(g.ad, { tr: trMenu.ikramlar.gruplar[anahtar], en: enMenu.ikramlar.gruplar[anahtar] })
    assert.deepEqual(g.not, g.id === 'yesillik'
      ? { tr: trMenu.ikramlar.yesillikNotu, en: enMenu.ikramlar.yesillikNotu }
      : null)
    assert.equal(g.ogeler.length, kaynak.ogeler.length)
    for (const [s, o] of g.ogeler.entries()) {
      const sozluk = kaynak.ogeler[s] as keyof typeof trMenu.ikramlar.ogeler
      assert.deepEqual(o.ad, { tr: trMenu.ikramlar.ogeler[sozluk], en: enMenu.ikramlar.ogeler[sozluk] })
    }
  }
})
