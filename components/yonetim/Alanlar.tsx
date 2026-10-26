'use client'

import { useId, useState, type SubmitEvent } from 'react'
import { fotograflar } from '@/content/fotograflar'
import { yonetim as m } from '@/content/yonetim'
import type { FotoId } from '@/content/types'
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
  /** Verilirse alanın altında `n/enFazla` sayacı çıkar ve alana bağlanır. */
  enFazla?: number
}

export function Alan({ etiket, deger, onDegis, hata, uzun, sayi, enFazla }: AlanProps) {
  const hataKimlik = useId()
  const sayacKimlik = useId()
  const bagli = [enFazla !== undefined && sayacKimlik, hata && hataKimlik].filter(Boolean).join(' ')
  const ortakOzellik = {
    value: deger,
    onChange: (o: { target: { value: string; validity: ValidityState } }) =>
      onDegis(o.target.value, o.target.validity.badInput),
    // Baştaki ve sondaki boşluk yazarken değil alandan çıkınca kırpılır, kelime arası boşluk bozulmaz.
    onBlur: () => { if (!sayi && deger !== deger.trim()) onDegis(deger.trim(), false) },
    'aria-invalid': hata ? true : undefined,
    'aria-describedby': bagli || undefined,
  }
  return (
    <label className={ortak.alan}>
      {etiket}
      {uzun ? (
        <textarea {...ortakOzellik} />
      ) : (
        <input {...ortakOzellik} {...(sayi ? { type: 'number', inputMode: 'numeric', min: 1, step: 1 } : {})} />
      )}
      {enFazla !== undefined && <span id={sayacKimlik} className={ortak.not}>{deger.length}/{enFazla}</span>}
      {hata && <span id={hataKimlik} className={ortak.alanHata}>{hata}</span>}
    </label>
  )
}

/** Liste düzeyindeki doğrulama hatası (örn. kayıt sınırı); alan hatasıyla aynı biçim, listenin altında durur. */
export function ListeHatasi({ metin }: { metin: string | undefined }) {
  return metin ? <p className={ortak.alanHata}>{metin}</p> : null
}

type IsaretProps = { etiket: string; isaretli: boolean; onDegis: (v: boolean) => void }

/** Etiketli onay kutusu; tüm satır 44px yüksekliğinde dokunma alanıdır. */
export function Isaret({ etiket, isaretli, onDegis }: IsaretProps) {
  return (
    <label className={ortak.isaret}>
      <input type="checkbox" checked={isaretli} onChange={(o) => onDegis(o.target.checked)} />
      {etiket}
    </label>
  )
}

const FOTO_IDLERI = Object.keys(fotograflar) as FotoId[]

type FotoProps = { etiket: string; yok: string; deger: FotoId | null; onDegis: (v: FotoId | null) => void }

/** Sitenin kullandığı fotoğraf kimliklerinden seçim; boş seçim fotoğrafsız demektir. */
export function FotoSecimi({ etiket, yok, deger, onDegis }: FotoProps) {
  return (
    <label className={ortak.alan}>
      {etiket}
      <select value={deger ?? ''} onChange={(o) => onDegis(o.target.value === '' ? null : (o.target.value as FotoId))}>
        <option value="">{yok}</option>
        {FOTO_IDLERI.map((id) => <option key={id} value={id}>{fotograflar[id].etiket}</option>)}
      </select>
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
  enFazla?: number
}

/** Türkçe ve İngilizce yan yana. */
export function CiftAlani({ etiket, deger, yol, hatalar, onDegis, uzun, bosOlur, enFazla }: CiftProps) {
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
          enFazla={enFazla}
        />
      ))}
    </div>
  )
}

/** Fiyat alanı: tanımsız, `null` (taslakta `NaN` böyle döner) ve `NaN` boş görünür; 0 "0" kalır. */
export const fiyatGirdisi = (f: number | null | undefined): string =>
  f === undefined || f === null || Number.isNaN(f) ? '' : String(f)

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
