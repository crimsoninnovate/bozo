import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { menuFarki } from './fark.ts'
import type { MenuBelgesi } from './tipler.ts'

const varsayilan = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

function al<T>(liste: readonly T[], n: number): T {
  const oge = liste[n]
  assert.ok(oge !== undefined, `oge yok: ${n}`)
  return oge
}

function varsayilanKopya(degisiklik?: (b: MenuBelgesi) => void): MenuBelgesi {
  const kopya = structuredClone(varsayilan)
  degisiklik?.(kopya)
  return kopya
}

test('fark_degisiklikYok_bosListe', () => {
  assert.deepEqual(menuFarki(varsayilan, varsayilanKopya()), [])
})

test('fark_fiyatDegisti_oncekiVeSonrakiniVerir', () => {
  const yeni = varsayilanKopya((b) => { al(b.kalemler, 0).fiyatlar.porsiyon = 6900 })
  const fark = menuFarki(varsayilan, yeni)
  assert.equal(fark.length, 1)
  assert.deepEqual(al(fark, 0), {
    yol: 'kalemler.ciger.fiyatlar.porsiyon',
    etiket: 'Ciğer: porsiyon fiyatı',
    once: '690 TL',
    sonra: '6.900 TL',
    buyukSicrama: true,
  })
})

test('fark_kucukFiyatDegisimi_buyukSicramaDegil', () => {
  const yeni = varsayilanKopya((b) => { al(b.kalemler, 0).fiyatlar.porsiyon = 1035 })
  assert.equal(al(menuFarki(varsayilan, yeni), 0).buyukSicrama, false)
  const sinir = varsayilanKopya((b) => { al(b.kalemler, 0).fiyatlar.porsiyon = 1036 })
  assert.equal(al(menuFarki(varsayilan, sinir), 0).buyukSicrama, true)
})

test('fark_icecekOlcusuFiyati_etiketiIcecekVeOlcuyuTasir', () => {
  const yeni = varsayilanKopya((b) => {
    const ayran = b.icecekler.find((i) => i.id === 'ayran')
    assert.ok(ayran)
    al(ayran.olculer, 0).fiyat = 45
  })
  const fark = menuFarki(varsayilan, yeni)
  assert.equal(al(fark, 0).etiket, 'İçecekler: Ayran, büyük')
  assert.equal(al(fark, 0).once, '40 TL')
  assert.equal(al(fark, 0).sonra, '45 TL')
})

test('fark_ozelFiyati_etiketliSatir', () => {
  const fark = menuFarki(varsayilan, varsayilanKopya((b) => { b.ozel.fiyat = 950 }))
  assert.equal(al(fark, 0).etiket, 'Bozo Special: fiyat')
  assert.equal(al(fark, 0).sonra, '950 TL')
})

test('fark_kalemEklendi_etiketliSatir', () => {
  const yeni = varsayilanKopya((b) => {
    const kopya = structuredClone(al(b.kalemler, 1))
    kopya.id = 'yeni-kalem'
    kopya.ad = { tr: 'Yeni Kalem', en: 'New Item' }
    b.kalemler.push(kopya)
  })
  const fark = menuFarki(varsayilan, yeni)
  assert.equal(fark.length, 1)
  assert.equal(al(fark, 0).etiket, 'Yeni Kalem: kalem')
  assert.equal(al(fark, 0).once, 'yok')
  assert.equal(al(fark, 0).sonra, 'eklendi, porsiyon 550 TL')
})

test('fark_kalemSilindi_etiketliSatir', () => {
  const yeni = varsayilanKopya((b) => { b.kalemler.splice(1, 1) })
  const fark = menuFarki(varsayilan, yeni)
  assert.equal(fark.length, 1)
  assert.equal(al(fark, 0).etiket, 'Dalak: kalem')
  assert.equal(al(fark, 0).once, 'porsiyon 550 TL')
  assert.equal(al(fark, 0).sonra, 'silindi')
})

test('fark_aciklamaDegisti_ikiDilAyriSatir', () => {
  const yeni = varsayilanKopya((b) => {
    al(b.kalemler, 0).aciklama = { tr: 'Yeni açıklama', en: 'New description' }
  })
  const fark = menuFarki(varsayilan, yeni)
  assert.deepEqual(fark.map((d) => d.etiket), ['Ciğer: açıklama (TR)', 'Ciğer: açıklama (EN)'])
  assert.equal(al(fark, 0).sonra, 'Yeni açıklama')
  assert.equal(al(fark, 1).sonra, 'New description')
  assert.ok(fark.every((d) => !d.buyukSicrama))
})

test('fark_durumFiyatiKaldirildi_yokOlarakGosterir', () => {
  const yeni = varsayilanKopya((b) => { delete al(b.kalemler, 0).fiyatlar.durum })
  const fark = menuFarki(varsayilan, yeni)
  assert.equal(al(fark, 0).etiket, 'Ciğer: dürüm fiyatı')
  assert.equal(al(fark, 0).once, '690 TL')
  assert.equal(al(fark, 0).sonra, 'yok')
  assert.equal(al(fark, 0).buyukSicrama, false)
})

test('fark_kalemSirasiDegisti_siraSatiriVerir', () => {
  const yeni = varsayilanKopya((b) => { b.kalemler.push(al(b.kalemler.splice(1, 1), 0)) })
  const fark = menuFarki(varsayilan, yeni)
  assert.equal(fark.length, 1)
  assert.equal(al(fark, 0).etiket, 'Kalem sırası')
})

test('fark_kalemYenidenAdlandi_siraSatiriCikmaz', () => {
  const yeni = varsayilanKopya((b) => { al(b.kalemler, 1).ad.tr = 'Dalak Special' })
  assert.deepEqual(menuFarki(varsayilan, yeni).map((d) => d.etiket), ['Dalak: ad (TR)'])
})

test('fark_icecekYenidenAdlandi_siraSatiriCikmaz', () => {
  const yeni = varsayilanKopya((b) => { al(b.icecekler, 0).ad.tr = 'Kola Special' })
  assert.deepEqual(menuFarki(varsayilan, yeni).map((d) => d.etiket), ['İçecekler: Cola: ad (TR)'])
})

test('fark_icecekSirasiDegisti_siraSatiriVerir', () => {
  const yeni = varsayilanKopya((b) => { b.icecekler.push(al(b.icecekler.splice(0, 1), 0)) })
  assert.deepEqual(menuFarki(varsayilan, yeni).map((d) => d.etiket), ['İçecek sırası'])
})
