'use client'

import { useId } from 'react'
import { yonetim as m } from '@/content/yonetim'
import type { Iletisim } from '@/lib/menu/tipler'
import { Alan, Isaret, type Hatalar } from './Alanlar'
import ortak from './oturum.module.css'
import stil from './IletisimFormu.module.css'

const i = m.menu.iletisim

type Metinli = Exclude<keyof Iletisim, 'telefonAcik'>
type Tip = 'tel' | 'email' | 'kullanici'
const KULLANICILAR = ['instagram', 'facebook', 'tiktok'] as const

type Props = {
  iletisim: Iletisim
  hatalar: Hatalar
  /** İletişimin kopyasını değiştirir. */
  duz: (fn: (iletisim: Iletisim) => void) => void
}

export function IletisimFormu({ iletisim, hatalar, duz }: Props) {
  const baslik = useId()
  const alan = (ad: Metinli, etiket: string, tip: Tip) => (
    <Alan etiket={etiket} tip={tip} deger={iletisim[ad]} hata={hatalar.get(`iletisim.${ad}`)}
      onDegis={(v) => duz((x) => { x[ad] = v })} />
  )
  return (
    <div role="group" aria-labelledby={baslik} className={stil.iletisim}>
      <h2 id={baslik} className={stil.baslik}>{i.baslik}</h2>
      <p className={ortak.not}>{i.not}</p>
      <Isaret etiket={i.telefonAcik} isaretli={iletisim.telefonAcik}
        onDegis={(v) => duz((x) => { x.telefonAcik = v })} />
      {iletisim.telefonAcik && <p className={ortak.not}>{i.telefonAcikNot}</p>}
      {alan('telefon', i.telefon, 'tel')}
      {alan('eposta', i.eposta, 'email')}
      <p className={ortak.not}>{i.kullaniciNot}</p>
      {KULLANICILAR.map((k) => <div key={k}>{alan(k, i[k], 'kullanici')}</div>)}
      {/* Yorum kodu büyük-küçük harfe duyarlı: otomatik düzeltme ve büyük harf kapalı. */}
      {alan('googleYorumKodu', i.googleYorumKodu, 'kullanici')}
    </div>
  )
}
