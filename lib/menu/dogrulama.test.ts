import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { duyuruDogrula, menuBelgesiDogrula } from './dogrulama.ts'
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

test('dogrulama_icecekOlcusuAltidanFazla_cokFazlaReddeder', () => {
  const olcuEkle = (n: number) => varsayilanKopya((b) => {
    const i = al(b.icecekler, 0)
    i.olculer = Array.from({ length: n }, () => structuredClone(al(i.olculer, 0)))
  })
  assert.equal(menuBelgesiDogrula(olcuEkle(6)).tamam, true)
  const hatalar = reddedilen(menuBelgesiDogrula(olcuEkle(7)))
  assert.deepEqual([al(hatalar, 0).yol, al(hatalar, 0).kod], ['icecekler[0].olculer', 'cokFazla'])
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

test('dogrulama_ayrisikSapkaliHarf_reddeder', () => {
  const hatalar = reddedilen(menuBelgesiDogrula(varsayilanKopya((b) => {
    al(b.kalemler, 1).ad.tr = 'Keba\u0302p'.normalize('NFD')
  })))
  assert.equal(al(hatalar, 0).kod, 'sapka')
})

test('dogrulama_ayrisikBuyukHarf_reddeder', () => {
  const hatalar = reddedilen(menuBelgesiDogrula(varsayilanKopya((b) => {
    al(b.kalemler, 1).ad.tr = 'C\u0130GER'.normalize('NFD')
  })))
  assert.equal(al(hatalar, 0).kod, 'buyukHarf')
})

test('dogrulama_ayrisikMetin_belgedeBirlesikSaklanir', () => {
  const sonuc = menuBelgesiDogrula(varsayilanKopya((b) => {
    al(b.kalemler, 1).ad.tr = 'Dalak \u015Fi\u015F'.normalize('NFD')
  }))
  assert.ok(sonuc.tamam)
  if (sonuc.tamam) assert.equal(al(sonuc.belge.kalemler, 1).ad.tr, 'Dalak \u015Fi\u015F')
})

/* Belge v2: duyuru, tukendi, ikramlar, iletisim. */

type Ham = Record<string, unknown>
const ham = (degisiklik?: (b: Ham) => void): Ham => {
  const kopya = structuredClone(varsayilan) as unknown as Ham
  degisiklik?.(kopya)
  return kopya
}
const duyuruAyarla = (b: Ham, d: Ham) => { b['duyuru'] = d }
const duyuruYaz = (d: Ham): Ham => ({
  aktif: true, metin: { tr: 'Bayramda açığız', en: 'Open' }, bitis: null, ...d,
})
const hataKodu = (b: Ham, yol: string): string | undefined =>
  reddedilen(menuBelgesiDogrula(b)).find((h) => h.yol === yol)?.kod

test('menuBelgesiDogrula_duyuruAktifMetinBos_hataVerir', () => {
  const b = ham((x) => duyuruAyarla(x, duyuruYaz({ metin: { tr: ' ', en: 'Open' } })))
  assert.equal(hataKodu(b, 'duyuru.metin.tr'), 'bos')
})

test('duyuruDogrula_gecerli_duyuruyuDoner', () => {
  const d = duyuruYaz({ bitis: '2026-12-31T23:59' })
  assert.deepEqual(duyuruDogrula(d), { tamam: true, duyuru: d })
})

test('duyuruDogrula_bolumYok_pasifDuyuru', () => {
  const pasif = { aktif: false, metin: { tr: '', en: '' }, bitis: null }
  assert.deepEqual(duyuruDogrula(undefined), { tamam: true, duyuru: pasif })
})

test('duyuruDogrula_aktifMetinBos_hataVerir', () => {
  const sonuc = duyuruDogrula(duyuruYaz({ metin: { tr: ' ', en: 'Open' } }))
  assert.equal(sonuc.tamam, false)
  assert.equal(!sonuc.tamam && sonuc.hatalar[0]?.yol, 'duyuru.metin.tr')
})

test('menuBelgesiDogrula_duyuruPasifMetinBos_gecerli', () => {
  const b = ham((x) => duyuruAyarla(x, duyuruYaz({ aktif: false, metin: { tr: '', en: '' } })))
  assert.equal(menuBelgesiDogrula(b).tamam, true)
})

test('menuBelgesiDogrula_duyuruMetin140Karakter_gecerli', () => {
  const b = ham((x) => duyuruAyarla(x, duyuruYaz({ metin: { tr: 'a'.repeat(140), en: 'a'.repeat(140) } })))
  assert.equal(menuBelgesiDogrula(b).tamam, true)
})

test('menuBelgesiDogrula_duyuruMetin141Karakter_hataVerir', () => {
  const b = ham((x) => duyuruAyarla(x, duyuruYaz({ metin: { tr: 'a'.repeat(141), en: 'Open' } })))
  assert.equal(hataKodu(b, 'duyuru.metin.tr'), 'uzun')
})

test('menuBelgesiDogrula_duyuruHtmlIsareti_hataVerir', () => {
  const b = ham((x) => duyuruAyarla(x, duyuruYaz({ metin: { tr: 'Açığız <b>bugün</b>', en: 'Open' } })))
  assert.equal(hataKodu(b, 'duyuru.metin.tr'), 'htmlIsareti')
})

test('menuBelgesiDogrula_bitisBicimiYanlis_hataVerir', () => {
  const kotular = ['2026-10-27', '2026-10-27 00:30', '2026-13-01T00:30', '2026-02-30T10:00', '2026-10-27T24:00', 5]
  for (const kotu of kotular) {
    const b = ham((x) => duyuruAyarla(x, duyuruYaz({ bitis: kotu })))
    assert.equal(hataKodu(b, 'duyuru.bitis'), 'bitis', String(kotu))
  }
  const iyi = ham((x) => duyuruAyarla(x, duyuruYaz({ bitis: '2026-10-27T00:30' })))
  assert.equal(menuBelgesiDogrula(iyi).tamam, true)
})

test('menuBelgesiDogrula_duyuruAktifBoolDegil_hataVerir', () => {
  const b = ham((x) => duyuruAyarla(x, duyuruYaz({ aktif: 'evet' })))
  assert.equal(hataKodu(b, 'duyuru.aktif'), 'sema')
})

test('menuBelgesiDogrula_ikramlarEksik_bolumEksikKodu', () => {
  assert.equal(hataKodu(ham((b) => { delete b['ikramlar'] }), 'ikramlar'), 'bolumEksik')
})

test('menuBelgesiDogrula_iletisimEksik_bolumEksikKodu', () => {
  assert.equal(hataKodu(ham((b) => { delete b['iletisim'] }), 'iletisim'), 'bolumEksik')
})

test('menuBelgesiDogrula_duyuruveTukendiEksik_varsayilanlarlaTamamlar', () => {
  const b = ham((x) => {
    delete x['duyuru']
    for (const k of [...(x['kalemler'] as Ham[]), ...(x['icecekler'] as Ham[])]) delete k['tukendi']
  })
  const sonuc = menuBelgesiDogrula(b)
  assert.ok(sonuc.tamam)
  if (!sonuc.tamam) return
  assert.deepEqual(sonuc.belge.duyuru, { aktif: false, metin: { tr: '', en: '' }, bitis: null })
  assert.ok([...sonuc.belge.kalemler, ...sonuc.belge.icecekler].every((k) => k.tukendi === false))
})

test('menuBelgesiDogrula_tukendiBoolDegil_hataVerir', () => {
  const kalemde = ham((b) => { (b['kalemler'] as Ham[])[1]!['tukendi'] = 'evet' })
  const icecekte = ham((b) => { (b['icecekler'] as Ham[])[0]!['tukendi'] = 1 })
  assert.equal(hataKodu(kalemde, 'kalemler[1].tukendi'), 'sema')
  assert.equal(hataKodu(icecekte, 'icecekler[0].tukendi'), 'sema')
})

test('menuBelgesiDogrula_tukendiTrue_korunur', () => {
  const sonuc = menuBelgesiDogrula(ham((b) => { (b['kalemler'] as Ham[])[1]!['tukendi'] = true }))
  assert.ok(sonuc.tamam)
  if (sonuc.tamam) assert.equal(al(sonuc.belge.kalemler, 1).tukendi, true)
})

test('menuBelgesiDogrula_ikramUrunuIkiKezAyniId_hataVerir', () => {
  const b = ham((x) => {
    const urunler = (x['ikramlar'] as { urunler: Ham[] }).urunler
    urunler.push({ ...structuredClone(al(urunler, 0)) })
  })
  assert.equal(hataKodu(b, 'ikramlar.urunler[2].id'), 'tekrar')
})

test('menuBelgesiDogrula_ikramKimligiBicimi_hataVerir', () => {
  const b = ham((x) => { (x['ikramlar'] as { urunler: Ham[] }).urunler[0]!['id'] = 'Lebeni Corbasi' })
  assert.equal(hataKodu(b, 'ikramlar.urunler[0].id'), 'kimlik')
})

test('menuBelgesiDogrula_ikram12Urun_gecerli13Urun_hataVerir', () => {
  const urunler = (n: number) => (x: Ham) => {
    const o = x['ikramlar'] as { urunler: Ham[] }
    o.urunler = Array.from({ length: n }, (_, s) => ({ ...structuredClone(al(o.urunler, 0)), id: `ikram-${s}` }))
  }
  assert.equal(menuBelgesiDogrula(ham(urunler(12))).tamam, true)
  assert.equal(hataKodu(ham(urunler(13)), 'ikramlar.urunler'), 'cokFazla')
})

test('menuBelgesiDogrula_kume9VeKumedeOge11_hataVerir', () => {
  const kumeler = (x: Ham) => {
    const o = x['ikramlar'] as { gruplar: Ham[] }
    o.gruplar = Array.from({ length: 9 }, (_, s) => ({ ...structuredClone(al(o.gruplar, 0)), id: `kume-${s}` }))
  }
  assert.equal(hataKodu(ham(kumeler), 'ikramlar.gruplar'), 'cokFazla')
  const oge = (x: Ham) => {
    const g = al((x['ikramlar'] as { gruplar: { ogeler: Ham[] }[] }).gruplar, 0)
    g.ogeler = Array.from({ length: 11 }, (_, s) => ({ id: `oge-${s}`, ad: { tr: 'Roka', en: 'Rocket' } }))
  }
  assert.equal(hataKodu(ham(oge), 'ikramlar.gruplar[0].ogeler'), 'cokFazla')
})

test('menuBelgesiDogrula_ikramAyniOgeIkiKume_hataVerir', () => {
  const b = ham((x) => {
    const g = (x['ikramlar'] as { gruplar: { ogeler: Ham[] }[] }).gruplar
    al(g, 1).ogeler.push(structuredClone(al(al(g, 0).ogeler, 0)))
  })
  assert.equal(hataKodu(b, 'ikramlar.gruplar[1].ogeler[2].id'), 'tekrar')
})

test('menuBelgesiDogrula_ikramNotNull_serbest', () => {
  const b = ham((x) => { (x['ikramlar'] as { gruplar: Ham[] }).gruplar[0]!['not'] = null })
  assert.equal(menuBelgesiDogrula(b).tamam, true)
})

test('menuBelgesiDogrula_ikramBilinmeyenFoto_hataVerir', () => {
  const b = ham((x) => { (x['ikramlar'] as { urunler: Ham[] }).urunler[0]!['fotoId'] = 'yok-boyle' })
  assert.equal(hataKodu(b, 'ikramlar.urunler[0].fotoId'), 'foto')
})

const iletisimAyarla = (alan: string, deger: unknown) => (b: Ham) => {
  (b['iletisim'] as Ham)[alan] = deger
}

test('menuBelgesiDogrula_eposta_gecersiz_hataVerir', () => {
  for (const kotu of ['bozo', 'bozo@', 'bozo@cigercibozo', 'bo zo@a.com', `${'a'.repeat(95)}@a.com`]) {
    assert.equal(hataKodu(ham(iletisimAyarla('eposta', kotu)), 'iletisim.eposta'), 'eposta', kotu)
  }
  assert.equal(menuBelgesiDogrula(ham(iletisimAyarla('eposta', 'a.b@c.com'))).tamam, true)
})

test('menuBelgesiDogrula_telefon_artisizNumara_hataVerir', () => {
  for (const kotu of ['905338887424', '+90533', '+90 533 888 74 24 99 99 99 99', '+90-533-888', '0533 888 74 24']) {
    assert.equal(hataKodu(ham(iletisimAyarla('telefon', kotu)), 'iletisim.telefon'), 'telefon', kotu)
  }
  assert.equal(menuBelgesiDogrula(ham(iletisimAyarla('telefon', '+90 533 888 74 24'))).tamam, true)
})

test('menuBelgesiDogrula_telefonKapaliNumaraBos_gecerli', () => {
  const b = ham((x) => { x['iletisim'] = { ...(x['iletisim'] as Ham), telefonAcik: false, telefon: '' } })
  const sonuc = menuBelgesiDogrula(b)
  assert.equal(sonuc.tamam, true)
  assert.equal(sonuc.tamam && sonuc.belge.iletisim.telefon, '')
})

test('menuBelgesiDogrula_telefonAcikNumaraBos_hataVerir', () => {
  const b = ham((x) => { x['iletisim'] = { ...(x['iletisim'] as Ham), telefonAcik: true, telefon: '' } })
  assert.equal(hataKodu(b, 'iletisim.telefon'), 'telefon')
})

test('menuBelgesiDogrula_telefonKapaliBosluk_hataVerir', () => {
  const b = ham((x) => { x['iletisim'] = { ...(x['iletisim'] as Ham), telefonAcik: false, telefon: ' ' } })
  assert.equal(hataKodu(b, 'iletisim.telefon'), 'telefon')
})

test('menuBelgesiDogrula_telefonHataMetni_gercekNumaraTasimaz', () => {
  const b = ham(iletisimAyarla('telefon', '0533'))
  const metin = reddedilen(menuBelgesiDogrula(b)).find((h) => h.yol === 'iletisim.telefon')?.metin ?? ''
  assert.ok(metin.length > 0)
  assert.equal(/\d{3} \d{3} \d{2} \d{2}/.test(metin), false, metin)
})

test('menuBelgesiDogrula_telefonSadeceBosluk_hataVerir', () => {
  for (const kotu of ['+        ', '+ 1 2 3', '+9 5 3 3 8 8 ']) {
    assert.equal(hataKodu(ham(iletisimAyarla('telefon', kotu)), 'iletisim.telefon'), 'telefon', kotu)
  }
  assert.equal(menuBelgesiDogrula(ham(iletisimAyarla('telefon', '+90533888'))).tamam, true)
})

test('menuBelgesiDogrula_kullaniciAdiBosluklu_hataVerir', () => {
  for (const alan of ['instagram', 'facebook', 'tiktok']) {
    for (const kotu of ['ciger bozo', '@cigercibozo', '', 'a'.repeat(41)]) {
      assert.equal(hataKodu(ham(iletisimAyarla(alan, kotu)), `iletisim.${alan}`), 'kullaniciAdi', `${alan} ${kotu}`)
    }
    assert.equal(menuBelgesiDogrula(ham(iletisimAyarla(alan, 'ciger.bozo_1'))).tamam, true)
  }
})

test('menuBelgesiDogrula_googleYorumKodu_gecersiz_hataVerir', () => {
  for (const kotu of ['abc', 'a b c d e f', 'a'.repeat(41), 'ab/cdef']) {
    assert.equal(hataKodu(ham(iletisimAyarla('googleYorumKodu', kotu)), 'iletisim.googleYorumKodu'), 'yorumKodu', kotu)
  }
})

test('menuBelgesiDogrula_telefonAcikBoolDegil_hataVerir', () => {
  assert.equal(hataKodu(ham(iletisimAyarla('telefonAcik', 'evet')), 'iletisim.telefonAcik'), 'sema')
})

test('menuBelgesiDogrula_iletisimBilinmeyenAlan_hataVerir', () => {
  assert.equal(hataKodu(ham(iletisimAyarla('whatsapp', '+90 533 888 74 24')), 'iletisim.whatsapp'), 'bilinmeyenAlan')
})
