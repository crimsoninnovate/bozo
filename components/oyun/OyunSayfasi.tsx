'use client'

import type { ReactNode } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { CamPanel } from '@/components/ui/CamPanel'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { GirisEkrani } from './GirisEkrani'
import { KatilimEkrani } from './KatilimEkrani'
import { Saha } from './Saha'
import { SonucEkrani } from './SonucEkrani'
import { useOdakModu } from './useOdakModu'
import { useOyunAkisi } from './useOyunAkisi'
import stil from './OyunSayfasi.module.css'

/** Ekran geçişi (spec §12): Motion yalnız burada ve sonuç satırlarında; `reducedMotion="user"` kaymayı keser,
 *  opaklık kalır. */
const EKRAN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: 'easeOut' as const },
}

/** `AnimatePresence`'ın doğrudan çocuğu: anahtarlı Motion sarmalı ve cam panel. */
function panel(anahtar: string, dolgu: 'orta' | 'yok', icerik: ReactNode) {
  return (
    <m.div key={anahtar} className={stil.ekran} {...EKRAN}>
      <CamPanel opaklik={0.74} bulanik={false} dolgu={dolgu} className={stil.panel}>
        {icerik}
      </CamPanel>
    </m.div>
  )
}

export function OyunSayfasi({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  const akis = useOyunAkisi()
  useOdakModu(akis.ekran === 'oyun')
  const { tur, son } = akis

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div className={stil.sayfa}>
          {akis.ekran !== 'giris' && <h1 className={stil.gizliBaslik}>{s.oyun.baslik}</h1>}
          <AnimatePresence mode="wait" initial={false}>
            {akis.ekran === 'giris' &&
              panel('giris', 'orta', <GirisEkrani dil={dil} basla={akis.basla} bekliyor={akis.bekliyor} />)}
            {akis.ekran === 'oyun' &&
              tur &&
              panel(
                `oyun-${tur.tohum}`,
                'yok',
                <Saha dil={dil} tohum={tur.tohum} ipucu={tur.ipucu} bitince={akis.bitir} cik={akis.cik} />,
              )}
            {akis.ekran === 'sonuc' &&
              son &&
              panel(
                'sonuc',
                'orta',
                <SonucEkrani
                  dil={dil}
                  sonuc={son.sonuc}
                  onceki={son.onceki}
                  yeni={son.yeni}
                  tekrar={akis.basla}
                  gonderim={akis.gonderim}
                  katil={akis.katil}
                  tekrarDene={akis.tekrarDene}
                />,
              )}
            {akis.ekran === 'katilim' &&
              panel('katilim', 'orta', <KatilimEkrani dil={dil} kaydet={akis.kaydet} vazgec={akis.vazgec} />)}
          </AnimatePresence>
        </div>
      </LazyMotion>
    </MotionConfig>
  )
}
