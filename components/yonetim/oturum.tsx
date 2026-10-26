'use client'

import { useCallback, useEffect, useMemo, useState, type SubmitEvent } from 'react'
import { yonetim as m } from '@/content/yonetim'
import { doldur } from '@/lib/metin'
import { API_KOKU, ApiHatasi, temelYetki, yonetimApiKur, type YonetimApi } from '@/lib/oyun/api'
import stil from './oturum.module.css'

/* Personel girişi ve oturumu: `/oyun/yonetim/` ve `/yonetim/` aynı anahtarı okur, tek girişle iki ekran. */

const ANAHTAR = 'bozo-yonetim'

export const apiAl = (yetki: string) => yonetimApiKur(API_KOKU, (girdi, secenek) => fetch(girdi, secenek), yetki)

/** ApiHatasi dışındaki her hata (örn. JSON olmayan gövde) genel mesaja düşer; ayrıntı konsola yazılır. */
export function hataMetni(hata: unknown): string {
  if (!(hata instanceof ApiHatasi)) {
    console.error('yönetim isteği beklenmedik hatayla bitti', hata)
    return doldur(m.hata.genel, { kod: 'bilinmeyen' })
  }
  if (hata.durum === 0) return m.hata.ag
  if (hata.durum === 429) return m.hata.cokIstek
  return (m.hata as Record<string, string>)[hata.kod] ?? doldur(m.hata.genel, { kod: hata.kod })
}

/** 401 oturumu kapatır; diğer hatalar metne döner. */
export function hataIsle(hata: unknown, cik: () => void): string {
  if (hata instanceof ApiHatasi && hata.durum === 401) cik()
  return hataMetni(hata)
}

export function Giris({ gir }: { gir: (yetki: string) => void }) {
  const [hata, setHata] = useState<string | null>(null)
  const gonder = async (olay: SubmitEvent<HTMLFormElement>) => {
    olay.preventDefault()
    const veri = new FormData(olay.currentTarget)
    const yetki = temelYetki(String(veri.get('kullanici')), String(veri.get('sifre')))
    try {
      await apiAl(yetki).siralama()
      gir(yetki)
    } catch (h) {
      setHata(h instanceof ApiHatasi && h.durum === 401 ? m.giris.hata : hataMetni(h))
    }
  }
  return (
    <form className={stil.form} onSubmit={gonder}>
      <label className={stil.alan}>
        {m.giris.kullanici}
        <input name="kullanici" autoComplete="username" required />
      </label>
      <label className={stil.alan}>
        {m.giris.sifre}
        <input name="sifre" type="password" autoComplete="current-password" required />
      </label>
      <button type="submit" className={stil.ana}>{m.giris.dugme}</button>
      {hata && <p className={stil.hata} role="alert">{hata}</p>}
    </form>
  )
}

export function useOturum(): { api: YonetimApi | null; gir: (yetki: string) => void; cik: () => void } {
  const [yetki, setYetki] = useState<string | null>(null)
  useEffect(() => setYetki(sessionStorage.getItem(ANAHTAR)), [])
  const api = useMemo(() => (yetki ? apiAl(yetki) : null), [yetki])
  const gir = useCallback((y: string) => {
    sessionStorage.setItem(ANAHTAR, y)
    setYetki(y)
  }, [])
  const cik = useCallback(() => {
    sessionStorage.removeItem(ANAHTAR)
    setYetki(null)
  }, [])
  return { api, gir, cik }
}
