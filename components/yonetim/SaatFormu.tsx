'use client'

import { useId } from 'react'
import { yonetim as m } from '@/content/yonetim'
import { SAAT_SINIRLARI } from '@/lib/menu/dogrulama'
import { saatAyarla } from '@/lib/menu/duzenleme'
import type { MenuBelgesi, Saatler } from '@/lib/menu/tipler'
import { doldur } from '@/lib/metin'
import { saatAraligi, saatYaz } from '@/lib/saatMetni'
import type { Hatalar } from './Alanlar'
import type { Duzenle } from './MenuYonetimi'
import ortak from './oturum.module.css'
import stil from './SaatFormu.module.css'

/* Saatler sekmesi (spec 2026-11-09 B): seçenekler doğrulayıcının sınırlarıyla aynı, sıra hatası alanın altında. */

const s = m.menu.saatler

type Props = { belge: MenuBelgesi; hatalar: Hatalar; duzenle: Duzenle }

export function SaatFormu({ belge, hatalar, duzenle }: Props) {
  const baslik = useId()
  const neden = useId()
  return (
    <div role="group" aria-labelledby={baslik} className={stil.saatler}>
      <h2 id={baslik} className={stil.baslik}>{s.baslik}</h2>
      <p className={ortak.not}>{s.not}</p>
      <div className={stil.ikili}>
        <SaatSecimi hangisi="acilis" etiket={s.acilis} belge={belge} hatalar={hatalar} duzenle={duzenle}
          neden={neden} />
        <SaatSecimi hangisi="kapanis" etiket={s.kapanis} belge={belge} hatalar={hatalar} duzenle={duzenle}
          neden={neden} />
      </div>
      <p id={neden} className={ortak.not}>{s.neden}</p>
      <p className={stil.pencere}>{doldur(s.pencere, { pencere: saatAraligi(belge.saatler) })}</p>
    </div>
  )
}

type SecimProps = Props & { hangisi: keyof Saatler; etiket: string; neden: string }

function SaatSecimi({ hangisi, etiket, belge, hatalar, duzenle, neden }: SecimProps) {
  const hataKimlik = useId()
  const [en, ust] = SAAT_SINIRLARI[hangisi]
  const saatler = Array.from({ length: ust - en + 1 }, (_, n) => en + n)
  const hata = hatalar.get(`saatler.${hangisi}`)
  return (
    <label className={ortak.alan}>
      {etiket}
      <select value={belge.saatler[hangisi]} aria-invalid={hata ? true : undefined}
        aria-describedby={[neden, hata && hataKimlik].filter(Boolean).join(' ')}
        onChange={(o) => duzenle((b) => saatAyarla(b, hangisi, Number(o.target.value)))}>
        {saatler.map((saat) => <option key={saat} value={saat}>{saatYaz(saat)}</option>)}
      </select>
      {hata && <span id={hataKimlik} className={ortak.alanHata}>{hata}</span>}
    </label>
  )
}
