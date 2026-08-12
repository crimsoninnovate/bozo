// styles/animasyon.test.ts
//
// Bu testin varlık sebebi: CSS Modules (Next 16 / Turbopack / lightningcss) bir
// `.module.css` içindeki HER `animation-name` değerini modül-yerel bir hash'e
// çevirir, o adda bir `@keyframes` orada tanımlı olmasa bile. Keyframe global bir
// sayfada durursa hash'li ad hiçbir zaman çözülmez, animasyon sessizce hiç
// kurulmaz: derleme geçer, tarayıcı uyarmaz, `getAnimations()` boş döner.
// Task 16'da beş sayfada 42 bildirimin 42'si böyle ölüydü.
//
// Son test derleme çıktısını okur, yani önce `npm run build` gerekir; `out/` yoksa
// atlanır. İlk iki test kaynak ağacında koşar, derleme istemez.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KOK = fileURLToPath(new URL('../', import.meta.url))

/** `animation` kısayolunda ad OLMAYAN parçalar. */
const ANAHTAR_KELIMELER = new Set([
  'normal', 'reverse', 'alternate', 'alternate-reverse',
  'none', 'forwards', 'backwards', 'both',
  'running', 'paused', 'infinite',
  'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end',
  'initial', 'inherit', 'unset', 'revert', 'revert-layer',
])

function cssDosyalari(dizin: string, bulunan: string[] = []): string[] {
  for (const giris of readdirSync(dizin, { withFileTypes: true })) {
    if (giris.name === 'node_modules' || giris.name.startsWith('.')) continue
    const tam = join(dizin, giris.name)
    if (giris.isDirectory()) cssDosyalari(tam, bulunan)
    else if (giris.name.endsWith('.css')) bulunan.push(tam)
  }
  return bulunan
}

const yorumsuz = (css: string): string =>
  css.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/!\s*important/gi, ' ')

function tanimlananlar(css: string): Set<string> {
  const adlar = new Set<string>()
  for (const [, ad] of yorumsuz(css).matchAll(/@keyframes\s+([\w-]+)/g)) {
    if (ad) adlar.add(ad)
  }
  return adlar
}

/** `animation` ve `animation-name` bildirimlerinde geçen keyframe adları. */
function kullanilanlar(css: string): Set<string> {
  const adlar = new Set<string>()
  const govde = yorumsuz(css)

  for (const [, deger] of govde.matchAll(/animation-name\s*:\s*([^;}]+)/g)) {
    for (const parca of (deger ?? '').split(',')) {
      const ad = parca.trim()
      if (ad && ad !== 'none' && !ANAHTAR_KELIMELER.has(ad)) adlar.add(ad)
    }
  }

  for (const [, deger] of govde.matchAll(/(?<![-\w])animation\s*:\s*([^;}]+)/g)) {
    for (const katman of (deger ?? '').split(',')) {
      // fonksiyonların (cubic-bezier, steps) içindeki virgüller ayrıştırmayı
      // bozmasın diye önce fonksiyon çağrıları düşürülür
      const sade = katman.replace(/[\w-]+\([^)]*\)/g, ' ')
      for (const jeton of sade.trim().split(/\s+/)) {
        if (!jeton) continue
        if (/^-?[\d.]+m?s$/.test(jeton)) continue // süre / gecikme
        if (/^-?[\d.]+$/.test(jeton)) continue // yineleme sayısı
        if (ANAHTAR_KELIMELER.has(jeton)) continue
        adlar.add(jeton)
      }
    }
  }
  return adlar
}

test('modulCssleri_animasyonAdi_ayniDosyadaKeyframeTanimli', () => {
  const modulleri = cssDosyalari(KOK).filter((y) => y.endsWith('.module.css'))
  assert.ok(modulleri.length > 0, 'hiç .module.css bulunamadı, test yanlış dizinde koşuyor')

  const yetimler: string[] = []
  for (const yol of modulleri) {
    const css = readFileSync(yol, 'utf8')
    const tanimli = tanimlananlar(css)
    for (const ad of kullanilanlar(css)) {
      if (!tanimli.has(ad)) yetimler.push(`${yol.slice(KOK.length)}: ${ad}`)
    }
  }

  assert.deepEqual(
    yetimler,
    [],
    'Bu adların @keyframes tanımı AYNI modül dosyasında olmalı; global bir sayfada ' +
      'durursa CSS Modules hash yüzünden animasyon hiç kurulmaz:\n' +
      yetimler.join('\n'),
  )
})

test('globalCssleri_animasyonAdi_globalKeyframeTanimli', () => {
  const globaller = cssDosyalari(join(KOK, 'styles')).filter((y) => !y.endsWith('.module.css'))
  const tanimli = new Set<string>()
  for (const yol of globaller) {
    for (const ad of tanimlananlar(readFileSync(yol, 'utf8'))) tanimli.add(ad)
  }

  const yetimler: string[] = []
  for (const yol of globaller) {
    for (const ad of kullanilanlar(readFileSync(yol, 'utf8'))) {
      if (!tanimli.has(ad)) yetimler.push(`${yol.slice(KOK.length)}: ${ad}`)
    }
  }
  assert.deepEqual(yetimler, [], `global sayfalarda karşılıksız animasyon adı:\n${yetimler.join('\n')}`)
})

test('derlemeCiktisi_animasyonAdi_keyframeKarsiligiVar', (t) => {
  const cikti = join(KOK, 'out')
  if (!existsSync(cikti)) {
    t.skip('out/ yok; önce `npm run build`')
    return
  }

  const tanimli = new Set<string>()
  const dosyalar = cssDosyalari(cikti)
  for (const yol of dosyalar) {
    for (const ad of tanimlananlar(readFileSync(yol, 'utf8'))) tanimli.add(ad)
  }

  const yetimler: string[] = []
  for (const yol of dosyalar) {
    for (const ad of kullanilanlar(readFileSync(yol, 'utf8'))) {
      if (!tanimli.has(ad)) yetimler.push(`${yol.slice(KOK.length)}: ${ad}`)
    }
  }
  assert.deepEqual(yetimler, [], `derlenmiş CSS'te karşılıksız animasyon adı:\n${yetimler.join('\n')}`)
})
