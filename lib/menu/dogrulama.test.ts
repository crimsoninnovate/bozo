import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { menuBelgesiDogrula } from './dogrulama.ts'
import type { Sonuc } from './dogrulama.ts'
import type { MenuBelgesi } from './tipler.ts'

const varsayilan = JSON.parse(
  readFileSync(new URL('../../content/menu.varsayilan.json', import.meta.url), 'utf8'),
) as MenuBelgesi

function al<T>(liste: readonly T[], n: number): T {
  const oge = liste[n]
  assert.ok(oge !== undefined, `oge yok: ${n}`)
  return oge
}

function varsayilanKopya(degisiklik?: (b: MenuBelgesi) => void): MenuBelgesi {
  const kopya = structuredClone(varsayilan)
  degisiklik?.(kopya)
  return kopya
}

function reddedilen(sonuc: Sonuc) {
  assert.equal(sonuc.tamam, false)
  return sonuc.tamam ? [] : sonuc.hatalar
}

test('dogrulama_varsayilan_tamam', () => {
  const sonuc = menuBelgesiDogrula(varsayilanKopya())
  assert.equal(sonuc.tamam, true)
  if (sonuc.tamam) {
    assert.deepEqual(sonuc.belge, varsayilan)
    assert.deepEqual(sonuc.uyarilar, [])
  }
})

test('dogrulama_donenBelge_girdiyleReferansPaylasmaz', () => {
  const girdi = varsayilanKopya()
  const sonuc = menuBelgesiDogrula(girdi)
  assert.ok(sonuc.tamam)
  if (sonuc.tamam) {
    assert.notEqual(sonuc.belge, girdi)
    assert.notEqual(al(sonuc.belge.kalemler, 0), al(girdi.kalemler, 0))
    assert.notEqual(al(sonuc.belge.kalemler, 0).ad, al(girdi.kalemler, 0).ad)
  }
})

test('dogrulama_fiyat8500_gecerliAraliktadir', () => {
  const sonuc = menuBelgesiDogrula(varsayilanKopya((b) => { al(b.kalemler, 0).fiyatlar.porsiyon = 8500 }))
  assert.equal(sonuc.tamam, true)
})

test('dogrulama_fiyatKesirli_reddeder', () => {
  const hatalar = reddedilen(
    menuBelgesiDogrula(varsayilanKopya((b) => { al(b.kalemler, 2).fiyatlar.porsiyon = 85.5 })),
  )
  assert.equal(al(hatalar, 0).yol, 'kalemler[2].fiyatlar.porsiyon')
  assert.equal(al(hatalar, 0).kod, 'fiyat')
})

test('dogrulama_fiyatMetin_reddeder', () => {
  const girdi = varsayilanKopya()
  ;(al(girdi.kalemler, 0).fiyatlar as { porsiyon: unknown }).porsiyon = '850 TL'
  assert.equal(al(reddedilen(menuBelgesiDogrula(girdi)), 0).kod, 'fiyat')
})

test('dogrulama_fiyatSifir_reddeder', () => {
  const hatalar = reddedilen(menuBelgesiDogrula(varsayilanKopya((b) => { b.ozel.fiyat = 0 })))
  assert.equal(al(hatalar, 0).yol, 'ozel.fiyat')
})

test('dogrulama_fiyat100000_reddeder', () => {
  const hatalar = reddedilen(
    menuBelgesiDogrula(varsayilanKopya((b) => { al(al(b.icecekler, 0).olculer, 0).fiyat = 100000 })),
  )
  assert.equal(al(hatalar, 0).yol, 'icecekler[0].olculer[0].fiyat')
})

test('dogrulama_uzunTire_reddeder', () => {
  for (const tire of ['—', '–']) {
    const hatalar = reddedilen(
      menuBelgesiDogrula(varsayilanKopya((b) => { al(b.kalemler, 0).ad.tr = `Ciğer ${tire} Urfa` })),
    )
    assert.equal(al(hatalar, 0).kod, 'tire')
  }
})

test('dogrulama_sapkaliHarf_reddeder', () => {
  const hatalar = reddedilen(
    menuBelgesiDogrula(varsayilanKopya((b) => { al(b.kalemler, 1).ad.tr = 'Kebâp' })),
  )
  assert.equal(al(hatalar, 0).kod, 'sapka')
  assert.equal(al(hatalar, 0).yol, 'kalemler[1].ad.tr')
})

test('dogrulama_buyukHarfCumle_reddeder', () => {
  const hatalar = reddedilen(
    menuBelgesiDogrula(varsayilanKopya((b) => {
      al(b.kalemler, 0).aciklama = { tr: 'EN TAZE CİĞER BURADA', en: 'Fresh liver' }
    })),
  )
  assert.equal(al(hatalar, 0).kod, 'buyukHarf')
})

test('dogrulama_kisaKisaltma_buyukHarfSayilmaz', () => {
  const sonuc = menuBelgesiDogrula(varsayilanKopya((b) => {
    al(b.kalemler, 0).porsiyonNotu = { tr: '10 ŞİŞ TL', en: '10 skewers' }
  }))
  assert.equal(sonuc.tamam, true)
})

test('dogrulama_enBos_reddeder', () => {
  const hatalar = reddedilen(
    menuBelgesiDogrula(varsayilanKopya((b) => { al(b.kalemler, 0).ad.en = '   ' })),
  )
  assert.equal(al(hatalar, 0).kod, 'bos')
  assert.equal(al(hatalar, 0).yol, 'kalemler[0].ad.en')
})

test('dogrulama_notNull_serbest', () => {
  const sonuc = menuBelgesiDogrula(varsayilanKopya((b) => {
    al(b.kalemler, 0).aciklama = null
    al(b.kalemler, 0).porsiyonNotu = null
    al(b.kalemler, 0).durumNotu = null
  }))
  assert.equal(sonuc.tamam, true)
})

test('dogrulama_uzunluklar_sinirdaReddeder', () => {
  const dene = (degisiklik: (b: MenuBelgesi) => void) =>
    menuBelgesiDogrula(varsayilanKopya(degisiklik)).tamam
  assert.equal(dene((b) => { al(b.kalemler, 0).ad.tr = 'a'.repeat(60) }), true)
  assert.equal(dene((b) => { al(b.kalemler, 0).ad.tr = 'a'.repeat(61) }), false)
  assert.equal(dene((b) => { al(b.kalemler, 0).aciklama = { tr: 'a'.repeat(240), en: 'a' } }), true)
  assert.equal(dene((b) => { al(b.kalemler, 0).aciklama = { tr: 'a'.repeat(241), en: 'a' } }), false)
  assert.equal(dene((b) => { al(b.kalemler, 0).porsiyonNotu = { tr: 'a'.repeat(40), en: 'a' } }), true)
  assert.equal(dene((b) => { al(b.kalemler, 0).porsiyonNotu = { tr: 'a'.repeat(41), en: 'a' } }), false)
})

test('dogrulama_ilkKalemCigerDegilse_reddeder', () => {
  const hatalar = reddedilen(
    menuBelgesiDogrula(varsayilanKopya((b) => { b.kalemler.reverse() })),
  )
  assert.ok(hatalar.some((h) => h.kod === 'ilkKalem'))
})

test('dogrulama_tekrarKimlik_reddeder', () => {
  const hatalar = reddedilen(
    menuBelgesiDogrula(varsayilanKopya((b) => { al(b.kalemler, 2).id = 'dalak' })),
  )
  assert.ok(hatalar.some((h) => h.kod === 'tekrar' && h.yol === 'kalemler[2].id'))
})

test('dogrulama_kimlikBicimi_reddeder', () => {
  const hatalar = reddedilen(
    menuBelgesiDogrula(varsayilanKopya((b) => { al(b.kalemler, 2).id = 'Yurek Kebabi' })),
  )
  assert.ok(hatalar.some((h) => h.kod === 'kimlik'))
})

test('dogrulama_bilinmeyenFotoId_reddeder', () => {
  const girdi = varsayilanKopya()
  ;(al(girdi.kalemler, 0) as { fotoId: unknown }).fotoId = 'olmayan-foto'
  const hatalar = reddedilen(menuBelgesiDogrula(girdi))
  assert.equal(al(hatalar, 0).kod, 'foto')
})

test('dogrulama_bilinmeyenAlan_reddeder', () => {
  const girdi = { ...varsayilanKopya(), ekstra: 1 }
  assert.equal(al(reddedilen(menuBelgesiDogrula(girdi)), 0).kod, 'bilinmeyenAlan')
  const ic = varsayilanKopya()
  ;(al(ic.kalemler, 0) as unknown as Record<string, unknown>).indirim = 10
  assert.equal(al(reddedilen(menuBelgesiDogrula(ic)), 0).yol, 'kalemler[0].indirim')
})

test('dogrulama_durumVarPorsiyonYok_reddeder', () => {
  const girdi = varsayilanKopya()
  ;(al(girdi.kalemler, 0) as { fiyatlar: unknown }).fiyatlar = { durum: 690 }
  assert.ok(reddedilen(menuBelgesiDogrula(girdi)).some((h) => h.kod === 'durum'))
})

test('dogrulama_kalemVeIcecekSayisi_sinirdaReddeder', () => {
  const kalemEkle = (n: number) => varsayilanKopya((b) => {
    while (b.kalemler.length < n) {
      const kopya = structuredClone(al(b.kalemler, 1))
      kopya.id = `kalem-${b.kalemler.length}`
      b.kalemler.push(kopya)
    }
  })
  assert.equal(menuBelgesiDogrula(kalemEkle(40)).tamam, true)
  assert.ok(reddedilen(menuBelgesiDogrula(kalemEkle(41))).some((h) => h.kod === 'cokFazla'))
  const icecekEkle = (n: number) => varsayilanKopya((b) => {
    while (b.icecekler.length < n) {
      const kopya = structuredClone(al(b.icecekler, 0))
      kopya.id = `icecek-${b.icecekler.length}`
      b.icecekler.push(kopya)
    }
  })
  assert.equal(menuBelgesiDogrula(icecekEkle(30)).tamam, true)
  assert.ok(reddedilen(menuBelgesiDogrula(icecekEkle(31))).some((h) => h.kod === 'cokFazla'))
})

test('dogrulama_icecekOlcusuYok_reddeder', () => {
  const hatalar = reddedilen(
    menuBelgesiDogrula(varsayilanKopya((b) => { al(b.icecekler, 0).olculer = [] })),
  )
  assert.equal(al(hatalar, 0).yol, 'icecekler[0].olculer')
})

test('dogrulama_musteriKelimesi_uyariVerir', () => {
  const sonuc = menuBelgesiDogrula(varsayilanKopya((b) => {
    al(b.kalemler, 0).aciklama = { tr: 'Müşterilerimize özel.', en: 'For our guests.' }
  }))
  assert.equal(sonuc.tamam, true)
  if (sonuc.tamam) {
    assert.equal(sonuc.uyarilar.length, 1)
    assert.equal(al(sonuc.uyarilar, 0).yol, 'kalemler[0].aciklama.tr')
    assert.match(al(sonuc.uyarilar, 0).metin, /misafir/)
  }
})

test('dogrulama_yasakTerimler_hepsiUyariVerir', () => {
  for (const kelime of ['bedava', 'mangal', 'şef', 'parça', 'adet', 'masa', '7/24']) {
    const sonuc = menuBelgesiDogrula(varsayilanKopya((b) => {
      al(b.kalemler, 0).aciklama = { tr: `Bir ${kelime} yazısı`, en: 'Fine' }
    }))
    assert.ok(sonuc.tamam && sonuc.uyarilar.length === 1, kelime)
  }
})

test('dogrulama_nullVeUndefined_reddederCokmeden', () => {
  const hostil: unknown[] = [
    null, undefined, 0, 'metin', [], {}, { kalemler: null }, { kalemler: [], ozel: {}, icecekler: [] },
    { kalemler: [null, 1, 'x'], ozel: null, icecekler: {} }, JSON.parse('{"__proto__": {"x": 1}}'),
    { kalemler: [{ id: 'x'.repeat(1e6), ad: { tr: 'a'.repeat(1e6), en: 5 } }], ozel: [], icecekler: [[]] },
  ]
  for (const girdi of hostil) {
    const sonuc = menuBelgesiDogrula(girdi)
    assert.equal(sonuc.tamam, false)
    if (!sonuc.tamam) assert.ok(sonuc.hatalar.length > 0)
  }
})
