// styles/odak.test.ts
//
// Bu testin varlık sebebi: odak halkasının yokluğu sessizdir. Site on rota boyunca
// tarayıcı varsayılanına düşüyordu (Chrome'da outline:auto 1px rgb(0,95,204)) ve
// derleme geçiyor, konsol susuyor, ekran görüntüsü kusursuz görünüyordu; eksiklik
// yalnız klavyeyle gezen birine görünürdü. Aynı sessizlik iki yoldan geri gelebilir:
// kural silinirse ya da azaltılmış hareket bloğu `outline`'a da el atarsa.
//
// Son test derleme çıktısını okur, yani önce `npm run build` gerekir; `out/` yoksa
// atlanır. İlk iki test kaynak ağacında koşar.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KOK = fileURLToPath(new URL('../', import.meta.url))

function cssDosyalari(dizin: string, bulunan: string[] = []): string[] {
  for (const giris of readdirSync(dizin, { withFileTypes: true })) {
    if (giris.name === 'node_modules' || giris.name.startsWith('.')) continue
    const tam = join(dizin, giris.name)
    if (giris.isDirectory()) cssDosyalari(tam, bulunan)
    else if (giris.name.endsWith('.css')) bulunan.push(tam)
  }
  return bulunan
}

const yorumsuz = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, ' ')

/** `:focus-visible` seçicisi taşıyan ve içinde `outline` çizen blokların gövdeleri. */
function odakHalkalari(css: string): string[] {
  const govdeler: string[] = []
  for (const [, secici, govde] of yorumsuz(css).matchAll(/([^{}]*:focus-visible[^{}]*)\{([^{}]*)\}/g)) {
    if (/outline\s*:/.test(govde ?? '') && !/outline\s*:\s*(none|0)\b/.test(govde ?? '')) {
      govdeler.push(`${(secici ?? '').trim()}{${(govde ?? '').trim()}}`)
    }
  }
  return govdeler
}

test('reset_odakHalkasiTanimliVeTokendanGelir', () => {
  const css = readFileSync(join(KOK, 'styles/reset.css'), 'utf8')
  const halkalar = odakHalkalari(css)
  assert.ok(halkalar.length > 0, 'styles/reset.css bir :focus-visible outline kuralı taşımalı')
  for (const kural of halkalar) {
    assert.match(kural, /var\(--/, `Odak halkasının rengi token'dan gelmeli, ham değil: ${kural}`)
    assert.doesNotMatch(kural, /#[0-9a-f]{3,8}\b|rgba?\(/i, `Palet dışı ham renk: ${kural}`)
  }
})

/**
 * Halka bir geçiş değil kalıcı bir çerçevedir; azaltılmış hareket bloğu ona
 * dokunursa klavye kullanıcısı odağı tam da hareketi kapattığı için kaybeder.
 */
test('azaltilmisHareket_odakHalkasinaDokunmaz', () => {
  for (const yol of cssDosyalari(join(KOK, 'styles')).concat(cssDosyalari(join(KOK, 'components')))) {
    const css = yorumsuz(readFileSync(yol, 'utf8'))
    for (const [, govde] of css.matchAll(/@media[^{]*prefers-reduced-motion[^{]*\{([\s\S]*?\}\s*)\}/g)) {
      assert.doesNotMatch(
        govde ?? '',
        /outline/,
        `${yol.slice(KOK.length)}: azaltılmış hareket bloğu odak halkasını kapatamaz`,
      )
    }
  }
})

test('derlemeCiktisi_odakHalkasiVar', (t) => {
  const cikti = join(KOK, 'out')
  if (!existsSync(cikti)) {
    t.skip('out/ yok; önce `npm run build`')
    return
  }
  const halkaliDosya = cssDosyalari(cikti).filter((y) => odakHalkalari(readFileSync(y, 'utf8')).length > 0)
  assert.ok(halkaliDosya.length > 0, 'derlenmiş CSS bir :focus-visible outline kuralı taşımalı')
})
