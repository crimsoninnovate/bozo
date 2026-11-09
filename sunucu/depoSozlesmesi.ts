import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { MenuBelgesi } from '../lib/menu/tipler.ts'
import type { Depo, YeniTur } from './depo.ts'

/*
 * Depo sözleşmesi: bellek ve MariaDB uygulamaları aynı testleri geçer. `kur` her testte boş
 * bir depo verir; null ise testler atlanır (MariaDB testi `BOZO_TEST_DB_URL` ister).
 */
export type DepoKurucu = () => Promise<Depo>
type Testci = (isim: string, govde: (depo: Depo) => Promise<void>) => void

const GUN = 24 * 60 * 60_000

async function oyuncuEkle(depo: Depo, ad: string, simdi = 1000) {
  const sonuc = await depo.oyuncuEkle({
    anahtarOzeti: `ozet-${ad}`,
    takmaAd: ad,
    adKatlanmis: ad.toLowerCase(),
    onaySurumu: 's1',
    simdi,
  })
  if (sonuc === 'adKullanimda') throw new Error(`ad kullanımda: ${ad}`)
  return sonuc
}

function tur(oyuncuId: number, donem: string, puan: number, ek: Partial<YeniTur> = {}): YeniTur {
  return {
    jetonId: `j${oyuncuId}-${donem}-${puan}-${ek.olusturma ?? 0}`,
    oyuncuId,
    donem,
    tohum: 1,
    puan,
    ozet: { misafir: 1, sis: 2, tamKivam: 0, enUzunKombo: 1, kalkan: 0, bahsis: 0 },
    bitti: 'gece',
    tik: 7200,
    kanal: 'yok',
    supheli: false,
    girdiler: [[0, 'ciger']],
    olusturma: 5000,
    ...ek,
  }
}

function jetonVeOyuncuTestleri(t: Testci): void {
  t('jeton_ekleBulKullanTekSefer_suresiDolanSilinir', async (depo) => {
    const a = 'a'.repeat(32)
    await depo.jetonEkle({ id: a, tohum: 7, kanal: 'sofra', olusturma: 100, sonaErme: 200, kullanildi: false })
    const b = 'b'.repeat(32)
    await depo.jetonEkle({ id: b, tohum: 8, kanal: 'ig', olusturma: 100, sonaErme: 900, kullanildi: false })
    assert.deepEqual(await depo.jetonBul(a), {
      id: a, tohum: 7, kanal: 'sofra', olusturma: 100, sonaErme: 200, kullanildi: false,
    })
    assert.equal(await depo.jetonKullan(a), true)
    assert.equal(await depo.jetonKullan(a), false)
    assert.equal((await depo.jetonBul(a))?.kullanildi, true)
    assert.equal(await depo.jetonKullan('c'.repeat(32)), false)
    assert.equal(await depo.suresiDolanJetonlariSil(500), 1)
    assert.equal(await depo.jetonBul(a), null)
    assert.notEqual(await depo.jetonBul(b), null)
  })

  t('oyuncu_ekleBulGizleSil_ayniKatlanmisAdReddedilir', async (depo) => {
    const ayse = await oyuncuEkle(depo, 'Ayşe')
    assert.deepEqual(await depo.oyuncuBul('ozet-Ayşe'), { id: ayse.id, takmaAd: 'Ayşe', gizli: false })
    const ayni = { anahtarOzeti: 'baska', takmaAd: 'AYŞE', adKatlanmis: 'ayşe', onaySurumu: 's1', simdi: 1 }
    assert.equal(await depo.oyuncuEkle(ayni), 'adKullanimda')
    assert.equal(await depo.oyuncuGizle(ayse.id, true), true)
    assert.equal((await depo.oyuncuBul('ozet-Ayşe'))?.gizli, true)
    assert.equal(await depo.oyuncuGizle(999, true), false)
    assert.equal(await depo.oyuncuSil(ayse.id), true)
    assert.equal(await depo.oyuncuBul('ozet-Ayşe'), null)
    assert.equal(await depo.oyuncuSil(ayse.id), false)
  })

  t('oyuncu_eskiOyunculariSil_sonTuraYoksaKayitZamaninaGore', async (depo) => {
    const eski = await oyuncuEkle(depo, 'Eski', 1000)
    const yeni = await oyuncuEkle(depo, 'Yeni', 1000)
    await oyuncuEkle(depo, 'Sessiz', 1000)
    await depo.turEkle(tur(eski.id, '2026-10-05', 10, { olusturma: 2000 }))
    await depo.turEkle(tur(yeni.id, '2026-10-05', 10, { olusturma: 9000 }))
    assert.equal(await depo.eskiOyunculariSil(5000), 2)
    assert.equal(await depo.oyuncuBul('ozet-Eski'), null)
    assert.equal(await depo.oyuncuBul('ozet-Sessiz'), null)
    assert.notEqual(await depo.oyuncuBul('ozet-Yeni'), null)
    assert.equal((await depo.siralama('2026-10-05')).length, 1)
  })
}

function turTestleri(t: Testci): void {
  t('tur_siralama_oyuncuBasinaEnIyi_beraberlik_tumZamanlar_turBul', async (depo) => {
    const a = await oyuncuEkle(depo, 'A')
    const b = await oyuncuEkle(depo, 'B')
    await depo.turEkle(tur(a.id, '2026-10-05', 100, { olusturma: 1 }))
    const aEnIyi = await depo.turEkle(tur(a.id, '2026-10-05', 300, { olusturma: 2 }))
    const ozet = { misafir: 1, sis: 2, tamKivam: 1, enUzunKombo: 1, kalkan: 0, bahsis: 0 }
    await depo.turEkle(tur(b.id, '2026-10-05', 300, { olusturma: 3, ozet }))
    await depo.turEkle(tur(b.id, '2026-09-28', 900, { olusturma: 0 }))
    const sirali = await depo.siralama('2026-10-05')
    assert.deepEqual(sirali.map((s) => [s.takmaAd, s.puan, s.tamKivam]), [['B', 300, 1], ['A', 300, 0]])
    assert.equal(sirali[1]?.turId, aEnIyi)
    assert.deepEqual((await depo.tumZamanlar(1)).map((s) => [s.takmaAd, s.puan]), [['B', 900]])
    const bulunan = await depo.turBul(aEnIyi)
    assert.equal(bulunan?.takmaAd, 'A')
    assert.deepEqual(bulunan?.girdiler, [[0, 'ciger']])
    assert.equal(bulunan?.ozet.sis, 2)
    assert.equal(await depo.turBul(999999), null)
  })

  t('tur_girdileriKirpVeEskiGirdileriSil_korunanKalir', async (depo) => {
    const a = await oyuncuEkle(depo, 'A')
    const korunan = await depo.turEkle(tur(a.id, '2026-10-05', 300, { olusturma: 1 }))
    const kirpilan = await depo.turEkle(tur(a.id, '2026-10-05', 100, { olusturma: 2 }))
    const eski = await depo.turEkle(tur(a.id, '2026-09-28', 100, { olusturma: 0 }))
    await depo.donemKaydet({ anahtar: '2026-09-28', baslangic: 0, bitis: 10 * GUN, kapanis: null })
    await depo.donemKaydet({ anahtar: '2026-10-05', baslangic: 10 * GUN, bitis: 17 * GUN, kapanis: null })
    assert.equal(await depo.girdileriKirp('2026-10-05', [korunan]), 1)
    assert.notEqual((await depo.turBul(korunan))?.girdiler, null)
    assert.equal((await depo.turBul(kirpilan))?.girdiler, null)
    assert.equal(await depo.eskiGirdileriSil(12 * GUN), 1)
    assert.equal((await depo.turBul(eski))?.girdiler, null)
    assert.notEqual((await depo.turBul(korunan))?.girdiler, null)
  })
}

function donemVeKazananTestleri(t: Testci): void {
  t('donem_kaydetYalnizIlkKez_kapat_acikListedenDuser', async (depo) => {
    await depo.donemKaydet({ anahtar: '2026-10-05', baslangic: 1, bitis: 2, kapanis: null })
    await depo.donemKapat('2026-10-05', 3)
    await depo.donemKaydet({ anahtar: '2026-10-05', baslangic: 1, bitis: 2, kapanis: null })
    await depo.donemKaydet({ anahtar: '2026-10-12', baslangic: 2, bitis: 4, kapanis: null })
    assert.deepEqual(await depo.acikDonemler(), [{ anahtar: '2026-10-12', baslangic: 2, bitis: 4, kapanis: null }])
  })

  t('kazanan_ekleBulKullan_sonSampiyon_gizliYansir_oyuncuSilinceBagKopar', async (depo) => {
    const a = await oyuncuEkle(depo, 'A')
    const b = await oyuncuEkle(depo, 'B')
    const ortak = { donem: '2026-09-28', puan: 500, deneme: 0, gecerlilik: 9000 }
    const k1 = await depo.kazananEkle({ ...ortak, sira: 1, oyuncuId: a.id, takmaAd: 'A', kodOzeti: 'oz1' })
    await depo.kazananEkle({ ...ortak, sira: 2, oyuncuId: b.id, takmaAd: 'B', kodOzeti: 'oz2' })
    await depo.kazananEkle({ ...ortak, donem: '2026-09-21', sira: 1, oyuncuId: b.id, takmaAd: 'B', kodOzeti: 'oz3' })
    assert.deepEqual((await depo.kazananlar('2026-09-28')).map((k) => [k.sira, k.takmaAd]), [[1, 'A'], [2, 'B']])
    assert.equal((await depo.sonSampiyon())?.id, k1)
    assert.equal((await depo.oyuncununOdulu(b.id))?.kodOzeti, 'oz2')
    assert.equal((await depo.kazananBul('oz1'))?.sira, 1)
    assert.equal(await depo.kazananBul('yok'), null)
    assert.equal(await depo.kazananKullan(k1, 7000), true)
    assert.equal(await depo.kazananKullan(k1, 7001), false)
    assert.equal((await depo.kazananBul('oz1'))?.kullanildi, 7000)
    await depo.oyuncuGizle(a.id, true)
    assert.equal((await depo.sonSampiyon())?.gizli, true)
    await depo.oyuncuSil(a.id)
    const kopuk = await depo.kazananBul('oz1')
    assert.deepEqual([kopuk?.oyuncuId, kopuk?.takmaAd, kopuk?.gizli], [null, 'A', false])
    assert.equal(await depo.kazananlariSil(), 3)
    assert.equal(await depo.sonSampiyon(), null)
  })

  /** `sema.sql` > `kazanan_donem_sira`: bir dönemde her sıra bir kez; bellek deposu da aynı kuralı taşır. */
  t('kazanan_ayniDonemVeSira_ikinciEklemeReddedilir', async (depo) => {
    const a = await oyuncuEkle(depo, 'A')
    const k = { donem: '2026-09-28', sira: 1, oyuncuId: a.id, takmaAd: 'A', puan: 5, deneme: 0, gecerlilik: 9 }
    await depo.kazananEkle({ ...k, kodOzeti: 'oz1' })
    await assert.rejects(depo.kazananEkle({ ...k, kodOzeti: 'oz2' }))
    assert.equal((await depo.kazananlar('2026-09-28')).length, 1)
  })

  t('sayac_artirVeOku_gunVeKanalBasina', async (depo) => {
    await depo.sayacArtir('2026-10-08', 'sofra')
    await depo.sayacArtir('2026-10-08', 'sofra')
    await depo.sayacArtir('2026-10-08', 'site')
    await depo.sayacArtir('2026-10-09', 'ig')
    assert.deepEqual(await depo.sayaclar('2026-10-08'), { sofra: 2, ig: 0, site: 1, yok: 0 })
    assert.deepEqual(await depo.sayaclar('2026-10-10'), { sofra: 0, ig: 0, site: 0, yok: 0 })
  })

  t('tarama_artirVeOzet_bugunHaftaToplam_okunmayanMasaYok', async (depo) => {
    assert.deepEqual(await depo.taramaOzeti('2026-10-13', '2026-10-07'), [])
    await depo.taramaArtir('2026-10-13', 7)
    await depo.taramaArtir('2026-10-13', 7)
    await depo.taramaArtir('2026-10-07', 7)
    await depo.taramaArtir('2026-10-06', 7)
    await depo.taramaArtir('2026-10-01', 12)
    assert.deepEqual(await depo.taramaOzeti('2026-10-13', '2026-10-07'), [
      { masa: 7, bugun: 2, hafta: 3, toplam: 4 },
      { masa: 12, bugun: 0, hafta: 0, toplam: 1 },
    ])
  })
}

/** En küçük geçerli belge; depo belgeyi doğrulamaz, yalnız saklar. */
function menuBelgesi(ad: string): MenuBelgesi {
  const cift = { tr: ad, en: ad }
  return {
    kalemler: [{
      id: 'ciger', ad: cift, aciklama: null, fiyatlar: { porsiyon: 690 }, porsiyonNotu: null, durumNotu: null,
      fotoId: null, tukendi: false,
    }],
    ozel: { ad: cift, miktarNotu: cift, aciklama: cift, fiyat: 850 },
    icecekler: [],
    duyuru: { aktif: false, metin: { tr: '', en: '' }, bitis: null },
    ikramlar: { altMetin: cift, urunler: [], gruplar: [] },
    iletisim: {
      telefonAcik: false, telefon: '+90 533 888 74 24', eposta: 'a@b.co', instagram: 'bozo', facebook: 'bozo',
      tiktok: 'bozo', googleYorumKodu: 'abcdef',
    },
    saatler: { acilis: 10, kapanis: 5 },
    fotograflar: {},
    metinler: { tr: {}, en: {} },
  }
}

function menuTestleri(t: Testci): void {
  t('menuGecerli_hicSurumYoksa_nullDoner', async (depo) => {
    assert.equal(await depo.menuGecerli(), null)
  })

  t('menuYayinla_ilkSurumTabanNull_idDoner', async (depo) => {
    const id = await depo.menuYayinla(menuBelgesi('a'), 'panel', 1000, null)
    assert.equal(typeof id, 'number')
    assert.deepEqual(await depo.menuGecerli(), { id, belge: menuBelgesi('a') })
  })

  t('menuYayinla_tabanEski_nullDoner', async (depo) => {
    const ilk = await depo.menuYayinla(menuBelgesi('a'), 'panel', 1000, null)
    const ikinci = await depo.menuYayinla(menuBelgesi('b'), 'panel', 2000, ilk)
    assert.notEqual(ikinci, null)
    assert.equal(await depo.menuYayinla(menuBelgesi('c'), 'panel', 3000, ilk), null)
    assert.equal(await depo.menuYayinla(menuBelgesi('c'), 'panel', 3000, null), null)
    assert.deepEqual(await depo.menuGecerli(), { id: ikinci, belge: menuBelgesi('b') })
    assert.equal((await depo.menuSurumleri(10)).length, 2, 'reddedilen yayın satır bırakmaz')
  })

  t('menuYayinla_tabanGuncel_yeniIdDoner', async (depo) => {
    const ilk = await depo.menuYayinla(menuBelgesi('a'), 'panel', 1000, null)
    const ikinci = await depo.menuYayinla(menuBelgesi('b'), 'geriAl', 2000, ilk)
    assert.ok(ilk !== null && ikinci !== null && ikinci > ilk)
  })

  t('menuYayinla_ayniTabanEsZamanli_yalnizBiriYazar', async (depo) => {
    const ilk = await depo.menuYayinla(menuBelgesi('a'), 'panel', 1000, null)
    const sonuclar = await Promise.all([
      depo.menuYayinla(menuBelgesi('b'), 'panel', 2000, ilk),
      depo.menuYayinla(menuBelgesi('c'), 'panel', 2000, ilk),
    ])
    assert.equal(sonuclar.filter((id) => id !== null).length, 1)
    assert.equal((await depo.menuSurumleri(10)).length, 2)
  })

  t('menuSurumleri_enYeniBasta_adetKadar', async (depo) => {
    const a = await depo.menuYayinla(menuBelgesi('a'), 'panel', 1000, null)
    const b = await depo.menuYayinla(menuBelgesi('b'), 'geriAl', 2000, a)
    const c = await depo.menuYayinla(menuBelgesi('c'), 'panel', 3000, b)
    assert.deepEqual(await depo.menuSurumleri(2), [
      { id: c, olusturma: 3000, kaynak: 'panel', yazar: null },
      { id: b, olusturma: 2000, kaynak: 'geriAl', yazar: null },
    ])
  })

  t('menuSurumBul_olmayanId_nullDoner', async (depo) => {
    const a = await depo.menuYayinla(menuBelgesi('a'), 'panel', 1000, null)
    assert.deepEqual(await depo.menuSurumBul(a as number), { id: a, belge: menuBelgesi('a') })
    assert.equal(await depo.menuSurumBul(999999), null)
  })

  t('menuYayinla_turkceVeEmojiMetni_ayniDonerRoundTrip', async (depo) => {
    const metin = 'Ciğer şişi İÇİN öğle ıspanak 🔥🥩 Ş ğ ü, "tırnak" \\ yeni\nsatır'
    const id = await depo.menuYayinla(menuBelgesi(metin), 'panel', 1000, null)
    assert.deepEqual((await depo.menuSurumBul(id as number))?.belge, menuBelgesi(metin))
    assert.deepEqual((await depo.menuGecerli())?.belge, menuBelgesi(metin))
  })
}

function personelTestleri(t: Testci): void {
  const ekle = async (depo: Depo, ad: string, simdi = 1000) => {
    const p = await depo.personelEkle(ad, `ozet-${ad}`, simdi)
    if (p === 'adKullanimda') throw new Error(`ad kullanımda: ${ad}`)
    return p
  }

  t('personelEkle_yeniHesap_sifreDegismeliSurum1', async (depo) => {
    const p = await ekle(depo, 'ajans')
    assert.deepEqual({ ...p, id: 0 }, {
      id: 0, ad: 'ajans', parolaOzeti: 'ozet-ajans', sifreDegismeli: true, kapali: false, oturumSurumu: 1,
      olusturma: 1000, sonGiris: null,
    })
    assert.deepEqual(await depo.personelBul(p.id), p)
    assert.deepEqual(await depo.personelAdla('ajans'), p)
    assert.equal(await depo.personelAdla('yok'), null)
    assert.equal(await depo.personelBul(999999), null)
  })

  t('personelEkle_ayniAd_adKullanimda', async (depo) => {
    await ekle(depo, 'ajans')
    assert.equal(await depo.personelEkle('ajans', 'baska', 2000), 'adKullanimda')
    assert.equal((await depo.personelListesi()).length, 1)
  })

  t('personelListesi_adaGore', async (depo) => {
    await ekle(depo, 'zeki')
    await ekle(depo, 'ajans')
    assert.deepEqual((await depo.personelListesi()).map((p) => p.ad), ['ajans', 'zeki'])
  })

  t('personelSifreKoy_surumArtar', async (depo) => {
    const p = await ekle(depo, 'ajans')
    const yeni = await depo.personelSifreKoy(p.id, 'ozet-yeni', false)
    assert.deepEqual(
      { ozet: yeni?.parolaOzeti, degismeli: yeni?.sifreDegismeli, surum: yeni?.oturumSurumu },
      { ozet: 'ozet-yeni', degismeli: false, surum: 2 },
    )
    assert.equal(await depo.personelSifreKoy(999999, 'x', true), null)
  })

  t('personelKapat_surumArtar', async (depo) => {
    const p = await ekle(depo, 'ajans')
    assert.equal((await depo.personelKapat(p.id, true))?.kapali, true)
    const acik = await depo.personelKapat(p.id, false)
    assert.deepEqual({ kapali: acik?.kapali, surum: acik?.oturumSurumu }, { kapali: false, surum: 3 })
    assert.equal(await depo.personelKapat(999999, true), null)
  })

  t('personelGirisKaydet_sonGiris', async (depo) => {
    const p = await ekle(depo, 'ajans')
    await depo.personelGirisKaydet(p.id, 5000)
    assert.equal((await depo.personelBul(p.id))?.sonGiris, 5000)
  })

  t('islemler_yenidenEskiyeVeKisiyeGore', async (depo) => {
    const p = await ekle(depo, 'ajans')
    await depo.islemEkle({ personelId: null, ad: 'bozo', tur: 'giris', ayrinti: '', zaman: 1000 })
    await depo.islemEkle({ personelId: p.id, ad: 'ajans', tur: 'menuYayin', ayrinti: 'sürüm 4', zaman: 2000 })
    await depo.islemEkle({ personelId: p.id, ad: 'ajans', tur: 'foto', ayrinti: 'a.webp', zaman: 3000 })
    const son = await depo.islemler(2)
    assert.deepEqual(son.map((i) => i.zaman), [3000, 2000])
    assert.deepEqual({ ...son[1], id: 0 }, {
      id: 0, personelId: p.id, ad: 'ajans', tur: 'menuYayin', ayrinti: 'sürüm 4', zaman: 2000,
    })
    assert.deepEqual((await depo.islemler(10, null)).map((i) => i.tur), ['giris'])
    assert.deepEqual((await depo.islemler(10, p.id)).map((i) => i.tur), ['foto', 'menuYayin'])
  })

  t('eskiIslemleriSil_sinirdanEskiler', async (depo) => {
    for (const zaman of [1000, 2000, 3000]) {
      await depo.islemEkle({ personelId: null, ad: 'bozo', tur: 'giris', ayrinti: '', zaman })
    }
    assert.equal(await depo.eskiIslemleriSil(2500), 2)
    assert.deepEqual((await depo.islemler(10)).map((i) => i.zaman), [3000])
  })

  t('menuSurumleri_yazarTasir', async (depo) => {
    const a = await depo.menuYayinla(menuBelgesi('a'), 'panel', 1000, null, 'ajans')
    assert.deepEqual(await depo.menuSurumleri(1), [{ id: a, olusturma: 1000, kaynak: 'panel', yazar: 'ajans' }])
  })
}

export function depoSozlesmesi(ad: string, kur: DepoKurucu | null): void {
  const t: Testci = (isim, govde) =>
    test(`${ad}_${isim}`, { skip: kur ? false : 'BOZO_TEST_DB_URL tanımlı değil' }, async () => {
      const depo = await (kur as DepoKurucu)()
      try {
        await govde(depo)
      } finally {
        await depo.kapat()
      }
    })
  jetonVeOyuncuTestleri(t)
  turTestleri(t)
  donemVeKazananTestleri(t)
  menuTestleri(t)
  personelTestleri(t)
}
