// SVG kimlikleri belge çapında tektir: `SahneDefs` bir kez bağlanır, başka hiçbir
// dosya `<defs>` ya da `g…`/`f…` kimliği tanımlamaz ve her `url(#…)` başvurusunun
// karşılığı burada vardır. İkinci bir kopya kimlik çakışmasıyla gradyanı sessizce
// öteki tanıma bağlar.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIZIN = fileURLToPath(new URL('./', import.meta.url))
const KAYNAK = readFileSync(join(DIZIN, 'SahneDefs.tsx'), 'utf8')

function tanimlananlar(): string[] {
  const adlar: string[] = []
  for (const [, ad] of KAYNAK.matchAll(/\bid:\s*'([A-Za-z0-9]+)'/g)) adlar.push(ad!)
  for (const [, ad] of KAYNAK.matchAll(/\bid="([A-Za-z0-9]+)"/g)) adlar.push(ad!)
  return adlar
}

function kaynakDosyalari(): string[] {
  return readdirSync(DIZIN)
    .filter((ad) => (ad.endsWith('.tsx') || ad.endsWith('.css')) && ad !== 'SahneDefs.tsx')
    .map((ad) => join(DIZIN, ad))
}

test('sahneDefs_kimlikler_tekrarEtmez', () => {
  const adlar = tanimlananlar()
  assert.ok(adlar.length >= 20, `beklenenden az tanım: ${adlar.length}`)
  assert.deepEqual([...new Set(adlar)], adlar, 'aynı kimlik iki kez tanımlı')
})

test('sahneDefs_herBasvuru_tanimli_veBaskaDefsYok', () => {
  const tanimli = new Set(tanimlananlar())
  const eksik: string[] = []
  const yabanci: string[] = []
  for (const yol of kaynakDosyalari()) {
    const metin = readFileSync(yol, 'utf8')
    for (const [, ad] of metin.matchAll(/url\(#([A-Za-z0-9]+)\)/g)) {
      if (!tanimli.has(ad!)) eksik.push(`${yol}: ${ad}`)
    }
    if (/<defs>|<(linear|radial)Gradient|<filter\s/.test(metin)) yabanci.push(yol)
  }
  assert.deepEqual(eksik, [], 'url(#…) başvurusunun SahneDefs’te karşılığı yok')
  assert.deepEqual(yabanci, [], 'gradyan ya da filtre yalnız SahneDefs.tsx içinde tanımlanır')
})
