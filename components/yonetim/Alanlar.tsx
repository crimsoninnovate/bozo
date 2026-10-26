'use client'

import { useId, useState, type SubmitEvent } from 'react'
import { yonetim as m } from '@/content/yonetim'
import type { Sorun } from '@/lib/menu/dogrulama'
import type { Cift } from '@/lib/menu/tipler'
import ortak from './oturum.module.css'
import stil from './Alanlar.module.css'

/** Doğrulama hatalarının alan yoluna göre ilk metni. */
export type Hatalar = ReadonlyMap<string, string>

export function hatalariEsle(hatalar: readonly Sorun[]): Hatalar {
  const harita = new Map<string, string>()
  for (const h of hatalar) if (!harita.has(h.yol)) harita.set(h.yol, h.metin)
  return harita
}

type AlanProps = {
  etiket: string
  deger: string
  /** `bozuk`: sayı alanında tarayıcının sayı saymadığı metin (boş görünür). */
  onDegis: (v: string, bozuk: boolean) => void
  hata?: string
  uzun?: boolean
  sayi?: boolean
}

export function Alan({ etiket, deger, onDegis, hata, uzun, sayi }: AlanProps) {
  const hataKimlik = useId()
  const ortakOzellik = {
    value: deger,
    onChange: (o: { target: { value: string; validity: ValidityState } }) =>
      onDegis(o.target.value, o.target.validity.badInput),
    'aria-invalid': hata ? true : undefined,
    'aria-describedby': hata ? hataKimlik : undefined,
  }
  return (
    <label className={ortak.alan}>
      {etiket}
      {uzun ? (
        <textarea {...ortakOzellik} />
      ) : (
        <input {...ortakOzellik} {...(sayi ? { type: 'number', inputMode: 'numeric', min: 1, step: 1 } : {})} />
      )}
      {hata && <span id={hataKimlik} className={ortak.alanHata}>{hata}</span>}
    </label>
  )
}

type CiftProps = {
  etiket: string
  deger: Cift | null
  yol: string
  hatalar: Hatalar
  onDegis: (c: Cift | null) => void
  uzun?: boolean
  /** Boş bırakılabilen alan: iki dil de boşsa `null` yazılır. */
  bosOlur?: boolean
}

/** Türkçe ve İngilizce yan yana. */
export function CiftAlani({ etiket, deger, yol, hatalar, onDegis, uzun, bosOlur }: CiftProps) {
  const degistir = (dil: 'tr' | 'en', v: string) => {
    const sonraki = { tr: deger?.tr ?? '', en: deger?.en ?? '', [dil]: v }
    onDegis(bosOlur && sonraki.tr === '' && sonraki.en === '' ? null : sonraki)
  }
  return (
    <div className={stil.cift}>
      {(['tr', 'en'] as const).map((dil) => (
        <Alan
          key={dil}
          etiket={`${etiket} (${m.menu[dil]})`}
          deger={deger?.[dil] ?? ''}
          onDegis={(v) => degistir(dil, v)}
          hata={hatalar.get(`${yol}.${dil}`) ?? hatalar.get(yol)}
          uzun={uzun}
        />
      ))}
    </div>
  )
}

/** Fiyat alanı: tanımsız ve `NaN` boş görünür; 0 "0" kalır, doğrulama hatası yerinde durur. */
export const fiyatGirdisi = (f: number | undefined): string =>
  f === undefined || Number.isNaN(f) ? '' : String(f)

type YeniProps = { etiket: string; dugme: string; onEkle: (ad: string) => void }

export function YeniKayit({ etiket, dugme, onEkle }: YeniProps) {
  const [ad, setAd] = useState('')
  const gonder = (olay: SubmitEvent<HTMLFormElement>) => {
    olay.preventDefault()
    if (ad.trim() === '') return
    onEkle(ad.trim())
    setAd('')
  }
  return (
    <form className={stil.yeni} onSubmit={gonder}>
      <Alan etiket={etiket} deger={ad} onDegis={setAd} />
      <button type="submit" className={ortak.ikincil}>{dugme}</button>
    </form>
  )
}
