import { test } from 'node:test'
import assert from 'node:assert/strict'
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
    ozet: { sofra: 1, sis: 2, tamKivam: 0, enUzunKombo: 1, kalkan: 0 },
    bitti: 'gece',
    tik: 7200,
    kanal: 'yok',
    supheli: false,
    girdiler: [[0, 's0']],
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
    const ozet = { sofra: 1, sis: 2, tamKivam: 1, enUzunKombo: 1, kalkan: 0 }
    await depo.turEkle(tur(b.id, '2026-10-05', 300, { olusturma: 3, ozet }))
    await depo.turEkle(tur(b.id, '2026-09-28', 900, { olusturma: 0 }))
    const sirali = await depo.siralama('2026-10-05')
    assert.deepEqual(sirali.map((s) => [s.takmaAd, s.puan, s.tamKivam]), [['B', 300, 1], ['A', 300, 0]])
    assert.equal(sirali[1]?.turId, aEnIyi)
    assert.deepEqual((await depo.tumZamanlar(1)).map((s) => [s.takmaAd, s.puan]), [['B', 900]])
    const bulunan = await depo.turBul(aEnIyi)
    assert.equal(bulunan?.takmaAd, 'A')
    assert.deepEqual(bulunan?.girdiler, [[0, 's0']])
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

  t('sayac_artirVeOku_gunVeKanalBasina', async (depo) => {
    await depo.sayacArtir('2026-10-08', 'sofra')
    await depo.sayacArtir('2026-10-08', 'sofra')
    await depo.sayacArtir('2026-10-08', 'site')
    await depo.sayacArtir('2026-10-09', 'ig')
    assert.deepEqual(await depo.sayaclar('2026-10-08'), { sofra: 2, ig: 0, site: 1, yok: 0 })
    assert.deepEqual(await depo.sayaclar('2026-10-10'), { sofra: 0, ig: 0, site: 0, yok: 0 })
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
}
