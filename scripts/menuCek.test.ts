import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { mock, test } from 'node:test'
import type { MenuBelgesi } from '../lib/menu/tipler.ts'
import { menuCek, tohumuOku } from './menuCek.ts'

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

test('menuCek_yaziliyor_metaDosyasiSurumuTasir', async () => {
  const { hedef, sil } = geciciHedef()
  try {
    assert.equal(await menuCek(KOK, json({ surum: 12, belge: varsayilan }), hedef), 'yazildi')
    const meta = JSON.parse(readFileSync(hedef.replace(/\.json$/, '.meta.json'), 'utf8')) as Record<string, unknown>
    assert.equal(meta['surum'], 12)
    assert.equal(typeof meta['cekilme'], 'string')
    assert.ok(!Number.isNaN(Date.parse(String(meta['cekilme']))))
  } finally {
    sil()
  }
})

test('menuCek_metaYazilamazsa_eskiMetaBelgeyleBirlikteKalmaz', async () => {
  const { hedef, sil } = geciciHedef()
  const uyari = mock.method(console, 'warn', () => {})
  const meta = hedef.replace(/\.json$/, '.meta.json')
  try {
    await menuCek(KOK, json({ surum: 1, belge: varsayilan }), hedef)
    assert.ok(existsSync(meta))
    // Yeni meta için gereken geçici dosya yolu bir dizin: yazma başarısız olur.
    mkdirSync(`${meta}.tmp`)
    assert.equal(await menuCek(KOK, json({ surum: 2, belge: varsayilan }), hedef), 'basarisiz')
    assert.equal(existsSync(meta), false, 'eski sürüm yeni belgenin yanında kalmamalı')
  } finally {
    uyari.mock.restore()
    sil()
  }
})

test('menuCek_birinciSurumYaniti_tamIleTamamlanipYazilir', async () => {
  const { hedef, sil } = geciciHedef()
  try {
    const { duyuru: _d, ikramlar: _i, iletisim: _t, ...eski } = structuredClone(varsayilan)
    const sonuc = await menuCek(KOK, json({ surum: 2, belge: eski }), hedef, varsayilan)
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

test('tohumuOku_okunamayanDosya_undefinedDonerVeUyarirLoglar', () => {
  const { hedef, sil } = geciciHedef()
  const uyari = mock.method(console, 'warn', () => {})
  try {
    assert.equal(tohumuOku(hedef), undefined, 'dosya yok')
    writeFileSync(hedef, '{ bozuk json')
    assert.equal(tohumuOku(hedef), undefined, 'bozuk json')
    assert.equal(uyari.mock.callCount(), 2)
    assert.match(String(uyari.mock.calls[0]?.arguments[0]), /menu\.canli\.json/)
  } finally {
    uyari.mock.restore()
    sil()
  }
})

test('tohumuOku_gecerliDosya_belgeDoner', () => {
  assert.deepEqual(tohumuOku(new URL('../content/menu.varsayilan.json', import.meta.url).pathname), varsayilan)
})
