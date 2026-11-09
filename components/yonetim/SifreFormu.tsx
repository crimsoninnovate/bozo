'use client'

import { useState, type SubmitEvent } from 'react'
import { yonetim as m } from '@/content/yonetim'
import { SIFRE_EN_AZ, SIFRE_EN_COK, sifreSorunu } from '@/lib/yonetim/personel'
import { apiAl, hataIsle } from './oturum'
import ortak from './oturum.module.css'
import stil from './SifreFormu.module.css'

type Props = {
  /** Geçici şifreyle girildi: vazgeçilemez, panelin geri kalanı açılmaz. */
  zorunlu: boolean
  yetki: string
  yeniOturum: (yetki: string, bitis: string) => void
  /** 401: oturum düşmüş, girişe dönülür. Yanlış eski şifre 403 gelir ve formda kalır. */
  cik: () => void
  vazgec?: () => void
}

/** İstemci denetimi sunucununkiyle aynı (`sifreSorunu`); sunucu yine de son sözü söyler. */
function sorunBul(eski: string, yeni: string, tekrar: string): string | null {
  if (yeni !== tekrar) return m.sifre.eslesmiyor
  const sorun = sifreSorunu(yeni)
  if (sorun) return m.hata[sorun]
  return yeni === eski ? m.hata.sifreAyni : null
}

export function SifreFormu({ zorunlu, yetki, yeniOturum, cik, vazgec }: Props) {
  const [hata, setHata] = useState<string | null>(null)
  const [mesgul, setMesgul] = useState(false)
  const gonder = async (olay: SubmitEvent<HTMLFormElement>) => {
    olay.preventDefault()
    const veri = new FormData(olay.currentTarget)
    const al = (ad: string) => String(veri.get(ad) ?? '')
    const [eski, yeni] = [al('eski'), al('yeni')]
    const sorun = sorunBul(eski, yeni, al('tekrar'))
    setHata(sorun)
    if (sorun) return
    setMesgul(true)
    try {
      const { anahtar, bitis } = await apiAl(yetki).sifreDegistir(eski, yeni)
      yeniOturum(`Bearer ${anahtar}`, bitis)
    } catch (h) {
      setHata(hataIsle(h, cik))
      setMesgul(false)
    }
  }
  return (
    <form className={`${ortak.form} ${stil.form}`} onSubmit={gonder} aria-labelledby="sifre-baslik">
      <h2 id="sifre-baslik" className={stil.baslik}>{m.sifre.baslik}</h2>
      {zorunlu && <p className={ortak.not}>{m.sifre.zorunluNot}</p>}
      <label className={ortak.alan}>
        {m.sifre.eski}
        <input name="eski" type="password" autoComplete="current-password" required />
      </label>
      <label className={ortak.alan}>
        {m.sifre.yeni}
        <input name="yeni" type="password" autoComplete="new-password" required
          minLength={SIFRE_EN_AZ} maxLength={SIFRE_EN_COK} />
      </label>
      <label className={ortak.alan}>
        {m.sifre.yeniTekrar}
        <input name="tekrar" type="password" autoComplete="new-password" required />
      </label>
      <div className={ortak.dugmeler}>
        <button type="submit" className={ortak.ana} disabled={mesgul}>{m.sifre.dugme}</button>
        {!zorunlu && vazgec && (
          <button type="button" className={ortak.ikincil} onClick={vazgec} disabled={mesgul}>
            {m.sifre.vazgec}
          </button>
        )}
      </div>
      {hata && <p className={ortak.hata} role="alert">{hata}</p>}
    </form>
  )
}
