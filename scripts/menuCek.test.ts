import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { mock, test } from 'node:test'
import type { MenuBelgesi } from '../lib/menu/tipler.ts'
import { menuCek } from './menuCek.ts'

const KOK = 'https://api.test'
const varsayilan = JSON.parse(
  readFileSync(new URL('../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

function geciciHedef(): { hedef: string; sil: () => void } {
  const dizin = mkdtempSync(join(tmpdir(), 'menu-cek-'))
  return { hedef: join(dizin, 'menu.canli.json'), sil: () => rmSync(dizin, { recursive: true, force: true }) }
}

const json = (govde: unknown, status = 200): typeof fetch =>
  (async () => new Response(JSON.stringify(govde), { status })) as typeof fetch

test('menuCek_gecerliYanit_dosyayaYazar', async () => {
  const { hedef, sil } = geciciHedef()
  try {
    const sonuc = await menuCek(KOK, json({ surum: 3, belge: varsayilan }), hedef)
    assert.equal(sonuc, 'yazildi')
    assert.deepEqual(JSON.parse(readFileSync(hedef, 'utf8')), varsayilan)
  } finally {
    sil()
  }
})

test('menuCek_204_dosyaYazmaz', async () => {
  const { hedef, sil } = geciciHedef()
  try {
    const getir = (async () => new Response(null, { status: 204 })) as typeof fetch
    assert.equal(await menuCek(KOK, getir, hedef), 'sunucudaYok')
    assert.equal(existsSync(hedef), false)
  } finally {
    sil()
  }
})

test('menuCek_agHatasi_varOlanDosyayaDokunmazVeBasarisizDoner', async () => {
  const { hedef, sil } = geciciHedef()
  const uyari = mock.method(console, 'warn', () => {})
  try {
    writeFileSync(hedef, '{"eski":true}')
    const getir = (async () => {
      throw new TypeError('fetch failed')
    }) as typeof fetch
    assert.equal(await menuCek(KOK, getir, hedef), 'basarisiz')
    assert.equal(readFileSync(hedef, 'utf8'), '{"eski":true}')
    assert.ok(uyari.mock.callCount() >= 1)
  } finally {
    uyari.mock.restore()
    sil()
  }
})

test('menuCek_gecersizBelge_dosyayaYazmaz', async () => {
  const { hedef, sil } = geciciHedef()
  const uyari = mock.method(console, 'warn', () => {})
  try {
    const bozuk = structuredClone(varsayilan)
    const ilk = bozuk.kalemler[0]
    assert.ok(ilk)
    ilk.fiyatlar.porsiyon = -5
    assert.equal(await menuCek(KOK, json({ surum: 3, belge: bozuk }), hedef), 'basarisiz')
    assert.equal(existsSync(hedef), false)
  } finally {
    uyari.mock.restore()
    sil()
  }
})
