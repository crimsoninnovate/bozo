'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { yonetim as m } from '@/content/yonetim'
import { menuBelgesiDogrula, type Sonuc } from '@/lib/menu/dogrulama'
import {
  icecekEkle, icecekSil, kalemEkle, kalemSil, kalemTasi, olcuEkle, olcuSil,
} from '@/lib/menu/duzenleme'
import { menuFarki, type Degisiklik } from '@/lib/menu/fark'
import type { MenuYayinYaniti, SurumOzeti, YonetimMenuYaniti } from '@/lib/menu/aktarim'
import type { IcecekKalemi, MenuBelgesi, MenuKalemi, OzelKalem } from '@/lib/menu/tipler'
import { doldur } from '@/lib/metin'
import type { YonetimApi } from '@/lib/oyun/api'
import { YeniKayit, hatalariEsle, type Hatalar } from './Alanlar'
import { Gecmis, surumTarihi } from './Gecmis'
import { IcecekFormu } from './IcecekFormu'
import { KalemFormu, OzelFormu } from './KalemFormu'
import { Giris, hataIsle, useOturum } from './oturum'
import { YayinOnayi } from './YayinOnayi'
import ortak from './oturum.module.css'
import stil from './MenuYonetimi.module.css'

/* Menü paneli (spec 2026-10-26): çalışma kopyası düzenlenir, hata anında görünür, yayın farkla onaylanır.
   Sürüm kimliği (`taban`) yayında sunucuya gider; başkası araya girdiyse 409 döner. */

const SEKMELER = ['ocakbasi', 'ozel', 'icecekler', 'gecmis'] as const
type Sekme = (typeof SEKMELER)[number]
/** `geriAl`: dönülecek sürüm ve içeriği (farkı göstermek için önceden okunur). */
type Onay = { geriAl: { surum: SurumOzeti; belge: MenuBelgesi } | null }
export type Duzenle = (fn: (kopya: MenuBelgesi) => MenuBelgesi | void) => void

function Sekmeler({ sekme, sec }: { sekme: Sekme; sec: (s: Sekme) => void }) {
  return (
    <div className={stil.sekmeler} role="group" aria-label={m.menu.sekmeler}>
      {SEKMELER.map((s) => (
        <button key={s} type="button" className={stil.sekme} aria-pressed={sekme === s}
          onClick={() => sec(s)}>
          {m.menu.sekme[s]}
        </button>
      ))}
    </div>
  )
}

type ListeProps = { belge: MenuBelgesi; hatalar: Hatalar; duzenle: Duzenle }

function Ocakbasi({ belge, hatalar, duzenle }: ListeProps) {
  const duz = (id: string) => (fn: (k: MenuKalemi) => void) =>
    duzenle((b) => { const k = b.kalemler.find((x) => x.id === id); if (k) fn(k) })
  return (
    <div className={stil.liste}>
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
  const [belge, setBelge] = useState<MenuBelgesi>(baz)
  const [mesgul, setMesgul] = useState(false)
  const [mesaj, setMesaj] = useState<Mesaj | null>(null)

  const yukle = useCallback(async () => {
    const yanit = await api.menu()
    setCanli(yanit)
    return yanit
  }, [api])
  useEffect(() => {
    yukle().then(
      (y) => setBelge(y.gecerli?.belge ?? baz),
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
  /** Geri almadan önce eski sürümün belgesi okunur; olmazsa hata yazılır ve `null` döner. */
  const surumGetir = async (id: number): Promise<MenuBelgesi | null> => {
    setMesgul(true)
    try {
      return (await api.menuSurumu(id)).belge
    } catch (h) {
      setMesaj({ metin: hataIsle(h, cik), hata: true })
      return null
    } finally {
      setMesgul(false)
    }
  }
  return { canli, belge, mesgul, mesaj, duzenle, bitir, surumGetir }
}

function Calisma(props: PanelProps) {
  const { api, baz } = props
  const { canli, belge, mesgul, mesaj, duzenle, bitir, surumGetir } = useCalisma(props)
  const [sekme, setSekme] = useState<Sekme>('ocakbasi')
  const [onay, setOnay] = useState<Onay | null>(null)

  const sonuc = useMemo(() => menuBelgesiDogrula(belge), [belge])
  const hatalar = useMemo(() => hatalariEsle(sonuc.tamam ? [] : sonuc.hatalar), [sonuc])
  const yayindaki = canli?.gecerli?.belge ?? baz
  const fark = useMemo(() => (sonuc.tamam ? menuFarki(yayindaki, sonuc.belge) : []), [sonuc, yayindaki])
  const taban = canli?.gecerli?.surum ?? null

  const onayla = async () => {
    const geriAl = onay?.geriAl
    if (geriAl) await bitir(() => api.menuGeriAl(geriAl.surum.id, taban), geriAl.belge)
    else if (sonuc.tamam) await bitir(() => api.menuYayinla(taban, sonuc.belge), sonuc.belge)
    setOnay(null)
  }
  const surumeDon = async (surum: SurumOzeti) => {
    const eski = await surumGetir(surum.id)
    if (eski) setOnay({ geriAl: { surum, belge: eski } })
  }

  if (!canli) {
    if (!mesaj) return <p className={ortak.not}>{m.menu.yukleniyor}</p>
    return <p className={ortak.hata} role="alert">{mesaj.metin}</p>
  }
  return (
    <>
      <Sekmeler sekme={sekme} sec={(s) => { setSekme(s); setOnay(null) }} />
      {mesaj && (
        <p className={mesaj.hata ? ortak.hata : stil.tamam} role={mesaj.hata ? 'alert' : 'status'}>{mesaj.metin}</p>
      )}
      {onay ? (
        <OnayEkrani onay={onay} fark={fark} yayindaki={yayindaki} sonuc={sonuc} belge={belge} mesgul={mesgul}
          onayla={onayla} vazgec={() => setOnay(null)} />
      ) : (
        <>
          {sekme === 'ocakbasi' && <Ocakbasi belge={belge} hatalar={hatalar} duzenle={duzenle} />}
          {sekme === 'ozel' && (
            <OzelFormu ozel={belge.ozel} hatalar={hatalar}
              duz={(fn: (o: OzelKalem) => void) => duzenle((b) => fn(b.ozel))} />
          )}
          {sekme === 'icecekler' && <Icecekler belge={belge} hatalar={hatalar} duzenle={duzenle} />}
          {sekme === 'gecmis' ? (
            <Gecmis surumler={canli.surumler} yayindaki={taban} mesgul={mesgul} onDon={surumeDon} />
          ) : (
            <YayinBari hataSayisi={sonuc.tamam ? 0 : sonuc.hatalar.length} degisiklik={fark.length}
              onYayinla={() => setOnay({ geriAl: null })} />
          )}
        </>
      )}
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
      onayEtiketi={geriAl ? o.geriAl : o.onayla}
      mesgul={mesgul}
      onayla={onayla}
      vazgec={vazgec}
    />
  )
}

type BarProps = { hataSayisi: number; degisiklik: number; onYayinla: () => void }

function YayinBari({ hataSayisi, degisiklik, onYayinla }: BarProps) {
  const neden = hataSayisi > 0
    ? doldur(m.menu.hatali, { sayi: hataSayisi })
    : degisiklik === 0 ? m.menu.degisiklikYok : null
  return (
    <div className={stil.bar}>
      <button type="button" className={ortak.ana} disabled={neden !== null} onClick={onYayinla}>
        {m.menu.yayinla}
      </button>
      {neden && <p className={ortak.not}>{neden}</p>}
    </div>
  )
}

export function MenuYonetimi({ baz }: { baz: MenuBelgesi }) {
  const { api, gir, cik } = useOturum()
  return (
    <main className={stil.sayfa}>
      <h1 className={stil.baslik}>{m.menu.baslik}</h1>
      {api ? (
        <>
          <div className={stil.ust}>
            <a className={ortak.ikincil} href="/oyun/yonetim/">{m.menu.oyuna}</a>
            <button type="button" className={ortak.ikincil} onClick={cik}>{m.cikis}</button>
          </div>
          <Calisma api={api} cik={cik} baz={baz} />
        </>
      ) : (
        <Giris gir={gir} />
      )}
    </main>
  )
}
