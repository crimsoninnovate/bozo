import type { Kanal } from '../lib/oyun/aktarim.ts'
import type { Depo, Donem, Jeton, Kazanan, Oyuncu, SiraSatiri, Tur } from './depo.ts'
import { enIyiler } from './siralama.ts'

/* Bellekte depo: uç testleri ve veritabanısız yerel geliştirme. Süreç bitince her şey gider. */

type OyuncuKaydi = Oyuncu & {
  anahtarOzeti: string
  adKatlanmis: string
  onaySurumu: string
  olusturma: number
  sonTur: number | null
}

type Bellek = {
  jetonlar: Map<string, Jeton>
  oyuncular: Map<number, OyuncuKaydi>
  turlar: Map<number, Tur>
  donemler: Map<string, Donem>
  kazananlar: Map<number, Kazanan>
  sayac: Map<string, number>
  sonId: number
}

type Parca<K extends keyof Depo> = Pick<Depo, K>

function jetonlar(b: Bellek): Parca<'jetonEkle' | 'jetonBul' | 'jetonKullan' | 'suresiDolanJetonlariSil'> {
  return {
    async jetonEkle(j) {
      b.jetonlar.set(j.id, { ...j })
    },
    async jetonBul(id) {
      const j = b.jetonlar.get(id)
      return j ? { ...j } : null
    },
    async jetonKullan(id) {
      const j = b.jetonlar.get(id)
      if (!j || j.kullanildi) return false
      j.kullanildi = true
      return true
    },
    async suresiDolanJetonlariSil(simdi) {
      let sayi = 0
      for (const [id, j] of b.jetonlar) if (j.sonaErme < simdi) sayi += Number(b.jetonlar.delete(id))
      return sayi
    },
  }
}

function oyuncuyuSil(b: Bellek, id: number): boolean {
  for (const [tid, t] of b.turlar) if (t.oyuncuId === id) b.turlar.delete(tid)
  for (const k of b.kazananlar.values()) if (k.oyuncuId === id) k.oyuncuId = null
  return b.oyuncular.delete(id)
}

type OyuncuUclari = Parca<'oyuncuEkle' | 'oyuncuBul' | 'oyuncuGizle' | 'oyuncuSil' | 'eskiOyunculariSil'>

function oyuncular(b: Bellek): OyuncuUclari {
  return {
    async oyuncuEkle(y) {
      for (const o of b.oyuncular.values()) if (o.adKatlanmis === y.adKatlanmis) return 'adKullanimda'
      const id = ++b.sonId
      b.oyuncular.set(id, {
        id,
        anahtarOzeti: y.anahtarOzeti,
        takmaAd: y.takmaAd,
        adKatlanmis: y.adKatlanmis,
        onaySurumu: y.onaySurumu,
        gizli: false,
        olusturma: y.simdi,
        sonTur: null,
      })
      return { id, takmaAd: y.takmaAd, gizli: false }
    },
    async oyuncuBul(anahtarOzeti) {
      for (const o of b.oyuncular.values()) {
        if (o.anahtarOzeti === anahtarOzeti) return { id: o.id, takmaAd: o.takmaAd, gizli: o.gizli }
      }
      return null
    },
    async oyuncuGizle(id, gizli) {
      const o = b.oyuncular.get(id)
      if (!o) return false
      o.gizli = gizli
      return true
    },
    async oyuncuSil(id) {
      return oyuncuyuSil(b, id)
    },
    async eskiOyunculariSil(oncesi) {
      let sayi = 0
      for (const o of [...b.oyuncular.values()]) {
        if ((o.sonTur ?? o.olusturma) < oncesi) sayi += Number(oyuncuyuSil(b, o.id))
      }
      return sayi
    },
  }
}

function siraSatiri(b: Bellek, t: Tur): SiraSatiri | null {
  const o = b.oyuncular.get(t.oyuncuId)
  if (!o) return null
  return {
    turId: t.id,
    oyuncuId: t.oyuncuId,
    takmaAd: o.takmaAd,
    gizli: o.gizli,
    supheli: t.supheli,
    puan: t.puan,
    tamKivam: t.ozet.tamKivam,
    kalkan: t.ozet.kalkan,
    olusturma: t.olusturma,
  }
}

type TurUclari = Parca<'turEkle' | 'turBul' | 'siralama' | 'tumZamanlar' | 'girdileriKirp' | 'eskiGirdileriSil'>

function turlar(b: Bellek): TurUclari {
  const satirlar = (sec: (t: Tur) => boolean) =>
    [...b.turlar.values()].filter(sec).flatMap((t) => siraSatiri(b, t) ?? [])
  return {
    async turEkle(t) {
      const o = b.oyuncular.get(t.oyuncuId)
      if (!o) throw new Error(`tur için oyuncu yok: ${t.oyuncuId}`)
      const id = ++b.sonId
      b.turlar.set(id, { ...t, id, takmaAd: o.takmaAd, girdiler: [...t.girdiler] })
      o.sonTur = Math.max(o.sonTur ?? 0, t.olusturma)
      return id
    },
    async turBul(id) {
      const t = b.turlar.get(id)
      return t ? { ...t, girdiler: t.girdiler ? [...t.girdiler] : null } : null
    },
    async siralama(donem) {
      return enIyiler(satirlar((t) => t.donem === donem))
    },
    async tumZamanlar(adet) {
      return enIyiler(satirlar(() => true)).slice(0, adet)
    },
    async girdileriKirp(donem, korunan) {
      let sayi = 0
      for (const t of b.turlar.values()) {
        if (t.donem !== donem || t.girdiler === null || korunan.includes(t.id)) continue
        t.girdiler = null
        sayi++
      }
      return sayi
    },
    async eskiGirdileriSil(bitisiOncesi) {
      let sayi = 0
      for (const t of b.turlar.values()) {
        const d = b.donemler.get(t.donem)
        if (!d || d.bitis >= bitisiOncesi || t.girdiler === null) continue
        t.girdiler = null
        sayi++
      }
      return sayi
    },
  }
}

function donemler(b: Bellek): Parca<'donemKaydet' | 'acikDonemler' | 'donemKapat'> {
  return {
    async donemKaydet(d) {
      if (!b.donemler.has(d.anahtar)) b.donemler.set(d.anahtar, { ...d })
    },
    async acikDonemler() {
      return [...b.donemler.values()].filter((d) => d.kapanis === null).sort((x, y) => x.baslangic - y.baslangic)
    },
    async donemKapat(anahtar, simdi) {
      const d = b.donemler.get(anahtar)
      if (d) d.kapanis = simdi
    },
  }
}

type KazananUclari = Parca<
  'kazananEkle' | 'kazananlar' | 'sonSampiyon' | 'oyuncununOdulu' | 'kazananBul' | 'kazananKullan' | 'kazananlariSil'
>

function kazananlar(b: Bellek): KazananUclari {
  const sira = (x: Kazanan, y: Kazanan) => y.donem.localeCompare(x.donem) || x.sira - y.sira
  const oku = (k: Kazanan): Kazanan => ({
    ...k,
    gizli: k.oyuncuId !== null && (b.oyuncular.get(k.oyuncuId)?.gizli ?? false),
  })
  const sec = (uyan: (k: Kazanan) => boolean) => [...b.kazananlar.values()].filter(uyan).sort(sira).map(oku)
  return {
    async kazananEkle(k) {
      // `sema.sql` > `kazanan_donem_sira` ile aynı kural.
      const ayni = sec((x) => x.donem === k.donem && x.sira === k.sira)
      if (ayni.length > 0) throw new Error(`kazanan var: ${k.donem}/${k.sira}`)
      const id = ++b.sonId
      b.kazananlar.set(id, { ...k, id, gizli: false, kullanildi: null })
      return id
    },
    async kazananlar(donem) {
      return sec((k) => k.donem === donem)
    },
    async sonSampiyon() {
      return sec((k) => k.sira === 1)[0] ?? null
    },
    async oyuncununOdulu(oyuncuId) {
      return sec((k) => k.oyuncuId === oyuncuId)[0] ?? null
    },
    async kazananBul(kodOzeti) {
      return sec((k) => k.kodOzeti === kodOzeti)[0] ?? null
    },
    async kazananKullan(id, simdi) {
      const k = b.kazananlar.get(id)
      if (!k || k.kullanildi !== null) return false
      k.kullanildi = simdi
      return true
    },
    async kazananlariSil() {
      const sayi = b.kazananlar.size
      b.kazananlar.clear()
      return sayi
    },
  }
}

function sayaclar(b: Bellek): Parca<'sayacArtir' | 'sayaclar'> {
  return {
    async sayacArtir(gun, kanal) {
      b.sayac.set(`${gun}:${kanal}`, (b.sayac.get(`${gun}:${kanal}`) ?? 0) + 1)
    },
    async sayaclar(gun) {
      const al = (k: Kanal) => b.sayac.get(`${gun}:${k}`) ?? 0
      return { sofra: al('sofra'), ig: al('ig'), site: al('site'), yok: al('yok') }
    },
  }
}

export function bellekDepoKur(): Depo {
  const b: Bellek = {
    jetonlar: new Map(),
    oyuncular: new Map(),
    turlar: new Map(),
    donemler: new Map(),
    kazananlar: new Map(),
    sayac: new Map(),
    sonId: 0,
  }
  return {
    ...jetonlar(b),
    ...oyuncular(b),
    ...turlar(b),
    ...donemler(b),
    ...kazananlar(b),
    ...sayaclar(b),
    async kapat() {
      /* bellek */
    },
  }
}
