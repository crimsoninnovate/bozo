'use client'

import { useCallback, useEffect, useMemo, useState, type ReactNode, type SubmitEvent } from 'react'
import { yonetim as m } from '@/content/yonetim'
import { BelgeHatasi } from '@/lib/menu/panel'
import { doldur } from '@/lib/metin'
import { API_KOKU, ApiHatasi, temelYetki, yonetimApiKur, type YonetimApi } from '@/lib/oyun/api'
import type { BenYaniti } from '@/lib/yonetim/personel'
import {
  baskaOturumMu, OTURUM_ANAHTARI as ANAHTAR, oturumDepolari, oturumOku, oturumYaz, type Depo,
} from '@/lib/oyun/oturumDeposu'
import stil from './oturum.module.css'

/* Personel girişi ve oturumu: `/oyun/yonetim/` ve `/yonetim/` aynı anahtarı okur, tek girişle iki ekran. */

export const apiAl = (yetki: string) => yonetimApiKur(API_KOKU, (girdi, secenek) => fetch(girdi, secenek), yetki)

/** ApiHatasi dışındaki her hata (örn. JSON olmayan gövde) genel mesaja düşer; ayrıntı konsola yazılır. */
export function hataMetni(hata: unknown): string {
  if (hata instanceof BelgeHatasi) {
    console.error('sunucudaki menü panele açılamadı', hata)
    return m.menu.belgeOkunamadi
  }
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

type GirisProps = {
  gir: (yetki: string, bitis: string, hatirla: boolean) => void
  /** Kartın başı (menü panelinde marka ve başlık); `/oyun/yonetim/` başlığı kartın dışında basar. */
  baslik?: ReactNode
}

export function Giris({ gir, baslik }: GirisProps) {
  const [hata, setHata] = useState<string | null>(null)
  const gonder = async (olay: SubmitEvent<HTMLFormElement>) => {
    olay.preventDefault()
    const veri = new FormData(olay.currentTarget)
    const temel = temelYetki(String(veri.get('kullanici')), String(veri.get('sifre')))
    try {
      const { anahtar, bitis } = await apiAl(temel).oturumAl()
      gir(`Bearer ${anahtar}`, bitis, veri.get('hatirla') === 'on')
    } catch (h) {
      setHata(h instanceof ApiHatasi && h.durum === 401 ? m.giris.hata : hataMetni(h))
    }
  }
  return (
    <form className={stil.form} onSubmit={gonder}>
      {baslik}
      <label className={stil.alan}>
        {m.giris.kullanici}
        <input name="kullanici" autoComplete="username" required />
      </label>
      <label className={stil.alan}>
        {m.giris.sifre}
        <input name="sifre" type="password" autoComplete="current-password" required />
      </label>
      <label className={stil.isaret}>
        <input name="hatirla" type="checkbox" defaultChecked />
        {m.giris.hatirla}
      </label>
      <button type="submit" className={stil.ana}>{m.giris.dugme}</button>
      {hata && <p className={stil.hata} role="alert">{hata}</p>}
    </form>
  )
}

/** Depo hataları (gizli sekme, dolu kota) girişi bozmaz; yalnız konsola düşer, anahtar yazılmaz. */
function depoIsle<T>(depo: Depo, ne: string, is: (s: Storage) => T, yedek: T): T {
  try {
    return is(window[depo])
  } catch (hata) {
    console.warn(`oturum deposu ${ne}`, depo, hata)
    return yedek
  }
}

/** Önce kalıcı, sonra sekme deposu; geçersiz kaydı siler. Çıplak `Basic` yalnız sekme deposundan. */
function oturumBul(): string | null {
  const simdi = Date.now()
  for (const depo of ['localStorage', 'sessionStorage'] as const) {
    const ham = depoIsle(depo, 'okunamadı', (s) => s.getItem(ANAHTAR), null)
    const yetki = oturumOku(ham, simdi, depo === 'sessionStorage')
    if (yetki) return yetki
    if (ham !== null) depoIsle(depo, 'silinemedi', (s) => s.removeItem(ANAHTAR), undefined)
  }
  return null
}

/** "Çıkış" düğmesi: iki depodan da koşulsuz siler, başka sekmenin yeni anahtarı da paylaşılan cihazda kalmaz. */
export function oturumuSil(): void {
  for (const depo of ['localStorage', 'sessionStorage'] as const) {
    depoIsle(depo, 'silinemedi', (s) => s.removeItem(ANAHTAR), undefined)
  }
}

/** `api`: `undefined` depo okunana kadar (statik HTML'de giriş kartı çakmasın), `null` oturum yok. */
export function useOturum(): {
  api: YonetimApi | null | undefined
  yetki: string | null | undefined
  gir: (yetki: string, bitis: string, hatirla: boolean) => void
  /** Şifre değişince gelen yeni anahtar: eskisi hangi depodaysa oraya ("Beni hatırla" korunur). */
  yenile: (yetki: string, bitis: string) => void
  cik: () => void
} {
  const [yetki, setYetki] = useState<string | null | undefined>(undefined)
  useEffect(() => setYetki(oturumBul()), [])
  const api = useMemo(() => (yetki === undefined ? undefined : yetki ? apiAl(yetki) : null), [yetki])
  const gir = useCallback((y: string, bitis: string, hatirla: boolean) => {
    const yaz = (d: Depo) =>
      depoIsle(d, 'yazılamadı', (s) => (s.setItem(ANAHTAR, oturumYaz(y, bitis)), true), false)
    const { tut, sil } = oturumDepolari(hatirla, hatirla && yaz('localStorage'))
    if (tut === 'sessionStorage') yaz(tut)
    depoIsle(sil, 'silinemedi', (s) => s.removeItem(ANAHTAR), undefined)
    setYetki(y)
  }, [])
  /** 401 yolu: yalnız bu sekmenin anahtarını siler, başka sekmenin şifre değişimiyle yazdığı kayıt kalır. */
  const cik = useCallback(() => {
    for (const depo of ['localStorage', 'sessionStorage'] as const) {
      depoIsle(depo, 'silinemedi', (s) => {
        if (!yetki || !baskaOturumMu(s.getItem(ANAHTAR), yetki)) s.removeItem(ANAHTAR)
      }, undefined)
    }
    setYetki(null)
  }, [yetki])
  const yenile = useCallback((y: string, bitis: string) => {
    gir(y, bitis, depoIsle('localStorage', 'okunamadı', (s) => s.getItem(ANAHTAR) !== null, false))
  }, [gir])
  return { api, yetki, gir, yenile, cik }
}

/** Giriş yapan hesap; anahtar değişince (şifre değişimi) yeniden okunur, eski değer o arada kalır. */
export function useBen(api: YonetimApi, cik: () => void): { ben: BenYaniti | null; hata: string | null } {
  const [ben, setBen] = useState<BenYaniti | null>(null)
  const [hata, setHata] = useState<string | null>(null)
  useEffect(() => {
    api.ben().then(
      (b) => {
        setBen(b)
        setHata(null)
      },
      (h: unknown) => setHata(hataIsle(h, cik)),
    )
  }, [api, cik])
  return { ben, hata }
}
