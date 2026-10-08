import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tr } from '../content/tr/index.ts'
import { en } from '../content/en/index.ts'
import {
  barCapalari,
  cekmeceLinkleri,
  ustBarVaryanti,
} from './kabuk.ts'
import type { RotaAnahtari } from './site.ts'

const ROTALAR: RotaAnahtari[] = ['ana', 'menu', 'galeri', 'hikaye', 'konum', 'gizlilik']

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
    ['#ocakbasi', '#ikramlar', '#icecekler', 'hikaye', 'konum'],
  )
})

/**
 * Galeri üç barda var, menü barında yok. Ölçüm: altıncı öğe menü barının satırını
 * 803px'e çıkarıyor ve 781-802px bandında CTA ekran dışına taşıyor (bkz. kabuk.ts).
 * Bu bilinçli bir istisna; sessizce geri eklenirse o bant yeniden kırılır.
 */
test('ustBar_galeri_menuBarindaYokDigerUcundeVar', () => {
  const galeriVarMi = (rota: RotaAnahtari) =>
    ustBarVaryanti(rota).nav.some((o) => o.tur === 'rota' && o.rota === 'galeri')
  assert.equal(galeriVarMi('menu'), false)
  for (const rota of ['ana', 'hikaye', 'konum', 'gizlilik'] as const) {
    assert.equal(galeriVarMi(rota), true, rota)
  }
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

test('ustBar_icSayfaNavi_bulunulanRotayiIcerir', () => {
  for (const rota of ['hikaye', 'konum', 'galeri'] as const) {
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

/**
 * Çekmece dar ekranda üst gezinmenin TEK hali: masaüstü nav 780px altında düşer.
 * Bir rota buradan eksikse o sayfaya üst gezinmeden hiç girilemez. Galeri rotası
 * açıldığında çekmecenin elle yazılmış listesi güncellenmedi ve tam bu oldu.
 */
test('cekmece_icerikRotalarininHepsiniTasir', () => {
  assert.deepEqual(
    cekmeceLinkleri().map((l) => l.rota),
    ['menu', 'hikaye', 'konum', 'galeri'],
  )
})

/** Oyun kabuğu iç sayfa kabuğudur: raysız bar, iç nav, harici yol tarifi CTA'sı. */
test('ustBar_oyun_icSayfaVaryantiTasir', () => {
  const oyun = ustBarVaryanti('oyun')
  assert.equal(oyun.anaVaryantMi, false)
  assert.deepEqual(oyun.nav, ustBarVaryanti('galeri').nav)
  assert.deepEqual(oyun.cta, { tur: 'harici' })
})

/** Oyun nav'da ve çekmecede yok: yalnız kampanya bağlantısıyla gelinir (spec §19 karar 8, 8 Ekim 2026). */
test('oyun_navdaVeCekmecedeYok', () => {
  for (const rota of [...ROTALAR, 'oyun'] as const) {
    assert.equal(
      ustBarVaryanti(rota).nav.some((o) => o.tur === 'rota' && (o.rota as string) === 'oyun'),
      false,
      rota,
    )
  }
  assert.equal(cekmeceLinkleri().some((l) => (l.rota as string) === 'oyun'), false)
})

/** Çekmece etiketleri de sözlükten gelir, elle yazılmaz. */
test('cekmece_etiketleri_sozlukteKarsiligiVar', () => {
  for (const link of cekmeceLinkleri()) {
    for (const s of [tr, en]) {
      assert.equal(typeof s.ortak.nav[link.etiket], 'string', link.rota)
    }
  }
})



/**
 * Menü sayfasının üç bölüm çapası masaüstünde menü barında durur, dar ekranda
 * hiçbir yerde yoktu. Çekmecede Menü satırının altına iner; liste elle yazılmaz,
 * menü barının kendi çapalarından türer ki ikisi ayrışamasın.
 */
test('cekmece_menuAltCapalari_menuBarininCapalariylaAyni', () => {
  const menu = cekmeceLinkleri().find((l) => l.rota === 'menu')
  assert.ok(menu)
  assert.deepEqual(
    menu.altlar.map((a) => `#${a.hedef}`),
    ustBarVaryanti('menu').nav.flatMap((o) => (o.tur === 'capa' ? [`#${o.hedef}`] : [])),
  )
  assert.deepEqual(menu.altlar.map((a) => a.hedef), ['ocakbasi', 'ikramlar', 'icecekler'])
})

/** Öteki üç sayfanın barında çapa yok; çekmecede de alt satır açılmaz. */
test('cekmece_digerLinklerde_altCapaYok', () => {
  for (const link of cekmeceLinkleri()) {
    if (link.rota === 'menu') continue
    assert.deepEqual(link.altlar, [], link.rota)
  }
})

/** Alt çapa etiketleri de iki sözlükte var. */
test('cekmece_altCapaEtiketleri_sozlukteKarsiligiVar', () => {
  for (const link of cekmeceLinkleri()) {
    for (const alt of link.altlar) {
      for (const s of [tr, en]) {
        assert.equal(typeof s.ortak.nav[alt.etiket], 'string', alt.hedef)
      }
    }
  }
})

/**
 * Bir rotanın bar çapaları iki yerde tüketiliyor: çekmecenin alt satırı ve menü
 * sayfasının atlama çipleri. Tek isim, tek türetme.
 */
test('barCapalari_menuRotasi_ucBolumCapasiDoner', () => {
  assert.deepEqual(
    barCapalari('menu').map((c) => c.hedef),
    ['ocakbasi', 'ikramlar', 'icecekler'],
  )
})

test('barCapalari_capasizRotalar_bosDoner', () => {
  for (const rota of ROTALAR) {
    if (rota === 'menu' || rota === 'ana') continue
    assert.deepEqual(barCapalari(rota), [], rota)
  }
})

test('barCapalari_anaRotasi_geceCapasiniTasir', () => {
  assert.deepEqual(
    barCapalari('ana').map((c) => c.hedef),
    ['gece'],
  )
})
