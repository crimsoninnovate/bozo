import assert from 'node:assert/strict'
import { test } from 'node:test'
import { menuBelgesiYukle } from './belgeYukle.ts'
import { menuBelgesiDogrula } from './dogrulama.ts'
import { menuFarki } from './fark.ts'
import {
  BelgeHatasi, bitisGirdisindenDegere, degerdenBitisGirdisine, degisiklikVarMi, eskiBelgeMi, hataSekmesi,
  panelBelgesi, siteDurumu, siteSurumuOku, telefonAciliyor,
} from './panel.ts'

const tohum = menuBelgesiYukle()
/** 1. sürüm biçimi: yeni bölümler ve `tukendi` yok. */
const eskiBelge = (): Record<string, unknown> => {
  const kopya = structuredClone(tohum) as unknown as Record<string, unknown>
  delete kopya['duyuru']
  delete kopya['ikramlar']
  delete kopya['iletisim']
  for (const k of kopya['kalemler'] as Record<string, unknown>[]) delete k['tukendi']
  for (const i of kopya['icecekler'] as Record<string, unknown>[]) delete i['tukendi']
  return kopya
}

test('bitisGirdisindenDegere_bosGirdi_nullDoner', () => {
  assert.equal(bitisGirdisindenDegere(''), null)
  assert.equal(bitisGirdisindenDegere('   '), null)
})

test('bitisGirdisindenDegere_girneDuvarSaati_aynenSaklanir', () => {
  assert.equal(bitisGirdisindenDegere('2026-10-27T09:00'), '2026-10-27T09:00')
})

test('bitisGirdisindenDegere_yazVeKisSaati_sapmaEklenmez', () => {
  // Nicosia kışın UTC+2, yazın UTC+3; belge UTC değil Girne duvar saati tuttuğu için ikisi de aynen kalır.
  assert.equal(bitisGirdisindenDegere('2026-07-15T09:00'), '2026-07-15T09:00')
  assert.equal(bitisGirdisindenDegere('2026-12-15T09:00'), '2026-12-15T09:00')
})

test('bitisGirdisindenDegere_saniyeliGirdi_dakikayaKirpilir', () => {
  assert.equal(bitisGirdisindenDegere('2026-10-27T09:00:30'), '2026-10-27T09:00')
})

test('degerdenBitisGirdisine_null_bosMetinDoner', () => {
  assert.equal(degerdenBitisGirdisine(null), '')
})

test('bitisDonusumu_gidisDonus_degerKorunur', () => {
  for (const girdi of ['2026-10-27T09:00', '2026-07-15T23:59', '2026-12-31T00:00', '']) {
    assert.equal(degerdenBitisGirdisine(bitisGirdisindenDegere(girdi)), girdi)
  }
})

test('eskiBelgeMi_yeniBolumlerYok_dogruDoner', () => {
  assert.equal(eskiBelgeMi(eskiBelge()), true)
  assert.equal(eskiBelgeMi(tohum), false)
  assert.equal(eskiBelgeMi(null), false)
})

test('panelBelgesi_eskiBelge_seedBolumleriylePanelBicimineGelir', () => {
  const belge = panelBelgesi(eskiBelge(), tohum)
  assert.deepEqual(belge, tohum)
  assert.equal(belge.kalemler[0]?.tukendi, false)
})

test('panelBelgesi_yeniBelge_degismez', () => {
  assert.deepEqual(panelBelgesi(tohum, tohum), tohum)
})

test('panelBelgesi_gecersizBelge_belgeHatasiFirlatir', () => {
  const bozuk = { ...eskiBelge(), icecekler: 'yok' }
  assert.throws(
    () => panelBelgesi(bozuk, tohum),
    (h: unknown) => h instanceof BelgeHatasi && /icecekler/.test(h.message),
  )
})

/** Panel bu yolları listenin altında gösterir (`IkramFormu`); yollar ve sınır metni burada sabitlenir. */
const cift = { tr: 'A', en: 'A' }
const sinirHatasi = (degis: (b: typeof tohum) => void, yol: string) => {
  const b = structuredClone(tohum)
  degis(b)
  const sonuc = menuBelgesiDogrula(b)
  assert.equal(sonuc.tamam, false, yol)
  return sonuc.tamam ? undefined : sonuc.hatalar.find((x) => x.yol === yol)
}

test('menuBelgesiDogrula_onUcuncuIkram_urunlerListesindeHataVerir', () => {
  const h = sinirHatasi((b) => {
    b.ikramlar.urunler = Array.from({ length: 13 }, (_, n) => ({
      id: `ikram-${n}`, ad: cift, aciklama: cift, fotoId: null,
    }))
  }, 'ikramlar.urunler')
  assert.match(h?.metin ?? '', /En çok 12 kayıt/)
})

test('menuBelgesiDogrula_dokuzuncuKume_gruplarListesindeHataVerir', () => {
  const h = sinirHatasi((b) => {
    b.ikramlar.gruplar = Array.from({ length: 9 }, (_, n) => ({ id: `kume-${n}`, ad: cift, not: null, ogeler: [] }))
  }, 'ikramlar.gruplar')
  assert.match(h?.metin ?? '', /En çok 8 kayıt/)
})

test('menuBelgesiDogrula_onbirinciOge_kumeninOgelerListesindeHataVerir', () => {
  const h = sinirHatasi((b) => {
    const kume = b.ikramlar.gruplar[0]
    if (kume) kume.ogeler = Array.from({ length: 11 }, (_, n) => ({ id: `oge-${n}`, ad: cift }))
  }, 'ikramlar.gruplar[0].ogeler')
  assert.match(h?.metin ?? '', /En çok 10 kayıt/)
})

test('siteDurumu_ayniSurum_guncel', () => {
  const d = siteDurumu(7, 7)
  assert.equal(d.guncel, true)
  assert.match(d.metin, /#7/)
})

test('siteDurumu_farkli_metinSurumleriTasir', () => {
  const d = siteDurumu(9, 7)
  assert.equal(d.guncel, false)
  assert.equal(
    d.metin,
    'Sitede #7, panelde #9: iletişim bilgisi, arama motoru verisi ve ikram metinleri '
    + 'siteyi yeniden yayınlayınca güncellenir.',
  )
})

test('siteDurumu_siteTohum_tohumMetni', () => {
  for (const site of [0, -1]) {
    const d = siteDurumu(4, site)
    assert.equal(d.guncel, false)
    assert.match(d.metin, /tohum menüyle basılmış/)
  }
})

test('siteDurumu_siteTohumYayinYok_guncel', () => {
  const d = siteDurumu(null, 0)
  assert.equal(d.guncel, true)
  assert.match(d.metin, /tohum menüyle basılmış/)
})

test('siteSurumuOku_eksikYaDaBozuk_sifirDoner', () => {
  assert.equal(siteSurumuOku(undefined), 0)
  assert.equal(siteSurumuOku(''), 0)
  assert.equal(siteSurumuOku('abc'), 0)
  assert.equal(siteSurumuOku('-3'), 0)
  assert.equal(siteSurumuOku('12'), 12)
})

test('degisiklikVarMi_ayniBelge_false', () => {
  assert.equal(degisiklikVarMi(tohum, structuredClone(tohum)), false)
})

test('degisiklikVarMi_anahtarSirasiFarkli_false', () => {
  const ters = Object.fromEntries(Object.entries(structuredClone(tohum)).reverse()) as typeof tohum
  assert.equal(degisiklikVarMi(tohum, ters), false)
})

test('degisiklikVarMi_alanDegisti_true', () => {
  const b = structuredClone(tohum)
  b.iletisim.eposta = 'baska@cigercibozo.com'
  assert.equal(degisiklikVarMi(tohum, b), true)
  const c = structuredClone(tohum)
  c.kalemler.pop()
  assert.equal(degisiklikVarMi(tohum, c), true)
})

test('iletisimDogrula_gecersizEposta_hata', () => {
  const b = structuredClone(tohum)
  b.iletisim.eposta = 'bozuk'
  const sonuc = menuBelgesiDogrula(b)
  assert.equal(sonuc.tamam, false)
  assert.equal(sonuc.tamam ? '' : sonuc.hatalar[0]?.yol, 'iletisim.eposta')
})

test('hataSekmesi_yolOnEki_sekmeAnahtari', () => {
  assert.equal(hataSekmesi('kalemler[2].ad.tr'), 'ocakbasi')
  assert.equal(hataSekmesi('ozel.fiyat'), 'ozel')
  assert.equal(hataSekmesi('icecekler[0].olculer[1]'), 'icecekler')
  assert.equal(hataSekmesi('ikramlar.gruplar'), 'ikramlar')
  assert.equal(hataSekmesi('duyuru.bitis'), 'duyuru')
  assert.equal(hataSekmesi('iletisim.eposta'), 'iletisim')
  assert.equal(hataSekmesi('belge'), null)
})

test('telefonAciliyor_kapaliykenAcilir_dogru', () => {
  const b = structuredClone(tohum)
  b.iletisim.telefonAcik = true
  const fark = menuFarki(tohum, b).filter(telefonAciliyor)
  assert.equal(fark.length, 1)
  assert.equal(menuFarki(b, tohum).filter(telefonAciliyor).length, 0)
})
