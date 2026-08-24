// styles/palet.test.ts
//
// Bu testin varlık sebebi: zemin ailesi 21 Ağustos 2026'da iki palet dosyasına
// bölündü (`palet/bordo.css` aktif, `palet/siyah.css` korunuyor) ve aynı anda
// yalnız biri içe aktarılır. Pasif dosya derlemeye girmediği için ona hiçbir şey
// dokunmaz: aktif palete token eklenip pasifi unutulursa, geçiş yapıldığı gün
// site tanımsız custom property'lerle açılır ve o değerler sessizce boş string
// döner, yani zemin şeffaf kalır. Derleme de tarayıcı da uyarmaz.
//
// Kaynak ağacında koşar, derleme istemez.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KOK = fileURLToPath(new URL('../', import.meta.url))

const oku = (gorece: string): string => readFileSync(KOK + gorece, 'utf8')

function cssDosyalari(gorece: string, bulunan: string[] = []): string[] {
  for (const giris of readdirSync(KOK + gorece, { withFileTypes: true })) {
    if (giris.name.startsWith('.')) continue
    const yol = join(gorece, giris.name)
    if (giris.isDirectory()) cssDosyalari(yol, bulunan)
    else if (giris.name.endsWith('.css')) bulunan.push(yol)
  }
  return bulunan
}

const yorumsuz = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, ' ')

/** Dosyanın TANIMLADIĞI custom property adları (kullandıkları değil). */
function tanimlananlar(css: string): Set<string> {
  const adlar = new Set<string>()
  for (const [, ad] of yorumsuz(css).matchAll(/(--[\w-]+)\s*:/g)) if (ad) adlar.add(ad)
  return adlar
}

const PALETLER = ['styles/palet/bordo.css', 'styles/palet/siyah.css'] as const

test('iki palet ayni token setini tanimlar', () => {
  const bordo = tanimlananlar(oku('styles/palet/bordo.css'))
  const siyah = tanimlananlar(oku('styles/palet/siyah.css'))

  const yalnizBordo = [...bordo].filter((ad) => !siyah.has(ad)).sort()
  const yalnizSiyah = [...siyah].filter((ad) => !bordo.has(ad)).sort()

  assert.deepEqual(
    { yalnizBordo, yalnizSiyah },
    { yalnizBordo: [], yalnizSiyah: [] },
    'Bir palete eklenen token ötekine de eklenmeli, yoksa geçiş günü tanımsız kalır.',
  )
})

test('paletler bos degil', () => {
  for (const yol of PALETLER) {
    assert.ok(tanimlananlar(oku(yol)).size > 20, `${yol} beklenenden az token tanımlıyor`)
  }
})

test('globals.css tam olarak bir palet ice aktarir', () => {
  const satirlar = oku('app/globals.css')
    .split('\n')
    .filter((s) => /@import\s+['"][^'"]*palet\//.test(s))

  assert.equal(satirlar.length, 1, 'Aynı anda yalnız bir palet aktif olmalı.')
  assert.match(satirlar[0]!, /palet\/(bordo|siyah)\.css/)
})

/** Palete ait rgb üçlüleri: iki paletin zemini, kömürü ve koru. */
const PALET_RGB = [
  [11, 15, 15], [35, 13, 11], // zemin
  [19, 24, 23], [44, 18, 16], // kömür
  [173, 38, 36], [184, 43, 39], // kor
] as const

const PALET_LITERALI = new RegExp(
  PALET_RGB.map(([r, g, b]) => `rgba?\\(\\s*${r},\\s*${g},\\s*${b}\\b[^)]*\\)`).join('|'),
  'g',
)

test('palet renkleri palet disinda literal olarak gecmez', () => {
  // Palet rengini modülde sabitlemek takası sessizce yarım bırakır: token değişir,
  // literal değişmez. 21 Ağustos 2026'da 24 tanesi bulundu (9 zemin, 15 kor); kor
  // olanları ilk tarama kaçırmıştı çünkü yalnız zemin rgb'si aranmıştı.
  const kacaklar: string[] = []
  for (const yol of [...cssDosyalari('components'), 'styles/tokens.css', 'styles/reset.css', 'styles/animasyonlar.css']) {
    for (const [eslesme] of yorumsuz(oku(yol)).matchAll(PALET_LITERALI)) {
      kacaklar.push(`${yol}: ${eslesme}`)
    }
  }
  assert.deepEqual(kacaklar, [], 'Palet rengi yalnız styles/palet/*.css içinde literal olabilir.')
})

/**
 * CLAUDE.md'nin renk tablosu ile palet dosyaları.
 *
 * Bu testin varlık sebebi ölçülmüş bir kaçak: 23 Ağustos 2026'da zemin ailesi iki
 * kademe koyulaştı ama CLAUDE.md güncellenmedi ve tablo 24 Ağustos'a kadar tam bir
 * sürüm geride kaldı, altı değerin altısı da yanlıştı. CLAUDE.md bağlayıcı talimat
 * olduğu için oradan okuyan biri yanlış literal yazardı. Yukarıdaki testler paletlerin
 * BİRBİRİNDEN ayrışmasını yakalıyordu, dokümandan ayrışmasını yakalamıyordu.
 */
const HEX = /(--[\w-]+)\s*:\s*(#[0-9A-Fa-f]{6})\s*;/g
const TABLO_SATIRI = /^\|\s*`(--[\w-]+)`[^|]*\|\s*`(#[0-9A-Fa-f]{6})`\s*\|\s*`(#[0-9A-Fa-f]{6})`\s*\|/gm

/** Dosyanın hex değerli token'ları. rgba() olanlar tabloya girmez, kapsam dışı. */
function hexTokenlari(css: string): Map<string, string> {
  const m = new Map<string, string>()
  for (const [, ad, deger] of yorumsuz(css).matchAll(HEX)) m.set(ad!, deger!.toUpperCase())
  return m
}

function claudeTablosu(): Map<string, { bordo: string; siyah: string }> {
  const satirlar = new Map<string, { bordo: string; siyah: string }>()
  for (const [, ad, bordo, siyah] of oku('CLAUDE.md').matchAll(TABLO_SATIRI)) {
    satirlar.set(ad!, { bordo: bordo!.toUpperCase(), siyah: siyah!.toUpperCase() })
  }
  return satirlar
}

test('CLAUDEmd_renkTablosu_paletDosyalariylaAyniDegerleriTasir', () => {
  const tablo = claudeTablosu()
  const bordo = hexTokenlari(oku('styles/palet/bordo.css'))
  const siyah = hexTokenlari(oku('styles/palet/siyah.css'))

  assert.ok(tablo.size > 0, 'CLAUDE.md > Colors tablosu okunamadı; biçimi mi değişti?')

  const sapmalar: string[] = []
  for (const [ad, yazan] of tablo) {
    const gercek = { bordo: bordo.get(ad), siyah: siyah.get(ad) }
    if (gercek.bordo !== yazan.bordo) {
      sapmalar.push(`${ad} bordo: CLAUDE.md ${yazan.bordo}, palet ${gercek.bordo ?? 'YOK'}`)
    }
    if (gercek.siyah !== yazan.siyah) {
      sapmalar.push(`${ad} siyah: CLAUDE.md ${yazan.siyah}, palet ${gercek.siyah ?? 'YOK'}`)
    }
  }
  assert.deepEqual(sapmalar, [], 'CLAUDE.md bağlayıcı talimat; paletle ayrışamaz.')
})

test('CLAUDEmd_renkTablosu_paletinHerHexTokeniniKapsar', () => {
  // Ters yön: palete yeni bir hex token girip tabloya yazılmazsa, "complete list,
  // do not add others" başlığı yalan söylemeye başlar.
  const tablo = claudeTablosu()
  const eksikler = [...hexTokenlari(oku('styles/palet/bordo.css')).keys()]
    .filter((ad) => !tablo.has(ad))
    .sort()

  assert.deepEqual(eksikler, [], 'Palete giren her hex token CLAUDE.md tablosunda da olmalı.')
})
