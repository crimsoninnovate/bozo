'use client'

import { useId, useState } from 'react'
import { yonetim as m } from '@/content/yonetim'
import { metinKoy } from '@/lib/menu/duzenleme'
import { METIN_SAYFALARI, varsayilanMetinler, type MetinSayfasi } from '@/lib/menu/metinler'
import type { Cift, MenuBelgesi } from '@/lib/menu/tipler'
import { CiftAlani, type Hatalar } from './Alanlar'
import type { Duzenle } from './MenuYonetimi'
import ortak from './oturum.module.css'
import stil from './MetinFormu.module.css'

/* Sayfa metinleri sekmesi (spec 2026-11-09-panel-metinler): belgede yalnız değişen metin durur. */

const s = m.menu.metinler
const UZUN_METIN = 60

type Props = { belge: MenuBelgesi; hatalar: Hatalar; duzenle: Duzenle }

export function MetinFormu({ belge, hatalar, duzenle }: Props) {
  const baslik = useId()
  const [sayfa, setSayfa] = useState<MetinSayfasi>('ana')
  const yollar = [...varsayilanMetinler('tr').keys()].filter((y) => y.startsWith(`${sayfa}.`))
  return (
    <div role="group" aria-labelledby={baslik} className={stil.metinler}>
      <h2 id={baslik} className={stil.baslik}>{s.baslik}</h2>
      <p className={ortak.not}>{s.not}</p>
      <label className={ortak.alan}>
        {s.sayfa}
        <select value={sayfa} onChange={(o) => setSayfa(o.target.value as MetinSayfasi)}>
          {METIN_SAYFALARI.map((p) => <option key={p} value={p}>{s.sayfalar[p]}</option>)}
        </select>
      </label>
      {yollar.map((yol) => (
        <MetinAlani key={yol} yol={yol} belge={belge} hatalar={hatalar} duzenle={duzenle} />
      ))}
    </div>
  )
}

function MetinAlani({ yol, belge, hatalar, duzenle }: Props & { yol: string }) {
  const varsayilan = { tr: varsayilanMetinler('tr').get(yol) ?? '', en: varsayilanMetinler('en').get(yol) ?? '' }
  const deger = { tr: belge.metinler.tr[yol] ?? varsayilan.tr, en: belge.metinler.en[yol] ?? varsayilan.en }
  const degisti = yol in belge.metinler.tr || yol in belge.metinler.en
  // CiftAlani hatayı `<yol>.<dil>` altında arar; belgenin yolu `metinler.<dil>.<yol>`.
  const alanHatalari: Hatalar = new Map(
    (['tr', 'en'] as const).flatMap((dil) => {
      const h = hatalar.get(`metinler.${dil}.${yol}`)
      return h ? [[`${yol}.${dil}`, h] as const] : []
    }),
  )
  const koy = (c: Cift) => duzenle((b) => metinKoy(metinKoy(b, 'tr', yol, c.tr), 'en', yol, c.en))
  const etiket = yol.split('.').slice(1).join(' › ')
  return (
    <div className={degisti ? `${stil.alan} ${stil.degisti}` : stil.alan}>
      <CiftAlani etiket={etiket} deger={deger} yol={yol} hatalar={alanHatalari}
        uzun={varsayilan.tr.length > UZUN_METIN} onDegis={(c) => c && koy(c)} />
      {degisti && (
        <div className={stil.durum}>
          <span className={stil.rozet}>{s.degisti}</span>
          <button type="button" className={ortak.ikincil} onClick={() => koy(varsayilan)}>{s.sifirla}</button>
        </div>
      )}
    </div>
  )
}
