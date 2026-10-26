'use client'

import { yonetim as m } from '@/content/yonetim'
import type { Iletisim } from '@/lib/menu/tipler'
import { Alan, Isaret, type Hatalar } from './Alanlar'
import ortak from './oturum.module.css'
import stil from './IletisimFormu.module.css'

const i = m.menu.iletisim

type Metinli = Exclude<keyof Iletisim, 'telefonAcik'>
const KULLANICILAR = ['instagram', 'facebook', 'tiktok'] as const

type Props = {
  iletisim: Iletisim
  hatalar: Hatalar
  /** İletişimin kopyasını değiştirir. */
  duz: (fn: (iletisim: Iletisim) => void) => void
}

export function IletisimFormu({ iletisim, hatalar, duz }: Props) {
  const alan = (ad: Metinli, etiket: string) => (
    <Alan etiket={etiket} deger={iletisim[ad]} hata={hatalar.get(`iletisim.${ad}`)}
      onDegis={(v) => duz((x) => { x[ad] = v })} />
  )
  return (
    <fieldset className={stil.iletisim}>
      <legend className={stil.baslik}>{i.baslik}</legend>
      <p className={ortak.not}>{i.not}</p>
      <Isaret etiket={i.telefonAcik} isaretli={iletisim.telefonAcik}
        onDegis={(v) => duz((x) => { x.telefonAcik = v })} />
      {iletisim.telefonAcik && <p className={ortak.not}>{i.telefonAcikNot}</p>}
      {alan('telefon', i.telefon)}
      {alan('eposta', i.eposta)}
      <p className={ortak.not}>{i.kullaniciNot}</p>
      {KULLANICILAR.map((k) => <div key={k}>{alan(k, i[k])}</div>)}
      {alan('googleYorumKodu', i.googleYorumKodu)}
    </fieldset>
  )
}
