'use client'

import { yonetim as m } from '@/content/yonetim'
import { ENFAZLA_OLCU } from '@/lib/menu/dogrulama'
import { fiyatYaz } from '@/lib/menu/duzenleme'
import { kayitHatali } from '@/lib/menu/panel'
import { doldur } from '@/lib/metin'
import type { IcecekKalemi } from '@/lib/menu/tipler'
import { Alan, CiftAlani, Isaret, fiyatGirdisi, type Hatalar } from './Alanlar'
import { AcilirKart } from './Kart'
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

/** Her ölçünün fiyatı, ölçünün adıyla ("Kutu fiyatı (TL)"); kart kapalıyken de düzenlenir. */
function OlcuFiyatlari({ icecek, yol, hatalar, duz }: Pick<Props, 'icecek' | 'hatalar' | 'duz'> & { yol: string }) {
  return (
    <>
      {icecek.olculer.map((olcu, n) => (
        <Alan key={n} sayi etiket={doldur(c.olcuFiyat, { ad: olcu.ad.tr || doldur(c.olcu, { n: n + 1 }) })}
          deger={fiyatGirdisi(olcu.fiyat)} hata={hatalar.get(`${yol}.olculer[${n}].fiyat`)}
          onDegis={(v, bozuk) => duz((x) => {
            const o = x.olculer[n]
            if (o) o.fiyat = fiyatYaz(v, bozuk) ?? Number.NaN
          })} />
      ))}
    </>
  )
}

/** "Ayrıntılar": içecek ve ölçü adları, ölçü ekleme ve silme, içeceği silme. */
function Ayrintilar({ icecek, sira, hatalar, duz, onOlcuEkle, onOlcuSil, onSil }: Props) {
  const yol = `icecekler[${sira}]`
  return (
    <>
      <CiftAlani etiket={c.ad} deger={icecek.ad} yol={`${yol}.ad`} hatalar={hatalar}
        onDegis={(v) => v && duz((x) => { x.ad = v })} />
      {icecek.olculer.map((olcu, n) => (
        <div key={n} className={stil.olcu} role="group" aria-label={doldur(c.olcu, { n: n + 1 })}>
          <CiftAlani etiket={c.olcuAd} deger={olcu.ad} yol={`${yol}.olculer[${n}].ad`} hatalar={hatalar}
            onDegis={(v) => v && duz((x) => { const o = x.olculer[n]; if (o) o.ad = v })} />
          <button type="button" className={ortak.ikincil} disabled={icecek.olculer.length <= 1}
            onClick={() => onOlcuSil(n)}>
            {c.olcuSil}
          </button>
        </div>
      ))}
      <div className={ortak.dugmeler}>
        <button type="button" className={ortak.ikincil} disabled={icecek.olculer.length >= ENFAZLA_OLCU}
          onClick={onOlcuEkle}>{c.olcuEkle}</button>
        <button type="button" className={ortak.ikincil} onClick={onSil}>{c.sil}</button>
      </div>
    </>
  )
}

export function IcecekFormu(props: Props) {
  const { icecek, sira, hatalar, duz } = props
  const yol = `icecekler[${sira}]`
  const gorunen = [`${yol}.tukendi`, ...icecek.olculer.map((_, n) => `${yol}.olculer[${n}].fiyat`)]
  return (
    <AcilirKart ad={icecek.ad.tr || icecek.id} soluk={icecek.tukendi}
      hatali={kayitHatali(hatalar.keys(), yol, gorunen)}
      yan={<Isaret etiket={m.menu.tukendi} isaretli={icecek.tukendi}
        onDegis={(v) => duz((x) => { x.tukendi = v })} />}
      hizli={<OlcuFiyatlari icecek={icecek} yol={yol} hatalar={hatalar} duz={duz} />}>
      <Ayrintilar {...props} />
    </AcilirKart>
  )
}
