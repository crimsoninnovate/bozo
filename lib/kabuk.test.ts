import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tr } from '../content/tr/index.ts'
import { en } from '../content/en/index.ts'
import { altBilgiSayfaLinkleri, altBilgiVaryanti, geceSeridiGosterilirMi, ustBarVaryanti } from './kabuk.ts'
import type { RotaAnahtari } from './site.ts'

const ROTALAR: RotaAnahtari[] = ['ana', 'menu', 'hikaye', 'konum', 'gizlilik']

/**
 * Ana sayfa barı 2px ilerleme rayı + 80px satır (Ana:41,46); iç sayfalarda ray
 * yok ve satır 78px (Menu/Hikaye/Konum:37,42). Tek ayrım noktası bu bayrak.
 */
test('ustBar_ilerlemeRayiYalnizAnaSayfada', () => {
  for (const rota of ROTALAR) {
    assert.equal(ustBarVaryanti(rota).anaVaryantMi, rota === 'ana', rota)
  }
})

test('ustBar_menuNavi_ucCapaVeIkiRotaTasir', () => {
  const nav = ustBarVaryanti('menu').nav
  assert.deepEqual(
    nav.map((o) => (o.tur === 'capa' ? `#${o.hedef}` : o.rota)),
    ['#ocaktan', '#ikramlar', '#icecekler', 'hikaye', 'konum'],
  )
})

/**
 * Menü sayfasında aktif sekme yoktur (Menu:50-54: hiçbir öğe tangerine alt
 * çizgi taşımaz). Kabuk bunu ayrı bir bayrakla değil, "navda bulunulan rota
 * yoksa aktif de yok" kuralıyla üretir; kural bozulursa menüde yanlış bir
 * aria-current="page" belirir.
 */
test('ustBar_menuNavi_bulunulanRotayiIcermez', () => {
  assert.equal(
    ustBarVaryanti('menu').nav.some((o) => o.tur === 'rota' && o.rota === 'menu'),
    false,
  )
})

test('ustBar_hikayeVeKonumNavi_bulunulanRotayiIcerir', () => {
  for (const rota of ['hikaye', 'konum'] as const) {
    assert.ok(
      ustBarVaryanti(rota).nav.some((o) => o.tur === 'rota' && o.rota === rota),
      rota,
    )
  }
})

/** Üç ayrı CTA hedefi: Ana/Menü harici, Hikaye Konum sayfası, Konum #harita. */
test('ustBar_ctaHedefi_sayfayaGoreAyrisir', () => {
  assert.deepEqual(ustBarVaryanti('ana').cta, { tur: 'harici' })
  assert.deepEqual(ustBarVaryanti('menu').cta, { tur: 'harici' })
  assert.deepEqual(ustBarVaryanti('hikaye').cta, { tur: 'rota', rota: 'konum' })
  assert.deepEqual(ustBarVaryanti('konum').cta, { tur: 'capa', hedef: 'harita' })
})

/** Her nav etiketi sözlükte gerçekten var; iki dil de aynı anahtarları taşır. */
test('ustBar_navEtiketleri_sozlukteKarsiligiVar', () => {
  for (const rota of ROTALAR) {
    for (const oge of ustBarVaryanti(rota).nav) {
      for (const s of [tr, en]) {
        assert.equal(typeof s.ortak.nav[oge.etiket], 'string', `${rota}/${oge.etiket}`)
      }
    }
  }
})

test('altBilgi_varyanti_menuSeritDigerleriKolonlu', () => {
  assert.equal(altBilgiVaryanti('ana'), 'tam')
  assert.equal(altBilgiVaryanti('gizlilik'), 'tam')
  assert.equal(altBilgiVaryanti('hikaye'), 'sayfalar')
  assert.equal(altBilgiVaryanti('konum'), 'sayfalar')
  assert.equal(altBilgiVaryanti('menu'), 'serit')
})

/** Hikaye:142-144 ile birebir; Konum'da kural uygulanır, bkz. kabuk.ts notu. */
test('altBilgi_sayfaLinkleri_bulunulanSayfayiIcermez', () => {
  assert.deepEqual(
    altBilgiSayfaLinkleri('hikaye').map((l) => l.rota),
    ['ana', 'menu', 'konum'],
  )
  assert.deepEqual(
    altBilgiSayfaLinkleri('konum').map((l) => l.rota),
    ['ana', 'menu', 'hikaye'],
  )
})

/** Şerit yalnız hero durum çipi ve canlı saati olmayan iki rotada tek kaynaktır. */
test('geceSeridi_yalnizCanliGostergesizRotalarda', () => {
  for (const rota of ROTALAR) {
    assert.equal(geceSeridiGosterilirMi(rota), rota === 'hikaye' || rota === 'gizlilik', rota)
  }
})

test('altBilgi_sayfaLinkleri_etiketleriSozluktenGelir', () => {
  for (const link of altBilgiSayfaLinkleri('hikaye')) {
    for (const s of [tr, en]) {
      assert.equal(typeof s.ortak.nav[link.etiket], 'string', link.rota)
    }
  }
  assert.equal(altBilgiSayfaLinkleri('hikaye')[0]?.etiket, 'anaSayfa')
})
