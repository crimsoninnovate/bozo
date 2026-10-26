'use client'

import { useId } from 'react'
import { yonetim as m } from '@/content/yonetim'
import bant from '@/components/layout/DuyuruBandi.module.css'
import { DUYURU_EN_FAZLA } from '@/lib/menu/dogrulama'
import { duyuruGoster } from '@/lib/menu/duyuru'
import { bitisGirdisindenDegere, degerdenBitisGirdisine } from '@/lib/menu/panel'
import type { Duyuru } from '@/lib/menu/tipler'
import { CiftAlani, Isaret, type Hatalar } from './Alanlar'
import ortak from './oturum.module.css'
import stil from './DuyuruFormu.module.css'

const d = m.menu.duyuru

type Props = {
  duyuru: Duyuru
  hatalar: Hatalar
  /** Duyurunun kopyasını değiştirir. */
  duz: (fn: (duyuru: Duyuru) => void) => void
}

function Bitis({ duyuru, hatalar, duz }: Props) {
  const kimlik = useId()
  const hata = hatalar.get('duyuru.bitis')
  return (
    <div className={stil.bitis}>
      <label className={ortak.alan}>
        {d.bitis}
        <input type="datetime-local" value={degerdenBitisGirdisine(duyuru.bitis)}
          aria-invalid={hata ? true : undefined} aria-describedby={`${kimlik}-not${hata ? ` ${kimlik}-hata` : ''}`}
          onChange={(o) => duz((x) => { x.bitis = bitisGirdisindenDegere(o.target.value) })} />
        <span id={`${kimlik}-not`} className={ortak.not}>{d.bitisNot}</span>
        {hata && <span id={`${kimlik}-hata`} className={ortak.alanHata}>{hata}</span>}
      </label>
      <button type="button" className={ortak.ikincil} disabled={duyuru.bitis === null}
        onClick={() => duz((x) => { x.bitis = null })}>
        {d.bitisKaldir}
      </button>
    </div>
  )
}

/** Sitedeki bandın aynı görünümü (`DuyuruBandi` sınıfları); canlı belge isteği atmaz. */
function Onizleme({ duyuru }: { duyuru: Duyuru }) {
  const gorunur = duyuruGoster(duyuru, new Date())
  const durum = !duyuru.aktif ? d.kapali : gorunur ? null : d.gorunmez
  return (
    <section className={stil.onizleme} aria-label={d.onizleme}>
      <h3 className={stil.altBaslik}>{d.onizleme}</h3>
      {durum && <p className={ortak.not}>{durum}</p>}
      {(['tr', 'en'] as const).map((dil) => (
        <div key={dil} className={stil.dilSatiri} data-pasif={!gorunur}>
          <span className={ortak.not}>{dil === 'tr' ? d.onizlemeTr : d.onizlemeEn}</span>
          <div className={bant.bant}>
            <p className={bant.metin} lang={dil}>{duyuru.metin[dil]}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

export function DuyuruFormu({ duyuru, hatalar, duz }: Props) {
  return (
    <fieldset className={stil.duyuru}>
      <legend className={stil.baslik}>{d.baslik}</legend>
      <p className={ortak.not}>{d.not}</p>
      <Isaret etiket={d.aktif} isaretli={duyuru.aktif} onDegis={(v) => duz((x) => { x.aktif = v })} />
      <CiftAlani uzun etiket={d.metin} deger={duyuru.metin} yol="duyuru.metin" hatalar={hatalar}
        enFazla={DUYURU_EN_FAZLA}
        onDegis={(c) => c && duz((x) => { x.metin = c })} />
      <Bitis duyuru={duyuru} hatalar={hatalar} duz={duz} />
      <Onizleme duyuru={duyuru} />
    </fieldset>
  )
}
