import { createConnection, createPool, type Pool } from 'mariadb'
import type { MenuBelgesi } from '../lib/menu/tipler.ts'
import type { Kanal } from '../lib/oyun/aktarim.ts'
import type { Bitis, Girdi } from '../lib/oyun/tipler.ts'
import type { IslemTuru } from '../lib/yonetim/personel.ts'
import type {
  Depo, Islem, Jeton, Kazanan, MenuKaynagi, Oyuncu, Personel, SiraSatiri, Tur, YeniTur,
} from './depo.ts'

/* MariaDB 10.11 deposu: hazır ifadeli sorgular (`execute`), zamanlar epoch ms (bkz. sema.sql). */

type Satir = Record<string, unknown>
type Yazim = { affectedRows: number; insertId: number }
type Sorgu = {
  sec(sql: string, p?: unknown[]): Promise<Satir[]>
  ilk(sql: string, p?: unknown[]): Promise<Satir | null>
  yaz(sql: string, p?: unknown[]): Promise<Yazim>
}
type Parca<K extends keyof Depo> = Pick<Depo, K>

const SIRA = 'puan DESC, tam_kivam DESC, kalkan ASC, olusturma_ms ASC'
const SIRA_T = 't.puan DESC, t.tam_kivam DESC, t.kalkan ASC, t.olusturma_ms ASC'
const SIRA_SECIM =
  't.id AS turId, t.oyuncu_id AS oyuncuId, o.takma_ad AS takmaAd, o.gizli, t.supheli, t.puan, ' +
  't.tam_kivam AS tamKivam, t.kalkan, t.olusturma_ms AS olusturma'
/** Her oyuncunun en iyi turu: pencere fonksiyonu oyuncu başına §6 sırasında numaralar. */
const EN_IYILER = `SELECT *, ROW_NUMBER() OVER (PARTITION BY oyuncu_id ORDER BY ${SIRA}) AS sira_no FROM tur`
const KAZANAN_SECIM =
  'k.id, k.donem, k.sira, k.oyuncu_id AS oyuncuId, k.takma_ad AS takmaAd, k.puan, k.kod_ozeti AS kodOzeti, ' +
  'k.deneme, k.gecerlilik_ms AS gecerlilik, k.kullanildi_ms AS kullanildi, COALESCE(o.gizli, 0) AS gizli ' +
  'FROM kazanan k LEFT JOIN oyuncu o ON o.id = k.oyuncu_id'

/** `logParam: false`: sürücü varsayılanı hata metnine parametreleri (parola özeti dahil) yazar, hata günlüğe düşer. */
export function havuzAyari(url: string) {
  return { ...baglantiCoz(url), connectionLimit: 5, bigIntAsNumber: true, insertIdAsNumber: true, logParam: false }
}

export function baglantiCoz(url: string) {
  const u = new URL(url)
  return {
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
  }
}

/** Şemayı kurar ve verilen tabloları boşaltır; yalnız test ve ilk kurulum için. */
export async function semayiUygula(url: string, sema: string, bosalt: readonly string[] = []): Promise<void> {
  const baglanti = await createConnection(baglantiCoz(url))
  try {
    const ifadeler = sema.replace(/^--.*$/gm, '').split(';').map((s) => s.trim()).filter(Boolean)
    for (const ifade of ifadeler) await baglanti.query(ifade)
    await baglanti.query('SET FOREIGN_KEY_CHECKS = 0')
    for (const tablo of bosalt) await baglanti.query(`TRUNCATE TABLE ${tablo}`)
    await baglanti.query('SET FOREIGN_KEY_CHECKS = 1')
  } finally {
    await baglanti.end()
  }
}

const sayi = (deger: unknown): number => Number(deger)
const bayrak = (deger: unknown): boolean => Number(deger) === 1
const sayiYaDaNull = (deger: unknown): number | null => (deger === null || deger === undefined ? null : Number(deger))

const jetonOku = (r: Satir): Jeton => ({
  id: String(r.id),
  tohum: sayi(r.tohum),
  kanal: r.kanal as Kanal,
  olusturma: sayi(r.olusturma_ms),
  sonaErme: sayi(r.sona_erme_ms),
  kullanildi: bayrak(r.kullanildi),
})

const oyuncuOku = (r: Satir): Oyuncu => ({ id: sayi(r.id), takmaAd: String(r.takma_ad), gizli: bayrak(r.gizli) })

const siraOku = (r: Satir): SiraSatiri => ({
  turId: sayi(r.turId),
  oyuncuId: sayi(r.oyuncuId),
  takmaAd: String(r.takmaAd),
  gizli: bayrak(r.gizli),
  supheli: bayrak(r.supheli),
  puan: sayi(r.puan),
  tamKivam: sayi(r.tamKivam),
  kalkan: sayi(r.kalkan),
  olusturma: sayi(r.olusturma),
})

const turOku = (r: Satir): Tur => ({
  id: sayi(r.id),
  jetonId: String(r.jeton_id),
  oyuncuId: sayi(r.oyuncu_id),
  takmaAd: String(r.takma_ad),
  donem: String(r.donem),
  tohum: sayi(r.tohum),
  puan: sayi(r.puan),
  ozet: {
    misafir: sayi(r.misafir),
    sis: sayi(r.sis),
    tamKivam: sayi(r.tam_kivam),
    enUzunKombo: sayi(r.en_uzun_kombo),
    kalkan: sayi(r.kalkan),
    bahsis: sayi(r.bahsis),
  },
  bitti: r.bitti as Bitis,
  tik: sayi(r.tik),
  kanal: r.kanal as Kanal,
  supheli: bayrak(r.supheli),
  girdiler: r.girdiler === null ? null : (JSON.parse(String(r.girdiler)) as Girdi[]),
  olusturma: sayi(r.olusturma_ms),
})

const kazananOku = (r: Satir): Kazanan => ({
  id: sayi(r.id),
  donem: String(r.donem),
  sira: sayi(r.sira),
  oyuncuId: sayiYaDaNull(r.oyuncuId),
  takmaAd: String(r.takmaAd),
  puan: sayi(r.puan),
  kodOzeti: String(r.kodOzeti),
  deneme: sayi(r.deneme),
  gecerlilik: sayi(r.gecerlilik),
  kullanildi: sayiYaDaNull(r.kullanildi),
  gizli: bayrak(r.gizli),
})

function jetonlar(q: Sorgu): Parca<'jetonEkle' | 'jetonBul' | 'jetonKullan' | 'suresiDolanJetonlariSil'> {
  return {
    async jetonEkle(j) {
      await q.yaz(
        'INSERT INTO tur_jetonu (id, tohum, kanal, olusturma_ms, sona_erme_ms, kullanildi) VALUES (?, ?, ?, ?, ?, ?)',
        [j.id, j.tohum, j.kanal, j.olusturma, j.sonaErme, j.kullanildi ? 1 : 0],
      )
    },
    async jetonBul(id) {
      const r = await q.ilk('SELECT * FROM tur_jetonu WHERE id = ?', [id])
      return r ? jetonOku(r) : null
    },
    async jetonKullan(id) {
      const r = await q.yaz('UPDATE tur_jetonu SET kullanildi = 1 WHERE id = ? AND kullanildi = 0', [id])
      return r.affectedRows === 1
    },
    async suresiDolanJetonlariSil(simdi) {
      return (await q.yaz('DELETE FROM tur_jetonu WHERE sona_erme_ms < ?', [simdi])).affectedRows
    },
  }
}

type OyuncuUclari = Parca<'oyuncuEkle' | 'oyuncuBul' | 'oyuncuGizle' | 'oyuncuSil' | 'eskiOyunculariSil'>

function oyuncular(q: Sorgu): OyuncuUclari {
  return {
    async oyuncuEkle(o) {
      try {
        const r = await q.yaz(
          'INSERT INTO oyuncu (anahtar_ozeti, takma_ad, ad_katlanmis, onay_zamani_ms, onay_surumu, olusturma_ms) ' +
            'VALUES (?, ?, ?, ?, ?, ?)',
          [o.anahtarOzeti, o.takmaAd, o.adKatlanmis, o.simdi, o.onaySurumu, o.simdi],
        )
        return { id: r.insertId, takmaAd: o.takmaAd, gizli: false }
      } catch (hata) {
        if ((hata as { errno?: number }).errno === 1062) return 'adKullanimda'
        throw hata
      }
    },
    async oyuncuBul(anahtarOzeti) {
      const r = await q.ilk('SELECT id, takma_ad, gizli FROM oyuncu WHERE anahtar_ozeti = ?', [anahtarOzeti])
      return r ? oyuncuOku(r) : null
    },
    async oyuncuGizle(id, gizli) {
      return (await q.yaz('UPDATE oyuncu SET gizli = ? WHERE id = ?', [gizli ? 1 : 0, id])).affectedRows === 1
    },
    async oyuncuSil(id) {
      return (await q.yaz('DELETE FROM oyuncu WHERE id = ?', [id])).affectedRows === 1
    },
    async eskiOyunculariSil(oncesi) {
      const r = await q.yaz('DELETE FROM oyuncu WHERE COALESCE(son_tur_ms, olusturma_ms) < ?', [oncesi])
      return r.affectedRows
    },
  }
}

/** Tur ve oyuncunun son turu tek işlemde yazılır. */
async function turYaz(havuz: Pool, t: YeniTur): Promise<number> {
  const baglanti = await havuz.getConnection()
  try {
    await baglanti.beginTransaction()
    const r = (await baglanti.execute(
      'INSERT INTO tur (jeton_id, oyuncu_id, donem, tohum, puan, misafir, sis, tam_kivam, en_uzun_kombo, kalkan, ' +
        'bahsis, bitti, tik, kanal, supheli, girdiler, olusturma_ms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        t.jetonId, t.oyuncuId, t.donem, t.tohum, t.puan, t.ozet.misafir, t.ozet.sis, t.ozet.tamKivam,
        t.ozet.enUzunKombo, t.ozet.kalkan, t.ozet.bahsis, t.bitti, t.tik, t.kanal, t.supheli ? 1 : 0, JSON.stringify(t.girdiler),
        t.olusturma,
      ],
    )) as Yazim
    await baglanti.execute('UPDATE oyuncu SET son_tur_ms = GREATEST(COALESCE(son_tur_ms, 0), ?) WHERE id = ?', [
      t.olusturma, t.oyuncuId,
    ])
    await baglanti.commit()
    return r.insertId
  } catch (hata) {
    await baglanti.rollback()
    throw hata
  } finally {
    baglanti.release()
  }
}

type TurUclari = Parca<'turEkle' | 'turBul' | 'siralama' | 'tumZamanlar' | 'girdileriKirp' | 'eskiGirdileriSil'>

function turlar(q: Sorgu, havuz: Pool): TurUclari {
  return {
    turEkle: (t) => turYaz(havuz, t),
    async turBul(id) {
      const sql = 'SELECT t.*, o.takma_ad FROM tur t JOIN oyuncu o ON o.id = t.oyuncu_id WHERE t.id = ?'
      const r = await q.ilk(sql, [id])
      return r ? turOku(r) : null
    },
    async siralama(donem) {
      const sql =
        `SELECT ${SIRA_SECIM} FROM (${EN_IYILER} WHERE donem = ?) t JOIN oyuncu o ON o.id = t.oyuncu_id ` +
        `WHERE t.sira_no = 1 ORDER BY ${SIRA_T}`
      return (await q.sec(sql, [donem])).map(siraOku)
    },
    async tumZamanlar(adet) {
      const sql =
        `SELECT ${SIRA_SECIM} FROM (${EN_IYILER}) t JOIN oyuncu o ON o.id = t.oyuncu_id ` +
        `WHERE t.sira_no = 1 ORDER BY ${SIRA_T} LIMIT ?`
      return (await q.sec(sql, [adet])).map(siraOku)
    },
    async girdileriKirp(donem, korunan) {
      const disinda = korunan.length ? ` AND id NOT IN (${korunan.map(() => '?').join(', ')})` : ''
      const sql = `UPDATE tur SET girdiler = NULL WHERE donem = ? AND girdiler IS NOT NULL${disinda}`
      return (await q.yaz(sql, [donem, ...korunan])).affectedRows
    },
    async eskiGirdileriSil(bitisiOncesi) {
      const sql =
        'UPDATE tur t JOIN donem d ON d.anahtar = t.donem SET t.girdiler = NULL ' +
        'WHERE d.bitis_ms < ? AND t.girdiler IS NOT NULL'
      return (await q.yaz(sql, [bitisiOncesi])).affectedRows
    },
  }
}

function donemler(q: Sorgu): Parca<'donemKaydet' | 'acikDonemler' | 'donemKapat'> {
  return {
    async donemKaydet(d) {
      await q.yaz('INSERT IGNORE INTO donem (anahtar, baslangic_ms, bitis_ms, kapanis_ms) VALUES (?, ?, ?, ?)', [
        d.anahtar, d.baslangic, d.bitis, d.kapanis,
      ])
    },
    async acikDonemler() {
      const satirlar = await q.sec('SELECT * FROM donem WHERE kapanis_ms IS NULL ORDER BY baslangic_ms')
      return satirlar.map((r) => ({
        anahtar: String(r.anahtar),
        baslangic: sayi(r.baslangic_ms),
        bitis: sayi(r.bitis_ms),
        kapanis: null,
      }))
    },
    async donemKapat(anahtar, simdi) {
      await q.yaz('UPDATE donem SET kapanis_ms = ? WHERE anahtar = ?', [simdi, anahtar])
    },
  }
}

type KazananUclari = Parca<
  'kazananEkle' | 'kazananlar' | 'sonSampiyon' | 'oyuncununOdulu' | 'kazananBul' | 'kazananKullan' | 'kazananlariSil'
>

function kazananlar(q: Sorgu): KazananUclari {
  const bul = async (kosul: string, p: unknown[]) => {
    const r = await q.ilk(`SELECT ${KAZANAN_SECIM} WHERE ${kosul}`, p)
    return r ? kazananOku(r) : null
  }
  return {
    async kazananEkle(k) {
      const r = await q.yaz(
        'INSERT INTO kazanan (donem, sira, oyuncu_id, takma_ad, puan, kod_ozeti, deneme, gecerlilik_ms) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [k.donem, k.sira, k.oyuncuId, k.takmaAd, k.puan, k.kodOzeti, k.deneme, k.gecerlilik],
      )
      return r.insertId
    },
    async kazananlar(donem) {
      return (await q.sec(`SELECT ${KAZANAN_SECIM} WHERE k.donem = ? ORDER BY k.sira`, [donem])).map(kazananOku)
    },
    sonSampiyon: () => bul('k.sira = 1 ORDER BY k.donem DESC LIMIT 1', []),
    oyuncununOdulu: (oyuncuId) => bul('k.oyuncu_id = ? ORDER BY k.donem DESC LIMIT 1', [oyuncuId]),
    kazananBul: (kodOzeti) => bul('k.kod_ozeti = ?', [kodOzeti]),
    async kazananKullan(id, simdi) {
      const r = await q.yaz('UPDATE kazanan SET kullanildi_ms = ? WHERE id = ? AND kullanildi_ms IS NULL', [simdi, id])
      return r.affectedRows === 1
    },
    async kazananlariSil() {
      return (await q.yaz('DELETE FROM kazanan')).affectedRows
    },
  }
}

function sayaclar(q: Sorgu): Parca<'sayacArtir' | 'sayaclar'> {
  return {
    async sayacArtir(gun, kanal) {
      await q.yaz('INSERT INTO gunluk_sayac (gun, kanal, tur) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE tur = tur + 1', [
        gun, kanal,
      ])
    },
    async sayaclar(gun) {
      const sayim: Record<Kanal, number> = { sofra: 0, ig: 0, site: 0, yok: 0 }
      for (const r of await q.sec('SELECT kanal, tur FROM gunluk_sayac WHERE gun = ?', [gun])) {
        sayim[r.kanal as Kanal] = sayi(r.tur)
      }
      return sayim
    },
  }
}

function taramalar(q: Sorgu): Parca<'taramaArtir' | 'taramaOzeti'> {
  return {
    async taramaArtir(gun, masa) {
      await q.yaz(
        'INSERT INTO masa_tarama (gun, masa, adet) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE adet = adet + 1',
        [gun, masa],
      )
    },
    async taramaOzeti(bugun, haftaBasi) {
      const satirlar = await q.sec(
        `SELECT masa, SUM(CASE WHEN gun = ? THEN adet ELSE 0 END) AS bugun,
                SUM(CASE WHEN gun >= ? THEN adet ELSE 0 END) AS hafta, SUM(adet) AS toplam
           FROM masa_tarama GROUP BY masa ORDER BY masa`,
        [bugun, haftaBasi],
      )
      return satirlar.map((r) => ({
        masa: sayi(r.masa),
        bugun: sayi(r.bugun),
        hafta: sayi(r.hafta),
        toplam: sayi(r.toplam),
      }))
    },
  }
}

function menuOku(r: Satir): { id: number; belge: MenuBelgesi } {
  const id = sayi(r.id)
  try {
    return { id, belge: JSON.parse(String(r.belge)) as MenuBelgesi }
  } catch (hata) {
    throw new Error(`menu_surum ${id}: kayıtlı belge okunamadı (bozuk JSON)`, { cause: hata })
  }
}

function menuler(q: Sorgu): Parca<'menuGecerli' | 'menuYayinla' | 'menuSurumleri' | 'menuSurumBul'> {
  return {
    async menuGecerli() {
      const r = await q.ilk('SELECT id, belge FROM menu_surum ORDER BY id DESC LIMIT 1')
      return r ? menuOku(r) : null
    },
    async menuYayinla(belge, kaynak, simdi, taban, yazar = null) {
      // Taban denetimi ve ekleme tek deyim: yarışta kaybeden satır yazmaz (affectedRows 0).
      const sql =
        'INSERT INTO menu_surum (belge, kaynak, olusturma_ms, yazar) SELECT ?, ?, ?, ? FROM DUAL ' +
        'WHERE (SELECT COALESCE(MAX(id), 0) FROM menu_surum) = ?'
      try {
        const r = await q.yaz(sql, [JSON.stringify(belge), kaynak, simdi, yazar, taban ?? 0])
        return r.affectedRows === 0 ? null : r.insertId
      } catch (hata) {
        // Aynı tabandan iki eşzamanlı yayında InnoDB birini deadlock kurbanı seçer: o da bayat tabandır.
        if ((hata as { errno?: number }).errno === 1213) return null
        throw hata
      }
    },
    async menuSurumleri(adet) {
      const sql = 'SELECT id, kaynak, olusturma_ms, yazar FROM menu_surum ORDER BY id DESC LIMIT ?'
      return (await q.sec(sql, [adet])).map((r) => ({
        id: sayi(r.id),
        olusturma: sayi(r.olusturma_ms),
        kaynak: r.kaynak as MenuKaynagi,
        yazar: r.yazar === null ? null : String(r.yazar),
      }))
    },
    async menuSurumBul(id) {
      const r = await q.ilk('SELECT id, belge FROM menu_surum WHERE id = ?', [id])
      return r ? menuOku(r) : null
    },
  }
}

const PERSONEL_SECIM =
  'SELECT id, ad, parola_ozeti, sifre_degismeli, kapali, oturum_surumu, olusturma_ms, son_giris_ms ' +
  'FROM yonetim_personel'

const personelOku = (r: Satir): Personel => ({
  id: sayi(r.id),
  ad: String(r.ad),
  parolaOzeti: String(r.parola_ozeti),
  sifreDegismeli: bayrak(r.sifre_degismeli),
  kapali: bayrak(r.kapali),
  oturumSurumu: sayi(r.oturum_surumu),
  olusturma: sayi(r.olusturma_ms),
  sonGiris: sayiYaDaNull(r.son_giris_ms),
})

type PersonelUclari = Parca<
  'personelEkle' | 'personelBul' | 'personelAdla' | 'personelListesi' | 'personelSifreKoy' | 'personelKapat' |
  'personelGirisKaydet'
>

function personeller(q: Sorgu): PersonelUclari {
  const bul = async (id: number) => {
    const r = await q.ilk(`${PERSONEL_SECIM} WHERE id = ?`, [id])
    return r ? personelOku(r) : null
  }
  const guncelle = async (id: number, set: string, p: unknown[]) => {
    const sql = `UPDATE yonetim_personel SET ${set}, oturum_surumu = oturum_surumu + 1 WHERE id = ?`
    return (await q.yaz(sql, [...p, id])).affectedRows === 1 ? bul(id) : null
  }
  return {
    async personelEkle(ad, parolaOzeti, simdi) {
      try {
        const r = await q.yaz(
          'INSERT INTO yonetim_personel (ad, parola_ozeti, sifre_degismeli, kapali, oturum_surumu, olusturma_ms) ' +
            'VALUES (?, ?, 1, 0, 1, ?)',
          [ad, parolaOzeti, simdi],
        )
        return (await bul(r.insertId)) as Personel
      } catch (hata) {
        if ((hata as { errno?: number }).errno === 1062) return 'adKullanimda'
        throw hata
      }
    },
    personelBul: bul,
    async personelAdla(ad) {
      const r = await q.ilk(`${PERSONEL_SECIM} WHERE ad = ?`, [ad])
      return r ? personelOku(r) : null
    },
    async personelListesi() {
      return (await q.sec(`${PERSONEL_SECIM} ORDER BY ad`)).map(personelOku)
    },
    personelSifreKoy: (id, ozet, degismeli) =>
      guncelle(id, 'parola_ozeti = ?, sifre_degismeli = ?', [ozet, degismeli ? 1 : 0]),
    personelKapat: (id, kapali) => guncelle(id, 'kapali = ?', [kapali ? 1 : 0]),
    async personelGirisKaydet(id, simdi) {
      await q.yaz('UPDATE yonetim_personel SET son_giris_ms = ? WHERE id = ?', [simdi, id])
    },
  }
}

const islemOku = (r: Satir): Islem => ({
  id: sayi(r.id),
  personelId: sayiYaDaNull(r.personel_id),
  ad: String(r.ad),
  tur: r.tur as IslemTuru,
  ayrinti: String(r.ayrinti),
  zaman: sayi(r.zaman_ms),
})

function islemKaydi(q: Sorgu): Parca<'islemEkle' | 'islemler' | 'eskiIslemleriSil'> {
  const SECIM = 'SELECT id, personel_id, ad, tur, ayrinti, zaman_ms FROM yonetim_islem'
  return {
    async islemEkle(i) {
      await q.yaz(
        'INSERT INTO yonetim_islem (personel_id, ad, tur, ayrinti, zaman_ms) VALUES (?, ?, ?, ?, ?)',
        [i.personelId, i.ad, i.tur, i.ayrinti, i.zaman],
      )
    },
    async islemler(adet, personelId) {
      const sira = 'ORDER BY zaman_ms DESC, id DESC LIMIT ?'
      if (personelId === undefined) return (await q.sec(`${SECIM} ${sira}`, [adet])).map(islemOku)
      const kosul = personelId === null ? 'personel_id IS NULL' : 'personel_id = ?'
      const p = personelId === null ? [adet] : [personelId, adet]
      return (await q.sec(`${SECIM} WHERE ${kosul} ${sira}`, p)).map(islemOku)
    },
    async eskiIslemleriSil(oncesi) {
      return (await q.yaz('DELETE FROM yonetim_islem WHERE zaman_ms < ?', [oncesi])).affectedRows
    },
  }
}

export function mariaDepoKur(url: string): Depo {
  const havuz = createPool(havuzAyari(url))
  const q: Sorgu = {
    sec: async (sql, p = []) => (await havuz.execute(sql, p)) as Satir[],
    ilk: async (sql, p = []) => ((await havuz.execute(sql, p)) as Satir[])[0] ?? null,
    yaz: async (sql, p = []) => (await havuz.execute(sql, p)) as Yazim,
  }
  return {
    ...jetonlar(q),
    ...oyuncular(q),
    ...turlar(q, havuz),
    ...donemler(q),
    ...kazananlar(q),
    ...sayaclar(q),
    ...taramalar(q),
    ...menuler(q),
    ...personeller(q),
    ...islemKaydi(q),
    kapat: () => havuz.end(),
  }
}
