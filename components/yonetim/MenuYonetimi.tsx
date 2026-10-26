'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { yonetim as m } from '@/content/yonetim'
import { menuBelgesiDogrula, type Sonuc } from '@/lib/menu/dogrulama'
import {
  icecekEkle, icecekSil, kalemEkle, kalemSil, kalemTasi, olcuEkle, olcuSil,
} from '@/lib/menu/duzenleme'
import { menuFarki, type Degisiklik } from '@/lib/menu/fark'
import type { MenuYayinYaniti, SurumOzeti, YonetimMenuYaniti } from '@/lib/menu/aktarim'
import {
  degisiklikVarMi, duyuruGorunmeyecek, eskiBelgeMi, hataSekmeleri, hataSekmesi, panelBelgesi, yayinDurumu,
  type Sekme,
} from '@/lib/menu/panel'
import type { Duyuru, IcecekKalemi, Iletisim, MenuBelgesi, MenuKalemi, OzelKalem } from '@/lib/menu/tipler'
import { doldur } from '@/lib/metin'
import type { YonetimApi } from '@/lib/oyun/api'
import { YeniKayit, hatalariEsle, type Hatalar } from './Alanlar'
import { DuyuruFormu } from './DuyuruFormu'
import { Gecmis, surumTarihi } from './Gecmis'
import { IcecekFormu } from './IcecekFormu'
import { IkramFormu } from './IkramFormu'
import { IletisimFormu } from './IletisimFormu'
import { KalemFormu, OzelFormu } from './KalemFormu'
import { Giris, hataIsle, useOturum } from './oturum'
import { PanelUst } from './PanelUst'
import { SiteDurumu } from './SiteDurumu'
import { taslagiYukle, useTaslakKaydi } from './taslak'
import { YayinBari } from './YayinBari'
import { YayinOnayi } from './YayinOnayi'
import ortak from './oturum.module.css'
import stil from './MenuYonetimi.module.css'

/* Menü paneli (spec 2026-10-26): çalışma kopyası düzenlenir, hata anında görünür, yayın farkla onaylanır.
   Sürüm kimliği (`taban`) yayında sunucuya gider; başkası araya girdiyse 409 döner. */

/** `geriAl`: dönülecek sürüm ve içeriği (farkı göstermek için önceden okunur). */
type Onay = { geriAl: { surum: SurumOzeti; belge: MenuBelgesi } | null }
export type Duzenle = (fn: (kopya: MenuBelgesi) => MenuBelgesi | void) => void

type ListeProps = { belge: MenuBelgesi; hatalar: Hatalar; duzenle: Duzenle }

function Ocakbasi({ belge, hatalar, duzenle }: ListeProps) {
  const duz = (id: string) => (fn: (k: MenuKalemi) => void) =>
    duzenle((b) => { const k = b.kalemler.find((x) => x.id === id); if (k) fn(k) })
  return (
    <div className={stil.liste}>
      <h2 className={stil.bolumBaslik}>{m.menu.sekme.ocakbasi}</h2>
      <p className={ortak.not}>{m.menu.tukendiNot} {m.menu.kalem.durumNot}</p>
      {belge.kalemler.map((kalem, n) => (
        <KalemFormu key={kalem.id} kalem={kalem} sira={n} son={n === belge.kalemler.length - 1}
          hatalar={hatalar} duz={duz(kalem.id)}
          onTasi={(yon) => duzenle((b) => kalemTasi(b, kalem.id, yon))}
          onSil={() => duzenle((b) => kalemSil(b, kalem.id))} />
      ))}
      <YeniKayit etiket={m.menu.kalem.yeniAd} dugme={m.menu.kalem.ekle}
        onEkle={(ad) => duzenle((b) => kalemEkle(b, ad))} />
    </div>
  )
}

function Icecekler({ belge, hatalar, duzenle }: ListeProps) {
  const duz = (id: string) => (fn: (i: IcecekKalemi) => void) =>
    duzenle((b) => { const i = b.icecekler.find((x) => x.id === id); if (i) fn(i) })
  return (
    <div className={stil.liste}>
      <h2 className={stil.bolumBaslik}>{m.menu.sekme.icecekler}</h2>
      <p className={ortak.not}>{m.menu.tukendiNot}</p>
      {belge.icecekler.map((icecek, n) => (
        <IcecekFormu key={icecek.id} icecek={icecek} sira={n} hatalar={hatalar} duz={duz(icecek.id)}
          onOlcuEkle={() => duzenle((b) => olcuEkle(b, icecek.id))}
          onOlcuSil={(s) => duzenle((b) => olcuSil(b, icecek.id, s))}
          onSil={() => duzenle((b) => icecekSil(b, icecek.id))} />
      ))}
      <YeniKayit etiket={m.menu.icecek.yeniAd} dugme={m.menu.icecek.ekle}
        onEkle={(ad) => duzenle((b) => icecekEkle(b, ad))} />
    </div>
  )
}

type PanelProps = { api: YonetimApi; cik: () => void; baz: MenuBelgesi }
type Mesaj = { metin: string; hata: boolean }

/** Sunucudaki menü, çalışma kopyası ve yayın/geri alma işlemleri. */
function useCalisma({ api, cik, baz }: PanelProps) {
  const [canli, setCanli] = useState<YonetimMenuYaniti | null>(null)
  const [eski, setEski] = useState(false)
  const [belge, setBelge] = useState<MenuBelgesi>(baz)
  const [mesgul, setMesgul] = useState(false)
  const [mesaj, setMesaj] = useState<Mesaj | null>(null)
  const [hazir, setHazir] = useState(false)

  /** Sunucudaki yayındaki sürüm 1. sürüm biçimindeyse `eski` olur; panel belgeyi 2. sürüme tamamlar. */
  const yukle = useCallback(async () => {
    const yanit = await api.menu()
    const gecerli = yanit.gecerli && { ...yanit.gecerli, belge: panelBelgesi(yanit.gecerli.belge, baz) }
    const tam = { ...yanit, gecerli }
    setEski(yanit.gecerli !== null && eskiBelgeMi(yanit.gecerli.belge))
    setCanli(tam)
    return tam
  }, [api, baz])
  useEffect(() => {
    yukle().then(
      (y) => {
        const t = taslagiYukle(y.gecerli?.surum ?? null, y.gecerli?.belge ?? baz)
        setBelge(t.belge)
        if (t.mesaj) setMesaj({ metin: t.mesaj, hata: false })
        setHazir(true)
      },
      (h: unknown) => setMesaj({ metin: hataIsle(h, cik), hata: true }),
    )
  }, [yukle, baz, cik])

  const duzenle: Duzenle = (fn) => {
    const kopya = structuredClone(belge)
    setBelge(fn(kopya) ?? kopya)
    setMesaj(null)
  }
  /** Yayın ya da geri alma; sunucunun verdiği sürüm hemen `taban` olur, liste sonra tazelenir. */
  const bitir = async (is: () => Promise<MenuYayinYaniti>, yeni: MenuBelgesi) => {
    setMesgul(true)
    try {
      const { surum } = await is()
      setCanli((c) => ({ surumler: c?.surumler ?? [], gecerli: { surum, belge: yeni } }))
      setBelge(yeni)
      setMesaj({ metin: m.menu.yayinda, hata: false })
      await yukle().catch((h: unknown) => console.warn('sürüm listesi tazelenemedi', hataIsle(h, cik)))
    } catch (h) {
      setMesaj({ metin: hataIsle(h, cik), hata: true })
    } finally {
      setMesgul(false)
    }
  }
  /**
   * Geri almadan önce eski sürümün belgesi okunur; olmazsa hata yazılır ve `null` döner. Eksik bölümler
   * yayındaki sürümden gelir (sunucu geri almada da böyle tamamlar), böylece fark gerçek sonucu gösterir.
   */
  const surumGetir = async (id: number): Promise<MenuBelgesi | null> => {
    setMesgul(true)
    try {
      return panelBelgesi((await api.menuSurumu(id)).belge, canli?.gecerli?.belge ?? baz)
    } catch (h) {
      setMesaj({ metin: hataIsle(h, cik), hata: true })
      return null
    } finally {
      setMesgul(false)
    }
  }
  return { canli, eski, belge, hazir, mesgul, mesaj, duzenle, bitir, surumGetir }
}

/** Çalışma kopyasından türeyen her şey: doğrulama, fark, hatalı sekmeler ve alt barın durumu. */
function useTuretilmis(belge: MenuBelgesi, canli: YonetimMenuYaniti | null, baz: MenuBelgesi, eski: boolean) {
  const sonuc = useMemo(() => menuBelgesiDogrula(belge), [belge])
  const hatalar = useMemo(() => hatalariEsle(sonuc.tamam ? [] : sonuc.hatalar), [sonuc])
  const hataliSekmeler = useMemo(() => hataSekmeleri(hatalar.keys()), [hatalar])
  const yayindaki = canli?.gecerli?.belge ?? baz
  const fark = useMemo(() => (sonuc.tamam ? menuFarki(yayindaki, sonuc.belge) : []), [sonuc, yayindaki])
  const durum = yayinDurumu({
    hataSayisi: sonuc.tamam ? 0 : sonuc.hatalar.length,
    ilkHata: sonuc.tamam ? null : hataSekmesi(sonuc.hatalar[0]?.yol ?? ''),
    degisiklik: fark.length,
    eski,
  })
  const taban = canli?.gecerli?.surum ?? null
  const degisiklikVar = degisiklikVarMi(yayindaki, belge)
  return { sonuc, hatalar, hataliSekmeler, yayindaki, fark, durum, taban, degisiklikVar }
}

type IcerikProps = ListeProps & {
  sekme: Sekme
  canli: YonetimMenuYaniti
  taban: number | null
  mesgul: boolean
  onDon: (surum: SurumOzeti) => void
}

function SekmeIcerigi({ sekme, belge, hatalar, duzenle, canli, taban, mesgul, onDon }: IcerikProps) {
  switch (sekme) {
    case 'ocakbasi':
      return <Ocakbasi belge={belge} hatalar={hatalar} duzenle={duzenle} />
    case 'ozel':
      return (
        <OzelFormu ozel={belge.ozel} hatalar={hatalar}
          duz={(fn: (o: OzelKalem) => void) => duzenle((b) => fn(b.ozel))} />
      )
    case 'icecekler':
      return <Icecekler belge={belge} hatalar={hatalar} duzenle={duzenle} />
    case 'ikramlar':
      return <IkramFormu belge={belge} hatalar={hatalar} duzenle={duzenle} />
    case 'duyuru':
      return (
        <DuyuruFormu duyuru={belge.duyuru} hatalar={hatalar}
          duz={(fn: (d: Duyuru) => void) => duzenle((b) => fn(b.duyuru))} />
      )
    case 'iletisim':
      return (
        <IletisimFormu iletisim={belge.iletisim} hatalar={hatalar}
          duz={(fn: (i: Iletisim) => void) => duzenle((b) => fn(b.iletisim))} />
      )
    case 'gecmis':
      return (
        <>
          <SiteDurumu yayinSurum={taban} />
          <Gecmis surumler={canli.surumler} yayindaki={taban} mesgul={mesgul} onDon={onDon} />
        </>
      )
  }
}

function Calisma(props: PanelProps) {
  const { api, cik, baz } = props
  const { canli, eski, belge, hazir, mesgul, mesaj, duzenle, bitir, surumGetir } = useCalisma(props)
  const t = useTuretilmis(belge, canli, baz, eski)
  const [sekme, setSekme] = useState<Sekme>('ocakbasi')
  const [onay, setOnayDurumu] = useState<Onay | null>(null)
  useKaydedilmemisUyari(t.degisiklikVar)
  useTaslakKaydi(hazir, t.taban, belge, t.degisiklikVar)

  /** Onay ekranı sayfanın başından açılır: fark ve uyarılar okunur, düğmeleri alt barda. */
  const setOnay = (o: Onay | null) => { setOnayDurumu(o); if (o) window.scrollTo(0, 0) }
  const onayla = async () => {
    const geriAl = onay?.geriAl
    const { sonuc, taban } = t
    if (geriAl) await bitir(() => api.menuGeriAl(geriAl.surum.id, taban), geriAl.belge)
    else if (sonuc.tamam) await bitir(() => api.menuYayinla(taban, sonuc.belge), sonuc.belge)
    setOnay(null)
  }
  const surumeDon = async (surum: SurumOzeti) => {
    const eski = await surumGetir(surum.id)
    if (eski) setOnay({ geriAl: { surum, belge: eski } })
  }

  if (!canli) return <Yukleniyor cik={cik} mesaj={mesaj} />
  const sec = (s: Sekme) => { setSekme(s); setOnay(null) }
  const bar = !onay && sekme !== 'gecmis'
  return (
    <>
      <PanelUst cik={cik} calisma={{ taban: t.taban, sekme, hatali: t.hataliSekmeler, sec }} />
      <div className={stil.icerik}>
        <Mesajlar mesaj={mesaj} eskiNot={bar && eski && t.fark.length === 0 && !t.durum.kapali} />
        {onay ? (
          <OnayEkrani onay={onay} fark={t.fark} yayindaki={t.yayindaki} sonuc={t.sonuc} belge={belge}
            mesgul={mesgul} onayla={onayla} vazgec={() => setOnay(null)} />
        ) : (
          <SekmeIcerigi sekme={sekme} belge={belge} hatalar={t.hatalar} duzenle={duzenle} canli={canli}
            taban={t.taban} mesgul={mesgul} onDon={surumeDon} />
        )}
      </div>
      {bar && (
        <YayinBari durum={t.durum} degisiklikVar={t.degisiklikVar} onYayinla={() => setOnay({ geriAl: null })}
          onAt={() => duzenle(() => structuredClone(t.yayindaki))} />
      )}
    </>
  )
}

/** Yayındaki menü gelene kadar: üst bar (Çıkış) ve okuma notu ya da yükleme hatası. */
function Yukleniyor({ cik, mesaj }: { cik: () => void; mesaj: Mesaj | null }) {
  return (
    <>
      <PanelUst cik={cik} />
      <div className={stil.icerik}>
        {mesaj ? <Mesajlar mesaj={mesaj} /> : <p className={ortak.not}>{m.menu.yukleniyor}</p>}
      </div>
    </>
  )
}

type MesajProps = { mesaj: Mesaj | null; eskiNot?: boolean }

/** Sekmelerin hemen altındaki ileti satırı: yayın sonucu, hata, taslak ve eski biçim notu. */
function Mesajlar({ mesaj, eskiNot = false }: MesajProps) {
  if (!mesaj && !eskiNot) return null
  return (
    <>
      {mesaj && (
        <p className={mesaj.hata ? ortak.hata : stil.tamam} role={mesaj.hata ? 'alert' : 'status'}>{mesaj.metin}</p>
      )}
      {eskiNot && <p className={ortak.not}>{m.menu.eskiSurum}</p>}
    </>
  )
}

type OnayProps = {
  onay: Onay
  fark: Degisiklik[]
  yayindaki: MenuBelgesi
  sonuc: Sonuc
  belge: MenuBelgesi
  mesgul: boolean
  onayla: () => void
  vazgec: () => void
}

function OnayEkrani({ onay, fark, yayindaki, sonuc, belge, mesgul, onayla, vazgec }: OnayProps) {
  const o = m.menu.onay
  const geriAl = onay.geriAl
  return (
    <YayinOnayi
      baslik={geriAl ? o.geriAlBaslik : o.baslik}
      fark={geriAl ? menuFarki(yayindaki, geriAl.belge) : fark}
      not={geriAl ? doldur(o.geriAlNot, { tarih: surumTarihi(geriAl.surum.olusturma) }) : undefined}
      uyarilar={sonuc.tamam && !geriAl ? sonuc.uyarilar : []}
      belge={belge}
      duyuruGorunmez={duyuruGorunmeyecek((geriAl?.belge ?? belge).duyuru, new Date())}
      onayEtiketi={geriAl ? o.geriAl : o.onayla}
      mesgul={mesgul}
      onayla={onayla}
      vazgec={vazgec}
    />
  )
}

/** Sayfa kapanırken tarayıcı uyarısı; dinleyici yalnız kaydedilmemiş değişiklik varken durur. */
function useKaydedilmemisUyari(degisiklikVar: boolean) {
  useEffect(() => {
    if (!degisiklikVar) return
    const uyar = (o: BeforeUnloadEvent) => {
      o.preventDefault()
      o.returnValue = '' // eski tarayıcılar yalnız bunu tanır
    }
    window.addEventListener('beforeunload', uyar)
    return () => window.removeEventListener('beforeunload', uyar)
  }, [degisiklikVar])
}

/** Giriş kartının başı: sitenin kelime markası (süs) ve panelin adı. */
function GirisBasligi() {
  return (
    <div className={stil.girisBasligi}>
      <img src="/kelime-markasi.svg" alt="" width={150} height={64} />
      <h1 className={stil.girisAdi}>{m.menu.baslik}</h1>
    </div>
  )
}

export function MenuYonetimi({ baz }: { baz: MenuBelgesi }) {
  const { api, gir, cik } = useOturum()
  if (!api) {
    return (
      <main className={stil.girisSayfasi}>
        <Giris gir={gir} baslik={<GirisBasligi />} />
      </main>
    )
  }
  return (
    <main className={stil.sayfa}>
      <Calisma api={api} cik={cik} baz={baz} />
    </main>
  )
}
