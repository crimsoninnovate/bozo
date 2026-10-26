import assert from 'node:assert/strict'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { mock, test } from 'node:test'
import { anaSayfaKalemleri, menuBelgesiYukle } from './belgeYukle.ts'
import type { MenuBelgesi } from './tipler.ts'

const VARSAYILAN_YOLU = new URL('../../content/menu.varsayilan.json', import.meta.url)
const varsayilan = JSON.parse(readFileSync(VARSAYILAN_YOLU, 'utf8')) as MenuBelgesi

/** Geçici bir `kok` kurar: içinde yalnız `content/menu.varsayilan.json` vardır. */
function geciciKok(): { kok: string; sil: () => void } {
  const kok = mkdtempSync(join(tmpdir(), 'menu-yukle-'))
  mkdirSync(join(kok, 'content'))
  copyFileSync(VARSAYILAN_YOLU, join(kok, 'content', 'menu.varsayilan.json'))
  return { kok, sil: () => rmSync(kok, { recursive: true, force: true }) }
}

test('menuBelgesiYukle_canliDosyaYoksa_varsayilanDoner', () => {
  const { kok, sil } = geciciKok()
  try {
    assert.deepEqual(menuBelgesiYukle(kok), varsayilan)
  } finally {
    sil()
  }
})

test('menuBelgesiYukle_canliDosyaGecerliyse_onuDoner', () => {
  const { kok, sil } = geciciKok()
  try {
    const canli = structuredClone(varsayilan)
    const ilk = canli.kalemler[0]
    assert.ok(ilk)
    ilk.fiyatlar.porsiyon = 720
    writeFileSync(join(kok, 'content', 'menu.canli.json'), JSON.stringify(canli))
    assert.deepEqual(menuBelgesiYukle(kok), canli)
  } finally {
    sil()
  }
})

test('menuBelgesiYukle_canliDosyaBozuksa_varsayilanaDonerVeUyarirLoglar', () => {
  const { kok, sil } = geciciKok()
  const uyari = mock.method(console, 'warn', () => {})
  try {
    writeFileSync(join(kok, 'content', 'menu.canli.json'), '{ bozuk json')
    assert.deepEqual(menuBelgesiYukle(kok), varsayilan)
    const sema = structuredClone(varsayilan)
    const ilk = sema.kalemler[0]
    assert.ok(ilk)
    ilk.fiyatlar.porsiyon = -5
    writeFileSync(join(kok, 'content', 'menu.canli.json'), JSON.stringify(sema))
    assert.deepEqual(menuBelgesiYukle(kok), varsayilan)
    assert.equal(uyari.mock.callCount(), 2)
    assert.match(String(uyari.mock.calls[0]?.arguments[0]), /menu\.canli\.json/)
    assert.match(String(uyari.mock.calls[1]?.arguments[0]), /kalemler\[0\]\.fiyatlar\.porsiyon/)
  } finally {
    uyari.mock.restore()
    sil()
  }
})

const ANA_KIMLIKLER = ['ciger', 'dalak', 'yurek', 'terbiyesiz-tavuk-sis', 'terbiyeli-kusbasi']

test('anaSayfaKalemleri_silinenVeYeniKalem_hataVermez', () => {
  const belge = structuredClone(varsayilan)
  belge.kalemler = belge.kalemler.filter((k) => k.id !== 'dalak')
  const ilk = belge.kalemler[0]
  assert.ok(ilk)
  belge.kalemler.push({ ...structuredClone(ilk), id: 'yeni-kalem' })
  const sonuc = anaSayfaKalemleri(belge, ANA_KIMLIKLER)
  assert.deepEqual(
    sonuc.map((k) => k.id),
    ['ciger', 'yurek', 'terbiyesiz-tavuk-sis', 'terbiyeli-kusbasi'],
  )
})

test('anaSayfaKalemleri_varsayilanBelge_bugunkuBesKalemiSiraylaDoner', () => {
  assert.deepEqual(
    anaSayfaKalemleri(varsayilan, ANA_KIMLIKLER).map((k) => k.id),
    ANA_KIMLIKLER,
  )
})
