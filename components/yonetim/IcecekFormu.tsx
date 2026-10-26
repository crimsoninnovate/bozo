'use client'

import { yonetim as m } from '@/content/yonetim'
import { fiyatYaz } from '@/lib/menu/duzenleme'
import { doldur } from '@/lib/metin'
import type { IcecekKalemi } from '@/lib/menu/tipler'
import { Alan, CiftAlani, Isaret, fiyatGirdisi, type Hatalar } from './Alanlar'
import ortak from './oturum.module.css'
import stil from './IcecekFormu.module.css'

const c = m.menu.icecek

type Props = {
  icecek: IcecekKalemi
  sira: number
  hatalar: Hatalar
  /** Bu içeceğin kopyasını değiştirir. */
  duz: (fn: (icecek: IcecekKalemi) => void) => void
  onOlcuEkle: () => void
  onOlcuSil: (olcu: number) => void
  onSil: () => void
}

export function IcecekFormu({ icecek, sira, hatalar, duz, onOlcuEkle, onOlcuSil, onSil }: Props) {
  const yol = `icecekler[${sira}]`
  return (
    <fieldset className={stil.icecek}>
      <legend className={stil.baslik}>{icecek.ad.tr || icecek.id}</legend>
      <CiftAlani etiket={c.ad} deger={icecek.ad} yol={`${yol}.ad`} hatalar={hatalar}
        onDegis={(v) => v && duz((x) => { x.ad = v })} />
      {icecek.olculer.map((olcu, n) => (
        <div key={n} className={stil.olcu} role="group" aria-label={doldur(c.olcu, { n: n + 1 })}>
          <CiftAlani etiket={c.olcuAd} deger={olcu.ad} yol={`${yol}.olculer[${n}].ad`} hatalar={hatalar}
            onDegis={(v) => v && duz((x) => { const o = x.olculer[n]; if (o) o.ad = v })} />
          <Alan sayi etiket={c.olcuFiyat} deger={fiyatGirdisi(olcu.fiyat)}
            hata={hatalar.get(`${yol}.olculer[${n}].fiyat`)}
            onDegis={(v, bozuk) => duz((x) => {
              const o = x.olculer[n]
              if (o) o.fiyat = fiyatYaz(v, bozuk) ?? Number.NaN
            })} />
          <button type="button" className={ortak.ikincil} disabled={icecek.olculer.length <= 1}
            onClick={() => onOlcuSil(n)}>
            {c.olcuSil}
          </button>
        </div>
      ))}
      <Isaret etiket={m.menu.tukendi} isaretli={icecek.tukendi}
        onDegis={(v) => duz((x) => { x.tukendi = v })} />
      <div className={ortak.dugmeler}>
        <button type="button" className={ortak.ikincil} onClick={onOlcuEkle}>{c.olcuEkle}</button>
        <button type="button" className={ortak.ikincil} onClick={onSil}>{c.sil}</button>
      </div>
    </fieldset>
  )
}
