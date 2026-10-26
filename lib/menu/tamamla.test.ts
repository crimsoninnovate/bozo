import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { menuBelgesiDogrula } from './dogrulama.ts'
import { menuBelgesiTamamla } from './tamamla.ts'
import type { MenuBelgesi } from './tipler.ts'

const tam = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

function birinciSurum(): Record<string, unknown> {
  const { duyuru: _d, ikramlar: _i, iletisim: _t, ...eski } = structuredClone(tam)
  const tukendisiz = <T extends { tukendi: boolean }>(o: T): Omit<T, 'tukendi'> => {
    const { tukendi: _x, ...gerisi } = o
    return gerisi
  }
  return { ...eski, kalemler: eski.kalemler.map(tukendisiz), icecekler: eski.icecekler.map(tukendisiz) }
}

test('tamamla_bolumEksik_tamdanEkler', () => {
  const sonuc = menuBelgesiTamamla(birinciSurum(), tam) as Record<string, unknown>
  assert.deepEqual(sonuc['ikramlar'], tam.ikramlar)
  assert.deepEqual(sonuc['iletisim'], tam.iletisim)
  assert.deepEqual(sonuc['duyuru'], tam.duyuru)
  assert.equal(menuBelgesiDogrula(sonuc).tamam, true)
})

test('tamamla_bolumVar_dokunmaz', () => {
  const girdi = structuredClone(tam)
  girdi.iletisim.eposta = 'baska@cigercibozo.com'
  girdi.duyuru = { aktif: true, metin: { tr: 'Açığız', en: 'Open' }, bitis: null }
  const sonuc = menuBelgesiTamamla(girdi, structuredClone(tam))
  assert.deepEqual(sonuc, girdi)
})

test('tamamla_girdiyiDegistirmez', () => {
  const girdi = birinciSurum()
  menuBelgesiTamamla(girdi, tam)
  assert.equal('ikramlar' in girdi, false)
})

test('tamamla_kalemlereDokunmaz', () => {
  const girdi = birinciSurum()
  const sonuc = menuBelgesiTamamla(girdi, tam) as Record<string, unknown>
  assert.deepEqual(sonuc['kalemler'], girdi['kalemler'])
})

test('tamamla_nesneDegil_oldugGibiDoner', () => {
  assert.equal(menuBelgesiTamamla(null, tam), null)
  assert.deepEqual(menuBelgesiTamamla([1], tam), [1])
})
