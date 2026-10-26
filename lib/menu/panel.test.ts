import assert from 'node:assert/strict'
import { test } from 'node:test'
import { menuBelgesiYukle } from './belgeYukle.ts'
import { menuBelgesiDogrula } from './dogrulama.ts'
import { menuFarki } from './fark.ts'
import {
  BelgeHatasi, bitisGirdisindenDegere, degerdenBitisGirdisine, degisiklikVarMi, duyuruGorunmeyecek, eskiBelgeMi,
  hataSekmeleri, hataSekmesi, kayitHatali, panelBelgesi, siteDurumu, siteSurumuOku, taslakOku, taslakYaz,
  telefonAciliyor, yayinDurumu,
} from './panel.ts'
import type { Duyuru } from './tipler.ts'

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

test('siteDurumu_kisaMetin_tekSatirlikOzet', () => {
  assert.equal(siteDurumu(7, 7).kisa, 'Site güncel (#7)')
  assert.equal(siteDurumu(null, 7).kisa, 'Site güncel (#7)')
  assert.equal(siteDurumu(9, 7).kisa, 'Sitede #7, panelde #9')
  assert.equal(siteDurumu(4, 0).kisa, 'Sitede tohum menü, panelde #4')
  assert.equal(siteDurumu(null, 0).kisa, 'Site tohum menüyle basılı')
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

test('hataSekmeleri_birkacYol_herSekmeBirKezTanimsizYolYok', () => {
  const sekmeler = hataSekmeleri(['kalemler[0].ad.tr', 'kalemler[3].fiyatlar.porsiyon', 'iletisim.eposta', 'belge'])
  assert.deepEqual([...sekmeler].sort(), ['iletisim', 'ocakbasi'])
})

test('hataSekmeleri_hataYok_bosKume', () => {
  assert.equal(hataSekmeleri([]).size, 0)
})

test('hataSekmeleri_dogrulamaSonucu_hataliSekmeleriVerir', () => {
  const b = structuredClone(tohum)
  b.iletisim.eposta = 'bozuk'
  const icecek = b.icecekler[1]
  if (icecek) icecek.ad.en = ''
  const sonuc = menuBelgesiDogrula(b)
  const yollar = sonuc.tamam ? [] : sonuc.hatalar.map((h) => h.yol)
  assert.deepEqual([...hataSekmeleri(yollar)].sort(), ['icecekler', 'iletisim'])
})

test('kayitHatali_kayitAltindaHata_dogru', () => {
  assert.equal(kayitHatali(['kalemler[2].ad.tr'], 'kalemler[2]'), true)
  assert.equal(kayitHatali(['kalemler[2]'], 'kalemler[2]'), true)
  assert.equal(kayitHatali(['icecekler[0].olculer[1].ad.en'], 'icecekler[0]'), true)
})

test('kayitHatali_baskaKayit_yanlis', () => {
  // "kalemler[1]" önekiyle başlayan "kalemler[12]" aynı kayıt değildir.
  assert.equal(kayitHatali(['kalemler[12].ad.tr', 'kalemler[0].ad.tr'], 'kalemler[1]'), false)
  assert.equal(kayitHatali([], 'kalemler[1]'), false)
})

test('kayitHatali_yalnizGorunenAlandaHata_yanlis', () => {
  const gorunen = ['kalemler[1].fiyatlar.porsiyon', 'kalemler[1].fiyatlar.durum']
  assert.equal(kayitHatali(['kalemler[1].fiyatlar.porsiyon'], 'kalemler[1]', gorunen), false)
  assert.equal(kayitHatali(['kalemler[1].fiyatlar.porsiyon', 'kalemler[1].ad.en'], 'kalemler[1]', gorunen), true)
})

test('yayinDurumu_hataVeSekme_kapaliSekmeAdiyla', () => {
  assert.deepEqual(
    yayinDurumu({ hataSayisi: 2, ilkHata: 'iletisim', degisiklik: 3, eski: false }),
    { metin: '2 hata · İletişim', kapali: true },
  )
})

test('yayinDurumu_hataSekmesiz_yalnizSayi', () => {
  assert.deepEqual(
    yayinDurumu({ hataSayisi: 1, ilkHata: null, degisiklik: 0, eski: true }),
    { metin: '1 hata', kapali: true },
  )
})

test('yayinDurumu_degisiklikYok_kapali', () => {
  assert.deepEqual(
    yayinDurumu({ hataSayisi: 0, ilkHata: null, degisiklik: 0, eski: false }),
    { metin: 'Değişiklik yok', kapali: true },
  )
})

test('yayinDurumu_eskiBelgeDegisiklikYok_acik', () => {
  const d = yayinDurumu({ hataSayisi: 0, ilkHata: null, degisiklik: 0, eski: true })
  assert.equal(d.kapali, false)
  assert.match(d.metin, /bir kez yayınlayın/)
})

test('yayinDurumu_degisiklikVar_sayiyiSoyler', () => {
  assert.deepEqual(
    yayinDurumu({ hataSayisi: 0, ilkHata: null, degisiklik: 3, eski: false }),
    { metin: '3 değişiklik', kapali: false },
  )
})

test('telefonAciliyor_kapaliykenAcilir_dogru', () => {
  const b = structuredClone(tohum)
  b.iletisim.telefonAcik = true
  const fark = menuFarki(tohum, b).filter(telefonAciliyor)
  assert.equal(fark.length, 1)
  assert.equal(menuFarki(b, tohum).filter(telefonAciliyor).length, 0)
})

const SIMDI = new Date('2026-10-26T09:00:00Z')
const duyuruIle = (d: Partial<Duyuru>): Duyuru => (
  { aktif: true, metin: { tr: 'Açığız', en: 'Open' }, bitis: null, ...d }
)

test('duyuruGorunmeyecek_acikBitisGecmis_dogru', () => {
  assert.equal(duyuruGorunmeyecek(duyuruIle({ bitis: '2026-10-26T11:00' }), SIMDI), true)
})

test('duyuruGorunmeyecek_acikMetinBos_dogru', () => {
  assert.equal(duyuruGorunmeyecek(duyuruIle({ metin: { tr: '', en: 'Open' } }), SIMDI), true)
})

test('duyuruGorunmeyecek_acikVeGorunur_yanlis', () => {
  assert.equal(duyuruGorunmeyecek(duyuruIle({ bitis: '2026-10-26T13:00' }), SIMDI), false)
  assert.equal(duyuruGorunmeyecek(duyuruIle({}), SIMDI), false)
})

test('duyuruGorunmeyecek_kapali_yanlis', () => {
  assert.equal(duyuruGorunmeyecek(duyuruIle({ aktif: false, bitis: '2026-10-26T11:00' }), SIMDI), false)
})

const taslakBelge = (): typeof tohum => {
  const b = structuredClone(tohum)
  b.kalemler[1] = { ...b.kalemler[1]!, ad: { tr: 'Değişti', en: 'Changed' } }
  return b
}

test('taslakOku_kayitYok_yokDoner', () => {
  assert.deepEqual(taslakOku(null, 4, tohum), { tur: 'yok' })
})

test('taslakOku_ayniTaban_belgeyiGeriVerir', () => {
  const sonuc = taslakOku(taslakYaz(4, taslakBelge()), 4, tohum)
  assert.equal(sonuc.tur, 'geri')
  assert.deepEqual(sonuc.tur === 'geri' && sonuc.belge, taslakBelge())
})

test('taslakOku_tabanNull_nullTabanlaEslesir', () => {
  assert.equal(taslakOku(taslakYaz(null, taslakBelge()), null, tohum).tur, 'geri')
  assert.equal(taslakOku(taslakYaz(null, taslakBelge()), 4, tohum).tur, 'eski')
})

test('taslakOku_baskaTaban_eskiDoner', () => {
  assert.deepEqual(taslakOku(taslakYaz(3, taslakBelge()), 4, tohum), { tur: 'eski' })
})

test('taslakOku_yarimKalmisBelge_hataliAlanlarlaGeriGelir', () => {
  const b = taslakBelge()
  b.kalemler[1] = { ...b.kalemler[1]!, ad: { tr: 'Yeni', en: '' }, fiyatlar: { porsiyon: Number.NaN } }
  const sonuc = taslakOku(taslakYaz(4, b), 4, tohum)
  assert.equal(sonuc.tur, 'geri')
  assert.equal(menuBelgesiDogrula(sonuc.tur === 'geri' ? sonuc.belge : null).tamam, false)
})

test('taslakOku_jsonDegil_bozukDoner', () => {
  const sonuc = taslakOku('{bozuk', 4, tohum)
  assert.equal(sonuc.tur, 'bozuk')
})

test('taslakOku_sekilYanlis_bozukDoner', () => {
  for (const ham of ['null', '[]', '{"taban":"4","belge":{}}', '{"taban":4}', '{"belge":{}}']) {
    assert.equal(taslakOku(ham, 4, tohum).tur, 'bozuk', ham)
  }
})

test('taslakOku_belgeninYapisiBozuk_hataYoluylaBozukDoner', () => {
  const b = taslakBelge() as unknown as Record<string, unknown>
  b['kalemler'] = 'liste degil'
  const sonuc = taslakOku(JSON.stringify({ taban: 4, belge: b }), 4, tohum)
  assert.equal(sonuc.tur, 'bozuk')
  assert.match(sonuc.tur === 'bozuk' ? sonuc.neden : '', /kalemler/)
})
