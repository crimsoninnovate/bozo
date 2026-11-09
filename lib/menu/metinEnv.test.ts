import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { mock, test } from 'node:test'
import { metinleriEnvdenOku, metinleriEnveCevir } from './metinEnv.ts'
import type { MenuBelgesi } from './tipler.ts'

const belge = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi
const BOS = { tr: {}, en: {} }

test('metinleriEnveCevir_belge_metinleriJsonYazar', () => {
  const b = structuredClone(belge)
  b.metinler = { tr: { 'ana.iddia.baslik': 'Tane konuşur' }, en: {} }
  assert.equal(metinleriEnveCevir(b), '{"tr":{"ana.iddia.baslik":"Tane konuşur"},"en":{}}')
})

test('metinleriEnvdenOku_gecerliHam_metinleriDoner', () => {
  const ham = '{"tr":{},"en":{"ana.iddia.baslik":"The grain tells"}}'
  assert.deepEqual(metinleriEnvdenOku(ham), { tr: {}, en: { 'ana.iddia.baslik': 'The grain tells' } })
})

test('metinleriEnvdenOku_hamYok_sessizceBos', () => {
  assert.deepEqual(metinleriEnvdenOku(undefined), BOS)
})

test('metinleriEnvdenOku_bozukVeyaGecersiz_uyarirVeBos', () => {
  const uyari = mock.method(console, 'warn', () => {})
  try {
    for (const ham of ['{', '{"tr":{}}', '{"tr":{"ana.yok":"x"},"en":{}}', '{"tr":{"ana.hero.ocakSoner":"x"},"en":{}}']) {
      assert.deepEqual(metinleriEnvdenOku(ham), BOS, ham)
    }
    assert.equal(uyari.mock.callCount(), 4)
  } finally {
    uyari.mock.restore()
  }
})

test('sozluk_envdekiMetin_saatlerleBirlikteUygulanir', () => {
  const metinler = { tr: { 'ana.hero.ocakSoner': 'Ocak bu gece {kapanis-de} söner.' }, en: {} }
  const kod = "import { sozluk, sozlukHam } from './content/index.ts';" +
    "console.log(JSON.stringify([sozluk('tr').ana.hero.ocakSoner, sozlukHam('tr').ana.hero.ocakSoner]))"
  const cikti = execFileSync(process.execPath, ['--input-type=module', '-e', kod], {
    cwd: new URL('../../', import.meta.url),
    env: { ...process.env, NEXT_PUBLIC_METINLER: JSON.stringify(metinler), NEXT_PUBLIC_SAATLER: '{"acilis":10,"kapanis":5}' },
    encoding: 'utf8',
  })
  assert.deepEqual(JSON.parse(cikti), ["Ocak bu gece 05:00'te söner.", 'Ocak bu gece {kapanis-de} söner.'])
})
