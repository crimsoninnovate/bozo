'use client'

import { useEffect, useId, useState } from 'react'
import { yonetim as m } from '@/content/yonetim'
import type { DerlemeDurumu } from '@/lib/menu/aktarim'
import {
  derlemeGecici, derlemeGunlugu, derlemeMetni, derlemeSuruyor, etkinSiteSurumu, guncelleKapali,
} from '@/lib/menu/panel'
import { doldur } from '@/lib/metin'
import type { YonetimApi } from '@/lib/oyun/api'
import { surumTarihi } from './Gecmis'
import { hataIsle } from './oturum'
import { SITE_SURUMU, SiteDurumu } from './SiteDurumu'
import ortak from './oturum.module.css'
import stil from './SiteGuncelle.module.css'

/* "Siteyi Güncelle" (spec 2026-11-09 C): sunucu istek dosyası yazar, panel durum dosyasını 5 sn'de bir yoklar. */

const d = m.menu.derleme
const ARALIK_MS = 5000

export type Derleme = {
  durum: DerlemeDurumu | null
  /** Geçici okuma hatası (ağ, 429): son durum kalır, yoklama sürer. */
  not: string | null
  hata: string | null
  mesgul: boolean
  iste: () => void
}

/** Açılışta bir okuma; sonra yalnız `sirada`/`derleniyor` sürerken yoklar. Bileşen kalkınca durur. */
export function useDerleme(api: YonetimApi, cik: () => void): Derleme {
  const [durum, setDurum] = useState<DerlemeDurumu | null>(null)
  const [not, setNot] = useState<string | null>(null)
  const [hata, setHata] = useState<string | null>(null)
  const [mesgul, setMesgul] = useState(false)
  const [tur, setTur] = useState(0)
  useEffect(() => {
    let bitti = false
    let zaman: ReturnType<typeof setTimeout> | undefined
    const yokla = async () => {
      try {
        const { durum: yeni } = await api.derlemeDurumu()
        if (bitti) return
        setDurum(yeni)
        setNot(null)
        setHata(null)
        if (derlemeSuruyor(yeni)) zaman = setTimeout(yokla, ARALIK_MS)
      } catch (h) {
        if (bitti) return
        if (!derlemeGecici(h)) return setHata(hataIsle(h, cik))
        console.warn('derleme durumu okunamadı, yeniden denenecek', h)
        setNot(d.gecici)
        zaman = setTimeout(yokla, ARALIK_MS)
      }
    }
    zaman = setTimeout(yokla, tur === 0 ? 0 : ARALIK_MS)
    return () => { bitti = true; clearTimeout(zaman) }
  }, [api, cik, tur])
  const iste = async () => {
    setMesgul(true)
    try {
      const { durum: yeni } = await api.derlemeIste()
      setDurum(yeni)
      setNot(null)
      setHata(null)
      setTur((t) => t + 1)
    } catch (h) {
      setHata(hataIsle(h, cik))
    } finally {
      setMesgul(false)
    }
  }
  return { durum, not, hata, mesgul, iste }
}

type Props = { derleme: Derleme; yayinSurum: number | null }

/** Geçmiş sekmesinin başı: sürüm göstergesi, düğme, aşama ve hata günlüğü. */
export function SiteGuncelle({ derleme, yayinSurum }: Props) {
  const { durum, not, hata, mesgul, iste } = derleme
  const baslik = useId()
  const kapali = mesgul || guncelleKapali(yayinSurum, SITE_SURUMU, durum)
  return (
    <div role="group" aria-labelledby={baslik} className={stil.kart}>
      <h2 id={baslik} className={stil.baslik}>{d.baslik}</h2>
      <SiteDurumu yayinSurum={yayinSurum} siteSurum={etkinSiteSurumu(SITE_SURUMU, durum)} />
      <p className={ortak.not}>{d.not}</p>
      <div className={ortak.dugmeler}>
        <button type="button" className={ortak.ana} disabled={kapali} onClick={iste}>{d.dugme}</button>
      </div>
      <div role="status" className={stil.durum}>
        <p className={stil.asama}>{durum ? derlemeMetni(durum, SITE_SURUMU) : !hata && d.okunuyor}</p>
        {durum?.zaman && <p className={ortak.not}>{doldur(d.zaman, { tarih: surumTarihi(durum.zaman) })}</p>}
        {not && <p className={ortak.not}>{not}</p>}
      </div>
      {hata && <p className={ortak.hata} role="alert">{hata}</p>}
      {durum?.asama === 'hata' && durum.gunluk.length > 0 && <Gunluk satirlar={derlemeGunlugu(durum)} />}
    </div>
  )
}

function Gunluk({ satirlar }: { satirlar: string[] }) {
  const [acik, setAcik] = useState(false)
  const govde = useId()
  return (
    <>
      <div className={ortak.dugmeler}>
        <button type="button" className={ortak.ikincil} aria-expanded={acik} aria-controls={govde}
          onClick={() => setAcik(!acik)}>{m.menu.ayrintilar}</button>
      </div>
      <pre id={govde} className={stil.gunluk} hidden={!acik}>{satirlar.join('\n')}</pre>
    </>
  )
}
