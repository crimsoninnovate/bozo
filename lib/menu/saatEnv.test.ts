import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { mock, test } from 'node:test'
import { VARSAYILAN_SAATLER } from '../saat.ts'
import { saatleriEnvdenOku, saatleriEnveCevir } from './saatEnv.ts'
import type { MenuBelgesi } from './tipler.ts'

const belge = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

test('saatleriEnveCevir_belge_saatleriJsonYazar', () => {
  const b = structuredClone(belge)
  b.saatler = { acilis: 12, kapanis: 4 }
  assert.equal(saatleriEnveCevir(b), '{"acilis":12,"kapanis":4}')
})

test('saatleriEnvdenOku_gecerliHam_saatleriDoner', () => {
  assert.deepEqual(saatleriEnvdenOku('{"acilis":12,"kapanis":4}'), { acilis: 12, kapanis: 4 })
})

test('saatleriEnvdenOku_hamYok_sessizceVarsayilan', () => {
  assert.deepEqual(saatleriEnvdenOku(undefined), VARSAYILAN_SAATLER)
})

test('saatleriEnvdenOku_bozukVeyaSinirDisi_uyarirVeVarsayilan', () => {
  const uyari = mock.method(console, 'warn', () => {})
  try {
    for (const ham of ['{', '{"acilis":10}', '{"acilis":20,"kapanis":5}', '{"acilis":10.5,"kapanis":5}']) {
      assert.deepEqual(saatleriEnvdenOku(ham), VARSAYILAN_SAATLER, ham)
    }
    assert.equal(uyari.mock.callCount(), 4)
  } finally {
    uyari.mock.restore()
  }
})
