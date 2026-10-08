'use client'

import { useState } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { KorSahnesi } from '@/components/ember/KorSahnesi'
import { CamPanel } from '@/components/ui/CamPanel'
import { sozluk } from '@/content'
import type { Dil } from '@/content/types'
import { enIyiOku, enIyiYaz, ilkTurBitti, ilkTurMu } from '@/lib/oyun/defter'
import type { Sonuc } from '@/lib/oyun/tipler'
import { Saha } from './Saha'
import { SonucEkrani } from './SonucEkrani'
import stil from './OyunSayfasi.module.css'

type Ekran =
  | { ad: 'giris' }
  | { ad: 'oyun'; tohum: number; ipucu: boolean }
  | { ad: 'sonuc'; sonuc: Sonuc; onceki: number | null; yeni: boolean }

/** Ekran geçişi (spec §12): Motion yalnız burada ve sonuç satırlarında; `reducedMotion="user"` kaymayı keser,
 *  opaklık kalır. */
const EKRAN = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.25, ease: 'easeOut' as const },
}

/** Prototipte tohum tarayıcıda üretilir; sıralamalı turda sunucudan gelecek (spec §7). */
function yeniTohum(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] ?? 1
}

export function OyunSayfasi({ dil }: { dil: Dil }) {
  const s = sozluk(dil)
  const [ekran, setEkran] = useState<Ekran>({ ad: 'giris' })
  const basla = () => setEkran({ ad: 'oyun', tohum: yeniTohum(), ipucu: ilkTurMu() })
  const bitir = (sonuc: Sonuc) => {
    const onceki = enIyiOku()
    const yeni = enIyiYaz(sonuc.puan)
    ilkTurBitti()
    setEkran({ ad: 'sonuc', sonuc, onceki, yeni })
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <KorSahnesi varyant="ic" />
        <main className={stil.sayfa}>
          {ekran.ad !== 'giris' && <h1 className={stil.gizliBaslik}>{s.oyun.baslik}</h1>}
          <AnimatePresence mode="wait" initial={false}>
            {ekran.ad === 'giris' && (
              <m.div key="giris" className={stil.ekran} {...EKRAN}>
                <CamPanel opaklik={0.74} dolgu="orta" bulanik={false} className={stil.panel}>
                  <section className={stil.giris}>
                    <h1 className={stil.baslik}>{s.oyun.baslik}</h1>
                    <p className={stil.cumle}>{s.ana.gece.baslik}</p>
                    <button type="button" className={stil.oyna} onClick={basla}>
                      {s.oyun.oyna}
                    </button>
                  </section>
                </CamPanel>
              </m.div>
            )}
            {ekran.ad === 'oyun' && (
              <m.div key={`oyun-${ekran.tohum}`} className={stil.ekran} {...EKRAN}>
                <CamPanel opaklik={0.74} dolgu="yok" bulanik={false} className={stil.panel}>
                  <Saha dil={dil} tohum={ekran.tohum} ipucu={ekran.ipucu} bitince={bitir} />
                </CamPanel>
              </m.div>
            )}
            {ekran.ad === 'sonuc' && (
              <m.div key="sonuc" className={stil.ekran} {...EKRAN}>
                <CamPanel opaklik={0.74} dolgu="orta" bulanik={false} className={stil.panel}>
                  <SonucEkrani dil={dil} sonuc={ekran.sonuc} onceki={ekran.onceki} yeni={ekran.yeni} tekrar={basla} />
                </CamPanel>
              </m.div>
            )}
          </AnimatePresence>
        </main>
      </LazyMotion>
    </MotionConfig>
  )
}
