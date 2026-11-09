'use client'

import { useCallback, useEffect, useId, useState, type SubmitEvent } from 'react'
import { yonetim as m } from '@/content/yonetim'
import { doldur } from '@/lib/metin'
import type { YonetimApi } from '@/lib/oyun/api'
import { islemMetni } from '@/lib/yonetim/islemMetni'
import {
  adSorunu, SIFRE_EN_AZ, SIFRE_EN_COK, sifreSorunu, type IslemSatiri, type PersonelSatiri,
  type YonetimPersonelYaniti,
} from '@/lib/yonetim/personel'
import { surumTarihi } from './Gecmis'
import { hataIsle } from './oturum'
import ortak from './oturum.module.css'
import stil from './Kullanicilar.module.css'

/* Kullanıcılar sekmesi, yalnız admin (spec 2026-11-09): hesap aç, kapat ya da aç, geçici şifre ver. */

const k = m.kullanicilar
type Mesaj = { metin: string; hata: boolean }
/** Hesap işlemi: başarıda liste tazelenir; dönen ileti işlemin yapıldığı yerde gösterilir. */
type Calistir = (is: () => Promise<PersonelSatiri>, tamam: string) => Promise<Mesaj>

function Ileti({ mesaj }: { mesaj: Mesaj | null }) {
  if (!mesaj) return null
  return <p className={mesaj.hata ? ortak.hata : stil.tamam} role={mesaj.hata ? 'alert' : 'status'}>{mesaj.metin}</p>
}

function Islemler({ islemler }: { islemler: IslemSatiri[] }) {
  if (islemler.length === 0) return <p className={ortak.not}>{k.islemYok}</p>
  return (
    <ul className={stil.islemler}>
      {islemler.map((i) => (
        <li key={`${i.zaman}-${i.tur}-${i.ayrinti}`}>
          {islemMetni(i)} <time dateTime={i.zaman}>{surumTarihi(i.zaman)}</time>
        </li>
      ))}
    </ul>
  )
}

/** Adminin adı istemcide bilinmez: `adAdminin`'i sunucu söyler. */
function HesapAc({ calistir, mesgul, api }: { calistir: Calistir; mesgul: boolean; api: YonetimApi }) {
  const [mesaj, setMesaj] = useState<Mesaj | null>(null)
  const gonder = async (olay: SubmitEvent<HTMLFormElement>) => {
    olay.preventDefault()
    const form = olay.currentTarget
    const veri = new FormData(form)
    const ad = String(veri.get('ad') ?? '').trim()
    const sifre = String(veri.get('sifre') ?? '')
    const sorun = adSorunu(ad, '') ?? sifreSorunu(sifre)
    if (sorun) return setMesaj({ metin: m.hata[sorun], hata: true })
    const sonuc = await calistir(() => api.personelEkle(ad, sifre), doldur(k.ac.tamam, { ad }))
    setMesaj(sonuc)
    if (!sonuc.hata) form.reset()
  }
  return (
    <form className={ortak.form} onSubmit={gonder} aria-labelledby="hesap-ac">
      <h3 id="hesap-ac" className={stil.altBaslik}>{k.ac.baslik}</h3>
      <label className={ortak.alan}>
        {k.ac.ad}
        <input name="ad" autoComplete="off" autoCapitalize="none" spellCheck={false} required maxLength={30} />
      </label>
      <label className={ortak.alan}>
        {k.ac.sifre}
        <input name="sifre" autoComplete="off" required minLength={SIFRE_EN_AZ} maxLength={SIFRE_EN_COK} />
      </label>
      <button type="submit" className={ortak.ana} disabled={mesgul}>{k.ac.dugme}</button>
      <Ileti mesaj={mesaj} />
    </form>
  )
}

type SatirProps = { p: PersonelSatiri; calistir: Calistir; mesgul: boolean; api: YonetimApi }

/** Kapatma, panelin "Değişiklikleri At" deseniyle sorulur: odak önce Vazgeç'te. */
function HesapSatiri({ p, calistir, mesgul, api }: SatirProps) {
  const [hal, setHal] = useState<'soru' | 'sifirla' | null>(null)
  const [mesaj, setMesaj] = useState<Mesaj | null>(null)
  const soru = useId()
  const durum = p.kapali ? k.durum.kapali : p.sifreDegismeli ? k.durum.bekliyor : k.durum.acik
  const yap = async (is: () => Promise<PersonelSatiri>, tamam: string) => {
    const sonuc = await calistir(is, doldur(tamam, { ad: p.ad }))
    setMesaj(sonuc)
    if (!sonuc.hata) setHal(null)
  }
  const sifirla = async (olay: SubmitEvent<HTMLFormElement>) => {
    olay.preventDefault()
    const sifre = String(new FormData(olay.currentTarget).get('sifre') ?? '')
    const sorun = sifreSorunu(sifre)
    if (sorun) return setMesaj({ metin: m.hata[sorun], hata: true })
    await yap(() => api.personelSifre(p.id, sifre), k.sifirlandi)
  }
  return (
    <li className={stil.satir}>
      <div className={stil.ust}>
        <strong className={stil.ad}>{p.ad}</strong>
        <em className={p.kapali ? stil.kapali : stil.durum}>{durum}</em>
      </div>
      <p className={ortak.not}>
        {p.sonGiris ? doldur(k.sonGiris, { tarih: surumTarihi(p.sonGiris) }) : k.hicGirmedi}
      </p>
      <Islemler islemler={p.sonIslemler} />
      {hal === 'soru' ? (
        <div className={stil.soru} role="alertdialog" aria-label={k.kapat} aria-describedby={soru}>
          <p id={soru} className={stil.soruMetni}>{doldur(k.kapatSoru, { ad: p.ad })}</p>
          <div className={ortak.dugmeler}>
            <button type="button" className={ortak.ikincil} autoFocus onClick={() => setHal(null)}>{k.vazgec}</button>
            <button type="button" className={ortak.ana} disabled={mesgul}
              onClick={() => yap(() => api.personelKapat(p.id, true), k.kapandi)}>
              {k.kapatEvet}
            </button>
          </div>
        </div>
      ) : hal === 'sifirla' ? (
        <form className={stil.sifirla} onSubmit={sifirla}>
          <label className={ortak.alan}>
            {k.sifirlaAlan}
            <input name="sifre" autoComplete="off" required minLength={SIFRE_EN_AZ} maxLength={SIFRE_EN_COK} />
          </label>
          <div className={ortak.dugmeler}>
            <button type="submit" className={ortak.ana} disabled={mesgul}>{k.sifirlaDugme}</button>
            <button type="button" className={ortak.ikincil} onClick={() => setHal(null)}>{k.vazgec}</button>
          </div>
        </form>
      ) : (
        <div className={ortak.dugmeler}>
          {p.kapali ? (
            <button type="button" className={ortak.ikincil} disabled={mesgul}
              onClick={() => yap(() => api.personelKapat(p.id, false), k.acildi)}>
              {k.yenidenAc}
            </button>
          ) : (
            <button type="button" className={ortak.ikincil} disabled={mesgul} onClick={() => setHal('soru')}>
              {k.kapat}
            </button>
          )}
          <button type="button" className={ortak.ikincil} disabled={mesgul} onClick={() => setHal('sifirla')}>
            {k.sifirla}
          </button>
        </div>
      )}
      <Ileti mesaj={mesaj} />
    </li>
  )
}

export function Kullanicilar({ api, cik }: { api: YonetimApi; cik: () => void }) {
  const [veri, setVeri] = useState<YonetimPersonelYaniti | null>(null)
  const [hata, setHata] = useState<string | null>(null)
  const [mesgul, setMesgul] = useState(false)
  const yukle = useCallback(async () => setVeri(await api.personel()), [api])
  useEffect(() => {
    yukle().catch((h: unknown) => setHata(hataIsle(h, cik)))
  }, [yukle, cik])
  const calistir: Calistir = async (is, tamam) => {
    setMesgul(true)
    try {
      await is()
      await yukle().catch((h: unknown) => console.warn('hesap listesi tazelenemedi', hataIsle(h, cik)))
      return { metin: tamam, hata: false }
    } catch (h) {
      return { metin: hataIsle(h, cik), hata: true }
    } finally {
      setMesgul(false)
    }
  }
  return (
    <section aria-labelledby="kullanicilar-baslik" className={stil.bolum}>
      <h2 id="kullanicilar-baslik" className={stil.baslik}>{k.baslik}</h2>
      <p className={ortak.not}>{k.not}</p>
      <HesapAc calistir={calistir} mesgul={mesgul} api={api} />
      {hata && <p className={ortak.hata} role="alert">{hata}</p>}
      {!veri && !hata && <p className={ortak.not}>{k.yukleniyor}</p>}
      {veri && (
        <>
          {veri.personel.length === 0 && <p className={ortak.not}>{k.bos}</p>}
          <ul className={stil.liste}>
            {veri.personel.map((p) => <HesapSatiri key={p.id} p={p} calistir={calistir} mesgul={mesgul} api={api} />)}
          </ul>
          <section aria-labelledby="admin-islemleri" className={stil.admin}>
            <h3 id="admin-islemleri" className={stil.altBaslik}>{k.admin}</h3>
            <Islemler islemler={veri.adminIslemleri} />
          </section>
        </>
      )}
    </section>
  )
}
